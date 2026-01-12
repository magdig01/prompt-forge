
export type Platform = 'Gemini' | 'ChatGPT' | 'Claude' | 'General';

export type Tone = 'Profesional' | 'Kreatif' | 'Akademis' | 'Ringkas' | 'Langkah-demi-Langkah';

export interface PromptData {
  id: string;
  originalText: string;
  optimizedText: string;
  platform: Platform;
  tone: Tone;
  tags: string[];
  createdAt: number;
  isFavorite: boolean;
}

export interface OptimizationRequest {
  text: string;
  platform: Platform;
  tone: Tone;
}

export type ViewState = 'optimizer' | 'library' | 'history';
