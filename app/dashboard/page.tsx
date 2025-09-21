"use client";

import { useState, useEffect } from "react";
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
import InteractiveCoin, {
  type AnimationCommand,
  type AnimationType,
} from "@/components/InteractiveCoin";
import VoiceTopBar from "./ui/SpeechTopBar";
import CardItem from "./ui/CardItem";
import ModalItem from "./ui/Modal";
import { yastaTopics, Topic } from "./mocks/data";
import { useRouter } from "next/navigation";

export default function YastaLearningCards() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);
  const [animationCommand, setAnimationCommand] =
    useState<AnimationCommand | null>(null);
  const [sofiaMessage, setSofiaMessage] = useState(
    "¡Perfecto! Ahora elige cualquiera de estos temas para aprender todo sobre Yasta. Cada tema incluye videos explicativos y guías paso a paso."
  );

  const router = useRouter();

  // Función para marcar un tema como completado
  const markTopicAsCompleted = (topicId: number) => {
    setCompletedTopics((prevCompleted) => {
      if (!prevCompleted.includes(topicId)) {
        console.log(`✅ Tema ${topicId} marcado como completado`);
        return [...prevCompleted, topicId];
      }
      return prevCompleted;
    });
  };

  // Función para ejecutar animaciones en Sof-IA
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

  // Animaciones automáticas de respiración cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedTopic) {
        // Solo animar cuando no hay modal abierto
        executeAnimation("bounce");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedTopic]);

  // Animación según el progreso
  useEffect(() => {
    const progress = completedTopics.length / 7;

    if (progress === 1) {
      // Completó todo - celebración
      executeAnimation("celebrate");
      setSofiaMessage(
        "¡🎉 INCREÍBLE! Has completado todos los temas de Yasta. Ahora eres un experto en billeteras móviles. ¡Ve a jugar y ganar premios!"
      );
    } else if (progress >= 0.5) {
      // Más del 50% - brillo
      executeAnimation("glow");
      setSofiaMessage(
        "¡Excelente progreso! Ya dominas más de la mitad de los temas. ¡Sigue así para convertirte en un experto!"
      );
    } else if (completedTopics.length > 0) {
      // Progreso inicial - latido suave
      executeAnimation("heartbeat");
      setSofiaMessage(
        `¡Muy bien! Has completado ${completedTopics.length} tema${
          completedTopics.length > 1 ? "s" : ""
        }. Continúa aprendiendo para dominar Yasta completamente.`
      );
    }
  }, [completedTopics.length]);

  // 🔧 FUNCIÓN CORREGIDA: findByResponse ahora marca como completado automáticamente
  const findByResponse = (intent: string) => {
    const topic = yastaTopics.find((topic) => topic.intent === intent);
    if (topic) {
      console.log(
        "🎯 Intent detectado:",
        intent,
        "Abriendo tema:",
        topic.title
      );

      // ✅ MARCAR COMO COMPLETADO INMEDIATAMENTE cuando viene del reconocimiento de voz
      markTopicAsCompleted(topic.id);

      // Abrir el modal del tema
      handleTopicClick(topic, true); // true indica que viene de reconocimiento de voz
    } else {
      console.log("❌ No se encontró tema para el intent:", intent);
    }
  };

  // 🔧 FUNCIÓN ACTUALIZADA: handleTopicClick ahora recibe parámetro para saber el origen
  const handleTopicClick = (topic: Topic, fromVoice: boolean = false) => {
    setSelectedTopic(topic);

    executeAnimation("flip");

    // Solo marcar como completado si NO viene del reconocimiento de voz
    // (porque ya se marcó en findByResponse)
    if (!fromVoice) {
      markTopicAsCompleted(topic.id);
    }

    // Mensaje personalizado según el origen
    if (fromVoice) {
      setSofiaMessage(
        `¡Perfecto! Reconocí tu voz y te mostré "${topic.title}". Este tema ya está completado. ¿Quieres aprender sobre otro tema?`
      );
    } else {
      setSofiaMessage(
        `¡Excelente elección! Ahora sabes todo sobre "${topic.title}". ¿Te gustaría aprender sobre otro tema?`
      );
    }
  };

  const goToGames = () => {
    executeAnimation("celebrate"); // Celebrar antes de ir a juegos
    setSofiaMessage(
      "¡Fue un placer enseñarte sobre Yasta! Ahora te invito a la siguiente pantalla para ganar premios jugando."
    );

    setTimeout(() => {
      console.log("Navegando a juegos...");
    }, 1500);
    window.location.href = "https://banco-union-yasta-gamificacion.vercel.app/";
  };

  function removeTopic() {
    setSelectedTopic(null);
    executeAnimation("pulse");
  }

  // Función para manejar clicks en la moneda
  const handleCoinClick = () => {
    const progress = completedTopics.length / 7;

    if (progress === 1) {
      executeAnimation("celebrate");
    } else if (progress >= 0.5) {
      executeAnimation("showBack", "back", 3000);
    } else {
      executeAnimation("heartbeat");
    }
  };

  const resetProgress = () => {
    setCompletedTopics([]);
    setSofiaMessage(
      "Progreso reiniciado. ¡Empecemos de nuevo tu aprendizaje sobre Yasta!"
    );
    executeAnimation("flip");
  };

  const frontImage = "avatar/smile.png";

  const backImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='58' fill='%23059669' stroke='%23047857' stroke-width='2'/%3E%3Ctext x='60' y='25' font-family='Arial' font-size='12' text-anchor='middle' fill='%23FFF' font-weight='bold'%3EPROGRESO%3C/text%3E%3Ccircle cx='60' cy='50' r='25' fill='none' stroke='%23FFF' stroke-width='3'/%3E%3Ccircle cx='60' cy='50' r='25' fill='none' stroke='%2306B6D4' stroke-width='3' stroke-dasharray='${
    (completedTopics.length / 7) * 157
  }' stroke-dashoffset='39.25' transform='rotate(-90 60 50)'/%3E%3Ctext x='60' y='55' font-family='Arial' font-size='16' text-anchor='middle' fill='%23FFF' font-weight='bold'%3E${Math.round(
    (completedTopics.length / 7) * 100
  )}%25%3C/text%3E%3Ctext x='60' y='80' font-family='Arial' font-size='10' text-anchor='middle' fill='%23FFF' font-weight='bold'%3E${
    completedTopics.length
  }/7%3C/text%3E%3Ctext x='60' y='95' font-family='Arial' font-size='8' text-anchor='middle' fill='%23FFF'%3ETemas%3C/text%3E%3Ctext x='60' y='105' font-family='Arial' font-size='8' text-anchor='middle' fill='%23FFF'%3ECompletados%3C/text%3E%3C/svg%3E`;

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

      {/* 🔧 BOTÓN DE DEBUG (solo visible en desarrollo) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={resetProgress}
            className="px-3 py-2 bg-red-500/80 text-white text-xs rounded-lg hover:bg-red-600/80"
          >
            Reset Progreso
          </button>
        </div>
      )}

      <div className="text-center mb-6 sm:mb-12 lg:mb-16 relative z-10 mt-18">
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

      {/* Sof-IA Interactiva */}
      <div className="flex justify-center mb-6 sm:mb-12 relative z-10">
        <div
          className="relative group cursor-pointer"
          onClick={handleCoinClick}
        >
          <div className="w-24 h-24 sm:w-40 sm:h-40 lg:w-64 lg:h-64 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20 group-hover:scale-105 transition-transform duration-300">
            <InteractiveCoin
              frontImage={frontImage}
              backImage={backImage}
              size={240} // Tamaño ajustado al contenedor
              frontLabel="Sof-IA"
              backLabel="Progreso"
              animationCommand={animationCommand}
              onAnimationComplete={(result) => {
                console.log(`Sof-IA completó animación: ${result.type}`);
              }}
              className="transform scale-75 sm:scale-90 lg:scale-100"
            />

            {/* Efectos decorativos */}
            <div className="absolute top-1 sm:top-4 right-2 sm:right-6">
              <Sparkles className="w-3 h-3 sm:w-6 sm:h-6 text-yellow-300 animate-pulse" />
            </div>
            <div className="absolute bottom-2 sm:bottom-6 left-1 sm:left-4">
              <Sparkles className="w-2 h-2 sm:w-4 sm:h-4 text-pink-300 animate-pulse" />
            </div>
          </div>

          {/* Halo de fondo */}
          <div className="absolute inset-0 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-teal-400/40 via-cyan-500/40 to-blue-600/40 rounded-full blur-xl animate-pulse"></div>

          {/* Tooltip de interacción */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm text-white text-xs sm:text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            {completedTopics.length === 7
              ? "¡Felicitaciones! 🎉"
              : completedTopics.length >= 4
              ? "¡Excelente progreso!"
              : "Haz clic para ver progreso"}
          </div>
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
            <div
              className="text-xs sm:text-lg lg:text-xl xl:text-2xl px-3 sm:px-6 lg:px-8 py-1 sm:py-3 lg:py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 rounded-lg sm:rounded-2xl font-bold shadow-lg text-center cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => executeAnimation("showBack", "back", 3000)}
            >
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
                onClick={(topic) => handleTopicClick(topic, false)} // false = click manual
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
              onClick={() => {
                executeAnimation("flip", "front");
                setTimeout(() => console.log("Volver al inicio"), 1000);
                router.push("/");
              }}
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
