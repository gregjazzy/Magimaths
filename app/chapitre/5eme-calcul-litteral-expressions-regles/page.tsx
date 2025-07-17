'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Calculator, RotateCcw } from 'lucide-react'
import Link from 'next/link'

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
  }
]

const beastExercises = [
  {
    id: 1,
    question: "5x - 2x + 3x",
    steps: [
      { text: "Expression de départ", expr: "5x - 2x + 3x", color: "text-blue-600" },
      { text: "Résultat final", expr: "6x", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "8a - 3a - 2a",
    steps: [
      { text: "Expression de départ", expr: "8a - 3a - 2a", color: "text-blue-600" },
      { text: "Résultat final", expr: "3a", color: "text-purple-600" }
    ]
  },
  {
    id: 3,
    question: "2(3x + x) - 4x",
    steps: [
      { text: "Expression de départ", expr: "2(3x + x) - 4x", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "2(4x) - 4x", color: "text-orange-600" },
      { text: "On distribue le 2", expr: "8x - 4x", color: "text-green-600" },
      { text: "Résultat final", expr: "4x", color: "text-purple-600" }
    ]
  },
  {
    id: 4,
    question: "6y - (2y + 3y)",
    steps: [
      { text: "Expression de départ", expr: "6y - (2y + 3y)", color: "text-blue-600" },
      { text: "D'abord la parenthèse", expr: "6y - 5y", color: "text-orange-600" },
      { text: "Résultat final", expr: "y", color: "text-purple-600" }
    ]
  },
  {
    id: 5,
    question: "3x + 2(4x - x)",
    steps: [
      { text: "Expression de départ", expr: "3x + 2(4x - x)", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "3x + 2(3x)", color: "text-orange-600" },
      { text: "On distribue le 2", expr: "3x + 6x", color: "text-green-600" },
      { text: "Résultat final", expr: "9x", color: "text-purple-600" }
    ]
  },
  {
    id: 6,
    question: "3a + 2(a + 4a)",
    steps: [
      { text: "Expression de départ", expr: "3a + 2(a + 4a)", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "3a + 2(5a)", color: "text-orange-600" },
      { text: "On distribue le 2", expr: "3a + 10a", color: "text-green-600" },
      { text: "Résultat final", expr: "13a", color: "text-purple-600" }
    ]
  },
  {
    id: 7,
    question: "4(2x - x) + 3x",
    steps: [
      { text: "Expression de départ", expr: "4(2x - x) + 3x", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "4(x) + 3x", color: "text-orange-600" },
      { text: "On distribue le 4", expr: "4x + 3x", color: "text-green-600" },
      { text: "Résultat final", expr: "7x", color: "text-purple-600" }
    ]
  },
  {
    id: 8,
    question: "3(2y + y) + 4y",
    steps: [
      { text: "Expression de départ", expr: "3(2y + y) + 4y", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "3(3y) + 4y", color: "text-orange-600" },
      { text: "On distribue le 3", expr: "9y + 4y", color: "text-green-600" },
      { text: "Résultat final", expr: "13y", color: "text-purple-600" }
    ]
  },
  {
    id: 9,
    question: "7z - (3z - 6z) + 2z",
    steps: [
      { text: "Expression de départ", expr: "7z - (3z - 6z) + 2z", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "7z - (-3z) + 2z", color: "text-orange-600" },
      { text: "Moins devant la parenthèse", expr: "7z + 3z + 2z", color: "text-green-600" },
      { text: "Résultat final", expr: "12z", color: "text-purple-600" }
    ]
  },
  {
    id: 10,
    question: "2(5w - 3w) - 4w",
    steps: [
      { text: "Expression de départ", expr: "2(5w - 3w) - 4w", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "2(2w) - 4w", color: "text-orange-600" },
      { text: "On distribue le 2", expr: "4w - 4w", color: "text-green-600" },
      { text: "Résultat final", expr: "0", color: "text-purple-600" }
    ]
  },
  {
    id: 11,
    question: "5x + 3(2x - x)",
    steps: [
      { text: "Expression de départ", expr: "5x + 3(2x - x)", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "5x + 3(x)", color: "text-orange-600" },
      { text: "On distribue le 3", expr: "5x + 3x", color: "text-green-600" },
      { text: "Résultat final", expr: "8x", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "2(3t + t) + 4(t - 2t)",
    steps: [
      { text: "Expression de départ", expr: "2(3t + t) + 4(t - 2t)", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "2(4t) + 4(-t)", color: "text-orange-600" },
      { text: "On distribue les coefficients", expr: "8t - 4t", color: "text-green-600" },
      { text: "Résultat final", expr: "4t", color: "text-purple-600" }
    ]
  },
  {
    id: 13,
    question: "2(3xy - xy) + 4xy - 5xy",
    steps: [
      { text: "Expression de départ", expr: "2(3xy - xy) + 4xy - 5xy", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "2(2xy) + 4xy - 5xy", color: "text-orange-600" },
      { text: "On distribue le 2", expr: "4xy + 4xy - 5xy", color: "text-green-600" },
      { text: "Résultat final", expr: "3xy", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "3(2x²y - x²y) - (4x²y + x²y)",
    steps: [
      { text: "Expression de départ", expr: "3(2x²y - x²y) - (4x²y + x²y)", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "3(x²y) - (5x²y)", color: "text-orange-600" },
      { text: "On distribue", expr: "3x²y - 5x²y", color: "text-green-600" },
      { text: "Résultat final", expr: "-2x²y", color: "text-purple-600" }
    ]
  },
  {
    id: 15,
    question: "5xy² + 2(3xy² - xy²) + xy²",
    steps: [
      { text: "Expression de départ", expr: "5xy² + 2(3xy² - xy²) + xy²", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "5xy² + 2(2xy²) + xy²", color: "text-orange-600" },
      { text: "On distribue le 2", expr: "5xy² + 4xy² + xy²", color: "text-green-600" },
      { text: "Résultat final", expr: "10xy²", color: "text-purple-600" }
    ]
  },
  
  // Niveau 7 : Moins devant parenthèses complexes
  {
    id: 16,
    question: "7xy - (2xy + 3xy - xy) + 4xy",
    steps: [
      { text: "Expression de départ", expr: "7xy - (2xy + 3xy - xy) + 4xy", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "7xy - (4xy) + 4xy", color: "text-orange-600" },
      { text: "Moins devant parenthèse", expr: "7xy - 4xy + 4xy", color: "text-green-600" },
      { text: "Résultat final", expr: "7xy", color: "text-purple-600" }
    ]
  },
  {
    id: 17,
    question: "5x²y - (6x²y - 2x²y + 3x²y) + 8x²y",
    steps: [
      { text: "Expression de départ", expr: "5x²y - (6x²y - 2x²y + 3x²y) + 8x²y", color: "text-blue-600" },
      { text: "Priorité aux parenthèses", expr: "5x²y - (7x²y) + 8x²y", color: "text-orange-600" },
      { text: "Moins devant parenthèse", expr: "5x²y - 7x²y + 8x²y", color: "text-green-600" },
      { text: "Résultat final", expr: "6x²y", color: "text-purple-600" }
    ]
  },
  
  // Niveau 8 : Parenthèses mixtes (variables et nombres)
  {
    id: 18,
    question: "3x - (2x - 4) + 5x - (3x + 7)",
    steps: [
      { text: "Expression de départ", expr: "3x - (2x - 4) + 5x - (3x + 7)", color: "text-blue-600" },
      { text: "Moins devant parenthèse change les signes", expr: "3x - 2x + 4 + 5x - 3x - 7", color: "text-orange-600" },
      { text: "Séparer variables et nombres", expr: "3x - 2x + 5x - 3x + 4 - 7", color: "text-green-600" },
      { text: "Résultat final", expr: "3x - 3", color: "text-purple-600" }
    ]
  },
  {
    id: 19,
    question: "4xy - (2xy + 6) + 3xy - (xy - 5)",
    steps: [
      { text: "Expression de départ", expr: "4xy - (2xy + 6) + 3xy - (xy - 5)", color: "text-blue-600" },
      { text: "Moins devant parenthèse change les signes", expr: "4xy - 2xy - 6 + 3xy - xy + 5", color: "text-orange-600" },
      { text: "Séparer variables et nombres", expr: "4xy - 2xy + 3xy - xy - 6 + 5", color: "text-green-600" },
      { text: "Résultat final", expr: "4xy - 1", color: "text-purple-600" }
    ]
  },
  
  // Niveau 9 : Parenthèses avec 3 membres très complexes
  {
    id: 20,
    question: "6x - (2x² - 4x + 3) + 5x² - (3x² + 2x - 7)",
    steps: [
      { text: "Expression de départ", expr: "6x - (2x² - 4x + 3) + 5x² - (3x² + 2x - 7)", color: "text-blue-600" },
      { text: "Moins devant parenthèse change les signes", expr: "6x - 2x² + 4x - 3 + 5x² - 3x² - 2x + 7", color: "text-orange-600" },
      { text: "Séparer par type", expr: "6x + 4x - 2x - 2x² + 5x² - 3x² - 3 + 7", color: "text-green-600" },
      { text: "Résultat final", expr: "8x + 0x² + 4 = 8x + 4", color: "text-purple-600" }
    ]
  },
  
  // Niveau 10 : MODE DIABOLIQUE - Parenthèses multiples avec coefficients
  {
    id: 21,
    question: "3(2xy - 4x²y + 1) - (3xy + x²y - 5) + 4xy",
    steps: [
      { text: "Expression de départ", expr: "3(2xy - 4x²y + 1) - (3xy + x²y - 5) + 4xy", color: "text-blue-600" },
      { text: "Distribuer le 3", expr: "6xy - 12x²y + 3 - (3xy + x²y - 5) + 4xy", color: "text-orange-600" },
      { text: "Moins devant la parenthèse", expr: "6xy - 12x²y + 3 - 3xy - x²y + 5 + 4xy", color: "text-green-600" },
      { text: "Séparer par type", expr: "6xy - 3xy + 4xy - 12x²y - x²y + 3 + 5", color: "text-red-600" },
      { text: "Résultat final", expr: "7xy - 13x²y + 8", color: "text-purple-600" }
    ]
  },
  {
    id: 22,
    question: "5xy² - (2xy² + 3x²y - 4) + 3(xy² - 2x²y + 1) - 7",
    steps: [
      { text: "Expression de départ", expr: "5xy² - (2xy² + 3x²y - 4) + 3(xy² - 2x²y + 1) - 7", color: "text-blue-600" },
      { text: "Moins devant parenthèse", expr: "5xy² - 2xy² - 3x²y + 4 + 3(xy² - 2x²y + 1) - 7", color: "text-orange-600" },
      { text: "Distribuer le 3", expr: "5xy² - 2xy² - 3x²y + 4 + 3xy² - 6x²y + 3 - 7", color: "text-green-600" },
      { text: "Séparer par type", expr: "5xy² - 2xy² + 3xy² - 3x²y - 6x²y + 4 + 3 - 7", color: "text-red-600" },
      { text: "Résultat final", expr: "6xy² - 9x²y + 0 = 6xy² - 9x²y", color: "text-purple-600" }
    ]
  },
  
  // Niveau 11 : MODE ULTRA-DIABOLIQUE - Parenthèses imbriquées et multiples
  {
    id: 23,
    question: "2x - (4x - (2x + 5)) + 5x - (3x - 2)",
    steps: [
      { text: "Expression de départ", expr: "2x - (4x - (2x + 5)) + 5x - (3x - 2)", color: "text-blue-600" },
      { text: "Priorité parenthèse interne", expr: "2x - (4x - 2x - 5) + 5x - (3x - 2)", color: "text-orange-600" },
      { text: "Simplifier dans la parenthèse", expr: "2x - (2x - 5) + 5x - (3x - 2)", color: "text-green-600" },
      { text: "Moins devant la parenthèse", expr: "2x - 2x + 5 + 5x - (3x - 2)", color: "text-red-600" },
      { text: "Moins devant dernière parenthèse", expr: "2x - 2x + 5 + 5x - 3x + 2", color: "text-amber-600" },
      { text: "Séparer par type", expr: "2x - 2x + 5x - 3x + 5 + 2", color: "text-indigo-600" },
      { text: "Résultat final", expr: "2x + 7", color: "text-purple-600" }
    ]
  },
  {
    id: 24,
    question: "4(3xy - 2x²y + 3) - (5xy - (3x²y - 2xy) + 1) - 6",
    steps: [
      { text: "Expression de départ", expr: "4(3xy - 2x²y + 3) - (5xy - (3x²y - 2xy) + 1) - 6", color: "text-blue-600" },
      { text: "Parenthèse interne", expr: "4(3xy - 2x²y + 3) - (5xy - 3x²y + 2xy + 1) - 6", color: "text-orange-600" },
      { text: "Simplifier dans la parenthèse", expr: "4(3xy - 2x²y + 3) - (7xy - 3x²y + 1) - 6", color: "text-green-600" },
      { text: "Distribuer le 4", expr: "12xy - 8x²y + 12 - (7xy - 3x²y + 1) - 6", color: "text-red-600" },
      { text: "Moins devant la parenthèse", expr: "12xy - 8x²y + 12 - 7xy + 3x²y - 1 - 6", color: "text-amber-600" },
      { text: "Séparer par type", expr: "12xy - 7xy - 8x²y + 3x²y + 12 - 1 - 6", color: "text-indigo-600" },
      { text: "Résultat final", expr: "5xy - 5x²y + 5", color: "text-purple-600" }
    ]
  },
  
  // Niveau 12 : MODE APOCALYPSE - Le summum de la complexité
  {
    id: 25,
    question: "3x² - (4x - (2x² - x + 1) + 5x) + 7x - (2x² + 3x - 4)",
    steps: [
      { text: "Expression de départ", expr: "3x² - (4x - (2x² - x + 1) + 5x) + 7x - (2x² + 3x - 4)", color: "text-blue-600" },
      { text: "Moins devant la parenthèse interne", expr: "3x² - (4x - 2x² + x - 1 + 5x) + 7x - (2x² + 3x - 4)", color: "text-orange-600" },
      { text: "Simplifier dans la parenthèse", expr: "3x² - (10x - 2x² - 1) + 7x - (2x² + 3x - 4)", color: "text-green-600" },
      { text: "Moins devant la parenthèse", expr: "3x² - 10x + 2x² + 1 + 7x - (2x² + 3x - 4)", color: "text-red-600" },
      { text: "Moins devant dernière parenthèse", expr: "3x² - 10x + 2x² + 1 + 7x - 2x² - 3x + 4", color: "text-amber-600" },
      { text: "Séparer par type", expr: "3x² + 2x² - 2x² - 10x + 7x - 3x + 1 + 4", color: "text-indigo-600" },
      { text: "Résultat final", expr: "3x² - 6x + 5", color: "text-purple-600" }
    ]
  },
  
  // Niveau 13 : MULTIPLICATION AVEC NOMBRES NÉGATIFS - Beast Mode
  {
    id: 26,
    question: "(-3xy) × (-4x²y)",
    steps: [
      { text: "Expression de départ", expr: "(-3xy) × (-4x²y)", color: "text-blue-600" },
      { text: "Coefficients : (-3) × (-4) = +12", expr: "12 × xy × x²y", color: "text-orange-600" },
      { text: "Regrouper", expr: "12x³y²", color: "text-purple-600" }
    ]
  },
  {
    id: 27,
    question: "-(2x)(3xy - 4x² + 5y)",
    steps: [
      { text: "Expression de départ", expr: "-(2x)(3xy - 4x² + 5y)", color: "text-blue-600" },
      { text: "Distribution", expr: "-(2x) × 3xy - (2x) × (-4x²) - (2x) × 5y", color: "text-orange-600" },
      { text: "Résultat final", expr: "-6x²y + 8x³ - 10xy", color: "text-purple-600" }
    ]
  },
  {
    id: 28,
    question: "-(5x²y) × (-2xy + 3y²)",
    steps: [
      { text: "Expression de départ", expr: "-(5x²y) × (-2xy + 3y²)", color: "text-blue-600" },
      { text: "Distribution", expr: "-(5x²y) × (-2xy) - (5x²y) × 3y²", color: "text-orange-600" },
      { text: "Résultat final", expr: "10x³y² - 15x²y³", color: "text-purple-600" }
    ]
  },
  {
    id: 29,
    question: "(-3x + 2y) × (-4x)",
    steps: [
      { text: "Expression de départ", expr: "(-3x + 2y) × (-4x)", color: "text-blue-600" },
      { text: "Distribution", expr: "(-3x) × (-4x) + 2y × (-4x)", color: "text-orange-600" },
      { text: "Résultat final", expr: "12x² - 8xy", color: "text-purple-600" }
    ]
  },
  {
    id: 30,
    question: "-(2x²y) × (-3x + 4y - 5z)",
    steps: [
      { text: "Expression de départ", expr: "-(2x²y) × (-3x + 4y - 5z)", color: "text-blue-600" },
      { text: "Distribution", expr: "-(2x²y) × (-3x) - (2x²y) × 4y - (2x²y) × (-5z)", color: "text-orange-600" },
      { text: "Résultat final", expr: "6x³y - 8x²y² + 10x²yz", color: "text-purple-600" }
    ]
  },
  {
    id: 31,
    question: "-(4xy) × (-2x²y + 3xy² - y³)",
    steps: [
      { text: "Expression de départ", expr: "-(4xy) × (-2x²y + 3xy² - y³)", color: "text-blue-600" },
      { text: "Distribution", expr: "-(4xy) × (-2x²y) - (4xy) × 3xy² - (4xy) × (-y³)", color: "text-orange-600" },
      { text: "Résultat final", expr: "8x³y² - 12x²y³ + 4xy⁴", color: "text-purple-600" }
    ]
  },
  {
    id: 32,
    question: "(-x + 3y) × (-2x - 4y)",
    steps: [
      { text: "Expression de départ", expr: "(-x + 3y) × (-2x - 4y)", color: "text-blue-600" },
      { text: "Distribution complète", expr: "(-x) × (-2x) + (-x) × (-4y) + 3y × (-2x) + 3y × (-4y)", color: "text-orange-600" },
      { text: "Simplifier", expr: "2x² + 4xy - 6xy - 12y²", color: "text-green-600" },
      { text: "Résultat final", expr: "2x² - 2xy - 12y²", color: "text-purple-600" }
    ]
  },
  {
    id: 33,
    question: "-(3x²) × (-2x + 5y - 4z + 7)",
    steps: [
      { text: "Expression de départ", expr: "-(3x²) × (-2x + 5y - 4z + 7)", color: "text-blue-600" },
      { text: "Distribution", expr: "-(3x²) × (-2x) - (3x²) × 5y - (3x²) × (-4z) - (3x²) × 7", color: "text-orange-600" },
      { text: "Résultat final", expr: "6x³ - 15x²y + 12x²z - 21x²", color: "text-purple-600" }
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
              {[
                { id: 'addition', label: 'Addition', icon: '➕' },
                { id: 'multiplication', label: 'Multiplication', icon: '✖️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setMainTab(tab.id as any)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-colors font-semibold text-lg ${
                    mainTab === tab.id
                      ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
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
                {[
                  { id: 'cours', label: 'Cours', icon: BookOpen },
                  { id: 'exercices', label: 'Exercices', icon: Target }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSubTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                      subTab === tab.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
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
                <h2 className="text-xl font-bold text-gray-800">Exercices - Addition</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setExerciseLevel('normal')
                      setCurrentExercise(0)
                      resetExercise()
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      exerciseLevel === 'normal' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📝 Normal
                  </button>
                  <button
                    onClick={() => {
                      setExerciseLevel('beast')
                      setCurrentExercise(0)
                      resetExercise()
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      exerciseLevel === 'beast' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    🔥 Beast Mode
                  </button>
                </div>
              </div>
            </div>

            {/* Exercices Normaux */}
            {exerciseLevel === 'normal' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Exercice {currentExercise + 1} / {normalExercises.length}
                  </h3>
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

                <div className="space-y-6">
                  {/* Question */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Simplifier l'expression :</h4>
                    <div className="text-2xl font-mono text-blue-900 text-center">
                      {normalExercises[currentExercise].question}
                    </div>
                  </div>

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
                  <h3 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    Beast Mode - Exercice {currentExercise + 1} / {beastExercises.length}
                    <span className="text-2xl">🔥</span>
                  </h3>
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

                <div className="space-y-6">
                  {/* Question */}
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3">
                      ⚡ Défi ! Simplifier l'expression avec priorités opératoires :
                    </h4>
                    <div className="text-2xl font-mono text-red-900 text-center">
                      {beastExercises[currentExercise].question}
                    </div>
                  </div>

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

            {/* Résumé */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">📝 Résumé des règles</h2>
              
              <div className="bg-white rounded-lg p-6 border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-4">✅ À retenir</h4>
                <ul className="space-y-2 text-purple-700">
                  <li>• <strong>3 × x = 3x</strong> (pas de signe ×)</li>
                  <li>• <strong>x × y = xy</strong> (ordre alphabétique)</li>
                  <li>• <strong>x × x = x²</strong> (puissances)</li>
                  <li>• <strong>2x × 3y = 6xy</strong> (coefficients)</li>
                  <li>• <strong>x² × x³ = x⁵</strong> (lettres avec puissances)</li>
                  <li>• <strong>x² × x = x³</strong> (addition des puissances)</li>
                </ul>
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
                <h2 className="text-xl font-bold text-gray-800">Exercices - Multiplication</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setExerciseLevel('normal')
                      setCurrentExercise(0)
                      resetExercise()
                    }}
                    className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white"
                  >
                    📝 Normal
                  </button>
                </div>
              </div>
            </div>

            {/* Exercices Multiplication */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  📝 Exercices Normaux
                </h3>
                <div className="text-sm text-gray-600">
                  Exercice {currentExercise + 1} sur {normalMultiplicationExercises.length}
                </div>
              </div>

              {(() => {
                const exercises = normalMultiplicationExercises
                const currentEx = exercises[currentExercise]
                
                return (
                  <div className="space-y-6">
                    {/* Question */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                      <h4 className="text-lg font-semibold text-amber-800 mb-4">Question :</h4>
                      <div className="text-2xl font-mono text-center bg-white p-4 rounded-lg border border-amber-300 text-gray-900">
                        {currentEx.question}
                      </div>
                    </div>

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
          </div>
        )}
      </div>
    </div>
  )
} 