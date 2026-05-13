from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, constr


class AadhaarRequest(BaseModel):
    aadhaar_number: constr(strip_whitespace=True, min_length=12, max_length=12)


class AadhaarVerificationResponse(BaseModel):
    verified: bool
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    mobile: Optional[str] = None
    message: str


class OTPType(str, Enum):
    email = "email"
    mobile = "mobile"


class OTPRequest(BaseModel):
    contact_type: OTPType
    contact: str
    otp: constr(strip_whitespace=True, min_length=4, max_length=8)


class OTPVerificationResponse(BaseModel):
    verified: bool
    message: str


class OrganisationDocumentType(str, Enum):
    gst = "GST"
    cin = "CIN"
    msme = "MSME"
    pan = "PAN"


class OrgValidationRequest(BaseModel):
    document_type: OrganisationDocumentType
    registration_number: constr(strip_whitespace=True, min_length=5)


class OrgValidationResponse(BaseModel):
    valid: bool
    document_type: OrganisationDocumentType
    registration_number: str
    message: str
