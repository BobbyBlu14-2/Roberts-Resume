export type NavSection = 'overview' | 'portfolio' | 'dashboard' | 'experience' | 'contact';

export type CampaignChannel =
  | 'Corporate Comms'
  | 'Brand Governance'
  | 'SEO/SEM'
  | 'Social Media'
  | 'Healthcare Ops'
  | 'Web/App';

export type CampaignStatus = 'Active' | 'Planned' | 'Paused' | 'Completed';

export type InquiryServiceType =
  | 'Corporate Communications'
  | 'Brand Governance & DAM'
  | 'Marketing Operations & PM'
  | 'SEO/SEM & Lead Gen'
  | 'Web & App Development';

export type InquiryBudgetTier =
  | 'Full-Time Role'
  | 'Consulting / Retainer'
  | 'Project ($2.5k - $10k)'
  | 'Enterprise ($10k+)';

export interface CampaignMetric {
  id: string;
  title: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  impressions: number;
  leads: number;
  conversions: number;
  spend: number;
  revenue: number;
  periodDate: string;
  notes: string;
}

export interface CampaignCreativeAsset {
  id: string;
  title: string;
  format: string;
  aspect: 'portrait' | 'square' | 'tall';
  caption: string;
  imageUrl: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  discipline: string;
  year: string;
  summary: string;
  outcomeMetric: string;
  imageUrl: string;
  deliverables: string[];
  details: string;
  gallery?: CampaignCreativeAsset[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  track: 'communications' | 'marketing' | 'both';
  highlights: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  focus: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}
