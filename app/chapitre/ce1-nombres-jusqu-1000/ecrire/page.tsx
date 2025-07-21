'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

export default function EcrireNombresCE1Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const examples = [
    { written: 'Cent vingt-trois', number: '123' },
    { written: 'Deux cent quarante-cinq', number: '245' },
    { written: 'Trois cent soixante-sept', number: '367' },
    { written: 'Quatre cent quatre-vingt-neuf', number: '489' },
    { written: 'Cinq cent douze', number: '512' },
    { written: 'Six cent trente-quatre', number: '634' },
    { written: 'Sept cent cinquante-six', number: '756' },
    { written: 'Huit cent soixante-dix-huit', number: '878' },
    { written: 'Neuf cent quatre-vingt-dix', number: '990' },
    { written: 'Mille', number: '1000' }
  ];

  const exercises = [
    { written: 'Cent quarante-cinq', number: '145', hint: 'Cent = 1 centaine, quarante = 4 dizaines, cinq = 5 unités' },
    { written: 'Deux cent soixante-sept', number: '267', hint: 'Deux cent = 2 centaines, soixante = 6 dizaines, sept = 7 unités' },
    { written: 'Trois cent quatre-vingt-neuf', number: '389', hint: 'Trois cent = 3 centaines, quatre-vingt = 8 dizaines, neuf = 9 unités' },
    { written: 'Quatre cent douze', number: '412', hint: 'Quatre cent = 4 centaines, douze = 1 dizaine et 2 unités' },
    { written: 'Cinq cent trente-quatre', number: '534', hint: 'Cinq cent = 5 centaines, trente = 3 dizaines, quatre = 4 unités' },
    { written: 'Six cent cinquante-huit', number: '658', hint: 'Six cent = 6 centaines, cinquante = 5 dizaines, huit = 8 unités' },
    { written: 'Sept cent vingt-trois', number: '723', hint: 'Sept cent = 7 centaines, vingt = 2 dizaines, trois = 3 unités' },
    { written: 'Huit cent quarante-six', number: '846', hint: 'Huit cent = 8 centaines, quarante = 4 dizaines, six = 6 unités' },
    { written: 'Neuf cent sept', number: '907', hint: 'Neuf cent = 9 centaines, zéro dizaine, sept = 7 unités' },
    { written: 'Trois cent cinquante', number: '350', hint: 'Trois cent = 3 centaines, cinquante = 5 dizaines, zéro unité' },
    { written: 'Quatre cents', number: '400', hint: 'Quatre cents = 4 centaines exactes' },
    { written: 'Cinq cent un', number: '501', hint: 'Cinq cent = 5 centaines, zéro dizaine, un = 1 unité' },
    { written: 'Six cent dix', number: '610', hint: 'Six cent = 6 centaines, dix = 1 dizaine, zéro unité' },
    { written: 'Sept cent vingt', number: '720', hint: 'Sept cent = 7 centaines, vingt = 2 dizaines, zéro unité' },
    { written: 'Huit cent quatre-vingts', number: '880', hint: 'Huit cent = 8 centaines, quatre-vingts = 8 dizaines' },
    { written: 'Neuf cent quatre-vingt-dix-neuf', number: '999', hint: 'Le plus grand nombre à 3 chiffres !' },
    { written: 'Mille', number: '1000', hint: 'Le premier nombre à 4 chiffres : 1 suivi de 3 zéros' },
    { written: 'Quatre-vingt-dix', number: '90', hint: 'Quatre-vingts + dix = 90' },
    { written: 'Soixante-quinze', number: '75', hint: 'Soixante + quinze = 75' },
    { written: 'Quatre-vingt-cinq', number: '85', hint: 'Quatre-vingts + cinq = 85' }
  ];

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      const correct = userAnswer.trim() === exercises[currentExercise].number;
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
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setIsCorrect(null);
            setShowHint(false);
          } else {
            // Dernier exercice terminé, afficher la modale
            setFinalScore(score + (!answeredCorrectly.has(currentExercise) ? 1 : 0));
            setShowCompletionModal(true);
          }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
        setShowHint(false);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
      }
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
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✏️ Apprendre à écrire les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Transforme les mots en chiffres jusqu'à 1000 !
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
            {/* Règles de base */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📝 Les règles pour écrire un nombre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">1️⃣</div>
                  <h3 className="font-bold text-green-800 mb-2">Les centaines</h3>
                  <p className="text-green-700">Cent, deux cent, trois cent...</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">2️⃣</div>
                  <h3 className="font-bold text-blue-800 mb-2">Les dizaines</h3>
                  <p className="text-blue-700">Vingt, trente, quarante...</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">3️⃣</div>
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
                      <div className="text-2xl font-bold text-green-600">
                        {example.number}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour réussir</h3>
              <ul className="space-y-2">
                <li>• Écoute bien chaque partie du nombre</li>
                <li>• Commence par les centaines (100, 200, 300...)</li>
                <li>• Puis ajoute les dizaines (20, 30, 40...)</li>
                <li>• Et enfin les unités (1, 2, 3...)</li>
                <li>• "Mille" s'écrit 1000</li>
              </ul>
            </div>

            {/* Tableau de référence */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-center mb-6 text-gray-900">
                📊 Tableau de référence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-green-600 mb-3">Centaines</h4>
                  <div className="space-y-1 text-sm text-gray-800">
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
                  <h4 className="font-bold text-blue-600 mb-3">Dizaines</h4>
                  <div className="space-y-1 text-sm text-gray-800">
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
                  <div className="space-y-1 text-sm text-gray-800">
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
                  <div className="text-lg font-bold text-green-600">
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
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
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
                <div className="text-3xl font-bold text-blue-900 mb-4">
                  {exercises[currentExercise].written}
                </div>
              </div>
              
              <div className="max-w-md mx-auto mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Écris le nombre en chiffres..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:border-green-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
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
                  onClick={handleNext}
                  disabled={!userAnswer.trim() && isCorrect === null}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>


          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent !", message: "Tu maîtrises parfaitement l'écriture des nombres jusqu'à 1000 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Bien joué !", message: "Tu sais bien écrire les nombres ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue à t'entraîner !", message: "Recommence les exercices pour mieux maîtriser l'écriture des nombres.", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score final : {finalScore}/{exercises.length} ({percentage}%)
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
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