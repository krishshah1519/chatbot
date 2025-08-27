import os

from fastapi import APIRouter, HTTPException, status, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core import security
from app.schemas.extras import Token
from app.schemas.user import CreateUser
from app.db.session import get_db
from app.services import user_service
from app.services.user_service import get_user_by_username, get_user_by_email, create_user, verify_password

router = APIRouter()


@router.post("/register/", status_code=status.HTTP_201_CREATED)
async def register(user: CreateUser, db: Session = Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already in use.")
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered.")

    db_user = create_user(db=db, user=user)
    return {"message": f"User {db_user.username} created successfully."}


@router.post("/login", response_model=Token)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = user_service.get_user_by_username(db, username=form_data.username)

    if not user or not user_service.verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = security.create_access_token(data={"sub": user.username})


    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=os.getenv("ENVIRONMENT") == "production",
        samesite='strict',
        max_age=security.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    return {"access_token": access_token, "token_type": "bearer"}