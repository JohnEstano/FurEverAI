from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import os
from pathlib import Path

# app instance  
app = Flask(__name__)

# Configure CORS for development and production
# Update the Vercel domain after deployment
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",  # Local development
            "https://fureverai.vercel.app",  # Production (UPDATE THIS!)
            "https://*.vercel.app",  # Vercel preview deployments
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# =======================================================
# MODEL LOADING
# =======================================================
MODELS_DIR = Path(__file__).parent / 'models'

# Global model storage
models = {
    'dt_model': None,
    'dt_encoder': None,
    'svm_model': None,
    'svm_scaler': None,
    'nb_classifier': None,
    'nb_vectorizer': None,
    'nb_mlb': None,
    'knn_model': None,
    'knn_preprocessor': None,
    'knn_pet_ids': None,
    'knn_features': None,
    'ann_pipeline': None,
    'ann_features': None,
    'lr_model': None
}

def load_models():
    """Load all trained ML models at startup"""
    try:
        # Decision Tree (Pawsonality)
        models['dt_model'] = joblib.load(MODELS_DIR / 'furever_dt_pawsonality_model.pkl')
        models['dt_encoder'] = joblib.load(MODELS_DIR / 'furever_pawsonality_encoder.pkl')
        
        # SVM (Core Matching)
        models['svm_model'] = joblib.load(MODELS_DIR / 'furever_svm_model.pkl')
        models['svm_scaler'] = joblib.load(MODELS_DIR / 'furever_svm_scaler.pkl')
        
        # Naive Bayes (Auto-Tagging)
        models['nb_classifier'] = joblib.load(MODELS_DIR / 'furever_nb_autotagging_model.pkl')
        models['nb_vectorizer'] = joblib.load(MODELS_DIR / 'furever_nb_vectorizer.pkl')
        models['nb_mlb'] = joblib.load(MODELS_DIR / 'furever_nb_mlb.pkl')
        
        # KNN (Recommendations)
        models['knn_model'] = joblib.load(MODELS_DIR / 'furever_nn_recommendations_model.pkl')
        models['knn_preprocessor'] = joblib.load(MODELS_DIR / 'furever_nn_preprocessor.pkl')
        models['knn_pet_ids'] = joblib.load(MODELS_DIR / 'furever_nn_pet_ids.pkl')
        # Optional: full feature matrix to enable query by Pet_ID
        knn_features_path = MODELS_DIR / '4_knn_recommendation_features.csv'
        if knn_features_path.exists():
            try:
                models['knn_features'] = pd.read_csv(knn_features_path, index_col=0)
            except Exception as e:
                print(f"⚠️  Could not load KNN feature CSV: {e}")
        
        # ANN (Deep Matching)
        models['ann_pipeline'] = joblib.load(MODELS_DIR / 'furever_ann_deepmatch_pipeline.pkl')
        models['ann_features'] = joblib.load(MODELS_DIR / 'furever_ann_feature_names.pkl')
        
        # Linear Regression (Adoption Prediction)
        models['lr_model'] = joblib.load(MODELS_DIR / 'furever_lr_adoption_model.pkl')
        
        print("✅ All ML models loaded successfully!")
        return True
    except FileNotFoundError as e:
        print(f"⚠️  Warning: Could not load models - {e}")
        print("Server will run in mock mode. Place model files in 'server/models/' directory.")
        return False
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

# Try to load models at startup
models_loaded = load_models()

# Add no-cache headers to API responses to avoid browser caching of dynamic results
@app.after_request
def add_no_cache_headers(response):
    try:
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    except Exception:
        pass
    return response

# =======================================================
# HEALTH & INFO ENDPOINTS
# =======================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok", 
        "message": "Server is running",
        "models_loaded": models_loaded
    })

@app.route('/api/home', methods=['GET'])
def return_home():
    return jsonify({"message": "Welcome to FurEver.AI API!"})

# =======================================================
# 1. DECISION TREE - Pawsonality Assessment (/api/predict)
# =======================================================

