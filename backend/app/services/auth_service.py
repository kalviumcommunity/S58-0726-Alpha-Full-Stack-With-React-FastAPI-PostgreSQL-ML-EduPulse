from app.models.user import User
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

# 🔐 JWT Config
SECRET_KEY = "your-secret"
ALGORITHM = "HS256"

# 🔑 Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

# 🔐 Token Creation
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# 📝 Register
def register_user(db, user):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        return {"error": "User already exists"}

    hashed_password = hash_password(user.password)

    new_user = User(
        email=user.email,
        password=hashed_password,
        role="user"   # ✅ now valid AFTER step 3
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# 🔓 Login (FINAL)
def login_user(db, user):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        return {"error": "User not found"}

    if not verify_password(user.password, db_user.password):
        return {"error": "Invalid password"}

    token = create_access_token({"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

