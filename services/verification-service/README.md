# Verification Service

This microservice provides Aadhaar, OTP, and organisation document validation using mock JSON data.

## Endpoints

- `POST /verify/aadhaar`
- `POST /verify/otp`
- `POST /verify/organisation-document`
- `GET /health`

## Run locally

```powershell
cd services/verification-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8003
```
