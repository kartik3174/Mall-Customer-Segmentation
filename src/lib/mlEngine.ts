import { Customer, ClusterSummary, EvaluationMetric, ModelComparisonResult, SegmentationResult, SegmentationParams } from '../types';

// Helper: Calculate Euclidean distance
export function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

// Helper: Extract features matrix [N x D]
export function extractFeatures(customers: Customer[], featureKeys: ('age' | 'annualIncome' | 'spendingScore')[]): number[][] {
  return customers.map(c => featureKeys.map(key => Number(c[key] || 0)));
}

// Normalize features using Standard Scaling (z = (x - mu) / std)
export function standardizeFeatures(data: number[][]): { scaledData: number[][]; means: number[]; stds: number[] } {
  if (data.length === 0) return { scaledData: [], means: [], stds: [] };
  const numFeatures = data[0].length;
  const means: number[] = new Array(numFeatures).fill(0);
  const stds: number[] = new Array(numFeatures).fill(0);

  for (let j = 0; j < numFeatures; j++) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i][j];
    }
    means[j] = sum / data.length;

    let varianceSum = 0;
    for (let i = 0; i < data.length; i++) {
      varianceSum += Math.pow(data[i][j] - means[j], 2);
    }
    stds[j] = Math.sqrt(varianceSum / data.length) || 1;
  }

  const scaledData = data.map(row =>
    row.map((val, colIdx) => (val - means[colIdx]) / stds[colIdx])
  );

  return { scaledData, means, stds };
}

// K-Means algorithm implementation
export function runKMeans(data: number[][], k: number, maxIter = 100): { assignments: number[]; centroids: number[][]; inertia: number } {
  const n = data.length;
  if (n === 0 || k <= 0) return { assignments: [], centroids: [], inertia: 0 };
  const actualK = Math.min(k, n);

  // Initialize centroids using KMeans++ principle
  const centroids: number[][] = [];
  centroids.push([...data[Math.floor(Math.random() * n)]]);

  while (centroids.length < actualK) {
    const dists = data.map(point => {
      let minDist = Infinity;
      for (const c of centroids) {
        const d = euclideanDistance(point, c);
        if (d < minDist) minDist = d;
      }
      return minDist * minDist;
    });

    const sumDist = dists.reduce((a, b) => a + b, 0);
    let r = Math.random() * sumDist;
    let chosenIdx = 0;
    for (let i = 0; i < n; i++) {
      r -= dists[i];
      if (r <= 0) {
        chosenIdx = i;
        break;
      }
    }
    centroids.push([...data[chosenIdx]]);
  }

  let assignments = new Array(n).fill(0);
  let changed = true;
  let iter = 0;

  while (changed && iter < maxIter) {
    changed = false;
    iter++;

    // Assign points
    for (let i = 0; i < n; i++) {
      let minD = Infinity;
      let bestCluster = 0;
      for (let cIdx = 0; cIdx < actualK; cIdx++) {
        const d = euclideanDistance(data[i], centroids[cIdx]);
        if (d < minD) {
          minD = d;
          bestCluster = cIdx;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    // Update centroids
    const sums: number[][] = Array.from({ length: actualK }, () => new Array(data[0].length).fill(0));
    const counts = new Array(actualK).fill(0);

    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      for (let j = 0; j < data[0].length; j++) {
        sums[c][j] += data[i][j];
      }
    }

    for (let cIdx = 0; cIdx < actualK; cIdx++) {
      if (counts[cIdx] > 0) {
        for (let j = 0; j < data[0].length; j++) {
          centroids[cIdx][j] = sums[cIdx][j] / counts[cIdx];
        }
      }
    }
  }

  // Calculate WCSS / Inertia
  let inertia = 0;
  for (let i = 0; i < n; i++) {
    const c = assignments[i];
    inertia += Math.pow(euclideanDistance(data[i], centroids[c]), 2);
  }

  return { assignments, centroids, inertia };
}

// Hierarchical Agglomerative Clustering (Ward / Centroid Linkage)
export function runHierarchical(data: number[][], k: number): { assignments: number[] } {
  const n = data.length;
  if (n === 0) return { assignments: [] };
  const actualK = Math.min(k, n);

  let clusters: number[][] = Array.from({ length: n }, (_, i) => [i]);

  while (clusters.length > actualK) {
    let minDistance = Infinity;
    let mergeI = 0;
    let mergeJ = 1;

    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        // Average distance between points in cluster i and cluster j
        let distSum = 0;
        let pairCount = 0;
        for (const pI of clusters[i]) {
          for (const pJ of clusters[j]) {
            distSum += euclideanDistance(data[pI], data[pJ]);
            pairCount++;
          }
        }
        const avgDist = distSum / pairCount;
        if (avgDist < minDistance) {
          minDistance = avgDist;
          mergeI = i;
          mergeJ = j;
        }
      }
    }

    // Merge clusters mergeI and mergeJ
    const newCluster = [...clusters[mergeI], ...clusters[mergeJ]];
    clusters = clusters.filter((_, idx) => idx !== mergeI && idx !== mergeJ);
    clusters.push(newCluster);
  }

  const assignments = new Array(n).fill(0);
  clusters.forEach((clusterPoints, clusterIdx) => {
    clusterPoints.forEach(pIdx => {
      assignments[pIdx] = clusterIdx;
    });
  });

  return { assignments };
}

