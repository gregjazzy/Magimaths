'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Droplets, Eye, Play, Trophy } from 'lucide-react';

export default function ContenancesPage() {
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
      question: 'Quelle bouteille contient le plus de liquide ?',
      options: ['Bouteille de 25 cl', 'Bouteille de 50 cl', 'Bouteille de 1 L', 'Bouteille de 75 cl'],
      correctAnswer: 'Bouteille de 1 L',
      explanation: '1 litre = 100 cl, c\'est donc la plus grande contenance.',
      visual: 'bottle'
    },
    {
      id: 2,
      type: 'qcm',
      question: 'Dans quoi peut-on mettre le plus d\'eau ?',
      options: ['Un verre', 'Une cuillère', 'Un seau', 'Une tasse'],
      correctAnswer: 'Un seau',
      explanation: 'Un seau a une beaucoup plus grande contenance que les autres récipients.',
      visual: 'containers'
    },
    {
      id: 3,
      type: 'qcm',
      question: 'Combien y a-t-il de centilitres dans 1 litre ?',
      options: ['10 cl', '50 cl', '100 cl', '200 cl'],
      correctAnswer: '100 cl',
      explanation: '1 litre = 100 centilitres.',
      visual: 'conversion'
    },
    {
      id: 4,
      type: 'qcm',
      question: 'Pour mesurer le volume d\'un verre d\'eau, j\'utilise :',
      options: ['une règle', 'une balance', 'un verre gradué', 'mes mains'],
      correctAnswer: 'un verre gradué',
      explanation: 'Un verre gradué permet de mesurer les volumes.',
      visual: 'measuring'
    },
    {
      id: 5,
      type: 'qcm',
      question: 'Quelle est la contenance la plus petite ?',
      options: ['1 L', '50 cl', '25 cl', '75 cl'],
      correctAnswer: '25 cl',
      explanation: '25 cl est la plus petite quantité.',
      visual: 'comparison'
    },
    {
      id: 6,
      type: 'qcm',
      question: 'Un verre de 25 cl et un verre de 25 cl contiennent ensemble :',
      options: ['25 cl', '40 cl', '50 cl', '75 cl'],
      correctAnswer: '50 cl',
      explanation: '25 cl + 25 cl = 50 cl.',
      visual: 'addition'
    }
  ];

  const saveProgress = (finalScore: number) => {
    const sectionId = 'contenances';
    const baseXP = 12;
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
      case 'bottle':
        return (
          <div className="flex justify-center items-center mb-4">
            <div className="w-8 h-20 bg-blue-400 rounded-t-lg border-2 border-blue-600">
              <div className="w-3 h-3 bg-blue-600 mx-auto rounded-t"></div>
            </div>
          </div>
        );
      case 'containers':
        return (
          <div className="flex justify-center items-end gap-2 mb-4">
            <div className="w-6 h-8 bg-gray-300 rounded"></div>
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="w-10 h-12 bg-gray-300 rounded"></div>
            <div className="w-5 h-6 bg-gray-300 rounded"></div>
          </div>
        );
      case 'measuring':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-6 h-16 bg-transparent border-2 border-gray-400 rounded-b relative">
              {Array.from({length: 4}, (_, i) => (
                <div key={i} className="absolute w-full border-t border-gray-300" style={{top: `${(i + 1) * 20}%`}}></div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center mb-4">
            <Droplets className="w-16 h-16 text-purple-500" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🥤 Expert des contenances !", 
                  message: "Tu maîtrises parfaitement les mesures de volume !", 
                  color: "text-purple-600",
                  bgColor: "bg-purple-50" 
                };
                if (percentage >= 70) return { 
                  title: "💧 Très bon travail !", 
                  message: "Tu comprends bien les contenances !", 
                  color: "text-purple-600",
                  bgColor: "bg-purple-50" 
                };
                if (percentage >= 50) return { 
                  title: "🥤 En bonne voie !", 
                  message: "Continue à t'entraîner avec les contenances !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Les contenances demandent plus d'entraînement.", 
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
                      className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors"
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
              🥤 Contenances
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends à estimer et comparer les volumes !
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
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => setShowExercises(true)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  showExercises 
                    ? 'bg-violet-500 text-white shadow-md' 
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
                🥤 Qu'est-ce qu'une contenance ?
              </h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-lg text-purple-900 text-center mb-4">
                  La contenance, c'est la quantité de liquide qu'on peut mettre dans un récipient !
                </p>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    Plus le récipient est grand, plus il peut contenir de liquide !
                  </div>
                </div>
              </div>
            </div>

            {/* Les unités de contenance */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🥤 Les unités de contenance
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3 text-center">🥃 Le centilitre (cl)</h4>
                  <div className="text-center mb-3">
                    <div className="w-4 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
                    <p className="text-blue-700 text-sm">1 centilitre</p>
                  </div>
                  <ul className="space-y-2 text-blue-600 text-sm">
                    <li>• Une cuillère à soupe</li>
                    <li>• Un petit verre</li>
                    <li>• Petites quantités</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-3 text-center">🥤 Le litre (L)</h4>
                  <div className="text-center mb-3">
                    <div className="w-8 h-16 bg-green-500 rounded mx-auto mb-2"></div>
                    <p className="text-green-700 text-sm">1 L = 100 cl</p>
                  </div>
                  <ul className="space-y-2 text-green-600 text-sm">
                    <li>• Une bouteille d'eau</li>
                    <li>• Un carton de lait</li>
                    <li>• Grandes quantités</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comment mesurer */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔧 Comment bien mesurer les volumes ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3">🥤 Avec un verre gradué</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Verse le liquide</li>
                    <li>• Lis au niveau du liquide</li>
                    <li>• Vérifie l'unité (cl ou L)</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3">👁️ En estimant</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Compare avec des récipients connus</li>
                    <li>• Regarde la taille du récipient</li>
                    <li>• Estime puis vérifie</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-3">🔄 En comparant</h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Contient plus / contient moins</li>
                    <li>• Même contenance</li>
                    <li>• Range du plus petit au plus grand</li>
                  </ul>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-bold text-pink-800 mb-3">🎯 Repères utiles</h4>
                  <ul className="space-y-2 text-pink-700">
                    <li>• 1 cuillère ≈ 1 cl</li>
                    <li>• 1 verre ≈ 25 cl</li>
                    <li>• 1 bouteille ≈ 1 L</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vocabulaire */}
            <div className="bg-gradient-to-r from-purple-400 to-violet-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💬 Vocabulaire important</h3>
              <ul className="space-y-2">
                <li>• 🥤 Contient plus ↔ Contient moins</li>
                <li>• 📊 1 litre = 100 centilitres</li>
                <li>• 🎯 Pour convertir : compte par 100</li>
                <li>• 🏆 Le verre gradué sert à mesurer</li>
                <li>• 💧 Entraîne-toi à estimer les volumes !</li>
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
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
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
                        ? 'border-purple-500 bg-purple-100 text-purple-800'
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
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors text-lg touch-manipulation min-h-[44px]"
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
                  className="bg-purple-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
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