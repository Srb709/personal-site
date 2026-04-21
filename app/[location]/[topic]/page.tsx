import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/content-page';
import { allPages, getPageBySlug, locationHubSlugs } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return allPages
    .filter((page) => {
      const parts = page.slug.split('/');
      return parts.length === 2 && new Set<string>(locationHubSlugs).has(parts[0]);
    })
    .map((page) => {
      const [location, topic] = page.slug.split('/');
      return { location, topic };
    });
}

export function generateMetadata({ params }: { params: { location: string; topic: string } }) {
  return buildMetadata(`${params.location}/${params.topic}`);
}

export default function LocationTopicPage({ params }: { params: { location: string; topic: string } }) {
  const page = getPageBySlug(`${params.location}/${params.topic}`);
  if (!page) return notFound();
  return <ContentPage page={page} />;
}
