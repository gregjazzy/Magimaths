'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, ChevronRight, Puzzle, Plus, Equal } from 'lucide-react';

export default function DecomposerFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState<{num: number, den: number}[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // États pour l'animation de démonstration
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const exercises = [
    // Décompositions simples (partie entière + fraction)
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 5, den: 3 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 3, den: 3 }, { num: 2, den: 3 }],
      alternativeDecomposition: [{ num: 1, den: 1 }, { num: 2, den: 3 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 7, den: 4 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 4, den: 4 }, { num: 3, den: 4 }],
      alternativeDecomposition: [{ num: 1, den: 1 }, { num: 3, den: 4 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 8, den: 3 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 6, den: 3 }, { num: 2, den: 3 }],
      alternativeDecomposition: [{ num: 2, den: 1 }, { num: 2, den: 3 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 9, den: 4 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 8, den: 4 }, { num: 1, den: 4 }],
      alternativeDecomposition: [{ num: 2, den: 1 }, { num: 1, den: 4 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 11, den: 5 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 10, den: 5 }, { num: 1, den: 5 }],
      alternativeDecomposition: [{ num: 2, den: 1 }, { num: 1, den: 5 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 13, den: 6 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 12, den: 6 }, { num: 1, den: 6 }],
      alternativeDecomposition: [{ num: 2, den: 1 }, { num: 1, den: 6 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 10, den: 3 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 9, den: 3 }, { num: 1, den: 3 }],
      alternativeDecomposition: [{ num: 3, den: 1 }, { num: 1, den: 3 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 14, den: 5 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 10, den: 5 }, { num: 4, den: 5 }],
      alternativeDecomposition: [{ num: 2, den: 1 }, { num: 4, den: 5 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 15, den: 4 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 12, den: 4 }, { num: 3, den: 4 }],
      alternativeDecomposition: [{ num: 3, den: 1 }, { num: 3, den: 4 }]
    },
    {
      question: 'Décompose cette fraction :',
      fraction: { num: 17, den: 6 },
      type: 'entiere-fraction',
      correctDecomposition: [{ num: 12, den: 6 }, { num: 5, den: 6 }],
      alternativeDecomposition: [{ num: 2, den: 1 }, { num: 5, den: 6 }]
    },
    // Décompositions en fractions unitaires
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 3, den: 4 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 4 }, { num: 1, den: 4 }, { num: 1, den: 4 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 4, den: 5 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 5 }, { num: 1, den: 5 }, { num: 1, den: 5 }, { num: 1, den: 5 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 2, den: 3 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 3 }, { num: 1, den: 3 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 5, den: 6 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 6 }, { num: 1, den: 6 }, { num: 1, den: 6 }, { num: 1, den: 6 }, { num: 1, den: 6 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 3, den: 8 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 8 }, { num: 1, den: 8 }, { num: 1, den: 8 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 6, den: 7 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 7 }, { num: 1, den: 7 }, { num: 1, den: 7 }, { num: 1, den: 7 }, { num: 1, den: 7 }, { num: 1, den: 7 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 4, den: 9 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 9 }, { num: 1, den: 9 }, { num: 1, den: 9 }, { num: 1, den: 9 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 7, den: 10 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 10 }, { num: 1, den: 10 }, { num: 1, den: 10 }, { num: 1, den: 10 }, { num: 1, den: 10 }, { num: 1, den: 10 }, { num: 1, den: 10 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 5, den: 12 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 12 }, { num: 1, den: 12 }, { num: 1, den: 12 }, { num: 1, den: 12 }, { num: 1, den: 12 }]
    },
    {
      question: 'Décompose cette fraction en fractions unitaires :',
      fraction: { num: 8, den: 15 },
      type: 'fractions-unitaires',
      correctDecomposition: [{ num: 1, den: 15 }, { num: 1, den: 15 }, { num: 1, den: 15 }, { num: 1, den: 15 }, { num: 1, den: 15 }, { num: 1, den: 15 }, { num: 1, den: 15 }, { num: 1, den: 15 }]
    }
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  const renderMathFraction = (num: number, den: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-lg',
      large: 'text-2xl'
    };

    return (
      <div className={`inline-flex flex-col items-center justify-center ${sizeClasses[size]} text-gray-800`}>
        <div className="font-bold text-center px-1">{num}</div>
        <div className="border-t-2 border-gray-800 font-bold text-center px-1 min-w-[20px]">{den}</div>
      </div>
    );
  };

  const renderFractionEquation = (leftFraction: {num: number, den: number}, rightParts: {num: number, den: number}[], size: 'small' | 'medium' | 'large' = 'medium') => {
    return (
      <div className="flex items-center justify-center gap-3">
        {renderMathFraction(leftFraction.num, leftFraction.den, size)}
        <div className={`font-bold ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-lg' : 'text-sm'} text-gray-800`}>=</div>
        <div className="flex items-center gap-2">
          {rightParts.map((part, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <div className={`font-bold ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-lg' : 'text-sm'} text-gray-800`}>+</div>}
              {part.den === 1 ? (
                <div className={`font-bold ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-lg' : 'text-sm'} text-gray-800`}>{part.num}</div>
              ) : (
                renderMathFraction(part.num, part.den, size)
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDecomposition = (components: { num: number, den: number }[], isSelected: boolean = false, isCorrect: boolean = false, showResult: boolean = false) => {
    return (
      <div className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
        isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
      } ${
        showResult && isCorrect ? 'border-green-500 bg-green-50' : 
        showResult && !isCorrect && isSelected ? 'border-red-500 bg-red-50' : ''
      }`}>
        {components.map((component, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <Plus className="w-4 h-4 text-gray-600" />}
            <div className="bg-white p-2 rounded border shadow-sm">
              {renderMathFraction(component.num, component.den, 'small')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAnimatedDemo = () => {
    const exercise = getCurrentExercise();
    const fraction = exercise.fraction;
    
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-2">
            🎯 Démonstration animée
          </h3>
          <p className="text-blue-600">
            Comment décomposer {renderMathFraction(fraction.num, fraction.den, 'medium')} ?
          </p>
        </div>

        {/* Étape 1 : Fraction originale */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg border-2 border-blue-200 text-center">
            <div className="text-lg font-semibold text-blue-800 mb-2">
              Fraction à décomposer :
            </div>
            <div className="text-3xl">
              {renderMathFraction(fraction.num, fraction.den, 'large')}
            </div>
          </div>
        </div>

        {/* Étape 2 : Explication de la méthode */}
        <div className="mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <div className="text-lg font-semibold text-yellow-800 mb-2">
              💡 Méthode :
            </div>
            <div className="text-yellow-700 space-y-2">
              {exercise.type === 'entiere-fraction' && (
                <>
                  <div>1. Je divise le numérateur par le dénominateur : {fraction.num} ÷ {fraction.den} = {Math.floor(fraction.num / fraction.den)} reste {fraction.num % fraction.den}</div>
                  <div>2. La partie entière est {Math.floor(fraction.num / fraction.den)}</div>
                  <div>3. La partie fractionnaire est {fraction.num % fraction.den}/{fraction.den}</div>
                </>
              )}
              {exercise.type === 'fractions-unitaires' && (
                <>
                  <div>1. Je décompose en fractions unitaires (numérateur = 1)</div>
                  <div>2. {fraction.num}/{fraction.den} = {Array.from({length: fraction.num}, (_, i) => '1/' + fraction.den).join(' + ')}</div>
                </>
              )}
              {exercise.type === 'mixte' && (
                <>
                  <div>1. Je trouve la partie entière : {Math.floor(fraction.num / fraction.den)}</div>
                  <div>2. Je trouve le reste : {fraction.num % fraction.den}/{fraction.den}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Étape 2.5 : Méthode alternative simple */}
        {exercise.type === 'entiere-fraction' && (
          <div className="mb-6">
            <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
              <div className="text-lg font-semibold text-orange-800 mb-2">
                🚀 Méthode alternative plus simple :
              </div>
              <div className="text-orange-700 space-y-3">
                <div className="text-base space-y-2">
                  <div>💡 <strong>Astuce :</strong> Le dénominateur est {fraction.den}</div>
                  <div>• {fraction.num} peut s'écrire {Math.floor(fraction.num / fraction.den) * fraction.den} + {fraction.num % fraction.den}</div>
                  <div>• Donc {renderMathFraction(fraction.num, fraction.den, 'small')} = {renderMathFraction(Math.floor(fraction.num / fraction.den) * fraction.den, fraction.den, 'small')} + {renderMathFraction(fraction.num % fraction.den, fraction.den, 'small')}</div>
                </div>
                <div className="text-center text-lg font-semibold bg-white p-2 rounded border-2 border-orange-300">
                  <strong>Résultat :</strong> 
                  <div className="mt-2">
                    {renderFractionEquation(
                      fraction,
                      [
                        { num: Math.floor(fraction.num / fraction.den), den: 1 },
                        { num: fraction.num % fraction.den, den: fraction.den }
                      ],
                      'medium'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3 : Résultat */}
        <div className="mb-6">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="text-lg font-semibold text-green-800 mb-2">
              ✅ Résultat :
            </div>
            <div className="text-center">
              {renderDecomposition(exercise.correctDecomposition)}
            </div>
          </div>
        </div>

      </div>
    );
  };

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    if (userAnswer.length === 0) return;

    // Filtrer les réponses vides
    const validAnswers = userAnswer.filter(answer => answer && answer.num > 0 && answer.den > 0);
    
    if (validAnswers.length === 0) return;

    // Vérifier la décomposition principale (avec même dénominateur)
    const correctMain = validAnswers.length === exercise.correctDecomposition.length &&
                        validAnswers.every((part, index) => 
                          part.num === exercise.correctDecomposition[index].num &&
                          part.den === exercise.correctDecomposition[index].den
                        );

    // Vérifier la décomposition alternative (forme simplifiée) si elle existe
    const correctAlternative = exercise.alternativeDecomposition ? 
                               validAnswers.length === exercise.alternativeDecomposition.length &&
                               validAnswers.every((part, index) => 
                                 part.num === exercise.alternativeDecomposition![index].num &&
                                 part.den === exercise.alternativeDecomposition![index].den
                               ) : false;

    const correct = correctMain || correctAlternative;
    
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const isAnswerComplete = () => {
    const exercise = getCurrentExercise();
    const validAnswers = userAnswer.filter(answer => answer && answer.num > 0 && answer.den > 0);
    return validAnswers.length === exercise.correctDecomposition.length;
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer([]);
      setShowAnswer(false);
      setIsCorrect(false);
      setShowHelp(false);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer([]);
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
    setShowHelp(false);
  };

  const getExerciseTypeLabel = (type: string) => {
    switch (type) {
      case 'entiere-fraction': return 'Partie entière + fraction';
      case 'fractions-unitaires': return 'Fractions unitaires';
      case 'mixte': return 'Décomposition mixte';
      case 'additive': return 'Décomposition additive';
      default: return 'Décomposition';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/chapitre/cm1-fractions-equivalentes" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Retour au chapitre
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Score: {score}/{attempts}
              </div>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <Puzzle className="inline-block w-8 h-8 mr-2 text-purple-600" />
              Décomposer les fractions
            </h1>
            <p className="text-gray-600 mb-4">
              Apprendre à décomposer les fractions de différentes manières
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={resetExercises}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Recommencer
              </button>
            </div>
          </div>
        </div>

        {/* Démonstration animée */}
        {renderAnimatedDemo()}

        {/* Exercices */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentExercise < exercises.length ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Exercice {currentExercise + 1} sur {exercises.length}
                </div>
                <div className="text-xs text-purple-600 mb-4">
                  {getExerciseTypeLabel(getCurrentExercise().type)}
                </div>
                <div className="text-lg font-medium text-gray-800 mb-4">
                  {getCurrentExercise().question}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="text-4xl">
                    {renderMathFraction(getCurrentExercise().fraction.num, getCurrentExercise().fraction.den, 'large')}
                  </div>
                </div>
              </div>

              {/* Interface de saisie */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  Écris ta décomposition :
                </h3>
                
                {/* Explication de la méthode alternative */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-sm">
                  <div className="font-semibold text-orange-800 mb-1">💡 Méthode simple :</div>
                  <div className="text-orange-700">
                    {getCurrentExercise().type === 'entiere-fraction' && (
                      <>
                        Pour {renderMathFraction(getCurrentExercise().fraction.num, getCurrentExercise().fraction.den, 'small')}, 
                        pense : j'ai {getCurrentExercise().fraction.num} parts de {renderMathFraction(1, getCurrentExercise().fraction.den, 'small')}. 
                        Avec {getCurrentExercise().fraction.den} parts je fais 1 entier !
                      </>
                    )}
                    {getCurrentExercise().type === 'fractions-unitaires' && (
                      <>
                        Décompose en fractions unitaires : utilise des fractions avec numérateur = 1
                      </>
                    )}
                  </div>
                </div>

                {/* Champs de saisie */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {renderMathFraction(getCurrentExercise().fraction.num, getCurrentExercise().fraction.den, 'medium')}
                    <span className="text-2xl font-bold text-gray-800">=</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {Array.from({length: getCurrentExercise().type === 'entiere-fraction' ? 2 : getCurrentExercise().type === 'fractions-unitaires' ? getCurrentExercise().fraction.num : 2}, (_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index > 0 && <span className="text-xl font-bold text-gray-800">+</span>}
                        
                        {/* Saisie pour partie entière ou fraction */}
                        {getCurrentExercise().type === 'entiere-fraction' && index === 0 && Math.floor(getCurrentExercise().fraction.num / getCurrentExercise().fraction.den) > 0 ? (
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={userAnswer[index]?.num || ''}
                            onChange={(e) => {
                              const newAnswer = [...userAnswer];
                              newAnswer[index] = { num: parseInt(e.target.value) || 0, den: 1 };
                              setUserAnswer(newAnswer);
                            }}
                            className="w-16 h-12 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-gray-900 bg-white"
                            placeholder="?"
                          />
                        ) : (
                          <div className="inline-flex flex-col items-center">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={userAnswer[index]?.num || ''}
                              onChange={(e) => {
                                const newAnswer = [...userAnswer];
                                newAnswer[index] = { 
                                  num: parseInt(e.target.value) || 0, 
                                  den: userAnswer[index]?.den || getCurrentExercise().fraction.den 
                                };
                                setUserAnswer(newAnswer);
                              }}
                              className="w-16 h-10 text-center text-lg font-bold border-2 border-gray-300 rounded-t-lg focus:border-purple-500 focus:outline-none text-gray-900 bg-white"
                              placeholder="?"
                            />
                            <div className="w-16 h-0.5 bg-gray-800"></div>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={userAnswer[index]?.den || ''}
                              onChange={(e) => {
                                const newAnswer = [...userAnswer];
                                newAnswer[index] = { 
                                  num: userAnswer[index]?.num || 0, 
                                  den: parseInt(e.target.value) || 1
                                };
                                setUserAnswer(newAnswer);
                              }}
                              className="w-16 h-10 text-center text-lg font-bold border-2 border-gray-300 rounded-b-lg focus:border-purple-500 focus:outline-none text-gray-900 bg-white"
                              placeholder="?"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Affichage du résultat */}
                {showAnswer && (
                  <div className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                    <div className="text-center">
                      {isCorrect ? (
                        <div className="text-green-800">
                          <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-semibold">Excellent ! 🎉</div>
                        </div>
                      ) : (
                        <div className="text-red-800">
                          <XCircle className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-semibold">Pas tout à fait...</div>
                          <div className="text-sm mt-2">
                            <div>La bonne réponse est : {renderDecomposition(getCurrentExercise().correctDecomposition)}</div>
                            {getCurrentExercise().alternativeDecomposition && (
                              <div className="mt-1 text-xs text-gray-600">
                                Ou en forme simplifiée : {renderDecomposition(getCurrentExercise().alternativeDecomposition!)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHelp ? 'Masquer l\'aide' : 'Aide'}
                </button>
                
                <button
                  onClick={checkAnswer}
                  disabled={!isAnswerComplete() || showAnswer}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Vérifier
                </button>
              </div>

              {/* Aide */}
              {showHelp && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-bold text-orange-800 mb-2">💡 Aide :</h3>
                  <div className="text-orange-700 text-sm space-y-1">
                    <div>• Pour décomposer {getCurrentExercise().fraction.num}/{getCurrentExercise().fraction.den} :</div>
                    <div>• Divise {getCurrentExercise().fraction.num} par {getCurrentExercise().fraction.den}</div>
                    <div>• La partie entière est {Math.floor(getCurrentExercise().fraction.num / getCurrentExercise().fraction.den)}</div>
                    <div>• Le reste est {getCurrentExercise().fraction.num % getCurrentExercise().fraction.den}/{getCurrentExercise().fraction.den}</div>
                  </div>
                </div>
              )}

              {/* Résultat */}
              {showAnswer && (
                <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">La bonne réponse était :</div>
                      {renderDecomposition(getCurrentExercise().correctDecomposition)}
                    </div>
                  )}
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={nextExercise}
                      className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Exercice suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Félicitations !</h3>
              <p className="text-gray-600 mb-4">
                Tu as terminé tous les exercices ! Score : {score}/{attempts}
              </p>
              <button
                onClick={resetExercises}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5" />
                Recommencer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 