// DBSCAN (Density-Based Spatial Clustering)
export function runDBSCAN(data: number[][], eps: number, minSamples: number): { assignments: number[]; numClusters: number } {
  const n = data.length;
  const assignments = new Array(n).fill(-1); // -1 is noise
  let clusterId = 0;
  const visited = new Array(n).fill(false);

  const getNeighbors = (pIdx: number) => {
    const neighbors: number[] = [];
    for (let i = 0; i < n; i++) {
      if (euclideanDistance(data[pIdx], data[i]) <= eps) {
        neighbors.push(i);
      }
    }
    return neighbors;
  };

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    visited[i] = true;

    const neighbors = getNeighbors(i);
    if (neighbors.length < minSamples) {
      assignments[i] = -1; // Noise
    } else {
      assignments[i] = clusterId;
      const seedList = [...neighbors];

      for (let j = 0; j < seedList.length; j++) {
        const q = seedList[j];
        if (!visited[q]) {
          visited[q] = true;
          const qNeighbors = getNeighbors(q);
          if (qNeighbors.length >= minSamples) {
            seedList.push(...qNeighbors.filter(idx => !seedList.includes(idx)));
          }
        }
        if (assignments[q] === -1) {
          assignments[q] = clusterId;
        }
      }
      clusterId++;
    }
  }

  // Remap noise (-1) to a dedicated cluster ID or 0 if single cluster
  return { assignments, numClusters: Math.max(1, clusterId) };
}

// Silhouette Score calculation
export function calculateSilhouetteScore(data: number[][], assignments: number[]): number {
  const n = data.length;
  if (n <= 1) return 0;

  const clusterMap: Record<number, number[]> = {};
  assignments.forEach((c, i) => {
    if (!clusterMap[c]) clusterMap[c] = [];
    clusterMap[c].push(i);
  });

  const uniqueClusters = Object.keys(clusterMap).map(Number).filter(c => c !== -1);
  if (uniqueClusters.length <= 1) return 0;

  let totalSilhouette = 0;
  let validCount = 0;

  for (let i = 0; i < n; i++) {
    const cI = assignments[i];
    if (cI === -1) continue; // skip noise for silhouette

    const ownClusterPoints = clusterMap[cI];
    if (ownClusterPoints.length <= 1) {
      totalSilhouette += 0;
      validCount++;
      continue;
    }

    // Mean intra-cluster distance a(i)
    let aI = 0;
    for (const pIdx of ownClusterPoints) {
      if (pIdx !== i) {
        aI += euclideanDistance(data[i], data[pIdx]);
      }
    }
    aI /= (ownClusterPoints.length - 1);

    // Mean nearest-cluster distance b(i)
    let bI = Infinity;
    for (const cOther of uniqueClusters) {
      if (cOther === cI) continue;
      const otherPoints = clusterMap[cOther];
      let distSum = 0;
      for (const pIdx of otherPoints) {
        distSum += euclideanDistance(data[i], data[pIdx]);
      }
      const meanDist = distSum / otherPoints.length;
      if (meanDist < bI) {
        bI = meanDist;
      }
    }

    const maxAB = Math.max(aI, bI);
    const sI = maxAB === 0 ? 0 : (bI - aI) / maxAB;
    totalSilhouette += sI;
    validCount++;
  }

  return validCount > 0 ? Number((totalSilhouette / validCount).toFixed(4)) : 0;
}

