'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '@/components/VoiceInput'

export default function FactorisationPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>(new Array(20).fill(false))
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // États pour les animations
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTransformation, setShowTransformation] = useState(false)
  const [currentExample, setCurrentExample] = useState(0)

  const examples = [
    {
      expression: '3x + 3y',
      factor: '3',
      terms: ['3x', '3y'],
      factored: '3(x + y)',
      steps: [
        'On regarde ce qui est commun de chaque côté du signe plus',
        'Identifie le facteur commun : 3',
        'Divise chaque terme par 3 : x + y',
        'Écris le résultat : 3(x + y)'
      ]
    },
    {
      expression: '2x + 6',
      factor: '2',
      terms: ['2x', '6'],
      factored: '2(x + 3)',
      steps: [
        'On regarde ce qui est commun de chaque côté du signe plus',
        'Identifie le facteur commun : 2',
        'Réécris 6 comme 2×3, et 2x reste 2×x',
        'Extrait le facteur : 2(x + 3)'
      ]
    },
    {
      expression: '3 + 3x',
      factor: '3',
      terms: ['3', '3x'],
      factored: '3(1 + x)',
      steps: [
        'On regarde ce qui est commun dans les deux termes',
        'Identifie le facteur commun : 3',
        'Réécris 3 comme 3×1, et 3x reste 3×x',
        'Extrait le facteur : 3(1 + x)'
      ]
    }
  ]

  // Animation automatique désactivée - contrôle manuel uniquement

  // Animation highlights désactivée

  const startAnimation = () => {
    setIsAnimating(true)
    setAnimationStep(0)
    setShowTransformation(false)
    
    setTimeout(() => {
      setShowTransformation(true)
    }, 1000)
    
    setTimeout(() => {
      setIsAnimating(false)
    }, 4000)
  }

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
    // 🟢 NIVEAU 1-4 : Très facile - Facteur commun simple (2 termes)
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
      question: 'Factoriser : 5m + 5n',
      answer: '5(m + n)',
      steps: [
        'Identifier le facteur commun : 5',
        'Factoriser : 5(m + n)',
        'Vérifier : 5(m + n) = 5m + 5n ✓'
      ]
    },
    {
      id: 'fact4',
      question: 'Factoriser : 4u + 4v',
      answer: '4(u + v)',
      steps: [
        'Identifier le facteur commun : 4',
        'Factoriser : 4(u + v)',
        'Vérifier : 4(u + v) = 4u + 4v ✓'
      ]
    },

    // 🟡 NIVEAU 5-8 : Facile - Avec constantes et soustraction
    {
      id: 'fact5',
      question: 'Factoriser : 3x + 6',
      answer: '3(x + 2)',
      steps: [
        'Identifier le facteur commun : 3',
        'Réécrire : 3x + 3×2',
        'Factoriser : 3(x + 2)',
        'Vérifier : 3(x + 2) = 3x + 6 ✓'
      ]
    },
    {
      id: 'fact6',
      question: 'Factoriser : 2a + 8',
      answer: '2(a + 4)',
      steps: [
        'Identifier le facteur commun : 2',
        'Réécrire : 2a + 2×4',
        'Factoriser : 2(a + 4)',
        'Vérifier : 2(a + 4) = 2a + 8 ✓'
      ]
    },
    {
      id: 'fact7',
      question: 'Factoriser : 5y - 5z',
      answer: '5(y - z)',
      steps: [
        'Identifier le facteur commun : 5',
        'Factoriser : 5(y - z)',
        'Vérifier : 5(y - z) = 5y - 5z ✓'
      ]
    },
    {
      id: 'fact8',
      question: 'Factoriser : 6x - 12',
      answer: '6(x - 2)',
      steps: [
        'Identifier le facteur commun : 6',
        'Réécrire : 6x - 6×2',
        'Factoriser : 6(x - 2)',
        'Vérifier : 6(x - 2) = 6x - 12 ✓'
      ]
    },

    // 🟠 NIVEAU 9-12 : Moyen - Facteur littéral et cas avec "1"
    {
      id: 'fact9',
      question: 'Factoriser : ax + ay',
      answer: 'a(x + y)',
      steps: [
        'Identifier le facteur commun : a',
        'Factoriser : a(x + y)',
        'Vérifier : a(x + y) = ax + ay ✓'
      ]
    },
    {
      id: 'fact10',
      question: 'Factoriser : 7 + 7t',
      answer: '7(1 + t)',
      steps: [
        'Identifier le facteur commun : 7',
        'Réécrire : 7×1 + 7t',
        'Factoriser : 7(1 + t)',
        'Vérifier : 7(1 + t) = 7 + 7t ✓'
      ]
    },
    {
      id: 'fact11',
      question: 'Factoriser : bx - by',
      answer: 'b(x - y)',
      steps: [
        'Identifier le facteur commun : b',
        'Factoriser : b(x - y)',
        'Vérifier : b(x - y) = bx - by ✓'
      ]
    },
    {
      id: 'fact12',
      question: 'Factoriser : 4t + 4',
      answer: '4(t + 1)',
      steps: [
        'Identifier le facteur commun : 4',
        'Réécrire : 4t + 4×1',
        'Factoriser : 4(t + 1)',
        'Vérifier : 4(t + 1) = 4t + 4 ✓'
      ]
    },

    // 🔴 NIVEAU 13-16 : Moyen-difficile - Trois termes
    {
      id: 'fact13',
      question: 'Factoriser : 3x + 3y + 3z',
      answer: '3(x + y + z)',
      steps: [
        'Identifier le facteur commun : 3',
        'Factoriser : 3(x + y + z)',
        'Vérifier : 3(x + y + z) = 3x + 3y + 3z ✓'
      ]
    },
    {
      id: 'fact14',
      question: 'Factoriser : 2a + 2b - 2c',
      answer: '2(a + b - c)',
      steps: [
        'Identifier le facteur commun : 2',
        'Factoriser : 2(a + b - c)',
        'Vérifier : 2(a + b - c) = 2a + 2b - 2c ✓'
      ]
    },
    {
      id: 'fact15',
      question: 'Factoriser : x² + x',
      answer: 'x(x + 1)',
      steps: [
        'Identifier le facteur commun : x',
        'Réécrire : x×x + x×1',
        'Factoriser : x(x + 1)',
        'Vérifier : x(x + 1) = x² + x ✓'
      ]
    },
    {
      id: 'fact16',
      question: 'Factoriser : 6x + 6y + 6',
      answer: '6(x + y + 1)',
      steps: [
        'Identifier le facteur commun : 6',
        'Réécrire : 6x + 6y + 6×1',
        'Factoriser : 6(x + y + 1)',
        'Vérifier : 6(x + y + 1) = 6x + 6y + 6 ✓'
      ]
    },

    // 🟣 NIVEAU 17-20 : Difficile - Cas complexes niveau 5ème
    {
      id: 'fact17',
      question: 'Factoriser : 8a - 8b + 8c - 8',
      answer: '8(a - b + c - 1)',
      steps: [
        'Identifier le facteur commun : 8',
        'Réécrire : 8a - 8b + 8c - 8×1',
        'Factoriser : 8(a - b + c - 1)',
        'Vérifier : 8(a - b + c - 1) = 8a - 8b + 8c - 8 ✓'
      ]
    },
    {
      id: 'fact18',
      question: 'Factoriser : 2x² + 2x',
      answer: '2x(x + 1)',
      steps: [
        'Identifier le facteur commun : 2x',
        'Réécrire : 2x×x + 2x×1',
        'Factoriser : 2x(x + 1)',
        'Vérifier : 2x(x + 1) = 2x² + 2x ✓'
      ]
    },
    {
      id: 'fact19',
      question: 'Factoriser : 9u - 9v - 9w',
      answer: '9(u - v - w)',
      steps: [
        'Identifier le facteur commun : 9',
        'Factoriser : 9(u - v - w)',
        'Vérifier : 9(u - v - w) = 9u - 9v - 9w ✓'
      ]
    },
    {
      id: 'fact20',
      question: 'Factoriser : 3x² + 6x',
      answer: '3x(x + 2)',
      steps: [
        'Identifier le facteur commun : 3x',
        'Réécrire : 3x×x + 3x×2',
        'Factoriser : 3x(x + 2)',
        'Vérifier : 3x(x + 2) = 3x² + 6x ✓'
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



  const resetExercise = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore(0)
    setCorrectAnswers(new Array(20).fill(false))
    setAnswerFeedback(null)
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
        @keyframes slideFromRight {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-slideFromRight {
          animation: slideFromRight 1s ease-out forwards;
        }
        @keyframes slideFromTop {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
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
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">


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
            <div className="space-y-8">
              {/* Définition principale */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  📚 Qu'est-ce que la factorisation ?
                </h2>
                
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
                    🎯 Définition
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Factoriser, c'est transformer une <span className="font-bold text-purple-600">somme ou une différence</span> en un <span className="font-bold text-green-600">produit</span>. 
                    On cherche le <span className="bg-yellow-200 px-2 py-1 rounded font-bold">facteur commun</span> dans tous les termes.
                  </p>
                </div>
              </div>

              {/* Animation interactive principale */}
              <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
                <div className="flex items-center justify-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-7 h-7 text-purple-500" />
                    Animation Interactive
                  </h2>
                </div>

                {/* Préambule : Présentation des 3 cas */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mb-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                    👁️ Bien observer les 3 cas de factorisation
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Avant de commencer l'animation, choisis un des 3 cas ci-dessous pour voir comment factoriser différents types d'expressions :
                  </p>
                  
                  {/* Boutons pour les 3 cas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        setCurrentExample(0)
                        resetAnimation()
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentExample === 0
                          ? 'bg-purple-100 border-purple-400 text-purple-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-2">Cas 1 : Addition</div>
                      <div className="text-2xl font-mono mb-2">{examples[0].expression}</div>
                      <div className="text-sm">Facteur commun : {examples[0].factor}</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setCurrentExample(1)
                        resetAnimation()
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentExample === 1
                          ? 'bg-purple-100 border-purple-400 text-purple-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-2">Cas 2 : Avec constante</div>
                      <div className="text-2xl font-mono mb-2">{examples[1].expression}</div>
                      <div className="text-sm">Facteur commun : {examples[1].factor}</div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setCurrentExample(2)
                        resetAnimation()
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentExample === 2
                          ? 'bg-purple-100 border-purple-400 text-purple-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-2">Cas 3 : Avec le "1"</div>
                      <div className="text-2xl font-mono mb-2">{examples[2].expression}</div>
                      <div className="text-sm">Facteur commun : {examples[2].factor}</div>
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
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Play className="inline w-4 h-4 mr-2" />
                    {animationStep >= 6 ? 'Recommencer' : `Suivant (${animationStep + 1}/7)`}
                  </button>
                </div>
                
                {/* Zone d'animation principale */}
                <div className="bg-white rounded-2xl p-8 border border-purple-100 min-h-[300px] flex flex-col justify-center">
                  <div className="text-center space-y-6">
                    {/* Animation de factorisation étape par étape */}
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
                            
                            // Vérifier si le terme a le facteur commun
                            let hasCommonFactor = false
                            let factorPart = ''
                            let remainingPart = ''
                            
                            if (displayTerm === factor) {
                              // Cas où le terme est exactement le facteur (ex: 3 avec facteur 3 = 3×1)
                              hasCommonFactor = true
                              factorPart = factor
                              remainingPart = '×1'
                            } else if (displayTerm.includes(factor)) {
                              // Cas où le facteur apparaît littéralement (ex: 2x)
                              hasCommonFactor = true
                              factorPart = factor
                              remainingPart = displayTerm.replace(factor, '')
                            } else if (!isNaN(Number(displayTerm)) && Number(displayTerm) % Number(factor) === 0) {
                              // Cas où c'est un nombre divisible par le facteur (ex: 6 = 2×3)
                              hasCommonFactor = true
                              factorPart = factor
                              remainingPart = `×${Number(displayTerm) / Number(factor)}`
                            }
                            
                            if (hasCommonFactor && animationStep >= 6) {
                              // Étape 6 : Colorer ce qui reste après extraction du facteur (dans l'expression du haut)
                              
                              return (
                                <span key={index} className="transition-all duration-1000">
                                  {sign && <span className="text-gray-600 mr-1">{sign}</span>}
                                  <span className="text-gray-300 px-2 py-1 rounded">
                                    {factorPart}
                                  </span>
                                  <span className="bg-blue-200 px-2 py-1 rounded font-bold text-blue-800">
                                    {remainingPart}
                                  </span>
                                </span>
                              )
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

                      {/* Étape 1 : Copie de l'expression avec facteurs colorés */}
                      {animationStep >= 1 && (
                        <div className="animate-slideInLeft">
                          <div className="text-2xl font-bold text-gray-800 mb-3">
                            <div className="flex items-center justify-center gap-2">
                              {examples[currentExample].terms.map((term, index) => {
                                const factor = examples[currentExample].factor
                                let displayTerm = term
                                let sign = ''
                                
                                if (term.startsWith('-')) {
                                  sign = '-'
                                  displayTerm = term.substring(1)
                                } else if (index > 0) {
                                  sign = '+'
                                }
                                
                                // Vérifier si le terme a le facteur commun
                                let hasCommonFactor = false
                                let factorPart = ''
                                let remainingPart = ''
                                
                                if (displayTerm === factor) {
                                  // Cas où le terme est exactement le facteur (ex: 3 avec facteur 3 = 3×1)
                                  hasCommonFactor = true
                                  factorPart = factor
                                  remainingPart = '×1'
                                } else if (displayTerm.includes(factor)) {
                                  // Cas où le facteur apparaît littéralement (ex: 2x)
                                  hasCommonFactor = true
                                  factorPart = factor
                                  remainingPart = displayTerm.replace(factor, '')
                                } else if (!isNaN(Number(displayTerm)) && Number(displayTerm) % Number(factor) === 0) {
                                  // Cas où c'est un nombre divisible par le facteur (ex: 6 = 2×3)
                                  hasCommonFactor = true
                                  factorPart = factor
                                  remainingPart = `×${Number(displayTerm) / Number(factor)}`
                                }
                                
                                if (hasCommonFactor) {
                                  
                                  return (
                                    <span key={index} className="transition-all duration-1000">
                                      {sign && (
                                        <span className={`mr-1 transition-all duration-1000 ${
                                          animationStep >= 5
                                            ? 'text-yellow-400 bg-yellow-100 px-1 rounded opacity-30'
                                            : animationStep >= 4 
                                            ? 'text-yellow-600 bg-yellow-200 px-1 rounded font-bold' 
                                            : 'text-gray-600'
                                        }`}>
                                          {sign}
                                        </span>
                                      )}
                                      <span className={`px-2 py-1 rounded font-bold transition-all duration-1000 ${
                                        animationStep >= 3 
                                          ? 'bg-purple-100 text-purple-400 opacity-50' 
                                          : 'bg-purple-200 text-purple-800'
                                      }`}>
                                        {factorPart}
                                      </span>
                                      <span className={`transition-all duration-1000 ${
                                        animationStep >= 5
                                          ? 'bg-yellow-100 px-2 py-1 rounded text-yellow-400 opacity-30'
                                          : animationStep >= 4 
                                          ? 'bg-yellow-200 px-2 py-1 rounded font-bold text-yellow-800' 
                                          : 'text-gray-800'
                                      }`}>
                                        {remainingPart}
                                      </span>
                                    </span>
                                  )
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
                          {/* Explications selon l'étape */}
                          {animationStep === 1 && (
                            <div className="text-sm text-purple-800 font-medium bg-purple-50 px-4 py-2 rounded-lg border border-purple-200 max-w-md mx-auto">
                              🎯 {examples[currentExample].factor} est le facteur commun car identique {examples[currentExample].terms.length > 2 ? 'dans tous les termes' : examples[currentExample].expression.includes('-') ? 'des 2 côtés du signe moins' : 'des 2 côtés du signe plus'}
                              {currentExample === 1 && (
                                <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  💡 Astuce : 6 = 2×3, c'est pourquoi on voit apparaître "×3" !
                                </div>
                              )}
                              {currentExample === 2 && (
                                <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  💡 Astuce : {examples[currentExample].factor} = {examples[currentExample].factor}×1, c'est pourquoi on voit apparaître "×1" !
                                </div>
                              )}
                            </div>
                          )}
                          {animationStep === 4 && (
                            <div className="text-sm text-yellow-800 font-medium bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 max-w-md mx-auto">
                              ✨ Colorier en jaune ce qu'il reste
                              {currentExample === 1 && (
                                <div className="mt-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  🔍 Regardez bien : 6 fait apparaître "×3" car 6 = 2×3
                                </div>
                              )}
                              {currentExample === 2 && (
                                <div className="mt-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  🔍 Regardez bien : {examples[currentExample].factor} fait apparaître "×1" car {examples[currentExample].factor} = {examples[currentExample].factor}×1
                                </div>
                              )}
                            </div>
                          )}
                          {animationStep === 5 && (
                            <div className="text-sm text-green-800 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200 max-w-md mx-auto">
                              🎯 Les éléments jaunes glissent entre les parenthèses
                            </div>
                          )}
                        </div>
                      )}

                      {/* Étape 3+ : Facteurs qui glissent pour former le facteur commun */}
                      {animationStep >= 3 && animationStep < 6 && (
                        <div className="flex items-center justify-center">
                          <div className="text-3xl font-bold flex items-center">
                            <span className="bg-purple-200 px-4 py-2 rounded-lg font-bold text-purple-800 animate-slideFromTop mr-8">
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
                              <span className="bg-purple-200 px-4 py-2 rounded-lg font-bold text-purple-800 mr-8">
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
                              ✨ Expression factorisée !
                              {currentExample === 1 && (
                                <div className="text-xs text-green-600 mt-1 bg-green-100 px-2 py-1 rounded">
                                  🎯 Le "3" vient de : 6 = 2×3, on garde le "3"
                                </div>
                              )}
                              {currentExample === 2 && (
                                <div className="text-xs text-green-600 mt-1 bg-green-100 px-2 py-1 rounded">
                                  🎯 Le "1" vient de : {examples[currentExample].factor} = {examples[currentExample].factor}×1, on garde le "1"
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
                  <div className="bg-purple-100 px-4 py-2 rounded-lg border border-purple-200">
                    <span className="text-purple-800 font-medium">
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
                      🎯 Progression : <span className="text-purple-600 font-bold">{Math.round((score / exercises.length) * 100)}%</span>
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
                   onClick={() => {
                     if (currentExercise > 0) {
                       setCurrentExercise(currentExercise - 1)
                       setUserAnswer('')
                       setShowAnswer(false)
                       setAnswerFeedback(null)
                     }
                   }}
                   disabled={currentExercise === 0}
                   className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                   <ArrowLeft className="w-4 h-4" />
                   Précédent
                 </button>
                 
                 <button
                   onClick={() => {
                     if (currentExercise < exercises.length - 1) {
                       setCurrentExercise(currentExercise + 1)
                       setUserAnswer('')
                       setShowAnswer(false)
                       setAnswerFeedback(null)
                     }
                   }}
                   disabled={currentExercise === exercises.length - 1}
                   className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                   Suivant
                   <ArrowLeft className="w-4 h-4 rotate-180" />
                 </button>
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

                      {score === exercises.length && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl border border-yellow-200">
                          <div className="text-center">
                            <p className="text-yellow-800 font-bold text-lg mb-2">
                              🎉 FÉLICITATIONS ! 🎉
                            </p>
                            <p className="text-green-700 font-medium">
                              Tu as réussi tous les {exercises.length} exercices de factorisation !
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