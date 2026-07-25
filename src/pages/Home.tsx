import React from 'react';
import {
  Sparkles,
  PieChart,
  BarChart3,
  Users,
  Database,
  ArrowRight,
  Brain,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-800/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Unsupervised Machine Learning AI
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Mall Customer Segmentation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300">
              Powered by AI & Data Analytics
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Classify shoppers into high-value target segments using <strong>K-Means</strong>, <strong>Hierarchical Clustering</strong>, and <strong>DBSCAN</strong>. Unlock actionable business recommendations, optimize marketing strategies, and boost ROI.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('segmentation')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 hover:brightness-110 shadow-lg shadow-blue-500/20 transition-all text-sm"
            >
              Run ML Segmentation
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all text-sm"
            >
              View Analytics Dashboard
            </button>
          </div>

          {/* Highlights pills */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 text-xs">
            <div>
              <span className="block font-bold text-lg text-blue-300">200+</span>
              <span className="text-slate-400">Mall Customers</span>
            </div>
            <div>
              <span className="block font-bold text-lg text-indigo-300">3 Models</span>
              <span className="text-slate-400">K-Means, Hierarchical, DBSCAN</span>
            </div>
            <div>
              <span className="block font-bold text-lg text-purple-300">0.554</span>
              <span className="text-slate-400">Optimal Silhouette Score</span>
            </div>
            <div>
              <span className="block font-bold text-lg text-emerald-300">5 Clusters</span>
              <span className="text-slate-400">Target Business Segments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Module Navigation Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Comprehensive Machine Learning Suite
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Everything needed to explore, segment, evaluate, and export customer intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Customer CRUD */}
          <div
            onClick={() => setActiveTab('customers')}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Customer Management
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Full CRUD management with search, filter, pagination, customer profiles, and spending behavior scores.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              Manage Records <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2: Dataset Upload */}
          <div
            onClick={() => setActiveTab('dataset')}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Dataset Manager & Preprocessing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Import Mall Customers CSV, handle missing values, clean duplicate rows, and standardize feature matrices.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Inspect CSV Data <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3: Segmentation Workbench */}
          <div
            onClick={() => setActiveTab('segmentation')}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              ML Clustering Workbench
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Compare K-Means, Hierarchical, and DBSCAN. Auto-evaluate Elbow Curve, Silhouette Score, and Davies-Bouldin Index.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
              Launch Workbench <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 4: Analytics EDA */}
          <div
            onClick={() => setActiveTab('analytics')}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Exploratory Data Analysis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Interactive histograms, age & gender splits, income vs spending score scatter plots, and correlation matrices.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              View Analytics <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 5: Business Recommendations */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Business Insights Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Auto-generate marketing strategies, VIP loyalty targets, discount voucher campaigns, and BNPL payment recommendations.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              Explore Insights <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 6: PDF & CSV Export */}
          <div
            onClick={() => setActiveTab('reports')}
            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Reports & PDF Generator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export executive PDF reports, download customer cluster CSV files, and save chart images for academic presentation.
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              Generate Report <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Target Business Segments Breakdown */}
      <section className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              5 Primary Customer Segments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Classified by Income (k$) vs Spending Score (1-100)
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 rounded-full border border-blue-200 dark:border-blue-800">
            Unsupervised Discovery
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/60 space-y-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">High Income - High Spending</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">VIP Target: Luxury shoppers demanding premium quality and concierge service.</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">High Income - Low Spending</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Careful Savers: High wealth threshold; receptive to value-driven premium bundles.</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Low Income - High Spending</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Careless Spenders: Highly impulsive; best targeted with BNPL & flash discounts.</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800/60 space-y-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Low Income - Low Spending</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Sensible Budgeters: Frugal shoppers seeking discount vouchers & clearance sales.</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800/60 space-y-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Average Mainstream</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Standard Shoppers: Balanced habits; respond to store memberships and rewards.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
