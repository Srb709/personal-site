import { ContentPage } from '@/components/content-page';
import { getPageBySlug } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('pa-closing-cost-assistance');

export default function ClosingCostPage() {
  const page = getPageBySlug('pa-closing-cost-assistance');
  if (!page) return null;
  return <ContentPage page={page} />;
}
