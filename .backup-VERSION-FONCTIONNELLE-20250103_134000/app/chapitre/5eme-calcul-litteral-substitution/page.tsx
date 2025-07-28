'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '@/components/VoiceInput'

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
      question: 'Calculer 2a - 7 pour a = -3',
      userInput: true,
      answer: '-13',
      steps: [
        'Remplacer a par -3 : 2 × (-3) - 7',
        'Calculer la multiplication : -6 - 7',
        'Calculer la soustraction : -13',
        'Résultat final : -13'
      ]
    },
    {
      id: 'sub9',
      question: 'Calculer -2x + 4 pour x = 3',
      userInput: true,
      answer: '-2',
      steps: [
        'Remplacer x par 3 : -2 × 3 + 4',
        'Calculer la multiplication : -6 + 4',
        'Calculer la somme : -2',
        'Résultat final : -2'
      ]
    },
    
    // Niveau 4 : Deux variables
    {
      id: 'sub10',
      question: 'Calculer 2a + 3b pour a = 5 et b = 2',
      userInput: true,
      answer: '16',
      steps: [
        'Remplacer a par 5 et b par 2 : 2 × 5 + 3 × 2',
        'Calculer les multiplications : 10 + 6',
        'Calculer la somme : 16',
        'Résultat final : 16'
      ]
    },
    {
      id: 'sub11',
      question: 'Calculer 3x - 2y pour x = 4 et y = 3',
      userInput: true,
      answer: '6',
      steps: [
        'Remplacer x par 4 et y par 3 : 3 × 4 - 2 × 3',
        'Calculer les multiplications : 12 - 6',
        'Calculer la soustraction : 6',
        'Résultat final : 6'
      ]
    },
    {
      id: 'sub12',
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
      id: 'sub13',
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
      id: 'sub14',
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
    },
    {
      id: 'sub15',
      question: 'Calculer x² + 2x pour x = 3',
      userInput: true,
      answer: '15',
      steps: [
        'Remplacer x par 3 : 3² + 2 × 3',
        'Calculer la puissance : 9 + 2 × 3',
        'Calculer la multiplication : 9 + 6',
        'Calculer la somme : 15',
        'Résultat final : 15'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/chapitre/5eme-calcul-litteral" 
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour au calcul littéral</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
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
                <div className="text-xl font-semibold text-green-600">15 minutes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'cours', label: 'Cours', icon: BookOpen },
                { id: 'exercices', label: `Exercices (${score}/${exercises.length})`, icon: Target }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu */}
        {activeTab === 'cours' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
              <h2 className="text-2xl font-bold text-green-800 mb-6">🔢 La substitution</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Principe de la substitution</h3>
                  <p className="text-gray-700 mb-4">
                    La <strong>substitution</strong> consiste à remplacer une variable par une valeur numérique pour calculer le résultat d'une expression.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Méthode</h4>
                    <ol className="text-blue-700 space-y-1 text-sm list-decimal list-inside">
                      <li>Identifier la variable et sa valeur</li>
                      <li>Remplacer pour chaque variable sa valeur</li>
                      <li>Calculer le résultat en respectant l'ordre des opérations</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemple détaillé</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700 mb-2">
                        <strong>Calculer</strong> : 3x + 5 pour x = 4
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 px-2 py-1 rounded text-purple-800">Étape 1</span>
                          <span className="text-gray-700">Remplacer x par 4 : 3 × 4 + 5</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 px-2 py-1 rounded text-purple-800">Étape 2</span>
                          <span className="text-gray-700">Calculer la multiplication : 12 + 5</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 px-2 py-1 rounded text-purple-800">Étape 3</span>
                          <span className="text-gray-700">Calculer l'addition : 17</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemples avec plusieurs variables</h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-orange-800 font-semibold mb-2">Exemple 1 : 2a + 3b pour a = 5 et b = 2</p>
                      <div className="text-sm text-orange-700 space-y-1">
                        <div>• Remplacer : 2 × 5 + 3 × 2</div>
                        <div>• Calculer : 10 + 6 = 16</div>
                      </div>
                    </div>
                    
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                      <p className="text-pink-800 font-semibold mb-2">Exemple 2 : x² - 2y pour x = 3 et y = 4</p>
                      <div className="text-sm text-pink-700 space-y-1">
                        <div>• Remplacer : 3² - 2 × 4</div>
                        <div>• Calculer : 9 - 8 = 1</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Attention aux erreurs courantes</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">❌</span>
                      <div>
                        <p className="text-red-700 font-semibold">Oublier les parenthèses</p>
                        <p className="text-red-600 text-sm">Pour x = -2 dans 3x, écrire 3 × (-2) = -6</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 font-bold">❌</span>
                      <div>
                        <p className="text-red-700 font-semibold">Confondre l'ordre des opérations</p>
                        <p className="text-red-600 text-sm">Calculer les multiplications avant les additions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exercices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Exercices - Substitution</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Score</div>
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{currentEx.question}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        Exercice {currentExercise + 1} sur {exercises.length}
                      </span>
                      <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full font-semibold">
                        Score: {score}/{exercises.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevExercise}
                        disabled={currentExercise === 0}
                        className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                          currentExercise === 0 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                      >
                        ← Précédent
                      </button>
                      <button
                        onClick={nextExercise}
                        disabled={currentExercise === exercises.length - 1}
                        className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                          currentExercise === exercises.length - 1 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        Suivant →
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-4">
                  {/* Éditeur mathématique */}
                  <div className="w-full">
                    <MathEditor
                      value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="Votre réponse... (ex: 6, -3, 12)"
                      onSubmit={checkAnswer}
                      theme="orange"
                      disabled={showAnswer}
                    />
                  </div>
                  
                  {/* Reconnaissance vocale */}
                  <div className="w-full border-t border-gray-200 pt-3">
                    <VoiceInput
                      onTranscript={(transcript) => setUserAnswer(transcript)}
                      placeholder="Ou dites votre réponse à voix haute (ex: 'six', 'moins trois')..."
                      className="justify-center"
                    />
                  </div>
                  
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || showAnswer}
                    className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-semibold"
                  >
                    Vérifier
                  </button>
                </div>

                {showAnswer && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${
                      userAnswer.trim() === currentEx.answer
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-semibold ${
                          userAnswer.trim() === currentEx.answer ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {userAnswer.trim() === currentEx.answer ? '✅ Correct !' : '❌ Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Réponse correcte : <strong>{currentEx.answer}</strong>
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">📝 Correction détaillée</h4>
                        <span className="text-sm text-gray-600">
                          Étape {currentStep + 1} sur {currentEx.steps.length}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 space-y-2">
                        {currentEx.steps.slice(0, currentStep + 1).map((step, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="bg-green-100 px-2 py-1 rounded text-green-800 text-xs">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                        {currentStep < currentEx.steps.length - 1 ? (
                          <button
                            onClick={nextStep}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Étape suivante
                          </button>
                        ) : (
                          <div className="text-green-600 font-semibold">
                            ✅ Correction terminée !
                          </div>
                        )}
                      </div>
                    </div>
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