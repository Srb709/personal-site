import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/email';
import { saveLead, trackLeadForPage } from '@/lib/storage';
import { Lead } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      page: String(data.page ?? 'unknown'),
      name: String(data.name ?? '').trim(),
      phone: String(data.phone ?? '').trim(),
      email: String(data.email ?? '').trim(),
      message: String(data.message ?? '').trim() || undefined
    };

    if (!lead.name || !lead.phone || !lead.email) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    await saveLead(lead);
    await trackLeadForPage(lead.page);
    const emailStatus = await sendLeadEmail(lead);

    return NextResponse.json({ ok: true, emailStatus });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
