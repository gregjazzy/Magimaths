'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Plus } from 'lucide-react';

export default function DecompositionsCP() {
  const [selectedNumber, setSelectedNumber] = useState('5');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  // Fonction pour mélanger un tableau (définie ici pour pouvoir l'utiliser dans useState)
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  
  // États pour le système vocal
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [useModernTTS] = useState(false); // Utiliser les voix natives du système
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  const welcomeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseInstructionGivenRef = useRef(false);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'decompositions',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-20-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'decompositions');
      
      if (existingIndex >= 0) {
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
          allProgress[existingIndex].attempts += 1;
        }
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('cp-nombres-20-progress', JSON.stringify(allProgress));
  };

  // Nombres avec leurs décompositions
  const numbersDecompositions = {
    '3': [
      { formula: '3 = 0 + 3', visual1: '', visual2: '🔴🔴🔴' },
      { formula: '3 = 1 + 2', visual1: '🔴', visual2: '🔴🔴' },
      { formula: '3 = 2 + 1', visual1: '🔴🔴', visual2: '🔴' },
      { formula: '3 = 3 + 0', visual1: '🔴🔴🔴', visual2: '' }
    ],
    '4': [
      { formula: '4 = 0 + 4', visual1: '', visual2: '🔴🔴🔴🔴' },
      { formula: '4 = 1 + 3', visual1: '🔴', visual2: '🔴🔴🔴' },
      { formula: '4 = 2 + 2', visual1: '🔴🔴', visual2: '🔴🔴' },
      { formula: '4 = 3 + 1', visual1: '🔴🔴🔴', visual2: '🔴' },
      { formula: '4 = 4 + 0', visual1: '🔴🔴🔴🔴', visual2: '' }
    ],
    '5': [
      { formula: '5 = 0 + 5', visual1: '', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '5 = 1 + 4', visual1: '🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '5 = 2 + 3', visual1: '🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '5 = 3 + 2', visual1: '🔴🔴🔴', visual2: '🔴🔴' },
      { formula: '5 = 4 + 1', visual1: '🔴🔴🔴🔴', visual2: '🔴' },
      { formula: '5 = 5 + 0', visual1: '🔴🔴🔴🔴🔴', visual2: '' }
    ],
    '6': [
      { formula: '6 = 1 + 5', visual1: '🔴', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '6 = 2 + 4', visual1: '🔴🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '6 = 3 + 3', visual1: '🔴🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '6 = 4 + 2', visual1: '🔴🔴🔴🔴', visual2: '🔴🔴' },
      { formula: '6 = 5 + 1', visual1: '🔴🔴🔴🔴🔴', visual2: '🔴' }
    ],
    '7': [
      { formula: '7 = 1 + 6', visual1: '🔴', visual2: '🔴🔴🔴🔴🔴🔴' },
      { formula: '7 = 2 + 5', visual1: '🔴🔴', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '7 = 3 + 4', visual1: '🔴🔴🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '7 = 4 + 3', visual1: '🔴🔴🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '7 = 5 + 2', visual1: '🔴🔴🔴🔴🔴', visual2: '🔴🔴' },
      { formula: '7 = 6 + 1', visual1: '🔴🔴🔴🔴🔴🔴', visual2: '🔴' }
    ],
    '8': [
      { formula: '8 = 2 + 6', visual1: '🔴🔴', visual2: '🔴🔴🔴🔴🔴🔴' },
      { formula: '8 = 3 + 5', visual1: '🔴🔴🔴', visual2: '🔴🔴🔴🔴🔴' },
      { formula: '8 = 4 + 4', visual1: '🔴🔴🔴🔴', visual2: '🔴🔴🔴🔴' },
      { formula: '8 = 5 + 3', visual1: '🔴🔴🔴🔴🔴', visual2: '🔴🔴🔴' },
      { formula: '8 = 6 + 2', visual1: '🔴🔴🔴🔴🔴🔴', visual2: '🔴🔴' }
    ]
  };

  // Exercices sur les décompositions
  const exercises = [
    { question: '5 = 2 + ?', number: 5, part1: 2, correctAnswer: '3', choices: ['3', '2', '4'] },
    { question: '4 = 3 + ?', number: 4, part1: 3, correctAnswer: '1', choices: ['1', '2', '3'] },
    { question: '6 = 1 + ?', number: 6, part1: 1, correctAnswer: '5', choices: ['4', '5', '6'] },
    { question: '7 = 3 + ?', number: 7, part1: 3, correctAnswer: '4', choices: ['3', '4', '5'] },
    { question: '3 = 1 + ?', number: 3, part1: 1, correctAnswer: '2', choices: ['3', '1', '2'] },
    { question: '8 = 3 + ?', number: 8, part1: 3, correctAnswer: '5', choices: ['4', '5', '6'] },
    { question: '6 = 2 + ?', number: 6, part1: 2, correctAnswer: '4', choices: ['4', '3', '5'] },
    { question: '5 = 3 + ?', number: 5, part1: 3, correctAnswer: '2', choices: ['3', '2', '1'] },
    { question: '7 = 2 + ?', number: 7, part1: 2, correctAnswer: '5', choices: ['6', '4', '5'] },
    { question: '4 = 2 + ?', number: 4, part1: 2, correctAnswer: '2', choices: ['2', '1', '3'] },
    { question: '8 = 6 + ?', number: 8, part1: 6, correctAnswer: '2', choices: ['1', '2', '3'] },
    { question: '6 = 4 + ?', number: 6, part1: 4, correctAnswer: '2', choices: ['3', '1', '2'] },
    { question: '7 = 1 + ?', number: 7, part1: 1, correctAnswer: '6', choices: ['6', '5', '7'] },
    { question: '5 = 1 + ?', number: 5, part1: 1, correctAnswer: '4', choices: ['5', '3', '4'] },
    { question: '8 = 2 + ?', number: 8, part1: 2, correctAnswer: '6', choices: ['7', '6', '5'] }
  ];

  // === FONCTIONS VOCALES ===

  // Fonction helper pour créer une utterance optimisée
  const createOptimizedUtterance = (text: string) => {
    // Améliorer le texte avec des pauses naturelles pour réduire la monotonie
    const enhancedText = text
      .replace(/\.\.\./g, '... ')    // Pauses après points de suspension
      .replace(/!/g, ' !')           // Espace avant exclamation pour l'intonation
      .replace(/\?/g, ' ?')          // Espace avant interrogation pour l'intonation
      .replace(/,(?!\s)/g, ', ')     // Pauses après virgules si pas déjà d'espace
      .replace(/:/g, ' : ')          // Pauses après deux-points
      .replace(/;/g, ' ; ')          // Pauses après point-virgules
      .replace(/\s+/g, ' ')          // Nettoyer les espaces multiples
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(enhancedText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;  // Légèrement plus lent pour la compréhension
    utterance.pitch = 1.1;  // Pitch légèrement plus aigu (adapté aux enfants)
    utterance.volume = 0.9; // Volume confortable
    
    // Utiliser la voix sélectionnée si disponible
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    return utterance;
  };

  // Fonction pour jouer un texte avec timing
  const playAudioSequence = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Arrêter les vocaux précédents
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      const utterance = createOptimizedUtterance(text);
      utterance.onend = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  // Fonction d'attente
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const speakAudio = (text: string) => {
    // Arrêter les vocaux précédents
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = createOptimizedUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  // Consigne détaillée avec l'exercice 1 réel et animations synchronisées
  const explainExercisesOnce = async () => {
    // Arrêter les vocaux précédents
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    setIsPlayingVocal(true);

    try {
      // 1. Introduction générale
      await playAudioSequence("Super ! Tu vas maintenant faire des exercices de décomposition !");
      await wait(800);

      // 2. Surbrillance du container d'exercice
      setHighlightedElement('exercise-container');
      await playAudioSequence("Regarde ton premier exercice !");
      await wait(2000);
      setHighlightedElement(null);
      
      await wait(300);

      // 3. Expliquer le titre avec surbrillance
      setHighlightedElement('exercise-title');
      await playAudioSequence("Tu dois compléter la décomposition ! C'est-à-dire trouver le nombre qui manque !");
      await wait(3000);
      setHighlightedElement(null);
      
      await wait(300);

      // 4. Montrer la question avec surbrillance forte
      setHighlightedElement('exercise-question-text');
      await playAudioSequence("Lis bien la question : 5 égale 2 plusse quoi ?");
      await wait(2500);
      setHighlightedElement(null);
      
      await wait(300);

      // 5. Expliquer avec les 5 cercles rouges - le nombre total
      setHighlightedElement('exercise-total-circles');
      await playAudioSequence("Regarde ! Voici 5 cercles rouges ! Compte-les : un, deux, trois, quatre, cinq !");
      await wait(3500);
      setHighlightedElement(null);
      
      await wait(300);

      // 6. Expliquer le signe égal
      setHighlightedElement('exercise-equals');
      await playAudioSequence("Le signe égal veut dire : c'est la même chose que !");
      await wait(2200);
      setHighlightedElement(null);
      
      await wait(300);

      // 7. Montrer la première partie avec 2 cercles
      setHighlightedElement('exercise-first-part');
      await playAudioSequence("D'un côté, on a déjà 2 cercles ! Compte : un, deux !");
      await wait(2500);
      setHighlightedElement(null);
      
      await wait(300);

      // 8. Expliquer le signe plus
      setHighlightedElement('exercise-plus');
      await playAudioSequence("Le signe plusse veut dire qu'on ajoute encore des cercles !");
      await wait(2200);
      setHighlightedElement(null);
      
      await wait(300);

      // 9. Montrer le point d'interrogation
      setHighlightedElement('exercise-question-mark');
      await playAudioSequence("Et le point d'interrogation, c'est ce que tu dois trouver ! Combien de cercles faut-il ajouter ?");
      await wait(3500);
      setHighlightedElement(null);
      
      await wait(300);

      // 10. Logique de résolution avec approche additive
      await playAudioSequence("Réfléchis ! Si on a déjà 2 cercles, combien faut-il en rajouter pour en avoir 5 en tout ?");
      await wait(3500);
      
      await wait(300);

      // 11. Donner la réponse avec raisonnement additif
      await playAudioSequence("À partir de 2, il faut rajouter 3 cercles pour en avoir 5 ! Donc la réponse est 3 !");
      await wait(2500);
      
      await wait(300);

      // 12. Montrer les choix
      setHighlightedElement('exercise-choices');
      await playAudioSequence("Maintenant, regarde les choix et clique sur 3 !");
      await wait(2200);
      setHighlightedElement(null);

      await wait(300);

      // 13. Instructions générales pour la suite
      await playAudioSequence("Pour tous les exercices, tu feras pareil : tu regardes le nombre total, tu vois ce qu'on a déjà, et tu trouves ce qui manque !");
      await wait(3500);

      await playAudioSequence("Quand tu te trompes, regarde bien la correction, puis clique sur Suivant pour continuer !");
      await wait(3000);

      await playAudioSequence("Allez, c'est parti ! Clique sur 3 pour commencer !");
      await wait(2000);

      // 14. Encourager à essayer d'autres nombres avec illuminations
      await playAudioSequence("Après les exercices, n'oublie pas d'essayer avec d'autres nombres !");
      await wait(2000);

      await playAudioSequence("Retourne dans la section cours pour essayer par exemple avec... ");
      await wait(1500);

      // Illuminer chaque nombre en le disant
      setHighlightedElement('number-button-4');
      await playAudioSequence("4 !");
      await wait(800);
      setHighlightedElement(null);
      await wait(100);

      setHighlightedElement('number-button-6');
      await playAudioSequence("6 !");
      await wait(800);
      setHighlightedElement(null);
      await wait(100);

      setHighlightedElement('number-button-7');
      await playAudioSequence("7 !");
      await wait(800);
      setHighlightedElement(null);
      await wait(100);

      await playAudioSequence("ou un autre nombre ! Tu verras, c'est très amusant de découvrir toutes les décompositions !");
      await wait(3000);

    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Instructions vocales pour le cours avec synchronisation et animations fortes
  const explainChapterGoal = async () => {
    setHasStarted(true); // Marquer que l'enfant a commencé
    hasStartedRef.current = true; // Pour les timers
    
    // Annuler immédiatement les timers de rappel
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }
    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
      reminderTimerRef.current = null;
    }
    
    // Arrêter les vocaux précédents
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    setIsPlayingVocal(true);

    try {
      // 1. Introduction générale
      await playAudioSequence("Bonjour ! Bienvenue dans le chapitre sur les décompositions !");
      await wait(300);

      // 2. Explication du concept de décomposition
      await playAudioSequence("Aujourd'hui, nous allons apprendre les décompositions de nombres !");
      await wait(2500);
      
      await playAudioSequence("Une décomposition, c'est montrer toutes les façons de faire un nombre avec deux autres nombres !");
      await wait(3500);
      
      await playAudioSequence("Par exemple, le nombre 5 peut se faire avec 2 plusse 3, ou avec 1 plusse 4, ou avec 0 plusse 5 !");
      await wait(4000);
      
      await wait(300);

      // 3. Montrer le sélecteur de nombres
      setHighlightedElement('number-selector');
      await playAudioSequence("Regarde ces nombres ! Tu peux choisir n'importe lequel pour découvrir toutes ses décompositions !");
      await wait(3500);
      setHighlightedElement(null);
      
      await wait(300);

      // 4. Exemple avec le nombre 5 par défaut
      setHighlightedElement('decompositions-display');
      await playAudioSequence("Prenons l'exemple du nombre 5 ! Regarde toutes les façons de le faire !");
      await wait(3000);
      setHighlightedElement(null);
      
      await wait(300);

      // 5. Proposer d'essayer d'autres nombres
      await playAudioSequence("Tu peux essayer avec d'autres nombres ! Par exemple...");
      await wait(2000);

      // Illuminer le bouton 4 
      setHighlightedElement('number-button-4');
      await playAudioSequence("Essaie avec le 4 !");
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);

      // Illuminer le bouton 6
      setHighlightedElement('number-button-6');
      await playAudioSequence("Ou avec le 6 !");
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);

      // Illuminer le bouton 7
      setHighlightedElement('number-button-7');
      await playAudioSequence("Ou encore le 7 !");
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);

      await playAudioSequence("Clique sur un nombre et découvre toutes ses décompositions !");
      await wait(2500);

      // 13. Transition vers les décompositions générales
      await wait(300);
      setHighlightedElement('explanation-title');
      await playAudioSequence("Maintenant, découvrons les décompositions avec tous les nombres !");
      await wait(2500);
      setHighlightedElement(null);

      // 14. Explication générale des décompositions
      await wait(300);
      setHighlightedElement('definition-text');
      await playAudioSequence("Une décomposition, c'est couper un nombre en plusieurs morceaux !");
      await wait(3000);
      setHighlightedElement(null);

      // 15. Exemple avec les pommes
      await wait(300);
      setHighlightedElement('apples-title');
      await playAudioSequence("Par exemple, regardons avec des pommes !");
      await wait(2000);
      setHighlightedElement(null);

      // 16. Guide vers le sélecteur de nombre
      await wait(300);
      setHighlightedElement('number-selector');
      await playAudioSequence("Regarde ! Tu peux choisir un nombre ici pour voir toutes ses décompositions !");
      await wait(2500);
      setHighlightedElement(null);
      
      await wait(300);

      // 17. Guide vers l'affichage des décompositions
      setHighlightedElement('decompositions-display');
      await playAudioSequence("Et ici, tu verras toutes les façons différentes de faire ton nombre avec des additions !");
      await wait(3000);
      setHighlightedElement(null);

      await wait(300);

      // 18. Guide vers les boutons audio
      setHighlightedElement('audio-buttons');
      await playAudioSequence("Et tu peux cliquer sur chaque décomposition pour l'écouter !");
      await wait(2200);
      setHighlightedElement(null);

      await wait(300);
      await playAudioSequence("Alors... Es-tu prêt à découvrir toutes les décompositions ?");

    } catch (error) {
      console.error('Erreur dans explainChapterGoal:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  // Effet pour initialiser les choix au premier rendu
  useEffect(() => {
    if (exercises.length > 0 && shuffledChoices.length === 0) {
      initializeShuffledChoices();
    }
  }, []);

  // Système de guidance vocale automatique
  useEffect(() => {
    // Chargement et sélection automatique de la meilleure voix française
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Filtrer les voix françaises
      const frenchVoices = voices.filter(voice => voice.lang.startsWith('fr'));
      
      // Ordre de préférence pour les voix françaises
      const preferredVoices = [
        // Voix iOS/macOS de qualité
        'Amélie', 'Virginie', 'Aurélie', 'Alice',
        // Voix Android de qualité
        'fr-FR-Standard-A', 'fr-FR-Wavenet-A', 'fr-FR-Wavenet-C',
        // Voix Windows
        'Hortense', 'Julie', 'Marie', 'Pauline',
        // Voix masculines (dernier recours)
        'Thomas', 'Daniel', 'Henri', 'Pierre'
      ];
      
      let bestVoice = null;
      
      // Essayer de trouver la meilleure voix dans l'ordre de préférence
      for (const preferred of preferredVoices) {
        const foundVoice = frenchVoices.find(voice => 
          voice.name.toLowerCase().includes(preferred.toLowerCase())
        );
        if (foundVoice) {
          bestVoice = foundVoice;
          break;
        }
      }
      
      // Si aucune voix préférée, prendre la première française avec qualité décente
      if (!bestVoice && frenchVoices.length > 0) {
        const decentVoices = frenchVoices.filter(voice => 
          !voice.name.toLowerCase().includes('robotic') && 
          !voice.name.toLowerCase().includes('computer')
        );
        bestVoice = decentVoices.length > 0 ? decentVoices[0] : frenchVoices[0];
      }
      
      setSelectedVoice(bestVoice || null);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Guidance vocale automatique pour les non-lecteurs (COURS seulement)
    if (!showExercises) {
      welcomeTimerRef.current = setTimeout(() => {
        if (!hasStartedRef.current) {
          speakAudio("Clique sur le bouton violet qui bouge pour commencer.");
        }
      }, 1000); // 1 seconde après le chargement

      // Rappel vocal si pas de clic après 6 secondes (5 secondes après le premier)
       // 6 secondes après le chargement (5 secondes après le premier message)
    }

    // Nettoyage
          return () => {
        if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      };
  }, [showExercises]);

  // Effect pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    // Arrêter tous les vocaux lors du changement d'onglet
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    
    // Jouer automatiquement la consigne des exercices (une seule fois)
    if (showExercises && !exerciseInstructionGivenRef.current) {
      // Délai court pour laisser l'interface se charger
      setTimeout(() => {
        explainExercisesOnce();
        exerciseInstructionGivenRef.current = true;
      }, 800);
    }
  }, [showExercises]);

  // Effect pour arrêter la voix quand on quitte la page
  useEffect(() => {
    const stopSpeechOnExit = () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    };

    // Arrêter la voix quand on ferme/quitte la page
    const handleBeforeUnload = () => {
      stopSpeechOnExit();
    };

    // Arrêter la voix quand l'onglet devient inactif
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSpeechOnExit();
      }
    };

    // Arrêter la voix lors de la navigation
    const handlePageHide = () => {
      stopSpeechOnExit();
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    // Nettoyage au démontage du composant
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      stopSpeechOnExit(); // Arrêter la voix aussi au démontage
    };
  }, []);

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string): string => {
    const numbers: { [key: string]: string } = {
      '0': 'zéro', '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre',
      '5': 'cinq', '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf',
      '10': 'dix', '11': 'onze', '12': 'douze', '13': 'treize', '14': 'quatorze',
      '15': 'quinze', '16': 'seize', '17': 'dix-sept', '18': 'dix-huit', 
      '19': 'dix-neuf', '20': 'vingt'
    };
    return numbers[num] || num;
  };

  // Fonction pour énoncer le résultat de la décomposition
  const speakResult = (number: number, part1: number, part2: string) => {
    const text = `${numberToWords(number.toString())} égale ${numberToWords(part1.toString())} plusse ${numberToWords(part2)}`;
    speakText(text);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerClick = (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    // Passage automatique au suivant après une bonne réponse
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 >= exercises.length) {
          // Dernier exercice terminé
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        } else {
          // Passer à l'exercice suivant
          nextExercise();
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    // Réinitialiser les choix mélangés sera fait par useEffect quand currentExercise change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4"
            onClick={() => {
              if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
              }
              setIsPlayingVocal(false);
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🧩 Les décompositions additives
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Découvre toutes les façons de faire un nombre avec des additions !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex h-auto">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex items-center justify-center ${
                !showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-6 sm:space-y-8">
            {/* Bouton d'explication vocal principal - Attractif pour non-lecteurs */}
            <div className="text-center mb-6">
              <button
                onClick={explainChapterGoal}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                  !hasStarted ? 'animate-bounce' : ''
                } ${
                  isPlayingVocal ? 'animate-pulse cursor-not-allowed opacity-75' : 'hover:from-purple-600 hover:to-pink-600'
                }`}
                style={{
                  animationDuration: !hasStarted ? '2s' : 'none',
                  animationIterationCount: !hasStarted ? 'infinite' : 'none'
                }}
              >
                <Volume2 className="inline w-6 h-6 mr-3" />
                ▶️ COMMENCER !
              </button>
            </div>

            {/* Explication des décompositions */}
            <div 
              id="explanation-section"
              className={`bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'explanation-section' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h2 
                id="explanation-title"
                className={`text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900 transition-all duration-500 ${
                  highlightedElement === 'explanation-title' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-110' : ''
                }`}
              >
                🧠 Qu'est-ce qu'une décomposition additive ?
              </h2>
              
              <div 
                id="definition-box"
                className={`bg-purple-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-500 ${
                  highlightedElement === 'definition-box' ? 'bg-yellow-100 ring-4 ring-yellow-500 shadow-2xl scale-105' : ''
                }`}
              >
                <p 
                  id="definition-text"
                  className={`text-base sm:text-lg lg:text-xl text-center text-gray-800 mb-3 sm:mb-4 transition-all duration-500 ${
                    highlightedElement === 'definition-text' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-2 scale-110' : ''
                  }`}
                >
                  Une décomposition, c'est <strong>couper un nombre en plusieurs morceaux</strong> !
                </p>
                <div className="text-center">
                  <div 
                    id="math-example"
                    className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-3 sm:mb-4 transition-all duration-500 ${
                      highlightedElement === 'math-example' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                    }`}
                  >5 = 2 + 3</div>
                  <p 
                    id="math-explanation"
                    className={`text-sm sm:text-base lg:text-lg text-gray-700 transition-all duration-500 ${
                      highlightedElement === 'math-explanation' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-2 scale-110' : ''
                    }`}
                  >On peut faire 5 avec 2 et 3 !</p>
                </div>
              </div>

              {/* Exemple visuel avec des objets */}
              <div 
                id="visual-example"
                className={`bg-yellow-50 rounded-lg p-4 sm:p-6 transition-all duration-500 ${
                  highlightedElement === 'visual-example' ? 'bg-yellow-100 ring-4 ring-yellow-500 shadow-2xl scale-105' : ''
                }`}
              >
                <h3 
                  id="apples-title"
                  className={`text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-yellow-800 text-center transition-all duration-500 ${
                    highlightedElement === 'apples-title' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-2 scale-110' : ''
                  }`}
                >
                  🍎 Exemple : 5 pommes = 2 pommes + 3 pommes
                </h3>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div 
                    id="five-apples"
                    className={`text-center transition-all duration-500 ${
                      highlightedElement === 'five-apples' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                    }`}
                  >
                    <div className="text-xl sm:text-2xl lg:text-4xl mb-2">🍎🍎🍎🍎🍎</div>
                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">5 pommes</div>
                  </div>
                  <div 
                    id="equals-sign"
                    className={`text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600 transition-all duration-500 ${
                      highlightedElement === 'equals-sign' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-150' : ''
                    }`}
                  >=</div>
                  <div 
                    id="two-apples"
                    className={`text-center transition-all duration-500 ${
                      highlightedElement === 'two-apples' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                    }`}
                  >
                    <div className="text-xl sm:text-2xl lg:text-4xl mb-2">🍎🍎</div>
                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">2 pommes</div>
                  </div>
                  <div 
                    id="plus-sign"
                    className={`text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600 transition-all duration-500 ${
                      highlightedElement === 'plus-sign' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-150' : ''
                    }`}
                  >+</div>
                  <div 
                    id="three-apples"
                    className={`text-center transition-all duration-500 ${
                      highlightedElement === 'three-apples' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                    }`}
                  >
                    <div className="text-xl sm:text-2xl lg:text-4xl mb-2">🍎🍎🍎</div>
                    <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">3 pommes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div 
              id="number-selector"
              className={`bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-selector' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🎯 Choisis un nombre à décomposer
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {['3', '4', '5', '6', '7', '8'].map((num) => (
                  <button
                    key={num}
                    id={`number-button-${num}`}
                    onClick={() => setSelectedNumber(num)}
                    className={`p-3 sm:p-4 lg:p-6 rounded-lg font-bold text-xl sm:text-2xl lg:text-3xl transition-all duration-500 ${
                      selectedNumber === num
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${
                      highlightedElement === `number-button-${num}` 
                        ? 'bg-yellow-200 ring-4 ring-yellow-500 shadow-2xl scale-125 text-black' 
                        : ''
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage des décompositions */}
            <div 
              id="decompositions-display"
              className={`bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'decompositions-display' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                📊 Toutes les façons de faire {selectedNumber}
              </h2>
              
              <div 
                id="audio-buttons"
                className={`space-y-3 sm:space-y-4 transition-all duration-500 ${
                  highlightedElement === 'audio-buttons' ? 'ring-4 ring-yellow-400 rounded-lg bg-yellow-50 p-2' : ''
                }`}
              >
                {numbersDecompositions[selectedNumber as keyof typeof numbersDecompositions]?.map((decomp, index) => (
                  <div key={index} className="bg-purple-50 rounded-lg p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                      {/* Première partie */}
                      <div className="text-center min-w-[80px] sm:min-w-[100px]">
                        <div className="text-base sm:text-lg lg:text-2xl mb-1 sm:mb-2 break-all">
                          {decomp.visual1}
                        </div>
                        <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">
                          {decomp.formula.split(' = ')[1].split(' + ')[0]}
                        </div>
                      </div>
                      
                      <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">
                        <Plus className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                      </div>
                      
                      {/* Deuxième partie */}
                      <div className="text-center min-w-[80px] sm:min-w-[100px]">
                        <div className="text-base sm:text-lg lg:text-2xl mb-1 sm:mb-2 break-all">
                          {decomp.visual2}
                        </div>
                        <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">
                          {decomp.formula.split(' + ')[1]}
                        </div>
                      </div>
                      
                      <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-600">=</div>
                      
                      {/* Résultat */}
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">
                          {selectedNumber}
                        </div>
                      </div>
                    </div>
                    
                    {/* Formule complète */}
                    <div className="text-center mt-3 sm:mt-4">
                      <button
                        onClick={() => speakText(decomp.formula.replace(/[+=]/g, (match) => match === '+' ? 'plusse' : 'égale'))}
                        className="bg-purple-200 hover:bg-purple-300 text-purple-900 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base lg:text-lg transition-colors"
                      >
                        <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        {decomp.formula}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jeu interactif */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎮 Jeu : Trouve d'autres décompositions !
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-lg text-center text-blue-800 mb-4 font-semibold">
                  💡 Astuce : Si tu sais que 5 = 2 + 3, alors tu sais aussi que 5 = 3 + 2 !
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    L'ordre n'a pas d'importance dans une addition !
                  </div>
                  <div className="text-xl text-blue-700">
                    2 + 3 = 3 + 2 = 5
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir les décompositions</h3>
              <ul className="space-y-2 text-lg">
                <li>• Utilise tes doigts pour partager</li>
                <li>• Commence par les plus simples : 0 + tout</li>
                <li>• Pense aux objets : bonbons, pommes, jetons...</li>
                <li>• L'ordre ne change rien : 2+3 = 3+2</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-6 sm:space-y-8">
            {/* Bouton de démonstration "Suivant" avec effet magique - TEMPORAIRE pour l'explication */}
            {highlightedElement === 'demo-next-button' && (
              <div className="flex justify-center">
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl ring-4 ring-yellow-400 animate-bounce scale-110 transform transition-all duration-1000 ease-out opacity-100">
                  ✨ Suivant → ✨
                </div>
              </div>
            )}

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-purple-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div 
              id="exercise-container"
              className={`bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center transition-all duration-500 ${
                highlightedElement === 'exercise-container' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h3 
                id="exercise-title"
                className={`text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900 transition-all duration-500 ${
                  highlightedElement === 'exercise-title' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-110' : ''
                }`}
              >
                🎯 Complète la décomposition :
              </h3>
              
              {/* Question avec visualisation */}
              <div 
                id="exercise-question-area"
                className={`bg-purple-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8 transition-all duration-500 ${
                  highlightedElement === 'exercise-question-area' ? 'bg-yellow-100 ring-4 ring-yellow-500 shadow-2xl scale-105' : ''
                }`}
              >
                <div 
                  id="exercise-question-text"
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 mb-3 sm:mb-4 md:mb-6 transition-all duration-500 ${
                    highlightedElement === 'exercise-question-text' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                  }`}
                >
                  {exercises[currentExercise].question}
                </div>
                
                {/* Aide visuelle */}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-4 mt-3 sm:mt-4 md:mt-6">
                  <div 
                    id="exercise-total-circles"
                    className={`text-center transition-all duration-500 ${
                      highlightedElement === 'exercise-total-circles' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                    }`}
                  >
                    <div className="text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2 break-all">
                      {'🔴'.repeat(exercises[currentExercise].number)}
                    </div>
                    <div className="font-bold text-xs sm:text-sm md:text-base text-gray-800">{exercises[currentExercise].number}</div>
                  </div>
                  <div 
                    id="exercise-equals"
                    className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold text-purple-600 transition-all duration-500 ${
                      highlightedElement === 'exercise-equals' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-150' : ''
                    }`}
                  >=</div>
                  <div 
                    id="exercise-first-part"
                    className={`text-center transition-all duration-500 ${
                      highlightedElement === 'exercise-first-part' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                    }`}
                  >
                    <div className="text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2 break-all">
                      {'🔴'.repeat(exercises[currentExercise].part1)}
                    </div>
                    <div className="font-bold text-xs sm:text-sm md:text-base text-gray-800">{exercises[currentExercise].part1}</div>
                  </div>
                  <div 
                    id="exercise-plus"
                    className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold text-purple-600 transition-all duration-500 ${
                      highlightedElement === 'exercise-plus' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-150' : ''
                    }`}
                  >+</div>
                  <div 
                    id="exercise-question-mark"
                    className={`text-center transition-all duration-500 ${
                      highlightedElement === 'exercise-question-mark' ? 'bg-yellow-200 ring-4 ring-yellow-500 rounded-lg p-4 scale-125' : ''
                    }`}
                  >
                    <div className="text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2">❓</div>
                    <div className="font-bold text-xs sm:text-sm md:text-base text-gray-800">?</div>
                  </div>
                </div>
              </div>
              
              {/* Choix multiples */}
              <div 
                id="exercise-choices"
                className={`grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8 transition-all duration-500 ${
                  highlightedElement === 'exercise-choices' ? 'ring-4 ring-yellow-400 rounded-lg bg-yellow-50 p-2' : ''
                }`}
              >
                {(shuffledChoices.length > 0 ? shuffledChoices : exercises[currentExercise].choices).map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all flex items-center justify-center min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-xl text-center">
                          Parfait ! {exercises[currentExercise].number} = {exercises[currentExercise].part1} + {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-xl text-center">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback détaillé pour les réponses incorrectes */}
              {!isCorrect && isCorrect !== null && (
                <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-blue-300 mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-blue-800 text-center">
                    🎯 Regarde la bonne réponse !
                  </h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-3 sm:mb-4">
                          {exercises[currentExercise].number} = {exercises[currentExercise].part1} + {exercises[currentExercise].correctAnswer}
                        </div>
                        
                        {/* Illustration dans le bon ordre */}
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-4">
                          <div className="text-center">
                            <div className="text-sm sm:text-base lg:text-xl mb-1 sm:mb-2 break-all">
                              {'🔴'.repeat(exercises[currentExercise].number)}
                            </div>
                            <div className="font-bold text-xs sm:text-sm lg:text-base text-gray-800">{exercises[currentExercise].number}</div>
                          </div>
                          <div className="text-sm sm:text-base lg:text-xl font-bold text-blue-600">=</div>
                          <div className="text-center">
                            <div className="text-sm sm:text-base lg:text-xl mb-1 sm:mb-2 break-all">
                              {'🔴'.repeat(exercises[currentExercise].part1)}
                            </div>
                            <div className="font-bold text-xs sm:text-sm lg:text-base text-gray-800">{exercises[currentExercise].part1}</div>
                          </div>
                          <div className="text-sm sm:text-base lg:text-xl font-bold text-blue-600">+</div>
                          <div className="text-center">
                            <div className="text-sm sm:text-base lg:text-xl mb-1 sm:mb-2 break-all">
                              {'🔴'.repeat(parseInt(exercises[currentExercise].correctAnswer))}
                            </div>
                            <div className="font-bold text-xs sm:text-sm lg:text-base text-gray-800">{exercises[currentExercise].correctAnswer}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => speakResult(
                          exercises[currentExercise].number, 
                          exercises[currentExercise].part1, 
                          exercises[currentExercise].correctAnswer
                        )}
                        className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2 text-sm sm:text-base"
                      >
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Écouter la bonne réponse</span>
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                      <p className="text-xs sm:text-sm font-semibold text-purple-800">
                        Maintenant tu sais ! {exercises[currentExercise].number} objets = {exercises[currentExercise].part1} objets + {exercises[currentExercise].correctAnswer} objets !
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation - Bouton Suivant (seulement si mauvaise réponse) */}
              {isCorrect === false && currentExercise + 1 < exercises.length && (
                <div className="flex justify-center mt-6">
                  <button
                    id="next-button"
                    onClick={nextExercise}
                    className={`bg-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-purple-600 transition-all ${
                      highlightedElement === 'next-button' 
                        ? 'ring-4 ring-yellow-400 shadow-2xl scale-110 bg-purple-600 animate-pulse' 
                        : ''
                    }`}
                  >
                    Suivant →
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
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert en décompositions !", message: "Tu maîtrises parfaitement les décompositions additives !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les décompositions ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Les décompositions sont importantes !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser les décompositions !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-purple-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les décompositions t'aident à bien comprendre les nombres !
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
                        onClick={() => setShowCompletionModal(false)}
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