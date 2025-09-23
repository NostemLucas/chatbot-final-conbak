"use client";
import { useState, useEffect, useRef, useId, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useAudioContext } from "../providers/AudioProvider";

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
  voiceType?:
    | "femaleLatina"
    | "femaleMexican"
    | "femaleArgentinian"
    | "maleLatino"
    | "maleMexican"
    | "maleArgentinian";
}

export default function TextToSpeechGCP({
  text,
  autoPlay = false,
  voiceType = "femaleLatina",
}: TextToSpeechProps) {
  const componentId = useId();
  const {
    hasUserInteracted,
    addPendingAutoPlay,
    removePendingAutoPlay,
    registerAutoPlayCallback,
    unregisterAutoPlayCallback,
  } = useAudioContext();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Cleanup function para liberar URLs de objeto
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playText = useCallback(async () => {
    if (!text || text.trim().length === 0) {
      setError("No hay texto para reproducir");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Limpiar audio previo
      cleanupAudio();

      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la API");
      }

      const data = await response.json();

      if (!data.success || !data.audioContent) {
        throw new Error("No se recibió contenido de audio");
      }

      // Convertir base64 a blob y crear URL
      const audioBlob = base64ToBlob(
        data.audioContent,
        data.mimeType || "audio/mpeg"
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      // Crear y configurar elemento de audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => setIsLoading(false);
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        cleanupAudio();
      };
      audio.onerror = () => {
        setError("Error reproduciendo el audio");
        setIsLoading(false);
        setIsPlaying(false);
        cleanupAudio();
      };

      // Reproducir el audio
      await audio.play();
    } catch (error) {
      console.error("Error en Text-to-Speech:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [text, voiceType, cleanupAudio]);

  // Función helper para convertir base64 a blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // Registrar/desregistrar callback y manejar autoplay
  useEffect(() => {
    if (!autoPlay || !text) return;

    if (hasUserInteracted) {
      // Si ya hay interacción, reproducir inmediatamente
      playText();
    } else {
      // Registrar callback para autoplay y agregarlo a pendientes
      registerAutoPlayCallback(componentId, playText);
      addPendingAutoPlay(componentId);
    }

    return () => {
      unregisterAutoPlayCallback(componentId);
      removePendingAutoPlay(componentId);
    };
  }, [
    text,
    autoPlay,
    hasUserInteracted,
    componentId,
    playText,
    registerAutoPlayCallback,
    unregisterAutoPlayCallback,
    addPendingAutoPlay,
    removePendingAutoPlay,
  ]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      cleanupAudio();
      unregisterAutoPlayCallback(componentId);
      removePendingAutoPlay(componentId);
    };
  }, [
    componentId,
    cleanupAudio,
    unregisterAutoPlayCallback,
    removePendingAutoPlay,
  ]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    cleanupAudio();
  };

  const toggleSpeech = () => {
    setError(null);

    if (isPlaying) {
      stopAudio();
    } else {
      if (!hasUserInteracted) {
        setError("Toca el overlay para activar el audio");
        return;
      }
      playText();
    }
  };

  // Determinar si hay autoplay pendiente para este componente
  const isPendingAutoPlay = autoPlay && !hasUserInteracted && text;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSpeech}
        disabled={isLoading || !text}
        className={`p-3 rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed relative ${
          isPlaying
            ? "bg-red-500/20 border border-red-400/50"
            : isPendingAutoPlay
            ? "bg-yellow-500/20 border border-yellow-400/50 animate-pulse"
            : "bg-teal-500/20 border border-teal-400/50"
        }`}
        title={
          isPlaying
            ? "Detener reproducción"
            : isLoading
            ? "Generando audio..."
            : isPendingAutoPlay
            ? "Audio en espera - Toca el overlay"
            : "Reproducir texto"
        }
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="w-6 h-6 text-red-300 animate-pulse" />
        ) : (
          <>
            <Volume2
              className={`w-6 h-6 ${
                isPendingAutoPlay ? "text-yellow-400" : "text-teal-400"
              }`}
            />
            {isPendingAutoPlay && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            )}
          </>
        )}
      </button>

      {error && (
        <span className="text-xs text-red-400 max-w-48 truncate" title={error}>
          {error}
        </span>
      )}

      {isPendingAutoPlay && !error && (
        <span className="text-xs text-yellow-400 animate-pulse">
          Audio en espera
        </span>
      )}
    </div>
  );
}
