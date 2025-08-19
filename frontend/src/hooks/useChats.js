import { useState, useEffect, useCallback } from 'react';
import { getChats, createChat, renameChat, deleteChat } from '../api/chat';
import { useAuth } from '../context/AuthContext';

export const useChats = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');

  const fetchChats = useCallback(async () => {
    if (!token) return;
    try {
      const chatsData = await getChats();
      setChats(chatsData);
    } catch (err) {
      setError('Failed to fetch chats.');
    }
  }, [token]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat();
      setChats(prevChats => [newChat, ...prevChats]);
      return newChat;
    } catch (err) {
      setError('Failed to create new chat.');
      return null;
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);
      return updatedChats;
    } catch (err) {
      setError('Failed to delete chat.');
      return null;
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      const updatedChat = await renameChat(chatId, newTitle);
      setChats(chats.map(chat => (chat.id === chatId ? updatedChat : chat)));
    } catch (err) {
      setError('Failed to rename chat.');
    }
  };

  // Expose the fetchChats function so it can be called manually
  return { chats, error, handleCreateNewChat, handleDeleteChat, handleRenameChat, refetchChats: fetchChats };
};