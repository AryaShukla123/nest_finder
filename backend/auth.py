from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

from models import UserRegister, UserLogin, UserResponse, Token, UserInDB
from database import get_database

load_dotenv()

router = APIRouter()

# Security Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Helper Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Routes
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    db = get_database()
    users_collection = db.users
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "full_name": user.full_name,
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    
    # Create access token
    access_token = create_access_token(data={"sub": created_user["email"]})
    
    user_response = UserResponse(
        id=str(created_user["_id"]),
        full_name=created_user["full_name"],
        email=created_user["email"],
        created_at=created_user["created_at"]
    )
    
    return Token(access_token=access_token, user=user_response)

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db = get_database()
    users_collection = db.users
    
    # Find user
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user["email"]})
    
    user_response = UserResponse(
        id=str(db_user["_id"]),
        full_name=db_user["full_name"],
        email=db_user["email"],
        created_at=db_user["created_at"]
    )
    
    return Token(access_token=access_token, user=user_response)

@router.get("/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    db = get_database()
    users_collection = db.users
    user = await users_collection.find_one({"email": email})
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        full_name=user["full_name"],
        email=user["email"],
        created_at=user["created_at"]
    )