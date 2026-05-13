# Auth Service

This microservice handles login, OTP request, OTP verification, and basic session token issuance.

## Endpoints

- `POST /login`
- `POST /otp/request`
- `POST /otp/verify`
- `GET /me` (token-based lookup)
- `POST /logout`

## Run locally

```powershell
cd services/auth-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
