'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Award, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function RepresenterNombresEntiersPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [showTheoryReminder, setShowTheoryReminder] = useState(true);
  const [draggedNumber, setDraggedNumber] = useState<number | null>(null);

  const exercises = [
    // Exercices Faciles (1-6) - Nombres à 4 chiffres - nombres complexes
         {
       id: 1,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 2463,
       min: 2000,
       max: 3000,
       step: 50,
       displayStep: 200,
       difficulty: "Facile",
       explanation: "2463 est situé entre 2400 et 2600, plus près de 2400",
       hint: "Graduations principales : 2000, 2200, 2400, 2600, 2800, 3000. Place 2463 entre 2400 et 2600"
     },
         {
       id: 2,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 1687,
       min: 1000,
       max: 2000,
       step: 25,
       displayStep: 250,
       difficulty: "Facile",
       explanation: "1687 est situé entre 1500 et 1750, plus près de 1750",
       hint: "Graduations principales : 1000, 1250, 1500, 1750, 2000. Place 1687 entre 1500 et 1750"
     },
    {
      id: 3,
      type: 'comparison' as const,
      title: "Quel nombre est le plus grand ?",
      numbers: [4783, 4597, 4729],
      correct: 4783,
      difficulty: "Facile",
      explanation: "4783 > 4729 > 4597 car on compare les centaines puis les dizaines",
      hint: "Compare les chiffres de gauche à droite : 4783 a 7 centaines, 4729 a 7 centaines mais 8 dizaines"
    },
         {
       id: 4,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 3594,
       min: 3000,
       max: 4000,
       step: 20,
       displayStep: 200,
       difficulty: "Facile",
       explanation: "3594 est situé entre 3400 et 3600, plus près de 3600",
       hint: "Graduations principales : 3000, 3200, 3400, 3600, 3800, 4000. Place 3594 entre 3400 et 3600"
     },
    {
      id: 5,
      type: 'comparison' as const,
      title: "Quel nombre est le plus petit ?",
      numbers: [8967, 8579, 8986],
      correct: 8579,
      difficulty: "Facile",
      explanation: "8579 < 8967 < 8986 car on compare les centaines : 5 < 9",
      hint: "Compare les centaines : 8579 a 5 centaines, les autres ont 9 centaines"
    },
              {
       id: 6,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 5483,
       min: 5000,
       max: 6000,
       step: 10,
       displayStep: 200,
       difficulty: "Facile",
       explanation: "5483 est situé entre 5400 et 5500, plus près de 5500",
       hint: "Graduations principales : 5000, 5200, 5400, 5600, 5800, 6000. Place 5483 entre 5400 et 5600"
     },

    // Exercices Moyens (7-14) - Nombres à 5-6 chiffres - nombres complexes
     {
       id: 7,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 26847,
       min: 20000,
       max: 30000,
       step: 250,
       displayStep: 2000,
       difficulty: "Moyen",
       explanation: "26847 est situé entre 26000 et 28000, plus près de 26000",
       hint: "Graduations principales : 20000, 22000, 24000, 26000, 28000, 30000. Place 26847 entre 26000 et 28000"
     },
         {
       id: 8,
       type: 'comparison' as const,
       title: "Quel nombre est le plus grand ?",
       numbers: [67913, 67987, 67839],
       correct: 67987,
       difficulty: "Moyen",
       explanation: "67987 > 67913 > 67839 car on compare les centaines : 9 > 9 > 8, puis les dizaines",
       hint: "Compare les centaines : 67987 a 9 centaines, 67913 a 9 centaines, 67839 a 8 centaines"
     },
         {
       id: 9,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 132847,
       min: 120000,
       max: 160000,
       step: 400,
       displayStep: 5000,
       difficulty: "Moyen",
       explanation: "132847 est situé entre 130000 et 135000, plus près de 135000",
       hint: "Graduations principales : 120000, 125000, 130000, 135000, 140000. Place 132847 entre 130000 et 135000"
     },
    {
      id: 10,
      type: 'comparison' as const,
      title: "Range ces nombres du plus petit au plus grand",
      numbers: [234596, 243579, 324587, 342568],
      correct: 234596,
      difficulty: "Moyen",
      explanation: "Ordre croissant : 234596 < 243579 < 324587 < 342568",
      hint: "Compare les dizaines de milliers : 23, 24, 32, 34"
    },
         {
       id: 11,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 74369,
       min: 70000,
       max: 80000,
       step: 50,
       displayStep: 2000,
       difficulty: "Moyen",
       explanation: "74369 est situé entre 74000 et 75000, plus près de 74000",
       hint: "Graduations principales : 70000, 72000, 74000, 76000, 78000, 80000. Place 74369 entre 74000 et 76000"
     },
    {
      id: 12,
      type: 'comparison' as const,
      title: "Quel nombre est le plus petit ?",
      numbers: [456827, 465819, 564847],
      correct: 456827,
      difficulty: "Moyen",
      explanation: "456827 < 465819 < 564847 car on compare les dizaines de milliers",
      hint: "Compare les dizaines de milliers : 45, 46, 56"
    },
         {
       id: 13,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 193769,
       min: 180000,
       max: 200000,
       step: 250,
       displayStep: 5000,
       difficulty: "Moyen",
       explanation: "193769 est situé entre 192500 et 195000, plus près de 195000",
       hint: "Graduations principales : 180000, 185000, 190000, 195000, 200000. Place 193769 entre 190000 et 195000"
     },
    {
      id: 14,
      type: 'comparison' as const,
      title: "Quel nombre est le plus grand ?",
      numbers: [890179, 809167, 980143],
      correct: 980143,
      difficulty: "Moyen",
      explanation: "980143 > 890179 > 809167 car on compare les centaines de milliers : 9 > 8",
      hint: "Compare les centaines de milliers : 980143 a 9, les autres ont 8"
    },

    // Exercices Difficiles (15-20) - Nombres à 7 chiffres (millions) - nombres complexes
         {
       id: 15,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 2794637,
       min: 2000000,
       max: 3000000,
       step: 20000,
       displayStep: 200000,
       difficulty: "Difficile",
       explanation: "2794637 est situé entre 2700000 et 2800000, plus près de 2800000",
       hint: "Graduations principales : 2000000, 2200000, 2400000, 2600000, 2800000, 3000000. Place 2794637 entre 2600000 et 2800000"
     },
    {
      id: 16,
      type: 'comparison' as const,
      title: "Quel nombre est le plus grand ?",
      numbers: [7896347, 7987294, 7836597],
      correct: 7987294,
      difficulty: "Difficile",
      explanation: "7987294 > 7896347 > 7836597 car on compare les dizaines de milliers",
      hint: "Compare les dizaines de milliers : 798, 789, 783"
    },
         {
       id: 17,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 4327849,
       min: 4000000,
       max: 5000000,
       step: 10000,
       displayStep: 200000,
       difficulty: "Difficile",
       explanation: "4327849 est situé entre 4250000 et 4375000, plus près de 4375000",
       hint: "Graduations principales : 4000000, 4200000, 4400000, 4600000, 4800000, 5000000. Place 4327849 entre 4200000 et 4400000"
     },
    {
      id: 18,
      type: 'comparison' as const,
      title: "Range ces nombres du plus petit au plus grand",
      numbers: [6789374, 6798259, 6879146, 6897385],
      correct: 6789374,
      difficulty: "Difficile",
      explanation: "Ordre croissant : 6789374 < 6798259 < 6879146 < 6897385",
      hint: "Compare les milliers : 6789, 6798, 6879, 6897"
    },
         {
       id: 19,
       type: 'placement' as const,
       title: "Placer le nombre sur la droite graduée",
       number: 8359476,
       min: 8000000,
       max: 9000000,
       step: 50000,
       displayStep: 200000,
       difficulty: "Difficile",
       explanation: "8359476 est situé entre 8300000 et 8400000, plus près de 8300000",
       hint: "Graduations principales : 8000000, 8200000, 8400000, 8600000, 8800000, 9000000. Place 8359476 entre 8200000 et 8400000"
     },
    {
      id: 20,
      type: 'comparison' as const,
      title: "Quel nombre est le plus petit ?",
      numbers: [9876597, 9867583, 9786569],
      correct: 9786569,
      difficulty: "Difficile",
      explanation: "9786569 < 9867583 < 9876597 car on compare les dizaines de milliers : 78 < 86 < 87",
      hint: "Compare les dizaines de milliers : 978, 986, 987"
    }
  ];

  const currentEx = exercises[currentExercise];

  const checkAnswer = () => {
    let correct = false;
    
    if (currentEx.type === 'placement') {
      const tolerance = (currentEx.max - currentEx.min) * 0.05; // 5% de tolérance
      correct = Math.abs(userAnswer - currentEx.number) < tolerance;
    } else if (currentEx.type === 'comparison') {
      correct = userAnswer === currentEx.correct;
    }
    
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (correct && !completed.includes(currentEx.id)) {
      setCompleted([...completed, currentEx.id]);
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer(0);
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer(0);
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setCurrentExercise(0);
    setUserAnswer(0);
    setShowAnswer(false);
    setIsCorrect(null);
    setScore(0);
    setAttempts(0);
    setCompleted([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const renderNumberLine = () => {
    if (currentEx.type !== 'placement') return null;
    
    const { min, max, step, displayStep, number } = currentEx;
    const totalWidth = 500;
    const steps = Math.floor((max - min) / displayStep);
    const stepWidth = totalWidth / steps;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h4 className="font-bold text-gray-800 mb-4 text-center">📏 Droite graduée</h4>
        <div className="relative">
          <svg width={totalWidth + 40} height="120" className="mx-auto">
            {/* Ligne principale */}
            <line x1="20" y1="60" x2={totalWidth + 20} y2="60" stroke="#374151" strokeWidth="2" />
            
            {/* Graduations */}
            {Array.from({ length: steps + 1 }, (_, i) => {
              const x = 20 + i * stepWidth;
              const value = min + i * displayStep;
              const isMainGraduation = true; // Toutes les graduations sont principales maintenant
              
              return (
                <g key={i}>
                  <line 
                    x1={x} 
                    y1={isMainGraduation ? 45 : 50} 
                    x2={x} 
                    y2={isMainGraduation ? 75 : 70} 
                    stroke="#374151" 
                    strokeWidth={isMainGraduation ? 2 : 1} 
                  />
                  <text 
                    x={x} 
                    y={isMainGraduation ? 95 : 90} 
                    textAnchor="middle" 
                    fontSize={isMainGraduation ? 12 : 10} 
                    fill="#374151"
                  >
                    {formatNumber(value)}
                  </text>
                </g>
              );
            })}
            
            {/* Position de la réponse utilisateur */}
            {userAnswer > 0 && (
              <circle
                cx={20 + ((userAnswer - min) / (max - min)) * totalWidth}
                cy="60"
                r="6"
                fill="#3B82F6"
                stroke="#1D4ED8"
                strokeWidth="2"
              />
            )}
            
            {/* Position correcte (après vérification) */}
            {showAnswer && (
              <circle
                cx={20 + ((number - min) / (max - min)) * totalWidth}
                cy="60"
                r="6"
                fill="#10B981"
                stroke="#059669"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
        
        <div className="text-center mt-4">
          <div className="text-lg font-bold text-gray-900 mb-2">
            📍 Place le nombre : {formatNumber(currentEx.number)}
          </div>
          <div className="flex justify-center items-center space-x-4">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={userAnswer}
              onChange={(e) => setUserAnswer(Number(e.target.value))}
              className="w-64"
              disabled={showAnswer}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonExercise = () => {
    if (currentEx.type !== 'comparison') return null;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h4 className="font-bold text-gray-800 mb-4 text-center">🔍 Comparaison de nombres</h4>
        
        {currentEx.id === 3 && (
          <div className="text-center mb-6">
            <div className="text-lg font-bold text-gray-900 mb-4">
              Quel nombre est le plus grand ?
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {currentEx.numbers.map((num, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(num)}
                  disabled={showAnswer}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userAnswer === num 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-50 border-gray-300 hover:border-blue-300 text-gray-900'
                  }`}
                >
                  <div className="text-lg font-bold">
                    {formatNumber(num)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {currentEx.id === 5 && (
          <div className="text-center mb-6">
            <div className="text-lg font-bold text-gray-900 mb-4">
              Quel est le plus petit nombre ?
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {currentEx.numbers.map((num, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(num)}
                  disabled={showAnswer}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userAnswer === num 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-50 border-gray-300 hover:border-blue-300 text-gray-900'
                  }`}
                >
                  <div className="text-lg font-bold">
                    {formatNumber(num)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/chapitre/nombres-entiers-jusqu-au-million" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-lg text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📏 Représenter les nombres</h1>
          <div className="flex justify-center items-center space-x-6 text-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Score: {score}/{exercises.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>Tentatives: {attempts}</span>
            </div>
          </div>
        </div>

        {/* Rappel théorique */}
        {showTheoryReminder && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-orange-900">💡 Rappel : représenter les nombres</h3>
              <button
                onClick={() => setShowTheoryReminder(false)}
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                Masquer
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-orange-800 mb-3">📏 Droite graduée :</h4>
                <div className="space-y-2 text-sm text-gray-800">
                  <div>• Les nombres sont ordonnés de gauche à droite</div>
                  <div>• Plus on va à droite, plus le nombre est grand</div>
                  <div>• L'écart entre deux graduations est toujours le même</div>
                  <div>• On peut compter par bonds (10, 100, 1000...)</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-red-800 mb-3">🔍 Comparer des nombres :</h4>
                <div className="space-y-2 text-sm text-gray-800">
                  <div>• Compare d'abord les chiffres des millions</div>
                  <div>• Puis les centaines de milliers</div>
                  <div>• Puis les dizaines de milliers, etc.</div>
                  <div>• Le premier chiffre différent détermine l'ordre</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercice principal */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentEx.difficulty)}`}>
                {currentEx.difficulty}
              </span>
              <span className="text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              {currentEx.title}
            </div>
          </div>

          {/* Rendu conditionnel selon le type d'exercice */}
          {renderNumberLine()}
          {renderComparisonExercise()}

          {/* Bouton de vérification */}
          <div className="text-center mb-6">
            <button
              onClick={checkAnswer}
              disabled={showAnswer || userAnswer === 0}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                showAnswer || userAnswer === 0
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
              }`}
            >
              Vérifier ma réponse
            </button>
          </div>

          {/* Indice */}
          {!showAnswer && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-800">💡 Indice</span>
              </div>
              <p className="text-yellow-700 text-sm">{currentEx.hint}</p>
            </div>
          )}

          {/* Résultat */}
          {showAnswer && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`text-xl font-bold ${
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {isCorrect ? '🎉 Excellent ! Bonne réponse !' : '❌ Pas tout à fait...'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-semibold text-gray-800 mb-2">✅ Réponse correcte :</div>
                    <div className="text-lg">
                      {currentEx.type === 'placement' ? (
                        <span className="font-mono text-orange-600">
                          {formatNumber(currentEx.number)}
                        </span>
                      ) : (
                        <span className="font-mono text-orange-600">
                          {formatNumber(currentEx.correct)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-gray-800 text-sm">
                    <strong>Explication :</strong> {currentEx.explanation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={prevExercise}
            disabled={currentExercise === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentExercise === 0 
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transform hover:scale-105'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Précédent</span>
          </button>

          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {currentExercise + 1} / {exercises.length}
            </div>
            <div className="text-sm text-gray-700">
              {Math.round(((currentExercise + 1) / exercises.length) * 100)}% complété
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={nextExercise}
            disabled={currentExercise === exercises.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentExercise === exercises.length - 1 
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-105'
            }`}
          >
            <span>Suivant</span>
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Statistiques et boutons de fin */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Tes statistiques</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Exercices réussis :</span>
                <span className="font-bold text-green-600">{score}/{exercises.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taux de réussite :</span>
                <span className="font-bold text-blue-600">
                  {exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tentatives totales :</span>
                <span className="font-bold text-purple-600">{attempts}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎮 Actions</h3>
            <div className="space-y-3">
              <button
                onClick={resetExercise}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Recommencer</span>
              </button>
              
              {currentExercise === exercises.length - 1 && (
                <Link 
                  href="/chapitre/nombres-entiers-jusqu-au-million"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
                >
                  <span>🎉 Chapitre terminé !</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 