import React, { useEffect, useRef } from 'react';
import { ReactTyped } from 'react-typed';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ChatHistory = ({ history, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  return (
    <div className="flex flex-col flex-grow p-8 gap-4 overflow-y-auto">
      {history.map((msg, index) => (
        <div key={index}
          className={`p-4 rounded-xl max-w-[65%] shadow-sm leading-relaxed ${
            msg.sender === 'user'
              ? 'bg-blue-500 text-white self-end rounded-br-none'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 self-start rounded-bl-none'
          }`}
        >
          {msg.sender === 'bot' && index === history.length - 1 && isLoading ? (
            <ReactTyped strings={[msg.text]} typeSpeed={20} showCursor={false} />
          ) : (
            <p>{msg.text}</p>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start items-center p-4 gap-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-sm rounded-lg w-fit">
          <AiOutlineLoading3Quarters className="animate-spin text-2xl text-blue-500 dark:text-blue-400" />
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;