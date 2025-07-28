'use client';

import { useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle, XCircle, RotateCcw, Award, Target } from 'lucide-react';
import Link from 'next/link';

export default function EcrireNombresEntiersPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [showTheoryReminder, setShowTheoryReminder] = useState(true);

  const exercises = [
    {
      id: 1,
      text: "Deux mille trois cent quarante-cinq",
      answer: "2345",
      difficulty: "Facile",
      explanation: "Deux mille = 2000, trois cent = 300, quarante = 40, cinq = 5",
      breakdown: ["2000", "300", "40", "5"],
      total: "2000 + 300 + 40 + 5 = 2345"
    },
    {
      id: 2,
      text: "Mille sept cent cinquante-deux",
      answer: "1752",
      difficulty: "Facile",
      explanation: "Mille = 1000, sept cent = 700, cinquante = 50, deux = 2",
      breakdown: ["1000", "700", "50", "2"],
      total: "1000 + 700 + 50 + 2 = 1752"
    },
    {
      id: 3,
      text: "Trois mille quatre cent huit",
      answer: "3408",
      difficulty: "Facile",
      explanation: "Trois mille = 3000, quatre cent = 400, huit = 8",
      breakdown: ["3000", "400", "8"],
      total: "3000 + 400 + 8 = 3408"
    },
    {
      id: 4,
      text: "Cinq mille neuf cent vingt-six",
      answer: "5926",
      difficulty: "Facile",
      explanation: "Cinq mille = 5000, neuf cent = 900, vingt-six = 26",
      breakdown: ["5000", "900", "26"],
      total: "5000 + 900 + 26 = 5926"
    },
    {
      id: 5,
      text: "Huit mille soixante-treize",
      answer: "8073",
      difficulty: "Facile",
      explanation: "Huit mille = 8000, soixante-treize = 73",
      breakdown: ["8000", "73"],
      total: "8000 + 73 = 8073"
    },
    {
      id: 6,
      text: "Vingt-sept mille six cent douze",
      answer: "27612",
      difficulty: "Facile",
      explanation: "Vingt-sept mille = 27000, six cent = 600, douze = 12",
      breakdown: ["27000", "600", "12"],
      total: "27000 + 600 + 12 = 27612"
    },
    {
      id: 7,
      text: "Quarante-trois mille deux cent quatre-vingt-quinze",
      answer: "43295",
      difficulty: "Moyen",
      explanation: "Quarante-trois mille = 43000, deux cent = 200, quatre-vingt-quinze = 95",
      breakdown: ["43000", "200", "95"],
      total: "43000 + 200 + 95 = 43295"
    },
    {
      id: 8,
      text: "Soixante-dix mille sept cent quarante",
      answer: "70740",
      difficulty: "Moyen",
      explanation: "Soixante-dix mille = 70000, sept cent = 700, quarante = 40",
      breakdown: ["70000", "700", "40"],
      total: "70000 + 700 + 40 = 70740"
    },
    {
      id: 9,
      text: "Cent cinquante-trois mille quatre-vingt-sept",
      answer: "153087",
      difficulty: "Moyen",
      explanation: "Cent cinquante-trois mille = 153000, quatre-vingt-sept = 87",
      breakdown: ["153000", "87"],
      total: "153000 + 87 = 153087"
    },
    {
      id: 10,
      text: "Quatre cent mille",
      answer: "400000",
      difficulty: "Moyen",
      explanation: "Quatre cent mille = 400000, pas d'unités simples",
      breakdown: ["400000"],
      total: "400000"
    },
    {
      id: 11,
      text: "Deux cent soixante-cinq mille neuf cent un",
      answer: "265901",
      difficulty: "Moyen",
      explanation: "Deux cent soixante-cinq mille = 265000, neuf cent un = 901",
      breakdown: ["265000", "901"],
      total: "265000 + 901 = 265901"
    },
    {
      id: 12,
      text: "Trois cent quatre-vingt-dix mille six cent cinquante",
      answer: "390650",
      difficulty: "Moyen",
      explanation: "Trois cent quatre-vingt-dix mille = 390000, six cent cinquante = 650",
      breakdown: ["390000", "650"],
      total: "390000 + 650 = 390650"
    },
    {
      id: 13,
      text: "Cinq cent soixante-dix-huit mille neuf cent trois",
      answer: "578903",
      difficulty: "Difficile",
      explanation: "Cinq cent soixante-dix-huit mille = 578000, neuf cent trois = 903",
      breakdown: ["578000", "903"],
      total: "578000 + 903 = 578903"
    },
    {
      id: 14,
      text: "Sept cent vingt-trois mille quarante-deux",
      answer: "723042",
      difficulty: "Difficile",
      explanation: "Sept cent vingt-trois mille = 723000, quarante-deux = 42",
      breakdown: ["723000", "42"],
      total: "723000 + 42 = 723042"
    },
    {
      id: 15,
      text: "Huit cent quatre-vingt-dix-neuf mille sept cent soixante-dix",
      answer: "899770",
      difficulty: "Difficile",
      explanation: "Huit cent quatre-vingt-dix-neuf mille = 899000, sept cent soixante-dix = 770",
      breakdown: ["899000", "770"],
      total: "899000 + 770 = 899770"
    },
    {
      id: 16,
      text: "Un million deux cent mille",
      answer: "1200000",
      difficulty: "Difficile",
      explanation: "Un million = 1000000, deux cent mille = 200000",
      breakdown: ["1000000", "200000"],
      total: "1000000 + 200000 = 1200000"
    },
    {
      id: 17,
      text: "Deux millions quarante-sept mille cent",
      answer: "2047100",
      difficulty: "Difficile",
      explanation: "Deux millions = 2000000, quarante-sept mille = 47000, cent = 100",
      breakdown: ["2000000", "47000", "100"],
      total: "2000000 + 47000 + 100 = 2047100"
    },
    {
      id: 18,
      text: "Trois millions cinq cent mille vingt-trois",
      answer: "3500023",
      difficulty: "Difficile",
      explanation: "Trois millions = 3000000, cinq cent mille = 500000, vingt-trois = 23",
      breakdown: ["3000000", "500000", "23"],
      total: "3000000 + 500000 + 23 = 3500023"
    },
    {
      id: 19,
      text: "Cinq millions huit cent soixante-douze mille quatre cent",
      answer: "5872400",
      difficulty: "Difficile",
      explanation: "Cinq millions = 5000000, huit cent soixante-douze mille = 872000, quatre cent = 400",
      breakdown: ["5000000", "872000", "400"],
      total: "5000000 + 872000 + 400 = 5872400"
    },
    {
      id: 20,
      text: "Neuf millions neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf",
      answer: "9999999",
      difficulty: "Difficile",
      explanation: "Neuf millions = 9000000, neuf cent quatre-vingt-dix-neuf mille = 999000, neuf cent quatre-vingt-dix-neuf = 999",
      breakdown: ["9000000", "999000", "999"],
      total: "9000000 + 999000 + 999 = 9999999"
    }
  ];

  const currentEx = exercises[currentExercise];

  const checkAnswer = () => {
    const userNum = userAnswer.replace(/\s/g, '');
    const correct = userNum === currentEx.answer;
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
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setCurrentExercise(0);
    setUserAnswer('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/chapitre/nombres-entiers-jusqu-au-million" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow-lg text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">✏️ Écrire les nombres</h1>
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
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-yellow-900">💡 Méthode pour écrire un nombre</h3>
              <button
                onClick={() => setShowTheoryReminder(false)}
                className="text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Masquer
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-yellow-800 mb-3">📋 Étapes à suivre :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-200 w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-900">1</span>
                    <span className="text-gray-800">Séparer les mots : millions, milliers, unités</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-200 w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-900">2</span>
                    <span className="text-gray-800">Convertir chaque partie en chiffres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-200 w-6 h-6 rounded-full flex items-center justify-center font-bold text-gray-900">3</span>
                    <span className="text-gray-800">Additionner toutes les valeurs</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-yellow-800 mb-3">⚠️ Attention :</h4>
                <div className="space-y-2 text-sm text-gray-800">
                  <div>• <strong>Mille</strong> = 1000 (jamais de 's')</div>
                  <div>• <strong>Millions</strong> = 1000000 (avec 's' au pluriel)</div>
                  <div>• <strong>Cent</strong> = 100</div>
                  <div>• <strong>Soixante-dix</strong> = 70</div>
                  <div>• <strong>Quatre-vingts</strong> = 80</div>
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
              🎯 Écris ce nombre en chiffres :
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-6 bg-blue-50 p-4 rounded-lg">
              "{currentEx.text}"
            </div>
          </div>

          <div className="max-w-md mx-auto mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Ta réponse :
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Ex: 12345"
                className="flex-1 px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-600 bg-white"
                disabled={showAnswer}
              />
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim() || showAnswer}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  !userAnswer.trim() || showAnswer
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105'
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
                    {isCorrect ? '🎉 Bravo ! Correct !' : '❌ Pas tout à fait...'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="text-lg">
                    <strong>Réponse :</strong> 
                    <span className="font-mono text-xl ml-2 text-blue-600">
                      {formatNumber(currentEx.answer)}
                    </span>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg">
                    <div className="font-semibold text-gray-800 mb-2">📝 Décomposition :</div>
                    <div className="space-y-1">
                      {currentEx.breakdown.map((part, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="bg-blue-100 px-2 py-1 rounded text-sm font-medium">
                            {part}
                          </span>
                          {index < currentEx.breakdown.length - 1 && <span>+</span>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 font-mono text-lg text-green-600">
                      {currentEx.total}
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
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
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
                  href="/chapitre/nombres-entiers-jusqu-au-million/decomposition"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
                >
                  <span>🧩 Décomposer les nombres</span>
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