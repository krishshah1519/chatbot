from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class QuestionRequest(BaseModel):
    question: str


class ChatCreateResponse(BaseModel):
    chat_id: str
    title: str


class ChatTitleUpdate(BaseModel):
    title: str
