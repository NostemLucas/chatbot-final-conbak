"use client";
import { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Volume2,
  Star,
  Zap,
  Crown,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Clock from "@/components/Clock";
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

  const router = useRouter();

  // Función para ejecutar animaciones en la moneda
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

  // Animaciones automáticas para dar vida a Sofia
  useEffect(() => {
    const interval = setInterval(() => {
      const animations: AnimationType[] = ["breathe", "heartbeat", "celebrate"];
      const randomAnimation =
        animations[Math.floor(Math.random() * animations.length)];
      executeAnimation(randomAnimation);
    }, 8000); // Cada 8 segundos una animación sutil

    return () => clearInterval(interval);
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setShowNameInput(false);
    setSofiaMessage(
      `¡Bienvenid@ ${name}! Descubre el futuro de los pagos digitales con Yasta.`
    );
    // Animación de celebración al ingresar nombre
    executeAnimation("celebrate");
  };

  const handleBeginConversation = () => {
    executeAnimation("excited"); // Animación antes de navegar
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
        executeAnimation("zoom"); // Animación al entrar en fullscreen
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

  const frontImage = "avatar/smile.png";

  const backImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='58' fill='%23059669' stroke='%23047857' stroke-width='2'/%3E%3Ctext x='60' y='35' font-family='Arial' font-size='16' text-anchor='middle' fill='%23FFF' font-weight='bold'%3EYASTA%3C/text%3E%3Crect x='20' y='45' width='80' height='30' rx='15' fill='%23FFF'/%3E%3Ctext x='60' y='58' font-family='Arial' font-size='8' text-anchor='middle' fill='%23059669' font-weight='bold'%3EPAGOS DIGITALES%3C/text%3E%3Ctext x='60' y='68' font-family='Arial' font-size='10' text-anchor='middle' fill='%23059669' font-weight='bold'%3E100%25 BOLIVIANO%3C/text%3E%3Ccircle cx='30' cy='85' r='8' fill='none' stroke='%23FFF' stroke-width='2'/%3E%3Ctext x='30' y='90' font-family='Arial' font-size='12' text-anchor='middle' fill='%23FFF' font-weight='bold'%3EBs%3C/text%3E%3Cpolygon points='80,80 90,90 70,90' fill='%23FFF'/%3E%3Ctext x='60' y='110' font-family='Arial' font-size='8' text-anchor='middle' fill='%23FFF' font-weight='bold'%3ESEGURO Y RAPIDO%3C/text%3E%3C/svg%3E";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-900 to-slate-800 relative overflow-hidden flex flex-col">
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

      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-teal-400/10 to-cyan-400/5 rounded-full blur-xl sm:blur-2xl animate-pulse" />
        <div
          className="absolute top-32 sm:top-60 right-8 sm:right-16 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/5 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-16 sm:bottom-32 left-10 sm:left-20 w-28 h-28 sm:w-56 sm:h-56 bg-gradient-to-br from-teal-300/10 to-cyan-300/5 rounded-full blur-xl sm:blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="hidden sm:block absolute top-1/3 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent rotate-45 animate-pulse" />
        <div
          className="hidden sm:block absolute top-2/3 right-1/4 w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -rotate-45 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />

        <div
          className="absolute top-1/4 right-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-3/4 left-1/3 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute top-1/2 right-1/5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "2.3s" }}
        />
      </div>

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

        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-2xl sm:rounded-full px-4 py-2 sm:px-8 sm:py-4 mt-3 sm:mt-6 border border-teal-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-slide" />
          <p className="text-lg sm:text-2xl lg:text-3xl text-teal-100 font-bold relative z-10 leading-tight">
            Tu billetera 100% boliviana y digital
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-8 min-h-0">
        <div className="mb-4 sm:mb-8 w-full max-w-md sm:max-w-lg lg:max-w-xl">
          {/* Contenedor de la moneda interactiva */}
          <div className="mx-auto w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800/70 to-teal-800/70 backdrop-blur-lg border-2 border-teal-400/50 relative flex items-center justify-center">
            <InteractiveCoin
              frontImage={frontImage}
              backImage={backImage}
              size={220}
              frontLabel="Sof-IA"
              backLabel="Yasta"
              animationCommand={animationCommand}
              onAnimationComplete={(result) => {
                console.log(`Animación completada: ${result.type}`);
              }}
              onAnimationStart={(command) => {
                console.log(`Iniciando animación: ${command.type}`);
              }}
              className="transform scale-75 sm:scale-100 lg:scale-125"
            />
          </div>

          <div className="flex justify-center mt-4 sm:mt-6">
            <div
              className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-lg lg:text-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full flex items-center shadow-2xl border border-teal-400/50 font-bold cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => executeAnimation("showBack", "back", 3000)}
            >
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-3 text-yellow-400 animate-spin" />
              <span className="hidden sm:inline">
                Sof-IA - Asistente Virtual
              </span>
              <span className="sm:hidden">Sof-IA</span>
              <Bot className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ml-2 sm:ml-3 text-teal-200" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs sm:max-w-2xl lg:max-w-5xl mx-auto mb-4 sm:mb-8">
          <div className="bg-gradient-to-br from-slate-800/70 to-teal-800/70 backdrop-blur-xl border border-teal-400/50 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="flex items-center justify-center mb-3 sm:mb-6">
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-teal-300 mr-2 sm:mr-4 animate-pulse" />
              <span className="text-teal-200 font-bold text-sm sm:text-lg lg:text-2xl">
                Sof-IA te habla:
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

      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-slide {
          animation: slide 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
