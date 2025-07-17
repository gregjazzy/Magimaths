'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Award, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function DecomposerNombresEntiersPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [showTheoryReminder, setShowTheoryReminder] = useState(true);
  const [decompositionType, setDecompositionType] = useState<'additive' | 'multiplicative'>('additive');

  const exercises = [
    // Exercices Faciles (1-6) - Nombres à 4 chiffres
    {
      id: 1,
      number: "1234",
      numberFormatted: "1 234",
      difficulty: "Facile",
      additiveDecomposition: ["1000", "200", "30", "4"],
      multiplicativeDecomposition: ["1×1000", "2×100", "3×10", "4×1"],
      positions: ["Milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "1234 = 1 millier + 2 centaines + 3 dizaines + 4 unités"
    },
    {
      id: 2,
      number: "5678",
      numberFormatted: "5 678",
      difficulty: "Facile",
      additiveDecomposition: ["5000", "600", "70", "8"],
      multiplicativeDecomposition: ["5×1000", "6×100", "7×10", "8×1"],
      positions: ["Milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "5678 = 5 milliers + 6 centaines + 7 dizaines + 8 unités"
    },
    {
      id: 3,
      number: "3045",
      numberFormatted: "3 045",
      difficulty: "Facile",
      additiveDecomposition: ["3000", "40", "5"],
      multiplicativeDecomposition: ["3×1000", "4×10", "5×1"],
      positions: ["Milliers", "Dizaines", "Unités"],
      explanation: "3045 = 3 milliers + 4 dizaines + 5 unités"
    },
    {
      id: 4,
      number: "7200",
      numberFormatted: "7 200",
      difficulty: "Facile",
      additiveDecomposition: ["7000", "200"],
      multiplicativeDecomposition: ["7×1000", "2×100"],
      positions: ["Milliers", "Centaines"],
      explanation: "7200 = 7 milliers + 2 centaines"
    },
    {
      id: 5,
      number: "9003",
      numberFormatted: "9 003",
      difficulty: "Facile",
      additiveDecomposition: ["9000", "3"],
      multiplicativeDecomposition: ["9×1000", "3×1"],
      positions: ["Milliers", "Unités"],
      explanation: "9003 = 9 milliers + 3 unités"
    },
    {
      id: 6,
      number: "4567",
      numberFormatted: "4 567",
      difficulty: "Facile",
      additiveDecomposition: ["4000", "500", "60", "7"],
      multiplicativeDecomposition: ["4×1000", "5×100", "6×10", "7×1"],
      positions: ["Milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "4567 = 4 milliers + 5 centaines + 6 dizaines + 7 unités"
    },

    // Exercices Moyens (7-14) - Nombres à 5-6 chiffres
    {
      id: 7,
      number: "12345",
      numberFormatted: "12 345",
      difficulty: "Moyen",
      additiveDecomposition: ["10000", "2000", "300", "40", "5"],
      multiplicativeDecomposition: ["1×10000", "2×1000", "3×100", "4×10", "5×1"],
      positions: ["Dizaines de milliers", "Milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "12345 = 1 dizaine de milliers + 2 milliers + 3 centaines + 4 dizaines + 5 unités"
    },
    {
      id: 8,
      number: "67890",
      numberFormatted: "67 890",
      difficulty: "Moyen",
      additiveDecomposition: ["60000", "7000", "800", "90"],
      multiplicativeDecomposition: ["6×10000", "7×1000", "8×100", "9×10"],
      positions: ["Dizaines de milliers", "Milliers", "Centaines", "Dizaines"],
      explanation: "67890 = 6 dizaines de milliers + 7 milliers + 8 centaines + 9 dizaines"
    },
    {
      id: 9,
      number: "150203",
      numberFormatted: "150 203",
      difficulty: "Moyen",
      additiveDecomposition: ["100000", "50000", "200", "3"],
      multiplicativeDecomposition: ["1×100000", "5×10000", "2×100", "3×1"],
      positions: ["Centaines de milliers", "Dizaines de milliers", "Centaines", "Unités"],
      explanation: "150203 = 1 centaine de milliers + 5 dizaines de milliers + 2 centaines + 3 unités"
    },
    {
      id: 10,
      number: "304050",
      numberFormatted: "304 050",
      difficulty: "Moyen",
      additiveDecomposition: ["300000", "4000", "50"],
      multiplicativeDecomposition: ["3×100000", "4×1000", "5×10"],
      positions: ["Centaines de milliers", "Milliers", "Dizaines"],
      explanation: "304050 = 3 centaines de milliers + 4 milliers + 5 dizaines"
    },
    {
      id: 11,
      number: "89012",
      numberFormatted: "89 012",
      difficulty: "Moyen",
      additiveDecomposition: ["80000", "9000", "10", "2"],
      multiplicativeDecomposition: ["8×10000", "9×1000", "1×10", "2×1"],
      positions: ["Dizaines de milliers", "Milliers", "Dizaines", "Unités"],
      explanation: "89012 = 8 dizaines de milliers + 9 milliers + 1 dizaine + 2 unités"
    },
    {
      id: 12,
      number: "456780",
      numberFormatted: "456 780",
      difficulty: "Moyen",
      additiveDecomposition: ["400000", "50000", "6000", "700", "80"],
      multiplicativeDecomposition: ["4×100000", "5×10000", "6×1000", "7×100", "8×10"],
      positions: ["Centaines de milliers", "Dizaines de milliers", "Milliers", "Centaines", "Dizaines"],
      explanation: "456780 = 4 centaines de milliers + 5 dizaines de milliers + 6 milliers + 7 centaines + 8 dizaines"
    },
    {
      id: 13,
      number: "702001",
      numberFormatted: "702 001",
      difficulty: "Moyen",
      additiveDecomposition: ["700000", "2000", "1"],
      multiplicativeDecomposition: ["7×100000", "2×1000", "1×1"],
      positions: ["Centaines de milliers", "Milliers", "Unités"],
      explanation: "702001 = 7 centaines de milliers + 2 milliers + 1 unité"
    },
    {
      id: 14,
      number: "98765",
      numberFormatted: "98 765",
      difficulty: "Moyen",
      additiveDecomposition: ["90000", "8000", "700", "60", "5"],
      multiplicativeDecomposition: ["9×10000", "8×1000", "7×100", "6×10", "5×1"],
      positions: ["Dizaines de milliers", "Milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "98765 = 9 dizaines de milliers + 8 milliers + 7 centaines + 6 dizaines + 5 unités"
    },

    // Exercices Difficiles (15-20) - Nombres à 7 chiffres (millions)
    {
      id: 15,
      number: "1234567",
      numberFormatted: "1 234 567",
      difficulty: "Difficile",
      additiveDecomposition: ["1000000", "200000", "30000", "4000", "500", "60", "7"],
      multiplicativeDecomposition: ["1×1000000", "2×100000", "3×10000", "4×1000", "5×100", "6×10", "7×1"],
      positions: ["Millions", "Centaines de milliers", "Dizaines de milliers", "Milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "1234567 = 1 million + 2 centaines de milliers + 3 dizaines de milliers + 4 milliers + 5 centaines + 6 dizaines + 7 unités"
    },
    {
      id: 16,
      number: "3000450",
      numberFormatted: "3 000 450",
      difficulty: "Difficile",
      additiveDecomposition: ["3000000", "400", "50"],
      multiplicativeDecomposition: ["3×1000000", "4×100", "5×10"],
      positions: ["Millions", "Centaines", "Dizaines"],
      explanation: "3000450 = 3 millions + 4 centaines + 5 dizaines"
    },
    {
      id: 17,
      number: "5607008",
      numberFormatted: "5 607 008",
      difficulty: "Difficile",
      additiveDecomposition: ["5000000", "600000", "7000", "8"],
      multiplicativeDecomposition: ["5×1000000", "6×100000", "7×1000", "8×1"],
      positions: ["Millions", "Centaines de milliers", "Milliers", "Unités"],
      explanation: "5607008 = 5 millions + 6 centaines de milliers + 7 milliers + 8 unités"
    },
    {
      id: 18,
      number: "7890123",
      numberFormatted: "7 890 123",
      difficulty: "Difficile",
      additiveDecomposition: ["7000000", "800000", "90000", "100", "20", "3"],
      multiplicativeDecomposition: ["7×1000000", "8×100000", "9×10000", "1×100", "2×10", "3×1"],
      positions: ["Millions", "Centaines de milliers", "Dizaines de milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "7890123 = 7 millions + 8 centaines de milliers + 9 dizaines de milliers + 1 centaine + 2 dizaines + 3 unités"
    },
    {
      id: 19,
      number: "9000001",
      numberFormatted: "9 000 001",
      difficulty: "Difficile",
      additiveDecomposition: ["9000000", "1"],
      multiplicativeDecomposition: ["9×1000000", "1×1"],
      positions: ["Millions", "Unités"],
      explanation: "9000001 = 9 millions + 1 unité"
    },
    {
      id: 20,
      number: "8765432",
      numberFormatted: "8 765 432",
      difficulty: "Difficile",
      additiveDecomposition: ["8000000", "700000", "60000", "5000", "400", "30", "2"],
      multiplicativeDecomposition: ["8×1000000", "7×100000", "6×10000", "5×1000", "4×100", "3×10", "2×1"],
      positions: ["Millions", "Centaines de milliers", "Dizaines de milliers", "Milliers", "Centaines", "Dizaines", "Unités"],
      explanation: "8765432 = 8 millions + 7 centaines de milliers + 6 dizaines de milliers + 5 milliers + 4 centaines + 3 dizaines + 2 unités"
    }
  ];

  const currentEx = exercises[currentExercise];

  const checkAnswer = () => {
    const expectedAnswers = decompositionType === 'additive' 
      ? currentEx.additiveDecomposition 
      : currentEx.multiplicativeDecomposition;
    
    const userAnswerArray = Object.keys(userAnswers)
      .filter(key => key.startsWith(`ex${currentEx.id}_`))
      .map(key => userAnswers[key])
      .filter(answer => answer.trim() !== '');
    
    const correct = userAnswerArray.length === expectedAnswers.length &&
      userAnswerArray.every(answer => expectedAnswers.includes(answer.trim()));
    
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
      setUserAnswers({});
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswers({});
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setCurrentExercise(0);
    setUserAnswers({});
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

  const formatNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getNumberDigits = (number: string) => {
    const digits = number.split('').reverse();
    const positions = ['Unités', 'Dizaines', 'Centaines', 'Milliers', 'Dizaines de milliers', 'Centaines de milliers', 'Millions'];
    const values = [1, 10, 100, 1000, 10000, 100000, 1000000];
    
    return digits.map((digit, index) => ({
      digit,
      position: positions[index],
      value: values[index],
      isEmpty: digit === '0'
    })).filter(item => !item.isEmpty).reverse();
  };

  const renderPositionTable = () => {
    const numberDigits = getNumberDigits(currentEx.number);
    const positions = ['Millions', 'Cent. milliers', 'Diz. milliers', 'Milliers', 'Centaines', 'Dizaines', 'Unités'];
    
    return (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              {positions.map((pos, i) => (
                <th key={i} className="p-3 text-sm font-bold border border-purple-400 first:rounded-tl-lg last:rounded-tr-lg">
                  {pos}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              {Array.from({ length: 7 }, (_, i) => {
                const digitIndex = 6 - i;
                const digit = currentEx.number.length > digitIndex ? currentEx.number[currentEx.number.length - 1 - digitIndex] : '';
                const isPresent = currentEx.number.length > digitIndex && digit !== '0';
                const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200'];
                
                return (
                  <td key={i} className={`p-4 text-2xl font-bold border-2 ${
                    isPresent ? `${colors[i]} text-gray-900 border-gray-400` : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {digit || '0'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/chapitre/nombres-entiers-jusqu-au-million" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-lg text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧩 Décomposer les nombres</h1>
          <div className="flex justify-center items-center space-x-6 text-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-gray-800">Score: {score}/{exercises.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-gray-800">Tentatives: {attempts}</span>
            </div>
          </div>
        </div>

        {/* Sélecteur de type de décomposition */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🎯 Choisir le type de décomposition</h3>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setDecompositionType('additive')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                decompositionType === 'additive'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ➕ Décomposition additive
            </button>
            <button
              onClick={() => setDecompositionType('multiplicative')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                decompositionType === 'multiplicative'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ✖️ Décomposition multiplicative
            </button>
          </div>
        </div>

        {/* Rappel théorique */}
        {showTheoryReminder && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-blue-900">💡 Rappel : les décompositions</h3>
              <button
                onClick={() => setShowTheoryReminder(false)}
                className="text-blue-800 hover:text-blue-900 font-medium"
              >
                Masquer
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-blue-800 mb-3">➕ Décomposition additive :</h4>
                <div className="space-y-2 text-sm text-gray-800">
                  <div className="bg-blue-100 p-2 rounded text-blue-900">
                    <strong>Exemple :</strong> 2574 = 2000 + 500 + 70 + 4
                  </div>
                  <div className="text-gray-800">• On additionne les valeurs de chaque position</div>
                  <div className="text-gray-800">• Chaque chiffre devient sa valeur réelle</div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-green-800 mb-3">✖️ Décomposition multiplicative :</h4>
                <div className="space-y-2 text-sm text-gray-800">
                  <div className="bg-green-100 p-2 rounded text-green-900">
                    <strong>Exemple :</strong> 2574 = 2×1000 + 5×100 + 7×10 + 4×1
                  </div>
                  <div className="text-gray-800">• On multiplie chaque chiffre par sa position</div>
                  <div className="text-gray-800">• Plus précis pour comprendre le système décimal</div>
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
              🧩 Décompose le nombre :
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-6">
              {currentEx.numberFormatted}
            </div>
          </div>

          {/* Tableau des positions */}
          {renderPositionTable()}

          {/* Zone de saisie */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="text-center mb-4">
              <h4 className="text-lg font-bold text-gray-900">
                {decompositionType === 'additive' ? '➕ Décomposition additive' : '✖️ Décomposition multiplicative'}
              </h4>
              <p className="text-sm text-gray-800 mt-2">
                {decompositionType === 'additive' 
                  ? 'Écris les valeurs à additionner (ex: 2000, 500, 70, 4)' 
                  : 'Écris les multiplications (ex: 2×1000, 5×100, 7×10, 4×1)'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {(decompositionType === 'additive' ? currentEx.additiveDecomposition : currentEx.multiplicativeDecomposition).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={userAnswers[`ex${currentEx.id}_${index}`] || ''}
                    onChange={(e) => setUserAnswers({
                      ...userAnswers,
                      [`ex${currentEx.id}_${index}`]: e.target.value
                    })}
                    placeholder={decompositionType === 'additive' ? '2000' : '2×1000'}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-gray-900 placeholder-gray-500"
                    disabled={showAnswer}
                  />
                  {index < (decompositionType === 'additive' ? currentEx.additiveDecomposition : currentEx.multiplicativeDecomposition).length - 1 && (
                    <span className="text-xl font-bold text-gray-800">+</span>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={checkAnswer}
                disabled={showAnswer}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  showAnswer
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600 text-white transform hover:scale-105'
                }`}
              >
                Vérifier
              </button>
            </div>
          </div>

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
                    {isCorrect ? '🎉 Parfait ! Bien décomposé !' : '❌ Pas tout à fait...'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-semibold text-gray-800 mb-2">
                      {decompositionType === 'additive' ? '➕ Décomposition additive correcte :' : '✖️ Décomposition multiplicative correcte :'}
                    </div>
                    <div className="font-mono text-lg text-purple-600">
                      {(decompositionType === 'additive' ? currentEx.additiveDecomposition : currentEx.multiplicativeDecomposition).join(' + ')}
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
                ? 'bg-gray-200 text-gray-700 cursor-not-allowed' 
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
            <div className="text-sm text-gray-800">
              {Math.round(((currentExercise + 1) / exercises.length) * 100)}% complété
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={nextExercise}
            disabled={currentExercise === exercises.length - 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentExercise === exercises.length - 1 
                ? 'bg-gray-200 text-gray-700 cursor-not-allowed' 
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
                <span className="text-gray-800">Exercices réussis :</span>
                <span className="font-bold text-green-600">{score}/{exercises.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800">Taux de réussite :</span>
                <span className="font-bold text-blue-600">
                  {exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800">Tentatives totales :</span>
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
                  href="/chapitre/nombres-entiers-jusqu-au-million/representer"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
                >
                  <span>📏 Représenter les nombres</span>
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