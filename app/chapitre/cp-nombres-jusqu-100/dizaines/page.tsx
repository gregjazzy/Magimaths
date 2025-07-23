'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function DizainesCP() {
  const [selectedNumber, setSelectedNumber] = useState('30');
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
      sectionId: 'dizaines',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines');
      
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

  // Nombres dizaines pour le cours
  const dizaines = [
    { value: '10', label: '10', reading: 'dix', visual: '📦', groups: 1 },
    { value: '20', label: '20', reading: 'vingt', visual: '📦📦', groups: 2 },
    { value: '30', label: '30', reading: 'trente', visual: '📦📦📦', groups: 3 },
    { value: '40', label: '40', reading: 'quarante', visual: '📦📦📦📦', groups: 4 },
    { value: '50', label: '50', reading: 'cinquante', visual: '📦📦📦📦📦', groups: 5 },
    { value: '60', label: '60', reading: 'soixante', visual: '📦📦📦📦📦📦', groups: 6 },
    { value: '70', label: '70', reading: 'soixante-dix', visual: '📦📦📦📦📦📦📦', groups: 7 },
    { value: '80', label: '80', reading: 'quatre-vingts', visual: '📦📦📦📦📦📦📦📦', groups: 8 },
    { value: '90', label: '90', reading: 'quatre-vingt-dix', visual: '📦📦📦📦📦📦📦📦📦', groups: 9 },
    { value: '100', label: '100', reading: 'cent', visual: '🏠', groups: 10 }
  ];

  // Exercices sur les dizaines - positions des bonnes réponses variées
  const exercises = [
    { question: 'Combien de groupes de 10 dans 40 ?', visual: '📦📦📦📦', correctAnswer: '4', choices: ['4', '3', '5'] },
    { question: 'Que vaut 3 groupes de 10 ?', visual: '📦📦📦', correctAnswer: '30', choices: ['40', '20', '30'] },
    { question: 'Combien de dizaines dans 70 ?', visual: '📦📦📦📦📦📦📦', correctAnswer: '7', choices: ['6', '8', '7'] },
    { question: '6 dizaines = ?', visual: '📦📦📦📦📦📦', correctAnswer: '60', choices: ['60', '50', '70'] },
    { question: 'Combien de boîtes de 10 pour faire 50 ?', visual: '📦📦📦📦📦', correctAnswer: '5', choices: ['6', '4', '5'] },
    { question: '2 dizaines = ?', visual: '📦📦', correctAnswer: '20', choices: ['10', '30', '20'] },
    { question: 'Dans 80, il y a combien de dizaines ?', visual: '📦📦📦📦📦📦📦📦', correctAnswer: '8', choices: ['8', '7', '9'] },
    { question: '9 groupes de 10 = ?', visual: '📦📦📦📦📦📦📦📦📦', correctAnswer: '90', choices: ['100', '90', '80'] },
    { question: 'Combien de dizaines dans 100 ?', visual: '🏠', correctAnswer: '10', choices: ['11', '9', '10'] },
    { question: '1 dizaine = ?', visual: '📦', correctAnswer: '10', choices: ['10', '5', '15'] }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📦 Les dizaines jusqu'à 100
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les groupes de 10 : 10, 20, 30... jusqu'à 100 !
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
            {/* Explication des dizaines */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Qu'est-ce qu'une dizaine ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-xl text-center text-gray-800 mb-4">
                  Une dizaine, c'est <strong>un groupe de 10 objets</strong> !
                </p>
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <div className="text-2xl font-bold text-green-600 mb-2">1 dizaine = 10</div>
                  <p className="text-lg text-gray-700">Cette boîte contient 10 objets !</p>
                </div>
              </div>

              {/* Visualisation 10 = 1 dizaine */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-800 text-center">
                  🔢 Regarde : 10 points = 1 boîte de 10
                </h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl mb-2 text-blue-600">● ● ● ● ●</div>
                    <div className="text-2xl mb-2 text-blue-600">● ● ● ● ●</div>
                    <div className="font-bold text-lg text-gray-800">10 points</div>
                  </div>
                  <div className="text-4xl font-bold text-green-600">=</div>
                  <div className="text-center">
                    <div className="text-6xl mb-2">📦</div>
                    <div className="font-bold text-lg text-gray-800">1 dizaine</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de dizaines */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis une dizaine à explorer
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {dizaines.map((diz) => (
                  <button
                    key={diz.value}
                    onClick={() => setSelectedNumber(diz.value)}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      selectedNumber === diz.value
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage détaillé de la dizaine sélectionnée */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                🔍 Découvrons {selectedNumber}
              </h3>
              
              {(() => {
                const selected = dizaines.find(d => d.value === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-8">
                    {/* Grande visualisation */}
                    <div className="bg-green-50 rounded-lg p-8">
                      <div className="text-8xl font-bold text-green-600 mb-6">
                        {selected.value}
                      </div>
                      
                      {/* Représentation visuelle avec boîtes */}
                      <div className="bg-white rounded-lg p-6 mb-6">
                        <h4 className="text-lg font-bold mb-4 text-gray-800">
                          📦 Regarde avec des boîtes de 10 :
                        </h4>
                        <div className="text-6xl mb-4">
                          {selected.visual}
                        </div>
                        <p className="text-xl font-bold text-gray-800">
                          {selected.groups} boîte{selected.groups > 1 ? 's' : ''} de 10 = {selected.value}
                        </p>
                      </div>

                      {/* Décomposition */}
                      <div className="bg-blue-50 rounded-lg p-6 mb-6">
                        <h4 className="text-lg font-bold mb-4 text-blue-800">
                          🧮 Décomposition :
                        </h4>
                        <div className="text-2xl font-bold text-blue-600">
                          {selected.value} = {selected.groups} × 10
                        </div>
                        <p className="text-lg text-gray-700 mt-2">
                          ({selected.groups} fois 10)
                        </p>
                      </div>

                      {/* Lecture du nombre */}
                      <div className="bg-yellow-50 rounded-lg p-6">
                        <h4 className="text-lg font-bold mb-3 text-yellow-800">
                          🗣️ Comment on le dit :
                        </h4>
                        <p className="text-3xl font-bold text-yellow-900 mb-4">
                          {selected.reading}
                        </p>
                        <button
                          onClick={() => speakText(selected.reading)}
                          className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-lg"
                        >
                          <Volume2 className="inline w-5 h-5 mr-2" />
                          Écouter
                        </button>
                      </div>
                    </div>

                    {/* Mini-jeu de comptage */}
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h4 className="text-lg font-bold mb-4 text-purple-800">
                        🎮 Compte les boîtes avec moi !
                      </h4>
                      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                        {Array.from({length: selected.groups}, (_, i) => (
                          <div key={i} className="text-4xl">📦</div>
                        ))}
                      </div>
                      <p className="text-lg text-purple-700 mt-4 font-semibold">
                        {selected.groups} boîtes × 10 = {selected.value} !
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tableau récapitulatif */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Tableau des dizaines
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-green-600 bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-green-200">
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold">Nombre de boîtes</th>
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold">Dizaine</th>
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold">Comment on dit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dizaines.slice(0, 8).map((diz) => (
                      <tr key={diz.value} className="hover:bg-green-50">
                        <td className="border-2 border-green-600 p-4 text-center text-3xl">
                          {diz.visual}
                        </td>
                        <td className="border-2 border-green-600 p-4 text-center text-2xl font-bold text-green-600">
                          {diz.value}
                        </td>
                        <td className="border-2 border-green-600 p-4 text-center text-xl font-semibold">
                          {diz.reading}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir les dizaines</h3>
              <ul className="space-y-2 text-lg">
                <li>• Une dizaine = 10 objets dans une boîte</li>
                <li>• 2 dizaines = 2 boîtes = 20</li>
                <li>• Compte les boîtes pour trouver les dizaines</li>
                <li>• 100 = 10 dizaines (une grande maison !)</li>
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
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage visuel de la question */}
              <div className="bg-green-50 rounded-lg p-2 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6">
                  {exercises[currentExercise].visual}
                </div>
              </div>
              
              {/* Choix multiples avec gros boutons */}
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
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Parfait ! C'est bien {exercises[currentExercise].correctAnswer} !
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

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert des dizaines !", message: "Tu maîtrises parfaitement les dizaines jusqu'à 100 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les dizaines ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Les dizaines sont importantes !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les dizaines !", emoji: "📚" };
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
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les dizaines t'aident à compter jusqu'à 100 !
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