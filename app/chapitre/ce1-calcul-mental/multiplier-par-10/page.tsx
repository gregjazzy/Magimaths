'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MultiplierPar10Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const generateExercises = () => {
    const exercises = [];
    
    // Nombres simples (1 à 9)
    const simpleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // Nombres avec dizaines (10, 20, 30...)
    const roundNumbers = [10, 20, 30, 40, 50];
    
    // Autres nombres usuels
    const otherNumbers = [11, 12, 15, 18, 21, 25];
    
    const allNumbers = [...simpleNumbers, ...roundNumbers, ...otherNumbers];
    
    // Générer 15 exercices avec différentes formulations
    for (let i = 0; i < 15; i++) {
      const number = allNumbers[Math.floor(Math.random() * allNumbers.length)];
      
      const formulations = [
        {
          question: `${number} × 10`,
          answer: (number * 10).toString(),
          explanation: `${number} × 10 = ${number * 10}`
        },
        {
          question: `10 × ${number}`,
          answer: (number * 10).toString(),
          explanation: `10 × ${number} = ${number * 10}`
        },
        {
          question: `${number} dizaines`,
          answer: (number * 10).toString(),
          explanation: `${number} dizaines = ${number * 10}`
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
    
    let newScore = score;
    if (correct && !answeredCorrectly.has(currentExercise)) {
      newScore = score + 1;
      setScore(newScore);
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
    setSelectedNumber(null);
    setAnimationStep(0);
  };

  // Animation pour multiplier par 10
  const showMultiplication10Animation = (number: number) => {
    if (selectedNumber === number && animationStep === 3) {
      return;
    }
    
    setSelectedNumber(number);
    setAnimationStep(0);
    
    setTimeout(() => setAnimationStep(1), 500);
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => setAnimationStep(3), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🏆 Expert du ×10 !", 
                  message: "Tu maîtrises parfaitement la multiplication par 10 !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "🎯 Très bien !", 
                  message: "Tu progresses bien avec la multiplication par 10 !", 
                  color: "text-blue-600",
                  bgColor: "bg-blue-50" 
                };
                if (percentage >= 50) return { 
                  title: "📚 Bien joué !", 
                  message: "Continue à t'entraîner avec les multiplications !", 
                  color: "text-orange-600",
                  bgColor: "bg-orange-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "La multiplication par 10 s'apprend avec la pratique !", 
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
                      className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour au calcul mental</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              ✖️ Multiplier par 10
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Découvre la magie du x10 !
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                setShowExercises(false);
                setSelectedNumber(null);
                setAnimationStep(0);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                setShowExercises(true);
                setSelectedNumber(null);
                setAnimationStep(0);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Le secret de la multiplication par 10
              </h2>
              <div className="bg-indigo-50 rounded-lg p-6">
                <p className="text-lg text-indigo-900 text-center mb-4">
                  Pour multiplier par 10, il suffit d'<strong>ajouter un zéro</strong> à la fin !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">
                    7 × 10 = 70
                  </div>
                  <p className="text-indigo-700">
                    Je prends 7 et j'ajoute un 0 → 70 !
                  </p>
                </div>
              </div>
            </div>

            {/* Animation interactive */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🎭 Clique sur un nombre pour voir la transformation !
              </h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[2, 3, 5, 7, 8, 12].map((number) => (
                  <button
                    key={number}
                    onClick={() => showMultiplication10Animation(number)}
                    className={`
                      p-3 sm:p-4 rounded-lg font-bold text-base sm:text-lg transition-all transform hover:scale-105 touch-manipulation min-h-[44px]
                      ${selectedNumber === number 
                        ? 'bg-indigo-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-800 hover:bg-indigo-100 active:bg-indigo-200'
                      }
                    `}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              {/* Zone d'animation */}
              {selectedNumber && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      {selectedNumber} × 10 = ?
                    </h4>
                    
                    {/* Animation visuelle */}
                    <div className="flex items-center justify-center space-x-8 mb-6">
                      {/* Nombre de départ */}
                      <div className="text-center">
                        <div className={`text-4xl font-bold text-indigo-600 transition-all duration-500 ${
                          animationStep >= 1 ? 'scale-110' : ''
                        }`}>
                          {selectedNumber}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Nombre de départ</p>
                      </div>
                      
                      {/* Flèche et ×10 */}
                      {animationStep >= 1 && (
                        <div className="text-center animate-pulse">
                          <div className="text-3xl">→</div>
                          <div className="text-lg font-bold text-purple-600">× 10</div>
                        </div>
                      )}
                      
                      {/* Transformation */}
                      {animationStep >= 2 && (
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600 animate-bounce">
                            {selectedNumber}0
                          </div>
                          <p className="text-sm text-gray-600 mt-2">+ un zéro !</p>
                        </div>
                      )}
                    </div>
                    
                    {animationStep >= 3 && (
                      <div className="bg-indigo-100 rounded-lg p-4">
                        <div className="text-2xl font-bold text-indigo-600 mb-2">
                          {selectedNumber} × 10 = {selectedNumber * 10}
                        </div>
                        <p className="text-indigo-700">
                          J'ajoute un zéro à {selectedNumber} et j'obtiens {selectedNumber * 10} !
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Règles et astuces */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                📋 Les règles à retenir
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-green-800 mb-3">✅ Règle simple</h4>
                  <p className="text-green-700 mb-3">Pour un nombre entier :</p>
                  <ul className="space-y-2 text-green-600">
                    <li>• 5 × 10 = 50 (j'ajoute un 0)</li>
                    <li>• 12 × 10 = 120 (j'ajoute un 0)</li>
                    <li>• 25 × 10 = 250 (j'ajoute un 0)</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-3">🔢 Avec les dizaines</h4>
                  <p className="text-blue-700 mb-3">Ça marche aussi :</p>
                  <ul className="space-y-2 text-blue-600">
                    <li>• 3 dizaines = 30</li>
                    <li>• 5 dizaines = 50</li>
                    <li>• 8 dizaines = 80</li>
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
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Score sous la barre */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">
                      Score : {score}/{exercises.length}
                    </div>
                  </div>
                </div>

                <div className="mb-6 sm:mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    {exercises[currentExercise]?.question} = ?
                  </h3>
                  
                  <div className="mb-6 sm:mb-8">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim() && isCorrect === null) {
                          checkAnswer();
                        }
                      }}
                      className="text-2xl sm:text-3xl font-bold text-center p-3 sm:p-4 border-2 border-gray-300 rounded-xl w-32 sm:w-40 h-12 sm:h-16 focus:border-indigo-500 focus:outline-none mb-4 touch-manipulation"
                      placeholder="?"
                      autoFocus
                    />
                    

                  </div>
                </div>

                {isCorrect !== null && (
                  <div className={`p-6 rounded-xl ${
                    isCorrect 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    <div className="text-2xl font-bold mb-2">
                      {isCorrect ? '✅ Correct !' : '❌ Incorrect'}
                    </div>
                    <div className="text-lg">
                      {exercises[currentExercise]?.explanation}
                    </div>
                  </div>
                )}


              
              {/* Navigation */}
              <div className="mt-8">
                <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
                  <button
                    onClick={() => setUserAnswer('')}
                    className="bg-gray-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full md:w-auto"
                  >
                    Effacer
                  </button>
                  <button
                    onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                    disabled={currentExercise === 0}
                    className="bg-gray-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 w-full md:w-auto"
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
                    className="bg-indigo-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50 w-full md:w-auto"
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