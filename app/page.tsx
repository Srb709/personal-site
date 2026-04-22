'use client';

import { FormEvent, useMemo, useState } from 'react';

type LeadFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;

type County = 'Philadelphia' | 'Montgomery' | 'Bucks';
type ProgramStatus = 'eligible' | 'needs_review' | 'not_eligible';

type ProgramResult = {
  name: string;
  status: ProgramStatus;
  assistance: number;
  note: string;
};

const inputClassName =
  'mt-2 w-full rounded-md border border-[#3a3123] bg-[#0b0b0b] px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-[#c9a86a]';

const smoothScrollTo = (id: string) => {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const toCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.max(0, value));

const toCurrencyRange = (low: number, high: number) => `${toCurrency(low)} – ${toCurrency(high)}`;

const parseInputNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return 0;
  return parsed;
};

const sanitizeNumericInput = (raw: string, mode: 'decimal' | 'numeric') => {
  let value = mode === 'decimal' ? raw.replace(/[^\d.]/g, '') : raw.replace(/\D/g, '');

  if (mode === 'decimal') {
    const firstDot = value.indexOf('.');
    if (firstDot >= 0) {
      value = value.slice(0, firstDot + 1) + value.slice(firstDot + 1).replace(/\./g, '');
    }
  }

  if (/^0\d/.test(value)) {
    value = value.replace(/^0+/, '');
  }

  return value;
};

