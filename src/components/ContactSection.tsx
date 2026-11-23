import { useState, useEffect } from 'react';
import { CheckCircle2, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react';
import type { InquiryBudgetTier, InquiryServiceType } from '../types/app';
import { PROFILE_INFO } from '../data/siteContent';
import {
  INQUIRY_BUDGET_TIERS,
  INQUIRY_SERVICE_TYPES,
  LIMITS,
  generateSafeDocId,
  sanitizeString,
} from '../lib/validation';

interface SavedInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  serviceType: InquiryServiceType;
  budgetTier: InquiryBudgetTier;
  message: string;
  submittedAt: string;
}

interface ContactSectionProps {
  preselectedSubject?: string;
}

const INQUIRY_STORAGE_KEY = 'blu_submitted_briefs_v1';

export function ContactSection({ preselectedSubject }: ContactSectionProps) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [serviceType, setServiceType] = useState<InquiryServiceType>('Corporate Communications');
  const [budgetTier, setBudgetTier] = useState<InquiryBudgetTier>('Full-Time Role');
  const [message, setMessage] = useState('');
  const [submittedBrief, setSubmittedBrief] = useState<SavedInquiry | null>(null);
  const [formError, setFormError] = useState('');
  const [inquiries, setInquiries] = useState<SavedInquiry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(INQUIRY_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as SavedInquiry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (preselectedSubject) {
      setMessage((prev) =>
        prev.trim().length > 0
          ? prev
          : `Interested in discussing work similar to: ${preselectedSubject}. `
      );
    }
  }, [preselectedSubject]);

  useEffect(() => {
    try {
      localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(inquiries));
    } catch {
      // Ignore storage quota errors
    }
  }, [inquiries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmittedBrief(null);

    const cleanName = sanitizeString(senderName, LIMITS.INQUIRY_NAME_MAX);
    const cleanEmail = sanitizeString(senderEmail, LIMITS.INQUIRY_EMAIL_MAX);
    const cleanMsg = sanitizeString(message, LIMITS.INQUIRY_MESSAGE_MAX);

    if (cleanName.length < LIMITS.INQUIRY_NAME_MIN) {
      setFormError('Please enter your name (at least 2 characters).');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (cleanMsg.length < LIMITS.INQUIRY_MESSAGE_MIN) {
      setFormError('Please share at least 10 characters about your role or project.');
      return;
    }

    const entry: SavedInquiry = {
      id: generateSafeDocId('inq'),
      senderName: cleanName,
      senderEmail: cleanEmail,
      serviceType,
      budgetTier,
      message: cleanMsg,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setInquiries((prev) => [entry, ...prev].slice(0, 6));
    setSubmittedBrief(entry);
    setMessage('');
  };

  const buildMailtoHref = (brief: SavedInquiry) => {
    const subject = encodeURIComponent(
      `${brief.serviceType} (${brief.budgetTier}) — ${brief.senderName}`
    );
    const body = encodeURIComponent(
      `Name: ${brief.senderName}\nReply Email: ${brief.senderEmail}\nFocus: ${brief.serviceType}\nEngagement: ${brief.budgetTier}\n\n${brief.message}`
    );
    return `mailto:${PROFILE_INFO.primaryEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Testimonial + Quote Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between gap-5">
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
              &ldquo;{PROFILE_INFO.testimonial.quote}&rdquo;
            </p>
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {PROFILE_INFO.testimonial.author}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {PROFILE_INFO.testimonial.role}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-900/90 text-white p-6 sm:p-8 flex flex-col justify-between gap-5">
            <p className="text-lg sm:text-xl font-display font-semibold leading-snug text-balance">
              &ldquo;{PROFILE_INFO.quote.text}&rdquo;
            </p>
            <p className="text-xs text-slate-400">— {PROFILE_INFO.quote.author}</p>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                Direct Contact
              </p>
              <h2
                id="contact-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
              >
                Connect with Robert Philizaire Jr.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Open to Corporate Communications, Brand Governance, Marketing Project Management, and Healthcare Marketing Operations roles, as well as strategic consulting through Blu Marketing Group.
              </p>
            </div>

            <div className="space-y-2.5 text-sm">
              <a
                href={`tel:${PROFILE_INFO.phone.replace(/-/g, '')}`}
                className="min-h-[44px] flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                <span className="font-mono tabular-nums">{PROFILE_INFO.phone}</span>
              </a>

              <a
                href={`mailto:${PROFILE_INFO.primaryEmail}`}
                className="min-h-[44px] flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                <span>{PROFILE_INFO.primaryEmail}</span>
              </a>

              <a
                href={PROFILE_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                <span>{PROFILE_INFO.linkedinLabel}</span>
              </a>

              <div className="min-h-[44px] flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                <span>{PROFILE_INFO.location}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Send an Opportunity or Project Brief
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Compose your brief below and launch your email client directly with one click.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="inquiry-name"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    minLength={LIMITS.INQUIRY_NAME_MIN}
                    maxLength={LIMITS.INQUIRY_NAME_MAX}
                    placeholder="Alex Morgan"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiry-email"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Your Email
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    maxLength={LIMITS.INQUIRY_EMAIL_MAX}
                    placeholder="alex@company.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="inquiry-service"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Area of Focus
                  </label>
                  <select
                    id="inquiry-service"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as InquiryServiceType)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {INQUIRY_SERVICE_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inquiry-budget"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Engagement Type
                  </label>
                  <select
                    id="inquiry-budget"
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value as InquiryBudgetTier)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {INQUIRY_BUDGET_TIERS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="inquiry-message"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Role or Project Details
                </label>
                <textarea
                  id="inquiry-message"
                  rows={3}
                  required
                  minLength={LIMITS.INQUIRY_MESSAGE_MIN}
                  maxLength={LIMITS.INQUIRY_MESSAGE_MAX}
                  placeholder="Share details on the role, communications initiative, or marketing goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                  {formError}
                </p>
              )}

              {submittedBrief && (
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Brief saved! Send directly via email to {PROFILE_INFO.primaryEmail}.
                  </p>
                  <a
                    href={buildMailtoHref(submittedBrief)}
                    className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Send in Email App
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Prepare &amp; Save Brief
              </button>
            </form>

            {inquiries.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Recent Saved Briefs ({inquiries.length})
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div key={inq.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {inq.serviceType} · {inq.budgetTier}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 truncate">
                          {inq.submittedAt} · {inq.message}
                        </p>
                      </div>
                      <a
                        href={buildMailtoHref(inq)}
                        className="font-medium text-blue-700 dark:text-blue-400 hover:underline shrink-0"
                      >
                        Email
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
