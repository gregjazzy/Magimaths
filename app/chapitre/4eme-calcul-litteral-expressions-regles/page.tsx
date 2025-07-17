'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Target, Calculator, RotateCcw } from 'lucide-react'
import Link from 'next/link'

// Données des exercices d'addition - 30 exercices avec progression variée et équilibrée
const normalExercises = [
  // Niveau 1 : Bases simples (exercices 1-3)
  {
    id: 1,
    question: "2x + 3x",
    steps: [
      { text: "Expression de départ", expr: "2x + 3x", color: "text-blue-600" },
      { text: "Variables identiques", expr: "(2 + 3)x = 5x", color: "text-green-600" }
    ]
  },
  {
    id: 2,
    question: "4y - 7y + 2y",
    steps: [
      { text: "Expression de départ", expr: "4y - 7y + 2y", color: "text-blue-600" },
      { text: "Addition algébrique", expr: "(4 - 7 + 2)y", color: "text-orange-600" },
      { text: "Résultat final", expr: "-y", color: "text-green-600" }
    ]
  },
  {
    id: 3,
    question: "-5a + 3a - 8a",
    steps: [
      { text: "Expression de départ", expr: "-5a + 3a - 8a", color: "text-blue-600" },
      { text: "Soustraire = ajouter l'opposé", expr: "-5a + 3a + (-8a)", color: "text-orange-600" },
      { text: "Résultat final", expr: "-10a", color: "text-green-600" }
    ]
  },
  
  // Niveau 2 : Variables différentes (exercices 4-6)
  {
    id: 4,
    question: "3x + 2y - x + 5y",
    steps: [
      { text: "Expression de départ", expr: "3x + 2y - x + 5y", color: "text-blue-600" },
      { text: "Regrouper par variables", expr: "3x - x + 2y + 5y", color: "text-orange-600" },
      { text: "Résultat final", expr: "2x + 7y", color: "text-green-600" }
    ]
  },
  {
    id: 5,
    question: "-4m + 6n - 2m - 3n + 8m",
    steps: [
      { text: "Expression de départ", expr: "-4m + 6n - 2m - 3n + 8m", color: "text-blue-600" },
      { text: "Regrouper par variables", expr: "-4m - 2m + 8m + 6n - 3n", color: "text-orange-600" },
      { text: "Résultat final", expr: "2m + 3n", color: "text-green-600" }
    ]
  },
  {
    id: 6,
    question: "7p - 5q + 2p - 9q - 3p",
    steps: [
      { text: "Expression de départ", expr: "7p - 5q + 2p - 9q - 3p", color: "text-blue-600" },
      { text: "Regrouper par variables", expr: "7p + 2p - 3p - 5q - 9q", color: "text-orange-600" },
      { text: "Résultat final", expr: "6p - 14q", color: "text-green-600" }
    ]
  },

  // Niveau 3 : Introduction des couples (exercices 7-9)
  {
    id: 7,
    question: "3xy + 2xy - 5xy",
    steps: [
      { text: "Expression de départ", expr: "3xy + 2xy - 5xy", color: "text-blue-600" },
      { text: "Termes semblables (couple)", expr: "(3 + 2 - 5)xy", color: "text-orange-600" },
      { text: "Résultat final", expr: "0xy = 0", color: "text-green-600" }
    ]
  },
  {
    id: 8,
    question: "2x + 4ab - 3x + 6ab",
    steps: [
      { text: "Expression de départ", expr: "2x + 4ab - 3x + 6ab", color: "text-blue-600" },
      { text: "Regrouper par types", expr: "2x - 3x + 4ab + 6ab", color: "text-orange-600" },
      { text: "Résultat final", expr: "-x + 10ab", color: "text-green-600" }
    ]
  },
  {
    id: 9,
    question: "5xy - 3y + 2xy + 7y - xy",
    steps: [
      { text: "Expression de départ", expr: "5xy - 3y + 2xy + 7y - xy", color: "text-blue-600" },
      { text: "Regrouper par types", expr: "5xy + 2xy - xy - 3y + 7y", color: "text-orange-600" },
      { text: "Résultat final", expr: "6xy + 4y", color: "text-green-600" }
    ]
  },

  // Niveau 4 : Cas négatifs particuliers (exercices 10-12)
  {
    id: 10,
    question: "-3x - (-5x) + 2x",
    steps: [
      { text: "Expression de départ", expr: "-3x - (-5x) + 2x", color: "text-blue-600" },
      { text: "Moins devant parenthèse", expr: "-3x + 5x + 2x", color: "text-purple-600" },
      { text: "Résultat final", expr: "4x", color: "text-green-600" }
    ]
  },
  {
    id: 11,
    question: "-2ab - 4ab - (-7ab)",
    steps: [
      { text: "Expression de départ", expr: "-2ab - 4ab - (-7ab)", color: "text-blue-600" },
      { text: "Simplifier les signes", expr: "-2ab - 4ab + 7ab", color: "text-purple-600" },
      { text: "Résultat final", expr: "ab", color: "text-green-600" }
    ]
  },
  {
    id: 12,
    question: "6y - 8y - (-3y) + y",
    steps: [
      { text: "Expression de départ", expr: "6y - 8y - (-3y) + y", color: "text-blue-600" },
      { text: "Transformation", expr: "6y - 8y + 3y + y", color: "text-purple-600" },
      { text: "Résultat final", expr: "2y", color: "text-green-600" }
    ]
  },

  // Niveau 5 : Avec constantes (exercices 13-15)
  {
    id: 13,
    question: "3x + 7 - 5x + 2",
    steps: [
      { text: "Expression de départ", expr: "3x + 7 - 5x + 2", color: "text-blue-600" },
      { text: "Regrouper variables et constantes", expr: "3x - 5x + 7 + 2", color: "text-orange-600" },
      { text: "Résultat final", expr: "-2x + 9", color: "text-green-600" }
    ]
  },
  {
    id: 14,
    question: "4ab + 12 - 2ab - 8 + 3ab",
    steps: [
      { text: "Expression de départ", expr: "4ab + 12 - 2ab - 8 + 3ab", color: "text-blue-600" },
      { text: "Regrouper par types", expr: "4ab - 2ab + 3ab + 12 - 8", color: "text-orange-600" },
      { text: "Résultat final", expr: "5ab + 4", color: "text-green-600" }
    ]
  },
  {
    id: 15,
    question: "-2y + 5 + 7y - 3 + y - 8",
    steps: [
      { text: "Expression de départ", expr: "-2y + 5 + 7y - 3 + y - 8", color: "text-blue-600" },
      { text: "Regrouper par types", expr: "-2y + 7y + y + 5 - 3 - 8", color: "text-orange-600" },
      { text: "Résultat final", expr: "6y - 6", color: "text-green-600" }
    ]
  },

  // Niveau 6 : Parenthèses simples (exercices 16-18)
  {
    id: 16,
    question: "2(3x + 1) + 4x - 2",
    steps: [
      { text: "Expression de départ", expr: "2(3x + 1) + 4x - 2", color: "text-blue-600" },
      { text: "Développer", expr: "6x + 2 + 4x - 2", color: "text-orange-600" },
      { text: "Regrouper", expr: "6x + 4x + 2 - 2", color: "text-purple-600" },
      { text: "Résultat final", expr: "10x", color: "text-green-600" }
    ]
  },
  {
    id: 17,
    question: "3(2ab - 1) - (ab + 4)",
    steps: [
      { text: "Expression de départ", expr: "3(2ab - 1) - (ab + 4)", color: "text-blue-600" },
      { text: "Développer", expr: "6ab - 3 - ab - 4", color: "text-orange-600" },
      { text: "Regrouper", expr: "6ab - ab - 3 - 4", color: "text-purple-600" },
      { text: "Résultat final", expr: "5ab - 7", color: "text-green-600" }
    ]
  },
  {
    id: 18,
    question: "(4y - 2) - (y + 3) + 5y",
    steps: [
      { text: "Expression de départ", expr: "(4y - 2) - (y + 3) + 5y", color: "text-blue-600" },
      { text: "Développer", expr: "4y - 2 - y - 3 + 5y", color: "text-orange-600" },
      { text: "Regrouper", expr: "4y - y + 5y - 2 - 3", color: "text-purple-600" },
      { text: "Résultat final", expr: "8y - 5", color: "text-green-600" }
    ]
  },

  // Niveau 7 : Introduction des triplets (exercices 19-21)
  {
    id: 19,
    question: "2xyz + 5xyz - 3xyz",
    steps: [
      { text: "Expression de départ", expr: "2xyz + 5xyz - 3xyz", color: "text-blue-600" },
      { text: "Termes semblables (triplet)", expr: "(2 + 5 - 3)xyz", color: "text-orange-600" },
      { text: "Résultat final", expr: "4xyz", color: "text-green-600" }
    ]
  },
  {
    id: 20,
    question: "3x + 2abc - 5x + 4abc - x",
    steps: [
      { text: "Expression de départ", expr: "3x + 2abc - 5x + 4abc - x", color: "text-blue-600" },
      { text: "Regrouper par types", expr: "3x - 5x - x + 2abc + 4abc", color: "text-orange-600" },
      { text: "Résultat final", expr: "-3x + 6abc", color: "text-green-600" }
    ]
  },
  {
    id: 21,
    question: "-abc + 6xyz - 2abc + 3xyz + 5abc",
    steps: [
      { text: "Expression de départ", expr: "-abc + 6xyz - 2abc + 3xyz + 5abc", color: "text-blue-600" },
      { text: "Regrouper par types", expr: "-abc - 2abc + 5abc + 6xyz + 3xyz", color: "text-orange-600" },
      { text: "Résultat final", expr: "2abc + 9xyz", color: "text-green-600" }
    ]
  },

  // Niveau 8 : Mélanges avancés (exercices 22-24)
  {
    id: 22,
    question: "2(xy + 3) - 3(2xy - 1) + 4xy",
    steps: [
      { text: "Expression de départ", expr: "2(xy + 3) - 3(2xy - 1) + 4xy", color: "text-blue-600" },
      { text: "Développer", expr: "2xy + 6 - 6xy + 3 + 4xy", color: "text-orange-600" },
      { text: "Regrouper", expr: "2xy - 6xy + 4xy + 6 + 3", color: "text-purple-600" },
      { text: "Résultat final", expr: "0xy + 9 = 9", color: "text-green-600" }
    ]
  },
  {
    id: 23,
    question: "4pq - 3rs + 2pq + 5rs - 7pq - rs",
    steps: [
      { text: "Expression de départ", expr: "4pq - 3rs + 2pq + 5rs - 7pq - rs", color: "text-blue-600" },
      { text: "Regrouper par couples", expr: "4pq + 2pq - 7pq - 3rs + 5rs - rs", color: "text-orange-600" },
      { text: "Résultat final", expr: "-pq + rs", color: "text-green-600" }
    ]
  },
  {
    id: 24,
    question: "-(2ab + 3x - 1) + 4(ab - x + 2)",
    steps: [
      { text: "Expression de départ", expr: "-(2ab + 3x - 1) + 4(ab - x + 2)", color: "text-blue-600" },
      { text: "Développer", expr: "-2ab - 3x + 1 + 4ab - 4x + 8", color: "text-orange-600" },
      { text: "Regrouper", expr: "-2ab + 4ab - 3x - 4x + 1 + 8", color: "text-purple-600" },
      { text: "Résultat final", expr: "2ab - 7x + 9", color: "text-green-600" }
    ]
  },

  // Niveau 9 : Complexité croissante (exercices 25-27)
  {
    id: 25,
    question: "3(2xyz + ab - 2) - 2(xyz - 3ab + 1) + 5ab",
    steps: [
      { text: "Expression de départ", expr: "3(2xyz + ab - 2) - 2(xyz - 3ab + 1) + 5ab", color: "text-blue-600" },
      { text: "Développer", expr: "6xyz + 3ab - 6 - 2xyz + 6ab - 2 + 5ab", color: "text-orange-600" },
      { text: "Regrouper par types", expr: "6xyz - 2xyz + 3ab + 6ab + 5ab - 6 - 2", color: "text-purple-600" },
      { text: "Résultat final", expr: "4xyz + 14ab - 8", color: "text-green-600" }
    ]
  },
  {
    id: 26,
    question: "-2(3mn + xy - 4) + 5(mn - 2xy + 1) - 3mn",
    steps: [
      { text: "Expression de départ", expr: "-2(3mn + xy - 4) + 5(mn - 2xy + 1) - 3mn", color: "text-blue-600" },
      { text: "Développer", expr: "-6mn - 2xy + 8 + 5mn - 10xy + 5 - 3mn", color: "text-orange-600" },
      { text: "Regrouper par types", expr: "-6mn + 5mn - 3mn - 2xy - 10xy + 8 + 5", color: "text-purple-600" },
      { text: "Résultat final", expr: "-4mn - 12xy + 13", color: "text-green-600" }
    ]
  },
  {
    id: 27,
    question: "2abcd - 3abcd + 5abcd - abcd",
    steps: [
      { text: "Expression de départ", expr: "2abcd - 3abcd + 5abcd - abcd", color: "text-blue-600" },
      { text: "Termes semblables (4 lettres)", expr: "(2 - 3 + 5 - 1)abcd", color: "text-orange-600" },
      { text: "Résultat final", expr: "3abcd", color: "text-green-600" }
    ]
  },

  // Niveau 10 : Défis finaux (exercices 28-30)
  {
    id: 28,
    question: "4(2xy + 3z - 1) - 3(xy + 2z + 2) + 2(3xy - z + 4)",
    steps: [
      { text: "Expression de départ", expr: "4(2xy + 3z - 1) - 3(xy + 2z + 2) + 2(3xy - z + 4)", color: "text-blue-600" },
      { text: "Développer", expr: "8xy + 12z - 4 - 3xy - 6z - 6 + 6xy - 2z + 8", color: "text-orange-600" },
      { text: "Regrouper par types", expr: "8xy - 3xy + 6xy + 12z - 6z - 2z - 4 - 6 + 8", color: "text-purple-600" },
      { text: "Résultat final", expr: "11xy + 4z - 2", color: "text-green-600" }
    ]
  },
  {
    id: 29,
    question: "-(3pqr + 2ab - 5x) + 2(pqr - 4ab + 3x) - (2pqr + ab - x)",
    steps: [
      { text: "Expression de départ", expr: "-(3pqr + 2ab - 5x) + 2(pqr - 4ab + 3x) - (2pqr + ab - x)", color: "text-blue-600" },
      { text: "Développer", expr: "-3pqr - 2ab + 5x + 2pqr - 8ab + 6x - 2pqr - ab + x", color: "text-orange-600" },
      { text: "Regrouper par types", expr: "-3pqr + 2pqr - 2pqr - 2ab - 8ab - ab + 5x + 6x + x", color: "text-purple-600" },
      { text: "Résultat final", expr: "-3pqr - 11ab + 12x", color: "text-green-600" }
    ]
  },
  {
    id: 30,
    question: "3(2uvw + 4mn - 3xy + 1) - 2(3uvw - 2mn + 5xy - 2) + (uvw + 7xy)",
    steps: [
      { text: "Expression de départ", expr: "3(2uvw + 4mn - 3xy + 1) - 2(3uvw - 2mn + 5xy - 2) + (uvw + 7xy)", color: "text-blue-600" },
      { text: "Développer", expr: "6uvw + 12mn - 9xy + 3 - 6uvw + 4mn - 10xy + 4 + uvw + 7xy", color: "text-orange-600" },
      { text: "Regrouper par types", expr: "6uvw - 6uvw + uvw + 12mn + 4mn - 9xy - 10xy + 7xy + 3 + 4", color: "text-purple-600" },
      { text: "Résultat final", expr: "uvw + 16mn - 12xy + 7", color: "text-green-600" }
    ]
  }
]

