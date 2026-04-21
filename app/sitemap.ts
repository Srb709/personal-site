import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    ...getAllSlugs().map((slug) => {
      const changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = slug.startsWith('blog/') ? 'weekly' : 'monthly';
      return {
        url: `${siteUrl}/${slug}`,
        lastModified: now,
        changeFrequency,
        priority: slug.includes('/') ? 0.7 : 0.8
      };
    })
  ];
}
