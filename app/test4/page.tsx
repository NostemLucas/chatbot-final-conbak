"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Bot, Sparkles } from "lucide-react";

// Interfaces
interface DialogflowResponse {
  intent: string;
  fulfillmentText: string;
  parameters?: Record<string, unknown>;
}

interface TranscriptionResult {
  transcript: string;
  confidence: number;
  dialogflow: DialogflowResponse;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// Componente de progreso circular
interface CircularProgressProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
}

function CircularProgress({
  progress,
  size,
  strokeWidth,
  color,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="absolute inset-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300 ease-out"
        style={{
          transformOrigin: `${size / 2}px ${size / 2}px`,
          transform: "rotate(-90deg)",
        }}
      />
    </svg>
  );
}

// Componente Modal de Grabación
interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  timeLeft: number;
  progress: number;
  onStopRecording: () => void;
  result: TranscriptionResult | null;
  error: string;
  isPlayingAudio: boolean;
}

function VoiceModal({
  isOpen,
  onClose,
  isRecording,
  isProcessing,
  timeLeft,
  progress,
  onStopRecording,
  result,
  error,
  isPlayingAudio,
}: VoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800/95 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-10 max-w-lg w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-teal-400 mr-3" />
            <h3 className="text-2xl font-bold text-teal-100">
              Sof-IA Escuchando
            </h3>
          </div>
        </div>

        {/* Microphone with Circular Progress */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 relative">
              {/* Progreso circular */}
              {isRecording && (
                <CircularProgress
                  progress={progress}
                  size={128}
                  strokeWidth={4}
                  color="#14b8a6"
                />
              )}

              {/* Círculo del micrófono */}
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                  isRecording
                    ? "bg-gradient-to-br from-red-500/20 to-red-600/30 border-4 border-red-400/50"
                    : isProcessing
                    ? "bg-gradient-to-br from-blue-500/20 to-blue-600/30 border-4 border-blue-400/50"
                    : isPlayingAudio
                    ? "bg-gradient-to-br from-green-500/20 to-green-600/30 border-4 border-green-400/50"
                    : "bg-gradient-to-br from-slate-600/20 to-slate-700/30 border-4 border-slate-500/50"
                }`}
              >
                {/* Efectos de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-cyan-500/10 rounded-full" />

                {/* Iconos */}
                {isProcessing ? (
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
                    <Sparkles className="absolute inset-0 w-6 h-6 text-teal-400 animate-pulse m-3" />
                  </div>
                ) : isPlayingAudio ? (
                  <Volume2 className="w-12 h-12 text-green-400 animate-pulse" />
                ) : (
                  <Mic
                    className={`w-12 h-12 ${
                      isRecording
                        ? "text-red-400 animate-pulse"
                        : "text-slate-400"
                    }`}
                  />
                )}

                {/* Ondas animadas para grabación */}
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-red-400/40 animate-ping" />
                    <div
                      className="absolute inset-0 rounded-full border border-red-300/30 animate-ping"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </>
                )}

                {/* Ondas animadas para audio */}
                {isPlayingAudio && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-green-400/40 animate-ping" />
                    <div
                      className="absolute inset-0 rounded-full border border-green-300/30 animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center mt-6">
            {isRecording && (
              <div className="space-y-2">
                <p className="text-xl font-semibold text-red-400">
                  Grabando...
                </p>
                <p className="text-sm text-slate-300">{timeLeft}s restantes</p>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-2">
                <p className="text-xl font-semibold text-blue-400">
                  Procesando...
                </p>
                <p className="text-sm text-slate-300">
                  Sof-IA está analizando tu mensaje
                </p>
              </div>
            )}

            {isPlayingAudio && (
              <div className="space-y-2">
                <p className="text-xl font-semibold text-green-400">
                  Sof-IA respondiendo...
                </p>
                <p className="text-sm text-slate-300">Escucha la respuesta</p>
              </div>
            )}

            {!isRecording && !isProcessing && !isPlayingAudio && (
              <p className="text-slate-300">Listo para grabar</p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-2xl">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && !isRecording && !isProcessing && !isPlayingAudio && (
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-blue-900/30 border border-blue-500/50 rounded-2xl">
              <p className="text-sm font-medium text-blue-300 mb-2">
                Tu mensaje:
              </p>
              <p className="text-slate-200 text-sm">{result.transcript}</p>
            </div>

            <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-2xl">
              <p className="text-sm font-medium text-green-300 mb-2">
                Respuesta:
              </p>
              <p className="text-slate-200 text-sm">
                {result.dialogflow.fulfillmentText}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {isRecording && (
            <button
              onClick={onStopRecording}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Detener Grabación
            </button>
          )}

          {!isRecording && !isProcessing && !isPlayingAudio && (
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente principal
interface VoiceChatProps {
  onIntentDetected?: (intent: string, response: string) => void;
  onStateChange?: (
    state: "idle" | "listening" | "recording" | "processing" | "speaking"
  ) => void;
}

export default function VoiceChat({
  onIntentDetected,
  onStateChange,
}: VoiceChatProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string>("");
  const [lastCommand, setLastCommand] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const restartListeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Palabras clave para activar Sofia
  const wakeWords: string[] = [
    "sofia",
    "sofía",
    "hey sofia",
    "oye sofia",
    "hola sofia",
  ];

  // Calcular progreso de grabación
  const progress = ((5 - timeLeft) / 5) * 100;

  // Notificar cambios de estado al padre
  const notifyStateChange = (
    state: "idle" | "listening" | "recording" | "processing" | "speaking"
  ) => {
    onStateChange?.(state);
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      initializeContinuousListening();
    } else {
      setError("Tu navegador no soporta reconocimiento de voz");
    }

    return () => {
      cleanupRecognition();
      cleanupTimers();
    };
  }, []);

  useEffect(() => {
    // Notificar estado actual
    if (isRecording) {
      notifyStateChange("recording");
    } else if (isProcessing) {
      notifyStateChange("processing");
    } else if (isPlayingAudio) {
      notifyStateChange("speaking");
    } else if (isListening) {
      notifyStateChange("listening");
    } else {
      notifyStateChange("idle");
    }
  }, [isRecording, isProcessing, isPlayingAudio, isListening]);

  const cleanupRecognition = (): void => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition already stopped");
      }
      recognitionRef.current = null;
    }
  };

  const cleanupTimers = (): void => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (restartListeningTimeoutRef.current) {
      clearTimeout(restartListeningTimeoutRef.current);
      restartListeningTimeoutRef.current = null;
    }
  };

  const initializeContinuousListening = (): void => {
    cleanupRecognition();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      console.log("Recognition started");
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        console.log("Final transcript:", finalTranscript);
        const hasWakeWord = wakeWords.some((word) =>
          finalTranscript.includes(word.toLowerCase())
        );

        if (
          hasWakeWord &&
          !isRecording &&
          !isModalOpen &&
          !isProcessing &&
          !isPlayingAudio
        ) {
          console.log("Wake word detected!");
          setLastCommand(`Detectado: "${finalTranscript.trim()}"`);
          startRecordingAfterWakeWord();
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Recognition error:", event.error, event.message);

      if (!["no-speech", "aborted", "network"].includes(event.error)) {
        setError(`Error en reconocimiento: ${event.error}`);
      }

      if (!isRecording && !isModalOpen && !isProcessing && !isPlayingAudio) {
        setTimeout(() => {
          startContinuousListening();
        }, 2000);
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsListening(false);

      if (!isRecording && !isModalOpen && !isProcessing && !isPlayingAudio) {
        setTimeout(() => {
          startContinuousListening();
        }, 1000);
      }
    };

    recognitionRef.current = recognition;
  };

  const startContinuousListening = (): void => {
    if (isRecording || isModalOpen || isProcessing || isPlayingAudio) {
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting recognition:", err);
        setTimeout(() => {
          initializeContinuousListening();
        }, 2000);
      }
    }
  };

  const stopContinuousListening = (): void => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition already stopping");
      }
    }
  };

  const startRecordingAfterWakeWord = async (): Promise<void> => {
    stopContinuousListening();
    setIsModalOpen(true);
    setResult(null);
    setError("");

    setTimeout(async () => {
      await startRecording();
    }, 500);
  };

  const startRecording = async (): Promise<void> => {
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

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm;codecs=opus",
        });

        if (audioBlob.size > 0) {
          await processAudio(audioBlob);
        } else {
          setError("No se grabó audio");
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimeLeft(5);
      setError("");

      startCountdown();

      recordingTimeoutRef.current = setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          stopRecording();
        }
      }, 5000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Error al acceder al micrófono");
      closeModal();
    }
  };

  const startCountdown = (): void => {
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = (): void => {
    cleanupTimers();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data: TranscriptionResult = await response.json();

      setResult(data);
      setIsProcessing(false);

      // Notificar al padre sobre el intent detectado
      onIntentDetected?.(
        data.dialogflow.intent,
        data.dialogflow.fulfillmentText
      );

      if (data.dialogflow.fulfillmentText) {
        await speakResponse(data.dialogflow.fulfillmentText);
      }

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Error processing audio:", err);
      setError("Error al procesar el audio: " + (err as Error).message);
      setIsProcessing(false);

      setTimeout(() => {
        closeModal();
      }, 3000);
    }
  };

  const speakResponse = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        console.warn("Tu navegador no soporta Speech Synthesis");
        resolve();
        return;
      }

      setIsPlayingAudio(true);

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("es") && v.name.toLowerCase().includes("female")
          ) || voices.find((v) => v.lang.startsWith("es"));

        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        utterance.onend = () => {
          setIsPlayingAudio(false);
          resolve();
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          setIsPlayingAudio(false);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      } else {
        setVoiceAndSpeak();
      }
    });
  };

  const closeModal = (): void => {
    cleanupTimers();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsModalOpen(false);
    setIsRecording(false);
    setIsProcessing(false);
    setIsPlayingAudio(false);
    setTimeLeft(5);

    restartListeningTimeoutRef.current = setTimeout(() => {
      initializeContinuousListening();
    }, 2000);
  };

  const toggleListening = (): void => {
    if (isListening) {
      stopContinuousListening();
    } else {
      startContinuousListening();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          {/* Botón principal de micrófono */}
          <div className="relative">
            <button
              onClick={toggleListening}
              disabled={isRecording || isProcessing || isPlayingAudio}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 animate-pulse"
                  : "bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800"
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
            </button>

            {/* Indicador de actividad */}
            {isListening && !isModalOpen && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-teal-400/40 animate-ping" />
                <div
                  className="absolute inset-0 rounded-full border border-teal-300/30 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}
          </div>

          {/* Estado actual */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Bot className="w-6 h-6 text-teal-400" />
              <span className="text-lg font-semibold text-teal-100">
                Sof-IA
              </span>
            </div>

            {isListening &&
              !isModalOpen &&
              !isRecording &&
              !isProcessing &&
              !isPlayingAudio && (
                <p className="text-teal-300">Esperando "Hey Sofia"...</p>
              )}

            {(isRecording || isProcessing || isPlayingAudio) && (
              <p className="text-cyan-300">Sofia está ocupada...</p>
            )}

            {!isListening &&
              !isRecording &&
              !isProcessing &&
              !isPlayingAudio && (
                <p className="text-slate-400">Toca el micrófono para activar</p>
              )}
          </div>

          {/* Último comando detectado */}
          {lastCommand && (
            <div className="p-3 bg-teal-900/30 border border-teal-500/50 rounded-2xl max-w-md">
              <p className="text-sm text-teal-200 text-center">{lastCommand}</p>
            </div>
          )}

          {/* Error global */}
          {error && !isModalOpen && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-2xl max-w-md">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Instrucciones */}
          <div className="text-sm text-slate-300 text-center p-4 bg-slate-700/30 rounded-2xl max-w-md">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4 text-teal-400 mr-2" />
              <span className="font-semibold">Cómo usar Sof-IA</span>
            </div>
            <div className="space-y-1 text-xs">
              <p>1. Activa el micrófono</p>
              <p>2. Di "Hey Sofia" o "Hola Sofia"</p>
              <p>3. Habla tu pregunta</p>
              <p>4. Escucha la respuesta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de grabación */}
      <VoiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isRecording={isRecording}
        isProcessing={isProcessing}
        timeLeft={timeLeft}
        progress={progress}
        onStopRecording={stopRecording}
        result={result}
        error={error}
        isPlayingAudio={isPlayingAudio}
      />
    </div>
  );
}
