import { PageContent } from './types';

const locations = [
  { slug: 'bucks-county-pa', name: 'Bucks County', towns: ['Doylestown', 'Newtown', 'Yardley', 'Bensalem'] },
  { slug: 'montgomery-county-pa', name: 'Montgomery County', towns: ['Blue Bell', 'King of Prussia', 'Lansdale', 'Abington'] },
  {
    slug: 'northeast-philadelphia',
    name: 'Northeast Philadelphia',
    towns: ['Fox Chase', 'Bustleton', 'Somerton', 'Mayfair']
  }
] as const;

const locationTopics = [
  { slug: 'first-time-home-buyer', query: 'first time home buyer tips in {location}' },
  { slug: 'best-areas-to-live', query: 'best areas to live in {location}' },
  { slug: 'cost-of-living', query: 'cost of living in {location}' },
  { slug: 'how-to-buy-a-house', query: 'how to buy a house in {location}' },
  { slug: 'homes-for-sale-guide', query: 'homes for sale guide in {location}' }
] as const;

const grantPages: PageContent[] = [
  {
    slug: 'pa-first-time-home-buyer-grants',
    title: 'PA First-Time Home Buyer Grants: What Is Available in 2026',
    description: 'A plain-language guide to Pennsylvania first-time buyer grants, who qualifies, and where Bucks, Montco, and Philly buyers should start.',
    intro:
      'Pennsylvania buyers can combine statewide and local assistance programs. This page helps you compare options before you speak with a lender.',
    sections: [
      {
        heading: 'What most buyers qualify for first',
        points: [
          'PHFA-backed options often include down payment or closing cost support.',
          'County and city programs can stack with statewide financing in some scenarios.',
          'Credit, income, and occupancy rules usually apply to every grant program.'
        ]
      },
      {
        heading: 'Where local buyers usually start',
        points: [
          'Bucks County buyers often compare options near Doylestown and Bensalem.',
          'Montgomery County buyers ask about grants around Abington, Lansdale, and Norristown.',
          'Northeast Philadelphia buyers typically review programs tied to city limits and ZIP-based rules.'
        ]
      }
    ],
    faq: [
      {
        question: 'Can I use grant money with FHA or conventional loans?',
        answer: 'In many cases yes, but your lender and program administrator have to approve the exact combination.'
      },
      {
        question: 'Do grants need to be repaid?',
        answer: 'Some are forgivable after a time period, while others are repayable assistance loans.'
      }
    ],
    relatedSlugs: ['pa-closing-cost-assistance', 'how-much-house-can-i-afford-pa', 'bucks-county-pa/first-time-home-buyer'],
    locationMentions: ['Bucks County', 'Montgomery County', 'Northeast Philadelphia'],
    queryTarget: 'pa first-time home buyer grants'
  },
  {
    slug: 'pa-closing-cost-assistance',
    title: 'PA Closing Cost Assistance: Options for Local Buyers',
    description: 'Understand Pennsylvania closing cost assistance programs and what buyers in Bucks, Montco, and Northeast Philly should expect.',
    intro: 'Closing costs can surprise buyers. This guide breaks down typical fees and how assistance programs can reduce out-of-pocket expenses.',
    sections: [
      {
        heading: 'Typical closing costs in Pennsylvania',
        points: [
          'Loan fees, title insurance, and prepaids are common line items.',
          'Property taxes vary by municipality and can change your cash-to-close.',
          'A lender estimate helps you compare real totals before choosing a loan.'
        ]
      },
      {
        heading: 'How assistance works',
        points: [
          'Some programs issue grants while others provide second liens.',
          'Many require homebuyer education before closing.',
          'Income and purchase price caps can differ between county programs.'
        ]
      }
    ],
    faq: [
      {
        question: 'Can a seller pay part of my closing costs too?',
        answer: 'Yes, seller concessions may be allowed within loan guidelines.'
      }
    ],
    relatedSlugs: ['pa-first-time-home-buyer-grants', 'how-much-house-can-i-afford-pa'],
    locationMentions: ['Bucks County', 'Montgomery County', 'Philadelphia'],
    queryTarget: 'pa closing cost assistance'
  },
  {
    slug: 'how-much-house-can-i-afford-pa',
    title: 'How Much House Can I Afford in PA? Practical Budget Guide',
    description: 'A practical affordability guide for Pennsylvania buyers with examples from Bucks County, Montgomery County, and Northeast Philly.',
    intro: 'Affordability is more than mortgage payment. Use this framework to evaluate taxes, insurance, and monthly maintenance costs.',
    sections: [
      {
        heading: 'Build your true monthly budget',
        points: [
          'Start with take-home pay, not gross income.',
          'Include property tax differences between townships.',
          'Reserve funds for repairs and seasonal utility spikes.'
        ]
      },
      {
        heading: 'Local affordability patterns',
        points: [
          'Bucks County often has higher purchase prices in Newtown and Yardley.',
          'Montgomery County offers mixed pricing from Norristown to Lower Merion.',
          'Northeast Philly may offer lower entry points in select neighborhoods.'
        ]
      }
    ],
    faq: [
      {
        question: 'Should I max out my pre-approval amount?',
        answer: 'Most buyers are safer choosing a payment below the maximum approval limit.'
      }
    ],
    relatedSlugs: ['pa-first-time-home-buyer-grants', 'pa-closing-cost-assistance'],
    locationMentions: ['Bucks County', 'Montgomery County', 'Northeast Philadelphia'],
    queryTarget: 'how much house can i afford pa'
  }
];

