
import React from 'react';
import { PromptData } from '../types';
import { CopyIcon, CheckIcon, TrashIcon, StarIcon, SparklesIcon } from './Icons';

interface LibraryProps {
  prompts: PromptData[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const Library: React.FC<LibraryProps> = ({ prompts, onDelete, onToggleFavorite }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
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
            <StarIcon className="w-12 h-12 opacity-50" />
        </div>
        <h2 className="text-xl font-medium text-gray-300 mb-2">Belum ada favorit</h2>
        <p className="text-dark-400 max-w-sm text-center">
          Ketuk ikon bintang pada setiap prompt buatan di Riwayat Anda untuk menyimpannya di sini agar mudah diakses.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <div 
            key={prompt.id} 
            className="group bg-dark-800 rounded-xl border border-dark-700 hover:border-brand-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/5 flex flex-col h-full overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4 border-b border-dark-700/50 flex justify-between items-start bg-dark-800/50">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                    prompt.platform === 'Gemini' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' :
                    prompt.platform === 'ChatGPT' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' :
                    prompt.platform === 'Claude' ? 'bg-orange-900/30 text-orange-400 border border-orange-800/50' :
                    'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {prompt.platform}
                </span>
                <span className="text-xs text-dark-400 font-medium px-2 py-0.5 rounded bg-dark-700/50 border border-dark-700/50">
                    {prompt.tone}
                </span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => onToggleFavorite(prompt.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    prompt.isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-dark-500 hover:bg-dark-700 hover:text-gray-300'
                  }`}
                  title="Beralih Favorit"
                >
                  <StarIcon className="w-4 h-4" filled={prompt.isFavorite} />
                </button>
                <button 
                  onClick={() => onDelete(prompt.id)}
                  className="p-1.5 rounded-lg text-dark-500 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                  title="Hapus"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-dark-500 uppercase mb-1">Asli</p>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{prompt.originalText}</p>
              </div>
              <div className="mt-2 pt-3 border-t border-dark-700/50 flex-1">
                <p className="text-xs font-semibold text-brand-500 uppercase mb-1">Optimal</p>
                <p className="text-sm text-gray-200 line-clamp-4 leading-relaxed whitespace-pre-line">{prompt.optimizedText}</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-3 bg-dark-900/30 border-t border-dark-700/50 flex justify-between items-center">
              <span className="text-[10px] text-dark-500 font-medium">
                {formatDate(prompt.createdAt)}
              </span>
              <button
                onClick={() => handleCopy(prompt.optimizedText, prompt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copiedId === prompt.id
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-dark-700 text-gray-300 hover:bg-brand-600 hover:text-white'
                }`}
              >
                {copiedId === prompt.id ? (
                    <>
                        <CheckIcon className="w-3 h-3" /> Tersalin
                    </>
                ) : (
                    <>
                        <CopyIcon className="w-3 h-3" /> Salin Hasil
                    </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
