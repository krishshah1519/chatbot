# backend/app/core/security.py

import os
from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status, Request # 1. Import Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.services import user_service
from app.models.user import User
from app.db.session import get_db

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for this application in .env file")

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_token_from_cookie(request: Request) -> str | None:
    return request.cookies.get("token")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(token: str = Depends(get_token_from_cookie), db: Session = Depends(get_db)) -> User:
    if token is None:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = user_service.get_user_by_username(db, username=username)

    if user is None:
        raise credentials_exception
    return user