export type PricingInputs = {
  industry: string
  profit?: number | null
}

export function suggestMultiple(industry: string, profit?: number | null): number | null {
  const i = (industry || '').toLowerCase()
  if (!profit || profit <= 0) return null
  if (i.includes('saas')) return 3.5
  if (i.includes('ecom') || i.includes('commerce')) return 2.5
  if (i.includes('content') || i.includes('media')) return 2.0
  return 2.8
}

export function suggestPrice({ industry, profit }: PricingInputs): number | null {
  const m = suggestMultiple(industry, profit)
  if (m == null) return null
  return Math.round((profit! * m) * 100) / 100
}

