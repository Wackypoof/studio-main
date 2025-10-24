-- Verification Documents schema
-- Creates table + storage bucket + RLS policies for user verification flow

-- Create enums for verification document types and reuse document_status
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_doc_type') THEN
    CREATE TYPE public.verification_doc_type AS ENUM (
      'identity',               -- government ID
      'business_registration',  -- ACRA/BizFile/incorporation
      'business_address',       -- proof of address
      'bank_verification',      -- bank letter/voided cheque
      'proof_of_funds',         -- bank statement/letter
      'other'
    );
  END IF;
  -- document_status enum created in listings migration; create if missing
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE public.document_status AS ENUM ('pending','verified','rejected');
  END IF;
END $$;

-- verification_documents table
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type public.verification_doc_type NOT NULL,
  status public.document_status NOT NULL DEFAULT 'pending',
  storage_path TEXT NOT NULL, -- path in storage bucket
  file_name TEXT,
  file_size INTEGER,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, storage_path)
);

CREATE INDEX IF NOT EXISTS verification_documents_user_idx ON public.verification_documents(user_id);
CREATE INDEX IF NOT EXISTS verification_documents_status_idx ON public.verification_documents(status);
CREATE INDEX IF NOT EXISTS verification_documents_created_idx ON public.verification_documents(created_at DESC);

-- Keep updated_at fresh
DROP TRIGGER IF EXISTS trg_verification_documents_updated_at ON public.verification_documents;
CREATE TRIGGER trg_verification_documents_updated_at
BEFORE UPDATE ON public.verification_documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- Users: can read their own
DROP POLICY IF EXISTS "Users can read own verification docs" ON public.verification_documents;
CREATE POLICY "Users can read own verification docs"
  ON public.verification_documents
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users: can insert for themselves
DROP POLICY IF EXISTS "Users can insert own verification docs" ON public.verification_documents;
CREATE POLICY "Users can insert own verification docs"
  ON public.verification_documents
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users: can update their own while pending (e.g., filename metadata)
DROP POLICY IF EXISTS "Users can update own pending verification docs" ON public.verification_documents;
CREATE POLICY "Users can update own pending verification docs"
  ON public.verification_documents
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- Users: can delete their own while pending
DROP POLICY IF EXISTS "Users can delete own pending verification docs" ON public.verification_documents;
CREATE POLICY "Users can delete own pending verification docs"
  ON public.verification_documents
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending');

-- Service role: full access for admin APIs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='verification_documents' AND policyname='Service role select verification docs'
  ) THEN
    CREATE POLICY "Service role select verification docs"
      ON public.verification_documents FOR SELECT TO service_role
      USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='verification_documents' AND policyname='Service role insert verification docs'
  ) THEN
    CREATE POLICY "Service role insert verification docs"
      ON public.verification_documents FOR INSERT TO service_role
      WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='verification_documents' AND policyname='Service role update verification docs'
  ) THEN
    CREATE POLICY "Service role update verification docs"
      ON public.verification_documents FOR UPDATE TO service_role
      USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='verification_documents' AND policyname='Service role delete verification docs'
  ) THEN
    CREATE POLICY "Service role delete verification docs"
      ON public.verification_documents FOR DELETE TO service_role
      USING (true);
  END IF;
END $$;

-- Storage bucket for verification documents (private)
INSERT INTO storage.buckets (id, name, public)
SELECT 'verification-documents', 'verification-documents', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'verification-documents');

-- Storage policies
DO $$ BEGIN
  -- Authenticated users can read/write their own objects under user_id prefix
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Authenticated read own verification documents'
  ) THEN
    CREATE POLICY "Authenticated read own verification documents"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'verification-documents' AND name LIKE auth.uid()::text || '/%');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Authenticated write own verification documents'
  ) THEN
    CREATE POLICY "Authenticated write own verification documents"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'verification-documents' AND name LIKE auth.uid()::text || '/%');
  END IF;
END $$;

