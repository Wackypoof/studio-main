/**
 * Format currency with appropriate suffix (k, m)
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., $1.2m, $1.5k)
 */
export const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}m`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}k`;
  }
  return `$${amount}`;
};

/**
 * Format date string to a readable format
 * @param dateString - ISO date string (optional)
 * @param fallback - Value to return when the date is missing or invalid
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export const formatDate = (
  dateString?: string | null,
  fallback = '—'
): string => {
  if (!dateString) return fallback;

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return fallback;

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return parsed.toLocaleDateString('en-US', options);
};

/**
 * Calculate profit margin safely with zero division check
 * @param revenue - Total revenue
 * @param profit - Total profit
 * @returns Profit margin as a percentage (0-100)
 */
export const calculateProfitMargin = (revenue: number, profit: number): number => {
  return revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
};

/**
 * Calculate valuation multiple safely with zero division check
 * @param askingPrice - The asking price
 * @param profit - Annual profit
 * @returns Formatted multiple as string or "N/A" if profit is zero
 */
export const calculateMultiple = (askingPrice: number, profit: number): string => {
  return profit > 0 ? (askingPrice / profit).toFixed(1) : 'N/A';
};
