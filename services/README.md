# Microservice Architecture

This folder contains a scaffolded microservice architecture for the Consent Based Data Exchange Platform.

## Services

- `auth-service` - authentication, password login, OTP request, OTP verification, token generation.
- `profile-service` - stores individual and organisation profile data.
- `verification-service` - handles Aadhaar, OTP, and organisation document validation using mock data.
- `dashboard-service` - provides dashboard summary metrics.
- `api-gateway` - routes frontend requests to the correct backend service and preserves a single API entrypoint.

## Run all services

From the `services` folder:

```powershell
cd services
docker-compose up --build
```

This starts the gateway on `http://localhost:8000` and each microservice on its own port:

- `auth-service` → `8001`
- `profile-service` → `8002`
- `verification-service` → `8003`
- `dashboard-service` → `8004`
- `api-gateway` → `8000`

## Notes

The current frontend and existing backend remain unchanged in the repository. These microservices are created as a parallel architecture scaffold so you can migrate safely without affecting the working code.
