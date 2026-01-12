
import React from 'react';
import { PromptData } from '../types';
import { CopyIcon, CheckIcon, TrashIcon, HistoryIcon, StarIcon } from './Icons';

interface HistoryProps {
  prompts: PromptData[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ prompts, onDelete, onToggleFavorite }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-dark-500">
        <div className="bg-dark-800 p-6 rounded-full mb-6 ring-1 ring-dark-700">
            <HistoryIcon className="w-12 h-12 opacity-50" />
        </div>
        <h2 className="text-xl font-medium text-gray-300 mb-2">No history yet</h2>
        <p className="text-dark-400 max-w-sm text-center">
          Every prompt you transform will appear here. Start forging to see your history grow.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="space-y-4">
        {prompts.map((prompt) => (
          <div 
            key={prompt.id} 
            className="group bg-dark-800/40 rounded-xl border border-dark-700/50 hover:bg-dark-800 hover:border-dark-600 transition-all duration-200 overflow-hidden"
          >
            <div className="p-4 flex flex-col md:flex-row gap-4">
              {/* Info Column */}
              <div className="flex flex-row md:flex-col justify-between md:justify-start gap-2 md:w-32 flex-shrink-0">
                <div className="flex flex-col gap-1">
                  <span className={`w-fit px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                      prompt.platform === 'Gemini' ? 'bg-blue-900/20 text-blue-400 border-blue-800/30' :
                      prompt.platform === 'ChatGPT' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800/30' :
                      prompt.platform === 'Claude' ? 'bg-orange-900/20 text-orange-400 border-orange-800/30' :
                      'bg-gray-800/40 text-gray-400 border-gray-700/50'
                  }`}>
                    {prompt.platform}
                  </span>
                  <span className="text-[10px] text-dark-500 font-medium">
                    {formatDate(prompt.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 md:mt-auto">
                   <button 
                    onClick={() => onToggleFavorite(prompt.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      prompt.isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-dark-500 hover:bg-dark-700 hover:text-gray-300'
                    }`}
                  >
                    <StarIcon className="w-3.5 h-3.5" filled={prompt.isFavorite} />
                  </button>
                  <button 
                    onClick={() => onDelete(prompt.id)}
                    className="p-1.5 rounded-lg text-dark-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Column */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-1.5">Original Idea</h4>
                    <p className="text-sm text-gray-400 line-clamp-3 italic leading-relaxed">
                      "{prompt.originalText}"
                    </p>
                  </div>
                  <div className="relative">
                    <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1.5">Forged Prompt</h4>
                    <div className="relative group/text">
                      <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed pr-8">
                        {prompt.optimizedText}
                      </p>
                      <button
                        onClick={() => handleCopy(prompt.optimizedText, prompt.id)}
                        className={`absolute top-0 right-0 p-1.5 rounded-md transition-all ${
                          copiedId === prompt.id 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-dark-700/50 text-dark-400 opacity-0 group-hover/text:opacity-100 hover:text-white hover:bg-brand-600'
                        }`}
                        title="Copy"
                      >
                        {copiedId === prompt.id ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
