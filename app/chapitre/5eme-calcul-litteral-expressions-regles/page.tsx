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
    question: "5a - 3a + 2a - 8a + 4a",
    steps: [
      { text: "Expression de départ", expr: "5a - 3a + 2a - 8a + 4a", color: "text-blue-600" },
      { text: "Résultat final", expr: "0a = 0", color: "text-purple-600" }
    ]
  },
  
  // Niveau 3 : Expressions avec différentes variables
  {
    id: 6,
    question: "3x + 2y - x + 5y",
    steps: [
      { text: "Expression de départ", expr: "3x + 2y - x + 5y", color: "text-blue-600" },
      { text: "Séparer les variables", expr: "3x - x + 2y + 5y", color: "text-orange-600" },
      { text: "Résultat final", expr: "2x + 7y", color: "text-purple-600" }
    ]
  },
  {
    id: 7,
    question: "6a - 4b + 2a - 3b - 9a + 7b",
    steps: [
      { text: "Expression de départ", expr: "6a - 4b + 2a - 3b - 9a + 7b", color: "text-blue-600" },
      { text: "Séparer les variables", expr: "6a + 2a - 9a - 4b - 3b + 7b", color: "text-orange-600" },
      { text: "Résultat final", expr: "-a + 0b = -a", color: "text-purple-600" }
    ]
  },
  
  // Niveau 4 : Expressions avec nombres et variables
  {
    id: 8,
    question: "2x + 5 + 3x - 2",
    steps: [
      { text: "Expression de départ", expr: "2x + 5 + 3x - 2", color: "text-blue-600" },
      { text: "Séparer variables et nombres", expr: "2x + 3x + 5 - 2", color: "text-orange-600" },
      { text: "Résultat final", expr: "5x + 3", color: "text-purple-600" }
    ]
  },
  {
    id: 9,
    question: "3y - 8 + 2y - 5 + 4y",
    steps: [
      { text: "Expression de départ", expr: "3y - 8 + 2y - 5 + 4y", color: "text-blue-600" },
      { text: "Séparer variables et nombres", expr: "3y + 2y + 4y - 8 - 5", color: "text-orange-600" },
      { text: "Résultat final", expr: "9y - 13", color: "text-purple-600" }
    ]
  },
  {
    id: 10,
    question: "4a - 7 + 2a - 9a + 6",
    steps: [
      { text: "Expression de départ", expr: "4a - 7 + 2a - 9a + 6", color: "text-blue-600" },
      { text: "Séparer variables et nombres", expr: "4a + 2a - 9a - 7 + 6", color: "text-orange-600" },
      { text: "Résultat final", expr: "-3a - 1", color: "text-purple-600" }
    ]
  },
  
  // Niveau 5 : Expressions complexes avec plusieurs variables et nombres
  {
    id: 11,
    question: "3x - 5y + 7 - 2x + 8y - 12",
    steps: [
      { text: "Expression de départ", expr: "3x - 5y + 7 - 2x + 8y - 12", color: "text-blue-600" },
      { text: "Séparer par type", expr: "3x - 2x - 5y + 8y + 7 - 12", color: "text-orange-600" },
      { text: "Résultat final", expr: "x + 3y - 5", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "2a - 6b + 5 - 4a + 3b - 9 + a",
    steps: [
      { text: "Expression de départ", expr: "2a - 6b + 5 - 4a + 3b - 9 + a", color: "text-blue-600" },
      { text: "Séparer par type", expr: "2a - 4a + a - 6b + 3b + 5 - 9", color: "text-orange-600" },
      { text: "a = 1a (coefficient implicite)", expr: "2a - 4a + 1a - 6b + 3b + 5 - 9", color: "text-green-600" },
      { text: "Résultat final", expr: "-a - 3b - 4", color: "text-purple-600" }
    ]
  },
  
  // Niveau 6 : Expressions avec plusieurs variables (xy, x²y, xy²)
  {
    id: 13,
    question: "3xy + 2x²y - 5xy + 4x²y - xy + 7",
    steps: [
      { text: "Expression de départ", expr: "3xy + 2x²y - 5xy + 4x²y - xy + 7", color: "text-blue-600" },
      { text: "Séparer les termes semblables", expr: "3xy - 5xy - xy + 2x²y + 4x²y + 7", color: "text-orange-600" },
      { text: "xy = 1xy (coefficient implicite)", expr: "3xy - 5xy - 1xy + 2x²y + 4x²y + 7", color: "text-green-600" },
      { text: "Résultat final", expr: "-3xy + 6x²y + 7", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "2xy² - 4x²y + 3xy² + 5x²y - 6xy² + 2x²y - 1",
    steps: [
      { text: "Expression de départ", expr: "2xy² - 4x²y + 3xy² + 5x²y - 6xy² + 2x²y - 1", color: "text-blue-600" },
      { text: "Séparer les termes semblables", expr: "2xy² + 3xy² - 6xy² - 4x²y + 5x²y + 2x²y - 1", color: "text-orange-600" },
      { text: "Résultat final", expr: "-xy² + 3x²y - 1", color: "text-purple-600" }
    ]
  },
  {
    id: 15,
    question: "5xy - 2x²y + 3xy² - 7xy + 4x²y - 8xy² + 2xy + 10",
    steps: [
      { text: "Expression de départ", expr: "5xy - 2x²y + 3xy² - 7xy + 4x²y - 8xy² + 2xy + 10", color: "text-blue-600" },
      { text: "Séparer les termes semblables", expr: "5xy - 7xy + 2xy - 2x²y + 4x²y + 3xy² - 8xy² + 10", color: "text-orange-600" },
      { text: "Résultat final", expr: "0xy + 2x²y - 5xy² + 10 = 2x²y - 5xy² + 10", color: "text-purple-600" }
    ]
  },
  
  // Niveau 7 : Moins devant parenthèses avec plusieurs variables
  {
    id: 16,
    question: "3xy - (2xy + 4xy) + 5xy",
    steps: [
      { text: "Expression de départ", expr: "3xy - (2xy + 4xy) + 5xy", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "3xy - (6xy) + 5xy", color: "text-orange-600" },
      { text: "Moins devant parenthèse", expr: "3xy - 6xy + 5xy", color: "text-green-600" },
      { text: "Résultat final", expr: "2xy", color: "text-purple-600" }
    ]
  },
  {
    id: 17,
    question: "2x²y - (3x²y - 5x²y) + 4x²y",
    steps: [
      { text: "Expression de départ", expr: "2x²y - (3x²y - 5x²y) + 4x²y", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "2x²y - (-2x²y) + 4x²y", color: "text-orange-600" },
      { text: "Moins devant parenthèse", expr: "2x²y + 2x²y + 4x²y", color: "text-green-600" },
      { text: "Résultat final", expr: "8x²y", color: "text-purple-600" }
    ]
  },
  
  // Niveau 8 : Parenthèses avec plusieurs types (x et nombre)
  {
    id: 18,
    question: "4x - (2x + 3) + 7x - 5",
    steps: [
      { text: "Expression de départ", expr: "4x - (2x + 3) + 7x - 5", color: "text-blue-600" },
      { text: "Moins devant parenthèse change les signes", expr: "4x - 2x - 3 + 7x - 5", color: "text-orange-600" },
      { text: "Séparer variables et nombres", expr: "4x - 2x + 7x - 3 - 5", color: "text-green-600" },
      { text: "Résultat final", expr: "9x - 8", color: "text-purple-600" }
    ]
  },
  {
    id: 19,
    question: "6xy - (3xy - 2) + 4xy + 8",
    steps: [
      { text: "Expression de départ", expr: "6xy - (3xy - 2) + 4xy + 8", color: "text-blue-600" },
      { text: "Moins devant parenthèse change les signes", expr: "6xy - 3xy + 2 + 4xy + 8", color: "text-orange-600" },
      { text: "Séparer variables et nombres", expr: "6xy - 3xy + 4xy + 2 + 8", color: "text-green-600" },
      { text: "Résultat final", expr: "7xy + 10", color: "text-purple-600" }
    ]
  },
  
  // Niveau 9 : Parenthèses avec 3 membres (x, x² et nombre)
  {
    id: 20,
    question: "5x - (2x² - 3x + 4) + 3x² - 1",
    steps: [
      { text: "Expression de départ", expr: "5x - (2x² - 3x + 4) + 3x² - 1", color: "text-blue-600" },
      { text: "Moins devant parenthèse change les signes", expr: "5x - 2x² + 3x - 4 + 3x² - 1", color: "text-orange-600" },
      { text: "Séparer par type", expr: "5x + 3x - 2x² + 3x² - 4 - 1", color: "text-green-600" },
      { text: "Résultat final", expr: "8x + x² - 5", color: "text-purple-600" }
    ]
  }
]

// Données des exercices de multiplication
const normalMultiplicationExercises = [
  // Progression rapide - Concept 1 : Multiplication simple
  {
    id: 1,
    question: "3 × x",
    steps: [
      { text: "Expression de départ", expr: "3 × x", color: "text-blue-600" },
      { text: "On écrit le coefficient devant la variable", expr: "3x", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "x × y",
    steps: [
      { text: "Expression de départ", expr: "x × y", color: "text-blue-600" },
      { text: "On écrit les variables côte à côte", expr: "xy", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 2 : Avec coefficients
  {
    id: 3,
    question: "2x × 3",
    steps: [
      { text: "Expression de départ", expr: "2x × 3", color: "text-blue-600" },
      { text: "On multiplie les coefficients", expr: "6x", color: "text-purple-600" }
    ]
  },
  {
    id: 4,
    question: "3x × 2y",
    steps: [
      { text: "Expression de départ", expr: "3x × 2y", color: "text-blue-600" },
      { text: "Coefficients : 3 × 2 = 6", expr: "6 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "6xy", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 3 : Variables identiques
  {
    id: 5,
    question: "x × x",
    steps: [
      { text: "Expression de départ", expr: "x × x", color: "text-blue-600" },
      { text: "Variable identique = puissance", expr: "x²", color: "text-purple-600" }
    ]
  },
  {
    id: 6,
    question: "2x × 3x",
    steps: [
      { text: "Expression de départ", expr: "2x × 3x", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × x × x", color: "text-orange-600" },
      { text: "Variables identiques", expr: "6x²", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 4 : Coefficients positifs
  {
    id: 7,
    question: "3 × x",
    steps: [
      { text: "Expression de départ", expr: "3 × x", color: "text-blue-600" },
      { text: "Coefficient devant la variable", expr: "3x", color: "text-purple-600" }
    ]
  },
  {
    id: 8,
    question: "2x × 3",
    steps: [
      { text: "Expression de départ", expr: "2x × 3", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6x", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 5 : Variables identiques simples
  {
    id: 9,
    question: "x × x",
    steps: [
      { text: "Expression de départ", expr: "x × x", color: "text-blue-600" },
      { text: "Variables identiques", expr: "x²", color: "text-purple-600" }
    ]
  },
  {
    id: 10,
    question: "4a × 5",
    steps: [
      { text: "Expression de départ", expr: "4a × 5", color: "text-blue-600" },
      { text: "Coefficients : 4 × 5 = 20", expr: "20a", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 6 : Variables multiples
  {
    id: 11,
    question: "xy × x",
    steps: [
      { text: "Expression de départ", expr: "xy × x", color: "text-blue-600" },
      { text: "On regroupe les x", expr: "x × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "x²y", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "3x × 2y",
    steps: [
      { text: "Expression de départ", expr: "3x × 2y", color: "text-blue-600" },
      { text: "Coefficients : 3 × 2 = 6", expr: "6 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "6xy", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 7 : Variables identiques avec coefficients
  {
    id: 13,
    question: "2x × 3x",
    steps: [
      { text: "Expression de départ", expr: "2x × 3x", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × x × x", color: "text-orange-600" },
      { text: "Variables identiques", expr: "6x²", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "4x × 5x",
    steps: [
      { text: "Expression de départ", expr: "4x × 5x", color: "text-blue-600" },
      { text: "Coefficients : 4 × 5 = 20", expr: "20 × x × x", color: "text-orange-600" },
      { text: "Variables identiques", expr: "20x²", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 8 : Variables multiples avancées
  {
    id: 15,
    question: "2xy × 3x",
    steps: [
      { text: "Expression de départ", expr: "2xy × 3x", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × xy × x", color: "text-orange-600" },
      { text: "Regrouper les x", expr: "6x²y", color: "text-purple-600" }
    ]
  },
  {
    id: 16,
    question: "3xy × 2x",
    steps: [
      { text: "Expression de départ", expr: "3xy × 2x", color: "text-blue-600" },
      { text: "Coefficients : 3 × 2 = 6", expr: "6 × xy × x", color: "text-orange-600" },
      { text: "Regrouper les x", expr: "6x²y", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 9 : Variables mixtes
  {
    id: 17,
    question: "3x × 2y",
    steps: [
      { text: "Expression de départ", expr: "3x × 2y", color: "text-blue-600" },
      { text: "Coefficients : 3 × 2 = 6", expr: "6 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "6xy", color: "text-purple-600" }
    ]
  },
  {
    id: 18,
    question: "4x × 2y",
    steps: [
      { text: "Expression de départ", expr: "4x × 2y", color: "text-blue-600" },
      { text: "Coefficients : 4 × 2 = 8", expr: "8 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "8xy", color: "text-purple-600" }
    ]
  },
  
  // Progression rapide - Concept 10 : Variables multiples avec x²
  {
    id: 19,
    question: "2x × 3y",
    steps: [
      { text: "Expression de départ", expr: "2x × 3y", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "6xy", color: "text-purple-600" }
    ]
  },
  {
    id: 20,
    question: "5x × 2y",
    steps: [
      { text: "Expression de départ", expr: "5x × 2y", color: "text-blue-600" },
      { text: "Coefficients : 5 × 2 = 10", expr: "10 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "10xy", color: "text-purple-600" }
    ]
  }
]

const beastMultiplicationExercises = [
  // Beast Mode - Progression ultra-rapide - Multiplication simple uniquement
  {
    id: 1,
    question: "3xy × 2x",
    steps: [
      { text: "Expression de départ", expr: "3xy × 2x", color: "text-blue-600" },
      { text: "Coefficients : 3 × 2 = 6", expr: "6 × xy × x", color: "text-orange-600" },
      { text: "Résultat final", expr: "6x²y", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "4xy × 3y",
    steps: [
      { text: "Expression de départ", expr: "4xy × 3y", color: "text-blue-600" },
      { text: "Coefficients : 4 × 3 = 12", expr: "12 × xy × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "12xy²", color: "text-purple-600" }
    ]
  },
  {
    id: 3,
    question: "5x × 2y",
    steps: [
      { text: "Expression de départ", expr: "5x × 2y", color: "text-blue-600" },
      { text: "Coefficients : 5 × 2 = 10", expr: "10 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "10xy", color: "text-purple-600" }
    ]
  },
  {
    id: 4,
    question: "6x × 3x",
    steps: [
      { text: "Expression de départ", expr: "6x × 3x", color: "text-blue-600" },
      { text: "Coefficients : 6 × 3 = 18", expr: "18 × x × x", color: "text-orange-600" },
      { text: "Résultat final", expr: "18x²", color: "text-purple-600" }
    ]
  },
  {
    id: 5,
    question: "7xy × 2x",
    steps: [
      { text: "Expression de départ", expr: "7xy × 2x", color: "text-blue-600" },
      { text: "Coefficients : 7 × 2 = 14", expr: "14 × xy × x", color: "text-orange-600" },
      { text: "Résultat final", expr: "14x²y", color: "text-purple-600" }
    ]
  },
  {
    id: 6,
    question: "8x × 3y",
    steps: [
      { text: "Expression de départ", expr: "8x × 3y", color: "text-blue-600" },
      { text: "Coefficients : 8 × 3 = 24", expr: "24 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "24xy", color: "text-purple-600" }
    ]
  },
  {
    id: 7,
    question: "9xy × 2y",
    steps: [
      { text: "Expression de départ", expr: "9xy × 2y", color: "text-blue-600" },
      { text: "Coefficients : 9 × 2 = 18", expr: "18 × xy × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "18xy²", color: "text-purple-600" }
    ]
  },
  {
    id: 8,
    question: "4x × 5x",
    steps: [
      { text: "Expression de départ", expr: "4x × 5x", color: "text-blue-600" },
      { text: "Coefficients : 4 × 5 = 20", expr: "20 × x × x", color: "text-orange-600" },
      { text: "Résultat final", expr: "20x²", color: "text-purple-600" }
    ]
  },
  {
    id: 9,
    question: "6xy × 3x",
    steps: [
      { text: "Expression de départ", expr: "6xy × 3x", color: "text-blue-600" },
      { text: "Coefficients : 6 × 3 = 18", expr: "18 × xy × x", color: "text-orange-600" },
      { text: "Résultat final", expr: "18x²y", color: "text-purple-600" }
    ]
  },
  {
    id: 10,
    question: "7x × 2y",
    steps: [
      { text: "Expression de départ", expr: "7x × 2y", color: "text-blue-600" },
      { text: "Coefficients : 7 × 2 = 14", expr: "14 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "14xy", color: "text-purple-600" }
    ]
  },
  
  // Niveau 2 : Introduction de 3 lettres (x, y, z)
  {
    id: 11,
    question: "2xyz × 3x",
    steps: [
      { text: "Expression de départ", expr: "2xyz × 3x", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × xyz × x", color: "text-orange-600" },
      { text: "Résultat final", expr: "6x²yz", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "4xy × 5z",
    steps: [
      { text: "Expression de départ", expr: "4xy × 5z", color: "text-blue-600" },
      { text: "Coefficients : 4 × 5 = 20", expr: "20 × xy × z", color: "text-orange-600" },
      { text: "Résultat final", expr: "20xyz", color: "text-purple-600" }
    ]
  },
  {
    id: 13,
    question: "6xyz × 2y",
    steps: [
      { text: "Expression de départ", expr: "6xyz × 2y", color: "text-blue-600" },
      { text: "Coefficients : 6 × 2 = 12", expr: "12 × xyz × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "12xy²z", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "3xz × 4yz",
    steps: [
      { text: "Expression de départ", expr: "3xz × 4yz", color: "text-blue-600" },
      { text: "Coefficients : 3 × 4 = 12", expr: "12 × xz × yz", color: "text-orange-600" },
      { text: "Résultat final", expr: "12xyz²", color: "text-purple-600" }
    ]
  },
  {
    id: 15,
    question: "5xy × 2xz",
    steps: [
      { text: "Expression de départ", expr: "5xy × 2xz", color: "text-blue-600" },
      { text: "Coefficients : 5 × 2 = 10", expr: "10 × xy × xz", color: "text-orange-600" },
      { text: "Résultat final", expr: "10x²yz", color: "text-purple-600" }
    ]
  },
  
  // Niveau 3 : Expressions plus complexes avec 3 lettres
  {
    id: 16,
    question: "8xyz × 3z",
    steps: [
      { text: "Expression de départ", expr: "8xyz × 3z", color: "text-blue-600" },
      { text: "Coefficients : 8 × 3 = 24", expr: "24 × xyz × z", color: "text-orange-600" },
      { text: "Résultat final", expr: "24xyz²", color: "text-purple-600" }
    ]
  },
  {
    id: 17,
    question: "7yz × 2xyz",
    steps: [
      { text: "Expression de départ", expr: "7yz × 2xyz", color: "text-blue-600" },
      { text: "Coefficients : 7 × 2 = 14", expr: "14 × yz × xyz", color: "text-orange-600" },
      { text: "Résultat final", expr: "14xy²z²", color: "text-purple-600" }
    ]
  },
  {
    id: 18,
    question: "9x × 4xyz",
    steps: [
      { text: "Expression de départ", expr: "9x × 4xyz", color: "text-blue-600" },
      { text: "Coefficients : 9 × 4 = 36", expr: "36 × x × xyz", color: "text-orange-600" },
      { text: "Résultat final", expr: "36x²yz", color: "text-purple-600" }
    ]
  },
  {
    id: 19,
    question: "6xz × 5yz",
    steps: [
      { text: "Expression de départ", expr: "6xz × 5yz", color: "text-blue-600" },
      { text: "Coefficients : 6 × 5 = 30", expr: "30 × xz × yz", color: "text-orange-600" },
      { text: "Résultat final", expr: "30xyz²", color: "text-purple-600" }
    ]
  },
  {
    id: 20,
    question: "10xyz × 2xyz",
    steps: [
      { text: "Expression de départ", expr: "10xyz × 2xyz", color: "text-blue-600" },
      { text: "Coefficients : 10 × 2 = 20", expr: "20 × xyz × xyz", color: "text-orange-600" },
      { text: "Résultat final", expr: "20x²y²z²", color: "text-purple-600" }
    ]
  }
]

const beastExercises = [
  // Niveau 1 : Expressions longues avec plusieurs variables
  {
    id: 1,
    question: "7x - 5y + 3x - 2y + 4x - 9y",
    steps: [
      { text: "Expression de départ", expr: "7x - 5y + 3x - 2y + 4x - 9y", color: "text-blue-600" },
      { text: "Séparer par variable", expr: "7x + 3x + 4x - 5y - 2y - 9y", color: "text-orange-600" },
      { text: "Résultat final", expr: "14x - 16y", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "8a - 12b + 5a - 7b + 3a - 4b",
    steps: [
      { text: "Expression de départ", expr: "8a - 12b + 5a - 7b + 3a - 4b", color: "text-blue-600" },
      { text: "Séparer par variable", expr: "8a + 5a + 3a - 12b - 7b - 4b", color: "text-orange-600" },
      { text: "Résultat final", expr: "16a - 23b", color: "text-purple-600" }
    ]
  },
  {
    id: 3,
    question: "9xy - 6x + 4xy - 3x + 2xy - 5x",
    steps: [
      { text: "Expression de départ", expr: "9xy - 6x + 4xy - 3x + 2xy - 5x", color: "text-blue-600" },
      { text: "Séparer par type", expr: "9xy + 4xy + 2xy - 6x - 3x - 5x", color: "text-orange-600" },
      { text: "Résultat final", expr: "15xy - 14x", color: "text-purple-600" }
    ]
  },
  
  // Niveau 2 : Parenthèses négatives
  {
    id: 4,
    question: "12x - (5x - 3x + 7x)",
    steps: [
      { text: "Expression de départ", expr: "12x - (5x - 3x + 7x)", color: "text-blue-600" },
      { text: "Simplifier dans la parenthèse", expr: "12x - (9x)", color: "text-orange-600" },
      { text: "Résultat final", expr: "3x", color: "text-purple-600" }
    ]
  },
  {
    id: 5,
    question: "8y - (6y - 2y + 4y - 3y)",
    steps: [
      { text: "Expression de départ", expr: "8y - (6y - 2y + 4y - 3y)", color: "text-blue-600" },
      { text: "Simplifier dans la parenthèse", expr: "8y - (5y)", color: "text-orange-600" },
      { text: "Résultat final", expr: "3y", color: "text-purple-600" }
    ]
  },
  {
    id: 6,
    question: "15a - (8a - 4a + 6a - 2a)",
    steps: [
      { text: "Expression de départ", expr: "15a - (8a - 4a + 6a - 2a)", color: "text-blue-600" },
      { text: "Simplifier dans la parenthèse", expr: "15a - (8a)", color: "text-orange-600" },
      { text: "Résultat final", expr: "7a", color: "text-purple-600" }
    ]
  },
  
  // Niveau 3 : Expressions avec termes négatifs
  {
    id: 7,
    question: "-3x + 7x - 5x + 9x - 2x",
    steps: [
      { text: "Expression de départ", expr: "-3x + 7x - 5x + 9x - 2x", color: "text-blue-600" },
      { text: "Calcul des coefficients", expr: "-3 + 7 - 5 + 9 - 2 = 6", color: "text-orange-600" },
      { text: "Résultat final", expr: "6x", color: "text-purple-600" }
    ]
  },
  {
    id: 8,
    question: "-8y + 4y - 6y + 11y - 3y",
    steps: [
      { text: "Expression de départ", expr: "-8y + 4y - 6y + 11y - 3y", color: "text-blue-600" },
      { text: "Calcul des coefficients", expr: "-8 + 4 - 6 + 11 - 3 = -2", color: "text-orange-600" },
      { text: "Résultat final", expr: "-2y", color: "text-purple-600" }
    ]
  },
  {
    id: 9,
    question: "-5ab + 8ab - 12ab + 6ab - 3ab",
    steps: [
      { text: "Expression de départ", expr: "-5ab + 8ab - 12ab + 6ab - 3ab", color: "text-blue-600" },
      { text: "Calcul des coefficients", expr: "-5 + 8 - 12 + 6 - 3 = -6", color: "text-orange-600" },
      { text: "Résultat final", expr: "-6ab", color: "text-purple-600" }
    ]
  },
  
  // Niveau 4 : Parenthèses avec plusieurs termes
  {
    id: 10,
    question: "10x - (3x - 7x + 2x) + 5x",
    steps: [
      { text: "Expression de départ", expr: "10x - (3x - 7x + 2x) + 5x", color: "text-blue-600" },
      { text: "Simplifier dans la parenthèse", expr: "10x - (-2x) + 5x", color: "text-orange-600" },
      { text: "Moins devant parenthèse", expr: "10x + 2x + 5x", color: "text-green-600" },
      { text: "Résultat final", expr: "17x", color: "text-purple-600" }
    ]
  },
  {
    id: 11,
    question: "14y - (6y - 9y + 4y) - 3y",
    steps: [
      { text: "Expression de départ", expr: "14y - (6y - 9y + 4y) - 3y", color: "text-blue-600" },
      { text: "Simplifier dans la parenthèse", expr: "14y - (y) - 3y", color: "text-orange-600" },
      { text: "Résultat final", expr: "10y", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "18z - (5z - 8z + 7z) + 2z",
    steps: [
      { text: "Expression de départ", expr: "18z - (5z - 8z + 7z) + 2z", color: "text-blue-600" },
      { text: "Simplifier dans la parenthèse", expr: "18z - (4z) + 2z", color: "text-orange-600" },
      { text: "Résultat final", expr: "16z", color: "text-purple-600" }
    ]
  },
  
  // Niveau 5 : Mélange variables et nombres
  {
    id: 13,
    question: "12x + 8 - 7x - 5 + 3x - 11",
    steps: [
      { text: "Expression de départ", expr: "12x + 8 - 7x - 5 + 3x - 11", color: "text-blue-600" },
      { text: "Séparer variables et nombres", expr: "12x - 7x + 3x + 8 - 5 - 11", color: "text-orange-600" },
      { text: "Résultat final", expr: "8x - 8", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "9y - 6 + 4y + 12 - 5y - 9",
    steps: [
      { text: "Expression de départ", expr: "9y - 6 + 4y + 12 - 5y - 9", color: "text-blue-600" },
      { text: "Séparer variables et nombres", expr: "9y + 4y - 5y - 6 + 12 - 9", color: "text-orange-600" },
      { text: "Résultat final", expr: "8y - 3", color: "text-purple-600" }
    ]
  },
  {
    id: 15,
    question: "15a - 12 + 3a - 7 + 6a + 4",
    steps: [
      { text: "Expression de départ", expr: "15a - 12 + 3a - 7 + 6a + 4", color: "text-blue-600" },
      { text: "Séparer variables et nombres", expr: "15a + 3a + 6a - 12 - 7 + 4", color: "text-orange-600" },
      { text: "Résultat final", expr: "24a - 15", color: "text-purple-600" }
    ]
  },
  
  // Niveau 6 : Expressions complexes avec parenthèses
  {
    id: 16,
    question: "20x - (8x - 3x + 5x) - (4x - 7x)",
    steps: [
      { text: "Expression de départ", expr: "20x - (8x - 3x + 5x) - (4x - 7x)", color: "text-blue-600" },
      { text: "Simplifier les parenthèses", expr: "20x - (10x) - (-3x)", color: "text-orange-600" },
      { text: "Appliquer les signes", expr: "20x - 10x + 3x", color: "text-green-600" },
      { text: "Résultat final", expr: "13x", color: "text-purple-600" }
    ]
  },
  {
    id: 17,
    question: "16y - (9y - 4y + 2y) + (7y - 11y)",
    steps: [
      { text: "Expression de départ", expr: "16y - (9y - 4y + 2y) + (7y - 11y)", color: "text-blue-600" },
      { text: "Simplifier les parenthèses", expr: "16y - (7y) + (-4y)", color: "text-orange-600" },
      { text: "Appliquer les signes", expr: "16y - 7y - 4y", color: "text-green-600" },
      { text: "Résultat final", expr: "5y", color: "text-purple-600" }
    ]
  },
  {
    id: 18,
    question: "25z - (12z - 6z + 3z) - (8z - 15z)",
    steps: [
      { text: "Expression de départ", expr: "25z - (12z - 6z + 3z) - (8z - 15z)", color: "text-blue-600" },
      { text: "Simplifier les parenthèses", expr: "25z - (9z) - (-7z)", color: "text-orange-600" },
      { text: "Appliquer les signes", expr: "25z - 9z + 7z", color: "text-green-600" },
      { text: "Résultat final", expr: "23z", color: "text-purple-600" }
    ]
  },
  
  // Niveau 7 : Plusieurs variables et parenthèses
  {
    id: 19,
    question: "8x - 5y - (3x - 2y) + 6x - (4y - x)",
    steps: [
      { text: "Expression de départ", expr: "8x - 5y - (3x - 2y) + 6x - (4y - x)", color: "text-blue-600" },
      { text: "Distribuer les signes", expr: "8x - 5y - 3x + 2y + 6x - 4y + x", color: "text-orange-600" },
      { text: "Séparer par variable", expr: "8x - 3x + 6x + x - 5y + 2y - 4y", color: "text-green-600" },
      { text: "Résultat final", expr: "12x - 7y", color: "text-purple-600" }
    ]
  },
  {
    id: 20,
    question: "12a - 8b - (5a - 3b) + 7a - (6b - 2a)",
    steps: [
      { text: "Expression de départ", expr: "12a - 8b - (5a - 3b) + 7a - (6b - 2a)", color: "text-blue-600" },
      { text: "Distribuer les signes", expr: "12a - 8b - 5a + 3b + 7a - 6b + 2a", color: "text-orange-600" },
      { text: "Séparer par variable", expr: "12a - 5a + 7a + 2a - 8b + 3b - 6b", color: "text-green-600" },
      { text: "Résultat final", expr: "16a - 11b", color: "text-purple-600" }
    ]
  },
  
  // Niveau 8 : Expressions très complexes
  {
    id: 21,
    question: "30x - 15y - (12x - 8y + 5x) + (7y - 9x)",
    steps: [
      { text: "Expression de départ", expr: "30x - 15y - (12x - 8y + 5x) + (7y - 9x)", color: "text-blue-600" },
      { text: "Simplifier les parenthèses", expr: "30x - 15y - (17x - 8y) + (7y - 9x)", color: "text-orange-600" },
      { text: "Distribuer les signes", expr: "30x - 15y - 17x + 8y + 7y - 9x", color: "text-green-600" },
      { text: "Séparer par variable", expr: "30x - 17x - 9x - 15y + 8y + 7y", color: "text-red-600" },
      { text: "Résultat final", expr: "4x + 0y = 4x", color: "text-purple-600" }
    ]
  },
  {
    id: 22,
    question: "45a - 20b - (18a - 12b + 7a) - (9b - 15a)",
    steps: [
      { text: "Expression de départ", expr: "45a - 20b - (18a - 12b + 7a) - (9b - 15a)", color: "text-blue-600" },
      { text: "Simplifier les parenthèses", expr: "45a - 20b - (25a - 12b) - (9b - 15a)", color: "text-orange-600" },
      { text: "Distribuer les signes", expr: "45a - 20b - 25a + 12b - 9b + 15a", color: "text-green-600" },
      { text: "Séparer par variable", expr: "45a - 25a + 15a - 20b + 12b - 9b", color: "text-red-600" },
      { text: "Résultat final", expr: "35a - 17b", color: "text-purple-600" }
    ]
  },
  
  // Niveau 9 : Expressions avec nombres et variables complexes
  {
    id: 23,
    question: "18x - 24 - (9x - 15 + 3x) + (12 - 6x)",
    steps: [
      { text: "Expression de départ", expr: "18x - 24 - (9x - 15 + 3x) + (12 - 6x)", color: "text-blue-600" },
      { text: "Simplifier les parenthèses", expr: "18x - 24 - (12x - 15) + (12 - 6x)", color: "text-orange-600" },
      { text: "Distribuer les signes", expr: "18x - 24 - 12x + 15 + 12 - 6x", color: "text-green-600" },
      { text: "Séparer variables et nombres", expr: "18x - 12x - 6x - 24 + 15 + 12", color: "text-red-600" },
      { text: "Résultat final", expr: "0x + 3 = 3", color: "text-purple-600" }
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
              href="/chapitre/5eme-calcul-litteral" 
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
              
              {/* Règles essentielles en haut */}
              <div className="bg-white rounded-lg p-6 border border-green-100 mb-6">
                <h4 className="font-semibold text-green-800 mb-4">✅ À retenir</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  <div className="text-green-700">• <strong>a + a = 2a</strong> (termes identiques)</div>
                  <div className="text-green-700">• <strong>a + b</strong> ne se simplifie pas</div>
                  <div className="text-green-700">• <strong>2a + 3a = 5a</strong> (addition coefficients)</div>
                  <div className="text-green-700">• <strong>a + 2a = 3a</strong> (coefficient implicite)</div>
                  <div className="text-green-700">• <strong>3x + 2y + x = 4x + 2y</strong> (regrouper)</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">Règle fondamentale</h3>
                      <p className="text-green-700 font-medium mb-2">
                        ✅ On ne peut additionner que des termes <strong>strictement identiques</strong>
                      </p>
                      <p className="text-green-600 text-sm">
                        Cela signifie : même variable ET même puissance
                      </p>
                    </div>

                    {/* Animations avec les chats */}
                    <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
                      {/* Colonne 1 : Exemple avec nombres positifs */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-3">📘 Exemple 1 : 2x + 3x</h4>
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
                              disabled={catAnimationStep === 4}
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
                              {catAnimationStep === 0 && <span>2x + 3x</span>}
                              {catAnimationStep === 1 && <span>2🐱 + 3🐱</span>}
                              {catAnimationStep === 2 && <span>2🐱 + 3🐱 = 5🐱</span>}
                              {catAnimationStep === 3 && <span>2🐱 + 3🐱 = 5🐱 = 5x</span>}
                              {catAnimationStep === 4 && <span>2x + 3x = 5x</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep === 0 && 'Expression de départ'}
                              {catAnimationStep === 1 && 'Dans ton esprit, remplace x par un chat 🐱'}
                              {catAnimationStep === 2 && '2 chats + 3 chats = 5 chats'}
                              {catAnimationStep === 3 && 'Remplace les chats par x : 5x'}
                              {catAnimationStep === 4 && 'Résultat final : 2x + 3x = 5x'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Colonne 2 : Exemple avec x et x² */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3">📗 Exemple 2 : 3x² - 5x + 2x² + 7x</h4>
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
                              disabled={catAnimationStepNeg === 6}
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
                              {catAnimationStepNeg === 0 && <span>3x² - 5x + 2x² + 7x</span>}
                              {catAnimationStepNeg === 1 && <span><span className="text-blue-600">3x²</span> <span className="text-red-600">- 5x</span> <span className="text-blue-600">+ 2x²</span> <span className="text-red-600">+ 7x</span></span>}
                              {catAnimationStepNeg === 2 && <span>3🐶 - 5🐱 + 2🐶 + 7🐱</span>}
                              {catAnimationStepNeg === 3 && <span>3🐶 + 2🐶 - 5🐱 + 7🐱</span>}
                              {catAnimationStepNeg === 4 && <span>5🐶 + 2🐱</span>}
                              {catAnimationStepNeg === 5 && <span>5x² + 2x</span>}
                              {catAnimationStepNeg === 6 && <span>3x² - 5x + 2x² + 7x = 5x² + 2x</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStepNeg === 0 && '⚠️ ATTENTION : Toujours regarder le SIGNE devant chaque terme !'}
                              {catAnimationStepNeg === 1 && 'On identifie les termes avec leurs signes : x² en bleu, x en rouge'}
                              {catAnimationStepNeg === 2 && 'x² devient 🐶, x devient 🐱 (ANIMAUX DIFFÉRENTS !)'}
                              {catAnimationStepNeg === 3 && 'On rapproche les mêmes animaux ensemble'}
                              {catAnimationStepNeg === 4 && 'Calcul : 3+2=5 chiens, -5+7=2 chats'}
                              {catAnimationStepNeg === 5 && 'On remplace par les vraies variables'}
                              {catAnimationStepNeg === 6 && 'Résultat final : on ne peut pas simplifier davantage !'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 3 : Avec b, b² et nombres */}
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-3">📚 Exemple 3 : 2b² - 7 + 5b - 3b² + 12 - 8b</h4>
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
                              disabled={catAnimationStep3 === 7}
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
                              {catAnimationStep3 === 0 && <span>2b² - 7 + 5b - 3b² + 12 - 8b</span>}
                              {catAnimationStep3 === 1 && <span>⚠️ Regarder le SIGNE devant chaque terme !</span>}
                              {catAnimationStep3 === 2 && <span><span className="text-blue-600">2b²</span> <span className="text-red-600">- 7</span> <span className="text-green-600">+ 5b</span> <span className="text-blue-600">- 3b²</span> <span className="text-red-600">+ 12</span> <span className="text-green-600">- 8b</span></span>}
                              {catAnimationStep3 === 3 && <span>2b² - 3b² + 5b - 8b - 7 + 12</span>}
                              {catAnimationStep3 === 4 && <span>-b² - 3b + 5</span>}
                              {catAnimationStep3 === 5 && <span>-b² - 3b + 5</span>}
                              {catAnimationStep3 === 6 && <span>-b² - 3b + 5</span>}
                              {catAnimationStep3 === 7 && <span>2b² - 7 + 5b - 3b² + 12 - 8b = -b² - 3b + 5</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep3 === 0 && 'Expression avec b², b et nombres constants'}
                              {catAnimationStep3 === 1 && '🔥 RÈGLE D\'OR : Le signe fait partie du terme !'}
                              {catAnimationStep3 === 2 && 'On identifie : b² (bleu), nombres (rouge), b (vert)'}
                              {catAnimationStep3 === 3 && 'On rapproche les mêmes termes ensemble'}
                              {catAnimationStep3 === 4 && 'Calculs : 2-3=-1, 5-8=-3, -7+12=5'}
                              {catAnimationStep3 === 5 && 'On simplifie l\'écriture (-1)b² = -b²'}
                              {catAnimationStep3 === 6 && 'On simplifie l\'écriture (-3)b = -3b'}
                              {catAnimationStep3 === 7 && 'Résultat final : 3 termes différents !'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 4 : Avec coefficients négatifs */}
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-3">📕 Exemple 4 : -3y + 8y</h4>
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
                              {catAnimationStep4 === 0 && <span>-3y + 8y</span>}
                              {catAnimationStep4 === 1 && <span>5y</span>}
                              {catAnimationStep4 === 2 && <span>-3y + 8y = 5y</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep4 === 0 && 'Expression avec y et signes négatifs'}
                              {catAnimationStep4 === 1 && 'Calcul : -3 + 8 = 5'}
                              {catAnimationStep4 === 2 && 'Résultat final : 5y'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 5 : Avec variables composées */}
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h4 className="font-semibold text-pink-800 mb-3">📖 Exemple 5 : 3ab - 2xy + 5ab² - 7ab + 4xy - ab²</h4>
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
                              disabled={catAnimationStep5 === 7}
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
                              {catAnimationStep5 === 0 && <span>3ab - 2xy + 5ab² - 7ab + 4xy - ab²</span>}
                              {catAnimationStep5 === 1 && <span>🔥 Variables collées = nouvelle "famille" !</span>}
                              {catAnimationStep5 === 2 && <span><span className="text-blue-600">3ab</span> <span className="text-red-600">- 2xy</span> <span className="text-green-600">+ 5ab²</span> <span className="text-blue-600">- 7ab</span> <span className="text-red-600">+ 4xy</span> <span className="text-green-600">- ab²</span></span>}
                              {catAnimationStep5 === 3 && <span>3ab - 7ab - 2xy + 4xy + 5ab² - ab²</span>}
                              {catAnimationStep5 === 4 && <span>-4ab + 2xy + 4ab²</span>}
                              {catAnimationStep5 === 5 && <span>3ab - 2xy + 5ab² - 7ab + 4xy - ab² = -4ab + 2xy + 4ab²</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep5 === 0 && 'Expression avec variables "collées" : ab, xy, ab²'}
                              {catAnimationStep5 === 1 && '💡 ab ≠ ba ≠ ab² : chaque combinaison est différente !'}
                              {catAnimationStep5 === 2 && 'On identifie : ab (bleu), xy (rouge), ab² (vert)'}
                              {catAnimationStep5 === 3 && 'On rapproche les mêmes termes ensemble'}
                              {catAnimationStep5 === 4 && 'Calculs : 3-7=-4, -2+4=2, 5-1=4'}
                              {catAnimationStep5 === 5 && 'Résultat final : 3 termes différents !'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemple 6 : Avec parenthèses et signes complexes */}
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <h4 className="font-semibold text-teal-800 mb-3">📓 Exemple 6 : 4x - (3 - 7x) + 2x - (-5 + x)</h4>
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
                              disabled={catAnimationStep6 === 7}
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
                            <div className="text-2xl font-mono bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
                              {catAnimationStep6 === 0 && <span>4x - (3 - 7x) + 2x - (-5 + x)</span>}
                              {catAnimationStep6 === 1 && <span>⚠️ RÈGLE : Moins devant parenthèse change les signes</span>}
                              {catAnimationStep6 === 2 && <span>4x - (3 - 7x) + 2x - (-5 + x)</span>}
                              {catAnimationStep6 === 3 && <span>4x - 3 + 7x + 2x + 5 - x</span>}
                              {catAnimationStep6 === 4 && <span>4x - 3 + 7x + 2x + 5 - x</span>}
                              {catAnimationStep6 === 5 && <span>4x + 7x + 2x - x - 3 + 5</span>}
                              {catAnimationStep6 === 6 && <span>12x + 2</span>}
                              {catAnimationStep6 === 7 && <span>4x - (3 - 7x) + 2x - (-5 + x) = 12x + 2</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                              {catAnimationStep6 === 0 && 'Expression avec parenthèses et signes négatifs'}
                              {catAnimationStep6 === 1 && '🔥 Moins devant parenthèse inverse tous les signes !'}
                              {catAnimationStep6 === 2 && 'On remet l\'expression de départ pour bien visualiser'}
                              {catAnimationStep6 === 3 && 'On applique la règle : suppression des parenthèses'}
                              {catAnimationStep6 === 4 && 'On garde l\'expression visible'}
                              {catAnimationStep6 === 5 && 'On rapproche les termes semblables'}
                              {catAnimationStep6 === 6 && 'Calcul final : 4+7+2-1=12 et -3+5=2'}
                              {catAnimationStep6 === 7 && 'Résultat final : 12x + 2'}
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
                            className={`p-4 rounded-lg border transition-all duration-500 ${
                              index <= solutionStep
                                ? 'bg-white border-green-300 opacity-100 transform translate-x-0'
                                : 'bg-gray-50 border-gray-200 opacity-50 transform translate-x-4'
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
                            className={`p-4 rounded-lg border transition-all duration-500 ${
                              index <= solutionStep
                                ? 'bg-white border-red-300 opacity-100 transform translate-x-0'
                                : 'bg-gray-50 border-gray-200 opacity-50 transform translate-x-4'
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
              
              {/* Règles essentielles en haut */}
              <div className="bg-white rounded-lg p-6 border border-orange-100 mb-6">
                <h4 className="font-semibold text-orange-800 mb-4">✅ À retenir</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  <div className="text-orange-700">• <strong>3 × x = 3x</strong> (pas de signe ×)</div>
                  <div className="text-orange-700">• <strong>x × y = xy</strong> (ordre alphabétique)</div>
                  <div className="text-orange-700">• <strong>x × x = x²</strong> (puissances)</div>
                  <div className="text-orange-700">• <strong>2x × 3y = 6xy</strong> (coefficients)</div>
                  <div className="text-orange-700">• <strong>2xy × 2x = 4x²y</strong> (variables multiples)</div>
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

                      {/* Animation SCL */}
                      <div className="bg-white rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <h4 className="text-lg font-semibold text-blue-800">
                            Animation : 2x × 3y
                          </h4>
                          <button
                            onClick={() => {
                              setSclStep(0)
                              setSclAnimating(true)
                              setTimeout(() => setSclStep(1), 2000)
                              setTimeout(() => setSclStep(2), 5000)
                              setTimeout(() => setSclStep(3), 8000)
                              setTimeout(() => setSclStep(4), 12000)
                              setTimeout(() => setSclStep(5), 15000)
                              setTimeout(() => setSclStep(6), 15000)
                              setTimeout(() => setSclAnimating(false), 16000)
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            {sclAnimating ? 'Animation en cours...' : 'Démarrer l\'animation'}
                          </button>
                        </div>
                        
                        <div className="space-y-6 relative min-h-[400px]">
                          {/* Expression de départ */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="font-mono text-lg text-center text-gray-800 relative">
                              {/* Expression statique qui reste visible en haut */}
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
                                <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">2x × 3y</span>
                              </div>
                              
                              {/* Éléments qui glissent */}
                              <span id="plus-sign-implicit" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 1 ? 'transform translate-x-[-8.85rem] translate-y-28 text-red-900 scale-125 opacity-100' : 'opacity-0'
                              }`}>+</span>
                              <span id="number-2" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 2 ? 'transform translate-x-[-9.83rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                              }`}>2</span>
                              <span id="letters-1" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 3 ? 'transform translate-x-[-10.715rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                              }`}>x</span>
                              <span className={`mx-2 transition-opacity duration-1000 ${sclStep >= 1 ? 'opacity-30' : 'opacity-100'} ${sclStep >= 3 ? 'opacity-0' : ''}`}>×</span>
                              <span id="plus-sign-3" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 1 ? 'transform translate-x-[-8.84rem] translate-y-28 text-red-700 scale-110 opacity-100' : 'opacity-0'
                              }`}>+</span>
                              <span id="number-3" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 2 ? 'transform translate-x-[-9.825rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                              }`}>3</span>
                              <span id="letters-2" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 3 ? 'transform translate-x-[-10.712rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                              }`}>y</span>
                            </div>
                            
                          {/* Calculs qui apparaissent quand les éléments glissent */}
                          {sclStep >= 2 && (
                            <div className="absolute top-32 left-1/2 transform -translate-x-4">
                              <span className="text-green-600 font-bold text-3xl">+ × + = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">+</span></span>
                            </div>
                          )}
                          {sclStep >= 3 && (
                            <div className="absolute top-48 left-1/2 transform -translate-x-4">
                              <span className="text-green-600 font-bold text-3xl">2 × 3 = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">6</span></span>
                            </div>
                          )}
                          {sclStep >= 4 && (
                            <div className="absolute top-64 left-1/2 transform -translate-x-4">
                              <span className="text-purple-600 font-bold text-3xl">x × y = <span className="bg-purple-50 px-2 py-1 rounded-lg border-2 border-purple-200">xy</span></span>
                            </div>
                          )}
                          
                          {/* Résultat final */}
                          {sclStep >= 6 && (
                            <div className="absolute top-80 left-1/2 transform -translate-x-3/4">
                              <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : 6xy</span>
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
                            
                            {/* Éléments qui glissent */}
                            <span id="plus-sign-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 1 ? 'transform translate-x-[-8.85rem] translate-y-28 text-red-900 scale-125 opacity-100' : 'opacity-0'
                            }`}>+</span>
                            <span id="number-4-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 2 ? 'transform translate-x-[-9.83rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                            }`}>4</span>
                            <span id="letters-x-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 3 ? 'transform translate-x-[-10.715rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                            }`}>x</span>
                            <span className={`mx-2 text-gray-800 transition-opacity duration-1000 ${sclPowerStep >= 1 ? 'opacity-30' : 'opacity-100'} ${sclPowerStep >= 3 ? 'opacity-0' : ''}`}>×</span>
                            <span id="plus-sign-power2" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 1 ? 'transform translate-x-[-8.84rem] translate-y-28 text-red-700 scale-110 opacity-100' : 'opacity-0'
                            }`}>+</span>
                            <span id="number-5-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 2 ? 'transform translate-x-[-9.825rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                            }`}>5</span>
                            <span id="letters-x2-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 3 ? 'transform translate-x-[-10.712rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
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