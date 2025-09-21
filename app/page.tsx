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
        <Bot className="w-32 h-32 text-teal-300 transition-transform duration-500 group-hover:scale-110 animate-float" />

        <div
          className="absolute top-0 left-0 w-full h-full animate-spin"
          style={{ animationDuration: "10s" }}
        >
          <Sparkles className="absolute -top-2 left-1/2 w-4 h-4 text-yellow-400" />
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        >
          <div className="absolute top-1/2 -right-2 w-2 h-2 bg-cyan-400/60 rounded-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-teal-900 to-slate-800 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-teal-400/10 to-cyan-400/5 rounded-full blur-2xl animate-pulse" />
        <div
          className="absolute top-60 right-16 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-20 w-56 h-56 bg-gradient-to-br from-teal-300/10 to-cyan-300/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="absolute top-1/3 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent rotate-45 animate-pulse" />
        <div
          className="absolute top-2/3 right-1/4 w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -rotate-45 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />

        <div
          className="absolute top-1/4 right-1/3 w-2 h-2 bg-teal-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute top-1/2 right-1/5 w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "2.3s" }}
        />
      </div>

      <div className="relative z-10 text-center pt-8 mb-6">
        <div className="relative z-10 pt-8 mb-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-teal-300 font-medium">EN VIVO</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-teal-300 font-medium">
                Feria Tecnológica 2025
              </div>
              <div className="text-teal-200 font-medium">
                <Clock />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2 bg-slate-800/30 px-4 py-2 rounded-full border border-teal-400/20">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
            <span className="text-teal-200">100% Seguro</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/30 px-4 py-2 rounded-full border border-cyan-400/20">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            <span className="text-cyan-200">Instantáneo</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/30 px-4 py-2 rounded-full border border-blue-400/20">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <span className="text-blue-200">Sin Comisiones</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 relative z-10 px-4">
        <div className="relative group h-auto">
          <Image
            src={"/logo.svg"}
            width={450}
            height={550}
            alt="Yasta Logo"
            className="mx-auto mb-4"
          />
        </div>

        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-full px-8 py-4 mt-6 border border-teal-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-slide" />
          <p className="text-3xl text-teal-100 font-bold relative z-10">
            Tu billetera 100% boliviana y digital
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
        <div className="mb-8">
          <div className="mx-auto w-80 h-80 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800/70 to-teal-800/70 backdrop-blur-lg border-2 border-teal-400/50 relative">
            <MockRiveComponent />
          </div>

          <div className="flex justify-center mt-6">
            <div className="px-8 py-4 text-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-full flex items-center shadow-2xl border border-teal-400/50 font-bold">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-400 animate-spin" />
              Sof-IA - Asistente Virtual
              <Bot className="w-8 h-8 ml-3 text-teal-200" />
            </div>
          </div>
        </div>

        {/* Mensaje - Más visible */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-slate-800/70 to-teal-800/70 backdrop-blur-xl border border-teal-400/50 shadow-2xl rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="flex items-center justify-center mb-6">
              <Volume2 className="w-8 h-8 text-teal-300 mr-4 animate-pulse" />
              <span className="text-teal-200 font-bold text-2xl">
                Sof-IA te habla:
              </span>
            </div>

            <p className="text-3xl font-bold text-white leading-relaxed mb-8 drop-shadow-lg">
              {sofiaMessage}
            </p>

            {!showNameInput && !userName && (
              <button
                onClick={() => router.push("/dashboard")}
                className="px-12 py-6 text-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-2xl font-black transition-all duration-300 hover:from-yellow-400 hover:to-yellow-500 hover:scale-105 transform shadow-2xl border border-yellow-400/50 flex items-center mx-auto"
              >
                <Bot className="w-8 h-8 mr-4" />
                Comenzar conversación
                <Sparkles className="w-8 h-8 ml-4" />
              </button>
            )}

            {showNameInput && (
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Escribe tu nombre aquí..."
                  className="w-full px-8 py-6 text-2xl bg-slate-800/70 border-2 border-teal-400/50 rounded-2xl text-white placeholder-teal-200/70 backdrop-blur-sm focus:border-yellow-400 focus:outline-none font-medium text-center transition-colors duration-300"
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

      <div className="relative z-10 text-center pb-8 px-4">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-4">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-teal-400/20">
            <div className="text-teal-400 text-2xl font-bold">1M+</div>
            <div className="text-teal-200 text-sm">Usuarios Activos</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-cyan-400/20">
            <div className="text-cyan-400 text-2xl font-bold">24/7</div>
            <div className="text-cyan-200 text-sm">Disponibilidad</div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-400/20">
            <div className="text-blue-400 text-2xl font-bold">0%</div>
            <div className="text-blue-200 text-sm">Comisiones</div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl px-8 py-4 border border-teal-400/30 max-w-3xl mx-auto">
          <p className="text-teal-200 text-lg font-medium">
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
