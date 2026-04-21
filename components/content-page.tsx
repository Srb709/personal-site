import Link from 'next/link';
import { getRelatedPages } from '@/lib/content';
import { PageContent } from '@/lib/types';
import { Container, Heading, Section } from './ui';
import { LeadForm } from './lead-form';

export const ContentPage = ({ page }: { page: PageContent }) => {
  const related = getRelatedPages(page.slug);

  return (
    <>
      <Section className="bg-black">
        <Container>
          <Heading title={page.title} subtitle={page.description} />
          <p className="mb-10 max-w-3xl text-neutral-300">{page.intro}</p>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <article className="space-y-8">
              {page.sections.map((section) => (
                <section key={section.heading} className="space-y-4 rounded-2xl border border-[#2f271c] bg-[#080808] p-7">
                  <h2 className="font-serif text-2xl text-white">{section.heading}</h2>
                  <ul className="list-disc space-y-2 pl-6 text-neutral-300 marker:text-[#c9a86a]">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </section>
              ))}

              <section className="space-y-5 rounded-2xl border border-[#2f271c] bg-[#080808] p-7">
                <h2 className="font-serif text-2xl text-white">FAQs</h2>
                {page.faq.map((item) => (
                  <div key={item.question} className="border-t border-[#201a13] pt-4 first:border-t-0 first:pt-0">
                    <h3 className="font-semibold text-white">{item.question}</h3>
                    <p className="mt-2 text-neutral-300">{item.answer}</p>
                  </div>
                ))}
              </section>

              <section className="space-y-4 rounded-2xl border border-[#2f271c] bg-[#080808] p-7">
                <h2 className="font-serif text-2xl text-white">Related Guides</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className="rounded-xl border border-[#2f271c] bg-[#0d0d0d] p-4 text-sm text-neutral-300 transition hover:border-[#c9a86a]"
                    >
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 line-clamp-2">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </article>

            <aside className="lg:sticky lg:top-28 lg:h-max">
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
