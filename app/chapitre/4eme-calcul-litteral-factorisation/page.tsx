'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '@/components/VoiceInput'

export default function Factorisation4emePage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const exercises = [
    // Niveau 1 : Factorisation simple avec facteur commun
    {
      id: 'fact1',
      question: 'Factoriser : 3x + 6',
      answer: '3(x + 2)',
      steps: [
        'Identifier le facteur commun : 3',
        'Factoriser : 3(x + 2)',
        'Vérifier : 3(x + 2) = 3x + 6 ✓'
      ]
    },
    {
      id: 'fact2',
      question: 'Factoriser : 5a - 15',
      answer: '5(a - 3)',
      steps: [
        'Identifier le facteur commun : 5',
        'Factoriser : 5(a - 3)',
        'Vérifier : 5(a - 3) = 5a - 15 ✓'
      ]
    },
    {
      id: 'fact3',
      question: 'Factoriser : 2x² + 4x',
      answer: '2x(x + 2)',
      steps: [
        'Identifier le facteur commun : 2x',
        'Factoriser : 2x(x + 2)',
        'Vérifier : 2x(x + 2) = 2x² + 4x ✓'
      ]
    },
    
    // Niveau 2 : Factorisation avec variables au carré
    {
      id: 'fact4',
      question: 'Factoriser : x² + 3x',
      answer: 'x(x + 3)',
      steps: [
        'Identifier le facteur commun : x',
        'Factoriser : x(x + 3)',
        'Vérifier : x(x + 3) = x² + 3x ✓'
      ]
    },
    {
      id: 'fact5',
      question: 'Factoriser : 6y² - 9y',
      answer: '3y(2y - 3)',
      steps: [
        'Identifier le facteur commun : 3y',
        'Factoriser : 3y(2y - 3)',
        'Vérifier : 3y(2y - 3) = 6y² - 9y ✓'
      ]
    },
    {
      id: 'fact6',
      question: 'Factoriser : 4a² + 8a - 12',
      answer: '4(a² + 2a - 3)',
      steps: [
        'Identifier le facteur commun : 4',
        'Factoriser : 4(a² + 2a - 3)',
        'Vérifier : 4(a² + 2a - 3) = 4a² + 8a - 12 ✓'
      ]
    },
    
    // Niveau 3 : Factorisation plus complexe
    {
      id: 'fact7',
      question: 'Factoriser : 7x² - 14x + 21',
      answer: '7(x² - 2x + 3)',
      steps: [
        'Identifier le facteur commun : 7',
        'Factoriser : 7(x² - 2x + 3)',
        'Vérifier : 7(x² - 2x + 3) = 7x² - 14x + 21 ✓'
      ]
    },
    {
      id: 'fact8',
      question: 'Factoriser : 10a³ - 15a²',
      answer: '5a²(2a - 3)',
      steps: [
        'Identifier le facteur commun : 5a²',
        'Factoriser : 5a²(2a - 3)',
        'Vérifier : 5a²(2a - 3) = 10a³ - 15a² ✓'
      ]
    },
    {
      id: 'fact9',
      question: 'Factoriser : 12x² + 8x - 4',
      answer: '4(3x² + 2x - 1)',
      steps: [
        'Identifier le facteur commun : 4',
        'Factoriser : 4(3x² + 2x - 1)',
        'Vérifier : 4(3x² + 2x - 1) = 12x² + 8x - 4 ✓'
      ]
    },
    {
      id: 'fact10',
      question: 'Factoriser : 15y³ - 10y² + 5y',
      answer: '5y(3y² - 2y + 1)',
      steps: [
        'Identifier le facteur commun : 5y',
        'Factoriser : 5y(3y² - 2y + 1)',
        'Vérifier : 5y(3y² - 2y + 1) = 15y³ - 10y² + 5y ✓'
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
                🎯
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Factorisation - 4ème</h1>
                <p className="text-gray-600 mt-1">Factoriser des expressions littérales</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Factorisation en 4ème</h2>
            
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
                  🎯 Définition
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Factoriser, c'est transformer une <span className="font-bold text-purple-600">somme ou une différence</span> en un <span className="font-bold text-green-600">produit</span>. 
                  On cherche le <span className="bg-yellow-200 px-2 py-1 rounded font-bold">facteur commun</span> dans tous les termes.
                </p>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-bold text-green-800 mb-3">🔍 Méthode en 4ème</h3>
                <div className="space-y-3">
                  <p className="text-gray-700"><strong>Étape 1 :</strong> Identifier le plus grand facteur commun (PGFC)</p>
                  <p className="text-gray-700"><strong>Étape 2 :</strong> Diviser chaque terme par ce facteur</p>
                  <p className="text-gray-700"><strong>Étape 3 :</strong> Écrire sous forme de produit</p>
                  <p className="text-gray-700"><strong>Étape 4 :</strong> Vérifier en développant</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
                <h3 className="text-xl font-bold text-yellow-800 mb-3">✨ Exemples niveau 4ème</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-700"><strong>Exemple 1 :</strong> 2x² + 4x</p>
                    <p className="text-gray-600 ml-4">• Facteur commun : 2x</p>
                    <p className="text-gray-600 ml-4">• Résultat : 2x(x + 2)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-700"><strong>Exemple 2 :</strong> 6y² - 9y</p>
                    <p className="text-gray-600 ml-4">• Facteur commun : 3y</p>
                    <p className="text-gray-600 ml-4">• Résultat : 3y(2y - 3)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-700"><strong>Exemple 3 :</strong> 10a³ - 15a²</p>
                    <p className="text-gray-600 ml-4">• Facteur commun : 5a²</p>
                    <p className="text-gray-600 ml-4">• Résultat : 5a²(2a - 3)</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <h3 className="text-xl font-bold text-red-800 mb-3">💡 Astuces pour la 4ème</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">🔸 <strong>Coefficients :</strong> Cherche le PGCD des nombres</p>
                  <p className="text-gray-700">🔸 <strong>Variables :</strong> Prends la plus petite puissance</p>
                  <p className="text-gray-700">🔸 <strong>Vérification :</strong> Développe pour retrouver l'expression de départ</p>
                </div>
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
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="flex flex-col items-center gap-4">
                  {/* Éditeur mathématique */}
                  <div className="w-full max-w-md">
                    <MathEditor
                      value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="Tapez votre factorisation... (ex: 2x(x + 3))"
                      onSubmit={checkAnswer}
                      theme="blue"
                      disabled={showAnswer}
                    />
                  </div>
                
                  {/* Reconnaissance vocale */}
                  <div className="w-full max-w-md border-t border-gray-200 pt-3">
                    <VoiceInput
                      onTranscript={(transcript) => setUserAnswer(transcript)}
                      placeholder="Ou dites votre réponse à voix haute (ex: 'deux x parenthèse x plus trois parenthèse')..."
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
                          <span className="text-green-800 font-medium">Excellent ! Tu maîtrises la factorisation !</span>
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
                          🎉 Bravo ! Tu as terminé tous les exercices de factorisation 4ème !
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