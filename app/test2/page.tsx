"use client";

import { useState, useRef, useEffect } from "react";

interface DialogflowResponse {
  intent: string;
  fulfillmentText: string;
  parameters?: any;
}

interface TranscriptionResult {
  transcript: string;
  confidence: number;
  dialogflow: DialogflowResponse;
}

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string>("");
  const [lastCommand, setLastCommand] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Palabras clave para activar Sofia
  const wakeWords = ["sofia", "sofía", "hey sofia", "oye sofia", "hola sofia"];

  useEffect(() => {
    // Verificar si el navegador soporta Web Speech API
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      initializeContinuousListening();
    } else {
      setError("Tu navegador no soporta reconocimiento de voz");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const initializeContinuousListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      // Verificar si se detectó alguna palabra clave
      if (finalTranscript) {
        const hasWakeWord = wakeWords.some((word) =>
          finalTranscript.includes(word.toLowerCase())
        );

        if (hasWakeWord && !isRecording) {
          setLastCommand(`Detectado: "${finalTranscript.trim()}"`);
          startRecordingAfterWakeWord();
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Error en reconocimiento:", event.error);
      if (event.error !== "no-speech") {
        setError(`Error en reconocimiento: ${event.error}`);
      }

      // Reintentar después de un error
      setTimeout(() => {
        if (!isRecording) {
          startContinuousListening();
        }
      }, 1000);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Reiniciar automáticamente si no estamos grabando
      if (!isRecording) {
        setTimeout(() => {
          startContinuousListening();
        }, 500);
      }
    };

    recognitionRef.current = recognition;
  };

  const startContinuousListening = () => {
    if (recognitionRef.current && !isListening && !isRecording) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error al iniciar reconocimiento:", err);
      }
    }
  };

  const stopContinuousListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const startRecordingAfterWakeWord = async () => {
    // Detener la escucha continua
    stopContinuousListening();

    // Esperar un momento antes de empezar a grabar
    setTimeout(async () => {
      await startRecording();

      // Configurar timeout para detener automáticamente después de 10 segundos de silencio
      timeoutRef.current = setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 10000);
    }, 500);
  };

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
      // Reiniciar escucha continua si hay error
      startContinuousListening();
    }
  };

  const stopRecording = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

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
      const data: TranscriptionResult = await response.json();

      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      speakResponse(data.dialogflow.fulfillmentText);
      setResult(data);
    } catch (err) {
      setError("Error al procesar el audio");
      console.error("Error:", err);
    } finally {
      setIsProcessing(false);
      // Reiniciar escucha continua después de procesar
      setTimeout(() => {
        startContinuousListening();
      }, 1000);
    }
  };

  const resetChat = () => {
    setResult(null);
    setError("");
    setLastCommand("");
  };

  const toggleListening = () => {
    if (isListening) {
      stopContinuousListening();
    } else {
      startContinuousListening();
    }
  };

  function speakResponse(text: string) {
    if (!("speechSynthesis" in window)) {
      console.warn("Tu navegador no soporta Speech Synthesis");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 1; // velocidad normal
    utterance.pitch = 1;

    // (Opcional) seleccionar una voz específica en español
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.startsWith("es"));
    if (spanishVoice) utterance.voice = spanishVoice;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Sofia - Asistente de Voz
      </h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Estado de escucha continua */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-full font-semibold text-white transition-all duration-200 ${
              isListening
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {isListening ? "🔊 Escuchando..." : "🔇 Activar Escucha"}
          </button>

          <button
            onClick={resetChat}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
          >
            🗑️ Limpiar
          </button>
        </div>

        {/* Indicadores visuales */}
        <div className="text-center space-y-2">
          {isListening && !isRecording && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              <span>Esperando "Hey Sofia"...</span>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span>Grabando tu mensaje...</span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Procesando audio...</span>
            </div>
          )}
        </div>

        {/* Último comando detectado */}
        {lastCommand && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <span className="text-sm text-yellow-800">{lastCommand}</span>
          </div>
        )}

        {/* Controles manuales */}
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
            {isRecording ? "🔴 Detener" : "🎤 Grabar Manual"}
          </button>
        </div>

        {/* Instrucciones */}
        <div className="text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-md">
          <p>
            <strong>Cómo usar:</strong>
          </p>
          <p>1. Activa la escucha con el botón verde</p>
          <p>2. Di "Hey Sofia", "Sofia" o "Hola Sofia"</p>
          <p>3. Sofia empezará a grabar automáticamente</p>
          <p>4. Habla tu mensaje y se detendrá automáticamente</p>
        </div>

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
                Respuesta de Sofia ({result.dialogflow.intent}):
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
