'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function LireNombresCE2Page() {
  const [selectedNumber, setSelectedNumber] = useState('2345');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([]);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);

  const numbers = [
    { value: '2345', label: '2 345', reading: 'Deux mille trois cent quarante-cinq' },
    { value: '1234', label: '1 234', reading: 'Mille deux cent trente-quatre' },
    { value: '5678', label: '5 678', reading: 'Cinq mille six cent soixante-dix-huit' },
    { value: '3456', label: '3 456', reading: 'Trois mille quatre cent cinquante-six' },
    { value: '7890', label: '7 890', reading: 'Sept mille huit cent quatre-vingt-dix' },
    { value: '4123', label: '4 123', reading: 'Quatre mille cent vingt-trois' },
    { value: '6789', label: '6 789', reading: 'Six mille sept cent quatre-vingt-neuf' },
    { value: '8234', label: '8 234', reading: 'Huit mille deux cent trente-quatre' },
    { value: '9456', label: '9 456', reading: 'Neuf mille quatre cent cinquante-six' },
    { value: '1000', label: '1 000', reading: 'Mille' },
    { value: '2000', label: '2 000', reading: 'Deux mille' },
    { value: '5000', label: '5 000', reading: 'Cinq mille' },
    { value: '10000', label: '10 000', reading: 'Dix mille' }
  ];

  const exercises = [
    { number: '1456', reading: 'Mille quatre cent cinquante-six' },
    { number: '2378', reading: 'Deux mille trois cent soixante-dix-huit' },
    { number: '3892', reading: 'Trois mille huit cent quatre-vingt-douze' },
    { number: '4567', reading: 'Quatre mille cinq cent soixante-sept' },
    { number: '5234', reading: 'Cinq mille deux cent trente-quatre' },
    { number: '6789', reading: 'Six mille sept cent quatre-vingt-neuf' },
    { number: '7456', reading: 'Sept mille quatre cent cinquante-six' },
    { number: '8123', reading: 'Huit mille cent vingt-trois' },
    { number: '9678', reading: 'Neuf mille six cent soixante-dix-huit' },
    { number: '1000', reading: 'Mille' },
    { number: '2000', reading: 'Deux mille' },
    { number: '3000', reading: 'Trois mille' },
    { number: '4000', reading: 'Quatre mille' },
    { number: '5000', reading: 'Cinq mille' },
    { number: '6000', reading: 'Six mille' },
    { number: '7000', reading: 'Sept mille' },
    { number: '8000', reading: 'Huit mille' },
    { number: '9000', reading: 'Neuf mille' },
    { number: '10000', reading: 'Dix mille' },
    { number: '2567', reading: 'Deux mille cinq cent soixante-sept' }
  ];

  const formatNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const speakNumber = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const animateNumber = async () => {
    setIsAnimating(true);
    
    // Animation simple pour CE2 : mettre en surbrillance chaque partie
    const digits = selectedNumber.split('');
    
    for (let i = 0; i < digits.length; i++) {
      const element = document.getElementById(`digit-${i}`);
      if (element) {
        element.classList.add('animate-bounce', 'text-teal-600', 'scale-125');
        await new Promise(resolve => setTimeout(resolve, 600));
        element.classList.remove('animate-bounce', 'text-teal-600', 'scale-125');
      }
    }
    
    setIsAnimating(false);
  };

  const checkAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === exercises[currentExercise].reading.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      const newResults = [...exerciseResults];
      newResults[currentExercise] = true;
      setExerciseResults(newResults);
    } else {
      const newResults = [...exerciseResults];
      newResults[currentExercise] = false;
      setExerciseResults(newResults);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setExerciseResults([]);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              👁️ Apprendre à lire les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Découvre comment lire tous les nombres jusqu'à 10 000 !
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
                  ? 'bg-teal-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
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
          <div className="space-y-8">
            {/* Explication de base */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🏗️ Comment construire un grand nombre ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🔟🔟🔟</div>
                  <h3 className="font-bold text-red-800">Milliers</h3>
                  <p className="text-red-700 text-sm">1 000, 2 000...</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💯</div>
                  <h3 className="font-bold text-blue-800">Centaines</h3>
                  <p className="text-blue-700 text-sm">100, 200, 300...</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🔟</div>
                  <h3 className="font-bold text-green-800">Dizaines</h3>
                  <p className="text-green-700 text-sm">10, 20, 30...</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">1️⃣</div>
                  <h3 className="font-bold text-purple-800">Unités</h3>
                  <p className="text-purple-700 text-sm">1, 2, 3...</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à découvrir
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {numbers.map((num) => (
                  <button
                    key={num.value}
                    onClick={() => setSelectedNumber(num.value)}
                    className={`p-4 rounded-lg font-bold text-xl transition-all ${
                      selectedNumber === num.value
                        ? 'bg-teal-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du nombre */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                🔍 Découvrons le nombre {formatNumber(selectedNumber)}
              </h3>
              
              {/* Nombre avec animation */}
              <div className="flex justify-center items-center space-x-2 mb-8">
                {selectedNumber.split('').map((digit, index) => (
                  <div
                    key={index}
                    id={`digit-${index}`}
                    className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center text-3xl font-bold text-teal-900 transition-all duration-300"
                  >
                    {digit}
                  </div>
                ))}
              </div>

              {/* Lecture du nombre */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold mb-3 text-yellow-800">
                  🗣️ Comment le lire :
                </h4>
                <p className="text-2xl font-bold text-yellow-900 mb-4">
                  {numbers.find(n => n.value === selectedNumber)?.reading}
                </p>
                <button
                  onClick={() => speakNumber(numbers.find(n => n.value === selectedNumber)?.reading || '')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                >
                  <Volume2 className="inline w-4 h-4 mr-2" />
                  Écouter
                </button>
              </div>

              {/* Décomposition simple */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-bold mb-3 text-green-800">
                  🧩 Décomposition :
                </h4>
                <div className="flex justify-center space-x-4 flex-wrap">
                  {selectedNumber.length >= 4 && (
                    <div className="text-center mb-2">
                      <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center text-xl font-bold text-red-900 mb-2">
                        {selectedNumber[selectedNumber.length - 4]}
                      </div>
                      <div className="text-sm font-bold text-red-800">Milliers</div>
                    </div>
                  )}
                  {selectedNumber.length >= 3 && (
                    <div className="text-center mb-2">
                      <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center text-xl font-bold text-blue-900 mb-2">
                        {selectedNumber[selectedNumber.length - 3]}
                      </div>
                      <div className="text-sm font-bold text-blue-800">Centaines</div>
                    </div>
                  )}
                  {selectedNumber.length >= 2 && (
                    <div className="text-center mb-2">
                      <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center text-xl font-bold text-green-900 mb-2">
                        {selectedNumber[selectedNumber.length - 2]}
                      </div>
                      <div className="text-sm font-bold text-green-800">Dizaines</div>
                    </div>
                  )}
                  <div className="text-center mb-2">
                    <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center text-xl font-bold text-purple-900 mb-2">
                      {selectedNumber[selectedNumber.length - 1]}
                    </div>
                    <div className="text-sm font-bold text-purple-800">Unités</div>
                  </div>
                </div>
              </div>

              {/* Bouton d'animation */}
              <button
                onClick={animateNumber}
                disabled={isAnimating}
                className="bg-teal-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
              >
                {isAnimating ? (
                  <>
                    <Pause className="inline w-5 h-5 mr-2" />
                    Animation en cours...
                  </>
                ) : (
                  <>
                    <Play className="inline w-5 h-5 mr-2" />
                    Voir l'animation
                  </>
                )}
              </button>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-cyan-400 to-teal-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour bien lire</h3>
              <ul className="space-y-2">
                <li>• Commence par les milliers (s'il y en a)</li>
                <li>• Puis les centaines</li>
                <li>• Ensuite les dizaines</li>
                <li>• Et enfin les unités</li>
                <li>• N'oublie pas de dire "mille" quand il y en a !</li>
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
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-teal-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                🤔 Comment lit-on ce nombre ?
              </h3>
              
              <div className="text-6xl font-bold text-teal-600 mb-8">
                {formatNumber(exercises[currentExercise].number)}
              </div>
              
              <div className="max-w-md mx-auto mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Écris comment tu lis ce nombre..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg focus:border-teal-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-teal-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  Vérifier
                </button>
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Effacer
                </button>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Excellent ! C'est la bonne réponse !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Pas tout à fait... La bonne réponse est : "{exercises[currentExercise].reading}"
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>

            {/* Félicitations */}
            {currentExercise === exercises.length - 1 && isCorrect !== null && (
              <div className="bg-gradient-to-r from-teal-400 to-green-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Bravo !</h3>
                <p className="text-lg">
                  Tu as terminé tous les exercices ! Tu sais maintenant lire les nombres jusqu'à 10 000 !
                </p>
                <p className="text-xl font-bold mt-4">
                  Score final : {score}/{exercises.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 