const monthlyPayment = (principal: number, annualRate: number, years: number) => {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;

  if (principal <= 0 || totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

const estimatedTotalMonthlyPayment = (
  homePrice: number,
  downPaymentPercent: number,
  annualRate: number,
  years: number
) => {
  const sanitizedHomePrice = Math.max(homePrice, 0);
  const downPaymentAmount = (sanitizedHomePrice * Math.max(0, downPaymentPercent)) / 100;
  const loanAmount = Math.max(sanitizedHomePrice - downPaymentAmount, 0);
  const estimatedPI = monthlyPayment(loanAmount, annualRate, years);
  const yearlyTaxes = sanitizedHomePrice * 0.012;
  const yearlyInsurance = Math.max(1200, sanitizedHomePrice * 0.0035);

  return estimatedPI + yearlyTaxes / 12 + yearlyInsurance / 12;
};

const estimateHomePriceFromTargetPayment = (targetMonthlyPayment: number, downPaymentPercent: number, annualRate: number) => {
  const target = Math.max(targetMonthlyPayment, 0);
  if (target === 0) return 0;

  const loanTermYears = 30;
  let low = 0;
  let high = 2000000;

  while (estimatedTotalMonthlyPayment(high, downPaymentPercent, annualRate, loanTermYears) < target && high < 10000000) {
    high *= 1.5;
  }

  for (let index = 0; index < 45; index += 1) {
    const mid = (low + high) / 2;
    const estimate = estimatedTotalMonthlyPayment(mid, downPaymentPercent, annualRate, loanTermYears);

    if (estimate > target) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.max(0, low);
};

const statusLabel = (status: ProgramStatus) => {
  if (status === 'eligible') return 'Likely eligible';
  if (status === 'needs_review') return 'Needs review';
  return 'Not eligible';
};

export default function HomePage() {
  const [homePrice, setHomePrice] = useState('450000');
  const [downPaymentPercent, setDownPaymentPercent] = useState('5');
  const [interestRate, setInterestRate] = useState('6.75');
  const [annualIncome, setAnnualIncome] = useState('125000');
  const [creditScore, setCreditScore] = useState('680');
  const [county, setCounty] = useState<County>('Philadelphia');
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(true);
  const [isVeteran, setIsVeteran] = useState(false);

  const [showFullResults, setShowFullResults] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [leadErrors, setLeadErrors] = useState<LeadFormErrors>({});
  const [leadSubmitStatus, setLeadSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const calculations = useMemo(() => {
    const parsedHomePrice = parseInputNumber(homePrice);
    const parsedDownPaymentPercent = parseInputNumber(downPaymentPercent);
    const parsedInterestRate = parseInputNumber(interestRate);
    const parsedAnnualIncome = parseInputNumber(annualIncome);
    const parsedCreditScore = parseInputNumber(creditScore);

    const loanTermYears = 30;
    const downPaymentAmount = (parsedHomePrice * Math.max(0, parsedDownPaymentPercent)) / 100;
    const loanAmount = Math.max(parsedHomePrice - downPaymentAmount, 0);

    const yearlyTaxes = parsedHomePrice * 0.012;
    const yearlyInsurance = Math.max(1200, parsedHomePrice * 0.0035);

    const estimatedPI = monthlyPayment(loanAmount, parsedInterestRate, loanTermYears);
    const taxesMonthly = yearlyTaxes / 12;
    const insuranceMonthly = yearlyInsurance / 12;
    const estimatedPayment = estimatedPI + taxesMonthly + insuranceMonthly;

    const countyCashFactors: Record<County, { low: number; mid: number; high: number }> = {
      Philadelphia: { low: 0.06, mid: 0.068, high: 0.075 },
      Montgomery: { low: 0.035, mid: 0.045, high: 0.055 },
      Bucks: { low: 0.035, mid: 0.0425, high: 0.0525 }
    };

    const countyCashFactor = countyCashFactors[county];
    const estimatedCashToCloseLow = Math.max(downPaymentAmount + parsedHomePrice * countyCashFactor.low, 0);
    const estimatedCashToCloseMid = Math.max(downPaymentAmount + parsedHomePrice * countyCashFactor.mid, estimatedCashToCloseLow);
    const estimatedCashToCloseHigh = Math.max(downPaymentAmount + parsedHomePrice * countyCashFactor.high, estimatedCashToCloseMid);

    const kfitIncomeCap = 120000;
    const phillyIncomeCap = 110000;
    const inPhilly = county === 'Philadelphia';

    const kfit: ProgramResult =
      !firstTimeBuyer
        ? {
            name: 'K-FIT',
            status: 'not_eligible',
            assistance: 0,
            note: 'First-time buyer requirement not met.'
          }
        : parsedAnnualIncome <= kfitIncomeCap && parsedCreditScore >= 640
          ? {
              name: 'K-FIT',
              status: 'eligible',
              assistance: Math.min(15000, estimatedCashToCloseMid * 0.4),
              note: 'Likely eligible under current estimate.'
            }
          : parsedAnnualIncome <= kfitIncomeCap && parsedCreditScore >= 620
            ? {
                name: 'K-FIT',
                status: 'needs_review',
                assistance: Math.min(15000, estimatedCashToCloseMid * 0.4),
                note: 'Needs lender review for score and overlays.'
              }
            : {
                name: 'K-FIT',
                status: 'not_eligible',
                assistance: 0,
                note:
                  parsedAnnualIncome > kfitIncomeCap
                    ? 'Over typical income range.'
                    : 'Credit score appears below common minimums.'
              };

    const phillyFirstHome: ProgramResult =
      !inPhilly
        ? {
            name: 'Philly First Home',
            status: 'not_eligible',
            assistance: 0,
            note: 'Property must be in Philadelphia.'
          }
        : !firstTimeBuyer
          ? {
              name: 'Philly First Home',
              status: 'not_eligible',
              assistance: 0,
              note: 'First-time buyer requirement not met.'
            }
          : parsedAnnualIncome <= phillyIncomeCap && parsedCreditScore >= 660
            ? {
                name: 'Philly First Home',
                status: 'eligible',
                assistance: 10000,
                note: 'Likely eligible under current estimate.'
              }
            : parsedAnnualIncome <= phillyIncomeCap && parsedCreditScore >= 620
              ? {
                  name: 'Philly First Home',
                  status: 'needs_review',
                  assistance: 10000,
                  note: 'Needs review for score and file-level conditions.'
                }
              : {
                  name: 'Philly First Home',
                  status: 'not_eligible',
                  assistance: 0,
                  note:
                    parsedAnnualIncome > phillyIncomeCap
                      ? 'Over typical income range.'
                      : 'Credit score appears below common minimums.'
                };

    const veteranBoost: ProgramResult =
      isVeteran
        ? parsedCreditScore >= 620
          ? {
              name: 'Veteran Advantage',
              status: 'eligible',
              assistance: Math.min(5000, estimatedCashToCloseMid * 0.2),
              note: 'Likely eligible based on current profile.'
            }
          : {
              name: 'Veteran Advantage',
              status: 'needs_review',
              assistance: Math.min(5000, estimatedCashToCloseMid * 0.2),
              note: 'May qualify, but score/profile needs review.'
            }
        : {
            name: 'Veteran Advantage',
            status: 'not_eligible',
            assistance: 0,
            note: 'Veteran toggle not selected.'
          };

    const programs = [kfit, phillyFirstHome, veteranBoost];

    const assistanceTotal = programs
      .filter((program) => program.status === 'eligible')
      .reduce((sum, program) => sum + program.assistance, 0);

    const estimatedCashNeededAfterAssistanceLow = Math.max(estimatedCashToCloseLow - assistanceTotal, 0);
    const estimatedCashNeededAfterAssistanceHigh = Math.max(estimatedCashToCloseHigh - assistanceTotal, estimatedCashNeededAfterAssistanceLow);

    const monthlyGrossIncome = parsedAnnualIncome / 12;
    const priceTargetLowPayment = monthlyGrossIncome * 0.25;
    const priceTargetHighPayment = monthlyGrossIncome * 0.33;
    const estimatedAffordablePriceLow = estimateHomePriceFromTargetPayment(
      Math.max(0, Math.min(priceTargetLowPayment, priceTargetHighPayment)),
      parsedDownPaymentPercent,
      parsedInterestRate
    );
    const estimatedAffordablePriceHigh = Math.max(
      estimatedAffordablePriceLow,
      estimateHomePriceFromTargetPayment(
        Math.max(priceTargetLowPayment, priceTargetHighPayment),
        parsedDownPaymentPercent,
        parsedInterestRate
      )
    );

    const matchedProgramHonest = programs
      .filter((program) => program.status === 'eligible')
      .map((program) => program.name)
      .join(' + ');

    const debtToIncome = monthlyGrossIncome > 0 ? estimatedPayment / monthlyGrossIncome : 1;
    const affordabilityLabel =
      debtToIncome <= 0.36 ? 'Strong affordability' : debtToIncome <= 0.43 ? 'Borderline affordability' : 'Payment likely stretches budget';

    return {
      estimatedPayment,
      estimatedCashToCloseLow,
      estimatedCashToCloseMid,
      estimatedCashToCloseHigh,
      assistanceTotal,
      estimatedCashNeededAfterAssistanceLow,
      estimatedCashNeededAfterAssistanceHigh,
      estimatedAffordablePriceLow,
      estimatedAffordablePriceHigh,
      programs,
      matchedProgram: matchedProgramHonest || 'No clear match based on current inputs',
      affordabilityLabel
    };
  }, [annualIncome, county, creditScore, downPaymentPercent, firstTimeBuyer, homePrice, interestRate, isVeteran]);

  const onWheelBlur = (event: React.WheelEvent<HTMLInputElement>) => {
    event.currentTarget.blur();
  };

  const updateLeadField = (field: keyof LeadFormState, value: string) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
    setLeadErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateLeadForm = () => {
    const nextErrors: LeadFormErrors = {};
    const trimmedFirst = leadForm.firstName.trim();
    const trimmedLast = leadForm.lastName.trim();
    const trimmedEmail = leadForm.email.trim();
    const trimmedPhone = leadForm.phone.trim();

    if (!trimmedFirst) nextErrors.firstName = 'First name is required.';
    if (!trimmedLast) nextErrors.lastName = 'Last name is required.';
    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!trimmedPhone) nextErrors.phone = 'Phone is required.';

    setLeadErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateLeadForm()) return;

    setLeadSubmitStatus('sending');

    const payload = {
      contact: {
        firstName: leadForm.firstName.trim(),
        lastName: leadForm.lastName.trim(),
        email: leadForm.email.trim(),
        phone: leadForm.phone.trim()
      },
      inputs: {
        homePrice: parseInputNumber(homePrice),
        downPaymentPercent: parseInputNumber(downPaymentPercent),
        interestRatePercent: parseInputNumber(interestRate),
        income: parseInputNumber(annualIncome),
        creditScore: parseInputNumber(creditScore),
        county,
        firstTimeBuyer,
        veteran: isVeteran
      },
      results: {
        estimatedMonthlyPayment: calculations.estimatedPayment,
        estimatedCashToClose: calculations.estimatedCashToCloseMid,
        estimatedAssistanceAmount: calculations.assistanceTotal,
        kfitStatus: `${statusLabel(calculations.programs[0].status)} • ${calculations.programs[0].note}`,
        phillyFirstHomeStatus: `${statusLabel(calculations.programs[1].status)} • ${calculations.programs[1].note}`,
        matchedProgram: calculations.matchedProgram,
        affordabilityLabel: calculations.affordabilityLabel
      }
    };

    try {
      const response = await fetch('/api/deal-builder-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setLeadSubmitStatus('error');
        setShowFullResults(false);
        return;
      }

      setLeadSubmitStatus('success');
      setShowFullResults(true);
    } catch {
      setLeadSubmitStatus('error');
      setShowFullResults(false);
      return;
    }

    smoothScrollTo('deal-snapshot');
  };

  const Toggle = ({
    label,
    enabled,
    onChange
  }: {
    label: string;
    enabled: boolean;
    onChange: (next: boolean) => void;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between rounded-md border border-[#3a3123] bg-[#0b0b0b] px-3 py-2 text-sm text-neutral-100"
    >
      <span>{label}</span>
      <span className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${enabled ? 'bg-[#c9a86a]' : 'bg-neutral-700'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
      </span>
    </button>
  );

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <section className="mx-auto w-full max-w-6xl px-6 pb-8 pt-10">
        <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-7 lg:p-10">
          <h1 className="font-serif text-4xl leading-tight text-white md:text-5xl">
            Find Out What You Can <span className="text-[#c9a86a]">Actually Afford</span> in Pennsylvania
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-neutral-300">
            See your estimated monthly payment, upfront cost, and how available programs may reduce what you need to buy.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 rounded-2xl border border-[#2f271c] bg-[#080808] p-6 lg:p-8">
          <h2 className="font-serif text-2xl text-white">Live Deal Builder</h2>
          <p className="text-sm text-neutral-400">Start with your income and we’ll estimate what price range may realistically make sense.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-neutral-200">
              Home Price
              <input
                className={inputClassName}
                type="text"
                inputMode="decimal"
                value={homePrice}
                onWheel={onWheelBlur}
                onChange={(e) => setHomePrice(sanitizeNumericInput(e.target.value, 'decimal'))}
              />
              <span className="mt-1 block text-xs text-neutral-400">
                Based on your info, a realistic range may be around{' '}
                {toCurrencyRange(calculations.estimatedAffordablePriceLow, calculations.estimatedAffordablePriceHigh)}.
              </span>
            </label>
            <label className="text-sm text-neutral-200">
              Down Payment %
              <input
                className={inputClassName}
                type="text"
                inputMode="decimal"
                value={downPaymentPercent}
                onWheel={onWheelBlur}
                onChange={(e) => setDownPaymentPercent(sanitizeNumericInput(e.target.value, 'decimal'))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Interest Rate %
              <input
                className={inputClassName}
                type="text"
                inputMode="decimal"
                value={interestRate}
                onWheel={onWheelBlur}
                onChange={(e) => setInterestRate(sanitizeNumericInput(e.target.value, 'decimal'))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Income
              <input
                className={inputClassName}
                type="text"
                inputMode="decimal"
                value={annualIncome}
                onWheel={onWheelBlur}
                onChange={(e) => setAnnualIncome(sanitizeNumericInput(e.target.value, 'decimal'))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Credit Score
              <input
                className={inputClassName}
                type="text"
                inputMode="numeric"
                value={creditScore}
                onWheel={onWheelBlur}
                onChange={(e) => setCreditScore(sanitizeNumericInput(e.target.value, 'numeric'))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              County
              <select className={inputClassName} value={county} onChange={(e) => setCounty(e.target.value as County)}>
                <option>Philadelphia</option>
                <option>Montgomery</option>
                <option>Bucks</option>
              </select>
            </label>
            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
              <Toggle label="First-time Buyer" enabled={firstTimeBuyer} onChange={setFirstTimeBuyer} />
              <Toggle label="Veteran" enabled={isVeteran} onChange={setIsVeteran} />
            </div>
          </div>
        </div>

        <aside
          id="deal-snapshot"
          className="h-fit space-y-4 rounded-2xl border border-[#2f271c] bg-[#080808] p-6 lg:sticky lg:top-28"
        >
          <h2 className="font-serif text-2xl text-white">Your Estimated Deal Snapshot</h2>
          <div className="space-y-3 text-sm text-neutral-200">
            <div className="flex items-center justify-between border-b border-[#2a241b] pb-2">
              <span>Estimated Price Range</span>
              <strong>{toCurrencyRange(calculations.estimatedAffordablePriceLow, calculations.estimatedAffordablePriceHigh)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#2a241b] pb-2">
              <span>Estimated Monthly Payment</span>
              <strong>{toCurrency(calculations.estimatedPayment)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#2a241b] pb-2">
              <span>Estimated Cash to Close</span>
              <strong>{toCurrencyRange(calculations.estimatedCashToCloseLow, calculations.estimatedCashToCloseHigh)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#2a241b] pb-2">
              <span>Estimated Assistance Amount</span>
              <strong>{toCurrency(calculations.assistanceTotal)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-[#2a241b] pb-2">
              <span>Estimated Cash Needed After Assistance</span>
              <strong>
                {toCurrencyRange(
                  calculations.estimatedCashNeededAfterAssistanceLow,
                  calculations.estimatedCashNeededAfterAssistanceHigh
                )}
              </strong>
            </div>
          </div>

          {!showFullResults ? (
            <div className="space-y-3 rounded-xl border border-[#3a3123] bg-[#0b0b0b] p-4">
              <h3 className="font-serif text-xl text-white">Unlock Your Full Breakdown</h3>
              <p className="text-sm text-neutral-300">
                See your best-fit programs, review status, and what you may qualify for based on the details most buyers
                miss.
              </p>
              <button
                type="button"
                onClick={() => smoothScrollTo('lead-capture-form')}
                className="w-full rounded-md border border-[#c9a86a] bg-[#c9a86a] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#d9bc87]"
              >
                See My Full Breakdown
              </button>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-[#3a3123] bg-[#0b0b0b] p-4 text-sm text-neutral-200">
              <div className="space-y-1 border-b border-[#2a241b] pb-2">
                <span className="block">K-FIT Status</span>
                <strong className="block text-right">
                  {statusLabel(calculations.programs[0].status)} • {calculations.programs[0].note}
                </strong>
              </div>
              <div className="space-y-1 border-b border-[#2a241b] pb-2">
                <span className="block">Philly First Home Status</span>
                <strong className="block text-right">
                  {statusLabel(calculations.programs[1].status)} • {calculations.programs[1].note}
                </strong>
              </div>
              <div className="flex items-center justify-between border-b border-[#2a241b] pb-2">
                <span>Matched Program</span>
                <strong className="text-right">{calculations.matchedProgram}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Affordability Label</span>
                <strong className="text-right">{calculations.affordabilityLabel}</strong>
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-12">
        <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-6 lg:p-8">
          <h2 className="font-serif text-2xl text-white">This isn’t a guess</h2>
          <p className="mt-2 text-sm text-neutral-300">
            This gives you a strong starting point based on local program rules, but some scenarios still need a full review.
          </p>
          <p className="mt-3 text-sm text-neutral-300">
            I help buyers in Bucks, Montco, and Philly figure out what’s actually possible before they talk to a lender.
          </p>
        </div>
      </section>

      <section id="lead-capture-form" className="mx-auto w-full max-w-3xl px-6 pb-16">
        <div className="rounded-2xl border border-[#2f271c] bg-[#080808] p-6">
          <h2 className="font-serif text-2xl text-white">Get Your Full Breakdown</h2>
          <p className="mt-2 text-sm text-neutral-300">Share a few details and I’ll unlock your full program breakdown.</p>

          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleLeadSubmit} noValidate>
            <label className="text-sm text-neutral-200">
              First Name
              <input
                className={inputClassName}
                type="text"
                value={leadForm.firstName}
                onChange={(e) => updateLeadField('firstName', e.target.value)}
              />
              {leadErrors.firstName ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.firstName}</span> : null}
            </label>
            <label className="text-sm text-neutral-200">
              Last Name
              <input
                className={inputClassName}
                type="text"
                value={leadForm.lastName}
                onChange={(e) => updateLeadField('lastName', e.target.value)}
              />
              {leadErrors.lastName ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.lastName}</span> : null}
            </label>
            <label className="text-sm text-neutral-200 sm:col-span-2">
              Email
              <input
                className={inputClassName}
                type="email"
                value={leadForm.email}
                onChange={(e) => updateLeadField('email', e.target.value)}
              />
              {leadErrors.email ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.email}</span> : null}
            </label>
            <label className="text-sm text-neutral-200 sm:col-span-2">
              Phone
              <input
                className={inputClassName}
                type="tel"
                placeholder="215-779-9288"
                value={leadForm.phone}
                onChange={(e) => updateLeadField('phone', e.target.value)}
              />
              {leadErrors.phone ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.phone}</span> : null}
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={leadSubmitStatus === 'sending'}
                className="w-full rounded-md border border-[#c9a86a] bg-[#c9a86a] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#d9bc87]"
              >
                {leadSubmitStatus === 'sending' ? 'Sending...' : 'Reveal My Full Results'}
              </button>
            </div>
          </form>
          {leadSubmitStatus === 'success' ? (
            <p className="mt-3 text-sm text-emerald-300">Success. Your full breakdown is now unlocked.</p>
          ) : null}
          {leadSubmitStatus === 'error' ? (
            <p className="mt-3 text-sm text-red-300">We couldn’t send your details yet. Please try again.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
