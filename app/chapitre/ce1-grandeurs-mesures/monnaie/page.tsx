'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Euro, Eye, Play, Trophy } from 'lucide-react';

export default function MonnaiesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const exercises = [
    {
      id: 1,
      type: 'qcm',
      question: 'Combien vaut une pièce de 1 euro ?',
      options: ['50 centimes', '100 centimes', '150 centimes', '200 centimes'],
      correctAnswer: '100 centimes',
      explanation: '1 euro = 100 centimes.',
      visual: 'coin'
    },
    {
      id: 2,
      type: 'qcm',
      question: 'Quel billet a la plus grande valeur ?',
      options: ['5 euros', '10 euros', '20 euros', '50 euros'],
      correctAnswer: '50 euros',
      explanation: '50 euros est la plus grande valeur proposée.',
      visual: 'bill'
    },
    {
      id: 3,
      type: 'qcm',
      question: 'J\'achète un stylo à 2 euros. Je paie avec 5 euros. On me rend :',
      options: ['2 euros', '3 euros', '4 euros', '5 euros'],
      correctAnswer: '3 euros',
      explanation: '5 euros - 2 euros = 3 euros de monnaie.',
      visual: 'change'
    },
    {
      id: 4,
      type: 'qcm',
      question: 'Combien coûtent 2 bonbons à 50 centimes chacun ?',
      options: ['50 centimes', '1 euro', '1 euro 50', '2 euros'],
      correctAnswer: '1 euro',
      explanation: '2 × 50 centimes = 100 centimes = 1 euro.',
      visual: 'calculation'
    },
    {
      id: 5,
      type: 'qcm',
      question: 'Pour payer 3 euros, je peux utiliser :',
      options: ['1 pièce de 2€ + 1 pièce de 1€', '3 pièces de 50 centimes', '6 pièces de 1€', '1 pièce de 5€'],
      correctAnswer: '1 pièce de 2€ + 1 pièce de 1€',
      explanation: '2 euros + 1 euro = 3 euros.',
      visual: 'payment'
    },
    {
      id: 6,
      type: 'qcm',
      question: 'Dans mon porte-monnaie, j\'ai 2 pièces de 1 euro et 3 pièces de 50 centimes. J\'ai en tout :',
      options: ['2 euros 50', '3 euros 50', '4 euros', '5 euros'],
      correctAnswer: '3 euros 50',
      explanation: '2×1€ + 3×50 centimes = 2€ + 1€50 = 3€50.',
      visual: 'counting'
    }
  ];

  const saveProgress = (finalScore: number) => {
    const sectionId = 'monnaie';
    const baseXP = 16;
    const percentage = (finalScore / exercises.length) * 100;
    let earnedXP = Math.round((percentage / 100) * baseXP);
    if (percentage === 100) earnedXP = baseXP + 2;

    const existingProgress = JSON.parse(localStorage.getItem('ce1-grandeurs-mesures-progress') || '[]');
    const existingIndex = existingProgress.findIndex((p: any) => p.sectionId === sectionId);
    
    const newProgress = {
      sectionId,
      completed: percentage >= 50,
      score: finalScore,
      maxScore: exercises.length,
      completedAt: new Date().toISOString(),
      attempts: existingIndex >= 0 ? existingProgress[existingIndex].attempts + 1 : 1,
      xpEarned: earnedXP
    };

    if (existingIndex >= 0) {
      existingProgress[existingIndex] = newProgress;
    } else {
      existingProgress.push(newProgress);
    }

    localStorage.setItem('ce1-grandeurs-mesures-progress', JSON.stringify(existingProgress));
  };

  const checkAnswer = () => {
    const correct = selectedAnswer === exercises[currentExercise]?.correctAnswer;
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

    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setSelectedAnswer('');
          setIsCorrect(null);
        } else {
          setFinalScore(newScore);
          saveProgress(newScore);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      saveProgress(score);
      setShowCompletionModal(true);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setSelectedAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  const renderVisual = (visual: string) => {
    switch (visual) {
      case 'coin':
        return (
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">1€</span>
            </div>
          </div>
        );
      case 'bill':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-20 h-12 bg-green-400 border border-green-600 rounded flex items-center justify-center">
              <span className="text-xs font-bold">20€</span>
            </div>
          </div>
        );
      case 'change':
        return (
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-12 h-8 bg-green-300 border border-green-500 rounded text-xs flex items-center justify-center">5€</div>
            <span>-</span>
            <div className="w-12 h-8 bg-blue-300 border border-blue-500 rounded text-xs flex items-center justify-center">2€</div>
            <span>=</span>
            <div className="w-12 h-8 bg-yellow-300 border border-yellow-500 rounded text-xs flex items-center justify-center">3€</div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center mb-4">
            <Euro className="w-16 h-16 text-yellow-500" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "💰 Expert de la monnaie !", 
                  message: "Tu maîtrises parfaitement l'euro !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                if (percentage >= 70) return { 
                  title: "💵 Très bon travail !", 
                  message: "Tu comprends bien la monnaie !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                if (percentage >= 50) return { 
                  title: "💰 En bonne voie !", 
                  message: "Continue à t'entraîner avec la monnaie !", 
                  color: "text-orange-600",
                  bgColor: "bg-orange-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "La monnaie demande plus d'entraînement.", 
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
                      className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-colors"
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
          <Link href="/chapitre/ce1-grandeurs-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour aux grandeurs et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              💰 Monnaie
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends à utiliser l'euro et rendre la monnaie !
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
                    ? 'bg-yellow-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => setShowExercises(true)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
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
            {/* Introduction */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💰 Qu'est-ce que la monnaie ?
              </h2>
              <div className="bg-yellow-50 rounded-lg p-6">
                <p className="text-lg text-yellow-900 text-center mb-4">
                  La monnaie, c'est ce qu'on utilise pour acheter et vendre !
                </p>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">
                    En France et en Europe, on utilise l'euro (€) !
                  </div>
                </div>
              </div>
            </div>

            {/* Les pièces et billets */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                💴 Les pièces et billets en euros
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3 text-center">🪙 Les pièces</h4>
                  <ul className="space-y-2 text-yellow-600 text-sm">
                    <li>• 1 centime, 2 centimes, 5 centimes</li>
                    <li>• 10 centimes, 20 centimes, 50 centimes</li>
                    <li>• 1 euro, 2 euros</li>
                    <li>• 100 centimes = 1 euro</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-3 text-center">💵 Les billets</h4>
                  <ul className="space-y-2 text-green-600 text-sm">
                    <li>• 5 euros (gris)</li>
                    <li>• 10 euros (rouge)</li>
                    <li>• 20 euros (bleu)</li>
                    <li>• 50 euros (orange)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comment calculer */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔧 Comment bien calculer avec l'argent ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3">💰 Additionner</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li>• 1€ + 50 centimes = 1€50</li>
                    <li>• 2€ + 2€ = 4€</li>
                    <li>• Compte toutes tes pièces</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3">💳 Rendre la monnaie</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Prix : 3€, Je paie : 5€</li>
                    <li>• Monnaie : 5€ - 3€ = 2€</li>
                    <li>• Toujours vérifier le calcul</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-3">🛒 Faire ses achats</h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Regarde le prix</li>
                    <li>• Compte ton argent</li>
                    <li>• Vérifie que tu as assez</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-3">📊 Économiser</h4>
                  <ul className="space-y-2 text-purple-700">
                    <li>• Garde tes pièces dans une tirelire</li>
                    <li>• Compare les prix</li>
                    <li>• Achète seulement ce dont tu as besoin</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vocabulaire */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💬 Vocabulaire de l'argent</h3>
              <ul className="space-y-2">
                <li>• 💰 Euro (€) = monnaie européenne</li>
                <li>• 📊 1 euro = 100 centimes</li>
                <li>• 🎯 Prix = ce que ça coûte</li>
                <li>• 🏆 Monnaie = ce qu'on te rend</li>
                <li>• 🛒 Entraîne-toi à compter l'argent !</li>
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
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
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
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              {/* Visuel */}
              {renderVisual(exercises[currentExercise]?.visual)}
              
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                {exercises[currentExercise]?.question}
              </h3>
              
              {/* Options de réponse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {exercises[currentExercise]?.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(option)}
                    disabled={isCorrect !== null}
                    className={`p-4 rounded-lg border-2 font-medium transition-all touch-manipulation min-h-[60px] ${
                      selectedAnswer === option
                        ? 'border-yellow-500 bg-yellow-100 text-yellow-800'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    } ${isCorrect !== null ? 'opacity-60' : 'hover:scale-105 active:scale-95'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {/* Bouton Vérifier */}
              {isCorrect === null && selectedAnswer && (
                <div className="text-center mb-6">
                  <button
                    onClick={checkAnswer}
                    className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-700 transition-colors text-lg touch-manipulation min-h-[44px]"
                  >
                    ✅ Vérifier
                  </button>
                </div>
              )}
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Excellent ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">Pas encore ! La bonne réponse est : {exercises[currentExercise]?.correctAnswer}</span>
                      </>
                    )}
                  </div>
                  <p className="text-center">{exercises[currentExercise]?.explanation}</p>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                  ← Précédent
                </button>
                <button
                  onClick={() => {
                    if (selectedAnswer && isCorrect === null) {
                      checkAnswer();
                    } else {
                      nextExercise();
                    }
                  }}
                  disabled={!selectedAnswer && isCorrect === null}
                  className="bg-yellow-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-yellow-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                >
                  {selectedAnswer && isCorrect === null ? '✅ Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 