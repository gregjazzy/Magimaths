'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

// Questions du QCM avec les images correspondantes
const questions = [
  {
    id: 1,
    image: '/images/positions/audessus.png',
    question: "Où se trouve l'objet ?",
    options: ['Au-dessus', 'En-dessous', 'À côté', 'Entre'],
    correct: 'Au-dessus'
  },
  {
    id: 2,
    image: '/images/positions/acoté.png',
    question: "Où se trouve l'objet ?",
    options: ['Devant', 'Derrière', 'À côté', 'Entre'],
    correct: 'À côté'
  },
  {
    id: 3,
    image: '/images/positions/derriere.png',
    question: "Où se trouve l'objet ?",
    options: ['Devant', 'Derrière', 'Sur', 'Sous'],
    correct: 'Derrière'
  },
  {
    id: 4,
    image: '/images/positions/dessous.png',
    question: "Où se trouve l'objet ?",
    options: ['Dessus', 'Dessous', 'Entre', 'À côté'],
    correct: 'Dessous'
  },
  {
    id: 5,
    image: '/images/positions/dessusaudessus.png',
    question: "Où se trouve l'objet ?",
    options: ['Dessus', 'Au-dessus', 'Sur', 'En-dessous'],
    correct: 'Au-dessus'
  },
  {
    id: 6,
    image: '/images/positions/en dessous.png',
    question: "Où se trouve l'objet ?",
    options: ['Dessous', 'En-dessous', 'Sous', 'Au-dessus'],
    correct: 'En-dessous'
  },
  {
    id: 7,
    image: '/images/positions/entre.png',
    question: "Où se trouve l'objet ?",
    options: ['À côté', 'Devant', 'Entre', 'Derrière'],
    correct: 'Entre'
  },
  {
    id: 8,
    image: '/images/positions/loinloin.png',
    question: "Où se trouve l'objet ?",
    options: ['Près', 'Loin', 'À côté', 'Entre'],
    correct: 'Loin'
  },
  {
    id: 9,
    image: '/images/positions/sous.png',
    question: "Où se trouve l'objet ?",
    options: ['Sur', 'Sous', 'Au-dessus', 'En-dessous'],
    correct: 'Sous'
  },
  {
    id: 10,
    image: '/images/positions/sur.png',
    question: "Où se trouve l'objet ?",
    options: ['Sur', 'Sous', 'Au-dessus', 'En-dessous'],
    correct: 'Sur'
  }
];

export default function PositionsQCM() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Empêcher de répondre plusieurs fois

    const correct = answer === questions[currentQuestion].correct;
    setIsCorrect(correct);
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }

    // Passer à la question suivante après un délai
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const getButtonClass = (option: string) => {
    if (selectedAnswer === null) {
      return 'bg-white hover:bg-blue-50 hover:border-blue-500';
    }
    if (option === questions[currentQuestion].correct) {
      return 'bg-green-100 border-green-500';
    }
    if (option === selectedAnswer) {
      return 'bg-red-100 border-red-500';
    }
    return 'bg-white opacity-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/chapitre/cp-geometrie-espace/reperage-espace"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au cours</span>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Trouve le bon mot de position 🔍
            </h1>
            <p className="text-lg text-gray-600">
              Question {currentQuestion + 1} sur {questions.length}
            </p>
            <div className="mt-2 text-xl font-bold text-purple-600">
              Score : {score} / {questions.length}
            </div>
          </div>
        </div>

        {/* Question courante */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {questions[currentQuestion].question}
            </h2>
            <div className="relative w-full h-64 mb-6">
              <Image
                src={questions[currentQuestion].image}
                alt="Position à identifier"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* Options de réponse */}
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`p-4 text-lg font-bold rounded-xl border-2 transition-all text-gray-700 ${getButtonClass(
                  option
                )}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`text-center p-4 rounded-xl ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <p className="text-xl font-bold">
              {isCorrect ? '👏 Bravo !' : '😕 Pas tout à fait...'}
            </p>
            <p>
              {isCorrect
                ? 'Tu as trouvé le bon mot !'
                : `La bonne réponse était : ${questions[currentQuestion].correct}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
