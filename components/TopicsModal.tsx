// components/TopicsModal.tsx
"use client";
import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { Topic } from "@/types";

interface TopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}

export default function TopicsModal({
  isOpen,
  onClose,
  topics,
  onTopicSelect,
}: TopicsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Temas de Yasta</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
                    <p className="text-white/90 text-sm">{topic.description}</p>
                  </div>
                  <ExternalLink className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