@app.route('/api/predict', methods=['POST'])
def predict_pawsonality():
    """
    Classify user into 8 Pawsonality types based on quiz answers.
    
    Expected Input:
    {
        "Housing_Type": "Apartment" | "House_No_Yard" | "House_Yard",
        "Has_Kids": 0 | 1,
        "Time_At_Home": 1 | 2 | 3,  # 1=Away, 2=Hybrid, 3=WFH
        "Activity_Level": 1 | 2 | 3,  # 1=Low, 2=Medium, 3=High
        "Experience_Level": "First_Time" | "Past_Owner" | "Expert",
        "Pet_Type_Desired": "Dog" | "Cat"
    }
    
    Returns: Pawsonality type + description
    """
    if not models_loaded:
        return jsonify({"status": "error", "message": "Models not loaded"}), 500
    
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['Housing_Type', 'Has_Kids', 'Time_At_Home', 
                          'Activity_Level', 'Experience_Level']
        for field in required_fields:
            if field not in data:
                return jsonify({"status": "error", "message": f"Missing field: {field}"}), 400
        
        # Prepare input DataFrame
        input_df = pd.DataFrame([{
            'Housing_Type': data['Housing_Type'],
            'Has_Kids': int(data['Has_Kids']),
            'Time_At_Home': int(data['Time_At_Home']),
            'Activity_Level': int(data['Activity_Level']),
            'Experience_Level': data['Experience_Level']
        }])
        
        # One-hot encode (match training format)
        input_encoded = pd.get_dummies(
            input_df,
            columns=['Housing_Type', 'Experience_Level'],
            drop_first=True
        )
        
        # Ensure all expected columns exist (add missing ones with 0)
        expected_cols = models['dt_model'].feature_names_in_
        for col in expected_cols:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
        
        # Reorder to match training
        input_encoded = input_encoded[expected_cols]
        
        # Predict
        prediction_encoded = models['dt_model'].predict(input_encoded)[0]
        pawsonality = models['dt_encoder'].inverse_transform([prediction_encoded])[0]
        
        # Pawsonality descriptions
        descriptions = {
            'Active Adventurer': 'High energy, experienced, needs active pets',
            'Cozy Companion': 'Low energy, perfect for calm apartment pets',
            'Social Butterfly': 'Very social, loves outgoing pets',
            'Quiet Caretaker': 'Reserved, ideal for shy or independent pets',
            'Confident Guardian': 'Experienced, great for large breeds',
            'Gentle Nurturer': 'Empathetic, perfect for special needs pets',
            'Playful Enthusiast': 'High energy, loves young playful pets',
            'Balanced Buddy': 'Adaptable, matches with most pets'
        }
        
        return jsonify({
            "status": "success",
            "pawsonality": pawsonality,
            "description": descriptions.get(pawsonality, ""),
            "message": f"You're a {pawsonality}!"
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =======================================================
# 2. SVM - Core Matching (/api/match)
# =======================================================

@app.route('/api/match', methods=['POST'])
def match_compatibility():
    """
    Calculate compatibility score between user and pet.
    
    Expected Input:
    {
        "Activity_Level": 1 | 2 | 3,
        "Has_Kids": 0 | 1,
        "Experience_Level": "First_Time" | "Past_Owner" | "Expert",
        "Pet_Energy_Level": 1 | 2 | 3,
        "Pet_Good_With_Kids": 0 | 1 | 2,
        "Pet_Size": "Small" | "Medium" | "Large",
        "Pet_Grooming_Needs": "Low" | "Medium" | "High"
    }
    
    Returns: Match percentage (0-100%)
    """
    if not models_loaded:
        return jsonify({"status": "error", "message": "Models not loaded"}), 500
    
    try:
        data = request.get_json()
        
        # Calculate energy difference
        activity_energy_diff = abs(int(data['Activity_Level']) - int(data['Pet_Energy_Level']))
        
        # Prepare input
        input_df = pd.DataFrame([{
            'Activity_Energy_Diff': activity_energy_diff,
            'Has_Kids': int(data['Has_Kids']),
            'Good_With_Kids': int(data['Pet_Good_With_Kids']),
            'Experience_Level': data['Experience_Level'],
            'Grooming_Needs': data['Pet_Grooming_Needs'],
            'Size': data['Pet_Size']
        }])
        
        # One-hot encode
        input_encoded = pd.get_dummies(
            input_df,
            columns=['Experience_Level', 'Grooming_Needs', 'Size'],
            drop_first=True
        )
        
        # Align columns with training data
        expected_cols = models['svm_scaler'].feature_names_in_
        for col in expected_cols:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
        input_encoded = input_encoded[expected_cols]
        
        # Scale and predict
        input_scaled = models['svm_scaler'].transform(input_encoded)
        match_proba = models['svm_model'].predict_proba(input_scaled)[0][1]
        match_score = int(match_proba * 100)
        
        return jsonify({
            "status": "success",
            "match_score": match_score,
            "message": f"{match_score}% Match"
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =======================================================
# 3. NAIVE BAYES - Auto-Tagging (/api/tags)
# =======================================================

@app.route('/api/tags', methods=['POST'])
def auto_tag_pet():
    """
    Automatically generate tags from pet description.
    
    Expected Input:
    {
        "description": "A friendly young dog who loves kids and outdoor activities..."
    }
    
    Returns: Array of tags
    """
    if not models_loaded:
        return jsonify({"status": "error", "message": "Models not loaded"}), 500
    
    try:
        data = request.get_json()
        description = data.get('description', '')
        
        if not description:
            return jsonify({"status": "error", "message": "Description required"}), 400
        
        # Vectorize and predict
        description_vectorized = models['nb_vectorizer'].transform([description])
        tags_binary = models['nb_classifier'].predict(description_vectorized)
        tags = set(models['nb_mlb'].inverse_transform(tags_binary)[0])

        # Post-process: enforce rule-based tags based on description keywords
        desc_lc = description.lower()

        # Age-specific tags
        if 'senior' in desc_lc:
            tags.add('senior')
        # puppy/kitten/young
        if 'puppy' in desc_lc:
            tags.add('puppy')
        if 'kitten' in desc_lc:
            tags.add('kitten')
        # common phrasing for young
        if 'young' in desc_lc or 'young adult' in desc_lc:
            tags.add('young')

        # Apartment suitability
        apartment_keywords = [
            'apartment-approved', 'apartment approved', 'apartment-friendly',
            'apartment friendly', 'apartment suitable', 'apartment lifestyle', 'apartment'
        ]
        if any(k in desc_lc for k in apartment_keywords):
            tags.add('apartment-approved')

        # Optional: reduce over-generic tags when specifics exist
        # If age-specific tag present, no need for overly generic 'social' unless explicitly mentioned
        if any(x in tags for x in ['senior', 'puppy', 'kitten', 'young']):
            if 'social' in tags and ('shy' in desc_lc or 'quiet' in desc_lc):
                tags.discard('social')

        tags = list(sorted(tags))
        
        return jsonify({
            "status": "success",
            "tags": tags
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =======================================================
# 4. KNN - Similar Pet Recommendations (/api/recommend)
# =======================================================

@app.route('/api/recommend', methods=['POST'])
def recommend_similar_pets():
    """
    Find similar pets based on pet features.
    
    Expected Input:
    {
        "Pet_ID": "P0050",
        "n_recommendations": 5  # optional, default 5
    }
    OR provide pet features directly
    
    Returns: List of similar Pet IDs
    """
    if not models_loaded:
        return jsonify({"status": "error", "message": "Models not loaded"}), 500
    
    try:
        data = request.get_json()
        n_recs = data.get('n_recommendations', 5)
        
        pet_id = data.get('Pet_ID')
        n_recs = int(data.get('n_recommendations', 5))

        # If we have features CSV and a Pet_ID, perform real recommendations
        if pet_id and models.get('knn_features') is not None:
            features_df = models['knn_features']
            if pet_id not in features_df.index:
                return jsonify({"status": "error", "message": f"Pet_ID {pet_id} not found in feature store"}), 404

            query_row = features_df.loc[[pet_id]]  # preserve DataFrame shape
            try:
                X_query = models['knn_preprocessor'].transform(query_row)
                distances, indices = models['knn_model'].kneighbors(X_query, n_neighbors=min(n_recs+1, len(models['knn_pet_ids'])))
                # Map indices to Pet IDs
                all_ids = models['knn_pet_ids'].iloc[indices[0]].tolist()
                # Remove the query pet itself if present
                rec_ids = [pid for pid in all_ids if pid != pet_id][:n_recs]
                return jsonify({
                    "status": "success",
                    "recommended_pet_ids": rec_ids,
                    "message": f"KNN recommendations for {pet_id}"
                })
            except Exception as e:
                return jsonify({"status": "error", "message": f"KNN recommendation failed: {e}"}), 500

        # Fallback mock response when features are unavailable
        return jsonify({
            "status": "success",
            "recommended_pet_ids": ["P0051", "P0052", "P0053", "P0054", "P0055"],
            "message": "KNN recommendations (using mock data - add '4_knn_recommendation_features.csv' to server/models for real results)"
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =======================================================
# 5. ANN - Deep Match Score (/api/deep-match)
# =======================================================

@app.route('/api/deep-match', methods=['POST'])
def deep_match_score():
    """
    Advanced compatibility using Neural Network.
    
    Expected Input: Same as /api/match
    
    Returns: AI DeepMatch score (0-100%)
    """
    if not models_loaded:
        return jsonify({"status": "error", "message": "Models not loaded"}), 500
    
    try:
        data = request.get_json()
        
        # Calculate energy difference
        activity_energy_diff = abs(int(data['Activity_Level']) - int(data['Pet_Energy_Level']))
        
        # Prepare raw input
        raw_df = pd.DataFrame([{
            'Activity_Energy_Diff': activity_energy_diff,
            'Has_Kids': int(data['Has_Kids']),
            'Good_With_Kids': int(data['Pet_Good_With_Kids']),
            'Experience_Level': data['Experience_Level'],
            'Grooming_Needs': data['Pet_Grooming_Needs'],
            'Size': data['Pet_Size']
        }])

        # IMPORTANT: The ANN pipeline was trained on the same dummied columns
        # as the SVM/ANN training CSV (2_5_svm_ann_matching_training.csv).
        # Recreate those columns to match models['ann_features'].
        encoded = pd.get_dummies(
            raw_df,
            columns=['Experience_Level', 'Grooming_Needs', 'Size'],
            drop_first=True
        )

        # Align columns to ANN feature list
        expected_cols = models['ann_features']
        for col in expected_cols:
            if col not in encoded.columns:
                encoded[col] = 0
        encoded = encoded[expected_cols]

        # Predict probability
        deep_match_proba = models['ann_pipeline'].predict_proba(encoded)[0][1]
        deep_match_score = int(deep_match_proba * 100)
        
        return jsonify({
            "status": "success",
            "deep_match_score": deep_match_score,
            "message": f"AI DeepMatch: {deep_match_score}%"
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =======================================================
# 6. LINEAR REGRESSION - Adoption Timeline (/api/adoption-prediction)
# =======================================================

@app.route('/api/adoption-prediction', methods=['POST'])
def predict_adoption_timeline():
    """
    Predict how many days until a pet gets adopted.
    
    Expected Input:
    {
        "Type": "Dog" | "Cat",
        "Age_Group": "Puppy/Kitten" | "Young_Adult" | "Senior",
        "Size": "Small" | "Medium" | "Large",
        "Energy_Level": 1 | 2 | 3,
        "Grooming_Needs": "Low" | "Medium" | "High"
    }
    
    Returns: Predicted days in shelter
    """
    if not models_loaded:
        return jsonify({"status": "error", "message": "Models not loaded"}), 500
    
    try:
        data = request.get_json()
        
        # Prepare input
        input_df = pd.DataFrame([{
            'Type': data['Type'],
            'Age_Group': data['Age_Group'],
            'Size': data['Size'],
            'Energy_Level': int(data['Energy_Level']),
            'Grooming_Needs': data['Grooming_Needs']
        }])
        
        # One-hot encode
        input_encoded = pd.get_dummies(
            input_df,
            columns=['Type', 'Age_Group', 'Size', 'Grooming_Needs'],
            drop_first=True
        )
        
        # Align columns
        expected_cols = models['lr_model'].feature_names_in_
        for col in expected_cols:
            if col not in input_encoded.columns:
                input_encoded[col] = 0
        input_encoded = input_encoded[expected_cols]
        
        # Predict
        predicted_days = int(models['lr_model'].predict(input_encoded)[0])
        predicted_days = max(1, predicted_days)  # Ensure minimum 1 day
        
        return jsonify({
            "status": "success",
            "predicted_days": predicted_days,
            "message": f"Predicted adoption: {predicted_days} days"
        })
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =======================================================
# RUN SERVER
# =======================================================

if __name__ == '__main__':
    # Get port from environment variable (Render uses PORT)
    port = int(os.environ.get('PORT', 5000))
    # Disable reloader to keep single stable process for tooling
    app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)