import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getChats = async (token) => {
  const response = await axios.get(`${API_URL}/chats`, getConfig(token));
  return response.data;
};

export const createChat = async (token) => {
  const response = await axios.post(`${API_URL}/chats`, {}, getConfig(token));
  return response.data;
};

export const getChatHistory = async (token, chatId) => {
  const response = await axios.get(`${API_URL}/chats/${chatId}`, getConfig(token));
  return response.data;
};

// Simplified to return the fetch promise directly
export const sendMessage = (token, chatId, message) => {
  return fetch(`${API_URL}/chats/${chatId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
};

export const renameChat = async (token, chatId, newTitle) => {
  const response = await axios.patch(
    `${API_URL}/chats/${chatId}`,
    { title: newTitle },
    getConfig(token)
  );
  return response.data;
};

export const deleteChat = async (token, chatId) => {
  const response = await axios.delete(
    `${API_URL}/chats/${chatId}`,
    getConfig(token)
  );
  return response.data;
};