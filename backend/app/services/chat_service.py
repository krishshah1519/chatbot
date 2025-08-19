from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from sqlalchemy import desc
from backend.app.schemas.chat import ChatMessageOut, ChatTitleUpdate, ChatOut
from backend.app.models.chat import Chat
from fastapi import HTTPException
from typing import List
def check_if_chat(chat):
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


def get_chat_by_id(chat_id: str, user_id:str , db: Session)-> Chat:
    chat= db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user_id).first()
    return check_if_chat(chat)


def get_all_chats_user(user_id:str , db: Session)-> List[Chat]:
    return db.query(Chat).filter(Chat.user_id == user_id).order_by(desc(Chat.updated_at), desc(Chat.created_at)).all()

def create_chat(user_id:str, db:Session)->Chat:
    chat= Chat(
        user_id= user_id,
        title= "New Chat"
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat

def rename_chat(chat_id:str, user_id:str,new_title:ChatTitleUpdate , db:Session)-> Chat :
    chat= get_chat_by_id(chat_id, user_id, db)
    chat.title = new_title.title
    db.commit()
    db.refresh(chat)
    return chat

def delete_chat(chat_id:str, user_id:str, db:Session) -> bool:
    chat = get_chat_by_id(chat_id, user_id, db)
    db.delete(chat)
    db.commit()
    return True

def touch_chat(chat_id: str, user_id: str, db: Session):

    chat = get_chat_by_id(chat_id, user_id, db)
    chat.updated_at = func.now()
    db.commit()
    db.refresh(chat)
    return chat
