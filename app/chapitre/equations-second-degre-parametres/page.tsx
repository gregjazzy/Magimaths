'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Target, Trophy, TrendingUp, Eye, BookOpen } from 'lucide-react';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';

// Composant pour les expressions mathématiques
const MathDisplay = ({ children, block = false }: { children: string; block?: boolean }) => {
  if (block) {
    return <BlockMath math={children} />;
  }
  return <InlineMath math={children} />;
};

export default function ParametresPage() {
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
    if (completedSections.length >= 2 && !chapterCompleted) {
      setChapterCompleted(true);
      setXpEarned(prev => prev + 30);
    }
  }, [completedSections.length, chapterCompleted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <style jsx>{`
        .tableau-signe {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .tableau-signe th,
        .tableau-signe td {
          color: black !important;
        }
        .tableau-signe th::selection,
        .tableau-signe td::selection {
          background: transparent !important;
          color: black !important;
        }
      `}</style>
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
                <h1 className="text-lg font-bold text-gray-900">Équations avec Paramètre</h1>
                <p className="text-lg text-gray-600">Discussion selon m • {xpEarned} XP gagnés</p>
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
            <div className="flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">7. Paramètres</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <Link href="/chapitre/equations-second-degre-equations-cube" className="flex items-center justify-center px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-center relative overflow-hidden">
              <span className="text-sm font-semibold">8. Cube</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-10">
        
        {/* Section introduction aux équations avec paramètre */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Paramètres</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Équations avec Paramètre m 📐
            </h2>
            <p className="text-xl text-gray-600">Étudier une équation qui dépend d'un paramètre</p>
          </div>

          <div className="space-y-8">
            {/* Introduction au concept */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-300">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                🎯 Qu'est-ce qu'une équation avec paramètre ?
              </h3>
              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-xl border-2 border-purple-300">
                  <div className="text-2xl font-mono font-bold text-purple-600 mb-2">
                    f(x) = ax² + bx + c
                  </div>
                  <div className="text-lg text-gray-700">
                    où <strong>a</strong>, <strong>b</strong> ou <strong>c</strong> dépendent d'un paramètre <strong className="text-purple-600">m</strong>
                  </div>
                </div>
                <div className="text-lg text-gray-700">
                  Le <strong>nombre de solutions</strong> et le <strong>signe</strong> de f(x) vont <strong>dépendre de m</strong> !
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-300">
                      <div className="font-bold text-purple-800 mb-2">Exemple 1</div>
                      <div className="font-mono text-purple-600">x² + 2x + m = 0</div>
                      <div className="text-lg text-gray-700 mt-2">c dépend de m</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-300">
                      <div className="font-bold text-purple-800 mb-2">Exemple 2</div>
                      <div className="font-mono text-purple-600">mx² + 3x + 1 = 0</div>
                      <div className="text-lg text-gray-700 mt-2">a dépend de m</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-300 md:col-span-2 md:max-w-md md:mx-auto">
                      <div className="font-bold text-purple-800 mb-2">Exemple 3</div>
                      <div className="font-mono text-purple-600">x² + mx + 2 = 0</div>
                      <div className="text-lg text-gray-700 mt-2">b dépend de m</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Méthode générale */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-300">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                📊 Méthode de résolution
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-700 text-xl">🔍 Étapes à suivre :</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                      <div>
                        <div className="font-bold text-gray-800">Calculer Δ(m)</div>
                        <div className="text-lg text-gray-600">Δ = b² - 4ac en fonction de m</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                      <div>
                        <div className="font-bold text-gray-800">Étudier le signe de Δ(m)</div>
                        <div className="text-lg text-gray-600">Résoudre Δ(m) &gt; 0, Δ(m) = 0, Δ(m) &lt; 0</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                      <div>
                        <div className="font-bold text-gray-800">Conclure selon m</div>
                        <div className="text-lg text-gray-600">Nombre de solutions pour chaque intervalle de m</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-bold text-cyan-700 text-xl">⚠️ Cas particuliers :</h4>
                  <div className="space-y-3 text-lg">
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="font-bold text-orange-800">Si a dépend de m :</div>
                      <div className="text-orange-700">Vérifier d'abord si a = 0<br/>→ L'équation devient du 1er degré !</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800">Valeurs particulières :</div>
                      <div className="text-green-700">Tester les valeurs de m qui annulent Δ<br/>→ Racine double</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-800">Discussion complète :</div>
                      <div className="text-red-700">Organiser la réponse par intervalles de m<br/>→ Tableau de synthèse</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-7">
              <button
                onClick={() => handleSectionComplete('methode-parametre', 25)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  completedSections.includes('methode-parametre')
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {completedSections.includes('methode-parametre') ? '✓ Méthode comprise ! +25 XP' : 'J\'ai compris la méthode ! +25 XP'}
              </button>
            </div>
          </div>
        </section>

        {/* Section exemple détaillé */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Exemple</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Exemple Détaillé & Calculateur 🧮
            </h2>
            <p className="text-xl text-gray-600">x² + 2x + m = 0 : étude complète selon m</p>
          </div>

          <div className="space-y-6">
            {/* Exemple détaillé */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                🧮 Exemple détaillé : x² + 2x + m = 0
              </h3>
              
              <div className="space-y-6">
                {/* Calcul du discriminant */}
                <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                  <h4 className="text-xl font-bold text-green-800 mb-4">Étape 1 : Calcul de Δ(m)</h4>
                  
                  <div className="space-y-3">
                    <div className="text-gray-800">
                      <div>Équation : <span className="font-mono font-bold text-blue-600">x² + 2x + m = 0</span></div>
                      <div className="mt-2">Donc : a = 1, b = 2, c = m</div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-bold text-blue-800 mb-2">Calcul :</div>
                      <div className="space-y-1 text-gray-800">
                        <div>Δ(m) = b² - 4ac</div>
                        <div>Δ(m) = 2² - 4×1×m</div>
                        <div className="font-bold text-blue-600">Δ(m) = 4 - 4m</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Étude du signe */}
                <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                  <h4 className="text-xl font-bold text-green-800 mb-4">Étape 2 : Étude du signe de Δ(m)</h4>
                  
                  <div className="space-y-4">
                    <div className="text-gray-800">
                      <div className="font-bold">On étudie le signe de Δ(m) = 4 - 4m :</div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-green-500 p-4 rounded-lg border border-green-300">
                        <div className="font-bold text-white mb-2">Δ(m) &gt; 0</div>
                        <div className="text-lg space-y-1 text-white">
                          <div>4 - 4m &gt; 0</div>
                          <div>4 &gt; 4m</div>
                          <div className="font-bold">m &lt; 1</div>
                        </div>
                      </div>
                      <div className="bg-yellow-500 p-4 rounded-lg border border-yellow-300">
                        <div className="font-bold text-white mb-2">Δ(m) = 0</div>
                        <div className="text-lg space-y-1 text-white">
                          <div>4 - 4m = 0</div>
                          <div>4 = 4m</div>
                          <div className="font-bold">m = 1</div>
                        </div>
                      </div>
                      <div className="bg-red-500 p-4 rounded-lg border border-red-300">
                        <div className="font-bold text-white mb-2">Δ(m) &lt; 0</div>
                        <div className="text-lg space-y-1 text-white">
                          <div>4 - 4m &lt; 0</div>
                          <div>4 &lt; 4m</div>
                          <div className="font-bold">m &gt; 1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tableau de synthèse */}
                <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                  <h4 className="text-xl font-bold text-green-800 mb-4">Étape 3 : Tableau de synthèse</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 p-2 text-center font-bold">Valeurs de m</th>
                          <th className="border border-gray-300 p-2 text-center font-bold">Signe de Δ(m)</th>
                          <th className="border border-gray-300 p-2 text-center font-bold">Nombre de solutions</th>
                          <th className="border border-gray-300 p-2 text-center font-bold">Nature des solutions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="border border-gray-300 p-2 text-center font-mono font-bold text-lg">m &lt; 1</td>
                          <td className="border border-gray-300 p-2 text-center text-green-600 font-bold text-2xl">+</td>
                          <td className="border border-gray-300 p-2 text-center font-bold text-lg">2</td>
                          <td className="border border-gray-300 p-2 text-center text-lg">Deux solutions distinctes</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-2 text-center font-mono font-bold text-lg">m = 1</td>
                          <td className="border border-gray-300 p-2 text-center text-yellow-600 font-bold text-2xl">0</td>
                          <td className="border border-gray-300 p-2 text-center font-bold text-lg">1</td>
                          <td className="border border-gray-300 p-2 text-center text-lg">Une solution double : x = -1</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-gray-300 p-2 text-center font-mono font-bold text-lg">m &gt; 1</td>
                          <td className="border border-gray-300 p-2 text-center text-red-600 font-bold text-2xl">-</td>
                          <td className="border border-gray-300 p-2 text-center font-bold text-lg">0</td>
                          <td className="border border-gray-300 p-2 text-center text-lg">Aucune solution réelle</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                    <div className="font-bold text-indigo-800 mb-2">🎯 Conclusion :</div>
                    <div className="text-indigo-700 space-y-1">
                      <div>• Pour <strong>m &lt; 1</strong> : l'équation a 2 solutions</div>
                      <div>• Pour <strong>m = 1</strong> : l'équation a 1 solution (x = -1)</div>
                      <div>• Pour <strong>m &gt; 1</strong> : l'équation n'a pas de solution réelle</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculateur interactif */}
            <div className="bg-gradient-to-r from-gray-100 to-purple-100 p-6 rounded-2xl border-2 border-purple-300">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                🎮 Calculateur : Testez différentes valeurs de m
              </h3>
              
              <div className="bg-white p-4 rounded-xl border-2 border-purple-300">
                <div className="text-center mb-4">
                  <div className="font-mono text-xl text-purple-600 mb-2">x² + 2x + m = 0</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-2">Valeur de m :</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="0"
                        className="w-32 px-3 py-2 text-center border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        onChange={(e) => {
                          const m = parseFloat(e.target.value) || 0;
                          const delta = 4 - 4*m;
                          const resultDiv = document.getElementById('parametre-result');
                          if (resultDiv) {
                            if (delta > 0) {
                              const x1 = (-2 + Math.sqrt(delta))/2;
                              const x2 = (-2 - Math.sqrt(delta))/2;
                              resultDiv.innerHTML = `
                                <div class="text-green-600 font-bold">Δ = ${delta.toFixed(2)} > 0</div>
                                <div class="text-gray-800">Deux solutions :</div>
                                <div class="font-mono">x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)}</div>
                              `;
                            } else if (delta === 0) {
                              resultDiv.innerHTML = `
                                <div class="text-yellow-600 font-bold">Δ = 0</div>
                                <div class="text-gray-800">Une solution double :</div>
                                <div class="font-mono">x = -1</div>
                              `;
                            } else {
                              resultDiv.innerHTML = `
                                <div class="text-red-600 font-bold">Δ = ${delta.toFixed(2)} < 0</div>
                                <div class="text-gray-800">Aucune solution réelle</div>
                              `;
                            }
                          }
                        }}
                      />
                    </div>
                    <div id="parametre-result" className="p-3 bg-gray-50 rounded-lg min-h-16 flex flex-col justify-center">
                      <div className="text-gray-500">Entrez une valeur de m pour voir le résultat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('exemple-parametre', 40)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('exemple-parametre')
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {completedSections.includes('exemple-parametre') ? '✓ Exemple maîtrisé ! +40 XP' : 'J\'ai compris l\'exemple ! +40 XP'}
            </button>
          </div>
        </section>

        {/* Section récapitulatif final */}
        {completedSections.length >= 2 && (
          <section className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-3xl p-7 shadow-xl text-center">
            <div className="text-6xl mb-4">📐</div>
            <h2 className="text-lg font-bold mb-4">Bravo ! Maîtrise des Paramètres !</h2>
            <p className="text-xl mb-6">Tu sais maintenant résoudre les équations avec paramètre !</p>
            
            {chapterCompleted && (
              <div className="bg-yellow-400/20 border-2 border-yellow-300 p-4 rounded-2xl mb-6">
                <div className="text-2xl font-bold text-yellow-200 mb-2">🎖️ Expert des Paramètres !</div>
                <div className="text-lg text-yellow-100">Bonus final : +30 XP</div>
              </div>
            )}
            
            <div className="bg-white/20 p-6 rounded-2xl inline-block">
              <div className="text-4xl font-bold">{xpEarned} XP</div>
              <div className="text-lg">Total gagné</div>
              <div className="text-lg mt-2 text-white/80">
                Sections: {25 + 40} XP + Bonus: 30 XP
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