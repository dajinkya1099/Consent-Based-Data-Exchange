from fastapi import FastAPI, HTTPException, Request, requests
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from typing import Optional, Literal
from datetime import datetime
from config import OLLAMA_URL, OLLAMA_MODEL
import requests

app = FastAPI(
    title="Chatbot Service",
    description="Stateless chatbot microservice for AI responses.",
    version="0.1.0",
)


@app.on_event("startup")
def startup_event():
    print("Chatbot Service starting on port 8005")


# CORS (match frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Chatbot Service: {request.method} {request.url.path}")
    response = await call_next(request)
    return response


# =========================
# Models
# =========================

class ChatRequest(BaseModel):
    message: constr(strip_whitespace=True, min_length=1)


class ChatResponse(BaseModel):
    reply: str
    timestamp: str


class HealthResponse(BaseModel):
    status: Literal["healthy"]
    service: str


# =========================
# Mock AI Logic
# =========================

# def generate_response(message: str) -> str:
#     """
#     Replace later with:
#     - OpenAI API
#     - Gemini API
#     - Llama / Ollama
#     - LangChain + RAG
#     """

#     text = message.lower()

#     if "hello" in text or "hi" in text:
#         return "Hello 👋 How can I help you today?"

#     if "dataset" in text:
#         return "You can explore datasets in the dashboard section."

#     if "upload" in text:
#         return "Go to Upload Dataset page to add new datasets."

#     if "help" in text:
#         return "I can help you navigate the platform and answer questions."

#     return f"You said: {message}"


# =========================
# Routes
# =========================

@app.get("/", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        service="chatbot-service",
    )


@app.post("/chatbot/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    try:
        reply = generate_response(request.message)

        return ChatResponse(
            reply=reply,
            timestamp=datetime.utcnow().isoformat(),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chatbot error: {str(e)}",
        )
        
def generate_response(message: str) -> str:
    prompt = build_prompt(message)
    return ollama_model_call(prompt)

def ollama_model_call(prompt):
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=200
        )

        print("STATUS:", response.status_code)
        print("RAW RESPONSE:", response.text)

        data = response.json()

        if "response" in data:
            return data["response"]
        else:
            return f"Unexpected response: {data}"

    except Exception as e:
        return f"Error connecting to Ollama: {str(e)}"
    
def build_prompt(message: str) -> str:
    print("building prompt...")
   
    user_question= message.lower()
    print("user question:", user_question)
    
    prompt = f"""
        You are an expert.

        answer the below question based on the your knowledge and answer should be short and precise.

        User Question:
        {user_question}
        """

    return prompt