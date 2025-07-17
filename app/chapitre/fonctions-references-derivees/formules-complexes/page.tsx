'use client';

import { useState } from 'react';
import { ArrowLeft, Trophy, Target } from 'lucide-react';
import Link from 'next/link';

export default function FormulesComplexesPage() {
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [showCorrections, setShowCorrections] = useState<{[key: string]: boolean}>({});
  const [completed, setCompleted] = useState(false);

  // Composant pour afficher les formules mathématiques
  const MathFormula = ({ children }: { children: React.ReactNode }) => (
    <span className="font-mono text-gray-800 bg-white">{children}</span>
  );

  // Composant éditeur mathématique
  const MathEditor = ({ 
    value, 
    onChange, 
    placeholder = "Tape ta réponse ici..." 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    placeholder?: string; 
  }) => {
    const insertSymbol = (symbol: string) => {
      onChange(value + symbol);
    };

    const mathSymbols = [
      { symbol: 'x²', label: 'x²' },
      { symbol: 'x³', label: 'x³' },
      { symbol: 'x⁴', label: 'x⁴' },
      { symbol: '√x', label: '√x' },
      { symbol: '1/x', label: '1/x' },
      { symbol: '1/x²', label: '1/x²' },
      { symbol: 'eˣ', label: 'eˣ' },
      { symbol: '+', label: '+' },
      { symbol: '-', label: '-' },
      { symbol: '(', label: '(' },
      { symbol: ')', label: ')' },
    ];

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ta réponse :</label>
          <input
            type="text"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-lg text-gray-800 bg-white placeholder-gray-500"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600 mb-2">Symboles mathématiques :</div>
          <div className="grid grid-cols-6 gap-1">
            {mathSymbols.map((item, index) => (
              <button
                key={index}
                onClick={() => insertSymbol(item.symbol)}
                className="bg-white hover:bg-purple-50 border border-gray-300 rounded px-2 py-1 text-sm font-mono transition-colors text-gray-800 hover:text-purple-800"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-2 flex space-x-1">
            <button
              onClick={() => onChange('')}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs transition-colors"
              type="button"
            >
              Effacer
            </button>
            <button
              onClick={() => onChange(value.slice(0, -1))}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded text-xs transition-colors"
              type="button"
            >
              ← Suppr
            </button>
          </div>
        </div>
      </div>
    );
  };

  const exercicesAvances = [
    {
      id: 1,
      fonction: <MathFormula>f(x) = 4x³ - 2x + 5</MathFormula>,
      reponse: "12x² - 2",
      explication: "(4x³)' = 12x², (-2x)' = -2, (5)' = 0"
    },
    {
      id: 2,
      fonction: (
        <MathFormula>
          <div className="flex items-center">
            g(x)
            <div className="inline-block mx-2">
              <div className="text-center">=</div>
            </div>
            x<sup>4</sup> + 3<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span>
            <span className="mx-2">-</span>
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">1</div>
              <div className="text-center pt-1">x</div>
            </div>
          </div>
        </MathFormula>
      ),
      reponse: "4x³ + 3/(2√x) + 1/x²",
      explication: (
        <span>
          (x<sup>4</sup>)' = 4x³, (3<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span>)' = 
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">3</div>
            <div className="text-center pt-1">2<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></div>
          </div>
          , (-
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">1</div>
            <div className="text-center pt-1">x</div>
          </div>
          )' = 
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">1</div>
            <div className="text-center pt-1">x²</div>
          </div>
        </span>
      )
    },
    {
      id: 3,
      fonction: <MathFormula>h(x) = -2x<sup>5</sup> + 7x - 10</MathFormula>,
      reponse: "-10x⁴ + 7",
      explication: "(-2x⁵)' = -10x⁴, (7x)' = 7, (-10)' = 0"
    },
    {
      id: 4,
      fonction: (
        <MathFormula>
          k(x) = 5e<sup>x</sup> + 2x³ - <span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span>
        </MathFormula>
      ),
      reponse: "5eˣ + 6x² - 1/(2√x)",
      explication: (
        <span>
          (5e<sup>x</sup>)' = 5e<sup>x</sup>, (2x³)' = 6x², (-<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span>)' = -
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">1</div>
            <div className="text-center pt-1">2<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></div>
          </div>
        </span>
      )
    },
    {
      id: 5,
      fonction: (
        <MathFormula>
          <div className="flex items-center">
            p(x)
            <div className="inline-block mx-2">
              <div className="text-center">=</div>
            </div>
            3x<sup>4</sup> - 
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">7</div>
              <div className="text-center pt-1">x</div>
            </div>
            + 2<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span>
          </div>
        </MathFormula>
      ),
      reponse: "12x³ + 7/x² + 1/√x",
      explication: (
        <span>
          (3x<sup>4</sup>)' = 12x³, (-
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">7</div>
            <div className="text-center pt-1">x</div>
          </div>
          )' = 
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">7</div>
            <div className="text-center pt-1">x²</div>
          </div>
          , (2<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span>)' = 
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">1</div>
            <div className="text-center pt-1"><span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></div>
          </div>
        </span>
      )
    },
    {
      id: 6,
      fonction: <MathFormula>q(x) = -3e<sup>x</sup> + 6x<sup>5</sup> - 8x + 12</MathFormula>,
      reponse: "-3eˣ + 30x⁴ - 8",
      explication: "(-3e^x)' = -3e^x, (6x⁵)' = 30x⁴, (-8x)' = -8, (12)' = 0"
    }
  ];

  const checkAnswer = (exerciseId: string, userAnswer: string, correctAnswer: string) => {
    const normalized = (str: string) => str.replace(/\s/g, '').toLowerCase();
    return normalized(userAnswer) === normalized(correctAnswer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-100">
      {/* Header avec navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/fonctions-references-derivees" 
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour au chapitre</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full">
                <Trophy className="h-4 w-4" />
                <span className="font-bold">120 XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 max-w-6xl mx-auto p-6 space-y-10">
        
        {/* Introduction */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h1 className="text-4xl font-bold mb-6">
              FORMULES COMPLEXES
            </h1>
            <div className="text-2xl mb-6">
              Défi : Fonctions avancées et expertes
            </div>
            <div className="text-lg text-purple-100">
              🎯 Objectif : Maîtriser les techniques avancées de dérivation
            </div>
          </div>
        </section>

        {/* Techniques avancées */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">
              🎯 Techniques Avancées
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-300">
                <div className="font-bold text-purple-700 mb-2">Fractions</div>
                <div className="text-sm text-gray-600">Décomposer : (3x²+5)/x³ = 3x⁻¹ + 5x⁻³</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-300">
                <div className="font-bold text-purple-700 mb-2">Racines</div>
                <div className="text-sm text-gray-600">Réécrire : √(x⁵) = x^(5/2)</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-300">
                <div className="font-bold text-purple-700 mb-2">Combinaisons</div>
                <div className="text-sm text-gray-600">Mélanger polynômes, exponentielles, fractions</div>
              </div>
            </div>
          </div>
        </section>

        {/* Exercices avancés */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Exercices Complexes</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🏆 Défi : Fonctions Avancées
            </h2>
            <p className="text-xl text-gray-600">
              Dérive des fonctions complexes en combinant plusieurs techniques
            </p>
          </div>

          <div className="space-y-6">
            {exercicesAvances.map((exercice) => (
              <div key={exercice.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-purple-300 mb-4">
                      <div className="text-lg font-bold text-gray-800 mb-2">Exercice Avancé {exercice.id}</div>
                      <div className="text-xl text-purple-600">
                        {exercice.fonction}
                      </div>
                      <div className="text-lg text-gray-700 mt-2">
                        Calculer <strong>f'(x)</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <MathEditor
                      value={userAnswers[`advanced-${exercice.id}`] || ''}
                      onChange={(value) => setUserAnswers(prev => ({
                        ...prev,
                        [`advanced-${exercice.id}`]: value
                      }))}
                      placeholder="Écris la dérivée complexe..."
                    />
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCorrections(prev => ({
                          ...prev,
                          [`advanced-${exercice.id}`]: true
                        }))}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                      >
                        Voir la correction
                      </button>
                      
                      {userAnswers[`advanced-${exercice.id}`] && (
                        <div className={`px-4 py-2 rounded-lg font-bold ${
                          checkAnswer(`advanced-${exercice.id}`, userAnswers[`advanced-${exercice.id}`], exercice.reponse)
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {checkAnswer(`advanced-${exercice.id}`, userAnswers[`advanced-${exercice.id}`], exercice.reponse) 
                            ? '✓ Excellent !' 
                            : '✗ Réessaie'
                          }
                        </div>
                      )}
                    </div>
                    
                    {showCorrections[`advanced-${exercice.id}`] && (
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
                        <div className="font-bold text-purple-800 mb-2">✅ Correction :</div>
                        <div className="text-xl font-mono text-green-600 mb-2 text-gray-800 bg-white">
                          f'(x) = {exercice.reponse}
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Détail :</strong> {exercice.explication}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCompleted(true)}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                completed
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {completed 
                ? '✓ Exercices avancés maîtrisés ! +120 XP' 
                : 'J\'ai terminé les exercices avancés ! +120 XP'
              }
            </button>
          </div>
        </section>

        {/* Félicitations */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-6">
              CHAPITRE TERMINÉ !
            </h2>
            <p className="text-xl mb-6">
              Félicitations ! Tu maîtrises maintenant toutes les dérivées des fonctions de référence.
            </p>
            <Link href="/chapitre/fonctions-references-derivees">
              <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all">
                Retour au menu du chapitre
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 