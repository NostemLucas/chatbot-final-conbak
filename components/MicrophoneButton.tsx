"use client";
import { useState, useRef } from "react";
import { Mic, Square, AlertTriangle, XCircle, Wifi, Shield, HardDrive, Volume2 } from "lucide-react";
import { useAudioContext } from '../providers/AudioProvider'; // Ajusta la ruta según tu estructura

interface MicrophoneButtonProps {
  onAudioRecorded: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export default function MicrophoneButton({
  onAudioRecorded,
  disabled = false,
}: MicrophoneButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { showAlert } = useAudioContext();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkMediaDevicesSupport = () => {
    if (!navigator.mediaDevices) {
      showAlert(
        'destructive',
        'Navegador no compatible',
        'Tu navegador no soporta grabación de audio. Por favor usa un navegador moderno como Chrome, Firefox o Safari.',
        <Wifi className="h-4 w-4" />
      );
      return false;
    }
    
    if (!navigator.mediaDevices.getUserMedia) {
      showAlert(
        'destructive',
        'Función no disponible',
        'Tu navegador no soporta acceso al micrófono. Por favor actualiza tu navegador a la versión más reciente.',
        <Wifi className="h-4 w-4" />
      );
      return false;
    }
    
    return true;
  };

  const checkMediaRecorderSupport = () => {
    if (!window.MediaRecorder) {
      showAlert(
        'destructive',
        'Grabación no soportada',
        'Tu navegador no soporta grabación de audio. Por favor usa un navegador compatible como Chrome o Firefox.',
        <Volume2 className="h-4 w-4" />
      );
      return false;
    }
    
    // Verificar si el navegador soporta el tipo de audio que queremos usar
    const supportedTypes = ['audio/webm', 'audio/mp4', 'audio/ogg'];
    const supportedType = supportedTypes.find(type => MediaRecorder.isTypeSupported(type));
    
    if (!supportedType) {
      showAlert(
        'destructive',
        'Formato no compatible',
        'Tu navegador no soporta ningún formato de audio compatible para la grabación.',
        <Volume2 className="h-4 w-4" />
      );
      return false;
    }
    
    return supportedType;
  };

  const handlePermissionError = (error: any) => {
    console.error("Error de permisos:", error);
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      showAlert(
        'destructive',
        'Permisos requeridos',
        'Debes dar permiso para usar el micrófono. Por favor, permite el acceso al micrófono en tu navegador y vuelve a intentar.',
        <Shield className="h-4 w-4" />
      );
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      showAlert(
        'destructive',
        'Hardware no encontrado',
        'No se reconoce el hardware de micrófono. Verifica que tengas un micrófono conectado y funcionando.',
        <HardDrive className="h-4 w-4" />
      );
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      showAlert(
        'destructive',
        'Micrófono ocupado',
        'El micrófono está siendo usado por otra aplicación. Por favor, cierra otras aplicaciones que puedan estar usando el micrófono e intenta nuevamente.',
        <AlertTriangle className="h-4 w-4" />
      );
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      showAlert(
        'default',
        'Configuración no compatible',
        'La configuración solicitada para el micrófono no es compatible con tu dispositivo. Intentando con configuración alternativa...',
        <AlertTriangle className="h-4 w-4" />
      );
      return 'retry_with_basic_config';
    } else if (error.name === 'NotSupportedError') {
      showAlert(
        'destructive',
        'Dispositivo no compatible',
        'Tu dispositivo no soporta grabación de audio.',
        <XCircle className="h-4 w-4" />
      );
    } else if (error.name === 'SecurityError') {
      showAlert(
        'destructive',
        'Error de seguridad',
        'Error de seguridad: Asegúrate de estar usando HTTPS o localhost para acceder al micrófono.',
        <Shield className="h-4 w-4" />
      );
    } else if (error.name === 'AbortError') {
      showAlert(
        'default',
        'Solicitud cancelada',
        'La solicitud de acceso al micrófono fue cancelada. Por favor, intenta nuevamente.',
        <AlertTriangle className="h-4 w-4" />
      );
    } else {
      showAlert(
        'destructive',
        'Error desconocido',
        `Error inesperado al acceder al micrófono: ${error.message || 'Por favor, verifica que tu micrófono esté funcionando correctamente.'}`,
        <XCircle className="h-4 w-4" />
      );
    }
  };

