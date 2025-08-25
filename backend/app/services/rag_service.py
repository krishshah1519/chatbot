from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")


def get_vector_store(chat_id: str) -> Chroma:
    """Gets the vector store for a specific chat."""
    persist_directory = f"./chroma_db/{chat_id}"
    return Chroma(embedding_function=embeddings, persist_directory=persist_directory)


def process_and_store_document(file_path: str, chat_id: str):
    """Loads a PDF, splits it into chunks, and stores it in the vector store for a specific chat."""
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    vector_store = get_vector_store(chat_id)
    vector_store.add_documents(docs)


def get_retriever(chat_id: str):
    """Returns a retriever for the vector store of a specific chat."""
    return get_vector_store(chat_id).as_retriever()