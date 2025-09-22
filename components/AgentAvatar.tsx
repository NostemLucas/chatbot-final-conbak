"use client";
import { useState } from "react";
import { Bot } from "lucide-react";

interface AgentAvatarProps {
  imageUrl?: string;
  isAnimating?: boolean;
}

export default function AgentAvatar({
  imageUrl,
  isAnimating = false,
}: AgentAvatarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-center mb-8">
      <div
        className={`mx-auto mb-6 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 transition-all duration-500 cursor-pointer ${
          isExpanded ? "w-40 h-40" : "w-32 h-32"
        } ${isAnimating ? "animate-pulse" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
        onAnimationEnd={() => setIsExpanded(false)}
      >
        <div
          className={`bg-white rounded-full flex items-center justify-center transition-all duration-500 ${
            isExpanded ? "w-32 h-32" : "w-24 h-24"
          }`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Agent"
              className={`rounded-full transition-all duration-500 ${
                isExpanded ? "w-42 h-42" : "w-36 h-36"
              }`}
            />
          ) : (
            <Bot
              className={`text-teal-600 transition-all duration-500 ${
                isExpanded ? "w-16 h-16" : "w-12 h-12"
              }`}
            />
          )}
        </div>
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-2">Sof-IA</h1>
      <p className="text-teal-200 text-lg">Tu asistente virtual de Yasta</p>
    </div>
  );
}
