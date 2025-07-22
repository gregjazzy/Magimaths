'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Brain, Star, Trophy } from 'lucide-react';

// Styles pour les animations
const animationStyles = `
  @keyframes fillUp {
    from { width: 0%; }
    to { width: 100%; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
  
  .fill-up { animation: fillUp 1s ease-in-out; }
  .bounce { animation: bounce 0.6s ease-in-out; }
  .pulse { animation: pulse 1s ease-in-out infinite; }
  .sparkle { animation: sparkle 1.5s ease-in-out infinite; }
  
  @keyframes slideIn {
    from { transform: translateX(-50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .slide-in { animation: slideIn 0.5s ease-out; }
`;

export default function ComplementsA10Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
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

  // Exercices de base de compléments à 10 (10 exercices - progression graduée)
  const baseComplementExercises = [
    { question: '2 + ? = 10', number: 2, answer: '8' },
    { question: '3 + ? = 10', number: 3, answer: '7' },
    { question: '1 + ? = 10', number: 1, answer: '9' },
    { question: '4 + ? = 10', number: 4, answer: '6' },
    { question: '5 + ? = 10', number: 5, answer: '5' },
    { question: '6 + ? = 10', number: 6, answer: '4' },
    { question: '7 + ? = 10', number: 7, answer: '3' },
    { question: '8 + ? = 10', number: 8, answer: '2' },
    { question: '9 + ? = 10', number: 9, answer: '1' },
    { question: '0 + ? = 10', number: 0, answer: '10' }
  ];

  // Exercices mélangés - initialisés une seule fois
  const [complementExercises, setComplementExercises] = useState(() => shuffleArray(baseComplementExercises));

  const checkAnswer = () => {
    const userAnswerStr = userAnswer.trim();
    const expectedAnswer = complementExercises[currentExercise].answer;
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
        if (currentExercise + 1 < complementExercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernière question, calculer le score final et sauvegarder
          setFinalScore(newScore);
          setShowCompletionModal(true);
          
          // Sauvegarder les progrès
          const maxScore = complementExercises.length;
          saveProgress(newScore, maxScore);
        }
      }, 1500);
    }
    // Si mauvaise réponse → afficher solution + bouton "Suivant"
    // (pas de passage automatique, l'utilisateur doit cliquer sur "Suivant")
  };

  const nextExercise = () => {
    if (currentExercise < complementExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      
      // Sauvegarder les progrès
      const maxScore = complementExercises.length;
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
      sectionId: 'complements-10',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'complements-10');
      
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
    setSelectedNumber(null);
    setAnimationStep(0);
    setIsAnimating(false);
    // Remélanger les exercices pour un nouvel ordre
    setComplementExercises(shuffleArray(baseComplementExercises));
  };

  // Animation pour montrer les compléments
  const showComplementAnimation = (number: number) => {
    // Si on clique sur le même nombre, ne rien faire
    if (selectedNumber === number && animationStep === 3) {
      return;
    }
    
    // Réinitialiser si on change de nombre
    setSelectedNumber(number);
    setIsAnimating(true);
    setAnimationStep(0);
    
    setTimeout(() => setAnimationStep(1), 500);
    setTimeout(() => setAnimationStep(2), 1000);
    setTimeout(() => {
      setAnimationStep(3);
      setIsAnimating(false); // Animation terminée, mais résultat reste affiché
    }, 1500);
  };

  // Render des boules pour visualiser
  const renderDots = (count: number, color: string = 'bg-blue-500', animated: boolean = false) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-bold m-1 ${
          animated ? 'slide-in' : ''
        }`}
        style={animated ? { animationDelay: `${i * 0.1}s` } : {}}
      >
        ●
      </div>
    ));
  };

  // Render la barre de 10 avec le complément
  const renderBar10 = (filled: number, complement: number) => {
    return (
      <div className="flex space-x-1 justify-center">
        {/* Cases remplies */}
        {Array.from({ length: filled }, (_, i) => (
          <div key={`filled-${i}`} className="w-8 h-8 bg-blue-500 rounded border-2 border-blue-600 flex items-center justify-center text-white font-bold">
            {i + 1}
          </div>
        ))}
        
        {/* Cases du complément */}
        {Array.from({ length: complement }, (_, i) => (
          <div key={`complement-${i}`} className={`w-8 h-8 bg-red-400 rounded border-2 border-red-500 flex items-center justify-center text-white font-bold ${
            animationStep >= 2 ? 'slide-in' : 'opacity-0'
          }`} style={{ animationDelay: `${i * 0.1}s` }}>
            {filled + i + 1}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <style jsx>{animationStyles}</style>
      
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / complementExercises.length) * 100);
              const baseXP = 15; // XP de base pour cette section
              const xpEarned = Math.round(baseXP * (percentage / 100));
              
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🎯 Maître des compléments !", 
                  message: "Tu connais parfaitement tous les compléments à 10 !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "👏 Très bien joué !", 
                  message: "Tu maîtrises bien les compléments à 10 !", 
                  color: "text-blue-600",
                  bgColor: "bg-blue-50" 
                };
                if (percentage >= 50) return { 
                  title: "👍 C'est un bon début !", 
                  message: "Continue à t'entraîner avec les compléments !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Recommence pour progresser !", 
                  message: "Les compléments à 10 demandent de l'entraînement.", 
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
                      Score final : {finalScore}/{complementExercises.length} ({percentage}%)
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
                      className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
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
              🔟 Compléments à 10
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends les compléments pour faire 10 !
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
                setSelectedNumber(null);
                setAnimationStep(0);
                setIsAnimating(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                setShowExercises(true);
                // Réinitialiser l'animation quand on passe aux exercices
                setSelectedNumber(null);
                setAnimationStep(0);
                setIsAnimating(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{complementExercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Qu'est-ce qu'un complément ? */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧩 Qu'est-ce qu'un complément à 10 ?
              </h2>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-blue-900 text-center mb-4">
                  Un complément à 10, c'est <strong>ce qu'il faut ajouter</strong> pour arriver à 10 !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    7 + ? = 10
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    7 + 3 = 10
                  </div>
                  <p className="text-blue-700 mt-2">
                    Le complément de 7 à 10 est 3 !
                  </p>
                </div>
              </div>
            </div>



            {/* Animation interactive */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🎯 Clique sur un nombre pour voir son complément à 10 !
              </h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[1, 2, 3, 4, 5].map((number) => (
                  <button
                    key={number}
                    onClick={() => showComplementAnimation(number)}
                    disabled={isAnimating}
                    className={`
                      p-3 sm:p-4 rounded-lg font-bold text-xl sm:text-2xl transition-all transform hover:scale-105 touch-manipulation min-h-[44px]
                      ${selectedNumber === number && isAnimating 
                        ? 'bg-blue-500 text-white pulse' 
                        : 'bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700'
                      }
                      ${isAnimating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    {number}
                  </button>
                ))}
              </div>

              {/* Zone d'animation */}
              {selectedNumber !== null && (
                <div className="bg-gray-50 rounded-lg p-6 min-h-[250px]">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-gray-800">
                      Complément de {selectedNumber} à 10
                    </h4>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Affichage de la barre */}
                    <div>
                      <p className="text-center text-gray-600 mb-2">J'ai {selectedNumber} :</p>
                      {animationStep >= 1 && renderBar10(selectedNumber, 10 - selectedNumber)}
                    </div>

                    {/* Équation */}
                    {animationStep >= 2 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800 mb-2">
                          {selectedNumber} + {10 - selectedNumber} = 10
                        </div>
                      </div>
                    )}

                    {/* Résultat final */}
                    {animationStep >= 3 && (
                      <div className="text-center">
                        <div className="bg-green-100 rounded-lg p-4 inline-block">
                          <div className="text-green-800 font-bold text-lg">
                            🎉 Le complément de {selectedNumber} à 10 est {10 - selectedNumber} !
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tableau des compléments */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                📋 Tableau des compléments à 10
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  [0, 1, 2, 3, 4],
                  [5, 6, 7, 8, 9]
                ].map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    {group.map((num) => (
                      <div key={num} className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
                        <span className="font-bold text-blue-800 text-lg">
                          {num} + ? = 10
                        </span>
                        <span className="text-blue-600 font-bold text-xl">
                          {10 - num}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Jeu de mémorisation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🎮 Jeu de mémorisation
              </h3>
              
              <div className="bg-yellow-50 rounded-lg p-6">
                <h4 className="font-bold text-yellow-800 mb-4 text-center">
                  🧠 Récite avec moi !
                </h4>
                <div className="space-y-2 text-center">
                  <p className="text-lg text-gray-800"><strong>0 + 10 = 10</strong></p>
                  <p className="text-lg text-gray-800"><strong>1 + 9 = 10</strong></p>
                  <p className="text-lg text-gray-800"><strong>2 + 8 = 10</strong></p>
                  <p className="text-lg text-gray-800"><strong>3 + 7 = 10</strong></p>
                  <p className="text-lg text-gray-800"><strong>4 + 6 = 10</strong></p>
                  <p className="text-lg text-green-600"><strong>5 + 5 = 10 ⭐</strong></p>
                </div>
                <p className="text-center text-yellow-700 mt-4 text-sm">
                  Répète ces phrases plusieurs fois pour les retenir !
                </p>
              </div>
            </div>

            {/* Astuces */}
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour retenir</h3>
              <ul className="space-y-2">
                <li>• 🎯 Pense à remplir un seau de 10 litres</li>
                <li>• 🖐️ Utilise tes 10 doigts</li>
                <li>• 🧠 Visualise la barre de 10 cases</li>
                <li>• 🎵 Récite comme une chanson</li>
                <li>• 🏆 Entraîne-toi tous les jours !</li>
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
                  ✏️ Exercice {currentExercise + 1} sur {complementExercises.length}
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
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / complementExercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  Score : {score}/{complementExercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900">
                {complementExercises[currentExercise].question}
              </h3>
              
              {/* Aide visuelle - barre de 10 */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-6 mb-4 sm:mb-6">
                <p className="text-center text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Aide visuelle :</p>
                <div className="flex justify-center overflow-x-auto">
                  <div className="min-w-max">
                    {renderBar10(complementExercises[currentExercise].number, 0)}
                  </div>
                </div>
                <p className="text-center text-gray-500 text-xs sm:text-sm mt-2">
                  Cases bleues : {complementExercises[currentExercise].number} • Cases à compléter : ?
                </p>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
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
                  className="w-28 sm:w-32 h-12 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-4 touch-manipulation"
                />
                

              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Bravo ! Tu as trouvé le bon complément ! 🎯</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Essaie encore ! Le complément de {complementExercises[currentExercise].number} à 10 est {complementExercises[currentExercise].answer}.
                        </span>
                      </>
                    )}
                  </div>
                  {isCorrect && (
                    <div className="text-center mt-2">
                      <div className="bg-green-200 rounded-lg p-2 inline-block">
                        <span className="font-bold text-green-800">
                          {complementExercises[currentExercise].number} + {complementExercises[currentExercise].answer} = 10 ✅
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation */}
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
                    } else {
                      nextExercise();
                    }
                  }}
                  disabled={currentExercise === complementExercises.length - 1 || (!userAnswer.trim() && isCorrect === null)}
                  className="bg-cyan-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-cyan-600 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
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