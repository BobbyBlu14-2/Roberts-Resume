import type {
  CampaignCreativeAsset,
  CampaignMetric,
  CaseStudy,
  EducationItem,
  ExperienceItem,
  SkillGroup,
} from '../types/app';

export const PROFILE_INFO = {
  fullName: 'Robert Philizaire Jr.',
  nickname: 'Bobby',
  pronunciation: 'Rōh-Bear Fill-iz-air',
  brandName: 'Blu Marketing Group',
  bluLogoUrl: '/assets/aistudio/1_4c497087.png',
  location: 'Dacula, GA',
  phone: '470-843-9450',
  secondaryPhone: '678-510-3829',
  primaryEmail: 'BobbyBlu14@gmail.com',
  agencyEmail: 'BluMarketingGrp@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/robertphilizaire/',
  linkedinLabel: 'linkedin.com/in/robertphilizaire',
  headline: 'Corporate Communications, Brand Governance & Marketing Project Leadership.',
  bio: 'Communications and Marketing Specialist with 10+ years of experience driving corporate communications, global brand governance, agile-influenced marketing operations, executive presentations, and full-stack digital execution. Proven track record translating complex business and healthcare concepts into clear, measurable campaigns across enterprise, agency, and entrepreneurial teams.',
  quote: {
    text: 'Only those who will risk going too far can find out how far one can go.',
    author: 'T.S. Eliot',
  },
  testimonial: {
    quote:
      'Bobby is recognized around campus as a genuine team player with a can-do attitude. During four years of direct collaboration across event calendars, logos, posters, banners, print ads, and web graphics, his eye for design and command of leading software proved first-rate.',
    author: 'Emily Rowland Wells',
    role: 'Project Coordinator, Student Affairs · Kennesaw State University',
  },
  heroImage: '/assets/aistudio/Robert_Philizaire_pic_0dc94937.png',
  avatarImage: '/assets/aistudio/Robert_Philizaire_pic_0dc94937.png',
};

export const OHA_CAMPAIGN_ASSETS: CampaignCreativeAsset[] = [
  {
    id: 'oha-benefits-post',
    title: 'Timeless IV — Luxury Wellness Benefits',
    format: 'Social Feed Graphic · 4:5',
    aspect: 'portrait',
    caption:
      'Highlights Antioxidant Support, Cellular Wellness, and Healthy Aging Support with crisp $199 pricing anchor and Optimal Health ATL branding.',
    imageUrl: '/assets/aistudio/Timeless_IV_Luxury_Wellness_Benefits__1__33ff7bfb.png',
  },
  {
    id: 'oha-glow-emerald',
    title: 'Timeless IV — Glow in Emerald Booking Post',
    format: 'Conversion Promo Graphic · 4:5',
    aspect: 'portrait',
    caption:
      'Direct-response social creative featuring appointment CTA, Suwanee clinic address, phone (770-614-6000), and optimalhealthatl.com booking link.',
    imageUrl: '/assets/aistudio/Timeless_IV_Glow_in_Emerald_1_d5b3a747.png',
  },
  {
    id: 'oha-video-reel',
    title: 'Timeless IV — Short-Form Video & Reel Cover',
    format: 'Vertical Video / Reel · 9:16',
    aspect: 'tall',
    caption:
      'Vertical story and video reel campaign asset designed for Instagram Reels, TikTok, and YouTube Shorts patient awareness campaigns.',
    imageUrl: '/assets/aistudio/Timeless_Movie_7a3127f3.png',
  },
];

