'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Plus, Minus, Calculator, RotateCcw } from 'lucide-react';

export default function AdditionSoustractionPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showDemo, setShowDemo] = useState(true);
  const [activeDemo, setActiveDemo] = useState('addition-sans-retenue');
  const [animationStep, setAnimationStep] = useState(0);

  const exercises = [
    // Additions simples sans retenue
    {
      id: 1,
      type: 'addition',
      operation: '234 + 125',
      number1: 234,
      number2: 125,
      answer: 359,
      difficulty: 'Facile',
      explanation: 'Pas de retenue : 4+5=9, 3+2=5, 2+1=3',
      steps: [
        'Unités : 4 + 5 = 9',
        'Dizaines : 3 + 2 = 5',
        'Centaines : 2 + 1 = 3'
      ]
    },
    {
      id: 2,
      type: 'addition',
      operation: '156 + 323',
      number1: 156,
      number2: 323,
      answer: 479,
      difficulty: 'Facile',
      explanation: 'Pas de retenue : 6+3=9, 5+2=7, 1+3=4',
      steps: [
        'Unités : 6 + 3 = 9',
        'Dizaines : 5 + 2 = 7',
        'Centaines : 1 + 3 = 4'
      ]
    },
    // Additions avec retenue
    {
      id: 3,
      type: 'addition',
      operation: '178 + 147',
      number1: 178,
      number2: 147,
      answer: 325,
      difficulty: 'Moyen',
      explanation: 'Retenue des unités : 8+7=15, je pose 5 et retiens 1',
      steps: [
        'Unités : 8 + 7 = 15 → je pose 5, retenue 1',
        'Dizaines : 7 + 4 + 1 (retenue) = 12 → je pose 2, je retiens 1',
        'Centaines : 1 + 1 + 1 (retenue) = 3'
      ]
    },
    {
      id: 4,
      type: 'addition',
      operation: '269 + 185',
      number1: 269,
      number2: 185,
      answer: 454,
      difficulty: 'Moyen',
      explanation: 'Retenue des unités : 9+5=14, je pose 4 et retiens 1',
      steps: [
        'Unités : 9 + 5 = 14 → je pose 4, retenue 1',
        'Dizaines : 6 + 8 + 1 = 15 → je pose 5, retenue 1',
        'Centaines : 2 + 1 + 1 = 4'
      ]
    },
    // Soustractions simples sans retenue
    {
      id: 5,
      type: 'soustraction',
      operation: '789 - 234',
      number1: 789,
      number2: 234,
      answer: 555,
      difficulty: 'Facile',
      explanation: 'Pas de retenue : 9-4=5, 8-3=5, 7-2=5',
      steps: [
        'Unités : 9 - 4 = 5',
        'Dizaines : 8 - 3 = 5',
        'Centaines : 7 - 2 = 5'
      ]
    },
    {
      id: 6,
      type: 'soustraction',
      operation: '567 - 243',
      number1: 567,
      number2: 243,
      answer: 324,
      difficulty: 'Facile',
      explanation: 'Pas de retenue : 7-3=4, 6-4=2, 5-2=3',
      steps: [
        'Unités : 7 - 3 = 4',
        'Dizaines : 6 - 4 = 2',
        'Centaines : 5 - 2 = 3'
      ]
    },
    // Soustractions avec retenue
    {
      id: 7,
      type: 'soustraction',
      operation: '523 - 147',
      number1: 523,
      number2: 147,
      answer: 376,
      difficulty: 'Moyen',
      explanation: 'Retenue aux unités : 3&lt;7, j\'emprunte 1 dizaine',
      steps: [
        'Unités : 13 - 7 = 6 (j\'ai emprunté 1 dizaine)',
        'Dizaines : 1 &lt; 4, j\'emprunte 1 centaine. 11 - 4 = 7',
        'Centaines : 4 - 1 = 3'
      ]
    },
    {
      id: 8,
      type: 'soustraction',
      operation: '604 - 238',
      number1: 604,
      number2: 238,
      answer: 366,
      difficulty: 'Difficile',
      explanation: 'Retenue avec zéro : 4&lt;8, j\'emprunte mais 0 dizaines, donc j\'emprunte aux centaines',
      steps: [
        'Unités : 14 - 8 = 6 (j\'ai emprunté 1 dizaine)',
        'Dizaines : 10 - 3 - 1 = 6 (j\'ai emprunté 1 centaine)',
        'Centaines : 5 - 2 = 3'
      ]
    },
    // Exercices mixtes
    {
      id: 9,
      type: 'addition',
      operation: '456 + 377',
      number1: 456,
      number2: 377,
      answer: 833,
      difficulty: 'Difficile',
      explanation: 'Retenues multiples : 6+7=13, 5+7+1=13, 4+3+1=8',
      steps: [
        'Unités : 6 + 7 = 13 → je pose 3, retenue 1',
        'Dizaines : 5 + 7 + 1 = 13 → je pose 3, retenue 1',
        'Centaines : 4 + 3 + 1 = 8'
      ]
    },
    {
      id: 10,
      type: 'soustraction',
      operation: '800 - 456',
      number1: 800,
      number2: 456,
      answer: 344,
      difficulty: 'Difficile',
      explanation: 'Retenues multiples avec zéros : j\'emprunte successivement',
      steps: [
        'Unités : 10 - 6 = 4 (j\'ai emprunté 1 dizaine)',
        'Dizaines : 10 - 5 - 1 = 4 (j\'ai emprunté 1 centaine)',
        'Centaines : 7 - 4 = 3'
      ]
    }
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correct = userNum === getCurrentExercise().answer;
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    setCurrentExercise(currentExercise + 1);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
  };

  const resetExercise = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
  };

  const resetDemo = () => {
    setAnimationStep(0);
  };

  const nextStep = () => {
    const maxSteps = activeDemo.includes('addition') ? 4 : 4;
    if (animationStep < maxSteps - 1) {
      setAnimationStep(animationStep + 1);
    }
  };

  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
    }
  };

  const getMaxSteps = () => {
    return activeDemo.includes('decimaux') ? 5 : 4;
  };

  const MethodeAddition = ({ withCarry = false }) => {
    const number1 = withCarry ? 178 : 234;
    const number2 = withCarry ? 147 : 125;
    const result = withCarry ? 325 : 359;
    
    const steps = withCarry ? [
      'Je place les nombres en colonne, unités sous unités',
      'Unités : 8 + 7 = 15. Je pose 5, je retiens 1',
      'Dizaines : 7 + 4 + 1 (retenue) = 12. Je pose 2, je retiens 1',
      'Centaines : 1 + 1 + 1 (retenue) = 3'
    ] : [
      'Je place les nombres en colonne, unités sous unités',
      'Unités : 4 + 5 = 9',
      'Dizaines : 3 + 2 = 5',
      'Centaines : 2 + 1 = 3'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-bold text-blue-900 mb-4">
            {withCarry ? 'Addition avec retenue' : 'Addition sans retenue'}
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-2xl space-y-2">
                {/* Premier nombre */}
                <div className="flex justify-end space-x-2">
                  <div className="inline-block w-8 relative">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {Math.floor(number1 / 100)}
                    </span>
                    {withCarry && animationStep >= 2 && (
                      <span className="absolute -left-1 top-0 text-xl text-red-600 font-bold animate-bounce">¹</span>
                    )}
                  </div>
                  <div className="inline-block w-8 relative">
                    <span className={`${animationStep >= 2 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {Math.floor((number1 % 100) / 10)}
                    </span>
                    {withCarry && animationStep >= 1 && (
                      <span className="absolute -left-1 top-0 text-xl text-red-600 font-bold animate-bounce">¹</span>
                    )}
                  </div>
                  <span className={`inline-block w-8 ${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    {number1 % 10}
                  </span>
                </div>
                
                {/* Second nombre */}
                <div className="flex justify-end space-x-2">
                  <span className="text-gray-800">+</span>
                  <span className={`inline-block w-8 ${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    {Math.floor(number2 / 100)}
                  </span>
                  <span className={`inline-block w-8 ${animationStep >= 2 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    {Math.floor((number2 % 100) / 10)}
                  </span>
                  <span className={`inline-block w-8 ${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                    {number2 % 10}
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Résultat */}
                <div className="flex justify-end space-x-2">
                  <span className={`inline-block w-8 ${animationStep >= 3 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 3 ? Math.floor(result / 100) : ''}
                  </span>
                  <span className={`inline-block w-8 ${animationStep >= 2 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 2 ? Math.floor((result % 100) / 10) : ''}
                  </span>
                  <span className={`inline-block w-8 ${animationStep >= 1 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                    {animationStep >= 1 ? result % 10 : ''}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MethodeSoustraction = ({ withCarry = false }) => {
    const number1 = withCarry ? 523 : 789;
    const number2 = withCarry ? 147 : 234;
    const result = withCarry ? 376 : 555;
    
    // Pour la méthode française avec retenue
    const getDisplayedDigit = (position: number, step: number) => {
      if (!withCarry) return Math.floor(number1 / Math.pow(10, position)) % 10;
      
      if (position === 0) return 3; // unités : toujours 3
      if (position === 1) return step >= 1 ? 1 : 2; // dizaines : 2 devient 1 après emprunt
      if (position === 2) return step >= 2 ? 4 : 5; // centaines : 5 devient 4 après emprunt
      return 0;
    };
    
    // Pour le nombre du bas (avec ajout des emprunts)
    const getBottomDigit = (position: number, step: number) => {
      if (!withCarry) return Math.floor(number2 / Math.pow(10, position)) % 10;
      
      if (position === 0) return 7; // unités : toujours 7
      if (position === 1) return step >= 1 ? 5 : 4; // dizaines : 4 + 1 (emprunté des unités) = 5
      if (position === 2) return step >= 2 ? 2 : 1; // centaines : 1 + 1 (emprunté des dizaines) = 2
      return 0;
    };
    
    const steps = withCarry ? [
      'Je place les nombres en colonne, unités sous unités',
      'Unités : 3 < 7, j\'emprunte 1 dizaine au 2. J\'ajoute ce 1 au 4 → 5. Puis 13 - 7 = 6',
      'Dizaines : 1 < 5, j\'emprunte 1 centaine au 5. J\'ajoute ce 1 au 1 → 2. Puis 11 - 5 = 6',
      'Centaines : 4 - 2 = 2'
    ] : [
      'Je place les nombres en colonne, unités sous unités',
      'Unités : 9 - 4 = 5',
      'Dizaines : 8 - 3 = 5',
      'Centaines : 7 - 2 = 5'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-red-50 p-6 rounded-lg">
          <h4 className="font-bold text-red-900 mb-4">
            {withCarry ? 'Soustraction avec retenue' : 'Soustraction sans retenue'}
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-2xl space-y-2">
                {/* Premier nombre avec méthode française */}
                <div className="flex justify-end space-x-0">
                  <div className="w-8 text-center"></div>
                  <div className="w-12 text-center relative">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {getDisplayedDigit(2, animationStep)}
                    </span>
                  </div>
                  <div className="w-12 text-center relative">
                    <span className={`${animationStep >= 2 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {withCarry && animationStep >= 2 ? (
                        <span><span className="text-sm text-red-600 font-bold">¹</span>1</span>
                      ) : getDisplayedDigit(1, animationStep)}
                    </span>
                  </div>
                  <div className="w-12 text-center relative">
                    <span className={`${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {withCarry && animationStep >= 1 ? (
                        <span><span className="text-sm text-red-600 font-bold">¹</span>3</span>
                      ) : getDisplayedDigit(0, animationStep)}
                    </span>
                  </div>
                </div>
                
                {/* Second nombre - avec ajout des emprunts */}
                <div className="flex justify-end space-x-0">
                  <div className="w-8 text-center">
                    <span className="text-gray-800">-</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {getBottomDigit(2, animationStep)}
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 2 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {getBottomDigit(1, animationStep)}
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {getBottomDigit(0, animationStep)}
                    </span>
                  </div>
                </div>
                
                <div className="border-t-2 border-gray-400"></div>
                
                {/* Résultat */}
                <div className="flex justify-end space-x-0">
                  <div className="w-8 text-center"></div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-green-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                      {animationStep >= 3 ? Math.floor(result / 100) : ''}
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 2 ? 'bg-green-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                      {animationStep >= 2 ? Math.floor((result % 100) / 10) : ''}
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 1 ? 'bg-green-200 text-gray-800 font-bold' : 'text-gray-800'}`}>
                      {animationStep >= 1 ? result % 10 : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-red-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MethodeAdditionDecimaux = () => {
    const number1 = 12.45;
    const number2 = 8.37;
    const result = 20.82;
    
    const steps = [
      'Je place les nombres en colonne, virgule sous virgule',
      'Centièmes : 5 + 7 = 12. Je pose 2, je retiens 1',
      'Dixièmes : 4 + 3 + 1 (retenue) = 8',
      'Unités : 2 + 8 = 10. Je pose 0, je retiens 1',
      'Dizaines : 1 + 0 + 1 (retenue) = 2'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-bold text-green-900 mb-4">
            Addition de nombres décimaux
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-2xl space-y-1">
                {/* Ligne des retenues */}
                <div className="flex justify-center space-x-0 h-8">
                  <div className="w-8 text-center"></div>
                  <div className="w-12 text-center relative">
                    {animationStep >= 3 && (
                      <span className="text-lg text-red-600 font-bold animate-pulse bg-red-100 px-2 py-1 rounded">¹</span>
                    )}
                  </div>
                  <div className="w-12 text-center relative">
                    {/* Unités - pas de retenue ici */}
                  </div>
                  <div className="w-4 text-center"></div>
                  <div className="w-12 text-center relative">
                    {animationStep >= 1 && (
                      <span className="text-lg text-red-600 font-bold animate-pulse bg-red-100 px-2 py-1 rounded">¹</span>
                    )}
                  </div>
                  <div className="w-12 text-center"></div>
                </div>
                
                {/* Premier nombre */}
                <div className="flex justify-center space-x-0">
                  <div className="w-8 text-center"></div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 4 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      1
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      2
                    </span>
                  </div>
                  <div className="w-4 text-center">
                    <span className="text-gray-800">,</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 2 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      4
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      5
                    </span>
                  </div>
                </div>
                
                {/* Second nombre */}
                <div className="flex justify-center space-x-0">
                  <div className="w-8 text-center">
                    <span className="text-gray-800">+</span>
                  </div>
                  <div className="w-12 text-center"></div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      8
                    </span>
                  </div>
                  <div className="w-4 text-center">
                    <span className="text-gray-800">,</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 2 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      3
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      7
                    </span>
                  </div>
                </div>
                
                <div className="border-t-2 border-gray-400 mx-4"></div>
                
                {/* Résultat */}
                <div className="flex justify-center space-x-0">
                  <div className="w-8 text-center"></div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 4 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 4 ? '2' : ''}
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 3 ? '0' : ''}
                    </span>
                  </div>
                  <div className="w-4 text-center">
                    <span className="text-gray-800">,</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 2 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 2 ? '8' : ''}
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 1 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 1 ? '2' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-green-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MethodeSoustractionDecimaux = () => {
    const number1 = 15.64;
    const number2 = 7.28;
    const result = 8.36;
    
    const steps = [
      'Je place les nombres en colonne, virgule sous virgule',
      'Centièmes : 4 - 8 impossible, j\'emprunte 1 dixième. ¹4 - 8 = 6',
      'Dixièmes : 5 - 2 = 3 (après avoir emprunté 1 dixième)',
      'Unités : 5 - 7 impossible, j\'emprunte 1 dizaine. ¹5 - 7 = 8'
    ];

    return (
      <div className="space-y-4">
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="font-bold text-purple-900 mb-4">
            Soustraction de nombres décimaux
          </h4>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="font-mono text-2xl space-y-1">
                {/* Premier nombre */}
                <div className="flex justify-center space-x-0">
                  <div className="w-8 text-center"></div>
                  <div className="w-12 text-center relative">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 3 ? '0' : '1'}
                    </span>
                    {animationStep >= 3 && (
                      <span className="absolute -bottom-2 -right-2 text-xs text-red-600 line-through">1</span>
                    )}
                  </div>
                  <div className="w-12 text-center relative">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      5
                    </span>
                    {animationStep >= 3 && (
                      <span className="absolute -top-2 -left-2 text-xs text-blue-600 font-bold">¹</span>
                    )}
                  </div>
                  <div className="w-4 text-center">
                    <span className="text-gray-800">,</span>
                  </div>
                  <div className="w-12 text-center relative">
                    <span className={`${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 1 ? '5' : '6'}
                    </span>
                    {animationStep >= 1 && (
                      <span className="absolute -bottom-2 -right-2 text-xs text-red-600 line-through">6</span>
                    )}
                  </div>
                  <div className="w-12 text-center relative">
                    <span className={`${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      4
                    </span>
                    {animationStep >= 1 && (
                      <span className="absolute -top-2 -left-2 text-xs text-blue-600 font-bold">¹</span>
                    )}
                  </div>
                </div>
                
                {/* Second nombre */}
                <div className="flex justify-center space-x-0">
                  <div className="w-8 text-center">
                    <span className="text-gray-800">-</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      0
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      7
                    </span>
                  </div>
                  <div className="w-4 text-center">
                    <span className="text-gray-800">,</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 2 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      2
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 1 ? 'bg-yellow-200 text-gray-800' : 'text-gray-800'}`}>
                      8
                    </span>
                  </div>
                </div>
                
                <div className="border-t-2 border-gray-400 mx-4"></div>
                
                {/* Résultat */}
                <div className="flex justify-center space-x-0">
                  <div className="w-8 text-center"></div>
                  <div className="w-12 text-center"></div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 3 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 3 ? '8' : ''}
                    </span>
                  </div>
                  <div className="w-4 text-center">
                    <span className="text-gray-800">,</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 2 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 2 ? '3' : ''}
                    </span>
                  </div>
                  <div className="w-12 text-center">
                    <span className={`${animationStep >= 1 ? 'bg-green-200 text-gray-800' : 'text-gray-800'}`}>
                      {animationStep >= 1 ? '6' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white p-4 rounded border-l-4 border-purple-500">
                <p className="text-sm font-medium text-gray-800">
                  {steps[animationStep] || steps[0]}
                </p>
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
            Addition et soustraction en colonne
          </h1>
          <p className="text-gray-600">
            Maîtrise les techniques de calcul en colonne avec et sans retenue
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  onClick={() => { setActiveDemo('addition-sans-retenue'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'addition-sans-retenue' 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-200 hover:border-blue-300 bg-white text-gray-800'
                  }`}
                >
                  <Plus className={`w-8 h-8 mx-auto mb-2 ${
                    activeDemo === 'addition-sans-retenue' ? 'text-white' : 'text-blue-500'
                  }`} />
                  <span className="text-sm font-medium">Addition sans retenue</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('addition-avec-retenue'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'addition-avec-retenue' 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-200 hover:border-blue-300 bg-white text-gray-800'
                  }`}
                >
                  <Plus className={`w-8 h-8 mx-auto mb-2 ${
                    activeDemo === 'addition-avec-retenue' ? 'text-white' : 'text-blue-500'
                  }`} />
                  <span className="text-sm font-medium">Addition avec retenue</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('soustraction-sans-retenue'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'soustraction-sans-retenue' 
                      ? 'border-red-500 bg-red-500 text-white' 
                      : 'border-gray-200 hover:border-red-300 bg-white text-gray-800'
                  }`}
                >
                  <Minus className={`w-8 h-8 mx-auto mb-2 ${
                    activeDemo === 'soustraction-sans-retenue' ? 'text-white' : 'text-red-500'
                  }`} />
                  <span className="text-sm font-medium">Soustraction sans retenue</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('soustraction-avec-retenue'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'soustraction-avec-retenue' 
                      ? 'border-red-500 bg-red-500 text-white' 
                      : 'border-gray-200 hover:border-red-300 bg-white text-gray-800'
                  }`}
                >
                  <Minus className={`w-8 h-8 mx-auto mb-2 ${
                    activeDemo === 'soustraction-avec-retenue' ? 'text-white' : 'text-red-500'
                  }`} />
                  <span className="text-sm font-medium">Soustraction avec retenue</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('addition-decimaux'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'addition-decimaux' 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-200 hover:border-green-300 bg-white text-gray-800'
                  }`}
                >
                  <Plus className={`w-8 h-8 mx-auto mb-2 ${
                    activeDemo === 'addition-decimaux' ? 'text-white' : 'text-green-500'
                  }`} />
                  <span className="text-sm font-medium">Addition décimaux</span>
                </button>
                <button
                  onClick={() => { setActiveDemo('soustraction-decimaux'); resetDemo(); }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === 'soustraction-decimaux' 
                      ? 'border-purple-500 bg-purple-500 text-white' 
                      : 'border-gray-200 hover:border-purple-300 bg-white text-gray-800'
                  }`}
                >
                  <Minus className={`w-8 h-8 mx-auto mb-2 ${
                    activeDemo === 'soustraction-decimaux' ? 'text-white' : 'text-purple-500'
                  }`} />
                  <span className="text-sm font-medium">Soustraction décimaux</span>
                </button>
              </div>
            </div>

            {/* Animation controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Exemple étape par étape</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Étape {animationStep + 1} sur {getMaxSteps()}
                  </span>
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
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
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
              {activeDemo === 'addition-sans-retenue' && <MethodeAddition withCarry={false} />}
              {activeDemo === 'addition-avec-retenue' && <MethodeAddition withCarry={true} />}
              {activeDemo === 'soustraction-sans-retenue' && <MethodeSoustraction withCarry={false} />}
              {activeDemo === 'soustraction-avec-retenue' && <MethodeSoustraction withCarry={true} />}
              {activeDemo === 'addition-decimaux' && <MethodeAdditionDecimaux />}
              {activeDemo === 'soustraction-decimaux' && <MethodeSoustractionDecimaux />}
            </div>

            {/* Règles importantes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Règles importantes à retenir</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Pour l'addition :
                  </h4>
                                     <ul className="space-y-2 text-sm text-gray-700">
                     <li className="flex items-start gap-2">
                       <span className="text-blue-600">•</span>
                       Toujours commencer par la colonne des unités (à droite)
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-600">•</span>
                       Si la somme ≥ 10, je pose le chiffre des unités et je reporte la retenue
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-600">•</span>
                       Ne pas oublier d'ajouter la retenue à la colonne suivante
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-blue-600">•</span>
                       Vérifier en refaisant l'addition dans l'autre sens
                     </li>
                   </ul>
                 </div>
                 <div className="space-y-3">
                   <h4 className="font-semibold text-red-600 flex items-center gap-2">
                     <Minus className="w-5 h-5" />
                     Pour la soustraction :
                   </h4>
                   <ul className="space-y-2 text-sm text-gray-700">
                     <li className="flex items-start gap-2">
                       <span className="text-red-600">•</span>
                       Toujours commencer par la colonne des unités (à droite)
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-red-600">•</span>
                       Si le chiffre du haut &lt; chiffre du bas, j'emprunte 1 à la colonne de gauche
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-red-600">•</span>
                       Diminuer de 1 le chiffre de la colonne où j'ai emprunté
                     </li>
                     <li className="flex items-start gap-2">
                       <span className="text-red-600">•</span>
                       Vérifier en faisant : résultat + nombre soustrait = nombre initial
                     </li>
                   </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Addition décimaux :
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Aligner les virgules l'une sous l'autre
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Commencer par la colonne des centièmes (la plus à droite)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      La virgule du résultat est alignée avec les autres
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Même principe de retenue que pour les entiers
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-600 flex items-center gap-2">
                    <Minus className="w-5 h-5" />
                    Soustraction décimaux :
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      Aligner les virgules l'une sous l'autre
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      Commencer par la colonne des centièmes (la plus à droite)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      La virgule du résultat est alignée avec les autres
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      Même principe d'emprunt que pour les entiers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Exercices section
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Exercice {currentExercise + 1} sur {exercises.length}
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
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Exercise */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                {getCurrentExercise().type === 'addition' ? (
                  <Plus className="w-6 h-6 text-blue-500" />
                ) : (
                  <Minus className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-lg font-bold text-gray-800">
                  {getCurrentExercise().type === 'addition' ? 'Addition' : 'Soustraction'} en colonne
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center"
                    placeholder="Tapez votre réponse..."
                    disabled={showAnswer}
                  />
                </div>

                {!showAnswer ? (
                  <div className="flex gap-3">
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                      className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Vérifier
                    </button>
                    <button
                      onClick={resetExercise}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Reset
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                        <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {isCorrect ? 'Correct !' : 'Incorrect'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <p className="text-red-800">
                          La bonne réponse est : <span className="font-bold text-red-900">{getCurrentExercise().answer}</span>
                        </p>
                      )}
                      <p className="text-gray-800 mt-2">
                        {getCurrentExercise().explanation}
                      </p>
                      
                      {/* Étapes détaillées */}
                      <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-400">
                        <h4 className="font-semibold text-gray-800 mb-2">Étapes du calcul :</h4>
                        <ol className="text-sm space-y-1">
                          {getCurrentExercise().steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">{index + 1}.</span>
                              <span className="text-gray-800">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={nextExercise}
                          className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          Exercice suivant
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                      ) : (
                        <Link
                          href="/chapitre/cm1-operations-arithmetiques"
                          className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trophy className="w-5 h-5" />
                          Chapitre terminé !
                        </Link>
                      )}
                      <button
                        onClick={resetExercise}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Recommencer
                      </button>
                    </div>
                  </div>
                )}
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
                  <h4 className="font-semibold text-gray-700">✅ Addition en colonnes :</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Aligne bien les chiffres par position</li>
                    <li>• Commence toujours par la droite (unités)</li>
                    <li>• N'oublie pas de reporter les retenues</li>
                    <li>• Vérifie ton calcul en additionnant dans l'autre sens</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">➖ Soustraction en colonnes :</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Aligne bien les chiffres par position</li>
                    <li>• Commence toujours par la droite (unités)</li>
                    <li>• Si nécessaire, emprunte à la colonne de gauche</li>
                    <li>• Vérifie en faisant l'addition : résultat + nombre soustrait</li>
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