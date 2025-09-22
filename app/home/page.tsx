"use client";
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Volume2,
  VolumeX,
  Smartphone,
  CreditCard,
  Banknote,
  Shield,
  FileText,
  Gift,
  TrendingUp,
  Gamepad2,
  Sparkles,
  Mic,
  Send,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Mock data simplificado - solo lo esencial
const yastaTopics = [
  {
    id: 1,
    title: "¿Qué es Yasta?",
    intent: "que_es_yasta",
    description: "Aprende qué es Yasta y cómo funciona tu billetera móvil",
    icon: Smartphone,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 2,
    title: "Cómo enviar dinero",
    intent: "enviar_dinero",
    description: "Pasos para enviar dinero de forma segura",
    icon: CreditCard,
    color: "from-green-500 to-teal-600",
  },
  {
    id: 3,
    title: "Recarga de saldo",
    intent: "recarga_saldo",
    description: "Diferentes formas de recargar tu saldo",
    icon: Banknote,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 4,
    title: "Seguridad",
    intent: "seguridad",
    description: "Mantén tu cuenta segura con estos consejos",
    icon: Shield,
    color: "from-red-500 to-orange-600",
  },
  {
    id: 5,
    title: "Pagos de servicios",
    intent: "pagar_servicios",
    description: "Paga tus servicios básicos fácilmente",
    icon: FileText,
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: 6,
    title: "Promociones",
    intent: "promociones",
    description: "Conoce las promociones y beneficios disponibles",
    icon: Gift,
    color: "from-yellow-500 to-orange-600",
  },
  {
    id: 7,
    title: "Historial de transacciones",
    intent: "historial",
    description: "Revisa tus movimientos y transacciones",
    icon: TrendingUp,
    color: "from-cyan-500 to-blue-600",
  },
];

