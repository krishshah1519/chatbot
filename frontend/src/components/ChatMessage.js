import React, { useState, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { FaPlay } from 'react-icons/fa';

const ChatMessage = memo(({ message, isStreaming, playAudio }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const animationIntervalRef = useRef(null);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedMessage(message.message);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      return;
    }

    if (displayedMessage === message.message) {
      return;
    }

    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    let currentIndex = displayedMessage.length;
    animationIntervalRef.current = setInterval(() => {
      if (currentIndex < message.message.length) {
        setDisplayedMessage(message.message.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    }, 15);

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isStreaming, message.message, displayedMessage]);

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
          ? 'bg-blue-500 text-white self-end rounded-xl rounded-br-none'
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 self-start rounded-xl rounded-bl-none'
      }`}
    >
        <div className="flex items-start justify-between">
            <div className="prose dark:prose-invert prose-sm p-4 max-w-none">
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
            {message.sender === 'assistant' && !isStreaming && (
                <button onClick={() => playAudio(message.message)} className="p-2 m-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <FaPlay className="text-gray-500 dark:text-gray-400" />
                </button>
            )}
        </div>


      {message.created_at && (
        <span
          className={`text-xs px-4 pb-2 ${
            message.sender === 'user' ? 'text-blue-200 text-right' : 'text-gray-400 text-left'
          }`}
        >
          {formatTimestamp(message.created_at)}
        </span>
      )}
    </div>
  );
});

export default ChatMessage;