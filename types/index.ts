import { LucideIcon } from "lucide-react";

export interface YastaResponse {
  transcipt: string;
  confidence: number;
  dialogflow: any;
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
