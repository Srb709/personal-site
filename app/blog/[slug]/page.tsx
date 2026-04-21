import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/content-page';
import { allPages, getPageBySlug } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  return allPages
    .filter((page) => page.slug.startsWith('blog/'))
    .map((page) => ({ slug: page.slug.replace('blog/', '') }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return buildMetadata(`blog/${params.slug}`);
}

export default function BlogPage({ params }: { params: { slug: string } }) {
  const page = getPageBySlug(`blog/${params.slug}`);
  if (!page) return notFound();
  return <ContentPage page={page} />;
}
