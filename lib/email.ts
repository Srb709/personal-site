import nodemailer from 'nodemailer';
import { Lead } from './types';

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
