import Link from 'next/link';
import { Container } from './ui';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/bucks-county-pa', label: 'Bucks County' },
  { href: '/montgomery-county-pa', label: 'Montgomery County' },
  { href: '/northeast-philadelphia', label: 'Northeast Philadelphia' },
  { href: '/pa-first-time-home-buyer-grants', label: 'Buyer Grants' }
];

export const SiteHeader = () => (
  <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
    <Container>
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          PA Home Buyer Hub
        </Link>
        <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-2 py-1 hover:bg-slate-100 hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </Container>
  </header>
);