const blogKeywords = [
  'moving-to-bucks-county-from-philadelphia',
  'best-commuter-towns-near-philadelphia',
  'is-doylestown-good-for-families',
  'yardley-vs-newtown-which-is-better',
  'living-in-bensalem-pa-pros-and-cons',
  'best-montgomery-county-school-districts',
  'abington-pa-home-buying-guide',
  'blue-bell-pa-cost-of-living',
  'lansdale-pa-first-home-checklist',
  'king-of-prussia-neighborhood-guide',
  'northeast-philly-neighborhoods-explained',
  'somerton-vs-bustleton-home-prices',
  'fox-chase-homebuyer-tips',
  'mayfair-philly-real-estate-guide',
  'pa-down-payment-assistance-faq',
  'how-much-are-property-taxes-in-bucks-county',
  'montco-property-tax-guide-for-buyers',
  'northeast-philly-closing-cost-breakdown',
  'how-to-choose-a-buyers-agent-in-pa',
  'home-inspection-red-flags-pa',
  'best-time-to-buy-a-house-in-pennsylvania',
  'townhome-vs-single-family-pa',
  'fha-vs-conventional-pa-first-time-buyers',
  'credit-score-needed-to-buy-house-pa',
  'how-to-save-for-closing-costs-pa',
  'relocating-to-montco-with-kids',
  'is-bucks-county-expensive',
  'northeast-philly-vs-suburbs-for-buyers',
  'walkable-towns-in-montgomery-county',
  'best-parks-and-amenities-in-bucks-county',
  'starter-homes-in-montgomery-county',
  'what-to-know-before-buying-in-philadelphia',
  'homeowners-insurance-costs-pa',
  'earnest-money-guide-pa',
  'how-long-does-closing-take-in-pa',
  'first-time-buyer-mistakes-in-pennsylvania',
  'house-hunting-checklist-pa',
  'buying-a-home-near-septa-lines',
  'moving-timeline-for-pa-homebuyers',
  'questions-to-ask-at-open-houses-pa'
];

