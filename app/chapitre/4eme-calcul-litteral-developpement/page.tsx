'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Zap, Play, Pause, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '../../../components/VoiceInput'

// Composant pour afficher les fractions avec de vraies barres
const Fraction = ({ numerator, denominator }: { numerator: string, denominator: string }) => (
  <span className="inline-block mx-1 align-middle">
    <span className="inline-flex flex-col items-center justify-center">
      <span className="text-sm leading-tight px-1">{numerator}</span>
      <span className="w-full h-0.5 bg-current my-1 min-w-[20px]"></span>
      <span className="text-sm leading-tight px-1">{denominator}</span>
    </span>
  </span>
)

// Composant pour parser et afficher les expressions mathématiques avec fractions
const MathExpression = ({ expression, className = "" }: { expression: string, className?: string }) => {
  const parts = []
  let remaining = expression
  let key = 0

  while (remaining.length > 0) {
    // Cherche les fractions du type (num/den) avec possibles variables, coefficients et expressions
    const fractionMatch = remaining.match(/\(([^\/\)]+)\/([^\/\)]+)\)/)
    
    if (fractionMatch) {
      const beforeFraction = remaining.substring(0, fractionMatch.index!)
      if (beforeFraction) {
        // Parse les puissances dans le texte avant la fraction
        const processedBefore = beforeFraction.replace(/([a-zA-Z])(\d+)/g, (match, variable, exponent) => {
          // Ne pas traiter si c'est déjà formaté ou si c'est un nombre complet
          if (match.includes('⁰') || match.includes('¹') || match.includes('²') || match.includes('³')) {
            return match
          }
          return variable + convertToSuperscript(exponent)
        })
        parts.push(<span key={key++}>{processedBefore}</span>)
      }
      
      // Traite les puissances dans le numérateur et dénominateur
      const numerator = fractionMatch[1].replace(/([a-zA-Z])(\d+)/g, (match, variable, exponent) => {
        return variable + convertToSuperscript(exponent)
      })
      const denominator = fractionMatch[2].replace(/([a-zA-Z])(\d+)/g, (match, variable, exponent) => {
        return variable + convertToSuperscript(exponent)
      })
      
      parts.push(
        <Fraction 
          key={key++} 
          numerator={numerator} 
          denominator={denominator} 
        />
      )
      
      remaining = remaining.substring(fractionMatch.index! + fractionMatch[0].length)
    } else {
      // Pas d'autres fractions, traiter les puissances dans le reste
      const processedRemaining = remaining.replace(/([a-zA-Z])(\d+)/g, (match, variable, exponent) => {
        // Ne pas traiter si c'est déjà formaté
        if (match.includes('⁰') || match.includes('¹') || match.includes('²') || match.includes('³')) {
          return match
        }
        return variable + convertToSuperscript(exponent)
      })
      parts.push(<span key={key++}>{processedRemaining}</span>)
      break
    }
  }

  return <span className={className}>{parts}</span>
}

// Fonction pour convertir les nombres en exposants
const convertToSuperscript = (num: string): string => {
  const superscriptMap: { [key: string]: string } = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  }
  return num.split('').map(digit => superscriptMap[digit] || digit).join('')
}

