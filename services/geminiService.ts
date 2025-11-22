import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ScriptType } from '../types';

const apiKey = process.env.API_KEY;
// Initialize the client only if the key exists to avoid immediate crashes, 
// though the app assumes the key is valid per instructions.
const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY' });

/**
 * Analyzes logs or metrics to provide scaling advice.
 * Uses gemini-2.5-flash for speed and reasoning.
 */
export const getScalingAdvice = async (context: string, userQuery: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a Senior DevOps Engineer and Scaling Advisor.
      Context (Logs/Metrics/Config):
      ${context}
      
      User Query:
      ${userQuery}
      
      Provide a concise, actionable response focusing on performance optimization, scaling strategies (horizontal/vertical), or troubleshooting. Use bullet points for clarity.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No advice generated.";
  } catch (error) {
    console.error("Error fetching advice:", error);
    return "Error connecting to AI Advisor. Please check your API configuration.";
  }
};

/**
 * Generates Infrastructure as Code (IaC) scripts.
 * Uses gemini-3-pro-preview for better coding capabilities.
 */
export const generateInfrastructureScript = async (type: ScriptType, requirements: string): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    const prompt = `
      Generate a production-ready ${type} file based on the following requirements.
      
      Requirements:
      ${requirements}
      
      Ensure the code is well-commented and follows best practices for security and scalability.
      Return ONLY the code block, no markdown formatting outside the code.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    let text = response.text || "";
    // Cleanup markdown code blocks if present
    text = text.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
    return text;
  } catch (error) {
    console.error("Error generating script:", error);
    return "# Error generating script. Please try again.";
  }
};