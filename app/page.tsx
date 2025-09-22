"use client";
import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InteractiveCoin, {
  type AnimationCommand,
  type AnimationType,
} from "@/components/InteractiveCoin";
import Link from "next/link";

export default function YastaWelcomePage() {
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [sofiaMessage, setSofiaMessage] = useState(
    "¡Hola! Soy Sof-IA, tu asistente virtual de Yasta. ¿Presiona el botón para comenzar?"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [animationCommand, setAnimationCommand] =
    useState<AnimationCommand | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const router = useRouter();

  const executeAnimation = (
    type: AnimationType,
    finalSide?: "front" | "back",
    duration?: number
  ) => {
    setAnimationCommand({
      type,
      finalSide,
      duration,
      timestamp: Date.now(),
    });
  };

  // Función para hablar el texto
  const speakText = (text: string) => {
    if (!synthRef.current || !speechSupported) {
      console.log("Text-to-Speech no soportado en este navegador");
      return;
    }

    // Cancelar cualquier síntesis anterior
    synthRef.current.cancel();

    setTimeout(() => {
      if (!synthRef.current) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configurar la voz (buscar una voz en español)
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(
        (voice) =>
          voice.lang.includes("es") ||
          voice.name.toLowerCase().includes("spanish")
      );

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      // Configurar parámetros de la voz
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      // Event listeners
      utterance.onstart = () => {
        setIsSpeaking(true);
        executeAnimation("heartbeat");
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    }, 100);
  };

  // Función para detener el habla
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Función para alternar entre hablar y parar
  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(sofiaMessage);
    }
  };

  // Verificar soporte de Speech Synthesis al montar el componente
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      setSpeechSupported(true);
    }
  }, []);

  // Reproducir mensaje automáticamente al cargar
  useEffect(() => {
    if (speechSupported && synthRef.current) {
      const timer = setTimeout(() => {
        if (synthRef.current && synthRef.current.getVoices().length > 0) {
          speakText(sofiaMessage);
        } else {
          // Esperar a que las voces estén disponibles
          const handleVoicesChanged = () => {
            speakText(sofiaMessage);
            if (synthRef.current) {
              synthRef.current.onvoiceschanged = null;
            }
          };

          if (synthRef.current) {
            synthRef.current.onvoiceschanged = handleVoicesChanged;
          }
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [speechSupported, sofiaMessage]);

  // Animaciones automáticas para dar vida a Sofia
  useEffect(() => {
    const interval = setInterval(() => {
      const animations: AnimationType[] = ["bounce", "heartbeat", "celebrate"];
      const randomAnimation =
        animations[Math.floor(Math.random() * animations.length)];
      executeAnimation(randomAnimation);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setShowNameInput(false);
    const welcomeMessage = `¡Bienvenido ${name}! Descubre el futuro de los pagos digitales con Yasta.`;
    setSofiaMessage(welcomeMessage);

    executeAnimation("celebrate");

    setTimeout(() => {
      speakText(welcomeMessage);
    }, 500);
  };

  const handleBeginConversation = () => {
    executeAnimation("celebrate");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  // Función para toggle fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        executeAnimation("bounce");
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log("Fullscreen not supported or permission denied");
    }
  };

  // Escuchar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Limpiar síntesis de voz al desmontar el componente
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const frontImage = "avatar/smile.png";
  const backImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='58' fill='%23059669' stroke='%23047857' stroke-width='2'/%3E%3Ctext x='60' y='35' font-family='Arial' font-size='16' text-anchor='middle' fill='%23FFF' font-weight='bold'%3EYASTA%3C/text%3E%3Crect x='20' y='45' width='80' height='30' rx='15' fill='%23FFF'/%3E%3Ctext x='60' y='58' font-family='Arial' font-size='8' text-anchor='middle' fill='%23059669' font-weight='bold'%3EPAGOS DIGITALES%3C/text%3E%3Ctext x='60' y='68' font-family='Arial' font-size='10' text-anchor='middle' fill='%23059669' font-weight='bold'%3E100%25 BOLIVIANO%3C/text%3E%3Ccircle cx='30' cy='85' r='8' fill='none' stroke='%23FFF' stroke-width='2'/%3E%3Ctext x='30' y='90' font-family='Arial' font-size='12' text-anchor='middle' fill='%23FFF' font-weight='bold'%3EBs%3C/text%3E%3Cpolygon points='80,80 90,90 70,90' fill='%23FFF'/%3E%3Ctext x='60' y='110' font-family='Arial' font-size='8' text-anchor='middle' fill='%23FFF' font-weight='bold'%3ESEGURO Y RAPIDO%3C/text%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-[#009e98] from relative overflow-hidden flex flex-col">
      {/* Botón de pantalla completa */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 p-2 sm:p-3 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm rounded-full border border-teal-400/30 transition-all duration-300 hover:scale-110 group"
        title={
          isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"
        }
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 group-hover:text-teal-200" />
        ) : (
          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300 group-hover:text-teal-200" />
        )}
      </button>

      {/* Header con logo */}
      <div className="text-center mb-4 sm:mb-8 relative z-10 px-4 mt-20">
        <div className="relative group h-auto">
          <Link
            href="https://banco-union-yasta-gamificacion.vercel.app/"
            target="_blank"
          >
            <Image
              src="/logo.svg"
              width={300}
              height={350}
              alt="Yasta Logo"
              className="mx-auto mb-2 sm:mb-4 w-[200px] sm:w-[300px] lg:w-[450px] h-auto cursor-pointer"
            />
          </Link>
        </div>

        <div className="bg-[#008880] backdrop-blur-sm rounded-2xl sm:rounded-full px-4 py-2 sm:px-8 sm:py-4 mt-3 sm:mt-6 border border-teal-400/30 relative overflow-hidden">
          <p className="text-lg sm:text-2xl lg:text-3xl text-teal-100 font-bold relative z-10 leading-tight">
            Tu billetera 100% boliviana y digital
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-8 min-h-0">
        <div className="mb-4 sm:mb-8 w-full max-w-md sm:max-w-lg lg:max-w-xl">
          {/* Moneda interactiva */}
          <Link
            href="https://banco-union-yasta-gamificacion.vercel.app/"
            target="_blank"
          >
            <Image
              src="/avatar/smile.png"
              width={300}
              height={350}
              alt="Yasta Logo"
              className="mx-auto mb-2 sm:mb-4 w-[200px] sm:w-[300px] lg:w-[450px] h-auto cursor-pointer"
            />
          </Link>
        </div>

        {/* Mensaje de Sofia */}
        <div className="w-full max-w-xs sm:max-w-2xl lg:max-w-5xl mx-auto mb-4 sm:mb-8">
          <div className="bg-gradient-to-br from-slate-800/70 to-teal-800/70 backdrop-blur-xl border border-teal-400/50 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="flex items-center justify-center mb-3 sm:mb-6">
              <button
                onClick={toggleSpeech}
                className={`mr-2 sm:mr-4 p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                  isSpeaking
                    ? "bg-red-500/20 border border-red-400/50"
                    : "bg-teal-500/20 border border-teal-400/50"
                } ${
                  !speechSupported
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={!speechSupported}
                title={
                  !speechSupported
                    ? "Text-to-Speech no soportado"
                    : isSpeaking
                    ? "Detener audio"
                    : "Reproducir audio"
                }
              >
                {isSpeaking ? (
                  <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-300 animate-pulse" />
                ) : (
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-teal-300 animate-pulse" />
                )}
              </button>
              <span className="text-teal-200 font-bold text-sm sm:text-lg lg:text-2xl">
                {isSpeaking ? "Sof-IA está hablando:" : "Sof-IA te habla:"}
              </span>
            </div>

            <p className="text-base sm:text-xl lg:text-3xl font-bold text-white leading-relaxed mb-4 sm:mb-8 drop-shadow-lg">
              {sofiaMessage}
            </p>

            {!showNameInput && !userName && (
              <button
                onClick={handleBeginConversation}
                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 lg:px-12 lg:py-6 text-base sm:text-lg lg:text-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl sm:rounded-2xl font-black transition-all duration-300 hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 transform shadow-2xl border border-yellow-400/50 flex items-center justify-center mx-auto"
              >
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-4" />
                <span className="hidden sm:inline">Comenzar conversación</span>
                <span className="sm:hidden">Comenzar</span>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ml-2 sm:ml-4" />
              </button>
            )}

            {showNameInput && (
              <div className="max-w-full sm:max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Escribe tu nombre aquí..."
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 text-base sm:text-xl lg:text-2xl bg-slate-800/70 border-2 border-teal-400/50 rounded-xl sm:rounded-2xl text-white placeholder-teal-200/70 backdrop-blur-sm focus:border-yellow-400 focus:outline-none font-medium text-center transition-colors duration-300"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleNameSubmit(e.currentTarget.value.trim());
                    }
                  }}
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer con estadísticas */}
      <div className="relative z-10 text-center pb-4 sm:pb-8 px-4 mt-auto">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto mb-3 sm:mb-4">
          <div
            className="bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-teal-400/20 cursor-pointer hover:bg-slate-700/40 transition-colors duration-300"
            onClick={() => executeAnimation("pulse")}
          >
            <div className="text-teal-400 text-lg sm:text-xl lg:text-2xl font-bold">
              1M+
            </div>
            <div className="text-teal-200 text-xs sm:text-sm">
              Usuarios Activos
            </div>
          </div>
          <div
            className="bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-cyan-400/20 cursor-pointer hover:bg-slate-700/40 transition-colors duration-300"
            onClick={() => executeAnimation("heartbeat")}
          >
            <div className="text-cyan-400 text-lg sm:text-xl lg:text-2xl font-bold">
              24/7
            </div>
            <div className="text-cyan-200 text-xs sm:text-sm">
              Disponibilidad
            </div>
          </div>
          <div
            className="bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-blue-400/20 cursor-pointer hover:bg-slate-700/40 transition-colors duration-300"
            onClick={() => executeAnimation("celebrate")}
          >
            <div className="text-blue-400 text-lg sm:text-xl lg:text-2xl font-bold">
              0%
            </div>
            <div className="text-blue-200 text-xs sm:text-sm">Comisiones</div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 py-2 sm:px-8 sm:py-4 border border-teal-400/30 max-w-full sm:max-w-3xl mx-auto">
          <p className="text-teal-200 text-sm sm:text-base lg:text-lg font-medium">
            Stand - Zona Tecnología Digital - ExpoCurz 2025
          </p>
        </div>
      </div>
    </div>
  );
}