  const requestMicrophoneAccess = async (useBasicConfig = false) => {
    const audioConfig = useBasicConfig 
      ? { audio: true } 
      : { audio: { sampleRate: 16000, channelCount: 1 } };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(audioConfig);
      return stream;
    } catch (error) {
      const retryResult = handlePermissionError(error);
      
      if (retryResult === 'retry_with_basic_config' && !useBasicConfig) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          showAlert(
            'default',
            'Configuración ajustada',
            'Se utilizó una configuración de audio alternativa para mayor compatibilidad.',
            <Volume2 className="h-4 w-4" />
          );
          return stream;
        } catch (retryError) {
          handlePermissionError(retryError);
          throw retryError;
        }
      }
      
      throw error;
    }
  };

  const handleRecordingError = (error: any, phase: string) => {
    console.error(`Error durante ${phase}:`, error);
    
    if (error.name === 'InvalidStateError') {
      showAlert(
        'destructive',
        'Error de estado',
        'Error en el estado de grabación. Por favor, intenta nuevamente.',
        <AlertTriangle className="h-4 w-4" />
      );
    } else if (error.name === 'SecurityError') {
      showAlert(
        'destructive',
        'Error de seguridad',
        'Error de seguridad durante la grabación. Verifica los permisos del micrófono.',
        <Shield className="h-4 w-4" />
      );
    } else if (error.name === 'UnknownError') {
      showAlert(
        'destructive',
        'Error desconocido',
        'Error inesperado durante la grabación. Por favor, intenta nuevamente.',
        <XCircle className="h-4 w-4" />
      );
    } else {
      showAlert(
        'destructive',
        'Error de grabación',
        `Error durante la grabación: ${error.message || 'Por favor, intenta nuevamente.'}`,
        <XCircle className="h-4 w-4" />
      );
    }
  };

  const startRecording = async () => {
    try {
      if (!checkMediaDevicesSupport()) return;

      const supportedAudioType = checkMediaRecorderSupport();
      if (!supportedAudioType) return;

      const stream = await requestMicrophoneAccess();
      
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        showAlert(
          'destructive',
          'Sin pistas de audio',
          'No se encontraron pistas de audio en el micrófono. Verifica que tu micrófono esté funcionando.',
          <Volume2 className="h-4 w-4" />
        );
        return;
      }

      if (!audioTracks[0].enabled) {
        showAlert(
          'destructive',
          'Micrófono deshabilitado',
          'El micrófono está deshabilitado. Por favor, habilita tu micrófono.',
          <Volume2 className="h-4 w-4" />
        );
        return;
      }

      try {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: supportedAudioType
        });
        
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          
          try {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: supportedAudioType,
            });
            
            if (audioBlob.size > 0) {
              onAudioRecorded(audioBlob);
              showAlert(
                'default',
                'Grabación exitosa',
                'Audio grabado correctamente y listo para procesar.',
                <Volume2 className="h-4 w-4" />
              );
            } else {
              showAlert(
                'destructive',
                'Archivo vacío',
                'No se pudo grabar audio. El archivo está vacío.',
                <AlertTriangle className="h-4 w-4" />
              );
            }
          } catch (blobError) {
            handleRecordingError(blobError, "creación del archivo de audio");
          }
        };

        mediaRecorder.onerror = (event) => {
          handleRecordingError(event.error, "grabación");
          stopRecording();
        };

        try {
          mediaRecorder.start(1000);
          setIsRecording(true);
          setRecordingTime(0);

          intervalRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
          }, 1000);

        } catch (startError) {
          handleRecordingError(startError, "inicio de grabación");
          stream.getTracks().forEach((track) => track.stop());
        }

      } catch (mediaRecorderError) {
        stream.getTracks().forEach((track) => track.stop());
        handleRecordingError(mediaRecorderError, "inicialización del grabador");
      }

    } catch (error) {
      console.error("Error general en startRecording:", error);
    }
  };

  const stopRecording = () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (mediaRecorderRef.current) {
        const currentState = mediaRecorderRef.current.state;
        
        if (currentState === "recording") {
          mediaRecorderRef.current.stop();
        } else if (currentState === "paused") {
          mediaRecorderRef.current.resume();
          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
              mediaRecorderRef.current.stop();
            }
          }, 100);
        }
      }

      setIsRecording(false);
      setRecordingTime(0);

    } catch (error) {
      console.error("Error al detener la grabación:", error);
      showAlert(
        'destructive',
        'Error al detener',
        'Error al detener la grabación. La grabación puede haberse guardado parcialmente.',
        <AlertTriangle className="h-4 w-4" />
      );
      
      setIsRecording(false);
      setRecordingTime(0);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`p-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecording
            ? "bg-red-500/20 border-red-400/50 text-red-300 animate-pulse"
            : "bg-teal-500/20 border-teal-400/50 text-teal-300 hover:bg-teal-500/30"
        }`}
      >
        {isRecording ? (
          <Square className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {isRecording && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-2 py-1 rounded-lg text-xs font-mono">
          {formatTime(recordingTime)}
        </div>
      )}
    </div>
  );
}