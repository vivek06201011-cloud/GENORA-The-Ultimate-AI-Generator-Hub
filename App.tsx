
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ToolCard } from './components/ToolCard';
import { ToolModal } from './components/ToolModal';
import { TrendingSection } from './components/TrendingSection';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { AnimatedBackground } from './components/AnimatedBackground';
import { HistoryPanel } from './components/HistoryPanel';
import { TOOLS } from './constants';
import type { Tool } from './types';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0); // Used to force history refresh

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (tool: Tool) => {
    setSelectedTool(tool);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedTool(null);
    document.body.style.overflow = 'auto';
  };

  const openHistory = () => {
    setHistoryVersion(prev => prev + 1); // Increment to trigger refresh in panel
    setIsHistoryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeHistory = () => {
    setIsHistoryOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-[#0b0b0f] text-[#e0e0e0] min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <div className={`relative z-10 transition-all duration-700 ease-out ${(selectedTool || isHistoryOpen) ? 'blur-sm scale-95' : 'blur-0 scale-100'}`}>
        <Header isLoaded={isLoaded} onHistoryClick={openHistory} />
        <main className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {TOOLS.map((tool, index) => (
              <div
                key={tool.id}
                className={`transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ToolCard tool={tool} onClick={() => openModal(tool)} />
              </div>
            ))}
          </div>
          <TrendingSection isLoaded={isLoaded} />
          <TrustSection isLoaded={isLoaded} />
        </main>
        <Footer />
      </div>
      {selectedTool && <ToolModal tool={selectedTool} onClose={closeModal} />}
      <HistoryPanel isOpen={isHistoryOpen} onClose={closeHistory} key={historyVersion} />
    </div>
  );
};

export default App;