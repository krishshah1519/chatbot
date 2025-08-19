import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const ChatHistory = ({ history, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // A small delay to allow the new message to render before scrolling
    setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [history]);

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
          {/* Blinking cursor is now inside the message bubble for better alignment */}
          {msg.sender === 'assistant' && isLoading && index === history.length - 1 && (
            <div className="p-4 pt-0">
                <span className="blinking-cursor"></span>
            </div>
          )}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;