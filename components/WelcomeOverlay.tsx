"use client";
import React, { useEffect, useState } from "react";
import { Volume2, Hand, Sparkles } from "lucide-react";
import { useAudioContext } from "../providers/AudioProvider";

interface WelcomeOverlayProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  showWhenPending?: boolean;
  onAutoPlayTriggered?: () => void; // Callback para cuando se activen los autoplay
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  title = "¡Bienvenido!",
  subtitle = "Toca la pantalla para activar el audio y comenzar",
  buttonText = "Tocar para comenzar",
  showWhenPending = true,
  onAutoPlayTriggered,
}) => {
  const { hasUserInteracted, setUserInteracted, pendingAutoPlays } =
    useAudioContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Mostrar overlay si:
    // 1. No ha interactuado el usuario, Y
    // 2. showWhenPending es true Y hay autoplay pendientes, O showWhenPending es false
    const shouldShow =
      !hasUserInteracted &&
      (showWhenPending ? pendingAutoPlays.size > 0 : true);

    setIsVisible(shouldShow);
  }, [hasUserInteracted, pendingAutoPlays.size, showWhenPending]);

  const handleInteraction = async (
    e: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimatingOut(true);

    // Marcar como interactuado inmediatamente
    setUserInteracted();

    // Notificar que se van a activar los autoplay
    if (onAutoPlayTriggered) {
      onAutoPlayTriggered();
    }

    // Pequeño delay para la animación de salida
    setTimeout(() => {
      setIsAnimatingOut(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleInteraction(e);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300 cursor-pointer ${
        isAnimatingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      style={{ touchAction: "none" }}
    >
      <div
        className={`bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 text-center transform transition-all duration-300 ${
          isAnimatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono animado */}
        <div className="relative mb-6">
          <div
            className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center relative cursor-pointer"
            onClick={handleInteraction}
          >
            <Volume2 className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Contenido */}
        <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
          {title}
        </h2>

        <p className="text-slate-300 mb-6 leading-relaxed">{subtitle}</p>

        {/* Indicador de autoplay pendiente */}
        {pendingAutoPlays.size > 0 && (
          <div className="mb-6 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
            <p className="text-teal-300 text-sm flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4 animate-pulse" />
              {pendingAutoPlays.size} audio
              {pendingAutoPlays.size > 1 ? "s" : ""} listos para reproducir
            </p>
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={handleInteraction}
          onTouchStart={handleInteraction}
          onKeyDown={handleKeyDown}
          className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          tabIndex={0}
        >
          <Hand className="w-5 h-5" />
          {buttonText}
        </button>

        
      </div>
    </div>
  );
};
