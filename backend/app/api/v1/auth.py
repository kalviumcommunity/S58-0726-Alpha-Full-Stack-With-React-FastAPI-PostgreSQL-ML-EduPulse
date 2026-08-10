from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.base import SessionLocal
from app.schemas.user import UserRegister, UserLogin
from app.services.auth_service import register_user, login_user
from app.dependencies.auth_dependency import get_current_user
from app.database.base import SessionLocal
from app.dependencies.role import require_role



router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    return register_user(db, user)


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, user)

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "email": user.email
    }

