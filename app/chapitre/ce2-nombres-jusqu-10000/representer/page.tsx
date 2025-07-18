'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target } from 'lucide-react';

export default function RepresenterNombresCE2Page() {
  const [selectedNumber, setSelectedNumber] = useState(2500);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const numberLineRef = useRef<HTMLDivElement>(null);

  const numberLines = [
    { min: 0, max: 1000, step: 100, label: '0 à 1 000' },
    { min: 1000, max: 2000, step: 100, label: '1 000 à 2 000' },
    { min: 2000, max: 3000, step: 100, label: '2 000 à 3 000' },
    { min: 3000, max: 4000, step: 100, label: '3 000 à 4 000' },
    { min: 4000, max: 5000, step: 100, label: '4 000 à 5 000' },
    { min: 5000, max: 6000, step: 100, label: '5 000 à 6 000' },
    { min: 6000, max: 7000, step: 100, label: '6 000 à 7 000' },
    { min: 7000, max: 8000, step: 100, label: '7 000 à 8 000' },
    { min: 8000, max: 9000, step: 100, label: '8 000 à 9 000' },
    { min: 9000, max: 10000, step: 100, label: '9 000 à 10 000' }
  ];

  const exercises = [
    { number: 1200, min: 1000, max: 2000 },
    { number: 2800, min: 2000, max: 3000 },
    { number: 3500, min: 3000, max: 4000 },
    { number: 4300, min: 4000, max: 5000 },
    { number: 5700, min: 5000, max: 6000 },
    { number: 6400, min: 6000, max: 7000 },
    { number: 7600, min: 7000, max: 8000 },
    { number: 8200, min: 8000, max: 9000 },
    { number: 9500, min: 9000, max: 10000 },
    { number: 500, min: 0, max: 1000 },
    { number: 1800, min: 1000, max: 2000 },
    { number: 2300, min: 2000, max: 3000 },
    { number: 3900, min: 3000, max: 4000 },
    { number: 4700, min: 4000, max: 5000 },
    { number: 5100, min: 5000, max: 6000 },
    { number: 6800, min: 6000, max: 7000 },
    { number: 7400, min: 7000, max: 8000 },
    { number: 8900, min: 8000, max: 9000 },
    { number: 9200, min: 9000, max: 10000 },
    { number: 2600, min: 2000, max: 3000 }
  ];

  const getCurrentLine = () => {
    if (showExercises) {
      return { min: exercises[currentExercise].min, max: exercises[currentExercise].max, step: 100 };
    }
    return numberLines.find(line => selectedNumber >= line.min && selectedNumber <= line.max) || numberLines[0];
  };

  const calculatePosition = (number: number) => {
    const line = getCurrentLine();
    const percentage = ((number - line.min) / (line.max - line.min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleNumberLineClick = (event: React.MouseEvent) => {
    if (!numberLineRef.current) return;
    
    const rect = numberLineRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    const line = getCurrentLine();
    const estimatedNumber = line.min + (percentage / 100) * (line.max - line.min);
    
    setUserPosition(Math.round(estimatedNumber));
  };

  const checkAnswer = () => {
    if (userPosition === null) return;
    
    const targetNumber = showExercises ? exercises[currentExercise].number : selectedNumber;
    const tolerance = 50; // Tolérance de 50 unités
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

  const renderNumberLine = () => {
    const line = getCurrentLine();
    const marks = [];
    
    for (let i = line.min; i <= line.max; i += line.step) {
      marks.push(i);
    }

    const targetNumber = showExercises ? exercises[currentExercise].number : selectedNumber;
    const targetPosition = calculatePosition(targetNumber);
    const userPositionPercent = userPosition ? calculatePosition(userPosition) : null;

    return (
      <div className="w-full">
        <div 
          ref={numberLineRef}
          className="relative h-16 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg cursor-pointer border-2 border-orange-300"
          onClick={handleNumberLineClick}
        >
          {/* Graduations */}
          {marks.map((mark, index) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 flex flex-col justify-between"
              style={{ left: `${(index / (marks.length - 1)) * 100}%` }}
            >
              <div className="w-0.5 h-4 bg-orange-600"></div>
              <div className="w-0.5 h-4 bg-orange-600"></div>
            </div>
          ))}

          {/* Position correcte (seulement pour le cours) */}
          {!showExercises && (
            <div
              className="absolute top-0 bottom-0 flex items-center justify-center"
              style={{ left: `${targetPosition}%` }}
            >
              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
              </div>
            </div>
          )}

          {/* Position de l'utilisateur */}
          {userPositionPercent !== null && (
            <div
              className="absolute top-0 bottom-0 flex items-center justify-center"
              style={{ left: `${userPositionPercent}%` }}
            >
              <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                showExercises ? 'bg-blue-500' : 'bg-purple-500'
              }`}>
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
              </div>
            </div>
          )}
        </div>

        {/* Étiquettes des graduations */}
        <div className="flex justify-between mt-2">
          {marks.map((mark) => (
            <div key={mark} className="text-sm font-bold text-orange-800">
              {mark.toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
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
                📐 Qu'est-ce qu'une droite numérique ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">📏</div>
                  <h3 className="font-bold text-orange-800 mb-2">Une ligne droite</h3>
                  <p className="text-orange-700">Comme une règle géante !</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold text-red-800 mb-2">Des graduations</h3>
                  <p className="text-red-700">Des petits traits pour marquer les nombres</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-bold text-yellow-800 mb-2">Des positions</h3>
                  <p className="text-yellow-700">Chaque nombre a sa place !</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à placer
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                {[500, 1200, 1800, 2300, 2700, 3400, 3900, 4500, 5200, 5800, 6300, 6900, 7400, 8100, 8700, 9200, 9600].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedNumber(num)}
                    className={`p-3 rounded-lg font-bold text-lg transition-all ${
                      selectedNumber === num
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Droite numérique interactive */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔍 Plaçons le nombre {selectedNumber.toLocaleString()}
              </h3>
              
              <div className="mb-6">
                {renderNumberLine()}
              </div>

              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  Clique sur la droite pour placer ton point !
                </p>
                {userPosition && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-lg font-bold text-purple-800">
                      Tu as placé le point à : {userPosition.toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-600">
                      Position correcte : {selectedNumber.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Comment bien placer un nombre</h3>
              <ul className="space-y-2">
                <li>• Regarde entre quels nombres il se trouve</li>
                <li>• S'il est plus proche du début ou de la fin</li>
                <li>• Utilise les graduations pour t'aider</li>
                <li>• Plus le nombre est grand, plus il va vers la droite</li>
                <li>• Plus le nombre est petit, plus il va vers la gauche</li>
              </ul>
            </div>

            {/* Exemples de droites */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                📋 Différentes droites à explorer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {numberLines.slice(0, 6).map((line, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-center mb-3 text-gray-800">
                      {line.label}
                    </h4>
                    <div className="relative h-8 bg-gradient-to-r from-orange-200 to-red-200 rounded">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-600"></div>
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-orange-600"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{line.min}</span>
                      <span>{line.max}</span>
                    </div>
                  </div>
                ))}
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
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                🎯 Place ce nombre sur la droite
              </h3>
              
              <div className="text-6xl font-bold text-orange-600 mb-8">
                {exercises[currentExercise].number.toLocaleString()}
              </div>
              
              <div className="mb-8">
                {renderNumberLine()}
              </div>

              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  🖱️ Clique sur la droite pour placer le nombre !
                </p>
                {userPosition && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-lg font-bold text-blue-800">
                      Position choisie : {userPosition.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              
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
                  Effacer
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
                        <span className="font-bold">Excellent ! Tu as bien placé le nombre !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Pas tout à fait... Le nombre {exercises[currentExercise].number.toLocaleString()} se place à {calculatePosition(exercises[currentExercise].number).toFixed(0)}% sur la droite.
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
                <h3 className="text-2xl font-bold mb-2">Bravo champion !</h3>
                <p className="text-lg">
                  Tu sais maintenant placer parfaitement les nombres jusqu'à 10 000 sur une droite !
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