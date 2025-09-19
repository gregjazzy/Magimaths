'use client';

import { useState } from 'react';
import { Calculator, Target, CheckCircle, XCircle, Circle, Eye } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';
import ExerciseCard from '../../components/ExerciseCard';

export default function ResolutionPage() {
  const [graphParams, setGraphParams] = useState({ a: 1, b: -5, c: 6 });
  const [advancedType, setAdvancedType] = useState<'bicarree' | 'inverse' | 'racine'>('bicarree');
  const [bicarreeParams, setBicarreeParams] = useState({ a: 1, b: 0, c: -4 });
  const [showSolutions, setShowSolutions] = useState<{[key: string]: boolean}>({});

  const resolutionExercises = [
    {
      equation: "x² - 5x + 6 = 0",
      a: 1, b: -5, c: 6,
      discriminant: 1,
      solutions: [2, 3],
      solutionType: "deux solutions"
    },
    {
      equation: "x² - 4x + 4 = 0", 
      a: 1, b: -4, c: 4,
      discriminant: 0,
      solutions: [2],
      solutionType: "solution double"
    },
    {
      equation: "x² + 2x + 5 = 0",
      a: 1, b: 2, c: 5, 
      discriminant: -16,
      solutions: [],
      solutionType: "aucune solution"
    }
  ];

  const calculateDiscriminantAndSolutions = () => {
    const { a, b, c } = graphParams;
    const discriminant = b * b - 4 * a * c;
    let solutions: number[] = [];
    
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      solutions = [x1, x2].sort((a, b) => a - b);
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      solutions = [x];
    }
    
    return { discriminant, solutions };
  };


  const generateParabola = () => {
    const { a, b, c } = graphParams;
    const points = [];
    for (let x = -10; x <= 10; x += 0.2) {
      const y = a * x * x + b * x + c;
      if (y >= -10 && y <= 10) {
        points.push(`${(x + 10) * 15},${(10 - y) * 15}`);
      }
    }
    return points.join(' ');
  };

  const sections = [
    {
      id: 'intro-discriminant',
      title: 'Résoudre une Équation du Second Degré 🎯',
      icon: '🔍',
      content: (
          <div className="space-y-4 sm:space-y-7">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-7">
              <div className="h-full flex flex-col">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-5 rounded-xl sm:rounded-2xl flex-grow">
                  <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">Qu'est-ce que le discriminant ?</h3>
                  <p className="text-sm sm:text-lg mb-3 sm:mb-4">
                    Le <strong>discriminant Δ</strong> permet de déterminer le nombre de solutions d'une équation ax² + bx + c = 0
                  </p>
                  <div className="bg-white/20 p-2 sm:p-3 rounded-lg space-y-2">
                    <div className="text-sm sm:text-xl font-bold text-center">
                      Forme générale : ax² + bx + c = 0
                    </div>
                    <div className="text-base sm:text-2xl font-bold text-center after:content-[''] after:block after:mt-3 sm:after:mt-4 after:pt-3 sm:after:pt-4 after:border-t after:border-white/30 after:text-[13px] sm:after:text-[15px] after:font-normal after:text-left after:leading-7 sm:after:leading-8 after:text-blue-100 after:content-['①_Si_Δ_>_0_:_deux_solutions_distinctes\A②_Si_Δ_=_0_:_une_solution_double\A③_Si_Δ_<_0_:_pas_de_solution_réelle'] after:whitespace-pre-wrap after:w-full sm:after:w-[280px]">
                      Δ = b² - 4ac
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-5 bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-r-lg">
                  <h4 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">📐 Méthode de résolution :</h4>
                  <div className="text-xs sm:text-sm text-yellow-700 space-y-1">
                    <div><strong>1.</strong> Identifier a, b, c dans ax² + bx + c = 0</div>
                    <div><strong>2.</strong> Calculer Δ = b² - 4ac</div>
                    <div><strong>3.</strong> Analyser le signe de Δ</div>
                    <div><strong>4.</strong> Appliquer la formule correspondante</div>
                  </div>
                </div>

              </div>

              <div className="h-full flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Visualisation interactive :</h3>
              
              <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-gray-300 space-y-2 sm:space-y-3">
                <div className="text-center mb-2 sm:mb-3">
                  <div className="font-mono text-base sm:text-lg font-bold text-blue-600">
                    f(x) = {graphParams.a}x² + {graphParams.b}x + {graphParams.c}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">a = {graphParams.a}</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.5"
                      value={graphParams.a}
                      onChange={(e) => setGraphParams(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 sm:h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">b = {graphParams.b}</label>
                    <input
                      type="range"
                      min="-8"
                      max="8"
                      step="1"
                      value={graphParams.b}
                      onChange={(e) => setGraphParams(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 sm:h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">c = {graphParams.c}</label>
                    <input
                      type="range"
                      min="-8"
                      max="8"
                      step="1"
                      value={graphParams.c}
                      onChange={(e) => setGraphParams(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                      className="w-full h-1.5 sm:h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-grow bg-white p-3 sm:p-4 rounded-xl border-2 border-gray-300 mt-3 sm:mt-4">
                <div className="text-center mb-2 sm:mb-3">
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base">🎯 Solutions = Intersections avec l'axe des x</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Quand f(x) = 0, on trouve les solutions !</p>
                </div>
                
                <svg viewBox="0 0 300 300" className="w-full h-48 sm:h-64 bg-gray-50 rounded-lg border">
                  <defs>
                    <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="300" fill="url(#grid)" />
                  
                  <line x1="0" y1="150" x2="300" y2="150" stroke="#374151" strokeWidth="1.5" />
                  <line x1="150" y1="0" x2="150" y2="300" stroke="#374151" strokeWidth="1.5" />
                  
                  {[-8, -4, 0, 4, 8].map(x => (
                    <g key={x}>
                      <line 
                        x1={(x + 10) * 15} 
                        y1="147" 
                        x2={(x + 10) * 15} 
                        y2="153" 
                        stroke="#374151" 
                        strokeWidth="1"
                      />
                      <text 
                        x={(x + 10) * 15} 
                        y="165" 
                        textAnchor="middle" 
                        fontSize="8"
                        fill="#374151"
                      >
                        {x}
                      </text>
                    </g>
                  ))}
                  
                  <polyline
                    points={generateParabola()}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    className="drop-shadow-sm"
                  />
                  
                  {(() => {
                    const { solutions } = calculateDiscriminantAndSolutions();
                    return solutions.map((sol, index) => {
                      if (sol >= -10 && sol <= 10) {
                        return (
                          <g key={index}>
                            <circle
                              cx={(sol + 10) * 15}
                              cy="150"
                              r="5"
                              fill="#ef4444"
                              stroke="white"
                              strokeWidth="1.5"
                              className="drop-shadow-lg"
                            />
                            <text
                              x={(sol + 10) * 15}
                              y="140"
                              textAnchor="middle"
                              fontSize="10"
                              fill="#ef4444"
                              fontWeight="bold"
                            >
                              x = {sol.toFixed(1)}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    });
                  })()}
                </svg>
                
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  {(() => {
                    const { discriminant, solutions } = calculateDiscriminantAndSolutions();
                    return (
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Discriminant Δ :</span>
                          <span className={`font-bold ${
                            discriminant > 0 ? 'text-green-600' : 
                            discriminant === 0 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {discriminant.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Nombre de solutions :</span>
                          <span className={`font-bold ${
                            discriminant > 0 ? 'text-green-600' : 
                            discriminant === 0 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {discriminant > 0 ? '2 solutions' : 
                             discriminant === 0 ? '1 solution double' : 
                             'Aucune solution réelle'}
                          </span>
                        </div>
                        {solutions.length > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700">Solutions :</span>
                            <span className="font-bold text-red-600">
                              {solutions.map(s => `x = ${s.toFixed(2)}`).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 30
    },
    {
      id: 'theory',
      title: 'Les 3 Cas de Résolution 📚',
      icon: '📖',
      content: (
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-blue-300">
              <h3 className="text-lg sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4">🎯 Principe général</h3>
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="text-sm sm:text-lg text-gray-700">
                  Pour résoudre <span className="font-mono text-blue-600">ax² + bx + c = 0</span>, on utilise le discriminant :
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-blue-300">
                  <div className="text-lg sm:text-2xl font-bold font-mono text-blue-600">Δ = b² - 4ac</div>
                </div>
                <div className="text-sm sm:text-lg text-gray-700">
                  Le <strong>signe de Δ</strong> détermine le nombre et la nature des solutions
                </div>
              </div>
            </div>

          <div className="bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-300">
            <div className="flex items-center mb-4 sm:mb-6">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-2xl font-bold text-green-800">Cas 1 : Δ {'>'} 0 (positif)</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-300">
                    <div className="text-center text-base sm:text-lg font-bold text-green-800 mb-2 sm:mb-3">
                      Deux solutions distinctes
                    </div>
                    <div className="text-gray-600 text-center text-sm sm:text-base">
                      La parabole coupe l'axe des x en 2 points
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-300">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-center border-b border-green-200 pb-2">
                        <div className="font-bold text-green-800 text-sm sm:text-base">Solutions :</div>
                      </div>
                      <div className="space-y-2 font-mono text-center text-gray-800 text-sm sm:text-base">
                        <div className="bg-green-100 p-1.5 sm:p-2 rounded flex items-center justify-center gap-2">
                          x₁ = <div className="inline-block align-middle mx-1">
                            <div className="text-red-600 border-b-2 border-gray-800 text-center px-2">-b + √Δ</div>
                            <div className="text-center px-2">2a</div>
                          </div>
                        </div>
                        <div className="bg-green-100 p-1.5 sm:p-2 rounded flex items-center justify-center gap-2">
                          x₂ = <div className="inline-block align-middle mx-1">
                            <div className="text-red-600 border-b-2 border-gray-800 text-center px-2">-b - √Δ</div>
                            <div className="text-center px-2">2a</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8">
                <h4 className="font-bold text-green-700 mb-2 sm:mb-3 text-base sm:text-lg">🧮 Exemple</h4>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-300">
                  <div className="font-mono text-center mb-2 text-blue-600 text-sm sm:text-base">x² - 5x + 6 = 0</div>
                    <div className="text-xs sm:text-sm space-y-2 text-gray-800">
                    <div className="flex items-center gap-2">
                      Δ = b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1
                    </div>
                    <div className="flex items-center gap-2">
                      x₁ = (-b + √Δ)/(2a) = (3 + 5)/2 = 4
                    </div>
                    <div className="flex items-center gap-2">
                      x₂ = (-b - √Δ)/(2a) = (3 - 5)/2 = -1
                    </div>
                    <div className="font-bold text-green-600">Solutions : x = 2 ou x = 3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-yellow-300">
            <div className="flex items-center mb-4 sm:mb-6">
              <Circle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-2xl font-bold text-yellow-800">Cas 2 : Δ = 0 (nul)</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-yellow-300">
                    <div className="text-center text-base sm:text-lg font-bold text-yellow-800 mb-2 sm:mb-3">
                      Une solution double
                    </div>
                    <div className="text-gray-600 text-center text-sm sm:text-base">
                      La parabole touche l'axe des x en 1 point
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-yellow-300">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="text-center border-b border-yellow-200 pb-2">
                        <div className="font-bold text-yellow-800 text-sm sm:text-base">Solution :</div>
                      </div>
                      <div className="font-mono text-center text-gray-800 text-sm sm:text-base">
                        <div className="bg-yellow-100 p-1.5 sm:p-2 rounded flex items-center justify-center gap-2">
                          x = <div className="inline-block align-middle mx-1">
                            <div className="text-red-600 border-b-2 border-gray-800 text-center px-2">-b</div>
                            <div className="text-center px-2">2a</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8">
                <h4 className="font-bold text-yellow-700 mb-2 sm:mb-3 text-base sm:text-lg">🧮 Exemple</h4>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-yellow-300">
                  <div className="font-mono text-center mb-2 text-blue-600 text-sm sm:text-base">x² - 4x + 4 = 0</div>
                  <div className="text-xs sm:text-sm space-y-2 text-gray-800">
                    <div className="flex items-center gap-2">
                      Δ = b² - 4ac = (-4)² - 4(1)(4) = 16 - 16 = 0
                    </div>
                    <div className="flex items-center gap-2">
                      x = -b/(2a) = 4/2 = 2
                    </div>
                    <div className="font-bold text-yellow-600">Solution double : x = 2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-red-300">
            <div className="flex items-center mb-4 sm:mb-6">
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-2xl font-bold text-red-800">Cas 3 : Δ {'<'} 0 (négatif)</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-red-300">
                    <div className="text-center text-base sm:text-lg font-bold text-red-800 mb-2 sm:mb-3">
                      Aucune solution réelle
                    </div>
                    <div className="text-gray-600 text-center text-sm sm:text-base">
                      La parabole ne coupe pas l'axe des x
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-red-300">
                    <div className="text-center text-base sm:text-lg font-bold text-red-800 mb-2 sm:mb-3">
                      Pas de solution dans ℝ
                    </div>
                    <div className="text-gray-600 text-center text-sm sm:text-base">
                      L'équation n'a pas de solution réelle
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8">
                <h4 className="font-bold text-red-700 mb-2 sm:mb-3 text-base sm:text-lg">🧮 Exemple</h4>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-red-300">
                  <div className="font-mono text-center mb-2 text-blue-600 text-sm sm:text-base">x² + 2x + 5 = 0</div>
                  <div className="text-xs sm:text-sm space-y-2 text-gray-800">
                    <div className="flex items-center gap-2">
                      Δ = b² - 4ac = (2)² - 4(1)(5) = 4 - 20 = -16
                    </div>
                    <div>Δ {'<'} 0 ⟹ √Δ n'existe pas dans ℝ</div>
                    <div className="font-bold text-red-600">Aucune solution réelle</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 35
    },
    {
      id: 'exercises',
      title: 'Exercices Pratiques 💪',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
              <span className="sm:hidden">Entraînement</span>
              <span className="hidden sm:inline">Entraînement pratique</span>
            </h3>
            <p className="text-base sm:text-lg">
              Résolvez ces équations étape par étape !
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
            <h4 className="text-xl font-bold text-blue-800 mb-4">📝 Exemple détaillé</h4>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-blue-300">
                <div className="font-mono text-center text-lg text-blue-600 mb-4">x² - 3x - 4 = 0</div>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-bold text-gray-700 mb-2">Étape 1 : Identifier les coefficients</div>
                    <div className="text-gray-600">
                      a = 1, b = -3, c = -4
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-bold text-gray-700 mb-2">Étape 2 : Calculer le discriminant</div>
                    <div className="text-gray-600">
                      Δ = b² - 4ac<br />
                      Δ = (-3)² - 4(1)(-4)<br />
                      Δ = 9 + 16 = 25
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-bold text-gray-700 mb-2">Étape 3 : Analyser Δ et appliquer la formule</div>
                    <div className="text-gray-600">
                      Δ > 0 donc deux solutions distinctes :<br />
                      x₁ = <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">-b + √Δ</div>
                        <div className="text-center px-2">2a</div>
                      </div> = <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">3 + 5</div>
                        <div className="text-center px-2">2</div>
                      </div> = 4<br />
                      x₂ = <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">-b - √Δ</div>
                        <div className="text-center px-2">2a</div>
                      </div> = <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">3 - 5</div>
                        <div className="text-center px-2">2</div>
                      </div> = -1
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <div className="font-bold text-green-800">Conclusion :</div>
                    <div className="text-green-700">
                      Les solutions sont x = -1 et x = 4
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Exercice 1</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">+20 XP</div>
              </div>
              <div className="font-mono text-lg text-blue-600 mb-6 text-center">
                x² - 5x + 6 = 0
              </div>
              <div className="space-y-4">
                {!showSolutions['ex1'] ? (
                  <button
                    onClick={() => setShowSolutions(prev => ({ ...prev, ex1: true }))}
                    className="w-full py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Voir la solution</span>
                  </button>
                ) : (
                  <>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 1 : Identifier les coefficients</div>
                      <div className="text-gray-600">
                        a = 1, b = -5, c = 6
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 2 : Calculer le discriminant</div>
                      <div className="text-gray-600">
                        Δ = b² - 4ac<br />
                        Δ = (-5)² - 4(1)(6)<br />
                        Δ = 25 - 24 = 1
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 3 : Analyser Δ et appliquer la formule</div>
                      <div className="text-gray-600">
                        Δ > 0 donc deux solutions distinctes :<br />
                        x₁ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-b + √Δ</div>
                          <div className="text-center px-2">2a</div>
                        </div> = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">5 + 1</div>
                          <div className="text-center px-2">2</div>
                        </div> = 3<br />
                        x₂ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-b - √Δ</div>
                          <div className="text-center px-2">2a</div>
                        </div> = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">5 - 1</div>
                          <div className="text-center px-2">2</div>
                        </div> = 2
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded">
                      <div className="font-bold text-green-800">Conclusion :</div>
                      <div className="text-green-700">
                        Les solutions sont x = 2 et x = 3
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Exercice 2</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">+20 XP</div>
              </div>
              <div className="font-mono text-lg text-blue-600 mb-6 text-center">
                x² - 4x + 4 = 0
              </div>
              <div className="space-y-4">
                {!showSolutions['ex2'] ? (
                  <button
                    onClick={() => setShowSolutions(prev => ({ ...prev, ex2: true }))}
                    className="w-full py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Voir la solution</span>
                  </button>
                ) : (
                  <>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 1 : Identifier les coefficients</div>
                      <div className="text-gray-600">
                        a = 1, b = -4, c = 4
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 2 : Calculer le discriminant</div>
                      <div className="text-gray-600">
                        Δ = b² - 4ac<br />
                        Δ = (-4)² - 4(1)(4)<br />
                        Δ = 16 - 16 = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 3 : Analyser Δ et appliquer la formule</div>
                      <div className="text-gray-600">
                        Δ = 0 donc une solution double :<br />
                        x = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-b</div>
                          <div className="text-center px-2">2a</div>
                        </div> = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">4</div>
                          <div className="text-center px-2">2</div>
                        </div> = 2
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded">
                      <div className="font-bold text-green-800">Conclusion :</div>
                      <div className="text-green-700">
                        Solution double : x = 2
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      ),
      xpReward: 30
    }
  ];

  return (
    <ChapterLayout
      title="Résolution des Équations du Second Degré"
      description="Maîtriser la résolution avec le discriminant et les formules"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-forme-canonique', text: 'Forme canonique' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
} 