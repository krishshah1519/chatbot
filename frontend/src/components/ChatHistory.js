import React, { useEffect, useRef } from 'react';

const ChatHistory = ({ history, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  return (
    <div className="flex flex-col flex-grow p-8 gap-4 overflow-y-auto">
      {history.map((msg, index) => (
        <div
          key={msg.id || `msg-${index}`} // Use message ID for a stable key
          className={`p-4 rounded-xl max-w-[65%] shadow-sm leading-relaxed ${
            msg.sender === 'user'
              ? 'bg-blue-500 text-white self-end rounded-br-none'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 self-start rounded-bl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">
            {msg.message}
            {msg.sender === 'assistant' && isLoading && index === history.length - 1 && (
              <span className="blinking-cursor"></span>
            )}
          </p>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;