# 🔧 Fix Installation Issues

## Step-by-Step Installation

### 1. Open PowerShell as Administrator (Optional but Recommended)

Right-click PowerShell → "Run as Administrator"

### 2. Navigate to Server Directory

```powershell
cd C:\Users\Geff\MachineLearning\FurEverAI\server
```

### 3. Upgrade pip

```powershell
python -m pip install --upgrade pip
```

### 4. Install Packages One by One (If requirements.txt fails)

```powershell
# Core web framework
pip install flask==3.0.0
pip install flask-cors==4.0.0

# Machine Learning
pip install scikit-learn==1.3.2
pip install numpy==1.26.2
pip install pandas==2.1.4
pip install joblib==1.3.2
```

### 5. Or Try Installing Without Specific Versions

```powershell
pip install flask flask-cors scikit-learn numpy pandas joblib
```

### 6. Verify Installation

```powershell
python -c "import flask, flask_cors, sklearn, numpy, pandas, joblib; print('✅ All packages installed!')"
```

---

## Common Issues

### ❌ "No Python installation found"

**Solution:**
```powershell
# Check Python is installed
python --version

# If not found, install Python 3.8+ from python.org
```

### ❌ "Permission denied"

**Solution:**
```powershell
# Run PowerShell as Administrator
# OR install for user only:
pip install --user flask flask-cors scikit-learn numpy pandas joblib
```

### ❌ "Microsoft Visual C++ required" (for scikit-learn)

**Solution:**
- Download: https://aka.ms/vs/17/release/vc_redist.x64.exe
- Install it
- Try pip install again

### ❌ Version conflicts

**Solution:**
```powershell
# Install without specific versions
pip install flask flask-cors scikit-learn numpy pandas joblib --upgrade
```

---

## Quick Test After Installation

```powershell
# Test that Flask works
python -c "from flask import Flask; print('Flask: OK')"

# Test that scikit-learn works
python -c "import sklearn; print('Scikit-learn: OK')"

# Test that pandas works
python -c "import pandas; print('Pandas: OK')"
```

If all show "OK", you're ready to start the server!

---

## Start Server (Once Installed)

```powershell
python server.py
```

Expected output:
```
⚠️  Warning: Could not load models - [Errno 2] No such file or directory: '...'
Server will run in mock mode. Place model files in 'server/models/' directory.
 * Running on http://127.0.0.1:5000
```

This is NORMAL if you haven't placed the model files yet!

Once you add the `.pkl` files to `server/models/`, restart and you'll see:
```
✅ All ML models loaded successfully!
 * Running on http://127.0.0.1:5000
```
