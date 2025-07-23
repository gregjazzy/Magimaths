'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, ArrowUp, ArrowDown, Equal } from 'lucide-react';

export default function OrdonnerComparerCP20() {
  const [selectedComparison, setSelectedComparison] = useState('12_15');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

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

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ordonner-comparer',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ordonner-comparer');
      
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

  // Comparaisons pour le cours
  const comparisons = [
    { id: '5_8', num1: 5, num2: 8, symbol: '<', explanation: '5 est plus petit que 8', visual: '🔴🔴🔴🔴🔴 < 🔴🔴🔴🔴🔴🔴🔴🔴' },
    { id: '12_9', num1: 12, num2: 9, symbol: '>', explanation: '12 est plus grand que 9', visual: '📦🔴🔴 > 🔴🔴🔴🔴🔴🔴🔴🔴🔴' },
    { id: '7_7', num1: 7, num2: 7, symbol: '=', explanation: '7 est égal à 7', visual: '🔴🔴🔴🔴🔴🔴🔴 = 🔴🔴🔴🔴🔴🔴🔴' },
    { id: '15_18', num1: 15, num2: 18, symbol: '<', explanation: '15 est plus petit que 18', visual: '📦🔴🔴🔴🔴🔴 < 📦🔴🔴🔴🔴🔴🔴🔴🔴' },
    { id: '20_13', num1: 20, num2: 13, symbol: '>', explanation: '20 est plus grand que 13', visual: '📦📦 > 📦🔴🔴🔴' },
    { id: '11_11', num1: 11, num2: 11, symbol: '=', explanation: '11 est égal à 11', visual: '📦🔴 = 📦🔴' },
    { id: '14_16', num1: 14, num2: 16, symbol: '<', explanation: '14 est plus petit que 16', visual: '📦🔴🔴🔴🔴 < 📦🔴🔴🔴🔴🔴🔴' },
    { id: '19_10', num1: 19, num2: 10, symbol: '>', explanation: '19 est plus grand que 10', visual: '📦🔴🔴🔴🔴🔴🔴🔴🔴🔴 > 📦' }
  ];

  // Exercices de comparaison - positions des bonnes réponses variées
  const exercises = [
    { question: 'Compare 8 et 5', num1: 8, num2: 5, correctAnswer: '>', choices: ['>', '<', '='] },
    { question: 'Compare 3 et 7', num1: 3, num2: 7, correctAnswer: '<', choices: ['=', '<', '>'] },
    { question: 'Compare 6 et 6', num1: 6, num2: 6, correctAnswer: '=', choices: ['<', '=', '>'] },
    { question: 'Compare 12 et 9', num1: 12, num2: 9, correctAnswer: '>', choices: ['>', '<', '='] },
    { question: 'Compare 4 et 11', num1: 4, num2: 11, correctAnswer: '<', choices: ['=', '>', '<'] },
    { question: 'Compare 15 et 15', num1: 15, num2: 15, correctAnswer: '=', choices: ['>', '=', '<'] },
    { question: 'Compare 18 et 14', num1: 18, num2: 14, correctAnswer: '>', choices: ['>', '<', '='] },
    { question: 'Compare 7 et 13', num1: 7, num2: 13, correctAnswer: '<', choices: ['<', '>', '='] },
    { question: 'Compare 20 et 16', num1: 20, num2: 16, correctAnswer: '>', choices: ['=', '<', '>'] },
    { question: 'Compare 10 et 10', num1: 10, num2: 10, correctAnswer: '=', choices: ['=', '>', '<'] },
    
    // Exercices de rangement (plus petit au plus grand)
    { question: 'Range du plus petit au plus grand : 5, 12, 8', type: 'ordre', correctAnswer: '5, 8, 12', choices: ['5, 8, 12', '12, 8, 5', '8, 5, 12'] },
    { question: 'Range du plus petit au plus grand : 17, 3, 11', type: 'ordre', correctAnswer: '3, 11, 17', choices: ['17, 11, 3', '3, 11, 17', '11, 3, 17'] },
    { question: 'Range du plus petit au plus grand : 9, 15, 9', type: 'ordre', correctAnswer: '9, 9, 15', choices: ['9, 9, 15', '15, 9, 9', '9, 15, 9'] },
    { question: 'Range du plus petit au plus grand : 20, 6, 14', type: 'ordre', correctAnswer: '6, 14, 20', choices: ['6, 14, 20', '20, 14, 6', '14, 6, 20'] },
    { question: 'Range du plus petit au plus grand : 1, 19, 10', type: 'ordre', correctAnswer: '1, 10, 19', choices: ['19, 10, 1', '1, 10, 19', '10, 1, 19'] }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
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

    // Si bonne réponse → passage automatique après 1.5s
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernier exercice terminé
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              📊 Ordonner et comparer les nombres
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Apprends à utiliser les signes &lt;, &gt; et = pour comparer les nombres de 0 à 20 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Sélecteur de comparaison */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis une comparaison à découvrir
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {comparisons.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComparison(comp.id)}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                      selectedComparison === comp.id
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {comp.num1} {comp.symbol} {comp.num2}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage de la comparaison sélectionnée */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Analysons cette comparaison
              </h3>
              
              {(() => {
                const selected = comparisons.find(c => c.id === selectedComparison);
                if (!selected) return null;
                
                return (
                  <div className="bg-green-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                    {/* Grande comparaison */}
                    <div className="text-3xl sm:text-5xl lg:text-7xl font-bold text-green-600 mb-3 sm:mb-6 flex items-center justify-center space-x-2 sm:space-x-4">
                      <span>{selected.num1}</span>
                      <span className={`${
                        selected.symbol === '>' ? 'text-red-600' : 
                        selected.symbol === '<' ? 'text-blue-600' : 
                        'text-purple-600'
                      }`}>
                        {selected.symbol}
                      </span>
                      <span>{selected.num2}</span>
                    </div>
                    
                    {/* Représentation visuelle */}
                    <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                        👀 Regarde avec des objets :
                      </h4>
                      <div className="text-lg sm:text-2xl py-2 sm:py-4 leading-relaxed">
                        {selected.visual}
                      </div>
                    </div>

                    {/* Explication */}
                    <div className="bg-yellow-50 rounded-lg p-3 sm:p-6">
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-yellow-800">
                        💡 Explication :
                      </h4>
                      <p className="text-base sm:text-xl font-bold text-yellow-900 mb-2 sm:mb-4">
                        {selected.explanation}
                      </p>
                      <button
                        onClick={() => speakText(selected.explanation)}
                        className="bg-yellow-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm sm:text-base"
                      >
                        <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Écouter
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Guide des symboles */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">📝 Les symboles à connaître</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">&gt;</div>
                  <h4 className="font-bold text-red-800 mb-1">Plus grand que</h4>
                  <p className="text-sm text-red-700">7 &gt; 3</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">&lt;</div>
                  <h4 className="font-bold text-blue-800 mb-1">Plus petit que</h4>
                  <p className="text-sm text-blue-700">2 &lt; 9</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">=</div>
                  <h4 className="font-bold text-purple-800 mb-1">Égal à</h4>
                  <p className="text-sm text-purple-700">5 = 5</p>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-teal-400 to-green-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• Le signe "&gt;" ressemble à un bec qui "mange" le plus petit</li>
                <li>• Plus le nombre est grand, plus il y a d'objets</li>
                <li>• Pour ranger : commence par le plus petit</li>
                <li>• Les nombres avec 2 chiffres sont plus grands que ceux avec 1 chiffre</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-green-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage de la question */}
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                {exercises[currentExercise].type === 'ordre' ? (
                  <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-600">
                    Trouve le bon ordre !
                  </div>
                ) : (
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-green-600 flex items-center justify-center space-x-2 sm:space-x-4">
                    <span>{exercises[currentExercise].num1}</span>
                    <span className="text-gray-400">?</span>
                    <span>{exercises[currentExercise].num2}</span>
                  </div>
                )}
              </div>
              
              {/* Choix multiples */}
              <div className={`grid gap-2 sm:gap-3 md:gap-4 mx-auto mb-4 sm:mb-6 md:mb-8 ${
                exercises[currentExercise].type === 'ordre' 
                  ? 'grid-cols-1 max-w-sm sm:max-w-md' 
                  : 'grid-cols-1 md:grid-cols-3 max-w-sm sm:max-w-md'
              }`}>
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold transition-all ${
                      exercises[currentExercise].type === 'ordre' 
                        ? 'text-base sm:text-lg md:text-xl'
                        : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
                    } ${
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
                <div className={`p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">Bravo ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
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
                    className="bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-green-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent petit CP !", message: "Tu sais parfaitement comparer les nombres !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu maîtrises bien les comparaisons !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue à t'entraîner avec les signes !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Refais les exercices pour mieux comprendre !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-2xl sm:text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors text-sm sm:text-base"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
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