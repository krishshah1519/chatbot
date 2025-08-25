from typing import AsyncGenerator
from operator import itemgetter  # A cleaner way to get items from the input dict
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi import HTTPException
from dotenv import load_dotenv
from backend.app.services.rag_service import get_retriever

load_dotenv()
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    streaming=True
)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",

            "You are a helpful assistant. Answer the user's questions based on the retrieved context and the chat history. "
            "If the context does not contain the answer, use your general knowledge. If you don't know, just say you don't know.",
        ),
        # A new placeholder to show the model the retrieved documents
        ("system", "Retrieved Context:\n\n{context}"),
        MessagesPlaceholder(variable_name="chat_history"),
        # The final instruction is now the user's actual question
        ("user", "{question}"),
    ]
)

# ✅ Corrected retrieval chain
# This chain now correctly fetches context and passes all needed variables to the prompt.
retrieval_chain = (
    {
        # Retrieve context based on the question
        "context": itemgetter("question") | get_retriever(),
        # Pass the original question through
        "question": itemgetter("question"),
        # Pass the chat history through
        "chat_history": itemgetter("chat_history"),
    }
    | prompt
    | model
    | StrOutputParser()
)


async def get_llm_response(chat_history: list, question: str) -> AsyncGenerator[str, None]:
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
        # The input dictionary now matches what the chain expects
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