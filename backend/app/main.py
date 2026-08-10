from fastapi import FastAPI
from app.api.v1 import student, auth
from app.database.base import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(student.router)
app.include_router(auth.router)