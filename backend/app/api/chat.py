from fastapi import Depends, HTTPException, APIRouter, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import MarkdownListOutputParser
from langchain_core.runnables import RunnablePassthrough

from backend.app.schemas.chat import ChatOut
from backend.app.schemas.extras import ChatCreateResponse
from backend.app.db.session import get_db
from backend.app.models.chat import Chat
from backend.app.models.user import User
from backend.app.core.security import get_current_user
from backend.app.schemas.extras import QuestionRequest, ChatTitleUpdate, ChatCreateResponse
router = APIRouter()

load_dotenv()
model = ChatGoogleGenerativeAI(model='gemini-2.5-flash-lite')



@router.post("/chats", response_model=ChatCreateResponse)
async def create_chat(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    chat = Chat(
        user_id=current_user.id,
        title="New Chat",
        chat_history=[]
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return {"chat_id": chat.chat_id, "title": chat.title}


@router.get("/chats", response_model=List[ChatOut])
async def list_chats(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).all()
    # Add a fallback title for chats without one
    for chat in chats:
        if not chat.title and chat.chat_history:
            first_message = chat.chat_history[0].get("text", "Untitled Chat")
            chat.title = f"{first_message[:30]}..." if len(first_message) > 30 else first_message
        elif not chat.title:
            chat.title = "New Chat"
    return chats


@router.get("/chats/{chat_id}", response_model=ChatOut)
async def get_chat(
        chat_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.patch("/chats/{chat_id}", status_code=status.HTTP_200_OK)
async def rename_chat(
        chat_id: str,
        new_title: ChatTitleUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat.title = new_title.title
    db.commit()
    db.refresh(chat)
    return {"message": "Chat renamed successfully."}


@router.delete("/chats/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(
        chat_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    db.delete(chat)
    db.commit()
    return


@router.post("/chats/{chat_id}/ask")
async def ask_in_chat(
        chat_id: str,
        req: QuestionRequest,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    history = chat.chat_history
    history.append({"sender": "user", "text": req.question})

    # Build conversation string for the model
    conversation_text = ""
    for msg in history:
        role = "User" if msg["sender"] == "user" else "Assistant"
        conversation_text += f"{role}: {msg['text']}\n"
    conversation_text += "Assistant:"

    # Prompt template
    template_string = """
You are a helpful AI assistant.
Answer the user's question in a clear, concise, and friendly way.
Always format the response as a Markdown bullet list, each bullet being a separate point.

Conversation so far:
{conversation}
"""
    prompt = ChatPromptTemplate.from_template(template_string)

    # Output parser for Markdown bullets
    markdown_parser = MarkdownListOutputParser()

    # Chain: passthrough input -> prompt -> model -> parser
    # Chain setup with correct variable name
    chain = (
            {"conversation": RunnablePassthrough()}
            | prompt
            | model
            | markdown_parser
    )

    answer_list = chain.invoke({"conversation": conversation_text})

    # Convert parsed output into single string for history
    bot_message = "\n".join(answer_list)
    history.append({"sender": "bot", "text": bot_message})

    # Save updated chat
    chat.chat_history = history
    db.commit()
    db.refresh(chat)

    # Return the parsed content
    return {"answer": answer_list}