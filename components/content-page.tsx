import Link from 'next/link';
import { getRelatedPages } from '@/lib/content';
import { PageContent } from '@/lib/types';
import { Container, Heading, Section } from './ui';
import { LeadForm } from './lead-form';

export const ContentPage = ({ page }: { page: PageContent }) => {
  const related = getRelatedPages(page.slug);

  return (
    <>
      <Section>
        <Container>
          <Heading title={page.title} subtitle={page.description} />
          <p className="mb-8 max-w-3xl text-slate-700">{page.intro}</p>
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <article className="space-y-8">
              {page.sections.map((section) => (
                <section key={section.heading} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">{section.heading}</h2>
                  <ul className="list-disc space-y-2 pl-6 text-slate-700">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </section>
              ))}

              <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">FAQs</h2>
                {page.faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="font-medium text-slate-900">{item.question}</h3>
                    <p className="text-slate-700">{item.answer}</p>
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Related Guides</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 hover:border-brand-500"
                    >
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 line-clamp-2">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </article>
            <aside className="lg:sticky lg:top-6 lg:h-max">
              <LeadForm page={page.slug} />
            </aside>
          </div>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: page.faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer }
            }))
          })
        }}
      />
    </>
  );
};
