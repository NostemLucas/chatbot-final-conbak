"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Topic } from '@/types';

interface TopicsSliderProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

export default function TopicsSlider({ topics, onTopicSelect }: TopicsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTopic = () => {
    setCurrentIndex((prev) => (prev + 1) % topics.length);
  };

  const prevTopic = () => {
    setCurrentIndex((prev) => (prev - 1 + topics.length) % topics.length);
  };

  const goToTopic = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTopic = topics[currentIndex];
  const IconComponent = currentTopic?.icon;

  if (!currentTopic) return null;

  return (
    <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 border border-slate-600/50">
      <h3 className="text-xl font-semibold text-white mb-6 text-center">
        Explora los temas de Yasta
      </h3>
      
      <div className="relative">
        <div className="flex items-center justify-center">
          {/* Botón anterior */}
          <button
            onClick={prevTopic}
            className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full mr-6 transition-colors shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Tarjeta del tema */}
          <div 
            onClick={() => onTopicSelect(currentTopic)}
            className={`cursor-pointer bg-gradient-to-br ${currentTopic.color} rounded-2xl p-6 max-w-md mx-auto shadow-xl hover:scale-105 transition-transform`}
          >
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                <IconComponent className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">{currentTopic.title}</h4>
              <p className="text-white/90 text-sm mb-4">{currentTopic.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm opacity-75">
                <ExternalLink className="w-4 h-4" />
                <span>Toca para seleccionar</span>
              </div>
            </div>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={nextTopic}
            className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full ml-6 transition-colors shrink-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-6">
          {topics.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTopic(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? "bg-teal-400" 
                  : "bg-slate-600 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
