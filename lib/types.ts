export type FAQ = {
  question: string;
  answer: string;
};

export type PageContent = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; points: string[] }[];
  faq: FAQ[];
  relatedSlugs: string[];
  locationMentions: string[];
  queryTarget: string;
};

export type Lead = {
  id: string;
  createdAt: string;
  page: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
};

export type AnalyticsData = {
  visits: Record<string, number>;
  leads: Record<string, number>;
  updatedAt: string;
};
