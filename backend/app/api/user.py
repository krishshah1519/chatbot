from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.core import security
from backend.app.schemas.extras import Token
from backend.app.schemas.user import CreateUser
from backend.app.db.session import get_db
from backend.app.services import user_service
from backend.app.services.user_service import get_user_by_username, get_user_by_email, create_user, verify_password


router= APIRouter()

@router.post("/register/", status_code=status.HTTP_201_CREATED)
async def register(user: CreateUser, db: Session= Depends(get_db)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already in use.")
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered.")

    db_user = create_user(db=db, user=user)
    return {"message": f"User {db_user.username} created successfully."}

@router.post("/login", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):

    user = user_service.get_user_by_username(db, username=form_data.username)


    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )


    access_token = security.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


