from fastapi import APIRouter, Depends, HTTPException, status
from starlette.responses import StreamingResponse

from backend.app.db.session import get_db
from backend.app.schemas.message import MessageCreate

router = APIRouter()
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.schemas.chat import ChatCreateResponse, ChatOut, ChatTitleUpdate, ChatMessageOut
from backend.app.services import chat_service, message_service, llm_service

from typing import List


@router.post("/chats", response_model=ChatCreateResponse, status_code= status.HTTP_201_CREATED )
async def create_new_chat(db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return chat_service.create_chat(current_user.id, db)

@router.get("/chats", response_model=List[ChatOut], status_code= status.HTTP_200_OK)
async def get_all_user_chats(db: Session= Depends(get_db), current_user: User= Depends(get_current_user)):
    return chat_service.get_all_chats_user(current_user.id, db)


@router.get("/chats/{chat_id}", response_model=ChatMessageOut, status_code= status.HTTP_200_OK)
async def get_chat(chat_id:str, db: Session= Depends(get_db), current_user: User= Depends(get_current_user)):
    return chat_service.get_chat_by_id(chat_id, current_user.id, db)


@router.patch("/chats/{chat_id}", response_model=ChatOut, status_code= status.HTTP_200_OK)
async def rename_chat(chat_id:str, title:ChatTitleUpdate, db: Session= Depends(get_db), current_user: User= Depends(get_current_user)):
    return chat_service.rename_chat(chat_id,current_user.id,title,db)

@router.delete("/chats/{chat_id}", status_code= status.HTTP_204_NO_CONTENT)
async def delete_chat(chat_id: str,db: Session= Depends(get_db), current_user: User= Depends(get_current_user)):
    chat_service.delete_chat(chat_id,current_user.id, db)
    return

@router.post("/chats/{chat_id}/message", status_code=status.HTTP_200_OK)
async def chat(chat_id:str ,message: MessageCreate, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    try:
        chat_service.touch_chat(chat_id, current_user.id, db)
        message_service.create_message(
            chat_id=chat_id, sender="user", message_text=message.message, db=db
        )

        history = message_service.get_messages_by_chat_id(chat_id, db)

        formatted_history = [{"role": msg.sender, "content": msg.message} for msg in history[:-1]]
        user_question = history[-1].message

        async def stream_and_save():
            full_response = ""
            try:
                response_generator = llm_service.get_llm_response(formatted_history, user_question)
                async for chunk in response_generator:
                    full_response += chunk
                    yield chunk
            except Exception as e:

                print(f"Error during LLM stream: {e}")
                yield "Sorry, something went wrong with the AI service."
            finally:
                if full_response:
                    message_service.create_message(
                        chat_id=chat_id,
                        sender="assistant",
                        message_text=full_response,
                        db=db
                    )
        return StreamingResponse(stream_and_save(), media_type="text/plain")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))