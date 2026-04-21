import { ContentPage } from '@/components/content-page';
import { getPageBySlug } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('how-much-house-can-i-afford-pa');

export default function AffordabilityPage() {
  const page = getPageBySlug('how-much-house-can-i-afford-pa');
  if (!page) return null;
  return <ContentPage page={page} />;
}
