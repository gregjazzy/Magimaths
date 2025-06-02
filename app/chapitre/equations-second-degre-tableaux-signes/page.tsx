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

export default function TableauxSignesPage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [chapterCompleted, setChapterCompleted] = useState(false);

  // États pour le calculateur interactif
  const [inequationParams, setInequationParams] = useState({ a: 1, b: -3, c: 2 });
  const [inequationType, setInequationType] = useState<'>' | '<' | '>=' | '<='>('<');
  const [showTableau, setShowTableau] = useState(false);

  // États pour afficher/cacher les solutions des exercices
  const [showExercice1, setShowExercice1] = useState(false);
  const [showExercice2, setShowExercice2] = useState(false);
  const [showExercice3, setShowExercice3] = useState(false);
  const [showExercice4, setShowExercice4] = useState(false);
  const [showExercice5, setShowExercice5] = useState(false);
  const [showExercice6, setShowExercice6] = useState(false);

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
      setXpEarned(prev => prev + 40);
    }
  }, [completedSections.length, chapterCompleted]);

  // Calcul des solutions et construction du tableau
  const calculateInequationSolution = () => {
    const { a, b, c } = inequationParams;
    const delta = b * b - 4 * a * c;
    let solutions: number[] = [];
    let intervals: string[] = [];
    
    if (delta > 0) {
      const x1 = (-b - Math.sqrt(delta)) / (2 * a);
      const x2 = (-b + Math.sqrt(delta)) / (2 * a);
      solutions = [x1, x2].sort((a, b) => a - b);
    } else if (delta === 0) {
      const x = -b / (2 * a);
      solutions = [x];
    }
    
    // Construction des intervalles de solution selon le type d'inéquation
    if (delta > 0) {
      const [x1, x2] = solutions;
      if (a > 0) {
        // Parabole vers le haut
        if (inequationType === '>') {
          intervals = [`]-∞; ${x1.toFixed(2)}[`, `]${x2.toFixed(2)}; +∞[`];
        } else if (inequationType === '<') {
          intervals = [`]${x1.toFixed(2)}; ${x2.toFixed(2)}[`];
        } else if (inequationType === '>=') {
          intervals = [`]-∞; ${x1.toFixed(2)}]`, `[${x2.toFixed(2)}; +∞[`];
        } else {
          intervals = [`[${x1.toFixed(2)}; ${x2.toFixed(2)}]`];
        }
      } else {
        // Parabole vers le bas
        if (inequationType === '>') {
          intervals = [`]${x1.toFixed(2)}; ${x2.toFixed(2)}[`];
        } else if (inequationType === '<') {
          intervals = [`]-∞; ${x1.toFixed(2)}[`, `]${x2.toFixed(2)}; +∞[`];
        } else if (inequationType === '>=') {
          intervals = [`[${x1.toFixed(2)}; ${x2.toFixed(2)}]`];
        } else {
          intervals = [`]-∞; ${x1.toFixed(2)}]`, `[${x2.toFixed(2)}; +∞[`];
        }
      }
    } else if (delta === 0) {
      const x = solutions[0];
      if (inequationType === '>=' && a > 0) {
        intervals = ['ℝ'];
      } else if (inequationType === '<=' && a < 0) {
        intervals = ['ℝ'];
      } else if ((inequationType === '>=' || inequationType === '<=') && 
                 ((a > 0 && inequationType === '<=') || (a < 0 && inequationType === '>='))) {
        intervals = [`{${x.toFixed(2)}}`];
      } else {
        intervals = ['∅'];
      }
    } else {
      // Pas de racines réelles
      if ((a > 0 && (inequationType === '>' || inequationType === '>=')) ||
          (a < 0 && (inequationType === '<' || inequationType === '<='))) {
        intervals = ['ℝ'];
      } else {
        intervals = ['∅'];
      }
    }
    
    return { solutions, intervals, delta };
  };

  // Génération des points de la parabole pour le graphique
  const generateParabolaPoints = () => {
    const { a, b, c } = inequationParams;
    const points = [];
    for (let x = -8; x <= 8; x += 0.2) {
      const y = a * x * x + b * x + c;
      if (y >= -10 && y <= 10) {
        points.push(`${(x + 8) * 15},${(10 - y) * 15}`);
      }
    }
    return points.join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
                <h1 className="text-lg font-bold text-gray-900">Inéquations & Tableaux de Signe</h1>
                <p className="text-lg text-gray-600">Résolution graphique • {xpEarned} XP gagnés</p>
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
            <div className="flex items-center justify-center px-3 py-2 bg-cyan-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">6. Inéquations</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
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
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Analyse</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tableaux de Signe & Inéquations 📊
            </h2>
            <p className="text-xl text-gray-600">Résoudre des inégalités ax² + bx + c avec les fonctions du second degré</p>
          </div>

          <div className="space-y-6">
            {/* Règles selon delta puis a */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-300">
              <h3 className="text-lg font-bold text-center text-gray-800 mb-6">
                📏 Règles du signe selon Δ puis a
              </h3>
              
              <div className="space-y-6">
                {/* Cas Δ > 0 */}
                <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                  <h4 className="text-lg font-bold text-center text-gray-800 mb-6">
                    📊 Cas 1 : Δ &gt; 0 (Deux racines distinctes)
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-2">Si a &gt; 0 :</div>
                      <div className="bg-white p-2 rounded border">
                        <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">x₁</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">x₂</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                              <td className="border-t border-b border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                              <td className="border-t border-b border-gray-400 p-2 text-right text-black font-bold text-xl select-none">+</td>
                              <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="border-l-4 border-gray-400 h-full"></div>
                                </div>
                                <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                              </td>
                              <td className="border-t border-b border-gray-400 p-2 text-right text-black font-bold text-xl select-none">-</td>
                              <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="border-l-4 border-gray-400 h-full"></div>
                                </div>
                                <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                              </td>
                              <td className="border-t border-b border-gray-400 p-2 text-left text-black font-bold text-xl select-none">+</td>
                              <td className="border-t border-b border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-green-700 text-lg mt-1">Positif à l'extérieur des racines</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-800 mb-2">Si a &lt; 0 :</div>
                      <div className="bg-white p-2 rounded border">
                        <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">x₁</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">x₂</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                              <td className="border-y border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                              <td className="border-y border-gray-400 p-2 text-right text-black font-bold text-xl select-none">-</td>
                              <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="border-l-4 border-gray-400 h-full"></div>
                                </div>
                                <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                              </td>
                              <td className="border-y border-gray-400 p-2 text-right text-black font-bold text-xl select-none">+</td>
                              <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="border-l-4 border-gray-400 h-full"></div>
                                </div>
                                <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                              </td>
                              <td className="border-y border-gray-400 p-2 text-left text-black font-bold text-xl select-none">-</td>
                              <td className="border-t border-b border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-red-700 text-lg mt-1">Positif entre les racines</div>
                    </div>
                  </div>
                </div>

                {/* Cas Δ = 0 */}
                <div className="bg-white p-5 rounded-xl border-2 border-yellow-300">
                  <h4 className="text-xl font-bold text-yellow-800 mb-4 text-center">
                    📊 Cas 2 : Δ = 0 (Racine double)
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-2">Si a &gt; 0 :</div>
                      <div className="bg-white p-2 rounded border">
                        <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">x₀</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                              <td className="border-y border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                              <td className="border-y border-gray-400 p-2 text-right text-black font-bold text-xl select-none">+</td>
                              <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="border-l-4 border-gray-400 h-full"></div>
                                </div>
                                <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                              </td>
                              <td className="border-y border-gray-400 p-2 text-left text-black font-bold text-xl select-none">+</td>
                              <td className="border-y border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-green-700 text-lg mt-1">Toujours positif sauf en x₀</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-800 mb-2">Si a &lt; 0 :</div>
                      <div className="bg-white p-2 rounded border">
                        <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">x₀</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                              <td className="border-y border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                              <td className="border-y border-gray-400 p-2 text-right text-black font-bold text-xl select-none">-</td>
                              <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="border-l-4 border-gray-400 h-full"></div>
                                </div>
                                <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                              </td>
                              <td className="border-y border-gray-400 p-2 text-left text-black font-bold text-xl select-none">-</td>
                              <td className="border-y border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-red-700 text-lg mt-1">Toujours négatif sauf en x₀</div>
                    </div>
                  </div>
                </div>

                {/* Cas Δ < 0 */}
                <div className="bg-white p-5 rounded-xl border-2 border-blue-300">
                  <h4 className="text-xl font-bold text-blue-800 mb-4 text-center">
                    📊 Cas 3 : Δ &lt; 0 (Aucune racine)
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-2">Si a &gt; 0 :</div>
                      <div className="bg-white p-2 rounded border">
                        <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                              <td className="border-y border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                              <td className="border-y border-gray-400 p-2 text-center text-black font-bold text-xl select-none">+</td>
                              <td className="border-y border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-green-700 text-lg mt-1">Toujours positif sur ℝ</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-800 mb-2">Si a &lt; 0 :</div>
                      <div className="bg-white p-2 rounded border">
                        <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                              <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                              <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                              <td className="border-t border-b border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                              <td className="border-t border-b border-gray-400 p-2 text-center text-black font-bold text-xl select-none">-</td>
                              <td className="border-t border-b border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-red-700 text-lg mt-1">Toujours négatif sur ℝ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples avec mini tableaux */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border-2 border-orange-300">
              <h3 className="text-lg font-bold text-center text-gray-800 mb-6">
                🎯 Exemples avec tableaux de signe
              </h3>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Exemple 1: Δ > 0 */}
                <div className="bg-white p-3 rounded-xl border-2 border-green-300">
                  <div className="font-mono text-xs font-bold text-center text-green-800 mb-2">x² - 4 = 0</div>
                  <div className="text-xs space-y-0.5 mb-2 text-gray-800">
                    <div><strong>a = 1 &gt; 0</strong></div>
                    <div><strong>Δ = 16 &gt; 0</strong></div>
                    <div>Racines : x₁ = -2, x₂ = 2</div>
                  </div>
                  
                  {/* Mini tableau de signe */}
                  <div className="bg-gray-50 p-1 rounded">
                    <div className="text-center font-bold text-gray-800 mb-0.5 text-xs">Tableau de signe :</div>
                    <table className="w-full border border-gray-300 select-none tableau-signe text-xs">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">x</th>
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">-∞</th>
                          <th className="border border-gray-300 px-0.5 py-0.5 text-xs">&nbsp;</th>
                          <th className="border border-gray-300 px-1 py-0.5 bg-blue-100 text-black font-bold text-xs">-2</th>
                          <th className="border border-gray-300 px-0.5 py-0.5 text-xs">&nbsp;</th>
                          <th className="border border-gray-300 px-1 py-0.5 bg-blue-100 text-black font-bold text-xs">2</th>
                          <th className="border border-gray-300 px-0.5 py-0.5 text-xs">&nbsp;</th>
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">+∞</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-1 py-0.5 text-center font-bold bg-gray-100 text-black text-xs">f(x)</td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black">&nbsp;</td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black font-bold text-sm">+</td>
                          <td className="border border-gray-300 px-0.5 py-0.5 text-center font-bold text-xs relative">
                            <span className="text-black">0</span>
                          </td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black font-bold text-sm">-</td>
                          <td className="border border-gray-300 px-0.5 py-0.5 text-center font-bold text-xs relative">
                            <span className="text-black">0</span>
                          </td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black font-bold text-sm">+</td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Exemple 2: Δ = 0 */}
                <div className="bg-white p-3 rounded-xl border-2 border-yellow-300">
                  <div className="font-mono text-xs font-bold text-center text-yellow-800 mb-2">x² - 2x + 1 = 0</div>
                  <div className="text-xs space-y-0.5 mb-2 text-gray-800">
                    <div><strong>a = 1 &gt; 0</strong></div>
                    <div><strong>Δ = 0</strong></div>
                    <div>Racine double : x₀ = 1</div>
                  </div>
                  
                  {/* Mini tableau de signe */}
                  <div className="bg-gray-50 p-1 rounded">
                    <div className="text-center font-bold text-gray-800 mb-0.5 text-xs">Tableau de signe :</div>
                    <table className="w-full border border-gray-300 select-none tableau-signe text-xs">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">x</th>
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">-∞</th>
                          <th className="border border-gray-300 px-0.5 py-0.5 text-xs">&nbsp;</th>
                          <th className="border border-gray-300 px-1 py-0.5 bg-blue-100 text-black font-bold text-xs">1</th>
                          <th className="border border-gray-300 px-0.5 py-0.5 text-xs">&nbsp;</th>
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">+∞</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-1 py-0.5 text-center font-bold bg-gray-100 text-black text-xs">f(x)</td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black">&nbsp;</td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black font-bold text-sm">+</td>
                          <td className="border border-gray-300 px-0.5 py-0.5 text-center font-bold text-xs relative">
                            <span className="text-black">0</span>
                          </td>
                          <td className="border-t border-b border-gray-300 px-0.5 py-0.5 text-center text-black font-bold text-sm">+</td>
                          <td className="border border-gray-300 px-0.5 py-0.5 text-center text-black">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Exemple 3: Δ < 0 */}
                <div className="bg-white p-3 rounded-xl border-2 border-red-300">
                  <div className="font-mono text-xs font-bold text-center text-red-800 mb-2">-x² + x - 1 = 0</div>
                  <div className="text-xs space-y-0.5 mb-2 text-gray-800">
                    <div><strong>a = -1 &lt; 0</strong></div>
                    <div><strong>Δ = -3 &lt; 0</strong></div>
                    <div>Pas de racines réelles</div>
                  </div>
                  
                  {/* Mini tableau de signe */}
                  <div className="bg-gray-50 p-1 rounded">
                    <div className="text-center font-bold text-gray-800 mb-0.5 text-xs">Tableau de signe :</div>
                    <table className="w-full border border-gray-300 select-none tableau-signe text-xs">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">x</th>
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">-∞</th>
                          <th className="border border-gray-300 px-0.5 py-0.5 text-xs">&nbsp;</th>
                          <th className="border border-gray-300 px-1 py-0.5 text-black font-bold text-xs">+∞</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                          <td className="border-t border-b border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                          <td className="border-t border-b border-gray-400 p-2 text-center text-black font-bold text-xl select-none">+</td>
                          <td className="border-y border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Règle mnémotechnique */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-300">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                🧠 Règle mnémotechnique
              </h3>
              
              <div className="text-center space-y-3">
                <div className="bg-white p-4 rounded-xl border-2 border-purple-300">
                  <div className="text-lg font-bold text-purple-800 mb-2">
                    Le signe "aux extrémités" = signe de a
                  </div>
                  <div className="text-gray-700">
                    Quand x → ±∞, f(x) a le même signe que le coefficient a
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="font-bold text-green-800">a &gt; 0 → Parabole ⌣</div>
                    <div className="text-lg text-green-700">Positive aux extrémités</div>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <div className="font-bold text-red-800">a &lt; 0 → Parabole ⌒</div>
                    <div className="text-lg text-red-700">Négative aux extrémités</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('introduction-tableaux', 30)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('introduction-tableaux')
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {completedSections.includes('introduction-tableaux') ? '✓ Principe compris ! +30 XP' : 'J\'ai compris le principe ! +30 XP'}
            </button>
          </div>
        </section>

        {/* Section exercices */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Exercices</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Série d'Exercices 🎯
            </h2>
            <p className="text-xl text-gray-600">De l'initiation aux inéquations complexes</p>
          </div>

          <div className="space-y-8">
            {/* Exercices simples */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300">
              <h3 className="text-lg font-bold text-center text-gray-800 mb-6">
                🟢 Niveau 1 : Exercices d'initiation
              </h3>
              
              {/* Exercice 1 */}
              <div className="bg-white p-5 rounded-xl border-2 border-green-300 mb-6">
                <h4 className="text-xl font-bold text-green-800 mb-4">Exercice 1 : Résoudre x² - 3x + 2 ≤ 0</h4>
                
                <div className="text-center mb-4">
                  <button
                    onClick={() => setShowExercice1(!showExercice1)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    {showExercice1 ? 'Cacher la solution' : 'Voir la solution'}
                  </button>
                </div>

                {showExercice1 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-bold text-blue-800 mb-2">📝 Solution détaillée :</div>
                    
                    <div className="space-y-3 text-gray-800">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                        <div>
                          <div className="font-bold">Calcul du discriminant</div>
                          <div>Δ = b² - 4ac = (-3)² - 4×1×2 = 9 - 8 = 1 &gt; 0</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                        <div>
                          <div className="font-bold">Calcul des racines</div>
                          <div>x₁ = (3 - √1)/2 = 1 et x₂ = (3 + √1)/2 = 2</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                        <div>
                          <div className="font-bold">Tableau de signe (a = 1 &gt; 0)</div>
                          <div className="mt-2">
                            <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                                  <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">1</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                                  <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">2</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                                  <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                                  <td className="border-t border-b border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-t border-b border-gray-400 p-2 text-right text-black font-bold text-xl select-none">+</td>
                                  <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="border-l-4 border-gray-400 h-full"></div>
                                    </div>
                                    <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                                  </td>
                                  <td className="border-t border-b border-gray-400 p-2 text-right text-black font-bold text-xl select-none">-</td>
                                  <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="border-l-4 border-gray-400 h-full"></div>
                                    </div>
                                    <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                                  </td>
                                  <td className="border-t border-b border-gray-400 p-2 text-left text-black font-bold text-xl select-none">+</td>
                                  <td className="border-t border-b border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">4</div>
                        <div>
                          <div className="font-bold">Solution de l'inéquation f(x) ≤ 0</div>
                          <div className="text-green-700 font-bold">S = [1; 2]</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* Exercice 2 */}
              <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                <h4 className="text-xl font-bold text-green-800 mb-4">Exercice 2 : Résoudre -2x² + 5x - 2 &gt; 0</h4>
                
                <div className="text-center mb-4">
                  <button
                    onClick={() => setShowExercice2(!showExercice2)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    {showExercice2 ? 'Cacher la solution' : 'Voir la solution'}
                  </button>
                </div>

                {showExercice2 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-bold text-blue-800 mb-2">📝 Solution détaillée :</div>
                    
                    <div className="space-y-3 text-gray-800">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                        <div>
                          <div className="font-bold">Calcul du discriminant</div>
                          <div>Δ = b² - 4ac = 5² - 4×(-2)×(-2) = 25 - 16 = 9 &gt; 0</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                        <div>
                          <div className="font-bold">Calcul des racines</div>
                          <div>x₁ = (-5 - 3)/(-4) = 1/2 et x₂ = (-5 + 3)/(-4) = 2</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                        <div>
                          <div className="font-bold">Tableau de signe (a = -2 &lt; 0)</div>
                          <div className="mt-2">
                            <table className="w-full border border-gray-300 text-sm select-none tableau-signe">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="border-l border-r border-y border-gray-400 p-2 text-black select-none font-bold">x</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none font-bold">-∞</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                                  <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">1/2</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                                  <th className="border-y border-gray-400 p-4 bg-blue-100 text-black select-none font-bold">2</th>
                                  <th className="border-y border-gray-400 p-2 text-black select-none">&nbsp;</th>
                                  <th className="border-y border-r border-gray-400 p-2 text-black select-none font-bold">+∞</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border-l border-r border-y border-gray-400 p-2 text-center font-bold bg-gray-100 text-black select-none">f(x)</td>
                                  <td className="border-t border-b border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-t border-b border-gray-400 p-2 text-right text-black font-bold text-xl select-none">-</td>
                                  <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="border-l-4 border-gray-400 h-full"></div>
                                    </div>
                                    <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                                  </td>
                                  <td className="border-t border-b border-gray-400 p-2 text-right text-black font-bold text-xl select-none">+</td>
                                  <td className="border-y border-gray-400 p-2 text-center font-bold text-xl relative select-none">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="border-l-4 border-gray-400 h-full"></div>
                                    </div>
                                    <span className="relative z-10 bg-white px-1 text-black select-none">0</span>
                                  </td>
                                  <td className="border-t border-b border-gray-400 p-2 text-left text-black font-bold text-xl select-none">-</td>
                                  <td className="border-t border-b border-r border-gray-400 p-2 text-center text-black select-none">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">5</div>
                        <div>
                          <div className="font-bold">Solution de l'inéquation f(x) &gt; 0</div>
                          <div className="text-green-700 font-bold">S = ]1/2; 2[</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Exercices complexes */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border-2 border-red-300">
              <h3 className="text-lg font-bold text-center text-gray-800 mb-6">
                🔴 Niveau 2 : Exercices avancés avec fractions
              </h3>
              
              {/* Exercice 3 */}
              <div className="bg-white p-5 rounded-xl border-2 border-red-300 mb-6">
                <h4 className="text-xl font-bold text-red-800 mb-4">
                  Exercice 3 : Résoudre <MathDisplay>{"\\frac{2x}{x+1} < \\frac{3}{(x+1)(x-2)}"}</MathDisplay>
                </h4>
                
                <div className="text-center mb-4">
                  <button
                    onClick={() => setShowExercice3(!showExercice3)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    {showExercice3 ? 'Cacher la solution' : 'Voir la solution'}
                  </button>
                </div>

                {showExercice3 && (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="font-bold text-orange-800 mb-2">📝 Solution détaillée :</div>
                    
                    <div className="space-y-4 text-gray-800">
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                        <div>
                          <div className="font-bold">Domaine de définition</div>
                          <div><MathDisplay>x \neq -1</MathDisplay> et <MathDisplay>x \neq 2</MathDisplay></div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                        <div>
                          <div className="font-bold">Réduction au même dénominateur</div>
                          <div className="space-y-2">
                            <div><MathDisplay>{"\\frac{2x}{x+1} - \\frac{3}{(x+1)(x-2)} < 0"}</MathDisplay></div>
                            <div><MathDisplay>{"\\frac{2x(x-2) - 3}{(x+1)(x-2)} < 0"}</MathDisplay></div>
                            <div><MathDisplay>{"\\frac{2x^2 - 4x - 3}{(x+1)(x-2)} < 0"}</MathDisplay></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                        <div>
                          <div className="font-bold">Étude du numérateur : <MathDisplay>{"2x^2 - 4x - 3"}</MathDisplay></div>
                          <div className="space-y-1">
                            <div><MathDisplay>{"\\Delta = 4 + 24 = 28"}</MathDisplay></div>
                            <div><MathDisplay>{"x_1 = \\frac{4 - 2\\sqrt{7}}{4} = \\frac{2 - \\sqrt{7}}{2} \\approx -0,55"}</MathDisplay></div>
                            <div><MathDisplay>{"x_2 = \\frac{4 + 2\\sqrt{7}}{4} = \\frac{2 + \\sqrt{7}}{2} \\approx 3,55"}</MathDisplay></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">4</div>
                        <div>
                          <div className="font-bold">Tableau de signe complet</div>
                          <div className="mt-2 overflow-x-auto">
                            <table className="w-full border border-gray-300 text-xs select-none tableau-signe">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="border-l border-r border-y border-gray-300 p-1 text-black select-none font-bold text-sm">x</th>
                                  <th className="border-y border-gray-300 p-1 text-black select-none text-xs">-∞</th>
                                  <th className="border-y border-gray-300 p-1 text-black select-none text-xs">&nbsp;</th>
                                  <th className="border-y border-gray-300 p-1 bg-blue-100 text-black select-none font-bold text-xs">-1</th>
                                  <th className="border-y border-gray-300 p-1 text-black select-none text-xs">&nbsp;</th>
                                  <th className="border-y border-gray-300 p-1 bg-yellow-100 text-black select-none font-bold text-xs">(2-√7)/2</th>
                                  <th className="border-y border-gray-300 p-1 text-black select-none text-xs">&nbsp;</th>
                                  <th className="border-y border-gray-300 p-1 bg-blue-100 text-black select-none font-bold text-xs">2</th>
                                  <th className="border-y border-gray-300 p-1 text-black select-none text-xs">&nbsp;</th>
                                  <th className="border-y border-gray-300 p-1 bg-yellow-100 text-black select-none font-bold text-xs">(2+√7)/2</th>
                                  <th className="border-y border-gray-300 p-1 text-black select-none text-xs">&nbsp;</th>
                                  <th className="border-y border-r border-gray-300 p-1 text-black select-none text-xs">+∞</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border-l border-r border-y border-gray-300 p-1 text-center font-bold bg-gray-100 text-black select-none text-xs">2x²-4x-3</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-red-600 text-sm">-</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black font-bold select-none text-xs">0</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-red-600 text-sm">-</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black font-bold select-none text-xs">0</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-r border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td className="border-l border-r border-y border-gray-300 p-1 text-center font-bold bg-gray-100 text-black select-none text-xs">x+1</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-red-600 text-sm">-</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-blue-600 text-sm select-none">⊘</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-r border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td className="border-l border-r border-y border-gray-300 p-1 text-center font-bold bg-gray-100 text-black select-none text-xs">x-2</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-red-600 text-sm">-</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-red-600 text-sm">-</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-red-600 text-sm">-</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-blue-600 text-sm select-none">⊘</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-r border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                </tr>
                                <tr className="bg-yellow-50">
                                  <td className="border-l border-r border-y border-gray-300 p-1 text-center font-bold bg-gray-100 text-black select-none text-xs">f(x)</td>
                                  <td className="border-t border-b border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                  <td className="border-t border-b border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-blue-600 text-sm select-none">⊘</td>
                                  <td className="border-t border-b border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black font-bold select-none text-xs">0</td>
                                  <td className="border-t border-b border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center font-bold text-blue-600 text-sm select-none">⊘</td>
                                  <td className="border-t border-b border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-y border-gray-300 p-1 text-center text-black font-bold select-none text-xs">0</td>
                                  <td className="border-t border-b border-gray-300 p-1 text-center font-bold text-green-600 text-sm">+</td>
                                  <td className="border-t border-b border-r border-gray-300 p-1 text-center text-black select-none">&nbsp;</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">5</div>
                        <div>
                          <div className="font-bold">Solution de l'inéquation <MathDisplay>{"< 0"}</MathDisplay></div>
                          <div className="text-green-700 font-bold">
                            <MathDisplay>{"S = \\emptyset"}</MathDisplay>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* Exercices 4, 5, 6 de difficulté similaire */}
              <div className="grid md:grid-cols-1 gap-6">
                <div className="bg-white p-5 rounded-xl border-2 border-red-300">
                  <h4 className="text-xl font-bold text-red-800 mb-4">
                    Exercice 4 : Résoudre <MathDisplay>{"\\frac{x}{(x-2)^2} \\geq 1 + \\frac{3}{x-2}"}</MathDisplay>
                  </h4>
                  
                  <div className="text-center mb-4">
                    <button
                      onClick={() => setShowExercice4(!showExercice4)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      {showExercice4 ? 'Cacher la solution' : 'Voir la solution'}
                    </button>
                  </div>

                  {showExercice4 && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="font-bold text-orange-800 mb-2">📝 Solution détaillée :</div>
                      
                      <div className="space-y-4 text-gray-800">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                          <div>
                            <div className="font-bold">Domaine de définition</div>
                            <div><MathDisplay>{"x \\neq 2"}</MathDisplay></div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                          <div>
                            <div className="font-bold">Réduction au même dénominateur</div>
                            <div className="space-y-2">
                              <div><MathDisplay>{"\\frac{x}{(x-2)^2} - 1 - \\frac{3}{x-2} \\geq 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{x - (x-2)^2 - 3(x-2)}{(x-2)^2} \\geq 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{x - (x^2-4x+4) - 3x + 6}{(x-2)^2} \\geq 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{x - x^2 + 4x - 4 - 3x + 6}{(x-2)^2} \\geq 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{-x^2 + 2x + 2}{(x-2)^2} \\geq 0"}</MathDisplay></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                          <div>
                            <div className="font-bold">Étude du numérateur : <MathDisplay>{"-x^2 + 2x + 2"}</MathDisplay></div>
                            <div className="space-y-1">
                              <div><MathDisplay>{"\\Delta = 4 + 8 = 12"}</MathDisplay></div>
                              <div><MathDisplay>{"x_1 = \\frac{-2 - 2\\sqrt{3}}{-2} = 1 + \\sqrt{3} \\approx 2,73"}</MathDisplay></div>
                              <div><MathDisplay>{"x_2 = \\frac{-2 + 2\\sqrt{3}}{-2} = 1 - \\sqrt{3} \\approx -0,73"}</MathDisplay></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">4</div>
                          <div>
                            <div className="font-bold">Tableau de signe complet</div>
                            <div className="mt-2">
                              <div className="bg-white p-4 rounded-lg border border-gray-300">
                                <table className="w-full text-lg">
                                  <thead>
                                    <tr>
                                      <td className="border-b-2 border-gray-400 p-4 font-bold text-center bg-gray-100">x</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">-∞</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">&nbsp;</td>
                                      <td className="border-b-2 border-gray-400 p-2 text-center font-bold bg-blue-100">-2</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">&nbsp;</td>
                                      <td className="border-b-2 border-gray-400 p-2 text-center font-bold bg-yellow-100">1</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">&nbsp;</td>
                                      <td className="border-b-2 border-gray-400 p-2 text-center font-bold bg-blue-100">2</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">+∞</td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border-b border-gray-300 p-2 font-bold text-center bg-gray-100">x-1</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center font-bold">0</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                    </tr>
                                    <tr>
                                      <td className="border-b border-gray-300 p-2 font-bold text-center bg-gray-100">(x-2)(x+2)</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                      <td className="border-b border-gray-300 p-2 text-center font-bold text-blue-600 text-lg select-none">⊘</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center font-bold text-blue-600 text-lg select-none">⊘</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                    </tr>
                                    <tr className="bg-yellow-50">
                                      <td className="p-2 font-bold text-center bg-gray-100">f(x)</td>
                                      <td className="p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="p-2 text-center font-bold text-red-600 text-lg">-</td>
                                      <td className="p-2 text-center font-bold text-blue-600 text-lg">⊘</td>
                                      <td className="p-2 text-center font-bold text-green-600 text-lg">+</td>
                                      <td className="p-2 text-center font-bold text-black text-lg">0</td>
                                      <td className="p-2 text-center font-bold text-red-600 text-lg">-</td>
                                      <td className="p-2 text-center font-bold text-blue-600 text-lg">⊘</td>
                                      <td className="p-2 text-center font-bold text-green-600 text-lg">+</td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <div className="mt-3 text-xs text-gray-600">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <span className="w-3 h-3 bg-yellow-100 border border-gray-400"></span>
                                      <span>Racines (f(x) = 0)</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <span className="w-3 h-3 bg-blue-100 border border-gray-400"></span>
                                      <span>Valeurs interdites (⊘)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">5</div>
                          <div>
                            <div className="font-bold">Solution de l'inéquation <MathDisplay>{"\\geq 0"}</MathDisplay></div>
                            <div className="text-green-700 font-bold">
                              <MathDisplay>{"S = [1-\\sqrt{3}; 2[ \\cup ]2; 1+\\sqrt{3}]"}</MathDisplay>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
                
                <div className="bg-white p-5 rounded-xl border-2 border-red-300">
                  <h4 className="text-xl font-bold text-red-800 mb-4">
                    Exercice 5 : Résoudre <MathDisplay>{"\\frac{1}{x-1} > \\frac{2}{x+3}"}</MathDisplay>
                  </h4>
                  
                  <div className="text-center mb-4">
                    <button
                      onClick={() => setShowExercice5(!showExercice5)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      {showExercice5 ? 'Cacher la solution' : 'Voir la solution'}
                    </button>
                  </div>

                  {showExercice5 && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="font-bold text-orange-800 mb-2">📝 Solution détaillée :</div>
                      
                      <div className="space-y-4 text-gray-800">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                          <div>
                            <div className="font-bold">Domaine de définition</div>
                            <div><MathDisplay>{"x \\neq 1"}</MathDisplay> et <MathDisplay>{"x \\neq -3"}</MathDisplay></div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                          <div>
                            <div className="font-bold">Réduction au même dénominateur</div>
                            <div className="space-y-2">
                              <div><MathDisplay>{"\\frac{1}{x-1} - \\frac{2}{x+3} > 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{(x+3) - 2(x-1)}{(x-1)(x+3)} > 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{x + 3 - 2x + 2}{(x-1)(x+3)} > 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{-x + 5}{(x-1)(x+3)} > 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{x - 5}{(x-1)(x+3)} < 0"}</MathDisplay></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                          <div>
                            <div className="font-bold">Racines et valeurs interdites</div>
                            <div className="space-y-1">
                              <div>Numérateur : <MathDisplay>{"x - 5 = 0 \\Rightarrow x = 5"}</MathDisplay></div>
                              <div>Dénominateur : <MathDisplay>{"x = 1"}</MathDisplay> et <MathDisplay>{"x = -3"}</MathDisplay></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">4</div>
                          <div>
                            <div className="font-bold">Tableau de signe complet</div>
                            <div className="mt-2">
                              <table className="w-full border border-gray-300 text-base select-none tableau-signe">
                                <thead>
                                  <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-3 text-black font-bold">x</th>
                                    <th className="border border-gray-300 p-2 text-black font-bold text-sm">-∞</th>
                                    <th className="border border-gray-300 p-1 text-black text-xs">&nbsp;</th>
                                    <th className="border border-gray-300 p-2 text-black font-bold text-sm bg-blue-100">-3</th>
                                    <th className="border border-gray-300 p-1 text-black text-xs">&nbsp;</th>
                                    <th className="border border-gray-300 p-2 text-black font-bold text-sm bg-yellow-100">1</th>
                                    <th className="border border-gray-300 p-1 text-black text-xs">&nbsp;</th>
                                    <th className="border border-gray-300 p-2 text-black font-bold text-sm bg-yellow-100">5</th>
                                    <th className="border border-gray-300 p-1 text-black text-xs">&nbsp;</th>
                                    <th className="border border-gray-300 p-2 text-black font-bold text-sm">+∞</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="border border-gray-300 p-3 font-bold text-center bg-gray-100">x-5</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                    <td className="border border-gray-300 p-1 text-center text-red-600 font-bold text-lg">-</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                    <td className="border border-gray-300 p-1 text-center text-red-600 font-bold text-lg">-</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                    <td className="border border-gray-300 p-1 text-center text-red-600 font-bold text-lg">-</td>
                                    <td className="border border-gray-300 p-2 text-center text-black font-bold text-lg">0</td>
                                    <td className="border border-gray-300 p-1 text-center text-green-600 font-bold text-lg">+</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td className="border border-gray-300 p-3 font-bold text-center bg-gray-100">(x-1)(x+3)</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                    <td className="border border-gray-300 p-1 text-center text-green-600 font-bold text-lg">+</td>
                                    <td className="border border-gray-300 p-2 text-center text-blue-600 font-bold text-lg select-none">⊘</td>
                                    <td className="border border-gray-300 p-1 text-center text-red-600 font-bold text-lg">-</td>
                                    <td className="border border-gray-300 p-2 text-center text-blue-600 font-bold text-lg">⊘</td>
                                    <td className="border border-gray-300 p-1 text-center text-green-600 font-bold text-lg">+</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                    <td className="border border-gray-300 p-1 text-center text-green-600 font-bold text-lg">+</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                  </tr>
                                  <tr className="bg-yellow-50">
                                    <td className="border border-gray-300 p-3 font-bold text-center bg-gray-100">Quotient</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                    <td className="border border-gray-300 p-1 text-center text-red-600 font-bold text-lg">-</td>
                                    <td className="border border-gray-300 p-2 text-center text-blue-600 font-bold text-lg">⊘</td>
                                    <td className="border border-gray-300 p-1 text-center text-green-600 font-bold text-lg">+</td>
                                    <td className="border border-gray-300 p-2 text-center text-blue-600 font-bold text-lg">⊘</td>
                                    <td className="border border-gray-300 p-1 text-center text-red-600 font-bold text-lg">-</td>
                                    <td className="border border-gray-300 p-2 text-center text-black font-bold text-lg">0</td>
                                    <td className="border border-gray-300 p-1 text-center text-green-600 font-bold text-lg">+</td>
                                    <td className="border border-gray-300 p-2 text-center text-black">&nbsp;</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">5</div>
                          <div>
                            <div className="font-bold">Solution de l'inéquation <MathDisplay>{"< 0"}</MathDisplay></div>
                            <div className="text-green-700 font-bold">
                              <MathDisplay>{"S = ]-\\infty; -3[ \\cup ]1; 5]"}</MathDisplay>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
                
                <div className="bg-white p-5 rounded-xl border-2 border-red-300">
                  <h4 className="text-xl font-bold text-red-800 mb-4">
                    Exercice 6 : Résoudre <MathDisplay>{"\\frac{2x+1}{x^2-4} \\geq \\frac{1}{x-2}"}</MathDisplay>
                  </h4>
                  
                  <div className="text-center mb-4">
                    <button
                      onClick={() => setShowExercice6(!showExercice6)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      {showExercice6 ? 'Cacher la solution' : 'Voir la solution'}
                    </button>
                  </div>

                  {showExercice6 && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="font-bold text-orange-800 mb-2">📝 Solution détaillée :</div>
                      
                      <div className="space-y-4 text-gray-800">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                          <div>
                            <div className="font-bold">Domaine de définition</div>
                            <div><MathDisplay>{"x^2 - 4 \\neq 0"}</MathDisplay> donc <MathDisplay>{"x \\neq 2"}</MathDisplay> et <MathDisplay>{"x \\neq -2"}</MathDisplay></div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                          <div>
                            <div className="font-bold">Factorisation et réduction</div>
                            <div className="space-y-2">
                              <div><MathDisplay>{"x^2 - 4 = (x-2)(x+2)"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{2x+1}{(x-2)(x+2)} \\geq \\frac{1}{x-2}"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{2x+1}{(x-2)(x+2)} - \\frac{1}{x-2} \\geq 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{2x+1 - (x+2)}{(x-2)(x+2)} \\geq 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{2x+1-x-2}{(x-2)(x+2)} \\geq 0"}</MathDisplay></div>
                              <div><MathDisplay>{"\\frac{x-1}{(x-2)(x+2)} \\geq 0"}</MathDisplay></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                          <div>
                            <div className="font-bold">Racines et valeurs interdites</div>
                            <div className="space-y-1">
                              <div>Numérateur : <MathDisplay>{"x - 1 = 0 \\Rightarrow x = 1"}</MathDisplay></div>
                              <div>Dénominateur : <MathDisplay>{"x = 2"}</MathDisplay> et <MathDisplay>{"x = -2"}</MathDisplay></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">4</div>
                          <div>
                            <div className="font-bold">Tableau de signe complet</div>
                            <div className="mt-2">
                              <div className="bg-white p-4 rounded-lg border border-gray-300">
                                <table className="w-full text-lg">
                                  <thead>
                                    <tr>
                                      <td className="border-b-2 border-gray-400 p-4 font-bold text-center bg-gray-100">x</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">-∞</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">&nbsp;</td>
                                      <td className="border-b-2 border-gray-400 p-2 text-center font-bold bg-blue-100">-2</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">&nbsp;</td>
                                      <td className="border-b-2 border-gray-400 p-2 text-center font-bold bg-yellow-100">1</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">&nbsp;</td>
                                      <td className="border-b-2 border-gray-400 p-2 text-center font-bold bg-blue-100">2</td>
                                      <td className="border-b-2 border-gray-400 p-3 text-center text-xs">+∞</td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="border-b border-gray-300 p-2 font-bold text-center bg-gray-100">x-1</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center font-bold">0</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                    </tr>
                                    <tr>
                                      <td className="border-b border-gray-300 p-2 font-bold text-center bg-gray-100">(x-2)(x+2)</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                      <td className="border-b border-gray-300 p-2 text-center font-bold text-blue-600 text-lg select-none">⊘</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-red-600 font-bold text-lg">-</td>
                                      <td className="border-b border-gray-300 p-2 text-center font-bold text-blue-600 text-lg select-none">⊘</td>
                                      <td className="border-b border-gray-300 p-2 text-center text-green-600 font-bold text-lg">+</td>
                                    </tr>
                                    <tr className="bg-yellow-50">
                                      <td className="p-2 font-bold text-center bg-gray-100">f(x)</td>
                                      <td className="p-2 text-center text-black select-none">&nbsp;</td>
                                      <td className="p-2 text-center font-bold text-red-600 text-lg">-</td>
                                      <td className="p-2 text-center font-bold text-blue-600 text-lg">⊘</td>
                                      <td className="p-2 text-center font-bold text-green-600 text-lg">+</td>
                                      <td className="p-2 text-center font-bold text-black text-lg">0</td>
                                      <td className="p-2 text-center font-bold text-red-600 text-lg">-</td>
                                      <td className="p-2 text-center font-bold text-blue-600 text-lg">⊘</td>
                                      <td className="p-2 text-center font-bold text-green-600 text-lg">+</td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <div className="mt-3 text-xs text-gray-600">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                      <span className="w-3 h-3 bg-yellow-100 border border-gray-400"></span>
                                      <span>Racines (f(x) = 0)</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <span className="w-3 h-3 bg-blue-100 border border-gray-400"></span>
                                      <span>Valeurs interdites (⊘)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">5</div>
                          <div>
                            <div className="font-bold">Solution de l'inéquation <MathDisplay>{"\\geq 0"}</MathDisplay></div>
                            <div className="text-green-700 font-bold">
                              <MathDisplay>{"S = ]-2; 1] \\cup ]2; +\\infty["}</MathDisplay>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <div className="text-lg text-gray-700 mb-4">
                🚀 Les exercices avancés avec fractions rationnelles seront ajoutés prochainement !
              </div>
              <div className="text-lg text-gray-500">
                Maîtrisez d'abord ces bases avant de passer aux inéquations complexes.
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('exercices-tableaux', 50)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('exercices-tableaux')
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections.includes('exercices-tableaux') ? '✓ Exercices terminés ! +50 XP' : 'J\'ai travaillé les exercices ! +50 XP'}
            </button>
          </div>
        </section>

        {/* Section 2: Calculateur et visualisation */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Eye className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Visualisation</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Résolveur d'Inéquations Interactif 🎮
            </h2>
            <p className="text-xl text-gray-600">Visualisez graphiquement la résolution d'inéquations</p>
          </div>

          <div className="space-y-6">
            {/* Interface de saisie */}
            <div className="bg-gradient-to-r from-gray-100 to-blue-100 p-6 rounded-2xl border-2 border-blue-300">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                🎯 Configurez votre inéquation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coefficients */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">Coefficients de f(x) = ax² + bx + c :</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <label className="block text-lg font-bold text-gray-700 mb-2">a =</label>
                      <input
                        type="number"
                        step="any"
                        value={inequationParams.a}
                        onChange={(e) => setInequationParams(prev => ({ ...prev, a: parseFloat(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-lg font-bold text-gray-700 mb-2">b =</label>
                      <input
                        type="number"
                        step="any"
                        value={inequationParams.b}
                        onChange={(e) => setInequationParams(prev => ({ ...prev, b: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-lg font-bold text-gray-700 mb-2">c =</label>
                      <input
                        type="number"
                        step="any"
                        value={inequationParams.c}
                        onChange={(e) => setInequationParams(prev => ({ ...prev, c: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Type d'inéquation */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">Type d'inéquation :</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(['>', '<', '>=', '<='] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setInequationType(type)}
                        className={`px-4 py-3 rounded-lg font-mono text-lg font-bold transition-colors ${
                          inequationType === type
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        f(x) {type} 0
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <div className="inline-block bg-white px-6 py-3 rounded-xl border-2 border-gray-300 shadow-sm">
                  <div className="text-lg font-mono font-bold text-blue-600">
                    {inequationParams.a}x² {inequationParams.b >= 0 ? '+' : ''}{inequationParams.b}x {inequationParams.c >= 0 ? '+' : ''}{inequationParams.c} {inequationType} 0
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique avec solution */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
              <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                📈 Représentation graphique
              </h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Graphique SVG */}
                <div>
                  <svg viewBox="0 0 300 300" className="w-full h-64 bg-gray-50 rounded-lg border">
                    {/* Grille */}
                    <defs>
                      <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse">
                        <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="300" height="300" fill="url(#grid)" />
                    
                    {/* Axes */}
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#374151" strokeWidth="2" />
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#374151" strokeWidth="2" />
                    
                    {/* Graduations */}
                    {[-6, -3, 0, 3, 6].map(x => (
                      <g key={x}>
                        <line 
                          x1={(x + 8) * 15} 
                          y1="145" 
                          x2={(x + 8) * 15} 
                          y2="155" 
                          stroke="#374151" 
                          strokeWidth="1"
                        />
                        <text 
                          x={(x + 8) * 15} 
                          y="170" 
                          textAnchor="middle" 
                          fontSize="10" 
                          fill="#374151"
                        >
                          {x}
                        </text>
                      </g>
                    ))}
                    
                    {/* Parabole */}
                    <polyline
                      points={generateParabolaPoints()}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Racines */}
                    {(() => {
                      const { solutions } = calculateInequationSolution();
                      return solutions.map((sol, index) => {
                        if (sol >= -8 && sol <= 8) {
                          return (
                            <circle
                              key={index}
                              cx={(sol + 8) * 15}
                              cy="150"
                              r="5"
                              fill="#ef4444"
                              stroke="white"
                              strokeWidth="2"
                            />
                          );
                        }
                        return null;
                      });
                    })()}
                    
                    {/* Zone de solution colorée */}
                    {(() => {
                      const { solutions, delta } = calculateInequationSolution();
                      const { a } = inequationParams;
                      
                      if (delta > 0 && solutions.length === 2) {
                        const [x1, x2] = solutions;
                        const shouldColorBetween = 
                          (a > 0 && (inequationType === '<' || inequationType === '<=')) ||
                          (a < 0 && (inequationType === '>' || inequationType === '>='));
                        
                        if (shouldColorBetween && x1 >= -8 && x2 <= 8) {
                          return (
                            <rect
                              x={(x1 + 8) * 15}
                              y="0"
                              width={(x2 - x1) * 15}
                              height="300"
                              fill="rgba(34, 197, 94, 0.2)"
                              stroke="none"
                            />
                          );
                        }
                      }
                      return null;
                    })()}
                  </svg>
                </div>
                
                {/* Résolution étape par étape */}
                <div className="space-y-4">
                  {(() => {
                    const { solutions, intervals, delta } = calculateInequationSolution();
                    const { a, b, c } = inequationParams;
                    
                    return (
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="font-bold text-blue-800 mb-1">1. Discriminant :</div>
                          <div className="text-gray-800">Δ = {delta.toFixed(1)}</div>
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                          <div className="font-bold text-purple-800 mb-1">2. Racines :</div>
                          <div className="text-gray-800">
                            {solutions.length === 0 ? 'Aucune racine réelle' :
                             solutions.length === 1 ? `x = ${solutions[0].toFixed(2)}` :
                             `x₁ = ${solutions[0].toFixed(2)}, x₂ = ${solutions[1].toFixed(2)}`}
                          </div>
                        </div>
                        
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                          <div className="font-bold text-orange-800 mb-1">3. Signe de a :</div>
                          <div className="text-gray-800">
                            a = {a} {a > 0 ? '> 0 (parabole vers le haut)' : '< 0 (parabole vers le bas)'}
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="font-bold text-green-800 mb-1">4. Solution :</div>
                          <div className="text-gray-800 font-mono">
                            {intervals.length === 0 ? '∅' : intervals.join(' ∪ ')}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('calculateur-inequations', 40)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('calculateur-inequations')
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {completedSections.includes('calculateur-inequations') ? '✓ Calculateur testé ! +40 XP' : 'J\'ai exploré le calculateur ! +40 XP'}
            </button>
          </div>
        </section>

        {/* Section récapitulatif final */}
        {completedSections.length >= 2 && (
          <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl p-7 shadow-xl text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold mb-4">Bravo ! Maîtrise des Inéquations !</h2>
            <p className="text-xl mb-6">Tu sais maintenant résoudre toutes les inéquations du second degré !</p>
            
            {chapterCompleted && (
              <div className="bg-yellow-400/20 border-2 border-yellow-300 p-4 rounded-2xl mb-6">
                <div className="text-lg font-bold text-yellow-200 mb-2">🎖️ Expert des Tableaux !</div>
                <div className="text-lg text-yellow-100">Bonus final : +40 XP</div>
              </div>
            )}
            
            <div className="bg-white/20 p-6 rounded-2xl inline-block">
              <div className="text-4xl font-bold">{xpEarned} XP</div>
              <div className="text-lg">Total gagné</div>
              <div className="text-lg mt-2 text-white/80">
                Sections: {30 + 40} XP + Bonus: 40 XP
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/chapitre/equations-second-degre"
                className="inline-flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
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