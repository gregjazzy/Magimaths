'use client';

import { useState } from 'react';
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

// Animation interactive pour enseigner la reconnaissance
function ReconnaissanceAnimation() {
  const [step, setStep] = useState(0);
  const [currentExample, setCurrentExample] = useState(0);

  const examples = [
    { fraction: '1/2', parts: 2, colored: 1, description: 'Une moitié = 1 part sur 2', color: '#10b981' },
    { fraction: '1/3', parts: 3, colored: 1, description: 'Un tiers = 1 part sur 3', color: '#3b82f6' },
    { fraction: '1/4', parts: 4, colored: 1, description: 'Un quart = 1 part sur 4', color: '#f59e0b' },
    { fraction: '2/4', parts: 4, colored: 2, description: 'Deux quarts = 2 parts sur 4', color: '#8b5cf6' },
    { fraction: '3/5', parts: 5, colored: 3, description: 'Trois cinquièmes = 3 parts sur 5', color: '#ec4899' }
  ];

  const current = examples[currentExample];

  // Fonction pour créer la visualisation SVG en pie chart
  const renderFractionVisual = (parts: number, coloredParts: number, color: string, animated: boolean) => {
    const radius = 60;
    const centerX = 80;
    const centerY = 80;
    
    const svgParts = [];
    const anglePerPart = 360 / parts;
    
    for (let i = 0; i < parts; i++) {
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
      
      const shouldColor = animated ? (step >= 2 && i < coloredParts) : (i < coloredParts);
      const fillColor = shouldColor ? color : '#f3f4f6';
      const strokeColor = '#6b7280';
      
      svgParts.push(
        <path
          key={i}
          d={pathData}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="3"
          className="transition-all duration-1000"
        />
      );
    }
    
    return svgParts;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <p className="text-center text-lg font-bold text-green-800">
          👁️ <strong>Apprends à reconnaître :</strong> Compte les parts et trouve la fraction !
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
              {renderFractionVisual(current.parts, current.colored, current.color, true)}
            </svg>
          </div>
          {step >= 3 && (
            <div className="text-3xl mb-2">
              <FractionMath a={current.colored.toString()} b={current.parts.toString()} size="text-3xl" />
            </div>
          )}
          {step >= 4 && (
            <div className="text-xl font-bold text-green-600">
              = {current.fraction}
            </div>
          )}
        </div>
      </div>

      {/* Explication étape par étape */}
      <div className="text-center mb-6">
        {step === 0 && (
          <p className="text-xl text-gray-700">
            🍰 Voici un gâteau divisé en {current.parts} parts égales
          </p>
        )}
        {step === 1 && (
          <p className="text-xl text-blue-700">
            🔢 Je compte le nombre total de parts : <strong>{current.parts}</strong>
          </p>
        )}
        {step === 2 && (
          <p className="text-xl text-purple-700">
            🎨 Je compte les parts coloriées : <strong>{current.colored}</strong>
          </p>
        )}
        {step === 3 && (
          <div>
            <p className="text-xl text-green-700 mb-2">
              ✍️ J'écris la fraction : <strong>{current.colored}</strong> parts coloriées sur <strong>{current.parts}</strong> parts totales
            </p>
          </div>
        )}
        {step >= 4 && (
          <div>
            <p className="text-xl text-green-700 mb-2">
              🎯 <strong>{current.description}</strong>
            </p>
            <div className="bg-yellow-100 rounded-lg p-3">
              <p className="text-lg font-bold text-yellow-800">
                💡 {current.colored}/{current.parts} = {current.fraction} !
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setStep(0)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
        >
          🔄 Recommencer
        </button>
        <button
          onClick={() => setStep(prev => Math.min(4, prev + 1))}
          disabled={step === 4}
          className={`bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50 transition-colors ${
            step < 4 ? 'animate-pulse shadow-lg shadow-green-300' : ''
          }`}
        >
          Suivant →
        </button>
      </div>

      {/* Navigation entre exemples */}
      <div className="flex justify-center space-x-2">
        {examples.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentExample(index);
              setStep(0);
            }}
            className={`w-12 h-12 rounded-full font-bold transition-all ${
              currentExample === index
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {examples[index].fraction}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReconnaissanceFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'reconnaissance';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 14; // XP de base pour cette section
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
    { fraction: '1/2', shape: 'circle', parts: 2, colored: 1, description: 'Une moitié = 1 part sur 2' },
    { fraction: '1/3', shape: 'circle', parts: 3, colored: 1, description: 'Un tiers = 1 part sur 3' },
    { fraction: '1/4', shape: 'circle', parts: 4, colored: 1, description: 'Un quart = 1 part sur 4' },
    { fraction: '2/3', shape: 'circle', parts: 3, colored: 2, description: 'Deux tiers = 2 parts sur 3' }
  ];

  const exercises = [
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 2,
      coloredParts: 1,
      options: ['1/2', '1/3', '2/1', '1/4'],
      correctAnswer: '1/2',
      hint: 'Il y a 2 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 4,
      coloredParts: 1,
      options: ['1/2', '1/4', '4/1', '1/3'],
      correctAnswer: '1/4',
      hint: 'Il y a 4 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 3,
      coloredParts: 1,
      options: ['1/3', '3/1', '1/2', '1/4'],
      correctAnswer: '1/3',
      hint: 'Il y a 3 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 4,
      coloredParts: 2,
      options: ['1/4', '2/4', '4/2', '1/2'],
      correctAnswer: '2/4',
      hint: 'Il y a 4 parts au total, 2 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 6,
      coloredParts: 1,
      options: ['1/6', '6/1', '1/3', '1/2'],
      correctAnswer: '1/6',
      hint: 'Il y a 6 parts au total, 1 est coloriée'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 3,
      coloredParts: 2,
      options: ['2/3', '3/2', '1/3', '1/2'],
      correctAnswer: '2/3',
      hint: 'Il y a 3 parts au total, 2 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 5,
      coloredParts: 2,
      options: ['2/5', '5/2', '1/5', '3/5'],
      correctAnswer: '2/5',
      hint: 'Il y a 5 parts au total, 2 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 4,
      coloredParts: 3,
      options: ['3/4', '4/3', '1/4', '1/3'],
      correctAnswer: '3/4',
      hint: 'Il y a 4 parts au total, 3 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 6,
      coloredParts: 3,
      options: ['3/6', '6/3', '1/6', '1/2'],
      correctAnswer: '3/6',
      hint: 'Il y a 6 parts au total, 3 sont coloriées'
    },
    {
      question: 'Quelle fraction représente la partie colorée ?',
      shape: 'circle',
      totalParts: 8,
      coloredParts: 3,
      options: ['3/8', '8/3', '1/8', '3/4'],
      correctAnswer: '3/8',
      hint: 'Il y a 8 parts au total, 3 sont coloriées'
    }
  ];

  // Fonction pour créer la visualisation SVG des fractions en pie chart
  const renderFractionVisual = (totalParts: number, coloredParts: number) => {
    const radius = 50;
    const centerX = 60;
    const centerY = 60;
    
    const svgParts = [];
    const anglePerPart = 360 / totalParts;
    
    for (let i = 0; i < totalParts; i++) {
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
      
      const fillColor = i < coloredParts ? '#10b981' : '#f3f4f6';
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
    
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
        {svgParts}
      </svg>
    );
  };

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              👁️ Reconnaître les fractions
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Regarde le dessin et trouve la fraction !
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
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-emerald-500 text-white shadow-md' 
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
            {/* Introduction */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold mb-4">Détective des fractions !</h2>
                <p className="text-lg">
                  Regarde bien les dessins et trouve quelle fraction ils représentent. 
                  Compte les parts totales et les parts coloriées !
                </p>
              </div>
            </div>

            {/* Animation interactive */}
            <ReconnaissanceAnimation />

            {/* Méthode step by step */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📝 Méthode étape par étape
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h3 className="font-bold text-green-800 mb-2">Observer</h3>
                  <p className="text-green-700 text-sm">Regarde bien le dessin</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h3 className="font-bold text-blue-800 mb-2">Compter le total</h3>
                  <p className="text-blue-700 text-sm">Combien de parts en tout ?</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h3 className="font-bold text-purple-800 mb-2">Compter les coloriées</h3>
                  <p className="text-purple-700 text-sm">Combien de parts coloriées ?</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">4️⃣</div>
                  <h3 className="font-bold text-yellow-800 mb-2">Écrire</h3>
                  <p className="text-yellow-700 text-sm">Coloriées/Total</p>
                </div>
              </div>
            </div>

            {/* Exemples avec visualisation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                📋 Exemples pour s'entraîner
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
                    <div className="text-center mb-4">
                      <FractionMath a={example.colored.toString()} b={example.parts.toString()} size="text-2xl" />
                    </div>
                    <div className="text-center mb-4">
                      {renderFractionVisual(example.parts, example.colored)}
                    </div>
                    <p className="text-center text-gray-700 text-sm font-medium">
                      {example.description}
                    </p>
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
                    Compte toujours le total d'abord
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Puis compte les parts coloriées
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Vérifie que tu comptes bien
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Le dénominateur = nombre total
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Le numérateur = nombre colorié
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Prends ton temps !
                  </li>
                </ul>
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
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {exercises[currentExercise].question}
                </h3>

                <div className="mb-8">
                  {renderFractionVisual(
                    exercises[currentExercise].totalParts,
                    exercises[currentExercise].coloredParts
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                  {exercises[currentExercise].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setUserAnswer(option)}
                      disabled={isCorrect !== null}
                      className={`p-4 rounded-lg border-2 font-bold text-lg transition-all hover:scale-105 ${
                        userAnswer === option
                          ? 'bg-green-500 text-white border-green-500 shadow-lg'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-green-300'
                      } ${isCorrect !== null ? 'opacity-75' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Boutons d'action */}
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
                  <button
                    onClick={handleNext}
                    disabled={!userAnswer && isCorrect === null}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 ${
                      isCorrect === null 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    } ${!userAnswer && isCorrect === null ? '' : 'animate-pulse shadow-lg'}`}
                  >
                    {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                  </button>
                </div>

                {/* Indice */}
                {showHint && (
                  <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-yellow-800">
                      <Lightbulb className="w-5 h-5" />
                      <span className="font-bold">{exercises[currentExercise].hint}</span>
                    </div>
                  </div>
                )}

                {/* Résultat */}
                {isCorrect !== null && (
                  <div className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center justify-center space-x-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-bold">Excellent ! Tu es un vrai détective !</span>
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
                    title: "🕵️ Détective expert !", 
                    message: "Tu maîtrises parfaitement la reconnaissance de fractions !", 
                    color: "text-green-600",
                    bgColor: "bg-green-50" 
                  };
                  if (percentage >= 70) return { 
                    title: "🎯 Très bien !", 
                    message: "Tu reconnais bien les fractions !", 
                    color: "text-green-600",
                    bgColor: "bg-green-50" 
                  };
                  if (percentage >= 50) return { 
                    title: "📚 En progression !", 
                    message: "Continue à t'entraîner avec les fractions !", 
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50" 
                  };
                  return { 
                    title: "💪 Continue !", 
                    message: "La reconnaissance demande de l'entraînement !", 
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
                        🌟 {Math.round(14 * (finalScore / exercises.length))} XP gagnés !
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px]"
                      >
                        Fermer
                      </button>
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          resetAll();
                        }}
                        className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors touch-manipulation min-h-[44px]"
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