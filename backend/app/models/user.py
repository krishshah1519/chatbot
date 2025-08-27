from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base
import uuid
from datetime import datetime
from dateutil import tz

class User(Base):
    __tablename__="users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    chats = relationship("Chat", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(username = {self.username})>"

    @property
    def created_at_ist(self):
        if self.created_at:
            return self.created_at.astimezone(tz.gettz('Asia/Kolkata'))
        return None

    @property
    def updated_at_ist(self):
        if self.updated_at:
            return self.updated_at.astimezone(tz.gettz('Asia/Kolkata'))
        return None