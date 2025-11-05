
import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';

interface HeaderProps {
  isLoaded: boolean;
  onHistoryClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoaded, onHistoryClick }) => {
  return (
    <header className="container mx-auto px-4 pt-12 sm:pt-16">
      <div className="flex justify-start items-center">
        <button 
          onClick={onHistoryClick} 
          className="p-2 rounded-full bg-white/10 text-gray-300 hover:text-cyan-300 transition-colors duration-300"
          title="View History"
        >
          <HistoryIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="text-center mt-4 sm:mt-0">
        <h1 
          className={`text-5xl sm:text-7xl font-extrabold transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4af3ff] to-[#b667ff]">
            GENORA
          </span>
        </h1>
        <div 
          className={`h-1 bg-gradient-to-r from-[#4af3ff] to-[#b667ff] rounded-full mt-2 mx-auto max-w-xs transition-all duration-700 ease-out ${isLoaded ? 'w-full opacity-100' : 'w-0 opacity-0'}`}
          style={{ transitionDelay: '400ms', boxShadow: '0 0 15px #4af3ff, 0 0 15px #b667ff' }}
        ></div>
        <p 
          className={`mt-4 text-lg text-white/60 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '600ms' }}
        >
          Generate Smarter. Create Faster.
        </p>
      </div>
    </header>
  );
};
