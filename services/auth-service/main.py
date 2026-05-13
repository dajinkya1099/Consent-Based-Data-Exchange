from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from typing import Literal, Optional
import uuid

app = FastAPI(
    title="Auth Service",
    description="Authentication microservice for login, OTP request, and token issuance.",
    version="0.1.0",
)

@app.on_event("startup")
def startup_event():
    print("Auth Service starting on port 8001")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Auth Service: Endpoint hit - {request.method} {request.url.path}")
    response = await call_next(request)
    return response

class LoginRequest(BaseModel):
    username: str
    password: str

class OTPRequest(BaseModel):
    contact_type: Literal["email", "mobile"]
    contact: str

class OTPVerifyRequest(OTPRequest):
    otp: constr(strip_whitespace=True, min_length=4, max_length=8)

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    user_type: str
    display_name: str

class SimpleResponse(BaseModel):
    message: str
    otp: Optional[str] = None

users = [
    {
        "user_type": "individual",
        "username": "individualUser",
        "password": "Password123",
        "email": "user@example.com",
        "mobile": "9999999999",
        "display_name": "Individual User",
    },
    {
        "user_type": "organisation",
        "username": "organisationUser",
        "password": "OrgPass123",
        "email": "org@example.com",
        "display_name": "Organisation Admin",
    },
]

otp_map = {
    "individual": "123456",
    "organisation": "654321",
}

sessions: dict[str, dict] = {}


def _find_user_by_username(username: str) -> Optional[dict]:
    normalized = username.strip().lower()
    return next((user for user in users if user["username"].lower() == normalized), None)


def _find_user_by_contact(contact_type: str, contact: str) -> Optional[dict]:
    normalized = contact.strip().lower()
    for user in users:
        if user["user_type"] == "organisation" and contact_type == "email" and user["email"].lower() == normalized:
            return user
        if user["user_type"] == "individual":
            if contact_type == "email" and user["email"].lower() == normalized:
                return user
            if contact_type == "mobile" and user.get("mobile") == contact.strip():
                return user
    return None


def _create_token(user: dict) -> str:
    token = str(uuid.uuid4())
    sessions[token] = {
        "username": user["username"],
        "user_type": user["user_type"],
        "display_name": user["display_name"],
    }
    return token


@app.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    user = _find_user_by_username(request.username)
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    access_token = _create_token(user)
    return AuthResponse(
        access_token=access_token,
        username=user["username"],
        user_type=user["user_type"],
        display_name=user["display_name"],
    )


@app.post("/otp/request", response_model=SimpleResponse)
def request_otp(request: OTPRequest):
    user = _find_user_by_contact(request.contact_type, request.contact)
    if not user:
        raise HTTPException(status_code=404, detail="No user found for the provided contact.")

    otp = otp_map[user["user_type"]]
    return SimpleResponse(message=f"Mock OTP sent to {request.contact}.", otp=otp)


@app.post("/otp/verify", response_model=AuthResponse)
def verify_otp(request: OTPVerifyRequest):
    user = _find_user_by_contact(request.contact_type, request.contact)
    if not user:
        raise HTTPException(status_code=404, detail="No user found for the provided contact.")

    expected = otp_map[user["user_type"]]
    if request.otp != expected:
        raise HTTPException(status_code=401, detail="Invalid OTP.")

    access_token = _create_token(user)
    return AuthResponse(
        access_token=access_token,
        username=user["username"],
        user_type=user["user_type"],
        display_name=user["display_name"],
    )


@app.get("/me", response_model=dict)
def get_current_user(token: Optional[str] = None):
    if not token:
        raise HTTPException(status_code=401, detail="Authorization token is required.")
    session = sessions.get(token)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    return session


@app.post("/logout", response_model=SimpleResponse)
def logout(token: Optional[str] = None):
    if token and token in sessions:
        sessions.pop(token)
    return SimpleResponse(message="Logged out successfully.")
