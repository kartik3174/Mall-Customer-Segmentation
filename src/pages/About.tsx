import React from 'react';
import {
  Brain,
  Database,
  Code2,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  BookOpen,
  Globe,
  Server
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-10 pb-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          Academic & Technical Documentation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Mall Customer Segmentation System
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Unsupervised Machine Learning Project for Customer Behavior Analysis & Targeted Marketing Strategies
        </p>
      </div>

      {/* Grid: Project Overview & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Project Objectives
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Customer segmentation is a critical strategy in modern retail and e-commerce. By grouping customers based on income and spending patterns, retail management can tailor promotional campaigns, optimize inventory allocation, and maximize customer retention.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Dataset Attributes
          </h3>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <li><strong>CustomerID:</strong> Unique identifier assigned to each customer</li>
            <li><strong>Gender:</strong> Categorical variable (Male / Female)</li>
            <li><strong>Age:</strong> Continuous variable representing customer age</li>
            <li><strong>Annual Income (k$):</strong> Customer earnings per annum</li>
            <li><strong>Spending Score (1-100):</strong> Score assigned based on mall spending behavior</li>
          </ul>
        </div>
      </div>

      {/* Machine Learning Algorithms Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          Implemented Machine Learning Algorithms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* K-Means */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400">1. K-Means Clustering</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Partitioning algorithm that divides dataset into <i>k</i> distinct non-overlapping clusters by minimizing the Within-Cluster Sum of Squares (Inertia).
            </p>
            <span className="inline-block pt-1 font-semibold text-slate-800 dark:text-slate-200">
              Evaluated with Elbow Method & Silhouette Analysis.
            </span>
          </div>

          {/* Hierarchical */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">2. Hierarchical Agglomerative</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Bottom-up hierarchical clustering where each data point starts as its own cluster and pairs are iteratively merged based on Euclidean linkage.
            </p>
            <span className="inline-block pt-1 font-semibold text-slate-800 dark:text-slate-200">
              Dendrogram & Ward's Linkage Method.
            </span>
          </div>

          {/* DBSCAN */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400">3. DBSCAN</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Density-Based Spatial Clustering of Applications with Noise. Identifies dense clusters of arbitrary shapes and filters out spatial noise/outliers.
            </p>
            <span className="inline-block pt-1 font-semibold text-slate-800 dark:text-slate-200">
              Configured with Epsilon (eps) & MinSamples.
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack Badges */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-600" />
          Full-Stack Technology Architecture
        </h3>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">React 19 + TypeScript</span>
          <span className="px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">Tailwind CSS v4</span>
          <span className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">Express + Node Server</span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">Recharts Visualization</span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">Flask + Scikit-Learn Python Backend</span>
          <span className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">jsPDF & PapaParse</span>
        </div>
      </div>
    </div>
  );
};
