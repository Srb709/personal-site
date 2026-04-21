'use client';

import { useState } from 'react';

export const LeadForm = ({ page }: { page: string }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (formData: FormData) => {
    setStatus('loading');
    const payload = {
      page,
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setStatus(response.ok ? 'done' : 'error');
  };

  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
      <h2 className="text-xl font-semibold text-slate-900">Talk With a Local Buyer Specialist</h2>
      <p className="mt-1 text-sm text-slate-600">Get a clear plan for financing, neighborhoods, and next steps.</p>
      <form action={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="phone" required placeholder="Phone" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input name="email" type="email" required placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2" />
        <textarea name="message" placeholder="Optional message" rows={3} className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2" />
        <button
          type="submit"
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900 sm:col-span-2"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Request Help'}
        </button>
      </form>
      {status === 'done' ? <p className="mt-2 text-sm text-emerald-700">Thanks, we received your request.</p> : null}
      {status === 'error' ? <p className="mt-2 text-sm text-red-700">Something went wrong. Please try again.</p> : null}
    </div>
  );
};
