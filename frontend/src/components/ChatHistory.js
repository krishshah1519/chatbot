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

  // Create a component for the "Thinking..." animation to keep the JSX clean
  const ThinkingAnimation = () => (
    <div className="p-4 pt-0">
      <div className="wavy-thinking-text">
        {'Thinking...'.split('').map((letter, index) => (
          <span key={index} style={{'--i': index + 1}}>{letter}</span>
        ))}
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

          {/* Conditionally render the new animation */}
          {msg.sender === 'assistant' && isLoading && index === history.length - 1 && !msg.message && (
            <ThinkingAnimation />
          )}
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatHistory;