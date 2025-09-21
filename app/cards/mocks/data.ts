import { LucideIcon } from "lucide-react";
import {
  Bot,
  Volume2,
  Smartphone,
  CreditCard,
  Banknote,
  Shield,
  FileText,
  Gift,
  TrendingUp,
  Gamepad2,
  Play,
  Sparkles,
} from "lucide-react";
export interface Topic {
  id: number;
  title: string;
  intent: string;
  description: string;
  color: string;
  hasVideo: boolean;
  urlVideo?: string;
  icon: LucideIcon;
  content: {
    intro: string;
    steps: string[];
    tip: string;
    videoDescription: string;
  };
}

export const yastaTopics = [
  {
    id: 1,
    title: "Enviar y recibir dinero",
    description: "Aprende cómo transferir dinero de forma rápida y segura",
    icon: Banknote,
    color: "from-emerald-500 to-teal-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "Enviar y recibir dinero",
    content: {
      intro:
        "Con Yasta puedes enviar y recibir dinero de manera instantánea y segura. Es tan fácil como enviar un mensaje de texto.",
      steps: [
        "Abre la app Yasta en tu celular",
        "Selecciona 'Enviar dinero' en el menú principal",
        "Ingresa el número de celular del destinatario",
        "Escribe el monto que deseas enviar",
        "Confirma la transacción con tu PIN",
        "¡Listo! El dinero se transfiere al instante",
      ],
      tip: "Puedes enviar dinero las 24 horas del día, los 7 días de la semana, incluso en feriados.",
      videoDescription: "Video tutorial: Cómo enviar dinero paso a paso",
    },
  },
  {
    id: 2,
    title: "Pago de Servicios",
    description: "Paga todos tus servicios básicos desde tu celular",
    icon: CreditCard,
    color: "from-blue-500 to-indigo-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "Pago de Servicios",
    content: {
      intro:
        "Olvídate de las colas y paga todos tus servicios básicos desde la comodidad de tu hogar.",
      steps: [
        "Selecciona 'Pagar Servicios' en el menú",
        "Elige el tipo de servicio (luz, agua, gas, teléfono)",
        "Ingresa tu número de cliente o medidor",
        "Verifica el monto a pagar",
        "Confirma el pago con tu PIN",
        "Recibe tu comprobante digital al instante",
      ],
      tip: "Programa pagos automáticos para nunca olvidarte de pagar tus servicios.",
      videoDescription: "Video tutorial: Pagando servicios básicos con Yasta",
    },
  },
  {
    id: 3,
    title: "Retiro en el Cajero Automático",
    description: "Retira dinero sin tarjeta usando solo tu celular",
    icon: Smartphone,
    color: "from-purple-500 to-violet-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "Retiro en el Cajero Automático",
    content: {
      intro:
        "Con Yasta puedes retirar dinero de cualquier cajero automático sin necesidad de llevar una tarjeta física.",
      steps: [
        "Ve a 'Retirar dinero' en la app",
        "Selecciona el monto que deseas retirar",
        "Elige el cajero automático más cercano",
        "Genera tu código QR de retiro",
        "Ve al cajero y escanea el código QR",
        "Retira tu dinero en efectivo",
      ],
      tip: "El código QR tiene una validez de 5 minutos por seguridad.",
      videoDescription:
        "Video tutorial: Retiro sin tarjeta en cajeros automáticos",
    },
  },
  {
    id: 4,
    title: "Olvidé mi PIN / Cambié de celular",
    description: "Recupera el acceso a tu cuenta de forma segura",
    icon: Shield,
    color: "from-orange-500 to-red-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "Olvidé mi PIN / Cambié de celular",
    content: {
      intro:
        "Si olvidaste tu PIN o cambiaste de celular, puedes recuperar el acceso a tu cuenta siguiendo estos pasos.",
      steps: [
        "Selecciona 'Olvidé mi PIN' en la pantalla de inicio",
        "Ingresa tu número de cédula de identidad",
        "Responde las preguntas de seguridad",
        "Recibirás un SMS con un código de verificación",
        "Ingresa el código y crea un nuevo PIN",
        "¡Ya puedes usar tu cuenta nuevamente!",
      ],
      tip: "Siempre mantén actualizados tus datos de contacto para facilitar la recuperación.",
      videoDescription:
        "Video tutorial: Recuperación de PIN y cambio de dispositivo",
    },
  },
  {
    id: 5,
    title: "¿Cómo puedo ver mi extracto?",
    description: "Consulta todo el historial de tus transacciones",
    icon: FileText,
    color: "from-green-500 to-emerald-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "¿Cómo puedo ver mi extracto?",
    content: {
      intro:
        "Mantén un control total de tus finanzas consultando tu extracto detallado en cualquier momento.",
      steps: [
        "Ve a 'Mi cuenta' en el menú principal",
        "Selecciona 'Extracto de cuenta'",
        "Elige el período que deseas consultar",
        "Revisa todas tus transacciones detalladas",
        "Descarga tu extracto en PDF si lo necesitas",
        "Comparte o guarda la información",
      ],
      tip: "Puedes filtrar transacciones por tipo, fecha o monto para encontrar lo que buscas.",
      videoDescription: "Video tutorial: Consultando y descargando tu extracto",
    },
  },
  {
    id: 6,
    title: "Beneficios de la Billetera Móvil Yasta",
    description: "Descubre todas las ventajas de usar Yasta",
    icon: Gift,
    color: "from-pink-500 to-rose-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "Beneficios de la Billetera Móvil Yasta",
    content: {
      intro:
        "Yasta te ofrece múltiples beneficios que hacen tu vida financiera más fácil, segura y conveniente.",
      steps: [
        "Transacciones gratuitas entre usuarios Yasta",
        "Disponible 24/7, incluso fines de semana y feriados",
        "Sin necesidad de ir al banco físicamente",
        "Seguridad bancaria con encriptación de datos",
        "Promociones y descuentos exclusivos",
        "Soporte técnico especializado",
      ],
      tip: "Invita a tus amigos y familiares para que también disfruten de estos beneficios.",
      videoDescription:
        "Video: Conoce todos los beneficios de ser usuario Yasta",
    },
  },
  {
    id: 7,
    title: "¿Cuánto puedo mover con mi cuenta?",
    description: "Conoce los límites y cómo aumentarlos",
    icon: TrendingUp,
    color: "from-cyan-500 to-blue-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "¿Cuánto puedo mover con mi cuenta?",
    content: {
      intro:
        "Yasta tiene diferentes límites de transacción según tu nivel de verificación. Aquí te explicamos todo.",
      steps: [
        "Cuenta básica: hasta Bs. 1,000 por transacción",
        "Cuenta verificada: hasta Bs. 5,000 por transacción",
        "Cuenta premium: hasta Bs. 20,000 por transacción",
        "Para aumentar límites, completa tu verificación",
        "Sube fotos de tu CI y comprobante de ingresos",
        "El proceso de verificación toma 24-48 horas",
      ],
      tip: "Mientras más verificada esté tu cuenta, mayores serán tus límites de transacción.",
      videoDescription:
        "Video tutorial: Límites de cuenta y proceso de verificación",
    },
  },
];
