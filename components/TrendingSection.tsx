
import React, { useState, useEffect } from 'react';
import * as geminiService from '../services/geminiService';
import type { TrendingTopics } from '../types';
import { TrendingIcon } from './icons/TrendingIcon';

export const TrendingSection: React.FC<{ isLoaded: boolean }> = ({ isLoaded }) => {
  const [trends, setTrends] = useState<TrendingTopics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const result = await geminiService.getTrendingTopics();
        setTrends(result);
      } catch (error) {
        console.error("Failed to fetch trends:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const renderTrendCard = (title: string, topics: string[] | undefined, color: string) => (
    <div className="bg-white/[.04] p-6 rounded-2xl border border-white/10 flex-1 min-w-[280px]">
      <h3 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-white/10 rounded-md animate-pulse"></div>
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {topics?.map((topic, i) => (
            <li key={i} className="flex items-start gap-3 animate-fade-slide-in" style={{animationDelay: `${i*100}ms`}}>
              <TrendingIcon className={`w-5 h-5 mt-0.5 shrink-0 ${color}`} />
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className={`mt-24 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
      <h2 className="text-4xl font-bold text-center mb-12">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4af3ff] to-[#b667ff]">
          What's Trending Now
        </span>
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {renderTrendCard("YouTube", trends?.youtube, "text-red-400")}
        {renderTrendCard("Instagram", trends?.instagram, "text-purple-400")}
      </div>
    </div>
  );
};
