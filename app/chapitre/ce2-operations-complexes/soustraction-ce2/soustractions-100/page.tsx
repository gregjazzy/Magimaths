'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star, Minus, ChevronDown } from 'lucide-react';

export default function SoustractionsJusqu100CE2() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedMethod, setHighlightedMethod] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États pour le personnage Minecraft (exercices)
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);
  const [exercisesImageError, setExercisesImageError] = useState(false);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des exemples de soustraction avec animations (4 exemples par technique)
  const subtractionExamples = [
    // 4 exemples pour la technique "Passage par dizaine"
    {
      id: 'complement10-1',
      title: 'Passage par dizaine',
      operation: '75 - 28',
      start: 75,
      remove: 28,
      result: 47,
      strategy: 'complement10',
      explanation: 'Je décompose 28 en 25 + 3, puis je calcule 75 - 25 = 50, et 50 - 3 = 47 !',
      item: '🎯',
      color: 'text-red-500',
      step1: 25, // Ce qu'on enlève pour arriver à 50
      step2: 3   // Ce qu'il reste à enlever
    },
    {
      id: 'complement10-2',
      title: 'Passage par dizaine',
      operation: '63 - 17',
      start: 63,
      remove: 17,
      result: 46,
      strategy: 'complement10',
      explanation: 'Je décompose 17 en 13 + 4, puis je calcule 63 - 13 = 50, et 50 - 4 = 46 !',
      item: '🎯',
      color: 'text-red-500',
      step1: 13, // Ce qu'on enlève pour arriver à 50
      step2: 4   // Ce qu'il reste à enlever
    },
    {
      id: 'complement10-3',
      title: 'Passage par dizaine',
      operation: '86 - 39',
      start: 86,
      remove: 39,
      result: 47,
      strategy: 'complement10',
      explanation: 'Je décompose 39 en 36 + 3, puis je calcule 86 - 36 = 50, et 50 - 3 = 47 !',
      item: '🎯',
      color: 'text-red-500',
      step1: 36, // Ce qu'on enlève pour arriver à 50
      step2: 3   // Ce qu'il reste à enlever
    },
    {
      id: 'complement10-4',
      title: 'Passage par dizaine',
      operation: '94 - 26',
      start: 94,
      remove: 26,
      result: 68,
      strategy: 'complement10',
      explanation: 'Je décompose 26 en 24 + 2, puis je calcule 94 - 24 = 70, et 70 - 2 = 68 !',
      item: '🎯',
      color: 'text-red-500',
      step1: 24, // Ce qu'on enlève pour arriver à 70
      step2: 2   // Ce qu'il reste à enlever
    },

    // 4 exemples pour la technique "Décomposition par dizaines"
    {
      id: 'decomposition-1',
      title: 'Décomposition par dizaines',
      operation: '84 - 37',
      start: 84,
      remove: 37,
      result: 47,
      strategy: 'decomposition',
      explanation: 'Pour 84 - 37, on peut faire 84 - 40 + 3 = 44 + 3 = 47 !',
      item: '🧮',
      color: 'text-blue-500',
      decompositionStep: 40, // On enlève 40 d'abord
      correction: 3 // Puis on remet 3
    },
    {
      id: 'decomposition-2',
      title: 'Décomposition par dizaines',
      operation: '76 - 28',
      start: 76,
      remove: 28,
      result: 48,
      strategy: 'decomposition',
      explanation: 'Pour 76 - 28, on peut faire 76 - 30 + 2 = 46 + 2 = 48 !',
      item: '🧮',
      color: 'text-blue-500',
      decompositionStep: 30, // On enlève 30 d'abord
      correction: 2 // Puis on remet 2
    },
    {
      id: 'decomposition-3',
      title: 'Décomposition par dizaines',
      operation: '92 - 45',
      start: 92,
      remove: 45,
      result: 47,
      strategy: 'decomposition',
      explanation: 'Pour 92 - 45, on peut faire 92 - 50 + 5 = 42 + 5 = 47 !',
      item: '🧮',
      color: 'text-blue-500',
      decompositionStep: 50, // On enlève 50 d'abord
      correction: 5 // Puis on remet 5
    },
    {
      id: 'decomposition-4',
      title: 'Décomposition par dizaines',
      operation: '68 - 29',
      start: 68,
      remove: 29,
      result: 39,
      strategy: 'decomposition',
      explanation: 'Pour 68 - 29, on peut faire 68 - 30 + 1 = 38 + 1 = 39 !',
      item: '🧮',
      color: 'text-blue-500',
      decompositionStep: 30, // On enlève 30 d'abord
      correction: 1 // Puis on remet 1
    },

    // 4 exemples pour la technique "Compensation"
    {
      id: 'compensation-1',
      title: 'Compensation',
      operation: '72 - 29',
      start: 72,
      remove: 29,
      result: 43,
      strategy: 'compensation',
      explanation: 'Pour 72 - 29, on transforme en 73 - 30 = 43 ! Plus facile !',
      item: '⚖️',
      color: 'text-purple-500',
      adjustment: 1 // Ce qu'on ajoute aux deux nombres
    },
    {
      id: 'compensation-2',
      title: 'Compensation',
      operation: '85 - 39',
      start: 85,
      remove: 39,
      result: 46,
      strategy: 'compensation',
      explanation: 'Pour 85 - 39, on transforme en 86 - 40 = 46 ! Plus facile !',
      item: '⚖️',
      color: 'text-purple-500',
      adjustment: 1 // Ce qu'on ajoute aux deux nombres
    },
    {
      id: 'compensation-3',
      title: 'Compensation',
      operation: '63 - 28',
      start: 63,
      remove: 28,
      result: 35,
      strategy: 'compensation',
      explanation: 'Pour 63 - 28, on transforme en 65 - 30 = 35 ! Plus facile !',
      item: '⚖️',
      color: 'text-purple-500',
      adjustment: 2 // Ce qu'on ajoute aux deux nombres
    },
    {
      id: 'compensation-4',
      title: 'Compensation',
      operation: '91 - 47',
      start: 91,
      remove: 47,
      result: 44,
      strategy: 'compensation',
      explanation: 'Pour 91 - 47, on transforme en 94 - 50 = 44 ! Plus facile !',
      item: '⚖️',
      color: 'text-purple-500',
      adjustment: 3 // Ce qu'on ajoute aux deux nombres
    }
  ];

  // Exercices pour les élèves (adaptés pour les nombres jusqu'à 100)
  const exercises = [
    {
      question: 'Calcule : 76 - 28', 
      correctAnswer: '48'
    },
    {
      question: 'Calcule : 85 - 23', 
      correctAnswer: '62'
    },
    {
      question: 'Calcule : 94 - 37', 
      correctAnswer: '57'
    },
    {
      question: 'Calcule : 68 - 29', 
      correctAnswer: '39'
    },
    {
      question: 'Calcule : 83 - 47', 
      correctAnswer: '36'
    },
    {
      question: 'Calcule : 92 - 35', 
      correctAnswer: '57'
    },
    {
      question: 'Calcule : 71 - 26', 
      correctAnswer: '45'
    },
    {
      question: 'Calcule : 86 - 49', 
      correctAnswer: '37'
    },
    {
      question: 'Calcule : 93 - 58', 
      correctAnswer: '35'
    },
    {
      question: 'Calcule : 84 - 56', 
      correctAnswer: '28'
    },
    {
      question: 'Calcule : 75 - 38', 
      correctAnswer: '37'
    },
    {
      question: 'Calcule : 91 - 44', 
      correctAnswer: '47'
    }
  ];

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    // Arrêter AGRESSIVEMENT la synthèse vocale
    speechSynthesis.cancel();
    console.log('🔇 speechSynthesis.cancel() appelé');
    
    // Double sécurité : réessayer l'arrêt après un délai
    setTimeout(() => {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        console.log('🔇 Double arrêt speechSynthesis');
      }
    }, 50);
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    // Réinitialiser tous les états pour éviter les conflits
    setIsPlayingVocal(false);
    setExercisesIsPlayingVocal(false);
    setHighlightedElement(null);
    setHighlightedMethod(null);
    setIsAnimationRunning(false);
    setAnimatingStep(null);
    setCurrentExample(null);

    setCurrentStep(null);
    // Note: on ne remet pas pirateIntroStarted à false pour garder Sam visible
  };

  // Fonction pour jouer l'audio (pattern des autres pages)
  const playAudio = (text: string, slowMode: boolean | 'slow' = false): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        console.log('🛑 playAudio: stopSignal actif');
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
        resolve();
        return;
      }

      // FORCER l'arrêt de tout audio précédent
      speechSynthesis.cancel();
      
      // Attendre plus longtemps pour s'assurer que l'arrêt est effectif
      setTimeout(() => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        
        // Double sécurité : re-cancel au cas où
        speechSynthesis.cancel();

      try {
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.rate = slowMode === 'slow' ? 0.8 : slowMode ? 1.0 : 1.3;
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

        // Attendre que les voix soient chargées
        let voices = speechSynthesis.getVoices();
        
        // Si pas de voix, attendre qu'elles se chargent
        if (voices.length === 0) {
          console.log('⏳ Attente du chargement des voix...');
          speechSynthesis.addEventListener('voiceschanged', () => {
            voices = speechSynthesis.getVoices();
            console.log('🔄 Voix rechargées:', voices.length);
          });
          // Recharger les voix directement
          voices = speechSynthesis.getVoices();
        }
        
        console.log('🔍 Voix disponibles:', voices.length);
        console.log('🔍 Voix françaises:', voices.filter(v => v.lang.startsWith('fr')));
        
        const frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
        if (frenchVoice) {
          utterance.voice = frenchVoice;
          console.log('✅ Voix sélectionnée:', frenchVoice.name, frenchVoice.lang);
        } else {
          console.warn('⚠️ Aucune voix française trouvée, utilisation voix par défaut');
          // Forcer une voix par défaut
          if (voices.length > 0) {
            utterance.voice = voices[0];
            console.log('🔄 Voix par défaut:', voices[0].name, voices[0].lang);
          }
        }
        
        utterance.onstart = () => {
          console.log('🎵 Audio démarré');
        };
        
        utterance.onend = () => {
          console.log('✅ Audio terminé');
          setIsPlayingVocal(false);
          currentAudioRef.current = null;
          resolve();
        };
        
        utterance.onerror = (event) => {
          console.error('Erreur synthèse vocale:', event.error);
          currentAudioRef.current = null;
          setIsPlayingVocal(false);
          
          // Ignorer l'erreur "interrupted" qui est normale quand on arrête l'audio
          if (event.error === 'interrupted' || event.error === 'canceled') {
            console.log('Audio interrompu - comportement normal');
            resolve();
          } else {
            resolve();
          }
        };
        
        currentAudioRef.current = utterance;
        
        console.log('🚀 Lancement speechSynthesis.speak()');
        
        // Variable pour tracker si l'audio a démarré
        let hasStarted = false;
        
        // Timeout de sécurité si l'audio ne démarre pas
        const startTimeout = setTimeout(() => {
          if (!hasStarted && !speechSynthesis.speaking) {
            console.warn('⚠️ Audio ne démarre pas après 2s');
            speechSynthesis.cancel();
          } else if (speechSynthesis.speaking) {
            console.log('✅ Audio fonctionne mais onstart pas déclenché');
            hasStarted = true; // Considérer comme démarré
          }
        }, 2000); // Augmenté à 2 secondes
        
        utterance.onstart = () => {
          console.log('Audio démarré via onstart');
        };
        
        try {
          // Forcer le réveil de speechSynthesis
          if (speechSynthesis.paused) {
            speechSynthesis.resume();
          }
          
          // Définir isPlayingVocal AVANT l'appel car onstart peut ne pas se déclencher
          setIsPlayingVocal(true);
          speechSynthesis.speak(utterance);
          console.log('📢 speechSynthesis.speak() appelé');
          
          // Vérifier si speechSynthesis est en cours
          setTimeout(() => {
            console.log('🔍 État speechSynthesis:', {
              speaking: speechSynthesis.speaking,
              pending: speechSynthesis.pending,
              paused: speechSynthesis.paused
            });
          }, 100);
          
        } catch (error) {
          clearTimeout(startTimeout);
          console.error('💥 Erreur lors de speechSynthesis.speak():', error);
          setIsPlayingVocal(false);
          currentAudioRef.current = null;
          resolve();
        }
      } catch (error) {
        console.error('Erreur dans playAudio:', error);
        setIsPlayingVocal(false);
        resolve();
      }
      }, 200); // Fermeture du setTimeout - délai augmenté pour éviter les chevauchements
    });
  };

  // Fonction pour attendre
  const wait = async (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        resolve();
      }, ms);
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

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setHasStarted(true);
    setPirateIntroStarted(true);

    try {
      // Introduction - Objectif du chapitre
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await wait(500);

      if (stopSignalRef.current) return;

      await playAudio("L'objectif est de maîtriser les soustractions avec des nombres encore plus grands en utilisant des techniques de champion !", true);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Présentation des trois méthodes
      setHighlightedElement('strategies');
      scrollToSection('strategies-section');
      await playAudio("Pour y arriver, je vais te montrer trois méthodes super efficaces adaptées aux grands nombres !", true);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Scroll vers les exemples pour voir les cartes
      scrollToSection('examples-section');
      await wait(800);

      // Méthode 1 : Passage par dizaine
      setHighlightedMethod('complement10');
      await playAudio("Première méthode : passage par dizaine ! On décompose pour passer par des dizaines rondes.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Méthode 2 : Décomposition par dizaines
      setHighlightedMethod('decomposition');
      await playAudio("Deuxième méthode : décomposition par dizaines ! On sépare le nombre en dizaines et unités.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Méthode 3 : Compensation
      setHighlightedMethod('compensation');
      await playAudio("Troisième méthode : la compensation ! On transforme les nombres pour rendre le calcul plus facile.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Conclusion
      setHighlightedMethod(null);
      setHighlightedElement('examples');
      await playAudio("Maintenant, choisis une méthode pour voir une animation magique qui t'explique tout !", true);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Message de Sam pour passer aux exercices
      await playAudio("Dès que tu auras bien compris, tu pourras faire les exercices !", true);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Scroll vers les exercices et illumination
      setHighlightedElement('exercise_tab');
      await wait(500);
      
      // Scroll vers le haut pour voir les onglets
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await wait(2000);

      // Arrêter l'illumination
      setHighlightedElement(null);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setHighlightedMethod(null);
    }
  };

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    console.log(`🎯 explainSpecificExample appelé pour index ${index}`);
    
    // Protection contre les appels multiples
    if (isPlayingVocal && currentExample !== null) {
      console.log('🛑 Animation déjà en cours, ignore le clic');
      return;
    }
    
    stopAllVocalsAndAnimations();
    await wait(1000); // Délai encore plus long pour éviter les chevauchements audio
    stopSignalRef.current = false;
    
    // Réinitialiser les états d'animation pour le nouvel exemple
    setAnimatingStep(null);
    setCurrentStep(null);
    
    const example = subtractionExamples[index];
    setCurrentExample(index);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Présentation de l'exemple
      setHighlightedElement('example-title');
      await wait(500);
      
      if (stopSignalRef.current) return;

      // Animation selon la stratégie
      if (example.strategy === 'complement10') {
        await animateComplement10Strategy(example);
      } else if (example.strategy === 'decomposition') {
        await animateDecompositionStrategy(example);
      } else if (example.strategy === 'compensation') {
        await animateCompensationStrategy(example);
      }

      // Laisser l'animation dans son état final
      await wait(1000);

    } finally {
      // Pause de 1,5 seconde à la fin pour laisser l'élève comprendre
      if (!stopSignalRef.current) {
        await wait(1500);
      }
      setHighlightedElement(null);
      // NE PAS réinitialiser les états d'animation pour garder l'historique visible
      // L'historique sera effacé seulement au prochain exemple ou lors d'un stop manuel
    }
  };

  // Animation pour la stratégie passage par dizaine
  const animateComplement10Strategy = async (example: any) => {
    // Étape 1 : Présentation du calcul mental
    setCurrentStep('step1');
 // Pas d'objets enlevés, juste du calcul mental
    setAnimatingStep('complement10-step1');
    scrollToSection('animation-section');
    await playAudio(`Pour ${example.start} moins ${example.remove}, utilisons la technique du passage par dizaine !`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 2 : Montrer la décomposition mentale
    setCurrentStep('step2');
    setAnimatingStep('complement10-step2');
    scrollToSection('animation-section'); // Scroll pour voir l'étape
    await playAudio(`Première étape : je décompose ${example.remove} en ${example.step1} plus ${example.step2}. Donc ${example.remove} égale ${example.step1} plus ${example.step2}.`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 3 : Premier calcul mental
    setAnimatingStep('complement10-step3');
    scrollToSection('animation-section'); // Scroll pour voir l'étape
    const intermediateResult = example.start - example.step1;
    await playAudio(`Deuxième étape : ${example.start} moins ${example.step1} égale ${intermediateResult}. C'est plus facile car ${intermediateResult} est une dizaine ronde !`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 4 : Deuxième calcul mental
    setCurrentStep('result');
    setAnimatingStep('complement10-result');
    scrollToSection('animation-section'); // Scroll pour voir le résultat
    await playAudio(`Troisième étape : ${intermediateResult} moins ${example.step2} égale ${example.result}. Résultat final : ${example.start} moins ${example.remove} égale ${example.result} ! Le passage par dizaine facilite le calcul mental !`, true);
    await wait(2000);
    
    // L'animation reste affichée à la fin
  };

  // Animation pour la stratégie de décomposition
  const animateDecompositionStrategy = async (example: any) => {
    // Étape 1 : Initialisation
    setCurrentStep('step1');

    setAnimatingStep('decomposition-step1');
    scrollToSection('animation-section');
    await playAudio(`Voici ${example.start} objets ! Nous allons utiliser la technique de décomposition.`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 2 : Enlever plus que nécessaire (stratégie de décomposition)
    const stepToRemove = example.decompositionStep || 40; // Utiliser la valeur de l'exemple ou 40 par défaut
    scrollToSection('animation-section'); // Scroll pour voir l'étape
    await playAudio(`Première étape : pour enlever ${example.remove}, on va d'abord enlever ${stepToRemove} objets. ${example.start} moins ${stepToRemove} égale ${example.start - stepToRemove}. Mais attention, on en a enlevé trop !`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 3 : Transition - on réalise l'erreur
    setCurrentStep('step2');
    setAnimatingStep('decomposition-step2');
    scrollToSection('animation-section'); // Scroll pour voir l'étape
    await playAudio(`On voulait enlever seulement ${example.remove}, mais on en a enlevé ${stepToRemove}. Il faut corriger !`, true);
    await wait(1500);
      
    if (stopSignalRef.current) return;

    // Étape 4 : Correction
    const correction = example.correction || 3; // Utiliser la valeur de l'exemple ou 3 par défaut
    scrollToSection('animation-section'); // Scroll pour voir la correction
    await playAudio(`On remet ${correction} objets pour corriger notre erreur. ${example.start - stepToRemove} plus ${correction} égale ${example.result} ! C'est notre résultat final : ${example.start} moins ${example.remove} égale ${example.result} !`, true);

    setCurrentStep('result');
    setAnimatingStep('decomposition-result');
    await wait(2000);
    
    // L'animation reste affichée à la fin
  };

  // Animation pour la stratégie de compensation
  const animateCompensationStrategy = async (example: any) => {
    // Étape 1 : Préparation de la compensation - montrer les nombres originaux
    setCurrentStep('step1');

    setAnimatingStep('compensation-step1');
    scrollToSection('animation-section');
    await playAudio(`Nous avons ${example.start} moins ${example.remove}. Utilisons la technique de compensation !`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 2 : Transformation des nombres (visualisation conceptuelle)
    scrollToSection('animation-section'); // Scroll pour voir la transformation
    await playAudio(`Première étape : on ajoute ${example.adjustment} aux deux nombres pour simplifier. ${example.start} devient ${example.start + example.adjustment}, et ${example.remove} devient ${example.remove + example.adjustment}.`, true);
    await wait(2000);

    if (stopSignalRef.current) return;

    // Étape 3 : Calcul avec les nouveaux nombres
    setCurrentStep('step2');
    setAnimatingStep('compensation-step2');
    scrollToSection('animation-section'); // Scroll pour voir le calcul
    await playAudio(`Deuxième étape : maintenant c'est plus facile ! ${example.start + example.adjustment} moins ${example.remove + example.adjustment} égale ${example.result}.`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape finale : Résultat
    setCurrentStep('result');
    setAnimatingStep('compensation-result');
    scrollToSection('animation-section'); // Scroll pour voir le résultat final
    await playAudio(`Parfait ! ${example.start} moins ${example.remove} égale ${example.result} ! La compensation rend les calculs beaucoup plus simples !`, true);
    await wait(2000);
    
    // L'animation reste affichée à la fin
  };

  // Fonction pour présenter la section exercices spécifiquement
  const explainExercisesWithSam = async () => {
    if (exercisesIsPlayingVocal) return;
    
    setExercisesIsPlayingVocal(true);
    setExercisesHasStarted(true);
    stopSignalRef.current = false;
    
    const speak = (text: string, highlightElement?: string) => {
      return new Promise<void>((resolve) => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        
        if (highlightElement) {
          setHighlightedElement(highlightElement);
        }
        
            const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          if (highlightElement) {
            setTimeout(() => setHighlightedElement(''), 300);
          }
          resolve();
        };
        
        utterance.onerror = () => resolve();
        currentAudioRef.current = utterance;
        speechSynthesis.speak(utterance);
      });
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      // S'assurer qu'on est déjà dans la section exercices
      if (!showExercises) {
        setShowExercises(true);
        await wait(500);
      }
      
      // Parler sans await pour ne pas bloquer les animations
      speak("Bienvenue dans la section exercices de soustractions jusqu'à 100 !");
      await wait(3000);
      if (stopSignalRef.current) return;

      // Présenter le header avec animation PENDANT l'audio
      speak("Ici tu peux voir ton exercice actuel et ton score !", 'exercises-header');
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présenter la question avec animation PENDANT l'audio
      speak("Voici la question de soustraction que tu dois résoudre !");
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présenter le bouton écouter avec animation PENDANT l'audio
      speak("Tu peux écouter l'énoncé en cliquant sur ce bouton bleu !", 'listen-button');
      await wait(3500);
      if (stopSignalRef.current) return;
      
      // Présenter la zone de réponse avec animation PENDANT l'audio
      speak("Tape ta réponse ici dans cette case !", 'answer-input');
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présenter le bouton valider avec animation PENDANT l'audio
      speak("Puis clique sur Valider pour vérifier ta réponse !", 'validate-button');
      await wait(3500);
      if (stopSignalRef.current) return;
      
      speak("Si ta réponse est correcte, tu passeras automatiquement à l'exercice suivant !");
      await wait(3500);
      if (stopSignalRef.current) return;
      
      speak("Si tu te trompes, je te montrerai une animation pour t'expliquer la bonne méthode !");
      await wait(3500);
      if (stopSignalRef.current) return;
      
      // Présenter le score en haut avec animation PENDANT l'audio
      speak("Ton score s'affiche ici ! Essaie d'avoir le maximum de points !", 'score-display');
      await wait(3500);
      if (stopSignalRef.current) return;
      
      speak("N'oublie pas : utilise les techniques que tu as apprises dans le cours !");
      await wait(4000);
      if (stopSignalRef.current) return;
      
      speak("Allez, à toi de jouer maintenant ! Bonne chance !");
      await wait(3000);
      
    } catch (error) {
      console.error('Erreur lors de l\'explication des exercices:', error);
    } finally {
      if (!stopSignalRef.current) {
        setExercisesIsPlayingVocal(false);
        setHighlightedElement('');
      }
    }
  };

  // Fonction pour rendre une soustraction posée avec animations
  const renderPostedSubtraction = (example: any, isAnimated = false) => {
    const maxDigits = Math.max(example.num1.toString().length, example.num2.toString().length, example.result.toString().length);
    const num1Str = example.num1.toString().padStart(maxDigits, ' ');
    const num2Str = example.num2.toString().padStart(maxDigits, ' ');
    const resultStr = example.result.toString().padStart(maxDigits, ' ');
    
    return (
      <div className={`bg-gradient-to-br from-white to-red-50 p-8 rounded-xl shadow-lg border-2 transition-all duration-500 ${
        isAnimated ? 'border-red-400 bg-red-50 scale-105 shadow-xl' : 'border-gray-200'
      }`}>
        <div className="flex justify-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="font-mono text-2xl text-gray-800 text-center">
                <div>{num1Str}</div>
                <div>- {num2Str}</div>
                <div className="border-t-2 border-gray-400 pt-1">
                  {isAnimated ? resultStr : '?'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour expliquer une mauvaise réponse avec animation détaillée
  const explainWrongAnswer = async (exercise: any) => {
    stopAllVocalsAndAnimations();
    await wait(500);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(0); // Pour utiliser les animations existantes
    
    // Extraire les nombres de l'exercice
    const match = exercise.question.match(/Calcule : (\d+) - (\d+)/);
    if (!match) {
      setIsAnimationRunning(false);
      return;
    }
    
    const num1 = parseInt(match[1]);
    const num2 = parseInt(match[2]);
    const result = parseInt(exercise.correctAnswer);
    
    try {
      // Introduction de la correction
      await playAudio(`Ne t'inquiète pas ! Je vais t'expliquer comment calculer ${num1} moins ${num2} étape par étape !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      // Scroll vers la section de correction dans les exercices
      const correctionElement = document.getElementById('correction-animation');
      if (correctionElement) {
        correctionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Choisir la meilleure technique selon les nombres
      let technique = 'decomposition';
      if (num2 % 10 >= 8 || num2 % 10 <= 2) {
        technique = 'complement10';
      } else if (Math.abs(num2 - Math.round(num2 / 10) * 10) <= 2) {
        technique = 'compensation';
      }
      
      if (technique === 'complement10') {
        // Technique du complément à 10
        const roundedNum2 = Math.ceil(num2 / 10) * 10;
        const difference = roundedNum2 - num2;
        const intermediate = num1 - roundedNum2;
        
        setAnimatingStep('complement10-step1');
        setCurrentStep('step1');
        await playAudio(`Première technique : le complément à 10. Au lieu d'enlever ${num2}, je vais enlever ${roundedNum2} qui est une dizaine ronde !`, true);
        if (stopSignalRef.current) return;
        
        await wait(2000);
        setCurrentStep('step2');
        await playAudio(`${num1} moins ${roundedNum2} égale ${intermediate}. C'est plus facile avec les dizaines rondes !`, true);
        if (stopSignalRef.current) return;
        
        await wait(2000);
        setCurrentStep('result');
        await playAudio(`Mais j'ai enlevé ${difference} de trop ! Donc je rajoute ${difference} : ${intermediate} plus ${difference} égale ${result} !`, true);
        if (stopSignalRef.current) return;
        
      } else if (technique === 'decomposition') {
        // Technique de décomposition
        const tens = Math.floor(num2 / 10) * 10;
        const units = num2 % 10;
        const afterTens = num1 - tens;
        
        setAnimatingStep('decomposition-step1');
        setCurrentStep('step1');
        await playAudio(`Deuxième technique : la décomposition. Je vais séparer ${num2} en ${tens} plus ${units} !`, true);
        if (stopSignalRef.current) return;
        
        await wait(2000);
        setCurrentStep('step2');
        await playAudio(`D'abord ${num1} moins ${tens} égale ${afterTens}. C'est plus simple de calculer avec les dizaines !`, true);
        if (stopSignalRef.current) return;
        
        await wait(2000);
        setCurrentStep('result');
        await playAudio(`Ensuite ${afterTens} moins ${units} égale ${result} ! Voilà le résultat final !`, true);
        if (stopSignalRef.current) return;
        
      } else {
        // Technique de compensation
        const adjustment = Math.round(num2 / 10) * 10 - num2;
        const newNum1 = num1 + adjustment;
        const newNum2 = num2 + adjustment;
        
        setAnimatingStep('compensation-step1');
        setCurrentStep('step1');
        await playAudio(`Troisième technique : la compensation. Je vais modifier les deux nombres de la même façon !`, true);
        if (stopSignalRef.current) return;
        
        await wait(2000);
        setCurrentStep('step2');
        await playAudio(`J'ajoute ${adjustment} aux deux nombres : ${newNum1} moins ${newNum2} ! C'est plus facile à calculer !`, true);
        if (stopSignalRef.current) return;
        
        await wait(2000);
        setCurrentStep('result');
        await playAudio(`${newNum1} moins ${newNum2} égale ${result} ! Le résultat reste le même avec la compensation !`, true);
        if (stopSignalRef.current) return;
      }
      
      await wait(2000);
      await playAudio(`Donc ${num1} moins ${num2} égale ${result} ! Tu vois comme c'est logique avec les bonnes techniques ?`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Maintenant tu connais plusieurs façons de calculer ! Essaie la suivante !", true);
      if (stopSignalRef.current) return;
      
      // Scroll vers le bouton suivant à la fin de la correction
      await wait(1000);
      const nextButton = document.querySelector('button[class*="bg-green-500"]');
      if (nextButton) {
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsAnimationRunning(false);
      // NE PAS réinitialiser les états d'animation pour laisser la correction visible
      // setCurrentExample(null);
      // setAnimatingStep(null);
      // setCurrentStep(null);
    }
  };

  // Gestion des exercices
  const handleAnswerClick = async (answer: string) => {
    stopAllVocalsAndAnimations();
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

    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    } else {
      // Lancer l'animation d'explication pour les mauvaises réponses
      setTimeout(() => {
        explainWrongAnswer(exercises[currentExercise]);
      }, 1000);
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    
    // Réinitialiser les états d'animation quand on passe à l'exercice suivant
    setCurrentExample(null);
    setAnimatingStep(null);
    setCurrentStep(null);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Maître des soustractions jusqu'à 100 !", message: "Tu maîtrises parfaitement toutes les techniques !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
  };

  // JSX pour l'introduction de Sam le Pirate
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
            <div
              className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-lg"
              style={{ animation: 'pulse 1s infinite' }}
            >
              <div className="text-xs sm:text-sm">🔊</div>
            </div>
          )}
        </div>
        
        {/* Bulle de dialogue */}
        <div className={`relative bg-white rounded-lg shadow-lg border-1 sm:border-2 border-purple-200 px-2 sm:px-3 py-1 sm:py-2 max-w-xs sm:max-w-sm transition-all duration-300 ${
          isPlayingVocal ? 'scale-105 bg-yellow-50' : ''
        }`}>
          <div className="text-xs sm:text-sm font-medium text-purple-800">
            {isPlayingVocal 
              ? "Je t'explique les techniques de soustraction !" 
              : pirateIntroStarted 
                ? "Clique sur une technique pour que je t'explique !"
                : "Salut ! Moi c'est Sam le Pirate ! 🏴‍☠️"
            }
          </div>
          {/* Petite flèche pointant vers Sam */}
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white"></div>
        </div>
      </div>
    </div>
  );

  // Fonction pour les exercices


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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Bouton flottant de Sam - visible quand Sam parle ou pendant les animations du cours ou des exercices */}
      {(isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal) && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title={isPlayingVocal ? "Arrêter Sam" : "Arrêter l'animation"}
          >
            {/* Image de Sam */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src="/image/pirate-small.png"
                alt="Sam le Pirate"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Texte et icône */}
            <>
              <span className="text-sm font-bold hidden sm:block">
                STOP
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
            href="/chapitre/ce1-quatre-operations/soustraction-ce1" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux soustractions CE1</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              🚀 Soustractions jusqu'à 100
          </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Maîtriser les techniques avancées avec les grands nombres
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
            disabled={isPlayingVocal}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isPlayingVocal
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : !showExercises
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-purple-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            disabled={isPlayingVocal}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isPlayingVocal
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : showExercises
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-purple-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* Section Cours */
          <div className="space-y-8">
            {/* Sam le Pirate avec bouton COMMENCER */}
            <div className="flex justify-center p-1 mt-1 sm:mt-2 mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Image de Sam le Pirate */}
                <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-200 shadow-md transition-all duration-300 ${
                  isPlayingVocal
                    ? 'w-20 sm:w-24 h-20 sm:h-24 scale-105 sm:scale-110'
                    : hasStarted
                      ? 'w-16 sm:w-16 h-16 sm:h-16'
                      : 'w-16 sm:w-20 h-16 sm:h-20'
                }`}>
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
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13.5H2a1 1 0 01-1-1v-5a1 1 0 011-1h2.5l3.883-3.293a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Bouton COMMENCER */}
                <button
                  onClick={explainChapter}
                  disabled={isPlayingVocal}
                  className={`relative px-3 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl font-black text-sm sm:text-lg md:text-2xl transition-all duration-300 transform min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4rem] ${
                    isPlayingVocal
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75'
                      : hasStarted
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-xl hover:scale-105'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-xl hover:scale-105 animate-pulse'
                  } shadow-2xl`}
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shimmer"></div>
                  
                  {/* Icônes et texte */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPlayingVocal 
                      ? <>🎤 <span className="animate-bounce">J'explique...</span></> 
                      : hasStarted
                        ? <>🔄 <span>Recommencer</span></>
                        : <>🚀 <span className="animate-bounce">COMMENCER</span> ✨</>
                    }
                  </span>
                  
                  {/* Particules brillantes pour le bouton commencer */}
                  {!isPlayingVocal && !hasStarted && (
                    <>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping delay-75"></div>
                      <div className="absolute top-1/2 -right-2 w-1 h-1 bg-purple-300 rounded-full animate-ping delay-150"></div>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Description sous le bouton */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600 hidden sm:block">
                {isPlayingVocal
                  ? 'Sam t\'explique les techniques... Utilise le bouton STOP en haut à droite pour l\'arrêter !'
                  : hasStarted
                    ? 'Relance l\'explication complète avec Sam'
                    : 'Sam va t\'expliquer les 3 techniques de soustraction avancées !'
                }
              </p>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Book className="w-6 h-6 text-purple-600" />
              </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Les soustractions jusqu'à 100</h2>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Avec des nombres jusqu'à 100, on utilise des techniques de champion ! 
                Au lieu de compter un par un, on décompose et on passe par des dizaines rondes comme 50, 60, 70...
              </p>
            </div>

            {/* Les défis */}
            <div 
              id="challenges-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'challenges' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Nos techniques de champion</h2>
              </div>
              
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
                <div className="p-3 sm:p-4 lg:p-6 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">🎯</div>
                  <h4 className="font-bold text-red-800 text-sm sm:text-base lg:text-lg">Passage par dizaine</h4>
                  <p className="text-xs sm:text-sm text-red-600 mt-1 sm:mt-2">75-28 → 75-25-3 = 47</p>
                </div>
                
                <div className="p-3 sm:p-4 lg:p-6 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">🧮</div>
                  <h4 className="font-bold text-blue-800 text-sm sm:text-base lg:text-lg">Décomposition par dizaines</h4>
                  <p className="text-xs sm:text-sm text-blue-600 mt-1 sm:mt-2">84-37 → 84-40+3 = 47</p>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">⚖️</div>
                  <h4 className="font-bold text-purple-800 text-sm sm:text-base lg:text-lg">Compensation</h4>
                  <p className="text-xs sm:text-sm text-purple-600 mt-1 sm:mt-2">72-29 → 73-30 = 43</p>
                </div>
              </div>
            </div>



            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-8 text-center">
                                  🎯 Maîtrise les 3 super techniques avec 12 exemples !
              </h2>
              
              {/* Organisation par technique */}
              <div className="space-y-12">
                {/* Technique 1: Passage par dizaine */}
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-red-800 mb-4 text-center flex items-center justify-center gap-2">
                    🎯 Passage par dizaine - 4 exemples
                  </h3>
                  
                  {/* Version mobile : liste compacte */}
                  <div className="block sm:hidden mb-6">
                    <div className="bg-red-50 rounded-lg p-3 space-y-2">
                      {subtractionExamples.filter(ex => ex.strategy === 'complement10').map((example, index) => (
                        <div 
                          key={example.id}
                          className={`flex justify-between items-center py-2 px-3 bg-white rounded transition-all ${
                            (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-red-100'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isPlayingVocal && !isAnimationRunning && !exercisesIsPlayingVocal) {
                              explainSpecificExample(subtractionExamples.indexOf(example));
                            }
                          }}
                        >
                          <span className="text-sm font-mono font-bold text-gray-800">{example.operation}</span>
                          <span className="text-sm font-bold text-red-600">= {example.result}</span>
                          <button className="text-xs px-2 py-1 bg-red-500 text-white rounded">▶️</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Version desktop : cartes */}
                  <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subtractionExamples.filter(ex => ex.strategy === 'complement10').map((example, index) => (
                      <div 
                        key={example.id}
                        className={`bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 transition-all duration-500 ${
                          (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer hover:scale-105 hover:shadow-xl'
                        } ${
                          currentExample === subtractionExamples.indexOf(example) ? 'ring-4 ring-red-400 bg-red-100' : ''
                        } ${
                          highlightedMethod === example.strategy 
                            ? 'ring-4 ring-yellow-400 bg-gradient-to-r from-yellow-100 to-red-100 shadow-2xl animate-pulse scale-110 border-2 border-yellow-300' 
                            : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isPlayingVocal && !isAnimationRunning && !exercisesIsPlayingVocal) {
                            explainSpecificExample(subtractionExamples.indexOf(example));
                          }
                        }}
                      >
                        <div className="text-center relative">
                          {highlightedMethod === example.strategy && (
                            <>
                              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
                              <div className="absolute -top-1 -left-1 text-xl animate-pulse">🌟</div>
                              <div className="absolute -bottom-1 right-2 text-lg animate-bounce delay-75">⭐</div>
                            </>
                          )}
                          
                          <div className="text-4xl mb-3">{example.item}</div>
                          <div className={`text-xl font-mono bg-white text-gray-800 px-3 py-2 rounded-lg mb-3 shadow-sm ${isPlayingVocal ? 'opacity-50' : ''}`}>{example.operation}</div>
                          <p className={`text-sm mb-4 leading-relaxed ${isPlayingVocal ? 'text-gray-400' : 'text-gray-600'}`}>{example.explanation}</p>
                          <button 
                            disabled={isPlayingVocal}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isPlayingVocal) {
                                explainSpecificExample(subtractionExamples.indexOf(example));
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform ${
                              isPlayingVocal 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 shadow-md hover:shadow-lg'
                            }`}
                          >
                            ▶️ Animation
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technique 2: Décomposition */}
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-blue-800 mb-4 text-center flex items-center justify-center gap-2">
                    🧮 Décomposition par dizaines - 4 exemples
                  </h3>
                  
                  {/* Version mobile : liste compacte */}
                  <div className="block sm:hidden mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                      {subtractionExamples.filter(ex => ex.strategy === 'decomposition').map((example, index) => (
                        <div 
                          key={example.id}
                          className={`flex justify-between items-center py-2 px-3 bg-white rounded transition-all ${
                            (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-blue-100'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isPlayingVocal && !isAnimationRunning && !exercisesIsPlayingVocal) {
                              explainSpecificExample(subtractionExamples.indexOf(example));
                            }
                          }}
                        >
                          <span className="text-sm font-mono font-bold text-gray-800">{example.operation}</span>
                          <span className="text-sm font-bold text-blue-600">= {example.result}</span>
                          <button className="text-xs px-2 py-1 bg-blue-500 text-white rounded">▶️</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Version desktop : cartes */}
                  <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subtractionExamples.filter(ex => ex.strategy === 'decomposition').map((example, index) => (
                      <div 
                        key={example.id}
                        className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 transition-all duration-500 ${
                          (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer hover:scale-105 hover:shadow-xl'
                        } ${
                          currentExample === subtractionExamples.indexOf(example) ? 'ring-4 ring-blue-400 bg-blue-100' : ''
                        } ${
                          highlightedMethod === example.strategy 
                            ? 'ring-4 ring-yellow-400 bg-gradient-to-r from-yellow-100 to-blue-100 shadow-2xl animate-pulse scale-110 border-2 border-yellow-300' 
                            : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isPlayingVocal && !isAnimationRunning && !exercisesIsPlayingVocal) {
                            explainSpecificExample(subtractionExamples.indexOf(example));
                          }
                        }}
                      >
                        <div className="text-center relative">
                          {highlightedMethod === example.strategy && (
                            <>
                              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
                              <div className="absolute -top-1 -left-1 text-xl animate-pulse">🌟</div>
                              <div className="absolute -bottom-1 right-2 text-lg animate-bounce delay-75">⭐</div>
                            </>
                          )}
                          
                          <div className="text-4xl mb-3">{example.item}</div>
                          <div className={`text-xl font-mono bg-white text-gray-800 px-3 py-2 rounded-lg mb-3 shadow-sm ${isPlayingVocal ? 'opacity-50' : ''}`}>{example.operation}</div>
                          <p className={`text-sm mb-4 leading-relaxed ${isPlayingVocal ? 'text-gray-400' : 'text-gray-600'}`}>{example.explanation}</p>
                          <button 
                            disabled={isPlayingVocal}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isPlayingVocal) {
                                explainSpecificExample(subtractionExamples.indexOf(example));
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform ${
                              isPlayingVocal 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-md hover:shadow-lg'
                            }`}
                          >
                            ▶️ Animation
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technique 3: Compensation */}
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-purple-800 mb-4 text-center flex items-center justify-center gap-2">
                    ⚖️ Compensation - 4 exemples
                  </h3>
                  
                  {/* Version mobile : liste compacte */}
                  <div className="block sm:hidden mb-6">
                    <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                      {subtractionExamples.filter(ex => ex.strategy === 'compensation').map((example, index) => (
                        <div 
                          key={example.id}
                          className={`flex justify-between items-center py-2 px-3 bg-white rounded transition-all ${
                            (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-purple-100'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isPlayingVocal && !isAnimationRunning && !exercisesIsPlayingVocal) {
                              explainSpecificExample(subtractionExamples.indexOf(example));
                            }
                          }}
                        >
                          <span className="text-sm font-mono font-bold text-gray-800">{example.operation}</span>
                          <span className="text-sm font-bold text-purple-600">= {example.result}</span>
                          <button className="text-xs px-2 py-1 bg-purple-500 text-white rounded">▶️</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Version desktop : cartes */}
                  <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subtractionExamples.filter(ex => ex.strategy === 'compensation').map((example, index) => (
                      <div 
                        key={example.id}
                        className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 transition-all duration-500 ${
                          (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer hover:scale-105 hover:shadow-xl'
                        } ${
                          currentExample === subtractionExamples.indexOf(example) ? 'ring-4 ring-purple-400 bg-purple-100' : ''
                        } ${
                          highlightedMethod === example.strategy 
                            ? 'ring-4 ring-yellow-400 bg-gradient-to-r from-yellow-100 to-purple-100 shadow-2xl animate-pulse scale-110 border-2 border-yellow-300' 
                            : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isPlayingVocal && !isAnimationRunning && !exercisesIsPlayingVocal) {
                            explainSpecificExample(subtractionExamples.indexOf(example));
                          }
                        }}
                      >
                        <div className="text-center relative">
                          {highlightedMethod === example.strategy && (
                            <>
                              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
                              <div className="absolute -top-1 -left-1 text-xl animate-pulse">🌟</div>
                              <div className="absolute -bottom-1 right-2 text-lg animate-bounce delay-75">⭐</div>
                            </>
                          )}
                          
                          <div className="text-4xl mb-3">{example.item}</div>
                          <div className={`text-xl font-mono bg-white text-gray-800 px-3 py-2 rounded-lg mb-3 shadow-sm ${isPlayingVocal ? 'opacity-50' : ''}`}>{example.operation}</div>
                          <p className={`text-sm mb-4 leading-relaxed ${isPlayingVocal ? 'text-gray-400' : 'text-gray-600'}`}>{example.explanation}</p>
                          <button 
                            disabled={isPlayingVocal}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isPlayingVocal) {
                                explainSpecificExample(subtractionExamples.indexOf(example));
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all transform ${
                              isPlayingVocal 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-purple-500 text-white hover:bg-purple-600 hover:scale-105 shadow-md hover:shadow-lg'
                            }`}
                          >
                            ▶️ Animation
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

              {/* Zone d'animation */}
            {currentExample !== null && (
              <div 
                id="animation-section"
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎬 Animation de la technique avancée
                </h2>
                
                {(() => {
                  const example = subtractionExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Titre de l'exemple */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'example-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <h3 className="text-xl font-bold text-gray-800">{example.title}</h3>
                        <div className="text-2xl font-mono mt-2 text-gray-800">{example.operation}</div>
                </div>
                
                {/* Animation selon la stratégie */}
                      {example.strategy === 'complement10' && (
                        <div className="space-y-4">
                          {(animatingStep === 'complement10-step1' || animatingStep === 'complement10-step2' || animatingStep === 'complement10-step3' || animatingStep === 'complement10-result') && (
                            <div className="text-center space-y-6">
                              <p className="text-lg font-semibold text-gray-800">Passage par dizaine :</p>
                              


                              {/* Toutes les étapes de calcul restent visibles */}
                              <div className="space-y-4">
                                {/* Étape 1 - visible dès step1 */}
                                {(currentStep === 'step1' || currentStep === 'step2' || currentStep === 'result') && (
                                <div className={`p-4 rounded-lg transition-all ${
                                  currentStep === 'step1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                                }`}>
                                  <div className="flex justify-center items-center space-x-4 text-xl">
                                    <span className="text-gray-800">{example.start}</span>
                                    <span className="text-gray-800">-</span>
                                    <span className="bg-red-200 px-3 py-1 rounded text-gray-800">{example.step1}</span>
                                    <span className="text-gray-800">=</span>
                                      <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">{example.start - (example.step1 || 0)}</span>
                                  </div>
                                </div>
                                )}

                                {/* Étape 2 - visible dès step2 */}
                                {(currentStep === 'step2' || currentStep === 'result') && (
                                  <div className={`p-4 rounded-lg transition-all ${
                                    currentStep === 'step2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                                  }`}>
                                    <div className="flex justify-center items-center space-x-4 text-xl">
                                      <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">{example.start - (example.step1 || 0)}</span>
                                      <span className="text-gray-800">-</span>
                                      <span className="bg-blue-200 px-3 py-1 rounded text-gray-800">{example.step2}</span>
                                      <span className="text-gray-800">=</span>
                                      <span className={`px-3 py-1 rounded text-gray-800 ${
                                        currentStep === 'result' ? 'bg-green-200 animate-pulse' : 'bg-gray-200'
                                      }`}>
                                        {currentStep === 'result' ? example.result : '?'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {example.strategy === 'decomposition' && (
                        <div className="space-y-4">
                          {(animatingStep === 'decomposition-step1' || animatingStep === 'decomposition-step2' || animatingStep === 'decomposition-result') && (
                            <div className="text-center space-y-6">
                              <p className="text-lg font-semibold text-gray-800">Décomposition intelligente :</p>
                              


                              {/* Toutes les étapes de calcul restent visibles */}
                              <div className="space-y-4">
                                {/* Étape 1 - visible dès step1 */}
                                {(currentStep === 'step1' || currentStep === 'step2' || currentStep === 'result') && (
                                <div className={`p-4 rounded-lg transition-all ${
                                  currentStep === 'step1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                                }`}>
                                  <div className="flex justify-center items-center space-x-4 text-xl">
                                    <span className="text-gray-800">{example.start}</span>
                                    <span className="text-gray-800">-</span>
                                      <span className="bg-red-200 px-3 py-1 rounded text-gray-800">{example.decompositionStep || 40}</span>
                                    <span className="text-gray-800">=</span>
                                      <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">{example.start - (example.decompositionStep || 40)}</span>
                                  </div>
                                </div>
                                )}
                                
                                {/* Étape 2 - visible dès step2 */}
                                {(currentStep === 'step2' || currentStep === 'result') && (
                                  <div className={`p-4 rounded-lg transition-all ${
                                    currentStep === 'step2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                                  }`}>
                                    <div className="flex justify-center items-center space-x-4 text-xl">
                                      <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">{example.start - (example.decompositionStep || 40)}</span>
                                      <span className="text-gray-800">+</span>
                                      <span className="bg-green-200 px-3 py-1 rounded text-gray-800">{example.correction || 3}</span>
                                      <span className="text-gray-800">=</span>
                                      <span className={`px-3 py-1 rounded text-gray-800 ${
                                        currentStep === 'result' ? 'bg-green-200 animate-pulse' : 'bg-gray-200'
                                      }`}>
                                        {currentStep === 'result' ? example.result : '?'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {example.strategy === 'compensation' && (
                        <div className="space-y-4">
                          {(animatingStep === 'compensation-step1' || animatingStep === 'compensation-step2' || animatingStep === 'compensation-result') && (
                            <div className="text-center space-y-6">
                              <p className="text-lg font-semibold text-gray-800">Compensation intelligente :</p>
                              
                              {/* Visualisation de la compensation */}
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                                <h4 className="text-lg font-bold text-gray-800 mb-4">⚖️ Transformation des nombres :</h4>
                                <div className="flex justify-center items-center space-x-8 mb-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800 mb-2">Avant</div>
                                    <div className="bg-red-100 px-4 py-2 rounded-lg">
                                      <span className="text-xl font-mono text-gray-800">{example.start} - {example.remove}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Difficile à calculer</p>
                                  </div>
                                  
                                  <div className="text-3xl text-purple-600">→</div>
                                  
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800 mb-2">Après</div>
                                    <div className="bg-green-100 px-4 py-2 rounded-lg">
                                      <span className="text-xl font-mono text-gray-800">{example.start + (example.adjustment || 0)} - {example.remove + (example.adjustment || 0)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Plus facile !</p>
                                  </div>
                                </div>
                                <p className="text-center text-gray-700 font-medium">
                                  {currentStep === 'step1' && `On ajoute ${example.adjustment || 0} aux deux nombres`}
                                  {currentStep === 'step2' && `${example.start + (example.adjustment || 0)} - ${example.remove + (example.adjustment || 0)} = ${example.result}`}
                                  {currentStep === 'result' && `Résultat : ${example.result} !`}
                                </p>
                              </div>

                              {/* Calcul final - visible dès step2 */}
                              {(currentStep === 'step2' || currentStep === 'result') && (
                                <div className="p-4 rounded-lg bg-green-100 ring-2 ring-green-400 transition-all">
                                  <div className="flex justify-center items-center space-x-4 text-xl">
                                    <span className="bg-green-200 px-3 py-1 rounded text-gray-800">{example.start + (example.adjustment || 0)}</span>
                                    <span className="text-gray-800">-</span>
                                    <span className="bg-green-200 px-3 py-1 rounded text-gray-800">{example.remove + (example.adjustment || 0)}</span>
                                    <span className="text-gray-800">=</span>
                                    <span className="bg-green-200 px-3 py-1 rounded text-gray-800 animate-pulse">{example.result}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Résultat final */}
                      {animatingStep === 'final-result' && (
                        <div className="text-center p-6 bg-green-100 rounded-lg">
                          <p className="text-3xl font-bold text-green-800">
                            {example.operation} = {example.result}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Section Exercices */
          <div className="space-y-6">
            {/* Bouton DÉMARRER pour les exercices avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage pour les exercices */}
              <div className={`relative transition-all duration-500 border-2 border-red-300 rounded-full bg-gradient-to-br from-red-100 to-orange-100 ${
                exercisesIsPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                {!exercisesImageError ? (
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setExercisesImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl rounded-full bg-gradient-to-br from-red-200 to-orange-200">
                    🧱
            </div>
                )}
                
                {exercisesIsPlayingVocal && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour les exercices */}
              <button
                onClick={explainExercisesWithSam}
                disabled={exercisesIsPlayingVocal || isPlayingVocal || isAnimationRunning}
                className={`px-2 sm:px-4 py-2 sm:py-2 rounded-lg font-bold text-sm sm:text-base shadow-lg transition-all ${
                  (exercisesIsPlayingVocal || isPlayingVocal || isAnimationRunning)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-xl hover:scale-105'
                } ${!exercisesHasStarted && !exercisesIsPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {exercisesIsPlayingVocal ? 'Le personnage explique...' : 'DÉMARRER LES EXERCICES'}
              </button>
            </div>
            
            {/* Header exercices */}
            <div 
              id="exercises-header"
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'exercises-header' ? 'ring-4 ring-red-400 bg-red-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div 
                  id="score-display"
                  className={`text-sm sm:text-xl font-bold text-red-600 ${
                    highlightedElement === 'score-display' ? 'ring-2 ring-red-400 bg-red-50 rounded px-2 py-1' : ''
                  }`}
                >
                    Score : {score}/{exercises.length}
                  </div>
                </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-red-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
                  </div>

                        {/* Question */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise].question}
                </h3>
                <button
                  id="listen-button"
                  onClick={() => {
                    speechSynthesis.cancel();
                    setIsPlayingVocal(true);
                    const utterance = new SpeechSynthesisUtterance(exercises[currentExercise].question);
                    utterance.rate = 1.3;
                    utterance.pitch = 1.1;
                    utterance.onend = () => setIsPlayingVocal(false);
                    utterance.onerror = () => setIsPlayingVocal(false);
                    speechSynthesis.speak(utterance);
                  }}
                  disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                  className={`ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'listen-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''
                  }`}
                >
                  🔊 Écouter
                </button>
              </div>

              {/* Section d'animation pour les corrections */}
              {isAnimationRunning && isCorrect === false && (
                <div id="correction-animation" className="mb-4 sm:mb-8 p-3 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 sm:mb-4">📚 Correction détaillée</h4>
                  
                  {(() => {
                    const match = exercises[currentExercise].question.match(/Calcule : (\d+) - (\d+)/);
                    if (!match) return null;
                    
                    const num1 = parseInt(match[1]);
                    const num2 = parseInt(match[2]);
                    const result = parseInt(exercises[currentExercise].correctAnswer);
                    
                    // Déterminer la technique utilisée
                    let technique = 'decomposition';
                    if (num2 % 10 >= 8 || num2 % 10 <= 2) {
                      technique = 'complement10';
                    } else if (Math.abs(num2 - Math.round(num2 / 10) * 10) <= 2) {
                      technique = 'compensation';
                    }
                    
                    return (
                      <div className="space-y-4">
                        {technique === 'complement10' && (
                          <div className="space-y-4">
                  <div className="text-center">
                              <div className="text-base sm:text-lg lg:text-2xl font-bold text-blue-600 mb-2">Technique : Complément à 10</div>
                              <div className="text-sm sm:text-base lg:text-lg text-gray-700">{num1} - {num2}</div>
                  </div>

                                                        {/* Étape 1 */}
                            {(currentStep === 'step1' || currentStep === 'step2' || currentStep === 'result') && (
                                                            <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'step1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-base sm:text-lg font-semibold text-center text-gray-800">
                                  Étape 1 : {num1} - {Math.ceil(num2 / 10) * 10} = {num1 - Math.ceil(num2 / 10) * 10}
                  </div>
                              </div>
                            )}
                            
                            {/* Étape 2 */}
                            {(currentStep === 'step2' || currentStep === 'result') && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'step2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-base sm:text-lg font-semibold text-center text-gray-800">
                                  Étape 2 : On rajoute {Math.ceil(num2 / 10) * 10 - num2}
                                </div>
                              </div>
                            )}
                            
                            {/* Résultat */}
                            {currentStep === 'result' && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'result' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-lg sm:text-xl font-bold text-center text-gray-800">
                                  Résultat : {result}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {technique === 'decomposition' && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-2">Technique : Décomposition</div>
                              <div className="text-base sm:text-lg text-gray-700">{num1} - {num2}</div>
                            </div>
                            
                            {/* Étape 1 */}
                            {(currentStep === 'step1' || currentStep === 'step2' || currentStep === 'result') && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'step1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-base sm:text-lg font-semibold text-center text-gray-800">
                                  Étape 1 : {num1} - {Math.floor(num2 / 10) * 10} = {num1 - Math.floor(num2 / 10) * 10}
                                </div>
                              </div>
                            )}
                            
                            {/* Étape 2 */}
                            {(currentStep === 'step2' || currentStep === 'result') && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'step2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-base sm:text-lg font-semibold text-center text-gray-800">
                                  Étape 2 : {num1 - Math.floor(num2 / 10) * 10} - {num2 % 10} = {result}
                                </div>
                              </div>
                            )}
                            
                            {/* Résultat */}
                            {currentStep === 'result' && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'result' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-lg sm:text-xl font-bold text-center text-gray-800">
                                  Résultat : {result}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {technique === 'compensation' && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-lg sm:text-2xl font-bold text-orange-600 mb-2">Technique : Compensation</div>
                              <div className="text-base sm:text-lg text-gray-700">{num1} - {num2}</div>
                            </div>
                            
                            {/* Étape 1 */}
                            {(currentStep === 'step1' || currentStep === 'step2' || currentStep === 'result') && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'step1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-base sm:text-lg font-semibold text-center text-gray-800">
                                  Étape 1 : On modifie les deux nombres
                                </div>
                              </div>
                            )}
                            
                            {/* Étape 2 */}
                            {(currentStep === 'step2' || currentStep === 'result') && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'step2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-base sm:text-lg font-semibold text-center text-gray-800">
                                  Étape 2 : {num1 + (Math.round(num2 / 10) * 10 - num2)} - {Math.round(num2 / 10) * 10} = {result}
                                </div>
                              </div>
                            )}
                            
                            {/* Résultat */}
                            {currentStep === 'result' && (
                              <div className={`p-3 sm:p-4 rounded-lg transition-all ${
                                animatingStep === 'result' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'
                              }`}>
                                <div className="text-lg sm:text-xl font-bold text-center text-gray-800">
                                  Résultat : {result}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}



                        {/* Zone de saisie pour les calculs */}
            <div className="max-w-xs sm:max-w-sm mx-auto mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-4">
                    <input
                  id="answer-input"
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleAnswerClick(userAnswer)}
                  disabled={isCorrect !== null}
                  placeholder="?"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  className={`w-20 sm:w-32 p-2 sm:p-3 text-center rounded-lg font-bold text-base sm:text-lg border-2 transition-all ${
                    isCorrect === null
                      ? 'border-gray-300 focus:border-red-500 focus:outline-none'
                      : isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'answer-input' ? 'ring-4 ring-red-400 animate-pulse' : ''
                  }`}
                />
                      <button
                  id="validate-button"
                  onClick={() => handleAnswerClick(userAnswer)}
                  disabled={!userAnswer || isCorrect !== null || isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                  className={`px-4 py-3 sm:px-6 sm:py-4 bg-red-500 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'validate-button' ? 'ring-4 ring-red-400 animate-pulse' : ''
                  }`}
                >
                  Valider
                      </button>
                    </div>
                  </div>

              {/* Résultat */}
                  {isCorrect !== null && (
              <div className={`p-3 sm:p-4 rounded-lg mb-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                  <div className="flex items-center justify-center space-x-2">
                      {isCorrect ? (
                    <>
                      <span className="text-xl sm:text-2xl">✅</span>
                      <span className="font-bold text-sm sm:text-lg">
                        Excellent ! C'est la bonne réponse !
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl sm:text-2xl">❌</span>
                      <span className="font-bold text-sm sm:text-lg">
                        Pas tout à fait... La bonne réponse est : {exercises[currentExercise].correctAnswer}
                        </span>
                    </>
                  )}
                          </div>
              </div>
            )}
                      
            {/* Navigation */}
            {isCorrect === false && (
              <div className="flex justify-center">
                          <button
                  id="next-button"
                            onClick={nextExercise}
                            disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                  className={`bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'next-button' ? 'ring-4 ring-red-400 animate-pulse' : ''
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
                const result = getCompletionMessage(finalScore, exercises.length);
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-red-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 9 ? '⭐⭐⭐' : finalScore >= 7 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les soustractions jusqu'à 100 sont maintenant maîtrisées !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                    <button
                        onClick={resetAll}
                        disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                        className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Recommencer
                    </button>
                    <button
                        onClick={() => {
                          stopAllVocalsAndAnimations();
                          setShowCompletionModal(false);
                        }}
                        disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
