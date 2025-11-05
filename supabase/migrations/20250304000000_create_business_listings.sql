-- Business Listings core schema
-- Tables:
--  - listings
--  - listing_documents
--  - listing_photos
--  - helper functions and policies

-- Create enums for statuses and document metadata
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status') THEN
    CREATE TYPE public.listing_status AS ENUM ('draft','active','sold','withdrawn');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE public.document_status AS ENUM ('pending','verified','rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
    CREATE TYPE public.document_type AS ENUM (
      'financial_statement','legal_doc','tax_return','photo','other'
    );
  END IF;
END $$;

-- Back-reference: conversations.listing_id -> listings.id (if conversations table exists)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='conversations' AND column_name='listing_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.key_column_usage k
    JOIN information_schema.table_constraints c ON c.constraint_name = k.constraint_name AND c.table_schema = k.table_schema
    WHERE k.table_schema='public' AND k.table_name='conversations' AND k.column_name='listing_id' AND c.constraint_type='FOREIGN KEY'
  ) THEN
    ALTER TABLE public.conversations
      ADD CONSTRAINT conversations_listing_id_fkey
      FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE SET NULL;
  END IF;
END $$;

-- listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Business details
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT NOT NULL,
  subindustry TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  years_established INTEGER,
  -- Financial data (assume annual figures)
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  revenue NUMERIC(18,2),
  profit NUMERIC(18,2),
  assets NUMERIC(18,2),
  asking_price NUMERIC(18,2),
  valuation_multiple NUMERIC(10,2),
  -- Operational metrics
  employees INTEGER,
  customers INTEGER,
  growth_rate NUMERIC(6,2), -- percentage (e.g., 12.50)
  -- Status and metadata
  status public.listing_status NOT NULL DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}',
  meta JSONB DEFAULT '{}'::jsonb,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS listings_owner_id_idx ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS listings_status_idx ON public.listings(status);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON public.listings(created_at DESC);

-- Ensure updated_at tracks changes
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_listings_updated_at ON public.listings;
CREATE TRIGGER trg_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- listing_documents table
CREATE TABLE IF NOT EXISTS public.listing_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type public.document_type NOT NULL,
  status public.document_status NOT NULL DEFAULT 'pending',
  storage_path TEXT NOT NULL, -- path in storage bucket
  file_name TEXT,
  file_size INTEGER,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, storage_path)
);

CREATE INDEX IF NOT EXISTS listing_documents_listing_idx ON public.listing_documents(listing_id);
CREATE INDEX IF NOT EXISTS listing_documents_status_idx ON public.listing_documents(status);

DROP TRIGGER IF EXISTS trg_listing_documents_updated_at ON public.listing_documents;
CREATE TRIGGER trg_listing_documents_updated_at
BEFORE UPDATE ON public.listing_documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- listing_photos table
CREATE TABLE IF NOT EXISTS public.listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT, -- optional cached public URL
  alt TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (listing_id, storage_path)
);

CREATE INDEX IF NOT EXISTS listing_photos_listing_idx ON public.listing_photos(listing_id);
CREATE INDEX IF NOT EXISTS listing_photos_primary_idx ON public.listing_photos(listing_id, is_primary) WHERE is_primary;

