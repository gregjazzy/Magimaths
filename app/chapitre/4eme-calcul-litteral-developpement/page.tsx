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
      expression: '(a + 1)(a + 2)',
      steps: [
        { phase: 'initial', content: '(a + 1)(a + 2)', description: 'Deux parenthèses à multiplier' },
        { phase: 'arrow1', content: '(a + 1)(a + 2)', description: 'Première flèche : a × a' },
        { phase: 'arrow2', content: '(a + 1)(a + 2)', description: 'Deuxième flèche : a × 2' },
        { phase: 'arrow3', content: '(a + 1)(a + 2)', description: 'Troisième flèche : 1 × a' },
        { phase: 'arrow4', content: '(a + 1)(a + 2)', description: 'Quatrième flèche : 1 × 2' },
        { phase: 'distribute', content: 'a×a + a×2 + 1×a + 1×2', description: 'Récapitulatif de tous les produits' },
        { phase: 'expand', content: 'a² + 2a + a + 2', description: 'Développement complet' },
        { phase: 'calculate', content: 'a² + 3a + 2', description: 'Réduction finale : regrouper les termes similaires' }
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
      question: "x² - (x - 1)² + 2x",
      steps: [
        { text: "Expression de départ", expr: "x² - (x - 1)² + 2x", color: "text-blue-600" },
        { text: "📚 Développer (x - 1)²", expr: "(x - 1)(x - 1) = x² - 2x + 1", color: "text-green-600" },
        { text: "Substitution", expr: "x² - (x² - 2x + 1) + 2x", color: "text-orange-600" },
        { text: "Calcul", expr: "x² - x² + 2x - 1 + 2x", color: "text-red-600" },
        { text: "Résultat", expr: "4x - 1", color: "text-purple-600" }
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
        { text: "Calcul des puissances", expr: "-35x⁵y⁶ + 56x⁷y²z²", color: "text-red-600" },
        { text: "Résultat explosif", expr: "56x⁷y²z² - 35x⁵y⁶", color: "text-purple-600" }
      ]
    },
    {
      id: 2,
      question: "(6x⁴ - 9y³)(11x² - 4xy²)",
      steps: [
        { text: "Expression de départ", expr: "(6x⁴ - 9y³)(11x² - 4xy²)", color: "text-blue-600" },
        { text: "🔥 Quatre produits beast !", expr: "6x⁴×11x² + 6x⁴×(-4xy²) + (-9y³)×11x² + (-9y³)×(-4xy²)", color: "text-orange-600" },
        { text: "Calcul beast", expr: "66x⁶ - 24x⁵y² - 99x²y³ + 36xy⁵", color: "text-red-600" },
        { text: "Résultat beast", expr: "66x⁶ - 24x⁵y² - 99x²y³ + 36xy⁵", color: "text-purple-600" }
      ]
    },
    {
      id: 3,
      question: "(-4x⁵ - 7y³z²)(-12x³y² - 5x²y)",
      steps: [
        { text: "Expression de départ", expr: "(-4x⁵ - 7y³z²)(-12x³y² - 5x²y)", color: "text-blue-600" },
        { text: "🔥 BEAST MOINS × MOINS !", expr: "Triple variables avec signes négatifs", color: "text-orange-600" },
        { text: "MOINS × MOINS = PLUS !", expr: "+48x⁸y² + 20x⁷y + 84x³y⁵z² + 35x²y⁴z²", color: "text-red-600" },
        { text: "Résultat beast", expr: "48x⁸y² + 20x⁷y + 84x³y⁵z² + 35x²y⁴z²", color: "text-purple-600" }
      ]
    },
    {
      id: 4,
      question: "(8a⁴b² - 15c³)(9a³b⁴ - 13b²)",
      steps: [
        { text: "Expression de départ", expr: "(8a⁴b² - 15c³)(9a³b⁴ - 13b²)", color: "text-blue-600" },
        { text: "🔥 BEAST ! Trois variables avec puissances élevées", expr: "Beast calculation", color: "text-orange-600" },
        { text: "Résultat beast", expr: "72a⁷b⁶ - 104a⁴b⁴ - 135a³b⁴c³ + 195b²c³", color: "text-purple-600" }
      ]
    },
    {
      id: 5,
      question: "(-14x³y⁴)(6x⁵ - 17x²y³)",
      steps: [
        { text: "Expression de départ", expr: "(-14x³y⁴)(6x⁵ - 17x²y³)", color: "text-blue-600" },
        { text: "🔥 Deux termes avec puissances élevées", expr: "(-14x³y⁴)×6x⁵ + (-14x³y⁴)×(-17x²y³)", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-84x⁸y⁴ + 238x⁵y⁷", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 6 : ESCALADE BRUTALE
    {
      id: 6,
      question: "(12x⁶ - 19x³y⁴)(7x³ - 16y⁵)",
      steps: [
        { text: "Expression de départ", expr: "(12x⁶ - 19x³y⁴)(7x³ - 16y⁵)", color: "text-blue-600" },
        { text: "🔥 BEAST ! 4 produits puissants", expr: "Développement beast", color: "text-orange-600" },
        { text: "Résultat beast", expr: "84x⁹ - 192x⁶y⁵ - 133x⁶y⁴ + 304x³y⁹", color: "text-purple-600" }
      ]
    },
    {
      id: 7,
      question: "(-18a⁴b⁵ + 23a²bc³)(11a⁵ - 25b⁴)",
      steps: [
        { text: "Expression de départ", expr: "(-18a⁴b⁵ + 23a²bc³)(11a⁵ - 25b⁴)", color: "text-blue-600" },
        { text: "🔥 Triple variables beast", expr: "Beast calculation", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-198a⁹b⁵ + 450a⁴b⁹ + 253a⁷bc³ - 575a²b⁵c³", color: "text-purple-600" }
      ]
    },
    {
      id: 8,
      question: "(21x⁵ + 13x²y⁴)(16x⁴ - 29xy³)",
      steps: [
        { text: "Expression de départ", expr: "(21x⁵ + 13x²y⁴)(16x⁴ - 29xy³)", color: "text-blue-600" },
        { text: "🔥 Puissances jusqu'à 9 !", expr: "x⁹ dans le résultat", color: "text-orange-600" },
        { text: "Résultat beast", expr: "336x⁹ - 609x⁶y³ + 208x⁶y⁴ - 377x³y⁷", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 9 : PUISSANCES DÉCHAINÉES
    {
      id: 9,
      question: "(17x⁷ - 22x⁴y⁵)(9x³ + 31x²y²)",
      steps: [
        { text: "Expression de départ", expr: "(17x⁷ - 22x⁴y⁵)(9x³ + 31x²y²)", color: "text-blue-600" },
        { text: "🔥 BEAST ! Puissances jusqu'à 10", expr: "x¹⁰ beast", color: "text-orange-600" },
        { text: "Résultat beast", expr: "153x¹⁰ + 527x⁹y² - 198x⁷y⁵ - 682x⁶y⁷", color: "text-purple-600" }
      ]
    },
    {
      id: 10,
      question: "(-26x⁸ + 35x⁵y³)(14x⁴ - 47y⁶)",
      steps: [
        { text: "Expression de départ", expr: "(-26x⁸ + 35x⁵y³)(14x⁴ - 47y⁶)", color: "text-blue-600" },
        { text: "🔥 Puissance 12 maximale !", expr: "x¹² beast mode", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-364x¹² + 1222x⁸y⁶ + 490x⁹y³ - 1645x⁵y⁹", color: "text-red-600" },
        { text: "Simplifié", expr: "-364x¹² + 490x⁹y³ + 1222x⁸y⁶ - 1645x⁵y⁹", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 11-12 : QUATRE VARIABLES !
    {
      id: 11,
      question: "(28x³y² - 41z⁴w³)(15xy⁴ - 33xz²)",
      steps: [
        { text: "Expression de départ", expr: "(28x³y² - 41z⁴w³)(15xy⁴ - 33xz²)", color: "text-blue-600" },
        { text: "🔥 QUATRE VARIABLES BEAST !", expr: "x, y, z, w ensemble", color: "text-orange-600" },
        { text: "Résultat beast", expr: "420x⁴y⁶ - 924x⁴y²z² - 615x²y⁴z⁴w³ + 1353x²z⁶w³", color: "text-purple-600" }
      ]
    },
    {
      id: 12,
      question: "(-39a⁶b²c⁴ + 52a³b⁷d²)(18a⁴b³ - 27c²d⁵)",
      steps: [
        { text: "Expression de départ", expr: "(-39a⁶b²c⁴ + 52a³b⁷d²)(18a⁴b³ - 27c²d⁵)", color: "text-blue-600" },
        { text: "🔥 Quatre variables avec signes beast", expr: "a, b, c, d beast", color: "text-orange-600" },
        { text: "Résultat beast", expr: "-702a¹⁰b⁵c⁴ + 1053a⁶b²c⁶d⁵ + 936a⁷b¹⁰d² - 1404a³b⁷c²d⁷", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 13-22 : SOMMES DE DOUBLE DISTRIBUTIVITÉ !
    {
      id: 13,
      question: "(7x² + 15)(9x - 23) + (11x - 19)(4x² + 31)",
      steps: [
        { text: "Expression de départ", expr: "(7x² + 15)(9x - 23) + (11x - 19)(4x² + 31)", color: "text-blue-600" },
        { text: "🔥 SOMME DE DOUBLE DISTRIBUTIVITÉ !", expr: "Deux doubles développements", color: "text-orange-600" },
        { text: "Premier développement", expr: "63x³ - 161x² + 135x - 345", color: "text-green-600" },
        { text: "Second développement", expr: "44x³ + 341x - 76x² - 589", color: "text-orange-600" },
        { text: "Somme finale", expr: "63x³ - 161x² + 135x - 345 + 44x³ - 76x² + 341x - 589", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "107x³ - 237x² + 476x - 934", color: "text-purple-600" }
      ]
    },
    {
      id: 14,
      question: "(18x³ - 37)(12x + 29) + (25x² - 41)(16x - 53)",
      steps: [
        { text: "Expression de départ", expr: "(18x³ - 37)(12x + 29) + (25x² - 41)(16x - 53)", color: "text-blue-600" },
        { text: "🔥 DOUBLE SOMME BEAST !", expr: "Calcul des deux produits", color: "text-orange-600" },
        { text: "Premier", expr: "216x⁴ + 522x³ - 444x - 1073", color: "text-green-600" },
        { text: "Second", expr: "400x³ - 1325x² - 656x + 2173", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "216x⁴ + 922x³ - 1325x² - 1100x + 1100", color: "text-purple-600" }
      ]
    },
    {
      id: 15,
      question: "(14x⁴ - 28)(17x² + 39) + (22x³ - 61)(13x⁵ + 47)",
      steps: [
        { text: "Expression de départ", expr: "(14x⁴ - 28)(17x² + 39) + (22x³ - 61)(13x⁵ + 47)", color: "text-blue-600" },
        { text: "🔥 PUISSANCES DANS LA SOMME !", expr: "Degré 8 beast", color: "text-orange-600" },
        { text: "Premier", expr: "238x⁶ + 546x⁴ - 476x² - 1092", color: "text-green-600" },
        { text: "Second", expr: "286x⁸ + 1034x³ - 793x⁵ - 2867", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "286x⁸ + 238x⁶ - 793x⁵ + 546x⁴ + 1034x³ - 476x² - 3959", color: "text-purple-600" }
      ]
    },
    {
      id: 16,
      question: "(43x³ - 67y⁴)(29x² + 71y) + (-58x⁴ + 83y²)(19x - 97y³)",
      steps: [
        { text: "Expression de départ", expr: "(43x³ - 67y⁴)(29x² + 71y) + (-58x⁴ + 83y²)(19x - 97y³)", color: "text-blue-600" },
        { text: "🔥 DEUX VARIABLES BEAST SOMME !", expr: "x et y dans les deux", color: "text-orange-600" },
        { text: "Premier", expr: "1247x⁵ + 3053x³y - 1943x²y⁴ - 4757y⁵", color: "text-green-600" },
        { text: "Second", expr: "-1102x⁵ + 5626x⁴y³ + 1577x²y² - 8051y⁵", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "145x⁵ + 5626x⁴y³ + 3053x³y - 366x²y⁴ + 1577x²y² - 12808y⁵", color: "text-purple-600" }
      ]
    },
    {
      id: 17,
      question: "(73a⁴ + 89b³)(41a² - 127b⁵) + (106a³ + 154b²)(62a⁴ - 179b⁶)",
      steps: [
        { text: "Expression de départ", expr: "(73a⁴ + 89b³)(41a² - 127b⁵) + (106a³ + 154b²)(62a⁴ - 179b⁶)", color: "text-blue-600" },
        { text: "🔥 VARIABLES a,b BEAST SOMME !", expr: "Double distributivité complexe", color: "text-orange-600" },
        { text: "Premier", expr: "2993a⁶ - 9271a⁴b⁵ + 3649a²b³ - 11303b⁸", color: "text-green-600" },
        { text: "Second", expr: "6572a⁷ - 18974a³b⁶ + 9548a⁴b² - 27566b⁸", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "6572a⁷ + 2993a⁶ + 9548a⁴b² - 9271a⁴b⁵ + 3649a²b³ - 18974a³b⁶ - 38869b⁸", color: "text-purple-600" }
      ]
    },
    {
      id: 18,
      question: "(91x⁶ + 137x³)(83x⁴ - 211) + (168x⁵ - 229)(94x⁷ - 317x²)",
      steps: [
        { text: "Expression de départ", expr: "(91x⁶ + 137x³)(83x⁴ - 211) + (168x⁵ - 229)(94x⁷ - 317x²)", color: "text-blue-600" },
        { text: "🔥 DEGRÉ 12 BEAST SOMME !", expr: "x¹² partout", color: "text-orange-600" },
        { text: "Premier", expr: "7553x¹⁰ - 19201x⁶ + 11371x⁷ - 28907x³", color: "text-green-600" },
        { text: "Second", expr: "15792x¹² - 53256x⁷ - 21526x⁷ + 72593x²", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "15792x¹² + 7553x¹⁰ - 63411x⁷ - 19201x⁶ - 28907x³ + 72593x²", color: "text-purple-600" }
      ]
    },
    {
      id: 19,
      question: "(247x⁴ - 359y⁶)(182x³ + 431y²) + (503x⁷ + 617y⁴)(274x - 389y³)",
      steps: [
        { text: "Expression de départ", expr: "(247x⁴ - 359y⁶)(182x³ + 431y²) + (503x⁷ + 617y⁴)(274x - 389y³)", color: "text-blue-600" },
        { text: "🔥 VARIABLES CROISÉES BEAST !", expr: "Somme complexe", color: "text-orange-600" },
        { text: "Premier", expr: "44954x⁷ + 106457x⁴y² - 65338x³y⁶ - 154729y⁸", color: "text-green-600" },
        { text: "Second", expr: "137822x⁸ - 195617x⁷y³ + 169058x⁴y - 240013y⁷", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "137822x⁸ + 44954x⁷ - 195617x⁷y³ + 169058x⁴y + 106457x⁴y² - 65338x³y⁶ - 240013y⁷ - 154729y⁸", color: "text-purple-600" }
      ]
    },
    {
      id: 20,
      question: "(683x⁸ - 791)(422x³ + 857) + (934x⁵ + 1246)(519x⁶ - 1382)",
      steps: [
        { text: "Expression de départ", expr: "(683x⁸ - 791)(422x³ + 857) + (934x⁵ + 1246)(519x⁶ - 1382)", color: "text-blue-600" },
        { text: "🔥 COEFFICIENTS ÉLEVÉS BEAST !", expr: "Gros coefficients", color: "text-orange-600" },
        { text: "Premier", expr: "288226x¹¹ + 585331x⁸ - 333802x³ - 678087", color: "text-green-600" },
        { text: "Second", expr: "484746x¹¹ - 1290788x⁵ + 646674x⁶ - 1721972", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "772972x¹¹ + 585331x⁸ + 646674x⁶ - 1290788x⁵ - 333802x³ - 2400059", color: "text-purple-600" }
      ]
    },
    {
      id: 21,
      question: "(1547x⁹ - 1823x⁴)(1094x⁵ + 1376x²) + (2156x⁷ - 2489)(1738x⁶ + 2017x³)",
      steps: [
        { text: "Expression de départ", expr: "(1547x⁹ - 1823x⁴)(1094x⁵ + 1376x²) + (2156x⁷ - 2489)(1738x⁶ + 2017x³)", color: "text-blue-600" },
        { text: "🔥 DEGRÉ 14 COMPLEXE BEAST !", expr: "x¹⁴ avec coefficients", color: "text-orange-600" },
        { text: "Premier", expr: "1692418x¹⁴ + 2128672x¹¹ - 1993162x⁹ - 2507848x⁶", color: "text-green-600" },
        { text: "Second", expr: "3747128x¹³ + 4346652x¹⁰ - 4324582x⁶ - 5021813x³", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "1692418x¹⁴ + 3747128x¹³ + 2128672x¹¹ + 4346652x¹⁰ - 1993162x⁹ - 6832430x⁶ - 5021813x³", color: "text-purple-600" }
      ]
    },
    {
      id: 22,
      question: "(2847a⁶ - 3196b⁸)(1573a³ + 2439b⁴) + (4126a⁵ + 4823b⁷)(2681a⁴ - 3417b²)",
      steps: [
        { text: "Expression de départ", expr: "(2847a⁶ - 3196b⁸)(1573a³ + 2439b⁴) + (4126a⁵ + 4823b⁷)(2681a⁴ - 3417b²)", color: "text-blue-600" },
        { text: "🔥 VARIABLES a,b ULTIMATE !", expr: "Coefficients maximums", color: "text-orange-600" },
        { text: "Premier", expr: "4479531a⁹ + 6946683a⁶b⁴ - 5028268a³b⁸ - 7795044b¹²", color: "text-green-600" },
        { text: "Second", expr: "11061706a⁹ - 14101442a⁵b² + 12933763a⁴b⁷ - 16481091b⁹", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "15541237a⁹ + 6946683a⁶b⁴ - 14101442a⁵b² + 12933763a⁴b⁷ - 5028268a³b⁸ - 16481091b⁹ - 7795044b¹²", color: "text-purple-600" }
      ]
    },
    
    // Beast Niveau 23-24 : INTRODUCTION AUX PRIORITÉS OPÉRATOIRES !
    {
      id: 23,
      question: "3x² + (2x - 1)(4x + 5) - x(x - 3) × 2",
      steps: [
        { text: "Expression de départ", expr: "3x² + (2x - 1)(4x + 5) - x(x - 3) × 2", color: "text-blue-600" },
        { text: "🔥 PRIORITÉS OPÉRATOIRES BEAST !", expr: "D'abord les parenthèses, puis la multiplication", color: "text-orange-600" },
        { text: "Développement (2x - 1)(4x + 5)", expr: "8x² + 10x - 4x - 5 = 8x² + 6x - 5", color: "text-green-600" },
        { text: "Développement x(x - 3) × 2", expr: "2x(x - 3) = 2x² - 6x", color: "text-orange-600" },
        { text: "Substitution", expr: "3x² + (8x² + 6x - 5) - (2x² - 6x)", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "9x² + 12x - 5", color: "text-purple-600" }
      ]
    },
    {
      id: 24,
      question: "5x³ - 2x(3x² - 4x + 1) + (x + 2)(x² - 3) × 3",
      steps: [
        { text: "Expression de départ", expr: "5x³ - 2x(3x² - 4x + 1) + (x + 2)(x² - 3) × 3", color: "text-blue-600" },
        { text: "🔥 PRIORITÉS COMPLEXES BEAST !", expr: "Multiple distributivités avec priorités", color: "text-orange-600" },
        { text: "Développement 2x(3x² - 4x + 1)", expr: "6x³ - 8x² + 2x", color: "text-green-600" },
        { text: "Développement (x + 2)(x² - 3) × 3", expr: "3(x³ - 3x + 2x² - 6) = 3x³ + 6x² - 9x - 18", color: "text-orange-600" },
        { text: "Substitution", expr: "5x³ - (6x³ - 8x² + 2x) + (3x³ + 6x² - 9x - 18)", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "2x³ + 14x² - 11x - 18", color: "text-purple-600" }
      ]
    },

    // Beast Niveau 25-30 : PRIORITÉS OPÉRATOIRES ESCALADANTES !
    {
      id: 25,
      question: "x² + 3x(2x - 1)² - (x + 1)(x - 2)(x + 3)",
      steps: [
        { text: "Expression de départ", expr: "x² + 3x(2x - 1)² - (x + 1)(x - 2)(x + 3)", color: "text-blue-600" },
        { text: "🔥 CARRÉ + TRIPLE PRODUIT BEAST !", expr: "Priorités avec carré et triple multiplication", color: "text-orange-600" },
        { text: "Développement (2x - 1)²", expr: "4x² - 4x + 1", color: "text-green-600" },
        { text: "Développement 3x(2x - 1)²", expr: "3x(4x² - 4x + 1) = 12x³ - 12x² + 3x", color: "text-orange-600" },
        { text: "Triple produit", expr: "(x + 1)(x - 2)(x + 3) = (x² - x - 2)(x + 3) = x³ + 2x² - 5x - 6", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "x² + 12x³ - 12x² + 3x - x³ - 2x² + 5x + 6 = 11x³ - 13x² + 8x + 6", color: "text-purple-600" }
      ]
    },
    {
      id: 26,
      question: "2x⁴ - x²(3x + 2)² + 4x(x - 1)(2x + 3) - (x² + 1)²",
      steps: [
        { text: "Expression de départ", expr: "2x⁴ - x²(3x + 2)² + 4x(x - 1)(2x + 3) - (x² + 1)²", color: "text-blue-600" },
        { text: "🔥 PRIORITÉS MULTIPLES BEAST !", expr: "Carrés, doubles produits, tout ensemble", color: "text-orange-600" },
        { text: "Développement (3x + 2)²", expr: "9x² + 12x + 4", color: "text-green-600" },
        { text: "Calcul x²(3x + 2)²", expr: "x²(9x² + 12x + 4) = 9x⁴ + 12x³ + 4x²", color: "text-orange-600" },
        { text: "Double produit (x - 1)(2x + 3)", expr: "2x² + 3x - 2x - 3 = 2x² + x - 3", color: "text-green-600" },
        { text: "Calcul 4x(x - 1)(2x + 3)", expr: "4x(2x² + x - 3) = 8x³ + 4x² - 12x", color: "text-orange-600" },
        { text: "Carré (x² + 1)²", expr: "x⁴ + 2x² + 1", color: "text-red-600" },
        { text: "🔥 RÉSULTAT BEAST", expr: "2x⁴ - 9x⁴ - 12x³ - 4x² + 8x³ + 4x² - 12x - x⁴ - 2x² - 1 = -8x⁴ - 4x³ - 2x² - 12x - 1", color: "text-purple-600" }
      ]
    },
    {
      id: 27,
      question: "3x(x + 1)³ - 2(x - 2)²(x + 3) + x²(2x - 1)(x + 4)",
      steps: [
        { text: "Expression de départ", expr: "3x(x + 1)³ - 2(x - 2)²(x + 3) + x²(2x - 1)(x + 4)", color: "text-blue-600" },
        { text: "🔥 CUBE + CARRÉS MULTIPLES BEAST !", expr: "Cube, carré × binôme, triple produit", color: "text-orange-600" },
        { text: "Résultat ultra-complexe", expr: "Expression beast avec puissances jusqu'à 6", color: "text-purple-600" }
      ]
    },
    {
      id: 28,
      question: "x⁵ - 3x²(2x - 1)³ + 2(x + 1)²(x - 3)² - x(x² + 2)²",
      steps: [
        { text: "Expression de départ", expr: "x⁵ - 3x²(2x - 1)³ + 2(x + 1)²(x - 3)² - x(x² + 2)²", color: "text-blue-600" },
        { text: "🔥 CUBES ET CARRÉS MULTIPLES !", expr: "Cube multiplié par x², double carré, carré de trinôme", color: "text-orange-600" },
        { text: "🔥 RÉSULTAT APOCALYPTIQUE", expr: "Expression géante avec puissances jusqu'à 8", color: "text-purple-600" }
      ]
    },
    {
      id: 29,
      question: "4x²(x - 1)⁴ - (2x + 1)³(x - 2) + 3x(x + 3)²(x - 4)²",
      steps: [
        { text: "Expression de départ", expr: "4x²(x - 1)⁴ - (2x + 1)³(x - 2) + 3x(x + 3)²(x - 4)²", color: "text-blue-600" },
        { text: "🔥 PUISSANCE 4 + CUBES MULTIPLES !", expr: "Puissance 4, cube × binôme, triple carré", color: "text-orange-600" },
        { text: "🔥 BEAST ULTIME", expr: "Expression titanesque avec puissances jusqu'à 9", color: "text-purple-600" }
      ]
    },
    {
      id: 30,
      question: "x³(2x + 3)⁴ - 2x²(x - 1)³(x + 2) + (3x - 2)²(x + 1)³",
      steps: [
        { text: "Expression de départ", expr: "x³(2x + 3)⁴ - 2x²(x - 1)³(x + 2) + (3x - 2)²(x + 1)³", color: "text-blue-600" },
        { text: "🔥 PUISSANCE 4 MULTIPLICATIVE !", expr: "x³ × puissance 4, triple produits, carré × cube", color: "text-orange-600" },
        { text: "🔥 CHAMPION PRIORITÉS", expr: "Expression colossale avec puissances jusqu'à 10", color: "text-purple-600" }
      ]
    },

    // Beast Niveau 31-35 : APOCALYPSE PRIORITÉS OPÉRATOIRES !
    {
      id: 31,
      question: "5x⁴(x - 2)⁵ - 3x²(2x + 1)⁴(x - 3) + x(x + 1)³(x - 1)³",
      steps: [
        { text: "Expression de départ", expr: "5x⁴(x - 2)⁵ - 3x²(2x + 1)⁴(x - 3) + x(x + 1)³(x - 1)³", color: "text-blue-600" },
        { text: "💀 PUISSANCE 5 APOCALYPTIQUE !", expr: "x⁴ × puissance 5, quadruple produits", color: "text-orange-600" },
        { text: "💀 APOCALYPSE BEAST", expr: "Expression démoniaque avec puissances jusqu'à 11", color: "text-purple-600" }
      ]
    },
    {
      id: 32,
      question: "x⁶ - 2x³(3x - 1)⁵ + 4x²(x + 2)³(2x - 3)² - (x² + x + 1)³",
      steps: [
        { text: "Expression de départ", expr: "x⁶ - 2x³(3x - 1)⁵ + 4x²(x + 2)³(2x - 3)² - (x² + x + 1)³", color: "text-blue-600" },
        { text: "💀 PUISSANCE 5 + CUBE DE TRINÔME !", expr: "x³ × puissance 5, quintuple produits, cube trinôme", color: "text-orange-600" },
        { text: "💀 SUPRÊME BEAST", expr: "Expression infernale avec puissances jusqu'à 12", color: "text-purple-600" }
      ]
    },
    {
      id: 33,
      question: "3x⁵(2x - 3)⁶ - x⁴(x + 1)⁴(x - 2)² + 2x²(3x + 2)³(x - 1)³",
      steps: [
        { text: "Expression de départ", expr: "3x⁵(2x - 3)⁶ - x⁴(x + 1)⁴(x - 2)² + 2x²(3x + 2)³(x - 1)³", color: "text-blue-600" },
        { text: "💀 PUISSANCE 6 DÉMONIAQUE !", expr: "x⁵ × puissance 6, sextuple produits", color: "text-orange-600" },
        { text: "💀 LÉGENDE BEAST", expr: "Expression légendaire avec puissances jusqu'à 13", color: "text-purple-600" }
      ]
    },
    {
      id: 34,
      question: "x⁷ - 4x⁴(2x + 1)⁷ + 3x³(x - 1)⁵(x + 2)² - 2x²(3x + 1)⁴(x - 3)³",
      steps: [
        { text: "Expression de départ", expr: "x⁷ - 4x⁴(2x + 1)⁷ + 3x³(x - 1)⁵(x + 2)² - 2x²(3x + 1)⁴(x - 3)³", color: "text-blue-600" },
        { text: "💀 PUISSANCE 7 ULTIME !", expr: "x⁴ × puissance 7, septuple produits", color: "text-orange-600" },
        { text: "💀 MAÎTRE BEAST", expr: "Expression mythique avec puissances jusqu'à 14", color: "text-purple-600" }
      ]
    },
    {
      id: 35,
      question: "2x⁸ - x⁶(3x - 2)⁸ + 5x⁴(x + 1)⁶(2x - 1)³ - 3x²(x² + x + 1)⁴(x - 2)² + x(4x + 3)⁵(x - 3)⁴",
      steps: [
        { text: "Expression de départ", expr: "2x⁸ - x⁶(3x - 2)⁸ + 5x⁴(x + 1)⁶(2x - 1)³ - 3x²(x² + x + 1)⁴(x - 2)² + x(4x + 3)⁵(x - 3)⁴", color: "text-blue-600" },
        { text: "💀 PUISSANCE 8 APOCALYPSE FINALE !", expr: "x⁶ × puissance 8, quintuple termes", color: "text-orange-600" },
        { text: "💀 EMPEREUR BEAST SUPRÊME !", expr: "5 termes géants avec priorités démentielles", color: "text-red-600" },
        { text: "💀 CHAMPION PRIORITÉS ULTIME", expr: "Expression divine avec puissances jusqu'à 15", color: "text-purple-600" }
      ]
    }
  ]

  // EXERCICES MODE HARDCORE - FRACTIONS ET LA TOTALE ! 💀
  const hardcoreExercises = [
    // Hardcore Niveau 1-5 : FRACTIONS SIMPLES
    {
      id: 1,
      question: "(2/3)x³((9/4)x² - (5/6)x)",
      steps: [
        { text: "Expression de départ", expr: "(2/3)x³((9/4)x² - (5/6)x)", color: "text-blue-600" },
        { text: "💀 HARDCORE ! Distribution fractionnaire", expr: "(2/3)x³ × (9/4)x² + (2/3)x³ × (-(5/6)x)", color: "text-orange-600" },
        { text: "Premier produit", expr: "(2/3) × (9/4) × x⁵ = (18/12)x⁵ = (3/2)x⁵", color: "text-green-600" },
        { text: "Second produit", expr: "(2/3) × (-(5/6)) × x⁴ = -(10/18)x⁴ = -(5/9)x⁴", color: "text-red-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "(3/2)x⁵ - (5/9)x⁴", color: "text-purple-600" }
      ]
    },
    {
      id: 2,
      question: "((5/7)x⁴y² - (3/8)y⁵)((11/4)x³ - (17/9)y²)",
      steps: [
        { text: "Expression de départ", expr: "((5/7)x⁴y² - (3/8)y⁵)((11/4)x³ - (17/9)y²)", color: "text-blue-600" },
        { text: "💀 QUATRE PRODUITS FRACTIONNAIRES !", expr: "Tous les produits : 4 termes à calculer", color: "text-orange-600" },
        { text: "Premier produit", expr: "(5/7) × (11/4) × x⁷y² = (55/28)x⁷y²", color: "text-green-600" },
        { text: "Deuxième produit", expr: "(5/7) × (-(17/9)) × x⁴y⁴ = -(85/63)x⁴y⁴", color: "text-orange-600" },
        { text: "Troisième produit", expr: "(-(3/8)) × (11/4) × x³y⁵ = -(33/32)x³y⁵", color: "text-red-600" },
        { text: "Quatrième produit", expr: "(-(3/8)) × (-(17/9)) × y⁷ = (51/72)y⁷", color: "text-blue-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "(55/28)x⁷y² - (85/63)x⁴y⁴ - (33/32)x³y⁵ + (51/72)y⁷", color: "text-purple-600" }
      ]
    },
    {
      id: 3,
      question: "((-7/12)a⁵b³ + (11/15)c⁴)((9/8)a²b - (13/20)c²)",
      steps: [
        { text: "Expression de départ", expr: "((-7/12)a⁵b³ + (11/15)c⁴)((9/8)a²b - (13/20)c²)", color: "text-blue-600" },
        { text: "💀 HARDCORE MOINS × MOINS !", expr: "4 produits avec fractions négatives", color: "text-orange-600" },
        { text: "Premier produit", expr: "((-7/12)) × (9/8) × a⁷b⁴ = -(63/96)a⁷b⁴ = -(21/32)a⁷b⁴", color: "text-green-600" },
        { text: "Deuxième produit", expr: "((-7/12)) × (-(13/20)) × a⁵b³c² = (91/240)a⁵b³c²", color: "text-orange-600" },
        { text: "Troisième produit", expr: "(11/15) × (9/8) × a²bc⁴ = (99/120)a²bc⁴ = (33/40)a²bc⁴", color: "text-red-600" },
        { text: "Quatrième produit", expr: "(11/15) × (-(13/20)) × c⁶ = -(143/300)c⁶", color: "text-blue-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "-(21/32)a⁷b⁴ + (91/240)a⁵b³c² + (33/40)a²bc⁴ - (143/300)c⁶", color: "text-purple-600" }
      ]
    },
    {
      id: 4,
      question: "((23/19)x⁶y - (47/31)z³)((29/17)x²y⁴ + (53/37)xz)",
      steps: [
        { text: "Expression de départ", expr: "((23/19)x⁶y - (47/31)z³)((29/17)x²y⁴ + (53/37)xz)", color: "text-blue-600" },
        { text: "💀 FRACTIONS PREMIÈRES HARDCORE !", expr: "Dénominateurs premiers - 4 produits", color: "text-orange-600" },
        { text: "Premier produit", expr: "(23/19) × (29/17) × x⁸y⁵ = (667/323)x⁸y⁵", color: "text-green-600" },
        { text: "Deuxième produit", expr: "(23/19) × (53/37) × x⁷yz = (1219/703)x⁷yz", color: "text-orange-600" },
        { text: "Troisième produit", expr: "(-(47/31)) × (29/17) × x²y⁴z³ = -(1363/527)x²y⁴z³", color: "text-red-600" },
        { text: "Quatrième produit", expr: "(-(47/31)) × (53/37) × xz⁴ = -(2491/1147)xz⁴", color: "text-blue-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "(667/323)x⁸y⁵ + (1219/703)x⁷yz - (1363/527)x²y⁴z³ - (2491/1147)xz⁴", color: "text-purple-600" }
      ]
    },
    {
      id: 5,
      question: "((-89/73)x⁹ + (127/103)y⁷)((-157/139)x⁴ + (179/167)y²)",
      steps: [
        { text: "Expression de départ", expr: "((-89/73)x⁹ + (127/103)y⁷)((-157/139)x⁴ + (179/167)y²)", color: "text-blue-600" },
        { text: "💀 PUISSANCES ET FRACTIONS GÉANTES !", expr: "x¹³ hardcore avec nombres premiers", color: "text-orange-600" },
        { text: "Premier produit", expr: "((-89/73)) × ((-157/139)) × x¹³ = (13973/10147)x¹³", color: "text-green-600" },
        { text: "Deuxième produit", expr: "((-89/73)) × (179/167) × x⁹y² = -(15931/12199)x⁹y²", color: "text-orange-600" },
        { text: "Troisième produit", expr: "(127/103) × ((-157/139)) × x⁴y⁷ = -(19939/14317)x⁴y⁷", color: "text-red-600" },
        { text: "Quatrième produit", expr: "(127/103) × (179/167) × y⁹ = (22733/17201)y⁹", color: "text-blue-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "(13973/10147)x¹³ - (15931/12199)x⁹y² - (19939/14317)x⁴y⁷ + (22733/17201)y⁹", color: "text-purple-600" }
      ]
    },

    // Hardcore Niveau 6-10 : DISTRIBUTIVITÉS FRACTIONNAIRES COMPLEXES
    {
      id: 6,
      question: "((3/4)x⁵ - (5/6)x²y + (7/8)y³)((2/3)x² + (4/5)y)",
      steps: [
        { text: "Expression de départ", expr: "((3/4)x⁵ - (5/6)x²y + (7/8)y³)((2/3)x² + (4/5)y)", color: "text-blue-600" },
        { text: "💀 TRINÔME × BINÔME FRACTIONNAIRE !", expr: "6 produits fractionnaires à calculer", color: "text-orange-600" },
        { text: "Produit 1", expr: "(3/4) × (2/3) × x⁷ = (6/12)x⁷ = (1/2)x⁷", color: "text-green-600" },
        { text: "Produit 2", expr: "(3/4) × (4/5) × x⁵y = (12/20)x⁵y = (3/5)x⁵y", color: "text-orange-600" },
        { text: "Produit 3", expr: "(-(5/6)) × (2/3) × x⁴y = -(10/18)x⁴y = -(5/9)x⁴y", color: "text-red-600" },
        { text: "Produit 4", expr: "(-(5/6)) × (4/5) × x²y² = -(20/30)x²y² = -(2/3)x²y²", color: "text-blue-600" },
        { text: "Produit 5", expr: "(7/8) × (2/3) × x²y³ = (14/24)x²y³ = (7/12)x²y³", color: "text-green-600" },
        { text: "Produit 6", expr: "(7/8) × (4/5) × y⁴ = (28/40)y⁴ = (7/10)y⁴", color: "text-orange-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "(1/2)x⁷ + (3/5)x⁵y - (5/9)x⁴y - (2/3)x²y² + (7/12)x²y³ + (7/10)y⁴", color: "text-purple-600" }
      ]
    },
    {
      id: 7,
      question: "((11/13)a⁷b² - (17/19)ab⁶ + (23/29)c⁴)((31/37)a³ - (41/43)b² + (47/53)c)",
      steps: [
        { text: "Expression de départ", expr: "((11/13)a⁷b² - (17/19)ab⁶ + (23/29)c⁴)((31/37)a³ - (41/43)b² + (47/53)c)", color: "text-blue-600" },
        { text: "💀 TRINÔME × TRINÔME HARDCORE !", expr: "9 produits fractionnaires avec nombres premiers", color: "text-orange-600" },
        { text: "Premier terme", expr: "(11/13) × (31/37) × a¹⁰b² = (341/481)a¹⁰b²", color: "text-green-600" },
        { text: "Deuxième terme", expr: "(11/13) × (-(41/43)) × a⁷b⁴ = -(451/559)a⁷b⁴", color: "text-orange-600" },
        { text: "Troisième terme", expr: "(11/13) × (47/53) × a⁷b²c = (517/689)a⁷b²c", color: "text-red-600" },
        { text: "Et 6 autres termes...", expr: "Expression géante avec fractions premiers", color: "text-blue-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "9 termes fractionnaires complexes avec a, b, c", color: "text-purple-600" }
      ]
    },
    {
      id: 8,
      question: "((-97/101)x¹⁰ + (109/113)x⁶y⁴ - (127/131)y⁸)((139/137)x³ - (149/151)y²)",
      steps: [
        { text: "Expression de départ", expr: "((-97/101)x¹⁰ + (109/113)x⁶y⁴ - (127/131)y⁸)((139/137)x³ - (149/151)y²)", color: "text-blue-600" },
        { text: "💀 PUISSANCES 13 HARDCORE !", expr: "x¹³ avec fractions géantes premiers", color: "text-orange-600" },
        { text: "Premier produit", expr: "((-97/101)) × (139/137) × x¹³ = -(13483/13837)x¹³", color: "text-green-600" },
        { text: "Deuxième produit", expr: "((-97/101)) × (-(149/151)) × x¹⁰y² = (14453/15251)x¹⁰y²", color: "text-orange-600" },
        { text: "Troisième produit", expr: "(109/113) × (139/137) × x⁹y⁴ = (15151/15481)x⁹y⁴", color: "text-red-600" },
        { text: "Quatrième produit", expr: "(109/113) × (-(149/151)) × x⁶y⁶ = -(16241/17063)x⁶y⁶", color: "text-blue-600" },
        { text: "Cinquième produit", expr: "(-(127/131)) × (139/137) × x³y⁸ = -(17653/17947)x³y⁸", color: "text-green-600" },
        { text: "Sixième produit", expr: "(-(127/131)) × (-(149/151)) × y¹⁰ = (18923/19781)y¹⁰", color: "text-orange-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "-(13483/13837)x¹³ + (14453/15251)x¹⁰y² + (15151/15481)x⁹y⁴ - (16241/17063)x⁶y⁶ - (17653/17947)x³y⁸ + (18923/19781)y¹⁰", color: "text-purple-600" }
      ]
    },
    {
      id: 9,
      question: "((2/5)x⁴ + (3/7)xy² - (4/9)y⁴)²",
      steps: [
        { text: "Expression de départ", expr: "((2/5)x⁴ + (3/7)xy² - (4/9)y⁴)²", color: "text-blue-600" },
        { text: "💀 CARRÉ D'UN TRINÔME FRACTIONNAIRE !", expr: "9 produits au carré : a² + 2ab + 2ac + b² + 2bc + c²", color: "text-orange-600" },
        { text: "Carré du premier", expr: "((2/5)x⁴)² = (4/25)x⁸", color: "text-green-600" },
        { text: "Double produit 1-2", expr: "2 × (2/5)x⁴ × (3/7)xy² = (12/35)x⁵y²", color: "text-orange-600" },
        { text: "Double produit 1-3", expr: "2 × (2/5)x⁴ × (-(4/9)y⁴) = -(16/45)x⁴y⁴", color: "text-red-600" },
        { text: "Carré du deuxième", expr: "((3/7)xy²)² = (9/49)x²y⁴", color: "text-blue-600" },
        { text: "Double produit 2-3", expr: "2 × (3/7)xy² × (-(4/9)y⁴) = -(24/63)xy⁶", color: "text-green-600" },
        { text: "Carré du troisième", expr: "(-(4/9)y⁴)² = (16/81)y⁸", color: "text-orange-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "(4/25)x⁸ + (12/35)x⁵y² - (16/45)x⁴y⁴ + (9/49)x²y⁴ - (24/63)xy⁶ + (16/81)y⁸", color: "text-purple-600" }
      ]
    },
    {
      id: 10,
      question: "((13/17)a⁶ - (19/23)b⁴c² + (29/31)c⁶)((37/41)a² + (43/47)b²c - (53/59)c³)",
      steps: [
        { text: "Expression de départ", expr: "((13/17)a⁶ - (19/23)b⁴c² + (29/31)c⁶)((37/41)a² + (43/47)b²c - (53/59)c³)", color: "text-blue-600" },
        { text: "💀 TROIS VARIABLES FRACTIONNAIRES HARDCORE !", expr: "9 produits avec a, b, c et nombres premiers", color: "text-orange-600" },
        { text: "Premier produit", expr: "(13/17) × (37/41) × a⁸ = (481/697)a⁸", color: "text-green-600" },
        { text: "Deuxième produit", expr: "(13/17) × (43/47) × a⁶b²c = (559/799)a⁶b²c", color: "text-orange-600" },
        { text: "Troisième produit", expr: "(13/17) × (-(53/59)) × a⁶c³ = -(689/1003)a⁶c³", color: "text-red-600" },
        { text: "Et 6 autres produits...", expr: "Chaque terme × chaque terme", color: "text-blue-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "Expression géante avec 9 termes fractionnaires à trois variables", color: "text-purple-600" }
      ]
    },

    // Hardcore Niveau 11-15 : SOMMES DE FRACTIONS + DISTRIBUTIVITÉS
    {
      id: 11,
      question: "((7/8)x² + (5/12))((-3/4)x - (2/9)) + ((11/15)x + (7/10))((-5/6)x² + (8/21))",
      steps: [
        { text: "Expression de départ", expr: "((7/8)x² + (5/12))((-3/4)x - (2/9)) + ((11/15)x + (7/10))((-5/6)x² + (8/21))", color: "text-blue-600" },
        { text: "💀 SOMME DE DOUBLE DISTRIBUTIVITÉ FRACTIONNAIRE !", expr: "Développer chaque produit séparément", color: "text-orange-600" },
        { text: "Premier produit : terme 1", expr: "(7/8) × (-3/4) × x³ = -(21/32)x³", color: "text-green-600" },
        { text: "Premier produit : terme 2", expr: "(7/8) × (-2/9) × x² = -(14/72)x² = -(7/36)x²", color: "text-orange-600" },
        { text: "Premier produit : terme 3", expr: "(5/12) × (-3/4) × x = -(15/48)x = -(5/16)x", color: "text-red-600" },
        { text: "Premier produit : terme 4", expr: "(5/12) × (-2/9) = -(10/108) = -(5/54)", color: "text-blue-600" },
        { text: "Second produit : terme 1", expr: "(11/15) × (-5/6) × x³ = -(55/90)x³ = -(11/18)x³", color: "text-green-600" },
        { text: "Second produit : terme 2", expr: "(11/15) × (8/21) × x = (88/315)x", color: "text-orange-600" },
        { text: "Second produit : terme 3", expr: "(7/10) × (-5/6) × x² = -(35/60)x² = -(7/12)x²", color: "text-red-600" },
        { text: "Second produit : terme 4", expr: "(7/10) × (8/21) = (56/210) = (4/15)", color: "text-blue-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "(-(21/32) - (11/18))x³ + (-(7/36) - (7/12))x² + (-(5/16) + (88/315))x + (-(5/54) + (4/15))", color: "text-purple-600" }
      ]
    },
    {
      id: 12,
      question: "((13/19)x⁴ - (17/23)y²)((-29/31)x + (37/41)y) + ((43/47)x² + (53/59)y³)((-61/67)x³ - (71/73))",
      steps: [
        { text: "Expression de départ", expr: "((13/19)x⁴ - (17/23)y²)((-29/31)x + (37/41)y) + ((43/47)x² + (53/59)y³)((-61/67)x³ - (71/73))", color: "text-blue-600" },
        { text: "💀 SOMME HARDCORE FRACTIONS PREMIÈRES !", expr: "Deux produits avec nombres premiers", color: "text-orange-600" },
        { text: "Premier produit développé", expr: "-(377/589)x⁵ + (481/779)x⁴y + (493/713)xy² - (629/943)y³", color: "text-green-600" },
        { text: "Second produit développé", expr: "-(2623/3149)x⁵ - (3053/3431)x² + (3233/3953)x³y³ - (3763/4307)y³", color: "text-orange-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "Somme des deux développements avec fractions géantes", color: "text-purple-600" }
      ]
    },
    {
      id: 13,
      question: "((2/3)x⁶ - (5/7)x³y + (8/11)y⁴)((4/9)x² + (6/13)xy - (7/15)y²) + ((-3/8)x⁴ + (9/16)y³)((-11/17)x - (12/19)y)",
      steps: [
        { text: "Expression de départ", expr: "((2/3)x⁶ - (5/7)x³y + (8/11)y⁴)((4/9)x² + (6/13)xy - (7/15)y²) + ((-3/8)x⁴ + (9/16)y³)((-11/17)x - (12/19)y)", color: "text-blue-600" },
        { text: "💀 TRINÔME × TRINÔME + BINÔME × BINÔME !", expr: "9 + 4 = 13 produits fractionnaires", color: "text-orange-600" },
        { text: "Premier groupe : 9 termes", expr: "De (8/27)x⁸ jusqu'à -(56/165)y⁶", color: "text-green-600" },
        { text: "Second groupe : 4 termes", expr: "De (33/136)x⁵ jusqu'à -(108/304)y⁴", color: "text-orange-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "Expression avec 13 termes fractionnaires simplifiés", color: "text-purple-600" }
      ]
    },
    {
      id: 14,
      question: "((79/83)a⁵ - (89/97)b³c²)((-101/103)a² + (107/109)bc) + ((113/127)ab + (131/137)c⁴)((-139/149)a³b - (151/157)c)",
      steps: [
        { text: "Expression de départ", expr: "((79/83)a⁵ - (89/97)b³c²)((-101/103)a² + (107/109)bc) + ((113/127)ab + (131/137)c⁴)((-139/149)a³b - (151/157)c)", color: "text-blue-600" },
        { text: "💀 TROIS VARIABLES HARDCORE SOMME !", expr: "Fractions avec a, b, c et nombres premiers", color: "text-orange-600" },
        { text: "Premier produit : 4 termes", expr: "Avec puissances a⁷, a⁵bc, b⁴c², b⁴c³", color: "text-green-600" },
        { text: "Second produit : 4 termes", expr: "Avec puissances a⁴b², abc⁵, a³bc⁴, c⁵", color: "text-orange-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "8 termes fractionnaires complexes avec a, b, c", color: "text-purple-600" }
      ]
    },
    {
      id: 15,
      question: "((163/167)x⁸ + (173/179)x⁴y² - (181/191)y⁶)((193/197)x³ - (199/211)y) + ((-223/227)x⁵ + (229/233)xy⁴)((-239/241)x² + (251/257)y³)",
      steps: [
        { text: "Expression de départ", expr: "((163/167)x⁸ + (173/179)x⁴y² - (181/191)y⁶)((193/197)x³ - (199/211)y) + ((-223/227)x⁵ + (229/233)xy⁴)((-239/241)x² + (251/257)y³)", color: "text-blue-600" },
        { text: "💀 PUISSANCES 11 + FRACTIONS GÉANTES !", expr: "x¹¹ hardcore avec nombres premiers géants", color: "text-orange-600" },
        { text: "Premier produit : 6 termes", expr: "De x¹¹ jusqu'à y⁷ avec fractions énormes", color: "text-green-600" },
        { text: "Second produit : 4 termes", expr: "De x⁷ jusqu'à y⁷ avec fractions colossales", color: "text-orange-600" },
        { text: "💀 RÉSULTAT HARDCORE", expr: "Expression apocalyptique avec 10 termes fractionnaires géants", color: "text-purple-600" }
      ]
    },

    // Hardcore Niveau 16-20 : APOCALYPSE FRACTIONNAIRE !
    {
      id: 16,
      question: "((17/19)x⁵ - (23/29)x²y + (31/37)y³)((41/43)x³ + (47/53)xy - (59/61)y²) × ((67/71)x - (73/79)y)",
      steps: [
        { text: "Expression de départ", expr: "((17/19)x⁵ - (23/29)x²y + (31/37)y³)((41/43)x³ + (47/53)xy - (59/61)y²) × ((67/71)x - (73/79)y)", color: "text-blue-600" },
        { text: "💀 TRIPLE PRODUIT FRACTIONNAIRE !", expr: "D'abord développer (trinôme × trinôme), puis multiplier par binôme", color: "text-orange-600" },
        { text: "Étape 1 : Trinôme × Trinôme", expr: "9 termes intermédiaires avec fractions", color: "text-green-600" },
        { text: "Étape 2 : Résultat × Binôme", expr: "9 × 2 = 18 produits finaux", color: "text-red-600" },
        { text: "💀 APOCALYPSE HARDCORE", expr: "18 termes fractionnaires avec puissances jusqu'à x⁹", color: "text-purple-600" }
      ]
    },
    {
      id: 17,
      question: "((2/3)a⁴ - (5/7)b² + (8/11)c)³",
      steps: [
        { text: "Expression de départ", expr: "((2/3)a⁴ - (5/7)b² + (8/11)c)³", color: "text-blue-600" },
        { text: "💀 CUBE D'UN TRINÔME FRACTIONNAIRE !", expr: "Formule : (A + B + C)³ = A³ + B³ + C³ + 3A²B + 3A²C + 3B²A + 3B²C + 3C²A + 3C²B + 6ABC", color: "text-orange-600" },
        { text: "Cubes simples", expr: "((2/3)a⁴)³ + ((-5/7)b²)³ + ((8/11)c)³", color: "text-green-600" },
        { text: "Doubles produits", expr: "6 termes avec coefficients 3", color: "text-red-600" },
        { text: "Triple produit", expr: "6 × (2/3) × (-5/7) × (8/11) × a⁴b²c", color: "text-blue-600" },
        { text: "💀 APOCALYPSE HARDCORE", expr: "10 termes fractionnaires avec puissances jusqu'à a¹²", color: "text-purple-600" }
      ]
    },
    {
      id: 18,
      question: "((13/17)x⁷ - (19/23)x⁴y² + (29/31)xy⁵ - (37/41)y⁷)((43/47)x⁴ + (53/59)x²y - (61/67)y³ + (71/73))",
      steps: [
        { text: "Expression de départ", expr: "((13/17)x⁷ - (19/23)x⁴y² + (29/31)xy⁵ - (37/41)y⁷)((43/47)x⁴ + (53/59)x²y - (61/67)y³ + (71/73))", color: "text-blue-600" },
        { text: "💀 QUADRINÔME × QUADRINÔME !", expr: "4 × 4 = 16 produits fractionnaires avec nombres premiers", color: "text-orange-600" },
        { text: "Premier terme", expr: "(13/17) × (43/47) × x¹¹ = (559/799)x¹¹", color: "text-green-600" },
        { text: "Terme avec puissance max y", expr: "(-37/41) × (71/73) × y⁷ = -(2627/2993)y⁷", color: "text-orange-600" },
        { text: "Termes intermédiaires", expr: "14 autres termes avec fractions géantes", color: "text-red-600" },
        { text: "💀 APOCALYPSE HARDCORE", expr: "16 termes avec puissances jusqu'à x¹¹ et fractions premiers", color: "text-purple-600" }
      ]
    },
    {
      id: 19,
      question: "((83/89)a⁶b - (97/101)ab⁵ + (103/107)c³)((109/113)a³b² - (127/131)b²c + (137/139)ac²) + ((149/151)ab + (157/163)bc + (167/173)ca)²",
      steps: [
        { text: "Expression de départ", expr: "((83/89)a⁶b - (97/101)ab⁵ + (103/107)c³)((109/113)a³b² - (127/131)b²c + (137/139)ac²) + ((149/151)ab + (157/163)bc + (167/173)ca)²", color: "text-blue-600" },
        { text: "💀 TRINÔME × TRINÔME + CARRÉ !", expr: "Premier produit : 9 termes + Second carré : 9 termes", color: "text-orange-600" },
        { text: "Premier développement", expr: "9 termes avec a⁹b³, a⁷b³c, a⁶bc², etc.", color: "text-green-600" },
        { text: "Carré du trinôme", expr: "3 carrés + 6 doubles produits = 9 termes", color: "text-orange-600" },
        { text: "Additioner les résultats", expr: "Regrouper les termes similaires", color: "text-red-600" },
        { text: "💀 APOCALYPSE FINALE", expr: "Expression géante avec 18 termes fractionnaires à trois variables", color: "text-purple-600" }
      ]
    },
    {
      id: 20,
      question: "((179/181)x⁹ - (191/193)x⁶y² + (197/199)x³y⁵ - (211/223)y⁸)((227/229)x⁵ + (233/239)x²y³ - (241/251)y⁶) + ((257/263)x⁴ - (269/271)xy + (277/281)y²)³",
      steps: [
        { text: "Expression de départ", expr: "((179/181)x⁹ - (191/193)x⁶y² + (197/199)x³y⁵ - (211/223)y⁸)((227/229)x⁵ + (233/239)x²y³ - (241/251)y⁶) + ((257/263)x⁴ - (269/271)xy + (277/281)y²)³", color: "text-blue-600" },
        { text: "💀 QUADRINÔME × TRINÔME + CUBE !", expr: "Premier produit : 4×3=12 termes + Cube : 10 termes", color: "text-orange-600" },
        { text: "Premier produit : terme max", expr: "(179/181) × (227/229) × x¹⁴ = fractions colossales", color: "text-green-600" },
        { text: "Cube : terme max", expr: "((257/263)x⁴)³ = puissance 12", color: "text-orange-600" },
        { text: "Développement complet", expr: "12 + 10 = 22 termes avec fractions énormes", color: "text-red-600" },
        { text: "💀 CHAMPION HARDCORE ULTIME", expr: "22 termes fractionnaires géants avec puissances jusqu'à x¹⁴ !", color: "text-purple-600" }
      ]
    }
  ]

  // Sélectionner les exercices selon le mode
  const exercises = exerciseLevel === 'normal' ? normalExercises : exerciseLevel === 'beast' ? beastExercises : hardcoreExercises
  const currentEx = exercises[currentExercise]
  const currentAnim = distributivityAnimations[selectedAnimation]

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
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 min-h-[400px] flex flex-col relative overflow-hidden">
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
                    <div className="space-y-6">
                      {/* Expression de départ - TOUJOURS VISIBLE */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-3xl sm:text-4xl font-mono font-bold text-gray-800 mb-4">
                          <span className="text-blue-600 font-extrabold">(a + 1)</span>
                          <span className="text-red-600 font-extrabold">(a + 2)</span>
                        </div>
                        
                        {/* Flèches visuelles progressives */}
                        {animationStep >= 1 && (
                          <div className="relative mt-4 mb-8">
                            <svg className="w-full h-24" viewBox="0 0 500 100">
                              {/* Positions des termes : (a + 1) × (a + 2) */}
                              {/* a de (a+1) = 50, 1 de (a+1) = 90, a de (a+2) = 280, 2 de (a+2) = 320 */}
                              
                              {/* Flèches du niveau HAUT (a × a et a × 2) */}
                              {/* Flèche 1: a × a - niveau haut */}
                              {animationStep >= 1 && (
                                <g>
                                  <path
                                    d="M 50 20 Q 165 5 280 20"
                                    stroke="#8b5cf6"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-purple)"
                                    className="animate-pulse"
                                  />
                                  <text x="165" y="15" textAnchor="middle" className="text-xs fill-purple-600 font-bold">a × a = a²</text>
                                </g>
                              )}
                              
                              {/* Flèche 2: a × 2 - niveau haut */}
                              {animationStep >= 2 && (
                                <g>
                                  <path
                                    d="M 50 20 Q 185 10 320 20"
                                    stroke="#059669"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-green)"
                                    className="animate-pulse"
                                  />
                                  <text x="185" y="25" textAnchor="middle" className="text-xs fill-green-600 font-bold">a × 2 = 2a</text>
                                </g>
                              )}
                              
                              {/* Flèches du niveau BAS (1 × a et 1 × 2) */}
                              {/* Flèche 3: 1 × a - niveau bas */}
                              {animationStep >= 3 && (
                                <g>
                                  <path
                                    d="M 90 35 Q 185 80 280 35"
                                    stroke="#dc2626"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-red)"
                                    className="animate-pulse"
                                  />
                                  <text x="185" y="75" textAnchor="middle" className="text-xs fill-red-600 font-bold">1 × a = a</text>
                                </g>
                              )}
                              
                              {/* Flèche 4: 1 × 2 - niveau bas */}
                              {animationStep >= 4 && (
                                <g>
                                  <path
                                    d="M 90 35 Q 205 85 320 35"
                                    stroke="#ea580c"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-orange)"
                                    className="animate-pulse"
                                  />
                                  <text x="205" y="90" textAnchor="middle" className="text-xs fill-orange-600 font-bold">1 × 2 = 2</text>
                                </g>
                              )}
                              
                              {/* Termes visuels pour référence */}
                              <text x="50" y="30" textAnchor="middle" className="text-sm fill-blue-600 font-bold">a</text>
                              <text x="90" y="45" textAnchor="middle" className="text-sm fill-blue-600 font-bold">1</text>
                              <text x="280" y="30" textAnchor="middle" className="text-sm fill-red-600 font-bold">a</text>
                              <text x="320" y="30" textAnchor="middle" className="text-sm fill-red-600 font-bold">2</text>
                              
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
                        
                        <p className="text-gray-600">Expression de départ</p>
                      </div>
                      
                      {/* Étape 1: Flèche a × a */}
                      {animationStep >= 1 && (
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-mono font-bold">
                              <span className="text-blue-600 bg-blue-200 px-2 rounded">a</span>
                              <span className="text-gray-600"> × </span>
                              <span className="text-red-600 bg-red-200 px-2 rounded">a</span>
                              <span className="text-gray-600"> = </span>
                              <span className="text-purple-600 font-extrabold">a²</span>
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
                      
                      {/* Étape 3: Flèche 1 × a */}
                      {animationStep >= 3 && (
                        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-mono font-bold">
                              <span className="text-blue-600 bg-blue-200 px-2 rounded">1</span>
                              <span className="text-gray-600"> × </span>
                              <span className="text-red-600 bg-red-200 px-2 rounded">a</span>
                              <span className="text-gray-600"> = </span>
                              <span className="text-red-600 font-extrabold">a</span>
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
                              <span className="text-purple-600 font-extrabold">a²</span>
                              <span className="text-gray-600"> + </span>
                              <span className="text-green-600 font-extrabold">2a</span>
                              <span className="text-gray-600"> + </span>
                              <span className="text-red-600 font-extrabold">a</span>
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
                              <span className="text-indigo-600">a² + 2a + a + 2</span>
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
                              <span className="text-green-700 font-extrabold">a² + 3a + 2</span>
                            </div>
                            <p className="text-gray-600">Résultat final : regrouper les termes similaires</p>
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
                  <button
                    onClick={() => {
                      setExerciseLevel('hardcore')
                      setCurrentExercise(0)
                      resetExercise()
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-bold shadow-md transition-colors ${
                      exerciseLevel === 'hardcore' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    <span className="text-xl">💀</span>
                    Hardcore: {correctAnswersHardcore}/{hardcoreExercises.length}
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