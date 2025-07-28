'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Divide, Calculator } from 'lucide-react';

export default function DivisionPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userQuotient, setUserQuotient] = useState('');
  const [userRemainder, setUserRemainder] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showDemo, setShowDemo] = useState(true);

  const exercises = [
    // Divisions exactes simples
    {
      id: 1,
      operation: '24 ÷ 6',
      dividend: 24,
      divisor: 6,
      quotient: 4,
      remainder: 0,
      difficulty: 'Facile',
      explanation: 'Division exacte : 24 ÷ 6 = 4 (reste 0)',
      steps: [
        'Je cherche combien de fois 6 va dans 24',
        '6 × 4 = 24',
        'Donc 24 ÷ 6 = 4 reste 0'
      ]
    },
    {
      id: 2,
      operation: '35 ÷ 5',
      dividend: 35,
      divisor: 5,
      quotient: 7,
      remainder: 0,
      difficulty: 'Facile',
      explanation: 'Division exacte : 35 ÷ 5 = 7 (reste 0)',
      steps: [
        'Je cherche combien de fois 5 va dans 35',
        '5 × 7 = 35',
        'Donc 35 ÷ 5 = 7 reste 0'
      ]
    },
    // Divisions avec reste
    {
      id: 3,
      operation: '27 ÷ 4',
      dividend: 27,
      divisor: 4,
      quotient: 6,
      remainder: 3,
      difficulty: 'Moyen',
      explanation: 'Division avec reste : 27 ÷ 4 = 6 reste 3',
      steps: [
        'Je cherche combien de fois 4 va dans 27',
        '4 × 6 = 24',
        '27 - 24 = 3',
        'Donc 27 ÷ 4 = 6 reste 3'
      ]
    },
    {
      id: 4,
      operation: '38 ÷ 7',
      dividend: 38,
      divisor: 7,
      quotient: 5,
      remainder: 3,
      difficulty: 'Moyen',
      explanation: 'Division avec reste : 38 ÷ 7 = 5 reste 3',
      steps: [
        'Je cherche combien de fois 7 va dans 38',
        '7 × 5 = 35',
        '38 - 35 = 3',
        'Donc 38 ÷ 7 = 5 reste 3'
      ]
    },
    // Divisions à 3 chiffres
    {
      id: 5,
      operation: '126 ÷ 3',
      dividend: 126,
      divisor: 3,
      quotient: 42,
      remainder: 0,
      difficulty: 'Moyen',
      explanation: 'Division posée : 126 ÷ 3 = 42',
      steps: [
        '1 ÷ 3 = 0 reste 1',
        '12 ÷ 3 = 4',
        '6 ÷ 3 = 2',
        'Résultat : 42'
      ]
    },
    {
      id: 6,
      operation: '156 ÷ 4',
      dividend: 156,
      divisor: 4,
      quotient: 39,
      remainder: 0,
      difficulty: 'Moyen',
      explanation: 'Division posée : 156 ÷ 4 = 39',
      steps: [
        '1 ÷ 4 = 0 reste 1',
        '15 ÷ 4 = 3 reste 3',
        '36 ÷ 4 = 9',
        'Résultat : 39'
      ]
    },
    // Divisions avec reste à 3 chiffres
    {
      id: 7,
      operation: '157 ÷ 6',
      dividend: 157,
      divisor: 6,
      quotient: 26,
      remainder: 1,
      difficulty: 'Difficile',
      explanation: 'Division posée avec reste : 157 ÷ 6 = 26 reste 1',
      steps: [
        '1 ÷ 6 = 0 reste 1',
        '15 ÷ 6 = 2 reste 3',
        '37 ÷ 6 = 6 reste 1',
        'Résultat : 26 reste 1'
      ]
    },
    {
      id: 8,
      operation: '283 ÷ 5',
      dividend: 283,
      divisor: 5,
      quotient: 56,
      remainder: 3,
      difficulty: 'Difficile',
      explanation: 'Division posée avec reste : 283 ÷ 5 = 56 reste 3',
      steps: [
        '2 ÷ 5 = 0 reste 2',
        '28 ÷ 5 = 5 reste 3',
        '33 ÷ 5 = 6 reste 3',
        'Résultat : 56 reste 3'
      ]
    },
    // Divisions plus complexes
    {
      id: 9,
      operation: '456 ÷ 7',
      dividend: 456,
      divisor: 7,
      quotient: 65,
      remainder: 1,
      difficulty: 'Difficile',
      explanation: 'Division posée complexe : 456 ÷ 7 = 65 reste 1',
      steps: [
        '4 ÷ 7 = 0 reste 4',
        '45 ÷ 7 = 6 reste 3',
        '36 ÷ 7 = 5 reste 1',
        'Résultat : 65 reste 1'
      ]
    },
    {
      id: 10,
      operation: '789 ÷ 8',
      dividend: 789,
      divisor: 8,
      quotient: 98,
      remainder: 5,
      difficulty: 'Difficile',
      explanation: 'Division posée complexe : 789 ÷ 8 = 98 reste 5',
      steps: [
        '7 ÷ 8 = 0 reste 7',
        '78 ÷ 8 = 9 reste 6',
        '69 ÷ 8 = 8 reste 5',
        'Résultat : 98 reste 5'
      ]
    }
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    const quotient = parseInt(userQuotient);
    const remainder = parseInt(userRemainder) || 0;
    
    const isCorrect = quotient === exercise.quotient && remainder === exercise.remainder;
    
    setIsCorrect(isCorrect);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserQuotient('');
      setUserRemainder('');
      setShowAnswer(false);
      setIsCorrect(false);
      setShowDemo(true);
    }
  };

  const resetExercise = () => {
    setUserQuotient('');
    setUserRemainder('');
    setShowAnswer(false);
    setIsCorrect(false);
    setShowDemo(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDivisionDemo = () => {
    const exercise = getCurrentExercise();
    
    return (
      <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Divide className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-purple-800">
            Méthode division euclidienne
          </h3>
        </div>
        
        {/* Calcul en colonnes */}
        <div className="font-mono text-xl text-center mb-4 bg-white p-4 rounded border">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="text-center">
              <div className="font-bold text-blue-600">{exercise.dividend}</div>
              <div className="text-sm text-gray-600">dividende</div>
            </div>
            <div className="text-2xl font-bold text-purple-600">÷</div>
            <div className="text-center">
              <div className="font-bold text-purple-600">{exercise.divisor}</div>
              <div className="text-sm text-gray-600">diviseur</div>
            </div>
            <div className="text-2xl font-bold text-gray-600">=</div>
            <div className="text-center">
              <div className="font-bold text-green-600">{exercise.quotient}</div>
              <div className="text-sm text-gray-600">quotient</div>
            </div>
            {exercise.remainder > 0 && (
              <>
                <div className="text-xl font-bold text-gray-600">reste</div>
                <div className="text-center">
                  <div className="font-bold text-red-600">{exercise.remainder}</div>
                  <div className="text-sm text-gray-600">reste</div>
                </div>
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mt-2">
            Vérification : {exercise.quotient} × {exercise.divisor} {exercise.remainder > 0 ? `+ ${exercise.remainder}` : ''} = {exercise.dividend}
          </div>
        </div>
        
        {/* Étapes détaillées */}
        <div className="space-y-2">
          <div className="font-semibold text-gray-800">Étapes :</div>
          {exercise.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chapitre/cm1-operations-arithmetiques" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Division euclidienne</h1>
            <p className="text-gray-600">Division avec diviseur à un chiffre</p>
          </div>
        </div>

        {/* Progression */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Exercice {currentExercise + 1} / {exercises.length}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-700">{score}/{attempts}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(getCurrentExercise().difficulty)}`}>
                {getCurrentExercise().difficulty}
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Exercice principal */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Calcule : {getCurrentExercise().operation}
            </h3>
            <p className="text-gray-600">
              Division euclidienne (quotient et reste)
            </p>
          </div>

          {/* Démonstration */}
          {showDemo && renderDivisionDemo()}

          {/* Zone de réponse */}
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quotient :
                </label>
                <input
                  type="number"
                  value={userQuotient}
                  onChange={(e) => setUserQuotient(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg text-center font-mono bg-white text-gray-900"
                  placeholder="Quotient"
                  disabled={showAnswer}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reste :
                </label>
                <input
                  type="number"
                  value={userRemainder}
                  onChange={(e) => setUserRemainder(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg text-center font-mono bg-white text-gray-900"
                  placeholder="Reste"
                  disabled={showAnswer}
                />
              </div>
            </div>

            <div className="text-center text-sm text-gray-600 mb-6">
              Rappel : dividende = quotient × diviseur + reste
            </div>

            {!showAnswer ? (
              <div className="flex gap-3">
                <button
                  onClick={checkAnswer}
                  disabled={!userQuotient}
                  className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Vérifier
                </button>
                <button
                  onClick={resetExercise}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset
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
                      {isCorrect ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <p className="text-red-700">
                      La bonne réponse est : quotient = <span className="font-bold">{getCurrentExercise().quotient}</span>, reste = <span className="font-bold">{getCurrentExercise().remainder}</span>
                    </p>
                  )}
                  <p className="text-gray-700 mt-2">
                    {getCurrentExercise().explanation}
                  </p>
                </div>

                <div className="flex gap-3">
                  {currentExercise < exercises.length - 1 ? (
                    <button
                      onClick={nextExercise}
                      className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                    >
                      Exercice suivant
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  ) : (
                    <Link
                      href="/chapitre/cm1-operations-arithmetiques"
                      className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-5 h-5" />
                      Chapitre terminé !
                    </Link>
                  )}
                  <button
                    onClick={resetExercise}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Recommencer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conseils */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">Conseils pour réussir</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">➗ Division euclidienne :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cherche combien de fois le diviseur va dans le dividende</li>
                <li>• Multiplie le quotient par le diviseur</li>
                <li>• Soustrais pour trouver le reste</li>
                <li>• Vérifie : quotient × diviseur + reste = dividende</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">📏 Règles importantes :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Le reste est toujours plus petit que le diviseur</li>
                <li>• Si le reste est 0, la division est exacte</li>
                <li>• Procède chiffre par chiffre de gauche à droite</li>
                <li>• Abaisse le chiffre suivant si nécessaire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 