'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target } from 'lucide-react';

// Styles personnalisés pour les animations
const animationStyles = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .bounce-animation {
    animation: bounce 0.6s ease-in-out infinite;
  }
  
  @keyframes highlight {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 rgba(239, 68, 68, 0.5);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
    }
  }
  
  .highlight-animation {
    animation: highlight 1s ease-in-out;
  }
`;

export default function RepresenterNombresCE1Page() {
  const [selectedRange, setSelectedRange] = useState('0-100');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  
  // États pour l'animation
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [placedNumbers, setPlacedNumbers] = useState<number[]>([]);
  const [animationStarted, setAnimationStarted] = useState(false);

  const ranges = {
    '0-100': { min: 0, max: 100, step: 10 },
    '100-200': { min: 100, max: 200, step: 10 },
    '200-300': { min: 200, max: 300, step: 10 },
    '0-1000': { min: 0, max: 1000, step: 100 }
  };

  // Nombres à placer pour chaque plage
  const numbersToPlace = {
    '0-100': [35, 47, 73, 83],
    '100-200': [125, 147, 165, 185],
    '200-300': [215, 235, 267, 285],
    '0-1000': [150, 350, 650, 850]
  };

  const exercises = [
    { number: 35, range: '0-100', tolerance: 5 },
    { number: 47, range: '0-100', tolerance: 5 },
    { number: 73, range: '0-100', tolerance: 5 },
    { number: 83, range: '0-100', tolerance: 5 },
    { number: 27, range: '0-100', tolerance: 5 },
    { number: 64, range: '0-100', tolerance: 5 },
    { number: 125, range: '100-200', tolerance: 5 },
    { number: 147, range: '100-200', tolerance: 5 },
    { number: 165, range: '100-200', tolerance: 5 },
    { number: 185, range: '100-200', tolerance: 5 },
    { number: 135, range: '100-200', tolerance: 5 },
    { number: 175, range: '100-200', tolerance: 5 },
    { number: 215, range: '200-300', tolerance: 5 },
    { number: 235, range: '200-300', tolerance: 5 },
    { number: 267, range: '200-300', tolerance: 5 },
    { number: 285, range: '200-300', tolerance: 5 },
    { number: 225, range: '200-300', tolerance: 5 },
    { number: 275, range: '200-300', tolerance: 5 },
    { number: 150, range: '0-1000', tolerance: 25 },
    { number: 350, range: '0-1000', tolerance: 25 },
    { number: 650, range: '0-1000', tolerance: 25 },
    { number: 850, range: '0-1000', tolerance: 25 },
    { number: 250, range: '0-1000', tolerance: 25 },
    { number: 750, range: '0-1000', tolerance: 25 }
  ];

  const generateGraduations = (range: string) => {
    const { min, max, step } = ranges[range as keyof typeof ranges];
    const graduations = [];
    for (let i = min; i <= max; i += step) {
      graduations.push(i);
    }
    return graduations;
  };

  const getPositionPercentage = (value: number, range: string) => {
    const { min, max } = ranges[range as keyof typeof ranges];
    return ((value - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (position: number, range: string) => {
    const { min, max } = ranges[range as keyof typeof ranges];
    return Math.round(min + (position / 100) * (max - min));
  };

  const handleLineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const value = getValueFromPosition(percentage, exercises[currentExercise].range);
    setUserPosition(value);
  };

  const checkAnswer = () => {
    if (userPosition === null) return;
    
    const targetNumber = exercises[currentExercise].number;
    const tolerance = exercises[currentExercise].tolerance;
    const correct = Math.abs(userPosition - targetNumber) <= tolerance;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserPosition(null);
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserPosition(null);
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserPosition(null);
    setIsCorrect(null);
    setScore(0);
  };

  // Fonctions pour l'animation
  const getCurrentNumbers = () => {
    return numbersToPlace[selectedRange as keyof typeof numbersToPlace] || [];
  };

  const startAnimation = () => {
    setAnimationStarted(true);
    setAnimationStep(0);
    setPlacedNumbers([]);
    setIsAnimating(false);
  };

  const nextAnimationStep = () => {
    const numbers = getCurrentNumbers();
    
    if (animationStep < numbers.length && !isAnimating && animationStarted) {
      setIsAnimating(true);
      const currentNumber = numbers[animationStep];
      
      // Placer immédiatement le nombre sur la droite
      setPlacedNumbers(prev => [...prev, currentNumber]);
      
      // Avancer à l'étape suivante
      setTimeout(() => {
        setAnimationStep(animationStep + 1);
        setIsAnimating(false);
      }, 800);
    }
  };

  const resetAnimation = () => {
    setAnimationStep(0);
    setPlacedNumbers([]);
    setIsAnimating(false);
    setAnimationStarted(false);
  };

  // Réinitialiser l'animation quand on change de plage
  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    resetAnimation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Injection des styles CSS personnalisés */}
      <style jsx>{animationStyles}</style>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📏 Représenter les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à placer les nombres sur une droite numérique !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-red-500 text-white shadow-md' 
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
            {/* Explication de la droite numérique */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Qu'est-ce qu'une droite numérique ?
              </h2>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-blue-900 text-center mb-4">
                  Une droite numérique est comme une règle avec des nombres.
                  Plus on va vers la droite, plus les nombres sont grands !
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="bg-blue-200 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">⬅️</div>
                    <div className="font-bold text-blue-800">Plus petit</div>
                  </div>
                  <div className="bg-blue-200 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">➡️</div>
                    <div className="font-bold text-blue-800">Plus grand</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de plage */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis une plage de nombres
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Object.keys(ranges).map((range) => (
                  <button
                    key={range}
                    onClick={() => handleRangeChange(range)}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      selectedRange === range
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Droite numérique interactive avec animation */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-8 text-center text-gray-900">
                📏 Droite numérique de {selectedRange}
              </h3>
              
              {/* Contrôles d'animation */}
              <div className="flex justify-center space-x-4 mb-8">
                {!animationStarted ? (
                  <button
                    onClick={startAnimation}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                  >
                    🎬 Démarrer l'animation
                  </button>
                ) : (
                  <>
                    <button
                      onClick={nextAnimationStep}
                      disabled={animationStep >= getCurrentNumbers().length || isAnimating}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      ➡️ Étape suivante
                    </button>
                    <button
                      onClick={resetAnimation}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                    >
                      🔄 Recommencer
                    </button>
                  </>
                )}
              </div>

              {/* Indicateur d'étape */}
              {animationStarted && (
                <div className="text-center mb-6">
                  <div className="bg-blue-100 rounded-lg p-3 inline-block">
                    <span className="text-blue-800 font-bold">
                      Étape {animationStep} sur {getCurrentNumbers().length}
                    </span>
                    <div className="text-sm mt-1">
                      Nombres placés : {placedNumbers.length > 0 ? placedNumbers.join(', ') : 'Aucun'}
                    </div>
                  </div>
                </div>
              )}

              {/* Message d'explication */}
              {!animationStarted && (
                <div className="text-center mb-6">
                  <div className="bg-yellow-100 rounded-lg p-4 inline-block">
                    <span className="text-yellow-800 font-bold">
                      👆 Clique sur "Démarrer l'animation" pour commencer !
                    </span>
                  </div>
                </div>
              )}

              {/* Message pour les étapes */}
              {animationStarted && animationStep < getCurrentNumbers().length && !isAnimating && (
                <div className="text-center mb-6">
                  <div className="bg-blue-100 rounded-lg p-4 inline-block">
                    <span className="text-blue-800 font-bold">
                      👆 Clique sur "Étape suivante" pour placer le nombre {getCurrentNumbers()[animationStep]} !
                    </span>
                  </div>
                </div>
              )}

              {/* Message pendant l'animation */}
              {isAnimating && (
                <div className="text-center mb-6">
                  <div className="bg-purple-100 rounded-lg p-4 inline-block animate-pulse">
                    <span className="text-purple-800 font-bold">
                      ✨ Le nombre {getCurrentNumbers()[animationStep - 1]} se place sur la droite ! ✨
                    </span>
                  </div>
                </div>
              )}
              
              <div className="relative mb-16 mt-12">
                {/* Ligne principale */}
                <div className="h-2 bg-gray-300 rounded-full relative">
                  {/* Graduations */}
                  {generateGraduations(selectedRange).map((value, index) => {
                    const position = getPositionPercentage(value, selectedRange);
                    return (
                      <div
                        key={value}
                        className="absolute top-0 transform -translate-x-1/2"
                        style={{ left: `${position}%` }}
                      >
                        <div className="w-1 h-6 bg-gray-600 -mt-2"></div>
                        <div className="text-sm font-bold text-gray-700 mt-1 text-center transform -translate-x-1/2">
                          {value}
                        </div>
                      </div>
                    );
                  })}

                  {/* Nombres placés sur la droite */}
                  {placedNumbers.map((num, index) => {
                    const isLatestPlaced = index === placedNumbers.length - 1;
                    const position = getPositionPercentage(num, selectedRange);
                    return (
                      <div
                        key={num}
                        className={`absolute top-0 transform -translate-x-1/2 ${
                          isLatestPlaced ? 'highlight-animation' : ''
                        }`}
                        style={{ left: `${position}%` }}
                      >
                        <div className="w-3 h-10 bg-red-500 rounded -mt-4 shadow-lg"></div>
                        <div className="text-sm font-bold text-white mt-1 text-center transform -translate-x-1/2 bg-red-500 px-3 py-2 rounded-lg shadow-lg border-2 border-red-300">
                          {num}
                        </div>
                        {/* Petit effet de brillance */}
                        {isLatestPlaced && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8">
                            <div className="text-yellow-400 text-xl animate-bounce">✨</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nombres à placer avec animation */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 relative">
                {getCurrentNumbers().map((num, index) => {
                  const isCurrentNumber = index === animationStep && !placedNumbers.includes(num);
                  const isPlaced = placedNumbers.includes(num);
                  const isWaiting = index > animationStep;
                  
                  return (
                    <div key={num} className="text-center relative">
                      <div className={`rounded-lg p-3 mb-2 transition-all duration-500 ${
                        isCurrentNumber && isAnimating 
                          ? 'bg-blue-200 transform scale-110 bounce-animation' 
                          : isCurrentNumber 
                          ? 'bg-blue-200 transform scale-110 shadow-lg' 
                          : isPlaced 
                          ? 'bg-green-200 opacity-70' 
                          : 'bg-yellow-100'
                      }`}>
                        <div className={`text-2xl font-bold transition-colors ${
                          isCurrentNumber 
                            ? 'text-blue-800' 
                            : isPlaced 
                            ? 'text-green-800' 
                            : 'text-yellow-800'
                        }`}>
                          {num}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {isPlaced ? '✅ Placé !' : isCurrentNumber ? '👆 En cours' : isWaiting ? '⏳ En attente' : 'À placer'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message de fin */}
              {animationStarted && placedNumbers.length === getCurrentNumbers().length && placedNumbers.length > 0 && (
                <div className="mt-8 bg-green-100 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">
                    Félicitations !
                  </h4>
                  <p className="text-green-700">
                    Tous les nombres ont été placés correctement sur la droite numérique !
                  </p>
                  <p className="text-green-600 mt-2">
                    Clique sur "Recommencer" pour refaire l'animation.
                  </p>
                </div>
              )}
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour placer un nombre</h3>
              <ul className="space-y-2">
                <li>• Regarde les nombres marqués sur la droite</li>
                <li>• Trouve entre quels nombres se place ton nombre</li>
                <li>• S'il est au milieu, place-le au milieu !</li>
                <li>• S'il est plus proche d'un côté, place-le plus près</li>
                <li>• Plus le nombre est grand, plus il va vers la droite</li>
              </ul>
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
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-orange-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🎯 Place le nombre {exercises[currentExercise].number} sur la droite
              </h3>
              
              <div className="bg-yellow-50 rounded-lg p-4 mb-8 text-center">
                <div className="text-4xl font-bold text-yellow-800 mb-2">
                  {exercises[currentExercise].number}
                </div>
                <div className="text-lg text-yellow-700">
                  Clique sur la droite pour placer ce nombre !
                </div>
              </div>

              {/* Droite numérique interactive */}
              <div className="relative mb-8">
                <div 
                  className="h-4 bg-gray-300 rounded-full relative cursor-pointer hover:bg-gray-400 transition-colors"
                  onClick={handleLineClick}
                >
                  {/* Graduations */}
                  {generateGraduations(exercises[currentExercise].range).map((value) => (
                    <div
                      key={value}
                      className="absolute top-0 transform -translate-x-1/2"
                      style={{ left: `${getPositionPercentage(value, exercises[currentExercise].range)}%` }}
                    >
                      <div className="w-1 h-8 bg-gray-600 -mt-2"></div>
                      <div className="text-sm font-bold text-gray-700 mt-2 text-center transform -translate-x-1/2">
                        {value}
                      </div>
                    </div>
                  ))}

                  {/* Position choisie par l'utilisateur */}
                  {userPosition !== null && (
                    <div
                      className="absolute top-0 transform -translate-x-1/2"
                      style={{ left: `${getPositionPercentage(userPosition, exercises[currentExercise].range)}%` }}
                    >
                      <div className="w-3 h-8 bg-blue-500 rounded -mt-2"></div>
                      <div className="text-sm font-bold text-blue-700 mt-2 text-center transform -translate-x-1/2 bg-blue-100 px-2 py-1 rounded">
                        {userPosition}
                      </div>
                    </div>
                  )}

                  {/* Position correcte (après vérification) */}
                  {isCorrect !== null && (
                    <div
                      className="absolute top-0 transform -translate-x-1/2"
                      style={{ left: `${getPositionPercentage(exercises[currentExercise].number, exercises[currentExercise].range)}%` }}
                    >
                      <div className="w-3 h-8 bg-green-500 rounded -mt-2"></div>
                      <div className="text-sm font-bold text-green-700 mt-2 text-center transform -translate-x-1/2 bg-green-100 px-2 py-1 rounded">
                        {exercises[currentExercise].number}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {userPosition !== null && (
                <div className="text-center mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-lg font-bold text-blue-800">
                      Tu as placé le nombre à la position : {userPosition}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={userPosition === null}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  <Target className="inline w-4 h-4 mr-2" />
                  Vérifier
                </button>
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Recommencer
                </button>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Bravo ! Tu as bien placé le nombre !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Pas tout à fait... Le nombre {exercises[currentExercise].number} se place là où tu vois le point vert.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>

            {/* Félicitations */}
            {currentExercise === exercises.length - 1 && isCorrect !== null && (
              <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Magnifique !</h3>
                <p className="text-lg">
                  Tu sais maintenant représenter tous les nombres jusqu'à 1000 sur une droite !
                </p>
                <p className="text-xl font-bold mt-4">
                  Score final : {score}/{exercises.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 