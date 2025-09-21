import { Play, Camera, ZoomIn } from "lucide-react";
import React, { useState } from "react";

interface Topic {
  id: number;
  title: string;
  intent: string;
  description: string;
  color: string;
  hasVideo: boolean;
  urlVideo?: string;
  icon: React.ComponentType<{ className?: string }>;
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

interface ModalItemProps {
  topic: Topic;
  handleClick: () => void;
}

export default function ModalItem({ topic, handleClick }: ModalItemProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);

  const {
    color,
    content,
    description,
    hasVideo,
    id,
    icon: IconComponent,
    title,
    urlVideo,
    images,
  } = topic;

  const openImageViewer = (index: number) => {
    setSelectedImage(index);
    setShowImageViewer(true);
  };

  const closeImageViewer = () => {
    setShowImageViewer(false);
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (images && selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? images.length - 1 : selectedImage - 1
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-8 z-50">
        <div className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-teal-900 border-2 border-teal-500/40 text-teal-100 rounded-3xl shadow-3xl">
          <div className="p-12">
            {/* Enhanced Header with Icon */}
            <div className="mb-10 text-center">
              <div className="flex items-center justify-center gap-6 mb-6">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl border-2 border-white/20`}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text">
                    {title}
                  </h2>
                  <p className="text-xl text-slate-400 mt-2">Tema #{id}</p>
                </div>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto"></div>
            </div>

            <div className="space-y-10">
              {/* Enhanced Video Section */}
              {hasVideo && (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 shadow-2xl border-2 border-slate-600/50">
                  {urlVideo ? (
                    <iframe
                      src={urlVideo}
                      title={title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-teal-900">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center mb-6 mx-auto shadow-xl">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-2xl text-slate-300 mb-4">
                          {content.videoDescription}
                        </p>
                        <p className="text-lg text-slate-400">
                          🔊 Con explicación por voz detallada
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Nueva sección de Galería de Imágenes */}
              {images && images.length > 0 && (
                <div className="bg-slate-800/30 rounded-2xl p-8 border border-purple-500/30">
                  <h3 className="text-3xl font-semibold text-purple-300 mb-6 flex items-center gap-3">
                    <Camera className="w-8 h-8" />
                    🖼️ Imágenes paso a paso:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => openImageViewer(index)}
                        className="group relative cursor-pointer rounded-xl overflow-hidden bg-slate-700/50 border border-slate-600/50 hover:border-purple-400/70 transition-all duration-300 hover:scale-105"
                      >
                        {/* Placeholder para la imagen */}
                        <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="w-12 h-12 text-slate-400 mb-2 mx-auto" />
                            <p className="text-sm text-slate-400">
                              Imagen {index + 1}
                            </p>
                          </div>
                        </div>

                        {/* Overlay con descripción */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <p className="text-white text-sm font-medium mb-2">
                              {image.description}
                            </p>
                            <div className="flex items-center gap-2 text-purple-300">
                              <ZoomIn className="w-4 h-4" />
                              <span className="text-xs">
                                Click para ampliar
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Número de paso */}
                        <div className="absolute top-3 left-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-slate-400 mt-4 text-sm">
                    💡 Haz clic en cualquier imagen para verla en detalle
                  </p>
                </div>
              )}

              {/* Enhanced Content Section */}
              <div className="space-y-8">
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600/50">
                  <h3 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center">
                    📖 Introducción:
                  </h3>
                  <p className="text-2xl leading-relaxed text-slate-200">
                    {content.intro}
                  </p>
                </div>

                <div className="bg-slate-800/30 rounded-2xl p-8 border border-teal-500/30">
                  <h3 className="text-3xl font-semibold text-teal-300 mb-6 flex items-center">
                    📋 Pasos a seguir:
                  </h3>
                  <ul className="space-y-4">
                    {content.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                          <span className="text-white text-lg font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-xl text-slate-200 leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-2xl p-8 border-2 border-yellow-500/30">
                  <h3 className="text-2xl font-semibold text-yellow-300 mb-4 flex items-center">
                    💡 Tip importante:
                  </h3>
                  <p className="text-xl text-slate-200 leading-relaxed">
                    {content.tip}
                  </p>
                </div>

                {/* Información adicional del intent para debugging */}
                {process.env.NODE_ENV === "development" && (
                  <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-600/30">
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">
                      🔧 Info de desarrollo:
                    </h3>
                    <p className="text-sm text-slate-500">
                      Intent: "{topic.intent}" | Imágenes: {images?.length || 0}
                    </p>
                  </div>
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <button
                  onClick={handleClick}
                  className="px-12 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 text-2xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold"
                >
                  ¡Perfecto, ya entendí! 👍
                </button>

                {hasVideo && urlVideo && (
                  <button
                    onClick={() => window.open(urlVideo, "_blank")}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 text-xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Ver video completo
                  </button>
                )}

                {images && images.length > 0 && (
                  <button
                    onClick={() => openImageViewer(0)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 text-xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium flex items-center gap-2"
                  >
                    Ver galería completa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de imágenes en pantalla completa */}
      {showImageViewer && images && selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 z-[60]">
          <div className="relative max-w-5xl max-h-full">
            {/* Botón cerrar */}
            <button
              onClick={closeImageViewer}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-red-400 transition-colors z-10"
            >
              ✕ Cerrar
            </button>

            {/* Imagen principal */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    Paso {selectedImage + 1}
                  </h3>
                  <p className="text-lg text-slate-600">
                    {images[selectedImage].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={prevImage}
                disabled={images.length <= 1}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              <div className="text-white text-center">
                <p className="text-lg font-medium">
                  {selectedImage + 1} de {images.length}
                </p>
                <div className="flex gap-2 mt-2">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                        index === selectedImage
                          ? "bg-purple-400"
                          : "bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={nextImage}
                disabled={images.length <= 1}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Componente de demostración
function ModalDemo() {
  const [showModal, setShowModal] = useState(false);

  // Datos de ejemplo con imágenes
  const sampleTopic = {
    id: 1,
    title: "Enviar y recibir dinero",
    intent: "enviar-recibir-dinero",
    description: "Aprende cómo transferir dinero de forma rápida y segura",
    color: "from-emerald-500 to-teal-600",
    hasVideo: true,
    urlVideo: "https://www.youtube.com/embed/XR6AMh4heuE",
    icon: ({ className }: { className?: string }) => (
      <div className={className}>💸</div>
    ),
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
      {
        url: "/img/envio-paso4.jpg",
        description: "Pantalla final de confirmación de la transferencia",
      },
    ],
    content: {
      intro:
        "Con Yasta puedes enviar y recibir dinero de manera instantánea y segura entre usuarios de la plataforma.",
      steps: [
        "Abre la app Yasta e ingresa con tu PIN",
        "Selecciona 'Enviar a otro Yasta' en el menú principal",
        "Ingresa el número de celular del destinatario",
        "Verifica los datos y escribe el monto",
        "Confirma la transferencia",
      ],
      tip: "Las transferencias entre billeteras Yasta son gratuitas e instantáneas.",
      videoDescription:
        "Video tutorial: Cómo enviar dinero paso a paso con Yasta",
    },
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <button
        onClick={() => setShowModal(true)}
        className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl text-xl font-semibold hover:scale-105 transition-transform"
      >
        Abrir Modal de Ejemplo
      </button>

      {showModal && (
        <ModalItem
          topic={sampleTopic}
          handleClick={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export { ModalDemo };
