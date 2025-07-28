'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target } from 'lucide-react';

export default function TablesMultiplicationPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0); // Score de la session actuelle
  const [totalScore, setTotalScore] = useState(0); // Score total mutualisé
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [selectedTable, setSelectedTable] = useState<2 | 3 | 4 | 5 | 'mixed'>(2);
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [challengeMode, setChallengeMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  const [totalChallengeQuestions, setTotalChallengeQuestions] = useState(0);
  const [showChallengeResult, setShowChallengeResult] = useState(false);

  // Charger le score total depuis localStorage au démarrage
  useEffect(() => {
    const savedTotalScore = localStorage.getItem('tables-multiplication-total-score');
    if (savedTotalScore) {
      setTotalScore(parseInt(savedTotalScore));
    }
  }, []);

  // Sauvegarder le score total à chaque changement
  useEffect(() => {
    localStorage.setItem('tables-multiplication-total-score', totalScore.toString());
  }, [totalScore]);

  const generateExercises = (table: 2 | 3 | 4 | 5 | 'mixed') => {
    if (table === 'mixed') {
      // Générer des exercices mélangés de toutes les tables
      const allTables = [2, 3, 4, 5];
      const mixedExercises: any[] = [];
      
      // Créer un pool d'exercices de toutes les tables
      allTables.forEach(tableNum => {
        for (let i = 1; i <= 10; i++) {
          mixedExercises.push({
            question: `${tableNum} × ${i}`,
            answer: (tableNum * i).toString(),
            explanation: `${tableNum} × ${i} = ${tableNum * i}`,
            table: tableNum
          });
        }
      });
      
      // Mélanger et prendre 15 exercices
      const shuffled = [];
      for (let i = 0; i < 15; i++) {
        shuffled.push(mixedExercises[Math.floor(Math.random() * mixedExercises.length)]);
      }
      
      return shuffled;
    } else {
      // Générer les exercices pour une table spécifique
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
    }
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
    setScore(0); // Reset score de session mais pas le score total
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
  }, [selectedTable]);

  const checkAnswer = () => {
    const correct = userAnswer.trim() === exercises[currentExercise]?.answer;
    setIsCorrect(correct);
    
    let newScore = score;
    if (correct && !answeredCorrectly.has(currentExercise)) {
      newScore = score + 1;
      setScore(newScore);
      setTotalScore(prev => prev + 1); // Incrémenter le score total
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
          setFinalScore(newScore);
          setShowCompletionModal(true);
          
          // Sauvegarder les progrès
          const maxScore = exercises.length;
          saveProgress(newScore, maxScore);
        }
      }, 1500);
    }
    // Si mauvaise réponse → afficher solution + bouton "Suivant"
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      
      // Sauvegarder les progrès
      const maxScore = exercises.length;
      saveProgress(score, maxScore);
    }
  };

  // Fonction pour sauvegarder les progrès et calculer l'XP
  const saveProgress = (score: number, maxScore: number) => {
    // Utiliser le score total pour le calcul de l'XP
    const effectiveScore = Math.min(totalScore, 40); // Max 40 points (tous les exercices de toutes les tables)
    const percentage = Math.round((effectiveScore / 40) * 100);
    const baseXP = 25; // XP de base pour cette section
    const xpEarned = Math.round(baseXP * (percentage / 100));
    
    const progress = {
      sectionId: 'tables-multiplication',
      completed: totalScore >= 20, // Considéré complété après 20 bonnes réponses
      score: totalScore, // Utiliser le score total
      maxScore: 40, // Total possible de tous les exercices
      completedAt: new Date().toISOString(),
      attempts: 1,
      xpEarned: xpEarned
    };

    // Récupérer les progrès existants
    const existingProgress = localStorage.getItem('ce1-calcul-mental-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'tables-multiplication');
      
      if (existingIndex >= 0) {
        // Toujours mettre à jour avec le score total (car il s'accumule)
        allProgress[existingIndex] = { 
          ...progress, 
          attempts: allProgress[existingIndex].attempts + 1 
        };
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('ce1-calcul-mental-progress', JSON.stringify(allProgress));
    
    // Déclencher l'événement storage pour mettre à jour les autres onglets
    window.dispatchEvent(new Event('storage'));
  };

  const resetExercises = () => {
    const newExercises = generateExercises(selectedTable);
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0); // Reset score de session seulement
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  const resetAllScores = () => {
    setTotalScore(0);
    localStorage.removeItem('tables-multiplication-total-score');
    resetExercises();
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
    // Éviter de vérifier plusieurs fois la même réponse
    if (isCorrect !== null) return;
    
    const correct = userAnswer.trim() === exercises[currentExercise]?.answer;
    setIsCorrect(correct);
    setTotalChallengeQuestions(prev => prev + 1);
    
    if (correct) {
      setChallengeScore(prev => prev + 1);
      setTotalScore(prev => prev + 1); // Incrémenter le score total aussi
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

  // Fonction pour scroller en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const baseXP = 25; // XP de base pour cette section
              const xpEarned = Math.round(baseXP * (percentage / 100));
              
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
                  <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                    <div className={`text-xl font-bold mb-2 ${result.color}`}>
                      Session: {finalScore}/{exercises.length} ({percentage}%) • Total: {totalScore}
                    </div>
                    <div className={`text-lg font-bold ${result.color} flex items-center justify-center`}>
                      <Target className="w-5 h-5 mr-2" />
                      +{xpEarned} XP gagnés !
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button
                      onClick={resetExercises}
                      className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                    >
                      ✨ Recommencer
                    </button>
                    <button
                      onClick={resetAllScores}
                      className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                      🔄 Reset Total
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour au calcul mental</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              ✖️ Tables de multiplication
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends les tables de multiplication !
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200">
            {/* Layout mobile : 2 en haut, 1 en bas centré */}
            <div className="flex flex-col gap-3 md:flex-row md:gap-2">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setShowExercises(false);
                    setChallengeMode(false);
                    stopChallenge();
                    scrollToTop();
                  }}
                  className={`px-4 py-3 md:px-6 rounded-lg font-bold transition-all border-2 shadow-sm ${
                    !showExercises && !challengeMode 
                      ? 'bg-red-500 text-white border-red-600 shadow-md transform scale-105' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:shadow-md hover:scale-105'
                  }`}
                >
                  📖 Cours
                </button>
                <button
                  onClick={() => {
                    setShowExercises(true);
                    setChallengeMode(false);
                    stopChallenge();
                    scrollToTop();
                  }}
                  className={`px-4 py-3 md:px-6 rounded-lg font-bold transition-all border-2 shadow-sm ${
                    showExercises && !challengeMode 
                      ? 'bg-purple-500 text-white border-purple-600 shadow-md transform scale-105' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span className="hidden md:inline">✏️ Exercices (Total: {totalScore})</span>
                  <span className="md:hidden">✏️ Exercices ({totalScore})</span>
                </button>
              </div>
              
              {/* Défi Chrono centré en bas sur mobile */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowExercises(false);
                    setChallengeMode(true);
                    scrollToTop();
                  }}
                  className={`px-4 py-3 md:px-6 rounded-lg font-bold transition-all border-2 shadow-sm ${
                    challengeMode 
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md transform scale-105' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md hover:scale-105'
                  }`}
                >
                  🏆 Défi Chrono
                </button>
              </div>
            </div>
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
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && userAnswer.trim() && isCorrect === null) {
                            checkChallengeAnswer();
                          }
                        }}
                          className="text-4xl font-bold text-center p-4 border-2 border-gray-300 rounded-xl w-40 focus:border-orange-500 focus:outline-none"
                          placeholder="?"
                          autoFocus
                        />
                      </div>

                      <button
                        onClick={checkChallengeAnswer}
                        disabled={!userAnswer.trim() || isCorrect !== null}
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
              
              {/* Version mobile : Liste déroulante */}
              <div className="block md:hidden">
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value as 2 | 3 | 4 | 5 | 'mixed')}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                >
                  <option value={2}>Table de 2</option>
                  <option value={3}>Table de 3</option>
                  <option value={4}>Table de 4</option>
                  <option value={5}>Table de 5</option>
                  <option value="mixed">🎲 Tables mélangées</option>
                </select>
              </div>
              
              {/* Version desktop : Boutons */}
              <div className="hidden md:flex justify-center gap-4">
                {([2, 3, 4, 5] as const).map(table => (
                  <button
                    key={table}
                    onClick={() => setSelectedTable(table)}
                    className={`px-6 py-3 rounded-lg font-bold text-lg transition-all border-2 ${
                      selectedTable === table
                        ? 'bg-red-500 text-white border-red-600 shadow-lg transform scale-105'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:shadow-md'
                    }`}
                  >
                    Table de {table}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTable('mixed')}
                  className={`px-6 py-3 rounded-lg font-bold text-lg transition-all border-2 ${
                    selectedTable === 'mixed'
                      ? 'bg-purple-500 text-white border-purple-600 shadow-lg transform scale-105'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  🎲 Tables mélangées
                </button>
              </div>
              
              {/* Indication de la sélection actuelle */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {selectedTable === 'mixed' ? '🎲 Tables mélangées' : `Table de ${selectedTable}`}
                </div>
              </div>
            </div>

            {exercises.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Question {currentExercise + 1} sur {exercises.length}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Score sous la barre */}
                                <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  Session: {score}/{exercises.length} • Total: {totalScore}
                </div>
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
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim() && isCorrect === null) {
                          checkAnswer();
                        }
                      }}
                      className="text-3xl font-bold text-center p-4 border-2 border-gray-300 rounded-xl w-32 focus:border-red-500 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                  </div>

                  {!isCorrect && isCorrect !== null && (
                    <button
                      onClick={nextExercise}
                      className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
                    >
                      Suivant →
                    </button>
                  )}
                </div>

                {isCorrect !== null && (
                  <div className={`p-4 sm:p-6 rounded-xl ${
                    isCorrect 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    <div className="text-xl sm:text-2xl font-bold mb-2">
                      {isCorrect ? '✅ Correct !' : '❌ Incorrect'}
                    </div>
                    <div className="text-base sm:text-lg">
                      {exercises[currentExercise]?.explanation}
                    </div>
                  </div>
                )}


              
              {/* Navigation */}
              <div className="mt-6 sm:mt-8">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => setUserAnswer('')}
                    className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
                  >
                    Effacer
                  </button>
                  <button
                    onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                    disabled={currentExercise === 0}
                    className="bg-gray-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                  >
                    ← Précédent
                  </button>
                  <button
                    onClick={() => {
                      // Si l'utilisateur a tapé une réponse mais n'a pas encore vérifié, on vérifie d'abord
                      if (userAnswer.trim() && isCorrect === null) {
                        checkAnswer();
                      } else if (currentExercise < exercises.length - 1) {
                        setCurrentExercise(currentExercise + 1);
                        setUserAnswer('');
                        setIsCorrect(null);
                      }
                    }}
                    disabled={!userAnswer.trim() && isCorrect === null}
                    className="bg-red-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                  >
                    {userAnswer.trim() && isCorrect === null ? '✅ Vérifier' : 'Suivant →'}
                  </button>
                </div>
              </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 