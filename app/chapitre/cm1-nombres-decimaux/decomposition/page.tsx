'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight, Trophy, Target, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

export default function DecomposerNombresDecimauxPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [decompositionType, setDecompositionType] = useState<'additive' | 'multiplicative'>('additive');

  const exercises = [
    {
      id: 1,
      number: "2.5",
      additive: ["2", "0.5"],
      multiplicative: ["2×1", "5×0.1"],
      difficulty: "Facile"
    },
    {
      id: 2,
      number: "3.47",
      additive: ["3", "0.4", "0.07"],
      multiplicative: ["3×1", "4×0.1", "7×0.01"],
      difficulty: "Facile"
    },
    {
      id: 3,
      number: "0.8",
      additive: ["0.8"],
      multiplicative: ["8×0.1"],
      difficulty: "Facile"
    },
    {
      id: 4,
      number: "12.06",
      additive: ["10", "2", "0.06"],
      multiplicative: ["1×10", "2×1", "6×0.01"],
      difficulty: "Facile"
    },
    {
      id: 5,
      number: "0.123",
      additive: ["0.1", "0.02", "0.003"],
      multiplicative: ["1×0.1", "2×0.01", "3×0.001"],
      difficulty: "Facile"
    },
    {
      id: 6,
      number: "7.34",
      additive: ["7", "0.3", "0.04"],
      multiplicative: ["7×1", "3×0.1", "4×0.01"],
      difficulty: "Facile"
    },
    {
      id: 7,
      number: "25.409",
      additive: ["20", "5", "0.4", "0.009"],
      multiplicative: ["2×10", "5×1", "4×0.1", "9×0.001"],
      difficulty: "Moyen"
    },
    {
      id: 8,
      number: "0.056",
      additive: ["0.05", "0.006"],
      multiplicative: ["5×0.01", "6×0.001"],
      difficulty: "Moyen"
    },
    {
      id: 9,
      number: "18.205",
      additive: ["10", "8", "0.2", "0.005"],
      multiplicative: ["1×10", "8×1", "2×0.1", "5×0.001"],
      difficulty: "Moyen"
    },
    {
      id: 10,
      number: "0.07",
      additive: ["0.07"],
      multiplicative: ["7×0.01"],
      difficulty: "Moyen"
    },
    {
      id: 11,
      number: "34.678",
      additive: ["30", "4", "0.6", "0.07", "0.008"],
      multiplicative: ["3×10", "4×1", "6×0.1", "7×0.01", "8×0.001"],
      difficulty: "Moyen"
    },
    {
      id: 12,
      number: "0.902",
      additive: ["0.9", "0.002"],
      multiplicative: ["9×0.1", "2×0.001"],
      difficulty: "Moyen"
    },
    {
      id: 13,
      number: "67.145",
      additive: ["60", "7", "0.1", "0.04", "0.005"],
      multiplicative: ["6×10", "7×1", "1×0.1", "4×0.01", "5×0.001"],
      difficulty: "Difficile"
    },
    {
      id: 14,
      number: "0.089",
      additive: ["0.08", "0.009"],
      multiplicative: ["8×0.01", "9×0.001"],
      difficulty: "Difficile"
    },
    {
      id: 15,
      number: "152.037",
      additive: ["100", "50", "2", "0.03", "0.007"],
      multiplicative: ["1×100", "5×10", "2×1", "3×0.01", "7×0.001"],
      difficulty: "Difficile"
    },
    {
      id: 16,
      number: "0.604",
      additive: ["0.6", "0.004"],
      multiplicative: ["6×0.1", "4×0.001"],
      difficulty: "Difficile"
    },
    {
      id: 17,
      number: "89.256",
      additive: ["80", "9", "0.2", "0.05", "0.006"],
      multiplicative: ["8×10", "9×1", "2×0.1", "5×0.01", "6×0.001"],
      difficulty: "Difficile"
    },
    {
      id: 18,
      number: "0.507",
      additive: ["0.5", "0.007"],
      multiplicative: ["5×0.1", "7×0.001"],
      difficulty: "Difficile"
    },
    {
      id: 19,
      number: "245.183",
      additive: ["200", "40", "5", "0.1", "0.08", "0.003"],
      multiplicative: ["2×100", "4×10", "5×1", "1×0.1", "8×0.01", "3×0.001"],
      difficulty: "Difficile"
    },
    {
      id: 20,
      number: "0.999",
      additive: ["0.9", "0.09", "0.009"],
      multiplicative: ["9×0.1", "9×0.01", "9×0.001"],
      difficulty: "Difficile"
    }
  ];

  const currentEx = exercises[currentExercise];
  const currentDecomposition = decompositionType === 'additive' ? currentEx.additive : currentEx.multiplicative;

  const handleInputChange = (index: number, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [`${currentExercise}-${decompositionType}-${index}`]: value
    }));
  };

  const checkAnswer = () => {
    let correct = true;
    for (let i = 0; i < currentDecomposition.length; i++) {
      const userAnswer = userAnswers[`${currentExercise}-${decompositionType}-${i}`] || '';
      const correctAnswer = currentDecomposition[i];
      if (userAnswer.replace(',', '.') !== correctAnswer.replace(',', '.')) {
        correct = false;
        break;
      }
    }
    
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
    }
    setShowAnswer(false);
    setIsCorrect(false);
    setShowHelp(false);
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
    }
    setShowAnswer(false);
    setIsCorrect(false);
    setShowHelp(false);
  };

  const resetExercise = () => {
    const keysToRemove = Object.keys(userAnswers).filter(key => 
      key.startsWith(`${currentExercise}-${decompositionType}-`)
    );
    keysToRemove.forEach(key => {
      setUserAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[key];
        return newAnswers;
      });
    });
    setShowAnswer(false);
    setIsCorrect(false);
    setShowHelp(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswers({});
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
    setShowHelp(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: string) => {
    return num.replace('.', ',');
  };

  const calculateScore = () => {
    return attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  };

  const isAnswerComplete = () => {
    for (let i = 0; i < currentDecomposition.length; i++) {
      const userAnswer = userAnswers[`${currentExercise}-${decompositionType}-${i}`] || '';
      if (!userAnswer.trim()) return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/nombres-decimaux" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧩 Décomposer les nombres décimaux
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Décompose les nombres décimaux selon leurs positions
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-800">Score: {score}/{attempts}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-gray-800">Réussite: {calculateScore()}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sélecteur de type de décomposition */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📋 Type de décomposition
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDecompositionType('additive')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                decompositionType === 'additive'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {decompositionType === 'additive' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span>Additive</span>
            </button>
            <button
              onClick={() => setDecompositionType('multiplicative')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                decompositionType === 'multiplicative'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {decompositionType === 'multiplicative' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span>Multiplicative</span>
            </button>
          </div>
          <div className="mt-4">
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">
                  🔍 Mode sélectionné : <span className="text-blue-600">{decompositionType === 'additive' ? 'Additive' : 'Multiplicative'}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {decompositionType === 'additive' ? 
                    'Décompose en additionnant les valeurs de chaque position' : 
                    'Décompose en multipliant chaque chiffre par sa valeur de position'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercice */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          {/* Header exercice */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-gray-900">
                Exercice {currentExercise + 1}/{exercises.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentEx.difficulty)}`}>
                {currentEx.difficulty}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetExercise}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={resetAll}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-red-200 text-red-700 rounded-lg hover:bg-red-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tout reset</span>
              </button>
            </div>
          </div>

          {/* Tableau des positions - affiché seulement avec l'aide ou après correction */}
          {(showHelp || showAnswer) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📊 Tableau des positions pour {formatNumber(currentEx.number)}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-gray-700">Centaines</th>
                      <th className="border border-gray-300 p-3 text-gray-700">Dizaines</th>
                      <th className="border border-gray-300 p-3 text-gray-700">Unités</th>
                      <th className="border border-gray-300 p-3 text-gray-700 bg-yellow-100">Virgule</th>
                      <th className="border border-gray-300 p-3 text-gray-700 bg-green-100">Dixièmes</th>
                      <th className="border border-gray-300 p-3 text-gray-700 bg-blue-100">Centièmes</th>
                      <th className="border border-gray-300 p-3 text-gray-700 bg-purple-100">Millièmes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="border border-gray-300 p-4 text-gray-500 text-sm">100</td>
                      <td className="border border-gray-300 p-4 text-gray-500 text-sm">10</td>
                      <td className="border border-gray-300 p-4 text-gray-500 text-sm">1</td>
                      <td className="border border-gray-300 p-4 text-yellow-600 text-2xl font-bold bg-yellow-50">,</td>
                      <td className="border border-gray-300 p-4 text-gray-500 text-sm bg-green-50">0,1</td>
                      <td className="border border-gray-300 p-4 text-gray-500 text-sm bg-blue-50">0,01</td>
                      <td className="border border-gray-300 p-4 text-gray-500 text-sm bg-purple-50">0,001</td>
                    </tr>
                    <tr className="text-center">
                      {(() => {
                        const [integerPart, decimalPart] = currentEx.number.split('.');
                        const paddedInteger = integerPart.padStart(3, '0');
                        const paddedDecimal = (decimalPart || '').padEnd(3, '0');
                        
                        return (
                          <>
                            <td className="border border-gray-300 p-4 text-2xl font-bold text-gray-800 h-16">
                              {paddedInteger[0] !== '0' ? paddedInteger[0] : ''}
                            </td>
                            <td className="border border-gray-300 p-4 text-2xl font-bold text-gray-800 h-16">
                              {paddedInteger[1] !== '0' ? paddedInteger[1] : ''}
                            </td>
                            <td className="border border-gray-300 p-4 text-2xl font-bold text-gray-800 h-16">
                              {paddedInteger[2]}
                            </td>
                            <td className="border border-gray-300 p-4 text-2xl font-bold text-yellow-600 h-16 bg-yellow-50">
                              {decimalPart ? ',' : ''}
                            </td>
                            <td className="border border-gray-300 p-4 text-2xl font-bold text-gray-800 h-16 bg-green-50">
                              {paddedDecimal[0] !== '0' ? paddedDecimal[0] : ''}
                            </td>
                            <td className="border border-gray-300 p-4 text-2xl font-bold text-gray-800 h-16 bg-blue-50">
                              {paddedDecimal[1] !== '0' ? paddedDecimal[1] : ''}
                            </td>
                            <td className="border border-gray-300 p-4 text-2xl font-bold text-gray-800 h-16 bg-purple-50">
                              {paddedDecimal[2] !== '0' ? paddedDecimal[2] : ''}
                            </td>
                          </>
                        );
                      })()}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Exemple générique pour comprendre la méthode */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-4 border-2 border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📚 Exemple pour comprendre la méthode :
              </h3>
              {decompositionType === 'additive' ? (
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    <span className="text-indigo-600">Décomposition additive</span>
                  </div>
                  <div className="text-lg text-gray-700 mb-4">
                    <span className="text-blue-600 font-bold">15,37</span>
                    <span className="mx-3 text-gray-500">=</span>
                    <span className="text-green-600 font-semibold">10</span>
                    <span className="mx-2 text-gray-400">+</span>
                    <span className="text-green-600 font-semibold">5</span>
                    <span className="mx-2 text-gray-400">+</span>
                    <span className="text-orange-600 font-semibold">0,3</span>
                    <span className="mx-2 text-gray-400">+</span>
                    <span className="text-orange-600 font-semibold">0,07</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Chaque chiffre est décomposé selon sa position : dizaines, unités, dixièmes, centièmes...
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    <span className="text-purple-600">Décomposition multiplicative</span>
                  </div>
                  <div className="text-lg text-gray-700 mb-4">
                    <span className="text-blue-600 font-bold">15,37</span>
                    <span className="mx-3 text-gray-500">=</span>
                    <span className="text-green-600 font-semibold">1×10</span>
                    <span className="mx-2 text-gray-400">+</span>
                    <span className="text-green-600 font-semibold">5×1</span>
                    <span className="mx-2 text-gray-400">+</span>
                    <span className="text-orange-600 font-semibold">3×0,1</span>
                    <span className="mx-2 text-gray-400">+</span>
                    <span className="text-orange-600 font-semibold">7×0,01</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Chaque chiffre est multiplié par sa valeur de position : 10, 1, 0,1, 0,01...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                💡 Décomposition {decompositionType === 'additive' ? 'additive' : 'multiplicative'} de {formatNumber(currentEx.number)} :
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xl">
                <span className="font-bold text-blue-600">{formatNumber(currentEx.number)} =</span>
                {currentDecomposition.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={userAnswers[`${currentExercise}-${decompositionType}-${index}`] || ''}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-center font-mono bg-white text-gray-900 placeholder-gray-400"
                      placeholder="?"
                      disabled={showAnswer}
                    />
                    {index < currentDecomposition.length - 1 && (
                      <span className="mx-2 text-gray-600">+</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!showAnswer && (
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={checkAnswer}
                  disabled={!isAnswerComplete()}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    isAnswerComplete()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Vérifier
                </button>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center space-x-2 px-4 py-3 bg-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-300 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Aide</span>
                </button>
              </div>
            )}

            {showHelp && !showAnswer && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 mb-4">
                  <strong>💡 Aide:</strong> 
                  {decompositionType === 'additive' ? (
                    " Décompose chaque chiffre selon sa position. Voici un exemple détaillé :"
                  ) : (
                    " Multiplie chaque chiffre par sa valeur de position. Voici un exemple détaillé :"
                  )}
                </p>
                
                {decompositionType === 'additive' ? (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-800 mb-3">
                        📚 Exemple de décomposition additive :
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-4">
                        <span className="text-blue-600">12,47</span>
                        <span className="mx-3 text-gray-500">=</span>
                        <span className="text-green-600">10</span>
                        <span className="mx-2 text-gray-400">+</span>
                        <span className="text-green-600">2</span>
                        <span className="mx-2 text-gray-400">+</span>
                        <span className="text-orange-600">0,4</span>
                        <span className="mx-2 text-gray-400">+</span>
                        <span className="text-orange-600">0,07</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="bg-green-100 rounded-lg p-2 border border-green-300">
                          <div className="font-semibold text-green-800">10</div>
                          <div className="text-green-600">dizaines</div>
                        </div>
                        <div className="bg-green-100 rounded-lg p-2 border border-green-300">
                          <div className="font-semibold text-green-800">2</div>
                          <div className="text-green-600">unités</div>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-2 border border-orange-300">
                          <div className="font-semibold text-orange-800">0,4</div>
                          <div className="text-orange-600">dixièmes</div>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-2 border border-orange-300">
                          <div className="font-semibold text-orange-800">0,07</div>
                          <div className="text-orange-600">centièmes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-purple-800 mb-3">
                        📚 Exemple de décomposition multiplicative :
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-4">
                        <span className="text-purple-600">12,47</span>
                        <span className="mx-3 text-gray-500">=</span>
                        <span className="text-green-600">1×10</span>
                        <span className="mx-2 text-gray-400">+</span>
                        <span className="text-green-600">2×1</span>
                        <span className="mx-2 text-gray-400">+</span>
                        <span className="text-orange-600">4×0,1</span>
                        <span className="mx-2 text-gray-400">+</span>
                        <span className="text-orange-600">7×0,01</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="bg-green-100 rounded-lg p-2 border border-green-300">
                          <div className="font-semibold text-green-800">1×10</div>
                          <div className="text-green-600">1 dizaine</div>
                        </div>
                        <div className="bg-green-100 rounded-lg p-2 border border-green-300">
                          <div className="font-semibold text-green-800">2×1</div>
                          <div className="text-green-600">2 unités</div>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-2 border border-orange-300">
                          <div className="font-semibold text-orange-800">4×0,1</div>
                          <div className="text-orange-600">4 dixièmes</div>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-2 border border-orange-300">
                          <div className="font-semibold text-orange-800">7×0,01</div>
                          <div className="text-orange-600">7 centièmes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {showAnswer && (
              <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '🎉 Correct !' : '❌ Incorrect'}
                  </span>
                </div>
                <div className="text-sm">
                  <p className={`mb-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    <strong>Décomposition correcte:</strong> {formatNumber(currentEx.number)} = {currentDecomposition.map(part => formatNumber(part)).join(' + ')}
                  </p>
                  
                  {/* Explication détaillée */}
                  <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      📚 Explication de la méthode :
                    </div>
                    {decompositionType === 'additive' ? (
                      <div className="space-y-2 text-xs text-gray-600">
                        <p>• Chaque chiffre est décomposé selon sa position dans le nombre</p>
                        <p>• Les chiffres avant la virgule représentent les unités, dizaines, centaines...</p>
                        <p>• Les chiffres après la virgule représentent les dixièmes, centièmes, millièmes...</p>
                        <p>• On additionne toutes ces valeurs pour reconstituer le nombre</p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs text-gray-600">
                        <p>• Chaque chiffre est multiplié par sa valeur de position</p>
                        <p>• Positions entières : 1, 10, 100, 1000...</p>
                        <p>• Positions décimales : 0,1, 0,01, 0,001...</p>
                        <p>• On additionne tous ces produits pour reconstituer le nombre</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevExercise}
                disabled={currentExercise === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentExercise > 0
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              {showAnswer && (
                <button
                  onClick={nextExercise}
                  disabled={currentExercise >= exercises.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentExercise < exercises.length - 1
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentExercise === exercises.length - 1 && showAnswer && (
                <Link
                  href="/chapitre/nombres-decimaux/representer"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all"
                >
                  <span>Représenter →</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 