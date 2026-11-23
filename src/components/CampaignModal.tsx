import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CampaignChannel, CampaignMetric, CampaignStatus } from '../types/app';
import {
  CAMPAIGN_CHANNELS,
  CAMPAIGN_STATUSES,
  DATE_REGEX,
  LIMITS,
  clampNumber,
  formatCurrency,
  sanitizeString,
} from '../lib/validation';

export interface CampaignPayload {
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

interface CampaignModalProps {
  isOpen: boolean;
  editingCampaign: CampaignMetric | null;
  onClose: () => void;
  onSave: (payload: CampaignPayload, existingId?: string) => void;
}

const DEFAULT_DATE = () => new Date().toISOString().slice(0, 10);

export function CampaignModal({
  isOpen,
  editingCampaign,
  onClose,
  onSave,
}: CampaignModalProps) {
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<CampaignChannel>('Corporate Comms');
  const [status, setStatus] = useState<CampaignStatus>('Active');
  const [impressions, setImpressions] = useState('32000');
  const [leads, setLeads] = useState('940');
  const [conversions, setConversions] = useState('185');
  const [spend, setSpend] = useState('2400');
  const [revenue, setRevenue] = useState('14800');
  const [periodDate, setPeriodDate] = useState(DEFAULT_DATE());
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (editingCampaign) {
      setTitle(editingCampaign.title);
      setChannel(editingCampaign.channel);
      setStatus(editingCampaign.status);
      setImpressions(String(editingCampaign.impressions));
      setLeads(String(editingCampaign.leads));
      setConversions(String(editingCampaign.conversions));
      setSpend(String(editingCampaign.spend));
      setRevenue(String(editingCampaign.revenue));
      setPeriodDate(editingCampaign.periodDate);
      setNotes(editingCampaign.notes);
    } else {
      setTitle('');
      setChannel('Corporate Comms');
      setStatus('Active');
      setImpressions('32000');
      setLeads('940');
      setConversions('185');
      setSpend('2400');
      setRevenue('14800');
      setPeriodDate(DEFAULT_DATE());
      setNotes('');
    }
  }, [editingCampaign, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const numSpend = clampNumber(Number(spend), 0, LIMITS.SPEND_MAX);
  const numRev = clampNumber(Number(revenue), 0, LIMITS.REVENUE_MAX);
  const numLeads = clampNumber(Number(leads), 0, LIMITS.LEADS_MAX);
  const numConv = clampNumber(Number(conversions), 0, LIMITS.CONVERSIONS_MAX);
  const previewRoi = numSpend > 0 ? Math.round(((numRev - numSpend) / numSpend) * 100) : 0;
  const previewConvRate = numLeads > 0 ? ((numConv / numLeads) * 100).toFixed(1) : '0.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanTitle = sanitizeString(title, LIMITS.CAMPAIGN_TITLE_MAX);
    const cleanNotes = sanitizeString(notes, LIMITS.CAMPAIGN_NOTES_MAX);
    const cleanDate = periodDate.trim();

    if (cleanTitle.length < LIMITS.CAMPAIGN_TITLE_MIN) {
      setError(`Campaign title must be at least ${LIMITS.CAMPAIGN_TITLE_MIN} characters.`);
      return;
    }

    if (!DATE_REGEX.test(cleanDate)) {
      setError('Reporting date must use YYYY-MM-DD format.');
      return;
    }

    onSave(
      {
        title: cleanTitle,
        channel,
        status,
        impressions: clampNumber(Number(impressions), 0, LIMITS.IMPRESSIONS_MAX),
        leads: numLeads,
        conversions: numConv,
        spend: numSpend,
        revenue: numRev,
        periodDate: cleanDate,
        notes: cleanNotes,
      },
      editingCampaign?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-2 mb-2" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <h3
              id="campaign-modal-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              {editingCampaign ? 'Update Campaign Entry' : 'Add Campaign Entry'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Updates charts, channel attribution, and KPI summaries immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[44px] min-w-[44px] -mr-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="campaign-title"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Initiative / Campaign Name
            </label>
            <input
              id="campaign-title"
              type="text"
              required
              minLength={LIMITS.CAMPAIGN_TITLE_MIN}
              maxLength={LIMITS.CAMPAIGN_TITLE_MAX}
              placeholder="e.g. Q4 Brand Governance & Intranet Rollout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="campaign-channel"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Channel
              </label>
              <select
                id="campaign-channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value as CampaignChannel)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {CAMPAIGN_CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="campaign-status"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Status
              </label>
              <select
                id="campaign-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {CAMPAIGN_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="campaign-date"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Reporting Date
              </label>
              <input
                id="campaign-date"
                type="date"
                required
                value={periodDate}
                onChange={(e) => setPeriodDate(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="campaign-impressions"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Reach / Impressions
              </label>
              <input
                id="campaign-impressions"
                type="number"
                min={0}
                max={LIMITS.IMPRESSIONS_MAX}
                required
                value={impressions}
                onChange={(e) => setImpressions(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="campaign-leads"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Engagements / Leads
              </label>
              <input
                id="campaign-leads"
                type="number"
                min={0}
                max={LIMITS.LEADS_MAX}
                required
                value={leads}
                onChange={(e) => setLeads(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="campaign-conversions"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Conversions
              </label>
              <input
                id="campaign-conversions"
                type="number"
                min={0}
                max={LIMITS.CONVERSIONS_MAX}
                required
                value={conversions}
                onChange={(e) => setConversions(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="campaign-spend"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Budget / Spend ($)
              </label>
              <input
                id="campaign-spend"
                type="number"
                min={0}
                max={LIMITS.SPEND_MAX}
                required
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="col-span-2 sm:col-span-2">
              <label
                htmlFor="campaign-revenue"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Attributed Value / Revenue ($)
              </label>
              <input
                id="campaign-revenue"
                type="number"
                min={0}
                max={LIMITS.REVENUE_MAX}
                required
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Conversion Rate:{' '}
              <strong className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {previewConvRate}%
              </strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              Net Return ({formatCurrency(numRev - numSpend)}):{' '}
              <strong
                className={`font-mono tabular-nums ${
                  previewRoi >= 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {previewRoi >= 0 ? `+${previewRoi}%` : `${previewRoi}%`} ROI
              </strong>
            </span>
          </div>

          <div>
            <label
              htmlFor="campaign-notes"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Notes &amp; Takeaways
            </label>
            <textarea
              id="campaign-notes"
              rows={2}
              maxLength={LIMITS.CAMPAIGN_NOTES_MAX}
              placeholder="Stakeholder takeaways, funnel optimizations, or workflow notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              {editingCampaign ? 'Save Changes' : 'Save Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
