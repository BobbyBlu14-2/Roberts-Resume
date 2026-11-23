import { useState, useEffect } from 'react';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  ExternalLink,
  Film,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  Moon,
  Sun,
} from 'lucide-react';
import type { CaseStudy, NavSection } from './types/app';
import {
  CASE_STUDIES,
  CORE_TALENTS,
  EDUCATION_ITEMS,
  EXPERIENCE_TIMELINE,
  OHA_CAMPAIGN_ASSETS,
  PROFILE_INFO,
  RESUME_TRACKS,
  SKILL_GROUPS,
} from './data/siteContent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResilientImage } from './components/ResilientImage';
import { PortfolioLightbox } from './components/PortfolioLightbox';
import { InteractiveDashboard } from './components/InteractiveDashboard';
import { ContactSection } from './components/ContactSection';

const NAV_ITEMS: { id: NavSection; label: string; icon: typeof Home }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'portfolio', label: 'Portfolio', icon: FolderKanban },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'experience', label: 'Resume', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
];

type ResumeFilterTrack = 'all' | 'communications' | 'marketing';

function AppContent() {
  const [activeNav, setActiveNav] = useState<NavSection>('overview');
  const [resumeTrack, setResumeTrack] = useState<ResumeFilterTrack>('all');
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [initialAssetId, setInitialAssetId] = useState<string | null>(null);
  const [inquirySubject, setInquirySubject] = useState<string | undefined>(undefined);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('blu-theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('blu-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('blu-theme', 'light');
    }
  }, [darkMode]);

  const scrollToSection = (id: NavSection) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openOhaCreative = (assetId: string) => {
    const ohaStudy = CASE_STUDIES.find((c) => c.id === 'optimal-health-atl');
    if (ohaStudy) {
      setInitialAssetId(assetId);
      setSelectedStudy(ohaStudy);
    }
  };

  const filteredExperience = EXPERIENCE_TIMELINE.filter((role) => {
    if (resumeTrack === 'all') return true;
    return role.track === resumeTrack || role.track === 'both';
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 md:pb-0">
      {/* Top Bar Contract: 3 zones (Wordmark — Nav Links — Primary CTA) */}
      <header className="sticky top-0 z-40 h-12 md:h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element brand wordmark */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('overview');
            }}
            className="text-base sm:text-lg font-display font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
          >
            Robert Philizaire Jr.
          </a>

          {/* Zone 2: Concise single-line desktop nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 hover:text-slate-950 dark:hover:text-white ${
                  activeNav === item.id
                    ? 'text-blue-700 dark:text-blue-400 underline underline-offset-8 decoration-2'
                    : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="min-h-[40px] md:min-h-[44px] px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Let&rsquo;s Connect</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Split + Full-Width Proof Strip */}
        <section id="overview" className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {PROFILE_INFO.location} · ({PROFILE_INFO.pronunciation}) · {PROFILE_INFO.brandName}
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance leading-[1.12]">
                    {PROFILE_INFO.headline}
                  </h1>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {PROFILE_INFO.bio}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('experience')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    View Full Resume
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('portfolio')}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    OHA Campaign &amp; Work
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="h-80 sm:h-96 lg:h-[440px] max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-900">
                  <ResilientImage
                    src={PROFILE_INFO.avatarImage}
                    alt={PROFILE_INFO.fullName}
                    title={PROFILE_INFO.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Proof Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-b border-slate-200 dark:border-slate-800 py-6">
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  10+ Years
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Corporate Comms &amp; Marketing
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  200
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Global Brand Ambassadors Led
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  30–40/day
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Enterprise Brand Inquiries Resolved
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <ResilientImage
                    src={PROFILE_INFO.bluLogoUrl}
                    alt="Blu Marketing Group logo"
                    title="Blu Marketing Group"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    Blu Marketing Group
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Agency &amp; Consulting · Est. 2010
                  </p>
                </div>
              </div>
            </div>

            {/* Dual Specialization Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {RESUME_TRACKS.map((track) => (
                <div
                  key={track.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {track.label}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {track.summary}
                    </p>
                  </div>
                  <ul className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-600 dark:text-slate-300">
                    {track.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Core Capabilities */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    Core Capabilities
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Communications Governance &amp; Marketing Delivery
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Change Comms · Executive Decks · Agile PM · AI Workflows
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {CORE_TALENTS.map((talent) => (
                  <div
                    key={talent.index}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono">{talent.index}.</span>
                        <span>{talent.deliverable}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {talent.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {talent.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Case Studies + OHA Timeless IV Campaign Showcase */}
        <section
          id="portfolio"
          aria-labelledby="portfolio-heading"
          className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    Selected Case Studies &amp; Projects
                  </p>
                  <h2
                    id="portfolio-heading"
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
                  >
                    Healthcare Campaigns, Enterprise Governance &amp; Agency Work
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Select any project to inspect deliverables and creative assets
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CASE_STUDIES.map((study) => (
                  <button
                    key={study.id}
                    type="button"
                    onClick={() => {
                      setInitialAssetId(null);
                      setSelectedStudy(study);
                    }}
                    className="group text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-blue-600/50 dark:hover:border-blue-500/50 transition-colors flex flex-col"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <ResilientImage
                        src={study.imageUrl}
                        alt={study.title}
                        title={study.title}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {study.client} · {study.year}
                        </p>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {study.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {study.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-blue-700 dark:text-blue-400">
                        <span>{study.outcomeMetric}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dedicated OHA Campaign Showcase: Videos & Graphics for Posts */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    Optimal Health ATL (OHA) Campaign
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Timeless IV — Videos &amp; Social Post Graphics
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                    Multi-format creative suite produced for Optimal Health ATL&rsquo;s Timeless IV launch, spanning feed benefits cards, conversion booking posts, and vertical video reels.
                  </p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Tap any creative to inspect full resolution
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {OHA_CAMPAIGN_ASSETS.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => openOhaCreative(asset.id)}
                    className="group text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-blue-600/50 dark:hover:border-blue-500/50 transition-colors flex flex-col"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                      <ResilientImage
                        src={asset.imageUrl}
                        alt={asset.title}
                        title={asset.title}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{asset.format}</span>
                          {asset.aspect === 'tall' && (
                            <Film className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                          )}
                        </div>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {asset.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {asset.caption}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 pt-1">
                        Preview Full Asset
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Analytics Workbench */}
        <InteractiveDashboard darkMode={darkMode} />

        {/* Resume: Experience, Education & Skills Matrix */}
        <section
          id="experience"
          aria-labelledby="experience-heading"
          className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Founder Bio + Blu Logo + Education Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                      <ResilientImage
                        src={PROFILE_INFO.avatarImage}
                        alt={PROFILE_INFO.fullName}
                        title={PROFILE_INFO.fullName}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2
                        id="experience-heading"
                        className="text-xl font-bold text-slate-900 dark:text-slate-100"
                      >
                        {PROFILE_INFO.fullName}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {PROFILE_INFO.location} · {PROFILE_INFO.phone}
                      </p>
                      <a
                        href={PROFILE_INFO.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline mt-1.5"
                      >
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Experienced translating complex business, healthcare, and technical workflows into clear communications, governed brand systems, and measurable campaigns.
                  </p>

                  {/* Blu Marketing Group Brand Lockup */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                      <ResilientImage
                        src={PROFILE_INFO.bluLogoUrl}
                        alt="Blu Marketing Group official logo"
                        title="Blu Marketing Group"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {PROFILE_INFO.brandName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Founder · Marketing Comms &amp; Web Consulting
                      </p>
                    </div>
                  </div>
                </div>

                {/* Education Block */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <GraduationCap className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <span>Education &amp; Credentials</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {EDUCATION_ITEMS.map((edu) => (
                      <div key={edu.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {edu.degree}
                        </h3>
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {edu.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right CV Timeline with Track Switcher */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Professional Experience
                  </h3>
                  <div
                    role="tablist"
                    aria-label="Filter resume experience track"
                    className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start"
                  >
                    {(
                      [
                        { id: 'all', label: 'All Roles' },
                        { id: 'communications', label: 'Communications' },
                        { id: 'marketing', label: 'Marketing & PM' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={resumeTrack === tab.id}
                        onClick={() => setResumeTrack(tab.id)}
                        className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                          resumeTrack === tab.id
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredExperience.map((role) => (
                    <div key={role.id} className="py-6 first:pt-0 last:pb-0 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {role.role}
                          </h4>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                            {role.organization} · {role.location}
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                          {role.period}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                        {role.highlights.map((bullet) => (
                          <li key={bullet} className="leading-relaxed">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Structured Skills & Technology Platforms */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  Core Expertise &amp; Technology Stack
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Communications, Project Management &amp; AI Productivity Tools
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {SKILL_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4"
                  >
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {group.title}
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Brief Submission */}
        <ContactSection preselectedSubject={inquirySubject} />
      </main>

      {/* Quiet Footer with Blu Marketing Group Logo */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
              <ResilientImage
                src={PROFILE_INFO.bluLogoUrl}
                alt="Blu Marketing Group logo"
                title="Blu Marketing Group"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {PROFILE_INFO.fullName} · {PROFILE_INFO.brandName}
              </p>
              <p>
                {PROFILE_INFO.location} · {PROFILE_INFO.phone} · {PROFILE_INFO.primaryEmail}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={PROFILE_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Thumb Navigation Bar (hidden on md+ desktop) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 pb-safe bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Case Study & OHA Creative Lightbox */}
      <PortfolioLightbox
        study={selectedStudy}
        initialAssetId={initialAssetId}
        onClose={() => {
          setSelectedStudy(null);
          setInitialAssetId(null);
        }}
        onInquire={(title) => {
          setInquirySubject(title);
          scrollToSection('contact');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
