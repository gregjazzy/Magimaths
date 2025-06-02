'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Target, Trophy, CheckCircle, XCircle, Circle } from 'lucide-react';
import Link from 'next/link';

export default function ResolutionPage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<{[key: string]: any}>({});
  const [exerciseValidated, setExerciseValidated] = useState<{[key: string]: boolean}>({});
  const [exerciseCorrect, setExerciseCorrect] = useState<{[key: string]: boolean}>({});

  // États pour le graphique interactif
  const [graphParams, setGraphParams] = useState({ a: 1, b: -5, c: 6 });

  // États pour le calculateur de solutions
  const [calculatorParams, setCalculatorParams] = useState({ a: 1, b: -3, c: 2 });

  // Exercices de résolution
  const resolutionExercises = [
    {
      equation: "x² - 5x + 6 = 0",
      a: 1, b: -5, c: 6,
      discriminant: 1, // (-5)² - 4(1)(6) = 25 - 24 = 1
      solutions: [2, 3],
      solutionType: "deux solutions"
    },
    {
      equation: "x² - 4x + 4 = 0", 
      a: 1, b: -4, c: 4,
      discriminant: 0, // (-4)² - 4(1)(4) = 16 - 16 = 0
      solutions: [2],
      solutionType: "solution double"
    },
    {
      equation: "x² + 2x + 5 = 0",
      a: 1, b: 2, c: 5, 
      discriminant: -16, // (2)² - 4(1)(5) = 4 - 20 = -16
      solutions: [],
      solutionType: "aucune solution"
    }
  ];

  const handleSectionComplete = (sectionName: string, xp: number) => {
    if (!completedSections.includes(sectionName)) {
      setCompletedSections(prev => [...prev, sectionName]);
      setXpEarned(prev => prev + xp);
    }
  };

  const validateExercise = (exerciseId: string, correctAnswer: any) => {
    const userAnswer = exerciseAnswers[exerciseId];
    if (!userAnswer) return;

    // Validation complète : discriminant et solutions
    const isCorrect = (
      userAnswer.discriminant === correctAnswer.discriminant &&
      JSON.stringify(userAnswer.solutions?.sort()) === JSON.stringify(correctAnswer.solutions?.sort()) &&
      userAnswer.solutionType === correctAnswer.solutionType
    );
    
    setExerciseValidated(prev => ({ ...prev, [exerciseId]: true }));
    setExerciseCorrect(prev => ({ ...prev, [exerciseId]: isCorrect }));

    if (isCorrect) {
      setXpEarned(prev => prev + 20);
    }
  };

  // Bonus XP quand le chapitre est terminé
  useEffect(() => {
    if (completedSections.length >= 4 && !chapterCompleted) {
      setChapterCompleted(true);
      setXpEarned(prev => prev + 50);
    }
  }, [completedSections.length, chapterCompleted]);

  // Calcul du discriminant et des solutions en temps réel
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

  // Calcul des solutions pour le calculateur interactif
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

  // Génération de la parabole
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

  // États pour les techniques avancées
  const [advancedType, setAdvancedType] = useState<'bicarree' | 'inverse' | 'racine'>('bicarree');
  const [bicarreeParams, setBicarreeParams] = useState({ a: 1, b: 0, c: -4 });

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
                <h1 className="text-lg font-bold text-gray-900">Résolution d'Équations du Second Degré</h1>
                <p className="text-sm text-gray-600">Discriminant & Solutions • {xpEarned} XP gagnés</p>
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
            <div className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">4. Résolution</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <Link href="/chapitre/equations-second-degre-techniques-avancees" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">5. Techniques</span>
            </Link>
            <Link href="/chapitre/equations-second-degre-tableaux-signes" className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-center">
              <span className="text-sm">6. Inéquations</span>
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
        
        {/* Section 1: Introduction au discriminant */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Découverte</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Résoudre une Équation du Second Degré 🎯
            </h2>
            <p className="text-xl text-gray-600">Le Discriminant Δ (Delta) : la clé pour résoudre</p>
          </div>

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
              
              {/* Contrôles interactifs */}
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

              {/* Graphique avec parabole et solutions */}
              <div className="bg-white p-4 rounded-xl border-2 border-gray-300">
                <div className="text-center mb-3">
                  <h4 className="font-bold text-gray-800">🎯 Solutions = Intersections avec l'axe des x</h4>
                  <p className="text-sm text-gray-600">Quand f(x) = 0, on trouve les solutions !</p>
                </div>
                
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
                  
                  {/* Graduations sur l'axe des x */}
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
                  
                  {/* Parabole */}
                  <polyline
                    points={generateParabola()}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    className="drop-shadow-sm"
                  />
                  
                  {/* Points d'intersection avec l'axe des x (solutions) */}
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
                
                {/* Informations sur le discriminant et les solutions */}
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
            
            <button
              onClick={() => handleSectionComplete('intro-discriminant', 30)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('intro-discriminant')
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections.includes('intro-discriminant') ? '✓ Compris ! +30 XP' : 'J\'ai compris ! +30 XP'}
            </button>
          </div>
        </section>

        {/* Section 2: Théorie - Les 3 cas selon le signe du discriminant */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Théorie</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les 3 Cas de Résolution 📚
            </h2>
            <p className="text-xl text-gray-600">Comprendre les formules selon le signe de Δ</p>
          </div>

          <div className="space-y-8">
            {/* Principe général */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-300">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                🎯 Principe général
              </h3>
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

            {/* Cas 1: Δ > 0 */}
            <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-300">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-green-800">Cas 1 : Δ &gt; 0 (positif)</h3>
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
                    <div>• Δ &gt; 0 ⟹ √Δ existe et est positif</div>
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
                      <div className="text-xs text-gray-600 text-center mt-2">
                        Note : x₁ et x₂ sont les deux solutions distinctes
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-green-700 mb-3 mt-4">🧮 Exemple</h4>
                  <div className="bg-white p-4 rounded-lg border border-green-300">
                    <div className="font-mono text-center mb-2 text-blue-600">x² - 5x + 6 = 0</div>
                    <div className="text-sm space-y-1 text-gray-800">
                      <div><span className="text-gray-900">Δ = (-5)² - 4(1)(6) = 25 - 24 = 1</span></div>
                      <div><span className="text-gray-900">√Δ = √1 = 1</span></div>
                      <div><span className="text-gray-900">x₁ = (5 + 1)/2 = 3</span></div>
                      <div><span className="text-gray-900">x₂ = (5 - 1)/2 = 2</span></div>
                      <div className="font-bold text-green-600">Solutions : x = 2 ou x = 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cas 2: Δ = 0 */}
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
                      La parabole est tangente à l'axe des x
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-yellow-700 mb-3 mt-4">📝 Pourquoi ?</h4>
                  <div className="text-gray-700 space-y-2 text-sm">
                    <div>• Δ = 0 ⟹ √Δ = √0 = 0</div>
                    <div>• Les formules donnent : x₁ = x₂</div>
                    <div>• Une seule valeur (comptée double)</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-yellow-700 mb-4 text-xl">🔧 Formule</h4>
                  <div className="bg-white p-4 rounded-lg border border-yellow-300">
                    <div className="space-y-3">
                      <div className="text-center border-b border-yellow-200 pb-2">
                        <div className="font-bold text-yellow-800">Solution double :</div>
                      </div>
                      <div className="font-mono text-center text-gray-800">
                        <div className="bg-yellow-100 p-3 rounded text-lg">
                          x = -b / (2a)
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 text-center mt-2">
                        Note : x₁ = x₂ = -b/(2a)
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-yellow-700 mb-3 mt-4">🧮 Exemple</h4>
                  <div className="bg-white p-4 rounded-lg border border-yellow-300">
                    <div className="font-mono text-center mb-2 text-blue-600">x² - 4x + 4 = 0</div>
                    <div className="text-sm space-y-1 text-gray-800">
                      <div><span className="text-gray-900">Δ = (-4)² - 4(1)(4) = 16 - 16 = 0</span></div>
                      <div><span className="text-gray-900">x = -(-4)/(2×1) = 4/2 = 2</span></div>
                      <div className="font-bold text-yellow-600">Solution double : x = 2</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cas 3: Δ < 0 */}
            <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-300">
              <div className="flex items-center mb-6">
                <XCircle className="h-8 w-8 text-red-600 mr-3" />
                <h3 className="text-2xl font-bold text-red-800">Cas 3 : Δ &lt; 0 (négatif)</h3>
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
                    <div>• Δ &lt; 0 ⟹ √Δ n'existe pas dans ℝ</div>
                    <div>• Impossible de calculer les formules</div>
                    <div>• L'ensemble solution est vide : ∅</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-red-700 mb-4 text-xl">🚫 Pas de formule</h4>
                  <div className="bg-white p-4 rounded-lg border border-red-300">
                    <div className="space-y-3">
                      <div className="text-center border-b border-red-200 pb-2">
                        <div className="font-bold text-red-800">Résultat :</div>
                      </div>
                      <div className="text-center text-gray-800">
                        <div className="bg-red-100 p-3 rounded text-lg font-bold text-red-600">
                          Aucune solution réelle
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 text-center mt-2">
                        Notation : S = ∅ (ensemble vide)
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-red-700 mb-3 mt-4">🧮 Exemple</h4>
                  <div className="bg-white p-4 rounded-lg border border-red-300">
                    <div className="font-mono text-center mb-2 text-blue-600">x² + 2x + 5 = 0</div>
                    <div className="text-sm space-y-1 text-gray-800">
                      <div><span className="text-gray-900">Δ = (2)² - 4(1)(5) = 4 - 20 = -16</span></div>
                      <div><span className="text-gray-900">Δ &lt; 0 ⟹ √(-16) impossible dans ℝ</span></div>
                      <div className="font-bold text-red-600">Aucune solution réelle</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Récapitulatif visuel */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl border-2 border-gray-400">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                📋 Récapitulatif des 3 cas
              </h3>
              
              <div className="overflow-hidden rounded-xl border-2 border-gray-400 shadow-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="p-4 text-left font-bold">Signe de Δ</th>
                      <th className="p-4 text-left font-bold">Nombre de solutions</th>
                      <th className="p-4 text-left font-bold">Formules</th>
                      <th className="p-4 text-left font-bold">Graphique</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-green-50 border-b border-gray-200">
                      <td className="p-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-bold text-green-800">Δ &gt; 0</span>
                        </div>
                      </td>
                      <td className="p-4 text-green-700 font-medium">2 solutions distinctes</td>
                      <td className="p-4 font-mono text-sm text-gray-800">
                        x₁ = (-b + √Δ) / (2a)<br/>
                        x₂ = (-b - √Δ) / (2a)
                      </td>
                      <td className="p-4 text-green-600">2 intersections avec l'axe des x</td>
                    </tr>
                    <tr className="bg-yellow-50 border-b border-gray-200">
                      <td className="p-4">
                        <div className="flex items-center">
                          <Circle className="h-5 w-5 text-yellow-600 mr-2" />
                          <span className="font-bold text-yellow-800">Δ = 0</span>
                        </div>
                      </td>
                      <td className="p-4 text-yellow-700 font-medium">1 solution double</td>
                      <td className="p-4 font-mono text-sm text-gray-800">
                        x = -b / (2a)
                      </td>
                      <td className="p-4 text-yellow-600">Tangente à l'axe des x</td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          <span className="font-bold text-red-800">Δ &lt; 0</span>
                        </div>
                      </td>
                      <td className="p-4 text-red-700 font-medium">Aucune solution réelle</td>
                      <td className="p-4 font-mono text-sm text-red-500">
                        Pas de formule
                      </td>
                      <td className="p-4 text-red-600">Aucune intersection</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('theorie-3-cas', 35)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('theorie-3-cas')
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {completedSections.includes('theorie-3-cas') ? '✓ Théorie maîtrisée ! +35 XP' : 'J\'ai compris la théorie ! +35 XP'}
            </button>
          </div>
        </section>

        {/* Section calculateur interactif de solutions */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Calculateur</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Calculateur de Solutions 🧮
            </h2>
            <p className="text-xl text-gray-600">Entrez vos coefficients et voyez le calcul complet !</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Saisie des coefficients */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl border-2 border-blue-300 mb-6">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                🎯 Entrez les coefficients de votre équation ax² + bx + c = 0
              </h3>
              
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Coefficient a
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={calculatorParams.a}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 1;
                      setCalculatorParams(prev => ({ ...prev, a: value }));
                    }}
                    className="w-full px-4 py-3 text-xl font-bold text-center border-3 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                  />
                  <div className="text-sm text-gray-500 mt-1">a ≠ 0</div>
                </div>
                
                <div className="text-center">
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Coefficient b
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={calculatorParams.b}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setCalculatorParams(prev => ({ ...prev, b: value }));
                    }}
                    className="w-full px-4 py-3 text-xl font-bold text-center border-3 border-green-300 rounded-xl focus:border-green-500 focus:outline-none bg-white"
                  />
                </div>
                
                <div className="text-center">
                  <label className="block text-lg font-bold text-gray-700 mb-2">
                    Coefficient c
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={calculatorParams.c}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setCalculatorParams(prev => ({ ...prev, c: value }));
                    }}
                    className="w-full px-4 py-3 text-xl font-bold text-center border-3 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none bg-white"
                  />
                </div>
              </div>
              
              <div className="text-center mt-4">
                <div className="inline-block bg-white px-6 py-3 rounded-xl border-2 border-gray-300 shadow-sm">
                  <div className="text-2xl font-mono font-bold text-blue-600">
                    {calculatorParams.a !== 0 && (
                      <>
                        {calculatorParams.a === 1 ? '' : calculatorParams.a === -1 ? '-' : calculatorParams.a}x²
                        {calculatorParams.b > 0 && ' + '}
                        {calculatorParams.b < 0 && ' - '}
                        {calculatorParams.b !== 0 && Math.abs(calculatorParams.b) !== 1 && Math.abs(calculatorParams.b)}
                        {calculatorParams.b === 1 && '+'}
                        {calculatorParams.b === -1 && ''}
                        {calculatorParams.b !== 0 && 'x'}
                        {calculatorParams.c > 0 && ' + '}
                        {calculatorParams.c < 0 && ' - '}
                        {calculatorParams.c !== 0 && Math.abs(calculatorParams.c)}
                        {' = 0'}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Calcul automatique étape par étape */}
            {calculatorParams.a !== 0 && (
              <div className="space-y-6">
                {(() => {
                  const { discriminant, solutions, solutionType } = calculateSolutions(
                    calculatorParams.a, 
                    calculatorParams.b, 
                    calculatorParams.c
                  );

                  return (
                    <>
                      {/* Calcul du discriminant */}
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl">
                        <h4 className="text-xl font-bold text-blue-800 mb-4">
                          📐 Calcul du discriminant
                        </h4>
                        <div className="space-y-3 text-lg">
                          <div className="bg-white p-4 rounded-lg border border-blue-200">
                            <div className="font-mono text-center text-gray-800">
                              Δ = b² - 4ac = ({calculatorParams.b})² - 4×({calculatorParams.a})×({calculatorParams.c})
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                            <div className="font-mono text-center text-xl font-bold">
                              Δ = {discriminant}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Les 3 cas possibles */}
                      <div className="bg-gray-50 border-2 border-gray-300 p-6 rounded-2xl">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                          🔍 Les 3 cas selon le signe de Δ
                        </h4>
                        
                        <div className="space-y-4">
                          {/* Cas 1: Δ > 0 */}
                          <div className={`p-4 rounded-xl border-2 transition-all ${
                            discriminant > 0 ? 'bg-green-100 border-green-400 shadow-lg' : 'bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${discriminant > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="font-bold text-green-800">Si Δ &gt; 0</span>
                              </div>
                              <span className="text-green-700 font-medium">2 solutions distinctes</span>
                            </div>
                            <div className="mt-2 space-y-1 text-sm font-mono text-gray-700">
                              <div>x₁ = (-b + √Δ) / (2a)</div>
                              <div>x₂ = (-b - √Δ) / (2a)</div>
                            </div>
                          </div>

                          {/* Cas 2: Δ = 0 */}
                          <div className={`p-4 rounded-xl border-2 transition-all ${
                            discriminant === 0 ? 'bg-yellow-100 border-yellow-400 shadow-lg' : 'bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${discriminant === 0 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                                <span className="font-bold text-yellow-800">Si Δ = 0</span>
                              </div>
                              <span className="text-yellow-700 font-medium">1 solution double</span>
                            </div>
                            <div className="mt-2 text-sm font-mono text-gray-700">
                              <div>x = -b / (2a)</div>
                            </div>
                          </div>

                          {/* Cas 3: Δ < 0 */}
                          <div className={`p-4 rounded-xl border-2 transition-all ${
                            discriminant < 0 ? 'bg-red-100 border-red-400 shadow-lg' : 'bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${discriminant < 0 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                <span className="font-bold text-red-800">Si Δ &lt; 0</span>
                              </div>
                              <span className="text-red-700 font-medium">Aucune solution réelle</span>
                            </div>
                            <div className="mt-2 text-sm font-mono text-gray-700">
                              <div>Pas de formule (√Δ impossible)</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Application du cas correspondant */}
                      <div className={`border-l-4 p-6 rounded-r-xl ${
                        discriminant > 0 ? 'bg-green-50 border-green-400' :
                        discriminant === 0 ? 'bg-yellow-50 border-yellow-400' :
                        'bg-red-50 border-red-400'
                      }`}>
                        <h4 className={`text-xl font-bold mb-4 ${
                          discriminant > 0 ? 'text-green-800' :
                          discriminant === 0 ? 'text-yellow-800' :
                          'text-red-800'
                        }`}>
                          🎯 Application : {solutionType}
                        </h4>

                        {solutions.length > 0 ? (
                          <div className="space-y-4">
                            {solutions.length === 2 ? (
                              <>
                                <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="text-center">
                                      <div className="font-bold text-green-700 mb-2">Solution x₁ :</div>
                                      <div className="space-y-1 text-gray-800 font-mono text-sm">
                                        <div>x₁ = (-({calculatorParams.b}) + √{discriminant}) / (2×{calculatorParams.a})</div>
                                        <div>x₁ = ({-calculatorParams.b} + {Math.sqrt(discriminant).toFixed(2)}) / {2 * calculatorParams.a}</div>
                                        <div className="font-bold text-green-600 text-lg">x₁ = {solutions[0].toFixed(3)}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="text-center">
                                      <div className="font-bold text-green-700 mb-2">Solution x₂ :</div>
                                      <div className="space-y-1 text-gray-800 font-mono text-sm">
                                        <div>x₂ = (-({calculatorParams.b}) - √{discriminant}) / (2×{calculatorParams.a})</div>
                                        <div>x₂ = ({-calculatorParams.b} - {Math.sqrt(discriminant).toFixed(2)}) / {2 * calculatorParams.a}</div>
                                        <div className="font-bold text-green-600 text-lg">x₂ = {solutions[1].toFixed(3)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="bg-white p-4 rounded-lg border-2 border-yellow-300">
                                <div className="text-center">
                                  <div className="font-bold text-yellow-700 mb-2">Calcul de la solution double :</div>
                                  <div className="space-y-1 text-gray-800 font-mono">
                                    <div>x = -({calculatorParams.b}) / (2×{calculatorParams.a})</div>
                                    <div>x = {-calculatorParams.b} / {2 * calculatorParams.a}</div>
                                    <div className="font-bold text-yellow-600 text-lg">x = {solutions[0].toFixed(3)}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-white p-4 rounded-lg border-2 border-red-300">
                            <div className="text-center">
                              <div className="text-red-700 font-medium">
                                Comme Δ = {discriminant} &lt; 0, il n'y a pas de solution réelle car √{discriminant} n'existe pas dans ℝ.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Résultat final concis */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl text-center">
                        <div className="text-2xl font-bold mb-2">🎉 Résultat</div>
                        {solutions.length > 0 ? (
                          <div className="text-lg font-medium">
                            {solutions.length === 2 ? 
                              `Solutions : x = ${solutions[0].toFixed(3)} et x = ${solutions[1].toFixed(3)}` :
                              `Solution double : x = ${solutions[0].toFixed(3)}`
                            }
                          </div>
                        ) : (
                          <div className="text-lg font-medium">
                            Aucune solution réelle
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('calculateur-solutions', 40)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('calculateur-solutions')
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {completedSections.includes('calculateur-solutions') ? '✓ Calculateur maîtrisé ! +40 XP' : 'J\'ai testé le calculateur ! +40 XP'}
            </button>
          </div>
        </section>

        {/* Section 4: Exercices de résolution */}
        <section className="bg-white rounded-3xl p-7 shadow-xl border border-gray-200">
          <div className="text-center mb-7">
            <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Entraînement</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exercices de Résolution 
            </h2>
            <p className="text-xl text-gray-600">Entraînez-vous avec ces 3 exercices progressifs</p>
          </div>

          <div className="space-y-8">
            {resolutionExercises.map((exercise, index) => {
              const exerciseId = `resolution-${index}`;
              const [showSolution, setShowSolution] = useState(false);
              
              return (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-200">
                  <div className="text-center mb-6">
                    <div className="inline-block bg-orange-100 px-4 py-2 rounded-full mb-3">
                      <span className="font-bold text-orange-800">Exercice {index + 1}</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-gray-800 mb-2">
                      {exercise.equation}
                    </div>
                    <div className="text-lg text-gray-600">
                      Résoudre cette équation du second degré
                    </div>
                  </div>

                  {/* Énoncé avec aide */}
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-300 mb-6">
                    <h4 className="font-bold text-gray-800 mb-3">📝 Méthode recommandée :</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="font-bold text-blue-800">1. Identifier</div>
                        <div className="text-blue-600">a, b, c</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="font-bold text-purple-800">2. Calculer</div>
                        <div className="text-purple-600">Δ = b² - 4ac</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="font-bold text-green-800">3. Analyser</div>
                        <div className="text-green-600">Signe de Δ</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <div className="font-bold text-red-800">4. Appliquer</div>
                        <div className="text-red-600">Formules</div>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="text-center space-x-4 mb-6">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        showSolution 
                          ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {showSolution ? '📚 Masquer la solution' : '🔍 Voir la solution détaillée'}
                    </button>
                    
                    <button
                      onClick={() => handleSectionComplete(`exercice-${index}`, 20)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                        completedSections.includes(`exercice-${index}`)
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {completedSections.includes(`exercice-${index}`) ? '✓ Exercice validé ! +20 XP' : 'Valider l\'exercice +20 XP'}
                    </button>
                  </div>

                  {/* Solution détaillée */}
                  {showSolution && (
                    <div className="bg-white p-6 rounded-xl border-2 border-green-300 mt-6">
                      <h4 className="text-xl font-bold text-green-800 mb-4 text-center">
                        📖 Solution détaillée
                      </h4>
                      
                      <div className="space-y-6">
                        {/* Étape 1: Identification */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                          <h5 className="font-bold text-blue-800 mb-2">Étape 1 : Identification des coefficients</h5>
                          <div className="text-gray-800">
                            <div className="font-mono text-lg mb-2">{exercise.equation}</div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-white p-2 rounded border">
                                <div className="text-sm text-gray-600">Coefficient de x²</div>
                                <div className="font-bold text-blue-600">a = {exercise.a}</div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="text-sm text-gray-600">Coefficient de x</div>
                                <div className="font-bold text-green-600">b = {exercise.b}</div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="text-sm text-gray-600">Terme constant</div>
                                <div className="font-bold text-purple-600">c = {exercise.c}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Étape 2: Calcul du discriminant */}
                        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                          <h5 className="font-bold text-purple-800 mb-2">Étape 2 : Calcul du discriminant</h5>
                          <div className="space-y-2 text-gray-800">
                            <div className="font-mono">Δ = b² - 4ac</div>
                            <div className="font-mono">Δ = ({exercise.b})² - 4 × ({exercise.a}) × ({exercise.c})</div>
                            <div className="font-mono">Δ = {exercise.b * exercise.b} - {4 * exercise.a * exercise.c}</div>
                            <div className={`font-mono font-bold text-xl ${
                              exercise.discriminant > 0 ? 'text-green-600' :
                              exercise.discriminant === 0 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              Δ = {exercise.discriminant}
                            </div>
                          </div>
                        </div>

                        {/* Étape 3: Analyse */}
                        <div className={`border-l-4 p-4 rounded-r-lg ${
                          exercise.discriminant > 0 ? 'bg-green-50 border-green-400' :
                          exercise.discriminant === 0 ? 'bg-yellow-50 border-yellow-400' :
                          'bg-red-50 border-red-400'
                        }`}>
                          <h5 className={`font-bold mb-2 ${
                            exercise.discriminant > 0 ? 'text-green-800' :
                            exercise.discriminant === 0 ? 'text-yellow-800' :
                            'text-red-800'
                          }`}>
                            Étape 3 : Analyse du discriminant
                          </h5>
                          <div className="text-gray-800">
                            <div className={`font-bold ${
                              exercise.discriminant > 0 ? 'text-green-600' :
                              exercise.discriminant === 0 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {exercise.discriminant > 0 ? 
                                `Δ = ${exercise.discriminant} > 0` :
                                exercise.discriminant === 0 ?
                                `Δ = ${exercise.discriminant} = 0` :
                                `Δ = ${exercise.discriminant} < 0`
                              }
                            </div>
                            <div className="mt-1">
                              ⟹ L'équation a {exercise.solutionType}
                            </div>
                          </div>
                        </div>

                        {/* Étape 4: Calcul des solutions */}
                        <div className={`border-l-4 p-4 rounded-r-lg ${
                          exercise.solutions.length > 0 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                        }`}>
                          <h5 className={`font-bold mb-3 ${
                            exercise.solutions.length > 0 ? 'text-green-800' : 'text-red-800'
                          }`}>
                            Étape 4 : Calcul des solutions
                          </h5>
                          
                          {exercise.solutions.length > 0 ? (
                            <div className="space-y-4">
                              {exercise.solutions.length === 2 ? (
                                <div>
                                  <div className="text-gray-800 mb-3">
                                    <strong>Formules à utiliser :</strong>
                                    <div className="font-mono bg-white p-2 rounded border mt-1">
                                      x₁ = (-b + √Δ) / (2a) &nbsp;&nbsp;&nbsp; x₂ = (-b - √Δ) / (2a)
                                    </div>
                                  </div>
                                  
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded border">
                                      <div className="font-bold text-green-700 mb-2">Calcul de x₁ :</div>
                                      <div className="space-y-1 text-sm font-mono text-gray-800">
                                        <div>x₁ = (-({exercise.b}) + √{exercise.discriminant}) / (2×{exercise.a})</div>
                                        <div>x₁ = ({-exercise.b} + {Math.sqrt(exercise.discriminant)}) / {2 * exercise.a}</div>
                                        <div>x₁ = {-exercise.b + Math.sqrt(exercise.discriminant)} / {2 * exercise.a}</div>
                                        <div className="font-bold text-green-600 text-lg">x₁ = {exercise.solutions[0]}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-white p-3 rounded border">
                                      <div className="font-bold text-green-700 mb-2">Calcul de x₂ :</div>
                                      <div className="space-y-1 text-sm font-mono text-gray-800">
                                        <div>x₂ = (-({exercise.b}) - √{exercise.discriminant}) / (2×{exercise.a})</div>
                                        <div>x₂ = ({-exercise.b} - {Math.sqrt(exercise.discriminant)}) / {2 * exercise.a}</div>
                                        <div>x₂ = {-exercise.b - Math.sqrt(exercise.discriminant)} / {2 * exercise.a}</div>
                                        <div className="font-bold text-green-600 text-lg">x₂ = {exercise.solutions[1]}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-gray-800 mb-3">
                                    <strong>Formule à utiliser :</strong>
                                    <div className="font-mono bg-white p-2 rounded border mt-1">
                                      x = -b / (2a)
                                    </div>
                                  </div>
                                  
                                  <div className="bg-white p-3 rounded border">
                                    <div className="font-bold text-yellow-700 mb-2">Calcul de la solution double :</div>
                                    <div className="space-y-1 text-sm font-mono text-gray-800">
                                      <div>x = -({exercise.b}) / (2×{exercise.a})</div>
                                      <div>x = {-exercise.b} / {2 * exercise.a}</div>
                                      <div className="font-bold text-yellow-600 text-lg">x = {exercise.solutions[0]}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-800">
                              <div className="bg-white p-3 rounded border">
                                <div className="text-red-700">
                                  Comme Δ = {exercise.discriminant} &lt; 0, il n'existe pas de solution réelle.
                                  <br/>
                                  En effet, il est impossible de calculer √{exercise.discriminant} dans l'ensemble des réels.
                                </div>
                                <div className="font-bold text-red-600 mt-2">
                                  Ensemble solution : S = ∅
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Conclusion */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl text-center">
                          <div className="text-lg font-bold mb-2">🎉 Conclusion</div>
                          {exercise.solutions.length > 0 ? (
                            <div>
                              L'équation <span className="font-mono">{exercise.equation}</span> admet
                              {exercise.solutions.length === 2 ? (
                                <div className="font-bold text-lg">
                                  deux solutions : x = {exercise.solutions[0]} et x = {exercise.solutions[1]}
                                </div>
                              ) : (
                                <div className="font-bold text-lg">
                                  une solution double : x = {exercise.solutions[0]}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="font-bold text-lg">
                              L'équation <span className="font-mono">{exercise.equation}</span> n'admet aucune solution réelle
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('exercices-resolution', 60)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('exercices-resolution')
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {completedSections.includes('exercices-resolution') ? '✓ Tous les exercices terminés ! +60 XP' : 'Finaliser les exercices +60 XP'}
            </button>
          </div>
        </section>

        {/* Section 5: Techniques Avancées - Changement de Variable */}
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
                          <div><strong>1. Changement :</strong> X = x² ⟹ X⁴ devient X²</div>
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

            {/* Calculateur interactif */}
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
                          }
                          // Si X < 0, pas de solution réelle
                        });
                      } else if (deltaX === 0) {
                        const X = -b / (2 * a);
                        solutionsX = [X];
                        if (X > 0) {
                          solutionsFinal.push(Math.sqrt(X));
                          solutionsFinal.push(-Math.sqrt(X));
                        } else if (X === 0) {
                          solutionsFinal.push(0);
                        }
                      }
                      
                      return (
                        <div className="space-y-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="font-bold text-green-800 mb-2">1. Changement : X = x²</div>
                            <div className="font-mono text-gray-800">{a}X² {b >= 0 ? '+' : ''}{b}X {c >= 0 ? '+' : ''}{c} = 0</div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="font-bold text-blue-800 mb-2">2. Discriminant : Δ = {deltaX}</div>
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
                            {solutionsFinal.length > 0 ? (
                              <div className="text-gray-800">
                                <strong>Solutions :</strong> x ∈ {'{' + solutionsFinal.map(s => s.toFixed(3)).sort((a, b) => parseFloat(a) - parseFloat(b)).join(', ') + '}'}
                              </div>
                            ) : (
                              <div className="text-red-600">Aucune solution réelle</div>
                            )}
                          </div>
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
          </div>

          <div className="text-center mt-7">
            <button
              onClick={() => handleSectionComplete('techniques-avancees', 50)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('techniques-avancees')
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {completedSections.includes('techniques-avancees') ? '✓ Techniques maîtrisées ! +50 XP' : 'J\'ai exploré les techniques ! +50 XP'}
            </button>
          </div>
        </section>

        {/* Section récapitulatif final */}
        {completedSections.length >= 4 && (
          <section className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-3xl p-7 shadow-xl text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-4">Bravo ! Tu maîtrises la résolution !</h2>
            <p className="text-xl mb-6">Tu sais maintenant résoudre toutes les équations du second degré !</p>
            
            {chapterCompleted && (
              <div className="bg-yellow-400/20 border-2 border-yellow-300 p-4 rounded-2xl mb-6">
                <div className="text-2xl font-bold text-yellow-200 mb-2">🎖️ Chapitre Complet !</div>
                <div className="text-lg text-yellow-100">Bonus final : +50 XP</div>
              </div>
            )}
            
            <div className="bg-white/20 p-6 rounded-2xl inline-block">
              <div className="text-4xl font-bold">{xpEarned} XP</div>
              <div className="text-lg">Total gagné</div>
              <div className="text-sm mt-2 text-white/80">
                Sections: {30 + 35 + 40 + 60} XP + Exercices (20×3) + Bonus: 50 XP
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/chapitre/equations-second-degre"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
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