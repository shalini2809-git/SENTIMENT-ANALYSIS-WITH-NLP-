import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  explanation: string;
  tokens: string[];
  emoji: string;
  emotion: 'happy' | 'sad' | 'angry' | 'fear' | 'excited' | 'disgusted';
  keywords: string[];
  entities: { name: string; type: string }[];
  sentences: { text: string; sentiment: string }[];
  summary: string;
  aiSuggestion: string;
  isFakeReview?: boolean;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (!text.trim()) {
    throw new Error('Please enter some text to analyze.');
  }

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Analyze the following text with advanced NLP techniques: "${text}"`,
    config: {
      systemInstruction: `You are an expert NLP system. 
      Perform full-spectrum analysis:
      1. Sentiment (positive/negative/neutral) + confidence score.
      2. Specific Emotion (happy, sad, angry, fear, excited, disgusted).
      3. Named Entity Recognition (identify major people, places, organizations).
      4. Keyword extraction (top 5).
      5. Sentence-wise sentiment breakdown.
      6. Summarize the text.
      7. Provide an AI-generated response suggestion to the user based on their tone.
      8. Check for 'fake review' patterns (spammy language, over-enthusiasm, generic phrases).
      
      Return ONLY valid JSON matching this schema:
      {
        "sentiment": string,
        "confidence": number,
        "explanation": string,
        "tokens": string[],
        "emoji": string,
        "emotion": string,
        "keywords": string[],
        "entities": [{"name": string, "type": string}],
        "sentences": [{"text": string, "sentiment": string}],
        "summary": string,
        "aiSuggestion": string,
        "isFakeReview": boolean
      }`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          tokens: { type: Type.ARRAY, items: { type: Type.STRING } },
          emoji: { type: Type.STRING },
          emotion: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          entities: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { name: { type: Type.STRING }, type: { type: Type.STRING } } 
            } 
          },
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { text: { type: Type.STRING }, sentiment: { type: Type.STRING } }
            }
          },
          summary: { type: Type.STRING },
          aiSuggestion: { type: Type.STRING },
          isFakeReview: { type: Type.BOOLEAN }
        },
        required: ['sentiment', 'confidence', 'explanation', 'tokens', 'emoji', 'emotion', 'keywords', 'entities', 'sentences', 'summary', 'aiSuggestion', 'isFakeReview']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (err) {
    console.error('Failed to parse Gemini response:', err);
    throw new Error('Advanced analysis failed. Please try again.');
  }
}
