'use client';

import { useState } from 'react';
import { Play, Lightbulb, Target, Trophy, ChevronRight } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

export default function FormeCanoniquePage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseType, setExerciseType] = useState<'simple' | 'complex'>('simple');
  const [canonicalParams, setCanonicalParams] = useState({ alpha: 0, beta: 0, a: 1 });

  const simpleExercises = [
    {
      equation: "x² + 6x + 5",
      steps: [
        { text: "x² + 6x + 5", highlight: "none", explanation: "Équation de départ" },
        { text: "x² + 6x + 9 - 9 + 5", highlight: "add", explanation: "On ajoute et soustrait (6/2)² = 9" },
        { text: "(x + 3)² - 9 + 5", highlight: "factor", explanation: "On factorise x² + 6x + 9 = (x + 3)²" },
        { text: "(x + 3)² - 4", highlight: "final", explanation: "Forme canonique : α = -3, β = -4" }
      ],
      alpha: -3,
      beta: -4
    },
    {
      equation: "x² - 4x + 7",
      steps: [
        { text: "x² - 4x + 7", highlight: "none", explanation: "Équation de départ" },
        { text: "x² - 4x + 4 - 4 + 7", highlight: "add", explanation: "On ajoute et soustrait (-4/2)² = 4" },
        { text: "(x - 2)² - 4 + 7", highlight: "factor", explanation: "On factorise x² - 4x + 4 = (x - 2)²" },
        { text: "(x - 2)² + 3", highlight: "final", explanation: "Forme canonique : α = 2, β = 3" }
      ],
      alpha: 2,
      beta: 3
    }
  ];

  const complexExercises = [
    {
      equation: "2x² + 8x + 3",
      steps: [
        { text: "2x² + 8x + 3", highlight: "none", explanation: "Équation de départ" },
        { text: "2(x² + 4x) + 3", highlight: "factor-a", explanation: "On factorise le coefficient a = 2" },
        { text: "2(x² + 4x + 4 - 4) + 3", highlight: "add", explanation: "Dans la parenthèse : (4/2)² = 4" },
        { text: "2((x + 2)² - 4) + 3", highlight: "factor", explanation: "On factorise x² + 4x + 4 = (x + 2)²" },
        { text: "2(x + 2)² - 8 + 3", highlight: "distribute", explanation: "On distribue le 2" },
        { text: "2(x + 2)² - 5", highlight: "final", explanation: "Forme canonique : α = -2, β = -5" }
      ],
      alpha: -2,
      beta: -5
    }
  ];

  const simpleTrainingExercises = [
    {
      equation: "x² + 8x + 12",
      steps: [
        { text: "x² + 8x + 12", explanation: "Équation de départ" },
        { text: "x² + 8x + 16 - 16 + 12", explanation: "On ajoute et soustrait (8/2)² = 16" },
        { text: "(x + 4)² - 16 + 12", explanation: "On utilise l'identité remarquable : x² + 8x + 16 = (x + 4)²" },
        { text: "(x + 4)² - 4", explanation: "On simplifie : -16 + 12 = -4" }
      ],
      alpha: -4,
      beta: -4
    },
    {
      equation: "x² - 6x + 10",
      steps: [
        { text: "x² - 6x + 10", explanation: "Équation de départ" },
        { text: "x² - 6x + 9 - 9 + 10", explanation: "On ajoute et soustrait (-6/2)² = 9" },
        { text: "(x - 3)² - 9 + 10", explanation: "On utilise l'identité remarquable : x² - 6x + 9 = (x - 3)²" },
        { text: "(x - 3)² + 1", explanation: "On simplifie : -9 + 10 = 1" }
      ],
      alpha: 3,
      beta: 1
    },
    {
      equation: "x² + 10x + 21",
      steps: [
        { text: "x² + 10x + 21", explanation: "Équation de départ" },
        { text: "x² + 10x + 25 - 25 + 21", explanation: "On ajoute et soustrait (10/2)² = 25" },
        { text: "(x + 5)² - 25 + 21", explanation: "On utilise l'identité remarquable : x² + 10x + 25 = (x + 5)²" },
        { text: "(x + 5)² - 4", explanation: "On simplifie : -25 + 21 = -4" }
      ],
      alpha: -5,
      beta: -4
    },
    {
      equation: "x² - 2x + 5",
      steps: [
        { text: "x² - 2x + 5", explanation: "Équation de départ" },
        { text: "x² - 2x + 1 - 1 + 5", explanation: "On ajoute et soustrait (-2/2)² = 1" },
        { text: "(x - 1)² - 1 + 5", explanation: "On utilise l'identité remarquable : x² - 2x + 1 = (x - 1)²" },
        { text: "(x - 1)² + 4", explanation: "On simplifie : -1 + 5 = 4" }
      ],
      alpha: 1,
      beta: 4
    }
  ];

  const complexTrainingExercises = [
    {
      equation: "3x² + 12x + 7",
      steps: [
        { text: "3x² + 12x + 7", explanation: "Équation de départ" },
        { text: "3(x² + 4x) + 7", explanation: "On factorise par a = 3" },
        { text: "3(x² + 4x + 4 - 4) + 7", explanation: "Dans la parenthèse : (4/2)² = 4" },
        { text: "3((x + 2)² - 4) + 7", explanation: "On utilise l'identité remarquable : x² + 4x + 4 = (x + 2)²" },
        { text: "3(x + 2)² - 12 + 7", explanation: "On distribue le 3" },
        { text: "3(x + 2)² - 5", explanation: "On simplifie : -12 + 7 = -5" }
      ],
      alpha: -2,
      beta: -5,
      a: 3
    },
    {
      equation: "-2x² + 8x - 3",
      steps: [
        { text: "-2x² + 8x - 3", explanation: "Équation de départ" },
        { text: "-2(x² - 4x) - 3", explanation: "On factorise par a = -2" },
        { text: "-2(x² - 4x + 4 - 4) - 3", explanation: "Dans la parenthèse : (-4/2)² = 4" },
        { text: "-2((x - 2)² - 4) - 3", explanation: "On utilise l'identité remarquable : x² - 4x + 4 = (x - 2)²" },
        { text: "-2(x - 2)² + 8 - 3", explanation: "On distribue le -2" },
        { text: "-2(x - 2)² + 5", explanation: "On simplifie : 8 - 3 = 5" }
      ],
      alpha: 2,
      beta: 5,
      a: -2
    },
    {
      equation: "4x² - 16x + 11",
      steps: [
        { text: "4x² - 16x + 11", explanation: "Équation de départ" },
        { text: "4(x² - 4x) + 11", explanation: "On factorise par a = 4" },
        { text: "4(x² - 4x + 4 - 4) + 11", explanation: "Dans la parenthèse : (-4/2)² = 4" },
        { text: "4((x - 2)² - 4) + 11", explanation: "On utilise l'identité remarquable : x² - 4x + 4 = (x - 2)²" },
        { text: "4(x - 2)² - 16 + 11", explanation: "On distribue le 4" },
        { text: "4(x - 2)² - 5", explanation: "On simplifie : -16 + 11 = -5" }
      ],
      alpha: 2,
      beta: -5,
      a: 4
    },
    {
      equation: "-x² + 6x - 8",
      steps: [
        { text: "-x² + 6x - 8", explanation: "Équation de départ" },
        { text: "-(x² - 6x) - 8", explanation: "On factorise par a = -1" },
        { text: "-(x² - 6x + 9 - 9) - 8", explanation: "Dans la parenthèse : (-6/2)² = 9" },
        { text: "-((x - 3)² - 9) - 8", explanation: "On utilise l'identité remarquable : x² - 6x + 9 = (x - 3)²" },
        { text: "-(x - 3)² + 9 - 8", explanation: "On distribue le -1" },
        { text: "-(x - 3)² + 1", explanation: "On simplifie : 9 - 8 = 1" }
      ],
      alpha: 3,
      beta: 1,
      a: -1
    }
  ];

  const getHighlightClass = (highlight: string) => {
    switch (highlight) {
      case 'add': return 'bg-yellow-300 text-yellow-900 font-semibold';
      case 'factor': return 'bg-green-300 text-green-900 font-semibold';
      case 'factor-a': return 'bg-blue-300 text-blue-900 font-semibold';
      case 'distribute': return 'bg-purple-300 text-purple-900 font-semibold';
      case 'final': return 'bg-red-300 text-red-900 font-semibold';
      default: return 'text-gray-800';
    }
  };

  const generateCanonicalParabola = () => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.2) {
      const y = canonicalParams.a * (x - canonicalParams.alpha) ** 2 + canonicalParams.beta;
      if (y >= -5 && y <= 5) {
        points.push(`${150 + x * 30},${150 - y * 30}`);
      }
    }
    return points.join(' ');
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Qu\'est-ce que la forme canonique ? 🎯',
      icon: '🔍',
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">Définition</h3>
                <p className="text-lg">
                  La <strong>forme canonique</strong> d'une fonction du second degré est :
                </p>
                <div className="bg-white/20 p-4 rounded-lg mt-4 text-center">
                  <span className="text-2xl font-mono font-bold">f(x) = a(x - α)² + β</span>
                </div>
                <p className="mt-3 text-sm">
                  où <strong>(α, β)</strong> sont les coordonnées du sommet de la parabole
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold">a</span>
                  <span className="text-gray-700">: même coefficient qu'avant</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600 font-bold">α</span>
                  <span className="text-gray-700">: abscisse du sommet</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600 font-bold">β</span>
                  <span className="text-gray-700">: ordonnée du sommet</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Pourquoi la forme canonique ?</h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <div className="font-bold text-blue-800">📊 Lecture graphique</div>
                  <div className="text-sm text-blue-600">On lit directement le sommet (α, β)</div>
                </div>
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="font-bold text-green-800">📈 Variations</div>
                  <div className="text-sm text-green-600">Facile de voir si la fonction croît ou décroît</div>
                </div>
                <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                  <div className="font-bold text-purple-800">🎯 Extremums</div>
                  <div className="text-sm text-purple-600">Le maximum ou minimum est directement visible</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
            <h4 className="font-bold text-yellow-800 mb-3">🔄 Transformation</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="font-bold text-gray-700 mb-2">Forme développée</div>
                <div className="font-mono text-lg text-blue-600">ax² + bx + c</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-700 mb-2">Forme canonique</div>
                <div className="font-mono text-lg text-purple-600">a(x - α)² + β</div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 20
    },
    {
      id: 'method-a-equals-1',
      title: 'Méthode : Cas a = 1 📝',
      icon: '📋',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Méthode pour a = 1</h3>
            <p className="text-lg">
              Quand a = 1, la méthode est plus simple. On "complète le carré" directement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 mb-4">🎯 Étapes de la méthode</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <div className="font-bold">Partir de x² + bx + c</div>
                  <div className="text-gray-600">Identifier le coefficient b</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <div className="font-bold">Calculer (b/2)²</div>
                  <div className="text-gray-600">C'est le terme qu'on va ajouter et soustraire</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <div className="font-bold">Ajouter et soustraire (b/2)²</div>
                  <div className="text-gray-600">x² + bx + (b/2)² - (b/2)² + c</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <div className="font-bold">Factoriser le trinôme parfait</div>
                  <div className="text-gray-600">x² + bx + (b/2)² = (x + b/2)²</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</span>
                <div>
                  <div className="font-bold">Simplifier</div>
                  <div className="text-gray-600">Obtenir la forme a(x - α)² + β</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300">
            <h4 className="font-bold text-green-800 mb-4">🧮 Exemple détaillé</h4>
            <div className="space-y-4">
              {simpleExercises[0].steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`font-mono text-lg ${getHighlightClass(step.highlight)}`}>
                      {step.text}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{step.explanation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      xpReward: 25
    },
    {
      id: 'method-a-not-1',
      title: 'Méthode : Cas a ≠ 1 📝',
      icon: '🔧',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Méthode pour a ≠ 1</h3>
            <p className="text-lg">
              Quand a ≠ 1, on doit d'abord factoriser par a avant de compléter le carré.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 mb-4">🎯 Étapes de la méthode</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                <div>
                  <div className="font-bold">Factoriser par a</div>
                  <div className="text-gray-600">ax² + bx + c = a(x² + (b/a)x) + c</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <div className="font-bold">Compléter le carré dans la parenthèse</div>
                  <div className="text-gray-600">Ajouter et soustraire (b/2a)²</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                <div>
                  <div className="font-bold">Factoriser le trinôme parfait</div>
                  <div className="text-gray-600">x² + (b/a)x + (b/2a)² = (x + b/2a)²</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                <div>
                  <div className="font-bold">Distribuer a</div>
                  <div className="text-gray-600">Multiplier a par ce qui est dans les parenthèses</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</span>
                <div>
                  <div className="font-bold">Simplifier</div>
                  <div className="text-gray-600">Obtenir la forme a(x - α)² + β</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-300">
            <h4 className="font-bold text-orange-800 mb-4">🧮 Exemple détaillé</h4>
            <div className="space-y-4">
              {complexExercises[0].steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className={`font-mono text-lg ${getHighlightClass(step.highlight)}`}>
                      {step.text}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{step.explanation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      xpReward: 30
    },
    {
      id: 'interactive-graph',
      title: 'Graphique Interactif 📊',
      icon: '📈',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Visualisation de la forme canonique</h3>
            <p className="text-lg">
              Explorez comment α et β influencent la position du sommet !
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <div className="text-center mb-4">
              <div className="font-mono text-lg font-bold text-purple-600">
                f(x) = {canonicalParams.a}(x - {canonicalParams.alpha})² + {canonicalParams.beta}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Sommet : ({canonicalParams.alpha}, {canonicalParams.beta})
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">a = {canonicalParams.a}</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.5"
                  value={canonicalParams.a}
                  onChange={(e) => setCanonicalParams(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Ouverture/orientation</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">α = {canonicalParams.alpha}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={canonicalParams.alpha}
                  onChange={(e) => setCanonicalParams(prev => ({ ...prev, alpha: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Position horizontale</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">β = {canonicalParams.beta}</label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={canonicalParams.beta}
                  onChange={(e) => setCanonicalParams(prev => ({ ...prev, beta: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Position verticale</div>
              </div>
            </div>

            <svg viewBox="0 0 300 300" className="w-full h-64 bg-gray-50 rounded-lg border">
              <defs>
                <pattern id="canonical-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="300" height="300" fill="url(#canonical-grid)" />
              
              <line x1="0" y1="150" x2="300" y2="150" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
              <line x1="150" y1="0" x2="150" y2="300" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
              
              <polyline
                points={generateCanonicalParabola()}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              <circle 
                cx={150 + canonicalParams.alpha * 30} 
                cy={150 - canonicalParams.beta * 30} 
                r="6" 
                fill="#ef4444" 
                stroke="white" 
                strokeWidth="2"
              />
              <text 
                x={150 + canonicalParams.alpha * 30 + 10} 
                y={150 - canonicalParams.beta * 30 - 10} 
                fontSize="12" 
                fill="#ef4444" 
                fontWeight="bold"
              >
                S({canonicalParams.alpha}, {canonicalParams.beta})
              </text>
            </svg>
          </div>
        </div>
      ),
      xpReward: 20
    },
    {
      id: 'exercises-simple',
      title: 'Exercices : Cas a = 1 💪',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement : a = 1</h3>
            <p className="text-lg">
              Maîtrisez la méthode avec ces exercices progressifs !
            </p>
          </div>

                     <div className="grid gap-6">
             {simpleTrainingExercises.map((exercise, index) => (
               <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                 <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
                     Mettre sous forme canonique : {exercise.equation}
                   </h3>
                   <p className="text-gray-600">Trouvez les valeurs α et β</p>
                 </div>

                 <div className="space-y-4 mb-6">
                   <div className="bg-blue-50 p-4 rounded-lg">
                     <h4 className="font-bold text-blue-800 mb-3">🎯 Méthode :</h4>
                     <div className="space-y-2">
                       {exercise.steps.map((step, stepIndex) => (
                         <div key={stepIndex} className="p-3 bg-white rounded border-l-4 border-blue-400">
                           <div className="font-mono font-bold text-gray-800">{step.text}</div>
                           <div className="text-sm text-gray-600">{step.explanation}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-green-50 p-4 rounded-lg">
                     <h4 className="font-bold text-green-800 mb-3">📝 Résultat :</h4>
                     <div className="text-center">
                       <div className="font-mono text-xl font-bold text-green-600">
                         α = {exercise.alpha}, β = {exercise.beta}
                       </div>
                       <div className="font-mono text-lg text-gray-700 mt-2">
                         Forme canonique : (x - ({exercise.alpha}))² + ({exercise.beta})
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      ),
      xpReward: 35
    },
    {
      id: 'exercises-complex',
      title: 'Exercices : Cas a ≠ 1 💪',
      icon: '🔧',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement : a ≠ 1</h3>
            <p className="text-lg">
              Défi plus complexe avec factorisation !
            </p>
          </div>

                     <div className="grid gap-6">
             {complexTrainingExercises.map((exercise, index) => (
               <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                 <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
                     Mettre sous forme canonique : {exercise.equation}
                   </h3>
                   <p className="text-gray-600">Trouvez les valeurs a, α et β</p>
                 </div>

                 <div className="space-y-4 mb-6">
                   <div className="bg-orange-50 p-4 rounded-lg">
                     <h4 className="font-bold text-orange-800 mb-3">🎯 Méthode :</h4>
                     <div className="space-y-2">
                       {exercise.steps.map((step, stepIndex) => (
                         <div key={stepIndex} className="p-3 bg-white rounded border-l-4 border-orange-400">
                           <div className="font-mono font-bold text-gray-800">{step.text}</div>
                           <div className="text-sm text-gray-600">{step.explanation}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-green-50 p-4 rounded-lg">
                     <h4 className="font-bold text-green-800 mb-3">📝 Résultat :</h4>
                     <div className="text-center">
                       <div className="font-mono text-xl font-bold text-green-600">
                         a = {exercise.a}, α = {exercise.alpha}, β = {exercise.beta}
                       </div>
                       <div className="font-mono text-lg text-gray-700 mt-2">
                         Forme canonique : {exercise.a}(x - ({exercise.alpha}))² + ({exercise.beta})
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      ),
      xpReward: 45
    }
  ];

  return (
    <ChapterLayout
      title="Forme Canonique"
      description="Transformer une fonction du second degré en forme canonique"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-resolution', text: 'Résolution' },
        next: { href: '/chapitre/equations-second-degre-variations', text: 'Variations' }
      }}
    />
  );
} 