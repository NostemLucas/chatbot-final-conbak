// lib/services/text-to-speech.ts
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import { GCPCredentialsManager } from "./gcp-credentials";

// Predefined voices optimized for natural human-like sound
// Using only verified available voices from Google Cloud TTS
const PRESET_VOICES = {
  // Female Latin voices
  femaleLatina: {
    languageCode: "es-ES",
    name: "es-ES-Standard-A", // Verified female Spanish voice
    ssmlGender: "FEMALE" as const,
    speakingRate: 1.05,
    pitch: 1.0,
    volumeGainDb: 0.0,
  },
  femaleMexican: {
    languageCode: "es-US",
    name: "es-US-Standard-A", // US Spanish female (closest to Mexican)
    ssmlGender: "FEMALE" as const,
    speakingRate: 0.95,
    pitch: 1.5,
    volumeGainDb: 0.5,
  },
  femaleArgentinian: {
    languageCode: "es-ES",
    name: "es-ES-Standard-C", // Another Spanish female voice
    ssmlGender: "FEMALE" as const,
    speakingRate: 1.0,
    pitch: 1.0,
    volumeGainDb: 0.0,
  },

  // Male Latin voices
  maleLatino: {
    languageCode: "es-ES",
    name: "es-ES-Standard-B", // Verified male Spanish voice
    ssmlGender: "MALE" as const,
    speakingRate: 1.0,
    pitch: -1.0,
    volumeGainDb: 0.5,
  },
  maleMexican: {
    languageCode: "es-US",
    name: "es-US-Standard-B", // US Spanish male
    ssmlGender: "MALE" as const,
    speakingRate: 0.95,
    pitch: -0.5,
    volumeGainDb: 0.0,
  },
  maleArgentinian: {
    languageCode: "es-ES",
    name: "es-ES-Standard-D", // Another Spanish male voice
    ssmlGender: "MALE" as const,
    speakingRate: 1.05,
    pitch: -1.5,
    volumeGainDb: 1.0,
  },
};
type PresetVoiceKey = keyof typeof PRESET_VOICES;

export interface TextToSpeechResult {
  success: boolean;
  audioContent?: Buffer;
  error?: string;
}

export class TextToSpeechService {
  private ttsClient: TextToSpeechClient;
  private readonly gcpManager: GCPCredentialsManager;

  constructor() {
    this.gcpManager = GCPCredentialsManager.getInstance();

    try {
      if (!this.gcpManager.validateCredentials()) {
        throw new Error("No se pudieron validar las credenciales de GCP");
      }

      const clientOptions = this.gcpManager.getClientOptions();

      this.ttsClient = new TextToSpeechClient({
        ...clientOptions,
        projectId: this.gcpManager.getProjectId(),
      });
    } catch (error) {
      console.error("Error inicializando Text-to-Speech client:", error);
      throw new Error(
        `Fallo al inicializar Text-to-Speech service: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  // Main simplified method - just pass text and voice type
  async speak(
    text: string,
    voiceType: PresetVoiceKey = "femaleLatina"
  ): Promise<TextToSpeechResult> {
    try {
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: "Empty or invalid text",
        };
      }

      const voiceConfig = PRESET_VOICES[voiceType];

      const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
        {
          input: { text: text },
          voice: {
            languageCode: voiceConfig.languageCode,
            name: voiceConfig.name,
            ssmlGender: voiceConfig.ssmlGender,
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: voiceConfig.speakingRate,
            pitch: voiceConfig.pitch,
            volumeGainDb: voiceConfig.volumeGainDb,
            sampleRateHertz: 24000, // High quality
          },
        };

      const [response] = await this.ttsClient.synthesizeSpeech(request);

      if (!response.audioContent) {
        return {
          success: false,
          error: "No audio content generated",
        };
      }

      return {
        success: true,
        audioContent: Buffer.from(response.audioContent),
      };
    } catch (error) {
      console.error("Error in Text-to-Speech:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Method to get list of available voices
  getAvailableVoices(): string[] {
    return Object.keys(PRESET_VOICES);
  }

  // Method to get info about a specific voice
  getVoiceInfo(voiceType: PresetVoiceKey) {
    const config = PRESET_VOICES[voiceType];
    return {
      name: voiceType,
      language: config.languageCode,
      gender: config.ssmlGender,
      speakingRate: config.speakingRate,
      pitch: config.pitch,
    };
  }

  // Maintain compatibility with previous method (optional)
  async textToSpeech(text: string): Promise<TextToSpeechResult> {
    return this.speak(text, "femaleLatina"); // Default voice
  }
}
