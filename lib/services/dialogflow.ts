import { SessionsClient, protos } from "@google-cloud/dialogflow";

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

export class DialogflowService {
  private readonly sessionClient: SessionsClient;
  private readonly projectId: string;
  private readonly languageCode: string;

  constructor(config?: DialogflowConfig) {
    // Usar variables de entorno con fallback
    this.projectId =
      config?.projectId ||
      process.env.DIALOGFLOW_PROJECT_ID ||
      "text-vertex-speak";
    this.languageCode = config?.languageCode || "es";

    // Configuración de credenciales para Next.js
    const clientOptions = this.getClientOptions();
    this.sessionClient = new SessionsClient(clientOptions);
  }

  private getClientOptions() {
    // Opción 1: Usar archivo de credenciales (desarrollo local)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS };
    }

    // Opción 2: Usar credenciales individuales (producción recomendada)
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      return {
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          project_id: this.projectId,
        },
      };
    }

    // Opción 3: Usar JSON completo desde variable de entorno
    if (process.env.GCP_CREDENTIALS_BASE64) {
      try {
        return {
          credentials: JSON.parse(
            Buffer.from(process.env.GCP_CREDENTIALS_BASE64, "base64").toString()
          ).replace(/\\n/g, "\n"), // Convierte \\n a saltos de línea reales
        };
      } catch (error) {
        console.error("Error parsing GOOGLE_SERVICE_ACCOUNT_KEY:", error);
      }
    }

    // Fallback: usar credenciales por defecto del ambiente
    return {};
  }

  /**
   * Envía texto a Dialogflow y obtiene la respuesta.
   * @param text Texto del usuario.
   * @param sessionId Identificador de sesión (1 por usuario/conversación).
   * @param languageCode Código de idioma opcional.
   */
  async processText(
    text: string,
    sessionId: string = "default-session",
    languageCode?: string
  ): Promise<DialogflowResponse> {
    if (!text?.trim()) {
      throw new Error("El texto no puede estar vacío");
    }

    if (!this.projectId) {
      throw new Error("Project ID no configurado");
    }

    const sessionPath = this.sessionClient.projectAgentSessionPath(
      this.projectId,
      sessionId
    );

    const request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text.trim(),
          languageCode: languageCode || this.languageCode,
        },
      },
    };

    try {
      const [response] = await this.sessionClient.detectIntent(request);
      const result = response.queryResult;

      if (!result) {
        throw new Error("Respuesta de Dialogflow vacía");
      }

      return {
        queryText: result.queryText ?? "",
        fulfillmentText: result.fulfillmentText ?? "",
        intent: result.intent?.displayName ?? "unknown",
        confidence: result.intentDetectionConfidence ?? 0,
        parameters: result.parameters as Record<string, any> | undefined,
        languageCode: result.languageCode ?? this.languageCode,
      };
    } catch (error) {
      console.error("Error en Dialogflow:", error);
      throw new Error(
        `Error al procesar el texto con Dialogflow: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Procesa un evento (útil para respuestas más complejas)
   */
  async processEvent(
    eventName: string,
    parameters: Record<string, any> = {},
    sessionId: string = "default-session",
    languageCode?: string
  ): Promise<DialogflowResponse> {
    const sessionPath = this.sessionClient.projectAgentSessionPath(
      this.projectId,
      sessionId
    );

    const request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        event: {
          name: eventName,
          parameters: parameters,
          languageCode: languageCode || this.languageCode,
        },
      },
    };

    try {
      const [response] = await this.sessionClient.detectIntent(request);
      const result = response.queryResult;

      if (!result) {
        throw new Error("Respuesta de Dialogflow vacía");
      }

      return {
        queryText: eventName,
        fulfillmentText: result.fulfillmentText ?? "",
        intent: result.intent?.displayName ?? "unknown",
        confidence: result.intentDetectionConfidence ?? 0,
        parameters: result.parameters as Record<string, any> | undefined,
        languageCode: result.languageCode ?? this.languageCode,
      };
    } catch (error) {
      console.error("Error en Dialogflow Event:", error);
      throw new Error(
        `Error al procesar el evento con Dialogflow: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Valida la configuración del servicio
   */
  async validateConfiguration(): Promise<boolean> {
    try {
      // Hacer una consulta simple para validar la conexión
      await this.processText("test", "validation-session");
      return true;
    } catch (error) {
      console.error("Error de configuración Dialogflow:", error);
      return false;
    }
  }
}
