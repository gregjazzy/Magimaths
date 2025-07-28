'use client';

import { useState } from 'react';
import { Calculator, Target, CheckCircle, XCircle, Circle } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';
import ExerciseCard from '../../components/ExerciseCard';

export default function ResolutionPage() {
  const [graphParams, setGraphParams] = useState({ a: 1, b: -5, c: 6 });
  const [calculatorParams, setCalculatorParams] = useState({ a: 1, b: -3, c: 2 });
  const [advancedType, setAdvancedType] = useState<'bicarree' | 'inverse' | 'racine'>('bicarree');
  const [bicarreeParams, setBicarreeParams] = useState({ a: 1, b: 0, c: -4 });

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

  const calculateSolutions = (a: number, b: number, c: number) => {
    const discriminant = b * b - 4 * a * c;
    let solutions: number[] = [];
    let solutionType = '';
    
    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      solutions = [x1, x2].sort((a, b) => a - b);
      solutionType = 'deux solutions distinctes';
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      solutions = [x];
      solutionType = 'solution double';
    } else {
      solutionType = 'aucune solution réelle';
    }
    
    return { discriminant, solutions, solutionType };
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
        <div className="space-y-7">
          <div className="grid md:grid-cols-2 gap-7">
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">Qu'est-ce que le discriminant ?</h3>
                <p className="text-lg mb-4">
                  Le <strong>discriminant Δ</strong> permet de déterminer le nombre de solutions d'une équation ax² + bx + c = 0
                </p>
                <div className="bg-white/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-center">
                    Δ = b² - 4ac
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <h4 className="font-bold text-yellow-800 mb-2">📐 Méthode de résolution :</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <div><strong>1.</strong> Identifier a, b, c dans ax² + bx + c = 0</div>
                  <div><strong>2.</strong> Calculer Δ = b² - 4ac</div>
                  <div><strong>3.</strong> Analyser le signe de Δ</div>
                  <div><strong>4.</strong> Appliquer la formule correspondante</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Visualisation interactive :</h3>
              
              <div className="bg-white p-4 rounded-xl border-2 border-gray-300 space-y-3">
                <div className="text-center mb-3">
                  <div className="font-mono text-lg font-bold text-blue-600">
                    f(x) = {graphParams.a}x² + {graphParams.b}x + {graphParams.c}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">a = {graphParams.a}</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.5"
                      value={graphParams.a}
                      onChange={(e) => setGraphParams(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">b = {graphParams.b}</label>
                    <input
                      type="range"
                      min="-8"
                      max="8"
                      step="1"
                      value={graphParams.b}
                      onChange={(e) => setGraphParams(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">c = {graphParams.c}</label>
                    <input
                      type="range"
                      min="-8"
                      max="8"
                      step="1"
                      value={graphParams.c}
                      onChange={(e) => setGraphParams(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                <div className="text-center mb-3">
                  <h4 className="font-bold text-gray-800">🎯 Solutions = Intersections avec l'axe des x</h4>
                  <p className="text-sm text-gray-600">Quand f(x) = 0, on trouve les solutions !</p>
                </div>
                
                <svg viewBox="0 0 300 300" className="w-full h-64 bg-gray-50 rounded-lg border">
                  <defs>
                    <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse">
                      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="300" fill="url(#grid)" />
                  
                  <line x1="0" y1="150" x2="300" y2="150" stroke="#374151" strokeWidth="2" />
                  <line x1="150" y1="0" x2="150" y2="300" stroke="#374151" strokeWidth="2" />
                  
                  {[-8, -4, 0, 4, 8].map(x => (
                    <g key={x}>
                      <line 
                        x1={(x + 10) * 15} 
                        y1="145" 
                        x2={(x + 10) * 15} 
                        y2="155" 
                        stroke="#374151" 
                        strokeWidth="1"
                      />
                      <text 
                        x={(x + 10) * 15} 
                        y="170" 
                        textAnchor="middle" 
                        fontSize="10" 
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
                    strokeWidth="3"
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
                              r="6"
                              fill="#ef4444"
                              stroke="white"
                              strokeWidth="2"
                              className="drop-shadow-lg"
                            />
                            <text
                              x={(sol + 10) * 15}
                              y="140"
                              textAnchor="middle"
                              fontSize="12"
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
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  {(() => {
                    const { discriminant, solutions } = calculateDiscriminantAndSolutions();
                    return (
                      <div className="space-y-2 text-sm">
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
                        <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                          <p className="text-blue-800 text-xs font-medium">
                            💡 <strong>Astuce :</strong> Les points rouges montrent où f(x) = 0. 
                            C'est là que la parabole coupe l'axe des abscisses !
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl border-2 border-blue-300 mb-4">
              <h4 className="font-bold text-blue-800 mb-2">🎯 Point clé à retenir :</h4>
              <p className="text-blue-700">
                <strong>Résoudre</strong> f(x) = 0 revient à trouver les <strong>intersections</strong> 
                de la parabole avec l'axe des abscisses. Le discriminant nous dit combien il y en a !
              </p>
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
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">🎯 Principe général</h3>
            <div className="text-center space-y-3">
              <div className="text-lg text-gray-700">
                Pour résoudre <span className="font-mono text-blue-600">ax² + bx + c = 0</span>, on utilise le discriminant :
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-blue-300">
                <div className="text-2xl font-bold font-mono text-blue-600">Δ = b² - 4ac</div>
              </div>
              <div className="text-lg text-gray-700">
                Le <strong>signe de Δ</strong> détermine le nombre et la nature des solutions
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-300">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-green-800">Cas 1 : Δ {'>'} 0 (positif)</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-green-700 mb-4 text-xl">🎯 Conclusion</h4>
                <div className="bg-white p-4 rounded-lg border border-green-300">
                  <div className="text-center text-lg font-bold text-green-800 mb-3">
                    Deux solutions distinctes
                  </div>
                  <div className="text-gray-600 text-center">
                    La parabole coupe l'axe des x en 2 points
                  </div>
                </div>
                
                <h4 className="font-bold text-green-700 mb-3 mt-4">📝 Pourquoi ?</h4>
                <div className="text-gray-700 space-y-2 text-sm">
                  <div>• Δ {'>'} 0 ⟹ √Δ existe et est positif</div>
                  <div>• On peut calculer -b ± √Δ</div>
                  <div>• Cela donne 2 valeurs différentes</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-green-700 mb-4 text-xl">🔧 Formules</h4>
                <div className="bg-white p-4 rounded-lg border border-green-300">
                  <div className="space-y-3">
                    <div className="text-center border-b border-green-200 pb-2">
                      <div className="font-bold text-green-800">Solutions :</div>
                    </div>
                    <div className="space-y-2 font-mono text-center text-gray-800">
                      <div className="bg-green-100 p-2 rounded">
                        x₁ = <span className="text-red-600">(-b + √Δ)</span> / (2a)
                      </div>
                      <div className="bg-green-100 p-2 rounded">
                        x₂ = <span className="text-red-600">(-b - √Δ)</span> / (2a)
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-bold text-green-700 mb-3 mt-4">🧮 Exemple</h4>
                <div className="bg-white p-4 rounded-lg border border-green-300">
                  <div className="font-mono text-center mb-2 text-blue-600">x² - 5x + 6 = 0</div>
                  <div className="text-sm space-y-1 text-gray-800">
                    <div>Δ = (-5)² - 4(1)(6) = 25 - 24 = 1</div>
                    <div>√Δ = √1 = 1</div>
                    <div>x₁ = (5 + 1)/2 = 3</div>
                    <div>x₂ = (5 - 1)/2 = 2</div>
                    <div className="font-bold text-green-600">Solutions : x = 2 ou x = 3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-300">
            <div className="flex items-center mb-6">
              <Circle className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-2xl font-bold text-yellow-800">Cas 2 : Δ = 0 (nul)</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-yellow-700 mb-4 text-xl">🎯 Conclusion</h4>
                <div className="bg-white p-4 rounded-lg border border-yellow-300">
                  <div className="text-center text-lg font-bold text-yellow-800 mb-3">
                    Une solution double
                  </div>
                  <div className="text-gray-600 text-center">
                    La parabole touche l'axe des x en 1 point
                  </div>
                </div>
                
                <h4 className="font-bold text-yellow-700 mb-3 mt-4">📝 Pourquoi ?</h4>
                <div className="text-gray-700 space-y-2 text-sm">
                  <div>• Δ = 0 ⟹ √Δ = 0</div>
                  <div>• -b + √Δ = -b - √Δ = -b</div>
                  <div>• Une seule solution (comptée double)</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-yellow-700 mb-4 text-xl">🔧 Formule</h4>
                <div className="bg-white p-4 rounded-lg border border-yellow-300">
                  <div className="space-y-3">
                    <div className="text-center border-b border-yellow-200 pb-2">
                      <div className="font-bold text-yellow-800">Solution :</div>
                    </div>
                    <div className="font-mono text-center text-gray-800">
                      <div className="bg-yellow-100 p-2 rounded">
                        x = <span className="text-red-600">-b</span> / (2a)
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-bold text-yellow-700 mb-3 mt-4">🧮 Exemple</h4>
                <div className="bg-white p-4 rounded-lg border border-yellow-300">
                  <div className="font-mono text-center mb-2 text-blue-600">x² - 4x + 4 = 0</div>
                  <div className="text-sm space-y-1 text-gray-800">
                    <div>Δ = (-4)² - 4(1)(4) = 16 - 16 = 0</div>
                    <div>x = -(-4)/(2×1) = 4/2 = 2</div>
                    <div className="font-bold text-yellow-600">Solution double : x = 2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-300">
            <div className="flex items-center mb-6">
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-2xl font-bold text-red-800">Cas 3 : Δ {'<'} 0 (négatif)</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-red-700 mb-4 text-xl">🎯 Conclusion</h4>
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <div className="text-center text-lg font-bold text-red-800 mb-3">
                    Aucune solution réelle
                  </div>
                  <div className="text-gray-600 text-center">
                    La parabole ne coupe pas l'axe des x
                  </div>
                </div>
                
                <h4 className="font-bold text-red-700 mb-3 mt-4">📝 Pourquoi ?</h4>
                <div className="text-gray-700 space-y-2 text-sm">
                  <div>• Δ {'<'} 0 ⟹ √Δ n'existe pas dans ℝ</div>
                  <div>• Impossible de calculer -b ± √Δ</div>
                  <div>• Aucune solution réelle</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-red-700 mb-4 text-xl">🚫 Conclusion</h4>
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <div className="text-center text-lg font-bold text-red-800">
                    Pas de solution dans ℝ
                  </div>
                  <div className="text-sm text-gray-600 text-center mt-2">
                    L'équation n'a pas de solution réelle
                  </div>
                </div>
                
                <h4 className="font-bold text-red-700 mb-3 mt-4">🧮 Exemple</h4>
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <div className="font-mono text-center mb-2 text-blue-600">x² + 2x + 5 = 0</div>
                  <div className="text-sm space-y-1 text-gray-800">
                    <div>Δ = (2)² - 4(1)(5) = 4 - 20 = -16</div>
                    <div>Δ {'<'} 0 ⟹ √Δ n'existe pas</div>
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
      id: 'calculator',
      title: 'Calculateur Interactif 🧮',
      icon: '🔢',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Calculateur de solutions</h3>
            <p className="text-lg">
              Modifiez les coefficients pour voir les solutions en temps réel !
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 mb-4">⚙️ Paramètres</h4>
            <div className="text-center mb-4">
              <div className="font-mono text-lg font-bold text-blue-600">
                {calculatorParams.a}x² + {calculatorParams.b}x + {calculatorParams.c} = 0
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">a = {calculatorParams.a}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={calculatorParams.a}
                  onChange={(e) => setCalculatorParams(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">b = {calculatorParams.b}</label>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={calculatorParams.b}
                  onChange={(e) => setCalculatorParams(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">c = {calculatorParams.c}</label>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                  value={calculatorParams.c}
                  onChange={(e) => setCalculatorParams(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              {(() => {
                const { discriminant, solutions, solutionType } = calculateSolutions(
                  calculatorParams.a, calculatorParams.b, calculatorParams.c
                );
                return (
                  <div className="space-y-3">
                    <div className="text-center font-bold text-gray-800 text-lg">Résultats</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-600">Discriminant</div>
                        <div className={`font-bold text-lg ${
                          discriminant > 0 ? 'text-green-600' : 
                          discriminant === 0 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          Δ = {discriminant}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-600">Type</div>
                        <div className={`font-bold text-sm ${
                          discriminant > 0 ? 'text-green-600' : 
                          discriminant === 0 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {solutionType}
                        </div>
                      </div>
                    </div>
                    {solutions.length > 0 && (
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-600 mb-2">Solutions</div>
                        <div className="font-mono font-bold text-blue-600">
                          {solutions.map((s, i) => `x${solutions.length > 1 ? i + 1 : ''} = ${s.toFixed(3)}`).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
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
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement pratique</h3>
            <p className="text-lg">
              Résolvez ces équations étape par étape !
            </p>
          </div>

          <div className="grid gap-6">
            {resolutionExercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
                id={`resolution-${index}`}
                title={`Exercice ${index + 1}`}
                question={`Résoudre l'équation : ${exercise.equation}`}
                options={[
                  {
                    id: 'step1',
                    text: `Étape 1: Identifier a = ${exercise.a}, b = ${exercise.b}, c = ${exercise.c}`,
                    isCorrect: false
                  },
                  {
                    id: 'step2',
                    text: `Étape 2: Calculer Δ = b² - 4ac = ${exercise.discriminant}`,
                    isCorrect: false
                  },
                  {
                    id: 'solution',
                    text: `Réponse: ${exercise.solutionType}${exercise.solutions.length > 0 ? ` (${exercise.solutions.join(', ')})` : ''}`,
                    isCorrect: true,
                    explanation: `Étapes complètes: 1) a=${exercise.a}, b=${exercise.b}, c=${exercise.c} 2) Δ=${exercise.discriminant} 3) ${exercise.solutionType}`
                  }
                ]}
                xp={20}
                onComplete={() => {}}
                completed={false}
              />
            ))}
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
        previous: { href: '/chapitre/equations-second-degre', text: 'Introduction' },
        next: { href: '/chapitre/equations-second-degre-forme-canonique', text: 'Forme canonique' }
      }}
    />
  );
} 