import json
from pathlib import Path
from typing import Optional
from uuid import uuid4

from enum import Enum
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, constr

BASE_DIR = Path(__file__).resolve().parent
MOCK_DIR = BASE_DIR / "mock_data"
CONSUMPTION_FILE = MOCK_DIR / "consent_requests.json"
DATASETS_FILE = MOCK_DIR / "datasets.json"

app = FastAPI(
    title="Consent Management Service",
    description="Service for managing dataset access consent requests.",
    version="0.1.0",
)

@app.on_event("startup")
def startup_event():
    print("Consent Management Service starting on port 8005")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Consent Management Service: Endpoint hit - {request.method} {request.url.path}")
    response = await call_next(request)
    return response


class AccessType(str, Enum):
    public = "public"
    protected = "protected"


class RequestType(str, Enum):
    individual = "individual"
    organisational = "organisational"


class ConsentRequestPayload(BaseModel):
    dataset_id: constr(strip_whitespace=True, min_length=1)
    dataset_name: constr(strip_whitespace=True, min_length=1)
    access_type: AccessType
    request_type: RequestType
    purpose: list[constr(strip_whitespace=True, min_length=1)]
    agreed_to_terms: bool
    requester_email: Optional[EmailStr] = None


class AccessConsentRequestResponse(BaseModel):
    id: str
    message: str


def _load_mock(filename: str):
    path = MOCK_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=500, detail=f"Mock file {filename} not found")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _save_mock(filename: str, payload):
    path = MOCK_DIR / filename
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "consent-management"}


@app.post("/requests", response_model=AccessConsentRequestResponse)
def create_consent_request(request: ConsentRequestPayload):
    print(f"Consent Management Service: Creating request for dataset {request.dataset_id}")

    if not request.agreed_to_terms:
        raise HTTPException(status_code=400, detail="You must agree to terms before submitting a request.")

    if len(request.purpose) == 0:
        raise HTTPException(status_code=400, detail="At least one purpose must be selected.")

    datasets = _load_mock("datasets.json")
    dataset = next((item for item in datasets if item["id"] == request.dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=400, detail="Selected dataset does not exist.")

    if dataset["name"] != request.dataset_name or dataset["access_type"] != request.access_type:
        raise HTTPException(status_code=400, detail="Dataset metadata does not match the selected dataset.")

    requests = _load_mock("consent_requests.json")
    new_id = str(uuid4())
    new_request = request.model_dump()
    new_request["id"] = new_id
    requests.append(new_request)
    _save_mock("consent_requests.json", requests)

    return AccessConsentRequestResponse(
        id=new_id,
        message="Consent request created successfully.",
    )
