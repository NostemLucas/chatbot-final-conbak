import { ArrowRight, CheckCircle, LucideIcon, Play } from "lucide-react";
import { ReactNode } from "react";
import { Topic } from "../page";

interface CardItemProps {
  topic: Topic;
  isCompleted: boolean;
  onClick: (id: Topic) => void;
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
          ? "ring-4 ring-teal-400 bg-gradient-to-br from-teal-900/70 to-cyan-900/70 shadow-teal-500/30"
          : "bg-gradient-to-br from-slate-800/70 to-slate-900/70 hover:from-slate-700/70 hover:to-slate-800/70"
      } relative overflow-hidden group backdrop-blur-xl border-2 border-slate-600/50 shadow-2xl rounded-3xl min-h-[300px]`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-20 transition-all duration-700 rounded-3xl`}
      />

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

      <div className="p-10 relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 border-2 border-white/20`}
            >
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-700/90 flex items-center justify-center border-2 border-teal-400/50">
              <span className="text-xl font-bold text-teal-300">
                {topic.id}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {isCompleted && (
              <div className="flex items-center gap-2 bg-teal-500/20 px-4 py-2 rounded-full border border-teal-400/50">
                <CheckCircle className="w-6 h-6 text-teal-400" />
                <span className="text-sm text-teal-400 font-bold">
                  ✅ Completado
                </span>
              </div>
            )}
            {topic.hasVideo && (
              <div className="flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-400/50">
                <Play className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-bold">
                  🎥 Con Video
                </span>
              </div>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-balance leading-tight text-teal-100 group-hover:text-white transition-colors duration-300 mb-6 flex-shrink-0">
          {topic.title}
        </h3>

        <div className="flex-grow flex flex-col justify-between">
          <p className="text-lg text-pretty text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed mb-6">
            {topic.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-base text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
              <span>👆 Toca para aprender más</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500/30 to-cyan-500/30 flex items-center justify-center group-hover:from-teal-500/60 group-hover:to-cyan-500/60 transition-all duration-500 border border-teal-400/30">
              <ArrowRight className="w-6 h-6 text-teal-400 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-b-3xl shadow-lg"></div>
        )}
      </div>
    </div>
  );
}
