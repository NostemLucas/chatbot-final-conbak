// components/InteractiveCoin.tsx
import React, { useState, useEffect } from "react";
import styles from "./InteractiveCoin.module.css";

// Tipos de animaciones disponibles
export type AnimationType =
  | "heartbeat"
  | "breathe"
  | "celebrate"
  | "glow"
  | "excited"
  | "flip"
  | "pulse"
  | "bounce"
  | "zoom"
  | "showBack"
  | "idle";

export type CoinSide = "front" | "back";

// Comando de animación que se pasa como prop
export interface AnimationCommand {
  type: AnimationType;
  finalSide?: CoinSide;
  duration?: number;
  timestamp?: number; // Para forzar re-ejecución
}

// Props del componente
export interface InteractiveCoinProps {
  frontImage?: string;
  backImage?: string;
  size?: number;
  frontLabel?: string;
  backLabel?: string;
  className?: string;

  // Control de animaciones
  animationCommand?: AnimationCommand | null;
  currentSide?: CoinSide;
  autoReturnToFront?: boolean;

  // Callbacks
  onAnimationStart?: (command: AnimationCommand) => void;
  onAnimationComplete?: (result: {
    type: AnimationType;
    finalSide: CoinSide;
    previousSide: CoinSide;
    duration: number;
  }) => void;
  onSideChange?: (newSide: CoinSide, previousSide: CoinSide) => void;
}

