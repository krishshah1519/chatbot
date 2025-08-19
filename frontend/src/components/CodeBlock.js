import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy, FaCheck } from 'react-icons/fa';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }, (err) => {
      console.error('Failed to copy: ', err);
    });
  };

  // Render a syntax-highlighted block for fenced code blocks
  if (!inline && match) {
    return (
      <div className="relative text-sm">
        <div className="absolute top-0 right-0 p-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              aria-label="Copy code"
            >
              {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
            </button>
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }


  return (
    <code className="bg-gray-200 dark:bg-gray-700 rounded-md px-1 py-0.5 text-sm font-mono" {...props}>
      {children}
    </code>
  );
};

export default CodeBlock;