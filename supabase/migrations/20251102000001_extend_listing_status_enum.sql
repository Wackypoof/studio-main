-- Extend listing_status enum to preserve app state fidelity
-- Previously: draft, active, sold, withdrawn
-- Now adding: pending, paused, under_offer
-- This prevents data loss when round-tripping app states through the database

-- Add new enum values to listing_status
DO $$ 
BEGIN
  -- Add 'pending' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'public.listing_status'::regtype 
    AND enumlabel = 'pending'
  ) THEN
    ALTER TYPE public.listing_status ADD VALUE 'pending';
  END IF;

  -- Add 'paused' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'public.listing_status'::regtype 
    AND enumlabel = 'paused'
  ) THEN
    ALTER TYPE public.listing_status ADD VALUE 'paused';
  END IF;

  -- Add 'under_offer' if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumtypid = 'public.listing_status'::regtype 
    AND enumlabel = 'under_offer'
  ) THEN
    ALTER TYPE public.listing_status ADD VALUE 'under_offer';
  END IF;
END $$;

-- Migrate existing 'withdrawn' listings based on meta field if available
-- This is a best-effort migration; records without distinguishing metadata will stay as 'withdrawn'
UPDATE public.listings
SET status = CASE
  WHEN meta->>'app_status' = 'pending' THEN (meta->>'app_status')::public.listing_status
  WHEN meta->>'app_status' = 'paused' THEN (meta->>'app_status')::public.listing_status
  WHEN meta->>'app_status' = 'under_offer' THEN (meta->>'app_status')::public.listing_status
  ELSE status
END
WHERE status = 'withdrawn' 
  AND meta->>'app_status' IN ('pending', 'paused', 'under_offer');

-- Note: The enum now has the following values:
-- 'draft', 'active', 'sold', 'withdrawn', 'pending', 'paused', 'under_offer'
-- The 'withdrawn' value is kept for backward compatibility and migration purposes
