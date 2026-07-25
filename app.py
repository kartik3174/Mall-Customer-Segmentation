from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import pandas as pd
from ml_engine import MallCustomerSegmentationEngine

app = Flask(__name__)
CORS(app)

engine = MallCustomerSegmentationEngine()

# Sample default Mall Customer Dataset
DEFAULT_DATA = [
    {"CustomerID": 1, "Gender": "Male", "Age": 19, "Annual Income (k$)": 15, "Spending Score (1-100)": 39},
    {"CustomerID": 2, "Gender": "Male", "Age": 21, "Annual Income (k$)": 15, "Spending Score (1-100)": 81},
    {"CustomerID": 3, "Gender": "Female", "Age": 20, "Annual Income (k$)": 16, "Spending Score (1-100)": 6},
    {"CustomerID": 4, "Gender": "Female", "Age": 23, "Annual Income (k$)": 16, "Spending Score (1-100)": 77},
    {"CustomerID": 5, "Gender": "Female", "Age": 31, "Annual Income (k$)": 17, "Spending Score (1-100)": 40},
]

df_customers = pd.DataFrame(DEFAULT_DATA)

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Mall Customer Segmentation Flask AI Engine",
        "version": "1.0.0"
    })

@app.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', '')
    password = data.get('password', '')
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    return jsonify({
        "success": True,
        "token": "jwt-flask-token-demo",
        "user": {"email": email, "name": email.split('@')[0].capitalize(), "role": "Data Analyst"}
    })

@app.route('/customers', methods=['GET'])
def get_customers():
    return jsonify({
        "success": True,
        "total": len(df_customers),
        "customers": df_customers.to_dict(orient='records')
    })

@app.route('/segment', methods=['POST'])
def run_segmentation():
    global df_customers
    params = request.json or {}
    algorithm = params.get('algorithm', 'kmeans')
    n_clusters = int(params.get('nClusters', 5))

    processed_df, labels, sil_score, db_score = engine.preprocess_and_fit(
        df_customers.copy(),
        algorithm=algorithm,
        n_clusters=n_clusters
    )

    df_customers['Cluster'] = labels

    return jsonify({
        "success": True,
        "algorithm": algorithm,
        "nClusters": n_clusters,
        "silhouetteScore": sil_score,
        "daviesBouldinIndex": db_score,
        "data": df_customers.to_dict(orient='records')
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
