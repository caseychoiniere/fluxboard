import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Account, MonthlySummary } from '../types';

/**
 * Translates technical API errors into human-readable messages.
 */
const parseAIError = (error: any): string => {
  const message = error?.message || String(error);

  if (message.includes("429") || message.toLowerCase().includes("quota")) {
    return "Rate limit exceeded. Flux AI is resting, please try again in a minute.";
  }
  if (message.includes("403") || message.toLowerCase().includes("api key")) {
    return "API Configuration Error. Please verify your Gemini API key in settings.";
  }
  if (message.includes("400")) {
    return "The request was invalid. Try rephrasing your query.";
  }
  if (message.toLowerCase().includes("safety") || message.toLowerCase().includes("blocked")) {
    return "The analysis was blocked by safety filters. Try a different request.";
  }
  if (message.includes("500") || message.includes("503")) {
    return "Gemini servers are currently overwhelmed. Please try again shortly.";
  }

  return "Flux AI encountered an unexpected error. Please try again later.";
};

/**
 * Generates a financial insight based on user query and financial context.
 */
export const generateFinancialInsight = async (
    query: string,
    context: {
      transactions: Transaction[],
      accounts: Account[],
      summary: MonthlySummary[]
    }
): Promise<{ answer: string, suggestedAction?: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const contextString = JSON.stringify({
    currentDate: new Date().toISOString().split('T')[0],
    accounts: context.accounts.map(a => ({ name: a.name, balance: a.balance, type: a.type })),
    recentTransactions: context.transactions.slice(0, 20),
    monthlySummary: context.summary
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `You are Fluxboard AI. Context: ${contextString}. Be concise, expert, and friendly.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          },
          required: ['answer']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { answer: parseAIError(error) };
  }
};

/**
 * Performs a deep analysis of historical financial data and provides patterns and forecasts.
 */
export const getDeepAnalysis = async (
    context: {
      transactions: Transaction[],
      summary: MonthlySummary[]
    }
): Promise<{
  patterns: { title: string, description: string, impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' }[],
  forecast: { month: string, predictedAmount: number }[],
  summary: string
}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Analyze the 9-month financial history provided. 
  Identify 3-4 key spending patterns (e.g. subscription creep, dining trends, lifestyle inflation).
  Provide a 3-month forecast of total expenses.
  Provide a high-level summary of financial health.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are a Senior Financial Analyst. Data: ${JSON.stringify(context)}. 
        Return structured JSON only. Impact must be POSITIVE, NEGATIVE, or NEUTRAL.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] }
                },
                required: ['title', 'description', 'impact']
              }
            },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING, description: "YYYY-MM" },
                  predictedAmount: { type: Type.NUMBER }
                }
              }
            },
            summary: { type: Type.STRING }
          },
          required: ['patterns', 'forecast', 'summary']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Deep Analysis Error:", error);
    // Throw a human-readable error string
    throw new Error(parseAIError(error));
  }
};
