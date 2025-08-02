'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye, RotateCcw } from 'lucide-react';

export default function AdditionsJusqua100() {
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
  const [correctionStep, setCorrectionStep] = useState<'numbers' | 'adding' | 'counting' | 'result' | 'complete' | 'carry-step' | 'final-sum' | null>(null);
  const [highlightNextButton, setHighlightNextButton] = useState(false);

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

  // Expressions de pirate aléatoires pour chaque exercice
  const pirateExpressions = [
    "Mille sabords", "Tonnerre de Brest", "Sacré matelot", "Par Neptune", "Sang de pirate",
    "Mille millions de mille sabords", "Ventrebleu", "Sapristi", "Morbleu", "Fichtre"
  ];

  // Compliments aléatoires pour les bonnes réponses
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", 
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire",
    "Très bien", "C'est ça", "Tu as trouvé", "Bien joué", "Félicitations",
    "Tu es un champion", "Quelle belle réussite", "Continue comme ça", 
    "Tu progresses bien", "C'est exact", "Impeccable", "Remarquable"
  ];

  // Données des techniques d'addition avec animations
  const additionTechniques = [
    {
      id: 'sans-retenue',
      title: 'Addition sans retenue',
      icon: '✨',
      description: 'La technique la plus simple : on additionne directement',
      examples: [
        { 
          calculation: '23 + 45', 
          num1: 23, 
          num2: 45, 
          result: 68,
          steps: [
            'On place les nombres en colonnes, alignés par dizaines et unités',
            'On additionne les unités : 3 + 5 = 8',
            'On additionne les dizaines : 2 + 4 = 6',
            'Le résultat est 68 !'
          ]
        },
        { 
          calculation: '31 + 12', 
          num1: 31, 
          num2: 12, 
          result: 43,
          steps: [
            'On aligne les nombres en colonnes, dizaines et unités',
            'Unités : 1 + 2 = 3',
            'Dizaines : 3 + 1 = 4',
            'Résultat : 43 !'
          ]
        }
      ]
    },
    {
      id: 'avec-retenue',
      title: 'Addition avec retenue',
      icon: '🔄',
      description: 'Quand ça dépasse 10, on fait une retenue magique !',
      examples: [
        { 
          calculation: '37 + 28', 
          num1: 37, 
          num2: 28, 
          result: 65,
          steps: [
            'On place les nombres l\'un sous l\'autre',
            'Unités : 7 + 8 = 15, j\'écris 5 et je retiens 1',
            'Dizaines : 3 + 2 + 1 (retenue) = 6',
            'Le résultat est 65 !'
          ]
        },
        { 
          calculation: '49 + 27', 
          num1: 49, 
          num2: 27, 
          result: 76,
          steps: [
            'On aligne les nombres en colonnes soigneusement',
            'Unités : 9 + 7 = 16, j\'écris 6 et retiens 1',
            'Dizaines : 4 + 2 + 1 = 7',
            'Résultat : 76 !'
          ]
        }
      ]
    },
    {
      id: 'calcul-mental',
      title: 'Calcul mental rapide',
      icon: '🧠',
      description: 'Des astuces pour calculer très vite dans sa tête !',
      examples: [
        { 
          calculation: '35 + 24', 
          num1: 35, 
          num2: 24, 
          result: 59,
          steps: [
            'Je décompose : 35 + 24',
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
            'Technique maligne : 42 + 36',
            'Dizaines d\'abord : 40 + 30 = 70',
            'Unités ensuite : 2 + 6 = 8',
            'Total : 70 + 8 = 78 !'
          ]
        }
      ]
    },
    {
      id: 'complement-10',
      title: 'Technique du complément à 10',
      icon: '🎯',
      description: 'Utiliser les compléments pour faciliter le calcul',
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
            '30 + 5 = 35 ! C\'est magique !'
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
        }
      ]
    }
  ];

  // Exercices sur les additions jusqu'à 100 - saisie libre
  const exercises = [
    { question: 'Calcule 23 + 45', firstNumber: 23, secondNumber: 45, correctAnswer: 68, type: 'sans-retenue', hint: 'Additionne d\'abord les unités : 3 + 5, puis les dizaines : 2 + 4' },
    { question: 'Calcule 41 + 37', firstNumber: 41, secondNumber: 37, correctAnswer: 78, type: 'avec-retenue', hint: '1 + 7 = 8, puis 4 + 3 = 7, donc 78' },
    { question: 'Calcule 36 + 28', firstNumber: 36, secondNumber: 28, correctAnswer: 64, type: 'avec-retenue', hint: '6 + 8 = 14, écris 4 et retiens 1' },
    { question: 'Calcule 52 + 33', firstNumber: 52, secondNumber: 33, correctAnswer: 85, type: 'sans-retenue', hint: '2 + 3 = 5, puis 5 + 3 = 8' },
    { question: 'Calcule 47 + 26', firstNumber: 47, secondNumber: 26, correctAnswer: 73, type: 'avec-retenue', hint: '7 + 6 = 13, écris 3 et retiens 1' },
    { question: 'Calcule 34 + 25', firstNumber: 34, secondNumber: 25, correctAnswer: 59, type: 'sans-retenue', hint: 'Technique simple : 4 + 5 = 9, puis 3 + 2 = 5' },
    { question: 'Calcule 58 + 19', firstNumber: 58, secondNumber: 19, correctAnswer: 77, type: 'avec-retenue', hint: '8 + 9 = 17, écris 7 et retiens 1' },
    { question: 'Calcule 62 + 24', firstNumber: 62, secondNumber: 24, correctAnswer: 86, type: 'sans-retenue', hint: 'Addition simple : 2 + 4 = 6, puis 6 + 2 = 8' },
    { question: 'Calcule 39 + 45', firstNumber: 39, secondNumber: 45, correctAnswer: 84, type: 'avec-retenue', hint: '9 + 5 = 14, écris 4 et retiens 1' },
    { question: 'Calcule 56 + 32', firstNumber: 56, secondNumber: 32, correctAnswer: 88, type: 'sans-retenue', hint: 'Dernière addition : 6 + 2 = 8, puis 5 + 3 = 8' }
  ];

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
      
      // Étape 4: Calcul des unités avec retenue
      const unitsSum = (first % 10) + (second % 10);
      await playAudio(`${first % 10} plus ${second % 10} égale ${unitsSum}. Comme c'est plus que 9, j'écris ${unitsSum % 10} et je retiens 1 !`);
      if (stopSignalRef.current) return;
      await wait(3000);
      
      // Étape 5: Montrer la retenue
      await playAudio(`Regardez ! J'écris 1 au-dessus des dizaines pour me rappeler de l'ajouter.`);
      if (stopSignalRef.current) return;
      await wait(2500);
      
      // Étape 6: Focus sur les dizaines
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
      await playAudio("Je vais te montrer 4 techniques extraordinaires pour additionner facilement tous les nombres jusqu'à 100 !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Première technique : sans retenue
      setAnimatingStep('sans-retenue');
      await playAudio("Première technique : l'addition sans retenue ! C'est la plus simple et tu vas l'adorer !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Deuxième technique : avec retenue
      setAnimatingStep('avec-retenue');
      await playAudio("Deuxième technique : l'addition avec retenue ! C'est magique, quand ça dépasse 10, on fait une retenue !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Troisième technique : calcul mental
      setAnimatingStep('calcul-mental');
      await playAudio("Troisième technique : le calcul mental rapide ! Pour impressionner tout le monde avec ta vitesse !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Quatrième technique : complément à 10
      setAnimatingStep('complement-10');
      await playAudio("Quatrième technique : le complément à 10 ! Une astuce de champion pour calculer super vite !");
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
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      // Phrases d'encouragement supplémentaires variées
      const encouragements = [
        "Tu maîtrises bien les additions jusqu'à 100 !",
        "Tu es doué en calcul !",
        "Les mathématiques n'ont plus de secret pour toi !",
        "Tu deviens un vrai expert !",
        "Quel talent pour les nombres !",
        "Tu as l'œil pour les bonnes réponses !",
        "Tu progresses à grands pas !"
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      await playAudio(randomEncouragement);
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
      const pirateExpression = pirateExpressions[currentExercise % pirateExpressions.length];
      await playAudio(pirateExpression + " !");
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
        await playAudio("Eh bien, nom d'un sabre ! Tu veux que je répète mes instructions ?");
        if (stopSignalRef.current) return;
        
        await wait(1000);
        if (stopSignalRef.current) return;
        
        await playAudio("Très bien moussaillon ! Rappel des consignes !");
        if (stopSignalRef.current) return;
      } else {
        await playAudio("Bonjour, faisons quelques exercices d'additions jusqu'à 100 nom d'une jambe en bois !");
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
      setAnsweredCorrectly(prev => new Set([...Array.from(prev), currentExercise]));
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
      // Féliciter l'utilisateur
      await celebrateCorrectAnswer();
      
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
      }, 1500);
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-additions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              💯 Additions jusqu'à 100
            </h1>
            <p className="text-lg text-gray-800">
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
          /* Section Cours */
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            <div className="text-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-xl hover:scale-105 animate-pulse'
                }`}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Les additions jusqu'à 100</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Félicitations ! Tu vas apprendre les techniques pour additionner tous les nombres jusqu'à 100. 
                C'est un cours très important qui va te rendre super fort en mathématiques !
              </p>
            </div>

            {/* Les 4 techniques */}
            <div 
              id="techniques-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'techniques' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4 techniques extraordinaires</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'sans-retenue' ? 'bg-green-100 ring-2 ring-green-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-bold text-green-800">Sans retenue</h4>
                  <p className="text-sm text-green-700">La plus simple !</p>
                </div>
                
                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'avec-retenue' ? 'bg-orange-100 ring-2 ring-orange-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-bold text-orange-800">Avec retenue</h4>
                  <p className="text-sm text-orange-700">La magique !</p>
                </div>

                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'calcul-mental' ? 'bg-purple-100 ring-2 ring-purple-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-bold text-purple-800">Calcul mental</h4>
                  <p className="text-sm text-purple-700">La rapide !</p>
                </div>

                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'complement-10' ? 'bg-blue-100 ring-2 ring-blue-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold text-blue-800">Complément à 10</h4>
                  <p className="text-sm text-blue-700">L'astucieuse !</p>
                </div>
              </div>
            </div>

            {/* Exemples de techniques */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 Choisis ta technique préférée !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionTechniques.map((technique, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentTechnique === technique.id ? 'ring-4 ring-blue-400 bg-blue-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainTechnique(index)}
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
                        src="/image/pirate-small.png" 
                        alt="Sam le Pirate" 
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

            {/* Header exercices - caché sur mobile */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-8 hidden sm:block">
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
              {/* Question et bouton lecture */}
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
                  {exercises[currentExercise].question}
                </h3>
                
                {/* Badge du type */}
                <div className="flex justify-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    exercises[currentExercise].type === 'sans-retenue' ? 'bg-green-100 text-green-800' :
                    exercises[currentExercise].type === 'avec-retenue' ? 'bg-orange-100 text-orange-800' :
                    exercises[currentExercise].type === 'calcul-mental' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {exercises[currentExercise].type === 'sans-retenue' ? '✨ Sans retenue' :
                     exercises[currentExercise].type === 'avec-retenue' ? '🔄 Avec retenue' :
                     exercises[currentExercise].type === 'calcul-mental' ? '🧠 Calcul mental' :
                     '🎯 Technique spéciale'}
                  </span>
                </div>

                {/* Bouton écouter l'énoncé */}
                <button
                  id="listen-question-button"
                  onClick={startExerciseExplanation}
                  disabled={isPlayingEnonce}
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                    isPlayingEnonce 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : highlightedElement === 'listen-question-button'
                        ? 'bg-yellow-500 text-white ring-4 ring-yellow-300 animate-pulse scale-105'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  {isPlayingEnonce ? '🎤 Écoute...' : '🎧 Écouter l\'énoncé'}
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
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">
                          Excellent ! {exercises[currentExercise].firstNumber} + {exercises[currentExercise].secondNumber} = {exercises[currentExercise].correctAnswer} !
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
                          {(correctionStep === 'carry-step' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
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
                    {(correctionStep === 'adding' || correctionStep === 'carry-step' || correctionStep === 'final-sum' || correctionStep === 'complete') && (
                      <div className="flex justify-center py-3">
                        <div className="w-6 sm:w-8"></div>
                        
                        {/* Chiffre des dizaines */}
                        <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                          (correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                            : 'text-gray-300'
                        }`}>
                          {(correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? Math.floor(correctionNumbers.result / 10) 
                            : '?'}
                        </div>
                        
                        {/* Chiffre des unités */}
                        <div className={`w-12 sm:w-16 text-xl sm:text-3xl font-bold text-center transition-all ${
                          (correctionStep === 'adding' || correctionStep === 'carry-step' || correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                            : 'text-gray-300'
                        }`}>
                          {(correctionStep === 'adding' || correctionStep === 'carry-step' || correctionStep === 'final-sum' || correctionStep === 'complete')
                            ? correctionNumbers.result % 10
                            : '?'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Explications textuelles selon l'étape */}
                  <div className="text-center">
                    {correctionStep === 'numbers' && (
                      <p className="text-sm sm:text-lg text-blue-700 font-semibold">
                        Je place les nombres en colonnes : dizaines sous dizaines, unités sous unités
                      </p>
                    )}
                    
                    {correctionStep === 'carry-step' && (
                      <div className="space-y-2">
                        <p className="text-sm sm:text-lg text-orange-700 font-semibold">
                          🔄 Addition avec retenue !
                        </p>
                        <p className="text-xs sm:text-base text-orange-600">
                          Les unités ({correctionNumbers.first % 10} + {correctionNumbers.second % 10} = {(correctionNumbers.first % 10) + (correctionNumbers.second % 10)}) dépassent 9
                        </p>
                      </div>
                    )}
                    
                    {correctionStep === 'adding' && (
                      <p className="text-sm sm:text-lg text-blue-700 font-semibold">
                        Addition simple : pas de retenue nécessaire !
                      </p>
                    )}
                    
                    {correctionStep === 'final-sum' && (
                      <p className="text-sm sm:text-lg text-green-700 font-semibold">
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