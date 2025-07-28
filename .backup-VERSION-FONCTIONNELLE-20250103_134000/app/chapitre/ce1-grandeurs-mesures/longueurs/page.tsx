'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Ruler, Eye, Play, Trophy } from 'lucide-react';

export default function LongueursPage() {
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
      question: 'Quelle est la longueur d\'un crayon ?',
      options: ['2 cm', '15 cm', '50 cm', '1 m'],
      correctAnswer: '15 cm',
      explanation: 'Un crayon mesure environ 15 centimètres.',
      visual: 'pencil'
    },
    {
      id: 2,
      type: 'qcm',
      question: 'Quelle unité utilise-t-on pour mesurer la hauteur d\'une porte ?',
      options: ['centimètre (cm)', 'décimètre (dm)', 'mètre (m)', 'kilomètre (km)'],
      correctAnswer: 'mètre (m)',
      explanation: 'Une porte mesure environ 2 mètres de hauteur.',
      visual: 'door'
    },
    {
      id: 3,
      type: 'qcm',
      question: 'Combien y a-t-il de centimètres dans 1 décimètre ?',
      options: ['5 cm', '10 cm', '15 cm', '20 cm'],
      correctAnswer: '10 cm',
      explanation: '1 décimètre = 10 centimètres.',
      visual: 'ruler'
    },
    {
      id: 4,
      type: 'qcm',
      question: 'Quelle est la longueur la plus grande ?',
      options: ['8 cm', '12 cm', '1 dm', '9 cm'],
      correctAnswer: '12 cm',
      explanation: '12 cm est plus grand que 1 dm (10 cm), 8 cm et 9 cm.',
      visual: 'comparison'
    },
    {
      id: 5,
      type: 'qcm',
      question: 'Combien mesure une ligne de 5 cm + 3 cm ?',
      options: ['7 cm', '8 cm', '9 cm', '10 cm'],
      correctAnswer: '8 cm',
      explanation: '5 cm + 3 cm = 8 cm.',
      visual: 'addition'
    },
    {
      id: 6,
      type: 'qcm',
      question: 'Pour mesurer une table, j\'utilise :',
      options: ['une règle de 20 cm', 'un mètre', 'mes doigts', 'un élastique'],
      correctAnswer: 'un mètre',
      explanation: 'Un mètre est l\'outil approprié pour mesurer une table.',
      visual: 'table'
    }
  ];

  const saveProgress = (finalScore: number) => {
    const sectionId = 'longueurs';
    const baseXP = 18;
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
      case 'pencil':
        return (
          <div className="flex justify-center items-center mb-4">
            <div className="w-32 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          </div>
        );
      case 'ruler':
        return (
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 p-2 rounded">
              <div className="flex">
                {Array.from({length: 11}, (_, i) => (
                  <div key={i} className="w-4 text-xs text-center border-r border-gray-400">
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'door':
        return (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-32 bg-brown-400 border-2 border-brown-600 rounded">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-16 ml-12"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center mb-4">
            <Ruler className="w-16 h-16 text-blue-500" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "📏 Expert des longueurs !", 
                  message: "Tu maîtrises parfaitement les mesures de longueur !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "📐 Très bon travail !", 
                  message: "Tu comprends bien les longueurs !", 
                  color: "text-blue-600",
                  bgColor: "bg-blue-50" 
                };
                if (percentage >= 50) return { 
                  title: "📏 En bonne voie !", 
                  message: "Continue à t'entraîner avec les longueurs !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue !", 
                  message: "Les longueurs demandent plus d'entraînement.", 
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
          <Link href="/chapitre/ce1-grandeurs-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour aux grandeurs et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              📏 Longueurs
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Apprends à estimer, comparer et mesurer les longueurs !
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
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📖 Cours
              </button>
              <button
                onClick={() => setShowExercises(true)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold transition-all touch-manipulation min-h-[44px] text-sm sm:text-base ${
                  showExercises 
                    ? 'bg-cyan-500 text-white shadow-md' 
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
                📏 Qu'est-ce qu'une longueur ?
              </h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-lg text-blue-900 text-center mb-4">
                  La longueur, c'est la distance entre deux points !
                </p>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    On peut mesurer la longueur d'un crayon, la hauteur d'une table, la largeur d'un livre...
                  </div>
                </div>
              </div>
            </div>

            {/* Les unités de longueur */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                📐 Les unités de longueur
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-3 text-center">📏 Le centimètre (cm)</h4>
                  <div className="text-center mb-3">
                    <div className="w-8 h-1 bg-green-500 mx-auto mb-2"></div>
                    <p className="text-green-700 text-sm">1 cm</p>
                  </div>
                  <ul className="space-y-2 text-green-600 text-sm">
                    <li>• Largeur d'un ongle</li>
                    <li>• Épaisseur d'un livre</li>
                    <li>• Petites distances</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3 text-center">📏 Le décimètre (dm)</h4>
                  <div className="text-center mb-3">
                    <div className="w-20 h-1 bg-blue-500 mx-auto mb-2"></div>
                    <p className="text-blue-700 text-sm">1 dm = 10 cm</p>
                  </div>
                  <ul className="space-y-2 text-blue-600 text-sm">
                    <li>• Largeur d'une main</li>
                    <li>• Longueur d'un téléphone</li>
                    <li>• Moyennes distances</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-3 text-center">📏 Le mètre (m)</h4>
                  <div className="text-center mb-3">
                    <div className="w-full h-1 bg-purple-500 mx-auto mb-2"></div>
                    <p className="text-purple-700 text-sm">1 m = 10 dm = 100 cm</p>
                  </div>
                  <ul className="space-y-2 text-purple-600 text-sm">
                    <li>• Hauteur d'une table</li>
                    <li>• Largeur d'une porte</li>
                    <li>• Grandes distances</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comment mesurer */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔧 Comment bien mesurer ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-3">📐 Avec une règle</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Place le 0 au début</li>
                    <li>• Lis le nombre à la fin</li>
                    <li>• Tiens la règle bien droite</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3">👁️ En estimant</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Compare avec ton corps</li>
                    <li>• Utilise des objets connus</li>
                    <li>• Fais une estimation puis vérifie</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-3">🔄 En comparant</h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Plus long / plus court</li>
                    <li>• Même longueur</li>
                    <li>• Range du plus petit au plus grand</li>
                  </ul>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-bold text-pink-800 mb-3">🎯 Repères utiles</h4>
                  <ul className="space-y-2 text-pink-700">
                    <li>• Largeur du pouce ≈ 2 cm</li>
                    <li>• Largeur de la main ≈ 1 dm</li>
                    <li>• Envergure des bras ≈ taille</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conversions simples */}
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🔢 Conversions importantes</h3>
              <ul className="space-y-2">
                <li>• 📏 1 décimètre = 10 centimètres</li>
                <li>• 📐 1 mètre = 10 décimètres</li>
                <li>• 📏 1 mètre = 100 centimètres</li>
                <li>• 🎯 Pour convertir : compte par 10 ou par 100</li>
                <li>• 🏆 Entraîne-toi à estimer puis à vérifier !</li>
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
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
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
                        ? 'border-blue-500 bg-blue-100 text-blue-800'
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
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors text-lg touch-manipulation min-h-[44px]"
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
                  className="bg-blue-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
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