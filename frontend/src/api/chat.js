import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// This interceptor automatically adds the token to every request header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};

export const createChat = async () => {
  const response = await api.post('/chats', {});
  return response.data;
};

export const getChatHistory = async (chatId) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

// sendMessage still needs the token passed manually because it uses the Fetch API for streaming
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

export const uploadFile = async (chatId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/chats/${chatId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const renameChat = async (chatId, newTitle) => {
  const response = await api.patch(`/chats/${chatId}`, { title: newTitle });
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/chats/${chatId}`);
  return response.data;
};