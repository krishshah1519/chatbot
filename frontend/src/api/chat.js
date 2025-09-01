import api from './index'; // Import the configured axios instance

export const getChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};

// NOTE: This uses fetch, so we need to add the token manually
// For a fully robust solution, this should also be converted to use the `api` instance
export const sendMessage = (chatId, message) => {
  const token = localStorage.getItem('token');
  return fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/chats/${chatId}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message }),
  });
};

export const createChat = async () => {
  const response = await api.post('/chats', {});
  return response.data;
};

export const getChatHistory = async (chatId) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
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