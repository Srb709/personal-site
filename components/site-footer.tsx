import Link from 'next/link';
import { Container } from './ui';

export const SiteFooter = () => (
  <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-10">
    <Container>
      <div className="space-y-3 text-sm text-slate-600">
        <p className="font-medium text-slate-900">PA Home Buyer Hub</p>
        <p>Local buyer education for Bucks County, Montgomery County, and Northeast Philadelphia.</p>
        <div className="flex gap-4">
          <Link href="/sitemap.xml" className="hover:text-slate-900">
            Sitemap
          </Link>
          <Link href="/robots.txt" className="hover:text-slate-900">
            Robots
          </Link>
        </div>
      </div>
    </Container>
  </footer>
);
