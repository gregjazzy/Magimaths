'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';



export default function PartageEquitablePage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [divisionAnswer, setDivisionAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [step, setStep] = useState<'divide' | 'color'>('divide');

  const examples = [
    { description: 'Partager une pizza en 2 parts égales', totalParts: 2, partsToColor: 1, name: 'moitié' },
    { description: 'Partager un gâteau en 4 parts égales', totalParts: 4, partsToColor: 1, name: 'quart' },
    { description: 'Partager une tablette en 3 parts égales', totalParts: 3, partsToColor: 1, name: 'tiers' },
    { description: 'Partager une tarte en 6 parts égales', totalParts: 6, partsToColor: 1, name: 'sixième' }
  ];

  const exercises = [
    { 
      question: 'Comment diviser cette pizza en 2 parts égales ?',
      divisionQuestion: 'Comment diviser un cercle en 2 parts égales ?',
      divisionOptions: [
        'Tracer une ligne droite qui passe par le centre',
        'Tracer deux lignes qui se croisent',
        'Tracer une ligne courbe',
        'Découper en petits morceaux'
      ],
      correctDivisionAnswer: 'Tracer une ligne droite qui passe par le centre',
      colorQuestion: 'Maintenant colorie 1 part',
      totalParts: 2, 
      partsToColor: 1, 
      hint: 'Une ligne droite qui passe par le centre divise le cercle en 2 moitiés égales',
      shape: 'circle'
    },
    { 
      question: 'Comment diviser ce carré en 4 parts égales ?',
      divisionQuestion: 'Comment diviser un carré en 4 parts égales ?',
      divisionOptions: [
        'Tracer une croix (ligne verticale + ligne horizontale)',
        'Tracer seulement une ligne verticale',
        'Tracer seulement une ligne horizontale',
        'Tracer des lignes diagonales'
      ],
      correctDivisionAnswer: 'Tracer une croix (ligne verticale + ligne horizontale)',
      colorQuestion: 'Maintenant colorie 1 part',
      totalParts: 4, 
      partsToColor: 1, 
      hint: 'Une croix divise le carré en 4 parts égales appelées quarts',
      shape: 'square'
    },
    { 
      question: 'Comment diviser ce rectangle en 3 parts égales ?',
      divisionQuestion: 'Comment diviser un rectangle en 3 parts égales ?',
      divisionOptions: [
        'Tracer 2 lignes verticales pour faire 3 bandes',
        'Tracer 3 lignes verticales',
        'Tracer 2 lignes horizontales',
        'Tracer des lignes diagonales'
      ],
      correctDivisionAnswer: 'Tracer 2 lignes verticales pour faire 3 bandes',
      colorQuestion: 'Maintenant colorie 2 parts',
      totalParts: 3, 
      partsToColor: 2, 
      hint: 'Pour 3 parts égales, il faut 2 lignes qui créent 3 bandes de même largeur',
      shape: 'rectangle'
    },
    { 
      question: 'Comment diviser ce cercle en 4 parts égales ?',
      divisionQuestion: 'Comment diviser un cercle en 4 parts égales ?',
      divisionOptions: [
        'Tracer deux lignes qui se croisent au centre',
        'Tracer une seule ligne au centre',
        'Tracer trois lignes depuis le centre',
        'Découper en forme d\'étoile'
      ],
      correctDivisionAnswer: 'Tracer deux lignes qui se croisent au centre',
      colorQuestion: 'Maintenant colorie 1 part',
      totalParts: 4, 
      partsToColor: 1, 
      hint: 'Deux lignes qui se croisent au centre divisent le cercle en 4 parts égales',
      shape: 'circle'
    },
    { 
      question: 'Comment diviser cette barre en 6 parts égales ?',
      divisionQuestion: 'Comment diviser une barre en 6 parts égales ?',
      divisionOptions: [
        'Tracer 5 lignes verticales pour faire 6 parts',
        'Tracer 6 lignes verticales',
        'Tracer 4 lignes verticales',
        'Tracer des lignes horizontales'
      ],
      correctDivisionAnswer: 'Tracer 5 lignes verticales pour faire 6 parts',
      colorQuestion: 'Maintenant colorie 2 parts',
      totalParts: 6, 
      partsToColor: 2, 
      hint: 'Pour 6 parts, il faut 5 lignes de séparation (6 - 1 = 5)',
      shape: 'bar'
    },
    { 
      question: 'Comment diviser ce carré en 4 parts égales ?',
      divisionQuestion: 'Quelle est la meilleure façon de diviser un carré en 4 ?',
      divisionOptions: [
        'Tracer une croix au centre',
        'Tracer seulement des lignes verticales',
        'Tracer seulement des lignes horizontales',
        'Découper en triangles'
      ],
      correctDivisionAnswer: 'Tracer une croix au centre',
      colorQuestion: 'Maintenant colorie 3 parts',
      totalParts: 4, 
      partsToColor: 3, 
      hint: 'Une croix crée 4 carrés parfaitement égaux',
      shape: 'square'
    },
    { 
      question: 'Comment diviser ce cercle en 6 parts égales ?',
      divisionQuestion: 'Comment diviser un cercle en 6 parts égales ?',
      divisionOptions: [
        'Tracer 3 lignes qui passent par le centre',
        'Tracer 2 lignes qui passent par le centre',
        'Tracer 6 lignes qui passent par le centre',
        'Tracer des cercles à l\'intérieur'
      ],
      correctDivisionAnswer: 'Tracer 3 lignes qui passent par le centre',
      colorQuestion: 'Maintenant colorie 1 part',
      totalParts: 6, 
      partsToColor: 1, 
      hint: 'Trois lignes depuis le centre créent 6 parts égales comme une tarte',
      shape: 'circle'
    },
    { 
      question: 'Comment diviser ce rectangle en 4 parts égales ?',
      divisionQuestion: 'Comment diviser un rectangle en 4 parts égales ?',
      divisionOptions: [
        'Tracer 3 lignes verticales pour faire 4 bandes',
        'Tracer 2 lignes verticales',
        'Tracer 4 lignes verticales',
        'Tracer des lignes horizontales'
      ],
      correctDivisionAnswer: 'Tracer 3 lignes verticales pour faire 4 bandes',
      colorQuestion: 'Maintenant colorie 2 parts',
      totalParts: 4, 
      partsToColor: 2, 
      hint: 'Pour 4 bandes égales, il faut 3 lignes de séparation',
      shape: 'rectangle'
    },
    { 
      question: 'Comment diviser cette barre en 8 parts égales ?',
      divisionQuestion: 'Comment diviser une barre en 8 parts égales ?',
      divisionOptions: [
        'Tracer 7 lignes verticales pour faire 8 parts',
        'Tracer 8 lignes verticales',
        'Tracer 6 lignes verticales',
        'Tracer des lignes diagonales'
      ],
      correctDivisionAnswer: 'Tracer 7 lignes verticales pour faire 8 parts',
      colorQuestion: 'Maintenant colorie 3 parts',
      totalParts: 8, 
      partsToColor: 3, 
      hint: 'Pour 8 parts, il faut 7 lignes de séparation (8 - 1 = 7)',
      shape: 'bar'
    },
    { 
      question: 'Comment diviser ce cercle en 8 parts égales ?',
      divisionQuestion: 'Comment diviser un cercle en 8 parts égales ?',
      divisionOptions: [
        'Tracer 4 lignes qui se croisent au centre',
        'Tracer 3 lignes qui se croisent au centre',
        'Tracer 8 lignes depuis le centre',
        'Tracer des cercles concentriques'
      ],
      correctDivisionAnswer: 'Tracer 4 lignes qui se croisent au centre',
      colorQuestion: 'Maintenant colorie 2 parts',
      totalParts: 8, 
      partsToColor: 2, 
      hint: 'Quatre lignes qui se croisent au centre créent 8 parts égales',
      shape: 'circle'
    }
  ];

  const renderExampleShape = (totalParts: number, coloredParts: number) => {
    const anglePerPart = 360 / totalParts;
    const parts = [];
    
    for (let i = 0; i < totalParts; i++) {
      const isColored = i < coloredParts;
      const startAngle = i * anglePerPart - 90;
      const endAngle = (i + 1) * anglePerPart - 90;
      
      const x1 = 50 + 30 * Math.cos((startAngle * Math.PI) / 180);
      const y1 = 50 + 30 * Math.sin((startAngle * Math.PI) / 180);
      const x2 = 50 + 30 * Math.cos((endAngle * Math.PI) / 180);
      const y2 = 50 + 30 * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = anglePerPart > 180 ? 1 : 0;
      const pathData = `M 50 50 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      parts.push(
        <path
          key={i}
          d={pathData}
          fill={isColored ? "#3b82f6" : "#e5e7eb"}
          stroke="#374151"
          strokeWidth="1"
        />
      );
    }
    
    return (
              <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
        {parts}
      </svg>
    );
  };

  const renderInteractiveContent = () => {
    if (step === 'divide') {
      return renderDivisionQCM();
    } else {
      return renderColoringShape();
    }
  };

  const renderDivisionQCM = () => {
    return (
      <div className="text-center">
        <div className="mb-6 sm:mb-8">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 px-2">
            {exercises[currentExercise].divisionQuestion}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-lg mx-auto px-2">
            {exercises[currentExercise].divisionOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setDivisionAnswer(option)}
                className={`p-4 sm:p-5 rounded-lg border-2 font-medium text-left transition-all min-h-[60px] sm:min-h-[56px] touch-manipulation ${
                  divisionAnswer === option
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-pink-300 active:bg-gray-100'
                }`}
              >
                <span className="text-sm sm:text-base">{option}</span>
              </button>
            ))}
          </div>
        </div>
        
        {divisionAnswer === exercises[currentExercise].correctDivisionAnswer && (
          <button
            onClick={() => setStep('color')}
            className="bg-blue-500 text-white px-6 py-4 sm:px-8 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto max-w-xs mx-auto"
          >
            Parfait ! Passer au coloriage →
          </button>
        )}
      </div>
    );
  };

  const renderColoringShape = () => {
    const exercise = exercises[currentExercise];
    
    return (
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900 mb-6">
          {exercise.colorQuestion}
        </div>
        <div className="mb-6">
          {renderDividedShape(exercise.shape, exercise.totalParts)}
        </div>
        <p className="text-lg font-bold text-gray-900 mb-4">
          Parts coloriées : {selectedParts.length} / {exercise.partsToColor}
        </p>
      </div>
    );
  };

  const renderDividedShape = (shape: string, totalParts: number) => {
    const parts = [];
    
    if (shape === 'circle') {
      const anglePerPart = 360 / totalParts;
      for (let i = 0; i < totalParts; i++) {
        const isSelected = selectedParts.includes(i);
        const startAngle = i * anglePerPart - 90;
        const endAngle = (i + 1) * anglePerPart - 90;
        
        const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
        const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
        const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
        const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);
        
        const largeArcFlag = anglePerPart > 180 ? 1 : 0;
        const pathData = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
        
        parts.push(
          <path
            key={i}
            d={pathData}
            fill={isSelected ? "#fbbf24" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="2"
            className="cursor-pointer hover:fill-yellow-300 transition-colors"
            onClick={() => {
              if (selectedParts.includes(i)) {
                setSelectedParts(selectedParts.filter(p => p !== i));
              } else {
                setSelectedParts([...selectedParts, i]);
              }
            }}
          />
        );
      }
      
      return (
        <svg viewBox="0 0 100 100" className="mx-auto border-2 border-gray-300 rounded-lg w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 max-w-full">
          {parts}
        </svg>
      );
    }
    
    if (shape === 'square') {
      const cols = totalParts === 4 ? 2 : 1;
      const rows = totalParts === 4 ? 2 : totalParts;
      const cellWidth = 70 / cols;
      const cellHeight = 70 / rows;
      
      for (let i = 0; i < totalParts; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = 15 + col * cellWidth;
        const y = 15 + row * cellHeight;
        const isSelected = selectedParts.includes(i);
        
        parts.push(
          <rect
            key={i}
            x={x}
            y={y}
            width={cellWidth}
            height={cellHeight}
            fill={isSelected ? "#fbbf24" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="2"
            className="cursor-pointer hover:fill-yellow-300 transition-colors"
            onClick={() => {
              if (selectedParts.includes(i)) {
                setSelectedParts(selectedParts.filter(p => p !== i));
              } else {
                setSelectedParts([...selectedParts, i]);
              }
            }}
          />
        );
      }
      
      return (
        <svg viewBox="0 0 100 100" className="mx-auto border-2 border-gray-300 rounded-lg w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 max-w-full">
          {parts}
        </svg>
      );
    }
    
    if (shape === 'rectangle' || shape === 'bar') {
      const cellWidth = 60 / totalParts;
      
      for (let i = 0; i < totalParts; i++) {
        const x = 20 + i * cellWidth;
        const isSelected = selectedParts.includes(i);
        
        parts.push(
          <rect
            key={i}
            x={x}
            y={35}
            width={cellWidth}
            height={30}
            fill={isSelected ? "#fbbf24" : "#e5e7eb"}
            stroke="#374151"
            strokeWidth="2"
            className="cursor-pointer hover:fill-yellow-300 transition-colors"
            onClick={() => {
              if (selectedParts.includes(i)) {
                setSelectedParts(selectedParts.filter(p => p !== i));
              } else {
                setSelectedParts([...selectedParts, i]);
              }
            }}
          />
        );
      }
      
      return (
        <svg viewBox="0 0 100 100" className="mx-auto border-2 border-gray-300 rounded-lg w-64 h-32 sm:w-80 sm:h-40 lg:w-96 lg:h-48 max-w-full">
          {parts}
        </svg>
      );
    }
    
    return <div className="w-48 h-48 bg-gray-200 rounded mx-auto"></div>;
  };

  const handleNext = () => {
    if (isCorrect === null) {
      // Vérifier que l'exercice est complet (division + coloriage)
      const divisionCorrect = divisionAnswer === exercises[currentExercise].correctDivisionAnswer;
      const coloringCorrect = selectedParts.length === exercises[currentExercise].partsToColor;
      const correct = divisionCorrect && coloringCorrect && step === 'color';
      
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
            setSelectedParts([]);
            setDivisionAnswer('');
            setStep('divide');
            setIsCorrect(null);
            setShowHint(false);
          } else {
            setFinalScore(score + (!answeredCorrectly.has(currentExercise) ? 1 : 0));
            setShowCompletionModal(true);
          }
        }, 1500);
      }
    } else {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setSelectedParts([]);
        setDivisionAnswer('');
        setStep('divide');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setFinalScore(score);
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setSelectedParts([]);
    setDivisionAnswer('');
    setStep('divide');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setSelectedParts([]);
    setDivisionAnswer('');
    setStep('divide');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour aux fractions</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🍰 Partage équitable
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Apprends à partager en parts égales !
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{currentExercise + 1}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Exercice</div>
              </div>
            </div>
          </div>
        </div>

        {!showExercises && (
          <div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold mb-4">Apprends à partager équitablement !</h2>
                <p className="text-lg">
                  Quand on partage un gâteau, une pizza ou une tablette de chocolat, 
                  il faut faire des parts égales pour que ce soit juste !
                </p>
              </div>
            </div>

            {/* Exemples */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                📚 Quelques exemples
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-3 text-center">
                      {example.description}
                    </h4>
                    <div className="text-center mb-4">
                      {renderExampleShape(example.totalParts, example.partsToColor)}
                    </div>
                    <p className="text-center text-gray-600">
                      Une part = une <strong>{example.name}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 sm:px-8 sm:py-4 rounded-xl font-bold text-lg sm:text-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg touch-manipulation min-h-[44px] w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
              >
                🎮 Commencer les exercices !
              </button>
            </div>
          </div>
        )}

        {showExercises && (
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                Exercice {currentExercise + 1} sur {exercises.length}
              </h2>
              <p className="text-xl text-gray-700">
                {exercises[currentExercise].question}
              </p>
            </div>

            <div className="text-center mb-8">
              {renderInteractiveContent()}
            </div>

            <div className="text-center mb-6">
              {step === 'divide' && (
                <p className="text-lg text-gray-600 mb-4">
                  <strong>Étape 1 :</strong> Réponds à la question de division !
                </p>
              )}
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                <Lightbulb className="inline w-4 h-4 mr-2" />
                Indice
              </button>
              <button
                onClick={resetExercise}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Effacer
              </button>
            </div>

            {showHint && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-bold">{exercises[currentExercise].hint}</span>
                </div>
              </div>
            )}

            {isCorrect !== null && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold">Bravo ! C'est correct !</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span className="font-bold">
                        Pas tout à fait ! Il faut colorier {exercises[currentExercise].partsToColor} part(s).
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <button
                onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                disabled={currentExercise === 0}
                className="bg-gray-300 text-gray-700 px-6 py-4 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] w-full sm:w-auto"
              >
                ← Précédent
              </button>
              {step === 'color' && (
                <button
                  onClick={handleNext}
                  disabled={selectedParts.length === 0 && isCorrect === null}
                  className="bg-pink-500 text-white px-6 py-4 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] w-full sm:w-auto"
                >
                  {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl mx-4">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Félicitations !</h3>
              <p className="text-lg text-gray-700 mb-6">
                Tu as terminé les exercices de partage équitable !
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-xl font-bold text-gray-900">
                  Score final : {finalScore}/{exercises.length} 
                  ({Math.round((finalScore / exercises.length) * 100)}%)
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={resetAll}
                  className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
                >
                  Recommencer
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 