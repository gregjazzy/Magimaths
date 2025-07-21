'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TablesMultiplicationPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [selectedTable, setSelectedTable] = useState<2 | 3 | 4 | 5>(2);
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [challengeMode, setChallengeMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  const [totalChallengeQuestions, setTotalChallengeQuestions] = useState(0);
  const [showChallengeResult, setShowChallengeResult] = useState(false);

  const generateExercises = (table: 2 | 3 | 4 | 5) => {
    const exercises = [];
    
    // Générer tous les calculs de la table
    for (let i = 1; i <= 10; i++) {
      exercises.push({
        question: `${table} × ${i}`,
        answer: (table * i).toString(),
        explanation: `${table} × ${i} = ${table * i}`
      });
    }
    
    // Mélanger et prendre 15 exercices (avec répétitions possibles)
    const shuffled = [];
    for (let i = 0; i < 15; i++) {
      shuffled.push(exercises[Math.floor(Math.random() * exercises.length)]);
    }
    
    return shuffled;
  };

  // Générer des exercices mixtes pour le défi (toutes les tables mélangées)
  const generateChallengeExercises = () => {
    const allTables = [2, 3, 4, 5];
    const mixedExercises: any[] = [];
    
    // Créer un pool d'exercices de toutes les tables
    allTables.forEach(table => {
      for (let i = 1; i <= 10; i++) {
        mixedExercises.push({
          question: `${table} × ${i}`,
          answer: (table * i).toString(),
          explanation: `${table} × ${i} = ${table * i}`,
          table: table
        });
      }
    });
    
    // Mélanger et retourner le pool complet
    return mixedExercises.sort(() => Math.random() - 0.5);
  };

  // Timer pour le défi
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      // Temps écoulé
      setIsTimerRunning(false);
      setShowChallengeResult(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    const newExercises = generateExercises(selectedTable);
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
  }, [selectedTable]);

  const checkAnswer = () => {
    const correct = userAnswer.trim() === exercises[currentExercise]?.answer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    // Si bonne réponse → passage automatique après 1.5s
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          setFinalScore(score + (!answeredCorrectly.has(currentExercise) ? 1 : 0));
          setShowCompletionModal(true);
        }
      }, 1500);
    }
    // Si mauvaise réponse → afficher solution + bouton "Suivant"
    // (pas de passage automatique, l'utilisateur doit cliquer sur "Suivant")
  };

  const resetExercises = () => {
    const newExercises = generateExercises(selectedTable);
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Démarrer le défi
  const startChallenge = () => {
    const challengeExercises = generateChallengeExercises();
    setExercises(challengeExercises);
    setChallengeMode(true);
    setCurrentExercise(0);
    setChallengeScore(0);
    setTotalChallengeQuestions(0);
    setUserAnswer('');
    setIsCorrect(null);
    setTimeLeft(60);
    setIsTimerRunning(true);
    setShowChallengeResult(false);
  };

  // Vérifier réponse dans le défi
  const checkChallengeAnswer = () => {
    const correct = userAnswer.trim() === exercises[currentExercise]?.answer;
    setIsCorrect(correct);
    setTotalChallengeQuestions(prev => prev + 1);
    
    if (correct) {
      setChallengeScore(prev => prev + 1);
    }

    // Passer à la question suivante après un délai
    setTimeout(() => {
      if (currentExercise + 1 < exercises.length && timeLeft > 0) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer('');
        setIsCorrect(null);
      }
    }, 1000);
  };

  // Arrêter le défi
  const stopChallenge = () => {
    setIsTimerRunning(false);
    setChallengeMode(false);
    setShowChallengeResult(false);
    setTimeLeft(60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🏆 Expert de la table de " + selectedTable + " !", 
                  message: "Tu connais parfaitement cette table !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "🎯 Très bien !", 
                  message: "Continue à t'entraîner pour devenir un expert !", 
                  color: "text-blue-600",
                  bgColor: "bg-blue-50" 
                };
                if (percentage >= 50) return { 
                  title: "📚 Bien joué !", 
                  message: "Tu progresses, continue tes efforts !", 
                  color: "text-orange-600",
                  bgColor: "bg-orange-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Révise bien la table et recommence !", 
                  color: "text-red-600",
                  bgColor: "bg-red-50" 
                };
              };
              const result = getMessage();
              return (
                <div className={`${result.bgColor} rounded-2xl p-6`}>
                  <div className="text-6xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 50 ? "😊" : "📚"}</div>
                  <h3 className={`text-2xl font-bold mb-3 ${result.color}`}>{result.title}</h3>
                  <p className={`text-lg mb-4 ${result.color}`}>{result.message}</p>
                  <p className={`text-xl font-bold mb-6 ${result.color}`}>
                    Score final : {finalScore}/{exercises.length} ({percentage}%)
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={resetExercises}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                    >
                      ✨ Recommencer
                    </button>
                    <button
                      onClick={() => setShowCompletionModal(false)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors"
                    >
                      📖 Retour au cours
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au calcul mental</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✖️ Tables de multiplication
            </h1>
            <p className="text-gray-600 text-lg">
              Mémorise les tables de 2, 3, 4 et 5 !
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                setShowExercises(false);
                setChallengeMode(false);
                stopChallenge();
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises && !challengeMode ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                setShowExercises(true);
                setChallengeMode(false);
                stopChallenge();
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises && !challengeMode ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
            <button
              onClick={() => {
                setShowExercises(false);
                setChallengeMode(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                challengeMode ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🏆 Défi Chrono
            </button>
          </div>
        </div>

        {challengeMode ? (
          /* MODE DÉFI CHRONO */
          <div className="space-y-8">
            {!isTimerRunning && !showChallengeResult ? (
              /* Écran de démarrage du défi */
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Défi Chrono Tables</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Mix de toutes les tables • 60 secondes • Score maximum !
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-orange-800 mb-3">🎯 Règles du défi</h3>
                  <ul className="text-orange-700 space-y-2">
                    <li>• Questions mélangées des tables de 2, 3, 4 et 5</li>
                    <li>• Tu as 60 secondes pour répondre au maximum de questions</li>
                    <li>• Chaque bonne réponse = 1 point</li>
                    <li>• Sois rapide ET précis !</li>
                  </ul>
                </div>
                
                <button
                  onClick={startChallenge}
                  className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-orange-600 transform hover:scale-105 transition-all"
                >
                  🚀 Commencer le défi !
                </button>
              </div>
            ) : showChallengeResult ? (
              /* Résultats du défi */
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="text-6xl mb-4">⏰</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Temps écoulé !</h2>
                
                <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6 mb-6">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {challengeScore}/{totalChallengeQuestions}
                  </div>
                  <p className="text-lg text-gray-700 mb-2">Bonnes réponses</p>
                  <div className="text-2xl font-bold text-gray-800">
                    {totalChallengeQuestions > 0 ? Math.round((challengeScore / totalChallengeQuestions) * 100) : 0}% de réussite
                  </div>
                </div>
                
                {(() => {
                  const percentage = totalChallengeQuestions > 0 ? Math.round((challengeScore / totalChallengeQuestions) * 100) : 0;
                  const getMessage = () => {
                    if (challengeScore >= 20) return { 
                      title: "🏆 CHAMPION ULTIME !", 
                      message: "Incroyable ! Tu es un vrai champion des tables !", 
                      color: "text-green-600" 
                    };
                    if (challengeScore >= 15) return { 
                      title: "🥇 EXCELLENT !", 
                      message: "Bravo ! Tu maîtrises très bien tes tables !", 
                      color: "text-blue-600" 
                    };
                    if (challengeScore >= 10) return { 
                      title: "🥈 TRÈS BIEN !", 
                      message: "Bon travail ! Continue à t'entraîner !", 
                      color: "text-orange-600" 
                    };
                    return { 
                      title: "🥉 CONTINUE !", 
                      message: "C'est un bon début ! Entraîne-toi encore !", 
                      color: "text-red-600" 
                    };
                  };
                  const result = getMessage();
                  return (
                    <div className="mb-6">
                      <h3 className={`text-2xl font-bold mb-2 ${result.color}`}>{result.title}</h3>
                      <p className={`text-lg ${result.color}`}>{result.message}</p>
                    </div>
                  );
                })()}
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startChallenge}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                  >
                    🔄 Recommencer
                  </button>
                  <button
                    onClick={stopChallenge}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors"
                  >
                    📖 Retour
                  </button>
                </div>
              </div>
            ) : (
              /* Interface du défi en cours */
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                {/* Timer et stats */}
                <div className="flex justify-between items-center mb-6">
                  <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                    ⏱️ {timeLeft}s
                  </div>
                  <div className="text-xl font-bold text-gray-700">
                    Score: {challengeScore}/{totalChallengeQuestions}
                  </div>
                  <button
                    onClick={stopChallenge}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                  >
                    ⏹️ Arrêter
                  </button>
                </div>
                
                {exercises.length > 0 && currentExercise < exercises.length && (
                  <div>
                    <div className="mb-8">
                      <h3 className="text-4xl font-bold text-gray-900 mb-6">
                        {exercises[currentExercise]?.question} = ?
                      </h3>
                      
                      <div className="mb-6">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && checkChallengeAnswer()}
                          className="text-4xl font-bold text-center p-4 border-2 border-gray-300 rounded-xl w-40 focus:border-orange-500 focus:outline-none"
                          placeholder="?"
                          autoFocus
                        />
                      </div>

                      <button
                        onClick={checkChallengeAnswer}
                        disabled={!userAnswer.trim()}
                        className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 disabled:bg-gray-300 transition-colors"
                      >
                        ✅ Valider
                      </button>
                    </div>

                    {isCorrect !== null && (
                      <div className={`p-4 rounded-xl ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <div className="text-xl font-bold mb-1">
                          {isCorrect ? '✅ Correct !' : '❌ Incorrect'}
                        </div>
                        <div className="text-sm">
                          {exercises[currentExercise]?.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : !showExercises ? (
          /* COURS */
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Les tables de multiplication
              </h2>
              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-lg text-red-900 text-center mb-4">
                  Il faut <strong>mémoriser</strong> ces tables par cœur !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    2 × 5 = 10
                  </div>
                  <p className="text-red-700">
                    2 fois 5, cela fait 10 !
                  </p>
                </div>
              </div>
            </div>

            {/* Tables complètes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[2, 3, 4, 5].map(table => (
                <div key={table} className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-center mb-4 text-gray-900">
                    Table de {table}
                  </h3>
                  <div className="space-y-2">
                    {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                      <div key={num} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                        <span className="font-bold text-gray-800">
                          {table} × {num}
                        </span>
                        <span className="text-2xl font-bold text-red-600">
                          {table * num}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Astuces */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                💡 Astuces pour retenir
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-3">🎵 Table de 2</h4>
                  <p className="text-blue-700 mb-3">C'est doubler !</p>
                  <ul className="space-y-2 text-blue-600">
                    <li>• 2 × 3 = 3 + 3 = 6</li>
                    <li>• 2 × 4 = 4 + 4 = 8</li>
                    <li>• Tous les résultats sont pairs !</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-green-800 mb-3">🖐️ Table de 5</h4>
                  <p className="text-green-700 mb-3">Ça finit par 0 ou 5 !</p>
                  <ul className="space-y-2 text-green-600">
                    <li>• 5 × 2 = 10</li>
                    <li>• 5 × 4 = 20</li>
                    <li>• 5 × 6 = 30</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Sélection de table */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-900">
                Choisis ta table :
              </h3>
              <div className="flex justify-center gap-4">
                {[2, 3, 4, 5].map(table => (
                  <button
                    key={table}
                    onClick={() => setSelectedTable(table as 2 | 3 | 4 | 5)}
                    className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                      selectedTable === table
                        ? 'bg-red-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-800 hover:bg-red-100'
                    }`}
                  >
                    Table de {table}
                  </button>
                ))}
              </div>
            </div>

            {exercises.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Question {currentExercise + 1} sur {exercises.length}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    {exercises[currentExercise]?.question} = ?
                  </h3>
                  
                  <div className="mb-6">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      className="text-3xl font-bold text-center p-4 border-2 border-gray-300 rounded-xl w-32 focus:border-red-500 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors"
                  >
                    Vérifier
                  </button>
                </div>

                {isCorrect !== null && (
                  <div className={`p-6 rounded-xl ${
                    isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="text-2xl font-bold mb-2">
                      {isCorrect ? '✅ Correct !' : '❌ Incorrect'}
                    </div>
                    <div className="text-lg">
                      {exercises[currentExercise]?.explanation}
                    </div>
                  </div>
                )}

                <div className="mt-6 text-gray-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 