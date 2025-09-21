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
    /*     const base64Credentials = process.env.GCP_CREDENTIALS_BASE64;
    if (!base64Credentials) {
      throw new Error(
        "GCP_CREDENTIALS_BASE64 environment variable is not set."
      );
    }
    const credentials = JSON.parse(
      Buffer.from(process.env.GCP_CREDENTIALS_BASE64!, "base64")
        .toString()
        .replace(/\\n/g, "\n") // Convierte \\n a saltos de línea reales
    ); */
    this.speechClient = new SpeechClient({
      type: "service_account",
      project_id: "text-vertex-speak",
      private_key_id: "5fa1300385ead7695050359a1fc6b22f8ea60420",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDdL8TtnAIkr0T8\nddwtOtESmbyloz4cg+al1EgiBU2vNgg+wOS2Aa0WRoz8J+PaKGcvia11zT4VDUYn\nPZkKM4ouQ0cDPQ4BSA9rrXZ0+kGnKZzmHagQJFsS7qzHhrjmvLMtDy+p83BEPfGC\nLn81359Hi+1ZJF146ycw4HYqxh8My26j4DwABBW4fF5V33UYb1gPmr8T3BHcc+zm\nSy01efSy5md6pTUeqhSEyc0Q/JtitafKdnkxsQNkH/n57cgwjkwb7IZygLopVWa/\n5jL7NKd6MH/nxjJCvWp79RCPoUQdV4aTlusWiRA0tUNR+PCkF/I7oxHXLe3KvXkb\nFOOjp+yxAgMBAAECggEAD2mofJEyMgm3kisJUmqGjpgBZf5j0dtcG2KZOyuo7+Rh\nOzQ4S7l+rO5yHREPhtBpbk3W9T49zPw9jvbzHtucDaC5Bk//FZZGos910W1t3T7g\nVMWsxCEwaneQuR+Za1SrXKCyBtL0mADD/zkLur6QLA1jVuKak9Y5ByYg/daL69lw\n/InLfwHriIOfMRoS7P7M920CbjwcEtk1t0ZQps4ZHbO+Z9dkbY00Vr9+svHrOORj\nnlzSWJxlnW4wFNx3D84xs6gYbFcTorlGeTGa7yn89M63YFrUFgfE1wWXcr3wLAlW\nNYcCVItwZW/7DXUg2KR9O2fc1qGszCu5+j9wybttNQKBgQDvhA4gI5bwBZ5Ya3Ab\n4Gh/QrO3tcLF61kHvLqljJ7iBlHc01lE4OaU77qAaiqIHIlJFWqTT3kjl3PnFxVP\n4M7GpBg4aeUEddsqeFSk2O/1ixGF74Kq6/ghzu0TgrNkTyIzAxxiwZLTTLcAqY67\n2tvvLv+G41M6WfDWqxbrvnpMFQKBgQDsaMcT3rONk6J28WKboQJvO08NILa3a499\nqtTFF3wogXOzMTWHRuhZJMIVVyR4YlmUYc38JGiMISljrRHnskTE8olIFMXPaiGj\nxvfzahigkVdjTC8ntoZWt0slmnPQa08APiHUaajzvogbJBE54tkMtg2ML6capqCJ\nfk4oCfCZLQKBgQCXnSMH6x9nblcOp2u+6a2cKQ/0UWUqvdCMmkYX90y3zMJTI6IV\nfLvZOWr4ULv9jvrEPX9KInuPMRbYCH+gIbEigssmIroquaPzXVpPQ1eaOd7sxnET\nWu2mEQN3XzvJWmJOokB8rwYPJTeOfsZwWZjw7fIoY4vSmw5eBM0si1WFBQKBgQCH\nnXeOK3O+5JEPQFt7wXpfCpvHgRuvzpEK2uOhiF5d8hzID5OQXZnOAWsgyNOQB4Mx\nvoVmfhBHSoKuvkqGKlqOzD76TYhH+q7/f5UfWp50Bcwmlz55vpgDyLPgB2Emj1hL\nYFkRu+cCpCr5vs/u7/Xo98p/v5pRjIKNPRpil4kgpQKBgQDhoKO/8xb3nuhKGol3\nPOg1OCwbe1TgsNTgM5X0fOc6hsIgaF8Y6J5faBU5GB8dixBByzXDt+awAadtQq9i\nvaZC8fRmfZgGlD1X0/Jwkg0xP0o52TPGjZAqgfzNsl+i3dT4o7JFxBiYXxK2xXnq\nxrqga8DhDAv+u67reRazqvLRxA==\n-----END PRIVATE KEY-----\n",
      client_email: "vertex-spech@text-vertex-speak.iam.gserviceaccount.com",
      client_id: "103107335707260964105",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/vertex-spech%40text-vertex-speak.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    });
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
