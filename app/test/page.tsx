"use client";

import { useState, useRef } from "react";
import { DialogflowResponse } from "@/lib/services/dialogflow";

interface TranscriptionResult {
  transcript: string;
  confidence: number;
  dialogflow: DialogflowResponse;
}

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError("");
    } catch (err) {
      setError("Error al acceder al micrófono");
      console.error("Error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data: TranscriptionResult = await response.json();
      setResult(data);
    } catch (err) {
      setError("Error al procesar el audio");
      console.error("Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetChat = () => {
    setResult(null);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Chat de Voz</h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Botón de grabación */}
        <div className="flex space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-200 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-blue-500 hover:bg-blue-600"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isRecording ? "🔴 Detener" : "🎤 Grabar"}
          </button>

          <button
            onClick={resetChat}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
          >
            🗑️ Limpiar
          </button>
        </div>

        {/* Estado */}
        {isRecording && (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span>Grabando...</span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Procesando audio...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Resultado */}
        {result && (
          <div className="w-full space-y-4">
            {/* Transcripción */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">
                Tu mensaje (confianza: {Math.round(result.confidence * 100)}%):
              </h3>
              <p className="text-gray-700">{result.transcript}</p>
            </div>

            {/* Respuesta de Dialogflow */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">
                Respuesta ({result.dialogflow.intent}):
              </h3>
              <p className="text-gray-700">
                {result.dialogflow.fulfillmentText}
              </p>

              {/* Parámetros adicionales */}
              {result.dialogflow.parameters &&
                Object.keys(result.dialogflow.parameters).length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-green-600">
                      Ver parámetros detectados
                    </summary>
                    <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
                      {JSON.stringify(result.dialogflow.parameters, null, 2)}
                    </pre>
                  </details>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
