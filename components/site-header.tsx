'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from './ui';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/bucks-county-pa', label: 'Bucks County' },
  { href: '/montgomery-county-pa', label: 'Montgomery County' },
  { href: '/northeast-philadelphia', label: 'Northeast Philadelphia' },
  { href: '/pa-first-time-home-buyer-grants', label: 'Buyer Grants' }
];

export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#2f271c] bg-[#040404]/95 backdrop-blur">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="space-y-1">
            <Link href="/" className="font-serif text-2xl tracking-wide text-white">
              Steven Brooks
            </Link>
            <a href="tel:215-779-9288" className="block text-sm text-[#c9a86a] transition hover:text-[#dcc08c]">
              215-779-9288
            </a>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-neutral-200">
            {nav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b pb-1 transition ${
                    isActive
                      ? 'border-[#c9a86a] text-[#c9a86a]'
                      : 'border-transparent text-neutral-200 hover:border-[#8f7442] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </header>
  );
};
