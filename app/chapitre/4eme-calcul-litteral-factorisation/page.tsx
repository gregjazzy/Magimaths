'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '@/components/VoiceInput'

export default function Factorisation4emePage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>(new Array(20).fill(false))
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // États pour les animations
  const [animationStep, setAnimationStep] = useState(0)
  const [currentExample, setCurrentExample] = useState(0)

  // Exemples niveau 4ème (plus avancés qu'en 5ème)
  const examples = [
    {
      expression: '2x² + 4x',
      terms: ['2x²', '4x'],
      factor: '2x',
      factored: '2x(x + 2)',
      steps: [
        'On regarde ce qui est commun dans les deux termes',
        'Identifie le facteur commun : 2x',
        'Réécris 2x² comme 2x×x, et 4x comme 2x×2',
        'Extrait le facteur : 2x(x + 2)'
      ]
    },
    {
      expression: '6y² - 9y',
      terms: ['6y²', '-9y'],
      factor: '3y',
      factored: '3y(2y - 3)',
      steps: [
        'On regarde ce qui est commun dans les deux termes',
        'Identifie le facteur commun : 3y',
        'Réécris 6y² comme 3y×2y, et 9y comme 3y×3',
        'Extrait le facteur : 3y(2y - 3)'
      ]
    },
    {
      expression: '10a³ - 15a²',
      terms: ['10a³', '-15a²'],
      factor: '5a²',
      factored: '5a²(2a - 3)',
      steps: [
        'On regarde ce qui est commun dans les deux termes',
        'Identifie le facteur commun : 5a²',
        'Réécris 10a³ comme 5a²×2a, et 15a² comme 5a²×3',
        'Extrait le facteur : 5a²(2a - 3)'
      ]
    }
  ]

  const nextAnimationStep = () => {
    if (animationStep < 6) {
      setAnimationStep(prev => prev + 1)
    } else {
      setAnimationStep(0)
    }
  }

  const resetAnimation = () => {
    setAnimationStep(0)
  }

  const exercises = [
    // 🟢 NIVEAU 1-4 : Révision 5ème + Introduction 4ème
    {
      id: 'fact1',
      question: 'Factoriser : 4x + 8',
      answer: '4(x + 2)',
      steps: [
        'Identifier le facteur commun : 4',
        'Réécrire : 4x + 4×2',
        'Factoriser : 4(x + 2)',
        'Vérifier : 4(x + 2) = 4x + 8 ✓'
      ]
    },
    {
      id: 'fact2',
      question: 'Factoriser : x² + 3x',
      answer: 'x(x + 3)',
      steps: [
        'Identifier le facteur commun : x',
        'Réécrire : x×x + x×3',
        'Factoriser : x(x + 3)',
        'Vérifier : x(x + 3) = x² + 3x ✓'
      ]
    },
    {
      id: 'fact3',
      question: 'Factoriser : 2x² + 4x',
      answer: '2x(x + 2)',
      steps: [
        'Identifier le facteur commun : 2x',
        'Réécrire : 2x×x + 2x×2',
        'Factoriser : 2x(x + 2)',
        'Vérifier : 2x(x + 2) = 2x² + 4x ✓'
      ]
    },
    {
      id: 'fact4',
      question: 'Factoriser : 5y² - 10y',
      answer: '5y(y - 2)',
      steps: [
        'Identifier le facteur commun : 5y',
        'Réécrire : 5y×y - 5y×2',
        'Factoriser : 5y(y - 2)',
        'Vérifier : 5y(y - 2) = 5y² - 10y ✓'
      ]
    },

    // 🟡 NIVEAU 5-8 : Facteurs plus complexes
    {
      id: 'fact5',
      question: 'Factoriser : 6y² - 9y',
      answer: '3y(2y - 3)',
      steps: [
        'Identifier le facteur commun : 3y',
        'Réécrire : 3y×2y - 3y×3',
        'Factoriser : 3y(2y - 3)',
        'Vérifier : 3y(2y - 3) = 6y² - 9y ✓'
      ]
    },
    {
      id: 'fact6',
      question: 'Factoriser : 8a² + 12a',
      answer: '4a(2a + 3)',
      steps: [
        'Identifier le facteur commun : 4a',
        'Réécrire : 4a×2a + 4a×3',
        'Factoriser : 4a(2a + 3)',
        'Vérifier : 4a(2a + 3) = 8a² + 12a ✓'
      ]
    },
    {
      id: 'fact7',
      question: 'Factoriser : 3x² - 6x',
      answer: '3x(x - 2)',
      steps: [
        'Identifier le facteur commun : 3x',
        'Réécrire : 3x×x - 3x×2',
        'Factoriser : 3x(x - 2)',
        'Vérifier : 3x(x - 2) = 3x² - 6x ✓'
      ]
    },
    {
      id: 'fact8',
      question: 'Factoriser : 7b² + 14b',
      answer: '7b(b + 2)',
      steps: [
        'Identifier le facteur commun : 7b',
        'Réécrire : 7b×b + 7b×2',
        'Factoriser : 7b(b + 2)',
        'Vérifier : 7b(b + 2) = 7b² + 14b ✓'
      ]
    },

    // 🟠 NIVEAU 9-12 : Trois termes et coefficients plus grands
    {
      id: 'fact9',
      question: 'Factoriser : 4a² + 6a + 8',
      answer: '2(2a² + 3a + 4)',
      steps: [
        'Identifier le facteur commun : 2',
        'Réécrire : 2×2a² + 2×3a + 2×4',
        'Factoriser : 2(2a² + 3a + 4)',
        'Vérifier : 2(2a² + 3a + 4) = 4a² + 6a + 8 ✓'
      ]
    },
    {
      id: 'fact10',
      question: 'Factoriser : 9x² - 12x + 6',
      answer: '3(3x² - 4x + 2)',
      steps: [
        'Identifier le facteur commun : 3',
        'Réécrire : 3×3x² - 3×4x + 3×2',
        'Factoriser : 3(3x² - 4x + 2)',
        'Vérifier : 3(3x² - 4x + 2) = 9x² - 12x + 6 ✓'
      ]
    },
    {
      id: 'fact11',
      question: 'Factoriser : 6x² + 9x - 3',
      answer: '3(2x² + 3x - 1)',
      steps: [
        'Identifier le facteur commun : 3',
        'Réécrire : 3×2x² + 3×3x - 3×1',
        'Factoriser : 3(2x² + 3x - 1)',
        'Vérifier : 3(2x² + 3x - 1) = 6x² + 9x - 3 ✓'
      ]
    },
    {
      id: 'fact12',
      question: 'Factoriser : 10y² - 15y + 5',
      answer: '5(2y² - 3y + 1)',
      steps: [
        'Identifier le facteur commun : 5',
        'Réécrire : 5×2y² - 5×3y + 5×1',
        'Factoriser : 5(2y² - 3y + 1)',
        'Vérifier : 5(2y² - 3y + 1) = 10y² - 15y + 5 ✓'
      ]
    },

    // 🔴 NIVEAU 13-16 : Facteurs littéraux complexes
    {
      id: 'fact13',
      question: 'Factoriser : 4a² + 6a',
      answer: '2a(2a + 3)',
      steps: [
        'Identifier le facteur commun : 2a',
        'Réécrire : 2a×2a + 2a×3',
        'Factoriser : 2a(2a + 3)',
        'Vérifier : 2a(2a + 3) = 4a² + 6a ✓'
      ]
    },
    {
      id: 'fact14',
      question: 'Factoriser : 9x² - 12x',
      answer: '3x(3x - 4)',
      steps: [
        'Identifier le facteur commun : 3x',
        'Réécrire : 3x×3x - 3x×4',
        'Factoriser : 3x(3x - 4)',
        'Vérifier : 3x(3x - 4) = 9x² - 12x ✓'
      ]
    },
    {
      id: 'fact15',
      question: 'Factoriser : 8y² + 12y',
      answer: '4y(2y + 3)',
      steps: [
        'Identifier le facteur commun : 4y',
        'Réécrire : 4y×2y + 4y×3',
        'Factoriser : 4y(2y + 3)',
        'Vérifier : 4y(2y + 3) = 8y² + 12y ✓'
      ]
    },
    {
      id: 'fact16',
      question: 'Factoriser : 15b² - 20b',
      answer: '5b(3b - 4)',
      steps: [
        'Identifier le facteur commun : 5b',
        'Réécrire : 5b×3b - 5b×4',
        'Factoriser : 5b(3b - 4)',
        'Vérifier : 5b(3b - 4) = 15b² - 20b ✓'
      ]
    },

    // 🟣 NIVEAU 17-20 : Puissances au cube - Niveau 4ème complet
    {
      id: 'fact17',
      question: 'Factoriser : 6x³ + 9x²',
      answer: '3x²(2x + 3)',
      steps: [
        'Identifier le facteur commun : 3x²',
        'Réécrire : 3x²×2x + 3x²×3',
        'Factoriser : 3x²(2x + 3)',
        'Vérifier : 3x²(2x + 3) = 6x³ + 9x² ✓'
      ]
    },
    {
      id: 'fact18',
      question: 'Factoriser : 10a³ - 15a²',
      answer: '5a²(2a - 3)',
      steps: [
        'Identifier le facteur commun : 5a²',
        'Réécrire : 5a²×2a - 5a²×3',
        'Factoriser : 5a²(2a - 3)',
        'Vérifier : 5a²(2a - 3) = 10a³ - 15a² ✓'
      ]
    },
    {
      id: 'fact19',
      question: 'Factoriser : 12y³ - 8y² + 4y',
      answer: '4y(3y² - 2y + 1)',
      steps: [
        'Identifier le facteur commun : 4y',
        'Réécrire : 4y×3y² - 4y×2y + 4y×1',
        'Factoriser : 4y(3y² - 2y + 1)',
        'Vérifier : 4y(3y² - 2y + 1) = 12y³ - 8y² + 4y ✓'
      ]
    },
    {
      id: 'fact20',
      question: 'Factoriser : 18x³ + 12x² - 6x',
      answer: '6x(3x² + 2x - 1)',
      steps: [
        'Identifier le facteur commun : 6x',
        'Réécrire : 6x×3x² + 6x×2x - 6x×1',
        'Factoriser : 6x(3x² + 2x - 1)',
        'Vérifier : 6x(3x² + 2x - 1) = 18x³ + 12x² - 6x ✓'
      ]
    }
  ]

  const checkAnswer = () => {
    const correctAnswer = exercises[currentExercise].answer.toLowerCase().replace(/\s/g, '')
    const userAnswerClean = userAnswer.toLowerCase().replace(/\s/g, '')
    
    const isCorrect = userAnswerClean === correctAnswer
    
    // Mettre à jour le tableau des bonnes réponses
    const newCorrectAnswers = [...correctAnswers]
    if (isCorrect && !newCorrectAnswers[currentExercise]) {
      // Nouvelle bonne réponse
      newCorrectAnswers[currentExercise] = true
      setCorrectAnswers(newCorrectAnswers)
      setScore(newCorrectAnswers.filter(Boolean).length)
    } else if (isCorrect) {
      // Déjà marqué comme correct, ne pas changer le score
    }
    
    setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
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
    setCorrectAnswers(new Array(20).fill(false))
    setAnswerFeedback(null)
  }

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1)
      setUserAnswer('')
      setShowAnswer(false)
      setAnswerFeedback(null)
    }
  }

  return (
    <>
      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }
        @keyframes slideFromTop {
          from {
            opacity: 0;
            transform: translateY(-100px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideFromTop {
          animation: slideFromTop 1s ease-out forwards;
        }
        @keyframes slideToCenter {
          from {
            opacity: 0;
            transform: translateY(-80px) translateX(-50px) scale(0.7);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-40px) translateX(-25px) scale(0.85);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0) scale(1);
          }
        }
        .animate-slideToCenter {
          animation: slideToCenter 1s ease-out forwards;
        }
      `}</style>

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
          <div className="space-y-8">
            {/* Définition principale */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📚 Qu'est-ce que la factorisation ?
              </h2>
              
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                  🎯 Définition
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Factoriser, c'est transformer une <span className="font-bold text-blue-600">somme ou une différence</span> en un <span className="font-bold text-green-600">produit</span>.
                </p>
              </div>


            </div>

            {/* Animation interactive principale */}
            <div className="bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-7 h-7 text-blue-500" />
                  Animation Interactive
                </h2>
              </div>

              {/* Section Exemples niveau 4ème */}
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200 mb-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  ✨ Exemples
                </h3>
                <p className="text-yellow-700 mb-6">
                  Choisis un exemple ci-dessous pour voir l'animation :
                </p>
                
                {/* Boutons pour les 3 exemples */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setCurrentExample(0)
                      resetAnimation()
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      currentExample === 0
                        ? 'bg-blue-100 border-blue-400 text-blue-800'
                        : 'bg-white border-yellow-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">Exemple 1 : 2x² + 4x</div>
                    <div className="text-sm text-gray-600 mb-2">• Facteur commun : 2x</div>
                    <div className="text-sm text-gray-600">• Résultat : 2x(x + 2)</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentExample(1)
                      resetAnimation()
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      currentExample === 1
                        ? 'bg-blue-100 border-blue-400 text-blue-800'
                        : 'bg-white border-yellow-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">Exemple 2 : 6y² - 9y</div>
                    <div className="text-sm text-gray-600 mb-2">• Facteur commun : 3y</div>
                    <div className="text-sm text-gray-600">• Résultat : 3y(2y - 3)</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentExample(2)
                      resetAnimation()
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      currentExample === 2
                        ? 'bg-blue-100 border-blue-400 text-blue-800'
                        : 'bg-white border-yellow-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">Exemple 3 : 10a³ - 15a²</div>
                    <div className="text-sm text-gray-600 mb-2">• Facteur commun : 5a²</div>
                    <div className="text-sm text-gray-600">• Résultat : 5a²(2a - 3)</div>
                  </button>
                </div>
              </div>

              {/* Boutons de contrôle de l'animation */}
              <div className="flex justify-center gap-3 mb-6">
                <button
                  onClick={resetAnimation}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
                <button
                  onClick={nextAnimationStep}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play className="inline w-4 h-4 mr-2" />
                  {animationStep >= 6 ? 'Recommencer' : `Suivant (${animationStep + 1}/7)`}
                </button>
              </div>
              
              {/* Zone d'animation principale */}
              <div className="bg-white rounded-2xl p-8 border border-blue-100 min-h-[300px] flex flex-col justify-center">
                <div className="text-center space-y-6">
                  {/* Animation de factorisation étape par étape - Version 4ème */}
                  <div className="space-y-8">
                    {/* Expression originale (toujours visible) */}
                    <div className="text-3xl font-bold text-gray-800">
                      <div className="flex items-center justify-center gap-2">
                        {examples[currentExample].terms.map((term, index) => {
                          const factor = examples[currentExample].factor
                          let displayTerm = term
                          let sign = ''
                          
                          // Gérer le signe pour les termes négatifs
                          if (term.startsWith('-')) {
                            sign = '-'
                            displayTerm = term.substring(1)
                          } else if (index > 0) {
                            sign = '+'
                          }
                          
                          return (
                            <span key={index} className="text-gray-800">
                              {sign && <span className="text-gray-600 mr-1">{sign}</span>}
                              {displayTerm}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {/* Étape 1 : Afficher la décomposition SANS couleurs */}
                    {animationStep === 1 && (
                      <div className="animate-slideInLeft">
                        <div className="text-2xl font-bold text-gray-800 mb-3">
                          <div className="flex items-center justify-center gap-2">
                            {currentExample === 0 && (
                              <>
                                <span className="text-gray-800">2x</span>
                                <span className="text-gray-600">×</span>
                                <span className="text-gray-800">x</span>
                                <span className="text-gray-600 mx-2">+</span>
                                <span className="text-gray-800">2x</span>
                                <span className="text-gray-600">×</span>
                                <span className="text-gray-800">2</span>
                              </>
                            )}
                            {currentExample === 1 && (
                              <>
                                <span className="text-gray-800">3y</span>
                                <span className="text-gray-600">×</span>
                                <span className="text-gray-800">2y</span>
                                <span className="text-gray-600 mx-2">-</span>
                                <span className="text-gray-800">3y</span>
                                <span className="text-gray-600">×</span>
                                <span className="text-gray-800">3</span>
                              </>
                            )}
                            {currentExample === 2 && (
                              <>
                                <span className="text-gray-800">5a²</span>
                                <span className="text-gray-600">×</span>
                                <span className="text-gray-800">2a</span>
                                <span className="text-gray-600 mx-2">-</span>
                                <span className="text-gray-800">5a²</span>
                                <span className="text-gray-600">×</span>
                                <span className="text-gray-800">3</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-purple-800 font-medium bg-purple-50 px-4 py-2 rounded-lg border border-purple-200 max-w-lg mx-auto">
                          {currentExample === 0 && "⚡ Décomposition : 2x² = 2x × x et 4x = 2x × 2"}
                          {currentExample === 1 && "⚡ Décomposition : 6y² = 3y × 2y et 9y = 3y × 3"}
                          {currentExample === 2 && "⚡ Décomposition : 10a³ = 5a² × 2a et 15a² = 5a² × 3"}
                        </div>
                      </div>
                    )}

                    {/* Étape 2 : Afficher la décomposition avec facteurs en bleu */}
                    {animationStep >= 2 && (
                      <div className="animate-slideInLeft">
                        <div className="text-2xl font-bold text-gray-800 mb-3">
                          <div className="flex items-center justify-center gap-2">
                            {currentExample === 0 && (
                              <>
                                <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">2x</span>
                                <span className="text-gray-600">×</span>
                                <span className={`px-2 py-1 rounded transition-all duration-1000 ${
                                  animationStep >= 4 ? 'bg-yellow-200 text-yellow-800' : 'text-gray-800'
                                }`}>x</span>
                                <span className={`mx-2 transition-all duration-1000 ${
                                  animationStep >= 4 ? 'text-yellow-600 bg-yellow-100 px-1 rounded font-bold' : 'text-gray-600'
                                }`}>+</span>
                                <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">2x</span>
                                <span className="text-gray-600">×</span>
                                <span className={`px-2 py-1 rounded transition-all duration-1000 ${
                                  animationStep >= 4 ? 'bg-yellow-200 text-yellow-800' : 'text-gray-800'
                                }`}>2</span>
                              </>
                            )}
                            {currentExample === 1 && (
                              <>
                                <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">3y</span>
                                <span className="text-gray-600">×</span>
                                <span className={`px-2 py-1 rounded transition-all duration-1000 ${
                                  animationStep >= 4 ? 'bg-yellow-200 text-yellow-800' : 'text-gray-800'
                                }`}>2y</span>
                                <span className={`mx-2 transition-all duration-1000 ${
                                  animationStep >= 4 ? 'text-yellow-600 bg-yellow-100 px-1 rounded font-bold' : 'text-gray-600'
                                }`}>-</span>
                                <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">3y</span>
                                <span className="text-gray-600">×</span>
                                <span className={`px-2 py-1 rounded transition-all duration-1000 ${
                                  animationStep >= 4 ? 'bg-yellow-200 text-yellow-800' : 'text-gray-800'
                                }`}>3</span>
                              </>
                            )}
                            {currentExample === 2 && (
                              <>
                                <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">5a²</span>
                                <span className="text-gray-600">×</span>
                                <span className={`px-2 py-1 rounded transition-all duration-1000 ${
                                  animationStep >= 4 ? 'bg-yellow-200 text-yellow-800' : 'text-gray-800'
                                }`}>2a</span>
                                <span className={`mx-2 transition-all duration-1000 ${
                                  animationStep >= 4 ? 'text-yellow-600 bg-yellow-100 px-1 rounded font-bold' : 'text-gray-600'
                                }`}>-</span>
                                <span className="bg-blue-200 px-2 py-1 rounded text-blue-800">5a²</span>
                                <span className="text-gray-600">×</span>
                                <span className={`px-2 py-1 rounded transition-all duration-1000 ${
                                  animationStep >= 4 ? 'bg-yellow-200 text-yellow-800' : 'text-gray-800'
                                }`}>3</span>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Explications selon l'étape */}
                        {animationStep === 2 && (
                          <div className="text-sm text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 max-w-md mx-auto">
                            💙 Les facteurs communs {examples[currentExample].factor} sont maintenant colorés en bleu
                          </div>
                        )}

                        {animationStep === 4 && (
                          <div className="text-sm text-yellow-800 font-medium bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 max-w-md mx-auto">
                            ✨ Colorier en jaune ce qui ira dans les parenthèses
                            {currentExample === 2 && (
                              <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                💛 Les éléments "2a" et "-3" sont maintenant colorés en jaune
                              </div>
                            )}
                          </div>
                        )}
                        {animationStep === 5 && (
                          <div className="text-sm text-green-800 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200 max-w-md mx-auto">
                            🎯 Les éléments jaunes glissent dans les parenthèses
                          </div>
                        )}
                        {animationStep === 6 && (
                          <div className="text-sm text-green-800 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200 max-w-md mx-auto">
                            🎯 Résultat final de la factorisation
                            {currentExample === 2 && (
                              <div className="mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                ✅ Résultat : 5a²(2a - 3)
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Étape 3+ : Facteurs qui glissent pour former le facteur commun */}
                    {animationStep >= 3 && animationStep < 6 && (
                      <div className="flex items-center justify-center">
                        <div className="text-3xl font-bold flex items-center">
                          <span className="bg-blue-200 px-4 py-2 rounded-lg font-bold text-blue-800 animate-slideFromTop mr-8">
                            {examples[currentExample].factor}
                          </span>
                          <span className="text-gray-800 text-4xl">(</span>
                          <span className="w-32 flex items-center justify-center">
                            {animationStep >= 5 && (
                              <span className="bg-yellow-200 px-2 py-1 rounded font-bold text-yellow-800 animate-slideToCenter">
                                {examples[currentExample].factored.split('(')[1].split(')')[0]}
                              </span>
                            )}
                          </span>
                          <span className="text-gray-800 text-4xl">)</span>
                        </div>
                      </div>
                    )}

                    {/* Étape 6 : Garder l'expression précédente + ajouter le résultat final en vert */}
                    {animationStep >= 6 && (
                      <div className="space-y-6">
                        {/* Garder l'expression avec parenthèses remplies */}
                        <div className="flex items-center justify-center">
                          <div className="text-3xl font-bold flex items-center">
                            <span className="bg-blue-200 px-4 py-2 rounded-lg font-bold text-blue-800 mr-8">
                              {examples[currentExample].factor}
                            </span>
                            <span className="text-gray-800 text-4xl">(</span>
                            <span className="bg-yellow-200 px-2 py-1 rounded font-bold text-yellow-800">
                              {examples[currentExample].factored.split('(')[1].split(')')[0]}
                            </span>
                            <span className="text-gray-800 text-4xl">)</span>
                          </div>
                        </div>
                        
                        {/* Nouvelle expression verte en dessous */}
                        <div className="text-3xl font-bold text-green-600 bg-green-50 py-4 px-6 rounded-xl border border-green-200 animate-slideInLeft">
                          {examples[currentExample].factored}
                          <div className="text-sm text-green-700 font-medium mt-2">
                            ✨ Expression factorisée niveau 4ème !
                            {currentExample === 2 && (
                              <div className="text-xs text-green-600 mt-1 bg-green-100 px-2 py-1 rounded">
                                🎯 Le "2a" vient de : 10a³ = 5a² × 2a, on garde le "2a"
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Indication du cas actuel */}
              <div className="flex justify-center mt-4">
                <div className="bg-blue-100 px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-blue-800 font-medium">
                    Cas actuel : {examples[currentExample].expression} → {examples[currentExample].factored}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exercices' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            {/* En-tête avec progression et score */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-600">
                    📊 Score : <span className="text-green-600 font-bold">{score}</span> / <span className="text-gray-800">{exercises.length}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    🎯 Progression : <span className="text-blue-600 font-bold">{Math.round((score / exercises.length) * 100)}%</span>
                  </div>
                </div>
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

            {/* Boutons de navigation */}
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={previousExercise}
                disabled={currentExercise === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              
              <button
                onClick={nextExercise}
                disabled={currentExercise === exercises.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
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

                    {score === exercises.length && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl border border-yellow-200">
                        <div className="text-center">
                          <p className="text-yellow-800 font-bold text-lg mb-2">
                            🎉 FÉLICITATIONS ! 🎉
                          </p>
                          <p className="text-green-700 font-medium">
                            Tu as réussi tous les {exercises.length} exercices de factorisation 4ème !
                            <br />
                            <span className="text-2xl">🏆 100% de réussite ! 🏆</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {score > 0 && score < exercises.length && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-blue-800 font-medium text-center">
                          💪 Continue ! Tu as réussi {score} exercice{score > 1 ? 's' : ''} sur {exercises.length}
                          <br />
                          <span className="text-lg">Il te reste {exercises.length - score} exercice{exercises.length - score > 1 ? 's' : ''} à faire ! 🚀</span>
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
    </>
  )
} 