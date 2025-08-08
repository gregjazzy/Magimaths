'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

interface Exercise {
  question: string;
  fraction1?: string;
  fraction2?: string;
  mathExpression?: string;
  correctAnswer: string;
  hint: string;
  hasVisual: boolean;
}

// Composant pour afficher une fraction mathématique
function FractionMath({a, b, size = 'text-xl'}: {a: string|number, b: string|number, size?: string}) {
  return (
    <span className={`inline-block align-middle ${size} text-gray-900 font-bold`} style={{ minWidth: 24 }}>
      <span className="flex flex-col items-center" style={{lineHeight:1}}>
        <span className="border-b-2 border-gray-800 px-1 text-gray-900">{a}</span>
        <span className="px-1 text-gray-900">{b}</span>
      </span>
    </span>
  );
}

// Composant pour afficher une bande unité avec fractions
function BandeUnite({fraction, color = "#3b82f6", width = 300, height = 60}: {fraction: string, color?: string, width?: number, height?: number}) {
  const [numerator, denominator] = fraction.split('/').map(Number);
  const partWidth = width / denominator;
  
  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="border-2 border-gray-400 rounded">
        {/* Dessiner toutes les parts */}
        {Array.from({length: denominator}, (_, i) => (
          <g key={i}>
            {/* Rectangle de chaque part */}
            <rect
              x={i * partWidth}
              y={0}
              width={partWidth}
              height={height}
              fill={i < numerator ? color : "#f3f4f6"}
              stroke="#6b7280"
              strokeWidth="1"
            />
            {/* Ligne de séparation */}
            {i < denominator - 1 && (
              <line
                x1={(i + 1) * partWidth}
                y1={0}
                x2={(i + 1) * partWidth}
                y2={height}
                stroke="#374151"
                strokeWidth="2"
              />
            )}
          </g>
        ))}
      </svg>
      <div className="mt-2 text-center">
        <FractionMath a={numerator} b={denominator} size="text-lg" />
      </div>
    </div>
  );
}

export default function FractionsBandeUniteExercicesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const stopSignalRef = useRef(false);

  const exercises: Exercise[] = [
    {
      question: "Quelle fraction représente la partie colorée de cette bande unité ?",
      correctAnswer: "2/4",
      hint: "Compte les parties colorées (2) et le nombre total de parties (4).",
      hasVisual: true
    },
    {
      question: "Identifie la fraction représentée par la bande colorée :",
      correctAnswer: "1/3",
      hint: "Il y a 1 partie colorée sur 3 parties au total.",
      hasVisual: true
    },
    {
      question: "Quelle fraction correspond à la partie colorée ?",
      correctAnswer: "3/5",
      hint: "3 parties sont colorées sur 5 parties au total.",
      hasVisual: true
    },
    {
      question: "Trouve la fraction représentée :",
      correctAnswer: "1/2",
      hint: "La moitié de la bande est colorée.",
      hasVisual: true
    },
    {
      question: "Quelle fraction vois-tu ?",
      correctAnswer: "4/6",
      hint: "4 parties colorées sur 6 parties au total.",
      hasVisual: true
    }
  ];

  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onend = () => {
        if (stopSignalRef.current) return;
        setIsPlayingVocal(false);
        resolve();
      };
      
      utterance.onerror = () => {
        if (stopSignalRef.current) return;
        setIsPlayingVocal(false);
        resolve();
      };
      
      if (stopSignalRef.current) return;
      speechSynthesis.speak(utterance);
    });
  };

  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    setIsPlayingVocal(false);
    setIsAnimating(false);
    
    speechSynthesis.cancel();
    
    setTimeout(() => {
      stopSignalRef.current = false;
    }, 100);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopAllVocalsAndAnimations();
    };
  }, []);

  const checkAnswer = () => {
    const userAnswer = `${numerator}/${denominator}`;
    const correctAnswer = exercises[currentExercise].correctAnswer;
    
    // Normaliser les fractions pour la comparaison
    const normalize = (fraction: string) => {
      const [num, den] = fraction.split('/').map(Number);
      return `${num}/${den}`;
    };
    
    const isAnswerCorrect = normalize(userAnswer) === normalize(correctAnswer);
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect && !answeredCorrectly.has(currentExercise)) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }
    
    if (isAnswerCorrect) {
      playAudio("Bravo ! C'est la bonne réponse !");
    } else {
      playAudio("Ce n'est pas tout à fait ça. Regarde bien l'indice !");
    }
  };

  const nextExercise = () => {
    setCurrentExercise(currentExercise + 1);
    setNumerator('');
    setDenominator('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const finishExercises = () => {
    setFinalScore(score);
    setShowCompletionModal(true);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setNumerator('');
    setDenominator('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonction pour obtenir la fraction correcte pour l'affichage de la bande
  const getCurrentFraction = () => {
    return exercises[currentExercise]?.correctAnswer || '1/2';
  };

  const generateFractionForExercise = (exerciseIndex: number): string => {
    const correctAnswers = ["2/4", "1/3", "3/5", "1/2", "4/6"];
    return correctAnswers[exerciseIndex] || "1/2";
  };

  const getRandomColor = () => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
    return colors[currentExercise % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      {/* Bouton STOP flottant global */}
      {(isPlayingVocal || isAnimating) && (
        <button
          onClick={stopAllVocalsAndAnimations}
          className="fixed top-4 right-4 z-[60] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2"
        >
          <div className="w-8 h-8 relative">
            <img
              src="/image/Minecraftstyle.png"
              alt="Stop"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="font-bold text-sm">Stop</span>
          <div className="w-3 h-3 bg-white rounded animate-pulse"></div>
        </button>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce2-fractions-bande-unite" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              📏 Fractions avec bandes unité
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Utilise les bandes unité pour identifier les fractions !
            </p>
          </div>
        </div>

        {/* Modal de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return {
                    title: "Excellent travail !",
                    message: "Tu maîtrises parfaitement les fractions avec les bandes unité !",
                    color: "text-green-800",
                    bgColor: "bg-green-100"
                  };
                  if (percentage >= 70) return {
                    title: "Très bien !",
                    message: "Tu comprends bien les fractions. Continue à t'entraîner !",
                    color: "text-blue-800",
                    bgColor: "bg-blue-100"
                  };
                  if (percentage >= 50) return {
                    title: "Bon travail !",
                    message: "Tu progresses bien. Revois les exercices difficiles !",
                    color: "text-yellow-800",
                    bgColor: "bg-yellow-100"
                  };
                  return {
                    title: "Continue à apprendre !",
                    message: "Les fractions demandent de la pratique. Ne lâche pas !",
                    color: "text-red-800",
                    bgColor: "bg-red-100"
                  };
                };
                const result = getMessage();
                return (
                  <div className={`${result.bgColor} rounded-2xl p-6`}>
                    <div className="text-6xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 50 ? "😊" : "📖"}</div>
                    <h3 className={`text-2xl font-bold mb-3 ${result.color}`}>{result.title}</h3>
                    <p className={`text-lg mb-4 ${result.color}`}>{result.message}</p>
                    <p className={`text-xl font-bold mb-4 ${result.color}`}>
                      Score final : {finalScore}/{exercises.length} ({percentage}%)
                    </p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {Math.round(18 * (finalScore / exercises.length))} XP gagnés !
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                      >
                        Fermer
                      </button>
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          resetAll();
                        }}
                        className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
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

        {/* Exercice en cours */}
        {currentExercise < exercises.length && (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6">
            {/* Progression */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentExercise + 1} sur {exercises.length}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  Score: {score}/{exercises.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
              {exercises[currentExercise].question}
            </h2>

            {/* Bande unité */}
            <div className="flex justify-center mb-6">
              <BandeUnite 
                fraction={generateFractionForExercise(currentExercise)} 
                color={getRandomColor()}
                width={300}
                height={60}
              />
            </div>

            {/* Saisie de réponse */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Ta réponse :</h3>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-gray-700 mb-1">Numérateur</label>
                  <input
                    type="number"
                    value={numerator}
                    onChange={(e) => setNumerator(e.target.value)}
                    className="w-16 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    min="0"
                    max="10"
                  />
                </div>
                
                <div className="text-3xl font-bold text-gray-600">/</div>
                
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-gray-700 mb-1">Dénominateur</label>
                  <input
                    type="number"
                    value={denominator}
                    onChange={(e) => setDenominator(e.target.value)}
                    className="w-16 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
              <button
                onClick={checkAnswer}
                disabled={!numerator || !denominator}
                className="bg-blue-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed touch-manipulation min-h-[44px]"
              >
                Vérifier
              </button>
              
              <button
                onClick={() => {
                  setNumerator('');
                  setDenominator('');
                  setIsCorrect(null);
                }}
                className="bg-gray-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
              >
                Effacer
              </button>
            </div>

            {/* Résultat */}
            {isCorrect !== null && (
              <div className={`col-span-2 p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="flex items-center justify-center space-x-2">
                  {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  <span className="font-bold">
                    {isCorrect ? 'Correct !' : 'Incorrect'}
                  </span>
                </div>
                {!isCorrect && (
                  <p className="text-center mt-2">
                    La bonne réponse est : <FractionMath a={exercises[currentExercise].correctAnswer.split('/')[0]} b={exercises[currentExercise].correctAnswer.split('/')[1]} />
                  </p>
                )}
                
                {/* Bouton pour continuer */}
                <div className="text-center mt-4">
                  {currentExercise < exercises.length - 1 ? (
                    <button
                      onClick={nextExercise}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                    >
                      Question suivante
                    </button>
                  ) : (
                    <button
                      onClick={finishExercises}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors"
                    >
                      Terminer les exercices
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bouton d'indice */}
            <div className="text-center">
              <button
                onClick={() => {
                  setShowHint(!showHint);
                  if (!showHint) {
                    playAudio(`Indice : ${exercises[currentExercise].hint}`);
                  }
                }}
                className="inline-flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-medium"
              >
                <Lightbulb className="w-5 h-5" />
                <span>{showHint ? 'Masquer l\'indice' : 'Voir l\'indice'}</span>
              </button>
              
              {showHint && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    💡 {exercises[currentExercise].hint}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}