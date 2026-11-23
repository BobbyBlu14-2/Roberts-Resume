import type {
  CampaignChannel,
  CampaignStatus,
  InquiryBudgetTier,
  InquiryServiceType,
} from '../types/app';

export const DATE_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

export const CAMPAIGN_CHANNELS: CampaignChannel[] = [
  'Corporate Comms',
  'Brand Governance',
  'SEO/SEM',
  'Social Media',
  'Healthcare Ops',
  'Web/App',
];

export const CAMPAIGN_STATUSES: CampaignStatus[] = [
  'Active',
  'Planned',
  'Paused',
  'Completed',
];

export const INQUIRY_SERVICE_TYPES: InquiryServiceType[] = [
  'Corporate Communications',
  'Brand Governance & DAM',
  'Marketing Operations & PM',
  'SEO/SEM & Lead Gen',
  'Web & App Development',
];

export const INQUIRY_BUDGET_TIERS: InquiryBudgetTier[] = [
  'Full-Time Role',
  'Consulting / Retainer',
  'Project ($2.5k - $10k)',
  'Enterprise ($10k+)',
];

export const LIMITS = {
  CAMPAIGN_TITLE_MIN: 2,
  CAMPAIGN_TITLE_MAX: 80,
  CAMPAIGN_NOTES_MAX: 500,
  IMPRESSIONS_MAX: 100000000,
  LEADS_MAX: 10000000,
  CONVERSIONS_MAX: 10000000,
  SPEND_MAX: 10000000,
  REVENUE_MAX: 100000000,
  INQUIRY_NAME_MIN: 2,
  INQUIRY_NAME_MAX: 80,
  INQUIRY_EMAIL_MAX: 160,
  INQUIRY_MESSAGE_MIN: 10,
  INQUIRY_MESSAGE_MAX: 1200,
} as const;

export function sanitizeString(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value * 100) / 100));
}

export function generateSafeDocId(prefix: string): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20) || 'item';
  const rand = Math.random().toString(36).slice(2, 10);
  return `${cleanPrefix}_${Date.now()}_${rand}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}
