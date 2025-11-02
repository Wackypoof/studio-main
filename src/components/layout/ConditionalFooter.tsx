'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname) {
    const hiddenPathPrefixes = ['/dashboard'];
    const hiddenExactPaths = new Set(['/login', '/signup']);
    const matchesHiddenPrefix = hiddenPathPrefixes.some((prefix) => pathname.startsWith(prefix));
    if (matchesHiddenPrefix || hiddenExactPaths.has(pathname)) {
      return null;
    }
  }
  return <Footer />;
}
