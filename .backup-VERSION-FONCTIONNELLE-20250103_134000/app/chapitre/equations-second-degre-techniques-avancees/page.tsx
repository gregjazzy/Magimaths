'use client';

import { useState } from 'react';
import { Calculator, CheckCircle, XCircle } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

export default function TechniquesAvanceesPage() {
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string[]}>({});
  const [showSolutions, setShowSolutions] = useState<{[key: string]: boolean}>({});

  const exercises = [
    {
      id: 'ex1',
      equation: 'x⁴ - 10x² + 9 = 0',
      solutions: [1, -1, 3, -3],
      steps: {
        substitution: 'X = x²',
        transformed: 'X² - 10X + 9 = 0',
        delta: 100 - 36,
        xSolutions: [1, 9],
        finalSolutions: [1, -1, 3, -3]
      }
    },
    {
      id: 'ex2', 
      equation: 'x⁴ - 13x² + 36 = 0',
      solutions: [2, -2, 3, -3],
      steps: {
        substitution: 'X = x²',
        transformed: 'X² - 13X + 36 = 0',
        delta: 169 - 144,
        xSolutions: [4, 9],
        finalSolutions: [2, -2, 3, -3]
      }
    },
    {
      id: 'ex3',
      equation: '2x⁴ + x² - 3 = 0',
      solutions: [1, -1],
      steps: {
        substitution: 'X = x²',
        transformed: '2X² + X - 3 = 0',
        delta: 1 + 24,
        xSolutions: [1],
        finalSolutions: [1, -1]
      }
    }
  ];

  const validateAnswer = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return false;
    
    const userSols = (userAnswers[exerciseId] || [])
      .filter(ans => ans.trim() !== '')
      .map(ans => parseFloat(ans.trim()))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    const expectedSols = [...exercise.solutions].sort((a, b) => a - b);
    
    return userSols.length === expectedSols.length && 
           userSols.every((sol, i) => Math.abs(sol - expectedSols[i]) < 0.01);
  };

  const sections = [
    {
      id: 'intro',
      title: 'Équations Bicarrées 🧮',
      icon: '⚡',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              🎯 Principe des équations bicarrées
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border-l-4 border-purple-400">
                <h4 className="font-bold text-purple-800 mb-3 text-lg">1. Reconnaître</h4>
                <p className="text-gray-700 mb-3">Équation de la forme :</p>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="text-purple-700 font-mono font-bold text-center">
                    ax⁴ + bx² + c = 0
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Pas de termes en x³ ou x¹
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-400">
                <h4 className="font-bold text-indigo-800 mb-3 text-lg">2. Substitution</h4>
                <p className="text-gray-700 mb-3">Poser X = x² :</p>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <div className="text-indigo-700 font-mono font-bold text-center">
                    aX² + bX + c = 0
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Résoudre cette équation du 2nd degré
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border-l-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-3 text-lg">3. Retour à x</h4>
                <p className="text-gray-700 mb-3">Pour chaque solution X :</p>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-blue-700 font-mono text-sm text-center">
                    Si X ≥ 0 : x = ±√X
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Si X {'<'} 0 : pas de solution réelle
                </div>
              </div>
            </div>
              </div>
              
          <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-yellow-800 mb-4 text-center">
              💡 Pourquoi cette méthode fonctionne ?
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-bold">Simplification :</div>
                  <div className="text-sm">On transforme une équation du 4ème degré en équation du 2ème degré</div>
                    </div>
                  </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-bold">Symétrie :</div>
                  <div className="text-sm">Si x est solution, alors -x l'est aussi (car tous les exposants sont pairs)</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-bold">Technique connue :</div>
                  <div className="text-sm">On utilise le discriminant et toutes les techniques du second degré</div>
                </div>
              </div>
            </div>
          </div>
          </div>
      ),
      xpReward: 25
    },
    {
      id: 'example',
      title: 'Exemple Détaillé 📝',
      icon: '🔍',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Résolution de x⁴ - 5x² + 4 = 0
            </h3>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  🔍 Étape 1 : Changement de variable
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-200">
                    <div className="text-gray-800 mb-3">
                      <strong>Équation :</strong> <span className="font-mono text-lg">x⁴ - 5x² + 4 = 0</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">On pose X = x², donc x⁴ = (x²)² = X²</div>
                    <div className="font-mono bg-blue-100 p-2 rounded">
                      X² - 5X + 4 = 0
                    </div>
                  </div>
                    </div>
                  </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h5 className="font-bold text-green-800 mb-2">Étape 2 : Résolution de l'équation en X</h5>
                <div className="space-y-2">
                  <div>Δ = (-5)² - 4(1)(4) = 25 - 16 = 9</div>
                  <div>X₁ = (5 + 3)/2 = 4</div>
                  <div>X₂ = (5 - 3)/2 = 1</div>
                            </div>
                        </div>
                        
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h5 className="font-bold text-purple-800 mb-2">Étape 3 : Retour à x</h5>
                <div className="space-y-2">
                  <div>Pour X₁ = 4 : x² = 4 → x = ±2</div>
                  <div>Pour X₂ = 1 : x² = 1 → x = ±1</div>
                                     <div className="font-bold text-purple-600">Solutions : x ∈ {'{-2, -1, 1, 2}'}</div>
                              </div>
                            </div>
                                </div>
                              </div>
                            </div>
      ),
      xpReward: 30
    },
    {
      id: 'exercises',
      title: 'Exercices Pratiques 💪',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement sur les équations bicarrées</h3>
            <p className="text-lg">
              Résolvez ces équations étape par étape !
            </p>
          </div>

          <div className="grid gap-6">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Exercice {index + 1} : {exercise.equation}
                  </h3>
                  <p className="text-gray-600">Résolvez cette équation bicarrée</p>
                        </div>
                        
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-bold text-gray-800 mb-3">✏️ Vos solutions :</h4>
                  <div className="space-y-2">
                    {(userAnswers[exercise.id] || ['']).map((answer, ansIndex) => (
                      <div key={ansIndex} className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600 w-6">x =</span>
                        <input
                          type="number"
                          step="any"
                          value={answer}
                          onChange={(e) => {
                            const newAnswers = [...(userAnswers[exercise.id] || [''])];
                            newAnswers[ansIndex] = e.target.value;
                            setUserAnswers(prev => ({ ...prev, [exercise.id]: newAnswers }));
                          }}
                          placeholder="Entrez une solution"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                        {(userAnswers[exercise.id] || ['']).length > 1 && (
                          <button
                            onClick={() => {
                              const newAnswers = (userAnswers[exercise.id] || ['']).filter((_, i) => i !== ansIndex);
                              setUserAnswers(prev => ({ ...prev, [exercise.id]: newAnswers }));
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-lg w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newAnswers = [...(userAnswers[exercise.id] || ['']), ''];
                        setUserAnswers(prev => ({ ...prev, [exercise.id]: newAnswers }));
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Ajouter une solution
                    </button>
                </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => {
                        const isCorrect = validateAnswer(exercise.id);
                        alert(isCorrect ? '✅ Excellent ! Réponse correcte' : '❌ Pas tout à fait...');
                      }}
                      disabled={(userAnswers[exercise.id] || ['']).every(answer => answer.trim() === '')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Vérifier
                    </button>
                    <button
                      onClick={() => setShowSolutions(prev => ({ ...prev, [exercise.id]: !prev[exercise.id] }))}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
                    >
                      {showSolutions[exercise.id] ? 'Masquer' : 'Voir'} la solution
                    </button>
                  </div>
                </div>

                {showSolutions[exercise.id] && (
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h5 className="font-bold text-blue-800 mb-2">📖 Solution détaillée</h5>
                    <div className="space-y-2 text-sm">
                      <div><strong>1.</strong> Substitution X = x² : {exercise.steps.transformed}</div>
                      <div><strong>2.</strong> Δ = {exercise.steps.delta} → X = {exercise.steps.xSolutions.join(', ')}</div>
                      <div><strong>3.</strong> Retour à x : {exercise.steps.finalSolutions.join(', ')}</div>
                  </div>
                </div>
              )}
            </div>
            ))}
          </div>
          </div>
      ),
      xpReward: 35
    }
  ];

  return (
    <ChapterLayout
      title="Techniques Avancées"
      description="Équations bicarrées et méthodes de substitution"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-parametres', text: 'Paramètres' },
        next: { href: '/chapitre/equations-second-degre-equations-cube', text: 'Équations cubiques' }
      }}
    />
  );
} 