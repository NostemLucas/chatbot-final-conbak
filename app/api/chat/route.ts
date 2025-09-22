import { NextRequest, NextResponse } from "next/server";
import { DialogflowService } from "@/lib/services/dialogflow";

const dialogflowService = new DialogflowService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;
    console.log('body ', body);
    // Validar que se proporcione el texto
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "No se proporcionó texto válido" },
        { status: 400 }
      );
    }

    // Usar sessionId por defecto ya que no se envía desde el frontend
    const finalSessionId = "default-session";

    // Enviar texto directamente a Dialogflow
    const dialogflowResponse = await dialogflowService.processText(
      message.trim(),
      finalSessionId
    );
    console.log(dialogflowResponse);
    return NextResponse.json({
      transcipt: message.trim(),
      confidence: 1,
      dialogflow: dialogflowResponse,
    });
  } catch (error) {
    console.error("Error en API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
export interface DialogflowResponse {
  queryText: string;
  fulfillmentText: string;
  intent: string;   
  confidence: number;
}

export interface DialogflowConfig {
  projectId?: string;
  languageCode?: string;
}