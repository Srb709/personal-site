import nodemailer from 'nodemailer';
import { Lead } from './types';

const DEAL_BUILDER_RECIPIENT = 'steven@themcknightteam.com';

type DealBuilderLeadEmailPayload = {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  inputs: {
    homePrice: number;
    downPaymentPercent: number;
    interestRatePercent: number;
    income: number;
    creditScore: number;
    county: string;
    firstTimeBuyer: boolean;
    veteran: boolean;
  };
  results: {
    estimatedMonthlyPayment: number;
    estimatedCashToClose: number;
    estimatedAssistanceAmount: number;
    kfitStatus: string;
    phillyFirstHomeStatus: string;
    matchedProgram: string;
    affordabilityLabel: string;
  };
};

const emailTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass }
  });
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.max(0, value));

export const sendLeadEmail = async (lead: Lead) => {
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;

  if (!to || !from) return { sent: false, reason: 'EMAIL_TO or EMAIL_FROM is not configured' };

  const transporter = emailTransport();
  if (!transporter) return { sent: false, reason: 'SMTP settings are not configured' };

  await transporter.sendMail({
    to,
    from,
    subject: `New Pennsylvania Buyer Lead: ${lead.name}`,
    text: `Name: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nPage: ${lead.page}\nMessage: ${lead.message ?? 'N/A'}`
  });

  return { sent: true };
};

export const sendDealBuilderLeadEmail = async (payload: DealBuilderLeadEmailPayload) => {
  const from = process.env.EMAIL_FROM;

  if (!from) return { sent: false, reason: 'EMAIL_FROM is not configured' };

  const transporter = emailTransport();
  if (!transporter) return { sent: false, reason: 'SMTP settings are not configured' };

  const fullName = `${payload.contact.firstName} ${payload.contact.lastName}`.trim();

  await transporter.sendMail({
    to: DEAL_BUILDER_RECIPIENT,
    from,
    subject: `New Deal Builder Lead: ${fullName}`,
    text: [
      'Contact Info',
      `- first name: ${payload.contact.firstName}`,
      `- last name: ${payload.contact.lastName}`,
      `- email: ${payload.contact.email}`,
      `- phone: ${payload.contact.phone}`,
      '',
      'Deal Builder Inputs',
      `- home price: ${formatCurrency(payload.inputs.homePrice)}`,
      `- down payment %: ${payload.inputs.downPaymentPercent}%`,
      `- interest rate %: ${payload.inputs.interestRatePercent}%`,
      `- income: ${formatCurrency(payload.inputs.income)}`,
      `- credit score: ${payload.inputs.creditScore}`,
      `- county: ${payload.inputs.county}`,
      `- first-time buyer: ${payload.inputs.firstTimeBuyer ? 'yes' : 'no'}`,
      `- veteran: ${payload.inputs.veteran ? 'yes' : 'no'}`,
      '',
      'Calculated Results',
      `- estimated monthly payment: ${formatCurrency(payload.results.estimatedMonthlyPayment)}`,
      `- estimated cash to close: ${formatCurrency(payload.results.estimatedCashToClose)}`,
      `- estimated assistance amount: ${formatCurrency(payload.results.estimatedAssistanceAmount)}`,
      `- K-FIT status: ${payload.results.kfitStatus}`,
      `- Philly First Home status: ${payload.results.phillyFirstHomeStatus}`,
      `- matched program: ${payload.results.matchedProgram}`,
      `- affordability label: ${payload.results.affordabilityLabel}`
    ].join('\n')
  });

  return { sent: true };
};
