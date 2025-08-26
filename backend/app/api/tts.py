from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.concurrency import run_in_threadpool
from gtts import gTTS
import io
from pydantic import BaseModel

router = APIRouter()

class TTSRequest(BaseModel):
    text: str

def generate_audio(text: str):
    """A synchronous helper function to run the blocking gTTS code."""
    try:
        tts = gTTS(text=text, lang='en', tld='co.uk')
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp
    except Exception as e:

        raise e

@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    try:

        fp = await run_in_threadpool(generate_audio, request.text)
        return StreamingResponse(fp, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))