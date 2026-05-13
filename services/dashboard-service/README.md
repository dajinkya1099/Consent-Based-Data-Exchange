# Dashboard Service

This microservice returns dashboard summary metrics for a logged-in user.

## Endpoints

- `GET /dashboard/summary`

## Run locally

```powershell
cd services/dashboard-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8004
```
