import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

BASE_DIR= Path(__file__).resolve().parent.parent
BACKEND_CORS_ORIGINS= os.getenv("BACKEND_CORS_ORIGINS","[]").split(",")