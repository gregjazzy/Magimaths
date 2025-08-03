'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Play, Pause } from 'lucide-react';

// Styles CSS pour les animations
const symbolAnimationStyles = `
  @keyframes subtle-glow {
    0%, 100% { 
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.3), 0 0 10px rgba(59, 130, 246, 0.2), 0 0 15px rgba(59, 130, 246, 0.1);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2);
      transform: scale(1.05);
    }
  }
`;

export default function DoublesMoitiesCP() {
  const [selectedType, setSelectedType] = useState('doubles');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // Nouveaux états pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingDoubles, setAnimatingDoubles] = useState(false);
  const [animatingMoities, setAnimatingMoities] = useState(false);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'addition' | 'division' | null>(null);
  const [highlightExplanationButtons, setHighlightExplanationButtons] = useState(false);

  // États pour le mini-jeu
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>([false, false, false, false]);
  const [completedAnswers, setCompletedAnswers] = useState<boolean[]>([false, false, false, false]);
  const [miniGameScore, setMiniGameScore] = useState(0);

  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions de pirate aléatoires pour chaque exercice
  const pirateExpressions = [
    "Mille sabords", "Tonnerre de Brest", "Sacré matelot", "Par Neptune", "Sang de pirate",
    "Mille millions de mille sabords", "Ventrebleu", "Sapristi", "Morbleu", "Fichtre"
  ];

  // Compliments aléatoires pour les bonnes réponses
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", 
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire"
  ];

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingDoubles(false);
    setAnimatingMoities(false);
    setHighlightedNumber(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setShowingProcess(null);
    setHighlightExplanationButtons(false);
    
    // Réinitialiser les états Sam
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    
    setTimeout(() => {
      speechSynthesis.cancel();
    }, 100);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const femaleVoiceNames = ['Amélie', 'Audrey', 'Marie', 'Julie', 'Céline', 'Virginie'];
      
      let selectedVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && 
        femaleVoiceNames.some(name => voice.name.includes(name))
      );

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && 
          (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'))
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'fr-FR' && voice.localService);
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'fr-FR');
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
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
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Pour lire l'énoncé appuie sur écouter l'énoncé");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      setShowExercisesList(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Dès que tu as la réponse, tu peux cliquer sur la bonne réponse");
      if (stopSignalRef.current) return;
      
      // Mettre en évidence la zone des réponses
      setHighlightedElement('answer-choices');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Si tu te trompes, je t'expliquerai la bonne réponse !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("En avant toutes pour les doubles et moitiés !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour lire l'énoncé de l'exercice
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

  // Fonction pour féliciter avec audio pour les bonnes réponses
  const celebrateCorrectAnswer = async () => {
    if (stopSignalRef.current) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      await playAudio(randomCompliment + " !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans celebrateCorrectAnswer:', error);
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
      
      await new Promise(resolve => setTimeout(resolve, 800));
      if (stopSignalRef.current) return;
      
      const exercise = exercises[currentExercise];
      await playAudio(`La bonne réponse était : ${exercise.correctAnswer} !`);
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Appuie sur le bouton Suivant pour continuer ton aventure !");
      if (stopSignalRef.current) return;
      
      // Scroll vers le bouton suivant après l'explication - optimisé pour mobile
      setTimeout(() => {
        const nextButton = document.getElementById('next-exercise-button');
        if (nextButton) {
          const isMobile = window.innerWidth < 768; // sm breakpoint
          
          if (isMobile) {
            // Pour mobile: scroll pour que le bouton apparaisse en bas de l'écran
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end', // En bas de l'écran
              inline: 'nearest' 
            });
            
            // Petit délai supplémentaire puis second scroll pour s'assurer de la visibilité
            setTimeout(() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }, 600);
          } else {
            // Pour desktop: scroll normal
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest' 
            });
          }
          
          // Animation d'attention sur le bouton
          setTimeout(() => {
            nextButton.classList.add('animate-bounce');
            setTimeout(() => {
              nextButton.classList.remove('animate-bounce');
            }, 2000);
          }, isMobile ? 1000 : 500);
        }
      }, 1000); // Plus de délai pour que tout l'audio se termine
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      // Ne PAS remettre setIsExplainingError(false) ici - le bouton Suivant doit rester actif
      // L'état sera réinitialisé quand l'utilisateur clique sur "Suivant"
    }
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

  // Fonction pour expliquer le chapitre
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setHasStarted(true);
    
    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre ce que sont les doubles et les moitiés.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Tu vas découvrir comment doubler un nombre et comment le partager en deux !", true);
      if (stopSignalRef.current) return;
      
      // 2. Explication des doubles avec animations sur la BOX DOUBLES
      await wait(1800);
      scrollToSection('concept-section');
      await wait(800);
      setHighlightedElement('concept-section');
      await playAudio("Commençons par les doubles. Un double, c'est quand on ajoute un nombre à lui-même !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Regardons ensemble l'exemple du double de 3.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(3);
      await playAudio("Ici, j'ai 3 cercles rouges.", true);
      if (stopSignalRef.current) return;
      
        await wait(1200);
      setShowingProcess('addition');
      await playAudio("Pour faire le double, j'ajoute 3 plus 3.", true);
      if (stopSignalRef.current) return;
      
      await wait(1800);
      setHighlightedNumber(6);
      await playAudio("3 plus 3 égale 6 ! Le double de 3, c'est 6 !", true);
      if (stopSignalRef.current) return;
      
        await wait(1500);
      await playAudio("C'est comme avoir des chaussettes : toujours par paires identiques !", true);
      if (stopSignalRef.current) return;
      
      // 3. Explication des moitiés avec animations sur la BOX MOITIÉS
        await wait(2000);
      setHighlightedNumber(null);
      setShowingProcess(null);
      scrollToSection('moities-concept-section');
      await wait(800);
      setHighlightedElement('moities-concept-section');
      
      await playAudio("Maintenant, parlons des moitiés. Une moitié, c'est partager en deux parts égales !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Regardons l'exemple de la moitié de 6.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(6);
      await playAudio("J'ai 6 cercles rouges.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('division');
      await playAudio("Pour faire la moitié, je partage 6 en deux groupes égaux.", true);
      if (stopSignalRef.current) return;
      
      await wait(1800);
      setHighlightedNumber(3);
      await playAudio("6 divisé par 2 égale 3 ! La moitié de 6, c'est 3 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("C'est comme couper un gâteau en deux parts identiques !", true);
      if (stopSignalRef.current) return;
      
      // 4. Présentation des autres exemples - illuminer les BOUTONS de choix
      await wait(2500);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setHighlightedElement(null);
      await playAudio("Parfait ! Maintenant tu comprends les concepts de base.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a d'autres exemples à découvrir pour bien maîtriser !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      scrollToSection('selector-section');
      await playAudio("Regarde ici !", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedElement('doubles-button');
      await playAudio("Il y a d'autres exemples de doubles à explorer...", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('moities-button');
      await playAudio("...et d'autres exemples de moitiés aussi !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedElement('selector-section');
      await playAudio("Clique sur ton choix pour voir tous les exemples avec leurs animations !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
    }
  };

  // Fonction pour expliquer les doubles en général
  const explainDoublesGeneral = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingDoubles(true);
      setHighlightedElement('doubles-section');
      scrollToSection('doubles-section');
      
      await playAudio("Parfait ! Tu as choisi d'apprendre les doubles !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Voici tous les exemples de doubles que tu peux découvrir !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightExplanationButtons(true);
      await playAudio("Clique sur l'explication à côté de chaque exemple pour voir l'animation détaillée !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightExplanationButtons(false);
      await playAudio("Ou clique sur 'Voir tous les exemples' pour les découvrir d'affilée !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
    } finally {
      setAnimatingDoubles(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer un double spécifique
  const explainSpecificDouble = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const item = doublesData[index];
    
    try {
      setCurrentExample(index);
      setAnimatingStep('introduction');
      scrollToSection('doubles-section');
      
      await playAudio(`Je vais t'expliquer le double de ${item.number}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(item.number);
      
      // Scroll vers l'exemple spécifique en cours
      setTimeout(() => {
        const exampleElement = document.querySelectorAll('#doubles-section .space-y-4 > div')[index];
        if (exampleElement) {
          exampleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      
      await playAudio(`Ici, j'ai le nombre ${item.number}. Je vois ${item.number} cercle${item.number > 1 ? 's' : ''} rouge${item.number > 1 ? 's' : ''}.`, true);
      if (stopSignalRef.current) return;
        
        await wait(1200);
      setShowingProcess('addition');
      await playAudio(`Pour faire le double, j'ajoute ${item.number} plus ${item.number}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(item.double);
      await playAudio(`Résultat : ${item.number} plus ${item.number} égale ${item.double} ! Le double de ${item.number}, c'est ${item.double} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer tous les doubles d'affilée
  const explainAllDoubles = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingDoubles(true);
      scrollToSection('doubles-section');
      
      await playAudio("Je vais te montrer tous les doubles un par un !", true);
      if (stopSignalRef.current) return;
      
      for (let i = 0; i < doublesData.length; i++) {
        if (stopSignalRef.current) return;
        await explainSpecificDouble(i);
        await wait(1000);
      }
      
      await playAudio("Voilà ! Tu connais maintenant tous les doubles !", true);
      if (stopSignalRef.current) return;
      
    } finally {
      setAnimatingDoubles(false);
    }
  };

  // Fonction pour expliquer les moitiés en général
  const explainMoitiesGeneral = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingMoities(true);
      setHighlightedElement('moities-section');
      scrollToSection('moities-section');
      
      await playAudio("Excellent choix ! Tu as choisi d'apprendre les moitiés !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Voici tous les exemples de moitiés que tu peux découvrir !", true);
      if (stopSignalRef.current) return;
      
        await wait(1200);
      setHighlightExplanationButtons(true);
      await playAudio("Clique sur l'explication à côté de chaque exemple pour voir l'animation détaillée !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightExplanationButtons(false);
      await playAudio("Ou clique sur 'Voir tous les exemples' pour les découvrir d'affilée !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
    } finally {
      setAnimatingMoities(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer une moitié spécifique
  const explainSpecificMoitie = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const item = moitiesData[index];
    
    try {
      setCurrentExample(index);
      setAnimatingStep('introduction');
      scrollToSection('moities-section');
      
      await playAudio(`Je vais t'expliquer la moitié de ${item.number}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(item.number);
      
      // Scroll vers l'exemple spécifique en cours
      setTimeout(() => {
        const exampleElement = document.querySelectorAll('#moities-section .space-y-4 > div')[index];
        if (exampleElement) {
          exampleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      
      await playAudio(`Ici, j'ai le nombre ${item.number}. Je vois ${item.number} cercle${item.number > 1 ? 's' : ''} rouge${item.number > 1 ? 's' : ''}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('division');
      await playAudio(`Pour faire la moitié, je partage ${item.number} en deux groupes égaux.`, true);
      if (stopSignalRef.current) return;
      
        await wait(1500);
      setHighlightedNumber(item.half);
      await playAudio(`${item.number} divisé par 2 égale ${item.half} ! La moitié de ${item.number}, c'est ${item.half} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer toutes les moitiés d'affilée
  const explainAllMoities = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingMoities(true);
      scrollToSection('moities-section');
      
      await playAudio("Je vais te montrer toutes les moitiés une par une !", true);
      if (stopSignalRef.current) return;
      
      for (let i = 0; i < moitiesData.length; i++) {
        if (stopSignalRef.current) return;
        await explainSpecificMoitie(i);
        await wait(1000);
      }
      
      await playAudio("Voilà ! Tu connais maintenant toutes les moitiés !", true);
      if (stopSignalRef.current) return;
      
    } finally {
      setAnimatingMoities(false);
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
      sectionId: 'doubles-moities',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'doubles-moities');
      
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

  // Données sur les doubles et moitiés
  const doublesData = [
    { number: 1, double: 2 },
    { number: 2, double: 4 },
    { number: 3, double: 6 },
    { number: 4, double: 8 },
    { number: 5, double: 10 }
  ];

  const moitiesData = [
    { number: 2, half: 1 },
    { number: 4, half: 2 },
    { number: 6, half: 3 },
    { number: 8, half: 4 },
    { number: 10, half: 5 }
  ];

  // Exercices sur les doubles et moitiés
  const exercises = [
    { question: 'Quel est le double de 2 ?', correctAnswer: '4', choices: ['3', '4', '5'], type: 'double' },
    { question: 'Quel est le double de 3 ?', correctAnswer: '6', choices: ['5', '6', '7'], type: 'double' },
    { question: 'Quel est le double de 4 ?', correctAnswer: '8', choices: ['7', '8', '9'], type: 'double' },
    { question: 'Quel est le double de 1 ?', correctAnswer: '2', choices: ['1', '2', '3'], type: 'double' },
    { question: 'Quel est le double de 5 ?', correctAnswer: '10', choices: ['9', '10', '11'], type: 'double' },
    { question: 'Quelle est la moitié de 4 ?', correctAnswer: '2', choices: ['1', '2', '3'], type: 'moitie' },
    { question: 'Quelle est la moitié de 6 ?', correctAnswer: '3', choices: ['2', '3', '4'], type: 'moitie' },
    { question: 'Quelle est la moitié de 8 ?', correctAnswer: '4', choices: ['3', '4', '5'], type: 'moitie' },
    { question: 'Quelle est la moitié de 2 ?', correctAnswer: '1', choices: ['0', '1', '2'], type: 'moitie' },
    { question: 'Quelle est la moitié de 10 ?', correctAnswer: '5', choices: ['4', '5', '6'], type: 'moitie' },
    { question: 'Quel est le double de 3 ?', correctAnswer: '6', choices: ['4', '6', '8'], type: 'double' },
    { question: 'Quelle est la moitié de 6 ?', correctAnswer: '3', choices: ['1', '3', '5'], type: 'moitie' },
    { question: 'Quel est le double de 4 ?', correctAnswer: '8', choices: ['6', '8', '10'], type: 'double' },
    { question: 'Quelle est la moitié de 8 ?', correctAnswer: '4', choices: ['2', '4', '6'], type: 'moitie' },
    { question: 'Quel est le double de 2 ?', correctAnswer: '4', choices: ['2', '4', '6'], type: 'double' }
  ];
        
  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };
      
  // Fonction pour rendre les cercles CSS 
  const renderCircles = (count: number) => {
    if (count <= 0) return null;
    
    const circles = [];
    for (let i = 0; i < count; i++) {
      circles.push(
        <div
          key={i}
          className="w-6 h-6 bg-red-600 rounded-full inline-block transition-all duration-300"
          style={{ 
            animationDelay: `${i * 100}ms`,
            transform: highlightedNumber === count ? 'scale(1.2)' : 'scale(1)'
          }}
        />
      );
    }
    
    return (
      <div className="flex flex-wrap gap-1 justify-center items-center">
        {circles}
      </div>
    );
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

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
    if (!showExercises) {
      // Quand on revient au cours, réinitialiser les états Sam
      setPirateIntroStarted(false);
      setShowExercisesList(false);
      setSamSizeExpanded(false);
      setExerciseStarted(false);
    }
  }, [showExercises]);

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  // Effet pour réinitialiser les états sur changement d'exercice
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
  }, [currentExercise]);

  const handleAnswerClick = async (answer: string) => {
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
      // Célébrer avec Sam le Pirate (mais sans bloquer le passage automatique)
      celebrateCorrectAnswer(); // Pas de await pour éviter les blocages
    } else {
      // Expliquer l'erreur avec Sam le Pirate
      await explainWrongAnswer();
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations(); // Stop any ongoing audio before moving to next
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      // Réinitialiser les états Sam
      setIsExplainingError(false);
      setShowNextButton(false);
      setHighlightNextButton(false);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations(); // Stop any ongoing audio before reset
    
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    
    // Réinitialiser les états Sam
    setSamSizeExpanded(false);
    setExerciseStarted(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    
    // Réinitialiser les états du mini-jeu
    setRevealedAnswers([false, false, false, false]);
    setCompletedAnswers([false, false, false, false]);
    setMiniGameScore(0);
  };

  // Fonctions pour le mini-jeu
  const revealAnswer = (index: number) => {
    const newRevealed = [...revealedAnswers];
    newRevealed[index] = true;
    setRevealedAnswers(newRevealed);

    const newCompleted = [...completedAnswers];
    newCompleted[index] = true;
    setCompletedAnswers(newCompleted);

    setMiniGameScore(prev => prev + 1);
  };

  const resetMiniGame = () => {
    setRevealedAnswers([false, false, false, false]);
    setCompletedAnswers([false, false, false, false]);
    setMiniGameScore(0);
  };

  // JSX pour l'introduction de Sam le Pirate dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-1 sm:mt-2">
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
              : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-4 border-yellow-300'
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

  // Composant JSX pour le bouton "Écouter l'énoncé"
  const ListenQuestionButtonJSX = () => (
    <div className="mb-3 sm:mb-6">
      <button
        id="listen-question-button"
        onClick={startExerciseExplanation}
        disabled={isPlayingVocal || !pirateIntroStarted}
        className={`bg-blue-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 mx-auto shadow-lg ${
          highlightedElement === 'listen-question-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
        }`}
      >
        <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span>🎧 Écouter l'énoncé</span>
      </button>
    </div>
  );
    
    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 pb-8 sm:pb-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-4">
              🎯 Doubles et moitiés
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Découvre les doubles et les moitiés des nombres !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-2 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-3 sm:px-6 py-1 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                !showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
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
              className={`px-3 sm:px-6 py-1 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-2 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
            {/* Image de Sam le Pirate */}
            <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
              isPlayingVocal
                  ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                : samSizeExpanded
                    ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Initial - plus petit sur mobile
              }`}>
                <img 
                  src="/image/pirate-small.png" 
                  alt="Sam le Pirate" 
                  className="w-full h-full rounded-full object-cover"
                />
              {/* Megaphone animé quand il parle */}
                {isPlayingVocal && (
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
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-12 py-2 sm:py-6 rounded-xl font-bold text-sm sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
              }`}
            >
                <Play className="inline w-4 h-4 sm:w-8 sm:h-8 mr-1 sm:mr-4" />
                {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
              </button>
              </div>
            </div>

            {/* Qu'est-ce qu'un double ? */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  🤔 Qu'est-ce qu'un double ?
                </h2>
                {/* Icône d'animation pour les concepts */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-green-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🤔 Animation des concepts ! Cliquez pour voir les explications."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      scrollToSection('concept-section');
                      await new Promise(resolve => setTimeout(resolve, 300));
                      setHighlightedElement('concept-section');
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      setHighlightedElement(null);
                    }
                  }}
                >
                  🤔
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-sm sm:text-base text-center text-green-800 font-semibold mb-3 sm:mb-4">
                  Le double d'un nombre, c'est ce nombre + lui-même !
                </p>
                
                <div className="bg-white rounded-lg p-2 sm:p-4">
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-bold text-green-600 mb-2">
                      Exemple : Double de 3 = 3 + 3 = 6
                    </div>
                    <div className="text-sm text-gray-700 mb-2 sm:mb-4">
                      On ajoute 3 avec lui-même pour faire 6
                    </div>
                    <div className="flex justify-center items-center space-x-2 sm:space-x-4 text-sm sm:text-lg">
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-2">3 cercles</div>
                        <div className="scale-75">{renderCircles(3)}</div>
                      </div>
                      <div className="text-base sm:text-xl text-green-600 font-bold">+</div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-2">3 cercles</div>
                        <div className="scale-75">{renderCircles(3)}</div>
                      </div>
                      <div className="text-base sm:text-xl text-green-600 font-bold">=</div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-2">6 cercles</div>
                        <div className="scale-75">{renderCircles(6)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Qu'est-ce qu'une moitié ? */}
            <div 
              id="moities-concept-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'moities-concept-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  ✂️ Qu'est-ce qu'une moitié ?
                </h2>
                {/* Icône d'animation pour les moitiés */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-blue-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-blue-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="✂️ Animation des moitiés ! Cliquez pour voir les partages."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      scrollToSection('moities-concept-section');
                      await new Promise(resolve => setTimeout(resolve, 300));
                      setHighlightedElement('moities-concept-section');
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      setHighlightedElement(null);
                    }
                  }}
                >
                  ✂️
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-sm sm:text-base text-center text-blue-800 font-semibold mb-3 sm:mb-4">
                  La moitié d'un nombre, c'est le partager en 2 parts égales !
                </p>
                
                <div className="bg-white rounded-lg p-2 sm:p-4">
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-bold text-blue-600 mb-2">
                      Exemple : Moitié de 6 = 6 ÷ 2 = 3
                    </div>
                    <div className="text-sm text-gray-700 mb-2 sm:mb-4">
                      On partage 6 en 2 groupes égaux de 3
                    </div>
                    <div className="flex justify-center items-center space-x-2 sm:space-x-4 text-sm sm:text-lg">
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-2">6 cercles</div>
                        <div className="scale-75">{renderCircles(6)}</div>
                      </div>
                      <div className="text-base sm:text-xl text-blue-600 font-bold">÷ 2 =</div>
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-2">3 cercles</div>
                        <div className="border-2 border-blue-300 rounded-lg p-2 bg-blue-50 scale-75">
                          {renderCircles(3)}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">chaque part</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de type */}
            <div 
              id="selector-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'selector-section' ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  🎯 Choisis ce que tu veux apprendre
                </h2>
                {/* Icône d'animation pour le sélecteur */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-purple-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-purple-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🎯 Animation du sélecteur ! Cliquez pour un aperçu."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      scrollToSection('selector-section');
                      await new Promise(resolve => setTimeout(resolve, 300));
                      setHighlightedElement('selector-section');
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      setHighlightedElement(null);
                    }
                  }}
                >
                  🎯
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-6">
                <button
                  id="doubles-button"
                  onClick={() => {
                    setSelectedType('doubles');
                    explainDoublesGeneral();
                  }}
                  className={`p-3 sm:p-6 rounded-lg font-bold text-sm sm:text-xl transition-all ${
                    selectedType === 'doubles'
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${
                    highlightedElement === 'doubles-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                  }`}
                >
                  🎯 Les doubles
                </button>
                <button
                  id="moities-button"
                  onClick={() => {
                    setSelectedType('moities');
                    explainMoitiesGeneral();
                  }}
                  className={`p-3 sm:p-6 rounded-lg font-bold text-sm sm:text-xl transition-all ${
                    selectedType === 'moities'
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${
                    highlightedElement === 'moities-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''
                  }`}
                >
                  ✂️ Les moitiés
                </button>
              </div>
            </div>

            {/* Affichage des données */}
            {selectedType === 'doubles' ? (
              <div 
                id="doubles-section"
                className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                  animatingDoubles ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-center mb-3 sm:mb-6 space-x-2 sm:space-x-4 flex-wrap gap-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                    🎯 Tableau des doubles
                  </h2>
                  <button
                    onClick={explainAllDoubles}
                    className="bg-orange-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm sm:text-base"
                  >
                    🎬 Tous les exemples
                  </button>
                        </div>
                
                <div className="mb-3 sm:mb-6 p-2 sm:p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                  <p className="text-sm sm:text-base text-green-800">
                    💡 <strong>Astuce :</strong> Clique sur "▶️ Explication" pour voir l'animation ! <span className="hidden sm:inline">Ou clique sur "🎬 Voir tous les exemples" pour découvrir tous les doubles d'affilée !</span>
                  </p>
                        </div>
                
                {/* Indicateur d'étape */}
                {animatingStep && (
                  <div className="mb-2 sm:mb-4 p-2 sm:p-3 rounded-lg bg-green-100 border-l-4 border-green-500">
                    <div className="text-base sm:text-lg font-bold text-green-800">
                      {animatingStep === 'introduction' && '🎯 Découverte des doubles'}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 sm:space-y-4">
                  {doublesData.map((item, index) => (
                    <div 
                      key={index} 
                      className={`bg-green-50 rounded-lg p-3 sm:p-6 transition-all duration-700 ${
                        currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                      }`}
                    >
                      <div className="text-center space-y-2 sm:space-y-4">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-2 sm:mb-4">
                          <div className={`text-xl sm:text-3xl font-bold text-green-600 transition-all duration-500 ${
                            highlightedNumber === item.double ? 'text-2xl sm:text-4xl text-yellow-800 animate-pulse' : ''
                          }`}>
                            Double de {item.number} = {item.double}
                      </div>
                          <button
                            onClick={() => explainSpecificDouble(index)}
                            className={`bg-yellow-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm ${
                              highlightExplanationButtons ? 'ring-4 ring-orange-400 animate-pulse bg-orange-500 scale-110 shadow-2xl' : ''
                            }`}
                          >
                            ▶️ Explication
                          </button>
                    </div>

                        <div className="bg-white rounded-lg p-2 sm:p-4">
                          <div className={`text-base sm:text-xl text-gray-700 mb-2 sm:mb-4 transition-all duration-300 ${
                            showingProcess === 'addition' && currentExample === index ? 'text-lg sm:text-2xl text-green-800 font-bold' : ''
                          }`}>
                            {item.number} + {item.number} = {item.double}
                          </div>
                          
                          <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                            <div className="text-center">
                              <div className="text-xs sm:text-sm text-gray-600 mb-2">{item.number} cercles</div>
                              <div className={`transition-all duration-500 scale-75 ${
                                highlightedNumber === item.number && currentExample === index ? 'scale-90' : ''
                              }`}>
                                {renderCircles(item.number)}
                              </div>
                            </div>
                            <div className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
                              showingProcess === 'addition' && currentExample === index ? 'text-2xl sm:text-3xl text-green-600 animate-bounce' : 'text-green-600'
                            }`}>+</div>
                            <div className="text-center">
                              <div className="text-xs sm:text-sm text-gray-600 mb-2">{item.number} cercles</div>
                              <div className={`transition-all duration-500 scale-75 ${
                                highlightedNumber === item.number && currentExample === index ? 'scale-90' : ''
                              }`}>
                                {renderCircles(item.number)}
                              </div>
                            </div>
                            <div className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
                              showingProcess === 'addition' && currentExample === index ? 'text-2xl sm:text-3xl text-green-600 animate-bounce' : 'text-green-600'
                            }`}>=</div>
                            <div className="text-center">
                              <div className="text-xs sm:text-sm text-gray-600 mb-2">{item.double} cercles</div>
                              <div className={`transition-all duration-500 scale-75 ${
                                highlightedNumber === item.double && currentExample === index ? 'scale-90 ring-4 ring-green-400 rounded-lg p-1 sm:p-2' : ''
                              }`}>
                                {renderCircles(item.double)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div 
                id="moities-section"
                className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                  animatingMoities ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-center mb-3 sm:mb-6 space-x-2 sm:space-x-4 flex-wrap gap-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                    ✂️ Tableau des moitiés
                  </h2>
                      <button
                    onClick={explainAllMoities}
                    className="bg-orange-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm sm:text-base"
                  >
                    🎬 Tous les exemples
                      </button>
                    </div>
                
                <div className="mb-3 sm:mb-6 p-2 sm:p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                  <p className="text-sm sm:text-base text-blue-800">
                    💡 <strong>Astuce :</strong> Clique sur "▶️ Explication" pour voir l'animation ! <span className="hidden sm:inline">Ou clique sur "🎬 Voir tous les exemples" pour découvrir toutes les moitiés d'affilée !</span>
                  </p>
                  </div>
                
                {/* Indicateur d'étape */}
                {animatingStep && (
                  <div className="mb-2 sm:mb-4 p-2 sm:p-3 rounded-lg bg-blue-100 border-l-4 border-blue-500">
                    <div className="text-base sm:text-lg font-bold text-blue-800">
                      {animatingStep === 'introduction' && '🎯 Découverte des moitiés'}
            </div>
                  </div>
                )}
                
                <div className="space-y-2 sm:space-y-4">
                  {moitiesData.map((item, index) => (
                    <div 
                      key={index} 
                      className={`bg-blue-50 rounded-lg p-3 sm:p-6 transition-all duration-700 ${
                        currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                      }`}
                    >
                      <div className="text-center space-y-2 sm:space-y-4">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-2 sm:mb-4">
                          <div className={`text-xl sm:text-3xl font-bold text-blue-600 transition-all duration-500 ${
                            highlightedNumber === item.half ? 'text-2xl sm:text-4xl text-yellow-800 animate-pulse' : ''
                          }`}>
                            Moitié de {item.number} = {item.half}
                    </div>
                          <button
                            onClick={() => explainSpecificMoitie(index)}
                            className={`bg-yellow-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm ${
                              highlightExplanationButtons ? 'ring-4 ring-orange-400 animate-pulse bg-orange-500 scale-110 shadow-2xl' : ''
                            }`}
                          >
                            ▶️ Explication
                          </button>
                </div>
                        
                        <div className="bg-white rounded-lg p-2 sm:p-4">
                          <div className={`text-base sm:text-xl text-gray-700 mb-2 sm:mb-4 transition-all duration-300 ${
                            showingProcess === 'division' && currentExample === index ? 'text-lg sm:text-2xl text-blue-800 font-bold' : ''
                          }`}>
                            {item.number} ÷ 2 = {item.half}
                          </div>
                          
                          <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                            <div className="text-center">
                              <div className="text-xs sm:text-sm text-gray-600 mb-2">{item.number} cercles</div>
                              <div className={`transition-all duration-500 ${
                                highlightedNumber === item.number && currentExample === index ? 'scale-110' : ''
                              }`}>
                                {renderCircles(item.number)}
                    </div>
                </div>
                            <div className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${
                              showingProcess === 'division' && currentExample === index ? 'text-2xl sm:text-3xl text-blue-600 animate-bounce' : 'text-blue-600'
                            }`}>÷ 2 =</div>
                            <div className="text-center">
                              <div className="text-xs sm:text-sm text-gray-600 mb-2">chaque part</div>
                              <div className={`border-2 border-blue-300 rounded-lg p-1 sm:p-2 bg-blue-50 transition-all duration-500 scale-75 ${
                                highlightedNumber === item.half && currentExample === index ? 'scale-90 ring-4 ring-blue-400' : ''
                              }`}>
                                {renderCircles(item.half)}
              </div>
                              <div className="text-xs text-blue-600 mt-1">= {item.half}</div>
            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conseils pratiques */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-green-800">
                    🎯 Pour les doubles
                  </h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• Tes doigts : 2 mains = 10</li>
                    <li>• Objets identiques</li>
                    <li>• Ajouter à soi-même</li>
                    <li>• Chaussettes par paires !</li>
              </ul>
            </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4 text-blue-800">
                    ✂️ Pour les moitiés
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• 2 groupes égaux</li>
                    <li>• Gâteau en 2 parts</li>
                    <li>• Inverse du double</li>
                    <li>• Utilise des objets</li>
                  </ul>
          </div>
                </div>
              </div>

            {/* Mini-jeu sobre */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              {/* En-tête simple */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">🎮 Mini-jeu : Doubles et moitiés !</h3>
                <button
                  onClick={resetMiniGame}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Score simple */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  Score: <span className="font-bold text-gray-900">{miniGameScore}/4</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        completedAnswers[i] ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Message de félicitations sobre */}
              {miniGameScore === 4 && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-4 text-center">
                  ✅ Excellent ! Toutes les réponses sont correctes !
                </div>
              )}

              <p className="text-sm text-gray-600 mb-4 text-center">
                Clique sur "Voir la solution" pour révéler chaque réponse.
              </p>

              {/* Cartes colorées */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { comparison: 'Double de 2 ?', answer: 'Double de 2 = 4', color: 'green' },
                  { comparison: 'Moitié de 8 ?', answer: 'Moitié de 8 = 4', color: 'blue' },
                  { comparison: 'Double de 4 ?', answer: 'Double de 4 = 8', color: 'green' },
                  { comparison: 'Moitié de 6 ?', answer: 'Moitié de 6 = 3', color: 'blue' }
                ].map((item, index) => {
                  const getCardColors = (color: string) => {
                    switch(color) {
                      case 'green':
                        return {
                          bg: completedAnswers[index] ? 'bg-green-100 border-green-400' : 'bg-green-50 border-green-200',
                          text: 'text-green-800',
                          button: 'bg-green-500 hover:bg-green-600 text-white'
                        };
                      case 'blue':
                        return {
                          bg: completedAnswers[index] ? 'bg-blue-100 border-blue-400' : 'bg-blue-50 border-blue-200',
                          text: 'text-blue-800',
                          button: 'bg-blue-500 hover:bg-blue-600 text-white'
                        };
                      default:
                        return {
                          bg: 'bg-gray-50 border-gray-200',
                          text: 'text-gray-800',
                          button: 'bg-gray-500 hover:bg-gray-600 text-white'
                        };
                    }
                  };
                  
                  const colors = getCardColors(item.color);
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-lg border-2 text-center transition-all duration-300 ${colors.bg} ${colors.text}`}
                    >
                      <div className="font-bold text-sm sm:text-base mb-2">{item.comparison}</div>
                      
                      {revealedAnswers[index] ? (
                        <div className="space-y-1 sm:space-y-2">
                          <div className="text-sm sm:text-base font-bold p-1 sm:p-2 bg-white rounded border">
                            {item.answer}
                          </div>
                          {completedAnswers[index] && (
                            <div className="text-base">
                              ✅
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => revealAnswer(index)}
                          className={`px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all hover:scale-105 ${colors.button}`}
                        >
                          👁️ Voir la solution
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Barre de progression simple */}
              {miniGameScore > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-500 ease-out"
                      style={{ width: `${(miniGameScore / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Introduction de Sam le Pirate - toujours visible */}
            {SamPirateIntroJSX()}
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="hidden sm:block bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-green-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 sm:mb-6 md:mb-8 gap-2 sm:gap-4">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise].question}
                </h3>
                {ListenQuestionButtonJSX()}
              </div>
                    
              {/* Indication du type */}
              <div className={`rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 ${
                exercises[currentExercise].type === 'double' 
                  ? 'bg-green-50' 
                  : 'bg-blue-50'
                        }`}>
                <div className={`text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 ${
                  exercises[currentExercise].type === 'double' 
                    ? 'text-green-600' 
                    : 'text-blue-600'
                            }`}>
                  {exercises[currentExercise].type === 'double' ? '🎯' : '✂️'}
                          </div>
                <p className="text-base sm:text-lg text-gray-700 font-semibold">
                  {exercises[currentExercise].type === 'double' 
                    ? 'Trouve le double !' 
                    : 'Trouve la moitié !'}
                </p>
                          </div>
                    
                    {/* Choix multiples */}
              <div 
                id="answer-choices"
                className={`grid grid-cols-3 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-8 transition-all duration-500 ${
                  highlightedElement === 'answer-choices' ? 'ring-8 ring-yellow-400 bg-yellow-50 rounded-lg p-4 scale-105 shadow-2xl animate-pulse' : ''
                }`}
              >
                      {shuffledChoices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleAnswerClick(choice)}
                          disabled={isCorrect !== null}
                    className={`p-4 sm:p-6 rounded-lg font-bold text-lg sm:text-xl transition-all min-h-[50px] ${
                            userAnswer === choice
                              ? isCorrect === true
                                ? 'bg-green-500 text-white'
                                : isCorrect === false
                                  ? 'bg-red-500 text-white'
                            : 'bg-green-500 text-white'
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
                <div className={`p-3 sm:p-6 rounded-lg mb-3 sm:mb-6 ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2 sm:mb-4">
                          {isCorrect ? (
                            <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-base sm:text-xl">
                          Excellent ! La réponse est bien {exercises[currentExercise].correctAnswer} !
                        </span>
                            </>
                          ) : (
                            <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-sm sm:text-xl">
                          Pas tout à fait... La bonne réponse est {exercises[currentExercise].correctAnswer} !
                              </span>
                            </>
                          )}
                        </div>
                    
                  {/* Explication pour les mauvaises réponses */}
                  {!isCorrect && (
                    <div className="bg-white rounded-lg p-3 sm:p-6 border border-blue-300 sm:border-2">
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-blue-800 text-center">
                        📚 Explication
                        </h4>
                        
                          <div className="space-y-2 sm:space-y-4">
                        <div className="bg-blue-50 rounded-lg p-2 sm:p-4 text-center">
                          {exercises[currentExercise].type === 'double' ? (
                            <div>
                              <div className="text-lg sm:text-xl font-bold text-blue-600 mb-1 sm:mb-2">
                                Double de {exercises[currentExercise].question.match(/\d+/)?.[0]} = {exercises[currentExercise].correctAnswer}
                              </div>
                              <div className="text-sm sm:text-lg text-gray-700">
                                {exercises[currentExercise].question.match(/\d+/)?.[0]} + {exercises[currentExercise].question.match(/\d+/)?.[0]} = {exercises[currentExercise].correctAnswer}
                            </div>
                              </div>
                          ) : (
                            <div>
                              <div className="text-lg sm:text-xl font-bold text-blue-600 mb-1 sm:mb-2">
                                Moitié de {exercises[currentExercise].question.match(/\d+/)?.[0]} = {exercises[currentExercise].correctAnswer}
                                </div>
                              <div className="text-sm sm:text-lg text-gray-700">
                                {exercises[currentExercise].question.match(/\d+/)?.[0]} ÷ 2 = {exercises[currentExercise].correctAnswer}
                                </div>
                                </div>
                          )}
                              </div>
                              
                        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-2 sm:p-3 text-center">
                          <div className="text-base sm:text-lg">🌟</div>
                          <p className="text-xs sm:text-sm font-semibold text-blue-800">
                            Maintenant tu sais !
                          </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center pb-4 sm:pb-0">
                        <button
                          id="next-exercise-button"
                          onClick={nextExercise}
                    className="bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[50px] sm:min-h-auto"
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
                  if (percentage >= 90) return { title: "🎉 Champion des doubles et moitiés !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
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
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les doubles et moitiés sont très utiles !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
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

        {/* Bouton flottant Sam pour arrêter les vocaux */}
        {isPlayingVocal && (
          <div className="fixed top-4 right-4 z-[60]">
            <button
              onClick={stopAllVocalsAndAnimations}
              className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
              title="Arrêter Sam"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
                <img 
                  src="/image/pirate-small.png" 
                  alt="Sam le Pirate" 
                  className="w-full h-full object-cover"
                />
              </div>
              <>
                <span className="text-sm font-bold hidden sm:block">Stop</span>
                <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
              </>
            </button>
          </div>
        )}

        {/* Injection des styles CSS */}
        <style jsx>{symbolAnimationStyles}</style>
      </div>
    </div>
  );
} 