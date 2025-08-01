'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

export default function DizainesUnitesCP() {
  const router = useRouter();
  const [selectedNumber, setSelectedNumber] = useState(15);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // States pour audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [animatingDecomposition, setAnimatingDecomposition] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingExample, setAnimatingExample] = useState(false);
  const [highlightDigit, setHighlightDigit] = useState<'left' | 'right' | null>(null);
  const [animatingCircles, setAnimatingCircles] = useState<'dizaines' | 'unites' | 'all' | null>(null);
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions de pirate personnalisées pour chaque exercice incorrect
  const pirateExpressions = [
    "Par ma barbe de pirate", // exercice 1
    "Humm ça n'est pas vraiment ça", // exercice 2  
    "Nom d'un alligator", // exercice 3
    "Saperlipopette", // exercice 4
    "Mille sabords", // exercice 5
    "Morbleu", // exercice 6
    "Tonnerre de Brest", // exercice 7
    "Par tous les diables des mers", // exercice 8
    "Sacré mille tonnerres", // exercice 9
    "Bigre et bigre", // exercice 10
    "Nom d'une jambe en bois", // exercice 11
    "Sacrés mille tonnerres", // exercice 12
    "Par Neptune", // exercice 13
    "Bon sang de bonsoir", // exercice 14
    "Fichtre et refichtre" // exercice 15
  ];

  // Compliments variés pour les bonnes réponses
  const correctAnswerCompliments = [
    "Bravo",
    "Magnifique", 
    "Parfait",
    "Époustouflant",
    "Formidable",
    "Incroyable",
    "Fantastique",
    "Génial",
    "Excellent",
    "Superbe"
  ];

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt FORCÉ de tous les vocaux et animations (navigation détectée)');
    stopSignalRef.current = true;
    
    // Arrêt immédiat et multiple de la synthèse vocale
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (1er)');
      }
      speechSynthesis.cancel(); // Force même si pas actif
      console.log('🔇 speechSynthesis.cancel() forcé');
    } catch (error) {
      console.log('❌ Erreur lors de l\'arrêt speechSynthesis:', error);
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
      console.log('🗑️ currentAudioRef supprimé');
    }
    
    // Reset immédiat de tous les états
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingDecomposition(false);
    setAnimatingExample(false);
    setHighlightDigit(null);
    setAnimatingCircles(null);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    
    // Arrêts supplémentaires en différé pour s'assurer
    setTimeout(() => {
      try {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (2e tentative)');
      } catch (error) {
        console.log('❌ Erreur 2e tentative:', error);
      }
      stopSignalRef.current = false; // Reset pour permettre nouveaux audios
    }, 100);
    
    setTimeout(() => {
      try {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (3e tentative)');
      } catch (error) {
        console.log('❌ Erreur 3e tentative:', error);
      }
    }, 300);
  };

  // Fonction pour scroller vers l'illustration
  const scrollToIllustration = () => {
    const element = document.getElementById('number-analysis');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction pour scroller vers le sélecteur de nombre
  const scrollToNumberChoice = () => {
    const element = document.getElementById('number-choice');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction d'attente
  const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
        resolve();
        return;
      }
        resolve();
      }, ms);
    });
  };

  // Fonction pour jouer un audio avec gestion d'interruption
  const playAudio = async (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
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
        
        if (!('speechSynthesis' in window)) {
          console.warn('SpeechSynthesis API non disponible');
          resolve();
          return;
        }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
        utterance.rate = 1.05; // Débit optimisé
        utterance.pitch = 1.0; // Pitch normal, plus naturel
        utterance.volume = 1.0;
        
        // Sélectionner la MEILLEURE voix française disponible
        const voices = speechSynthesis.getVoices();
        console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
        
        // Priorité aux voix FÉMININES françaises de qualité
        const bestFrenchVoice = voices.find(voice => 
          (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
          (voice.name.toLowerCase().includes('audrey') ||    // Voix féminine française courante  
           voice.name.toLowerCase().includes('marie') ||     // Voix féminine française
           voice.name.toLowerCase().includes('amélie') ||    // Voix féminine française
           voice.name.toLowerCase().includes('virginie') ||  // Voix féminine française
           voice.name.toLowerCase().includes('julie') ||     // Voix féminine française
           voice.name.toLowerCase().includes('celine') ||    // Voix féminine française
           voice.name.toLowerCase().includes('léa') ||       // Voix féminine française
           voice.name.toLowerCase().includes('charlotte'))   // Voix féminine française
        ) || voices.find(voice => 
          (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
          (voice.name.toLowerCase().includes('thomas') ||    // Voix masculine en fallback
           voice.name.toLowerCase().includes('daniel'))      // Voix masculine en fallback
        ) || voices.find(voice => 
          voice.lang === 'fr-FR' && voice.localService    // Voix système française
        ) || voices.find(voice => 
          voice.lang === 'fr-FR'                          // N'importe quelle voix fr-FR
        ) || voices.find(voice => 
          voice.lang.startsWith('fr')                     // N'importe quelle voix française
        );
        
        if (bestFrenchVoice) {
          utterance.voice = bestFrenchVoice;
          console.log('Voix sélectionnée:', bestFrenchVoice.name, '(', bestFrenchVoice.lang, ')');
        } else {
          console.warn('Aucune voix française trouvée, utilisation voix par défaut');
        }
        
        currentAudioRef.current = utterance;
      
      utterance.onend = () => {
          currentAudioRef.current = null;
        resolve();
      };
      
        utterance.onerror = (event) => {
          console.error('Erreur synthèse vocale:', event);
          currentAudioRef.current = null;
        resolve();
      };
      
        if (stopSignalRef.current) {
          resolve();
          return;
        }

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Erreur dans playAudio:', error);
        currentAudioRef.current = null;
        resolve();
      }
    });
  };

  // Fonction pour l'introduction vocale de Sam le Pirate - DÉMARRAGE MANUEL PAR CLIC
  const startPirateIntro = async () => {
    if (pirateIntroStarted) return;
    
    // FORCER la remise à false pour le démarrage manuel
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setPirateIntroStarted(true);
    
    try {
      await playAudio("Bonjour, faisons quelques exercices nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Pour lire l'énoncé appuie sur écouter l'énoncé");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      setShowExercisesList(true);
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Dès que tu as la réponse, tu peux la saisir ici");
      if (stopSignalRef.current) return;
      
      // Mettre beaucoup en évidence la zone de réponse
      setHighlightedElement('answer-input');
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("et appuie ensuite sur valider");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton valider
      setHighlightedElement('validate-button');
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("en cas de mauvaise réponse, je serai là pour t'aider. En avant toutes !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour lire l'énoncé de l'exercice - LECTURE SIMPLE DE LA QUESTION
  const startExerciseExplanation = async () => {
    if (stopSignalRef.current || isExplainingError || !exercises[currentExercise]) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setExerciseStarted(true);
    
    try {
      // Lire seulement l'énoncé de l'exercice
      await playAudio(exercises[currentExercise].question);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startExerciseExplanation:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour animer l'explication d'une mauvaise réponse
  const explainWrongAnswer = async () => {
    console.log('❌ Explication mauvaise réponse pour exercice', currentExercise + 1);
    
    // FORCER la remise à false pour permettre l'explication
    stopSignalRef.current = false;
    setIsExplainingError(true);
    setIsPlayingVocal(true);
    
    try {
      // Expression de pirate personnalisée
      const pirateExpression = pirateExpressions[currentExercise] || "Mille sabords";
      await playAudio(pirateExpression + " !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      const exercise = exercises[currentExercise];
      await playAudio(`La bonne réponse est ${exercise.correctDizaines} dizaines et ${exercise.correctUnites} unités !`);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      await playAudio(`Le nombre ${exercise.number} se décompose en ${exercise.correctDizaines} dizaines et ${exercise.correctUnites} unités !`);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Maintenant appuie sur suivant !");
      if (stopSignalRef.current) return;
      
      // Illuminer le bouton suivant
      setHighlightedElement('next-exercise-button');
      
      await wait(300); // Laisser l'animation se voir
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      // Ne PAS remettre setIsExplainingError(false) ici - le bouton Suivant doit rester actif
      // L'état sera réinitialisé quand l'utilisateur clique sur "Suivant"
    }
  };

  // Fonction pour féliciter avec audio pour les bonnes réponses
  const celebrateCorrectAnswer = async () => {
    if (stopSignalRef.current) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      await playAudio(randomCompliment + " !");
      if (stopSignalRef.current) return;
      
      await wait(500);
      if (stopSignalRef.current) return;
      
      const exercise = exercises[currentExercise];
      await playAudio(`C'est bien ${exercise.correctDizaines} dizaines et ${exercise.correctUnites} unités !`);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans celebrateCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour expliquer le chapitre au démarrage avec animations
  const explainChapter = async () => {
    console.log('📖 explainChapter - Début explication');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      console.log('Début explainChapter - Dizaines et unités');
      
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les dizaines et unités !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Aujourd'hui, tu vas apprendre un secret très important sur les nombres !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Animation directe avec l'exemple 15
      setHighlightedElement('example-section');
      setAnimatingExample(true);
      await playAudio("Regardons ensemble le nombre 15 !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio("Quand tu vois un nombre à 2 chiffres, il y a une règle magique !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Animation du chiffre de gauche
      setHighlightDigit('left');
      await playAudio("Le chiffre de gauche, ici le 1, représente les dizaines !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setAnimatingCircles('dizaines');
      await playAudio("1 dizaine, c'est 1 groupe de 10 objets ! Regarde les 10 cercles bleus !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      // Animation du chiffre de droite
      setHighlightDigit('right');
      setAnimatingCircles('unites');
      await playAudio("Le chiffre de droite, ici le 5, représente les unités !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("5 unités, ce sont 5 objets tout seuls ! Regarde les 5 cercles rouges !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Animation finale
      setHighlightDigit(null);
      setAnimatingCircles('all');
      await playAudio("Donc 15, c'est 1 groupe de 10 plus 5 unités ! 10 plus 5 égale 15 !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      await playAudio("C'est comme ça que fonctionnent TOUS les nombres à 2 chiffres !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Gauche égale dizaines, droite égale unités ! C'est la règle !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      // Transition vers les choix
      setHighlightedElement(null);
      setAnimatingExample(false);
      setAnimatingCircles(null);
      await wait(1000);
      
      scrollToNumberChoice();
      setHighlightedElement('number-choice');
      await playAudio("Maintenant, choisis un nombre et je te montrerai sa décomposition !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Tu verras toujours : chiffre de gauche égale dizaines, chiffre de droite égale unités !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement(null);
      await playAudio("Alors, quel nombre veux-tu décomposer ?");
      if (stopSignalRef.current) return;
      await wait(1500);
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      console.log('📖 explainChapter - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setAnimatingExample(false);
      setHighlightDigit(null);
      setAnimatingCircles(null);
    }
  };

  // Fonction pour expliquer un nombre spécifique avec animations avancées
  const explainNumber = async (number: number) => {
    console.log(`🔢 explainNumber(${number}) - Début, arrêt des animations précédentes`);
    
    // Arrêter toute animation/vocal en cours
    stopAllVocalsAndAnimations();
    
    // Attendre un délai pour s'assurer que l'arrêt est effectif
    await wait(300);
    
    // Vérifier une dernière fois si quelque chose joue encore
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      await wait(100);
    }
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setAnimatingDecomposition(true);

    try {
      scrollToIllustration();
      
      const { dizaines, unites } = analyzeNumber(number);
      const numberStr = number.toString();
      
      await playAudio(`Le nombre ${number} !`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Expliquer la position des chiffres
      if (numberStr.length === 2) {
        await playAudio(`Regardons les chiffres ! Le ${numberStr[0]} à gauche, et le ${numberStr[1]} à droite !`);
        if (stopSignalRef.current) return;
        await wait(1800);
        
        await playAudio(`Souviens-toi : gauche égale dizaines, droite égale unités !`);
        if (stopSignalRef.current) return;
        await wait(1500);
      }
      
      setAnimatingCircles('dizaines');
      if (dizaines > 0) {
        await playAudio(`Le ${numberStr[0]} de gauche donne ${dizaines} dizaine${dizaines > 1 ? 's' : ''} !`);
        if (stopSignalRef.current) return;
        await wait(1500);
        
        await playAudio(`Regarde le${dizaines > 1 ? 's' : ''} groupe${dizaines > 1 ? 's' : ''} de 10 cercles bleus ! ${dizaines} fois 10 égale ${dizaines * 10} !`);
        if (stopSignalRef.current) return;
        await wait(1800);
      }
      
      setAnimatingCircles('unites');
      if (unites > 0) {
        await playAudio(`Le ${numberStr[1] || '0'} de droite donne ${unites} unité${unites > 1 ? 's' : ''} !`);
        if (stopSignalRef.current) return;
        await wait(1500);
        
        await playAudio(`Regarde le${unites > 1 ? 's' : ''} ${unites} cercle${unites > 1 ? 's' : ''} rouge${unites > 1 ? 's' : ''} ! Ce sont les unités !`);
        if (stopSignalRef.current) return;
        await wait(1800);
      }
      
      setAnimatingCircles('all');
      await playAudio(`Au total : ${dizaines * 10} plus ${unites} égale ${number} !`);
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio(`Formidable ! ${number} égale ${dizaines} dizaine${dizaines > 1 ? 's' : ''} plus ${unites} unité${unites > 1 ? 's' : ''} !`);
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Choisis un autre nombre pour continuer à t'exercer !");
      
    } catch (error) {
      console.error('Erreur dans explainNumber:', error);
    } finally {
      console.log('🔢 explainNumber - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setAnimatingDecomposition(false);
      setAnimatingCircles(null);
    }
  };

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'dizaines-unites',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines-unites');
      
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

  // Fonction pour analyser un nombre en dizaines et unités
  const analyzeNumber = (num: number) => {
    const dizaines = Math.floor(num / 10);
    const unites = num % 10;
    return { dizaines, unites };
  };

  // Données des nombres avec leur décomposition
  const numbersData = Array.from({ length: 10 }, (_, i) => {
    const number = i + 11;
    const { dizaines, unites } = analyzeNumber(number);
    return {
      number,
      dizaines,
      unites,
      visual: `${'🔵'.repeat(dizaines)}${'🔴'.repeat(unites)}`,
      explanation: `${number} = ${dizaines} dizaine${dizaines > 1 ? 's' : ''} + ${unites} unité${unites > 1 ? 's' : ''}`
    };
  });

  // Exercices sur les dizaines et unités - avec propriétés séparées
  const exercises = [
    { question: 'Décompose ce nombre en dizaines et unités', number: 13, correctAnswer: '1 dizaine + 3 unités', correctDizaines: 1, correctUnites: 3, choices: ['1 dizaine + 3 unités', '3 dizaines + 1 unité', '1 dizaine + 2 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 17, correctAnswer: '1 dizaine + 7 unités', correctDizaines: 1, correctUnites: 7, choices: ['1 dizaine + 7 unités', '7 dizaines + 1 unité', '1 dizaine + 6 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 15, correctAnswer: '1 dizaine + 5 unités', correctDizaines: 1, correctUnites: 5, choices: ['1 dizaine + 5 unités', '5 dizaines + 1 unité', '1 dizaine + 4 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 19, correctAnswer: '1 dizaine + 9 unités', correctDizaines: 1, correctUnites: 9, choices: ['1 dizaine + 9 unités', '9 dizaines + 1 unité', '1 dizaine + 8 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 12, correctAnswer: '1 dizaine + 2 unités', correctDizaines: 1, correctUnites: 2, choices: ['1 dizaine + 2 unités', '2 dizaines + 1 unité', '1 dizaine + 1 unité'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 16, correctAnswer: '1 dizaine + 6 unités', correctDizaines: 1, correctUnites: 6, choices: ['1 dizaine + 6 unités', '6 dizaines + 1 unité', '1 dizaine + 5 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 18, correctAnswer: '1 dizaine + 8 unités', correctDizaines: 1, correctUnites: 8, choices: ['1 dizaine + 8 unités', '8 dizaines + 1 unité', '1 dizaine + 7 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 14, correctAnswer: '1 dizaine + 4 unités', correctDizaines: 1, correctUnites: 4, choices: ['1 dizaine + 4 unités', '4 dizaines + 1 unité', '1 dizaine + 3 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 11, correctAnswer: '1 dizaine + 1 unité', correctDizaines: 1, correctUnites: 1, choices: ['1 dizaine + 1 unité', '1 dizaine + 0 unité', '0 dizaine + 11 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 20, correctAnswer: '2 dizaines + 0 unité', correctDizaines: 2, correctUnites: 0, choices: ['2 dizaines + 0 unité', '1 dizaine + 10 unités', '0 dizaine + 20 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 13, correctAnswer: '1 dizaine + 3 unités', correctDizaines: 1, correctUnites: 3, choices: ['1 dizaine + 3 unités', '2 dizaines + 3 unités', '0 dizaine + 13 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 16, correctAnswer: '1 dizaine + 6 unités', correctDizaines: 1, correctUnites: 6, choices: ['1 dizaine + 6 unités', '1 dizaine + 5 unités', '2 dizaines + 6 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 19, correctAnswer: '1 dizaine + 9 unités', correctDizaines: 1, correctUnites: 9, choices: ['1 dizaine + 9 unités', '1 dizaine + 8 unités', '9 dizaines + 1 unité'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 15, correctAnswer: '1 dizaine + 5 unités', correctDizaines: 1, correctUnites: 5, choices: ['1 dizaine + 5 unités', '5 dizaines + 1 unité', '1 dizaine + 4 unités'] },
    { question: 'Décompose ce nombre en dizaines et unités', number: 12, correctAnswer: '1 dizaine + 2 unités', correctDizaines: 1, correctUnites: 2, choices: ['1 dizaine + 2 unités', '1 dizaine + 1 unité', '2 dizaines + 2 unités'] }
  ];

  // Fonction pour rendre les cercles visuels - dizaines = groupes de 10
  const renderCircles = (dizaines: number, unites: number) => {
    const elements = [];
    
    // Dizaines (groupes de 10 cercles bleus)
    for (let d = 0; d < dizaines; d++) {
      const group = [];
      for (let i = 0; i < 10; i++) {
        group.push(
          <div
            key={`d${d}-${i}`}
            className={`w-4 h-4 rounded-full bg-blue-600 transition-all duration-700 ${
              animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
              'scale-110 ring-2 ring-blue-300 animate-pulse' : ''
            }`}
          />
        );
      }
      
      elements.push(
        <div
          key={`dizaine-${d}`}
          className={`grid grid-cols-5 gap-1 p-2 rounded-lg border-2 border-blue-300 bg-blue-50 transition-all duration-700 ${
            animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
            'scale-110 ring-4 ring-blue-400 bg-blue-100' : ''
          }`}
        >
          {group}
          <div className="col-span-5 text-center text-xs font-bold text-blue-700 mt-1">
            1 dizaine = 10
          </div>
        </div>
      );
    }
    
    // Unités (cercles rouges individuels)
    for (let i = 0; i < unites; i++) {
      elements.push(
        <div
          key={`unite-${i}`}
          className={`w-6 h-6 rounded-full bg-red-600 transition-all duration-700 ${
            animatingDecomposition && (animatingCircles === 'unites' || animatingCircles === 'all') ? 
            'scale-125 ring-4 ring-red-300 animate-pulse' : 
            animatingDecomposition ? 'scale-110 ring-2 ring-red-300' : ''
          }`}
        />
      );
    }
    
    return elements;
  };

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour gérer les changements cours ↔ exercices - reset pirate intro
  useEffect(() => {
    if (showExercises) {
      // Reset de l'intro pirate quand on passe aux exercices
      setPirateIntroStarted(false);
      setShowExercisesList(false);
    } else {
      // Arrêt audio si on repasse au cours
      stopAllVocalsAndAnimations();
      setIsExplainingError(false);
      setExerciseStarted(false);
      setShowNextButton(false);
      setHighlightNextButton(false);
    }
  }, [showExercises]);

  // Effet pour reset les états d'erreur lors d'un nouvel exercice
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
  }, [currentExercise]);

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
    console.log('✅ Composant DizainesUnites initialisé avec surveillance navigation renforcée');
  }, []);

  // Effet pour gérer les changements de visibilité de la page et navigation
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
      console.log('Navigation détectée (popstate) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page cachée (pagehide) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handleUnload = () => {
      console.log('Page déchargée (unload) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    // Navigation via historique du navigateur
    const handleHashChange = () => {
      console.log('Changement de hash détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    // Focus/blur de la fenêtre (indicateur de navigation)
    const handleBlur = () => {
      console.log('Fenêtre blur détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handleFocus = () => {
      console.log('Fenêtre focus détecté');
      // Pas d'arrêt sur focus, juste log
    };

    // Détection de changement d'URL (pour Next.js)
    const handleLocationChange = () => {
      console.log('Location change détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Surveiller les changements d'URL
    let currentUrl = window.location.href;
    const urlCheckInterval = setInterval(() => {
      if (window.location.href !== currentUrl) {
        console.log('🌐 Changement d\'URL détecté - arrêt audio');
        currentUrl = window.location.href;
        stopAllVocalsAndAnimations();
      }
    }, 100);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearInterval(urlCheckInterval);
      console.log('🧹 Nettoyage des event listeners de navigation');
      // Arrêt final au démontage du composant
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  // Effet pour arrêter l'audio lors de la navigation (bouton back)
  useEffect(() => {
    // Écouter les clics sur les liens de navigation
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        console.log('🔗 Clic sur lien détecté - arrêt audio');
        stopAllVocalsAndAnimations();
      }
    };

    // Écouter les changements d'URL via pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('📍 history.pushState détecté - arrêt audio');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      console.log('📍 history.replaceState détecté - arrêt audio');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Nouvelle fonction pour gérer la soumission de réponse - Dizaines/Unités
  const handleAnswerSubmit = (answer: string) => {
    if (!answer.trim() || answer.split(',').length !== 2) return;
    
    stopAllVocalsAndAnimations(); // Stop any ongoing audio first
    
    const [dizainesStr, unitesStr] = answer.split(',');
    const dizaines = parseInt(dizainesStr.trim());
    const unites = parseInt(unitesStr.trim());
    
    const exercise = exercises[currentExercise];
    const correct = (dizaines === exercise.correctDizaines && unites === exercise.correctUnites);
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
      // Célébrer avec Sam le Pirate
      celebrateCorrectAnswer();
    } else if (!correct) {
      // Expliquer l'erreur avec Sam le Pirate
      explainWrongAnswer();
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
    stopAllVocalsAndAnimations(); // Stop any ongoing audio before moving to next
    
    setIsExplainingError(false); // Reset Sam's error state
    setHighlightedElement(null);
    setShowNextButton(false);
    setHighlightNextButton(false);
    
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
    stopAllVocalsAndAnimations(); // Arrêter tous les audios avant reset
    
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    
    // Reset des états Sam le Pirate
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    setExerciseStarted(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
  };

  // JSX pour le bouton "Écouter l'énoncé"
  const ListenQuestionButtonJSX = () => (
    <button
      id="listen-question-button"
      onClick={startExerciseExplanation}
      disabled={isPlayingVocal}
      className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all shadow-lg ${
        highlightedElement === 'listen-question-button'
          ? 'bg-yellow-400 text-black ring-8 ring-yellow-300 animate-bounce scale-125 shadow-2xl border-4 border-orange-500'
          : isPlayingVocal
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : exerciseStarted
              ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-xl hover:scale-105'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl hover:scale-105'
      } disabled:opacity-50`}
    >
      {isPlayingVocal ? '🎤 Énoncé en cours...' : exerciseStarted ? '🔄 Réécouter l\'énoncé' : '🎤 Écouter l\'énoncé'}
    </button>
  );

  // JSX pour l'introduction de Sam le Pirate dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-2">
      <div className="flex items-center gap-2">
        {/* Image de Sam le Pirate */}
        <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 shadow-md transition-all duration-300 ${
          isPlayingVocal
            ? 'w-20 sm:w-32 h-20 sm:h-32 scale-110 sm:scale-150' // When speaking - agrandi mobile
            : pirateIntroStarted
              ? 'w-16 sm:w-16 h-16 sm:h-16' // After "COMMENCER" clicked (reduced) - agrandi mobile
              : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
        }`}>
          <img 
            src="/image/pirate-small.png" 
            alt="Sam le Pirate" 
            className="w-full h-full rounded-full object-cover"
          />
          {/* Haut-parleur animé quand il parle */}
          {isPlayingVocal && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-2 rounded-full animate-bounce shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Bouton Start Exercices - AVEC AUDIO */}
        <button
        onClick={startPirateIntro}
        disabled={isPlayingVocal || pirateIntroStarted}
        className={`relative px-6 sm:px-12 py-3 sm:py-5 rounded-xl font-black text-base sm:text-2xl transition-all duration-300 transform ${
          isPlayingVocal 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed animate-pulse shadow-md' 
            : pirateIntroStarted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white opacity-75 cursor-not-allowed shadow-lg'
              : 'bg-gradient-to-r from-purple-500 via-red-500 to-pink-500 text-white hover:from-purple-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-4 border-yellow-300'
        } ${!isPlayingVocal && !pirateIntroStarted ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''}`}
        style={{
          animationDuration: !isPlayingVocal && !pirateIntroStarted ? '1.5s' : '2s',
          animationIterationCount: isPlayingVocal || pirateIntroStarted ? 'none' : 'infinite',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          boxShadow: !isPlayingVocal && !pirateIntroStarted 
            ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
            : ''
        }}
      >
        {/* Effet de brillance */}
        {!isPlayingVocal && !pirateIntroStarted && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        )}
        
        {/* Icônes et texte avec plus d'émojis */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isPlayingVocal 
            ? <>🎤 <span className="animate-bounce">Sam parle...</span></> 
            : pirateIntroStarted
              ? <>✅ <span>Intro terminée</span></>
              : <>🚀 <span className="animate-bounce">COMMENCER</span> ✨</>
          }
        </span>
        
        {/* Particules brillantes pour le bouton commencer */}
        {!isPlayingVocal && !pirateIntroStarted && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </>
        )}
      </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            onClick={stopAllVocalsAndAnimations}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              🔢 Dizaines et unités
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Apprends à décomposer les nombres en dizaines et unités !
            </p>
          </div>
        </div>



        {/* Message de debug temporaire (visible en mode développement) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded text-xs opacity-75 z-40">
            🔍 Navigation surveillance: ON
          </div>
        )}

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-3 sm:mb-2">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
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
                stopAllVocalsAndAnimations();
                setShowExercises(true);
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
            {/* Bouton Démarrer */}
            <div className="flex justify-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
              >
                <Play className="inline w-8 h-8 mr-3" />
                🎯 Démarrer l'explication !
              </button>
            </div>

            {/* Qu'est-ce que les dizaines et unités ? */}
            <div 
              id="example-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'example-section' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Qu'est-ce que les dizaines et unités ?
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-purple-800 font-semibold mb-4">
                  Chaque nombre a des dizaines (groupes de 10) et des unités (ce qui reste) !
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      Exemple avec le nombre :
                </div>
                    
                    {/* Affichage animé du nombre 15 */}
                    <div className="flex justify-center items-center mb-6">
                      <div className={`text-8xl font-bold transition-all duration-700 ${
                        highlightDigit === 'left' ? 'text-blue-500 scale-125 animate-bounce' : 
                        animatingExample ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        1
                      </div>
                      <div className={`text-8xl font-bold transition-all duration-700 ${
                        highlightDigit === 'right' ? 'text-red-500 scale-125 animate-bounce' : 
                        animatingExample ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        5
              </div>
            </div>

                    {/* Explications positionnelles */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`p-3 rounded-lg transition-all duration-500 ${
                        highlightDigit === 'left' ? 'bg-blue-200 ring-4 ring-blue-400' : 'bg-blue-50'
                      }`}>
                        <div className="text-blue-800 font-bold">↑ Chiffre de GAUCHE</div>
                        <div className="text-blue-600">= DIZAINES</div>
                      </div>
                      <div className={`p-3 rounded-lg transition-all duration-500 ${
                        highlightDigit === 'right' ? 'bg-red-200 ring-4 ring-red-400' : 'bg-red-50'
                      }`}>
                        <div className="text-red-800 font-bold">↑ Chiffre de DROITE</div>
                        <div className="text-red-600">= UNITÉS</div>
                      </div>
                    </div>
                    
                    {/* Représentation réaliste */}
                    <div className="flex justify-center gap-4 mb-4 flex-wrap">
                      {/* Dizaine = groupe de 10 */}
                      <div className={`transition-all duration-700 ${
                        animatingCircles === 'dizaines' || animatingCircles === 'all' ? 
                        'scale-110 ring-4 ring-blue-400' : ''
                      }`}>
                        <div className="grid grid-cols-5 gap-1 p-3 rounded-lg border-2 border-blue-400 bg-blue-100">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full bg-blue-600"
                            />
                          ))}
                          <div className="col-span-5 text-center text-sm font-bold text-blue-700 mt-2">
                            1 dizaine = 10
                          </div>
                        </div>
                      </div>
                      
                      {/* Unités individuelles */}
                      <div className={`flex gap-1 items-center transition-all duration-700 ${
                        animatingCircles === 'unites' || animatingCircles === 'all' ? 
                        'scale-125 ring-4 ring-red-300 rounded-lg p-2' : ''
                      }`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-red-600"
                          />
                        ))}
                        <div className="ml-2 text-sm font-bold text-red-700">
                          5 unités
                        </div>
                      </div>
                </div>
                
                    <div className="text-xl font-bold text-gray-700">
                      1 dizaine + 5 unités = 15
                    </div>
                  </div>
                </div>
              </div>
                </div>
                
            {/* Comprendre avec les objets */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Comprendre avec des objets
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🔵 Une dizaine = 10 unités groupées
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="grid grid-cols-5 gap-1 justify-center mb-2">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-red-600"
                          />
                        ))}
                              </div>
                      <div className="text-lg font-bold">10 unités = 1 dizaine</div>
                      <div className="text-lg">⬇️</div>
                      <div className="border-2 border-blue-400 rounded p-2 bg-blue-100 inline-block">
                        <div className="grid grid-cols-5 gap-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                                                             className="w-3 h-3 rounded-full bg-blue-600"
                            />
                          ))}
                        </div>
                        <div className="text-xs text-blue-700 font-bold mt-1">1 dizaine</div>
                      </div>
                    </div>
                            </div>
                          </div>
                        
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔴 Les unités = objets individuels
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold mb-2">Dans 13 :</div>
                      <div className="flex justify-center gap-2 mb-2">
                        {/* 1 dizaine */}
                        <div className="border-2 border-blue-400 rounded p-1 bg-blue-100">
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: 10 }, (_, i) => (
                              <div
                                key={i}
                                                                 className="w-2 h-2 rounded-full bg-blue-600"
                              />
                            ))}
                                  </div>
                                  </div>
                        {/* 3 unités */}
                        {Array.from({ length: 3 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-red-600"
                          />
                        ))}
                      </div>
                      <div className="text-lg">1 dizaine + 3 unités</div>
                    </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
            {/* Sélecteur de nombre */}
            <div 
              id="number-choice"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-choice' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à analyser
              </h2>
              
              <div className="grid grid-cols-5 gap-4 mb-6">
                {Array.from({ length: 10 }, (_, i) => i + 11).map((num) => (
                    <button
                    key={num}
                      onClick={() => {
                      setSelectedNumber(num);
                      explainNumber(num);
                    }}
                    className={`p-4 rounded-lg font-bold text-2xl transition-all ${
                      selectedNumber === num
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                    {num}
                    </button>
                ))}
                  </div>
                </div>

            {/* Affichage de l'analyse */}
            <div 
              id="number-analysis"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                animatingDecomposition ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Analyse de {selectedNumber}
              </h2>
              
              {(() => {
                const { dizaines, unites } = analyzeNumber(selectedNumber);
                const numberStr = selectedNumber.toString();
                return (
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <div className="text-center space-y-6">
                      {/* Affichage du nombre avec position des chiffres */}
                      <div className="flex justify-center items-center mb-6">
                        <div className="text-6xl font-bold text-blue-500 mr-2">
                          {numberStr[0]}
                    </div>
                        <div className="text-6xl font-bold text-red-500">
                          {numberStr[1] || '0'}
                  </div>
                </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-100 rounded-lg p-3">
                          <div className="text-blue-800 font-bold">↑ GAUCHE = DIZAINES</div>
                          <div className="text-3xl font-bold text-blue-600">{numberStr[0]}</div>
                        </div>
                        <div className="bg-red-100 rounded-lg p-3">
                          <div className="text-red-800 font-bold">↑ DROITE = UNITÉS</div>
                          <div className="text-3xl font-bold text-red-600">{numberStr[1] || '0'}</div>
                      </div>
                    </div>
                      
                      <div className="text-2xl font-bold text-indigo-600 mb-4">
                        {selectedNumber} = {dizaines} dizaine{dizaines > 1 ? 's' : ''} + {unites} unité{unites > 1 ? 's' : ''}
                  </div>
                  
                      <div className="bg-white rounded-lg p-6">
                        <div className="flex justify-center gap-4 mb-6 flex-wrap items-center">
                          {renderCircles(dizaines, unites)}
                  </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                          <div className={`bg-blue-100 rounded-lg p-4 transition-all duration-700 ${
                            animatingCircles === 'dizaines' || animatingCircles === 'all' ? 
                            'ring-4 ring-blue-400 bg-blue-200' : ''
                          }`}>
                            <div className="font-bold text-blue-800">Dizaines :</div>
                            <div className="flex justify-center gap-1 my-2">
                              {Array.from({ length: dizaines }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full bg-blue-600 transition-all duration-700 ${
                                    animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
                                    'scale-125 ring-2 ring-blue-300 animate-pulse' : 
                                    animatingDecomposition ? 'scale-110 ring-2 ring-blue-300' : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="font-bold text-blue-800">{dizaines} × 10 = {dizaines * 10}</div>
                </div>

                          <div className={`bg-red-100 rounded-lg p-4 transition-all duration-700 ${
                            animatingCircles === 'unites' || animatingCircles === 'all' ? 
                            'ring-4 ring-red-400 bg-red-200' : ''
                          }`}>
                            <div className="font-bold text-red-800">Unités :</div>
                            <div className="flex justify-center gap-1 my-2">
                              {Array.from({ length: unites }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full bg-red-600 transition-all duration-700 ${
                                    animatingDecomposition && (animatingCircles === 'unites' || animatingCircles === 'all') ? 
                                    'scale-125 ring-2 ring-red-300 animate-pulse' : 
                                    animatingDecomposition ? 'scale-110 ring-2 ring-red-300' : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="font-bold text-red-800">{unites} × 1 = {unites}</div>
                        </div>
                      </div>
                        
                        <div className={`mt-6 text-2xl font-bold transition-all duration-700 ${
                          animatingCircles === 'all' ? 'text-purple-600 scale-110' : 'text-gray-700'
                        }`}>
                          {dizaines * 10} + {unites} = {selectedNumber}
                    </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
                  </div>
                  
            {/* Exemples */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Exemples
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { number: 12, dizaines: 1, unites: 2 },
                  { number: 17, dizaines: 1, unites: 7 },
                  { number: 20, dizaines: 2, unites: 0 },
                  { number: 19, dizaines: 1, unites: 9 }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {item.number}
                        </div>
                      <div className="flex justify-center gap-2 mb-2 flex-wrap">
                        {renderCircles(item.dizaines, item.unites)}
                      </div>
                      <div className="text-lg text-gray-700">
                        {item.dizaines} dizaine{item.dizaines > 1 ? 's' : ''} + {item.unites} unité{item.unites > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🔵 Pour les dizaines
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Compte par groupes de 10</li>
                    <li>• Utilise tes 10 doigts</li>
                    <li>• 1 dizaine = 10 unités</li>
                    <li>• Regarde le chiffre de gauche</li>
              </ul>
            </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔴 Pour les unités
                  </h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Ce qui reste après les dizaines</li>
                    <li>• Toujours moins de 10</li>
                    <li>• Regarde le chiffre de droite</li>
                    <li>• Compte un par un</li>
                  </ul>
          </div>
                </div>
              </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎮 Mini-jeu : Trouve les dizaines et unités !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { number: '14', answer: '1 dizaine + 4 unités' },
                  { number: '18', answer: '1 dizaine + 8 unités' },
                  { number: '20', answer: '2 dizaines + 0 unité' },
                  { number: '16', answer: '1 dizaine + 6 unités' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-2">{item.number} = ?</div>
                    <div className="text-sm font-bold">{item.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ (HISTORIQUE) */
          <div className="pb-20 sm:pb-0">
            {/* Introduction de Sam le Pirate - toujours visible */}
            {SamPirateIntroJSX()}

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-8">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
                </h2>
                
                <div className="text-sm font-bold text-purple-600">
                  Score : {score}/{exercises.length}
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

            {/* Question - MOBILE ULTRA-OPTIMISÉ - AVEC BOUTON ÉCOUTER */}
            <div className="fixed inset-x-4 bottom-4 top-72 bg-white rounded-xl shadow-lg text-center overflow-y-auto flex flex-col sm:relative sm:inset-x-auto sm:bottom-auto sm:top-auto sm:p-6 md:p-8 sm:mt-8 sm:flex-none sm:overflow-visible">
              {/* Indicateur de progression mobile - toujours visible en haut */}
              <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b border-gray-200 sm:hidden">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                  <span className="font-bold text-purple-600">Score : {score}/{exercises.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto sm:p-0 sm:overflow-visible">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 sm:mb-6 md:mb-8 gap-4">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Décompose en dizaines et unités"}
                </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage du nombre avec explication si erreur */}
              <div className={`bg-white border-2 rounded-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-500 ${
                isExplainingError ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-300' : 'border-purple-200'
              }`}>
                <div className="py-6 sm:py-8 md:py-10">
                  {/* Affichage du nombre */}
                  <div className="text-6xl sm:text-8xl font-bold text-purple-600 mb-4">
                    {exercises[currentExercise]?.number}
                  </div>
                  
                  {/* Représentation visuelle */}
                  <div className="flex justify-center gap-2 mb-4 flex-wrap">
                    {(() => {
                      const exercise = exercises[currentExercise];
                      if (!exercise) return null;
                      const { dizaines, unites } = analyzeNumber(exercise.number);
                      return renderCircles(dizaines, unites);
                    })()}
                  </div>
                  
                  <p className="text-sm sm:text-lg text-gray-700 font-semibold mb-6 hidden sm:block">
                    Décompose ce nombre en dizaines et unités !
                  </p>
                  
                  {/* Message d'explication avec la bonne réponse en rouge */}
                  {isExplainingError && (
                    <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
                      <div className="text-lg font-bold text-red-800 mb-2">
                        🏴‍☠️ Explication de Sam le Pirate
                      </div>
                      <div className="text-red-700 text-xl">
                        La bonne réponse est <span className="font-bold text-3xl text-red-800">{exercises[currentExercise]?.correctDizaines} dizaines et {exercises[currentExercise]?.correctUnites} unités</span> !
                      </div>
                      <div className="text-sm text-red-600 mt-2">
                        Le nombre {exercises[currentExercise]?.number} se décompose en {exercises[currentExercise]?.correctDizaines} dizaines et {exercises[currentExercise]?.correctUnites} unités !
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Champs de réponse - Dizaines et Unités */}
              <div className="mb-8 sm:mb-12">
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className={`transition-all duration-500 ${
                    highlightedElement === 'answer-input' ? 'ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-4 scale-110 shadow-2xl animate-pulse' : ''
                  }`}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Dizaines</label>
                    <input
                      id="dizaines-input"
                      type="number"
                      value={userAnswer.split(',')[0] || ''}
                      onChange={(e) => {
                        const unites = userAnswer.split(',')[1] || '';
                        setUserAnswer(e.target.value + ',' + unites);
                      }}
                      onClick={() => stopAllVocalsAndAnimations()}
                      disabled={isCorrect !== null || isPlayingVocal}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="?"
                      min="0"
                      max="2"
                    />
                  </div>
                  
                  <div className={`transition-all duration-500 ${
                    highlightedElement === 'answer-input' ? 'ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-4 scale-110 shadow-2xl animate-pulse' : ''
                  }`}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Unités</label>
                    <input
                      id="unites-input"
                      type="number"
                      value={userAnswer.split(',')[1] || ''}
                      onChange={(e) => {
                        const dizaines = userAnswer.split(',')[0] || '';
                        setUserAnswer(dizaines + ',' + e.target.value);
                      }}
                      onClick={() => stopAllVocalsAndAnimations()}
                      disabled={isCorrect !== null || isPlayingVocal}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="?"
                      min="0"
                      max="9"
                    />
                  </div>
                </div>
              </div>
              
              {/* Boutons Valider et Suivant */}
              <div className="sticky bottom-0 bg-white pt-4 mt-auto sm:mb-6 sm:static sm:pt-0">
                  <div className="flex gap-4 justify-center">
                    <button
                    id="validate-button"
                    onClick={() => handleAnswerSubmit(userAnswer)}
                    disabled={!userAnswer.trim() || userAnswer.split(',').length !== 2 || isCorrect !== null || isPlayingVocal}
                    className={`bg-green-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'validate-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                    }`}
                  >
                    Valider
                    </button>

                    <button
                    id="next-exercise-button"
                    onClick={nextExercise}
                    disabled={(!isExplainingError && isCorrect !== false) || isPlayingVocal}
                    className={`bg-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'next-exercise-button' || highlightNextButton ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                    } ${
                      isExplainingError || isCorrect === false ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    Suivant →
                    </button>
                  </div>
              </div>
              </div>
              
              {/* Résultat - Simplifié */}
              {isCorrect !== null && isCorrect && (
                <div className="p-4 sm:p-6 rounded-lg mb-6 bg-green-100 text-green-800">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="font-bold text-lg sm:text-xl">
                      Bravo ! {exercises[currentExercise].number} = {exercises[currentExercise].correctDizaines} dizaines et {exercises[currentExercise].correctUnites} unités !
                    </span>
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
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert des dizaines et unités !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
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
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comprendre les dizaines et unités est très important !
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