import { NextRequest, NextResponse } from "next/server";
import { DialogflowService } from "@/lib/services/dialogflow";

const dialogflowService = new DialogflowService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    console.log(body);
    // Validar que se proporcione el texto
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "No se proporcionó texto válido" },
        { status: 400 }
      );
    }

    // Usar sessionId por defecto ya que no se envía desde el frontend
    const finalSessionId = "default-session";

    // Enviar texto directamente a Dialogflow
    const dialogflowResponse = await dialogflowService.processText(
      text.trim(),
      finalSessionId
    );
    console.log(dialogflowResponse);
    return NextResponse.json({
      transcipt: text.trim(),
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
