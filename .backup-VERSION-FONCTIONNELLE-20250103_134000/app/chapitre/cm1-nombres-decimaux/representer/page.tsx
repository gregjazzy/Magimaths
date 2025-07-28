'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye } from 'lucide-react';

export default function RepresenterNombresDecimauxPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const exercises = [
    {
      id: 1,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 0.35,
      min: 0,
      max: 1,
      step: 0.01,
      displayStep: 0.1,
      difficulty: "Facile",
      explanation: "0,35 est entre 0,3 et 0,4, plus près de 0,4",
      hint: "Graduations : 0, 0,1, 0,2, 0,3, 0,4, 0,5, 0,6, 0,7, 0,8, 0,9, 1"
    },
    {
      id: 2,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 1.25,
      min: 1,
      max: 2,
      step: 0.01,
      displayStep: 0.1,
      difficulty: "Facile",
      explanation: "1,25 est entre 1,2 et 1,3, plus près de 1,3",
      hint: "25 centièmes = 2,5 dixièmes"
    },
    {
      id: 3,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 2.8,
      min: 2,
      max: 3,
      step: 0.01,
      displayStep: 0.1,
      difficulty: "Facile",
      explanation: "2,8 est exactement sur la graduation 2,8",
      hint: "8 dixièmes = 0,8"
    },
    {
      id: 4,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 0.467,
      min: 0.4,
      max: 0.5,
      step: 0.001,
      displayStep: 0.01,
      difficulty: "Moyen",
      explanation: "0,467 est entre 0,46 et 0,47, plus près de 0,47",
      hint: "467 millièmes = 46,7 centièmes"
    },
    {
      id: 5,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 3.124,
      min: 3.1,
      max: 3.2,
      step: 0.001,
      displayStep: 0.01,
      difficulty: "Moyen",
      explanation: "3,124 est entre 3,12 et 3,13, plus près de 3,12",
      hint: "124 millièmes = 12,4 centièmes"
    },
    {
      id: 6,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 5.789,
      min: 5.7,
      max: 5.8,
      step: 0.001,
      displayStep: 0.01,
      difficulty: "Moyen",
      explanation: "5,789 est entre 5,78 et 5,79, plus près de 5,79",
      hint: "789 millièmes = 78,9 centièmes"
    },
    {
      id: 7,
      type: 'comparison' as const,
      title: "Quel est le plus grand nombre ?",
      numbers: [0.5, 0.48, 0.52, 0.495],
      correct: 0.52,
      difficulty: "Facile",
      explanation: "0,52 > 0,5 > 0,495 > 0,48",
      hint: "Compare les centièmes : 52 > 50 > 49 > 48"
    },
    {
      id: 8,
      type: 'comparison' as const,
      title: "Quel est le plus petit nombre ?",
      numbers: [1.2, 1.23, 1.198, 1.205],
      correct: 1.198,
      difficulty: "Facile",
      explanation: "1,198 < 1,2 < 1,205 < 1,23",
      hint: "Compare les centièmes : 19 < 20 < 20 < 23"
    },
    {
      id: 9,
      type: 'comparison' as const,
      title: "Quel est le plus grand nombre ?",
      numbers: [2.45, 2.4, 2.456, 2.454],
      correct: 2.456,
      difficulty: "Facile",
      explanation: "2,456 > 2,454 > 2,45 > 2,4",
      hint: "Compare les millièmes : 456 > 454 > 450 > 400"
    },
    {
      id: 10,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 0.0234,
      min: 0.02,
      max: 0.03,
      step: 0.0001,
      displayStep: 0.001,
      difficulty: "Difficile",
      explanation: "0,0234 est entre 0,023 et 0,024, plus près de 0,023",
      hint: "234 dix-millièmes = 23,4 millièmes"
    },
    {
      id: 11,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 7.6789,
      min: 7.67,
      max: 7.68,
      step: 0.0001,
      displayStep: 0.001,
      difficulty: "Difficile",
      explanation: "7,6789 est entre 7,678 et 7,679, plus près de 7,679",
      hint: "6789 dix-millièmes = 678,9 millièmes"
    },
    {
      id: 12,
      type: 'placement' as const,
      title: "Placer le nombre sur la droite graduée",
      number: 4.3456,
      min: 4.34,
      max: 4.35,
      step: 0.0001,
      displayStep: 0.001,
      difficulty: "Difficile",
      explanation: "4,3456 est entre 4,345 et 4,346, plus près de 4,346",
      hint: "3456 dix-millièmes = 345,6 millièmes"
    },
    {
      id: 13,
      type: 'comparison' as const,
      title: "Quel est le plus petit nombre ?",
      numbers: [3.145, 3.1456, 3.1454, 3.1455],
      correct: 3.1454,
      difficulty: "Moyen",
      explanation: "3,1454 < 3,1455 < 3,145 < 3,1456",
      hint: "Compare les dix-millièmes : 1454 < 1455 < 1450 < 1456"
    },
    {
      id: 14,
      type: 'comparison' as const,
      title: "Quel est le plus grand nombre ?",
      numbers: [6.789, 6.79, 6.7899, 6.7891],
      correct: 6.7899,
      difficulty: "Moyen",
      explanation: "6,7899 > 6,7891 > 6,79 > 6,789",
      hint: "Compare les dix-millièmes : 7899 > 7891 > 7900 > 7890"
    },
    {
      id: 15,
      type: 'comparison' as const,
      title: "Quel est le plus petit nombre ?",
      numbers: [9.123, 9.1234, 9.1235, 9.1233],
      correct: 9.123,
      difficulty: "Moyen",
      explanation: "9,123 < 9,1233 < 9,1234 < 9,1235",
      hint: "9,123 = 9,1230 donc c'est le plus petit"
    },
    {
      id: 16,
      type: 'comparison' as const,
      title: "Quel est le plus grand nombre ?",
      numbers: [8.456, 8.4567, 8.4565, 8.4566],
      correct: 8.4567,
      difficulty: "Difficile",
      explanation: "8,4567 > 8,4566 > 8,4565 > 8,456",
      hint: "Compare les dix-millièmes : 4567 > 4566 > 4565 > 4560"
    },
    {
      id: 17,
      type: 'comparison' as const,
      title: "Quel est le plus petit nombre ?",
      numbers: [5.234, 5.2345, 5.2344, 5.2343],
      correct: 5.2343,
      difficulty: "Difficile",
      explanation: "5,2343 < 5,2344 < 5,2345 < 5,234",
      hint: "Compare les dix-millièmes : 2343 < 2344 < 2345 < 2340"
    },
    {
      id: 18,
      type: 'comparison' as const,
      title: "Quel est le plus grand nombre ?",
      numbers: [12.345, 12.3456, 12.3457, 12.3455],
      correct: 12.3457,
      difficulty: "Difficile",
      explanation: "12,3457 > 12,3456 > 12,3455 > 12,345",
      hint: "Compare les dix-millièmes : 3457 > 3456 > 3455 > 3450"
    },
    {
      id: 19,
      type: 'comparison' as const,
      title: "Quel est le plus petit nombre ?",
      numbers: [0.987, 0.9876, 0.9874, 0.9875],
      correct: 0.987,
      difficulty: "Difficile",
      explanation: "0,987 < 0,9874 < 0,9875 < 0,9876",
      hint: "0,987 = 0,9870 donc c'est le plus petit"
    },
    {
      id: 20,
      type: 'comparison' as const,
      title: "Range ces nombres du plus petit au plus grand",
      numbers: [15.678, 15.687, 15.768, 15.786],
      correct: 15.678,
      difficulty: "Difficile",
      explanation: "Ordre croissant : 15,678 < 15,687 < 15,768 < 15,786",
      hint: "Compare les centièmes : 67 < 68 < 76 < 78"
    }
  ];

  const currentEx = exercises[currentExercise];

  const checkAnswer = () => {
    let correct = false;
    
    if (currentEx.type === 'placement') {
      const tolerance = (currentEx.max - currentEx.min) * 0.05;
      correct = Math.abs(userAnswer - currentEx.number) <= tolerance;
    } else {
      correct = selectedNumber === currentEx.correct;
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
      setUserAnswer(currentEx.type === 'placement' ? currentEx.min : 0);
      setSelectedNumber(null);
      setShowAnswer(false);
      setIsCorrect(false);
      setShowHelp(false);
    }
  };

  const resetExercise = () => {
    setUserAnswer(currentEx.type === 'placement' ? currentEx.min : 0);
    setSelectedNumber(null);
    setShowAnswer(false);
    setIsCorrect(false);
    setShowHelp(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'text-green-600 bg-green-100';
      case 'Moyen': return 'text-orange-600 bg-orange-100';
      case 'Difficile': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().replace('.', ',');
  };

  const calculateScore = () => {
    return attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  };

  const renderNumberLine = () => {
    if (currentEx.type !== 'placement') return null;
    
    const { min, max, step, displayStep, number } = currentEx;
    const totalWidth = 600;
    const steps = Math.floor((max - min) / displayStep);
    const stepWidth = totalWidth / steps;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h4 className="font-bold text-gray-800 mb-4 text-center">📏 Droite graduée</h4>
        <div className="relative overflow-x-auto">
          <svg width={totalWidth + 60} height="140" className="mx-auto">
            {/* Ligne principale */}
            <line x1="30" y1="70" x2={totalWidth + 30} y2="70" stroke="#374151" strokeWidth="3" />
            
            {/* Graduations */}
            {Array.from({ length: steps + 1 }, (_, i) => {
              const x = 30 + i * stepWidth;
              const value = parseFloat((min + i * displayStep).toFixed(3));
              
              // Afficher seulement certains nombres pour éviter la surcharge
              const shouldShowText = steps <= 10 || i % Math.max(1, Math.floor(steps / 10)) === 0 || i === steps;
              
              return (
                <g key={i}>
                  <line 
                    x1={x} 
                    y1="55" 
                    x2={x} 
                    y2="85" 
                    stroke="#374151" 
                    strokeWidth="2" 
                  />
                  {shouldShowText && (
                    <text 
                      x={x} 
                      y="105" 
                      textAnchor="middle" 
                      fontSize="12" 
                      fill="#374151"
                      fontFamily="Arial, sans-serif"
                      fontWeight="normal"
                    >
                      {value.toString().replace('.', ',')}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Position de la réponse utilisateur */}
            {userAnswer >= min && userAnswer <= max && (
              <circle
                cx={30 + ((userAnswer - min) / (max - min)) * totalWidth}
                cy="70"
                r="8"
                fill="#3B82F6"
                stroke="#1D4ED8"
                strokeWidth="3"
              />
            )}
            
            {/* Position correcte (après vérification) */}
            {showAnswer && (
              <g>
                <circle
                  cx={30 + ((number - min) / (max - min)) * totalWidth}
                  cy="70"
                  r="8"
                  fill="#10B981"
                  stroke="#059669"
                  strokeWidth="3"
                />
                <text
                  x={30 + ((number - min) / (max - min)) * totalWidth}
                  y="130"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#059669"
                  fontWeight="bold"
                >
                  ✓ {formatNumber(number)}
                </text>
              </g>
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
              className="w-80"
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
        <h4 className="font-bold text-gray-800 mb-4 text-center">
          🔍 {currentEx.title}
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentEx.numbers.map((num, index) => (
            <button
              key={index}
              onClick={() => setSelectedNumber(num)}
              disabled={showAnswer}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedNumber === num
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-2xl font-bold text-gray-800">
                {formatNumber(num)}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-nombres-decimaux" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Représenter les nombres décimaux</h1>
            </div>
            
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Score: {score}/{attempts}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Exercice {currentExercise + 1}/{exercises.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentEx.difficulty)}`}>
                  {currentEx.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Théorie */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
            >
              <Eye className="w-4 h-4" />
              <span>{showHelp ? 'Masquer' : 'Afficher'} l'aide</span>
            </button>
            
            {showHelp && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📏 Droite graduée</h4>
                  <p className="text-sm text-blue-700">
                    • Chaque graduation représente une unité décimale<br />
                    • Plus la graduation est petite, plus la précision est grande<br />
                    • Place le curseur au plus près du nombre demandé
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🔍 Comparaison</h4>
                  <p className="text-sm text-green-700">
                    • Compare chiffre par chiffre de gauche à droite<br />
                    • Commence par la partie entière, puis les décimales<br />
                    • 0,5 = 0,50 = 0,500 (même valeur)
                  </p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">📊 Positions décimales</h4>
                  <p className="text-sm text-orange-700">
                    • Dixièmes : 0,1 - 0,2 - 0,3...<br />
                    • Centièmes : 0,01 - 0,02 - 0,03...<br />
                    • Millièmes : 0,001 - 0,002 - 0,003...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Exercice actuel */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentEx.title}
              </h2>
              <div className="text-lg text-gray-600">
                Exercice {currentExercise + 1} sur {exercises.length}
              </div>
            </div>

            {renderNumberLine()}
            {renderComparisonExercise()}

            {/* Réponse et contrôles */}
            <div className="text-center space-y-4">
              {!showAnswer && (
                <button
                  onClick={checkAnswer}
                  disabled={currentEx.type === 'comparison' && selectedNumber === null}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Vérifier ma réponse
                </button>
              )}

              {showAnswer && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correct !' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold">Explication :</p>
                      <p>{currentEx.explanation}</p>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-semibold">Astuce :</p>
                      <p>{currentEx.hint}</p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercise}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Recommencer</span>
                    </button>
                    
                    {currentExercise < exercises.length - 1 && (
                      <button
                        onClick={nextExercise}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Exercice suivant →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Mes statistiques</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Exercices réussis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{attempts}</div>
              <div className="text-sm text-gray-600">Tentatives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{calculateScore()}%</div>
              <div className="text-sm text-gray-600">Taux de réussite</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentExercise + 1}/{exercises.length}</div>
              <div className="text-sm text-gray-600">Progression</div>
            </div>
          </div>

          {currentExercise === exercises.length - 1 && showAnswer && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-800 mb-2">
                🎉 Félicitations !
              </div>
              <div className="text-lg text-green-700 mb-4">
                Tu as terminé tous les exercices sur la représentation des nombres décimaux !
              </div>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/chapitre/cm1-nombres-decimaux" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Retour au chapitre
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Astuce</h4>
              <p className="text-sm text-yellow-700">
                Ajoute des zéros pour comparer<br />
                0,5 = 0,50 = 0,500
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 