'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function SensAdditionCP() {
  // États pour l'audio et animations
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'gathering' | 'counting' | null>(null);
  const [animatingObjects, setAnimatingObjects] = useState(false);
  const [objectsStep, setObjectsStep] = useState<'group1' | 'group2' | 'result' | null>(null);
  
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
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isPlayingEnonce, setIsPlayingEnonce] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // États pour l'animation de correction
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

  // Données des exemples d'addition
  const additionExamples = [
    { item: '🍎', group1: 2, group2: 3, result: 5, description: 'pommes' },
    { item: '🚗', group1: 1, group2: 2, result: 3, description: 'voitures' },
    { item: '⭐', group1: 3, group2: 2, result: 5, description: 'étoiles' },
    { item: '🎾', group1: 2, group2: 1, result: 3, description: 'balles' },
    { item: '🧸', group1: 4, group2: 1, result: 5, description: 'nounours' }
  ];

  // Exercices sur le sens de l'addition
  const exercises = [
    { 
      question: 'Que veut dire "additionner" ?', 
      correctAnswer: 'Mettre ensemble',
      choices: ['Mettre ensemble', 'Enlever', 'Couper en deux']
    },
    { 
      question: 'Calcule : 3 + 2', 
      correctAnswer: '5',
      type: 'input'
    },
    { 
      question: 'Combien de voitures en tout ?', 
      correctAnswer: '4',
      choices: ['3', '4', '5'],
      visual: '🚗🚗 + 🚗🚗 = ?'
    },
    { 
      question: 'Combien font 6 + 3 ?', 
      correctAnswer: '9',
      type: 'input'
    },
    { 
      question: 'Si tu as 3 bonbons et qu\'on te donne 2 bonbons, combien en as-tu ?', 
      correctAnswer: '5',
      choices: ['3', '5', '2'],
      visual: '🍬🍬🍬 + 🍬🍬 = ?'
    },
    { 
      question: 'Calcule : 4 + 5', 
      correctAnswer: '9',
      type: 'input'
    },
    { 
      question: 'Combien font 2 + 7 ?', 
      correctAnswer: '9',
      type: 'input'
    },
    { 
      question: 'Combien d\'étoiles en tout ?', 
      correctAnswer: '6',
      choices: ['5', '6', '7'],
      visual: '⭐⭐⭐⭐ + ⭐⭐ = ?'
    },
    { 
      question: 'Quelle addition correspond à cette situation : "1 chat puis 3 chats arrivent" ?', 
      correctAnswer: '1 + 3',
      choices: ['1 + 3', '3 - 1', '3 + 3']
    },
    { 
      question: 'L\'addition nous aide à trouver...', 
      correctAnswer: 'Combien on a en tout',
      choices: ['Combien on enlève', 'Combien on a en tout', 'Combien on partage']
    },
    { 
      question: 'Combien font 5 + 4 ?', 
      correctAnswer: '9',
      type: 'input'
    },
    { 
      question: 'Combien de fleurs en tout ?', 
      correctAnswer: '11',
      choices: ['10', '11', '12'],
      visual: '🌸🌸🌸🌸🌸🌸 + 🌸🌸🌸🌸🌸 = ?'
    },
    { 
      question: 'Calcule : 7 + 8', 
      correctAnswer: '15',
      type: 'input'
    },
    { 
      question: 'Combien font 12 + 4 ?', 
      correctAnswer: '16',
      type: 'input'
    },
    { 
      question: 'Calcule cette addition difficile : 9 + 6', 
      correctAnswer: '15',
      type: 'input'
    }
  ];

  // Fonctions utilitaires pour l'audio et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    setIsPlayingVocal(false);
    setIsPlayingEnonce(false);
    setHighlightedElement(null);
    setSamSizeExpanded(false);
    setIsAnimationRunning(false);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedNumber(null);
    setShowingProcess(null);
    setAnimatingObjects(false);
    setObjectsStep(null);
    
    // Nouveaux états pour la correction animée
    setShowAnimatedCorrection(false);
    setCorrectionStep(null);
    setHighlightNextButton(false);
    setAnimatedObjects([]);
    setCorrectionNumbers(null);
    setCountingIndex(-1);
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

  // Fonction pour parser les nombres d'un exercice
  const parseExerciseNumbers = (exercise: any) => {
    let num1 = 0, num2 = 0, result = 0;
    let objectEmoji = '🟢';
    let objectName = 'objets';
    
    // 1. Si la réponse correcte est déjà une addition (ex: "1 + 3")
    if (exercise.correctAnswer && exercise.correctAnswer.includes('+')) {
      console.log('Parsing correctAnswer addition:', exercise.correctAnswer);
      const match = exercise.correctAnswer.match(/(\d+)\s*\+\s*(\d+)/);
      if (match) {
        num1 = parseInt(match[1]);
        num2 = parseInt(match[2]);
        result = num1 + num2;
        objectEmoji = '🐱'; // Chat pour l'exercice des chats
        objectName = 'chats';
      }
    }
    // 2. Si on a un visuel avec des emojis (ex: "🚗🚗 + 🚗🚗 = ?")
    else if (exercise.visual && exercise.visual.includes('+')) {
      console.log('Parsing visual:', exercise.visual);
      
      // Extraire l'emoji utilisé
      const emojiMatch = exercise.visual.match(/([^\s\+\=\?]+)/);
      if (emojiMatch) {
        objectEmoji = emojiMatch[1].charAt(0); // Premier caractère de l'emoji
      }
      
      // Séparer par '+'
      const parts = exercise.visual.split('+');
      if (parts.length === 2) {
        // Compter les emojis avant le '+'
        const firstPart = parts[0].trim();
        const emojiRegex = new RegExp(objectEmoji, 'g');
        const firstMatches = firstPart.match(emojiRegex);
        num1 = firstMatches ? firstMatches.length : 0;
        
        // Compter les emojis après le '+' et avant '='
        const secondPart = parts[1].split('=')[0].trim();
        const secondMatches = secondPart.match(emojiRegex);
        num2 = secondMatches ? secondMatches.length : 0;
        
        result = parseInt(exercise.correctAnswer);
      }
      
      // Déterminer le nom de l'objet
      if (objectEmoji === '🚗') objectName = 'voitures';
      else if (objectEmoji === '🍬') objectName = 'bonbons';
      else if (objectEmoji === '⭐') objectName = 'étoiles';
      else if (objectEmoji === '🌸') objectName = 'fleurs';
      else objectName = 'objets';
    }
    // 3. Si la question contient directement l'addition (ex: "Calcule : 3 + 2")
    else if (exercise.question.includes('+')) {
      const match = exercise.question.match(/(\d+)\s*\+\s*(\d+)/);
      if (match) {
        num1 = parseInt(match[1]);
        num2 = parseInt(match[2]);
        result = parseInt(exercise.correctAnswer);
        objectEmoji = '🔴'; // Objets génériques rouges
        objectName = 'objets';
      }
    }
    // 4. Questions conceptuelles sans calcul direct
    else {
      // Utiliser des valeurs qui donnent le bon résultat
      result = parseInt(exercise.correctAnswer);
      num1 = Math.floor(result / 2);
      num2 = result - num1;
      objectEmoji = '🔵';
      objectName = 'objets';
    }
    
    console.log('Nombres parsés:', { num1, num2, result, objectEmoji, objectName });
    return { num1, num2, result, objectEmoji, objectName };
  };

  // Fonction pour déterminer si c'est une question conceptuelle ou un calcul
  const isConceptualQuestion = (exercise: any) => {
    // Questions conceptuelles qui ne nécessitent pas d'animation de calcul
    const conceptualKeywords = [
      'veut dire',
      'signifie',
      'aide à trouver',
      'correspond à cette situation',
      'définition',
      'qu\'est-ce que'
    ];
    
    const questionLower = exercise.question.toLowerCase();
    return conceptualKeywords.some(keyword => questionLower.includes(keyword));
  };

  // Fonction pour créer une correction simple pour les questions conceptuelles
  const createSimpleCorrection = async (exercise: any) => {
    if (stopSignalRef.current) return;
    
    console.log('Correction simple pour question conceptuelle:', exercise);
    
    // Démarrer l'affichage de correction
    setShowAnimatedCorrection(true);
    setCorrectionStep('result');
    
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
    
    // Explication simple selon le type de question
    if (exercise.question.toLowerCase().includes('veut dire')) {
      await playAudio(`La bonne réponse est : ${exercise.correctAnswer}.`);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio(`Additionner, cela veut dire mettre des objets ensemble pour les compter tous !`);
      if (stopSignalRef.current) return;
    } else if (exercise.question.toLowerCase().includes('aide à trouver')) {
      await playAudio(`Exactement ! L'addition nous aide à trouver ${exercise.correctAnswer.toLowerCase()}.`);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio(`Quand on additionne, on veut savoir combien on a en tout !`);
      if (stopSignalRef.current) return;
    } else if (exercise.question.toLowerCase().includes('correspond à cette situation')) {
      await playAudio(`C'est ça ! La bonne réponse est ${exercise.correctAnswer}.`);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio(`Quand 1 chat arrive et que 3 chats de plus arrivent, on fait 1 plus 3 !`);
      if (stopSignalRef.current) return;
    } else {
      // Explication générale
      await playAudio(`La bonne réponse est : ${exercise.correctAnswer}.`);
      if (stopSignalRef.current) return;
    }
    
    await wait(1000);
    setCorrectionStep('complete');
    await playAudio(`Maintenant tu peux cliquer sur suivant pour continuer !`);
    
    // Illuminer le bouton et scroller
    setHighlightNextButton(true);
    setTimeout(() => {
      scrollToNextButton();
    }, 500);
  };

  // Fonction pour créer une correction animée avec des objets visuels
  const createAnimatedCorrection = async (exercise: any) => {
    if (stopSignalRef.current) return;
    
    console.log('Début correction animée pour:', exercise);
    
    const { num1, num2, result, objectEmoji, objectName } = parseExerciseNumbers(exercise);
    
    // Stocker les nombres pour l'affichage
    setCorrectionNumbers({ num1, num2, result, objectEmoji, objectName });
    
    // Démarrer l'affichage de correction
    setShowAnimatedCorrection(true);
    setCorrectionStep('group1');
    
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
    await playAudio(`Je vais t'expliquer avec des ${objectName} !`);
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Étape 2: Affichage du premier groupe
    await playAudio(`Regarde ! D'abord, nous avons ${num1} ${objectName}.`);
    if (stopSignalRef.current) return;
    
    // Utiliser les objets appropriés ou des pièces d'or par défaut
    const displayEmoji = objectEmoji === '🐱' ? '🟡' : objectEmoji === '🚗' ? '🟡' : '🟡'; // Toujours pièces d'or pour l'affichage
    const objects1 = Array(num1).fill(displayEmoji);
    setAnimatedObjects(objects1);
    await wait(1500);
    
    // Étape 3: Affichage du deuxième groupe
    setCorrectionStep('group2');
    await playAudio(`Maintenant, nous ajoutons ${num2} ${objectName} de plus !`);
    if (stopSignalRef.current) return;
    
    // Deuxième groupe avec des pièces d'or oranges pour différencier
    const objects2 = Array(num2).fill('🟠');
    setAnimatedObjects([...objects1, ...objects2]);
    await wait(1500);
    
    // Étape 4: Explication de l'addition
    await playAudio(`${num1} plus ${num2}, cela veut dire qu'on met tous les ${objectName} ensemble !`);
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Étape 5: Comptage interactif
    setCorrectionStep('counting');
    await playAudio(`Comptons ensemble tous les ${objectName} !`);
    if (stopSignalRef.current) return;
    await wait(500);
    
    // Animation de comptage nombre par nombre avec objets qui bougent
    for (let i = 1; i <= result; i++) {
      if (stopSignalRef.current) return;
      
      // Mettre en évidence l'objet en cours de comptage
      setCountingIndex(i - 1); // index 0-based
      
      // Dire le nombre
      await playAudio(`${i}`);
      await wait(800);
    }
    
    // Remettre tous les objets en position normale
    setCountingIndex(-1);
    
    // Étape 6: Résultat final
    setCorrectionStep('result');
    await playAudio(`Parfait ! ${num1} plus ${num2} égale ${result} !`);
    if (stopSignalRef.current) return;
    await wait(1000);
    
    await playAudio(`En tout, nous avons ${result} ${objectName}. Tu vois ? L'addition, c'est compter tout ensemble !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 7: Terminé
    setCorrectionStep('complete');
    await playAudio(`Maintenant tu peux cliquer sur suivant pour continuer !`);
    
    // Illuminer le bouton et scroller
    setHighlightNextButton(true);
    setTimeout(() => {
      scrollToNextButton();
    }, 500);
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
  const renderObjects = (count: number, item: string) => {
    if (count <= 0) return null;
    
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(
        <span
          key={i}
          className="text-4xl inline-block transition-all duration-300 animate-bounce"
          style={{ 
            animationDelay: `${i * 100}ms`,
            transform: highlightedNumber === count ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          {item}
        </span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {objects}
      </div>
    );
  };

     // Fonction pour expliquer le chapitre principal  
   const explainChapter = async () => {
     console.log('explainChapter appelé');
     stopSignalRef.current = false;
     setIsAnimationRunning(true);
     setHasStarted(true);
    
    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre ce que veut dire 'additionner' !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Tu vas découvrir comment ajouter des objets ensemble pour savoir combien tu en as en tout !");
      if (stopSignalRef.current) return;
      
      // 2. Explication du concept avec animations
      await wait(1800);
      setHighlightedElement('concept-section');
      await playAudio("Additionner, c'est mettre des objets ensemble pour les compter tous !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Regardons ensemble un exemple avec des pommes.");
      if (stopSignalRef.current) return;
      
      // Animation détaillée avec premier exemple
      await wait(1200);
      setCurrentExample(0);
      setAnimatingStep('introduction');
      const example = additionExamples[0];
      
      await playAudio(`D'abord, j'ai ${example.group1} ${example.description} ici.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setObjectsStep('group1');
      setHighlightedNumber(example.group1);
      await playAudio(`Je vois ${example.group1} ${example.description}.`);
      if (stopSignalRef.current) return;
      
             await wait(1500);
       // Explication du signe +
       setShowingProcess('gathering');
       await playAudio("Tu vois le signe plus ? Il veut dire qu'on va ajouter, mettre ensemble !");
       if (stopSignalRef.current) return;
       
       await wait(1500);
       await playAudio(`Maintenant, j'ajoute ${example.group2} ${example.description} de plus !`);
       if (stopSignalRef.current) return;
      
      await wait(1200);
      setObjectsStep('group2');
      setHighlightedNumber(example.group2);
      await playAudio(`Voici ${example.group2} ${example.description} en plus.`);
      if (stopSignalRef.current) return;
      
             await wait(1500);
       setShowingProcess('counting');
       await playAudio("Maintenant, je compte tout ensemble !");
       if (stopSignalRef.current) return;
       
       // Animation de comptage nombre par nombre
       await wait(1000);
       for (let i = 1; i <= example.result; i++) {
         if (stopSignalRef.current) return;
         setHighlightedNumber(i);
         await playAudio(`${i}`);
         await wait(800);
       }
       
       await wait(1000);
       setShowingProcess(null);
       setObjectsStep('result');
       setHighlightedNumber(example.result);
       await playAudio(`En tout, j'ai ${example.result} ${example.description} ! C'est ça, additionner !`);
       if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`En mathématiques, on écrit : ${example.group1} plus ${example.group2} égale ${example.result} !`);
      if (stopSignalRef.current) return;
    
             // 3. Présentation des autres exemples
       await wait(2500);
       setHighlightedNumber(null);
       setShowingProcess(null);
       setObjectsStep(null);
       await playAudio("Parfait ! Maintenant tu comprends ce qu'est l'addition !");
       if (stopSignalRef.current) return;
       
       await wait(1200);
       await playAudio("Il y a d'autres exemples à découvrir pour bien maîtriser !");
       if (stopSignalRef.current) return;
       
       await wait(1500);
       setHighlightedElement('examples-section');
       scrollToSection('examples-section');
       await playAudio("Regarde ! Tu peux essayer avec d'autres objets !");
       if (stopSignalRef.current) return;
       
       await wait(1200);
       await playAudio("Clique sur les exemples pour voir d'autres animations !");
       if (stopSignalRef.current) return;
       
       await wait(800);
    setHighlightedElement(null);
       setCurrentExample(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setObjectsStep(null);
      setIsAnimationRunning(false);
    }
  };

     // Fonction pour expliquer un exemple spécifique
   const explainSpecificExample = async (index: number) => {
     stopAllVocalsAndAnimations();
     await wait(300);
     stopSignalRef.current = false;
     setIsAnimationRunning(true);
     
     const example = additionExamples[index];
    
    try {
       setCurrentExample(index);
       setAnimatingStep('introduction');
       scrollToSection('concept-section');
       
       await playAudio(`Je vais te montrer l'addition avec des ${example.description}.`);
       if (stopSignalRef.current) return;
       
       await wait(1500);
       setObjectsStep('group1');
       setHighlightedNumber(example.group1);
       await playAudio(`D'abord, j'ai ${example.group1} ${example.description}.`);
       if (stopSignalRef.current) return;
       
       await wait(1200);
       // Explication du signe +
       setShowingProcess('gathering');
       await playAudio("Tu vois le signe plus ? Il veut dire qu'on va ajouter, mettre ensemble !");
       if (stopSignalRef.current) return;
      
       await wait(1500);
       await playAudio(`J'ajoute ${example.group2} ${example.description} en plus.`);
       if (stopSignalRef.current) return;
       
       await wait(1500);
       setObjectsStep('group2');
       setHighlightedNumber(example.group2);
       await playAudio(`Voici les ${example.group2} ${example.description} que j'ajoute.`);
       if (stopSignalRef.current) return;
       
      await wait(1200);
       setShowingProcess('counting');
       await playAudio("Je compte tout ensemble maintenant !");
       if (stopSignalRef.current) return;
       
       // Animation de comptage nombre par nombre
       await wait(1000);
       for (let i = 1; i <= example.result; i++) {
         if (stopSignalRef.current) return;
         setHighlightedNumber(i);
         await playAudio(`${i}`);
         await wait(800);
       }
       
       await wait(1000);
       setShowingProcess(null);
       setObjectsStep('result');
       setHighlightedNumber(example.result);
       await playAudio(`${example.group1} plus ${example.group2} égale ${example.result} !`);
       if (stopSignalRef.current) return;
       
       await wait(2000);
       setCurrentExample(null);
       setHighlightedNumber(null);
       setShowingProcess(null);
       setAnimatingStep(null);
       setObjectsStep(null);
    } finally {
       setCurrentExample(null);
       setHighlightedNumber(null);
       setShowingProcess(null);
       setAnimatingStep(null);
       setObjectsStep(null);
       setIsAnimationRunning(false);
    }
  };

     // Gestion des exercices avec Sam le Pirate
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
      
      // Célébrer avec Sam
      celebrateCorrectAnswer();
      
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
      // Expliquer l'erreur avec Sam
      await explainWrongAnswer();
    }
  };

  // Gestion des réponses saisies (pour les exercices de calcul)
  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;
    
    const correct = userAnswer.trim() === exercises[currentExercise].correctAnswer;
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
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + 1;
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    } else if (!correct) {
      // Expliquer l'erreur avec Sam
      await explainWrongAnswer();
    }
  };



  const nextExercise = () => {
     stopAllVocalsAndAnimations();
     
     // Réinitialiser les états de correction
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
        await playAudio("Bonjour, faisons quelques exercices nom d'une jambe en bois !");
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
      await playAudio("Dès que tu as la réponse, tu peux cliquer sur la bonne réponse");
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
        await playAudio("En avant toutes pour les additions !");
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
      
      // Choisir le type de correction selon la question
      if (isConceptualQuestion(exercise)) {
        await createSimpleCorrection(exercise);
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

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Champion de l'addition !", message: "Tu comprends parfaitement le sens de l'addition !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre l'addition !", emoji: "📚" };
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
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
          className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-1 sm:border-2 border-blue-200 shadow-md transition-all duration-300 ${
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
              : 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-2 sm:border-4 border-yellow-300'
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
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/chapitre/cp-additions-simples" 
             onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux additions simples</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-4">
              ➕ Le sens de l'addition
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Découvre ce que veut dire "additionner" avec des objets et des animations !
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
              <span className="text-xs sm:text-sm opacity-90">({score}/{exercises.length})</span>
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
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
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
                 highlightedElement === 'concept-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
               <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                 🤔 Qu'est-ce qu'additionner ?
               </h2>
            
               <div className="bg-green-50 rounded-lg p-6 mb-6">
                 <p className="text-lg text-center text-green-800 font-semibold mb-6">
                   Additionner, c'est mettre des objets ensemble pour savoir combien on en a en tout !
                 </p>
                 
                 <div className="bg-white rounded-lg p-6">
                   <div className="text-center mb-6">
                     <div className="text-2xl font-bold text-green-600 mb-4">
                       {currentExample !== null ? 
                         `Exemple : ${additionExamples[currentExample].group1} + ${additionExamples[currentExample].group2} = ${additionExamples[currentExample].result}` 
                         : 'Exemple : 2 + 3 = 5'
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
                       
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Premier groupe */}
                           <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                             objectsStep === 'group1' ? 'ring-4 ring-purple-400 bg-purple-100 scale-105' : 'bg-purple-50'
                           }`}>
                             <h4 className="text-lg font-bold text-purple-800 mb-4">
                               {additionExamples[currentExample].group1} {additionExamples[currentExample].description}
                             </h4>
                             <div className="mb-4">
                               {renderObjects(additionExamples[currentExample].group1, additionExamples[currentExample].item)}
                  </div>
                             <div className={`text-xl font-bold transition-all duration-500 ${
                               highlightedNumber === additionExamples[currentExample].group1 ? 'text-purple-600 scale-125 animate-pulse' : 'text-purple-800'
                             }`}>
                               {additionExamples[currentExample].group1}
                  </div>
                </div>

                {/* Symbole + */}
                           <div className="text-center flex items-center justify-center">
                  <div className={`text-8xl font-bold transition-all duration-500 ${
                               showingProcess === 'gathering' ? 'text-green-500 animate-bounce scale-125 ring-4 ring-yellow-400 bg-yellow-100 rounded-full p-4 shadow-2xl' : 'text-gray-400'
                  }`}>
                    +
                  </div>
                </div>

                {/* Deuxième groupe */}
                           <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                             objectsStep === 'group2' ? 'ring-4 ring-pink-400 bg-pink-100 scale-105' : 'bg-pink-50'
                           }`}>
                             <h4 className="text-lg font-bold text-pink-800 mb-4">
                               {additionExamples[currentExample].group2} {additionExamples[currentExample].description}
                             </h4>
                             <div className="mb-4">
                               {renderObjects(additionExamples[currentExample].group2, additionExamples[currentExample].item)}
                             </div>
                             <div className={`text-xl font-bold transition-all duration-500 ${
                               highlightedNumber === additionExamples[currentExample].group2 ? 'text-pink-600 scale-125 animate-pulse' : 'text-pink-800'
                             }`}>
                               {additionExamples[currentExample].group2}
                             </div>
                           </div>
                         </div>

                                                {/* Animation de comptage */}
                         {showingProcess === 'counting' && (
                           <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                             <h4 className="text-xl font-bold text-center text-yellow-800 mb-4">
                               🔢 Maintenant, comptons tout ensemble !
                             </h4>
                             <div className="flex justify-center items-center space-x-2 text-5xl">
                               {Array.from({ length: additionExamples[currentExample].result }, (_, i) => (
                      <span 
                        key={i} 
                                   className={`transition-all duration-500 ${
                                     highlightedNumber === i + 1 ? 'scale-150 animate-bounce text-red-500' : ''
                                   }`}
                      >
                                   {additionExamples[currentExample].item}
                      </span>
                    ))}
                  </div>
                             <div className="text-center mt-4">
                               <div className="text-3xl font-bold text-yellow-800">
                                 {highlightedNumber && highlightedNumber > 0 && `${highlightedNumber}...`}
                  </div>
                </div>
              </div>
                         )}

              {/* Résultat */}
                         {objectsStep === 'result' && (
                           <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-green-100 ring-4 ring-green-400 scale-105`}>
                             <h4 className="text-2xl font-bold text-green-800 mb-4">🎉 Résultat !</h4>
                             <div className="mb-4">
                               {renderObjects(additionExamples[currentExample].result, additionExamples[currentExample].item)}
                    </div>
                             <div className="text-3xl font-bold text-green-800 mb-2">
                               {additionExamples[currentExample].group1} + {additionExamples[currentExample].group2} = {additionExamples[currentExample].result}
                    </div>
                             <div className="text-lg text-green-600">
                               En tout : {additionExamples[currentExample].result} {additionExamples[currentExample].description} !
                  </div>
                </div>
              )}
            </div>
                   ) : (
                     /* Version statique quand pas d'animation */
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="text-center p-4 bg-purple-50 rounded-lg">
                         <div className="text-sm text-gray-600 mb-2">2 pommes</div>
                         {renderObjects(2, '🍎')}
                         <div className="text-xl font-bold text-purple-800 mt-2">2</div>
                </div>
                       <div className="text-center flex items-center justify-center">
                         <div className="text-6xl font-bold text-green-600">+</div>
                </div>
                       <div className="text-center p-4 bg-pink-50 rounded-lg">
                         <div className="text-sm text-gray-600 mb-2">3 pommes</div>
                         {renderObjects(3, '🍎')}
                         <div className="text-xl font-bold text-pink-800 mt-2">3</div>
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
                🌟 Autres exemples d'addition
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                <div className="text-center">
                      <div className="text-3xl mb-2">{example.item}</div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {example.group1} + {example.group2} = {example.result}
                </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {example.description}
                  </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                  </div>
                </div>
                      ))}
                    </div>
        </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                💡 Conseils pour bien additionner
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">🤲</div>
                  <div className="font-bold">Utilise tes doigts</div>
                  <div className="text-sm">Compte sur tes mains</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🧸</div>
                  <div className="font-bold">Prends des objets</div>
                  <div className="text-sm">Jouets, crayons, bonbons...</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">👀</div>
                  <div className="font-bold">Regarde bien</div>
                  <div className="text-sm">Compte tous les objets ensemble</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ COMME UNITES-DIZAINES */
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
                
                <div className="text-sm font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              </div>
              
            {/* Indicateur de progression mobile - sticky sur la page */}
            <div className="sticky top-2 bg-white z-10 px-2 py-2 border-b border-gray-200 sm:hidden mb-6 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                <span className="font-bold text-green-600">Score : {score}/{exercises.length}</span>
                </div>
              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2 mt-1">
                <div 
                  className="bg-green-500 h-1 sm:h-2 rounded-full transition-all duration-500"
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
                
              {/* Visuel si disponible */}
              {exercises[currentExercise].visual && (
                  <div className="bg-green-50 rounded-lg p-2 sm:p-6 mb-2 sm:mb-8">
                    <div className="text-lg sm:text-4xl font-bold text-green-600">
                    {exercises[currentExercise].visual}
                  </div>
                </div>
              )}

                {/* Zone de réponse - QCM ou saisie selon le type */}
                <div 
                  id="answer-zone" 
                  className={`${highlightedElement === 'answer-zone' ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse rounded-xl p-4 bg-yellow-50' : ''} transition-all duration-300`}
                >
                {exercises[currentExercise].type === 'input' ? (
                  /* Saisie libre pour les calculs */
                  <div className="max-w-sm mx-auto mb-4 sm:mb-8">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                        disabled={isCorrect !== null || isPlayingVocal}
                        placeholder="Écris ta réponse..."
                        className="w-full sm:w-32 p-2 sm:p-4 text-center text-base sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[40px] sm:min-h-auto"
                      />
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={isCorrect !== null || isPlayingVocal || !userAnswer.trim()}
                        className="w-full sm:w-auto bg-green-500 text-white px-3 sm:px-6 py-2 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] sm:min-h-auto"
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                ) : (
                                    /* Choix multiples pour les questions conceptuelles */
                  <div className="grid grid-cols-1 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-8">
                    {exercises[currentExercise].choices?.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                        disabled={isCorrect !== null || isPlayingVocal}
                        className={`p-2 sm:p-4 md:p-6 rounded-lg font-bold text-sm sm:text-base md:text-xl transition-all min-h-[40px] sm:min-h-[56px] md:min-h-auto ${
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
                )}
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
                          Excellent ! C'est la bonne réponse !
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

              {/* Animation de correction pour les mauvaises réponses */}
              {showAnimatedCorrection && (
                <div 
                  id="animated-correction"
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 sm:p-6 md:p-8 mb-4 border-2 border-blue-200 shadow-lg"
                >
                  {/* Titre de section adaptatif */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-xs sm:text-base text-blue-600">
                      {correctionStep === 'group1' && "Observons le premier groupe..."}
                      {correctionStep === 'group2' && "Ajoutons le deuxième groupe..."}
                      {correctionStep === 'counting' && "Comptons ensemble !"}
                      {correctionStep === 'result' && animatedObjects.length === 0 && "Voici l'explication !"}
                      {correctionStep === 'result' && animatedObjects.length > 0 && "Voici le résultat !"}
                    </div>
                  </div>

                  {/* Correction simple pour questions conceptuelles */}
                  {animatedObjects.length === 0 && correctionStep === 'result' && (
                    <div className="text-center bg-white rounded-lg p-4 sm:p-6 mb-4">
                      <div className="text-lg sm:text-2xl font-bold text-green-800 mb-3">
                        💡 La bonne réponse
                      </div>
                      <div className="text-base sm:text-xl font-bold text-purple-800 bg-yellow-100 px-4 py-2 rounded-lg border-2 border-green-400">
                        {exercises[currentExercise]?.correctAnswer}
                      </div>
                    </div>
                  )}

                  {/* Affichage des objets animés (uniquement pour les calculs) */}
                  {animatedObjects.length > 0 && (
                    <div className="flex justify-center mb-3 sm:mb-6">
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1 sm:gap-2 max-w-xs sm:max-w-md">
                        {animatedObjects.map((obj, index) => (
                        <div
                          key={index}
                          className={`text-lg sm:text-3xl md:text-4xl transition-all duration-300 transform ${
                            // Animation spéciale pour l'objet en cours de comptage
                            correctionStep === 'counting' && countingIndex === index
                              ? 'animate-pulse scale-150 rotate-12 text-yellow-400 drop-shadow-lg' 
                              : correctionStep === 'counting' 
                                ? 'hover:scale-110 opacity-60'
                                : 'hover:scale-110'
                          } ${
                            // Animation pour les groupes
                            correctionStep === 'group1' && correctionNumbers && index < correctionNumbers.num1
                              ? 'animate-bounce scale-110 text-red-500'
                              : correctionStep === 'group2' && correctionNumbers && index >= correctionNumbers.num1
                                ? 'animate-bounce scale-110 text-blue-500'
                                : ''
                          }`}
                          style={{
                            animationDuration: correctionStep === 'counting' && countingIndex === index ? '0.5s' : '1s',
                            transformOrigin: 'center'
                          }}
                        >
                          {obj}
                        </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Équation mathématique (uniquement pour les calculs) */}
                  {correctionStep && correctionStep !== 'group1' && correctionNumbers && animatedObjects.length > 0 && (
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
                      <div className="text-xs sm:text-base text-green-700">
                        L'addition, c'est compter tous les objets ensemble !
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
                {((exercises[currentExercise].type === 'input' && isCorrect !== null) || isCorrect === false) && (
                  <div className="flex justify-center pb-3 sm:pb-0">
                  <button
                    ref={nextButtonRef}
                    onClick={nextExercise}
                      className={`bg-green-500 text-white px-3 sm:px-6 md:px-8 py-2 sm:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[40px] sm:min-h-[56px] md:min-h-auto ${
                        highlightNextButton 
                          ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse scale-110 bg-green-600 shadow-2xl' 
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
                const result = getCompletionMessage(finalScore, exercises.length);
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
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
              </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comprendre l'addition est très important !
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