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
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'representer',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce1-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'representer');
      
      if (existingIndex >= 0) {
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
          allProgress[existingIndex].attempts += 1;
        }
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('ce1-nombres-progress', JSON.stringify(allProgress));
  };
  
  // États pour l'animation
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

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
    { number: 150, range: '0-1000', tolerance: 25 }
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
    const percentage = ((value - min) / (max - min)) * 100;
    // Arrondir à 2 décimales pour plus de précision
    return Math.round(percentage * 100) / 100;
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

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      if (userPosition === null) return;
      
      const targetNumber = exercises[currentExercise].number;
      const tolerance = exercises[currentExercise].tolerance;
      const correct = Math.abs(userPosition - targetNumber) <= tolerance;
      
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
      }

      // Si bonne réponse → passage automatique après 1.5s
      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserPosition(null);
            setIsCorrect(null);
          } else {
            // Dernier exercice terminé, afficher la modale
            const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(finalScoreValue);
            setShowCompletionModal(true);
            
            // Sauvegarder les progrès
            saveProgress(finalScoreValue, exercises.length);
          }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserPosition(null);
        setIsCorrect(null);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        saveProgress(score, exercises.length);
      }
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
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonctions pour l'animation
  const getCurrentNumbers = () => {
    return numbersToPlace[selectedRange as keyof typeof numbersToPlace] || [];
  };

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
  };

  // Réinitialiser la sélection quand on change de plage
  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    setSelectedNumber(null);
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
              
              {/* Message d'explication */}
              <div className="text-center mb-6">
                <div className="bg-yellow-100 rounded-lg p-4 inline-block">
                  <span className="text-yellow-800 font-bold">
                    👆 Clique sur un nombre ci-dessous pour le voir sur la droite !
                  </span>
                </div>
              </div>

              {/* Message quand un nombre est sélectionné */}
              {selectedNumber && getCurrentNumbers().includes(selectedNumber) && (
                <div className="text-center mb-6">
                  <div className="bg-green-100 rounded-lg p-4 inline-block">
                    <span className="text-green-800 font-bold">
                      ✨ Le nombre {selectedNumber} est maintenant placé sur la droite ! ✨
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
                        <div className="w-1 h-6 bg-gray-600 -mt-2 mx-auto"></div>
                        <div className="text-xs md:text-sm font-bold text-gray-700 mt-1 text-center min-w-max transform -translate-x-1/2">
                          {value}
                        </div>
                      </div>
                    );
                  })}

                  {/* Nombre sélectionné sur la droite */}
                  {selectedNumber && getCurrentNumbers().includes(selectedNumber) && (
                    <div
                      className="absolute top-0 transform -translate-x-1/2 highlight-animation"
                      style={{ left: `${getPositionPercentage(selectedNumber, selectedRange)}%` }}
                    >
                      {/* Carré rouge exactement sur le trait de graduation */}
                      <div className="w-3 h-6 bg-red-500 rounded -mt-2 mx-auto shadow-lg"></div>
                      {/* Étiquette avec le nombre au-dessus */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                        <div className="text-xs md:text-sm font-bold text-white text-center bg-red-500 px-2 md:px-3 py-1 md:py-2 rounded-lg shadow-lg border-2 border-red-300 min-w-max">
                          {selectedNumber}
                        </div>
                      </div>
                      {/* Petit effet de brillance */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-12">
                        <div className="text-yellow-400 text-xl animate-bounce">✨</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Nombres à cliquer */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 relative">
                {getCurrentNumbers().map((num) => {
                  const isSelected = selectedNumber === num;
                  
                  return (
                    <div key={num} className="text-center relative">
                      <button
                        onClick={() => handleNumberClick(num)}
                        className={`w-full rounded-lg p-3 mb-2 transition-all duration-300 hover:scale-105 ${
                          isSelected 
                            ? 'bg-green-200 transform scale-110 shadow-lg border-2 border-green-400' 
                            : 'bg-yellow-100 hover:bg-yellow-200 border-2 border-transparent'
                        }`}
                      >
                        <div className={`text-2xl font-bold transition-colors ${
                          isSelected 
                            ? 'text-green-800' 
                            : 'text-yellow-800'
                        }`}>
                          {num}
                        </div>
                      </button>
                      
                      <div className="text-sm text-gray-600">
                        {isSelected ? '✅ Sélectionné !' : '👆 Clique pour voir'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bouton pour effacer */}
              {selectedNumber && getCurrentNumbers().includes(selectedNumber) && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setSelectedNumber(null)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    🔄 Effacer
                  </button>
                </div>
              )}
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-white">💡 Astuces pour placer un nombre</h3>
              <ul className="space-y-2 text-white">
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
                <div className="text-lg font-bold text-orange-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-2 md:p-8 shadow-lg">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-center text-gray-900">
                🎯 Place le nombre {exercises[currentExercise].number} sur la droite
              </h3>
              
              <div className="bg-yellow-50 rounded-lg p-3 md:p-4 mb-4 md:mb-8 text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-800 mb-2">
                  {exercises[currentExercise].number}
                </div>
                <div className="text-base md:text-lg text-yellow-700 mb-2">
                  Clique sur la droite pour placer ce nombre !
                </div>
                <div className="text-xs md:text-sm text-yellow-600">
                  Puis utilise les boutons -1 et +1 pour ajuster précisément 🎯
                </div>
              </div>

              {/* Droite numérique interactive */}
              <div className="relative mb-6 md:mb-8 px-1 md:px-16">
                {/* Boutons d'ajustement */}
                {userPosition !== null && (
                  <>
                    {/* Bouton -1 à gauche */}
                    <button
                      onClick={() => setUserPosition(Math.max(
                        ranges[exercises[currentExercise].range as keyof typeof ranges].min,
                        userPosition - 1
                      ))}
                      className="absolute -left-2 md:left-0 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm md:text-lg shadow-lg z-10"
                    >
                      -1
                    </button>
                    
                    {/* Bouton +1 à droite */}
                    <button
                      onClick={() => setUserPosition(Math.min(
                        ranges[exercises[currentExercise].range as keyof typeof ranges].max,
                        userPosition + 1
                      ))}
                      className="absolute -right-2 md:right-0 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm md:text-lg shadow-lg z-10"
                    >
                      +1
                    </button>
                    

                  </>
                )}
                
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
                      <div className="w-1 h-8 bg-gray-600 -mt-2 mx-auto"></div>
                      <div className="text-xs md:text-sm font-bold text-gray-700 mt-2 text-center min-w-max transform -translate-x-1/2">
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
                      {/* Carré bleu exactement sur le trait de graduation */}
                      <div className="w-3 h-8 bg-blue-500 rounded -mt-2 mx-auto shadow-lg"></div>
                      {/* Étiquette avec le nombre au-dessus */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                        <div className="text-xs md:text-sm font-bold text-blue-700 text-center bg-blue-100 px-1 md:px-2 py-0.5 md:py-1 rounded min-w-max">
                          {userPosition}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Position correcte (après vérification) */}
                  {isCorrect !== null && (
                    <div
                      className="absolute top-0 transform -translate-x-1/2"
                      style={{ left: `${getPositionPercentage(exercises[currentExercise].number, exercises[currentExercise].range)}%` }}
                    >
                      {/* Carré vert exactement sur le trait de graduation */}
                      <div className="w-3 h-8 bg-green-500 rounded -mt-2 mx-auto shadow-lg"></div>
                      {/* Étiquette avec le nombre au-dessus */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                        <div className="text-xs md:text-sm font-bold text-green-700 text-center bg-green-100 px-1 md:px-2 py-0.5 md:py-1 rounded min-w-max">
                          {exercises[currentExercise].number}
                        </div>
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
                    <div className="text-xs md:text-sm text-gray-600 mt-2">
                      💡 Utilise les boutons -1/+1 aux extrémités pour ajuster !
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center space-x-4 mb-4 md:mb-6">
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm md:text-base"
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
                        <span className="font-bold text-sm md:text-base">Bravo ! Tu as bien placé le nombre !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold text-sm md:text-base">
                          Pas tout à fait... Le nombre {exercises[currentExercise].number} se place là où tu vois le point vert.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-3 md:space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  ← Précédent
                </button>
                <button
                  onClick={handleNext}
                  disabled={userPosition === null && isCorrect === null}
                  className="bg-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  <Target className="inline w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
                  {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>


          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent !", message: "Tu maîtrises parfaitement la représentation des nombres sur une droite !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Bien joué !", message: "Tu sais bien placer les nombres ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue à t'entraîner !", message: "Recommence les exercices pour mieux maîtriser la représentation des nombres.", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score final : {finalScore}/{exercises.length} ({percentage}%)
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors"
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
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 