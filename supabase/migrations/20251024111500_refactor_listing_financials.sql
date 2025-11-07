-- Refactor: move financial fields from public.listings into child table public.listing_financials
-- Creates child table, migrates existing data, drops old columns, adds latest-financials view, and applies RLS.

-- 1) Create child table for financials
CREATE TABLE IF NOT EXISTS public.listing_financials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  revenue NUMERIC(18,2),
  profit NUMERIC(18,2),
  assets NUMERIC(18,2),
  liabilities NUMERIC(18,2),
  asking_price NUMERIC(18,2),
  valuation_multiple NUMERIC(10,2),
  growth_rate NUMERIC(6,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (listing_id, fiscal_year)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS listing_financials_listing_idx ON public.listing_financials(listing_id);
CREATE INDEX IF NOT EXISTS listing_financials_year_idx ON public.listing_financials(fiscal_year);

-- Ensure updated_at tracks changes
DROP TRIGGER IF EXISTS trg_listing_financials_updated_at ON public.listing_financials;
CREATE TRIGGER trg_listing_financials_updated_at
BEFORE UPDATE ON public.listing_financials
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2) Migrate existing data from public.listings into public.listing_financials (one record per listing for created year)
--    Avoid duplicates if re-run.
INSERT INTO public.listing_financials (
  listing_id, fiscal_year, currency, revenue, profit, assets, asking_price, valuation_multiple, growth_rate
)
SELECT l.id,
       EXTRACT(YEAR FROM l.created_at)::int AS fiscal_year,
       COALESCE(NULLIF(l_data->>'currency', ''), 'USD')::CHAR(3) AS currency,
       NULLIF(l_data->>'revenue', '')::NUMERIC(18,2) AS revenue,
       NULLIF(l_data->>'profit', '')::NUMERIC(18,2) AS profit,
       NULLIF(l_data->>'assets', '')::NUMERIC(18,2) AS assets,
       NULLIF(l_data->>'asking_price', '')::NUMERIC(18,2) AS asking_price,
       NULLIF(l_data->>'valuation_multiple', '')::NUMERIC(10,2) AS valuation_multiple,
       NULLIF(l_data->>'growth_rate', '')::NUMERIC(6,2) AS growth_rate
FROM public.listings l
CROSS JOIN LATERAL to_jsonb(l) AS l_data
WHERE (
  NULLIF(l_data->>'revenue', '') IS NOT NULL OR
  NULLIF(l_data->>'profit', '') IS NOT NULL OR
  NULLIF(l_data->>'assets', '') IS NOT NULL OR
  NULLIF(l_data->>'asking_price', '') IS NOT NULL OR
  NULLIF(l_data->>'valuation_multiple', '') IS NOT NULL OR
  NULLIF(l_data->>'growth_rate', '') IS NOT NULL
)
AND NOT EXISTS (
  SELECT 1 FROM public.listing_financials f
  WHERE f.listing_id = l.id AND f.fiscal_year = EXTRACT(YEAR FROM l.created_at)::int
);

-- 3) Drop old financial columns from public.listings after migration
ALTER TABLE public.listings
  DROP COLUMN IF EXISTS currency,
  DROP COLUMN IF EXISTS revenue,
  DROP COLUMN IF EXISTS profit,
  DROP COLUMN IF EXISTS assets,
  DROP COLUMN IF EXISTS asking_price,
  DROP COLUMN IF EXISTS valuation_multiple,
  DROP COLUMN IF EXISTS growth_rate;

-- 4) View: latest available financials per listing
CREATE OR REPLACE VIEW public.listing_latest_financials AS
SELECT DISTINCT ON (listing_id)
  listing_id, fiscal_year, currency, revenue, profit, assets, asking_price, valuation_multiple, growth_rate
FROM public.listing_financials
ORDER BY listing_id, fiscal_year DESC;

-- 5) Update helper depending on financials: listing_is_publishable now checks latest financials for asking_price
CREATE OR REPLACE FUNCTION public.listing_is_publishable(p_listing_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.listings l
    LEFT JOIN public.listing_latest_financials f ON f.listing_id = l.id
    WHERE l.id = p_listing_id
      AND l.name IS NOT NULL
      AND l.industry IS NOT NULL
      AND coalesce(l.description,'') <> ''
      AND f.asking_price IS NOT NULL
  );
END; $$ LANGUAGE plpgsql STABLE;

-- 6) RLS for listing_financials: owners can manage their records
ALTER TABLE public.listing_financials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can manage their listing financials" ON public.listing_financials;
CREATE POLICY "Owners can manage their listing financials"
  ON public.listing_financials
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_financials.listing_id AND l.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = listing_financials.listing_id AND l.owner_id = auth.uid()
    )
  );
