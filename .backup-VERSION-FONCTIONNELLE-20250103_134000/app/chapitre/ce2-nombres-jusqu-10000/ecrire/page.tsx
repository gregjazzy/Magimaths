'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

export default function EcrireNombresCE2Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const examples = [
    { written: 'Mille deux cent trente-quatre', number: '1234' },
    { written: 'Deux mille cinq cent soixante-sept', number: '2567' },
    { written: 'Trois mille quatre cent quatre-vingt-neuf', number: '3489' },
    { written: 'Quatre mille cent vingt-trois', number: '4123' },
    { written: 'Cinq mille six cent soixante-dix-huit', number: '5678' },
    { written: 'Six mille trois cent quarante-cinq', number: '6345' },
    { written: 'Sept mille huit cent douze', number: '7812' },
    { written: 'Huit mille neuf cent cinquante-six', number: '8956' },
    { written: 'Neuf mille quatre cent soixante-sept', number: '9467' },
    { written: 'Dix mille', number: '10000' }
  ];

  const exercises = [
    { written: 'Mille quatre cent cinquante-six', number: '1456', hint: 'Mille = 1000, quatre cent = 400, cinquante = 50, six = 6' },
    { written: 'Deux mille trois cent soixante-dix-huit', number: '2378', hint: 'Deux mille = 2000, trois cent = 300, soixante-dix-huit = 78' },
    { written: 'Trois mille cinq cent vingt-neuf', number: '3529', hint: 'Trois mille = 3000, cinq cent = 500, vingt-neuf = 29' },
    { written: 'Quatre mille six cent quarante-deux', number: '4642', hint: 'Quatre mille = 4000, six cent = 600, quarante-deux = 42' },
    { written: 'Cinq mille sept cent quatre-vingt-treize', number: '5793', hint: 'Cinq mille = 5000, sept cent = 700, quatre-vingt-treize = 93' },
    { written: 'Six mille deux cent quinze', number: '6215', hint: 'Six mille = 6000, deux cent = 200, quinze = 15' },
    { written: 'Sept mille huit cent soixante-quatre', number: '7864', hint: 'Sept mille = 7000, huit cent = 800, soixante-quatre = 64' },
    { written: 'Huit mille trois cent cinquante-sept', number: '8357', hint: 'Huit mille = 8000, trois cent = 300, cinquante-sept = 57' },
    { written: 'Neuf mille cent vingt-huit', number: '9128', hint: 'Neuf mille = 9000, cent = 100, vingt-huit = 28' },
    { written: 'Deux mille', number: '2000', hint: 'Deux mille tout rond = 2000' },
    { written: 'Trois mille cinq cents', number: '3500', hint: 'Trois mille = 3000, cinq cents = 500' },
    { written: 'Quatre mille deux', number: '4002', hint: 'Quatre mille = 4000, deux = 2 (attention aux zéros !)' },
    { written: 'Cinq mille quarante', number: '5040', hint: 'Cinq mille = 5000, quarante = 40' },
    { written: 'Six mille cent', number: '6100', hint: 'Six mille = 6000, cent = 100' },
    { written: 'Sept mille soixante-dix', number: '7070', hint: 'Sept mille = 7000, soixante-dix = 70' },
    { written: 'Huit mille cinq', number: '8005', hint: 'Huit mille = 8000, cinq = 5' },
    { written: 'Neuf mille trois cent', number: '9300', hint: 'Neuf mille = 9000, trois cent = 300' },
    { written: 'Dix mille', number: '10000', hint: 'Le plus grand nombre qu\'on étudie !' },
    { written: 'Mille', number: '1000', hint: 'Mille tout seul = 1000' },
    { written: 'Quatre mille neuf cent quatre-vingt-dix-neuf', number: '4999', hint: 'Presque cinq mille !' }
  ];

  const checkAnswer = () => {
    const correct = userAnswer.trim() === exercises[currentExercise].number;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowHint(false);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✏️ Apprendre à écrire les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Transforme les mots en chiffres jusqu'à 10 000 !
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
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-cyan-500 text-white shadow-md' 
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
            {/* Règles de base */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📝 Les règles pour écrire un grand nombre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">🔟🔟🔟</div>
                  <h3 className="font-bold text-red-800 mb-2">Les milliers</h3>
                  <p className="text-red-700">Mille, deux mille, trois mille...</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">💯</div>
                  <h3 className="font-bold text-blue-800 mb-2">Les centaines</h3>
                  <p className="text-blue-700">Cent, deux cent, trois cent...</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">🔟</div>
                  <h3 className="font-bold text-green-800 mb-2">Les dizaines</h3>
                  <p className="text-green-700">Vingt, trente, quarante...</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">1️⃣</div>
                  <h3 className="font-bold text-purple-800 mb-2">Les unités</h3>
                  <p className="text-purple-700">Un, deux, trois...</p>
                </div>
              </div>
            </div>

            {/* Exemples interactifs */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Exemples pour comprendre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 mb-2">
                        {example.written}
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        ↓
                      </div>
                      <div className="text-2xl font-bold text-teal-600">
                        {example.number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour réussir</h3>
              <ul className="space-y-2">
                <li>• Écoute bien chaque partie du nombre</li>
                <li>• Commence par les milliers (1000, 2000, 3000...)</li>
                <li>• Puis ajoute les centaines (100, 200, 300...)</li>
                <li>• Ensuite les dizaines (10, 20, 30...)</li>
                <li>• Et enfin les unités (1, 2, 3...)</li>
                <li>• Attention aux zéros cachés !</li>
              </ul>
            </div>

            {/* Tableau de référence */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-center mb-6 text-gray-900">
                📊 Tableau de référence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-bold text-red-600 mb-3">Milliers</h4>
                  <div className="space-y-1 text-sm">
                    <div>Mille = 1000</div>
                    <div>Deux mille = 2000</div>
                    <div>Trois mille = 3000</div>
                    <div>Quatre mille = 4000</div>
                    <div>Cinq mille = 5000</div>
                    <div>Six mille = 6000</div>
                    <div>Sept mille = 7000</div>
                    <div>Huit mille = 8000</div>
                    <div>Neuf mille = 9000</div>
                    <div>Dix mille = 10000</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 mb-3">Centaines</h4>
                  <div className="space-y-1 text-sm">
                    <div>Cent = 100</div>
                    <div>Deux cent = 200</div>
                    <div>Trois cent = 300</div>
                    <div>Quatre cent = 400</div>
                    <div>Cinq cent = 500</div>
                    <div>Six cent = 600</div>
                    <div>Sept cent = 700</div>
                    <div>Huit cent = 800</div>
                    <div>Neuf cent = 900</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-green-600 mb-3">Dizaines</h4>
                  <div className="space-y-1 text-sm">
                    <div>Dix = 10</div>
                    <div>Vingt = 20</div>
                    <div>Trente = 30</div>
                    <div>Quarante = 40</div>
                    <div>Cinquante = 50</div>
                    <div>Soixante = 60</div>
                    <div>Soixante-dix = 70</div>
                    <div>Quatre-vingts = 80</div>
                    <div>Quatre-vingt-dix = 90</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-purple-600 mb-3">Unités</h4>
                  <div className="space-y-1 text-sm">
                    <div>Un = 1</div>
                    <div>Deux = 2</div>
                    <div>Trois = 3</div>
                    <div>Quatre = 4</div>
                    <div>Cinq = 5</div>
                    <div>Six = 6</div>
                    <div>Sept = 7</div>
                    <div>Huit = 8</div>
                    <div>Neuf = 9</div>
                  </div>
                </div>
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
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-cyan-600">
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
                  className="bg-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                ✏️ Écris ce nombre en chiffres
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <div className="text-2xl font-bold text-blue-900 mb-4">
                  {exercises[currentExercise].written}
                </div>
              </div>
              
              <div className="max-w-md mx-auto mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Écris le nombre en chiffres..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:border-cyan-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-cyan-600 transition-colors disabled:opacity-50"
                >
                  Vérifier
                </button>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                >
                  <Lightbulb className="inline w-4 h-4 mr-2" />
                  Indice
                </button>
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Effacer
                </button>
              </div>

              {/* Indice */}
              {showHint && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-bold">{exercises[currentExercise].hint}</span>
                  </div>
                </div>
              )}
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Parfait ! Tu as trouvé {exercises[currentExercise].number} !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Pas tout à fait... La bonne réponse est : {exercises[currentExercise].number}
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
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>

            {/* Félicitations */}
            {currentExercise === exercises.length - 1 && isCorrect !== null && (
              <div className="bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Excellent travail !</h3>
                <p className="text-lg">
                  Tu sais maintenant écrire les nombres jusqu'à 10 000 en chiffres !
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