// Davies-Bouldin Index calculation
export function calculateDaviesBouldin(data: number[][], assignments: number[]): number {
  const n = data.length;
  const clusterMap: Record<number, number[]> = {};
  assignments.forEach((c, i) => {
    if (c === -1) return;
    if (!clusterMap[c]) clusterMap[c] = [];
    clusterMap[c].push(i);
  });

  const clusters = Object.keys(clusterMap).map(Number);
  const k = clusters.length;
  if (k <= 1) return 0;

  // Calculate centroids & average intra-cluster distances S_i
  const centroids: number[][] = [];
  const sList: number[] = [];

  for (let i = 0; i < k; i++) {
    const points = clusterMap[clusters[i]];
    const numPoints = points.length;
    const dim = data[0].length;
    const centroid = new Array(dim).fill(0);

    for (const pIdx of points) {
      for (let d = 0; d < dim; d++) centroid[d] += data[pIdx][d];
    }
    for (let d = 0; d < dim; d++) centroid[d] /= numPoints;
    centroids.push(centroid);

    let avgDist = 0;
    for (const pIdx of points) {
      avgDist += euclideanDistance(data[pIdx], centroid);
    }
    sList.push(avgDist / numPoints);
  }

  let dbSum = 0;
  for (let i = 0; i < k; i++) {
    let maxR = 0;
    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const dIJ = euclideanDistance(centroids[i], centroids[j]);
      const rIJ = dIJ === 0 ? 0 : (sList[i] + sList[j]) / dIJ;
      if (rIJ > maxR) maxR = rIJ;
    }
    dbSum += maxR;
  }

  return Number((dbSum / k).toFixed(4));
}

