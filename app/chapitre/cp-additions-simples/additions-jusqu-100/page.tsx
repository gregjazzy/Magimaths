'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye, RotateCcw, Play } from 'lucide-react';

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
  const [correctionStep, setCorrectionStep] = useState<'numbers' | 'adding' | 'counting' | 'result' | 'complete' | 'carry-step' | 'decomposition' | 'final-sum' | null>(null);
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
    },
    {
      id: 'bond-10',
      title: 'Compter par bond de 10',
      icon: '🦘',
      description: 'Sauter de 10 en 10 pour additionner rapidement !',
      examples: [
        { 
          calculation: '23 + 40', 
          num1: 23, 
          num2: 40, 
          result: 63,
          steps: [
            'Je regarde 40 : combien de dizaines ? 4 dizaines !',
            'Chaque dizaine = 1 saut de 10',
            'Je pars de 23 et je fais 4 sauts de 10',
            '1er saut : 23 + 10 = 33',
            '2ème saut : 33 + 10 = 43', 
            '3ème saut : 43 + 10 = 53',
            '4ème saut : 53 + 10 = 63',
            'Résultat : 63 ! 4 dizaines = 4 sauts !'
          ]
        },
        { 
          calculation: '35 + 30', 
          num1: 35, 
          num2: 30, 
          result: 65,
          steps: [
            'Je regarde 30 : combien de dizaines ? 3 dizaines !',
            'Chaque dizaine = 1 saut de 10',
            'Je pars de 35 et je fais 3 sauts de 10',
            '1er saut : 35 + 10 = 45',
            '2ème saut : 45 + 10 = 55',
            '3ème saut : 55 + 10 = 65',
            'Résultat : 65 ! 3 dizaines = 3 sauts !'
          ]
        }
      ]
    }
  ];

  // Exercices sur les additions jusqu'à 100 - techniques mélangées dans l'ordre
  const exercises = [
    // Exercice 1 - Bond de 10
    { 
      question: 'Calcule 18 + 20', 
      num1: 18, 
      num2: 20, 
      correctAnswer: 38,
      type: 'bond-10',
      explanation: 'Bond de 10 : 2 dizaines = 2 sauts de 10'
    },
    // Exercice 2 - Sans retenue
    { 
      question: 'Calcule 14 + 21', 
      num1: 14, 
      num2: 21, 
      correctAnswer: 35,
      type: 'sans-retenue',
      explanation: 'Addition simple sans retenue'
    },
    // Exercice 3 - Complément à 10
    { 
      question: 'Calcule 34 + 9', 
      num1: 34, 
      num2: 9, 
      correctAnswer: 43,
      type: 'complement-10',
      explanation: 'Complément à 10 : 34 + 6 = 40, puis 40 + 3 = 43'
    },
    // Exercice 4 - Calcul mental
    { 
      question: 'Calcule 26 + 32', 
      num1: 26, 
      num2: 32, 
      correctAnswer: 58,
      type: 'calcul-mental',
      explanation: 'Calcul mental rapide'
    },
    // Exercice 5 - Sans retenue
    { 
      question: 'Calcule 42 + 15', 
      num1: 42, 
      num2: 15, 
      correctAnswer: 57,
      type: 'sans-retenue',
      explanation: 'Addition simple sans retenue'
    },
    // Exercice 6 - Bond de 10
    { 
      question: 'Calcule 37 + 50', 
      num1: 37, 
      num2: 50, 
      correctAnswer: 87,
      type: 'bond-10',
      explanation: 'Bond de 10 : 5 dizaines = 5 sauts de 10'
    },
    // Exercice 7 - Calcul mental
    { 
      question: 'Calcule 43 + 25', 
      num1: 43, 
      num2: 25, 
      correctAnswer: 68,
      type: 'calcul-mental',
      explanation: 'Calcul mental rapide'
    },
    // Exercice 8 - Complément à 10
    { 
      question: 'Calcule 48 + 7', 
      num1: 48, 
      num2: 7, 
      correctAnswer: 55,
      type: 'complement-10',
      explanation: 'Complément à 10 : 48 + 2 = 50, puis 50 + 5 = 55'
    },
    // Exercice 9 - Sans retenue
    { 
      question: 'Calcule 26 + 13', 
      num1: 26, 
      num2: 13, 
      correctAnswer: 39,
      type: 'sans-retenue',
      explanation: 'Addition simple sans retenue'
    },
    // Exercice 10 - Bond de 10
    { 
      question: 'Calcule 29 + 30', 
      num1: 29, 
      num2: 30, 
      correctAnswer: 59,
      type: 'bond-10',
      explanation: 'Bond de 10 : 3 dizaines = 3 sauts de 10'
    },
    // Exercice 11 - Calcul mental
    { 
      question: 'Calcule 37 + 41', 
      num1: 37, 
      num2: 41, 
      correctAnswer: 78,
      type: 'calcul-mental',
      explanation: 'Calcul mental rapide'
    },
    // Exercice 12 - Sans retenue
    { 
      question: 'Calcule 32 + 25', 
      num1: 32, 
      num2: 25, 
      correctAnswer: 57,
      type: 'sans-retenue',
      explanation: 'Addition simple sans retenue'
    },
    // Exercice 13 - Complément à 10
    { 
      question: 'Calcule 63 + 8', 
      num1: 63, 
      num2: 8, 
      correctAnswer: 71,
      type: 'complement-10',
      explanation: 'Complément à 10 : 63 + 7 = 70, puis 70 + 1 = 71'
    },
    // Exercice 14 - Bond de 10
    { 
      question: 'Calcule 44 + 10', 
      num1: 44, 
      num2: 10, 
      correctAnswer: 54,
      type: 'bond-10',
      explanation: 'Bond de 10 : 1 dizaine = 1 saut de 10'
    },
    // Exercice 15 - Calcul mental
    { 
      question: 'Calcule 28 + 31', 
      num1: 28, 
      num2: 31, 
      correctAnswer: 59,
      type: 'calcul-mental',
      explanation: 'Calcul mental rapide'
    }
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

    // Nettoyer tous les styles inline ajoutés par les animations
    try {
      const elementsWithIds = document.querySelectorAll('[id]');
      elementsWithIds.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.cssText = '';
        }
      });
      console.log('🧹 Styles inline nettoyés');
    } catch (error) {
      console.warn('Erreur lors du nettoyage des styles:', error);
    }
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

  // Fonction pour faire défiler vers une section avec animation améliorée
  const scrollToSection = (elementId: string, highlight: boolean = true) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Scroll fluide vers l'élément
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest' 
      });
      
      if (highlight) {
        // Sauvegarder le style original
        const originalStyle = element.style.cssText;
        const originalClasses = element.className;
        
        // Animation de surbrillance avec style inline
        element.style.cssText = `
          ${originalStyle}
          box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.6), 0 0 20px rgba(251, 191, 36, 0.4);
          transform: scale(1.02);
          transition: all 0.5s ease;
          border-radius: 12px;
          background: linear-gradient(45deg, rgba(251, 191, 36, 0.1), rgba(59, 130, 246, 0.1));
        `;
        
        // Retirer l'animation après 3 secondes
        setTimeout(() => {
          element.style.cssText = originalStyle;
          element.className = originalClasses;
        }, 3000);
      }
    }
  };

  // Fonction pour scroller vers le bouton Suivant avec animation
  const scrollToNextButton = () => {
    if (nextButtonRef.current) {
      nextButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
      
      // Animation de pulsation pour attirer l'attention
      nextButtonRef.current.classList.add('animate-pulse', 'ring-4', 'ring-green-400', 'ring-opacity-75');
      
      setTimeout(() => {
        if (nextButtonRef.current) {
          nextButtonRef.current.classList.remove('animate-pulse', 'ring-4', 'ring-green-400', 'ring-opacity-75');
        }
      }, 4000);
    }
  };

  // Fonction pour animer un bouton spécifique avec style inline
  const animateButton = (buttonId: string, duration: number = 3000) => {
    const button = document.getElementById(buttonId);
    if (button) {
      // Sauvegarder le style original
      const originalStyle = button.style.cssText;
      const originalClasses = button.className;
      
      // Appliquer l'animation avec style inline pour garantir la visibilité
      button.style.cssText = `
        ${originalStyle}
        animation: pulse 1s infinite;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
        transform: scale(1.05);
        transition: all 0.3s ease;
        border: 2px solid #3B82F6;
      `;
      
      // Ajouter aussi les classes pour double sécurité
      button.classList.add('animate-pulse', 'ring-4', 'ring-blue-400', 'ring-opacity-75');
      
      setTimeout(() => {
        // Restaurer le style original
        button.style.cssText = originalStyle;
        button.className = originalClasses;
      }, duration);
    }
  };



  // Fonction pour parser les nombres d'un exercice d'addition
  const parseAdditionNumbers = (exercise: any) => {
    return {
      first: exercise.num1,
      second: exercise.num2,
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
      
      await playAudio("Tu vas découvrir 4 techniques extraordinaires pour calculer avec de gros nombres, nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      await playAudio("L'addition sans retenue, compter par bond de 10, le calcul mental rapide, et le complément à 10 !");
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
      // Introduction avec animation améliorée
      setHighlightedElement('intro');
      scrollToSection('intro-section', true);
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les additions jusqu'à 100 ! C'est un cours très important qui va te rendre super fort en calcul !");
      await wait(1000);

      if (stopSignalRef.current) return;

      // Les techniques avec animation des boutons
      setHighlightedElement('techniques');
      scrollToSection('techniques-section', true);
      await playAudio("Je vais te montrer 4 techniques extraordinaires pour additionner facilement tous les nombres jusqu'à 100 !");
      await wait(1000);
      
      if (stopSignalRef.current) return;
      
      // Animation des boutons de technique un par un avec scroll et surbrillance
      const techniqueData = [
        { id: 'technique-sans-retenue', step: 'sans-retenue', name: 'Addition sans retenue' },
        { id: 'technique-avec-retenue', step: 'bond-10', name: 'Bond de 10' },
        { id: 'technique-decomposition', step: 'calcul-mental', name: 'Calcul mental' },
        { id: 'technique-complement', step: 'complement-10', name: 'Complément à 10' }
      ];
      
      for (let i = 0; i < techniqueData.length; i++) {
        if (stopSignalRef.current) return;
        
        const technique = techniqueData[i];
        
        // Scroll vers la technique et animation
        scrollToSection(technique.id, true);
        await wait(500);
        
        // Animation de l'étape
        setAnimatingStep(technique.step);
        animateButton(technique.id, 3000);
        
        await playAudio(`${technique.name} !`);
        await wait(1500);
        
        // Nettoyer l'animation
        setAnimatingStep(null);
      }

      if (stopSignalRef.current) return;

      // Transition vers les exemples avec animation
      setHighlightedElement('examples');
      scrollToSection('examples-section', true);
      await playAudio("Maintenant, essaie ces techniques avec les exemples ci-dessous en cliquant sur 'Voir l'animation' !");
      await wait(1000);
      
      if (stopSignalRef.current) return;
      
      // Animation des boutons "Voir l'animation" un par un
      for (let i = 0; i < additionTechniques.length; i++) {
        if (stopSignalRef.current) return;
        animateButton(`animation-button-${i}`, 2000);
        await wait(500);
      }
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Animation du bouton "Commencer les exercices"
      animateButton('start-exercises-btn', 3000);
      await playAudio("Quand tu es prêt, clique sur le bouton 'Commencer les exercices' pour t'entraîner !");
      await wait(1000);

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
      } else if (technique.id === 'bond-10') {
        await animateBond10(example);
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
      // Compliment initial avec expression de pirate
      const pirateExpression = pirateExpressions[Math.floor(Math.random() * pirateExpressions.length)];
      const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      await playAudio(`${pirateExpression} ! ${randomCompliment} !`);
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
      
      // Lancer l'animation de correction adaptée selon la technique de l'exercice
      const techniqueType = exercise.type;
      
      // Créer un objet compatible avec les fonctions d'animation existantes
      const animationExample = {
        calculation: `${exercise.num1} + ${exercise.num2}`,
        num1: exercise.num1,
        num2: exercise.num2,
        result: exercise.correctAnswer
      };

      await playAudio(`Je vais t'expliquer avec la technique ${techniqueType === 'sans-retenue' ? 'sans retenue' : 
                       techniqueType === 'bond-10' ? 'du bond de 10' :
                       techniqueType === 'calcul-mental' ? 'de calcul mental' :
                       'du complément à 10'} !`);
      await wait(1500);
      if (stopSignalRef.current) return;

      // Appeler la fonction d'animation appropriée selon le type
      if (techniqueType === 'sans-retenue') {
        await animateSansRetenue(animationExample);
      } else if (techniqueType === 'bond-10') {
        await animateBond10(animationExample);
      } else if (techniqueType === 'calcul-mental') {
        await animateCalculMental(animationExample);
      } else if (techniqueType === 'complement-10') {
        await animateComplement10(animationExample);
      } else {
        // Par défaut, utiliser l'animation de correction existante
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


  // Animation pour technique bond de 10
  const animateBond10 = async (example: any) => {
    // Étape 1 : Présentation du problème
    setCalculationStep('setup');
    await playAudio(`Calculons ${example.calculation} avec la technique du bond de 10 !`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 2 : Analyser le deuxième nombre pour compter les dizaines
    setCalculationStep('show-second');
    const dizaines = Math.floor(example.num2 / 10);
    await playAudio(`D'abord, je regarde ${example.num2}. Combien de dizaines ? ${dizaines} dizaines !`);
    await wait(2000);

    if (stopSignalRef.current) return;

    // Étape 3 : Expliquer la règle 
    setCalculationStep('explain-strategy');
    await playAudio(`Chaque dizaine égale un saut de 10. Donc ${dizaines} dizaines égale ${dizaines} sauts de 10 !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 4 : Commencer les sauts
    setCalculationStep('show-first');
    await playAudio(`Je pars de ${example.num1} et je vais faire ${dizaines} sauts de 10.`);
    await wait(2000);

    if (stopSignalRef.current) return;

    // Étapes des sauts individuels
    let currentValue = example.num1;
    for (let i = 1; i <= dizaines; i++) {
      if (stopSignalRef.current) return;
      
      setCalculationStep('units');
      const nextValue = currentValue + 10;
      await playAudio(`${i}${i === 1 ? 'er' : 'ème'} saut : ${currentValue} plus 10 égale ${nextValue} !`);
      await wait(1800);
      
      currentValue = nextValue;
    }

    if (stopSignalRef.current) return;

    // Étape finale : Résultat
    setCalculationStep('result');
    await playAudio(`Et voilà ! Après ${dizaines} sauts de 10, j'arrive à ${example.result} !`);
    await wait(2000);

    if (stopSignalRef.current) return;

    await playAudio(`${example.num1} plus ${example.num2} égale ${example.result} ! ${dizaines} dizaines égale ${dizaines} sauts de 10 !`);
    await wait(2500);
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
      
      // Scroll vers la zone d'exercice et animation du bouton "Écouter l'énoncé"
      scrollToSection('exercise-area', true);
      await wait(800);
      
      // Mettre en surbrillance et animer le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      animateButton('listen-question-button', 3000);
      await playAudio("Pour écouter l'énoncé de l'exercice, clique sur ce bouton bleu !");
      if (stopSignalRef.current) return;
      await wait(1500);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      // Scroll et animation de la zone de réponse
      scrollToSection('answer-zone', true);
      await wait(500);
      setHighlightedElement('answer-zone');
      animateButton('answer-input', 3000);
      await playAudio("Écris ta réponse dans cette case, puis clique sur le bouton Valider !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      animateButton('validate-btn', 3000);
      await playAudio("N'oublie pas de cliquer sur Valider quand tu as fini !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement(null);
      if (stopSignalRef.current) return;
      
      // Scroll vers Sam et animation
      scrollToSection('sam-pirate-section', true);
      await wait(500);
      setHighlightedElement('sam-pirate');
      await playAudio("Si tu te trompes, ne t'inquiète pas ! Je t'expliquerai la bonne méthode étape par étape !");
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

  // Fonction pour valider une réponse d'addition - accepte toute réponse correcte
  const isValidAddition = (userAnswer: string, exercise: any) => {
    const userNum = parseInt(userAnswer.trim());
    // Vérifier si c'est un nombre valide
    if (isNaN(userNum)) return false;
    // Vérifier si le résultat est correct (peu importe la méthode utilisée)
    return userNum === exercise.correctAnswer;
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
      
      {/* Bouton Stop flottant - visible quand Sam parle ou pendant les animations */}
      {(isPlayingVocal || isAnimationRunning) && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 shadow-lg transition-all duration-200 flex items-center space-x-2 animate-pulse"
            title="Arrêter l'animation"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
              {!imageError ? (
                <img
                  src="/image/pirate-small.png"
                  alt="Sam le Pirate"
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-red-500 text-sm font-bold">🏴‍☠️</span>
              )}
            </div>
            <span className="font-semibold text-sm">Stop ||</span>
          </button>
        </div>
      )}
      
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
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              💯 Additions jusqu'à 100
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
            id="start-exercises-btn"
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
                    src="/images/pirate-small.png"
                    alt="Sam le Pirate"
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
                onClick={explainChapter}
                disabled={isPlayingVocal || isAnimationRunning}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-lg transition-all ${
                  isPlayingVocal || isAnimationRunning
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
                } ${!hasStarted && !isPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingVocal || isAnimationRunning ? 'Sam explique...' : 'DÉMARRER'}
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

            {/* Les 4 techniques */}
            <div 
              id="techniques-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-300 ${
                highlightedElement === 'techniques' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-1 sm:p-2 bg-indigo-100 rounded-lg">
                  <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">4 techniques extraordinaires</h2>
                {/* Icône d'animation pour les techniques */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-indigo-300" 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🧠
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  id="technique-sans-retenue"
                  className={`p-4 rounded-lg text-center transition-all duration-500 ${
                    animatingStep === 'sans-retenue' ? 'bg-green-100 ring-2 ring-green-400 scale-105' : 'bg-gray-100'
                  }`}
                >
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-bold text-green-800">Sans retenue</h4>
                  <p className="text-sm text-green-700">La plus simple !</p>
                </div>
                
                <div 
                  id="technique-avec-retenue"
                  className={`p-4 rounded-lg text-center transition-all duration-500 ${
                    animatingStep === 'bond-10' ? 'bg-orange-100 ring-2 ring-orange-400 scale-105' : 'bg-gray-100'
                  }`}
                >
                  <div className="text-3xl mb-2">🦘</div>
                  <h4 className="font-bold text-orange-800">Bond de 10</h4>
                  <p className="text-sm text-orange-700">La sauteuse !</p>
                </div>

                <div 
                  id="technique-decomposition"
                  className={`p-4 rounded-lg text-center transition-all duration-500 ${
                    animatingStep === 'calcul-mental' ? 'bg-purple-100 ring-2 ring-purple-400 scale-105' : 'bg-gray-100'
                  }`}
                >
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-bold text-purple-800">Calcul mental</h4>
                  <p className="text-sm text-purple-700">La rapide !</p>
                </div>

                <div 
                  id="technique-complement"
                  className={`p-4 rounded-lg text-center transition-all duration-500 ${
                    animatingStep === 'complement-10' ? 'bg-blue-100 ring-2 ring-blue-400 scale-105' : 'bg-gray-100'
                  }`}
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold text-blue-800">Complément à 10</h4>
                  <p className="text-sm text-blue-700">L'astucieuse !</p>
                </div>
              </div>
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
                    id={`example-technique-${index}`}
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
                      <button 
                        id={`animation-button-${index}`}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors shadow-md ${
                          isAnimationRunning 
                            ? 'bg-gray-400 text-gray-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
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

                          {/* Animation pour bond de 10 */}
                          {currentTechnique === 'bond-10' && calculationStep && (
                            <div className="space-y-6 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200">
                              
                              {/* Étape : Introduction */}
                              {calculationStep === 'setup' && (
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-purple-800 animate-pulse">
                                    {example.calculation}
                                  </div>
                                  <div className="text-lg text-purple-600 mt-2">
                                    🦘 Technique du bond de 10 - Sautons ensemble !
                                  </div>
                                </div>
                              )}

                              {/* Étape : Montrer le deuxième nombre et compter les dizaines */}
                              {(calculationStep === 'show-second' || calculationStep === 'explain-strategy' || calculationStep === 'show-first' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-gray-800">🦘 Analysons les dizaines !</div>
                                  </div>
                                  
                                  {/* Affichage du deuxième nombre avec dizaines */}
                                  <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-purple-700 mb-2">
                                      {example.num2}
                                    </div>
                                    <div className="flex justify-center items-center space-x-2 mb-3">
                                      {/* Représentation visuelle des dizaines */}
                                      {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => (
                                        <div key={i} className="relative">
                                          <div className="w-12 h-16 bg-purple-500 border-2 border-purple-700 rounded flex items-center justify-center text-white font-bold text-sm animate-pulse" 
                                               style={{animationDelay: `${i * 0.3}s`}}>
                                            10
                                          </div>
                                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center text-xs font-bold text-purple-800">
                                            🦘
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-xl font-bold text-purple-700">
                                      {Math.floor(example.num2 / 10)} dizaines = {Math.floor(example.num2 / 10)} sauts de 10 !
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Étape : Montrer le premier nombre */}
                              {(calculationStep === 'show-first' || calculationStep === 'units' || calculationStep === 'result') && (
                                <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-400">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-800 mb-3">
                                      🏁 Point de départ
                                    </div>
                                    <div className="text-4xl font-bold text-blue-700 animate-pulse">
                                      {example.num1}
                                    </div>
                                    <div className="text-lg text-blue-600 mt-2">
                                      Je pars d'ici et je vais faire {Math.floor(example.num2 / 10)} sauts !
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Animation des sauts individuels */}
                              {calculationStep === 'units' && (
                                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6 border-2 border-green-400">
                                  <div className="text-center mb-4">
                                    <div className="text-2xl font-bold text-green-800">
                                      🦘 C'est parti pour les sauts !
                                    </div>
                                  </div>
                                  
                                  {/* Ligne des sauts */}
                                  <div className="flex justify-center items-center space-x-1 overflow-x-auto pb-4">
                                    {/* Point de départ */}
                                    <div className="text-center flex-shrink-0">
                                      <div className="w-16 h-16 bg-blue-500 border-3 border-blue-700 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                                        {example.num1}
                                      </div>
                                      <div className="text-sm font-bold text-blue-700 mt-1">Départ</div>
                                    </div>

                                    {/* Sauts de 10 */}
                                    {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => {
                                      const currentValue = example.num1 + (i + 1) * 10;
                                      return (
                                        <div key={i} className="flex items-center flex-shrink-0">
                                          {/* Flèche de saut */}
                                          <div className="text-2xl text-green-600 mx-1">
                                            ➡️
                                          </div>
                                          {/* Point d'arrivée du saut */}
                                          <div className="text-center">
                                            <div className="w-16 h-16 bg-green-500 border-3 border-green-700 rounded-full flex items-center justify-center text-white font-bold">
                                              {currentValue}
                                            </div>
                                            <div className="text-sm font-bold text-green-700 mt-1">
                                              Saut {i + 1}
                                            </div>
                                            <div className="text-xs text-green-600">
                                              +10
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Récapitulatif des sauts */}
                                  <div className="text-center mt-4 p-3 bg-white rounded-lg border-2 border-green-300">
                                    <div className="text-lg font-bold text-green-800">
                                      {Math.floor(example.num2 / 10)} sauts de 10 : {example.num1} → {example.result}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Étape : Résultat final */}
                              {calculationStep === 'result' && (
                                <div className="text-center bg-yellow-100 p-6 rounded-lg border-2 border-yellow-400">
                                  <div className="text-3xl font-bold text-yellow-800 mb-3">
                                    🎉 Résultat final !
                                  </div>
                                  <div className="text-4xl font-bold text-yellow-700 mb-3">
                                    {example.num1} + {example.num2} = {example.result}
                                  </div>
                                  <div className="text-xl font-bold text-yellow-600">
                                    🦘 {Math.floor(example.num2 / 10)} dizaines = {Math.floor(example.num2 / 10)} sauts de 10 !
                                  </div>
                                  <div className="text-lg text-yellow-700 mt-2">
                                    Sauter de 10 en 10, c'est malin !
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
          <div id="exercise-area" className="pb-20 sm:pb-8">
            {/* Introduction de Sam le Pirate - toujours visible */}
            <div id="sam-pirate-section" className="mb-6 sm:mb-4 mt-4">
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
                  {exercises[currentExercise]?.question || 'Chargement...'}
                </h3>
                
                {/* Badge du type */}
                <div className="flex justify-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    exercises[currentExercise]?.type === 'sans-retenue' ? 'bg-green-100 text-green-800' :
                    exercises[currentExercise]?.type === 'avec-retenue' ? 'bg-orange-100 text-orange-800' :
                    exercises[currentExercise]?.type === 'calcul-mental' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {exercises[currentExercise]?.type === 'sans-retenue' ? '✨ Sans retenue' :
                     exercises[currentExercise]?.type === 'avec-retenue' ? '🔄 Avec retenue' :
                     exercises[currentExercise]?.type === 'calcul-mental' ? '🧠 Calcul mental' :
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
                    <span className="text-lg sm:text-xl font-bold">{exercises[currentExercise].num1} + {exercises[currentExercise].num2} = ?</span>
                  </div>
                  
                  {/* Input parfaitement centré */}
                  <div className="flex justify-center">
                    <input
                      id="answer-input"
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
                      id="validate-btn"
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
                          🎉 Parfait ! {exercises[currentExercise].num1} + {exercises[currentExercise].num2} = {exercises[currentExercise].correctAnswer} !
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