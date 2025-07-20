'use client'

import { useState } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function PythagoreApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  const exercises = [
    {
      question: 'Une échelle de 5 m est posée contre un mur. Le pied de l\'échelle est à 3 m du mur. À quelle hauteur arrive l\'échelle ?',
      answer: '4',
      explanation: 'h² + 3² = 5², donc h² = 25 - 9 = 16, donc h = 4 m',
      hint: 'Utilise le théorème de Pythagore avec l\'échelle comme hypoténuse'
    },
    {
      question: 'Un terrain rectangulaire mesure 40 m × 30 m. Quelle est la longueur de sa diagonale ?',
      answer: '50',
      explanation: 'd² = 40² + 30² = 1600 + 900 = 2500, donc d = 50 m',
      hint: 'La diagonale divise le rectangle en deux triangles rectangles'
    },
    {
      question: 'Un cerf-volant vole à 60 m de hauteur. La ficelle fait 100 m. À quelle distance horizontale est-il ?',
      answer: '80',
      explanation: 'd² + 60² = 100², donc d² = 10000 - 3600 = 6400, donc d = 80 m',
      hint: 'La ficelle, la hauteur et la distance forment un triangle rectangle'
    }
    // ... autres exercices
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerNum = parseFloat(userAnswer.replace(',', '.'))
    const correctAnswerNum = parseFloat(currentEx.answer)
    
    const tolerance = Math.max(0.5, correctAnswerNum * 0.02)
    const isCorrect = Math.abs(userAnswerNum - correctAnswerNum) <= tolerance
    
    setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
    setShowAnswer(true)
    
    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowAnswer(false)
      setAnswerFeedback(null)
    }
  }

  const resetExercise = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore(0)
    setAnswerFeedback(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-pythagore" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🏗️ Applications et problèmes</h1>
                <p className="text-gray-600">Résoudre des problèmes concrets avec Pythagore</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation par onglets */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('cours')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'cours' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {activeTab === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Section 1: Types de problèmes */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">🏗️</span>
                Types de problèmes concrets
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">🪜 Échelles et hauteurs</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-purple-700">• Échelles contre un mur</p>
                    <p className="text-purple-700">• Hauteur d'arbres, bâtiments</p>
                    <p className="text-purple-700">• Rampes d'accès</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-pink-800 mb-3">📐 Distances et trajets</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-pink-700">• Diagonales de rectangles</p>
                    <p className="text-pink-700">• Trajets les plus courts</p>
                    <p className="text-pink-700">• Navigation</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-red-800 mb-3">⚾ Sports et loisirs</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-red-700">• Terrains de sport</p>
                    <p className="text-red-700">• Cerfs-volants</p>
                    <p className="text-red-700">• Courses d'orientation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Méthode de résolution */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
                <span className="bg-pink-100 p-2 rounded-lg mr-3">🔍</span>
                Méthode de résolution
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-pink-800 mb-4">Étapes à suivre</h3>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-pink-200 text-pink-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-pink-800">Identifier le triangle rectangle</h4>
                      </div>
                      <p className="text-pink-700 ml-9">Repérer l'angle droit dans la situation</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-purple-200 text-purple-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-purple-800">Nommer les côtés</h4>
                      </div>
                      <p className="text-purple-700 ml-9">Identifier l'hypoténuse et les côtés de l'angle droit</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-200 text-red-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-red-800">Appliquer Pythagore</h4>
                      </div>
                      <p className="text-red-700 ml-9">Utiliser a² + b² = c² selon ce qu'on cherche</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-pink-800 mb-4 text-center">Exemple : L'échelle</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Situation :</span>
                        <span className="ml-2">Échelle 5m, pied à 3m du mur</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Triangle :</span>
                        <span className="ml-2">mur ⊥ sol, échelle = hypoténuse</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calcul :</span>
                        <span className="ml-2">h² + 3² = 5²</span>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Réponse :</span>
                        <span className="font-bold text-pink-600 ml-2">h = 4 m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🏗️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-purple-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercise} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse (en mètres)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <VoiceInput onTranscript={(transcript) => setUserAnswer(transcript)} />
                  
                  {!showAnswer && (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 disabled:opacity-50"
                    >
                      Vérifier
                    </button>
                  )}
                </div>
              </div>
              
              {showAnswer && (
                <div className={`p-6 rounded-2xl mb-6 ${answerFeedback === 'correct' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                  <div className="flex items-center mb-4">
                    {answerFeedback === 'correct' ? 
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" /> : 
                      <XCircle className="w-6 h-6 text-red-600 mr-2" />
                    }
                    <span className={`font-bold ${answerFeedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                      {answerFeedback === 'correct' ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-700">Réponse : </span>
                      <span className="text-blue-600 font-bold">{exercises[currentExercise].answer} m</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Explication : </span>
                      <span className="text-gray-800">{exercises[currentExercise].explanation}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    if (currentExercise > 0) {
                      setCurrentExercise(currentExercise - 1)
                      setUserAnswer('')
                      setShowAnswer(false)
                      setAnswerFeedback(null)
                    }
                  }}
                  disabled={currentExercise === 0}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  ← Précédent
                </button>
                
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 