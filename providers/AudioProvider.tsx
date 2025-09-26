"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  XCircle,
  Wifi,
  Shield,
  HardDrive,
  Volume2,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface AlertData {
  id: string;
  type: "default" | "destructive";
  title: string;
  description: string;
  icon: React.ReactNode;
  timestamp: number;
}

interface AudioContextType {
  hasUserInteracted: boolean;
  setUserInteracted: () => void;
  pendingAutoPlays: Set<string>;
  addPendingAutoPlay: (id: string) => void;
  removePendingAutoPlay: (id: string) => void;
  triggerAutoPlay: (id: string) => void;
  autoPlayCallbacks: Map<string, () => void>;
  registerAutoPlayCallback: (id: string, callback: () => void) => void;
  unregisterAutoPlayCallback: (id: string) => void;

  // Control de audio por página
  currentPage: string;
  stopAllAudio: () => void;

  // Sistema de alertas
  alerts: AlertData[];
  showAlert: (
    type: "default" | "destructive",
    title: string,
    description: string,
    icon: React.ReactNode,
    duration?: number
  ) => void;
  dismissAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within AudioProvider");
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [pendingAutoPlays, setPendingAutoPlays] = useState<Set<string>>(
    new Set()
  );
  const [autoPlayCallbacks, setAutoPlayCallbacks] = useState<
    Map<string, () => void>
  >(new Map());
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("");

  const pathname = usePathname();

  // Efecto para detectar cambios de página
  useEffect(() => {
    const newPage = pathname || "/";

    // Si cambió la página, detener todos los audios
    if (currentPage && currentPage !== newPage) {
      console.log(`Cambio de página detectado: ${currentPage} -> ${newPage}`);
      stopAllAudio();
    }

    setCurrentPage(newPage);
  }, [pathname, currentPage]);

  // Función para detener todos los audios
  const stopAllAudio = useCallback(() => {
    // Detener todos los elementos de audio y video en la página
    const allAudioElements = document.querySelectorAll("audio, video");
    allAudioElements.forEach((element) => {
      if (
        element instanceof HTMLAudioElement ||
        element instanceof HTMLVideoElement
      ) {
        element.pause();
        element.currentTime = 0;
      }
    });

    // Detener speech synthesis si está activo
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Limpiar callbacks pendientes
    setPendingAutoPlays(new Set());

    console.log("Todos los audios han sido detenidos");
  }, []);

  const setUserInteracted = useCallback(() => {
    setHasUserInteracted(true);

    // Solo ejecutar autoplay pendientes si estamos en la página correcta
    autoPlayCallbacks.forEach((callback, id) => {
      if (pendingAutoPlays.has(id)) {
        try {
          // Verificar si el elemento todavía existe en el DOM
          const element = document.querySelector(`[data-audio-id="${id}"]`);
          if (element) {
            callback();
          } else {
            console.log(
              `Elemento de audio ${id} no encontrado en DOM, saltando`
            );
          }
        } catch (error) {
          console.error(`Error ejecutando autoplay para ${id}:`, error);
        }
      }
    });
  }, [autoPlayCallbacks, pendingAutoPlays]);

  const addPendingAutoPlay = useCallback((id: string) => {
    setPendingAutoPlays((prev) => new Set(prev).add(id));
  }, []);

  const removePendingAutoPlay = useCallback((id: string) => {
    setPendingAutoPlays((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const triggerAutoPlay = useCallback(
    (id: string) => {
      const callback = autoPlayCallbacks.get(id);
      if (callback) {
        try {
          // Verificar si el elemento todavía existe
          const element = document.querySelector(`[data-audio-id="${id}"]`);
          if (element) {
            callback();
            removePendingAutoPlay(id);
          } else {
            console.log(`Elemento de audio ${id} no encontrado para trigger`);
          }
        } catch (error) {
          console.error(`Error ejecutando autoplay para ${id}:`, error);
        }
      }
    },
    [autoPlayCallbacks, removePendingAutoPlay]
  );

  const registerAutoPlayCallback = useCallback(
    (id: string, callback: () => void) => {
      console.log(`Registrando callback de audio para: ${id}`);
      setAutoPlayCallbacks((prev) => new Map(prev).set(id, callback));
    },
    []
  );

  const unregisterAutoPlayCallback = useCallback(
    (id: string) => {
      console.log(`Desregistrando callback de audio para: ${id}`);
      setAutoPlayCallbacks((prev) => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
      removePendingAutoPlay(id);
    },
    [removePendingAutoPlay]
  );

  // Sistema de alertas
  const showAlert = useCallback(
    (
      type: "default" | "destructive",
      title: string,
      description: string,
      icon: React.ReactNode,
      duration: number = 8000
    ) => {
      const id = `alert-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newAlert: AlertData = {
        id,
        type,
        title,
        description,
        icon,
        timestamp: Date.now(),
      };

      setAlerts((prev) => [...prev, newAlert]);

      // Auto-remover después del tiempo especificado
      if (duration > 0) {
        setTimeout(() => {
          dismissAlert(id);
        }, duration);
      }
    },
    []
  );

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Limpiar todo cuando se desmonta el componente
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  const value = React.useMemo(
    () => ({
      hasUserInteracted,
      setUserInteracted,
      pendingAutoPlays,
      addPendingAutoPlay,
      removePendingAutoPlay,
      triggerAutoPlay,
      autoPlayCallbacks,
      registerAutoPlayCallback,
      unregisterAutoPlayCallback,
      currentPage,
      stopAllAudio,
      alerts,
      showAlert,
      dismissAlert,
      clearAllAlerts,
    }),
    [
      hasUserInteracted,
      setUserInteracted,
      pendingAutoPlays,
      addPendingAutoPlay,
      removePendingAutoPlay,
      triggerAutoPlay,
      autoPlayCallbacks,
      registerAutoPlayCallback,
      unregisterAutoPlayCallback,
      currentPage,
      stopAllAudio,
      alerts,
      showAlert,
      dismissAlert,
      clearAllAlerts,
    ]
  );

  return (
    <AudioContext.Provider value={value}>
      {/* Container de alertas */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.type}
            className="shadow-lg border animate-in slide-in-from-right-full duration-300"
          >
            {alert.icon}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </Alert>
        ))}
      </div>

      {children}
    </AudioContext.Provider>
  );
};
