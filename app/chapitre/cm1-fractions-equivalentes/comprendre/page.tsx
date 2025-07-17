'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, ChevronRight, Star, Award, HelpCircle } from 'lucide-react';

export default function ComprenderFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedParts, setSelectedParts] = useState<number[]>([]);


  const exercises = [
    {
      question: 'Dans cette pizza, combien de parts sont coloriées sur le total ?',
      totalParts: 4,
      coloredParts: 1,
      answer: '1/4',
      explanation: '1 part sur 4 est coloriée, donc la fraction est 1/4',
      type: 'pizza'
    },
    {
      question: 'Quelle fraction de cette tablette de chocolat est colorée ?',
      totalParts: 6,
      coloredParts: 2,
      answer: '2/6',
      explanation: '2 carrés sur 6 sont coloriés, donc la fraction est 2/6',
      type: 'chocolate'
    },
    {
      question: 'Combien de parts de ce gâteau sont prises ?',
      totalParts: 8,
      coloredParts: 3,
      answer: '3/8',
      explanation: '3 parts sur 8 sont coloriées, donc la fraction est 3/8',
      type: 'cake'
    },
    {
      question: 'Quelle fraction de cette tarte est mangée ?',
      totalParts: 6,
      coloredParts: 5,
      answer: '5/6',
      explanation: '5 parts sur 6 sont coloriées, donc la fraction est 5/6',
      type: 'pie'
    },
    {
      question: 'Dans ce rectangle, quelle fraction est coloriée ?',
      totalParts: 10,
      coloredParts: 7,
      answer: '7/10',
      explanation: '7 cases sur 10 sont coloriées, donc la fraction est 7/10',
      type: 'rectangle'
    },
    {
      question: 'Combien de parts de cette pizza sont mangées ?',
      totalParts: 8,
      coloredParts: 6,
      answer: '6/8',
      explanation: '6 parts sur 8 sont coloriées, donc la fraction est 6/8',
      type: 'pizza'
    },
    {
      question: 'Quelle fraction de ce chocolat reste ?',
      totalParts: 12,
      coloredParts: 4,
      answer: '4/12',
      explanation: '4 carrés sur 12 sont coloriés, donc la fraction est 4/12',
      type: 'chocolate'
    },
    {
      question: 'Dans ce cercle, quelle partie est coloriée ?',
      totalParts: 5,
      coloredParts: 2,
      answer: '2/5',
      explanation: '2 parts sur 5 sont coloriées, donc la fraction est 2/5',
      type: 'circle'
    },
    {
      question: 'Combien de carrés sont coloriés dans cette grille ?',
      totalParts: 9,
      coloredParts: 3,
      answer: '3/9',
      explanation: '3 carrés sur 9 sont coloriés, donc la fraction est 3/9',
      type: 'grid'
    },
    {
      question: 'Quelle fraction de cette barre de céréales est prise ?',
      totalParts: 6,
      coloredParts: 1,
      answer: '1/6',
      explanation: '1 morceau sur 6 est colorié, donc la fraction est 1/6',
      type: 'bar'
    },
    {
      question: 'Dans ce camembert, combien de parts sont servies ?',
      totalParts: 8,
      coloredParts: 5,
      answer: '5/8',
      explanation: '5 parts sur 8 sont coloriées, donc la fraction est 5/8',
      type: 'cheese'
    },
    {
      question: 'Quelle fraction de ces bonbons est prise ?',
      totalParts: 10,
      coloredParts: 3,
      answer: '3/10',
      explanation: '3 bonbons sur 10 sont coloriés, donc la fraction est 3/10',
      type: 'candies'
    }
  ];

  const getCurrentExercise = () => exercises[currentExercise];



  const renderVisualFraction = (totalParts: number, coloredParts: number, type: string = 'circle', isInteractive = false) => {
    const parts = Array.from({ length: totalParts }, (_, i) => i);
    
    switch (type) {
      case 'pizza':
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 shadow-sm">
            <div className="w-48 h-48 mx-auto relative">
              <div className="absolute inset-0 bg-orange-100 rounded-full shadow-lg"></div>
              <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                <circle cx="100" cy="100" r="85" fill="white" stroke="#d97706" strokeWidth="3"/>
                {parts.map((part) => {
                  const isColored = part < coloredParts;
                  const angle = (360 / totalParts);
                  const startAngle = part * angle - 90;
                  const endAngle = (part + 1) * angle - 90;
                  
                  const x1 = 100 + 85 * Math.cos(startAngle * Math.PI / 180);
                  const y1 = 100 + 85 * Math.sin(startAngle * Math.PI / 180);
                  const x2 = 100 + 85 * Math.cos(endAngle * Math.PI / 180);
                  const y2 = 100 + 85 * Math.sin(endAngle * Math.PI / 180);
                  
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  return (
                    <g key={part}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 85 85 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={isColored ? '#f97316' : 'white'}
                        stroke="#d97706"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                      <line x1="100" y1="100" x2={x1} y2={y1} stroke="#d97706" strokeWidth="2"/>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-orange-700 flex items-center gap-2">
                <span className="text-2xl">🍕</span>
                Pizza
              </span>
            </div>
          </div>
        );

      case 'chocolate':
        const chocCols = totalParts === 12 ? 4 : totalParts === 6 ? 3 : Math.ceil(Math.sqrt(totalParts));
        const chocRows = Math.ceil(totalParts / chocCols);
        
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 shadow-sm">
            <div className="inline-block p-4 bg-amber-900 rounded-2xl shadow-lg">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${chocCols}, 1fr)` }}>
                {parts.map((part) => {
                  const isColored = part < coloredParts;
                  return (
                    <div
                      key={part}
                      className={`w-8 h-8 border border-amber-800 rounded-md transition-all duration-300 hover:scale-105 ${
                        isColored ? 'bg-amber-600 shadow-md' : 'bg-amber-700'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-amber-700 flex items-center gap-2">
                <span className="text-2xl">🍫</span>
                Chocolat
              </span>
            </div>
          </div>
        );

      case 'cake':
      case 'pie':
      case 'cheese':
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-200 shadow-sm">
            <div className="w-48 h-48 mx-auto relative">
              <div className="absolute inset-0 bg-pink-100 rounded-full shadow-lg"></div>
              <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                <circle cx="100" cy="100" r="85" fill="white" stroke="#ec4899" strokeWidth="3"/>
                {parts.map((part) => {
                  const isColored = part < coloredParts;
                  const angle = (360 / totalParts);
                  const startAngle = part * angle - 90;
                  const endAngle = (part + 1) * angle - 90;
                  
                  const x1 = 100 + 85 * Math.cos(startAngle * Math.PI / 180);
                  const y1 = 100 + 85 * Math.sin(startAngle * Math.PI / 180);
                  const x2 = 100 + 85 * Math.cos(endAngle * Math.PI / 180);
                  const y2 = 100 + 85 * Math.sin(endAngle * Math.PI / 180);
                  
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  let coloredFill = '#f472b6';
                  
                  if (type === 'cake') {
                    coloredFill = '#d946ef';
                  } else if (type === 'pie') {
                    coloredFill = '#ca8a04';
                  } else if (type === 'cheese') {
                    coloredFill = '#f59e0b';
                  }
                  
                  return (
                    <g key={part}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 85 85 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={isColored ? coloredFill : 'white'}
                        stroke="#ec4899"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                      <line x1="100" y1="100" x2={x1} y2={y1} stroke="#ec4899" strokeWidth="1"/>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-pink-700 flex items-center gap-2">
                <span className="text-2xl">
                  {type === 'cake' ? '🍰' : type === 'pie' ? '🥧' : '🧀'}
                </span>
                {type === 'cake' ? 'Gâteau' : type === 'pie' ? 'Tarte' : 'Fromage'}
              </span>
            </div>
          </div>
        );

      case 'rectangle':
      case 'grid':
        const cols = totalParts === 10 ? 5 : totalParts === 9 ? 3 : Math.ceil(Math.sqrt(totalParts));
        const rows = Math.ceil(totalParts / cols);
        
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm">
            <div className="grid gap-2 p-4 bg-white rounded-xl shadow-md" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {parts.map((part) => {
                const isColored = part < coloredParts;
                return (
                  <div
                    key={part}
                    className={`w-10 h-10 border-2 border-blue-300 rounded-lg transition-all duration-300 hover:scale-105 ${
                      isColored ? 'bg-blue-500 shadow-md' : 'bg-blue-50'
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                <span className="text-2xl">
                  {type === 'rectangle' ? '📐' : '⬜'}
                </span>
                {type === 'rectangle' ? 'Rectangle' : 'Grille'}
              </span>
            </div>
          </div>
        );

      case 'bar':
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex gap-2 p-4 bg-amber-100 rounded-2xl border-2 border-amber-300 shadow-lg">
              {parts.map((part) => {
                const isColored = part < coloredParts;
                return (
                  <div
                    key={part}
                    className={`w-8 h-16 border-2 border-amber-400 rounded-md transition-all duration-300 hover:scale-105 ${
                      isColored ? 'bg-amber-600 shadow-md' : 'bg-amber-200'
                    }`}
                  />
                );
              })}
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-amber-700 flex items-center gap-2">
                <span className="text-2xl">🍫</span>
                Barre de céréales
              </span>
            </div>
          </div>
        );

      case 'candies':
        const candyCols = totalParts === 10 ? 5 : Math.ceil(Math.sqrt(totalParts));
        
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm">
            <div className="grid gap-3 p-4 bg-white rounded-xl shadow-md" style={{ gridTemplateColumns: `repeat(${candyCols}, 1fr)` }}>
              {parts.map((part) => {
                const isColored = part < coloredParts;
                const colors = ['bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-yellow-400', 'bg-purple-400'];
                const colorClass = isColored ? colors[part % colors.length] : 'bg-gray-300';
                
                return (
                  <div
                    key={part}
                    className={`w-8 h-8 rounded-full border-2 border-gray-400 transition-all duration-300 hover:scale-110 ${colorClass} shadow-md`}
                  />
                );
              })}
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <span className="text-2xl">🍬</span>
                Bonbons
              </span>
            </div>
          </div>
        );

      case 'circle':
      default:
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm">
            <div className="w-48 h-48 mx-auto relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full shadow-lg"></div>
              <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                <circle cx="100" cy="100" r="85" fill="white" stroke="#059669" strokeWidth="3"/>
                {parts.map((part) => {
                  const isColored = part < coloredParts;
                  const angle = (360 / totalParts);
                  const startAngle = part * angle - 90;
                  const endAngle = (part + 1) * angle - 90;
                  
                  const x1 = 100 + 85 * Math.cos(startAngle * Math.PI / 180);
                  const y1 = 100 + 85 * Math.sin(startAngle * Math.PI / 180);
                  const x2 = 100 + 85 * Math.cos(endAngle * Math.PI / 180);
                  const y2 = 100 + 85 * Math.sin(endAngle * Math.PI / 180);
                  
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  return (
                    <g key={part}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 85 85 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={isColored ? '#10b981' : 'white'}
                        stroke="#059669"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                      <line x1="100" y1="100" x2={x1} y2={y1} stroke="#059669" strokeWidth="1"/>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-emerald-700 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Cercle
              </span>
            </div>
          </div>
        );
    }
  };

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    const correct = userAnswer.trim() === exercise.answer;
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
  };

  const getScoreColor = () => {
    const percentage = attempts > 0 ? (score / attempts) * 100 : 0;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = () => {
    const percentage = attempts > 0 ? (score / attempts) * 100 : 0;
    if (percentage >= 90) return { icon: Trophy, color: 'bg-yellow-100 text-yellow-800', text: 'Excellent!' };
    if (percentage >= 70) return { icon: Star, color: 'bg-blue-100 text-blue-800', text: 'Très bien!' };
    if (percentage >= 50) return { icon: Award, color: 'bg-green-100 text-green-800', text: 'Bien!' };
    return { icon: Target, color: 'bg-gray-100 text-gray-800', text: 'Continue!' };
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header avec navigation moderne */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/chapitre/cm1-fractions-equivalentes" 
                  className="group p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300">
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Comprendre les fractions
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Découvrir ce qu'est une fraction et comment la lire
              </p>
            </div>
            {attempts > 0 && (
              <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className={`font-bold ${getScoreColor()}`}>
                  {score}/{attempts}
                </span>
                <span className="text-sm text-gray-700">
                  ({Math.round((score/attempts) * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section Cours - Design moderne */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Book className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Qu'est-ce qu'une fraction ?</h2>
                  <p className="text-blue-100 mt-1">Comprendre les bases des fractions</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg mb-3">📝 Définition</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Une <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">fraction</span> représente une 
                      <span className="font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded mx-1">partie d'un tout</span>. 
                      Elle s'écrit avec deux nombres séparés par une barre : le 
                      <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded mx-1">numérateur</span> (en haut) 
                      et le <span className="font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded mx-1">dénominateur</span> (en bas).
                    </p>
                  </div>
                </div>
              </div>

              {/* Exemple animé avec design amélioré */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-200 shadow-lg">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-2xl border border-yellow-200">
                    <Sparkles className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Exemple : La fraction 3/4
                    </h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                  {/* Représentation visuelle de la pizza */}
                  <div className="flex flex-col items-center justify-center">
                    {renderVisualFraction(4, 3, 'pizza')}
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-xl border border-orange-200 animate-fade-in-up">
                        <CheckCircle className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-orange-800">3 parts coloriées sur 4</span>
                      </div>
                    </div>
                  </div>

                  {/* Fraction avec étiquettes */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200 animate-pulse-subtle">
                      <div className="flex items-center justify-center relative">
                        <div className="text-center">
                          <div className="text-8xl font-bold text-blue-600 leading-none animate-bounce-gentle">3</div>
                          <div className="h-2 bg-gray-400 w-20 mx-auto my-3 rounded animate-glow"></div>
                          <div className="text-8xl font-bold text-purple-600 leading-none animate-bounce-gentle-delay">4</div>
                        </div>
                        
                        {/* Labels */}
                        <div className="absolute -right-24 top-8 animate-slide-in-right">
                          <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                            Numérateur
                          </div>
                        </div>
                        <div className="absolute -right-24 bottom-8 animate-slide-in-right-delay">
                          <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                            Dénominateur
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center animate-fade-in-up">
                        <div className="text-lg font-medium text-gray-700">
                          <span className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Numérateur</span> en haut, <span className="text-purple-600 font-bold hover:text-purple-700 transition-colors">dénominateur</span> en bas
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explication des termes */}
                <div className="space-y-4 mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="font-bold text-blue-700">Numérateur (3) :</span>
                      <span className="text-gray-700">Nombre de parts prises</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span className="font-bold text-purple-700">Dénominateur (4) :</span>
                      <span className="text-gray-700">Nombre total de parts</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-md">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <span className="font-bold text-green-800 text-xl">Se lit :</span>
                    </div>
                    <div className="text-3xl font-bold text-green-700 mb-3">
                      "Trois quarts"
                    </div>
                    <div className="text-lg text-gray-700 bg-white px-4 py-2 rounded-xl border border-green-200">
                      Ou "3 sur 4"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercices pratiques - Design moderne */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Exercices pratiques</h2>
                  <p className="text-green-100 mt-1">Teste tes connaissances</p>
                </div>
              </div>
              
              {attempts > 0 && (
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-bold text-lg">{score}/{attempts}</span>
                    </div>
                  </div>
                  {(() => {
                    const badge = getScoreBadge();
                    return (
                      <div className={`px-3 py-1 rounded-xl ${badge.color} border`}>
                        <div className="flex items-center gap-1">
                          <badge.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{badge.text}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {currentExercise < exercises.length ? (
              <div className="space-y-8">
                {/* Progress bar */}
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                  ></div>
                </div>

                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                    <span className="text-sm font-medium text-gray-600">
                      Exercice {currentExercise + 1} sur {exercises.length}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-800 max-w-2xl mx-auto leading-relaxed">
                    {getCurrentExercise().question}
                  </h3>
                </div>

                {/* Représentation visuelle avec design amélioré */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    {renderVisualFraction(getCurrentExercise().totalParts, getCurrentExercise().coloredParts, getCurrentExercise().type)}
                  </div>
                </div>

                {/* Zone de réponse moderne */}
                <div className="max-w-lg mx-auto">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <div className="text-center space-y-4">
                      <label className="block text-lg font-medium text-gray-700">
                        🎯 Ta réponse :
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Ex: 3/4"
                          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-center font-bold text-2xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:bg-white focus:outline-none transition-all duration-200"
                        />
                      </div>
                      <div className="text-sm text-gray-800 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                        💡 Écris ta réponse sous la forme : numérateur/dénominateur
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action avec design moderne */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="group px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {showHelp ? 'Masquer l\'aide' : 'Aide'}
                  </button>
                  
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer || showAnswer}
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    ✓ Vérifier
                  </button>
                  
                  {showAnswer && (
                    <button
                      onClick={nextExercise}
                      className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Suivant
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Aide avec design amélioré */}
                {showHelp && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Lightbulb className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-blue-900">Comment faire ?</h4>
                    </div>
                    <ol className="space-y-3 text-blue-800">
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                        <span>Compte le nombre de parts <span className="font-bold bg-green-100 px-2 py-1 rounded">coloriées</span> → Ce sera le numérateur</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                        <span>Compte le nombre <span className="font-bold bg-purple-100 px-2 py-1 rounded">total</span> de parts → Ce sera le dénominateur</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                        <span>Écris la fraction : <span className="font-mono bg-gray-100 px-2 py-1 rounded">parts coloriées / total des parts</span></span>
                      </li>
                    </ol>
                  </div>
                )}

                {/* Résultat avec design moderne */}
                {showAnswer && (
                  <div className={`rounded-2xl p-6 border-2 shadow-lg ${
                    isCorrect 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                      : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl ${
                        isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-xl mb-2 ${
                          isCorrect ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {isCorrect ? '🎉 Correct !' : `❌ Incorrect`}
                        </h4>
                        {!isCorrect && (
                          <div className="bg-white rounded-xl p-3 mb-3 border border-red-200">
                            <span className="font-semibold text-red-700">
                              La bonne réponse est : <span className="text-2xl font-bold">{getCurrentExercise().answer}</span>
                            </span>
                          </div>
                        )}
                        <p className="text-gray-700 bg-white rounded-xl p-3 border border-gray-200">
                          <span className="font-medium">💡 Explication :</span> {getCurrentExercise().explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Écran de fin avec design moderne */
              <div className="text-center py-12 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-20"></div>
                  <Trophy className="w-24 h-24 text-yellow-500 mx-auto relative z-10" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    🎉 Félicitations !
                  </h3>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 max-w-md mx-auto">
                    <p className="text-xl text-gray-700 mb-4">
                      Tu as terminé tous les exercices !
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className={`text-3xl font-bold ${getScoreColor()}`}>
                        {score}/{attempts}
                      </div>
                      <div className="text-gray-700">|</div>
                      <div className={`text-xl font-semibold ${getScoreColor()}`}>
                        {Math.round((score/attempts) * 100)}%
                      </div>
                    </div>
                    {(() => {
                      const badge = getScoreBadge();
                      return (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${badge.color}`}>
                          <badge.icon className="w-5 h-5" />
                          <span className="font-semibold">{badge.text}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                <button
                  onClick={resetExercises}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🔄 Recommencer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 