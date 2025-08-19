import { useState, useEffect, useCallback } from 'react';
import { getChatHistory } from '../api/chat';
import { useAuth } from '../context/AuthContext';

export const useChatHistory = (selectedChatId) => {
  const { token } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    if (!selectedChatId || !token) return;

    setIsLoading(true);
    setChatHistory([]);
    try {
      const chatData = await getChatHistory(selectedChatId);
      setChatHistory(chatData.messages);
    } catch (err) {
      setError('Failed to fetch chat history.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId, token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { chatHistory, setChatHistory, isLoading, setIsLoading, error };
};