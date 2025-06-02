'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function EquationsCubePage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [chapterCompleted, setChapterCompleted] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
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
                <h1 className="text-lg font-bold text-gray-900">Équations du 3ème Degré</h1>
                <p className="text-sm text-gray-600">Méthode de la racine évidente • {xpEarned} XP gagnés</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {completedSections.length}/8 sections
            </div>
          </div>
          
          {/* Navigation par onglets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link href="/chapitre/equations-second-degre" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">1. Intro</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-forme-canonique" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">2. Canonique</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-variations" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">3. Variations</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-resolution" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">4. Résolution</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-techniques-avancees" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">5. Techniques</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-tableaux-signes" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">6. Inéquations</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-parametres" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">7. Paramètres</span>
            </Link>
            <div className="flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">8. Cube</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-10">
        
        {/* Section 1: Introduction */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Niveau Avancé</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Équations du 3ème Degré par Racine Évidente 🧮
            </h2>
            <p className="text-gray-600">Résolution d'équations de la forme ax³ + bx² + cx + d = 0</p>
          </div>

          <div className="space-y-8">
            {/* Principe de la méthode */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-300">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                🎯 Principe de la méthode
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border-l-4 border-purple-400">
                  <h4 className="font-bold text-purple-800 mb-3 text-lg">1. Racine évidente</h4>
                  <p className="text-gray-700 mb-3">Tester des valeurs simples pour trouver une racine :</p>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <div className="text-purple-700 font-mono text-sm space-y-1">
                      <div>• x = 0</div>
                      <div>• x = ±1</div>
                      <div>• x = ±2</div>
                      <div>• x = ±3...</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    On substitue ces valeurs dans l'équation jusqu'à trouver P(α) = 0
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-400">
                  <h4 className="font-bold text-indigo-800 mb-3 text-lg">2. Factorisation</h4>
                  <p className="text-gray-700 mb-3">Si α est racine, alors :</p>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <div className="text-indigo-700 font-mono font-bold text-center">
                      P(x) = (x - α) × Q(x)
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    Où Q(x) est un polynôme du 2nd degré qu'on trouve par division euclidienne
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border-l-4 border-blue-400">
                  <h4 className="font-bold text-blue-800 mb-3 text-lg">3. Résolution</h4>
                  <p className="text-gray-700 mb-3">Q(x) est du 2nd degré :</p>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="text-blue-700 font-mono text-sm text-center">
                      Q(x) = ax² + bx + c = 0
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    On applique toutes les techniques du second degré (discriminant, etc.)
                  </div>
                </div>
              </div>
            </div>

            {/* Pourquoi cette méthode fonctionne */}
            <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-300">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 text-center">
                💡 Pourquoi cette méthode fonctionne ?
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-bold">Théorème fondamental :</div>
                    <div className="text-sm">Si α est racine de P(x), alors (x - α) divise P(x)</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-bold">Degré du quotient :</div>
                    <div className="text-sm">Polynôme de degré 3 ÷ Polynôme de degré 1 = Polynôme de degré 2</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-bold">Retour aux techniques connues :</div>
                    <div className="text-sm">On résout une équation du 2nd degré avec discriminant, forme canonique, etc.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('intro-cube', 25)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('intro-cube')
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {completedSections.includes('intro-cube') ? '✓ Principe compris ! +25 XP' : 'J\'ai compris le principe ! +25 XP'}
            </button>
          </div>
        </section>

        {/* Section 2: Exemple détaillé */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Exemple Détaillé</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Résolution Pas à Pas 📝
            </h2>
            <p className="text-gray-600">x³ - 6x² + 11x - 6 = 0</p>
          </div>

          <div className="space-y-6">
            {/* Étape 1: Racine évidente */}
            <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                🔍 Étape 1 : Chercher une racine évidente
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-blue-200">
                  <div className="text-gray-800 mb-3">
                    <strong>Équation :</strong> <span className="font-mono text-lg">P(x) = x³ - 6x² + 11x - 6</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">Testons quelques valeurs simples :</div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-mono">P(0) = 0 - 0 + 0 - 6</span>
                        <span className="text-red-600 font-bold">= -6 ≠ 0</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-100 rounded border border-green-300">
                        <span className="font-mono">P(1) = 1 - 6 + 11 - 6</span>
                        <span className="text-green-600 font-bold">= 0 ✓</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-mono">P(-1) = -1 - 6 - 11 - 6</span>
                        <span className="text-red-600 font-bold">= -24 ≠ 0</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-mono">P(2) = 8 - 24 + 22 - 6</span>
                        <span className="text-red-600 font-bold">= 0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                    <div className="font-bold text-green-800">✓ Racine évidente trouvée : x = 1</div>
                    <div className="text-sm text-green-600">Car P(1) = 0, donc (x - 1) divise P(x)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 2: Factorisation */}
            <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-300">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">
                ⚙️ Étape 2 : Factorisation par (x - 1)
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-indigo-200">
                  <div className="text-gray-800 mb-3">
                    <strong>On cherche Q(x) tel que :</strong>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg text-center">
                    <span className="font-mono text-lg font-bold text-indigo-800">
                      x³ - 6x² + 11x - 6 = (x - 1) × Q(x)
                    </span>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    Par division euclidienne ou identification, on trouve :
                  </div>
                  
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <div className="font-mono text-sm space-y-1">
                      <div>Q(x) = x² - 5x + 6</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-indigo-100 rounded-lg border border-indigo-300">
                    <div className="font-bold text-indigo-800">✓ Factorisation :</div>
                    <div className="font-mono text-indigo-700 text-center mt-1">
                      x³ - 6x² + 11x - 6 = (x - 1)(x² - 5x + 6)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 3: Résolution du second degré */}
            <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-300">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                🎯 Étape 3 : Résolution de x² - 5x + 6 = 0
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-green-200">
                  <div className="text-gray-800 mb-3">
                    <strong>Équation du 2nd degré :</strong> <span className="font-mono text-lg">x² - 5x + 6 = 0</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <div className="font-bold text-yellow-800 mb-2">Méthode 1 : Discriminant</div>
                      <div className="font-mono text-sm space-y-1">
                        <div>a = 1, b = -5, c = 6</div>
                        <div>Δ = b² - 4ac = 25 - 24 = 1</div>
                        <div>x₁ = (5 + 1)/2 = 3</div>
                        <div>x₂ = (5 - 1)/2 = 2</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <div className="font-bold text-blue-800 mb-2">Méthode 2 : Factorisation</div>
                      <div className="font-mono text-sm space-y-1">
                        <div>x² - 5x + 6 = (x - 2)(x - 3)</div>
                        <div>Donc x = 2 ou x = 3</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                    <div className="font-bold text-green-800">✓ Racines du 2nd degré : x = 2 et x = 3</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution finale */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl border-2 border-green-400">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                🎉 Solution finale
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border-2 border-green-400">
                  <div className="text-center">
                    <div className="font-bold text-gray-800 mb-2">L'équation x³ - 6x² + 11x - 6 = 0 a pour solutions :</div>
                    <div className="text-2xl font-bold text-green-700">
                      S = {'{1 ; 2 ; 3}'}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid md:grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-purple-100 rounded-lg">
                      <div className="font-bold text-purple-800">x = 1</div>
                      <div className="text-xs text-purple-600">Racine évidente</div>
                    </div>
                    <div className="text-center p-2 bg-blue-100 rounded-lg">
                      <div className="font-bold text-blue-800">x = 2</div>
                      <div className="text-xs text-blue-600">Du 2nd degré</div>
                    </div>
                    <div className="text-center p-2 bg-blue-100 rounded-lg">
                      <div className="font-bold text-blue-800">x = 3</div>
                      <div className="text-xs text-blue-600">Du 2nd degré</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600">
                    <strong>Vérification :</strong> Une équation du 3ème degré a au maximum 3 solutions réelles. ✓
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('exemple-cube', 35)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('exemple-cube')
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections.includes('exemple-cube') ? '✓ Exemple maîtrisé ! +35 XP' : 'J\'ai compris l\'exemple ! +35 XP'}
            </button>
          </div>
        </section>

        {/* Section 3: Exercices */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Trophy className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Entraînement</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exercices d'Application 🏆
            </h2>
            <p className="text-gray-600">Mets en pratique la méthode de la racine évidente</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Exercice 1 */}
            <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-300">
              <h4 className="text-xl font-bold text-green-800 mb-4">
                🎯 Exercice 1
              </h4>
              <div className="bg-white p-4 rounded-xl border border-green-200">
                <div className="text-center mb-4">
                  <div className="font-mono text-lg font-bold text-gray-800">
                    x³ - 7x² + 14x - 8 = 0
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <div className="font-bold text-green-800 mb-1">🔍 Racine évidente :</div>
                    <div className="text-green-700">Teste x = 1 : P(1) = 1 - 7 + 14 - 8 = 0 ✓</div>
                  </div>
                  
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <div className="font-bold text-blue-800 mb-1">⚙️ Factorisation :</div>
                    <div className="text-blue-700 font-mono">(x - 1)(x² - 6x + 8) = 0</div>
                  </div>
                  
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <div className="font-bold text-purple-800 mb-1">🎯 Résolution x² - 6x + 8 = 0 :</div>
                    <div className="text-purple-700">Δ = 36 - 32 = 4, donc x = 2 et x = 4</div>
                  </div>
                  
                  <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                    <div className="font-bold text-yellow-800">✓ Solution :</div>
                    <div className="text-center font-bold text-lg text-yellow-700">
                      S = {'{1 ; 2 ; 4}'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercice 2 */}
            <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-300">
              <h4 className="text-xl font-bold text-orange-800 mb-4">
                🚀 Exercice 2
              </h4>
              <div className="bg-white p-4 rounded-xl border border-orange-200">
                <div className="text-center mb-4">
                  <div className="font-mono text-lg font-bold text-gray-800">
                    2x³ - 3x² - 3x + 2 = 0
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <div className="font-bold text-orange-800 mb-1">🔍 Racine évidente :</div>
                    <div className="text-orange-700">Teste x = 1/2 : P(1/2) = 1/4 - 3/4 - 3/2 + 2 = 0 ✓</div>
                  </div>
                  
                  <div className="p-3 bg-red-100 rounded-lg">
                    <div className="font-bold text-red-800 mb-1">⚙️ Factorisation :</div>
                    <div className="text-red-700 font-mono">(2x - 1)(x² - x - 2) = 0</div>
                  </div>
                  
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <div className="font-bold text-indigo-800 mb-1">🎯 Résolution x² - x - 2 = 0 :</div>
                    <div className="text-indigo-700">Δ = 1 + 8 = 9, donc x = -1 et x = 2</div>
                  </div>
                  
                  <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                    <div className="font-bold text-yellow-800">✓ Solution :</div>
                    <div className="text-center font-bold text-lg text-yellow-700">
                      S = {'{-1 ; 1/2 ; 2}'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('exercices-cube', 40)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('exercices-cube')
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {completedSections.includes('exercices-cube') ? '✓ Exercices terminés ! +40 XP' : 'Exercices terminés ! +40 XP'}
            </button>
          </div>
        </section>

        {/* Section récapitulatif final */}
        {completedSections.length >= 3 && (
          <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-3xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-3xl font-bold mb-4">Bravo ! Maîtrise des Équations Cubiques !</h2>
            <p className="text-xl mb-6">Tu sais maintenant résoudre des équations du 3ème degré !</p>
            
            {chapterCompleted && (
              <div className="bg-yellow-400/20 border-2 border-yellow-300 p-4 rounded-2xl mb-6">
                <div className="text-2xl font-bold text-yellow-200 mb-2">🏆 Technique Avancée Maîtrisée !</div>
                <div className="text-lg text-yellow-100">Bonus final : +30 XP</div>
              </div>
            )}
            
            <div className="bg-white/20 p-6 rounded-2xl inline-block">
              <div className="text-4xl font-bold">{xpEarned} XP</div>
              <div className="text-lg">Total gagné</div>
              <div className="text-sm mt-2 text-white/80">
                Sections: {25 + 35 + 40} XP + Bonus: 30 XP
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/chapitre/equations-second-degre"
                className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
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