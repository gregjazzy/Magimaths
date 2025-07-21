'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

interface Exercise {
  question: string;
  fraction1?: string;
  fraction2?: string;
  mathExpression?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  hasVisual: boolean;
}

export default function AdditionFractionsPage() {
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
      fraction1: '1/4', 
      fraction2: '1/4', 
      result: '2/4', 
      explanation: '1/4 + 1/4 = 2/4 (on additionne les parts : 1 + 1 = 2)' 
    },
    { 
      fraction1: '1/3', 
      fraction2: '1/3', 
      result: '2/3', 
      explanation: '1/3 + 1/3 = 2/3 (on additionne les parts : 1 + 1 = 2)' 
    },
    { 
      fraction1: '2/6', 
      fraction2: '1/6', 
      result: '3/6', 
      explanation: '2/6 + 1/6 = 3/6 (on additionne les parts : 2 + 1 = 3)' 
    }
  ];

  const exercises: Exercise[] = [
    // Exercices avec visualisation (30%)
    {
      question: 'Calcule : 1/4 + 1/4 = ?',
      fraction1: '1/4',
      fraction2: '1/4',
      options: ['2/4', '1/4', '2/8', '1/8'],
      correctAnswer: '2/4',
      hint: 'On additionne les nombres du haut : 1 + 1 = 2, le nombre du bas reste le même',
      hasVisual: true
    },
    {
      question: 'Calcule : 1/3 + 1/3 = ?',
      fraction1: '1/3',
      fraction2: '1/3',
      options: ['2/3', '1/3', '2/6', '1/6'],
      correctAnswer: '2/3',
      hint: 'On additionne les nombres du haut : 1 + 1 = 2, le nombre du bas reste 3',
      hasVisual: true
    },
    {
      question: 'Calcule : 1/6 + 2/6 = ?',
      fraction1: '1/6',
      fraction2: '2/6',
      options: ['3/6', '2/6', '3/12', '1/6'],
      correctAnswer: '3/6',
      hint: 'On additionne les nombres du haut : 1 + 2 = 3, le nombre du bas reste 6',
      hasVisual: true
    },
    
    // Exercices purement mathématiques (70%)
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{5} + \\frac{1}{5} = ?',
      options: ['2/5', '1/5', '2/10', '1/10'],
      correctAnswer: '2/5',
      hint: 'On additionne les numérateurs : 1 + 1 = 2, le dénominateur reste 5',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{8} + \\frac{1}{8} = ?',
      options: ['3/8', '2/8', '3/16', '1/8'],
      correctAnswer: '3/8',
      hint: 'On additionne les numérateurs : 2 + 1 = 3, le dénominateur reste 8',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{4} + \\frac{2}{4} = ?',
      options: ['3/4', '2/4', '3/8', '1/4'],
      correctAnswer: '3/4',
      hint: 'On additionne les numérateurs : 1 + 2 = 3, le dénominateur reste 4',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{10} + \\frac{3}{10} = ?',
      options: ['4/10', '3/10', '4/20', '1/10'],
      correctAnswer: '4/10',
      hint: 'On additionne les numérateurs : 1 + 3 = 4, le dénominateur reste 10',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{5} + \\frac{1}{5} = ?',
      options: ['3/5', '2/5', '3/10', '1/5'],
      correctAnswer: '3/5',
      hint: 'On additionne les numérateurs : 2 + 1 = 3, le dénominateur reste 5',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{8} + \\frac{1}{8} = ?',
      options: ['2/8', '1/8', '2/16', '1/16'],
      correctAnswer: '2/8',
      hint: 'On additionne les numérateurs : 1 + 1 = 2, le dénominateur reste 8',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{3}{6} + \\frac{1}{6} = ?',
      options: ['4/6', '3/6', '4/12', '1/6'],
      correctAnswer: '4/6',
      hint: 'On additionne les numérateurs : 3 + 1 = 4, le dénominateur reste 6',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{7} + \\frac{1}{7} = ?',
      options: ['3/7', '2/7', '3/14', '1/7'],
      correctAnswer: '3/7',
      hint: 'On additionne les numérateurs : 2 + 1 = 3, le dénominateur reste 7',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{9} + \\frac{2}{9} = ?',
      options: ['3/9', '2/9', '3/18', '1/9'],
      correctAnswer: '3/9',
      hint: 'On additionne les numérateurs : 1 + 2 = 3, le dénominateur reste 9',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{4}{10} + \\frac{1}{10} = ?',
      options: ['5/10', '4/10', '5/20', '1/10'],
      correctAnswer: '5/10',
      hint: 'On additionne les numérateurs : 4 + 1 = 5, le dénominateur reste 10',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{12} + \\frac{3}{12} = ?',
      options: ['4/12', '3/12', '4/24', '1/12'],
      correctAnswer: '4/12',
      hint: 'On additionne les numérateurs : 1 + 3 = 4, le dénominateur reste 12',
      hasVisual: false
    }
  ];

  const renderAdditionVisual = (fraction1: string, fraction2: string, result?: string) => {
    const renderSingleFraction = (fraction: string, x: number, color: string) => {
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
        const x1 = centerX + 20 * Math.cos((startAngle * Math.PI) / 180);
        const y1 = 50 + 20 * Math.sin((startAngle * Math.PI) / 180);
        const x2 = centerX + 20 * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 50 + 20 * Math.sin((endAngle * Math.PI) / 180);
        
        const largeArcFlag = anglePerPart > 180 ? 1 : 0;
        const pathData = `M ${centerX} 50 L ${x1} ${y1} A 20 20 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        
        svgParts.push(
          <path
            key={i}
            d={pathData}
            fill={isColored ? color : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="1"
          />
        );
      }
      
      return svgParts;
    };

    return (
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderSingleFraction(fraction1, 40, "#ef4444")}
          </svg>
          <p className="text-lg font-bold text-gray-900 mt-2">{fraction1}</p>
        </div>
        <div className="text-3xl font-bold text-red-600">+</div>
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderSingleFraction(fraction2, 40, "#3b82f6")}
          </svg>
          <p className="text-lg font-bold text-gray-900 mt-2">{fraction2}</p>
        </div>
        {result && (
          <>
            <div className="text-3xl font-bold text-red-600">=</div>
            <div className="text-center">
              <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
                {renderSingleFraction(result, 40, "#10b981")}
              </svg>
              <p className="text-lg font-bold text-gray-900 mt-2">{result}</p>
            </div>
          </>
        )}
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux fractions</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ➕ Additionner des fractions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Premières additions simples
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{currentExercise + 1}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Exercice</div>
              </div>
            </div>
          </div>
        </div>

        {!showExercises && (
          <div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-red-400 to-pink-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🧮</div>
                <h2 className="text-2xl font-bold mb-4">Calculateur de fractions !</h2>
                <p className="text-lg">
                  Apprends à additionner des fractions ! C'est comme rassembler 
                  des parts de gâteau du même type.
                </p>
              </div>
            </div>

            {/* Exemples */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                🔢 Comment additionner ?
              </h3>
              
              <div className="space-y-8">
                {examples.map((example, index) => (
                  <div key={index} className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-red-700">
                        {example.fraction1} + {example.fraction2} = {example.result}
                      </div>
                    </div>
                    {renderAdditionVisual(example.fraction1, example.fraction2, example.result)}
                    <p className="text-center text-gray-700 font-medium">
                      {example.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-green-50 rounded-lg p-6 border-2 border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-3 text-center">📏 Règle magique</h4>
                <div className="text-green-700 text-center space-y-2">
                  <p className="font-bold">Pour additionner des fractions :</p>
                  <p>1️⃣ Le nombre du bas reste le même</p>
                  <p>2️⃣ On additionne les nombres du haut</p>
                  <p>3️⃣ Exemple : 1/4 + 2/4 = 3/4</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🎮 Commencer les calculs !
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

            {exercises[currentExercise].hasVisual ? (
              renderAdditionVisual(exercises[currentExercise].fraction1!, exercises[currentExercise].fraction2!)
            ) : (
              <div className="text-center mb-8">
                <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                  <div className="text-4xl font-bold text-gray-900 font-mono">
                    {exercises[currentExercise].mathExpression?.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2')}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              {exercises[currentExercise].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                    userAnswer === option
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-red-300'
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
                      <span className="font-bold">Fantastique ! Tu maîtrises l'addition !</span>
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
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
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
              <div className="text-6xl mb-4">🧮</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Calculateur expert !</h3>
              <p className="text-lg text-gray-700 mb-6">
                Tu sais maintenant additionner les fractions !
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
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
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