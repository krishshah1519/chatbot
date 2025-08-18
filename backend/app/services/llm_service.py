from typing import AsyncGenerator
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()
model= ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    streaming=True,
    convert_system_message_to_human=True
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ]
)
chain = prompt | model


async def get_llm_response(chat_history: list, question: str) -> AsyncGenerator[str, None]:
    langchain_messages = []
    for msg in chat_history:
        if msg["role"] == "user":
            langchain_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            langchain_messages.append(AIMessage(content=msg["content"]))

    try:
        async for chunk in chain.astream({"chat_history": langchain_messages, "question": question}):
            yield chunk.content
    except Exception as e:
        print(f"An error occurred with the LangChain stream: {e}")
        raise HTTPException(status_code=500, detail="Failed to get a streaming response from the AI model.")