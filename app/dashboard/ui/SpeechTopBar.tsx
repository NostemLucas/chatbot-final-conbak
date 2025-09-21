"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Radio, Sparkles, Zap } from "lucide-react";

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

// Estados que se pasan al padre
export type VoiceState =
  | "idle"
  | "listening"
  | "recording"
  | "processing"
  | "speaking";

export interface VoiceStateData {
  state: VoiceState;
  isListening: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  recordingTimeLeft?: number;
  lastTranscript?: string;
  lastIntent?: string;
  error?: string;
}

// Componente de progreso circular mejorado
interface CircularProgressProps {
  progress: number;
  size: number;
  strokeWidth: number;
}

function CircularProgress({
  progress,
  size,
  strokeWidth,
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
        stroke="rgba(20, 184, 166, 0.15)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300 ease-out drop-shadow-sm"
        style={{
          transformOrigin: `${size / 2}px ${size / 2}px`,
          transform: "rotate(-90deg)",
          filter: "drop-shadow(0 0 2px rgba(20, 184, 166, 0.5))",
        }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Componente de ondas de audio
function AudioWaves({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex space-x-1">
        <div
          className="w-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-pulse"
          style={{ height: "8px", animationDelay: "0ms" }}
        />
        <div
          className="w-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-pulse"
          style={{ height: "12px", animationDelay: "150ms" }}
        />
        <div
          className="w-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-pulse"
          style={{ height: "6px", animationDelay: "300ms" }}
        />
        <div
          className="w-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-pulse"
          style={{ height: "10px", animationDelay: "450ms" }}
        />
      </div>
    </div>
  );
}

// Componente principal - TopBar
interface VoiceTopBarProps {
  // Estados controlados por el padre
  isListening?: boolean;
  isRecording?: boolean;
  isProcessing?: boolean;
  isSpeaking?: boolean;
  handleResponse: (intent: string) => void;
  // Callbacks para notificar al padre
  onIntentDetected?: (intent: string, response: string) => void;
  onStateChange?: (stateData: VoiceStateData) => void;
  onListeningToggle?: () => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;

  className?: string;
}

export default function VoiceTopBar({
  isListening: parentIsListening,
  isRecording: parentIsRecording,
  isProcessing: parentIsProcessing,
  isSpeaking: parentIsSpeaking,
  onIntentDetected,
  onStateChange,
  handleResponse,
  onListeningToggle,
  onRecordingStart,
  onRecordingStop,
  className = "",
}: VoiceTopBarProps) {
  // Estados internos (solo para lógica interna)
  const [internalIsListening, setInternalIsListening] =
    useState<boolean>(false);
  const [internalIsRecording, setInternalIsRecording] =
    useState<boolean>(false);
  const [internalIsProcessing, setInternalIsProcessing] =
    useState<boolean>(false);
  const [internalIsSpeaking, setInternalIsSpeaking] = useState<boolean>(false);

  // Estados actuales (controlados por el padre si se proporcionan)
  const isListening = parentIsListening ?? internalIsListening;
  const isRecording = parentIsRecording ?? internalIsRecording;
  const isProcessing = parentIsProcessing ?? internalIsProcessing;
  const isPlayingAudio = parentIsSpeaking ?? internalIsSpeaking;
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [error, setError] = useState<string>("");
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const [lastIntent, setLastIntent] = useState<string>("");

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

  // Determinar estado actual
  const getCurrentState = (): VoiceState => {
    if (isRecording) return "recording";
    if (isProcessing) return "processing";
    if (isPlayingAudio) return "speaking";
    if (isListening) return "listening";
    return "idle";
  };

  // Notificar cambios de estado al padre
  const notifyStateChange = () => {
    const stateData: VoiceStateData = {
      state: getCurrentState(),
      isListening,
      isRecording,
      isProcessing,
      isSpeaking: isPlayingAudio,
      recordingTimeLeft: isRecording ? timeLeft : undefined,
      lastTranscript: lastTranscript || undefined,
      lastIntent: lastIntent || undefined,
      error: error || undefined,
    };
    onStateChange?.(stateData);
  };

  useEffect(() => {
    notifyStateChange();
  }, [
    isRecording,
    isProcessing,
    isPlayingAudio,
    isListening,
    timeLeft,
    error,
    lastTranscript,
    lastIntent,
  ]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      initializeContinuousListening();
    }

    return () => {
      cleanupRecognition();
      cleanupTimers();
    };
  }, []);

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
      setInternalIsListening(true);
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
        setLastTranscript(finalTranscript.trim());

        const hasWakeWord = wakeWords.some((word) =>
          finalTranscript.includes(word.toLowerCase())
        );

        if (hasWakeWord && !isRecording && !isProcessing && !isPlayingAudio) {
          startRecordingAfterWakeWord();
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (!["no-speech", "aborted", "network"].includes(event.error)) {
        setError(`Error: ${event.error}`);
      }

      if (!isRecording && !isProcessing && !isPlayingAudio) {
        // Reinicio más rápido después de error
        setTimeout(() => {
          startContinuousListening();
        }, 1000); // Reducido de 2000ms a 1000ms
      }
    };

    recognition.onend = () => {
      setInternalIsListening(false);

      if (!isRecording && !isProcessing && !isPlayingAudio) {
        // Reducir delay para reinicio más rápido
        setTimeout(() => {
          startContinuousListening();
        }, 500); // Reducido de 1000ms a 500ms
      }
    };

    recognitionRef.current = recognition;
  };

  const startContinuousListening = (): void => {
    if (isRecording || isProcessing || isPlayingAudio) {
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Reinicio más rápido después de error
        setTimeout(() => {
          initializeContinuousListening();
        }, 1000); // Reducido de 2000ms a 1000ms
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
    setError("");
    await startRecording();
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
          setError("Sin audio");
          setInternalIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setInternalIsRecording(true);
      onRecordingStart?.(); // Notificar al padre
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
      setError("Error micrófono");
      restartListening();
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
      setInternalIsRecording(false);
      onRecordingStop?.(); // Notificar al padre
      setInternalIsProcessing(true);
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
        throw new Error(`Error: ${response.status}`);
      }

      const data: TranscriptionResult = await response.json();

      setInternalIsProcessing(false);
      setLastIntent(data.dialogflow.intent);

      // Notificar al padre sobre el intent detectado
      onIntentDetected?.(
        data.dialogflow.intent,
        data.dialogflow.fulfillmentText
      );

      handleResponse(data.dialogflow.intent);
      if (data.dialogflow.fulfillmentText) {
        await speakResponse(data.dialogflow.fulfillmentText);
      }

      // Reiniciar inmediatamente después de hablar
      setTimeout(() => {
        restartListening();
      }, 100);
    } catch (err) {
      setError("Error procesando");
      setInternalIsProcessing(false);
      restartListening();
    }
  };

  const speakResponse = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }

      setInternalIsSpeaking(true);

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
          setInternalIsSpeaking(false);
          resolve();
        };

        utterance.onerror = () => {
          setInternalIsSpeaking(false);
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

  const restartListening = (): void => {
    cleanupTimers();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setInternalIsRecording(false);
    setInternalIsProcessing(false);
    setInternalIsSpeaking(false);
    setTimeLeft(5);

    restartListeningTimeoutRef.current = setTimeout(() => {
      initializeContinuousListening();
    }, 500); // Reducido de 1000ms a 500ms para reinicio más rápido
  };

  const toggleListening = (): void => {
    if (onListeningToggle) {
      onListeningToggle(); // Delegar al padre
    } else {
      // Fallback si no hay padre controlando
      if (isListening) {
        stopContinuousListening();
      } else {
        startContinuousListening();
      }
    }
  };

  const manualRecord = (): void => {
    if (!isRecording && !isProcessing && !isPlayingAudio) {
      if (onRecordingStart) {
        onRecordingStart(); // Notificar al padre
      } else {
        // Fallback si no hay padre controlando
        stopContinuousListening();
        startRecording();
      }
    } else if (isRecording) {
      if (onRecordingStop) {
        onRecordingStop(); // Notificar al padre
      } else {
        // Fallback si no hay padre controlando
        stopRecording();
      }
    }
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-slate-800/90 via-slate-800/95 to-slate-800/90 backdrop-blur-xl border-b border-teal-500/20 shadow-xl ${className}`}
    >
      {/* Línea superior decorativa */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Marca con efectos mejorados */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
                {/* Brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg animate-pulse"></div>
              </div>
              {/* Aura de resplandor */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-cyan-500/30 rounded-lg blur-md -z-10 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Sof-IA
              </span>
              <span className="text-xs text-slate-400 -mt-1">
                Asistente Virtual
              </span>
            </div>
          </div>

          {/* Controles de voz mejorados */}
          <div className="flex items-center space-x-6">
            {/* Botón de activar/desactivar escucha */}
            <div className="relative">
              <button
                onClick={toggleListening}
                disabled={isRecording || isProcessing || isPlayingAudio}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 border-2 ${
                  isListening
                    ? "bg-gradient-to-br from-teal-500/20 to-cyan-600/20 border-teal-400/50 shadow-teal-400/25"
                    : "bg-gradient-to-br from-slate-600/20 to-slate-700/20 border-slate-500/50"
                }`}
                title={isListening ? "Desactivar escucha" : "Activar escucha"}
              >
                <Radio
                  className={`w-5 h-5 transition-colors ${
                    isListening ? "text-teal-300" : "text-slate-400"
                  }`}
                />

                {/* Ondas de audio cuando está escuchando */}
                <AudioWaves
                  isActive={
                    isListening &&
                    !isRecording &&
                    !isProcessing &&
                    !isPlayingAudio
                  }
                />

                {/* Indicador en vivo mejorado */}
                {isListening &&
                  !isRecording &&
                  !isProcessing &&
                  !isPlayingAudio && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                    </>
                  )}
              </button>
            </div>

            {/* Botón principal de micrófono mejorado */}
            <div className="relative">
              <button
                onClick={manualRecord}
                disabled={isProcessing || isPlayingAudio}
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 border-2 ${
                  isRecording
                    ? "bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-400/60 shadow-red-400/30 animate-pulse"
                    : isProcessing
                    ? "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/60 shadow-blue-400/30"
                    : isPlayingAudio
                    ? "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/60 shadow-green-400/30"
                    : "bg-gradient-to-br from-teal-500/20 to-cyan-600/20 border-teal-400/60 shadow-teal-400/30"
                }`}
                title={
                  isRecording
                    ? "Grabando... (click para detener)"
                    : isProcessing
                    ? "Procesando..."
                    : isPlayingAudio
                    ? "Hablando..."
                    : "Grabar mensaje"
                }
              >
                {/* Progreso circular durante grabación */}
                {isRecording && (
                  <CircularProgress
                    progress={progress}
                    size={56}
                    strokeWidth={3}
                  />
                )}

                {/* Efectos de fondo dinámicos */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    isRecording
                      ? "bg-gradient-to-br from-red-500/10 to-red-600/10"
                      : isProcessing
                      ? "bg-gradient-to-br from-blue-500/10 to-blue-600/10"
                      : isPlayingAudio
                      ? "bg-gradient-to-br from-green-500/10 to-green-600/10"
                      : "bg-gradient-to-br from-teal-500/10 to-cyan-600/10"
                  }`}
                />

                {/* Iconos según estado */}
                {isRecording ? (
                  <Mic className="w-7 h-7 text-red-400 animate-pulse relative z-10" />
                ) : isProcessing ? (
                  <div className="relative z-10">
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <Zap className="absolute inset-0 w-3 h-3 text-blue-400 animate-pulse m-1.5" />
                  </div>
                ) : isPlayingAudio ? (
                  <Volume2 className="w-7 h-7 text-green-400 animate-pulse relative z-10" />
                ) : (
                  <Mic className="w-7 h-7 text-teal-300 relative z-10" />
                )}

                {/* Auras de resplandor según estado */}
                <div
                  className={`absolute inset-0 rounded-2xl blur-lg -z-10 transition-all duration-300 ${
                    isRecording
                      ? "bg-gradient-to-br from-red-400/20 to-red-500/20 animate-pulse"
                      : isProcessing
                      ? "bg-gradient-to-br from-blue-400/20 to-blue-500/20 animate-pulse"
                      : isPlayingAudio
                      ? "bg-gradient-to-br from-green-400/20 to-green-500/20 animate-pulse"
                      : "bg-gradient-to-br from-teal-400/20 to-cyan-500/20"
                  }`}
                />
              </button>

              {/* Indicador de tiempo durante grabación mejorado */}
              {isRecording && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="px-2 py-1 bg-red-900/80 border border-red-500/50 rounded-lg backdrop-blur-sm">
                    <span className="text-xs font-mono text-red-300">
                      {timeLeft}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estado/Error mejorado */}
          <div className="flex items-center space-x-3 min-w-[220px] justify-end">
            {/* Indicador visual de estado */}
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                error
                  ? "bg-red-400 animate-pulse"
                  : isRecording
                  ? "bg-red-400 animate-ping"
                  : isProcessing
                  ? "bg-blue-400 animate-pulse"
                  : isPlayingAudio
                  ? "bg-green-400 animate-pulse"
                  : isListening
                  ? "bg-teal-400 animate-ping"
                  : "bg-slate-500"
              }`}
            />

            {/* Texto de estado */}
            <div className="text-right">
              <div
                className={`text-sm font-medium transition-colors duration-300 ${
                  error
                    ? "text-red-400"
                    : isRecording
                    ? "text-red-400"
                    : isProcessing
                    ? "text-blue-400"
                    : isPlayingAudio
                    ? "text-green-400"
                    : isListening
                    ? "text-teal-400"
                    : "text-slate-400"
                }`}
              >
                {error
                  ? error
                  : isRecording
                  ? "Grabando..."
                  : isProcessing
                  ? "Procesando..."
                  : isPlayingAudio
                  ? "Hablando..."
                  : isListening
                  ? "Esperando..."
                  : "Inactivo"}
              </div>

              {/* Subtexto informativo */}
              {isListening &&
                !isRecording &&
                !isProcessing &&
                !isPlayingAudio && (
                  <div className="text-xs text-teal-300/70">Di "Hey Sofia"</div>
                )}

              {lastTranscript && !isRecording && !isProcessing && (
                <div className="text-xs text-slate-400 max-w-[150px] truncate">
                  "{lastTranscript}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Línea inferior decorativa */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"></div>
    </div>
  );
}
