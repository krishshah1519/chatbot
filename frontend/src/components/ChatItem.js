import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const ChatItem = ({ chat, selected, onSelect, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);

  useEffect(() => {
    setTitle(chat.title);
  }, [chat.title]);

  const handleRename = () => {
    if (title.trim() && title !== chat.title) {
      onRename(chat.id, title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setTitle(chat.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(chat.id)}
      className={`flex justify-between items-center p-3 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer mb-2 transition-colors duration-200 group hover:bg-gray-100 dark:hover:bg-gray-700 ${
        selected ? 'bg-gray-100 dark:bg-gray-700 font-semibold' : ''
      }`}
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          autoFocus
          className="bg-transparent outline-none w-full"
        />
      ) : (
        <span className="truncate flex-grow">{title}</span>
      )}

      <div className="flex-shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="bg-transparent border-none text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1"
        >
          <AiOutlineEdit />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat.id);
          }}
          className="bg-transparent border-none text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1"
        >
          <AiOutlineDelete />
        </button>
      </div>
    </div>
  );
};

export default ChatItem;