export const RESUME_TRACKS = [
  {
    id: 'communications',
    label: 'Communications & Brand Specialist',
    summary:
      'Corporate & internal communications, employee engagement, change communications, executive presentations, and global brand governance (150–200 global Brand Ambassadors, 30–40 daily inquiries, DAM & SOP stewardship).',
    highlights: [
      'Corporate & Change Communications',
      'Executive Decks & Stakeholder Alignment',
      'Digital Asset Management (DAM) & SOPs',
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing Specialist & Project Manager',
    summary:
      'End-to-end digital marketing campaigns, healthcare marketing operations, agile/scrum-inspired workflows, CRM & AI automation (HubSpot, GoHighLevel, Asana, Jira), and full-stack web delivery.',
    highlights: [
      'Agile Project Management & Delivery',
      'SEO / SEM, Funnels & CRM Automation',
      'AI-Assisted Content & Video Production',
    ],
  },
] as const;

export const CORE_TALENTS = [
  {
    index: '01',
    title: 'Corporate & Change Communications',
    description:
      'Translating organizational initiatives, leadership messaging, SOPs, and policy updates into clear intranet, email, and executive presentation materials.',
    deliverable: '30–40 Daily Brand Inquiries Resolved',
  },
  {
    index: '02',
    title: 'Global Brand Governance & DAM',
    description:
      'Leading multi-region brand transitions, stewarding Digital Asset Management (DAM) libraries, and aligning international stakeholders around unified brand standards.',
    deliverable: '150–200 Global Brand Ambassadors Supported',
  },
  {
    index: '03',
    title: 'Marketing Operations & Agile Project Management',
    description:
      'Coordinating designers, developers, vendors, and leadership across concurrent web, SEO, video, and healthcare marketing projects using Asana, Jira, and Workfront.',
    deliverable: '50+ Businesses & Teams Served',
  },
  {
    index: '04',
    title: 'Digital Campaigns, CRM & Full-Stack Web',
    description:
      'Building WordPress and full-stack web experiences connected to HubSpot, GoHighLevel, analytics dashboards, and AI-assisted multimedia workflows.',
    deliverable: '150+ Tracked Campaigns & Web Builds',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'optimal-health-atl',
    title: 'Optimal Health ATL — Timeless IV Campaign & Ops',
    client: 'Optimal Health ATL · Suwanee, GA',
    discipline: 'Healthcare Comms · Video & Social Creative',
    year: 'Current',
    summary:
      'Directed the Timeless IV launch across social graphics, vertical video reels, website copy, and booking workflows—combining luxury wellness visuals with compliant healthcare messaging.',
    outcomeMetric: 'Multi-Format Video & Social Campaign Suite',
    imageUrl: '/assets/aistudio/Timeless_IV_Glow_in_Emerald_1_d5b3a747.png',
    deliverables: [
      'Timeless IV Social Graphics & Booking Creative',
      'Vertical Video & Reel Campaign Production',
      'Claims & Privacy-Conscious Healthcare Copy',
      'Patient Onboarding Workflows & Operational SOPs',
    ],
    details:
      'Partnered with Optimal Health ATL leadership to launch the Timeless IV wellness campaign across Instagram, Facebook, vertical video reels, and clinic booking funnels. Produced cohesive emerald-and-gold visual assets highlighting cellular wellness and antioxidant support while coordinating vendor timelines, website updates, and internal intake workflows.',
    gallery: OHA_CAMPAIGN_ASSETS,
  },
  {
    id: 'bd-global-brand-governance',
    title: 'Enterprise Brand Transition & Japan Governance Alignment',
    client: 'BD (Becton Dickinson) · Corporate Marketing',
    discipline: 'Change Comms · Global Brand Governance',
    year: '2022 – 2023',
    summary:
      'Served as Lead Global Brand Ambassador supporting 150–200 ambassadors worldwide, managing 30–40 daily brand inquiries, and resolving a cross-time-zone governance alignment with BD Japan.',
    outcomeMetric: '200 Global Ambassadors · Japan Alignment Approved',
    imageUrl: '/src/assets/images/project_bd_corporate_1795450411247.jpg',
    deliverables: [
      'Global Brand Transition Rollout & Templates',
      'BD Japan Cross-Time-Zone Alignment & Animated Assets',
      'Digital Asset Management (DAM), SOPs & FAQs',
      'Executive Presentations & Company-Wide Decks',
    ],
    details:
      'Supported BD’s central Corporate Marketing organization across internal communications, executive presentations, and global brand governance. Organized cross-time-zone discussions between Corporate Marketing and BD Japan to reconcile enterprise brand requirements with regional communication preferences, resulting in full alignment and approved BD-specific animated assets.',
  },
  {
    id: 'blu-marketing-group',
    title: 'Blu Marketing Group — Growth, CRM & Web Systems',
    client: 'Blu Marketing Group · 50+ Small Businesses',
    discipline: 'Marketing Strategy · Agile PM · Full-Stack Web',
    year: '2010 – Present',
    summary:
      'Led end-to-end marketing strategies, WordPress & custom websites, SEO/SEM campaigns, and HubSpot/GoHighLevel CRM automation powered by agile workflows and AI tools.',
    outcomeMetric: '150+ Campaigns · 50+ Clients Launched',
    imageUrl: '/src/assets/images/project_lead_funnel_1795243574023.jpg',
    deliverables: [
      'Websites, Landing Pages & Brand Collateral',
      'HubSpot & GoHighLevel CRM Automation',
      'Agile Project Intake & Vendor Management',
      'AI-Assisted Multimedia & Video Production',
    ],
    details:
      'Founded Blu Marketing Group to deliver agency-caliber brand strategy, web development, and performance marketing to healthcare brands, startups, and local businesses. Combined Canva, Adobe Premiere, CapCut, and AI-assisted research with human editorial review to accelerate campaign velocity.',
  },
  {
    id: 'thl-online-presence',
    title: 'Global Non-Profit Identity & Digital Ecosystem',
    client: 'The Haitian League & KSU MSRS Dept',
    discipline: 'Brand Identity · Print & Digital Media',
    year: 'Featured Community Work',
    summary:
      'Built unified web and social extensions for The Haitian League alongside 8 years of campus event calendars, logos, posters, and web graphics at Kennesaw State University.',
    outcomeMetric: 'Cohesive Multi-Platform Community Presence',
    imageUrl: '/src/assets/images/project_haitian_league_1795243573353.jpg',
    deliverables: [
      'Flagship Non-Profit Website & Social Extensions',
      'Event Calendars, Posters & Large-Format Banners',
      'Institutional Logos & Visual Guidelines',
      'Cross-Departmental Campaign Support',
    ],
    details:
      'Created a unified online presence for The Haitian League to connect global diaspora supporters, building upon extensive visual communication experience produced for Kennesaw State University’s Cultural Awareness & Resource Center.',
  },
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    id: 'optimal-health',
    role: 'Marketing Operations Manager',
    organization: 'Optimal Health ATL',
    period: 'Current',
    location: 'Suwanee & Atlanta Metro, GA',
    track: 'both',
    highlights: [
      'Support leadership with marketing communications, digital content, campaign planning, executive presentations, and operational reporting.',
      'Direct campaign creative across social post graphics and vertical video reels (such as the Timeless IV wellness launch), maintaining careful attention to claims, privacy, and brand consistency.',
      'Coordinate website copy, social media communications, video campaigns, and lead generation initiatives across leadership and external vendors.',
      'Develop internal workflows, onboarding systems, forms, and operational documentation to support consistent execution.',
    ],
  },
  {
    id: 'bd-corporate',
    role: 'Corporate Marketing Communications Coordinator | Lead Global Brand Ambassador',
    organization: 'BD (Becton Dickinson)',
    period: 'Feb 2022 – Jan 2023',
    location: 'Corporate Marketing · Global',
    track: 'communications',
    highlights: [
      'Supported central Corporate Marketing with internal communications, global brand governance, executive presentations, and enterprise marketing initiatives.',
      'Served as Lead Global Brand Ambassador supporting 150–200 brand ambassadors and marketing managers across international regions.',
      'Managed 30–40 internal brand inquiries daily, interpreting SOPs, FAQs, and brand standards while connecting teams with subject-matter experts.',
      'Resolved cross-time-zone regional brand governance challenge with BD Japan, aligning enterprise requirements with regional needs to deliver approved animated assets.',
      'Maintained Digital Asset Management (DAM) libraries, leadership decks, templates, and cross-functional action tracking across Marketing, Sales, HR, and IT.',
    ],
  },
  {
    id: 'blu-marketing-group',
    role: 'Founder | Marketing Specialist & Project Manager',
    organization: 'Blu Marketing Group',
    period: '2010 – Present',
    location: 'Dacula, GA',
    track: 'marketing',
    highlights: [
      'Lead end-to-end marketing, communications, and branding strategies for healthcare brands, small businesses, startups, and technology clients.',
      'Manage concurrent projects across WordPress/custom websites, SEO/SEM campaigns, landing pages, email newsletters, and social advertising.',
      'Implement agile-inspired intake, timeline tracking, and vendor coordination using Asana, Jira, Trello, Microsoft 365, and Google Workspace.',
      'Integrate HubSpot, GoHighLevel, CRM automations, and AI-assisted workflows (ChatGPT, Claude, Canva, Premiere, CapCut) with human editorial refinement.',
    ],
  },
  {
    id: 'social-wealth',
    role: 'Lead Gen Marketing Media Coordinator',
    organization: 'Social Wealth Marketing',
    period: '2016 – 2020',
    location: 'Atlanta Metro, GA',
    track: 'marketing',
    highlights: [
      'Created and maintained omnichannel digital content (branding, social campaigns, video, and paid ads) grounded in market research and historical sales data.',
      'Engineered split-tested lead funnels and integrated third-party APIs with CRM pipelines to automate tracking.',
      'Directed designers and videographers to ship campaign creative on schedule across client accounts.',
    ],
  },
  {
    id: 'ksu-msrs',
    role: 'Program Coordinator Assistant',
    organization: 'Kennesaw State University · MSRS Dept',
    period: '2007 – 2015',
    location: 'Kennesaw, GA',
    track: 'both',
    highlights: [
      'Supported the Cultural Awareness & Resource Center within Multicultural Student Retention Services.',
      'Designed campus-wide event calendars, logos, posters, banners, print advertisements, and digital web graphics.',
    ],
  },
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    id: 'ksu-ba',
    degree: 'Bachelor of Arts in Business Marketing',
    institution: 'Kennesaw State University',
    focus: 'Brand Management, Consumer Behavior, Integrated Marketing & Business Strategy',
  },
  {
    id: 'gt-fullstack',
    degree: 'Full Stack Web Development Certification',
    institution: 'Georgia Institute of Technology',
    focus: 'Modern JavaScript/TypeScript, React, Node.js, APIs & Responsive Web Engineering',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'comms-governance',
    title: 'Communications & Brand Governance',
    items: [
      'Corporate & Internal Communications',
      'Executive Presentations & Decks',
      'Change Communications & SOPs',
      'Employee & Stakeholder Engagement',
      'Global Brand Standards & DAM',
      'Audience Segmentation & Storytelling',
    ],
  },
  {
    id: 'marketing-pm',
    title: 'Marketing Strategy & Project Management',
    items: [
      'Agile & Scrum-Inspired Workflows',
      'Multi-Channel Campaign Execution',
      'SEO / SEM & Lead Funnel Strategy',
      'Healthcare Marketing Operations',
      'Vendor & Cross-Functional Leadership',
      'Campaign Measurement & Reporting',
    ],
  },
  {
    id: 'tools-ai',
    title: 'Platforms, CRM, AI & Creative Suite',
    items: [
      'Microsoft 365 & Corporate Intranets',
      'Google Workspace, Jira, Asana & Workfront',
      'HubSpot, GoHighLevel & CRM Automation',
      'WordPress, HTML/CSS & Full-Stack Web',
      'Canva, Adobe Premiere, CapCut & Artlist',
      'ChatGPT, Claude & AI Content Workflows',
    ],
  },
];

