"use client";
import { useState, useEffect } from "react";
import { List, Gamepad2, Trophy } from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import ChatInput from "@/components/ChatInput";
import ResponseDisplay from "@/components/ResponseDisplay";
import TopicsModal from "@/components/TopicsModal";
import TopicsSlider from "@/components/TopicSlider";
import { sendTextMessage, sendAudioMessage } from "@/lib/api";
import { yastaTopics } from "@/data/topics";
import { Topic } from "@/types";
import { useRouter } from "next/navigation";

export default function SofiaApp() {
  const [message, setMessage] = useState(
    "¡Hola! Soy Sof-IA, tu asistente virtual de Yasta. ¿En qué puedo ayudarte hoy?"
  );
  const [userQuestion, setUserQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const router = useRouter();

  const handleTextMessage = async (userMessage: string) => {
    setIsProcessing(true);
    setIsAnimating(true);
    setUserQuestion(userMessage);
    setIsInitialLoad(false); // Ya no es carga inicial

    try {
      const response = await sendTextMessage(userMessage);
      setMessage(
        response.dialogflow.fulfillmentText ||
          "Lo siento, no pude procesar tu mensaje."
      );
    } catch (error) {
      setMessage("Error al procesar tu mensaje. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
      setIsAnimating(false);
    }
  };

  const handleAudioMessage = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setIsAnimating(true);
    setIsInitialLoad(false); // Ya no es carga inicial

    try {
      const response = await sendAudioMessage(audioBlob);

      if (response.transcript) {
        setUserQuestion(response.transcript);
      } else {
        setUserQuestion("Pregunta realizada por audio");
      }

      setMessage(
        response.dialogflow.fulfillmentText ||
          "Lo siento, no pude procesar tu audio."
      );
    } catch (error) {
      setMessage("Error al procesar tu audio. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
      setIsAnimating(false);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setUserQuestion(`Tema seleccionado: ${topic.title}`);
    setMessage(`Has seleccionado: ${topic.title}. ${topic.description}`);
    setIsInitialLoad(false); // Ya no es carga inicial
    router.push(`/${topic.intent}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col justify-center min-h-[80vh]">
        {/* Avatar centrado */}
        <div className="flex justify-center mb-8">
          <AgentAvatar
            isAnimating={isAnimating}
            imageUrl={"/avatar/smile.png"}
          />
        </div>

        {/* Mostrar pregunta del usuario */}
        {userQuestion && (
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-300/30 rounded-xl px-6 py-3 max-w-2xl">
              <p className="text-blue-100 text-sm font-medium text-center">
                Tu pregunta: "{userQuestion}"
              </p>
            </div>
          </div>
        )}

        {/* Respuesta centrada */}
        <div className="mb-8">
          <ResponseDisplay
            message={message}
            isProcessing={isProcessing}
            autoSpeak={isInitialLoad && !isProcessing}
          />
        </div>

        {/* Input centrado */}
        <div className="mb-8">
          <ChatInput
            onSendMessage={handleTextMessage}
            onAudioRecorded={handleAudioMessage}
            disabled={isProcessing}
          />
        </div>

        {/* Botones centrados con diseños diferentes */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          {/* Botón Temas Sugeridos */}
          <button
            onClick={() => setIsTopicsOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg"
          >
            <List className="w-6 h-6 mr-3" />
            Preguntas Frecuentes
          </button>

          {/* Botón Juegos con diseño diferente - estilo gaming */}
          <button
            onClick={() =>
              window.open(
                "https://banco-union-yasta-gamificacion.vercel.app/ ",
                "_self"
              )
            }
            className="px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 hover:from-orange-600 hover:via-red-600 hover:to-yellow-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg border-2 border-yellow-400/50 hover:border-yellow-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Gamepad2 className="w-6 h-6 mr-3 z-10" />
            <span className="z-10">Juegos y Más en Yasta</span>
            <Trophy className="w-5 h-5 ml-2 z-10 animate-pulse" />
          </button>
        </div>

        {/* Slider de temas */}
        <div className="mb-6">
          <TopicsSlider
            topics={yastaTopics}
            onTopicSelect={handleTopicSelect}
          />
        </div>

        {/* Modal de temas */}
        <TopicsModal
          isOpen={isTopicsOpen}
          onClose={() => setIsTopicsOpen(false)}
          topics={yastaTopics}
          onTopicSelect={handleTopicSelect}
        />
      </div>
    </div>
  );
}
