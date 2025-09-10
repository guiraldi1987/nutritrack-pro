import { useState } from 'react';
import { Download, X, Share, Plus } from 'lucide-react';
import { usePWAInstall } from '@/react-app/hooks/usePWAInstall';

export default function InstallPrompt() {
  const { canInstall, isInstalled, isIOS, promptInstall, dismissPrompt } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(true);

  if (isInstalled || !canInstall || !isVisible) {
    return null;
  }

  const handleInstall = () => {
    if (isIOS) {
      // Show iOS instructions
      setIsVisible(false);
      // Could show a modal with instructions instead
      alert('Para instalar no iOS:\n1. Toque no ícone de compartilhar no Safari\n2. Role para baixo e toque em "Adicionar à Tela Inicial"');
    } else {
      promptInstall();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    dismissPrompt();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-4 shadow-2xl border border-white/20 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <img 
                src="https://mocha-cdn.com/01992a5f-6030-712d-8eb0-6e263a681ab5/Captura-de-tela-2025-09-08-151739.png" 
                alt="NutriTrack Pro" 
                className="w-6 h-6 rounded"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">
              Instalar NutriTrack Pro
            </h3>
            <p className="text-xs text-white/90 mt-1 leading-relaxed">
              Adicione o app à sua tela inicial para acesso mais rápido e experiência nativa.
            </p>
            
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleInstall}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 backdrop-blur-sm"
              >
                {isIOS ? (
                  <>
                    <Share className="w-3 h-3" />
                    <span>Como instalar</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3" />
                    <span>Instalar</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white text-xs px-2 py-2 transition-colors"
              >
                Mais tarde
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Alternative iOS Instructions Modal Component
export function IOSInstallModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <img 
              src="https://mocha-cdn.com/01992a5f-6030-712d-8eb0-6e263a681ab5/Captura-de-tela-2025-09-08-151739.png" 
              alt="NutriTrack Pro" 
              className="w-8 h-8 rounded"
            />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Instalar NutriTrack Pro
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            Para instalar o app em seu iPhone ou iPad:
          </p>
          
          <div className="space-y-4 text-left text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                1
              </div>
              <div>
                Toque no ícone de <strong>compartilhar</strong> <Share className="w-4 h-4 inline text-blue-600" /> no Safari
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                2
              </div>
              <div>
                Role para baixo e toque em <strong>"Adicionar à Tela Inicial"</strong> <Plus className="w-4 h-4 inline text-blue-600" />
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-xs">
                3
              </div>
              <div>
                Toque em <strong>"Adicionar"</strong> para confirmar
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
