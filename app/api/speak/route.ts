// app/api/text-to-speech/route.ts
import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechService } from "@/lib/services/text-to-speech";

const ttsService = new TextToSpeechService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceType } = body;

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const ttsResult = await ttsService.speak(text, voiceType || "femaleLatina");

    if (!ttsResult.success || !ttsResult.audioContent) {
      return NextResponse.json(
        { error: ttsResult.error || "Error generating audio" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      audioContent: ttsResult.audioContent.toString("base64"),
      mimeType: "audio/mpeg",
    });
  } catch (error) {
    console.error("Error in Text-to-Speech API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve available voices
export async function GET() {
  try {
    const availableVoices = ttsService.getAvailableVoices();

    // Get detailed info for each voice
    const voicesInfo = availableVoices.map((voiceType) => ({
      key: voiceType,
      info: ttsService.getVoiceInfo(voiceType as any),
    }));

    return NextResponse.json({
      success: true,
      voices: voicesInfo,
    });
  } catch (error) {
    console.error("Error getting available voices:", error);
    return NextResponse.json(
      { error: "Error retrieving voices" },
      { status: 500 }
    );
  }
}
