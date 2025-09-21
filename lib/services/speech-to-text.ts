// lib/services/speech-to-text.ts
import { SpeechClient, protos } from "@google-cloud/speech";

interface SpeechOptions {
  encoding?: string;
  sampleRateHertz?: number;
  languageCode?: string;
  enableAutomaticPunctuation?: boolean;
}

export interface SpeechResult {
  success: boolean;
  transcript: string;
  confidence: number;
  error?: string;
}

export class SpeechToTextService {
  private readonly speechClient: SpeechClient;

  constructor() {
    const credentials = JSON.parse(process.env.GCP_KEY_FILE_CONTENT || "{}");
    this.speechClient = new SpeechClient({ credentials });
  }

  async speechToText(
    audioBuffer: Buffer,
    options?: SpeechOptions
  ): Promise<SpeechResult> {
    try {
      if (!this.validateAudioBuffer(audioBuffer)) {
        return {
          success: false,
          transcript: "",
          confidence: 0,
          error: "Buffer de audio inválido",
        };
      }

      const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
        encoding: (options?.encoding as any) || "MP3",
        sampleRateHertz: options?.sampleRateHertz || 16000,
        languageCode: options?.languageCode || "es-ES",
        enableAutomaticPunctuation: options?.enableAutomaticPunctuation ?? true,
      };

      const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: { content: audioBuffer.toString("base64") },
        config: config,
      };

      const [response] = await this.speechClient.recognize(request);

      if (!response.results?.length) {
        return {
          success: false,
          transcript: "qeu es yasata",
          confidence: 0,
          error: "No se encontró transcripción",
        };
      }

      const result = response.results[0];
      const alternative = result.alternatives?.[0];

      if (!alternative?.transcript) {
        return {
          success: false,
          transcript: "",
          confidence: 0,
          error: "Transcripción vacía",
        };
      }

      return {
        success: true,
        transcript: alternative.transcript,
        confidence: alternative.confidence || 0,
      };
    } catch (error) {
      console.error("Error en Speech-to-Text:", error);
      return {
        success: false,
        transcript: "",
        confidence: 0,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  validateAudioBuffer(buffer: Buffer): boolean {
    return Buffer.isBuffer(buffer) && buffer.length > 0;
  }

  async speechToTextStream(
    audioStream: NodeJS.ReadableStream,
    options?: SpeechOptions
  ): Promise<AsyncGenerator<string, void, unknown>> {
    const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
      encoding: (options?.encoding as any) || "WEBM_OPUS",
      sampleRateHertz: options?.sampleRateHertz || 16000,
      languageCode: options?.languageCode || "es-ES",
      enableAutomaticPunctuation: options?.enableAutomaticPunctuation ?? true,
    };

    const request = {
      config,
      interimResults: true,
    };

    const recognizeStream = this.speechClient
      .streamingRecognize(request)
      .on("error", console.error);

    audioStream.pipe(recognizeStream);

    async function* generateTranscripts() {
      for await (const response of recognizeStream) {
        if (response.results?.[0]?.alternatives?.[0]?.transcript) {
          yield response.results[0].alternatives[0].transcript;
        }
      }
    }

    return generateTranscripts();
  }
}
