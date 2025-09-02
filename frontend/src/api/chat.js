import api from './index';

export const getChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};


export const sendMessage = (chatId, message) => {
  return api.post(`/chats/${chatId}/message`, { message }, {
    responseType: 'stream'
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