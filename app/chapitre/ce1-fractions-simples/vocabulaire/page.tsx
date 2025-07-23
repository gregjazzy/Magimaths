'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

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

// Animation interactive pour le vocabulaire
function VocabulaireAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const examples = [
    { fraction: '1/2', name: 'une moitié', color: '#f97316' },
    { fraction: '1/3', name: 'un tiers', color: '#10b981' },
    { fraction: '1/4', name: 'un quart', color: '#3b82f6' },
    { fraction: '1/5', name: 'un cinquième', color: '#8b5cf6' },
    { fraction: '1/6', name: 'un sixième', color: '#ec4899' },
    { fraction: '1/7', name: 'un septième', color: '#06b6d4' },
    { fraction: '1/8', name: 'un huitième', color: '#84cc16' },
    { fraction: '1/9', name: 'un neuvième', color: '#f59e0b' },
    { fraction: '1/10', name: 'un dixième', color: '#ef4444' }
  ];

  const currentExample = examples[currentStep];

  const renderPieChart = (parts: number, color: string) => {
    const radius = 40;
    const anglePerPart = 360 / parts;
    
    return (
      <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
        {Array.from({ length: parts }, (_, i) => {
          const startAngle = i * anglePerPart - 90;
          const endAngle = (i + 1) * anglePerPart - 90;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = 50 + radius * Math.cos(startRad);
          const y1 = 50 + radius * Math.sin(startRad);
          const x2 = 50 + radius * Math.cos(endRad);
          const y2 = 50 + radius * Math.sin(endRad);
          
          const largeArcFlag = anglePerPart > 180 ? 1 : 0;
          
          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          return (
            <path
              key={i}
              d={pathData}
              fill={i === 0 ? color : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
      <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
        📚 Apprendre le vocabulaire
      </h3>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-center text-lg font-bold text-blue-800">
          Découvre comment nommer les fractions !
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center">
          <div className="mb-4">
            {renderPieChart(parseInt(currentExample.fraction.split('/')[1]), currentExample.color)}
          </div>
          <div className="text-3xl font-bold mb-2">
            <FractionMath a={currentExample.fraction.split('/')[0]} b={currentExample.fraction.split('/')[1]} size="text-2xl" />
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-4">🗣️</div>
          <div className="text-2xl font-bold text-blue-600 bg-blue-100 p-4 rounded-lg">
            {currentExample.name}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(examples.length - 1, currentStep + 1))}
          disabled={currentStep === examples.length - 1}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          Suivant →
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        {currentStep + 1} / {examples.length}
      </div>
    </div>
  );
}

// Exercice de coloriage individuel (question par question)
function ExerciceColorageIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coloredParts, setColoredParts] = useState(new Set());
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-coloriage';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 20; // XP de base pour cette section
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
    
    return earnedXP;
  };

  const exercises = [
    { id: 1, fraction: '4/7', shape: 'rectangle', totalParts: 7, targetParts: 4 },
    { id: 2, fraction: '2/8', shape: 'circle', totalParts: 8, targetParts: 2 },
    { id: 3, fraction: '1/3', shape: 'rectangle', totalParts: 3, targetParts: 1 },
    { id: 4, fraction: '5/8', shape: 'circle', totalParts: 8, targetParts: 5 },
    { id: 5, fraction: '1/4', shape: 'circle', totalParts: 4, targetParts: 1 },
    { id: 6, fraction: '1/3', shape: 'triangle', totalParts: 3, targetParts: 1 },
    { id: 7, fraction: '6/9', shape: 'rectangle', totalParts: 9, targetParts: 6 },
    { id: 8, fraction: '2/3', shape: 'triangle', totalParts: 3, targetParts: 2 },
    { id: 9, fraction: '1/2', shape: 'rectangle', totalParts: 2, targetParts: 1 },
    { id: 10, fraction: '1/2', shape: 'triangle', totalParts: 2, targetParts: 1 },
    { id: 11, fraction: '3/8', shape: 'circle', totalParts: 8, targetParts: 3 },
    { id: 12, fraction: '1/4', shape: 'diamond', totalParts: 4, targetParts: 1 }
  ];

  const currentExercise = exercises[currentQuestion];

  const togglePart = (partIndex: number) => {
    if (isAnswered) return;
    
    const newSet = new Set(coloredParts);
    if (newSet.has(partIndex)) {
      newSet.delete(partIndex);
    } else {
      newSet.add(partIndex);
    }
    setColoredParts(newSet);
  };

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setColoredParts(new Set());
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setColoredParts(new Set());
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      setShowCompletionModal(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setColoredParts(new Set());
      setIsAnswered(false);
    }
  };

  const resetQuestion = () => {
    setColoredParts(new Set());
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setColoredParts(new Set());
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
  };

  const isCorrect = () => {
    return coloredParts.size === currentExercise.targetParts;
  };

  const renderShape = (exercise: any) => {
    if (exercise.shape === 'rectangle') {
      const cols = exercise.totalParts <= 4 ? exercise.totalParts : Math.ceil(Math.sqrt(exercise.totalParts));
      const rows = Math.ceil(exercise.totalParts / cols);
      const cellWidth = 200 / cols;
      const cellHeight = 150 / rows;
      
      return (
        <svg width="220" height="170" viewBox="0 0 220 170" className="mx-auto cursor-pointer">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = 10 + col * cellWidth;
            const y = 10 + row * cellHeight;
                         const isColored = coloredParts.has(i);
             
             return (
               <rect
                 key={i}
                 x={x}
                 y={y}
                 width={cellWidth - 2}
                 height={cellHeight - 2}
                 fill={isColored ? '#10b981' : '#f3f4f6'}
                 stroke="#6b7280"
                 strokeWidth="2"
                 onClick={() => togglePart(i)}
                 className="hover:opacity-75 transition-all"
               />
             );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'circle') {
      const radius = 60;
      const centerX = 70;
      const centerY = 70;
      const anglePerPart = 360 / exercise.totalParts;
      
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const startAngle = i * anglePerPart - 90;
            const endAngle = (i + 1) * anglePerPart - 90;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = anglePerPart > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            const isColored = coloredParts.has(i);
            
            return (
              <path
                key={i}
                d={pathData}
                fill={isColored ? '#10b981' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
                onClick={() => togglePart(i)}
                className="hover:opacity-75 transition-all"
              />
            );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'triangle') {
      if (exercise.totalParts === 2) {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
            <path
              d="M 70 20 L 20 120 L 120 120 Z"
              fill={coloredParts.has(0) ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
              onClick={() => togglePart(0)}
              className="hover:opacity-75 transition-all"
            />
            <line
              x1="70"
              y1="20"
              x2="70"
              y2="120"
              stroke="#6b7280"
              strokeWidth="3"
            />
            <path
              d="M 70 20 L 70 120 L 120 120 Z"
              fill={coloredParts.has(1) ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
              onClick={() => togglePart(1)}
              className="hover:opacity-75 transition-all"
            />
          </svg>
        );
      } else {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
            {Array.from({ length: exercise.totalParts }, (_, i) => {
              const anglePerPart = 360 / exercise.totalParts;
              const startAngle = i * anglePerPart - 90;
              const endAngle = (i + 1) * anglePerPart - 90;
              
              const centerX = 70, centerY = 90, radius = 50;
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} L ${x2} ${y2} Z`;
              
                             const isColored = coloredParts.has(i);
               
               return (
                 <path
                   key={i}
                   d={pathData}
                   fill={isColored ? '#10b981' : '#f3f4f6'}
                   stroke="#6b7280"
                   strokeWidth="2"
                   onClick={() => togglePart(i)}
                   className="hover:opacity-75 transition-all"
                 />
               );
            })}
          </svg>
        );
      }
    }
    
    if (exercise.shape === 'diamond') {
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto cursor-pointer">
          <path
            d="M 70 20 L 20 70 L 70 120 L 70 70 Z"
            fill={coloredParts.has(0) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(0)}
            className="hover:opacity-75 transition-all"
          />
          <path
            d="M 70 20 L 120 70 L 70 120 L 70 70 Z"
            fill={coloredParts.has(1) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(1)}
            className="hover:opacity-75 transition-all"
          />
          <path
            d="M 70 70 L 20 70 L 70 120 Z"
            fill={coloredParts.has(2) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(2)}
            className="hover:opacity-75 transition-all"
          />
          <path
            d="M 70 70 L 120 70 L 70 120 Z"
            fill={coloredParts.has(3) ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
            onClick={() => togglePart(3)}
            className="hover:opacity-75 transition-all"
          />
        </svg>
      );
    }
    
    return <div></div>;
  };

  const renderCorrectionShape = (exercise: any) => {
    if (exercise.shape === 'rectangle') {
      const cols = exercise.totalParts <= 4 ? exercise.totalParts : Math.ceil(Math.sqrt(exercise.totalParts));
      const rows = Math.ceil(exercise.totalParts / cols);
      const cellWidth = 200 / cols;
      const cellHeight = 150 / rows;
      
      return (
        <svg width="220" height="170" viewBox="0 0 220 170" className="mx-auto">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = 10 + col * cellWidth;
            const y = 10 + row * cellHeight;
            const shouldBeColored = i < exercise.targetParts;
            
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={cellWidth - 2}
                height={cellHeight - 2}
                fill={shouldBeColored ? '#10b981' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'circle') {
      const radius = 60;
      const centerX = 70;
      const centerY = 70;
      const anglePerPart = 360 / exercise.totalParts;
      
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
          {Array.from({ length: exercise.totalParts }, (_, i) => {
            const startAngle = i * anglePerPart - 90;
            const endAngle = (i + 1) * anglePerPart - 90;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = anglePerPart > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            const shouldBeColored = i < exercise.targetParts;
            
            return (
              <path
                key={i}
                d={pathData}
                fill={shouldBeColored ? '#10b981' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      );
    }
    
    if (exercise.shape === 'triangle') {
      if (exercise.totalParts === 2) {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
            <path
              d="M 70 20 L 20 120 L 120 120 Z"
              fill={0 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
            />
            <line
              x1="70"
              y1="20"
              x2="70"
              y2="120"
              stroke="#6b7280"
              strokeWidth="3"
            />
            <path
              d="M 70 20 L 70 120 L 120 120 Z"
              fill={1 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
              stroke="#6b7280"
              strokeWidth="3"
            />
          </svg>
        );
      } else {
        return (
          <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
            {Array.from({ length: exercise.totalParts }, (_, i) => {
              const anglePerPart = 360 / exercise.totalParts;
              const startAngle = i * anglePerPart - 90;
              const endAngle = (i + 1) * anglePerPart - 90;
              
              const centerX = 70, centerY = 90, radius = 50;
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} L ${x2} ${y2} Z`;
              
              const shouldBeColored = i < exercise.targetParts;
              
              return (
                <path
                  key={i}
                  d={pathData}
                  fill={shouldBeColored ? '#10b981' : '#f3f4f6'}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        );
      }
    }
    
    if (exercise.shape === 'diamond') {
      return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
          <path
            d="M 70 20 L 20 70 L 70 120 L 70 70 Z"
            fill={0 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
          <path
            d="M 70 20 L 120 70 L 70 120 L 70 70 Z"
            fill={1 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
          <path
            d="M 70 70 L 20 70 L 70 120 Z"
            fill={2 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
          <path
            d="M 70 70 L 120 70 L 70 120 Z"
            fill={3 < exercise.targetParts ? '#10b981' : '#f3f4f6'}
            stroke="#6b7280"
            strokeWidth="3"
          />
        </svg>
      );
    }
    
    return <div></div>;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🎨 Exercice de coloriage
        </h3>
        <div className="text-lg text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-lg font-bold text-purple-600 mt-2">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-purple-50 rounded-lg p-4 mb-6">
        <p className="text-center text-lg font-bold text-purple-800">
          ✏️ Clique pour colorier <strong>{currentExercise.targetParts}</strong> parts sur <strong>{currentExercise.totalParts}</strong>
        </p>
        <p className="text-center text-xl font-bold text-purple-900 mt-2">
          <FractionMath a={currentExercise.targetParts.toString()} b={currentExercise.totalParts.toString()} size="text-2xl" />
        </p>
      </div>

      <div className="text-center mb-6">
        {renderShape(currentExercise)}
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-green-600 mb-4">✅ Correction</h4>
          <div className="bg-green-50 rounded-lg p-4 max-w-sm mx-auto">
            {renderCorrectionShape(currentExercise)}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Il fallait colorier <strong>{currentExercise.targetParts}</strong> parts sur <strong>{currentExercise.totalParts}</strong>
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white w-full sm:w-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-purple-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu maîtrises parfaitement le coloriage de fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien colorier les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-purple-500 text-white py-3 px-4 sm:px-6 rounded-xl font-bold hover:bg-purple-600 transition-colors touch-manipulation min-h-[44px]"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-4 sm:px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exercice d'écriture individuel (question par question)
function ExerciceEcritureIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-ecriture';
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
    
    return earnedXP;
  };

  const exercises = [
    { id: 1, fraction: '5/8', correct: 'cinq huitièmes' },
    { id: 2, fraction: '8/15', correct: 'huit quinzièmes' },
    { id: 3, fraction: '3/12', correct: 'trois douzièmes' },
    { id: 4, fraction: '2/7', correct: 'deux septièmes' },
    { id: 5, fraction: '4/9', correct: 'quatre neuvièmes' }
  ];

  const currentExercise = exercises[currentQuestion];

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAnswer('');
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      setShowCompletionModal(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswer('');
      setIsAnswered(false);
    }
  };

  const resetQuestion = () => {
    setAnswer('');
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setAnswer('');
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
  };

  const isCorrect = () => {
    return answer.toLowerCase().trim() === currentExercise.correct.toLowerCase();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          ✍️ Écris en lettres
        </h3>
        <div className="text-lg text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-lg font-bold text-blue-600 mt-2">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-center text-lg font-bold text-blue-800">
          📝 Écris cette fraction en toutes lettres :
        </p>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold mb-4">
          <FractionMath a={currentExercise.fraction.split('/')[0]} b={currentExercise.fraction.split('/')[1]} size="text-4xl" />
        </div>
        <div className="text-2xl font-bold text-gray-600 mb-4">=</div>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Écris en lettres..."
          disabled={isAnswered}
          className={`w-full max-w-md mx-auto p-4 rounded-lg border-2 text-xl text-center font-bold ${
            isAnswered
              ? isCorrect() 
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-blue-500'
          } disabled:opacity-70`}
        />
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center p-4 rounded-lg mb-4 bg-red-100 text-red-800">
          <div className="text-xl font-bold">
            ❌ Ce n'est pas ça !
          </div>
          <div className="text-lg mt-2">
            ✅ Réponse : <strong>{currentExercise.correct}</strong>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={!answer.trim()}
            className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white w-full sm:w-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu écris parfaitement les fractions en lettres ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien écrire les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex space-x-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exercice d'identification individuel (question par question)
function ExerciceIdentificationIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedFractions, setSelectedFractions] = useState(new Set());
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-identification';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 18; // XP de base pour cette section
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
    
    return earnedXP;
  };

  const exercises = [
    { 
       id: 1,
       instruction: 'Entoure les fractions dont le numérateur est 3',
       checkCondition: (frac: any) => frac.numerator === 3,
      fractions: [
        { id: 1, numerator: 3, denominator: 4, color: 'bg-yellow-400' },
        { id: 2, numerator: 5, denominator: 6, color: 'bg-green-400' },
        { id: 3, numerator: 3, denominator: 8, color: 'bg-blue-400' },
        { id: 4, numerator: 2, denominator: 5, color: 'bg-red-400' },
        { id: 5, numerator: 3, denominator: 7, color: 'bg-purple-400' }
      ]
    },
         {
       id: 2,
       instruction: 'Entoure les fractions dont le dénominateur est 8',
       checkCondition: (frac: any) => frac.denominator === 8,
      fractions: [
        { id: 1, numerator: 3, denominator: 8, color: 'bg-yellow-400' },
        { id: 2, numerator: 5, denominator: 6, color: 'bg-green-400' },
        { id: 3, numerator: 7, denominator: 8, color: 'bg-blue-400' },
        { id: 4, numerator: 2, denominator: 5, color: 'bg-red-400' },
        { id: 5, numerator: 1, denominator: 8, color: 'bg-purple-400' }
      ]
    },
         {
       id: 3,
       instruction: 'Entoure les fractions dont le numérateur est 1',
       checkCondition: (frac: any) => frac.numerator === 1,
      fractions: [
        { id: 1, numerator: 1, denominator: 4, color: 'bg-yellow-400' },
        { id: 2, numerator: 3, denominator: 6, color: 'bg-green-400' },
        { id: 3, numerator: 1, denominator: 5, color: 'bg-blue-400' },
        { id: 4, numerator: 2, denominator: 3, color: 'bg-red-400' },
        { id: 5, numerator: 1, denominator: 2, color: 'bg-purple-400' }
      ]
    }
  ];

  const currentExercise = exercises[currentQuestion];

  const toggleFraction = (fractionId: number) => {
    if (isAnswered) return;
    
    const newSet = new Set(selectedFractions);
    if (newSet.has(fractionId)) {
      newSet.delete(fractionId);
    } else {
      newSet.add(fractionId);
    }
    setSelectedFractions(newSet);
  };

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedFractions(new Set());
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedFractions(new Set());
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
      const xpGained = saveProgress(newFinalScore);
      setEarnedXP(xpGained);
      setShowCompletionModal(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedFractions(new Set());
      setIsAnswered(false);
    }
  };

  const resetQuestion = () => {
    setSelectedFractions(new Set());
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setSelectedFractions(new Set());
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setEarnedXP(0);
  };

  const getCorrectAnswers = () => {
    return currentExercise.fractions.filter(f => currentExercise.checkCondition(f)).map(f => f.id);
  };

  const isCorrect = () => {
    const correctIds = new Set(getCorrectAnswers());
    return correctIds.size === selectedFractions.size && 
           Array.from(correctIds).every(id => selectedFractions.has(id));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🎯 Identification
        </h3>
        <div className="text-lg text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-lg font-bold text-green-600 mt-2">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <p className="text-center text-lg font-bold text-green-800">
          🔴 {currentExercise.instruction}
        </p>
        <p className="text-center text-sm text-green-700 mt-2">
          Clique sur les fractions pour les entourer
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
        {currentExercise.fractions.map((fraction) => (
          <div key={fraction.id} className="text-center">
            <div 
              className={`
                ${fraction.color} text-white rounded-lg p-4 sm:p-6 cursor-pointer min-h-[44px] touch-manipulation
                transform transition-all duration-200 hover:scale-105 active:scale-95
                ${selectedFractions.has(fraction.id) ? 'ring-4 ring-red-500 ring-offset-2' : ''}
                ${isAnswered && currentExercise.checkCondition(fraction) ? 'ring-4 ring-yellow-400 ring-offset-1' : ''}
              `}
              onClick={() => toggleFraction(fraction.id)}
            >
              <div className="text-white">
                <FractionMath 
                  a={fraction.numerator.toString()} 
                  b={fraction.denominator.toString()} 
                  size="text-xl"
                />
              </div>
            </div>
            {isAnswered && (
              <div className="mt-2 text-xs">
                {currentExercise.checkCondition(fraction) && (
                  <div className={`${selectedFractions.has(fraction.id) ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedFractions.has(fraction.id) ? '✅' : '❌'} À entourer
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center p-4 rounded-lg mb-4 bg-red-100 text-red-800">
          <div className="text-xl font-bold">
            ❌ Ce n'est pas ça !
          </div>
          <div className="text-lg mt-2">
            ✅ Bonnes réponses : {getCorrectAnswers().length} fractions à entourer
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            className="bg-green-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white w-full sm:w-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-green-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu identifies parfaitement les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien identifier les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex space-x-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exercice de reconnaissance individuel (question par question)
function ExerciceTrouverFractionIndividuel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'vocabulaire-reconnaissance';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 22; // XP de base pour cette section
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
    
    return earnedXP;
  };

  const exercises = [
    { 
      id: 'a', 
      correctFraction: '1/3',
      shape: 'triangle'
    },
    { 
      id: 'b', 
      correctFraction: '3/7',
      shape: 'rectangleLines'
    },
    { 
      id: 'c', 
      correctFraction: '2/5',
      shape: 'rectangleVertical'
    },
    { 
      id: 'd', 
      correctFraction: '3/8',
      shape: 'circle'
    },
    { 
      id: 'e', 
      correctFraction: '2/4',
      shape: 'rectangleBlocks'
    }
  ];

  const currentExercise = exercises[currentQuestion];

  const checkAnswer = () => {
    setIsAnswered(true);
    
    const correct = isCorrect();
    if (correct && !answeredCorrectly.has(currentQuestion)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentQuestion < exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setAnswer('');
          setIsAnswered(false);
        } else {
          const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
          const xpGained = saveProgress(newFinalScore);
          setEarnedXP(xpGained);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setIsAnswered(false);
    } else {
      // Fin de l'exercice - afficher la modal
      const newFinalScore = score + (!answeredCorrectly.has(currentQuestion) ? 1 : 0);
      const xpGained = saveProgress(newFinalScore);
      setEarnedXP(xpGained);
      setShowCompletionModal(true);
    }
  };

  const resetQuestion = () => {
    setAnswer('');
    setIsAnswered(false);
  };

  const resetAll = () => {
    setCurrentQuestion(0);
    setAnswer('');
    setIsAnswered(false);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setEarnedXP(0);
  };

  const isCorrect = () => {
    return answer.trim() === currentExercise.correctFraction;
  };

  const renderShape = (exercise) => {
    switch (exercise.shape) {
      case 'triangle':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            <path d="M 80 20 L 20 140 L 140 140 Z" fill="#f3f4f6" stroke="#6b7280" strokeWidth="3"/>
            <path d="M 80 20 L 20 140 L 50 140 Z" fill="#ec4899" stroke="#6b7280" strokeWidth="3"/>
            <line x1="80" y1="20" x2="50" y2="140" stroke="#6b7280" strokeWidth="3"/>
            <line x1="80" y1="20" x2="110" y2="140" stroke="#6b7280" strokeWidth="3"/>
          </svg>
        );
      
      case 'rectangleLines':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                x="40"
                y={30 + i * 16}
                width="80"
                height="14"
                fill={i < 3 ? '#22d3ee' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            ))}
          </svg>
        );
      
      case 'rectangleVertical':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 5 }, (_, i) => (
              <rect
                key={i}
                x="60"
                y={20 + i * 24}
                width="40"
                height="22"
                fill={i < 2 ? '#f97316' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            ))}
          </svg>
        );
      
      case 'circle':
        return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (360 / 8) * i - 90;
              const nextAngle = (360 / 8) * (i + 1) - 90;
              const angleRad = (angle * Math.PI) / 180;
              const nextAngleRad = (nextAngle * Math.PI) / 180;
              
              const x1 = 80 + 50 * Math.cos(angleRad);
              const y1 = 80 + 50 * Math.sin(angleRad);
              const x2 = 80 + 50 * Math.cos(nextAngleRad);
              const y2 = 80 + 50 * Math.sin(nextAngleRad);
              
              const pathData = `M 80 80 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
              
              return (
        <path
          key={i}
          d={pathData}
                  fill={i < 3 ? '#fbbf24' : '#f3f4f6'}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        );
      
      case 'rectangleBlocks':
    return (
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
            {Array.from({ length: 4 }, (_, i) => (
              <rect
                key={i}
                x="70"
                y={40 + i * 20}
                width="20"
                height="18"
                fill={i < 2 ? '#a855f7' : '#f3f4f6'}
                stroke="#6b7280"
                strokeWidth="2"
              />
            ))}
      </svg>
    );
      
      default:
        return <div></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          🔍 Reconnaissance
        </h3>
        <div className="text-lg text-gray-600">
          Question {currentQuestion + 1} sur {exercises.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div 
            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-lg font-bold text-indigo-600 mt-2">
          Score : {score}/{exercises.length}
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
        <p className="text-center text-lg font-bold text-indigo-800">
          👀 Quelle fraction correspond à la partie coloriée ?
        </p>
        <p className="text-center text-sm text-indigo-700 mt-2">
          Exemple : si 2 parts sur 3 sont coloriées → 2/3
        </p>
      </div>

      <div className="text-center mb-6">
        <div className="text-lg font-bold text-gray-700 mb-4">
          {currentExercise.id}.
        </div>
        
        <div className="mb-6">
          {renderShape(currentExercise)}
        </div>
        
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ex: 1/2"
          disabled={isAnswered}
          className={`w-full max-w-xs mx-auto p-3 sm:p-4 rounded-lg border-2 text-center text-lg sm:text-xl font-bold ${
            isAnswered
              ? isCorrect() 
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-indigo-500'
          } disabled:opacity-70 min-h-[44px] touch-manipulation`}
        />
      </div>

      {isAnswered && !isCorrect() && (
        <div className="text-center p-4 rounded-lg mb-4 bg-red-100 text-red-800">
          <div className="text-xl font-bold">
            ❌ Ce n'est pas ça !
          </div>
          <div className="text-lg mt-2">
            ✅ Réponse : <strong>{currentExercise.correctFraction}</strong>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
        {!isAnswered ? (
          <button
            onClick={checkAnswer}
            disabled={!answer.trim()}
            className="bg-indigo-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            🔍 Vérifier
          </button>
        ) : isCorrect() ? (
          <div className="p-4 rounded-lg bg-green-600 text-white w-full sm:w-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">🎉 Bravo ! C'est la bonne réponse !</span>
            </div>
          </div>
        ) : (
          <button
            onClick={nextQuestion}
            className="bg-indigo-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
          >
            Suivant →
          </button>
        )}
        <button
          onClick={resetQuestion}
          className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors w-full sm:w-auto touch-manipulation min-h-[44px]"
        >
          🔄 Effacer
        </button>
      </div>

      {/* Modal de fin d'exercice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
            {(() => {
              const percentage = score / exercises.length;
              if (percentage === 1) {
                return (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                    <p className="text-gray-700 mb-4">Tu reconnais parfaitement les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else if (percentage >= 0.7) {
                return (
                  <>
                    <div className="text-6xl mb-4">👍</div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                    <p className="text-gray-700 mb-4">Tu sais bien reconnaître les fractions ! Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div className="text-6xl mb-4">💪</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                    <p className="text-gray-700 mb-4">Tu progresses ! Continue à t'entraîner. Score : {score}/{exercises.length}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6 animate-pulse">
                      <p className="text-lg font-bold text-yellow-800">
                        🌟 {earnedXP} XP gagnés !
                      </p>
                    </div>
                  </>
                );
              }
            })()}
            <div className="flex space-x-4">
              <button
                onClick={resetAll}
                className="flex-1 bg-indigo-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
              >
                Recommencer
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VocabulaireFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedExerciseType, setSelectedExerciseType] = useState('coloriage');

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore) => {
    const sectionId = 'vocabulaire';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 12; // XP de base pour cette section
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      completed: true,
      score: finalScore,
      maxScore,
      percentage,
      earnedXP,
      completedAt: new Date().toISOString()
    };
    
    const existingProgress = JSON.parse(localStorage.getItem('mathProgress') || '{}');
    const chapterProgress = existingProgress['ce1-fractions-simples'] || {};
    chapterProgress[sectionId] = progressData;
    existingProgress['ce1-fractions-simples'] = chapterProgress;
    localStorage.setItem('mathProgress', JSON.stringify(existingProgress));
  };

  // Données des exercices traditionnels
  const exercises = [
    { 
      question: 'Comment dit-on 1/2 en français ?',
      options: ['un demi', 'une moitié', 'un sur deux', 'une demie'],
      correctAnswer: 'une moitié',
      hint: 'Une fraction avec 2 au dénominateur s\'appelle une moitié'
    },
    { 
      question: 'Comment dit-on 1/3 en français ?',
      options: ['un tiers', 'une moitié', 'un quart', 'un troisième'],
      correctAnswer: 'un tiers',
      hint: 'Une fraction avec 3 au dénominateur s\'appelle un tiers'
    },
    { 
      question: 'Comment dit-on 1/4 en français ?',
      options: ['un demi', 'un tiers', 'un quart', 'un quatrième'],
      correctAnswer: 'un quart',
      hint: 'Une fraction avec 4 au dénominateur s\'appelle un quart'
    },
    { 
      question: 'Comment dit-on 1/5 en français ?',
      options: ['un cinquième', 'un quart', 'un sixième', 'un cinq'],
      correctAnswer: 'un cinquième',
      hint: 'Le nombre 5 donne "un cinquième"'
    },
    { 
      question: 'Comment dit-on 1/6 en français ?',
      options: ['un cinquième', 'un sixième', 'un septième', 'un six'],
      correctAnswer: 'un sixième',
      hint: 'Le nombre 6 donne "un sixième"'
    },
    { 
      question: 'Comment dit-on 1/10 en français ?',
      options: ['un dixième', 'un neuvième', 'un onzième', 'un dix'],
      correctAnswer: 'un dixième',
      hint: 'Le nombre 10 donne "un dixième"'
    }
  ];

  const handleNext = () => {
    if (isCorrect === null) {
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
            setUserAnswer('');
            setIsCorrect(null);
            setShowHint(false);
          } else {
            const newFinalScore = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(newFinalScore);
            saveProgress(newFinalScore);
            setShowCompletionModal(true);
          }
        }, 1500);
      }
    } else {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setFinalScore(score);
        saveProgress(score);
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              💬 Vocabulaire des fractions
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Apprends les mots importants : moitié, tiers, quart...
            </p>
              </div>
              </div>

        {/* Onglets Cours/Exercices */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="flex">
            <button
              onClick={() => setShowExercises(false)}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-bold text-sm sm:text-base transition-colors ${
                !showExercises
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-bold text-sm sm:text-base transition-colors ${
                showExercises
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ✏️ Exercices
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-3xl font-bold mb-4">Apprendre le vocabulaire des fractions</h2>
                <p className="text-xl">
                  Découvre comment bien nommer toutes les fractions !
                </p>
              </div>
            </div>

            {/* Animation interactive */}
            <VocabulaireAnimation />

            {/* Explication numérateur/dénominateur */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                🔍 Les parties d'une fraction
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    <FractionMath a="3" b="5" size="text-6xl" />
                    </div>
                    </div>
                
                <div className="space-y-4">
                  <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
                    <h4 className="text-xl font-bold text-red-700 mb-2">
                      ↑ Numérateur = Combien de parts je PRENDS
                    </h4>
                    <p className="text-red-600">Le nombre du haut indique combien de parts on prend</p>
                  </div>
                  
                  <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-300">
                    <h4 className="text-xl font-bold text-blue-700 mb-2">
                      ↓ Dénominateur = En combien de parts je COUPE
                    </h4>
                    <p className="text-blue-600">Le nombre du bas indique en combien de parts on divise</p>
                  </div>
              </div>
            </div>

              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
                <h4 className="text-lg font-bold text-gray-800 mb-2">💡 Astuce pour retenir :</h4>
                <div className="grid md:grid-cols-2 gap-4">
            <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">HAUT comme une montagne ⛰️</div>
                    <div className="text-gray-700">Le numérateur est en HAUT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">BAS comme le sol 🌍</div>
                    <div className="text-gray-700">Le dénominateur est en BAS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples avec visualisations */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                🎯 Exemples de fractions
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { fraction: '1/2', name: 'une moitié', color: '#f97316' },
                  { fraction: '1/3', name: 'un tiers', color: '#10b981' },
                  { fraction: '1/4', name: 'un quart', color: '#3b82f6' },
                  { fraction: '1/5', name: 'un cinquième', color: '#8b5cf6' },
                  { fraction: '1/6', name: 'un sixième', color: '#ec4899' },
                  { fraction: '1/7', name: 'un septième', color: '#06b6d4' },
                  { fraction: '1/8', name: 'un huitième', color: '#84cc16' },
                  { fraction: '1/9', name: 'un neuvième', color: '#f59e0b' },
                  { fraction: '1/10', name: 'un dixième', color: '#ef4444' }
                ].map((example, index) => (
                  <div key={index} className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold mb-2">
                      <FractionMath 
                        a={example.fraction.split('/')[0]} 
                        b={example.fraction.split('/')[1]} 
                        size="text-xl" 
                      />
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {example.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                💡 Conseils pour réussir
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">🔤 Pour bien nommer :</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• 1/2 = une moitié</li>
                    <li>• 1/3 = un tiers</li>
                    <li>• 1/4 = un quart</li>
                    <li>• À partir de 5 : un + nombre + ième</li>
                    <li>• Exemple : 1/10 = un dixième</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">🎯 Pour bien comprendre :</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Le nombre du bas = en combien je divise</li>
                    <li>• Le nombre du haut = combien je prends</li>
                    <li>• Plus le dénominateur est grand, plus les parts sont petites</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Sous-menu des types d'exercices */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
              <button
                  onClick={() => setSelectedExerciseType('coloriage')}
                  className={`py-3 px-4 font-bold text-sm transition-colors ${
                    selectedExerciseType === 'coloriage'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🎨 Coloriage
                </button>
                <button
                  onClick={() => setSelectedExerciseType('ecriture')}
                  className={`py-3 px-4 font-bold text-sm transition-colors ${
                    selectedExerciseType === 'ecriture'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ✍️ Écriture
                </button>
                <button
                  onClick={() => setSelectedExerciseType('identification')}
                  className={`py-3 px-4 font-bold text-sm transition-colors ${
                    selectedExerciseType === 'identification'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🎯 Identification
                </button>
                <button
                  onClick={() => setSelectedExerciseType('reconnaissance')}
                  className={`py-3 px-4 font-bold text-sm transition-colors ${
                    selectedExerciseType === 'reconnaissance'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔍 Reconnaissance
                </button>
                <button
                  onClick={() => setSelectedExerciseType('quiz')}
                  className={`py-3 px-4 font-bold text-sm transition-colors ${
                    selectedExerciseType === 'quiz'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📝 Quiz
              </button>
            </div>
          </div>

            {/* Exercices selon le type sélectionné */}
            {selectedExerciseType === 'coloriage' && <ExerciceColorageIndividuel />}
            {selectedExerciseType === 'ecriture' && <ExerciceEcritureIndividuel />}
            {selectedExerciseType === 'identification' && <ExerciceIdentificationIndividuel />}
            {selectedExerciseType === 'reconnaissance' && <ExerciceTrouverFractionIndividuel />}
            {selectedExerciseType === 'quiz' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      ✏️ Quiz - Question {currentExercise + 1} sur {exercises.length}
              </h2>
                    <button
                      onClick={resetAll}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="inline w-4 h-4 mr-2" />
                      Recommencer
                    </button>
            </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      Score : {score}/{exercises.length}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {exercises[currentExercise].question}
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
              {exercises[currentExercise].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                          disabled={isCorrect !== null}
                          className={`p-4 rounded-lg border-2 text-left font-semibold transition-all ${
                    userAnswer === option
                              ? isCorrect === null
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : isCorrect
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : option === exercises[currentExercise].correctAnswer
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                              : isCorrect !== null && option === exercises[currentExercise].correctAnswer
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-gray-400'
                          } disabled:cursor-not-allowed`}
                        >
                          <span className="flex items-center justify-between">
                  {option}
                            {userAnswer === option && isCorrect !== null && (
                              isCorrect ? 
                              <CheckCircle className="w-6 h-6 text-green-600" /> :
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                            {isCorrect !== null && option === exercises[currentExercise].correctAnswer && userAnswer !== option && (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                          </span>
                </button>
              ))}
                    </div>
            </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
              <button
                onClick={() => setShowHint(!showHint)}
                        className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                        <Lightbulb className="w-4 h-4" />
                        <span>Aide</span>
              </button>
              <button
                onClick={resetExercise}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Effacer
                      </button>
                    </div>
                    
                    <button
                      onClick={handleNext}
                      disabled={!userAnswer}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCorrect === null ? 'Valider' : currentExercise + 1 < exercises.length ? 'Suivant' : 'Terminer'}
              </button>
            </div>

            {showHint && (
                    <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-semibold">
                        💡 {exercises[currentExercise].hint}
                      </p>
              </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
              {(() => {
                const percentage = finalScore / exercises.length;
                if (percentage === 1) {
                  return (
                    <>
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold text-green-600 mb-4">Parfait !</h3>
                      <p className="text-gray-700 mb-6">Tu maîtrises parfaitement le vocabulaire des fractions ! Score : {finalScore}/{exercises.length}</p>
                    </>
                  );
                } else if (percentage >= 0.7) {
                  return (
                    <>
                      <div className="text-6xl mb-4">👍</div>
                      <h3 className="text-2xl font-bold text-blue-600 mb-4">Très bien !</h3>
                      <p className="text-gray-700 mb-6">Tu connais bien le vocabulaire ! Score : {finalScore}/{exercises.length}</p>
                    </>
                  );
                } else {
                  return (
                    <>
                      <div className="text-6xl mb-4">💪</div>
                      <h3 className="text-2xl font-bold text-orange-600 mb-4">Continue !</h3>
                      <p className="text-gray-700 mb-6">Tu progresses ! Continue à t'entraîner. Score : {finalScore}/{exercises.length}</p>
                    </>
                  );
                }
              })()}
              <div className="flex space-x-4">
                <button
                  onClick={resetAll}
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-600 transition-colors"
                >
                  Recommencer
                </button>
                <Link
                  href="/chapitre/ce1-fractions-simples"
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 transition-colors text-center"
                >
                  Retour
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 