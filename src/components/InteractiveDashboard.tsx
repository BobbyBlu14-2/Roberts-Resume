import { useState, useEffect, useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Download,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import type { CampaignChannel, CampaignMetric, CampaignStatus } from '../types/app';
import { SAMPLE_CAMPAIGNS } from '../data/siteContent';
import {
  CAMPAIGN_CHANNELS,
  CAMPAIGN_STATUSES,
  formatCompactNumber,
  formatCurrency,
  generateSafeDocId,
} from '../lib/validation';
import { CampaignModal, type CampaignPayload } from './CampaignModal';

interface InteractiveDashboardProps {
  darkMode: boolean;
}

type ChartMetricMode = 'revenue' | 'leads' | 'impressions';

const STORAGE_KEY = 'blu_dashboard_campaigns_v2';

function createStarterDataset(): CampaignMetric[] {
  return SAMPLE_CAMPAIGNS.map((item, idx) => ({
    ...item,
    id: `starter_${idx}`,
  }));
}

export function InteractiveDashboard({ darkMode }: InteractiveDashboardProps) {
  const [campaigns, setCampaigns] = useState<CampaignMetric[]>(() => {
    if (typeof window === 'undefined') return createStarterDataset();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CampaignMetric[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to starter dataset
    }
    return createStarterDataset();
  });

  const [chartMode, setChartMode] = useState<ChartMetricMode>('revenue');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<CampaignChannel | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignMetric | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch {
      // Ignore storage quota errors
    }
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return campaigns.filter((item) => {
      if (channelFilter !== 'All' && item.channel !== channelFilter) return false;
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.channel.toLowerCase().includes(q) &&
        !item.notes.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [campaigns, searchQuery, channelFilter, statusFilter]);

  const totals = useMemo(() => {
    const impressions = filteredCampaigns.reduce((acc, c) => acc + c.impressions, 0);
    const leads = filteredCampaigns.reduce((acc, c) => acc + c.leads, 0);
    const conversions = filteredCampaigns.reduce((acc, c) => acc + c.conversions, 0);
    const spend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0);
    const revenue = filteredCampaigns.reduce((acc, c) => acc + c.revenue, 0);
    const roi = spend > 0 ? Math.round(((revenue - spend) / spend) * 100) : 0;
    const convRate = leads > 0 ? ((conversions / leads) * 100).toFixed(1) : '0.0';
    return { impressions, leads, conversions, spend, revenue, roi, convRate };
  }, [filteredCampaigns]);

  const timeSeriesData = useMemo(() => {
    const sorted = [...filteredCampaigns].sort((a, b) =>
      a.periodDate.localeCompare(b.periodDate)
    );
    return sorted.map((c) => ({
      date: c.periodDate.slice(5),
      title: c.title,
      revenue: c.revenue,
      spend: c.spend,
      leads: c.leads,
      conversions: c.conversions,
      impressions: c.impressions,
    }));
  }, [filteredCampaigns]);

  const channelBreakdownData = useMemo(() => {
    const map = new Map<
      CampaignChannel,
      { channel: CampaignChannel; revenue: number; leads: number; spend: number }
    >();
    CAMPAIGN_CHANNELS.forEach((ch) => {
      map.set(ch, { channel: ch, revenue: 0, leads: 0, spend: 0 });
    });
    filteredCampaigns.forEach((c) => {
      const entry = map.get(c.channel);
      if (entry) {
        entry.revenue += c.revenue;
        entry.leads += c.leads;
        entry.spend += c.spend;
      }
    });
    return Array.from(map.values()).filter((d) => d.revenue > 0 || d.leads > 0 || d.spend > 0);
  }, [filteredCampaigns]);

  const handleSaveCampaign = (payload: CampaignPayload, existingId?: string) => {
    if (existingId) {
      setCampaigns((prev) =>
        prev.map((item) => (item.id === existingId ? { ...payload, id: existingId } : item))
      );
    } else {
      const newEntry: CampaignMetric = {
        ...payload,
        id: generateSafeDocId('cmp'),
      };
      setCampaigns((prev) =>
        [...prev, newEntry].sort((a, b) => a.periodDate.localeCompare(b.periodDate))
      );
    }
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetSample = () => {
    setCampaigns(createStarterDataset());
    setChannelFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
  };

  const handleExportCsv = () => {
    const headers = [
      'Title',
      'Channel',
      'Status',
      'Date',
      'Impressions',
      'Leads',
      'Conversions',
      'SpendUSD',
      'RevenueUSD',
      'Notes',
    ];
    const rows = filteredCampaigns.map((c) =>
      [
        `"${c.title.replace(/"/g, '""')}"`,
        `"${c.channel}"`,
        `"${c.status}"`,
        c.periodDate,
        c.impressions,
        c.leads,
        c.conversions,
        c.spend,
        c.revenue,
        `"${c.notes.replace(/"/g, '""')}"`,
      ].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `robert-philizaire-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const axisStroke = darkMode ? '#94a3b8' : '#64748b';
  const gridStroke = darkMode ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    borderColor: darkMode ? '#334155' : '#cbd5e1',
    borderRadius: '12px',
    fontSize: '12px',
    color: darkMode ? '#f8fafc' : '#0f172a',
  };

  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-heading"
      className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Workspace Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
              Interactive Analytics Workbench
            </p>
            <h2
              id="dashboard-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
            >
              Campaign Performance &amp; Comms Attribution
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Explore live campaign visualizations across corporate communications, healthcare ops, SEO/SEM, and digital web launches. Add, edit, filter, or export entries directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetSample}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Sample
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredCampaigns.length === 0}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingCampaign(null);
                setModalOpen(true);
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>
        </div>

        {/* 4-Column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Reach</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {formatCompactNumber(totals.impressions)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Across {filteredCampaigns.length} tracked initiatives
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">Qualified Leads</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {totals.leads.toLocaleString('en-US')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {totals.conversions.toLocaleString('en-US')} conversions · {totals.convRate}% rate
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">Attributed Value</p>
            <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(totals.revenue)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Campaign spend: {formatCurrency(totals.spend)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">Net Return (ROI)</p>
            <p
              className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
                totals.roi >= 0
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {totals.roi >= 0 ? `+${totals.roi}%` : `${totals.roi}%`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Net gain: {formatCurrency(totals.revenue - totals.spend)}
            </p>
          </div>
        </div>

        {/* Interactive Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Time Series Performance Chart */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Performance Trajectory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chronological progression across selected initiatives
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Chart metric selector"
                className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start"
              >
                {(
                  [
                    { id: 'revenue', label: 'Value' },
                    { id: 'leads', label: 'Leads' },
                    { id: 'impressions', label: 'Reach' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={chartMode === tab.id}
                    onClick={() => setChartMode(tab.id)}
                    className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      chartMode === tab.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cobaltFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="slateFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke={axisStroke}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={axisStroke}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) =>
                      chartMode === 'revenue'
                        ? `$${formatCompactNumber(val)}`
                        : formatCompactNumber(val)
                    }
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  {chartMode === 'revenue' && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Attributed Value ($)"
                        stroke="#1d4ed8"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#cobaltFill)"
                      />
                      <Area
                        type="monotone"
                        dataKey="spend"
                        name="Spend ($)"
                        stroke="#64748b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#slateFill)"
                      />
                    </>
                  )}
                  {chartMode === 'leads' && (
                    <>
                      <Area
                        type="monotone"
                        dataKey="leads"
                        name="Engagements / Leads"
                        stroke="#1d4ed8"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#cobaltFill)"
                      />
                      <Area
                        type="monotone"
                        dataKey="conversions"
                        name="Conversions"
                        stroke="#16a34a"
                        strokeWidth={2}
                        fillOpacity={0}
                      />
                    </>
                  )}
                  {chartMode === 'impressions' && (
                    <Area
                      type="monotone"
                      dataKey="impressions"
                      name="Reach / Impressions"
                      stroke="#1d4ed8"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#cobaltFill)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channel Attribution Bar Chart */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Channel Attribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any channel bar to filter the table below
                </p>
              </div>
              {channelFilter !== 'All' && (
                <button
                  type="button"
                  onClick={() => setChannelFilter('All')}
                  className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={channelBreakdownData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                  <XAxis
                    type="number"
                    stroke={axisStroke}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => `$${formatCompactNumber(val)}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="channel"
                    width={112}
                    stroke={axisStroke}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="revenue"
                    name="Attributed Value ($)"
                    radius={[0, 6, 6, 0]}
                    className="cursor-pointer"
                    onClick={(entry) => {
                      const raw = entry as unknown as {
                        channel?: CampaignChannel;
                        payload?: { channel?: CampaignChannel };
                      };
                      const ch = raw?.payload?.channel || raw?.channel;
                      if (ch) {
                        setChannelFilter((prev) => (prev === ch ? 'All' : ch));
                      }
                    }}
                  >
                    {channelBreakdownData.map((entry) => (
                      <Cell
                        key={entry.channel}
                        fill={
                          channelFilter === 'All' || channelFilter === entry.channel
                            ? '#1d4ed8'
                            : darkMode
                            ? '#334155'
                            : '#cbd5e1'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filter Toolbar + Responsive Data Table / Cards */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                aria-label="Filter campaigns by title or notes"
                placeholder="Filter initiatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Filter by channel"
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value as CampaignChannel | 'All')}
                className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">All Channels</option>
                {CAMPAIGN_CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'All')}
                className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">All Statuses</option>
                {CAMPAIGN_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No initiatives match your current filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (campaigns.length === 0) {
                    handleResetSample();
                  } else {
                    setChannelFilter('All');
                    setStatusFilter('All');
                    setSearchQuery('');
                  }
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {campaigns.length === 0 ? 'Load Sample Initiatives' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <>
              {/* Desktop High-Density Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-5">Initiative</th>
                      <th className="py-3 px-3">Channel</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Reach</th>
                      <th className="py-3 px-3 text-right">Leads</th>
                      <th className="py-3 px-3 text-right">Spend</th>
                      <th className="py-3 px-3 text-right">Value</th>
                      <th className="py-3 px-3 text-right">ROI</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                    {filteredCampaigns.map((item) => {
                      const roi =
                        item.spend > 0
                          ? Math.round(((item.revenue - item.spend) / item.spend) * 100)
                          : 0;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-5 max-w-[260px]">
                            <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {item.periodDate} · {item.notes || 'No notes'}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {item.channel}
                          </td>
                          <td className="py-3.5 px-3 text-xs whitespace-nowrap">
                            <span
                              className={`font-medium ${
                                item.status === 'Active'
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : item.status === 'Paused'
                                  ? 'text-amber-700 dark:text-amber-400'
                                  : item.status === 'Completed'
                                  ? 'text-blue-700 dark:text-blue-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            {item.impressions.toLocaleString('en-US')}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            {item.leads.toLocaleString('en-US')}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            {formatCurrency(item.spend)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(item.revenue)}
                          </td>
                          <td
                            className={`py-3.5 px-3 text-right font-mono tabular-nums font-medium ${
                              roi >= 0
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {roi >= 0 ? `+${roi}%` : `${roi}%`}
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-1">
                              <button
                                type="button"
                                aria-label={`Edit ${item.title}`}
                                onClick={() => {
                                  setEditingCampaign(item);
                                  setModalOpen(true);
                                }}
                                className="min-h-[36px] min-w-[36px] rounded-lg text-slate-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Delete ${item.title}`}
                                onClick={() => handleDeleteCampaign(item.id)}
                                className="min-h-[36px] min-w-[36px] rounded-lg text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Touch-Friendly Card Rows */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCampaigns.map((item) => {
                  const roi =
                    item.spend > 0
                      ? Math.round(((item.revenue - item.spend) / item.spend) * 100)
                      : 0;
                  return (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.channel} · {item.status} · {item.periodDate}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-mono tabular-nums font-semibold shrink-0 ${
                            roi >= 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {roi >= 0 ? `+${roi}%` : `${roi}%`}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="block text-slate-500 dark:text-slate-400">Leads</span>
                          <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                            {item.leads.toLocaleString('en-US')}
                          </span>
                        </div>
                        <div>
                          <span className="block text-slate-500 dark:text-slate-400">Spend</span>
                          <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(item.spend)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-slate-500 dark:text-slate-400">Value</span>
                          <span className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(item.revenue)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCampaign(item);
                            setModalOpen(true);
                          }}
                          className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(item.id)}
                          className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-red-600 dark:text-red-400 inline-flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <CampaignModal
        isOpen={modalOpen}
        editingCampaign={editingCampaign}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCampaign}
      />
    </section>
  );
}
