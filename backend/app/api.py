import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.models import (
    AadhaarRequest,
    AadhaarVerificationResponse,
    OTPRequest,
    OTPVerificationResponse,
    OrgValidationRequest,
    OrgValidationResponse,
)

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent
MOCK_DIR = BASE_DIR / "mock_data"


def _load_mock(filename: str):
    path = MOCK_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=500, detail=f"Mock file {filename} not found")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


@router.post("/verify/aadhaar", response_model=AadhaarVerificationResponse)
def verify_aadhaar(request: AadhaarRequest):
    data = _load_mock("aadhaar_data.json")
    profile = data.get(request.aadhaar_number)
    if not profile:
        return AadhaarVerificationResponse(
            verified=False,
            message="Aadhaar number not found in mock records.",
        )

    return AadhaarVerificationResponse(
        verified=True,
        first_name=profile.get("first_name"),
        last_name=profile.get("last_name"),
        mobile=profile.get("mobile"),
        message="Aadhaar verified successfully.",
    )


@router.post("/verify/otp", response_model=OTPVerificationResponse)
def verify_otp(request: OTPRequest):
    data = _load_mock("otp_data.json")
    if request.contact_type == OTPType.email:
        otp_map = data.get("email_otps", {})
    else:
        otp_map = data.get("mobile_otps", {})

    expected_otp = otp_map.get(request.contact)
    if expected_otp and expected_otp == request.otp:
        return OTPVerificationResponse(verified=True, message="OTP verified successfully.")

    return OTPVerificationResponse(verified=False, message="Invalid OTP or contact not registered.")


@router.post("/verify/organisation-document", response_model=OrgValidationResponse)
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
