"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Radio, Sparkles } from "lucide-react";

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

// Componente de progreso circular pequeño
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
        stroke="rgba(20, 184, 166, 0.2)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#14b8a6"
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

// Componente principal - TopBar
interface VoiceTopBarProps {
  onIntentDetected?: (intent: string, response: string) => void;
  onStateChange?: (
    state: "idle" | "listening" | "recording" | "processing" | "speaking"
  ) => void;
}

export default function VoiceTopBar({
  onIntentDetected,
  onStateChange,
}: VoiceTopBarProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [error, setError] = useState<string>("");

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
        setTimeout(() => {
          startContinuousListening();
        }, 2000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);

      if (!isRecording && !isProcessing && !isPlayingAudio) {
        setTimeout(() => {
          startContinuousListening();
        }, 1000);
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
        throw new Error(`Error: ${response.status}`);
      }

      const data: TranscriptionResult = await response.json();

      setIsProcessing(false);

      // Notificar al padre sobre el intent detectado
      onIntentDetected?.(
        data.dialogflow.intent,
        data.dialogflow.fulfillmentText
      );

      if (data.dialogflow.fulfillmentText) {
        await speakResponse(data.dialogflow.fulfillmentText);
      }

      restartListening();
    } catch (err) {
      setError("Error procesando");
      setIsProcessing(false);
      restartListening();
    }
  };

  const speakResponse = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
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

        utterance.onerror = () => {
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

  const restartListening = (): void => {
    cleanupTimers();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsRecording(false);
    setIsProcessing(false);
    setIsPlayingAudio(false);
    setTimeLeft(5);

    restartListeningTimeoutRef.current = setTimeout(() => {
      initializeContinuousListening();
    }, 1000);
  };

  const toggleListening = (): void => {
    if (isListening) {
      stopContinuousListening();
    } else {
      startContinuousListening();
    }
  };

  const manualRecord = (): void => {
    if (!isRecording && !isProcessing && !isPlayingAudio) {
      stopContinuousListening();
      startRecording();
    } else if (isRecording) {
      stopRecording();
    }
  };

  return (
    <div className="w-full bg-slate-800/80 backdrop-blur-xl border-b border-teal-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Marca */}
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-teal-400" />
            <span className="text-lg font-bold text-teal-100">Sof-IA</span>
          </div>

          {/* Controles de voz */}
          <div className="flex items-center space-x-4">
            {/* Botón de activar/desactivar escucha */}
            <button
              onClick={toggleListening}
              disabled={isRecording || isProcessing || isPlayingAudio}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 ${
                isListening
                  ? "bg-gradient-to-br from-teal-500 to-cyan-600"
                  : "bg-gradient-to-br from-slate-600 to-slate-700"
              }`}
              title={isListening ? "Desactivar escucha" : "Activar escucha"}
            >
              {isListening ? (
                <Radio className="w-5 h-5 text-white" />
              ) : (
                <Radio className="w-5 h-5 text-white opacity-50" />
              )}

              {/* Indicador en vivo */}
              {isListening &&
                !isRecording &&
                !isProcessing &&
                !isPlayingAudio && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                )}
            </button>

            {/* Botón principal de micrófono */}
            <button
              onClick={manualRecord}
              disabled={isProcessing || isPlayingAudio}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 ${
                isRecording
                  ? "bg-gradient-to-br from-red-500 to-red-600 animate-pulse"
                  : isProcessing
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : isPlayingAudio
                  ? "bg-gradient-to-br from-green-500 to-green-600"
                  : "bg-gradient-to-br from-teal-500 to-cyan-600"
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
                  size={48}
                  strokeWidth={2}
                />
              )}

              {/* Iconos según estado */}
              {isRecording ? (
                <Mic className="w-6 h-6 text-white animate-pulse" />
              ) : isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlayingAudio ? (
                <Volume2 className="w-6 h-6 text-white animate-pulse" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Indicador de tiempo durante grabación */}
            {isRecording && (
              <div className="text-sm font-mono text-red-400 min-w-[3ch]">
                {timeLeft}s
              </div>
            )}
          </div>

          {/* Estado/Error */}
          <div className="flex items-center space-x-2 min-w-[200px] justify-end">
            {error ? (
              <span className="text-sm text-red-400">{error}</span>
            ) : isRecording ? (
              <span className="text-sm text-red-400">Grabando...</span>
            ) : isProcessing ? (
              <span className="text-sm text-blue-400">Procesando...</span>
            ) : isPlayingAudio ? (
              <span className="text-sm text-green-400">Hablando...</span>
            ) : isListening ? (
              <span className="text-sm text-teal-400">
                Esperando "Hey Sofia"
              </span>
            ) : (
              <span className="text-sm text-slate-400">Inactivo</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
