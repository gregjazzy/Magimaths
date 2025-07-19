'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '@/components/VoiceInput'

export default function FactorisationPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const exercises = [
    // Niveau 1 : Factorisation avec facteur commun simple
    {
      id: 'fact1',
      question: 'Factoriser : 2x + 2y',
      answer: '2(x + y)',
      steps: [
        'Identifier le facteur commun : 2',
        'Factoriser : 2(x + y)',
        'Vérifier : 2(x + y) = 2x + 2y ✓'
      ]
    },
    {
      id: 'fact2',
      question: 'Factoriser : 3a + 3b',
      answer: '3(a + b)',
      steps: [
        'Identifier le facteur commun : 3',
        'Factoriser : 3(a + b)',
        'Vérifier : 3(a + b) = 3a + 3b ✓'
      ]
    },
    {
      id: 'fact3',
      question: 'Factoriser : 5x + 5',
      answer: '5(x + 1)',
      steps: [
        'Identifier le facteur commun : 5',
        'Factoriser : 5(x + 1)',
        'Vérifier : 5(x + 1) = 5x + 5 ✓'
      ]
    },
    
    // Niveau 2 : Factorisation avec lettres
    {
      id: 'fact4',
      question: 'Factoriser : ax + ay',
      answer: 'a(x + y)',
      steps: [
        'Identifier le facteur commun : a',
        'Factoriser : a(x + y)',
        'Vérifier : a(x + y) = ax + ay ✓'
      ]
    },
    {
      id: 'fact5',
      question: 'Factoriser : bx - by',
      answer: 'b(x - y)',
      steps: [
        'Identifier le facteur commun : b',
        'Factoriser : b(x - y)',
        'Vérifier : b(x - y) = bx - by ✓'
      ]
    },
    {
      id: 'fact6',
      question: 'Factoriser : 3x + 3y - 3z',
      answer: '3(x + y - z)',
      steps: [
        'Identifier le facteur commun : 3',
        'Factoriser : 3(x + y - z)',
        'Vérifier : 3(x + y - z) = 3x + 3y - 3z ✓'
      ]
    },
    
    // Niveau 3 : Factorisation plus complexe
    {
      id: 'fact7',
      question: 'Factoriser : 4a + 4b + 4c',
      answer: '4(a + b + c)',
      steps: [
        'Identifier le facteur commun : 4',
        'Factoriser : 4(a + b + c)',
        'Vérifier : 4(a + b + c) = 4a + 4b + 4c ✓'
      ]
    },
    {
      id: 'fact8',
      question: 'Factoriser : 6x - 6',
      answer: '6(x - 1)',
      steps: [
        'Identifier le facteur commun : 6',
        'Factoriser : 6(x - 1)',
        'Vérifier : 6(x - 1) = 6x - 6 ✓'
      ]
    },
    {
      id: 'fact9',
      question: 'Factoriser : 7m + 7n - 7p',
      answer: '7(m + n - p)',
      steps: [
        'Identifier le facteur commun : 7',
        'Factoriser : 7(m + n - p)',
        'Vérifier : 7(m + n - p) = 7m + 7n - 7p ✓'
      ]
    },
    {
      id: 'fact10',
      question: 'Factoriser : 8x + 8y + 8',
      answer: '8(x + y + 1)',
      steps: [
        'Identifier le facteur commun : 8',
        'Factoriser : 8(x + y + 1)',
        'Vérifier : 8(x + y + 1) = 8x + 8y + 8 ✓'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-rose-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/chapitre/5eme-calcul-litteral" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                🎯
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Factorisation</h1>
                <p className="text-gray-600 mt-1">Factoriser des expressions littérales simples</p>
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
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Cours
          </button>
          <button
            onClick={() => setActiveTab('exercices')}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'exercices'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-purple-600'
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Qu'est-ce que la factorisation ?</h2>
            
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-purple-800 mb-3">🎯 Définition</h3>
                <p className="text-gray-700">
                  Factoriser, c'est transformer une somme ou une différence en un produit.
                  On cherche le <strong>facteur commun</strong> dans tous les termes.
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🔍 Méthode</h3>
                <div className="space-y-3">
                  <p className="text-gray-700"><strong>Étape 1 :</strong> Identifier le facteur commun</p>
                  <p className="text-gray-700"><strong>Étape 2 :</strong> Diviser chaque terme par ce facteur</p>
                  <p className="text-gray-700"><strong>Étape 3 :</strong> Écrire le résultat sous forme de produit</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-bold text-green-800 mb-3">✨ Exemples</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-gray-700"><strong>Exemple 1 :</strong> 3x + 3y</p>
                    <p className="text-gray-600 ml-4">• Facteur commun : 3</p>
                    <p className="text-gray-600 ml-4">• Résultat : 3(x + y)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-gray-700"><strong>Exemple 2 :</strong> 5a - 5b</p>
                    <p className="text-gray-600 ml-4">• Facteur commun : 5</p>
                    <p className="text-gray-600 ml-4">• Résultat : 5(a - b)</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">💡 Astuce</h3>
                <p className="text-gray-700">
                  Pour vérifier ta factorisation, développe le résultat : tu dois retrouver l'expression de départ !
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exercices' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Exercice {currentExercise + 1} / {exercises.length}
              </h2>
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
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-purple-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="flex flex-col items-center gap-4">
                  {/* Éditeur mathématique */}
                  <div className="w-full max-w-md">
                    <MathEditor
                      value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="Tapez votre factorisation... (ex: 3(x + y))"
                      onSubmit={checkAnswer}
                      theme="red"
                      disabled={showAnswer}
                    />
                  </div>
                
                  {/* Reconnaissance vocale */}
                  <div className="w-full max-w-md border-t border-gray-200 pt-3">
                    <VoiceInput
                      onTranscript={(transcript) => setUserAnswer(transcript)}
                      placeholder="Ou dites votre réponse à voix haute (ex: 'trois parenthèse x plus y parenthèse')..."
                      className="justify-center"
                    />
                  </div>
                
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || showAnswer}
                    className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <span className="text-green-800 font-medium">Excellent ! Bonne réponse !</span>
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
                    
                    <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-2">📝 Solution détaillée :</h4>
                      <div className="space-y-2">
                        {exercises[currentExercise].steps.map((step, index) => (
                          <p key={index} className="text-blue-700">
                            <strong>Étape {index + 1} :</strong> {step}
                          </p>
                        ))}
                      </div>
                    </div>

                    {currentExercise < exercises.length - 1 && (
                      <button
                        onClick={nextExercise}
                        className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                      >
                        <Play className="inline w-4 h-4 mr-2" />
                        Exercice suivant
                      </button>
                    )}

                    {currentExercise === exercises.length - 1 && (
                      <div className="mt-4 p-4 bg-gold-50 rounded-xl border border-yellow-200">
                        <p className="text-yellow-800 font-medium">
                          🎉 Bravo ! Tu as terminé tous les exercices !
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