'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Eye, Edit } from 'lucide-react';

export default function EcritureCP() {
  const [selectedNumber, setSelectedNumber] = useState('7');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'chiffres' | 'lettres'>('chiffres');
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ecriture',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ecriture');
      
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

  // Nombres avec écriture en lettres
  const numbersWriting = [
    { chiffre: '0', lettres: 'zéro', visual: '', pronunciation: 'zéro' },
    { chiffre: '1', lettres: 'un', visual: '🔴', pronunciation: 'un' },
    { chiffre: '2', lettres: 'deux', visual: '🔴🔴', pronunciation: 'deux' },
    { chiffre: '3', lettres: 'trois', visual: '🔴🔴🔴', pronunciation: 'trois' },
    { chiffre: '4', lettres: 'quatre', visual: '🔴🔴🔴🔴', pronunciation: 'quatre' },
    { chiffre: '5', lettres: 'cinq', visual: '🔴🔴🔴🔴🔴', pronunciation: 'cinq' },
    { chiffre: '6', lettres: 'six', visual: '🔴🔴🔴🔴🔴🔴', pronunciation: 'six' },
    { chiffre: '7', lettres: 'sept', visual: '🔴🔴🔴🔴🔴🔴🔴', pronunciation: 'sept' },
    { chiffre: '8', lettres: 'huit', visual: '🔴🔴🔴🔴🔴🔴🔴🔴', pronunciation: 'huit' },
    { chiffre: '9', lettres: 'neuf', visual: '🔴🔴🔴🔴🔴🔴🔴🔴🔴', pronunciation: 'neuf' },
    { chiffre: '10', lettres: 'dix', visual: '✋✋', pronunciation: 'dix' },
    { chiffre: '11', lettres: 'onze', visual: '✋✋ + 1', pronunciation: 'onze' },
    { chiffre: '12', lettres: 'douze', visual: '✋✋ + 2', pronunciation: 'douze' },
    { chiffre: '13', lettres: 'treize', visual: '✋✋ + 3', pronunciation: 'treize' },
    { chiffre: '14', lettres: 'quatorze', visual: '✋✋ + 4', pronunciation: 'quatorze' },
    { chiffre: '15', lettres: 'quinze', visual: '✋✋✋', pronunciation: 'quinze' },
    { chiffre: '16', lettres: 'seize', visual: '✋✋✋ + 1', pronunciation: 'seize' },
    { chiffre: '17', lettres: 'dix-sept', visual: '✋✋✋ + 2', pronunciation: 'dix-sept' },
    { chiffre: '18', lettres: 'dix-huit', visual: '✋✋✋ + 3', pronunciation: 'dix-huit' },
    { chiffre: '19', lettres: 'dix-neuf', visual: '✋✋✋ + 4', pronunciation: 'dix-neuf' },
    { chiffre: '20', lettres: 'vingt', visual: '✋✋✋✋', pronunciation: 'vingt' }
  ];

  // Exercices mixtes (lecture et écriture)
  const exercises = [
    // Exercices de lecture (chiffres → lettres)
    { type: 'lecture', question: 'Comment écrit-on ce nombre en lettres ?', display: '3', correctAnswer: 'trois', choices: ['deux', 'trois', 'quatre'] },
    { type: 'lecture', question: 'Comment écrit-on ce nombre en lettres ?', display: '7', correctAnswer: 'sept', choices: ['six', 'sept', 'huit'] },
    { type: 'lecture', question: 'Comment écrit-on ce nombre en lettres ?', display: '12', correctAnswer: 'douze', choices: ['onze', 'douze', 'treize'] },
    { type: 'lecture', question: 'Comment écrit-on ce nombre en lettres ?', display: '15', correctAnswer: 'quinze', choices: ['quatorze', 'quinze', 'seize'] },
    { type: 'lecture', question: 'Comment écrit-on ce nombre en lettres ?', display: '18', correctAnswer: 'dix-huit', choices: ['dix-sept', 'dix-huit', 'dix-neuf'] },
    
    // Exercices d'écriture (lettres → chiffres)
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'cinq', correctAnswer: '5', choices: ['4', '5', '6'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'neuf', correctAnswer: '9', choices: ['8', '9', '10'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'onze', correctAnswer: '11', choices: ['10', '11', '12'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'quatorze', correctAnswer: '14', choices: ['13', '14', '15'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'dix-sept', correctAnswer: '17', choices: ['16', '17', '18'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'vingt', correctAnswer: '20', choices: ['19', '20', '21'] },
    
    // Exercices de reconnaissance visuelle
    { type: 'lecture', question: 'Combien y a-t-il de points ? Écris en lettres.', display: '🔴🔴🔴🔴🔴🔴', correctAnswer: 'six', choices: ['cinq', 'six', 'sept'] },
    
    // Exercices supplémentaires pour arriver à 15
    { type: 'lecture', question: 'Comment écrit-on ce nombre en lettres ?', display: '10', correctAnswer: 'dix', choices: ['neuf', 'dix', 'onze'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'huit', correctAnswer: '8', choices: ['7', '8', '9'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'seize', correctAnswer: '16', choices: ['15', '16', '17'] }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✏️ Lire et écrire les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à écrire les nombres en chiffres ET en lettres !
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
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
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
          <div className="space-y-8">
            {/* Explication */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Deux façons d'écrire les nombres
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800 text-center">
                    🔢 En chiffres
                  </h3>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">7</div>
                    <p className="text-lg text-blue-700">C'est rapide à écrire !</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800 text-center">
                    📝 En lettres
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">sept</div>
                    <p className="text-lg text-green-700">On peut le lire !</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <p className="text-xl text-center text-gray-800 font-semibold">
                  💡 C'est le <strong>même nombre</strong>, écrit de deux façons différentes !
                </p>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à explorer
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-6">
                {numbersWriting.slice(1, 21).map((num) => (
                  <button
                    key={num.chiffre}
                    onClick={() => setSelectedNumber(num.chiffre)}
                    className={`p-4 rounded-lg font-bold text-2xl transition-all ${
                      selectedNumber === num.chiffre
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num.chiffre}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage détaillé */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Découvrons le nombre {selectedNumber}
              </h2>
              
              {(() => {
                const selected = numbersWriting.find(n => n.chiffre === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-8">
                    {/* Affichage principal */}
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8">
                      <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* En chiffres */}
                        <div className="text-center">
                          <h3 className="text-lg font-bold mb-4 text-purple-800">
                            🔢 En chiffres
                          </h3>
                          <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="text-8xl font-bold text-purple-600">
                              {selected.chiffre}
                            </div>
                          </div>
                        </div>

                        {/* Égal */}
                        <div className="text-center">
                          <div className="text-6xl text-gray-600">=</div>
                        </div>

                        {/* En lettres */}
                        <div className="text-center">
                          <h3 className="text-lg font-bold mb-4 text-blue-800">
                            📝 En lettres
                          </h3>
                          <div className="bg-white rounded-lg p-6 shadow-md">
                            <div className="text-4xl font-bold text-blue-600">
                              {selected.lettres}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Représentation visuelle */}
                    <div className="bg-yellow-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4 text-yellow-800 text-center">
                        👀 Avec des objets :
                      </h3>
                      <div className="text-center">
                        <div className="text-4xl mb-4 tracking-wide">
                          {selected.visual}
                        </div>
                        <p className="text-lg font-semibold text-gray-700">
                          {selected.chiffre} = {selected.lettres}
                        </p>
                      </div>
                    </div>

                    {/* Prononciation */}
                    <div className="bg-green-50 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-bold mb-4 text-green-800">
                        🗣️ Comment on le dit :
                      </h3>
                      <button
                        onClick={() => speakText(selected.pronunciation)}
                        className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-xl hover:bg-green-600 transition-colors"
                      >
                        <Volume2 className="inline w-6 h-6 mr-3" />
                        {selected.pronunciation}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tableau des correspondances */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Tableau des écritures (0-20)
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-purple-600 bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-purple-200">
                      <th className="border-2 border-purple-600 p-4 text-purple-800 font-bold">En chiffres</th>
                      <th className="border-2 border-purple-600 p-4 text-purple-800 font-bold">En lettres</th>
                      <th className="border-2 border-purple-600 p-4 text-purple-800 font-bold">Audio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {numbersWriting.slice(0, 11).map((num) => (
                      <tr key={num.chiffre} className="hover:bg-purple-50">
                        <td className="border-2 border-purple-600 p-4 text-center text-3xl font-bold text-purple-600">
                          {num.chiffre}
                        </td>
                        <td className="border-2 border-purple-600 p-4 text-center text-2xl font-bold text-blue-600">
                          {num.lettres}
                        </td>
                        <td className="border-2 border-purple-600 p-4 text-center">
                          <button
                            onClick={() => speakText(num.pronunciation)}
                            className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg transition-colors"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jeu de correspondances */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎮 Jeu : Trouve les paires !
              </h2>
              
              <div className="bg-indigo-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-indigo-800 text-center">
                  Relie les nombres qui vont ensemble :
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { chiffre: '6', lettres: 'six' },
                    { chiffre: '13', lettres: 'treize' },
                    { chiffre: '8', lettres: 'huit' },
                    { chiffre: '19', lettres: 'dix-neuf' }
                  ].map((pair, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-blue-200 p-3 rounded-lg text-center font-bold text-xl">
                        {pair.chiffre}
                      </div>
                      <div className="text-center text-2xl">↕️</div>
                      <div className="bg-green-200 p-3 rounded-lg text-center font-bold text-lg">
                        {pair.lettres}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour bien lire et écrire</h3>
              <ul className="space-y-2 text-lg">
                <li>• Lis beaucoup de livres avec des nombres</li>
                <li>• Écris les nombres sur des étiquettes</li>
                <li>• Écoute attentivement la prononciation</li>
                <li>• Entraîne-toi avec des jeux de cartes</li>
                <li>• Demande à quelqu'un de te dicter des nombres</li>
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
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage de la question */}
              <div className={`rounded-lg p-8 mb-8 ${
                exercises[currentExercise].type === 'lecture' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  {exercises[currentExercise].type === 'lecture' ? (
                    <Eye className="w-8 h-8 text-blue-600 mr-3" />
                  ) : (
                    <Edit className="w-8 h-8 text-green-600 mr-3" />
                  )}
                  <span className="text-lg font-semibold text-gray-700">
                    {exercises[currentExercise].type === 'lecture' ? 'Je lis :' : 'J\'écris :'}
                  </span>
                </div>
                <div className="text-6xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].display}
                </div>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-6 rounded-lg font-bold text-2xl transition-all min-h-[80px] ${
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
                          Parfait ! C'est bien "{exercises[currentExercise].correctAnswer}" !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
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
                  if (percentage >= 90) return { title: "🎉 Champion de l'écriture !", message: "Tu sais parfaitement lire et écrire les nombres !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu maîtrises bien la lecture et l'écriture ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Continue à t'entraîner !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux apprendre à lire et écrire !", emoji: "📚" };
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
                        {finalScore >= 10 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Savoir lire et écrire les nombres, c'est essentiel !
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