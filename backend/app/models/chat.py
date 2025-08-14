from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from backend.app.db.session import Base
import uuid, json


class Chat(Base):
    __tablename__ = "chats"
    chat_id=Column(String,primary_key=True,index=True, default=lambda: str(uuid.uuid4()))
    user_id= Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=True) # Add this line
    _chat_history=Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    @property
    def chat_history(self):
        return json.loads(self._chat_history) if self._chat_history else []

    @chat_history.setter
    def chat_history(self, value):
        self._chat_history = json.dumps(value)