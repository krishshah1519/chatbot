from typing import AsyncGenerator
from langchain.prompts import PromptTemplate
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from fastapi import HTTPException
from dotenv import load_dotenv
from backend.app.services.rag_service import get_retriever

load_dotenv()
model= ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    model_kwargs={"streaming": True},
    convert_system_message_to_human=True
)

template = """You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
Answer:
"""
prompt = PromptTemplate.from_template(template)


async def get_llm_response(chat_history: list, question: str) -> AsyncGenerator[str, None]:
    retriever = get_retriever()

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
    )

    langchain_messages = []
    for msg in chat_history:
        if msg["role"] == "user":
            langchain_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            langchain_messages.append(AIMessage(content=msg["content"]))
    try:

        async for chunk in rag_chain.astream(question):
            yield chunk
    except Exception as e:
        print(f"An error occurred with the LangChain stream: {e}")
        raise HTTPException(status_code=500, detail="Failed to get a streaming response from the AI model.")