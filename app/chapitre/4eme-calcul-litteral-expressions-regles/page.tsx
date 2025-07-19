'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Calculator, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import MathEditor from '@/components/MathEditor'
import { VoiceInput } from '@/components/VoiceInput'

// Données des exercices d'addition
const normalExercises = [
  // Niveau 1 : Bases rapides
  {
    id: 1,
    question: "2x + 3x",
    steps: [
      { text: "Expression de départ", expr: "2x + 3x", color: "text-blue-600" },
      { text: "Résultat final", expr: "5x", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "3x - 7x",
    steps: [
      { text: "Expression de départ", expr: "3x - 7x", color: "text-blue-600" },
      { text: "Résultat final", expr: "-4x", color: "text-purple-600" }
    ]
  },
  {
    id: 3,
    question: "4y + y - 6y",
    steps: [
      { text: "Expression de départ", expr: "4y + y - 6y", color: "text-blue-600" },
      { text: "y = 1y (coefficient implicite)", expr: "4y + 1y - 6y", color: "text-orange-600" },
      { text: "Résultat final", expr: "-y", color: "text-purple-600" }
    ]
  },
  
  // Niveau 2 : Expressions avec plusieurs termes
  {
    id: 4,
    question: "2z - 8z + 3z - z",
    steps: [
      { text: "Expression de départ", expr: "2z - 8z + 3z - z", color: "text-blue-600" },
      { text: "z = 1z (coefficient implicite)", expr: "2z - 8z + 3z - 1z", color: "text-orange-600" },
      { text: "Résultat final", expr: "-4z", color: "text-purple-600" }
    ]
  },
  {
    id: 5,
    question: "5a - (-3a) + 2a - (-8a) + 4a",
    steps: [
      { text: "Expression de départ", expr: "5a - (-3a) + 2a - (-8a) + 4a", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "5a + 3a + 2a + 8a + 4a", color: "text-orange-600" },
      { text: "Résultat final", expr: "22a", color: "text-purple-600" }
    ]
  },
  
  // Niveau 3 : Expressions avec différentes variables et doubles signes
  {
    id: 6,
    question: "3x - (-2y) - x + 5y",
    steps: [
      { text: "Expression de départ", expr: "3x - (-2y) - x + 5y", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "3x + 2y - x + 5y", color: "text-orange-600" },
      { text: "Séparer les variables", expr: "3x - x + 2y + 5y", color: "text-green-600" },
      { text: "Résultat final", expr: "2x + 7y", color: "text-purple-600" }
    ]
  },
  {
    id: 7,
    question: "6a - (-4b) + 2a - (-3b) - 9a",
    steps: [
      { text: "Expression de départ", expr: "6a - (-4b) + 2a - (-3b) - 9a", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "6a + 4b + 2a + 3b - 9a", color: "text-orange-600" },
      { text: "Séparer les variables", expr: "6a + 2a - 9a + 4b + 3b", color: "text-green-600" },
      { text: "Résultat final", expr: "-a + 7b", color: "text-purple-600" }
    ]
  },
  
  // Niveau 4 : Expressions avec nombres et variables avec doubles signes
  {
    id: 8,
    question: "2x - (-5) + 3x - (-2)",
    steps: [
      { text: "Expression de départ", expr: "2x - (-5) + 3x - (-2)", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "2x + 5 + 3x + 2", color: "text-orange-600" },
      { text: "Séparer variables et nombres", expr: "2x + 3x + 5 + 2", color: "text-green-600" },
      { text: "Résultat final", expr: "5x + 7", color: "text-purple-600" }
    ]
  },
  {
    id: 9,
    question: "3y - (-8) + 2y - (-5) + 4y",
    steps: [
      { text: "Expression de départ", expr: "3y - (-8) + 2y - (-5) + 4y", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "3y + 8 + 2y + 5 + 4y", color: "text-orange-600" },
      { text: "Séparer variables et nombres", expr: "3y + 2y + 4y + 8 + 5", color: "text-green-600" },
      { text: "Résultat final", expr: "9y + 13", color: "text-purple-600" }
    ]
  },
  {
    id: 10,
    question: "4a - (-7) + 2a - 9a - (-6)",
    steps: [
      { text: "Expression de départ", expr: "4a - (-7) + 2a - 9a - (-6)", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "4a + 7 + 2a - 9a + 6", color: "text-orange-600" },
      { text: "Séparer variables et nombres", expr: "4a + 2a - 9a + 7 + 6", color: "text-green-600" },
      { text: "Résultat final", expr: "-3a + 13", color: "text-purple-600" }
    ]
  },
  
  // Niveau 5 : Expressions complexes avec plusieurs variables, nombres et doubles signes
  {
    id: 11,
    question: "3x - (-5y) + 7 - 2x - (-8y) - 12",
    steps: [
      { text: "Expression de départ", expr: "3x - (-5y) + 7 - 2x - (-8y) - 12", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "3x + 5y + 7 - 2x + 8y - 12", color: "text-orange-600" },
      { text: "Séparer par type", expr: "3x - 2x + 5y + 8y + 7 - 12", color: "text-green-600" },
      { text: "Résultat final", expr: "x + 13y - 5", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "2a - (-6b) + 5 - 4a - (-3b) - (-9) + a",
    steps: [
      { text: "Expression de départ", expr: "2a - (-6b) + 5 - 4a - (-3b) - (-9) + a", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "2a + 6b + 5 - 4a + 3b + 9 + a", color: "text-orange-600" },
      { text: "Séparer par type", expr: "2a - 4a + a + 6b + 3b + 5 + 9", color: "text-green-600" },
      { text: "a = 1a (coefficient implicite)", expr: "2a - 4a + 1a + 6b + 3b + 5 + 9", color: "text-red-600" },
      { text: "Résultat final", expr: "-a + 9b + 14", color: "text-purple-600" }
    ]
  },
  
  // Niveau 6 : Expressions avec plusieurs variables (xy, x²y, xy²) et doubles signes
  {
    id: 13,
    question: "3xy - (-2x²y) - 5xy + 4x²y - (-xy) + 7",
    steps: [
      { text: "Expression de départ", expr: "3xy - (-2x²y) - 5xy + 4x²y - (-xy) + 7", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "3xy + 2x²y - 5xy + 4x²y + xy + 7", color: "text-orange-600" },
      { text: "Séparer les termes semblables", expr: "3xy - 5xy + xy + 2x²y + 4x²y + 7", color: "text-green-600" },
      { text: "xy = 1xy (coefficient implicite)", expr: "3xy - 5xy + 1xy + 2x²y + 4x²y + 7", color: "text-red-600" },
      { text: "Résultat final", expr: "-xy + 6x²y + 7", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "2xy² - (-4x²y) + 3xy² - (-5x²y) - 6xy² - (-2x²y) - 1",
    steps: [
      { text: "Expression de départ", expr: "2xy² - (-4x²y) + 3xy² - (-5x²y) - 6xy² - (-2x²y) - 1", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "2xy² + 4x²y + 3xy² + 5x²y - 6xy² + 2x²y - 1", color: "text-orange-600" },
      { text: "Séparer les termes semblables", expr: "2xy² + 3xy² - 6xy² + 4x²y + 5x²y + 2x²y - 1", color: "text-green-600" },
      { text: "Résultat final", expr: "-xy² + 11x²y - 1", color: "text-purple-600" }
    ]
  },
  {
    id: 15,
    question: "5xy - (-2x²y) + 3xy² - 7xy - (-4x²y) - (-8xy²) + 2xy - (-10)",
    steps: [
      { text: "Expression de départ", expr: "5xy - (-2x²y) + 3xy² - 7xy - (-4x²y) - (-8xy²) + 2xy - (-10)", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "5xy + 2x²y + 3xy² - 7xy + 4x²y + 8xy² + 2xy + 10", color: "text-orange-600" },
      { text: "Séparer les termes semblables", expr: "5xy - 7xy + 2xy + 2x²y + 4x²y + 3xy² + 8xy² + 10", color: "text-green-600" },
      { text: "Résultat final", expr: "0xy + 6x²y + 11xy² + 10 = 6x²y + 11xy² + 10", color: "text-purple-600" }
    ]
  },
  
  // Niveau 7 : Moins devant parenthèses avec plusieurs variables et doubles signes
  {
    id: 16,
    question: "3xy - (-2xy + 4xy) + 5xy",
    steps: [
      { text: "Expression de départ", expr: "3xy - (-2xy + 4xy) + 5xy", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "3xy - (2xy) + 5xy", color: "text-orange-600" },
      { text: "Moins devant parenthèse", expr: "3xy - 2xy + 5xy", color: "text-green-600" },
      { text: "Résultat final", expr: "6xy", color: "text-purple-600" }
    ]
  },
  {
    id: 17,
    question: "2x²y - [3x²y - (-5x²y)] + 4x²y",
    steps: [
      { text: "Expression de départ", expr: "2x²y - [3x²y - (-5x²y)] + 4x²y", color: "text-blue-600" },
      { text: "Règle dans crochets : moins par moins", expr: "2x²y - [3x²y + 5x²y] + 4x²y", color: "text-orange-600" },
      { text: "Simplifier dans crochets", expr: "2x²y - [8x²y] + 4x²y", color: "text-green-600" },
      { text: "Moins devant crochets", expr: "2x²y - 8x²y + 4x²y", color: "text-red-600" },
      { text: "Résultat final", expr: "-2x²y", color: "text-purple-600" }
    ]
  },
  
  // Niveau 8 : Parenthèses avec plusieurs types (x et nombre) et doubles signes
  {
    id: 18,
    question: "4x - [2x - (-3)] + 7x - (-5)",
    steps: [
      { text: "Expression de départ", expr: "4x - [2x - (-3)] + 7x - (-5)", color: "text-blue-600" },
      { text: "Règle dans crochets : moins par moins", expr: "4x - [2x + 3] + 7x + 5", color: "text-orange-600" },
      { text: "Moins devant crochets change les signes", expr: "4x - 2x - 3 + 7x + 5", color: "text-green-600" },
      { text: "Séparer variables et nombres", expr: "4x - 2x + 7x - 3 + 5", color: "text-red-600" },
      { text: "Résultat final", expr: "9x + 2", color: "text-purple-600" }
    ]
  },
  {
    id: 19,
    question: "6xy - [3xy - (-2)] + 4xy - (-8)",
    steps: [
      { text: "Expression de départ", expr: "6xy - [3xy - (-2)] + 4xy - (-8)", color: "text-blue-600" },
      { text: "Règle : moins par moins fait plus", expr: "6xy - [3xy + 2] + 4xy + 8", color: "text-orange-600" },
      { text: "Moins devant crochets change les signes", expr: "6xy - 3xy - 2 + 4xy + 8", color: "text-green-600" },
      { text: "Séparer variables et nombres", expr: "6xy - 3xy + 4xy - 2 + 8", color: "text-red-600" },
      { text: "Résultat final", expr: "7xy + 6", color: "text-purple-600" }
    ]
  },
  
  // Niveau 9 : Parenthèses avec 3 membres (x, x² et nombre) et doubles signes
  {
    id: 20,
    question: "5x - [2x² - (-3x) - (-4)] + 3x² - (-1)",
    steps: [
      { text: "Expression de départ", expr: "5x - [2x² - (-3x) - (-4)] + 3x² - (-1)", color: "text-blue-600" },
      { text: "Règle dans crochets : moins par moins", expr: "5x - [2x² + 3x + 4] + 3x² + 1", color: "text-orange-600" },
      { text: "Moins devant crochets change les signes", expr: "5x - 2x² - 3x - 4 + 3x² + 1", color: "text-green-600" },
      { text: "Séparer par type", expr: "5x - 3x - 2x² + 3x² - 4 + 1", color: "text-red-600" },
      { text: "Résultat final", expr: "2x + x² - 3", color: "text-purple-600" }
    ]
  }
]

// Données des exercices de multiplication - PROGRESSION ACCÉLÉRÉE 4ÈME
const normalMultiplicationExercises = [
  // Niveau 1-2 : Coefficients avec variables (DÉBUT DIRECT)
  {
    id: 1,
    question: "2x × 3y",
    steps: [
      { text: "Expression de départ", expr: "2x × 3y", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6xy", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "4a × 3b",
    steps: [
      { text: "Expression de départ", expr: "4a × 3b", color: "text-blue-600" },
      { text: "Multiplication directe", expr: "12ab", color: "text-purple-600" }
    ]
  },
  
  // Niveau 3-4 : Variables identiques = puissances AVEC coefficients
  {
    id: 3,
    question: "3x × 2x",
    steps: [
      { text: "Expression de départ", expr: "3x × 2x", color: "text-blue-600" },
      { text: "Coefficients : 3 × 2 = 6", expr: "6 × x × x", color: "text-orange-600" },
      { text: "Variables identiques : x × x = x²", expr: "6x²", color: "text-purple-600" }
    ]
  },
  {
    id: 4,
    question: "5y × 4y",
    steps: [
      { text: "Expression de départ", expr: "5y × 4y", color: "text-blue-600" },
      { text: "Coefficients et puissances", expr: "20y²", color: "text-purple-600" }
    ]
  },
  
  // Niveau 5-6 : Puissances avec puissances (règle xᵃ × xᵇ)
  {
    id: 5,
    question: "x² × x³",
    steps: [
      { text: "Expression de départ", expr: "x² × x³", color: "text-blue-600" },
      { text: "Règle : xᵃ × xᵇ = xᵃ⁺ᵇ", expr: "x²⁺³", color: "text-orange-600" },
      { text: "Résultat final", expr: "x⁵", color: "text-purple-600" }
    ]
  },
  {
    id: 6,
    question: "2x² × 3x³",
    steps: [
      { text: "Expression de départ", expr: "2x² × 3x³", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × x² × x³", color: "text-orange-600" },
      { text: "Puissances : x²⁺³ = x⁵", expr: "6x⁵", color: "text-purple-600" }
    ]
  },
  
  // Niveau 7-8 : Signes négatifs (introduction rapide)
  {
    id: 7,
    question: "-3x × 4y",
    steps: [
      { text: "Expression de départ", expr: "-3x × 4y", color: "text-blue-600" },
      { text: "Signes : (-) × (+) = (-)", expr: "-12xy", color: "text-purple-600" }
    ]
  },
  {
    id: 8,
    question: "5a × (-2b)",
    steps: [
      { text: "Expression de départ", expr: "5a × (-2b)", color: "text-blue-600" },
      { text: "Signes négatifs", expr: "-10ab", color: "text-purple-600" }
    ]
  },
  
  // Niveau 9-10 : Moins fois moins = plus
  {
    id: 9,
    question: "(-3x) × (-4y)",
    steps: [
      { text: "Expression de départ", expr: "(-3x) × (-4y)", color: "text-blue-600" },
      { text: "Règle : (-) × (-) = (+)", expr: "+12xy", color: "text-purple-600" }
    ]
  },
  {
    id: 10,
    question: "(-5a) × (-3a)",
    steps: [
      { text: "Expression de départ", expr: "(-5a) × (-3a)", color: "text-blue-600" },
      { text: "Moins fois moins = plus", expr: "+15a²", color: "text-purple-600" }
    ]
  },
  
  // Niveau 11-12 : Puissances avec signes
  {
    id: 11,
    question: "(-2x²) × 3x",
    steps: [
      { text: "Expression de départ", expr: "(-2x²) × 3x", color: "text-blue-600" },
      { text: "Signes et coefficients", expr: "-6 × x² × x", color: "text-orange-600" },
      { text: "Puissances : x²⁺¹ = x³", expr: "-6x³", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "(-3y) × (-2y³)",
    steps: [
      { text: "Expression de départ", expr: "(-3y) × (-2y³)", color: "text-blue-600" },
      { text: "Moins fois moins = plus", expr: "+6y⁴", color: "text-purple-600" }
    ]
  },
  
  // Niveau 13-14 : Trois variables avec puissances
  {
    id: 13,
    question: "2x²y × 3xz",
    steps: [
      { text: "Expression de départ", expr: "2x²y × 3xz", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × x²y × xz", color: "text-orange-600" },
      { text: "Variables : x²⁺¹ = x³", expr: "6x³yz", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "4abc × 3a²b",
    steps: [
      { text: "Expression de départ", expr: "4abc × 3a²b", color: "text-blue-600" },
      { text: "Trois variables", expr: "12a³b²c", color: "text-purple-600" }
    ]
  },
  
  // Niveau 15-16 : Signes complexes avec puissances élevées
  {
    id: 15,
    question: "(-3x³) × (-2x²y)",
    steps: [
      { text: "Expression de départ", expr: "(-3x³) × (-2x²y)", color: "text-blue-600" },
      { text: "Moins fois moins = plus", expr: "+6 × x³ × x²y", color: "text-orange-600" },
      { text: "Puissances élevées", expr: "+6x⁵y", color: "text-purple-600" }
    ]
  },
  {
    id: 16,
    question: "(-4a²b) × 3ab³",
    steps: [
      { text: "Expression de départ", expr: "(-4a²b) × 3ab³", color: "text-blue-600" },
      { text: "Signes et puissances", expr: "-12a³b⁴", color: "text-purple-600" }
    ]
  },
  
  // Niveau 17-18 : Très haute difficulté
  {
    id: 17,
    question: "(-2x⁴y²) × (-3x³y) × 2xy",
    steps: [
      { text: "Expression de départ", expr: "(-2x⁴y²) × (-3x³y) × 2xy", color: "text-blue-600" },
      { text: "Signes : (-) × (-) × (+) = (+)", expr: "+12 × x⁴⁺³⁺¹ × y²⁺¹⁺¹", color: "text-orange-600" },
      { text: "Très haute complexité", expr: "+12x⁸y⁴", color: "text-purple-600" }
    ]
  },
  {
    id: 18,
    question: "5x³y × (-2xy²) × (-xy)",
    steps: [
      { text: "Expression de départ", expr: "5x³y × (-2xy²) × (-xy)", color: "text-blue-600" },
      { text: "Triple multiplication", expr: "+10x⁵y⁴", color: "text-purple-600" }
    ]
  },
  
  // Niveau 19-20 : Ultra complexe avec 4 variables
  {
    id: 19,
    question: "(-3x²y³z) × (-2xyz²w) × xyw",
    steps: [
      { text: "Expression de départ", expr: "(-3x²y³z) × (-2xyz²w) × xyw", color: "text-blue-600" },
      { text: "Quatre variables !", expr: "(-) × (-) × (+) = (+)", color: "text-orange-600" },
      { text: "Puissances : x²⁺¹⁺¹, y³⁺¹⁺¹, z¹⁺², w¹⁺¹", expr: "+6x⁴y⁵z³w²", color: "text-purple-600" }
    ]
  },
  {
    id: 20,
    question: "(-4a³b²c) × (-abc²d) × (-2acd)",
    steps: [
      { text: "Expression de départ", expr: "(-4a³b²c) × (-abc²d) × (-2acd)", color: "text-blue-600" },
      { text: "ULTRA COMPLEXE !", expr: "(-) × (-) × (-) = (-)", color: "text-orange-600" },
      { text: "Résultat final", expr: "-8a⁵b³c⁴d²", color: "text-purple-600" }
    ]
  }
]

const beastMultiplicationExercises = [
  // Beast Niveau 1 : DÉMARRAGE EXPLOSIF - Signes négatifs avec puissances élevées !
  {
    id: 1,
    question: "(-3x³) × (-2x⁴y²) × 4xy",
    steps: [
      { text: "Expression de départ", expr: "(-3x³) × (-2x⁴y²) × 4xy", color: "text-blue-600" },
      { text: "🔥 BEAST ! Signes : (-) × (-) × (+) = (+)", expr: "+24 × x³⁺⁴⁺¹ × y²⁺¹", color: "text-orange-600" },
      { text: "Résultat explosif", expr: "+24x⁸y³", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "(-5x²y³z) × 3xyz² × (-2y)",
    steps: [
      { text: "Expression de départ", expr: "(-5x²y³z) × 3xyz² × (-2y)", color: "text-blue-600" },
      { text: "🔥 Trois variables dès le début !", expr: "+30x³y⁶z³", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 2 : QUATRE VARIABLES avec hautes puissances
  {
    id: 3,
    question: "(-2x³y²z⁴w) × (-3xyz²w³) × xyw",
    steps: [
      { text: "Expression de départ", expr: "(-2x³y²z⁴w) × (-3xyz²w³) × xyw", color: "text-blue-600" },
      { text: "🔥 QUATRE VARIABLES ! Signes : (-) × (-) × (+) = (+)", expr: "+6 × x³⁺¹⁺¹ × y²⁺¹⁺¹ × z⁴⁺² × w¹⁺³⁺¹", color: "text-orange-600" },
      { text: "Beast quadruple", expr: "+6x⁵y⁴z⁶w⁵", color: "text-purple-600" }
    ]
  },
  {
    id: 4,
    question: "4a⁴b²c³d × (-3a²bc²d²) × (-ab)",
    steps: [
      { text: "Expression de départ", expr: "4a⁴b²c³d × (-3a²bc²d²) × (-ab)", color: "text-blue-600" },
      { text: "🔥 Beast quadruple avec signes", expr: "+36a⁷b⁴c⁶d⁴", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 3 : MULTIPLICATON QUINTUPLE avec signes
  {
    id: 5,
    question: "(-x²y) × (-2xyz) × (-3y²z²) × 2xz × (-y)",
    steps: [
      { text: "Expression de départ", expr: "(-x²y) × (-2xyz) × (-3y²z²) × 2xz × (-y)", color: "text-blue-600" },
      { text: "🔥 QUINTUPLE ! Signes : (-) × (-) × (-) × (+) × (-) = (-)", expr: "- × 1 × 2 × 3 × 2 × 1", color: "text-orange-600" },
      { text: "Puissances BEAST : x²⁺¹⁺¹, y¹⁺¹⁺²⁺¹, z¹⁺²⁺¹", expr: "-12x⁴y⁵z⁴", color: "text-purple-600" }
    ]
  },
  {
    id: 6,
    question: "(-2a³b) × 3ab² × (-ab³c) × (-2bc) × ac",
    steps: [
      { text: "Expression de départ", expr: "(-2a³b) × 3ab² × (-ab³c) × (-2bc) × ac", color: "text-blue-600" },
      { text: "🔥 Cinq termes Beast", expr: "+12a⁶b⁷c³", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 4 : PUISSANCES EXTRÊMES (exposants 5+)
  {
    id: 7,
    question: "(-3x⁵y⁴) × (-2x³y⁶z²) × x²yz",
    steps: [
      { text: "Expression de départ", expr: "(-3x⁵y⁴) × (-2x³y⁶z²) × x²yz", color: "text-blue-600" },
      { text: "🔥 PUISSANCES EXTRÊMES ! x⁵⁺³⁺², y⁴⁺⁶⁺¹, z²⁺¹", expr: "+6x¹⁰y¹¹z³", color: "text-orange-600" },
      { text: "Beast ultime", expr: "+6x¹⁰y¹¹z³", color: "text-purple-600" }
    ]
  },
  {
    id: 8,
    question: "4a⁶b³ × (-2a⁴b⁵c²) × (-3a²bc)",
    steps: [
      { text: "Expression de départ", expr: "4a⁶b³ × (-2a⁴b⁵c²) × (-3a²bc)", color: "text-blue-600" },
      { text: "🔥 Puissances 6+ dès le niveau 8", expr: "+24a¹²b⁹c³", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 5 : CINQ VARIABLES avec puissances élevées
  {
    id: 9,
    question: "(-2x³y²z⁴vw) × (-3xy³z²v²w³) × xyzv",
    steps: [
      { text: "Expression de départ", expr: "(-2x³y²z⁴vw) × (-3xy³z²v²w³) × xyzv", color: "text-blue-600" },
      { text: "🔥 CINQ VARIABLES ! Beast mode 5D", expr: "(-) × (-) × (+) = (+)", color: "text-orange-600" },
      { text: "Résultat 5D Beast", expr: "+6x⁵y⁶z⁷v⁴w⁴", color: "text-purple-600" }
    ]
  },
  {
    id: 10,
    question: "(-5a⁴b²c³de) × 2a²b⁴cd²e² × (-abc)",
    steps: [
      { text: "Expression de départ", expr: "(-5a⁴b²c³de) × 2a²b⁴cd²e² × (-abc)", color: "text-blue-600" },
      { text: "🔥 Complexité 5 variables", expr: "+10a⁷b⁷c⁵d⁴e³", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 6 : MULTIPLICATONS AVEC 6 TERMES
  {
    id: 11,
    question: "(-x³) × (-2x²y) × 3xy² × (-yz) × 2xz × (-y)",
    steps: [
      { text: "Expression de départ", expr: "(-x³) × (-2x²y) × 3xy² × (-yz) × 2xz × (-y)", color: "text-blue-600" },
      { text: "🔥 SIX TERMES ! Signes : (-) × (-) × (+) × (-) × (+) × (-) = (+)", expr: "+12 × x³⁺²⁺¹⁺¹ × y¹⁺²⁺¹⁺¹ × z¹⁺¹", color: "text-orange-600" },
      { text: "Beast sextuple", expr: "+12x⁷y⁵z²", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "2a⁴ × (-3a²b) × (-ab³) × 4b²c × (-ac²) × (-c)",
    steps: [
      { text: "Expression de départ", expr: "2a⁴ × (-3a²b) × (-ab³) × 4b²c × (-ac²) × (-c)", color: "text-blue-600" },
      { text: "🔥 Six multiplicatons Beast", expr: "+24a⁸b⁶c⁴", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 7 : PUISSANCES ULTRA-ÉLEVÉES (exposants 8+)
  {
    id: 13,
    question: "(-2x⁷y⁵z³) × (-3x⁴y⁶z⁵) × x²y²z",
    steps: [
      { text: "Expression de départ", expr: "(-2x⁷y⁵z³) × (-3x⁴y⁶z⁵) × x²y²z", color: "text-blue-600" },
      { text: "🔥 PUISSANCES 7+ ! Beast extrême", expr: "+6 × x⁷⁺⁴⁺² × y⁵⁺⁶⁺² × z³⁺⁵⁺¹", color: "text-orange-600" },
      { text: "Ultra Beast", expr: "+6x¹³y¹³z⁹", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "(-4a⁸b⁶) × 2a⁵b⁷c⁴ × (-3a²bc²)",
    steps: [
      { text: "Expression de départ", expr: "(-4a⁸b⁶) × 2a⁵b⁷c⁴ × (-3a²bc²)", color: "text-blue-600" },
      { text: "🔥 Exposants 8+ Beast", expr: "+24a¹⁵b¹⁴c⁶", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 8 : SIX VARIABLES avec multiplicatons multiples
  {
    id: 15,
    question: "(-x⁴y³z²vwt) × (-2xy²z³v²w²t³) × 3x²yzv × (-wt)",
    steps: [
      { text: "Expression de départ", expr: "(-x⁴y³z²vwt) × (-2xy²z³v²w²t³) × 3x²yzv × (-wt)", color: "text-blue-600" },
      { text: "🔥 SIX VARIABLES BEAST ! 4 termes", expr: "(-) × (-) × (+) × (-) = (+)", color: "text-orange-600" },
      { text: "Beast 6D ultime", expr: "+6x⁷y⁶z⁶v⁴w⁴t⁵", color: "text-purple-600" }
    ]
  },
  {
    id: 16,
    question: "(-3a⁵b⁴c³def) × 2a³b²cd²e²f² × (-ab) × (-cef)",
    steps: [
      { text: "Expression de départ", expr: "(-3a⁵b⁴c³def) × 2a³b²cd²e²f² × (-ab) × (-cef)", color: "text-blue-600" },
      { text: "🔥 Six variables Beast", expr: "+6a⁹b⁷c⁵d⁴e⁴f⁴", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 9 : COMPLEXITÉ ULTIME - 7+ termes, puissances 10+
  {
    id: 17,
    question: "(-x⁶) × (-2x⁵y⁴) × 3x³y⁶z² × (-xy) × 2y²z³ × (-xz) × z",
    steps: [
      { text: "Expression de départ", expr: "(-x⁶) × (-2x⁵y⁴) × 3x³y⁶z² × (-xy) × 2y²z³ × (-xz) × z", color: "text-blue-600" },
      { text: "🔥 SEPT TERMES ! Signes multiples", expr: "(-) × (-) × (+) × (-) × (+) × (-) × (+) = (+)", color: "text-orange-600" },
      { text: "Beast 7 termes", expr: "+12x¹⁶y¹³z⁷", color: "text-purple-600" }
    ]
  },
  {
    id: 18,
    question: "(-2a¹⁰b⁸) × 3a⁶b⁵c⁴ × (-ab²c) × (-ac³) × 2bc × (-a) × (-c²)",
    steps: [
      { text: "Expression de départ", expr: "(-2a¹⁰b⁸) × 3a⁶b⁵c⁴ × (-ab²c) × (-ac³) × 2bc × (-a) × (-c²)", color: "text-blue-600" },
      { text: "🔥 Sept termes, puissances 10+", expr: "+12a¹⁹b¹⁶c¹⁰", color: "text-purple-600" }
    ]
  },
  
  // Beast Niveau 10 : APOCALYPSE MATHÉMATIQUE - Maximum de tout !
  {
    id: 19,
    question: "(-3x⁸y⁷z⁶vwtu) × (-2x⁵y⁶z⁴v³w²t) × x³y²zv × (-xyw) × 2zt × (-uvt²) × (-xyz)",
    steps: [
      { text: "Expression de départ", expr: "(-3x⁸y⁷z⁶vwtu) × (-2x⁵y⁶z⁴v³w²t) × x³y²zv × (-xyw) × 2zt × (-uvt²) × (-xyz)", color: "text-blue-600" },
      { text: "🔥 APOCALYPSE ! 7 variables, 7 termes", expr: "Signes : (-) × (-) × (+) × (-) × (+) × (-) × (-) = (-)", color: "text-orange-600" },
      { text: "Beast apocalyptique", expr: "-12x¹⁸y¹⁶z¹²v⁵w⁴t⁴u²", color: "text-purple-600" }
    ]
  },
  {
    id: 20,
    question: "(-5a¹²b¹⁰c⁸) × (-2a⁷b⁶c⁵def) × 3a⁴b³c²d²e²f² × (-ab) × (-cd) × (-ef) × (-abc) × de",
    steps: [
      { text: "Expression de départ", expr: "(-5a¹²b¹⁰c⁸) × (-2a⁷b⁶c⁵def) × 3a⁴b³c²d²e²f² × (-ab) × (-cd) × (-ef) × (-abc) × de", color: "text-blue-600" },
      { text: "🔥 BEAST SUPRÊME ! 8 termes, 6 variables", expr: "Signes multiples Beast", color: "text-orange-600" },
      { text: "🏆 MAXIMUM BEAST", expr: "+30a²⁵b²⁰c¹⁶d⁴e⁴f³", color: "text-purple-600" }
    ]
  }
]

const beastExercises = [
  // Niveau 1 : DÉMARRAGE BEAST IMMÉDIAT - Puissances + doubles signes !
  {
    id: 1,
    question: "7x² - (-5y²) + 3x² - (-2y²) - (-4x²) + (-9y²)",
    steps: [
      { text: "Expression de départ", expr: "7x² - (-5y²) + 3x² - (-2y²) - (-4x²) + (-9y²)", color: "text-blue-600" },
      { text: "🔥 BEAST MODE : Puissances avec - (-a²) = +a²", expr: "7x² + 5y² + 3x² + 2y² + 4x² - 9y²", color: "text-orange-600" },
      { text: "Regrouper par puissance", expr: "7x² + 3x² + 4x² + 5y² + 2y² - 9y²", color: "text-green-600" },
      { text: "Résultat final", expr: "14x² - 2y²", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "8x³ - (-12y³) + (-5x³) - (-7y³) - (-3x³) + (-4y³)",
    steps: [
      { text: "Expression de départ", expr: "8x³ - (-12y³) + (-5x³) - (-7y³) - (-3x³) + (-4y³)", color: "text-blue-600" },
      { text: "🔥 BEAST : Puissances 3 avec doubles signes", expr: "8x³ + 12y³ - 5x³ + 7y³ + 3x³ - 4y³", color: "text-orange-600" },
      { text: "Regrouper par puissance", expr: "8x³ - 5x³ + 3x³ + 12y³ + 7y³ - 4y³", color: "text-green-600" },
      { text: "Résultat final", expr: "6x³ + 15y³", color: "text-purple-600" }
    ]
  },
  {
    id: 3,
    question: "9xy² - (-6x²y) + (-4xy²) - (-3x²y) - (-2xy²) + (-5x²y)",
    steps: [
      { text: "Expression de départ", expr: "9xy² - (-6x²y) + (-4xy²) - (-3x²y) - (-2xy²) + (-5x²y)", color: "text-blue-600" },
      { text: "🔥 BEAST : Couples de variables avec puissances", expr: "9xy² + 6x²y - 4xy² + 3x²y + 2xy² - 5x²y", color: "text-orange-600" },
      { text: "Regrouper par type", expr: "9xy² - 4xy² + 2xy² + 6x²y + 3x²y - 5x²y", color: "text-green-600" },
      { text: "Résultat final", expr: "7xy² + 4x²y", color: "text-purple-600" }
    ]
  },
  
  // Niveau 2 : TRIPLETS DE VARIABLES + Parenthèses avec puissances BEAST !
  {
    id: 4,
    question: "12xyz - [(-5x²y) - (-3xyz) + (-7x²y)]",
    steps: [
      { text: "Expression de départ", expr: "12xyz - [(-5x²y) - (-3xyz) + (-7x²y)]", color: "text-blue-600" },
      { text: "🔥 Dans crochets : - (-3xyz) = +3xyz", expr: "12xyz - [-5x²y + 3xyz - 7x²y]", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "12xyz - [-12x²y + 3xyz]", color: "text-green-600" },
      { text: "🔥 BEAST : - [-12x²y + 3xyz] = +12x²y - 3xyz", expr: "12xyz + 12x²y - 3xyz", color: "text-red-600" },
      { text: "Résultat final", expr: "9xyz + 12x²y", color: "text-purple-600" }
    ]
  },
  {
    id: 5,
    question: "8x²y² - [(-6xyz) - (-2x²y²) + (-4xyz) - (-3x²y²)]",
    steps: [
      { text: "Expression de départ", expr: "8x²y² - [(-6xyz) - (-2x²y²) + (-4xyz) - (-3x²y²)]", color: "text-blue-600" },
      { text: "🔥 Dans crochets : traiter les doubles signes", expr: "8x²y² - [-6xyz + 2x²y² - 4xyz + 3x²y²]", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "8x²y² - [-10xyz + 5x²y²]", color: "text-green-600" },
      { text: "🔥 BEAST : - [-10xyz + 5x²y²] = +10xyz - 5x²y²", expr: "8x²y² + 10xyz - 5x²y²", color: "text-red-600" },
      { text: "Résultat final", expr: "3x²y² + 10xyz", color: "text-purple-600" }
    ]
  },
  
  // Niveau 3 : ESCALADE BRUTALE - Puissances élevées + quadruplets de variables !
  {
    id: 6,
    question: "-(-3x⁴) + (-7x⁴) - (-5x⁴) + (-9x⁴) - (-2x⁴)",
    steps: [
      { text: "Expression de départ", expr: "-(-3x⁴) + (-7x⁴) - (-5x⁴) + (-9x⁴) - (-2x⁴)", color: "text-blue-600" },
      { text: "🔥 BEAST MODE : Puissances 4 avec doubles signes", expr: "+3x⁴ - 7x⁴ + 5x⁴ - 9x⁴ + 2x⁴", color: "text-orange-600" },
      { text: "Calcul des coefficients : 3 - 7 + 5 - 9 + 2", expr: "-6x⁴", color: "text-green-600" },
      { text: "Résultat final", expr: "-6x⁴", color: "text-purple-600" }
    ]
  },
  {
    id: 7,
    question: "-(-8x²y²z) + (-4x²y²z) - (-12x²y²z) + (-6x²y²z) - (-3x²y²z)",
    steps: [
      { text: "Expression de départ", expr: "-(-8x²y²z) + (-4x²y²z) - (-12x²y²z) + (-6x²y²z) - (-3x²y²z)", color: "text-blue-600" },
      { text: "🔥 BEAST : Triplets de variables avec puissances multiples", expr: "+8x²y²z - 4x²y²z + 12x²y²z - 6x²y²z + 3x²y²z", color: "text-orange-600" },
      { text: "Calcul : 8 - 4 + 12 - 6 + 3 = 13", expr: "13x²y²z", color: "text-green-600" },
      { text: "Résultat final", expr: "13x²y²z", color: "text-purple-600" }
    ]
  },
  
  // Niveau 4 : COMPLEXITÉ EXPLOSÉE - Parenthèses avec variables à puissances mixtes BEAST !
  {
    id: 8,
    question: "10x³y² - [(-3x³y²) - (-7xy⁴) + (-2x³y²)] + (-5xy⁴)",
    steps: [
      { text: "Expression de départ", expr: "10x³y² - [(-3x³y²) - (-7xy⁴) + (-2x³y²)] + (-5xy⁴)", color: "text-blue-600" },
      { text: "🔥 Dans crochets : - (-7xy⁴) = +7xy⁴", expr: "10x³y² - [-3x³y² + 7xy⁴ - 2x³y²] - 5xy⁴", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "10x³y² - [-5x³y² + 7xy⁴] - 5xy⁴", color: "text-green-600" },
      { text: "🔥 BEAST : - [-5x³y² + 7xy⁴] = +5x³y² - 7xy⁴", expr: "10x³y² + 5x³y² - 7xy⁴ - 5xy⁴", color: "text-red-600" },
      { text: "Résultat final", expr: "15x³y² - 12xy⁴", color: "text-purple-600" }
    ]
  },
  {
    id: 9,
    question: "14x²y³z - [(-6x²y³z) - (-9xyz⁵) + (-4x²y³z)] - (-3xyz⁵)",
    steps: [
      { text: "Expression de départ", expr: "14x²y³z - [(-6x²y³z) - (-9xyz⁵) + (-4x²y³z)] - (-3xyz⁵)", color: "text-blue-600" },
      { text: "🔥 Dans crochets et fin : doubles signes", expr: "14x²y³z - [-6x²y³z + 9xyz⁵ - 4x²y³z] + 3xyz⁵", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "14x²y³z - [-10x²y³z + 9xyz⁵] + 3xyz⁵", color: "text-green-600" },
      { text: "🔥 BEAST : - [-10x²y³z + 9xyz⁵] = +10x²y³z - 9xyz⁵", expr: "14x²y³z + 10x²y³z - 9xyz⁵ + 3xyz⁵", color: "text-red-600" },
      { text: "Résultat final", expr: "24x²y³z - 6xyz⁵", color: "text-purple-600" }
    ]
  },
  
  // Niveau 5 : DOUBLE PARENTHÈSES + Variables à puissances EXTRÊMES !
  {
    id: 10,
    question: "12x⁵y² - (-8) - [(-7x⁵y²) - (-5) + (-3xyz⁶)] + (-11)",
    steps: [
      { text: "Expression de départ", expr: "12x⁵y² - (-8) - [(-7x⁵y²) - (-5) + (-3xyz⁶)] + (-11)", color: "text-blue-600" },
      { text: "🔥 Traiter - (-8) = +8 et dans crochets", expr: "12x⁵y² + 8 - [-7x⁵y² + 5 - 3xyz⁶] - 11", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "12x⁵y² + 8 - [-7x⁵y² + 5 - 3xyz⁶] - 11", color: "text-green-600" },
      { text: "🔥 Distribuer : - [-7x⁵y² + 5 - 3xyz⁶] = +7x⁵y² - 5 + 3xyz⁶", expr: "12x⁵y² + 8 + 7x⁵y² - 5 + 3xyz⁶ - 11", color: "text-red-600" },
      { text: "Regrouper", expr: "19x⁵y² + 3xyz⁶ - 8", color: "text-purple-600" }
    ]
  },
  {
    id: 11,
    question: "9y - (-6) + [(-4y) + (-12) - (-5y)] - (-9)",
    steps: [
      { text: "Expression de départ", expr: "9y - (-6) + [(-4y) + (-12) - (-5y)] - (-9)", color: "text-blue-600" },
      { text: "🔥 Doubles signes début/fin", expr: "9y + 6 + [-4y - 12 + 5y] + 9", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "9y + 6 + [y - 12] + 9", color: "text-green-600" },
      { text: "Distribuer", expr: "9y + 6 + y - 12 + 9", color: "text-red-600" },
      { text: "Résultat final", expr: "10y + 3", color: "text-purple-600" }
    ]
  },
  
  // Niveau 6 : CHAOS ORGANISÉ - Variables xy, x², nombres, doubles signes
  {
    id: 12,
    question: "15x² - (-3xy) - [(-2x²) + (-5xy) - (-4x²)] + (-7xy)",
    steps: [
      { text: "Expression de départ", expr: "15x² - (-3xy) - [(-2x²) + (-5xy) - (-4x²)] + (-7xy)", color: "text-blue-600" },
      { text: "🔥 Début : - (-3xy) = +3xy", expr: "15x² + 3xy - [-2x² - 5xy + 4x²] - 7xy", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "15x² + 3xy - [2x² - 5xy] - 7xy", color: "text-green-600" },
      { text: "Distribuer", expr: "15x² + 3xy - 2x² + 5xy - 7xy", color: "text-red-600" },
      { text: "Regrouper", expr: "13x² + xy", color: "text-purple-600" }
    ]
  },
  {
    id: 13,
    question: "8xy - (-12) + [(-3xy) - (-7) + (-2xy)] - (-15)",
    steps: [
      { text: "Expression de départ", expr: "8xy - (-12) + [(-3xy) - (-7) + (-2xy)] - (-15)", color: "text-blue-600" },
      { text: "🔥 Doubles signes externes", expr: "8xy + 12 + [-3xy + 7 - 2xy] + 15", color: "text-orange-600" },
      { text: "Simplifier crochets", expr: "8xy + 12 + [-5xy + 7] + 15", color: "text-green-600" },
      { text: "Distribuer", expr: "8xy + 12 - 5xy + 7 + 15", color: "text-red-600" },
      { text: "Résultat final", expr: "3xy + 34", color: "text-purple-600" }
    ]
  },
  
  // Niveau 7 : ENFER ORGANISATIONNEL - Parenthèses imbriquées
  {
    id: 14,
    question: "20x - [(-8x) - ((-3x) + (-5x)) + (-7x)]",
    steps: [
      { text: "Expression de départ", expr: "20x - [(-8x) - ((-3x) + (-5x)) + (-7x)]", color: "text-blue-600" },
      { text: "🔥 Parenthèse interne", expr: "20x - [-8x - (-3x - 5x) - 7x]", color: "text-orange-600" },
      { text: "Simplifier interne", expr: "20x - [-8x - (-8x) - 7x]", color: "text-green-600" },
      { text: "🔥 - (-8x) = +8x", expr: "20x - [-8x + 8x - 7x]", color: "text-red-600" },
      { text: "Simplifier crochets", expr: "20x - [-7x]", color: "text-amber-600" },
      { text: "🔥 - [-7x] = +7x", expr: "20x + 7x", color: "text-indigo-600" },
      { text: "Résultat final", expr: "27x", color: "text-purple-600" }
    ]
  },
  {
    id: 15,
    question: "16a - (-12b) - [(-5a) - ((-8b) + (-3a)) - (-4b)]",
    steps: [
      { text: "Expression de départ", expr: "16a - (-12b) - [(-5a) - ((-8b) + (-3a)) - (-4b)]", color: "text-blue-600" },
      { text: "🔥 Début : - (-12b) = +12b", expr: "16a + 12b - [-5a - (-8b - 3a) + 4b]", color: "text-orange-600" },
      { text: "Parenthèse interne", expr: "16a + 12b - [-5a - (-11b) + 4b]", color: "text-green-600" },
      { text: "🔥 - (-11b) = +11b", expr: "16a + 12b - [-5a + 11b + 4b]", color: "text-red-600" },
      { text: "Simplifier crochets", expr: "16a + 12b - [-5a + 15b]", color: "text-amber-600" },
      { text: "Distribuer", expr: "16a + 12b + 5a - 15b", color: "text-indigo-600" },
      { text: "Résultat final", expr: "21a - 3b", color: "text-purple-600" }
    ]
  },
  
  // Niveau 8 : APOCALYPSE MATHÉMATIQUE - Variables multiples + parenthèses multiples
  {
    id: 16,
    question: "25xy - (-18x) - [(-12xy) + (-7x) - ((-5xy) - (-9x))]",
    steps: [
      { text: "Expression de départ", expr: "25xy - (-18x) - [(-12xy) + (-7x) - ((-5xy) - (-9x))]", color: "text-blue-600" },
      { text: "🔥 - (-18x) = +18x", expr: "25xy + 18x - [-12xy - 7x - (-5xy + 9x)]", color: "text-orange-600" },
      { text: "Parenthèse interne", expr: "25xy + 18x - [-12xy - 7x - (-5xy + 9x)]", color: "text-green-600" },
      { text: "🔥 - (-5xy + 9x) = +5xy - 9x", expr: "25xy + 18x - [-12xy - 7x + 5xy - 9x]", color: "text-red-600" },
      { text: "Simplifier crochets", expr: "25xy + 18x - [-7xy - 16x]", color: "text-amber-600" },
      { text: "🔥 - [-7xy - 16x] = +7xy + 16x", expr: "25xy + 18x + 7xy + 16x", color: "text-indigo-600" },
      { text: "Résultat final", expr: "32xy + 34x", color: "text-purple-600" }
    ]
  },
  
  // Niveau 9 : BOSS FINAL - Maximum de complexité
  {
    id: 17,
    question: "30x - (-25) - [(-15x) - ((-8) + (-12x)) + (-7) - ((-20x) - (-13))]",
    steps: [
      { text: "Expression de départ", expr: "30x - (-25) - [(-15x) - ((-8) + (-12x)) + (-7) - ((-20x) - (-13))]", color: "text-blue-600" },
      { text: "🔥 - (-25) = +25", expr: "30x + 25 - [-15x - (-8 - 12x) - 7 - (-20x + 13)]", color: "text-orange-600" },
      { text: "Parenthèses internes", expr: "30x + 25 - [-15x - (-20x) - 7 - (-7x)]", color: "text-green-600" },
      { text: "🔥 Doubles signes : - (-20x) = +20x, - (-7x) = +7x", expr: "30x + 25 - [-15x + 20x - 7 + 7x]", color: "text-red-600" },
      { text: "Simplifier crochets", expr: "30x + 25 - [12x - 7]", color: "text-amber-600" },
      { text: "Distribuer", expr: "30x + 25 - 12x + 7", color: "text-indigo-600" },
      { text: "Résultat final", expr: "18x + 32", color: "text-purple-600" }
    ]
  },
  
  // Niveau 10 : BEAST ULTIME - Variables xy², x²y, nombres, parenthèses imbriquées
  {
    id: 18,
    question: "40xy² - (-28x²y) - [(-15xy²) - ((-12x²y) + (-8xy²)) - (-25) + ((-18x²y) - (-35))]",
    steps: [
      { text: "Expression de départ", expr: "40xy² - (-28x²y) - [(-15xy²) - ((-12x²y) + (-8xy²)) - (-25) + ((-18x²y) - (-35))]", color: "text-blue-600" },
      { text: "🔥 - (-28x²y) = +28x²y", expr: "40xy² + 28x²y - [-15xy² - (-12x²y - 8xy²) + 25 + (-18x²y + 35)]", color: "text-orange-600" },
      { text: "Parenthèses internes", expr: "40xy² + 28x²y - [-15xy² - (-20x²y) + 25 + (-18x²y + 35)]", color: "text-green-600" },
      { text: "🔥 - (-20x²y) = +20x²y", expr: "40xy² + 28x²y - [-15xy² + 20x²y + 25 - 18x²y + 35]", color: "text-red-600" },
      { text: "Simplifier crochets", expr: "40xy² + 28x²y - [-15xy² + 2x²y + 60]", color: "text-amber-600" },
      { text: "Distribuer", expr: "40xy² + 28x²y + 15xy² - 2x²y - 60", color: "text-indigo-600" },
      { text: "Résultat final", expr: "55xy² + 26x²y - 60", color: "text-purple-600" }
    ]
  }
]

export default function ExpressionsReglesPage() {
  const [mainTab, setMainTab] = useState<'addition' | 'multiplication'>('addition')
  const [subTab, setSubTab] = useState<'cours' | 'exercices'>('cours')
  const [exerciseLevel, setExerciseLevel] = useState<'normal' | 'beast'>('normal')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [solutionStep, setSolutionStep] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // Compteurs de bonnes réponses pour les additions
  const [correctAnswersNormal, setCorrectAnswersNormal] = useState(0)
  const [correctAnswersBeast, setCorrectAnswersBeast] = useState(0)
  const [showIncrement, setShowIncrement] = useState(false)
  
  // Compteurs de bonnes réponses pour les multiplications
  const [correctAnswersMultiNormal, setCorrectAnswersMultiNormal] = useState(0)
  const [correctAnswersMultiBeast, setCorrectAnswersMultiBeast] = useState(0)
  const [showIncrementMulti, setShowIncrementMulti] = useState(false)
  
  // Réinitialiser les compteurs quand on change d'onglet principal
  useEffect(() => {
    if (mainTab === 'addition') {
      resetMultiCounters()
    } else if (mainTab === 'multiplication') {
      resetCounters()
    }
  }, [mainTab])
  
  // États pour l'animation des chats
  const [catAnimationStep, setCatAnimationStep] = useState(0)
  const [catAnimationStepNeg, setCatAnimationStepNeg] = useState(0)
  const [catAnimationStep3, setCatAnimationStep3] = useState(0)
  const [catAnimationStep4, setCatAnimationStep4] = useState(0)
  const [catAnimationStep5, setCatAnimationStep5] = useState(0)
  const [catAnimationStep6, setCatAnimationStep6] = useState(0)
  const [sclStep, setSclStep] = useState(0)
  const [sclAnimating, setSclAnimating] = useState(false)
  const [sclPowerStep, setSclPowerStep] = useState(0)
  const [sclPowerAnimating, setSclPowerAnimating] = useState(false)
  
  // États pour les animations des signes négatifs
  const [negativeStep1, setNegativeStep1] = useState(0)
  const [negativeAnimating1, setNegativeAnimating1] = useState(false)
  const [negativeStep2, setNegativeStep2] = useState(0)
  const [negativeAnimating2, setNegativeAnimating2] = useState(false)
  const [negativeStep3, setNegativeStep3] = useState(0)
  const [negativeAnimating3, setNegativeAnimating3] = useState(false)
  const [negativeStep, setNegativeStep] = useState(0)
  const [negativeAnimating, setNegativeAnimating] = useState(false)
  const [negativeComplexStep, setNegativeComplexStep] = useState(0)
  const [negativeComplexAnimating, setNegativeComplexAnimating] = useState(false)

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
  }

  const resetMultiCounters = () => {
    setCorrectAnswersMultiNormal(0)
    setCorrectAnswersMultiBeast(0)
  }

  const checkAnswer = () => {
    let correctAnswer = ''
    
    // Déterminer la réponse correcte selon le contexte
    if (mainTab === 'addition') {
      if (exerciseLevel === 'normal') {
        correctAnswer = normalExercises[currentExercise].steps[normalExercises[currentExercise].steps.length - 1].expr
      } else if (exerciseLevel === 'beast') {
        correctAnswer = beastExercises[currentExercise].steps[beastExercises[currentExercise].steps.length - 1].expr
      }
    } else if (mainTab === 'multiplication') {
      if (exerciseLevel === 'normal') {
        correctAnswer = normalMultiplicationExercises[currentExercise].steps[normalMultiplicationExercises[currentExercise].steps.length - 1].expr
      } else if (exerciseLevel === 'beast') {
        correctAnswer = beastMultiplicationExercises[currentExercise].steps[beastMultiplicationExercises[currentExercise].steps.length - 1].expr
      }
    }
    
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
    
    console.log('Checking answer:', { normalizedUser, normalizedCorrect, mainTab, exerciseLevel })
    
    if (normalizedUser === normalizedCorrect) {
      setAnswerFeedback('correct')
      
      // Incrémenter le compteur pour les exercices d'addition
      if (mainTab === 'addition') {
        if (exerciseLevel === 'normal') {
          console.log('Incrementing normal counter')
          setCorrectAnswersNormal(prev => {
            console.log('Normal counter before:', prev)
            return prev + 1
          })
        } else if (exerciseLevel === 'beast') {
          console.log('Incrementing beast counter')
          setCorrectAnswersBeast(prev => {
            console.log('Beast counter before:', prev)
            return prev + 1
          })
        }
        
        // Afficher une indication visuelle temporaire
        setShowIncrement(true)
        setTimeout(() => setShowIncrement(false), 2000)
      }
      
      // Incrémenter le compteur pour les exercices de multiplication
      if (mainTab === 'multiplication') {
        if (exerciseLevel === 'normal') {
          console.log('Incrementing multiplication normal counter')
          setCorrectAnswersMultiNormal(prev => {
            console.log('Multi normal counter before:', prev)
            return prev + 1
          })
        } else if (exerciseLevel === 'beast') {
          console.log('Incrementing multiplication beast counter')
          setCorrectAnswersMultiBeast(prev => {
            console.log('Multi beast counter before:', prev)
            return prev + 1
          })
        }
        
        // Afficher une indication visuelle temporaire
        setShowIncrementMulti(true)
        setTimeout(() => setShowIncrementMulti(false), 2000)
      }
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

  const nextStep = () => {
    setCatAnimationStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCatAnimationStep(prev => Math.max(prev - 1, 0));
  };

  const resetStep = () => {
    setCatAnimationStep(0);
  };

  const nextStepNeg = () => {
    setCatAnimationStepNeg(prev => Math.min(prev + 1, 6));
  };

  const prevStepNeg = () => {
    setCatAnimationStepNeg(prev => Math.max(prev - 1, 0));
  };

  const resetStepNeg = () => {
    setCatAnimationStepNeg(0);
  };

  const nextStep3 = () => {
    setCatAnimationStep3(prev => Math.min(prev + 1, 7));
  };

  const prevStep3 = () => {
    setCatAnimationStep3(prev => Math.max(prev - 1, 0));
  };

  const resetStep3 = () => {
    setCatAnimationStep3(0);
  };

  const nextStep4 = () => {
    setCatAnimationStep4(prev => Math.min(prev + 1, 2));
  };

  const prevStep4 = () => {
    setCatAnimationStep4(prev => Math.max(prev - 1, 0));
  };

  const resetStep4 = () => {
    setCatAnimationStep4(0);
  };

  const nextStep5 = () => {
    setCatAnimationStep5(prev => Math.min(prev + 1, 5));
  };

  const prevStep5 = () => {
    setCatAnimationStep5(prev => Math.max(prev - 1, 0));
  };

  const resetStep5 = () => {
    setCatAnimationStep5(0);
  };

  const nextStep6 = () => {
    setCatAnimationStep6(prev => Math.min(prev + 1, 7));
  };

  const prevStep6 = () => {
    setCatAnimationStep6(prev => Math.max(prev - 1, 0));
  };

  const resetStep6 = () => {
    setCatAnimationStep6(0);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/chapitre/4eme-calcul-litteral" 
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour au calcul littéral</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                📐
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Règles de calcul</h1>
                <p className="text-gray-600 text-lg">
                  Addition et multiplication avec les expressions littérales
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-purple-600">12 minutes</div>
              </div>
            </div>

            {/* Tabs principaux - centrés et plus gros */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setMainTab('addition')}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-colors font-semibold text-lg ${
                  mainTab === 'addition'
                    ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                <span className="text-2xl">➕</span>
                <span>Addition</span>
              </button>
              <button
                onClick={() => setMainTab('multiplication')}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-colors font-semibold text-lg ${
                  mainTab === 'multiplication'
                    ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                <span className="text-2xl">✖️</span>
                <span>Multiplication</span>
              </button>
          </div>

            {/* Indicateur de sous-section - centré */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-0.5 bg-purple-300"></div>
                <span className="text-base font-medium text-purple-600">
                  Sections pour {mainTab === 'addition' ? 'Addition' : 'Multiplication'}
                </span>
                <div className="w-6 h-0.5 bg-purple-300"></div>
        </div>

              {/* Tabs secondaires - centrés */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setSubTab('cours')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                    subTab === 'cours'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <BookOpen size={16} />
                  <span>Cours</span>
                </button>
                <button
                  onClick={() => setSubTab('exercices')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                    subTab === 'exercices'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Target size={16} />
                  <span>Exercices</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu Addition - Cours */}
        {mainTab === 'addition' && subTab === 'cours' && (
        <div className="space-y-8">
            {/* Règles de calcul Addition */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
              <h2 className="text-2xl font-bold text-green-800 mb-6">➕ Règle de base</h2>
            
            <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">Règle fondamentale</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-3 rounded-lg border border-green-200">
                          <p className="text-green-700 font-medium mb-1">
                            ✅ On ne peut additionner que des termes strictement identiques
                          </p>
                          <p className="text-green-600 text-sm">
                            Cela signifie : même variable ET même puissance
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-blue-800 font-mono text-lg mb-1">a - (-a) = 2a</p>
                            <p className="text-blue-600 text-sm">Règle : moins par moins fait plus</p>
                          </div>

                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <p className="text-orange-800 font-mono text-lg mb-1">a + a² ne peut pas être simplifié</p>
                            <p className="text-orange-600 text-sm">Puissances différentes : on ne peut pas additionner</p>
                          </div>

                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <p className="text-red-800 font-mono text-lg mb-1">-(a - 3) = -a + 3</p>
                            <p className="text-red-600 text-sm">Un moins devant les parenthèses change les signes (comme si on multipliait par -1)</p>
                          </div>

                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                            <p className="text-purple-800 font-mono text-lg mb-1">2a - (-a) = 2a + a = 3a</p>
                            <p className="text-purple-600 text-sm">Moins par moins fait plus</p>
                          </div>

                          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                            <p className="text-indigo-800 font-mono text-lg mb-1">a + 2a² - 3a + 4a² = -2a + 6a²</p>
                            <p className="text-indigo-600 text-sm">Regrouper les termes de même degré : (a - 3a) + (2a² + 4a²)</p>
                          </div>

                          <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                            <p className="text-teal-800 font-mono text-lg mb-1">xy² + 2xy² = 3xy²</p>
                            <p className="text-teal-600 text-sm">Termes identiques à plusieurs variables : on additionne les coefficients</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animations avec les chats */}
                    <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
                      {/* Colonne 1 : Exemple avec nombres positifs */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-3">📘 Exemple 1 : a - (-a) = 2a</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                              onClick={prevStep}
                              disabled={catAnimationStep === 0}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
                            >
                              ← Précédent
                            </button>
                            <button
                              onClick={nextStep}
                              disabled={catAnimationStep === 3}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                            >
                              Suivant →
                            </button>
                            <button
                              onClick={resetStep}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                              <RotateCcw size={14} />
                              Reset
                            </button>
                          </div>
                        
                          <div className="text-center space-y-4">
                            <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                              {catAnimationStep === 0 && <span>a - (-a)</span>}
                              {catAnimationStep === 1 && <span>a - (-a) = a + a</span>}
                              {catAnimationStep === 2 && <span>a + a = 2a</span>}
                              {catAnimationStep === 3 && <span>a - (-a) = 2a</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep === 0 && 'Expression de départ : a - (-a)'}
                              {catAnimationStep === 1 && 'Règle : moins par moins fait plus'}
                              {catAnimationStep === 2 && 'On obtient : a + a = 2a'}
                              {catAnimationStep === 3 && 'Résultat final : a - (-a) = 2a'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Colonne 2 : Exemple avec x et x² */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3">📗 Exemple 2 : a + a² ne peut pas être simplifié</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                              onClick={prevStepNeg}
                              disabled={catAnimationStepNeg === 0}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
                            >
                              ← Précédent
                            </button>
                            <button
                              onClick={nextStepNeg}
                              disabled={catAnimationStepNeg === 3}
                              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
                            >
                              Suivant →
                            </button>
                            <button
                              onClick={resetStepNeg}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                              <RotateCcw size={14} />
                              Reset
                            </button>
                          </div>
                          
                                                      <div className="text-center space-y-4">
                            <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                              {catAnimationStepNeg === 0 && <span>a + a²</span>}
                              {catAnimationStepNeg === 1 && <span><span className="text-blue-600">a</span> + <span className="text-red-600">a²</span></span>}
                              {catAnimationStepNeg === 2 && <span>🐱 + 🐶</span>}
                              {catAnimationStepNeg === 3 && <span className="text-red-600 font-bold">❌ ON NE PEUT PAS ADDITIONNER !</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStepNeg === 0 && 'Expression de départ : a + a²'}
                              {catAnimationStepNeg === 1 && 'Puissances différentes : a (puissance 1) et a² (puissance 2)'}
                              {catAnimationStepNeg === 2 && 'Comme des animaux différents : 🐱 + 🐶'}
                              {catAnimationStepNeg === 3 && 'Impossible de simplifier ! a + a² reste a + a²'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 3 : Avec b, b² et nombres */}
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-3">📚 Exemple 3 : -(a - 3) = -a + 3</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                              onClick={prevStep3}
                              disabled={catAnimationStep3 === 0}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
                            >
                              ← Précédent
                            </button>
                            <button
                              onClick={nextStep3}
                              disabled={catAnimationStep3 === 4}
                              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300"
                            >
                              Suivant →
                            </button>
                            <button
                              onClick={resetStep3}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                              <RotateCcw size={14} />
                              Reset
                            </button>
                          </div>
                          
                                                      <div className="text-center space-y-4">
                            <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                              {catAnimationStep3 === 0 && <span>-(a - 3)</span>}
                              {catAnimationStep3 === 1 && <span>-(<span className="text-blue-600">a</span> <span className="text-red-600">- 3</span>)</span>}
                              {catAnimationStep3 === 2 && <span><span className="text-blue-600">-a</span> <span className="text-red-600">+ 3</span></span>}
                              {catAnimationStep3 === 3 && <span>-a + 3</span>}
                              {catAnimationStep3 === 4 && <span>-(a - 3) = -a + 3</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep3 === 0 && 'Expression de départ : -(a - 3)'}
                              {catAnimationStep3 === 1 && 'Le moins devant change le signe de ce qu\'il y a à l\'intérieur'}
                              {catAnimationStep3 === 2 && 'a devient -a et -3 devient +3'}
                              {catAnimationStep3 === 3 && 'Résultat : -a + 3'}
                              {catAnimationStep3 === 4 && '✅ Règle : un moins devant la parenthèse change tous les signes'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 4 : Avec coefficients négatifs */}
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-3">📕 Exemple 4 : 2a - (-a) = 3a</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                              onClick={prevStep4}
                              disabled={catAnimationStep4 === 0}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
                            >
                              ← Précédent
                            </button>
                            <button
                              onClick={nextStep4}
                              disabled={catAnimationStep4 === 4}
                              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300"
                            >
                              Suivant →
                            </button>
                            <button
                              onClick={resetStep4}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                              <RotateCcw size={14} />
                              Reset
                            </button>
                          </div>
                          
                          <div className="text-center space-y-4">
                            <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                              {catAnimationStep4 === 0 && <span>2a - (-a)</span>}
                              {catAnimationStep4 === 1 && <span>2a <span className="text-red-600">+ a</span></span>}
                              {catAnimationStep4 === 2 && <span>(2 + 1)a</span>}
                              {catAnimationStep4 === 3 && <span>3a</span>}
                              {catAnimationStep4 === 4 && <span>2a - (-a) = 3a</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep4 === 0 && 'Expression de départ : 2a - (-a)'}
                              {catAnimationStep4 === 1 && 'Moins par moins = plus : - (-a) = +a'}
                              {catAnimationStep4 === 2 && 'On additionne les coefficients : 2 + 1 = 3'}
                              {catAnimationStep4 === 3 && 'Résultat : 3a'}
                              {catAnimationStep4 === 4 && '✅ Règle : moins par moins fait plus !'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 5 : Avec variables composées */}
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h4 className="font-semibold text-pink-800 mb-3">📖 Exemple 5 : a + 2a² - 3a + 4a² = -2a + 6a²</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                              onClick={prevStep5}
                              disabled={catAnimationStep5 === 0}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
                            >
                              ← Précédent
                            </button>
                            <button
                              onClick={nextStep5}
                              disabled={catAnimationStep5 === 5}
                              className="flex items-center gap-2 px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300"
                            >
                              Suivant →
                            </button>
                            <button
                              onClick={resetStep5}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                              <RotateCcw size={14} />
                              Reset
                            </button>
                          </div>
                          
                                                      <div className="text-center space-y-4">
                            <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                              {catAnimationStep5 === 0 && <span>a + 2a² - 3a + 4a²</span>}
                              {catAnimationStep5 === 1 && <span><span className="text-blue-600">a</span> + <span className="text-red-600">2a²</span> <span className="text-blue-600">- 3a</span> + <span className="text-red-600">4a²</span></span>}
                              {catAnimationStep5 === 2 && <span>(a - 3a) + (2a² + 4a²)</span>}
                              {catAnimationStep5 === 3 && <span>-2a + 6a²</span>}
                              {catAnimationStep5 === 4 && <span>6a² - 2a</span>}
                              {catAnimationStep5 === 5 && <span>a + 2a² - 3a + 4a² = 6a² - 2a</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep5 === 0 && 'Expression de départ : a + 2a² - 3a + 4a²'}
                              {catAnimationStep5 === 1 && 'On identifie : a (bleu) et a² (rouge)'}
                              {catAnimationStep5 === 2 && 'On regroupe par degré : (a - 3a) + (2a² + 4a²)'}
                              {catAnimationStep5 === 3 && 'Calculs : 1-3=-2 et 2+4=6'}
                              {catAnimationStep5 === 4 && 'On place généralement les puissances par ordre décroissant'}
                              {catAnimationStep5 === 5 && '✅ Résultat final : 6a² - 2a'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 6 : Avec parenthèses, signes complexes et termes xy² */}
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <h4 className="font-semibold text-teal-800 mb-3">📓 Exemple 6 : 4x + 3xy² - (3 - 7x + 2xy²) + 2x - (-5 + x - xy²)</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <button
                              onClick={prevStep6}
                              disabled={catAnimationStep6 === 0}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300"
                            >
                              ← Précédent
                            </button>
                            <button
                              onClick={nextStep6}
                              disabled={catAnimationStep6 === 8}
                              className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300"
                            >
                              Suivant →
                            </button>
                            <button
                              onClick={resetStep6}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                              <RotateCcw size={14} />
                              Reset
                            </button>
                          </div>
                          
                          <div className="text-center space-y-4">
                            <div className="text-xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                              {catAnimationStep6 === 0 && <span>4x + 3xy² - (3 - 7x + 2xy²) + 2x - (-5 + x - xy²)</span>}
                              {catAnimationStep6 === 1 && <span>4x + 3xy² <span className="text-blue-600">- (3 - 7x + 2xy²)</span> + 2x <span className="text-red-600">- (-5 + x - xy²)</span></span>}
                              {catAnimationStep6 === 2 && <span>4x + 3xy² <span className="text-blue-600">- 3 + 7x - 2xy²</span> + 2x <span className="text-red-600">+ 5 - x + xy²</span></span>}
                              {catAnimationStep6 === 3 && <span>4x + 3xy² - 3 + 7x - 2xy² + 2x + 5 - x + xy²</span>}
                              {catAnimationStep6 === 4 && <span><span className="text-green-600">(4x + 7x + 2x - x)</span> + <span className="text-purple-600">(3xy² - 2xy² + xy²)</span> + <span className="text-orange-600">(-3 + 5)</span></span>}
                              {catAnimationStep6 === 5 && <span><span className="text-green-600">12x</span> + <span className="text-purple-600">2xy²</span> + <span className="text-orange-600">2</span></span>}
                              {catAnimationStep6 === 6 && <span>12x + 2xy² + 2</span>}
                              {catAnimationStep6 === 7 && <span>12x + 2xy² + 2</span>}
                              {catAnimationStep6 === 8 && <span>4x + 3xy² - (3 - 7x + 2xy²) + 2x - (-5 + x - xy²) = 12x + 2xy² + 2</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep6 === 0 && 'Expression avec parenthèses, signes négatifs et termes xy²'}
                              {catAnimationStep6 === 1 && 'On identifie les deux parties : -(3-7x+2xy²) et -(-5+x-xy²)'}
                              {catAnimationStep6 === 2 && 'Changement des signes dans les parenthèses'}
                              {catAnimationStep6 === 3 && 'Expression complète sans parenthèses'}
                              {catAnimationStep6 === 4 && 'On regroupe : termes en x (vert), termes en xy² (violet), et nombres (orange)'}
                              {catAnimationStep6 === 5 && 'Calculs : 4+7+2-1=12, 3-2+1=2, et -3+5=2'}
                              {catAnimationStep6 === 6 && 'Résultat simplifié avec tous les types de termes'}
                              {catAnimationStep6 === 7 && 'Résultat final ordonné'}
                              {catAnimationStep6 === 8 && 'Égalité complète avec le résultat final'}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu Addition - Exercices */}
        {mainTab === 'addition' && subTab === 'exercices' && (
          <div className="space-y-6">
            {/* Sélecteur de niveau */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-800">Exercices - Addition</h2>
                  
                  {/* Compteur de bonnes réponses - Boutons cliquables */}
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
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercices Normaux */}
            {exerciseLevel === 'normal' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-blue-800">
                      Exercice {currentExercise + 1} / {normalExercises.length}
                    </h3>
                    {/* Barre de progression */}
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentExercise(prev => Math.max(prev - 1, 0))
                        resetExercise()
                      }}
                      disabled={currentExercise === 0}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => {
                        setCurrentExercise(prev => Math.min(prev + 1, normalExercises.length - 1))
                        resetExercise()
                      }}
                      disabled={currentExercise === normalExercises.length - 1}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Question avec score intégré */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-blue-800">Simplifier l'expression :</h4>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        🎯 {correctAnswersNormal}/{normalExercises.length}
                      </span>
                    </div>
                    <div className="text-xl font-mono text-blue-900 text-center">
                      {normalExercises[currentExercise].question}
                    </div>
                  </div>

                  {/* Éditeur de réponse */}
                  <MathEditor
                    value={userAnswer}
                    onChange={setUserAnswer}
                    placeholder="Tapez votre réponse ici... (ex: 5x)"
                    onSubmit={checkAnswer}
                    theme="blue"
                  />
                  
                  {/* Reconnaissance vocale */}
                  <div className="border-t border-blue-200 pt-3 mt-3">
                    <VoiceInput
                      onTranscript={(transcript) => setUserAnswer(transcript)}
                      placeholder="Ou dites votre réponse à voix haute..."
                      className="justify-center"
                    />
                  </div>

                  {/* Feedback de réponse */}
                  {showAnswer && (
                    <div className={`p-4 rounded-lg border ${
                      answerFeedback === 'correct' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {answerFeedback === 'correct' ? (
                          <>
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <span className="text-green-800 font-semibold">Correct ! Bonne réponse</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <span className="text-red-800 font-semibold">Incorrect. Essayez encore ou consultez la solution</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Boutons de contrôle */}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {showSolution ? 'Masquer' : 'Voir'} la solution
                    </button>
                    {showSolution && (
                      <button
                        onClick={resetSolutionStep}
                        className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Solution animée */}
                  {showSolution && (
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-4">Solution étape par étape :</h4>
                      <div className="space-y-4">
                        {normalExercises[currentExercise].steps.map((step, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border ${
                              index <= solutionStep
                                ? 'bg-white border-green-300 opacity-100'
                                : 'bg-gray-50 border-gray-200 opacity-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-1">{step.text}</p>
                                <div className={`text-xl font-mono ${step.color}`}>
                                  {step.expr}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-3 justify-center mt-6">
                        <button
                          onClick={prevSolutionStep}
                          disabled={solutionStep === 0}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={nextSolutionStep}
                          disabled={solutionStep >= normalExercises[currentExercise].steps.length - 1}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentExercise(prev => Math.max(prev - 1, 0))
                        resetExercise()
                      }}
                      disabled={currentExercise === 0}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => {
                        setCurrentExercise(prev => Math.min(prev + 1, beastExercises.length - 1))
                        resetExercise()
                      }}
                      disabled={currentExercise === beastExercises.length - 1}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      Suivant
                    </button>
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
                      {beastExercises[currentExercise].question}
                    </div>
                  </div>

                  {/* Éditeur de réponse Beast Mode */}
                  <MathEditor
                    value={userAnswer}
                    onChange={setUserAnswer}
                    placeholder="Défi difficile ! Tapez votre réponse..."
                    onSubmit={checkAnswer}
                    theme="red"
                  />
                  
                  {/* Reconnaissance vocale Beast Mode */}
                  <div className="border-t border-red-200 pt-3 mt-3">
                    <VoiceInput
                      onTranscript={(transcript) => setUserAnswer(transcript)}
                      placeholder="Mode Beast : dites votre réponse hardcore..."
                      className="justify-center"
                    />
                  </div>

                  {/* Feedback de réponse */}
                  {showAnswer && (
                    <div className={`p-4 rounded-lg border ${
                      answerFeedback === 'correct' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        {answerFeedback === 'correct' ? (
                          <>
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <span className="text-green-800 font-semibold">Correct ! Bonne réponse</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✗</span>
                            </div>
                            <span className="text-red-800 font-semibold">Incorrect. Essayez encore ou consultez la solution</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Boutons de contrôle */}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {showSolution ? 'Masquer' : 'Voir'} la solution
                    </button>
                    {showSolution && (
                      <button
                        onClick={resetSolutionStep}
                        className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Solution animée */}
                  {showSolution && (
                    <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-4">Solution étape par étape :</h4>
                      <div className="space-y-4">
                        {beastExercises[currentExercise].steps.map((step, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border ${
                              index <= solutionStep
                                ? 'bg-white border-red-300 opacity-100'
                                : 'bg-gray-50 border-gray-200 opacity-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-1">{step.text}</p>
                                <div className={`text-xl font-mono ${step.color}`}>
                                  {step.expr}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-3 justify-center mt-6">
                        <button
                          onClick={prevSolutionStep}
                          disabled={solutionStep === 0}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={nextSolutionStep}
                          disabled={solutionStep >= beastExercises[currentExercise].steps.length - 1}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contenu Multiplication - Cours */}
        {mainTab === 'multiplication' && subTab === 'cours' && (
          <div className="space-y-8">
            {/* Règles de calcul Multiplication */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-800 mb-6">✖️ Règle de base</h2>
              
              {/* Toutes les règles regroupées */}
              <div className="bg-white rounded-lg p-6 border border-orange-100 mb-6">
                <h4 className="font-semibold text-orange-800 mb-4 text-center">🧠 À retenir absolument</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* Règles de signes */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                    <div className="text-lg font-bold text-red-700 mb-2">(-) × (+) = (-)</div>
                    <div className="text-sm text-red-600">Exemple :</div>
                    <div className="font-mono text-red-800">-3x × 2y = -6xy</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                    <div className="text-lg font-bold text-green-700 mb-2">(+) × (-) = (-)</div>
                    <div className="text-sm text-green-600">Exemple :</div>
                    <div className="font-mono text-green-800">2x × (-3y) = -6xy</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                    <div className="text-lg font-bold text-blue-700 mb-2">(-) × (-) = (+)</div>
                    <div className="text-sm text-blue-600">Exemple :</div>
                    <div className="font-mono text-blue-800">-3x × (-2y) = +6xy</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                    <div className="text-lg font-bold text-purple-700 mb-2">(+) × (+) = (+)</div>
                    <div className="text-sm text-purple-600">Exemple :</div>
                    <div className="font-mono text-purple-800">3x × 2y = +6xy</div>
                  </div>
                  
                  {/* Règles avec puissances */}
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 text-center">
                    <div className="text-lg font-bold text-teal-700 mb-2">x³ × x² = x⁵</div>
                    <div className="text-sm text-teal-600">On additionne les puissances</div>
                    <div className="font-mono text-teal-800 text-xs">3 + 2 = 5</div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-center">
                    <div className="text-lg font-bold text-indigo-700 mb-2">-2x³ × 2x² = -4x⁵</div>
                    <div className="text-sm text-indigo-600">Signes + coefficients + puissances</div>
                    <div className="font-mono text-indigo-800 text-xs">(-2) × 2 = -4, x³⁺² = x⁵</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                    <div className="text-lg font-bold text-amber-700 mb-2">3x × 4x² = 12x³</div>
                    <div className="text-sm text-amber-600">Cas général</div>
                    <div className="font-mono text-amber-800 text-xs">3 × 4 = 12, x¹⁺² = x³</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-orange-100">
                  <div className="space-y-6">
                    {/* Méthode SCL Animée */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">🔑 Méthode SCL - La clé de voûte</h3>
                      
                      <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
                        <p className="text-blue-700 font-medium text-center text-lg">
                          <strong className="text-red-700">S</strong><span className="text-red-700">ignes</span> → <strong className="text-green-700">C</strong><span className="text-green-700">hiffres</span> → <strong className="text-purple-700">L</strong><span className="text-purple-700">ettres</span>
                  </p>
                </div>

                      {/* Animation SCL avec puissances */}
                      <div className="bg-white rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <h4 className="text-lg font-semibold text-blue-800">
                            Animation : -2x³ × 2x² = -4x⁵
                          </h4>
                          <button
                            onClick={() => {
                              setSclStep(0)
                              setSclAnimating(true)
                              setTimeout(() => setSclStep(1), 2000)
                              setTimeout(() => setSclStep(2), 4000)
                              setTimeout(() => setSclStep(3), 6000)
                              setTimeout(() => setSclStep(4), 8000)
                              setTimeout(() => setSclStep(5), 10000)
                              setTimeout(() => setSclStep(6), 12000)
                              setTimeout(() => setSclAnimating(false), 13000)
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            {sclAnimating ? 'Animation en cours...' : 'Démarrer l\'animation'}
                          </button>
              </div>

                        <div className="space-y-6 relative min-h-[450px]">
                          {/* Expression de départ */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="font-mono text-lg text-center text-gray-800 relative">
                              {/* Expression statique qui reste visible en haut */}
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                                <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">-2x³ × 2x²</span>
                              </div>
                              
                              {/* Éléments qui glissent */}
                              <span id="sign-minus" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 1 ? 'transform translate-x-[-10rem] translate-y-20 text-red-900 scale-150 opacity-100' : 'opacity-0'
                              }`}>-</span>
                              <span id="number-2-left" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 2 ? 'transform translate-x-[-12rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                              }`}>2</span>
                              <span id="letters-x3" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 3 ? 'transform translate-x-[-15rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                              }`}>x³</span>
                              <span className={`mx-2 transition-opacity duration-1000 ${sclStep >= 1 ? 'opacity-30' : 'opacity-100'} ${sclStep >= 3 ? 'opacity-0' : ''}`}>×</span>
                              <span id="sign-plus" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 1 ? 'transform translate-x-[-8rem] translate-y-20 text-red-700 scale-120 opacity-100' : 'opacity-0'
                              }`}>+</span>
                              <span id="number-2-right" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 2 ? 'transform translate-x-[-10rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                              }`}>2</span>
                              <span id="letters-x2" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 3 ? 'transform translate-x-[-13rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                              }`}>x²</span>
                            </div>
                            
                            {/* Calculs qui apparaissent quand les éléments glissent */}
                            {sclStep >= 1 && (
                              <div className="absolute top-28 left-1/2 transform -translate-x-8">
                                <span className="text-red-600 font-bold text-2xl">(-) × (+) = <span className="bg-red-50 px-2 py-1 rounded-lg border-2 border-red-200">-</span></span>
                              </div>
                            )}
                            {sclStep >= 2 && (
                              <div className="absolute top-48 left-1/2 transform -translate-x-6">
                                <span className="text-green-600 font-bold text-2xl">2 × 2 = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">4</span></span>
                              </div>
                            )}
                            {sclStep >= 3 && (
                              <div className="absolute top-64 left-1/2 transform -translate-x-12">
                                <span className="text-purple-600 font-bold text-2xl">x³ × x² = <span className="bg-purple-50 px-2 py-1 rounded-lg border-2 border-purple-200">x⁵</span></span>
                              </div>
                            )}
                            {sclStep >= 4 && (
                              <div className="absolute top-80 left-1/2 transform -translate-x-10">
                                <span className="text-blue-600 font-bold text-xl">Puissances : 3 + 2 = <span className="bg-blue-50 px-2 py-1 rounded-lg border-2 border-blue-200">5</span></span>
                              </div>
                            )}
                            
                            {/* Résultat final */}
                            {sclStep >= 6 && (
                              <div className="absolute top-96 left-1/2 transform -translate-x-1/2">
                                <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : -4x⁵</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Règles avec signes négatifs - INTÉGRÉES DANS RÈGLES DE BASE */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border border-red-200">
              <h2 className="text-2xl font-bold text-red-800 mb-6">⚠️ Règles avec signes négatifs</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-6 text-lg">🔥 Multiplications avec moins (-)</h4>
                  
                  {/* Animation 1 : -a × a = -a² */}
                  <div className="bg-white rounded-lg p-6 border border-red-200 mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h4 className="text-lg font-semibold text-red-800">
                        Animation 1 : -a × a = -a²
                      </h4>
                      <button
                        onClick={() => {
                          setNegativeStep1(0)
                          setNegativeAnimating1(true)
                          setTimeout(() => setNegativeStep1(1), 1500)
                          setTimeout(() => setNegativeStep1(2), 3000)
                          setTimeout(() => setNegativeStep1(3), 4500)
                          setTimeout(() => setNegativeStep1(4), 6000)
                          setTimeout(() => setNegativeAnimating1(false), 7000)
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                      >
                        {negativeAnimating1 ? 'Animation en cours...' : 'Démarrer l\'animation'}
                      </button>
                    </div>

                    <div className="space-y-6 relative min-h-[300px]">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="font-mono text-lg text-center text-gray-800 relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                            <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">-a × a</span>
                          </div>
                          
                          <span className={`inline-block ${
                            negativeStep1 >= 1 ? 'text-red-600 opacity-100' : 'opacity-0'
                          }`}>-</span>
                          <span className={`inline-block ${
                            negativeStep1 >= 2 ? 'text-blue-600 opacity-100' : 'opacity-0'
                          }`}>a</span>
                          <span className={`mx-2 ${negativeStep1 >= 1 ? 'opacity-30' : 'opacity-100'} ${negativeStep1 >= 2 ? 'opacity-0' : ''}`}>×</span>
                          <span className={`inline-block ${
                            negativeStep1 >= 1 ? 'text-green-600 opacity-100' : 'opacity-0'
                          }`}>+</span>
                          <span className={`inline-block ${
                            negativeStep1 >= 2 ? 'text-blue-600 opacity-100' : 'opacity-0'
                          }`}>a</span>
                        </div>
                        
                        {negativeStep1 >= 2 && (
                          <div className="absolute top-20 left-1/2 transform -translate-x-8">
                            <span className="text-red-600 font-bold text-2xl">(-) × (+) = <span className="bg-red-50 px-2 py-1 rounded-lg border-2 border-red-200">(-)</span></span>
                          </div>
                        )}
                        {negativeStep1 >= 3 && (
                          <div className="absolute top-36 left-1/2 transform -translate-x-6">
                            <span className="text-blue-600 font-bold text-2xl">a × a = <span className="bg-blue-50 px-2 py-1 rounded-lg border-2 border-blue-200">a²</span></span>
                          </div>
                        )}
                        {negativeStep1 >= 4 && (
                          <div className="absolute top-52 left-1/2 transform -translate-x-6">
                            <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : -a²</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Animation 2 : -a × -a² = +a³ */}
                  <div className="bg-white rounded-lg p-6 border border-green-200 mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h4 className="text-lg font-semibold text-green-800">
                        Animation 2 : -a × -a² = +a³
                      </h4>
                      <button
                        onClick={() => {
                          setNegativeStep2(0)
                          setNegativeAnimating2(true)
                          setTimeout(() => setNegativeStep2(1), 1500)
                          setTimeout(() => setNegativeStep2(2), 3000)
                          setTimeout(() => setNegativeStep2(3), 4500)
                          setTimeout(() => setNegativeStep2(4), 6000)
                          setTimeout(() => setNegativeAnimating2(false), 7000)
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                      >
                        {negativeAnimating2 ? 'Animation en cours...' : 'Démarrer l\'animation'}
                      </button>
                    </div>

                    <div className="space-y-6 relative min-h-[300px]">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="font-mono text-lg text-center text-gray-800 relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                            <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">-a × -a²</span>
                          </div>
                          
                          <span className={`inline-block ${
                            negativeStep2 >= 1 ? 'text-red-600 opacity-100' : 'opacity-0'
                          }`}>-</span>
                          <span className={`inline-block ${
                            negativeStep2 >= 2 ? 'text-blue-600 opacity-100' : 'opacity-0'
                          }`}>a</span>
                          <span className={`mx-2 ${negativeStep2 >= 1 ? 'opacity-30' : 'opacity-100'} ${negativeStep2 >= 2 ? 'opacity-0' : ''}`}>×</span>
                          <span className={`inline-block ${
                            negativeStep2 >= 1 ? 'text-red-600 opacity-100' : 'opacity-0'
                          }`}>-</span>
                          <span className={`inline-block ${
                            negativeStep2 >= 2 ? 'text-blue-600 opacity-100' : 'opacity-0'
                          }`}>a²</span>
                        </div>
                        
                        {negativeStep2 >= 2 && (
                          <div className="absolute top-20 left-1/2 transform -translate-x-8">
                            <span className="text-green-600 font-bold text-2xl">(-) × (-) = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">(+)</span></span>
                          </div>
                        )}
                        {negativeStep2 >= 3 && (
                          <div className="absolute top-36 left-1/2 transform -translate-x-6">
                            <span className="text-blue-600 font-bold text-2xl">a × a² = <span className="bg-blue-50 px-2 py-1 rounded-lg border-2 border-blue-200">a³</span></span>
                          </div>
                        )}
                        {negativeStep2 >= 4 && (
                          <div className="absolute top-52 left-1/2 transform -translate-x-6">
                            <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : +a³</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Animation 3 : -3xy × -2x²z = +6x³yz */}
                  <div className="bg-white rounded-lg p-6 border border-orange-200 mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h4 className="text-lg font-semibold text-orange-800">
                        Animation 3 : -3xy × -2x²z = +6x³yz
                      </h4>
                      <button
                        onClick={() => {
                          setNegativeStep3(0)
                          setNegativeAnimating3(true)
                          setTimeout(() => setNegativeStep3(1), 1500)
                          setTimeout(() => setNegativeStep3(2), 3000)
                          setTimeout(() => setNegativeStep3(3), 4500)
                          setTimeout(() => setNegativeStep3(4), 6000)
                          setTimeout(() => setNegativeStep3(5), 7500)
                          setTimeout(() => setNegativeAnimating3(false), 9000)
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
                      >
                        {negativeAnimating3 ? 'Animation en cours...' : 'Démarrer l\'animation'}
                      </button>
                    </div>

                    <div className="space-y-6 relative min-h-[400px]">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="font-mono text-lg text-center text-gray-800 relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                            <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">-3xy × -2x²z</span>
                          </div>
                          
                          <span className={`inline-block ${
                            negativeStep3 >= 1 ? 'text-red-600 opacity-100' : 'opacity-0'
                          }`}>-</span>
                          <span className={`inline-block ${
                            negativeStep3 >= 2 ? 'text-green-600 opacity-100' : 'opacity-0'
                          }`}>3</span>
                          <span className={`inline-block ${
                            negativeStep3 >= 3 ? 'text-purple-600 opacity-100' : 'opacity-0'
                          }`}>xy</span>
                          <span className={`mx-2 ${negativeStep3 >= 1 ? 'opacity-30' : 'opacity-100'} ${negativeStep3 >= 3 ? 'opacity-0' : ''}`}>×</span>
                          <span className={`inline-block ${
                            negativeStep3 >= 1 ? 'text-red-600 opacity-100' : 'opacity-0'
                          }`}>-</span>
                          <span className={`inline-block ${
                            negativeStep3 >= 2 ? 'text-green-600 opacity-100' : 'opacity-0'
                          }`}>2</span>
                          <span className={`inline-block ${
                            negativeStep3 >= 3 ? 'text-purple-600 opacity-100' : 'opacity-0'
                          }`}>x²z</span>
                        </div>
                        
                        {negativeStep3 >= 2 && (
                          <div className="absolute top-20 left-1/2 transform -translate-x-8">
                            <span className="text-red-600 font-bold text-xl">(-) × (-) = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">(+)</span></span>
                          </div>
                        )}
                        {negativeStep3 >= 3 && (
                          <div className="absolute top-40 left-1/2 transform -translate-x-8">
                            <span className="text-green-600 font-bold text-xl">3 × 2 = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">6</span></span>
                          </div>
                        )}
                        {negativeStep3 >= 4 && (
                          <div className="absolute top-56 left-1/2 transform -translate-x-10">
                            <span className="text-purple-600 font-bold text-xl">xy × x²z = <span className="bg-purple-50 px-2 py-1 rounded-lg border-2 border-purple-200">x³yz</span></span>
                          </div>
                        )}
                        {negativeStep3 >= 5 && (
                          <div className="absolute top-72 left-1/2 transform -translate-x-8">
                            <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : +6x³yz</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Règle de mémorisation */}
                  <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-300">
                    <h5 className="font-semibold text-gray-800 mb-2 text-center">🧠 À retenir absolument</h5>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-bold text-red-700">(-) × (+) = (-)</p>
                      <p className="text-lg font-bold text-green-700">(+) × (-) = (-)</p>
                      <p className="text-lg font-bold text-blue-700">(-) × (-) = (+)</p>
                      <p className="text-lg font-bold text-purple-700">(+) × (+) = (+)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation SCL avec Puissances */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">🔥 Méthode SCL avec Puissances</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <div className="space-y-6">
                    <div className="bg-purple-100 p-4 rounded-lg border border-purple-200 mb-6">
                      <p className="text-purple-700 font-medium text-center text-lg">
                        <strong className="text-red-700">S</strong><span className="text-red-700">ignes</span> → <strong className="text-green-700">C</strong><span className="text-green-700">hiffres</span> → <strong className="text-purple-700">L</strong><span className="text-purple-700">ettres avec puissances</span>
                  </p>
                </div>

                    {/* Animation SCL Puissances */}
                    <div className="bg-white rounded-lg p-6 border border-purple-200">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <h4 className="text-lg font-semibold text-purple-800">
                          Animation : 4x × 5x
                        </h4>
                        <button
                          onClick={() => {
                            setSclPowerStep(0)
                            setSclPowerAnimating(true)
                            setTimeout(() => setSclPowerStep(1), 2000)
                            setTimeout(() => setSclPowerStep(2), 5000)
                            setTimeout(() => setSclPowerStep(3), 8000)
                            setTimeout(() => setSclPowerStep(4), 12000)
                            setTimeout(() => setSclPowerAnimating(false), 13000)
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                        >
                          {sclPowerAnimating ? 'Animation en cours...' : 'Démarrer l\'animation'}
                        </button>
              </div>
                      
                      <div className="space-y-6 relative min-h-[450px]">
                        {/* Expression de départ */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="font-mono text-lg text-center text-gray-800 relative">
                            {/* Expression statique qui reste visible en haut */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                              <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">4x × 5x</span>
            </div>
                            
                            {/* Éléments qui apparaissent */}
                            <span id="plus-sign-power" className={`inline-block ${
                              sclPowerStep >= 1 ? 'text-red-900 opacity-100' : 'opacity-0'
                            }`}>+</span>
                            <span id="number-4-power" className={`inline-block ${
                              sclPowerStep >= 2 ? 'text-green-600 opacity-100' : 'opacity-0'
                            }`}>4</span>
                            <span id="letters-x-power" className={`inline-block ${
                              sclPowerStep >= 3 ? 'text-purple-600 opacity-100' : 'opacity-0'
                            }`}>x</span>
                            <span className={`mx-2 text-gray-800 ${sclPowerStep >= 1 ? 'opacity-30' : 'opacity-100'} ${sclPowerStep >= 3 ? 'opacity-0' : ''}`}>×</span>
                            <span id="plus-sign-power2" className={`inline-block ${
                              sclPowerStep >= 1 ? 'text-red-700 opacity-100' : 'opacity-0'
                            }`}>+</span>
                            <span id="number-5-power" className={`inline-block ${
                              sclPowerStep >= 2 ? 'text-green-600 opacity-100' : 'opacity-0'
                            }`}>5</span>
                            <span id="letters-x2-power" className={`inline-block ${
                              sclPowerStep >= 3 ? 'text-purple-600 opacity-100' : 'opacity-0'
                            }`}>x</span>
          </div>

                        {/* Calculs qui apparaissent quand les éléments glissent */}
                        {sclPowerStep >= 2 && (
                          <div className="absolute top-32 left-1/2 transform -translate-x-4">
                            <span className="text-green-600 font-bold text-3xl">+ × + = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">+</span></span>
                          </div>
                        )}
                        {sclPowerStep >= 3 && (
                          <div className="absolute top-48 left-1/2 transform -translate-x-4">
                            <span className="text-green-600 font-bold text-3xl">4 × 5 = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">20</span></span>
                          </div>
                        )}
                        {sclPowerStep >= 4 && (
                          <div className="absolute top-64 left-1/2 transform -translate-x-4">
                            <span className="text-purple-600 font-bold text-3xl">x × x = <span className="bg-purple-50 px-2 py-1 rounded-lg border-2 border-purple-200">x²</span></span>
                          </div>
                        )}
                        
                        {/* Résultat final */}
                        {sclPowerStep >= 4 && (
                          <div className="absolute top-80 left-1/2 transform -translate-x-3/4">
                            <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : 20x²</span>
                          </div>
                        )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* Contenu Multiplication - Exercices */}
        {mainTab === 'multiplication' && subTab === 'exercices' && (
          <div className="space-y-6">
            {/* Sélecteur de niveau */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-800">Exercices - Multiplication</h2>
                  
                  {/* Compteur de bonnes réponses - Boutons cliquables */}
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
                      Normal: {correctAnswersMultiNormal}/{normalMultiplicationExercises.length}
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
                      Beast: {correctAnswersMultiBeast}/{beastMultiplicationExercises.length}
                    </button>
                    {showIncrementMulti && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-bold animate-pulse">
                        <span className="text-lg">✅</span>
                        +1 !
                      </div>
                    )}
                    
                    {/* Bouton de réinitialisation des compteurs */}
                    <button
                      onClick={resetMultiCounters}
                      className="px-3 py-2 rounded-lg font-medium transition-colors bg-gray-500 text-white hover:bg-gray-600"
                      title="Réinitialiser les compteurs"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercices Normaux */}
            {exerciseLevel === 'normal' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-blue-800">
                      Exercice {currentExercise + 1} / {normalMultiplicationExercises.length}
                </h3>
                    {/* Barre de progression */}
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentExercise + 1) / normalMultiplicationExercises.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {Math.round(((currentExercise + 1) / normalMultiplicationExercises.length) * 100)}%
                      </span>
                    </div>
                  </div>
                <div className="flex gap-2">
                  <button
                      onClick={() => {
                        setCurrentExercise(prev => Math.max(prev - 1, 0))
                        resetExercise()
                      }}
                    disabled={currentExercise === 0}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                      Précédent
                  </button>
                  <button
                      onClick={() => {
                        setCurrentExercise(prev => Math.min(prev + 1, normalMultiplicationExercises.length - 1))
                        resetExercise()
                      }}
                      disabled={currentExercise === normalMultiplicationExercises.length - 1}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      Suivant
                  </button>
                </div>
              </div>

                {(() => {
                  const exercises = normalMultiplicationExercises
                  const currentEx = exercises[currentExercise]
                
                return (
                  <div className="space-y-6">
                    {/* Question avec score intégré */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-amber-800">Question :</h4>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          🎯 {correctAnswersMultiNormal}/{normalMultiplicationExercises.length}
                        </span>
                      </div>
                      <div className="text-2xl font-mono text-center bg-white p-4 rounded-lg border border-amber-300 text-gray-900">
                        {currentEx.question}
                      </div>
                    </div>

                    {/* Éditeur de réponse mathématique Multiplication */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-orange-800 mb-4 text-lg">✖️ Votre réponse (Multiplication) :</h4>
                      <MathEditor
                        value={userAnswer}
                        onChange={setUserAnswer}
                        placeholder="Multipliez et simplifiez... (ex: 6x²)"
                        onSubmit={checkAnswer}
                        theme="orange"
                      />
                      
                      {/* Reconnaissance vocale Multiplication */}
                      <div className="border-t border-orange-200 pt-3 mt-3">
                        <VoiceInput
                          onTranscript={(transcript) => setUserAnswer(transcript)}
                          placeholder="Ou dites votre multiplication à voix haute..."
                          className="justify-center"
                        />
                      </div>
                    </div>
                    
                    {/* Feedback de réponse */}
                    {showAnswer && (
                      <div className={`p-4 rounded-lg border ${
                        answerFeedback === 'correct' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          {answerFeedback === 'correct' ? (
                            <>
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">✓</span>
                              </div>
                              <span className="text-green-800 font-semibold">Correct ! Bonne réponse</span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">✗</span>
                              </div>
                              <span className="text-red-800 font-semibold">Incorrect. Essayez encore ou consultez la solution</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Calculator size={16} />
                        {showSolution ? 'Masquer' : 'Voir'} la solution
                      </button>
                      
                      <button
                        onClick={resetExercise}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <RotateCcw size={16} />
                        Recommencer
                      </button>
                    </div>

                    {/* Solution */}
                    {showSolution && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                        <h4 className="text-lg font-semibold text-green-800 mb-4">Solution :</h4>
                
                <div className="space-y-3">
                          {currentEx.steps.map((step, index) => {
                            const stepColors = [
                              'border-blue-300 bg-blue-50',
                              'border-orange-300 bg-orange-50', 
                              'border-green-300 bg-green-50',
                              'border-purple-300 bg-purple-50',
                              'border-red-300 bg-red-50',
                              'border-indigo-300 bg-indigo-50',
                              'border-amber-300 bg-amber-50'
                            ]
                            const isActive = index === solutionStep
                            const stepColor = stepColors[index % stepColors.length]
                            
                            return (
                    <div
                      key={index}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                                  isActive 
                                    ? `${stepColor} shadow-lg transform scale-105` 
                                    : 'bg-white border-gray-200 opacity-70'
                                }`}
                              >
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                  isActive 
                                    ? index === 0 ? 'bg-blue-600' :
                                      index === 1 ? 'bg-orange-600' :
                                      index === 2 ? 'bg-green-600' :
                                      index === 3 ? 'bg-purple-600' :
                                      index === 4 ? 'bg-red-600' :
                                      index === 5 ? 'bg-indigo-600' :
                                      'bg-amber-600'
                                    : 'bg-gray-400'
                                }`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <span className={`text-sm font-medium block mb-1 ${
                                    isActive ? 'text-gray-800' : 'text-gray-500'
                                  }`}>
                                    {step.text}
                                  </span>
                                  <span className={`text-lg font-mono ${step.color} ${
                                    isActive ? '' : 'opacity-60'
                                  }`}>
                        {step.expr}
                                  </span>
                    </div>
                              </div>
                            )
                          })}
                </div>

                        {/* Contrôles étapes */}
                        <div className="flex justify-center gap-3 mt-6">
                  <button
                            onClick={prevSolutionStep}
                            disabled={solutionStep === 0}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ← Précédent
                  </button>
                          
                  <button
                            onClick={nextSolutionStep}
                            disabled={solutionStep >= currentEx.steps.length - 1}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Suivant →
                  </button>
                          
                          <button
                            onClick={resetSolutionStep}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Navigation exercices */}
                    <div className="flex justify-center gap-4 pt-6">
                      {currentExercise > 0 && (
                        <button
                          onClick={() => {
                            setCurrentExercise(currentExercise - 1)
                            resetExercise()
                          }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          ← Exercice précédent
                        </button>
                      )}
                      
                      {currentExercise < exercises.length - 1 && (
                        <button
                          onClick={() => {
                            setCurrentExercise(currentExercise + 1)
                            resetExercise()
                          }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          Exercice suivant →
                        </button>
                      )}
                    </div>
                  </div>
                )
              })()}
              </div>
            )}

            {/* Exercices Beast Mode */}
            {exerciseLevel === 'beast' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-red-800">
                      Exercice {currentExercise + 1} / {beastMultiplicationExercises.length}
                    </h3>
                    {/* Barre de progression */}
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentExercise + 1) / beastMultiplicationExercises.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {Math.round(((currentExercise + 1) / beastMultiplicationExercises.length) * 100)}%
                      </span>
                    </div>
                  </div>
                                     <div className="flex gap-2">
                     <button
                       onClick={() => {
                         setCurrentExercise(prev => Math.max(prev - 1, 0))
                         resetExercise()
                       }}
                       disabled={currentExercise === 0}
                       className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                     >
                       Précédent
                     </button>
                     <button
                       onClick={() => {
                         setCurrentExercise(prev => Math.min(prev + 1, beastMultiplicationExercises.length - 1))
                         resetExercise()
                       }}
                       disabled={currentExercise === beastMultiplicationExercises.length - 1}
                       className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                     >
                       Suivant
                     </button>
                   </div>
                </div>

                {(() => {
                  const exercises = beastMultiplicationExercises
                  const currentEx = exercises[currentExercise]
                  
                  return (
                                         <div className="space-y-6">
                       {/* Question Beast Mode avec score intégré */}
                       <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                         <div className="flex items-center justify-between mb-4">
                           <h4 className="text-lg font-semibold text-red-800">🔥 Défi Beast Mode :</h4>
                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                             🔥 {correctAnswersMultiBeast}/{beastMultiplicationExercises.length}
                           </span>
                         </div>
                         <div className="text-2xl font-mono text-center bg-white p-4 rounded-lg border border-red-300 text-gray-900">
                           {currentEx.question}
                         </div>
                       </div>

                      {/* Éditeur de réponse mathématique Beast Mode */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-red-800 mb-4 text-lg">🔥 Votre réponse (Beast Mode) :</h4>
                        <MathEditor
                          value={userAnswer}
                          onChange={setUserAnswer}
                          placeholder="Multipliez et simplifiez... (ex: 6x²)"
                          onSubmit={checkAnswer}
                          theme="red"
                        />
                        
                        {/* Reconnaissance vocale Beast Mode */}
                        <div className="border-t border-red-200 pt-3 mt-3">
                          <VoiceInput
                            onTranscript={(transcript) => setUserAnswer(transcript)}
                            placeholder="Mode Beast : dites votre réponse hardcore..."
                            className="justify-center"
                          />
                        </div>
                      </div>
                      
                      {/* Feedback de réponse */}
                      {showAnswer && (
                        <div className={`p-4 rounded-lg border ${
                          answerFeedback === 'correct' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {answerFeedback === 'correct' ? (
                              <>
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">✓</span>
                                </div>
                                <span className="text-green-800 font-semibold">Correct ! Bonne réponse</span>
                              </>
                            ) : (
                              <>
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">✗</span>
                                </div>
                                <span className="text-red-800 font-semibold">Incorrect. Essayez encore ou consultez la solution</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Boutons d'action */}
                      <div className="flex flex-wrap gap-3 justify-center">
                        <button
                          onClick={() => setShowSolution(!showSolution)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Calculator size={16} />
                          {showSolution ? 'Masquer' : 'Voir'} la solution
                        </button>
                        
                  <button
                    onClick={resetExercise}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Recommencer
                  </button>
                </div>

                      {/* Solution */}
                      {showSolution && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                          <h4 className="text-lg font-semibold text-green-800 mb-4">Solution :</h4>
                          
                          <div className="space-y-3">
                            {currentEx.steps.map((step, index) => {
                              const stepColors = [
                                'border-blue-300 bg-blue-50',
                                'border-orange-300 bg-orange-50',
                                'border-green-300 bg-green-50',
                                'border-purple-300 bg-purple-50',
                                'border-pink-300 bg-pink-50'
                              ]
                              
                              return (
                                <div key={index} className={`p-4 rounded-lg border ${stepColors[index % stepColors.length]}`}>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 border-2 border-gray-300">
                                      {index + 1}
              </div>
                                    <div>
                                      <div className="font-medium text-gray-700">{step.text}</div>
                                      <div className={`text-xl font-mono mt-1 ${step.color}`}>{step.expr}</div>
            </div>
          </div>
        </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between items-center pt-4">
                        {currentExercise > 0 && (
                          <button
                            onClick={() => {
                              setCurrentExercise(currentExercise - 1)
                              resetExercise()
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            ← Exercice précédent
                          </button>
                        )}
                        {currentExercise < beastMultiplicationExercises.length - 1 && (
                          <button
                            onClick={() => {
                              setCurrentExercise(currentExercise + 1)
                              resetExercise()
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-auto"
                          >
                            Exercice suivant →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 