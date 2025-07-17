'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface FormulaProps {
  id: string;
  title: string;
  formula: string;
  description: string;
  examples?: string[];
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

interface FormulaSectionProps {
  formulas: FormulaProps[];
  onComplete?: (formulaId: string, xp: number) => void;
  completedFormulas?: string[];
}

export default function FormulaSection({ 
  formulas, 
  onComplete, 
  completedFormulas = [] 
}: FormulaSectionProps) {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  const getColorClasses = (color: string = 'blue') => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 border-blue-300',
      green: 'from-green-500 to-green-600 border-green-300',
      purple: 'from-purple-500 to-purple-600 border-purple-300',
      orange: 'from-orange-500 to-orange-600 border-orange-300',
      red: 'from-red-500 to-red-600 border-red-300'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const handleCopyFormula = async (formula: string, formulaId: string) => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopiedFormula(formulaId);
      setTimeout(() => setCopiedFormula(null), 2000);
    } catch (err) {
      console.error('Failed to copy formula:', err);
    }
  };

  return (
    <div className="space-y-6">
      {formulas.map((formula) => (
        <div key={formula.id} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{formula.title}</h3>
            
            {/* Formule principale */}
            <div className={`bg-gradient-to-r ${getColorClasses(formula.color)} rounded-2xl p-6 text-white border-4 relative`}>
              <div className="text-3xl font-bold mb-2 font-mono">
                {formula.formula}
              </div>
              
              <button
                onClick={() => handleCopyFormula(formula.formula, formula.id)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                title="Copier la formule"
              >
                {copiedFormula === formula.id ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <Copy className="h-5 w-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700 text-lg">{formula.description}</p>
          </div>

          {/* Exemples */}
          {formula.examples && formula.examples.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-3">📝 Exemples :</h4>
              <div className="space-y-2">
                {formula.examples.map((example, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg font-mono text-sm">
                    {example}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton de validation */}
          {onComplete && (
            <div className="text-center mt-6">
              <button
                onClick={() => onComplete(formula.id, 5)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  completedFormulas.includes(formula.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {completedFormulas.includes(formula.id) 
                  ? '✓ Formule maîtrisée ! +5 XP' 
                  : 'J\'ai compris cette formule ! +5 XP'
                }
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 