import Link from 'next/link';
import { Container, Heading, Section } from '@/components/ui';
import { allPages } from '@/lib/content';
import { generateImprovementReport } from '@/lib/improve';
import { getAnalytics } from '@/lib/storage';

export const metadata = {
  title: 'SEO Analytics Dashboard',
  description: 'Internal analytics and content optimization dashboard'
};

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();
  const report = generateImprovementReport(analytics);

  return (
    <Section className="bg-black">
      <Container>
        <Heading title="SEO Analytics Dashboard" subtitle="Visits, lead conversion, and self-improvement suggestions." />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-5">
            <h2 className="font-serif text-xl text-white">Top Visited Pages</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              {report.topPages.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${item.slug}`} className="text-[#c9a86a] hover:underline">
                    /{item.slug}
                  </Link>{' '}
                  ({item.visits})
                </li>
              ))}
              {report.topPages.length === 0 ? <li>No traffic data yet.</li> : null}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-5">
            <h2 className="font-serif text-xl text-white">Pages Generating Leads</h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              {report.pagesWithLeads.map((item) => (
                <li key={item.slug}>/{item.slug} ({item.leads} leads)</li>
              ))}
              {report.pagesWithLeads.length === 0 ? <li>No lead pages yet.</li> : null}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-5">
            <h2 className="font-serif text-xl text-white">No Traffic Pages</h2>
            <p className="mt-2 text-xs text-neutral-400">
              {report.noTraffic.length} of {allPages.length} pages currently have no visits.
            </p>
            <ul className="mt-3 max-h-52 space-y-1 overflow-y-auto text-sm text-neutral-300">
              {report.noTraffic.slice(0, 30).map((slug) => (
                <li key={slug}>/{slug}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-5">
            <h2 className="font-serif text-xl text-white">Auto-Generated New Page Ideas</h2>
            <ul className="mt-3 space-y-3 text-sm text-neutral-300">
              {report.generatedSuggestions.map((item) => (
                <li key={item.slug}>
                  <p className="font-medium text-white">/{item.slug}</p>
                  <p>{item.reason}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-5">
            <h2 className="font-serif text-xl text-white">Weak Pages to Rewrite</h2>
            <ul className="mt-3 space-y-3 text-sm text-neutral-300">
              {report.weakPages.map((item) => (
                <li key={item.slug}>
                  <p className="font-medium text-white">/{item.slug}</p>
                  <p>{item.action}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
