'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function DecompositionsCP() {
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

  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer1, setUserAnswer1] = useState('');
  const [userAnswer2, setUserAnswer2] = useState('');
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

  // Données des décompositions avec animations
  const decompositionExamples = [
    { 
      number: 5, 
      parts: [2, 3], 
      item: '🔴', 
      description: 'le nombre 5',
      explanation: 'Nous pouvons séparer 5 objets en 2 groupes : un groupe de 2 et un groupe de 3'
    },
    { 
      number: 6, 
      parts: [2, 4], 
      item: '🟢', 
      description: 'le nombre 6',
      explanation: 'Nous pouvons séparer 6 objets en 2 groupes : un groupe de 2 et un groupe de 4'
    },
    { 
      number: 7, 
      parts: [3, 4], 
      item: '🔵', 
      description: 'le nombre 7',
      explanation: 'Nous pouvons séparer 7 objets en 2 groupes : un groupe de 3 et un groupe de 4'
    },
    { 
      number: 8, 
      parts: [3, 5], 
      item: '🟡', 
      description: 'le nombre 8',
      explanation: 'Nous pouvons séparer 8 objets en 2 groupes : un groupe de 3 et un groupe de 5'
    },
    { 
      number: 10, 
      parts: [3, 7], 
      item: '🟣', 
      description: 'le nombre 10',
      explanation: 'Nous pouvons séparer 10 objets en 2 groupes : un groupe de 3 et un groupe de 7'
    }
  ];

  // Toutes les décompositions possibles pour chaque nombre
  const allDecompositions = {
    3: [[1, 2], [2, 1]],
    4: [[1, 3], [2, 2], [3, 1]],
    5: [[1, 4], [2, 3], [3, 2], [4, 1]],
    6: [[1, 5], [2, 4], [3, 3], [4, 2], [5, 1]],
    7: [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]],
    8: [[1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1]],
    9: [[1, 8], [2, 7], [3, 6], [4, 5], [5, 4], [6, 3], [7, 2], [8, 1]],
    10: [[1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [8, 2], [9, 1]]
  };

  // Exercices de décomposition - saisie libre
  const exercises = [
    { question: 'Décompose 5 en 2 parties', number: 5 },
    { question: 'Décompose 6 en 2 parties', number: 6 },
    { question: 'Décompose 4 en 2 parties', number: 4 },
    { question: 'Décompose 8 en 2 parties', number: 8 },
    { question: 'Décompose 10 en 2 parties', number: 10 },
    { question: 'Décompose 7 en 2 parties', number: 7 },
    { question: 'Décompose 9 en 2 parties', number: 9 },
    { question: 'Décompose 3 en 2 parties', number: 3 },
    { question: 'Décompose 6 en 2 parties', number: 6 },
    { question: 'Décompose 8 en 2 parties', number: 8 }
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
  const parseExerciseNumbers = (exercise: any, answer1?: string, answer2?: string) => {
    let num1 = 0, num2 = 0, result = exercise.number;
    let objectEmoji = '🟡';
    let objectName = 'pièces d\'or';
    
    // Si on a des réponses utilisateur, on les utilise
    if (answer1 && answer2) {
      num1 = parseInt(answer1) || 0;
      num2 = parseInt(answer2) || 0;
    } else {
      // Sinon, on varie les décompositions pour montrer différentes possibilités
      const decompositions = allDecompositions[result as keyof typeof allDecompositions];
      if (decompositions && decompositions.length > 0) {
        // Utiliser l'index de l'exercice pour varier les exemples
        const decompositionIndex = currentExercise % decompositions.length;
        [num1, num2] = decompositions[decompositionIndex];
      }
    }
    
    console.log('Nombres parsés pour décomposition:', { num1, num2, result, objectEmoji, objectName });
    return { num1, num2, result, objectEmoji, objectName };
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

  // Fonction pour rendre les objets avec animations
  const renderCircles = (count: number, item: string, isHighlighted = false) => {
    if (count <= 0) return null;
    
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
      
      await playAudio("Regardons ensemble comment décomposer le nombre 5 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setCurrentExample(0);
      setAnimatingStep('introduction');
      const example = decompositionExamples[0];
      
      await playAudio(`D'abord, voici ${example.description} représenté par ${example.number} objets.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setDecompositionStep('number');
      setHighlightedNumber(example.number);
      await playAudio(`Je vois ${example.number} objets en tout.`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setShowingProcess('separating');
      
      // Scroll vers la zone de concept pour bien voir la séparation
      scrollToSection('concept-section');
      await wait(800);
      
      await playAudio("Maintenant, je vais séparer ces objets en deux groupes !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setDecompositionStep('parts');
      await playAudio(`Je peux faire un groupe de ${example.parts[0]} et un groupe de ${example.parts[1]}.`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setShowingProcess('grouping');
      await playAudio("C'est ça, décomposer ! Séparer en groupes qui s'additionnent !");
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
      
      await playAudio(`${example.parts[0]} plus ${example.parts[1]} égale ${example.number} ! C'est une décomposition !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`En mathématiques, on écrit : ${example.number} = ${example.parts[0]} + ${example.parts[1]} !`);
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
      await playAudio("Il y a d'autres nombres et d'autres décompositions à découvrir !");
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
        await playAudio("Tu peux ensuite faire les exercices pour t'entraîner. Amuse-toi bien, nom d'un pirate !");
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

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const example = decompositionExamples[index];
    
    try {
      setCurrentExample(index);
      setAnimatingStep('introduction');
      scrollToSection('concept-section');
      
      await playAudio(`Je vais te montrer comment décomposer ${example.description}.`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setDecompositionStep('number');
      setHighlightedNumber(example.number);
      await playAudio(`Voici ${example.number} objets.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('separating');
      await playAudio("Je vais les séparer en deux groupes.");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setDecompositionStep('parts');
      await playAudio(`Un groupe de ${example.parts[0]} et un groupe de ${example.parts[1]}.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('result');
      
      // Scroll vers la zone de résultat pour bien voir la décomposition finale
      const resultSection = document.querySelector('[class*="bg-green"]') || 
                            document.getElementById('concept-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(800);
      }
      
      setDecompositionStep('result');
      await playAudio(`${example.parts[0]} plus ${example.parts[1]} égale ${example.number} !`);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setDecompositionStep(null);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setDecompositionStep(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour créer une correction animée avec des objets visuels pour les décompositions
  const createAnimatedCorrection = async (exercise: any, answer1?: string, answer2?: string) => {
    if (stopSignalRef.current) return;
    
    console.log('Début correction animée pour décomposition:', exercise, 'avec réponses:', answer1, answer2);
    
    const { num1, num2, result, objectEmoji, objectName } = parseExerciseNumbers(exercise, answer1, answer2);
    
    // Stocker les nombres pour l'affichage
    setCorrectionNumbers({ num1, num2, result, objectEmoji, objectName });
    
    // Démarrer l'affichage de correction
    setShowAnimatedCorrection(true);
    setCorrectionStep(null); // Commencer sans étape pour montrer tous les objets
    
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
    const hasUserAnswer = answer1 && answer2;
    if (hasUserAnswer) {
      const userSum = parseInt(answer1) + parseInt(answer2);
      if (userSum === result) {
        await playAudio(`Je vais te montrer que ${answer1} plus ${answer2} égale bien ${result} !`);
      } else {
        await playAudio(`Tu as dit ${answer1} plus ${answer2} égale ${userSum}, mais ${result} se décompose autrement. Regarde !`);
      }
    } else {
      await playAudio(`Je vais t'expliquer cette décomposition avec des ${objectName} !`);
    }
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Étape 2: Affichage de tous les objets ensemble
    await playAudio(`Regarde ! Voici ${result} ${objectName} en tout.`);
    if (stopSignalRef.current) return;
    
    // Montrer TOUS les objets d'abord (même couleur)
    const allObjects = Array(result).fill('🟡');
    setAnimatedObjects(allObjects);
    await wait(1500);
    
    // Étape 3: Séparation en premier groupe
    setCorrectionStep('group1');
    await playAudio(`Maintenant, je vais faire un premier groupe de ${num1} ${objectName}.`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 4: Séparation en deuxième groupe
    setCorrectionStep('group2');
    await playAudio(`Et un deuxième groupe de ${num2} ${objectName}.`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 5: Explication de la décomposition
    await playAudio(`Parfait ! ${num1} plus ${num2}, c'est bien une façon de décomposer ${result} !`);
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Étape 6: Comptage interactif
    setCorrectionStep('counting');
    await playAudio(`Maintenant, comptons ensemble toutes les ${objectName} pour vérifier !`);
    if (stopSignalRef.current) return;
    await wait(500);
    
    // Animation de comptage nombre par nombre avec objets qui bougent
    for (let i = 1; i <= result; i++) {
      if (stopSignalRef.current) return;
      
      // Mettre en évidence l'objet en cours de comptage
      setCountingIndex(i - 1);
      
      // Dire le nombre
      await playAudio(`${i}`);
      await wait(600);
    }
    
    // Remettre tous les objets en position normale
    setCountingIndex(-1);
    
    // Étape 7: Résultat final
    setCorrectionStep('result');
    await playAudio(`Excellent ! Nous avons bien ${result} ${objectName} en tout !`);
    if (stopSignalRef.current) return;
    await wait(1000);
    
    await playAudio(`Donc ${result} = ${num1} + ${num2} est une bonne décomposition !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 8: Vérification finale (répéter l'opération)
    await playAudio(`Vérifions ensemble : ${num1} plus ${num2} égale ${result} !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 9: Terminé
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
      
      // Lancer l'animation de correction pour décompositions avec les réponses utilisateur si incorrectes
      if (isCorrect === false && userAnswer1 && userAnswer2) {
        await createAnimatedCorrection(exercise, userAnswer1, userAnswer2);
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
    if (!userAnswer1.trim() || !userAnswer2.trim()) {
      return; // Ne pas valider si les champs sont vides
    }

    const num1 = parseInt(userAnswer1);
    const num2 = parseInt(userAnswer2);
    const target = exercises[currentExercise].number;
    
    // Vérifier si les nombres sont valides
    if (isNaN(num1) || isNaN(num2)) {
      return; // Ne pas valider si ce ne sont pas des nombres
    }

    const correct = isValidDecomposition(num1, num2, target);
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
        await playAudio("Eh bien, nom d'un sabre ! Tu veux que je répète mes instructions ?");
        if (stopSignalRef.current) return;
        
        await wait(1000);
        if (stopSignalRef.current) return;
        
        await playAudio("Très bien moussaillon ! Rappel des consignes !");
        if (stopSignalRef.current) return;
      } else {
        // Messages pour la première fois
        await playAudio("Bonjour, faisons quelques exercices de décomposition nom d'une jambe en bois !");
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
        await playAudio("En avant toutes pour les décompositions !");
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
            href="/chapitre/cp-additions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🧩 Décomposer les nombres jusqu'à 10
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
                    src="/image/pirate-small.png" 
                    alt="Sam le Pirate" 
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
                        `Exemple : ${decompositionExamples[currentExample].number} = ${decompositionExamples[currentExample].parts[0]} + ${decompositionExamples[currentExample].parts[1]}` 
                        : 'Exemple : 5 = 2 + 3'
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
                              Premier groupe
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
                              Deuxième groupe
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
                      
                      {/* Résultat */}
                      {decompositionStep === 'result' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-green-100 ring-4 ring-green-400 scale-105`}>
                          <h4 className="text-lg sm:text-2xl font-bold text-green-800 mb-2 sm:mb-4">🎉 Décomposition réussie !</h4>
                          <div className="mb-4">
                            {renderCircles(decompositionExamples[currentExample].number, decompositionExamples[currentExample].item)}
                        </div>
                          <div className="text-xl sm:text-3xl font-bold text-green-800 mb-2">
                            {decompositionExamples[currentExample].number} = {decompositionExamples[currentExample].parts[0]} + {decompositionExamples[currentExample].parts[1]}
                      </div>
                          <div className="text-sm sm:text-lg text-green-600">
                            {decompositionExamples[currentExample].parts[0]} + {decompositionExamples[currentExample].parts[1]} = {decompositionExamples[currentExample].number} !
                    </div>
                    </div>
                      )}
                  </div>
                  ) : (
                    /* Version statique quand pas d'animation */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                      <div className="text-center p-1 sm:p-4 bg-purple-50 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-2">2 objets</div>
                        {renderCircles(2, '🔴')}
                        <div className="text-base sm:text-xl font-bold text-purple-800 mt-0.5 sm:mt-2">2</div>
                      </div>
                      <div className="text-center flex items-center justify-center">
                        <div className="text-2xl sm:text-6xl font-bold text-purple-600">+</div>
                      </div>
                      <div className="text-center p-1 sm:p-4 bg-pink-50 rounded-lg">
                        <div className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-2">3 objets</div>
                        {renderCircles(3, '🔴')}
                        <div className="text-base sm:text-xl font-bold text-pink-800 mt-0.5 sm:mt-2">3</div>
                      </div>
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
                        {example.number} = {example.parts[0]} + {example.parts[1]}
                  </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Décomposition de {example.number}
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

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl p-3 sm:p-6 text-white">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-xl font-bold text-white">
                  💡 Conseils pour bien décomposer
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
                        await playAudio("Voici mes meilleurs conseils pour bien décomposer les nombres !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("D'abord, tu peux utiliser tes doigts ! Sépare-les en groupes différents !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1200));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("Tu peux aussi prendre des objets et les grouper différemment !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1200));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("Et tu peux dessiner des groupes pour visualiser les séparations !");
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🤲</div>
                  <div className="font-bold">Utilise tes doigts</div>
                  <div className="text-sm">Sépare-les en groupes</div>
            </div>
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">🧸</div>
                  <div className="font-bold">Prends des objets</div>
                  <div className="text-sm">Groupe-les différemment</div>
          </div>
                <div>
                  <div className="text-2xl sm:text-3xl mb-2">✏️</div>
                  <div className="font-bold">Dessine des groupes</div>
                  <div className="text-sm">Visualise les séparations</div>
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
                <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Question..."}
              </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage du nombre à décomposer */}
              <div className="bg-purple-50 rounded-lg p-2 sm:p-6 mb-2 sm:mb-8">
                <div className="text-2xl sm:text-6xl font-bold text-purple-600 mb-2 sm:mb-4">
                  {exercises[currentExercise].number}
                </div>
                <div className="mb-2 sm:mb-4">
                  {renderCircles(exercises[currentExercise].number, '🔴')}
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
                  
                  {/* Équation de décomposition avec champs de saisie */}
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6">
                    <input
                      type="number"
                      value={userAnswer1}
                      onChange={(e) => setUserAnswer1(e.target.value)}
                      disabled={isCorrect !== null || isPlayingVocal}
                      min="1"
                      max={exercises[currentExercise].number - 1}
                      className="w-12 sm:w-16 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="?"
                    />
                    
                    <span className="text-xl sm:text-3xl font-bold text-purple-600">+</span>
                    
                    <input
                      type="number"
                      value={userAnswer2}
                      onChange={(e) => setUserAnswer2(e.target.value)}
                      disabled={isCorrect !== null || isPlayingVocal}
                      min="1"
                      max={exercises[currentExercise].number - 1}
                      className="w-12 sm:w-16 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="?"
                    />
                    
                    <span className="text-xl sm:text-3xl font-bold text-purple-600">=</span>
                    
                    <div className="w-12 sm:w-16 h-10 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold bg-purple-100 border-2 border-purple-300 rounded-lg text-purple-600">
                      {exercises[currentExercise].number}
                    </div>
                  </div>
                  
                  {/* Bouton pour valider */}
                  <button
                    onClick={handleValidateAnswer}
                    disabled={isCorrect !== null || isPlayingVocal || !userAnswer1.trim() || !userAnswer2.trim()}
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
                          Excellent ! {userAnswer1} + {userAnswer2} est bien une décomposition de {exercises[currentExercise].number} !
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-base sm:text-xl md:text-2xl">❌</span>
                        <span className="font-bold text-xs sm:text-sm md:text-xl">
                          {userAnswer1 && userAnswer2 && (parseInt(userAnswer1) + parseInt(userAnswer2)) !== exercises[currentExercise].number 
                            ? `${userAnswer1} + ${userAnswer2} = ${parseInt(userAnswer1) + parseInt(userAnswer2)}, mais nous voulons ${exercises[currentExercise].number}. Je vais t'expliquer !`
                            : 'Pas tout à fait... Je vais t\'expliquer !'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Animation de correction pour les mauvaises réponses */}
              {showAnimatedCorrection && (
                <div 
                  id="animated-correction"
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 sm:p-6 md:p-8 mb-4 border-2 border-purple-200 shadow-lg"
                >
                  {/* Titre de section adaptatif */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-xs sm:text-base text-purple-600">
                      {!correctionStep && "Voici tous les objets..."}
                      {correctionStep === 'group1' && "Premier groupe..."}
                      {correctionStep === 'group2' && "Deuxième groupe..."}
                      {correctionStep === 'counting' && "Comptons ensemble !"}
                      {correctionStep === 'result' && "Voici le résultat !"}
                    </div>
                  </div>

                  {/* Affichage des objets animés */}
                  {animatedObjects.length > 0 && (
                    <div className="flex justify-center mb-3 sm:mb-6">
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1 sm:gap-2 max-w-xs sm:max-w-md">
                        {animatedObjects.map((obj, index) => {
                          // Déterminer la couleur et l'état de l'objet selon l'étape
                          let objectDisplay = '🟡'; // Par défaut jaune
                          let className = 'text-lg sm:text-3xl md:text-4xl transition-all duration-500 transform hover:scale-110';
                          
                          // Animation pour le comptage
                          if (correctionStep === 'counting' && countingIndex === index) {
                            className += ' animate-pulse scale-150 rotate-12 text-yellow-400 drop-shadow-lg';
                          } else if (correctionStep === 'counting') {
                            className += ' opacity-60';
                          }
                          
                          // Couleurs selon les groupes
                          if (correctionNumbers) {
                            if (correctionStep === 'group1') {
                              if (index < correctionNumbers.num1) {
                                objectDisplay = '🔴'; // Rouge pour premier groupe
                                className += ' animate-bounce scale-110';
                              } else {
                                objectDisplay = '🟡'; // Garder jaune pour les autres
                              }
                            } else if (correctionStep === 'group2') {
                              if (index < correctionNumbers.num1) {
                                objectDisplay = '🔴'; // Rouge pour premier groupe (déjà défini)
                              } else {
                                objectDisplay = '🔵'; // Bleu pour deuxième groupe
                                className += ' animate-bounce scale-110';
                              }
                            } else if ((correctionStep === 'counting' || correctionStep === 'result' || correctionStep === 'complete') && correctionNumbers) {
                              // Garder les couleurs des groupes pendant le comptage et après
                              objectDisplay = index < correctionNumbers.num1 ? '🔴' : '🔵';
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
                  {correctionStep && (correctionStep === 'group2' || correctionStep === 'counting' || correctionStep === 'result' || correctionStep === 'complete') && correctionNumbers && animatedObjects.length > 0 && (
                    <div className="text-center bg-white rounded-lg p-2 sm:p-4 mb-3 sm:mb-4">
                      <div className="text-lg sm:text-3xl md:text-4xl font-bold text-purple-800">
                        {correctionNumbers.num1} + {correctionNumbers.num2} = {correctionStep === 'result' || correctionStep === 'complete' ? (
                          <span className="text-green-600 bg-yellow-200 px-2 py-1 rounded-lg animate-pulse border-2 border-green-400 shadow-lg">
                            {correctionNumbers.result}
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
                        Les décompositions, c'est séparer un nombre en parties !
                      </div>
                      {/* Message spécifique mobile */}
                      {isMobile && (
                        <div className="text-xs sm:text-sm text-purple-600 font-semibold animate-pulse">
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
                    className={`bg-purple-500 text-white px-3 sm:px-6 md:px-8 py-2 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[40px] sm:min-h-[56px] md:min-h-auto ${
                      highlightNextButton 
                        ? `ring-4 ring-yellow-400 ring-opacity-75 animate-pulse scale-110 bg-purple-600 shadow-2xl ${isMobile ? 'scale-125 py-3 text-base' : ''}` 
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