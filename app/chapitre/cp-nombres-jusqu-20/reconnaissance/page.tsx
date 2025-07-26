'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function ReconnaissanceNombresCP() {
  const [selectedNumber, setSelectedNumber] = useState('5');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // États pour le système vocal et animations
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  const userHasInteractedRef = useRef(false);
  
  // 🎵 NOUVEAUX ÉTATS POUR GESTION VOCALE ULTRA-ROBUSTE
  const shouldStopRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [animatedDotIndex, setAnimatedDotIndex] = useState<number>(-1);
  const exerciseInstructionGivenRef = useRef(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);

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

  // 🔄 FONCTION DE RÉINITIALISATION CENTRALISÉE
  const resetButtons = () => {
    console.log("🔄 RÉINITIALISATION DES BOUTONS - reconnaissance");
    setExerciseInstructionGiven(false);
    setHasStarted(false);
    exerciseInstructionGivenRef.current = false;
    hasStartedRef.current = false;
    // ⚠️ NE PAS réinitialiser userHasInteractedRef - on garde l'historique d'interaction
  };

  // 🔄 RÉINITIALISER les boutons à chaque chargement de page
  useEffect(() => {
    console.log("🔄 CHARGEMENT INITIAL - reconnaissance");
    resetButtons();
    
    // 🎯 DÉTECTER TOUTE INTERACTION UTILISATEUR
    const markUserInteraction = () => {
      userHasInteractedRef.current = true;
      console.log("✋ Interaction utilisateur détectée");
    };
    
    document.addEventListener('click', markUserInteraction);
    document.addEventListener('keydown', markUserInteraction);
    document.addEventListener('touchstart', markUserInteraction);
    
    // 🔄 VÉRIFICATION PÉRIODIQUE - Force la réinitialisation toutes les 2 secondes
    const intervalId = setInterval(() => {
      // Si les boutons ont disparu mais qu'on est sur la page, les remettre
      if (hasStartedRef.current || exerciseInstructionGivenRef.current) {
        console.log("🔄 VÉRIFICATION PÉRIODIQUE - réinitialisation forcée");
        resetButtons();
      }
    }, 2000);
    
    return () => {
      document.removeEventListener('click', markUserInteraction);
      document.removeEventListener('keydown', markUserInteraction);
      document.removeEventListener('touchstart', markUserInteraction);
      clearInterval(intervalId);
    };
  }, []); // Une seule fois au chargement

  // 🔍 DEBUG: Surveiller les changements d'exerciseInstructionGiven
  useEffect(() => {
    console.log("🔍 exerciseInstructionGiven changed to:", exerciseInstructionGiven);
  }, [exerciseInstructionGiven]);

  // 🔍 DEBUG: Surveiller les changements d'hasStarted
  useEffect(() => {
    console.log("🔍 hasStarted changed to:", hasStarted);
  }, [hasStarted]);

  // 🔄 RESET ULTIME au montage du composant
  useEffect(() => {
    console.log("🚀 MONTAGE COMPOSANT - reset ultime");
    setTimeout(() => {
      resetButtons();
    }, 500);
  }, []);

  // 🎵 GESTION VOCALE ULTRA-ROBUSTE - Event Listeners
  useEffect(() => {
    // 🎵 FONCTION DE NETTOYAGE VOCAL pour la sortie de page
    const handlePageExit = () => {
      console.log("🚪 SORTIE DE PAGE DÉTECTÉE - Arrêt des vocaux");
      stopAllVocals();
    };
    
    // 🔍 GESTION DE LA VISIBILITÉ (onglet caché/affiché)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👁️ PAGE CACHÉE - Arrêt des vocaux");
        stopAllVocals();
      } else {
        console.log("👁️ PAGE VISIBLE - Reset boutons");
        resetButtons();
      }
    };
    
    // 🏠 GESTION DE LA NAVIGATION
    const handleNavigation = () => {
      console.log("🔄 NAVIGATION DÉTECTÉE - Arrêt des vocaux");
      stopAllVocals();
    };
    
    // 🚪 EVENT LISTENERS pour sortie de page
    window.addEventListener('beforeunload', handlePageExit);
    window.addEventListener('pagehide', handlePageExit);
    window.addEventListener('unload', handlePageExit);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      // 🧹 NETTOYAGE COMPLET
      stopAllVocals();
      
      // Retirer les event listeners
      window.removeEventListener('beforeunload', handlePageExit);
      window.removeEventListener('pagehide', handlePageExit);
      window.removeEventListener('unload', handlePageExit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);



  // Fonction pour créer l'affichage des boules responsive
  const renderVisualDots = (visual: string, isCourse = false) => {
    // Compter le nombre de boules bleues
    const dotCount = (visual.match(/🔵/g) || []).length;
    const dots = Array(dotCount).fill('🔵');
    
    // Diviser en groupes de 5 maximum
    const groups = [];
    for (let i = 0; i < dots.length; i += 5) {
      groups.push(dots.slice(i, i + 5));
    }
    
    return (
      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex justify-center space-x-1 sm:space-x-2">
            {group.map((dot, dotIndex) => {
              const globalIndex = groupIndex * 5 + dotIndex;
              const isAnimated = animatedDotIndex === globalIndex;
              return (
                <span 
                  key={dotIndex} 
                  className={`${isCourse ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl md:text-3xl lg:text-4xl'} text-blue-600 transition-all duration-300 ${
                    isAnimated ? 'animate-bounce scale-150 bg-yellow-200 rounded-full px-1' : ''
                  }`}
                >
                  {dot}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'reconnaissance',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'reconnaissance');
      
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

  // Nombres pour le cours (adaptés CP)
  const numbers = [
    { value: '5', label: '5', reading: 'cinq', visual: '🔵🔵🔵🔵🔵' },
    { value: '8', label: '8', reading: 'huit', visual: '🔵🔵🔵🔵🔵🔵🔵🔵' },
    { value: '12', label: '12', reading: 'douze', visual: '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵' },
    { value: '17', label: '17', reading: 'dix-sept', visual: '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵' }
  ];

  // Exercices adaptés aux CP (plus simples) - positions des bonnes réponses variées
  const exercises = [
    { question: 'Combien vois-tu de points ?', visual: '🔵 🔵 🔵 🔵 🔵', correctAnswer: '5', choices: ['5', '4', '6'] },
    { question: 'Compte les ballons', visual: '🎈🎈🎈🎈🎈🎈🎈', correctAnswer: '7', choices: ['8', '6', '7'] },
    { question: 'Combien y a-t-il d\'objets ?', visual: '🍎🍎🍎', correctAnswer: '3', choices: ['2', '3', '4'] },
    { question: 'Compte les fleurs', visual: '🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸', correctAnswer: '10', choices: ['10', '11', '9'] },
    { question: 'Compte les cœurs', visual: '❤️❤️❤️❤️❤️❤️', correctAnswer: '6', choices: ['7', '5', '6'] },
    { question: 'Combien de bonbons ?', visual: '🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭🍭', correctAnswer: '14', choices: ['13', '15', '14'] },
    { question: 'Combien de doigts ?', visual: '✋✋', correctAnswer: '10', choices: ['10', '8', '12'] },
    { question: 'Compte les étoiles', visual: '⭐⭐⭐⭐⭐⭐⭐⭐⭐', correctAnswer: '9', choices: ['10', '9', '8'] },
    { question: 'Compte les voitures', visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗', correctAnswer: '18', choices: ['19', '17', '18'] },
    { question: 'Compte les points', visual: '🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵 🔵', correctAnswer: '12', choices: ['12', '13', '11'] },
    { question: 'Combien de papillons ?', visual: '🦋🦋🦋🦋🦋🦋🦋🦋', correctAnswer: '8', choices: ['9', '7', '8'] },
    { question: 'Compte les soleils', visual: '☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️', correctAnswer: '16', choices: ['16', '15', '17'] },
    { question: 'Combien de fruits ?', visual: '🍓🍓🍓🍓', correctAnswer: '4', choices: ['5', '4', '3'] },
    { question: 'Compte les diamants', visual: '💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎', correctAnswer: '20', choices: ['21', '19', '20'] },
    { question: 'Combien de chats ?', visual: '🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱', correctAnswer: '11', choices: ['11', '10', '12'] }
  ];



  // 🎵 IMPORT DU GESTIONNAIRE AUDIO HYBRIDE
  const { playCP20Audio, stopAllAudio, markUserInteraction } = require('../../../../lib/audioManager');
  
  // 🛑 FONCTION D'ARRÊT HYBRIDE
  const stopAllVocals = () => {
    console.log("🛑 ARRÊT HYBRIDE de tous les vocaux");
    
    // Utiliser le gestionnaire hybride
    stopAllAudio();
    
    // Signal d'arrêt local
    shouldStopRef.current = true;
    setIsPlayingVocal(false);
    
    // 🧹 NETTOYER LES TIMERS
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Alias pour compatibilité
  const playAudioSequence = playVocal;

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Fonction pour arrêter le vocal (alias pour compatibilité)
  const stopVocal = stopAllVocals;

  // Consigne générale pour la série d'exercices avec exemple détaillé de l'exercice 1
  const explainExercisesOnce = async () => {
    if (exerciseInstructionGivenRef.current) return;
    
    try {
      // 🎯 MARQUER L'INTERACTION UTILISATEUR
      userHasInteractedRef.current = true;
      
      stopAllVocals();
      shouldStopRef.current = false; // Reset signal pour nouvelle séquence
      exerciseInstructionGivenRef.current = true;
      setExerciseInstructionGiven(true);
      setIsPlayingVocal(true);
      
      // Fonction pour vérifier si on doit arrêter le vocal
      const shouldStop = () => {
        return !showExercises || !exerciseInstructionGivenRef.current || !document.hasFocus();
      };
      
      // S'assurer qu'on est sur l'exercice 1 pour l'exemple
      setCurrentExercise(0);
      await wait(200);
      
      if (shouldStop()) return;
      await playCP20Audio('reconnaissance', 'exercise-intro', "Super ! Tu vas faire une série d'exercices pour compter et reconnaître les nombres !");
      await wait(300);
      
      if (shouldStop()) return;
      await playAudioSequence("Je vais t'expliquer avec l'exercice 1 comme exemple !");
      await wait(300);
      
      if (shouldStop()) return;
      await playAudioSequence("Regarde bien la question de l'exercice 1 :");
      setHighlightedElement('exercise-question');
      await wait(2500);
      setHighlightedElement(null);
      await wait(200);
      
      if (shouldStop()) return;
      await playAudioSequence(exercises[0].question);
      setHighlightedElement('exercise-question');
      await wait(2000);
      setHighlightedElement(null);
      await wait(200);
      
      if (shouldStop()) return;
      await playAudioSequence("Maintenant, regarde les objets à compter :");
      setHighlightedElement('exercise-visual');
      await wait(2500);
      setHighlightedElement(null);
      await wait(200);
      
      if (shouldStop()) return;
      await playAudioSequence("Pour répondre, il faut compter chaque objet un par un !");
      await wait(2500);
      
      // Compter les objets du premier exercice avec animation
      if (shouldStop()) return;
      const firstExerciseCount = parseInt(exercises[0].correctAnswer);
      await playAudioSequence(`Comptons ensemble : `);
      await wait(500);
      
      for (let i = 0; i < firstExerciseCount; i++) {
        if (shouldStop()) return;
        await playAudioSequence(`${i + 1}`);
        setAnimatedDotIndex(i);
        await wait(800);
      }
      
      if (shouldStop()) return;
      setAnimatedDotIndex(-1);
      await wait(300);
      
      if (shouldStop()) return;
      await playAudioSequence(`En tout, j'ai compté ${firstExerciseCount} objets !`);
      await wait(2500);
      
      if (shouldStop()) return;
      await playAudioSequence("Maintenant, regarde les choix de réponses :");
      setHighlightedElement('exercise-choices');
      await wait(2500);
      setHighlightedElement(null);
      await wait(200);
      
      if (shouldStop()) return;
      await playAudioSequence(`La bonne réponse est ${firstExerciseCount}, parce que j'ai compté ${firstExerciseCount} objets !`);
      setHighlightedElement('exercise-choices');
      await wait(3500);
      setHighlightedElement(null);
      await wait(200);
      
      if (shouldStop()) return;
      await playAudioSequence("C'est comme ça que tu dois faire pour tous les exercices !");
      await wait(2000);
      
      if (shouldStop()) return;
      await playAudioSequence("Compte bien chaque objet et clique sur le bon nombre !");
      await wait(2500);
      
      if (shouldStop()) return;
      await playAudioSequence("Si tu te trompes, regarde bien la correction et appuie sur Suivant !");
      
      // Faire apparaître temporairement un bouton orange de démonstration
      setHighlightedElement('demo-next-button');
      await wait(2000);
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Effect principal pour gérer cours et exercices
  useEffect(() => {
    console.log("🔍 showExercises changed to:", showExercises);
    // Vocal automatique supprimé - les navigateurs modernes bloquent les vocaux sans interaction utilisateur
  }, [showExercises]);

  // Effect pour gérer la visibilité de la page et les sorties
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log("🔄 VISIBILITY CHANGE - hidden:", document.hidden);
      if (document.hidden) {
        console.log("🚪 PAGE CACHÉE - arrêt vocal");
        stopVocal();
      } else {
        console.log("👁️ PAGE VISIBLE - réinitialisation boutons");
        resetButtons();
      }
    };

    const handleBeforeUnload = () => {
      console.log("🚪 BEFORE UNLOAD - arrêt vocal");
      stopVocal();
    };

    const handlePageHide = () => {
      console.log("🚪 PAGE HIDE - arrêt vocal");
      stopVocal();
    };

    const handleFocus = () => {
      console.log("🎯 WINDOW FOCUS - réinitialisation boutons");
      resetButtons();
    };

    const handleBlur = () => {
      console.log("😴 WINDOW BLUR - arrêt vocal");
      stopVocal();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      console.log("📄 PAGE SHOW - persisted:", event.persisted);
      resetButtons();
    };

    const handlePopState = () => {
      console.log("⬅️ POP STATE - réinitialisation boutons");
      resetButtons();
    };

    const handleMouseEnter = () => {
      console.log("🐭 MOUSE ENTER - réinitialisation boutons");
      resetButtons();
    };

    const handleScroll = () => {
      console.log("📜 SCROLL - réinitialisation boutons");
      resetButtons();
    };

    // 🚀 DÉTECTION AGRESSIVE - tous les événements possibles
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('scroll', handleScroll);
    
    // Événements supplémentaires pour détecter le retour
    document.addEventListener('DOMContentLoaded', () => {
      console.log("📄 DOM CONTENT LOADED");
      resetButtons();
    });

    // 🔄 FORCE RESET après 1 seconde (au cas où les événements ratent)
    setTimeout(() => {
      console.log("⏰ TIMEOUT 1s - réinitialisation forcée");
      resetButtons();
    }, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('scroll', handleScroll);
      stopVocal();
    };
  }, []);







  // Explication du chapitre avec guidage vocal et animations détaillées
  const explainChapterGoal = async () => {
    try {
      // 🎯 MARQUER L'INTERACTION UTILISATEUR
      markUserInteraction();
      
      stopAllVocals();
      shouldStopRef.current = false; // Reset signal pour nouvelle séquence
      setIsPlayingVocal(true);
      setHasStarted(true);
      hasStartedRef.current = true;
      
      // Effacer les animations
      setAnimatedDotIndex(-1);

      // ÉTAPE 1: But du chapitre
      await playCP20Audio('reconnaissance', 'course-intro', "Super ! Tu vas apprendre à reconnaître les nombres jusqu'à 20 !");
      await wait(500);
      
      await playAudioSequence("Le but de ce chapitre, c'est de savoir compter les objets et dire le bon nombre !");
      await wait(2000);
      
      await playAudioSequence("Je vais te montrer étape par étape avec l'exemple du nombre 5 !");
      await wait(500);

      // ÉTAPE 2: Sélectionner le nombre 5 automatiquement
      setSelectedNumber('5');
      await wait(500);
      
      await playAudioSequence("Regarde, j'ai choisi le nombre 5 pour toi !");
      setHighlightedElement('number-selector');
      await wait(2500);
      setHighlightedElement(null);
      await wait(300);

      // ÉTAPE 3: Montrer le nombre 5
      await playAudioSequence("Voici le nombre 5 ! Regarde bien sa forme !");
      setHighlightedElement('number-display');
      await wait(2500);
      setHighlightedElement(null);
      await wait(300);

      // ÉTAPE 4: Explication détaillée du comptage avec animations
      await playAudioSequence("Maintenant, regardons les objets que ce nombre représente !");
      setHighlightedElement('visual-dots');
      await wait(2000);
      
      await playAudioSequence("Pour compter jusqu'à 5, on fait comme ça :");
      await wait(1000);
      
      // Compter chaque point avec animation
      await playAudioSequence("Un !");
      setAnimatedDotIndex(0);
      await wait(1200);
      
      await playAudioSequence("Deux !");
      setAnimatedDotIndex(1);
      await wait(1200);
      
      await playAudioSequence("Trois !");
      setAnimatedDotIndex(2);
      await wait(1200);
      
      await playAudioSequence("Quatre !");
      setAnimatedDotIndex(3);
      await wait(1200);
      
      await playAudioSequence("Cinq !");
      setAnimatedDotIndex(4);
      await wait(1500);
      
      // Arrêter l'animation
      setAnimatedDotIndex(-1);
      await wait(500);
      
      await playAudioSequence("En tout, j'ai compté 5 objets ! C'est pour ça qu'on écrit 5 !");
      await wait(2500);
      
      await playAudioSequence("Et on dit ce nombre : cinq !");
      await wait(2000);
      
      setHighlightedElement(null);
      await wait(500);

      // ÉTAPE 5: Autres exemples
      await playAudioSequence("Maintenant que tu comprends, essaie avec d'autres exemples !");
      await wait(500);
      
      await playAudioSequence("Tu peux essayer avec le 8 !");
      setHighlightedElement('number-selector');
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);
      
      await playAudioSequence("Ou avec le 12 !");
      setHighlightedElement('number-selector');
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);
      
      await playAudioSequence("Choisis n'importe quel nombre et découvre comment le compter !");
      await wait(500);
      
      await playAudioSequence("Quand tu es prêt, tu peux passer aux exercices pour t'entraîner !");
      
    } catch (error) {
      console.error('Erreur dans explainChapterGoal:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  const speakNumber = (text: string) => {
    // 🛡️ PROTECTION: Empêcher les vocaux automatiques sans interaction utilisateur
    if (!userHasInteractedRef.current) {
      console.warn("🚫 Vocal bloqué - aucune interaction utilisateur détectée");
      return;
    }
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string) => {
    const numbers: { [key: string]: string } = {
      '0': 'zéro',
      '1': 'un',
      '2': 'deux', 
      '3': 'trois',
      '4': 'quatre',
      '5': 'cinq',
      '6': 'six',
      '7': 'sept',
      '8': 'huit',
      '9': 'neuf',
      '10': 'dix',
      '11': 'onze',
      '12': 'douze',
      '13': 'treize',
      '14': 'quatorze',
      '15': 'quinze',
      '16': 'seize',
      '17': 'dix-sept',
      '18': 'dix-huit',
      '19': 'dix-neuf',
      '20': 'vingt'
    };
    return numbers[num] || num;
  };

  // Fonction pour dire le résultat en français
  const speakResult = (number: string) => {
    const numberWord = numberToWords(number);
    const text = `La bonne réponse est ${numberWord}`;
    speakNumber(text);
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

    // Si bonne réponse → passage automatique après 1.5s
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernier exercice terminé
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    stopVocal();
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
    stopVocal();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link 
              href="/chapitre/cp-nombres-jusqu-20" 
              onClick={() => {
                console.log("🎯 CLIC RETOUR CHAPITRE - arrêt vocal");
                stopVocal();
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au chapitre</span>
            </Link>
            

          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              👁️ Reconnaître les nombres de 0 à 20
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Apprends à identifier et nommer les nombres jusqu'à 20 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                console.log("🎯 CLIC ONGLET COURS - réinitialisation + arrêt");
                
                // Arrêt vocal ultra-robuste
                try {
                  stopAllVocals();
                } catch (error) {
                  console.warn('Erreur lors de l\'arrêt du vocal:', error);
                }
                
                // Réinitialiser tous les états
                setIsPlayingVocal(false);
                setHighlightedElement(null);
                setAnimatedDotIndex(-1);
                
                setShowExercises(false);
                
                // 🔄 FORCE RESET pour s'assurer que les boutons reviennent
                setTimeout(() => {
                  resetButtons();
                }, 100);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                !showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                console.log("🎯 CLIC ONGLET EXERCICES - réinitialisation + arrêt");
                
                // Arrêt vocal ultra-robuste
                try {
                  stopAllVocals();
                } catch (error) {
                  console.warn('Erreur lors de l\'arrêt du vocal:', error);
                }
                
                // Réinitialiser tous les états
                setIsPlayingVocal(false);
                setHighlightedElement(null);
                setAnimatedDotIndex(-1);
                
                setShowExercises(true);
                exerciseInstructionGivenRef.current = false;
                setExerciseInstructionGiven(false);
                
                // 🔄 FORCE RESET pour s'assurer que les boutons reviennent
                setTimeout(() => {
                  resetButtons();
                }, 100);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Bouton d'explication avec guidage vocal */}
            {(() => {
              console.log("🔍 COURS - hasStarted:", hasStarted, "| Affichage bouton COMMENCER:", !hasStarted);
              return !hasStarted;
            })() && (
              <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
                  🔢 Reconnaissance des nombres jusqu'à 20
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                  Apprends à reconnaître, lire et compter les nombres de 1 à 20 !
                </p>
                <button
                  onClick={explainChapterGoal}
                  disabled={isPlayingVocal}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all ${
                    isPlayingVocal
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce'
                  }`}
                >
                  {isPlayingVocal ? '🔊 Explication en cours...' : '▶️ COMMENCER !'}
                </button>
              </div>
            )}

            {/* Sélecteur de nombre */}
            <div 
              id="number-selector"
              className={`bg-white rounded-xl p-3 sm:p-6 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-selector' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105' : ''
              }`}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis un nombre à découvrir
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-6">
                {numbers.map((num) => (
                  <button
                    key={num.value}
                    onClick={() => {
                      stopVocal();
                      setSelectedNumber(num.value);
                    }}
                    className={`p-3 sm:p-6 rounded-lg font-bold text-lg sm:text-2xl transition-all ${
                      selectedNumber === num.value
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {num.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div 
              id="number-display"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center transition-all duration-500 ${
                highlightedElement === 'number-display' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105' : ''
              }`}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Découvrons le nombre {selectedNumber}
              </h3>
              
              {/* Grande visualisation du nombre */}
              <div className="bg-orange-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                <div className="text-5xl sm:text-8xl font-bold text-orange-600 mb-3 sm:mb-6">
                  {selectedNumber}
                </div>
                
                {/* Représentation visuelle avec points */}
                <div 
                  id="visual-dots"
                  className={`bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6 transition-all duration-500 ${
                    highlightedElement === 'visual-dots' ? 'bg-blue-50 ring-4 ring-blue-400 shadow-2xl scale-105' : ''
                  }`}
                >
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                    📊 Regarde avec des points :
                  </h4>
                  <div className="py-2 sm:py-4">
                    {renderVisualDots(numbers.find(n => n.value === selectedNumber)?.visual || '', true)}
                  </div>
                </div>

                {/* Lecture du nombre */}
                <div className="bg-yellow-50 rounded-lg p-3 sm:p-6">
                  <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-yellow-800">
                    🗣️ Comment on le dit :
                  </h4>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-900 mb-3 sm:mb-4">
                    {numbers.find(n => n.value === selectedNumber)?.reading}
                  </p>
                  <button
                    onClick={() => {
                      // 🎯 MARQUER L'INTERACTION UTILISATEUR
                      userHasInteractedRef.current = true;
                      
                      stopVocal();
                      speakNumber(numbers.find(n => n.value === selectedNumber)?.reading || '');
                    }}
                    className="bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-base sm:text-lg"
                  >
                    <Volume2 className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Écouter
                  </button>
                </div>
              </div>

              {/* Jeu de comparaison rapide */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-6">
                <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-blue-800">
                  🎮 Mini-jeu : Compare avec tes doigts !
                </h4>
                <p className="text-sm sm:text-lg text-blue-700 mb-2 sm:mb-4">
                  Lève {selectedNumber} doigt{parseInt(selectedNumber) > 1 ? 's' : ''} et regarde si c'est pareil !
                </p>
                <div className="text-3xl sm:text-6xl text-blue-800">
                  {parseInt(selectedNumber) <= 10 ? '✋'.repeat(Math.floor(parseInt(selectedNumber) / 5)) + '🤚'.slice(0, parseInt(selectedNumber) % 5) : '✋✋ + ' + (parseInt(selectedNumber) - 10) + ' doigts'}
                </div>
              </div>
            </div>

            {/* Conseils pour les petits */}
            <div className="bg-gradient-to-r from-pink-400 to-orange-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour bien reconnaître les nombres</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• Utilise tes doigts pour compter jusqu'à 10</li>
                <li>• Les nombres jusqu'à 20, c'est 10 + encore un peu</li>
                <li>• Regarde bien la forme du chiffre</li>
                <li>• Entraîne-toi à les dire à voix haute</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Recommencer
                </button>
              </div>

              {/* Bouton Instructions principal - style identique au bouton COMMENCER */}
              {(() => {
                console.log("🔍 EXERCICES - exerciseInstructionGiven:", exerciseInstructionGiven, "| Affichage bouton INSTRUCTIONS:", !exerciseInstructionGiven);
                return !exerciseInstructionGiven;
              })() && (
                <div className="text-center mb-6">
                  <button
                    onClick={explainExercisesOnce}
                    disabled={isPlayingVocal}
                    className={`bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                      !exerciseInstructionGiven ? 'animate-bounce' : ''
                    } ${
                      isPlayingVocal ? 'animate-pulse cursor-not-allowed opacity-75' : 'hover:from-orange-600 hover:to-yellow-600'
                    }`}
                    style={{
                      animationDuration: !exerciseInstructionGiven ? '2s' : 'none',
                      animationIterationCount: !exerciseInstructionGiven ? 'infinite' : 'none'
                    }}
                  >
                    <Volume2 className="inline w-6 h-6 mr-3" />
                    🔊 ÉCOUTER LES INSTRUCTIONS !
                  </button>
                </div>
              )}
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-orange-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-orange-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 
                id="exercise-question"
                className={`text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900 transition-all duration-500 ${
                  highlightedElement === 'exercise-question' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 rounded-lg p-2' : ''
                }`}
              >
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage de la question (nombre ou objets) */}
              <div 
                id="exercise-visual"
                className={`bg-white border-2 border-orange-200 rounded-lg p-2 sm:p-3 md:p-6 mb-3 sm:mb-6 transition-all duration-500 ${
                  highlightedElement === 'exercise-visual' ? 'bg-blue-50 ring-4 ring-blue-400 shadow-2xl scale-105' : ''
                }`}
              >
                <div className="py-1 sm:py-2 md:py-4">
                  {exercises[currentExercise].visual.includes('🔵') ? 
                    renderVisualDots(exercises[currentExercise].visual, false) :
                    <div className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-800 tracking-wider leading-relaxed">
                      {exercises[currentExercise].visual}
                    </div>
                  }
                </div>
              </div>
              
              {/* Choix multiples avec gros boutons */}
              <div 
                id="exercise-choices"
                className={`grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-8 transition-all duration-500 ${
                  highlightedElement === 'exercise-choices' ? 'bg-yellow-50 ring-4 ring-yellow-400 shadow-2xl scale-105 rounded-lg p-4' : ''
                }`}
              >
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl transition-all ${
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
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">Bravo ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Bouton d'écoute pour les mauvaises réponses */}
                  {!isCorrect && (
                    <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                      <h4 className="text-lg font-bold mb-3 text-blue-800 text-center">
                        🎯 Écoute la bonne réponse !
                      </h4>
                      
                      <div className="text-center space-y-3">
                        {/* Affichage du nombre correct */}
                        <div className="text-4xl font-bold text-blue-600">
                          {exercises[currentExercise].correctAnswer}
                        </div>
                        
                        <div className="text-lg text-gray-700">
                          Cela se dit : <span className="font-bold text-blue-600">{numberToWords(exercises[currentExercise].correctAnswer)}</span>
                        </div>
                        
                        {/* Bouton d'écoute */}
                        <button
                          onClick={() => speakResult(exercises[currentExercise].correctAnswer)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2 mx-auto"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Écouter la bonne réponse</span>
                        </button>
                        
                        {/* Message d'encouragement */}
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mt-4">
                          <div className="text-lg">🌟</div>
                          <p className="text-sm font-semibold text-purple-800">
                            Maintenant tu sais ! C'est {numberToWords(exercises[currentExercise].correctAnswer)} !
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent petit CP !", message: "Tu reconnais super bien les nombres jusqu'à 20 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu fais de beaux progrès ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu apprends bien ! Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux connaître tes nombres !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
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