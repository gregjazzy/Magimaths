'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  formula: string;
  explanation?: string;
  interactive?: boolean;
  variables?: { [key: string]: number };
  onVariableChange?: (variable: string, value: number) => void;
  className?: string;
  inline?: boolean;
}

export default function MathFormula({ 
  formula, 
  explanation, 
  interactive = false,
  variables = {},
  onVariableChange,
  className = '',
  inline = false
}: MathFormulaProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [katex, setKatex] = useState<any>(null);

  useEffect(() => {
    // Import dynamique de KaTeX côté client
    import('katex').then((katexModule) => {
      setKatex(katexModule.default);
    });
  }, []);

  const renderFormula = () => {
    let displayFormula = formula;
    
    // Remplace les variables par leurs valeurs si elles existent
    Object.keys(variables).forEach(variable => {
      const value = variables[variable];
      displayFormula = displayFormula.replace(
        new RegExp(`\\b${variable}\\b`, 'g'), 
        value.toString()
      );
    });

    if (!katex) {
      // Fallback pendant le chargement
      return <span className="font-mono text-gray-600">{displayFormula}</span>;
    }

    try {
      const html = katex.renderToString(displayFormula, {
        throwOnError: false,
        displayMode: !inline,
        output: 'html'
      });

      return (
        <span 
          dangerouslySetInnerHTML={{ __html: html }}
          className="katex-formula"
        />
      );
    } catch (error) {
      console.warn('Erreur de rendu KaTeX:', error);
      return <span className="font-mono text-gray-600">{displayFormula}</span>;
    }
  };

  if (inline) {
    return (
      <span className={`inline-math ${className}`}>
        {renderFormula()}
      </span>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`
          math-formula bg-gradient-to-r from-blue-50 to-purple-50 
          border-2 border-blue-200 rounded-xl p-6 text-center
          ${interactive ? 'cursor-pointer hover:from-blue-100 hover:to-purple-100' : ''}
          transition-all duration-300
        `}
        whileHover={interactive ? { scale: 1.02 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => interactive && setShowExplanation(!showExplanation)}
      >
        <motion.div 
          className="text-xl md:text-2xl text-gray-800"
          animate={{ 
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {renderFormula()}
        </motion.div>

        {interactive && (
          <motion.div
            className="mt-2 text-sm text-blue-600 font-medium"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            Cliquez pour explorer
          </motion.div>
        )}
      </motion.div>

      {/* Variables interactives */}
      {interactive && Object.keys(variables).length > 0 && (
        <motion.div 
          className="mt-4 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: showExplanation ? 1 : 0,
            height: showExplanation ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {Object.keys(variables).map(variable => (
            <div key={variable} className="flex items-center space-x-3">
              <span className="font-semibold text-gray-700 w-8">
                {variable} =
              </span>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.1"
                value={variables[variable]}
                onChange={(e) => onVariableChange?.(variable, parseFloat(e.target.value))}
                className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {variables[variable].toFixed(1)}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Explication */}
      {explanation && showExplanation && (
        <motion.div
          className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-700 leading-relaxed">{explanation}</p>
        </motion.div>
      )}

      <style jsx global>{`
        .katex-formula .katex {
          font-size: 1.2em;
        }
        
        .katex-formula .katex-display {
          margin: 0;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
} 