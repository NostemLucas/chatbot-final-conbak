"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Trash2, X } from "lucide-react";

// Interfaces tipadas
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

// Componente Modal
interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  timeLeft: number;
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
  onStopRecording,
  result,
  error,
  isPlayingAudio,
}: VoiceModalProps) {
  if (!isOpen) return null;

  const progress = ((5 - timeLeft) / 5) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Sofia Escuchando</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isRecording || isProcessing || isPlayingAudio}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Microphone Icon and Animation */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`relative mb-4 ${isRecording ? "animate-pulse" : ""}`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? "bg-red-100 border-4 border-red-300"
                  : isProcessing
                  ? "bg-blue-100 border-4 border-blue-300"
                  : isPlayingAudio
                  ? "bg-green-100 border-4 border-green-300"
                  : "bg-gray-100 border-4 border-gray-300"
              }`}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : isPlayingAudio ? (
                <Volume2 className="w-8 h-8 text-green-600 animate-pulse" />
              ) : (
                <Mic
                  className={`w-8 h-8 ${
                    isRecording ? "text-red-600" : "text-gray-600"
                  }`}
                />
              )}
            </div>

            {/* Animated rings for recording */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping"></div>
                <div
                  className="absolute inset-0 rounded-full border border-red-200 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </>
            )}

            {/* Animated rings for playing audio */}
            {isPlayingAudio && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping"></div>
                <div
                  className="absolute inset-0 rounded-full border border-green-200 animate-ping"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            {isRecording && (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-red-600">
                  Grabando...
                </p>
                <p className="text-sm text-gray-600">
                  Tiempo restante: {timeLeft}s
                </p>
              </div>
            )}

            {isProcessing && (
              <p className="text-lg font-semibold text-blue-600">
                Procesando y generando respuesta...
              </p>
            )}

            {isPlayingAudio && (
              <p className="text-lg font-semibold text-green-600">
                Sofia está respondiendo...
              </p>
            )}

            {!isRecording && !isProcessing && !isPlayingAudio && (
              <p className="text-gray-600">Listo para grabar</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isRecording && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && !isRecording && !isProcessing && !isPlayingAudio && (
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">
                Tu mensaje:
              </p>
              <p className="text-gray-700 text-sm">{result.transcript}</p>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-1">
                Respuesta:
              </p>
              <p className="text-gray-700 text-sm">
                {result.dialogflow.fulfillmentText}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          {isRecording && (
            <button
              onClick={onStopRecording}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
            >
              Detener
            </button>
          )}

          {!isRecording && !isProcessing && !isPlayingAudio && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VoiceChat() {
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
    cleanupRecognition(); // Limpiar cualquier instancia anterior

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

      // Solo mostrar error si no es un error común
      if (!["no-speech", "aborted", "network"].includes(event.error)) {
        setError(`Error en reconocimiento: ${event.error}`);
      }

      // Reintentar después de un error (excepto si estamos grabando)
      if (!isRecording && !isModalOpen && !isProcessing && !isPlayingAudio) {
        setTimeout(() => {
          startContinuousListening();
        }, 2000);
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsListening(false);

      // Reiniciar automáticamente si no estamos en medio de una operación
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
      console.log("Cannot start listening - busy state");
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        console.log("Starting continuous listening...");
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting recognition:", err);
        // Si hay un error, reinicializar después de un momento
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
    console.log("Starting recording after wake word");
    stopContinuousListening();
    setIsModalOpen(true);
    setResult(null);
    setError("");

    // Pequeña pausa para que se abra el modal
    setTimeout(async () => {
      await startRecording();
    }, 500);
  };

  const startRecording = async (): Promise<void> => {
    try {
      console.log("Starting recording...");
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
        console.log("Recording stopped, processing...");
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

      // Iniciar countdown
      startCountdown();

      // Auto-stop después de 5 segundos - CORREGIDO
      recordingTimeoutRef.current = setTimeout(() => {
        console.log("Auto-stopping recording after 5 seconds");
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
    console.log("Stopping recording...");
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
      console.log("Processing audio blob of size:", audioBlob.size);

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
      console.log("Received response:", data);

      setResult(data);
      setIsProcessing(false);

      // Reproducir respuesta de audio
      if (data.dialogflow.fulfillmentText) {
        await speakResponse(data.dialogflow.fulfillmentText);
      }

      // Auto-cerrar modal después de un momento
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      console.error("Error processing audio:", err);
      setError("Error al procesar el audio: " + (err as Error).message);
      setIsProcessing(false);

      // Cerrar modal después de mostrar error
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

      // Cancelar cualquier síntesis anterior
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Buscar una voz en español
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
          console.log("Speech synthesis ended");
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

      // Si no hay voces cargadas, esperar
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      } else {
        setVoiceAndSpeak();
      }
    });
  };

  const closeModal = (): void => {
    console.log("Closing modal and restarting listening...");
    cleanupTimers();

    // Cancelar cualquier síntesis de voz
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsModalOpen(false);
    setIsRecording(false);
    setIsProcessing(false);
    setIsPlayingAudio(false);
    setTimeLeft(5);

    // Reiniciar la escucha después de un momento más largo
    restartListeningTimeoutRef.current = setTimeout(() => {
      console.log("Restarting continuous listening after modal close");
      initializeContinuousListening();
    }, 2000); // Aumentar el delay para evitar conflictos
  };

  const resetChat = (): void => {
    setResult(null);
    setError("");
    setLastCommand("");
  };

  const toggleListening = (): void => {
    if (isListening) {
      stopContinuousListening();
    } else {
      startContinuousListening();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Sofia - Asistente de Voz
      </h2>

      <div className="flex flex-col items-center space-y-6">
        {/* Controles principales */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleListening}
            disabled={isRecording || isProcessing || isPlayingAudio}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {isListening ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
            <span>{isListening ? "Escuchando..." : "Activar Escucha"}</span>
          </button>

          <button
            onClick={resetChat}
            disabled={isRecording || isProcessing || isPlayingAudio}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        </div>

        {/* Estado actual */}
        <div className="text-center">
          {isListening &&
            !isModalOpen &&
            !isRecording &&
            !isProcessing &&
            !isPlayingAudio && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                <span>Esperando "Hey Sofia"...</span>
              </div>
            )}

          {(isRecording || isProcessing || isPlayingAudio) && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              <span>Sofia está ocupada...</span>
            </div>
          )}
        </div>

        {/* Último comando detectado */}
        {lastCommand && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
            <p className="text-sm text-yellow-800 text-center">{lastCommand}</p>
          </div>
        )}

        {/* Instrucciones */}
        <div className="text-sm text-gray-600 text-center p-6 bg-gray-50 rounded-lg max-w-md">
          <h3 className="font-semibold mb-2">Cómo usar Sofia:</h3>
          <div className="space-y-1">
            <p>1. Activa la escucha con el botón verde</p>
            <p>2. Di "Hey Sofia", "Sofia" o "Hola Sofia"</p>
            <p>3. Habla tu mensaje (máximo 5 segundos)</p>
            <p>4. Sofia procesará y responderá automáticamente</p>
          </div>
        </div>

        {/* Error global */}
        {error && !isModalOpen && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md">
            {error}
          </div>
        )}
      </div>

      {/* Modal de grabación */}
      <VoiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isRecording={isRecording}
        isProcessing={isProcessing}
        timeLeft={timeLeft}
        onStopRecording={stopRecording}
        result={result}
        error={error}
        isPlayingAudio={isPlayingAudio}
      />
    </div>
  );
}
