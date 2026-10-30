// ============================================================================
// TypeScript Interfaces for Structured Page Content
// ============================================================================

export interface HeroSlideItem {
  id?: string
  image_url: string
  title?: string
  caption?: string
  alt_text: string
}

export interface StatItem {
  label: string
  value: string
  order?: number
}

export interface StrategicObjectiveItem {
  num: number | string
  title: string
  description: string
}

export interface FeatureCardItem {
  title: string
  description: string
}

// ----------------------------------------------------------------------------
// HOME PAGE CONTENT SCHEMA
// ----------------------------------------------------------------------------
export interface HomePageContent {
  // Hero Section
  hero_slides: HeroSlideItem[]

  // Stats Strip
  stats: StatItem[]

  // About The Forum Snippet
  about_snippet: {
    badge: string
    title: string
    description: string
    feature_1: FeatureCardItem
    feature_2: FeatureCardItem
    primary_btn_text: string
    primary_btn_url: string
    secondary_btn_text: string
    secondary_btn_url: string
  }

  // Strategic Objectives Card (Home)
  strategic_objectives: {
    title: string
    objectives: StrategicObjectiveItem[]
  }

  // Section Headers & Copy
  programmes_section: {
    badge: string
    title: string
    description: string
    view_all_text: string
  }

  news_events_section: {
    news_badge: string
    news_title: string
    events_badge: string
    events_title: string
  }

  publications_section: {
    badge: string
    title: string
    description: string
    view_all_text: string
  }

  membership_cta: {
    badge: string
    title: string
    description: string
    primary_btn_text: string
    primary_btn_url: string
    secondary_btn_text: string
    secondary_btn_url: string
  }

  partners_section: {
    title: string
  }
}

// ----------------------------------------------------------------------------
// ABOUT PAGE CONTENT SCHEMA
// ----------------------------------------------------------------------------
export interface AboutPageContent {
  header: {
    badge: string
    title: string
    description: string
  }

  vision: {
    title: string
    description: string
  }

  mission: {
    title: string
    description: string
  }

  history: {
    title: string
    banner_badge: string
    banner_text: string
    image_url: string
    image_alt: string
    paragraphs: string[]
  }

  objectives: {
    title: string
    description: string
    items: StrategicObjectiveItem[]
  }

  governance_cta: {
    title: string
    description: string
  }
}

// ----------------------------------------------------------------------------
// CONTACT PAGE CONTENT SCHEMA
// ----------------------------------------------------------------------------
export interface ContactPageContent {
  header: {
    badge: string
    title: string
    description: string
  }

  details: {
    title: string
    subtitle: string
    address: string
    phone: string
    alternate_phone?: string
    email: string
    working_hours: string
  }

  social_links: {
    facebook_url: string
    twitter_url: string
    linkedin_url: string
    youtube_url?: string
  }

  map_info: {
    location_title: string
    location_description: string
    google_maps_embed_url?: string
  }
}

// ----------------------------------------------------------------------------
// MEMBERSHIP PAGE CONTENT SCHEMA
// ----------------------------------------------------------------------------
export interface MembershipPageContent {
  header: {
    badge: string
    title: string
    description: string
  }

  why_join: {
    title: string
    description: string
    benefits: Array<{ title: string; description: string }>
  }

  cta: {
    title: string
    description: string
    apply_btn_text: string
    contact_email: string
  }
}

// ============================================================================
// Default Fallbacks (Guarantee CSS & Layout Integrity)
// ============================================================================

