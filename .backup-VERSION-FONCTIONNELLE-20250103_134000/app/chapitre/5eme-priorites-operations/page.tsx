'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, Pause } from 'lucide-react'
import Link from 'next/link'

export default function PrioritesOperationsPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [exerciseType, setExerciseType] = useState<'numerical' | 'textual'>('numerical')

  const exercises = [
    // Niveau 1 : Priorités simples sans parenthèses
    {
      id: 'prio1',
      question: 'Calculer : 3 + 4 × 2',
      answer: '11',
      steps: [
        'Identifier les opérations : 3 + 4 × 2',
        'Priorité : multiplication avant addition',
        'Appliquer la priorité : 3 + 8',
        'Calculer : 3 + 8 = 11',
        'Résultat final : 11'
      ]
    },
    {
      id: 'prio2',
      question: 'Calculer : 15 - 6 ÷ 3',
      answer: '13',
      steps: [
        'Identifier les opérations : 15 - 6 ÷ 3',
        'Priorité : division avant soustraction',
        'Appliquer la priorité : 15 - 2',
        'Calculer : 15 - 2 = 13',
        'Résultat final : 13'
      ]
    },
    {
      id: 'prio3',
      question: 'Calculer : 2 × 5 + 3',
      answer: '13',
      steps: [
        'Identifier les opérations : 2 × 5 + 3',
        'Priorité : multiplication avant addition',
        'Appliquer la priorité : 10 + 3',
        'Calculer : 10 + 3 = 13',
        'Résultat final : 13'
      ]
    },

    // Niveau 2 : Avec parenthèses
    {
      id: 'prio4',
      question: 'Calculer : (3 + 4) × 2',
      answer: '14',
      steps: [
        'Identifier les parenthèses : (3 + 4) × 2',
        'Priorité : parenthèses en premier',
        'Appliquer la priorité : 7 × 2',
        'Calculer : 7 × 2 = 14',
        'Résultat final : 14'
      ]
    },
    {
      id: 'prio5',
      question: 'Calculer : 15 - (6 + 3)',
      answer: '6',
      steps: [
        'Identifier les parenthèses : 15 - (6 + 3)',
        'Priorité : parenthèses en premier',
        'Appliquer la priorité : 15 - 9',
        'Calculer : 15 - 9 = 6',
        'Résultat final : 6'
      ]
    },
    {
      id: 'prio6',
      question: 'Calculer : (8 - 3) × (2 + 1)',
      answer: '15',
      steps: [
        'Identifier les parenthèses : (8 - 3) × (2 + 1)',
        'Traiter les parenthèses : 5 × 3',
        'Calculer : 5 × 3 = 15',
        'Résultat final : 15'
      ]
    },

    // Niveau 3 : Expressions mixtes
    {
      id: 'prio7',
      question: 'Calculer : 3 + 2 × (4 - 1)',
      answer: '9',
      steps: [
        'Identifier les opérations : 3 + 2 × (4 - 1)',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 3 + 2 × 3',
        'Priorité : multiplication avant addition',
        'Appliquer la priorité : 3 + 6',
        'Calculer : 3 + 6 = 9',
        'Résultat final : 9'
      ]
    },
    {
      id: 'prio8',
      question: 'Calculer : (5 + 3) ÷ 2 + 1',
      answer: '5',
      steps: [
        'Identifier les opérations : (5 + 3) ÷ 2 + 1',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 8 ÷ 2 + 1',
        'Priorité : division avant addition',
        'Appliquer la priorité : 4 + 1',
        'Calculer : 4 + 1 = 5',
        'Résultat final : 5'
      ]
    },
    {
      id: 'prio9',
      question: 'Calculer : 12 - 3 × (2 + 1)',
      answer: '3',
      steps: [
        'Identifier les opérations : 12 - 3 × (2 + 1)',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 12 - 3 × 3',
        'Priorité : multiplication avant soustraction',
        'Appliquer la priorité : 12 - 9',
        'Calculer : 12 - 9 = 3',
        'Résultat final : 3'
      ]
    },

    // Niveau 4 : Nombres relatifs
    {
      id: 'prio10',
      question: 'Calculer : -3 + 4 × 2',
      answer: '5',
      steps: [
        'Identifier les opérations : -3 + 4 × 2',
        'Priorité : multiplication avant addition',
        'Appliquer la priorité : -3 + 8',
        'Calculer : -3 + 8 = 5',
        'Résultat final : 5'
      ]
    },
    {
      id: 'prio11',
      question: 'Calculer : 5 - (-2) × 3',
      answer: '11',
      steps: [
        'Identifier les opérations : 5 - (-2) × 3',
        'Priorité : multiplication avant soustraction',
        'Appliquer la priorité : 5 - (-6)',
        'Calculer : 5 - (-6) = 5 + 6 = 11',
        'Résultat final : 11'
      ]
    },
    {
      id: 'prio12',
      question: 'Calculer : (-3 + 1) × 4',
      answer: '-8',
      steps: [
        'Identifier les opérations : (-3 + 1) × 4',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : (-2) × 4',
        'Calculer : (-2) × 4 = -8',
        'Résultat final : -8'
      ]
    },

    // Niveau 5 : Expressions complexes
    {
      id: 'prio13',
      question: 'Calculer : 2 × (3 + 4) - 5 × 2',
      answer: '4',
      steps: [
        'Identifier les opérations : 2 × (3 + 4) - 5 × 2',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 2 × 7 - 5 × 2',
        'Priorité : multiplications avant soustraction',
        'Appliquer les multiplications : 14 - 10',
        'Calculer : 14 - 10 = 4',
        'Résultat final : 4'
      ]
    },
    {
      id: 'prio14',
      question: 'Calculer : (6 - 2) × (1 + 3) ÷ 2',
      answer: '8',
      steps: [
        'Identifier les opérations : (6 - 2) × (1 + 3) ÷ 2',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 4 × 4 ÷ 2',
        'Priorité : multiplication et division de gauche à droite',
        'Appliquer la multiplication : 16 ÷ 2',
        'Calculer : 16 ÷ 2 = 8',
        'Résultat final : 8'
      ]
    },
    {
      id: 'prio15',
      question: 'Calculer : 3 × (2 + 1) - (4 - 2) × 2',
      answer: '5',
      steps: [
        'Identifier les opérations : 3 × (2 + 1) - (4 - 2) × 2',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 3 × 3 - 2 × 2',
        'Priorité : multiplications avant soustraction',
        'Appliquer les multiplications : 9 - 4',
        'Calculer : 9 - 4 = 5',
        'Résultat final : 5'
      ]
    },

    // Niveau 6 : Expressions avec crochets
    {
      id: 'prio16',
      question: 'Calculer : 10 - [19 - (4 × 3)]',
      answer: '3',
      steps: [
        'Identifier les opérations : 10 - [19 - (4 × 3)]',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 10 - [19 - 12]',
        'Priorité : crochets ensuite',
        'Appliquer les crochets : 10 - 7',
        'Calculer : 10 - 7 = 3',
        'Résultat final : 3'
      ]
    },
    {
      id: 'prio17',
      question: 'Calculer : 2 × (7 - 5) × 3',
      answer: '12',
      steps: [
        'Identifier les opérations : 2 × (7 - 5) × 3',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 2 × 2 × 3',
        'Priorité : multiplications de gauche à droite',
        'Appliquer les multiplications : 4 × 3',
        'Calculer : 4 × 3 = 12',
        'Résultat final : 12'
      ]
    },
    {
      id: 'prio18',
      question: 'Calculer : 35 - [7 + (3 × 6)] - 2',
      answer: '8',
      steps: [
        'Identifier les opérations : 35 - [7 + (3 × 6)] - 2',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 35 - [7 + 18] - 2',
        'Priorité : crochets ensuite',
        'Appliquer les crochets : 35 - 25 - 2',
        'Priorité : soustractions de gauche à droite',
        'Appliquer les soustractions : 10 - 2',
        'Calculer : 10 - 2 = 8',
        'Résultat final : 8'
      ]
    },
    {
      id: 'prio19',
      question: 'Calculer : [35 - [7 + (3 × 6)]] - 2',
      answer: '8',
      steps: [
        'Identifier les opérations : [35 - [7 + (3 × 6)]] - 2',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : [35 - [7 + 18]] - 2',
        'Priorité : crochets intérieurs',
        'Appliquer les crochets intérieurs : [35 - 25] - 2',
        'Priorité : crochets extérieurs',
        'Appliquer les crochets extérieurs : 10 - 2',
        'Calculer : 10 - 2 = 8',
        'Résultat final : 8'
      ]
    },
    {
      id: 'prio20',
      question: 'Calculer : 4 × [5 + (2 × 3) - 1] + 6',
      answer: '46',
      steps: [
        'Identifier les opérations : 4 × [5 + (2 × 3) - 1] + 6',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 4 × [5 + 6 - 1] + 6',
        'Priorité : crochets ensuite',
        'Appliquer les crochets : 4 × 10 + 6',
        'Priorité : multiplication avant addition',
        'Appliquer la multiplication : 40 + 6',
        'Calculer : 40 + 6 = 46',
        'Résultat final : 46'
      ]
    },

    // Niveau 7 : Expressions plus complexes inspirées des images
    {
      id: 'prio21',
      question: 'Calculer : (2 + 4) × 0,5 × 2 - 4',
      answer: '2',
      steps: [
        'Identifier les opérations : (2 + 4) × 0,5 × 2 - 4',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 6 × 0,5 × 2 - 4',
        'Priorité : multiplications de gauche à droite',
        'Appliquer la première multiplication : 3 × 2 - 4',
        'Appliquer la deuxième multiplication : 6 - 4',
        'Calculer : 6 - 4 = 2',
        'Résultat final : 2'
      ]
    },
    {
      id: 'prio22',
      question: 'Calculer : [3 + 2 × (9 - 4)] × (8 + 2)',
      answer: '130',
      steps: [
        'Identifier les opérations : [3 + 2 × (9 - 4)] × (8 + 2)',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : [3 + 2 × 5] × 10',
        'Priorité : multiplication dans les crochets',
        'Appliquer la multiplication : [3 + 10] × 10',
        'Priorité : crochets',
        'Appliquer les crochets : 13 × 10',
        'Calculer : 13 × 10 = 130',
        'Résultat final : 130'
      ]
    },
    {
      id: 'prio23',
      question: 'Calculer : [(2 + 3) × 2 + 1] × 2 - 4',
      answer: '18',
      steps: [
        'Identifier les opérations : [(2 + 3) × 2 + 1] × 2 - 4',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : [5 × 2 + 1] × 2 - 4',
        'Priorité : multiplication dans les crochets',
        'Appliquer la multiplication : [10 + 1] × 2 - 4',
        'Priorité : crochets',
        'Appliquer les crochets : 11 × 2 - 4',
        'Priorité : multiplication avant soustraction',
        'Appliquer la multiplication : 22 - 4',
        'Calculer : 22 - 4 = 18',
        'Résultat final : 18'
      ]
    },
    {
      id: 'prio24',
      question: 'Calculer : (3 × 4 - 8) × (5 - 2 × 2) × 3',
      answer: '12',
      steps: [
        'Identifier les opérations : (3 × 4 - 8) × (5 - 2 × 2) × 3',
        'Priorité : parenthèses en premier',
        'Première parenthèse : (12 - 8) × (5 - 4) × 3',
        'Appliquer les parenthèses : 4 × 1 × 3',
        'Priorité : multiplications de gauche à droite',
        'Appliquer les multiplications : 4 × 3',
        'Calculer : 4 × 3 = 12',
        'Résultat final : 12'
      ]
    },
    {
      id: 'prio25',
      question: 'Calculer : 20 - [(2 × 3 + 1) × 2 - 5]',
      answer: '11',
      steps: [
        'Identifier les opérations : 20 - [(2 × 3 + 1) × 2 - 5]',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 20 - [(6 + 1) × 2 - 5]',
        'Priorité : addition dans les crochets',
        'Appliquer l\'addition : 20 - [7 × 2 - 5]',
        'Priorité : multiplication dans les crochets',
        'Appliquer la multiplication : 20 - [14 - 5]',
        'Priorité : crochets',
        'Appliquer les crochets : 20 - 9',
        'Calculer : 20 - 9 = 11',
        'Résultat final : 11'
      ]
    },
    {
      id: 'prio26',
      question: 'Calculer : (46 - 8 × 5 - 6) × (15 + 32 - 4)',
      answer: '0',
      steps: [
        'Identifier les opérations : (46 - 8 × 5 - 6) × (15 + 32 - 4)',
        'Priorité : parenthèses en premier',
        'Première parenthèse : (46 - 40 - 6) × (47 - 4)',
        'Appliquer les parenthèses : 0 × 43',
        'Calculer : 0 × 43 = 0',
        'Résultat final : 0'
      ]
    },
    {
      id: 'prio27',
      question: 'Calculer : 8 × [(4 + 2) × 3 - 2] + 10',
      answer: '138',
      steps: [
        'Identifier les opérations : 8 × [(4 + 2) × 3 - 2] + 10',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 8 × [6 × 3 - 2] + 10',
        'Priorité : multiplication dans les crochets',
        'Appliquer la multiplication : 8 × [18 - 2] + 10',
        'Priorité : crochets',
        'Appliquer les crochets : 8 × 16 + 10',
        'Priorité : multiplication avant addition',
        'Appliquer la multiplication : 128 + 10',
        'Calculer : 128 + 10 = 138',
        'Résultat final : 138'
      ]
    },
    {
      id: 'prio28',
      question: 'Calculer : (5 × 2 + 3) × [4 - (2 + 1)] + 6',
      answer: '19',
      steps: [
        'Identifier les opérations : (5 × 2 + 3) × [4 - (2 + 1)] + 6',
        'Priorité : parenthèses en premier',
        'Première parenthèse : (10 + 3) × [4 - 3] + 6',
        'Appliquer les parenthèses : 13 × 1 + 6',
        'Priorité : multiplication avant addition',
        'Appliquer la multiplication : 13 + 6',
        'Calculer : 13 + 6 = 19',
        'Résultat final : 19'
      ]
    },
    {
      id: 'prio29',
      question: 'Calculer : [(3 × 2 + 4) × 2 - 6] × 3 + 5',
      answer: '47',
      steps: [
        'Identifier les opérations : [(3 × 2 + 4) × 2 - 6] × 3 + 5',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : [(6 + 4) × 2 - 6] × 3 + 5',
        'Priorité : addition dans les crochets',
        'Appliquer l\'addition : [10 × 2 - 6] × 3 + 5',
        'Priorité : multiplication dans les crochets',
        'Appliquer la multiplication : [20 - 6] × 3 + 5',
        'Priorité : crochets',
        'Appliquer les crochets : 14 × 3 + 5',
        'Priorité : multiplication avant addition',
        'Appliquer la multiplication : 42 + 5',
        'Calculer : 42 + 5 = 47',
        'Résultat final : 47'
      ]
    },
    {
      id: 'prio30',
      question: 'Calculer : 7 × [3 + (4 × 2 - 1) × 2] - 15',
      answer: '104',
      steps: [
        'Identifier les opérations : 7 × [3 + (4 × 2 - 1) × 2] - 15',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 7 × [3 + (8 - 1) × 2] - 15',
        'Priorité : soustraction dans les parenthèses',
        'Appliquer la soustraction : 7 × [3 + 7 × 2] - 15',
        'Priorité : multiplication dans les crochets',
        'Appliquer la multiplication : 7 × [3 + 14] - 15',
        'Priorité : crochets',
        'Appliquer les crochets : 7 × 17 - 15',
        'Priorité : multiplication avant soustraction',
        'Appliquer la multiplication : 119 - 15',
        'Calculer : 119 - 15 = 104',
        'Résultat final : 104'
      ]
    },

    // Niveau 8 : Expressions avec division
    {
      id: 'prio31',
      question: 'Calculer : (15 - 2 - 2 + 2) × (15 ÷ 3 + 24 + 12)',
      answer: '533',
      steps: [
        'Identifier les opérations : (15 - 2 - 2 + 2) × (15 ÷ 3 + 24 + 12)',
        'Priorité : parenthèses en premier',
        'Première parenthèse : 15 - 2 - 2 + 2 = 13',
        'Deuxième parenthèse : 15 ÷ 3 + 24 + 12',
        'Priorité : division avant addition',
        'Appliquer la division : 5 + 24 + 12 = 41',
        'Calculer : 13 × 41 = 533',
        'Résultat final : 533'
      ]
    },
    {
      id: 'prio32',
      question: 'Calculer : 3 + 5 × 4 ÷ 2',
      answer: '13',
      steps: [
        'Identifier les opérations : 3 + 5 × 4 ÷ 2',
        'Priorité : multiplication et division avant addition',
        'Multiplication et division de gauche à droite : 5 × 4 = 20',
        'Continuer : 20 ÷ 2 = 10',
        'Appliquer l\'addition : 3 + 10 = 13',
        'Résultat final : 13'
      ]
    },
    {
      id: 'prio33',
      question: 'Calculer : 18 ÷ 6 + 3 × 2',
      answer: '9',
      steps: [
        'Identifier les opérations : 18 ÷ 6 + 3 × 2',
        'Priorité : division et multiplication avant addition',
        'Appliquer la division : 18 ÷ 6 = 3',
        'Appliquer la multiplication : 3 × 2 = 6',
        'Appliquer l\'addition : 3 + 6 = 9',
        'Résultat final : 9'
      ]
    },
    {
      id: 'prio34',
      question: 'Calculer : 6 × 9 ÷ 18 + 15',
      answer: '18',
      steps: [
        'Identifier les opérations : 6 × 9 ÷ 18 + 15',
        'Priorité : multiplication et division avant addition',
        'Multiplication et division de gauche à droite : 6 × 9 = 54',
        'Continuer : 54 ÷ 18 = 3',
        'Appliquer l\'addition : 3 + 15 = 18',
        'Résultat final : 18'
      ]
    },
    {
      id: 'prio35',
      question: 'Calculer : (24 ÷ 4 + 8) × (9 - 3)',
      answer: '84',
      steps: [
        'Identifier les opérations : (24 ÷ 4 + 8) × (9 - 3)',
        'Priorité : parenthèses en premier',
        'Première parenthèse : 24 ÷ 4 + 8',
        'Priorité : division avant addition',
        'Appliquer la division : 6 + 8 = 14',
        'Deuxième parenthèse : 9 - 3 = 6',
        'Calculer : 14 × 6 = 84',
        'Résultat final : 84'
      ]
    }
  ]

  const textualExercises = [
    {
      id: 'text1',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'La somme du produit de quatre par trois et de huit.',
      answer: '20',
      calculation: '4 × 3 + 8',
      steps: [
        'Identifier les éléments : somme de "produit de quatre par trois" et "huit"',
        'Traduire : 4 × 3 + 8',
        'Priorité : multiplication avant addition',
        'Appliquer la priorité : 12 + 8',
        'Calculer : 12 + 8 = 20',
        'Résultat final : 20'
      ]
    },
    {
      id: 'text2',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'Le produit de cinq par la somme de deux et de sept.',
      answer: '45',
      calculation: '5 × (2 + 7)',
      steps: [
        'Identifier les éléments : produit de "cinq" par "somme de deux et de sept"',
        'Traduire : 5 × (2 + 7)',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 5 × 9',
        'Calculer : 5 × 9 = 45',
        'Résultat final : 45'
      ]
    },
    {
      id: 'text3',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'La différence entre le produit de six par quatre et quinze.',
      answer: '9',
      calculation: '6 × 4 - 15',
      steps: [
        'Identifier les éléments : différence de "produit de six par quatre" et "quinze"',
        'Traduire : 6 × 4 - 15',
        'Priorité : multiplication avant soustraction',
        'Appliquer la priorité : 24 - 15',
        'Calculer : 24 - 15 = 9',
        'Résultat final : 9'
      ]
    },
    {
      id: 'text4',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'Le quotient de la somme de douze et de huit par quatre.',
      answer: '5',
      calculation: '(12 + 8) ÷ 4',
      steps: [
        'Identifier les éléments : quotient de "somme de douze et de huit" par "quatre"',
        'Traduire : (12 + 8) ÷ 4',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 20 ÷ 4',
        'Calculer : 20 ÷ 4 = 5',
        'Résultat final : 5'
      ]
    },
    {
      id: 'text5',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'Le produit de la différence de neuf et de trois par la somme de un et de quatre.',
      answer: '30',
      calculation: '(9 - 3) × (1 + 4)',
      steps: [
        'Identifier les éléments : produit de "différence de neuf et de trois" par "somme de un et de quatre"',
        'Traduire : (9 - 3) × (1 + 4)',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 6 × 5',
        'Calculer : 6 × 5 = 30',
        'Résultat final : 30'
      ]
    },
    {
      id: 'text6',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'La somme du produit de trois par cinq et du quotient de seize par quatre.',
      answer: '19',
      calculation: '3 × 5 + 16 ÷ 4',
      steps: [
        'Identifier les éléments : somme de "produit de trois par cinq" et "quotient de seize par quatre"',
        'Traduire : 3 × 5 + 16 ÷ 4',
        'Priorité : multiplication et division avant addition',
        'Appliquer les priorités : 15 + 4',
        'Calculer : 15 + 4 = 19',
        'Résultat final : 19'
      ]
    },
    {
      id: 'text7',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'Le quotient de la différence de vingt-quatre et de six par la somme de deux et de un.',
      answer: '6',
      calculation: '(24 - 6) ÷ (2 + 1)',
      steps: [
        'Identifier les éléments : quotient de "différence de vingt-quatre et de six" par "somme de deux et de un"',
        'Traduire : (24 - 6) ÷ (2 + 1)',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 18 ÷ 3',
        'Calculer : 18 ÷ 3 = 6',
        'Résultat final : 6'
      ]
    },
    {
      id: 'text8',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'Le produit de sept par la différence de huit et de trois.',
      answer: '35',
      calculation: '7 × (8 - 3)',
      steps: [
        'Identifier les éléments : produit de "sept" par "différence de huit et de trois"',
        'Traduire : 7 × (8 - 3)',
        'Priorité : parenthèses en premier',
        'Appliquer les parenthèses : 7 × 5',
        'Calculer : 7 × 5 = 35',
        'Résultat final : 35'
      ]
    },
    {
      id: 'text9',
      question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
      phrase: 'La différence entre le quotient de trente-six par six et le produit de deux par trois.',
      answer: '0',
      calculation: '36 ÷ 6 - 2 × 3',
      steps: [
        'Identifier les éléments : différence entre "quotient de trente-six par six" et "produit de deux par trois"',
        'Traduire : 36 ÷ 6 - 2 × 3',
        'Priorité : division et multiplication avant soustraction',
        'Appliquer les priorités : 6 - 6',
        'Calculer : 6 - 6 = 0',
        'Résultat final : 0'
      ]
    },
         {
       id: 'text10',
       question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
       phrase: 'La somme du produit de la somme de un et de deux par quatre et de cinq.',
       answer: '17',
       calculation: '(1 + 2) × 4 + 5',
       steps: [
         'Identifier les éléments : somme de "produit de la somme de un et de deux par quatre" et "cinq"',
         'Traduire : (1 + 2) × 4 + 5',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 3 × 4 + 5',
         'Priorité : multiplication avant addition',
         'Appliquer la multiplication : 12 + 5',
         'Calculer : 12 + 5 = 17',
         'Résultat final : 17'
       ]
     },
     {
       id: 'text11',
       question: 'Relier le calcul à la phrase qui lui correspond :',
       phrase: 'Le quotient de la somme de 14 et de 8 par 9',
       answer: '2',
       calculation: '(14 + 8) ÷ 9',
       steps: [
         'Identifier les éléments : quotient de "somme de 14 et de 8" par "9"',
         'Traduire : (14 + 8) ÷ 9',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 22 ÷ 9',
         'Calculer : 22 ÷ 9 ≈ 2.44, donc 2',
         'Résultat final : 2'
       ]
     },
     {
       id: 'text12',
       question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
       phrase: 'La somme de 8 et du produit de 9 et 14.',
       answer: '134',
       calculation: '8 + 9 × 14',
       steps: [
         'Identifier les éléments : somme de "8" et "produit de 9 et 14"',
         'Traduire : 8 + 9 × 14',
         'Priorité : multiplication avant addition',
         'Appliquer la priorité : 8 + 126',
         'Calculer : 8 + 126 = 134',
         'Résultat final : 134'
       ]
     },
     {
       id: 'text13',
       question: 'Relier le calcul à la phrase qui lui correspond :',
       phrase: 'Le produit de 9, 14 et 8',
       answer: '1008',
       calculation: '9 × 14 × 8',
       steps: [
         'Identifier les éléments : produit de "9", "14" et "8"',
         'Traduire : 9 × 14 × 8',
         'Priorité : multiplications de gauche à droite',
         'Appliquer : 126 × 8',
         'Calculer : 126 × 8 = 1008',
         'Résultat final : 1008'
       ]
     },
     {
       id: 'text14',
       question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
       phrase: 'La différence de 9 par la somme de 14 et 8',
       answer: '-13',
       calculation: '9 - (14 + 8)',
       steps: [
         'Identifier les éléments : différence de "9" par "somme de 14 et 8"',
         'Traduire : 9 - (14 + 8)',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 9 - 22',
         'Calculer : 9 - 22 = -13',
         'Résultat final : -13'
       ]
     },
     {
       id: 'text15',
       question: 'Relier le calcul à la phrase qui lui correspond :',
       phrase: 'La somme de 8 et du quotient de 14 par 9',
       answer: '10',
       calculation: '8 + 14 ÷ 9',
       steps: [
         'Identifier les éléments : somme de "8" et "quotient de 14 par 9"',
         'Traduire : 8 + 14 ÷ 9',
         'Priorité : division avant addition',
         'Appliquer la priorité : 8 + 1.56',
         'Calculer : 8 + 1.56 ≈ 10 (arrondi)',
         'Résultat final : 10'
       ]
     },
     {
       id: 'text16',
       question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
       phrase: 'Le produit de la somme de 14 et 8 par 9',
       answer: '198',
       calculation: '(14 + 8) × 9',
       steps: [
         'Identifier les éléments : produit de "somme de 14 et 8" par "9"',
         'Traduire : (14 + 8) × 9',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 22 × 9',
         'Calculer : 22 × 9 = 198',
         'Résultat final : 198'
       ]
     },
     {
       id: 'text17',
       question: 'Valider cette affirmation : "Deux fois trois plus cinq vaut seize"',
       phrase: 'Deux fois trois plus cinq vaut seize',
       answer: 'Faux',
       calculation: '2 × 3 + 5 = 11',
       steps: [
         'Identifier les éléments : "Deux fois trois" (produit) "plus cinq" (somme)',
         'Écrire : 2 × 3 + 5',
         'Priorité : multiplication avant addition',
         'Appliquer la priorité : 6 + 5',
         'Calculer : 6 + 5 = 11',
         'Comparer : 11 ≠ 16',
         'Résultat final : Faux'
       ]
     },
     {
       id: 'text18',
       question: 'Valider cette affirmation : "Cinq plus trois fois deux vaut onze"',
       phrase: 'Cinq plus trois fois deux vaut onze',
       answer: 'Vrai',
       calculation: '5 + 3 × 2 = 11',
       steps: [
         'Identifier les éléments : "Cinq plus" (somme) "trois fois deux" (produit)',
         'Écrire : 5 + 3 × 2',
         'Priorité : multiplication avant addition',
         'Appliquer la priorité : 5 + 6',
         'Calculer : 5 + 6 = 11',
         'Comparer : 11 = 11',
         'Résultat final : Vrai'
       ]
     },
     {
       id: 'text19',
       question: 'Traduire cette phrase en utilisant les mots somme, produit et différence :',
       phrase: 'La somme de quatre et du produit de deux par six.',
       answer: '16',
       calculation: '4 + 2 × 6',
       steps: [
         'Identifier les éléments : somme de "quatre" et "produit de deux par six"',
         'Traduire : 4 + 2 × 6',
         'Priorité : multiplication avant addition',
         'Appliquer la priorité : 4 + 12',
         'Calculer : 4 + 12 = 16',
         'Résultat final : 16'
       ]
     },
     {
       id: 'text20',
       question: 'Traduire cette phrase en utilisant les mots somme, produit et différence :',
       phrase: 'Le produit de treize par la somme de deux et de trois.',
       answer: '65',
       calculation: '13 × (2 + 3)',
       steps: [
         'Identifier les éléments : produit de "treize" par "somme de deux et de trois"',
         'Traduire : 13 × (2 + 3)',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 13 × 5',
         'Calculer : 13 × 5 = 65',
         'Résultat final : 65'
       ]
     },
     {
       id: 'text21',
       question: 'Traduire ce calcul par une phrase utilisant les mots somme, produit et différence :',
       phrase: '12 × 3 + 5',
       answer: '41',
       calculation: '12 × 3 + 5',
       steps: [
         'Analyser : 12 × 3 + 5',
         'Traduire : "La somme du produit de 12 par 3 et de 5"',
         'Priorité : multiplication avant addition',
         'Appliquer la priorité : 36 + 5',
         'Calculer : 36 + 5 = 41',
         'Résultat final : 41'
       ]
     },
     {
       id: 'text22',
       question: 'Traduire ce calcul par une phrase utilisant les mots somme, produit et différence :',
       phrase: '(3 + 7) × 4',
       answer: '40',
       calculation: '(3 + 7) × 4',
       steps: [
         'Analyser : (3 + 7) × 4',
         'Traduire : "Le produit de la somme de 3 et de 7 par 4"',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 10 × 4',
         'Calculer : 10 × 4 = 40',
         'Résultat final : 40'
       ]
     },
     {
       id: 'text23',
       question: 'Traduire ce calcul par une phrase utilisant les mots somme, produit et différence :',
       phrase: '15 - 3 × 2',
       answer: '9',
       calculation: '15 - 3 × 2',
       steps: [
         'Analyser : 15 - 3 × 2',
         'Traduire : "La différence de 15 et du produit de 3 par 2"',
         'Priorité : multiplication avant soustraction',
         'Appliquer la priorité : 15 - 6',
         'Calculer : 15 - 6 = 9',
         'Résultat final : 9'
       ]
     },
     {
       id: 'text24',
       question: 'Traduire ce calcul par une phrase utilisant les mots somme, produit et différence :',
       phrase: '(5 + 3) × 4',
       answer: '32',
       calculation: '(5 + 3) × 4',
       steps: [
         'Analyser : (5 + 3) × 4',
         'Traduire : "Le produit de la somme de 5 et de 3 par 4"',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 8 × 4',
         'Calculer : 8 × 4 = 32',
         'Résultat final : 32'
       ]
     },
     {
       id: 'text25',
       question: 'Écrire le calcul qui correspond à cette phrase, puis donner sa valeur :',
       phrase: 'Le quotient de la différence de vingt et de quatre par la somme de deux et de six.',
       answer: '2',
       calculation: '(20 - 4) ÷ (2 + 6)',
       steps: [
         'Identifier les éléments : quotient de "différence de vingt et de quatre" par "somme de deux et de six"',
         'Traduire : (20 - 4) ÷ (2 + 6)',
         'Priorité : parenthèses en premier',
         'Appliquer les parenthèses : 16 ÷ 8',
         'Calculer : 16 ÷ 8 = 2',
         'Résultat final : 2'
       ]
          }
   ]

   const practicalExercises = [
     {
       id: 'prac1',
       question: 'Calcul d\'aire d\'une figure composée',
       context: 'On considère la figure qui est composée de deux rectangles de dimensions 8 cm × 4 cm et 2 cm × 1 cm.',
       phrase: 'Parmi les calculs ci-dessous, lequel permet de calculer le domaine hachuré de la figure ?',
       answer: '30',
       calculation: '(6 + 2) × 4 - (2 × 1)',
       steps: [
         'Identifier : Figure composée de deux rectangles',
         'Grand rectangle : longueur = 6 + 2 = 8 cm, largeur = 4 cm',
         'Petit rectangle : longueur = 2 cm, largeur = 1 cm',
         'Aire hachurée = Aire totale - Aire petit rectangle',
         'Traduire : (6 + 2) × 4 - (2 × 1)',
         'Calculer : 8 × 4 - 2 = 32 - 2 = 30',
         'Résultat final : 30 cm²'
       ]
     },
     {
       id: 'prac2',
       question: 'Calcul d\'aire d\'une figure composée',
       context: 'La figure ci-dessous est composée de deux rectangles de dimensions 5,5 cm × 3 cm et 1,5 cm × 2 cm.',
       phrase: 'Déterminer la mesure de l\'aire de la partie hachurée représentée dans la figure.',
       answer: '13.5',
       calculation: '5,5 × 3 - 1,5 × 2',
       steps: [
         'Identifier : Figure composée avec partie hachurée',
         'Grand rectangle : 5,5 cm × 3 cm',
         'Petit rectangle : 1,5 cm × 2 cm',
         'Aire hachurée = Aire totale - Aire non hachurée',
         'Traduire : 5,5 × 3 - 1,5 × 2',
         'Calculer : 16,5 - 3 = 13,5',
         'Résultat final : 13,5 cm²'
       ]
     },
     {
       id: 'prac3',
       question: 'Problème de bobines de fil',
       context: 'On dispose de 20 bobines de fil identiques pour clôturer un jardin de forme rectangulaire où la longueur mesure 150 m et la largeur 77 m.',
       phrase: 'Après avoir clôturé l\'ensemble du jardin, il reste 46 m de fil de fer non utilisé.',
       answer: '25',
       calculation: '(150 + 77) × 2 + 46',
       steps: [
         'Identifier : Périmètre du jardin + fil non utilisé',
         'Périmètre = 2 × (longueur + largeur)',
         'Périmètre = 2 × (150 + 77) = 2 × 227 = 454 m',
         'Fil total = Périmètre + fil non utilisé',
         'Traduire : (150 + 77) × 2 + 46',
         'Calculer : 454 + 46 = 500 m',
         'Longueur d\'une bobine : 500 ÷ 20 = 25 m'
       ]
     },
     {
       id: 'prac4',
       question: 'Facture téléphonique',
       context: 'Un étudiant mexicain reçoit sa facture d\'abonnement téléphonique s\'élevant à 342 $ (la monnaie locale est le peso).',
       phrase: 'L\'abonnement mensuel s\'élève à 165 $ et le prix d\'une minute de communication est de 1,5 $.',
       answer: '118',
       calculation: '(342 - 165) ÷ 1,5',
       steps: [
         'Identifier : Facture totale - abonnement = communications',
         'Coût des communications = 342 - 165 = 177 $',
         'Nombre de minutes = Coût communications ÷ Prix par minute',
         'Traduire : (342 - 165) ÷ 1,5',
         'Calculer : 177 ÷ 1,5 = 118',
         'Résultat final : 118 minutes'
       ]
     },
     {
       id: 'prac5',
       question: 'Problème de construction',
       context: 'Pour construire un mur, on utilise des briques de 20 cm × 10 cm × 5 cm.',
       phrase: 'Combien faut-il de briques pour construire un mur de 4 m de long, 2,5 m de haut et 20 cm d\'épaisseur ?',
       answer: '2000',
       calculation: '(400 × 250 × 20) ÷ (20 × 10 × 5)',
       steps: [
         'Identifier : Volume mur ÷ Volume brique',
         'Volume mur = 400 × 250 × 20 = 2000000 cm³',
         'Volume brique = 20 × 10 × 5 = 1000 cm³',
         'Nombre de briques = Volume mur ÷ Volume brique',
         'Traduire : (400 × 250 × 20) ÷ (20 × 10 × 5)',
         'Calculer : 2000000 ÷ 1000 = 2000',
         'Résultat final : 2000 briques'
       ]
     },
     {
       id: 'prac6',
       question: 'Problème de vitesse',
       context: 'Un train parcourt 240 km en 3 heures, puis 180 km en 2 heures.',
       phrase: 'Quelle est la vitesse moyenne du train sur l\'ensemble du trajet ?',
       answer: '84',
       calculation: '(240 + 180) ÷ (3 + 2)',
       steps: [
         'Identifier : Vitesse moyenne = Distance totale ÷ Temps total',
         'Distance totale = 240 + 180 = 420 km',
         'Temps total = 3 + 2 = 5 heures',
         'Vitesse moyenne = Distance totale ÷ Temps total',
         'Traduire : (240 + 180) ÷ (3 + 2)',
         'Calculer : 420 ÷ 5 = 84',
         'Résultat final : 84 km/h'
       ]
     },
     {
       id: 'prac7',
       question: 'Problème de réservoir',
       context: 'Un réservoir contient 1200 L d\'eau. On y ajoute 45 L par minute pendant 8 minutes.',
       phrase: 'Puis on retire 25 L par minute pendant 12 minutes. Quelle quantité d\'eau reste-t-il ?',
       answer: '1260',
       calculation: '1200 + 45 × 8 - 25 × 12',
       steps: [
         'Identifier : Quantité initiale + ajouts - retraits',
         'Quantité initiale = 1200 L',
         'Ajouts = 45 × 8 = 360 L',
         'Retraits = 25 × 12 = 300 L',
         'Quantité finale = 1200 + 360 - 300',
         'Traduire : 1200 + 45 × 8 - 25 × 12',
         'Calculer : 1200 + 360 - 300 = 1260',
         'Résultat final : 1260 L'
       ]
     },
     {
       id: 'prac8',
       question: 'Problème de terrain',
       context: 'Un terrain rectangulaire de 80 m × 60 m contient une maison rectangulaire de 15 m × 12 m.',
       phrase: 'Quelle est l\'aire du jardin (terrain sans la maison) ?',
       answer: '4620',
       calculation: '80 × 60 - 15 × 12',
       steps: [
         'Identifier : Aire terrain - Aire maison',
         'Aire terrain = 80 × 60 = 4800 m²',
         'Aire maison = 15 × 12 = 180 m²',
         'Aire jardin = Aire terrain - Aire maison',
         'Traduire : 80 × 60 - 15 × 12',
         'Calculer : 4800 - 180 = 4620',
         'Résultat final : 4620 m²'
       ]
     },
     {
       id: 'prac9',
       question: 'Problème de budget',
       context: 'Marie a 150 € pour ses courses. Elle achète 3 kg de viande à 18 € le kg et 5 kg de légumes à 4 € le kg.',
       phrase: 'Combien lui reste-t-il d\'argent ?',
       answer: '76',
       calculation: '150 - (3 × 18 + 5 × 4)',
       steps: [
         'Identifier : Budget initial - dépenses',
         'Dépenses viande = 3 × 18 = 54 €',
         'Dépenses légumes = 5 × 4 = 20 €',
         'Dépenses totales = 54 + 20 = 74 €',
         'Argent restant = 150 - 74',
         'Traduire : 150 - (3 × 18 + 5 × 4)',
         'Calculer : 150 - 74 = 76',
         'Résultat final : 76 €'
       ]
     },
     {
       id: 'prac10',
       question: 'Problème de carrelage',
       context: 'Pour carreler une pièce de 6 m × 4 m, on utilise des carreaux de 20 cm × 20 cm.',
       phrase: 'Combien faut-il de carreaux ? (On néglige les joints)',
       answer: '600',
       calculation: '(600 × 400) ÷ (20 × 20)',
       steps: [
         'Identifier : Aire pièce ÷ Aire carreau',
         'Aire pièce = 600 × 400 = 240000 cm²',
         'Aire carreau = 20 × 20 = 400 cm²',
         'Nombre de carreaux = Aire pièce ÷ Aire carreau',
         'Traduire : (600 × 400) ÷ (20 × 20)',
         'Calculer : 240000 ÷ 400 = 600',
         'Résultat final : 600 carreaux'
       ]
     },
     {
       id: 'prac11',
       question: 'Problème de piscine',
       context: 'Une piscine rectangulaire de 12 m × 8 m × 1,5 m se remplit avec 2 robinets.',
       phrase: 'Le premier débite 120 L/min et le second 80 L/min. Combien de temps pour la remplir ?',
       answer: '720',
       calculation: '(12 × 8 × 1,5 × 1000) ÷ (120 + 80)',
       steps: [
         'Identifier : Volume piscine ÷ Débit total',
         'Volume piscine = 12 × 8 × 1,5 = 144 m³ = 144000 L',
         'Débit total = 120 + 80 = 200 L/min',
         'Temps = Volume ÷ Débit',
         'Traduire : (12 × 8 × 1,5 × 1000) ÷ (120 + 80)',
         'Calculer : 144000 ÷ 200 = 720',
         'Résultat final : 720 minutes = 12 heures'
       ]
     },
     {
       id: 'prac12',
       question: 'Problème de parking',
       context: 'Un parking rectangulaire de 50 m × 30 m contient des places de 5 m × 2,5 m.',
       phrase: 'Combien de places peut-on créer si les allées occupent 400 m² ?',
       answer: '88',
       calculation: '(50 × 30 - 400) ÷ (5 × 2,5)',
       steps: [
         'Identifier : (Aire totale - Aire allées) ÷ Aire place',
         'Aire totale = 50 × 30 = 1500 m²',
         'Aire disponible = 1500 - 400 = 1100 m²',
         'Aire par place = 5 × 2,5 = 12,5 m²',
         'Nombre de places = Aire disponible ÷ Aire place',
         'Traduire : (50 × 30 - 400) ÷ (5 × 2,5)',
         'Calculer : 1100 ÷ 12,5 = 88',
         'Résultat final : 88 places'
       ]
     },
     {
       id: 'prac13',
       question: 'Problème de consommation',
       context: 'Une voiture consomme 7 L aux 100 km. Elle parcourt 350 km.',
       phrase: 'Sachant que l\'essence coûte 1,45 € le litre, quel est le coût du trajet ?',
       answer: '35.53',
       calculation: '(350 ÷ 100) × 7 × 1,45',
       steps: [
         'Identifier : (Distance ÷ 100) × Consommation × Prix',
         'Distance = 350 km',
         'Consommation = 7 L aux 100 km',
         'Prix = 1,45 € le litre',
         'Litres consommés = (350 ÷ 100) × 7 = 24,5 L',
         'Coût = 24,5 × 1,45',
         'Traduire : (350 ÷ 100) × 7 × 1,45',
         'Calculer : 3,5 × 7 × 1,45 = 35,525',
         'Résultat final : 35,53 €'
       ]
     },
     {
       id: 'prac14',
       question: 'Problème d\'emballage',
       context: 'Une boîte rectangulaire de 40 cm × 30 cm × 20 cm contient des cubes de 5 cm de côté.',
       phrase: 'Combien de cubes peut-elle contenir ?',
       answer: '192',
       calculation: '(40 × 30 × 20) ÷ (5 × 5 × 5)',
       steps: [
         'Identifier : Volume boîte ÷ Volume cube',
         'Volume boîte = 40 × 30 × 20 = 24000 cm³',
         'Volume cube = 5 × 5 × 5 = 125 cm³',
         'Nombre de cubes = Volume boîte ÷ Volume cube',
         'Traduire : (40 × 30 × 20) ÷ (5 × 5 × 5)',
         'Calculer : 24000 ÷ 125 = 192',
         'Résultat final : 192 cubes'
       ]
     },
     {
       id: 'prac15',
       question: 'Problème de jardinage',
       context: 'Un jardinier plante 120 plants de tomates en 15 rangées égales.',
       phrase: 'Il récolte en moyenne 2,5 kg par plant. Quel est le poids total de la récolte ?',
       answer: '300',
       calculation: '120 × 2,5',
       steps: [
         'Identifier : Nombre de plants × Récolte par plant',
         'Nombre de plants = 120',
         'Récolte par plant = 2,5 kg',
         'Poids total = 120 × 2,5',
         'Calculer : 120 × 2,5 = 300',
         'Résultat final : 300 kg'
       ]
     }
   ]

   const currentEx = exerciseType === 'numerical' ? exercises[currentExercise] : textualExercises[currentExercise]
   const currentExercises = exerciseType === 'numerical' ? exercises : textualExercises

  const checkAnswer = () => {
    const userAnswerTrimmed = userAnswer.trim().toLowerCase()
    const correctAnswer = currentEx.answer.toLowerCase()
    
    // Pour les réponses "Vrai"/"Faux", accepter plusieurs variantes
    if (correctAnswer === 'vrai' && (userAnswerTrimmed === 'vrai' || userAnswerTrimmed === 'v' || userAnswerTrimmed === 'true')) {
      setScore(score + 1)
      setShowAnswer(true)
      setCurrentStep(0)
      return true
    } else if (correctAnswer === 'faux' && (userAnswerTrimmed === 'faux' || userAnswerTrimmed === 'f' || userAnswerTrimmed === 'false')) {
      setScore(score + 1)
      setShowAnswer(true)
      setCurrentStep(0)
      return true
    } else if (userAnswerTrimmed === correctAnswer) {
      setScore(score + 1)
      setShowAnswer(true)
      setCurrentStep(0)
      return true
    } else {
      setShowAnswer(true)
      setCurrentStep(0)
      return false
    }
  }

  const nextStep = () => {
    if (currentStep < currentEx.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const nextExercise = () => {
    if (currentExercise < currentExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowAnswer(false)
      setCurrentStep(0)
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setUserAnswer('')
      setShowAnswer(false)
      setCurrentStep(0)
    }
  }

  const switchExerciseType = (type: 'numerical' | 'textual') => {
    setExerciseType(type)
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setCurrentStep(0)
  }

  const startAnimation = () => {
    setIsAnimating(true)
    setAnimationStep(0)
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval)
          setIsAnimating(false)
          return 0
        }
        return prev + 1
      })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour aux classes</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                ( )
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Priorités des opérations</h1>
                <p className="text-gray-600 text-lg">
                  Ordre des opérations, expressions numériques
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-purple-600">50 minutes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'cours', label: 'Cours', icon: BookOpen },
                { id: 'exercices', label: 'Exercices', icon: Target }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
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
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">🎯 Règles de priorité</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Ordre des opérations</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      Règle PEMDAS 🐼
                    </h4>
                    
                    {/* Animation de priorité */}
                    <div className="mb-4 bg-white p-4 rounded-lg border border-blue-300">
                      <p className="text-blue-800 font-medium text-center mb-3">
                        📊 Ordre de priorité (du plus prioritaire au moins prioritaire)
                      </p>
                      <div className="space-y-2">
                        <div className={`flex items-center gap-3 p-2 rounded transition-all duration-1000 ${
                          animationStep >= 0 ? 'bg-red-100 border-2 border-red-400 transform scale-105' : 'bg-gray-100'
                        }`}>
                          <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <span className="text-red-700 font-semibold">Parenthèses ( )</span>
                          <div className="ml-auto text-red-600">🔴 PRIORITÉ MAXIMALE</div>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded transition-all duration-1000 ${
                          animationStep >= 1 ? 'bg-orange-100 border-2 border-orange-400 transform scale-105' : 'bg-gray-100'
                        }`}>
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <span className="text-orange-700 font-semibold">Crochets [ ]</span>
                          <div className="ml-auto text-orange-600">🟠 TRÈS PRIORITAIRE</div>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded transition-all duration-1000 ${
                          animationStep >= 2 ? 'bg-amber-100 border-2 border-amber-400 transform scale-105' : 'bg-gray-100'
                        }`}>
                          <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <span className="text-amber-700 font-semibold">Exposants (x²)</span>
                          <div className="ml-auto text-amber-600">🟡 PRIORITAIRE</div>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded transition-all duration-1000 ${
                          animationStep >= 3 ? 'bg-yellow-100 border-2 border-yellow-400 transform scale-105' : 'bg-gray-100'
                        }`}>
                          <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                          <span className="text-yellow-700 font-semibold">Multiplication et Division</span>
                          <div className="ml-auto text-yellow-600">🟡 PRIORITAIRE</div>
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded transition-all duration-1000 ${
                          animationStep >= 4 ? 'bg-green-100 border-2 border-green-400 transform scale-105' : 'bg-gray-100'
                        }`}>
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                          <span className="text-green-700 font-semibold">Addition et Soustraction</span>
                          <div className="ml-auto text-green-600">🟢 PRIORITÉ MINIMALE</div>
                        </div>
                      </div>
                    </div>
                    
                    <ol className="text-blue-700 space-y-2 text-sm list-decimal list-inside">
                      <li><strong>P</strong>arenthèses : ( ) en premier</li>
                      <li><strong>C</strong>rochets : [ ] après les parenthèses</li>
                      <li><strong>E</strong>xposants : puissances (x²)</li>
                      <li><strong>M</strong>ultiplication et <strong>D</strong>ivision : de gauche à droite</li>
                      <li><strong>A</strong>ddition et <strong>S</strong>oustraction : de gauche à droite</li>
                    </ol>
                    
                    <div className="text-center mt-4">
                      <button
                        onClick={startAnimation}
                        disabled={isAnimating}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                          isAnimating 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isAnimating ? (
                          <span className="flex items-center gap-2">
                            <Pause size={20} />
                            Animation en cours...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Play size={20} />
                            Lancer l'animation
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>



                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemples détaillés</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-800 font-semibold mb-2">Exemple 1 : 5 + 3 × 2</p>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>• Multiplication d'abord : 3 × 2 = 6</div>
                        <div>• Puis addition : 5 + 6 = 11</div>
                        <div>• <strong>Résultat : 11</strong></div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-green-800 font-semibold mb-2">Exemple 2 : (5 + 3) × 2</p>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>• Parenthèses d'abord : (5 + 3) = 8</div>
                        <div>• Puis multiplication : 8 × 2 = 16</div>
                        <div>• <strong>Résultat : 16</strong></div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-orange-800 font-semibold mb-2">Exemple 3 : 12 ÷ 3 × 2</p>
                      <div className="text-sm text-orange-700 space-y-1">
                        <div>• Division et multiplication : de gauche à droite</div>
                        <div>• D'abord : 12 ÷ 3 = 4</div>
                        <div>• Puis : 4 × 2 = 8</div>
                        <div>• <strong>Résultat : 8</strong></div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-purple-800 font-semibold mb-2">Exemple 4 : 10 - [19 - (4 × 3)]</p>
                      <div className="text-sm text-purple-700 space-y-1">
                        <div>• Parenthèses d'abord : 10 - [19 - 12]</div>
                        <div>• Crochets ensuite : 10 - 7</div>
                        <div>• <strong>Résultat : 3</strong></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Erreurs courantes</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-red-600 text-xl">❌</span>
                      <div>
                        <p className="text-red-800 font-medium">5 + 3 × 2 = 16</p>
                        <p className="text-red-700 text-sm">Erreur : addition avant multiplication</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl">✅</span>
                      <div>
                        <p className="text-green-800 font-medium">5 + 3 × 2 = 11</p>
                        <p className="text-green-700 text-sm">Correct : multiplication d'abord</p>
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
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Exercices - Priorités des opérations</h2>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Score</div>
                    <div className="text-2xl font-bold text-purple-600">{score}</div>
                  </div>
                </div>

                {/* Boutons de bascule entre les types d'exercices */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => switchExerciseType('numerical')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      exerciseType === 'numerical'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Exercices numériques
                  </button>
                  <button
                    onClick={() => switchExerciseType('textual')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      exerciseType === 'textual'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Exercices textuels
                  </button>
                </div>

                              <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{currentEx.question}</h3>
                      {exerciseType === 'textual' && (
                        <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-800 font-medium italic">
                            "{exerciseType === 'textual' ? (currentEx as any).phrase : ''}"
                          </p>
                          {showAnswer && exerciseType === 'textual' && (
                            <div className="mt-2 pt-2 border-t border-blue-300">
                              <p className="text-sm text-blue-700">
                                <strong>Calcul :</strong> {(currentEx as any).calculation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        Exercice {currentExercise + 1} sur {currentExercises.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevExercise}
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
                          onClick={nextExercise}
                          disabled={currentExercise === currentExercises.length - 1}
                          className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                            currentExercise === currentExercises.length - 1 
                              ? 'bg-gray-300 cursor-not-allowed' 
                              : 'bg-purple-500 hover:bg-purple-600'
                          }`}
                        >
                          Suivant →
                        </button>
                      </div>
                    </div>
                  </div>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={exerciseType === 'textual' ? "Votre réponse (valeur numérique)..." : "Votre réponse..."}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || showAnswer}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
                  >
                    Vérifier
                  </button>
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
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">📝 Correction détaillée</h4>
                        <span className="text-sm text-gray-600">
                          Étape {currentStep + 1} sur {currentEx.steps.length}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 space-y-2">
                        {currentEx.steps.slice(0, currentStep + 1).map((step, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="bg-purple-100 px-2 py-1 rounded text-purple-800 text-xs">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                        {currentStep < currentEx.steps.length - 1 ? (
                          <button
                            onClick={nextStep}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Étape suivante
                          </button>
                        ) : (
                          <div className="text-purple-600 font-semibold">
                            ✅ Correction terminée !
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 