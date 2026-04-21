import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { AnalyticsData, Lead } from './types';

const isProd = process.env.NODE_ENV === 'production';
const baseDir = isProd ? '/tmp/pa-real-estate-seo' : path.join(process.cwd(), 'data');

const leadsPath = path.join(baseDir, 'leads.json');
const analyticsPath = path.join(baseDir, 'analytics.json');

const ensureFile = async <T>(filePath: string, fallback: T) => {
  await mkdir(baseDir, { recursive: true });
  try {
    const existing = await readFile(filePath, 'utf-8');
    return JSON.parse(existing) as T;
  } catch {
    await writeFile(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
};

export const getLeads = async () => ensureFile<Lead[]>(leadsPath, []);

export const saveLead = async (lead: Lead) => {
  const leads = await getLeads();
  leads.unshift(lead);
  await writeFile(leadsPath, JSON.stringify(leads, null, 2));
};

const defaultAnalytics = (): AnalyticsData => ({
  visits: {},
  leads: {},
  updatedAt: new Date().toISOString()
});

export const getAnalytics = async () => ensureFile<AnalyticsData>(analyticsPath, defaultAnalytics());

export const trackVisit = async (slug: string) => {
  const analytics = await getAnalytics();
  analytics.visits[slug] = (analytics.visits[slug] ?? 0) + 1;
  analytics.updatedAt = new Date().toISOString();
  await writeFile(analyticsPath, JSON.stringify(analytics, null, 2));
};

export const trackLeadForPage = async (slug: string) => {
  const analytics = await getAnalytics();
  analytics.leads[slug] = (analytics.leads[slug] ?? 0) + 1;
  analytics.updatedAt = new Date().toISOString();
  await writeFile(analyticsPath, JSON.stringify(analytics, null, 2));
};
