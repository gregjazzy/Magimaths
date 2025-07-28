'use client';

import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

export default function TableauxSignesPage() {
  const [inequationParams, setInequationParams] = useState({ a: 1, b: -3, c: 2 });
  const [inequationType, setInequationType] = useState<'>' | '<' | '>=' | '<='>('<');
  const [showTableau, setShowTableau] = useState(false);

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
    
    if (delta > 0) {
      const [x1, x2] = solutions;
      if (a > 0) {
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
      if ((a > 0 && (inequationType === '>' || inequationType === '>=')) ||
          (a < 0 && (inequationType === '<' || inequationType === '<='))) {
        intervals = ['ℝ'];
      } else {
        intervals = ['∅'];
      }
    }
    
    return { solutions, intervals, delta };
  };

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

  const sections = [
    {
      id: 'intro',
      title: 'Tableaux de Signe & Inéquations 📊',
      icon: '📈',
      content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-300">
              <h3 className="text-lg font-bold text-center text-gray-800 mb-6">
                📏 Règles du signe selon Δ puis a
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                  <h4 className="text-lg font-bold text-center text-gray-800 mb-6">
                  📊 Cas 1 : Δ {'>'} 0 (Deux racines distinctes)
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="font-bold text-green-800 mb-2">Si a {'>'} 0 :</div>
                      <div className="bg-white p-2 rounded border">
                      <table className="w-full border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                            <th className="border p-2">x</th>
                            <th className="border p-2">-∞</th>
                            <th className="border p-2">x₁</th>
                            <th className="border p-2">x₂</th>
                            <th className="border p-2">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                            <td className="border p-2 font-bold">f(x)</td>
                            <td className="border p-2 text-center">+</td>
                            <td className="border p-2 text-center">0</td>
                            <td className="border p-2 text-center">0</td>
                            <td className="border p-2 text-center">+</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <div className="font-bold text-red-800 mb-2">Si a {'<'} 0 :</div>
                      <div className="bg-white p-2 rounded border">
                      <table className="w-full border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                            <th className="border p-2">x</th>
                            <th className="border p-2">-∞</th>
                            <th className="border p-2">x₁</th>
                            <th className="border p-2">x₂</th>
                            <th className="border p-2">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                            <td className="border p-2 font-bold">f(x)</td>
                            <td className="border p-2 text-center">-</td>
                            <td className="border p-2 text-center">0</td>
                            <td className="border p-2 text-center">0</td>
                            <td className="border p-2 text-center">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border-2 border-yellow-300">
                <h4 className="text-lg font-bold text-center text-gray-800 mb-4">
                    📊 Cas 2 : Δ = 0 (Racine double)
                  </h4>
                <div className="text-center">
                  <div className="inline-block bg-gray-100 p-4 rounded">
                    <div>Si a {'>'} 0 : f(x) ≥ 0 pour tout x ∈ ℝ</div>
                    <div>Si a {'<'} 0 : f(x) ≤ 0 pour tout x ∈ ℝ</div>
                                </div>
                  </div>
                </div>

              <div className="bg-white p-5 rounded-xl border-2 border-purple-300">
                <h4 className="text-lg font-bold text-center text-gray-800 mb-4">
                  📊 Cas 3 : Δ {'<'} 0 (Pas de racines réelles)
                  </h4>
                <div className="text-center">
                  <div className="inline-block bg-gray-100 p-4 rounded">
                    <div>Si a {'>'} 0 : f(x) {'>'} 0 pour tout x ∈ ℝ</div>
                    <div>Si a {'<'} 0 : f(x) {'<'} 0 pour tout x ∈ ℝ</div>
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
      id: 'calculator',
      title: 'Calculateur Interactif 🧮',
      icon: '🔢',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Résolveur d'inéquations</h3>
            <p className="text-lg">
              Explorez la résolution d'inéquations du second degré !
            </p>
            </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
                <div className="text-center mb-4">
              <div className="font-mono text-lg font-bold text-blue-600">
                {inequationParams.a}x² + {inequationParams.b}x + {inequationParams.c} {inequationType} 0
                        </div>
                      </div>
                      
            <div className="grid grid-cols-4 gap-4 mb-6">
                        <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">a = {inequationParams.a}</label>
                      <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                        value={inequationParams.a}
                  onChange={(e) => setInequationParams(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">b = {inequationParams.b}</label>
                      <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                        value={inequationParams.b}
                  onChange={(e) => setInequationParams(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">c = {inequationParams.c}</label>
                      <input
                  type="range"
                  min="-8"
                  max="8"
                  step="1"
                        value={inequationParams.c}
                  onChange={(e) => setInequationParams(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Inégalité</label>
                <select
                  value={inequationType}
                  onChange={(e) => setInequationType(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                </select>
                </div>
              </div>
              
            <svg viewBox="0 0 240 240" className="w-full h-64 bg-gray-50 rounded-lg border mb-4">
                    <defs>
                      <pattern id="grid" width="15" height="15" patternUnits="userSpaceOnUse">
                        <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
              <rect width="240" height="240" fill="url(#grid)" />
              
              <line x1="0" y1="120" x2="240" y2="120" stroke="#6b7280" strokeWidth="2"/>
              <line x1="120" y1="0" x2="120" y2="240" stroke="#6b7280" strokeWidth="2"/>
              
                    <polyline
                      points={generateParabolaPoints()}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                strokeLinecap="round"
              />
              
              {calculateInequationSolution().solutions.map((sol, index) => (
                            <circle
                              key={index}
                              cx={(sol + 8) * 15}
                  cy="120"
                  r="4"
                              fill="#ef4444"
                              stroke="white"
                              strokeWidth="2"
                            />
              ))}
                  </svg>
                
            <div className="bg-gray-50 p-4 rounded-lg">
                  {(() => {
                    const { solutions, intervals, delta } = calculateInequationSolution();
                    return (
                  <div className="space-y-2">
                    <div className="text-center font-bold text-gray-800">Résolution</div>
                    <div>Discriminant Δ = {delta.toFixed(2)}</div>
                    <div>Solutions de l'équation : {solutions.length > 0 ? solutions.map(s => s.toFixed(2)).join(', ') : 'Aucune'}</div>
                    <div className="font-bold">Solutions de l'inéquation : {intervals.join(' ∪ ')}</div>
                      </div>
                    );
                  })()}
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
            <h3 className="text-xl font-bold mb-3">Entraînement sur les tableaux de signes</h3>
            <p className="text-lg">
              Maîtrisez la résolution d'inéquations !
            </p>
          </div>

          <div className="grid gap-6">
            {[
              { equation: "x² - 5x + 6 > 0", solutions: "]-∞; 2[ ∪ ]3; +∞[" },
              { equation: "2x² + 3x - 2 ≤ 0", solutions: "[-2; 1/2]" },
              { equation: "-x² + 4x - 4 ≥ 0", solutions: "{2}" }
            ].map((exercise, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Résoudre : {exercise.equation}
                  </h3>
          </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">Solution :</h4>
                  <div className="font-mono text-lg text-green-600">{exercise.solutions}</div>
              </div>
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
      title="Tableaux de Signes et Inéquations"
      description="Résoudre des inéquations du second degré avec des tableaux de signes"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-variations', text: 'Variations' },
        next: { href: '/chapitre/equations-second-degre-parametres', text: 'Paramètres' }
      }}
    />
  );
} 