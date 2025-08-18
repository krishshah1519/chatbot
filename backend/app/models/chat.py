from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from backend.app.db.session import Base
import uuid
from sqlalchemy.orm import relationship

class Chat(Base):
    __tablename__ = "chats"
    id=Column(String,primary_key=True,index=True, default=lambda: str(uuid.uuid4()))
    user_id= Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=True) # Add this line

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user= relationship("User", back_populates="chats")
    messages= relationship("Message", back_populates="chat", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Chat(id='{self.id}', title='{self.title}')>"