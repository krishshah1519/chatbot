from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os

# Ensure you have a GOOGLE_API_KEY in your .env file
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
vector_store = Chroma(embedding_function=embeddings, persist_directory="./chroma_db")

def process_and_store_document(file_path: str):
    """Loads a PDF, splits it into chunks, and stores it in the vector store."""
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)
    vector_store.add_documents(docs)

def get_retriever():
    """Returns a retriever for the vector store."""
    return vector_store.as_retriever()