'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Zap, Calculator, Clock, Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';
import { VoiceInput } from '@/components/VoiceInput';

export default function ComplementsPage() {
  const [currentSection, setCurrentSection] = useState<'cours' | 'exercices'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedType, setSelectedType] = useState<'unité' | 'dizaine' | 'centaine' | 'millier'>('unité');
  const [animatedExample, setAnimatedExample] = useState('');

  // Générer les exercices selon le type sélectionné
  const generateExercises = () => {
    const exercises = [];
    
    // Compléments à l'unité supérieure
    for (let i = 0; i < 10; i++) {
      const num = Math.floor(Math.random() * 9) + 1;
      exercises.push({
        type: 'unité',
        number: num,
        operation: `${num} + ? = 10`,
        answer: 10 - num,
        explanation: `Il faut ${10 - num} pour arriver à 10`
      });
    }
    
    // Compléments à la dizaine
    for (let i = 0; i < 10; i++) {
      const dizaine = (Math.floor(Math.random() * 9) + 1) * 10;
      const num = dizaine + Math.floor(Math.random() * 9) + 1;
      const nextDizaine = dizaine + 10;
      exercises.push({
        type: 'dizaine',
        number: num,
        operation: `${num} + ? = ${nextDizaine}`,
        answer: nextDizaine - num,
        explanation: `Il faut ${nextDizaine - num} pour arriver à ${nextDizaine}`
      });
    }
    
    // Compléments à la centaine
    for (let i = 0; i < 10; i++) {
      const centaine = (Math.floor(Math.random() * 9) + 1) * 100;
      const num = centaine + Math.floor(Math.random() * 99) + 1;
      const nextCentaine = centaine + 100;
      exercises.push({
        type: 'centaine',
        number: num,
        operation: `${num} + ? = ${nextCentaine}`,
        answer: nextCentaine - num,
        explanation: `Il faut ${nextCentaine - num} pour arriver à ${nextCentaine}`
      });
    }
    
    // Compléments au millier
    for (let i = 0; i < 10; i++) {
      const millier = (Math.floor(Math.random() * 9) + 1) * 1000;
      const num = millier + Math.floor(Math.random() * 999) + 1;
      const nextMillier = millier + 1000;
      exercises.push({
        type: 'millier',
        number: num,
        operation: `${num} + ? = ${nextMillier}`,
        answer: nextMillier - num,
        explanation: `Il faut ${nextMillier - num} pour arriver à ${nextMillier}`
      });
    }
    
    return exercises.sort(() => Math.random() - 0.5);
  };

  const [exercises, setExercises] = useState(generateExercises());

  // Animation des exemples
  useEffect(() => {
    if (currentSection === 'cours') {
      const examples = [
        '7 + 3 = 10',
        '23 + 7 = 30',
        '156 + 44 = 200',
        '2347 + 653 = 3000'
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        setAnimatedExample(examples[index]);
        index = (index + 1) % examples.length;
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [currentSection]);

  const filterExercises = () => {
    return exercises.filter(ex => ex.type === selectedType);
  };

  const getCurrentExercises = () => {
    return filterExercises();
  };

  const checkAnswer = () => {
    const currentExercises = getCurrentExercises();
    const isCorrect = parseInt(userAnswer) === currentExercises[currentExercise].answer;
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    const currentExercises = getCurrentExercises();
    if (currentExercise < currentExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const resetGame = () => {
    setCurrentExercise(0);
    setScore(0);
    setAttempts(0);
    setShowAnswer(false);
    setUserAnswer('');
    setExercises(generateExercises());
  };

  const changeType = (type: 'unité' | 'dizaine' | 'centaine' | 'millier') => {
    setSelectedType(type);
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Compléments
            </h1>
            <p className="text-lg text-gray-600">
              À l'unité supérieure, à la dizaine, à la centaine, au millier
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
            <button
              onClick={() => setCurrentSection('cours')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                currentSection === 'cours' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setCurrentSection('exercices')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                currentSection === 'exercices' 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100 hover:text-emerald-800'
              }`}
            >
              ✏️ Exercices ({score}/{attempts})
            </button>
          </div>
        </div>

        {currentSection === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Définition */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                📚 Qu'est-ce qu'un complément ?
              </h2>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-6 mb-8">
                <p className="text-lg text-green-800 font-semibold mb-4">
                  Un complément, c'est ce qu'il faut ajouter à un nombre pour atteindre un nombre "rond" !
                </p>
                <p className="text-green-700">
                  Par exemple : 7 + 3 = 10. On dit que 3 est le complément de 7 à 10.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">💡 Pourquoi c'est utile ?</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Pour calculer plus vite</li>
                    <li>• Pour vérifier ses calculs</li>
                    <li>• Pour résoudre des problèmes</li>
                    <li>• Pour comprendre les nombres</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-800 mb-4">🎯 Exemple concret</h3>
                  <p className="text-yellow-700 mb-2">
                    J'ai 23 billes, combien m'en faut-il pour avoir 30 billes ?
                  </p>
                  <p className="text-yellow-600 font-bold">
                    23 + ? = 30 → Il me faut 7 billes !
                  </p>
                </div>
              </div>
            </div>

            {/* Types de compléments */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎨 Les différents types de compléments
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Complément à l'unité */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-red-800 mb-4">1️⃣ Complément à l'unité supérieure</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">7 + 3 = 10</div>
                      <p className="text-red-700 text-sm">Complément de 7 à 10</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">8 + 2 = 10</div>
                      <p className="text-red-700 text-sm">Complément de 8 à 10</p>
                    </div>
                  </div>
                </div>

                {/* Complément à la dizaine */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-blue-800 mb-4">2️⃣ Complément à la dizaine</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">23 + 7 = 30</div>
                      <p className="text-blue-700 text-sm">Complément de 23 à 30</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">47 + 3 = 50</div>
                      <p className="text-blue-700 text-sm">Complément de 47 à 50</p>
                    </div>
                  </div>
                </div>

                {/* Complément à la centaine */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-green-800 mb-4">3️⃣ Complément à la centaine</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">156 + 44 = 200</div>
                      <p className="text-green-700 text-sm">Complément de 156 à 200</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">278 + 22 = 300</div>
                      <p className="text-green-700 text-sm">Complément de 278 à 300</p>
                    </div>
                  </div>
                </div>

                {/* Complément au millier */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-purple-800 mb-4">4️⃣ Complément au millier</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600">2347 + 653 = 3000</div>
                      <p className="text-purple-700 text-sm">Complément de 2347 à 3000</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600">1789 + 211 = 2000</div>
                      <p className="text-purple-700 text-sm">Complément de 1789 à 2000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stratégies de calcul */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Stratégies de calcul
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-yellow-800 mb-4">🎯 Méthode 1 : Compter</h4>
                  <p className="text-yellow-700 mb-3">Pour 7 + ? = 10</p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-white rounded-lg p-2 text-yellow-600 font-bold">7</div>
                    <ArrowRight className="w-4 h-4 text-yellow-600" />
                    <div className="bg-white rounded-lg p-2 text-yellow-600 font-bold">8</div>
                    <ArrowRight className="w-4 h-4 text-yellow-600" />
                    <div className="bg-white rounded-lg p-2 text-yellow-600 font-bold">9</div>
                    <ArrowRight className="w-4 h-4 text-yellow-600" />
                    <div className="bg-white rounded-lg p-2 text-yellow-600 font-bold">10</div>
                  </div>
                  <p className="text-yellow-700 mt-2">J'ai compté : 8, 9, 10 → 3 nombres</p>
                </div>

                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-800 mb-4">⚡ Méthode 2 : Soustraire</h4>
                  <p className="text-blue-700 mb-3">Pour 23 + ? = 30</p>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">30 - 23 = 7</div>
                    <p className="text-blue-700 mt-2">Plus rapide ! Je soustrais directement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">🎨 Complément en action</h3>
              <div className="text-center">
                <div className="text-3xl font-bold mb-4 animate-pulse">
                  {animatedExample}
                </div>
                <p className="text-lg">
                  Regarde comme les compléments fonctionnent !
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {getCurrentExercises().length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-green-600">
                    Score : {score}/{attempts}
                  </div>
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Sélecteur de type */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-50 rounded-xl p-3 shadow-lg border-2 border-gray-200">
                  <button
                    onClick={() => changeType('unité')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                      selectedType === 'unité' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl border-2 border-red-400 scale-105' 
                        : 'bg-gradient-to-r from-red-200 to-pink-200 text-red-800 hover:from-red-300 hover:to-pink-300 hover:text-red-900 border-2 border-red-300'
                    }`}
                  >
                    1️⃣ Unité
                  </button>
                  <button
                    onClick={() => changeType('dizaine')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      selectedType === 'dizaine' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl border-2 border-blue-400 scale-105' 
                        : 'bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-800 hover:from-blue-300 hover:to-cyan-300 hover:text-blue-900 border-2 border-blue-300'
                    }`}
                  >
                    2️⃣ Dizaine
                  </button>
                  <button
                    onClick={() => changeType('centaine')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      selectedType === 'centaine' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl border-2 border-green-400 scale-105' 
                        : 'bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 hover:from-green-300 hover:to-emerald-300 hover:text-green-900 border-2 border-green-300'
                    }`}
                  >
                    3️⃣ Centaine
                  </button>
                  <button
                    onClick={() => changeType('millier')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      selectedType === 'millier' 
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-xl border-2 border-purple-400 scale-105' 
                        : 'bg-gradient-to-r from-purple-200 to-violet-200 text-purple-800 hover:from-purple-300 hover:to-violet-300 hover:text-purple-900 border-2 border-purple-300'
                    }`}
                  >
                    4️⃣ Millier
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / getCurrentExercises().length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Trouve le complément :
              </h3>
              
              <div className="text-5xl font-bold text-green-600 mb-8">
                {getCurrentExercises()[currentExercise]?.operation}
              </div>
              
              <div className="max-w-md mx-auto mb-8">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Tape ta réponse"
                  className="w-full text-4xl font-bold text-center p-4 border-4 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer && !showAnswer) {
                      checkAnswer();
                    }
                  }}
                />
                
                {/* Reconnaissance vocale */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <VoiceInput
                    onTranscript={(transcript) => setUserAnswer(transcript)}
                    placeholder="Ou dites votre réponse à voix haute..."
                    className="justify-center"
                  />
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  ✨ Vérifier ✨
                </button>
                
                {showAnswer && (
                  <button
                    onClick={nextExercise}
                    disabled={currentExercise === getCurrentExercises().length - 1}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    Suivant →
                  </button>
                )}
              </div>
              
              {/* Résultat */}
              {showAnswer && (
                <div className={`p-6 rounded-xl shadow-lg ${
                  parseInt(userAnswer) === getCurrentExercises()[currentExercise]?.answer 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {parseInt(userAnswer) === getCurrentExercises()[currentExercise]?.answer ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">🎉 Parfait ! C'est correct ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... {getCurrentExercises()[currentExercise]?.explanation}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Résultats finaux */}
            {currentExercise === getCurrentExercises().length - 1 && showAnswer && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Fantastique !</h3>
                <p className="text-lg mb-4">
                  Tu maîtrises maintenant les compléments à la {selectedType} !
                </p>
                <p className="text-xl font-bold">
                  Score final : {score}/{attempts}
                </p>
                <p className="text-lg mt-2">
                  Taux de réussite : {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 