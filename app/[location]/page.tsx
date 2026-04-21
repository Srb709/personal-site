import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/content-page';
import { getPageBySlug, locationHubSlugs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return locationHubSlugs.map((location) => ({ location }));
}

export function generateMetadata({ params }: { params: { location: string } }) {
  return buildMetadata(params.location);
}

export default function LocationHubPage({ params }: { params: { location: string } }) {
  const page = getPageBySlug(params.location);
  if (!page) return notFound();
  return <ContentPage page={page} />;
}
