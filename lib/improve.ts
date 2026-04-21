import { allPages } from './content';
import { AnalyticsData } from './types';

export const generateImprovementReport = (analytics: AnalyticsData) => {
  const visitEntries = Object.entries(analytics.visits).sort((a, b) => b[1] - a[1]);

  const topPages = visitEntries.slice(0, 5).map(([slug, visits]) => ({ slug, visits }));

  const noTraffic = allPages.filter((page) => !(analytics.visits[page.slug] ?? 0)).map((page) => page.slug);

  const pagesWithLeads = allPages
    .filter((page) => (analytics.leads[page.slug] ?? 0) > 0)
    .map((page) => ({ slug: page.slug, leads: analytics.leads[page.slug] ?? 0 }));

  const topicSignals = topPages.map((page) => page.slug.split('/').slice(0, 2).join('/'));
  const uniqueSignals = [...new Set(topicSignals)];

  const generatedSuggestions = uniqueSignals.map((signal, idx) => ({
    slug: `blog/${signal.replace('/', '-')}-deep-dive-${idx + 1}`,
    reason: `Based on above-average traffic for ${signal}, create a deeper follow-up guide.`
  }));

  const weakPages = allPages
    .filter((page) => (analytics.visits[page.slug] ?? 0) < 2 && (analytics.leads[page.slug] ?? 0) === 0)
    .slice(0, 10)
    .map((page) => ({ slug: page.slug, action: 'Rewrite intro and FAQ to better match search intent.' }));

  return { topPages, noTraffic, pagesWithLeads, generatedSuggestions, weakPages };
};
