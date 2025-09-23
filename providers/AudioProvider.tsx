"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface AudioContextType {
  hasUserInteracted: boolean;
  setUserInteracted: () => void;
  pendingAutoPlays: Set<string>;
  addPendingAutoPlay: (id: string) => void;
  removePendingAutoPlay: (id: string) => void;
  triggerAutoPlay: (id: string) => void; // Nueva función para activar autoplay directamente
  autoPlayCallbacks: Map<string, () => void>; // Callbacks para ejecutar autoplay
  registerAutoPlayCallback: (id: string, callback: () => void) => void;
  unregisterAutoPlayCallback: (id: string) => void;
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

  const setUserInteracted = useCallback(() => {
    setHasUserInteracted(true);

    // Ejecutar todos los autoplay pendientes
    autoPlayCallbacks.forEach((callback, id) => {
      if (pendingAutoPlays.has(id)) {
        try {
          callback();
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
          callback();
          removePendingAutoPlay(id);
        } catch (error) {
          console.error(`Error ejecutando autoplay para ${id}:`, error);
        }
      }
    },
    [autoPlayCallbacks, removePendingAutoPlay]
  );

  const registerAutoPlayCallback = useCallback(
    (id: string, callback: () => void) => {
      setAutoPlayCallbacks((prev) => new Map(prev).set(id, callback));
    },
    []
  );

  const unregisterAutoPlayCallback = useCallback((id: string) => {
    setAutoPlayCallbacks((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

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
    ]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
