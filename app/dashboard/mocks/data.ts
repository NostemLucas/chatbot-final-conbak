import {
  ArrowRight,
  CheckCircle,
  Play,
  Banknote,
  CreditCard,
  DollarSign,
  Smartphone,
  FileText,
  Gift,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

export interface Topic {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hasVideo: boolean;
  urlVideo?: string;
  intent: string;
  images?: {
    url: string;
    description: string;
  }[];
  content: {
    intro: string;
    steps: string[];
    tip: string;
    videoDescription: string;
  };
}

// Estructura de datos actualizada
export const yastaTopics = [
  {
    id: 1,
    title: "Enviar y recibir dinero",
    description:
      "Aprende cómo transferir dinero de forma rápida y segura entre usuarios de Yasta",
    icon: Banknote,
    color: "from-emerald-500 to-teal-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/XR6AMh4heuE",
    intent: "enviar-recibir-dinero",
    images: [
      {
        url: "/img/envio-paso1.jpg",
        description:
          "Pantalla principal de Yasta con la opción 'Enviar dinero'",
      },
      {
        url: "/img/envio-paso2.jpg",
        description: "Ingreso del número de celular del destinatario",
      },
      {
        url: "/img/envio-paso3.jpg",
        description: "Confirmación del monto y datos del destinatario",
      },
    ],
    content: {
      intro:
        "Con Yasta puedes enviar y recibir dinero de manera instantánea y segura entre usuarios de la plataforma. Es tan fácil como enviar un mensaje de texto.",
      steps: [
        "Abre la app Yasta e ingresa con tu PIN",
        "Selecciona 'Enviar a otro Yasta' en el menú principal",
        "Ingresa el número de celular del destinatario o selecciona desde contactos",
        "Verifica los datos del destinatario y escribe el monto",
        "Selecciona la finalidad de la transacción",
        "Confirma la transferencia y ¡listo! Se envía al instante",
      ],
      tip: "Las transferencias entre billeteras Yasta son gratuitas e instantáneas, disponibles 24/7.",
      videoDescription:
        "Video tutorial: Cómo enviar dinero paso a paso con Yasta",
    },
  },
  {
    id: 2,
    title: "Pago de Servicios",
    description:
      "Paga luz, agua, gas, internet y más servicios desde tu billetera móvil",
    icon: CreditCard,
    color: "from-blue-500 to-indigo-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/0bVC9aIRpvs",
    intent: "pago-servicios",
    images: [
      {
        url: "/img/servicios-menu.jpg",
        description:
          "Menú de pagos con diferentes opciones de servicios disponibles",
      },
      {
        url: "/img/pago-luz-form.jpg",
        description: "Formulario para ingresar datos del servicio de luz",
      },
      {
        url: "/img/confirmacion-pago.jpg",
        description: "Pantalla de confirmación del pago realizado",
      },
    ],
    content: {
      intro:
        "Con Yasta puedes pagar todos tus servicios básicos sin hacer filas ni salir de casa. Luz, agua, gas, telefonía e internet al alcance de tu mano.",
      steps: [
        "Ingresa a tu billetera Yasta",
        "Selecciona 'Pagos' en la parte inferior",
        "Elige el servicio que deseas pagar (Luz, Gas, Agua, etc.)",
        "Ingresa los datos de tu factura o recibo",
        "Verifica el monto y los datos del servicio",
        "Confirma el pago y guarda tu comprobante",
      ],
      tip: "Siempre guarda el comprobante de pago como respaldo. Puedes encontrar todos tus pagos en 'Movimientos'.",
      videoDescription: "Tutorial completo: Cómo pagar servicios con Yasta",
    },
  },
  {
    id: 3,
    title: "Retiro en Cajero Automático",
    description:
      "Retira efectivo de cualquier cajero Banco Unión sin necesidad de tarjeta",
    icon: DollarSign,
    color: "from-purple-500 to-pink-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/F6p1ZKQ87AU",
    intent: "retiro-cajero",
    images: [
      {
        url: "/img/generar-codigo.jpg",
        description: "Pantalla para generar código de retiro en la app",
      },
      {
        url: "/img/cajero-sin-tarjeta.jpg",
        description:
          "Opción 'Sin tarjeta' en el cajero automático de Banco Unión",
      },
      {
        url: "/img/ingreso-codigo-cajero.jpg",
        description: "Pantalla del cajero para ingresar el código de 6 dígitos",
      },
    ],
    content: {
      intro:
        "Con Yasta puedes retirar efectivo de cualquier cajero automático de Banco Unión sin necesidad de tener una tarjeta física. Solo necesitas tu código de retiro.",
      steps: [
        "Abre Yasta y verifica que tengas saldo disponible",
        "Selecciona 'Retirar efectivo' en el menú",
        "Ingresa el monto que deseas retirar y genera el código",
        "Anota o guarda el código de 6 dígitos generado",
        "Ve al cajero Banco Unión y selecciona 'Sin tarjeta'",
        "Elige 'Retiro', ingresa tu celular y el código de 6 dígitos",
        "Retira tu dinero del cajero",
      ],
      tip: "El código tiene una vigencia de 30 minutos. El límite diario de retiro es de Bs. 3,000.",
      videoDescription:
        "Video paso a paso: Retiro de efectivo sin tarjeta con Yasta",
    },
  },
  {
    id: 4,
    title: "Olvidé mi PIN / Cambié de celular",
    description:
      "Aprende cómo recuperar tu acceso cuando olvidas tu PIN o cambias de dispositivo",
    icon: Smartphone,
    color: "from-orange-500 to-red-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "recuperar-acceso",
    images: [
      {
        url: "/img/olvide-pin.jpg",
        description: "Pantalla de inicio con opción 'Olvidé mi PIN'",
      },
      {
        url: "/img/verificacion-datos.jpg",
        description: "Formulario de verificación de datos personales",
      },
      {
        url: "/img/nuevo-pin.jpg",
        description: "Pantalla para crear un nuevo PIN de acceso",
      },
    ],
    content: {
      intro:
        "Si olvidaste tu PIN o cambiaste de celular, no te preocupes. Yasta tiene opciones seguras para recuperar el acceso a tu billetera móvil.",
      steps: [
        "En la pantalla de inicio, selecciona 'Olvidé mi PIN'",
        "Ingresa tu número de celular registrado",
        "Proporciona los datos solicitados para verificar tu identidad",
        "Recibirás un código de verificación por SMS",
        "Ingresa el código y crea tu nuevo PIN",
        "Confirma tu nuevo PIN y accede a tu billetera",
      ],
      tip: "Para cambio de celular, instala la app en tu nuevo dispositivo y usa la opción de recuperación con tus mismos datos.",
      videoDescription: "Guía completa: Recuperar acceso a tu billetera Yasta",
    },
  },
  {
    id: 5,
    title: "¿Cómo ver mi extracto?",
    description:
      "Consulta todos tus movimientos y transacciones realizadas en tu billetera",
    icon: FileText,
    color: "from-cyan-500 to-blue-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "ver-extracto",
    images: [
      {
        url: "/img/menu-movimientos.jpg",
        description: "Ubicación del menú 'Movimientos' en la app",
      },
      {
        url: "/img/historial-transacciones.jpg",
        description: "Lista detallada de todas las transacciones realizadas",
      },
      {
        url: "/img/filtros-extracto.jpg",
        description: "Opciones de filtrado por fecha y tipo de transacción",
      },
    ],
    content: {
      intro:
        "Tu extracto en Yasta te permite revisar todas tus transacciones de manera detallada, con fechas, montos y tipos de operación realizadas.",
      steps: [
        "Ingresa a tu aplicación Yasta",
        "Selecciona 'Movimientos' en el menú inferior",
        "Revisa tu historial completo de transacciones",
        "Usa los filtros para buscar movimientos específicos",
        "Toca cualquier transacción para ver más detalles",
        "Descarga o comparte comprobantes si necesitas",
      ],
      tip: "Puedes filtrar por fechas, tipos de transacción y montos para encontrar rápidamente lo que buscas.",
      videoDescription:
        "Tutorial: Cómo revisar tu extracto y movimientos en Yasta",
    },
  },
  {
    id: 6,
    title: "Beneficios de la Billetera Móvil Yasta",
    description:
      "Descubre todas las ventajas de usar Yasta para tus transacciones diarias",
    icon: Gift,
    color: "from-pink-500 to-rose-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "beneficios-yasta",
    images: [
      {
        url: "/img/beneficios-general.jpg",
        description: "Infografía con los principales beneficios de Yasta",
      },
      {
        url: "/img/seguridad-yasta.jpg",
        description: "Características de seguridad de la billetera móvil",
      },
      {
        url: "/img/disponibilidad-24-7.jpg",
        description: "Disponibilidad de servicios las 24 horas del día",
      },
    ],
    content: {
      intro:
        "Yasta te ofrece múltiples beneficios que hacen más fácil y segura tu vida financiera, con disponibilidad total y costos reducidos.",
      steps: [
        "Sin costo de apertura ni mantenimiento de cuenta",
        "Transferencias gratuitas entre usuarios Yasta",
        "Disponibilidad 24/7, incluidos fines de semana y feriados",
        "Pagos de servicios sin comisiones adicionales",
        "Retiros en cajeros sin necesidad de tarjeta",
        "Máxima seguridad con tecnología de encriptación",
      ],
      tip: "Yasta es completamente gratuito para la mayoría de transacciones, solo algunos servicios específicos tienen costos mínimos.",
      videoDescription:
        "Conoce todos los beneficios de usar Yasta como tu billetera móvil",
    },
  },
  {
    id: 7,
    title: "Límites de transacciones",
    description:
      "Conoce los límites diarios y mensuales para diferentes tipos de operaciones",
    icon: TrendingUp,
    color: "from-indigo-500 to-purple-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intent: "limites-transacciones",
    images: [
      {
        url: "/img/limites-diarios.jpg",
        description: "Tabla con límites diarios por tipo de transacción",
      },
      {
        url: "/img/limites-mensuales.jpg",
        description: "Límites mensuales y acumulados de operaciones",
      },
      {
        url: "/img/upgrade-cuenta.jpg",
        description:
          "Opciones para aumentar límites con verificación adicional",
      },
    ],
    content: {
      intro:
        "Yasta maneja diferentes límites de transacción para garantizar la seguridad de tu dinero. Conoce cuánto puedes mover según el tipo de operación.",
      steps: [
        "Retiros en cajero: hasta Bs. 3,000 diarios",
        "Transferencias entre Yasta: hasta Bs. 5,000 diarios",
        "Pagos de servicios: hasta Bs. 10,000 diarios",
        "Recargas telefónicas: hasta Bs. 500 por transacción",
        "Saldo máximo en billetera: Bs. 50,000",
        "Límites mensuales: Bs. 100,000 en total de operaciones",
      ],
      tip: "Puedes solicitar el aumento de límites completando verificaciones adicionales en tu perfil.",
      videoDescription: "Explicación detallada de límites y cómo aumentarlos",
    },
  },
];
