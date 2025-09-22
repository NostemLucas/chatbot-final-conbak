"use client";
import { useState } from "react";
import { List } from "lucide-react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter();

  const handleTextMessage = async (userMessage: string) => {
    setIsProcessing(true);
    setIsAnimating(true);

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

    try {
      const response = await sendAudioMessage(audioBlob);
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
    setMessage(`Has seleccionado: ${topic.title}. ${topic.description}`);
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

        {/* Respuesta centrada */}
        <div className="mb-8">
          <ResponseDisplay
            message={message}
            isProcessing={isProcessing}
            autoSpeak={!isProcessing}
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

        {/* Botón de temas centrado */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsTopicsOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl flex items-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-lg"
          >
            <List className="w-6 h-6 mr-3" />
            Ver Todos los Temas
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
