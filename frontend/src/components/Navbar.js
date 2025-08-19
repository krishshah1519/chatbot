import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaUserCircle } from 'react-icons/fa';
import { MdWbSunny, MdDarkMode } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md dark:bg-gray-800">
      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
        <h1>Chatbot</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="bg-transparent border-none text-gray-600 dark:text-gray-300 text-2xl cursor-pointer">
          {theme === 'light' ? <MdDarkMode /> : <MdWbSunny />}
        </button>
        <div className="relative">
          <div onClick={() => setDropdownOpen(!dropdownOpen)} className="text-4xl text-gray-500 dark:text-gray-400 cursor-pointer">
            <FaUserCircle />
          </div>
          {dropdownOpen && (
            <div className="absolute top-full right-0 bg-white rounded-lg shadow-lg p-4 min-w-[200px] z-10 mt-2 dark:bg-gray-700">
              {user && (
                 <p className="text-gray-700 text-sm mb-2 dark:text-gray-200">
                  Logged in as: <strong>{user.sub}</strong>
                </p>
              )}
              <button onClick={logout} className="w-full p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;