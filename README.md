# Mall Customer Segmentation using Unsupervised Machine Learning

An AI-powered customer segmentation web application that analyzes customer demographics and spending behavior using Unsupervised Machine Learning algorithms (**K-Means**, **Hierarchical Agglomerative Clustering**, and **DBSCAN**).

---

## 🌟 Key Features

- **Authentication System**: JWT-based login, signup, role management, and quick demo access.
- **Customer CRUD Management**: Full customer table with search, gender & segment filters, pagination, profile modal views, and spending score indicators.
- **Dataset Manager**: Upload CSV datasets, clean missing values, remove duplicates, inspect statistical feature metrics, and export clean data.
- **ML Clustering Workbench**:
  - **3 Unsupervised Algorithms**: K-Means, Hierarchical Agglomerative, and DBSCAN.
  - **Evaluation Metrics**: Elbow Curve (Inertia WCSS), Silhouette Score analysis, and Davies-Bouldin Index.
  - **Interactive 2D & 3D Scatter Visualizations**: Annual Income vs Spending Score vs Age projections.
  - **Model Benchmark Table**: Algorithm performance comparisons.
- **Automated Business Insights**: Personalized marketing recommendations for 5 key customer segments (High Income - High Spending VIPs, Cautious Savers, Careless Spenders, Sensible Budgeters, and Standard Mainstream).
- **Executive PDF & CSV Reports**: PDF export rendered via canvas, CSV downloads, and chart image save capabilities.
- **Dark Mode & Glassmorphism Design**: Fully responsive, accessible Tailwind CSS UI.

---

## 📂 Project Folder Structure

```
├── server.ts                 # Full-stack Express backend server & Vite SSR middleware
├── app.py                    # Python Flask Machine Learning REST API
├── ml_engine.py              # Scikit-Learn ML logic (KMeans, Hierarchical, DBSCAN, Scaler)
├── requirements.txt          # Python dependencies
├── Dockerfile                # Docker container build script
├── docker-compose.yml        # Multi-container orchestration
├── src/
│   ├── App.tsx               # Main React application router
│   ├── main.tsx              # React entry point
│   ├── types.ts              # TypeScript interfaces and data models
│   ├── context/
│   │   └── AuthContext.tsx   # React authentication & theme state context
│   ├── components/
│   │   ├── Navbar.tsx        # Top navigation header & theme toggle
│   │   ├── Modal.tsx         # Reusable overlay dialogs
│   │   └── ToastContainer.tsx# Alert notification system
│   ├── data/
│   │   └── defaultDataset.ts # Pre-seeded 200 Mall Customer records
│   ├── lib/
│   │   └── mlEngine.ts       # TypeScript Unsupervised ML clustering algorithms & evaluation metrics
│   └── pages/
│       ├── Home.tsx          # Landing overview & quick launcher
│       ├── Login.tsx         # User login form with demo credentials
│       ├── Register.tsx      # Account creation page
│       ├── Dashboard.tsx      # Analytics dashboard with Recharts KPI graphs
│       ├── Customers.tsx     # Full Customer CRUD table & profile modal
│       ├── Dataset.tsx       # CSV Upload, dataset inspection & stats
│       ├── Segmentation.tsx  # Interactive Machine Learning Workbench
│       ├── Analytics.tsx    # Exploratory Data Analysis (EDA) charts
│       ├── Reports.tsx      # PDF Report Builder & CSV Exporter
│       ├── About.tsx        # Technical documentation & algorithm explainers
│       ├── Profile.tsx      # User settings & session details
│       └── NotFound.tsx     # 404 fallback page
```

---

## 🚀 Quick Start Guide

### Frontend & Node Server (Default)

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm run start
```

### Optional Python Flask Backend

```bash
# 1. Install Python packages
pip install -r requirements.txt

# 2. Launch Flask server (Port 5000)
python app.py
```

### Docker Deployment

```bash
# Build and run containers
docker-compose up --build
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check endpoint |
| `POST` | `/api/login` | Authenticate user & return JWT token |
| `POST` | `/api/signup` | Register new user account |
| `GET` | `/api/customers` | Fetch customer records with search/filter queries |
| `POST` | `/api/customers` | Add new customer and trigger re-segmentation |
| `PUT` | `/api/customers/:id` | Update existing customer record |
| `DELETE` | `/api/customers/:id` | Delete customer record |
| `POST` | `/api/upload` | Upload & parse custom CSV dataset |
| `POST` | `/api/segment` | Execute K-Means / Hierarchical / DBSCAN ML algorithms |
| `GET` | `/api/analytics` | Fetch Exploratory Data Analysis (EDA) summary metrics |
| `GET` | `/api/dashboard` | Fetch KPI metrics, cluster stats, and activity logs |

---

## 🎓 Academic Value & Business Applications

- **Targeted Loyalty Programs**: VIP concierge services for high-income high-spending customers.
- **BNPL & Discount Incentives**: Buy-Now-Pay-Later financing for high-spending budget-constrained shoppers.
- **Inventory & Resource Allocation**: Tailoring store placement based on local demographic clusters.
