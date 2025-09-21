import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { Topic } from "../mocks/data";
import Image from "next/image";

interface CardItemProps {
  topic: Topic;
  isCompleted: boolean;
  onClick: (topic: Topic) => void;
}

export default function CardItem({
  topic,
  isCompleted,
  onClick,
}: CardItemProps) {
  const IconComponent = topic.icon;

  return (
    <div
      key={topic.id}
      onClick={() => onClick(topic)}
      className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-3xl transform-gpu ${
        isCompleted
          ? "ring-2 sm:ring-4 ring-teal-400 bg-gradient-to-br from-teal-900/70 to-cyan-900/70 shadow-teal-500/30"
          : "bg-gradient-to-br from-slate-800/70 to-slate-900/70 hover:from-slate-700/70 hover:to-slate-800/70"
      } relative overflow-hidden group backdrop-blur-xl border border-slate-600/50 sm:border-2 shadow-2xl rounded-2xl sm:rounded-3xl min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] xl:min-h-[320px]`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-20 transition-all duration-700 rounded-2xl sm:rounded-3xl`}
      />

      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

      <div className="p-4 sm:p-6 lg:p-8 xl:p-10 relative z-10 h-full flex flex-col">
        {/* Header section */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Icon container - responsive sizing */}
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 border border-white/20 sm:border-2`}
            >
              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-white" />
            </div>

            {/* Topic ID badge */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-slate-700/90 flex items-center justify-center border border-teal-400/50 sm:border-2">
              <span className="text-sm sm:text-lg lg:text-xl font-bold text-teal-300">
                {topic.id}
              </span>
            </div>
          </div>

          {/* Status badges - stack on small screens */}
          <div className="flex flex-col items-end gap-1 sm:gap-2 lg:gap-3">
            {isCompleted && (
              <div className="flex items-center gap-1 sm:gap-2 bg-teal-500/20 px-2 py-1 sm:px-3 sm:py-2 lg:px-4 rounded-full border border-teal-400/50">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-teal-400" />
                <span className="text-xs sm:text-sm text-teal-400 font-bold">
                  <span className="hidden sm:inline">✅ Completado</span>
                  <span className="sm:hidden">✅</span>
                </span>
              </div>
            )}
            {topic.hasVideo && (
              <div className="flex items-center gap-1 sm:gap-2 bg-cyan-500/20 px-2 py-1 sm:px-3 sm:py-2 lg:px-4 rounded-full border border-cyan-400/50">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="text-xs sm:text-sm text-cyan-400 font-bold">
                  <span className="hidden sm:inline">🎥 Con Video</span>
                  <span className="sm:hidden">🎥</span>
                </span>
              </div>
            )}
            {topic.images && topic.images.length > 0 && (
              <div className="flex items-center gap-1 sm:gap-2 bg-purple-500/20 px-2 py-1 sm:px-3 sm:py-2 lg:px-4 rounded-full border border-purple-400/50">
                <span className="text-xs sm:text-sm text-purple-400 font-bold">
                  <span className="hidden sm:inline">
                    🖼️ {topic.images.length} Imagen
                    {topic.images.length > 1 ? "es" : ""}
                  </span>
                  <span className="sm:hidden">🖼️{topic.images.length}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Title - responsive text sizing */}
        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-balance leading-tight text-teal-100 group-hover:text-white transition-colors duration-300 mb-3 sm:mb-4 lg:mb-6 flex-shrink-0">
          {topic.title}
        </h3>

        {/* Content section */}
        <div className="flex-grow flex flex-col justify-between">
          {/* Description - responsive text and line clamping */}
          <p className="text-sm sm:text-base lg:text-lg text-pretty text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed mb-3 sm:mb-4 lg:mb-6 line-clamp-2 sm:line-clamp-3 lg:line-clamp-none">
            {topic.description}
          </p>

          {/* Image preview con Next.js Image - responsive display */}
          {topic.images && topic.images.length > 0 && (
            <div className="mb-3 sm:mb-4 lg:mb-6 hidden sm:block">
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
                {/* Primeras 2 imágenes - visibles desde mobile */}
                {topic.images.slice(0, 2).map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden group/img"
                  >
                    <Image
                      src={image.url}
                      alt={image.description || `Imagen ${index + 1}`}
                      fill
                      className="object-cover transition-all duration-300 group-hover/img:scale-110"
                      sizes="64px"
                    />
                    {/* Overlay con número */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Tercera imagen - solo visible desde sm */}
                {topic.images[2] && (
                  <div className="hidden sm:block lg:block relative flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden group/img">
                    <Image
                      src={topic.images[2].url}
                      alt={topic.images[2].description || "Imagen 3"}
                      fill
                      className="object-cover transition-all duration-300 group-hover/img:scale-110"
                      sizes="64px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                  </div>
                )}

                {/* Cuarta imagen - solo visible desde lg */}
                {topic.images[3] && (
                  <div className="hidden lg:block relative flex-shrink-0 w-16 h-16 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden group/img">
                    <Image
                      src={topic.images[3].url}
                      alt={topic.images[3].description || "Imagen 4"}
                      fill
                      className="object-cover transition-all duration-300 group-hover/img:scale-110"
                      sizes="64px"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">4</span>
                    </div>
                  </div>
                )}

                {/* Contador de imágenes adicionales con preview de la siguiente imagen */}
                {topic.images.length > 4 && (
                  <div className="hidden lg:block relative flex-shrink-0 w-16 h-16 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden group/img">
                    {/* Imagen de fondo */}
                    <Image
                      src={topic.images[4].url}
                      alt={topic.images[4].description || "Más imágenes"}
                      fill
                      className="object-cover opacity-30"
                      sizes="64px"
                    />
                    {/* Overlay con contador */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        +{topic.images.length - 4}
                      </span>
                    </div>
                  </div>
                )}

                {/* Contador para breakpoint sm (cuando hay más de 3 pero menos de 5) */}
                {topic.images.length > 3 && topic.images.length <= 4 && (
                  <div className="hidden sm:block lg:hidden relative flex-shrink-0 w-14 h-14 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden">
                    {topic.images[3] && (
                      <Image
                        src={topic.images[3].url}
                        alt={topic.images[3].description || "Más imágenes"}
                        fill
                        className="object-cover opacity-30"
                        sizes="56px"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        +{topic.images.length - 3}
                      </span>
                    </div>
                  </div>
                )}

                {/* Contador para mobile (cuando hay más de 2) */}
                {topic.images.length > 2 && (
                  <div className="block sm:hidden relative flex-shrink-0 w-12 h-12 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden">
                    {topic.images[2] && (
                      <Image
                        src={topic.images[2].url}
                        alt={topic.images[2].description || "Más imágenes"}
                        fill
                        className="object-cover opacity-30"
                        sizes="48px"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        +{topic.images.length - 2}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer section */}
          <div className="flex items-center justify-between">
            {/* Call to action text - hide on very small screens */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
              <span className="hidden sm:inline">
                👆 Toca para aprender más
              </span>
              <span className="sm:hidden">👆 Toca aquí</span>
            </div>

            {/* Arrow button */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-teal-500/30 to-cyan-500/30 flex items-center justify-center group-hover:from-teal-500/60 group-hover:to-cyan-500/60 transition-all duration-500 border border-teal-400/30">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-teal-400 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Completion indicator bar */}
        {isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-b-2xl sm:rounded-b-3xl shadow-lg"></div>
        )}
      </div>
    </div>
  );
}
