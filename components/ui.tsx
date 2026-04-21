import Link from 'next/link';
import { ReactNode } from 'react';

export const Container = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">{children}</div>
);

export const Section = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`py-10 sm:py-14 ${className}`}>{children}</section>
);

export const Card = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
);

export const Heading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-6 space-y-2">
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
    {subtitle ? <p className="max-w-3xl text-base text-slate-600 sm:text-lg">{subtitle}</p> : null}
  </div>
);

export const LinkButton = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="inline-flex items-center rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-900"
  >
    {children}
  </Link>
);
