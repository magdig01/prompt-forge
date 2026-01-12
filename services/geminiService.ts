
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

  const systemInstruction = `Anda adalah seorang Insinyur Prompt kelas dunia dan Spesialis Interaksi AI. 
  Tugas Anda adalah mengubah masukan mentah dan dasar dari pengguna menjadi prompt yang sangat optimal, terstruktur, dan efektif yang dirancang untuk ${platform}.
  
  Nada dari prompt yang dioptimalkan harus: ${tone}.

  Ikuti prinsip-prinsip ini berdasarkan platform target:
  - Untuk **ChatGPT**: Fokus pada konteks yang jelas, adopsi persona, dan spesifikasi format output.
  - Untuk **Gemini**: Tekankan penalaran logis, instruksi multi-langkah, dan batasan kreatif.
  - Untuk **Claude**: Gunakan tag XML untuk struktur jika membantu, fokus pada keamanan dan permintaan alur berpikir yang jelas.
  - Untuk **General**: Gunakan praktik terbaik yang berlaku untuk semua LLM (Persona, Tugas, Konteks, Format).

  **Format Output:**
  Hanya kembalikan teks prompt yang sudah dioptimalkan. Jangan sertakan penjelasan, pembukaan, atau blok kode markdown (kecuali jika prompt itu sendiri memerlukan blok kode). Output harus siap untuk disalin dan ditempel langsung ke antarmuka obrolan AI.
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

    return response.text || "Gagal membuat prompt yang dioptimalkan.";
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    return "Terjadi kesalahan saat mengoptimalkan prompt Anda. Silakan periksa kunci API Anda dan coba lagi.";
  }
};
