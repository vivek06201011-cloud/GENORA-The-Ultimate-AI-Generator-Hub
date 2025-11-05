
import React from 'react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const { Icon, title, description } = tool;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer p-6 h-64 flex flex-col justify-between rounded-2xl 
                 bg-white/[.04] border border-white/10 
                 backdrop-blur-[10px] overflow-hidden 
                 transition-all duration-300 ease-out 
                 hover:scale-105 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(74,243,255,0.3)]"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -bottom-1/2 -right-1/2 w-48 h-48 bg-cyan-400 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      <div className="absolute -top-1/2 -left-1/2 w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <Icon className="w-12 h-12 mb-4 text-cyan-300 transition-colors duration-300 group-hover:text-cyan-200" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white transition-transform duration-300 group-hover:-translate-y-1">{title}</h3>
        <p className="text-white/60 mt-2 text-sm">{description}</p>
      </div>
    </div>
  );
};
