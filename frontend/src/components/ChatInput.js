import React, { useState, useEffect, useRef } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import { FaPaperclip, FaMicrophone } from 'react-icons/fa';

const ChatInput = ({ onSendMessage, isLoading, onFileUpload, selectedChatId }) => {
  const [question, setQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);


  const recognitionRef = useRef(null);


  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const mic = recognitionRef.current;

      mic.continuous = true;
      mic.interimResults = true;
      mic.lang = 'en-US';

      mic.onstart = () => {
        setIsListening(true);
      };

      mic.onend = () => {
        setIsListening(false);
      };

      mic.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setQuestion(transcript);
      };

      mic.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setQuestion('');
      recognitionRef.current.start();
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current.stop();
    }
    if (question.trim() && !isLoading) {
      onSendMessage(question);
      setQuestion('');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <form className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
      <label htmlFor="file-upload" className="cursor-pointer">
        <FaPaperclip className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl" />
      </label>
      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} disabled={!selectedChatId} />
       {recognitionRef.current && (
        <button type="button" onClick={toggleListening} className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
          <FaMicrophone />
        </button>
      )}
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