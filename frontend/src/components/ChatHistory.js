import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const ChatHistory = ({ history, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [history, isLoading]);

  return (
    <div className="flex flex-col flex-grow p-4 sm:p-8 gap-4 overflow-y-auto">
      {history.map((msg, index) => (
        <ChatMessage
          key={msg.id || `msg-${index}`}
          message={msg}
          isStreaming={isLoading && msg.sender === 'assistant' && index === history.length - 1}
        />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default React.memo(ChatHistory);