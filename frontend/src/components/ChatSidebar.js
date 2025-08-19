import React from 'react';
import ChatItem from './ChatItem';
import { AiOutlinePlus, AiOutlineMenu } from 'react-icons/ai';

const ChatSidebar = ({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <aside
      className={`bg-white dark:bg-gray-800 shadow-md flex-shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } flex flex-col`}
    >
      {isSidebarOpen ? (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onNewChat}
            className="bg-blue-500 text-white rounded-full py-2 px-4 flex items-center gap-2 text-base transition-opacity"
          >
            <AiOutlinePlus /> New Chat
          </button>
          <button
            className="bg-transparent border-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <AiOutlineMenu />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center p-4 gap-4">
          <button
            className="bg-transparent border-none text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          >
            <AiOutlineMenu />
          </button>
          <button
            onClick={onNewChat}
            className="bg-blue-500 text-white rounded-full p-2 flex items-center justify-center text-lg transition-opacity"
          >
            <AiOutlinePlus />
          </button>
        </div>
      )}

      <div className="p-2 flex-grow overflow-y-auto">
        {isSidebarOpen && chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            selected={selectedChatId === chat.id}
            onSelect={onSelectChat}
            onRename={onRenameChat}
            onDelete={onDeleteChat}
          />
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;