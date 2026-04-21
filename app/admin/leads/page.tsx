import { getLeads } from '@/lib/storage';
import { Container, Heading, Section } from '@/components/ui';

export const metadata = {
  title: 'Lead Submissions',
  description: 'Internal lead inbox'
};

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <Section className="bg-black">
      <Container>
        <Heading title="Lead Submissions" subtitle="Hidden internal page to review inbound lead form submissions." />
        <div className="overflow-x-auto rounded-2xl border border-[#2f271c] bg-[#080808]">
          <table className="min-w-full text-left text-sm text-neutral-200">
            <thead className="bg-[#0f0f0f] text-neutral-300">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-[#211c15]">
                  <td className="px-4 py-3">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">/{lead.page}</td>
                  <td className="px-4 py-3">{lead.message ?? '—'}</td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-neutral-500" colSpan={6}>
                    No leads yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
