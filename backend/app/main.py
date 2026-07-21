import os
import sys

# Ensure backend directory is in python path for direct script execution
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base
from app.routers import ai, complaints

# Create tables in DB
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIVOA QMS - Customer Complaint Management API",
    description="Backend API powered by FastAPI, LangGraph, and Groq LLM",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(ai.router)
app.include_router(complaints.router)

# Serve sample files statically
samples_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "samples")
if os.path.exists(samples_dir):
    app.mount("/samples", StaticFiles(directory=samples_dir), name="samples")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "AIVOA Customer Complaint Management QMS API",
        "langgraph_agent": "Ready",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
