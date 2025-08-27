from app.models.message import Message
from sqlalchemy.orm import Session

def create_message(chat_id:str, sender:str , message_text: str,db: Session):
    db_message = Message(
        chat_id=chat_id,
        sender=sender,
        message=message_text
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_messages_by_chat_id(chat_id: str, db: Session):
    return db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at.asc()).all()
