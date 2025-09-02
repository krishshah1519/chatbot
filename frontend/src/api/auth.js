import api from './index'; // Import the configured axios instance

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/login', formData);

  
  if (response.data && response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }

  return response.data;
};


export const register = async (userData) => {
  // Use the central 'api' instance
  const response = await api.post('/register/', userData);
  return response.data;
};