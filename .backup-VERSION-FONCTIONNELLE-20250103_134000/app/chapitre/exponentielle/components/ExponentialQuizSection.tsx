'use client';

import { useState } from 'react';
import { Trophy, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface ExponentialQuizSectionProps {
  onSectionComplete: (sectionName: string, xp: number) => void;
  completedSections: string[];
}

export default function ExponentialQuizSection({ onSectionComplete, completedSections }: ExponentialQuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const quizQuestions = [
    { 
      statement: "e^0 = 1", 
      isTrue: true, 
      explanation: "Par définition, tout nombre (≠0) élevé à la puissance 0 égale 1",
      detailedCorrection: {
        why: "Cette affirmation est VRAIE",
        details: "C'est une propriété fondamentale :\n• e^0 = 1 (comme pour toute base ≠ 0)\n• Cette propriété est universelle\n• Elle découle de la définition de l'exponentielle\n• Point de passage obligé par (0,1) pour toute exponentielle"
      }
    },
    { 
      statement: "La fonction exponentielle est toujours positive", 
      isTrue: true, 
      explanation: "e^x > 0 pour tout x réel, l'exponentielle ne prend jamais de valeurs négatives",
      detailedCorrection: {
        why: "Cette affirmation est VRAIE",
        details: "Propriété fondamentale de l'exponentielle :\n• Pour tout x ∈ ℝ, e^x > 0\n• L'axe des abscisses est asymptote horizontale\n• La fonction ne s'annule jamais\n• C'est ce qui la distingue des fonctions polynomiales"
      }
    },
    { 
      statement: "e^(a+b) = e^a × e^b", 
      isTrue: true, 
      explanation: "Propriété fondamentale des exponentielles : la somme des exposants devient produit",
      detailedCorrection: {
        why: "Cette affirmation est VRAIE",
        details: "Propriété algébrique essentielle :\n• e^(a+b) = e^a × e^b\n• Cette règle permet de simplifier les calculs\n• Exemple : e^3 × e^5 = e^(3+5) = e^8\n• Base de toutes les manipulations d'exponentielles"
      }
    },
    { 
      statement: "La dérivée de e^x est e^x", 
      isTrue: true, 
      explanation: "Propriété remarquable : l'exponentielle est sa propre dérivée !",
      detailedCorrection: {
        why: "Cette affirmation est VRAIE",
        details: "Propriété extraordinaire de l'exponentielle :\n• (e^x)' = e^x\n• C'est LA fonction qui est égale à sa dérivée\n• Cela explique sa croissance explosive\n• À tout moment, sa vitesse de croissance = sa valeur"
      }
    },
    { 
      statement: "lim(x→-∞) e^x = 0", 
      isTrue: true, 
      explanation: "Quand x tend vers -∞, e^x se rapproche de 0 sans jamais l'atteindre",
      detailedCorrection: {
        why: "Cette affirmation est VRAIE",
        details: "Comportement asymptotique :\n• Quand x → -∞, e^x → 0\n• L'axe des x est asymptote horizontale\n• Plus x est négatif, plus e^x est proche de 0\n• Mais e^x ne vaut jamais exactement 0"
      }
    }
  ];

  const handleAnswer = (answer: boolean) => {
    if (currentQuestionAnswered) return;
    
    const correct = answer === quizQuestions[currentQuestion].isTrue;
    setAnswers(prev => [...prev, correct]);
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
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentQuestionAnswered(false);
      setShowCorrection(false);
    } else {
      setShowResults(true);
      onSectionComplete('quiz', 35);
    }
  };

  const handleCorrectionValidated = () => {
    setShowCorrection(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 300);
  };

  const currentQ = quizQuestions[currentQuestion];
  const correctAnswers = answers.filter(Boolean).length;

  if (showResults) {
    return (
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
            <Trophy className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Quiz terminé !</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bravo ! 🎉
          </h2>
          
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {correctAnswers}/{quizQuestions.length}
            </div>
            <div className="text-gray-600">
              {correctAnswers === quizQuestions.length 
                ? "Parfait ! Tu maîtrises l'exponentielle !" 
                : correctAnswers >= 3 
                ? "Très bien ! Encore un petit effort !" 
                : "Continue à t'entraîner !"}
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">+35 XP gagnés !</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
          <Trophy className="h-5 w-5 text-purple-600" />
          <span className="font-semibold text-purple-800">Quiz</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Teste tes connaissances ! 🧠
        </h2>
        <div className="flex justify-center space-x-2 mb-4">
          {quizQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < currentQuestion 
                  ? 'bg-green-500' 
                  : index === currentQuestion 
                  ? 'bg-orange-500' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600">Question {currentQuestion + 1} sur {quizQuestions.length}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl mb-6 border-2 border-orange-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            {currentQ.statement}
          </h3>
          
          {!currentQuestionAnswered && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                ✓ VRAI
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                ✗ FAUX
              </button>
            </div>
          )}

          {currentQuestionAnswered && !showCorrection && (
            <div className="text-center">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-white font-bold ${
                lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {lastAnswerCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span>{lastAnswerCorrect ? 'Correct !' : 'Incorrect'}</span>
              </div>
              {lastAnswerCorrect && (
                <p className="text-green-700 mt-3 font-semibold">
                  {currentQ.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        {showCorrection && (
          <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl mb-6">
            <h4 className="font-bold text-red-800 mb-3 text-lg">
              {currentQ.detailedCorrection.why}
            </h4>
            <div className="text-red-700 whitespace-pre-line mb-4">
              {currentQ.detailedCorrection.details}
            </div>
            <button
              onClick={handleCorrectionValidated}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
            >
              J'ai compris
              <ArrowRight className="h-4 w-4 ml-2 inline" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 