'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Clock, Eye, Play, Trophy } from 'lucide-react';

export default function DureesPage() {
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
      question: 'Il est 3 heures. Quelle heure sera-t-il dans 2 heures ?',
      options: ['4 heures', '5 heures', '6 heures', '1 heure'],
      correctAnswer: '5 heures',
      explanation: '3 heures + 2 heures = 5 heures.',
      visual: 'clock'
    },
    {
      id: 2,
      type: 'qcm',
      question: 'Combien y a-t-il de jours dans une semaine ?',
      options: ['5 jours', '6 jours', '7 jours', '8 jours'],
      correctAnswer: '7 jours',
      explanation: 'Une semaine compte 7 jours.',
      visual: 'week'
    },
    {
      id: 3,
      type: 'qcm',
      question: 'Dans 1 heure, il y a :',
      options: ['30 minutes', '60 minutes', '90 minutes', '120 minutes'],
      correctAnswer: '60 minutes',
      explanation: '1 heure = 60 minutes.',
      visual: 'conversion'
    },
    {
      id: 4,
      type: 'qcm',
      question: 'Quel mois vient après juin ?',
      options: ['mai', 'juillet', 'août', 'septembre'],
      correctAnswer: 'juillet',
      explanation: 'Juillet vient après juin.',
      visual: 'calendar'
    },
    {
      id: 5,
      type: 'qcm',
      question: 'De 9h à 11h, combien de temps s\'est écoulé ?',
      options: ['1 heure', '2 heures', '3 heures', '4 heures'],
      correctAnswer: '2 heures',
      explanation: '11h - 9h = 2 heures.',
      visual: 'calculation'
    },
    {
      id: 6,
      type: 'qcm',
      question: 'Combien y a-t-il de mois dans une année ?',
      options: ['10 mois', '11 mois', '12 mois', '13 mois'],
      correctAnswer: '12 mois',
      explanation: 'Une année compte 12 mois.',
      visual: 'year'
    }
  ];

  const saveProgress = (finalScore: number) => {
    const sectionId = 'durees';
    const baseXP = 20;
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
      case 'clock':
        return (
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 border-4 border-gray-400 rounded-full relative">
              <div className="absolute top-2 left-1/2 w-0.5 h-6 bg-gray-600 transform -translate-x-1/2 origin-bottom rotate-12"></div>
              <div className="absolute top-4 left-1/2 w-0.5 h-4 bg-gray-800 transform -translate-x-1/2 origin-bottom rotate-90"></div>
            </div>
          </div>
        );
      case 'week':
        return (
          <div className="flex justify-center mb-4">
            <div className="grid grid-cols-7 gap-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <div key={i} className="w-6 h-6 bg-orange-300 rounded text-xs flex items-center justify-center font-bold">
                  {day}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center mb-4">
            <Clock className="w-16 h-16 text-orange-500" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🕐 Expert du temps !", 
                  message: "Tu maîtrises parfaitement les durées !", 
                  color: "text-orange-600",
                  bgColor: "bg-orange-50" 
                };
                if (percentage >= 70) return { 
                  title: "⏰ Très bon travail !", 
                  message: "Tu comprends bien le temps !", 
                  color: "text-orange-600",
                  bgColor: "bg-orange-50" 
                };
                if (percentage >= 50) return { 
                  title: "🕐 En bonne voie !", 
                  message: "Continue à t'entraîner avec le temps !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Le temps demande plus d'entraînement.", 
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
          <Link href="/chapitre/ce1-grandeurs-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour aux grandeurs et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🕐 Durées
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends à lire l'heure et calculer des durées !
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
            {/* Introduction */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🕐 Qu'est-ce qu'une durée ?
              </h2>
              <div className="bg-orange-50 rounded-lg p-6">
                <p className="text-lg text-orange-900 text-center mb-4">
                  La durée, c'est le temps qui passe !
                </p>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">
                    On peut mesurer le temps avec une horloge, un calendrier...
                  </div>
                </div>
              </div>
            </div>

            {/* Les unités de temps */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                ⏰ Les unités de temps
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3 text-center">⏰ L'heure et les minutes</h4>
                  <ul className="space-y-2 text-blue-600 text-sm">
                    <li>• 1 heure = 60 minutes</li>
                    <li>• Les aiguilles de l'horloge</li>
                    <li>• Les horaires de la journée</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-3 text-center">📅 Le calendrier</h4>
                  <ul className="space-y-2 text-green-600 text-sm">
                    <li>• 1 semaine = 7 jours</li>
                    <li>• 1 mois ≈ 30 jours</li>
                    <li>• 1 année = 12 mois</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comment lire l'heure */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔧 Comment lire l'heure ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3">🕐 Les aiguilles</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Petite aiguille = heures</li>
                    <li>• Grande aiguille = minutes</li>
                    <li>• 12h = midi, 0h = minuit</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3">⏰ Les horaires</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Matin : 6h à 12h</li>
                    <li>• Après-midi : 12h à 18h</li>
                    <li>• Soir : 18h à 22h</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vocabulaire temporel */}
            <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💬 Vocabulaire du temps</h3>
              <ul className="space-y-2">
                <li>• ⏰ Avant ↔ Après</li>
                <li>• 📊 Hier ↔ Aujourd'hui ↔ Demain</li>
                <li>• 🎯 Maintenant ↔ Plus tard</li>
                <li>• 🏆 Tôt ↔ Tard</li>
                <li>• 📅 Entraîne-toi à lire l'heure !</li>
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
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
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
                        ? 'border-orange-500 bg-orange-100 text-orange-800'
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
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors text-lg touch-manipulation min-h-[44px]"
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
                  className="bg-orange-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
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