'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

export default function ReconnaissanceFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const examples = [
    { fraction: '1/2', shape: 'circle', parts: 2, colored: 1, description: 'Une moitié = 1 part sur 2' },
    { fraction: '1/3', shape: 'circle', parts: 3, colored: 1, description: 'Un tiers = 1 part sur 3' },
    { fraction: '1/4', shape: 'square', parts: 4, colored: 1, description: 'Un quart = 1 part sur 4' },
    { fraction: '2/4', shape: 'rectangle', parts: 4, colored: 2, description: 'Deux quarts = 2 parts sur 4' }
  ];

  const exercises = [
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 2,
      coloredParts: 1,
      options: ['1/2', '1/3', '2/1', '1/4'],
      correctAnswer: '1/2',
      hint: 'Il y a 2 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 4,
      coloredParts: 1,
      options: ['1/2', '1/4', '4/1', '1/3'],
      correctAnswer: '1/4',
      hint: 'Il y a 4 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 3,
      coloredParts: 1,
      options: ['1/3', '3/1', '1/2', '1/4'],
      correctAnswer: '1/3',
      hint: 'Il y a 3 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'rectangle',
      totalParts: 4,
      coloredParts: 2,
      options: ['1/4', '2/4', '4/2', '1/2'],
      correctAnswer: '2/4',
      hint: 'Il y a 4 parts au total, 2 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 6,
      coloredParts: 1,
      options: ['1/6', '6/1', '1/3', '1/2'],
      correctAnswer: '1/6',
      hint: 'Il y a 6 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'rectangle',
      totalParts: 3,
      coloredParts: 2,
      options: ['2/3', '3/2', '1/3', '1/2'],
      correctAnswer: '2/3',
      hint: 'Il y a 3 parts au total, 2 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 8,
      coloredParts: 1,
      options: ['1/8', '8/1', '1/4', '1/2'],
      correctAnswer: '1/8',
      hint: 'Il y a 8 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'square',
      totalParts: 4,
      coloredParts: 3,
      options: ['3/4', '4/3', '1/4', '1/3'],
      correctAnswer: '3/4',
      hint: 'Il y a 4 parts au total, 3 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'rectangle',
      totalParts: 5,
      coloredParts: 2,
      options: ['2/5', '5/2', '1/5', '3/5'],
      correctAnswer: '2/5',
      hint: 'Il y a 5 parts au total, 2 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 6,
      coloredParts: 3,
      options: ['3/6', '6/3', '1/6', '1/2'],
      correctAnswer: '3/6',
      hint: 'Il y a 6 parts au total, 3 sont coloriées'
    }
  ];

  const renderShape = (shape: string, totalParts: number, coloredParts: number) => {
    const parts = [];
    
    if (shape === 'circle') {
      const anglePerPart = 360 / totalParts;
      for (let i = 0; i < totalParts; i++) {
        const isColored = i < coloredParts;
        const startAngle = i * anglePerPart - 90;
        const endAngle = (i + 1) * anglePerPart - 90;
        
        const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
        const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
        const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);
        
        const largeArcFlag = anglePerPart > 180 ? 1 : 0;
        const pathData = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        
        parts.push(
          <path
            key={i}
            d={pathData}
            fill={isColored ? "#10b981" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="2"
          />
        );
      }
      
      return (
        <svg width="200" height="200" viewBox="0 0 100 100" className="mx-auto border-2 border-gray-300 rounded-lg">
          {parts}
        </svg>
      );
    }
    
    if (shape === 'square') {
      const cols = Math.ceil(Math.sqrt(totalParts));
      const rows = Math.ceil(totalParts / cols);
      const cellWidth = 70 / cols;
      const cellHeight = 70 / rows;
      
      for (let i = 0; i < totalParts; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = 15 + col * cellWidth;
        const y = 15 + row * cellHeight;
        const isColored = i < coloredParts;
        
        parts.push(
          <rect
            key={i}
            x={x}
            y={y}
            width={cellWidth}
            height={cellHeight}
            fill={isColored ? "#10b981" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="2"
          />
        );
      }
      
      return (
        <svg width="200" height="200" viewBox="0 0 100 100" className="mx-auto border-2 border-gray-300 rounded-lg">
          {parts}
        </svg>
      );
    }
    
    if (shape === 'rectangle') {
      const cellWidth = 70 / totalParts;
      
      for (let i = 0; i < totalParts; i++) {
        const x = 15 + i * cellWidth;
        const isColored = i < coloredParts;
        
        parts.push(
          <rect
            key={i}
            x={x}
            y={25}
            width={cellWidth}
            height={50}
            fill={isColored ? "#10b981" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="2"
          />
        );
      }
      
      return (
        <svg width="300" height="200" viewBox="0 0 100 100" className="mx-auto border-2 border-gray-300 rounded-lg">
          {parts}
        </svg>
      );
    }
    
    return <div className="w-48 h-48 bg-gray-200 rounded mx-auto"></div>;
  };

  const handleNext = () => {
    if (isCorrect === null) {
      const correct = userAnswer === exercises[currentExercise].correctAnswer;
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
      }

      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setIsCorrect(null);
            setShowHint(false);
          } else {
            setFinalScore(score + (!answeredCorrectly.has(currentExercise) ? 1 : 0));
            setShowCompletionModal(true);
          }
        }, 1500);
      }
    } else {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setFinalScore(score);
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux fractions</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              👁️ Reconnaître les fractions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Regarde le dessin et trouve la fraction !
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{currentExercise + 1}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Exercice</div>
              </div>
            </div>
          </div>
        </div>

        {!showExercises && (
          <div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-4">Détective des fractions !</h2>
                <p className="text-lg">
                  Regarde bien les dessins et trouve quelle fraction ils représentent. 
                  Compte les parts totales et les parts coloriées !
                </p>
              </div>
            </div>

            {/* Exemples */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                📋 Comment faire ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-green-700 mb-2">{example.fraction}</div>
                    </div>
                    <div className="text-center mb-4">
                      {renderShape(example.shape, example.parts, example.colored)}
                    </div>
                    <p className="text-center text-gray-700 text-sm font-medium">
                      {example.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🎮 Commencer la reconnaissance !
              </button>
            </div>
          </div>
        )}

        {showExercises && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Exercice {currentExercise + 1} sur {exercises.length}
              </h2>
              <p className="text-xl text-gray-700">
                {exercises[currentExercise].question}
              </p>
            </div>

            <div className="text-center mb-8">
              {renderShape(
                exercises[currentExercise].shape,
                exercises[currentExercise].totalParts,
                exercises[currentExercise].coloredParts
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              {exercises[currentExercise].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                    userAnswer === option
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-green-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                <Lightbulb className="inline w-4 h-4 mr-2" />
                Indice
              </button>
              <button
                onClick={resetExercise}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Effacer
              </button>
            </div>

            {showHint && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-bold">{exercises[currentExercise].hint}</span>
                </div>
              </div>
            )}

            {isCorrect !== null && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold">Excellent ! Tu es un vrai détective !</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span className="font-bold">
                        Pas tout à fait ! La bonne réponse est : {exercises[currentExercise].correctAnswer}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                disabled={currentExercise === 0}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                ← Précédent
              </button>
              <button
                onClick={handleNext}
                disabled={!userAnswer && isCorrect === null}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isCorrect === null ? 'Vérifier' : 'Suivant →'}
              </button>
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">🕵️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bravo détective !</h3>
              <p className="text-lg text-gray-700 mb-6">
                Tu sais maintenant reconnaître les fractions sur les dessins !
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-xl font-bold text-gray-900">
                  Score final : {finalScore}/{exercises.length} 
                  ({Math.round((finalScore / exercises.length) * 100)}%)
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={resetAll}
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                >
                  Recommencer
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 