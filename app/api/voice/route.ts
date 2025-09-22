import { NextRequest, NextResponse } from "next/server";
import { SpeechToTextService } from "@/lib/services/speech-to-text";
import { DialogflowService } from "@/lib/services/dialogflow";

const speechService = new SpeechToTextService();
const dialogflowService = new DialogflowService();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const sessionId =
      (formData.get("sessionId") as string) || "default-session";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No se proporcionó archivo de audio" },
        { status: 400 }
      );
    }

    // Convertir File a Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Transcribir audio
    const speechResult = await speechService.speechToText(audioBuffer, {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000,
      languageCode: "es-ES",
      enableAutomaticPunctuation: true,
    });

    if (!speechResult.success) {
      return NextResponse.json({ error: speechResult.error }, { status: 500 });
    }

    // Enviar transcripción a Dialogflow
    const dialogflowResponse = await dialogflowService.processText(
      speechResult.transcript,
      sessionId
    );

    return NextResponse.json({
      transcript: speechResult.transcript,
      confidence: speechResult.confidence,
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
