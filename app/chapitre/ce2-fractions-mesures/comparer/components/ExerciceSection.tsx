import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FractionMath } from './FractionMath';
import { CheckCircle, XCircle } from 'lucide-react';

interface Exercise {
  fraction1: string;
  fraction2: string;
  correctAnswer: '<' | '>' | '=';
  explanation: string;
}

const exercises: Exercise[] = [
  // Exercices simples pour commencer
  {
    fraction1: '2/6',
    fraction2: '4/6',
    correctAnswer: '<',
    explanation: '2 est plus petit que 4, donc 2/6 < 4/6'
  },
  {
    fraction1: '5/8',
    fraction2: '3/8',
    correctAnswer: '>',
    explanation: '5 est plus grand que 3, donc 5/8 > 3/8'
  },
  {
    fraction1: '4/7',
    fraction2: '4/7',
    correctAnswer: '=',
    explanation: 'Les fractions sont identiques, donc 4/7 = 4/7'
  },
  // Exercices avec des fractions plus grandes
  {
    fraction1: '7/9',
    fraction2: '5/9',
    correctAnswer: '>',
    explanation: '7 est plus grand que 5, donc 7/9 > 5/9'
  },
  {
    fraction1: '3/10',
    fraction2: '7/10',
    correctAnswer: '<',
    explanation: '3 est plus petit que 7, donc 3/10 < 7/10'
  },
  {
    fraction1: '6/8',
    fraction2: '6/8',
    correctAnswer: '=',
    explanation: 'Les fractions sont identiques, donc 6/8 = 6/8'
  },
  // Exercices plus complexes
  {
    fraction1: '8/12',
    fraction2: '4/12',
    correctAnswer: '>',
    explanation: '8 est plus grand que 4, donc 8/12 > 4/12'
  },
  {
    fraction1: '5/15',
    fraction2: '9/15',
    correctAnswer: '<',
    explanation: '5 est plus petit que 9, donc 5/15 < 9/15'
  },
  {
    fraction1: '11/20',
    fraction2: '7/20',
    correctAnswer: '>',
    explanation: '11 est plus grand que 7, donc 11/20 > 7/20'
  },
  // Derniers exercices
  {
    fraction1: '13/16',
    fraction2: '13/16',
    correctAnswer: '=',
    explanation: 'Les fractions sont identiques, donc 13/16 = 13/16'
  },
  {
    fraction1: '9/24',
    fraction2: '15/24',
    correctAnswer: '<',
    explanation: '9 est plus petit que 15, donc 9/24 < 15/24'
  },
  {
    fraction1: '17/18',
    fraction2: '13/18',
    correctAnswer: '>',
    explanation: '17 est plus grand que 13, donc 17/18 > 13/18'
  }
];

export default function ExerciceSection() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'<' | '>' | '=' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const checkAnswer = (answer: '<' | '>' | '=') => {
    const correct = answer === exercises[currentExercise].correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Compare les fractions
            </h2>
            <div className="text-base sm:text-lg font-bold text-green-600">
              Score : {score}/{exercises.length}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Exercice {currentExercise + 1} sur {exercises.length}
            </p>
            <div className="w-full sm:w-2/3">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full transition-all"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4 mb-8">
          <FractionMath a={exercises[currentExercise].fraction1.split('/')[0]} b={exercises[currentExercise].fraction1.split('/')[1]} />
          <div className="space-x-2">
            {['<', '=', '>'].map((symbol) => (
              <button
                key={symbol}
                onClick={() => checkAnswer(symbol as '<' | '>' | '=')}
                disabled={selectedAnswer !== null}
                className={`px-4 py-2 rounded-lg font-bold transition-colors
                  ${selectedAnswer === symbol
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }
                `}
              >
                {symbol}
              </button>
            ))}
          </div>
          <FractionMath a={exercises[currentExercise].fraction2.split('/')[0]} b={exercises[currentExercise].fraction2.split('/')[1]} />
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

        {selectedAnswer !== null && currentExercise < exercises.length - 1 && (
          <div className="text-center">
            <button
              onClick={nextExercise}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}

        {currentExercise === exercises.length - 1 && selectedAnswer !== null && (
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