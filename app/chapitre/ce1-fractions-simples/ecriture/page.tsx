'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

export default function EcritureFractionsPage() {
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
    { name: 'moitié', fraction: '1/2', description: 'Une moitié s\'écrit 1/2' },
    { name: 'tiers', fraction: '1/3', description: 'Un tiers s\'écrit 1/3' },
    { name: 'quart', fraction: '1/4', description: 'Un quart s\'écrit 1/4' },
    { name: 'cinquième', fraction: '1/5', description: 'Un cinquième s\'écrit 1/5' }
  ];

  const exercises = [
    {
      question: 'Comment écrit-on "une moitié" ?',
      options: ['1/2', '2/1', '1/3', '1/4'],
      correctAnswer: '1/2',
      hint: 'Moitié = diviser en 2, donc 1/2'
    },
    {
      question: 'Comment écrit-on "un quart" ?',
      options: ['1/4', '4/1', '1/2', '1/3'],
      correctAnswer: '1/4',
      hint: 'Quart = diviser en 4, donc 1/4'
    },
    {
      question: 'Comment écrit-on "un tiers" ?',
      options: ['1/3', '3/1', '1/2', '1/4'],
      correctAnswer: '1/3',
      hint: 'Tiers = diviser en 3, donc 1/3'
    },
    {
      question: 'Comment écrit-on "un cinquième" ?',
      options: ['1/5', '5/1', '1/4', '1/6'],
      correctAnswer: '1/5',
      hint: 'Cinquième = diviser en 5, donc 1/5'
    },
    {
      question: 'Comment écrit-on "un sixième" ?',
      options: ['1/6', '6/1', '1/5', '1/7'],
      correctAnswer: '1/6',
      hint: 'Sixième = diviser en 6, donc 1/6'
    },
    {
      question: 'Comment écrit-on "un huitième" ?',
      options: ['1/8', '8/1', '1/7', '1/9'],
      correctAnswer: '1/8',
      hint: 'Huitième = diviser en 8, donc 1/8'
    },
    {
      question: 'Comment écrit-on "deux quarts" ?',
      options: ['2/4', '4/2', '1/4', '2/2'],
      correctAnswer: '2/4',
      hint: 'Deux parts sur quatre, donc 2/4'
    },
    {
      question: 'Comment écrit-on "trois cinquièmes" ?',
      options: ['3/5', '5/3', '1/5', '3/3'],
      correctAnswer: '3/5',
      hint: 'Trois parts sur cinq, donc 3/5'
    },
    {
      question: 'Comment écrit-on "deux tiers" ?',
      options: ['2/3', '3/2', '1/3', '2/2'],
      correctAnswer: '2/3',
      hint: 'Deux parts sur trois, donc 2/3'
    },
    {
      question: 'Comment écrit-on "cinq sixièmes" ?',
      options: ['5/6', '6/5', '1/6', '5/5'],
      correctAnswer: '5/6',
      hint: 'Cinq parts sur six, donc 5/6'
    }
  ];

  const renderFractionVisual = (fraction: string) => {
    const parts = fraction.split('/');
    const numerator = parseInt(parts[0]);
    const denominator = parseInt(parts[1]);
    
    const anglePerPart = 360 / denominator;
    const svgParts = [];
    
    for (let i = 0; i < denominator; i++) {
      const isColored = i < numerator;
      const startAngle = i * anglePerPart - 90;
      const endAngle = (i + 1) * anglePerPart - 90;
      
      const x1 = 50 + 30 * Math.cos((startAngle * Math.PI) / 180);
      const y1 = 50 + 30 * Math.sin((startAngle * Math.PI) / 180);
      const x2 = 50 + 30 * Math.cos((endAngle * Math.PI) / 180);
      const y2 = 50 + 30 * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = anglePerPart > 180 ? 1 : 0;
      const pathData = `M 50 50 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      svgParts.push(
        <path
          key={i}
          d={pathData}
          fill={isColored ? "#8b5cf6" : "#e5e7eb"}
          stroke="#374151"
          strokeWidth="1"
        />
      );
    }
    
    return (
      <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto">
        {svgParts}
      </svg>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux fractions</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✏️ Écrire les fractions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Apprends à écrire 1/2, 1/3, 1/4...
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600">{currentExercise + 1}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Exercice</div>
              </div>
            </div>
          </div>
        </div>

        {!showExercises && (
          <div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold mb-4">Écrire les fractions !</h2>
                <p className="text-lg">
                  Les fractions s'écrivent avec deux nombres séparés par une barre : 
                  le nombre du haut et le nombre du bas !
                </p>
              </div>
            </div>

            {/* Exemples */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                ✍️ Comment écrire les fractions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                    <div className="text-center mb-4">
                      <div className="text-xl font-bold text-purple-700 mb-2">{example.name}</div>
                      <div className="text-3xl font-bold text-purple-900 mb-3">{example.fraction}</div>
                    </div>
                    <div className="text-center mb-4">
                      {renderFractionVisual(example.fraction)}
                    </div>
                    <p className="text-center text-gray-700 text-sm font-medium">
                      {example.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                <h4 className="text-lg font-bold text-yellow-800 mb-3 text-center">💡 Astuce importante</h4>
                <p className="text-yellow-700 text-center">
                  Le nombre du bas indique en combien de parts on divise (2, 3, 4...) <br/>
                  Le nombre du haut indique combien de parts on prend (1, 2, 3...)
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-purple-600 hover:to-violet-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🎮 Commencer l'écriture !
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

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              {exercises[currentExercise].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                    userAnswer === option
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-yellow-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
              >
                <Lightbulb className="inline w-4 h-4 mr-2" />
                Indice
              </button>
              <button
                onClick={resetExercise}
                className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
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
                      <span className="font-bold">Parfait ! Tu sais écrire les fractions !</span>
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

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <button
                onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                disabled={currentExercise === 0}
                className="bg-gray-300 text-gray-700 px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
              >
                ← Précédent
              </button>
              <button
                onClick={handleNext}
                disabled={!userAnswer && isCorrect === null}
                className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
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
              <div className="text-6xl mb-4">✍️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bravo écrivain !</h3>
              <p className="text-lg text-gray-700 mb-6">
                Tu sais maintenant écrire les fractions !
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-xl font-bold text-gray-900">
                  Score final : {finalScore}/{exercises.length} 
                  ({Math.round((finalScore / exercises.length) * 100)}%)
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetAll}
                  className="flex-1 bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                  Recommencer
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
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