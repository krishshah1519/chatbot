import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { register } from '../api/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    setError('');
    try {
      await login(username, password);
      navigate('/chats');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred.');
    }
  };

  const handleRegister = async (username, email, password) => {
    setError('');
    try {
      await register({ username, email, password });
      setIsLogin(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred.');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-pink-500 to-purple-700 dark:bg-gray-900 p-4">
      <motion.div
        key={isLogin ? "login" : "register"}
        className="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-xl dark:shadow-2xl text-center w-full max-w-sm"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            {isLogin ? "Welcome Back!" : "Join Chatbot"}
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {isLogin ? "Please log in to continue" : "Create an account to get started"}
          </p>
        </div>
        {isLogin ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegisterForm onRegister={handleRegister} />
        )}
        {error && <p className="text-red-500 dark:text-red-400 text-center mt-4">{error}</p>}
        <button
          className="bg-transparent text-blue-600 dark:text-blue-400 mt-6 text-sm cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </motion.div>
    </div>
  );
};

export default AuthPage;