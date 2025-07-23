'use client';

import { useState } from 'react';
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

export default function AdditionFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'addition';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 15; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      score: finalScore,
      maxScore,
      attempts: 1,
      completed: true,
      completionDate: new Date().toISOString(),
      xpEarned: earnedXP
    };

    // Sauvegarder dans localStorage
    const savedProgress = localStorage.getItem('ce1-fractions-simples-progress');
    let allProgress = [];
    
    if (savedProgress) {
      allProgress = JSON.parse(savedProgress);
    }
    
    // Mettre à jour ou ajouter le progrès de cette section
    const existingIndex = allProgress.findIndex((p: any) => p.sectionId === sectionId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressData;
    } else {
      allProgress.push(progressData);
    }
    
    localStorage.setItem('ce1-fractions-simples-progress', JSON.stringify(allProgress));
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('storage'));
  };

  const examples = [
    { 
      fraction1: '1/4', 
      fraction2: '1/4', 
      result: '2/4', 
      explanation: 'On additionne les parts : 1 + 1 = 2'
    },
    { 
      fraction1: '1/3', 
      fraction2: '1/3', 
      result: '2/3', 
      explanation: 'On additionne les parts : 1 + 1 = 2'
    },
    { 
      fraction1: '2/6', 
      fraction2: '1/6', 
      result: '3/6', 
      explanation: 'On additionne les parts : 2 + 1 = 3'
    }
  ];

  const exercises: Exercise[] = [
    {
      question: 'Calcule : 1/4 + 1/4 = ?',
      fraction1: '1/4',
      fraction2: '1/4',
      correctAnswer: '2/4',
      hint: 'On additionne les nombres du haut : 1 + 1 = 2, le nombre du bas reste le même',
      hasVisual: true
    },
    {
      question: 'Calcule : 1/3 + 1/3 = ?',
      fraction1: '1/3',
      fraction2: '1/3',
      correctAnswer: '2/3',
      hint: 'On additionne les nombres du haut : 1 + 1 = 2, le nombre du bas reste 3',
      hasVisual: true
    },
    {
      question: 'Calcule : 1/6 + 2/6 = ?',
      fraction1: '1/6',
      fraction2: '2/6',
      correctAnswer: '3/6',
      hint: 'On additionne les nombres du haut : 1 + 2 = 3, le nombre du bas reste 6',
      hasVisual: true
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{5} + \\frac{1}{5} = ?',
      correctAnswer: '2/5',
      hint: 'On additionne les numérateurs : 1 + 1 = 2, le dénominateur reste 5',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{8} + \\frac{1}{8} = ?',
      correctAnswer: '3/8',
      hint: 'On additionne les numérateurs : 2 + 1 = 3, le dénominateur reste 8',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{4} + \\frac{2}{4} = ?',
      correctAnswer: '3/4',
      hint: 'On additionne les numérateurs : 1 + 2 = 3, le dénominateur reste 4',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{3}{6} + \\frac{1}{6} = ?',
      correctAnswer: '4/6',
      hint: 'On additionne les numérateurs : 3 + 1 = 4, le dénominateur reste 6',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{5} + \\frac{2}{5} = ?',
      correctAnswer: '4/5',
      hint: 'On additionne les numérateurs : 2 + 2 = 4, le dénominateur reste 5',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{7} + \\frac{3}{7} = ?',
      correctAnswer: '4/7',
      hint: 'On additionne les numérateurs : 1 + 3 = 4, le dénominateur reste 7',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{9} + \\frac{1}{9} = ?',
      correctAnswer: '3/9',
      hint: 'On additionne les numérateurs : 2 + 1 = 3, le dénominateur reste 9',
      hasVisual: false
    }
  ];

  // Fonction pour créer la visualisation SVG des fractions en pie chart
  const renderFractionVisual = (fraction: string, x: number, color: string) => {
    const [numerator, denominator] = fraction.split('/').map(Number);
    const radius = 35;
    const centerX = x;
    const centerY = 50;
    
    const svgParts = [];
      const anglePerPart = 360 / denominator;
      
      for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerPart - 90; // Commence en haut (-90°)
        const endAngle = (i + 1) * anglePerPart - 90;
        
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
        
        const largeArcFlag = anglePerPart > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`, // Move to center
        `L ${x1} ${y1}`, // Line to start of arc
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
        'Z' // Close path
      ].join(' ');
      
      const fillColor = i < numerator ? color : '#f3f4f6';
      const strokeColor = '#6b7280';
        
        svgParts.push(
          <path
            key={i}
            d={pathData}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          />
        );
      }
      
      return svgParts;
    };

  const renderFractionVisualExample = (fraction1: string, fraction2: string, result?: string) => {
    return (
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderFractionVisual(fraction1, 40, "#ef4444")}
          </svg>
          <div className="mt-2">
            <FractionMath a={fraction1.split('/')[0]} b={fraction1.split('/')[1]} size="text-lg" />
          </div>
        </div>
        <div className="text-3xl font-bold text-red-600">+</div>
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderFractionVisual(fraction2, 40, "#3b82f6")}
          </svg>
          <div className="mt-2">
            <FractionMath a={fraction2.split('/')[0]} b={fraction2.split('/')[1]} size="text-lg" />
          </div>
        </div>
        {result && (
          <>
            <div className="text-3xl font-bold text-red-600">=</div>
            <div className="text-center">
              <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
                {renderFractionVisual(result, 40, "#10b981")}
              </svg>
              <div className="mt-2">
                <FractionMath a={result.split('/')[0]} b={result.split('/')[1]} size="text-lg" />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const checkAnswer = () => {
    const userAnswer = `${numerator}/${denominator}`;
      const correct = userAnswer === exercises[currentExercise].correctAnswer;
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
      }

      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setNumerator('');
            setDenominator('');
            setIsCorrect(null);
            setShowHint(false);
          } else {
            const newFinalScore = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(newFinalScore);
            saveProgress(newFinalScore); // Sauvegarder les XP
            setShowCompletionModal(true);
          }
        }, 1500);
      }
  };

  const handleNext = () => {
    if (isCorrect !== null) {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setNumerator('');
        setDenominator('');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setFinalScore(score);
        saveProgress(score); // Sauvegarder les XP
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setNumerator('');
    setDenominator('');
    setIsCorrect(null);
    setShowHint(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🧮 Addition de fractions simples
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Apprends à additionner des fractions qui ont le même dénominateur !
            </p>
              </div>
            </div>

        {/* Onglets Cours/Exercices */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Règle principale */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Règle d'or pour additionner des fractions
              </h2>
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-center">
                  <div className="text-xl font-bold text-blue-800 mb-4">
                    Pour additionner deux fractions avec le même dénominateur :
                  </div>
                  <div className="text-lg text-blue-700 mb-4">
                    ✅ On additionne les numérateurs (nombres du haut)
                  </div>
                  <div className="text-lg text-blue-700">
                    ✅ On garde le même dénominateur (nombre du bas)
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples visuels */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Exemples avec visualisation
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        <FractionMath a={example.fraction1.split('/')[0]} b={example.fraction1.split('/')[1]} size="text-2xl" />
                        <span className="mx-1 text-2xl align-middle">+</span>
                        <FractionMath a={example.fraction2.split('/')[0]} b={example.fraction2.split('/')[1]} size="text-2xl" />
                        <span className="mx-1 text-2xl align-middle">=</span>
                        <FractionMath a={example.result.split('/')[0]} b={example.result.split('/')[1]} size="text-2xl" />
                      </h3>
                      <div className="mb-4">
                        {renderFractionVisualExample(example.fraction1, example.fraction2, example.result)}
                      </div>
                      <p className="text-sm text-gray-600 bg-yellow-100 p-3 rounded-lg">
                        {example.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
                </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">💡 Conseils pour réussir</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Vérifie que les dénominateurs sont identiques
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Additionne seulement les numérateurs
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Le dénominateur reste le même
                  </li>
                </ul>
                <ul className="space-y-2">
                                     <li className="flex items-start">
                     <span className="text-yellow-200 mr-2">•</span>
                     <span className="flex items-center">
                       Exemple : 
                       <span className="ml-2 flex items-center space-x-1">
                         <FractionMath a="1" b="4" size="text-sm" />
                         <span>+</span>
                         <FractionMath a="1" b="4" size="text-sm" />
                         <span>=</span>
                         <FractionMath a="2" b="4" size="text-sm" />
                       </span>
                     </span>
                   </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Utilise les dessins pour t'aider
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Vérifie toujours ton résultat
                  </li>
                </ul>
              </div>
            </div>

            {/* Méthode étape par étape */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📝 Méthode étape par étape
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h3 className="font-bold text-red-800 mb-2">Vérifier</h3>
                  <p className="text-red-700 text-sm">Les dénominateurs sont-ils identiques ?</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h3 className="font-bold text-blue-800 mb-2">Additionner</h3>
                  <p className="text-blue-700 text-sm">Additionne les numérateurs</p>
            </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h3 className="font-bold text-green-800 mb-2">Conserver</h3>
                  <p className="text-green-700 text-sm">Garde le même dénominateur</p>
                  </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">4️⃣</div>
                  <h3 className="font-bold text-purple-800 mb-2">Vérifier</h3>
                  <p className="text-purple-700 text-sm">Contrôle ton résultat</p>
                </div>
              </div>
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
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                             <div className="text-center mb-6">
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">
                   {exercises[currentExercise].hasVisual && exercises[currentExercise].fraction1 && exercises[currentExercise].fraction2 ? (
                     <div className="flex items-center justify-center space-x-3">
                       <span>Calcule :</span>
                       <FractionMath a={exercises[currentExercise].fraction1!.split('/')[0]} b={exercises[currentExercise].fraction1!.split('/')[1]} size="text-2xl" />
                       <span>+</span>
                       <FractionMath a={exercises[currentExercise].fraction2!.split('/')[0]} b={exercises[currentExercise].fraction2!.split('/')[1]} size="text-2xl" />
                       <span>=</span>
                       <span>?</span>
                     </div>
                   ) : (
                     exercises[currentExercise].question
                   )}
                 </h3>

                {/* Visualisation si applicable */}
                {exercises[currentExercise].hasVisual && exercises[currentExercise].fraction1 && exercises[currentExercise].fraction2 && (
                  <div className="mb-6">
                    {renderFractionVisualExample(
                      exercises[currentExercise].fraction1!, 
                      exercises[currentExercise].fraction2!
                    )}
                  </div>
                )}

                                 {/* Expression mathématique si applicable */}
                 {exercises[currentExercise].mathExpression && (
                   <div className="text-3xl font-bold text-gray-800 mb-6">
                     {(() => {
                       const expression = exercises[currentExercise].mathExpression!;
                       // Parse \\frac{1}{5} + \\frac{1}{5} = ?
                       const fractionPattern = /\\frac\{(\d+)\}\{(\d+)\}/g;
                       const matches = [];
                       let match;
                       
                       while ((match = fractionPattern.exec(expression)) !== null) {
                         matches.push(match);
                       }
                       
                       if (matches.length >= 2) {
                         const [num1, den1] = [matches[0][1], matches[0][2]];
                         const [num2, den2] = [matches[1][1], matches[1][2]];
                         
                         return (
                           <div className="flex items-center justify-center space-x-4">
                             <FractionMath a={num1} b={den1} size="text-3xl" />
                             <span className="text-3xl">+</span>
                             <FractionMath a={num2} b={den2} size="text-3xl" />
                             <span className="text-3xl">=</span>
                             <span className="text-3xl">?</span>
                           </div>
                         );
                       }
                       
                       return <div>{expression}</div>;
                     })()}
                   </div>
                 )}

                                 {/* Template de réponse fraction */}
                 <div className="flex flex-col items-center mb-6">
                   <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
                     <input
                       type="text"
                       value={numerator}
                       onChange={(e) => setNumerator(e.target.value)}
                       onKeyPress={(e) => {
                         if (e.key === 'Enter' && numerator.trim() && denominator.trim() && isCorrect === null) {
                           checkAnswer();
                         }
                       }}
                       placeholder="?"
                       className="w-16 sm:w-20 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none mb-2 touch-manipulation"
                       disabled={isCorrect !== null}
                     />
                     <div className="w-20 sm:w-24 h-1 bg-gray-800 mb-2"></div>
                     <input
                       type="text"
                       value={denominator}
                       onChange={(e) => setDenominator(e.target.value)}
                       onKeyPress={(e) => {
                         if (e.key === 'Enter' && numerator.trim() && denominator.trim() && isCorrect === null) {
                           checkAnswer();
                         }
                       }}
                       placeholder="?"
                       className="w-16 sm:w-20 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none touch-manipulation"
                       disabled={isCorrect !== null}
                     />
                   </div>
                 </div>

                                 {/* Affichage de l'indice */}
                 {showHint && (
                   <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                     <div className="flex">
                       <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                       <p className="text-yellow-800">{exercises[currentExercise].hint}</p>
                     </div>
                   </div>
                 )}

                 {/* Navigation */}
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4">
                   {/* Bouton indice */}
                   {!showHint && isCorrect === null && (
              <button
                       onClick={() => setShowHint(true)}
                       className="bg-yellow-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
              >
                <Lightbulb className="inline w-4 h-4 mr-2" />
                       Aide
              </button>
                   )}
              <button
                onClick={resetExercise}
                     className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
              >
                Effacer
              </button>
                   <button
                     onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                     disabled={currentExercise === 0}
                     className="bg-gray-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                   >
                     ← Précédent
                   </button>
                   <button
                     onClick={() => {
                       // Si l'utilisateur a rempli les champs mais n'a pas encore vérifié, on vérifie d'abord
                       if (numerator.trim() && denominator.trim() && isCorrect === null) {
                         checkAnswer();
                       } else {
                         handleNext();
                       }
                     }}
                     disabled={isCorrect === null && (!numerator.trim() || !denominator.trim())}
                     className="bg-red-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                   >
                     {numerator.trim() && denominator.trim() && isCorrect === null 
                       ? '✅ Vérifier' 
                       : currentExercise + 1 < exercises.length 
                         ? 'Suivant →' 
                         : 'Terminer ✨'}
                   </button>
                </div>
              </div>

              {/* Résultat */}
            {isCorrect !== null && (
                <div className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold">Fantastique ! Tu maîtrises l'addition !</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span className="font-bold">
                        Pas tout à fait ! La bonne réponse est : {exercises[currentExercise].correctAnswer}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
            </div>


          </div>
        )}

        {/* Modal de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { 
                    title: "🧮 Expert en fractions !", 
                    message: "Tu maîtrises parfaitement l'addition de fractions !", 
                    color: "text-green-600",
                    bgColor: "bg-green-50" 
                  };
                  if (percentage >= 70) return { 
                    title: "🎯 Très bien !", 
                    message: "Tu comprends bien les fractions !", 
                    color: "text-red-600",
                    bgColor: "bg-red-50" 
                  };
                  if (percentage >= 50) return { 
                    title: "📚 En progression !", 
                    message: "Continue à t'entraîner avec les fractions !", 
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50" 
                  };
                  return { 
                    title: "💪 Continue !", 
                    message: "Les fractions demandent de l'entraînement !", 
                    color: "text-gray-600",
                    bgColor: "bg-gray-50" 
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
                         🌟 {Math.round(15 * (finalScore / exercises.length))} XP gagnés !
                </p>
              </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center">
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
                        className="bg-red-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-red-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
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
      </div>
    </div>
  );
} 