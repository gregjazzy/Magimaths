'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

export default function VocabulaireFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const examples = [
    { fraction: '1/2', name: 'moitié', description: 'Une part quand on partage en 2 parts égales', color: 'bg-blue-200' },
    { fraction: '1/3', name: 'tiers', description: 'Une part quand on partage en 3 parts égales', color: 'bg-green-200' },
    { fraction: '1/4', name: 'quart', description: 'Une part quand on partage en 4 parts égales', color: 'bg-yellow-200' },
    { fraction: '1/5', name: 'cinquième', description: 'Une part quand on partage en 5 parts égales', color: 'bg-purple-200' },
    { fraction: '1/6', name: 'sixième', description: 'Une part quand on partage en 6 parts égales', color: 'bg-pink-200' },
    { fraction: '1/8', name: 'huitième', description: 'Une part quand on partage en 8 parts égales', color: 'bg-orange-200' }
  ];

  const exercises = [
    { 
      question: 'Comment dit-on 1/2 en français ?',
      options: ['moitié', 'tiers', 'quart', 'cinquième'],
      correctAnswer: 'moitié',
      hint: 'Quand on partage en 2, chaque part est une...'
    },
    { 
      question: 'Comment dit-on 1/4 en français ?',
      options: ['moitié', 'tiers', 'quart', 'sixième'],
      correctAnswer: 'quart',
      hint: 'Quand on partage en 4, chaque part est un...'
    },
    { 
      question: 'Comment dit-on 1/3 en français ?',
      options: ['moitié', 'tiers', 'quart', 'huitième'],
      correctAnswer: 'tiers',
      hint: 'Quand on partage en 3, chaque part est un...'
    },
    { 
      question: 'Si on partage un gâteau en 6 parts égales, chaque part est un...',
      options: ['quart', 'cinquième', 'sixième', 'septième'],
      correctAnswer: 'sixième',
      hint: 'Le nombre 6 donne le mot sixième'
    },
    { 
      question: 'Si on partage une pizza en 8 parts égales, chaque part est un...',
      options: ['sixième', 'septième', 'huitième', 'neuvième'],
      correctAnswer: 'huitième',
      hint: 'Le nombre 8 donne le mot huitième'
    },
    { 
      question: 'Comment dit-on 1/5 en français ?',
      options: ['quatrième', 'cinquième', 'sixième', 'septième'],
      correctAnswer: 'cinquième',
      hint: 'Le nombre 5 donne le mot cinquième'
    },
    { 
      question: 'Quelle fraction représente une moitié ?',
      options: ['1/2', '1/3', '1/4', '2/1'],
      correctAnswer: '1/2',
      hint: 'Moitié = partager en 2'
    },
    { 
      question: 'Quelle fraction représente un quart ?',
      options: ['1/2', '1/3', '1/4', '4/1'],
      correctAnswer: '1/4',
      hint: 'Quart = partager en 4'
    },
    { 
      question: 'Quelle fraction représente un tiers ?',
      options: ['1/2', '1/3', '1/4', '3/1'],
      correctAnswer: '1/3',
      hint: 'Tiers = partager en 3'
    },
    { 
      question: 'Si je mange un cinquième d\'une tablette, j\'ai mangé...',
      options: ['1/4', '1/5', '1/6', '5/1'],
      correctAnswer: '1/5',
      hint: 'Cinquième s\'écrit 1/5'
    }
  ];

  const renderFractionCircle = (parts: number, coloredParts: number = 1) => {
    const anglePerPart = 360 / parts;
    const svgParts = [];
    
    for (let i = 0; i < parts; i++) {
      const isColored = i < coloredParts;
      const startAngle = i * anglePerPart - 90;
      const endAngle = (i + 1) * anglePerPart - 90;
      
      const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
      const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
      const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
      const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = anglePerPart > 180 ? 1 : 0;
      const pathData = `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      svgParts.push(
        <path
          key={i}
          d={pathData}
          fill={isColored ? "#3b82f6" : "#e5e7eb"}
          stroke="#374151"
          strokeWidth="1"
        />
      );
    }
    
    return (
      <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
        {svgParts}
      </svg>
    );
  };

  const handleNext = () => {
    if (isCorrect === null) {
      const correct = userAnswer === exercises[currentExercise].correctAnswer;
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
      }

      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setIsCorrect(null);
            setShowHint(false);
          } else {
            setFinalScore(score + (!answeredCorrectly.has(currentExercise) ? 1 : 0));
            setShowCompletionModal(true);
          }
        }, 1500);
      }
    } else {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setFinalScore(score);
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-fractions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux fractions</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              💬 Vocabulaire des fractions
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Apprends les mots importants : moitié, tiers, quart...
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{currentExercise + 1}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Exercice</div>
              </div>
            </div>
          </div>
        </div>

        {!showExercises && (
          <div>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl p-6 mb-8 text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold mb-4">Les mots des fractions !</h2>
                <p className="text-lg">
                  Chaque fraction a un nom spécial. Apprends ces mots magiques 
                  pour parler comme un vrai mathématicien !
                </p>
              </div>
            </div>

            {/* Exemples */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                📖 Le dictionnaire des fractions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className={`${example.color} rounded-lg p-4 border-2 border-gray-300`}>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900 mb-2">{example.fraction}</div>
                      <div className="text-xl font-bold text-blue-700">{example.name}</div>
                    </div>
                    <div className="text-center mb-4">
                      {renderFractionCircle(parseInt(example.fraction.split('/')[1]))}
                    </div>
                    <p className="text-center text-gray-700 text-sm">
                      {example.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🎮 Tester mes connaissances !
              </button>
            </div>
          </div>
        )}

        {showExercises && (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Exercice {currentExercise + 1} sur {exercises.length}
              </h2>
              <p className="text-xl text-gray-700">
                {exercises[currentExercise].question}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              {exercises[currentExercise].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                    userAnswer === option
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                <Lightbulb className="inline w-4 h-4 mr-2" />
                Indice
              </button>
              <button
                onClick={resetExercise}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Effacer
              </button>
            </div>

            {showHint && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-bold">{exercises[currentExercise].hint}</span>
                </div>
              </div>
            )}

            {isCorrect !== null && (
              <div className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold">Parfait ! Tu connais ton vocabulaire !</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span className="font-bold">
                        Pas tout à fait ! La bonne réponse est : {exercises[currentExercise].correctAnswer}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                disabled={currentExercise === 0}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                ← Précédent
              </button>
              <button
                onClick={handleNext}
                disabled={!userAnswer && isCorrect === null}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isCorrect === null ? 'Vérifier' : 'Suivant →'}
              </button>
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bravo !</h3>
              <p className="text-lg text-gray-700 mb-6">
                Tu maîtrises le vocabulaire des fractions !
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-xl font-bold text-gray-900">
                  Score final : {finalScore}/{exercises.length} 
                  ({Math.round((finalScore / exercises.length) * 100)}%)
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={resetAll}
                  className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  Recommencer
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 