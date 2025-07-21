'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Complements100Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedComplement, setSelectedComplement] = useState<{base: number, complement: number} | null>(null);

  const generateExercises = () => {
    const exercises = [];
    
    // Compléments faciles (dizaines et nombres simples)
    const easyComplements = [
      {base: 30, complement: 70}, {base: 20, complement: 80}, {base: 40, complement: 60},
      {base: 10, complement: 90}, {base: 50, complement: 50}, {base: 60, complement: 40},
      {base: 70, complement: 30}, {base: 80, complement: 20}, {base: 90, complement: 10}
    ];
    
    // Compléments variés (pas que des multiples de 5)
    const hardComplements = [
      {base: 23, complement: 77}, {base: 27, complement: 73}, {base: 32, complement: 68},
      {base: 18, complement: 82}, {base: 26, complement: 74}, {base: 34, complement: 66},
      {base: 41, complement: 59}, {base: 38, complement: 62}, {base: 29, complement: 71},
      {base: 46, complement: 54}, {base: 33, complement: 67}, {base: 19, complement: 81},
      {base: 42, complement: 58}, {base: 36, complement: 64}, {base: 28, complement: 72}
    ];
    
    // Mélanger et prendre 20 exercices
    const allComplements = [...easyComplements, ...hardComplements];
    
    for (let i = 0; i < 20; i++) {
      const randomComplement = allComplements[Math.floor(Math.random() * allComplements.length)];
      
      // Varier les formulations
      const formulations = [
        {
          question: `${randomComplement.base} + ? = 100`,
          answer: randomComplement.complement.toString(),
          explanation: `${randomComplement.base} + ${randomComplement.complement} = 100`
        },
        {
          question: `100 - ${randomComplement.base} = ?`,
          answer: randomComplement.complement.toString(),
          explanation: `100 - ${randomComplement.base} = ${randomComplement.complement}`
        },
        {
          question: `? + ${randomComplement.base} = 100`,
          answer: randomComplement.complement.toString(),
          explanation: `${randomComplement.complement} + ${randomComplement.base} = 100`
        }
      ];
      
      exercises.push(formulations[Math.floor(Math.random() * formulations.length)]);
    }
    
    return exercises.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const newExercises = generateExercises();
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
  }, []);

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
  };

  const goToNext = () => {
    if (currentExercise + 1 < exercises.length) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetExercises = () => {
    const newExercises = generateExercises();
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
    setShowCompletionModal(false);
    setFinalScore(0);
    setSelectedComplement(null);
  };

  // Animation pour les compléments
  const showComplementAnimation = (base: number, complement: number) => {
    if (selectedComplement && selectedComplement.base === base && selectedComplement.complement === complement) {
      return;
    }
    
    setSelectedComplement({base, complement});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🏆 Champion des compléments à 100 !", 
                  message: "Tu maîtrises parfaitement les compléments à 100 !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "🎯 Très bien !", 
                  message: "Tu progresses bien avec les compléments à 100 !", 
                  color: "text-blue-600",
                  bgColor: "bg-blue-50" 
                };
                if (percentage >= 50) return { 
                  title: "📚 Bien joué !", 
                  message: "Continue à t'entraîner avec les compléments !", 
                  color: "text-orange-600",
                  bgColor: "bg-orange-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Les compléments à 100 demandent de l'entraînement !", 
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
                  <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                    <button
                      onClick={resetExercises}
                      className="bg-teal-500 text-white px-6 py-4 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-teal-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                    >
                      ✨ Recommencer
                    </button>
                    <button
                      onClick={() => setShowCompletionModal(false)}
                      className="bg-gray-500 text-white px-6 py-4 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
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
              💯 Compléments à 100
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Trouve ce qui manque pour faire 100 !
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <div className="bg-white rounded-lg p-1 shadow-md w-full sm:w-auto">
            <div className="grid grid-cols-2 sm:flex gap-1">
              <button
                onClick={() => {
                  setShowExercises(false);
                  setSelectedComplement(null);
                }}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  !showExercises ? 'bg-teal-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => {
                  setShowExercises(true);
                  setSelectedComplement(null);
                }}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  showExercises ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
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
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Qu'est-ce qu'un complément à 100 ?
              </h2>
              <div className="bg-teal-50 rounded-lg p-6">
                <p className="text-lg text-teal-900 text-center mb-4">
                  Le complément à 100, c'est <strong>ce qui manque</strong> pour arriver à 100 !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600 mb-2">
                    30 + ? = 100
                  </div>
                  <p className="text-teal-700">
                    30 + 70 = 100, donc le complément de 30 à 100 est 70 !
                  </p>
                </div>
              </div>
            </div>

            {/* Animation interactive */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🎭 Clique sur un calcul pour voir la décomposition !
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
                {[
                  {base: 30, complement: 70}, {base: 23, complement: 77}, 
                  {base: 32, complement: 68}, {base: 18, complement: 82},
                  {base: 27, complement: 73}, {base: 34, complement: 66},
                  {base: 41, complement: 59}, {base: 26, complement: 74}
                ].map(({base, complement}) => (
                  <button
                    key={`${base}-${complement}`}
                    onClick={() => showComplementAnimation(base, complement)}
                    className={`
                      p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-lg transition-all transform hover:scale-105 touch-manipulation min-h-[44px] flex items-center justify-center
                      ${selectedComplement && selectedComplement.base === base && selectedComplement.complement === complement 
                        ? 'bg-teal-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-800 hover:bg-teal-100 active:bg-teal-200'
                      }
                    `}
                  >
                    {base} + ?
                  </button>
                ))}
              </div>
              
              {/* Zone d'animation */}
              {selectedComplement && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      {selectedComplement.base} + ? = 100
                    </h4>
                    
                    {/* Barre visuelle */}
                    <div className="w-full max-w-md mx-auto mb-4">
                      <div className="flex bg-gray-200 rounded-lg h-12 overflow-hidden">
                        <div 
                          className="bg-teal-500 flex items-center justify-center text-white font-bold"
                          style={{ width: `${selectedComplement.base}%` }}
                        >
                          {selectedComplement.base}
                        </div>
                        <div 
                          className="bg-blue-300 flex items-center justify-center text-gray-800 font-bold border-l-2 border-white"
                          style={{ width: `${selectedComplement.complement}%` }}
                        >
                          {selectedComplement.complement}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Total = 100
                      </div>
                    </div>
                    
                    <div className="bg-teal-100 rounded-lg p-4">
                      <div className="text-2xl font-bold text-teal-600 mb-2">
                        {selectedComplement.base} + {selectedComplement.complement} = 100
                      </div>
                      <p className="text-teal-700">
                        Le complément de {selectedComplement.base} à 100 est {selectedComplement.complement} !
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stratégies */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🧠 Stratégies pour calculer
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-3">🔟 Avec les dizaines</h4>
                  <p className="text-blue-700 mb-3">Pour 30 + ? = 100 :</p>
                  <ul className="space-y-2 text-blue-600">
                    <li>• 30, c'est 3 dizaines</li>
                    <li>• 100, c'est 10 dizaines</li>
                    <li>• 10 - 3 = 7 dizaines = 70</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-green-800 mb-3">➖ Par soustraction</h4>
                  <p className="text-green-700 mb-3">Pour 25 + ? = 100 :</p>
                  <ul className="space-y-2 text-green-600">
                    <li>• Je calcule 100 - 25</li>
                    <li>• 100 - 25 = 75</li>
                    <li>• Donc 25 + 75 = 100</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {exercises.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">
                    Question {currentExercise + 1} sur {exercises.length}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    {exercises[currentExercise]?.question}
                  </h3>
                  
                  <div className="mb-6">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      className="text-3xl font-bold text-center p-4 border-2 border-gray-300 rounded-xl w-32 focus:border-teal-500 focus:outline-none"
                      placeholder="?"
                      autoFocus
                    />
                  </div>

                  {isCorrect === null ? (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-teal-500 text-white px-6 py-4 sm:px-8 sm:py-4 rounded-xl font-bold text-lg sm:text-xl hover:bg-teal-600 disabled:bg-gray-300 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto max-w-xs mx-auto"
                    >
                      Vérifier
                    </button>
                  ) : !isCorrect ? (
                    <button
                      onClick={goToNext}
                      className="bg-blue-500 text-white px-6 py-4 sm:px-8 sm:py-4 rounded-xl font-bold text-lg sm:text-xl hover:bg-blue-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto max-w-xs mx-auto"
                    >
                      Suivant →
                    </button>
                  ) : null}
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