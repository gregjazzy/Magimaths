import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FractionMath } from '../page';
import { CheckCircle, XCircle } from 'lucide-react';

interface Exercise {
  fraction1: string;
  fraction2: string;
  correctAnswer: '<' | '>' | '=';
  explanation: string;
}

const exercises: Exercise[] = [
  {
    fraction1: '3/8',
    fraction2: '5/8',
    correctAnswer: '<',
    explanation: '3 est plus petit que 5, donc 3/8 < 5/8'
  },
  {
    fraction1: '4/6',
    fraction2: '2/6',
    correctAnswer: '>',
    explanation: '4 est plus grand que 2, donc 4/6 > 2/6'
  },
  {
    fraction1: '5/7',
    fraction2: '5/7',
    correctAnswer: '=',
    explanation: 'Les fractions sont identiques, donc 5/7 = 5/7'
  },
  // Ajoutez plus d'exercices ici
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
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Compare les fractions
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