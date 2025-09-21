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
      className={`cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${
        isCompleted
          ? "ring-2 ring-teal-400 bg-gradient-to-br from-teal-900/70 to-cyan-900/70"
          : "bg-gradient-to-br from-slate-800/70 to-slate-900/70 hover:from-slate-700/70 hover:to-slate-800/70"
      } relative overflow-hidden group backdrop-blur-sm border border-slate-600/50 shadow-lg rounded-2xl min-h-[200px] sm:min-h-[250px]`}
    >
      {/* Simplified hover overlay - only on larger screens */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 sm:group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
      />

      <div className="p-4 sm:p-6 relative z-10 h-full flex flex-col">
        {/* Header section */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Simplified icon container */}
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-lg border border-white/20`}
            >
              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>

            {/* Topic ID badge */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-700/90 flex items-center justify-center border border-teal-400/50">
              <span className="text-sm sm:text-lg font-bold text-teal-300">
                {topic.id}
              </span>
            </div>
          </div>

          {/* Simplified status badges */}
          <div className="flex flex-col items-end gap-1 sm:gap-2">
            {isCompleted && (
              <div className="flex items-center gap-1 bg-teal-500/20 px-2 py-1 sm:px-3 sm:py-1 rounded-full border border-teal-400/50">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
                <span className="text-xs sm:text-sm text-teal-400 font-medium">
                  <span className="hidden sm:inline">Completado</span>
                  <span className="sm:hidden">✓</span>
                </span>
              </div>
            )}
            {topic.hasVideo && (
              <div className="flex items-center gap-1 bg-cyan-500/20 px-2 py-1 sm:px-3 sm:py-1 rounded-full border border-cyan-400/50">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                <span className="text-xs sm:text-sm text-cyan-400 font-medium">
                  <span className="hidden sm:inline">Video</span>
                  <span className="sm:hidden">🎥</span>
                </span>
              </div>
            )}
            {topic.images && topic.images.length > 0 && (
              <div className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 sm:px-3 sm:py-1 rounded-full border border-purple-400/50">
                <span className="text-xs sm:text-sm text-purple-400 font-medium">
                  <span className="hidden sm:inline">
                    {topic.images.length} Imagen
                    {topic.images.length > 1 ? "es" : ""}
                  </span>
                  <span className="sm:hidden">🖼️{topic.images.length}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-balance leading-tight text-teal-100 group-hover:text-white transition-colors duration-300 mb-3 sm:mb-4 flex-shrink-0">
          {topic.title}
        </h3>

        {/* Content section */}
        <div className="flex-grow flex flex-col justify-between">
          {/* Description */}
          <p className="text-sm sm:text-base text-pretty text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
            {topic.description}
          </p>

          {/* Simplified image preview - only on larger screens */}
          {topic.images && topic.images.length > 0 && (
            <div className="mb-3 sm:mb-4 hidden sm:block">
              <div className="flex gap-2 overflow-hidden">
                {/* Show max 3 images to reduce complexity */}
                {topic.images.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden"
                  >
                    <Image
                      src={image.url}
                      alt={image.description || `Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                      loading="lazy"
                    />
                  </div>
                ))}

                {/* Counter for additional images */}
                {topic.images.length > 3 && (
                  <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-slate-700/50 rounded-lg border border-slate-600/50 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-800/80 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        +{topic.images.length - 3}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer section */}
          <div className="flex items-center justify-between">
            {/* Call to action text */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
              <span className="hidden sm:inline">Toca para aprender más</span>
              <span className="sm:hidden">Toca aquí</span>
            </div>

            {/* Simplified arrow button */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors duration-300 border border-teal-400/30">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
            </div>
          </div>
        </div>

        {/* Completion indicator bar */}
        {isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-b-2xl"></div>
        )}
      </div>
    </div>
  );
}
