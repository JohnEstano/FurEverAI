# 🤖 FurEver.AI Backend - ML Integration Guide

## 📋 Overview

This backend implements **6 Machine Learning algorithms** from your concept paper:

| Algorithm | Endpoint | Purpose |
|-----------|----------|---------|
| Decision Tree | `/api/predict` | Pawsonality Classification (8 types) |
| SVM | `/api/match` | Core Compatibility Scoring |
| Naive Bayes | `/api/tags` | Auto-Tagging Pet Descriptions |
| KNN | `/api/recommend` | Similar Pet Recommendations |
| ANN | `/api/deep-match` | Advanced Deep Matching |
| Linear Regression | `/api/adoption-prediction` | Adoption Timeline Prediction |

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```powershell
cd server
pip install -r requirements.txt
```

### 2. Export Models from Colab

In your Colab notebook, **run this cell at the end**:

```python
# Download all trained models
from google.colab import files

model_files = [
    'furever_dt_pawsonality_model.pkl',
    'furever_pawsonality_encoder.pkl',
    'furever_svm_model.pkl',
    'furever_svm_scaler.pkl',
    'furever_nb_autotagging_model.pkl',
    'furever_nb_vectorizer.pkl',
    'furever_nb_mlb.pkl',
    'furever_nn_recommendations_model.pkl',
    'furever_nn_preprocessor.pkl',
    'furever_nn_pet_ids.pkl',
    'furever_ann_deepmatch_pipeline.pkl',
    'furever_ann_feature_names.pkl',
    'furever_lr_adoption_model.pkl'
]

for file in model_files:
    files.download(file)
```

### 3. Place Models in Server

**Copy all `.pkl` files** to:
```
server/models/
```

Your directory should look like:
```
server/
├── models/
│   ├── furever_dt_pawsonality_model.pkl
│   ├── furever_pawsonality_encoder.pkl
│   ├── furever_svm_model.pkl
│   ├── furever_svm_scaler.pkl
│   ├── ... (all 13 .pkl files)
├── server.py
└── requirements.txt
```

### 4. Run the Server

```powershell
python server.py
```

✅ Server runs at: **http://localhost:5000**

---

## 📡 API Endpoints

### 1️⃣ Decision Tree - Pawsonality Quiz

**POST** `/api/predict`

**Input:**
```json
{
  "Housing_Type": "Apartment",
  "Has_Kids": 0,
  "Time_At_Home": 2,
  "Activity_Level": 2,
  "Experience_Level": "First_Time"
}
```

**Output:**
```json
{
  "status": "success",
  "pawsonality": "Cozy Companion",
  "description": "Low energy, perfect for calm apartment pets",
  "message": "You're a Cozy Companion!"
}
```

---

### 2️⃣ SVM - Core Matching

**POST** `/api/match`

**Input:**
```json
{
  "Activity_Level": 2,
  "Has_Kids": 1,
  "Experience_Level": "Past_Owner",
  "Pet_Energy_Level": 2,
  "Pet_Good_With_Kids": 1,
  "Pet_Size": "Medium",
  "Pet_Grooming_Needs": "Low"
}
```

**Output:**
```json
{
  "status": "success",
  "match_score": 92,
  "message": "92% Match"
}
```

---

### 3️⃣ Naive Bayes - Auto-Tagging

**POST** `/api/tags`

**Input:**
```json
{
  "description": "A friendly young dog who loves kids and outdoor activities. Perfect for an active family!"
}
```

**Output:**
```json
{
  "status": "success",
  "tags": ["family-friendly", "social", "active"]
}
```

---

### 4️⃣ KNN - Recommendations

**POST** `/api/recommend`

**Input:**
```json
{
  "Pet_ID": "P0050",
  "n_recommendations": 5
}
```

**Output:**
```json
{
  "status": "success",
  "recommended_pet_ids": ["P0051", "P0052", "P0053", "P0054", "P0055"]
}
```

⚠️ **Note:** Currently returns mock data. Implement pet database lookup.

---

### 5️⃣ ANN - Deep Matching

**POST** `/api/deep-match`

**Input:** (Same as `/api/match`)

**Output:**
```json
{
  "status": "success",
  "deep_match_score": 95,
  "message": "AI DeepMatch: 95%"
}
```

---

### 6️⃣ Linear Regression - Adoption Prediction

**POST** `/api/adoption-prediction`

**Input:**
```json
{
  "Type": "Dog",
  "Age_Group": "Young_Adult",
  "Size": "Medium",
  "Energy_Level": 2,
  "Grooming_Needs": "Low"
}
```

**Output:**
```json
{
  "status": "success",
  "predicted_days": 12,
  "message": "Predicted adoption: 12 days"
}
```

---

## 🧪 Testing the API

### Using PowerShell:

```powershell
# Test Health Check
Invoke-WebRequest -Uri http://localhost:5000/api/health | Select-Object -Expand Content

# Test Pawsonality (Decision Tree)
$body = @{
    Housing_Type = "Apartment"
    Has_Kids = 0
    Time_At_Home = 2
    Activity_Level = 2
    Experience_Level = "First_Time"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/predict -Method POST -Body $body -ContentType "application/json" | Select-Object -Expand Content
```

### Using Python:

```python
import requests

# Test Match Score (SVM)
data = {
    "Activity_Level": 2,
    "Has_Kids": 1,
    "Experience_Level": "Past_Owner",
    "Pet_Energy_Level": 2,
    "Pet_Good_With_Kids": 1,
    "Pet_Size": "Medium",
    "Pet_Grooming_Needs": "Low"
}

response = requests.post('http://localhost:5000/api/match', json=data)
print(response.json())
```

---

## 🔧 Common Issues

### ❌ "Models not loaded"

**Fix:** Ensure all `.pkl` files are in `server/models/` directory.

### ❌ Import errors

**Fix:** Run `pip install -r requirements.txt`

### ❌ "Feature mismatch" errors

**Fix:** Check that input JSON keys match the training data column names exactly.

---

## 🎯 Next Steps

### For Production:

1. **Add Pet Database**
   - Store pet profiles in PostgreSQL/MongoDB
   - Implement KNN recommendations with real data

2. **Add User Database**
   - Store quiz results
   - Track match history

3. **Add Authentication**
   - JWT tokens
   - User sessions

4. **Optimize Model Loading**
   - Load models once at startup (✅ already done)
   - Use caching for frequently accessed data

5. **Add Logging**
   - Track prediction requests
   - Monitor model performance

---

## 📊 Data Flow

```
User Quiz → Decision Tree → Pawsonality Type
                ↓
        Browse Pets (Frontend)
                ↓
    User + Pet Data → SVM → Match Score
                ↓
         Same Data → ANN → Deep Match Score
                ↓
    User Likes Pet → KNN → Similar Pets
                ↓
   Pet Description → Naive Bayes → Auto Tags
                ↓
    Pet Features → Linear Regression → Adoption Timeline
```

---

## 🚀 You're All Set!

Your backend is now fully integrated with all 6 ML models. The frontend can call these endpoints to power the entire FurEver.AI experience!

**Questions?** Check the main README or contact your team lead.