export default function SofiaSimplifiedApp() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [sofiaMessage, setSofiaMessage] = useState(
    "¡Hola! Soy Sof-IA, tu asistente virtual de Yasta. Pregúntame lo que quieras sobre tu billetera móvil o navega por los temas usando las flechas."
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      type: "sofia",
      message:
        "¡Hola! Soy Sof-IA, tu asistente virtual de Yasta. Pregúntame lo que quieras sobre tu billetera móvil o navega por los temas usando las flechas.",
      timestamp: new Date(),
    },
  ]);

  const synthRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Inicializar speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Función para hablar
  const speakText = (text) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(
        (voice) =>
          voice.lang.includes("es") ||
          voice.name.toLowerCase().includes("spanish")
      );

      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }, 100);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(sofiaMessage);
    }
  };

  // Navegación del slider
  const nextTopic = () => {
    setCurrentTopicIndex((prev) => (prev + 1) % yastaTopics.length);
  };

  const prevTopic = () => {
    setCurrentTopicIndex(
      (prev) => (prev - 1 + yastaTopics.length) % yastaTopics.length
    );
  };

  // Simulación de respuesta de Sofía
  const simulateSofiaResponse = (userMessage) => {
    const currentTopic = yastaTopics[currentTopicIndex];

    // Respuestas simuladas basadas en el tema actual
    const responses = {
      que_es_yasta:
        "Yasta es tu billetera móvil de Banco Unión que te permite enviar dinero, pagar servicios y recargar saldo desde tu teléfono de forma segura y fácil.",
      enviar_dinero:
        "Para enviar dinero: 1) Abre Yasta, 2) Selecciona 'Enviar dinero', 3) Ingresa el número del destinatario, 4) Escribe el monto, 5) Confirma con tu PIN.",
      recarga_saldo:
        "Puedes recargar saldo en agentes Yasta, cajeros automáticos, transferencias bancarias o desde la app con tu tarjeta de débito.",
      seguridad:
        "Para mantener tu cuenta segura: nunca compartas tu PIN, verifica siempre los datos antes de confirmar, y reporta cualquier movimiento sospechoso.",
      pagar_servicios:
        "En Yasta puedes pagar luz, agua, gas, telefonía y más. Solo selecciona el servicio, ingresa tu código de cliente y confirma el pago.",
      promociones:
        "¡Tenemos promociones especiales! Consulta regularmente la sección de ofertas en tu app para descuentos y cashback.",
      historial:
        "Tu historial muestra todas tus transacciones. Puedes filtrarlo por fechas y descargar reportes desde la app.",
    };

    const response =
      responses[currentTopic.intent] ||
      "Interesante pregunta. Te ayudo con información sobre " +
        currentTopic.title +
        ". ¿Qué específicamente te gustaría saber?";

    return response;
  };

  // Manejar envío de texto
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      type: "user",
      message: userInput,
      timestamp: new Date(),
    };

    // Simular respuesta de Sofía
    const sofiaResponse = simulateSofiaResponse(userInput);
    const sofiaMsg = {
      type: "sofia",
      message: sofiaResponse,
      timestamp: new Date(),
    };

    setConversationHistory((prev) => [...prev, userMessage, sofiaMsg]);
    setSofiaMessage(sofiaResponse);
    setUserInput("");

    // Hablar la respuesta
    setTimeout(() => {
      speakText(sofiaResponse);
    }, 500);
  };

  // Grabar audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        handleAudioUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleAudioUpload = async (audioBlob) => {
    // Simulación de procesamiento de audio
    const userMessage = {
      type: "user",
      message: "(Mensaje de audio)",
      timestamp: new Date(),
    };

    const sofiaResponse =
      "He recibido tu mensaje de audio. " + simulateSofiaResponse("audio");
    const sofiaMsg = {
      type: "sofia",
      message: sofiaResponse,
      timestamp: new Date(),
    };

    setConversationHistory((prev) => [...prev, userMessage, sofiaMsg]);
    setSofiaMessage(sofiaResponse);

    setTimeout(() => {
      speakText(sofiaResponse);
    }, 500);
  };

  // Abrir tema en nueva página
  const openTopicDetail = () => {
    const currentTopic = yastaTopics[currentTopicIndex];
    // Aquí podrías abrir en una nueva pestaña o navegar
    window.open(`/topic/${currentTopic.id}`, "_blank");
  };

  const currentTopic = yastaTopics[currentTopicIndex];
  const IconComponent = currentTopic.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con Sofía */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-12 h-12 text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Sof-IA</h1>
          <p className="text-teal-200 text-lg">Tu asistente virtual de Yasta</p>
        </div>

        {/* Cuadro de respuesta de Sofía */}
        <div className="bg-slate-800/50 backdrop-blur-xl border-2 border-teal-500/40 shadow-2xl rounded-3xl mb-8">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={toggleSpeech}
                className={`mr-4 p-3 rounded-full transition-all duration-300 hover:scale-110 ${
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
              <span className="text-2xl text-teal-300 font-bold">
                {isSpeaking ? "Sofía está hablando:" : "Sofía:"}
              </span>
            </div>
            <p className="text-xl text-teal-100 leading-relaxed text-center max-w-3xl mx-auto">
              {sofiaMessage}
            </p>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600/50">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Pregúntale algo a Sofía..."
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20"
            />

            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim()}
              className="p-3 bg-blue-500/20 border border-blue-400/50 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-xl border transition-all ${
                isRecording
                  ? "bg-red-500/20 border-red-400/50 text-red-300 animate-pulse"
                  : "bg-teal-500/20 border-teal-400/50 text-teal-300 hover:bg-teal-500/30"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider de temas */}
        <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 border border-slate-600/50">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Explora los temas de Yasta
          </h3>

          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={prevTopic}
                className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full mr-6 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div
                onClick={openTopicDetail}
                className={`cursor-pointer bg-gradient-to-br ${currentTopic.color} rounded-2xl p-6 max-w-md mx-auto shadow-xl hover:scale-105 transition-transform`}
              >
                <div className="text-center text-white">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">
                    {currentTopic.title}
                  </h4>
                  <p className="text-white/90 text-sm mb-4">
                    {currentTopic.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm opacity-75">
                    <ExternalLink className="w-4 h-4" />
                    <span>Toca para ver más detalles</span>
                  </div>
                </div>
              </div>

              <button
                onClick={nextTopic}
                className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full ml-6 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {yastaTopics.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTopicIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTopicIndex
                      ? "bg-teal-400"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Input con botones */}

        {/* Botón para juegos */}
        <div className="text-center mt-8">
          <button className="px-8 py-4 text-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl flex items-center mx-auto transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-105 font-bold">
            <Gamepad2 className="w-8 h-8 mr-3" />
            🎮 Ir a Juegos y Premios
          </button>
        </div>
      </div>
    </div>
  );
}
