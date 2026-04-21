import Link from 'next/link';
import { Container } from './ui';

export const SiteFooter = () => (
  <footer className="mt-20 border-t border-[#2f271c] bg-black py-14">
    <Container>
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <p className="font-serif text-2xl text-white">Steven Brooks</p>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-300">
            Luxury-level guidance for Pennsylvania home buyers focused on Bucks County, Montgomery County, and Northeast
            Philadelphia.
          </p>
          <a href="tel:215-779-9288" className="inline-block text-base text-[#c9a86a] transition hover:text-[#dcc08c]">
            215-779-9288
          </a>
        </div>

        <div className="space-y-3 text-sm text-neutral-300 md:justify-self-end md:text-right">
          <p className="font-medium uppercase tracking-[0.2em] text-neutral-400">Explore</p>
          <div className="space-y-2">
            <p>
              <Link href="/pa-first-time-home-buyer-grants" className="transition hover:text-white">
                PA Buyer Grants
              </Link>
            </p>
            <p>
              <Link href="/pa-closing-cost-assistance" className="transition hover:text-white">
                Closing Cost Assistance
              </Link>
            </p>
            <p>
              <Link href="/how-much-house-can-i-afford-pa" className="transition hover:text-white">
                Affordability Guide
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  </footer>
);
