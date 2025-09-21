import { Play } from "lucide-react";
import { Topic } from "../page";

interface ModalItemProps {
  topic: Topic;
  handleClick: () => void;
}
export default function ModalItem({ topic, handleClick }: ModalItemProps) {
  const { color, content, description, hasVideo, id, icon, title } = topic;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center p-8 z-50">
      <div className="max-w-6xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-teal-900 border-2 border-teal-500/40 text-teal-100 rounded-3xl shadow-3xl">
        <div className="p-12">
          <div className="mb-10 text-center">
            <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text mb-6">
              {title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto"></div>
          </div>

          <div className="space-y-10">
            {/* Enhanced Video Section */}
            {hasVideo && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 shadow-2xl border-2 border-slate-600/50">
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
              </div>
            )}

            {/* Enhanced Content Section */}
            <div className="space-y-8">
              <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-600/50">
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
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={() => handleClick()}
                className="px-12 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 text-2xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold"
              >
                ¡Perfecto, ya entendí! 👍
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
