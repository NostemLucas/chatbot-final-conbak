import { SessionsClient, protos } from "@google-cloud/dialogflow";
import { GCPCredentialsManager } from "./gcp-credentials";

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
  private sessionClient: SessionsClient;
  private readonly gcpManager: GCPCredentialsManager;
  private readonly projectId: string;
  private readonly languageCode: string;

  constructor(config?: DialogflowConfig) {
    this.gcpManager = GCPCredentialsManager.getInstance();

    // Configurar project ID con fallback
    this.projectId = config?.projectId || this.gcpManager.getProjectId(); // Usa el método del manager que ya tiene fallbacks

    this.languageCode = config?.languageCode || "es";

    try {
      // Validar credenciales
      if (!this.gcpManager.validateCredentials()) {
        throw new Error(
          "No se pudieron validar las credenciales de GCP para Dialogflow"
        );
      }

      // Inicializar cliente con credenciales del manager
      const clientOptions = this.gcpManager.getClientOptions();

      this.sessionClient = new SessionsClient({
        ...clientOptions,
        // Override projectId si es necesario
        projectId: this.projectId,
      });

      console.log(`Dialogflow client inicializado exitosamente`);
      console.log(`- Project ID: ${this.projectId}`);
      console.log(`- Language Code: ${this.languageCode}`);
 
    } catch (error) {
      console.error("Error inicializando Dialogflow client:", error);
      throw new Error(
        `Fallo al inicializar Dialogflow service: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
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
