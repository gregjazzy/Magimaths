'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function SubstitutionPage() {
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

  // EXERCICES DE SUBSTITUTION - Progression graduelle
  const exercises = [
    // Niveau 1 : Substitution simple avec nombres positifs
    {
      id: 1,
      question: "Calculer 3x pour x = 4",
      variable: "x = 4",
      expression: "3x",
      steps: [
        { text: "Expression de départ", expr: "3x", color: "text-blue-600" },
        { text: "Remplacer x par 4", expr: "3 × 4", color: "text-green-600" },
        { text: "Résultat", expr: "12", color: "text-purple-600" }
      ]
    },
    {
      id: 2,
      question: "Calculer x + 5 pour x = 7",
      variable: "x = 7",
      expression: "x + 5",
      steps: [
        { text: "Expression de départ", expr: "x + 5", color: "text-blue-600" },
        { text: "Remplacer x par 7", expr: "7 + 5", color: "text-green-600" },
        { text: "Résultat", expr: "12", color: "text-purple-600" }
      ]
    },
    {
      id: 3,
      question: "Calculer 2a - 3 pour a = 6",
      variable: "a = 6",
      expression: "2a - 3",
      steps: [
        { text: "Expression de départ", expr: "2a - 3", color: "text-blue-600" },
        { text: "Remplacer a par 6", expr: "2 × 6 - 3", color: "text-green-600" },
        { text: "Calculer 2 × 6", expr: "12 - 3", color: "text-orange-600" },
        { text: "Résultat", expr: "9", color: "text-purple-600" }
      ]
    },
    {
      id: 4,
      question: "Calculer y² pour y = 5",
      variable: "y = 5",
      expression: "y²",
      steps: [
        { text: "Expression de départ", expr: "y²", color: "text-blue-600" },
        { text: "Remplacer y par 5", expr: "5²", color: "text-green-600" },
        { text: "Calculer 5²", expr: "5 × 5", color: "text-orange-600" },
        { text: "Résultat", expr: "25", color: "text-purple-600" }
      ]
    },
    {
      id: 5,
      question: "Calculer 3x + 2y pour x = 4 et y = 3",
      variable: "x = 4, y = 3",
      expression: "3x + 2y",
      steps: [
        { text: "Expression de départ", expr: "3x + 2y", color: "text-blue-600" },
        { text: "Remplacer x par 4 et y par 3", expr: "3 × 4 + 2 × 3", color: "text-green-600" },
        { text: "Calculer chaque terme", expr: "12 + 6", color: "text-orange-600" },
        { text: "Résultat", expr: "18", color: "text-purple-600" }
      ]
    },

    // Niveau 2 : Avec nombres négatifs
    {
      id: 6,
      question: "Calculer 2x - 5 pour x = 1",
      variable: "x = 1",
      expression: "2x - 5",
      steps: [
        { text: "Expression de départ", expr: "2x - 5", color: "text-blue-600" },
        { text: "Remplacer x par 1", expr: "2 × 1 - 5", color: "text-green-600" },
        { text: "Calculer", expr: "2 - 5", color: "text-orange-600" },
        { text: "Résultat", expr: "-3", color: "text-purple-600" }
      ]
    },
    {
      id: 7,
      question: "Calculer -3a pour a = 4",
      variable: "a = 4",
      expression: "-3a",
      steps: [
        { text: "Expression de départ", expr: "-3a", color: "text-blue-600" },
        { text: "Remplacer a par 4", expr: "-3 × 4", color: "text-green-600" },
        { text: "Résultat", expr: "-12", color: "text-purple-600" }
      ]
    },
    {
      id: 8,
      question: "Calculer x² - 2x pour x = 3",
      variable: "x = 3",
      expression: "x² - 2x",
      steps: [
        { text: "Expression de départ", expr: "x² - 2x", color: "text-blue-600" },
        { text: "Remplacer x par 3", expr: "3² - 2 × 3", color: "text-green-600" },
        { text: "Calculer x²", expr: "9 - 2 × 3", color: "text-orange-600" },
        { text: "Calculer 2x", expr: "9 - 6", color: "text-red-600" },
        { text: "Résultat", expr: "3", color: "text-purple-600" }
      ]
    },

    // Niveau 3 : Expressions plus complexes
    {
      id: 9,
      question: "Calculer (x + 1)(x - 2) pour x = 5",
      variable: "x = 5",
      expression: "(x + 1)(x - 2)",
      steps: [
        { text: "Expression de départ", expr: "(x + 1)(x - 2)", color: "text-blue-600" },
        { text: "Remplacer x par 5", expr: "(5 + 1)(5 - 2)", color: "text-green-600" },
        { text: "Calculer les parenthèses", expr: "6 × 3", color: "text-orange-600" },
        { text: "Résultat", expr: "18", color: "text-purple-600" }
      ]
    },
    {
      id: 10,
      question: "Calculer 2a² + 3a - 1 pour a = 2",
      variable: "a = 2",
      expression: "2a² + 3a - 1",
      steps: [
        { text: "Expression de départ", expr: "2a² + 3a - 1", color: "text-blue-600" },
        { text: "Remplacer a par 2", expr: "2 × 2² + 3 × 2 - 1", color: "text-green-600" },
        { text: "Calculer a²", expr: "2 × 4 + 3 × 2 - 1", color: "text-orange-600" },
        { text: "Calculer chaque terme", expr: "8 + 6 - 1", color: "text-red-600" },
        { text: "Résultat", expr: "13", color: "text-purple-600" }
      ]
    },

    // Niveau 4 : Variables négatives
    {
      id: 11,
      question: "Calculer x² + x pour x = -3",
      variable: "x = -3",
      expression: "x² + x",
      steps: [
        { text: "Expression de départ", expr: "x² + x", color: "text-blue-600" },
        { text: "Remplacer x par -3", expr: "(-3)² + (-3)", color: "text-green-600" },
        { text: "Calculer (-3)²", expr: "9 + (-3)", color: "text-orange-600" },
        { text: "Résultat", expr: "6", color: "text-purple-600" }
      ]
    },
    {
      id: 12,
      question: "Calculer -2y² pour y = -2",
      variable: "y = -2",
      expression: "-2y²",
      steps: [
        { text: "Expression de départ", expr: "-2y²", color: "text-blue-600" },
        { text: "Remplacer y par -2", expr: "-2 × (-2)²", color: "text-green-600" },
        { text: "Calculer (-2)²", expr: "-2 × 4", color: "text-orange-600" },
        { text: "Résultat", expr: "-8", color: "text-purple-600" }
      ]
    },

    // Niveau 5 : Deux variables
    {
      id: 13,
      question: "Calculer xy + 2 pour x = 3 et y = -1",
      variable: "x = 3, y = -1",
      expression: "xy + 2",
      steps: [
        { text: "Expression de départ", expr: "xy + 2", color: "text-blue-600" },
        { text: "Remplacer x par 3 et y par -1", expr: "3 × (-1) + 2", color: "text-green-600" },
        { text: "Calculer xy", expr: "-3 + 2", color: "text-orange-600" },
        { text: "Résultat", expr: "-1", color: "text-purple-600" }
      ]
    },
    {
      id: 14,
      question: "Calculer a² - b² pour a = 4 et b = 3",
      variable: "a = 4, b = 3",
      expression: "a² - b²",
      steps: [
        { text: "Expression de départ", expr: "a² - b²", color: "text-blue-600" },
        { text: "Remplacer a par 4 et b par 3", expr: "4² - 3²", color: "text-green-600" },
        { text: "Calculer les carrés", expr: "16 - 9", color: "text-orange-600" },
        { text: "Résultat", expr: "7", color: "text-purple-600" }
      ]
    },
    {
      id: 15,
      question: "Calculer (x + y)² pour x = 2 et y = 5",
      variable: "x = 2, y = 5",
      expression: "(x + y)²",
      steps: [
        { text: "Expression de départ", expr: "(x + y)²", color: "text-blue-600" },
        { text: "Remplacer x par 2 et y par 5", expr: "(2 + 5)²", color: "text-green-600" },
        { text: "Calculer la parenthèse", expr: "7²", color: "text-orange-600" },
        { text: "Résultat", expr: "49", color: "text-purple-600" }
      ]
    },

    // Type 6 : Comparaison de deux expressions
    {
      id: 16,
      question: "On considère A = 2x² + x - 7 et B = 3(x - 2) + 3\n\nCalculer A et B pour x = 2",
      variable: "x = 2",
      expression: "A et B",
      steps: [
        { text: "Expression A = 2x² + x - 7", expr: "A = 2x² + x - 7", color: "text-blue-600" },
        { text: "Remplacer x par 2 dans A", expr: "A = 2(2)² + 2 - 7", color: "text-green-600" },
        { text: "Calculer A", expr: "A = 2×4 + 2 - 7 = 8 + 2 - 7 = 3", color: "text-orange-600" },
        { text: "Expression B = 3(x - 2) + 3", expr: "B = 3(x - 2) + 3", color: "text-blue-600" },
        { text: "Remplacer x par 2 dans B", expr: "B = 3(2 - 2) + 3", color: "text-green-600" },
        { text: "Calculer B", expr: "B = 3×0 + 3 = 0 + 3 = 3", color: "text-orange-600" },
        { text: "Résultat", expr: "A = 3 et B = 3", color: "text-purple-600" }
      ]
    },
    {
      id: 17,
      question: "Avec A = 2x² + x - 7 et B = 3(x - 2) + 3\n\nCalculer A et B pour x = -1",
      variable: "x = -1",
      expression: "A et B",
      steps: [
        { text: "Expression A = 2x² + x - 7", expr: "A = 2x² + x - 7", color: "text-blue-600" },
        { text: "Remplacer x par -1 dans A", expr: "A = 2(-1)² + (-1) - 7", color: "text-green-600" },
        { text: "Calculer A", expr: "A = 2×1 - 1 - 7 = 2 - 1 - 7 = -6", color: "text-orange-600" },
        { text: "Expression B = 3(x - 2) + 3", expr: "B = 3(x - 2) + 3", color: "text-blue-600" },
        { text: "Remplacer x par -1 dans B", expr: "B = 3(-1 - 2) + 3", color: "text-green-600" },
        { text: "Calculer B", expr: "B = 3×(-3) + 3 = -9 + 3 = -6", color: "text-orange-600" },
        { text: "Résultat", expr: "A = -6 et B = -6", color: "text-purple-600" }
      ]
    },
    {
      id: 18,
      question: "Avec A = x² - 4 et B = (x - 2)(x + 2)\n\nCalculer A et B pour x = 3",
      variable: "x = 3",
      expression: "A et B",
      steps: [
        { text: "Expression A = x² - 4", expr: "A = x² - 4", color: "text-blue-600" },
        { text: "Remplacer x par 3 dans A", expr: "A = 3² - 4", color: "text-green-600" },
        { text: "Calculer A", expr: "A = 9 - 4 = 5", color: "text-orange-600" },
        { text: "Expression B = (x - 2)(x + 2)", expr: "B = (x - 2)(x + 2)", color: "text-blue-600" },
        { text: "Remplacer x par 3 dans B", expr: "B = (3 - 2)(3 + 2)", color: "text-green-600" },
        { text: "Calculer B", expr: "B = 1 × 5 = 5", color: "text-orange-600" },
        { text: "Résultat", expr: "A = 5 et B = 5", color: "text-purple-600" }
      ]
    },
    {
      id: 19,
      question: "Avec A = 3x + 1 et B = 2x + 5\n\nCalculer A et B pour x = 4. A et B sont-elles égales ?",
      variable: "x = 4",
      expression: "A et B",
      steps: [
        { text: "Expression A = 3x + 1", expr: "A = 3x + 1", color: "text-blue-600" },
        { text: "Remplacer x par 4 dans A", expr: "A = 3×4 + 1", color: "text-green-600" },
        { text: "Calculer A", expr: "A = 12 + 1 = 13", color: "text-orange-600" },
        { text: "Expression B = 2x + 5", expr: "B = 2x + 5", color: "text-blue-600" },
        { text: "Remplacer x par 4 dans B", expr: "B = 2×4 + 5", color: "text-green-600" },
        { text: "Calculer B", expr: "B = 8 + 5 = 13", color: "text-orange-600" },
        { text: "Résultat", expr: "A = 13 et B = 13 (égales)", color: "text-purple-600" }
      ]
    },
    {
      id: 20,
      question: "Avec A = x² + 2x + 1 et B = (x + 1)²\n\nCalculer A et B pour x = 2. Que remarquez-vous ?",
      variable: "x = 2",
      expression: "A et B",
      steps: [
        { text: "Expression A = x² + 2x + 1", expr: "A = x² + 2x + 1", color: "text-blue-600" },
        { text: "Remplacer x par 2 dans A", expr: "A = 2² + 2×2 + 1", color: "text-green-600" },
        { text: "Calculer A", expr: "A = 4 + 4 + 1 = 9", color: "text-orange-600" },
        { text: "Expression B = (x + 1)²", expr: "B = (x + 1)²", color: "text-blue-600" },
        { text: "Remplacer x par 2 dans B", expr: "B = (2 + 1)²", color: "text-green-600" },
        { text: "Calculer B", expr: "B = 3² = 9", color: "text-orange-600" },
        { text: "Résultat", expr: "A = 9 et B = 9 (identiques)", color: "text-purple-600" }
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
    const correctAnswer = currentEx.steps[currentEx.steps.length - 1].expr
    
    const userAnswerTrimmed = userAnswer.trim().toLowerCase().replace(/\s+/g, '')
    const correctAnswerTrimmed = correctAnswer.trim().toLowerCase().replace(/\s+/g, '')
    
    if (userAnswerTrimmed === correctAnswerTrimmed) {
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
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                ➗
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Substitution</h1>
                <p className="text-gray-600 text-lg">
                  Remplacer les variables par des valeurs numériques
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-blue-600">20 minutes</div>
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
                Exercices ({correctAnswers}/{exercises.length})
              </button>
            </div>
          </div>
        </div>

        {/* Cours */}
        {activeTab === 'cours' && (
          <div className="space-y-8">
            {/* Principe de base */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">🎯 Qu'est-ce que la substitution ?</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-700 mb-4">Principe</h3>
                  <p className="text-gray-700 mb-4">
                    La <span className="font-bold text-blue-600">substitution</span> consiste à remplacer une ou plusieurs variables 
                    par des valeurs numériques dans une expression littérale, puis à calculer le résultat.
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-300">
                    <div className="text-center">
                      <div className="text-lg font-mono text-blue-800 mb-2">Expression littérale → Substitution → Calcul numérique</div>
                      <div className="text-sm text-gray-600">3x + 2 → 3 × 5 + 2 → 17 (pour x = 5)</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Méthode */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-bold text-green-700 mb-4">📝 Méthode</h3>
                    <ol className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                        <span>Identifier la ou les variables</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                        <span>Remplacer chaque variable par sa valeur</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                        <span>Respecter les priorités opératoires</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                        <span>Calculer le résultat</span>
                      </li>
                    </ol>
                  </div>

                  {/* Attention */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="text-lg font-bold text-orange-700 mb-4">⚠️ Points d'attention</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500">•</span>
                        <span><strong>Parenthèses :</strong> (-3)² = 9 mais -3² = -9</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500">•</span>
                        <span><strong>Multiplication :</strong> 2x = 2 × x</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500">•</span>
                        <span><strong>Priorités :</strong> Puissances avant multiplications</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500">•</span>
                        <span><strong>Signes :</strong> Attention aux nombres négatifs</span>
                      </li>
                    </ul>
                  </div>

                  {/* Comparaison */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-700 mb-4">🔍 Comparaison d'expressions</h3>
                    <div className="space-y-3 text-gray-700">
                      <p className="mb-3">Pour comparer deux expressions A et B :</p>
                      <ol className="space-y-2 list-decimal list-inside">
                        <li>Calculer A pour la valeur donnée</li>
                        <li>Calculer B pour la même valeur</li>
                        <li>Comparer les résultats obtenus</li>
                        <li>Conclure : A = B, A &gt; B ou A &lt; B</li>
                  </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples détaillés */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
              <h2 className="text-2xl font-bold text-green-800 mb-6">📚 Exemples détaillés</h2>
              
              <div className="space-y-8">
                {/* Exemple 1 */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Exemple 1 : Substitution simple</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Expression :</span> <span className="text-gray-700">5x - 2 pour x = 4</span>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Substitution :</span> <span className="text-gray-700">5 × 4 - 2</span>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Calcul :</span> <span className="text-gray-700">20 - 2 = 18</span>
                    </div>
                  </div>
                </div>

                {/* Exemple 2 */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Exemple 2 : Avec une puissance</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Expression :</span> <span className="text-gray-700">x² + 3x pour x = -2</span>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Substitution :</span> <span className="text-gray-700">(-2)² + 3 × (-2)</span>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Calcul :</span> <span className="text-gray-700">4 + (-6) = -2</span>
                    </div>
                  </div>
                </div>

                {/* Exemple 3 */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Exemple 3 : Deux variables</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Expression :</span> <span className="text-gray-700">2a + 3b pour a = 5 et b = -1</span>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Substitution :</span> <span className="text-gray-700">2 × 5 + 3 × (-1)</span>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Calcul :</span> <span className="text-gray-700">10 + (-3) = 7</span>
                    </div>
                  </div>
                </div>

                {/* Exemple 4 */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Exemple 4 : Comparaison de deux expressions</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Expressions :</span> <span className="text-gray-700">A = 2x² + x - 7 et B = 3(x - 2) + 3 pour x = 2</span>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Calcul A :</span> <span className="text-gray-700">2(2)² + 2 - 7 = 8 + 2 - 7 = 3</span>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Calcul B :</span> <span className="text-gray-700">3(2 - 2) + 3 = 3 × 0 + 3 = 3</span>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-lg">
                      <span className="font-bold text-gray-800">Conclusion :</span> <span className="text-gray-700">A = B = 3 pour x = 2</span>
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
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-blue-900">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="flex items-center gap-4">
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
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
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-2">{currentEx.question}</div>
                <div className="text-lg text-blue-700 font-semibold">pour {currentEx.variable}</div>
              </div>

              <div className="flex flex-col items-center gap-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                  className="w-64 px-4 py-3 border-2 border-gray-300 rounded-xl text-center text-lg font-semibold text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                  />
                
                  <button
                    onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>Correct ! La réponse est {currentEx.steps[currentEx.steps.length - 1].expr}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span>Incorrect. La réponse est {currentEx.steps[currentEx.steps.length - 1].expr}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
                    </div>

            {/* Solution détaillée */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
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
                      <div className="text-lg font-semibold mb-2 text-gray-800">
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