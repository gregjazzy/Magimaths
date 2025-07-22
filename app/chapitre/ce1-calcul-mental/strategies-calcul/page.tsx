'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Brain, Lightbulb, Star } from 'lucide-react';

export default function StrategiesCalculPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Mélange d'exercices de tous types
  const generateMixedExercises = () => {
    const exercises = [];
    
    // Doubles
    for (let i = 1; i <= 5; i++) {
      exercises.push({
        question: `Double de ${i}`,
        answer: (i * 2).toString(),
        type: 'double',
        hint: `${i} + ${i} = ?`
      });
    }
    
    // Compléments à 10
    for (let i = 1; i <= 9; i++) {
      exercises.push({
        question: `${i} + ? = 10`,
        answer: (10 - i).toString(),
        type: 'complement',
        hint: `Combien manque-t-il à ${i} pour faire 10 ?`
      });
    }
    
    // Additions simples
    const additions = [
      [3, 4], [5, 2], [6, 3], [7, 2], [4, 5], [8, 1], [2, 7], [9, 1]
    ];
    additions.forEach(([a, b]) => {
      exercises.push({
        question: `${a} + ${b}`,
        answer: (a + b).toString(),
        type: 'addition',
        hint: `Compte à partir de ${Math.max(a, b)}`
      });
    });
    
    // Soustractions simples
    const subtractions = [
      [10, 3], [9, 4], [8, 2], [7, 5], [6, 1], [10, 7], [9, 2], [8, 6]
    ];
    subtractions.forEach(([a, b]) => {
      exercises.push({
        question: `${a} - ${b}`,
        answer: (a - b).toString(),
        type: 'soustraction',
        hint: `Pars de ${a} et recule de ${b}`
      });
    });
    
    return exercises.sort(() => Math.random() - 0.5).slice(0, 20);
  };

  useEffect(() => {
    const newExercises = generateMixedExercises();
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
          // Dernière question, afficher la modal
          setFinalScore(newScore);
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
    setShowCompletionModal(false);
    setFinalScore(0);
    const newExercises = generateMixedExercises();
    setExercises(newExercises);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'double': return '👥';
      case 'complement': return '🎯';
      case 'addition': return '➕';
      case 'soustraction': return '➖';
      default: return '🧠';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'double': return 'bg-green-100 text-green-800';
      case 'complement': return 'bg-blue-100 text-blue-800';
      case 'addition': return 'bg-orange-100 text-orange-800';
      case 'soustraction': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                  title: "🌟 Maître du calcul mental !", 
                  message: "Tu as maîtrisé toutes les stratégies ! Tu es devenu un vrai champion !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "🧠 Expert en stratégies !", 
                  message: "Tu utilises bien tes astuces de calcul !", 
                  color: "text-indigo-600",
                  bgColor: "bg-indigo-50" 
                };
                if (percentage >= 50) return { 
                  title: "📈 En bonne progression !", 
                  message: "Tu commences à bien maîtriser les stratégies !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue tes efforts !", 
                  message: "Les stratégies de calcul demandent de l'entraînement !", 
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
                  {percentage >= 70 && (
                    <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
                      <p className={`text-sm ${result.color}`}>
                        🏆 Bravo ! Tu peux maintenant passer aux autres chapitres de calcul mental !
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3 justify-center mt-4">
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
                      className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
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
              🧠 Stratégies de calcul
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends les astuces pour calculer plus vite !
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Stratégies
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises ? 'bg-purple-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices mixtes ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Les 5 stratégies principales */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Les 5 stratégies magiques
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🔢</span>
                    <h3 className="font-bold text-blue-800 text-lg">Compter astucieusement</h3>
                  </div>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Commence par le plus grand nombre</li>
                    <li>• Ajoute en comptant: 8 + 3 = 9, 10, 11</li>
                    <li>• Soustrais en reculant: 10 - 4 = 9, 8, 7, 6</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🎯</span>
                    <h3 className="font-bold text-green-800 text-lg">Utiliser 10</h3>
                  </div>
                  <ul className="space-y-2 text-green-700">
                    <li>• 7 + 5 = 7 + 3 + 2 = 10 + 2 = 12</li>
                    <li>• 13 - 4 = 13 - 3 - 1 = 10 - 1 = 9</li>
                    <li>• 10 est ton meilleur ami !</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">👥</span>
                    <h3 className="font-bold text-purple-800 text-lg">Doubles et presque-doubles</h3>
                  </div>
                  <ul className="space-y-2 text-purple-700">
                    <li>• 6 + 6 = 12, donc 6 + 7 = 13</li>
                    <li>• 4 + 4 = 8, donc 4 + 5 = 9</li>
                    <li>• Les doubles sont plus faciles !</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🔄</span>
                    <h3 className="font-bold text-orange-800 text-lg">Penser à l'inverse</h3>
                  </div>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Pour 12 - 8, pense: 8 + ? = 12</li>
                    <li>• C'est parfois plus facile !</li>
                    <li>• Addition et soustraction sont liées</li>
                  </ul>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-6 md:col-span-2">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🧠</span>
                    <h3 className="font-bold text-pink-800 text-lg">Visualiser</h3>
                  </div>
                  <ul className="space-y-2 text-pink-700">
                    <li>• Imagine les nombres comme des objets</li>
                    <li>• Utilise tes doigts pour les petits nombres</li>
                    <li>• Dessine dans ta tête</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exemples concrets */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                💡 Exemples pas à pas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-800 mb-3">Exemple 1 : 8 + 5</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Stratégie :</strong> Utiliser 10</p>
                    <p>• Je décompose 5 = 2 + 3</p>
                    <p>• 8 + 2 = 10</p>
                    <p>• 10 + 3 = 13</p>
                    <p className="text-green-600 font-bold">✅ Résultat : 13</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-800 mb-3">Exemple 2 : 15 - 7</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Stratégie :</strong> Penser addition</p>
                    <p>• 7 + ? = 15</p>
                    <p>• 7 + 3 = 10</p>
                    <p>• 10 + 5 = 15, donc 3 + 5 = 8</p>
                    <p className="text-green-600 font-bold">✅ Résultat : 8</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-800 mb-3">Exemple 3 : 6 + 7</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Stratégie :</strong> Doubles</p>
                    <p>• Je sais que 6 + 6 = 12</p>
                    <p>• 6 + 7 = 6 + 6 + 1</p>
                    <p>• 12 + 1 = 13</p>
                    <p className="text-green-600 font-bold">✅ Résultat : 13</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-800 mb-3">Exemple 4 : 9 + 4</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Stratégie :</strong> Compter intelligemment</p>
                    <p>• Je pars de 9 (le plus grand)</p>
                    <p>• J'ajoute 4 : 10, 11, 12, 13</p>
                    <p>• Ou: 9 + 1 = 10, puis 10 + 3 = 13</p>
                    <p className="text-green-600 font-bold">✅ Résultat : 13</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils finaux */}
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🌟 Les secrets des champions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li>• 🎯 Chaque problème a plusieurs solutions</li>
                  <li>• 🧠 Choisis la stratégie la plus facile pour toi</li>
                  <li>• ⚡ Entraîne-toi régulièrement</li>
                </ul>
                <ul className="space-y-2">
                  <li>• 🤝 N'hésite pas à utiliser tes doigts</li>
                  <li>• 💪 La vitesse vient avec la pratique</li>
                  <li>• 🎉 Amuse-toi en calculant !</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES MIXTES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Défi mixte {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Nouveau défi
                </button>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
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

            {exercises.length > 0 && (
              <>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  {/* Type d'exercice */}
                  <div className="text-center mb-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                      getTypeColor(exercises[currentExercise]?.type)
                    }`}>
                      <span className="mr-2">{getTypeIcon(exercises[currentExercise]?.type)}</span>
                      {exercises[currentExercise]?.type}
                    </span>
                  </div>

                  <h3 className="text-4xl font-bold mb-8 text-center text-gray-900">
                    {exercises[currentExercise]?.question} = ?
                  </h3>
                  
                  {/* Indice */}
                  <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-medium">
                        Indice : {exercises[currentExercise]?.hint}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-8">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim() && isCorrect === null) {
                          checkAnswer();
                        }
                      }}
                      placeholder="?"
                      className="w-32 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none mb-4"
                    />
                    
                    {/* Bouton Vérifier visible si pas encore vérifié */}
                    {isCorrect === null && userAnswer.trim() && (
                      <div className="mt-4">
                        <button
                          onClick={checkAnswer}
                          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors text-lg"
                        >
                          ✅ Vérifier
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      <div className="flex items-center justify-center space-x-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-bold">Excellent ! Tu utilises bien tes stratégies ! 🌟</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6" />
                            <span className="font-bold">
                              Essaie encore ! {exercises[currentExercise]?.question} = {exercises[currentExercise]?.answer}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
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
                        } else {
                          nextExercise();
                        }
                      }}
                      disabled={currentExercise === exercises.length - 1 || (!userAnswer.trim() && isCorrect === null)}
                      className="bg-indigo-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50 w-full md:w-auto"
                    >
                      {userAnswer.trim() && isCorrect === null ? '✅ Vérifier' : 'Suivant →'}
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