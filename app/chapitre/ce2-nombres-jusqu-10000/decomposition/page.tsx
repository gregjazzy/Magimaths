'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function Decomposition10000CE2() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'separating' | 'grouping' | 'result' | null>(null);
  const [decompositionStep, setDecompositionStep] = useState<'number' | 'parts' | 'result' | null>(null);
  const [selectedDecomposition, setSelectedDecomposition] = useState<number>(0);
  
  // États pour l'animation du tableau de décomposition
  const [tableAnimationStep, setTableAnimationStep] = useState<'initial' | 'table' | 'digits' | 'multiplications' | 'addition' | null>(null);

  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer1, setUserAnswer1] = useState('');
  const [userAnswer2, setUserAnswer2] = useState('');
  const [userAnswer3, setUserAnswer3] = useState('');
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
  const [correctionStep, setCorrectionStep] = useState<'group1' | 'group2' | 'counting' | 'result' | 'complete' | null>(null);
  const [highlightNextButton, setHighlightNextButton] = useState(false);

  // État pour la détection mobile
  const [isMobile, setIsMobile] = useState(false);
  const [animatedObjects, setAnimatedObjects] = useState<string[]>([]);

  // État pour stocker les nombres de la correction en cours
  const [correctionNumbers, setCorrectionNumbers] = useState<{
    num1: number;
    num2: number;
    result: number;
    objectEmoji: string;
    objectName: string;
    strategy?: string;
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
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire"
  ];

  // Exemples de décompositions stratégiques (jusqu'à 1000)
  const decompositionExamples = [
    { 
      number: 2345, 
      parts: [2000, 300, 40, 5], 
      item: '🔴', 
      description: 'le nombre 2345',
      explanation: 'Décomposition complète : 2345 = 2 × 1000 + 3 × 100 + 4 × 10 + 5 × 1 = 2000 + 300 + 40 + 5',
      strategy: 'Milliers + Centaines + Dizaines + Unités'
    },
    { 
      number: 1087, 
      parts: [1000, 0, 80, 7], 
      item: '🔵', 
      description: 'le nombre 1087',
      explanation: 'Décomposition avec zéro : 1087 = 1 × 1000 + 0 × 100 + 8 × 10 + 7 × 1 = 1000 + 0 + 80 + 7',
      strategy: 'Milliers + Dizaines + Unités'
    },
    { 
      number: 3200, 
      parts: [3000, 200, 0, 0], 
      item: '🟢', 
      description: 'le nombre 3200',
      explanation: 'Décomposition avec zéros : 3200 = 3 × 1000 + 2 × 100 + 0 × 10 + 0 × 1 = 3000 + 200 + 0 + 0',
      strategy: 'Milliers + Centaines'
    },
    { 
      number: 4000, 
      parts: [4000, 0, 0, 0], 
      item: '🟡', 
      description: 'le nombre 4000',
      explanation: 'Décomposition milliers ronds : 4000 = 4 × 1000 + 0 × 100 + 0 × 10 + 0 × 1 = 4000 + 0 + 0 + 0',
      strategy: 'Milliers ronds'
    },
    { 
      number: 5678, 
      parts: [5000, 600, 70, 8], 
      item: '🟣', 
      description: 'le nombre 5678',
      explanation: 'Décomposition complète : 5678 = 5 × 1000 + 6 × 100 + 7 × 10 + 8 × 1 = 5000 + 600 + 70 + 8',
      strategy: 'Milliers + Centaines + Dizaines + Unités'
    },
    { 
      number: 7050, 
      parts: [7000, 0, 50, 0], 
      item: '🟠', 
      description: 'le nombre 7050',
      explanation: 'Décomposition avec zéros : 7050 = 7 × 1000 + 0 × 100 + 5 × 10 + 0 × 1 = 7000 + 0 + 50 + 0',
      strategy: 'Milliers + Dizaines'
    }
  ];

  // Toutes les décompositions possibles pour chaque nombre (jusqu'à 100)
  const allDecompositions = {
    3: [[1, 2], [2, 1]],
    4: [[1, 3], [2, 2], [3, 1]],
    5: [[1, 4], [2, 3], [3, 2], [4, 1]],
    6: [[1, 5], [2, 4], [3, 3], [4, 2], [5, 1]],
    7: [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]],
    8: [[1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1]],
    9: [[1, 8], [2, 7], [3, 6], [4, 5], [5, 4], [6, 3], [7, 2], [8, 1]],
    10: [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [8, 2], [9, 1]],
    25: [[1, 24], [2, 23], [3, 22], [4, 21], [5, 20], [6, 19], [7, 18], [8, 17], [9, 16], [10, 15], [11, 14], [12, 13], [13, 12], [14, 11], [15, 10], [16, 9], [17, 8], [18, 7], [19, 6], [20, 5], [21, 4], [22, 3], [23, 2], [24, 1]],
    30: [[1, 29], [2, 28], [3, 27], [4, 26], [5, 25], [6, 24], [7, 23], [8, 22], [9, 21], [10, 20], [11, 19], [12, 18], [13, 17], [14, 16], [15, 15], [16, 14], [17, 13], [18, 12], [19, 11], [20, 10], [21, 9], [22, 8], [23, 7], [24, 6], [25, 5], [26, 4], [27, 3], [28, 2], [29, 1]],
    35: [[1, 34], [2, 33], [3, 32], [4, 31], [5, 30], [6, 29], [7, 28], [8, 27], [9, 26], [10, 25], [11, 24], [12, 23], [13, 22], [14, 21], [15, 20], [16, 19], [17, 18], [18, 17], [19, 16], [20, 15], [21, 14], [22, 13], [23, 12], [24, 11], [25, 10], [26, 9], [27, 8], [28, 7], [29, 6], [30, 5], [31, 4], [32, 3], [33, 2], [34, 1]],
    40: [[1, 39], [2, 38], [3, 37], [4, 36], [5, 35], [6, 34], [7, 33], [8, 32], [9, 31], [10, 30], [11, 29], [12, 28], [13, 27], [14, 26], [15, 25], [16, 24], [17, 23], [18, 22], [19, 21], [20, 20], [21, 19], [22, 18], [23, 17], [24, 16], [25, 15], [26, 14], [27, 13], [28, 12], [29, 11], [30, 10], [31, 9], [32, 8], [33, 7], [34, 6], [35, 5], [36, 4], [37, 3], [38, 2], [39, 1]],
    45: [[1, 44], [2, 43], [3, 42], [4, 41], [5, 40], [6, 39], [7, 38], [8, 37], [9, 36], [10, 35], [11, 34], [12, 33], [13, 32], [14, 31], [15, 30], [16, 29], [17, 28], [18, 27], [19, 26], [20, 25], [21, 24], [22, 23], [23, 22], [24, 21], [25, 20], [26, 19], [27, 18], [28, 17], [29, 16], [30, 15], [31, 14], [32, 13], [33, 12], [34, 11], [35, 10], [36, 9], [37, 8], [38, 7], [39, 6], [40, 5], [41, 4], [42, 3], [43, 2], [44, 1]],
    50: [[1, 49], [2, 48], [3, 47], [4, 46], [5, 45], [6, 44], [7, 43], [8, 42], [9, 41], [10, 40], [11, 39], [12, 38], [13, 37], [14, 36], [15, 35], [16, 34], [17, 33], [18, 32], [19, 31], [20, 30], [21, 29], [22, 28], [23, 27], [24, 26], [25, 25], [26, 24], [27, 23], [28, 22], [29, 21], [30, 20], [31, 19], [32, 18], [33, 17], [34, 16], [35, 15], [36, 14], [37, 13], [38, 12], [39, 11], [40, 10], [41, 9], [42, 8], [43, 7], [44, 6], [45, 5], [46, 4], [47, 3], [48, 2], [49, 1]],
    60: [[1, 59], [2, 58], [3, 57], [4, 56], [5, 55], [6, 54], [7, 53], [8, 52], [9, 51], [10, 50], [11, 49], [12, 48], [13, 47], [14, 46], [15, 45], [16, 44], [17, 43], [18, 42], [19, 41], [20, 40], [21, 39], [22, 38], [23, 37], [24, 36], [25, 35], [26, 34], [27, 33], [28, 32], [29, 31], [30, 30], [31, 29], [32, 28], [33, 27], [34, 26], [35, 25], [36, 24], [37, 23], [38, 22], [39, 21], [40, 20], [41, 19], [42, 18], [43, 17], [44, 16], [45, 15], [46, 14], [47, 13], [48, 12], [49, 11], [50, 10], [51, 9], [52, 8], [53, 7], [54, 6], [55, 5], [56, 4], [57, 3], [58, 2], [59, 1]],
    75: [[1, 74], [2, 73], [3, 72], [4, 71], [5, 70], [6, 69], [7, 68], [8, 67], [9, 66], [10, 65], [11, 64], [12, 63], [13, 62], [14, 61], [15, 60], [16, 59], [17, 58], [18, 57], [19, 56], [20, 55], [21, 54], [22, 53], [23, 52], [24, 51], [25, 50], [26, 49], [27, 48], [28, 47], [29, 46], [30, 45], [31, 44], [32, 43], [33, 42], [34, 41], [35, 40], [36, 39], [37, 38], [38, 37], [39, 36], [40, 35], [41, 34], [42, 33], [43, 32], [44, 31], [45, 30], [46, 29], [47, 28], [48, 27], [49, 26], [50, 25], [51, 24], [52, 23], [53, 22], [54, 21], [55, 20], [56, 19], [57, 18], [58, 17], [59, 16], [60, 15], [61, 14], [62, 13], [63, 12], [64, 11], [65, 10], [66, 9], [67, 8], [68, 7], [69, 6], [70, 5], [71, 4], [72, 3], [73, 2], [74, 1]],
    80: [[1, 79], [2, 78], [3, 77], [4, 76], [5, 75], [6, 74], [7, 73], [8, 72], [9, 71], [10, 70], [11, 69], [12, 68], [13, 67], [14, 66], [15, 65], [16, 64], [17, 63], [18, 62], [19, 61], [20, 60], [21, 59], [22, 58], [23, 57], [24, 56], [25, 55], [26, 54], [27, 53], [28, 52], [29, 51], [30, 50], [31, 49], [32, 48], [33, 47], [34, 46], [35, 45], [36, 44], [37, 43], [38, 42], [39, 41], [40, 40], [41, 39], [42, 38], [43, 37], [44, 36], [45, 35], [46, 34], [47, 33], [48, 32], [49, 31], [50, 30], [51, 29], [52, 28], [53, 27], [54, 26], [55, 25], [56, 24], [57, 23], [58, 22], [59, 21], [60, 20], [61, 19], [62, 18], [63, 17], [64, 16], [65, 15], [66, 14], [67, 13], [68, 12], [69, 11], [70, 10], [71, 9], [72, 8], [73, 7], [74, 6], [75, 5], [76, 4], [77, 3], [78, 2], [79, 1]],
    68: [[1, 67], [2, 66], [3, 65], [4, 64], [5, 63], [6, 62], [7, 61], [8, 60], [9, 59], [10, 58], [11, 57], [12, 56], [13, 55], [14, 54], [15, 53], [16, 52], [17, 51], [18, 50], [19, 49], [20, 48], [21, 47], [22, 46], [23, 45], [24, 44], [25, 43], [26, 42], [27, 41], [28, 40], [29, 39], [30, 38], [31, 37], [32, 36], [33, 35], [34, 34], [35, 33], [36, 32], [37, 31], [38, 30], [39, 29], [40, 28], [41, 27], [42, 26], [43, 25], [44, 24], [45, 23], [46, 22], [47, 21], [48, 20], [49, 19], [50, 18], [51, 17], [52, 16], [53, 15], [54, 14], [55, 13], [56, 12], [57, 11], [58, 10], [59, 9], [60, 8], [61, 7], [62, 6], [63, 5], [64, 4], [65, 3], [66, 2], [67, 1]],
    83: [[1, 82], [2, 81], [3, 80], [4, 79], [5, 78], [6, 77], [7, 76], [8, 75], [9, 74], [10, 73], [11, 72], [12, 71], [13, 70], [14, 69], [15, 68], [16, 67], [17, 66], [18, 65], [19, 64], [20, 63], [21, 62], [22, 61], [23, 60], [24, 59], [25, 58], [26, 57], [27, 56], [28, 55], [29, 54], [30, 53], [31, 52], [32, 51], [33, 50], [34, 49], [35, 48], [36, 47], [37, 46], [38, 45], [39, 44], [40, 43], [41, 42], [42, 41], [43, 40], [44, 39], [45, 38], [46, 37], [47, 36], [48, 35], [49, 34], [50, 33], [51, 32], [52, 31], [53, 30], [54, 29], [55, 28], [56, 27], [57, 26], [58, 25], [59, 24], [60, 23], [61, 22], [62, 21], [63, 20], [64, 19], [65, 18], [66, 17], [67, 16], [68, 15], [69, 14], [70, 13], [71, 12], [72, 11], [73, 10], [74, 9], [75, 8], [76, 7], [77, 6], [78, 5], [79, 4], [80, 3], [81, 2], [82, 1]],
    29: [[1, 28], [2, 27], [3, 26], [4, 25], [5, 24], [6, 23], [7, 22], [8, 21], [9, 20], [10, 19], [11, 18], [12, 17], [13, 16], [14, 15], [15, 14], [16, 13], [17, 12], [18, 11], [19, 10], [20, 9], [21, 8], [22, 7], [23, 6], [24, 5], [25, 4], [26, 3], [27, 2], [28, 1]],
    38: [[1, 37], [2, 36], [3, 35], [4, 34], [5, 33], [6, 32], [7, 31], [8, 30], [9, 29], [10, 28], [11, 27], [12, 26], [13, 25], [14, 24], [15, 23], [16, 22], [17, 21], [18, 20], [19, 19], [20, 18], [21, 17], [22, 16], [23, 15], [24, 14], [25, 13], [26, 12], [27, 11], [28, 10], [29, 9], [30, 8], [31, 7], [32, 6], [33, 5], [34, 4], [35, 3], [36, 2], [37, 1]],
    46: [[1, 45], [2, 44], [3, 43], [4, 42], [5, 41], [6, 40], [7, 39], [8, 38], [9, 37], [10, 36], [11, 35], [12, 34], [13, 33], [14, 32], [15, 31], [16, 30], [17, 29], [18, 28], [19, 27], [20, 26], [21, 25], [22, 24], [23, 23], [24, 22], [25, 21], [26, 20], [27, 19], [28, 18], [29, 17], [30, 16], [31, 15], [32, 14], [33, 13], [34, 12], [35, 11], [36, 10], [37, 9], [38, 8], [39, 7], [40, 6], [41, 5], [42, 4], [43, 3], [44, 2], [45, 1]],
    47: [[1, 46], [2, 45], [3, 44], [4, 43], [5, 42], [6, 41], [7, 40], [8, 39], [9, 38], [10, 37], [11, 36], [12, 35], [13, 34], [14, 33], [15, 32], [16, 31], [17, 30], [18, 29], [19, 28], [20, 27], [21, 26], [22, 25], [23, 24], [24, 23], [25, 22], [26, 21], [27, 20], [28, 19], [29, 18], [30, 17], [31, 16], [32, 15], [33, 14], [34, 13], [35, 12], [36, 11], [37, 10], [38, 9], [39, 8], [40, 7], [41, 6], [42, 5], [43, 4], [44, 3], [45, 2], [46, 1]],
    52: [[1, 51], [2, 50], [3, 49], [4, 48], [5, 47], [6, 46], [7, 45], [8, 44], [9, 43], [10, 42], [11, 41], [12, 40], [13, 39], [14, 38], [15, 37], [16, 36], [17, 35], [18, 34], [19, 33], [20, 32], [21, 31], [22, 30], [23, 29], [24, 28], [25, 27], [26, 26], [27, 25], [28, 24], [29, 23], [30, 22], [31, 21], [32, 20], [33, 19], [34, 18], [35, 17], [36, 16], [37, 15], [38, 14], [39, 13], [40, 12], [41, 11], [42, 10], [43, 9], [44, 8], [45, 7], [46, 6], [47, 5], [48, 4], [49, 3], [50, 2], [51, 1]],
    58: [[1, 57], [2, 56], [3, 55], [4, 54], [5, 53], [6, 52], [7, 51], [8, 50], [9, 49], [10, 48], [11, 47], [12, 46], [13, 45], [14, 44], [15, 43], [16, 42], [17, 41], [18, 40], [19, 39], [20, 38], [21, 37], [22, 36], [23, 35], [24, 34], [25, 33], [26, 32], [27, 31], [28, 30], [29, 29], [30, 28], [31, 27], [32, 26], [33, 25], [34, 24], [35, 23], [36, 22], [37, 21], [38, 20], [39, 19], [40, 18], [41, 17], [42, 16], [43, 15], [44, 14], [45, 13], [46, 12], [47, 11], [48, 10], [49, 9], [50, 8], [51, 7], [52, 6], [53, 5], [54, 4], [55, 3], [56, 2], [57, 1]],
    63: [[1, 62], [2, 61], [3, 60], [4, 59], [5, 58], [6, 57], [7, 56], [8, 55], [9, 54], [10, 53], [11, 52], [12, 51], [13, 50], [14, 49], [15, 48], [16, 47], [17, 46], [18, 45], [19, 44], [20, 43], [21, 42], [22, 41], [23, 40], [24, 39], [25, 38], [26, 37], [27, 36], [28, 35], [29, 34], [30, 33], [31, 32], [32, 31], [33, 30], [34, 29], [35, 28], [36, 27], [37, 26], [38, 25], [39, 24], [40, 23], [41, 22], [42, 21], [43, 20], [44, 19], [45, 18], [46, 17], [47, 16], [48, 15], [49, 14], [50, 13], [51, 12], [52, 11], [53, 10], [54, 9], [55, 8], [56, 7], [57, 6], [58, 5], [59, 4], [60, 3], [61, 2], [62, 1]],
    67: [[1, 66], [2, 65], [3, 64], [4, 63], [5, 62], [6, 61], [7, 60], [8, 59], [9, 58], [10, 57], [11, 56], [12, 55], [13, 54], [14, 53], [15, 52], [16, 51], [17, 50], [18, 49], [19, 48], [20, 47], [21, 46], [22, 45], [23, 44], [24, 43], [25, 42], [26, 41], [27, 40], [28, 39], [29, 38], [30, 37], [31, 36], [32, 35], [33, 34], [34, 33], [35, 32], [36, 31], [37, 30], [38, 29], [39, 28], [40, 27], [41, 26], [42, 25], [43, 24], [44, 23], [45, 22], [46, 21], [47, 20], [48, 19], [49, 18], [50, 17], [51, 16], [52, 15], [53, 14], [54, 13], [55, 12], [56, 11], [57, 10], [58, 9], [59, 8], [60, 7], [61, 6], [62, 5], [63, 4], [64, 3], [65, 2], [66, 1]],
    73: [[1, 72], [2, 71], [3, 70], [4, 69], [5, 68], [6, 67], [7, 66], [8, 65], [9, 64], [10, 63], [11, 62], [12, 61], [13, 60], [14, 59], [15, 58], [16, 57], [17, 56], [18, 55], [19, 54], [20, 53], [21, 52], [22, 51], [23, 50], [24, 49], [25, 48], [26, 47], [27, 46], [28, 45], [29, 44], [30, 43], [31, 42], [32, 41], [33, 40], [34, 39], [35, 38], [36, 37], [37, 36], [38, 35], [39, 34], [40, 33], [41, 32], [42, 31], [43, 30], [44, 29], [45, 28], [46, 27], [47, 26], [48, 25], [49, 24], [50, 23], [51, 22], [52, 21], [53, 20], [54, 19], [55, 18], [56, 17], [57, 16], [58, 15], [59, 14], [60, 13], [61, 12], [62, 11], [63, 10], [64, 9], [65, 8], [66, 7], [67, 6], [68, 5], [69, 4], [70, 3], [71, 2], [72, 1]],
    76: [[1, 75], [2, 74], [3, 73], [4, 72], [5, 71], [6, 70], [7, 69], [8, 68], [9, 67], [10, 66], [11, 65], [12, 64], [13, 63], [14, 62], [15, 61], [16, 60], [17, 59], [18, 58], [19, 57], [20, 56], [21, 55], [22, 54], [23, 53], [24, 52], [25, 51], [26, 50], [27, 49], [28, 48], [29, 47], [30, 46], [31, 45], [32, 44], [33, 43], [34, 42], [35, 41], [36, 40], [37, 39], [38, 38], [39, 37], [40, 36], [41, 35], [42, 34], [43, 33], [44, 32], [45, 31], [46, 30], [47, 29], [48, 28], [49, 27], [50, 26], [51, 25], [52, 24], [53, 23], [54, 22], [55, 21], [56, 20], [57, 19], [58, 18], [59, 17], [60, 16], [61, 15], [62, 14], [63, 13], [64, 12], [65, 11], [66, 10], [67, 9], [68, 8], [69, 7], [70, 6], [71, 5], [72, 4], [73, 3], [74, 2], [75, 1]],
    84: [[1, 83], [2, 82], [3, 81], [4, 80], [5, 79], [6, 78], [7, 77], [8, 76], [9, 75], [10, 74], [11, 73], [12, 72], [13, 71], [14, 70], [15, 69], [16, 68], [17, 67], [18, 66], [19, 65], [20, 64], [21, 63], [22, 62], [23, 61], [24, 60], [25, 59], [26, 58], [27, 57], [28, 56], [29, 55], [30, 54], [31, 53], [32, 52], [33, 51], [34, 50], [35, 49], [36, 48], [37, 47], [38, 46], [39, 45], [40, 44], [41, 43], [42, 42], [43, 41], [44, 40], [45, 39], [46, 38], [47, 37], [48, 36], [49, 35], [50, 34], [51, 33], [52, 32], [53, 31], [54, 30], [55, 29], [56, 28], [57, 27], [58, 26], [59, 25], [60, 24], [61, 23], [62, 22], [63, 21], [64, 20], [65, 19], [66, 18], [67, 17], [68, 16], [69, 15], [70, 14], [71, 13], [72, 12], [73, 11], [74, 10], [75, 9], [76, 8], [77, 7], [78, 6], [79, 5], [80, 4], [81, 3], [82, 2], [83, 1]],
    86: [[1, 85], [2, 84], [3, 83], [4, 82], [5, 81], [6, 80], [7, 79], [8, 78], [9, 77], [10, 76], [11, 75], [12, 74], [13, 73], [14, 72], [15, 71], [16, 70], [17, 69], [18, 68], [19, 67], [20, 66], [21, 65], [22, 64], [23, 63], [24, 62], [25, 61], [26, 60], [27, 59], [28, 58], [29, 57], [30, 56], [31, 55], [32, 54], [33, 53], [34, 52], [35, 51], [36, 50], [37, 49], [38, 48], [39, 47], [40, 46], [41, 45], [42, 44], [43, 43], [44, 42], [45, 41], [46, 40], [47, 39], [48, 38], [49, 37], [50, 36], [51, 35], [52, 34], [53, 33], [54, 32], [55, 31], [56, 30], [57, 29], [58, 28], [59, 27], [60, 26], [61, 25], [62, 24], [63, 23], [64, 22], [65, 21], [66, 20], [67, 19], [68, 18], [69, 17], [70, 16], [71, 15], [72, 14], [73, 13], [74, 12], [75, 11], [76, 10], [77, 9], [78, 8], [79, 7], [80, 6], [81, 5], [82, 4], [83, 3], [84, 2], [85, 1]],
    90: [[1, 89], [2, 88], [3, 87], [4, 86], [5, 85], [6, 84], [7, 83], [8, 82], [9, 81], [10, 80], [11, 79], [12, 78], [13, 77], [14, 76], [15, 75], [16, 74], [17, 73], [18, 72], [19, 71], [20, 70], [21, 69], [22, 68], [23, 67], [24, 66], [25, 65], [26, 64], [27, 63], [28, 62], [29, 61], [30, 60], [31, 59], [32, 58], [33, 57], [34, 56], [35, 55], [36, 54], [37, 53], [38, 52], [39, 51], [40, 50], [41, 49], [42, 48], [43, 47], [44, 46], [45, 45], [46, 44], [47, 43], [48, 42], [49, 41], [50, 40], [51, 39], [52, 38], [53, 37], [54, 36], [55, 35], [56, 34], [57, 33], [58, 32], [59, 31], [60, 30], [61, 29], [62, 28], [63, 27], [64, 26], [65, 25], [66, 24], [67, 23], [68, 22], [69, 21], [70, 20], [71, 19], [72, 18], [73, 17], [74, 16], [75, 15], [76, 14], [77, 13], [78, 12], [79, 11], [80, 10], [81, 9], [82, 8], [83, 7], [84, 6], [85, 5], [86, 4], [87, 3], [88, 2], [89, 1]],
    94: [[1, 93], [2, 92], [3, 91], [4, 90], [5, 89], [6, 88], [7, 87], [8, 86], [9, 85], [10, 84], [11, 83], [12, 82], [13, 81], [14, 80], [15, 79], [16, 78], [17, 77], [18, 76], [19, 75], [20, 74], [21, 73], [22, 72], [23, 71], [24, 70], [25, 69], [26, 68], [27, 67], [28, 66], [29, 65], [30, 64], [31, 63], [32, 62], [33, 61], [34, 60], [35, 59], [36, 58], [37, 57], [38, 56], [39, 55], [40, 54], [41, 53], [42, 52], [43, 51], [44, 50], [45, 49], [46, 48], [47, 47], [48, 46], [49, 45], [50, 44], [51, 43], [52, 42], [53, 41], [54, 40], [55, 39], [56, 38], [57, 37], [58, 36], [59, 35], [60, 34], [61, 33], [62, 32], [63, 31], [64, 30], [65, 29], [66, 28], [67, 27], [68, 26], [69, 25], [70, 24], [71, 23], [72, 22], [73, 21], [74, 20], [75, 19], [76, 18], [77, 17], [78, 16], [79, 15], [80, 14], [81, 13], [82, 12], [83, 11], [84, 10], [85, 9], [86, 8], [87, 7], [88, 6], [89, 5], [90, 4], [91, 3], [92, 2], [93, 1]],
    95: [[1, 94], [2, 93], [3, 92], [4, 91], [5, 90], [6, 89], [7, 88], [8, 87], [9, 86], [10, 85], [11, 84], [12, 83], [13, 82], [14, 81], [15, 80], [16, 79], [17, 78], [18, 77], [19, 76], [20, 75], [21, 74], [22, 73], [23, 72], [24, 71], [25, 70], [26, 69], [27, 68], [28, 67], [29, 66], [30, 65], [31, 64], [32, 63], [33, 62], [34, 61], [35, 60], [36, 59], [37, 58], [38, 57], [39, 56], [40, 55], [41, 54], [42, 53], [43, 52], [44, 51], [45, 50], [46, 49], [47, 48], [48, 47], [49, 46], [50, 45], [51, 44], [52, 43], [53, 42], [54, 41], [55, 40], [56, 39], [57, 38], [58, 37], [59, 36], [60, 35], [61, 34], [62, 33], [63, 32], [64, 31], [65, 30], [66, 29], [67, 28], [68, 27], [69, 26], [70, 25], [71, 24], [72, 23], [73, 22], [74, 21], [75, 20], [76, 19], [77, 18], [78, 17], [79, 16], [80, 15], [81, 14], [82, 13], [83, 12], [84, 11], [85, 10], [86, 9], [87, 8], [88, 7], [89, 6], [90, 5], [91, 4], [92, 3], [93, 2], [94, 1]]
  };

  // Exercices de décomposition stratégique (jusqu'à 1000)
  const exercises = [
    { question: 'Décompose 1523', number: 1523, strategy: 'Milliers + Centaines + Dizaines + Unités', correctAnswer: [1000, 500, 20, 3] },
    { question: 'Décompose 2080', number: 2080, strategy: 'Milliers + Dizaines', correctAnswer: [2000, 0, 80, 0] },
    { question: 'Décompose 3600', number: 3600, strategy: 'Milliers + Centaines', correctAnswer: [3000, 600, 0, 0] },
    { question: 'Décompose 4023', number: 4023, strategy: 'Milliers + Dizaines + Unités', correctAnswer: [4000, 0, 20, 3] },
    { question: 'Décompose 5607', number: 5607, strategy: 'Milliers + Centaines + Unités', correctAnswer: [5000, 600, 0, 7] },
    { question: 'Décompose 6090', number: 6090, strategy: 'Milliers + Dizaines', correctAnswer: [6000, 0, 90, 0] },
    { question: 'Décompose 7008', number: 7008, strategy: 'Milliers + Unités', correctAnswer: [7000, 0, 0, 8] },
    { question: 'Décompose 8350', number: 8350, strategy: 'Milliers + Centaines + Dizaines', correctAnswer: [8000, 300, 50, 0] },
    { question: 'Décompose 9082', number: 9082, strategy: 'Milliers + Dizaines + Unités', correctAnswer: [9000, 0, 80, 2] },
    { question: 'Décompose 1765', number: 1765, strategy: 'Milliers + Centaines + Dizaines + Unités', correctAnswer: [1000, 700, 60, 5] }
  ];

  // Fonction pour arrêter toutes les animations et vocaux
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
    setHighlightedNumber(null);
    setShowingProcess(null);
    setDecompositionStep(null);
    setSelectedDecomposition(0);
    setSamSizeExpanded(false);
    
    // Nouveaux états pour la correction animée
    setShowAnimatedCorrection(false);
    setCorrectionStep(null);
    setHighlightNextButton(false);
    setAnimatedObjects([]);
    setCorrectionNumbers(null);
    setCountingIndex(-1);
  };

  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('playAudio appelée avec:', text);
      
      if (stopSignalRef.current) {
        console.log('stopSignalRef.current est true, resolve immédiat');
        resolve();
        return;
      }
      
      // Vérifications de base
      if (!text || text.trim() === '') {
        console.log('Texte vide, resolve immédiat');
        resolve();
        return;
      }

      if (typeof speechSynthesis === 'undefined') {
        console.error('speechSynthesis non disponible');
        reject(new Error('speechSynthesis non disponible'));
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        utterance.lang = 'fr-FR';
        
        console.log('Configuration utterance:', {
          text: utterance.text,
          rate: utterance.rate,
          pitch: utterance.pitch,
          volume: utterance.volume,
          lang: utterance.lang
        });
        
        utterance.onstart = () => {
          console.log('Audio démarré');
        };

      utterance.onend = () => {
          console.log('Audio terminé');
          if (!stopSignalRef.current) {
        currentAudioRef.current = null;
        resolve();
          }
      };

        utterance.onerror = (event) => {
          console.error('Erreur synthèse vocale:', event.error);
          currentAudioRef.current = null;
          
          // Ignorer l'erreur "interrupted" qui est normale quand on arrête l'audio
          if (event.error === 'interrupted' || event.error === 'canceled') {
            console.log('Audio interrompu - comportement normal');
            resolve();
          } else {
            reject(new Error(`Erreur synthèse vocale: ${event.error}`));
          }
        };

      currentAudioRef.current = utterance;
        console.log('speechSynthesis.speak appelée');
      speechSynthesis.speak(utterance);
        
      } catch (error) {
        console.error('Erreur lors de la création de l\'utterance:', error);
        reject(error);
      }
    });
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

  // Fonction pour parser les nombres d'un exercice de décomposition
  const parseExerciseNumbers = (exercise: any, answer1?: string, answer2?: string, answer3?: string) => {
    let num1 = 0, num2 = 0, num3 = 0, result = exercise.number;
    let objectEmoji = '🟡';
    let objectName = 'unités';
    
    // Adapter le vocabulaire selon la stratégie
    if (exercise.strategy === 'Dizaines + Unités') {
      objectEmoji = '🔢';
      objectName = 'unités';
    } else if (exercise.strategy === 'Centaines + Dizaines + Unités') {
      objectEmoji = '🏢';
      objectName = 'unités';
    }
    
    // Si on a des réponses utilisateur, on les utilise
    if (answer1 && answer2) {
      num1 = parseInt(answer1) || 0;
      num2 = parseInt(answer2) || 0;
      if (exercise.strategy === 'Centaines + Dizaines + Unités' && answer3) {
        num3 = parseInt(answer3) || 0;
      }
    } else {
      // Utiliser la réponse correcte selon la stratégie de l'exercice
      if (exercise.correctAnswer) {
        if (exercise.strategy === 'Centaines + Dizaines + Unités') {
          [num1, num2, num3] = exercise.correctAnswer;
        } else {
          [num1, num2] = exercise.correctAnswer;
        }
      } else {
        // Fallback: varie les décompositions pour montrer différentes possibilités
        const decompositions = allDecompositions[result as keyof typeof allDecompositions];
        if (decompositions && decompositions.length > 0) {
          const decompositionIndex = currentExercise % decompositions.length;
          [num1, num2] = decompositions[decompositionIndex];
        }
      }
    }
    
    console.log('Nombres parsés pour décomposition:', { num1, num2, num3, result, objectEmoji, objectName, strategy: exercise.strategy });
    return { num1, num2, num3, result, objectEmoji, objectName, strategy: exercise.strategy };
  };

  // Fonction pour vérifier si une décomposition est correcte
  const isValidDecomposition = (num1: number, num2: number, target: number) => {
    // Vérifier que les nombres sont positifs et que leur somme est correcte
    return num1 > 0 && num2 > 0 && (num1 + num2) === target;
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Fonction utilitaire pour afficher une décomposition à 3 parties
  const renderDecomposition = (parts: number[]) => {
    if (parts.length === 3) {
      // Format: centaines + dizaines + unités
      return `${parts[0]} + ${parts[1]} + ${parts[2]}`;
    } else {
      // Format legacy: 2 parties
      return `${parts[0]} + ${parts[1]}`;
    }
  };

  // Fonction utilitaire pour l'annonce audio des décompositions
  const getAudioDecomposition = (parts: number[]) => {
    if (parts.length === 3) {
      return `${parts[0]} plus ${parts[1]} plus ${parts[2]}`;
    } else {
      return `${parts[0]} plus ${parts[1]}`;
    }
  };

  // Fonction utilitaire pour l'affichage des réponses utilisateur
  const getUserAnswerDisplay = (exercise: any) => {
    if (exercise.strategy === 'Centaines + Dizaines + Unités') {
      return `${userAnswer1} + ${userAnswer2} + ${userAnswer3}`;
    } else {
      return `${userAnswer1} + ${userAnswer2}`;
    }
  };

  // Fonction utilitaire pour calculer la somme des réponses utilisateur
  const getUserAnswerSum = (exercise: any) => {
    if (exercise.strategy === 'Centaines + Dizaines + Unités') {
      return (parseInt(userAnswer1) || 0) + (parseInt(userAnswer2) || 0) + (parseInt(userAnswer3) || 0);
    } else {
      return (parseInt(userAnswer1) || 0) + (parseInt(userAnswer2) || 0);
    }
  };

  // Fonction pour afficher le tableau de décomposition par positions avec animation progressive
  const renderDecompositionTable = (number: number, animationStep: string | null = null) => {
    const hundreds = Math.floor(number / 100);
    const tens = Math.floor((number % 100) / 10);
    const units = number % 10;

    return (
      <div className="flex flex-col items-center space-y-4">
        {/* Nombre initial */}
        {animationStep === 'initial' && (
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border-2 border-purple-300 animate-pulse">
            <div className="text-center">
              <div className="text-lg text-gray-700 mb-2">Nombre à décomposer :</div>
              <div className="text-4xl sm:text-6xl font-bold text-purple-800">{number}</div>
            </div>
          </div>
        )}

        {/* Tableau des positions */}
        {(animationStep === 'table' || animationStep === 'digits' || animationStep === 'multiplications' || animationStep === 'addition') && (
          <div className={`grid grid-cols-4 gap-4 bg-white rounded-lg p-4 shadow-lg border-2 border-purple-300 transition-all duration-1000 ${
            animationStep === 'table' ? 'animate-bounce' : ''
          }`}>
            {/* En-têtes */}
            <div className="text-center bg-purple-100 rounded-lg p-3 transform transition-all duration-1000 hover:scale-105">
              <div className="font-bold text-purple-800 text-sm sm:text-lg">Centaines</div>
            </div>
            <div className="text-center bg-blue-100 rounded-lg p-3 transform transition-all duration-1000 hover:scale-105">
              <div className="font-bold text-blue-800 text-sm sm:text-lg">Dizaines</div>
            </div>
            <div className="text-center bg-green-100 rounded-lg p-3 transform transition-all duration-1000 hover:scale-105">
              <div className="font-bold text-green-800 text-sm sm:text-lg">Unités</div>
            </div>

            {/* Chiffres */}
            {(animationStep === 'digits' || animationStep === 'multiplications' || animationStep === 'addition') && (
              <>
                <div className={`text-center bg-purple-50 rounded-lg p-4 transition-all duration-1000 ${
                  animationStep === 'digits' ? 'ring-4 ring-purple-400 scale-110 animate-pulse' : ''
                }`}>
                  <div className="text-2xl sm:text-4xl font-bold text-purple-700">{hundreds}</div>
                </div>
                <div className={`text-center bg-blue-50 rounded-lg p-4 transition-all duration-1000 ${
                  animationStep === 'digits' ? 'ring-4 ring-blue-400 scale-110 animate-pulse' : ''
                }`}>
                  <div className="text-2xl sm:text-4xl font-bold text-blue-700">{tens}</div>
                </div>
                <div className={`text-center bg-green-50 rounded-lg p-4 transition-all duration-1000 ${
                  animationStep === 'digits' ? 'ring-4 ring-green-400 scale-110 animate-pulse' : ''
                }`}>
                  <div className="text-2xl sm:text-4xl font-bold text-green-700">{units}</div>
                </div>
              </>
            )}

            {/* Multiplications */}
            {(animationStep === 'multiplications' || animationStep === 'addition') && (
              <>
                <div className={`text-center bg-purple-50 rounded-lg p-2 transition-all duration-1000 ${
                  animationStep === 'multiplications' ? 'ring-2 ring-purple-300 scale-105' : ''
                }`}>
                  <div className="text-xs sm:text-sm text-purple-600">× 100</div>
                  <div className="text-sm sm:text-lg font-bold text-purple-800">{hundreds * 100}</div>
                </div>
                <div className={`text-center bg-blue-50 rounded-lg p-2 transition-all duration-1000 ${
                  animationStep === 'multiplications' ? 'ring-2 ring-blue-300 scale-105' : ''
                }`}>
                  <div className="text-xs sm:text-sm text-blue-600">× 10</div>
                  <div className="text-sm sm:text-lg font-bold text-blue-800">{tens * 10}</div>
                </div>
                <div className={`text-center bg-green-50 rounded-lg p-2 transition-all duration-1000 ${
                  animationStep === 'multiplications' ? 'ring-2 ring-green-300 scale-105' : ''
                }`}>
                  <div className="text-xs sm:text-sm text-green-600">× 1</div>
                  <div className="text-sm sm:text-lg font-bold text-green-800">{units * 1}</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Addition finale */}
        {animationStep === 'addition' && (
          <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300 transform transition-all duration-1000 scale-110 ring-4 ring-yellow-400 animate-pulse">
            <div className="text-center">
              <div className="text-sm sm:text-lg text-gray-700 mb-2">Addition finale :</div>
              <div className="text-lg sm:text-2xl font-bold text-gray-800">
                {hundreds * 100} + {tens * 10} + {units * 1} = {number}
              </div>
            </div>
          </div>
        )}

        {/* Version statique sans animation */}
        {!animationStep && (
          <>
            <div className="grid grid-cols-4 gap-4 bg-white rounded-lg p-4 shadow-lg border-2 border-purple-300">
              {/* En-têtes */}
              <div className="text-center bg-red-100 rounded-lg p-3">
                <div className="font-bold text-red-800 text-sm sm:text-lg">Milliers</div>
              </div>
              <div className="text-center bg-green-100 rounded-lg p-3">
                <div className="font-bold text-green-800 text-sm sm:text-lg">Centaines</div>
              </div>
              <div className="text-center bg-blue-100 rounded-lg p-3">
                <div className="font-bold text-blue-800 text-sm sm:text-lg">Dizaines</div>
              </div>
              <div className="text-center bg-purple-100 rounded-lg p-3">
                <div className="font-bold text-purple-800 text-sm sm:text-lg">Unités</div>
              </div>

              {/* Chiffres */}
              <div className="text-center bg-purple-50 rounded-lg p-4">
                <div className="text-2xl sm:text-4xl font-bold text-purple-700">{hundreds}</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <div className="text-2xl sm:text-4xl font-bold text-blue-700">{tens}</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <div className="text-2xl sm:text-4xl font-bold text-green-700">{units}</div>
              </div>

              {/* Multiplications */}
              <div className="text-center bg-purple-50 rounded-lg p-2">
                <div className="text-xs sm:text-sm text-purple-600">× 100</div>
                <div className="text-sm sm:text-lg font-bold text-purple-800">{hundreds * 100}</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-2">
                <div className="text-xs sm:text-sm text-blue-600">× 10</div>
                <div className="text-sm sm:text-lg font-bold text-blue-800">{tens * 10}</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-2">
                <div className="text-xs sm:text-sm text-green-600">× 1</div>
                <div className="text-sm sm:text-lg font-bold text-green-800">{units * 1}</div>
              </div>
            </div>

            {/* Addition finale */}
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
              <div className="text-center">
                <div className="text-sm sm:text-lg text-gray-700 mb-2">Addition :</div>
                <div className="text-lg sm:text-2xl font-bold text-gray-800">
                  {hundreds * 100} + {tens * 10} + {units * 1} = {number}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Fonction pour rendre les objets avec animations (adaptée pour grands nombres)
  const renderCircles = (count: number, item: string, isHighlighted = false, hideCalculations = false) => {
    if (count <= 0) return null;
    
    // Pour les grands nombres (> 20), afficher une représentation numérique
    if (count > 20) {
      // Calculer les groupes de 10 et les unités restantes
      const tens = Math.floor(count / 10);
      const units = count % 10;
      
      return (
        <div className="flex flex-col gap-2 justify-center items-center">
          {/* Affichage numérique principal */}
          <div className={`text-3xl sm:text-6xl font-bold text-center transition-all duration-500 ${
            isHighlighted ? 'animate-pulse scale-125 text-yellow-600' : 'text-purple-600'
          }`}>
            {count}
          </div>
          
          {/* Représentation visuelle avec barres pour les dizaines */}
          <div className="flex flex-col gap-1 items-center">
            {tens > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {!hideCalculations && (
                  <span className="text-xs sm:text-sm text-gray-600">
                    {tens} × 10 = {tens * 10}
                  </span>
                )}
                {[...Array(Math.min(tens, 6))].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-2 sm:w-12 sm:h-3 bg-blue-400 rounded-full"
                  />
                ))}
                {tens > 6 && <span className="text-sm text-gray-500">...</span>}
              </div>
            )}
            
            {units > 0 && (
              <div className="flex gap-1 justify-center">
                {!hideCalculations && (
                  <span className="text-xs sm:text-sm text-gray-600">
                    + {units}
                  </span>
                )}
                {[...Array(units)].map((_, i) => (
                  <span key={i} className="text-sm sm:text-lg">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Pour les petits nombres (≤ 20), afficher les objets individuellement
    const circles = [];
    for (let i = 0; i < count; i++) {
      circles.push(
        <span
          key={i}
          className={`text-lg sm:text-4xl inline-block transition-all duration-500 ${
            isHighlighted ? 'animate-bounce scale-125' : ''
          }`}
          style={{ 
            animationDelay: `${i * 100}ms`
          }}
        >
          {item}
        </span>
      );
    }
    
    // Grouper les objets par lignes (9 max sur mobile, 12 sur desktop)
    const maxPerRow = isMobile ? 9 : 12;
    const rows = [];
    for (let i = 0; i < circles.length; i += maxPerRow) {
      rows.push(circles.slice(i, i + maxPerRow));
    }
    
    return (
      <div className="flex flex-col gap-0.5 sm:gap-2 justify-center items-center">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-0.5 sm:gap-2 justify-center items-center">
            {row}
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);
    
    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à décomposer les nombres !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Décomposer, c'est séparer un nombre en plusieurs parties qui s'additionnent !");
      if (stopSignalRef.current) return;
      
      // 2. Explication du concept avec animations
      await wait(1800);
      setHighlightedElement('concept-section');
      // Scroll vers la zone de concept pour bien voir l'opération
      scrollToSection('concept-section');
      await wait(800);
      
      await playAudio("Regardons ensemble comment décomposer les grands nombres avec la stratégie principale !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setCurrentExample(0);
      setAnimatingStep('introduction');
      const example = decompositionExamples[0]; // 47 = 40 + 7 (Dizaines + Unités)
      
      // 1. Présentation du nombre initial
      setTableAnimationStep('initial');
      await playAudio(`D'abord, voici ${example.description} que nous allons décomposer.`);
      if (stopSignalRef.current) return;
      
      // 2. Apparition du tableau
      await wait(1800);
      setTableAnimationStep('table');
      await playAudio("Maintenant, je vais utiliser le tableau de décomposition ! Centaines, dizaines et unités !");
      if (stopSignalRef.current) return;
      
      // 3. Placement des chiffres
      await wait(2000);
      setTableAnimationStep('digits');
      const hundreds = Math.floor(example.number / 100);
      const tens = Math.floor((example.number % 100) / 10);
      const units = example.number % 10;
      await playAudio(`Je place chaque chiffre dans sa colonne ! ${example.number}, c'est ${hundreds || 0} centaine, ${tens} dizaines et ${units} unités !`);
      if (stopSignalRef.current) return;
      
      // 4. Affichage des multiplications
      await wait(2200);
      setTableAnimationStep('multiplications');
      await playAudio("Maintenant, je multiplie par la valeur de chaque position ! Centaines fois 100, dizaines fois 10, unités fois 1 !");
      if (stopSignalRef.current) return;
      
      // 5. Addition finale
      await wait(2400);
      setTableAnimationStep('addition');
      
      // Scroll vers la zone de concept pour bien voir la séparation
      scrollToSection('concept-section');
      await wait(800);
      
      await playAudio(`Et voilà ! ${hundreds * 100} plus ${tens * 10} plus ${units * 1} égale ${example.number} ! C'est une décomposition réussie !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setShowingProcess('grouping');
      await playAudio("C'est la stratégie principale : centaines, dizaines et unités !");
      if (stopSignalRef.current) return;
      
      await wait(1800);
      setDecompositionStep('result');
      setShowingProcess('result');
      
      // Scroll vers la zone de résultat pour bien voir la décomposition finale
      const resultSection = document.querySelector('[class*="bg-green"]') || 
                            document.getElementById('concept-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(800);
      }
      
                              await playAudio(`${getAudioDecomposition(example.parts)} égale ${example.number} ! C'est une décomposition !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`En mathématiques, on écrit : ${example.number} = ${renderDecomposition(example.parts)} !`);
      if (stopSignalRef.current) return;
      
      // 3. Présentation des autres exemples
      await wait(2500);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setDecompositionStep(null);
      setCurrentExample(null);
      setHighlightedElement(null);
                              await playAudio("Excellent ! Maintenant tu comprends ce qu'est une décomposition !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Maintenant, passons aux nombres à 3 chiffres avec les centaines !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      // Montrer un exemple avec centaines (146 = 100 + 40 + 6)
      setCurrentExample(2); // Index 2 = 146 = 100 + 40 + 6
      const centainesExample = decompositionExamples[2];
      setTableAnimationStep('initial');
      
      await playAudio(`Par exemple, ${centainesExample.number} peut se décomposer avec centaines, dizaines et unités !`);
      if (stopSignalRef.current) return;
      
      await wait(1800);
      setTableAnimationStep('table');
      await playAudio("Je place le nombre dans le tableau : centaines, dizaines, unités !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setTableAnimationStep('digits');
      await playAudio(`${centainesExample.number} : 1 centaine, 4 dizaines, 6 unités !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setTableAnimationStep('multiplications');
      await playAudio("Je multiplie : 1 fois 100, 4 fois 10, 6 fois 1 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setTableAnimationStep('addition');
      await playAudio(`${centainesExample.number} = ${renderDecomposition(centainesExample.parts)} !`);
      if (stopSignalRef.current) return;
      
      await wait(1800);
      setDecompositionStep(null);
      setHighlightedNumber(null);
      setCurrentExample(null);
      
      await playAudio("Maintenant tu connais les 2 stratégies principales !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('examples-section');
      scrollToSection('examples-section');
      await playAudio("Regarde ! Tu peux essayer avec d'autres nombres !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Clique sur les exemples pour voir d'autres décompositions !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      
      // Scroll vers l'onglet exercices et l'illuminer
      const exercisesTab = document.getElementById('exercises-tab');
      
      if (exercisesTab) {
        exercisesTab.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
        
        // Illuminer l'onglet exercices
        setHighlightedElement('exercises-tab');
        await playAudio("Tu peux ensuite faire les exercices pour t'entraîner. Amuse-toi bien, par les diamants !");
        if (stopSignalRef.current) return;
        
        await wait(1500);
      }

      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setDecompositionStep(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour expliquer un exemple spécifique avec animation du tableau
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const example = decompositionExamples[index];
    
    try {
      setCurrentExample(index);
      setTableAnimationStep('initial');
      scrollToSection('concept-section');
      
      await playAudio(`Je vais te montrer comment décomposer ${example.description} avec la stratégie "${example.strategy}".`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      
      // Étape 1: Afficher le tableau
      setTableAnimationStep('table');
      await playAudio(`D'abord, je trace mon tableau centaines, dizaines, unités.`);
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Étape 2: Afficher les chiffres
      setTableAnimationStep('digits');
      await playAudio(`Je place les chiffres du nombre ${example.number} dans le tableau.`);
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Étape 3: Afficher les multiplications
      setTableAnimationStep('multiplications');
      if (example.strategy === 'Centaines + Dizaines + Unités') {
        await playAudio(`Maintenant, je calcule : centaines fois 100, dizaines fois 10, et unités fois 1.`);
      } else {
        await playAudio(`Maintenant, je calcule : dizaines fois 10, et unités fois 1.`);
      }
      if (stopSignalRef.current) return;
      await wait(2500);
      
      // Étape 4: Afficher l'addition finale
      setTableAnimationStep('addition');
      await playAudio(`Et j'obtiens la décomposition complète : ${getAudioDecomposition(example.parts)} égale ${example.number} !`);
      if (stopSignalRef.current) return;
      
      await wait(3000);
      
      // Réinitialiser
      setTableAnimationStep(null);
      setCurrentExample(null);
    } finally {
      setTableAnimationStep(null);
      setCurrentExample(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour afficher une correction simple avec la formule
  const createAnimatedCorrection = async (exercise: any, answer1?: string, answer2?: string, answer3?: string) => {
    if (stopSignalRef.current) return;
    
    // Afficher la correction simple
    setShowAnimatedCorrection(true);
    
    // Scroller pour voir la correction
    setTimeout(() => {
      const correctionElement = document.getElementById('animated-correction');
      if (correctionElement) {
        correctionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
    
    // Explication vocale simple
    await playAudio(`Voici la correction pour décomposer ${exercise.number}.`);
    if (stopSignalRef.current) return;
    
    await wait(2000);
    
    // Fermer la correction après quelques secondes
    setTimeout(() => {
      setShowAnimatedCorrection(false);
    }, 4000);
  };


  // Fonction pour féliciter avec audio pour les bonnes réponses
  const celebrateCorrectAnswer = async () => {
    if (stopSignalRef.current) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    try {
      const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      await playAudio(randomCompliment + " !");
      if (stopSignalRef.current) return;
      
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
      
      // Lancer l'animation de correction pour décompositions avec les réponses utilisateur si incorrectes
      if (isCorrect === false && userAnswer1 && userAnswer2) {
        await createAnimatedCorrection(exercise, userAnswer1, userAnswer2, userAnswer3);
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

    // Fonction pour valider la décomposition saisie
  const handleValidateAnswer = async () => {
    const exercise = exercises[currentExercise];
    
    // Vérifier les champs selon la stratégie
    if (exercise.strategy === 'Centaines + Dizaines + Unités') {
      if (!userAnswer1.trim() || !userAnswer2.trim() || !userAnswer3.trim()) {
        return; // Ne pas valider si les champs sont vides pour les nombres à 3 chiffres
      }
    } else {
      if (!userAnswer1.trim() || !userAnswer2.trim()) {
        return; // Ne pas valider si les champs sont vides pour les nombres à 2 chiffres
      }
    }

    const num1 = parseInt(userAnswer1);
    const num2 = parseInt(userAnswer2);
    const num3 = exercise.strategy === 'Centaines + Dizaines + Unités' ? parseInt(userAnswer3) : 0;
    const target = exercise.number;
    
    // Vérifier si les nombres sont valides
    if (isNaN(num1) || isNaN(num2) || (exercise.strategy === 'Centaines + Dizaines + Unités' && isNaN(num3))) {
      return; // Ne pas valider si ce ne sont pas des nombres
    }

    // Vérifier la décomposition selon la stratégie attendue
    let correct = false;
    if (exercise.strategy === 'Dizaines + Unités') {
      // Pour la stratégie dizaines + unités, accepter toute décomposition utilisant des multiples de 10
      // ou la décomposition canonique dizaines + unités
      const isValidSum = (num1 + num2) === target;
      const usesMultipleOf10 = (num1 % 10 === 0) || (num2 % 10 === 0);
      correct = isValidSum && usesMultipleOf10;
    } else if (exercise.strategy === 'Centaines + Dizaines + Unités') {
      // Pour les nombres à 3 chiffres, vérifier la décomposition canonique
      const isValidSum = (num1 + num2 + num3) === target;
      const isCanonical = (num1 % 100 === 0) && (num2 % 10 === 0);
      correct = isValidSum && isCanonical;
    } else {
      // Fallback : vérifier simplement que la somme est correcte
      correct = isValidDecomposition(num1, num2, target);
    }
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });

      // Célébrer avec Sam
      celebrateCorrectAnswer();
      
      // Passage automatique après célébration
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer1('');
          setUserAnswer2('');
          setUserAnswer3('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + 1;
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    } else if (!correct) {
      // Expliquer l'erreur avec Sam en utilisant les réponses de l'utilisateur
      await explainWrongAnswer();
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    
    // Réinitialiser les états de correction seulement au passage à l'exercice suivant
    setShowAnimatedCorrection(false);
    setCorrectionStep(null);
    setHighlightNextButton(false);
    setAnimatedObjects([]);
    setCorrectionNumbers(null);
    setCountingIndex(-1);
    
    // Réactiver les fonctions audio après un court délai
    setTimeout(() => {
      stopSignalRef.current = false;
    }, 100);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer1('');
      setUserAnswer2('');
      setUserAnswer3('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    setUserAnswer1('');
    setUserAnswer2('');
    setUserAnswer3('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setPirateIntroStarted(false);
    setCorrectionNumbers(null);
    setCountingIndex(-1);
    
    // Réactiver les fonctions audio après un court délai
    setTimeout(() => {
      stopSignalRef.current = false;
    }, 100);
  };

  // Fonction pour l'introduction vocale de Sam le Pirate
  const startPirateIntro = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    const isReplay = pirateIntroStarted;
    setPirateIntroStarted(true);
    
    try {
      if (isReplay) {
        // Messages pour rejouer l'intro
        await playAudio("Eh bien, par les creepers ! Tu veux que je répète mes instructions ?");
        if (stopSignalRef.current) return;
        
        await wait(1000);
        if (stopSignalRef.current) return;
        
        await playAudio("Très bien mineur ! Rappel des consignes !");
        if (stopSignalRef.current) return;
      } else {
        // Messages pour la première fois
        await playAudio("Bonjour, faisons quelques exercices de décomposition, par les blocs de diamant !");
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
      await playAudio("Écris les deux nombres dans les cases pour faire la décomposition, puis clique sur vérifier");
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
        await playAudio("En avant pour l'aventure des décompositions !");
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

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Champion des décompositions !", message: "Tu maîtrises parfaitement les décompositions !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les décompositions !", emoji: "📚" };
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements de visibilité de la page et navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page cachée - arrêt du vocal');
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      console.log('Avant déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      console.log('Navigation back/forward - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page masquée - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleUnload = () => {
      console.log('Déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleHashChange = () => {
      console.log('Changement de hash - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleBlur = () => {
      console.log('Perte de focus fenêtre - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    // Event listeners standard
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);

    // Override des méthodes history pour détecter navigation programmatique
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('Navigation programmatique pushState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      console.log('Navigation programmatique replaceState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Effet pour initialiser speechSynthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof speechSynthesis !== 'undefined') {
      console.log('Initialisation de speechSynthesis');
      
      // Forcer le chargement des voix
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        console.log('Voix disponibles:', voices.length);
        console.log('Voix françaises:', voices.filter(voice => voice.lang.startsWith('fr')));
      };
      
      // Les voix peuvent être chargées de manière asynchrone
      if (speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      // Test simple de synthèse vocale
      console.log('Test speechSynthesis...');
      try {
        const testUtterance = new SpeechSynthesisUtterance('');
        testUtterance.volume = 0; // Silencieux pour le test
        speechSynthesis.speak(testUtterance);
        speechSynthesis.cancel(); // Annuler immédiatement
        console.log('speechSynthesis fonctionne');
      } catch (error) {
        console.error('Erreur lors du test speechSynthesis:', error);
      }
    } else {
      console.error('speechSynthesis non disponible dans ce navigateur');
    }
  }, []);

  // Effet pour gérer les changements de visibilité de la page et navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page cachée - arrêt du vocal');
        stopAllVocalsAndAnimations();
      }
    };
    
    const handleBeforeUnload = () => {
      console.log('Avant déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };
    
    const handlePopState = () => {
      console.log('Navigation back/forward - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page masquée - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleUnload = () => {
      console.log('Déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleHashChange = () => {
      console.log('Changement de hash - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleBlur = () => {
      // Sur mobile, on ignore les événements blur car ils sont trop fréquents
      if (isMobile) {
        console.log('Événement blur ignoré sur mobile');
        return;
      }
      console.log('Perte de focus fenêtre - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    // Event listeners standard
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);

    // Override des méthodes history pour détecter navigation programmatique
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('Navigation programmatique pushState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      console.log('Navigation programmatique replaceState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [isMobile]);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
    // Réactiver les fonctions quand on passe aux exercices
    if (showExercises) {
      setTimeout(() => {
        stopSignalRef.current = false;
      }, 100);
    }
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

  // Composant JSX pour le bouton "Écouter l'énoncé" - Toujours actif
  const ListenQuestionButtonJSX = () => {
    // Toujours actif sauf pendant la lecture
    const isButtonDisabled = isPlayingEnonce;

    return (
      <div className="mb-2 sm:mb-6">
        <button
          id="listen-question-button"
          onClick={startExerciseExplanation}
          disabled={isButtonDisabled}
          className={`${
            isPlayingEnonce 
              ? 'bg-blue-600 text-white animate-pulse' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } px-2 sm:px-6 py-1 sm:py-3 rounded-lg font-bold text-xs sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 mx-auto shadow-lg ${
            highlightedElement === 'listen-question-button' ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse scale-110 shadow-2xl bg-blue-600' : ''
          }`}
        >
          <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span>🎧 Écouter l'énoncé</span>
        </button>
      </div>
    );
  };

  // JSX pour l'introduction de Sam le Pirate dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-0 sm:p-1 mt-0 sm:mt-2">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Image de Sam le Pirate */}
        <div 
          id="sam-pirate"
          className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border-1 sm:border-2 border-purple-200 shadow-md transition-all duration-300 ${
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
            <div className="absolute -top-1 -right-1 bg-purple-500 text-white p-1 sm:p-2 rounded-full animate-bounce shadow-lg">
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
              ? 'px-2 sm:px-8 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 hover:scale-105 shadow-lg border-1 sm:border-2 border-purple-300'
              : 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-2 sm:border-4 border-yellow-300'
        } ${!isPlayingVocal && !pirateIntroStarted ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''} ${pirateIntroStarted && !isPlayingVocal ? 'ring-2 ring-purple-300 ring-opacity-75' : ''}`}
        style={{
          animationDuration: !isPlayingVocal && !pirateIntroStarted ? '1.5s' : '2s',
          animationIterationCount: isPlayingVocal ? 'none' : 'infinite',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          boxShadow: !isPlayingVocal && !pirateIntroStarted 
            ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
            : pirateIntroStarted && !isPlayingVocal
              ? '0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(147,51,234,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
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
              /* Particules de replay - violettes */
              <>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
              </>
            )}
          </>
        )}
      </button>
      </div>
    </div>
  );

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
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
            href="/chapitre/ce2-nombres-jusqu-10000" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux nombres jusqu'à 10000</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🔢 Décomposition des nombres jusqu'à 10000 - CE2
            </h1>
          </div>
        </div>

        {/* Navigation entre cours et exercices - MOBILE OPTIMISÉE */}
        <div className={`flex justify-center ${showExercises ? 'mb-2 sm:mb-6' : 'mb-8'}`}>
          <div className="bg-white rounded-lg p-0.5 sm:p-1 shadow-md flex">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[68px] flex items-center justify-center ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              id="exercises-tab"
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[68px] flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${
                highlightedElement === 'exercises-tab' ? 'ring-4 ring-green-400 bg-green-100 animate-pulse scale-110 shadow-2xl' : ''
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs sm:text-sm opacity-90">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-2 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-purple-300 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 ${
                isAnimationRunning
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-12 sm:w-20 h-12 sm:h-20' // Initial - plus petit sur mobile
                }`}>
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full rounded-full object-cover"
                  />
                {/* Megaphone animé quand il parle */}
                  {isAnimationRunning && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </div>
                  )}
                </div>
                
              {/* Bouton Démarrer */}
              <div className="text-center">
                <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 sm:px-12 py-2 sm:py-6 rounded-xl font-bold text-sm sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isAnimationRunning ? 'opacity-75 cursor-not-allowed' : 'hover:from-purple-600 hover:to-blue-600'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
              >
                  <Play className="inline w-4 h-4 sm:w-8 sm:h-8 mr-1 sm:mr-4" />
                  {isAnimationRunning ? '⏳ JE PARLE...' : '🧩 DÉMARRER'}
                </button>
                </div>
              </div>

            {/* Explication du concept avec animation intégrée */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🤔 Qu'est-ce que décomposer un nombre ?
                </h2>
                {/* Icône d'animation pour le concept */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-blue-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-blue-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🤔 Animation du concept ! Cliquez pour entendre Sam expliquer la décomposition."
                  onClick={async () => {
                    if (!isAnimationRunning) {
                      explainChapter();
                    }
                  }}
                >
                  🧩
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-sm sm:text-lg text-center text-purple-800 font-semibold mb-3 sm:mb-6">
                  Décomposer un nombre, c'est le séparer en plusieurs parties qui s'additionnent !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-2 sm:mb-4">
                      {currentExample !== null ? 
                        `Exemple : ${decompositionExamples[currentExample].number} = ${renderDecomposition(decompositionExamples[currentExample].parts)}` 
                        : 'Exemple : 47 = 40 + 7'
                      }
                </div>
              </div>

                  {/* Animation intégrée dans le concept */}
                  {currentExample !== null ? (
                    <div className="space-y-6">
                      {/* Indicateur d'étape */}
                      {animatingStep && (
                        <div className="p-3 rounded-lg bg-blue-100 border-l-4 border-blue-500 text-center">
                          <div className="text-sm sm:text-lg font-bold text-blue-800">
                            {animatingStep === 'introduction' && '🎯 Regardons ensemble...'}
                  </div>
                  </div>
                      )}
                      
                      {/* Nombre complet */}
                      {decompositionStep === 'number' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-500 bg-yellow-100 ring-4 ring-yellow-400 scale-105`}>
                          <h4 className="text-lg sm:text-2xl font-bold text-yellow-800 mb-2 sm:mb-4">
                            Nombre complet : {decompositionExamples[currentExample].number}
                          </h4>
                          <div className="mb-4">
                            {renderCircles(decompositionExamples[currentExample].number, decompositionExamples[currentExample].item, highlightedNumber === decompositionExamples[currentExample].number)}
                  </div>
                          <div className={`text-lg sm:text-xl font-bold transition-all duration-500 ${
                            highlightedNumber === decompositionExamples[currentExample].number ? 'text-yellow-600 scale-125 animate-pulse' : 'text-yellow-800'
                          }`}>
                            {decompositionExamples[currentExample].number} objets en tout
                </div>
              </div>
                      )}

                      {/* Décomposition en parties */}
                      {decompositionStep === 'parts' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Premier groupe */}
                          <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                            showingProcess === 'separating' ? 'ring-4 ring-purple-400 bg-purple-100 scale-105' : 'bg-purple-50'
                          }`}>
                            <h4 className="text-sm sm:text-lg font-bold text-purple-800 mb-2 sm:mb-4">
                              Première partie
                            </h4>
                            <div className="mb-4">
                              {renderCircles(decompositionExamples[currentExample].parts[0], decompositionExamples[currentExample].item)}
                            </div>
                            <div className="text-lg sm:text-xl font-bold text-purple-800">
                              {decompositionExamples[currentExample].parts[0]}
              </div>
            </div>

                          {/* Symbole + */}
                          <div className="text-center flex items-center justify-center">
                            <div className={`text-4xl sm:text-8xl font-bold transition-all duration-500 ${
                              showingProcess === 'grouping' ? 'text-green-500 animate-bounce scale-125 ring-4 ring-yellow-400 bg-yellow-100 rounded-full p-4 shadow-2xl' : 'text-gray-400'
                            }`}>
                              +
                        </div>
                      </div>
                      
                          {/* Deuxième groupe */}
                          <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                            showingProcess === 'separating' ? 'ring-4 ring-pink-400 bg-pink-100 scale-105' : 'bg-pink-50'
                          }`}>
                            <h4 className="text-sm sm:text-lg font-bold text-pink-800 mb-2 sm:mb-4">
                              Deuxième partie
                            </h4>
                            <div className="mb-4">
                              {renderCircles(decompositionExamples[currentExample].parts[1], decompositionExamples[currentExample].item)}
                      </div>
                            <div className="text-lg sm:text-xl font-bold text-pink-800">
                              {decompositionExamples[currentExample].parts[1]}
                        </div>
                        </div>
                      </div>
                      )}
                      
                      {/* Animation du tableau de décomposition */}
                      {currentExample !== null && tableAnimationStep && (
                        <div className="text-center p-6 rounded-lg transition-all duration-1000 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300">
                          <div className="mb-6">
                            {renderDecompositionTable(decompositionExamples[currentExample].number, tableAnimationStep || 'initial')}
                          </div>
                        </div>
                      )}
                  </div>
                  ) : (
                    /* Version statique quand pas d'animation */
                    <div className="mb-6">
                      {renderDecompositionTable(47, null)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🌟 Autres exemples de décomposition
                </h2>
                {/* Icône d'animation pour les exemples */}
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-purple-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-purple-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🌟 Animation des exemples ! Cliquez sur les cartes pour voir Sam expliquer chaque décomposition."
                  onClick={async () => {
                    if (!isAnimationRunning) {
                      explainSpecificExample(0); // Commencer par le premier exemple
                    }
                  }}
                >
                  🌟
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {decompositionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                <div className="text-center">
                      <div className="text-lg sm:text-3xl mb-2">{example.item}</div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {example.number} = {renderDecomposition(example.parts)}
                  </div>
                      <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-1">
                        📋 {example.strategy}
                  </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {example.explanation}
                  </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animation du tableau pour les exemples sélectionnés */}
            {currentExample !== null && tableAnimationStep && (
              <div className="mt-6 mb-6">
                <div className="text-center p-6 rounded-lg transition-all duration-1000 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300">
                  <h3 className="text-lg sm:text-2xl font-bold mb-4 text-green-800">
                    🎯 Animation de décomposition - {decompositionExamples[currentExample].item}
                  </h3>
                  <div className="mb-6">
                    {renderDecompositionTable(decompositionExamples[currentExample].number, tableAnimationStep || 'initial')}
                  </div>
                </div>
              </div>
            )}

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl p-3 sm:p-6 text-white">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-xl font-bold text-white">
                  🎯 Stratégies pour les grands nombres
                </h3>
                {/* Icône d'animation pour les conseils */}
                <div className="bg-white/20 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-white/30 hover:shadow-xl hover:ring-4 hover:ring-white/40 backdrop-blur-sm"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="💡 Animation des conseils ! Cliquez pour entendre Sam donner ses astuces pour décomposer."
                  onClick={async () => {
                    if (!isAnimationRunning) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      stopSignalRef.current = false;
                      setIsPlayingVocal(true);
                      setSamSizeExpanded(true);
                      
                      try {
                        await playAudio("Voici les 2 stratégies principales pour décomposer les grands nombres jusqu'à 100 !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1200));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("Première stratégie : Dizaines plus unités ! C'est la plus importante ! Par exemple, 47 égale 40 plus 7 !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1800));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("Deuxième stratégie : Les centaines ! Par exemple, 146 égale 100 plus 40 plus 6 !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("Ces deux stratégies te permettront de décomposer tous les nombres jusqu'à 1000 !");
                        if (stopSignalRef.current) return;
                        
                      } catch (error) {
                        console.error('Erreur:', error);
                      } finally {
                        setIsPlayingVocal(false);
                        setSamSizeExpanded(false);
                      }
                    }
                  }}
                >
                  💡
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center max-w-2xl mx-auto">
                <div>
                  <div className="text-3xl sm:text-4xl mb-3">🔢</div>
                  <div className="font-bold text-lg">Dizaines + Unités</div>
                  <div className="text-sm mt-2">47 = 40 + 7</div>
                  <div className="text-xs text-gray-600 mt-1">La stratégie principale</div>
            </div>
                <div>
                  <div className="text-3xl sm:text-4xl mb-3">🏢</div>
                  <div className="font-bold text-lg">Centaines</div>
                  <div className="text-sm mt-2">146 = 100 + 40 + 6</div>
                  <div className="text-xs text-gray-600 mt-1">Nombres à 3 chiffres</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ */
          <div className="pb-12 sm:pb-0">
            {/* Introduction de Sam le Pirate - toujours visible */}
            <div className="mb-6 sm:mb-4 mt-4">
              {SamPirateIntroJSX()}
            </div>

            {/* Header exercices - caché sur mobile */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-8 hidden sm:block">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
                </h2>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-bold text-purple-600">
                    Score : {score}/{exercises.length}
                  </div>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              </div>
              
            {/* Indicateur de progression mobile - sticky sur la page */}
            <div className="sticky top-2 bg-white z-10 px-2 py-2 border-b border-gray-200 sm:hidden mb-6 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                <span className="font-bold text-purple-600">Score : {score}/{exercises.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2 mt-1">
                <div 
                  className="bg-purple-500 h-1 sm:h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question - AVEC BOUTON ÉCOUTER */}
            <div className="bg-white rounded-xl shadow-lg text-center p-3 sm:p-6 md:p-8 mt-4 sm:mt-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1 sm:mb-6 md:mb-8 gap-2 sm:gap-4">
                <div className="flex-1">
                  <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
                  {exercises[currentExercise]?.question || "Question..."}
              </h3>
                  <p className="text-xs sm:text-sm text-purple-600 font-semibold mt-1">
                    💡 Utilise la technique : {exercises[currentExercise]?.strategy}
                  </p>
                </div>
                {ListenQuestionButtonJSX()}
              </div>
              

              
              {/* Affichage du nombre à décomposer */}
              <div className="bg-purple-50 rounded-lg p-2 sm:p-6 mb-2 sm:mb-8">
                <div className="text-2xl sm:text-6xl font-bold text-purple-600 mb-2 sm:mb-4">
                  {exercises[currentExercise].number}
                    </div>
                <p className="text-sm sm:text-lg text-gray-700 font-semibold">
                  Sépare ce nombre en deux parties !
                </p>
              </div>
              
                            {/* Zone de réponse - Saisie libre pour décomposition */}
              <div 
                id="answer-zone" 
                className={`${highlightedElement === 'answer-zone' ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse rounded-xl p-4 bg-yellow-50' : ''} transition-all duration-300 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-8`}
              >
                <div className="text-center mb-4">
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Complète la décomposition :
                  </p>
                  
                  {/* Équation de décomposition avec champs de saisie (2 ou 3 champs selon le nombre) */}
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6 flex-wrap">
                    <input
                      type="number"
                      value={userAnswer1}
                      onChange={(e) => setUserAnswer1(e.target.value)}
                      disabled={isCorrect !== null || isPlayingVocal}
                      min="1"
                      className="w-12 sm:w-16 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="?"
                    />
                    
                    <span className="text-xl sm:text-3xl font-bold text-purple-600">+</span>
                    
                    <input
                      type="number"
                      value={userAnswer2}
                      onChange={(e) => setUserAnswer2(e.target.value)}
                      disabled={isCorrect !== null || isPlayingVocal}
                      min="0"
                      className="w-12 sm:w-16 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="?"
                    />
                    
                    {/* 3ème champ pour les nombres à 3 chiffres */}
                    {exercises[currentExercise].strategy === 'Centaines + Dizaines + Unités' && (
                      <>
                        <span className="text-xl sm:text-3xl font-bold text-purple-600">+</span>
                        <input
                          type="number"
                          value={userAnswer3}
                          onChange={(e) => setUserAnswer3(e.target.value)}
                          disabled={isCorrect !== null || isPlayingVocal}
                          min="0"
                          max="9"
                          className="w-12 sm:w-16 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="?"
                        />
                      </>
                    )}
                    
                    <span className="text-xl sm:text-3xl font-bold text-purple-600">=</span>
                    
                    <div className="w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-purple-100 border-2 border-purple-300 rounded-lg text-purple-600">
                      {exercises[currentExercise].number}
                    </div>
                  </div>
                  
                  {/* Bouton pour valider */}
                  <button
                    onClick={handleValidateAnswer}
                    disabled={isCorrect !== null || isPlayingVocal || !userAnswer1.trim() || !userAnswer2.trim() || (exercises[currentExercise].strategy === 'Centaines + Dizaines + Unités' && !userAnswer3.trim())}
                    className="bg-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[48px] shadow-lg"
                  >
                    ✅ Vérifier ma décomposition
                  </button>
                </div>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-2 sm:p-4 md:p-6 rounded-lg mb-3 sm:mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                    {isCorrect ? (
                      <>
                        <span className="text-base sm:text-xl md:text-2xl">✅</span>
                        <span className="font-bold text-xs sm:text-base md:text-xl">
                          Excellent ! {getUserAnswerDisplay(exercises[currentExercise])} est bien une décomposition de {exercises[currentExercise].number} !
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-base sm:text-xl md:text-2xl">❌</span>
                        <span className="font-bold text-xs sm:text-sm md:text-xl">
                          {getUserAnswerSum(exercises[currentExercise]) !== exercises[currentExercise].number 
                            ? `${getUserAnswerDisplay(exercises[currentExercise])} = ${getUserAnswerSum(exercises[currentExercise])}, mais nous voulons ${exercises[currentExercise].number}. Je vais t'expliquer !`
                            : 'Pas tout à fait... Je vais t\'expliquer !'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Correction simple avec formule */}
              {showAnimatedCorrection && (
                <div 
                  id="animated-correction"
                  className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 sm:p-6 mb-4 border-2 border-green-300 shadow-lg"
                >
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4">
                      💡 Correction
                    </h3>
                    
                    {/* Affichage de la formule simple */}
                    <div className="bg-white rounded-lg p-4 shadow-inner">
                      {/* Ligne du haut : multiplications */}
                      <div className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                        {exercises[currentExercise].strategy === 'Centaines + Dizaines + Unités' ? (
                          <>
                            {Math.floor(exercises[currentExercise].number / 100)} × 100 + {Math.floor((exercises[currentExercise].number % 100) / 10)} × 10 + {exercises[currentExercise].number % 10} × 1
                          </>
                        ) : (
                          <>
                            {Math.floor(exercises[currentExercise].number / 10)} × 10 + {exercises[currentExercise].number % 10} × 1
                          </>
                        )}
                      </div>
                      
                      {/* Ligne du bas : résultat */}
                      <div className="text-base sm:text-lg font-bold text-purple-600">
                        {exercises[currentExercise].strategy === 'Centaines + Dizaines + Unités' ? (
                          <>
                            {Math.floor(exercises[currentExercise].number / 100) * 100} + {Math.floor((exercises[currentExercise].number % 100) / 10) * 10} + {exercises[currentExercise].number % 10} = {exercises[currentExercise].number}
                          </>
                        ) : (
                          <>
                            {Math.floor(exercises[currentExercise].number / 10) * 10} + {exercises[currentExercise].number % 10} = {exercises[currentExercise].number}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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
                    <div className="bg-purple-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-2xl sm:text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les décompositions t'aident à mieux comprendre les nombres !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors"
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