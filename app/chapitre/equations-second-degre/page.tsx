'use client';

import { useState } from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ExerciseCard from '../../components/ExerciseCard';
import FormulaSection from '../../components/FormulaSection';
import GraphSection from './components/GraphSection';

export default function EquationsSecondDegrePage() {
  const [coefficients, setCoefficients] = useState({ a: 0.5, b: 2, c: 6 });
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [highlightedExample, setHighlightedExample] = useState<number | null>(null);

  const quizQuestions = [
    { 
      equation: "3x² + 2x - 1 = 0", 
      isSecondDegree: true, 
      explanation: "Forme ax² + bx + c avec a≠0",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "On a bien la forme ax² + bx + c = 0 avec :\n• a = 3 (≠ 0) ✓\n• b = 2\n• c = -1\nComme a ≠ 0, c'est bien une équation du second degré."
      }
    },
    { 
      equation: "5x - 3 = 0", 
      isSecondDegree: false, 
      explanation: "Pas de terme en x², c'est du 1er degré",
      detailedCorrection: {
        why: "Cette équation N'EST PAS du second degré",
        details: "Il n'y a pas de terme en x² !\n• Terme en x² : absent (a = 0)\n• Terme en x : 5x (b = 5)\n• Terme constant : -3 (c = -3)\nSans terme en x², c'est une équation du 1er degré."
      }
    },
    { 
      equation: "x² = 16", 
      isSecondDegree: true, 
      explanation: "Même si b=0 et c=-16, on a bien x² donc 2nd degré",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "On peut la réécrire sous forme standard :\n• x² = 16\n• x² - 16 = 0\n• a = 1 (≠ 0) ✓\n• b = 0 (le terme en x peut être absent)\n• c = -16\nMême si b = 0, on a bien x² donc c'est du second degré."
      }
    },
    { 
      equation: "2x³ + x² - 1 = 0", 
      isSecondDegree: false, 
      explanation: "Degré 3 à cause du x³",
      detailedCorrection: {
        why: "Cette équation N'EST PAS du second degré",
        details: "Le terme de plus haut degré est x³ !\n• Terme en x³ : 2x³ (degré 3)\n• Terme en x² : x²\n• Terme constant : -1\nLe degré d'une équation = degré du terme le plus élevé. Ici c'est 3, pas 2."
      }
    },
    { 
      equation: "-x² + 7 = 0", 
      isSecondDegree: true, 
      explanation: "a=-1, b=0, c=7, c'est bien du 2nd degré",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "Forme ax² + bx + c = 0 avec :\n• a = -1 (≠ 0) ✓\n• b = 0 (pas de terme en x)\n• c = 7\nMême si a est négatif, tant que a ≠ 0, c'est du second degré."
      }
    }
  ];

  const generateParabolaPoints = () => {
    const points = [];
    const { a, b, c } = coefficients;
    for (let x = -8; x <= 8; x += 0.2) {
      const y = a * x * x + b * x + c;
      // Ajustement de l'échelle pour une meilleure visibilité
      const scaledX = (x + 8) * 12.5;
      const scaledY = 100 + (y * -5); // Centré sur y=100 avec échelle inversée
      if (scaledY >= 0 && scaledY <= 200) {
        points.push(`${scaledX},${scaledY}`);
      }
    }
    return points.join(' ');
  };

  const handleQuizAnswer = (answer: boolean) => {
    if (currentQuestionAnswered) return;
    
    const correct = answer === quizQuestions[currentQuizQuestion].isSecondDegree;
    setQuizAnswers(prev => [...prev, correct]);
    setCurrentQuestionAnswered(true);
    setLastAnswerCorrect(correct);
    
    if (!correct) {
      setShowCorrection(true);
    } else {
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
      setCurrentQuestionAnswered(false);
      setShowCorrection(false);
    } else {
      setShowQuizResults(true);
    }
  };

  const handleCorrectionValidated = () => {
    setShowCorrection(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 300);
  };

  const sections = [
    {
      id: 'intro',
      title: 'Définition',
      icon: '📝',
      content: (
        <div className="space-y-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col h-full">
              <h3 className="text-base font-bold text-gray-900 mb-3">Définition</h3>
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white p-4 rounded-xl shadow-lg flex-1 flex flex-col justify-center">
                <p className="text-sm mb-6">
                  Une équation du <strong className="text-yellow-300">second degré</strong> a la forme :
                </p>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20 shadow-inner text-center mb-6">
                  <span className="text-xl font-mono font-bold tracking-wide">ax² + bx + c = 0</span>
                </div>
                <p className="text-sm bg-white/10 p-2 rounded-lg inline-block">
                  avec <strong className="text-yellow-300">a ≠ 0</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <h3 className="text-base font-bold text-gray-900 mb-3">Exemples :</h3>
              <div className="space-y-3">
                <div 
                  className={`p-4 rounded-xl transition-all duration-500 cursor-pointer ${
                    highlightedExample === 0 
                    ? 'bg-gradient-to-r from-green-100 to-green-50 shadow-lg scale-102 border border-green-200' 
                    : 'bg-green-50 hover:bg-green-100/50'
                  }`}
                  onClick={() => {
                    setHighlightedExample(0);
                    setTimeout(() => setHighlightedExample(null), 1500);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-base font-bold text-green-800">2x² + 3x - 1 = 0</div>
                    <div className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-lg flex items-center">
                      <span className="mr-2">✓</span>
                      Second degré
                    </div>
                  </div>
                </div>
                <div 
                  className={`p-4 rounded-xl transition-all duration-500 cursor-pointer ${
                    highlightedExample === 1 
                    ? 'bg-gradient-to-r from-red-100 to-red-50 shadow-lg scale-102 border border-red-200' 
                    : 'bg-red-50 hover:bg-red-100/50'
                  }`}
                  onClick={() => {
                    setHighlightedExample(1);
                    setTimeout(() => setHighlightedExample(null), 1500);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-base font-bold text-red-800">3x + 7 = 0</div>
                    <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-lg flex items-center">
                      <span className="mr-2">×</span>
                      Premier degré
                    </div>
                  </div>
                </div>
                <div 
                  className={`p-4 rounded-xl transition-all duration-500 cursor-pointer ${
                    highlightedExample === 2 
                    ? 'bg-gradient-to-r from-red-100 to-red-50 shadow-lg scale-102 border border-red-200' 
                    : 'bg-red-50 hover:bg-red-100/50'
                  }`}
                  onClick={() => {
                    setHighlightedExample(2);
                    setTimeout(() => setHighlightedExample(null), 1500);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-base font-bold text-red-800">x³ - 2x = 0</div>
                    <div className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-lg flex items-center">
                      <span className="mr-2">×</span>
                      Degré 3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 20
    },
    {
      id: 'graph',
      title: 'Représentation graphique 📊',
      icon: '📈',
      content: (
        <>
          {/* Version mobile */}
          <div className="block sm:hidden">
            <GraphSection 
              onSectionComplete={() => {}} 
              completedSections={[]} 
              coefficients={coefficients}
              setCoefficients={setCoefficients}
            />
          </div>

          {/* Version desktop */}
          <div className="hidden sm:block space-y-8 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 text-white p-3 rounded-lg shadow">
              <p className="text-sm">Le graphique d'une équation du second degré est une <strong className="text-yellow-200">parabole</strong>.</p>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50 p-3 rounded-lg border border-gray-200 shadow">
              <div className="flex flex-col gap-2">
                <div className="font-mono text-sm font-bold text-center whitespace-nowrap">
                  <span className="text-gray-600">f(x) = </span>
                  <span className="text-blue-600">{coefficients.a}</span>
                  <span className="text-gray-600">x² + </span>
                  <span className="text-green-600">{coefficients.b}</span>
                  <span className="text-gray-600">x + </span>
                  <span className="text-purple-600">{coefficients.c}</span>
                </div>

                <div className="max-w-lg mx-auto space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-blue-800 font-bold">
                          a = {coefficients.a}
                        </label>
                        <span className="text-xs text-blue-600">Ouverture</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.25"
                        value={coefficients.a}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value === 0) return;
                          setCoefficients(prev => ({ ...prev, a: value }));
                        }}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer slider slider-a"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-green-800 font-bold">
                          b = {coefficients.b}
                        </label>
                        <span className="text-xs text-green-600">Horizontal</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="0.5"
                        value={coefficients.b}
                        onChange={(e) => setCoefficients(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer slider slider-b"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-purple-800 font-bold">
                          c = {coefficients.c}
                        </label>
                        <span className="text-xs text-purple-600">Vertical</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="-4"
                        max="4"
                        step="0.5"
                        value={coefficients.c}
                        onChange={(e) => setCoefficients(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer slider slider-c"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-0.5 bg-blue-500"></div>
                      <span>Courbe</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-0.5 border-t border-dashed border-gray-400"></div>
                      <span>Axes</span>
                    </div>
                  </div>
                </div>
                
                <svg viewBox="0 0 200 200" className="w-full h-48 sm:h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                    <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="#8b5cf6"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grille de fond */}
                  <rect width="200" height="200" fill="url(#grid)" />
                  
                  {/* Axes */}
                  <line x1="0" y1="100" x2="200" y2="100" stroke="#6b7280" strokeWidth="1" opacity="0.7" strokeDasharray="4 2"/>
                  <line x1="100" y1="0" x2="100" y2="200" stroke="#6b7280" strokeWidth="1" opacity="0.7" strokeDasharray="4 2"/>
                  
                  {/* Graduations */}
                  <text x="185" y="95" fontSize="8" fill="#6b7280">x</text>
                  <text x="105" y="15" fontSize="8" fill="#6b7280">y</text>
                  
                  {/* Parabole */}
                  <polyline
                    points={generateParabolaPoints()}
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Point O */}
                  <circle cx="100" cy="100" r="3" fill="#8b5cf6">
                    <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <text x="106" y="96" fontSize="10" fill="#6b7280" className="font-medium">O</text>
                </svg>
              </div>
            </div>
          </div>
        </>
      ),
      xpReward: 25
    },
    {
      id: 'quiz',
      title: 'Quiz : Reconnaître les équations du second degré 🎯',
      icon: '🧠',
      content: (
        <div className="space-y-6">
          {!showQuizResults ? (
            <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-800">
                  Question {currentQuizQuestion + 1} sur {quizQuestions.length}
                </h4>
                <div className="text-sm text-gray-600">
                  Score: {quizAnswers.filter(Boolean).length} / {quizAnswers.length}
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="font-mono text-2xl font-bold text-blue-600 mb-2">
                  {quizQuestions[currentQuizQuestion].equation}
                </div>
                <p className="text-gray-600">Cette équation est-elle du second degré ?</p>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => handleQuizAnswer(true)}
                  disabled={currentQuestionAnswered}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    currentQuestionAnswered
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white transform hover:scale-105'
                  }`}
                >
                  ✅ Oui
                </button>
                <button
                  onClick={() => handleQuizAnswer(false)}
                  disabled={currentQuestionAnswered}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                    currentQuestionAnswered
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 text-white transform hover:scale-105'
                  }`}
                >
                  ❌ Non
                </button>
              </div>

              {currentQuestionAnswered && (
                <div className={`p-4 rounded-lg border-l-4 ${
                  lastAnswerCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                }`}>
                  <div className={`font-bold ${
                    lastAnswerCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {lastAnswerCorrect ? '✅ Correct !' : '❌ Incorrect'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {quizQuestions[currentQuizQuestion].explanation}
                  </div>
                </div>
              )}

              {showCorrection && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                  <div className="font-bold text-blue-800 mb-2">
                    {quizQuestions[currentQuizQuestion].detailedCorrection.why}
                  </div>
                  <div className="text-sm text-blue-700 whitespace-pre-line">
                    {quizQuestions[currentQuizQuestion].detailedCorrection.details}
                  </div>
                  <button
                    onClick={handleCorrectionValidated}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Compris ! Continuer
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border-2 border-gray-300 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Quiz terminé !</h4>
              <div className="text-lg text-gray-600 mb-6">
                Score final : {quizAnswers.filter(Boolean).length} / {quizAnswers.length}
              </div>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="font-bold">+35 XP gagné !</div>
                <div className="text-sm mt-1">Excellente compréhension des équations du second degré</div>
              </div>
            </div>
          )}
        </div>
      ),
      xpReward: 35
    }
  ];

  return (
    <ChapterLayout
      title="Équations du Second Degré"
      description=""
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-resolution', text: 'Résolution' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
} 