from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import student, auth
from app.database.base import Base, engine


app = FastAPI()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Register routers
app.include_router(student.router)
app.include_router(auth.router)