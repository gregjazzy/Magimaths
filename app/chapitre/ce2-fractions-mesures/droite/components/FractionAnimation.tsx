'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FractionAnimationProps {
  numerator: number;
  denominator: number;
  onComplete?: () => void;
}

export default function FractionAnimation({ numerator, denominator, onComplete }: FractionAnimationProps) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = async () => {
    setIsAnimating(true);
    setStep(0);

    // Étape 1: Afficher l'unité
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep(1);

    // Étape 2: Division en parts égales
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep(2);

    // Étape 3: Sélection des parts
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep(3);

    setIsAnimating(false);
    if (onComplete) onComplete();
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Texte explicatif */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-purple-800 font-semibold"
        >
          {step === 0 && "Voici une unité..."}
          {step === 1 && `On la divise en ${denominator} parts égales...`}
          {step === 2 && `On prend ${numerator} ${numerator > 1 ? 'parts' : 'part'}...`}
          {step === 3 && `Et voilà ! On a ${numerator}/${denominator} !`}
        </motion.p>
      </div>

      {/* Animation principale */}
      <div className="relative w-full max-w-md h-32 flex items-center justify-center">
        {/* Unité de base */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 h-16 bg-blue-200 border-2 border-blue-400 rounded-lg flex items-center justify-center"
        >
          {step === 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-blue-800"
            >
              1
            </motion.span>
          )}

          {/* Division en parts */}
          {step >= 1 && (
            <div className="flex w-full h-full">
              {Array.from({ length: denominator }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    backgroundColor: step >= 2 && i < numerator ? '#86efac' : '#e0e7ff'
                  }}
                  transition={{ 
                    delay: i * 0.2,
                    duration: 0.3
                  }}
                  className={`flex-1 h-full border-r last:border-r-0 border-blue-400 flex items-center justify-center`}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step >= 2 && i < numerator ? 1 : 0.3 }}
                    className="text-sm font-bold"
                  >
                    {step >= 2 && i < numerator ? '✓' : `1/${denominator}`}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Résultat final */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-green-100 px-4 py-2 rounded-full border-2 border-green-400">
              <span className="text-xl font-bold text-green-800">{numerator}/{denominator}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bouton pour rejouer l'animation */}
      {!isAnimating && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={startAnimation}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Rejouer l'animation
        </motion.button>
      )}
    </div>
  );
}


