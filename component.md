```tsx
import { Play } from "lucide-react";

interface TopicModalProps {
  topic: {
    id: number;
    title: string;
    hasVideo: boolean;
    content: {
      intro: string;
      steps: string[];
      tip: string;
      videoDescription: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TopicModal({
  topic,
  isOpen,
  onClose,
}: TopicModalProps) {
  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-teal-900 border border-teal-500/30 text-teal-100 rounded-2xl">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text mb-4">
              {topic.title}
            </h2>
          </div>

          <div className="space-y-6">
            {topic.hasVideo && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-teal-900">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                    <p className="text-lg text-slate-300">
                      {topic.content.videoDescription}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      Con explicación por voz
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-slate-200">
                {topic.content.intro}
              </p>

              <div>
                <h3 className="text-xl font-semibold text-teal-300 mb-3">
                  📋 Pasos a seguir:
                </h3>
                <ul className="space-y-2">
                  {topic.content.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-slate-200">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-xl p-6 border border-teal-500/20">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                  💡 Tip importante:
                </h3>
                <p className="text-slate-200">{topic.content.tip}</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0 text-lg rounded-xl transition-all duration-300"
              >
                ¡Entendido! 👍
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
