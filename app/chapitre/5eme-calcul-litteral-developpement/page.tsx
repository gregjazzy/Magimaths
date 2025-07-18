'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Zap, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function DeveloppementPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [exerciseSubTab, setExerciseSubTab] = useState<'basique' | 'avances'>('basique')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [currentAdvancedExercise, setCurrentAdvancedExercise] = useState(0)
  const [advancedUserAnswer, setAdvancedUserAnswer] = useState('')
  const [showAdvancedAnswer, setShowAdvancedAnswer] = useState(false)
  const [advancedScore, setAdvancedScore] = useState(0)
  const [devAnimationStep, setDevAnimationStep] = useState(0)
  const [devAnimating, setDevAnimating] = useState(false)
  const [devAnimationStep2, setDevAnimationStep2] = useState(0)
  const [devAnimating2, setDevAnimating2] = useState(false)
  
  // Compteurs de bonnes/mauvaises réponses
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [correctAnswersAdvanced, setCorrectAnswersAdvanced] = useState(0)
  const [wrongAnswersAdvanced, setWrongAnswersAdvanced] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [advancedAnswerFeedback, setAdvancedAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [showAdvancedFeedback, setShowAdvancedFeedback] = useState(false)


  const exercises = [
    // Niveau 1 : Développement simple - facteur positif, termes positifs
    {
      id: 'dev1',
      question: 'Développer : 2(x + 3)',
      answer: '2x + 6',
      steps: [
        '2(x + 3)',
        '2(x + 3) = 2 × x + 2 × 3',
        '2(x + 3) = 2x + 6',
        'Résultat : 2x + 6'
      ]
    },
    {
      id: 'dev2',
      question: 'Développer : 3(a + 1)',
      answer: '3a + 3',
      steps: [
        '3(a + 1)',
        '3(a + 1) = 3 × a + 3 × 1',
        '3(a + 1) = 3a + 3',
        'Résultat : 3a + 3'
      ]
    },
    {
      id: 'dev3',
      question: 'Développer : 5(y + 2)',
      answer: '5y + 10',
      steps: [
        '5(y + 2)',
        '5(y + 2) = 5 × y + 5 × 2',
        '5(y + 2) = 5y + 10',
        'Résultat : 5y + 10'
      ]
    },
    {
      id: 'dev4',
      question: 'Développer : 4(b + 5)',
      answer: '4b + 20',
      steps: [
        '4(b + 5)',
        '4(b + 5) = 4 × b + 4 × 5',
        '4(b + 5) = 4b + 20',
        'Résultat : 4b + 20'
      ]
    },
    
    // Niveau 2 : Développement avec facteurs variables et variables dans parenthèses
    {
      id: 'dev5',
      question: 'Développer : 3x(2 + y)',
      answer: '6x + 3xy',
      steps: [
        '3x(2 + y)',
        '3x(2 + y) = 3x × 2 + 3x × y',
        '3x(2 + y) = 6x + 3xy',
        'Résultat : 6x + 3xy'
      ]
    },
    {
      id: 'dev6',
      question: 'Développer : x(3 + 2y)',
      answer: '3x + 2xy',
      steps: [
        'x(3 + 2y)',
        'x(3 + 2y) = x × 3 + x × 2y',
        'x(3 + 2y) = 3x + 2xy',
        'Résultat : 3x + 2xy'
      ]
    },
    {
      id: 'dev7',
      question: 'Développer : 2y(a + 3)',
      answer: '2ya + 6y',
      steps: [
        '2y(a + 3)',
        '2y(a + 3) = 2y × a + 2y × 3',
        '2y(a + 3) = 2ya + 6y',
        'Résultat : 2ya + 6y'
      ]
    },
    {
      id: 'dev8',
      question: 'Développer : 4(b + 2x)',
      answer: '4b + 8x',
      steps: [
        '4(b + 2x)',
        '4(b + 2x) = 4 × b + 4 × 2x',
        '4(b + 2x) = 4b + 8x',
        'Résultat : 4b + 8x'
      ]
    },
    
    // Niveau 3 : Facteur variable avec coefficient
    {
      id: 'dev9',
      question: 'Développer : 2x(x + 3)',
      answer: '2x² + 6x',
      steps: [
        '2x(x + 3)',
        '2x(x + 3) = 2x × x + 2x × 3',
        '2x(x + 3) = 2x² + 6x',
        'Résultat : 2x² + 6x'
      ]
    },
    {
      id: 'dev10',
      question: 'Développer : 3y(y + 2)',
      answer: '3y² + 6y',
      steps: [
        '3y(y + 2)',
        '3y(y + 2) = 3y × y + 3y × 2',
        '3y(y + 2) = 3y² + 6y',
        'Résultat : 3y² + 6y'
      ]
    },
    {
      id: 'dev11',
      question: 'Développer : 4a(a + 1)',
      answer: '4a² + 4a',
      steps: [
        '4a(a + 1)',
        '4a(a + 1) = 4a × a + 4a × 1',
        '4a(a + 1) = 4a² + 4a',
        'Résultat : 4a² + 4a'
      ]
    },
    {
      id: 'dev12',
      question: 'Développer : 5b(b + 4)',
      answer: '5b² + 20b',
      steps: [
        '5b(b + 4)',
        '5b(b + 4) = 5b × b + 5b × 4',
        '5b(b + 4) = 5b² + 20b',
        'Résultat : 5b² + 20b'
      ]
    },
    
    // Niveau 4 : Développements avec coefficients multiples et soustractions
    {
      id: 'dev13',
      question: 'Développer : 2(3x - 4)',
      answer: '6x - 8',
      steps: [
        '2(3x - 4)',
        '2(3x - 4) = 2 × 3x + 2 × (-4)',
        '2(3x - 4) = 6x - 8',
        'Résultat : 6x - 8'
      ]
    },
    {
      id: 'dev14',
      question: 'Développer : 3x(2y - 5)',
      answer: '6xy - 15x',
      steps: [
        '3x(2y - 5)',
        '3x(2y - 5) = 3x × 2y + 3x × (-5)',
        '3x(2y - 5) = 6xy - 15x',
        'Résultat : 6xy - 15x'
      ]
    },
    {
      id: 'dev15',
      question: 'Développer : y(5a - 2x)',
      answer: '5ay - 2xy',
      steps: [
        'y(5a - 2x)',
        'y(5a - 2x) = y × 5a + y × (-2x)',
        'y(5a - 2x) = 5ay - 2xy',
        'Résultat : 5ay - 2xy'
      ]
    },
    {
      id: 'dev16',
      question: 'Développer : 4x(3 - 2y)',
      answer: '12x - 8xy',
      steps: [
        '4x(3 - 2y)',
        '4x(3 - 2y) = 4x × 3 + 4x × (-2y)',
        '4x(3 - 2y) = 12x - 8xy',
        'Résultat : 12x - 8xy'
      ]
    },
    
    // Niveau 5 : Développements avec variables au carré et soustractions
    {
      id: 'dev17',
      question: 'Développer : x(2x - 3)',
      answer: '2x² - 3x',
      steps: [
        'x(2x - 3)',
        'x(2x - 3) = x × 2x + x × (-3)',
        'x(2x - 3) = 2x² - 3x',
        'Résultat : 2x² - 3x'
      ]
    },
    {
      id: 'dev18',
      question: 'Développer : 3y(y - 2x)',
      answer: '3y² - 6xy',
      steps: [
        '3y(y - 2x)',
        '3y(y - 2x) = 3y × y + 3y × (-2x)',
        '3y(y - 2x) = 3y² - 6xy',
        'Résultat : 3y² - 6xy'
      ]
    },
    {
      id: 'dev19',
      question: 'Développer : 2a(3a + y)',
      answer: '6a² + 2ay',
      steps: [
        '2a(3a + y)',
        '2a(3a + y) = 2a × 3a + 2a × y',
        '2a(3a + y) = 6a² + 2ay',
        'Résultat : 6a² + 2ay'
      ]
    },
    {
      id: 'dev20',
      question: 'Développer : 5x(x - 2y)',
      answer: '5x² - 10xy',
      steps: [
        '5x(x - 2y)',
        '5x(x - 2y) = 5x × x + 5x × (-2y)',
        '5x(x - 2y) = 5x² - 10xy',
        'Résultat : 5x² - 10xy'
      ]
    }
  ]

  const advancedExercises = [
    // Niveau 1 : Expressions simples avec plusieurs variables et soustractions
    {
      id: 'adv1',
      question: 'Développer : 2a(3b - 4c)',
      answer: '6ab - 8ac',
      steps: [
        '2a(3b - 4c)',
        '2a(3b - 4c) = 2a × 3b + 2a × (-4c)',
        '2a(3b - 4c) = 6ab - 8ac',
        'Résultat : 6ab - 8ac'
      ]
    },
    {
      id: 'adv2',
      question: 'Développer : x(2y - 3z)',
      answer: '2xy - 3xz',
      steps: [
        'x(2y - 3z)',
        'x(2y - 3z) = x × 2y + x × (-3z)',
        'x(2y - 3z) = 2xy - 3xz',
        'Résultat : 2xy - 3xz'
      ]
    },
    {
      id: 'adv3',
      question: 'Développer : 3xy(2x - y + 4z)',
      answer: '6x²y - 3xy² + 12xyz',
      steps: [
        '3xy(2x - y + 4z)',
        '3xy(2x - y + 4z) = 3xy × 2x + 3xy × (-y) + 3xy × 4z',
        '3xy(2x - y + 4z) = 6x²y - 3xy² + 12xyz',
        'Résultat : 6x²y - 3xy² + 12xyz'
      ]
    },
    {
      id: 'adv4',
      question: 'Développer : 4ab(2a - 3b + c)',
      answer: '8a²b - 12ab² + 4abc',
      steps: [
        '4ab(2a - 3b + c)',
        '4ab(2a - 3b + c) = 4ab × 2a + 4ab × (-3b) + 4ab × c',
        '4ab(2a - 3b + c) = 8a²b - 12ab² + 4abc',
        'Résultat : 8a²b - 12ab² + 4abc'
      ]
    },
    
    // Niveau 2 : Double distributivité avec soustractions
    {
      id: 'adv5',
      question: 'Développer et simplifier : 2x(3 - y) + 5(2x + 1)',
      answer: '16x - 2xy + 5',
      steps: [
        '2x(3 - y) + 5(2x + 1)',
        '2x(3 - y) + 5(2x + 1) = 6x - 2xy + 10x + 5',
        '2x(3 - y) + 5(2x + 1) = 6x + 10x - 2xy + 5',
        '2x(3 - y) + 5(2x + 1) = 16x - 2xy + 5',
        'Résultat : 16x - 2xy + 5'
      ]
    },
    {
      id: 'adv6',
      question: 'Développer et simplifier : 3y(2a - 5) + 4(3a + y)',
      answer: '6ay - 15y + 12a + 4y',
      steps: [
        '3y(2a - 5) + 4(3a + y)',
        '3y(2a - 5) + 4(3a + y) = 6ay - 15y + 12a + 4y',
        '3y(2a - 5) + 4(3a + y) = 6ay + 12a - 15y + 4y',
        '3y(2a - 5) + 4(3a + y) = 6ay + 12a - 11y',
        'Résultat : 6ay + 12a - 11y'
      ]
    },
    {
      id: 'adv7',
      question: 'Développer et simplifier : x(2x - 3y) + 2y(x + 4)',
      answer: '2x² - 3xy + 2xy + 8y',
      steps: [
        'x(2x - 3y) + 2y(x + 4)',
        'x(2x - 3y) + 2y(x + 4) = 2x² - 3xy + 2xy + 8y',
        'x(2x - 3y) + 2y(x + 4) = 2x² - 3xy + 2xy + 8y',
        'x(2x - 3y) + 2y(x + 4) = 2x² - xy + 8y',
        'Résultat : 2x² - xy + 8y'
      ]
    },
    {
      id: 'adv8',
      question: 'Développer et simplifier : 2y(y + 3) + 3y(2y + 1)',
      answer: '8y² + 9y',
      steps: [
        '2y(y + 3) + 3y(2y + 1)',
        '2y(y + 3) + 3y(2y + 1) = 2y² + 6y + 6y² + 3y',
        '2y(y + 3) + 3y(2y + 1) = 2y² + 6y² + 6y + 3y',
        '2y(y + 3) + 3y(2y + 1) = 8y² + 9y',
        'Résultat : 8y² + 9y'
      ]
    },
    
    // Niveau 3 : Avec signe moins devant parenthèses
    {
      id: 'adv9',
      question: 'Développer : 3x(2x + 5) - (4x + 7)',
      answer: '6x² + 11x - 7',
      steps: [
        '3x(2x + 5) - (4x + 7)',
        '3x(2x + 5) - (4x + 7) = 6x² + 15x - 4x - 7',
        '3x(2x + 5) - (4x + 7) = 6x² + 15x - 4x - 7',
        '3x(2x + 5) - (4x + 7) = 6x² + 11x - 7',
        'Résultat : 6x² + 11x - 7'
      ]
    },
    {
      id: 'adv10',
      question: 'Développer : 2a(3a + 4) - (5a + 2)',
      answer: '6a² + 3a - 2',
      steps: [
        '2a(3a + 4) - (5a + 2)',
        '2a(3a + 4) - (5a + 2) = 6a² + 8a - 5a - 2',
        '2a(3a + 4) - (5a + 2) = 6a² + 8a - 5a - 2',
        '2a(3a + 4) - (5a + 2) = 6a² + 3a - 2',
        'Résultat : 6a² + 3a - 2'
      ]
    },
    {
      id: 'adv11',
      question: 'Développer : 4xy(x + 2y) - (3xy + 5x)',
      answer: '4x²y + 8xy² - 3xy - 5x',
      steps: [
        '4xy(x + 2y) - (3xy + 5x)',
        '4xy(x + 2y) - (3xy + 5x) = 4x²y + 8xy² - 3xy - 5x',
        '4xy(x + 2y) - (3xy + 5x) = 4x²y + 8xy² - 3xy - 5x',
        'Résultat : 4x²y + 8xy² - 3xy - 5x'
      ]
    },
    {
      id: 'adv12',
      question: 'Développer : 5bc(2b + 3c) - (4bc + 6b)',
      answer: '10b²c + 15bc² - 4bc - 6b',
      steps: [
        '5bc(2b + 3c) - (4bc + 6b)',
        '5bc(2b + 3c) - (4bc + 6b) = 10b²c + 15bc² - 4bc - 6b',
        '5bc(2b + 3c) - (4bc + 6b) = 10b²c + 15bc² - 4bc - 6b',
        'Résultat : 10b²c + 15bc² - 4bc - 6b'
      ]
    },
    
    // Niveau 4 : Triple distributivité
    {
      id: 'adv13',
      question: 'Développer et simplifier : 2(x + 3) + 3(2x + 1) + 4(x + 2)',
      answer: '13x + 17',
      steps: [
        '2(x + 3) + 3(2x + 1) + 4(x + 2)',
        '2(x + 3) + 3(2x + 1) + 4(x + 2) = 2x + 6 + 6x + 3 + 4x + 8',
        '2(x + 3) + 3(2x + 1) + 4(x + 2) = 2x + 6x + 4x + 6 + 3 + 8',
        '2(x + 3) + 3(2x + 1) + 4(x + 2) = 12x + 17',
        'Résultat : 12x + 17'
      ]
    },
    {
      id: 'adv14',
      question: 'Développer et simplifier : 3(2a + 1) + 2(3a + 4) + 5(a + 2)',
      answer: '17a + 21',
      steps: [
        '3(2a + 1) + 2(3a + 4) + 5(a + 2)',
        '3(2a + 1) + 2(3a + 4) + 5(a + 2) = 6a + 3 + 6a + 8 + 5a + 10',
        '3(2a + 1) + 2(3a + 4) + 5(a + 2) = 6a + 6a + 5a + 3 + 8 + 10',
        '3(2a + 1) + 2(3a + 4) + 5(a + 2) = 17a + 21',
        'Résultat : 17a + 21'
      ]
    },
    {
      id: 'adv15',
      question: 'Développer et simplifier : x(x + 2) + 2x(x + 3) + 3x(x + 1)',
      answer: '6x² + 11x',
      steps: [
        'x(x + 2) + 2x(x + 3) + 3x(x + 1)',
        'x(x + 2) + 2x(x + 3) + 3x(x + 1) = x² + 2x + 2x² + 6x + 3x² + 3x',
        'x(x + 2) + 2x(x + 3) + 3x(x + 1) = x² + 2x² + 3x² + 2x + 6x + 3x',
        'x(x + 2) + 2x(x + 3) + 3x(x + 1) = 6x² + 11x',
        'Résultat : 6x² + 11x'
      ]
    },
    {
      id: 'adv16',
      question: 'Développer et simplifier : 2y(y + 1) + 3y(2y + 2) + y(y + 5)',
      answer: '9y² + 13y',
      steps: [
        '2y(y + 1) + 3y(2y + 2) + y(y + 5)',
        '2y(y + 1) + 3y(2y + 2) + y(y + 5) = 2y² + 2y + 6y² + 6y + y² + 5y',
        '2y(y + 1) + 3y(2y + 2) + y(y + 5) = 2y² + 6y² + y² + 2y + 6y + 5y',
        '2y(y + 1) + 3y(2y + 2) + y(y + 5) = 9y² + 13y',
        'Résultat : 9y² + 13y'
      ]
    },
    
    // Niveau 5 : Expressions complexes avec multiples variables
    {
      id: 'adv17',
      question: 'Développer et simplifier : 2ab(a + b) + 3ab(2a + b) - (4a²b + 3ab²)',
      answer: '4a²b + 8ab² - 4a²b - 3ab²',
      steps: [
        '2ab(a + b) + 3ab(2a + b) - (4a²b + 3ab²)',
        '2ab(a + b) + 3ab(2a + b) - (4a²b + 3ab²) = 2a²b + 2ab² + 6a²b + 3ab² - 4a²b - 3ab²',
        '2ab(a + b) + 3ab(2a + b) - (4a²b + 3ab²) = 2a²b + 6a²b - 4a²b + 2ab² + 3ab² - 3ab²',
        '2ab(a + b) + 3ab(2a + b) - (4a²b + 3ab²) = 4a²b + 2ab²',
        'Résultat : 4a²b + 2ab²'
      ]
    },
    {
      id: 'adv18',
      question: 'Développer et simplifier : 3pq(p + 2q) + 2pq(3p + q) - (5p²q + 7pq²)',
      answer: '4p²q - pq²',
      steps: [
        '3pq(p + 2q) + 2pq(3p + q) - (5p²q + 7pq²)',
        '3pq(p + 2q) + 2pq(3p + q) - (5p²q + 7pq²) = 3p²q + 6pq² + 6p²q + 2pq² - 5p²q - 7pq²',
        '3pq(p + 2q) + 2pq(3p + q) - (5p²q + 7pq²) = 3p²q + 6p²q - 5p²q + 6pq² + 2pq² - 7pq²',
        '3pq(p + 2q) + 2pq(3p + q) - (5p²q + 7pq²) = 4p²q + pq²',
        'Résultat : 4p²q + pq²'
      ]
    }
  ]

  const currentEx = exercises[currentExercise]
  const currentAdvancedEx = advancedExercises[currentAdvancedExercise]

  const checkAnswer = () => {
    if (userAnswer.trim() === currentEx.answer) {
      setScore(score + 1)
      setCorrectAnswers(correctAnswers + 1)
      setAnswerFeedback('correct')
      setShowAnswer(true)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
      return true
    } else {
      setWrongAnswers(wrongAnswers + 1)
      setAnswerFeedback('incorrect')
      setShowAnswer(true)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
      return false
    }
  }

  const checkAdvancedAnswer = () => {
    if (advancedUserAnswer.trim() === currentAdvancedEx.answer) {
      setAdvancedScore(advancedScore + 1)
      setCorrectAnswersAdvanced(correctAnswersAdvanced + 1)
      setAdvancedAnswerFeedback('correct')
      setShowAdvancedAnswer(true)
      setShowAdvancedFeedback(true)
      setTimeout(() => setShowAdvancedFeedback(false), 3000)
      return true
    } else {
      setWrongAnswersAdvanced(wrongAnswersAdvanced + 1)
      setAdvancedAnswerFeedback('incorrect')
      setShowAdvancedAnswer(true)
      setShowAdvancedFeedback(true)
      setTimeout(() => setShowAdvancedFeedback(false), 3000)
      return false
    }
  }

  const resetCounters = () => {
    setCorrectAnswers(0)
    setWrongAnswers(0)
    setCorrectAnswersAdvanced(0)
    setWrongAnswersAdvanced(0)
    setScore(0)
    setAdvancedScore(0)
    setAnswerFeedback(null)
    setShowFeedback(false)
    setAdvancedAnswerFeedback(null)
    setShowAdvancedFeedback(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
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
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl">
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
                <div className="text-xl font-semibold text-red-600">25 minutes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'cours', label: 'Cours', icon: BookOpen },
                { id: 'exercices', label: 'Exercices', icon: Target },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-500 text-white'
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
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border border-red-200">
              <h2 className="text-2xl font-bold text-red-800 mb-6">📐 Développement d'expressions</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-red-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Qu'est-ce que développer ?</h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Développer</strong> une expression, c'est transformer un produit en une somme en utilisant la distributivité.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Propriété distributive</h4>
                    <p className="text-blue-700 text-sm font-mono">
                      a(b + c) = a × b + a × c
                    </p>
                    <p className="text-blue-700 text-sm mt-2">
                      Le nombre devant la parenthèse multiplie chaque terme à l'intérieur.
                    </p>
                  </div>
                </div>

                {/* Animation Distributivité */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">🎯 Animation : Distributivité</h3>
                  
                  <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
                    <p className="text-blue-700 font-medium text-center text-lg">
                      Comment développer <strong>3(x + 2)</strong> ?
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h4 className="text-lg font-semibold text-blue-800">
                        Animation : 3(x + 2)
                      </h4>
                      <button
                        onClick={() => {
                          setDevAnimationStep(0)
                          setDevAnimating(true)
                          setTimeout(() => setDevAnimationStep(1), 2000)
                          setTimeout(() => setDevAnimationStep(2), 4000)
                          setTimeout(() => setDevAnimationStep(3), 6000)
                          setTimeout(() => setDevAnimationStep(4), 8000)
                          setTimeout(() => setDevAnimationStep(5), 10000)
                          setTimeout(() => setDevAnimating(false), 11000)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        {devAnimating ? 'Animation en cours...' : 'Démarrer l\'animation'}
                      </button>
                    </div>
                    
                    <div className="space-y-6 relative min-h-[400px]">
                      {/* Expression de départ */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="font-mono text-2xl text-center text-gray-800 relative">
                          {/* Expression statique qui reste visible */}
                          <div className="flex items-center justify-center">
                            <span className="text-black text-2xl font-semibold">3(x + 2)</span>
                          </div>
                          
                          {/* Flèche qui apparaît */}
                          {devAnimationStep >= 1 && (
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-4xl text-blue-600 animate-pulse">
                              ↓
                            </div>
                          )}
                        </div>
                        
                        {/* Explication */}
                        {devAnimationStep >= 2 && (
                          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full">
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                              <p className="text-yellow-800 font-semibold text-center">
                                Le 3 se distribue à chaque terme dans la parenthèse
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Étapes de développement */}
                        {devAnimationStep >= 3 && (
                          <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <span className="text-blue-700 font-bold text-xl font-mono">3(x + 2) = 3 × x + 3 × 2</span>
                            </div>
                          </div>
                        )}
                        
                        {devAnimationStep >= 4 && (
                          <div className="absolute top-60 left-1/2 transform -translate-x-1/2">
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <span className="text-purple-700 font-bold text-xl font-mono">3(x + 2) = 3x + 6</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Résultat final */}
                        {devAnimationStep >= 5 && (
                          <div className="absolute top-80 left-1/2 transform -translate-x-1/2">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <span className="text-green-800 font-bold text-3xl animate-bounce font-mono">
                                Résultat : 3x + 6
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  

                </div>

                {/* Animation Distributivité 2 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">🎯 Animation : Distributivité avancée</h3>
                  
                  <div className="bg-green-100 p-4 rounded-lg border border-green-200 mb-6">
                    <p className="text-green-700 font-medium text-center text-lg">
                      Comment développer <strong>5x(2x - 3)</strong> ?
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h4 className="text-lg font-semibold text-green-800">
                        Animation : 5x(2x - 3)
                      </h4>
                      <button
                        onClick={() => {
                          setDevAnimationStep2(0)
                          setDevAnimating2(true)
                          setTimeout(() => setDevAnimationStep2(1), 2000)
                          setTimeout(() => setDevAnimationStep2(2), 4000)
                          setTimeout(() => setDevAnimationStep2(3), 6000)
                          setTimeout(() => setDevAnimationStep2(4), 8000)
                          setTimeout(() => setDevAnimationStep2(5), 10000)
                          setTimeout(() => setDevAnimating2(false), 11000)
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                      >
                        {devAnimating2 ? 'Animation en cours...' : 'Démarrer l\'animation'}
                      </button>
                    </div>
                    
                    <div className="space-y-6 relative min-h-[400px]">
                      {/* Expression de départ */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="font-mono text-2xl text-center text-gray-800 relative">
                          {/* Expression statique qui reste visible */}
                          <div className="flex items-center justify-center">
                            <span className="text-black text-2xl font-semibold">5x(2x - 3)</span>
                          </div>
                          
                          {/* Flèche qui apparaît */}
                          {devAnimationStep2 >= 1 && (
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-4xl text-green-600 animate-pulse">
                              ↓
                            </div>
                          )}
                        </div>
                        
                        {/* Explication */}
                        {devAnimationStep2 >= 2 && (
                          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full">
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                              <p className="text-yellow-800 font-semibold text-center">
                                Le 5x se distribue à chaque terme dans la parenthèse
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Étapes de développement */}
                        {devAnimationStep2 >= 3 && (
                          <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <span className="text-green-700 font-bold text-xl font-mono">5x(2x - 3) = 5x × 2x + 5x × (-3)</span>
                            </div>
                          </div>
                        )}
                        
                        {devAnimationStep2 >= 4 && (
                          <div className="absolute top-60 left-1/2 transform -translate-x-1/2">
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                              <span className="text-purple-700 font-bold text-xl font-mono">5x(2x - 3) = 10x² - 15x</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Résultat final */}
                        {devAnimationStep2 >= 5 && (
                          <div className="absolute top-80 left-1/2 transform -translate-x-1/2">
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <span className="text-orange-800 font-bold text-3xl animate-bounce font-mono">
                                Résultat : 10x² - 15x
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-red-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemples détaillés</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-800 mb-2">Exemple : 3(x + 2)</p>
                      <div className="text-sm text-gray-700 space-y-1 font-mono">
                        <div>3(x + 2)</div>
                        <div>3(x + 2) = 3 × x + 3 × 2</div>
                        <div>3(x + 2) = 3x + 6</div>
                        <div>• <strong>Résultat : 3x + 6</strong></div>
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
            {/* Récapitulatif des performances */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">📊 Récapitulatif des performances</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {correctAnswers + correctAnswersAdvanced}
                    </div>
                    <div className="text-blue-800 font-semibold">Bonnes réponses totales</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {wrongAnswers + wrongAnswersAdvanced}
                    </div>
                    <div className="text-purple-800 font-semibold">Erreurs totales</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {(correctAnswers + correctAnswersAdvanced) + (wrongAnswers + wrongAnswersAdvanced) > 0 
                        ? Math.round(((correctAnswers + correctAnswersAdvanced) / ((correctAnswers + correctAnswersAdvanced) + (wrongAnswers + wrongAnswersAdvanced))) * 100) 
                        : 0}%
                    </div>
                    <div className="text-green-800 font-semibold">Taux de réussite global</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-2">📚 Exercices Basiques</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">✅ {correctAnswers}</span>
                    <span className="text-red-600 font-semibold">❌ {wrongAnswers}</span>
                    <span className="text-blue-600 font-semibold">
                      {correctAnswers + wrongAnswers > 0 
                        ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) 
                        : 0}%
                    </span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-purple-800 mb-2">⚡ Exercices Avancés</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-semibold">✅ {correctAnswersAdvanced}</span>
                    <span className="text-red-600 font-semibold">❌ {wrongAnswersAdvanced}</span>
                    <span className="text-purple-600 font-semibold">
                      {correctAnswersAdvanced + wrongAnswersAdvanced > 0 
                        ? Math.round((correctAnswersAdvanced / (correctAnswersAdvanced + wrongAnswersAdvanced)) * 100) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Exercices - Développement</h2>
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-200">
                    <span className="text-green-800 font-semibold">✅ Bonnes</span>
                    <span className="text-green-900 font-bold ml-2 text-xl">{correctAnswers}</span>
                  </div>
                  <div className="bg-red-100 px-4 py-2 rounded-lg border border-red-200">
                    <span className="text-red-800 font-semibold">❌ Mauvaises</span>
                    <span className="text-red-900 font-bold ml-2 text-xl">{wrongAnswers}</span>
                  </div>
                  <div className="bg-blue-100 px-4 py-2 rounded-lg border border-blue-200">
                    <span className="text-blue-800 font-semibold">🏆 Score</span>
                    <span className="text-blue-900 font-bold ml-2 text-xl">{score}</span>
                  </div>
                  <div className="bg-orange-100 px-4 py-2 rounded-lg border border-orange-200">
                    <span className="text-orange-800 font-semibold">📊 Taux de réussite</span>
                    <span className="text-orange-900 font-bold ml-2 text-xl">
                      {correctAnswers + wrongAnswers > 0 
                        ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                    <span className="text-gray-800 font-semibold">📚 Difficulté</span>
                    <span className="text-gray-900 font-bold ml-2">★★★☆☆</span>
                  </div>
                  <button
                    onClick={resetCounters}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
                    title="Réinitialiser les compteurs"
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw size={16} className="text-gray-600" />
                      <span className="text-gray-800 font-semibold">Reset</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Feedback temporaire */}
              {showFeedback && (
                <div className="text-center mb-6">
                  <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm animate-pulse ${
                    answerFeedback === 'correct' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {answerFeedback === 'correct' ? '✅ Bonne réponse !' : '❌ Réponse incorrecte'}
                  </span>
                </div>
              )}

              {/* Sub-tabs for Exercices */}
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'basique', label: 'Basique', icon: Target },
                  { id: 'avances', label: 'Avancés', icon: Zap }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setExerciseSubTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                      exerciseSubTab === tab.id
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {exerciseSubTab === 'basique' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{currentEx.question}</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Exercice {currentExercise + 1} sur {exercises.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCurrentExercise(currentExercise > 0 ? currentExercise - 1 : exercises.length - 1)
                                setUserAnswer('')
                                setShowAnswer(false)
                                setAnswerFeedback(null)
                                setShowFeedback(false)
                              }}
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
                              onClick={() => {
                                setCurrentExercise(currentExercise + 1)
                                setUserAnswer('')
                                setShowAnswer(false)
                                setAnswerFeedback(null)
                                setShowFeedback(false)
                              }}
                              disabled={currentExercise === exercises.length - 1}
                              className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                                currentExercise === exercises.length - 1 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : 'bg-red-500 hover:bg-red-600'
                              }`}
                            >
                              Suivant →
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 mb-4">
                        {/* Éditeur de réponse */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-3">✏️ Éditeur de réponse</h4>
                          
                          {/* Boutons pour insérer des symboles */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[
                              { symbol: 'x', label: 'x' },
                              { symbol: 'y', label: 'y' },
                              { symbol: 'a', label: 'a' },
                              { symbol: 'b', label: 'b' },
                              { symbol: '+', label: '+' },
                              { symbol: '-', label: '-' },
                              { symbol: '(', label: '(' },
                              { symbol: ')', label: ')' },
                              { symbol: 'x²', label: 'x²' },
                              { symbol: 'x³', label: 'x³' },
                              { symbol: '²', label: '²' },
                              { symbol: '³', label: '³' }
                            ].map((btn) => (
                              <button
                                key={btn.symbol}
                                onClick={() => setUserAnswer(prev => prev + btn.symbol)}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors text-sm font-semibold"
                              >
                                {btn.label}
                              </button>
                            ))}
                            <button
                              onClick={() => setUserAnswer('')}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm font-semibold"
                            >
                              Effacer
                            </button>
                          </div>
                          
                          {/* Zone de saisie */}
                          <div className="relative">
                            <textarea
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="Saisissez votre réponse développée (ex: 3x + 6)..."
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-800 placeholder-gray-500 font-mono text-lg min-h-[60px] resize-none"
                              rows={2}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                              {userAnswer.length} caractères
                            </div>
                          </div>
                          
                          {/* Aperçu */}
                          {userAnswer && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-blue-800 text-sm font-semibold mb-1">Aperçu de votre réponse :</p>
                              <p className="text-blue-700 font-mono text-lg">{userAnswer}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Bouton de vérification */}
                        <div className="flex justify-center">
                          <button
                            onClick={checkAnswer}
                            disabled={!userAnswer.trim() || showAnswer}
                            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 font-semibold text-lg"
                          >
                            {showAnswer ? 'Réponse vérifiée' : 'Vérifier la réponse'}
                          </button>
                        </div>
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
                            <h4 className="font-semibold text-gray-800 mb-2">📝 Correction détaillée</h4>
                            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside font-mono">
                              {currentEx.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {exerciseSubTab === 'avances' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                    <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">⚡ Mode Expert</h2>
                    <p className="text-purple-700 text-center mb-4">
                      Exercices avancés avec développements multiples, puissances élevées et simplifications complexes
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold">✅ Bonnes</span>
                        <span className="text-green-900 font-bold ml-2 text-xl">{correctAnswersAdvanced}</span>
                      </div>
                      <div className="bg-red-100 px-4 py-2 rounded-lg border border-red-200">
                        <span className="text-red-800 font-semibold">❌ Mauvaises</span>
                        <span className="text-red-900 font-bold ml-2 text-xl">{wrongAnswersAdvanced}</span>
                      </div>
                      <div className="bg-purple-100 px-4 py-2 rounded-lg border border-purple-200">
                        <span className="text-purple-800 font-semibold">🏆 Score Expert</span>
                        <span className="text-purple-900 font-bold ml-2 text-xl">{advancedScore}</span>
                      </div>
                      <div className="bg-blue-100 px-4 py-2 rounded-lg border border-blue-200">
                        <span className="text-blue-800 font-semibold">📊 Taux de réussite</span>
                        <span className="text-blue-900 font-bold ml-2 text-xl">
                          {correctAnswersAdvanced + wrongAnswersAdvanced > 0 
                            ? Math.round((correctAnswersAdvanced / (correctAnswersAdvanced + wrongAnswersAdvanced)) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-200">
                        <span className="text-yellow-800 font-semibold">⚡ Difficulté</span>
                        <span className="text-yellow-900 font-bold ml-2">★★★★★</span>
                      </div>
                      <button
                        onClick={resetCounters}
                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
                        title="Réinitialiser les compteurs"
                      >
                        <div className="flex items-center gap-2">
                          <RotateCcw size={16} className="text-gray-600" />
                          <span className="text-gray-800 font-semibold">Reset</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{currentAdvancedEx.question}</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
                            Exercice {currentAdvancedExercise + 1} sur {advancedExercises.length}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCurrentAdvancedExercise(currentAdvancedExercise > 0 ? currentAdvancedExercise - 1 : advancedExercises.length - 1)
                                setAdvancedUserAnswer('')
                                setShowAdvancedAnswer(false)
                                setAdvancedAnswerFeedback(null)
                                setShowAdvancedFeedback(false)
                              }}
                              disabled={currentAdvancedExercise === 0}
                              className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                                currentAdvancedExercise === 0 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : 'bg-gray-500 hover:bg-gray-600'
                              }`}
                            >
                              ← Précédent
                            </button>
                            <button
                              onClick={() => {
                                setCurrentAdvancedExercise(currentAdvancedExercise + 1)
                                setAdvancedUserAnswer('')
                                setShowAdvancedAnswer(false)
                                setAdvancedAnswerFeedback(null)
                                setShowAdvancedFeedback(false)
                              }}
                              disabled={currentAdvancedExercise === advancedExercises.length - 1}
                              className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                                currentAdvancedExercise === advancedExercises.length - 1 
                                  ? 'bg-gray-300 cursor-not-allowed' 
                                  : 'bg-purple-500 hover:bg-purple-600'
                              }`}
                            >
                              Suivant →
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Feedback temporaire pour exercices avancés */}
                      {showAdvancedFeedback && (
                        <div className="text-center mb-6">
                          <span className={`inline-block px-6 py-3 rounded-xl font-bold text-base animate-pulse ${
                            advancedAnswerFeedback === 'correct' 
                              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                              : 'bg-red-100 text-red-800 border-2 border-red-300'
                          }`}>
                            {advancedAnswerFeedback === 'correct' ? '🏆 Excellente réponse ! Mode Expert maîtrisé !' : '❌ Réponse incorrecte - Réessayez !'}
                          </span>
                        </div>
                      )}
                      
                      <div className="space-y-4 mb-4">
                        {/* Éditeur de réponse pour exercices avancés */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-3">⚡ Éditeur Expert</h4>
                          
                          {/* Boutons pour insérer des symboles */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[
                              { symbol: 'x', label: 'x' },
                              { symbol: 'y', label: 'y' },
                              { symbol: 'a', label: 'a' },
                              { symbol: 'b', label: 'b' },
                              { symbol: 'c', label: 'c' },
                              { symbol: 'd', label: 'd' },
                              { symbol: '+', label: '+' },
                              { symbol: '-', label: '-' },
                              { symbol: '(', label: '(' },
                              { symbol: ')', label: ')' },
                              { symbol: 'x²', label: 'x²' },
                              { symbol: 'x³', label: 'x³' },
                              { symbol: 'x⁴', label: 'x⁴' },
                              { symbol: 'x⁵', label: 'x⁵' },
                              { symbol: '²', label: '²' },
                              { symbol: '³', label: '³' },
                              { symbol: '⁴', label: '⁴' },
                              { symbol: '⁵', label: '⁵' }
                            ].map((btn) => (
                              <button
                                key={btn.symbol}
                                onClick={() => setAdvancedUserAnswer(prev => prev + btn.symbol)}
                                className="px-3 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors text-sm font-semibold"
                              >
                                {btn.label}
                              </button>
                            ))}
                            <button
                              onClick={() => setAdvancedUserAnswer('')}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm font-semibold"
                            >
                              Effacer
                            </button>
                          </div>
                          
                          {/* Zone de saisie */}
                          <div className="relative">
                            <textarea
                              value={advancedUserAnswer}
                              onChange={(e) => setAdvancedUserAnswer(e.target.value)}
                              placeholder="Saisissez votre réponse développée et simplifiée (ex: 6x² + 3x - 2)..."
                              className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-500 font-mono text-lg min-h-[60px] resize-none"
                              rows={2}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                              {advancedUserAnswer.length} caractères
                            </div>
                          </div>
                          
                          {/* Aperçu */}
                          {advancedUserAnswer && (
                            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <p className="text-purple-800 text-sm font-semibold mb-1">Aperçu de votre réponse :</p>
                              <p className="text-purple-700 font-mono text-lg">{advancedUserAnswer}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Bouton de vérification */}
                        <div className="flex justify-center">
                          <button
                            onClick={checkAdvancedAnswer}
                            disabled={!advancedUserAnswer.trim() || showAdvancedAnswer}
                            className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 font-semibold text-lg"
                          >
                            {showAdvancedAnswer ? 'Réponse vérifiée' : 'Vérifier la réponse'}
                          </button>
                        </div>
                      </div>

                      {showAdvancedAnswer && (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg border ${
                            advancedUserAnswer.trim() === currentAdvancedEx.answer
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`font-semibold ${
                                advancedUserAnswer.trim() === currentAdvancedEx.answer ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {advancedUserAnswer.trim() === currentAdvancedEx.answer ? '🏆 Excellent !' : '❌ Incorrect'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Réponse correcte : <strong>{currentAdvancedEx.answer}</strong>
                            </p>
                          </div>

                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2">🔍 Correction détaillée</h4>
                            <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside font-mono">
                              {currentAdvancedEx.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
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