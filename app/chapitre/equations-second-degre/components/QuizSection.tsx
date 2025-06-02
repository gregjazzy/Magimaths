'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';

interface QuizSectionProps {
  onSectionComplete: (sectionName: string, xp: number) => void;
  completedSections: string[];
}

export default function QuizSection({ onSectionComplete, completedSections }: QuizSectionProps) {
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  // Données du quiz avec corrections détaillées
  const quizQuestions = [
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

  const handleQuizAnswer = (answer: boolean) => {
    if (currentQuestionAnswered) return;
    
    const correct = answer === quizQuestions[currentQuizQuestion].isSecondDegree;
    setQuizAnswers(prev => [...prev, correct]);
    setCurrentQuestionAnswered(true);
    setLastAnswerCorrect(correct);
    
    if (!correct) {
      setShowCorrection(true);
    } else {
      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
      setCurrentQuestionAnswered(false);
      setShowCorrection(false);
    } else {
      setShowQuizResults(true);
      onSectionComplete('quiz', 35);
    }
  };

  const handleCorrectionValidated = () => {
    setShowCorrection(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 300);
  };

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
          <Trophy className="h-5 w-5 text-orange-600" />
          <span className="font-semibold text-orange-800">Quiz</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Test tes connaissances ! 🧠
        </h2>
        <p className="text-gray-600">Identifie si ces équations sont du second degré</p>
      </div>

      {!showQuizResults ? (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Question {currentQuizQuestion + 1} sur {quizQuestions.length}
              </span>
              <div className="flex space-x-1">
                {quizQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuizQuestion
                        ? 'bg-blue-500'
                        : index < currentQuizQuestion
                        ? quizAnswers[index]
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 text-center">
              <h3 className="text-2xl font-mono font-bold text-gray-900 mb-4">
                {quizQuestions[currentQuizQuestion].equation}
              </h3>
              <p className="text-gray-600 mb-6">
                Cette équation est-elle du <strong>second degré</strong> ?
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleQuizAnswer(true)}
                  disabled={currentQuestionAnswered}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentQuestionAnswered
                      ? lastAnswerCorrect && quizQuestions[currentQuizQuestion].isSecondDegree
                        ? 'bg-green-500 text-white'
                        : !lastAnswerCorrect && quizQuestions[currentQuizQuestion].isSecondDegree
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  ✓ Oui
                </button>
                <button
                  onClick={() => handleQuizAnswer(false)}
                  disabled={currentQuestionAnswered}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentQuestionAnswered
                      ? lastAnswerCorrect && !quizQuestions[currentQuizQuestion].isSecondDegree
                        ? 'bg-green-500 text-white'
                        : !lastAnswerCorrect && !quizQuestions[currentQuizQuestion].isSecondDegree
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  ✗ Non
                </button>
              </div>
            </div>

            {showCorrection && (
              <div className="mt-6 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3">
                  {quizQuestions[currentQuizQuestion].detailedCorrection.why}
                </h4>
                <div className="text-blue-700 whitespace-pre-line mb-4">
                  {quizQuestions[currentQuizQuestion].detailedCorrection.details}
                </div>
                <button
                  onClick={handleCorrectionValidated}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  J'ai compris, continuer
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz terminé !</h3>
          <div className="text-lg text-gray-600 mb-6">
            Score : {quizAnswers.filter(Boolean).length}/{quizQuestions.length}
          </div>
          <button
            onClick={() => onSectionComplete('quiz', 35)}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold"
          >
            Terminer le quiz (+35 XP)
          </button>
        </div>
      )}
    </section>
  );
} 