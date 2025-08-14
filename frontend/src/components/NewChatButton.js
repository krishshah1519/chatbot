import React from 'react';
import { createChat } from '../api/chat';
import { useAuth } from '../context/AuthContext';
import { AiOutlinePlus } from 'react-icons/ai';

const NewChatButton = ({ onNewChatCreated, isSidebarOpen }) => {
  const { token } = useAuth();
  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat(token);
      if (onNewChatCreated) {
        onNewChatCreated(newChat);
      }
    } catch (err) {
      console.error('Failed to create new chat:', err);
    }
  };

  return (
    <button
      onClick={handleCreateNewChat}
      className={`bg-blue-500 text-white rounded-full py-2 px-4 flex items-center gap-2 text-base transition-opacity ${
        isSidebarOpen ? '' : 'opacity-0 pointer-events-none'
      }`}
    >
      <AiOutlinePlus />
      New Chat
    </button>
  );
};

export default NewChatButton;