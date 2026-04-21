import { getLeads } from '@/lib/storage';
import { Container, Heading, Section } from '@/components/ui';

export const metadata = {
  title: 'Lead Submissions',
  description: 'Internal lead inbox'
};

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <Section>
      <Container>
        <Heading title="Lead Submissions" subtitle="Hidden internal page to review inbound lead form submissions." />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
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
                <tr key={lead.id} className="border-t border-slate-200">
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
                  <td className="px-4 py-8 text-slate-500" colSpan={6}>
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