DROP TRIGGER IF EXISTS trg_listing_photos_updated_at ON public.listing_photos;
CREATE TRIGGER trg_listing_photos_updated_at
BEFORE UPDATE ON public.listing_photos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Simple pricing helper: suggest valuation multiple by industry
CREATE OR REPLACE FUNCTION public.suggest_multiple(p_industry TEXT, p_profit NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
  base_multiple NUMERIC := 2.8; -- default
BEGIN
  IF p_industry ILIKE '%saas%' THEN
    base_multiple := 3.5;
  ELSIF p_industry ILIKE '%ecom%' OR p_industry ILIKE '%commerce%' THEN
    base_multiple := 2.5;
  ELSIF p_industry ILIKE '%content%' OR p_industry ILIKE '%media%' THEN
    base_multiple := 2.0;
  END IF;
  IF coalesce(p_profit,0) <= 0 THEN
    RETURN NULL; -- don't suggest if not profitable
  END IF;
  RETURN round(base_multiple::numeric, 2);
END; $$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.suggest_price(p_industry TEXT, p_profit NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
  m NUMERIC;
BEGIN
  m := public.suggest_multiple(p_industry, p_profit);
  IF m IS NULL THEN RETURN NULL; END IF;
  RETURN round((p_profit * m)::numeric, 2);
END; $$ LANGUAGE plpgsql STABLE;

-- Validate if a listing is publishable (basic checks)
CREATE OR REPLACE FUNCTION public.listing_is_publishable(p_listing_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.listings l
    WHERE l.id = p_listing_id
      AND l.name IS NOT NULL
      AND l.industry IS NOT NULL
      AND coalesce(l.description,'') <> ''
      AND l.asking_price IS NOT NULL
  );
END; $$ LANGUAGE plpgsql STABLE;

-- RLS: enable
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;

-- Listings policies
DROP POLICY IF EXISTS "Public can view active listings" ON public.listings;
CREATE POLICY "Public can view active listings"
  ON public.listings
  FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Owners can view their listings" ON public.listings;
CREATE POLICY "Owners can view their listings"
  ON public.listings
  FOR SELECT
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can insert listings" ON public.listings;
CREATE POLICY "Owners can insert listings"
  ON public.listings
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can update their listings" ON public.listings;
CREATE POLICY "Owners can update their listings"
  ON public.listings
  FOR UPDATE
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete draft listings" ON public.listings;
CREATE POLICY "Owners can delete draft listings"
  ON public.listings
  FOR DELETE
  USING (owner_id = auth.uid() AND status = 'draft');

-- Documents policies (owner access; service role unrestricted via bypass)
DROP POLICY IF EXISTS "Owners can read listing documents" ON public.listing_documents;
CREATE POLICY "Owners can read listing documents"
  ON public.listing_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_documents.listing_id
        AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can add listing documents" ON public.listing_documents;
CREATE POLICY "Owners can add listing documents"
  ON public.listing_documents
  FOR INSERT
  WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can update their documents" ON public.listing_documents;
CREATE POLICY "Owners can update their documents"
  ON public.listing_documents
  FOR UPDATE
  USING (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_documents.listing_id AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can delete their documents" ON public.listing_documents;
CREATE POLICY "Owners can delete their documents"
  ON public.listing_documents
  FOR DELETE
  USING (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_documents.listing_id AND l.owner_id = auth.uid()
    )
  );

-- Photos policies
DROP POLICY IF EXISTS "Public can view photos for active listings" ON public.listing_photos;
CREATE POLICY "Public can view photos for active listings"
  ON public.listing_photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_photos.listing_id AND l.status = 'active'
    ) OR EXISTS (
      SELECT 1 FROM public.listings l2
      WHERE l2.id = listing_photos.listing_id AND l2.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can add photos" ON public.listing_photos;
CREATE POLICY "Owners can add photos"
  ON public.listing_photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_id AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can update photos" ON public.listing_photos;
CREATE POLICY "Owners can update photos"
  ON public.listing_photos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_photos.listing_id AND l.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can delete photos" ON public.listing_photos;
CREATE POLICY "Owners can delete photos"
  ON public.listing_photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_photos.listing_id AND l.owner_id = auth.uid()
    )
  );

-- Create storage buckets (if not present) for photos and documents
INSERT INTO storage.buckets (id, name, public)
SELECT 'listing-photos', 'listing-photos', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'listing-photos');

INSERT INTO storage.buckets (id, name, public)
SELECT 'listing-documents', 'listing-documents', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'listing-documents');

-- Basic storage policies
-- Photos: allow public read; authenticated can upload
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read listing photos'
  ) THEN
    CREATE POLICY "Public read listing photos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'listing-photos');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Authenticated write listing photos'
  ) THEN
    CREATE POLICY "Authenticated write listing photos"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'listing-photos');
  END IF;
END $$;

-- Documents: authenticated read/write (private bucket); tighten later if needed
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Authenticated read own listing documents'
  ) THEN
    CREATE POLICY "Authenticated read own listing documents"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'listing-documents' AND name LIKE auth.uid()::text || '/%');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Authenticated write own listing documents'
  ) THEN
    CREATE POLICY "Authenticated write own listing documents"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'listing-documents' AND name LIKE auth.uid()::text || '/%');
  END IF;
END $$;
