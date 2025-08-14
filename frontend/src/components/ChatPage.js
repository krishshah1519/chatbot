import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getChats, getChatHistory, sendMessage, createChat, renameChat, deleteChat } from '../api/chat';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';
import { AiOutlinePlus, AiOutlineClose, AiOutlineMenu, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const ChatPage = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatTitle, setEditingChatTitle] = useState('');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsData = await getChats(token);
        setChats(chatsData);
        if (chatsData.length > 0) {
          setSelectedChatId(chatsData[0].chat_id);
        }
      } catch (err) {
        setError('Failed to fetch chats.');
      }
    };
    fetchChats();
  }, [token]);

  useEffect(() => {
    if (selectedChatId) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const chatData = await getChatHistory(token, selectedChatId);
          setChatHistory(chatData.chat_history);
        } catch (err) {
          setError('Failed to fetch chat history.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [selectedChatId, token]);

  const handleSendMessage = async (question) => {
    if (!question.trim()) return;
    const newHistory = [...chatHistory, { sender: 'user', text: question }];
    setChatHistory(newHistory);
    setIsLoading(true);

    try {
      const response = await sendMessage(token, selectedChatId, question);
      const newBotMessage = { sender: 'bot', text: response.answer.join('\n') };

      setChatHistory([...newHistory, newBotMessage]);
    } catch (err) {
      setError('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat(token);
      setChats([newChat, ...chats]);
      setSelectedChatId(newChat.chat_id);
      setChatHistory([]);
    } catch (err) {
      setError('Failed to create new chat.');
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(token, chatId);
      const updatedChats = chats.filter(chat => chat.chat_id !== chatId);
      setChats(updatedChats);

      if (updatedChats.length > 0) {
        setSelectedChatId(updatedChats[0].chat_id);
      } else {
        setSelectedChatId(null);
        setChatHistory([]);
      }
    } catch (err) {
      setError('Failed to delete chat.');
    }
  };

  const handleRenameChat = async (chatId) => {
    if (editingChatTitle.trim() === '') return;
    try {
      await renameChat(token, chatId, editingChatTitle);
      setChats(chats.map(chat => chat.chat_id === chatId ? { ...chat, title: editingChatTitle } : chat));
      setEditingChatId(null);
    } catch (err) {
      setError('Failed to rename chat.');
    }
  };

  const getChatTitle = (chat) => {
    if (chat.title) {
      return chat.title;
    }
    // Fallback: use the first message in the chat history
    if (chat.chat_history && chat.chat_history.length > 0) {
      const firstMessage = chat.chat_history[0].text;
      return firstMessage.length > 30 ? firstMessage.substring(0, 27) + '...' : firstMessage;
    }
    return 'New Chat';
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <aside
          className={`bg-white dark:bg-gray-800 shadow-md flex-shrink-0 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-16'
          } flex flex-col`}
        >
          {isSidebarOpen ? (
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCreateNewChat}
                className="bg-blue-500 text-white rounded-full py-2 px-4 flex items-center gap-2 text-base transition-opacity"
              >
                <AiOutlinePlus /> New Chat
              </button>
              <button
                className="bg-transparent border-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl cursor-pointer"
                onClick={() => setIsSidebarOpen(false)}
              >
                <AiOutlineMenu />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4 gap-4">
              <button
                className="bg-transparent border-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl cursor-pointer"
                onClick={() => setIsSidebarOpen(true)}
              >
                <AiOutlineMenu />
              </button>
              <button
                onClick={handleCreateNewChat}
                className="bg-blue-500 text-white rounded-full p-2 flex items-center justify-center text-lg transition-opacity"
              >
                <AiOutlinePlus />
              </button>
            </div>
          )}

          <div className="p-2 flex-grow overflow-y-auto">
            {isSidebarOpen && chats.map((chat) => (
              <div
                key={chat.chat_id}
                onClick={() => setSelectedChatId(chat.chat_id)}
                className={`flex justify-between items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer mb-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedChatId === chat.chat_id
                    ? 'bg-gray-100 dark:bg-gray-700 font-semibold'
                    : ''
                }`}
              >
                {editingChatId === chat.chat_id ? (
                  <input
                    type="text"
                    value={editingChatTitle}
                    onChange={(e) => setEditingChatTitle(e.target.value)}
                    onBlur={() => handleRenameChat(chat.chat_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameChat(chat.chat_id);
                      }
                    }}
                    className="bg-transparent outline-none w-full"
                  />
                ) : (
                  <span>{getChatTitle(chat)}</span>
                )}

                {isSidebarOpen && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChatId(chat.chat_id);
                        setEditingChatTitle(getChatTitle(chat));
                      }}
                      className="bg-transparent border-none text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.chat_id);
                      }}
                      className="bg-transparent border-none text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
        <main className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
          {selectedChatId ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {getChatTitle(chats.find(chat => chat.chat_id === selectedChatId) || {})}
                </h2>
              </div>
              <ChatHistory history={chatHistory} isLoading={isLoading} />
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-400 text-xl">
              <p>Select a chat or start a new one.</p>
            </div>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;