// components/TopicsModal.tsx
"use client";
import { useState } from "react";
import { X, ExternalLink, HelpCircle } from "lucide-react";
import { Topic } from "@/types";

interface TopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
  onFAQSelect?: (question: string) => void; // Nueva prop para manejar preguntas FAQ
  showFAQ?: boolean; // Nueva prop para mostrar FAQ
}

// Lista de preguntas frecuentes
const faqQuestions = [
  "¿Qué es Yasta?",
  "¿Cómo me registro en Yasta?",
  "¿Qué requisitos necesito para usar Yasta?",
  "¿Cómo recupero el acceso a mi cuenta?",
  "¿Qué tan segura es mi billetera digital?",
  "¿Qué tecnologías de seguridad utilizan?",
  "¿Qué tipos de billeteras manejan?",
  "¿Cómo uso el código QR?",
  "¿Cómo veo mi extracto?",
  "¿Cuáles son los beneficios de las stablecoins?",
  "¿Cuánto consume de datos la app?",
  "¿Cuáles son los costos de usar Yasta?",
  "¿Cómo envío y recibo dinero?",
  "¿Cuál es el impacto en el mercado?",
  "¿Cuál es la información de la alianza?",
  "¿Qué información hay sobre las tarjetas?",
  "¿Cuál es la institución aliada?",
  "¿Cómo funcionan las notificaciones?",
  "¿Cuál es el objetivo de la alianza?",
  "¿Cómo pago servicios?",
  "¿Cómo recargo mi teléfono?",
  "¿Cómo están reguladas las stablecoins?",
  "¿Cómo retiro dinero del cajero?",
  "¿Qué servicios ofrece Yasta?",
  "¿Qué servicios de criptomonedas tienen?",
  "¿Dónde encuentro soporte y ayuda?",
  "¿Qué tarjetas crypto manejan?",
  "¿Qué es una criptomoneda?",
  "¿Qué es la tecnología blockchain y por qué es importante?",
  "¿En qué se diferencia una criptomoneda como Bitcoin de una stablecoin como USDT?",
  "¿Qué es una stablecoin?",
  "¿Qué es USDT (Tether) y por qué se ha vuelto tan popular?",
  "¿Cómo se respalda y mantiene estable el valor de una stablecoin como USDT?",
  "¿Qué es una wallet y para qué sirve en el mundo cripto?",
  "¿Qué ventajas tienen las stablecoins frente a los métodos de pago tradicionales?",
  "¿Por qué las stablecoins están ganando terreno en países como Bolivia?",
  "¿Qué debo tener en cuenta antes de empezar a usar criptomonedas o stablecoins?",
  "¿Cuáles son los beneficios de las stablecoins?",
  "¿Cómo están reguladas las stablecoins?",
  "¿Qué servicios de criptomonedas tienen?",
  "¿Qué tarjetas crypto manejan?",
];

export default function TopicsModal({
  isOpen,
  onClose,
  topics,
  onTopicSelect,
  onFAQSelect,
  showFAQ = false,
}: TopicsModalProps) {
  const [activeTab, setActiveTab] = useState<"topics" | "faq">("topics");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === "topics" ? "Temas de Yasta" : "Preguntas Frecuentes"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs - Solo mostrar si showFAQ es true */}
        {showFAQ && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("topics")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "topics"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Temas
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "faq"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <HelpCircle className="w-4 h-4 inline mr-2" />
              FAQ
            </button>
          </div>
        )}

        {/* Contenido de Temas */}
        {activeTab === "topics" && (
          <div className="grid gap-4">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    onTopicSelect(topic);
                    onClose();
                  }}
                  className={`bg-gradient-to-br ${topic.color} rounded-xl p-4 text-white hover:scale-105 transition-transform text-left`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{topic.title}</h3>
                      <p className="text-white/90 text-sm">
                        {topic.description}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Contenido de FAQ */}
        {activeTab === "faq" && (
          <div className="space-y-3">
            {faqQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  if (onFAQSelect) {
                    onFAQSelect(question);
                    onClose();
                  }
                }}
                className="w-full bg-slate-700/50 rounded-lg p-4 text-white hover:bg-slate-700 transition-colors text-left hover:scale-105 transform duration-200"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <p className="text-sm">{question}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
