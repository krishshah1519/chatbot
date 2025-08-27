
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chat, user, tts

app = FastAPI(
    title="Chat API",
    description="Backend for AI Chat with persistent history",
    version="1.0.0"
)

origins=["http://localhost:3000","http://localhost:5173",]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat.router, tags=["Chats"])
app.include_router(user.router, tags=["Users"])
app.include_router(tts.router, tags=["TTS"])
@app.get("/")
def root():
    return {"message": "Chat backend is running!"}
