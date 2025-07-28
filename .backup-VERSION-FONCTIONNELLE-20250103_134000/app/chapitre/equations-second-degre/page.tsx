'use client';

import { useState } from 'react';
import ChapterLayout from '../../components/ChapterLayout';
import ExerciseCard from '../../components/ExerciseCard';
import FormulaSection from '../../components/FormulaSection';

export default function EquationsSecondDegrePage() {
  const [coefficients, setCoefficients] = useState({ a: 1, b: 0, c: 0 });
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

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
    for (let x = -8; x <= 8; x += 0.3) {
      const y = a * x * x + b * x + c;
      if (y >= -15 && y <= 15) {
        points.push(`${(x + 8) * 12.5},${(15 - y) * 8 + 120}`);
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
      title: 'Qu\'est-ce qu\'une équation du second degré ? 🤔',
      icon: '💡',
      content: (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3">Définition</h3>
                <p className="text-lg">
                  Une équation du <strong>second degré</strong> a la forme :
                </p>
                <div className="bg-white/20 p-4 rounded-lg mt-4 text-center">
                  <span className="text-2xl font-mono font-bold">ax² + bx + c = 0</span>
                </div>
                <p className="mt-3 text-sm">
                  avec <strong>a ≠ 0</strong> (sinon ce ne serait plus du 2nd degré !)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold">a</span>
                  <span className="text-gray-700">: coefficient de x² (ne peut pas être 0)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600 font-bold">b</span>
                  <span className="text-gray-700">: coefficient de x (peut être 0)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600 font-bold">c</span>
                  <span className="text-gray-700">: terme constant (peut être 0)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Exemples :</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="font-mono text-lg font-bold text-green-800">2x² + 3x - 1 = 0</div>
                  <div className="text-sm text-green-600">a=2, b=3, c=-1 ✅</div>
                </div>
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="font-mono text-lg font-bold text-green-800">x² - 5 = 0</div>
                  <div className="text-sm text-green-600">a=1, b=0, c=-5 ✅</div>
                </div>
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div className="font-mono text-lg font-bold text-red-800">3x + 7 = 0</div>
                  <div className="text-sm text-red-600">Pas de x² ❌ (1er degré)</div>
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
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Le graphique d'une équation du second degré</h3>
            <p className="text-lg">
              Le graphique d'une fonction du second degré f(x) = ax² + bx + c est une <strong>parabole</strong> !
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 mb-4">🎛️ Graphique interactif</h4>
            <div className="text-center mb-4">
              <div className="font-mono text-lg font-bold text-blue-600">
                f(x) = {coefficients.a}x² + {coefficients.b}x + {coefficients.c}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">a = {coefficients.a}</label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.5"
                  value={coefficients.a}
                  onChange={(e) => setCoefficients(prev => ({ ...prev, a: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Influence l'ouverture</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">b = {coefficients.b}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefficients.b}
                  onChange={(e) => setCoefficients(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Influence la position</div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">c = {coefficients.c}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefficients.c}
                  onChange={(e) => setCoefficients(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">Décalage vertical</div>
              </div>
            </div>

            <svg viewBox="0 0 200 200" className="w-full h-64 bg-gray-50 rounded-lg border">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#grid)" />
              
              <line x1="0" y1="100" x2="200" y2="100" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
              <line x1="100" y1="0" x2="100" y2="200" stroke="#6b7280" strokeWidth="2" opacity="0.7"/>
              
              <polyline
                points={generateParabolaPoints()}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              <circle cx="100" cy="100" r="3" fill="#ef4444" />
              <text x="105" y="105" fontSize="8" fill="#374151">O</text>
            </svg>
          </div>
        </div>
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
      description="Découverte et reconnaissance des équations du second degré"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-resolution', text: 'Résolution' }
      }}
    />
  );
} 