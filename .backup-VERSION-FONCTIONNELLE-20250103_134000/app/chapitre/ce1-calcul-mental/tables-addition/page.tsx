'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Brain, Star, Trophy, Play } from 'lucide-react';

export default function TablesAdditionPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [selectedTable, setSelectedTable] = useState(1);
  const [gameMode, setGameMode] = useState<'sequential' | 'random'>('sequential');
  const [exercises, setExercises] = useState<any[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Générer les exercices selon la table et le mode (12 exercices - progression graduée)
  const generateExercises = (table: number, mode: 'sequential' | 'random') => {
    const baseExercises = [];
    
    // Additions avec la table sélectionnée
    for (let i = 0; i <= 10 - table; i++) {
      baseExercises.push({
        question: `${table} + ${i}`,
        answer: (table + i).toString(),
        operands: [table, i]
      });
    }
    
    // Additions inverses
    for (let i = 0; i <= 10 - table; i++) {
      if (i !== table) { // Éviter les doublons
        baseExercises.push({
          question: `${i} + ${table}`,
          answer: (i + table).toString(),
          operands: [i, table]
        });
      }
    }
    
    // Limiter à exactement 12 exercices pour une progression graduée
    const finalExercises = baseExercises.slice(0, 12);
    
    return mode === 'random' ? finalExercises.sort(() => Math.random() - 0.5) : finalExercises;
  };

  useEffect(() => {
    const newExercises = generateExercises(selectedTable, gameMode);
    setExercises(newExercises);
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setUserAnswer('');
    setIsCorrect(null);
  }, [selectedTable, gameMode]);

  const checkAnswer = () => {
    const correct = userAnswer.trim() === exercises[currentExercise]?.answer;
    setIsCorrect(correct);
    
    let newScore = score;
    if (correct && !answeredCorrectly.has(currentExercise)) {
      newScore = score + 1;
      setScore(newScore);
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
          // Dernière question, afficher la modal
          setFinalScore(newScore);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
    // Si mauvaise réponse → afficher solution + bouton "Suivant"
    // (pas de passage automatique, l'utilisateur doit cliquer sur "Suivant")
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
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
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Modal de fin d'exercices */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            {(() => {
              const percentage = Math.round((finalScore / exercises.length) * 100);
              const getMessage = () => {
                if (percentage >= 90) return { 
                  title: "🏆 Champion des additions !", 
                  message: "Tu maîtrises parfaitement la table de " + selectedTable + " !", 
                  color: "text-green-600",
                  bgColor: "bg-green-50" 
                };
                if (percentage >= 70) return { 
                  title: "⭐ Très bon travail !", 
                  message: "Tu connais bien la table de " + selectedTable + " !", 
                  color: "text-purple-600",
                  bgColor: "bg-purple-50" 
                };
                if (percentage >= 50) return { 
                  title: "👍 En bonne voie !", 
                  message: "Continue à t'entraîner sur la table de " + selectedTable + " !", 
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-50" 
                };
                return { 
                  title: "💪 Continue tes efforts !", 
                  message: "La table de " + selectedTable + " demande plus d'entraînement.", 
                  color: "text-gray-600",
                  bgColor: "bg-gray-50" 
                };
              };
              const result = getMessage();
              return (
                <div className={`${result.bgColor} rounded-2xl p-6`}>
                  <div className="text-6xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 50 ? "😊" : "📚"}</div>
                  <h3 className={`text-2xl font-bold mb-3 ${result.color}`}>{result.title}</h3>
                  <p className={`text-lg mb-4 ${result.color}`}>{result.message}</p>
                  <p className={`text-xl font-bold mb-6 ${result.color}`}>
                    Score final : {finalScore}/{exercises.length} ({percentage}%)
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowCompletionModal(false)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        setShowCompletionModal(false);
                        resetAll();
                      }}
                      className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors"
                    >
                      Recommencer
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour au calcul mental</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              📚 Tables d'addition
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Mémorise toutes les tables d'addition !
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
            {/* Introduction */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Les tables d'addition
              </h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-lg text-purple-900 text-center mb-4">
                  Les tables d'addition sont la base du calcul mental !
                </p>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    Quand tu connais 3 + 2 = 5, tu connais aussi 2 + 3 = 5 !
                  </div>
                </div>
              </div>
            </div>

            {/* Tables visuelles */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                📊 Toutes les additions jusqu'à 10
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5].map((table) => (
                  <div key={table} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-purple-600 mb-3 text-center">
                      Table de {table}
                    </h4>
                    <div className="space-y-2">
                      {Array.from({ length: 10 - table + 1 }, (_, i) => (
                        <div key={i} className="flex justify-between items-center bg-white rounded p-2">
                          <span className="font-medium text-gray-800">{table} + {i}</span>
                          <span className="font-bold text-purple-600">= {table + i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stratégies d'apprentissage */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🧠 Comment bien apprendre ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-3">✋ Avec les doigts</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Compte sur tes doigts au début</li>
                    <li>• Lève les doigts pour chaque nombre</li>
                    <li>• Compte le total</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-3">🎵 En chanson</h4>
                  <ul className="space-y-2 text-green-700">
                    <li>• Récite les additions en rythme</li>
                    <li>• Invente une mélodie</li>
                    <li>• Répète tous les jours</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-3">🎮 En jouant</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Utilise des objets (cubes, billes)</li>
                    <li>• Joue avec un chronomètre</li>
                    <li>• Défie tes amis !</li>
                  </ul>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-bold text-pink-800 mb-3">🧩 Par étapes</h4>
                  <ul className="space-y-2 text-pink-700">
                    <li>• Commence par les additions faciles</li>
                    <li>• Ajoute un peu chaque jour</li>
                    <li>• Révise régulièrement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Astuces rapides */}
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">⚡ Astuces rapides</h3>
              <ul className="space-y-2">
                <li>• 🔄 Ajouter 0 ne change rien : 5 + 0 = 5</li>
                <li>• 🔄 L'addition est commutative : 3 + 7 = 7 + 3</li>
                <li>• 🎯 Utilise les doubles : 6 + 6 = 12</li>
                <li>• 🧮 Compte en avançant : pour 8 + 3, pars de 8 et ajoute 3</li>
                <li>• 🏆 Entraîne-toi chaque jour pour devenir un champion !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Configuration des exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-center">
                <span className="mr-2">⚙️</span> Configuration
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800">
                    📊 Choisir une table :
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(Number(e.target.value))}
                    className="w-full border-2 border-blue-300 rounded-lg px-4 py-3 text-base font-semibold bg-blue-50 text-blue-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 cursor-pointer hover:bg-blue-100"
                  >
                    {[1, 2, 3, 4, 5].map(table => (
                      <option key={table} value={table} className="bg-blue-50 text-blue-800 py-2">
                        Table de {table}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-base font-bold text-gray-800">
                    🎮 Mode de jeu :
                  </label>
                  <select
                    value={gameMode}
                    onChange={(e) => setGameMode(e.target.value as 'sequential' | 'random')}
                    className="w-full border-2 border-green-300 rounded-lg px-4 py-3 text-base font-semibold bg-green-50 text-green-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 cursor-pointer hover:bg-green-100"
                  >
                    <option value="sequential" className="bg-green-50 text-green-800 py-2">
                      Dans l'ordre
                    </option>
                    <option value="random" className="bg-green-50 text-green-800 py-2">
                      Mélangé
                    </option>
                  </select>
                </div>
              </div>
              
              {/* Indication visuelle des paramètres sélectionnés */}
              <div className="mt-6 p-4 bg-purple-100 rounded-lg border border-purple-300">
                <div className="text-center">
                  <div className="text-base font-semibold text-purple-800">
                    ✅ Configuration actuelle : <span className="font-bold">Table de {selectedTable}</span> • <span className="font-bold">{gameMode === 'sequential' ? 'Dans l\'ordre' : 'Mélangé'}</span>
                  </div>
                </div>
              </div>
            </div>

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
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {exercises.length > 0 && (
              <>
                {/* Question */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-4xl font-bold mb-8 text-center text-gray-900">
                    {exercises[currentExercise]?.question} = ?
                  </h3>
                  
                  <div className="text-center mb-8">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim() && isCorrect === null) {
                          checkAnswer();
                        }
                      }}
                      placeholder="?"
                      className="w-32 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-4"
                    />
                    
                    {/* Bouton Vérifier visible si pas encore vérifié */}
                    {isCorrect === null && userAnswer.trim() && (
                      <div className="mt-4">
                        <button
                          onClick={checkAnswer}
                          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors text-lg"
                        >
                          ✅ Vérifier
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Résultat */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      <div className="flex items-center justify-center space-x-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-bold">Parfait ! Tu connais bien tes additions ! ✨</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6" />
                            <span className="font-bold">
                              Pas encore ! {exercises[currentExercise]?.question} = {exercises[currentExercise]?.answer}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation */}
                  <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
                    <button
                      onClick={() => setUserAnswer('')}
                      className="bg-gray-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors w-full md:w-auto"
                    >
                      Effacer
                    </button>
                    <button
                      onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                      disabled={currentExercise === 0}
                      className="bg-gray-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 w-full md:w-auto"
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={() => {
                        // Si l'utilisateur a tapé une réponse mais n'a pas encore vérifié, on vérifie d'abord
                        if (userAnswer.trim() && isCorrect === null) {
                          checkAnswer();
                        } else {
                          nextExercise();
                        }
                      }}
                      disabled={!userAnswer.trim() && isCorrect === null}
                      className="bg-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 w-full md:w-auto"
                    >
                      {userAnswer.trim() && isCorrect === null ? '✅ Vérifier' : 'Suivant →'}
                    </button>
                  </div>
                </div>


              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 