from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageOut(BaseModel):

    id:str
    chat_id: str
    sender: str
    message: str
    created_at: datetime


    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    message: str