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
    <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-6">
      <h2 className="font-serif text-2xl text-white">Talk With Steven Brooks</h2>
      <p className="mt-2 text-sm text-neutral-300">Get a clear plan for financing, neighborhoods, and next steps.</p>
      <p className="mt-1 text-sm text-[#c9a86a]">Call direct: 215-779-9288</p>
      <form action={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Name"
          className="rounded-lg border border-[#3a3123] bg-[#0b0b0b] px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500"
        />
        <input
          name="phone"
          required
          placeholder="215-779-9288"
          className="rounded-lg border border-[#3a3123] bg-[#0b0b0b] px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="rounded-lg border border-[#3a3123] bg-[#0b0b0b] px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 sm:col-span-2"
        />
        <textarea
          name="message"
          placeholder="Optional message"
          rows={3}
          className="rounded-lg border border-[#3a3123] bg-[#0b0b0b] px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 sm:col-span-2"
        />
        <button
          type="submit"
          className="rounded-lg border border-[#c9a86a] bg-[#c9a86a] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#dcc08c] sm:col-span-2"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Submitting...' : 'Request Help'}
        </button>
      </form>
      {status === 'done' ? <p className="mt-2 text-sm text-emerald-300">Thanks, we received your request.</p> : null}
      {status === 'error' ? <p className="mt-2 text-sm text-red-300">Something went wrong. Please try again.</p> : null}
    </div>
  );
};