const titleCase = (text: string) =>
  text
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const locationPages: PageContent[] = locations.flatMap((location) => {
  const hub: PageContent = {
    slug: location.slug,
    title: `${location.name} Real Estate Guide for Home Buyers`,
    description: `Explore ${location.name} housing costs, neighborhoods, and practical buying steps for local buyers in 2026.`,
    intro: `${location.name} offers a mix of neighborhoods, home styles, and price points. Use this hub to compare costs, schools, and commute patterns before you buy.`,
    sections: [
      {
        heading: `Where buyers focus in ${location.name}`,
        points: location.towns.map((town) => `${town} is a common search area for buyers comparing taxes, schools, and commute options.`)
      },
      {
        heading: 'How to use this hub',
        points: [
          'Start with first-time buyer basics, then compare neighborhoods and costs.',
          'Review financing pages for grants and closing cost help.',
          'Use related guides to narrow choices and prepare for showings.'
        ]
      }
    ],
    faq: [
      {
        question: `Is ${location.name} good for first-time buyers?`,
        answer: `Yes, many first-time buyers find options in ${location.name}, but competition and taxes can vary by township.`
      }
    ],
    relatedSlugs: locationTopics.map((topic) => `${location.slug}/${topic.slug}`),
    locationMentions: [location.name, ...location.towns],
    queryTarget: `${location.name} real estate guide`
  };

  const subpages = locationTopics.map((topic): PageContent => ({
    slug: `${location.slug}/${topic.slug}`,
    title: `${titleCase(topic.slug.replaceAll('-', ' '))} in ${location.name}`,
    description: `${titleCase(topic.slug.replaceAll('-', ' '))} guide for buyers researching ${location.name}.`,
    intro: `If you are searching for "${topic.query.replace('{location}', location.name)}", this page gives a direct, local answer with practical steps.`,
    sections: [
      {
        heading: 'Local context that matters',
        points: [
          `Buyers usually compare ${location.towns[0]} and ${location.towns[1]} first.`,
          `Property tax and insurance costs can differ across ${location.name}.`,
          'Commuting routes and school boundaries often shape final decisions.'
        ]
      },
      {
        heading: 'Action plan',
        points: [
          'Set a budget range and include cash-to-close estimates.',
          'Tour at least three neighborhoods before making an offer.',
          'Get lender scenarios in writing so you can compare apples-to-apples.'
        ]
      }
    ],
    faq: [
      {
        question: `How competitive is ${location.name} for buyers?`,
        answer: 'Competition changes by season and price tier, so watch recent sold trends in your target area.'
      }
    ],
    relatedSlugs: [location.slug, 'pa-first-time-home-buyer-grants', 'how-much-house-can-i-afford-pa'],
    locationMentions: [location.name, ...location.towns],
    queryTarget: topic.query.replace('{location}', location.name)
  }));

  return [hub, ...subpages];
});

const blogPages: PageContent[] = blogKeywords.map((keyword, index) => {
  const region = index % 3 === 0 ? 'Bucks County' : index % 3 === 1 ? 'Montgomery County' : 'Northeast Philadelphia';
  const secondary = region === 'Bucks County' ? 'Doylestown' : region === 'Montgomery County' ? 'Lansdale' : 'Bustleton';

  return {
    slug: `blog/${keyword}`,
    title: `${titleCase(keyword)}: Local Buyer Guide`,
    description: `Read a practical local guide for ${titleCase(keyword.replaceAll('-', ' '))} with clear next steps for Pennsylvania buyers.`,
    intro: `People search "${keyword.replaceAll('-', ' ')}" because they want a quick, practical answer. This guide keeps it simple and local to Pennsylvania buyers.`,
    sections: [
      {
        heading: 'What local buyers should know first',
        points: [
          `Start by comparing costs and commute realities in ${region}.`,
          `Review neighborhood fit in nearby areas like ${secondary}.`,
          'Check lending options early so you can move quickly when inventory appears.'
        ]
      },
      {
        heading: 'Next steps before you decide',
        points: [
          'Create a short list of must-haves and deal-breakers.',
          'Tour homes at different price points in one weekend.',
          'Ask for recent sales data in the exact neighborhood, not only zip-wide averages.'
        ]
      }
    ],
    faq: [
      {
        question: 'Is this topic relevant for first-time buyers?',
        answer: 'Yes. Most of these decisions are most important for first-time buyers choosing between city and suburb options.'
      }
    ],
    relatedSlugs: ['bucks-county-pa', 'montgomery-county-pa', 'northeast-philadelphia', 'pa-first-time-home-buyer-grants'],
    locationMentions: [region, secondary, 'Pennsylvania'],
    queryTarget: keyword.replaceAll('-', ' ')
  };
});

export const allPages: PageContent[] = [...locationPages, ...grantPages, ...blogPages];

export const pageMap = new Map(allPages.map((page) => [page.slug, page]));

export const getPageBySlug = (slug: string) => pageMap.get(slug);

export const getAllSlugs = () => allPages.map((page) => page.slug);

export const getRelatedPages = (slug: string) => {
  const page = pageMap.get(slug);
  if (!page) return [];

  return page.relatedSlugs
    .map((item) => pageMap.get(item))
    .filter((item): item is PageContent => Boolean(item));
};

export const locationHubSlugs = locations.map((location) => location.slug);
