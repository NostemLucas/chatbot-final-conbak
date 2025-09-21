import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  Radio,
  Sparkles,
  Settings,
  X,
  Send,
  Loader2,
} from "lucide-react";

// Interfaces existentes
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

// Componente de ondas de audio
function AudioWaves({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex space-x-0.5">
        {[0, 150, 300, 450].map((delay, index) => (
          <div
            key={index}
            className="w-0.5 bg-gradient-to-t from-teal-500/60 to-cyan-400/60 rounded-full animate-pulse"
            style={{
              height: `${4 + (index % 2) * 2}px`,
              animationDelay: `${delay}ms`,
              animationDuration: "1.5s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Componente Modal
interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendAudio: (audioBlob: Blob) => Promise<void>;
  onSendText: (text: string) => Promise<void>;
  isProcessing: boolean;
}

function VoiceModal({
  isOpen,
  onClose,
  onSendAudio,
  onSendText,
  isProcessing,
}: VoiceModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [mode, setMode] = useState<"voice" | "text">("voice");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setTextInput("");
      setRecordingTime(0);
      setMode("voice");
    }
  }, [isOpen]);

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
          await onSendAudio(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Contador de tiempo
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleSendText = async () => {
    if (textInput.trim()) {
      await onSendText(textInput.trim());
      setTextInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Sofia Asistente
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="p-6 border-b border-slate-700/30">
          <div className="flex bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setMode("voice")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "voice"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <Mic className="w-4 h-4 inline mr-2" />
              Voz
            </button>
            <button
              onClick={() => setMode("text")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                mode === "text"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Texto
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === "voice" ? (
            // Modo Voz
            <div className="text-center">
              <div className="mb-6">
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500/20 border-2 border-red-400 animate-pulse"
                      : "bg-teal-500/20 border-2 border-teal-400"
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                  ) : (
                    <Mic
                      className={`w-8 h-8 ${
                        isRecording ? "text-red-400" : "text-teal-400"
                      }`}
                    />
                  )}
                </div>

                {isRecording && (
                  <div className="mt-4 text-red-400 font-mono text-lg">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-slate-300 text-sm">
                  {isRecording
                    ? "Grabando... Habla ahora"
                    : isProcessing
                    ? "Procesando tu mensaje..."
                    : "Presiona para grabar tu mensaje"}
                </p>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    isRecording
                      ? "bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30"
                      : "bg-teal-500/20 border border-teal-400/50 text-teal-300 hover:bg-teal-500/30"
                  } disabled:opacity-50`}
                >
                  {isRecording ? "Detener Grabación" : "Grabar Mensaje"}
                </button>
              </div>
            </div>
          ) : (
            // Modo Texto
            <div className="space-y-4">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                disabled={isProcessing}
                className="w-full h-32 bg-slate-800/50 border border-slate-600/50 rounded-lg p-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
                maxLength={500}
              />

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">
                  {textInput.length}/500 caracteres
                </span>

                <button
                  onClick={handleSendText}
                  disabled={!textInput.trim() || isProcessing}
                  className="flex items-center gap-2 py-2 px-4 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/30 rounded-b-2xl">
          <p className="text-xs text-slate-400 text-center">
            {mode === "voice"
              ? "Tu audio será procesado y enviado automáticamente"
              : "Presiona Enter para enviar o usa el botón Enviar"}
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente principal
interface VoiceTopBarProps {
  isListening?: boolean;
  isRecording?: boolean;
  isProcessing?: boolean;
  isSpeaking?: boolean;
  handleResponse: (intent: string) => void;
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
  // Estados internos
  const [internalIsListening, setInternalIsListening] =
    useState<boolean>(false);
  const [internalIsRecording, setInternalIsRecording] =
    useState<boolean>(false);
  const [internalIsProcessing, setInternalIsProcessing] =
    useState<boolean>(false);
  const [internalIsSpeaking, setInternalIsSpeaking] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Estados actuales
  const isListening = parentIsListening ?? internalIsListening;
  const isRecording = parentIsRecording ?? internalIsRecording;
  const isProcessing = parentIsProcessing ?? internalIsProcessing;
  const isPlayingAudio = parentIsSpeaking ?? internalIsSpeaking;

  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [error, setError] = useState<string>("");
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const [lastIntent, setLastIntent] = useState<string>("");

  // Referencias
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const restartListeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wakeWords: string[] = [
    "sofia",
    "sofía",
    "hey sofia",
    "oye sofia",
    "hola sofia",
  ];

  const progress = ((5 - timeLeft) / 5) * 100;

  const getCurrentState = (): VoiceState => {
    if (isRecording) return "recording";
    if (isProcessing) return "processing";
    if (isPlayingAudio) return "speaking";
    if (isListening) return "listening";
    return "idle";
  };

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

        if (
          hasWakeWord &&
          !isRecording &&
          !isProcessing &&
          !isPlayingAudio &&
          !isModalOpen
        ) {
          // Abrir modal en lugar de grabar directamente
          setIsModalOpen(true);
          stopContinuousListening();
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (!["no-speech", "aborted", "network"].includes(event.error)) {
        setError(`Error: ${event.error}`);
      }

      if (!isRecording && !isProcessing && !isPlayingAudio && !isModalOpen) {
        setTimeout(() => {
          startContinuousListening();
        }, 1000);
      }
    };

    recognition.onend = () => {
      setInternalIsListening(false);

      if (!isRecording && !isProcessing && !isPlayingAudio && !isModalOpen) {
        setTimeout(() => {
          startContinuousListening();
        }, 500);
      }
    };

    recognitionRef.current = recognition;
  };

  const startContinuousListening = (): void => {
    if (isRecording || isProcessing || isPlayingAudio || isModalOpen) {
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        setTimeout(() => {
          initializeContinuousListening();
        }, 1000);
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

  // Función para manejar audio del modal
  const handleModalAudioSend = async (audioBlob: Blob): Promise<void> => {
    try {
      setInternalIsProcessing(true);

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

      onIntentDetected?.(
        data.dialogflow.intent,
        data.dialogflow.fulfillmentText
      );

      handleResponse(data.dialogflow.intent);

      if (data.dialogflow.fulfillmentText) {
        await speakResponse(data.dialogflow.fulfillmentText);
      }

      setIsModalOpen(false);

      setTimeout(() => {
        restartListening();
      }, 100);
    } catch (err) {
      setError("Error procesando audio");
      setInternalIsProcessing(false);
      setIsModalOpen(false);
      restartListening();
    }
  };

  // Función para manejar texto del modal
  const handleModalTextSend = async (text: string): Promise<void> => {
    try {
      setInternalIsProcessing(true);

      const response = await fetch("/api/text-to-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: DialogflowResponse = await response.json();

      setInternalIsProcessing(false);
      setLastIntent(data.intent);

      onIntentDetected?.(data.intent, data.fulfillmentText);
      handleResponse(data.intent);

      if (data.fulfillmentText) {
        await speakResponse(data.fulfillmentText);
      }

      setIsModalOpen(false);

      setTimeout(() => {
        restartListening();
      }, 100);
    } catch (err) {
      setError("Error procesando texto");
      setInternalIsProcessing(false);
      setIsModalOpen(false);
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
    }, 500);
  };

  const toggleListening = (): void => {
    if (onListeningToggle) {
      onListeningToggle();
    } else {
      if (isListening) {
        stopContinuousListening();
      } else {
        startContinuousListening();
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      restartListening();
    }, 500);
  };

  return (
    <>
      <div
        className={`w-full bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl ${className}`}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-6">
            {/* Logo compacto */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="absolute inset-0 bg-teal-400/20 rounded-lg blur-sm animate-pulse" />
              </div>

              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Sof-IA
                </h1>
                <p className="text-xs text-slate-400 leading-none">
                  Asistente Virtual
                </p>
              </div>
            </div>

            {/* Controles de voz centrales */}
            <div className="flex items-center gap-4">
              {/* Botón de escucha */}
              <button
                onClick={toggleListening}
                disabled={isRecording || isProcessing || isPlayingAudio}
                className={`relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50 border ${
                  isListening
                    ? "bg-teal-500/20 border-teal-400/50 shadow-lg shadow-teal-400/20"
                    : "bg-slate-600/20 border-slate-500/30 hover:bg-slate-500/20"
                }`}
                title={isListening ? "Desactivar escucha" : "Activar escucha"}
              >
                <Radio
                  className={`w-3.5 h-3.5 ${
                    isListening ? "text-teal-300" : "text-slate-400"
                  }`}
                />

                {/* Ondas de audio */}
                <AudioWaves
                  isActive={
                    isListening &&
                    !isRecording &&
                    !isProcessing &&
                    !isPlayingAudio
                  }
                />

                {/* Indicador live */}
                {isListening &&
                  !isRecording &&
                  !isProcessing &&
                  !isPlayingAudio && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                  )}
              </button>

              {/* Botón para abrir modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isProcessing || isPlayingAudio}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50 border-2 bg-teal-500/20 border-teal-400/60 shadow-lg shadow-teal-400/20 hover:shadow-teal-400/30"
                title="Abrir asistente"
              >
                <Mic className="w-4 h-4 text-teal-300 relative z-10" />
              </button>
            </div>

            {/* Panel de estado compacto */}
            <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    error
                      ? "bg-red-400"
                      : isRecording
                      ? "bg-red-400 animate-pulse"
                      : isProcessing
                      ? "bg-blue-400 animate-pulse"
                      : isPlayingAudio
                      ? "bg-green-400 animate-pulse"
                      : isListening
                      ? "bg-teal-400"
                      : "bg-slate-500"
                  }`}
                />

                <div className="min-w-0">
                  <div
                    className={`text-sm font-medium transition-colors duration-200 ${
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
                      ? "Error"
                      : isRecording
                      ? "Grabando"
                      : isProcessing
                      ? "Procesando"
                      : isPlayingAudio
                      ? "Hablando"
                      : isListening
                      ? "Escuchando"
                      : "Inactivo"}
                  </div>

                  {/* Subtexto */}
                  {isListening &&
                    !isRecording &&
                    !isProcessing &&
                    !isPlayingAudio && (
                      <div className="text-xs text-teal-300/60">
                        Di "Hey Sofia"
                      </div>
                    )}

                  {lastTranscript && !isRecording && !isProcessing && (
                    <div
                      className="text-xs text-slate-400 truncate max-w-[120px]"
                      title={lastTranscript}
                    >
                      "{lastTranscript}"
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de configuración */}
              <button className="w-7 h-7 rounded-lg bg-slate-600/20 border border-slate-500/30 flex items-center justify-center hover:bg-slate-500/20 transition-colors opacity-70 hover:opacity-100">
                <Settings className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />
      </div>

      {/* Modal de voz y texto */}
      <VoiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSendAudio={handleModalAudioSend}
        onSendText={handleModalTextSend}
        isProcessing={isProcessing}
      />
    </>
  );
}
