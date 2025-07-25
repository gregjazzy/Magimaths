'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Eye, Edit } from 'lucide-react';

export default function EcritureCP() {
  const [selectedNumber, setSelectedNumber] = useState('7');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'chiffres' | 'lettres'>('chiffres');
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
  const exerciseReadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const allTimersRef = useRef<NodeJS.Timeout[]>([]);

  // États pour le jeu de correspondances
  const [gameSelectedChiffre, setGameSelectedChiffre] = useState<string | null>(null);
  const [gameSelectedLettre, setGameSelectedLettre] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [gameScore, setGameScore] = useState(0);
  const [showGameSuccess, setShowGameSuccess] = useState(false);

  // États pour l'animation des lettres
  const [animatingLetterIndex, setAnimatingLetterIndex] = useState<number>(-1);
  const [isExplainingNumber, setIsExplainingNumber] = useState(false);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ecriture',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ecriture');
      
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

  // Nombres avec écriture en lettres
  const numbersWriting = [
    { chiffre: '0', lettres: 'zéro', visual: '', pronunciation: 'zéro' },
    { chiffre: '1', lettres: 'un', visual: '🔴', pronunciation: 'un' },
    { chiffre: '2', lettres: 'deux', visual: '🔴🔴', pronunciation: 'deux' },
    { chiffre: '3', lettres: 'trois', visual: '🔴🔴🔴', pronunciation: 'trois' },
    { chiffre: '4', lettres: 'quatre', visual: '🔴🔴🔴🔴', pronunciation: 'quatre' },
    { chiffre: '5', lettres: 'cinq', visual: '🔴🔴🔴🔴🔴', pronunciation: 'cinq' },
    { chiffre: '6', lettres: 'six', visual: '🔴🔴🔴🔴🔴🔴', pronunciation: 'six' },
    { chiffre: '7', lettres: 'sept', visual: '🔴🔴🔴🔴🔴🔴🔴', pronunciation: 'sept' },
    { chiffre: '8', lettres: 'huit', visual: '🔴🔴🔴🔴🔴🔴🔴🔴', pronunciation: 'huit' },
    { chiffre: '9', lettres: 'neuf', visual: '🔴🔴🔴🔴🔴🔴🔴🔴🔴', pronunciation: 'neuf' },
    { chiffre: '10', lettres: 'dix', visual: '✋✋', pronunciation: 'dix' },
    { chiffre: '11', lettres: 'onze', visual: '✋✋ + 1', pronunciation: 'onze' },
    { chiffre: '12', lettres: 'douze', visual: '✋✋ + 2', pronunciation: 'douze' },
    { chiffre: '13', lettres: 'treize', visual: '✋✋ + 3', pronunciation: 'treize' },
    { chiffre: '14', lettres: 'quatorze', visual: '✋✋ + 4', pronunciation: 'quatorze' },
    { chiffre: '15', lettres: 'quinze', visual: '✋✋✋', pronunciation: 'quinze' },
    { chiffre: '16', lettres: 'seize', visual: '✋✋✋ + 1', pronunciation: 'seize' },
    { chiffre: '17', lettres: 'dix-sept', visual: '✋✋✋ + 2', pronunciation: 'dix-sept' },
    { chiffre: '18', lettres: 'dix-huit', visual: '✋✋✋ + 3', pronunciation: 'dix-huit' },
    { chiffre: '19', lettres: 'dix-neuf', visual: '✋✋✋ + 4', pronunciation: 'dix-neuf' },
    { chiffre: '20', lettres: 'vingt', visual: '✋✋✋✋', pronunciation: 'vingt' }
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

  // Consigne générale pour la série d'exercices (une seule fois)
  const explainExercisesOnce = async () => {
    // Arrêter les vocaux précédents
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    setIsPlayingVocal(true);

    try {
      await playAudioSequence("Super ! Tu vas faire une série d'exercices d'écriture !");
      await wait(500);

      await playAudioSequence("Pour cette série d'exercices, regarde bien le nombre et trouve comment l'écrire : soit en chiffres, soit en lettres !");
      await wait(500);

      await playAudioSequence("Ensuite, clique sur la bonne réponse !");
      await wait(500);

      await playAudioSequence("Quand ta réponse est mauvaise, regarde bien la correction... puis appuie sur le bouton Suivant !");
      
      // Faire apparaître temporairement un bouton orange de démonstration
      setHighlightedElement('demo-next-button');
      await wait(2000);
      setHighlightedElement(null);

      await wait(500);
      
      // Lire l'énoncé du premier exercice
      await playAudioSequence("Commençons ! Voici le premier exercice :");
      await wait(500);
      
      if (exercises[0] && exercises[0].question) {
        await playAudioSequence(exercises[0].question);
      }

    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Instructions vocales pour le cours avec synchronisation
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

    // Fonction pour vérifier si on doit arrêter le vocal
    const shouldStop = () => {
      return showExercises || !document.hasFocus();
    };

    try {
      // 1. Introduction
      if (shouldStop()) return;
      await playAudioSequence("Bienvenue dans le chapitre écriture ! Tu vas apprendre à lire et écrire les nombres.");
      await wait(500);

      // 2. Guide vers le sélecteur de nombre
      if (shouldStop()) return;
      setHighlightedElement('number-selector');
      await playAudioSequence("Regarde ! Tu peux choisir un nombre ici pour voir comment l'écrire en chiffres ET en lettres !");
      await wait(2500);
      setHighlightedElement(null);
      
      await wait(500);

      // 3. Guide vers l'affichage
      if (shouldStop()) return;
      setHighlightedElement('number-display');
      await playAudioSequence("Ici, tu verras le nombre choisi écrit de toutes les façons différentes !");
      await wait(2000);
      setHighlightedElement(null);

      await wait(500);

      // 4. Guide vers les boutons de lecture
      if (shouldStop()) return;
      setHighlightedElement('read-buttons');
      await playAudioSequence("Et tu peux écouter comment prononcer chaque forme du nombre !");
      await wait(2000);
      setHighlightedElement(null);

      await wait(500);
      if (shouldStop()) return;
      await playAudioSequence("Alors... Es-tu prêt à apprendre à lire et écrire ?");

    } catch (error) {
      console.error('Erreur dans explainChapterGoal:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer le nombre sélectionné avec animation
  const explainSelectedNumber = async (number: string) => {
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      setIsExplainingNumber(true);
      setAnimatingLetterIndex(-1);

      // Fonction pour vérifier si on doit arrêter le vocal
      const shouldStop = () => {
        return showExercises || !document.hasFocus();
      };

      // Trouver les infos du nombre
      const numberInfo = numbersWriting.find(n => n.chiffre === number);
      if (!numberInfo) return;

      // 1. Mettre en évidence le nombre et dire "C'est le nombre X"
      if (shouldStop()) return;
      setHighlightedElement('selected-number');
      await playAudioSequence(`C'est le nombre ${number} !`);
      await wait(1000);

      // 2. Expliquer qu'on va voir comment l'écrire
      if (shouldStop()) return;
      await playAudioSequence("On l'écrit de la manière suivante :");
      await wait(500);

      // 3. Mettre en évidence l'écriture en lettres
      if (shouldStop()) return;
      setHighlightedElement('selected-letters');
      await wait(500);

      // 4. Épeler chaque lettre avec animation
      if (shouldStop()) return;
      const letters = numberInfo.lettres.split('');
      await playAudioSequence("Épelons ensemble :");
      await wait(500);

      for (let i = 0; i < letters.length; i++) {
        if (shouldStop()) return;
        const letter = letters[i];
        if (letter === '-') {
          setAnimatingLetterIndex(i);
          await playAudioSequence("tiret");
          await wait(800);
        } else if (letter !== ' ') {
          setAnimatingLetterIndex(i);
          await playAudioSequence(letter);
          await wait(800);
        }
      }

      // 5. Dire le mot complet
      if (shouldStop()) return;
      setAnimatingLetterIndex(-1);
      await wait(500);
      await playAudioSequence(`Cela fait : ${numberInfo.lettres} !`);

    } catch (error) {
      console.error('Erreur dans explainSelectedNumber:', error);
    } finally {
      setIsPlayingVocal(false);
      setIsExplainingNumber(false);
      setHighlightedElement(null);
      setAnimatingLetterIndex(-1);
    }
  };

  // Exercices mixtes (lecture et écriture)
  const exercises = [
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '3', correctAnswer: 'trois', choices: ['trois', 'deux', 'quatre'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'sept', correctAnswer: '7', choices: ['8', '6', '7'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '15', correctAnswer: 'quinze', choices: ['quatorze', 'quinze', 'seize'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'onze', correctAnswer: '11', choices: ['11', '10', '12'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '9', correctAnswer: 'neuf', choices: ['dix', 'huit', 'neuf'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'quatre', correctAnswer: '4', choices: ['3', '5', '4'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '18', correctAnswer: 'dix-huit', choices: ['dix-huit', 'dix-sept', 'dix-neuf'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'treize', correctAnswer: '13', choices: ['14', '13', '12'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '2', correctAnswer: 'deux', choices: ['un', 'trois', 'deux'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'vingt', correctAnswer: '20', choices: ['20', '19', '21'] },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '12', correctAnswer: 'douze', choices: ['onze', 'douze', 'treize'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'six', correctAnswer: '6', choices: ['7', '5', '6'] },
    { type: 'lecture', question: 'Combien y a-t-il de points ? Écris en lettres.', display: '🔴🔴🔴🔴🔴🔴', correctAnswer: 'six', choices: ['six', 'cinq', 'sept'] },
    
    // Exercices supplémentaires pour arriver à 15
    { type: 'lecture', question: 'Comment écrit-on ce nombre en lettres ?', display: '10', correctAnswer: 'dix', choices: ['onze', 'neuf', 'dix'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'huit', correctAnswer: '8', choices: ['8', '7', '9'] },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'seize', correctAnswer: '16', choices: ['17', '15', '16'] }
  ];

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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



  // Effect pour gérer la visibilité de la page et les sorties
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // La page n'est plus visible (onglet changé, fenêtre minimisée, etc.)
        stopAllVocalAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      // L'utilisateur quitte la page
      stopAllVocalAndAnimations();
    };

    const handlePageHide = () => {
      // Page cachée (plus fiable que beforeunload)
      stopAllVocalAndAnimations();
    };

    // Ajouter les listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      stopAllVocalAndAnimations();
    };
  }, []);

  // Effect pour réinitialiser quand on revient sur la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && showExercises) {
        // La page redevient visible et on est sur les exercices
        // Réinitialiser les états si nécessaire
        exerciseInstructionGivenRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showExercises]);

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

  // Fonction pour énoncer la bonne réponse
  const speakResult = (answer: string) => {
    const currentEx = exercises[currentExercise];
    let text = '';
    
    if (currentEx.type === 'lecture') {
      // Pour les exercices de lecture (chiffre vers lettres)
      text = `La bonne réponse est ${answer}`;
    } else {
      // Pour les exercices d'écriture (lettres vers chiffre)
      text = `La bonne réponse est ${answer}`;
    }
    
    speakText(text);
  };

  const speakText = (text: string) => {
    // Vérifier qu'on est dans le bon contexte avant de parler
    if (!document.hasFocus()) return;
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Arrêter toute lecture en cours
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerClick = (answer: string) => {
    stopVocal();
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

  // Fonction pour arrêter complètement tous les vocaux et animations
  const stopAllVocalAndAnimations = () => {
    // Arrêter la synthèse vocale
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    // Arrêter tous les timers
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }
    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
      reminderTimerRef.current = null;
    }
    if (exerciseReadingTimerRef.current) {
      clearTimeout(exerciseReadingTimerRef.current);
      exerciseReadingTimerRef.current = null;
    }
    
    // Arrêter tous les autres timers trackés
    allTimersRef.current.forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    allTimersRef.current = [];
    
    // Réinitialiser tous les états vocaux et animations
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingLetterIndex(-1);
    setIsExplainingNumber(false);
  };

  // Fonction pour arrêter le vocal (version simplifiée pour compatibilité)
  const stopVocal = stopAllVocalAndAnimations;

  // Fonction pour lire l'énoncé d'un exercice spécifique
  const readExerciseStatement = (exerciseIndex?: number) => {
    const index = exerciseIndex !== undefined ? exerciseIndex : currentExercise;
    const exerciseData = exercises[index];
    if (exerciseData && showExercises) {
      setTimeout(() => {
        // Vérifier qu'on est toujours sur les exercices avant de parler
        if (showExercises && document.hasFocus()) {
          speakText(exerciseData.question);
        }
      }, 1000);
    }
  };

  const nextExercise = () => {
    stopVocal();
    if (currentExercise < exercises.length - 1) {
      const nextIndex = currentExercise + 1;
      setCurrentExercise(nextIndex);
      setUserAnswer('');
      setIsCorrect(null);
      setTimeout(() => {
        readExerciseStatement(nextIndex);
      }, 500);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopVocal();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            onClick={() => stopVocal()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✏️ Lire et écrire les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à écrire les nombres en chiffres ET en lettres !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                // Arrêt vocal renforcé avec double vérification
                try {
                  if ('speechSynthesis' in window) {
                    speechSynthesis.cancel();
                    setTimeout(() => {
                      if ('speechSynthesis' in window) {
                        speechSynthesis.cancel();
                      }
                    }, 100);
                  }
                } catch (error) {
                  console.warn('Erreur lors de l\'arrêt du vocal:', error);
                }
                
                // Réinitialiser tous les états
                setIsPlayingVocal(false);
                setHighlightedElement(null);
                setAnimatingLetterIndex(-1);
                setIsExplainingNumber(false);
                
                // Arrêter spécifiquement les fonctions vocales
                exerciseInstructionGivenRef.current = false;
                
                // Nettoyer les timers
                if (welcomeTimerRef.current) {
                  clearTimeout(welcomeTimerRef.current);
                  welcomeTimerRef.current = null;
                }
                
                setShowExercises(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                // Arrêt vocal renforcé avec double vérification
                try {
                  if ('speechSynthesis' in window) {
                    speechSynthesis.cancel();
                    setTimeout(() => {
                      if ('speechSynthesis' in window) {
                        speechSynthesis.cancel();
                      }
                    }, 100);
                  }
                } catch (error) {
                  console.warn('Erreur lors de l\'arrêt du vocal:', error);
                }
                
                // Réinitialiser tous les états
                setIsPlayingVocal(false);
                setHighlightedElement(null);
                setAnimatingLetterIndex(-1);
                setIsExplainingNumber(false);
                
                // Arrêter spécifiquement les fonctions vocales
                exerciseInstructionGivenRef.current = false;
                
                // Nettoyer les timers
                if (welcomeTimerRef.current) {
                  clearTimeout(welcomeTimerRef.current);
                  welcomeTimerRef.current = null;
                }
                
                setShowExercises(true);
                setTimeout(() => {
                  readExerciseStatement(0);
                }, 1500);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
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

            {/* Explication */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Deux façons d'écrire les nombres
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800 text-center">
                    🔢 En chiffres
                  </h3>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">7</div>
                    <p className="text-lg text-blue-700">C'est rapide à écrire !</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800 text-center">
                    📝 En lettres
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">sept</div>
                    <p className="text-lg text-green-700">On peut le lire !</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <p className="text-xl text-center text-gray-800 font-semibold">
                  💡 C'est le <strong>même nombre</strong>, écrit de deux façons différentes !
                </p>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div 
              id="number-selector"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-selector' 
                  ? 'ring-4 ring-yellow-400 shadow-2xl scale-105 bg-yellow-50' 
                  : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à explorer
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-6">
                {numbersWriting.slice(1, 21).map((num) => (
                  <button
                    key={num.chiffre}
                    onClick={() => {
                      setSelectedNumber(num.chiffre);
                      explainSelectedNumber(num.chiffre);
                    }}
                    disabled={isPlayingVocal}
                    className={`p-4 rounded-lg font-bold text-2xl transition-all ${
                      selectedNumber === num.chiffre
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${
                      isPlayingVocal ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {num.chiffre}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage détaillé */}
            <div 
              id="number-display"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-display' 
                  ? 'ring-4 ring-yellow-400 shadow-2xl scale-105 bg-yellow-50' 
                  : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Découvrons le nombre {selectedNumber}
              </h2>
              
              {(() => {
                const selected = numbersWriting.find(n => n.chiffre === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-8">
                    {/* Affichage principal */}
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8">
                      <div className="grid md:grid-cols-3 gap-8 items-center">
                        {/* En chiffres */}
                        <div className="text-center">
                          <h3 className="text-lg font-bold mb-4 text-purple-800">
                            🔢 En chiffres
                          </h3>
                          <div className={`bg-white rounded-lg p-6 shadow-md transition-all duration-500 ${
                            highlightedElement === 'selected-number' 
                              ? 'ring-4 ring-yellow-400 shadow-2xl scale-110 bg-yellow-50' 
                              : ''
                          }`}>
                            <div 
                              id="selected-number"
                              className="text-8xl font-bold text-purple-600"
                            >
                              {selected.chiffre}
                            </div>
                          </div>
                        </div>

                        {/* Égal */}
                        <div className="text-center">
                          <div className="text-6xl text-gray-600">=</div>
                        </div>

                        {/* En lettres */}
                        <div className="text-center">
                          <h3 className="text-lg font-bold mb-4 text-blue-800">
                            📝 En lettres
                          </h3>
                          <div className={`bg-white rounded-lg p-6 shadow-md transition-all duration-500 ${
                            highlightedElement === 'selected-letters' 
                              ? 'ring-4 ring-yellow-400 shadow-2xl scale-110 bg-yellow-50' 
                              : ''
                          }`}>
                            <div 
                              id="selected-letters"
                              className="text-4xl font-bold text-blue-600 flex justify-center"
                            >
                              {selected.lettres.split('').map((letter, index) => (
                                <span
                                  key={index}
                                  className={`transition-all duration-300 ${
                                    animatingLetterIndex === index && isExplainingNumber
                                      ? 'text-red-500 scale-150 animate-pulse bg-yellow-200 rounded-md px-1'
                                      : ''
                                  }`}
                                  style={{
                                    display: 'inline-block',
                                    marginRight: letter === '-' ? '4px' : '2px'
                                  }}
                                >
                                  {letter}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Représentation visuelle */}
                    <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-yellow-800 text-center">
                        👀 Avec des objets :
                      </h3>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 md:mb-4 tracking-wide text-gray-800">
                          {selected.visual}
                        </div>
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                          {selected.chiffre} = {selected.lettres}
                        </p>
                      </div>
                    </div>

                    {/* Prononciation */}
                    <div 
                      id="read-buttons"
                      className={`bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 text-center transition-all duration-500 ${
                        highlightedElement === 'read-buttons' 
                          ? 'ring-4 ring-yellow-400 shadow-2xl scale-105 bg-yellow-100' 
                          : ''
                      }`}
                    >
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-green-800">
                        🗣️ Comment on le dit :
                      </h3>
                      <button
                        onClick={() => speakText(selected.pronunciation)}
                        className="bg-green-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg lg:text-xl hover:bg-green-600 transition-colors"
                      >
                        <Volume2 className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                        {selected.pronunciation}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tableau des correspondances */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Tableau des écritures (0-20)
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-purple-600 bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-purple-200">
                      <th className="border-2 border-purple-600 p-4 text-purple-800 font-bold">En chiffres</th>
                      <th className="border-2 border-purple-600 p-4 text-purple-800 font-bold">En lettres</th>
                      <th className="border-2 border-purple-600 p-4 text-purple-800 font-bold">Audio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {numbersWriting.slice(0, 11).map((num) => (
                      <tr key={num.chiffre} className="hover:bg-purple-50">
                        <td className="border-2 border-purple-600 p-4 text-center text-3xl font-bold text-purple-600">
                          {num.chiffre}
                        </td>
                        <td className="border-2 border-purple-600 p-4 text-center text-2xl font-bold text-blue-600">
                          {num.lettres}
                        </td>
                        <td className="border-2 border-purple-600 p-4 text-center">
                          <button
                            onClick={() => speakText(num.pronunciation)}
                            className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg transition-colors"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jeu de correspondances INTERACTIF */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎮 Jeu : Trouve les paires !
              </h2>
              
              {/* Score et instructions */}
              <div className="text-center mb-6">
                <div className="text-xl font-bold text-purple-600 mb-2">
                  Score : {gameScore}/4 ✨
                </div>
                <p className="text-lg text-gray-700">
                  Clique d'abord sur un chiffre, puis sur le mot qui correspond !
                </p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* Colonne des chiffres */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-indigo-800 text-center">
                      🔢 Chiffres
                    </h3>
                    <div className="space-y-3">
                      {[
                        { chiffre: '6', lettres: 'six' },
                        { chiffre: '13', lettres: 'treize' },
                        { chiffre: '8', lettres: 'huit' },
                        { chiffre: '19', lettres: 'dix-neuf' }
                      ].map((pair, index) => (
                        <button
                          key={`chiffre-${index}`}
                          onClick={() => {
                            if (!matchedPairs.has(pair.chiffre)) {
                              setGameSelectedChiffre(pair.chiffre);
                              setGameSelectedLettre(null);
                              speakText(pair.chiffre);
                            }
                          }}
                          disabled={matchedPairs.has(pair.chiffre)}
                          className={`w-full p-4 rounded-lg text-center font-bold text-2xl transition-all ${
                            matchedPairs.has(pair.chiffre)
                              ? 'bg-green-400 text-white shadow-lg'
                              : gameSelectedChiffre === pair.chiffre
                              ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-300'
                              : 'bg-blue-200 text-gray-800 hover:bg-blue-300 cursor-pointer'
                          }`}
                        >
                          {pair.chiffre} {matchedPairs.has(pair.chiffre) ? '✅' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colonne des lettres */}
                  <div>
                    <h3 className="text-lg font-bold mb-4 text-indigo-800 text-center">
                      📝 Lettres  
                    </h3>
                    <div className="space-y-3">
                      {[
                        { chiffre: '6', lettres: 'six' },
                        { chiffre: '13', lettres: 'treize' },
                        { chiffre: '8', lettres: 'huit' },
                        { chiffre: '19', lettres: 'dix-neuf' }
                      ].map((pair, index) => (
                        <button
                          key={`lettres-${index}`}
                          onClick={() => {
                            if (!matchedPairs.has(pair.chiffre) && gameSelectedChiffre) {
                              setGameSelectedLettre(pair.lettres);
                              
                              // Vérifier si c'est une bonne correspondance
                              if (gameSelectedChiffre === pair.chiffre) {
                                // Bonne réponse !
                                setMatchedPairs(prev => new Set([...Array.from(prev), pair.chiffre]));
                                setGameScore(prev => prev + 1);
                                speakText("Bravo ! C'est correct !");
                                
                                // Réinitialiser la sélection
                                setTimeout(() => {
                                  setGameSelectedChiffre(null);
                                  setGameSelectedLettre(null);
                                  
                                  // Vérifier si le jeu est terminé
                                  if (gameScore + 1 === 4) {
                                    setShowGameSuccess(true);
                                    speakText("Félicitations ! Tu as trouvé toutes les paires !");
                                  }
                                }, 1500);
                              } else {
                                // Mauvaise réponse
                                speakText("Non, essaie encore !");
                                setTimeout(() => {
                                  setGameSelectedChiffre(null);
                                  setGameSelectedLettre(null);
                                }, 1000);
                              }
                            }
                          }}
                          disabled={matchedPairs.has(pair.chiffre) || !gameSelectedChiffre}
                          className={`w-full p-4 rounded-lg text-center font-bold text-lg transition-all ${
                            matchedPairs.has(pair.chiffre)
                              ? 'bg-green-400 text-white shadow-lg'
                              : gameSelectedLettre === pair.lettres
                              ? 'bg-orange-500 text-white shadow-lg ring-4 ring-orange-300'
                              : gameSelectedChiffre
                              ? 'bg-green-200 text-gray-800 hover:bg-green-300 cursor-pointer'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {pair.lettres} {matchedPairs.has(pair.chiffre) ? '✅' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bouton reset */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setGameSelectedChiffre(null);
                      setGameSelectedLettre(null);
                      setMatchedPairs(new Set());
                      setGameScore(0);
                      setShowGameSuccess(false);
                      speakText("Jeu remis à zéro ! À toi de jouer !");
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer le jeu
                  </button>
                </div>

                {/* Message de succès */}
                {showGameSuccess && (
                  <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <h3 className="text-xl font-bold mb-2">Parfait !</h3>
                    <p className="text-lg">Tu as trouvé toutes les paires ! Tu maîtrises l'écriture des nombres !</p>
                  </div>
                )}
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour bien lire et écrire</h3>
              <ul className="space-y-2 text-lg">
                <li>• Lis beaucoup de livres avec des nombres</li>
                <li>• Écris les nombres sur des étiquettes</li>
                <li>• Écoute attentivement la prononciation</li>
                <li>• Entraîne-toi avec des jeux de cartes</li>
                <li>• Demande à quelqu'un de te dicter des nombres</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Bouton de démonstration "Suivant" avec effet magique - TEMPORAIRE pour l'explication */}
            {highlightedElement === 'demo-next-button' && (
              <div className="flex justify-center">
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl ring-4 ring-yellow-400 animate-bounce scale-110 transform transition-all duration-1000 ease-out opacity-100">
                  ✨ Suivant → ✨
                </div>
              </div>
            )}

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage de la question */}
              <div className={`rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8 ${
                exercises[currentExercise].type === 'lecture' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                  {exercises[currentExercise].type === 'lecture' ? (
                    <Eye className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600 mr-2 sm:mr-3" />
                  ) : (
                    <Edit className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600 mr-2 sm:mr-3" />
                  )}
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                    {exercises[currentExercise].type === 'lecture' ? 'Je lis :' : 'J\'écris :'}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                  {exercises[currentExercise].display}
                </div>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-base sm:text-lg md:text-xl lg:text-2xl transition-all min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
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
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Parfait ! C'est bien "{exercises[currentExercise].correctAnswer}" !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... C'était "{exercises[currentExercise].correctAnswer}" !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback détaillé pour les réponses incorrectes */}
              {!isCorrect && isCorrect !== null && (
                <div className="bg-white rounded-lg p-6 border-2 border-blue-300 mb-6">
                  <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                    🎯 Écoute la bonne réponse !
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {exercises[currentExercise].type === 'lecture' 
                            ? `${exercises[currentExercise].display} = ${exercises[currentExercise].correctAnswer}`
                            : `${exercises[currentExercise].display} = ${exercises[currentExercise].correctAnswer}`
                          }
                        </div>
                        <div className="text-lg text-gray-700">
                          {exercises[currentExercise].type === 'lecture' 
                            ? `Le nombre "${exercises[currentExercise].display}" se dit : `
                            : `Le mot "${exercises[currentExercise].display}" s'écrit : `
                          }
                          <span className="font-bold text-blue-600">
                            {exercises[currentExercise].correctAnswer}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animation explicative */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                      <h5 className="text-md font-bold mb-3 text-indigo-800 text-center">
                        ✨ Regarde l'explication :
                      </h5>
                      <div className="flex items-center justify-center space-x-4">
                        {/* Côté gauche - ce qu'on voit */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-indigo-200 animate-pulse">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-indigo-700 mb-2">
                              {exercises[currentExercise].type === 'lecture' ? 'Je vois :' : 'Je lis :'}
                            </div>
                            <div className="text-3xl font-bold text-indigo-600">
                              {exercises[currentExercise].display}
                            </div>
                          </div>
                        </div>
                        
                        {/* Flèche animée */}
                        <div className="flex flex-col items-center">
                          <div className="text-2xl animate-bounce">➡️</div>
                          <div className="text-xs text-gray-600 mt-1">devient</div>
                        </div>
                        
                        {/* Côté droit - la réponse */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200 animate-pulse animation-delay-500">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-700 mb-2">
                              {exercises[currentExercise].type === 'lecture' ? 'Je dis :' : 'J\'écris :'}
                            </div>
                            <div className="text-3xl font-bold text-green-600">
                              {exercises[currentExercise].correctAnswer}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Représentation visuelle avec objets */}
                      {(() => {
                        const currentEx = exercises[currentExercise];
                        const numberData = numbersWriting.find(n => 
                          n.chiffre === currentEx.display || n.lettres === currentEx.display ||
                          n.chiffre === currentEx.correctAnswer || n.lettres === currentEx.correctAnswer
                        );
                        
                        if (numberData && numberData.visual) {
                          return (
                            <div className="mt-4 bg-yellow-50 rounded-lg p-3">
                              <div className="text-center">
                                <div className="text-sm font-semibold text-yellow-800 mb-2">
                                  👀 Avec des objets, ça donne :
                                </div>
                                <div className="text-2xl mb-2 animate-pulse animation-delay-1000 text-gray-800">
                                  {numberData.visual}
                                </div>
                                <div className="text-sm text-gray-700">
                                  = {numberData.chiffre} = {numberData.lettres}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => speakResult(exercises[currentExercise].correctAnswer)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Écouter la bonne réponse</span>
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                      <p className="text-sm font-semibold text-purple-800">
                        Maintenant tu sais ! {exercises[currentExercise].type === 'lecture' 
                          ? `"${exercises[currentExercise].display}" se dit "${exercises[currentExercise].correctAnswer}" !`
                          : `"${exercises[currentExercise].display}" s'écrit "${exercises[currentExercise].correctAnswer}" !`
                        }
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
                    className={`bg-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-600 transition-all ${
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
                  if (percentage >= 90) return { title: "🎉 Champion de l'écriture !", message: "Tu sais parfaitement lire et écrire les nombres !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu maîtrises bien la lecture et l'écriture ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Continue à t'entraîner !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux apprendre à lire et écrire !", emoji: "📚" };
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
                        {finalScore >= 10 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Savoir lire et écrire les nombres, c'est essentiel !
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