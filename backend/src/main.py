from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

from .api.tasks import router as tasks_router
from .api.auth import router as auth_router
from .models.task import Task
from .dependencies import engine
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi


def create_db_and_tables():
    """
    Create database tables
    """
    from sqlmodel import SQLModel
    from .models.user import User  # Import User to register it with SQLModel
    SQLModel.metadata.create_all(engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler to create database tables on startup
    """
    create_db_and_tables()
    yield


# Create FastAPI app with lifespan event handler
app = FastAPI(
    title="Task Management API",
    description="REST API for managing user tasks with persistent storage",
    version="1.0.0",
    lifespan=lifespan,
    debug=os.getenv("DEBUG", "False").lower() == "true"
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js frontend
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the auth and tasks routers
app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(tasks_router, prefix="/api", tags=["tasks"])

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Task Management API"}