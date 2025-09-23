"use client";
import TextToSpeechGCP from "./TextToSpeechGCP";

interface ResponseDisplayProps {
  message: string;
  isProcessing: boolean;
  autoSpeak?: boolean;
}

export default function ResponseDisplay({
  message,
  isProcessing,
  autoSpeak = false,
}: ResponseDisplayProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border-2 border-teal-500/40 shadow-2xl rounded-3xl mb-8">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <TextToSpeechGCP
            text={message}
            autoPlay={autoSpeak}
            voiceType="femaleLatina"
          />
          <span className="text-2xl text-teal-300 font-bold ml-4">Sofía:</span>
        </div>
        <p className="text-xl text-teal-100 leading-relaxed text-center max-w-3xl mx-auto">
          {isProcessing ? "Procesando tu mensaje..." : message}
        </p>
        {isProcessing && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
          </div>
        )}
      </div>
    </div>
  );
}
