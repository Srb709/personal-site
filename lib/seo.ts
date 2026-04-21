import { Metadata } from 'next';
import { getPageBySlug } from './content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const buildMetadata = (slug: string): Metadata => {
  const page = getPageBySlug(slug);
  if (!page) {
    return { title: 'Pennsylvania Home Buyer Guides', description: 'Local home buyer help for Bucks County, Montco, and Northeast Philadelphia.' };
  }

  const url = `${siteUrl}/${slug}`.replace(/\/blog\//, '/blog/');

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: 'PA Home Buyer Hub',
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description
    }
  };
};
