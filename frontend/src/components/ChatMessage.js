import React, { useState, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const ChatMessage = memo(({ message, isStreaming }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const animationFrameRef = useRef(null);
  const textToStream = useRef(message.message);
  const currentIndex = useRef(0);

  useEffect(() => {
    if (isStreaming) {
      const animate = () => {
        if (currentIndex.current < textToStream.current.length) {
          setDisplayedMessage(
            textToStream.current.substring(0, currentIndex.current + 1)
          );
          currentIndex.current++;
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayedMessage(message.message);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming, message.message]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const LoadingIndicator = () => (
    <div className="pulsing-dots">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );

  return (
    <div
      className={`flex flex-col max-w-xl lg-max-w-3xl shadow-sm ${
        message.sender === 'user'
          ? 'bg-blue-500 text-white self-end rounded-xl rounded-br-none max-w-screen-md'
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 self-start rounded-xl rounded-bl-none max-w-screen-md'
      }`}
    >
      <div className="flex items-start justify-between ">
        <div className="prose dark:prose-invert prose-sm p-4 max-w-screen-md">
          {message.sender === 'assistant' && isStreaming && !displayedMessage ? (
            <LoadingIndicator />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
              }}
            >
              {displayedMessage || '\u00A0'}
            </ReactMarkdown>
          )}
        </div>
      </div>

      {message.created_at && (
        <span
          className={`text-xs px-4 pb-2 ${
            message.sender === 'user'
              ? 'text-blue-200 text-right'
              : 'text-gray-400 text-left'
          }`}
        >
          {formatTimestamp(message.created_at)}
        </span>
      )}
    </div>
  );
});

export default ChatMessage;