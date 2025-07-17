'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, ChevronRight } from 'lucide-react';

export default function ComparerFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // États pour la démonstration animée
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedComparison, setSelectedComparison] = useState({ frac1: { num: 2, den: 5 }, frac2: { num: 3, den: 5 } });
  
  // États pour l'animation de correction
  const [correctAnimationStep, setCorrectAnimationStep] = useState(0);
  const [isCorrectAnimating, setIsCorrectAnimating] = useState(false);

  const exercises = [
    // Cas 1: Même dénominateur
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 2, den: 5 },
      fraction2: { num: 3, den: 5 },
      options: ['2/5 < 3/5', '2/5 > 3/5', '2/5 = 3/5'],
      answer: '2/5 < 3/5',
      type: 'same-denominator'
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 1, den: 4 },
      fraction2: { num: 3, den: 4 },
      options: ['1/4 < 3/4', '1/4 > 3/4', '1/4 = 3/4'],
      answer: '1/4 < 3/4',
      type: 'same-denominator'
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 4, den: 7 },
      fraction2: { num: 2, den: 7 },
      options: ['4/7 < 2/7', '4/7 > 2/7', '4/7 = 2/7'],
      answer: '4/7 > 2/7',
      type: 'same-denominator'
    },
    // Cas 2: Dénominateurs différents - une seule transformation
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 1, den: 2 },
      fraction2: { num: 2, den: 6 },
      options: ['1/2 < 2/6', '1/2 > 2/6', '1/2 = 2/6'],
      answer: '1/2 = 2/6',
      type: 'different-denominators',
      transform: { 
        fractionToTransform: 1, // transformer fraction1
        multiplier: 3,
        targetDenominator: 6
      }
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 2, den: 3 },
      fraction2: { num: 6, den: 9 },
      options: ['2/3 < 6/9', '2/3 > 6/9', '2/3 = 6/9'],
      answer: '2/3 = 6/9',
      type: 'different-denominators',
      transform: { 
        fractionToTransform: 1, // transformer fraction1
        multiplier: 3,
        targetDenominator: 9
      }
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 3, den: 8 },
      fraction2: { num: 1, den: 4 },
      options: ['3/8 < 1/4', '3/8 > 1/4', '3/8 = 1/4'],
      answer: '3/8 > 1/4',
      type: 'different-denominators',
      transform: { 
        fractionToTransform: 2, // transformer fraction2
        multiplier: 2,
        targetDenominator: 8
      }
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 5, den: 9 },
      fraction2: { num: 2, den: 9 },
      options: ['5/9 < 2/9', '5/9 > 2/9', '5/9 = 2/9'],
      answer: '5/9 > 2/9',
      type: 'same-denominator'
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 1, den: 3 },
      fraction2: { num: 4, den: 12 },
      options: ['1/3 < 4/12', '1/3 > 4/12', '1/3 = 4/12'],
      answer: '1/3 = 4/12',
      type: 'different-denominators',
      transform: { 
        fractionToTransform: 1, // transformer fraction1
        multiplier: 4,
        targetDenominator: 12
      }
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 3, den: 8 },
      fraction2: { num: 7, den: 8 },
      options: ['3/8 < 7/8', '3/8 > 7/8', '3/8 = 7/8'],
      answer: '3/8 < 7/8',
      type: 'same-denominator'
    },
    // Cas 3: Même numérateur
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 3, den: 4 },
      fraction2: { num: 3, den: 7 },
      options: ['3/4 < 3/7', '3/4 > 3/7', '3/4 = 3/7'],
      answer: '3/4 > 3/7',
      type: 'same-numerator'
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 2, den: 5 },
      fraction2: { num: 2, den: 3 },
      options: ['2/5 < 2/3', '2/5 > 2/3', '2/5 = 2/3'],
      answer: '2/5 < 2/3',
      type: 'same-numerator'
    },
    {
      question: 'Compare ces fractions :',
      fraction1: { num: 5, den: 8 },
      fraction2: { num: 5, den: 6 },
      options: ['5/8 < 5/6', '5/8 > 5/6', '5/8 = 5/6'],
      answer: '5/8 < 5/6',
      type: 'same-numerator'
    },
    // Cas 4: Fraction et nombre entier
    {
      question: 'Compare une fraction et un nombre entier :',
      fraction1: { num: 3, den: 4 },
      fraction2: { num: 1, den: 1 },
      options: ['3/4 < 1', '3/4 > 1', '3/4 = 1'],
      answer: '3/4 < 1',
      type: 'integer-comparison',
      integerPosition: 2 // le nombre entier est en position 2
    },
    {
      question: 'Compare un nombre entier et une fraction :',
      fraction1: { num: 2, den: 1 },
      fraction2: { num: 5, den: 3 },
      options: ['2 < 5/3', '2 > 5/3', '2 = 5/3'],
      answer: '2 > 5/3',
      type: 'integer-comparison',
      integerPosition: 1 // le nombre entier est en position 1
    },
    {
      question: 'Compare ces valeurs :',
      fraction1: { num: 7, den: 4 },
      fraction2: { num: 2, den: 1 },
      options: ['7/4 < 2', '7/4 > 2', '7/4 = 2'],
      answer: '7/4 < 2',
      type: 'integer-comparison',
      integerPosition: 2
    },
    {
      question: 'Compare ces valeurs :',
      fraction1: { num: 3, den: 1 },
      fraction2: { num: 4, den: 5 },
      options: ['3 < 4/5', '3 > 4/5', '3 = 4/5'],
      answer: '3 > 4/5',
      type: 'integer-comparison',
      integerPosition: 1
    },
    {
      question: 'Compare ces valeurs :',
      fraction1: { num: 5, den: 2 },
      fraction2: { num: 3, den: 1 },
      options: ['5/2 < 3', '5/2 > 3', '5/2 = 3'],
      answer: '5/2 < 3',
      type: 'integer-comparison',
      integerPosition: 2
    }
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  // Fonction pour rendre une fraction en format mathématique
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
    
    // Si le dénominateur est 1, afficher seulement le numérateur (nombre entier)
    if (den === 1) {
      return (
        <div className={`font-bold text-blue-600 leading-none ${sizeClasses[size]}`}>{num}</div>
      );
    }
    
    return (
      <div className="text-center">
        <div className={`font-bold text-blue-600 leading-none ${sizeClasses[size]}`}>{num}</div>
        <div className={`bg-gray-400 mx-auto my-1 rounded ${lineClasses[size]}`}></div>
        <div className={`font-bold text-purple-600 leading-none ${sizeClasses[size]}`}>{den}</div>
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
    
    // Étape 1 : Analyser les dénominateurs
    setCorrectAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 2 : Appliquer la méthode appropriée
    setCorrectAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 3 : Conclusion
    setCorrectAnimationStep(3);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsCorrectAnimating(false);
  };

  // Fonction pour calculer le PPCM (Plus Petit Commun Multiple)
  const ppcm = (a: number, b: number) => {
    const pgcd = (x: number, y: number): number => y === 0 ? x : pgcd(y, x % y);
    return (a * b) / pgcd(a, b);
  };

  // Fonction pour générer l'explication de comparaison avec animation
  const renderComparisonExplanation = () => {
    const exercise = getCurrentExercise();
    const frac1 = exercise.fraction1;
    const frac2 = exercise.fraction2;
    
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
        <div className="text-center mb-4">
          <h4 className="font-bold text-blue-800 mb-3">🔍 Méthode de comparaison :</h4>
        </div>

        {/* Étape 1 : Analyser les dénominateurs */}
        {correctAnimationStep >= 1 && (
          <div className="mb-4 animate-fade-in-up">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="font-semibold text-yellow-800 mb-2">Étape 1 : J'analyse les fractions</div>
              <div className="flex items-center justify-center gap-6">
                {renderMathFraction(frac1.num, frac1.den, 'small')}
                <span className="text-2xl">?</span>
                {renderMathFraction(frac2.num, frac2.den, 'small')}
              </div>
              <div className="text-center mt-2 text-yellow-700">
                {exercise.type === 'same-denominator' ? 
                  `✅ Même dénominateur (${frac1.den})` : 
                  exercise.type === 'same-numerator' ?
                  `✅ Même numérateur (${frac1.num})` :
                  exercise.type === 'integer-comparison' ?
                  `🔢 Comparaison avec un nombre entier` :
                  `❌ Dénominateurs différents (${frac1.den} et ${frac2.den})`
                }
              </div>
            </div>
          </div>
        )}

        {/* Étape 2 : Appliquer la méthode appropriée */}
        {correctAnimationStep >= 2 && (
          <div className="mb-4 animate-fade-in-up">
            {exercise.type === 'same-denominator' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="font-semibold text-green-800 mb-2">Étape 2 : Même dénominateur → Je compare les numérateurs</div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-xl font-bold text-blue-600">{frac1.num}</span>
                    <span className="text-xl">
                      {frac1.num > frac2.num ? '>' : frac1.num < frac2.num ? '<' : '='}
                    </span>
                    <span className="text-xl font-bold text-blue-600">{frac2.num}</span>
                  </div>
                  <div className="text-green-700">
                    Plus le numérateur est grand, plus la fraction est grande
                  </div>
                </div>
              </div>
            )}

            {exercise.type === 'same-numerator' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="font-semibold text-green-800 mb-2">Étape 2 : Même numérateur → Je compare les dénominateurs</div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-xl font-bold text-purple-600">{frac1.den}</span>
                    <span className="text-xl">
                      {frac1.den > frac2.den ? '>' : frac1.den < frac2.den ? '<' : '='}
                    </span>
                    <span className="text-xl font-bold text-purple-600">{frac2.den}</span>
                  </div>
                  <div className="text-green-700 text-sm">
                    Avec le même numérateur, plus le dénominateur est grand, plus la fraction est petite
                  </div>
                  <div className="text-green-700 font-semibold mt-2">
                    Donc : {frac1.den > frac2.den ? 
                      `${frac1.num}/${frac1.den} < ${frac2.num}/${frac2.den}` : 
                      frac1.den < frac2.den ? 
                      `${frac1.num}/${frac1.den} > ${frac2.num}/${frac2.den}` : 
                      `${frac1.num}/${frac1.den} = ${frac2.num}/${frac2.den}`
                    }
                  </div>
                </div>
              </div>
            )}

            {exercise.type === 'different-denominators' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="font-semibold text-green-800 mb-2">Étape 2 : Dénominateurs différents → Je transforme une fraction</div>
                <div className="space-y-3">
                  {(() => {
                    const transform = (exercise as any).transform;
                    const fractionToTransform = transform.fractionToTransform;
                    const multiplier = transform.multiplier;
                    const targetDenominator = transform.targetDenominator;
                    
                    let transformedFrac1 = frac1;
                    let transformedFrac2 = frac2;
                    
                    if (fractionToTransform === 1) {
                      transformedFrac1 = { num: frac1.num * multiplier, den: targetDenominator };
                    } else {
                      transformedFrac2 = { num: frac2.num * multiplier, den: targetDenominator };
                    }
                    
                    return (
                      <>
                        <div className="text-center mb-3">
                          <div className="text-green-700 font-semibold mb-2">
                            Je transforme la {fractionToTransform === 1 ? 'première' : 'deuxième'} fraction en multipliant par {multiplier}
                          </div>
                          <div className="bg-yellow-100 rounded-lg p-3 inline-block">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {fractionToTransform === 1 ? (
                                <>
                                  {renderMathFraction(frac1.num, frac1.den, 'small')}
                                  <span>=</span>
                                  {renderMathFraction(transformedFrac1.num, transformedFrac1.den, 'small')}
                                </>
                              ) : (
                                <>
                                  {renderMathFraction(frac2.num, frac2.den, 'small')}
                                  <span>=</span>
                                  {renderMathFraction(transformedFrac2.num, transformedFrac2.den, 'small')}
                                </>
                              )}
                            </div>
                            <div className="text-xs text-yellow-700">
                              {fractionToTransform === 1 ? 
                                `${frac1.num} × ${multiplier} = ${transformedFrac1.num}` :
                                `${frac2.num} × ${multiplier} = ${transformedFrac2.num}`
                              }
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-700 font-semibold">
                            Maintenant je compare : {transformedFrac1.num} {transformedFrac1.num > transformedFrac2.num ? '>' : transformedFrac1.num < transformedFrac2.num ? '<' : '='} {transformedFrac2.num}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {exercise.type === 'integer-comparison' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="font-semibold text-green-800 mb-2">Étape 2 : Avec un nombre entier → Je transforme le nombre entier en fraction</div>
                <div className="space-y-3">
                  {(() => {
                    const integerPosition = (exercise as any).integerPosition;
                    const integerFraction = integerPosition === 1 ? frac1 : frac2;
                    const regularFraction = integerPosition === 1 ? frac2 : frac1;
                    
                    return (
                      <>
                                                 <div className="text-center mb-3">
                           <div className="text-green-700 font-semibold mb-2">
                             Je transforme le nombre entier {integerFraction.num} en fraction
                           </div>
                           <div className="bg-yellow-100 rounded-lg p-3 inline-block">
                             <div className="flex items-center justify-center gap-2 mb-1">
                               <span className="text-xl font-bold text-blue-600">{integerFraction.num}</span>
                               <span>=</span>
                               {renderMathFraction(integerFraction.num, 1, 'small')}
                             </div>
                             <div className="text-xs text-yellow-700">
                               Un nombre entier = ce nombre sur 1
                             </div>
                           </div>
                         </div>
                         <div className="text-center mb-3">
                           <div className="text-green-700 font-semibold mb-2">
                             Puis je mets au même dénominateur ({regularFraction.den})
                           </div>
                           <div className="bg-pink-100 rounded-lg p-3 inline-block">
                             <div className="flex items-center justify-center gap-2 mb-1">
                               {renderMathFraction(integerFraction.num, 1, 'small')}
                               <span>=</span>
                               {renderMathFraction(integerFraction.num * regularFraction.den, regularFraction.den, 'small')}
                             </div>
                             <div className="text-xs text-pink-700">
                               Je multiplie par {regularFraction.den} : {integerFraction.num} × {regularFraction.den} = {integerFraction.num * regularFraction.den}
                             </div>
                           </div>
                         </div>
                        <div className="text-center">
                          <div className="text-green-700 font-semibold">
                            Maintenant je compare : {integerFraction.num * regularFraction.den} {integerFraction.num * regularFraction.den > regularFraction.num ? '>' : integerFraction.num * regularFraction.den < regularFraction.num ? '<' : '='} {regularFraction.num}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            ({integerFraction.num} × {regularFraction.den} = {integerFraction.num * regularFraction.den})
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Étape 3 : Conclusion */}
        {correctAnimationStep >= 3 && (
          <div className="animate-fade-in-up">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="text-center">
                <div className="font-bold text-green-800 text-lg mb-2">✅ Conclusion :</div>
                <div className="flex items-center justify-center gap-4">
                  {renderMathFraction(frac1.num, frac1.den, 'medium')}
                  <span className="text-3xl font-bold text-green-600">
                    {(() => {
                      if (exercise.type === 'same-denominator') {
                        return frac1.num > frac2.num ? '>' : frac1.num < frac2.num ? '<' : '=';
                      } else if (exercise.type === 'same-numerator') {
                        // Même numérateur : plus grand dénominateur = plus petite fraction
                        return frac1.den > frac2.den ? '<' : frac1.den < frac2.den ? '>' : '=';
                      } else if (exercise.type === 'integer-comparison') {
                        // Pour les nombres entiers, on compare en multipliant par le dénominateur
                        const integerPosition = (exercise as any).integerPosition;
                        const integerFraction = integerPosition === 1 ? frac1 : frac2;
                        const regularFraction = integerPosition === 1 ? frac2 : frac1;
                        const integerValue = integerFraction.num * regularFraction.den;
                        
                        if (integerPosition === 1) {
                          return integerValue > regularFraction.num ? '>' : integerValue < regularFraction.num ? '<' : '=';
                        } else {
                          return regularFraction.num > integerValue ? '>' : regularFraction.num < integerValue ? '<' : '=';
                        }
                      } else {
                        const transform = (exercise as any).transform;
                        let transformedFrac1 = frac1;
                        let transformedFrac2 = frac2;
                        
                        if (transform.fractionToTransform === 1) {
                          transformedFrac1 = { num: frac1.num * transform.multiplier, den: transform.targetDenominator };
                        } else {
                          transformedFrac2 = { num: frac2.num * transform.multiplier, den: transform.targetDenominator };
                        }
                        
                        return transformedFrac1.num > transformedFrac2.num ? '>' : transformedFrac1.num < transformedFrac2.num ? '<' : '=';
                      }
                    })()}
                  </span>
                  {renderMathFraction(frac2.num, frac2.den, 'medium')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFractionVisual = (numerator: number, denominator: number, color = '#fbbf24', size = 'normal') => {
    const sizeClass = size === 'small' ? 'w-5 h-7' : 'w-8 h-12';
    const parts = Array.from({ length: denominator }, (_, i) => i);
    
    return (
      <div className="flex flex-col items-center space-y-2 p-3">
        <div className="flex justify-center gap-1">
          {parts.map((part) => (
            <div
              key={part}
              className={`${sizeClass} border-2 border-gray-400 ${
                part < numerator ? '' : 'bg-gray-100'
              }`}
              style={{ backgroundColor: part < numerator ? color : '#f3f4f6' }}
            />
          ))}
        </div>
        <div className="flex justify-center">
          {renderMathFraction(numerator, denominator, 'small')}
        </div>
      </div>
    );
  };

  const compareFractions = (frac1: { num: number, den: number }, frac2: { num: number, den: number }) => {
    // Convertir en décimales pour comparaison
    const val1 = frac1.num / frac1.den;
    const val2 = frac2.num / frac2.den;
    
    if (val1 > val2) return '>';
    if (val1 < val2) return '<';
    return '=';
  };

  const getComparisonMethod = (frac1: { num: number, den: number }, frac2: { num: number, den: number }) => {
    if (frac1.den === frac2.den) {
      return {
        method: 'same-denominator',
        description: 'Même dénominateur : je compare les numérateurs',
        detail: `${frac1.num} ${frac1.num > frac2.num ? '>' : frac1.num < frac2.num ? '<' : '='} ${frac2.num}`
      };
    } else if (frac1.num === frac2.num) {
      return {
        method: 'same-numerator',
        description: 'Même numérateur : je compare les dénominateurs',
        detail: `${frac1.den} ${frac1.den > frac2.den ? '>' : frac1.den < frac2.den ? '<' : '='} ${frac2.den}`,
        conclusion: `Plus grand dénominateur = plus petite fraction`
      };
    } else {
      // Chercher un dénominateur commun simple
      const commonDen = frac1.den * frac2.den;
      const newNum1 = frac1.num * frac2.den;
      const newNum2 = frac2.num * frac1.den;
      
      return {
        method: 'common-denominator',
        description: 'Dénominateurs différents : je trouve un dénominateur commun',
        detail: `${frac1.num}/${frac1.den} = ${newNum1}/${commonDen} et ${frac2.num}/${frac2.den} = ${newNum2}/${commonDen}`,
        comparison: `${newNum1} ${newNum1 > newNum2 ? '>' : newNum1 < newNum2 ? '<' : '='} ${newNum2}`
      };
    }
  };

  const renderComparisonDetail = (frac1: { num: number, den: number }, frac2: { num: number, den: number }) => {
    if (frac1.den === frac2.den) {
      return (
        <div className="flex items-center justify-center gap-3">
          <span className="text-xl font-bold text-blue-600">{frac1.num}</span>
          <span className="text-xl">
            {frac1.num > frac2.num ? '>' : frac1.num < frac2.num ? '<' : '='}
          </span>
          <span className="text-xl font-bold text-blue-600">{frac2.num}</span>
        </div>
      );
    } else if (frac1.num === frac2.num) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl font-bold text-purple-600">{frac1.den}</span>
            <span className="text-xl">
              {frac1.den > frac2.den ? '>' : frac1.den < frac2.den ? '<' : '='}
            </span>
            <span className="text-xl font-bold text-purple-600">{frac2.den}</span>
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            Plus grand dénominateur = plus petite fraction
          </div>
        </div>
      );
    } else {
      const commonDen = frac1.den * frac2.den;
      const newNum1 = frac1.num * frac2.den;
      const newNum2 = frac2.num * frac1.den;
      
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            {renderMathFraction(frac1.num, frac1.den, 'small')}
            <span>=</span>
            {renderMathFraction(newNum1, commonDen, 'small')}
            <span className="mx-2">et</span>
            {renderMathFraction(frac2.num, frac2.den, 'small')}
            <span>=</span>
            {renderMathFraction(newNum2, commonDen, 'small')}
          </div>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-xl font-bold text-blue-600">{newNum1}</span>
            <span className="text-xl">
              {newNum1 > newNum2 ? '>' : newNum1 < newNum2 ? '<' : '='}
            </span>
            <span className="text-xl font-bold text-blue-600">{newNum2}</span>
          </div>
        </div>
      );
    }
  };

  const animateComparison = async () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Étape 1 : Montrer les fractions
    setAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 2 : Identifier la méthode
    setAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 3 : Appliquer la méthode
    setAnimationStep(3);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 4 : Conclusion
    setAnimationStep(4);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsAnimating(false);
  };

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    const correct = userAnswer === exercise.answer;
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
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);
      setShowHelp(false);
      setCorrectAnimationStep(0);
      setIsCorrectAnimating(false);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
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
            <h1 className="text-3xl font-bold text-gray-800">Comparer des fractions</h1>
            <p className="text-gray-600 mt-2">Apprendre à ordonner et comparer les fractions</p>
          </div>
        </div>

        {/* Section Cours */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Book className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">📚 Comment comparer des fractions ?</h2>
          </div>
          
          <div className="mb-6">
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-purple-800 mb-2">📝 Les 4 méthodes :</h3>
              <div className="space-y-3">
                <div className={`rounded-lg p-3 ${getCurrentExercise().type === 'same-denominator' ? 'bg-blue-200 border-2 border-blue-500' : 'bg-blue-100'}`}>
                  <h4 className="font-bold text-blue-800">1. Même dénominateur</h4>
                  <p className="text-blue-700 text-sm">Je compare les numérateurs : le plus grand numérateur = la plus grande fraction</p>
                </div>
                <div className={`rounded-lg p-3 ${getCurrentExercise().type === 'same-numerator' ? 'bg-green-200 border-2 border-green-500' : 'bg-green-100'}`}>
                  <h4 className="font-bold text-green-800">2. Même numérateur</h4>
                  <p className="text-green-700 text-sm">Je compare les dénominateurs : le plus grand dénominateur = la plus petite fraction</p>
                </div>
                <div className={`rounded-lg p-3 ${getCurrentExercise().type === 'different-denominators' ? 'bg-orange-200 border-2 border-orange-500' : 'bg-orange-100'}`}>
                  <h4 className="font-bold text-orange-800">3. Dénominateurs différents</h4>
                  <p className="text-orange-700 text-sm">Je transforme pour avoir le même dénominateur, puis je compare les numérateurs</p>
                </div>
                <div className={`rounded-lg p-3 ${getCurrentExercise().type === 'integer-comparison' ? 'bg-purple-200 border-2 border-purple-500' : 'bg-purple-100'}`}>
                  <h4 className="font-bold text-purple-800">4. Avec un nombre entier</h4>
                  <p className="text-purple-700 text-sm">Je transforme le nombre entier en fraction (2 = 2/1), puis je mets au même dénominateur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Démonstration interactive */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              ✨ Démonstration interactive
            </h3>
            
            {/* Sélecteur de comparaison */}
            <div className="mb-6 text-center">
              <h4 className="font-bold text-gray-700 mb-3">Choisis une comparaison :</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { frac1: { num: 2, den: 5 }, frac2: { num: 3, den: 5 }, label: 'Même dénominateur' },
                  { frac1: { num: 3, den: 4 }, frac2: { num: 3, den: 7 }, label: 'Même numérateur' },
                  { frac1: { num: 1, den: 3 }, frac2: { num: 2, den: 6 }, label: 'Différents' }
                ].map((comp, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedComparison(comp)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedComparison.frac1.num === comp.frac1.num && 
                      selectedComparison.frac1.den === comp.frac1.den &&
                      selectedComparison.frac2.num === comp.frac2.num && 
                      selectedComparison.frac2.den === comp.frac2.den
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {renderMathFraction(comp.frac1.num, comp.frac1.den, 'small')}
                      <span className="font-bold text-lg text-gray-800">vs</span>
                      {renderMathFraction(comp.frac2.num, comp.frac2.den, 'small')}
                    </div>
                    <div className="text-sm text-gray-600">{comp.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visualisation de la comparaison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col items-center space-y-4 bg-white rounded-lg p-4 border-2 border-purple-200">
                <h4 className="font-bold text-gray-700">Première fraction</h4>
                {renderFractionVisual(selectedComparison.frac1.num, selectedComparison.frac1.den, '#a855f7')}
              </div>
              <div className="flex flex-col items-center space-y-4 bg-white rounded-lg p-4 border-2 border-pink-200">
                <h4 className="font-bold text-gray-700">Deuxième fraction</h4>
                {renderFractionVisual(selectedComparison.frac2.num, selectedComparison.frac2.den, '#ec4899')}
              </div>
            </div>

            {/* Explication de la méthode */}
            {animationStep >= 2 && (
              <div className="bg-white rounded-lg p-4 border-2 border-purple-300 mb-4">
                <div className="text-center">
                  <h4 className="font-bold text-purple-800 mb-2">🔍 Méthode utilisée :</h4>
                  <div className="text-gray-700">
                    {getComparisonMethod(selectedComparison.frac1, selectedComparison.frac2).description}
                  </div>
                </div>
              </div>
            )}

            {/* Calcul détaillé */}
            {animationStep >= 3 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                <div className="text-center">
                  <h4 className="font-bold text-blue-800 mb-2">🧮 Calcul :</h4>
                  <div className="text-blue-700 font-medium">
                    {renderComparisonDetail(selectedComparison.frac1, selectedComparison.frac2)}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={animateComparison}
                disabled={isAnimating}
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors mx-auto"
              >
                <Sparkles className="w-5 h-5" />
                {isAnimating ? 'Animation en cours...' : 'Voir la méthode'}
              </button>
            </div>

            {/* Résultat */}
            {animationStep >= 4 && (
              <div className="mt-6 bg-white rounded-lg p-4 border-2 border-green-500">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-green-800 text-lg">Résultat :</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {selectedComparison.frac1.num}/{selectedComparison.frac1.den} {compareFractions(selectedComparison.frac1, selectedComparison.frac2)} {selectedComparison.frac2.num}/{selectedComparison.frac2.den}
                  </div>
                </div>
              </div>
            )}
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
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-lg font-medium text-gray-800">Compare ces fractions :</span>
                  {renderMathFraction(getCurrentExercise().fraction1.num, getCurrentExercise().fraction1.den, 'medium')}
                  <span className="text-2xl font-bold text-gray-700">?</span>
                  {renderMathFraction(getCurrentExercise().fraction2.num, getCurrentExercise().fraction2.den, 'medium')}
                </div>
              </div>

              {/* Visualisation des fractions à comparer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center space-y-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-700">Première fraction</h4>
                  {renderFractionVisual(getCurrentExercise().fraction1.num, getCurrentExercise().fraction1.den, '#a855f7')}
                </div>
                <div className="flex flex-col items-center space-y-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-700">Deuxième fraction</h4>
                  {renderFractionVisual(getCurrentExercise().fraction2.num, getCurrentExercise().fraction2.den, '#ec4899')}
                </div>
              </div>

              {/* Options de réponse */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {getCurrentExercise().options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setUserAnswer(option)}
                    className={`px-6 py-4 rounded-lg border-2 transition-all transform hover:scale-105 min-w-[160px] min-h-[120px] flex items-center justify-center ${
                      userAnswer === option
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {(() => {
                        // Parser l'option comme "2/5 < 3/5" ou "2/5 > 3/5" ou "2/5 = 3/5"
                        const parts = option.split(' ');
                        if (parts.length === 3) {
                          const [frac1, operator, frac2] = parts;
                          const [num1, den1] = frac1.split('/').map(Number);
                          const [num2, den2] = frac2.split('/').map(Number);
                          
                          return (
                            <>
                              {renderMathFraction(num1, den1, 'small')}
                              <span className="text-2xl font-bold text-gray-800">{operator}</span>
                              {renderMathFraction(num2, den2, 'small')}
                            </>
                          );
                        }
                        return <span className="text-center font-bold text-gray-800">{option}</span>;
                      })()}
                    </div>
                  </button>
                ))}
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
                  disabled={!userAnswer || showAnswer}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                >
                  Vérifier
                </button>
                
                {showAnswer && (
                  <button
                    onClick={nextExercise}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Suivant
                  </button>
                )}
              </div>

              {/* Aide */}
              {showHelp && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                    <span className="font-bold text-orange-800">Stratégie pour comparer :</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-orange-700 text-sm">
                    <li>Regarde les dénominateurs : sont-ils identiques ?</li>
                    <li>Si oui : compare les numérateurs</li>
                    <li>Regarde les numérateurs : sont-ils identiques ?</li>
                    <li>Si oui : plus le dénominateur est petit, plus la fraction est grande</li>
                    <li>Compare visuellement : quelle fraction colorie le plus de parts ?</li>
                  </ol>
                </div>
              )}

              {/* Résultat */}
              {showAnswer && (
                <div className={`p-4 rounded-lg border ${
                  isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct !' : `Incorrect - La bonne réponse est ${getCurrentExercise().answer}`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {renderComparisonExplanation()}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Excellent !</h3>
              <p className="text-gray-600 mb-4">
                Tu sais maintenant comparer les fractions ! Score : {score}/{attempts}
              </p>
              <button
                onClick={resetExercises}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Recommencer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}