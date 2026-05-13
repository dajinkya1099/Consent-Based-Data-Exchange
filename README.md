# Consent Based Data Exchange Platform

This workspace contains a React/Next.js frontend and a FastAPI backend for a consent-based registration flow.

## Structure

- `frontend/` - Next.js App Router UI with TypeScript, Tailwind CSS, React Hook Form, and Zod validation.
- `backend/` - FastAPI API with CORS enabled and mock data stored in JSON files.

## Setup

### Frontend

1. Create a `.env.local` file in `frontend/` with this value:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

2. Start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`.

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://127.0.0.1:8000`.

## API Endpoints

- `POST /api/verify/aadhaar`
- `POST /api/verify/otp`
- `POST /api/verify/organisation-document`

## Notes

- No persistent storage is used.
- Frontend saves registration data step-by-step in `localStorage` and restores it on reload.
- Backend uses static JSON mocks for verification.

## Microservice Architecture

A parallel microservice scaffold has been added under `services/` to support a transition to a distributed backend.

### Services

- `services/auth-service`
- `services/profile-service`
- `services/verification-service` 
- `services/dashboard-service`
- `services/api-gateway`

### Frontend API gateway path

The frontend now points to the API gateway using the `/api` prefix. By default it uses:

- `http://127.0.0.1:8000/api`

You can also override this value with the environment variable:

- `NEXT_PUBLIC_API_BASE_URL`

### Run microservices

```powershell
cd services
docker-compose up --build
```

The gateway will listen on `http://localhost:8000` and route requests to the corresponding service.

> Note: Do not run the legacy backend server on port `8000` at the same time as the gateway.
