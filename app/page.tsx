import Link from 'next/link';
import { allPages, locationHubSlugs } from '@/lib/content';
import { Container, Heading, Section, Card, LinkButton } from '@/components/ui';
import { LeadForm } from '@/components/lead-form';

const featuredBlogs = allPages.filter((p) => p.slug.startsWith('blog/')).slice(0, 9);

export default function HomePage() {
  return (
    <>
      <Section>
        <Container>
          <Heading
            title="Pennsylvania Home Buyer Guides"
            subtitle="A local-first SEO content hub built to help buyers in Bucks County, Montgomery County, and Northeast Philadelphia make confident moves."
          />
          <div className="flex flex-wrap gap-3">
            {locationHubSlugs.map((slug) => (
              <LinkButton key={slug} href={`/${slug}`}>
                Explore {slug.replaceAll('-', ' ')}
              </LinkButton>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Location Hubs</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {allPages
                  .filter((page) => new Set<string>(locationHubSlugs).has(page.slug))
                  .map((page) => (
                    <Card key={page.slug}>
                      <h3 className="text-lg font-semibold text-slate-900">{page.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{page.description}</p>
                      <Link href={`/${page.slug}`} className="mt-4 inline-block text-sm font-medium text-brand-700">
                        View hub →
                      </Link>
                    </Card>
                  ))}
              </div>

              <h2 className="text-2xl font-semibold">Latest SEO Guides</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {featuredBlogs.map((page) => (
                  <Card key={page.slug}>
                    <h3 className="text-base font-semibold text-slate-900">{page.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{page.description}</p>
                    <Link href={`/${page.slug}`} className="mt-4 inline-block text-sm font-medium text-brand-700">
                      Read guide →
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
            <aside>
              <LeadForm page="home" />
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
