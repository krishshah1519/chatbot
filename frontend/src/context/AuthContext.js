import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as loginApi } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get token from localStorage instead of cookies
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        // Also set it in localStorage
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Failed to decode token:', error);
        logout();
      }
    } else {
        // If no token, clear localStorage
        localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (username, password) => {
    const data = await loginApi(username, password);
    setToken(data.access_token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Clear the token from localStorage
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);