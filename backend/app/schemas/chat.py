from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from typing import Optional


class ChatBase(BaseModel):
    chat_history: List[Dict[str, Any]] = []


class ChatCreate(ChatBase):
    user_id: str

class ChatOut(ChatBase):
    chat_id: str
    user_id: str
    title:str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
