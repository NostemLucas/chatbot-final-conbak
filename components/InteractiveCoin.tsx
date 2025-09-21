// components/InteractiveCoin.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./InteractiveCoin.module.css";

// Tipos de animaciones disponibles (reducidas para mejor rendimiento)
export type AnimationType =
  | "heartbeat"
  | "celebrate"
  | "glow"
  | "flip"
  | "pulse"
  | "bounce"
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

const InteractiveCoin: React.FC<InteractiveCoinProps> = React.memo(
  ({
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
    // Estados internos optimizados
    const [isAnimating, setIsAnimating] = useState(false);
    const [internalSide, setInternalSide] = useState<CoinSide>("front");
    const [animationType, setAnimationType] = useState<AnimationType>("idle");
    const [lastCommandTimestamp, setLastCommandTimestamp] = useState<number>(0);

    // El lado actual puede ser controlado externamente o internamente
    const currentSide = controlledSide ?? internalSide;

    // Duración por defecto de cada animación (reducidas)
    const getAnimationDuration = useCallback((type: AnimationType): number => {
      const durations: Record<AnimationType, number> = {
        heartbeat: 1000,
        celebrate: 800,
        glow: 1200,
        flip: 600,
        pulse: 900,
        bounce: 800,
        showBack: 1500,
        idle: 0,
      };
      return durations[type] || 600;
    }, []);

    // Función para completar animación optimizada
    const completeAnimation = useCallback(
      (
        type: AnimationType,
        finalSide: CoinSide,
        previousSide: CoinSide,
        duration: number
      ) => {
        setIsAnimating(false);
        setAnimationType("idle");

        // Notificar finalización solo si hay callback
        onAnimationComplete?.({
          type,
          finalSide,
          previousSide,
          duration,
        });
      },
      [onAnimationComplete]
    );

    // Función para ejecutar animación optimizada
    const executeAnimation = useCallback(
      (command: AnimationCommand) => {
        const { type, finalSide, duration } = command;
        const animDuration = duration || getAnimationDuration(type);
        const previousSide = currentSide;

        // Notificar inicio de animación
        onAnimationStart?.(command);

        // Establecer estado de animación
        setIsAnimating(true);
        setAnimationType(type);

        // Usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
          // Manejar animación especial "showBack"
          if (type === "showBack") {
            setTimeout(() => {
              const newSide: CoinSide = "back";
              if (!controlledSide) {
                setInternalSide(newSide);
              }
              onSideChange?.(newSide, previousSide);
            }, 200);

            setTimeout(() => {
              const finalSideToUse: CoinSide = autoReturnToFront
                ? "front"
                : "back";
              if (!controlledSide) {
                setInternalSide(finalSideToUse);
              }
              onSideChange?.(finalSideToUse, "back");
              completeAnimation(
                type,
                finalSideToUse,
                previousSide,
                animDuration
              );
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
        });
      },
      [
        currentSide,
        controlledSide,
        autoReturnToFront,
        getAnimationDuration,
        onAnimationStart,
        onSideChange,
        completeAnimation,
      ]
    );

    // Efecto optimizado para ejecutar animaciones
    useEffect(() => {
      if (!animationCommand || isAnimating) return;

      // Verificar si es un comando nuevo solo por timestamp
      const commandTimestamp = animationCommand.timestamp || Date.now();
      if (commandTimestamp <= lastCommandTimestamp) return;

      executeAnimation(animationCommand);
      setLastCommandTimestamp(commandTimestamp);
    }, [animationCommand, isAnimating, lastCommandTimestamp, executeAnimation]);

    // Efecto optimizado para cambios de lado controlados externamente
    useEffect(() => {
      if (controlledSide && controlledSide !== internalSide && !isAnimating) {
        const previousSide = internalSide;
        setInternalSide(controlledSide);
        onSideChange?.(controlledSide, previousSide);
      }
    }, [controlledSide, internalSide, isAnimating, onSideChange]);

    // Estilos memoizados para mejor rendimiento
    const coinStyles = useMemo(
      () => ({
        width: size,
        height: size,
      }),
      [size]
    );

    const frontStyles = useMemo(
      () => ({
        ...coinStyles,
        backgroundImage: frontImage ? `url(${frontImage})` : "none",
        backgroundColor: frontImage ? "transparent" : "#FFD700",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }),
      [coinStyles, frontImage]
    );

    const backStyles = useMemo(
      () => ({
        ...coinStyles,
        backgroundImage: backImage ? `url(${backImage})` : "none",
        backgroundColor: backImage ? "transparent" : "#C0C0C0",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }),
      [coinStyles, backImage]
    );

    const shadowStyles = useMemo(
      () => ({
        width: size * 1.2,
      }),
      [size]
    );

    const containerStyles = useMemo(
      () => ({
        height: size * 1.8,
      }),
      [size]
    );

    // Clases CSS optimizadas
    const coinClasses = useMemo(
      () =>
        `${styles.coinInteractive} ${styles[animationType]} ${
          isAnimating ? styles.animating : ""
        }`,
      [animationType, isAnimating]
    );

    const depthClasses = useMemo(
      () =>
        `${styles.depthSystem} ${styles[animationType]} ${
          isAnimating ? styles.animating : ""
        }`,
      [animationType, isAnimating]
    );

    return (
      <div className={`${styles.interactiveCoinWrapper} ${className}`}>
        <div className={styles.perspectiveContainer} style={containerStyles}>
          <div className={styles.coinDynamicContainer}>
            <div className={styles.dynamicShadow} style={shadowStyles} />

            {/* Sistema de profundidad simplificado */}
            <div className={depthClasses} style={coinStyles}>
              <div className={`${styles.dynamicDepth} ${styles.depth2}`} />
              <div className={`${styles.dynamicDepth} ${styles.depth1}`} />
            </div>

            <div className={coinClasses} style={coinStyles}>
              {/* Cara frontal */}
              <div
                className={`${styles.coinFaceDynamic} ${styles.coinFront}`}
                style={frontStyles}
              >
                <div
                  className={`${styles.dynamicShine} ${styles.frontShine}`}
                />
                {!frontImage && (
                  <div className={styles.defaultContent}>
                    <span>{frontLabel}</span>
                  </div>
                )}
              </div>

              {/* Cara trasera */}
              <div
                className={`${styles.coinFaceDynamic} ${styles.coinBack}`}
                style={backStyles}
              >
                <div className={`${styles.dynamicShine} ${styles.backShine}`} />
                {!backImage && (
                  <div className={styles.defaultContent}>
                    <span>{backLabel}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Agregar displayName para debugging
InteractiveCoin.displayName = "InteractiveCoin";

export default InteractiveCoin;
