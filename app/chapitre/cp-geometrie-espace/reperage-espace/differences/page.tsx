'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function DifferencesExercice() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const questions = [
    {
      id: 1,
      image: '/images/sousur/sur 1.png',
      question: "Où est le chat ?",
      options: ['sur le lit', 'au-dessus du lit', 'à côté du lit', 'sous le lit'],
      correct: 'sur le lit',
      explanation: "Le chat est 'sur' le lit car il touche directement le lit. S'il y avait de l'espace entre le chat et le lit, on dirait qu'il est 'au-dessus'."
    },
    {
      id: 2,
      image: '/images/sousur/sous4.png',
      question: "Où est le chat ?",
      options: ['sous la couverture', 'en-dessous de la couverture', 'derrière la couverture', 'dans la couverture'],
      correct: 'sous la couverture',
      explanation: "Le chat est 'sous' la couverture car il est en contact direct avec elle. S'il y avait de l'espace entre le chat et la couverture, on dirait qu'il est 'en-dessous'."
    },
    {
      id: 3,
      image: '/images/sousur/au dessus 1.png',
      question: "Où est le cerf-volant ?",
      options: ['sur la personne', 'au-dessus de la personne', 'devant la personne', 'à côté de la personne'],
      correct: 'au-dessus de la personne',
      explanation: "Le cerf-volant est 'au-dessus' de la personne car il y a de l'espace entre les deux. S'il touchait la personne, on dirait qu'il est 'sur'."
    },
    {
      id: 4,
      image: '/images/sousur/en dessous 1.png',
      question: "Où est le chat ?",
      options: ['sous la chaise', 'en-dessous de la chaise', 'derrière la chaise', 'devant la chaise'],
      correct: 'en-dessous de la chaise',
      explanation: "Le chat est 'en-dessous' de la chaise car il y a de l'espace entre le chat et la chaise. S'il touchait la chaise, on dirait qu'il est 'sous'."
    },
    {
      id: 5,
      image: '/images/sousur/au dessus 3.png',
      question: "Où est la lampe ?",
      options: ['sur la table', 'au-dessus de la table', 'à côté de la table', 'devant la table'],
      correct: 'au-dessus de la table',
      explanation: "La lampe est 'au-dessus' de la table car elle ne touche pas la table, il y a de l'espace entre les deux."
    },
    {
      id: 6,
      image: '/images/sousur/sur 3.png',
      question: "Où est le livre ?",
      options: ['sur la table', 'au-dessus de la table', 'sous la table', 'à côté de la table'],
      correct: 'sur la table',
      explanation: "Le livre est 'sur' la table car il touche directement la table. Il n'y a pas d'espace entre les deux."
    },
    {
      id: 7,
      image: '/images/sousur/en dessous 2.png',
      question: "Où est le chat ?",
      options: ['sous le meuble', 'en-dessous du meuble', 'derrière le meuble', 'devant le meuble'],
      correct: 'en-dessous du meuble',
      explanation: "Le chat est 'en-dessous' du meuble car il y a de l'espace entre le chat et le meuble."
    },
    {
      id: 8,
      image: '/images/sousur/sur2.png',
      question: "Où est le vase ?",
      options: ["sur l'étagère", "au-dessus de l'étagère", "à côté de l'étagère", "devant l'étagère"],
      correct: "sur l'étagère",
      explanation: "Le vase est 'sur' l'étagère car il repose directement sur elle, il n'y a pas d'espace entre les deux."
    },
    {
      id: 2,
      image: '/images/sousur/sous4.png',
      question: "Où est le chat ?",
      options: ['sous la couverture', 'en-dessous de la couverture', 'derrière la couverture', 'dans la couverture'],
      correct: 'sous la couverture',
      explanation: "Le chat est 'sous' la couverture car il est en contact direct avec elle. S'il y avait de l'espace entre le chat et la couverture, on dirait qu'il est 'en-dessous'."
    },
    {
      id: 3,
      image: '/images/sousur/au dessus 1.png',
      question: "Où est le cerf-volant ?",
      options: ['sur la personne', 'au-dessus de la personne', 'devant la personne', 'à côté de la personne'],
      correct: 'au-dessus de la personne',
      explanation: "Le cerf-volant est 'au-dessus' de la personne car il y a de l'espace entre les deux. S'il touchait la personne, on dirait qu'il est 'sur'."
    },
    {
      id: 4,
      image: '/images/sousur/en dessous 1.png',
      question: "Où est le chat ?",
      options: ['sous la chaise', 'en-dessous de la chaise', 'derrière la chaise', 'devant la chaise'],
      correct: 'en-dessous de la chaise',
      explanation: "Le chat est 'en-dessous' de la chaise car il y a de l'espace entre le chat et la chaise. S'il touchait la chaise, on dirait qu'il est 'sous'."
    }
  ];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartExercise = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bravo ! Tu as terminé l'exercice ! 🎉
            </h2>
            <p className="text-lg text-gray-800 mb-6">
              Tu as trouvé {score} réponse{score > 1 ? 's' : ''} juste{score > 1 ? 's' : ''} sur {questions.length}
            </p>
            <div className="space-y-4">
              <button
                onClick={restartExercise}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Recommencer
              </button>
              <Link
                href="/chapitre/cp-geometrie-espace/reperage-espace"
                className="block text-blue-600 hover:underline"
              >
                Retour au cours
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Question {currentQuestion + 1} sur {questions.length}
            </h1>
            <div className="text-lg font-medium text-gray-600">
              Score : {score}
            </div>
          </div>
          
          <div className="mb-8">
            <img
              src={currentQ.image}
              alt="Question"
              className="w-[250px] h-[250px] object-contain mx-auto mb-6"
            />
            <p className="text-xl text-gray-800 text-center font-medium">
              {currentQ.question}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {currentQ.options.map((option) => (
              <button
                key={option}
                onClick={() => !showExplanation && handleAnswer(option)}
                disabled={showExplanation}
                className={`p-3 rounded-lg text-base font-medium transition-colors ${
                  showExplanation
                    ? option === currentQ.correct
                      ? 'bg-green-100 text-green-800 border-2 border-green-500'
                      : option === selectedAnswer
                      ? 'bg-red-100 text-red-800 border-2 border-red-500'
                      : 'bg-gray-50 text-gray-500'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">
                  {currentQ.explanation}
                </p>
              </div>
              <button
                onClick={nextQuestion}
                className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Question suivante' : 'Voir le résultat'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}