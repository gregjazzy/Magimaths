'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, RotateCcw } from 'lucide-react';

export default function MultiplicationPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showDemo, setShowDemo] = useState(true);
  const [activeDemo, setActiveDemo] = useState('multiplication-2x2');
  const [animationStep, setAnimationStep] = useState(0);
  const [exerciseType, setExerciseType] = useState('2x2');
  
  // Type pour les exercices
  type ExerciseData = {
    id: number;
    number1: number;
    number2: number;
    answer: number;
    type: string;
    difficulty?: string;
    operation?: string;
  };
  
  const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>([]);

  // Exercices pour multiplication 2x2 (20 exercices)
  const exercises2x2: ExerciseData[] = [
    { id: 1, number1: 23, number2: 45, answer: 1035, type: '2x2' },
    { id: 2, number1: 34, number2: 56, answer: 1904, type: '2x2' },
    { id: 3, number1: 45, number2: 67, answer: 3015, type: '2x2' },
    { id: 4, number1: 56, number2: 78, answer: 4368, type: '2x2' },
    { id: 5, number1: 67, number2: 89, answer: 5963, type: '2x2' },
    { id: 6, number1: 78, number2: 91, answer: 7098, type: '2x2' },
    { id: 7, number1: 89, number2: 12, answer: 1068, type: '2x2' },
    { id: 8, number1: 91, number2: 23, answer: 2093, type: '2x2' },
    { id: 9, number1: 12, number2: 34, answer: 408, type: '2x2' },
    { id: 10, number1: 24, number2: 35, answer: 840, type: '2x2' },
    { id: 11, number1: 35, number2: 46, answer: 1610, type: '2x2' },
    { id: 12, number1: 46, number2: 57, answer: 2622, type: '2x2' },
    { id: 13, number1: 57, number2: 68, answer: 3876, type: '2x2' },
    { id: 14, number1: 68, number2: 79, answer: 5372, type: '2x2' },
    { id: 15, number1: 79, number2: 81, answer: 6399, type: '2x2' },
    { id: 16, number1: 81, number2: 92, answer: 7452, type: '2x2' },
    { id: 17, number1: 92, number2: 13, answer: 1196, type: '2x2' },
    { id: 18, number1: 13, number2: 24, answer: 312, type: '2x2' },
    { id: 19, number1: 25, number2: 36, answer: 900, type: '2x2' },
    { id: 20, number1: 36, number2: 47, answer: 1692, type: '2x2' }
  ];

  // Exercices pour multiplication 3x2 (20 exercices)
  const exercises3x2: ExerciseData[] = [
    { id: 21, number1: 123, number2: 45, answer: 5535, type: '3x2' },
    { id: 22, number1: 234, number2: 56, answer: 13104, type: '3x2' },
    { id: 23, number1: 345, number2: 67, answer: 23115, type: '3x2' },
    { id: 24, number1: 456, number2: 78, answer: 35568, type: '3x2' },
    { id: 25, number1: 567, number2: 89, answer: 50463, type: '3x2' },
    { id: 26, number1: 678, number2: 91, answer: 61698, type: '3x2' },
    { id: 27, number1: 789, number2: 12, answer: 9468, type: '3x2' },
    { id: 28, number1: 891, number2: 23, answer: 20493, type: '3x2' },
    { id: 29, number1: 912, number2: 34, answer: 31008, type: '3x2' },
    { id: 30, number1: 124, number2: 35, answer: 4340, type: '3x2' },
    { id: 31, number1: 235, number2: 46, answer: 10810, type: '3x2' },
    { id: 32, number1: 346, number2: 57, answer: 19722, type: '3x2' },
    { id: 33, number1: 457, number2: 68, answer: 31076, type: '3x2' },
    { id: 34, number1: 568, number2: 79, answer: 44872, type: '3x2' },
    { id: 35, number1: 679, number2: 81, answer: 54999, type: '3x2' },
    { id: 36, number1: 781, number2: 92, answer: 71852, type: '3x2' },
    { id: 37, number1: 892, number2: 13, answer: 11596, type: '3x2' },
    { id: 38, number1: 913, number2: 24, answer: 21912, type: '3x2' },
    { id: 39, number1: 125, number2: 36, answer: 4500, type: '3x2' },
    { id: 40, number1: 236, number2: 47, answer: 11092, type: '3x2' }
  ];

  // Exercices pour multiplication 3x3 (20 exercices)
  const exercises3x3: ExerciseData[] = [
    { id: 41, number1: 123, number2: 456, answer: 56088, type: '3x3' },
    { id: 42, number1: 234, number2: 567, answer: 132678, type: '3x3' },
    { id: 43, number1: 345, number2: 678, answer: 233910, type: '3x3' },
    { id: 44, number1: 456, number2: 789, answer: 359784, type: '3x3' },
    { id: 45, number1: 567, number2: 891, answer: 505197, type: '3x3' },
    { id: 46, number1: 678, number2: 912, answer: 618336, type: '3x3' },
    { id: 47, number1: 789, number2: 123, answer: 97047, type: '3x3' },
    { id: 48, number1: 891, number2: 234, answer: 208494, type: '3x3' },
    { id: 49, number1: 912, number2: 345, answer: 314640, type: '3x3' },
    { id: 50, number1: 124, number2: 356, answer: 44144, type: '3x3' },
    { id: 51, number1: 235, number2: 467, answer: 109745, type: '3x3' },
    { id: 52, number1: 346, number2: 578, answer: 199988, type: '3x3' },
    { id: 53, number1: 457, number2: 689, answer: 314873, type: '3x3' },
    { id: 54, number1: 568, number2: 791, answer: 449288, type: '3x3' },
    { id: 55, number1: 679, number2: 812, answer: 551348, type: '3x3' },
    { id: 56, number1: 781, number2: 923, answer: 720863, type: '3x3' },
    { id: 57, number1: 892, number2: 134, answer: 119528, type: '3x3' },
    { id: 58, number1: 913, number2: 245, answer: 223685, type: '3x3' },
    { id: 59, number1: 125, number2: 367, answer: 45875, type: '3x3' },
    { id: 60, number1: 236, number2: 478, answer: 112808, type: '3x3' }
  ];

  // Exercices pour multiplication avec décimaux (20 exercices)
  const exercicesDecimaux: ExerciseData[] = [
    { id: 61, number1: 12.5, number2: 3.4, answer: 42.5, type: 'decimal' },
    { id: 62, number1: 23.4, number2: 5.6, answer: 131.04, type: 'decimal' },
    { id: 63, number1: 34.5, number2: 6.7, answer: 231.15, type: 'decimal' },
    { id: 64, number1: 45.6, number2: 7.8, answer: 355.68, type: 'decimal' },
    { id: 65, number1: 56.7, number2: 8.9, answer: 504.63, type: 'decimal' },
    { id: 66, number1: 67.8, number2: 9.1, answer: 616.98, type: 'decimal' },
    { id: 67, number1: 78.9, number2: 1.2, answer: 94.68, type: 'decimal' },
    { id: 68, number1: 89.1, number2: 2.3, answer: 204.93, type: 'decimal' },
    { id: 69, number1: 91.2, number2: 3.4, answer: 310.08, type: 'decimal' },
    { id: 70, number1: 12.4, number2: 3.5, answer: 43.4, type: 'decimal' },
    { id: 71, number1: 23.5, number2: 4.6, answer: 108.1, type: 'decimal' },
    { id: 72, number1: 34.6, number2: 5.7, answer: 197.22, type: 'decimal' },
    { id: 73, number1: 45.7, number2: 6.8, answer: 310.76, type: 'decimal' },
    { id: 74, number1: 56.8, number2: 7.9, answer: 448.72, type: 'decimal' },
    { id: 75, number1: 67.9, number2: 8.1, answer: 549.99, type: 'decimal' },
    { id: 76, number1: 78.1, number2: 9.2, answer: 718.52, type: 'decimal' },
    { id: 77, number1: 89.2, number2: 1.3, answer: 115.96, type: 'decimal' },
    { id: 78, number1: 91.3, number2: 2.4, answer: 219.12, type: 'decimal' },
    { id: 79, number1: 12.5, number2: 3.6, answer: 45.0, type: 'decimal' },
    { id: 80, number1: 23.6, number2: 4.7, answer: 110.92, type: 'decimal' }
  ];

  // Combiner tous les exercices
  const allExercises = [...exercises2x2, ...exercises3x2, ...exercises3x3, ...exercicesDecimaux];

  // Fonction pour filtrer les exercices selon le type
  const getExercisesByType = (type: string): ExerciseData[] => {
    switch(type) {
      case '2x2': return exercises2x2;
      case '3x2': return exercises3x2;
      case '3x3': return exercises3x3;
      case 'decimal': return exercicesDecimaux;
      default: return exercises2x2;
    }
  };

  // Mettre à jour les exercices filtrés quand le type change
  useEffect(() => {
    const exercises = getExercisesByType(exerciseType);
    setFilteredExercises(exercises);
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
  }, [exerciseType]);

  // Initialiser les exercices au chargement
  useEffect(() => {
    setFilteredExercises(getExercisesByType('2x2'));
  }, []);

  const exercises = [
    {
      id: 1,
      type: 'multiplication',
      operation: '23 × 45',
      number1: 23,
      number2: 45,
      answer: 1035,
      difficulty: 'Moyen',
      explanation: 'Multiplication posée : 23 × 45 = 1035',
      steps: [
        '3 × 5 = 15 → je pose 5, retenue 1',
        '2 × 5 = 10, + 1 (retenue) = 11 → je pose 1, retenue 1',
        'Je pose la retenue 1 → premier résultat partiel : 115',
        '3 × 4 = 12 → je pose 2, retenue 1',
        '2 × 4 = 8, + 1 (retenue) = 9 → je pose 9',
        'Je décale d\'un rang → deuxième résultat partiel : 920',
        '115 + 920 = 1035'
      ]
    },
    {
      id: 2,
      type: 'multiplication',
      operation: '56 × 78',
      number1: 56,
      number2: 78,
      answer: 4368,
      difficulty: 'Moyen',
      explanation: 'Multiplication posée : 56 × 78 = 4368',
      steps: [
        '6 × 8 = 48 → je pose 8, retenue 4',
        '5 × 8 = 40, + 4 (retenue) = 44 → je pose 4, retenue 4',
        'Je pose la retenue 4 → premier résultat partiel : 448',
        '6 × 7 = 42 → je pose 2, retenue 4',
        '5 × 7 = 35, + 4 (retenue) = 39 → je pose 9, retenue 3',
        'Je pose la retenue 3 → je décale d\'un rang → deuxième résultat partiel : 3920',
        '448 + 3920 = 4368'
      ]
    },
    {
      id: 3,
      type: 'multiplication',
      operation: '123 × 45',
      number1: 123,
      number2: 45,
      answer: 5535,
      difficulty: 'Difficile',
      explanation: 'Multiplication posée : 123 × 45 = 5535',
      steps: [
        '3 × 5 = 15 → je pose 5, retenue 1',
        '2 × 5 = 10, + 1 (retenue) = 11 → je pose 1, retenue 1',
        '1 × 5 = 5, + 1 (retenue) = 6 → je pose 6',
        'Premier résultat partiel : 615',
        '3 × 4 = 12 → je pose 2, retenue 1',
        '2 × 4 = 8, + 1 (retenue) = 9 → je pose 9',
        '1 × 4 = 4 → je pose 4',
        'Je décale d\'un rang → deuxième résultat partiel : 4920',
        '615 + 4920 = 5535'
      ]
    },
    {
      id: 4,
      type: 'multiplication',
      operation: '234 × 56',
      number1: 234,
      number2: 56,
      answer: 13104,
      difficulty: 'Difficile',
      explanation: 'Multiplication posée : 234 × 56 = 13104',
      steps: [
        '4 × 6 = 24 → je pose 4, retenue 2',
        '3 × 6 = 18, + 2 (retenue) = 20 → je pose 0, retenue 2',
        '2 × 6 = 12, + 2 (retenue) = 14 → je pose 4, retenue 1',
        'Je pose la retenue 1 → premier résultat partiel : 1404',
        '4 × 5 = 20 → je pose 0, retenue 2',
        '3 × 5 = 15, + 2 (retenue) = 17 → je pose 7, retenue 1',
        '2 × 5 = 10, + 1 (retenue) = 11 → je pose 1, retenue 1',
        'Je pose la retenue 1 → je décale d\'un rang → deuxième résultat partiel : 11700',
        '1404 + 11700 = 13104'
      ]
    },
    {
      id: 5,
      type: 'multiplication',
      operation: '12,5 × 3,4',
      number1: 12.5,
      number2: 3.4,
      answer: 42.5,
      difficulty: 'Difficile',
      explanation: 'Multiplication décimale : 12,5 × 3,4 = 42,50',
      steps: [
        'Je transforme : 125 × 34 (j\'ignore les virgules)',
        '5 × 4 = 20 → je pose 0, retenue 2',
        '2 × 4 = 8, + 2 (retenue) = 10 → je pose 0, retenue 1',
        '1 × 4 = 4, + 1 (retenue) = 5 → je pose 5',
        'Premier résultat partiel : 500',
        'Je décale d\'un rang et multiplie par 3 → deuxième résultat partiel : 3750',
        '500 + 3750 = 4250',
        'Je place la virgule : 1 + 1 = 2 chiffres après → 42,50'
      ]
    }
  ];

  const getCurrentExercise = () => {
    const exercise = filteredExercises[currentExercise] || filteredExercises[0];
    if (!exercise) return exercises[0]; // Fallback aux exercices originaux si aucun exercice filtré
    
    return {
      ...exercise,
      difficulty: exercise.type === '2x2' ? 'Facile' : exercise.type === '3x2' ? 'Moyen' : exercise.type === '3x3' ? 'Difficile' : 'Moyen',
      operation: exercise.type === 'decimal' ? 
        `${exercise.number1.toString().replace('.', ',')} × ${exercise.number2.toString().replace('.', ',')}` :
        `${exercise.number1} × ${exercise.number2}`
    };
  };

  const nextStep = () => {
    const maxSteps = getMaxSteps();
    if (animationStep < maxSteps - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const resetDemo = () => {
    setAnimationStep(0);
  };

  const getMaxSteps = () => {
    if (activeDemo === 'multiplication-2x2') return 8;
    if (activeDemo === 'multiplication-3x2') return 10;
    if (activeDemo === 'multiplication-3x3') return 12;
    if (activeDemo === 'multiplication-decimaux') return 8;
    return 8;
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === getCurrentExercise().answer;
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < filteredExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
  };

  const resetExercise = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
  };

  const MultiplicationGrid = ({ exercise }: { exercise: any }) => {
    const num1 = exercise.number1;
    const num2 = exercise.number2;
    const result = exercise.answer;
    
    // Convertir les nombres en chaînes pour manipuler les chiffres
    const num1Str = num1.toString();
    const num2Str = num2.toString();
    const resultStr = result.toString();
    
    // Déterminer si c'est une multiplication décimale
    const isDecimal = num1Str.includes('.') || num2Str.includes('.');
    
    if (isDecimal) {
      // Gérer les multiplications décimales - multiplication posée complète
      const num1Parts = num1Str.split('.');
      const num2Parts = num2Str.split('.');
      const resultParts = resultStr.split('.');
      
      // Calculer les résultats partiels
      const num1Int = parseInt(num1Parts[0] + (num1Parts[1] || '0'));
      const num2Digits = num2Parts[0] + (num2Parts[1] || '0');
      const partialResults = [];
      
      for (let i = num2Digits.length - 1; i >= 0; i--) {
        const digit = parseInt(num2Digits[i]);
        const partial = num1Int * digit;
        const shift = num2Digits.length - 1 - i;
        partialResults.push({ value: partial, shift: shift });
      }
      
      return (
        <div className="space-y-2">
          {/* Premier nombre */}
          <div className="flex justify-center space-x-0">
            <div className="w-8 text-center"></div>
            <div className="w-12 text-center border-b-2 border-gray-400 text-gray-800">
              {num1Parts[0]}
            </div>
            <div className="w-4 text-center border-b-2 border-gray-400 text-gray-800">
              ,
            </div>
            <div className="w-12 text-center border-b-2 border-gray-400 text-gray-800">
              {num1Parts[1] || '0'}
            </div>
          </div>
          
          {/* Symbole et deuxième nombre */}
          <div className="flex justify-center space-x-0">
            <div className="w-8 text-center text-gray-800">×</div>
            <div className="w-12 text-center border-b-2 border-gray-400 text-gray-800">
              {num2Parts[0]}
            </div>
            <div className="w-4 text-center border-b-2 border-gray-400 text-gray-800">
              ,
            </div>
            <div className="w-12 text-center border-b-2 border-gray-400 text-gray-800">
              {num2Parts[1] || '0'}
            </div>
          </div>
          
          {/* Résultats partiels */}
          {partialResults.map((partial, index) => (
            <div key={index} className="flex justify-center space-x-0">
              <div className="w-8 text-center text-gray-800">{index === 0 ? '' : '+'}</div>
              <div className="w-12 text-center bg-green-100 text-gray-800">
                {partial.value.toString().padStart(4, ' ').charAt(0) || ''}
              </div>
              <div className="w-12 text-center bg-green-100 text-gray-800">
                {partial.value.toString().padStart(4, ' ').charAt(1) || ''}
              </div>
              <div className="w-4 text-center"></div>
              <div className="w-12 text-center bg-green-100 text-gray-800">
                {partial.value.toString().padStart(4, ' ').charAt(2) || ''}
              </div>
              <div className="w-12 text-center bg-green-100 text-gray-800">
                {partial.value.toString().padStart(4, ' ').charAt(3) || ''}
              </div>
            </div>
          ))}
          
          <div className="border-t-2 border-gray-400"></div>
          
          {/* Résultat final */}
          <div className="flex justify-center space-x-0">
            <div className="w-8 text-center text-gray-800">=</div>
            <div className="w-12 text-center bg-purple-100 font-bold text-gray-800">
              {resultParts[0]}
            </div>
            <div className="w-4 text-center bg-purple-100 font-bold text-gray-800">
              ,
            </div>
            <div className="w-12 text-center bg-purple-100 font-bold text-gray-800">
              {resultParts[1] || '0'}
            </div>
          </div>
        </div>
      );
    } else {
      // Gérer les multiplications entières - multiplication posée complète
      const num1Digits = num1Str.split('').reverse();
      const num2Digits = num2Str.split('').reverse();
      const resultDigits = resultStr.split('').reverse();
      
      // Calculer les résultats partiels
      const partialResults = [];
      for (let i = 0; i < num2Digits.length; i++) {
        const digit = parseInt(num2Digits[i]);
        const partial = num1 * digit;
        if (partial > 0) {
          partialResults.push({ value: partial, shift: i });
        }
      }
      
      // Déterminer la largeur nécessaire (maximum entre tous les nombres)
      const maxWidth = Math.max(
        num1Str.length,
        num2Str.length,
        resultStr.length,
        ...partialResults.map(p => p.value.toString().length + p.shift)
      );
      
      return (
        <div className="space-y-2 font-mono">
          {/* Premier nombre */}
          <div className="flex justify-center space-x-0">
            <div className="w-8 text-center"></div>
            {Array.from({ length: maxWidth }, (_, i) => {
              const digitIndex = maxWidth - 1 - i;
              const digit = num1Digits[digitIndex] || '';
              return (
                <div key={i} className="w-12 text-center border-b-2 border-gray-400 text-gray-800">
                  {digit}
                </div>
              );
            })}
          </div>
          
          {/* Symbole et deuxième nombre */}
          <div className="flex justify-center space-x-0">
            <div className="w-8 text-center text-gray-800">×</div>
            {Array.from({ length: maxWidth }, (_, i) => {
              const digitIndex = maxWidth - 1 - i;
              const digit = num2Digits[digitIndex] || '';
              return (
                <div key={i} className="w-12 text-center border-b-2 border-gray-400 text-gray-800">
                  {digit}
                </div>
              );
            })}
          </div>
          
          {/* Résultats partiels */}
          {partialResults.map((partial, index) => {
            const partialDigits = partial.value.toString().split('').reverse();
            return (
              <div key={index} className="flex justify-center space-x-0">
                <div className="w-8 text-center text-gray-800">{index === 0 ? '' : '+'}</div>
                {Array.from({ length: maxWidth }, (_, i) => {
                  const digitIndex = maxWidth - 1 - i - partial.shift;
                  const digit = partialDigits[digitIndex] || '';
                  return (
                    <div key={i} className="w-12 text-center bg-green-100 text-gray-800">
                      {digit}
                    </div>
                  );
                })}
              </div>
            );
          })}
          
          <div className="border-t-2 border-gray-400"></div>
          
          {/* Résultat final */}
          <div className="flex justify-center space-x-0">
            <div className="w-8 text-center text-gray-800">=</div>
            {Array.from({ length: maxWidth }, (_, i) => {
              const digitIndex = maxWidth - 1 - i;
              const digit = resultDigits[digitIndex] || '';
              return (
                <div key={i} className="w-12 text-center bg-purple-100 font-bold text-gray-800">
                  {digit}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const Multiplication2x2 = () => {
    // 23 × 45 = 1035
    const steps = [
      'Je place les nombres en colonne, alignés à droite',
      'Je commence par multiplier 3 × 5 = 15. Je pose 5 et retiens 1',
      'Je multiplie 2 × 5 = 10, puis j\'ajoute la retenue : 10 + 1 = 11. Je pose 1 et retiens 1',
      'Je pose la retenue 1 → Premier résultat partiel : 115',
      'Maintenant je multiplie par 4 (dizaines). Je commence par 3 × 4 = 12. Je pose 2 et retiens 1',
      'Je multiplie 2 × 4 = 8, puis j\'ajoute la retenue : 8 + 1 = 9. Je pose 9',
      'Je décale d\'un rang (×10) → Deuxième résultat partiel : 920',
      'J\'additionne les résultats partiels : 115 + 920 = 1035'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-4">
            Multiplication 2×2 chiffres : 23 × 45
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-xl space-y-2">
                {/* Premier nombre */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10"></span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 2 && animationStep <= 3) || (animationStep >= 5 && animationStep <= 6) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    2
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 1 && animationStep <= 3) || (animationStep >= 4 && animationStep <= 6) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    3
                  </span>
                </div>
                
                {/* Symbole multiplication et second nombre */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">×</span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 4 && animationStep <= 6) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    4
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 1 && animationStep <= 3) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    5
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Premier résultat partiel */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10"></span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 3 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 3 ? '1' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 2 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 2 ? '1' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 1 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 1 ? '5' : ''}
                  </span>
                </div>
                
                {/* Deuxième résultat partiel - décalé d'un rang */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">+</span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 6 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 6 ? '9' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 6 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 6 ? '2' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 6 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 6 ? '0' : ''}
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Résultat final */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">=</span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 7 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 7 ? '1' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 7 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 7 ? '0' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 7 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 7 ? '3' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 7 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 7 ? '5' : ''}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
                {/* Calcul détaillé selon l'étape */}
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  {animationStep === 1 && (
                    <div className="text-blue-700 font-mono">
                      <span className="bg-yellow-200 px-1">3</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">15</span>
                      <br />→ Je pose <span className="font-bold">5</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 2 && (
                    <div className="text-blue-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">10</span>
                      <br />10 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">11</span>
                      <br />→ Je pose <span className="font-bold">1</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 3 && (
                    <div className="text-blue-700 font-mono">
                      Je pose la retenue <span className="font-bold text-red-600">1</span>
                      <br />→ Premier résultat partiel : <span className="bg-green-200 px-1 font-bold">115</span>
                    </div>
                  )}
                  {animationStep === 4 && (
                    <div className="text-blue-700 font-mono">
                      <span className="bg-yellow-200 px-1">3</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">12</span>
                      <br />→ Je pose <span className="font-bold">2</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 5 && (
                    <div className="text-blue-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">8</span>
                      <br />8 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">9</span>
                      <br />→ Je pose <span className="font-bold">9</span>
                    </div>
                  )}
                  {animationStep === 6 && (
                    <div className="text-blue-700 font-mono">
                      Multiplication par 4 (dizaines) → je décale d'un rang
                      <br />92 × 10 = <span className="bg-green-200 px-1 font-bold">920</span>
                    </div>
                  )}
                  {animationStep === 7 && (
                    <div className="text-blue-700 font-mono">
                      <span className="bg-green-200 px-1">115</span> + <span className="bg-green-200 px-1">920</span> = <span className="bg-purple-200 px-1 font-bold">1035</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Multiplication3x2 = () => {
    // 123 × 45 = 5535
    const steps = [
      'Je place les nombres en colonne, alignés à droite',
      'Je commence par multiplier 3 × 5 = 15. Je pose 5 et retiens 1',
      'Je multiplie 2 × 5 = 10, puis j\'ajoute la retenue : 10 + 1 = 11. Je pose 1 et retiens 1',
      'Je multiplie 1 × 5 = 5, puis j\'ajoute la retenue : 5 + 1 = 6. Je pose 6',
      'Premier résultat partiel : 615',
      'Maintenant je multiplie par 4 (dizaines). Je commence par 3 × 4 = 12. Je pose 2 et retiens 1',
      'Je multiplie 2 × 4 = 8, puis j\'ajoute la retenue : 8 + 1 = 9. Je pose 9',
      'Je multiplie 1 × 4 = 4. Je pose 4',
      'Je décale d\'un rang (×10) → Deuxième résultat partiel : 4920',
      'J\'additionne les résultats partiels : 615 + 4920 = 5535'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-bold text-green-900 mb-4">
            Multiplication 3×2 chiffres : 123 × 45
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-xl space-y-2">
                {/* Premier nombre */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 3 && animationStep <= 4) || (animationStep >= 7 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    1
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 2 && animationStep <= 4) || (animationStep >= 6 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    2
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 1 && animationStep <= 4) || (animationStep >= 5 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    3
                  </span>
                </div>
                
                {/* Symbole multiplication et second nombre */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">×</span>
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 5 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    4
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 1 && animationStep <= 4) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    5
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Premier résultat partiel */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 3 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 3 ? '6' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 2 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 2 ? '1' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 1 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 1 ? '5' : ''}
                  </span>
                </div>
                
                {/* Deuxième résultat partiel - décalé d'un rang */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">+</span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 8 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 8 ? '4' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 8 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 8 ? '9' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 8 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 8 ? '2' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 8 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 8 ? '0' : ''}
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Résultat final */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">=</span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 9 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '5' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 9 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '5' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 9 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '3' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 9 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '5' : ''}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-green-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
                {/* Calcul détaillé selon l'étape */}
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  {animationStep === 1 && (
                    <div className="text-green-700 font-mono">
                      <span className="bg-yellow-200 px-1">3</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">15</span>
                      <br />→ Je pose <span className="font-bold">5</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 2 && (
                    <div className="text-green-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">10</span>
                      <br />10 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">11</span>
                      <br />→ Je pose <span className="font-bold">1</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 3 && (
                    <div className="text-green-700 font-mono">
                      <span className="bg-yellow-200 px-1">1</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">5</span>
                      <br />5 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">6</span>
                      <br />→ Je pose <span className="font-bold">6</span>
                    </div>
                  )}
                  {animationStep === 4 && (
                    <div className="text-green-700 font-mono">
                      Premier résultat partiel : <span className="bg-green-200 px-1 font-bold">615</span>
                    </div>
                  )}
                  {animationStep === 5 && (
                    <div className="text-green-700 font-mono">
                      <span className="bg-yellow-200 px-1">3</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">12</span>
                      <br />→ Je pose <span className="font-bold">2</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 6 && (
                    <div className="text-green-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">8</span>
                      <br />8 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">9</span>
                      <br />→ Je pose <span className="font-bold">9</span>
                    </div>
                  )}
                  {animationStep === 7 && (
                    <div className="text-green-700 font-mono">
                      <span className="bg-yellow-200 px-1">1</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">4</span>
                      <br />→ Je pose <span className="font-bold">4</span>
                    </div>
                  )}
                  {animationStep === 8 && (
                    <div className="text-green-700 font-mono">
                      Multiplication par 4 (dizaines) → je décale d'un rang
                      <br />492 × 10 = <span className="bg-green-200 px-1 font-bold">4920</span>
                    </div>
                  )}
                  {animationStep === 9 && (
                    <div className="text-green-700 font-mono">
                      <span className="bg-green-200 px-1">615</span> + <span className="bg-green-200 px-1">4920</span> = <span className="bg-purple-200 px-1 font-bold">5535</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Multiplication3x3 = () => {
    // 123 × 456 = 56088
    const steps = [
      'Je place les nombres en colonne, alignés à droite',
      'Je commence par multiplier 3 × 6 = 18. Je pose 8 et retiens 1',
      'Je multiplie 2 × 6 = 12, puis j\'ajoute la retenue : 12 + 1 = 13. Je pose 3 et retiens 1',
      'Je multiplie 1 × 6 = 6, puis j\'ajoute la retenue : 6 + 1 = 7. Je pose 7',
      'Premier résultat partiel : 738',
      'Maintenant je multiplie par 5 (dizaines). Je commence par 3 × 5 = 15. Je pose 5 et retiens 1',
      'Je multiplie 2 × 5 = 10, puis j\'ajoute la retenue : 10 + 1 = 11. Je pose 1 et retiens 1',
      'Je multiplie 1 × 5 = 5, puis j\'ajoute la retenue : 5 + 1 = 6. Je pose 6',
      'Je décale d\'un rang (×10) → Deuxième résultat partiel : 6150',
      'Maintenant je multiplie par 4 (centaines). Je commence par 3 × 4 = 12. Je pose 2 et retiens 1',
      'Je multiplie 2 × 4 = 8, puis j\'ajoute la retenue : 8 + 1 = 9. Je pose 9',
      'Je multiplie 1 × 4 = 4. Je pose 4',
      'Je décale de deux rangs (×100) → Troisième résultat partiel : 49200',
      'J\'additionne les résultats partiels : 738 + 6150 + 49200 = 56088'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-red-50 p-6 rounded-lg">
          <h4 className="font-bold text-red-900 mb-4">
            Multiplication 3×3 chiffres : 123 × 456
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-xl space-y-2">
                {/* Premier nombre avec retenues */}
                <div className="flex justify-center relative">
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  {/* Retenues pour ×6 */}
                  <span className={`absolute -top-4 left-40 text-xs text-red-600 ${animationStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    {animationStep >= 3 ? '¹' : ''}
                  </span>
                  <span className={`absolute -top-4 left-30 text-xs text-red-600 ${animationStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    {animationStep >= 2 ? '¹' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 3 && animationStep <= 4) || (animationStep >= 6 && animationStep <= 8) || (animationStep >= 10 && animationStep <= 12) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    1
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 2 && animationStep <= 4) || (animationStep >= 6 && animationStep <= 8) || (animationStep >= 10 && animationStep <= 12) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    2
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 1 && animationStep <= 4) || (animationStep >= 5 && animationStep <= 8) || (animationStep >= 9 && animationStep <= 12) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    3
                  </span>
                </div>
                
                {/* Symbole multiplication et second nombre */}
                <div className="flex justify-center relative">
                  <span className="text-gray-800 w-10">×</span>
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  {/* Retenues pour ×4 */}
                  <span className={`absolute -top-4 left-30 text-xs text-red-600 ${animationStep >= 10 ? 'opacity-100' : 'opacity-0'}`}>
                    {animationStep >= 10 ? '¹' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 9 && animationStep <= 12) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    4
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 5 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    5
                  </span>
                  <span className={`inline-block w-10 text-center ${(animationStep >= 1 && animationStep <= 4) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    6
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Premier résultat partiel avec construction progressive */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  <span className="text-gray-800 w-10"></span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 3 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 3 ? '7' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 2 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 2 ? '3' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 1 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 1 ? '8' : ''}
                  </span>
                </div>
                
                {/* Deuxième résultat partiel - décalé d'un rang */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">+</span>
                  <span className="text-gray-800 w-10"></span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 7 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 7 ? '6' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 6 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 6 ? '1' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 5 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 5 ? '5' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 8 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 8 ? '0' : ''}
                  </span>
                </div>
                
                {/* Troisième résultat partiel - décalé de deux rangs */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">+</span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 11 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 11 ? '4' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 10 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 10 ? '9' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 9 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '2' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 12 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 12 ? '0' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 12 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 12 ? '0' : ''}
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Résultat final */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-10">=</span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 13 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 13 ? '5' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 13 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 13 ? '6' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 13 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 13 ? '0' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 13 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 13 ? '8' : ''}
                  </span>
                  <span className={`inline-block w-10 text-center ${animationStep >= 13 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 13 ? '8' : ''}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-red-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
                {/* Calcul détaillé selon l'étape */}
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  {animationStep === 1 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">3</span> × <span className="bg-yellow-200 px-1">6</span> = <span className="bg-green-200 px-1">18</span>
                      <br />→ Je pose <span className="font-bold">8</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 2 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">6</span> = <span className="bg-green-200 px-1">12</span>
                      <br />12 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">13</span>
                      <br />→ Je pose <span className="font-bold">3</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 3 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">1</span> × <span className="bg-yellow-200 px-1">6</span> = <span className="bg-green-200 px-1">6</span>
                      <br />6 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">7</span>
                      <br />→ Je pose <span className="font-bold">7</span>
                    </div>
                  )}
                  {animationStep === 4 && (
                    <div className="text-red-700 font-mono">
                      Premier résultat partiel : <span className="bg-green-200 px-1 font-bold">738</span>
                    </div>
                  )}
                  {animationStep === 5 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">3</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">15</span>
                      <br />→ Je pose <span className="font-bold">5</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 6 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">10</span>
                      <br />10 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">11</span>
                      <br />→ Je pose <span className="font-bold">1</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 7 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">1</span> × <span className="bg-yellow-200 px-1">5</span> = <span className="bg-green-200 px-1">5</span>
                      <br />5 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">6</span>
                      <br />→ Je pose <span className="font-bold">6</span>
                    </div>
                  )}
                  {animationStep === 8 && (
                    <div className="text-red-700 font-mono">
                      Multiplication par 5 (dizaines) → je décale d'un rang
                      <br />615 × 10 = <span className="bg-green-200 px-1 font-bold">6150</span>
                    </div>
                  )}
                  {animationStep === 9 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">3</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">12</span>
                      <br />→ Je pose <span className="font-bold">2</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 10 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">8</span>
                      <br />8 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">9</span>
                      <br />→ Je pose <span className="font-bold">9</span>
                    </div>
                  )}
                  {animationStep === 11 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-yellow-200 px-1">1</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">4</span>
                      <br />→ Je pose <span className="font-bold">4</span>
                    </div>
                  )}
                  {animationStep === 12 && (
                    <div className="text-red-700 font-mono">
                      Multiplication par 4 (centaines) → je décale de deux rangs
                      <br />492 × 100 = <span className="bg-green-200 px-1 font-bold">49200</span>
                    </div>
                  )}
                  {animationStep === 13 && (
                    <div className="text-red-700 font-mono">
                      <span className="bg-green-200 px-1">738</span> + <span className="bg-green-200 px-1">6150</span> + <span className="bg-green-200 px-1">49200</span> = <span className="bg-purple-200 px-1 font-bold">56088</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MultiplicationDecimaux = () => {
    // 12,5 × 3,4 = 42,50
    const steps = [
      'Je place les nombres en colonne (j\'ignore les virgules pour le moment)',
      'Je commence par multiplier 5 × 4 = 20. Je pose 0 et retiens 2',
      'Je multiplie 2 × 4 = 8, puis j\'ajoute la retenue : 8 + 2 = 10. Je pose 0 et retiens 1',
      'Je multiplie 1 × 4 = 4, puis j\'ajoute la retenue : 4 + 1 = 5. Je pose 5',
      'Premier résultat partiel : 500',
      'Maintenant je multiplie par 3 (dizaines). Je commence par 5 × 3 = 15. Je pose 5 et retiens 1',
      'Je multiplie 2 × 3 = 6, puis j\'ajoute la retenue : 6 + 1 = 7. Je pose 7',
      'Je multiplie 1 × 3 = 3. Je pose 3',
      'Je décale d\'un rang (×10) → Deuxième résultat partiel : 3750',
      'J\'additionne les résultats partiels : 500 + 3750 = 4250',
      'Je place la virgule : 1 + 1 = 2 chiffres après la virgule → 42,50'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-bold text-purple-900 mb-4">
            Multiplication avec décimaux
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-2xl space-y-2">
                {/* Premier nombre avec retenues */}
                <div className="flex justify-center relative">
                  <span className="text-gray-800 w-12"></span>
                  <span className="text-gray-800 w-12"></span>
                  {/* Retenues pour ×4 */}
                  <span className={`absolute -top-4 left-36 text-xs text-red-600 ${animationStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    {animationStep >= 3 ? '¹' : ''}
                  </span>
                  <span className={`absolute -top-4 left-24 text-xs text-red-600 ${animationStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    {animationStep >= 2 ? '²' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${(animationStep >= 3 && animationStep <= 4) || (animationStep >= 7 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    1
                  </span>
                  <span className={`inline-block w-12 text-center ${(animationStep >= 2 && animationStep <= 4) || (animationStep >= 6 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    2
                  </span>
                  <span className="text-gray-800 w-2">,</span>
                  <span className={`inline-block w-12 text-center ${(animationStep >= 1 && animationStep <= 4) || (animationStep >= 5 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    5
                  </span>
                </div>
                
                {/* Symbole multiplication et second nombre */}
                <div className="flex justify-center relative">
                  <span className="text-gray-800 w-12">×</span>
                  <span className="text-gray-800 w-12"></span>
                  <span className="text-gray-800 w-12"></span>
                  {/* Retenue pour ×3 */}
                  <span className={`absolute -top-4 left-36 text-xs text-red-600 ${animationStep >= 5 ? 'opacity-100' : 'opacity-0'}`}>
                    {animationStep >= 5 ? '¹' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${(animationStep >= 5 && animationStep <= 8) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    3
                  </span>
                  <span className="text-gray-800 w-2">,</span>
                  <span className={`inline-block w-12 text-center ${(animationStep >= 1 && animationStep <= 4) ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    4
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Premier résultat partiel avec construction progressive */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-12"></span>
                  <span className="text-gray-800 w-12"></span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 3 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 3 ? '5' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 2 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 2 ? '0' : ''}
                  </span>
                  <span className="text-gray-800 w-2"></span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 1 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 1 ? '0' : ''}
                  </span>
                </div>
                
                {/* Deuxième résultat partiel - décalé d'un rang */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-12">+</span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 7 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 7 ? '3' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 6 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 6 ? '7' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 5 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 5 ? '5' : ''}
                  </span>
                  <span className="text-gray-800 w-2"></span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 8 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 8 ? '0' : ''}
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Résultat entier */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-12">=</span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 9 ? 'bg-blue-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '4' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 9 ? 'bg-blue-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '2' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 9 ? 'bg-blue-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '5' : ''}
                  </span>
                  <span className="text-gray-800 w-2"></span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 9 ? 'bg-blue-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 9 ? '0' : ''}
                  </span>
                </div>
                
                {/* Résultat final avec virgule */}
                <div className="flex justify-center">
                  <span className="text-gray-800 w-12">=</span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 10 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 10 ? '4' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 10 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 10 ? '2' : ''}
                  </span>
                  <span className={`text-gray-800 w-2 ${animationStep >= 10 ? 'text-purple-900 font-bold' : ''}`}>
                    {animationStep >= 10 ? ',' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 10 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 10 ? '5' : ''}
                  </span>
                  <span className={`inline-block w-12 text-center ${animationStep >= 10 ? 'bg-purple-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                    {animationStep >= 10 ? '0' : ''}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
                {/* Calcul détaillé selon l'étape */}
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  {animationStep === 1 && (
                    <div className="text-purple-700 font-mono">
                      <span className="bg-yellow-200 px-1">5</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">20</span>
                      <br />→ Je pose <span className="font-bold">0</span> et je retiens <span className="font-bold text-red-600">2</span>
                    </div>
                  )}
                  {animationStep === 2 && (
                    <div className="text-purple-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">8</span>
                      <br />8 + <span className="text-red-600 font-bold">2</span> (retenue) = <span className="bg-green-200 px-1">10</span>
                      <br />→ Je pose <span className="font-bold">0</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 3 && (
                    <div className="text-purple-700 font-mono">
                      <span className="bg-yellow-200 px-1">1</span> × <span className="bg-yellow-200 px-1">4</span> = <span className="bg-green-200 px-1">4</span>
                      <br />4 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">5</span>
                      <br />→ Je pose <span className="font-bold">5</span>
                    </div>
                  )}
                  {animationStep === 4 && (
                    <div className="text-purple-700 font-mono">
                      Premier résultat partiel : <span className="bg-green-200 px-1 font-bold">500</span>
                    </div>
                  )}
                  {animationStep === 5 && (
                    <div className="text-purple-700 font-mono">
                      <span className="bg-yellow-200 px-1">5</span> × <span className="bg-yellow-200 px-1">3</span> = <span className="bg-green-200 px-1">15</span>
                      <br />→ Je pose <span className="font-bold">5</span> et je retiens <span className="font-bold text-red-600">1</span>
                    </div>
                  )}
                  {animationStep === 6 && (
                    <div className="text-purple-700 font-mono">
                      <span className="bg-yellow-200 px-1">2</span> × <span className="bg-yellow-200 px-1">3</span> = <span className="bg-green-200 px-1">6</span>
                      <br />6 + <span className="text-red-600 font-bold">1</span> (retenue) = <span className="bg-green-200 px-1">7</span>
                      <br />→ Je pose <span className="font-bold">7</span>
                    </div>
                  )}
                  {animationStep === 7 && (
                    <div className="text-purple-700 font-mono">
                      <span className="bg-yellow-200 px-1">1</span> × <span className="bg-yellow-200 px-1">3</span> = <span className="bg-green-200 px-1">3</span>
                      <br />→ Je pose <span className="font-bold">3</span>
                    </div>
                  )}
                  {animationStep === 8 && (
                    <div className="text-purple-700 font-mono">
                      Multiplication par 3 (dizaines) → je décale d'un rang
                      <br />375 × 10 = <span className="bg-green-200 px-1 font-bold">3750</span>
                    </div>
                  )}
                  {animationStep === 9 && (
                    <div className="text-purple-700 font-mono">
                      <span className="bg-green-200 px-1">500</span> + <span className="bg-green-200 px-1">3750</span> = <span className="bg-blue-200 px-1 font-bold">4250</span>
                    </div>
                  )}
                  {animationStep === 10 && (
                    <div className="text-purple-700 font-mono">
                      12,5 : <span className="text-red-600 font-bold">1</span> chiffre après la virgule
                      <br />3,4 : <span className="text-red-600 font-bold">1</span> chiffre après la virgule
                      <br />Total : <span className="text-red-600 font-bold">2</span> chiffres après la virgule
                      <br />4250 → <span className="bg-purple-200 px-1 font-bold">42,50</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/chapitre/cm1-operations-arithmetiques"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au chapitre
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-gray-700">Score: {score}/{attempts}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Multiplication en colonne
          </h1>
          <p className="text-gray-600">
            Maîtrise la multiplication posée avec plusieurs chiffres et nombres décimaux
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setShowDemo(true)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              showDemo ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-50'
            }`}
          >
            📚 Points méthode
          </button>
          <button
            onClick={() => setShowDemo(false)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !showDemo ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-50'
            }`}
          >
            💪 Exercices
          </button>
        </div>

        {showDemo ? (
          <div className="space-y-6">
            {/* Méthode selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Choisissez la méthode à étudier</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => { setActiveDemo('multiplication-2x2'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'multiplication-2x2' 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-200 hover:border-blue-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">2×2 chiffres</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('multiplication-3x2'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'multiplication-3x2' 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-200 hover:border-green-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">3×2 chiffres</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('multiplication-3x3'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'multiplication-3x3' 
                      ? 'border-red-500 bg-red-500 text-white' 
                      : 'border-gray-200 hover:border-red-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">3×3 chiffres</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('multiplication-decimaux'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'multiplication-decimaux' 
                      ? 'border-purple-500 bg-purple-500 text-white' 
                      : 'border-gray-200 hover:border-purple-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">Avec décimaux</span>
                </button>
              </div>
            </div>

            {/* Animation controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Démonstration étape par étape</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ⚡ Cliquez sur "Suivant" pour voir chaque calcul en détail
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Étape {animationStep + 1} sur {getMaxSteps()}
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((animationStep + 1) / getMaxSteps()) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevStep}
                      disabled={animationStep === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Précédent
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={animationStep >= getMaxSteps() - 1}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {animationStep >= getMaxSteps() - 1 ? 'Terminé' : 'Suivant'}
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                    <button
                      onClick={resetDemo}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Animation content */}
              {activeDemo === 'multiplication-2x2' && <Multiplication2x2 />}
              {activeDemo === 'multiplication-3x2' && <Multiplication3x2 />}
              {activeDemo === 'multiplication-3x3' && <Multiplication3x3 />}
              {activeDemo === 'multiplication-decimaux' && <MultiplicationDecimaux />}
            </div>

            {/* Règles importantes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Règles importantes à retenir</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                    <span className="text-2xl">×</span>
                    Pour la multiplication posée :
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      Multiplier par chaque chiffre du multiplicateur
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      Décaler les résultats partiels selon la position
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      Additionner tous les résultats partiels
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-600 flex items-center gap-2">
                    <span className="text-2xl">×</span>
                    Pour les nombres décimaux :
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      Multiplier sans tenir compte des virgules
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      Compter le nombre de chiffres après les virgules
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      Placer la virgule dans le résultat final
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Exercices section
          <div className="space-y-6">
            {/* Sélecteur de type d'exercice */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Choisir le type d'exercice</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setExerciseType('2x2')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    exerciseType === '2x2' 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-200 hover:border-blue-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">2×2 chiffres</span>
                  <div className="text-xs text-gray-600 mt-1">Facile</div>
                </button>
                <button
                  onClick={() => setExerciseType('3x2')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    exerciseType === '3x2' 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-200 hover:border-green-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">3×2 chiffres</span>
                  <div className="text-xs text-gray-600 mt-1">Moyen</div>
                </button>
                <button
                  onClick={() => setExerciseType('3x3')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    exerciseType === '3x3' 
                      ? 'border-red-500 bg-red-500 text-white' 
                      : 'border-gray-200 hover:border-red-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">3×3 chiffres</span>
                  <div className="text-xs text-gray-600 mt-1">Difficile</div>
                </button>
                <button
                  onClick={() => setExerciseType('decimal')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    exerciseType === 'decimal' 
                      ? 'border-purple-500 bg-purple-500 text-white' 
                      : 'border-gray-200 hover:border-purple-300 bg-white text-gray-800'
                  }`}
                >
                  <div className="text-2xl mb-2">×</div>
                  <span className="text-sm font-medium">Décimaux</span>
                  <div className="text-xs text-gray-600 mt-1">Moyen</div>
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Exercice {currentExercise + 1} sur {filteredExercises.length}
                </h2>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-700">
                    Difficulté : {getCurrentExercise().difficulty}
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentExercise + 1) / filteredExercises.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Exercise */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">×</span>
                <h3 className="text-lg font-bold text-gray-800">
                  Multiplication en colonne
                </h3>
              </div>

              <div className="text-center mb-6">
                <div className="inline-block bg-gray-50 p-8 rounded-lg border-2 border-gray-200">
                  <div className="font-mono text-3xl text-gray-800">
                    {getCurrentExercise().operation}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre réponse :
                  </label>
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Tapez votre réponse..."
                    disabled={showAnswer}
                  />
                </div>

                {showAnswer && (
                  <div className="space-y-4">
                    <div className={`text-center font-semibold ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-6 h-6" />
                          Correct ! Bonne réponse.
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <XCircle className="w-6 h-6" />
                          Incorrect. La réponse était : {getCurrentExercise().answer}
                        </div>
                      )}
                    </div>

                    {/* Grille de multiplication avec colonnes fixes */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-4 text-center">
                        Multiplication posée détaillée
                      </h4>
                      
                      <div className="flex justify-center">
                        <div className="font-mono text-2xl space-y-2">
                          {/* Génération de la grille selon le type d'opération */}
                          <MultiplicationGrid exercise={getCurrentExercise()} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer || showAnswer}
                    className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Vérifier
                  </button>
                  <button
                    onClick={resetExercise}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={prevExercise}
                    disabled={currentExercise <= 0}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Exercice précédent
                  </button>
                  <button
                    onClick={nextExercise}
                    disabled={currentExercise >= filteredExercises.length - 1}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Exercice suivant
                  </button>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Conseils pour réussir</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">✖️ Multiplication posée :</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Aligne bien les chiffres par position (droite vers gauche)</li>
                    <li>• Commence toujours par les unités du multiplicateur</li>
                    <li>• Calcule chaque produit élémentaire (avec retenues)</li>
                    <li>• N'oublie pas de décaler les résultats partiels</li>
                    <li>• Additionne soigneusement tous les résultats</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">🔢 Nombres décimaux :</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Compte les chiffres après les virgules au total</li>
                    <li>• Multiplie comme des nombres entiers (ignore les virgules)</li>
                    <li>• Place la virgule dans le résultat final au bon endroit</li>
                    <li>• Vérifie que le résultat est cohérent avec l'ordre de grandeur</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 