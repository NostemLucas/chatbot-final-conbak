export interface GCPCredentials {
  type: string;
  project_id: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url?: string;
  universe_domain: string;
}

export enum CredentialsSource {
  KEY_FILE = "keyFile",
  ENVIRONMENT_VARS = "environmentVars",
  BASE64_ENCODED = "base64Encoded",
  SERVICE_ACCOUNT_KEY = "serviceAccountKey",
  DEFAULT_ENVIRONMENT = "defaultEnvironment",
}

export interface ClientOptions {
  credentials?: GCPCredentials;
  keyFilename?: string;
}

export class GCPCredentialsManager {
  private static instance: GCPCredentialsManager;
  private credentials: GCPCredentials | null = null;
  private credentialsSource: CredentialsSource | null = null;

  private constructor() {}

  static getInstance(): GCPCredentialsManager {
    if (!GCPCredentialsManager.instance) {
      GCPCredentialsManager.instance = new GCPCredentialsManager();
    }
    return GCPCredentialsManager.instance;
  }

  getClientOptions(): ClientOptions {
    // 1. Archivo de credenciales (más seguro para producción)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      this.credentialsSource = CredentialsSource.KEY_FILE;
      return { keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS };
    }

    // 2. Variables de entorno individuales
    if (this.hasRequiredEnvVars()) {
      return this.buildCredentialsFromEnvVars();
    }

    // 3. Credenciales codificadas en Base64
    if (process.env.GCP_CREDENTIALS_BASE64) {
      return this.parseBase64Credentials();
    }

    // 4. Clave de cuenta de servicio como JSON string
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return this.parseServiceAccountKey();
    }

    // 5. Credenciales por defecto del ambiente
    console.warn("Usando credenciales por defecto del ambiente GCP");
    this.credentialsSource = CredentialsSource.DEFAULT_ENVIRONMENT;
    return {};
  }

  private hasRequiredEnvVars(): boolean {
    return !!(
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_PROJECT_ID
    );
  }

  private buildCredentialsFromEnvVars(): ClientOptions {
    const credentials: GCPCredentials = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID!,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: this.normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY!),
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
      universe_domain: "googleapis.com",
    };

    this.credentials = credentials;
    this.credentialsSource = CredentialsSource.ENVIRONMENT_VARS;
    return { credentials };
  }

  private parseBase64Credentials(): ClientOptions {
    try {
      const credentials = JSON.parse(
        Buffer.from(process.env.GCP_CREDENTIALS_BASE64!, "base64").toString()
      ) as GCPCredentials;

      if (credentials.private_key) {
        credentials.private_key = this.normalizePrivateKey(
          credentials.private_key
        );
      }

      this.validateCredentialsStructure(credentials);
      this.credentials = credentials;
      this.credentialsSource = CredentialsSource.BASE64_ENCODED;
      return { credentials };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error parsing GCP_CREDENTIALS_BASE64:", errorMessage);
      throw new Error(
        `Credenciales GCP Base64 mal formateadas: ${errorMessage}`
      );
    }
  }

  private parseServiceAccountKey(): ClientOptions {
    try {
      const credentials = JSON.parse(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY!
      ) as GCPCredentials;

      if (credentials.private_key) {
        credentials.private_key = this.normalizePrivateKey(
          credentials.private_key
        );
      }

      this.validateCredentialsStructure(credentials);
      this.credentials = credentials;
      this.credentialsSource = CredentialsSource.SERVICE_ACCOUNT_KEY;
      return { credentials };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error parsing GOOGLE_SERVICE_ACCOUNT_KEY:", errorMessage);
      throw new Error(
        `Credenciales de servicio mal formateadas: ${errorMessage}`
      );
    }
  }

  private normalizePrivateKey(privateKey: string): string {
    return privateKey.replace(/\\n/g, "\n");
  }

  private validateCredentialsStructure(credentials: any): void {
    const requiredFields = [
      "type",
      "project_id",
      "private_key",
      "client_email",
    ];

    for (const field of requiredFields) {
      if (!credentials[field]) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }

    if (credentials.type !== "service_account") {
      throw new Error('El tipo de credencial debe ser "service_account"');
    }

    if (!credentials.client_email.includes("@")) {
      throw new Error("El client_email no tiene un formato válido");
    }
  }

  /**
   * Obtiene el ID del proyecto en orden de prioridad
   */
  getProjectId(): string {
    return (
      process.env.GOOGLE_PROJECT_ID ||
      process.env.DIALOGFLOW_PROJECT_ID ||
      this.credentials?.project_id ||
      "text-vertex-speak"
    );
  }

  /**
   * Obtiene las credenciales cargadas
   */
  getCredentials(): GCPCredentials | null {
    if (!this.credentials) {
      this.getClientOptions();
    }
    return this.credentials;
  }

  /**
   * Valida si las credenciales están disponibles y son válidas
   */
  validateCredentials(): boolean {
    try {
      const options = this.getClientOptions();

      // Validar que tengamos credenciales o archivo de credenciales
      const hasCredentials = !!(options.credentials || options.keyFilename);

      if (!hasCredentials) {
        console.warn("No se encontraron credenciales GCP válidas");
        return false;
      }

      // Si tenemos credenciales en memoria, validar su estructura
      if (options.credentials) {
        this.validateCredentialsStructure(options.credentials);
      }

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error validating credentials:", errorMessage);
      return false;
    }
  }
}
