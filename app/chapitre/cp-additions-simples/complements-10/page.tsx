'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function ComplementsDixCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'counting' | 'adding' | 'completing' | null>(null);
  const [complementStep, setComplementStep] = useState<'first-number' | 'missing' | 'total' | 'result' | null>(null);
  const [countingTo10, setCountingTo10] = useState<number | null>(null);

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
  const [correctionStep, setCorrectionStep] = useState<'complement' | 'counting' | 'result' | 'complete' | null>(null);
  const [highlightNextButton, setHighlightNextButton] = useState(false);

  // État pour la détection mobile
  const [isMobile, setIsMobile] = useState(false);
  const [animatedObjects, setAnimatedObjects] = useState<string[]>([]);

  // État pour stocker les nombres de la correction en cours
  const [correctionNumbers, setCorrectionNumbers] = useState<{
    first: number;
    second: number;
    objectEmoji: string;
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
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire"
  ];

  // Données des compléments à 10 avec animations
  const complementExamples = [
    { 
      first: 3, 
      second: 7, 
      item: '🔴', 
      description: 'compléter 3 pour faire 10',
      explanation: '3 plus 7 égale 10'
    },
    { 
      first: 4, 
      second: 6, 
      item: '🟢', 
      description: 'compléter 4 pour faire 10',
      explanation: '4 plus 6 égale 10'
    },
    { 
      first: 5, 
      second: 5, 
      item: '🔵', 
      description: 'compléter 5 pour faire 10',
      explanation: '5 plus 5 égale 10'
    },
    { 
      first: 7, 
      second: 3, 
      item: '🟡', 
      description: 'compléter 7 pour faire 10',
      explanation: '7 plus 3 égale 10'
    },
    { 
      first: 2, 
      second: 8, 
      item: '🟣', 
      description: 'compléter 2 pour faire 10',
      explanation: '2 plus 8 égale 10'
    }
  ];

  // Tous les compléments à 10
  const allComplements = [
    { first: 1, second: 9 },
    { first: 2, second: 8 },
    { first: 3, second: 7 },
    { first: 4, second: 6 },
    { first: 5, second: 5 },
    { first: 6, second: 4 },
    { first: 7, second: 3 },
    { first: 8, second: 2 },
    { first: 9, second: 1 }
  ];

  // Exercices sur les compléments à 10 - saisie libre
  const exercises = [
    { question: '3 + un nombre à trouver égale 10', firstNumber: 3 },
    { question: '4 + un nombre à trouver égale 10', firstNumber: 4 },
    { question: '7 + un nombre à trouver égale 10', firstNumber: 7 },
    { question: '2 + un nombre à trouver égale 10', firstNumber: 2 },
    { question: '5 + un nombre à trouver égale 10', firstNumber: 5 },
    { question: '8 + un nombre à trouver égale 10', firstNumber: 8 },
    { question: '6 + un nombre à trouver égale 10', firstNumber: 6 },
    { question: '1 + un nombre à trouver égale 10', firstNumber: 1 },
    { question: '9 + un nombre à trouver égale 10', firstNumber: 9 },
    { question: 'Un nombre à trouver + 6 égale 10', secondNumber: 6 }
  ];

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
    setHighlightedNumber(null);
    setShowingProcess(null);
    setComplementStep(null);
    setCountingTo10(null);
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
          reject(new Error(`Erreur synthèse vocale: ${event.error}`));
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

  // Fonction pour rendre les objets avec animations
  const renderCircles = (count: number, item: string, isHighlighted = false) => {
    if (count <= 0) return null;
    
    const circles = [];
    for (let i = 0; i < count; i++) {
      circles.push(
        <span
          key={i}
          className={`text-4xl inline-block transition-all duration-500 ${
            isHighlighted ? 'animate-bounce scale-125' : ''
          } ${
            countingTo10 && i < countingTo10 ? 'text-green-500 scale-110' : ''
          }`}
          style={{ 
            animationDelay: `${i * 100}ms`
          }}
        >
          {item}
        </span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {circles}
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les compléments à 10 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Un complément à 10, c'est ce qu'il faut ajouter à un nombre pour arriver à 10 !");
      if (stopSignalRef.current) return;
      
      // 2. Explication du concept avec animations
      await wait(1800);
      setHighlightedElement('concept-section');
      await playAudio("Regardons ensemble comment compléter 3 pour faire 10 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setCurrentExample(0);
      setAnimatingStep('introduction');
      const example = complementExamples[0];
      
      await playAudio(`D'abord, j'ai ${example.first} objets.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setComplementStep('first-number');
      setHighlightedNumber(example.first);
      await playAudio(`Je vois ${example.first} objets ici.`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setShowingProcess('counting');
      await playAudio("Maintenant, je dois compter jusqu'à 10. Combien dois-je ajouter ?");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setComplementStep('missing');
      await playAudio("Je vais compter de 3 jusqu'à 10 pour trouver le complément !");
      if (stopSignalRef.current) return;
      
      // Animation de comptage de 3 à 10
      await wait(1000);
      for (let i = example.first + 1; i <= 10; i++) {
        if (stopSignalRef.current) return;
        setCountingTo10(i);
        await playAudio(`${i}`);
        await wait(600);
      }
      
      await wait(1000);
      setShowingProcess('adding');
      await playAudio(`Il faut ajouter ${example.second} pour aller de ${example.first} à 10 !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setComplementStep('total');
      setShowingProcess('completing');
      await playAudio(`${example.first} plus ${example.second} égale 10 ! C'est ça, un complément !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setComplementStep('result');
      await playAudio(`En mathématiques, on écrit : ${example.first} + ${example.second} = 10 !`);
      if (stopSignalRef.current) return;
      
      // 3. Présentation des autres exemples
      await wait(2500);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setComplementStep(null);
      setCountingTo10(null);
      setCurrentExample(null);
      setHighlightedElement(null);
      await playAudio("Parfait ! Maintenant tu comprends les compléments à 10 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a d'autres nombres et d'autres compléments à découvrir !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('examples-section');
      scrollToSection('examples-section');
      await playAudio("Regarde ! Tu peux essayer avec d'autres nombres !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Clique sur les exemples pour voir d'autres compléments !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setComplementStep(null);
      setCountingTo10(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour parser les nombres d'un exercice de complément
  const parseComplementNumbers = (exercise: any, userAnswer?: string) => {
    let first, second;
    
    if (exercise.firstNumber) {
      first = exercise.firstNumber;
      second = userAnswer ? parseInt(userAnswer) : (10 - first);
    } else if (exercise.secondNumber) {
      second = exercise.secondNumber;
      first = userAnswer ? parseInt(userAnswer) : (10 - second);
    }
    
    return {
      first: first || 0,
      second: second || 0,
      objectEmoji: '🟡',
      objectName: 'pièces d\'or'
    };
  };

  // Fonction pour vérifier si un complément est correct
  const isValidComplement = (userAnswer: string, exercise: any) => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer) || answer <= 0) return false;
    
    if (exercise.firstNumber) {
      return exercise.firstNumber + answer === 10;
    } else if (exercise.secondNumber) {
      return answer + exercise.secondNumber === 10;
    }
    return false;
  };

  // Fonction pour créer une correction animée avec des objets visuels pour les compléments
  const createAnimatedCorrection = async (exercise: any, userAnswer?: string) => {
    if (stopSignalRef.current) return;
    
    console.log('Début correction animée pour complément:', exercise, 'avec réponse:', userAnswer);
    
    const { first, second, objectEmoji, objectName } = parseComplementNumbers(exercise, userAnswer);
    
    // Stocker les nombres pour l'affichage
    setCorrectionNumbers({ first, second, objectEmoji, objectName });
    
    // Démarrer l'affichage de correction
    setShowAnimatedCorrection(true);
    setCorrectionStep(null); // Commencer sans étape pour montrer le nombre de départ
    
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
      if (exercise.firstNumber && exercise.firstNumber + userNum === 10) {
        await playAudio(`Je vais te montrer que ${exercise.firstNumber} plus ${userAnswer} égale bien 10 !`);
      } else if (exercise.secondNumber && userNum + exercise.secondNumber === 10) {
        await playAudio(`Je vais te montrer que ${userAnswer} plus ${exercise.secondNumber} égale bien 10 !`);
      } else {
        await playAudio(`Tu as répondu ${userAnswer}, mais regardons le bon complément !`);
      }
    } else {
      await playAudio(`Je vais t'expliquer ce complément à 10 avec des ${objectName} !`);
    }
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Étape 2: Affichage du nombre de départ
    await playAudio(`Regarde ! Voici ${first} ${objectName}.`);
    if (stopSignalRef.current) return;
    
    // Montrer les objets du premier nombre
    const firstObjects = Array(first).fill('🟡');
    setAnimatedObjects(firstObjects);
    await wait(1500);
    
    // Étape 3: Comptage jusqu'à 10
    setCorrectionStep('counting');
    await playAudio(`Maintenant, je compte jusqu'à 10 pour trouver le complément !`);
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Animation de comptage objet par objet - seules les pièces ajoutées s'animent
    for (let i = first + 1; i <= 10; i++) {
      if (stopSignalRef.current) return;
      
      // L'index de la pièce ajoutée qui s'anime (commence à 0 pour la première pièce ajoutée)
      setCountingIndex(i - first - 1);
      await playAudio(`${i}`);
      
      // Ajouter un objet à chaque comptage
      const currentObjects = [
        ...Array(first).fill('🟡'),
        ...Array(i - first).fill('🟠')
      ];
      setAnimatedObjects(currentObjects);
      await wait(600);
    }
    
    // Remettre tous les objets en position normale
    setCountingIndex(-1);
    
    // Étape 4: Résultat
    setCorrectionStep('result');
    await playAudio(`Il faut ajouter ${second} pour aller de ${first} à 10 !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    await playAudio(`Donc ${first} + ${second} = 10 ! C'est ça, un complément !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 5: Vérification finale (répéter l'opération)
    await playAudio(`Vérifions ensemble : ${first} plus ${second} égale 10 !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 6: Terminé
    setCorrectionStep('complete');
    
    // Messages différents selon mobile/desktop
    if (isMobile) {
      await playAudio(`Appuie sur suivant pour un autre exercice !`);
    } else {
      await playAudio(`Maintenant tu peux cliquer sur suivant pour continuer !`);
    }
    
    // Illuminer le bouton et scroller (plus prononcé sur mobile)
    setHighlightNextButton(true);
    
    // Sur mobile, attendre un peu plus puis scroller vers le bouton
    if (isMobile) {
      setTimeout(() => {
        // Scroll plus visible sur mobile
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
      
      // Lancer l'animation de correction pour compléments avec la réponse utilisateur si incorrecte
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

  // Fonction pour l'introduction vocale de Sam le Pirate
  const startPirateIntro = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    const isReplay = pirateIntroStarted;
    setPirateIntroStarted(true);
    
    try {
      if (isReplay) {
        // Messages pour rejouer l'intro
        await playAudio("Eh bien, nom d'un sabre ! Tu veux que je répète mes instructions ?");
        if (stopSignalRef.current) return;
        
        await wait(1000);
        if (stopSignalRef.current) return;
        
        await playAudio("Très bien moussaillon ! Rappel des consignes !");
        if (stopSignalRef.current) return;
      } else {
        // Messages pour la première fois
        await playAudio("Bonjour, faisons quelques exercices de compléments à 10 nom d'une jambe en bois !");
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
      await playAudio("Écris le nombre manquant dans la case pour compléter à 10, puis clique sur vérifier");
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
        await playAudio("En avant toutes pour les compléments à 10 !");
      }
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const example = complementExamples[index];
    
    try {
      setCurrentExample(index);
      setAnimatingStep('introduction');
      scrollToSection('concept-section');
      
      await playAudio(`Je vais te montrer comment ${example.description}.`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setComplementStep('first-number');
      setHighlightedNumber(example.first);
      await playAudio(`Voici ${example.first} objets.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('counting');
      await playAudio(`Je compte de ${example.first} jusqu'à 10.`);
      if (stopSignalRef.current) return;

      // Animation de comptage
      await wait(1000);
      for (let i = example.first + 1; i <= 10; i++) {
        if (stopSignalRef.current) return;
        setCountingTo10(i);
        await playAudio(`${i}`);
        await wait(600);
      }
      
      await wait(1000);
      setComplementStep('missing');
      setShowingProcess('adding');
      await playAudio(`Il faut ajouter ${example.second} !`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setComplementStep('result');
      setShowingProcess('completing');
      await playAudio(`${example.first} plus ${example.second} égale 10 !`);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setComplementStep(null);
      setCountingTo10(null);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setComplementStep(null);
      setCountingTo10(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour valider la réponse saisie
  const handleValidateAnswer = async () => {
    if (!userAnswer.trim()) {
      return; // Ne pas valider si le champ est vide
    }

    const correct = isValidComplement(userAnswer, exercises[currentExercise]);
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });

      // Célébrer avec Sam
      await celebrateCorrectAnswer();
      
      // Passage automatique après célébration
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + 1;
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    } else if (!correct) {
      // Expliquer l'erreur avec Sam en utilisant la réponse de l'utilisateur
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
    
    // Réinitialiser les états spécifiques à Sam et la correction
    setPirateIntroStarted(false);
    setShowAnimatedCorrection(false);
    setCorrectionStep(null);
    setHighlightNextButton(false);
    setAnimatedObjects([]);
    setCorrectionNumbers(null);
    setCountingIndex(-1);
  };

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Champion des compléments !", message: "Tu maîtrises parfaitement les compléments à 10 !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les compléments !", emoji: "📚" };
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

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
          className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 border-1 sm:border-2 border-orange-200 shadow-md transition-all duration-300 ${
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
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-1 sm:p-2 rounded-full animate-bounce shadow-lg">
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
              ? 'px-2 sm:px-8 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-lg bg-gradient-to-r from-orange-500 to-yellow-600 text-white hover:from-orange-600 hover:to-yellow-700 hover:scale-105 shadow-lg border-1 sm:border-2 border-orange-300'
              : 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-2 sm:border-4 border-yellow-300'
        } ${!isPlayingVocal && !pirateIntroStarted ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''} ${pirateIntroStarted && !isPlayingVocal ? 'ring-2 ring-orange-300 ring-opacity-75' : ''}`}
        style={{
          animationDuration: !isPlayingVocal && !pirateIntroStarted ? '1.5s' : '2s',
          animationIterationCount: isPlayingVocal ? 'none' : 'infinite',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          boxShadow: !isPlayingVocal && !pirateIntroStarted 
            ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
            : pirateIntroStarted && !isPlayingVocal
              ? '0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(251,146,60,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
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
              /* Particules de replay - oranges */
              <>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-red-300 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
              </>
            )}
          </>
        )}
      </button>
      </div>
    </div>
  );

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-additions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🔟 Compléments à 10
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Découvre toutes les façons de faire 10 !
            </p>
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
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[68px] flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
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
          <div className="space-y-8">
            {/* Bouton d'explication vocal principal */}
            <div className="text-center mb-6">
              <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-xl hover:scale-105'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Explication du concept avec animation intégrée */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Qu'est-ce qu'un complément à 10 ?
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-orange-800 font-semibold mb-6">
                  Un complément à 10, c'est ce qu'il faut ajouter à un nombre pour arriver à 10 !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {currentExample !== null ? 
                        `Exemple : ${complementExamples[currentExample].first} + ${complementExamples[currentExample].second} = 10` 
                        : 'Exemple : 3 + 7 = 10'
                      }
                </div>
              </div>

                  {/* Animation intégrée dans le concept */}
                  {currentExample !== null ? (
                    <div className="space-y-6">
                      {/* Indicateur d'étape */}
                      {animatingStep && (
                        <div className="p-3 rounded-lg bg-blue-100 border-l-4 border-blue-500 text-center">
                          <div className="text-lg font-bold text-blue-800">
                            {animatingStep === 'introduction' && '🎯 Regardons ensemble...'}
                  </div>
                  </div>
                      )}
                      
                      {/* Premier nombre */}
                      {complementStep === 'first-number' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-500 bg-yellow-100 ring-4 ring-yellow-400 scale-105`}>
                          <h4 className="text-2xl font-bold text-yellow-800 mb-4">
                            Nombre de départ : {complementExamples[currentExample].first}
                          </h4>
                          <div className="mb-4">
                            {renderCircles(complementExamples[currentExample].first, complementExamples[currentExample].item, highlightedNumber === complementExamples[currentExample].first)}
                          </div>
                          <div className={`text-xl font-bold transition-all duration-500 ${
                            highlightedNumber === complementExamples[currentExample].first ? 'text-yellow-600 scale-125 animate-pulse' : 'text-yellow-800'
                          }`}>
                            J'ai {complementExamples[currentExample].first} objets
                          </div>
                        </div>
                      )}

                      {/* Animation de comptage jusqu'à 10 */}
                      {showingProcess === 'counting' && (
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                          <h4 className="text-xl font-bold text-center text-blue-800 mb-4">
                            🔢 Comptons jusqu'à 10 !
                          </h4>
                          <div className="flex justify-center items-center space-x-2 text-5xl">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span
                                key={i}
                                className={`transition-all duration-500 ${
                                  countingTo10 && i + 1 <= countingTo10 ? 'scale-150 animate-bounce text-red-500' : 'text-gray-300'
                                }`}
                              >
                                🔴
                              </span>
                            ))}
                  </div>
                          <div className="text-center mt-4">
                            <div className="text-3xl font-bold text-blue-800">
                              {countingTo10 && `${countingTo10}...`}
                </div>
              </div>
            </div>
                      )}

                      {/* Complément trouvé */}
                      {complementStep === 'missing' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                          showingProcess === 'adding' ? 'ring-4 ring-green-400 bg-green-100 scale-105' : 'bg-green-50'
                        }`}>
                          <h4 className="text-2xl font-bold text-green-800 mb-4">
                            Il faut ajouter : {complementExamples[currentExample].second}
                          </h4>
                          <div className="mb-4">
                            {renderCircles(complementExamples[currentExample].second, complementExamples[currentExample].item)}
                          </div>
                          <div className="text-xl font-bold text-green-800">
                            {complementExamples[currentExample].second} objets en plus
                          </div>
                        </div>
                      )}

                      {/* Résultat */}
                      {complementStep === 'result' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-orange-100 ring-4 ring-orange-400 scale-105`}>
                          <h4 className="text-2xl font-bold text-orange-800 mb-4">🎉 Complément trouvé !</h4>
                          <div className="mb-4">
                            {renderCircles(10, '🔴')}
                          </div>
                          <div className="text-3xl font-bold text-orange-800 mb-2">
                            {complementExamples[currentExample].first} + {complementExamples[currentExample].second} = 10
                          </div>
                          <div className="text-lg text-orange-600">
                            {complementExamples[currentExample].explanation} !
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Version statique quand pas d'animation */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">3 objets</div>
                        {renderCircles(3, '🔴')}
                        <div className="text-xl font-bold text-orange-800 mt-2">3</div>
                      </div>
                      <div className="text-center flex items-center justify-center">
                        <div className="text-6xl font-bold text-orange-600">+</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">7 objets</div>
                        {renderCircles(7, '🔴')}
                        <div className="text-xl font-bold text-yellow-800 mt-2">7</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                }`}
              >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🌟 Autres exemples de compléments
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complementExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                          <div className="text-center">
                      <div className="text-3xl mb-2">{example.item}</div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {example.first} + {example.second} = 10
                            </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Complément de {example.first}
                          </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                            </div>
                          </div>
                ))}
                        </div>
                      </div>

            {/* Tous les compléments à 10 */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Tous les compléments à 10
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allComplements.map((complement, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-orange-600">
                      {complement.first} + {complement.second} = 10
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                💡 Conseils pour retenir les compléments
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">🤲</div>
                  <div className="font-bold">Utilise tes doigts</div>
                  <div className="text-sm">Compte jusqu'à 10</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎵</div>
                  <div className="font-bold">Récite comme une chanson</div>
                  <div className="text-sm">1+9, 2+8, 3+7...</div>
              </div>
                <div>
                  <div className="text-3xl mb-2">🧠</div>
                  <div className="font-bold">Mémorise les paires</div>
                  <div className="text-sm">Répète plusieurs fois</div>
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
                  <div className="text-sm font-bold text-orange-600">
                    Score : {score}/{exercises.length}
                  </div>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              </div>
              
            {/* Indicateur de progression mobile - sticky sur la page */}
            <div className="sticky top-2 bg-white z-10 px-2 py-2 border-b border-gray-200 sm:hidden mb-6 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                <span className="font-bold text-orange-600">Score : {score}/{exercises.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2 mt-1">
                <div 
                  className="bg-orange-500 h-1 sm:h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question - AVEC BOUTON ÉCOUTER */}
            <div className="bg-white rounded-xl shadow-lg text-center p-3 sm:p-6 md:p-8 mt-4 sm:mt-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1 sm:mb-6 md:mb-8 gap-2 sm:gap-4">
                <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Question..."}
              </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage du nombre à compléter */}
              <div className="bg-orange-50 rounded-lg p-2 sm:p-6 mb-2 sm:mb-8">
                <div className="text-3xl sm:text-6xl font-bold text-orange-600 mb-2 sm:mb-4">
                  {exercises[currentExercise].firstNumber || exercises[currentExercise].secondNumber || '?'}
                </div>
                <div className="mb-2 sm:mb-4">
                  {exercises[currentExercise].firstNumber && renderCircles(exercises[currentExercise].firstNumber, '🔴')}
                  {exercises[currentExercise].secondNumber && renderCircles(exercises[currentExercise].secondNumber, '🔴')}
                </div>
                <p className="text-sm sm:text-lg text-gray-700 font-semibold">
                  Trouve le complément pour faire 10 !
                </p>
              </div>
              
              {/* Zone de réponse - Saisie libre pour complément */}
              <div 
                id="answer-zone" 
                className={`${highlightedElement === 'answer-zone' ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse rounded-xl p-4 bg-yellow-50' : ''} transition-all duration-300 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-8`}
              >
                <div className="text-center mb-4">
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Complète l'équation :
                  </p>
                  
                  {/* Équation de complément avec champ de saisie */}
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6">
                    {exercises[currentExercise].firstNumber && (
                      <>
                        <div className="w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-orange-100 border-2 border-orange-300 rounded-lg text-orange-600">
                          {exercises[currentExercise].firstNumber}
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold text-orange-600">+</span>
                        <input
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          disabled={isCorrect !== null || isPlayingVocal}
                          min="1"
                          max="9"
                          className="w-12 sm:w-16 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="?"
                        />
                        <span className="text-2xl sm:text-3xl font-bold text-orange-600">=</span>
                        <div className="w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-orange-100 border-2 border-orange-300 rounded-lg text-orange-600">
                          10
                        </div>
                      </>
                    )}
                    
                    {exercises[currentExercise].secondNumber && (
                      <>
                        <input
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          disabled={isCorrect !== null || isPlayingVocal}
                          min="1"
                          max="9"
                          className="w-12 sm:w-16 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="?"
                        />
                        <span className="text-2xl sm:text-3xl font-bold text-orange-600">+</span>
                        <div className="w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-orange-100 border-2 border-orange-300 rounded-lg text-orange-600">
                          {exercises[currentExercise].secondNumber}
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold text-orange-600">=</span>
                        <div className="w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-orange-100 border-2 border-orange-300 rounded-lg text-orange-600">
                          10
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Bouton pour valider */}
                  <button
                    onClick={handleValidateAnswer}
                    disabled={isCorrect !== null || isPlayingVocal || !userAnswer.trim()}
                    className="bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[48px] shadow-lg"
                  >
                    ✅ Vérifier mon complément
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
                          Excellent ! {exercises[currentExercise].firstNumber ? `${exercises[currentExercise].firstNumber} + ${userAnswer}` : `${userAnswer} + ${exercises[currentExercise].secondNumber}`} = 10 !
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-base sm:text-xl md:text-2xl">❌</span>
                        <span className="font-bold text-xs sm:text-sm md:text-xl">
                          Pas tout à fait... Je vais t'expliquer !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Correction animée avec objets visuels */}
              {showAnimatedCorrection && correctionNumbers && (
                <div 
                  id="animated-correction"
                  className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-6 md:p-8 mb-4 border-2 border-orange-200 shadow-lg"
                >
                  {/* Titre de section adaptatif */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-xs sm:text-base text-orange-600">
                      {!correctionStep && "Voici le nombre de départ..."}
                      {correctionStep === 'counting' && "Comptons jusqu'à 10 !"}
                      {correctionStep === 'result' && "Voici le résultat !"}
                    </div>
                  </div>

                  {/* Affichage des objets animés */}
                  {animatedObjects.length > 0 && (
                    <div className="flex justify-center mb-3 sm:mb-6">
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1 sm:gap-2 max-w-xs sm:max-w-md">
                        {animatedObjects.map((obj, index) => {
                          // Déterminer la couleur et l'état de l'objet selon l'étape
                          let objectDisplay = obj; // Par défaut l'objet tel que défini
                          let className = 'text-lg sm:text-3xl md:text-4xl transition-all duration-500 transform hover:scale-110';
                          
                          // Animation pour le comptage - seules les pièces ajoutées s'animent
                          if (correctionStep === 'counting' && correctionNumbers) {
                            const isAddedPiece = index >= correctionNumbers.first; // Pièce ajoutée (complément)
                            const addedPieceIndex = index - correctionNumbers.first; // Index relatif dans les pièces ajoutées
                            
                            if (isAddedPiece && countingIndex === addedPieceIndex) {
                              // Cette pièce ajoutée est en cours de comptage
                              className += ' animate-pulse scale-150 rotate-12 text-orange-400 drop-shadow-lg';
                            } else if (correctionStep === 'counting' && !isAddedPiece) {
                              // Les pièces de départ restent normales
                              className += ' opacity-80';
                            } else if (correctionStep === 'counting') {
                              // Les autres pièces ajoutées (pas encore comptées)
                              className += ' opacity-60';
                            }
                          }
                          
                          return (
                            <div
                              key={index}
                              className={className}
                              style={{
                                animationDuration: correctionStep === 'counting' && countingIndex === index ? '0.5s' : '1s',
                                transformOrigin: 'center'
                              }}
                            >
                              {objectDisplay}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Équation mathématique */}
                  {correctionStep && (correctionStep === 'counting' || correctionStep === 'result' || correctionStep === 'complete') && correctionNumbers && animatedObjects.length > 0 && (
                    <div className="text-center bg-white rounded-lg p-2 sm:p-4 mb-3 sm:mb-4">
                      <div className="text-lg sm:text-3xl md:text-4xl font-bold text-orange-800">
                        {correctionNumbers.first} + {correctionNumbers.second} = {correctionStep === 'result' || correctionStep === 'complete' ? (
                          <span className="text-green-600 bg-yellow-200 px-2 py-1 rounded-lg animate-pulse border-2 border-green-400 shadow-lg">
                            10
                          </span>
                        ) : '?'}
                      </div>
                    </div>
                  )}

                  {/* Message final */}
                  {correctionStep === 'complete' && (
                    <div className="text-center bg-green-100 rounded-lg p-2 sm:p-4">
                      <div className="text-base sm:text-xl font-bold text-green-800 mb-1 sm:mb-2">
                        🎉 Maintenant tu comprends !
                      </div>
                      <div className="text-xs sm:text-base text-green-700 mb-2">
                        Les compléments à 10, c'est ce qu'il faut ajouter pour arriver à 10 !
                      </div>
                      {/* Message spécifique mobile */}
                      {isMobile && (
                        <div className="text-xs sm:text-sm text-orange-600 font-semibold animate-pulse">
                          👆 Appuie sur le bouton "Suivant" ci-dessous
                        </div>
                      )}
                    </div>
                  )}
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
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les compléments à 10 sont la base du calcul mental !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
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