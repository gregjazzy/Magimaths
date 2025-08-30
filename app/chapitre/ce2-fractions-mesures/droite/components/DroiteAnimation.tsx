'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Composant pour afficher une fraction mathématique
function FractionMath({a, b, size = 'text-xl'}: {a: string|number, b: string|number, size?: string}) {
  return (
    <span className={`inline-block align-middle ${size} text-gray-900 font-bold`} style={{ minWidth: 24 }}>
      <span className="flex flex-col items-center" style={{lineHeight:1}}>
        <span className="border-b-2 border-gray-800 px-1 text-gray-900">{a}</span>
        <span className="px-1 text-gray-900">{b}</span>
      </span>
    </span>
  );
}

interface DroiteAnimationProps {
  numerator: number;
  denominator: number;
  onComplete?: () => void;
}

export default function DroiteAnimation({ numerator, denominator, onComplete }: DroiteAnimationProps) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setStep(0);
  }, []);

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const resetAnimation = () => {
    setStep(0);
  };

  return (
      <div className="flex flex-col items-center space-y-6">
      {/* Texte explicatif */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-base font-semibold grid grid-cols-2 gap-3 max-w-2xl mx-auto"
        >
            {step >= 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-base col-span-2"
              >
                Voici notre droite graduée...
              </motion.div>
            )}
            
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-purple-50 rounded-xl p-3 h-full flex items-center"
              >
                <div className="text-gray-700">
                  Dans <FractionMath a={numerator} b={denominator} />, le <motion.span
                    initial={{ backgroundColor: "transparent" }}
                    animate={{ backgroundColor: ["transparent", "rgba(168, 85, 247, 0.2)", "transparent"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-1 font-bold text-purple-800 px-1"
                  >
                    dénominateur
                  </motion.span>
                  <motion.span
                    initial={{ backgroundColor: "transparent" }}
                    animate={{ backgroundColor: ["transparent", "rgba(168, 85, 247, 0.2)", "transparent"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-1 font-bold text-purple-800 px-1"
                  >
                    {denominator}
                  </motion.span>
                  nous indique qu'on divise l'unité en <motion.span
                    initial={{ backgroundColor: "transparent" }}
                    animate={{ backgroundColor: ["transparent", "rgba(168, 85, 247, 0.2)", "transparent"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="font-bold text-purple-800 px-1"
                  >
                    {denominator}
                  </motion.span> parts égales
                </div>
              </motion.div>
            )}

            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50 rounded-xl p-3 h-full flex items-center"
              >
                <div className="text-gray-700">
                  Dans <FractionMath a={numerator} b={denominator} />, le <motion.span
                    initial={{ backgroundColor: "transparent" }}
                    animate={{ backgroundColor: ["transparent", "rgba(22, 163, 74, 0.2)", "transparent"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-1 font-bold text-green-600 px-1"
                  >
                    numérateur
                  </motion.span>
                  <motion.span
                    initial={{ backgroundColor: "transparent" }}
                    animate={{ backgroundColor: ["transparent", "rgba(22, 163, 74, 0.2)", "transparent"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-1 font-bold text-green-600 px-1"
                  >
                    {numerator}
                  </motion.span>
                  nous indique qu'on doit compter <motion.span
                    initial={{ backgroundColor: "transparent" }}
                    animate={{ backgroundColor: ["transparent", "rgba(22, 163, 74, 0.2)", "transparent"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="font-bold px-1"
                  >
                    {numerator}
                  </motion.span> parts
                </div>
              </motion.div>
            )}

            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-50/50 rounded-xl p-3 h-full flex items-center justify-center text-gray-700 text-base"
              >
                On compte les parts une par une...
              </motion.div>
            )}

            {step >= 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-purple-100 rounded-xl p-3 h-full flex items-center justify-center text-gray-700 text-base font-bold"
              >
                Et voilà ! <FractionMath a={numerator} b={denominator} /> est ici !
              </motion.div>
            )}
        </motion.div>
      </div>

      {/* La droite graduée */}
      <div className="relative w-full h-40">
        {/* Ligne principale */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute left-0 right-0 top-1/2 h-1 bg-gray-800 origin-left"
        />

        {/* Graduations principales (0, 1, 2) - n'apparaissent qu'à l'étape 0 */}
        {step >= 0 && [0, 1, 2].map(num => (
          <motion.div
            key={num}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: num * 0.5 }}
            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${num * 50}%` }}
          >
            <div className="h-6 w-0.5 bg-gray-800"></div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: num * 0.5 + 0.3 }}
              className="absolute top-[-35px] left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-900"
            >
              {num}
            </motion.div>
          </motion.div>
        ))}



        {/* Étape 1: Division en parts égales */}
        {step >= 1 && (
          <>
            {/* Lignes de division verticales */}
            {Array.from({ length: denominator + 1 }).map((_, i) => (
              <motion.div
                key={`division-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "20px", opacity: 1 }}
                transition={{ delay: i * 0.3 }}
                className="absolute top-1/2 -translate-y-1/2 w-0.5 bg-purple-500"
                style={{ left: `${(i * 50) / denominator}%` }}
              />
            ))}
            
            {/* Texte "1 part" sous chaque division */}
            {Array.from({ length: denominator }).map((_, i) => (
              <motion.div
                key={`part-label-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (i + denominator) * 0.5 }}
                className="absolute top-12 text-sm text-gray-700"
                style={{ 
                  left: `${((i * 50) / denominator + (25 / denominator))}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                1 part
              </motion.div>
            ))}
          </>
        )}

        {/* Étape 1: Affichage des fractions après l'explication du dénominateur */}
        {step >= 1 && Array.from({ length: denominator }).map((_, i) => (
          <motion.div
            key={`fraction-${i}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.5 }}
            className="absolute top-[65%] -translate-y-1/2"
            style={{ 
              left: `calc(${((i + 1) * 50) / denominator}% - 10px)`,
              transform: 'translateX(-50%)'
            }}
          >
            <FractionMath a={i + 1} b={denominator} size="text-sm" />
          </motion.div>
        ))}

        {/* Étape 3: Mise en évidence des parts à compter */}
        {step >= 3 && (
          <>
            {/* Barre colorée qui s'étend progressivement */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(numerator * 50) / denominator}%` }}
              transition={{ duration: 1.5 }}
              className="absolute left-0 top-1/2 h-2 bg-green-400 -translate-y-1/2"
              style={{ zIndex: -1 }}
            />
            
            {/* Compteur qui s'incrémente */}
            {Array.from({ length: numerator }).map((_, i) => (
              <motion.div
                key={`count-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.5 }}
                className="absolute top-[15px] text-green-600 font-bold text-2xl"
                style={{ 
                  left: `calc(${((i + 1) * 50) / denominator}% - 10px)`,
                  transform: 'translateX(-50%)'
                }}
              >
                {i + 1}
              </motion.div>
            ))}
          </>
        )}

        {/* Étape 4: Mise en évidence de la fraction et de sa graduation */}
        {step >= 4 && (
          <>
            {/* Mise en évidence de la graduation */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ delay: 0.5 }}
              className="absolute top-[40%]"
              style={{ 
                left: `${(numerator * 50) / denominator}%`,
                height: "24px",
                width: "2px",
                backgroundColor: "rgb(220, 38, 38)",
                zIndex: 10
              }}
            />
            {/* Mise en évidence de la fraction */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute top-[65%] -translate-y-1/2"
              style={{ 
                left: `calc(${(numerator * 50) / denominator}% - 10px)`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-red-200 rounded-lg"></div>
                <div className="relative">
                  <FractionMath a={numerator} b={denominator} size="text-sm" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Boutons de navigation */}
      <div className="flex gap-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={previousStep}
          disabled={step === 0}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            step === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          ← Précédent
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={nextStep}
          disabled={step === 4}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            step === 4
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          Suivant →
        </motion.button>

        {step > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={resetAnimation}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-bold"
          >
            ↺ Recommencer
          </motion.button>
        )}
      </div>
    </div>
  );
}

