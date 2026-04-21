import Link from 'next/link';
import { ReactNode } from 'react';

export const Container = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-container px-6 lg:px-8">{children}</div>
);

export const Section = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`py-10 sm:py-14 ${className}`}>{children}</section>
);

export const Card = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-6">{children}</div>
);

export const Heading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8 space-y-3">
    <h1 className="font-serif text-3xl tracking-wide text-white sm:text-5xl">{title}</h1>
    {subtitle ? <p className="max-w-3xl text-base text-neutral-300 sm:text-lg">{subtitle}</p> : null}
  </div>
);

export const LinkButton = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="inline-flex items-center rounded-lg border border-[#c9a86a] bg-[#c9a86a] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#dcc08c]"
  >
    {children}
  </Link>
);
