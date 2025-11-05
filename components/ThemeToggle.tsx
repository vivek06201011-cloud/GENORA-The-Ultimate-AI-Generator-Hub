
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse-glow {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 3px currentColor);
            }
            50% {
              transform: scale(1.1);
              filter: drop-shadow(0 0 7px currentColor);
            }
          }
          .animate-pulse-glow {
            animation: pulse-glow 0.5s ease-in-out;
          }
        `}
      </style>
      <button
        onClick={toggleTheme}
        className="relative inline-flex items-center h-8 w-14 p-1 rounded-full bg-gray-500/20 dark:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-100 dark:focus:ring-offset-[#0a0f24] hover:shadow-lg hover:shadow-cyan-500/30 dark:hover:shadow-cyan-400/30"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <span
          className={`absolute top-1 left-1 flex items-center justify-center h-6 w-6 rounded-full bg-white dark:bg-gray-700 shadow-md transform transition-transform duration-300 ease-in-out ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {theme === 'dark' 
            ? <MoonIcon key="moon" className="w-4 h-4 text-cyan-300 animate-pulse-glow" /> 
            : <SunIcon key="sun" className="w-4 h-4 text-yellow-500 animate-pulse-glow" />
          }
        </span>
      </button>
    </>
  );
};
