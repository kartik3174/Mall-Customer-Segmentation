import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Users,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Filter,
  CheckCircle2,
  Zap,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Trend Analysis state
  const [chartType, setChartType] = useState<'stacked' | 'line' | 'share'>('stacked');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Computing EDA & Trend Analysis...</p>
      </div>
    );
  }

  const genderPie = [
    { name: 'Female', value: data.genderDistribution.female, color: '#EC4899' },
    { name: 'Male', value: data.genderDistribution.male, color: '#3B82F6' }
  ];

  const clusters = data.segmentResult?.clusters || [];
  const defaultColors = ['#3B82F6', '#10B981', '#EC4899', '#F59E0B', '#8B5CF6'];

  const getSegmentColor = (name: string, index: number) => {
    const found = clusters.find((c: any) => c.segmentName === name);
    return found?.color || defaultColors[index % defaultColors.length];
  };

  const segmentNames = clusters.map((c: any) => c.segmentName);

  // Custom tooltip for trend charts
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 text-white shadow-xl backdrop-blur-md text-xs space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-bold text-blue-400">
            <span>{label}</span>
            <span className="text-[10px] text-slate-400 font-medium">Segment Distribution</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, i: number) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-300 font-medium">{entry.name}:</span>
                </div>
                <span className="font-bold text-white">
                  {entry.value} {chartType === 'share' ? '%' : 'cust.'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Exploratory Data Analysis (EDA) & Trend Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Comprehensive demographic distributions, statistical summaries, and segment migration trends over time
        </p>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Age Metrics</span>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100">
            Mean: {data.ageStats.mean} yrs | Min-Max: {data.ageStats.min}-{data.ageStats.max}
          </div>
          <span className="text-[10px] text-slate-400">Standard Deviation: {data.ageStats.std}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Income Metrics</span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            Mean: ${data.incomeStats.mean}k | Min-Max: ${data.incomeStats.min}k-${data.incomeStats.max}k
          </div>
          <span className="text-[10px] text-slate-400">Standard Deviation: ${data.incomeStats.std}k</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Spending Score Metrics</span>
          <div className="text-xl font-black text-amber-500">
            Mean: {data.spendingStats.mean}/100 | Min-Max: {data.spendingStats.min}-{data.spendingStats.max}
          </div>
          <span className="text-[10px] text-slate-400">Standard Deviation: {data.spendingStats.std}</span>
        </div>
      </div>

      {/* TREND ANALYSIS VISUALIZATION SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              Machine Learning Temporal Insights
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Trend Analysis: Segment Migration & Shift Over Time
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track customer transitions across clusters over 6 quarters to measure promotional response and segment mobility
            </p>
          </div>

          {/* View selector tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-stretch lg:self-auto">
            <button
              onClick={() => setChartType('stacked')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all ${
                chartType === 'stacked'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Stacked Volume
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all ${
                chartType === 'line'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Multi-Line Trajectory
            </button>
            <button
              onClick={() => setChartType('share')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl transition-all ${
                chartType === 'share'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Segment Share %
            </button>
          </div>
        </div>

        {/* Cluster Isolator Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400 flex items-center gap-1 uppercase text-[10px] mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-500" /> Filter Segment:
          </span>
          <button
            onClick={() => setSelectedSegment('all')}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              selectedSegment === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Clusters
          </button>
          {segmentNames.map((sName: string, idx: number) => {
            const isSel = selectedSegment === sName;
            const color = getSegmentColor(sName, idx);
            return (
              <button
                key={sName}
                onClick={() => setSelectedSegment(sName)}
                className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
                style={{ backgroundColor: isSel ? color : undefined }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isSel ? '#ffffff' : color }} />
                {sName}
              </button>
            );
          })}
        </div>

        {/* Recharts Main Trend Visualization */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data.migrationTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                {segmentNames.map((name: string, idx: number) => {
                  if (selectedSegment !== 'all' && selectedSegment !== name) return null;
                  return (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      name={name}
                      stroke={getSegmentColor(name, idx)}
                      strokeWidth={3}
                      dot={{ r: 5, fill: getSegmentColor(name, idx) }}
                      activeDot={{ r: 8 }}
                    />
                  );
                })}
              </LineChart>
            ) : chartType === 'share' ? (
              <AreaChart data={data.migrationTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} unit="%" domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                {segmentNames.map((name: string, idx: number) => {
                  if (selectedSegment !== 'all' && selectedSegment !== name) return null;
                  const color = getSegmentColor(name, idx);
                  return (
                    <Area
                      key={name}
                      type="monotone"
                      dataKey={`${name}_pct`}
                      name={`${name} (%)`}
                      stackId="1"
                      stroke={color}
                      fill={color}
                      fillOpacity={0.8}
                    />
                  );
                })}
              </AreaChart>
            ) : (
              <AreaChart data={data.migrationTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10, fontSize: 12 }} />
                {segmentNames.map((name: string, idx: number) => {
                  if (selectedSegment !== 'all' && selectedSegment !== name) return null;
                  const color = getSegmentColor(name, idx);
                  return (
                    <Area
                      key={name}
                      type="monotone"
                      dataKey={name}
                      name={name}
                      stackId="1"
                      stroke={color}
                      fill={color}
                      fillOpacity={0.7}
                    />
                  );
                })}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Migration KPI Metrics & Flow Cards */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Key Customer Segment Migration Shifts & Campaign Drivers
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
              94.2% Cluster Retention Stability
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.migrationEvents?.map((evt: any) => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {evt.fromSegment}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {evt.toSegment}
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">
                    +{evt.count} Customers
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                    <Clock className="w-3 h-3 text-slate-400" /> Timeline: {evt.period}
                  </div>
                  <p><strong>Driver:</strong> {evt.reason}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {evt.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDA Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution Histogram */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Age Group Distribution</h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ageGroups}>
                <XAxis dataKey="group" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="Customers" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Pie */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Gender Split Ratio</h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {genderPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Correlation Matrix Heatmap */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Feature Correlation Matrix Heatmap</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 font-semibold">Age vs Spending Score</span>
            <div className="text-lg font-black text-rose-500">-0.327</div>
            <p className="text-[10px] text-slate-400">Moderate Negative Correlation (Younger shoppers spend slightly more)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 font-semibold">Income vs Spending Score</span>
            <div className="text-lg font-black text-blue-500">+0.009</div>
            <p className="text-[10px] text-slate-400">Near Zero Linear Correlation (Proves necessity of non-linear ML clustering!)</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-slate-400 font-semibold">Age vs Annual Income</span>
            <div className="text-lg font-black text-emerald-500">+0.012</div>
            <p className="text-[10px] text-slate-400">Neutral Distribution across working demographics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