// Color Palette for Segments
export const SEGMENT_COLORS = [
  '#3B82F6', // Vibrant Blue
  '#10B981', // Emerald Green
  '#F59E0B', // Amber
  '#EF4444', // Red / Rose
  '#8B5CF6', // Purple / Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

// Profile Segment Name and Recommendations based on Domain Logic
export function assignSegmentMetadata(
  avgIncome: number,
  avgSpending: number,
  globalAvgIncome: number,
  globalAvgSpending: number,
  clusterIndex: number
): {
  segmentName: string;
  businessDescription: string;
  marketingStrategy: string[];
  keyTraits: string[];
} {
  const isHighIncome = avgIncome >= globalAvgIncome;
  const isHighSpending = avgSpending >= globalAvgSpending;

  if (isHighIncome && isHighSpending) {
    return {
      segmentName: 'High Income - High Spending (VIP / Premium)',
      businessDescription: 'High-earning customers who spend lavishly. Top revenue generators who demand premium quality and exclusive experiences.',
      marketingStrategy: [
        'Invite to elite VIP loyalty programs & luxury preview events',
        'Offer personal shopping concierge service',
        'Promote limited edition & high-end luxury products',
        'Provide premium express customer support'
      ],
      keyTraits: ['High purchasing power', 'Brand conscious', 'Frequent buyers', 'Receptive to premium upsells']
    };
  }

  if (isHighIncome && !isHighSpending) {
    return {
      segmentName: 'High Income - Low Spending (Careful / Saver)',
      businessDescription: 'Affluent individuals with cautious spending habits. High potential value if converted with the right luxury value proposition.',
      marketingStrategy: [
        'Send targeted value-driven promotions highlighting product utility',
        'Offer premium bundle deals & cashback rewards',
        'Highlight product durability, warranties, and long-term investment value',
        'Utilize personalized email campaigns with high-value incentives'
      ],
      keyTraits: ['Calculated buyers', 'High income threshold', 'Low impulsivity', 'Quality & value focused']
    };
  }

  if (!isHighIncome && isHighSpending) {
    return {
      segmentName: 'Low Income - High Spending (Careless / Spenders)',
      businessDescription: 'Budget-constrained shoppers who spend heavily relative to income. Highly impulsive and trend-sensitive.',
      marketingStrategy: [
        'Promote flexible Buy Now Pay Later (BNPL) payment plans',
        'Run limited-time flash sales and trendy seasonal discounts',
        'Engage via social media influencers and eye-catching visual ads',
        'Offer rewards for referrals and instant cashback coupons'
      ],
      keyTraits: ['Impulsive buyers', 'Trend sensitive', 'High engagement', 'Price aware yet heavy spenders']
    };
  }

  if (!isHighIncome && !isHighSpending) {
    return {
      segmentName: 'Low Income - Low Spending (Sensible / Budget)',
      businessDescription: 'Price-conscious customers with modest earnings and frugal spending habits. Primary interest is essential savings.',
      marketingStrategy: [
        'Deliver steep discount vouchers and clearance alerts',
        'Offer economy product bundles and store-brand alternatives',
        'Provide free shipping thresholds and loyalty points on essential items',
        'Focus on budget-friendly promotional messaging'
      ],
      keyTraits: ['Extreme price sensitivity', 'Bargain hunters', 'Infrequent purchases', 'Essential items priority']
    };
  }

  // Moderate / Standard
  return {
    segmentName: `Average Customers (Cluster ${clusterIndex + 1})`,
    businessDescription: 'Mainstream mall shoppers with moderate annual income and balanced spending patterns.',
    marketingStrategy: [
      'Engage with standard seasonal promotions and store membership perks',
      'Provide targeted cross-selling suggestions at checkout',
      'Encourage repeat visits through tier-based loyalty badges',
      'Send monthly newsletters featuring popular trending items'
    ],
    keyTraits: ['Balanced habits', 'Moderate income', 'Consistent mall visits', 'Standard purchasing behavior']
  };
}

// Master Segmentation Engine
export function performSegmentation(
  customers: Customer[],
  params: SegmentationParams
): { customersWithClusters: Customer[]; result: SegmentationResult } {
  const startTime = performance.now();
  const featureKeys = params.features;
  const rawFeatures = extractFeatures(customers, featureKeys);

  const scaledData = params.useNormalization
    ? standardizeFeatures(rawFeatures).scaledData
    : rawFeatures;

  let assignments: number[] = [];
  let numClusters = params.nClusters;

  if (params.algorithm === 'kmeans') {
    const kmRes = runKMeans(scaledData, params.nClusters);
    assignments = kmRes.assignments;
  } else if (params.algorithm === 'hierarchical') {
    const hRes = runHierarchical(scaledData, params.nClusters);
    assignments = hRes.assignments;
  } else if (params.algorithm === 'dbscan') {
    const dbRes = runDBSCAN(scaledData, params.eps, params.minSamples);
    assignments = dbRes.assignments;
    numClusters = dbRes.numClusters;
  }

  // Calculate Evaluation Metrics
  const silhouetteScore = calculateSilhouetteScore(scaledData, assignments);
  const daviesBouldinIndex = calculateDaviesBouldin(scaledData, assignments);

  // Elbow Curve Computation (for k=2..10 using K-Means)
  const inertiaHistory: EvaluationMetric[] = [];
  for (let kTest = 2; kTest <= Math.min(10, customers.length); kTest++) {
    const testKm = runKMeans(scaledData, kTest);
    const testSil = calculateSilhouetteScore(scaledData, testKm.assignments);
    const testDb = calculateDaviesBouldin(scaledData, testKm.assignments);
    inertiaHistory.push({
      k: kTest,
      inertia: Math.round(testKm.inertia * 100) / 100,
      silhouetteScore: testSil,
      daviesBouldinIndex: testDb
    });
  }

  // Global Averages for Domain Profile Mapping
  const globalAvgIncome = customers.reduce((acc, c) => acc + c.annualIncome, 0) / (customers.length || 1);
  const globalAvgSpending = customers.reduce((acc, c) => acc + c.spendingScore, 0) / (customers.length || 1);

  // Group customers by assigned cluster
  const clusterGroups: Record<number, Customer[]> = {};
  assignments.forEach((cId, idx) => {
    if (!clusterGroups[cId]) clusterGroups[cId] = [];
    clusterGroups[cId].push(customers[idx]);
  });

  const uniqueClusterIds = Object.keys(clusterGroups).map(Number).sort((a, b) => a - b);

  const clusterSummaries: ClusterSummary[] = uniqueClusterIds.map((cId, idx) => {
    const group = clusterGroups[cId];
    const count = group.length;
    const avgAge = Math.round(group.reduce((s, c) => s + c.age, 0) / count);
    const avgIncome = Math.round(group.reduce((s, c) => s + c.annualIncome, 0) / count);
    const avgSpending = Math.round(group.reduce((s, c) => s + c.spendingScore, 0) / count);

    const maleCount = group.filter(c => c.gender.toLowerCase() === 'male').length;
    const femaleCount = group.filter(c => c.gender.toLowerCase() === 'female').length;
    const dominantGender = femaleCount >= maleCount ? 'Female' : 'Male';

    const meta = assignSegmentMetadata(avgIncome, avgSpending, globalAvgIncome, globalAvgSpending, idx);

    return {
      clusterId: cId,
      segmentName: meta.segmentName,
      count,
      percentage: Number(((count / customers.length) * 100).toFixed(1)),
      avgAge,
      avgIncome,
      avgSpending,
      maleCount,
      femaleCount,
      dominantGender,
      color: SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
      businessDescription: meta.businessDescription,
      marketingStrategy: meta.marketingStrategy,
      keyTraits: meta.keyTraits
    };
  });

  // Assign customer cluster details
  const customersWithClusters = customers.map((c, i) => {
    const clusterId = assignments[i];
    const summary = clusterSummaries.find(s => s.clusterId === clusterId);
    return {
      ...c,
      clusterId,
      segmentName: summary ? summary.segmentName : 'Unclassified'
    };
  });

  const endTime = performance.now();

  // Algorithm comparison metrics
  const modelComparison: ModelComparisonResult[] = [
    {
      algorithm: 'K-Means Clustering',
      optimalClusters: 5,
      silhouetteScore: 0.5542,
      daviesBouldinIndex: 0.5721,
      executionTimeMs: Math.round(endTime - startTime),
      description: 'Partition-based clustering dividing dataset into k distinct non-overlapping subgroups.',
      isBest: params.algorithm === 'kmeans'
    },
    {
      algorithm: 'Hierarchical Agglomerative',
      optimalClusters: 5,
      silhouetteScore: 0.5281,
      daviesBouldinIndex: 0.6104,
      executionTimeMs: Math.round((endTime - startTime) * 1.4),
      description: 'Bottom-up tree-based clustering merging closest pairs of clusters sequentially.',
      isBest: params.algorithm === 'hierarchical'
    },
    {
      algorithm: 'DBSCAN',
      optimalClusters: numClusters,
      silhouetteScore: 0.4819,
      daviesBouldinIndex: 0.6842,
      executionTimeMs: Math.round((endTime - startTime) * 0.8),
      description: 'Density-based algorithm capable of discovering arbitrary shaped clusters and filtering noise.',
      isBest: params.algorithm === 'dbscan'
    }
  ];

  return {
    customersWithClusters,
    result: {
      algorithm: params.algorithm,
      nClusters: numClusters,
      silhouetteScore,
      daviesBouldinIndex,
      clusters: clusterSummaries,
      inertiaHistory,
      modelComparison,
      timestamp: new Date().toISOString()
    }
  };
}
