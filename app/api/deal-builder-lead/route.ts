import { NextResponse } from 'next/server';
import { sendDealBuilderLeadEmail } from '@/lib/email';

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const toFiniteNumber = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const firstName = isNonEmptyString(data?.contact?.firstName) ? data.contact.firstName.trim() : '';
    const lastName = isNonEmptyString(data?.contact?.lastName) ? data.contact.lastName.trim() : '';
    const email = isNonEmptyString(data?.contact?.email) ? data.contact.email.trim() : '';
    const phone = isNonEmptyString(data?.contact?.phone) ? data.contact.phone.trim() : '';

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ ok: false, error: 'Missing required contact fields.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const homePrice = toFiniteNumber(data?.inputs?.homePrice);
    const downPaymentPercent = toFiniteNumber(data?.inputs?.downPaymentPercent);
    const interestRatePercent = toFiniteNumber(data?.inputs?.interestRatePercent);
    const income = toFiniteNumber(data?.inputs?.income);
    const creditScore = toFiniteNumber(data?.inputs?.creditScore);

    if (homePrice === null || downPaymentPercent === null || interestRatePercent === null || income === null || creditScore === null) {
      return NextResponse.json({ ok: false, error: 'Invalid deal builder inputs.' }, { status: 400 });
    }

    if (!isNonEmptyString(data?.inputs?.county)) {
      return NextResponse.json({ ok: false, error: 'County is required.' }, { status: 400 });
    }

    const firstTimeBuyer = Boolean(data?.inputs?.firstTimeBuyer);
    const veteran = Boolean(data?.inputs?.veteran);

    const estimatedMonthlyPayment = toFiniteNumber(data?.results?.estimatedMonthlyPayment);
    const estimatedCashToClose = toFiniteNumber(data?.results?.estimatedCashToClose);
    const estimatedAssistanceAmount = toFiniteNumber(data?.results?.estimatedAssistanceAmount);

    if (estimatedMonthlyPayment === null || estimatedCashToClose === null || estimatedAssistanceAmount === null) {
      return NextResponse.json({ ok: false, error: 'Invalid calculated results.' }, { status: 400 });
    }

    const kfitStatus = isNonEmptyString(data?.results?.kfitStatus) ? data.results.kfitStatus.trim() : '';
    const phillyFirstHomeStatus = isNonEmptyString(data?.results?.phillyFirstHomeStatus) ? data.results.phillyFirstHomeStatus.trim() : '';
    const matchedProgram = isNonEmptyString(data?.results?.matchedProgram) ? data.results.matchedProgram.trim() : '';
    const affordabilityLabel = isNonEmptyString(data?.results?.affordabilityLabel) ? data.results.affordabilityLabel.trim() : '';

    if (!kfitStatus || !phillyFirstHomeStatus || !matchedProgram || !affordabilityLabel) {
      return NextResponse.json({ ok: false, error: 'Missing result details.' }, { status: 400 });
    }

    const emailStatus = await sendDealBuilderLeadEmail({
      contact: { firstName, lastName, email, phone },
      inputs: {
        homePrice,
        downPaymentPercent,
        interestRatePercent,
        income,
        creditScore,
        county: data.inputs.county.trim(),
        firstTimeBuyer,
        veteran
      },
      results: {
        estimatedMonthlyPayment,
        estimatedCashToClose,
        estimatedAssistanceAmount,
        kfitStatus,
        phillyFirstHomeStatus,
        matchedProgram,
        affordabilityLabel
      }
    });

    if (!emailStatus.sent) {
      return NextResponse.json({ ok: false, error: emailStatus.reason ?? 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Unexpected server error.' }, { status: 500 });
  }
}
