'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Shuffle } from 'lucide-react';
import { VoiceInput } from '@/components/VoiceInput';

export default function DecompositionNombresCE2Page() {
  const [selectedNumber, setSelectedNumber] = useState('2345');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState({ milliers: '', centaines: '', dizaines: '', unites: '' });
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const examples = [
    { number: '2345', milliers: '2', centaines: '3', dizaines: '4', unites: '5' },
    { number: '1567', milliers: '1', centaines: '5', dizaines: '6', unites: '7' },
    { number: '8234', milliers: '8', centaines: '2', dizaines: '3', unites: '4' },
    { number: '4678', milliers: '4', centaines: '6', dizaines: '7', unites: '8' },
    { number: '7123', milliers: '7', centaines: '1', dizaines: '2', unites: '3' },
    { number: '3456', milliers: '3', centaines: '4', dizaines: '5', unites: '6' },
    { number: '9890', milliers: '9', centaines: '8', dizaines: '9', unites: '0' },
    { number: '5234', milliers: '5', centaines: '2', dizaines: '3', unites: '4' },
    { number: '6789', milliers: '6', centaines: '7', dizaines: '8', unites: '9' },
    { number: '10000', milliers: '10', centaines: '0', dizaines: '0', unites: '0' }
  ];

  const exercises = [
    { number: '1456', milliers: '1', centaines: '4', dizaines: '5', unites: '6' },
    { number: '2789', milliers: '2', centaines: '7', dizaines: '8', unites: '9' },
    { number: '3123', milliers: '3', centaines: '1', dizaines: '2', unites: '3' },
    { number: '4567', milliers: '4', centaines: '5', dizaines: '6', unites: '7' },
    { number: '5890', milliers: '5', centaines: '8', dizaines: '9', unites: '0' },
    { number: '6234', milliers: '6', centaines: '2', dizaines: '3', unites: '4' },
    { number: '7678', milliers: '7', centaines: '6', dizaines: '7', unites: '8' },
    { number: '8345', milliers: '8', centaines: '3', dizaines: '4', unites: '5' },
    { number: '9012', milliers: '9', centaines: '0', dizaines: '1', unites: '2' },
    { number: '1000', milliers: '1', centaines: '0', dizaines: '0', unites: '0' },
    { number: '2500', milliers: '2', centaines: '5', dizaines: '0', unites: '0' },
    { number: '3070', milliers: '3', centaines: '0', dizaines: '7', unites: '0' },
    { number: '4008', milliers: '4', centaines: '0', dizaines: '0', unites: '8' },
    { number: '5600', milliers: '5', centaines: '6', dizaines: '0', unites: '0' },
    { number: '6050', milliers: '6', centaines: '0', dizaines: '5', unites: '0' },
    { number: '7007', milliers: '7', centaines: '0', dizaines: '0', unites: '7' },
    { number: '8900', milliers: '8', centaines: '9', dizaines: '0', unites: '0' },
    { number: '9090', milliers: '9', centaines: '0', dizaines: '9', unites: '0' },
    { number: '10000', milliers: '10', centaines: '0', dizaines: '0', unites: '0' },
    { number: '6543', milliers: '6', centaines: '5', dizaines: '4', unites: '3' }
  ];

  const decomposeNumber = (num: string) => {
    if (num === '10000') return { milliers: '10', centaines: '0', dizaines: '0', unites: '0' };
    const padded = num.padStart(4, '0');
    return {
      milliers: padded[0] === '0' ? '0' : padded[0],
      centaines: padded[1],
      dizaines: padded[2],
      unites: padded[3]
    };
  };

  const animateDecomposition = async () => {
    setIsAnimating(true);
    
    // Animation des chiffres qui se séparent
    const digits = selectedNumber.split('');
    
    for (let i = 0; i < digits.length; i++) {
      const element = document.getElementById(`demo-digit-${i}`);
      if (element) {
        element.classList.add('animate-pulse', 'scale-125', 'text-teal-600');
        await new Promise(resolve => setTimeout(resolve, 800));
        element.classList.remove('animate-pulse', 'scale-125', 'text-teal-600');
      }
    }
    
    setIsAnimating(false);
  };

  const checkAnswer = () => {
    const correct = decomposeNumber(exercises[currentExercise].number);
    const isCorrect = 
      userAnswers.milliers === correct.milliers &&
      userAnswers.centaines === correct.centaines &&
      userAnswers.dizaines === correct.dizaines &&
      userAnswers.unites === correct.unites;
    
    setIsCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswers({ milliers: '', centaines: '', dizaines: '', unites: '' });
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswers({ milliers: '', centaines: '', dizaines: '', unites: '' });
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswers({ milliers: '', centaines: '', dizaines: '', unites: '' });
    setIsCorrect(null);
    setScore(0);
  };

  const updateAnswer = (type: 'milliers' | 'centaines' | 'dizaines' | 'unites', value: string) => {
    setUserAnswers(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧩 Décomposer les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à séparer un nombre en milliers, centaines, dizaines et unités !
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
                  ? 'bg-pink-500 text-white shadow-md' 
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
            {/* Explication des positions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Les positions des chiffres
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-red-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🔟🔟🔟</div>
                  <h3 className="font-bold text-red-800 mb-2">Milliers</h3>
                  <p className="text-red-700">Le chiffre le plus à gauche</p>
                  <p className="text-red-700">Vaut × 1000</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">💯</div>
                  <h3 className="font-bold text-blue-800 mb-2">Centaines</h3>
                  <p className="text-blue-700">Le 2ème chiffre de gauche</p>
                  <p className="text-blue-700">Vaut × 100</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🔟</div>
                  <h3 className="font-bold text-green-800 mb-2">Dizaines</h3>
                  <p className="text-green-700">Le 3ème chiffre de gauche</p>
                  <p className="text-green-700">Vaut × 10</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">1️⃣</div>
                  <h3 className="font-bold text-purple-800 mb-2">Unités</h3>
                  <p className="text-purple-700">Le chiffre de droite</p>
                  <p className="text-purple-700">Vaut × 1</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre pour démonstration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à décomposer
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {examples.map((example) => (
                  <button
                    key={example.number}
                    onClick={() => setSelectedNumber(example.number)}
                    className={`p-4 rounded-lg font-bold text-xl transition-all ${
                      selectedNumber === example.number
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {example.number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Démonstration de décomposition */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔍 Décomposition du nombre {selectedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              </h3>
              
              {/* Affichage du nombre */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2">
                  {selectedNumber.split('').map((digit, index) => (
                    <div
                      key={index}
                      id={`demo-digit-${index}`}
                      className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 transition-all duration-300"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flèches et décomposition */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Milliers */}
                <div className="text-center">
                  <div className="text-2xl mb-2">⬇️</div>
                  <div className="bg-red-100 rounded-lg p-4">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {decomposeNumber(selectedNumber).milliers}
                    </div>
                    <div className="font-bold text-red-800">Milliers</div>
                    <div className="text-sm text-red-700">
                      {decomposeNumber(selectedNumber).milliers} × 1000 = {parseInt(decomposeNumber(selectedNumber).milliers) * 1000}
                    </div>
                  </div>
                </div>

                {/* Centaines */}
                <div className="text-center">
                  <div className="text-2xl mb-2">⬇️</div>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {decomposeNumber(selectedNumber).centaines}
                    </div>
                    <div className="font-bold text-blue-800">Centaines</div>
                    <div className="text-sm text-blue-700">
                      {decomposeNumber(selectedNumber).centaines} × 100 = {parseInt(decomposeNumber(selectedNumber).centaines) * 100}
                    </div>
                  </div>
                </div>

                {/* Dizaines */}
                <div className="text-center">
                  <div className="text-2xl mb-2">⬇️</div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {decomposeNumber(selectedNumber).dizaines}
                    </div>
                    <div className="font-bold text-green-800">Dizaines</div>
                    <div className="text-sm text-green-700">
                      {decomposeNumber(selectedNumber).dizaines} × 10 = {parseInt(decomposeNumber(selectedNumber).dizaines) * 10}
                    </div>
                  </div>
                </div>

                {/* Unités */}
                <div className="text-center">
                  <div className="text-2xl mb-2">⬇️</div>
                  <div className="bg-purple-100 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {decomposeNumber(selectedNumber).unites}
                    </div>
                    <div className="font-bold text-purple-800">Unités</div>
                    <div className="text-sm text-purple-700">
                      {decomposeNumber(selectedNumber).unites} × 1 = {parseInt(decomposeNumber(selectedNumber).unites)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vérification */}
              <div className="mt-8 bg-yellow-50 rounded-lg p-6 text-center">
                <h4 className="font-bold text-yellow-800 mb-2">✅ Vérification :</h4>
                <div className="text-lg text-yellow-900">
                  {parseInt(decomposeNumber(selectedNumber).milliers) * 1000} + {parseInt(decomposeNumber(selectedNumber).centaines) * 100} + {parseInt(decomposeNumber(selectedNumber).dizaines) * 10} + {parseInt(decomposeNumber(selectedNumber).unites)} = {selectedNumber}
                </div>
              </div>

              {/* Bouton d'animation */}
              <div className="text-center mt-6">
                <button
                  onClick={animateDecomposition}
                  disabled={isAnimating}
                  className="bg-purple-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  <Shuffle className="inline w-5 h-5 mr-2" />
                  {isAnimating ? 'Animation...' : 'Voir l\'animation'}
                </button>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour décomposer</h3>
              <ul className="space-y-2">
                <li>• Le premier chiffre (à gauche) = les milliers</li>
                <li>• Le deuxième chiffre = les centaines</li>
                <li>• Le troisième chiffre = les dizaines</li>
                <li>• Le quatrième chiffre (à droite) = les unités</li>
                <li>• Le zéro signifie "aucun" dans cette position</li>
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
                  <div className="text-lg font-bold text-purple-600">
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
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                🧩 Décompose ce nombre
              </h3>
              
              <div className="text-6xl font-bold text-purple-600 mb-8">
                {exercises[currentExercise].number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              </div>
              
              {/* Champs de saisie */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-8">
                <div className="text-center">
                  <label className="block font-bold text-red-600 mb-2">Milliers</label>
                  <input
                    type="text"
                    value={userAnswers.milliers}
                    onChange={(e) => updateAnswer('milliers', e.target.value)}
                    placeholder="?"
                    className="w-20 h-20 mx-auto border-2 border-red-300 rounded-lg text-center text-2xl font-bold focus:border-red-500 focus:outline-none bg-white text-gray-900"
                    maxLength={2}
                  />
                </div>
                <div className="text-center">
                  <label className="block font-bold text-blue-600 mb-2">Centaines</label>
                  <input
                    type="text"
                    value={userAnswers.centaines}
                    onChange={(e) => updateAnswer('centaines', e.target.value)}
                    placeholder="?"
                    className="w-20 h-20 mx-auto border-2 border-blue-300 rounded-lg text-center text-2xl font-bold focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                    maxLength={1}
                  />
                </div>
                <div className="text-center">
                  <label className="block font-bold text-green-600 mb-2">Dizaines</label>
                  <input
                    type="text"
                    value={userAnswers.dizaines}
                    onChange={(e) => updateAnswer('dizaines', e.target.value)}
                    placeholder="?"
                    className="w-20 h-20 mx-auto border-2 border-green-300 rounded-lg text-center text-2xl font-bold focus:border-green-500 focus:outline-none bg-white text-gray-900"
                    maxLength={1}
                  />
                </div>
                <div className="text-center">
                  <label className="block font-bold text-purple-600 mb-2">Unités</label>
                  <input
                    type="text"
                    value={userAnswers.unites}
                    onChange={(e) => updateAnswer('unites', e.target.value)}
                    placeholder="?"
                    className="w-20 h-20 mx-auto border-2 border-purple-300 rounded-lg text-center text-2xl font-bold focus:border-purple-500 focus:outline-none bg-white text-gray-900"
                    maxLength={1}
                  />
                </div>
              </div>
              
              {/* Reconnaissance vocale pour la décomposition */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <VoiceInput
                  onTranscript={(transcript) => {
                    // Traitement spécial pour les décompositions CE2
                    console.log('Décomposition vocale CE2:', transcript);
                  }}
                  placeholder="Ou dites la décomposition à voix haute..."
                  className="justify-center"
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswers.milliers || userAnswers.centaines === '' || userAnswers.dizaines === '' || userAnswers.unites === ''}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
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
                        <span className="font-bold">Super ! Tu as bien décomposé le nombre !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Pas tout à fait... La bonne réponse est : {exercises[currentExercise].milliers} milliers, {exercises[currentExercise].centaines} centaines, {exercises[currentExercise].dizaines} dizaines, {exercises[currentExercise].unites} unités
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
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>

            {/* Félicitations */}
            {currentExercise === exercises.length - 1 && isCorrect !== null && (
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Fantastique !</h3>
                <p className="text-lg">
                  Tu sais maintenant décomposer tous les nombres jusqu'à 10 000 !
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