const InteractiveCoin: React.FC<InteractiveCoinProps> = ({
  frontImage,
  backImage,
  size = 120,
  frontLabel = "Frente",
  backLabel = "Atrás",
  className = "",

  // Control props
  animationCommand,
  currentSide: controlledSide,
  autoReturnToFront = true,

  // Callbacks
  onAnimationStart,
  onAnimationComplete,
  onSideChange,
}) => {
  // Estados internos
  const [isAnimating, setIsAnimating] = useState(false);
  const [internalSide, setInternalSide] = useState<CoinSide>("front");
  const [animationType, setAnimationType] = useState<AnimationType>("idle");
  const [lastCommand, setLastCommand] = useState<AnimationCommand | null>(null);

  // El lado actual puede ser controlado externamente o internamente
  const currentSide = controlledSide ?? internalSide;

  // Duración por defecto de cada animación
  const getAnimationDuration = (type: AnimationType): number => {
    const durations: Record<AnimationType, number> = {
      heartbeat: 2000,
      breathe: 3000,
      celebrate: 1500,
      glow: 2200,
      excited: 1300,
      flip: 1000,
      pulse: 1800,
      bounce: 1600,
      zoom: 1500,
      showBack: 2400,
      idle: 0,
    };
    return durations[type] || 1000;
  };

  // Efecto para ejecutar animaciones cuando cambia el comando
  useEffect(() => {
    if (!animationCommand || isAnimating) return;

    // Verificar si es un comando nuevo (por timestamp o diferencia)
    const isNewCommand =
      !lastCommand ||
      animationCommand.timestamp !== lastCommand.timestamp ||
      animationCommand.type !== lastCommand.type;

    if (!isNewCommand) return;

    executeAnimation(animationCommand);
    setLastCommand({ ...animationCommand });
  }, [animationCommand, isAnimating, lastCommand]);

  // Efecto para cambios de lado controlados externamente
  useEffect(() => {
    if (controlledSide && controlledSide !== internalSide && !isAnimating) {
      const previousSide = internalSide;
      setInternalSide(controlledSide);
      onSideChange?.(controlledSide, previousSide);
    }
  }, [controlledSide, internalSide, isAnimating, onSideChange]);

  const executeAnimation = (command: AnimationCommand) => {
    const { type, finalSide, duration } = command;
    const animDuration = duration || getAnimationDuration(type);
    const previousSide = currentSide;

    // Notificar inicio de animación
    onAnimationStart?.(command);

    // Establecer estado de animación
    setIsAnimating(true);
    setAnimationType(type);

    // Manejar animación especial "showBack"
    if (type === "showBack") {
      setTimeout(() => {
        const newSide: CoinSide = "back";
        if (!controlledSide) {
          setInternalSide(newSide);
        }
        onSideChange?.(newSide, previousSide);
      }, 400);

      setTimeout(() => {
        const finalSideToUse: CoinSide = autoReturnToFront ? "front" : "back";
        if (!controlledSide) {
          setInternalSide(finalSideToUse);
        }
        onSideChange?.(finalSideToUse, "back");
        completeAnimation(type, finalSideToUse, previousSide, animDuration);
      }, animDuration);
      return;
    }

    // Para otras animaciones
    setTimeout(() => {
      let finalSideToUse: CoinSide = currentSide;

      if (finalSide) {
        finalSideToUse = finalSide;
      } else if (type === "flip") {
        finalSideToUse = currentSide === "front" ? "back" : "front";
      }

      // Cambiar lado si es necesario
      if (finalSideToUse !== currentSide && !controlledSide) {
        setInternalSide(finalSideToUse);
        onSideChange?.(finalSideToUse, previousSide);
      }

      completeAnimation(type, finalSideToUse, previousSide, animDuration);
    }, animDuration);
  };

  const completeAnimation = (
    type: AnimationType,
    finalSide: CoinSide,
    previousSide: CoinSide,
    duration: number
  ) => {
    setIsAnimating(false);
    setAnimationType("idle");

    // Notificar finalización
    onAnimationComplete?.({
      type,
      finalSide,
      previousSide,
      duration,
    });
  };

  return (
    <div className={`${styles.interactiveCoinWrapper} ${className}`}>
      <div
        className={styles.perspectiveContainer}
        style={{ height: size * 1.8 }}
      >
        <div className={styles.coinDynamicContainer}>
          <div className={styles.dynamicShadow} style={{ width: size * 1.2 }} />

          <div
            className={`${styles.depthSystem} ${styles[animationType]} ${
              isAnimating ? styles.animating : ""
            }`}
            style={{ width: size, height: size }}
          >
            <div className={`${styles.dynamicDepth} ${styles.depth4}`} />
            <div className={`${styles.dynamicDepth} ${styles.depth3}`} />
            <div className={`${styles.dynamicDepth} ${styles.depth2}`} />
            <div className={`${styles.dynamicDepth} ${styles.depth1}`} />
          </div>

          <div
            className={`${styles.coinInteractive} ${styles[animationType]} ${
              isAnimating ? styles.animating : ""
            }`}
            style={{ width: size, height: size }}
          >
            <div
              className={`${styles.coinFaceDynamic} ${styles.coinFront}`}
              style={{
                width: size,
                height: size,
                backgroundImage: frontImage ? `url(${frontImage})` : "none",
                backgroundColor: frontImage ? "transparent" : "#FFD700",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className={`${styles.dynamicShine} ${styles.frontShine}`} />
              <div
                className={`${styles.interactiveGlow} ${styles.frontGlow}`}
              />
              {!frontImage && (
                <div className={styles.defaultContent}>
                  <span>{frontLabel}</span>
                </div>
              )}
            </div>

            <div
              className={`${styles.coinFaceDynamic} ${styles.coinBack}`}
              style={{
                width: size,
                height: size,
                backgroundImage: backImage ? `url(${backImage})` : "none",
                backgroundColor: backImage ? "transparent" : "#C0C0C0",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className={`${styles.dynamicShine} ${styles.backShine}`} />
              <div className={`${styles.interactiveGlow} ${styles.backGlow}`} />
              {!backImage && (
                <div className={styles.defaultContent}>
                  <span>{backLabel}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de estado */}
      {/*    {isAnimating && (
        <div className={styles.animationIndicator}>
          <span className={styles.statusText}>
            ✨ {animationType.toUpperCase()}
          </span>
        </div>
      )} */}
    </div>
  );
};

export default InteractiveCoin;
