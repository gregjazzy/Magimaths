'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function AdditionSansRetenueCE2() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedDigits, setHighlightedDigits] = useState<string[]>([]);
  const [calculationStep, setCalculationStep] = useState<'setup' | 'units' | 'tens' | 'hundreds' | 'result' | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [partialResults, setPartialResults] = useState<{units: string | null, tens: string | null, hundreds: string | null}>({units: null, tens: null, hundreds: null});
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // États pour les exercices
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);

  // Fonction pour mélanger un tableau
  const shuffleArray = <T extends any>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const baseExercises = [
    // 1. Introduction rapide
    {
      question: 'Par quelle colonne commence-t-on ?', 
      correctAnswer: 'Les unités (à droite)',
      choices: ['Les dizaines (au milieu)', 'Les unités (à droite)', 'Les centaines (à gauche)']
    },
    {
      question: 'Pourquoi aligner les chiffres ?', 
      correctAnswer: 'Pour ne pas mélanger les unités et dizaines',
      choices: ['Pour faire joli', 'Pour ne pas mélanger les unités et dizaines', 'Ce n\'est pas important']
    },
    
    // 2. Exercices simples sans retenue
    { 
      question: 'Calcule : 123 + 234', 
      correctAnswer: '357',
      choices: ['357', '347', '367'],
      visual: '  123\n+ 234\n─────\n   ?'
    },
    { 
      question: 'Calcule : 213 + 154', 
      correctAnswer: '367',
      choices: ['367', '357', '377'],
      visual: '  213\n+ 154\n─────\n   ?'
    },
    { 
      question: 'Calcule : 231 + 126', 
      correctAnswer: '357',
      choices: ['364', '349', '357'],
      visual: '  231\n+ 126\n─────\n   ?'
    },
    { 
      question: 'Calcule : 312 + 241', 
      correctAnswer: '553',
      choices: ['553', '546', '561'],
      visual: '  312\n+ 241\n─────\n   ?'
    },
    { 
      question: 'Calcule : 456 + 321', 
      correctAnswer: '777',
      choices: ['777', '768', '786'],
      visual: '  456\n+ 321\n─────\n   ?'
    },
    { 
      question: 'Calcule : 523 + 164', 
      correctAnswer: '687',
      choices: ['679', '687', '695'],
      visual: '  523\n+ 164\n─────\n   ?'
    },
    
    // 3. Exercices de fin plus complexes
    { 
      question: 'Calcule : 64 + 25', 
      correctAnswer: '89',
      choices: ['87', '89', '91'],
      visual: '   64\n+  25\n─────\n   ?'
    },
    { 
      question: 'Calcule : 417 + 281', 
      correctAnswer: '698',
      choices: ['698', '689', '707'],
      visual: '  417\n+ 281\n─────\n   ?'
    },
    { 
      question: 'Par quelle colonne commence-t-on toujours ?', 
      correctAnswer: 'Les unités (à droite)',
      choices: ['Les dizaines (à gauche)', 'Les unités (à droite)', 'Les centaines (à gauche)']
    },
    
    // 4. Défi final
    { 
      question: 'Calcule : 635 + 243', 
      correctAnswer: '878',
      choices: ['878', '867', '889'],
      visual: '  635\n+ 243\n─────\n   ?'
    },
    { 
      question: 'L\'addition posée sans retenue nous aide à...', 
      correctAnswer: 'Calculer plus facilement',
      choices: ['Aller plus vite', 'Faire plus joli', 'Calculer plus facilement']
    }
  ];

  const exercises = baseExercises;

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedDigits([]);
    setCalculationStep(null);
    setShowingCarry(false);
    setPartialResults({units: null, tens: null, hundreds: null});
    setSamSizeExpanded(false);
  };

  // Fonction pour valider une réponse
  const handleValidateAnswer = () => {
    const currentExerciseData = exercises[currentExercise];
    const isAnswerCorrect = userAnswer === currentExerciseData.correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect && !answeredCorrectly.has(currentExercise)) {
      const newScore = score + 1;
      setScore(newScore);
      const newAnsweredCorrectly = new Set(answeredCorrectly);
      newAnsweredCorrectly.add(currentExercise);
      setAnsweredCorrectly(newAnsweredCorrectly);
      
      if (currentExercise === exercises.length - 1) {
        setShowCompletionModal(true);
        setFinalScore(newScore);
      }
    }
  };

  // Fonction pour passer à l'exercice suivant
  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  // Fonction pour recommencer les exercices
  const handleRestartExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce2-operations-complexes/addition-ce2" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour à l'addition CE2</span>
            </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              📝 Addition sans retenue - CE2
            </h1>
        </div>
      </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showExercises
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            🎯 Exercices ({score}/{exercises.length})
          </button>
        </div>

        {/* Contenu principal */}
        {!showExercises ? (
          /* COURS */
          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                🎯 L'addition sans retenue
              </h2>
              <p className="text-gray-700 mb-4">
                L'addition sans retenue est la plus simple ! Il suffit d'additionner les chiffres colonne par colonne, en commençant par la droite.
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-2">Règles importantes :</h3>
                <ul className="list-disc list-inside text-green-700 space-y-2">
                  <li>On aligne bien les chiffres</li>
                  <li>On commence par les unités (à droite)</li>
                  <li>On additionne colonne par colonne</li>
                  <li>Pas besoin de retenue car les sommes sont inférieures à 10</li>
                </ul>
              </div>
            </div>

            {/* Exemple animé */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📝 Exemple : 234 + 125
              </h3>
              <div className="flex justify-center mb-4">
                <div className="font-mono text-xl whitespace-pre">
                  {'  234\n+ 125\n─────\n  359'}
                </div>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>1. Unités : 4 + 5 = 9</p>
                <p>2. Dizaines : 3 + 2 = 5</p>
                <p>3. Centaines : 2 + 1 = 3</p>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Exercice {currentExercise + 1}/{exercises.length}
                </h2>
                <div className="text-sm font-medium text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(currentExercise + 1) / exercises.length * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {exercises[currentExercise].question}
              </h3>
              
              {exercises[currentExercise].visual && (
                <div className="font-mono text-xl mb-6 whitespace-pre text-center">
                  {exercises[currentExercise].visual}
                </div>
              )}
              
              {exercises[currentExercise].choices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exercises[currentExercise].choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => setUserAnswer(choice)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userAnswer === choice
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-200'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Ta réponse..."
                  className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleValidateAnswer}
                disabled={!userAnswer || isCorrect !== null}
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Valider
              </button>
              
              {isCorrect !== null && currentExercise < exercises.length - 1 && (
                <button
                  onClick={handleNextExercise}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                >
                  Suivant
                </button>
              )}
            </div>

            {/* Feedback */}
            {isCorrect !== null && (
              <div className={`mt-6 p-4 rounded-lg ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-medium">
                  {isCorrect ? '✅ Bravo !' : '❌ Essaie encore !'}
                </p>
                {!isCorrect && (
                  <p className="mt-2">
                    La bonne réponse était : {exercises[currentExercise].correctAnswer}
                  </p>
                )}
              </div>
            )}

            {/* Modal de complétion */}
            {showCompletionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-6 max-w-sm w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🎉 Félicitations !
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tu as terminé tous les exercices avec un score de {finalScore}/{exercises.length} !
                  </p>
                  <button
                    onClick={handleRestartExercises}
                    className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                  >
                    Recommencer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
