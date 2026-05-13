import json
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from pydantic import BaseModel, constr

BASE_DIR = Path(__file__).resolve().parent
MOCK_DIR = BASE_DIR / "mock_data"

app = FastAPI(
    title="Verification Service",
    description="Verification microservice for Aadhaar, OTP, and organisation document checks.",
    version="0.1.0",
)

@app.on_event("startup")
def startup_event():
    print("Verification Service starting on port 8003")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Verification Service: Endpoint hit - {request.method} {request.url.path}")
    response = await call_next(request)
    return response

class OTPType(str, Enum):
    email = "email"
    mobile = "mobile"

class OrganisationDocumentType(str, Enum):
    GST = "GST"
    CIN = "CIN"
    MSME = "MSME"
    PAN = "PAN"

class AadhaarRequest(BaseModel):
    aadhaar_number: constr(strip_whitespace=True, min_length=12, max_length=12)

class AadhaarVerificationResponse(BaseModel):
    verified: bool
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    mobile: Optional[str] = None
    message: str

class OTPRequest(BaseModel):
    contact_type: OTPType
    contact: str
    otp: constr(strip_whitespace=True, min_length=4, max_length=8)

class OTPVerificationResponse(BaseModel):
    verified: bool
    message: str

class OrgValidationRequest(BaseModel):
    document_type: OrganisationDocumentType
    registration_number: constr(strip_whitespace=True, min_length=5)

class OrgValidationResponse(BaseModel):
    valid: bool
    document_type: OrganisationDocumentType
    registration_number: str
    message: str


def _load_mock(filename: str):
    path = MOCK_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=500, detail=f"Mock file {filename} not found")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "verification"}


@app.post("/verify/aadhaar", response_model=AadhaarVerificationResponse)
def verify_aadhaar(request: AadhaarRequest):
    print(f"Verification Service: Aadhaar verification requested for {request.aadhaar_number}")
    data = _load_mock("aadhaar_data.json")
    profile = data.get(request.aadhaar_number)
    if not profile:
        print(f"Verification Service: Aadhaar {request.aadhaar_number} not found")
        return AadhaarVerificationResponse(
            verified=False,
            message="Aadhaar number not found in mock records.",
        )

    print(f"Verification Service: Aadhaar {request.aadhaar_number} verified successfully")
    return AadhaarVerificationResponse(
        verified=True,
        first_name=profile.get("first_name"),
        last_name=profile.get("last_name"),
        mobile=profile.get("mobile"),
        message="Aadhaar verified successfully.",
    )


@app.post("/verify/otp", response_model=OTPVerificationResponse)
def verify_otp(request: OTPRequest):
    data = _load_mock("otp_data.json")
    key = "email_otps" if request.contact_type == OTPType.email else "mobile_otps"
    otp_map = data.get(key, {})
    expected_otp = otp_map.get(request.contact)
    if expected_otp and expected_otp == request.otp:
        return OTPVerificationResponse(verified=True, message="OTP verified successfully.")
    return OTPVerificationResponse(verified=False, message="Invalid OTP or contact not registered.")


@app.post("/verify/organisation-document", response_model=OrgValidationResponse)
def verify_organisation_document(request: OrgValidationRequest):
    data = _load_mock("org_validation_data.json")
    lookup = data.get(request.document_type.value.lower() + "s", {})
    valid = request.registration_number in lookup
    message = (
        "Document validation succeeded." if valid else "Document number is not valid in mock records."
    )
    return OrgValidationResponse(
        valid=valid,
        document_type=request.document_type,
        registration_number=request.registration_number,
        message=message,
    )
