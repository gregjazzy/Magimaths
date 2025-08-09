'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye, RotateCcw, Play } from 'lucide-react';

export default function AdditionsJusqua100CE1() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [currentTechnique, setCurrentTechnique] = useState<string | null>(null);
  const [calculationStep, setCalculationStep] = useState<'setup' | 'show-first' | 'decompose-first' | 'show-second' | 'decompose-second' | 'explain-strategy' | 'units' | 'units-sum' | 'carry-explanation' | 'carry-visual' | 'tens' | 'regroup' | 'result' | 'show-problem' | 'find-complement' | 'add-complement' | 'show-intermediate' | 'add-remaining' | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [highlightedDigits, setHighlightedDigits] = useState<string[]>([]);

  // États pour les exercices  
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour Sam le Pirate
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPlayingEnonce, setIsPlayingEnonce] = useState(false);

  // État pour l'animation de correction
  const [showAnimatedCorrection, setShowAnimatedCorrection] = useState(false);
  const [correctionStep, setCorrectionStep] = useState<'numbers' | 'adding' | 'counting' | 'result' | 'complete' | 'carry-step' | 'decomposition' | 'final-sum' | null>(null);
  const [correctionTechnique, setCorrectionTechnique] = useState<string>('');
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  
  // États pour le cadre séparé des exemples
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);

  // État pour la détection mobile
  const [isMobile, setIsMobile] = useState(false);
  const [animatedObjects, setAnimatedObjects] = useState<string[]>([]);

  // État pour stocker les nombres de la correction en cours
  const [correctionNumbers, setCorrectionNumbers] = useState<{
    first: number;
    second: number;
    result: number;
    objectEmoji1: string;
    objectEmoji2: string;
    objectName: string;
  } | null>(null);

  // État pour l'animation de comptage objet par objet
  const [countingIndex, setCountingIndex] = useState<number>(-1);

  // Refs pour gérer l'audio et scroll
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Expressions Minecraft aléatoires pour chaque exercice
  const minecraftExpressions = [
    "Par les creepers", "Sacrés diamants", "Mille blocs", "Par l'Ender Dragon", "Redstone power",
    "Mille millions de blocks", "Crafting table", "Par les zombies", "Pickaxe magique", "Notch alors"
  ];

  // Compliments aléatoires pour les bonnes réponses
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", 
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire",
    "Très bien", "C'est ça", "Tu as trouvé", "Bien joué", "Félicitations",
    "Tu es un champion", "Quelle belle réussite", "Continue comme ça", 
    "Tu progresses bien", "C'est exact", "Impeccable", "Remarquable"
  ];

  // Données des techniques d'addition avec animations - CE1 : 6 techniques adaptées
  const additionTechniques = [
    {
      id: 'decomposition',
      title: 'Décomposition en dizaines et unités',
      icon: '🧮',
      description: 'Séparer les dizaines et les unités pour calculer plus facilement',
      examples: [
        { 
          calculation: '35 + 24', 
          num1: 35, 
          num2: 24, 
          result: 59,
          steps: [
            'Je décompose les nombres : 35 = 30 + 5 et 24 = 20 + 4',
            'J\'additionne les dizaines : 30 + 20 = 50',
            'J\'additionne les unités : 5 + 4 = 9',
            'Je regroupe : 50 + 9 = 59 !'
          ]
        },
        { 
          calculation: '42 + 36', 
          num1: 42, 
          num2: 36, 
          result: 78,
          steps: [
            'Je sépare : 42 = 40 + 2 et 36 = 30 + 6',
            'Dizaines d\'abord : 40 + 30 = 70',
            'Unités ensuite : 2 + 6 = 8',
            'Total : 70 + 8 = 78 !'
          ]
        },
        { 
          calculation: '23 + 15', 
          num1: 23, 
          num2: 15, 
          result: 38,
          steps: [
            'Je décompose : 23 = 20 + 3 et 15 = 10 + 5',
            'Dizaines : 20 + 10 = 30',
            'Unités : 3 + 5 = 8',
            'Total : 30 + 8 = 38 !'
          ]
        },
        { 
          calculation: '54 + 31', 
          num1: 54, 
          num2: 31, 
          result: 85,
          steps: [
            'Je sépare : 54 = 50 + 4 et 31 = 30 + 1',
            'Dizaines : 50 + 30 = 80',
            'Unités : 4 + 1 = 5',
            'Résultat : 80 + 5 = 85 !'
          ]
        },
        { 
          calculation: '61 + 27', 
          num1: 61, 
          num2: 27, 
          result: 88,
          steps: [
            'Décomposition : 61 = 60 + 1 et 27 = 20 + 7',
            'Dizaines : 60 + 20 = 80',
            'Unités : 1 + 7 = 8',
            'Total : 80 + 8 = 88 !'
          ]
        },
        { 
          calculation: '32 + 45', 
          num1: 32, 
          num2: 45, 
          result: 77,
          steps: [
            'Je décompose : 32 = 30 + 2 et 45 = 40 + 5',
            'Dizaines : 30 + 40 = 70',
            'Unités : 2 + 5 = 7',
            'Résultat : 70 + 7 = 77 !'
          ]
        }
      ]
    },
    {
      id: 'complement-10',
      title: 'Complément à 10 (dizaine ronde)',
      icon: '🎯',
      description: 'Utiliser les compléments pour arriver à une dizaine ronde',
      examples: [
        { 
          calculation: '27 + 8', 
          num1: 27, 
          num2: 8, 
          result: 35,
          steps: [
            'Je veux ajouter 8 à 27',
            'Je prends 3 de 8 pour faire 30 (27 + 3)',
            'Il me reste 5 à ajouter (8 - 3 = 5)',
            '30 + 5 = 35 ! C\'est plus facile !'
          ]
        },
        { 
          calculation: '56 + 9', 
          num1: 56, 
          num2: 9, 
          result: 65,
          steps: [
            'J\'ajoute 9 à 56',
            'Je prends 4 de 9 pour faire 60 (56 + 4)',
            'Il reste 5 (9 - 4 = 5)',
            '60 + 5 = 65 ! Technique magique !'
          ]
        },
        { 
          calculation: '34 + 7', 
          num1: 34, 
          num2: 7, 
          result: 41,
          steps: [
            'J\'ajoute 7 à 34',
            'Je prends 6 de 7 pour faire 40 (34 + 6)',
            'Il reste 1 (7 - 6 = 1)',
            '40 + 1 = 41 ! Plus simple !'
          ]
        },
        { 
          calculation: '48 + 6', 
          num1: 48, 
          num2: 6, 
          result: 54,
          steps: [
            'J\'ajoute 6 à 48',
            'Je prends 2 de 6 pour faire 50 (48 + 2)',
            'Il reste 4 (6 - 2 = 4)',
            '50 + 4 = 54 ! Génial !'
          ]
        },
        { 
          calculation: '63 + 9', 
          num1: 63, 
          num2: 9, 
          result: 72,
          steps: [
            'J\'ajoute 9 à 63',
            'Je prends 7 de 9 pour faire 70 (63 + 7)',
            'Il reste 2 (9 - 7 = 2)',
            '70 + 2 = 72 ! Parfait !'
          ]
        }
      ]
    },
    {
      id: 'bonds-10',
      title: 'Addition par bonds de 10',
      icon: '⚡',
      description: 'Ajouter par bonds de 10 pour aller plus vite',
      examples: [
        { 
          calculation: '23 + 30', 
          num1: 23, 
          num2: 30, 
          result: 53,
          steps: [
            'Je pars de 23 et j\'ajoute 30',
            'J\'ajoute 10 : 23 + 10 = 33',
            'J\'ajoute encore 10 : 33 + 10 = 43',
            'J\'ajoute le dernier 10 : 43 + 10 = 53 !'
          ]
        },
        { 
          calculation: '45 + 20', 
          num1: 45, 
          num2: 20, 
          result: 65,
          steps: [
            'Je commence à 45 et j\'ajoute 20',
            'Premier bond de 10 : 45 + 10 = 55',
            'Deuxième bond de 10 : 55 + 10 = 65',
            'Résultat : 65 ! C\'est rapide !'
          ]
        },
        { 
          calculation: '34 + 40', 
          num1: 34, 
          num2: 40, 
          result: 74,
          steps: [
            'Je pars de 34 et j\'ajoute 40',
            'Bond 1 : 34 + 10 = 44',
            'Bond 2 : 44 + 10 = 54',
            'Bond 3 : 54 + 10 = 64',
            'Bond 4 : 64 + 10 = 74 !'
          ]
        },
        { 
          calculation: '52 + 30', 
          num1: 52, 
          num2: 30, 
          result: 82,
          steps: [
            'Je commence à 52 et j\'ajoute 30',
            'Premier bond : 52 + 10 = 62',
            'Deuxième bond : 62 + 10 = 72',
            'Troisième bond : 72 + 10 = 82 !'
          ]
        },
        { 
          calculation: '35 + 40', 
          num1: 35, 
          num2: 40, 
          result: 75,
          steps: [
            'Je commence à 35 et j\'ajoute 40',
            'Bond 1 : 35 + 10 = 45',
            'Bond 2 : 45 + 10 = 55',
            'Bond 3 : 55 + 10 = 65',
            'Bond 4 : 65 + 10 = 75 !'
          ]
        }
      ]
    },
    {
      id: 'compensation',
      title: 'Technique d\'échange (compensation)',
      icon: '🔄',
      description: 'Échanger pour créer des nombres plus faciles',
      examples: [
        { 
          calculation: '29 + 15', 
          num1: 29, 
          num2: 15, 
          result: 44,
          steps: [
            'Je transforme 29 + 15 en nombres plus faciles',
            'J\'enlève 1 à 15 : 15 - 1 = 14',
            'J\'ajoute 1 à 29 : 29 + 1 = 30',
            'Maintenant : 30 + 14 = 44 ! Plus simple !'
          ]
        },
        { 
          calculation: '38 + 19', 
          num1: 38, 
          num2: 19, 
          result: 57,
          steps: [
            'Je veux rendre 19 plus facile : 19 + 1 = 20',
            'Alors j\'enlève 1 à 38 : 38 - 1 = 37',
            'Maintenant je calcule : 37 + 20 = 57',
            'Malin, non ? 57 c\'est la réponse !'
          ]
        },
        { 
          calculation: '49 + 12', 
          num1: 49, 
          num2: 12, 
          result: 61,
          steps: [
            'Je transforme 49 + 12 pour simplifier',
            'J\'ajoute 1 à 49 : 49 + 1 = 50',
            'J\'enlève 1 à 12 : 12 - 1 = 11',
            'Maintenant : 50 + 11 = 61 ! Facile !'
          ]
        },
        { 
          calculation: '27 + 18', 
          num1: 27, 
          num2: 18, 
          result: 45,
          steps: [
            'Je rends 18 plus facile : 18 + 2 = 20',
            'J\'enlève 2 à 27 : 27 - 2 = 25',
            'Maintenant : 25 + 20 = 45',
            'Astucieux ! 45 c\'est le résultat !'
          ]
        },
        { 
          calculation: '48 + 14', 
          num1: 48, 
          num2: 14, 
          result: 62,
          steps: [
            'Je transforme 48 + 14 en nombres ronds',
            'J\'ajoute 2 à 48 : 48 + 2 = 50',
            'J\'enlève 2 à 14 : 14 - 2 = 12',
            'Total : 50 + 12 = 62 ! Plus simple !'
          ]
        },
        { 
          calculation: '36 + 17', 
          num1: 36, 
          num2: 17, 
          result: 53,
          steps: [
            'Je rends 17 plus facile : 17 + 3 = 20',
            'J\'enlève 3 à 36 : 36 - 3 = 33',
            'Maintenant : 33 + 20 = 53',
            'Génial ! C\'est 53 !'
          ]
        }
      ]
    },
    {
      id: 'etapes-successives',
      title: 'Addition par étapes successives',
      icon: '🎲',
      description: 'Ajouter morceau par morceau, étape par étape',
      examples: [
        { 
          calculation: '34 + 28', 
          num1: 34, 
          num2: 28, 
          result: 62,
          steps: [
            'Je commence par 34, et j\'ajoute 28 en deux fois',
            'D\'abord j\'ajoute 20 : 34 + 20 = 54',
            'Puis j\'ajoute 8 : 54 + 8 = 62',
            'Résultat final : 62 ! Étape par étape !'
          ]
        },
        { 
          calculation: '47 + 35', 
          num1: 47, 
          num2: 35, 
          result: 82,
          steps: [
            'Je pars de 47 et j\'ajoute 35 progressivement',
            'Première étape : 47 + 30 = 77',
            'Deuxième étape : 77 + 5 = 82',
            'C\'est fait ! 47 + 35 = 82 !'
          ]
        },
        { 
          calculation: '25 + 39', 
          num1: 25, 
          num2: 39, 
          result: 64,
          steps: [
            'Je commence par 25, et j\'ajoute 39 en deux fois',
            'D\'abord j\'ajoute 30 : 25 + 30 = 55',
            'Puis j\'ajoute 9 : 55 + 9 = 64',
            'Résultat : 64 ! Étape par étape !'
          ]
        },
        { 
          calculation: '53 + 27', 
          num1: 53, 
          num2: 27, 
          result: 80,
          steps: [
            'Je pars de 53 et j\'ajoute 27 progressivement',
            'Première étape : 53 + 20 = 73',
            'Deuxième étape : 73 + 7 = 80',
            'Parfait ! 53 + 27 = 80 !'
          ]
        },
        { 
          calculation: '42 + 29', 
          num1: 42, 
          num2: 29, 
          result: 71,
          steps: [
            'Je commence par 42, et j\'ajoute 29 morceau par morceau',
            'D\'abord j\'ajoute 20 : 42 + 20 = 62',
            'Puis j\'ajoute 9 : 62 + 9 = 71',
            'C\'est fait ! 42 + 29 = 71 !'
          ]
        },
        { 
          calculation: '36 + 46', 
          num1: 36, 
          num2: 46, 
          result: 82,
          steps: [
            'Je pars de 36 et j\'ajoute 46 progressivement',
            'Première étape : 36 + 40 = 76',
            'Deuxième étape : 76 + 6 = 82',
            'Excellent ! 36 + 46 = 82 !'
          ]
        }
      ]
    },
    {
      id: 'doubles',
      title: 'Doubles et quasi-doubles',
      icon: '🧠',
      description: 'Utiliser les doubles pour calculer plus vite',
      examples: [
        { 
          calculation: '25 + 26', 
          num1: 25, 
          num2: 26, 
          result: 51,
          steps: [
            'Je remarque que 26 = 25 + 1',
            'Donc 25 + 26 = 25 + 25 + 1',
            'Le double de 25 : 25 + 25 = 50',
            'Plus 1 : 50 + 1 = 51 ! Astuce des doubles !'
          ]
        },
        { 
          calculation: '34 + 35', 
          num1: 34, 
          num2: 35, 
          result: 69,
          steps: [
            'Je vois que 35 = 34 + 1',
            'Alors 34 + 35 = 34 + 34 + 1',
            'Double de 34 : 34 + 34 = 68',
            'Plus 1 : 68 + 1 = 69 ! Technique des doubles !'
          ]
        },
        { 
          calculation: '42 + 43', 
          num1: 42, 
          num2: 43, 
          result: 85,
          steps: [
            'Je remarque que 43 = 42 + 1',
            'Donc 42 + 43 = 42 + 42 + 1',
            'Le double de 42 : 42 + 42 = 84',
            'Plus 1 : 84 + 1 = 85 ! Astuce géniale !'
          ]
        },
        { 
          calculation: '37 + 38', 
          num1: 37, 
          num2: 38, 
          result: 75,
          steps: [
            'Je vois que 38 = 37 + 1',
            'Alors 37 + 38 = 37 + 37 + 1',
            'Double de 37 : 37 + 37 = 74',
            'Plus 1 : 74 + 1 = 75 ! Brillant !'
          ]
        },
        { 
          calculation: '23 + 24', 
          num1: 23, 
          num2: 24, 
          result: 47,
          steps: [
            'Je remarque que 24 = 23 + 1',
            'Donc 23 + 24 = 23 + 23 + 1',
            'Le double de 23 : 23 + 23 = 46',
            'Plus 1 : 46 + 1 = 47 ! Facile !'
          ]
        },
        { 
          calculation: '31 + 32', 
          num1: 31, 
          num2: 32, 
          result: 63,
          steps: [
            'Je vois que 32 = 31 + 1',
            'Alors 31 + 32 = 31 + 31 + 1',
            'Double de 31 : 31 + 31 = 62',
            'Plus 1 : 62 + 1 = 63 ! Parfait !'
          ]
        }
      ]
    }
  ];

  // 7 séries de 10 exercices : 6 spécialisées + 1 mélangée
  const exerciseSeries = {
    decomposition: [
    { question: 'Calcule 35 + 24', firstNumber: 35, secondNumber: 24, correctAnswer: 59, type: 'decomposition', hint: 'Décompose : 30+20=50 et 5+4=9, puis 50+9=59' },
    { question: 'Calcule 42 + 36', firstNumber: 42, secondNumber: 36, correctAnswer: 78, type: 'decomposition', hint: 'Sépare : 40+30=70 et 2+6=8, puis 70+8=78' },
      { question: 'Calcule 53 + 25', firstNumber: 53, secondNumber: 25, correctAnswer: 78, type: 'decomposition', hint: 'Décompose : 50+20=70 et 3+5=8, puis 70+8=78' },
      { question: 'Calcule 46 + 32', firstNumber: 46, secondNumber: 32, correctAnswer: 78, type: 'decomposition', hint: 'Sépare : 40+30=70 et 6+2=8, puis 70+8=78' },
      { question: 'Calcule 37 + 41', firstNumber: 37, secondNumber: 41, correctAnswer: 78, type: 'decomposition', hint: 'Décompose : 30+40=70 et 7+1=8, puis 70+8=78' },
      { question: 'Calcule 24 + 33', firstNumber: 24, secondNumber: 33, correctAnswer: 57, type: 'decomposition', hint: 'Sépare : 20+30=50 et 4+3=7, puis 50+7=57' },
      { question: 'Calcule 51 + 26', firstNumber: 51, secondNumber: 26, correctAnswer: 77, type: 'decomposition', hint: 'Décompose : 50+20=70 et 1+6=7, puis 70+7=77' },
      { question: 'Calcule 43 + 34', firstNumber: 43, secondNumber: 34, correctAnswer: 77, type: 'decomposition', hint: 'Sépare : 40+30=70 et 3+4=7, puis 70+7=77' },
      { question: 'Calcule 32 + 45', firstNumber: 32, secondNumber: 45, correctAnswer: 77, type: 'decomposition', hint: 'Décompose : 30+40=70 et 2+5=7, puis 70+7=77' },
      { question: 'Calcule 61 + 15', firstNumber: 61, secondNumber: 15, correctAnswer: 76, type: 'decomposition', hint: 'Sépare : 60+10=70 et 1+5=6, puis 70+6=76' }
    ],
    'bonds-10': [
      { question: 'Calcule 23 + 30', firstNumber: 23, secondNumber: 30, correctAnswer: 53, type: 'bonds-10', hint: 'Fais 3 bonds de 10 : 23→33→43→53' },
    { question: 'Calcule 45 + 20', firstNumber: 45, secondNumber: 20, correctAnswer: 65, type: 'bonds-10', hint: 'Deux bonds de 10 : 45→55→65' },
      { question: 'Calcule 17 + 40', firstNumber: 17, secondNumber: 40, correctAnswer: 57, type: 'bonds-10', hint: 'Quatre bonds de 10 : 17→27→37→47→57' },
      { question: 'Calcule 32 + 50', firstNumber: 32, secondNumber: 50, correctAnswer: 82, type: 'bonds-10', hint: 'Cinq bonds de 10 : 32→42→52→62→72→82' },
      { question: 'Calcule 28 + 20', firstNumber: 28, secondNumber: 20, correctAnswer: 48, type: 'bonds-10', hint: 'Deux bonds de 10 : 28→38→48' },
      { question: 'Calcule 14 + 30', firstNumber: 14, secondNumber: 30, correctAnswer: 44, type: 'bonds-10', hint: 'Trois bonds de 10 : 14→24→34→44' },
      { question: 'Calcule 36 + 40', firstNumber: 36, secondNumber: 40, correctAnswer: 76, type: 'bonds-10', hint: 'Quatre bonds de 10 : 36→46→56→66→76' },
      { question: 'Calcule 51 + 20', firstNumber: 51, secondNumber: 20, correctAnswer: 71, type: 'bonds-10', hint: 'Deux bonds de 10 : 51→61→71' },
      { question: 'Calcule 29 + 30', firstNumber: 29, secondNumber: 30, correctAnswer: 59, type: 'bonds-10', hint: 'Trois bonds de 10 : 29→39→49→59' },
      { question: 'Calcule 43 + 50', firstNumber: 43, secondNumber: 50, correctAnswer: 93, type: 'bonds-10', hint: 'Cinq bonds de 10 : 43→53→63→73→83→93' }
    ],
    compensation: [
      { question: 'Calcule 29 + 15', firstNumber: 29, secondNumber: 15, correctAnswer: 44, type: 'compensation', hint: 'Transforme en 30 + 14, c\'est plus facile !' },
    { question: 'Calcule 38 + 19', firstNumber: 38, secondNumber: 19, correctAnswer: 57, type: 'compensation', hint: 'Transforme en 37 + 20 = 57' },
      { question: 'Calcule 49 + 16', firstNumber: 49, secondNumber: 16, correctAnswer: 65, type: 'compensation', hint: 'Transforme en 50 + 15 = 65' },
      { question: 'Calcule 59 + 18', firstNumber: 59, secondNumber: 18, correctAnswer: 77, type: 'compensation', hint: 'Transforme en 60 + 17 = 77' },
      { question: 'Calcule 39 + 17', firstNumber: 39, secondNumber: 17, correctAnswer: 56, type: 'compensation', hint: 'Transforme en 40 + 16 = 56' },
      { question: 'Calcule 28 + 19', firstNumber: 28, secondNumber: 19, correctAnswer: 47, type: 'compensation', hint: 'Transforme en 27 + 20 = 47' },
      { question: 'Calcule 48 + 19', firstNumber: 48, secondNumber: 19, correctAnswer: 67, type: 'compensation', hint: 'Transforme en 47 + 20 = 67' },
      { question: 'Calcule 69 + 15', firstNumber: 69, secondNumber: 15, correctAnswer: 84, type: 'compensation', hint: 'Transforme en 70 + 14 = 84' },
      { question: 'Calcule 58 + 17', firstNumber: 58, secondNumber: 17, correctAnswer: 75, type: 'compensation', hint: 'Transforme en 57 + 18 ou 60 + 15' },
      { question: 'Calcule 79 + 14', firstNumber: 79, secondNumber: 14, correctAnswer: 93, type: 'compensation', hint: 'Transforme en 80 + 13 = 93' }
    ],
    'etapes-successives': [
      { question: 'Calcule 34 + 28', firstNumber: 34, secondNumber: 28, correctAnswer: 62, type: 'etapes-successives', hint: 'D\'abord 34+20=54, puis 54+8=62' },
    { question: 'Calcule 47 + 35', firstNumber: 47, secondNumber: 35, correctAnswer: 82, type: 'etapes-successives', hint: 'Étapes : 47+30=77, puis 77+5=82' },
      { question: 'Calcule 56 + 27', firstNumber: 56, secondNumber: 27, correctAnswer: 83, type: 'etapes-successives', hint: 'Étapes : 56+20=76, puis 76+7=83' },
      { question: 'Calcule 43 + 39', firstNumber: 43, secondNumber: 39, correctAnswer: 82, type: 'etapes-successives', hint: 'Étapes : 43+30=73, puis 73+9=82' },
      { question: 'Calcule 65 + 26', firstNumber: 65, secondNumber: 26, correctAnswer: 91, type: 'etapes-successives', hint: 'Étapes : 65+20=85, puis 85+6=91' },
      { question: 'Calcule 52 + 39', firstNumber: 52, secondNumber: 39, correctAnswer: 91, type: 'etapes-successives', hint: 'Étapes : 52+30=82, puis 82+9=91' },
      { question: 'Calcule 38 + 45', firstNumber: 38, secondNumber: 45, correctAnswer: 83, type: 'etapes-successives', hint: 'Étapes : 38+40=78, puis 78+5=83' },
      { question: 'Calcule 27 + 46', firstNumber: 27, secondNumber: 46, correctAnswer: 73, type: 'etapes-successives', hint: 'Étapes : 27+40=67, puis 67+6=73' },
      { question: 'Calcule 59 + 24', firstNumber: 59, secondNumber: 24, correctAnswer: 83, type: 'etapes-successives', hint: 'Étapes : 59+20=79, puis 79+4=83' },
      { question: 'Calcule 46 + 37', firstNumber: 46, secondNumber: 37, correctAnswer: 83, type: 'etapes-successives', hint: 'Étapes : 46+30=76, puis 76+7=83' }
    ],
    doubles: [
      { question: 'Calcule 25 + 26', firstNumber: 25, secondNumber: 26, correctAnswer: 51, type: 'doubles', hint: 'C\'est 25+25+1 = 50+1 = 51' },
      { question: 'Calcule 34 + 35', firstNumber: 34, secondNumber: 35, correctAnswer: 69, type: 'doubles', hint: 'C\'est 34+34+1 = 68+1 = 69' },
      { question: 'Calcule 42 + 43', firstNumber: 42, secondNumber: 43, correctAnswer: 85, type: 'doubles', hint: 'C\'est 42+42+1 = 84+1 = 85' },
      { question: 'Calcule 36 + 37', firstNumber: 36, secondNumber: 37, correctAnswer: 73, type: 'doubles', hint: 'C\'est 36+36+1 = 72+1 = 73' },
      { question: 'Calcule 23 + 24', firstNumber: 23, secondNumber: 24, correctAnswer: 47, type: 'doubles', hint: 'C\'est 23+23+1 = 46+1 = 47' },
      { question: 'Calcule 47 + 48', firstNumber: 47, secondNumber: 48, correctAnswer: 95, type: 'doubles', hint: 'C\'est 47+47+1 = 94+1 = 95' },
      { question: 'Calcule 31 + 32', firstNumber: 31, secondNumber: 32, correctAnswer: 63, type: 'doubles', hint: 'C\'est 31+31+1 = 62+1 = 63' },
      { question: 'Calcule 28 + 29', firstNumber: 28, secondNumber: 29, correctAnswer: 57, type: 'doubles', hint: 'C\'est 28+28+1 = 56+1 = 57' },
      { question: 'Calcule 45 + 46', firstNumber: 45, secondNumber: 46, correctAnswer: 91, type: 'doubles', hint: 'C\'est 45+45+1 = 90+1 = 91' },
      { question: 'Calcule 33 + 34', firstNumber: 33, secondNumber: 34, correctAnswer: 67, type: 'doubles', hint: 'C\'est 33+33+1 = 66+1 = 67' }
    ],
    melange: [
      { question: 'Calcule 47 + 32', firstNumber: 47, secondNumber: 32, correctAnswer: 79, type: 'decomposition', hint: 'Décompose : 40+30=70 et 7+2=9, puis 70+9=79' },
      { question: 'Calcule 26 + 40', firstNumber: 26, secondNumber: 40, correctAnswer: 66, type: 'bonds-10', hint: 'Quatre bonds de 10 : 26→36→46→56→66' },
      { question: 'Calcule 39 + 18', firstNumber: 39, secondNumber: 18, correctAnswer: 57, type: 'compensation', hint: 'Transforme en 40 + 17 = 57' },
      { question: 'Calcule 54 + 29', firstNumber: 54, secondNumber: 29, correctAnswer: 83, type: 'etapes-successives', hint: 'Étapes : 54+20=74, puis 74+9=83' },
      { question: 'Calcule 37 + 38', firstNumber: 37, secondNumber: 38, correctAnswer: 75, type: 'doubles', hint: 'C\'est 37+37+1 = 74+1 = 75' },
      { question: 'Calcule 51 + 24', firstNumber: 51, secondNumber: 24, correctAnswer: 75, type: 'decomposition', hint: 'Décompose : 50+20=70 et 1+4=5, puis 70+5=75' },
      { question: 'Calcule 33 + 30', firstNumber: 33, secondNumber: 30, correctAnswer: 63, type: 'bonds-10', hint: 'Trois bonds de 10 : 33→43→53→63' },
      { question: 'Calcule 48 + 17', firstNumber: 48, secondNumber: 17, correctAnswer: 65, type: 'compensation', hint: 'Transforme en 50 + 15 = 65' },
      { question: 'Calcule 35 + 48', firstNumber: 35, secondNumber: 48, correctAnswer: 83, type: 'etapes-successives', hint: 'Étapes : 35+40=75, puis 75+8=83' },
      { question: 'Calcule 44 + 45', firstNumber: 44, secondNumber: 45, correctAnswer: 89, type: 'doubles', hint: 'C\'est 44+44+1 = 88+1 = 89' }
    ]
  };

  // État pour gérer les séries
  const [currentSeries, setCurrentSeries] = useState<string>('decomposition');

  // Exercices actuels basés sur la série sélectionnée
  const exercises = exerciseSeries[currentSeries as keyof typeof exerciseSeries];

  // Mount check
  useEffect(() => {
    setIsClient(true);

    // Pas de manipulation forcée du scroll - laissons le navigateur gérer naturellement

    // Gestionnaires d'événements pour arrêter les animations lors de navigation
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    // Événements de navigation et changement d'onglet
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Override history pour détecter la navigation programmatique
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      
      // Plus de nettoyage de styles puisqu'on n'en force plus
      
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Effet pour arrêter les animations lors du changement cours ↔ exercices
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Effet pour la détection mobile et réinitialisation
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Réinitialiser stopSignalRef au chargement de la page
    stopSignalRef.current = false;
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    // Arrêter complètement la synthèse vocale
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() appelé');
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    // Reset de tous les états d'animation et de vocal
    setIsPlayingVocal(false);
    setIsPlayingEnonce(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setCurrentTechnique(null);
    setCalculationStep(null);
    setShowingCarry(false);
    setHighlightedDigits([]);
    setSamSizeExpanded(false);
    
    // Nouveaux états pour la correction animée
    setShowAnimatedCorrection(false);
    setCorrectionStep(null);
    setHighlightNextButton(false);
    setAnimatedObjects([]);
    setCorrectionNumbers(null);
    setCountingIndex(-1);
    setSelectedTechnique(null);
    setSelectedExampleIndex(0);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        console.log('🚫 playAudio annulé par stopSignalRef');
        resolve();
        return;
      }

      // S'assurer que la synthèse précédente est bien arrêtée
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        console.log('🔇 Audio précédent annulé dans playAudio');
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // 🍎 FORCE APPLE SYSTEM VOICES ONLY - Diagnostic logs
      const voices = speechSynthesis.getVoices();
      console.log('🔍 Toutes les voix disponibles:');
      voices.forEach(voice => {
        console.log(`  ${voice.name} (${voice.lang}) [Local: ${voice.localService}] [Default: ${voice.default}]`);
      });
      
      // 🎯 PRIORITÉ ABSOLUE: Voix système Apple françaises uniquement
      const appleVoices = voices.filter(voice => 
        voice.localService === true && 
        (voice.lang === 'fr-FR' || voice.lang === 'fr')
      );
      
      console.log('🍎 Voix Apple système françaises trouvées:', appleVoices.map(v => v.name));
      
      const femaleVoiceNames = ['Amélie', 'Audrey', 'Marie', 'Julie', 'Céline', 'Virginie', 'Pauline', 'Lucie', 'Charlotte', 'Léa'];
      
      // 1. Recherche voix féminine Apple française
      let bestFrenchVoice = appleVoices.find(voice => 
        femaleVoiceNames.some(name => voice.name.includes(name))
      );
      
      // 2. Fallback: N'importe quelle voix Apple française
      if (!bestFrenchVoice) {
        bestFrenchVoice = appleVoices.find(voice => 
          voice.lang === 'fr-FR' || voice.lang === 'fr'
        );
      }
      
      // 3. Fallback: Voix Apple par défaut (même si pas française)
      if (!bestFrenchVoice) {
        const defaultAppleVoice = voices.find(voice => 
          voice.localService === true && voice.default === true
        );
        if (defaultAppleVoice) {
          bestFrenchVoice = defaultAppleVoice;
          console.log('⚠️ Utilisation voix Apple par défaut (non française):', defaultAppleVoice.name);
        }
      }
      
      // 4. Dernier recours: Première voix Apple disponible
      if (!bestFrenchVoice && appleVoices.length > 0) {
        bestFrenchVoice = appleVoices[0];
        console.log('⚠️ Utilisation première voix Apple disponible:', bestFrenchVoice.name);
      }

      if (bestFrenchVoice) {
        utterance.voice = bestFrenchVoice;
        console.log('✅ Voix sélectionnée (Apple système):', bestFrenchVoice.name, '(', bestFrenchVoice.lang, ')');
      } else {
        console.warn('⚠️ Aucune voix française trouvée');
      }
      
      utterance.onend = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      utterance.onerror = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
  };

  // Fonction utilitaire pour les pauses
  const wait = (ms: number) => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve(undefined);
        return;
      }
      setTimeout(resolve, ms);
    });
  };

  // Fonction pour faire défiler vers une section
  const scrollToSection = (elementId: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest' 
        });
      }
    }, 300);
  };

  // Fonction pour scroller vers le bouton Suivant
  const scrollToNextButton = () => {
    if (nextButtonRef.current) {
      nextButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  // Fonction pour vérifier si une addition est correcte
  const isValidAddition = (userAnswer: string, exercise: any) => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer) || answer < 0) return false;
    
    return answer === exercise.correctAnswer;
  };

  // Fonction pour parser les nombres d'un exercice d'addition
  const parseAdditionNumbers = (exercise: any) => {
    return {
      first: exercise.firstNumber,
      second: exercise.secondNumber,
      result: exercise.correctAnswer,
      objectEmoji1: '🔴',
      objectEmoji2: '🔵',
      objectName: 'objets'
    };
  };

  // Fonction pour créer une correction animée avec addition posée en colonnes
  const createAnimatedCorrection = async (exercise: any, userAnswer?: string) => {
    if (stopSignalRef.current) return;
    
    console.log('Début correction animée pour addition jusqu\'à 100:', exercise, 'avec réponse:', userAnswer);
    
    const { first, second, result, objectEmoji1, objectEmoji2, objectName } = parseAdditionNumbers(exercise);
    
    // Stocker les nombres pour l'affichage
    setCorrectionNumbers({ first, second, result, objectEmoji1, objectEmoji2, objectName });
    
    // Démarrer l'affichage de correction
    setShowAnimatedCorrection(true);
    setCorrectionStep('numbers');
    setHighlightedDigits([]);
    
    // Scroller pour garder la correction visible
    setTimeout(() => {
      const correctionElement = document.getElementById('animated-correction');
      if (correctionElement) {
        correctionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
    
    // Étape 1: Présentation du problème
    const hasUserAnswer = userAnswer && userAnswer.trim();
    if (hasUserAnswer) {
      const userNum = parseInt(userAnswer);
      if (userNum === result) {
        await playAudio(`Je vais te montrer que ${first} plus ${second} égale bien ${result} avec une addition posée !`);
      } else {
        await playAudio(`Tu as répondu ${userAnswer}, mais regardons le bon calcul avec une addition posée !`);
      }
    } else {
      await playAudio(`Je vais t'expliquer cette addition avec la technique de l'addition posée !`);
    }
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 2: Placement en colonnes
    await playAudio(`D'abord, je place les nombres en colonnes : dizaines sous dizaines, unités sous unités.`);
    if (stopSignalRef.current) return;
    await wait(2500);
    
    // Déterminer s'il y a une retenue
    const hasCarry = (first % 10) + (second % 10) >= 10;
    
    if (hasCarry) {
      // Addition avec retenue
      setCorrectionStep('carry-step');
      
      // Étape 3: Focus sur les unités
      setHighlightedDigits(['units']);
      await playAudio(`Commençons par les unités : ${first % 10} plus ${second % 10}.`);
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Étape 4: Calcul des unités avec retenue - résultat brut
      const unitsSum = (first % 10) + (second % 10);
      await playAudio(`${first % 10} plus ${second % 10} égale ${unitsSum}.`);
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Étape 5: Explication de la décomposition
      setCorrectionStep('decomposition');
      await playAudio(`Attention ! ${unitsSum} est plus grand que 9, donc je dois le décomposer !`);
      if (stopSignalRef.current) return;
      await wait(2500);
      
      await playAudio(`${unitsSum} égale ${Math.floor(unitsSum / 10)} dizaine plus ${unitsSum % 10} unités.`);
      if (stopSignalRef.current) return;
      await wait(3500);
      
      await playAudio(`J'écris ${unitsSum % 10} en bas dans les unités, et je retiens ${Math.floor(unitsSum / 10)} en haut pour les dizaines !`);
      if (stopSignalRef.current) return;
      await wait(3500);
      
      // Étape 6: Montrer la retenue
      await playAudio(`Regardez ! J'écris 1 au-dessus des dizaines pour me rappeler de l'ajouter.`);
      if (stopSignalRef.current) return;
      await wait(2500);
      
      // Étape 7: Focus sur les dizaines
      setHighlightedDigits(['tens']);
      const tensSum = Math.floor(first / 10) + Math.floor(second / 10) + 1;
      await playAudio(`Maintenant les dizaines : ${Math.floor(first / 10)} plus ${Math.floor(second / 10)} plus 1 de retenue égale ${tensSum}.`);
      if (stopSignalRef.current) return;
      await wait(3000);
      
    } else {
      // Addition sans retenue
      setCorrectionStep('adding');
      
      // Étape 3: Focus sur les unités
      setHighlightedDigits(['units']);
      await playAudio(`Commençons par les unités : ${first % 10} plus ${second % 10} égale ${(first % 10) + (second % 10)}.`);
      if (stopSignalRef.current) return;
      await wait(2500);
      
      // Étape 4: Focus sur les dizaines
      setHighlightedDigits(['tens']);
      await playAudio(`Maintenant les dizaines : ${Math.floor(first / 10)} plus ${Math.floor(second / 10)} égale ${Math.floor(first / 10) + Math.floor(second / 10)}.`);
      if (stopSignalRef.current) return;
      await wait(2500);
    }
    
    // Étape finale: Résultat complet
    setCorrectionStep('final-sum');
    setHighlightedDigits([]);
    await playAudio(`Et voilà le résultat complet : ${result} !`);
    if (stopSignalRef.current) return;
    await wait(2000);
    
    await playAudio(`Donc ${first} + ${second} = ${result} ! C'est comme ça qu'on fait une addition posée !`);
    if (stopSignalRef.current) return;
    await wait(2000);
    
    // Étape terminée
    setCorrectionStep('complete');
    
    // Messages différents selon mobile/desktop
    if (isMobile) {
      await playAudio(`Appuie sur suivant pour un autre exercice !`);
    } else {
      await playAudio(`Maintenant tu peux cliquer sur suivant pour continuer !`);
    }
    
    // Illuminer le bouton et scroller
    setHighlightNextButton(true);
    
    if (isMobile) {
      setTimeout(() => {
        if (nextButtonRef.current) {
          nextButtonRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 800);
    } else {
      setTimeout(() => {
        scrollToNextButton();
      }, 500);
    }
  };

  // Fonction pour expliquer le chapitre dans le cours avec Sam
  const explainChapterWithSam = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    try {
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les additions jusqu'à 100 !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
              await playAudio("Tu vas découvrir 4 techniques extraordinaires pour calculer avec de gros nombres, par les blocs de diamant !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      await playAudio("La décomposition, le complément à 10, les bonds de 10, la compensation, les étapes successives et les doubles !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      await playAudio("Avec ces techniques, tu seras un champion des additions jusqu'à 100 !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapterWithSam:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
    }
  };

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);

    try {
      // Introduction
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les additions jusqu'à 100 ! C'est un cours très important qui va te rendre super fort en calcul !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Les techniques
      setHighlightedElement('techniques');
      scrollToSection('techniques-section');
      await playAudio("Je vais te montrer 6 techniques extraordinaires pour additionner facilement tous les nombres jusqu'à 100 !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Première technique : décomposition
      setAnimatingStep('decomposition');
      await playAudio("Première technique : la décomposition ! On sépare les dizaines et les unités, c'est génial !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Deuxième technique : complément à 10
      setAnimatingStep('complement-10');
      await playAudio("Deuxième technique : le complément à 10 ! Une astuce magique pour arriver aux dizaines rondes !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Troisième technique : bonds de 10
      setAnimatingStep('bonds-10');
      await playAudio("Troisième technique : les bonds de 10 ! On saute de 10 en 10, c'est rapide et amusant !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Quatrième technique : compensation
      setAnimatingStep('compensation');
      await playAudio("Quatrième technique : la compensation ! On échange pour rendre les nombres plus faciles !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Cinquième technique : étapes successives
      setAnimatingStep('etapes-successives');
      await playAudio("Cinquième technique : les étapes successives ! On avance morceau par morceau !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Sixième technique : doubles
      setAnimatingStep('doubles');
      await playAudio("Sixième technique : les doubles ! Quand les nombres se ressemblent, c'est formidable !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Transition vers les exemples
      setHighlightedElement('examples');
      scrollToSection('examples-section');
      await playAudio("Maintenant, choisis une technique et je te montre comment elle fonctionne avec de belles animations !");
      await wait(500);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour expliquer une technique spécifique
  const explainTechnique = async (techniqueIndex: number, exampleIndex: number = 0) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const technique = additionTechniques[techniqueIndex];
    const example = technique.examples[exampleIndex];
    setCurrentTechnique(technique.id);
    setCurrentExample(exampleIndex);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Présentation de la technique
      setHighlightedElement('technique-title');
      await playAudio(`Découvrons la technique : ${technique.title} ! ${technique.description}`);
      await wait(800);

      if (stopSignalRef.current) return;

      // Animation spécifique selon la technique
      if (technique.id === 'sans-retenue') {
        await animateSansRetenue(example);
      } else if (technique.id === 'avec-retenue') {
        await animateAvecRetenue(example);
      } else if (technique.id === 'calcul-mental') {
        await animateCalculMental(example);
      } else if (technique.id === 'complement-10') {
        await animateComplement10(example);
      } else if (technique.id === 'decomposition') {
        await animateDecomposition(example);
      } else if (technique.id === 'bonds-10') {
        await animateBonds10(example);
      } else if (technique.id === 'compensation') {
        await animateCompensation(example);
      } else if (technique.id === 'etapes-successives') {
        await animateEtapesSuccessives(example);
      } else if (technique.id === 'doubles') {
        await animateDoubles(example);
      }

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentTechnique(null);
      setCurrentExample(null);
      setCalculationStep(null);
      setIsAnimationRunning(false);
      setShowingCarry(false);
      setHighlightedDigits([]);
    }
  };

  // Animation pour addition sans retenue
  const animateSansRetenue = async (example: any) => {
    // Étape 1 : Setup
    setCalculationStep('setup');
    await playAudio(`Calculons ${example.calculation}. Je place les nombres en colonnes, l'un sous l'autre.`);
    await wait(1000);

    if (stopSignalRef.current) return;

    // Étape 2 : Unités
    setCalculationStep('units');
    setHighlightedDigits(['units']);
    await playAudio(`J'additionne d'abord les unités : ${example.num1 % 10} plus ${example.num2 % 10} égale ${(example.num1 % 10) + (example.num2 % 10)}.`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 3 : Dizaines
    setCalculationStep('tens');
    setHighlightedDigits(['tens']);
    await playAudio(`Ensuite les dizaines : ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} égale ${Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)}.`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 4 : Explication de la condition importante
    setCalculationStep('result');
    setHighlightedDigits([]);
    await playAudio(`Attention ! Cette technique sans retenue ne fonctionne que si chaque addition en colonne ne dépasse pas 10.`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Vérification des sommes
    const unitsSum = (example.num1 % 10) + (example.num2 % 10);
    const tensSum = Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10);
    await playAudio(`Ici, ${example.num1 % 10} plus ${example.num2 % 10} égale ${unitsSum}, et ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} égale ${tensSum}. Aucune somme ne dépasse 10 !`);
    await wait(2000);

    if (stopSignalRef.current) return;

    // Étape 5 : Résultat final
    await playAudio(`Le résultat est ${example.result} ! C'était facile car il n'y avait pas de retenue !`);
    await wait(1000);
  };

  // Animation pour addition avec retenue
  const animateAvecRetenue = async (example: any) => {
    const unitsSum = (example.num1 % 10) + (example.num2 % 10);
    const hasCarry = unitsSum >= 10;

    // Étape 1 : Introduction
    setCalculationStep('setup');
    await playAudio(`Addition avec retenue : ${example.calculation}. Je vais te montrer comment faire quand ça dépasse 10 !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 2 : Placement en colonnes
    await playAudio(`D'abord, je place les nombres en colonnes : dizaines sous dizaines, unités sous unités.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 3 : Focus sur les unités
    setCalculationStep('units');
    setHighlightedDigits(['units']);
    await playAudio(`Commençons par les unités : ${example.num1 % 10} plus ${example.num2 % 10}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 4 : Calcul des unités avec visualisation
    setCalculationStep('units-sum');
    await playAudio(`${example.num1 % 10} plus ${example.num2 % 10} égale ${unitsSum}. Regarde bien ce qui se passe !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    if (hasCarry) {
      // Étape 5 : Explication de la retenue
      setCalculationStep('carry-explanation');
      await playAudio(`${unitsSum}, c'est plus que 10 ! Je dois décomposer : ${unitsSum} égale ${Math.floor(unitsSum / 10)} dizaine plus ${unitsSum % 10} unités.`);
      await wait(4000);

      if (stopSignalRef.current) return;

      // Étape 6 : Animation visuelle de la retenue
      setCalculationStep('carry-visual');
      setShowingCarry(true);
      await playAudio(`La dizaine va glisser vers le haut pour rejoindre les dizaines. L'unité reste en bas.`);
      await wait(3500);

      if (stopSignalRef.current) return;

      await playAudio(`J'écris ${unitsSum % 10} dans les unités, et je retiens ${Math.floor(unitsSum / 10)} dans les dizaines !`);
      await wait(3000);

      if (stopSignalRef.current) return;
    }

    // Étape 7 : Calcul des dizaines
    setCalculationStep('tens');
    setHighlightedDigits(['tens']);
    const tensSum = Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10) + (hasCarry ? 1 : 0);
    
    if (hasCarry) {
      await playAudio(`Maintenant les dizaines : ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} plus 1 de retenue.`);
      await wait(3500);

      if (stopSignalRef.current) return;

      await playAudio(`${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} plus 1 égale ${tensSum}.`);
      await wait(3000);
    } else {
      await playAudio(`Maintenant les dizaines : ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} égale ${tensSum}.`);
      await wait(2500);
    }

    if (stopSignalRef.current) return;

    // Étape 8 : Résultat final
    setCalculationStep('result');
    setHighlightedDigits([]);
    await playAudio(`Résultat final : ${tensSum}${unitsSum % 10} = ${example.result} ! Bravo, tu maîtrises la retenue !`);
    await wait(3000);
  };

  // Animation pour calcul mental
  const animateCalculMental = async (example: any) => {
    // Étape 1 : Introduction
    setCalculationStep('setup');
    await playAudio(`Calcul mental de ${example.calculation}. Je vais te montrer une technique magique !`);
    await wait(2000);

    if (stopSignalRef.current) return;

    // Étape 2 : Présentation du premier nombre
    setCalculationStep('show-first');
    await playAudio(`D'abord, regardons ${example.num1}. Je vais le décomposer en dizaines et unités.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 3 : Décomposition visuelle du premier nombre
    setCalculationStep('decompose-first');
    const tens1 = Math.floor(example.num1 / 10);
    const units1 = example.num1 % 10;
    await playAudio(`${example.num1}, c'est ${tens1} dizaine${tens1 > 1 ? 's' : ''} et ${units1} unité${units1 > 1 ? 's' : ''}. Regarde bien !`);
    await wait(3500);

    if (stopSignalRef.current) return;

    // Étape 4 : Présentation du deuxième nombre
    setCalculationStep('show-second');
    await playAudio(`Maintenant, regardons ${example.num2}. Je vais aussi le décomposer.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 5 : Décomposition visuelle du deuxième nombre
    setCalculationStep('decompose-second');
    const tens2 = Math.floor(example.num2 / 10);
    const units2 = example.num2 % 10;
    await playAudio(`${example.num2}, c'est ${tens2} dizaine${tens2 > 1 ? 's' : ''} et ${units2} unité${units2 > 1 ? 's' : ''}. Tu vois la différence de couleur ?`);
    await wait(3500);

    if (stopSignalRef.current) return;

    // Étape 6 : Explication de la stratégie
    setCalculationStep('explain-strategy');
    await playAudio(`Maintenant, voici le secret : je vais additionner les dizaines ensemble, puis les unités ensemble !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 7 : Calcul des dizaines
    setCalculationStep('tens');
    setHighlightedDigits(['tens']);
    const tensTotal = tens1 + tens2;
    await playAudio(`Les dizaines : ${tens1} dizaine${tens1 > 1 ? 's' : ''} plus ${tens2} dizaine${tens2 > 1 ? 's' : ''}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    await playAudio(`${tens1} plus ${tens2} égale ${tensTotal}. Donc j'ai ${tensTotal} dizaine${tensTotal > 1 ? 's' : ''} !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 8 : Calcul des unités
    setCalculationStep('units');
    setHighlightedDigits(['units']);
    const unitsTotal = units1 + units2;
    await playAudio(`Les unités : ${units1} unité${units1 > 1 ? 's' : ''} plus ${units2} unité${units2 > 1 ? 's' : ''}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    await playAudio(`${units1} plus ${units2} égale ${unitsTotal}. Donc j'ai ${unitsTotal} unité${unitsTotal > 1 ? 's' : ''} !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 9 : Regroupement final
    setCalculationStep('regroup');
    setHighlightedDigits([]);
    await playAudio(`Maintenant, je regroupe : ${tensTotal} dizaine${tensTotal > 1 ? 's' : ''} plus ${unitsTotal} unité${unitsTotal > 1 ? 's' : ''}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 10 : Résultat final
    setCalculationStep('result');
    await playAudio(`${tensTotal * 10} plus ${unitsTotal} égale ${example.result} ! Bravo, tu maîtrises le calcul mental !`);
    await wait(2500);
  };

  // Animation pour complément à 10
  const animateComplement10 = async (example: any) => {
    // Étape 1 : Introduction
    setCalculationStep('setup');
    await playAudio(`Technique du complément à 10 : ${example.calculation}. Je vais te montrer une astuce géniale !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 2 : Présentation du problème
    setCalculationStep('show-problem');
    await playAudio(`Je veux calculer ${example.num1} plus ${example.num2}. Voici ma stratégie secrète !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 3 : Trouver le complément
    setCalculationStep('find-complement');
    const complement = 10 - (example.num1 % 10);
    const nextTen = Math.ceil(example.num1 / 10) * 10;
    await playAudio(`D'abord, je regarde ${example.num1}. Pour arriver à ${nextTen}, j'ai besoin de ${complement}.`);
    await wait(3500);

    if (stopSignalRef.current) return;

    await playAudio(`${example.num1} plus ${complement} égale ${nextTen}. C'est plus facile de calculer avec ${nextTen} !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 4 : Ajouter le complément
    setCalculationStep('add-complement');
    await playAudio(`Je prends ${complement} dans ${example.num2}. ${example.num2} moins ${complement} égale ${example.num2 - complement}.`);
    await wait(3500);

    if (stopSignalRef.current) return;

    // Étape 5 : Montrer l'étape intermédiaire
    setCalculationStep('show-intermediate');
    await playAudio(`Maintenant j'ai ${nextTen} plus ${example.num2 - complement}. C'est beaucoup plus simple !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 6 : Addition du reste
    setCalculationStep('add-remaining');
    await playAudio(`${nextTen} plus ${example.num2 - complement} égale ${example.result}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 7 : Résultat final
    setCalculationStep('result');
    setHighlightedDigits([]);
    await playAudio(`Résultat : ${example.result} ! Tu vois comme c'est malin ? Le complément à 10 rend tout plus facile !`);
    await wait(3000);
  };

  // Fonction pour ouvrir le cadre de sélection d'exemples
  const openExampleSelector = (techniqueIndex: number) => {
    if (isAnimationRunning) return;
    
    const technique = additionTechniques[techniqueIndex];
    setSelectedTechnique(technique.id);
    setSelectedExampleIndex(0); // Par défaut le premier exemple
    
    // Scroll vers la zone d'animation
    scrollToSection('animation-section');
  };

  // Animation pour décomposition
  const animateDecomposition = async (example: any) => {
    // Étape 1 : Introduction
    setCalculationStep('setup');
    await playAudio(`Décomposition en dizaines et unités : ${example.calculation}. Je vais séparer chaque nombre !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 2 : Décomposer le premier nombre
    setCalculationStep('decompose-first');
    // Scroll vers la décomposition
    setTimeout(() => {
      const element = document.getElementById('decomposition-animation');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    const dizaines1 = Math.floor(example.num1 / 10) * 10;
    const unites1 = example.num1 % 10;
    await playAudio(`${example.num1} se décompose en ${dizaines1} plus ${unites1}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 3 : Décomposer le second nombre  
    setCalculationStep('decompose-second');
    const dizaines2 = Math.floor(example.num2 / 10) * 10;
    const unites2 = example.num2 % 10;
    await playAudio(`${example.num2} se décompose en ${dizaines2} plus ${unites2}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 4 : Additionner les dizaines
    setCalculationStep('tens');
    // Scroll vers l'addition des dizaines
    setTimeout(() => {
      const element = document.getElementById('tens-addition');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    const sommeDizaines = dizaines1 + dizaines2;
    await playAudio(`J'additionne les dizaines : ${dizaines1} plus ${dizaines2} égale ${sommeDizaines}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 5 : Additionner les unités
    setCalculationStep('units');
    // Scroll vers l'addition des unités
    setTimeout(() => {
      const element = document.getElementById('units-addition');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    const sommeUnites = unites1 + unites2;
    await playAudio(`J'additionne les unités : ${unites1} plus ${unites2} égale ${sommeUnites}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 6 : Résultat final
    setCalculationStep('result');
    // Scroll vers le résultat final
    setTimeout(() => {
      const element = document.getElementById('final-result');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    await playAudio(`Je regroupe : ${sommeDizaines} plus ${sommeUnites} égale ${example.result} !`);
    await wait(3000);

    // Scroll final pour voir toute la démarche
    setTimeout(() => {
      const element = document.getElementById('decomposition-animation');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1000);
  };

  // Animation pour bonds de 10
  const animateBonds10 = async (example: any) => {
    setCalculationStep('setup');
    await playAudio(`Bonds de 10 : ${example.calculation}. Je vais sauter de 10 en 10 !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    let current = example.num1;
    const dizaines = Math.floor(example.num2 / 10);
    const unites = example.num2 % 10;
    
    setCalculationStep('show-first');
    // Scroll vers l'animation bonds
    setTimeout(() => {
      const element = document.getElementById('bonds-animation');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    await playAudio(`Je pars de ${current}. J'ajoute ${example.num2}.`);
    await wait(2000);

    if (stopSignalRef.current) return;

    setCalculationStep('tens');
    if (dizaines > 0) {
      // Scroll vers l'explication des bonds
      setTimeout(() => {
        const element = document.getElementById('bonds-explanation');
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
      await playAudio(`${example.num2} égale ${dizaines * 10} plus ${unites}. Donc je fais ${dizaines} bonds de 10${unites > 0 ? ` puis j'ajoute ${unites}` : ''}.`);
      await wait(3000);
    }

    if (stopSignalRef.current) return;

    for (let i = 0; i < dizaines; i++) {
      if (stopSignalRef.current) return;
      current += 10;
      setCalculationStep('units');
      // Scroll vers l'exécution des bonds
      if (i === 0) {
        setTimeout(() => {
          const element = document.getElementById('bonds-execution');
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
      await playAudio(`Bond ${i + 1} : plus 10 égale ${current} !`);
      await wait(1800);
    }

    if (stopSignalRef.current) return;

    // Ajouter les unités restantes s'il y en a
    if (unites > 0) {
      // Scroll vers l'ajout des unités
      setTimeout(() => {
        const element = document.getElementById('bonds-units');
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      current += unites;
      await playAudio(`Il me reste ${unites} unités à ajouter : ${current - unites} plus ${unites} égale ${current} !`);
      await wait(2500);
    }

    if (stopSignalRef.current) return;

    setCalculationStep('result');
    // Scroll vers le résultat final puis vue d'ensemble
    setTimeout(() => {
      const element = document.getElementById('bonds-result');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
    await wait(1000);
    setTimeout(() => {
      const element = document.getElementById('bonds-animation');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
    await playAudio(`Résultat : ${example.result} ! Les bonds de 10, c'est rapide et amusant !`);
    await wait(3000);
  };

  // Animation pour compensation
  const animateCompensation = async (example: any) => {
    setCalculationStep('setup');
    await playAudio(`Compensation : ${example.calculation}. Je vais rendre les nombres plus faciles !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    setCalculationStep('show-problem');
    await playAudio(`Je veux calculer ${example.num1} plus ${example.num2}.`);
    await wait(2000);

    if (stopSignalRef.current) return;

    setCalculationStep('find-complement');
    // Logique pour 29 + 15 = 30 + 14
    if (example.num1 === 29 && example.num2 === 15) {
      await playAudio(`D'abord, je décompose ${example.num2} : ${example.num2} égale ${example.num2 - 1} plus 1.`);
      await wait(3000);
      
      if (stopSignalRef.current) return;
      
      await playAudio(`Ce 1 va compléter ${example.num1} pour faire ${example.num1 + 1} : ${example.num1} plus 1 égale ${example.num1 + 1}.`);
      await wait(3000);
      
      if (stopSignalRef.current) return;
      
      setCalculationStep('result');
      await playAudio(`Maintenant c'est ${example.num1 + 1} plus ${example.num2 - 1} égale ${example.result} ! Beaucoup plus simple !`);
    } else {
      // Logique pour 38 + 19 = 37 + 20
      await playAudio(`Je transforme ${example.num2} en une dizaine ronde.`);
      await wait(2500);
      
      if (stopSignalRef.current) return;
      
      setCalculationStep('result');
      await playAudio(`J'obtiens ${example.result} ! La compensation rend tout plus facile !`);
    }
    await wait(3000);
  };

  // Animation pour étapes successives
  const animateEtapesSuccessives = async (example: any) => {
    setCalculationStep('setup');
    await playAudio(`Étapes successives : ${example.calculation}. Je vais avancer morceau par morceau !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    setCalculationStep('show-first');
    await playAudio(`Je commence avec ${example.num1}.`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Décomposer le second nombre
    const dizaines = Math.floor(example.num2 / 10) * 10;
    const unites = example.num2 % 10;
    
    setCalculationStep('tens');
    const etape1 = example.num1 + dizaines;
    await playAudio(`Première étape : j'ajoute ${dizaines}. ${example.num1} plus ${dizaines} égale ${etape1}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    setCalculationStep('units');
    await playAudio(`Deuxième étape : j'ajoute ${unites}. ${etape1} plus ${unites} égale ${example.result}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    setCalculationStep('result');
    await playAudio(`Résultat final : ${example.result} ! Étape par étape, c'est sûr !`);
    await wait(3000);
  };

  // Animation pour doubles
  const animateDoubles = async (example: any) => {
    setCalculationStep('setup');
    await playAudio(`Doubles et quasi-doubles : ${example.calculation}. Je vais utiliser les doubles !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    setCalculationStep('show-problem');
    await playAudio(`Je remarque que ${example.num2} égale ${example.num1} plus 1.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    setCalculationStep('show-first');
    const double = example.num1 * 2;
    await playAudio(`Donc ${example.num1} plus ${example.num2} égale ${example.num1} plus ${example.num1} plus 1.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    setCalculationStep('units');
    await playAudio(`Le double de ${example.num1} : ${example.num1} plus ${example.num1} égale ${double}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    setCalculationStep('result');
    await playAudio(`Plus 1 : ${double} plus 1 égale ${example.result} ! L'astuce des doubles !`);
    await wait(3000);
  };

  // Fonction pour féliciter avec audio pour les bonnes réponses
  const celebrateCorrectAnswer = async () => {
    if (stopSignalRef.current) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    try {
      // Compliment initial avec expression de pirate
      const minecraftExpression = minecraftExpressions[Math.floor(Math.random() * minecraftExpressions.length)];
      const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      await playAudio(`${minecraftExpression} ! ${randomCompliment} !`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      // Phrases d'encouragement supplémentaires variées
      const encouragements = [
        "Tu maîtrises bien les additions jusqu'à 100 !",
        "Tu es doué en calcul, moussaillon !",
        "Les mathématiques n'ont plus de secret pour toi !",
        "Tu deviens un vrai expert des nombres !",
        "Quel talent pour les additions !",
        "Tu as l'œil pour les bonnes réponses !",
        "Tu progresses à grands pas dans les calculs !",
        "Les additions posées, c'est ton fort !",
        "Tu navigues dans les nombres comme un vrai capitaine !",
        "Avec toi, les retenues n'ont qu'à bien se tenir !"
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      await playAudio(randomEncouragement);
      if (stopSignalRef.current) return;
      
      await wait(500);
      
    } catch (error) {
      console.error('Erreur dans celebrateCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
    }
  };

  // Fonction pour expliquer une mauvaise réponse avec animation
  const explainWrongAnswer = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    try {
      const minecraftExpression = minecraftExpressions[currentExercise % minecraftExpressions.length];
      await playAudio(minecraftExpression + " !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      const exercise = exercises[currentExercise];
      await playAudio(`Pas de problème ! Regarde bien...`);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Lancer l'animation de correction pour additions avec la réponse utilisateur si incorrecte
      if (isCorrect === false && userAnswer) {
        await createAnimatedCorrection(exercise, userAnswer);
      } else {
        await createAnimatedCorrection(exercise);
      }
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
    }
  };

  // Fonction pour l'introduction vocale de Sam le Pirate
  const startPirateIntro = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    const isReplay = pirateIntroStarted;
    setPirateIntroStarted(true);
    
    try {
      if (isReplay) {
        await playAudio("Eh bien, par les creepers ! Tu veux que je répète mes instructions ?");
        if (stopSignalRef.current) return;
        
        await wait(1000);
        if (stopSignalRef.current) return;
        
        await playAudio("Très bien mineur ! Rappel des consignes !");
        if (stopSignalRef.current) return;
      } else {
        await playAudio("Bonjour, faisons quelques exercices d'additions jusqu'à 100, par les blocs de diamant !");
        if (stopSignalRef.current) return;
      }
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Mettre en surbrillance le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      await playAudio("Pour lire l'énoncé appuie sur écouter l'énoncé");
      if (stopSignalRef.current) return;
      await wait(1500);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      // Mettre en surbrillance la zone de réponse
      setHighlightedElement('answer-zone');
      await playAudio("Écris le résultat de l'addition dans la case, puis clique sur valider");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement(null);
      if (stopSignalRef.current) return;
      
      // Mettre en surbrillance Sam lui-même pour les explications
      setHighlightedElement('sam-pirate');
      await playAudio("Si tu te trompes, je t'expliquerai la bonne réponse !");
      if (stopSignalRef.current) return;
      await wait(1500);
      setHighlightedElement(null);
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      if (isReplay) {
        await playAudio("Et voilà ! C'est reparti pour l'aventure !");
      } else {
        await playAudio("En avant toutes pour les additions jusqu'à 100 !");
      }
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour lire l'énoncé de l'exercice
  const startExerciseExplanation = async () => {
    console.log('startExerciseExplanation appelée');
    
    if (isPlayingEnonce) {
      console.log('isPlayingEnonce est true, sortie');
      return;
    }
    
    if (!exercises[currentExercise]) {
      console.log('Pas d\'exercice courant, sortie');
      return;
    }
    
    console.log('Début lecture énoncé:', exercises[currentExercise].question);
    
    // Réinitialiser le signal d'arrêt pour permettre la lecture
    stopSignalRef.current = false;
    setIsPlayingEnonce(true);
    
    try {
      // Vérifier si speechSynthesis est disponible
      if (typeof speechSynthesis === 'undefined') {
        throw new Error('speechSynthesis non disponible');
      }
      
      // Arrêter toute synthèse en cours
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await playAudio(exercises[currentExercise].question);
      console.log('Lecture terminée avec succès');
      
    } catch (error) {
      console.error('Erreur dans startExerciseExplanation:', error);
      alert('Erreur audio: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsPlayingEnonce(false);
      console.log('isPlayingEnonce mis à false');
    }
  };

  // Fonctions pour les exercices
  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correct = userNum === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
              setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
    }
  };

  // Gestion des exercices avec validation et correction animée
  const handleAnswerSubmit = async () => {
    stopAllVocalsAndAnimations();
    
    if (!userAnswer.trim()) {
      alert('Veuillez entrer une réponse');
      return;
    }

    const correct = isValidAddition(userAnswer, exercises[currentExercise]);
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    if (correct) {
      // Féliciter l'utilisateur avec Sam le Pirate
      await celebrateCorrectAnswer();
      
      // Attendre plus longtemps pour laisser Sam finir de parler
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setShowAnimatedCorrection(false);
          setCorrectionStep(null);
          setCorrectionNumbers(null);
          setAnimatedObjects([]);
          setCountingIndex(-1);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 3000); // Augmenté de 1.5s à 3s pour laisser Sam finir de parler
    } else {
      // Expliquer la mauvaise réponse avec correction animée
      await explainWrongAnswer();
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    setHighlightNextButton(false);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowAnimatedCorrection(false);
      setCorrectionStep(null);
      setCorrectionNumbers(null);
      setAnimatedObjects([]);
      setCountingIndex(-1);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetExercises = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setPirateIntroStarted(false);
    setHighlightNextButton(false);
    setShowAnimatedCorrection(false);
    setCorrectionStep(null);
    setCorrectionNumbers(null);
    setAnimatedObjects([]);
    setCountingIndex(-1);
  };

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Champion des additions jusqu'à 100 !", message: "Tu maîtrises parfaitement les grandes additions !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les additions jusqu'à 100 !", emoji: "📚" };
  };

  // Gestion des événements pour arrêter les vocaux
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    return () => {
      stopAllVocalsAndAnimations();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      {/* Animation CSS personnalisée pour les icônes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes subtle-glow {
            0%, 100% {
              opacity: 0.8;
              transform: scale(1);
              filter: brightness(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
              filter: brightness(1.1);
            }
          }
        `
      }} />
      
      {/* Bouton flottant de Sam - visible quand Sam parle ou pendant les animations du cours */}
      {(isPlayingVocal || isAnimationRunning) && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title={isPlayingVocal ? "Arrêter le personnage" : "Arrêter l'animation"}
          >
            {/* Image du personnage */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src="/image/Minecraftstyle.png"
                alt="Personnage Minecraft"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Texte et icône */}
            <>
              <span className="text-sm font-bold hidden sm:block">
                {isPlayingVocal ? 'Stop' : 'Stop Animation'}
              </span>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
            </>
          </button>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/ce1-quatre-operations/addition-ce1" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'addition CE1</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🧮 Additions jusqu'à 100 - CE1
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Maîtrise les additions avec des nombres plus grands ! Découvre 4 techniques incroyables.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showExercises
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-2 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-indigo-300 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 ${
                isPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-10 sm:w-20 h-10 sm:h-20' // Normal - plus petit sur mobile
              } flex items-center justify-center hover:scale-105 cursor-pointer`}>
                {!imageError && (
                  <img 
                    src="/image/Minecraftstyle.png"
                    alt="Personnage Minecraft"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-lg sm:text-2xl">🏴‍☠️</div>
                )}
                
                {/* Megaphone animé quand Sam parle */}
                {isPlayingVocal && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 rounded-full p-1 sm:p-2 shadow-lg animate-bounce">
                    <svg className="w-2 h-2 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER avec Sam */}
              <button
                onClick={explainChapterWithSam}
                disabled={isPlayingVocal}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-lg transition-all ${
                  isPlayingVocal
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
                } ${!hasStarted && !isPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingVocal ? 'Sam explique...' : 'DÉMARRER'}
              </button>
            </div>



            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                  <Calculator className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">Les additions jusqu'à 100</h2>
                {/* Icône d'animation pour l'introduction */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-blue-300" 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  💯
                </div>
              </div>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                Félicitations ! Tu vas apprendre les techniques pour additionner tous les nombres jusqu'à 100. 
                C'est un cours très important qui va te rendre super fort en mathématiques !
              </p>
            </div>



            {/* Exemples de techniques */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">
                  🎯 Choisis ta technique préférée !
                </h2>
                {/* Icône d'animation pour choisir la technique */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300" 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🎯
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionTechniques.map((technique, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentTechnique === technique.id ? 'ring-4 ring-blue-400 bg-blue-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => openExampleSelector(index)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{technique.icon}</div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{technique.title}</h3>
                      <div className="text-sm text-gray-900 mb-4 leading-relaxed">{technique.description}</div>
                      <div className="text-lg font-mono bg-white px-3 py-1 rounded mb-3 text-gray-900 shadow-sm">
                        {technique.examples[0].calculation}
                      </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors shadow-md ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cadre séparé pour sélection d'exemples */}
            {selectedTechnique && (
              <div 
                id="animation-section"
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-400"
              >
                {(() => {
                  const technique = additionTechniques.find(t => t.id === selectedTechnique);
                  if (!technique) return null;
                  
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                          <span className="text-3xl">{technique.icon}</span>
                          {technique.title}
                        </h2>
                        <button
                          onClick={() => setSelectedTechnique(null)}
                          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-gray-700 mb-4">{technique.description}</p>
                        
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-800 mb-3">Choisir un exemple :</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {technique.examples.map((example, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedExampleIndex(index)}
                                className={`p-4 rounded-lg font-medium text-lg transition-all duration-200 border-2 ${
                                  selectedExampleIndex === index
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105'
                                    : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-blue-100 hover:border-blue-400'
                                }`}
                              >
                                {example.calculation} = {example.result}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            const techniqueIndex = additionTechniques.findIndex(t => t.id === selectedTechnique);
                            explainTechnique(techniqueIndex, selectedExampleIndex);
                            setSelectedTechnique(null); // Fermer le cadre après lancement
                          }}
                          disabled={isAnimationRunning}
                          className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                            isAnimationRunning 
                              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105'
                          }`}
                        >
                          {isAnimationRunning ? '⏳ Animation en cours...' : '🎬 Lancer l\'animation !'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Zone d'animation */}
            {currentTechnique && currentExample !== null && (
              <div 
                id="animation-section"
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎬 Animation de calcul
                </h2>
                
                {(() => {
                  const technique = additionTechniques.find(t => t.id === currentTechnique);
                  const example = technique?.examples[currentExample];
                  if (!technique || !example) return null;

                  return (
                    <div className="space-y-6">
                      {/* Titre de la technique */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'technique-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                      }`}>
                        <h3 className="text-xl font-bold text-blue-800">{technique.title}</h3>
                        <p className="text-gray-800 mt-2">{technique.description}</p>
                      </div>

                      {/* Animation du calcul */}
                      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-4xl font-mono font-bold mb-4 text-indigo-900">
                            {example.calculation}
                          </div>
                          
                          {/* Animation des étapes selon la technique */}
                          {currentTechnique === 'sans-retenue' && calculationStep && (
                            <div className="space-y-6">
                              {/* Addition posée en colonnes */}
                              <div className="bg-white rounded-lg p-6 shadow-md max-w-md mx-auto">
                                <div className="font-mono text-center">
                                  {/* En-têtes de colonnes */}
                                  <div className="flex justify-center mb-2">
                                    <div className="w-4"></div>
                                    <div className="w-12 text-sm text-gray-600 font-bold">D</div>
                                    <div className="w-12 text-sm text-gray-600 font-bold">U</div>
                                  </div>
                                  
                                  {/* Premier nombre */}
                                  <div className={`flex justify-center py-2 rounded transition-all ${
                                    calculationStep === 'setup' ? 'bg-blue-100' : ''
                                  }`}>
                                    <div className="w-4"></div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num1 / 10)}
                                    </div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('units') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {example.num1 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne avec le signe + et le deuxième nombre */}
                                  <div className={`flex justify-center py-2 rounded transition-all ${
                                    calculationStep === 'setup' ? 'bg-blue-100' : ''
                                  }`}>
                                    <div className="w-4 text-2xl font-bold text-gray-900 text-right pr-1">+</div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num2 / 10)}
                                    </div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('units') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {example.num2 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne de séparation */}
                                  <div className="border-b-2 border-gray-400 my-2 w-28 mx-auto"></div>
                                  
                                  {/* Résultat progressif */}
                                  {(calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result') && (
                                    <div className={`flex justify-center py-2 ${
                                      calculationStep === 'result' ? 'animate-bounce' : ''
                                    }`}>
                                      <div className="w-4"></div>
                                      
                                      {/* Chiffre des dizaines */}
                                      <div className={`w-12 text-2xl font-bold text-center ${
                                        calculationStep === 'tens' || calculationStep === 'result' 
                                          ? 'text-green-700 animate-pulse' 
                                          : 'text-transparent'
                                      }`}>
                                        {calculationStep === 'tens' || calculationStep === 'result' 
                                          ? Math.floor(example.result / 10) 
                                          : '?'}
                                      </div>
                                      
                                      {/* Chiffre des unités */}
                                      <div className={`w-12 text-2xl font-bold text-center ${
                                        calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result'
                                          ? 'text-green-700 animate-pulse' 
                                          : 'text-transparent'
                                      }`}>
                                        {calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result'
                                          ? example.result % 10 
                                          : '?'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Explication textuelle */}
                              {calculationStep === 'units' && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                                  <p className="text-yellow-800 font-semibold">
                                    🧮 J'additionne les unités : {example.num1 % 10} + {example.num2 % 10} = {(example.num1 % 10) + (example.num2 % 10)}
                                  </p>
                                </div>
                              )}
                              
                              {calculationStep === 'tens' && (
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                                  <p className="text-blue-800 font-semibold">
                                    🧮 J'additionne les dizaines : {Math.floor(example.num1 / 10)} + {Math.floor(example.num2 / 10)} = {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour avec retenue */}
                          {currentTechnique === 'avec-retenue' && calculationStep && (
                            <div className="space-y-6 bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
                              
                              {/* Étape : Introduction */}
                              {calculationStep === 'setup' && (
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-orange-800 animate-pulse">
                                    {example.calculation}
                                  </div>
                                  <div className="text-lg text-orange-600 mt-2">
                                    ⚡ Addition avec retenue - Attention !
                                  </div>
                                </div>
                              )}

                              {/* Affichage permanent de la colonne (ne s'efface jamais) */}
                              {(calculationStep === 'setup' || calculationStep === 'units' || calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-gray-700">📊 Addition en colonnes</div>
                                  </div>
                                  
                                  {/* Retenue (visible seulement si nécessaire) */}
                                  <div className="flex justify-center mb-2">
                                    <div className="w-8"></div>
                                    <div className="w-16 text-center">
                                      {(calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                        <div className="text-lg font-bold text-red-700 animate-bounce border-2 border-red-400 bg-red-100 rounded-full px-2 py-1">
                                          1
                                        </div>
                                      )}
                                    </div>
                                    <div className="w-16"></div>
                                  </div>
                                  
                                  {/* En-têtes de colonnes */}
                                  <div className="flex justify-center mb-3">
                                    <div className="w-8"></div>
                                    <div className="w-16 text-center text-lg font-bold text-gray-600 border-b-2 border-gray-400 pb-1">D</div>
                                    <div className="w-16 text-center text-lg font-bold text-gray-600 border-b-2 border-gray-400 pb-1">U</div>
                                  </div>
                                  
                                  {/* Premier nombre */}
                                  <div className="flex justify-center py-3">
                                    <div className="w-8"></div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded-lg px-2 py-1 ring-2 ring-yellow-400' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num1 / 10)}
                                    </div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('units') ? 'bg-blue-200 text-blue-900 rounded-lg px-2 py-1 ring-2 ring-blue-400' : 'text-gray-900'
                                    }`}>
                                      {example.num1 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne avec le signe + et le deuxième nombre */}
                                  <div className="flex justify-center py-3">
                                    <div className="w-8 text-3xl font-bold text-orange-700 text-center">+</div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded-lg px-2 py-1 ring-2 ring-yellow-400' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num2 / 10)}
                                    </div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('units') ? 'bg-blue-200 text-blue-900 rounded-lg px-2 py-1 ring-2 ring-blue-400' : 'text-gray-900'
                                    }`}>
                                      {example.num2 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne de séparation */}
                                  <div className="border-b-4 border-gray-600 my-4 w-40 mx-auto"></div>
                                  
                                  {/* Résultat progressif */}
                                  {(calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                    <div className="flex justify-center py-3">
                                      <div className="w-8"></div>
                                      
                                      {/* Chiffre des dizaines */}
                                      <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                        calculationStep === 'tens' || calculationStep === 'result' 
                                          ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                                          : 'text-gray-300'
                                      }`}>
                                        {calculationStep === 'tens' || calculationStep === 'result' 
                                          ? Math.floor(example.result / 10) 
                                          : '?'}
                                      </div>
                                      
                                      {/* Chiffre des unités */}
                                      <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                        (calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result')
                                          ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                                          : 'text-gray-300'
                                      }`}>
                                        {(calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result')
                                          ? ((example.num1 % 10) + (example.num2 % 10)) % 10
                                          : '?'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Animation de calcul des unités (reste visible) */}
                              {(calculationStep === 'units' || calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
                                  <div className="text-2xl font-bold text-blue-800 mb-3">
                                    🔹 Calcul des unités
                                  </div>
                                  <div className="flex justify-center items-center space-x-3 mb-4">
                                    {/* Unités du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num1 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-blue-600">+</div>
                                    
                                    {/* Unités du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num2 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {(calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                      <>
                                        <div className="text-2xl font-bold text-blue-600">=</div>
                                        
                                        {/* Résultat des unités */}
                                        <div className="flex space-x-1">
                                          {Array.from({length: (example.num1 % 10) + (example.num2 % 10)}, (_, i) => (
                                            <div key={i} className="w-6 h-6 bg-purple-600 border-2 border-purple-800 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                              1
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-xl font-bold text-blue-700">
                                    {example.num1 % 10} + {example.num2 % 10} {(calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') ? `= ${(example.num1 % 10) + (example.num2 % 10)}` : ''}
                                  </div>
                                </div>
                              )}

                              {/* Animation de la décomposition (reste visible) */}
                              {(calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-orange-100 p-4 rounded-lg border-2 border-orange-400">
                                  <div className="text-2xl font-bold text-orange-800 mb-3">
                                    ⚡ Décomposition : plus de 10 !
                                  </div>
                                  <div className="text-xl font-bold text-orange-700 mb-4">
                                    {(example.num1 % 10) + (example.num2 % 10)} = {Math.floor(((example.num1 % 10) + (example.num2 % 10)) / 10)} dizaine + {((example.num1 % 10) + (example.num2 % 10)) % 10} unités
                                  </div>
                                  <div className="flex justify-center items-center space-x-4">
                                    {/* Représentation de la décomposition */}
                                    <div className="text-center">
                                      <div className="w-12 h-16 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold text-lg">
                                        10
                                      </div>
                                      <div className="text-sm font-bold text-red-700 mt-1">1 dizaine</div>
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-orange-600">+</div>
                                    
                                    <div className="text-center">
                                      <div className="flex space-x-1">
                                        {Array.from({length: ((example.num1 % 10) + (example.num2 % 10)) % 10}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-blue-700 mt-1">{((example.num1 % 10) + (example.num2 % 10)) % 10} unités</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Animation visuelle de la retenue qui glisse (reste visible) */}
                              {(calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-red-100 p-4 rounded-lg border-2 border-red-400">
                                  <div className="text-2xl font-bold text-red-800 mb-3">
                                    🎯 La retenue glisse vers le haut !
                                  </div>
                                  <div className="relative flex justify-center items-center space-x-8">
                                    {/* La dizaine qui "glisse" vers le haut */}
                                    <div className="text-center">
                                      <div className="w-12 h-16 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold text-lg animate-bounce transform -translate-y-4">
                                        10
                                      </div>
                                      <div className="text-sm font-bold text-red-700 mt-1">↑ Vers les dizaines</div>
                                    </div>
                                    
                                    {/* Les unités qui restent en bas */}
                                    <div className="text-center">
                                      <div className="flex space-x-1">
                                        {Array.from({length: ((example.num1 % 10) + (example.num2 % 10)) % 10}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-blue-700 mt-1">↓ Restent en unités</div>
                                    </div>
                                  </div>
                                  <div className="text-lg font-bold text-red-700 mt-4">
                                    J'écris {((example.num1 % 10) + (example.num2 % 10)) % 10} en unités et je retiens 1 en dizaines !
                                  </div>
                                </div>
                              )}

                              {/* Animation des dizaines (reste visible) */}
                              {(calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-purple-100 p-4 rounded-lg border-2 border-purple-400">
                                  <div className="text-2xl font-bold text-purple-800 mb-3">
                                    🔢 Calcul des dizaines avec retenue
                                  </div>
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Dizaines du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-yellow-500 border-2 border-yellow-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-purple-600">+</div>
                                    
                                    {/* Dizaines du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-orange-500 border-2 border-orange-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-purple-600">+</div>
                                    
                                    {/* Retenue */}
                                    <div className="w-10 h-14 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold animate-bounce">
                                      10
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-purple-600">=</div>
                                    
                                    {/* Résultat des dizaines */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10) + 1}, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-purple-600 border-2 border-purple-800 rounded flex items-center justify-center text-white font-bold animate-bounce">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-xl font-bold text-purple-700">
                                    {Math.floor(example.num1 / 10)} + {Math.floor(example.num2 / 10)} + 1 (retenue) = {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10) + 1}
                                  </div>
                                </div>
                              )}

                              {/* Résultat final */}
                              {calculationStep === 'result' && (
                                <div className="text-center bg-green-100 p-4 rounded-lg border-2 border-green-400">
                                  <div className="text-5xl font-bold text-green-700 animate-bounce mb-4">
                                    = {example.result}
                                  </div>
                                  <div className="text-2xl font-bold text-green-600">
                                    🏆 Bravo ! Tu maîtrises la retenue !
                                  </div>
                                  <div className="text-lg text-green-700 mt-2">
                                    {Math.floor(example.result / 10)} dizaines + {example.result % 10} unités = {example.result}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour calcul mental */}
                          {currentTechnique === 'calcul-mental' && calculationStep && (
                            <div className="space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                              {/* Étape : Setup */}
                              {calculationStep === 'setup' && (
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-purple-800 animate-pulse">
                                    {example.calculation}
                                  </div>
                                  <div className="text-lg text-purple-600 mt-2">
                                    🧠 Technique du calcul mental magique !
                                  </div>
                                </div>
                              )}

                              {/* Étape : Montrer le premier nombre */}
                              {(calculationStep === 'show-first' || calculationStep === 'decompose-first') && (
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-red-700 mb-4 animate-pulse">
                                    Premier nombre : {example.num1}
                                  </div>
                                  {calculationStep === 'decompose-first' && (
                                    <div className="space-y-4">
                                      {/* Représentation visuelle du premier nombre */}
                                      <div className="flex justify-center items-center space-x-4">
                                        {/* Dizaines en rouge */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-red-600 mb-2">Dizaines</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                              <div key={i} className="w-8 h-12 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                                                10
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-red-700 mt-2">
                                            {Math.floor(example.num1 / 10)} × 10 = {Math.floor(example.num1 / 10) * 10}
                                          </div>
                                        </div>

                                        <div className="text-3xl font-bold text-gray-600">+</div>

                                        {/* Unités en bleu */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-blue-600 mb-2">Unités</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: example.num1 % 10}, (_, i) => (
                                              <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                                                1
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-blue-700 mt-2">
                                            {example.num1 % 10} unité{example.num1 % 10 > 1 ? 's' : ''}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Étape : Montrer le deuxième nombre */}
                              {(calculationStep === 'show-second' || calculationStep === 'decompose-second') && (
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-green-700 mb-4 animate-pulse">
                                    Deuxième nombre : {example.num2}
                                  </div>
                                  {calculationStep === 'decompose-second' && (
                                    <div className="space-y-4">
                                      {/* Représentation visuelle du deuxième nombre */}
                                      <div className="flex justify-center items-center space-x-4">
                                        {/* Dizaines en orange */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-orange-600 mb-2">Dizaines</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => (
                                              <div key={i} className="w-8 h-12 bg-orange-500 border-2 border-orange-700 rounded flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                                                10
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-orange-700 mt-2">
                                            {Math.floor(example.num2 / 10)} × 10 = {Math.floor(example.num2 / 10) * 10}
                                          </div>
                                        </div>

                                        <div className="text-3xl font-bold text-gray-600">+</div>

                                        {/* Unités en cyan */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-cyan-600 mb-2">Unités</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: example.num2 % 10}, (_, i) => (
                                              <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                                                1
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-cyan-700 mt-2">
                                            {example.num2 % 10} unité{example.num2 % 10 > 1 ? 's' : ''}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Étape : Explication de la stratégie */}
                              {calculationStep === 'explain-strategy' && (
                                <div className="text-center bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                                  <div className="text-2xl font-bold text-yellow-800 mb-2">
                                    🎯 Stratégie secrète !
                                  </div>
                                  <div className="text-lg text-yellow-700">
                                    Je vais additionner les dizaines ensemble, puis les unités ensemble !
                                  </div>
                                </div>
                              )}

                              {/* Étape : Calcul des dizaines */}
                              {calculationStep === 'tens' && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-800 mb-4">
                                    🔢 Addition des dizaines
                                  </div>
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Dizaines du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                        <div key={i} className="w-8 h-12 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-3xl font-bold text-purple-600">+</div>
                                    
                                    {/* Dizaines du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => (
                                        <div key={i} className="w-8 h-12 bg-orange-500 border-2 border-orange-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-3xl font-bold text-purple-600">=</div>
                                    
                                    {/* Résultat des dizaines */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)}, (_, i) => (
                                        <div key={i} className="w-8 h-12 bg-purple-600 border-2 border-purple-800 rounded flex items-center justify-center text-white font-bold animate-bounce">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-xl font-bold text-purple-700">
                                    {Math.floor(example.num1 / 10)} + {Math.floor(example.num2 / 10)} = {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)} dizaines
                                  </div>
                                </div>
                              )}

                              {/* Étape : Calcul des unités */}
                              {calculationStep === 'units' && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-800 mb-4">
                                    🔹 Addition des unités
                                  </div>
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Unités du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num1 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-blue-600">+</div>
                                    
                                    {/* Unités du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num2 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-blue-600">=</div>
                                    
                                    {/* Résultat des unités */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: (example.num1 % 10) + (example.num2 % 10)}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-indigo-600 border-2 border-indigo-800 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-xl font-bold text-blue-700">
                                    {example.num1 % 10} + {example.num2 % 10} = {(example.num1 % 10) + (example.num2 % 10)} unités
                                  </div>
                                </div>
                              )}

                              {/* Étape : Regroupement */}
                              {calculationStep === 'regroup' && (
                                <div className="text-center bg-green-100 p-4 rounded-lg border-2 border-green-400">
                                  <div className="text-2xl font-bold text-green-800 mb-4">
                                    🔄 Regroupement final
                                  </div>
                                  <div className="text-xl font-bold text-green-700">
                                    {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)} dizaines + {(example.num1 % 10) + (example.num2 % 10)} unités
                                  </div>
                                  <div className="text-lg text-green-600 mt-2">
                                    = {(Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)) * 10} + {(example.num1 % 10) + (example.num2 % 10)}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Résultat final */}
                              {calculationStep === 'result' && (
                                <div className="text-center">
                                  <div className="text-5xl font-bold text-green-700 animate-bounce mb-4">
                                    = {example.result}
                                  </div>
                                  <div className="text-2xl font-bold text-green-600">
                                    🏆 Bravo ! Tu maîtrises le calcul mental !
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour complément à 10 */}
                          {currentTechnique === 'complement-10' && calculationStep && (
                            <div className="space-y-6 bg-gradient-to-br from-yellow-50 to-green-50 p-6 rounded-xl border-2 border-yellow-200">
                              
                              {/* Étape : Introduction */}
                              {calculationStep === 'setup' && (
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-yellow-800 animate-pulse">
                                    {example.calculation}
                                  </div>
                                  <div className="text-lg text-yellow-600 mt-2">
                                    🎯 Technique du complément à 10 - Astuce géniale !
                                  </div>
                                </div>
                              )}

                              {/* Affichage permanent du problème (reste visible) */}
                              {(calculationStep === 'show-problem' || calculationStep === 'find-complement' || calculationStep === 'add-complement' || calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-gray-800">🎯 Problème à résoudre</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-800 mb-4">
                                      {example.num1} + {example.num2} = ?
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Étape : Trouver le complément (reste visible) */}
                              {(calculationStep === 'find-complement' || calculationStep === 'add-complement' || calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
                                  <div className="text-2xl font-bold text-blue-800 mb-3">
                                    🔍 Étape 1 : Trouver le complément
                                  </div>
                                  
                                  {/* Représentation visuelle du nombre à arrondir */}
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-blue-700 mb-2">{example.num1}</div>
                                      <div className="flex items-center space-x-2">
                                        {/* Dizaines */}
                                        {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                          <div key={i} className="w-8 h-12 bg-blue-500 border-2 border-blue-700 rounded flex items-center justify-center text-white font-bold text-sm">
                                            10
                                          </div>
                                        ))}
                                        {/* Unités */}
                                        {Array.from({length: example.num1 % 10}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="text-2xl font-bold text-blue-600">+</div>

                                    {/* Complément nécessaire */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-green-700 mb-2">{10 - (example.num1 % 10)}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: 10 - (example.num1 % 10)}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-green-700 mt-1">Complément</div>
                                    </div>

                                    <div className="text-2xl font-bold text-blue-600">=</div>

                                    {/* Résultat arrondi */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-purple-700 mb-2">{Math.ceil(example.num1 / 10) * 10}</div>
                                      <div className="flex items-center space-x-2">
                                        {Array.from({length: Math.ceil(example.num1 / 10)}, (_, i) => (
                                          <div key={i} className="w-8 h-12 bg-purple-600 border-2 border-purple-800 rounded flex items-center justify-center text-white font-bold text-sm animate-bounce">
                                            10
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-purple-700 mt-1">Dizaine ronde !</div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-blue-700">
                                    {example.num1} + {10 - (example.num1 % 10)} = {Math.ceil(example.num1 / 10) * 10}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Décomposer le deuxième nombre (reste visible) */}
                              {(calculationStep === 'add-complement' || calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-orange-100 p-4 rounded-lg border-2 border-orange-400">
                                  <div className="text-2xl font-bold text-orange-800 mb-3">
                                    ✂️ Étape 2 : Décomposer {example.num2}
                                  </div>
                                  
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Nombre original */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-orange-700 mb-2">{example.num2}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: example.num2}, (_, i) => (
                                          <div key={i} className={`w-6 h-6 border-2 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                            i < (10 - (example.num1 % 10)) ? 'bg-green-500 border-green-700 animate-pulse' : 'bg-orange-500 border-orange-700'
                                          }`}>
                                            1
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="text-2xl font-bold text-orange-600">=</div>

                                    {/* Complément (qui sera utilisé) */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-green-700 mb-2">{10 - (example.num1 % 10)}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: 10 - (example.num1 % 10)}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-green-700 mt-1">Pour le complément</div>
                                    </div>

                                    <div className="text-2xl font-bold text-orange-600">+</div>

                                    {/* Reste */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-red-700 mb-2">{example.num2 - (10 - (example.num1 % 10))}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: example.num2 - (10 - (example.num1 % 10))}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-red-500 border-2 border-red-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-red-700 mt-1">Ce qui reste</div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-orange-700">
                                    {example.num2} = {10 - (example.num1 % 10)} + {example.num2 - (10 - (example.num1 % 10))}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Transformation magique (reste visible) */}
                              {(calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-purple-100 p-4 rounded-lg border-2 border-purple-400">
                                  <div className="text-2xl font-bold text-purple-800 mb-3">
                                    ✨ Étape 3 : Transformation magique !
                                  </div>
                                  
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Problème original */}
                                    <div className="text-center p-3 bg-gray-200 rounded-lg">
                                      <div className="text-sm font-bold text-gray-700 mb-1">Avant</div>
                                      <div className="text-lg font-bold text-gray-800">
                                        {example.num1} + {example.num2}
                                      </div>
                                      <div className="text-sm text-gray-600">Difficile !</div>
                                    </div>

                                    <div className="text-3xl text-purple-600">→</div>

                                    {/* Problème transformé */}
                                    <div className="text-center p-3 bg-green-200 rounded-lg">
                                      <div className="text-sm font-bold text-green-700 mb-1">Après</div>
                                      <div className="text-lg font-bold text-green-800">
                                        {Math.ceil(example.num1 / 10) * 10} + {example.num2 - (10 - (example.num1 % 10))}
                                      </div>
                                      <div className="text-sm text-green-600">Facile !</div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-purple-700">
                                    Maintenant c'est plus simple : {Math.ceil(example.num1 / 10) * 10} + {example.num2 - (10 - (example.num1 % 10))}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Calcul final (reste visible) */}
                              {(calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-green-100 p-4 rounded-lg border-2 border-green-400">
                                  <div className="text-2xl font-bold text-green-800 mb-3">
                                    🧮 Étape 4 : Calcul final
                                  </div>
                                  
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Dizaine ronde */}
                                    <div className="text-center">
                                      <div className="flex items-center space-x-2">
                                        {Array.from({length: Math.ceil(example.num1 / 10)}, (_, i) => (
                                          <div key={i} className="w-8 h-12 bg-green-500 border-2 border-green-700 rounded flex items-center justify-center text-white font-bold text-sm animate-pulse">
                                            10
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-xl font-bold text-green-700 mt-2">
                                        {Math.ceil(example.num1 / 10) * 10}
                                      </div>
                                    </div>

                                    <div className="text-3xl font-bold text-green-600">+</div>

                                    {/* Reste à ajouter */}
                                    <div className="text-center">
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: example.num2 - (10 - (example.num1 % 10))}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-red-500 border-2 border-red-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-xl font-bold text-red-700 mt-2">
                                        {example.num2 - (10 - (example.num1 % 10))}
                                      </div>
                                    </div>

                                    <div className="text-3xl font-bold text-green-600">=</div>

                                    {/* Résultat */}
                                    <div className="text-center">
                                      <div className="text-3xl font-bold text-purple-700 animate-bounce">
                                        {example.result}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-green-700">
                                    {Math.ceil(example.num1 / 10) * 10} + {example.num2 - (10 - (example.num1 % 10))} = {example.result}
                                  </div>
                                </div>
                              )}

                              {/* Résultat final avec célébration */}
                              {calculationStep === 'result' && (
                                <div className="text-center bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                                  <div className="text-5xl font-bold text-yellow-700 animate-bounce mb-4">
                                    = {example.result}
                                  </div>
                                  <div className="text-2xl font-bold text-yellow-600">
                                    🏆 Bravo ! Le complément à 10, c'est magique !
                                  </div>
                                  <div className="text-lg text-yellow-700 mt-2">
                                    Tu as transformé un calcul difficile en calcul facile !
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour décomposition */}
                          {currentTechnique === 'decomposition' && calculationStep && (
                            <div id="decomposition-animation" className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                              


                              {/* Décomposition sur une seule ligne - Version épurée */}
                              {(calculationStep === 'decompose-first' || calculationStep === 'decompose-second' || calculationStep === 'tens' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-gray-800">🔢 Je décompose chaque nombre</div>
                        </div>
                                  
                                  {/* Premier nombre - ligne unique */}
                                  <div className={`transition-all duration-700 mb-3 ${
                                    calculationStep === 'decompose-first' ? 'transform scale-105' : ''
                                  }`}>
                                    <div className={`flex justify-center items-center space-x-3 text-2xl font-bold p-3 rounded-lg transition-all duration-500 ${
                                      calculationStep === 'decompose-first' ? 'animate-pulse' : ''
                                    }`} 
                                         style={{
                                           background: calculationStep === 'decompose-first' 
                                             ? 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)' 
                                             : '#f8fafc',
                                           border: calculationStep === 'decompose-first' 
                                             ? '3px solid #29b6f6' 
                                             : '2px solid #e2e8f0',
                                           boxShadow: calculationStep === 'decompose-first' 
                                             ? '0 10px 25px rgba(41, 182, 246, 0.3)' 
                                             : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                         }}>
                                      <div className={`transition-all duration-300 ${
                                        calculationStep === 'decompose-first' ? 'text-gray-900 scale-110' : 'text-gray-800'
                                      }`}>{example.num1}</div>
                                      <div className="text-gray-600">=</div>
                                      <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                        calculationStep === 'decompose-first' 
                                          ? 'text-blue-800 scale-125 bg-blue-200 shadow-md' 
                                          : 'text-blue-600'
                                      }`}>{Math.floor(example.num1 / 10) * 10}</div>
                                      <div className="text-gray-600">+</div>
                                      <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                        calculationStep === 'decompose-first' 
                                          ? 'text-green-800 scale-125 bg-green-200 shadow-md' 
                                          : 'text-green-600'
                                      }`}>{example.num1 % 10}</div>
                                    </div>
                                  </div>

                                  {/* Second nombre - ligne unique */}
                                  {(calculationStep === 'decompose-second' || calculationStep === 'tens' || calculationStep === 'units' || calculationStep === 'result') && (
                                    <div className={`transition-all duration-700 ${
                                      calculationStep === 'decompose-second' ? 'transform scale-105' : ''
                                    }`}>
                                      <div className={`flex justify-center items-center space-x-3 text-2xl font-bold p-3 rounded-lg transition-all duration-500 ${
                                        calculationStep === 'decompose-second' ? 'animate-pulse' : ''
                                      }`}
                                           style={{
                                             background: calculationStep === 'decompose-second' 
                                               ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)' 
                                               : '#f8fafc',
                                             border: calculationStep === 'decompose-second' 
                                               ? '3px solid #4caf50' 
                                               : '2px solid #e2e8f0',
                                             boxShadow: calculationStep === 'decompose-second' 
                                               ? '0 10px 25px rgba(76, 175, 80, 0.3)' 
                                               : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                           }}>
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'decompose-second' ? 'text-gray-900 scale-110' : 'text-gray-800'
                                        }`}>{example.num2}</div>
                                        <div className="text-gray-600">=</div>
                                        <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                          calculationStep === 'decompose-second' 
                                            ? 'text-blue-800 scale-125 bg-blue-200 shadow-md' 
                                            : 'text-blue-600'
                                        }`}>{Math.floor(example.num2 / 10) * 10}</div>
                                        <div className="text-gray-600">+</div>
                                        <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                          calculationStep === 'decompose-second' 
                                            ? 'text-green-800 scale-125 bg-green-200 shadow-md' 
                                            : 'text-green-600'
                                        }`}>{example.num2 % 10}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Addition des dizaines - Ligne épurée */}
                              {(calculationStep === 'tens' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div id="tens-addition" className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-blue-700">🔵 J'additionne les dizaines</div>
                                  </div>
                                  
                                  <div className={`transition-all duration-700 ${
                                    calculationStep === 'tens' ? 'transform scale-105' : ''
                                  }`}>
                                    <div className="flex justify-center items-center space-x-3 text-2xl font-bold p-3 rounded-lg"
                                         style={{
                                           background: calculationStep === 'tens' 
                                             ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' 
                                             : '#f1f5f9',
                                           border: calculationStep === 'tens' 
                                             ? '3px solid #1976d2' 
                                             : '2px solid #cbd5e1',
                                           boxShadow: calculationStep === 'tens' 
                                             ? '0 10px 25px rgba(25, 118, 210, 0.3)' 
                                             : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                         }}>
                                      <div className="text-blue-700">{Math.floor(example.num1 / 10) * 10}</div>
                                      <div className="text-gray-600">+</div>
                                      <div className="text-blue-700">{Math.floor(example.num2 / 10) * 10}</div>
                                      <div className="text-gray-600">=</div>
                                      <div className="text-blue-800">{(Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)) * 10}</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Addition des unités - Ligne épurée */}
                              {(calculationStep === 'units' || calculationStep === 'result') && (
                                <div id="units-addition" className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-green-700">🟢 J'additionne les unités</div>
                                  </div>
                                  
                                  <div className={`transition-all duration-700 ${
                                    calculationStep === 'units' ? 'transform scale-105' : ''
                                  }`}>
                                    <div className="flex justify-center items-center space-x-3 text-2xl font-bold p-3 rounded-lg"
                                         style={{
                                           background: calculationStep === 'units' 
                                             ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)' 
                                             : '#f1f5f9',
                                           border: calculationStep === 'units' 
                                             ? '3px solid #388e3c' 
                                             : '2px solid #cbd5e1',
                                           boxShadow: calculationStep === 'units' 
                                             ? '0 10px 25px rgba(56, 142, 60, 0.3)' 
                                             : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                         }}>
                                      <div className="text-green-700">{example.num1 % 10}</div>
                                      <div className="text-gray-600">+</div>
                                      <div className="text-green-700">{example.num2 % 10}</div>
                                      <div className="text-gray-600">=</div>
                                      <div className="text-green-800">{(example.num1 % 10) + (example.num2 % 10)}</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Résultat final - Ligne épurée */}
                              {calculationStep === 'result' && (
                                <div id="final-result" className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-purple-700">🎉 Résultat final</div>
                                  </div>
                                  
                                  <div className="transform scale-105">
                                    <div className="flex justify-center items-center space-x-3 text-3xl font-bold p-4 rounded-lg"
                                         style={{
                                           background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                                           border: '3px solid #8e24aa',
                                           boxShadow: '0 15px 35px rgba(142, 36, 170, 0.3)'
                                         }}>
                                      <div className="text-blue-700">{(Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)) * 10}</div>
                                      <div className="text-gray-600">+</div>
                                      <div className="text-green-700">{(example.num1 % 10) + (example.num2 % 10)}</div>
                                      <div className="text-gray-600">=</div>
                                      <div className="text-purple-800 animate-bounce">{example.result}</div>
                                    </div>
                                  </div>

                                  <div className="text-center mt-4">
                                    <div className="text-lg font-bold text-purple-600 animate-pulse">
                                      🏆 Parfait ! La décomposition, c'est logique !
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour bonds de 10 */}
                          {currentTechnique === 'bonds-10' && calculationStep && (
                            <div id="bonds-animation" className="space-y-6 bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-200">
                              


                              {/* Point de départ */}
                              {(calculationStep === 'show-first' || calculationStep === 'tens' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-orange-700">🎯 Point de départ</div>
                                  </div>
                                  
                                  <div className="text-center p-4 bg-orange-100 rounded-lg border-2 border-orange-400 mb-4">
                                    <div className="text-3xl font-bold text-orange-800">
                                      Je pars de {example.num1}
                                    </div>
                                  </div>
                                  
                                  <div className="text-center">
                                    <div className="text-lg text-orange-600">
                                      Je vais ajouter {example.num2} en sautant par bonds de 10 !
                                    </div>
                                    {Math.floor(example.num2 / 10) > 0 && (
                                      <div className="text-base text-orange-500 mt-2 font-semibold">
                                        ➜ Il me faudra {Math.floor(example.num2 / 10)} bonds de 10
                                        {example.num2 % 10 > 0 && ` + ${example.num2 % 10} unités`}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Explication du nombre de bonds */}
                              {(calculationStep === 'tens' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div id="bonds-explanation" className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-blue-700">🧮 Plan d'action</div>
                                  </div>
                                  
                                  <div className={`transition-all duration-700 ${
                                    calculationStep === 'tens' ? 'transform scale-105' : ''
                                  }`}>
                                    <div className="p-4 rounded-lg"
                                         style={{
                                           background: calculationStep === 'tens' 
                                             ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' 
                                             : '#f8fafc',
                                           border: calculationStep === 'tens' 
                                             ? '3px solid #1976d2' 
                                             : '2px solid #e2e8f0',
                                           boxShadow: calculationStep === 'tens' 
                                             ? '0 10px 25px rgba(25, 118, 210, 0.3)' 
                                             : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                         }}>
                                      
                                      {/* Analyse du nombre */}
                                      <div className="text-center mb-4">
                                        <div className="text-xl font-bold text-gray-800 mb-3">
                                          J'ajoute {example.num2}
                                        </div>
                                        <div className="flex justify-center items-center space-x-3 text-lg">
                                          <div className="text-gray-700">{example.num2} =</div>
                                          <div className="text-blue-600 font-bold">{Math.floor(example.num2 / 10) * 10}</div>
                                          <div className="text-gray-500">+</div>
                                          <div className="text-green-600 font-bold">{example.num2 % 10}</div>
                                        </div>
                                      </div>

                                      {/* Explication des bonds */}
                                      <div className="text-center p-3 bg-yellow-100 rounded-lg border-2 border-yellow-400">
                                        <div className="text-lg font-bold text-yellow-800 mb-2">
                                          {Math.floor(example.num2 / 10) * 10} = {Math.floor(example.num2 / 10)} dizaines
                                        </div>
                                        <div className="text-base text-yellow-700">
                                          Donc je fais <span className="font-bold text-yellow-900">{Math.floor(example.num2 / 10)} bonds de 10</span> ! 🦘
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Exécution des bonds de 10 */}
                              {(calculationStep === 'units' || calculationStep === 'result') && (
                                <div id="bonds-execution" className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-yellow-700">🦘 Exécution des bonds !</div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {(() => {
                                      const bonds = [];
                                      const dizaines = Math.floor(example.num2 / 10);
                                      let current = example.num1;
                                      
                                      for (let i = 0; i < dizaines; i++) {
                                        bonds.push(
                                          <div key={i} className={`transition-all duration-500 ${
                                            calculationStep === 'units' ? 'transform scale-105 animate-pulse' : ''
                                          }`}>
                                            <div className={`flex justify-center items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                                              calculationStep === 'units' ? 'shadow-xl' : ''
                                            }`}
                                                 style={{
                                                   background: calculationStep === 'units' 
                                                     ? 'linear-gradient(135deg, #fff8e1 0%, #ffcc02 100%)' 
                                                     : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                                                   border: calculationStep === 'units' 
                                                     ? '3px solid #f57c00' 
                                                     : '2px solid #ff9800',
                                                   boxShadow: calculationStep === 'units' 
                                                     ? '0 8px 25px rgba(255, 152, 0, 0.4)' 
                                                     : '0 6px 15px rgba(255, 152, 0, 0.2)'
                                                 }}>
                                              <div className={`text-lg font-bold transition-all duration-300 ${
                                                calculationStep === 'units' ? 'text-orange-900 scale-110' : 'text-orange-800'
                                              }`}>
                                                Bond {i + 1} :
                                              </div>
                                              <div className="flex items-center space-x-2 text-lg font-bold">
                                                <div className={`transition-all duration-300 ${
                                                  calculationStep === 'units' ? 'text-orange-800 scale-110' : 'text-orange-700'
                                                }`}>{current}</div>
                                                <div className="text-gray-600">+</div>
                                                <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                                  calculationStep === 'units' 
                                                    ? 'text-orange-900 scale-125 bg-orange-200 shadow-md' 
                                                    : 'text-orange-700'
                                                }`}>10</div>
                                                <div className="text-gray-600">=</div>
                                                <div className={`transition-all duration-300 ${
                                                  calculationStep === 'units' ? 'text-orange-900 scale-110 font-extrabold' : 'text-orange-800'
                                                }`}>{current + 10}</div>
                                              </div>
                                              <div className={`text-2xl transition-all duration-300 ${
                                                calculationStep === 'units' ? 'animate-bounce scale-125' : 'animate-bounce'
                                              }`}>🦘</div>
                      </div>
                    </div>
                  );
                                        current += 10;
                                      }
                                      
                                      return bonds;
                })()}
                                  </div>
                                </div>
                              )}

                              {/* Ajout des unités restantes (s'il y en a) */}
                              {(calculationStep === 'result') && example.num2 % 10 > 0 && (
                                <div id="bonds-units" className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-green-700">🔢 Dernière étape : les unités</div>
                                  </div>
                                  
                                  <div className="p-4 rounded-lg"
                                       style={{
                                         background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%)',
                                         border: '2px solid #4caf50',
                                         boxShadow: '0 6px 15px rgba(76, 175, 80, 0.3)'
                                       }}>
                                    
                                    <div className="text-center mb-3">
                                      <div className="text-lg text-green-700 mb-2">
                                        Après mes {Math.floor(example.num2 / 10)} bonds, je suis à {example.num1 + Math.floor(example.num2 / 10) * 10}
                                      </div>
                                      <div className="text-base text-green-600">
                                        Il me reste {example.num2 % 10} unités à ajouter
                                      </div>
                                    </div>

                                    <div className="flex justify-center items-center space-x-3 text-xl font-bold">
                                      <div className="text-green-700">{example.num1 + Math.floor(example.num2 / 10) * 10}</div>
                                      <div className="text-gray-600">+</div>
                                      <div className="text-green-700">{example.num2 % 10}</div>
                                      <div className="text-gray-600">=</div>
                                      <div className="text-green-800">{example.result}</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Résultat final */}
                              {calculationStep === 'result' && (
                                <div id="bonds-result" className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-green-700">🎉 Arrivée !</div>
                                  </div>
                                  
                                  <div className="text-center p-3 bg-green-100 rounded-lg border-2 border-green-400">
                                    <div className="text-2xl font-bold text-green-800 animate-bounce">
                                      Résultat : {example.result}
                                    </div>
                                  </div>

                                  <div className="text-center mt-3">
                                    <div className="text-base font-bold text-green-600">
                                      🏆 Bravo ! Les bonds de 10, c'est rapide et amusant !
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour compensation */}
                          {currentTechnique === 'compensation' && calculationStep && (
                            <div className="space-y-3 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                              


                              {/* Analyse et décomposition du second nombre */}
                              {(calculationStep === 'find-complement' || calculationStep === 'show-first' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-blue-700">🔍 Analyse intelligente</div>
                                  </div>
                                  
                                  <div className={`transition-all duration-700 ${
                                    calculationStep === 'find-complement' ? 'transform scale-105' : ''
                                  }`}>
                                    <div className="p-4 rounded-lg mb-4"
                                         style={{
                                           background: calculationStep === 'find-complement' 
                                             ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' 
                                             : '#f8fafc',
                                           border: calculationStep === 'find-complement' 
                                             ? '2px solid #1976d2' 
                                             : '2px solid #e2e8f0',
                                           boxShadow: calculationStep === 'find-complement' 
                                             ? '0 6px 15px rgba(25, 118, 210, 0.3)' 
                                             : '0 4px 6px rgba(0, 0, 0, 0.1)'
                                         }}>
                                      
                                      <div className="text-center mb-4">
                                        <div className="text-lg font-bold text-gray-800 mb-3">
                                          🤔 Je remarque que {example.num1} est proche d'un nombre rond !
                                        </div>
                                        <div className="text-base text-blue-600">
                                          {example.num1} + 1 = {example.num1 + 1} (beaucoup plus facile !)
                                        </div>
                                      </div>

                                      <div className={`text-center p-3 rounded-lg border-2 mb-4 transition-all duration-500 ${
                                        calculationStep === 'find-complement' 
                                          ? 'bg-yellow-200 border-yellow-500 shadow-lg animate-pulse' 
                                          : 'bg-yellow-100 border-yellow-400'
                                      }`}>
                                        <div className="text-base font-bold text-yellow-800 mb-2">
                                          💡 Étape 1 : Je décompose {example.num2}
                                        </div>
                                        <div className="flex justify-center items-center space-x-3 text-lg font-bold">
                                          <div className={`transition-all duration-300 ${
                                            calculationStep === 'find-complement' ? 'text-gray-900 scale-110' : 'text-gray-800'
                                          }`}>{example.num2}</div>
                                          <div className="text-gray-600">=</div>
                                          <div className={`transition-all duration-300 ${
                                            calculationStep === 'find-complement' ? 'text-green-700 scale-110' : 'text-green-600'
                                          }`}>{example.num2 - 1}</div>
                                          <div className="text-gray-600">+</div>
                                          <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                            calculationStep === 'find-complement' 
                                              ? 'text-red-700 scale-125 bg-red-200 shadow-md animate-bounce' 
                                              : 'text-red-600'
                                          }`}>1</div>
                                        </div>
                                      </div>

                                      <div className="text-center p-3 bg-green-100 rounded-lg border-2 border-green-400">
                                        <div className="text-base font-bold text-green-800">
                                          🎯 Étape 2 : Ce "1" va compléter {example.num1} pour faire {example.num1 + 1} !
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Exécution de l'échange */}
                              {(calculationStep === 'show-first' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-purple-700">🔄 Exécution de l'échange</div>
                                  </div>
                                  
                                  <div className={`transition-all duration-700 ${
                                    calculationStep === 'show-first' ? 'transform scale-105' : ''
                                  }`}>
                                    
                                    {/* Étape 1 : Prendre le 1 */}
                                    <div className={`text-center mb-4 p-3 rounded-lg border-2 transition-all duration-500 ${
                                      calculationStep === 'show-first' 
                                        ? 'bg-red-100 border-red-400 shadow-lg animate-pulse' 
                                        : 'bg-red-50 border-red-300'
                                    }`}>
                                      <div className="text-base font-bold text-red-700 mb-2">
                                        🎯 Étape 1 : Je prends le "1" de {example.num2}
                                      </div>
                                      <div className="flex justify-center items-center space-x-3 text-lg">
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'show-first' ? 'text-gray-900 scale-105' : 'text-gray-700'
                                        }`}>{example.num2} = {example.num2 - 1} + </div>
                                        <div className={`px-3 py-1 rounded-lg border-2 font-bold transition-all duration-300 ${
                                          calculationStep === 'show-first' 
                                            ? 'bg-red-300 border-red-500 text-red-900 scale-125 animate-bounce shadow-lg' 
                                            : 'bg-red-200 border-red-400 text-red-800'
                                        }`}>1</div>
                                      </div>
                                    </div>

                                    {/* Étape 2 : Donner le 1 */}
                                    <div className={`text-center mb-4 p-3 rounded-lg border-2 transition-all duration-500 ${
                                      calculationStep === 'show-first' 
                                        ? 'bg-green-100 border-green-400 shadow-lg animate-pulse' 
                                        : 'bg-green-50 border-green-300'
                                    }`}>
                                      <div className="text-base font-bold text-green-700 mb-2">
                                        ✨ Étape 2 : Je donne ce "1" à {example.num1}
                                      </div>
                                      <div className="flex justify-center items-center space-x-3 text-lg">
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'show-first' ? 'text-gray-900 scale-105' : 'text-gray-700'
                                        }`}>{example.num1} + </div>
                                        <div className={`px-2 py-1 rounded-lg border-2 font-bold transition-all duration-300 ${
                                          calculationStep === 'show-first' 
                                            ? 'bg-green-300 border-green-500 text-green-900 scale-125 animate-bounce shadow-lg' 
                                            : 'bg-red-200 border-red-400 text-red-800'
                                        }`}>1</div>
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'show-first' ? 'text-gray-900 scale-105 font-bold' : 'text-gray-700'
                                        }`}> = {example.num1 + 1}</div>
                                      </div>
                                    </div>

                                    {/* Résultat de l'échange */}
                                    <div className="text-center p-4 bg-purple-100 rounded-lg border-2 border-purple-400">
                                      <div className="text-lg font-bold text-purple-800 mb-3">
                                        🎉 Résultat de l'échange :
                                      </div>
                                      <div className="flex justify-center items-center space-x-3 text-xl font-bold">
                                        <div className="text-green-700">{example.num1 + 1}</div>
                                        <div className="text-gray-600">+</div>
                                        <div className="text-blue-700">{example.num2 - 1}</div>
                                      </div>
                                      <div className="text-base text-purple-600 mt-2">
                                        Beaucoup plus facile à calculer !
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Nouveau calcul */}
                              {calculationStep === 'result' && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-green-700">✨ Nouveau calcul facilité</div>
                                  </div>
                                  
                                  <div className="text-center space-y-4">
                                    <div className="text-center p-4 bg-green-100 rounded-lg border-2 border-green-400">
                                      <div className="text-2xl font-bold text-green-800">
                                        {(example.num1 === 29 || example.num1 === 49 || example.num1 === 59 || example.num1 === 39) 
                                          ? `${example.num1 + 1} + ${example.num2 - 1}` 
                                          : `${example.num1 - 1} + ${example.num2 + 1}`}
                                      </div>
                                      <div className="text-sm text-green-600 mt-2">
                                        Beaucoup plus facile à calculer !
                                      </div>
                                    </div>
                                    
                                    <div className="text-3xl font-bold text-green-700">
                                      = {example.result}
                                    </div>
                                  </div>

                                  <div className="text-center mt-4">
                                    <div className="text-lg font-bold text-purple-600">
                                      🏆 Génie ! La compensation rend tout plus simple !
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour étapes successives */}
                          {currentTechnique === 'etapes-successives' && calculationStep && (
                            <div className="space-y-3 bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-lg border-2 border-teal-200">
                              
                              {/* Étape : Introduction */}


                              {/* Point de départ */}
                              {(calculationStep === 'show-first' || calculationStep === 'tens' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-teal-700">🎯 Point de départ</div>
                                  </div>
                                  
                                  <div className="text-center p-3 bg-teal-100 rounded-lg border-2 border-teal-400">
                                    <div className="text-2xl font-bold text-teal-800">
                                      Je commence avec {example.num1}
                                    </div>
                                  </div>
                                  
                                  <div className="text-center mt-3">
                                    <div className="text-base text-teal-600">
                                      Je vais ajouter {example.num2} en deux étapes !
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Première étape : ajouter les dizaines */}
                              {(calculationStep === 'tens' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-blue-700">🥇 Première étape : les dizaines</div>
                                  </div>
                                  
                                  <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                                    calculationStep === 'tens' ? 'bg-blue-100 border-blue-400 animate-pulse' : 'bg-blue-50 border-blue-200'
                                  }`}>
                                    <div className="space-y-2">
                                      <div className="text-base text-blue-600">
                                        J'ajoute {Math.floor(example.num2 / 10) * 10} à {example.num1}
                                      </div>
                                      <div className="flex justify-center items-center space-x-2 text-lg font-bold">
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'tens' ? 'text-blue-800 scale-110' : 'text-blue-700'
                                        }`}>{example.num1}</div>
                                        <div className="text-gray-500">+</div>
                                        <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                          calculationStep === 'tens' 
                                            ? 'text-blue-900 scale-125 bg-blue-200 shadow-md animate-bounce' 
                                            : 'text-blue-700'
                                        }`}>{Math.floor(example.num2 / 10) * 10}</div>
                                        <div className="text-gray-500">=</div>
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'tens' ? 'text-blue-900 scale-110 font-extrabold' : 'text-blue-800'
                                        }`}>{example.num1 + Math.floor(example.num2 / 10) * 10}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Deuxième étape : ajouter les unités */}
                              {(calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-green-700">🥈 Deuxième étape : les unités</div>
                                  </div>
                                  
                                  <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                                    calculationStep === 'units' ? 'bg-green-100 border-green-400 animate-pulse' : 'bg-green-50 border-green-200'
                                  }`}>
                                    <div className="space-y-2">
                                      <div className="text-base text-green-600">
                                        J'ajoute {example.num2 % 10} à {example.num1 + Math.floor(example.num2 / 10) * 10}
                                      </div>
                                      <div className="flex justify-center items-center space-x-2 text-lg font-bold">
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'units' ? 'text-green-800 scale-110' : 'text-green-700'
                                        }`}>{example.num1 + Math.floor(example.num2 / 10) * 10}</div>
                                        <div className="text-gray-500">+</div>
                                        <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                          calculationStep === 'units' 
                                            ? 'text-green-900 scale-125 bg-green-200 shadow-md animate-bounce' 
                                            : 'text-green-700'
                                        }`}>{example.num2 % 10}</div>
                                        <div className="text-gray-500">=</div>
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'units' ? 'text-green-900 scale-110 font-extrabold' : 'text-green-800'
                                        }`}>{example.result}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Résumé final */}
                              {calculationStep === 'result' && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-purple-700">🎉 Résumé des étapes</div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="text-center p-2 bg-blue-100 rounded-lg">
                                      <div className="text-base font-bold text-blue-800">
                                        Étape 1 : {example.num1} + {Math.floor(example.num2 / 10) * 10} = {example.num1 + Math.floor(example.num2 / 10) * 10}
                                      </div>
                                    </div>
                                    
                                    <div className="text-center text-xl">⬇️</div>
                                    
                                    <div className="text-center p-2 bg-green-100 rounded-lg">
                                      <div className="text-base font-bold text-green-800">
                                        Étape 2 : {example.num1 + Math.floor(example.num2 / 10) * 10} + {example.num2 % 10} = {example.result}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-center mt-4">
                                    <div className="text-xl font-bold text-purple-800 animate-bounce">
                                      = {example.result}
                                    </div>
                                    <div className="text-base font-bold text-purple-600 mt-2">
                                      🏆 Parfait ! Étape par étape, c'est sûr !
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour doubles */}
                          {currentTechnique === 'doubles' && calculationStep && (
                            <div className="space-y-3 bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-lg border-2 border-pink-200">
                              


                              {/* Observation */}
                              {(calculationStep === 'show-problem' || calculationStep === 'show-first' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-pink-700">🔍 Observation intelligente</div>
                                  </div>
                                  
                                  <div className="text-center p-3 bg-pink-100 rounded-lg border-2 border-pink-400">
                                    <div className="space-y-2">
                                      <div className="text-base text-pink-600">
                                        Je remarque que {example.num2} = {example.num1} + 1
                                      </div>
                                      <div className="flex justify-center items-center space-x-2 text-lg font-bold">
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'show-problem' ? 'text-pink-800 scale-110' : 'text-pink-700'
                                        }`}>{example.num2}</div>
                                        <div className="text-gray-500">=</div>
                                        <div className={`transition-all duration-300 ${
                                          calculationStep === 'show-problem' ? 'text-pink-800 scale-110' : 'text-pink-700'
                                        }`}>{example.num1}</div>
                                        <div className="text-gray-500">+</div>
                                        <div className={`transition-all duration-300 px-2 py-1 rounded-lg ${
                                          calculationStep === 'show-problem' 
                                            ? 'text-green-800 scale-125 bg-green-200 shadow-md animate-bounce' 
                                            : 'text-green-700'
                                        }`}>1</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Transformation en double */}
                              {(calculationStep === 'show-first' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-blue-700">🔄 Transformation en double</div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="text-center p-2 bg-gray-100 rounded-lg">
                                      <div className="text-base text-gray-700 mb-1">Calcul original :</div>
                                      <div className="text-lg font-bold text-gray-800">
                                        {example.num1} + {example.num2}
                                      </div>
                                    </div>

                                    <div className="text-center text-xl">⬇️</div>

                                    <div className="text-center p-2 bg-blue-100 rounded-lg border-2 border-blue-400">
                                      <div className="text-base text-blue-700 mb-1">Devient :</div>
                                      <div className="text-lg font-bold text-blue-800">
                                        {example.num1} + {example.num1} + 1
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Calcul du double */}
                              {(calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-green-700">✨ Calcul du double</div>
                                  </div>
                                  
                                  <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                                    calculationStep === 'units' ? 'bg-green-100 border-green-400 animate-pulse' : 'bg-green-50 border-green-200'
                                  }`}>
                                    <div className="space-y-2">
                                      <div className="text-base text-green-600">
                                        Le double de {example.num1} :
                                      </div>
                                      <div className="flex justify-center items-center space-x-2 text-xl font-bold">
                                        <div className="text-green-700">{example.num1}</div>
                                        <div className="text-gray-500">+</div>
                                        <div className="text-green-700">{example.num1}</div>
                                        <div className="text-gray-500">=</div>
                                        <div className="text-green-800">{example.num1 * 2}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Résultat final */}
                              {calculationStep === 'result' && (
                                <div className="bg-white rounded-lg p-4 shadow-md max-w-xl mx-auto">
                                  <div className="text-center mb-3">
                                    <div className="text-lg font-bold text-purple-700">🎉 Résultat final</div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="text-center p-3 bg-purple-100 rounded-lg border-2 border-purple-400">
                                      <div className="space-y-2">
                                        <div className="text-base text-purple-600">
                                          Double + 1 :
                                        </div>
                                        <div className="flex justify-center items-center space-x-2 text-xl font-bold">
                                          <div className="text-purple-700">{example.num1 * 2}</div>
                                          <div className="text-gray-500">+</div>
                                          <div className="text-green-700">1</div>
                                          <div className="text-gray-500">=</div>
                                          <div className="text-purple-800 animate-bounce">{example.result}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="text-center p-2 bg-yellow-100 rounded-lg">
                                      <div className="text-base font-bold text-yellow-800">
                                        {example.num1} + {example.num2} = {example.result}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-center mt-4">
                                    <div className="text-base font-bold text-pink-600">
                                      🏆 Génial ! L'astuce des doubles, c'est malin !
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ */
          <div className="pb-20 sm:pb-8">
            {/* Introduction de Sam le Pirate - toujours visible */}
            <div className="mb-6 sm:mb-4 mt-4">
              {/* JSX pour l'introduction de Sam le Pirate dans les exercices */}
              <div className="flex justify-center p-0 sm:p-1 mt-0 sm:mt-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Image de Sam le Pirate */}
                  <div 
                    id="sam-pirate"
                    className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-1 sm:border-2 border-blue-200 shadow-md transition-all duration-300 ${
                    isPlayingVocal
                      ? 'w-12 sm:w-32 h-12 sm:h-32 scale-110 sm:scale-150'
                      : pirateIntroStarted
                        ? 'w-10 sm:w-16 h-10 sm:h-16'
                        : 'w-12 sm:w-20 h-12 sm:h-20'
                  } ${highlightedElement === 'sam-pirate' ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-bounce scale-125' : ''}`}>
                    {!imageError ? (
                      <img 
                        src="/image/Minecraftstyle.png" 
                        alt="Personnage Minecraft" 
                        className="w-full h-full rounded-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-sm sm:text-2xl">
                        🏴‍☠️
                      </div>
                    )}
                    {/* Haut-parleur animé quand il parle */}
                    {isPlayingVocal && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-1 sm:p-2 rounded-full animate-bounce shadow-lg">
                        <svg className="w-2 sm:w-4 h-2 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Bouton Start Exercices */}
                  <button
                  onClick={startPirateIntro}
                  disabled={isPlayingVocal}
                  className={`relative transition-all duration-300 transform ${
                    isPlayingVocal 
                      ? 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed animate-pulse shadow-md' 
                      : pirateIntroStarted
                        ? 'px-2 sm:px-8 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg border-1 sm:border-2 border-blue-300'
                        : 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-2 sm:border-4 border-yellow-300'
                  } ${!isPlayingVocal && !pirateIntroStarted ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''} ${pirateIntroStarted && !isPlayingVocal ? 'ring-2 ring-blue-300 ring-opacity-75' : ''}`}
                  style={{
                    animationDuration: !isPlayingVocal && !pirateIntroStarted ? '1.5s' : '2s',
                    animationIterationCount: isPlayingVocal ? 'none' : 'infinite',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    boxShadow: !isPlayingVocal && !pirateIntroStarted 
                      ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
                      : pirateIntroStarted && !isPlayingVocal
                        ? '0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : ''
                  }}
                >
                  {/* Effet de brillance */}
                  {!isPlayingVocal && !pirateIntroStarted && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                  )}
                  
                  {/* Icônes et texte */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPlayingVocal 
                      ? <>🎤 <span>Sam parle...</span></> 
                      : pirateIntroStarted
                        ? <>🔄 <span>REJOUER L'INTRO</span> 🏴‍☠️</>
                        : <>🚀 <span>COMMENCER</span> ✨</>
                    }
                  </span>
                  
                  {/* Particules brillantes */}
                  {!isPlayingVocal && (
                    <>
                      {!pirateIntroStarted ? (
                        /* Particules initiales - dorées */
                        <>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        </>
                      ) : (
                        /* Particules de replay - bleues */
                        <>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-300 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
                          <div className="absolute top-2 right-2 w-1 h-1 bg-indigo-300 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
                        </>
                      )}
                    </>
                  )}
                </button>
                </div>
              </div>
            </div>

            {/* Sélecteur de séries */}
            <div className="bg-white rounded-xl p-4 shadow-lg mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">📚 Choisir une série d'exercices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(exerciseSeries).map(([seriesKey, seriesExercises]) => {
                  const seriesNames = {
                    decomposition: '🔢 Décomposition',
                    'bonds-10': '🦘 Bonds de 10',
                    compensation: '🔄 Compensation',
                    'etapes-successives': '🥇 Étapes successives',
                    doubles: '👥 Doubles',
                    melange: '🎯 Mélange'
                  };
                  
                  return (
                    <button
                      key={seriesKey}
                      onClick={() => {
                        setCurrentSeries(seriesKey);
                        setCurrentExercise(0);
                        setScore(0);
                        setAnsweredCorrectly(new Set());
                        setShowCompletionModal(false);
                      }}
                      className={`p-4 rounded-lg font-bold text-sm transition-all duration-300 min-h-[80px] flex flex-col justify-center items-center ${
                        currentSeries === seriesKey
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                      }`}
                    >
                      <div>{seriesNames[seriesKey as keyof typeof seriesNames]}</div>
                      <div className="text-xs opacity-75 mt-1">10 exercices</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Header exercices - caché sur mobile */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-6 hidden sm:block">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
                </h2>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-bold text-blue-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetExercises}
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-3 h-3 mr-1" />
                    Reset
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Header exercices mobile - visible uniquement sur mobile */}
            <div className="bg-white rounded-xl p-3 shadow-lg mt-2 block sm:hidden">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold text-gray-900">
                  Exercice {currentExercise + 1}/{exercises.length}
                </h2>
                
                <div className="text-xs font-bold text-blue-600">
                  Score: {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression mobile */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question principale */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg mt-4">
              {/* Header avec bouton écouter en haut à droite */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  {/* Titre de la question */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center">
                    {exercises[currentExercise].question}
                  </h3>
                  
                  {/* Badge du type */}
                  <div className="flex justify-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      exercises[currentExercise].type === 'decomposition' ? 'bg-blue-100 text-blue-800' :
                      exercises[currentExercise].type === 'complement-10' ? 'bg-green-100 text-green-800' :
                      exercises[currentExercise].type === 'bonds-10' ? 'bg-yellow-100 text-yellow-800' :
                      exercises[currentExercise].type === 'compensation' ? 'bg-orange-100 text-orange-800' :
                      exercises[currentExercise].type === 'etapes-successives' ? 'bg-purple-100 text-purple-800' :
                      exercises[currentExercise].type === 'doubles' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exercises[currentExercise].type === 'decomposition' ? '🧮 Décomposition' :
                       exercises[currentExercise].type === 'complement-10' ? '🎯 Complément à 10' :
                       exercises[currentExercise].type === 'bonds-10' ? '⚡ Bonds de 10' :
                       exercises[currentExercise].type === 'compensation' ? '🔄 Compensation' :
                       exercises[currentExercise].type === 'etapes-successives' ? '🎲 Étapes successives' :
                       exercises[currentExercise].type === 'doubles' ? '🧠 Doubles' :
                       '✨ Technique CE1'}
                    </span>
                  </div>
                </div>

                {/* Bouton écouter l'énoncé - en haut à droite */}
                <button
                  id="listen-question-button"
                  onClick={startExerciseExplanation}
                  disabled={isPlayingEnonce}
                  className={`flex-shrink-0 ml-4 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                    isPlayingEnonce 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : highlightedElement === 'listen-question-button'
                        ? 'bg-yellow-500 text-white ring-4 ring-yellow-300 animate-pulse scale-105'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  {isPlayingEnonce ? '🎤' : '🎧'}
                  <span className="hidden sm:inline ml-1">
                    {isPlayingEnonce ? 'Écoute...' : 'Écouter'}
                  </span>
                </button>
              </div>

              {/* Zone de réponse */}
              <div 
                id="answer-zone"
                className={`max-w-md mx-auto mb-6 transition-all duration-300 ${
                  highlightedElement === 'answer-zone' ? 'ring-4 ring-blue-400 rounded-lg scale-105' : ''
                }`}
              >
                <div className="text-center mb-4">
                  <label className="block text-lg font-bold text-gray-800 mb-2">
                    Écris le résultat :
                  </label>
                  
                  {/* Équation centrée */}
                  <div className="text-center mb-3">
                    <span className="text-lg sm:text-xl font-bold">{exercises[currentExercise].firstNumber} + {exercises[currentExercise].secondNumber} = ?</span>
                  </div>
                  
                  {/* Input parfaitement centré */}
                  <div className="flex justify-center">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="?"
                      disabled={isCorrect !== null}
                      className={`w-16 sm:w-20 h-12 text-lg sm:text-xl font-bold text-center border-2 rounded-lg ${
                        isCorrect === true 
                          ? 'border-green-500 bg-green-50 text-green-800' 
                          : isCorrect === false 
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-300 focus:border-blue-500 focus:outline-none'
                      }`}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Bouton vérifier */}
                {isCorrect === null && (
                  <div className="text-center">
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={!userAnswer.trim() || isPlayingVocal}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                        !userAnswer.trim() || isPlayingVocal
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 shadow-lg'
                      }`}
                    >
                      ✅ Valider
                    </button>
                  </div>
                )}
              </div>

              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 sm:p-6 rounded-lg mb-6 text-center ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-bounce" />
                        <span className="font-bold text-lg sm:text-xl">
                          🎉 Parfait ! {exercises[currentExercise].firstNumber} + {exercises[currentExercise].secondNumber} = {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">
                          Pas tout à fait... La bonne réponse est : {exercises[currentExercise].correctAnswer}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Animation de décomposition réduite pour les exercices de décomposition */}
              {exercises[currentExercise].type === 'decomposition' && isCorrect !== null && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border-2 border-blue-200">
                  <h4 className="text-lg font-bold text-center text-blue-800 mb-4">
                    🔢 Méthode de décomposition
                  </h4>
                  
                  {/* Décomposition simplifiée */}
                  <div className="space-y-3 max-w-lg mx-auto">
                    {/* Premier nombre */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-center items-center space-x-2 text-lg font-bold">
                        <div className="text-gray-800">{exercises[currentExercise].firstNumber}</div>
                        <div className="text-gray-600">=</div>
                        <div className="text-blue-600 px-2 py-1 bg-blue-100 rounded">
                          {Math.floor(exercises[currentExercise].firstNumber / 10) * 10}
                        </div>
                        <div className="text-gray-600">+</div>
                        <div className="text-green-600 px-2 py-1 bg-green-100 rounded">
                          {exercises[currentExercise].firstNumber % 10}
                        </div>
                      </div>
                    </div>

                    {/* Second nombre */}
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-center items-center space-x-2 text-lg font-bold">
                        <div className="text-gray-800">{exercises[currentExercise].secondNumber}</div>
                        <div className="text-gray-600">=</div>
                        <div className="text-blue-600 px-2 py-1 bg-blue-100 rounded">
                          {Math.floor(exercises[currentExercise].secondNumber / 10) * 10}
                        </div>
                        <div className="text-gray-600">+</div>
                        <div className="text-green-600 px-2 py-1 bg-green-100 rounded">
                          {exercises[currentExercise].secondNumber % 10}
                        </div>
                      </div>
                    </div>

                    {/* Addition des dizaines */}
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-blue-400">
                      <div className="flex justify-center items-center space-x-2 text-lg font-bold">
                        <div className="text-blue-700">
                          {Math.floor(exercises[currentExercise].firstNumber / 10) * 10}
                        </div>
                        <div className="text-gray-600">+</div>
                        <div className="text-blue-700">
                          {Math.floor(exercises[currentExercise].secondNumber / 10) * 10}
                        </div>
                        <div className="text-gray-600">=</div>
                        <div className="text-blue-800 bg-blue-200 px-2 py-1 rounded">
                          {(Math.floor(exercises[currentExercise].firstNumber / 10) + Math.floor(exercises[currentExercise].secondNumber / 10)) * 10}
                        </div>
                      </div>
                      <div className="text-center text-sm text-blue-600 mt-1">Dizaines</div>
                    </div>

                    {/* Addition des unités */}
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-green-400">
                      <div className="flex justify-center items-center space-x-2 text-lg font-bold">
                        <div className="text-green-700">
                          {exercises[currentExercise].firstNumber % 10}
                        </div>
                        <div className="text-gray-600">+</div>
                        <div className="text-green-700">
                          {exercises[currentExercise].secondNumber % 10}
                        </div>
                        <div className="text-gray-600">=</div>
                        <div className="text-green-800 bg-green-200 px-2 py-1 rounded">
                          {(exercises[currentExercise].firstNumber % 10) + (exercises[currentExercise].secondNumber % 10)}
                        </div>
                      </div>
                      <div className="text-center text-sm text-green-600 mt-1">Unités</div>
                    </div>

                    {/* Résultat final */}
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-purple-400">
                      <div className="flex justify-center items-center space-x-2 text-xl font-bold">
                        <div className="text-blue-700">
                          {(Math.floor(exercises[currentExercise].firstNumber / 10) + Math.floor(exercises[currentExercise].secondNumber / 10)) * 10}
                        </div>
                        <div className="text-gray-600">+</div>
                        <div className="text-green-700">
                          {(exercises[currentExercise].firstNumber % 10) + (exercises[currentExercise].secondNumber % 10)}
                        </div>
                        <div className="text-gray-600">=</div>
                        <div className="text-purple-800 bg-purple-200 px-3 py-1 rounded animate-pulse">
                          {exercises[currentExercise].correctAnswer}
                        </div>
                      </div>
                      <div className="text-center text-sm text-purple-600 mt-1">🎉 Résultat final</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Correction animée avec addition posée */}
              {showAnimatedCorrection && correctionNumbers && (
                <div id="animated-correction" className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 sm:p-6 mb-4 sm:mb-8 border-2 border-blue-200">
                  <h4 className="text-base sm:text-2xl font-bold text-center text-blue-800 mb-3 sm:mb-6">
                    🎯 Addition posée : {correctionNumbers.first} + {correctionNumbers.second}
                  </h4>
                  
                  {/* Addition posée en colonnes */}
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg max-w-lg mx-auto mb-4">
                    <div className="text-center mb-4">
                      <div className="text-base sm:text-lg font-bold text-gray-700">📊 Addition en colonnes</div>
                    </div>
                    
                    {/* Retenue (visible avec retenue uniquement) */}
                    {((correctionNumbers.first % 10) + (correctionNumbers.second % 10)) >= 10 && (
                      <div className="flex justify-center mb-2">
                        <div className="w-6 sm:w-8"></div>
                        <div className="w-12 sm:w-16 text-center">
                          {(correctionStep === 'carry-step' || correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
                            <div className="text-base sm:text-lg font-bold text-red-700 animate-bounce border-2 border-red-400 bg-red-100 rounded-full px-2 py-1">
                              1
                            </div>
                          )}
                        </div>
                        <div className="w-12 sm:w-16"></div>
                      </div>
                    )}
                    
                    {/* En-têtes de colonnes */}
                    <div className="flex justify-center mb-3">
                      <div className="w-6 sm:w-8"></div>
                      <div className="w-12 sm:w-16 text-center text-sm sm:text-lg font-bold text-gray-600 border-b-2 border-gray-400 pb-1">D</div>
                      <div className="w-12 sm:w-16 text-center text-sm sm:text-lg font-bold text-gray-600 border-b-2 border-gray-400 pb-1">U</div>
                    </div>
                    
                    {/* Premier nombre */}
                    <div className="flex justify-center py-3">
                      <div className="w-6 sm:w-8"></div>
                      <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                        highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded-lg px-2 py-1 ring-2 ring-yellow-400' : 'text-gray-900'
                      }`}>
                        {Math.floor(correctionNumbers.first / 10)}
                      </div>
                      <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                        highlightedDigits.includes('units') ? 'bg-blue-200 text-blue-900 rounded-lg px-2 py-1 ring-2 ring-blue-400' : 'text-gray-900'
                      }`}>
                        {correctionNumbers.first % 10}
                      </div>
                    </div>
                    
                    {/* Ligne avec le signe + et le deuxième nombre */}
                    <div className="flex justify-center py-3">
                      <div className="w-6 sm:w-8 text-xl sm:text-3xl font-bold text-orange-700 text-center">+</div>
                      <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                        highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded-lg px-2 py-1 ring-2 ring-yellow-400' : 'text-gray-900'
                      }`}>
                        {Math.floor(correctionNumbers.second / 10)}
                      </div>
                      <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                        highlightedDigits.includes('units') ? 'bg-blue-200 text-blue-900 rounded-lg px-2 py-1 ring-2 ring-blue-400' : 'text-gray-900'
                      }`}>
                        {correctionNumbers.second % 10}
                      </div>
                    </div>
                    
                    {/* Ligne de séparation */}
                    <div className="border-b-4 border-gray-600 my-4 w-32 sm:w-40 mx-auto"></div>
                    
                    {/* Résultat progressif */}
                    {(correctionStep === 'adding' || correctionStep === 'carry-step' || correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
                      <div className="flex justify-center py-3">
                        <div className="w-6 sm:w-8"></div>
                        
                        {/* Chiffre des dizaines */}
                        <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                          (correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                            : 'text-gray-300'
                        }`}>
                          {(correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? Math.floor(correctionNumbers.result / 10) 
                            : '?'}
                        </div>
                        
                        {/* Chiffre des unités */}
                        <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                          (correctionStep === 'adding' || correctionStep === 'carry-step' || correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                            : 'text-gray-300'
                        }`}>
                          {(correctionStep === 'adding' || correctionStep === 'carry-step' || correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? correctionNumbers.result % 10
                            : '?'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Explications textuelles selon l'étape */}
                  <div className="text-center">
                    {/* Explication placement - toujours visible une fois affichée */}
                    {(correctionStep === 'numbers' || correctionStep === 'carry-step' || correctionStep === 'decomposition' || correctionStep === 'adding' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
                      <p className="text-sm sm:text-lg text-blue-700 font-semibold mb-3">
                        📋 Je place les nombres en colonnes : dizaines sous dizaines, unités sous unités
                      </p>
                    )}
                    
                    {/* Explication retenue - reste visible une fois affichée */}
                    {((correctionNumbers.first % 10) + (correctionNumbers.second % 10)) >= 10 && (correctionStep === 'carry-step' || correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
                      <div className="space-y-2 mb-3">
                        <p className="text-sm sm:text-lg text-orange-700 font-semibold">
                          🔄 Addition avec retenue !
                        </p>
                        <p className="text-xs sm:text-base text-orange-600">
                          Les unités ({correctionNumbers.first % 10} + {correctionNumbers.second % 10} = {(correctionNumbers.first % 10) + (correctionNumbers.second % 10)}) dépassent 9
                        </p>
                      </div>
                    )}
                    
                    {/* Décomposition - reste visible une fois affichée avec retenue */}
                    {((correctionNumbers.first % 10) + (correctionNumbers.second % 10)) >= 10 && (correctionStep === 'decomposition' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
                      <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200 mb-4">
                        <p className="text-sm sm:text-lg text-orange-700 font-semibold mb-3">
                          🔧 Décomposition de {(correctionNumbers.first % 10) + (correctionNumbers.second % 10)}
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-lg sm:text-2xl font-bold">
                          <span className="bg-orange-200 px-3 py-2 rounded-lg text-orange-800">
                            {(correctionNumbers.first % 10) + (correctionNumbers.second % 10)}
                          </span>
                          <span className="text-orange-600">=</span>
                          <div className="bg-yellow-100 px-3 py-2 rounded-lg border-2 border-yellow-400">
                            <span className="text-yellow-800 text-sm block">dizaine</span>
                            <span className="text-yellow-900 font-bold text-xl">
                              {Math.floor(((correctionNumbers.first % 10) + (correctionNumbers.second % 10)) / 10)}
                            </span>
                          </div>
                          <span className="text-orange-600">+</span>
                          <div className="bg-blue-100 px-3 py-2 rounded-lg border-2 border-blue-400">
                            <span className="text-blue-800 text-sm block">unités</span>
                            <span className="text-blue-900 font-bold text-xl">
                              {((correctionNumbers.first % 10) + (correctionNumbers.second % 10)) % 10}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs sm:text-sm text-orange-600 text-center">
                          <span className="text-yellow-700">↑ retenue</span>
                          <span className="mx-4">|</span>
                          <span className="text-blue-700">↑ résultat unités</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Explication pour addition sans retenue - reste visible */}
                    {((correctionNumbers.first % 10) + (correctionNumbers.second % 10)) < 10 && (correctionStep === 'adding' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
                      <p className="text-sm sm:text-lg text-blue-700 font-semibold mb-3">
                        ✨ Addition simple : pas de retenue nécessaire !
                      </p>
                    )}
                    
                    {(correctionStep === 'final-sum' || correctionStep === 'complete') && (
                      <p className="text-sm sm:text-lg text-green-700 font-semibold mb-3">
                        🎯 Résultat final : {correctionNumbers.result} !
                      </p>
                    )}
                    
                    {correctionStep === 'complete' && (
                      <div className="bg-green-100 rounded-lg p-3 sm:p-4">
                        <p className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                          🎉 Parfait ! Addition posée réussie !
                        </p>
                        <p className="text-sm sm:text-base text-green-700">
                          {correctionNumbers.first} + {correctionNumbers.second} = {correctionNumbers.result}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center pb-3 sm:pb-0">
                  <button
                    ref={nextButtonRef}
                    onClick={nextExercise}
                    className={`bg-orange-500 text-white px-3 sm:px-6 md:px-8 py-2 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[40px] sm:min-h-[56px] md:min-h-auto ${
                      highlightNextButton 
                        ? `ring-4 ring-yellow-400 ring-opacity-75 animate-pulse scale-110 bg-orange-600 shadow-2xl ${isMobile ? 'scale-125 py-3 text-base' : ''}` 
                        : ''
                    }`}
                  >
                    {isMobile && highlightNextButton ? '👆 Suivant →' : 'Suivant →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const result = getCompletionMessage(finalScore, exercises.length);
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Bravo ! Tu maîtrises les additions jusqu'à 100 !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetExercises}
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => {
                          stopAllVocalsAndAnimations();
                          setShowCompletionModal(false);
                        }}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}