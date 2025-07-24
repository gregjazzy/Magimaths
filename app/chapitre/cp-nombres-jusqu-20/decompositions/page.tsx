'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Plus } from 'lucide-react';

export default function DecompositionsCP() {
  const [selectedNumber, setSelectedNumber] = useState('5');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  // Fonction pour mélanger un tableau (définie ici pour pouvoir l'utiliser dans useState)
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'decompositions',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'decompositions');
      
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

  // Nombres avec leurs décompositions
  const numbersDecompositions = {
    '3': [
      { formula: '3 = 0 + 3', visual1: '', visual2: '🔴🔴🔴' },
      { formula: '3 = 1 + 2', visual1: '🔴', visual2: '🔴🔴' },
      { formula: '3 = 2 + 1', visual1: '🔴🔴', visual2: '🔴' },
      { formula: '3 = 3 + 0', visual1: '🔴🔴🔴', visual2: '' }
    ],
    '4': [
      { formula: '4 = 0 + 4', visual1: '', visual2: '🔴🔴🔴🔴' },
      { formula: '4 = 1 + 3', visual1: '🔴', visual2: '🔴🔴🔴' },
      { formula: '4 = 2 + 2', visual1: '🔴🔴', visual2: '🔴🔴' },
      { formula: '4 = 3 + 1', visual1: '🔴🔴🔴', visual2: '🔴' },
      { formula: '4 = 4 + 0', visual1: '🔴🔴🔴🔴', visual2: '' }
    ],
    '5': [
      { formula: '5 = 0 + 5', visual1: '', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '5 = 1 + 4', visual1: '🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '5 = 2 + 3', visual1: '🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '5 = 3 + 2', visual1: '🔴🔴🔴', visual2: '🔴🔴' },
      { formula: '5 = 4 + 1', visual1: '🔴🔴🔴🔴', visual2: '🔴' },
      { formula: '5 = 5 + 0', visual1: '🔴🔴🔴🔴🔴', visual2: '' }
    ],
    '6': [
      { formula: '6 = 1 + 5', visual1: '🔴', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '6 = 2 + 4', visual1: '🔴🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '6 = 3 + 3', visual1: '🔴🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '6 = 4 + 2', visual1: '🔴🔴🔴🔴', visual2: '🔴🔴' },
      { formula: '6 = 5 + 1', visual1: '🔴🔴🔴🔴🔴', visual2: '🔴' }
    ],
    '7': [
      { formula: '7 = 1 + 6', visual1: '🔴', visual2: '🔴🔴🔴🔴🔴🔴' },
      { formula: '7 = 2 + 5', visual1: '🔴🔴', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '7 = 3 + 4', visual1: '🔴🔴🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '7 = 4 + 3', visual1: '🔴🔴🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '7 = 5 + 2', visual1: '🔴🔴🔴🔴🔴', visual2: '🔴🔴' },
      { formula: '7 = 6 + 1', visual1: '🔴🔴🔴🔴🔴🔴', visual2: '🔴' }
    ],
    '8': [
      { formula: '8 = 2 + 6', visual1: '🔴🔴', visual2: '🔴🔴🔴🔴🔴🔴' },
      { formula: '8 = 3 + 5', visual1: '🔴🔴🔴', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '8 = 4 + 4', visual1: '🔴🔴🔴🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '8 = 5 + 3', visual1: '🔴🔴🔴🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '8 = 6 + 2', visual1: '🔴🔴🔴🔴🔴🔴', visual2: '🔴🔴' }
    ]
  };

  // Exercices sur les décompositions
  const exercises = [
    { question: '5 = 2 + ?', number: 5, part1: 2, correctAnswer: '3', choices: ['3', '2', '4'] },
    { question: '4 = 1 + ?', number: 4, part1: 1, correctAnswer: '3', choices: ['4', '2', '3'] },
    { question: '6 = 3 + ?', number: 6, part1: 3, correctAnswer: '3', choices: ['2', '3', '4'] },
    { question: '7 = 4 + ?', number: 7, part1: 4, correctAnswer: '3', choices: ['3', '2', '4'] },
    { question: '3 = 1 + ?', number: 3, part1: 1, correctAnswer: '2', choices: ['3', '1', '2'] },
    { question: '8 = 5 + ?', number: 8, part1: 5, correctAnswer: '3', choices: ['2', '4', '3'] },
    { question: '6 = 2 + ?', number: 6, part1: 2, correctAnswer: '4', choices: ['4', '3', '5'] },
    { question: '5 = 3 + ?', number: 5, part1: 3, correctAnswer: '2', choices: ['3', '2', '1'] },
    { question: '7 = 2 + ?', number: 7, part1: 2, correctAnswer: '5', choices: ['6', '4', '5'] },
    { question: '4 = 2 + ?', number: 4, part1: 2, correctAnswer: '2', choices: ['2', '1', '3'] },
    { question: '8 = 3 + ?', number: 8, part1: 3, correctAnswer: '5', choices: ['6', '5', '4'] },
    { question: '6 = 4 + ?', number: 6, part1: 4, correctAnswer: '2', choices: ['3', '1', '2'] },
    { question: '7 = 1 + ?', number: 7, part1: 1, correctAnswer: '6', choices: ['6', '5', '7'] },
    { question: '5 = 1 + ?', number: 5, part1: 1, correctAnswer: '4', choices: ['5', '3', '4'] },
    { question: '8 = 2 + ?', number: 8, part1: 2, correctAnswer: '6', choices: ['7', '6', '5'] }
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

  // Effet pour initialiser les choix au premier rendu
  useEffect(() => {
    if (exercises.length > 0 && shuffledChoices.length === 0) {
      initializeShuffledChoices();
    }
  }, []);

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string): string => {
    const numbers: { [key: string]: string } = {
      '0': 'zéro', '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre',
      '5': 'cinq', '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf',
      '10': 'dix', '11': 'onze', '12': 'douze', '13': 'treize', '14': 'quatorze',
      '15': 'quinze', '16': 'seize', '17': 'dix-sept', '18': 'dix-huit', 
      '19': 'dix-neuf', '20': 'vingt'
    };
    return numbers[num] || num;
  };

  // Fonction pour énoncer le résultat de la décomposition
  const speakResult = (number: number, part1: number, part2: string) => {
    const text = `${numberToWords(number.toString())} égale ${numberToWords(part1.toString())} plus ${numberToWords(part2)}`;
    speakText(text);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🧩 Les décompositions additives
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Découvre toutes les façons de faire un nombre avec des additions !
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
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
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
            {/* Explication des décompositions */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🧠 Qu'est-ce qu'une décomposition additive ?
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <p className="text-base sm:text-lg lg:text-xl text-center text-gray-800 mb-3 sm:mb-4">
                  Une décomposition, c'est <strong>couper un nombre en plusieurs morceaux</strong> !
                </p>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-3 sm:mb-4">5 = 2 + 3</div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700">On peut faire 5 avec 2 et 3 !</p>
                </div>
              </div>

              {/* Exemple visuel avec des objets */}
              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-yellow-800 text-center">
                  🍎 Exemple : 5 pommes = 2 pommes + 3 pommes
                </h3>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl lg:text-4xl mb-2">🍎🍎🍎🍎🍎</div>
                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">5 pommes</div>
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">=</div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl lg:text-4xl mb-2">🍎🍎</div>
                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">2 pommes</div>
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">+</div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl lg:text-4xl mb-2">🍎🍎🍎</div>
                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">3 pommes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🎯 Choisis un nombre à décomposer
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {['3', '4', '5', '6', '7', '8'].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedNumber(num)}
                    className={`p-3 sm:p-4 lg:p-6 rounded-lg font-bold text-xl sm:text-2xl lg:text-3xl transition-all ${
                      selectedNumber === num
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage des décompositions */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                📊 Toutes les façons de faire {selectedNumber}
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {numbersDecompositions[selectedNumber as keyof typeof numbersDecompositions]?.map((decomp, index) => (
                  <div key={index} className="bg-purple-50 rounded-lg p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                      {/* Première partie */}
                      <div className="text-center min-w-[80px] sm:min-w-[100px]">
                        <div className="text-base sm:text-lg lg:text-2xl mb-1 sm:mb-2 break-all">
                          {decomp.visual1}
                        </div>
                        <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">
                          {decomp.formula.split(' = ')[1].split(' + ')[0]}
                        </div>
                      </div>
                      
                      <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">
                        <Plus className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                      </div>
                      
                      {/* Deuxième partie */}
                      <div className="text-center min-w-[80px] sm:min-w-[100px]">
                        <div className="text-base sm:text-lg lg:text-2xl mb-1 sm:mb-2 break-all">
                          {decomp.visual2}
                        </div>
                        <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">
                          {decomp.formula.split(' + ')[1]}
                        </div>
                      </div>
                      
                      <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">=</div>
                      
                      {/* Résultat */}
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">
                          {selectedNumber}
                        </div>
                      </div>
                    </div>
                    
                    {/* Formule complète */}
                    <div className="text-center mt-3 sm:mt-4">
                      <button
                        onClick={() => speakText(decomp.formula.replace(/[+=]/g, (match) => match === '+' ? 'plus' : 'égale'))}
                        className="bg-purple-200 hover:bg-purple-300 text-purple-900 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base lg:text-lg transition-colors"
                      >
                        <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        {decomp.formula}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jeu interactif */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎮 Jeu : Trouve d'autres décompositions !
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-lg text-center text-blue-800 mb-4 font-semibold">
                  💡 Astuce : Si tu sais que 5 = 2 + 3, alors tu sais aussi que 5 = 3 + 2 !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    L'ordre n'a pas d'importance dans une addition !
                  </div>
                  <div className="text-xl text-blue-700">
                    2 + 3 = 3 + 2 = 5
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir les décompositions</h3>
              <ul className="space-y-2 text-lg">
                <li>• Utilise tes doigts pour partager</li>
                <li>• Commence par les plus simples : 0 + tout</li>
                <li>• Pense aux objets : bonbons, pommes, jetons...</li>
                <li>• L'ordre ne change rien : 2+3 = 3+2</li>
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
                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                🎯 Complète la décomposition :
              </h3>
              
              {/* Question avec visualisation */}
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-purple-600 mb-3 sm:mb-4 md:mb-6">
                  {exercises[currentExercise].question}
                </div>
                
                {/* Aide visuelle */}
                <div className="flex justify-center items-center space-x-2 sm:space-x-3 md:space-x-4 mt-3 sm:mt-4 md:mt-6">
                  <div className="text-center">
                    <div className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-1 sm:mb-2">
                      {'🔴'.repeat(exercises[currentExercise].number)}
                    </div>
                    <div className="font-bold text-sm sm:text-base md:text-lg text-gray-800">{exercises[currentExercise].number}</div>
                  </div>
                  <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">=</div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-1 sm:mb-2">
                      {'🔴'.repeat(exercises[currentExercise].part1)}
                    </div>
                    <div className="font-bold text-sm sm:text-base md:text-lg text-gray-800">{exercises[currentExercise].part1}</div>
                  </div>
                  <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">+</div>
                  <div className="text-center">
                    <div className="text-base sm:text-xl md:text-2xl lg:text-3xl mb-1 sm:mb-2">❓</div>
                    <div className="font-bold text-sm sm:text-base md:text-lg text-gray-800">?</div>
                  </div>
                </div>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {(shuffledChoices.length > 0 ? shuffledChoices : exercises[currentExercise].choices).map((choice) => (
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
                          Parfait ! {exercises[currentExercise].number} = {exercises[currentExercise].part1} + {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback détaillé pour les réponses incorrectes */}
              {!isCorrect && isCorrect !== null && (
                <div className="bg-white rounded-lg p-6 border-2 border-blue-300 mb-6">
                  <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                    🎯 Regarde la bonne réponse !
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-4">
                          {exercises[currentExercise].number} = {exercises[currentExercise].part1} + {exercises[currentExercise].correctAnswer}
                        </div>
                        
                        {/* Illustration dans le bon ordre */}
                        <div className="flex justify-center items-center space-x-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl mb-2">
                              {'🔴'.repeat(exercises[currentExercise].number)}
                            </div>
                            <div className="font-bold text-lg text-gray-800">{exercises[currentExercise].number}</div>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">=</div>
                          <div className="text-center">
                            <div className="text-2xl mb-2">
                              {'🔴'.repeat(exercises[currentExercise].part1)}
                            </div>
                            <div className="font-bold text-lg text-gray-800">{exercises[currentExercise].part1}</div>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">+</div>
                          <div className="text-center">
                            <div className="text-2xl mb-2">
                              {'🔴'.repeat(parseInt(exercises[currentExercise].correctAnswer))}
                            </div>
                            <div className="font-bold text-lg text-gray-800">{exercises[currentExercise].correctAnswer}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => speakResult(
                          exercises[currentExercise].number, 
                          exercises[currentExercise].part1, 
                          exercises[currentExercise].correctAnswer
                        )}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Écouter la bonne réponse</span>
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                      <p className="text-sm font-semibold text-purple-800">
                        Maintenant tu sais ! {exercises[currentExercise].number} objets = {exercises[currentExercise].part1} objets + {exercises[currentExercise].correctAnswer} objets !
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors"
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
                  if (percentage >= 90) return { title: "🎉 Expert en décompositions !", message: "Tu maîtrises parfaitement les décompositions additives !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les décompositions ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Les décompositions sont importantes !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser les décompositions !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-purple-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les décompositions t'aident à bien comprendre les nombres !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors"
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