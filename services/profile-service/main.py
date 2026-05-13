from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, constr
from typing import Literal, Optional

app = FastAPI(
    title="Profile Service",
    description="Profile microservice for individual and organisation registration data.",
    version="0.1.0",
)

@app.on_event("startup")
def startup_event():
    print("Profile Service starting on port 8002")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Profile Service: Endpoint hit - {request.method} {request.url.path}")
    response = await call_next(request)
    return response

class IndividualProfile(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    mobile: constr(min_length=10, max_length=15)
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    country: str

class OrganisationProfile(BaseModel):
    username: str
    organisation_name: str
    contact_person_name: str
    contact_person_email: EmailStr
    contact_person_mobile: constr(min_length=10, max_length=15)
    document_type: Literal["GST", "CIN", "MSME", "PAN"]
    registration_number: str
    organisation_address: str
    city: str
    state: str
    pincode: str
    country: str

profiles: dict[str, dict] = {}


@app.post("/profiles/individual", response_model=IndividualProfile)
def create_individual_profile(profile: IndividualProfile):
    profiles[profile.username] = profile.dict()
    return profile


@app.post("/profiles/organisation", response_model=OrganisationProfile)
def create_organisation_profile(profile: OrganisationProfile):
    profiles[profile.username] = profile.dict()
    return profile


@app.get("/profiles/{username}", response_model=dict)
def get_profile(username: str):
    profile = profiles.get(username)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return profile
