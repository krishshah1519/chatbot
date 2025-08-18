from backend.app.db.session import Base
from sqlalchemy import Column, String, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
import uuid
class Message(Base):
    __tablename__ ="messages"

    id = Column(String,primary_key=True,index=True, default= lambda: str(uuid.uuid4()))
    chat_id = Column(String, ForeignKey("chats.id"), nullable=False)
    sender= Column(String, nullable=False)
    message= Column(Text,nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chat= relationship("Chat", back_populates="messages")

    def __repr__(self):
        return f"<Message(sender='{self.sender}', chat_id='{self.chat_id}')>"