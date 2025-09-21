import {
  Play,
  Camera,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

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

  // Bloquear scroll del fondo cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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

  const nextCarouselImage = () => {
    if (images) {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }
  };

  const prevCarouselImage = () => {
    if (images) {
      setCurrentImageIndex(
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      );
    }
  };

  const toggleVideoFullscreen = () => {
    setIsVideoFullscreen(!isVideoFullscreen);
  };

  const openVideoInApp = () => {
    if (urlVideo) {
      setIsVideoFullscreen(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 lg:p-8 z-50 overflow-y-auto">
        <div className="w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-teal-900 border border-teal-500/40 sm:border-2 text-teal-100 rounded-2xl sm:rounded-3xl shadow-3xl">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-12">
            {/* Header Design */}
            <div className="mb-6 sm:mb-8 lg:mb-10 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>

              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-teal-500/30">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-lg opacity-50"></div>
                    <div
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-2xl border-2 border-white/30`}
                    >
                      <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="relative">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight">
                        <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                          {title}
                        </span>
                      </h1>
                      <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500 rounded-full mt-2 sm:mt-3 animate-pulse"></div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 sm:mt-4">
                      <div className="px-3 py-1 sm:px-4 sm:py-2 bg-teal-500/20 rounded-full border border-teal-400/50">
                        <span className="text-sm sm:text-base text-teal-300 font-bold">
                          Tema #{id}
                        </span>
                      </div>
                      {hasVideo && (
                        <div className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-500/20 rounded-full border border-purple-400/50">
                          <span className="text-sm sm:text-base text-purple-300 font-bold">
                            🎥 Con Video
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {/* Video Section */}
              {hasVideo && (
                <div className="relative">
                  <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-800 shadow-2xl border border-slate-600/50 sm:border-2">
                    {urlVideo ? (
                      <div className="relative w-full h-full">
                        <iframe
                          src={urlVideo}
                          title={title}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        <button
                          onClick={toggleVideoFullscreen}
                          className="absolute bottom-4 right-4 bg-black/70 text-white p-2 rounded-lg hover:bg-black/90 transition-colors"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-teal-900">
                        <div className="text-center p-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-xl">
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                          </div>
                          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 mb-2 sm:mb-4">
                            {content.videoDescription}
                          </p>
                          <p className="text-sm sm:text-base lg:text-lg text-slate-400">
                            🔊 Con explicación por voz detallada
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Carrusel de Imágenes con Next.js Image */}
              {images && images.length > 0 && (
                <div className="bg-slate-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-500/30">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-300 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Camera className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    <span className="hidden sm:inline">
                      🖼️ Imágenes paso a paso:
                    </span>
                    <span className="sm:hidden">🖼️ Imágenes:</span>
                  </h3>

                  {/* Carrusel Container */}
                  <div className="relative">
                    <div className="overflow-hidden rounded-xl">
                      <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                          transform: `translateX(-${currentImageIndex * 100}%)`,
                        }}
                      >
                        {images.map((image, index) => (
                          <div key={index} className="w-full flex-shrink-0">
                            <div
                              onClick={() => openImageViewer(index)}
                              className="group relative cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-slate-700/50 border border-slate-600/50 hover:border-purple-400/70 transition-all duration-300 hover:scale-[1.02] mx-2"
                            >
                              {/* Imagen real con Next.js */}
                              <div className="aspect-video relative">
                                <Image
                                  src={image.url}
                                  alt={image.description}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  priority={index === 0}
                                />
                              </div>

                              {/* Overlay con zoom */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                <div className="p-3 sm:p-4 w-full">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white text-sm sm:text-base font-medium">
                                      Paso {index + 1}
                                    </span>
                                    <div className="flex items-center gap-2 text-purple-300">
                                      <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                                      <span className="text-xs sm:text-sm">
                                        <span className="hidden sm:inline">
                                          Click para ampliar
                                        </span>
                                        <span className="sm:hidden">
                                          Ampliar
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Número de paso */}
                              <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                                {index + 1}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Controles del carrusel */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevCarouselImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-colors border border-slate-600"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={nextCarouselImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-slate-800/90 hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-colors border border-slate-600"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </>
                    )}

                    {/* Indicadores del carrusel */}
                    {images.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-purple-400"
                                : "bg-slate-600 hover:bg-slate-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-center text-slate-400 mt-4 text-xs sm:text-sm">
                    💡{" "}
                    <span className="hidden sm:inline">
                      Usa las flechas para navegar o haz clic en cualquier
                      imagen para verla en detalle
                    </span>
                    <span className="sm:hidden">
                      Navega con las flechas o toca para ampliar
                    </span>
                  </p>
                </div>
              )}

              {/* Content Sections */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-600/50">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-teal-300 mb-3 sm:mb-4 flex items-center">
                    📖 <span className="hidden sm:inline">Introducción:</span>
                    <span className="sm:hidden">Intro:</span>
                  </h3>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed text-slate-200">
                    {content.intro}
                  </p>
                </div>

                <div className="bg-slate-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-teal-500/30">
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-semibold text-teal-300 mb-4 sm:mb-6 flex items-center">
                    📋 <span className="hidden sm:inline">Pasos a seguir:</span>
                    <span className="sm:hidden">Pasos:</span>
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {content.steps.map((step, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 sm:gap-4"
                      >
                        <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1 shadow-lg">
                          <span className="text-white text-sm sm:text-base lg:text-lg font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-sm sm:text-lg lg:text-xl text-slate-200 leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-yellow-500/30 sm:border-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-yellow-300 mb-3 sm:mb-4 flex items-center">
                    💡 <span className="hidden sm:inline">Tip importante:</span>
                    <span className="sm:hidden">Tip:</span>
                  </h3>
                  <p className="text-sm sm:text-lg lg:text-xl text-slate-200 leading-relaxed">
                    {content.tip}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 pt-6 sm:pt-8">
                <button
                  onClick={handleClick}
                  className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 text-lg sm:text-xl lg:text-2xl rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold"
                >
                  <span className="hidden sm:inline">
                    ¡Perfecto, ya entendí! 👍
                  </span>
                  <span className="sm:hidden">¡Entendí! 👍</span>
                </button>

                {hasVideo && urlVideo && (
                  <button
                    onClick={openVideoInApp}
                    className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">
                      Ver en pantalla completa
                    </span>
                    <span className="sm:hidden">Pantalla completa</span>
                  </button>
                )}

                {images && images.length > 0 && (
                  <button
                    onClick={() => openImageViewer(0)}
                    className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium flex items-center justify-center gap-2"
                  >
                    <span className="hidden sm:inline">
                      Ver galería completa
                    </span>
                    <span className="sm:hidden">Ver galería</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video en pantalla completa */}
      {isVideoFullscreen && urlVideo && (
        <div className="fixed inset-0 bg-black z-[70] flex flex-col">
          <div className="flex justify-between items-center p-4 bg-black/90">
            <h3 className="text-white text-lg sm:text-xl font-semibold">
              {title}
            </h3>
            <button
              onClick={toggleVideoFullscreen}
              className="text-white hover:text-red-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <iframe
              src={urlVideo}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Visor de imágenes en pantalla completa con Next.js Image */}
      {showImageViewer && images && selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-[60]">
          <div className="relative w-full max-w-xs sm:max-w-3xl lg:max-w-5xl max-h-full">
            {/* Botón cerrar */}
            <button
              onClick={closeImageViewer}
              className="absolute -top-8 sm:-top-12 right-0 text-white text-lg sm:text-2xl hover:text-red-400 transition-colors z-10"
            >
              <span className="hidden sm:inline">✕ Cerrar</span>
              <span className="sm:hidden">✕</span>
            </button>

            {/* Imagen principal con Next.js */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video relative">
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].description}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 90vw"
                  priority
                />
              </div>
              {/* Descripción de la imagen */}
              <div className="p-4 sm:p-6 lg:p-8 bg-white">
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-2">
                    Paso {selectedImage + 1}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600">
                    {images[selectedImage].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex justify-between items-center mt-4 sm:mt-6">
              <button
                onClick={prevImage}
                disabled={images.length <= 1}
                className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg sm:rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <span className="hidden sm:inline">← Anterior</span>
                <span className="sm:hidden">←</span>
              </button>

              <div className="text-white text-center">
                <p className="text-sm sm:text-base lg:text-lg font-medium">
                  {selectedImage + 1} de {images.length}
                </p>
                <div className="flex gap-1 sm:gap-2 mt-2 justify-center">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-colors ${
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
                className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg sm:rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Siguiente →</span>
                <span className="sm:hidden">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
