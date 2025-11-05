
import type React from 'react';

export enum ToolId {
  Title = 'youtube-title',
  Description = 'youtube-description',
  Username = 'username',
  Slogan = 'slogan',
  Hashtag = 'hashtag',
  Optimizer = 'seo-optimizer',
  Score = 'seo-score',
}

export interface Tool {
  id: ToolId;
  title: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
}

export interface HashtagCategories {
  high: string[];
  medium: string[];
  low: string[];
}

export interface SeoOptimizationResult {
  title: string;
  description: string;
  tags: string[];
}

export interface SeoScoreResult {
  score: number;
  tips: string[];
}

export interface TrendingTopics {
  youtube: string[];
  instagram: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  inputs: {
    input1: string;
    input2?: string;
    input3?: string;
  };
  result: any;
}

export interface Review {
  avatar: string;
  username: string;
  rating: number;
  text: string;
}
