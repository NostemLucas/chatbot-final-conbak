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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <AgentAvatar isAnimating={isAnimating} imageUrl={"/avatar/smile.png"} />

        <ResponseDisplay
          message={message}
          isProcessing={isProcessing}
          autoSpeak={!isProcessing}
        />

        <ChatInput
          onSendMessage={handleTextMessage}
          onAudioRecorded={handleAudioMessage}
          disabled={isProcessing}
        />

        <div className="text-center mt-6">
          <button
            onClick={() => setIsTopicsOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl flex items-center mx-auto transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold"
          >
            <List className="w-5 h-5 mr-2" />
            Ver Todos los Temas
          </button>
        </div>

        {/* Slider de temas */}
        <TopicsSlider topics={yastaTopics} onTopicSelect={handleTopicSelect} />
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
