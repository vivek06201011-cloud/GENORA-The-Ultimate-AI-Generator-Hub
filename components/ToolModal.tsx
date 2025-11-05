
import React, { useState, useEffect } from 'react';
import type { Tool, HashtagCategories, SeoOptimizationResult, SeoScoreResult, HistoryItem } from '../types';
import { ToolId } from '../types';
import * as geminiService from '../services/geminiService';
import { CopyIcon } from './icons/CopyIcon';

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
}

const useTypingEffect = <T,>(data: T, speed = 50) => {
    const [typedData, setTypedData] = useState<T>(data);
    
    useEffect(() => {
        if(typeof data !== 'string' || !data) {
            setTypedData(data);
            return;
        }

        setTypedData('' as T);
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < data.length) {
                setTypedData(prev => (prev as string + data.charAt(i)) as T);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);
        return () => clearInterval(typingInterval);
    }, [data, speed]);

    return typedData;
}


export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    const storageKey = `genora-inputs-${tool.id}`;
    const savedInputs = localStorage.getItem(storageKey);
    if (savedInputs) {
      try {
        const parsed = JSON.parse(savedInputs);
        setInput1(parsed.input1 || '');
        setInput2(parsed.input2 || '');
        setInput3(parsed.input3 || '');
      } catch (err) {
        console.error('Failed to parse saved inputs', err);
      }
    }
  }, [tool.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleCopy = (text: string) => {
    if(!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    const inputsToSave = { input1, input2, input3 };
    localStorage.setItem(`genora-inputs-${tool.id}`, JSON.stringify(inputsToSave));

    try {
      let apiResult: any = null;
      switch (tool.id) {
        case ToolId.Title: apiResult = await geminiService.generateYouTubeTitles(input1); break;
        case ToolId.Description: apiResult = await geminiService.generateYouTubeDescription(input1); break;
        case ToolId.Username: apiResult = await geminiService.generateUsernames(input1); break;
        case ToolId.Slogan: apiResult = await geminiService.generateSlogans(input1); break;
        case ToolId.Hashtag: apiResult = await geminiService.generateHashtags(input1); break;
        case ToolId.Optimizer: apiResult = await geminiService.optimizeYouTubeSEO(input1); break;
        case ToolId.Score: apiResult = await geminiService.checkSEOScore({ title: input1, description: input2, tags: input3 }); break;
      }
      setResult(apiResult);
      if (apiResult) {
        const historyKey = `genora-history-${tool.id}`;
        const history: HistoryItem[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          inputs: inputsToSave,
          result: apiResult
        };
        history.unshift(newHistoryItem);
        // Keep history to a reasonable size, e.g., 50 items per tool
        if (history.length > 50) history.pop();
        localStorage.setItem(historyKey, JSON.stringify(history));
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput1('');
    setInput2('');
    setInput3('');
    setResult(null);
    setError('');
    localStorage.removeItem(`genora-inputs-${tool.id}`);
  }

  const renderInputField = (placeholder: string, value: string, onChange: (val: string) => void) => (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/[.05] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 glow-on-type"
    />
  );
  
  const renderTextareaField = (placeholder: string, value: string, onChange: (val: string) => void) => (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full bg-white/[.05] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 glow-on-type"
    />
  );


  const renderForm = () => {
    switch (tool.id) {
      case ToolId.Score:
        return (
          <div className="space-y-4">
            {renderInputField("Enter video title...", input1, setInput1)}
            {renderTextareaField("Paste description...", input2, setInput2)}
            {renderInputField("Enter tags (comma separated)...", input3, setInput3)}
          </div>
        );
      case ToolId.Username:
         return renderInputField("Enter a theme (e.g., gaming, luxury)...", input1, setInput1);
      case ToolId.Slogan:
        return renderInputField("Enter your brand or niche...", input1, setInput1);
      default:
        return renderInputField("Enter a topic or keyword...", input1, setInput1);
    }
  };
  
  const typedDescription = useTypingEffect<string>(result as string, 20);

  const renderResult = () => {
    if (!result) return null;

    const copyFeedback = (item: any) => copiedText === item ? <span className="text-xs text-cyan-300">Copied ✨</span> : <CopyIcon className="w-4 h-4 text-gray-400" />;
    
    switch (tool.id) {
        case ToolId.Title:
            return (
                <ul className="space-y-3">
                    {(result as string[]).map((title, i) => (
                        <li key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:scale-105 animate-fade-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                            <span>{title}</span>
                            <button onClick={() => handleCopy(title)} title="Copy title" className="ml-4 p-1.5 rounded-md hover:bg-white/20 transition-colors shrink-0">
                                {copyFeedback(title)}
                            </button>
                        </li>
                    ))}
                </ul>
            );
        case ToolId.Description:
            return (
              <div>
                <p className="whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10">{typedDescription}</p>
                <div className="text-right mt-2">
                    <button onClick={() => handleCopy(result as string)} className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors">
                       {copiedText === result ? <span className="text-cyan-300">Copied ✨</span> : <><CopyIcon className="w-4 h-4" /> Copy Description</>}
                    </button>
                </div>
              </div>
            );
        case ToolId.Username:
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {(result as string[]).map((name, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg font-semibold border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:scale-110 animate-spin-in" style={{ animationDelay: `${i * 100}ms` }}>
                           <span>{name}</span>
                           <button onClick={() => handleCopy(name)} title="Copy username" className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors shrink-0">
                             {copiedText === name ? <span className="text-xs text-cyan-300 animate-pulse">✓</span> : <CopyIcon className="w-3 h-3 text-gray-500" />}
                           </button>
                        </div>
                    ))}
                </div>
            );
        case ToolId.Slogan:
            return (
                <ul className="space-y-3 text-center">
                    {(result as string[]).map((slogan, i) => (
                        <li key={i} className="flex items-center justify-center text-xl font-semibold p-2 animate-fade-zoom-in" style={{ animationDelay: `${i * 150}ms` }}>
                           <span>"{slogan}"</span>
                           <button onClick={() => handleCopy(slogan)} title="Copy slogan" className="ml-4 p-1.5 rounded-md hover:bg-white/20 transition-colors">
                                {copyFeedback(slogan)}
                            </button>
                        </li>
                    ))}
                </ul>
            );
        case ToolId.Hashtag:
            const hashtags = result as HashtagCategories;
            const allHashtags = [...hashtags.high, ...hashtags.medium, ...hashtags.low].join(' ');
            const renderHashtagChips = (tags: string[], category: string, color: string) => (
                <div>
                    <h4 className={`font-bold mb-2 capitalize ${color}`}>{category} Competition</h4>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm animate-bubble-up" style={{ animationDelay: `${i * 50}ms` }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            );
            return (
                <div className="space-y-6">
                    <div className="text-right -mb-2">
                        <button onClick={() => handleCopy(allHashtags)} className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors">
                           {copiedText === allHashtags ? <span className="text-cyan-300">Copied ✨</span> : <><CopyIcon className="w-4 h-4" /> Copy All</>}
                        </button>
                    </div>
                    {renderHashtagChips(hashtags.high, 'high', 'text-red-400')}
                    {renderHashtagChips(hashtags.medium, 'medium', 'text-yellow-400')}
                    {renderHashtagChips(hashtags.low, 'low', 'text-green-400')}
                </div>
            );
        case ToolId.Optimizer:
            const seo = result as SeoOptimizationResult;
            const tagsText = seo.tags.join(', ');
            return (
                <div className="space-y-4 animate-flip-in">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-cyan-300">Optimized Title</h4>
                             <button onClick={() => handleCopy(seo.title)} title="Copy title" className="p-1.5 rounded-md hover:bg-white/20 transition-colors">{copyFeedback(seo.title)}</button>
                        </div>
                        <p className="bg-white/5 p-3 rounded-lg border border-white/10">{seo.title}</p>
                    </div>
                    <div>
                         <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-cyan-300">Optimized Description</h4>
                             <button onClick={() => handleCopy(seo.description)} title="Copy description" className="p-1.5 rounded-md hover:bg-white/20 transition-colors">{copyFeedback(seo.description)}</button>
                        </div>
                        <p className="bg-white/5 p-3 rounded-lg border border-white/10 whitespace-pre-wrap">{seo.description}</p>
                    </div>
                    <div>
                         <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-cyan-300">Suggested Tags</h4>
                            <button onClick={() => handleCopy(tagsText)} title="Copy tags" className="p-1.5 rounded-md hover:bg-white/20 transition-colors">{copyFeedback(tagsText)}</button>
                        </div>
                        <div className="flex flex-wrap gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                            {seo.tags.map((tag, i) => <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm">{tag}</span>)}
                        </div>
                    </div>
                </div>
            );
        case ToolId.Score:
            const scoreResult = result as SeoScoreResult;
            const tipsText = scoreResult.tips.join('\n');
            const circumference = 2 * Math.PI * 50;
            const offset = circumference - (scoreResult.score / 100) * circumference;
            return (
                 <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative w-40 h-40">
                       <svg className="w-full h-full" viewBox="0 0 120 120">
                           <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                           <circle
                               cx="60"
                               cy="60"
                               r="50"
                               fill="none"
                               stroke="url(#scoreGradient)"
                               strokeWidth="10"
                               strokeDasharray={circumference}
                               strokeDashoffset={offset}
                               strokeLinecap="round"
                               className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
                           />
                           <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#b667ff" />
                                    <stop offset="100%" stopColor="#4af3ff" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold">{scoreResult.score}</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-cyan-300 mb-2">Improvement Tips</h4>
                          <button onClick={() => handleCopy(tipsText)} title="Copy tips" className="mb-2 p-1.5 rounded-md hover:bg-white/20 transition-colors">{copyFeedback(tipsText)}</button>
                        </div>
                        <ul className="space-y-2 list-disc list-inside">
                            {scoreResult.tips.map((tip, i) => <li key={i} className="animate-fade-slide-up" style={{ animationDelay: `${i * 150}ms` }}>{tip}</li>)}
                        </ul>
                    </div>
                </div>
            );
        default:
            return <pre className="bg-white/5 p-4 rounded whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>;
    }
  };


  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}></div>
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] 
                   bg-[#0b0b0f]/80 border border-white/10 
                   backdrop-blur-[10px] rounded-2xl shadow-[0_0_30px_rgba(74,243,255,0.2)]
                   p-8 text-white 
                   flex flex-col transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-3xl leading-none">&times;</button>
        <h2 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#4af3ff] to-[#b667ff]">{tool.title}</h2>
        <p className="text-white/60 mb-6">{tool.description}</p>
        
        <form onSubmit={handleSubmit} className="mb-6">
          {renderForm()}
          <div className="mt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-grow bg-gradient-to-r from-[#4af3ff] to-[#b667ff] text-black font-bold py-3 px-4 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : (result ? 'Generate Again' : 'Generate')}
            </button>
            {(input1 || input2 || input3) && (
              <button
                type="button"
                onClick={handleClear}
                title="Clear input"
                className="flex-shrink-0 bg-white/10 text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <div className="flex-grow overflow-y-auto pr-2">
            {error && <p className="text-red-400 text-center">{error}</p>}
            {isLoading && (
                 <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {result && (
              <div>
                  <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2">Results</h3>
                  {renderResult()}
              </div>
            )}
        </div>
      </div>
      <style>
          {`
            @keyframes fade-slide-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-slide-in { animation: fade-slide-in 0.5s ease-out forwards; opacity: 0; }
            @keyframes spin-in { from { opacity: 0; transform: rotate(-90deg) scale(0.5); } to { opacity: 1; transform: rotate(0) scale(1); } }
            .animate-spin-in { animation: spin-in 0.5s ease-out forwards; opacity: 0; }
            @keyframes fade-zoom-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-zoom-in { animation: fade-zoom-in 0.6s ease-out forwards; opacity: 0; }
            @keyframes bubble-up { from { opacity: 0; transform: translateY(20px) scale(0.8); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .animate-bubble-up { animation: bubble-up 0.5s ease-out forwards; opacity: 0; }
            @keyframes flip-in { from { opacity: 0; transform: perspective(1000px) rotateX(-90deg); } to { opacity: 1; transform: perspective(1000px) rotateX(0); } }
            .animate-flip-in { animation: flip-in 0.7s ease-out forwards; }
            @keyframes fade-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-slide-up { animation: fade-slide-up 0.5s ease-out forwards; opacity: 0; }
            .glow-on-type:focus { box-shadow: 0 0 15px rgba(74, 243, 255, 0.4); }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background-color: rgba(74, 243, 255, 0.3); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background-color: rgba(74, 243, 255, 0.5); }
          `}
      </style>
    </div>
  );
};
