import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import { GCPCredentialsManager } from "@/lib/services/gcp-credentials";

// Inicializar Vertex AI
const gcpManager = GCPCredentialsManager.getInstance();
const projectId = gcpManager.getProjectId();
const clientOptions = gcpManager.getClientOptions();

const vertexAI = new VertexAI({
  project: projectId,
  location: "us-central1", // Cambia según tu región
  googleAuthOptions: clientOptions,
});

/**
 * Webhook endpoint que Dialogflow llamará cuando no encuentre respuesta
 * Ruta sugerida: /api/vertex-webhook/route.ts
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Webhook Vertex AI activado");

    // Leer el cuerpo de la petición de Dialogflow
    const body = await request.json();

    // Extraer información de la petición de Dialogflow
    const {
      queryResult: { queryText, intent, parameters, languageCode = "es" },
      session,
      originalDetectIntentRequest,
    } = body;

    console.log("📥 Datos recibidos de Dialogflow:", {
      queryText,
      intent: intent?.displayName || "No detectado",
      session: session?.split("/").pop(), // Solo el ID de sesión
      languageCode,
    });

    // Validar que tenemos el texto de la consulta
    if (!queryText || queryText.trim() === "") {
      console.error("❌ No se recibió queryText de Dialogflow");
      return NextResponse.json({
        fulfillmentText:
          "Lo siento, no pude procesar tu consulta. Por favor, intenta de nuevo.",
        source: "vertex-webhook-error",
      });
    }

    // Configurar el modelo de Vertex AI
    const model = vertexAI.preview.getGenerativeModel({
      model: "gemini-1.5-flash", // O el modelo que prefieras
      systemInstruction: `
        Eres Yasta, un asistente virtual especializado y amigable.
        
        CONTEXTO: Esta consulta llegó porque Dialogflow no pudo responderla adecuadamente.
        
        INSTRUCCIONES:
        - Responde en español de manera clara y útil
        - Mantén un tono amigable y profesional
        - Si es una pregunta técnica muy específica, sugiere contactar soporte
        - Limita tu respuesta a máximo 200 palabras para mantener la conversación fluida
        - Si no puedes responder con certeza, dilo honestamente
        
        Usuario preguntó: "${queryText}"
      `,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    console.log("🤖 Enviando consulta a Vertex AI...");

    // Generar respuesta con Vertex AI
    const result = await model.generateContent(queryText);
    const response = result.response;

    // Extraer el texto de la respuesta correctamente
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No se generó respuesta de Vertex AI");
    }

    const generatedText = candidates[0].content.parts[0].text?.trim() || "";

    console.log(
      "✅ Respuesta generada por Vertex AI:",
      generatedText.substring(0, 100) + "..."
    );

    if (!generatedText) {
      throw new Error("Vertex AI no generó texto válido");
    }

    // Responder a Dialogflow en el formato que espera
    const dialogflowResponse = {
      fulfillmentText: generatedText,
      source: "vertex-ai",
      // Opcional: añadir contextos de salida si los necesitas
      outputContexts: [
        {
          name: `${session}/contexts/vertex-response`,
          lifespanCount: 1,
          parameters: {
            generatedBy: "vertex-ai",
            originalQuery: queryText,
            confidence: "high",
          },
        },
      ],
    };

    console.log("📤 Enviando respuesta a Dialogflow");

    return NextResponse.json(dialogflowResponse);
  } catch (error) {
    console.error("❌ Error en webhook Vertex AI:", error);

    // Respuesta de fallback si algo falla
    const errorResponse = {
      fulfillmentText:
        "Disculpa, tengo problemas técnicos en este momento. ¿Podrías reformular tu pregunta o contactar con soporte?",
      source: "vertex-webhook-error",
    };

    return NextResponse.json(errorResponse);
  }
}

/**
 * Endpoint GET para verificar que el webhook está funcionando
 * Útil para debugging y monitoreo
 */
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Health check del webhook Vertex AI");

    return NextResponse.json({
      status: "healthy",
      service: "vertex-ai-webhook",
      timestamp: new Date().toISOString(),
      project: projectId,
      model: "gemini-1.5-flash",
      ready: true,
      message: "Webhook listo para recibir peticiones de Dialogflow",
    });
  } catch (error) {
    console.error("❌ Error en health check:", error);

    return NextResponse.json(
      {
        status: "error",
        service: "vertex-ai-webhook",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
