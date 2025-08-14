from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from backend.app.core.config import  BASE_DIR

Database_url=f"sqlite:///{BASE_DIR}/database.db"
engine= create_engine(Database_url,connect_args={"check_same_thread": False})
SessionLocal= sessionmaker(autocommit= False, autoflush= False, bind=engine)

Base= declarative_base()

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()

