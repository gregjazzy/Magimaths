'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, Target, Trophy, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function FormulesBasePage() {
  const [completedFormulas, setCompletedFormulas] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [showCorrections, setShowCorrections] = useState<{[key: string]: boolean}>({});
  const [completedExercises, setCompletedExercises] = useState(false);

  // Composant pour afficher les formules mathématiques
  const MathFormula = ({ children }: { children: React.ReactNode }) => (
    <span className="font-mono text-gray-800 bg-white">{children}</span>
  );

  // Composant éditeur mathématique simplifié
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
      { symbol: '√x', label: '√x' },
      { symbol: '1/x', label: '1/x' },
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
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none font-mono text-lg text-gray-800 bg-white placeholder-gray-500"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-600 mb-2">Symboles mathématiques :</div>
          <div className="grid grid-cols-5 gap-1">
            {mathSymbols.map((item, index) => (
              <button
                key={index}
                onClick={() => insertSymbol(item.symbol)}
                className="bg-white hover:bg-blue-50 border border-gray-300 rounded px-2 py-1 text-sm font-mono transition-colors text-gray-800 hover:text-blue-800"
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

  const formules = [
    {
      id: 'constante',
      nom: 'Fonction constante',
      fonction: <MathFormula>f(x) = k</MathFormula>,
      derivee: <MathFormula>f'(x) = 0</MathFormula>,
      couleur: 'bg-gray-100 border-gray-400',
      exemple: <MathFormula>f(x) = 5 ⟹ f'(x) = 0</MathFormula>
    },
    {
      id: 'identite',
      nom: 'Fonction identité',
      fonction: <MathFormula>f(x) = x</MathFormula>,
      derivee: <MathFormula>f'(x) = 1</MathFormula>,
      couleur: 'bg-blue-100 border-blue-400',
      exemple: <MathFormula>f(x) = x ⟹ f'(x) = 1</MathFormula>
    },
    {
      id: 'puissance',
      nom: 'Fonction puissance',
      fonction: <MathFormula>f(x) = x<sup>n</sup></MathFormula>,
      derivee: <MathFormula>f'(x) = n·x<sup>n-1</sup></MathFormula>,
      couleur: 'bg-purple-100 border-purple-400',
      exemple: <MathFormula>f(x) = x³ ⟹ f'(x) = 3x²</MathFormula>
    },
    {
      id: 'racine',
      nom: 'Fonction racine',
      fonction: <MathFormula>f(x) = <span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></MathFormula>,
      derivee: (
        <MathFormula>
          <div className="flex items-center">
            f'(x) 
            <div className="inline-block mx-2">
              <div className="text-center">=</div>
            </div>
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">1</div>
              <div className="text-center pt-1">2<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></div>
            </div>
          </div>
        </MathFormula>
      ),
      couleur: 'bg-green-100 border-green-400',
      exemple: (
        <MathFormula>
          <div className="flex items-center flex-wrap">
            f(x) 
            <span className="mx-2">=</span>
            <span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span>
            <span className="mx-3">⟹</span>
            f'(x)
            <span className="mx-2">=</span>
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">1</div>
              <div className="text-center pt-1">2<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></div>
            </div>
          </div>
        </MathFormula>
      )
    },
    {
      id: 'inverse',
      nom: 'Fonction inverse',
      fonction: (
        <MathFormula>
          <div className="flex items-center">
            f(x)
            <div className="inline-block mx-2">
              <div className="text-center">=</div>
            </div>
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">1</div>
              <div className="text-center pt-1">x</div>
            </div>
          </div>
        </MathFormula>
      ),
      derivee: (
        <MathFormula>
          <div className="flex items-center">
            f'(x)
            <div className="inline-block mx-2">
              <div className="text-center">=</div>
            </div>
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">-1</div>
              <div className="text-center pt-1">x²</div>
            </div>
          </div>
        </MathFormula>
      ),
      couleur: 'bg-red-100 border-red-400',
      exemple: (
        <MathFormula>
          <div className="flex items-center">
            f(x)
            <div className="inline-block mx-2">
              <div className="text-center">=</div>
            </div>
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">1</div>
              <div className="text-center pt-1">x</div>
            </div>
            <span className="mx-2">⟹</span>
            f'(x)
            <div className="inline-block mx-2">
              <div className="text-center">=</div>
            </div>
            <div className="inline-block">
              <div className="text-center border-b border-gray-800 pb-1">-1</div>
              <div className="text-center pt-1">x²</div>
            </div>
          </div>
        </MathFormula>
      )
    },
    {
      id: 'exponentielle',
      nom: 'Fonction exponentielle',
      fonction: <MathFormula>f(x) = e<sup>x</sup></MathFormula>,
      derivee: <MathFormula>f'(x) = e<sup>x</sup></MathFormula>,
      couleur: 'bg-yellow-100 border-yellow-400',
      exemple: <MathFormula>f(x) = e<sup>x</sup> ⟹ f'(x) = e<sup>x</sup></MathFormula>
    }
  ];

  const exercicesBasiques = [
    {
      id: 1,
      fonction: <MathFormula>f(x) = 7</MathFormula>,
      reponse: "0",
      explication: "Une fonction constante a toujours une dérivée égale à 0"
    },
    {
      id: 2,
      fonction: <MathFormula>g(x) = x<sup>3</sup></MathFormula>,
      reponse: "3x²",
      explication: <span>Pour x<sup>n</sup>, la dérivée est n·x<sup>n-1</sup>, donc 3·x<sup>3-1</sup> = 3x<sup>2</sup></span>
    },
    {
      id: 3,
      fonction: <MathFormula>h(x) = 2x</MathFormula>,
      reponse: "2",
      explication: "La dérivée de 2x est 2 (coefficient × dérivée de x)"
    },
    {
      id: 4,
      fonction: <MathFormula>k(x) = <span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></MathFormula>,
      reponse: "1/(2√x)",
      explication: (
        <span>
          La dérivée de <span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span> est 
          <div className="inline-block mx-1">
            <div className="text-center border-b border-gray-800 pb-1">1</div>
            <div className="text-center pt-1">2<span className="relative">√<span className="border-t border-gray-800 px-1">x</span></span></div>
          </div>
        </span>
      )
    },
    {
      id: 5,
      fonction: <MathFormula>m(x) = e<sup>x</sup></MathFormula>,
      reponse: "eˣ",
      explication: "La fonction exponentielle est sa propre dérivée"
    }
  ];

  const checkAnswer = (exerciseId: string, userAnswer: string, correctAnswer: string) => {
    const normalized = (str: string) => str.replace(/\s/g, '').toLowerCase();
    return normalized(userAnswer) === normalized(correctAnswer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      {/* Header avec navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/fonctions-references-derivees" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour au chapitre</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full">
                <Trophy className="h-4 w-4" />
                <span className="font-bold">80 XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 max-w-6xl mx-auto p-6 space-y-10">
        
        {/* Introduction */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <div className="text-6xl mb-6">📋</div>
            <h1 className="text-4xl font-bold mb-6">
              FORMULES DE BASE
            </h1>
            <div className="text-2xl mb-6">
              Les dérivées essentielles à connaître par cœur
            </div>
            <div className="text-lg text-blue-100">
              🎯 Objectif : Mémoriser les formules + exercices simples
            </div>
          </div>
        </section>

        {/* Formules de référence */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-cyan-100 px-4 py-2 rounded-full mb-4">
              <BookOpen className="h-5 w-5 text-cyan-600" />
              <span className="font-semibold text-cyan-800">Formules de Base</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📋 Dérivées des Fonctions de Référence
            </h2>
            <p className="text-xl text-gray-600">
              Ces formules sont à connaître <strong>absolument par cœur</strong> !
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formules.map((formule) => (
              <div 
                key={formule.id}
                className={`${formule.couleur} p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105`}
                onClick={() => setSelectedFormula(formule.id === selectedFormula ? null : formule.id)}
              >
                <div className="text-center">
                  <h3 className="font-bold text-gray-800 mb-3">{formule.nom}</h3>
                  <div className="bg-white p-4 rounded-lg mb-4 border-2 border-gray-300">
                    <div className="text-lg text-gray-800 mb-2">
                      {formule.fonction}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formule.derivee}
                    </div>
                  </div>
                  
                  {selectedFormula === formule.id && (
                    <div className="bg-white/80 p-3 rounded-lg border border-gray-400">
                      <div className="text-sm font-bold text-gray-700 mb-1">Exemple :</div>
                      <div className="text-sm text-gray-800">{formule.exemple}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCompletedFormulas(true)}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                completedFormulas
                  ? 'bg-green-500 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              {completedFormulas 
                ? '✓ Formules maîtrisées ! +30 XP' 
                : 'J\'ai mémorisé les formules ! +30 XP'
              }
            </button>
          </div>
        </section>

        {/* Exercices de base */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Entraînement de Base</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎯 Application Directe des Formules
            </h2>
            <p className="text-xl text-gray-600">
              Applique directement les formules que tu viens d'apprendre
            </p>
          </div>

          <div className="space-y-6">
            {exercicesBasiques.map((exercice) => (
              <div key={exercice.id} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-green-300 mb-4">
                      <div className="text-lg font-bold text-gray-800 mb-2">Exercice {exercice.id}</div>
                      <div className="text-xl text-blue-600">
                        {exercice.fonction}
                      </div>
                      <div className="text-lg text-gray-700 mt-2">
                        Calculer <strong>f'(x)</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <MathEditor
                      value={userAnswers[`basic-${exercice.id}`] || ''}
                      onChange={(value) => setUserAnswers(prev => ({
                        ...prev,
                        [`basic-${exercice.id}`]: value
                      }))}
                      placeholder="Écris la dérivée..."
                    />
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowCorrections(prev => ({
                          ...prev,
                          [`basic-${exercice.id}`]: true
                        }))}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                      >
                        Voir la correction
                      </button>
                      
                      {userAnswers[`basic-${exercice.id}`] && (
                        <div className={`px-4 py-2 rounded-lg font-bold ${
                          checkAnswer(`basic-${exercice.id}`, userAnswers[`basic-${exercice.id}`], exercice.reponse)
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {checkAnswer(`basic-${exercice.id}`, userAnswers[`basic-${exercice.id}`], exercice.reponse) 
                            ? '✓ Correct !' 
                            : '✗ Incorrect'
                          }
                        </div>
                      )}
                    </div>
                    
                    {showCorrections[`basic-${exercice.id}`] && (
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                        <div className="font-bold text-blue-800 mb-2">✅ Correction :</div>
                        <div className="text-xl font-mono text-green-600 mb-2 text-gray-800 bg-white">
                          f'(x) = {exercice.reponse}
                        </div>
                        <div className="text-sm text-gray-700">
                          <strong>Explication :</strong> {exercice.explication}
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
              onClick={() => setCompletedExercises(true)}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                completedExercises
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {completedExercises 
                ? '✓ Exercices de base maîtrisés ! +50 XP' 
                : 'J\'ai terminé les exercices de base ! +50 XP'
              }
            </button>
          </div>
        </section>

        {/* Navigation */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Prochaine étape</h2>
            <Link href="/chapitre/fonctions-references-derivees/formules-complexes">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all">
                Continuer vers les Formules complexes →
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 