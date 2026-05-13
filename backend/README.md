# Backend

This is the FastAPI backend for the Consent Based Data Exchange Platform.

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Notes

- Uses CORS to allow frontend requests from `http://localhost:3000`.
- Verification data is loaded from `app/mock_data/*.json`.
- No database is configured yet.
