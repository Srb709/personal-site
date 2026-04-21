import { ContentPage } from '@/components/content-page';
import { getPageBySlug } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('pa-first-time-home-buyer-grants');

export default function GrantsPage() {
  const page = getPageBySlug('pa-first-time-home-buyer-grants');
  if (!page) return null;
  return <ContentPage page={page} />;
}
