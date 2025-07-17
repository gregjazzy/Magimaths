'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, ChevronRight, Ruler } from 'lucide-react';

export default function RepresenterFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // États pour la démonstration animée
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedFraction, setSelectedFraction] = useState({ num: 3, den: 4 });
  
  // États pour l'animation de correction
  const [correctAnimationStep, setCorrectAnimationStep] = useState(0);
  const [isCorrectAnimating, setIsCorrectAnimating] = useState(false);

  const exercises = [
    // Fractions simples (< 1)
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 1, den: 2 },
      type: 'simple',
      options: [
        { position: 0.25, correct: false },
        { position: 0.5, correct: true },
        { position: 0.75, correct: false },
        { position: 1, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 3, den: 4 },
      type: 'simple',
      options: [
        { position: 0.5, correct: false },
        { position: 0.6, correct: false },
        { position: 0.75, correct: true },
        { position: 0.8, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 2, den: 3 },
      type: 'simple',
      options: [
        { position: 0.5, correct: false },
        { position: 0.6, correct: false },
        { position: 0.67, correct: true },
        { position: 0.75, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 1, den: 4 },
      type: 'simple',
      options: [
        { position: 0.2, correct: false },
        { position: 0.25, correct: true },
        { position: 0.3, correct: false },
        { position: 0.4, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 3, den: 5 },
      type: 'simple',
      options: [
        { position: 0.5, correct: false },
        { position: 0.6, correct: true },
        { position: 0.65, correct: false },
        { position: 0.75, correct: false }
      ]
    },
    // Fractions supérieures à 1
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 5, den: 4 },
      type: 'greater-than-one',
      options: [
        { position: 1, correct: false },
        { position: 1.25, correct: true },
        { position: 1.5, correct: false },
        { position: 1.75, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 7, den: 3 },
      type: 'greater-than-one',
      options: [
        { position: 2, correct: false },
        { position: 2.33, correct: true },
        { position: 2.5, correct: false },
        { position: 2.7, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 3, den: 2 },
      type: 'greater-than-one',
      options: [
        { position: 1.25, correct: false },
        { position: 1.5, correct: true },
        { position: 1.75, correct: false },
        { position: 2, correct: false }
      ]
    },
    // Fractions avec dénominateurs plus grands
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 5, den: 6 },
      type: 'complex',
      options: [
        { position: 0.75, correct: false },
        { position: 0.8, correct: false },
        { position: 0.83, correct: true },
        { position: 0.9, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 7, den: 8 },
      type: 'complex',
      options: [
        { position: 0.8, correct: false },
        { position: 0.85, correct: false },
        { position: 0.875, correct: true },
        { position: 0.9, correct: false }
      ]
    },
    // Exercices supplémentaires pour atteindre 22
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 1, den: 3 },
      type: 'simple',
      options: [
        { position: 0.25, correct: false },
        { position: 0.33, correct: true },
        { position: 0.4, correct: false },
        { position: 0.5, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 2, den: 5 },
      type: 'simple',
      options: [
        { position: 0.3, correct: false },
        { position: 0.4, correct: true },
        { position: 0.5, correct: false },
        { position: 0.6, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 4, den: 5 },
      type: 'simple',
      options: [
        { position: 0.6, correct: false },
        { position: 0.7, correct: false },
        { position: 0.8, correct: true },
        { position: 0.85, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 3, den: 8 },
      type: 'simple',
      options: [
        { position: 0.25, correct: false },
        { position: 0.33, correct: false },
        { position: 0.375, correct: true },
        { position: 0.4, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 5, den: 8 },
      type: 'simple',
      options: [
        { position: 0.5, correct: false },
        { position: 0.6, correct: false },
        { position: 0.625, correct: true },
        { position: 0.7, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 6, den: 6 },
      type: 'equals-one',
      options: [
        { position: 0.8, correct: false },
        { position: 0.9, correct: false },
        { position: 1, correct: true },
        { position: 1.1, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 4, den: 4 },
      type: 'equals-one',
      options: [
        { position: 0.75, correct: false },
        { position: 0.9, correct: false },
        { position: 1, correct: true },
        { position: 1.25, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 4, den: 3 },
      type: 'greater-than-one',
      options: [
        { position: 1, correct: false },
        { position: 1.25, correct: false },
        { position: 1.33, correct: true },
        { position: 1.5, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 9, den: 4 },
      type: 'greater-than-one',
      options: [
        { position: 2, correct: false },
        { position: 2.25, correct: true },
        { position: 2.5, correct: false },
        { position: 2.75, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 8, den: 3 },
      type: 'greater-than-one',
      options: [
        { position: 2.5, correct: false },
        { position: 2.67, correct: true },
        { position: 2.8, correct: false },
        { position: 3, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 1, den: 6 },
      type: 'complex',
      options: [
        { position: 0.1, correct: false },
        { position: 0.15, correct: false },
        { position: 0.167, correct: true },
        { position: 0.2, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 5, den: 6 },
      type: 'complex',
      options: [
        { position: 0.75, correct: false },
        { position: 0.8, correct: false },
        { position: 0.833, correct: true },
        { position: 0.9, correct: false }
      ]
    }
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  // Fonction pour rendre une fraction en format mathématique
  // Fonction pour rendre une petite droite graduée pour les options QCM
  const renderMiniNumberLine = (fraction: { num: number, den: number }, pointPosition: number, isSelected: boolean = false, isCorrect: boolean = false, showResult: boolean = false) => {
    const width = 200;
    const maxValue = Math.max(2, Math.ceil(Math.max(fraction.num / fraction.den, pointPosition) + 0.5));
    const segmentWidth = width / maxValue;
    const pointX = pointPosition * segmentWidth;
    
    return (
      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
        <div className="relative" style={{ width: `${width}px`, height: '60px' }}>
          {/* Ligne principale */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 transform -translate-y-1/2"></div>
          
          {/* Graduations principales */}
          {Array.from({ length: maxValue + 1 }, (_, i) => (
            <div key={i} className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" style={{ left: `${i * segmentWidth}px` }}>
              <div className="w-0.5 h-4 bg-gray-600 -translate-y-2"></div>
              <div className="text-xs font-medium text-gray-700 mt-1 text-center">{i}</div>
            </div>
          ))}
          
          {/* Graduations secondaires pour les fractions */}
          {Array.from({ length: maxValue }, (_, i) => (
            Array.from({ length: fraction.den - 1 }, (_, j) => (
              <div key={`${i}-${j}`} className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" 
                   style={{ left: `${i * segmentWidth + (j + 1) * (segmentWidth / fraction.den)}px` }}>
                <div className="w-0.5 h-2 bg-gray-400 -translate-y-1"></div>
              </div>
            ))
          ))}
          
          {/* Point de la position proposée */}
          <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10" 
               style={{ left: `${pointX}px` }}>
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${
              showResult && isCorrect ? 'bg-green-500' : 
              showResult && !isCorrect ? 'bg-red-500' : 
              isSelected ? 'bg-blue-500' : 'bg-purple-500'
            }`}></div>
          </div>
        </div>
      </div>
    );
  };

  const renderMathFraction = (num: number, den: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClasses = {
      small: 'text-lg',
      medium: 'text-2xl',
      large: 'text-4xl'
    };
    const lineClasses = {
      small: 'h-0.5 w-8',
      medium: 'h-0.5 w-12',
      large: 'h-1 w-16'
    };
    
    return (
      <div className="text-center">
        <div className={`font-bold text-blue-600 leading-none ${sizeClasses[size]}`}>{num}</div>
        <div className={`bg-gray-400 mx-auto my-1 rounded ${lineClasses[size]}`}></div>
        <div className={`font-bold text-purple-600 leading-none ${sizeClasses[size]}`}>{den}</div>
      </div>
    );
  };

  // Fonction pour créer la droite graduée avec animations
  const renderNumberLine = (fraction: { num: number, den: number }, showCorrectAnswer = false, userPosition: number | null = null, animationPhase = 0) => {
    const maxValue = Math.max(2, Math.ceil(fraction.num / fraction.den) + 1);
    const totalWidth = 600;
    const segmentWidth = totalWidth / maxValue;
    const fractionPosition = (fraction.num / fraction.den) * segmentWidth;
    
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border-2 border-purple-200">
        {/* Visualisation de la décomposition de l'unité */}
        {animationPhase >= 1 && (
          <div className="w-full mb-4">
            <div className="text-center mb-3">
              <div className="font-bold text-purple-800 text-lg">
                Décomposition de l'unité
              </div>
              <div className="text-purple-600 text-sm">
                Je divise 1 unité en {fraction.den} parties égales
              </div>
            </div>
            <div className="flex justify-center items-center space-x-4">
              {/* Unité complète */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">Unité complète</div>
                <div className="w-20 h-12 bg-blue-200 border-2 border-blue-400 rounded flex items-center justify-center">
                  <span className="font-bold text-blue-800">1</span>
                </div>
              </div>
              
              {/* Flèche */}
              <div className="text-2xl text-purple-600">→</div>
              
              {/* Unité divisée */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">Divisée en {fraction.den} parties</div>
                <div className="flex">
                  {Array.from({ length: fraction.den }, (_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-12 border-2 border-purple-400 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                        animationPhase >= 2 ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-700'
                      }`}
                      style={{ 
                        transitionDelay: `${i * 200}ms`,
                        borderLeft: i === 0 ? '2px solid #9333ea' : '1px solid #9333ea'
                      }}
                    >
                      {animationPhase >= 2 && (
                        <span className="transform rotate-90 text-xs">
                          1/{fraction.den}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Explication que toutes les parties = 1 unité */}
              {animationPhase >= 3 && (
                <>
                  <div className="text-2xl text-orange-600 animate-fade-in-up">→</div>
                  <div className="flex flex-col items-center animate-fade-in-up">
                    <div className="text-sm text-gray-600 mb-2">Toutes les parties = 1 unité</div>
                    <div className="flex">
                      {Array.from({ length: fraction.den }, (_, i) => (
                        <div
                          key={i}
                          className="w-6 h-12 border-2 border-orange-400 bg-orange-200 flex items-center justify-center text-xs font-bold transition-all duration-500"
                          style={{ 
                            transitionDelay: `${i * 200}ms`,
                            borderLeft: i === 0 ? '2px solid #ea580c' : '1px solid #ea580c'
                          }}
                        >
                          <span className="transform rotate-90 text-xs text-orange-800">
                            ✓
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-orange-800 font-bold">
                      = {fraction.den}/{fraction.den} = 1
                    </div>
                  </div>
                </>
              )}
              
              {/* Flèche vers la fraction */}
              {animationPhase >= 4 && (
                <>
                  <div className="text-2xl text-green-600 animate-fade-in-up">→</div>
                  <div className="flex flex-col items-center animate-fade-in-up">
                    <div className="text-sm text-gray-600 mb-2">Je prends {fraction.num} {fraction.num === 1 ? 'partie' : 'parties'}</div>
                    <div className="flex">
                      {Array.from({ length: fraction.den }, (_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-12 border-2 border-purple-400 flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                            i < fraction.num ? 'bg-green-300 text-green-800' : 'bg-gray-200 text-gray-700'
                          }`}
                          style={{ 
                            transitionDelay: `${i * 200}ms`,
                            borderLeft: i === 0 ? '2px solid #9333ea' : '1px solid #9333ea'
                          }}
                        >
                          {i < fraction.num && (
                            <span className="transform rotate-90 text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-green-800 font-bold">
                      = {fraction.num}/{fraction.den}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="relative" style={{ width: `${totalWidth}px`, height: '120px' }}>
          {/* Zone de mise en évidence de la réponse */}
          {(showCorrectAnswer || animationPhase >= 7) && (
            <div 
              className="absolute top-0 bottom-0 bg-gradient-to-b from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-lg opacity-60 animate-pulse"
              style={{
                left: `${Math.max(0, fractionPosition - 20)}px`,
                width: '40px',
                zIndex: 5
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-yellow-800">
                🎯
              </div>
            </div>
          )}
          
          {/* Ligne principale */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 transform -translate-y-1/2"></div>
          
          {/* Graduations principales (entiers) */}
          {Array.from({ length: maxValue + 1 }, (_, i) => {
            const isTargetInteger = fraction.num % fraction.den === 0 && fraction.num / fraction.den === i;
            
            return (
              <div key={i} className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" style={{ left: `${i * segmentWidth}px` }}>
                <div className={`w-0.5 h-8 -translate-y-4 ${
                  isTargetInteger && (showCorrectAnswer || animationPhase >= 7) 
                    ? 'bg-red-500 shadow-lg animate-pulse' 
                    : 'bg-gray-800'
                }`}></div>
                <div className={`text-sm font-bold mt-2 text-center ${
                  isTargetInteger && (showCorrectAnswer || animationPhase >= 7)
                    ? 'text-red-600 animate-pulse'
                    : 'text-gray-800'
                }`}>{i}</div>
              </div>
            );
          })}
          
          {/* Graduations secondaires (fractions) avec animation */}
          {Array.from({ length: maxValue }, (_, i) => (
            Array.from({ length: fraction.den - 1 }, (_, j) => {
              const shouldShow = animationPhase >= 5;
              const delay = (i * (fraction.den - 1) + j) * 100;
              const currentFraction = i * fraction.den + j + 1;
              const isTargetFraction = currentFraction === fraction.num;
              
              return (
                <div key={`${i}-${j}`} 
                     className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ${
                       shouldShow ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                     }`}
                     style={{ 
                       left: `${i * segmentWidth + (j + 1) * (segmentWidth / fraction.den)}px`,
                       transitionDelay: `${delay}ms`
                     }}>
                  <div className={`w-0.5 h-4 -translate-y-2 ${
                    isTargetFraction && (showCorrectAnswer || animationPhase >= 7) 
                      ? 'bg-red-500 shadow-lg animate-pulse' 
                      : 'bg-purple-500'
                  }`}></div>
                  <div className={`text-xs mt-1 text-center whitespace-nowrap ${
                    isTargetFraction && (showCorrectAnswer || animationPhase >= 7)
                      ? 'text-red-600 font-bold animate-pulse'
                      : 'text-purple-600'
                  }`}>
                    {shouldShow && animationPhase >= 6 ? `${currentFraction}/${fraction.den}` : ''}
                  </div>
                </div>
              );
            })
          ))}
          
          {/* Animation du comptage */}
          {animationPhase >= 6 && Array.from({ length: fraction.num }, (_, i) => {
            const unitIndex = Math.floor(i / fraction.den);
            const partIndex = i % fraction.den;
            const xPos = unitIndex * segmentWidth + (partIndex + 1) * (segmentWidth / fraction.den);
            const delay = i * 300;
            
            return (
              <div key={`count-${i}`} 
                   className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 animate-pulse"
                   style={{ 
                     left: `${xPos}px`,
                     animationDelay: `${delay}ms`,
                     animationDuration: '800ms'
                   }}>
                <div className="w-4 h-4 bg-yellow-400 rounded-full -translate-y-6 border-2 border-yellow-600">
                  <div className="text-xs font-bold text-yellow-800 text-center leading-3">{i + 1}</div>
                </div>
              </div>
            );
          })}
          
          {/* Position correcte (si on montre la réponse) avec mise en évidence */}
          {showCorrectAnswer && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20" 
                 style={{ left: `${fractionPosition}px` }}>
              
              {/* Cercle de fond avec effet de pulsation */}
              <div className="absolute inset-0 w-12 h-12 bg-green-100 rounded-full animate-ping opacity-50 -translate-x-6 -translate-y-6"></div>
              
              {/* Point principal agrandi */}
              <div className="relative w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-white shadow-2xl -translate-y-3 animate-pulse">
                <div className="absolute inset-0 bg-green-300 rounded-full animate-pulse opacity-75"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-transparent rounded-full"></div>
              </div>
              
              {/* Encadré avec les informations */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white border-2 border-green-500 rounded-lg p-2 shadow-lg animate-fade-in-up min-w-max">
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600 mb-1">
                    {renderMathFraction(fraction.num, fraction.den, 'small')}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    = {(fraction.num / fraction.den).toFixed(3)}
                  </div>
                  <div className="text-xs text-green-500 font-semibold">
                    ✅ Correct !
                  </div>
                </div>
              </div>
              
              {/* Flèche pointant vers la position */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
                <div className="text-lg">⬇️</div>
                <div className="text-xs text-green-600 font-bold whitespace-nowrap">
                  BONNE RÉPONSE
                </div>
              </div>
              
              {/* Ligne verticale d'indication */}
              <div className="absolute top-0 left-1/2 transform -translate-x-0.5 w-1 h-full bg-green-500 opacity-50 animate-pulse"></div>
            </div>
          )}
          
          {/* Position finale de la fraction avec animation améliorée */}
          {animationPhase >= 7 && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20" 
                 style={{ left: `${fractionPosition}px` }}>
              
              {/* Cercle de fond avec effet de pulsation */}
              <div className="absolute inset-0 w-16 h-16 bg-red-100 rounded-full animate-ping opacity-50 -translate-x-8 -translate-y-8"></div>
              
              {/* Point principal agrandi */}
              <div className="relative w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-4 border-white shadow-2xl -translate-y-4 animate-bounce" 
                   style={{ 
                     animationDuration: '1.5s',
                     animationIterationCount: '4'
                   }}>
                <div className="absolute inset-0 bg-red-300 rounded-full animate-pulse opacity-75"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-transparent rounded-full"></div>
              </div>
              
              {/* Encadré avec les informations */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white border-2 border-red-500 rounded-lg p-3 shadow-lg animate-fade-in-up min-w-max">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600 mb-1">
                    {renderMathFraction(fraction.num, fraction.den, 'medium')}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    = {(fraction.num / fraction.den).toFixed(3)}
                  </div>
                  <div className="text-xs text-red-500 font-semibold">
                    📍 Position exacte
                  </div>
                </div>
              </div>
              
              {/* Flèche pointant vers la position */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
                <div className="text-2xl">⬇️</div>
                <div className="text-xs text-red-600 font-bold whitespace-nowrap">
                  RÉSULTAT
                </div>
              </div>
              
              {/* Ligne verticale d'indication */}
              <div className="absolute top-0 left-1/2 transform -translate-x-0.5 w-1 h-full bg-red-500 opacity-50 animate-pulse"></div>
            </div>
          )}
          
          {/* Position de l'utilisateur */}
          {userPosition !== null && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10" 
                 style={{ left: `${userPosition}px` }}>
              <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg -translate-y-1.5 ${
                showCorrectAnswer ? 
                  (Math.abs(userPosition - fractionPosition) < 10 ? 'bg-green-500' : 'bg-red-500') : 
                  'bg-blue-500'
              }`}></div>
              <div className="text-xs font-bold text-blue-600 mt-6 text-center whitespace-nowrap">
                Ta réponse
              </div>
            </div>
          )}
        </div>
        
        {/* Indications animées */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">
            {animationPhase === 0 && "Sélectionne une fraction ci-dessus"}
            {animationPhase === 1 && "Commençons par décomposer l'unité..."}
            {animationPhase === 2 && "Je divise l'unité en parties égales..."}
            {animationPhase === 3 && "Important : toutes les parties font 1 unité !"}
            {animationPhase === 4 && "Je choisis le nombre de parties nécessaires..."}
            {animationPhase === 5 && "Maintenant, regardons la droite graduée..."}
            {animationPhase === 6 && "Je compte les parties depuis 0..."}
            {animationPhase === 7 && "Voici la position de la fraction !"}
          </div>
          {animationPhase >= 5 && (
            <div className="text-xs text-gray-700 animate-fade-in-up">
              Chaque unité est divisée en {fraction.den} parties égales
            </div>
          )}
        </div>
      </div>
    );
  };

  // useEffect pour déclencher l'animation de correction
  useEffect(() => {
    if (showAnswer) {
      animateCorrection();
    }
  }, [showAnswer]);

  // Fonction d'animation de correction
  const animateCorrection = async () => {
    setIsCorrectAnimating(true);
    setCorrectAnimationStep(0);
    
    // Étape 1 : Analyser la fraction
    setCorrectAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 2 : Diviser l'unité
    setCorrectAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 3 : Compter les parties
    setCorrectAnimationStep(3);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 4 : Placer la fraction
    setCorrectAnimationStep(4);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsCorrectAnimating(false);
  };

  // Fonction pour générer l'explication de placement avec animation
  const renderPlacementExplanation = () => {
    const exercise = getCurrentExercise();
    const fraction = exercise.fraction;
    const correctAnswer = exercise.options.find(opt => opt.correct);
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
        <div className="text-center mb-4">
          <h4 className="font-bold text-blue-800 mb-3">💡 Explication :</h4>
        </div>

        <div className="space-y-3">
          {/* Analyse de la fraction */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="font-semibold text-yellow-800 mb-2">Analyse de la fraction</div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                {renderMathFraction(fraction.num, fraction.den, 'medium')}
              </div>
              <div className="text-yellow-700 text-sm">
                <div>• Numérateur : {fraction.num} (nombre de parties à compter)</div>
                <div>• Dénominateur : {fraction.den} (nombre de parties dans une unité)</div>
              </div>
            </div>
          </div>

          {/* Calcul de la position */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="font-semibold text-green-800 mb-2">Calcul de la position</div>
            <div className="text-center">
              <div className="text-green-700 text-sm mb-2">
                {fraction.num} ÷ {fraction.den} = {(fraction.num / fraction.den).toFixed(3)}
              </div>
              <div className="text-green-600 font-medium">
                La fraction se situe donc à la position {correctAnswer?.position}
              </div>
            </div>
          </div>

          {/* Méthode générale */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="font-semibold text-purple-800 mb-2">Méthode générale</div>
            <div className="text-center">
              <div className="text-purple-700 text-sm space-y-1">
                <div>1. Divise chaque unité en {fraction.den} parties égales</div>
                <div>2. Compte {fraction.num} parties depuis 0</div>
                <div>3. La fraction {fraction.num}/{fraction.den} = {(fraction.num / fraction.den).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction d'animation améliorée
  const animateDemonstration = async () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Étape 1 : Montrer la décomposition de l'unité
    setAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 2 : Diviser l'unité en parties
    setAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, selectedFraction.den * 200 + 1000));
    
    // Étape 3 : Montrer que toutes les parties font 1 unité
    setAnimationStep(3);
    await new Promise(resolve => setTimeout(resolve, selectedFraction.den * 200 + 1500));
    
    // Étape 4 : Prendre le nombre de parties nécessaires
    setAnimationStep(4);
    await new Promise(resolve => setTimeout(resolve, selectedFraction.num * 200 + 1000));
    
    // Étape 5 : Passer à la droite graduée
    setAnimationStep(5);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 6 : Compter les parties sur la droite
    setAnimationStep(6);
    await new Promise(resolve => setTimeout(resolve, selectedFraction.num * 300 + 1000));
    
    // Étape 7 : Placer la fraction finale
    setAnimationStep(7);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnimating(false);
  };

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    if (selectedOption === null) return;
    
    const correct = exercise.options[selectedOption].correct;
    
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedOption(null);
      setShowAnswer(false);
      setIsCorrect(false);
      setShowHelp(false);
      setCorrectAnimationStep(0);
      setIsCorrectAnimating(false);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
    setShowHelp(false);
    setCorrectAnimationStep(0);
    setIsCorrectAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/chapitre/cm1-fractions-equivalentes" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Représenter des fractions sur une droite</h1>
            <p className="text-gray-600 mt-2">Apprendre à placer les fractions sur une droite graduée</p>
          </div>
        </div>

        {/* Section Cours */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">📚 Comment placer une fraction sur une droite ?</h2>
          </div>
          
          <div className="mb-6">
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-purple-800 mb-2">📝 La méthode :</h3>
              <div className="space-y-3">
                <div className="bg-blue-100 rounded-lg p-3">
                  <h4 className="font-bold text-blue-800">1. Je regarde le dénominateur</h4>
                  <p className="text-blue-700 text-sm">Il m'indique en combien de parties égales je dois diviser chaque unité</p>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <h4 className="font-bold text-green-800">2. Je divise la droite</h4>
                  <p className="text-green-700 text-sm">Chaque segment entre deux nombres entiers est divisé selon le dénominateur</p>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <h4 className="font-bold text-orange-800">3. Je compte les parties</h4>
                  <p className="text-orange-700 text-sm">Le numérateur m'indique combien de parties je dois compter depuis 0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Démonstration interactive */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              ✨ Démonstration interactive
            </h3>
            
            {/* Sélecteur de fraction */}
            <div className="mb-6 text-center">
              <h4 className="font-bold text-gray-700 mb-3">Choisis une fraction :</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { num: 1, den: 2 }, { num: 3, den: 4 }, { num: 2, den: 3 }, { num: 5, den: 4 }
                ].map((frac, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFraction(frac)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFraction.num === frac.num && selectedFraction.den === frac.den
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300 bg-white'
                    }`}
                  >
                    {renderMathFraction(frac.num, frac.den, 'medium')}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualisation de la droite */}
            <div className="mb-6">
              {renderNumberLine(selectedFraction, false, null, animationStep)}
            </div>

            {/* Explication étape par étape avec animations */}
            {animationStep >= 1 && (
              <div className="bg-white rounded-lg p-4 border-2 border-purple-300 mb-4 animate-fade-in-up">
                <div className="text-center">
                  <h4 className="font-bold text-purple-800 mb-2">🎯 Fraction sélectionnée :</h4>
                  <div className="flex justify-center mb-2">
                    {renderMathFraction(selectedFraction.num, selectedFraction.den, 'large')}
                  </div>
                  <div className="text-gray-700 text-sm">
                    Numérateur : {selectedFraction.num} (parties à compter) | Dénominateur : {selectedFraction.den} (division de l'unité)
                  </div>
                  <div className="text-purple-600 text-sm mt-2">
                    Regardons d'abord comment décomposer l'unité !
                  </div>
                </div>
              </div>
            )}

            {animationStep >= 2 && (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4 animate-fade-in-up">
                <div className="text-center">
                  <h4 className="font-bold text-purple-800 mb-2">🔧 Décomposition de l'unité :</h4>
                  <div className="text-purple-700 mb-2">
                    L'unité 1 est divisée en {selectedFraction.den} parties égales
                  </div>
                  <div className="text-purple-600 text-sm">
                    Chaque partie vaut 1/{selectedFraction.den}
                  </div>
                </div>
              </div>
            )}

            {animationStep >= 3 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4 animate-fade-in-up">
                <div className="text-center">
                  <h4 className="font-bold text-green-800 mb-2">✅ Sélection des parties :</h4>
                  <div className="text-green-700 mb-2">
                    Je prends {selectedFraction.num} {selectedFraction.num === 1 ? 'partie' : 'parties'} sur {selectedFraction.den}
                  </div>
                  <div className="text-green-600 text-sm">
                    Cela forme la fraction {selectedFraction.num}/{selectedFraction.den}
                  </div>
                </div>
              </div>
            )}

            {animationStep >= 4 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4 animate-fade-in-up">
                <div className="text-center">
                  <h4 className="font-bold text-blue-800 mb-2">📏 Droite graduée :</h4>
                  <div className="text-blue-700 mb-2">
                    Maintenant, reportons cette fraction sur la droite graduée
                  </div>
                  <div className="text-blue-600 text-sm">
                    Regarde les petites graduations violettes qui apparaissent !
                  </div>
                </div>
              </div>
            )}

            {animationStep >= 5 && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-4 animate-fade-in-up">
                <div className="text-center">
                  <h4 className="font-bold text-yellow-800 mb-2">📊 Comptage :</h4>
                  <div className="text-yellow-700 mb-2">
                    Je compte {selectedFraction.num} parties de taille 1/{selectedFraction.den}
                  </div>
                  <div className="text-yellow-600 text-sm">
                    Les cercles jaunes numérotés montrent le comptage depuis 0
                  </div>
                </div>
              </div>
            )}

            {animationStep >= 6 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-4 animate-fade-in-up">
                <div className="text-center">
                  <h4 className="font-bold text-red-800 mb-2">🎯 Position finale :</h4>
                  <div className="text-red-700 mb-2">
                    La fraction {selectedFraction.num}/{selectedFraction.den} se trouve à la position {(selectedFraction.num / selectedFraction.den).toFixed(2)}
                  </div>
                  <div className="text-red-600 text-sm mb-3">
                    Le point rouge qui rebondit montre la position exacte !
                  </div>
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <div className="text-green-800 font-bold text-sm">
                      🎉 Bravo ! Tu as compris comment placer une fraction sur une droite !
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={animateDemonstration}
                disabled={isAnimating}
                className={`flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors mx-auto ${
                  !isAnimating && animationStep === 0 ? 'animate-pulse-subtle' : ''
                }`}
              >
                <Sparkles className="w-5 h-5" />
                {isAnimating ? 'Animation en cours...' : animationStep === 0 ? 'Voir la méthode ✨' : 'Recommencer l\'animation'}
              </button>
            </div>
          </div>
        </div>

        {/* Exercices pratiques */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Exercices pratiques</h2>
            <div className="ml-auto flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-700">{score}/{attempts}</span>
            </div>
          </div>

          {currentExercise < exercises.length ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Exercice {currentExercise + 1} sur {exercises.length}
                </div>
                <div className="text-lg font-medium text-gray-800">
                  {getCurrentExercise().question}
                </div>
                <div className="mt-4">
                  {renderMathFraction(getCurrentExercise().fraction.num, getCurrentExercise().fraction.den, 'large')}
                </div>
              </div>

              {/* Droite graduée interactive */}
              <div className="my-8">
                {renderNumberLine(getCurrentExercise().fraction, showAnswer, null)}
              </div>

              {/* Options de QCM avec droites graduées */}
              <div className="my-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choisis la bonne droite graduée :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {getCurrentExercise().options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedOption(index)}
                      disabled={showAnswer}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedOption === index
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      } ${
                        showAnswer && option.correct
                          ? 'border-green-500 bg-green-50'
                          : showAnswer && selectedOption === index && !option.correct
                          ? 'border-red-500 bg-red-50'
                          : ''
                      } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="space-y-3">
                        {/* Indicateur de sélection */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === index
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedOption === index && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Option {String.fromCharCode(65 + index)}
                          </span>
                          {showAnswer && option.correct && (
                            <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                          )}
                          {showAnswer && selectedOption === index && !option.correct && (
                            <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                          )}
                        </div>
                        
                        {/* Droite graduée miniature */}
                        {renderMiniNumberLine(
                          getCurrentExercise().fraction,
                          option.position,
                          selectedOption === index,
                          option.correct,
                          showAnswer
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

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
                  disabled={selectedOption === null || showAnswer}
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
                    <div>• Regarde le dénominateur : {getCurrentExercise().fraction.den}</div>
                    <div>• Divise chaque unité en {getCurrentExercise().fraction.den} parties égales</div>
                    <div>• Compte {getCurrentExercise().fraction.num} parties depuis 0</div>
                    <div>• La fraction {getCurrentExercise().fraction.num}/{getCurrentExercise().fraction.den} = {(getCurrentExercise().fraction.num / getCurrentExercise().fraction.den).toFixed(2)}</div>
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
                  
                  {renderPlacementExplanation()}
                  
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