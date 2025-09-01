import api from './index'; // Import the configured axios instance

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  // Use the central 'api' instance
  const response = await api.post('/login', formData);
  return response.data;
};

export const register = async (userData) => {
  // Use the central 'api' instance
  const response = await api.post('/register/', userData);
  return response.data;
};