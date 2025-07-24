'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, ArrowUpDown, Calculator } from 'lucide-react';

export default function DoublesMotiesCP20() {
  const [selectedConcept, setSelectedConcept] = useState('double_5');
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
      sectionId: 'doubles-moities',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'doubles-moities');
      
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

  // Concepts doubles et moitiés pour le cours
  const concepts = [
    // Doubles des nombres < 10
    { id: 'double_1', type: 'double', number: 1, result: 2, visual: '🔴 + 🔴 = 🔴🔴', explanation: 'Le double de 1, c\'est 1 + 1 = 2' },
    { id: 'double_2', type: 'double', number: 2, result: 4, visual: '🔴🔴 + 🔴🔴 = 🔴🔴🔴🔴', explanation: 'Le double de 2, c\'est 2 + 2 = 4' },
    { id: 'double_3', type: 'double', number: 3, result: 6, visual: '🔴🔴🔴 + 🔴🔴🔴 = 🔴🔴🔴🔴🔴🔴', explanation: 'Le double de 3, c\'est 3 + 3 = 6' },
    { id: 'double_4', type: 'double', number: 4, result: 8, visual: '🔴🔴🔴🔴 + 🔴🔴🔴🔴 = 🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'Le double de 4, c\'est 4 + 4 = 8' },
    { id: 'double_5', type: 'double', number: 5, result: 10, visual: '🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴 = 📦', explanation: 'Le double de 5, c\'est 5 + 5 = 10' },
    { id: 'double_6', type: 'double', number: 6, result: 12, visual: '🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴 = 📦🔴🔴', explanation: 'Le double de 6, c\'est 6 + 6 = 12' },
    { id: 'double_7', type: 'double', number: 7, result: 14, visual: '🔴🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴🔴 = 📦🔴🔴🔴🔴', explanation: 'Le double de 7, c\'est 7 + 7 = 14' },
    { id: 'double_8', type: 'double', number: 8, result: 16, visual: '🔴🔴🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴🔴🔴 = 📦🔴🔴🔴🔴🔴🔴', explanation: 'Le double de 8, c\'est 8 + 8 = 16' },
    { id: 'double_9', type: 'double', number: 9, result: 18, visual: '🔴🔴🔴🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴🔴🔴🔴 = 📦🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'Le double de 9, c\'est 9 + 9 = 18' },
    
    // Moitiés des nombres pairs < 20
    { id: 'moitie_2', type: 'moitie', number: 2, result: 1, visual: '🔴🔴 ÷ 2 = 🔴', explanation: 'La moitié de 2, c\'est 2 ÷ 2 = 1' },
    { id: 'moitie_4', type: 'moitie', number: 4, result: 2, visual: '🔴🔴🔴🔴 ÷ 2 = 🔴🔴', explanation: 'La moitié de 4, c\'est 4 ÷ 2 = 2' },
    { id: 'moitie_6', type: 'moitie', number: 6, result: 3, visual: '🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴', explanation: 'La moitié de 6, c\'est 6 ÷ 2 = 3' },
    { id: 'moitie_8', type: 'moitie', number: 8, result: 4, visual: '🔴🔴🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴', explanation: 'La moitié de 8, c\'est 8 ÷ 2 = 4' },
    { id: 'moitie_10', type: 'moitie', number: 10, result: 5, visual: '📦 ÷ 2 = 🔴🔴🔴🔴🔴', explanation: 'La moitié de 10, c\'est 10 ÷ 2 = 5' },
    { id: 'moitie_12', type: 'moitie', number: 12, result: 6, visual: '📦🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 12, c\'est 12 ÷ 2 = 6' },
    { id: 'moitie_14', type: 'moitie', number: 14, result: 7, visual: '📦🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 14, c\'est 14 ÷ 2 = 7' },
    { id: 'moitie_16', type: 'moitie', number: 16, result: 8, visual: '📦🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 16, c\'est 16 ÷ 2 = 8' },
    { id: 'moitie_18', type: 'moitie', number: 18, result: 9, visual: '📦🔴🔴🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 18, c\'est 18 ÷ 2 = 9' }
  ];

  // Exercices mixtes doubles/moitiés - positions des bonnes réponses variées
  const exercises = [
    // Doubles
    { question: 'Quel est le double de 3 ?', type: 'double', number: 3, correctAnswer: '6', choices: ['6', '5', '7'] },
    { question: 'Combien fait 4 + 4 ?', type: 'double', number: 4, correctAnswer: '8', choices: ['7', '8', '9'] },
    { question: 'Quel est le double de 6 ?', type: 'double', number: 6, correctAnswer: '12', choices: ['12', '10', '14'] },
    { question: 'Combien fait 2 + 2 ?', type: 'double', number: 2, correctAnswer: '4', choices: ['3', '4', '5'] },
    { question: 'Quel est le double de 8 ?', type: 'double', number: 8, correctAnswer: '16', choices: ['16', '15', '17'] },
    { question: 'Combien fait 5 + 5 ?', type: 'double', number: 5, correctAnswer: '10', choices: ['9', '11', '10'] },
    { question: 'Quel est le double de 7 ?', type: 'double', number: 7, correctAnswer: '14', choices: ['14', '13', '15'] },
    { question: 'Combien fait 9 + 9 ?', type: 'double', number: 9, correctAnswer: '18', choices: ['17', '18', '19'] },
    { question: 'Quel est le double de 1 ?', type: 'double', number: 1, correctAnswer: '2', choices: ['2', '1', '3'] },
    
    // Moitiés
    { question: 'Quelle est la moitié de 4 ?', type: 'moitie', number: 4, correctAnswer: '2', choices: ['2', '3', '1'] },
    { question: 'Combien fait 8 ÷ 2 ?', type: 'moitie', number: 8, correctAnswer: '4', choices: ['3', '4', '5'] },
    { question: 'Quelle est la moitié de 12 ?', type: 'moitie', number: 12, correctAnswer: '6', choices: ['6', '5', '7'] },
    { question: 'Combien fait 6 ÷ 2 ?', type: 'moitie', number: 6, correctAnswer: '3', choices: ['2', '3', '4'] },
    { question: 'Quelle est la moitié de 16 ?', type: 'moitie', number: 16, correctAnswer: '8', choices: ['8', '7', '9'] },
    { question: 'Combien fait 10 ÷ 2 ?', type: 'moitie', number: 10, correctAnswer: '5', choices: ['4', '6', '5'] },
    { question: 'Quelle est la moitié de 14 ?', type: 'moitie', number: 14, correctAnswer: '7', choices: ['7', '6', '8'] },
    { question: 'Combien fait 18 ÷ 2 ?', type: 'moitie', number: 18, correctAnswer: '9', choices: ['8', '9', '10'] },
    { question: 'Quelle est la moitié de 2 ?', type: 'moitie', number: 2, correctAnswer: '1', choices: ['1', '0', '2'] },
    
    // Exercices de reconnaissance (double ou moitié ?)
    { question: '3 + 3 = 6. Quel calcul as-tu fait ?', display: '3 + 3 = 6', correctAnswer: 'Le double de 3', choices: ['Le double de 3', 'La moitié de 6', 'Le triple de 2'] },
    { question: '12 ÷ 2 = 6. Quel calcul as-tu fait ?', display: '12 ÷ 2 = 6', correctAnswer: 'La moitié de 12', choices: ['Le double de 6', 'La moitié de 12', 'Le quart de 24'] }
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🎯 Doubles et moitiés
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Apprends les doubles des nombres &lt; 10 et les moitiés des nombres pairs &lt; 20 !
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
                  ? 'bg-yellow-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-yellow-500 text-white shadow-md' 
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
            {/* Sélecteur de concept */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis un concept à découvrir
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {concepts.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept.id)}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                      selectedConcept === concept.id
                        ? 'bg-yellow-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {concept.type === 'double' ? `2×${concept.number}` : `${concept.number}÷2`}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du concept sélectionné */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Découvrons ce calcul
              </h3>
              
              {(() => {
                const selected = concepts.find(c => c.id === selectedConcept);
                if (!selected) return null;
                
                return (
                  <div className="bg-yellow-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                    {/* Grande opération */}
                    <div className="text-3xl sm:text-5xl lg:text-7xl font-bold text-yellow-600 mb-3 sm:mb-6">
                      {selected.type === 'double' ? (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                          <span>{selected.number}</span>
                          <span className="text-blue-600">+</span>
                          <span>{selected.number}</span>
                          <span className="text-gray-400">=</span>
                          <span className="text-green-600">{selected.result}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                          <span>{selected.number}</span>
                          <span className="text-red-600">÷</span>
                          <span>2</span>
                          <span className="text-gray-400">=</span>
                          <span className="text-green-600">{selected.result}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Représentation visuelle */}
                    <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                        👀 Regarde avec des objets :
                      </h4>
                      <div className="text-base sm:text-xl lg:text-2xl py-2 sm:py-4 leading-relaxed break-all">
                        {selected.visual}
                      </div>
                    </div>

                    {/* Explication */}
                    <div className="bg-green-50 rounded-lg p-3 sm:p-6">
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-green-800">
                        💡 Explication :
                      </h4>
                      <p className="text-base sm:text-xl font-bold text-green-900 mb-2 sm:mb-4">
                        {selected.explanation}
                      </p>
                      <button
                        onClick={() => speakText(selected.explanation)}
                        className="bg-green-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors text-sm sm:text-base"
                      >
                        <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Écouter
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tables de référence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Table des doubles */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">
                  ➕ Table des doubles
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {concepts.filter(c => c.type === 'double').map((concept) => (
                    <div key={concept.id} className="bg-blue-50 rounded-lg p-2 sm:p-3 flex justify-between items-center">
                      <span className="font-bold text-sm sm:text-base">{concept.number} + {concept.number}</span>
                      <span className="text-blue-600 font-bold text-sm sm:text-base">{concept.result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table des moitiés */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">
                  ➗ Table des moitiés
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {concepts.filter(c => c.type === 'moitie').map((concept) => (
                    <div key={concept.id} className="bg-red-50 rounded-lg p-2 sm:p-3 flex justify-between items-center">
                      <span className="font-bold text-sm sm:text-base">{concept.number} ÷ 2</span>
                      <span className="text-red-600 font-bold text-sm sm:text-base">{concept.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• <strong>Double :</strong> c'est ajouter le nombre à lui-même (3 + 3)</li>
                <li>• <strong>Moitié :</strong> c'est partager en 2 parts égales (8 ÷ 2)</li>
                <li>• Double et moitié sont inverses : double de 4 = 8, moitié de 8 = 4</li>
                <li>• Apprends par cœur : 5 + 5 = 10, et 10 ÷ 2 = 5 !</li>
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
                  className="bg-yellow-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-yellow-600">
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
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                {exercises[currentExercise].display ? (
                  <>
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-yellow-600 mb-2 sm:mb-3 md:mb-4">
                      {exercises[currentExercise].display}
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">
                      Dis-moi quel type de calcul c'est !
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                      {exercises[currentExercise].type === 'double' ? (
                        <Calculator className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 mr-2 sm:mr-3" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-red-600 mr-2 sm:mr-3" />
                      )}
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                        {exercises[currentExercise].type === 'double' ? 'Calcul de double' : 'Calcul de moitié'}
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-yellow-600 mb-2 sm:mb-3 md:mb-4">
                      {exercises[currentExercise].type === 'double' ? (
                        <>{exercises[currentExercise].number} + {exercises[currentExercise].number} = ?</>
                      ) : (
                        <>{exercises[currentExercise].number} ÷ 2 = ?</>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {/* Choix multiples */}
              <div className={`grid gap-2 sm:gap-3 md:gap-4 mx-auto mb-4 sm:mb-6 md:mb-8 ${
                exercises[currentExercise].display 
                  ? 'grid-cols-1 max-w-sm sm:max-w-md' 
                  : 'grid-cols-1 md:grid-cols-3 max-w-sm sm:max-w-md'
              }`}>
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold transition-all ${
                      exercises[currentExercise].display 
                        ? 'text-base sm:text-lg md:text-xl min-h-[60px] sm:min-h-[70px]'
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
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-50'
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
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">Parfait ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
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
                  
                  {/* Illustration de la solution quand c'est faux */}
                  {!isCorrect && !exercises[currentExercise].display && (
                    <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-blue-300">
                      <h4 className="text-base sm:text-lg font-bold mb-3 text-blue-800 text-center">
                        🎯 Regarde la solution avec des objets !
                      </h4>
                      
                      {exercises[currentExercise].type === 'double' ? (
                        <div className="space-y-4">
                          {/* Explication du double */}
                          <div className="text-center">
                            <p className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                              Pour trouver le double de {exercises[currentExercise].number}, on fait :
                            </p>
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
                              {exercises[currentExercise].number} + {exercises[currentExercise].number} = {exercises[currentExercise].correctAnswer}
                            </div>
                          </div>
                          
                          {/* Représentation visuelle avec animation */}
                          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                            <div className="text-center text-sm sm:text-base font-semibold text-gray-700">
                              Avec des objets colorés :
                            </div>
                            
                            <div className="flex items-center justify-center space-x-4 text-2xl sm:text-3xl">
                              {/* Premier groupe */}
                              <div className="animate-pulse">
                                {'🔴'.repeat(Math.min(exercises[currentExercise].number, 5))}
                                {exercises[currentExercise].number > 5 && (
                                  <div>{'🔴'.repeat(exercises[currentExercise].number - 5)}</div>
                                )}
                              </div>
                              
                              <span className="text-blue-600 font-bold text-xl sm:text-2xl">+</span>
                              
                              {/* Deuxième groupe */}
                              <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>
                                {'🔵'.repeat(Math.min(exercises[currentExercise].number, 5))}
                                {exercises[currentExercise].number > 5 && (
                                  <div>{'🔵'.repeat(exercises[currentExercise].number - 5)}</div>
                                )}
                              </div>
                              
                              <span className="text-gray-500 font-bold text-xl sm:text-2xl">=</span>
                              
                              {/* Résultat */}
                              <div className="animate-bounce" style={{ animationDelay: '1s' }}>
                                <span className="bg-green-200 px-3 py-1 rounded-full font-bold text-green-800 text-xl sm:text-2xl">
                                  {exercises[currentExercise].correctAnswer}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-center text-xs sm:text-sm text-gray-600 mt-2">
                              {exercises[currentExercise].number} objets rouges + {exercises[currentExercise].number} objets bleus = {exercises[currentExercise].correctAnswer} objets en tout !
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Explication de la moitié */}
                          <div className="text-center">
                            <p className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                              Pour trouver la moitié de {exercises[currentExercise].number}, on partage en 2 :
                            </p>
                            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">
                              {exercises[currentExercise].number} ÷ 2 = {exercises[currentExercise].correctAnswer}
                            </div>
                          </div>
                          
                          {/* Représentation visuelle avec animation */}
                          <div className="bg-red-50 rounded-lg p-4 space-y-3">
                            <div className="text-center text-sm sm:text-base font-semibold text-gray-700">
                              Partage en 2 groupes égaux :
                            </div>
                            
                            <div className="space-y-3">
                              {/* Nombre initial */}
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Au départ : {exercises[currentExercise].number} objets</div>
                                <div className="text-2xl animate-pulse">
                                  {'🟡'.repeat(Math.min(exercises[currentExercise].number, 10))}
                                  {exercises[currentExercise].number > 10 && (
                                    <div>{'🟡'.repeat(exercises[currentExercise].number - 10)}</div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Flèche de séparation */}
                              <div className="text-center">
                                <div className="text-2xl animate-bounce">⬇️</div>
                                <div className="text-sm text-gray-600">On partage en 2</div>
                              </div>
                              
                              {/* Deux groupes */}
                              <div className="flex justify-center items-center space-x-8">
                                <div className="text-center">
                                  <div className="text-sm text-gray-600 mb-2">Groupe 1</div>
                                  <div className="bg-green-100 rounded-lg p-3 animate-pulse" style={{ animationDelay: '0.5s' }}>
                                    <div className="text-xl">
                                      {'🔴'.repeat(parseInt(exercises[currentExercise].correctAnswer))}
                                    </div>
                                    <div className="text-sm font-bold text-green-800 mt-1">
                                      {exercises[currentExercise].correctAnswer}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-center">
                                  <div className="text-sm text-gray-600 mb-2">Groupe 2</div>
                                  <div className="bg-blue-100 rounded-lg p-3 animate-pulse" style={{ animationDelay: '1s' }}>
                                    <div className="text-xl">
                                      {'🔵'.repeat(parseInt(exercises[currentExercise].correctAnswer))}
                                    </div>
                                    <div className="text-sm font-bold text-blue-800 mt-1">
                                      {exercises[currentExercise].correctAnswer}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="bg-yellow-200 px-4 py-2 rounded-full inline-block animate-bounce" style={{ animationDelay: '1.5s' }}>
                                  <span className="font-bold text-yellow-800">
                                    Chaque groupe a {exercises[currentExercise].correctAnswer} objets !
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Bouton pour écouter le résultat */}
                      <div className="text-center mt-4 mb-4">
                        <button
                          onClick={() => {
                            const currentEx = exercises[currentExercise];
                            let explanation = `La bonne réponse était ${currentEx.correctAnswer || 'inconnue'}`;
                            
                            if (currentEx.number !== undefined && currentEx.correctAnswer) {
                              if (currentEx.type === 'double') {
                                explanation = `Le double de ${currentEx.number} est ${currentEx.correctAnswer}. ${currentEx.number} plus ${currentEx.number} égale ${currentEx.correctAnswer}.`;
                              } else if (currentEx.type === 'moitie') {
                                explanation = `La moitié de ${currentEx.number} est ${currentEx.correctAnswer}. ${currentEx.number} divisé par 2 égale ${currentEx.correctAnswer}.`;
                              }
                            }
                            
                            speakText(explanation);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm sm:text-base mr-3"
                        >
                          <Volume2 className="inline w-4 h-4 mr-2" />
                          Écouter le résultat
                        </button>
                      </div>
                      
                      {/* Message d'encouragement */}
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                        <div className="text-lg">🌟</div>
                        <p className="text-sm font-semibold text-purple-800">
                          Maintenant tu comprends ! La prochaine fois sera plus facile !
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-yellow-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-yellow-600 transition-colors"
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
                  if (percentage >= 90) return { title: "🎉 As des calculs !", message: "Tu maîtrises parfaitement doubles et moitiés !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Super calculateur !", message: "Tu progresses très bien avec les doubles et moitiés !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 Bon travail !", message: "Continue à t'entraîner avec ces calculs !", emoji: "😊" };
                  return { title: "💪 Persévère !", message: "Les doubles et moitiés demandent de l'entraînement !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6">
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-2xl sm:text-4xl mt-2">
                        {finalScore >= 18 ? '⭐⭐⭐' : finalScore >= 14 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm sm:text-base"
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