export default function DeveloppementPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [exerciseLevel, setExerciseLevel] = useState<'normal' | 'beast' | 'hardcore'>('normal')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // Compteurs de bonnes réponses
  const [correctAnswersNormal, setCorrectAnswersNormal] = useState(0)
  const [correctAnswersBeast, setCorrectAnswersBeast] = useState(0)
  const [correctAnswersHardcore, setCorrectAnswersHardcore] = useState(0)
  const [showIncrement, setShowIncrement] = useState(false)
  
  // États pour la solution détaillée
  const [showSolution, setShowSolution] = useState(false)
  const [solutionStep, setSolutionStep] = useState(0)
  
  const [animationPlaying, setAnimationPlaying] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const [selectedAnimation, setSelectedAnimation] = useState(0)

  // Animations pour expliquer la distributivité
  const distributivityAnimations = [
    {
      id: 'basic',
      title: '🎯 Distributivité Simple',
      expression: '3(x + 2)',
      steps: [
        { phase: 'initial', content: '3(x + 2)', description: 'Expression de départ' },
        { phase: 'highlight', content: '3(x + 2)', description: 'Le 3 va se distribuer sur chaque terme' },
        { phase: 'distribute', content: '3 × x + 3 × 2', description: 'Distribution du 3 sur chaque terme' },
        { phase: 'calculate', content: '3x + 6', description: 'Résultat final' }
      ]
    },
    {
      id: 'negative',
      title: '⚡ Avec Signe Négatif',
      expression: '-2(x + 3)',
      steps: [
        { phase: 'initial', content: '-2(x + 3)', description: 'Expression avec signe négatif' },
        { phase: 'highlight', content: '-2(x + 3)', description: 'Le -2 va se distribuer' },
        { phase: 'distribute', content: '(-2) × x + (-2) × 3', description: 'Distribution du -2' },
        { phase: 'calculate', content: '-2x - 6', description: 'Attention aux signes !' }
      ]
    },
    {
      id: 'double',
      title: '🚀 Double Distributivité',
      expression: '(a + 1)(b + 2)',
      steps: [
        { phase: 'initial', content: '(a + 1)(b + 2)', description: 'Deux parenthèses à multiplier' },
        { phase: 'arrow1', content: '(a + 1)(b + 2)', description: 'Première flèche : a × b' },
        { phase: 'arrow2', content: '(a + 1)(b + 2)', description: 'Deuxième flèche : a × 2' },
        { phase: 'arrow3', content: '(a + 1)(b + 2)', description: 'Troisième flèche : 1 × b' },
        { phase: 'arrow4', content: '(a + 1)(b + 2)', description: 'Quatrième flèche : 1 × 2' },
        { phase: 'distribute', content: 'a×b + a×2 + 1×b + 1×2', description: 'Récapitulatif de tous les produits' },
        { phase: 'expand', content: 'ab + 2a + b + 2', description: 'Développement complet' },
        { phase: 'calculate', content: 'ab + 2a + b + 2', description: 'Résultat final : impossible de regrouper davantage' }
      ]
    }
  ]

  // EXERCICES MODE NORMAL - Progression enrichie avec PUISSANCES et MOINS × MOINS
  const normalExercises = [
    // Niveau 1 : Distributivité simple - Bases
    {
      id: 1,
      question: "2(x + 3)",
      steps: [
        { text: "Expression de départ", expr: "2(x + 3)", color: "text-blue-600" },
        { text: "Distribution", expr: "2 × x + 2 × 3", color: "text-green-600" },
        { text: "Résultat", expr: "2x + 6", color: "text-purple-600" }
      ]
    },
    {
      id: 2,
      question: "-5(-x - 2)",
      steps: [
        { text: "Expression de départ", expr: "-5(-x - 2)", color: "text-blue-600" },
        { text: "Distribution", expr: "(-5) × (-x) + (-5) × (-2)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+5x + 10", color: "text-orange-600" },
        { text: "Résultat", expr: "5x + 10", color: "text-purple-600" }
      ]
    },
    {
      id: 3,
      question: "3x²(x - 4)",
      steps: [
        { text: "Expression de départ", expr: "3x²(x - 4)", color: "text-blue-600" },
        { text: "Distribution avec puissances", expr: "3x² × x + 3x² × (-4)", color: "text-green-600" },
        { text: "Calcul des puissances", expr: "3x³ - 12x²", color: "text-orange-600" },
        { text: "Résultat", expr: "3x³ - 12x²", color: "text-purple-600" }
      ]
    },
    {
      id: 4,
      question: "-2x(-x² + 5)",
      steps: [
        { text: "Expression de départ", expr: "-2x(-x² + 5)", color: "text-blue-600" },
        { text: "Distribution", expr: "(-2x) × (-x²) + (-2x) × 5", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+2x³ - 10x", color: "text-orange-600" },
        { text: "Résultat", expr: "2x³ - 10x", color: "text-purple-600" }
      ]
    },
    {
      id: 5,
      question: "-3(-y³ - 2y)",
      steps: [
        { text: "Expression de départ", expr: "-3(-y³ - 2y)", color: "text-blue-600" },
        { text: "Distribution", expr: "(-3) × (-y³) + (-3) × (-2y)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+3y³ + 6y", color: "text-orange-600" },
        { text: "Résultat", expr: "3y³ + 6y", color: "text-purple-600" }
      ]
    },
    {
      id: 6,
      question: "x³(2x² - 3x)",
      steps: [
        { text: "Expression de départ", expr: "x³(2x² - 3x)", color: "text-blue-600" },
        { text: "Distribution avec puissances", expr: "x³ × 2x² + x³ × (-3x)", color: "text-green-600" },
        { text: "Calcul des puissances", expr: "2x⁵ - 3x⁴", color: "text-orange-600" },
        { text: "Résultat", expr: "2x⁵ - 3x⁴", color: "text-purple-600" }
      ]
    },
    {
      id: 7,
      question: "-4a²(-a² - 3a)",
      steps: [
        { text: "Expression de départ", expr: "-4a²(-a² - 3a)", color: "text-blue-600" },
        { text: "Distribution", expr: "(-4a²) × (-a²) + (-4a²) × (-3a)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+4a⁴ + 12a³", color: "text-orange-600" },
        { text: "Résultat", expr: "4a⁴ + 12a³", color: "text-purple-600" }
      ]
    },
    {
      id: 8,
      question: "-x⁴(-2x - 7)",
      steps: [
        { text: "Expression de départ", expr: "-x⁴(-2x - 7)", color: "text-blue-600" },
        { text: "Distribution", expr: "(-x⁴) × (-2x) + (-x⁴) × (-7)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+2x⁵ + 7x⁴", color: "text-orange-600" },
        { text: "Résultat", expr: "2x⁵ + 7x⁴", color: "text-purple-600" }
      ]
    },
    
    // Niveau 3 : Double distributivité avec puissances et signes négatifs
    {
      id: 9,
      question: "(x² - 3)(-x + 2)",
      steps: [
        { text: "Expression de départ", expr: "(x² - 3)(-x + 2)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "x²×(-x) + x²×2 + (-3)×(-x) + (-3)×2", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "-x³ + 2x² + 3x - 6", color: "text-orange-600" },
        { text: "Résultat", expr: "-x³ + 2x² + 3x - 6", color: "text-purple-600" }
      ]
    },
    {
      id: 10,
      question: "(-x² - 1)(-x - 4)",
      steps: [
        { text: "Expression de départ", expr: "(-x² - 1)(-x - 4)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "(-x²)×(-x) + (-x²)×(-4) + (-1)×(-x) + (-1)×(-4)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+x³ + 4x² + x + 4", color: "text-orange-600" },
        { text: "Résultat", expr: "x³ + 4x² + x + 4", color: "text-purple-600" }
      ]
    },
    {
      id: 11,
      question: "(2x³ - 5)(-x² + 3)",
      steps: [
        { text: "Expression de départ", expr: "(2x³ - 5)(-x² + 3)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "2x³×(-x²) + 2x³×3 + (-5)×(-x²) + (-5)×3", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "-2x⁵ + 6x³ + 5x² - 15", color: "text-orange-600" },
        { text: "Résultat", expr: "-2x⁵ + 6x³ + 5x² - 15", color: "text-purple-600" }
      ]
    },
    {
      id: 12,
      question: "(-x⁴ - 2x)(-3x - 1)",
      steps: [
        { text: "Expression de départ", expr: "(-x⁴ - 2x)(-3x - 1)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "(-x⁴)×(-3x) + (-x⁴)×(-1) + (-2x)×(-3x) + (-2x)×(-1)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+3x⁵ + x⁴ + 6x² + 2x", color: "text-orange-600" },
        { text: "Résultat", expr: "3x⁵ + x⁴ + 6x² + 2x", color: "text-purple-600" }
      ]
    },
    
    // Niveau 4 : Coefficients avec puissances et signes négatifs intensifs
    {
      id: 13,
      question: "(-3x² + 4)(-2x³ - 5)",
      steps: [
        { text: "Expression de départ", expr: "(-3x² + 4)(-2x³ - 5)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "(-3x²)×(-2x³) + (-3x²)×(-5) + 4×(-2x³) + 4×(-5)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+6x⁵ + 15x² - 8x³ - 20", color: "text-orange-600" },
        { text: "Résultat", expr: "6x⁵ - 8x³ + 15x² - 20", color: "text-purple-600" }
      ]
    },
    {
      id: 14,
      question: "(-4a³ - 3a)(-a² + 2)",
      steps: [
        { text: "Expression de départ", expr: "(-4a³ - 3a)(-a² + 2)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "(-4a³)×(-a²) + (-4a³)×2 + (-3a)×(-a²) + (-3a)×2", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+4a⁵ - 8a³ + 3a³ - 6a", color: "text-orange-600" },
        { text: "Résultat", expr: "4a⁵ - 5a³ - 6a", color: "text-purple-600" }
      ]
    },
    {
      id: 15,
      question: "(-2x⁴ + x²)(-3x² - 7)",
      steps: [
        { text: "Expression de départ", expr: "(-2x⁴ + x²)(-3x² - 7)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "(-2x⁴)×(-3x²) + (-2x⁴)×(-7) + x²×(-3x²) + x²×(-7)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+6x⁶ + 14x⁴ - 3x⁴ - 7x²", color: "text-orange-600" },
        { text: "Résultat", expr: "6x⁶ + 11x⁴ - 7x²", color: "text-purple-600" }
      ]
    },
    
    // Niveau 5 : Puissances élevées avec signes négatifs
    {
      id: 16,
      question: "-5x³(-x⁴ - 2x²)",
      steps: [
        { text: "Expression de départ", expr: "-5x³(-x⁴ - 2x²)", color: "text-blue-600" },
        { text: "Distribution", expr: "(-5x³) × (-x⁴) + (-5x³) × (-2x²)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+5x⁷ + 10x⁵", color: "text-orange-600" },
        { text: "Résultat", expr: "5x⁷ + 10x⁵", color: "text-purple-600" }
      ]
    },
    {
      id: 17,
      question: "(-x⁵ - 4x²)(-2x + 3)",
      steps: [
        { text: "Expression de départ", expr: "(-x⁵ - 4x²)(-2x + 3)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "(-x⁵)×(-2x) + (-x⁵)×3 + (-4x²)×(-2x) + (-4x²)×3", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+2x⁶ - 3x⁵ + 8x³ - 12x²", color: "text-orange-600" },
        { text: "Résultat", expr: "2x⁶ - 3x⁵ + 8x³ - 12x²", color: "text-purple-600" }
      ]
    },
    {
      id: 18,
      question: "(-3y⁴ + 2y)(-y³ - 5y)",
      steps: [
        { text: "Expression de départ", expr: "(-3y⁴ + 2y)(-y³ - 5y)", color: "text-blue-600" },
        { text: "Tous les produits", expr: "(-3y⁴)×(-y³) + (-3y⁴)×(-5y) + 2y×(-y³) + 2y×(-5y)", color: "text-green-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+3y⁷ + 15y⁵ - 2y⁴ - 10y²", color: "text-orange-600" },
        { text: "Résultat", expr: "3y⁷ + 15y⁵ - 2y⁴ - 10y²", color: "text-purple-600" }
      ]
    },
    
    // Niveau 6 : Introduction aux priorités opératoires
    {
      id: 19,
      question: "x² + 2x(x - 3)",
      steps: [
        { text: "Expression de départ", expr: "x² + 2x(x - 3)", color: "text-blue-600" },
        { text: "📚 Priorités : d'abord la parenthèse", expr: "D'abord développer 2x(x - 3)", color: "text-green-600" },
        { text: "Développement", expr: "2x × x + 2x × (-3) = 2x² - 6x", color: "text-orange-600" },
        { text: "Substitution", expr: "x² + (2x² - 6x)", color: "text-red-600" },
        { text: "Résultat", expr: "3x² - 6x", color: "text-purple-600" }
      ]
    },
    {
      id: 20,
      question: "3x - (x + 2)(x - 1)",
      steps: [
        { text: "Expression de départ", expr: "3x - (x + 2)(x - 1)", color: "text-blue-600" },
        { text: "📚 Priorités : développer la double distributivité", expr: "D'abord (x + 2)(x - 1)", color: "text-green-600" },
        { text: "Développement", expr: "x² - x + 2x - 2 = x² + x - 2", color: "text-orange-600" },
        { text: "Substitution", expr: "3x - (x² + x - 2)", color: "text-red-600" },
        { text: "Résultat", expr: "3x - x² - x + 2 = -x² + 2x + 2", color: "text-purple-600" }
      ]
    },
    
    // Niveau 7 : Priorités avec multiplication
    {
      id: 21,
      question: "2x² + x(x + 3) - 4",
      steps: [
        { text: "Expression de départ", expr: "2x² + x(x + 3) - 4", color: "text-blue-600" },
        { text: "📚 Développer x(x + 3)", expr: "x × x + x × 3 = x² + 3x", color: "text-green-600" },
        { text: "Substitution", expr: "2x² + (x² + 3x) - 4", color: "text-orange-600" },
        { text: "Résultat", expr: "3x² + 3x - 4", color: "text-purple-600" }
      ]
    },
    {
      id: 22,
      question: "5x - 2x(x - 2) + x²",
      steps: [
        { text: "Expression de départ", expr: "5x - 2x(x - 2) + x²", color: "text-blue-600" },
        { text: "📚 Développer 2x(x - 2)", expr: "2x × x + 2x × (-2) = 2x² - 4x", color: "text-green-600" },
        { text: "Substitution", expr: "5x - (2x² - 4x) + x²", color: "text-orange-600" },
        { text: "Calcul", expr: "5x - 2x² + 4x + x²", color: "text-red-600" },
        { text: "Résultat", expr: "-x² + 9x", color: "text-purple-600" }
      ]
    },
    {
      id: 23,
      question: "(x + 1)(x - 2) + 3x",
      steps: [
        { text: "Expression de départ", expr: "(x + 1)(x - 2) + 3x", color: "text-blue-600" },
        { text: "📚 Développer (x + 1)(x - 2)", expr: "x² - 2x + x - 2 = x² - x - 2", color: "text-green-600" },
        { text: "Substitution", expr: "(x² - x - 2) + 3x", color: "text-orange-600" },
        { text: "Résultat", expr: "x² + 2x - 2", color: "text-purple-600" }
      ]
    },
    {
      id: 24,
      question: "x² + (x - 1)(x + 1) - 2x",
      steps: [
        { text: "Expression de départ", expr: "x² + (x - 1)(x + 1) - 2x", color: "text-blue-600" },
        { text: "📚 Développer (x - 1)(x + 1)", expr: "x² - 1", color: "text-green-600" },
        { text: "Substitution", expr: "x² + (x² - 1) - 2x", color: "text-orange-600" },
        { text: "Calcul", expr: "x² + x² - 1 - 2x", color: "text-red-600" },
        { text: "Résultat", expr: "2x² - 2x - 1", color: "text-purple-600" }
      ]
    },
    {
      id: 25,
      question: "2(x + 3)(x - 1) - x(x + 4)",
      steps: [
        { text: "Expression de départ", expr: "2(x + 3)(x - 1) - x(x + 4)", color: "text-blue-600" },
        { text: "📚 Développer (x + 3)(x - 1)", expr: "x² - x + 3x - 3 = x² + 2x - 3", color: "text-green-600" },
        { text: "Développer x(x + 4)", expr: "x² + 4x", color: "text-orange-600" },
        { text: "Substitution", expr: "2(x² + 2x - 3) - (x² + 4x)", color: "text-red-600" },
        { text: "Calcul", expr: "2x² + 4x - 6 - x² - 4x", color: "text-green-600" },
        { text: "Résultat", expr: "x² - 6", color: "text-purple-600" }
      ]
    }
  ]

  // EXERCICES MODE BEAST - Très difficiles dès le début !
  const beastExercises = [
    // Beast Niveau 1-12 : INTENSITÉ MAXIMALE mais distributivité 2x2 ou 2x3 max
    {
      id: 1,
      question: "(-7x³y²)(5x²y⁴ - 8x⁴z²)",
      steps: [
        { text: "Expression de départ", expr: "(-7x³y²)(5x²y⁴ - 8x⁴z²)", color: "text-blue-600" },
        { text: "🔥 BEAST ! Distribution puissante", expr: "(-7x³y²)×5x²y⁴ + (-7x³y²)×(-8x⁴z²)", color: "text-orange-600" },
        { text: "Calcul des puissances", expr: "-5x⁵y⁶ + 8x⁷y²z²", color: "text-red-600" },
        { text: "Résultat explosif", expr: "8x⁷y²z² - 5x⁵y⁶", color: "text-purple-600" }
      ]
    },
    {
      id: 2,
      question: "(6x⁴ - 9y³)(2x² - 4xy²)",
      steps: [
        { text: "Expression de départ", expr: "(6x⁴ - 9y³)(2x² - 4xy²)", color: "text-blue-600" },
        { text: "🔥 Quatre produits beast !", expr: "6x⁴×2x² + 6x⁴×(-4xy²) + (-9y³)×2x² + (-9y³)×(-4xy²)", color: "text-orange-600" },
        { text: "Calcul beast", expr: "3x⁶ - 6x⁵y² - 9x²y³ + 9xy⁵", color: "text-red-600" },
        { text: "Résultat beast", expr: "3x⁶ - 6x⁵y² - 9x²y³ + 9xy⁵", color: "text-purple-600" }
      ]
    },
    {
      id: 3,
      question: "(-4x⁵ - 7y³z²)(-3x³y² - 5x²y)",
      steps: [
        { text: "Expression de départ", expr: "(-4x⁵ - 7y³z²)(-3x³y² - 5x²y)", color: "text-blue-600" },
        { text: "🔥 BEAST MOINS × MOINS !", expr: "Triple variables avec signes négatifs", color: "text-orange-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+3x⁸y² + 5x⁷y + 7x³y⁵z² + 8x²y⁴z²", color: "text-red-600" },
        { text: "Résultat beast", expr: "3x⁸y² + 5x⁷y + 7x³y⁵z² + 8x²y⁴z²", color: "text-purple-600" }
      ]
    },
    {
      id: 4,
      question: "(8a⁴b² - 3c³)(9a³b⁴ - 4b²)",
      steps: [
        { text: "Expression de départ", expr: "(8a⁴b² - 3c³)(9a³b⁴ - 4b²)", color: "text-blue-600" },
        { text: "🔥 BEAST ! Trois variables avec puissances élevées", expr: "Beast calculation", color: "text-orange-600" },
        { text: "Résultat beast", expr: "9a⁷b⁶ - 8a⁴b⁴ - 3a³b⁴c³ + 3b²c³", color: "text-purple-600" }
      ]
    },
    {
      id: 5,
      question: "(-5x³y⁴)(6x⁵ - 7x²y³)",
      steps: [
        { text: "Expression de départ", expr: "(-5x³y⁴)(6x⁵ - 7x²y³)", color: "text-blue-600" },
        { text: "🔥 Deux termes avec puissances élevées", expr: "(-5x³y⁴)×6x⁵ + (-5x³y⁴)×(-7x²y³)", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-6x⁸y⁴ + 7x⁵y⁷", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 6 : ESCALADE BRUTALE
    {
      id: 6,
      question: "(3x⁶ - 4x³y⁴)(7x³ - 8y⁵)",
      steps: [
        { text: "Expression de départ", expr: "(3x⁶ - 4x³y⁴)(7x³ - 8y⁵)", color: "text-blue-600" },
        { text: "🔥 BEAST ! 4 produits puissants", expr: "Développement beast", color: "text-orange-600" },
        { text: "Résultat beast", expr: "7x⁹ - 6x⁶y⁵ - 4x⁶y⁴ + 8x³y⁹", color: "text-purple-600" }
      ]
    },
    {
      id: 7,
      question: "(-2a⁴b⁵ + 3a²bc³)(4a⁵ - 5b⁴)",
      steps: [
        { text: "Expression de départ", expr: "(-2a⁴b⁵ + 3a²bc³)(4a⁵ - 5b⁴)", color: "text-blue-600" },
        { text: "🔥 Triple variables beast", expr: "Beast calculation", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-8a⁹b⁵ + 2a⁴b⁹ + 3a⁷bc³ - 5a²b⁵c³", color: "text-purple-600" }
      ]
    },
    {
      id: 8,
      question: "(3x⁵ + 4x²y⁴)(5x⁴ - 6xy³)",
      steps: [
        { text: "Expression de départ", expr: "(3x⁵ + 4x²y⁴)(5x⁴ - 6xy³)", color: "text-blue-600" },
        { text: "🔥 Puissances jusqu'à 9 !", expr: "x⁹ dans le résultat", color: "text-orange-600" },
        { text: "Résultat beast", expr: "5x⁹ - 9x⁶y³ + 5x⁶y⁴ - 6x³y⁷", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 9 : PUISSANCES DÉCHAINÉES
    {
      id: 9,
      question: "(2x⁷ - 3x⁴y⁵)(9x³ + 4x²y²)",
      steps: [
        { text: "Expression de départ", expr: "(2x⁷ - 3x⁴y⁵)(9x³ + 4x²y²)", color: "text-blue-600" },
        { text: "🔥 BEAST ! Puissances jusqu'à 10", expr: "x¹⁰ beast", color: "text-orange-600" },
        { text: "Résultat beast", expr: "9x¹⁰ + 8x⁹y² - 9x⁷y⁵ - 3x⁶y⁷", color: "text-purple-600" }
      ]
    },
    {
      id: 10,
      question: "(-8x⁸ + 5x⁵y³)(4x⁴ - 7y⁶)",
      steps: [
        { text: "Expression de départ", expr: "(-8x⁸ + 5x⁵y³)(4x⁴ - 7y⁶)", color: "text-blue-600" },
        { text: "🔥 Puissance 12 maximale !", expr: "x¹² beast mode", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-8x¹² + 7x⁸y⁶ + 5x⁹y³ - 8x⁵y⁹", color: "text-red-600" },
        { text: "Simplifié", expr: "-8x¹² + 5x⁹y³ + 7x⁸y⁶ - 8x⁵y⁹", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 11-12 : QUATRE VARIABLES !
    {
      id: 11,
      question: "(8x³y² - 9z⁴w³)(5xy⁴ - 3xz²)",
      steps: [
        { text: "Expression de départ", expr: "(8x³y² - 9z⁴w³)(5xy⁴ - 3xz²)", color: "text-blue-600" },
        { text: "🔥 QUATRE VARIABLES BEAST !", expr: "x, y, z, w ensemble", color: "text-orange-600" },
        { text: "Résultat beast", expr: "8x⁴y⁶ - 6x⁴y²z² - 9x²y⁴z⁴w³ + 3x²z⁶w³", color: "text-purple-600" }
      ]
    },
    {
      id: 12,
      question: "(-9a⁶b²c⁴ + 2a³b⁷d²)(8a⁴b³ - 7c²d⁵)",
      steps: [
        { text: "Expression de départ", expr: "(-9a⁶b²c⁴ + 2a³b⁷d²)(8a⁴b³ - 7c²d⁵)", color: "text-blue-600" },
        { text: "🔥 Quatre variables avec signes beast", expr: "a, b, c, d beast", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-9a¹⁰b⁵c⁴ + 7a⁶b²c⁶d⁵ + 4a⁷b¹⁰d² - 3a³b⁷c²d⁷", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 13-22 : SOMMES DE DOUBLE DISTRIBUTIVITÉ !
    {
      id: 13,
      question: "(7x² + 5)(9x - 3) + (2x - 9)(4x² + 1)",
      steps: [
        { text: "Expression de départ", expr: "(7x² + 5)(9x - 3) + (2x - 9)(4x² + 1)", color: "text-blue-600" },
        { text: "🔥 SOMME DE DOUBLE DISTRIBUTIVITÉ !", expr: "Deux doubles développements", color: "text-orange-600" },
        { text: "Premier développement", expr: "9x³ - 3x² + 9x - 5", color: "text-green-600" },
        { text: "Second développement", expr: "8x³ + 2x - 9x² - 9", color: "text-orange-600" },
        { text: "Somme finale", expr: "9x³ - 3x² + 9x - 5 + 8x³ - 9x² + 2x - 9", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "7x³ - 2x² + 6x - 4", color: "text-purple-600" }
      ]
    },
    {
      id: 14,
      question: "(8x³ - 7)(2x + 9) - (5x² - 1)(6x - 3)",
      steps: [
        { text: "Expression de départ", expr: "(8x³ - 7)(2x + 9) - (5x² - 1)(6x - 3)", color: "text-blue-600" },
        { text: "🔥 DOUBLE DIFFÉRENCE BEAST !", expr: "Calcul des deux produits", color: "text-orange-600" },
        { text: "Premier", expr: "6x⁴ + 9x³ - 4x - 3", color: "text-green-600" },
        { text: "Second", expr: "8x³ - 5x² - 6x + 3", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "6x⁴ + x³ + 5x² + 2x - 6", color: "text-purple-600" }
      ]
    },
    {
      id: 15,
      question: "(4x⁴ - 8)(7x² + 9) + (2x³ - 1)(3x⁵ + 7)",
      steps: [
        { text: "Expression de départ", expr: "(4x⁴ - 8)(7x² + 9) + (2x³ - 1)(3x⁵ + 7)", color: "text-blue-600" },
        { text: "🔥 PUISSANCES DANS LA SOMME !", expr: "Degré 8 beast", color: "text-orange-600" },
        { text: "Premier", expr: "8x⁶ + 9x⁴ - 6x² - 2", color: "text-green-600" },
        { text: "Second", expr: "6x⁸ + 4x³ - 3x⁵ - 7", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "6x⁸ + 8x⁶ - 3x⁵ + 9x⁴ + 4x³ - 6x² - 9", color: "text-purple-600" }
      ]
    },
    {
      id: 16,
      question: "(3x³ - 7y⁴)(9x² + 1y) - (-8x⁴ + 3y²)(9x - 7y³)",
      steps: [
        { text: "Expression de départ", expr: "(3x³ - 7y⁴)(9x² + 1y) - (-8x⁴ + 3y²)(9x - 7y³)", color: "text-blue-600" },
        { text: "🔥 DEUX VARIABLES BEAST DIFFÉRENCE !", expr: "x et y dans les deux", color: "text-orange-600" },
        { text: "Premier", expr: "7x⁵ + 3x³y - 3x²y⁴ - 7y⁵", color: "text-green-600" },
        { text: "Second", expr: "-2x⁵ + 6x⁴y³ + 7x²y² - 1y⁵", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "9x⁵ - 6x⁴y³ + 3x³y - 3x²y⁴ - 7x²y² - 6y⁵", color: "text-purple-600" }
      ]
    },
    {
      id: 17,
      question: "(3a⁴ + 9b³)(1a² - 7b⁵) + (6a³ + 4b²)(2a⁴ - 9b⁶)",
      steps: [
        { text: "Expression de départ", expr: "(3a⁴ + 9b³)(1a² - 7b⁵) + (6a³ + 4b²)(2a⁴ - 9b⁶)", color: "text-blue-600" },
        { text: "🔥 VARIABLES a,b BEAST SOMME !", expr: "Double distributivité complexe", color: "text-orange-600" },
        { text: "Premier", expr: "3a⁶ - 1a⁴b⁵ + 9a²b³ - 3b⁸", color: "text-green-600" },
        { text: "Second", expr: "2a⁷ - 4a³b⁶ + 8a⁴b² - 6b⁸", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "2a⁷ + 3a⁶ + 8a⁴b² - 1a⁴b⁵ + 9a²b³ - 4a³b⁶ - 9b⁸", color: "text-purple-600" }
      ]
    },
    {
      id: 18,
      question: "(1x⁶ + 7x³)(3x⁴ - 1) - (8x⁵ - 9)(4x⁷ - 7x²)",
      steps: [
        { text: "Expression de départ", expr: "(1x⁶ + 7x³)(3x⁴ - 1) - (8x⁵ - 9)(4x⁷ - 7x²)", color: "text-blue-600" },
        { text: "🔥 DEGRÉ 12 BEAST DIFFÉRENCE !", expr: "x¹² partout", color: "text-orange-600" },
        { text: "Premier", expr: "3x¹⁰ - 1x⁶ + 1x⁷ - 7x³", color: "text-green-600" },
        { text: "Second", expr: "2x¹² - 6x⁷ - 6x⁷ + 3x²", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "-2x¹² + 3x¹⁰ + 5x⁷ - 1x⁶ - 7x³ - 3x²", color: "text-purple-600" }
      ]
    },
    {
      id: 19,
      question: "(7x⁴ - 9y⁶)(2x³ + 1y²) + (3x⁷ + 7y⁴)(4x - 9y³)",
      steps: [
        { text: "Expression de départ", expr: "(7x⁴ - 9y⁶)(2x³ + 1y²) + (3x⁷ + 7y⁴)(4x - 9y³)", color: "text-blue-600" },
        { text: "🔥 VARIABLES CROISÉES BEAST !", expr: "Somme complexe", color: "text-orange-600" },
        { text: "Premier", expr: "4x⁷ + 7x⁴y² - 8x³y⁶ - 9y⁸", color: "text-green-600" },
        { text: "Second", expr: "2x⁸ - 7x⁷y³ + 8x⁴y - 3y⁷", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "2x⁸ + 4x⁷ - 7x⁷y³ + 8x⁴y + 7x⁴y² - 8x³y⁶ - 3y⁷ - 9y⁸", color: "text-purple-600" }
      ]
    },
    {
      id: 20,
      question: "(3x⁸ - 1)(2x³ + 7) - (4x⁵ + 6)(9x⁶ - 2)",
      steps: [
        { text: "Expression de départ", expr: "(3x⁸ - 1)(2x³ + 7) - (4x⁵ + 6)(9x⁶ - 2)", color: "text-blue-600" },
        { text: "🔥 COEFFICIENTS ÉLEVÉS BEAST !", expr: "Gros coefficients", color: "text-orange-600" },
        { text: "Premier", expr: "6x¹¹ + 1x⁸ - 2x³ - 7", color: "text-green-600" },
        { text: "Second", expr: "6x¹¹ - 8x⁵ + 4x⁶ - 2", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "-6x¹¹ + 1x⁸ - 4x⁶ + 8x⁵ - 2x³ - 5", color: "text-purple-600" }
      ]
    },
    {
      id: 21,
      question: "(7x⁹ - 3x⁴)(4x⁵ + 6x²) - (6x⁷ - 9)(8x⁶ + 7x³)",
      steps: [
        { text: "Expression de départ", expr: "(7x⁹ - 3x⁴)(4x⁵ + 6x²) - (6x⁷ - 9)(8x⁶ + 7x³)", color: "text-blue-600" },
        { text: "🔥 DEGRÉ 14 COMPLEXE BEAST !", expr: "x¹⁴ avec coefficients", color: "text-orange-600" },
        { text: "Premier", expr: "8x¹⁴ + 2x¹¹ - 3x⁹ - 8x⁶", color: "text-green-600" },
        { text: "Second", expr: "8x¹³ + 2x¹⁰ - 2x⁶ - 3x³", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "8x¹⁴ - 8x¹³ + 2x¹¹ - 2x¹⁰ - 3x⁹ - 6x⁶ + 3x³", color: "text-purple-600" }
      ]
    },
    {
      id: 22,
      question: "(7a⁶ - 6b⁸)(3a³ + 9b⁴) + (6a⁵ + 3b⁷)(1a⁴ - 7b²)",
      steps: [
        { text: "Expression de départ", expr: "(7a⁶ - 6b⁸)(3a³ + 9b⁴) + (6a⁵ + 3b⁷)(1a⁴ - 7b²)", color: "text-blue-600" },
        { text: "🔥 VARIABLES a,b ULTIMATE !", expr: "Coefficients maximums", color: "text-orange-600" },
        { text: "Premier", expr: "1a⁹ + 3a⁶b⁴ - 8a³b⁸ - 4b¹²", color: "text-green-600" },
        { text: "Second", expr: "6a⁹ - 2a⁵b² + 3a⁴b⁷ - 1b⁹", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "7a⁹ + 3a⁶b⁴ - 2a⁵b² + 3a⁴b⁷ - 8a³b⁸ - 1b⁹ - 4b¹²", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 23-24 : INTRODUCTION AUX PRIORITÉS OPÉRATOIRES !
    {
      id: 23,
      question: "3x² + (2x - 1)(4x + 5) - x(x - 3) × 2",
      steps: [
        { text: "Expression de départ", expr: "3x² + (2x - 1)(4x + 5) - x(x - 3) × 2", color: "text-blue-600" },
        { text: "🔥 PRIORITÉS OPÉRATOIRES BEAST !", expr: "D'abord les parenthèses, puis la multiplication", color: "text-orange-600" },
        { text: "Développement (2x - 1)(4x + 5)", expr: "8x² + 6x - 5", color: "text-green-600" },
        { text: "Développement x(x - 3) × 2", expr: "2x(x - 3) = 2x² - 6x", color: "text-orange-600" },
        { text: "Substitution", expr: "3x² + (8x² + 6x - 5) - (2x² - 6x)", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "9x² + 2x - 5", color: "text-purple-600" }
      ]
    },
    {
      id: 24,
      question: "5x³ - 2x(3x² - 4x + 1) + (x + 2)(x² - 3) × 3",
      steps: [
        { text: "Expression de départ", expr: "5x³ - 2x(3x² - 4x + 1) + (x + 2)(x² - 3) × 3", color: "text-blue-600" },
        { text: "🔥 PRIORITÉS COMPLEXES BEAST !", expr: "Multiple distributivités avec priorités", color: "text-orange-600" },
        { text: "Développement 2x(3x² - 4x + 1)", expr: "6x³ - 8x² + 2x", color: "text-green-600" },
        { text: "Développement (x + 2)(x² - 3) × 3", expr: "3(x³ - 3x + 2x² - 6) = 3x³ + 6x² - 9x - 8", color: "text-orange-600" },
        { text: "Substitution", expr: "5x³ - (6x³ - 8x² + 2x) + (3x³ + 6x² - 9x - 8)", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "2x³ + 4x² - 1x - 8", color: "text-purple-600" }
      ]
    },

    // Beast Niveau 25-30 : PRIORITÉS OPÉRATOIRES ESCALADANTES !
    {
      id: 25,
      question: "x² + 3x(2x - 1)(x + 2) - (x + 1)(x - 2)(x + 3)",
      steps: [
        { text: "Expression de départ", expr: "x² + 3x(2x - 1)(x + 2) - (x + 1)(x - 2)(x + 3)", color: "text-blue-600" },
        { text: "🔥 DOUBLE + TRIPLE PRODUIT BEAST !", expr: "Priorités avec double et triple multiplication", color: "text-orange-600" },
        { text: "Développement (2x - 1)(x + 2)", expr: "2x² + 3x - 2", color: "text-green-600" },
        { text: "Développement 3x(2x - 1)(x + 2)", expr: "3x(2x² + 3x - 2) = 6x³ + 9x² - 6x", color: "text-orange-600" },
        { text: "Triple produit", expr: "(x + 1)(x - 2)(x + 3) = (x² - x - 2)(x + 3) = x³ + 2x² - 5x - 6", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "x² + 6x³ + 9x² - 6x - x³ - 2x² + 5x + 6 = 5x³ + 8x² - x + 6", color: "text-purple-600" }
      ]
    },
    {
      id: 26,
      question: "2x⁴ - x²(3x + 2)(x - 1) + 4x(x - 1)(2x + 3) - (x² + 1)(x + 2)",
      steps: [
        { text: "Expression de départ", expr: "2x⁴ - x²(3x + 2)(x - 1) + 4x(x - 1)(2x + 3) - (x² + 1)(x + 2)", color: "text-blue-600" },
        { text: "🔥 PRIORITÉS MULTIPLES BEAST !", expr: "Doubles produits et distributivités complexes", color: "text-orange-600" },
        { text: "Développement (3x + 2)(x - 1)", expr: "3x² - x - 2", color: "text-green-600" },
        { text: "Calcul x²(3x + 2)(x - 1)", expr: "x²(3x² - x - 2) = 3x⁴ - x³ - 2x²", color: "text-orange-600" },
        { text: "Double produit (x - 1)(2x + 3)", expr: "2x² + x - 3", color: "text-green-600" },
        { text: "Calcul 4x(x - 1)(2x + 3)", expr: "4x(2x² + x - 3) = 8x³ + 4x² - 2x", color: "text-orange-600" },
        { text: "Produit (x² + 1)(x + 2)", expr: "x³ + 2x² + x + 2", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "2x⁴ - 3x⁴ + x³ + 2x² + 8x³ + 4x² - 2x - x³ - 2x² - x - 2 = -x⁴ + 8x³ + 4x² - 3x - 2", color: "text-purple-600" }
      ]
    },
    {
      id: 27,
      question: "3x(x + 1)(x - 5) - 2(x - 2)(x + 3)(x + 7) + x²(2x - 1)(x + 4)",
      steps: [
        { text: "Expression de départ", expr: "3x(x + 1)(x - 5) - 2(x - 2)(x + 3)(x + 7) + x²(2x - 1)(x + 4)", color: "text-blue-600" },
        { text: "🔥 DISTRIBUTIVITÉS MULTIPLES BEAST !", expr: "Triple distributivité, triple produit, et plus", color: "text-orange-600" },
        { text: "Résultat ultra-complexe", expr: "Expression beast avec distributivités multiples", color: "text-purple-600" }
      ]
    },
    {
      id: 28,
      question: "x⁵ - 3x²(2x - 1)(x + 6) + 2(x + 1)(x - 3)(x + 8) - x(x² + 2)(x - 7)",
      steps: [
        { text: "Expression de départ", expr: "x⁵ - 3x²(2x - 1)(x + 6) + 2(x + 1)(x - 3)(x + 8) - x(x² + 2)(x - 7)", color: "text-blue-600" },
        { text: "🔥 DISTRIBUTIVITÉS MULTIPLES !", expr: "Double et triple distributivités complexes", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "Expression complexe avec distributivités multiples", color: "text-purple-600" }
      ]
    },
    {
      id: 29,
      question: "4x²(x - 1)(x + 9) - (2x + 1)(x - 2)(x + 5) + 3x(x + 3)(x - 4)(x + 1)",
      steps: [
        { text: "Expression de départ", expr: "4x²(x - 1)(x + 9) - (2x + 1)(x - 2)(x + 5) + 3x(x + 3)(x - 4)(x + 1)", color: "text-blue-600" },
        { text: "🔥 DISTRIBUTIVITÉS GÉANTES !", expr: "Triple distributivité répétée avec coefficients", color: "text-orange-600" },
        { text: "🔥 BEAST ULTIME", expr: "Expression titanesque avec distributivités multiples", color: "text-purple-600" }
      ]
    },
    {
      id: 30,
      question: "x³(2x + 3)(x - 8) - 2x²(x - 1)(x + 2)(x + 2) + (3x - 2)(x + 1)(x - 6)",
      steps: [
        { text: "Expression de départ", expr: "x³(2x + 3)(x - 8) - 2x²(x - 1)(x + 2)(x + 2) + (3x - 2)(x + 1)(x - 6)", color: "text-blue-600" },
        { text: "🔥 DISTRIBUTIVITÉS COLOSSALES !", expr: "Triple et quadruple distributivités avec coefficients", color: "text-orange-600" },
        { text: "🔥 CHAMPION PRIORITÉS", expr: "Expression colossale avec distributivités complexes", color: "text-purple-600" }
      ]
    },

    // Beast Niveau 31-35 : APOCALYPSE PRIORITÉS OPÉRATOIRES !
    {
      id: 31,
      question: "5x⁴(x - 2)(x + 3) - 3x²(2x + 1)(x - 3)(x + 4) + x(x + 1)(x - 1)(x + 5)",
      steps: [
        { text: "Expression de départ", expr: "5x⁴(x - 2)(x + 3) - 3x²(2x + 1)(x - 3)(x + 4) + x(x + 1)(x - 1)(x + 5)", color: "text-blue-600" },
        { text: "💀 DISTRIBUTIVITÉS APOCALYPTIQUES !", expr: "Quadruple distributivités avec coefficients complexes", color: "text-orange-600" },
        { text: "💀 APOCALYPSE BEAST", expr: "Expression démoniaque avec distributivités multiples", color: "text-purple-600" }
      ]
    },
    {
      id: 32,
      question: "x⁶ - 2x³(3x - 1)(2x + 5) + 4x²(x + 2)(x - 3)(2x - 3) - (x² + x + 1)(x + 4)",
      steps: [
        { text: "Expression de départ", expr: "x⁶ - 2x³(3x - 1)(2x + 5) + 4x²(x + 2)(x - 3)(2x - 3) - (x² + x + 1)(x + 4)", color: "text-blue-600" },
        { text: "💀 DISTRIBUTIVITÉS MULTIPLES !", expr: "Doubles et triples produits avec distributivité", color: "text-orange-600" },
        { text: "💀 SUPRÊME BEAST", expr: "Expression complexe avec distributivités multiples", color: "text-purple-600" }
      ]
    },
    {
      id: 33,
      question: "3x⁵(2x - 3)(x + 6) - x⁴(x + 1)(x - 2)(x + 7) + 2x²(3x + 2)(x - 1)(x + 8)",
      steps: [
        { text: "Expression de départ", expr: "3x⁵(2x - 3)(x + 6) - x⁴(x + 1)(x - 2)(x + 7) + 2x²(3x + 2)(x - 1)(x + 8)", color: "text-blue-600" },
        { text: "💀 DISTRIBUTIVITÉS DÉMONIAQUES !", expr: "Triple distributivités avec coefficients élevés", color: "text-orange-600" },
        { text: "💀 LÉGENDE BEAST", expr: "Expression légendaire avec distributivités complexes", color: "text-purple-600" }
      ]
    },
    {
      id: 34,
      question: "x⁷ - 4x⁴(2x + 1)(x - 9) + 3x³(x - 1)(x + 2)(x + 2) - 2x²(3x + 1)(x - 3)(x + 1)",
      steps: [
        { text: "Expression de départ", expr: "x⁷ - 4x⁴(2x + 1)(x - 9) + 3x³(x - 1)(x + 2)(x + 2) - 2x²(3x + 1)(x - 3)(x + 1)", color: "text-blue-600" },
        { text: "💀 DISTRIBUTIVITÉS ULTIMES !", expr: "Triple et quadruple distributivités avec coefficients géants", color: "text-orange-600" },
        { text: "💀 MAÎTRE BEAST", expr: "Expression mythique avec distributivités complexes", color: "text-purple-600" }
      ]
    },
    {
      id: 35,
      question: "2x⁸ - x⁶(3x - 2)(x + 4) + 5x⁴(x + 1)(x - 5)(2x - 1) - 3x²(x² + x + 1)(x - 2) + x(4x + 3)(2x + 7)(x - 3)",
      steps: [
        { text: "Expression de départ", expr: "2x⁸ - x⁶(3x - 2)(x + 4) + 5x⁴(x + 1)(x - 5)(2x - 1) - 3x²(x² + x + 1)(x - 2) + x(4x + 3)(2x + 7)(x - 3)", color: "text-blue-600" },
        { text: "💀 DISTRIBUTIVITÉS SUPRÊMES !", expr: "Multiples distributivités avec produits complexes", color: "text-orange-600" },
        { text: "💀 EMPEREUR BEAST SUPRÊME !", expr: "5 termes géants avec distributivités multiples", color: "text-red-600" },
        { text: "💀 CHAMPION PRIORITÉS ULTIME", expr: "Expression divine avec distributivités complexes", color: "text-purple-600" }
      ]
    }
  ]

      // EXERCICES MODE HARDCORE - SUPPRIMÉS
  const hardcoreExercises = [
    // Liste vide - exercices hardcore supprimés
  ]

  // Sélectionner les exercices selon le mode
  const exercises = exerciseLevel === 'normal' ? normalExercises : exerciseLevel === 'beast' ? beastExercises : hardcoreExercises
  const currentEx = exercises[currentExercise]
  const currentAnim = distributivityAnimations[selectedAnimation]

      // Pas d'animation automatique - contrôle manuel

  // Pas d'animation automatique - contrôle manuel

  const nextStep = () => {
    if (animationStep < currentAnim.steps.length - 1) {
      setAnimationStep(animationStep + 1)
    }
  }

  const prevStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1)
    }
  }

  const resetAnimation = () => {
    setAnimationStep(0)
    setAnimationPlaying(false)
  }

  // Fonctions pour gérer les exercices
  const resetExercise = () => {
    setShowSolution(false)
    setSolutionStep(0)
    setUserAnswer('')
    setShowAnswer(false)
    setAnswerFeedback(null)
  }

  const resetCounters = () => {
    setCorrectAnswersNormal(0)
    setCorrectAnswersBeast(0)
    setCorrectAnswersHardcore(0)
  }

  const checkAnswer = () => {
    // La réponse correcte est dans le dernier step
    const correctAnswer = currentEx.steps[currentEx.steps.length - 1].expr
    
    const userAnswerTrimmed = userAnswer.trim().toLowerCase().replace(/\s+/g, '')
    const correctAnswerTrimmed = correctAnswer.trim().toLowerCase().replace(/\s+/g, '')
    
    // Variantes acceptées (avec ou sans espaces, parenthèses optionnelles)
    const normalizeAnswer = (answer: string) => {
      return answer
        .replace(/\s+/g, '') // Supprimer tous les espaces
        .replace(/\+\-/g, '-') // +- devient -
        .replace(/\-\+/g, '-') // -+ devient -
        .replace(/\*\*/g, '^') // ** devient ^
        .replace(/×/g, '*') // × devient *
    }
    
    const normalizedUser = normalizeAnswer(userAnswerTrimmed)
    const normalizedCorrect = normalizeAnswer(correctAnswerTrimmed)
    
    if (normalizedUser === normalizedCorrect) {
      setAnswerFeedback('correct')
      
      // Incrémenter le compteur approprié
      if (exerciseLevel === 'normal') {
        setCorrectAnswersNormal(prev => prev + 1)
      } else if (exerciseLevel === 'beast') {
        setCorrectAnswersBeast(prev => prev + 1)
    } else {
        setCorrectAnswersHardcore(prev => prev + 1)
      }
      
      // Afficher une indication visuelle temporaire
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
      setUserAnswer('')
      setShowAnswer(false)
      setAnswerFeedback(null)
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setUserAnswer('')
      setShowAnswer(false)
      setAnswerFeedback(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header simplifié */}
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
                📐
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Développement</h1>
                <p className="text-gray-600 text-lg">
                  Utiliser la distributivité pour développer
                </p>
              </div>
              <div className="text-right">
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
            {/* Formules fixes en premier */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-6">📚 Règles de Distributivité</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distributivité simple */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-700 mb-4">🎯 Distributivité Simple</h3>
                  <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-xl font-mono text-blue-800 text-center">
                        a(b + c) = ab + ac
                    </div>
                  </div>
                    <div className="text-gray-700">
                      Le facteur <span className="font-bold text-blue-600">a</span> se distribue sur chaque terme de la parenthèse.
                </div>
                    <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-gray-600 font-mono">Exemple : 3(x + 2) = 3x + 6</p>
                    </div>
                  </div>
                </div>

                {/* Double distributivité */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
                  <h3 className="text-lg font-bold text-indigo-700 mb-4">🚀 Double Distributivité</h3>
                  <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <div className="text-lg font-mono text-indigo-800 text-center">
                      (a + b)(c + d) = ac + ad + bc + bd
                  </div>
                </div>
                    <div className="text-gray-700">
                      Chaque terme de la première parenthèse multiplie chaque terme de la seconde.
                    </div>
                    <div className="bg-gray-50 p-3 rounded border-l-4 border-indigo-400">
                      <p className="text-sm text-gray-600 font-mono">Exemple : (x + 1)(x + 2) = x² + 3x + 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur d'animation */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">🎬 Animations Explicatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {distributivityAnimations.map((anim, index) => (
                  <button
                    key={anim.id}
                    onClick={() => {
                      setSelectedAnimation(index)
                      resetAnimation()
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                      selectedAnimation === index
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-lg font-bold mb-2 text-gray-800">{anim.title}</div>
                    <div className="font-mono text-blue-700 text-lg">{anim.expression}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Zone d'animation principale */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{currentAnim.title}</h2>
                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    disabled={animationStep === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Précédent
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={animationStep >= currentAnim.steps.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    Suivant
                    <ArrowLeft size={16} className="rotate-180" />
                  </button>
                  <button
                    onClick={resetAnimation}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Affichage de l'animation avec vrais mouvements */}
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 min-h-[600px] flex flex-col relative overflow-visible">
                <div className="text-center space-y-6">
                  
                  {/* Animation pour distributivité simple */}
                  {selectedAnimation === 0 && (
                    <div className="space-y-8">
                      {/* Expression de départ - TOUJOURS VISIBLE */}
                      <div className="text-center">
                        <div className="text-4xl font-mono font-bold text-gray-800 mb-6">
                          <span className={`${animationStep === 1 ? 'text-red-600 bg-yellow-200 px-2 rounded animate-pulse' : 'text-red-600 font-extrabold'}`}>3</span>
                          <span className="text-gray-800">(x + 2)</span>
                        </div>
                      </div>
                      
                      {/* Étapes qui apparaissent progressivement et restent affichées */}
                      <div className="space-y-4">
                        {/* Étape 1: Distribution - Reste visible */}
                        <div 
                          className="text-3xl font-mono font-bold transition-all duration-1000 ease-in-out text-center"
                          style={{ 
                            opacity: animationStep >= 2 ? 1 : 0,
                            transform: animationStep >= 2 ? 'translateY(0)' : 'translateY(20px)'
                          }}
                        >
                          <span className="text-red-600 font-extrabold">3</span>
                          <span className="text-blue-600"> × x + </span>
                          <span className="text-red-600 font-extrabold">3</span>
                          <span className="text-blue-600"> × 2</span>
                        </div>
                        
                        {/* Étape 2: Résultat final - Reste visible */}
                        <div 
                          className="text-3xl font-mono font-bold transition-all duration-1000 ease-in-out text-center"
                          style={{ 
                            opacity: animationStep >= 3 ? 1 : 0,
                            transform: animationStep >= 3 ? 'translateY(0)' : 'translateY(20px)'
                          }}
                        >
                          <span className="text-green-600 font-extrabold">3x + 6</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Animation pour distributivité avec signe négatif */}
                  {selectedAnimation === 1 && (
                    <div className="space-y-8">
                      {/* Expression de départ - TOUJOURS VISIBLE */}
                      <div className="relative">
                        <div className="text-4xl font-mono font-bold text-gray-800 relative">
                          {animationStep >= 1 ? (
                            <div className="flex items-center justify-center">
                              <span className={`${animationStep === 1 ? 'text-red-600 bg-red-100 px-2 rounded animate-pulse' : 'text-red-600 font-extrabold'}`}>-2</span>
                              <span className="text-gray-800">(x + 3)</span>
                            </div>
                          ) : (
                            <span>-2(x + 3)</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Étapes qui apparaissent progressivement */}
                      <div className="space-y-4 mt-8">
                        {/* Étape 1: Distribution */}
                        {animationStep >= 2 && (
                          <div 
                            className="text-3xl font-mono font-bold transition-all duration-1000 ease-in-out"
                            style={{ 
                              opacity: animationStep >= 2 ? 1 : 0,
                              transform: animationStep >= 2 ? 'translateY(0)' : 'translateY(20px)'
                            }}
                          >
                            <span className="text-blue-600">(</span>
                            <span className="text-red-600 font-extrabold">-2</span>
                            <span className="text-blue-600">) × x + (</span>
                            <span className="text-red-600 font-extrabold">-2</span>
                            <span className="text-blue-600">) × 3</span>
                          </div>
                        )}
                        
                        {/* Étape 2: Résultat final */}
                        {animationStep >= 3 && (
                          <div 
                            className="text-3xl font-mono font-bold transition-all duration-1000 ease-in-out"
                            style={{ 
                              opacity: animationStep >= 3 ? 1 : 0,
                              transform: animationStep >= 3 ? 'translateY(0)' : 'translateY(20px)'
                            }}
                          >
                            <span className="text-red-600 font-extrabold">-2</span>
                            <span className="text-green-600">x </span>
                            <span className="text-red-600 font-extrabold">- 6</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Animation pour double distributivité */}
                  {selectedAnimation === 2 && (
                    <div className="space-y-8 relative" style={{ overflow: 'visible' }}>
                      {/* Expression de départ - TOUJOURS VISIBLE */}
                      <div className="text-center p-8 bg-white rounded-lg border-2 border-blue-200 min-h-[400px] relative z-10" style={{ overflow: 'visible' }}>
                        {/* Expression avec overlay pour les flèches */}
                        <div className="relative h-full">
                          <div className="text-3xl sm:text-4xl font-mono font-bold text-gray-800 mb-4 text-center mt-8">
                            <span className="text-blue-600 font-extrabold" id="term-a">(a + 1)</span>
                            <span className="text-red-600 font-extrabold ml-2" id="term-b">(b + 2)</span>
                          </div>
                          
                          {/* Flèches SVG superposées */}
                          {animationStep >= 1 && (
                            <div className="absolute top-0 left-0 right-0 pointer-events-none z-50" style={{ height: '400px', zIndex: 9999, overflow: 'visible', transform: 'translateY(-120px)' }}>
                              <svg className="w-full h-full" viewBox="0 -80 500 200" style={{ overflow: 'visible' }}>
                                {/* Flèche 1: a × b - du premier 'a' au 'b' - belle parabole courbée */}
                                {animationStep >= 1 && (
                                  <g>
                                    <path
                                      d="M 189 -27 Q 252 -67 315 -27"
                                      stroke="#8b5cf6"
                                      strokeWidth="2"
                                      fill="none"
                                      markerEnd="url(#arrowhead-purple)"
                                      className="animate-pulse"
                                    />
                                    <text x="252" y="-57" textAnchor="middle" className="text-xs fill-purple-600 font-bold">a × b = ab</text>
                                  </g>
                                )}
                                
                                {/* Flèche 2: a × 2 - du premier 'a' au '2' */}
                                {animationStep >= 2 && (
                                  <g>
                                    <path
                                      d="M 189 5 Q 280 -10 371 5"
                                      stroke="#059669"
                                      strokeWidth="2"
                                      fill="none"
                                      markerEnd="url(#arrowhead-green)"
                                      className="animate-pulse"
                                    />
                                    <text x="280" y="0" textAnchor="middle" className="text-xs fill-green-600 font-bold">a × 2 = 2a</text>
                                  </g>
                                )}
                                
                                {/* Flèche 3: 1 × b - du '1' au 'b' */}
                                {animationStep >= 3 && (
                                  <g>
                                    <path
                                      d="M 220 15 Q 280 45 340 15"
                                      stroke="#dc2626"
                                      strokeWidth="2"
                                      fill="none"
                                      markerEnd="url(#arrowhead-red)"
                                      className="animate-pulse"
                                    />
                                    <text x="280" y="40" textAnchor="middle" className="text-xs fill-red-600 font-bold">1 × b = b</text>
                                  </g>
                                )}
                                
                                {/* Flèche 4: 1 × 2 - du '1' au '2' */}
                                {animationStep >= 4 && (
                                  <g>
                                    <path
                                      d="M 220 25 Q 295 55 371 25"
                                      stroke="#ea580c"
                                      strokeWidth="2"
                                      fill="none"
                                      markerEnd="url(#arrowhead-orange)"
                                      className="animate-pulse"
                                    />
                                    <text x="295" y="50" textAnchor="middle" className="text-xs fill-orange-600 font-bold">1 × 2 = 2</text>
                                  </g>
                                )}
                                
                                {/* Définitions des pointes de flèches */}
                                <defs>
                                  <marker id="arrowhead-purple" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
                                    <polygon points="0 0, 10 4, 0 8" fill="#8b5cf6" />
                                  </marker>
                                  <marker id="arrowhead-green" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
                                    <polygon points="0 0, 10 4, 0 8" fill="#059669" />
                                  </marker>
                                  <marker id="arrowhead-red" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
                                    <polygon points="0 0, 10 4, 0 8" fill="#dc2626" />
                                  </marker>
                                  <marker id="arrowhead-orange" markerWidth="10" markerHeight="8" refX="10" refY="4" orient="auto">
                                    <polygon points="0 0, 10 4, 0 8" fill="#ea580c" />
                                  </marker>
                                </defs>
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600">Expression de départ</p>
                      </div>
                      
                      {/* Étape 1: Flèche a × b */}
                      {animationStep >= 1 && (
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-mono font-bold">
                              <span className="text-blue-600 bg-blue-200 px-2 rounded">a</span>
                              <span className="text-gray-600"> × </span>
                              <span className="text-red-600 bg-red-200 px-2 rounded">b</span>
                              <span className="text-gray-600"> = </span>
                              <span className="text-purple-600 font-extrabold">ab</span>
                            </div>
                            <div className="text-sm text-gray-600">Première flèche</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Étape 2: Flèche a × 2 */}
                      {animationStep >= 2 && (
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-mono font-bold">
                              <span className="text-blue-600 bg-blue-200 px-2 rounded">a</span>
                              <span className="text-gray-600"> × </span>
                              <span className="text-red-600 bg-red-200 px-2 rounded">2</span>
                              <span className="text-gray-600"> = </span>
                              <span className="text-green-600 font-extrabold">2a</span>
                            </div>
                            <div className="text-sm text-gray-600">Deuxième flèche</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Étape 3: Flèche 1 × b */}
                      {animationStep >= 3 && (
                        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-mono font-bold">
                              <span className="text-blue-600 bg-blue-200 px-2 rounded">1</span>
                              <span className="text-gray-600"> × </span>
                              <span className="text-red-600 bg-red-200 px-2 rounded">b</span>
                              <span className="text-gray-600"> = </span>
                              <span className="text-red-600 font-extrabold">b</span>
                            </div>
                            <div className="text-sm text-gray-600">Troisième flèche</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Étape 4: Flèche 1 × 2 */}
                      {animationStep >= 4 && (
                        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-mono font-bold">
                              <span className="text-blue-600 bg-blue-200 px-2 rounded">1</span>
                              <span className="text-gray-600"> × </span>
                              <span className="text-red-600 bg-red-200 px-2 rounded">2</span>
                              <span className="text-gray-600"> = </span>
                              <span className="text-orange-600 font-extrabold">2</span>
                            </div>
                            <div className="text-sm text-gray-600">Quatrième flèche</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Étape 5: Récapitulatif de tous les produits */}
                      {animationStep >= 5 && (
                        <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                          <div className="text-center">
                            <div className="text-2xl font-mono font-bold mb-2">
                              <span className="text-purple-600 font-extrabold">ab</span>
                              <span className="text-gray-600"> + </span>
                              <span className="text-green-600 font-extrabold">2a</span>
                              <span className="text-gray-600"> + </span>
                              <span className="text-red-600 font-extrabold">b</span>
                              <span className="text-gray-600"> + </span>
                              <span className="text-orange-600 font-extrabold">2</span>
                            </div>
                            <p className="text-gray-600">Récapitulatif de tous les produits</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Étape 6: Développement */}
                      {animationStep >= 6 && (
                        <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                          <div className="text-center">
                            <div className="text-2xl font-mono font-bold mb-2">
                              <span className="text-indigo-600">ab + 2a + b + 2</span>
                            </div>
                            <p className="text-gray-600">Développement complet</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Étape 7: Résultat final */}
                      {animationStep >= 7 && (
                        <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-600">
                          <div className="text-center">
                            <div className="text-3xl font-mono font-bold mb-2">
                              <span className="text-green-700 font-extrabold">ab + 2a + b + 2</span>
                            </div>
                            <p className="text-gray-600">Résultat final : impossible de regrouper davantage</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description de l'étape */}
                  <div className={`text-lg font-medium transition-all duration-800 ease-in-out ${
                    animationPlaying ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {currentAnim.steps[animationStep]?.description || 'Cliquez sur "Jouer" pour voir la distributivité étape par étape !'}
                  </div>

                  {/* Indicateur de progression */}
                  <div className="flex justify-center space-x-2">
                    {currentAnim.steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${
                          index <= animationStep
                            ? 'bg-blue-500 scale-125'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercices */}
        {activeTab === 'exercices' && (
          <div className="space-y-8">
            {/* Sélecteur de mode */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🎯 Exercices de développement</h2>
                
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => {
                      setExerciseLevel('normal')
                      setCurrentExercise(0)
                      resetExercise()
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-bold shadow-md transition-colors ${
                      exerciseLevel === 'normal' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <span className="text-xl">📝</span>
                    Normal: {correctAnswersNormal}/{normalExercises.length}
                  </button>
                  <button
                    onClick={() => {
                      setExerciseLevel('beast')
                      setCurrentExercise(0)
                      resetExercise()
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-bold shadow-md transition-colors ${
                      exerciseLevel === 'beast' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    <span className="text-xl">🔥</span>
                    Beast: {correctAnswersBeast}/{beastExercises.length}
                  </button>

                  {showIncrement && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-bold animate-pulse">
                      <span className="text-lg">✅</span>
                      +1 !
                    </div>
                  )}
                  
                  {/* Bouton de réinitialisation des compteurs */}
                  <button
                    onClick={resetCounters}
                    className="px-3 py-2 rounded-lg font-medium transition-colors bg-gray-500 text-white hover:bg-gray-600"
                    title="Réinitialiser les compteurs"
                  >
                    🔄
                  </button>
                </div>
              </div>
            </div>

            {/* Exercices Normaux */}
            {exerciseLevel === 'normal' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                      <span className="text-2xl">📝</span>
                      Mode Normal - Exercice {currentExercise + 1} / {normalExercises.length}
                </h3>
                    {/* Barre de progression Mode Normal */}
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentExercise + 1) / normalExercises.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {Math.round(((currentExercise + 1) / normalExercises.length) * 100)}%
                      </span>
                    </div>
                </div>
              </div>

                <div className="space-y-4">
                  {/* Question Mode Normal avec score intégré */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-blue-800">📝 Développez l'expression :</h4>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        📝 {correctAnswersNormal}/{normalExercises.length}
                      </span>
                    </div>
                    <div className="text-xl font-mono text-blue-900 text-center">
                  {currentEx.question}
                    </div>
                  </div>

                  {/* Éditeur mathématique */}
                  <div className="mb-4 space-y-4">
                    <h4 className="font-semibold text-blue-800 mb-3">📝 Votre réponse :</h4>
                    <MathEditor
                    value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="Développez l'expression... (ex: 3x + 6)"
                      onSubmit={checkAnswer}
                      theme="blue"
                    disabled={showAnswer}
                  />
                    
                    {/* Reconnaissance vocale */}
                    <div className="border-t border-blue-200 pt-3">
                      <VoiceInput
                        onTranscript={(transcript) => setUserAnswer(transcript)}
                        placeholder="Ou dites votre réponse à voix haute (ex: 'trois x plus six')..."
                        className="justify-center"
                      />
                    </div>
                  </div>
                  
                  {/* Feedback de réponse */}
                  {showAnswer && (
                    <div className={`p-4 rounded-lg border transition-all duration-500 ${
                      answerFeedback === 'correct'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {answerFeedback === 'correct' ? '🎉' : '💡'}
                        </span>
                        <p className={`font-semibold ${
                          answerFeedback === 'correct'
                            ? 'text-green-800'
                            : 'text-red-800'
                        }`}>
                          {answerFeedback === 'correct' ? 'Excellent !' : 'Presque !'}
                        </p>
                      </div>
                      <p className="text-gray-700">
                        La bonne réponse est : <span className="font-mono font-bold text-blue-700">{currentEx.steps[currentEx.steps.length - 1].expr}</span>
                      </p>
                      
                      {/* Bouton pour voir la solution détaillée */}
                  <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                        {showSolution ? 'Masquer' : 'Voir'} la solution détaillée
                  </button>
                </div>
                  )}

                  {/* Solution détaillée */}
                  {showSolution && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-4">📚 Solution étape par étape :</h4>
                      
                      <div className="space-y-3">
                        {currentEx.steps.map((step, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg border transition-all duration-500 ${
                              index <= solutionStep ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{ backgroundColor: index === solutionStep ? '#eff6ff' : '#f9fafb' }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">{step.text}</span>
                              <span className={`font-mono text-lg ${step.color}`}>{step.expr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Navigation solution */}
                      <div className="flex justify-center gap-3 mt-4">
                        <button
                          onClick={prevSolutionStep}
                          disabled={solutionStep === 0}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                        >
                          ← Précédent
                        </button>
                        <button
                          onClick={nextSolutionStep}
                          disabled={solutionStep >= currentEx.steps.length - 1}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                          Suivant →
                        </button>
                        <button
                          onClick={resetSolutionStep}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          🔄 Reset
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Navigation exercices */}
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prevExercise}
                      disabled={currentExercise === 0}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={nextExercise}
                      disabled={currentExercise === exercises.length - 1}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Exercices Beast Mode */}
            {exerciseLevel === 'beast' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                      <span className="text-2xl">🔥</span>
                      Beast Mode - Exercice {currentExercise + 1} / {beastExercises.length}
                      <span className="text-2xl">🔥</span>
                    </h3>
                    {/* Barre de progression Beast Mode */}
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentExercise + 1) / beastExercises.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {Math.round(((currentExercise + 1) / beastExercises.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                  <div className="space-y-4">
                  {/* Question Beast Mode avec score intégré */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-red-800">🔥 Défi Beast Mode :</h4>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        🔥 {correctAnswersBeast}/{beastExercises.length}
                      </span>
                    </div>
                    <div className="text-xl font-mono text-red-900 text-center">
                      {currentEx.question}
                    </div>
                  </div>

                  {/* Éditeur mathématique Beast */}
                  <div className="mb-4 space-y-4">
                    <h4 className="font-semibold text-red-800 mb-3">🔥 Votre réponse Beast :</h4>
                    <MathEditor
                      value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="Défi Beast ! Développez cette expression complexe..."
                      onSubmit={checkAnswer}
                      theme="red"
                      disabled={showAnswer}
                    />
                    
                    {/* Reconnaissance vocale Beast */}
                    <div className="border-t border-red-200 pt-3">
                      <VoiceInput
                        onTranscript={(transcript) => setUserAnswer(transcript)}
                        placeholder="Mode Beast : dites votre réponse (ex: 'six x carré plus cinq x moins quatre')..."
                        className="justify-center"
                      />
                    </div>
                  </div>
                  
                  {/* Feedback de réponse Beast */}
                  {showAnswer && (
                    <div className={`p-4 rounded-lg border transition-all duration-500 ${
                      answerFeedback === 'correct'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {answerFeedback === 'correct' ? '🏆' : '💪'}
                        </span>
                      <p className={`font-semibold ${
                          answerFeedback === 'correct'
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                          {answerFeedback === 'correct' ? 'BEAST CHAMPION !' : 'Beast en formation !'}
                        </p>
                      </div>
                      <p className="text-gray-700">
                        La réponse beast : <span className="font-mono font-bold text-red-700">{currentEx.steps[currentEx.steps.length - 1].expr}</span>
                      </p>
                      
                      {/* Bouton pour voir la solution détaillée Beast */}
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        {showSolution ? 'Masquer' : 'Voir'} la solution beast
                      </button>
                    </div>
                  )}

                  {/* Solution détaillée Beast */}
                  {showSolution && (
                    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                      <h4 className="font-bold text-red-800 mb-4">🔥 Solution Beast étape par étape :</h4>
                      
                      <div className="space-y-3">
                        {currentEx.steps.map((step, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg border transition-all duration-500 ${
                              index <= solutionStep ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{ backgroundColor: index === solutionStep ? '#fef2f2' : '#fefefe' }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-red-600">{step.text}</span>
                              <span className={`font-mono text-lg ${step.color}`}>{step.expr}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Navigation solution Beast */}
                      <div className="flex justify-center gap-3 mt-4">
                        <button
                          onClick={prevSolutionStep}
                          disabled={solutionStep === 0}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                        >
                          ← Précédent
                        </button>
                        <button
                          onClick={nextSolutionStep}
                          disabled={solutionStep >= currentEx.steps.length - 1}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          Suivant →
                        </button>
                        <button
                          onClick={resetSolutionStep}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          🔄 Reset
                        </button>
                    </div>
                  </div>
                )}

                  {/* Navigation exercices Beast */}
                  <div className="flex justify-between pt-4">
                    <button
                      onClick={prevExercise}
                      disabled={currentExercise === 0}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={nextExercise}
                      disabled={currentExercise === exercises.length - 1}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      Suivant →
                    </button>
              </div>
                </div>
              </div>
            )}

            {/* Exercices Hardcore */}
            {exerciseLevel === 'hardcore' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                      <span className="text-2xl">💀</span>
                      Mode Hardcore - Exercice {currentExercise + 1} / {hardcoreExercises.length}
                    </h3>
                    {/* Barre de progression Mode Hardcore */}
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentExercise + 1) / hardcoreExercises.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {Math.round(((currentExercise + 1) / hardcoreExercises.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Question Hardcore Mode avec score intégré */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-purple-800">💀 Défi Hardcore - Fractions et LA TOTALE :</h4>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        💀 {correctAnswersHardcore}/{hardcoreExercises.length}
                      </span>
                    </div>
                    <div className="text-xl font-mono text-purple-900 text-center">
                      <MathExpression expression={currentEx.question} />
                    </div>
                  </div>

                  {/* Éditeur mathématique Hardcore */}
                  <div className="mb-4 space-y-4">
                    <h4 className="font-semibold text-purple-800 mb-3">💀 Votre réponse Hardcore :</h4>
                    <MathEditor
                      value={userAnswer}
                      onChange={setUserAnswer}
                      placeholder="HARDCORE ! Fractions, puissances, tout est permis..."
                      onSubmit={checkAnswer}
                      theme="red"
                      disabled={showAnswer}
                    />
                    
                    {/* Reconnaissance vocale Hardcore */}
                    <div className="border-t border-purple-200 pt-3">
                      <VoiceInput
                        onTranscript={(transcript) => setUserAnswer(transcript)}
                        placeholder="Mode Hardcore : dites votre réponse avec fractions (ex: 'un demi x carré plus trois quarts x')..."
                        className="justify-center"
                      />
                    </div>
                  </div>
                  
                  {/* Feedback de réponse Hardcore */}
                  {showAnswer && (
                    <div className={`p-4 rounded-lg border transition-all duration-500 ${
                      answerFeedback === 'correct'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-purple-50 border-purple-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {answerFeedback === 'correct' ? '👑' : '💀'}
                        </span>
                        <p className={`font-semibold ${
                          answerFeedback === 'correct'
                            ? 'text-green-800'
                            : 'text-purple-800'
                        }`}>
                          {answerFeedback === 'correct' ? 'HARDCORE LEGEND !' : 'Hardcore warrior en formation !'}
                        </p>
                      </div>
                      <p className="text-gray-700">
                        La réponse hardcore : <span className="font-mono font-bold text-purple-700">
                          <MathExpression expression={currentEx.steps[currentEx.steps.length - 1].expr} />
                        </span>
                      </p>
                      
                      {/* Bouton pour voir la solution détaillée Hardcore */}
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                      >
                        {showSolution ? 'Masquer' : 'Voir'} la solution hardcore
                      </button>
                    </div>
                  )}

                  {/* Solution détaillée Hardcore */}
                  {showSolution && (
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                      <h4 className="font-bold text-purple-800 mb-4">💀 Solution Hardcore étape par étape :</h4>
                      
                      <div className="space-y-3">
                        {currentEx.steps.map((step, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg border transition-all duration-500 ${
                              index <= solutionStep ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{ backgroundColor: index === solutionStep ? '#faf5ff' : '#fefefe' }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-purple-600">{step.text}</span>
                              <span className={`font-mono text-lg ${step.color}`}>
                                <MathExpression expression={step.expr} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Navigation solution Hardcore */}
                      <div className="flex justify-center gap-3 mt-4">
                        <button
                          onClick={prevSolutionStep}
                          disabled={solutionStep === 0}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                        >
                          ← Précédent
                        </button>
                        <button
                          onClick={nextSolutionStep}
                          disabled={solutionStep >= currentEx.steps.length - 1}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                        >
                          Suivant →
                        </button>
                        <button
                          onClick={resetSolutionStep}
                          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                          🔄 Reset
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Navigation exercices Hardcore */}
                  <div className="flex justify-between pt-4">
                <button
                  onClick={prevExercise}
                  disabled={currentExercise === 0}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                >
                      ← Précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                >
                      Suivant →
                </button>
              </div>
            </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 