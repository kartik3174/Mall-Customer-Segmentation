import React, { useState, useEffect } from 'react';
import {
  Brain,
  Play,
  TrendingUp,
  BarChart3,
  Award,
  Zap,
  CheckCircle2,
  Sparkles,
  Info,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { Customer, SegmentationResult, SegmentationParams } from '../types';
import { useAuth } from '../context/AuthContext';

export const Segmentation: React.FC = () => {
  const { addToast } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  // Model Config
  const [params, setParams] = useState<SegmentationParams>({
    algorithm: 'kmeans',
    nClusters: 5,
    eps: 0.5,
    minSamples: 5,
    useNormalization: true,
    features: ['annualIncome', 'spendingScore']
  });

  const [result, setResult] = useState<SegmentationResult | null>(null);

  const runSegmentation = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/segment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setCustomers(data.customers);
        addToast({
          type: 'success',
          title: 'Segmentation Complete',
          message: `Executed ${params.algorithm.toUpperCase()} algorithm with ${data.result.clusters.length} segments!`
        });
      }
    } catch {
      addToast({ type: 'error', title: 'Execution Error', message: 'Failed to run segmentation algorithm' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSegmentation();
  }, []);

  // Format scatter plot data
  const scatterData = customers.map(c => ({
    id: c.customerId,
    income: c.annualIncome,
    spending: c.spendingScore,
    age: c.age,
    clusterId: c.clusterId ?? 0,
    segmentName: c.segmentName,
    color: result?.clusters.find(s => s.clusterId === c.clusterId)?.color || '#3B82F6'
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Unsupervised ML Segmentation Workbench
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure algorithms, analyze Elbow curves & Silhouette scores, and inspect 2D/3D cluster graphs
          </p>
        </div>

        <button
          onClick={runSegmentation}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 text-xs transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          {loading ? 'Executing ML Model...' : 'Run Segmentation'}
        </button>
      </div>

      {/* Model Configuration Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          Algorithm Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Algorithm selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              ML Algorithm
            </label>
            <select
              value={params.algorithm}
              onChange={e => setParams({ ...params, algorithm: e.target.value as any })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-slate-100"
            >
              <option value="kmeans">K-Means Clustering</option>
              <option value="hierarchical">Hierarchical Agglomerative</option>
              <option value="dbscan">DBSCAN (Density-Based)</option>
            </select>
          </div>

          {/* Number of clusters k */}
          {params.algorithm !== 'dbscan' ? (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Number of Clusters (k = {params.nClusters})
              </label>
              <input
                type="range"
                min={2}
                max={10}
                value={params.nClusters}
                onChange={e => setParams({ ...params, nClusters: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Epsilon (eps = {params.eps})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="2.0"
                  value={params.eps}
                  onChange={e => setParams({ ...params, eps: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Min Samples ({params.minSamples})
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={params.minSamples}
                  onChange={e => setParams({ ...params, minSamples: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </>
          )}

          {/* Normalization Toggle */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Standard Scaling
            </label>
            <button
              type="button"
              onClick={() => setParams({ ...params, useNormalization: !params.useNormalization })}
              className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all ${
                params.useNormalization
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {params.useNormalization ? 'Standardized (Z-Score)' : 'Raw Values'}
            </button>
          </div>
        </div>
      </div>

      {/* Model Performance Banner */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Silhouette Score</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{result.silhouetteScore}</div>
            <span className="text-[10px] text-slate-400">Cohesion & Separation Quality (0 to 1)</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Davies-Bouldin Index</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{result.daviesBouldinIndex}</div>
            <span className="text-[10px] text-slate-400">Cluster Separation (Lower is Better)</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Discovered Clusters</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{result.nClusters} Segments</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Optimal Business Grouping</span>
          </div>
        </div>
      )}

      {/* Visual Charts: 2D Scatter Plot & Elbow Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2D Cluster Scatter Plot */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">2D Cluster Scatter Plot</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Annual Income (k$) vs Spending Score (1-100)</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="income" name="Annual Income" unit="k$" stroke="#94a3b8" />
                <YAxis type="number" dataKey="spending" name="Spending Score" unit="/100" stroke="#94a3b8" />
                <ZAxis type="number" dataKey="age" range={[50, 200]} name="Age" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Customers" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Elbow Curve Graph */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Elbow Curve (Inertia WCSS)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Determining optimal k via within-cluster sum of squares</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
              Optimal k = 5
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result?.inertiaHistory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="k" name="k clusters" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="inertia" name="Inertia (WCSS)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Segment Marketing Recommendations */}
      {result && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Automated Marketing Strategies & Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Actionable outreach guidance generated for each discovered cluster
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.clusters.map(cluster => (
              <div
                key={cluster.clusterId}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cluster.color }} />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {cluster.segmentName}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                    {cluster.count} members ({cluster.percentage}%)
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cluster.businessDescription}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Recommended Actions:</span>
                  {cluster.marketingStrategy.map((strat, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{strat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Model Algorithm Comparison */}
      {result && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Algorithmic Benchmark & Model Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500 uppercase">
                <tr>
                  <th className="p-3">Algorithm</th>
                  <th className="p-3">Optimal Clusters</th>
                  <th className="p-3">Silhouette Score</th>
                  <th className="p-3">Davies-Bouldin</th>
                  <th className="p-3">Exec Time</th>
                  <th className="p-3">Best Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {result.modelComparison.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{m.algorithm}</td>
                    <td className="p-3 font-semibold">{m.optimalClusters}</td>
                    <td className="p-3 font-bold text-blue-600">{m.silhouetteScore}</td>
                    <td className="p-3 font-bold text-indigo-600">{m.daviesBouldinIndex}</td>
                    <td className="p-3">{m.executionTimeMs} ms</td>
                    <td className="p-3">
                      {m.isBest ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                          ACTIVE MODEL
                        </span>
                      ) : (
                        <span className="text-slate-400">Alternative</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
