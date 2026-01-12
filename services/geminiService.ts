import { GoogleGenAI } from "@google/genai";
import { Platform, Tone } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: apiKey });

export const optimizePrompt = async (
  text: string, 
  platform: Platform, 
  tone: Tone
): Promise<string> => {
  if (!text.trim()) return "";

  const modelName = 'gemini-3-flash-preview';

  const systemInstruction = `You are a world-class Prompt Engineer and AI Interaction Specialist. 
  Your task is to transform the user's raw, basic input into a highly optimized, structured, and effective prompt designed for ${platform}.
  
  The tone of the optimized prompt should be: ${tone}.

  Follow these principles based on the target platform:
  - For **ChatGPT**: Focus on clear context, persona adoption, and output format specification.
  - For **Gemini**: Emphasize logical reasoning, multi-step instructions, and creative constraints.
  - For **Claude**: Use XML tags for structure if helpful, focus on safety and clear chain-of-thought requests.
  - For **General**: Use best practices applicable to all LLMs (Persona, Task, Context, Format).

  **Output Format:**
  Return ONLY the optimized prompt text. Do not include explanations, preambles, or markdown code blocks (unless the prompt itself requires code blocks). The output should be ready to copy and paste directly into the AI chat interface.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: text,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "Failed to generate optimized prompt.";
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    return "An error occurred while optimizing your prompt. Please check your API key and try again.";
  }
};