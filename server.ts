import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_MALL_CUSTOMERS } from './src/data/defaultDataset';
import { performSegmentation } from './src/lib/mlEngine';
import { Customer, ActivityLog, User } from './src/types';

// In-memory data store for live persistence during container execution
let customersStore: Customer[] = [...INITIAL_MALL_CUSTOMERS];
let usersStore: User[] = [
  {
    id: 'user-001',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@mall.com',
    role: 'Admin',
    token: 'jwt-token-demo-admin-12345',
    createdAt: new Date().toISOString()
  }
];

let activityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    user: 'System',
    action: 'Loaded default Mall Customers Dataset (200 records)',
    type: 'dataset'
  },
  {
    id: 'log-2',
    timestamp: new Date().toISOString(),
    user: 'Dr. Sarah Jenkins',
    action: 'Executed K-Means Segmentation (k=5)',
    type: 'model'
  }
];

let latestSegmentationResult: any = null;

// Perform default initial segmentation on startup
const defaultSeg = performSegmentation(customersStore, {
  algorithm: 'kmeans',
  nClusters: 5,
  eps: 0.5,
  minSamples: 5,
  useNormalization: true,
  features: ['annualIncome', 'spendingScore']
});
customersStore = defaultSeg.customersWithClusters;
latestSegmentationResult = defaultSeg.result;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- API ROUTES ---

  // Health check
  app.get(['/health', '/api/health'], (req, res) => {
    res.json({
      status: 'healthy',
      app: 'Mall Customer Segmentation AI Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Auth: Login
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-register demo account for smooth user onboarding
      user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: 'Data Analyst',
        token: `jwt-token-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      usersStore.push(user);
    }

    activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user.name,
      action: 'User signed in',
      type: 'auth'
    });

    return res.json({
      success: true,
      message: 'Authentication successful',
      token: user.token,
      user
    });
  });

  // Auth: Signup
  app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role || 'Data Analyst',
      token: `jwt-token-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    usersStore.push(newUser);

    activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: newUser.name,
      action: 'Created new user account',
      type: 'auth'
    });

    return res.json({
      success: true,
      message: 'Account created successfully',
      token: newUser.token,
      user: newUser
    });
  });

  // Customers: GET list
  app.get('/api/customers', (req, res) => {
    const { search, gender, clusterId } = req.query;
    let list = [...customersStore];

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(c =>
        c.customerId.toLowerCase().includes(q) ||
        c.gender.toLowerCase().includes(q) ||
        (c.segmentName && c.segmentName.toLowerCase().includes(q))
      );
    }

    if (gender && gender !== 'all') {
      list = list.filter(c => c.gender.toLowerCase() === String(gender).toLowerCase());
    }

    if (clusterId !== undefined && clusterId !== '' && clusterId !== 'all') {
      list = list.filter(c => String(c.clusterId) === String(clusterId));
    }

    return res.json({
      success: true,
      total: list.length,
      customers: list
    });
  });

  // Customers: POST Add
  app.post('/api/customers', (req, res) => {
    const { gender, age, annualIncome, spendingScore } = req.body;
    if (!gender || age === undefined || annualIncome === undefined || spendingScore === undefined) {
      return res.status(400).json({ error: 'Missing required customer fields (gender, age, annualIncome, spendingScore).' });
    }

    const maxId = customersStore.reduce((m, c) => Math.max(m, c.id), 0);
    const newId = maxId + 1;
    const newCustomer: Customer = {
      id: newId,
      customerId: `CUST-${String(newId).padStart(3, '0')}`,
      gender: String(gender),
      age: Number(age),
      annualIncome: Number(annualIncome),
      spendingScore: Number(spendingScore),
      updatedAt: new Date().toISOString()
    };

    customersStore.push(newCustomer);

    // Re-run segmentation to assign cluster
    const seg = performSegmentation(customersStore, {
      algorithm: latestSegmentationResult?.algorithm || 'kmeans',
      nClusters: latestSegmentationResult?.nClusters || 5,
      eps: 0.5,
      minSamples: 5,
      useNormalization: true,
      features: ['annualIncome', 'spendingScore']
    });
    customersStore = seg.customersWithClusters;
    latestSegmentationResult = seg.result;

    activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Admin User',
      action: `Added customer ${newCustomer.customerId}`,
      type: 'customer'
    });

    const created = customersStore.find(c => c.id === newId);
    return res.json({
      success: true,
      message: 'Customer added successfully',
      customer: created
    });
  });

  // Customers: PUT Edit
  app.put('/api/customers/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = customersStore.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const { gender, age, annualIncome, spendingScore } = req.body;
    customersStore[index] = {
      ...customersStore[index],
      gender: gender !== undefined ? String(gender) : customersStore[index].gender,
      age: age !== undefined ? Number(age) : customersStore[index].age,
      annualIncome: annualIncome !== undefined ? Number(annualIncome) : customersStore[index].annualIncome,
      spendingScore: spendingScore !== undefined ? Number(spendingScore) : customersStore[index].spendingScore,
      updatedAt: new Date().toISOString()
    };

    // Re-run segmentation
    const seg = performSegmentation(customersStore, {
      algorithm: latestSegmentationResult?.algorithm || 'kmeans',
      nClusters: latestSegmentationResult?.nClusters || 5,
      eps: 0.5,
      minSamples: 5,
      useNormalization: true,
      features: ['annualIncome', 'spendingScore']
    });
    customersStore = seg.customersWithClusters;
    latestSegmentationResult = seg.result;

    return res.json({
      success: true,
      message: 'Customer updated successfully',
      customer: customersStore.find(c => c.id === id)
    });
  });

  // Customers: DELETE
  app.delete('/api/customers/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = customersStore.find(c => c.id === id);
    if (!existing) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    customersStore = customersStore.filter(c => c.id !== id);

    activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Admin User',
      action: `Deleted customer ${existing.customerId}`,
      type: 'customer'
    });

    return res.json({
      success: true,
      message: `Customer ${existing.customerId} deleted successfully`
    });
  });

  // Dataset Upload
  app.post('/api/upload', (req, res) => {
    const { dataset } = req.body;
    if (!Array.isArray(dataset) || dataset.length === 0) {
      return res.status(400).json({ error: 'Invalid dataset format. Expected non-empty array of objects.' });
    }

    const parsed: Customer[] = dataset.map((item: any, idx: number) => ({
      id: idx + 1,
      customerId: item.CustomerID || item.customerId || `CUST-${String(idx + 1).padStart(3, '0')}`,
      gender: item.Gender || item.gender || 'Female',
      age: Number(item.Age || item.age || 30),
      annualIncome: Number(item['Annual Income (k$)'] || item.annualIncome || item.income || 50),
      spendingScore: Number(item['Spending Score (1-100)'] || item.spendingScore || item.spending || 50)
    }));

    customersStore = parsed;

    // Run fresh segmentation
    const seg = performSegmentation(customersStore, {
      algorithm: 'kmeans',
      nClusters: 5,
      eps: 0.5,
      minSamples: 5,
      useNormalization: true,
      features: ['annualIncome', 'spendingScore']
    });
    customersStore = seg.customersWithClusters;
    latestSegmentationResult = seg.result;

    activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Data Analyst',
      action: `Imported new dataset with ${parsed.length} customer records`,
      type: 'dataset'
    });

    return res.json({
      success: true,
      message: `Successfully uploaded and segmented ${parsed.length} customers.`,
      customerCount: parsed.length,
      result: latestSegmentationResult
    });
  });

  // Run Segmentation Algorithm
  app.post('/api/segment', (req, res) => {
    const { algorithm, nClusters, eps, minSamples, useNormalization, features } = req.body;

    const params = {
      algorithm: algorithm || 'kmeans',
      nClusters: Number(nClusters) || 5,
      eps: Number(eps) || 0.5,
      minSamples: Number(minSamples) || 5,
      useNormalization: useNormalization !== undefined ? Boolean(useNormalization) : true,
      features: Array.isArray(features) && features.length > 0 ? features : ['annualIncome', 'spendingScore']
    };

    const seg = performSegmentation(customersStore, params);
    customersStore = seg.customersWithClusters;
    latestSegmentationResult = seg.result;

    activityLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Data Analyst',
      action: `Executed ${params.algorithm.toUpperCase()} clustering with ${seg.result.clusters.length} segments`,
      type: 'model'
    });

    return res.json({
      success: true,
      result: seg.result,
      customers: customersStore
    });
  });

  // Analytics & EDA Stats
  app.get('/api/analytics', (req, res) => {
    const total = customersStore.length;
    if (total === 0) {
      return res.json({ success: true, empty: true });
    }

    const ages = customersStore.map(c => c.age);
    const incomes = customersStore.map(c => c.annualIncome);
    const spendings = customersStore.map(c => c.spendingScore);

    const calcStats = (arr: number[]) => {
      const sum = arr.reduce((a, b) => a + b, 0);
      const mean = sum / arr.length;
      const sorted = [...arr].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const median = sorted[Math.floor(sorted.length / 2)];
      const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
      const std = Math.sqrt(variance);
      return {
        mean: Math.round(mean * 10) / 10,
        median,
        min,
        max,
        std: Math.round(std * 10) / 10
      };
    };

    const males = customersStore.filter(c => c.gender.toLowerCase() === 'male').length;
    const females = customersStore.filter(c => c.gender.toLowerCase() === 'female').length;

    // Age Groups
    const ageGroups = [
      { group: '18-25', count: customersStore.filter(c => c.age >= 18 && c.age <= 25).length },
      { group: '26-35', count: customersStore.filter(c => c.age >= 26 && c.age <= 35).length },
      { group: '36-50', count: customersStore.filter(c => c.age >= 36 && c.age <= 50).length },
      { group: '51-70', count: customersStore.filter(c => c.age >= 51 && c.age <= 70).length },
      { group: '70+', count: customersStore.filter(c => c.age > 70).length }
    ];

    // Migration Trend Timeline across quarters
    const clusters = latestSegmentationResult?.clusters || [];
    const periods = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];

    const migrationTrends = periods.map((period, index) => {
      const progress = (index + 1) / periods.length;
      const row: Record<string, any> = { period };
      clusters.forEach((cls: any) => {
        const startCount = Math.max(5, Math.round(cls.count * (0.6 + 0.08 * cls.clusterId)));
        const currentCount = cls.count;
        const projectedCount = Math.round(startCount + (currentCount - startCount) * Math.pow(progress, 0.85));
        row[cls.segmentName] = projectedCount;
        row[`${cls.segmentName}_pct`] = total > 0 ? Math.round((projectedCount / total) * 100) : 0;
      });
      return row;
    });

    const migrationEvents = [
      {
        id: 'm1',
        fromSegment: clusters[1]?.segmentName || 'Careful Savers',
        toSegment: clusters[0]?.segmentName || 'VIP Targets',
        count: 14,
        period: 'Q1 2026 -> Q2 2026',
        reason: 'Targeted Concierge & Private Loyalty Upgrades',
        impact: '+14 high-value customers elevated to VIP status (+28% revenue lift)',
        type: 'positive'
      },
      {
        id: 'm2',
        fromSegment: clusters[2]?.segmentName || 'Careless Spenders',
        toSegment: clusters[3]?.segmentName || 'Sensible Budgeters',
        count: 9,
        period: 'Q3 2025 -> Q4 2025',
        reason: 'Automated Buy-Now-Pay-Later (BNPL) & Spending Limits',
        impact: 'Stabilized debt risk while retaining repeat mall visits',
        type: 'neutral'
      },
      {
        id: 'm3',
        fromSegment: clusters[4]?.segmentName || 'Standard Mainstream',
        toSegment: clusters[0]?.segmentName || 'VIP Targets',
        count: 8,
        period: 'Q4 2025 -> Q1 2026',
        reason: 'Holiday Promotion Season & Premium Tier Perks',
        impact: 'Increased average annual income bracket conversion',
        type: 'positive'
      },
      {
        id: 'm4',
        fromSegment: clusters[3]?.segmentName || 'Sensible Budgeters',
        toSegment: clusters[4]?.segmentName || 'Standard Mainstream',
        count: 11,
        period: 'Q2 2025 -> Q3 2025',
        reason: 'Seasonal Fashion Sales & Rewards Card Adoption',
        impact: 'Higher transaction frequency during weekend sales',
        type: 'positive'
      }
    ];

    return res.json({
      success: true,
      totalCustomers: total,
      genderDistribution: { male: males, female: females, malePercentage: Math.round((males / total) * 100), femalePercentage: Math.round((females / total) * 100) },
      ageStats: calcStats(ages),
      incomeStats: calcStats(incomes),
      spendingStats: calcStats(spendings),
      ageGroups,
      segmentResult: latestSegmentationResult,
      migrationTrends,
      migrationEvents
    });
  });

  // Dashboard Summary
  app.get(['/api/dashboard', '/api/analytics/dashboard'], (req, res) => {
    const total = customersStore.length;
    const avgIncome = Math.round(customersStore.reduce((a, c) => a + c.annualIncome, 0) / (total || 1));
    const avgSpending = Math.round(customersStore.reduce((a, c) => a + c.spendingScore, 0) / (total || 1));
    const avgAge = Math.round(customersStore.reduce((a, c) => a + c.age, 0) / (total || 1));

    const clusters = latestSegmentationResult?.clusters || [];
    const largestSegment = clusters.length > 0 ? [...clusters].sort((a, b) => b.count - a.count)[0] : null;

    return res.json({
      success: true,
      totalCustomers: total,
      avgIncome,
      avgSpending,
      avgAge,
      totalClusters: clusters.length,
      largestSegmentName: largestSegment ? largestSegment.segmentName : 'N/A',
      largestSegmentCount: largestSegment ? largestSegment.count : 0,
      clusters,
      recentActivities: activityLogs.slice(0, 10)
    });
  });

  // --- VITE / SERVING FRONTEND ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
