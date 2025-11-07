-- Create additional buyer engagement tables: saved listings, offers, and buyer leads

-- Enum for offer status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'offer_status'
  ) THEN
    CREATE TYPE public.offer_status AS ENUM (
      'pending',
      'accepted',
      'rejected',
      'expired',
      'withdrawn'
    );
  END IF;
END $$;

-- Enum for buyer lead status (matches dashboard filters)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'buyer_lead_status'
  ) THEN
    CREATE TYPE public.buyer_lead_status AS ENUM (
      'new',
      'contacted',
      'qualified',
      'proposal_sent',
      'negotiation',
      'closed_won',
      'closed_lost'
    );
  END IF;
END $$;

-- Enum for buyer lead sources
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'buyer_lead_source'
  ) THEN
    CREATE TYPE public.buyer_lead_source AS ENUM (
      'website',
      'referral',
      'social_media',
      'email',
      'phone',
      'event',
      'other'
    );
  END IF;
END $$;

-- Saved listings join table
CREATE TABLE IF NOT EXISTS public.buyer_saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (buyer_id, listing_id)
);

CREATE INDEX IF NOT EXISTS buyer_saved_listings_buyer_idx
  ON public.buyer_saved_listings (buyer_id);
CREATE INDEX IF NOT EXISTS buyer_saved_listings_listing_idx
  ON public.buyer_saved_listings (listing_id);

ALTER TABLE public.buyer_saved_listings ENABLE ROW LEVEL SECURITY;

-- Buyers can manage their saved listings
DROP POLICY IF EXISTS "buyers_select_saved_listings" ON public.buyer_saved_listings;
CREATE POLICY "buyers_select_saved_listings"
  ON public.buyer_saved_listings
  FOR SELECT
  USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "buyers_insert_saved_listings" ON public.buyer_saved_listings;
CREATE POLICY "buyers_insert_saved_listings"
  ON public.buyer_saved_listings
  FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "buyers_delete_saved_listings" ON public.buyer_saved_listings;
CREATE POLICY "buyers_delete_saved_listings"
  ON public.buyer_saved_listings
  FOR DELETE
  USING (buyer_id = auth.uid());

-- Offers table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  offer_amount NUMERIC(18,2) NOT NULL,
  listing_price NUMERIC(18,2),
  status public.offer_status NOT NULL DEFAULT 'pending',
  message TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS offers_listing_idx ON public.offers (listing_id);
CREATE INDEX IF NOT EXISTS offers_buyer_idx ON public.offers (buyer_id);
CREATE INDEX IF NOT EXISTS offers_seller_idx ON public.offers (seller_id);
CREATE INDEX IF NOT EXISTS offers_status_idx ON public.offers (status);

-- Fallback helper used when public.set_updated_at is unavailable
CREATE OR REPLACE FUNCTION public.set_offer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger (use existing set_updated_at if available, otherwise fallback)
DO $$
BEGIN
  DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.proname = 'set_updated_at'
      AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER trg_offers_updated_at
      BEFORE UPDATE ON public.offers
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  ELSE
    CREATE TRIGGER trg_offers_updated_at
      BEFORE UPDATE ON public.offers
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_offer_updated_at();
  END IF;
END $$;

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "buyer_select_offers" ON public.offers;
CREATE POLICY "buyer_select_offers"
  ON public.offers
  FOR SELECT
  USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "seller_select_offers" ON public.offers;
CREATE POLICY "seller_select_offers"
  ON public.offers
  FOR SELECT
  USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "buyer_insert_offers" ON public.offers;
CREATE POLICY "buyer_insert_offers"
  ON public.offers
  FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "buyer_update_offers" ON public.offers;
CREATE POLICY "buyer_update_offers"
  ON public.offers
  FOR UPDATE
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "seller_update_offers" ON public.offers;
CREATE POLICY "seller_update_offers"
  ON public.offers
  FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Buyer leads table
CREATE TABLE IF NOT EXISTS public.buyer_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  buyer_company TEXT,
  buyer_position TEXT,
  status public.buyer_lead_status NOT NULL DEFAULT 'new',
  source public.buyer_lead_source NOT NULL DEFAULT 'website',
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS buyer_leads_seller_idx ON public.buyer_leads (seller_id);
CREATE INDEX IF NOT EXISTS buyer_leads_listing_idx ON public.buyer_leads (listing_id);
CREATE INDEX IF NOT EXISTS buyer_leads_status_idx ON public.buyer_leads (status);
CREATE INDEX IF NOT EXISTS buyer_leads_buyer_idx ON public.buyer_leads (buyer_id);

DROP TRIGGER IF EXISTS trg_buyer_leads_updated_at ON public.buyer_leads;
CREATE TRIGGER trg_buyer_leads_updated_at
  BEFORE UPDATE ON public.buyer_leads
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

ALTER TABLE public.buyer_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seller_select_leads" ON public.buyer_leads;
CREATE POLICY "seller_select_leads"
  ON public.buyer_leads
  FOR SELECT
  USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "seller_manage_leads" ON public.buyer_leads;
CREATE POLICY "seller_manage_leads"
  ON public.buyer_leads
  FOR ALL
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());
