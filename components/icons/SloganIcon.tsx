
import React from 'react';

export const SloganIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9.5a2.5 2.5 0 0 0-5 0"></path>
    <path d="M12 2a10 10 0 0 0-10 10c0 4.42 3.58 8 8 8a9.86 9.86 0 0 0 8.28-4.32"></path>
    <line x1="12" y1="12" x2="12.01" y2="12"></line>
    <path d="M22 12c0 4.42-3.58 8-8 8"></path>
  </svg>
);
