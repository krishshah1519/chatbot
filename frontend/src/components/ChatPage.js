import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getChats, getChatHistory, sendMessage, createChat, renameChat, deleteChat } from '../api/chat';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';
import ChatSidebar from './ChatSidebar';

const ChatPage = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch all chats for the user
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsData = await getChats(token);
        setChats(chatsData);
        if (chatsData.length > 0 && !selectedChatId) {
          setSelectedChatId(chatsData[0].id);
        }
      } catch (err) {
        setError('Failed to fetch chats.');
      }
    };
    if (token) {
        fetchChats();
    }
  }, [token]);

  // Fetch history for the selected chat
  useEffect(() => {
    if (selectedChatId) {
      const fetchHistory = async () => {
        setIsLoading(true);
        setChatHistory([]);
        try {
          const chatData = await getChatHistory(token, selectedChatId);
          setChatHistory(chatData.messages);
        } catch (err) {
          setError('Failed to fetch chat history.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [selectedChatId, token]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    // Create temporary IDs for keys
    const tempUserMessageId = `user-${Date.now()}`;
    const tempBotMessageId = `bot-${Date.now()}`;

    // Add user message and bot placeholder in one atomic update
    setChatHistory(prev => [
      ...prev,
      { id: tempUserMessageId, sender: 'user', message: message },
      { id: tempBotMessageId, sender: 'assistant', message: '' }
    ]);
    setIsLoading(true);

    try {
      const response = await sendMessage(token, selectedChatId, message);

      if (!response.ok || !response.body) {
        throw new Error('Failed to get a response from the server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const readStream = async () => {
        const { done, value } = await reader.read();

        if (done) {
          setIsLoading(false);
          return;
        }

        const chunk = decoder.decode(value, { stream: true });

        setChatHistory(prevHistory => {
          const newHistory = [...prevHistory];
          const lastMessageIndex = newHistory.length - 1;

          if (lastMessageIndex >= 0 && newHistory[lastMessageIndex].sender === 'assistant') {
            newHistory[lastMessageIndex] = {
              ...newHistory[lastMessageIndex],
              message: newHistory[lastMessageIndex].message + chunk,
            };
          }
          return newHistory;
        });

        // Continue reading
        await readStream();
      };

      await readStream();

    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message.');
      setChatHistory(prev => {
        const newHistory = [...prev];
        const lastMessage = newHistory[newHistory.length - 1];
        if (lastMessage && lastMessage.sender === 'assistant') {
          lastMessage.message = 'Sorry, something went wrong.';
        }
        return newHistory;
      });
      setIsLoading(false);
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat(token);
      setChats(prevChats => [newChat, ...prevChats]);
      setSelectedChatId(newChat.id);
      setChatHistory([]);
    } catch (err) {
      setError('Failed to create new chat.');
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(token, chatId);
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);

      if (selectedChatId === chatId) {
        if (updatedChats.length > 0) {
          setSelectedChatId(updatedChats[0].id);
        } else {
          setSelectedChatId(null);
          setChatHistory([]);
        }
      }
    } catch (err) {
      setError('Failed to delete chat.');
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await renameChat(token, chatId, newTitle);
      setChats(chats.map(chat => (chat.id === chatId ? { ...chat, title: newTitle } : chat)));
    } catch (err) {
      setError('Failed to rename chat.');
    }
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onNewChat={handleCreateNewChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
          {selectedChatId ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                  {selectedChat?.title || 'Chat'}
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