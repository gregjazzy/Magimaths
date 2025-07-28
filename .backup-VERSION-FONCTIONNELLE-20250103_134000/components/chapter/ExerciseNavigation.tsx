'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExerciseNavigationProps {
  currentExercise: number;
  totalExercises: number;
  onPrevious: () => void;
  onNext: () => void;
  exerciseTitle: string;
}

export default function ExerciseNavigation({
  currentExercise,
  totalExercises,
  onPrevious,
  onNext,
  exerciseTitle
}: ExerciseNavigationProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* Bouton précédent */}
        <button
          onClick={onPrevious}
          disabled={currentExercise === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentExercise === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <ChevronLeft size={20} />
          <span>Précédent</span>
        </button>

        {/* Titre et position */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {exerciseTitle}
          </h3>
          <div className="text-sm text-gray-600">
            Exercice {currentExercise + 1} sur {totalExercises}
          </div>
          
          {/* Barre de progression */}
          <div className="mt-3 w-64 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise + 1) / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        {/* Bouton suivant */}
        <button
          onClick={onNext}
          disabled={currentExercise >= totalExercises - 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentExercise >= totalExercises - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          <span>Suivant</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
} 