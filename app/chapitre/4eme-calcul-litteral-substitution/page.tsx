'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target } from 'lucide-react'
import Link from 'next/link'

export default function SubstitutionPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const exercises = [
    // Niveau 1 : Substitution simple avec nombres positifs
    {
      id: 'sub1',
      question: 'Calculer 2x pour x = 3',
      userInput: true,
      answer: '6',
      steps: [
        'Remplacer x par 3 : 2 × 3',
        'Calculer : 6',
        'Résultat final : 6'
      ]
    },
    {
      id: 'sub2',
      question: 'Calculer 5a pour a = 4',
      userInput: true,
      answer: '20',
      steps: [
        'Remplacer a par 4 : 5 × 4',
        'Calculer : 20',
        'Résultat final : 20'
      ]
    },
    {
      id: 'sub3',
      question: 'Calculer x + 7 pour x = 5',
      userInput: true,
      answer: '12',
      steps: [
        'Remplacer x par 5 : 5 + 7',
        'Calculer : 12',
        'Résultat final : 12'
      ]
    },
    
    // Niveau 2 : Addition et soustraction
    {
      id: 'sub4',
      question: 'Calculer 3x + 2 pour x = 4',
      userInput: true,
      answer: '14',
      steps: [
        'Remplacer x par 4 : 3 × 4 + 2',
        'Calculer la multiplication : 12 + 2', 
        'Calculer la somme : 14',
        'Résultat final : 14'
      ]
    },
    {
      id: 'sub5',
      question: 'Calculer 2a - 5 pour a = 6',
      userInput: true,
      answer: '7',
      steps: [
        'Remplacer a par 6 : 2 × 6 - 5',
        'Calculer la multiplication : 12 - 5',
        'Calculer la soustraction : 7',
        'Résultat final : 7'
      ]
    },
    {
      id: 'sub6',
      question: 'Calculer 4y - 3 pour y = 2',
      userInput: true,
      answer: '5',
      steps: [
        'Remplacer y par 2 : 4 × 2 - 3',
        'Calculer la multiplication : 8 - 3',
        'Calculer la soustraction : 5',
        'Résultat final : 5'
      ]
    },
    
    // Niveau 3 : Nombres négatifs
    {
      id: 'sub7',
      question: 'Calculer 3x + 5 pour x = -2',
      userInput: true,
      answer: '-1',
      steps: [
        'Remplacer x par -2 : 3 × (-2) + 5',
        'Calculer la multiplication : -6 + 5',
        'Calculer la somme : -1',
        'Résultat final : -1'
      ]
    },
    {
      id: 'sub8',
      question: 'Calculer 2b - 7 pour b = -3',
      userInput: true,
      answer: '-13',
      steps: [
        'Remplacer b par -3 : 2 × (-3) - 7',
        'Calculer la multiplication : -6 - 7',
        'Calculer la soustraction : -13',
        'Résultat final : -13'
      ]
    },
    
    // Niveau 4 : Expressions avec deux variables
    {
      id: 'sub9',
      question: 'Calculer 2x + 3y pour x = 4 et y = 2',
      userInput: true,
      answer: '14',
      steps: [
        'Remplacer x par 4 et y par 2 : 2 × 4 + 3 × 2',
        'Calculer les multiplications : 8 + 6',
        'Calculer la somme : 14',
        'Résultat final : 14'
      ]
    },
    {
      id: 'sub10',
      question: 'Calculer a + 2b pour a = -1 et b = 4',
      userInput: true,
      answer: '7',
      steps: [
        'Remplacer a par -1 et b par 4 : -1 + 2 × 4',
        'Calculer la multiplication : -1 + 8',
        'Calculer la somme : 7',
        'Résultat final : 7'
      ]
    },
    
    // Niveau 5 : Carrés et puissances
    {
      id: 'sub11',
      question: 'Calculer x² + 1 pour x = 3',
      userInput: true,
      answer: '10',
      steps: [
        'Remplacer x par 3 : 3² + 1',
        'Calculer la puissance : 9 + 1',
        'Calculer la somme : 10',
        'Résultat final : 10'
      ]
    },
    {
      id: 'sub12',
      question: 'Calculer 2x² - 3 pour x = 2',
      userInput: true,
      answer: '5',
      steps: [
        'Remplacer x par 2 : 2 × 2² - 3',
        'Calculer la puissance : 2 × 4 - 3',
        'Calculer la multiplication : 8 - 3',
        'Calculer la soustraction : 5',
        'Résultat final : 5'
      ]
    }
  ]

  const currentEx = exercises[currentExercise]

  const checkAnswer = () => {
    if (userAnswer.trim() === currentEx.answer) {
      setScore(score + 1)
      setShowAnswer(true)
      setCurrentStep(0)
      return true
    } else {
      setShowAnswer(true)
      setCurrentStep(0)
      return false
    }
  }

  const nextStep = () => {
    if (currentStep < currentEx.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowAnswer(false)
      setCurrentStep(0)
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setUserAnswer('')
      setShowAnswer(false)
      setCurrentStep(0)
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
                🔢
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Substitution</h1>
                <p className="text-gray-600 text-lg">
                  Remplacer les variables par des valeurs numériques
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-blue-600">15 minutes</div>
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
              <h2 className="text-2xl font-bold text-blue-800 mb-6">🎯 Qu'est-ce que la substitution ?</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Définition</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    La <strong>substitution</strong> consiste à remplacer la variable d'une expression littérale par une valeur numérique donnée.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Exemple</h4>
                    <p className="text-blue-700">
                      Pour calculer <span className="font-mono">3x + 2</span> avec <span className="font-mono">x = 4</span> :
                    </p>
                    <div className="font-mono text-lg mt-2 space-y-1">
                      <div>3x + 2 = 3 × 4 + 2 = 12 + 2 = 14</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Méthode</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Repérer la variable dans l'expression</li>
                    <li>Remplacer la variable par la valeur donnée</li>
                    <li>Effectuer les calculs en respectant les priorités</li>
                    <li>Donner le résultat final</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercices */}
        {activeTab === 'exercices' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Exercices de substitution</h2>
              
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
                          <div
                            key={index}
                            className={`p-2 rounded transition-all duration-300 ${
                              index <= currentStep
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            <span className="font-mono">{step}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={prevStep}
                          disabled={currentStep === 0}
                          className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                        >
                          ← Étape précédente
                        </button>
                        <button
                          onClick={nextStep}
                          disabled={currentStep === currentEx.steps.length - 1}
                          className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                        >
                          Étape suivante →
                        </button>
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