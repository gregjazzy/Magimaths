'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Target } from 'lucide-react';

// Styles pour les animations
const animationStyles = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }
  
  .bounce { animation: bounce 0.6s ease-in-out; }
  .pulse { animation: pulse 1s ease-in-out infinite; }
  .wiggle { animation: wiggle 0.5s ease-in-out; }
  
  @keyframes slideIn {
    from { transform: translateX(-100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .slide-in { animation: slideIn 0.5s ease-out; }
`;

export default function DoublesEtMoitiesCE2() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedDouble, setSelectedDouble] = useState<number | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Exercices niveau CE1 - doubles et moitiés de nombres usuels variés (15 exercices)
  const baseExercises = [
    // Doubles petits nombres (fondamentaux)
    { question: 'Double de 6', answer: '12', visual: 6 },
    { question: 'Double de 7', answer: '14', visual: 7 },
    { question: 'Double de 8', answer: '16', visual: 8 },
    { question: 'Double de 9', answer: '18', visual: 9 },
    { question: 'Double de 4', answer: '8', visual: 4 },
    // Doubles nombres variés (pas que multiples de 5)
    { question: 'Double de 12', answer: '24', visual: 12 },
    { question: 'Double de 15', answer: '30', visual: 15 },
    { question: 'Double de 21', answer: '42', visual: 21 },
    { question: 'Double de 24', answer: '48', visual: 24 },
    { question: 'Double de 35', answer: '70', visual: 35 },
    // Moitiés petites (fondamentales)
    { question: 'Moitié de 12', answer: '6', visual: 12 },
    { question: 'Moitié de 14', answer: '7', visual: 14 },
    { question: 'Moitié de 16', answer: '8', visual: 16 },
    { question: 'Moitié de 18', answer: '9', visual: 18 },
    { question: 'Moitié de 48', answer: '24', visual: 48 }
  ];

  // Exercices mélangés - initialisés une seule fois
  const [allExercises, setAllExercises] = useState(() => shuffleArray(baseExercises));

  const checkAnswer = () => {
    const userAnswerStr = userAnswer.trim();
    const expectedAnswer = allExercises[currentExercise].answer;
    const correct = userAnswerStr === expectedAnswer;
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
        if (currentExercise + 1 < allExercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernière question, calculer le score final et sauvegarder
          setFinalScore(newScore);
          setShowCompletionModal(true);
          
          // Sauvegarder les progrès
          const maxScore = allExercises.length;
          saveProgress(newScore, maxScore);
        }
      }, 1500);
    }
    // Si mauvaise réponse → afficher solution + bouton "Suivant"
    // (pas de passage automatique, l'utilisateur doit cliquer sur "Suivant")
  };

  const nextExercise = () => {
    if (currentExercise < allExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      
      // Sauvegarder les progrès
      const maxScore = allExercises.length;
      saveProgress(score, maxScore);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
  };

  // Fonction pour sauvegarder les progrès et calculer l'XP
  const saveProgress = (score: number, maxScore: number) => {
    const percentage = Math.round((score / maxScore) * 100);
    const baseXP = 15; // XP de base pour cette section
    const xpEarned = Math.round(baseXP * (percentage / 100));
    
    const progress = {
      sectionId: 'doubles-moities',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1,
      xpEarned: xpEarned
    };

    // Récupérer les progrès existants
    const existingProgress = localStorage.getItem('ce1-calcul-mental-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'doubles-moities');
      
      if (existingIndex >= 0) {
        // Si le nouveau score est meilleur, on met à jour
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = { 
            ...progress, 
            attempts: allProgress[existingIndex].attempts + 1 
          };
        } else {
          allProgress[existingIndex].attempts += 1;
        }
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

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    // Réinitialiser l'animation
    setSelectedDouble(null);
    // Remélanger les exercices pour un nouvel ordre
    setAllExercises(shuffleArray(baseExercises));
  };

  // Animation pour montrer les doubles
  const showDoubleAnimation = (number: number) => {
    // Réinitialiser l'animation si un autre nombre était sélectionné
    if (selectedDouble !== null && selectedDouble !== number) {
      setAnimationStep(0);
      setIsAnimating(false);
    }
    
    setSelectedDouble(number);
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Animation step by step
    setTimeout(() => setAnimationStep(1), 500);
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => setAnimationStep(3), 1500);
    setTimeout(() => setIsAnimating(false), 2000);
    // Le résultat reste affiché jusqu'à ce qu'un autre nombre soit sélectionné
  };

  // Render des éléments visuels pour les doubles (adapté aux nombres plus grands)
  const renderVisualElements = (count: number, color: string = 'bg-blue-500') => {
    if (count <= 10) {
      // Pour les petits nombres : affichage individuel
      return Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-bold m-1 slide-in`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          ●
        </div>
      ));
    } else {
      // Pour les nombres plus grands : affichage par groupes de 5 ou 10
      const groups = Math.floor(count / 5);
      const remainder = count % 5;
      const elements = [];
      
      // Groupes de 5
      for (let g = 0; g < groups; g++) {
        elements.push(
          <div
            key={`group-${g}`}
            className={`${color} rounded-lg p-2 m-1 slide-in flex items-center justify-center`}
            style={{ animationDelay: `${g * 0.2}s` }}
          >
            <span className="text-white font-bold text-sm">5</span>
          </div>
        );
      }
      
      // Éléments restants
      for (let r = 0; r < remainder; r++) {
        elements.push(
          <div
            key={`remainder-${r}`}
            className={`w-6 h-6 ${color} rounded-full flex items-center justify-center text-white font-bold m-1 slide-in`}
            style={{ animationDelay: `${(groups + r) * 0.1}s` }}
          >
            ●
          </div>
        );
      }
      
      return elements;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <style jsx>{animationStyles}</style>
      
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / allExercises.length) * 100);
              const baseXP = 15; // XP de base pour cette section
              const xpEarned = Math.round(baseXP * (percentage / 100));
              
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🎉 Champion des doubles !", 
                  message: "Tu maîtrises parfaitement les doubles et moitiés !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "👏 Super travail !", 
                  message: "Tu connais bien tes doubles et moitiés !", 
                  color: "text-blue-600",
                  bgColor: "bg-blue-50" 
                };
                if (percentage >= 50) return { 
                  title: "👍 C'est un bon début !", 
                  message: "Continue à t'entraîner avec les doubles et moitiés !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue à t'entraîner !", 
                  message: "Recommence pour mieux mémoriser les doubles et moitiés.", 
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
                  <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                    <div className={`text-xl font-bold mb-2 ${result.color}`}>
                      Score final : {finalScore}/{allExercises.length} ({percentage}%)
                    </div>
                    <div className={`text-lg font-bold ${result.color} flex items-center justify-center`}>
                      <Target className="w-5 h-5 mr-2" />
                      +{xpEarned} XP gagnés !
                    </div>
                  </div>
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
                      className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
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
          <Link href="/chapitre/ce2-operations-complexes/addition-ce2/calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour au calcul mental CE2</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🔄 Doubles et moitiés
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Maîtrise les doubles et les moitiés !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                setShowExercises(false);
                // Réinitialiser l'animation quand on revient au cours
                setSelectedDouble(null);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                setShowExercises(true);
                // Réinitialiser l'animation quand on passe aux exercices
                setSelectedDouble(null);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-emerald-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{allExercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Qu'est-ce qu'un double ? */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔄 Qu'est-ce qu'un double ?
              </h2>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-blue-900 text-center mb-4">
                  Un double, c'est <strong>ajouter un nombre à lui-même</strong> !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    Double de 3 = 3 + 3 = 6
                  </div>
                  <p className="text-blue-700">
                    C'est comme avoir deux groupes identiques !
                  </p>
                </div>
              </div>
            </div>

            {/* Animation interactive des doubles */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🎯 Clique sur un nombre pour voir son double !
              </h3>
              
              <div className="grid grid-cols-5 gap-4 mb-8">
                {[6, 8, 4, 2, 5].map((number) => (
                  <button
                    key={number}
                    onClick={() => showDoubleAnimation(number)}
                    disabled={isAnimating}
                    className={`
                      p-4 rounded-lg font-bold text-2xl transition-all transform hover:scale-105
                      ${selectedDouble === number && isAnimating 
                        ? 'bg-green-500 text-white pulse' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                      }
                      ${isAnimating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    {number}
                  </button>
                ))}
              </div>

              {/* Zone d'animation */}
              {selectedDouble && (
                <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800">
                      Double de {selectedDouble}
                    </h4>
                  </div>
                  
                  <div className="flex justify-center items-center space-x-8">
                    {/* Premier groupe */}
                    <div>
                      <p className="text-center font-bold text-gray-700 mb-2">Groupe 1</p>
                      <div className="flex flex-wrap max-w-[120px] justify-center">
                        {animationStep >= 1 && renderVisualElements(selectedDouble, 'bg-blue-500')}
                      </div>
                    </div>

                    {/* Signe plus */}
                    {animationStep >= 2 && (
                      <div className="text-4xl font-bold text-green-600 bounce">+</div>
                    )}

                    {/* Deuxième groupe */}
                    <div>
                      <p className="text-center font-bold text-gray-700 mb-2">Groupe 2</p>
                      <div className="flex flex-wrap max-w-[120px] justify-center">
                        {animationStep >= 2 && renderVisualElements(selectedDouble, 'bg-red-500')}
                      </div>
                    </div>

                    {/* Égal et résultat */}
                    {animationStep >= 3 && (
                      <>
                        <div className="text-4xl font-bold text-green-600 bounce">=</div>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600 pulse">
                            {selectedDouble * 2}
                          </div>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                      </>
                    )}
                  </div>

                  {animationStep >= 3 && (
                    <div className="text-center mt-4">
                      <div className="bg-green-100 rounded-lg p-3 inline-block">
                        <span className="text-green-800 font-bold">
                          Double de {selectedDouble} = {selectedDouble * 2}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Qu'est-ce qu'une moitié ? */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ✂️ Qu'est-ce qu'une moitié ?
              </h2>
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-purple-900 text-center mb-4">
                  Une moitié, c'est <strong>diviser en deux parts égales</strong> !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    Moitié de 6 = 6 ÷ 2 = 3
                  </div>
                  <p className="text-purple-700">
                    C'est partager équitablement en deux !
                  </p>
                </div>
              </div>
            </div>

            {/* Tableau des doubles et moitiés */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                📊 Tableau magique des doubles et moitiés
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tableau des doubles */}
                <div>
                  <h4 className="text-lg font-bold text-blue-600 mb-4 text-center">
                    🔄 Les doubles
                  </h4>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="bg-blue-50 rounded-lg p-3 flex justify-between items-center">
                        <span className="font-bold text-blue-800">Double de {num}</span>
                        <span className="text-blue-600 font-bold">{num} + {num} = {num * 2}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tableau des moitiés */}
                <div>
                  <h4 className="text-lg font-bold text-purple-600 mb-4 text-center">
                    ✂️ Les moitiés
                  </h4>
                  <div className="space-y-2">
                    {[2, 4, 6, 8, 10].map((num) => (
                      <div key={num} className="bg-purple-50 rounded-lg p-3 flex justify-between items-center">
                        <span className="font-bold text-purple-800">Moitié de {num}</span>
                        <span className="text-purple-600 font-bold">{num} ÷ 2 = {num / 2}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Astuces */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour retenir</h3>
              <ul className="space-y-2">
                <li>• 🔄 Double = ajouter le même nombre</li>
                <li>• ✂️ Moitié = couper en deux parts égales</li>
                <li>• 🧠 Visualise les objets dans ta tête</li>
                <li>• 📖 Répète les tables plusieurs fois</li>
                <li>• 🎯 Utilise tes doigts au début !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {allExercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / allExercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  Score : {score}/{allExercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-4xl sm:text-5xl font-bold mb-8 text-center text-gray-900">
                {allExercises[currentExercise].question} ?
              </h3>
              
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
                  className="w-40 h-16 text-center text-3xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              
              {!isCorrect && isCorrect !== null && (
                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={nextExercise}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {isCorrect ? (
                      <>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                        <span className="text-xl font-bold">Excellent ! Tu as trouvé la bonne réponse ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✗</div>
                        <span className="text-xl font-bold">
                          Pas tout à fait... La bonne réponse est {allExercises[currentExercise].answer}.
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Aide visuelle uniquement si mauvaise réponse */}
                  {!isCorrect && (
                    <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
                      <p className="text-center text-gray-700 mb-3 font-medium">Aide visuelle :</p>
                      <div className="flex justify-center">
                        <div className="flex flex-wrap max-w-[200px] justify-center">
                          {renderVisualElements(allExercises[currentExercise].visual, 'bg-yellow-500')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation */}
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
                  className="bg-gray-300 text-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 w-full md:w-auto"
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
                  disabled={!userAnswer.trim() && isCorrect === null}
                  className="bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50 w-full md:w-auto"
                >
                  {userAnswer.trim() && isCorrect === null ? '✅ Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  );
} 