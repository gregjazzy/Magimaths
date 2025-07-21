'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Clock, Zap, Star } from 'lucide-react';

export default function AdditionsSimplesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [difficulty, setDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('facile');
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Générer les exercices selon la difficulté
  const generateExercises = (level: 'facile' | 'moyen' | 'difficile') => {
    const exercises = [];
    
    switch (level) {
      case 'facile':
        // Additions jusqu'à 10
        for (let i = 1; i <= 5; i++) {
          for (let j = 1; j <= 5; j++) {
            if (i + j <= 10) {
              exercises.push({
                question: `${i} + ${j}`,
                answer: (i + j).toString(),
                time: 10
              });
            }
          }
        }
        break;
        
      case 'moyen':
        // Additions jusqu'à 15
        for (let i = 1; i <= 10; i++) {
          for (let j = 1; j <= 10; j++) {
            if (i + j <= 15 && i + j > 10) {
              exercises.push({
                question: `${i} + ${j}`,
                answer: (i + j).toString(),
                time: 8
              });
            }
          }
        }
        break;
        
      case 'difficile':
        // Additions jusqu'à 20
        for (let i = 5; i <= 15; i++) {
          for (let j = 5; j <= 15; j++) {
            if (i + j <= 20 && i + j > 15) {
              exercises.push({
                question: `${i} + ${j}`,
                answer: (i + j).toString(),
                time: 6
              });
            }
          }
        }
        break;
    }
    
    return exercises.sort(() => Math.random() - 0.5).slice(0, 15);
  };

  useEffect(() => {
    const newExercises = generateExercises(difficulty);
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
    setTimeLeft(0);
    setIsTimerActive(false);
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      setIsCorrect(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  const startTimer = () => {
    if (exercises[currentExercise]) {
      setTimeLeft(exercises[currentExercise].time);
      setIsTimerActive(true);
    }
  };

  const checkAnswer = () => {
    setIsTimerActive(false);
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
          setTimeLeft(0);
          setIsTimerActive(false);
        } else {
          // Dernière question, afficher la modal
          setFinalScore(score + (!answeredCorrectly.has(currentExercise) ? 1 : 0));
          setShowCompletionModal(true);
        }
      }, 1500);
    }
    // Si mauvaise réponse → afficher solution + bouton "Suivant"
    // (pas de passage automatique, l'utilisateur doit cliquer sur "Suivant")
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setTimeLeft(0);
      setIsTimerActive(false);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setTimeLeft(0);
    setIsTimerActive(false);
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "⚡ Calculateur éclair !", 
                  message: "Tu es incroyablement rapide en calcul !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "🚀 Très rapide !", 
                  message: "Tu calcules de mieux en mieux !", 
                  color: "text-orange-600",
                  bgColor: "bg-orange-50" 
                };
                if (percentage >= 50) return { 
                  title: "⏰ En progression !", 
                  message: "Continue à t'entraîner pour gagner en vitesse !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "La vitesse vient avec l'entraînement !", 
                  color: "text-gray-600",
                  bgColor: "bg-gray-50" 
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
                      onClick={() => setShowCompletionModal(false)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        setShowCompletionModal(false);
                        resetAll();
                      }}
                      className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                      Recommencer
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
              ➕ Additions simples
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Maîtrise les additions rapides !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <div className="bg-white rounded-lg p-1 shadow-md w-full sm:w-auto">
            <div className="grid grid-cols-2 sm:flex gap-1">
              <button
                onClick={() => setShowExercises(false)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  !showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => setShowExercises(true)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  showExercises 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ✏️ Exercices ({score}/{exercises.length})
              </button>
            </div>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Stratégies de calcul rapide */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ⚡ Stratégies pour calculer vite
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">🔢 Compter en avançant</h3>
                  <p className="text-blue-700 mb-3">Pour 7 + 4 :</p>
                  <ul className="space-y-2 text-blue-600">
                    <li>• Pars de 7 (le plus grand)</li>
                    <li>• Ajoute 4 : 8, 9, 10, 11</li>
                    <li>• Résultat : 11 !</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-bold text-green-800 mb-3 text-lg">🎯 Utiliser les doubles</h3>
                  <p className="text-green-700 mb-3">Pour 6 + 7 :</p>
                  <ul className="space-y-2 text-green-600">
                    <li>• Je sais que 6 + 6 = 12</li>
                    <li>• Donc 6 + 7 = 12 + 1 = 13</li>
                    <li>• Plus rapide !</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-bold text-purple-800 mb-3 text-lg">🧩 Décomposer</h3>
                  <p className="text-purple-700 mb-3">Pour 8 + 5 :</p>
                  <ul className="space-y-2 text-purple-600">
                    <li>• 8 + 2 = 10 (j'utilise 2 du 5)</li>
                    <li>• Il reste 3 du 5</li>
                    <li>• 10 + 3 = 13 !</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-bold text-orange-800 mb-3 text-lg">🚀 Mémoriser</h3>
                  <p className="text-orange-700 mb-3">Les additions fréquentes :</p>
                  <ul className="space-y-2 text-orange-600">
                    <li>• 9 + 9 = 18</li>
                    <li>• 8 + 8 = 16</li>
                    <li>• 7 + 7 = 14</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conseils pour s'entraîner */}
            <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🏆 Conseils d'entraînement</h3>
              <ul className="space-y-2">
                <li>• ⏰ Commence doucement, puis accélère</li>
                <li>• 🎯 Utilise un chrono pour te défier</li>
                <li>• 🧠 Visualise les nombres dans ta tête</li>
                <li>• 📝 Entraîne-toi 10 minutes par jour</li>
                <li>• 🎉 Célèbre tes progrès !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Configuration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">⚙️ Choisis ton niveau</h2>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'facile', label: '😊 Facile (jusqu\'à 10)', time: '10s' },
                  { id: 'moyen', label: '🤔 Moyen (jusqu\'à 15)', time: '8s' },
                  { id: 'difficile', label: '🤯 Difficile (jusqu\'à 20)', time: '6s' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setDifficulty(level.id as any)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      difficulty === level.id 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level.label}
                    <div className="text-xs opacity-75">{level.time} par calcul</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-orange-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {exercises.length > 0 && (
              <>
                {/* Question avec chrono */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  {/* Chronomètre */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-lg ${
                      timeLeft > 3 ? 'bg-green-100 text-green-800' :
                      timeLeft > 0 ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Clock className="w-5 h-5" />
                      <span>{timeLeft}s</span>
                    </div>
                  </div>

                  <h3 className="text-4xl font-bold mb-8 text-center text-gray-900">
                    {exercises[currentExercise]?.question} = ?
                  </h3>
                  
                  <div className="text-center mb-6">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="?"
                      className="w-32 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      disabled={isCorrect !== null}
                    />
                  </div>
                  
                  <div className="flex justify-center space-x-4 mb-6">
                    {!isTimerActive && isCorrect === null && (
                      <button
                        onClick={startTimer}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                      >
                        <Zap className="inline w-4 h-4 mr-2" />
                        Démarrer le chrono
                      </button>
                    )}
                    
                    {isTimerActive && (
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer.trim()}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        <Target className="inline w-4 h-4 mr-2" />
                        Vérifier
                      </button>
                    )}
                  </div>
                  
                  {/* Résultat */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center justify-center space-x-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-bold">Super ! Tu calcules de plus en plus vite ! ⚡</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6" />
                            <span className="font-bold">
                              {timeLeft === 0 ? 'Temps écoulé !' : 'Pas encore !'} {exercises[currentExercise]?.question} = {exercises[currentExercise]?.answer}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                      disabled={currentExercise === 0}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={nextExercise}
                      disabled={currentExercise === exercises.length - 1}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      Suivant →
                    </button>
                  </div>
                </div>


              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 