export const DEFAULT_HOME_PAGE_CONTENT: HomePageContent = {
  hero_slides: [
    {
      image_url: '/photos/fosta-stakeholders-dialogue.jpg',
      alt_text: 'FoSTA Health Stakeholders Policy Dialogue in Lusaka',
      caption: 'FoSTA Health Stakeholders Policy Dialogue',
    },
    {
      image_url: '/photos/agricultural-budget-analysis.jpg',
      alt_text: 'National Agricultural Budget Analysis and Validation Session',
      caption: 'National Agricultural Budget Analysis',
    },
    {
      image_url: '/photos/beef-report-workshop.jpg',
      alt_text: 'Livestock and Beef Value Chain Report Dissemination Workshop',
      caption: 'Livestock & Beef Value Chain Dissemination',
    },
    {
      image_url: '/photos/budget-proposal-workshop.jpg',
      alt_text: 'Agricultural Policy Budget Proposal Consultative Workshop',
      caption: 'Agricultural Budget Proposal Consultative Forum',
    },
  ],

  stats: [
    { label: 'Policy Dialogues Held', value: '120+', order: 1 },
    { label: 'Research Publications', value: '85+', order: 2 },
    { label: 'Farmer Groups Reached', value: '50,000+', order: 3 },
    { label: 'Stakeholder Partners', value: '40+', order: 4 },
  ],

  about_snippet: {
    badge: 'About The Forum',
    title: 'A Neutral Platform for Agricultural Policy Reform',
    description:
      "The Agricultural Consultative Forum (ACF) unites government, agribusiness, research institutions, and smallholder farmers to drive evidence-based policy reform and sustainable agriculture in Zambia.",
    feature_1: {
      title: 'Evidence-Based Decisions',
      description: 'Empirical data guiding timely national agricultural policy actions.',
    },
    feature_2: {
      title: 'Inclusive Land Rights',
      description: 'Advocating secure tenure and equal rights for women smallholders.',
    },
    primary_btn_text: 'About ACF',
    primary_btn_url: '/about',
    secondary_btn_text: 'Leadership & Team',
    secondary_btn_url: '/about/management',
  },

  strategic_objectives: {
    title: 'ACF Strategic Objectives',
    objectives: [
      {
        num: 1,
        title: 'Stakeholder Mobilisation',
        description: 'Mobilise actors nationwide for constructive agricultural policy dialogue.',
      },
      {
        num: 2,
        title: 'Credible Evidence Generation',
        description: 'Provide empirical assessments on budgets, food markets, and input systems.',
      },
      {
        num: 3,
        title: 'Knowledge Management',
        description: 'Maintain a trusted central repository of Zambian agricultural publications.',
      },
      {
        num: 4,
        title: 'Tenure & Gender Equity',
        description: 'Champion secure customary tenure and equal land rights for women farmers.',
      },
    ],
  },

  programmes_section: {
    badge: 'Our Work',
    title: 'Core Thematic Programmes',
    description:
      'Dedicated programmes addressing systemic challenges in agricultural productivity, trade policy, and environmental sustainability.',
    view_all_text: 'View All Programmes',
  },

  news_events_section: {
    news_badge: 'Updates',
    news_title: 'Sector News & Articles',
    events_badge: 'Dialogues',
    events_title: 'Upcoming Events',
  },

  publications_section: {
    badge: 'Knowledge Hub',
    title: 'Recent Publications & Policy Briefs',
    description:
      'Independent policy briefs, analytical research reports, and technical guides authored or published by ACF.',
    view_all_text: 'Browse All Publications',
  },

  membership_cta: {
    badge: 'Stakeholder Engagement',
    title: 'Join the Agricultural Consultative Forum',
    description:
      'Whether you represent a smallholder farmer cooperative, an agricultural enterprise, or a research institution, membership gives you a voice in national policy dialogue roundtables.',
    primary_btn_text: 'Apply for Membership',
    primary_btn_url: '/membership/apply',
    secondary_btn_text: 'Membership Categories & Benefits',
    secondary_btn_url: '/membership',
  },

  partners_section: {
    title: 'Our Collaborating Institutions & Partners',
  },
}

