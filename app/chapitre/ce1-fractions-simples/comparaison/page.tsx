'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

export default function ComparaisonFractionsPage() {
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
    { 
      fraction1: '1/2', 
      fraction2: '1/4', 
      comparison: '>', 
      explanation: '1/2 est plus grand que 1/4 car une moitié est plus grande qu\'un quart' 
    },
    { 
      fraction1: '1/3', 
      fraction2: '1/6', 
      comparison: '>', 
      explanation: '1/3 est plus grand que 1/6 car un tiers est plus grand qu\'un sixième' 
    },
    { 
      fraction1: '2/4', 
      fraction2: '1/4', 
      comparison: '>', 
      explanation: '2/4 est plus grand que 1/4 car on prend 2 parts au lieu d\'1' 
    }
  ];

  const exercises = [
    {
      question: 'Compare 1/2 et 1/3. Quelle fraction est plus grande ?',
      fraction1: '1/2',
      fraction2: '1/3',
      options: ['1/2', '1/3', 'Elles sont égales'],
      correctAnswer: '1/2',
      hint: 'Une moitié est plus grande qu\'un tiers. Compare les tailles des parts !'
    },
    {
      question: 'Compare 1/4 et 1/2. Quelle fraction est plus grande ?',
      fraction1: '1/4',
      fraction2: '1/2',
      options: ['1/4', '1/2', 'Elles sont égales'],
      correctAnswer: '1/2',
      hint: 'Une moitié est plus grande qu\'un quart'
    },
    {
      question: 'Compare 1/3 et 1/6. Quelle fraction est plus grande ?',
      fraction1: '1/3',
      fraction2: '1/6',
      options: ['1/3', '1/6', 'Elles sont égales'],
      correctAnswer: '1/3',
      hint: 'Un tiers est plus grand qu\'un sixième'
    },
    {
      question: 'Compare 2/4 et 1/4. Quelle fraction est plus grande ?',
      fraction1: '2/4',
      fraction2: '1/4',
      options: ['2/4', '1/4', 'Elles sont égales'],
      correctAnswer: '2/4',
      hint: '2 parts de 4 est plus grand que 1 part de 4'
    },
    {
      question: 'Compare 3/6 et 1/6. Quelle fraction est plus grande ?',
      fraction1: '3/6',
      fraction2: '1/6',
      options: ['3/6', '1/6', 'Elles sont égales'],
      correctAnswer: '3/6',
      hint: '3 parts de 6 est plus grand que 1 part de 6'
    },
    {
      question: 'Compare 1/5 et 1/3. Quelle fraction est plus grande ?',
      fraction1: '1/5',
      fraction2: '1/3',
      options: ['1/5', '1/3', 'Elles sont égales'],
      correctAnswer: '1/3',
      hint: 'Plus le nombre du bas est petit, plus la fraction est grande'
    },
    {
      question: 'Compare 2/3 et 1/3. Quelle fraction est plus grande ?',
      fraction1: '2/3',
      fraction2: '1/3',
      options: ['2/3', '1/3', 'Elles sont égales'],
      correctAnswer: '2/3',
      hint: '2 tiers est plus grand que 1 tiers'
    },
    {
      question: 'Compare 1/8 et 1/4. Quelle fraction est plus grande ?',
      fraction1: '1/8',
      fraction2: '1/4',
      options: ['1/8', '1/4', 'Elles sont égales'],
      correctAnswer: '1/4',
      hint: 'Un quart est plus grand qu\'un huitième'
    },
    {
      question: 'Compare 4/8 et 2/8. Quelle fraction est plus grande ?',
      fraction1: '4/8',
      fraction2: '2/8',
      options: ['4/8', '2/8', 'Elles sont égales'],
      correctAnswer: '4/8',
      hint: '4 parts de 8 est plus grand que 2 parts de 8'
    },
    {
      question: 'Compare 2/2 et 1/2. Quelle fraction est plus grande ?',
      fraction1: '2/2',
      fraction2: '1/2',
      options: ['2/2', '1/2', 'Elles sont égales'],
      correctAnswer: '2/2',
      hint: '2/2 = le tout complet, 1/2 = la moitié'
    }
  ];

  const renderFractionComparison = (fraction1: string, fraction2: string) => {
    const renderSingleFraction = (fraction: string, x: number) => {
      const parts = fraction.split('/');
      const numerator = parseInt(parts[0]);
      const denominator = parseInt(parts[1]);
      
      const anglePerPart = 360 / denominator;
      const svgParts = [];
      
      for (let i = 0; i < denominator; i++) {
        const isColored = i < numerator;
        const startAngle = i * anglePerPart - 90;
        const endAngle = (i + 1) * anglePerPart - 90;
        
        const centerX = x;
        const x1 = centerX + 25 * Math.cos((startAngle * Math.PI) / 180);
        const y1 = 50 + 25 * Math.sin((startAngle * Math.PI) / 180);
        const x2 = centerX + 25 * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 50 + 25 * Math.sin((endAngle * Math.PI) / 180);
        
        const largeArcFlag = anglePerPart > 180 ? 1 : 0;
        const pathData = `M ${centerX} 50 L ${x1} ${y1} A 25 25 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        
        svgParts.push(
          <path
            key={i}
            d={pathData}
            fill={isColored ? "#f59e0b" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="1"
          />
        );
      }
      
      return svgParts;
    };

    return (
      <div className="flex items-center justify-center space-x-8 mb-6">
        <div className="text-center">
          <svg width="120" height="100" viewBox="0 0 120 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderSingleFraction(fraction1, 60)}
          </svg>
          <p className="text-lg font-bold text-gray-900 mt-2">{fraction1}</p>
        </div>
        <div className="text-3xl font-bold text-orange-600">VS</div>
        <div className="text-center">
          <svg width="120" height="100" viewBox="0 0 120 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderSingleFraction(fraction2, 60)}
          </svg>
          <p className="text-lg font-bold text-gray-900 mt-2">{fraction2}</p>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux fractions</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ⚖️ Comparer les fractions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Quelle fraction est plus grande ?
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{currentExercise + 1}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Exercice</div>
              </div>
            </div>
          </div>
        </div>

        {!showExercises && (
          <div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold mb-4">Le champion des comparaisons !</h2>
                <p className="text-lg">
                  Apprends à comparer les fractions pour savoir laquelle est la plus grande. 
                  C'est comme un concours entre les fractions !
                </p>
              </div>
            </div>

            {/* Exemples */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                🔍 Comment comparer ?
              </h3>
              
              <div className="space-y-6">
                {examples.map((example, index) => (
                  <div key={index} className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-orange-700">
                        {example.fraction1} {example.comparison} {example.fraction2}
                      </div>
                    </div>
                    <p className="text-center text-gray-700 font-medium">
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 mb-3 text-center">💡 Règles importantes</h4>
                <ul className="text-blue-700 space-y-2">
                                     <li>• Plus le nombre du bas est petit, plus la fraction est grande (1/2 {'>'}  1/4)</li>
                   <li>• Si le nombre du bas est pareil, plus le nombre du haut est grand, plus la fraction est grande (3/4 {'>'} 1/4)</li>
                  <li>• Regarde bien les dessins pour t'aider !</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🎮 Commencer les comparaisons !
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

            {renderFractionComparison(exercises[currentExercise].fraction1, exercises[currentExercise].fraction2)}

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
              {exercises[currentExercise].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                    userAnswer === option
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-yellow-300'
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
                      <span className="font-bold">Excellent ! Tu es un champion des comparaisons !</span>
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
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors disabled:opacity-50"
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
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Champion !</h3>
              <p className="text-lg text-gray-700 mb-6">
                Tu es maintenant un expert en comparaison de fractions !
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
                  className="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
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