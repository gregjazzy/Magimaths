'use client';

import { useState } from 'react';
import { ArrowLeft, Play, Lightbulb, Target, Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function FormeCanoniquePage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseType, setExerciseType] = useState<'simple' | 'complex'>('simple');
  const [canonicalParams, setCanonicalParams] = useState({ alpha: 0, beta: 0, a: 1 });
  const [showExerciseCorrection, setShowExerciseCorrection] = useState<{[key: string]: boolean}>({});
  const [exerciseAnswers, setExerciseAnswers] = useState<{[key: string]: {alpha?: number, beta?: number, a?: number}}>({});
  const [exerciseValidated, setExerciseValidated] = useState<{[key: string]: boolean}>({});
  const [exerciseCorrect, setExerciseCorrect] = useState<{[key: string]: boolean}>({});

  // Exercices pour a = 1
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

  // Exercices pour a ≠ 1
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

  // Exercices d'entraînement pour a = 1 avec corrections détaillées
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

  // Exercices d'entraînement pour a ≠ 1 avec corrections détaillées
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

  const handleSectionComplete = (sectionName: string, xp: number) => {
    if (!completedSections.includes(sectionName)) {
      setCompletedSections(prev => [...prev, sectionName]);
      setXpEarned(prev => prev + xp);
    }
  };

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
      if (y >= -5 && y <= 5) { // Limiter l'affichage
        points.push(`${150 + x * 30},${150 - y * 30}`);
      }
    }
    return points.join(' ');
  };

  const toggleExerciseCorrection = (exerciseId: string) => {
    setShowExerciseCorrection(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const updateExerciseAnswer = (exerciseId: string, field: string, value: number) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value
      }
    }));
  };

  const resetExercise = (exerciseId: string) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [exerciseId]: {}
    }));
    setExerciseValidated(prev => ({
      ...prev,
      [exerciseId]: false
    }));
    setExerciseCorrect(prev => ({
      ...prev,
      [exerciseId]: false
    }));
    setShowExerciseCorrection(prev => ({
      ...prev,
      [exerciseId]: false
    }));
  };

  const validateExercise = (exerciseId: string, correctAnswer: {alpha: number, beta: number, a?: number}) => {
    const userAnswer = exerciseAnswers[exerciseId];
    if (!userAnswer) return;

    const isCorrect = userAnswer.alpha === correctAnswer.alpha && 
                     userAnswer.beta === correctAnswer.beta &&
                     (correctAnswer.a === undefined || userAnswer.a === correctAnswer.a);

    setExerciseValidated(prev => ({
      ...prev,
      [exerciseId]: true
    }));

    setExerciseCorrect(prev => ({
      ...prev,
      [exerciseId]: isCorrect
    }));

    if (isCorrect) {
      setXpEarned(prev => prev + 5); // +5 XP par exercice réussi
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header fixe avec navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Retour</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Équations du Second Degré</h1>
                <p className="text-sm text-gray-600">Chapitre complet • {xpEarned} XP gagnés</p>
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
            <div className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg font-medium relative overflow-hidden">
              <span className="text-sm font-semibold">2. Canonique</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
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
            <Link href="/chapitre/equations-second-degre-equations-cube" className="flex items-center justify-center px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors text-center relative overflow-hidden">
              <span className="text-sm font-semibold">8. Cube</span>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-12">
        
        {/* Section 1: Introduction à la forme canonique */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Découverte</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              La Forme Canonique 🧮
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">Définition</h3>
                <p className="text-lg mb-4">
                  La <strong>forme canonique</strong> d'une équation du second degré :
                </p>
                <div className="bg-white/20 p-4 rounded-lg text-center">
                  <span className="text-2xl font-mono font-bold">a(x - α)² + β</span>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div><strong>α</strong> (alpha) : abscisse du sommet</div>
                  <div><strong>β</strong> (bêta) : ordonnée du sommet</div>
                  <div><strong>a</strong> : coefficient d'ouverture</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">À quoi ça sert ?</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                    <div className="font-bold text-green-800">📍 Sommet de la parabole</div>
                    <div className="text-sm text-green-600">Coordonnées : (α, β)</div>
                  </div>
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <div className="font-bold text-blue-800">📊 Étude de la fonction</div>
                    <div className="text-sm text-blue-600">Variations, extremum</div>
                  </div>
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg">
                    <div className="font-bold text-purple-800">🎯 Résolution simplifiée</div>
                    <div className="text-sm text-purple-600">Équations, inéquations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique interactif pour α et β */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Visualisation interactive :</h3>
              
              {/* Contrôles pour α et β */}
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <label className="block text-purple-800 font-bold mb-2 text-sm">
                    a (ouverture) = {canonicalParams.a}
                  </label>
                  <input
                    type="range"
                    min="0.25"
                    max="2"
                    step="0.25"
                    value={canonicalParams.a}
                    onChange={(e) => setCanonicalParams(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-purple-600 mt-1">Plus a est grand, plus la parabole est "serrée"</p>
                </div>

                <div className="p-3 bg-green-50 rounded-xl">
                  <label className="block text-green-800 font-bold mb-2 text-sm">
                    α (abscisse du sommet) = {canonicalParams.alpha}
                  </label>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.5"
                    value={canonicalParams.alpha}
                    onChange={(e) => setCanonicalParams(prev => ({ ...prev, alpha: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-green-600 mt-1">Décale la parabole horizontalement</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl">
                  <label className="block text-blue-800 font-bold mb-2 text-sm">
                    β (ordonnée du sommet) = {canonicalParams.beta}
                  </label>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.5"
                    value={canonicalParams.beta}
                    onChange={(e) => setCanonicalParams(prev => ({ ...prev, beta: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-blue-600 mt-1">Décale la parabole verticalement</p>
                </div>
              </div>

              {/* Graphique */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 h-64">
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    {/* Grille */}
                    <defs>
                      <pattern id="gridCanonical" width="15" height="15" patternUnits="userSpaceOnUse">
                        <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="300" height="300" fill="url(#gridCanonical)" />
                    
                    {/* Axes */}
                    <line x1="150" y1="0" x2="150" y2="300" stroke="#9ca3af" strokeWidth="2" />
                    <line x1="0" y1="150" x2="300" y2="150" stroke="#9ca3af" strokeWidth="2" />
                    
                    {/* Parabole */}
                    <polyline
                      points={generateCanonicalParabola()}
                      fill="none"
                      stroke="url(#canonicalGradient)"
                      strokeWidth="3"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Point du sommet */}
                    <circle
                      cx={150 + canonicalParams.alpha * 30}
                      cy={150 - canonicalParams.beta * 30}
                      r="6"
                      fill="#ef4444"
                      stroke="#white"
                      strokeWidth="2"
                      className="drop-shadow-lg"
                    />
                    
                    {/* Lignes de repère pour α et β */}
                    <line
                      x1={150 + canonicalParams.alpha * 30}
                      y1="150"
                      x2={150 + canonicalParams.alpha * 30}
                      y2={150 - canonicalParams.beta * 30}
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="150"
                      y1={150 - canonicalParams.beta * 30}
                      x2={150 + canonicalParams.alpha * 30}
                      y2={150 - canonicalParams.beta * 30}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    
                    {/* Labels pour α et β */}
                    <text
                      x={150 + canonicalParams.alpha * 30}
                      y="170"
                      textAnchor="middle"
                      className="text-xs font-bold fill-green-600"
                    >
                      α = {canonicalParams.alpha}
                    </text>
                    <text
                      x="130"
                      y={150 - canonicalParams.beta * 30 + 5}
                      textAnchor="middle"
                      className="text-xs font-bold fill-blue-600"
                    >
                      β = {canonicalParams.beta}
                    </text>
                    
                    {/* Point de repère du sommet */}
                    <text
                      x={150 + canonicalParams.alpha * 30 + 15}
                      y={150 - canonicalParams.beta * 30 - 10}
                      className="text-xs font-bold fill-red-600"
                    >
                      Sommet ({canonicalParams.alpha}, {canonicalParams.beta})
                    </text>
                    
                    <defs>
                      <linearGradient id="canonicalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                
                {/* Équation actuelle */}
                <div className="mt-3 text-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <div className="text-xs text-purple-600">Forme canonique :</div>
                    <div className="font-mono font-bold text-purple-800">
                      {canonicalParams.a === 1 ? '' : `${canonicalParams.a}`}(x {canonicalParams.alpha >= 0 ? '-' : '+'} {Math.abs(canonicalParams.alpha)})² {canonicalParams.beta >= 0 ? '+' : ''} {canonicalParams.beta}
                    </div>
                    <div className="text-xs text-purple-500 mt-1">
                      Sommet : ({canonicalParams.alpha}, {canonicalParams.beta})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('intro-canonique', 25)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('intro-canonique')
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {completedSections.includes('intro-canonique') ? '✓ Compris ! +25 XP' : 'C\'est parti ! +25 XP'}
            </button>
          </div>
        </section>

        {/* Section 2: Cas simple (a = 1) */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Cas Simple</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Comment mettre sous forme canonique
            </h2>
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <span className="text-xl font-bold text-green-800">Quand a = 1 📝</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Méthode */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Méthode :</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                  <span className="font-bold text-blue-900">1.</span> <span className="text-gray-800">x² + bx + c</span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <span className="font-bold text-yellow-900">2.</span> <span className="text-gray-800">Ajouter et soustraire (b/2)²</span>
                </div>
                <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                  <span className="font-bold text-green-900">3.</span> <span className="text-gray-800">Utiliser l'identité remarquable a² + 2ab + b² = (a + b)²</span>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg border border-purple-300">
                  <span className="font-bold text-purple-900">4.</span> <span className="text-gray-800">Simplifier les constantes</span>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg border border-orange-300 mt-3">
                  <div className="text-sm text-orange-800">
                    <strong>⚠️ Piège classique :</strong> Dans (x + a)², on a α = -a
                    <br />
                    <span className="font-mono">Exemple : (x + 3)² = (x - (-3))² donc α = -3</span>
                  </div>
                </div>
                
                {/* Flèche dynamique vers l'exercice */}
                <div className="flex items-center justify-center mt-4 text-blue-600">
                  <div className="flex items-center space-x-2 animate-pulse">
                    <span className="text-sm font-medium">Vois concrètement avec l'exercice guidé</span>
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercice animé */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Exercice guidé :</h3>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setShowSolution(false);
                    setExerciseType('simple');
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Recommencer
                </button>
              </div>

              {exerciseType === 'simple' && simpleExercises[0] && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-lg font-mono font-bold text-gray-800">
                      {simpleExercises[0].equation}
                    </div>
                  </div>

                  {/* Animation des étapes */}
                  <div className="space-y-3">
                    {simpleExercises[0].steps.slice(0, currentStep + 1).map((step, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg border"
                      >
                        <div className={`font-mono text-lg ${getHighlightClass(step.highlight)} px-2 py-1 rounded`}>
                          {step.text}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{step.explanation}</div>
                      </div>
                    ))}
                  </div>

                  {currentStep < simpleExercises[0].steps.length - 1 ? (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                      >
                        Étape suivante <ChevronRight className="h-4 w-4 inline ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-bold text-green-800 mb-2">🎉 Forme canonique trouvée !</div>
                      <div className="space-y-2">
                        <div className="font-mono text-lg text-green-700">
                          (x + 3)² - 4 = (x - (-3))² + (-4)
                        </div>
                        <div className="text-sm text-green-600 bg-yellow-100 p-2 rounded border border-yellow-300">
                          <strong>⚠️ Attention au signe :</strong> (x + 3) = (x - (-3))
                        </div>
                        <div className="text-green-600">
                          <strong>α = -3</strong> et <strong>β = -4</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('cas-simple', 30)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('cas-simple')
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {completedSections.includes('cas-simple') ? '✓ Maîtrisé ! +30 XP' : 'J\'ai compris ! +30 XP'}
            </button>
          </div>

          {/* Exercices d'entraînement pour a = 1 avec corrections détaillées */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🏋️ Entraînement : cas a = 1</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {simpleTrainingExercises.map((exercise, index) => {
                const exerciseId = `simple-${index}`;
                const userAnswer = exerciseAnswers[exerciseId];
                const isValidated = exerciseValidated[exerciseId];
                const isCorrect = exerciseCorrect[exerciseId];
                
                return (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-2xl border-2 border-green-200 hover:shadow-lg transition-all"
                  >
                    <div className="text-center mb-4">
                      <div className="text-lg font-mono font-bold text-gray-800 mb-2">
                        {exercise.equation}
                      </div>
                      <div className="text-sm text-gray-600">Mettre sous forme canonique :</div>
                    </div>

                    {/* Formulaire interactif */}
                    <div className="space-y-6">
                      {/* Titre de la section */}
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800 mb-2">
                          Trouve les valeurs α et β
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          Pour écrire sous la forme : a(x - α)² + β
                        </div>
                      </div>

                      {/* Champs de saisie améliorés */}
                      <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-lg">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="bg-green-100 p-3 rounded-lg mb-3">
                              <label className="block text-lg font-bold text-green-800 mb-1">
                                α (alpha)
                              </label>
                              <div className="text-sm text-green-600">
                                Abscisse du sommet
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                placeholder="Ex: -3"
                                disabled={isValidated}
                                value={userAnswer?.alpha !== undefined ? userAnswer.alpha : ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '') {
                                    setExerciseAnswers(prev => ({
                                      ...prev,
                                      [exerciseId]: { ...prev[exerciseId], alpha: undefined }
                                    }));
                                  } else {
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue)) {
                                      updateExerciseAnswer(exerciseId, 'alpha', numValue);
                                    }
                                  }
                                }}
                                className="w-full px-4 py-3 text-center text-xl font-bold border-2 border-green-400 rounded-lg focus:border-green-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                style={{ 
                                  backgroundColor: isValidated ? '#f3f4f6' : '#ffffff',
                                  color: '#000000'
                                }}
                              />
                              {isValidated && isCorrect && (
                                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-green-500 text-2xl">
                                  ✓
                                </div>
                              )}
                              {isValidated && !isCorrect && (
                                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-red-500 text-2xl">
                                  ✗
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="bg-blue-100 p-3 rounded-lg mb-3">
                              <label className="block text-lg font-bold text-blue-800 mb-1">
                                β (bêta)
                              </label>
                              <div className="text-sm text-blue-600">
                                Ordonnée du sommet
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                placeholder="Ex: -4"
                                disabled={isValidated}
                                value={userAnswer?.beta !== undefined ? userAnswer.beta : ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '') {
                                    setExerciseAnswers(prev => ({
                                      ...prev,
                                      [exerciseId]: { ...prev[exerciseId], beta: undefined }
                                    }));
                                  } else {
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue)) {
                                      updateExerciseAnswer(exerciseId, 'beta', numValue);
                                    }
                                  }
                                }}
                                className="w-full px-4 py-3 text-center text-xl font-bold border-2 border-blue-400 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                style={{ 
                                  backgroundColor: isValidated ? '#f3f4f6' : '#ffffff',
                                  color: '#000000'
                                }}
                              />
                              {isValidated && isCorrect && (
                                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-green-500 text-2xl">
                                  ✓
                                </div>
                              )}
                              {isValidated && !isCorrect && (
                                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-red-500 text-2xl">
                                  ✗
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Aperçu de la réponse */}
                        {(userAnswer?.alpha !== undefined || userAnswer?.beta !== undefined) && (
                          <div className="mt-4 text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                            <div className="text-sm text-gray-600 mb-2">Aperçu de ta réponse :</div>
                            <div className="font-mono font-bold text-xl text-gray-800">
                              (x {userAnswer?.alpha !== undefined ? (userAnswer.alpha >= 0 ? `- ${userAnswer.alpha}` : `+ ${Math.abs(userAnswer.alpha)}`) : '- α'})² {userAnswer?.beta !== undefined ? (userAnswer.beta >= 0 ? `+ ${userAnswer.beta}` : `${userAnswer.beta}`) : '+ β'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Boutons de validation */}
                      <div className="text-center space-y-3">
                        {!isValidated ? (
                          <button
                            onClick={() => validateExercise(exerciseId, {alpha: exercise.alpha, beta: exercise.beta})}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={userAnswer?.alpha === undefined || userAnswer?.beta === undefined}
                          >
                            Vérifier ma réponse
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                              <div className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                {isCorrect ? '🎉 Excellent ! +5 XP' : '❌ Pas tout à fait...'}
                              </div>
                              {isCorrect && (
                                <div className="text-sm text-green-600 mt-2">
                                  Forme canonique : (x - ({exercise.alpha}))² + ({exercise.beta})
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => resetExercise(exerciseId)}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                            >
                              Recommencer cet exercice
                            </button>
                          </div>
                        )}

                        {isValidated && !isCorrect && (
                          <button
                            onClick={() => toggleExerciseCorrection(exerciseId)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                          >
                            {showExerciseCorrection[exerciseId] ? 'Masquer la correction' : 'Voir la correction détaillée'}
                          </button>
                        )}
                      </div>

                        {/* Correction détaillée */}
                        {showExerciseCorrection[exerciseId] && (
                          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="font-bold text-gray-800 mb-3">📚 Correction détaillée :</div>
                            <div className="space-y-2">
                              {exercise.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                                  <div className="font-mono font-bold text-gray-800">{step.text}</div>
                                  <div className="text-sm text-gray-600">{step.explanation}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Cas complexe (a ≠ 1) */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <Trophy className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">Cas Avancé</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Comment mettre sous forme canonique
            </h2>
            <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-4">
              <span className="text-xl font-bold text-red-800">Quand a ≠ 1 🔥</span>
            </div>
            <p className="text-gray-600">Cas avancé</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Méthode complexe */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Méthode :</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                  <span className="font-bold text-blue-900">1.</span> <span className="text-gray-800">ax² + bx + c</span>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg border border-purple-300">
                  <span className="font-bold text-purple-900">2.</span> <span className="text-gray-800">Factoriser par a : a(x² + (b/a)x) + c</span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <span className="font-bold text-yellow-900">3.</span> <span className="text-gray-800">Compléter le carré dans la parenthèse</span>
                </div>
                <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                  <span className="font-bold text-green-900">4.</span> <span className="text-gray-800">Distribuer et simplifier</span>
                </div>
                <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                  <span className="font-bold text-red-900">5.</span> <span className="text-gray-800">Forme finale : a(x - α)² + β</span>
                </div>
                
                {/* Flèche dynamique vers l'exercice */}
                <div className="flex items-center justify-center mt-4 text-red-600">
                  <div className="flex items-center space-x-2 animate-pulse">
                    <span className="text-sm font-medium">Vois concrètement avec l'exercice guidé</span>
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercice complexe animé */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Exercice avancé :</h3>
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setShowSolution(false);
                    setExerciseType('complex');
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Recommencer
                </button>
              </div>

              {exerciseType === 'complex' && complexExercises[0] && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-lg font-mono font-bold text-gray-800">
                      {complexExercises[0].equation}
                    </div>
                  </div>

                  {/* Animation des étapes complexes */}
                  <div className="space-y-3">
                    {complexExercises[0].steps.slice(0, currentStep + 1).map((step, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg border"
                      >
                        <div className={`font-mono text-lg ${getHighlightClass(step.highlight)} px-2 py-1 rounded`}>
                          {step.text}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{step.explanation}</div>
                      </div>
                    ))}
                  </div>

                  {currentStep < complexExercises[0].steps.length - 1 ? (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Étape suivante <ChevronRight className="h-4 w-4 inline ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center mt-4 p-4 bg-red-50 rounded-lg">
                      <div className="font-bold text-red-800">🎉 Forme canonique trouvée !</div>
                      <div className="text-sm text-red-600">
                        α = {complexExercises[0].alpha}, β = {complexExercises[0].beta}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleSectionComplete('cas-complexe', 40)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                completedSections.includes('cas-complexe')
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {completedSections.includes('cas-complexe') ? '✓ Expert ! +40 XP' : 'Niveau expert ! +40 XP'}
            </button>
          </div>

          {/* Exercices d'entraînement pour a ≠ 1 avec corrections détaillées */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🚀 Entraînement : cas a ≠ 1</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {complexTrainingExercises.map((exercise, index) => {
                const exerciseId = `complex-${index}`;
                const userAnswer = exerciseAnswers[exerciseId];
                const isValidated = exerciseValidated[exerciseId];
                const isCorrect = exerciseCorrect[exerciseId];
                
                return (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-red-50 to-purple-50 p-4 rounded-2xl border-2 border-red-200 hover:shadow-lg transition-all"
                  >
                    <div className="text-center mb-4">
                      <div className="text-lg font-mono font-bold text-gray-800 mb-2">
                        {exercise.equation}
                      </div>
                      <div className="text-sm text-gray-600">Mettre sous forme canonique :</div>
                    </div>

                    {/* Formulaire interactif pour cas complexe */}
                    <div className="space-y-6">
                      {/* Titre de la section */}
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800 mb-2">
                          Trouve les valeurs a, α et β
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          Pour écrire sous la forme : a(x - α)² + β
                        </div>
                      </div>

                      {/* Champs de saisie améliorés pour cas complexe */}
                      <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-lg">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="bg-purple-100 p-3 rounded-lg mb-3 h-16 flex flex-col justify-center">
                              <label className="block text-lg font-bold text-purple-800 mb-1">
                                a
                              </label>
                              <div className="text-sm text-purple-600">
                                Coefficient
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                placeholder={exercise.a.toString()}
                                disabled={isValidated}
                                value={userAnswer?.a !== undefined ? userAnswer.a : ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '') {
                                    setExerciseAnswers(prev => ({
                                      ...prev,
                                      [exerciseId]: { ...prev[exerciseId], a: undefined }
                                    }));
                                  } else {
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue)) {
                                      updateExerciseAnswer(exerciseId, 'a', numValue);
                                    }
                                  }
                                }}
                                className="w-full px-3 py-3 text-center text-lg font-bold border-2 border-purple-400 rounded-lg focus:border-purple-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 h-12"
                                style={{ 
                                  backgroundColor: isValidated ? '#f3f4f6' : '#ffffff',
                                  color: '#000000'
                                }}
                              />
                              {isValidated && isCorrect && (
                                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-green-500 text-xl">
                                  ✓
                                </div>
                              )}
                              {isValidated && !isCorrect && (
                                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
                                  ✗
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="bg-green-100 p-3 rounded-lg mb-3 h-16 flex flex-col justify-center">
                              <label className="block text-lg font-bold text-green-800 mb-1">
                                α (alpha)
                              </label>
                              <div className="text-sm text-green-600">
                                Abscisse
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                placeholder={exercise.alpha.toString()}
                                disabled={isValidated}
                                value={userAnswer?.alpha !== undefined ? userAnswer.alpha : ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '') {
                                    setExerciseAnswers(prev => ({
                                      ...prev,
                                      [exerciseId]: { ...prev[exerciseId], alpha: undefined }
                                    }));
                                  } else {
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue)) {
                                      updateExerciseAnswer(exerciseId, 'alpha', numValue);
                                    }
                                  }
                                }}
                                className="w-full px-3 py-3 text-center text-lg font-bold border-2 border-green-400 rounded-lg focus:border-green-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 h-12"
                                style={{ 
                                  backgroundColor: isValidated ? '#f3f4f6' : '#ffffff',
                                  color: '#000000'
                                }}
                              />
                              {isValidated && isCorrect && (
                                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-green-500 text-xl">
                                  ✓
                                </div>
                              )}
                              {isValidated && !isCorrect && (
                                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
                                  ✗
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="bg-blue-100 p-3 rounded-lg mb-3 h-16 flex flex-col justify-center">
                              <label className="block text-lg font-bold text-blue-800 mb-1">
                                β (bêta)
                              </label>
                              <div className="text-sm text-blue-600">
                                Ordonnée
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                placeholder={exercise.beta.toString()}
                                disabled={isValidated}
                                value={userAnswer?.beta !== undefined ? userAnswer.beta : ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === '') {
                                    setExerciseAnswers(prev => ({
                                      ...prev,
                                      [exerciseId]: { ...prev[exerciseId], beta: undefined }
                                    }));
                                  } else {
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue)) {
                                      updateExerciseAnswer(exerciseId, 'beta', numValue);
                                    }
                                  }
                                }}
                                className="w-full px-3 py-3 text-center text-lg font-bold border-2 border-blue-400 rounded-lg focus:border-blue-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 h-12"
                                style={{ 
                                  backgroundColor: isValidated ? '#f3f4f6' : '#ffffff',
                                  color: '#000000'
                                }}
                              />
                              {isValidated && isCorrect && (
                                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-green-500 text-xl">
                                  ✓
                                </div>
                              )}
                              {isValidated && !isCorrect && (
                                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
                                  ✗
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Aperçu de la réponse complexe */}
                        {(userAnswer?.a !== undefined || userAnswer?.alpha !== undefined || userAnswer?.beta !== undefined) && (
                          <div className="mt-4 text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                            <div className="text-sm text-gray-600 mb-2">Aperçu de ta réponse :</div>
                            <div className="font-mono font-bold text-xl text-gray-800">
                              {userAnswer?.a !== undefined ? (userAnswer.a === 1 ? '' : userAnswer.a === -1 ? '-' : `${userAnswer.a}`) : 'a'}(x {userAnswer?.alpha !== undefined ? (userAnswer.alpha >= 0 ? `- ${userAnswer.alpha}` : `+ ${Math.abs(userAnswer.alpha)}`) : '- α'})² {userAnswer?.beta !== undefined ? (userAnswer.beta >= 0 ? `+ ${userAnswer.beta}` : `${userAnswer.beta}`) : '+ β'}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Boutons de validation pour cas complexe */}
                      <div className="text-center space-y-3">
                        {!isValidated ? (
                          <button
                            onClick={() => validateExercise(exerciseId, {alpha: exercise.alpha, beta: exercise.beta, a: exercise.a})}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={userAnswer?.a === undefined || userAnswer?.alpha === undefined || userAnswer?.beta === undefined}
                          >
                            Vérifier ma réponse
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                              <div className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                {isCorrect ? '🎉 Excellent ! +5 XP' : '❌ Pas tout à fait...'}
                              </div>
                              {isCorrect && (
                                <div className="text-sm text-green-600 mt-2">
                                  Forme canonique : {exercise.a === 1 ? '' : exercise.a === -1 ? '-' : `${exercise.a}`}(x - ({exercise.alpha}))² + ({exercise.beta})
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => resetExercise(exerciseId)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                            >
                              Recommencer cet exercice
                            </button>
                          </div>
                        )}

                        {isValidated && !isCorrect && (
                          <button
                            onClick={() => toggleExerciseCorrection(exerciseId)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                          >
                            {showExerciseCorrection[exerciseId] ? 'Masquer la correction' : 'Voir la correction détaillée'}
                          </button>
                        )}
                      </div>

                      {/* Correction détaillée pour cas complexe */}
                      {showExerciseCorrection[exerciseId] && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <div className="font-bold text-gray-800 mb-3">📚 Correction détaillée :</div>
                          <div className="space-y-2">
                            {exercise.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="p-2 bg-gray-50 rounded border-l-4 border-red-400">
                                <div className="font-mono font-bold text-gray-800">{step.text}</div>
                                <div className="text-sm text-gray-600">{step.explanation}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section récapitulatif final */}
        {completedSections.length >= 3 && (
          <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-3xl p-8 shadow-xl text-center">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-3xl font-bold mb-4">Excellente progression !</h2>
            <p className="text-xl mb-6">Tu maîtrises maintenant la forme canonique !</p>
            <div className="bg-white/20 p-6 rounded-2xl inline-block">
              <div className="text-4xl font-bold">{xpEarned} XP</div>
              <div className="text-lg">Total gagné</div>
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