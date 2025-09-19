'use client';

import { useState } from 'react';
import { RotateCcw, Target, Trophy, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import ChapterLayout from '../../components/ChapterLayout';

export default function VariationsPage() {
  const [aValue, setAValue] = useState(1);
  const [alpha, setAlpha] = useState(1);
  const [beta, setBeta] = useState(-2);

  const getSmileyState = () => {
    if (aValue >= 2) return { emoji: "😄", mood: "Très content", color: "#16a34a" };
    if (aValue >= 1.5) return { emoji: "😊", mood: "Content", color: "#22c55e" };
    if (aValue >= 1) return { emoji: "🙂", mood: "Souriant", color: "#65a30d" };
    if (aValue >= 0.5) return { emoji: "😐", mood: "Neutre+", color: "#84cc16" };
    if (aValue >= 0.2) return { emoji: "😑", mood: "Légèrement positif", color: "#a3a3a3" };
    if (aValue >= -0.2) return { emoji: "😶", mood: "Neutre", color: "#6b7280" };
    if (aValue >= -0.5) return { emoji: "😕", mood: "Légèrement négatif", color: "#f59e0b" };
    if (aValue >= -1) return { emoji: "🙁", mood: "Pas content", color: "#f97316" };
    if (aValue >= -1.5) return { emoji: "😞", mood: "Triste", color: "#ef4444" };
    return { emoji: "😢", mood: "Très triste", color: "#dc2626" };
  };

  const generateParabola = () => {
    const points = [];
    for (let x = -4; x <= 4; x += 0.2) {
      const y = aValue * (x - alpha) ** 2 + beta;
      if (y >= -4 && y <= 4) {
        points.push(`${150 + x * 25},${150 - y * 25}`);
      }
    }
    return points.join(' ');
  };

  const getSmileyEmoji = () => {
    if (aValue > 0) return "😊";
    if (aValue < 0) return "☹️";
    return "😐";
  };

  const variationExercises = [
    {
      equation: "f(x) = 2x² - 4x + 1",
      a: 2, alpha: 1, beta: -1,
      canonicalSteps: [
        { text: "f(x) = 2x² - 4x + 1", explanation: "Forme développée" },
        { text: "f(x) = 2(x² - 2x) + 1", explanation: "On factorise par a = 2" },
        { text: "f(x) = 2(x² - 2x + 1 - 1) + 1", explanation: "On complète le carré : (-2/2)² = 1" },
        { text: "f(x) = 2(x - 1)² - 2 + 1", explanation: "On factorise le trinôme" },
        { text: "f(x) = 2(x - 1)² - 1", explanation: "Forme canonique : α = 1, β = -1" }
      ],
      answer: { extremumType: "minimum", alpha: 1, beta: -1, leftVariation: "décroissante", rightVariation: "croissante" }
    },
    {
      equation: "g(x) = -x² + 6x - 5",
      a: -1, alpha: 3, beta: 4,
      canonicalSteps: [
        { text: "g(x) = -x² + 6x - 5", explanation: "Forme développée" },
        { text: "g(x) = -(x² - 6x) - 5", explanation: "On factorise par a = -1" },
        { text: "g(x) = -(x² - 6x + 9 - 9) - 5", explanation: "On complète le carré : (-6/2)² = 9" },
        { text: "g(x) = -(x - 3)² + 9 - 5", explanation: "On factorise le trinôme" },
        { text: "g(x) = -(x - 3)² + 4", explanation: "Forme canonique : α = 3, β = 4" }
      ],
      answer: { extremumType: "maximum", alpha: 3, beta: 4, leftVariation: "croissante", rightVariation: "décroissante" }
    },
    {
      equation: "h(x) = 0.5x² + 2x + 3",
      a: 0.5, alpha: -2, beta: 1,
      canonicalSteps: [
        { text: "h(x) = 0.5x² + 2x + 3", explanation: "Forme développée" },
        { text: "h(x) = 0.5(x² + 4x) + 3", explanation: "On factorise par a = 0.5" },
        { text: "h(x) = 0.5(x² + 4x + 4 - 4) + 3", explanation: "On complète le carré : (4/2)² = 4" },
        { text: "h(x) = 0.5(x + 2)² - 2 + 3", explanation: "On factorise le trinôme" },
        { text: "h(x) = 0.5(x + 2)² + 1", explanation: "Forme canonique : α = -2, β = 1" }
      ],
      answer: { extremumType: "minimum", alpha: -2, beta: 1, leftVariation: "décroissante", rightVariation: "croissante" }
    }
  ];

  const sections = [
    {
      id: 'intro-variations',
      title: 'Les Variations d\'une Parabole 📈',
      icon: '📊',
      content: (
        <div className="space-y-7">
          <div className="grid md:grid-cols-2 gap-7 items-start">
            <div className="space-y-5">
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 sm:p-5 rounded-xl sm:rounded-2xl">
                <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">Qu'est-ce que les variations ?</h3>
                <p className="text-sm sm:text-lg mb-2 sm:mb-4">
                  Les <strong>variations</strong> décrivent comment la fonction <strong>monte</strong> ou <strong>descend</strong> :
                </p>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div><strong>📈 Croissante :</strong> la fonction monte (y augmente)</div>
                  <div><strong>📉 Décroissante :</strong> la fonction descend (y diminue)</div>
                  <div><strong>🎯 Extremum :</strong> point le plus haut ou le plus bas</div>
                </div>
              </div>

                <div className="space-y-2 sm:space-y-4">
                <h3 className="text-base sm:text-xl font-bold text-gray-900">Les 2 cas selon le signe de a :</h3>
                
                <motion.div 
                  animate={{ 
                    backgroundColor: ["rgba(254,252,232,1)", "rgba(254,240,138,1)", "rgba(254,252,232,1)"],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-4 rounded-lg border-2 border-yellow-400"
                >
                  <motion.div 
                    className="flex items-center gap-2 font-bold text-yellow-800 mb-2"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      📐
                    </motion.span>
                    Étape préalable INDISPENSABLE
                  </motion.div>
                  <motion.div 
                    className="text-sm text-yellow-800"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <strong>Avant d'étudier les variations</strong>, il faut d'abord mettre la fonction sous 
                    <strong className="text-yellow-700"> forme canonique</strong> : f(x) = a(x - α)² + β
                    <br />
                    Cela permet d'identifier directement le <strong className="text-yellow-700">sommet (α, β)</strong> de la parabole.
                  </motion.div>
                </motion.div>
                
                <div className="space-y-3">
                  <div className="p-2 sm:p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                    <div className="text-sm sm:text-base font-bold text-green-800 flex items-center">
                      😊 Si a {'>'} 0 : La parabole "sourit"
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 mt-1">
                      <strong>Décroissante</strong> puis <strong>croissante</strong>
                      <br />Possède un <strong>minimum</strong> au sommet
                    </div>
                  </div>
                  <div className="p-2 sm:p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <div className="text-sm sm:text-base font-bold text-red-800 flex items-center">
                      ☹️ Si a {'<'} 0 : La parabole "boude"
                    </div>
                    <div className="text-xs sm:text-sm text-red-600 mt-1">
                      <strong>Croissante</strong> puis <strong>décroissante</strong>
                      <br />Possède un <strong>maximum</strong> au sommet
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Visualisation interactive :</h3>
              
              <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl border sm:border-2 border-gray-300 space-y-2 sm:space-y-3">
                <div className="text-center mb-2 sm:mb-3">
                  <div className="font-mono text-base sm:text-lg font-bold text-purple-600">
                    f(x) = {aValue}(x - {alpha})² + {beta}
                        </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Sommet : ({alpha}, {beta})
                    </div>
                  </div>
                  
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">a = {aValue}</label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={aValue}
                      onChange={(e) => setAValue(parseFloat(e.target.value))}
                      className="w-full h-1.5 sm:h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">α = {alpha}</label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.5"
                      value={alpha}
                      onChange={(e) => setAlpha(parseFloat(e.target.value))}
                      className="w-full h-1.5 sm:h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">β = {beta}</label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.5"
                      value={beta}
                      onChange={(e) => setBeta(parseFloat(e.target.value))}
                      className="w-full h-1.5 sm:h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl border sm:border-2 border-gray-300">
                <div className="text-center mb-2 sm:mb-3">
                  <h4 className="text-sm sm:text-base font-bold text-gray-800">🎭 Mood du coefficient a</h4>
                  <div className="text-4xl sm:text-6xl my-1 sm:my-2">{getSmileyState().emoji}</div>
                  <div className="text-xs sm:text-sm" style={{ color: getSmileyState().color }}>
                          {getSmileyState().mood}
                      </div>
                    </div>
                    
                <svg viewBox="0 0 300 300" className="w-full h-64 bg-gray-50 rounded-lg border">
                    <defs>
                    <pattern id="variations-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                  <rect width="300" height="300" fill="url(#variations-grid)" />
                    
                  <line x1="0" y1="150" x2="300" y2="150" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
                  <line x1="150" y1="0" x2="150" y2="300" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
                    
                    <polyline
                      points={generateParabola()}
                      fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                    <circle
                      cx={150 + alpha * 25}
                      cy={150 - beta * 25}
                    r="6" 
                    fill="#ef4444" 
                      stroke="white"
                    strokeWidth="2"
                  />
                  <text 
                    x={150 + alpha * 25 + 10} 
                    y={150 - beta * 25 - 10} 
                    fontSize="12" 
                    fill="#ef4444" 
                    fontWeight="bold"
                  >
                    S({alpha}, {beta})
                  </text>
                </svg>
                    </div>
                </div>
              </div>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-300 sm:border-2">
            <h4 className="text-sm sm:text-base font-bold text-blue-800 mb-2 sm:mb-3 text-center">🎯 Méthode complète</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div>
                <h5 className="text-sm sm:text-base font-bold text-green-800 mb-1 sm:mb-2">1️⃣ Forme canonique</h5>
                <div className="text-xs sm:text-sm text-green-700">
                  Écrire f(x) = a(x - α)² + β
                    </div>
                    </div>
              <div>
                                 <h5 className="text-sm sm:text-base font-bold text-blue-800 mb-1 sm:mb-2">2️⃣ Analyser le signe de a</h5>
                 <div className="text-xs sm:text-sm text-blue-700">
                   a {'>'} 0 : minimum / a {'<'} 0 : maximum
                    </div>
                  </div>
              <div>
                <h5 className="text-sm sm:text-base font-bold text-purple-800 mb-1 sm:mb-2">3️⃣ Identifier le sommet</h5>
                <div className="text-xs sm:text-sm text-purple-700">
                  Extremum en (α, β)
                </div>
              </div>
              <div>
                <h5 className="text-sm sm:text-base font-bold text-orange-800 mb-1 sm:mb-2">4️⃣ Donner les variations</h5>
                <div className="text-xs sm:text-sm text-orange-700">
                  Décroissante puis croissante (ou inverse)
            </div>
          </div>
          </div>
            </div>
          </div>
      ),
      xpReward: 25
    },
    {
      id: 'tableau-variations',
      title: 'Tableau de Variations 📋',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-3">Faire le tableau de variation</h3>
            <p className="hidden sm:block text-lg">
              Le tableau de variations résume toutes les informations importantes sur la fonction.
            </p>
                </div>
                
          <div className="bg-white p-3 sm:p-6 rounded-lg sm:rounded-xl border sm:border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-2 sm:mb-4">📋 Modèle de tableau</h4>
            
            <div className="space-y-3 sm:space-y-6">
              <div className="bg-green-50 p-2 sm:p-4 rounded-lg">
                <h5 className="font-bold text-green-800 text-sm sm:text-base mb-1 sm:mb-3">Cas a {'>'} 0 (parabole souriante)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-400 p-1 sm:p-2 text-left text-gray-700 text-[10px] sm:text-sm">x</th>
                        <th className="border-t border-b border-l border-gray-400 p-1 sm:p-2 text-left text-gray-700 text-[10px] sm:text-sm">-∞</th>
                        <th className="border-t border-b border-gray-400 p-1 sm:p-2 text-center text-gray-700 text-[10px] sm:text-sm w-12">α</th>
                        <th className="border-t border-b border-r border-gray-400 p-1 sm:p-2 text-right text-gray-700 text-[10px] sm:text-sm">+∞</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 p-1 sm:p-2 font-bold text-gray-700 text-[10px] sm:text-sm">f(x)</td>
                        <td className="border-t border-b border-l border-gray-400 p-1 sm:p-2 text-center">
                          <div className="flex flex-col items-center text-gray-700 text-[10px] sm:text-sm">
                            <svg width="50" height="50" viewBox="0 0 50 50" className="text-green-500">
                              <line x1="8" y1="8" x2="42" y2="42" stroke="currentColor" strokeWidth="3.5"/>
                              <path d="M32 42 L42 42 L42 32" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </td>
                        <td className="border-t border-b border-gray-400 p-1 sm:p-2 text-center w-12">
                          <div className="flex flex-col justify-start h-full">
                            <div className="font-bold text-gray-700 text-[10px] sm:text-sm">β</div>
                            <div className="text-[8px] sm:text-xs text-gray-600">minimum</div>
                          </div>
                        </td>
                        <td className="border-t border-b border-r border-gray-400 p-1 sm:p-2 text-center">
                          <div className="flex flex-col items-center text-gray-700 text-[10px] sm:text-sm">
                            <svg width="50" height="50" viewBox="0 0 50 50" className="text-red-500">
                              <line x1="8" y1="42" x2="42" y2="8" stroke="currentColor" strokeWidth="3.5"/>
                              <path d="M32 8 L42 8 L42 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-red-50 p-2 sm:p-4 rounded-lg">
                <h5 className="font-bold text-red-800 text-sm sm:text-base mb-1 sm:mb-3">Cas a {'<'} 0 (parabole boudeuse)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-400">
                            <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-400 p-1 sm:p-2 text-left text-gray-700 text-[10px] sm:text-sm">x</th>
                        <th className="border-t border-b border-l border-gray-400 p-1 sm:p-2 text-left text-gray-700 text-[10px] sm:text-sm">-∞</th>
                        <th className="border-t border-b border-gray-400 p-1 sm:p-2 text-center text-gray-700 text-[10px] sm:text-sm w-12">α</th>
                        <th className="border-t border-b border-r border-gray-400 p-1 sm:p-2 text-right text-gray-700 text-[10px] sm:text-sm">+∞</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                        <td className="border border-gray-400 p-1 sm:p-2 font-bold text-gray-700 text-[10px] sm:text-sm">f(x)</td>
                        <td className="border border-gray-400 p-1 sm:p-2 text-center">
                          <div className="flex flex-col items-center text-gray-700 text-[10px] sm:text-sm">
                            <svg width="50" height="50" viewBox="0 0 50 50" className="text-red-500">
                              <line x1="8" y1="42" x2="42" y2="8" stroke="currentColor" strokeWidth="3.5"/>
                              <path d="M32 8 L42 8 L42 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </td>
                        <td className="border border-gray-400 p-1 sm:p-2 text-center">
                          <div className="font-bold text-gray-700 text-[10px] sm:text-sm">β</div>
                          <div className="text-[8px] sm:text-xs text-gray-600">maximum</div>
                        </td>
                        <td className="border border-gray-400 p-1 sm:p-2 text-center">
                          <div className="flex flex-col items-center text-gray-700 text-[10px] sm:text-sm">
                            <svg width="50" height="50" viewBox="0 0 50 50" className="text-green-500">
                              <line x1="8" y1="8" x2="42" y2="42" stroke="currentColor" strokeWidth="3.5"/>
                              <path d="M32 42 L42 42 L42 32" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </td>
                              </tr>
                            </tbody>
                          </table>
                    </div>
                  </div>

                <div className="bg-blue-50 p-2 sm:p-4 rounded-lg">
                <h5 className="font-bold text-blue-800 text-sm sm:text-base mb-1 sm:mb-3">💡 Points clés à retenir</h5>
                <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-sm">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-blue-600">📍</span>
                    <span className="text-gray-700">L'extremum se trouve toujours en x = α</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-blue-600">📈</span>
                    <span className="text-gray-700">Si a {'>'} 0 : décroissante puis croissante</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-blue-600">📉</span>
                    <span className="text-gray-700">Si a {'<'} 0 : croissante puis décroissante</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-blue-600">🎯</span>
                    <span className="text-gray-700">La valeur de l'extremum est β</span>
                  </div>
                </div>
              </div>
                            </div>
                              </div>
                                </div>
      ),
      xpReward: 25
    },
    {
      id: 'exercises',
      title: 'Exercices Pratiques 💪',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-3 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-3"><span className="sm:hidden">Étudier les variations</span><span className="hidden sm:inline">Entraînement sur les variations</span></h3>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-sm sm:text-lg">
                Analysez les variations de ces fonctions !
              </p>
                <motion.div 
                  animate={{ 
                    backgroundColor: ["rgba(255,255,255,0.1)", "rgba(255,255,0,0.2)", "rgba(255,255,255,0.1)"],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="backdrop-blur-sm p-2 sm:p-4 rounded-lg text-[10px] sm:text-sm border-2 border-yellow-300/50"
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-yellow-300"
                    >
                      ⚠️
                    </motion.span>
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="font-bold"
                    >
                      Étape préalable INDISPENSABLE : Avant d'étudier les variations, il faut d'abord mettre la fonction sous <span className="text-yellow-300">forme canonique</span> : f(x) = a(x - α)² + β
                      <div className="text-sm mt-1 text-yellow-100">
                        Cela permet d'identifier directement le <span className="font-bold">sommet (α, β)</span> de la parabole.
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
            </div>
                                </div>

          <div className="grid gap-6">
            {variationExercises.map((exercise, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {exercise.equation}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">Analysez la fonction et déterminez ses variations</p>
                            </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">1️⃣ Mise sous forme canonique :</h4>
                    <div className="space-y-2 text-sm">
                      {exercise.canonicalSteps.map((step, stepIndex) => (
                        <div key={stepIndex} className="p-3 bg-white rounded border-l-4 border-yellow-400">
                          <div className="font-mono font-bold text-gray-800 text-[10px] sm:text-sm whitespace-nowrap overflow-x-auto">{step.text}</div>
                          <div className="text-gray-600 text-[10px] sm:text-sm">{step.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">2️⃣ Analyse :</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 py-0.5 px-2 sm:p-3 bg-white rounded border-l-4 border-blue-400">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[10px] sm:text-sm">a = {exercise.a}</span>
                            <span className="text-gray-600 text-[10px] sm:text-sm">
                              {exercise.a > 0 ? '→ Souriante' : '→ Boudeuse'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 py-0.5 px-2 sm:p-3 bg-white rounded border-l-4 border-green-400">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[10px] sm:text-sm">S({exercise.alpha}, {exercise.beta})</span>
                            <span className="text-gray-600 text-[10px] sm:text-sm">
                              → {exercise.a > 0 ? 'Min' : 'Max'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="py-0.5 px-2 sm:p-3 bg-white rounded border-l-4 border-purple-400">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[10px] sm:text-sm">Variations</span>
                          <span className="text-gray-600 text-[10px] sm:text-sm">
                            {exercise.a > 0 
                              ? '→ ↘ puis ↗'
                              : '→ ↗ puis ↘'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                                
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">📊 Tableau de variations :</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400">
                                      <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-400 p-2 text-left text-gray-700">x</th>
                            <th className="border-t border-b border-l border-gray-400 p-2 text-left text-gray-700">-∞</th>
                            <th className="border-t border-b border-gray-400 p-2 text-center text-gray-700 w-12">{exercise.alpha}</th>
                            <th className="border-t border-b border-r border-gray-400 p-2 text-right text-gray-700">+∞</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                            <td className="border border-gray-400 p-2 font-bold text-gray-700">f(x)</td>
                            <td className="border-t border-b border-l border-gray-400 p-2 text-center">
                              <div className="flex flex-col items-center">
                                {exercise.a > 0 ? 
                                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-green-500">
                                    <line x1="6" y1="6" x2="34" y2="34" stroke="currentColor" strokeWidth="3"/>
                                    <path d="M26 34 L34 34 L34 26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                  </svg> : 
                                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-red-500">
                                    <line x1="6" y1="34" x2="34" y2="6" stroke="currentColor" strokeWidth="3"/>
                                    <path d="M26 6 L34 6 L34 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                  </svg>
                                }
                              </div>
                            </td>
                            <td className="border-t border-b border-gray-400 p-2 text-center w-12">
                              <div className="flex flex-col justify-start h-full">
                                <div className="font-bold text-gray-700">
                                  {exercise.beta}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {exercise.a > 0 ? 'minimum' : 'maximum'}
                                </div>
                              </div>
                            </td>
                            <td className="border-t border-b border-r border-gray-400 p-2 text-center">
                              <div className="flex flex-col items-center">
                                {exercise.a > 0 ? 
                            <svg width="50" height="50" viewBox="0 0 50 50" className="text-red-500">
                              <line x1="8" y1="42" x2="42" y2="8" stroke="currentColor" strokeWidth="3.5"/>
                              <path d="M32 8 L42 8 L42 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
                            </svg> : 
                                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-green-500">
                                    <line x1="6" y1="6" x2="34" y2="34" stroke="currentColor" strokeWidth="3"/>
                                    <path d="M26 34 L34 34 L34 26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                                  </svg>
                                }
                              </div>
                            </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
            ))}
                          </div>
                        </div>
      ),
      xpReward: 40
    }
  ];

  return (
    <ChapterLayout
      title="Variations des Fonctions du Second Degré"
      description="Étudier les variations et dresser des tableaux de variations"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-tableaux-signes', text: 'Tableaux de signes' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
} 