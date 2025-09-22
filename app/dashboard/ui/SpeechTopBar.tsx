import { useState, useRef, useEffect } from "react";
import { Mic, Radio, Sparkles, Settings, X, Send, Loader2 } from "lucide-react";

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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setTextInput("");
      setRecordingTime(0);
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

        {/* Content */}
        <div className="p-6">
          {/* Sección de grabación */}
          <div className="text-center mb-6">
            <div className="mb-4">
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

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all mb-4 ${
                isRecording
                  ? "bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30"
                  : "bg-teal-500/20 border border-teal-400/50 text-teal-300 hover:bg-teal-500/30"
              } disabled:opacity-50`}
            >
              {isRecording ? "Detener Grabación" : "Grabar Mensaje"}
            </button>
          </div>

          {/* Separador */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-600/50"></div>
            <span className="text-sm text-slate-400">o escribe</span>
            <div className="flex-1 h-px bg-slate-600/50"></div>
          </div>

          {/* Sección de texto */}
          <div className="space-y-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isProcessing || isRecording}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
              maxLength={200}
            />

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">
                {textInput.length}/200
              </span>

              <button
                onClick={handleSendText}
                disabled={!textInput.trim() || isProcessing || isRecording}
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/30 rounded-b-2xl">
          <p className="text-xs text-slate-400 text-center">
            {isProcessing
              ? "Procesando tu mensaje..."
              : "Graba tu voz o escribe tu mensaje"}
          </p>
        </div>
      </div>
    </div>
  );
}

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
  className = "",
}: VoiceTopBarProps) {
  // Estados internos simplificados
  const [internalIsListening, setInternalIsListening] =
    useState<boolean>(false);
  const [internalIsProcessing, setInternalIsProcessing] =
    useState<boolean>(false);
  const [internalIsSpeaking, setInternalIsSpeaking] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const [lastIntent, setLastIntent] = useState<string>("");

  // Estados actuales
  const isListening = parentIsListening ?? internalIsListening;
  const isRecording = parentIsRecording ?? false;
  const isProcessing = parentIsProcessing ?? internalIsProcessing;
  const isPlayingAudio = parentIsSpeaking ?? internalIsSpeaking;

  // Referencias
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecognitionActive = useRef<boolean>(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isModalWasOpen = useRef<boolean>(false);

  const wakeWords: string[] = ["sofia", "sofía", "hey sofia", "oye sofia"];

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
    error,
    lastTranscript,
    lastIntent,
  ]);

  // Inicializar reconocimiento al montar
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      initializeContinuousListening();
    }

    return () => {
      cleanupAll();
    };
  }, []);

  // Manejo del modal
  useEffect(() => {
    if (isModalOpen) {
      isModalWasOpen.current = true;
      stopListening();
    } else if (isModalWasOpen.current) {
      isModalWasOpen.current = false;
      // Reiniciar después de cerrar el modal
      restartTimeoutRef.current = setTimeout(() => {
        if (!isProcessing && !isPlayingAudio) {
          initializeContinuousListening();
        }
      }, 1000);
    }
  }, [isModalOpen]);

  const cleanupAll = (): void => {
    stopListening();
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  };

  const stopListening = (): void => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Recognition stop error:", e);
      }
      recognitionRef.current = null;
    }
    isRecognitionActive.current = false;
    setInternalIsListening(false);
  };

  const initializeContinuousListening = (): void => {
    // No inicializar si hay condiciones que lo impidan
    if (
      isModalOpen ||
      isProcessing ||
      isPlayingAudio ||
      isRecognitionActive.current
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }

    // Limpiar reconocimiento anterior
    stopListening();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      console.log("✅ Recognition started");
      setInternalIsListening(true);
      setError("");
      isRecognitionActive.current = true;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
            .toLowerCase()
            .trim();
        }
      }

      if (finalTranscript) {
        console.log("📝 Final transcript:", finalTranscript);
        setLastTranscript(finalTranscript);

        const hasWakeWord = wakeWords.some((word) =>
          finalTranscript.includes(word.toLowerCase())
        );

        if (hasWakeWord && !isModalOpen && !isProcessing && !isPlayingAudio) {
          console.log("🎯 Wake word detected, opening modal");
          setIsModalOpen(true);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log("❌ Recognition error:", event.error);

      if (!["no-speech", "aborted"].includes(event.error)) {
        setError(`Error: ${event.error}`);
      }

      isRecognitionActive.current = false;
      setInternalIsListening(false);
    };

    recognition.onend = () => {
      console.log("🔚 Recognition ended");
      isRecognitionActive.current = false;
      setInternalIsListening(false);

      // Solo reiniciar si no estamos en modal o procesando
      if (!isModalOpen && !isProcessing && !isPlayingAudio) {
        restartTimeoutRef.current = setTimeout(() => {
          initializeContinuousListening();
        }, 2000);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error("Error starting recognition:", err);
      isRecognitionActive.current = false;
      setInternalIsListening(false);
    }
  };

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
    } catch (err) {
      console.error("Error processing audio:", err);
      setError("Error procesando audio");
    } finally {
      setInternalIsProcessing(false);
    }
  };

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
    } catch (err) {
      console.error("Error processing text:", err);
      setError("Error procesando texto");
    } finally {
      setInternalIsProcessing(false);
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
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => {
        setInternalIsSpeaking(false);
        resolve();
      };

      utterance.onerror = () => {
        setInternalIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const toggleListening = (): void => {
    if (onListeningToggle) {
      onListeningToggle();
    } else {
      if (isListening) {
        stopListening();
      } else {
        initializeContinuousListening();
      }
    }
  };

  return (
    <>
      <div
        className={`w-full bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl ${className}`}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {(isListening || isRecognitionActive.current) && (
                  <div className="absolute inset-0 bg-teal-400/20 rounded-lg blur-sm animate-pulse" />
                )}
              </div>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  Sof-IA
                </h1>
                <p className="text-xs text-slate-400 leading-none">
                  Asistente Virtual
                </p>
              </div>
            </div>

            {/* Controles centrales */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleListening}
                disabled={isRecording || isProcessing || isPlayingAudio}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50 border ${
                  isListening
                    ? "bg-teal-500/20 border-teal-400/50 shadow-lg shadow-teal-400/20"
                    : "bg-slate-600/20 border-slate-500/30 hover:bg-slate-500/20"
                }`}
                title={isListening ? "Desactivar escucha" : "Activar escucha"}
              >
                <Radio
                  className={`w-4 h-4 ${
                    isListening ? "text-teal-300" : "text-slate-400"
                  }`}
                />
                <AudioWaves
                  isActive={
                    isListening &&
                    !isRecording &&
                    !isProcessing &&
                    !isPlayingAudio
                  }
                />
                {isListening &&
                  !isRecording &&
                  !isProcessing &&
                  !isPlayingAudio && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                  )}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isProcessing || isPlayingAudio}
                className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50 border-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-400/60 shadow-lg shadow-teal-400/20 hover:shadow-teal-400/30"
                title="Abrir asistente"
              >
                <Mic className="w-5 h-5 text-teal-300" />
              </button>
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    error
                      ? "bg-red-400 animate-pulse"
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

                  {isListening &&
                    !isRecording &&
                    !isProcessing &&
                    !isPlayingAudio && (
                      <div className="text-xs text-teal-300/60">Di "Sofia"</div>
                    )}
                </div>
              </div>

              <button
                className="w-8 h-8 rounded-lg bg-slate-600/20 border border-slate-500/30 flex items-center justify-center hover:bg-slate-500/20 transition-colors opacity-70 hover:opacity-100"
                title="Configuración"
              >
                <Settings className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />
      </div>

      <VoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendAudio={handleModalAudioSend}
        onSendText={handleModalTextSend}
        isProcessing={isProcessing}
      />
    </>
  );
}
