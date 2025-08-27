from typing import AsyncGenerator
from operator import itemgetter
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi import HTTPException
from dotenv import load_dotenv
from app.services.rag_service import get_retriever
import os

load_dotenv()
model = ChatGoogleGenerativeAI(
    model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite"),
    model_kwargs={"streaming": True},
)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Answer the user's questions based on the retrieved context and the chat history. "
            "If the context does not contain the answer, use your general knowledge. If you don't know, just say you don't know."
            "unless the user specifically asks limit the responses to 200 words",
        ),
        ("system", "Retrieved Context:\n\n{context}"),
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{question}"),
    ]
)

def get_retrieval_chain(chat_id: str):
    """Creates a retrieval chain for a specific chat."""
    retriever = get_retriever(chat_id)
    return (
        {
            "context": itemgetter("question") | retriever,
            "question": itemgetter("question"),
            "chat_history": itemgetter("chat_history"),
        }
        | prompt
        | model
        | StrOutputParser()
    )

async def get_llm_response(chat_history: list, question: str, chat_id: str) -> AsyncGenerator[str, None]:
    """
    Get a streaming response from the LLM.
    """
    langchain_messages = []
    for msg in chat_history:
        if msg["role"] == "user":
            langchain_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            langchain_messages.append(AIMessage(content=msg["content"]))

    try:
        retrieval_chain = get_retrieval_chain(chat_id)
        async for chunk in retrieval_chain.astream(
            {"question": question, "chat_history": langchain_messages}
        ):
            yield chunk
    except Exception as e:
        print(f"An error occurred with the LangChain stream: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get a streaming response from the AI model.",
        )