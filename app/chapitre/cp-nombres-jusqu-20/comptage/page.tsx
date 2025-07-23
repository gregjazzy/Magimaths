'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, XCircle, RotateCcw, Volume2, Pause } from 'lucide-react';

export default function ComptageCP() {
  const [selectedCount, setSelectedCount] = useState(5);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isCountingAnimation, setIsCountingAnimation] = useState(false);
  const [currentCountingNumber, setCurrentCountingNumber] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'comptage',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-20-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'comptage');
      
      if (existingIndex >= 0) {
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
          allProgress[existingIndex].attempts += 1;
        }
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('cp-nombres-20-progress', JSON.stringify(allProgress));
  };

  // Exercices de comptage
  const exercises = [
    { question: 'Compte les pommes', visual: '🍎🍎🍎🍎🍎', correctAnswer: '5', choices: ['4', '5', '6'] },
    { question: 'Combien de cœurs ?', visual: '❤️❤️❤️', correctAnswer: '3', choices: ['2', '3', '4'] },
    { question: 'Compte les étoiles', visual: '⭐⭐⭐⭐⭐⭐⭐', correctAnswer: '7', choices: ['6', '7', '8'] },
    { question: 'Combien de ballons ?', visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈', correctAnswer: '10', choices: ['9', '10', '11'] },
    { question: 'Compte les fleurs', visual: '🌸🌸🌸🌸🌸🌸', correctAnswer: '6', choices: ['5', '6', '7'] },
    { question: 'Combien de voitures ?', visual: '🚗🚗🚗🚗🚗🚗🚗🚗', correctAnswer: '8', choices: ['7', '8', '9'] },
    { question: 'Compte les livres', visual: '📚📚📚📚', correctAnswer: '4', choices: ['3', '4', '5'] },
    { question: 'Combien de chats ?', visual: '🐱🐱🐱🐱🐱🐱🐱🐱🐱', correctAnswer: '9', choices: ['8', '9', '10'] },
    { question: 'Compte les bonbons', visual: '🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭', correctAnswer: '12', choices: ['11', '12', '13'] },
    { question: 'Combien de doigts ?', visual: '✋✋👍', correctAnswer: '11', choices: ['10', '11', '12'] },
    { question: 'Compte les diamants', visual: '💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎', correctAnswer: '15', choices: ['14', '15', '16'] },
    { question: 'Combien de points ?', visual: '●●●●●●●●●●●●●●●●●●', correctAnswer: '18', choices: ['17', '18', '19'] }
  ];

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  const speakNumber = (num: number) => {
    if ('speechSynthesis' in window) {
      const numbers = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];
      const utterance = new SpeechSynthesisUtterance(numbers[num] || num.toString());
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startCountingAnimation = async () => {
    setIsCountingAnimation(true);
    setCurrentCountingNumber(0);
    
    for (let i = 1; i <= selectedCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentCountingNumber(i);
      speakNumber(i);
    }
    
    setIsCountingAnimation(false);
  };

  const handleAnswerClick = (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
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
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    // Réinitialiser les choix mélangés sera fait par useEffect quand currentExercise change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Compter jusqu'à 20
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à compter des objets et à réciter la suite des nombres !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center">
                <span>✏️ Exercices</span>
                <span className="text-sm opacity-90">({score}/{exercises.length})</span>
              </div>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Comptage avec animation */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Apprends à compter !
              </h2>
              
              {/* Sélecteur de quantité */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-green-800 text-center">
                  Choisis combien tu veux compter :
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {[3, 5, 7, 10, 12, 15, 18, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedCount(num)}
                      className={`p-3 rounded-lg font-bold text-lg transition-all ${
                        selectedCount === num
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-green-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone d'animation */}
              <div className="bg-blue-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">
                    🎪 Comptons ensemble jusqu'à {selectedCount} !
                  </h3>
                  
                  {/* Affichage des objets à compter */}
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 justify-items-center mb-6 max-w-4xl mx-auto">
                    {Array.from({length: selectedCount}, (_, i) => (
                      <div 
                        key={i}
                        className={`text-4xl transition-all duration-500 ${
                          i < currentCountingNumber 
                            ? 'scale-110 opacity-100' 
                            : isCountingAnimation 
                              ? 'scale-90 opacity-60'
                              : 'opacity-100'
                        }`}
                      >
                        🔴
                      </div>
                    ))}
                  </div>

                  {/* Compteur affiché */}
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {isCountingAnimation ? currentCountingNumber : selectedCount}
                  </div>

                  {/* Bouton pour démarrer le comptage */}
                  <button
                    onClick={startCountingAnimation}
                    disabled={isCountingAnimation}
                    className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCountingAnimation ? (
                      <>
                        <Pause className="inline w-5 h-5 mr-2" />
                        Comptage en cours...
                      </>
                    ) : (
                      <>
                        <Play className="inline w-5 h-5 mr-2" />
                        Compter avec moi !
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* La suite numérique jusqu'à 20 */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📝 La suite des nombres jusqu'à 20
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-yellow-800 text-center">
                  🗣️ Récite avec moi :
                </h3>
                
                {/* Grille des nombres */}
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-6">
                  {Array.from({length: 20}, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => speakNumber(num)}
                      className="bg-white p-4 rounded-lg font-bold text-2xl text-gray-800 hover:bg-yellow-100 hover:text-yellow-900 transition-colors border-2 border-yellow-200 hover:border-yellow-400"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <p className="text-center text-yellow-700 font-semibold text-lg">
                  💡 Clique sur chaque nombre pour l'entendre !
                </p>
              </div>
            </div>

            {/* Techniques de comptage */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ✋ Différentes façons de compter
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Avec les doigts */}
                <div className="bg-pink-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-pink-800">
                    🖐️ Avec tes doigts (jusqu'à 10)
                  </h3>
                  <div className="text-center space-y-3">
                    <div className="text-6xl">✋</div>
                    <p className="text-lg text-pink-700 font-semibold">
                      1 main = 5 doigts<br/>
                      2 mains = 10 doigts
                    </p>
                  </div>
                </div>

                {/* Avec des groupes */}
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-purple-800">
                    📦 Avec des groupes de 5
                  </h3>
                  <div className="text-center space-y-3">
                    <div className="text-2xl">
                      🔴🔴🔴🔴🔴 | 🔴🔴🔴🔴🔴 | 🔴🔴
                    </div>
                    <p className="text-lg text-purple-700 font-semibold">
                      5 + 5 + 2 = 12
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jeu des nombres cachés */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎮 Jeu : Continue la suite !
              </h2>
              
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-indigo-800 text-center">
                  Quel nombre vient après ?
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { sequence: '5, 6, 7, ?', answer: '8' },
                    { sequence: '12, 13, 14, ?', answer: '15' },
                    { sequence: '17, 18, 19, ?', answer: '20' },
                    { sequence: '8, 9, 10, ?', answer: '11' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg text-center border-2 border-indigo-200">
                      <div className="text-lg font-bold text-indigo-600 mb-2">
                        {item.sequence}
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour bien compter</h3>
              <ul className="space-y-2 text-lg">
                <li>• Pointe chaque objet avec ton doigt</li>
                <li>• Dis le nombre à voix haute</li>
                <li>• Utilise tes doigts pour t'aider</li>
                <li>• Fais des groupes de 5 pour les grands nombres</li>
                <li>• Récite la suite dans l'ordre tous les jours</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage des objets à compter */}
              <div className="bg-green-50 rounded-lg p-8 mb-8">
                <div className="text-5xl mb-6 tracking-wider">
                  {exercises[currentExercise].visual}
                </div>
                <p className="text-lg text-gray-700 font-semibold">
                  Compte bien chaque objet !
                </p>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-6 rounded-lg font-bold text-4xl transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Parfait ! Il y a bien {exercises[currentExercise].correctAnswer} objets !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... Il y en a {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Champion du comptage !", message: "Tu sais parfaitement compter jusqu'à 20 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comptes de mieux en mieux ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Le comptage demande de l'entraînement !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux apprendre à compter !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 10 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Bien compter, c'est la base des mathématiques !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
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
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 