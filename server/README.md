# FurEverAI Backend

## Setup

1. Create virtual environment:
```powershell
python -m venv .venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
. .venv\Scripts\Activate.ps1
```

2. Install dependencies:
```powershell
pip install -r requirements.txt
```

3. Run the server:
```powershell
python server.py
```

Server will run at http://localhost:5000

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/home` - Home endpoint
- `POST /api/predict` - Model prediction (placeholder for ML team)

## For ML Team

Add your model code in `server.py` in the `/api/predict` endpoint.
Add required packages to `requirements.txt`.
