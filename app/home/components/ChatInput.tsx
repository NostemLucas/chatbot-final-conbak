"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import MicrophoneButton from "./MicrophoneButton";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAudioRecorded: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  onAudioRecorded,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600/50">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Pregúntale algo a Sofía..."
          disabled={disabled}
          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="p-3 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
        <MicrophoneButton
          onAudioRecorded={onAudioRecorded}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
