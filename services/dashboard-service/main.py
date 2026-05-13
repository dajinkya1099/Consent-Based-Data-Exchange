from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel

app = FastAPI(
    title="Dashboard Service",
    description="Dashboard microservice providing summary metrics for logged-in users.",
    version="0.1.0",
)

@app.on_event("startup")
def startup_event():
    print("Dashboard Service starting on port 8004")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Dashboard Service: Endpoint hit - {request.method} {request.url.path}")
    response = await call_next(request)
    return response

class DashboardSummary(BaseModel):
    username: str
    user_type: str
    display_name: str
    total_consents: int
    active_datasets: int
    models_running: int
    pending_approvals: int

@app.get("/dashboard/summary", response_model=DashboardSummary)
def get_summary(username: Optional[str] = None, user_type: Optional[str] = None):
    return DashboardSummary(
        username=username or "anonymous",
        user_type=user_type or "individual",
        display_name="Dashboard User",
        total_consents=4280,
        active_datasets=18,
        models_running=5,
        pending_approvals=12,
    )
