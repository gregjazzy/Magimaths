'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Target, Trophy, CheckCircle, XCircle, Circle } from 'lucide-react';
import Link from 'next/link';

// Composant pour les exercices interactifs
interface ExerciseCardProps {
  exerciseNumber: number;
  equation: string;
  expectedSolutions: number[];
  deltaX: number;
  solutionsX: number[];
  rejectedX: number[];
  onComplete: (correct: boolean) => void;
  isCompleted: boolean;
}

function ExerciseCard({ 
  exerciseNumber, 
  equation, 
  expectedSolutions, 
  deltaX, 
  solutionsX, 
  rejectedX, 
  onComplete, 
  isCompleted 
}: ExerciseCardProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(['']);
  const [showSolution, setShowSolution] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const validateAnswer = () => {
    // Parse les réponses utilisateur et les trie
    const userSolutions = userAnswers
      .filter(answer => answer.trim() !== '')
      .map(answer => parseFloat(answer.trim()))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    // Compare avec les solutions attendues (triées)
    const expected = [...expectedSolutions].sort((a, b) => a - b);
    
    const correct = userSolutions.length === expected.length && 
                   userSolutions.every((sol, index) => Math.abs(sol - expected[index]) < 0.01);
    
    setIsCorrect(correct);
    setHasValidated(true);
    onComplete(correct);
  };

  const addAnswerField = () => {
    setUserAnswers(prev => [...prev, '']);
  };

  const updateAnswer = (index: number, value: string) => {
    setUserAnswers(prev => prev.map((answer, i) => i === index ? value : answer));
  };

  const removeAnswerField = (index: number) => {
    if (userAnswers.length > 1) {
      setUserAnswers(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-200">
      <div className="text-center mb-6">
        <div className="inline-block bg-green-100 px-4 py-2 rounded-full mb-3">
          <span className="font-bold text-green-800">Exercice {exerciseNumber}</span>
        </div>
        <div className="text-2xl font-mono font-bold text-gray-800 mb-2">
          {equation}
        </div>
        <div className="text-lg text-gray-600">
          Résolvez cette équation bicarrée
        </div>
      </div>

      {/* Interface de saisie des réponses */}
      <div className="bg-white p-4 rounded-xl border-2 border-gray-300 mb-4">
        <h4 className="font-bold text-gray-800 mb-3">✏️ Vos solutions :</h4>
        <div className="space-y-2">
          {userAnswers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 w-6">x =</span>
              <input
                type="number"
                step="any"
                value={answer}
                onChange={(e) => updateAnswer(index, e.target.value)}
                placeholder="Entrez une solution"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              {userAnswers.length > 1 && (
                <button
                  onClick={() => removeAnswerField(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addAnswerField}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Ajouter une solution
          </button>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button
            onClick={validateAnswer}
            disabled={userAnswers.every(answer => answer.trim() === '')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Vérifier
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
          >
            {showSolution ? 'Masquer' : 'Voir'} la solution
          </button>
        </div>

        {/* Résultat de validation */}
        {hasValidated && (
          <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? '✅ Excellent ! Réponse correcte' : '❌ Pas tout à fait...'}
            </div>
            {!isCorrect && (
              <div className="text-red-600 text-sm mt-1">
                Vérifiez vos calculs ou consultez la solution détaillée.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Solution détaillée */}
      {showSolution && (
        <SolutionDetails 
          equation={equation}
          deltaX={deltaX}
          solutionsX={solutionsX}
          rejectedX={rejectedX}
          expectedSolutions={expectedSolutions}
          exerciseNumber={exerciseNumber}
        />
      )}
    </div>
  );
}

// Composant pour afficher la solution détaillée
interface SolutionDetailsProps {
  equation: string;
  deltaX: number;
  solutionsX: number[];
  rejectedX: number[];
  expectedSolutions: number[];
  exerciseNumber: number;
}

function SolutionDetails({ equation, deltaX, solutionsX, rejectedX, expectedSolutions, exerciseNumber }: SolutionDetailsProps) {
  // Parse l'équation pour extraire les coefficients
  const getCoefficients = (eq: string) => {
    if (eq.includes('x⁴ - 10x² + 9 = 0')) return { a: 1, b: -10, c: 9 };
    if (eq.includes('x⁴ - 13x² + 36 = 0')) return { a: 1, b: -13, c: 36 };
    if (eq.includes('2x⁴ + x² - 3 = 0')) return { a: 2, b: 1, c: -3 };
    return { a: 1, b: 0, c: 0 };
  };

  const { a, b, c } = getCoefficients(equation);

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-300 mt-4">
      <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
        📖 Solution détaillée - Exercice {exerciseNumber}
      </h4>
      
      <div className="space-y-4">
        {/* Étape 1: Changement de variable */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <h5 className="font-bold text-blue-800 mb-2">Étape 1 : Changement de variable</h5>
          <div className="text-gray-800 space-y-2">
            <div className="font-mono text-lg">{equation}</div>
            <div>On pose <strong>X = x²</strong>, donc x⁴ = (x²)² = X²</div>
            <div className="font-mono bg-blue-100 p-2 rounded">
              {a}X² {b >= 0 ? '+' : ''}{b}X {c >= 0 ? '+' : ''}{c} = 0
            </div>
          </div>
        </div>

        {/* Étape 2: Résolution de l'équation en X */}
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
          <h5 className="font-bold text-purple-800 mb-2">Étape 2 : Résolution en X</h5>
          <div className="text-gray-800 space-y-2">
            <div>Discriminant : Δ = b² - 4ac = {b}² - 4×{a}×{c} = {deltaX}</div>
            {deltaX > 0 && (
              <div>
                <div>√Δ = {Math.sqrt(deltaX)}</div>
                <div>X₁ = (-{b} + {Math.sqrt(deltaX)}) / (2×{a}) = {solutionsX[0]}</div>
                <div>X₂ = (-{b} - {Math.sqrt(deltaX)}) / (2×{a}) = {solutionsX[1]}</div>
              </div>
            )}
          </div>
        </div>

        {/* Étape 3: Retour à x */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <h5 className="font-bold text-orange-800 mb-2">Étape 3 : Retour à x</h5>
          <div className="text-gray-800 space-y-3">
            {solutionsX.filter(X => X > 0).map((X, index) => (
              <div key={index} className="bg-green-100 p-2 rounded">
                <div className="font-bold text-green-700">Solution X = {X} &gt; 0 :</div>
                <div>x² = {X} ⟹ x = ±√{X} = ±{Math.sqrt(X).toFixed(3)}</div>
              </div>
            ))}
            
            {solutionsX.includes(0) && (
              <div className="bg-yellow-100 p-2 rounded">
                <div className="font-bold text-yellow-700">Solution X = 0 :</div>
                <div>x² = 0 ⟹ x = 0</div>
              </div>
            )}
            
            {rejectedX.length > 0 && (
              <div className="bg-red-100 p-2 rounded">
                <div className="font-bold text-red-700">Solutions rejetées :</div>
                {rejectedX.map((X, index) => (
                  <div key={index}>X = {X} &lt; 0 ⟹ impossible car x² ≥ 0</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conclusion */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl text-center">
          <div className="text-lg font-bold mb-2">🎉 Solutions finales</div>
          <div className="font-mono text-lg">
            x ∈ {'{' + expectedSolutions.map(s => s.toFixed(3)).join(', ') + '}'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TechniquesAvanceesPage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [chapterCompleted, setChapterCompleted] = useState(false);

  // États pour les techniques avancées
  const [advancedType, setAdvancedType] = useState<'bicarree' | 'inverse' | 'racine'>('bicarree');
  const [bicarreeParams, setBicarreeParams] = useState({ a: 1, b: -3, c: -4 });

  const handleSectionComplete = (sectionName: string, xp: number) => {
    if (!completedSections.includes(sectionName)) {
      setCompletedSections(prev => [...prev, sectionName]);
      setXpEarned(prev => prev + xp);
    }
  };

  // Bonus XP quand le chapitre est terminé
  useEffect(() => {
    if (completedSections.length >= 3 && !chapterCompleted) {
      setChapterCompleted(true);
      setXpEarned(prev => prev + 30);
    }
  }, [completedSections.length, chapterCompleted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/equations-second-degre" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Retour</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Techniques Avancées de Résolution</h1>
                <p className="text-sm text-gray-600">Changements de Variable • {xpEarned} XP gagnés</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {completedSections.length}/3 sections
            </div>
          </div>
          
          {/* Navigation par onglets */}
          <div className="flex space-x-1 overflow-x-auto">
            <Link 
              href="/chapitre/equations-second-degre"
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors min-w-max"
            >
              <span className="text-sm">1. Introduction</span>
            </Link>
            <Link 
              href="/chapitre/equations-second-degre-forme-canonique"
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors min-w-max"
            >
              <span className="text-sm">2. Forme Canonique</span>
            </Link>
            <Link 
              href="/chapitre/equations-second-degre-variations"
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors min-w-max"
            >
              <span className="text-sm">3. Variations</span>
            </Link>
            <Link 
              href="/chapitre/equations-second-degre-resolution"
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors min-w-max"
            >
              <span className="text-sm">4. Résolution</span>
            </Link>
            <div className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium min-w-max">
              <span className="text-sm">5. Techniques Avancées</span>
              <div className="ml-2 w-2 h-2 bg-white rounded-full"></div>
            </div>
            <Link href="/chapitre/equations-second-degre-tableaux-signes" className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors min-w-max">
              <span className="text-lg">6. Tableaux</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-parametres" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">7. Paramètres</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-equations-cube" className="flex items-center justify-center px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-center relative overflow-hidden">
              <span className="text-sm font-semibold">8. Cube</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-10">
        
        {/* Section 1: Introduction */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-indigo-800">Avancé</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Techniques Avancées de Résolution 🚀
            </h2>
            <p className="text-xl text-gray-600">Changements de variable pour résoudre des équations complexes</p>
          </div>

          <div className="space-y-8">
            {/* Introduction générale */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-300">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                🎯 Principe du changement de variable
              </h3>
              <div className="text-center space-y-4">
                <div className="text-lg text-gray-700">
                  Certaines équations semblent complexes mais peuvent se <strong>ramener au second degré</strong> par un changement de variable astucieux.
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-indigo-300">
                  <div className="text-lg font-bold text-indigo-600">
                    Équation complexe → <span className="text-purple-600">Changement de variable</span> → <span className="text-green-600">Équation du 2nd degré</span>
                  </div>
                </div>
                <div className="text-lg text-gray-700">
                  Une fois résolue, on <strong>revient à la variable originale</strong> pour trouver les solutions finales.
                </div>
              </div>
            </div>

            {/* Type 1: Équations bicarrées */}
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-300">
              <div className="flex items-center mb-6">
                <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">1</div>
                <h3 className="text-2xl font-bold text-green-800">Équations Bicarrées</h3>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-green-700 mb-4 text-xl">📋 Forme générale</h4>
                  <div className="bg-white p-4 rounded-lg border border-green-300 mb-4">
                    <div className="text-center text-lg font-mono text-gray-800 mb-3">
                      ax⁴ + bx² + c = 0
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      (Seules les puissances paires de x apparaissent)
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-green-700 mb-3">🔄 Changement de variable</h4>
                  <div className="bg-white p-4 rounded-lg border border-green-300">
                    <div className="space-y-2 text-center">
                      <div className="text-lg font-bold text-purple-600">On pose : X = x²</div>
                      <div className="text-gray-700">L'équation devient :</div>
                      <div className="text-lg font-mono text-blue-600">aX² + bX + c = 0</div>
                      <div className="text-sm text-gray-600">(Équation du second degré en X)</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-green-700 mb-4 text-xl">🧮 Exemple complet</h4>
                  <div className="bg-white p-4 rounded-lg border border-green-300">
                    <div className="space-y-3">
                      <div className="font-mono text-center text-lg text-blue-600">x⁴ - 5x² + 4 = 0</div>
                      
                      <div className="border-t pt-3">
                        <div className="text-sm space-y-2 text-gray-800">
                          <div><strong>1. Changement :</strong> X = x² ⟹ x⁴ devient X²</div>
                          <div><strong>2. Nouvelle équation :</strong> X² - 5X + 4 = 0</div>
                          <div><strong>3. Résolution :</strong> Δ = 25 - 16 = 9</div>
                          <div>&nbsp;&nbsp;&nbsp;X₁ = (5+3)/2 = 4, X₂ = (5-3)/2 = 1</div>
                          <div><strong>4. Retour à x :</strong></div>
                          <div>&nbsp;&nbsp;&nbsp;• X₁ = 4 ⟹ x² = 4 ⟹ x = ±2</div>
                          <div>&nbsp;&nbsp;&nbsp;• X₂ = 1 ⟹ x² = 1 ⟹ x = ±1</div>
                          <div className="font-bold text-green-600">Solutions : x ∈ {'{-2, -1, 1, 2}'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-red-700 mb-3 mt-4">⚠️ Exemple avec X négatif</h4>
                  <div className="bg-white p-4 rounded-lg border border-red-300">
                    <div className="space-y-3">
                      <div className="font-mono text-center text-lg text-blue-600">x⁴ + x² + 1 = 0</div>
                      
                      <div className="border-t pt-3">
                        <div className="text-sm space-y-2 text-gray-800">
                          <div><strong>1. Changement :</strong> X = x² ⟹ X² + X + 1 = 0</div>
                          <div><strong>2. Résolution :</strong> Δ = 1 - 4 = -3 &lt; 0</div>
                          <div className="text-red-600"><strong>3. Conclusion :</strong> Aucune solution pour X</div>
                          <div className="font-bold text-red-600">⟹ Aucune solution réelle pour x</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-orange-700 mb-3 mt-4">🔍 Exemple avec X partiellement négatif</h4>
                  <div className="bg-white p-4 rounded-lg border border-orange-300">
                    <div className="space-y-3">
                      <div className="font-mono text-center text-lg text-blue-600">x⁴ - 3x² - 4 = 0</div>
                      
                      <div className="border-t pt-3">
                        <div className="text-sm space-y-2 text-gray-800">
                          <div><strong>1. Changement :</strong> X = x² ⟹ X² - 3X - 4 = 0</div>
                          <div><strong>2. Résolution :</strong> Δ = 9 + 16 = 25</div>
                          <div>&nbsp;&nbsp;&nbsp;X₁ = (3+5)/2 = 4, X₂ = (3-5)/2 = -1</div>
                          <div><strong>3. Retour à x :</strong></div>
                          <div className="text-green-600">&nbsp;&nbsp;&nbsp;• X₁ = 4 &gt; 0 ⟹ x² = 4 ⟹ x = ±2 ✅</div>
                          <div className="text-red-600">&nbsp;&nbsp;&nbsp;• X₂ = -1 &lt; 0 ⟹ impossible car x² ≥ 0 ❌</div>
                          <div className="font-bold text-orange-600">Solutions : x ∈ {'{-2, 2}'} seulement</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type 2: Équations avec 1/x */}
            <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-300">
              <div className="flex items-center mb-6">
                <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">2</div>
                <h3 className="text-2xl font-bold text-yellow-800">Équations avec 1/x</h3>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-yellow-700 mb-4 text-xl">📋 Forme générale</h4>
                  <div className="bg-white p-4 rounded-lg border border-yellow-300 mb-4">
                    <div className="text-center text-lg font-mono text-gray-800 mb-3">
                      ax² + bx + c + d/x + e/x² = 0
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      (Présence de termes en 1/x et 1/x²)
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-yellow-700 mb-3">🔄 Technique</h4>
                  <div className="bg-white p-4 rounded-lg border border-yellow-300">
                    <div className="space-y-2 text-center">
                      <div className="text-lg font-bold text-purple-600">On multiplie par x²</div>
                      <div className="text-gray-700">Puis on pose : X = x + 1/x</div>
                      <div className="text-sm text-gray-600">(Car x² + 1/x² = (x + 1/x)² - 2)</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-yellow-700 mb-4 text-xl">🧮 Exemple complet</h4>
                  <div className="bg-white p-4 rounded-lg border border-yellow-300">
                    <div className="space-y-3">
                      <div className="font-mono text-center text-lg text-blue-600">x² - 3x + 1 + 3/x - 1/x² = 0</div>
                      
                      <div className="border-t pt-3">
                        <div className="text-sm space-y-2 text-gray-800">
                          <div><strong>1. Regroupement :</strong> (x² - 1/x²) - 3(x - 1/x) + 1 = 0</div>
                          <div><strong>2. Changement :</strong> X = x - 1/x</div>
                          <div>&nbsp;&nbsp;&nbsp;x² - 1/x² = (x - 1/x)(x + 1/x) = X(x + 1/x)</div>
                          <div><strong>3. Équation en X :</strong> Après simplification</div>
                          <div><strong>4. Résolution :</strong> Trouve X puis x</div>
                          <div className="font-bold text-yellow-600">⟹ Solutions numériques</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type 3: Équations avec √x */}
            <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-300">
              <div className="flex items-center mb-6">
                <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">3</div>
                <h3 className="text-2xl font-bold text-purple-800">Équations avec √x</h3>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-purple-700 mb-4 text-xl">📋 Forme générale</h4>
                  <div className="bg-white p-4 rounded-lg border border-purple-300 mb-4">
                    <div className="text-center text-lg font-mono text-gray-800 mb-3">
                      a√x + bx + c + d/√x = 0
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                      (Présence de √x et/ou 1/√x)
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-purple-700 mb-3">🔄 Changement de variable</h4>
                  <div className="bg-white p-4 rounded-lg border border-purple-300">
                    <div className="space-y-2 text-center">
                      <div className="text-lg font-bold text-purple-600">On pose : X = √x</div>
                      <div className="text-gray-700">Alors x = X² et 1/√x = 1/X</div>
                      <div className="text-sm text-gray-600">(Condition : x ≥ 0)</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-purple-700 mb-4 text-xl">🧮 Exemple complet</h4>
                  <div className="bg-white p-4 rounded-lg border border-purple-300">
                    <div className="space-y-3">
                      <div className="font-mono text-center text-lg text-blue-600">√x + x - 6 + 2/√x = 0</div>
                      
                      <div className="border-t pt-3">
                        <div className="text-sm space-y-2 text-gray-800">
                          <div><strong>1. Changement :</strong> X = √x (avec X ≥ 0)</div>
                          <div><strong>2. Substitution :</strong> x = X², 1/√x = 1/X</div>
                          <div><strong>3. Nouvelle équation :</strong> X + X² - 6 + 2/X = 0</div>
                          <div><strong>4. Multiplication par X :</strong> X² + X³ - 6X + 2 = 0</div>
                          <div><strong>5. Réarrangement :</strong> X³ + X² - 6X + 2 = 0</div>
                          <div><strong>6. Résolution :</strong> Équation du 3e degré</div>
                          <div className="font-bold text-purple-600">⟹ Retour à x = X²</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('introduction-techniques', 40)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('introduction-techniques')
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {completedSections.includes('introduction-techniques') ? '✓ Techniques comprises ! +40 XP' : 'J\'ai compris les techniques ! +40 XP'}
            </button>
          </div>
        </section>

        {/* Section 2: Calculateur interactif */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Calculateur</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Calculateur d'Équations Bicarrées 🧮
            </h2>
            <p className="text-xl text-gray-600">Résolvez automatiquement vos équations bicarrées !</p>
          </div>

          <div className="bg-gradient-to-r from-gray-100 to-indigo-100 p-6 rounded-2xl border-2 border-indigo-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              🧮 Calculateur Interactif
            </h3>
            
            <div className="space-y-6">
              {/* Sélecteur de type */}
              <div className="text-center">
                <div className="inline-flex bg-white rounded-xl p-1 shadow-lg">
                  <button 
                    onClick={() => setAdvancedType('bicarree')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      advancedType === 'bicarree' 
                        ? 'bg-green-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Bicarrée
                  </button>
                  <button 
                    onClick={() => setAdvancedType('inverse')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      advancedType === 'inverse' 
                        ? 'bg-yellow-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Avec 1/x
                  </button>
                  <button 
                    onClick={() => setAdvancedType('racine')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      advancedType === 'racine' 
                        ? 'bg-purple-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Avec √x
                  </button>
                </div>
              </div>

              {/* Interface selon le type */}
              {advancedType === 'bicarree' && (
                <div className="bg-white p-6 rounded-xl border-2 border-green-300">
                  <h4 className="text-xl font-bold text-green-800 mb-4 text-center">
                    Équation bicarrée : ax⁴ + bx² + c = 0
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-4">
                    <div className="text-center">
                      <label className="block text-sm font-bold text-gray-700 mb-2">a =</label>
                      <input
                        type="number"
                        step="any"
                        value={bicarreeParams.a}
                        onChange={(e) => setBicarreeParams(prev => ({ ...prev, a: parseFloat(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 text-center border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-sm font-bold text-gray-700 mb-2">b =</label>
                      <input
                        type="number"
                        step="any"
                        value={bicarreeParams.b}
                        onChange={(e) => setBicarreeParams(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 text-center border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-sm font-bold text-gray-700 mb-2">c =</label>
                      <input
                        type="number"
                        step="any"
                        value={bicarreeParams.c}
                        onChange={(e) => setBicarreeParams(prev => ({ ...prev, c: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 text-center border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <div className="font-mono text-xl text-blue-600">
                      {bicarreeParams.a}x⁴ {bicarreeParams.b >= 0 ? '+' : ''}{bicarreeParams.b}x² {bicarreeParams.c >= 0 ? '+' : ''}{bicarreeParams.c} = 0
                    </div>
                  </div>

                  {/* Résolution automatique */}
                  {(() => {
                    const { a, b, c } = bicarreeParams;
                    const deltaX = b * b - 4 * a * c;
                    let solutionsX: number[] = [];
                    let solutionsFinal: number[] = [];
                    let rejectedX: number[] = []; // Solutions X négatives rejetées
                    
                    if (deltaX > 0) {
                      const X1 = (-b + Math.sqrt(deltaX)) / (2 * a);
                      const X2 = (-b - Math.sqrt(deltaX)) / (2 * a);
                      solutionsX = [X1, X2];
                      
                      // Retour à x : x² = X
                      solutionsX.forEach(X => {
                        if (X > 0) {
                          solutionsFinal.push(Math.sqrt(X));
                          solutionsFinal.push(-Math.sqrt(X));
                        } else if (X === 0) {
                          solutionsFinal.push(0);
                        } else {
                          // X < 0 : pas de solution réelle car x² ne peut pas être négatif
                          rejectedX.push(X);
                        }
                      });
                    } else if (deltaX === 0) {
                      const X = -b / (2 * a);
                      solutionsX = [X];
                      if (X > 0) {
                        solutionsFinal.push(Math.sqrt(X));
                        solutionsFinal.push(-Math.sqrt(X));
                      } else if (X === 0) {
                        solutionsFinal.push(0);
                      } else {
                        rejectedX.push(X);
                      }
                    }
                    
                    return (
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="font-bold text-green-800 mb-2">1. Changement : X = x²</div>
                          <div className="font-mono text-gray-800">{a}X² {b >= 0 ? '+' : ''}{b}X {c >= 0 ? '+' : ''}{c} = 0</div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="font-bold text-blue-800 mb-2">2. Discriminant : Δ = {deltaX.toFixed(1)}</div>
                          {deltaX > 0 && (
                            <div className="text-gray-800">
                              X₁ = {solutionsX[0]?.toFixed(3)}, X₂ = {solutionsX[1]?.toFixed(3)}
                            </div>
                          )}
                          {deltaX === 0 && (
                            <div className="text-gray-800">X = {solutionsX[0]?.toFixed(3)} (solution double)</div>
                          )}
                          {deltaX < 0 && (
                            <div className="text-red-600">Aucune solution réelle pour X</div>
                          )}
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="font-bold text-purple-800 mb-2">3. Retour à x : x² = X</div>
                          
                          {/* Cas où on a des solutions X positives */}
                          {solutionsX.filter(X => X > 0).length > 0 && (
                            <div className="mb-3">
                              <div className="font-bold text-green-700 mb-1">✅ Solutions X positives :</div>
                              {solutionsX.filter(X => X > 0).map((X, index) => (
                                <div key={index} className="text-sm text-gray-800 ml-4">
                                  • X = {X.toFixed(3)} &gt; 0 ⟹ x² = {X.toFixed(3)} ⟹ x = ±{Math.sqrt(X).toFixed(3)}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Cas où on a X = 0 */}
                          {solutionsX.includes(0) && (
                            <div className="mb-3">
                              <div className="font-bold text-yellow-700 mb-1">⚪ Solution X nulle :</div>
                              <div className="text-sm text-gray-800 ml-4">
                                • X = 0 ⟹ x² = 0 ⟹ x = 0
                              </div>
                            </div>
                          )}
                          
                          {/* Cas où on a des solutions X négatives */}
                          {rejectedX.length > 0 && (
                            <div className="mb-3">
                              <div className="font-bold text-red-700 mb-1">❌ Solutions X négatives (rejetées) :</div>
                              {rejectedX.map((X, index) => (
                                <div key={index} className="text-sm text-red-600 ml-4">
                                  • X = {X.toFixed(3)} &lt; 0 ⟹ x² = {X.toFixed(3)} impossible dans ℝ
                                </div>
                              ))}
                              <div className="bg-red-100 p-2 rounded mt-2 text-sm text-red-800">
                                <div className="font-bold">💡 Rappel important :</div>
                                <div>Comme X = x², on doit avoir X ≥ 0. Les solutions X &lt; 0 sont impossibles !</div>
                              </div>
                            </div>
                          )}
                          
                          {/* Résultat final */}
                          <div className="border-t pt-2">
                            {solutionsFinal.length > 0 ? (
                              <div className="text-gray-800">
                                <strong>Solutions finales :</strong> x ∈ {'{' + solutionsFinal.map(s => s.toFixed(3)).sort((a, b) => parseFloat(a) - parseFloat(b)).join(', ') + '}'}
                              </div>
                            ) : (
                              <div className="text-red-600 font-bold">Aucune solution réelle</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Explication pédagogique supplémentaire */}
                        {rejectedX.length > 0 && (
                          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                            <div className="font-bold text-yellow-800 mb-2">🎓 Pourquoi rejeter les X négatifs ?</div>
                            <div className="text-sm text-yellow-700 space-y-1">
                              <div>• On a posé X = x², donc X représente le carré d'un nombre réel</div>
                              <div>• Or, le carré d'un nombre réel est toujours ≥ 0</div>
                              <div>• Donc si on trouve X &lt; 0, c'est mathématiquement impossible</div>
                              <div>• Ces solutions sont automatiquement rejetées</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {advancedType === 'inverse' && (
                <div className="bg-white p-6 rounded-xl border-2 border-yellow-300">
                  <h4 className="text-xl font-bold text-yellow-800 mb-4 text-center">
                    Technique en développement...
                  </h4>
                  <div className="text-center text-gray-600">
                    Cette section sera disponible prochainement
                  </div>
                </div>
              )}

              {advancedType === 'racine' && (
                <div className="bg-white p-6 rounded-xl border-2 border-purple-300">
                  <h4 className="text-xl font-bold text-purple-800 mb-4 text-center">
                    Technique en développement...
                  </h4>
                  <div className="text-center text-gray-600">
                    Cette section sera disponible prochainement
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('calculateur-bicarree', 35)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('calculateur-bicarree')
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {completedSections.includes('calculateur-bicarree') ? '✓ Calculateur testé ! +35 XP' : 'J\'ai testé le calculateur ! +35 XP'}
            </button>
          </div>
        </section>

        {/* Section 3: Exercices pratiques */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Entraînement</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exercices Pratiques Interactifs 🎯
            </h2>
            <p className="text-xl text-gray-600">Résolvez ces équations bicarrées et vérifiez vos réponses</p>
          </div>

          <div className="space-y-8">
            {/* Exercice 1 */}
            <ExerciseCard
              exerciseNumber={1}
              equation="x⁴ - 10x² + 9 = 0"
              expectedSolutions={[-3, -1, 1, 3]}
              deltaX={64}
              solutionsX={[9, 1]}
              rejectedX={[]}
              onComplete={(correct) => {
                if (correct && !completedSections.includes('exercice-1')) {
                  handleSectionComplete('exercice-1', 15);
                }
              }}
              isCompleted={completedSections.includes('exercice-1')}
            />

            {/* Exercice 2 */}
            <ExerciseCard
              exerciseNumber={2}
              equation="x⁴ - 13x² + 36 = 0"
              expectedSolutions={[-3, -2, 2, 3]}
              deltaX={25}
              solutionsX={[9, 4]}
              rejectedX={[]}
              onComplete={(correct) => {
                if (correct && !completedSections.includes('exercice-2')) {
                  handleSectionComplete('exercice-2', 15);
                }
              }}
              isCompleted={completedSections.includes('exercice-2')}
            />

            {/* Exercice 3 */}
            <ExerciseCard
              exerciseNumber={3}
              equation="2x⁴ + x² - 3 = 0"
              expectedSolutions={[-Math.sqrt(1.5), Math.sqrt(1.5)]}
              deltaX={25}
              solutionsX={[1.5, -1]}
              rejectedX={[-1]}
              onComplete={(correct) => {
                if (correct && !completedSections.includes('exercice-3')) {
                  handleSectionComplete('exercice-3', 15);
                }
              }}
              isCompleted={completedSections.includes('exercice-3')}
            />
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('exercices-pratiques', 45)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('exercices-pratiques')
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {completedSections.includes('exercices-pratiques') ? '✓ Exercices terminés ! +45 XP' : 'Finaliser les exercices +45 XP'}
            </button>
          </div>
        </section>

        {/* Section récapitulatif final */}
        {completedSections.length >= 3 && (
          <section className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-3xl p-7 shadow-xl text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold mb-4">Excellent ! Techniques Avancées Maîtrisées !</h2>
            <p className="text-xl mb-6">Tu peux maintenant résoudre des équations complexes par changement de variable !</p>
            
            {chapterCompleted && (
              <div className="bg-yellow-400/20 border-2 border-yellow-300 p-4 rounded-2xl mb-6">
                <div className="text-2xl font-bold text-yellow-200 mb-2">🎖️ Chapitre Avancé Terminé !</div>
                <div className="text-lg text-yellow-100">Bonus final : +30 XP</div>
              </div>
            )}
            
            <div className="bg-white/20 p-6 rounded-2xl inline-block">
              <div className="text-4xl font-bold">{xpEarned} XP</div>
              <div className="text-lg">Total gagné</div>
              <div className="text-sm mt-2 text-white/80">
                Sections: {40 + 35 + 45} XP + Bonus: 30 XP
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/chapitre/equations-second-degre"
                className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                <span>Retour au chapitre principal</span>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 