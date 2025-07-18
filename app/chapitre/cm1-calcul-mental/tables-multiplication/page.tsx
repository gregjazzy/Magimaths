'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Zap, Calculator, Clock, Play, Pause, RotateCcw } from 'lucide-react';

export default function TablesMultiplicationPage() {
  const [currentSection, setCurrentSection] = useState<'cours' | 'exercices'>('cours');
  const [selectedTable, setSelectedTable] = useState(2);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameMode, setGameMode] = useState<'practice' | 'challenge'>('practice');
  const [animatedNumbers, setAnimatedNumbers] = useState<number[]>([]);

  // Générer les exercices selon la table sélectionnée
  const generateExercises = (table: number) => {
    const exercises = [];
    for (let i = 1; i <= 10; i++) {
      exercises.push({
        operation: `${table} × ${i}`,
        answer: table * i,
        table: table,
        factor: i
      });
    }
    // Mélanger les exercices
    return exercises.sort(() => Math.random() - 0.5);
  };

  const [exercises, setExercises] = useState(generateExercises(selectedTable));

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setShowAnswer(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Animation numbers effect
  useEffect(() => {
    if (currentSection === 'cours') {
      const interval = setInterval(() => {
        setAnimatedNumbers(prev => {
          const newNumbers = [...prev];
          newNumbers.push(Math.floor(Math.random() * 10) + 1);
          return newNumbers.slice(-5);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentSection]);

  const handleTableChange = (table: number) => {
    setSelectedTable(table);
    setExercises(generateExercises(table));
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    const isCorrect = parseInt(userAnswer) === exercises[currentExercise].answer;
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (isTimerRunning) {
      setIsTimerRunning(false);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setTimeLeft(10);
      
      if (gameMode === 'challenge') {
        setIsTimerRunning(true);
      }
    }
  };

  const startChallenge = () => {
    setGameMode('challenge');
    setCurrentExercise(0);
    setScore(0);
    setAttempts(0);
    setTimeLeft(10);
    setIsTimerRunning(true);
    setShowAnswer(false);
    setUserAnswer('');
  };

  const resetGame = () => {
    setCurrentExercise(0);
    setScore(0);
    setAttempts(0);
    setTimeLeft(10);
    setIsTimerRunning(false);
    setShowAnswer(false);
    setUserAnswer('');
    setGameMode('practice');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✖️ Tables de multiplication
            </h1>
            <p className="text-lg text-gray-600">
              Mémoriser les tables jusqu'à 10×10
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
            <button
              onClick={() => setCurrentSection('cours')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                currentSection === 'cours' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-orange-100 hover:text-red-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setCurrentSection('exercices')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                currentSection === 'exercices' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 hover:text-orange-800'
              }`}
            >
              ✏️ Exercices ({score}/{attempts})
            </button>
          </div>
        </div>

        {currentSection === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Sélecteur de table */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Choisissez votre table
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(table => (
                  <button
                    key={table}
                    onClick={() => handleTableChange(table)}
                    className={`p-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-md ${
                      selectedTable === table
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-red-100 hover:to-orange-100'
                    }`}
                  >
                    Table de {table}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage de la table sélectionnée */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">
                Table de {selectedTable}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(10)].map((_, i) => {
                  const factor = i + 1;
                  const result = selectedTable * factor;
                  return (
                    <div key={i} className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-gray-800">
                        {selectedTable} × {factor}
                      </div>
                      <div className="text-3xl font-bold text-red-600">=</div>
                      <div className="text-2xl font-bold text-orange-600 bg-white px-4 py-2 rounded-lg">
                        {result}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Astuces pour mémoriser */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Astuces pour mémoriser
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">🔢 Table de 2</h4>
                  <p className="text-blue-700">Double le nombre ! 2×4 = 4+4 = 8</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">✋ Table de 5</h4>
                  <p className="text-green-700">Termine par 0 ou 5 : 5×3=15, 5×4=20</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-2">🔟 Table de 10</h4>
                  <p className="text-purple-700">Ajoute juste un zéro : 10×7 = 70</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">🎯 Table de 9</h4>
                  <p className="text-yellow-700">Astuce des doigts : 9×4, baisse le 4ème doigt → 3 et 6 = 36</p>
                </div>
              </div>
            </div>

            {/* Nombres animés */}
            <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎨 Nombres en mouvement</h3>
              <div className="flex justify-center space-x-4 mb-4">
                {animatedNumbers.map((num, index) => (
                  <div
                    key={index}
                    className="text-4xl font-bold animate-bounce"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <p className="text-center">
                Regarde les nombres danser ! C'est comme ça que tu vas mémoriser tes tables !
              </p>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-red-600">
                    Score : {score}/{attempts}
                  </div>
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Sélecteur de mode */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-50 rounded-xl p-3 shadow-lg border-2 border-gray-200">
                  <button
                    onClick={() => setGameMode('practice')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                      gameMode === 'practice' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl border-2 border-blue-400 scale-105' 
                        : 'bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 hover:from-blue-300 hover:to-purple-300 hover:text-blue-900 border-2 border-blue-300'
                    }`}
                  >
                    🎯 Entraînement
                  </button>
                  <button
                    onClick={startChallenge}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      gameMode === 'challenge' 
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-xl border-2 border-red-400 scale-105' 
                        : 'bg-gradient-to-r from-red-200 to-orange-200 text-red-800 hover:from-red-300 hover:to-orange-300 hover:text-red-900 border-2 border-red-300'
                    }`}
                  >
                    ⚡ Défi chrono
                  </button>
                </div>
              </div>
              
              {/* Timer pour le mode défi */}
              {gameMode === 'challenge' && (
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${timeLeft <= 3 ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
                    ⏰ {timeLeft}s
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(timeLeft / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Sélecteur de table */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-50 rounded-xl p-3 shadow-lg border-2 border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Table à réviser :</label>
                  <select
                    value={selectedTable}
                    onChange={(e) => handleTableChange(parseInt(e.target.value))}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(table => (
                      <option key={table} value={table}>Table de {table}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-3xl font-bold mb-8 text-gray-900">
                Combien font :
              </h3>
              
              <div className="text-6xl font-bold text-red-600 mb-8">
                {exercises[currentExercise].operation} = ? 
                {showAnswer && (
                  <span className="text-green-600 ml-4">
                    {exercises[currentExercise].answer}
                  </span>
                )}
              </div>
              
              <div className="max-w-md mx-auto mb-8">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Tape ta réponse"
                  className="w-full text-4xl font-bold text-center p-4 border-4 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer && !showAnswer) {
                      checkAnswer();
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  ✨ Vérifier ✨
                </button>
                
                {showAnswer && (
                  <button
                    onClick={nextExercise}
                    disabled={currentExercise === exercises.length - 1}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    Suivant →
                  </button>
                )}
              </div>
              
              {/* Résultat */}
              {showAnswer && (
                <div className={`p-6 rounded-xl shadow-lg ${
                  parseInt(userAnswer) === exercises[currentExercise].answer 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {parseInt(userAnswer) === exercises[currentExercise].answer ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">🎉 Bravo ! C'est correct ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... La bonne réponse est {exercises[currentExercise].answer}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Résultats finaux */}
            {currentExercise === exercises.length - 1 && showAnswer && (
              <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Fantastique !</h3>
                <p className="text-lg mb-4">
                  Tu as terminé tous les exercices de la table de {selectedTable} !
                </p>
                <p className="text-xl font-bold">
                  Score final : {score}/{attempts}
                </p>
                <p className="text-lg mt-2">
                  Taux de réussite : {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 