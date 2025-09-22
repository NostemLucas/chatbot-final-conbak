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