// Données des exercices de multiplication - 30 exercices avec progression complexe
const normalMultiplicationExercises = [
  // Niveau 1 : Bases simples (exercices 1-3)
  {
    id: 1,
    question: "3 × x",
    steps: [
      { text: "Expression de départ", expr: "3 × x", color: "text-blue-600" },
      { text: "Coefficient devant variable", expr: "3x", color: "text-purple-600" }
    ]
  },
  {
    id: 2,
    question: "x × y",
    steps: [
      { text: "Expression de départ", expr: "x × y", color: "text-blue-600" },
      { text: "Variables côte à côte", expr: "xy", color: "text-purple-600" }
    ]
  },
  {
    id: 3,
    question: "2x × 3",
    steps: [
      { text: "Expression de départ", expr: "2x × 3", color: "text-blue-600" },
      { text: "Multiplier coefficients", expr: "6x", color: "text-purple-600" }
    ]
  },

  // Niveau 2 : Variables identiques avec puissances (exercices 4-6)
  {
    id: 4,
    question: "x × x",
    steps: [
      { text: "Expression de départ", expr: "x × x", color: "text-blue-600" },
      { text: "Variables identiques", expr: "x¹ × x¹", color: "text-orange-600" },
      { text: "Addition des puissances", expr: "x²", color: "text-purple-600" }
    ]
  },
  {
    id: 5,
    question: "3x × 2x",
    steps: [
      { text: "Expression de départ", expr: "3x × 2x", color: "text-blue-600" },
      { text: "Coefficients : 3 × 2 = 6", expr: "6 × x × x", color: "text-orange-600" },
      { text: "Puissance : x × x = x²", expr: "6x²", color: "text-purple-600" }
    ]
  },
  {
    id: 6,
    question: "x² × x³",
    steps: [
      { text: "Expression de départ", expr: "x² × x³", color: "text-blue-600" },
      { text: "Addition des puissances", expr: "x^(2+3)", color: "text-orange-600" },
      { text: "Résultat final", expr: "x⁵", color: "text-purple-600" }
    ]
  },

  // Niveau 3 : Multivariables basiques (exercices 7-9)
  {
    id: 7,
    question: "2x × 3y",
    steps: [
      { text: "Expression de départ", expr: "2x × 3y", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × x × y", color: "text-orange-600" },
      { text: "Résultat final", expr: "6xy", color: "text-purple-600" }
    ]
  },
  {
    id: 8,
    question: "xy × 2z",
    steps: [
      { text: "Expression de départ", expr: "xy × 2z", color: "text-blue-600" },
      { text: "Coefficient et variables", expr: "2 × x × y × z", color: "text-orange-600" },
      { text: "Résultat final", expr: "2xyz", color: "text-purple-600" }
    ]
  },
  {
    id: 9,
    question: "4ab × 3c",
    steps: [
      { text: "Expression de départ", expr: "4ab × 3c", color: "text-blue-600" },
      { text: "Coefficients : 4 × 3 = 12", expr: "12 × ab × c", color: "text-orange-600" },
      { text: "Résultat final", expr: "12abc", color: "text-purple-600" }
    ]
  },

  // Niveau 4 : Introduction des négatifs (exercices 10-12)
  {
    id: 10,
    question: "-2x × 3y",
    steps: [
      { text: "Expression de départ", expr: "-2x × 3y", color: "text-blue-600" },
      { text: "Signes : (-) × (+) = (-)", expr: "-(2 × 3) × x × y", color: "text-red-600" },
      { text: "Résultat final", expr: "-6xy", color: "text-purple-600" }
    ]
  },
  {
    id: 11,
    question: "-3a × -4b",
    steps: [
      { text: "Expression de départ", expr: "-3a × -4b", color: "text-blue-600" },
      { text: "Signes : (-) × (-) = (+)", expr: "+(3 × 4) × a × b", color: "text-red-600" },
      { text: "Résultat final", expr: "12ab", color: "text-purple-600" }
    ]
  },
  {
    id: 12,
    question: "-x × y²",
    steps: [
      { text: "Expression de départ", expr: "-x × y²", color: "text-blue-600" },
      { text: "Coefficient -1 implicite", expr: "-1 × x × y²", color: "text-orange-600" },
      { text: "Résultat final", expr: "-xy²", color: "text-purple-600" }
    ]
  },

  // Niveau 5 : Puissances complexes (exercices 13-15)
  {
    id: 13,
    question: "x² × y × x³",
    steps: [
      { text: "Expression de départ", expr: "x² × y × x³", color: "text-blue-600" },
      { text: "Regrouper les x", expr: "x² × x³ × y", color: "text-orange-600" },
      { text: "Addition des puissances", expr: "x⁵y", color: "text-purple-600" }
    ]
  },
  {
    id: 14,
    question: "2x³ × 3x²y",
    steps: [
      { text: "Expression de départ", expr: "2x³ × 3x²y", color: "text-blue-600" },
      { text: "Coefficients : 2 × 3 = 6", expr: "6 × x³ × x²y", color: "text-orange-600" },
      { text: "Puissances : x³ × x² = x⁵", expr: "6x⁵y", color: "text-purple-600" }
    ]
  },
  {
    id: 15,
    question: "-5x²y × 2xy³",
    steps: [
      { text: "Expression de départ", expr: "-5x²y × 2xy³", color: "text-blue-600" },
      { text: "Signes et coefficients", expr: "-10 × x²y × xy³", color: "text-red-600" },
      { text: "Puissances : x²⁺¹ × y¹⁺³", expr: "-10x³y⁴", color: "text-purple-600" }
    ]
  },

  // Niveau 6 : Distributivité simple (exercices 16-18)
  {
    id: 16,
    question: "x(2 + 3)",
    steps: [
      { text: "Expression de départ", expr: "x(2 + 3)", color: "text-blue-600" },
      { text: "Distributivité", expr: "x × 2 + x × 3", color: "text-orange-600" },
      { text: "Résultat final", expr: "2x + 3x = 5x", color: "text-purple-600" }
    ]
  },
  {
    id: 17,
    question: "2x(y + 3)",
    steps: [
      { text: "Expression de départ", expr: "2x(y + 3)", color: "text-blue-600" },
      { text: "Distributivité", expr: "2x × y + 2x × 3", color: "text-orange-600" },
      { text: "Résultat final", expr: "2xy + 6x", color: "text-purple-600" }
    ]
  },
  {
    id: 18,
    question: "3(2a + b)",
    steps: [
      { text: "Expression de départ", expr: "3(2a + b)", color: "text-blue-600" },
      { text: "Distributivité", expr: "3 × 2a + 3 × b", color: "text-orange-600" },
      { text: "Résultat final", expr: "6a + 3b", color: "text-purple-600" }
    ]
  },

  // Niveau 7 : Distributivité avec négatifs (exercices 19-21)
  {
    id: 19,
    question: "-2(x + 3)",
    steps: [
      { text: "Expression de départ", expr: "-2(x + 3)", color: "text-blue-600" },
      { text: "Distributivité négative", expr: "-2 × x + (-2) × 3", color: "text-red-600" },
      { text: "Résultat final", expr: "-2x - 6", color: "text-purple-600" }
    ]
  },
  {
    id: 20,
    question: "x(-3y + 2)",
    steps: [
      { text: "Expression de départ", expr: "x(-3y + 2)", color: "text-blue-600" },
      { text: "Distributivité", expr: "x × (-3y) + x × 2", color: "text-orange-600" },
      { text: "Résultat final", expr: "-3xy + 2x", color: "text-purple-600" }
    ]
  },
  {
    id: 21,
    question: "-4x(2y - 3z)",
    steps: [
      { text: "Expression de départ", expr: "-4x(2y - 3z)", color: "text-blue-600" },
      { text: "Distributivité", expr: "-4x × 2y + (-4x) × (-3z)", color: "text-red-600" },
      { text: "Simplifier signes", expr: "-8xy + 12xz", color: "text-purple-600" }
    ]
  },

  // Niveau 8 : Distributivité complexe (exercices 22-24)
  {
    id: 22,
    question: "2x(3y² + 4z)",
    steps: [
      { text: "Expression de départ", expr: "2x(3y² + 4z)", color: "text-blue-600" },
      { text: "Distributivité", expr: "2x × 3y² + 2x × 4z", color: "text-orange-600" },
      { text: "Résultat final", expr: "6xy² + 8xz", color: "text-purple-600" }
    ]
  },
  {
    id: 23,
    question: "-3xy(2x + y²)",
    steps: [
      { text: "Expression de départ", expr: "-3xy(2x + y²)", color: "text-blue-600" },
      { text: "Distributivité", expr: "-3xy × 2x + (-3xy) × y²", color: "text-orange-600" },
      { text: "Puissances et signes", expr: "-6x²y - 3xy³", color: "text-purple-600" }
    ]
  },
  {
    id: 24,
    question: "ab(2a² - 3b + 4)",
    steps: [
      { text: "Expression de départ", expr: "ab(2a² - 3b + 4)", color: "text-blue-600" },
      { text: "Distributivité", expr: "ab × 2a² + ab × (-3b) + ab × 4", color: "text-orange-600" },
      { text: "Résultat final", expr: "2a³b - 3ab² + 4ab", color: "text-purple-600" }
    ]
  },

  // Niveau 9 : Défis avancés (exercices 25-27)
  {
    id: 25,
    question: "-2x²(3xy - 4y² + 5)",
    steps: [
      { text: "Expression de départ", expr: "-2x²(3xy - 4y² + 5)", color: "text-blue-600" },
      { text: "Distributivité", expr: "-2x² × 3xy + (-2x²) × (-4y²) + (-2x²) × 5", color: "text-orange-600" },
      { text: "Calculer chaque terme", expr: "-6x³y + 8x²y² - 10x²", color: "text-purple-600" }
    ]
  },
  {
    id: 26,
    question: "3abc(-2a + b² - 4c)",
    steps: [
      { text: "Expression de départ", expr: "3abc(-2a + b² - 4c)", color: "text-blue-600" },
      { text: "Distributivité", expr: "3abc × (-2a) + 3abc × b² + 3abc × (-4c)", color: "text-orange-600" },
      { text: "Résultat final", expr: "-6a²bc + 3ab³c - 12abc²", color: "text-purple-600" }
    ]
  },
  {
    id: 27,
    question: "-x²y³(2x² - 3xy + y²)",
    steps: [
      { text: "Expression de départ", expr: "-x²y³(2x² - 3xy + y²)", color: "text-blue-600" },
      { text: "Distributivité", expr: "-x²y³ × 2x² + (-x²y³) × (-3xy) + (-x²y³) × y²", color: "text-orange-600" },
      { text: "Résultat final", expr: "-2x⁴y³ + 3x³y⁴ - x²y⁵", color: "text-purple-600" }
    ]
  },

  // Niveau 10 : Défis ultra-complexes (exercices 28-30)
  {
    id: 28,
    question: "2xy(-3x²y + 4xy² - 5y³ + 2)",
    steps: [
      { text: "Expression de départ", expr: "2xy(-3x²y + 4xy² - 5y³ + 2)", color: "text-blue-600" },
      { text: "Distributivité complète", expr: "2xy×(-3x²y) + 2xy×4xy² + 2xy×(-5y³) + 2xy×2", color: "text-orange-600" },
      { text: "Calculer puissances", expr: "-6x³y² + 8x²y³ - 10xy⁴ + 4xy", color: "text-purple-600" }
    ]
  },
  {
    id: 29,
    question: "-4a²b³(2a³ - 3a²b + ab² - b³ + 3)",
    steps: [
      { text: "Expression de départ", expr: "-4a²b³(2a³ - 3a²b + ab² - b³ + 3)", color: "text-blue-600" },
      { text: "Distributivité", expr: "-4a²b³ distribué sur 5 termes", color: "text-orange-600" },
      { text: "Résultat final", expr: "-8a⁵b³ + 12a⁴b⁴ - 4a³b⁵ + 4a²b⁶ - 12a²b³", color: "text-purple-600" }
    ]
  },
  {
    id: 30,
    question: "3x²y²z(-2x³ + 4x²y - 3xy² + 2y³ - 5z)",
    steps: [
      { text: "Expression de départ", expr: "3x²y²z(-2x³ + 4x²y - 3xy² + 2y³ - 5z)", color: "text-blue-600" },
      { text: "Distributivité sur 5 termes", expr: "3x²y²z distribué sur chaque terme", color: "text-orange-600" },
      { text: "Résultat final", expr: "-6x⁵y²z + 12x⁴y³z - 9x³y⁴z + 6x²y⁵z - 15x²y²z²", color: "text-purple-600" }
    ]
  }
]

export default function ReglesCalculPage() {
  const [mainTab, setMainTab] = useState<'addition' | 'multiplication'>('addition')
  const [subTab, setSubTab] = useState<'cours' | 'exercices'>('cours')
  const [activeExerciseSet, setActiveExerciseSet] = useState('normal')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [score, setScore] = useState(0)
  const [showSteps, setShowSteps] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [solutionStep, setSolutionStep] = useState(0)
  
  // États pour l'animation SCL
  const [sclStep, setSclStep] = useState(0)
  const [sclAnimating, setSclAnimating] = useState(false)
  const [sclPowerStep, setSclPowerStep] = useState(0)
  const [sclPowerAnimating, setSclPowerAnimating] = useState(false)
  
  // États pour les animations d'addition avec négatifs
  const [negativeStep1, setNegativeStep1] = useState(0)
  const [negativeAnimating1, setNegativeAnimating1] = useState(false)
  const [negativeStep2, setNegativeStep2] = useState(0)
  const [negativeAnimating2, setNegativeAnimating2] = useState(false)

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
    if (currentStep < normalExercises[currentExercise].steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const nextExercise = () => {
    if (currentExercise < normalExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setCurrentStep(0)
      setShowSteps(false)
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setCurrentStep(0)
      setShowSteps(false)
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
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl">
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
                <div className="text-xl font-semibold text-blue-600">12 minutes</div>
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
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
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
                <div className="w-6 h-0.5 bg-blue-300"></div>
                <span className="text-base font-medium text-blue-600">
                  Sections pour {mainTab === 'addition' ? 'Addition' : 'Multiplication'}
                </span>
                <div className="w-6 h-0.5 bg-blue-300"></div>
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
              <h2 className="text-2xl font-bold text-green-800 mb-6">➕ Règle de base : Rappel</h2>
              
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

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">📘 Exemple : 2x + 3x = 5x</h4>
                      <p className="text-blue-700 mb-2">
                        Les deux termes ont la même variable (x) avec la même puissance (1)
                      </p>
                      <p className="text-blue-600 text-sm">
                        On additionne les coefficients : 2 + 3 = 5
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-3">⚠️ Attention : 2x + 3y ≠ 5xy</h4>
                      <p className="text-orange-700 mb-2">
                        Variables différentes : impossible de simplifier
                      </p>
                      <p className="text-orange-600 text-sm">
                        Le résultat reste : 2x + 3y
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cas particuliers avec nombres négatifs */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border border-red-200">
              <h2 className="text-2xl font-bold text-red-800 mb-6">🔴 Cas particuliers : Nombres négatifs</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-red-100">
                  <div className="space-y-6">
                    {/* Animation 1: -5x - (-8x) */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-xl font-bold text-blue-800 mb-6 text-center">📘 Cas 1 : Moins devant parenthèse</h3>
                      
                      <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 mb-6">
                        <p className="text-blue-700 font-medium text-center text-lg">
                          <strong className="text-red-700">Moins devant parenthèse</strong> = <strong className="text-green-700">change le signe</strong>
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <h4 className="text-lg font-semibold text-blue-800">
                            Animation : -5x - (-8x)
                          </h4>
                          <button
                            onClick={() => {
                              setNegativeStep1(0)
                              setNegativeAnimating1(true)
                              setTimeout(() => setNegativeStep1(1), 2000)
                              setTimeout(() => setNegativeStep1(2), 4000)
                              setTimeout(() => setNegativeStep1(3), 6000)
                              setTimeout(() => setNegativeAnimating1(false), 7000)
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            {negativeAnimating1 ? 'Animation en cours...' : 'Démarrer l\'animation'}
                          </button>
                        </div>
                        
                        <div className="space-y-6 relative min-h-[300px]">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="font-mono text-lg text-center text-gray-800 space-y-4">
                              {/* Étape 0 : Expression de départ */}
                              <div className={`transition-all duration-1000 ${negativeStep1 >= 0 ? 'opacity-100' : 'opacity-0'}`}>
                                <span className="text-gray-700 text-xl font-semibold">-5x - (-8x)</span>
                              </div>
                              
                              {/* Étape 1 : Identifier le moins devant parenthèse */}
                              {negativeStep1 >= 1 && (
                                <div className="transition-all duration-1000 opacity-100">
                                  <span className="text-gray-700">-5x </span>
                                  <span className="text-red-600 font-bold text-2xl animate-pulse">-</span>
                                  <span className="text-gray-700"> (-8x)</span>
                                  <div className="text-sm text-red-600 mt-2">
                                    ⚠️ Moins devant parenthèse : change le signe !
                                  </div>
                                </div>
                              )}
                              
                              {/* Étape 2 : Transformer */}
                              {negativeStep1 >= 2 && (
                                <div className="transition-all duration-1000 opacity-100">
                                  <span className="text-gray-700">-5x </span>
                                  <span className="text-green-600 font-bold">+</span>
                                  <span className="text-green-600 font-bold"> 8x</span>
                                  <div className="text-sm text-green-600 mt-2">
                                    ✅ -(-8x) devient +8x
                                  </div>
                                </div>
                              )}
                              
                              {/* Étape 3 : Résultat final */}
                              {negativeStep1 >= 3 && (
                                <div className="transition-all duration-1000 opacity-100">
                                  <span className="text-purple-600 font-bold text-2xl animate-bounce">3x</span>
                                  <div className="text-sm text-purple-600 mt-2">
                                    Résultat final !
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animation 2: -8x - 3x */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                      <h3 className="text-xl font-bold text-purple-800 mb-6 text-center">📗 Cas 2 : Nombres négatifs simples</h3>
                      


                      <div className="bg-white rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <h4 className="text-lg font-semibold text-purple-800">
                            Animation : -8x - 3x
                          </h4>
                          <button
                            onClick={() => {
                              setNegativeStep2(0)
                              setNegativeAnimating2(true)
                              setTimeout(() => setNegativeStep2(1), 2000)
                              setTimeout(() => setNegativeStep2(2), 4000)
                              setTimeout(() => setNegativeStep2(3), 6000)
                              setTimeout(() => setNegativeAnimating2(false), 7000)
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                          >
                            {negativeAnimating2 ? 'Animation en cours...' : 'Démarrer l\'animation'}
                          </button>
                        </div>
                        
                        <div className="space-y-6 relative min-h-[300px]">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="font-mono text-lg text-center text-gray-800 space-y-4">
                              {/* Étape 0 : Expression de départ */}
                              <div className={`transition-all duration-1000 ${negativeStep2 >= 0 ? 'opacity-100' : 'opacity-0'}`}>
                                <span className="text-gray-700 text-xl font-semibold">-8x - 3x</span>
                              </div>
                              
                              {/* Étape 1 : Identifier la soustraction */}
                              {negativeStep2 >= 1 && (
                                <div className="transition-all duration-1000 opacity-100">
                                  <span className="text-red-600 font-bold">-8x</span>
                                  <span className="text-orange-600 font-bold text-2xl animate-pulse"> - </span>
                                  <span className="text-blue-600 font-bold">3x</span>
                                  <div className="text-sm text-orange-600 mt-2">
                                    💡 Soustraire = Ajouter l'opposé
                                  </div>
                                </div>
                              )}
                              
                              {/* Étape 2 : Transformer en addition */}
                              {negativeStep2 >= 2 && (
                                <div className="transition-all duration-1000 opacity-100">
                                  <span className="text-red-600 font-bold">-8x</span>
                                  <span className="text-green-600 font-bold"> + </span>
                                  <span className="text-green-600 font-bold">(-3x)</span>
                                  <div className="text-sm text-green-600 mt-2">
                                    ✅ - 3x devient + (-3x)
                                  </div>
                                </div>
                              )}
                              
                              {/* Étape 3 : Résultat final */}
                              {negativeStep2 >= 3 && (
                                <div className="transition-all duration-1000 opacity-100">
                                  <span className="text-purple-600 font-bold text-2xl animate-bounce">-11x</span>
                                  <div className="text-sm text-purple-600 mt-2">
                                    Résultat final !
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Récapitulatif */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-xl font-bold text-green-800 mb-4 text-center">📝 Récapitulatif des règles</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                          <h4 className="font-semibold text-green-800 mb-2">Règle 1 : Moins devant parenthèse</h4>
                          <p className="text-green-700 text-sm mb-2">
                            <strong>-(-8x) = +8x</strong>
                          </p>
                          <p className="text-green-600 text-xs">
                            Deux signes moins se transforment en plus
                          </p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-green-100">
                          <h4 className="font-semibold text-green-800 mb-2">Règle 2 : Soustraction</h4>
                          <p className="text-green-700 text-sm mb-2">
                            <strong>-8x - 3x = -8x + (-3x)</strong>
                          </p>
                          <p className="text-green-600 text-xs">
                            Soustraire = Ajouter l'opposé
                          </p>
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
            {/* Exercices Addition */}
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
                      {normalExercises[currentExercise].steps.map((step: any, index: any) => (
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
          </div>
        )}

        {/* Contenu Multiplication - Cours */}
        {mainTab === 'multiplication' && subTab === 'cours' && (
          <div className="space-y-8">
            {/* Règles de calcul Multiplication */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-800 mb-6">✖️ Règle de base : Rappel</h2>
              
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
                            Animation : -2x × x²
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
                                <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">-2x × x²</span>
                              </div>
                              
                              {/* Éléments qui glissent */}
                              <span id="minus-sign" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 1 ? 'transform translate-x-[-8.85rem] translate-y-28 text-red-900 scale-125 opacity-100' : 'opacity-0'
                              }`}>-</span>
                              <span id="number-2" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 2 ? 'transform translate-x-[-9.83rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                              }`}>2</span>
                              <span id="letters-1" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 3 ? 'transform translate-x-[-10.715rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                              }`}>x</span>
                              <span className={`mx-2 transition-opacity duration-1000 ${sclStep >= 1 ? 'opacity-30' : 'opacity-100'} ${sclStep >= 3 ? 'opacity-0' : ''}`}>×</span>
                              <span id="plus-sign-implicit" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 1 ? 'transform translate-x-[-8.84rem] translate-y-28 text-red-700 scale-110 opacity-100' : 'opacity-0'
                              }`}>+</span>
                              <span id="number-1" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 2 ? 'transform translate-x-[-9.825rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                              }`}>1</span>
                              <span id="letters-2" className={`inline-block transition-all duration-1000 ${
                                sclStep >= 3 ? 'transform translate-x-[-10.712rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                              }`}>x²</span>
                            </div>
                            
                          {/* Calculs qui apparaissent quand les éléments glissent */}
                          {sclStep >= 2 && (
                            <div className="absolute top-32 left-1/2 transform -translate-x-4">
                              <span className="text-red-600 font-bold text-3xl">- × + = <span className="bg-red-50 px-2 py-1 rounded-lg border-2 border-red-200">-</span></span>
                            </div>
                          )}
                          {sclStep >= 3 && (
                            <div className="absolute top-48 left-1/2 transform -translate-x-4">
                              <span className="text-green-600 font-bold text-3xl">2 × 1 = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">2</span></span>
                            </div>
                          )}
                          {sclStep >= 4 && (
                            <div className="absolute top-64 left-1/2 transform -translate-x-4">
                              <span className="text-purple-600 font-bold text-3xl">x × x² = <span className="bg-purple-50 px-2 py-1 rounded-lg border-2 border-purple-200">x³</span></span>
                            </div>
                          )}
                          
                          {/* Résultat final */}
                          {sclStep >= 6 && (
                            <div className="absolute top-80 left-1/2 transform -translate-x-3/4">
                              <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : -2x³</span>
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
                            Animation : -6x²y × -3xy³
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
                              <span className="text-gray-700 text-lg font-semibold bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm">-6x²y × -3xy³</span>
                            </div>
                            
                            {/* Éléments qui glissent */}
                            <span id="minus-sign-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 1 ? 'transform translate-x-[-8.85rem] translate-y-28 text-red-900 scale-125 opacity-100' : 'opacity-0'
                            }`}>-</span>
                            <span id="number-6-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 2 ? 'transform translate-x-[-9.83rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                            }`}>6</span>
                            <span id="letters-x2y-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 3 ? 'transform translate-x-[-10.715rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                            }`}>x²y</span>
                            <span className={`mx-2 text-gray-800 transition-opacity duration-1000 ${sclPowerStep >= 1 ? 'opacity-30' : 'opacity-100'} ${sclPowerStep >= 3 ? 'opacity-0' : ''}`}>×</span>
                            <span id="minus-sign-power2" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 1 ? 'transform translate-x-[-8.84rem] translate-y-28 text-red-700 scale-110 opacity-100' : 'opacity-0'
                            }`}>-</span>
                            <span id="number-3-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 2 ? 'transform translate-x-[-9.825rem] translate-y-44 text-green-600 scale-125 opacity-100' : 'opacity-0'
                            }`}>3</span>
                            <span id="letters-xy3-power" className={`inline-block transition-all duration-1000 ${
                              sclPowerStep >= 3 ? 'transform translate-x-[-10.712rem] translate-y-60 text-purple-600 scale-110 opacity-100' : 'opacity-0'
                            }`}>xy³</span>
                          </div>
                          
                        {/* Calculs qui apparaissent quand les éléments glissent */}
                        {sclPowerStep >= 2 && (
                          <div className="absolute top-32 left-1/2 transform -translate-x-4">
                            <span className="text-green-600 font-bold text-3xl">- × - = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">+</span></span>
                          </div>
                        )}
                        {sclPowerStep >= 3 && (
                          <div className="absolute top-48 left-1/2 transform -translate-x-4">
                            <span className="text-green-600 font-bold text-3xl">6 × 3 = <span className="bg-green-50 px-2 py-1 rounded-lg border-2 border-green-200">18</span></span>
                          </div>
                        )}
                        {sclPowerStep >= 4 && (
                          <div className="absolute top-64 left-1/2 transform -translate-x-4">
                            <span className="text-purple-600 font-bold text-3xl">x²y × xy³ = <span className="bg-purple-50 px-2 py-1 rounded-lg border-2 border-purple-200">x³y⁴</span></span>
                          </div>
                        )}
                        
                        {/* Résultat final */}
                        {sclPowerStep >= 4 && (
                          <div className="absolute top-80 left-1/2 transform -translate-x-3/4">
                            <span className="text-gray-800 font-bold text-3xl animate-bounce">Résultat : 18x³y⁴</span>
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
                  <li>• <strong>x² × x³ = x⁵</strong> (addition des puissances : 2+3=5)</li>
                  <li>• <strong>(-) × (-) = (+)</strong> et <strong>(-) × (+) = (-)</strong> (règles des signes)</li>
                  <li>• <strong>x × x = x²</strong> (addition des puissances : 1+1=2)</li>
                  <li>• <strong>-2x × 3y = -6xy</strong> (signes : (-) × (+) = (-))</li>
                  <li>• <strong>-3a × -4b = 12ab</strong> (signes : (-) × (-) = (+))</li>
                  <li>• <strong>2x(y + 3) = 2xy + 6x</strong> (distributivité simple)</li>
                  <li>• <strong>-2(x + 3) = -2x - 6</strong> (distributivité négative)</li>
                  <li>• <strong>3xy(2x - y²) = 6x²y - 3xy³</strong> (distributivité complexe)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Contenu Multiplication - Exercices */}
        {mainTab === 'multiplication' && subTab === 'exercices' && (
          <div className="space-y-6">
            {/* Exercices Multiplication */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  📝 Exercices Multiplication
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
                          {currentEx.steps.map((step: any, index: any) => {
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