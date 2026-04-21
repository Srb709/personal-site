import { NextResponse } from 'next/server';
import { trackVisit } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const { page } = (await request.json()) as { page?: string };
    if (!page) return NextResponse.json({ ok: false }, { status: 400 });
    await trackVisit(page);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
