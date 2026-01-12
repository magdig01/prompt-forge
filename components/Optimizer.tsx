
import React, { useState } from 'react';
import { optimizePrompt } from '../services/geminiService';
import { Platform, Tone, PromptData } from '../types';
import { SparklesIcon, CopyIcon, CheckIcon, ArrowRightIcon, RotateCcwIcon } from './Icons';
import { v4 as uuidv4 } from 'uuid';

interface OptimizerProps {
  onSavePrompt: (prompt: PromptData) => void;
}

const platforms: Platform[] = ['Gemini', 'ChatGPT', 'Claude', 'General'];
const tones: Tone[] = ['Profesional', 'Kreatif', 'Akademis', 'Ringkas', 'Langkah-demi-Langkah'];

const Optimizer: React.FC<OptimizerProps> = ({ onSavePrompt }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Gemini');
  const [selectedTone, setSelectedTone] = useState<Tone>('Profesional');
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setCopied(false);
    
    const optimized = await optimizePrompt(inputText, selectedPlatform, selectedTone);
    
    setOutputText(optimized);
    setIsLoading(false);

    // Auto-save to history (handled by parent via onSavePrompt, but here we just create the object)
    const newPrompt: PromptData = {
      id: uuidv4(),
      originalText: inputText,
      optimizedText: optimized,
      platform: selectedPlatform,
      tone: selectedTone,
      tags: [],
      createdAt: Date.now(),
      isFavorite: false,
    };
    onSavePrompt(newPrompt);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setCopied(false);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-6 gap-6">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dark-800/50 p-4 rounded-xl border border-dark-700 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-dark-400 text-sm font-medium mr-2">Platform Target:</span>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedPlatform === p
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/20'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
           <span className="text-dark-400 text-sm font-medium mr-2">Nada:</span>
          <select 
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value as Tone)}
            className="bg-dark-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 border-none focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
          >
            {tones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
        
        {/* Input Section */}
        <div className="flex-1 flex flex-col bg-dark-800 rounded-2xl border border-dark-700 shadow-xl overflow-hidden group focus-within:ring-2 focus-within:ring-brand-500/50 transition-all">
          <div className="p-4 border-b border-dark-700 bg-dark-800/80 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Permintaan Asli</h3>
            <span className="text-xs text-dark-500">{inputText.length} karakter</span>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent p-6 text-gray-200 resize-none outline-none text-base md:text-lg placeholder-dark-600 leading-relaxed font-light"
            placeholder="cth., Tulis postingan blog tentang masa depan AI..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="p-4 bg-dark-800/50 border-t border-dark-700 flex justify-end gap-3">
            {(inputText || outputText) && (
              <button
                onClick={handleReset}
                title="Atur ulang"
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-dark-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <RotateCcwIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Atur Ulang</span>
              </button>
            )}
            <button
              onClick={handleOptimize}
              disabled={isLoading || !inputText.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading || !inputText.trim()
                  ? 'bg-dark-600 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-brand-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Ubah
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transition Arrow (Desktop) */}
        <div className="hidden md:flex flex-col justify-center items-center text-dark-600">
          <ArrowRightIcon className="w-8 h-8 opacity-20" />
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col bg-dark-900 rounded-2xl border border-dark-700 shadow-xl overflow-hidden relative">
          <div className="p-4 border-b border-dark-700 bg-dark-900/90 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              Hasil Optimal
            </h3>
            {outputText && (
               <button
               onClick={handleCopy}
               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                 copied 
                   ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                   : 'bg-dark-700 hover:bg-dark-600 text-gray-300 border border-dark-600'
               }`}
             >
               {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
               {copied ? 'Tersalin!' : 'Salin'}
             </button>
            )}
          </div>
          
          <div className="flex-1 relative">
            {outputText ? (
              <textarea
                readOnly
                className="w-full h-full bg-transparent p-6 text-gray-100 resize-none outline-none text-base md:text-lg leading-relaxed font-light custom-scrollbar"
                value={outputText}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-dark-600 p-8 text-center">
                <SparklesIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium opacity-50">Siap untuk membuat prompt Anda.</p>
                <p className="text-sm opacity-30 mt-2 max-w-xs">Masukkan permintaan Anda di sebelah kiri dan pilih platform target.</p>
              </div>
            )}
            
            {/* Shimmer Effect Overlay when loading */}
            {isLoading && (
              <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="w-3/4 space-y-4 animate-pulse">
                   <div className="h-4 bg-dark-700 rounded w-full"></div>
                   <div className="h-4 bg-dark-700 rounded w-5/6"></div>
                   <div className="h-4 bg-dark-700 rounded w-4/6"></div>
                   <div className="h-4 bg-dark-700 rounded w-full"></div>
                   <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Optimizer;
