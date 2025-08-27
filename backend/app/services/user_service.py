from pydantic import EmailStr
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import CreateUser
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)
def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email:  EmailStr) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user: CreateUser) -> User:
    hashed_pass = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_pass,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user