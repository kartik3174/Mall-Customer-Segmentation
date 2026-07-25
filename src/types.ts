export interface Customer {
  id: number;
  customerId: string;
  gender: 'Male' | 'Female' | string;
  age: number;
  annualIncome: number; // in k$
  spendingScore: number; // 1-100
  clusterId?: number;
  segmentName?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Data Analyst' | 'User';
  token?: string;
  createdAt: string;
}

export interface ClusterSummary {
  clusterId: number;
  segmentName: string;
  count: number;
  percentage: number;
  avgAge: number;
  avgIncome: number;
  avgSpending: number;
  maleCount: number;
  femaleCount: number;
  dominantGender: string;
  color: string;
  businessDescription: string;
  marketingStrategy: string[];
  keyTraits: string[];
}

export interface SegmentationParams {
  algorithm: 'kmeans' | 'hierarchical' | 'dbscan';
  nClusters: number; // For KMeans and Hierarchical
  eps: number; // For DBSCAN
  minSamples: number; // For DBSCAN
  useNormalization: boolean;
  features: ('age' | 'annualIncome' | 'spendingScore')[];
}

export interface EvaluationMetric {
  k: number;
  inertia: number;
  silhouetteScore: number;
  daviesBouldinIndex: number;
}

export interface ModelComparisonResult {
  algorithm: string;
  optimalClusters: number;
  silhouetteScore: number;
  daviesBouldinIndex: number;
  executionTimeMs: number;
  description: string;
  isBest?: boolean;
}

export interface SegmentationResult {
  algorithm: string;
  nClusters: number;
  silhouetteScore: number;
  daviesBouldinIndex: number;
  clusters: ClusterSummary[];
  inertiaHistory?: EvaluationMetric[];
  modelComparison: ModelComparisonResult[];
  timestamp: string;
}

export interface DatasetMeta {
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  missingValues: Record<string, number>;
  duplicateRows: number;
  uploadDate: string;
  summaryStats: {
    age: { mean: number; std: number; min: number; max: number };
    annualIncome: { mean: number; std: number; min: number; max: number };
    spendingScore: { mean: number; std: number; min: number; max: number };
  };
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: 'customer' | 'dataset' | 'model' | 'auth';
}

export interface MigrationTrendPoint {
  period: string;
  [key: string]: string | number;
}

export interface SegmentMigrationEvent {
  id: string;
  fromSegment: string;
  toSegment: string;
  count: number;
  period: string;
  reason: string;
  impact: string;
  type: 'positive' | 'neutral' | 'negative';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
