
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Account, MonthlySummary } from '../types';

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
  // Always initialize right before making the call using process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const contextString = JSON.stringify({
    currentDate: new Date().toISOString().split('T')[0],
    accounts: context.accounts.map(a => ({ name: a.name, balance: a.balance, type: a.type })),
    recentTransactions: context.transactions.slice(0, 20),
    monthlySummary: context.summary
  });

  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-flash-preview for general text and Q&A tasks
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
    // response.text is a property, not a method
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { answer: "Error analyzing finances." };
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
  // Always initialize right before making the call using process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Analyze the 9-month financial history provided. 
  Identify 3-4 key spending patterns (e.g. subscription creep, dining trends, lifestyle inflation).
  Provide a 3-month forecast of total expenses.
  Provide a high-level summary of financial health.`;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex reasoning and deep analysis
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
    // response.text is a property, not a method
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Deep Analysis Error:", error);
    throw error;
  }
};
