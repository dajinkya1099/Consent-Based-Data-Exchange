from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(
    title="API Gateway",
    description="Gateway proxy for auth, profile, verification, and dashboard microservices.",
    version="0.1.0",
)

@app.on_event("startup")
def startup_event():
    print("API Gateway starting on port 8000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"API Gateway: Endpoint hit - {request.method} {request.url.path}")
    response = await call_next(request)
    return response

SERVICE_MAP = {
    "auth": "http://auth-service:8001",
    "profile": "http://profile-service:8002",
    "verify": "http://verification-service:8003",
    "dashboard": "http://dashboard-service:8004",
    "consent": "http://consent-service:8005",
}

EXCLUDED_HEADERS = {
    "content-encoding",
    "transfer-encoding",
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "upgrade",
}


async def proxy_request(service_name: str, path: str, request: Request) -> Response:
    target_url = f"{SERVICE_MAP[service_name]}/{service_name}/{path}"
    async with httpx.AsyncClient() as client:
        request_headers = {
            key: value
            for key, value in request.headers.items()
            if key.lower() not in EXCLUDED_HEADERS
        }
        body = await request.body()
        response = await client.request(
            request.method,
            target_url,
            headers=request_headers,
            params=request.query_params,
            content=body,
            timeout=30.0,
        )

    response_headers = {
        key: value
        for key, value in response.headers.items()
        if key.lower() not in EXCLUDED_HEADERS
    }
    return Response(content=response.content, status_code=response.status_code, headers=response_headers)


@app.api_route("/api/{service}/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
@app.api_route("/api/v1/{service}/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy(service: str, path: str, request: Request):
    if service not in SERVICE_MAP:
        raise HTTPException(status_code=404, detail="Target service not found.")
    print(f"API Gateway: Proxying request to {service} service at {path}")
    return await proxy_request(service, path, request)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "api-gateway"}
