'use client';

import { useState } from 'react';

// Styles pour les animations (extraits de la page originale)
const animationStyles = `
  @keyframes fillUp {
    from { width: 0%; }
    to { width: 100%; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .fill-up { animation: fillUp 1s ease-in-out; }
  .bounce { animation: bounce 0.6s ease-in-out; }
  .pulse { animation: pulse 1s ease-in-out infinite; }
  .slide-in { animation: slideIn 0.5s ease-out; }
`;

export default function ComplementsAnimations() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation pour montrer les compléments (extraite de la page originale)
  const showComplementAnimation = (number: number) => {
    if (selectedNumber === number && animationStep === 3) {
      return;
    }
    
    setSelectedNumber(number);
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Animation progressive
    setTimeout(() => setAnimationStep(1), 300);
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => {
      setAnimationStep(3);
      setIsAnimating(false);
    }, 1800);
  };

  // Rendu des barres visuelles (extrait de la page originale)
  const renderBar10 = (filled: number, complement: number, animated = false) => {
    return (
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: filled }, (_, i) => (
          <div
            key={`filled-${i}`}
            className={`w-8 h-8 bg-blue-400 rounded border-2 border-blue-500 flex items-center justify-center text-white font-bold ${
              animated ? 'slide-in' : ''
            }`}
            style={animated ? { animationDelay: `${i * 0.1}s` } : {}}
          >
            ●
          </div>
        ))}
        {Array.from({ length: complement }, (_, i) => (
          <div key={`complement-${i}`} className={`w-8 h-8 bg-red-400 rounded border-2 border-red-500 flex items-center justify-center text-white font-bold ${
            animationStep >= 2 ? 'slide-in' : 'opacity-0'
          }`} style={{ animationDelay: `${i * 0.1}s` }}>
            {filled + i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-blue-50 border-2 border-gray-200 rounded-xl shadow-lg p-3 sm:p-6">
      <style jsx>{animationStyles}</style>
      
      <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
        <h2 className="text-base sm:text-2xl font-bold text-gray-800">
          🎯 Choisis un nombre pour voir son complément à 10 !
        </h2>
      </div>

      {/* Boutons des nombres */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button
            key={number}
            data-number={number}
            onClick={() => showComplementAnimation(number)}
            disabled={isAnimating}
            className={`
              p-3 sm:p-4 rounded-lg font-bold text-xl sm:text-2xl transition-all transform hover:scale-105 touch-manipulation min-h-[44px]
              ${selectedNumber === number && isAnimating 
                ? 'bg-blue-500 text-white pulse' 
                : 'bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700'
              }
              ${isAnimating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            {number}
          </button>
        ))}
      </div>

      {/* Zone d'animation */}
      {selectedNumber !== null && (
        <div className="bg-gray-50 rounded-lg p-6 min-h-[250px]">
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-gray-800">
              Complément de {selectedNumber} à 10
            </h4>
          </div>

          <div className="space-y-6">
            {/* Visualisation avec barres */}
            <div>
              <p className="text-center text-gray-600 mb-2">J'ai {selectedNumber} :</p>
              {animationStep >= 1 && renderBar10(selectedNumber, 10 - selectedNumber)}
            </div>

            {/* Équation */}
            {animationStep >= 2 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedNumber} + {10 - selectedNumber} = 10
                </div>
              </div>
            )}

            {/* Résultat final */}
            {animationStep >= 3 && (
              <div className="text-center">
                <div className="bg-green-100 rounded-lg p-4 inline-block">
                  <div className="text-green-800 font-bold text-lg">
                    🎉 Le complément de {selectedNumber} à 10 est {10 - selectedNumber} !
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
