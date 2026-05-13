# API Gateway

This gateway routes frontend requests to the correct backend microservice.

## Routes

- `/api/auth/...` → Auth Service
- `/api/profile/...` → Profile Service
- `/api/verify/...` → Verification Service
- `/api/dashboard/...` → Dashboard Service

## Run locally

```powershell
cd services/api-gateway
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
