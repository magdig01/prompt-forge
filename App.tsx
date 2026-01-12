
import React, { useState, useEffect } from 'react';
import Optimizer from './components/Optimizer';
import Library from './components/Library';
import History from './components/History';
import { ViewState, PromptData } from './types';
import { ZapIcon, LibraryIcon, HistoryIcon } from './components/Icons';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('optimizer');
  const [prompts, setPrompts] = useState<PromptData[]>([]);

  // Load prompts from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('promptForge_library');
    if (saved) {
      try {
        setPrompts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse library", e);
      }
    }
  }, []);

  // Save prompts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('promptForge_library', JSON.stringify(prompts));
  }, [prompts]);

  const handleSavePrompt = (newPrompt: PromptData) => {
    setPrompts(prev => [newPrompt, ...prev]);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prev => prev.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  // Logic for filtered views
  const favorites = prompts.filter(p => p.isFavorite).sort((a, b) => b.createdAt - a.createdAt);
  const history = [...prompts].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Top Banner */}
      <div className="w-full bg-dark-950/50 border-b border-dark-800/50 py-1.5 px-4 text-center">
        <span className="text-[10px] md:text-xs font-medium text-dark-500 uppercase tracking-widest">
          2025 By Magelang Digital
        </span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('optimizer')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <ZapIcon className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight">
                PromptForge
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-dark-800 p-1 rounded-lg border border-dark-700">
              <button
                onClick={() => setCurrentView('optimizer')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  currentView === 'optimizer'
                    ? 'bg-dark-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
                }`}
              >
                <ZapIcon className="w-4 h-4" />
                <span className="hidden md:inline">Pengoptimal</span>
              </button>
              
              <button
                onClick={() => setCurrentView('library')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  currentView === 'library'
                    ? 'bg-dark-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
                }`}
              >
                <LibraryIcon className="w-4 h-4" />
                <span className="hidden md:inline">Favorit</span>
                {favorites.length > 0 && (
                   <span className="ml-1 text-[10px] bg-brand-500 text-white px-1.5 py-0.5 rounded-full leading-none">{favorites.length}</span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('history')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  currentView === 'history'
                    ? 'bg-dark-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
                }`}
              >
                <HistoryIcon className="w-4 h-4" />
                <span className="hidden md:inline">Riwayat</span>
                {history.length > 0 && (
                   <span className="ml-1 text-[10px] bg-dark-900 px-1.5 py-0.5 rounded-full text-dark-400 border border-dark-700">{history.length}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-6 pb-20">
        {currentView === 'optimizer' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8 px-4">
               <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                Ubah ide menjadi prompt andalan.
               </h1>
               <p className="text-dark-400 max-w-xl mx-auto text-sm md:text-base">
                Tingkatkan interaksi AI Anda. Rekayasa prompt instan yang dioptimalkan untuk Gemini, ChatGPT, dan Claude.
               </p>
            </div>
            <Optimizer onSavePrompt={handleSavePrompt} />
          </div>
        )}

        {currentView === 'library' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="max-w-7xl mx-auto px-6 mb-6">
               <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                 <LibraryIcon className="w-6 h-6 text-brand-400" />
                 Pustaka Prompt
                </h2>
               <p className="text-dark-400 text-sm mt-1">Koleksi prompt andalan favorit pilihan Anda.</p>
             </div>
             <Library 
              prompts={favorites} 
              onDelete={handleDeletePrompt}
              onToggleFavorite={handleToggleFavorite}
             />
          </div>
        )}

        {currentView === 'history' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="max-w-7xl mx-auto px-6 mb-6">
               <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                 <HistoryIcon className="w-6 h-6 text-brand-400" />
                 Riwayat Interaksi
               </h2>
               <p className="text-dark-400 text-sm mt-1">Catatan lengkap setiap prompt yang pernah Anda buat.</p>
             </div>
             <History 
              prompts={history} 
              onDelete={handleDeletePrompt}
              onToggleFavorite={handleToggleFavorite}
             />
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 w-full bg-dark-900/90 backdrop-blur border-t border-dark-800 py-2 px-6 text-[10px] md:text-xs text-dark-500 flex justify-between items-center z-40">
        <div className="flex-1">
           Didukung oleh <span className="font-semibold text-brand-500">Gemini 3 Flash</span>
        </div>
        <div className="flex-1 text-center font-medium text-dark-400 uppercase tracking-widest">
           2025 By Magelang Digital
        </div>
        <div className="flex-1 flex justify-end gap-4">
           <span>v1.1.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
