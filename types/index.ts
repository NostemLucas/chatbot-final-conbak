import { LucideIcon } from "lucide-react";

export interface YastaResponse {
  transcript: string;
  confidence: number;
  dialogflow: DialogflowResponse;
}

export interface DialogflowResponse {
  queryText: string;
  fulfillmentText: string;
  intent: string;
  confidence: number;
  parameters?: Record<string, any>;
  languageCode: string;
}

export interface DialogflowConfig {
  projectId?: string;
  languageCode?: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hasVideo: boolean;
  urlVideo?: string;
  intent: string;
  images?: {
    url: string;
    description: string;
  }[];
  content: {
    intro: string;
    steps: string[];
    tip: string;
    videoDescription: string;
  };
}

export interface VertexConfig {
  projectId?: string;
  location?: string;
  modelName?: string;
}

export interface VertexResponse {
  text: string;
  prompt: string;
  model: string;
  success: boolean;
  error?: string;
}

export interface EnhancedDialogflowResponse extends DialogflowResponse {
  usedFallback: boolean;
  source: "dialogflow" | "vertex-ai";
  vertexResponse?: VertexResponse;
}

export interface SpeechToTextConfig {
  encoding: string;
  sampleRateHertz: number;
  languageCode: string;
  enableAutomaticPunctuation?: boolean;
}

export interface SpeechToTextResult {
  success: boolean;
  transcript: string;
  confidence: number;
  error?: string;
}
