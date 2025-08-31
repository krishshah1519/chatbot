# 🤖 Gemini AI Chat - Full-Stack Application

<div align="center">

A responsive, full-stack chatbot application built with a **Python (FastAPI)** backend and a **React** frontend, powered by Google's **Gemini Pro** through the **LangChain** framework.

</div>

<p align="center">
  <a href="https://chatbot-frontend-fso2.onrender.com"><strong>🚀 View Live Demo</strong></a>
</p>

---

## 📖 Table of Contents

* [About The Project](#-about-the-project)
* [✨ Key Features](#-key-features)
* [🛠️ Tech Stack](#️-tech-stack)
* [📸 Screenshots](#-screenshots)
* [🚀 Getting Started](#-getting-started)
    * [Prerequisites](#prerequisites)
    * [Local Development Setup](#local-development-setup)
    * [Running with Docker](#running-with-docker)
* [🧠 Challenges & Learnings](#-challenges--learnings)
* [📜 License](#-license)

---

## 📝 About The Project

This project is a complete, full-stack AI chat application designed to provide a seamless and interactive user experience. It features real-time, streaming conversations with Google's Gemini Pro model, secure user authentication, and persistent chat history. The application supports advanced features like Retrieval-Augmented Generation (RAG) via document uploads, text-to-speech, speech-to-text, and a code-friendly interface with syntax highlighting.

---

## ✨ Key Features

* **💬 Real-time AI Conversations:** Engage in dynamic, streaming conversations with an AI assistant.
* **🔐 Secure User Authentication:** JWT-based user registration and login to protect user data and chat history.
* **📚 Persistent Chat History:** All conversations are saved, allowing users to resume anytime.
* **⚙️ Full Chat Management (CRUD):** Easily create, rename, and delete chat sessions.
* **🗣️ Voice Interaction:** Convert chatbot responses to audio (Text-to-Speech) and use your microphone for input (Speech-to-Text).
* **📄 Document Upload for RAG:** Upload PDF documents to provide context for the chatbot's responses (Retrieval-Augmented Generation).
* **🌓 Toggleable Dark Mode:** A sleek, user-friendly dark mode for comfortable viewing.
* **💻 Code-Friendly Interface:** Built-in syntax highlighting for code blocks with a one-click copy button.

---

## 🛠️ Tech Stack

This project leverages a modern, high-performance technology stack for both the frontend and backend.

### **Frontend**

* **React:** A JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **React Router:** For declarative routing in the React application.

### **Backend**

* **Python:** A versatile programming language for the application's logic.
* **FastAPI:** A modern, high-performance web framework for building APIs.
* **LangChain:** A framework for developing applications powered by language models.

### **Database**

* **SQLAlchemy:** The Python SQL toolkit and Object Relational Mapper.
* **Alembic:** A lightweight database migration tool for use with SQLAlchemy.

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><strong>Login Page (Dark Mode)</strong></td>
    <td align="center"><strong>Login Page (Light Mode)</strong></td>
  </tr>
  <tr>
    <td><img alt="Login Page Dark Mode" src="https://github.com/user-attachments/assets/65a88679-f834-407f-92e6-f369c5f3329c" width="100%"></td>
    <td><img alt="Login Page (Light Mode)" src="https://github.com/user-attachments/assets/e92b185e-e18b-4de2-b5c4-892b44779e4c" width="100%"></td>
  </tr>
  <tr>
    <td align="center"><strong>Chat Interface (Dark Mode)</strong></td>
    <td align="center"><strong>Chat Interface (Light Mode)</strong></td>
  </tr>
  <tr>
    <td><img alt="Chat Interface Dark Mode" src="https://github.com/user-attachments/assets/688ea541-9d98-43da-9da4-918c4c84f641" width="100%"></td>
    <td><img alt="Chat Interface (Light Mode)" src="https://github.com/user-attachments/assets/88290af3-c096-4254-81bb-3af86fe2c816" width="100%"></td>
  </tr>
</table>

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

* **Node.js & npm** (or yarn)
* **Python 3.7+ & pip**
* **Docker & Docker Compose** (for containerized setup)
* A running **SQL database** (e.g., PostgreSQL, MySQL, SQLite).

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/krishshah1519/chatbot.git](https://github.com/krishshah1519/chatbot.git)
    cd chatbot
    ```

2.  **Configure and run the Backend:**
    ```bash
    cd backend
    pip install -r requirements.txt # Install dependencies
    cp .env.example .env # Create .env file
    ```
    > **Note:** Edit the `.env` file with your database URL, a secret key, and your Google API key.
    ```bash
    alembic upgrade head # Apply database migrations
    uvicorn main:app --reload # Start the server
    ```

3.  **Configure and run the Frontend:**
    ```bash
    cd ../frontend
    npm install # Install dependencies
    cp .env.example .env # Create .env file
    ```
    > **Note:** Edit the `.env` file with your backend API URL (e.g., `VITE_API_BASE_URL=http://127.0.0.1:8000`).
    ```bash
    npm run dev # Start the development server
    ```

### Running with Docker

1.  **Create `.env` files** in both the `backend` and `frontend` directories from their respective `.env.example` files and fill in your variables.
2.  **Build and run the containers** from the project's root directory:
    ```bash
    docker-compose up --build
    ```
The application will be available at `http://localhost:3000`.

---

## 🧠 Challenges & Learnings

Building this application provided several valuable learning experiences:

* **Implementing Real-time Streaming:** One of the main challenges was handling streaming LLM responses. I implemented a solution using `StreamingResponse` in FastAPI and the `Fetch API` on the frontend. This was crucial for a responsive, "real-time" feel and significantly improved the user experience.
* **Retrieval-Augmented Generation (RAG):** I implemented a RAG pipeline to allow the chatbot to answer questions based on user-uploaded documents. This involved using LangChain to process and store documents in a vector store and then retrieving relevant information to provide context to the LLM.
* **Full-Stack State Management:** Managing state across the frontend and backend, especially for authentication and chat history, required careful planning. I used React's Context API to manage the user's authentication state globally on the frontend, which simplified component logic.
* **Database Migrations:** As the application evolved, so did the database schema. Using Alembic for migrations allowed me to version control the database schema, making it easy and reliable to upgrade the database structure as new features were added.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

