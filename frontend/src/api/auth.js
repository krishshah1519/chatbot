import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);


  const response = await axios.post(`${API_URL}/login`, formData, { withCredentials: true });
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData);
  return response.data;
};