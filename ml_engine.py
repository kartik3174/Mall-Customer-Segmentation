import numpy as np
import pandas as pd
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score, davies_bouldin_score
from sklearn.preprocessing import StandardScaler
import joblib
import os

class MallCustomerSegmentationEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None

    def preprocess_and_fit(self, df, algorithm='kmeans', n_clusters=5, eps=0.5, min_samples=5):
        features = df[['Annual Income (k$)', 'Spending Score (1-100)']].values
        scaled_features = self.scaler.fit_transform(features)

        if algorithm == 'kmeans':
            self.model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
            labels = self.model.fit_predict(scaled_features)
        elif algorithm == 'hierarchical':
            self.model = AgglomerativeClustering(n_clusters=n_clusters)
            labels = self.model.fit_predict(scaled_features)
        elif algorithm == 'dbscan':
            self.model = DBSCAN(eps=eps, min_samples=min_samples)
            labels = self.model.fit_predict(scaled_features)
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")

        # Compute silhouette and Davies-Bouldin metrics
        try:
            sil_score = float(silhouette_score(scaled_features, labels))
            db_score = float(davies_bouldin_score(scaled_features, labels))
        except Exception:
            sil_score = 0.0
            db_score = 0.0

        df['Cluster'] = labels

        # Save model artifact
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, 'models/customer_segmentation_model.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')

        return df, labels, sil_score, db_score
