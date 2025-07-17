'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Zap, Calculator, Clock, Play, Pause } from 'lucide-react';

export default function CalculMentalPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const exercises = [
    // Tables de multiplication
    { operation: '7 × 8', answer: 56, type: 'multiplication', difficulty: 'Facile' },
    { operation: '9 × 6', answer: 54, type: 'multiplication', difficulty: 'Facile' },
    { operation: '8 × 7', answer: 56, type: 'multiplication', difficulty: 'Facile' },
    { operation: '6 × 9', answer: 54, type: 'multiplication', difficulty: 'Facile' },
    
    // Additions rapides
    { operation: '47 + 38', answer: 85, type: 'addition', difficulty: 'Facile' },
    { operation: '59 + 27', answer: 86, type: 'addition', difficulty: 'Facile' },
    { operation: '73 + 19', answer: 92, type: 'addition', difficulty: 'Facile' },
    { operation: '84 + 16', answer: 100, type: 'addition', difficulty: 'Facile' },
    
    // Soustractions rapides
    { operation: '73 - 28', answer: 45, type: 'soustraction', difficulty: 'Facile' },
    { operation: '91 - 37', answer: 54, type: 'soustraction', difficulty: 'Facile' },
    { operation: '85 - 49', answer: 36, type: 'soustraction', difficulty: 'Facile' },
    { operation: '100 - 67', answer: 33, type: 'soustraction', difficulty: 'Facile' },
    
    // Multiplications par 10, 100
    { operation: '37 × 10', answer: 370, type: 'multiplication', difficulty: 'Facile' },
    { operation: '8 × 100', answer: 800, type: 'multiplication', difficulty: 'Facile' },
    { operation: '45 × 10', answer: 450, type: 'multiplication', difficulty: 'Facile' },
    { operation: '12 × 100', answer: 1200, type: 'multiplication', difficulty: 'Facile' },
    
    // Divisions simples
    { operation: '56 ÷ 8', answer: 7, type: 'division', difficulty: 'Moyen' },
    { operation: '63 ÷ 7', answer: 9, type: 'division', difficulty: 'Moyen' },
    { operation: '48 ÷ 6', answer: 8, type: 'division', difficulty: 'Moyen' },
    { operation: '81 ÷ 9', answer: 9, type: 'division', difficulty: 'Moyen' },
    
    // Calculs avec compléments
    { operation: '25 + 75', answer: 100, type: 'addition', difficulty: 'Moyen' },
    { operation: '30 + 70', answer: 100, type: 'addition', difficulty: 'Moyen' },
    { operation: '45 + 55', answer: 100, type: 'addition', difficulty: 'Moyen' },
    { operation: '60 + 40', answer: 100, type: 'addition', difficulty: 'Moyen' },
    
    // Doubles et moitiés
    { operation: '2 × 35', answer: 70, type: 'multiplication', difficulty: 'Moyen' },
    { operation: '2 × 48', answer: 96, type: 'multiplication', difficulty: 'Moyen' },
    { operation: '50 ÷ 2', answer: 25, type: 'division', difficulty: 'Moyen' },
    { operation: '84 ÷ 2', answer: 42, type: 'division', difficulty: 'Moyen' },
    
    // Calculs plus complexes
    { operation: '25 × 4', answer: 100, type: 'multiplication', difficulty: 'Difficile' },
    { operation: '125 × 8', answer: 1000, type: 'multiplication', difficulty: 'Difficile' },
    { operation: '15 × 6', answer: 90, type: 'multiplication', difficulty: 'Difficile' },
    { operation: '18 × 5', answer: 90, type: 'multiplication', difficulty: 'Difficile' },
    
    // Suites d'opérations
    { operation: '5 + 3 × 2', answer: 11, type: 'mixte', difficulty: 'Difficile' },
    { operation: '20 - 4 × 3', answer: 8, type: 'mixte', difficulty: 'Difficile' },
    { operation: '7 × 2 + 6', answer: 20, type: 'mixte', difficulty: 'Difficile' },
    { operation: '50 - 6 × 5', answer: 20, type: 'mixte', difficulty: 'Difficile' }
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0 && !showAnswer) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showAnswer) {
      // Temps écoulé
      setShowAnswer(true);
      setIsCorrect(false);
      setAttempts(attempts + 1);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, showAnswer, attempts]);

  const startGame = () => {
    setGameStarted(true);
    setIsRunning(true);
    setTimeLeft(10);
    setTotalTime(0);
    setCurrentExercise(0);
    setScore(0);
    setAttempts(0);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
  };

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    const userNum = parseInt(userAnswer);
    const correct = userNum === exercise.answer;
    
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    setIsRunning(false);
    setTotalTime(totalTime + (10 - timeLeft));
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);
      setTimeLeft(10);
      setIsRunning(true);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
    setTimeLeft(10);
    setIsRunning(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'addition': return 'text-green-600';
      case 'soustraction': return 'text-red-600';
      case 'multiplication': return 'text-blue-600';
      case 'division': return 'text-purple-600';
      case 'mixte': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getTimeColor = () => {
    if (timeLeft > 6) return 'text-green-600';
    if (timeLeft > 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateStats = () => {
    const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
    const avgTime = attempts > 0 ? Math.round(totalTime / attempts) : 0;
    return { accuracy, avgTime };
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/chapitre/cm1-operations-arithmetiques" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Calcul mental et automatismes</h1>
              <p className="text-gray-600">Développer la rapidité et les réflexes en calcul</p>
            </div>
          </div>

          {/* Écran d'accueil */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Défi Calcul Mental</h2>
              <p className="text-gray-600 text-lg">
                Teste ta rapidité en calcul ! Tu as 10 secondes par exercice.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-bold text-orange-800 mb-3">🎯 Objectif</h3>
                <p className="text-gray-700">
                  Résous un maximum d'exercices correctement et rapidement
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-3">⏱️ Règles</h3>
                <p className="text-gray-700">
                  10 secondes par exercice, {exercises.length} exercices au total
                </p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Play className="w-6 h-6" />
              Commencer le défi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { accuracy, avgTime } = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chapitre/cm1-operations-arithmetiques" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Calcul mental et automatismes</h1>
            <p className="text-gray-600">Développer la rapidité et les réflexes en calcul</p>
          </div>
        </div>

        {/* Progression et stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-800">Exercice {currentExercise + 1} / {exercises.length}</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-700">{score}/{attempts}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-700">{accuracy}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${getTimeColor()}`} />
                <span className={`font-bold text-2xl ${getTimeColor()}`}>{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Exercice principal */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getDifficultyColor(getCurrentExercise().difficulty)}`}>
              {getCurrentExercise().difficulty}
            </div>
            <h3 className={`text-4xl font-bold mb-2 ${getTypeColor(getCurrentExercise().type)}`}>
              {getCurrentExercise().operation}
            </h3>
            <p className="text-gray-600 capitalize">
              {getCurrentExercise().type}
            </p>
          </div>

          {/* Zone de réponse */}
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-2xl text-center font-mono bg-white text-gray-900"
                placeholder="Réponse..."
                disabled={showAnswer}
                autoFocus
              />
            </div>

            {!showAnswer ? (
              <div className="flex gap-3">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                  className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Valider
                </button>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isRunning ? 'Pause' : 'Reprendre'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct !' : timeLeft === 0 ? 'Temps écoulé !' : 'Incorrect'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <p className="text-red-700">
                      La bonne réponse est : <span className="font-bold">{getCurrentExercise().answer}</span>
                    </p>
                  )}
                  <p className="text-gray-600 text-sm mt-2">
                    Temps utilisé : {10 - timeLeft} secondes
                  </p>
                </div>

                <div className="flex gap-3">
                  {currentExercise < exercises.length - 1 ? (
                    <button
                      onClick={nextExercise}
                      className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Exercice suivant
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  ) : (
                    <div className="flex-1 text-center">
                      <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mb-4">
                        <h3 className="font-bold text-green-800 mb-2">🎉 Défi terminé !</h3>
                        <div className="text-gray-700">
                          <p>Score : {score}/{attempts} ({accuracy}%)</p>
                          <p>Temps moyen : {avgTime} secondes</p>
                        </div>
                      </div>
                      <Link
                        href="/chapitre/cm1-operations-arithmetiques"
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors inline-flex items-center gap-2"
                      >
                        <Trophy className="w-5 h-5" />
                        Retour au chapitre
                      </Link>
                    </div>
                  )}
                  <button
                    onClick={resetExercise}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Refaire
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conseils */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-gray-800">Stratégies de calcul mental</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">⚡ Techniques rapides :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Apprends tes tables par cœur</li>
                <li>• Utilise les compléments à 10 et 100</li>
                <li>• Décompose les nombres (45 + 27 = 40 + 20 + 5 + 7)</li>
                <li>• Mémorise les doubles et les moitiés</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">🎯 Astuces pratiques :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multiplier par 10 : ajouter un zéro</li>
                <li>• Multiplier par 25 : multiplier par 100 et diviser par 4</li>
                <li>• Multiplier par 5 : multiplier par 10 et diviser par 2</li>
                <li>• Soustraire 9 : soustraire 10 et ajouter 1</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 