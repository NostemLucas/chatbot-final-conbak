"use client";

import { useState } from "react";
import { Bot, Sparkles, Volume2 } from "lucide-react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export default function YastaWelcomePage() {
  const [userName, setUserName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [sofiaMessage, setSofiaMessage] = useState(
    "¡Hola! Soy Sof-IA, tu asistente virtual de Yasta. ¿Cuál es tu nombre?"
  );

  const { RiveComponent } = useRive({
    src: "/model.riv",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setShowNameInput(false);
    setSofiaMessage(`¡Bienvenid@ ${name}! Yasta es tu billetera digital.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Título */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-8xl font-black bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
          YASTA
        </h1>
        <p className="text-3xl text-teal-100 font-light">
          Tu billetera 100% boliviana y digital
        </p>
      </div>

      {/* Sof-IA (Rive) */}
      <div className="flex justify-center mb-12 relative z-10">
        <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl bg-slate-800/50">
          <RiveComponent className="w-full h-full" />
        </div>
        <div className="absolute mt-64">
          <div className="px-8 py-4 text-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full flex items-center shadow-xl">
            <Sparkles className="w-6 h-6 mr-3" />
            Sof-IA - Asistente Virtual
          </div>
        </div>
      </div>

      {/* Mensaje */}
      <div className="max-w-4xl mx-auto mb-12 relative z-10">
        <div className="bg-slate-800/40 backdrop-blur-lg border border-teal-500/30 shadow-2xl rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Volume2 className="w-6 h-6 text-teal-400 mr-3" />
            <span className="text-teal-300 font-medium">Sof-IA te habla:</span>
          </div>
          <p className="text-2xl text-pretty font-medium text-teal-100 leading-relaxed mb-6">
            {sofiaMessage}
          </p>

          {!showNameInput && !userName && (
            <button
              onClick={() => setShowNameInput(true)}
              className="px-8 py-4 text-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl transition-all duration-300"
            >
              <Bot className="w-6 h-6 mr-3" />
              Comenzar conversación
            </button>
          )}

          {showNameInput && (
            <input
              type="text"
              placeholder="Escribe tu nombre..."
              className="w-full max-w-md mx-auto px-6 py-4 text-xl bg-slate-800/50 border border-teal-500/30 rounded-xl text-teal-100"
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleNameSubmit(e.currentTarget.value.trim());
                }
              }}
              autoFocus
            />
          )}
        </div>
      </div>
    </div>
  );
}
