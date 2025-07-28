'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function OrdonnerComparerCP100() {
  const [selectedComparison, setSelectedComparison] = useState('67_34');
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

  // Comparaisons pour le cours
  const comparisons = [
    { id: '23_45', num1: 23, num2: 45, symbol: '<', explanation: '23 est plus petit que 45', visual: '📦📦🔴🔴🔴 < 📦📦📦📦🔴🔴🔴🔴🔴' },
    { id: '67_34', num1: 67, num2: 34, symbol: '>', explanation: '67 est plus grand que 34', visual: '📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴 > 📦📦📦🔴🔴🔴🔴' },
    { id: '56_56', num1: 56, num2: 56, symbol: '=', explanation: '56 est égal à 56', visual: '📦📦📦📦📦🔴🔴🔴🔴🔴🔴 = 📦📦📦📦📦🔴🔴🔴🔴🔴🔴' },
    { id: '89_72', num1: 89, num2: 72, symbol: '>', explanation: '89 est plus grand que 72', visual: '📦📦📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴🔴🔴 > 📦📦📦📦📦📦📦🔴🔴' },
    { id: '38_91', num1: 38, num2: 91, symbol: '<', explanation: '38 est plus petit que 91', visual: '📦📦📦🔴🔴🔴🔴🔴🔴🔴🔴 < 📦📦📦📦📦📦📦📦📦🔴' },
    { id: '75_75', num1: 75, num2: 75, symbol: '=', explanation: '75 est égal à 75', visual: '📦📦📦📦📦📦📦🔴🔴🔴🔴🔴 = 📦📦📦📦📦📦📦🔴🔴🔴🔴🔴' },
    { id: '42_19', num1: 42, num2: 19, symbol: '>', explanation: '42 est plus grand que 19', visual: '📦📦📦📦🔴🔴 > 📦🔴🔴🔴🔴🔴🔴🔴🔴🔴' },
    { id: '28_63', num1: 28, num2: 63, symbol: '<', explanation: '28 est plus petit que 63', visual: '📦📦🔴🔴🔴🔴🔴🔴🔴🔴 < 📦📦📦📦📦📦🔴🔴🔴' }
  ];

  // Exercices de comparaison et rangement - 25 exercices au total (20 + 5 nouveaux)
  const exercises = [
    { question: 'Compare 34 et 27', num1: 34, num2: 27, correctAnswer: '>', choices: ['>', '<', '='] },
    { question: 'Compare 19 et 58', num1: 19, num2: 58, correctAnswer: '<', choices: ['=', '<', '>'] },
    { question: 'Compare 46 et 46', num1: 46, num2: 46, correctAnswer: '=', choices: ['<', '=', '>'] },
    { question: 'Compare 73 et 29', num1: 73, num2: 29, correctAnswer: '>', choices: ['>', '<', '='] },
    { question: 'Compare 25 et 84', num1: 25, num2: 84, correctAnswer: '<', choices: ['=', '>', '<'] },
    { question: 'Compare 92 et 92', num1: 92, num2: 92, correctAnswer: '=', choices: ['>', '=', '<'] },
    { question: 'Compare 67 et 41', num1: 67, num2: 41, correctAnswer: '>', choices: ['>', '<', '='] },
    { question: 'Compare 38 et 95', num1: 38, num2: 95, correctAnswer: '<', choices: ['<', '>', '='] },
    { question: 'Compare 100 et 76', num1: 100, num2: 76, correctAnswer: '>', choices: ['=', '<', '>'] },
    { question: 'Compare 55 et 55', num1: 55, num2: 55, correctAnswer: '=', choices: ['=', '>', '<'] },
    
    // Exercices de rangement (plus petit au plus grand)
    { question: 'Range du plus petit au plus grand : 47, 23, 61', type: 'ordre', correctAnswer: '23, 47, 61', choices: ['23, 47, 61', '61, 47, 23', '47, 23, 61'] },
    { question: 'Range du plus petit au plus grand : 88, 35, 52', type: 'ordre', correctAnswer: '35, 52, 88', choices: ['88, 52, 35', '35, 52, 88', '52, 35, 88'] },
    { question: 'Range du plus petit au plus grand : 94, 29, 73', type: 'ordre', correctAnswer: '29, 73, 94', choices: ['29, 73, 94', '94, 73, 29', '73, 29, 94'] },
    { question: 'Range du plus petit au plus grand : 16, 82, 45', type: 'ordre', correctAnswer: '16, 45, 82', choices: ['16, 45, 82', '82, 45, 16', '45, 16, 82'] },
    { question: 'Range du plus petit au plus grand : 100, 37, 69', type: 'ordre', correctAnswer: '37, 69, 100', choices: ['100, 69, 37', '37, 69, 100', '69, 37, 100'] },
    
    // Exercices avec dizaines proches
    { question: 'Compare 64 et 68', num1: 64, num2: 68, correctAnswer: '<', choices: ['<', '>', '='] },
    { question: 'Compare 87 et 83', num1: 87, num2: 83, correctAnswer: '>', choices: ['>', '=', '<'] },
    { question: 'Compare 72 et 79', num1: 72, num2: 79, correctAnswer: '<', choices: ['=', '<', '>'] },
    { question: 'Compare 91 et 95', num1: 91, num2: 95, correctAnswer: '<', choices: ['<', '>', '='] },
    { question: 'Compare 48 et 42', num1: 48, num2: 42, correctAnswer: '>', choices: ['>', '<', '='] },
    
    // 5 nouveaux exercices
    { question: 'Compare 56 et 89', num1: 56, num2: 89, correctAnswer: '<', choices: ['<', '>', '='] },
    { question: 'Compare 74 et 74', num1: 74, num2: 74, correctAnswer: '=', choices: ['>', '=', '<'] },
    { question: 'Compare 93 et 51', num1: 93, num2: 51, correctAnswer: '>', choices: ['>', '<', '='] },
    { question: 'Range du plus petit au plus grand : 85, 12, 60', type: 'ordre', correctAnswer: '12, 60, 85', choices: ['12, 60, 85', '85, 60, 12', '60, 12, 85'] },
    { question: 'Compare 39 et 43', num1: 39, num2: 43, correctAnswer: '<', choices: ['=', '<', '>'] }
  ];

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

    const existingProgress = localStorage.getItem('cp-nombres-100-progress');
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

    localStorage.setItem('cp-nombres-100-progress', JSON.stringify(allProgress));
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              📊 Ordonner et comparer jusqu'à 100
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Maîtrise les signes &lt;, &gt; et = pour comparer tous les nombres jusqu'à 100 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex h-auto">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex items-center justify-center ${
                !showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
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
          <div className="space-y-4 sm:space-y-8">
            {/* Sélecteur de comparaison */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis une comparaison à analyser
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {comparisons.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComparison(comp.id)}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                      selectedComparison === comp.id
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
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
                  <div className="bg-orange-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                    {/* Grande comparaison */}
                    <div className="text-3xl sm:text-5xl lg:text-7xl font-bold text-orange-600 mb-3 sm:mb-6 flex items-center justify-center space-x-2 sm:space-x-4">
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
                        👀 Regarde avec des paquets :
                      </h4>
                      <div className="text-base sm:text-xl py-2 sm:py-4 leading-relaxed break-all">
                        {selected.visual}
                      </div>
                    </div>

                    {/* Analyse par dizaines et unités */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base font-bold mb-2 text-blue-800">{selected.num1} :</h4>
                        <p className="text-xs sm:text-sm text-blue-700">
                          {Math.floor(selected.num1 / 10)} dizaines + {selected.num1 % 10} unités
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base font-bold mb-2 text-green-800">{selected.num2} :</h4>
                        <p className="text-xs sm:text-sm text-green-700">
                          {Math.floor(selected.num2 / 10)} dizaines + {selected.num2 % 10} unités
                        </p>
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
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">📝 Les symboles à maîtriser</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">&gt;</div>
                  <h4 className="font-bold text-red-800 mb-1">Plus grand que</h4>
                  <p className="text-sm text-red-700">87 &gt; 34</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">&lt;</div>
                  <h4 className="font-bold text-blue-800 mb-1">Plus petit que</h4>
                  <p className="text-sm text-blue-700">25 &lt; 76</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">=</div>
                  <h4 className="font-bold text-purple-800 mb-1">Égal à</h4>
                  <p className="text-sm text-purple-700">58 = 58</p>
                </div>
              </div>
            </div>

            {/* Méthode pour comparer */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">🎯 Méthode pour comparer</h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <strong>1️⃣ Compare d'abord les dizaines :</strong> 67 vs 34 → 6 &gt; 3, donc 67 &gt; 34
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                  <strong>2️⃣ Si les dizaines sont égales, compare les unités :</strong> 64 vs 68 → 4 &lt; 8, donc 64 &lt; 68
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <strong>3️⃣ Si tout est égal :</strong> 56 vs 56 → 56 = 56
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour les grands nombres</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• Plus il y a de dizaines, plus le nombre est grand</li>
                <li>• 70 &gt; 69 (même si 9 &gt; 0, regarde les dizaines !)</li>
                <li>• Pour ranger : commence toujours par le plus petit</li>
                <li>• 100 est le plus grand nombre qu'on connaît !</li>
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
                  className="bg-orange-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-orange-600">
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
              <div className="bg-orange-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                {exercises[currentExercise].type === 'ordre' ? (
                  <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600">
                    Trouve le bon ordre !
                  </div>
                ) : (
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-orange-600 flex items-center justify-center space-x-2 sm:space-x-4">
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
                        <span className="font-bold text-lg sm:text-xl">Excellent ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
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
                    className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-orange-600 transition-colors"
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
                  if (percentage >= 90) return { title: "🎉 Champion des comparaisons !", message: "Tu maîtrises parfaitement les nombres jusqu'à 100 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très impressionnant !", message: "Tu progresses énormément avec les grands nombres !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 Bon travail !", message: "Continue à t'entraîner avec les nombres jusqu'à 100 !", emoji: "😊" };
                  return { title: "💪 Persévère !", message: "Les comparaisons jusqu'à 100, ça demande de l'entraînement !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-2xl sm:text-4xl mt-2">
                        {finalScore >= 20 ? '⭐⭐⭐' : finalScore >= 15 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm sm:text-base"
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