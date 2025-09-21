"use client";
import { useState, useEffect } from "react";
import { Bot, Sparkles, Volume2, Star, Zap, Crown } from "lucide-react";
import Clock from "@/components/Clock";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function YastaWelcomePage() {
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [sofiaMessage, setSofiaMessage] = useState(
    "¡Hola! Soy Sof-IA, tu asistente virtual de Yasta. ¿Cuál es tu nombre?"
  );
  const router = useRouter();

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setShowNameInput(false);
    setSofiaMessage(
      `¡Bienvenid@ ${name}! Descubre el futuro de los pagos digitales con Yasta.`
    );
  };

  const MockRiveComponent = () => (
    <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 rounded-full border-2 border-teal-400/20 animate-ping" />
      <div
        className="absolute inset-4 rounded-full border border-cyan-400/30 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 group">
        <Bot className="w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 text-teal-300 transition-transform duration-500 group-hover:scale-110 animate-float" />

        <div
          className="absolute top-0 left-0 w-full h-full animate-spin"
          style={{ animationDuration: "10s" }}
        >
          <Sparkles className="absolute -top-1 sm:-top-2 left-1/2 w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        >
          <div className="absolute top-1/2 -right-1 sm:-right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400/60 rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-900 to-slate-800 relative overflow-hidden flex flex-col">
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

      <div className="relative z-10 text-center pt-4 sm:pt-8 mb-4 sm:mb-6">
        <div className="px-2 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-teal-300 font-medium text-xs sm:text-sm">
                EN VIVO
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
              <div className="text-teal-300 font-medium text-xs sm:text-sm">
                Feria Tecnológica 2025
              </div>
              <div className="text-teal-200 font-medium text-xs sm:text-sm">
                <Clock />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm max-w-sm sm:max-w-none mx-auto">
            <div className="flex items-center space-x-2 bg-slate-800/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-teal-400/20">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-teal-400 rounded-full" />
              <span className="text-teal-200">100% Seguro</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-cyan-400/20">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full" />
              <span className="text-cyan-200">Instantáneo</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-800/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-cyan-400/20">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full" />
              <span className="text-blue-200">Sin Comisiones</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-4 sm:mb-8 relative z-10 px-4">
        <div className="relative group h-auto">
          <Image
            src={"/logo.svg"}
            width={300}
            height={350}
            alt="Yasta Logo"
            className="mx-auto mb-2 sm:mb-4 w-[200px] sm:w-[300px] lg:w-[450px] h-auto"
          />
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
          <div className="mx-auto w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800/70 to-teal-800/70 backdrop-blur-lg border-2 border-teal-400/50 relative">
            <MockRiveComponent />
          </div>

          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-lg lg:text-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full flex items-center shadow-2xl border border-teal-400/50 font-bold">
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
                onClick={() => router.push("/dashboard")}
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
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-teal-400/20">
            <div className="text-teal-400 text-lg sm:text-xl lg:text-2xl font-bold">
              1M+
            </div>
            <div className="text-teal-200 text-xs sm:text-sm">
              Usuarios Activos
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-cyan-400/20">
            <div className="text-cyan-400 text-lg sm:text-xl lg:text-2xl font-bold">
              24/7
            </div>
            <div className="text-cyan-200 text-xs sm:text-sm">
              Disponibilidad
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3 border border-blue-400/20">
            <div className="text-blue-400 text-lg sm:text-xl lg:text-2xl font-bold">
              0%
            </div>
            <div className="text-blue-200 text-xs sm:text-sm">Comisiones</div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl px-4 py-2 sm:px-8 sm:py-4 border border-teal-400/30 max-w-full sm:max-w-3xl mx-auto">
          <p className="text-teal-200 text-sm sm:text-base lg:text-lg font-medium">
            Stand #15 - Zona Tecnología Digital - ExpoCurz 2025
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
