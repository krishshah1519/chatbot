import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const ChatHistory = ({ history, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [history]);


  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const Animation = () => (
    <div className="p-4 pt-2">
      <div className="pulsing-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-grow p-4 sm:p-8 gap-4 overflow-y-auto">
      {history.map((msg, index) => (
        <div
          key={msg.id || `msg-${index}`}
          className={`flex flex-col max-w-xl lg:max-w-3xl shadow-sm ${
            msg.sender === 'user'
              ? 'bg-blue-500 text-white self-end rounded-xl rounded-br-none'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 self-start rounded-xl rounded-bl-none'
          }`}
        >
          <div className="prose dark:prose-invert prose-sm p-4 max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
              }}
            >
              {msg.message}
            </ReactMarkdown>
          </div>

          {msg.created_at && (
            <span className={`text-xs px-4 pb-2 ${
              msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-gray-400 text-left'
            }`}>
              {formatTimestamp(msg.created_at)}
            </span>
          )}


          {msg.sender === 'assistant' && isLoading && index === history.length - 1 && !msg.message && (
            <Animation />
          )}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;