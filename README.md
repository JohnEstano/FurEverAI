# FurEverAI

Full-stack ML application with Next.js frontend and Flask backend.

## Project Structure

```
FurEverAI/
├── client/          # Next.js frontend (Port 3000)
│   ├── app/         # App Router pages
│   ├── lib/         # API helpers and utilities
│   └── .env.local   # Environment variables
└── server/          # Flask backend (Port 5000)
    ├── server.py    # Main Flask app
    └── requirements.txt
```

## Quick Start

### Backend Setup (Flask)

```powershell
cd server
python -m venv .venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python server.py
```

Backend runs at: http://localhost:5000

### Frontend Setup (Next.js)

```powershell
cd client
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

## Team Workflow

### Frontend Developer (You)
- Work in `client/app/` for pages and UI
- Use `client/lib/api.ts` to call backend endpoints
- All styling in `client/app/globals.css` or component-level
- Backend connection is already configured

### ML Team
- Work in `server/server.py` - implement model in `/api/predict` endpoint
- Add ML dependencies to `server/requirements.txt`
- Backend is configured with CORS for frontend communication

## API Endpoints

- `GET /api/health` - Check server status
- `GET /api/home` - Home endpoint
- `POST /api/predict` - Model prediction (accepts JSON or file upload)

## Environment Variables

Create `client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Notes

- Backend uses Flask with CORS enabled
- Frontend uses Next.js 14+ App Router
- API layer abstracted in `lib/api.ts` for clean separation
