'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DeveloppementPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)

  const exercises = [
    // Niveau 1 : Développement simple
    {
      id: 'dev1',
      question: 'Développer : 3(x + 2)',
      answer: '3x + 6',
      steps: [
        'Utiliser la distributivité : a(b + c) = ab + ac',
        'Appliquer : 3(x + 2) = 3 × x + 3 × 2',
        'Calculer : 3x + 6',
        'Résultat final : 3x + 6'
      ]
    },
    {
      id: 'dev2',
      question: 'Développer : 2(y - 4)',
      answer: '2y - 8',
      steps: [
        'Utiliser la distributivité : a(b - c) = ab - ac',
        'Appliquer : 2(y - 4) = 2 × y - 2 × 4',
        'Calculer : 2y - 8',
        'Résultat final : 2y - 8'
      ]
    },
    {
      id: 'dev3',
      question: 'Développer : -2(x + 3)',
      answer: '-2x - 6',
      steps: [
        'Utiliser la distributivité : a(b + c) = ab + ac',
        'Appliquer : -2(x + 3) = -2 × x + (-2) × 3',
        'Calculer : -2x - 6',
        'Résultat final : -2x - 6'
      ]
    },
    {
      id: 'dev4',
      question: 'Développer : 4(2x - 5)',
      answer: '8x - 20',
      steps: [
        'Utiliser la distributivité : a(b - c) = ab - ac',
        'Appliquer : 4(2x - 5) = 4 × 2x - 4 × 5',
        'Calculer : 8x - 20',
        'Résultat final : 8x - 20'
      ]
    },
    {
      id: 'dev5',
      question: 'Développer : x(x + 3)',
      answer: 'x² + 3x',
      steps: [
        'Utiliser la distributivité : a(b + c) = ab + ac',
        'Appliquer : x(x + 3) = x × x + x × 3',
        'Calculer : x² + 3x',
        'Résultat final : x² + 3x'
      ]
    },
    
    // Niveau 2 : Développement avec expressions plus complexes
    {
      id: 'dev6',
      question: 'Développer : (x + 1)(x + 2)',
      answer: 'x² + 3x + 2',
      steps: [
        'Utiliser la double distributivité',
        'Développer : x × x + x × 2 + 1 × x + 1 × 2',
        'Calculer : x² + 2x + x + 2',
        'Réduire : x² + 3x + 2',
        'Résultat final : x² + 3x + 2'
      ]
    },
    {
      id: 'dev7',
      question: 'Développer : (x - 2)(x + 3)',
      answer: 'x² + x - 6',
      steps: [
        'Utiliser la double distributivité',
        'Développer : x × x + x × 3 - 2 × x - 2 × 3',
        'Calculer : x² + 3x - 2x - 6',
        'Réduire : x² + x - 6',
        'Résultat final : x² + x - 6'
      ]
    },
    {
      id: 'dev8',
      question: 'Développer : (2x + 1)(x - 3)',
      answer: '2x² - 5x - 3',
      steps: [
        'Utiliser la double distributivité',
        'Développer : 2x × x + 2x × (-3) + 1 × x + 1 × (-3)',
        'Calculer : 2x² - 6x + x - 3',
        'Réduire : 2x² - 5x - 3',
        'Résultat final : 2x² - 5x - 3'
      ]
    }
  ]

  const currentEx = exercises[currentExercise]

  const checkAnswer = () => {
    if (userAnswer.trim() === currentEx.answer) {
      setScore(score + 1)
      setShowAnswer(true)
      return true
    } else {
      setShowAnswer(true)
      return false
    }
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowAnswer(false)
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setUserAnswer('')
      setShowAnswer(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/chapitre/4eme-calcul-litteral" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour au calcul littéral</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                📐
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Développement</h1>
                <p className="text-gray-600 text-lg">
                  Utiliser la distributivité pour développer
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-blue-600">25 minutes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('cours')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'cours'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <BookOpen className="inline w-4 h-4 mr-2" />
                Cours
              </button>
              <button
                onClick={() => setActiveTab('exercices')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'exercices'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Target className="inline w-4 h-4 mr-2" />
                Exercices
              </button>
            </div>
          </div>
        </div>

        {/* Cours */}
        {activeTab === 'cours' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">🎯 Qu'est-ce que le développement ?</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Définition</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Développer</strong> une expression, c'est transformer un produit en somme en utilisant la <strong>distributivité</strong>.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Propriété de distributivité</h4>
                    <div className="font-mono text-lg space-y-2 text-blue-700">
                      <div>a(b + c) = ab + ac</div>
                      <div>a(b - c) = ab - ac</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemple détaillé</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded font-mono text-lg text-gray-800">
                      3(x + 2) = ?
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-blue-800">On distribue le 3 à chaque terme de la parenthèse :</p>
                      <p className="font-mono text-lg mt-2 text-blue-900">3(x + 2) = 3 × x + 3 × 2 = 3x + 6</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Double distributivité</h3>
                  <p className="text-gray-700 mb-4">
                    Pour développer (a + b)(c + d), on multiplie chaque terme de la première parenthèse par chaque terme de la deuxième.
                  </p>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <p className="font-mono text-lg text-indigo-700">
                      (a + b)(c + d) = ac + ad + bc + bd
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercices */}
        {activeTab === 'exercices' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Exercices de développement</h2>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Exercice {currentExercise + 1} sur {exercises.length}
                </h3>
                <div className="text-sm text-gray-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentEx.question}
                </h4>
                
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={showAnswer}
                  />
                  <button
                    onClick={checkAnswer}
                    disabled={showAnswer || !userAnswer.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    Vérifier
                  </button>
                </div>

                {showAnswer && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${
                      userAnswer.trim() === currentEx.answer
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`font-semibold ${
                        userAnswer.trim() === currentEx.answer
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {userAnswer.trim() === currentEx.answer ? '✅ Correct !' : '❌ Incorrect'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        La bonne réponse est : <span className="font-mono font-bold">{currentEx.answer}</span>
                      </p>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h5 className="font-semibold text-indigo-800 mb-2">Résolution détaillée :</h5>
                      <div className="space-y-2">
                        {currentEx.steps.map((step, index) => (
                          <div key={index} className="p-2 bg-indigo-100 rounded text-indigo-800">
                            <span className="font-mono">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevExercise}
                  disabled={currentExercise === 0}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                  ← Exercice précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Exercice suivant →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 