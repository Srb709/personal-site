'use client';

import { FormEvent, useMemo, useState } from 'react';

type LeadFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type LeadFormErrors = Partial<Record<keyof LeadFormState, string>>;

const numberInputClassName =
  'mt-2 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-neutral-500';

const textInputClassName =
  'mt-2 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-neutral-500';

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
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));

const toPercent = (value: number) => `${value.toFixed(1)}%`;

const clampNumber = (value: string) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return 0;
  return parsed;
};

const monthlyPayment = (principal: number, annualRate: number, years: number) => {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;

  if (principal <= 0 || totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

export default function HomePage() {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(22500);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [annualTaxes, setAnnualTaxes] = useState(6200);
  const [annualInsurance, setAnnualInsurance] = useState(1600);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(125000);
  const [monthlyDebt, setMonthlyDebt] = useState(450);
  const [inPhilly, setInPhilly] = useState(true);
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(true);

  const [showFullResults, setShowFullResults] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [leadErrors, setLeadErrors] = useState<LeadFormErrors>({});

  const scrollToForm = () => smoothScrollTo('lead-capture-form');
  const scrollToSummary = () => smoothScrollTo('live-summary');

  const calculations = useMemo(() => {
    const loanAmount = Math.max(homePrice - downPayment, 0);
    const estimatedPI = monthlyPayment(loanAmount, interestRate, loanTermYears);
    const taxesMonthly = annualTaxes / 12;
    const insuranceMonthly = annualInsurance / 12;
    const estimatedPayment = estimatedPI + taxesMonthly + insuranceMonthly + monthlyHoa;

    const hiddenTaxesInsuranceAssumptions = taxesMonthly * 2 + insuranceMonthly * 2;
    const baseCashToClose = downPayment + homePrice * 0.03 + hiddenTaxesInsuranceAssumptions;

    const kfitIncomeCap = 120000;
    const phillyIncomeCap = 110000;

    const kfitAssistance =
      firstTimeBuyer && annualIncome <= kfitIncomeCap ? Math.min(15000, baseCashToClose * 0.4) : 0;

    const phillyFirstHomeAssistance =
      inPhilly && firstTimeBuyer && annualIncome <= phillyIncomeCap ? 10000 : 0;

    const assistanceTotal = kfitAssistance + phillyFirstHomeAssistance;
    const estimatedCashToClose = Math.max(baseCashToClose - assistanceTotal, 0);

    const monthlyGrossIncome = annualIncome / 12;
    const totalMonthlyObligations = estimatedPayment + monthlyDebt;
    const debtToIncome = monthlyGrossIncome > 0 ? totalMonthlyObligations / monthlyGrossIncome : 1;

    const affordabilityLabel =
      debtToIncome <= 0.36
        ? 'Strong affordability'
        : debtToIncome <= 0.43
          ? 'Borderline affordability'
          : 'Payment likely stretches budget';

    const matchedProgram =
      kfitAssistance > 0 && phillyFirstHomeAssistance > 0
        ? 'K-FIT + Philly First Home (stacked)'
        : kfitAssistance > 0
          ? 'K-FIT'
          : phillyFirstHomeAssistance > 0
            ? 'Philly First Home'
            : 'No clear match based on current inputs';

    const kfitStatus =
      firstTimeBuyer && annualIncome <= kfitIncomeCap
        ? 'Likely eligible under current estimate'
        : firstTimeBuyer
          ? 'Over typical income range'
          : 'First-time buyer requirement not met';

    const phillyStatus =
      inPhilly && firstTimeBuyer && annualIncome <= phillyIncomeCap
        ? 'Likely eligible under current estimate'
        : !inPhilly
          ? 'Property must be in Philadelphia'
          : annualIncome > phillyIncomeCap
            ? 'Over typical income range'
            : 'First-time buyer requirement not met';

    return {
      estimatedPayment,
      estimatedCashToClose,
      assistanceTotal,
      hiddenTaxesInsuranceAssumptions,
      kfitStatus,
      phillyStatus,
      matchedProgram,
      affordabilityLabel,
      debtToIncome,
    };
  }, [
    annualIncome,
    annualInsurance,
    annualTaxes,
    downPayment,
    firstTimeBuyer,
    homePrice,
    inPhilly,
    interestRate,
    loanTermYears,
    monthlyDebt,
    monthlyHoa,
  ]);

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

  const handleLeadSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateLeadForm();
    if (!isValid) return;

    setShowFullResults(true);
    scrollToSummary();
  };

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 lg:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Live Deal Builder</p>
          <h1 className="font-serif text-3xl leading-tight text-neutral-100 lg:text-4xl">
            Build a realistic purchase scenario before you talk numbers with a lender.
          </h1>
          <p className="max-w-2xl text-sm text-neutral-300">
            Use local assumptions, honest assistance math, and payment reality checks to see what your next move could
            look like.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-neutral-200">
              Home Price
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                value={homePrice}
                onWheel={onWheelBlur}
                onChange={(e) => setHomePrice(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Down Payment
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                value={downPayment}
                onWheel={onWheelBlur}
                onChange={(e) => setDownPayment(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Interest Rate (%)
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                step="0.01"
                value={interestRate}
                onWheel={onWheelBlur}
                onChange={(e) => setInterestRate(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Loan Term (Years)
              <input
                className={numberInputClassName}
                type="number"
                inputMode="numeric"
                value={loanTermYears}
                onWheel={onWheelBlur}
                onChange={(e) => setLoanTermYears(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Annual Taxes
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                value={annualTaxes}
                onWheel={onWheelBlur}
                onChange={(e) => setAnnualTaxes(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Annual Insurance
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                value={annualInsurance}
                onWheel={onWheelBlur}
                onChange={(e) => setAnnualInsurance(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              HOA (Monthly)
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                value={monthlyHoa}
                onWheel={onWheelBlur}
                onChange={(e) => setMonthlyHoa(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Annual Household Income
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                value={annualIncome}
                onWheel={onWheelBlur}
                onChange={(e) => setAnnualIncome(clampNumber(e.target.value))}
              />
            </label>
            <label className="text-sm text-neutral-200">
              Monthly Debt
              <input
                className={numberInputClassName}
                type="number"
                inputMode="decimal"
                value={monthlyDebt}
                onWheel={onWheelBlur}
                onChange={(e) => setMonthlyDebt(clampNumber(e.target.value))}
              />
            </label>
            <div className="flex flex-col justify-end gap-3 rounded-md border border-neutral-800 bg-black/30 p-3 text-sm text-neutral-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={firstTimeBuyer} onChange={(e) => setFirstTimeBuyer(e.target.checked)} />
                First-time buyer
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={inPhilly} onChange={(e) => setInPhilly(e.target.checked)} />
                Property in Philadelphia
              </label>
            </div>
          </div>
        </div>

        <aside
          id="live-summary"
          className="h-fit space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6 lg:sticky lg:top-6"
        >
          <h2 className="font-serif text-2xl text-neutral-100">Live Summary</h2>
          <div className="space-y-3 text-sm text-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span>Estimated Monthly Payment</span>
              <strong>{toCurrency(calculations.estimatedPayment)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span>Estimated Cash to Close</span>
              <strong>{toCurrency(calculations.estimatedCashToClose)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span>Estimated Assistance Amount</span>
              <strong>{toCurrency(calculations.assistanceTotal)}</strong>
            </div>
          </div>

          {!showFullResults ? (
            <div className="space-y-3 rounded-xl border border-neutral-800 bg-black/30 p-4">
              <h3 className="font-serif text-xl text-neutral-100">Unlock Your Full Breakdown</h3>
              <p className="text-sm text-neutral-300">
                See your best-fit programs, review status, and what you may qualify for based on the details most buyers
                miss.
              </p>
              <button
                type="button"
                onClick={scrollToForm}
                className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
              >
                See My Full Breakdown
              </button>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-neutral-800 bg-black/30 p-4 text-sm text-neutral-200">
              <div className="flex items-center justify-between">
                <span>K-FIT Status</span>
                <strong className="text-right">{calculations.kfitStatus}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Philly First Home Status</span>
                <strong className="text-right">{calculations.phillyStatus}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Matched Program</span>
                <strong className="text-right">{calculations.matchedProgram}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Affordability Label</span>
                <strong className="text-right">{calculations.affordabilityLabel}</strong>
              </div>
            </div>
          )}

          <div className="space-y-2 text-xs text-neutral-400">
            <p>This isn’t a guess.</p>
            <p>I help buyers in Bucks, Montco, and Philly figure out what’s actually possible before they talk to a lender.</p>
            <p>
              Includes hidden assumptions for tax and insurance prepaids ({toCurrency(
                calculations.hiddenTaxesInsuranceAssumptions,
              )}) and debt-to-income at {toPercent(calculations.debtToIncome * 100)}.
            </p>
          </div>
        </aside>
      </section>

      <section id="lead-capture-form" className="mx-auto w-full max-w-3xl px-6 pb-16">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6">
          <h2 className="font-serif text-2xl text-neutral-100">Get Your Full Breakdown</h2>
          <p className="mt-2 text-sm text-neutral-300">
            Share a few details and I&apos;ll unlock your complete status and program match view.
          </p>

          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleLeadSubmit} noValidate>
            <label className="text-sm text-neutral-200">
              First Name
              <input
                className={textInputClassName}
                type="text"
                value={leadForm.firstName}
                onChange={(e) => updateLeadField('firstName', e.target.value)}
              />
              {leadErrors.firstName ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.firstName}</span> : null}
            </label>
            <label className="text-sm text-neutral-200">
              Last Name
              <input
                className={textInputClassName}
                type="text"
                value={leadForm.lastName}
                onChange={(e) => updateLeadField('lastName', e.target.value)}
              />
              {leadErrors.lastName ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.lastName}</span> : null}
            </label>
            <label className="text-sm text-neutral-200 sm:col-span-2">
              Email
              <input
                className={textInputClassName}
                type="email"
                value={leadForm.email}
                onChange={(e) => updateLeadField('email', e.target.value)}
              />
              {leadErrors.email ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.email}</span> : null}
            </label>
            <label className="text-sm text-neutral-200 sm:col-span-2">
              Phone
              <input
                className={textInputClassName}
                type="tel"
                value={leadForm.phone}
                onChange={(e) => updateLeadField('phone', e.target.value)}
              />
              {leadErrors.phone ? <span className="mt-1 block text-xs text-neutral-400">{leadErrors.phone}</span> : null}
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-md border border-neutral-600 bg-neutral-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-white"
              >
                Reveal My Full Results
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
