'use client'

import { useState } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function PythagoreCalculsInversesPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  const exercises = [
    {
      question: 'Dans un triangle rectangle, l\'hypoténuse mesure 5 et un côté 3. Que vaut l\'autre côté ?',
      answer: '4',
      explanation: 'a² + 3² = 5², donc a² = 25 - 9 = 16, donc a = 4',
      hint: 'Utilise a² = c² - b²'
    },
    {
      question: 'Triangle rectangle : hypoténuse = 13, un côté = 5. Autre côté ?',
      answer: '12',
      explanation: 'a² + 5² = 13², donc a² = 169 - 25 = 144, donc a = 12',
      hint: 'C\'est un triplet pythagoricien'
    },
    {
      question: 'Si l\'hypoténuse vaut 10 et un côté 6, que vaut l\'autre côté ?',
      answer: '8',
      explanation: 'a² + 6² = 10², donc a² = 100 - 36 = 64, donc a = 8',
      hint: 'Multiple du triplet 3-4-5'
    },
    // ... 17 autres exercices
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerNum = parseFloat(userAnswer.replace(',', '.'))
    const correctAnswerNum = parseFloat(currentEx.answer)
    
    const tolerance = Math.max(0.01, correctAnswerNum * 0.02)
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-pythagore" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🔄 Calculs inverses</h1>
                <p className="text-gray-600">Calculer un côté de l'angle droit</p>
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
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-orange-500 text-white shadow-md' 
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
            {/* Section 1: Principe du calcul inverse */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <span className="bg-orange-100 p-2 rounded-lg mr-3">🔄</span>
                Calcul inverse : principe
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-4">Méthode</h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-orange-800">Formule de base</h4>
                      <p className="text-orange-700">a² + b² = c²</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-800">Pour trouver a</h4>
                      <p className="text-yellow-700">a² = c² - b²</p>
                      <p className="text-yellow-700">a = √(c² - b²)</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800">Condition importante</h4>
                      <p className="text-red-700">c &gt; b (l'hypoténuse est toujours le côté le plus long)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-orange-800 mb-4 text-center">Exemple</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Données :</span>
                        <span className="font-bold ml-2">c = 5, b = 3</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calcul :</span>
                        <span className="font-bold ml-2">a² = 5² - 3² = 25 - 9 = 16</span>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Résultat :</span>
                        <span className="font-bold text-orange-600 ml-2">a = √16 = 4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Différence avec le calcul direct */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">⚖️</span>
                Calcul direct vs calcul inverse
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Calcul direct</h3>
                  <div className="space-y-2">
                    <p className="text-green-700"><strong>On connaît :</strong> les deux côtés de l'angle droit</p>
                    <p className="text-green-700"><strong>On cherche :</strong> l'hypoténuse</p>
                    <p className="text-green-700"><strong>Formule :</strong> c = √(a² + b²)</p>
                    <p className="text-green-700"><strong>Exemple :</strong> a = 3, b = 4 → c = 5</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">Calcul inverse</h3>
                  <div className="space-y-2">
                    <p className="text-orange-700"><strong>On connaît :</strong> l'hypoténuse et un côté</p>
                    <p className="text-orange-700"><strong>On cherche :</strong> l'autre côté de l'angle droit</p>
                    <p className="text-orange-700"><strong>Formule :</strong> a = √(c² - b²)</p>
                    <p className="text-orange-700"><strong>Exemple :</strong> c = 5, b = 3 → a = 4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES - Version simplifiée */
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🔄 Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-orange-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercise} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                  <VoiceInput onTranscript={(transcript) => setUserAnswer(transcript)} />
                  
                  {!showAnswer && (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
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
                      <span className="text-blue-600 font-bold">{exercises[currentExercise].answer}</span>
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
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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