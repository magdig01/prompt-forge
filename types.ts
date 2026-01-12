export type Platform = 'Gemini' | 'ChatGPT' | 'Claude' | 'General';

export type Tone = 'Professional' | 'Creative' | 'Academic' | 'Concise' | 'Step-by-Step';

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