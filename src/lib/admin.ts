export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const sources = [
    process.env.ADMIN_EMAILS,
    process.env.NEXT_PUBLIC_ADMIN_EMAILS,
  ]
    .filter(Boolean)
    .join(',');

  const allowList = sources
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (allowList.length === 0) return false;
  return allowList.includes(email.toLowerCase());
}
