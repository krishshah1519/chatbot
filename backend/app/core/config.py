import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

BASE_DIR= Path(__file__).resolve().parent.parent
BACKEND_CORS_ORIGINS= ["http://localhost:3000","https://chatbot-frontend-fso2.onrender.com"]