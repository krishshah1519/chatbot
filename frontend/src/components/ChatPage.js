import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMessage, uploadFile } from '../api/chat';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import Navbar from './Navbar';
import ChatSidebar from './ChatSidebar';
import { useChats } from '../hooks/useChats';
import { useChatHistory } from '../hooks/useChatHistory';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const ChatPage = () => {
  const { token } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const { chats, error: chatsError, handleCreateNewChat, handleDeleteChat, handleRenameChat, refetchChats } = useChats();
  const { chatHistory, setChatHistory, isLoading, setIsLoading, error: historyError } = useChatHistory(selectedChatId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { play: playAudio, stop: stopCurrentAudio } = useTextToSpeech(token);

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  const handleSendMessage = useCallback(async (message) => {
    if (!message.trim() || isLoading || !selectedChatId) return;

    stopCurrentAudio();

    const tempUserMessageId = `user-${Date.now()}`;
    const tempBotMessageId = `bot-${Date.now()}`;

    setChatHistory(prev => [
      ...prev,
      { id: tempUserMessageId, sender: 'user', message: message },
      { id: tempBotMessageId, sender: 'assistant', message: '' }
    ]);

    setIsLoading(true);

    try {
      const response = await sendMessage(selectedChatId, message);

      if (!response.ok || !response.body) {
        throw new Error('Failed to get a response from the server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      const readStream = async () => {
        const { done, value } = await reader.read();

        if (done) {
          setIsLoading(false);
          refetchChats();
          // *** ADD THIS LINE: Play the full response when the stream is complete ***
          playAudio(fullResponse);
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setChatHistory(prevHistory => {
          const newHistory = [...prevHistory];
          const lastMessageIndex = newHistory.length - 1;

          if (lastMessageIndex >= 0 && newHistory[lastMessageIndex].sender === 'assistant') {
            newHistory[lastMessageIndex] = {
              ...newHistory[lastMessageIndex],
              message: fullResponse,
            };
          }
          return newHistory;
        });

        await readStream();
      };

      await readStream();

    } catch (err) {
      console.error('Failed to send message:', err);
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
  }, [isLoading, selectedChatId, refetchChats, setChatHistory, setIsLoading, stopCurrentAudio, playAudio]);

  const handleFileUpload = useCallback(async (file) => {
    if (!selectedChatId) {
      alert("Please select a chat before uploading a file.");
      return;
    }
    try {
      await uploadFile(selectedChatId, file);
      alert("File uploaded and processed successfully!");
    } catch (err) {
      console.error('Failed to upload file:', err);
      alert("Failed to upload file.");
    }
  }, [selectedChatId]);

  const createNewChat = useCallback(async () => {
    const newChat = await handleCreateNewChat();
    if (newChat) {
      setSelectedChatId(newChat.id);
      setChatHistory([]);
    }
  }, [handleCreateNewChat, setChatHistory]);

  const deleteExistingChat = useCallback(async (chatId) => {
    const updatedChats = await handleDeleteChat(chatId);
    if (selectedChatId === chatId) {
      if (updatedChats && updatedChats.length > 0) {
        setSelectedChatId(updatedChats[0].id);
      } else {
        setSelectedChatId(null);
        setChatHistory([]);
      }
    }
  }, [handleDeleteChat, selectedChatId, setChatHistory]);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          onNewChat={createNewChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={deleteExistingChat}
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
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} onFileUpload={handleFileUpload} selectedChatId={selectedChatId}/>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-400 text-xl">
              <p>Select a chat or start a new one.</p>
            </div>
          )}
          {(chatsError || historyError) && <p className="text-red-500 text-center mt-4">{chatsError || historyError}</p>}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;