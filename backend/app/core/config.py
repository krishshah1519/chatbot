import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

BASE_DIR= Path(__file__).resolve().parent.parent
BACKEND_CORS_ORIGINS= ["https://chatbot-frontend-fso2.onrender.com","https://chatbot-rbgtda1zj-krishshah1519-gmailcoms-projects.vercel.app","http://chatbot-delta-two-99.vercel.app","http://chatbot-9jh89sucn-krishshah1519-gmailcoms-projects.vercel.app", "http://localhost:3000" , ]