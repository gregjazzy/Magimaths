'use client';

import React, { useState } from 'react';
import { FractionMath } from '../page';

const exercises = [
  // Fractions simples pour commencer
  { numerator: 1, denominator: 2 },
  { numerator: 1, denominator: 4 },
  { numerator: 3, denominator: 4 },
  
  // Fractions avec dénominateur 3
  { numerator: 1, denominator: 3 },
  { numerator: 2, denominator: 3 },
  { numerator: 4, denominator: 3 },
  
  // Mélanges de dénominateurs
  { numerator: 3, denominator: 6 },
  { numerator: 5, denominator: 4 },
  { numerator: 7, denominator: 3 },
  
  // Fractions plus complexes
  { numerator: 8, denominator: 6 },
  { numerator: 5, denominator: 2 },
  { numerator: 11, denominator: 4 }
];

export default function ExerciceSection() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedDivisions, setSelectedDivisions] = useState<number>(0);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<boolean[]>(new Array(exercises.length).fill(false));
  const [buttonHoldInterval, setButtonHoldInterval] = useState<NodeJS.Timeout | null>(null);

  // Fonction pour déplacer le point
  const movePoint = (direction: 'left' | 'right') => {
    setSelectedPosition(prev => {
      if (prev === null) return 0;
      return direction === 'left' 
        ? Math.max(0, prev - 1)
        : Math.min(100, prev + 1);
    });
  };

  // Gestionnaires pour le maintien des boutons
  const startMoving = (direction: 'left' | 'right') => {
    movePoint(direction);
    const interval = setInterval(() => movePoint(direction), 50); // Répéter toutes les 50ms
    setButtonHoldInterval(interval);
  };

  const stopMoving = () => {
    if (buttonHoldInterval) {
      clearInterval(buttonHoldInterval);
      setButtonHoldInterval(null);
    }
  };

  const checkAnswer = () => {
    if (selectedPosition === null) return;
    
    const exercise = exercises[currentExercise];
    // Calculer la position attendue en fonction de la fraction
    const expectedPosition = (exercise.numerator / exercise.denominator) * 50; // Position en pourcentage de la largeur totale
    const tolerance = 3; // 3% de marge d'erreur
    
    const isPositionCorrect = Math.abs(selectedPosition - expectedPosition) <= tolerance;
    setIsCorrect(isPositionCorrect);

    if (isPositionCorrect) {
      const newCompleted = [...completedExercises];
      newCompleted[currentExercise] = true;
      setCompletedExercises(newCompleted);
      
      // Passer automatiquement à l'exercice suivant après 1.5 secondes
      setTimeout(() => {
        if (currentExercise < exercises.length - 1) {
          nextExercise();
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setSelectedDivisions(0);
      setSelectedPosition(null);
      setIsCorrect(null);
    }
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl">✏️</span>
          <h2 className="text-base sm:text-xl font-bold text-gray-800">Exercice {currentExercise + 1}/{exercises.length}</h2>
        </div>
        <div className="text-base sm:text-xl font-bold text-green-600">
          Score : {completedExercises.filter(Boolean).length}/{exercises.length}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300 rounded-full"
          style={{ 
            width: `${(completedExercises.filter(Boolean).length / exercises.length) * 100}%`
          }}
        />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-2 sm:mb-6">
        Place <FractionMath a={exercises[currentExercise].numerator.toString()} b={exercises[currentExercise].denominator.toString()} /> sur la droite graduée
      </h3>



      <div className="flex flex-col gap-2 mb-2 sm:mb-4">
        {/* Instructions et contrôle des graduations */}
        <div className="bg-blue-50 rounded-lg p-2">
          <div className="flex flex-col items-center gap-2">
            <p className="text-blue-800 font-bold text-center text-sm">Place le point rouge au bon emplacement sur la règle</p>
            
            <div className="flex items-center gap-2 bg-white/50 rounded-full px-3 py-1">
              <span className="text-blue-800 text-sm">Graduations :</span>
              <div className="flex items-center">
                <button
                  className="w-6 h-6 bg-blue-100 rounded-l-lg border border-blue-200 flex items-center justify-center active:bg-blue-200"
                  onClick={() => {
                    const newValue = Math.max(2, (selectedDivisions || 2) - 1);
                    setSelectedDivisions(newValue);
                  }}
                >
                  <span className="text-blue-800 text-sm">-</span>
                </button>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={selectedDivisions || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 2 && value <= 12) {
                      setSelectedDivisions(value);
                    }
                  }}
                  className="w-10 px-0 py-1 text-center text-sm border-y border-blue-200 focus:border-blue-500 focus:outline-none bg-white"
                  placeholder="?"
                />
                <button
                  className="w-6 h-6 bg-blue-100 rounded-r-lg border border-blue-200 flex items-center justify-center active:bg-blue-200"
                  onClick={() => {
                    const newValue = Math.min(12, (selectedDivisions || 2) + 1);
                    setSelectedDivisions(newValue);
                  }}
                >
                  <span className="text-blue-800 text-sm">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-32">
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300">
          <div className="absolute inset-0 bg-gray-800"></div>
        </div>

        {/* Graduations principales (0, 1, 2) */}
        {[0, 1, 2].map(num => (
          <div
            key={num}
            className="absolute bottom-0 h-8 w-1 bg-gray-800"
            style={{ left: `${num * 50}%` }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-800">
              {num}
            </div>
          </div>
        ))}

        {/* Divisions */}
        {selectedDivisions > 0 && Array.from({ length: selectedDivisions * 2 + 1 }).map((_, i) => (
          <div
            key={`division-${i}`}
            className="absolute bottom-0 h-6 w-0.5 bg-purple-500"
            style={{ left: `${(i * 50) / selectedDivisions}%` }}
          />
        ))}

        {/* Zone cliquable et draggable */}
        <div 
          className="absolute inset-0"
          onClick={(e) => {
            if (!isDragging) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              // Ajuster pour que le centre du point soit sous le curseur
              const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
              setSelectedPosition(position);
            }
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              // Calculer la position en fonction des graduations
              const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
              setSelectedPosition(position);
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          style={{ cursor: isDragging ? 'grabbing' : 'crosshair' }}
        />

        {/* Point */}
        <div
          className="absolute bottom-1 w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg cursor-grab active:cursor-grabbing"
          style={{ 
            left: selectedPosition === null ? '0%' : `${selectedPosition}%`,
            transform: 'translateX(-50%)'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const pointCenterX = rect.left + rect.width / 2;
            setDragOffset(e.clientX - pointCenterX);
            setIsDragging(true);
          }}
        />
      </div>

      {/* Message d'aide avec boutons */}
      <div className="relative h-12 mt-2 mb-2">
        <p className="text-purple-700 text-xs sm:text-base font-medium bg-purple-50 rounded-full px-2 sm:px-6 py-1 sm:py-2 text-center shadow-sm border border-purple-100 mb-2">
          Cliquer sur - et + pour placer le point
        </p>

        <div className="absolute left-0 right-0 bottom-0 flex justify-between px-4">
          <button
            className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all duration-150 focus:outline-none"
            onMouseDown={(e) => {
              e.stopPropagation();
              startMoving('left');
            }}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={(e) => {
              e.stopPropagation();
              startMoving('left');
            }}
            onTouchEnd={stopMoving}
          >
            <span className="text-white text-xl font-bold">-</span>
          </button>

          <button
            className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all duration-150 focus:outline-none"
            onMouseDown={(e) => {
              e.stopPropagation();
              startMoving('right');
            }}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
            onTouchStart={(e) => {
              e.stopPropagation();
              startMoving('right');
            }}
            onTouchEnd={stopMoving}
          >
            <span className="text-white text-xl font-bold">+</span>
          </button>
        </div>
      </div>

      {/* Bouton Valider */}
      {selectedPosition !== null && (
        <div className="text-center mt-4">
          <button
            onClick={checkAnswer}
            className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            Valider
          </button>
        </div>
      )}

      {/* Message de résultat et correction */}
      {isCorrect !== null && (
        <div className={`mt-4 p-4 rounded-lg text-center ${
          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100'
        }`}>
          {isCorrect ? (
            <div className="flex flex-col items-center gap-4">
              <p className="font-bold">Bravo ! C'est la bonne réponse !</p>
              {currentExercise === exercises.length - 1 && completedExercises[currentExercise] && (
                <div className="text-2xl text-green-600 font-bold">
                  🎉 Félicitations ! Tu as terminé tous les exercices ! 🎉
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="font-bold text-red-700">Ce n'est pas la bonne position.</p>
              <div className="bg-white/50 p-4 rounded-lg">
                <p className="text-gray-700 mb-4">La fraction {exercises[currentExercise].numerator}/{exercises[currentExercise].denominator} signifie :</p>
                
                {/* Droite graduée de correction */}
                <div className="relative h-28 sm:h-32 mb-4">
                  {/* Ligne principale */}
                  <div className="absolute bottom-8 left-0 right-0 h-2 bg-gray-300">
                    <div className="absolute inset-0 bg-gray-800"></div>
                  </div>

                  {/* Graduations principales */}
                  {[0, 1, 2].map(num => (
                    <div
                      key={num}
                      className="absolute bottom-8 h-6 w-1 bg-gray-800"
                      style={{ left: `${num * 50}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-lg font-bold text-gray-800">
                        {num}
                      </div>
                    </div>
                  ))}

                  {/* Divisions pour la correction */}
                  {Array.from({ length: exercises[currentExercise].denominator * 2 + 1 }).map((_, i) => (
                    <div
                      key={`division-${i}`}
                      className="absolute bottom-8 h-4 w-0.5 bg-purple-500"
                      style={{ left: `${(i * 50) / exercises[currentExercise].denominator}%` }}
                    />
                  ))}

                  {/* Point de la position correcte */}
                  <div
                    className="absolute bottom-4 sm:bottom-9 w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-green-500 border-[3px] border-white shadow-xl transform -translate-x-1/2 animate-bounce"
                    style={{ 
                      left: `${(exercises[currentExercise].numerator * 50) / exercises[currentExercise].denominator}%`,
                      zIndex: 20,
                      filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.3))'
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-100 px-2 py-1 rounded-full text-[10px] font-bold text-green-700 whitespace-nowrap border border-green-200">
                      Position correcte
                    </div>
                  </div>

                  {/* Point de la position de l'utilisateur */}
                  <div
                    className="absolute bottom-4 sm:bottom-9 w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-red-500 border-[3px] border-white shadow-xl transform -translate-x-1/2 opacity-70"
                    style={{ 
                      left: `${selectedPosition}%`,
                      zIndex: 10,
                      filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.3))'
                    }}
                  >
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-red-100 px-2 py-1 rounded-full text-[10px] font-bold text-red-700 whitespace-nowrap border border-red-200">
                      Ta réponse
                    </div>
                  </div>
                </div>

                <ul className="text-gray-600 text-sm space-y-2">
                  <li>1. On divise l'unité en {exercises[currentExercise].denominator} parts égales</li>
                  <li>2. On compte {exercises[currentExercise].numerator} parts depuis 0</li>
                </ul>
              </div>
              <button
                onClick={nextExercise}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors self-center"
              >
                Exercice suivant →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}