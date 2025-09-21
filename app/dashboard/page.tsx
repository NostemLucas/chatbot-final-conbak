"use client";

import { useState } from "react";
import {
  Bot,
  Volume2,
  Smartphone,
  CreditCard,
  Banknote,
  Shield,
  FileText,
  Gift,
  TrendingUp,
  Gamepad2,
  Play,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import VoiceTopBar from "./ui/SpeechTopBar";
import CardItem from "./ui/CardItem";
import ModalItem from "./ui/Modal";
import { yastaTopics, Topic } from "./mocks/data";

export default function YastaLearningCards() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);
  const [sofiaMessage, setSofiaMessage] = useState(
    "¡Perfecto! Ahora elige cualquiera de estos temas para aprender todo sobre Yasta. Cada tema incluye videos explicativos y guías paso a paso."
  );

  const findByResponse = (intent: string) => {
    const topic = yastaTopics.find((topic) => topic.intent === intent);
    if (topic) {
      console.log("Intento detectado:", intent, "Abriendo tema:", topic.title);
      handleTopicClick(topic);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    if (!completedTopics.includes(topic.id)) {
      setCompletedTopics([...completedTopics, topic.id]);
    }

    setSofiaMessage(
      `¡Excelente elección! Ahora sabes todo sobre "${topic.title}". ¿Te gustaría aprender sobre otro tema?`
    );
  };

  const goToGames = () => {
    setSofiaMessage(
      "¡Fue un placer enseñarte sobre Yasta! Ahora te invito a la siguiente pantalla para ganar premios jugando."
    );
    console.log("Navegando a juegos...");
  };

  function removeTopic() {
    setSelectedTopic(null);
  }

  const { RiveComponent } = useRive({
    src: "/model.riv",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-teal-400/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-72 sm:w-[600px] h-72 sm:h-[600px] bg-gradient-to-r from-cyan-400/30 to-teal-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-16 sm:top-32 right-16 sm:right-32 w-3 sm:w-4 h-3 sm:h-4 bg-teal-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-16 sm:left-32 w-4 sm:w-6 h-4 sm:h-6 bg-cyan-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-32 sm:top-64 left-1/4 w-2 sm:w-3 h-2 sm:h-3 bg-purple-400 rounded-full animate-ping opacity-50"></div>
      </div>

      <VoiceTopBar handleResponse={findByResponse} />

      <div className="text-center mb-6 sm:mb-12 lg:mb-16 relative z-10">
        <div className="mb-3 sm:mb-6">
          <h1 className="text-2xl sm:text-5xl lg:text-6xl xl:text-8xl font-extrabold leading-tight bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]">
            Aprende con <span className="text-white/90">Sof-IA</span>
          </h1>
          <p className="mt-1 sm:mt-4 text-xs sm:text-lg lg:text-xl xl:text-3xl text-teal-100 font-medium tracking-wide max-w-3xl mx-auto px-2">
            Tu asistente virtual de educación financiera{" "}
            <br className="hidden sm:block" />
            que te guía paso a paso de manera práctica y segura.
          </p>
        </div>

        <div className="mt-2 sm:mt-6 w-12 sm:w-24 h-0.5 sm:h-1 mx-auto bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full shadow-md"></div>
      </div>

      <div className="flex justify-center mb-6 sm:mb-12 relative z-10">
        <div className="relative">
          <div className="w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce relative overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20">
            <RiveComponent />
            <div className="absolute top-1 sm:top-4 right-2 sm:right-6">
              <Sparkles className="w-3 h-3 sm:w-6 sm:h-6 text-yellow-300 animate-pulse" />
            </div>
            <div className="absolute bottom-2 sm:bottom-6 left-1 sm:left-4">
              <Sparkles className="w-2 h-2 sm:w-4 sm:h-4 text-pink-300 animate-pulse" />
            </div>
          </div>
          <div className="absolute inset-0 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-teal-400/40 via-cyan-500/40 to-blue-600/40 rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-6 sm:mb-12 relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl border-2 border-teal-500/40 shadow-2xl rounded-xl sm:rounded-3xl">
          <div className="p-3 sm:p-6 lg:p-10 text-center">
            <div className="flex items-center justify-center mb-3 sm:mb-6">
              <Volume2 className="w-4 h-4 sm:w-8 sm:h-8 text-teal-400 mr-2 sm:mr-4 animate-pulse" />
              <span className="text-base sm:text-2xl lg:text-3xl text-teal-300 font-bold">
                Sof-IA:
              </span>
            </div>
            <p className="text-xs sm:text-xl lg:text-2xl xl:text-3xl text-pretty font-medium text-teal-100 leading-relaxed max-w-4xl mx-auto">
              {sofiaMessage}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-6 sm:mb-12 lg:mb-16 relative z-10">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl sm:rounded-3xl p-3 sm:p-6 lg:p-10 border-2 border-teal-500/40 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 space-y-2 sm:space-y-0">
            <h2 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-teal-100 text-center sm:text-left">
              Tu Progreso de Aprendizaje
            </h2>
            <div className="text-xs sm:text-lg lg:text-xl xl:text-2xl px-3 sm:px-6 lg:px-8 py-1 sm:py-3 lg:py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 rounded-lg sm:rounded-2xl font-bold shadow-lg text-center">
              {completedTopics.length}/7 Temas Completados
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 sm:h-6 shadow-inner">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 sm:h-6 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
              style={{ width: `${(completedTopics.length / 7) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-center mt-2 sm:mt-4">
            <p className="text-xs sm:text-lg lg:text-xl text-slate-300">
              {completedTopics.length === 7
                ? "¡Felicitaciones! Has completado todo el aprendizaje 🎉"
                : `Faltan ${
                    7 - completedTopics.length
                  } temas para completar tu educación financiera`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-6 sm:mb-12 lg:mb-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
          {yastaTopics.map((topic) => {
            const isCompleted = completedTopics.includes(topic.id);
            return (
              <CardItem
                key={topic.id}
                isCompleted={isCompleted}
                onClick={handleTopicClick}
                topic={topic}
              />
            );
          })}
        </div>
      </div>

      <div className="text-center relative z-10">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <button
            onClick={goToGames}
            className="px-6 sm:px-8 lg:px-12 cursor-pointer py-3 sm:py-4 lg:py-6 text-lg sm:text-xl lg:text-2xl xl:text-3xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 rounded-xl sm:rounded-2xl flex items-center mx-auto transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold"
          >
            <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-2 sm:mr-3 lg:mr-4" />
            🎮 Ir a Juegos y Premios
          </button>

          <div>
            <button
              onClick={() => console.log("Volver al inicio")}
              className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-base sm:text-lg lg:text-xl xl:text-2xl border-2 border-teal-500/60 text-teal-300 hover:bg-teal-500/20 rounded-xl sm:rounded-2xl transition-all duration-300 font-medium"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>

      {selectedTopic && (
        <ModalItem topic={selectedTopic!} handleClick={removeTopic} />
      )}
    </div>
  );
}