export const SAMPLE_CAMPAIGNS: Omit<CampaignMetric, 'id'>[] = [
  {
    title: 'Global Brand Transition Intranet Rollout',
    channel: 'Brand Governance',
    status: 'Completed',
    impressions: 94500,
    leads: 1850,
    conversions: 640,
    spend: 3400,
    revenue: 24800,
    periodDate: '2026-06-18',
    notes: 'Enterprise brand governance kit & ambassador alignment across 200 global leads.',
  },
  {
    title: 'Executive Town Hall & Change Comms Series',
    channel: 'Corporate Comms',
    status: 'Completed',
    impressions: 62000,
    leads: 1420,
    conversions: 510,
    spend: 1800,
    revenue: 16500,
    periodDate: '2026-07-14',
    notes: 'Leadership presentations, FAQ hub, and internal employee engagement comms.',
  },
  {
    title: 'Optimal Health ATL — Timeless IV Launch',
    channel: 'Healthcare Ops',
    status: 'Active',
    impressions: 118400,
    leads: 3260,
    conversions: 715,
    spend: 4200,
    revenue: 38900,
    periodDate: '2026-08-22',
    notes: 'Timeless IV social graphics, vertical video reels, and Suwanee clinic booking funnel.',
  },
  {
    title: 'Blu Marketing Local Search & SEM Engine',
    channel: 'SEO/SEM',
    status: 'Active',
    impressions: 148200,
    leads: 4120,
    conversions: 685,
    spend: 5100,
    revenue: 36400,
    periodDate: '2026-09-15',
    notes: 'High-intent search campaigns synced with HubSpot & GoHighLevel CRM workflows.',
  },
  {
    title: 'Short-Form Video & AI Content Sprint',
    channel: 'Social Media',
    status: 'Active',
    impressions: 186000,
    leads: 3940,
    conversions: 490,
    spend: 3100,
    revenue: 27600,
    periodDate: '2026-10-19',
    notes: 'Premiere & CapCut video reels paired with AI-assisted script iteration.',
  },
  {
    title: 'Client Portal & Analytics Web App',
    channel: 'Web/App',
    status: 'Planned',
    impressions: 42500,
    leads: 1290,
    conversions: 280,
    spend: 2600,
    revenue: 19200,
    periodDate: '2026-11-10',
    notes: 'Full-stack React reporting interface with automated lead attribution.',
  },
];
