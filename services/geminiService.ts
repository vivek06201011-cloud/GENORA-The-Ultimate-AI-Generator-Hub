
import { GoogleGenAI, Type } from "@google/genai";
import type { HashtagCategories, SeoOptimizationResult, SeoScoreResult, TrendingTopics } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getJson = <T,>(text: string): T | null => {
  try {
    const cleanedText = text.replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
};


export const generateYouTubeTitles = async (topic: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate 7 catchy, SEO-friendly YouTube titles for a video about "${topic}". The titles should be engaging and curiosity-driven. Return as a JSON array of strings.`,
    config: { responseMimeType: 'application/json' }
  });
  return getJson<string[]>(response.text) ?? [];
};

export const generateYouTubeDescription = async (topic: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write an SEO-optimized YouTube description for a video titled or about "${topic}". Include relevant keywords, a compelling intro, and a few relevant hashtags at the end. The description should be well-structured and around 200-300 words.`
  });
  return response.text;
};

export const generateUsernames = async (theme: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate 10 stylish and creative usernames with a "${theme}" theme. They should be unique and memorable. Return as a JSON array of strings.`,
    config: { responseMimeType: 'application/json' }
  });
  return getJson<string[]>(response.text) ?? [];
};

export const generateSlogans = async (brand: string): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate 5 short, powerful, and memorable slogans or taglines for a brand, channel, or niche focused on "${brand}". Return as a JSON array of strings.`,
    config: { responseMimeType: 'application/json' }
  });
  return getJson<string[]>(response.text) ?? [];
};

export const generateHashtags = async (topic: string): Promise<HashtagCategories | null> => {
   const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate a list of the best hashtags for a social media post about "${topic}". Categorize them into 'high' (very popular), 'medium' (niche but popular), and 'low' (very specific) competition. Provide 5-7 hashtags for each category.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          high: { type: Type.ARRAY, items: { type: Type.STRING } },
          medium: { type: Type.ARRAY, items: { type: Type.STRING } },
          low: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });
  return getJson<HashtagCategories>(response.text);
};

export const optimizeYouTubeSEO = async (topic: string): Promise<SeoOptimizationResult | null> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate a complete SEO package for a YouTube video about "${topic}". This should include an optimized title, a detailed and keyword-rich description (around 200 words), and a list of 15 relevant tags.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });
  return getJson<SeoOptimizationResult>(response.text);
};

export const checkSEOScore = async (content: { title: string; description: string; tags: string; }): Promise<SeoScoreResult | null> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the following YouTube video content: Title: "${content.title}", Description: "${content.description}", Tags: "${content.tags}". Provide an estimated SEO score from 0 to 100, and a list of 3-5 concise, actionable improvement tips.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });
  return getJson<SeoScoreResult>(response.text);
};

export const getTrendingTopics = async (): Promise<TrendingTopics | null> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: "What are the top 5 trending topics on YouTube and Instagram for general audiences today? Provide distinct lists for each platform.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          youtube: { type: Type.ARRAY, items: { type: Type.STRING } },
          instagram: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });
  return getJson<TrendingTopics>(response.text);
};
