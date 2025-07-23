'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Eye, Edit } from 'lucide-react';

export default function LectureEcritureCP100() {
  const [selectedNumber, setSelectedNumber] = useState('45');
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
      sectionId: 'lecture-ecriture',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'lecture-ecriture');
      
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

  // Nombres avec leurs écritures pour le cours CP-100
  const numbersWithWriting = [
    { chiffre: '25', lettres: 'vingt-cinq', pronunciation: 'vingt-cinq', visual: '📦📦🔴🔴🔴🔴🔴' },
    { chiffre: '34', lettres: 'trente-quatre', pronunciation: 'trente-quatre', visual: '📦📦📦🔴🔴🔴🔴' },
    { chiffre: '45', lettres: 'quarante-cinq', pronunciation: 'quarante-cinq', visual: '📦📦📦📦🔴🔴🔴🔴🔴' },
    { chiffre: '56', lettres: 'cinquante-six', pronunciation: 'cinquante-six', visual: '📦📦📦📦📦🔴🔴🔴🔴🔴🔴' },
    { chiffre: '67', lettres: 'soixante-sept', pronunciation: 'soixante-sept', visual: '📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴' },
    { chiffre: '78', lettres: 'soixante-dix-huit', pronunciation: 'soixante-dix-huit', visual: '📦📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴🔴' },
    { chiffre: '89', lettres: 'quatre-vingt-neuf', pronunciation: 'quatre-vingt-neuf', visual: '📦📦📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴🔴🔴' },
    { chiffre: '100', lettres: 'cent', pronunciation: 'cent', visual: '🏠' }
  ];

  // Exercices mixtes lecture/écriture - positions des bonnes réponses variées
  const exercises = [
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '23', correctAnswer: 'vingt-trois', choices: ['vingt-trois', 'treize', 'trente-deux'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'trente-sept', correctAnswer: '37', choices: ['73', '37', '27'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '42', correctAnswer: 'quarante-deux', choices: ['cinquante-deux', 'quarante-deux', 'trente-deux'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'cinquante-huit', correctAnswer: '58', choices: ['58', '48', '85'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '61', correctAnswer: 'soixante et un', choices: ['soixante et un', 'soixante-onze', 'seize'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'soixante-quinze', correctAnswer: '75', choices: ['65', '57', '75'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '84', correctAnswer: 'quatre-vingt-quatre', choices: ['quatre-vingt-quatre', 'quatre-vingts', 'soixante-quatorze'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'quatre-vingt-douze', correctAnswer: '92', choices: ['92', '82', '29'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '100', correctAnswer: 'cent', choices: ['mille', 'cent', 'dix'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'cent', correctAnswer: '100', choices: ['100', '10', '1000'] },
    
    // Exercices spéciaux avec 70, 80, 90
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '70', correctAnswer: 'soixante-dix', choices: ['soixante-dix', 'septante', 'soixante'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '80', correctAnswer: 'quatre-vingts', choices: ['huitante', 'quatre-vingts', 'octante'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '90', correctAnswer: 'quatre-vingt-dix', choices: ['quatre-vingt-dix', 'nonante', 'neuf-dix'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'soixante-dix', correctAnswer: '70', choices: ['60', '70', '17'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'quatre-vingts', correctAnswer: '80', choices: ['80', '40', '8'] }
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
      }, 1800);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              ✏️ Lire et écrire jusqu'à 100
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Apprends à lire et écrire tous les nombres de 21 à 100 en chiffres et en lettres !
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
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {numbersWithWriting.map((num) => (
                  <button
                    key={num.chiffre}
                    onClick={() => setSelectedNumber(num.chiffre)}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-base sm:text-lg transition-all ${
                      selectedNumber === num.chiffre
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {num.chiffre}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Découvrons le nombre {selectedNumber}
              </h3>
              
              {(() => {
                const selected = numbersWithWriting.find(n => n.chiffre === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Écriture en chiffres */}
                    <div className="bg-purple-50 rounded-lg p-3 sm:p-6">
                      <h4 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-purple-800">
                        🔢 {selected.chiffre} s'écrit :
                      </h4>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 tracking-wide">
                          {selected.visual}
                        </div>
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                          {selected.chiffre} = {selected.lettres}
                        </p>
                      </div>
                    </div>

                    {/* Représentation visuelle */}
                    <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-yellow-800 text-center">
                        👀 Avec des paquets :
                      </h3>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 md:mb-4 tracking-wide">
                          {selected.visual}
                        </div>
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                          {selected.chiffre} = {selected.lettres}
                        </p>
                      </div>
                    </div>

                    {/* Prononciation */}
                    <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 text-center">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-green-800">
                        🗣️ Comment on le dit :
                      </h3>
                      <button
                        onClick={() => speakText(selected.pronunciation)}
                        className="bg-green-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg lg:text-xl hover:bg-green-600 transition-colors"
                      >
                        <Volume2 className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                        {selected.pronunciation}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Nombres spéciaux */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">🔥 Nombres spéciaux à retenir</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">70</div>
                  <p className="font-bold text-red-800">soixante-dix</p>
                  <p className="text-sm text-red-700">60 + 10</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">80</div>
                  <p className="font-bold text-blue-800">quatre-vingts</p>
                  <p className="text-sm text-blue-700">4 × 20</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">90</div>
                  <p className="font-bold text-green-800">quatre-vingt-dix</p>
                  <p className="text-sm text-green-700">80 + 10</p>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• Les dizaines : vingt, trente, quarante, cinquante, soixante</li>
                <li>• 70 = soixante-dix (attention !)</li>
                <li>• 80 = quatre-vingts (avec un "s")</li>
                <li>• 90 = quatre-vingt-dix (sans "s")</li>
                <li>• 100 = cent (tout simple !)</li>
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
                  className="bg-purple-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-600">
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
              <div className={`rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8 ${
                exercises[currentExercise].type === 'lecture' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                  {exercises[currentExercise].type === 'lecture' ? (
                    <Eye className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 mr-2 sm:mr-3" />
                  ) : (
                    <Edit className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600 mr-2 sm:mr-3" />
                  )}
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                    {exercises[currentExercise].type === 'lecture' ? 'Je lis :' : 'J\'écris :'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                  {exercises[currentExercise].display}
                </div>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-base sm:text-lg md:text-xl lg:text-2xl transition-all min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
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
                        <span className="font-bold text-lg sm:text-xl">
                          Parfait ! C'est bien "{exercises[currentExercise].correctAnswer}" !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">
                          Pas tout à fait... C'était "{exercises[currentExercise].correctAnswer}" !
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
                    className="bg-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-purple-600 transition-colors"
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
                  if (percentage >= 90) return { title: "🎉 Excellent petit mathématicien !", message: "Tu lis et écris parfaitement jusqu'à 100 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien en lecture-écriture !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue à t'entraîner avec les grands nombres !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Les nombres jusqu'à 100, ça s'apprend petit à petit !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-purple-100 rounded-lg p-4 mb-6">
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
                        className="flex-1 bg-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors text-sm sm:text-base"
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