'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy, Lightbulb } from 'lucide-react';

interface QuizSectionProps {
  onSectionComplete: (sectionName: string, xp: number) => void;
}

export default function QuizSection({ onSectionComplete }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const questions = [
    {
      equation: "3x² + 2x - 1 = 0",
      isSecondDegree: true,
      explanation: "Forme ax² + bx + c avec a≠0",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "On a bien la forme ax² + bx + c = 0 avec :\n• a = 3 (≠ 0) ✓\n• b = 2\n• c = -1\nComme a ≠ 0, c'est bien une équation du second degré."
      }
    },
    {
      equation: "5x - 3 = 0",
      isSecondDegree: false,
      explanation: "Pas de terme en x², c'est du 1er degré",
      detailedCorrection: {
        why: "Cette équation N'EST PAS du second degré",
        details: "Il n'y a pas de terme en x² !\n• Terme en x² : absent (a = 0)\n• Terme en x : 5x (b = 5)\n• Terme constant : -3 (c = -3)\nSans terme en x², c'est une équation du 1er degré."
      }
    },
    {
      equation: "x² = 16",
      isSecondDegree: true,
      explanation: "Même si b=0 et c=-16, on a bien x² donc 2nd degré",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "On peut la réécrire sous forme standard :\n• x² = 16\n• x² - 16 = 0\n• a = 1 (≠ 0) ✓\n• b = 0 (le terme en x peut être absent)\n• c = -16\nMême si b = 0, on a bien x² donc c'est du second degré."
      }
    },
    {
      equation: "2x³ + x² - 1 = 0",
      isSecondDegree: false,
      explanation: "Degré 3 à cause du x³",
      detailedCorrection: {
        why: "Cette équation N'EST PAS du second degré",
        details: "Le terme de plus haut degré est x³ !\n• Terme en x³ : 2x³ (degré 3)\n• Terme en x² : x²\n• Terme constant : -1\nLe degré d'une équation = degré du terme le plus élevé. Ici c'est 3, pas 2."
      }
    },
    {
      equation: "-x² + 7 = 0",
      isSecondDegree: true,
      explanation: "a=-1, b=0, c=7, c'est bien du 2nd degré",
      detailedCorrection: {
        why: "Cette équation EST du second degré",
        details: "Forme ax² + bx + c = 0 avec :\n• a = -1 (≠ 0) ✓\n• b = 0 (pas de terme en x)\n• c = 7\nMême si a est négatif, tant que a ≠ 0, c'est du second degré."
      }
    }
  ];

  const handleAnswer = (answer: boolean) => {
    if (hasAnswered) return;

    const correct = answer === questions[currentQuestion].isSecondDegree;
    setAnswers(prev => [...prev, correct]);
    setHasAnswered(true);
    setIsCorrect(correct);

    if (!correct) {
      setShowCorrection(true);
    } else {
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setHasAnswered(false);
      setShowCorrection(false);
    } else {
      setShowResult(true);
      onSectionComplete('quiz', 35);
    }
  };

  const handleCorrectionValidated = () => {
    setShowCorrection(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 300);
  };

  const correctAnswers = answers.filter(Boolean).length;
  const totalQuestions = questions.length;

  if (showResult) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center">
          <div className="mb-4">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quiz terminé !</h3>
            <p className="text-gray-600">
              Vous avez obtenu {correctAnswers}/{totalQuestions} bonnes réponses
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Résumé :</h4>
            <div className="space-y-2">
              {questions.map((q, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-gray-600">{q.equation}</span>
                  <div className="flex items-center space-x-2">
                    {answers[index] ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={answers[index] ? 'text-green-600' : 'text-red-600'}>
                      {q.isSecondDegree ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              {correctAnswers === totalQuestions 
                ? "Parfait ! Vous maîtrisez l'identification des équations du second degré."
                : correctAnswers >= totalQuestions * 0.8
                ? "Très bien ! Vous avez une bonne compréhension du concept."
                : "Continuez à vous entraîner pour améliorer votre compréhension."
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm text-gray-500">Question {currentQuestion + 1} sur {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Cette équation est-elle du second degré ?
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-xl font-mono text-gray-800">{currentQ.equation}</p>
        </div>
      </div>

      {!hasAnswered && (
        <div className="flex space-x-4 justify-center mb-6">
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Oui</span>
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <XCircle className="h-5 w-5" />
            <span>Non</span>
          </button>
        </div>
      )}

      {hasAnswered && !showCorrection && (
        <div className="text-center">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>{isCorrect ? 'Correct !' : 'Incorrect'}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentQ.explanation}</p>
        </div>
      )}

      {showCorrection && (
        <div className="bg-orange-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <Lightbulb className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">
                {currentQ.detailedCorrection.why}
              </h4>
              <div className="text-sm text-orange-700 whitespace-pre-line">
                {currentQ.detailedCorrection.details}
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={handleCorrectionValidated}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 