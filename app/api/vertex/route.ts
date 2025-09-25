import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import { GCPCredentialsManager } from "@/lib/services/gcp-credentials";

// Inicializar Vertex AI
const gcpManager = GCPCredentialsManager.getInstance();
const projectId = gcpManager.getProjectId();
const clientOptions = gcpManager.getClientOptions();

const vertexAI = new VertexAI({
  project: projectId,
  location: "us-central1",
  googleAuthOptions: clientOptions,
});

/**
 * Extrae texto de la respuesta de Vertex AI de forma robusta
 */
function extractTextFromResponse(response: any): string {
  try {
    // Método 1: Probar response.text() si existe
    if (typeof response.text === "function") {
      return response.text().trim();
    }

    // Método 2: Extraer de candidates
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];

      if (
        candidate.content &&
        candidate.content.parts &&
        candidate.content.parts.length > 0
      ) {
        const part = candidate.content.parts[0];
        if (part.text) {
          return part.text.trim();
        }
      }

      // Fallback: buscar en cualquier nivel
      const textContent = JSON.stringify(candidate).match(
        /"text"\s*:\s*"([^"]+)"/
      );
      if (textContent && textContent[1]) {
        return textContent[1].trim();
      }
    }

    // Método 3: Buscar en toda la respuesta
    const responseStr = JSON.stringify(response);
    const textMatch = responseStr.match(/"text"\s*:\s*"([^"]+)"/);
    if (textMatch && textMatch[1]) {
      return textMatch[1].trim();
    }

    throw new Error("No se pudo extraer texto de la respuesta");
  } catch (error) {
    console.error("Error extrayendo texto:", error);
    throw new Error(`Error procesando respuesta de Vertex AI: ${error}`);
  }
}

/**
 * Webhook endpoint para Dialogflow
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Webhook Vertex AI activado");

    const body = await request.json();

    // Log del body completo para debugging
    console.log("📦 Body completo recibido:", JSON.stringify(body, null, 2));

    // Validar que el body tiene la estructura esperada
    if (!body || typeof body !== "object") {
      console.error("❌ Body inválido:", body);
      return NextResponse.json({
        fulfillmentText: "Error: Formato de petición inválido.",
        source: "vertex-webhook-error",
      });
    }

    // Extraer datos con validación
    const queryResult = body.queryResult || {};
    const queryText = queryResult.queryText || body.queryText || "";
    const intent = queryResult.intent || body.intent;
    const parameters = queryResult.parameters || body.parameters || {};
    const languageCode = queryResult.languageCode || body.languageCode || "es";
    const session = body.session || "unknown-session";

    console.log("📥 Datos extraídos:", {
      queryText,
      intent: intent?.displayName || intent || "No detectado",
      session: session?.split("/").pop() || session,
      languageCode,
      hasParameters: Object.keys(parameters).length > 0,
    });

    if (!queryText || queryText.trim() === "") {
      console.error("❌ No se recibió queryText válido");
      console.error("Available keys in body:", Object.keys(body));
      console.error("Available keys in queryResult:", Object.keys(queryResult));

      return NextResponse.json({
        fulfillmentText:
          "Lo siento, no pude procesar tu consulta. Por favor, intenta de nuevo.",
        source: "vertex-webhook-error",
      });
    }

    // Configurar el modelo
    const model = vertexAI.preview.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `
        Eres Yasta, un asistente virtual especializado y amigable.
        
        CONTEXTO: Esta consulta llegó porque Dialogflow no pudo responderla adecuadamente.
        
        INSTRUCCIONES:
        - Responde en español de manera clara y útil
        - Mantén un tono amigable y profesional
        - Si es una pregunta técnica muy específica, sugiere contactar soporte
        - Limita tu respuesta a máximo 200 palabras
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

    // Generar respuesta
    const result = await model.generateContent(queryText);
    const response = result.response;

    console.log(
      "🔍 Respuesta cruda de Vertex AI:",
      JSON.stringify(response, null, 2)
    );

    // Extraer texto de forma robusta
    const generatedText = extractTextFromResponse(response);

    console.log("✅ Texto extraído:", generatedText.substring(0, 100) + "...");

    if (!generatedText || generatedText.length === 0) {
      throw new Error("Vertex AI no generó texto válido");
    }

    // Responder a Dialogflow
    const dialogflowResponse = {
      fulfillmentText: generatedText,
      source: "vertex-ai",
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

    // Log detallado del error para debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    const errorResponse = {
      fulfillmentText:
        "Disculpa, tengo problemas técnicos en este momento. ¿Podrías reformular tu pregunta?",
      source: "vertex-webhook-error",
    };

    return NextResponse.json(errorResponse);
  }
}

/**
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Health check del webhook Vertex AI");

    // Probar una consulta simple
    const model = vertexAI.preview.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const testResult = await model.generateContent("Test de conexión");
    const testText = extractTextFromResponse(testResult.response);

    return NextResponse.json({
      status: "healthy",
      service: "vertex-ai-webhook",
      timestamp: new Date().toISOString(),
      project: projectId,
      model: "gemini-1.5-flash",
      ready: true,
      test_response: testText.substring(0, 50) + "...",
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
        project: projectId,
      },
      { status: 500 }
    );
  }
}
