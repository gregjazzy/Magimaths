'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function ReconnaissanceNombresCP() {
  const [selectedNumber, setSelectedNumber] = useState('5');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Fonction pour créer l'affichage des boules responsive
  const renderVisualDots = (visual: string, isCourse = false) => {
    // Compter le nombre de boules bleues
    const dotCount = (visual.match(/🔵/g) || []).length;
    const dots = Array(dotCount).fill('🔵');
    
    // Diviser en groupes de 5 maximum
    const groups = [];
    for (let i = 0; i < dots.length; i += 5) {
      groups.push(dots.slice(i, i + 5));
    }
    
    return (
      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex justify-center space-x-1 sm:space-x-2">
            {group.map((dot, dotIndex) => (
              <span 
                key={dotIndex} 
                className={`${isCourse ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl md:text-3xl lg:text-4xl'} text-blue-600`}
              >
                {dot}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'reconnaissance',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'reconnaissance');
      
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

  // Nombres pour le cours (adaptés CP)
  const numbers = [
    { value: '5', label: '5', reading: 'cinq', visual: '🔵🔵🔵🔵🔵' },
    { value: '8', label: '8', reading: 'huit', visual: '🔵🔵🔵🔵🔵🔵🔵🔵' },
    { value: '12', label: '12', reading: 'douze', visual: '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵' },
    { value: '17', label: '17', reading: 'dix-sept', visual: '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵' }
  ];

  // Exercices adaptés aux CP (plus simples)
  const exercises = [
    { question: 'Combien vois-tu de points ?', visual: '🔵 🔵 🔵 🔵 🔵', correctAnswer: '5', choices: ['4', '5', '6'] },
    { question: 'Compte les ballons', visual: '🎈🎈🎈🎈🎈🎈🎈', correctAnswer: '7', choices: ['6', '7', '8'] },
    { question: 'Combien y a-t-il d\'objets ?', visual: '🍎🍎🍎', correctAnswer: '3', choices: ['2', '3', '4'] },
    { question: 'Compte les fleurs', visual: '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸', correctAnswer: '10', choices: ['9', '10', '11'] },
    { question: 'Compte les cœurs', visual: '❤️❤️❤️❤️❤️❤️', correctAnswer: '6', choices: ['5', '6', '7'] },
    { question: 'Combien de bonbons ?', visual: '🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭', correctAnswer: '14', choices: ['13', '14', '15'] },
    { question: 'Combien de doigts ?', visual: '✋✋', correctAnswer: '10', choices: ['8', '10', '12'] },
    { question: 'Compte les étoiles', visual: '⭐⭐⭐⭐⭐⭐⭐⭐⭐', correctAnswer: '9', choices: ['8', '9', '10'] },
    { question: 'Compte les voitures', visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗', correctAnswer: '18', choices: ['17', '18', '19'] },
    { question: 'Compte les points', visual: '🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵', correctAnswer: '12', choices: ['11', '12', '13'] },
    { question: 'Combien de papillons ?', visual: '🦋🦋🦋🦋🦋🦋🦋🦋', correctAnswer: '8', choices: ['7', '8', '9'] },
    { question: 'Compte les soleils', visual: '☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️', correctAnswer: '16', choices: ['15', '16', '17'] },
    { question: 'Combien de fruits ?', visual: '🍓🍓🍓🍓', correctAnswer: '4', choices: ['3', '4', '5'] },
    { question: 'Compte les diamants', visual: '💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎', correctAnswer: '20', choices: ['19', '20', '21'] },
    { question: 'Combien de chats ?', visual: '🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱', correctAnswer: '11', choices: ['10', '11', '12'] }
  ];

  const speakNumber = (text: string) => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              👁️ Reconnaître les nombres de 0 à 20
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Apprends à identifier et nommer les nombres jusqu'à 20 !
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
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
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
            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis un nombre à découvrir
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-6">
                {numbers.map((num) => (
                  <button
                    key={num.value}
                    onClick={() => setSelectedNumber(num.value)}
                    className={`p-3 sm:p-6 rounded-lg font-bold text-lg sm:text-2xl transition-all ${
                      selectedNumber === num.value
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {num.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Découvrons le nombre {selectedNumber}
              </h3>
              
              {/* Grande visualisation du nombre */}
              <div className="bg-orange-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                <div className="text-5xl sm:text-8xl font-bold text-orange-600 mb-3 sm:mb-6">
                  {selectedNumber}
                </div>
                
                {/* Représentation visuelle avec points */}
                <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                    📊 Regarde avec des points :
                  </h4>
                  <div className="py-2 sm:py-4">
                    {renderVisualDots(numbers.find(n => n.value === selectedNumber)?.visual || '', true)}
                  </div>
                </div>

                {/* Lecture du nombre */}
                <div className="bg-yellow-50 rounded-lg p-3 sm:p-6">
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-yellow-800">
                    🗣️ Comment on le dit :
                  </h4>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-900 mb-3 sm:mb-4">
                    {numbers.find(n => n.value === selectedNumber)?.reading}
                  </p>
                  <button
                    onClick={() => speakNumber(numbers.find(n => n.value === selectedNumber)?.reading || '')}
                    className="bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-base sm:text-lg"
                  >
                    <Volume2 className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Écouter
                  </button>
                </div>
              </div>

              {/* Jeu de comparaison rapide */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-6">
                <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-blue-800">
                  🎮 Mini-jeu : Compare avec tes doigts !
                </h4>
                <p className="text-sm sm:text-lg text-blue-700 mb-2 sm:mb-4">
                  Lève {selectedNumber} doigt{parseInt(selectedNumber) > 1 ? 's' : ''} et regarde si c'est pareil !
                </p>
                <div className="text-3xl sm:text-6xl text-blue-800">
                  {parseInt(selectedNumber) <= 10 ? '✋'.repeat(Math.floor(parseInt(selectedNumber) / 5)) + '🤚'.slice(0, parseInt(selectedNumber) % 5) : '✋✋ + ' + (parseInt(selectedNumber) - 10) + ' doigts'}
                </div>
              </div>
            </div>

            {/* Conseils pour les petits */}
            <div className="bg-gradient-to-r from-pink-400 to-orange-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour bien reconnaître les nombres</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• Utilise tes doigts pour compter jusqu'à 10</li>
                <li>• Les nombres jusqu'à 20, c'est 10 + encore un peu</li>
                <li>• Regarde bien la forme du chiffre</li>
                <li>• Entraîne-toi à les dire à voix haute</li>
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
              
              {/* Affichage de la question (nombre ou objets) */}
              <div className="bg-white border-2 border-orange-200 rounded-lg p-2 sm:p-3 md:p-6 mb-3 sm:mb-6">
                <div className="py-1 sm:py-2 md:py-4">
                  {exercises[currentExercise].visual.includes('🔵') ? 
                    renderVisualDots(exercises[currentExercise].visual, false) :
                    <div className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-800 tracking-wider leading-relaxed">
                      {exercises[currentExercise].visual}
                    </div>
                  }
                </div>
              </div>
              
              {/* Choix multiples avec gros boutons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-8">
                {exercises[currentExercise].choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl transition-all ${
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
                        <span className="font-bold text-xl">Bravo ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
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
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
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
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent petit CP !", message: "Tu reconnais super bien les nombres jusqu'à 20 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu fais de beaux progrès ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu apprends bien ! Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux connaître tes nombres !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
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