'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function ComplementsDixCP() {
  const [selectedPair, setSelectedPair] = useState('7+3');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'complements-10',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'complements-10');
      
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

  // Compléments à 10 (toutes les paires qui font 10)
  const complementPairs = [
    { pair: '0+10', visual1: '', visual2: '●●●●●●●●●●', result: '10' },
    { pair: '1+9', visual1: '●', visual2: '●●●●●●●●●', result: '10' },
    { pair: '2+8', visual1: '●●', visual2: '●●●●●●●●', result: '10' },
    { pair: '3+7', visual1: '●●●', visual2: '●●●●●●●', result: '10' },
    { pair: '4+6', visual1: '●●●●', visual2: '●●●●●●', result: '10' },
    { pair: '5+5', visual1: '●●●●●', visual2: '●●●●●', result: '10' },
    { pair: '6+4', visual1: '●●●●●●', visual2: '●●●●', result: '10' },
    { pair: '7+3', visual1: '●●●●●●●', visual2: '●●●', result: '10' },
    { pair: '8+2', visual1: '●●●●●●●●', visual2: '●●', result: '10' },
    { pair: '9+1', visual1: '●●●●●●●●●', visual2: '●', result: '10' },
    { pair: '10+0', visual1: '●●●●●●●●●●', visual2: '', result: '10' }
  ];

  // Exercices sur les compléments à 10
  const exercises = [
    { question: '7 + ? = 10', missing: '3', choices: ['2', '3', '4'] },
    { question: '4 + ? = 10', missing: '6', choices: ['7', '5', '6'] },
    { question: '? + 2 = 10', missing: '8', choices: ['8', '7', '9'] },
    { question: '9 + ? = 10', missing: '1', choices: ['2', '0', '1'] },
    { question: '5 + ? = 10', missing: '5', choices: ['6', '4', '5'] },
    { question: '? + 6 = 10', missing: '4', choices: ['4', '3', '5'] },
    { question: '3 + ? = 10', missing: '7', choices: ['8', '6', '7'] },
    { question: '? + 8 = 10', missing: '2', choices: ['3', '2', '1'] },
    { question: '1 + ? = 10', missing: '9', choices: ['9', '10', '8'] },
    { question: '? + 5 = 10', missing: '5', choices: ['4', '6', '5'] },
    { question: '6 + ? = 10', missing: '4', choices: ['5', '4', '3'] },
    { question: '? + 7 = 10', missing: '3', choices: ['4', '3', '2'] },
    { question: '2 + ? = 10', missing: '8', choices: ['9', '8', '7'] },
    { question: '? + 9 = 10', missing: '1', choices: ['1', '2', '0'] },
    { question: '8 + ? = 10', missing: '2', choices: ['3', '1', '2'] }
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
    if (exercises.length > 0 && currentExercise < exercises.length) {
      const currentChoices = exercises[currentExercise].choices;
      const shuffled = shuffleArray(currentChoices);
      setShuffledChoices(shuffled);
    }
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    initializeShuffledChoices();
  }, [currentExercise]);

  // Effet pour initialiser les choix au premier rendu
  useEffect(() => {
    initializeShuffledChoices();
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonction pour convertir les chiffres en mots français
  const numberToWords = (num: string) => {
    const numbers: { [key: string]: string } = {
      '0': 'zéro',
      '1': 'un',
      '2': 'deux', 
      '3': 'trois',
      '4': 'quatre',
      '5': 'cinq',
      '6': 'six',
      '7': 'sept',
      '8': 'huit',
      '9': 'neuf',
      '10': 'dix'
    };
    return numbers[num] || num;
  };

  // Fonction pour dire une opération en français
  const speakOperation = (operation: string) => {
    // Exemple: "9+1" devient "neuf plus un égale dix"
    const parts = operation.split('+');
    if (parts.length === 2) {
      const num1 = numberToWords(parts[0].trim());
      const num2 = numberToWords(parts[1].trim());
      const text = `${num1} plus ${num2} égale dix`;
      speakText(text);
    }
  };

  const handleAnswerClick = (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].missing;
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
    // Réinitialiser les choix mélangés sera fait par useEffect quand currentExercise change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🎯 Les compléments à 10
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Apprends par cœur toutes les façons de faire 10 ! C'est très important en CP.
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex h-auto">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex items-center justify-center ${
                !showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-6 sm:space-y-8">
            {/* Explication des compléments à 10 */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🧠 Qu'est-ce qu'un complément à 10 ?
              </h2>
              
              <div className="bg-pink-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <p className="text-base sm:text-lg lg:text-xl text-center text-gray-800 mb-3 sm:mb-4">
                  Un complément à 10, c'est <strong>deux nombres qui ensemble font 10</strong> !
                </p>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600 mb-2">7 + 3 = 10</div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700">7 et 3 sont des compléments à 10 !</p>
                </div>
              </div>

              {/* Visualisation avec les mains */}
              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-yellow-800 text-center">
                  ✋ Avec tes doigts : 7 + 3 = 10
                </h3>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-8">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-6xl mb-2">✋✌️</div>
                    <div className="font-bold text-sm sm:text-base lg:text-xl text-gray-800">7 doigts</div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600">+</div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-6xl mb-2">🤟</div>
                    <div className="font-bold text-sm sm:text-base lg:text-xl text-gray-800">3 doigts</div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600">=</div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl lg:text-6xl mb-2">🙌</div>
                    <div className="font-bold text-sm sm:text-base lg:text-xl text-gray-800">10 doigts !</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau de tous les compléments à 10 */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                📊 Toutes les paires qui font 10
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {complementPairs.map((comp) => (
                  <button
                    key={comp.pair}
                    onClick={() => setSelectedPair(comp.pair)}
                    className={`p-3 sm:p-4 rounded-lg font-bold text-base sm:text-lg lg:text-xl transition-all ${
                      selectedPair === comp.pair
                        ? 'bg-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {comp.pair} = 10
                  </button>
                ))}
              </div>

              {/* Affichage détaillé de la paire sélectionnée */}
              <div className="bg-pink-50 rounded-lg p-4 sm:p-6 lg:p-8">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-4 sm:mb-6 text-center text-pink-800">
                  🔍 Regardons {selectedPair} = 10
                </h3>
                
                {(() => {
                  const selected = complementPairs.find(c => c.pair === selectedPair);
                  if (!selected) return null;
                  
                  return (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Visualisation avec points */}
                      <div className="bg-white rounded-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                          <div className="text-center">
                            <div className="text-lg sm:text-xl lg:text-2xl text-blue-600 mb-2 font-mono tracking-wider break-all">
                              {selected.visual1}
                            </div>
                            <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">{selected.pair.split('+')[0]}</div>
                          </div>
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-600">+</div>
                          <div className="text-center">
                            <div className="text-lg sm:text-xl lg:text-2xl text-green-600 mb-2 font-mono tracking-wider break-all">
                              {selected.visual2}
                            </div>
                            <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">{selected.pair.split('+')[1]}</div>
                          </div>
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-600">=</div>
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600">10</div>
                          </div>
                        </div>
                      </div>

                      {/* Bouton audio */}
                      <div className="text-center">
                        <button
                          onClick={() => speakOperation(selected.pair)}
                          className="bg-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors text-sm sm:text-base lg:text-lg"
                        >
                          <Volume2 className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Écouter
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Jeu de mémorisation */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🎯 Jeu de mémorisation
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-blue-800 text-center">
                  🧠 Répète après moi !
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {complementPairs.slice(1, -1).map((comp) => (
                    <button
                      key={comp.pair}
                      onClick={() => speakOperation(comp.pair)}
                      className="bg-white p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-base lg:text-lg text-gray-800 hover:bg-blue-100 transition-colors border-2 border-blue-200"
                    >
                      {comp.pair} = 10
                    </button>
                  ))}
                </div>
                <p className="text-center text-blue-700 mt-3 sm:mt-4 font-semibold text-sm sm:text-base">
                  💡 Clique sur chaque complément et répète à voix haute !
                </p>
              </div>
            </div>

            {/* Conseils pour mémoriser */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour apprendre par cœur</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-lg">
                <li>• Utilise tes doigts : 10 doigts en tout !</li>
                <li>• Commence par 5+5 = 10 (c'est le plus facile)</li>
                <li>• Récite-les dans l'ordre tous les jours</li>
                <li>• Si tu sais que 7+3=10, alors 3+7=10 aussi !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-6 sm:space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-pink-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-pink-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                🎯 Trouve le nombre qui manque :
              </h3>
              
              {/* Question avec grand affichage */}
              <div className="bg-pink-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-pink-600 mb-3 sm:mb-4 md:mb-6">
                  {exercises[currentExercise].question}
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                  Quel nombre complète pour faire 10 ?
                </p>
              </div>
              
              {/* Choix multiples avec gros boutons */}
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all flex items-center justify-center min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        : exercises[currentExercise].missing === choice && isCorrect === false
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
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-xl text-center">
                          Parfait ! {exercises[currentExercise].question.replace('?', exercises[currentExercise].missing)} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-xl text-center">
                          Pas tout à fait... C'était {exercises[currentExercise].missing} !
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Illustration et audio pour les mauvaises réponses */}
                  {!isCorrect && (
                    <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-blue-300">
                      <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-blue-800 text-center">
                        🎯 Regarde la bonne réponse !
                      </h4>
                      
                      {(() => {
                        // Reconstituer l'opération complète
                        const question = exercises[currentExercise].question;
                        const missing = exercises[currentExercise].missing;
                        let operation = '';
                        let num1 = '';
                        let num2 = '';
                        
                        if (question.includes('? +')) {
                          // Format: "? + 2 = 10"
                          num1 = missing;
                          num2 = question.split('? + ')[1].split(' = ')[0];
                          operation = `${num1}+${num2}`;
                        } else {
                          // Format: "7 + ? = 10"
                          num1 = question.split(' + ?')[0];
                          num2 = missing;
                          operation = `${num1}+${num2}`;
                        }
                        
                        // Trouver la visualisation correspondante
                        const complement = complementPairs.find(c => c.pair === operation);
                        
                        return (
                          <div className="space-y-4">
                            {/* Visualisation avec points */}
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="text-center mb-3">
                                <div className="text-2xl font-bold text-blue-600">
                                  {operation.replace('+', ' + ')} = 10
                                </div>
                              </div>
                              
                              {complement && (
                                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                                  <div className="text-center">
                                    <div className="text-base sm:text-lg lg:text-xl text-blue-600 mb-2 font-mono tracking-wider break-all">
                                      {complement.visual1}
                                    </div>
                                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">{num1}</div>
                                  </div>
                                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600">+</div>
                                  <div className="text-center">
                                    <div className="text-base sm:text-lg lg:text-xl text-green-600 mb-2 font-mono tracking-wider break-all">
                                      {complement.visual2}
                                    </div>
                                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">{num2}</div>
                                  </div>
                                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600">=</div>
                                  <div className="text-center">
                                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-600">10</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Bouton d'écoute */}
                            <div className="text-center">
                              <button
                                onClick={() => speakOperation(operation)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-colors flex items-center space-x-2 mx-auto text-sm sm:text-base"
                              >
                                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Écouter la bonne réponse</span>
                              </button>
                            </div>
                            
                            {/* Message d'encouragement */}
                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                              <div className="text-base sm:text-lg">🌟</div>
                              <p className="text-xs sm:text-sm font-semibold text-purple-800">
                                Maintenant tu sais ! {numberToWords(num1)} plus {numberToWords(num2)} égale dix !
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-pink-600 transition-colors"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Champion des compléments !", message: "Tu maîtrises parfaitement les compléments à 10 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu connais bien tes compléments ! Continue à t'entraîner !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Les compléments à 10 sont importants !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux apprendre les compléments à 10 !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">{result.emoji}</div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{result.title}</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6">{result.message}</p>
                    <div className="bg-pink-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-2xl sm:text-3xl lg:text-4xl mt-2">
                        {finalScore >= 10 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">
                        Les compléments à 10 sont essentiels pour bien calculer !
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors text-sm sm:text-base"
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