"use client";
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
}

export default function TextToSpeech({
  text,
  autoPlay = false,
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    if (autoPlay && text && speechSupported) {
      speakText(text);
    }
  }, [text, autoPlay, speechSupported]);

  const speakText = (textToSpeak: string) => {
    if (!synthRef.current || !speechSupported || !textToSpeak) return;

    synthRef.current.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = synthRef.current?.getVoices() || [];
      const spanishVoice = voices.find((voice) => voice.lang.includes("es"));

      if (spanishVoice) utterance.voice = spanishVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current?.speak(utterance);
    }, 100);
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text);
    }
  };

  return (
    <button
      onClick={toggleSpeech}
      disabled={!speechSupported || !text}
      className={`p-3 rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
        isSpeaking
          ? "bg-red-500/20 border border-red-400/50"
          : "bg-teal-500/20 border border-teal-400/50"
      }`}
    >
      {isSpeaking ? (
        <VolumeX className="w-6 h-6 text-red-300 animate-pulse" />
      ) : (
        <Volume2 className="w-6 h-6 text-teal-400" />
      )}
    </button>
  );
}
