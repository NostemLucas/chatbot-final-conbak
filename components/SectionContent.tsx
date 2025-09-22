"use client";
import {
  Play,
  Camera,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  handleClick?: () => void;
}

export default function SectionContent({ topic, handleClick }: ModalItemProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

  const router = useRouter();
  const {
    color,
    content,
    hasVideo,
    id,
    icon: IconComponent,
    title,
    urlVideo,
    images,
  } = topic;

  // Callbacks optimizados
  const openImageViewer = useCallback((index: number) => {
    setSelectedImage(index);
    setShowImageViewer(true);
  }, []);

  const closeImageViewer = useCallback(() => {
    setShowImageViewer(false);
    setSelectedImage(null);
  }, []);

  const nextImage = useCallback(() => {
    if (images && selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  }, [images, selectedImage]);

  const prevImage = useCallback(() => {
    if (images && selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? images.length - 1 : selectedImage - 1
      );
    }
  }, [images, selectedImage]);

  const nextCarouselImage = useCallback(() => {
    if (images) {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }
  }, [images, currentImageIndex]);

  const prevCarouselImage = useCallback(() => {
    if (images) {
      setCurrentImageIndex(
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      );
    }
  }, [images, currentImageIndex]);

  const toggleVideoFullscreen = useCallback(() => {
    setIsVideoFullscreen(!isVideoFullscreen);
  }, [isVideoFullscreen]);

  // Estilos memoizados
  const iconContainerStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${color
        .replace("from-", "")
        .replace("to-", "")
        .split(" ")
        .join(", ")})`,
    }),
    [color]
  );

  const carouselTransform = useMemo(
    () => ({
      transform: `translateX(-${currentImageIndex * 100}%)`,
    }),
    [currentImageIndex]
  );

  // Renderizado condicional de imágenes optimizado
  const renderImageCarousel = useMemo(() => {
    if (!images || images.length === 0) return null;

    return (
      <div className="bg-slate-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/30">
        <h3 className="text-xl sm:text-2xl font-semibold text-purple-300 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <Camera className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="hidden sm:inline">Imágenes paso a paso:</span>
          <span className="sm:hidden">Imágenes:</span>
        </h3>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={carouselTransform}
            >
              {images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div
                    onClick={() => openImageViewer(index)}
                    className="group relative cursor-pointer rounded-lg sm:rounded-xl overflow-hidden bg-slate-700/50 border border-slate-600/50 hover:border-purple-400/70 transition-all duration-200 mx-2"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={image.url}
                        alt={image.description}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                      <div className="p-3 sm:p-4 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm sm:text-base font-medium">
                            Paso {index + 1}
                          </span>
                          <div className="flex items-center gap-2 text-purple-300">
                            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm">
                              <span className="hidden sm:inline">Ampliar</span>
                              <span className="sm:hidden">+</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
          <span className="hidden sm:inline">
            Usa las flechas para navegar o haz clic para ampliar
          </span>
          <span className="sm:hidden">Navega o toca para ampliar</span>
        </p>
      </div>
    );
  }, [
    images,
    currentImageIndex,
    carouselTransform,
    openImageViewer,
    nextCarouselImage,
    prevCarouselImage,
  ]);

  return (
    <>
      {/* Contenedor principal de página centrada */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        {/* Botón de regreso */}
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a temas</span>
          </button>
        </div>

        {/* Contenido principal centrado */}
        <article className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800 to-teal-900 border border-teal-500/40 text-teal-100 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <header className="mb-8 sm:mb-10">
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-teal-500/30">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30"
                      style={iconContainerStyle}
                    >
                      <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white mb-3">
                      {title}
                    </h1>
                    <div className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-4"></div>

                    <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                      <div className="px-4 py-2 bg-teal-500/20 rounded-full border border-teal-400/50">
                        <span className="text-base text-teal-300 font-bold">
                          Tema #{id}
                        </span>
                      </div>
                      {hasVideo && (
                        <div className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/50">
                          <span className="text-base text-purple-300 font-bold">
                            Con Video
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Contenido principal */}
            <main className="space-y-8 sm:space-y-10">
              {/* Video Section */}
              {hasVideo && (
                <section className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-800 shadow-xl border border-slate-600/50">
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
                        <div className="text-center p-6">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-cyan-500 to-teal-600 flex items-center justify-center mb-4 mx-auto shadow-xl">
                            <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                          </div>
                          <p className="text-xl sm:text-2xl text-slate-300 mb-2">
                            {content.videoDescription}
                          </p>
                          <p className="text-base sm:text-lg text-slate-400">
                            Con explicación por voz detallada
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Carrusel de Imágenes */}
              {renderImageCarousel}

              {/* Secciones de contenido */}
              <div className="space-y-6 sm:space-y-8">
                {/* Introducción */}
                <section className="bg-slate-800/50 rounded-xl p-6 sm:p-8 border border-slate-600/50">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-teal-300 mb-4 flex items-center">
                    Introducción
                  </h2>
                  <p className="text-lg sm:text-xl leading-relaxed text-slate-200">
                    {content.intro}
                  </p>
                </section>

                {/* Pasos */}
                <section className="bg-slate-800/30 rounded-xl p-6 sm:p-8 border border-teal-500/30">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-teal-300 mb-6 flex items-center">
                    Pasos a seguir
                  </h2>
                  <ol className="space-y-4 sm:space-y-6">
                    {content.steps.map((step, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-4 sm:gap-6"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                          <span className="text-white text-base sm:text-lg font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-base sm:text-xl text-slate-200 leading-relaxed">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Tip importante */}
                <section className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl p-6 sm:p-8 border border-yellow-500/30">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-yellow-300 mb-4 flex items-center">
                    💡 Tip importante
                  </h2>
                  <p className="text-base sm:text-xl text-slate-200 leading-relaxed">
                    {content.tip}
                  </p>
                </section>
              </div>

              {/* Botones de acción */}
              <footer className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-slate-700/50">
                <button
                  onClick={() => router.push("/")}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-lg sm:text-xl rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-bold"
                >
                  ¡Ya entendí! Volver a temas
                </button>

                {hasVideo && urlVideo && (
                  <button
                    onClick={toggleVideoFullscreen}
                    className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Ver en pantalla completa
                  </button>
                )}

                {images && images.length > 0 && (
                  <button
                    onClick={() => openImageViewer(0)}
                    className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
                  >
                    Ver galería completa
                  </button>
                )}
              </footer>
            </main>
          </div>
        </article>
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

      {/* Visor de imágenes */}
      {showImageViewer && images && selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="relative w-full max-w-4xl max-h-full">
            <button
              onClick={closeImageViewer}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-red-400 transition-colors z-10"
            >
              ✕ Cerrar
            </button>

            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video relative">
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].description}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
              <div className="p-6 bg-white">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Paso {selectedImage + 1}
                  </h3>
                  <p className="text-base text-slate-600">
                    {images[selectedImage].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={prevImage}
                disabled={images.length <= 1}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              <div className="text-white text-center">
                <p className="text-base font-medium">
                  {selectedImage + 1} de {images.length}
                </p>
                <div className="flex gap-2 mt-2 justify-center">
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
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
