import React, { useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSendMessage(question);
      setQuestion('');
    }
  };

  return (
    <form className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
      <input
        className="flex-grow p-4 rounded-3xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Message Chatbot..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className="bg-transparent text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer text-2xl transition-colors duration-200"
        disabled={isLoading}>
        <IoSendSharp />
      </button>
    </form>
  );
};

export default ChatInput;