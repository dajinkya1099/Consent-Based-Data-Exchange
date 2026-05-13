# Profile Service

This service owns profile and registration data for individuals and organisations.

## Endpoints

- `POST /profiles/individual`
- `POST /profiles/organisation`
- `GET /profiles/{username}`

## Run locally

```powershell
cd services/profile-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8002
```
