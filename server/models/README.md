# 📦 Models Directory

Place your trained model files (`.pkl` files) here after downloading from Colab.

## Required Files (13 total):

### Decision Tree (Pawsonality)
- `furever_dt_pawsonality_model.pkl`
- `furever_pawsonality_encoder.pkl`

### SVM (Core Matching)
- `furever_svm_model.pkl`
- `furever_svm_scaler.pkl`

### Naive Bayes (Auto-Tagging)
- `furever_nb_autotagging_model.pkl`
- `furever_nb_vectorizer.pkl`
- `furever_nb_mlb.pkl`

### KNN (Recommendations)
- `furever_nn_recommendations_model.pkl`
- `furever_nn_preprocessor.pkl`
- `furever_nn_pet_ids.pkl`

### ANN (Deep Matching)
- `furever_ann_deepmatch_pipeline.pkl`
- `furever_ann_feature_names.pkl`

### Linear Regression (Adoption Prediction)
- `furever_lr_adoption_model.pkl`

---

## How to Get These Files:

1. **In your Colab notebook**, add and run the export script:
   ```python
   # Copy code from: ../colab_export_models.py
   ```

2. **Download** `furever_models.zip`

3. **Extract** all `.pkl` files

4. **Copy** all files to this `server/models/` directory

5. **Start the server**:
   ```powershell
   cd server
   python server.py
   ```

---

## ⚠️ Important Notes:

- Model files are **NOT committed to Git** (see `.gitignore`)
- Each team member needs to download models separately
- Store models in cloud storage (Google Drive, S3) for team sharing
- Total size: ~5-10 MB (depending on your data)

---

## ✅ Verify Models Loaded:

```powershell
# Check health endpoint
Invoke-WebRequest http://localhost:5000/api/health | Select-Object -Expand Content
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "models_loaded": true
}
```

If `models_loaded: false`, check that all 13 files are present in this directory.
