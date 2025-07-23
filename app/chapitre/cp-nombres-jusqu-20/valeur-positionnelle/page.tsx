'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Package, Dot } from 'lucide-react';

// Styles CSS pour les animations personnalisées
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }
`;

export default function ValeurPositionnelleCP20() {
  const [selectedNumber, setSelectedNumber] = useState('17');
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
      sectionId: 'valeur-positionnelle',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'valeur-positionnelle');
      
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

  // Nombres avec décomposition unités/dizaines pour CP (10-20)
  const numbersDecomposition = [
    { number: '10', dizaines: 1, unites: 0, visual: '🔟 • ', explanation: '1 dizaine + 0 unité' },
    { number: '11', dizaines: 1, unites: 1, visual: '🔟 🔴', explanation: '1 dizaine + 1 unité' },
    { number: '12', dizaines: 1, unites: 2, visual: '🔟 🔴🔴', explanation: '1 dizaine + 2 unités' },
    { number: '13', dizaines: 1, unites: 3, visual: '🔟 🔴🔴🔴', explanation: '1 dizaine + 3 unités' },
    { number: '14', dizaines: 1, unites: 4, visual: '🔟 🔴🔴🔴🔴', explanation: '1 dizaine + 4 unités' },
    { number: '15', dizaines: 1, unites: 5, visual: '🔟 🔴🔴🔴🔴🔴', explanation: '1 dizaine + 5 unités' },
    { number: '16', dizaines: 1, unites: 6, visual: '🔟 🔴🔴🔴🔴🔴🔴', explanation: '1 dizaine + 6 unités' },
    { number: '17', dizaines: 1, unites: 7, visual: '🔟 🔴🔴🔴🔴🔴🔴🔴', explanation: '1 dizaine + 7 unités' },
    { number: '18', dizaines: 1, unites: 8, visual: '🔟 🔴🔴🔴🔴🔴🔴🔴🔴', explanation: '1 dizaine + 8 unités' },
    { number: '19', dizaines: 1, unites: 9, visual: '🔟 🔴🔴🔴🔴🔴🔴🔴🔴🔴', explanation: '1 dizaine + 9 unités' },
    { number: '20', dizaines: 2, unites: 0, visual: '🔟🔟 • ', explanation: '2 dizaines + 0 unité' }
  ];

  // Exercices sur les dizaines et unités - positions des bonnes réponses variées
  const exercises = [
    { question: 'Dans 13, combien y a-t-il de dizaines ?', number: '13', type: 'dizaines', correctAnswer: '1', choices: ['1', '3', '0'] },
    { question: 'Dans 17, combien y a-t-il d\'unités ?', number: '17', type: 'unites', correctAnswer: '7', choices: ['1', '7', '17'] },
    { question: 'Dans 15, le chiffre des unités est ?', number: '15', type: 'unites', correctAnswer: '5', choices: ['5', '1', '15'] },
    { question: 'Dans 19, combien de dizaines ?', number: '19', type: 'dizaines', correctAnswer: '1', choices: ['9', '1', '19'] },
    { question: 'Dans 11, combien d\'unités ?', number: '11', type: 'unites', correctAnswer: '1', choices: ['1', '11', '2'] },
    { question: 'Dans 14, le chiffre des dizaines est ?', number: '14', type: 'dizaines', correctAnswer: '1', choices: ['1', '4', '14'] },
    { question: 'Dans 18, combien y a-t-il d\'unités ?', number: '18', type: 'unites', correctAnswer: '8', choices: ['18', '8', '1'] },
    { question: 'Dans 16, combien de dizaines ?', number: '16', type: 'dizaines', correctAnswer: '1', choices: ['6', '16', '1'] },
    { question: 'Dans 12, le chiffre des unités est ?', number: '12', type: 'unites', correctAnswer: '2', choices: ['2', '1', '12'] },
    { question: 'Dans 20, combien de dizaines ?', number: '20', type: 'dizaines', correctAnswer: '2', choices: ['2', '0', '20'] },
    
    // Exercices de composition
    { question: '1 dizaine + 3 unités = ?', display: '📦 + 🔴🔴🔴', correctAnswer: '13', choices: ['13', '4', '31'] },
    { question: '1 dizaine + 7 unités = ?', display: '📦 + 🔴🔴🔴🔴🔴🔴🔴', correctAnswer: '17', choices: ['8', '17', '71'] },
    { question: '1 dizaine + 5 unités = ?', display: '📦 + 🔴🔴🔴🔴🔴', correctAnswer: '15', choices: ['15', '6', '51'] },
    { question: '2 dizaines + 0 unité = ?', display: '📦📦 + •', correctAnswer: '20', choices: ['2', '20', '02'] },
    { question: '1 dizaine + 9 unités = ?', display: '📦 + 🔴🔴🔴🔴🔴🔴🔴🔴🔴', correctAnswer: '19', choices: ['19', '10', '91'] }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🔢 Dizaines et unités
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Comprends la différence entre unités et dizaines dans les nombres de 10 à 20 !
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
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
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
                🎯 Choisis un nombre à analyser
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {numbersDecomposition.map((num) => (
                  <button
                    key={num.number}
                    onClick={() => setSelectedNumber(num.number)}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-base sm:text-lg transition-all ${
                      selectedNumber === num.number
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {num.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Analysons le nombre {selectedNumber}
              </h3>
              
              {/* Grande visualisation du nombre */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-blue-600 mb-3 sm:mb-6 animate-pulse">
                  {selectedNumber}
                </div>
                
                {/* Tableau de valeur positionnelle animé */}
                <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6 shadow-inner">
                  <h4 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-gray-800">
                    📊 Tableau des dizaines et unités
                  </h4>
                  
                  {/* Tableau avec animation */}
                  <div className="overflow-hidden rounded-lg border-2 border-gray-300 mb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          <th className="p-3 sm:p-4 text-base sm:text-lg font-bold border-r border-white">
                            🔟 Dizaines
                          </th>
                          <th className="p-3 sm:p-4 text-base sm:text-lg font-bold">
                            🔴 Unités
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="p-4 sm:p-6 text-3xl sm:text-5xl font-bold text-green-600 border-r border-gray-300 animate-bounce">
                            {numbersDecomposition.find(n => n.number === selectedNumber)?.dizaines}
                          </td>
                          <td className="p-4 sm:p-6 text-3xl sm:text-5xl font-bold text-orange-600 animate-bounce" style={{animationDelay: '0.2s'}}>
                            {numbersDecomposition.find(n => n.number === selectedNumber)?.unites}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Explication avec animation */}
                  <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 animate-fade-in">
                    <p className="text-sm sm:text-base font-semibold text-gray-800">
                      {numbersDecomposition.find(n => n.number === selectedNumber)?.explanation}
                    </p>
                  </div>
                </div>

                {/* Représentation visuelle avec paquets */}
                <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                    🔟 Regarde avec des paquets de 10 :
                  </h4>
                  <div className="text-2xl sm:text-4xl py-2 sm:py-4 animate-pulse">
                    {numbersDecomposition.find(n => n.number === selectedNumber)?.visual}
                  </div>
                </div>

                {/* Décomposition détaillée avec animation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  <div className="bg-green-50 rounded-lg p-3 sm:p-6 transform hover:scale-105 transition-transform duration-300">
                    <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-green-800">
                      🔟 Dizaines
                    </h4>
                    <div className="text-3xl sm:text-5xl font-bold text-green-900 mb-2 animate-bounce">
                      {numbersDecomposition.find(n => n.number === selectedNumber)?.dizaines}
                    </div>
                    <p className="text-sm sm:text-base text-green-700">
                      Le chiffre de GAUCHE
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-3 sm:p-6 transform hover:scale-105 transition-transform duration-300">
                    <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-orange-800">
                      🔴 Unités
                    </h4>
                    <div className="text-3xl sm:text-5xl font-bold text-orange-900 mb-2 animate-bounce" style={{animationDelay: '0.3s'}}>
                      {numbersDecomposition.find(n => n.number === selectedNumber)?.unites}
                    </div>
                    <p className="text-sm sm:text-base text-orange-700">
                      Le chiffre de DROITE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• GAUCHE = dizaines (paquets de 10) 🔟</li>
                <li>• DROITE = unités (objets seuls) 🔴</li>
                <li>• Dans 17 : 1 paquet de 10 + 7 objets seuls</li>
                <li>• Plus tu vas à gauche, plus c'est "gros" !</li>
                <li>• Le tableau t'aide à bien voir chaque position !</li>
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
                  className="bg-blue-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-blue-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage du nombre ou de l'expression */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                {exercises[currentExercise].display ? (
                  <>
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-4">
                      {exercises[currentExercise].display}
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700">
                      Calcule le résultat !
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-6">
                      {exercises[currentExercise].number}
                    </div>
                  </>
                )}
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all ${
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
                    className="bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-blue-600 transition-colors"
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
                  if (percentage >= 90) return { title: "🎉 Excellent petit CP !", message: "Tu maîtrises parfaitement les dizaines et unités !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les unités et dizaines !", emoji: "👏" };
                                      if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue à t'entraîner avec les dizaines et unités !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Refais les exercices pour mieux comprendre !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
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
                        className="flex-1 bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm sm:text-base"
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