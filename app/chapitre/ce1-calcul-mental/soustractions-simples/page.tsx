'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Minus } from 'lucide-react';

export default function SoustractionsSimples() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [difficulty, setDifficulty] = useState<'facile' | 'moyen'>('facile');
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSubtraction, setSelectedSubtraction] = useState<{a: number, b: number} | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateExercises = (level: 'facile' | 'moyen') => {
    const exercises = [];
    
    if (level === 'facile') {
      // Soustractions jusqu'à 10
      for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= i; j++) {
          exercises.push({
            question: `${i} - ${j}`,
            answer: (i - j).toString()
          });
        }
      }
    } else {
      // Soustractions jusqu'à 20
      for (let i = 10; i <= 20; i++) {
        for (let j = 1; j <= 10; j++) {
          if (i - j >= 0) {
            exercises.push({
              question: `${i} - ${j}`,
              answer: (i - j).toString()
            });
          }
        }
      }
    }
    
    return exercises.sort(() => Math.random() - 0.5).slice(0, 17);
  };

  useEffect(() => {
    const newExercises = generateExercises(difficulty);
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
  }, [difficulty]);

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
    // Réinitialiser l'animation
    setSelectedSubtraction(null);
    setAnimationStep(0);
    setIsAnimating(false);
  };

  // Animation pour montrer les soustractions
  const showSubtractionAnimation = (a: number, b: number) => {
    // Si on clique sur la même soustraction, ne rien faire
    if (selectedSubtraction && selectedSubtraction.a === a && selectedSubtraction.b === b && animationStep === 3) {
      return;
    }
    
    // Réinitialiser si on change de soustraction
    setSelectedSubtraction({a, b});
    setIsAnimating(true);
    setAnimationStep(0);
    
    setTimeout(() => setAnimationStep(1), 500);
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => {
      setAnimationStep(3);
      setIsAnimating(false); // Animation terminée, mais résultat reste affiché
    }, 1500);
  };

  // Render des éléments visuels pour la soustraction
  const renderSubtractionElements = (total: number, toRemove: number, step: number) => {
    const elements = [];
    
    // Afficher tous les éléments au début
    for (let i = 0; i < total; i++) {
      const isRemoved = step >= 2 && i >= (total - toRemove);
      elements.push(
        <div
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold m-1 transition-all duration-500 ${
            isRemoved 
              ? 'bg-gray-600 opacity-70 line-through' 
              : 'bg-pink-500'
          } ${step >= 1 ? 'slide-in' : ''}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {isRemoved ? '✗' : '●'}
        </div>
      );
    }
    
    return elements;
  };

  // Styles pour les animations
  const animationStyles = `
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0,-15px,0); }
      70% { transform: translate3d(0,-7px,0); }
      90% { transform: translate3d(0,-3px,0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .bounce { animation: bounce 0.6s ease-in-out; }
    .pulse { animation: pulse 1s ease-in-out infinite; }
    .slide-in { animation: slideIn 0.5s ease-out; }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <style jsx>{animationStyles}</style>
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🏆 As de la soustraction !", 
                  message: "Tu es devenu un expert en soustraction !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "⭐ Très bon travail !", 
                  message: "Tu maîtrises bien les soustractions !", 
                  color: "text-pink-600",
                  bgColor: "bg-pink-50" 
                };
                if (percentage >= 50) return { 
                  title: "👍 En bonne voie !", 
                  message: "Continue à t'entraîner avec les soustractions !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Les soustractions demandent de la pratique !", 
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
                      className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors"
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
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au calcul mental</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ➖ Soustractions simples
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à enlever des nombres facilement !
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                setShowExercises(false);
                // Réinitialiser l'animation quand on revient au cours
                setSelectedSubtraction(null);
                setAnimationStep(0);
                setIsAnimating(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises ? 'bg-pink-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                setShowExercises(true);
                // Réinitialiser l'animation quand on passe aux exercices
                setSelectedSubtraction(null);
                setAnimationStep(0);
                setIsAnimating(false);
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
                🎯 Qu'est-ce qu'une soustraction ?
              </h2>
              <div className="bg-pink-50 rounded-lg p-6">
                <p className="text-lg text-pink-900 text-center mb-4">
                  Soustraire, c'est <strong>enlever</strong> une quantité d'une autre !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600 mb-2">
                    8 - 3 = 5
                  </div>
                  <p className="text-pink-700">
                    J'avais 8, j'enlève 3, il me reste 5 !
                  </p>
                </div>
              </div>
            </div>

            {/* Animation interactive */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🎭 Clique sur un calcul pour voir l'animation !
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {a: 8, b: 3}, {a: 7, b: 2}, {a: 6, b: 4}, {a: 9, b: 5},
                  {a: 10, b: 3}, {a: 5, b: 2}, {a: 7, b: 4}, {a: 8, b: 6}
                ].map(({a, b}) => (
                  <button
                    key={`${a}-${b}`}
                    onClick={() => showSubtractionAnimation(a, b)}
                    disabled={isAnimating}
                    className={`
                      p-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105
                      ${selectedSubtraction && selectedSubtraction.a === a && selectedSubtraction.b === b 
                        ? 'bg-pink-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-800 hover:bg-pink-100'
                      }
                      ${isAnimating ? 'opacity-50' : ''}
                    `}
                  >
                    {a} - {b}
                  </button>
                ))}
              </div>
              
              {/* Zone d'animation */}
              {selectedSubtraction && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      {selectedSubtraction.a} - {selectedSubtraction.b} = ?
                    </h4>
                    {animationStep >= 1 && (
                      <p className="text-gray-600">
                        J'ai {selectedSubtraction.a} objets...
                      </p>
                    )}
                  </div>
                  
                  {/* Éléments visuels */}
                  <div className="flex flex-wrap justify-center mb-4">
                    {renderSubtractionElements(selectedSubtraction.a, selectedSubtraction.b, animationStep)}
                  </div>
                  
                  {animationStep >= 2 && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">
                        J'enlève {selectedSubtraction.b} objets...
                      </p>
                    </div>
                  )}
                  
                  {animationStep >= 3 && (
                    <div className="text-center bg-pink-100 rounded-lg p-4">
                      <div className="text-2xl font-bold text-pink-600 mb-2">
                        {selectedSubtraction.a} - {selectedSubtraction.b} = {selectedSubtraction.a - selectedSubtraction.b}
                      </div>
                      <p className="text-pink-700">
                        Il me reste {selectedSubtraction.a - selectedSubtraction.b} objet{selectedSubtraction.a - selectedSubtraction.b !== 1 ? 's' : ''} !
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stratégies */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🧠 Stratégies pour soustraire
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-bold text-blue-800 mb-3">📉 Compter à rebours</h4>
                  <p className="text-blue-700 mb-3">Pour 9 - 4 :</p>
                  <ul className="space-y-2 text-blue-600">
                    <li>• Pars de 9</li>
                    <li>• Recule de 4 : 8, 7, 6, 5</li>
                    <li>• Résultat : 5 !</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-green-800 mb-3">🤏 Utiliser les doigts</h4>
                  <p className="text-green-700 mb-3">Pour 7 - 2 :</p>
                  <ul className="space-y-2 text-green-600">
                    <li>• Lève 7 doigts</li>
                    <li>• Baisse 2 doigts</li>
                    <li>• Compte ce qui reste : 5 !</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-bold text-purple-800 mb-3">🎯 Penser à l'addition</h4>
                  <p className="text-purple-700 mb-3">Pour 10 - 6 :</p>
                  <ul className="space-y-2 text-purple-600">
                    <li>• Que dois-je ajouter à 6 pour faire 10 ?</li>
                    <li>• 6 + ? = 10</li>
                    <li>• La réponse est 4 !</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <h4 className="font-bold text-orange-800 mb-3">🔢 Décomposer</h4>
                  <p className="text-orange-700 mb-3">Pour 15 - 7 :</p>
                  <ul className="space-y-2 text-orange-600">
                    <li>• 15 - 5 = 10 (j'enlève 5 du 7)</li>
                    <li>• 10 - 2 = 8 (il reste 2 à enlever)</li>
                    <li>• Résultat : 8 !</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Conseils pour réussir</h3>
              <ul className="space-y-2">
                <li>• 🎯 Commence par les petits nombres</li>
                <li>• 🤏 Utilise tes doigts au début</li>
                <li>• 🧠 Visualise les objets qui partent</li>
                <li>• 🔄 Entraîne-toi avec les compléments</li>
                <li>• 📚 Répète tous les jours !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Configuration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900">⚙️ Choisis ta difficulté</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setDifficulty('facile')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    difficulty === 'facile' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  😊 Facile (jusqu'à 10)
                </button>
                <button
                  onClick={() => setDifficulty('moyen')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    difficulty === 'moyen' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🤔 Moyen (jusqu'à 20)
                </button>
              </div>
            </div>

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-pink-600">
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
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {exercises.length > 0 && (
              <>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-4xl font-bold mb-8 text-center text-gray-900">
                    {exercises[currentExercise]?.question} = ?
                  </h3>
                  
                  <div className="text-center mb-6">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="?"
                      className="w-32 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex justify-center space-x-4 mb-6">
                    {isCorrect === null ? (
                      <>
                        <button
                          onClick={checkAnswer}
                          disabled={!userAnswer.trim()}
                          className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
                        >
                          <Target className="inline w-4 h-4 mr-2" />
                          Vérifier
                        </button>
                        <button
                          onClick={() => { setUserAnswer(''); setIsCorrect(null); }}
                          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                        >
                          Effacer
                        </button>
                      </>
                    ) : !isCorrect ? (
                      <button
                        onClick={nextExercise}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                      >
                        Suivant →
                      </button>
                    ) : null}
                  </div>
                  
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center justify-center space-x-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-bold">Parfait ! Tu maîtrises bien les soustractions ! 🎉</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6" />
                            <span className="font-bold">
                              Pas tout à fait ! {exercises[currentExercise]?.question} = {exercises[currentExercise]?.answer}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
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
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
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