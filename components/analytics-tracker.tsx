'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const AnalyticsTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname === '/' ? 'home' : pathname.replace(/^\//, '') })
    }).catch(() => undefined);
  }, [pathname]);

  return null;
};