export const DEFAULT_ABOUT_PAGE_CONTENT: AboutPageContent = {
  header: {
    badge: 'Institutional Mandate',
    title: 'About the Agricultural Consultative Forum',
    description:
      'A trusted multi-stakeholder platform fostering collaborative dialogue, evidence-based policy formulation, and sustainable agricultural progress in Zambia.',
  },

  vision: {
    title: 'Our Vision',
    description:
      'A viable, equitable, and climate-resilient agricultural sector in Zambia where smallholder farmers, agribusinesses, and rural communities flourish through transparent, evidence-based policy frameworks.',
  },

  mission: {
    title: 'Our Mission',
    description:
      'To contribute to a responsive agricultural sector through evidence-based policy analysis, knowledge management, multi-stakeholder dialogue, and strategic advocacy for sustainable agricultural development.',
  },

  history: {
    title: 'Background & History',
    banner_badge: 'National Policy Dialogue • Lusaka',
    banner_text:
      'ACF convening multi-sector stakeholders, government ministries, and smallholder farmer groups to deliberate on national food security and agrarian transformation.',
    image_url: '/photos/fosta-stakeholders-dialogue.jpg',
    image_alt: 'ACF Stakeholders Policy Dialogue in Lusaka',
    paragraphs: [
      "The Agricultural Consultative Forum (ACF) was created out of a recognised need for a neutral, inclusive, and evidence-driven forum where all stakeholders in Zambia's agricultural sector could converge to discuss policy hurdles and build national consensus.",
      'For decades, agricultural policy debates in Zambia were often fragmented across isolated public consultations, commercial farming demands, and donor programmes. ACF bridged this divide by institutionalising structured dialogues between the Ministry of Agriculture, research institutes, farmer federations, and agro-enterprises.',
      'Today, ACF serves as a premier knowledge and advocacy hub, actively participating in parliamentary submissions, national agricultural investment plans, and grassroots smallholder empowerment programmes across Zambia.',
    ],
  },

  objectives: {
    title: 'Key Strategic Objectives',
    description: "ACF operates under four core pillars established to serve Zambia's agricultural constituents.",
    items: [
      {
        num: '01',
        title: 'Multi-Stakeholder Mobilisation & Advocacy',
        description:
          'Mobilising stakeholders across all provinces for policy dialogue, review of legislation, and formulation of inclusive agricultural investment plans.',
      },
      {
        num: '02',
        title: 'Empirical Research & Credible Evidence',
        description:
          'Generating unbiased analytical studies, performance assessments of input subsidies, and commodity trade reviews to back timely policy decisions.',
      },
      {
        num: '03',
        title: 'Sector Knowledge Hub & Dissemination',
        description:
          'Providing an open repository of publications, policy briefs, and advisory notes accessible to farmers, students, researchers, and government leaders.',
      },
      {
        num: '04',
        title: 'Tenure Security & Gender Equality',
        description:
          'Advocating for secure customary land rights, transparent land allocation, and equitable economic empowerment for women and youth farmers.',
      },
    ],
  },

  governance_cta: {
    title: 'Explore ACF Governance & People',
    description: 'Meet our Board of Directors, Management Team, and dedicated Secretariat Staff.',
  },
}

export const DEFAULT_CONTACT_PAGE_CONTENT: ContactPageContent = {
  header: {
    badge: 'ACF Secretariat',
    title: 'Contact the Secretariat',
    description:
      'Get in touch with our team in Lusaka for policy dialogue enquiries, publications access, or stakeholder membership information.',
  },

  details: {
    title: 'Secretariat Details',
    subtitle: 'Visit or call our offices during business hours (Central Africa Time).',
    address: '24 Elm Rd, Woodlands, Lusaka, Zambia',
    phone: '+260 95 4755071',
    alternate_phone: '+260 21 1260000',
    email: 'info@acfzambia.org',
    working_hours: 'Monday - Friday: 08:00 - 17:00 (CAT)',
  },

  social_links: {
    facebook_url: 'https://facebook.com/ACFZambia',
    twitter_url: 'https://twitter.com/ACFZambia',
    linkedin_url: 'https://linkedin.com/company/acfzambia',
    youtube_url: '',
  },

  map_info: {
    location_title: 'Secretariat Location',
    location_description: 'Situated in Woodlands, Lusaka, accessible to public and private stakeholders.',
  },
}

export const DEFAULT_MEMBERSHIP_PAGE_CONTENT: MembershipPageContent = {
  header: {
    badge: 'Stakeholder Engagement',
    title: 'ACF Membership & Strategic Partnership',
    description:
      'Become part of Zambia’s premier agricultural policy dialogue platform and amplify your voice in shaping national agricultural development.',
  },

  why_join: {
    title: 'Why Join the Agricultural Consultative Forum?',
    description:
      'ACF membership connects farmer federations, agro-processors, input suppliers, researchers, and civil society directly to high-level policy reform roundtables.',
    benefits: [
      {
        title: 'Policy Influence & Advocacy',
        description: 'Direct representation in parliamentary reviews, national budget dialogues, and sector reform submissions.',
      },
      {
        title: 'Priority Publications & Intelligence',
        description: 'Early access to empirical sector reports, market intelligence, policy briefs, and commodity data.',
      },
      {
        title: 'National & Regional Networking',
        description: 'Participate in consultative roundtables, annual symposiums, and stakeholder collaborative networks.',
      },
    ],
  },

  cta: {
    title: 'Ready to Become an ACF Member?',
    description: 'Submit an online application or contact our Secretariat membership desk for onboarding assistance.',
    apply_btn_text: 'Submit Online Application',
    contact_email: 'membership@acfzambia.org',
  },
}
