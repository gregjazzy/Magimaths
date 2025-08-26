import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FractionMath } from '../page';
import { CheckCircle, XCircle } from 'lucide-react';

interface Exercise {
  fraction: string;
  position: number; // position en pourcentage sur la droite (0-100)
  graduations: number; // nombre de graduations (dénominateur)
  explanation: string;
}

const exercises: Exercise[] = [
  {
    fraction: '1/2',
    position: 50,
    graduations: 2,
    explanation: '1/2 est à la moitié de la droite, entre 0 et 1'
  },
  {
    fraction: '2/4',
    position: 50,
    graduations: 4,
    explanation: '2/4 est à la deuxième graduation sur 4, soit à la moitié'
  },
  {
    fraction: '3/4',
    position: 75,
    graduations: 4,
    explanation: '3/4 est à la troisième graduation sur 4, soit aux trois quarts'
  },
  {
    fraction: '1/3',
    position: 33,
    graduations: 3,
    explanation: '1/3 est à la première graduation sur 3'
  },
  {
    fraction: '2/3',
    position: 67,
    graduations: 3,
    explanation: '2/3 est à la deuxième graduation sur 3'
  }
];

export default function ExerciceSection() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const checkAnswer = (position: number) => {
    const tolerance = 5; // Marge d'erreur en pourcentage
    const correct = Math.abs(position - exercises[currentExercise].position) <= tolerance;
    setSelectedPosition(position);
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedPosition(null);
      setIsCorrect(null);
    }
  };

  const renderGraduations = () => {
    const graduations = [];
    const numGraduations = exercises[currentExercise].graduations;
    
    for (let i = 0; i <= numGraduations; i++) {
      const position = (i / numGraduations) * 100;
      graduations.push(
        <div
          key={i}
          className="absolute -top-2 h-6 w-0.5 bg-gray-800"
          style={{ left: `${position}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm">
            {i === 0 ? '0' : i === numGraduations ? '1' : <FractionMath a={i} b={numGraduations} />}
          </div>
        </div>
      );
    }
    return graduations;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Place la fraction sur la droite
          </h2>
          <p className="text-gray-600 mt-2">
            Exercice {currentExercise + 1} sur {exercises.length}
          </p>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all"
                style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Place <FractionMath a={exercises[currentExercise].fraction.split('/')[0]} b={exercises[currentExercise].fraction.split('/')[1]} /> sur la droite graduée
          </h3>
          
          <div className="relative w-full h-24 mb-8">
            <div className="absolute bottom-0 w-full h-2 bg-gray-300 rounded-full">
              {renderGraduations()}
              {selectedPosition !== null && (
                <div
                  className={`absolute -top-4 w-4 h-4 transform -translate-x-1/2 rounded-full ${
                    isCorrect === null ? 'bg-blue-500' :
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ left: `${selectedPosition}%` }}
                ></div>
              )}
            </div>
            {!selectedPosition && (
              <div
                className="absolute bottom-0 w-full h-12 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const position = (x / rect.width) * 100;
                  checkAnswer(position);
                }}
              ></div>
            )}
          </div>
        </div>

        {isCorrect !== null && (
          <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center space-x-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-600">Bravo !</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-red-600">
                    Pas tout à fait. {exercises[currentExercise].explanation}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {selectedPosition !== null && currentExercise < exercises.length - 1 && (
          <div className="text-center">
            <button
              onClick={nextExercise}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}

        {currentExercise === exercises.length - 1 && selectedPosition !== null && (
          <div className="text-center bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              Exercices terminés !
            </h3>
            <p className="text-blue-800">
              Score final : {score}/{exercises.length}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}