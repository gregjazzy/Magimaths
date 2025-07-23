'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Scale, Eye, Play, Trophy } from 'lucide-react';

export default function MassesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const exercises = [
    {
      id: 1,
      type: 'qcm',
      question: 'Quelle est la masse d\'une pomme ?',
      options: ['10 g', '100 g', '1 kg', '10 kg'],
      correctAnswer: '100 g',
      explanation: 'Une pomme pèse environ 100 grammes.',
      visual: 'apple'
    },
    {
      id: 2,
      type: 'qcm',
      question: 'Quel objet est le plus lourd ?',
      options: ['Une plume', 'Un livre', 'Une voiture', 'Une feuille'],
      correctAnswer: 'Une voiture',
      explanation: 'Une voiture est beaucoup plus lourde que les autres objets.',
      visual: 'balance'
    },
    {
      id: 3,
      type: 'qcm',
      question: 'Combien y a-t-il de grammes dans 1 kilogramme ?',
      options: ['10 g', '100 g', '500 g', '1000 g'],
      correctAnswer: '1000 g',
      explanation: '1 kilogramme = 1000 grammes.',
      visual: 'conversion'
    },
    {
      id: 4,
      type: 'qcm',
      question: 'Pour peser de la farine, j\'utilise :',
      options: ['mes mains', 'une balance', 'une règle', 'mes yeux'],
      correctAnswer: 'une balance',
      explanation: 'Une balance permet de mesurer la masse précisément.',
      visual: 'flour'
    },
    {
      id: 5,
      type: 'qcm',
      question: 'Quelle est la masse la plus lourde ?',
      options: ['500 g', '1 kg', '800 g', '900 g'],
      correctAnswer: '1 kg',
      explanation: '1 kg = 1000 g, c\'est donc le plus lourd.',
      visual: 'comparison'
    },
    {
      id: 6,
      type: 'qcm',
      question: 'Un sac de 2 kg et un sac de 500 g pèsent ensemble :',
      options: ['2 kg 500 g', '1 kg 500 g', '3 kg', '2500 g'],
      correctAnswer: '2 kg 500 g',
      explanation: '2 kg + 500 g = 2 kg 500 g (ou 2500 g).',
      visual: 'addition'
    }
  ];

  const saveProgress = (finalScore: number) => {
    const sectionId = 'masses';
    const baseXP = 15;
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
      case 'apple':
        return (
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-red-400 rounded-full relative">
              <div className="w-2 h-4 bg-green-500 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
            </div>
          </div>
        );
      case 'balance':
        return (
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-2 bg-gray-600"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full absolute left-0 top-2"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full absolute right-0 top-2"></div>
            </div>
          </div>
        );
      case 'flour':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-16 bg-yellow-100 border-2 border-yellow-400 rounded">
              <div className="w-full h-8 bg-white mt-8 rounded-b"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center mb-4">
            <Scale className="w-16 h-16 text-green-500" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "⚖️ Expert des masses !", 
                  message: "Tu maîtrises parfaitement les mesures de masse !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "📊 Très bon travail !", 
                  message: "Tu comprends bien les masses !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 50) return { 
                  title: "⚖️ En bonne voie !", 
                  message: "Continue à t'entraîner avec les masses !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Les masses demandent plus d'entraînement.", 
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
          <Link href="/chapitre/ce1-grandeurs-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour aux grandeurs et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              ⚖️ Masses
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends à estimer, comparer et peser les masses !
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
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => setShowExercises(true)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  showExercises 
                    ? 'bg-emerald-500 text-white shadow-md' 
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
                ⚖️ Qu'est-ce qu'une masse ?
              </h2>
              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-lg text-green-900 text-center mb-4">
                  La masse, c'est le poids d'un objet !
                </p>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    Plus un objet est lourd, plus sa masse est grande !
                  </div>
                </div>
              </div>
            </div>

            {/* Les unités de masse */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                ⚖️ Les unités de masse
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3 text-center">📏 Le gramme (g)</h4>
                  <div className="text-center mb-3">
                    <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-2"></div>
                    <p className="text-blue-700 text-sm">1 gramme</p>
                  </div>
                  <ul className="space-y-2 text-blue-600 text-sm">
                    <li>• Une pièce de monnaie</li>
                    <li>• Un bonbon</li>
                    <li>• Une plume</li>
                    <li>• Objets très légers</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-3 text-center">📏 Le kilogramme (kg)</h4>
                  <div className="text-center mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded mx-auto mb-2"></div>
                    <p className="text-purple-700 text-sm">1 kg = 1000 g</p>
                  </div>
                  <ul className="space-y-2 text-purple-600 text-sm">
                    <li>• Un litre d'eau</li>
                    <li>• Un gros livre</li>
                    <li>• Un chat</li>
                    <li>• Objets lourds</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comment peser */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔧 Comment bien peser ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3">⚖️ Avec une balance</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Place l'objet sur le plateau</li>
                    <li>• Lis le nombre affiché</li>
                    <li>• Vérifie l'unité (g ou kg)</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3">👁️ En estimant</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Soulève l'objet</li>
                    <li>• Compare avec des objets connus</li>
                    <li>• Estime puis vérifie</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-3">🔄 En comparant</h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Plus lourd / plus léger</li>
                    <li>• Même masse</li>
                    <li>• Range du plus léger au plus lourd</li>
                  </ul>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-bold text-pink-800 mb-3">🎯 Repères utiles</h4>
                  <ul className="space-y-2 text-pink-700">
                    <li>• 1 pièce ≈ 5 g</li>
                    <li>• 1 pomme ≈ 100 g</li>
                    <li>• 1 litre d'eau = 1 kg</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vocabulaire */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💬 Vocabulaire important</h3>
              <ul className="space-y-2">
                <li>• ⚖️ Lourd ↔ Léger</li>
                <li>• 📊 1 kilogramme = 1000 grammes</li>
                <li>• 🎯 Pour convertir : compte par 1000</li>
                <li>• 🏆 La balance est l'outil pour peser</li>
                <li>• 🤲 Entraîne-toi à soulever et comparer !</li>
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
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
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
                        ? 'border-green-500 bg-green-100 text-green-800'
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
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors text-lg touch-manipulation min-h-[44px]"
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
                  className="bg-green-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
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