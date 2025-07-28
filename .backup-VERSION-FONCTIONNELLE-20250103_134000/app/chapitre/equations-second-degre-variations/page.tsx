'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, Target, Trophy, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

export default function VariationsPage() {
  const [aValue, setAValue] = useState(1);
  const [alpha, setAlpha] = useState(1);
  const [beta, setBeta] = useState(-2);
  const [manivelleTurns, setManivelleTurns] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseAngle, setLastMouseAngle] = useState(0);

  const calculateMouseAngle = (event: MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  const angleToAValue = (angle: number) => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const aVal = Math.cos((normalizedAngle * Math.PI) / 180) * 2;
    return Math.round(aVal * 10) / 10;
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    const angle = calculateMouseAngle(event.nativeEvent, event.currentTarget as HTMLElement);
    setLastMouseAngle(angle);
    event.preventDefault();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    
    const manivelle = document.querySelector('.manivelle-handle') as HTMLElement;
    if (!manivelle) return;
    
    const currentAngle = calculateMouseAngle(event, manivelle);
    const angleDelta = currentAngle - lastMouseAngle;
    
    setManivelleTurns(prev => prev + angleDelta);
    setLastMouseAngle(currentAngle);
    
    const newAValue = angleToAValue(manivelleTurns + angleDelta);
    setAValue(newAValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, lastMouseAngle, manivelleTurns]);

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
      answer: { extremumType: "minimum", alpha: 1, beta: -1, leftVariation: "décroissante", rightVariation: "croissante" }
    },
    {
      equation: "g(x) = -x² + 6x - 5",
      a: -1, alpha: 3, beta: 4,
      answer: { extremumType: "maximum", alpha: 3, beta: 4, leftVariation: "croissante", rightVariation: "décroissante" }
    },
    {
      equation: "h(x) = 0.5x² + 2x + 3",
      a: 0.5, alpha: -2, beta: 1,
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
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-5 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">Qu'est-ce que les variations ?</h3>
                <p className="text-lg mb-4">
                  Les <strong>variations</strong> décrivent comment la fonction <strong>monte</strong> ou <strong>descend</strong> :
                </p>
                <div className="space-y-2 text-sm">
                  <div><strong>📈 Croissante :</strong> la fonction monte (y augmente)</div>
                  <div><strong>📉 Décroissante :</strong> la fonction descend (y diminue)</div>
                  <div><strong>🎯 Extremum :</strong> point le plus haut ou le plus bas</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Les 2 cas selon le signe de a :</h3>
                
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <div className="font-bold text-yellow-800 flex items-center mb-2">
                    📐 Étape préalable INDISPENSABLE
                  </div>
                  <div className="text-sm text-yellow-700">
                    <strong>Avant d'étudier les variations</strong>, il faut d'abord mettre la fonction sous 
                    <strong> forme canonique</strong> : f(x) = a(x - α)² + β
                    <br />
                    Cela permet d'identifier directement le <strong>sommet (α, β)</strong> de la parabole.
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                    <div className="font-bold text-green-800 flex items-center">
                      😊 Si a {'>'} 0 : La parabole "sourit"
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      <strong>Décroissante</strong> puis <strong>croissante</strong>
                      <br />Possède un <strong>minimum</strong> au sommet
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <div className="font-bold text-red-800 flex items-center">
                      ☹️ Si a {'<'} 0 : La parabole "boude"
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      <strong>Croissante</strong> puis <strong>décroissante</strong>
                      <br />Possède un <strong>maximum</strong> au sommet
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Visualisation interactive :</h3>
              
              <div className="bg-white p-4 rounded-xl border-2 border-gray-300 space-y-3">
                <div className="text-center mb-3">
                  <div className="font-mono text-lg font-bold text-purple-600">
                    f(x) = {aValue}(x - {alpha})² + {beta}
                        </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Sommet : ({alpha}, {beta})
                    </div>
                  </div>
                  
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">a = {aValue}</label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={aValue}
                      onChange={(e) => setAValue(parseFloat(e.target.value))}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">α = {alpha}</label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.5"
                      value={alpha}
                      onChange={(e) => setAlpha(parseFloat(e.target.value))}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                    </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">β = {beta}</label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.5"
                      value={beta}
                      onChange={(e) => setBeta(parseFloat(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                <div className="text-center mb-3">
                  <h4 className="font-bold text-gray-800">🎭 Mood du coefficient a</h4>
                  <div className="text-6xl my-2">{getSmileyState().emoji}</div>
                  <div className="text-sm" style={{ color: getSmileyState().color }}>
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

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl border-2 border-blue-300">
            <h4 className="font-bold text-blue-800 mb-3 text-center">🎯 Méthode complète</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-bold text-green-800 mb-2">1️⃣ Forme canonique</h5>
                <div className="text-sm text-green-700">
                  Écrire f(x) = a(x - α)² + β
                    </div>
                    </div>
              <div>
                                 <h5 className="font-bold text-blue-800 mb-2">2️⃣ Analyser le signe de a</h5>
                 <div className="text-sm text-blue-700">
                   a {'>'} 0 : minimum / a {'<'} 0 : maximum
                    </div>
                  </div>
              <div>
                <h5 className="font-bold text-purple-800 mb-2">3️⃣ Identifier le sommet</h5>
                <div className="text-sm text-purple-700">
                  Extremum en (α, β)
                </div>
              </div>
              <div>
                <h5 className="font-bold text-orange-800 mb-2">4️⃣ Donner les variations</h5>
                <div className="text-sm text-orange-700">
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
      id: 'interactive-manivelle',
      title: 'Manivelle Interactive 🎮',
      icon: '⚙️',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Contrôle par manivelle</h3>
            <p className="text-lg">
              Tournez la manivelle pour voir comment le coefficient a change l'allure de la parabole !
            </p>
              </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <div className="text-center mb-6">
              <div className="font-mono text-lg font-bold text-green-600">
                f(x) = {aValue}(x - {alpha})² + {beta}
                  </div>
              <div className="text-sm text-gray-600 mt-1">
                Coefficient a = {aValue} {getSmileyEmoji()}
                </div>
              </div>
              
            <div className="grid md:grid-cols-2 gap-6">
                            <div className="text-center">
                <h4 className="font-bold text-gray-800 mb-4">🎛️ Manivelle de contrôle</h4>
                <div className="bg-gray-100 p-6 rounded-xl">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="35" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
                      <circle cx="50" cy="50" r="8" fill="#6b7280"/>
                      <line
                        x1="50"
                        y1="50"
                        x2={50 + 25 * Math.cos(manivelleTurns * Math.PI / 180)}
                        y2={50 + 25 * Math.sin(manivelleTurns * Math.PI / 180)}
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle
                        cx={50 + 25 * Math.cos(manivelleTurns * Math.PI / 180)}
                        cy={50 + 25 * Math.sin(manivelleTurns * Math.PI / 180)}
                        r="8"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                        className="manivelle-handle cursor-grab"
                        onMouseDown={handleMouseDown}
                      />
                    </svg>
                            </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Cliquez et faites glisser la poignée bleue
                          </div>
                            </div>
                </div>
                
              <div>
                <h4 className="font-bold text-gray-800 mb-4">📊 Graphique temps réel</h4>
                <svg viewBox="0 0 200 200" className="w-full h-48 bg-gray-50 rounded-lg border">
                  <defs>
                    <pattern id="manivelle-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="200" height="200" fill="url(#manivelle-grid)" />
                  
                  <line x1="0" y1="100" x2="200" y2="100" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
                  
                  <polyline
                    points={(() => {
                      const points = [];
                      for (let x = -4; x <= 4; x += 0.3) {
                        const y = aValue * (x - alpha) ** 2 + beta;
                        if (y >= -4 && y <= 4) {
                          points.push(`${100 + x * 20},${100 - y * 20}`);
                        }
                      }
                      return points.join(' ');
                    })()}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  <circle 
                    cx={100 + alpha * 20} 
                    cy={100 - beta * 20} 
                    r="4" 
                    fill="#ef4444" 
                    stroke="white" 
                    strokeWidth="2"
                  />
                </svg>
            </div>
          </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-bold text-purple-800 mb-2">État actuel</h5>
                <div className="text-sm space-y-1">
                  <div>Coefficient a : <span className="font-mono">{aValue}</span></div>
                  <div>Type : <span className="font-bold">{aValue > 0 ? 'Minimum' : aValue < 0 ? 'Maximum' : 'Droite'}</span></div>
                  <div>Variations : <span className="font-bold">
                    {aValue > 0 ? 'Décroissante puis croissante' : aValue < 0 ? 'Croissante puis décroissante' : 'Constante'}
                  </span></div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-bold text-blue-800 mb-2">Sommet</h5>
                <div className="text-sm space-y-1">
                  <div>Abscisse α : <span className="font-mono">{alpha}</span></div>
                  <div>Ordonnée β : <span className="font-mono">{beta}</span></div>
                  <div>Coordonnées : <span className="font-mono">({alpha}, {beta})</span></div>
                  </div>
                </div>
              </div>
            </div>
                  </div>
      ),
      xpReward: 30
    },
    {
      id: 'tableau-variations',
      title: 'Tableau de Variations 📋',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Comment dresser un tableau de variations</h3>
            <p className="text-lg">
              Le tableau de variations résume toutes les informations importantes sur la fonction.
            </p>
                </div>
                
          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 mb-4">📋 Modèle de tableau</h4>
            
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-bold text-green-800 mb-3">Cas a {'>'} 0 (parabole souriante)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 p-2 text-left">x</th>
                        <th className="border border-gray-400 p-2 text-center">-∞</th>
                        <th className="border border-gray-400 p-2 text-center">α</th>
                        <th className="border border-gray-400 p-2 text-center">+∞</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 p-2 font-bold">f(x)</td>
                        <td className="border border-gray-400 p-2 text-center">
                          <div className="flex flex-col items-center">
                            <span>+∞</span>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          </div>
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                          <div className="font-bold text-green-600">β</div>
                          <div className="text-xs text-gray-500">minimum</div>
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                          <div className="flex flex-col items-center">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span>+∞</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h5 className="font-bold text-red-800 mb-3">Cas a {'<'} 0 (parabole boudeuse)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-400">
                            <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 p-2 text-left">x</th>
                        <th className="border border-gray-400 p-2 text-center">-∞</th>
                        <th className="border border-gray-400 p-2 text-center">α</th>
                        <th className="border border-gray-400 p-2 text-center">+∞</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                        <td className="border border-gray-400 p-2 font-bold">f(x)</td>
                        <td className="border border-gray-400 p-2 text-center">
                          <div className="flex flex-col items-center">
                            <span>-∞</span>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                                  </div>
                                </td>
                        <td className="border border-gray-400 p-2 text-center">
                          <div className="font-bold text-red-600">β</div>
                          <div className="text-xs text-gray-500">maximum</div>
                                </td>
                        <td className="border border-gray-400 p-2 text-center">
                          <div className="flex flex-col items-center">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span>-∞</span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                    </div>
                  </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-bold text-blue-800 mb-3">💡 Points clés à retenir</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">📍</span>
                    <span>L'extremum se trouve toujours en x = α</span>
                        </div>
                                     <div className="flex items-center space-x-2">
                     <span className="text-blue-600">📈</span>
                     <span>Si a {'>'} 0 : décroissante puis croissante</span>
                              </div>
                   <div className="flex items-center space-x-2">
                     <span className="text-blue-600">📉</span>
                     <span>Si a {'<'} 0 : croissante puis décroissante</span>
                                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🎯</span>
                    <span>La valeur de l'extremum est β</span>
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
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement sur les variations</h3>
            <p className="text-lg">
              Analysez les variations de ces fonctions !
            </p>
                                </div>

          <div className="grid gap-6">
            {variationExercises.map((exercise, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Étudier les variations de : {exercise.equation}
                  </h3>
                  <p className="text-gray-600">Analysez la fonction et déterminez ses variations</p>
                            </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">🎯 Analyse :</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 bg-white rounded border-l-4 border-blue-400">
                        <div className="font-bold">Coefficient a = {exercise.a}</div>
                        <div className="text-gray-600">
                          {exercise.a > 0 ? 'Positif → parabole souriante' : 'Négatif → parabole boudeuse'}
                              </div>
                                    </div>
                      <div className="p-3 bg-white rounded border-l-4 border-green-400">
                        <div className="font-bold">Sommet : ({exercise.alpha}, {exercise.beta})</div>
                        <div className="text-gray-600">
                          {exercise.a > 0 ? 'Minimum' : 'Maximum'} de la fonction
                                    </div>
                                </div>
                      <div className="p-3 bg-white rounded border-l-4 border-purple-400">
                        <div className="font-bold">Variations :</div>
                        <div className="text-gray-600">
                          {exercise.a > 0 
                            ? 'Décroissante sur ]-∞, α] puis croissante sur [α, +∞['
                            : 'Croissante sur ]-∞, α] puis décroissante sur [α, +∞['
                          }
                                </div>
                              </div>
                            </div>
                                </div>
                                
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3">📊 Tableau de variations :</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-400">
                                      <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-400 p-2 text-left">x</th>
                            <th className="border border-gray-400 p-2 text-center">-∞</th>
                            <th className="border border-gray-400 p-2 text-center">{exercise.alpha}</th>
                            <th className="border border-gray-400 p-2 text-center">+∞</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                            <td className="border border-gray-400 p-2 font-bold">f(x)</td>
                            <td className="border border-gray-400 p-2 text-center">
                              <div className="flex flex-col items-center">
                                <span>{exercise.a > 0 ? '+∞' : '-∞'}</span>
                                {exercise.a > 0 ? 
                                  <TrendingDown className="h-4 w-4 text-red-500" /> : 
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                }
                                            </div>
                                          </td>
                            <td className="border border-gray-400 p-2 text-center">
                              <div className={`font-bold ${exercise.a > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                              {exercise.beta}
                                            </div>
                              <div className="text-xs text-gray-500">
                                {exercise.a > 0 ? 'minimum' : 'maximum'}
                                            </div>
                                          </td>
                            <td className="border border-gray-400 p-2 text-center">
                              <div className="flex flex-col items-center">
                                {exercise.a > 0 ? 
                                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                }
                                <span>{exercise.a > 0 ? '+∞' : '-∞'}</span>
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
        previous: { href: '/chapitre/equations-second-degre-forme-canonique', text: 'Forme canonique' },
        next: { href: '/chapitre/equations-second-degre-tableaux-signes', text: 'Tableaux de signes' }
      }}
    />
  );
} 