
import React, { useState, useEffect } from 'react';
import { TOOLS } from '../constants';
import type { HistoryItem } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type GroupedHistory = {
  [key: string]: HistoryItem[];
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<GroupedHistory>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadHistory = () => {
    const allHistory: GroupedHistory = {};
    TOOLS.forEach(tool => {
      const historyKey = `genora-history-${tool.id}`;
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            allHistory[tool.id] = parsed;
          }
        } catch (e) {
          console.error(`Failed to parse history for ${tool.id}`, e);
        }
      }
    });
    setHistory(allHistory);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = (toolId: string, itemId: string) => {
    const historyKey = `genora-history-${toolId}`;
    const toolHistory = history[toolId]?.filter(item => item.id !== itemId) || [];
    localStorage.setItem(historyKey, JSON.stringify(toolHistory));
    loadHistory(); // Refresh state
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all generation history? This cannot be undone.')) {
        TOOLS.forEach(tool => {
            localStorage.removeItem(`genora-history-${tool.id}`);
        });
        loadHistory();
    }
  };

  const formatTimestamp = (ts: number) => {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getResultPreview = (item: HistoryItem): string => {
    if (typeof item.result === 'string') return item.result.substring(0, 100) + (item.result.length > 100 ? '...' : '');
    if (Array.isArray(item.result) && item.result.length > 0) return String(item.result[0]);
    if (item.result?.title) return item.result.title;
    if (item.result?.score) return `Score: ${item.result.score}`;
    return 'Complex result';
  };
  
  const getFullResultText = (item: HistoryItem): string => {
    if (typeof item.result === 'string') return item.result;
    if (Array.isArray(item.result)) return item.result.join('\n');
    if (typeof item.result === 'object' && item.result !== null) {
      return Object.entries(item.result)
        .map(([key, value]) => `${key.toUpperCase()}:\n${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n\n');
    }
    return '';
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 z-50 w-full max-w-md h-full 
                   bg-[#0b0b0f]/80 border-l border-white/10
                   backdrop-blur-xl shadow-2xl
                   transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4af3ff] to-[#b667ff]">Generation History</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none">&times;</button>
          </header>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {Object.keys(history).length === 0 || Object.values(history).every(h => !Array.isArray(h) || h.length === 0) ? (
              <p className="text-center text-gray-500 mt-8">No history yet. Start generating content!</p>
            ) : (
              TOOLS.map(tool => (
                history[tool.id] && Array.isArray(history[tool.id]) && history[tool.id].length > 0 && (
                  <div key={tool.id}>
                    <h3 className="font-bold mb-2 text-cyan-300">{tool.title}</h3>
                    <ul className="space-y-2">
                      {history[tool.id].map(item => (
                        <li key={item.id} className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm">
                          <p className="font-semibold truncate">{getResultPreview(item)}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleCopy(getFullResultText(item), item.id)} className="p-1 hover:text-cyan-400 transition-colors" title="Copy">
                                {copiedId === item.id ? <span className="text-xs text-cyan-300">Copied ✨</span> : <CopyIcon className="w-4 h-4" />}
                              </button>
                              <button onClick={() => handleDelete(tool.id, item.id)} className="p-1 hover:text-red-500 transition-colors" title="Delete">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))
            )}
          </div>

          <footer className="p-4 border-t border-white/10">
            <button
              onClick={handleClearAll}
              className="w-full bg-red-500/20 text-red-500 font-bold py-2 px-4 rounded-lg hover:bg-red-500/30 hover:text-red-400 transition-all duration-300"
            >
              Clear All History
            </button>
          </footer>
        </div>
      </div>
    </>
  );
};
