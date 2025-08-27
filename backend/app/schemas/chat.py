from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from typing import Optional
from app.schemas.message import MessageOut




class ChatOut(BaseModel):
    id: str
    user_id: str
    title:str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ChatCreateResponse(BaseModel):
    id: str
    title: str


class ChatTitleUpdate(BaseModel):
    title: str


class ChatMessageOut(ChatOut):
    messages: List[MessageOut]

    class Config:
        from_attributes = True
