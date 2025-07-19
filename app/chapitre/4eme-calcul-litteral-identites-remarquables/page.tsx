'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Star } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '@/components/VoiceInput'

export default function IdentitesRemarquablesPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const exercises = [
    // Niveau 1 : (a + b)² - Développement
    {
      id: 'id1',
      type: 'développement',
      question: 'Développer : (x + 3)²',
      answer: 'x² + 6x + 9',
      formula: '(a + b)² = a² + 2ab + b²',
      steps: [
        'Appliquer la formule (a + b)² = a² + 2ab + b²',
        'Ici : a = x et b = 3',
        '(x + 3)² = x² + 2×x×3 + 3²',
        '= x² + 6x + 9'
      ]
    },
    {
      id: 'id2',
      type: 'développement',
      question: 'Développer : (2a + 1)²',
      answer: '4a² + 4a + 1',
      formula: '(a + b)² = a² + 2ab + b²',
      steps: [
        'Appliquer la formule (a + b)² = a² + 2ab + b²',
        'Ici : a = 2a et b = 1',
        '(2a + 1)² = (2a)² + 2×(2a)×1 + 1²',
        '= 4a² + 4a + 1'
      ]
    },
    {
      id: 'id3',
      type: 'développement',
      question: 'Développer : (y + 5)²',
      answer: 'y² + 10y + 25',
      formula: '(a + b)² = a² + 2ab + b²',
      steps: [
        'Appliquer la formule (a + b)² = a² + 2ab + b²',
        'Ici : a = y et b = 5',
        '(y + 5)² = y² + 2×y×5 + 5²',
        '= y² + 10y + 25'
      ]
    },
    
    // Niveau 2 : (a - b)² - Développement
    {
      id: 'id4',
      type: 'développement',
      question: 'Développer : (x - 4)²',
      answer: 'x² - 8x + 16',
      formula: '(a - b)² = a² - 2ab + b²',
      steps: [
        'Appliquer la formule (a - b)² = a² - 2ab + b²',
        'Ici : a = x et b = 4',
        '(x - 4)² = x² - 2×x×4 + 4²',
        '= x² - 8x + 16'
      ]
    },
    {
      id: 'id5',
      type: 'développement',
      question: 'Développer : (3b - 2)²',
      answer: '9b² - 12b + 4',
      formula: '(a - b)² = a² - 2ab + b²',
      steps: [
        'Appliquer la formule (a - b)² = a² - 2ab + b²',
        'Ici : a = 3b et b = 2',
        '(3b - 2)² = (3b)² - 2×(3b)×2 + 2²',
        '= 9b² - 12b + 4'
      ]
    },
    
    // Niveau 3 : (a + b)(a - b) - Développement
    {
      id: 'id6',
      type: 'développement',
      question: 'Développer : (x + 3)(x - 3)',
      answer: 'x² - 9',
      formula: '(a + b)(a - b) = a² - b²',
      steps: [
        'Appliquer la formule (a + b)(a - b) = a² - b²',
        'Ici : a = x et b = 3',
        '(x + 3)(x - 3) = x² - 3²',
        '= x² - 9'
      ]
    },
    {
      id: 'id7',
      type: 'développement',
      question: 'Développer : (2y + 5)(2y - 5)',
      answer: '4y² - 25',
      formula: '(a + b)(a - b) = a² - b²',
      steps: [
        'Appliquer la formule (a + b)(a - b) = a² - b²',
        'Ici : a = 2y et b = 5',
        '(2y + 5)(2y - 5) = (2y)² - 5²',
        '= 4y² - 25'
      ]
    },
    
    // Niveau 4 : Factorisation avec identités remarquables
    {
      id: 'id8',
      type: 'factorisation',
      question: 'Factoriser : x² + 6x + 9',
      answer: '(x + 3)²',
      formula: 'a² + 2ab + b² = (a + b)²',
      steps: [
        'Reconnaître la forme a² + 2ab + b²',
        'x² + 6x + 9 = x² + 2×x×3 + 3²',
        'Donc a = x et b = 3',
        'Résultat : (x + 3)²'
      ]
    },
    {
      id: 'id9',
      type: 'factorisation',
      question: 'Factoriser : a² - 10a + 25',
      answer: '(a - 5)²',
      formula: 'a² - 2ab + b² = (a - b)²',
      steps: [
        'Reconnaître la forme a² - 2ab + b²',
        'a² - 10a + 25 = a² - 2×a×5 + 5²',
        'Donc a = a et b = 5',
        'Résultat : (a - 5)²'
      ]
    },
    {
      id: 'id10',
      type: 'factorisation',
      question: 'Factoriser : 4x² - 16',
      answer: '(2x + 4)(2x - 4)',
      formula: 'a² - b² = (a + b)(a - b)',
      steps: [
        'Reconnaître la forme a² - b²',
        '4x² - 16 = (2x)² - 4²',
        'Donc a = 2x et b = 4',
        'Résultat : (2x + 4)(2x - 4)'
      ]
    }
  ]

  const checkAnswer = () => {
    const correctAnswer = exercises[currentExercise].answer.toLowerCase().replace(/\s/g, '')
    const userAnswerClean = userAnswer.toLowerCase().replace(/\s/g, '')
    
    if (userAnswerClean === correctAnswer) {
      setScore(score + 1)
      setAnswerFeedback('correct')
    } else {
      setAnswerFeedback('incorrect')
    }
    setShowAnswer(true)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/chapitre/4eme-calcul-litteral" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                ⭐
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Identités remarquables</h1>
                <p className="text-gray-600 mt-1">Formules de développement et factorisation remarquables</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-white/50 p-1 rounded-xl border border-white/20 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('cours')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'cours'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Cours
          </button>
          <button
            onClick={() => setActiveTab('exercices')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'exercices'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Target className="w-5 h-5 mr-2" />
            Exercices ({score}/{exercises.length})
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'cours' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-3" />
              Les identités remarquables
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 Pourquoi sont-elles remarquables ?</h3>
                <p className="text-gray-700">
                  Les identités remarquables sont des formules de développement et de factorisation qui reviennent très souvent.
                  Les connaître par cœur permet de <strong>calculer plus rapidement</strong> !
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Première identité */}
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="text-lg font-bold text-green-800 mb-3">🔸 Identité n°1</h3>
                  <div className="bg-white rounded-lg p-4 border border-green-200 mb-3">
                    <p className="text-center font-mono text-lg font-bold text-green-700">
                      (a + b)² = a² + 2ab + b²
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    <strong>En mots :</strong> Le carré d'une somme
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-gray-600 text-sm"><strong>Exemple :</strong></p>
                    <p className="text-gray-600 text-sm">(x + 3)² = x² + 6x + 9</p>
                  </div>
                </div>

                {/* Deuxième identité */}
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">🔸 Identité n°2</h3>
                  <div className="bg-white rounded-lg p-4 border border-orange-200 mb-3">
                    <p className="text-center font-mono text-lg font-bold text-orange-700">
                      (a - b)² = a² - 2ab + b²
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    <strong>En mots :</strong> Le carré d'une différence
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-gray-600 text-sm"><strong>Exemple :</strong></p>
                    <p className="text-gray-600 text-sm">(x - 4)² = x² - 8x + 16</p>
                  </div>
                </div>

                {/* Troisième identité */}
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">🔸 Identité n°3</h3>
                  <div className="bg-white rounded-lg p-4 border border-purple-200 mb-3">
                    <p className="text-center font-mono text-lg font-bold text-purple-700">
                      (a+b)(a-b) = a² - b²
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    <strong>En mots :</strong> Produit remarquable
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-gray-600 text-sm"><strong>Exemple :</strong></p>
                    <p className="text-gray-600 text-sm">(x+3)(x-3) = x² - 9</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">💡 Comment les utiliser ?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">🌟 Pour développer :</h4>
                    <p className="text-gray-700 text-sm">
                      Quand tu vois (quelque chose)², utilise les formules pour développer rapidement.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-2">🎯 Pour factoriser :</h4>
                    <p className="text-gray-700 text-sm">
                      Quand tu reconnais les formes a²±2ab+b² ou a²-b², factorise avec les identités !
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <h3 className="text-xl font-bold text-red-800 mb-3">⚠️ Attention aux pièges</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">❌ <strong>Erreur fréquente :</strong> (a + b)² ≠ a² + b²</p>
                  <p className="text-gray-700">✅ <strong>Correct :</strong> (a + b)² = a² + 2ab + b²</p>
                  <p className="text-gray-600 text-sm mt-2">N'oublie jamais le terme <strong>2ab</strong> !</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exercices' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <p className="text-gray-600">
                  Type : {exercises[currentExercise].type === 'développement' ? '🌟 Développement' : '🎯 Factorisation'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetExercise}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="mb-4">
                  <div className="bg-white rounded-lg p-3 border border-blue-200 mb-3">
                    <p className="text-center font-mono text-sm font-bold text-blue-700">
                      📚 Formule : {exercises[currentExercise].formula}
                    </p>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">
                    {exercises[currentExercise].question}
                  </h3>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  {/* Éditeur mathématique */}
                  <div className="w-full max-w-md">
                    <MathEditor
                      value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="Tapez votre réponse... (ex: x² + 6x + 9)"
                      onSubmit={checkAnswer}
                      theme="blue"
                      disabled={showAnswer}
                    />
                  </div>
                
                  {/* Reconnaissance vocale */}
                  <div className="w-full max-w-md border-t border-gray-200 pt-3">
                    <VoiceInput
                      onTranscript={(transcript) => setUserAnswer(transcript)}
                      placeholder="Ou dites votre réponse à voix haute (ex: 'x carré plus six x plus neuf')..."
                      className="justify-center"
                    />
                  </div>
                
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || showAnswer}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Vérifier
                  </button>
                </div>

                {showAnswer && (
                  <div className="mt-6">
                    <div className={`flex items-center gap-3 p-4 rounded-xl ${
                      answerFeedback === 'correct' ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                    }`}>
                      {answerFeedback === 'correct' ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="text-green-800 font-medium">Excellent ! Tu maîtrises les identités remarquables !</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-600" />
                          <span className="text-red-800 font-medium">
                            Pas tout à fait. La bonne réponse est : <strong>{exercises[currentExercise].answer}</strong>
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-4 bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                      <h4 className="font-bold text-indigo-800 mb-2">📝 Solution détaillée :</h4>
                      <div className="space-y-2">
                        {exercises[currentExercise].steps.map((step, index) => (
                          <p key={index} className="text-indigo-700">
                            <strong>Étape {index + 1} :</strong> {step}
                          </p>
                        ))}
                      </div>
                    </div>

                    {currentExercise < exercises.length - 1 && (
                      <button
                        onClick={nextExercise}
                        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                      >
                        <Play className="inline w-4 h-4 mr-2" />
                        Exercice suivant
                      </button>
                    )}

                    {currentExercise === exercises.length - 1 && (
                      <div className="mt-4 p-4 bg-gold-50 rounded-xl border border-yellow-200">
                        <p className="text-yellow-800 font-medium">
                          🎉 Bravo ! Tu as terminé tous les exercices sur les identités remarquables !
                          <br />
                          Score final : {score}/{exercises.length}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 