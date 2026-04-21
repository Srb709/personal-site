import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AnalyticsTracker } from '@/components/analytics-tracker';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Pennsylvania Home Buyer SEO Hub',
    template: '%s | Pennsylvania Home Buyer SEO Hub'
  },
  description: 'Real estate buyer guides focused on Bucks County, Montgomery County, and Northeast Philadelphia.',
  openGraph: {
    title: 'Pennsylvania Home Buyer SEO Hub',
    description: 'Local buyer guides and financing help for PA home shoppers.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
