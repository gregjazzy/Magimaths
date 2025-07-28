'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Calculator, AlertTriangle, Search } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'
import MathEditor from '@/components/MathEditor'

export default function ProblemesPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showIncrement, setShowIncrement] = useState(false)
  
  // États pour la solution détaillée
  const [showSolution, setShowSolution] = useState(false)
  const [solutionStep, setSolutionStep] = useState(0)

  // EXERCICES DE PROBLÈMES - Types variés
  const exercises = [
    // Type 1 : Programmes de calcul
    {
      id: 1,
      type: "Programme de calcul",
      question: "On considère le programme suivant :\n• Choisir un nombre\n• Le multiplier par 3\n• Ajouter 5\n• Multiplier le résultat par 2\n\nSi on choisit x comme nombre de départ, quelle expression obtient-on ?",
      variable: "x = nombre de départ",
      answer: "6x + 10",
      steps: [
        { text: "Nombre de départ", expr: "x", color: "text-blue-800" },
        { text: "Le multiplier par 3", expr: "3x", color: "text-green-800" },
        { text: "Ajouter 5", expr: "3x + 5", color: "text-orange-800" },
        { text: "Multiplier le résultat par 2", expr: "2(3x + 5)", color: "text-red-800" },
        { text: "Développer", expr: "2 × 3x + 2 × 5", color: "text-purple-800" },
        { text: "Expression finale", expr: "6x + 10", color: "text-indigo-800" }
      ]
    },
    {
      id: 2,
      type: "Programme de calcul",
      question: "Programme :\n• Choisir un nombre\n• Le multiplier par lui-même\n• Soustraire le double du nombre de départ\n• Ajouter 1\n\nExpression littérale pour le nombre x ?",
      variable: "x = nombre choisi",
      answer: "x² - 2x + 1",
      steps: [
        { text: "Nombre de départ", expr: "x", color: "text-blue-800" },
        { text: "Le multiplier par lui-même", expr: "x²", color: "text-green-800" },
        { text: "Soustraire le double du nombre", expr: "x² - 2x", color: "text-orange-800" },
        { text: "Ajouter 1", expr: "x² - 2x + 1", color: "text-purple-800" }
      ]
    },
    {
      id: 3,
      type: "Programme de calcul",
      question: "Programme :\n• Choisir un nombre\n• Lui ajouter 2\n• Multiplier le résultat par le nombre de départ\n• Soustraire 5\n\nQuelle expression pour x ?",
      variable: "x = nombre initial",
      answer: "x² + 2x - 5",
      steps: [
        { text: "Nombre de départ", expr: "x", color: "text-blue-800" },
        { text: "Lui ajouter 2", expr: "x + 2", color: "text-green-800" },
        { text: "Multiplier par le nombre de départ", expr: "x(x + 2)", color: "text-orange-800" },
        { text: "Développer", expr: "x² + 2x", color: "text-red-800" },
        { text: "Soustraire 5", expr: "x² + 2x - 5", color: "text-purple-800" }
      ]
    },

    // Type 2 : Contre-exemples
    {
      id: 4,
      type: "Contre-exemple",
      question: "Montrer que l'égalité (x + 1)² = x² + 1 est FAUSSE en trouvant un contre-exemple.\n\nDonner une valeur de x pour laquelle les deux expressions donnent des résultats différents.",
      variable: "Valeur de x",
      answer: "x = 2",
      steps: [
        { text: "Testons avec x = 2", expr: "x = 2", color: "text-blue-800" },
        { text: "Membre de gauche : (x + 1)²", expr: "(2 + 1)² = 3² = 9", color: "text-green-800" },
        { text: "Membre de droite : x² + 1", expr: "2² + 1 = 4 + 1 = 5", color: "text-orange-800" },
        { text: "Comparaison", expr: "9 ≠ 5", color: "text-red-800" },
        { text: "Conclusion", expr: "L'égalité est fausse", color: "text-purple-800" }
      ]
    },
    {
      id: 5,
      type: "Contre-exemple",
      question: "Prouver que 2(x + 3) = 2x + 3 est FAUX.\n\nTrouvez une valeur de x qui le démontre.",
      variable: "Valeur de x",
      answer: "x = 1",
      steps: [
        { text: "Testons avec x = 1", expr: "x = 1", color: "text-blue-800" },
        { text: "Membre de gauche : 2(x + 3)", expr: "2(1 + 3) = 2 × 4 = 8", color: "text-green-800" },
        { text: "Membre de droite : 2x + 3", expr: "2 × 1 + 3 = 2 + 3 = 5", color: "text-orange-800" },
        { text: "Comparaison", expr: "8 ≠ 5", color: "text-red-800" },
        { text: "L'égalité est fausse", expr: "Contre-exemple trouvé", color: "text-purple-800" }
      ]
    },
    {
      id: 6,
      type: "Contre-exemple",
      question: "Montrer que x² - 4 = (x - 2)² est FAUX.\n\nQuelle valeur de x prouve cette inégalité ?",
      variable: "Valeur de x",
      answer: "x = 0",
      steps: [
        { text: "Testons avec x = 0", expr: "x = 0", color: "text-blue-800" },
        { text: "Membre de gauche : x² - 4", expr: "0² - 4 = 0 - 4 = -4", color: "text-green-800" },
        { text: "Membre de droite : (x - 2)²", expr: "(0 - 2)² = (-2)² = 4", color: "text-orange-800" },
        { text: "Comparaison", expr: "-4 ≠ 4", color: "text-red-800" },
        { text: "Contre-exemple valide", expr: "L'égalité est fausse", color: "text-purple-800" }
      ]
    },

    // Type 3 : Vérification d'identités
    {
      id: 7,
      type: "Identité",
      question: "Montrer que (x + 1)(x + 3) = x² + 4x + 3 est une identité vraie.\n\nDévelopper le membre de gauche.",
      variable: "Développement",
      answer: "x² + 4x + 3",
      steps: [
        { text: "Expression de départ", expr: "(x + 1)(x + 3)", color: "text-blue-800" },
        { text: "Appliquer la distributivité", expr: "x×x + x×3 + 1×x + 1×3", color: "text-green-800" },
        { text: "Calculer les produits", expr: "x² + 3x + x + 3", color: "text-orange-800" },
        { text: "Réduire les termes semblables", expr: "x² + 4x + 3", color: "text-red-800" },
        { text: "Identité vérifiée", expr: "= x² + 4x + 3 ✓", color: "text-purple-800" }
      ]
    },
    {
      id: 8,
      type: "Identité",
      question: "Prouver que (2x - 1)(x + 2) = 2x² + 3x - 2.\n\nDévelopper et simplifier.",
      variable: "Calcul",
      answer: "2x² + 3x - 2",
      steps: [
        { text: "Expression", expr: "(2x - 1)(x + 2)", color: "text-blue-800" },
        { text: "Distributivité", expr: "2x×x + 2x×2 + (-1)×x + (-1)×2", color: "text-green-800" },
        { text: "Produits", expr: "2x² + 4x - x - 2", color: "text-orange-800" },
        { text: "Simplification", expr: "2x² + 3x - 2", color: "text-red-800" },
        { text: "Identité prouvée", expr: "= 2x² + 3x - 2 ✓", color: "text-purple-800" }
      ]
    },
    {
      id: 9,
      type: "Identité",
      question: "Vérifier que (x + 2)² - 4 = x² + 4x.\n\nDévelopper le membre de gauche.",
      variable: "Développement",
      answer: "x² + 4x",
      steps: [
        { text: "Expression", expr: "(x + 2)² - 4", color: "text-blue-800" },
        { text: "Développer (x + 2)²", expr: "(x + 2)(x + 2) = x² + 4x + 4", color: "text-green-800" },
        { text: "Substituer", expr: "x² + 4x + 4 - 4", color: "text-orange-800" },
        { text: "Simplifier", expr: "x² + 4x", color: "text-red-800" },
        { text: "Identité confirmée", expr: "= x² + 4x ✓", color: "text-purple-800" }
      ]
    },

    // Type 4 : Applications numériques
    {
      id: 10,
      type: "Application",
      question: "Un programme donne l'expression 3x² - 2x + 1.\n\nQuelle valeur obtient-on pour x = 2 ?",
      variable: "x = 2",
      answer: "9",
      steps: [
        { text: "Expression", expr: "3x² - 2x + 1", color: "text-blue-800" },
        { text: "Remplacer x par 2", expr: "3(2)² - 2(2) + 1", color: "text-green-800" },
        { text: "Calculer 3(2)²", expr: "3 × 4 - 2(2) + 1 = 12 - 2(2) + 1", color: "text-orange-800" },
        { text: "Calculer 2(2)", expr: "12 - 4 + 1", color: "text-red-800" },
        { text: "Résultat final", expr: "9", color: "text-purple-800" }
      ]
    },
    {
      id: 11,
      type: "Programme de calcul",
      question: "Programme mystère :\n• Choisir un nombre\n• L'élever au carré\n• Soustraire le triple du nombre\n• Ajouter 2\n\nSi le résultat est toujours 2, quel est le nombre ?",
      variable: "x tel que résultat = 2",
      answer: "x = 0 ou x = 3",
      steps: [
        { text: "Expression du programme", expr: "x² - 3x + 2", color: "text-blue-800" },
        { text: "Équation à résoudre", expr: "x² - 3x + 2 = 2", color: "text-green-800" },
        { text: "Simplifier", expr: "x² - 3x = 0", color: "text-orange-800" },
        { text: "Factoriser", expr: "x(x - 3) = 0", color: "text-red-800" },
        { text: "Solutions", expr: "x = 0 ou x = 3", color: "text-purple-800" }
      ]
    },
    {
      id: 12,
      type: "Contre-exemple",
      question: "Montrer que (x - 1)² = x² - 1 est FAUX.\n\nTrouvez un contre-exemple simple.",
      variable: "Valeur de x",
      answer: "x = 2",
      steps: [
        { text: "Testons x = 2", expr: "x = 2", color: "text-blue-800" },
        { text: "Gauche : (x - 1)²", expr: "(2 - 1)² = 1² = 1", color: "text-green-800" },
        { text: "Droite : x² - 1", expr: "2² - 1 = 4 - 1 = 3", color: "text-orange-800" },
        { text: "Comparaison", expr: "1 ≠ 3", color: "text-red-800" },
        { text: "Égalité fausse", expr: "Contre-exemple trouvé", color: "text-purple-800" }
      ]
    }
  ]

  const currentEx = exercises[currentExercise]

  // Fonctions pour gérer les exercices
  const resetExercise = () => {
    setShowSolution(false)
    setSolutionStep(0)
    setUserAnswer('')
    setShowAnswer(false)
    setAnswerFeedback(null)
  }

  const checkAnswer = () => {
    const correctAnswer = currentEx.answer
    
    const userAnswerTrimmed = userAnswer.trim().toLowerCase().replace(/\s+/g, '').replace(/=/g, '')
    const correctAnswerTrimmed = correctAnswer.trim().toLowerCase().replace(/\s+/g, '').replace(/=/g, '')
    
    // Vérifier plusieurs formats possibles
    const possibleAnswers = [
      correctAnswerTrimmed,
      correctAnswerTrimmed.replace(/\*/g, ''),
      correctAnswerTrimmed.replace(/\+/g, '').replace(/-/g, ''),
    ]
    
    if (possibleAnswers.some(ans => ans === userAnswerTrimmed || userAnswerTrimmed.includes(ans))) {
      setAnswerFeedback('correct')
      setCorrectAnswers(prev => prev + 1)
      setShowIncrement(true)
      setTimeout(() => setShowIncrement(false), 2000)
    } else {
      setAnswerFeedback('incorrect')
    }
    setShowAnswer(true)
  }

  const nextSolutionStep = () => {
    setSolutionStep(prev => prev + 1)
  }

  const prevSolutionStep = () => {
    setSolutionStep(prev => Math.max(prev - 1, 0))
  }

  const resetSolutionStep = () => {
    setSolutionStep(0)
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      resetExercise()
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      resetExercise()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/chapitre/4eme-calcul-litteral" 
              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour au calcul littéral</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                🧮
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Problèmes</h1>
                <p className="text-gray-600 text-lg">
                  Résoudre des problèmes concrets avec le calcul littéral
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-red-600">20 minutes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('cours')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'cours'
                    ? 'bg-red-500 text-white'
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
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Target className="inline w-4 h-4 mr-2" />
                Exercices ({correctAnswers}/{exercises.length})
              </button>
            </div>
          </div>
        </div>

        {/* Cours */}
        {activeTab === 'cours' && (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
              <h2 className="text-2xl font-bold text-red-800 mb-6">🎯 Types de problèmes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Programmes de calcul */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-800">Programmes de calcul</h3>
                  </div>
                  <p className="text-gray-800 mb-4">
                    Séquence d'opérations appliquées à un nombre. On doit exprimer le résultat en fonction du nombre de départ.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-blue-300">
                    <div className="text-sm text-blue-900 font-mono">
                      x → 2x → 2x + 3 → (2x + 3) × 5
                    </div>
                  </div>
                </div>

                {/* Contre-exemples */}
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                    <h3 className="text-xl font-bold text-orange-800">Contre-exemples</h3>
                  </div>
                  <p className="text-gray-800 mb-4">
                    Pour prouver qu'une égalité est fausse, on trouve une valeur qui donne des résultats différents des deux côtés.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-orange-300">
                    <div className="text-sm text-orange-900">
                      Si (x+1)² ≠ x²+1 pour x=2 → FAUX
                    </div>
                  </div>
                </div>

                {/* Identités */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Search className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl font-bold text-green-800">Vérification d'identités</h3>
                  </div>
                  <p className="text-gray-800 mb-4">
                    On développe une expression pour montrer qu'elle est égale à une autre expression donnée.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-green-300">
                    <div className="text-sm text-green-900">
                      (x+1)² = x² + 2x + 1 ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Méthodes détaillées */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
              <h2 className="text-2xl font-bold text-green-800 mb-6">📚 Méthodes détaillées</h2>
              
              <div className="space-y-8">
                {/* Méthode 1 */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-800 mb-4">1️⃣ Programmes de calcul</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                      <h4 className="font-bold text-blue-900 mb-2">Exemple :</h4>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-800">• Choisir un nombre : <span className="font-mono text-blue-800">x</span></div>
                        <div className="text-gray-800">• Le multiplier par 3 : <span className="font-mono text-blue-800">3x</span></div>
                        <div className="text-gray-800">• Ajouter 5 : <span className="font-mono text-blue-800">3x + 5</span></div>
                        <div className="text-gray-800">• Multiplier par 2 : <span className="font-mono text-blue-800">2(3x + 5) = 6x + 10</span></div>
                      </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-blue-900 text-sm"><strong>Astuce :</strong> Suivre étape par étape et développer à la fin.</p>
                    </div>
                  </div>
                </div>

                {/* Méthode 2 */}
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-800 mb-4">2️⃣ Trouver un contre-exemple</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-orange-300">
                      <h4 className="font-bold text-orange-900 mb-2">Pour prouver que A ≠ B :</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside text-gray-800">
                        <li>Choisir une valeur simple (0, 1, 2, -1...)</li>
                        <li>Calculer A avec cette valeur</li>
                        <li>Calculer B avec cette valeur</li>
                        <li>Si A ≠ B, l'égalité est fausse</li>
                      </ol>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <p className="text-orange-900 text-sm"><strong>Astuce :</strong> Les valeurs 0, 1, 2 fonctionnent souvent bien.</p>
                    </div>
                  </div>
                </div>

                {/* Méthode 3 */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-green-800 mb-4">3️⃣ Prouver une identité</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-green-300">
                      <h4 className="font-bold text-green-900 mb-2">Méthode :</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside text-gray-800">
                        <li>Développer l'expression la plus complexe</li>
                        <li>Réduire les termes semblables</li>
                        <li>Vérifier que le résultat = expression de droite</li>
                      </ol>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <p className="text-green-900 text-sm"><strong>Astuce :</strong> Toujours développer complètement avant de conclure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercices */}
        {activeTab === 'exercices' && (
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-red-800">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {currentEx.type}
                  </div>
                  <div className="text-sm text-gray-800">Score: {correctAnswers}/{exercises.length}</div>
                  {showIncrement && (
                    <div className="text-green-700 font-bold animate-pulse">+1 !</div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={prevExercise}
                  disabled={currentExercise === 0}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
                >
                  Précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
                >
                  Suivant
                </button>
                <button
                  onClick={resetExercise}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="mb-6">
                <div className="text-lg font-semibold text-gray-900 mb-4 whitespace-pre-line">
                  {currentEx.question}
                </div>
                {currentEx.variable && (
                  <div className="text-md text-red-700 font-semibold">{currentEx.variable}</div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                {/* Éditeur mathématique */}
                <div className="w-full max-w-md">
                  <MathEditor
                    value={userAnswer}
                    onChange={setUserAnswer}
                    placeholder="Tapez votre expression... (ex: 6x + 10, x = 2)"
                    onSubmit={checkAnswer}
                    theme="red"
                    disabled={showAnswer}
                  />
                </div>
                
                {/* Reconnaissance vocale */}
                <div className="w-full max-w-md border-t border-gray-200 pt-3">
                  <VoiceInput
                    onTranscript={(transcript) => setUserAnswer(transcript)}
                    placeholder="Ou dites votre réponse à voix haute (ex: 'x carré plus deux x moins cinq')..."
                    className="justify-center"
                  />
                </div>
                
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Vérifier
                </button>

                {showAnswer && (
                  <div className={`flex items-center gap-2 text-lg font-semibold ${
                    answerFeedback === 'correct' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {answerFeedback === 'correct' ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span>Correct ! La réponse est {currentEx.answer}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span>Incorrect. La réponse est {currentEx.answer}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Solution détaillée */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-900">Solution détaillée</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {showSolution ? 'Masquer' : 'Afficher'} la solution
                  </button>
                </div>
              </div>

              {showSolution && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={resetSolutionStep}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm"
                    >
                      Début
                    </button>
                    <button
                      onClick={prevSolutionStep}
                      disabled={solutionStep === 0}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors text-sm"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextSolutionStep}
                      disabled={solutionStep === currentEx.steps.length - 1}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors text-sm"
                    >
                      →
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-800">
                      Étape {solutionStep + 1} / {currentEx.steps.length}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2 text-gray-900">
                        {currentEx.steps[solutionStep].text}
                      </div>
                      <div className="text-2xl font-mono font-bold text-gray-900">
                        {currentEx.steps[solutionStep].expr}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 