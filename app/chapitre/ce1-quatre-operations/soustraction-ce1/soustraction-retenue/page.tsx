'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function SoustractionEmpruntCE1() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedDigits, setHighlightedDigits] = useState<string[]>([]);
  const [calculationStep, setCalculationStep] = useState<'setup' | 'units' | 'carry' | 'tens' | 'hundreds' | 'result' | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [carryValues, setCarryValues] = useState<{toTens: number, toHundreds: number}>({toTens: 0, toHundreds: 0});
  const [partialResults, setPartialResults] = useState<{units: string | null, tens: string | null, hundreds: string | null}>({units: null, tens: null, hundreds: null});
  
  // États pour la synchronisation vocale avec les boutons d'animation
  const [currentVocalSection, setCurrentVocalSection] = useState<string | null>(null);
  const [activeSpeakingButton, setActiveSpeakingButton] = useState<string | null>(null);
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États pour le personnage Minecraft (cours)
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // États pour le personnage Minecraft (exercices)
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);
  const [exercisesImageError, setExercisesImageError] = useState(false);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Exemples de soustractions posées avec emprunt
  const subtractionExamples = [
    { num1: 52, num2: 27, result: 25, hasBorrow: true, description: 'avec emprunt' },
    { num1: 81, num2: 45, result: 36, hasBorrow: true, description: 'avec emprunt' },
    { num1: 73, num2: 38, result: 35, hasBorrow: true, description: 'avec emprunt' },
    { num1: 125, num2: 67, result: 58, hasBorrow: true, description: 'avec emprunt' },
    { num1: 234, num2: 156, result: 78, hasBorrow: true, description: 'avec emprunt' },
    { num1: 321, num2: 174, result: 147, hasBorrow: true, description: 'à 3 chiffres avec emprunt' },
    { num1: 412, num2: 268, result: 144, hasBorrow: true, description: 'à 3 chiffres avec emprunt' }
  ];

  // Exercices progressifs
  // Fonction pour mélanger un tableau (Fisher-Yates)
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const baseExercises = [
    // 1. Introduction emprunts
    {
      question: 'Quand fait-on un emprunt ?', 
      correctAnswer: 'Quand le chiffre du haut est plus petit',
      choices: ['Quand on veut', 'Quand le chiffre du haut est plus petit', 'Jamais']
    },
    
    // 2. Démarrage avec calculs simples avec emprunts
    { 
      question: 'Calcule : 52 - 27', 
      correctAnswer: '25',
      choices: ['23', '25', '27'],
      visual: '   52\n-  27\n─────\n   ?'
    },
    { 
      question: 'Calcule : 81 - 45', 
      correctAnswer: '36',
      choices: ['34', '36', '38'],
      visual: '   81\n-  45\n─────\n   ?'
    },
    
    // 3. Concept des emprunts
    { 
      question: 'Comment fait-on un emprunt ?', 
      correctAnswer: 'On emprunte 1 à la colonne de gauche',
      choices: ['On ajoute 10', 'On emprunte 1 à la colonne de gauche', 'On enlève 1']
    },
    { 
      question: 'Calcule : 205 - 47', 
      correctAnswer: '158',
      choices: ['154', '158', '162'],
      visual: '  205\n-  47\n─────\n   ?'
    },
    { 
      question: 'Calcule : 305 - 58', 
      correctAnswer: '247',
      choices: ['243', '247', '251'],
      visual: '  305\n-  58\n─────\n   ?'
    },
    { 
      question: 'Calcule : 245 - 76', 
      correctAnswer: '169',
      choices: ['165', '169', '173'],
      visual: '  245\n-  76\n─────\n   ?'
    },
    
    // 4. Soustractions 3 chiffres avec emprunts multiples
    { 
      question: 'Calcule : 365 - 197', 
      correctAnswer: '168',
      choices: ['164', '168', '172'],
      visual: '  365\n- 197\n─────\n   ?'
    },
    { 
      question: 'Calcule : 514 - 185', 
      correctAnswer: '329',
      choices: ['325', '329', '333'],
      visual: '  514\n- 185\n─────\n   ?'
    },
    { 
      question: 'Calcule : 424 - 278', 
      correctAnswer: '146',
      choices: ['142', '146', '150'],
      visual: '  424\n- 278\n─────\n   ?'
    },
    { 
      question: 'Calcule : 655 - 258', 
      correctAnswer: '397',
      choices: ['393', '397', '401'],
      visual: '  655\n- 258\n─────\n   ?'
    },
    { 
      question: 'Calcule : 856 - 367', 
      correctAnswer: '489',
      choices: ['485', '489', '493'],
      visual: '  856\n- 367\n─────\n   ?'
    },
    { 
      question: 'Calcule : 874 - 296', 
      correctAnswer: '578',
      choices: ['574', '578', '582'],
      visual: '  874\n- 296\n─────\n   ?'
    },
    
    // 5. Exercices complexes avec emprunts
    { 
      question: 'Calcule : 145 - 56', 
      correctAnswer: '89',
      choices: ['85', '89', '93'],
      visual: '  145\n-  56\n─────\n   ?'
    },
    { 
      question: 'Calcule : 679 + 485', 
      correctAnswer: '1164',
      choices: ['1160', '1164', '1168'],
      visual: '  679\n+ 485\n─────\n   ?'
    },
    { 
      question: 'Que fait-on avec la emprunt ?', 
      correctAnswer: 'On l\'ajoute à la colonne suivante',
      choices: ['On l\'oublie', 'On l\'ajoute à la colonne suivante', 'On la soustrait']
    },
    
    // 6. Défis finaux
    { 
      question: 'Calcule : 758 + 397', 
      correctAnswer: '1155',
      choices: ['1151', '1155', '1159'],
      visual: '  758\n+ 397\n─────\n   ?'
    },
    { 
      question: 'La soustraction avec emprunt nous aide à...', 
      correctAnswer: 'Calculer des gros nombres',
      choices: ['Aller plus vite', 'Faire plus joli', 'Calculer des gros nombres']
    }
  ];

  const exercises = baseExercises;

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setExercisesIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedDigits([]);
    setCalculationStep(null);
    setShowingCarry(false);
    setCarryValues({toTens: 0, toHundreds: 0});
    setPartialResults({units: null, tens: null, hundreds: null});
    setSamSizeExpanded(false);
    // Reset des états de synchronisation vocale
    setCurrentVocalSection(null);
    setActiveSpeakingButton(null);
  };

  // Fonction pour jouer l'audio avec synchronisation des boutons
  const playAudio = async (text: string, slowMode = false, buttonId?: string) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      
      // Activer le bouton correspondant si spécifié
      if (buttonId) {
        setActiveSpeakingButton(buttonId);
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 1.0 : 1.3;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && voice.localService === true
      );
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onend = () => {
        setIsPlayingVocal(false);
        setActiveSpeakingButton(null); // Désactiver le bouton à la fin
        currentAudioRef.current = null;
        resolve();
      };

      utterance.onerror = () => {
        setIsPlayingVocal(false);
        setActiveSpeakingButton(null); // Désactiver le bouton en cas d'erreur
        currentAudioRef.current = null;
        resolve();
      };
      
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
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

  // Fonction pour scroller vers un élément
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour expliquer le chapitre dans le cours avec le personnage
  const explainChapterWithSam = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setSamSizeExpanded(true);
    
    try {
      await playAudio("Bonjour ! Découvrons ensemble la soustraction posée avec emprunt !", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Présenter l'exemple principal
      setHighlightedElement('example-section');
      scrollToElement('example-section');
      await playAudio("D'abord, voici l'exemple principal avec son animation !", true, 'main-example-button');
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton d'animation principal
      await playAudio("Clique sur le bouton vert pour voir comment faire !", true, 'main-example-button');
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      // Présenter la section des autres exemples
      setHighlightedElement('examples-section');
      scrollToElement('examples-section');
      await playAudio("Ensuite, tu trouveras d'autres exemples à 2 et 3 chiffres !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence les cartes d'exemples
      setHighlightedElement('example-0');
      await playAudio("Chaque carte verte a son animation ! Clique sur les cartes pour les voir !", true, 'examples-buttons');
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      // Présenter la section exercices - scroller vers le haut pour voir l'onglet
      setHighlightedElement('exercise_tab');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await playAudio("Et pour finir, tu pourras t'entraîner avec les exercices ! N'oublie pas : on commence toujours par les unités !", true);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapterWithSam:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer un exemple spécifique avec animations interactives
  const explainExercisesWithSam = async () => {
    if (exercisesIsPlayingVocal) return;
    
    setExercisesIsPlayingVocal(true);
    setExercisesHasStarted(true);
    stopSignalRef.current = false;
    
    const speak = (text: string, highlightElement?: string, buttonId?: string) => {
      return new Promise<void>((resolve) => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        
        if (highlightElement) {
          setHighlightedElement(highlightElement);
        }
        
        // Activer le bouton correspondant si spécifié
        if (buttonId) {
          setActiveSpeakingButton(buttonId);
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          if (highlightElement) {
            setTimeout(() => setHighlightedElement(''), 300);
          }
          setActiveSpeakingButton(null); // Désactiver le bouton à la fin
          resolve();
        };
        
        utterance.onerror = () => {
          setActiveSpeakingButton(null); // Désactiver le bouton en cas d'erreur
          resolve();
        };
        currentAudioRef.current = utterance;
        speechSynthesis.speak(utterance);
      });
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      await speak("Salut ! Je vais t'expliquer comment faire les exercices de soustraction avec emprunts !");
      if (stopSignalRef.current) return;

      await speak("D'abord, clique sur l'onglet Exercices pour voir les questions !");
      if (stopSignalRef.current) return;

      // Basculer vers l'onglet exercices
      setShowExercises(true);
      await wait(1000); // Attendre que l'onglet se charge
      if (stopSignalRef.current) return;
      
      await speak("Parfait ! Maintenant tu vois la première question !", 'exercises-header');
      if (stopSignalRef.current) return;
      
      await speak("Tu peux écouter l'énoncé en cliquant sur ce bouton bleu !", 'listen-button', 'listen-button');
      if (stopSignalRef.current) return;
      
      await speak("Ensuite, écris ta réponse dans cette case !", 'answer-input', 'answer-input');
      if (stopSignalRef.current) return;
      
      await speak("Quand tu es sûr de ta réponse, clique sur Valider !", 'validate-button', 'validate-button');
      if (stopSignalRef.current) return;
      
      await speak("Si c'est correct, tu passes automatiquement à l'exercice suivant !");
      if (stopSignalRef.current) return;
      
      await speak("Si c'est faux, je te montre l'animation pour t'expliquer la bonne méthode !");
      if (stopSignalRef.current) return;
      
      await speak("Puis tu pourras cliquer sur Exercice suivant pour continuer !", 'next-button', 'next-button');
      if (stopSignalRef.current) return;
      
      await speak("Ton score s'affiche ici en haut à droite ! Allez, c'est parti !", 'score-display');
      
    } catch (error) {
      console.error('Erreur lors de l\'explication des exercices:', error);
    } finally {
      if (!stopSignalRef.current) {
        setExercisesIsPlayingVocal(false);
        setHighlightedElement('');
      }
    }
  };

  const explainExample = async (index: number) => {
    if (isAnimationRunning) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(index);
    setPartialResults({units: null, tens: null, hundreds: null}); // Reset des résultats partiels
    setCarryValues({toTens: 0, toHundreds: 0}); // Reset des emprunts
    
    const example = subtractionExamples[index];
    
    // Pré-calculer toutes les emprunts
    const num1Units = example.num1 % 10;
    const num2Units = example.num2 % 10;
    const unitsSum = num1Units + num2Units;
    const carryToTens = Math.floor(unitsSum / 10);
    
    const num1Tens = Math.floor((example.num1 % 100) / 10);
    const num2Tens = Math.floor((example.num2 % 100) / 10);
    const tensSum = num1Tens + num2Tens + carryToTens;
    const carryToHundreds = Math.floor(tensSum / 10);
    
    // Scroll automatique vers l'animation
    scrollToElement('example-section');
    
    try {
      // Introduction avec focus sur le tableau U/D
      setCalculationStep('setup');
      setHighlightedElement('example-section');
      await playAudio(`Regardons ensemble cette soustraction posée : ${example.num1} moins ${example.num2} ! C'est parti !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      const maxDigits = Math.max(example.num1.toString().length, example.num2.toString().length);
      if (maxDigits >= 3) {
        await playAudio("Vois-tu le tableau au-dessus ? C pour centaines, D pour dizaines, et U pour unités ! C'est très important !", true);
      } else {
        await playAudio("Vois-tu le tableau au-dessus ? D pour dizaines... U pour unités ! C'est très important de bien comprendre ça !", true);
      }
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Chaque chiffre doit aller dans la bonne colonne ! Regarde comme ils s'alignent parfaitement... Magnifique !", true);
      if (stopSignalRef.current) return;
      
      // Focus sur les unités avec animation colorée
      await wait(2000);
      setCalculationStep('units');
      
      await playAudio(`Maintenant, la colonne des unités devient bleue ! Regarde bien... Je calcule : ${num1Units} moins ${num2Units} égale ${unitsSum} !`, true);
      if (stopSignalRef.current) return;
      
      // Afficher le résultat des unités immédiatement
      await wait(500);
      const unitsResult = unitsSum >= 10 ? (unitsSum % 10).toString() : unitsSum.toString();
      setPartialResults(prev => ({ ...prev, units: unitsResult }));
      await wait(1000);
      
      // Gestion de la emprunt avec animation spéciale
      if (carryToTens > 0) {
          await wait(1500);
          setCarryValues(prev => ({ ...prev, toTens: carryToTens }));
          setShowingCarry(true);
          await playAudio(`Oh là là ! ${num1Units} est plus petit que ${num2Units} ! Attention... Regarde l'emprunt rouge qui apparaît !`, true);
          if (stopSignalRef.current) return;
          
          await wait(1000);
          await playAudio(`Regarde ! J'emprunte 1 dizaine qui devient 10 unités ! Maintenant j'ai ${num1Units + 10} unités pour faire ${num1Units + 10} moins ${num2Units} ! C'est magique, non ?`, true);
        if (stopSignalRef.current) return;
      }
      
      // Focus sur les dizaines avec animation orange
      if (maxDigits >= 2) {
        await wait(2000);
        setCalculationStep('tens');
        
        await playAudio(`Maintenant, la colonne des dizaines devient orange ! Regarde comme elle s'anime... Fantastique !`, true);
        if (stopSignalRef.current) return;
        
        await wait(1000);
        if (carryToTens > 0) {
          await playAudio(`Je calcule : ${num1Tens} plus ${num2Tens}... plus ${carryToTens} de emprunt ! Ça fait ${tensSum} !`, true);
        } else {
          await playAudio(`Je calcule : ${num1Tens} plus ${num2Tens}... égale ${tensSum} !`, true);
        }
        if (stopSignalRef.current) return;
        
        // Afficher le résultat des dizaines
        await wait(500);
        const tensResult = tensSum >= 10 ? (tensSum % 10).toString() : tensSum.toString();
        setPartialResults(prev => ({ ...prev, tens: tensResult }));
        await wait(1000);
        
        // Gestion de la emprunt vers les centaines
        if (carryToHundreds > 0) {
          await wait(1500);
          setCarryValues(prev => ({ ...prev, toHundreds: carryToHundreds }));
          await playAudio(`Attention ! On a besoin d'emprunter encore ! Une nouvelle emprunt de ${carryToHundreds} apparaît pour les centaines !`, true);
          if (stopSignalRef.current) return;
          
          await wait(1000);
          await playAudio(`J'emprunte encore 1 centaine qui devient 10 dizaines ! Maintenant je peux calculer !`, true);
          if (stopSignalRef.current) return;
        }
      }
      
      // Focus sur les centaines avec animation violette
      if (maxDigits >= 3) {
        await wait(2000);
        setCalculationStep('hundreds');
        const num1Hundreds = Math.floor(example.num1 / 100) % 10;
        const num2Hundreds = Math.floor(example.num2 / 100) % 10;
        
        await playAudio(`Maintenant, la colonne des centaines devient violette ! Regarde bien...`, true);
        if (stopSignalRef.current) return;
        
        await wait(1000);
        const hundredsSum = num1Hundreds + num2Hundreds + carryToHundreds;
        if (carryToHundreds > 0) {
          await playAudio(`Je calcule : ${num1Hundreds} plus ${num2Hundreds}... plus ${carryToHundreds} de emprunt ! Ça fait ${hundredsSum} !`, true);
        } else {
          await playAudio(`Je calcule : ${num1Hundreds} plus ${num2Hundreds}... égale ${hundredsSum} !`, true);
        }
        if (stopSignalRef.current) return;
        
        // Afficher le résultat des centaines
        await wait(500);
        const hundredsResult = hundredsSum.toString();
        setPartialResults(prev => ({ ...prev, hundreds: hundredsResult }));
        await wait(1000);
      }
      
              // Résultat final avec animation violette spectaculaire
        await wait(2000);
        setCalculationStep('result');
        await playAudio(`Et voilà ! Le résultat apparaît en violet... avec une belle animation ! C'est ${example.result} !`, true);
        if (stopSignalRef.current) return;
        
        await wait(1500);
        await playAudio("As-tu vu comme tout s'est bien aligné ? C'est ça, la soustraction posée ! Parfait !", true);
        if (stopSignalRef.current) return;
        
        // Message pédagogique final
        await wait(1000);
        await playAudio("Souviens-toi : toujours commencer par les unités... puis les dizaines... et n'hésite pas à emprunter quand c'est nécessaire !", true);
      if (stopSignalRef.current) return;
      
      await wait(2500);
      setCurrentExample(null);
      setCalculationStep(null);
      setShowingCarry(false);
      setHighlightedElement(null);
      
    } finally {
      setIsAnimationRunning(false);
      setCurrentExample(null);
      setCalculationStep(null);
      setShowingCarry(false);
      setHighlightedElement(null);
      setPartialResults({units: null, tens: null, hundreds: null});
    }
  };

  // Fonction pour la présentation succincte de la page
  const startLessonPresentation = async () => {
    if (isAnimationRunning) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setShowExercises(false); // S'assurer qu'on est sur le cours
    
    try {
      // Introduction du chapitre
      setHighlightedElement('intro-section');
      document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      
      await playAudio("Voici le chapitre pour apprendre à poser les soustractions ! C'est plus facile comme cela !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement(null);
      
      // Présentation des différentes techniques
      await playAudio("Tu as en dessous les différentes techniques de soustractions posées...", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      
      // Focus sur les additions sans emprunt
      setHighlightedElement('examples-section');
      document.getElementById('examples-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      
      await playAudio("D'abord, les soustractions posées sans emprunt ! Comme 89 moins 14 ou 67 moins 26...", true);
      
      // Illuminer les exemples sans emprunt (indices 0 et 1)
      setHighlightedElement('example-0');
      document.getElementById('example-0')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(800);
      setHighlightedElement('example-1');
      document.getElementById('example-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Highlight spécifiquement les exemples avec emprunt
      await playAudio("Ensuite, les soustractions avec emprunt ! Comme 52 moins 28... c'est un peu plus compliqué !", true);
      
      // Illuminer les exemples avec emprunt (indices 2 et 3)
      setHighlightedElement('example-2');
      document.getElementById('example-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(800);
      setHighlightedElement('example-3');
      document.getElementById('example-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Highlight les grands nombres
      await playAudio("Et enfin, les soustractions avec de grands nombres ! Par exemple 523 moins 145... avec 3 chiffres !", true);
      
      // Illuminer l'exemple à 3 chiffres (indice 4)
      setHighlightedElement('example-4');
      document.getElementById('example-4')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement(null);
      
      // Retour vers le haut pour les instructions d'utilisation
      document.getElementById('examples-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      
      // Instructions d'utilisation
      await playAudio("Pour voir la méthode détaillée... il suffit de cliquer sur la case correspondante ! C'est très simple !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Chaque exemple te montrera... étape par étape... comment bien poser ta soustraction ! Bonne découverte !", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedElement(null);
      
    } finally {
      setIsAnimationRunning(false);
      setHighlightedElement(null);
      setPartialResults({units: null, tens: null, hundreds: null});
    }
  };

  // Fonction pour rendre une soustraction posée avec animations améliorées
  const renderPostedSubtraction = (example: any, isAnimated = false, showHelperBox = false) => {
    // Déterminer le nombre de chiffres maximum
    const maxDigits = Math.max(example.num1.toString().length, example.num2.toString().length, example.result.toString().length);
    const num1Str = example.num1.toString().padStart(maxDigits, ' ');
    const num2Str = example.num2.toString().padStart(maxDigits, ' ');
    const resultStr = example.result.toString().padStart(maxDigits, ' ');
    
    // Séparer les chiffres (unités, dizaines, centaines)
    const num1Units = num1Str[num1Str.length - 1];
    const num1Tens = num1Str[num1Str.length - 2] === ' ' ? '' : num1Str[num1Str.length - 2];
    const num1Hundreds = maxDigits >= 3 ? (num1Str[num1Str.length - 3] === ' ' ? '' : num1Str[num1Str.length - 3]) : '';
    
    const num2Units = num2Str[num2Str.length - 1];
    const num2Tens = num2Str[num2Str.length - 2] === ' ' ? '' : num2Str[num2Str.length - 2];
    const num2Hundreds = maxDigits >= 3 ? (num2Str[num2Str.length - 3] === ' ' ? '' : num2Str[num2Str.length - 3]) : '';
    
    const resultUnits = resultStr[resultStr.length - 1];
    const resultTens = resultStr[resultStr.length - 2] === ' ' ? '' : resultStr[resultStr.length - 2];
    const resultHundreds = maxDigits >= 3 ? (resultStr[resultStr.length - 3] === ' ' ? '' : resultStr[resultStr.length - 3]) : '';
    
    return (
      <div className={`bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-lg border-2 transition-all duration-500 ${
        isAnimated && currentExample === subtractionExamples.indexOf(example) ? 'border-blue-400 bg-blue-50 scale-105 shadow-xl' : 'border-gray-200'
      }`}>
        <div className="flex justify-center">
          <div className="space-y-4">
            {/* Tableau des colonnes C, D et U (ou seulement D et U) */}
            <div className="flex justify-center mb-4">
              <div className={`grid gap-4 sm:gap-6 font-bold text-sm sm:text-base ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                    calculationStep === 'hundreds' ? 'bg-purple-200 text-purple-800 animate-column-highlight' : 'bg-gray-100 text-gray-600'
                  }`}>
                    C
                  </div>
                )}
                <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                  calculationStep === 'tens' ? 'bg-orange-200 text-orange-800 animate-column-highlight' : 'bg-gray-100 text-gray-600'
                }`}>
                  D
                </div>
                <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                  calculationStep === 'units' ? 'bg-blue-200 text-blue-800 animate-column-highlight' : 'bg-gray-100 text-gray-600'
                }`}>
                  U
                </div>
              </div>
            </div>

            {/* Emprunts si nécessaire */}
            {example.hasCarry && showingCarry && (
              <div className="flex justify-center">
                <div className={`grid gap-8 ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && (
                    <div className="text-center text-red-500 text-lg">
                      {carryValues.toHundreds > 0 && (
                        <sup className="bg-red-100 px-2 py-1 rounded-full border-2 border-red-300 animate-carry-bounce">
                          {carryValues.toHundreds}
                        </sup>
                      )}
                    </div>
                  )}
                  <div className="text-center text-red-500 text-lg">
                    {carryValues.toTens > 0 && (
                      <sup className="bg-red-100 px-2 py-1 rounded-full border-2 border-red-300 animate-carry-bounce">
                        {carryValues.toTens}
                      </sup>
                    )}
                  </div>
                  <div className="text-center"></div>
                </div>
              </div>
            )}
            
            {/* Premier nombre */}
            <div className="flex justify-center">
              <div className={`grid gap-2 sm:gap-6 font-mono text-base sm:text-2xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'hundreds' ? 'bg-purple-100 text-purple-700 animate-column-highlight' : 
                    calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                  } ${num1Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                    {num1Hundreds || ''}
                  </div>
                )}
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'tens' ? 'bg-orange-100 text-orange-700 animate-column-highlight' : 
                  calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                } ${num1Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                  {num1Tens || ''}
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'units' ? 'bg-blue-100 text-blue-700 animate-column-highlight' : 
                  calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                } border-2 border-dashed border-blue-300`}>
                  {num1Units}
                </div>
              </div>
            </div>
            
            {/* Deuxième nombre avec signe + */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`grid gap-2 sm:gap-6 font-mono text-base sm:text-2xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && (
                    <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                      calculationStep === 'hundreds' ? 'bg-purple-100 text-purple-700 animate-column-highlight' : 
                      calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                    } ${num2Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                      {num2Hundreds || ''}
                    </div>
                  )}
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 relative ${
                    calculationStep === 'tens' ? 'bg-orange-100 text-orange-700 animate-column-highlight' : 
                    calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                  } ${num2Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                    {num2Tens || ''}
                  </div>
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'units' ? 'bg-blue-100 text-blue-700 animate-column-highlight' : 
                    calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                  } border-2 border-dashed border-blue-300`}>
                    {num2Units}
                  </div>
                </div>
                {/* Signe + positionné à gauche sans affecter l'alignement */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 text-3xl font-mono text-green-600 font-bold">
                  +
                </div>
              </div>
            </div>
            
            {/* Ligne de séparation animée */}
            <div className="flex justify-center">
              <div className={`border-t-4 my-3 transition-all duration-700 ${
                calculationStep === 'result' ? 'border-purple-500 shadow-lg animate-pulse' : 'border-purple-400'
              }`} style={{ width: maxDigits >= 3 ? '11rem' : '7.5rem' }}></div>
            </div>
            
            {/* Résultat avec animations progressives */}
            <div className="flex justify-center">
              <div className={`grid gap-4 sm:gap-8 font-mono text-lg sm:text-3xl font-bold ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-3 rounded-lg transition-all duration-1000 ${
                    partialResults.hundreds || calculationStep === 'result' ? 'bg-purple-100 text-purple-700 animate-result-reveal' : 'text-gray-400'
                  } ${resultHundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                    {partialResults.hundreds || (calculationStep === 'result' ? resultHundreds : '?')}
                  </div>
                )}
                <div className={`text-center p-3 rounded-lg transition-all duration-1000 ${
                  partialResults.tens || calculationStep === 'result' ? 'bg-purple-100 text-purple-700 animate-result-reveal' : 'text-gray-400'
                } ${resultTens ? 'border-2 border-dashed border-purple-300' : ''}`}>
                  {partialResults.tens || (calculationStep === 'result' ? resultTens : '?')}
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-1000 border-2 border-dashed border-purple-300 ${
                  partialResults.units || calculationStep === 'result' ? 'bg-purple-100 text-purple-700 animate-result-reveal' : 'text-gray-400'
                }`}>
                  {partialResults.units || (calculationStep === 'result' ? resultUnits : '?')}
                </div>
              </div>
            </div>

            {/* Explications textuelles animées */}
            {isAnimated && (
              <div className="mt-6 text-center">
                {calculationStep === 'units' && (
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-lg animate-fade-in font-medium">
                    🔵 On commence par les <strong>unités</strong> : {num1Units} + {num2Units} !
                  </div>
                )}
                {calculationStep === 'tens' && (
                  <div className="bg-orange-100 text-orange-800 p-3 rounded-lg animate-fade-in font-medium">
                    🟠 Puis les <strong>dizaines</strong> : {num1Tens || '0'} + {num2Tens || '0'} !
                  </div>
                )}
                {calculationStep === 'result' && (
                  <div className="bg-purple-100 text-purple-800 p-3 rounded-lg animate-fade-in font-medium">
                    🟣 <strong>Résultat final</strong> : {example.result} ! Tu as réussi !
                  </div>
                )}
                {showingCarry && (
                  <div className="bg-red-100 text-red-800 p-3 rounded-lg animate-bounce font-medium mt-2">
                    ⚠️ <strong>Emprunt</strong> : regarde le calcul à côté ! Attention !
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panneau explicatif des emprunts - Contrôlé par le paramètre showHelperBox */}
          {example.hasCarry && showingCarry && showHelperBox && (
            <div className="fixed top-20 right-4 z-10 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 shadow-lg animate-fade-in max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-yellow-700 font-medium">Calculs avec emprunts :</div>
                <div className="text-yellow-600 text-xs">💡 Aide</div>
              </div>
              
              {/* Calcul des unités */}
              {carryValues.toTens > 0 && (
                <div className="mb-3 p-2 bg-blue-50 rounded">
                  <div className="text-xs text-blue-700 font-medium mb-1">Unités :</div>
                  <div className="font-mono text-sm text-blue-800 text-center mb-2">
                    {example.num1 % 10} + {example.num2 % 10} = {(example.num1 % 10) + (example.num2 % 10)}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-blue-700">
                    <span className="bg-red-200 px-1 py-0.5 rounded font-bold">{carryValues.toTens}</span>
                    <span>↗ vers D</span>
                    <span className="bg-blue-200 px-1 py-0.5 rounded font-bold">{(example.num1 % 10 + example.num2 % 10) % 10}</span>
                    <span>↓ U</span>
                  </div>
                </div>
              )}
              
              {/* Calcul des dizaines */}
              {carryValues.toHundreds > 0 && (
                <div className="mb-3 p-2 bg-orange-50 rounded">
                  <div className="text-xs text-orange-700 font-medium mb-1">Dizaines :</div>
                  <div className="font-mono text-sm text-orange-800 text-center mb-2">
                    {Math.floor((example.num1 % 100) / 10)} + {Math.floor((example.num2 % 100) / 10)} + {carryValues.toTens} = {Math.floor((example.num1 % 100) / 10) + Math.floor((example.num2 % 100) / 10) + carryValues.toTens}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-orange-700">
                    <span className="bg-red-200 px-1 py-0.5 rounded font-bold">{carryValues.toHundreds}</span>
                    <span>↗ vers C</span>
                    <span className="bg-orange-200 px-1 py-0.5 rounded font-bold">{(Math.floor((example.num1 % 100) / 10) + Math.floor((example.num2 % 100) / 10) + carryValues.toTens) % 10}</span>
                    <span>↓ D</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };


  // Fonction pour expliquer une mauvaise réponse avec animation
  const explainWrongAnswer = async (exercise: any) => {
    if (!exercise.visual) return; // Seulement pour les exercices de calcul
    
    stopAllVocalsAndAnimations();
    await wait(500);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    // Extraire les nombres de l'exercice
    const match = exercise.question.match(/Calcule : (\d+) \+ (\d+)/);
    if (!match) {
      setIsAnimationRunning(false);
      return;
    }
    
    const num1 = parseInt(match[1]);
    const num2 = parseInt(match[2]);
    const result = parseInt(exercise.correctAnswer);
    
    // Pré-calculer toutes les emprunts comme dans explainExample
    const num1Units = num1 % 10;
    const num2Units = num2 % 10;
    const unitsSum = num1Units + num2Units;
    const carryToTens = Math.floor(unitsSum / 10);
    
    const num1Tens = Math.floor((num1 % 100) / 10);
    const num2Tens = Math.floor((num2 % 100) / 10);
    const tensSum = num1Tens + num2Tens + carryToTens;
    const carryToHundreds = Math.floor(tensSum / 10);
    
    const hasCarry = carryToTens > 0 || carryToHundreds > 0;
    const example = { num1, num2, result, hasCarry };
    
    try {
      // Reset des états d'animation
      setCalculationStep('setup');
      setPartialResults({units: null, tens: null, hundreds: null});
      setCarryValues({toTens: 0, toHundreds: 0});
      setShowingCarry(false);
      
      await playAudio(`Regardons ensemble comment faire ${num1} moins ${num2} avec la méthode posée !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      const maxDigits = Math.max(num1.toString().length, num2.toString().length);
      if (maxDigits >= 3) {
        await playAudio("Tu vois les trois colonnes : C pour centaines, D pour dizaines, et U pour unités !", true);
      } else {
        await playAudio("Tu vois les deux colonnes : D pour dizaines et U pour unités !", true);
      }
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("On commence toujours par la colonne des unités, à droite !", true);
      if (stopSignalRef.current) return;
      
      // Animation des unités
      await wait(1500);
      setCalculationStep('units');
      
      await playAudio(`Colonne U : ${num1Units} moins ${num2Units} égale ${unitsSum}`, true);
      if (stopSignalRef.current) return;
      
      await wait(500);
      const unitsResult = unitsSum >= 10 ? (unitsSum % 10).toString() : unitsSum.toString();
      setPartialResults(prev => ({ ...prev, units: unitsResult }));
      await wait(1000);
      
      // Gestion de la emprunt des unités
      if (carryToTens > 0) {
        await wait(1000);
        setCarryValues(prev => ({ ...prev, toTens: carryToTens }));
        setShowingCarry(true);
        await playAudio(`Attention ! ${num1Units} est plus petit que ${num2Units} ! Je dois emprunter ${carryToTens} !`, true);
        if (stopSignalRef.current) return;
      }
      
      // Animation des dizaines si nécessaire
      if (maxDigits >= 2) {
        await wait(1500);
        setCalculationStep('tens');
        
        if (carryToTens > 0) {
          await playAudio(`Colonne D : ${num1Tens} moins ${num2Tens} avec ${carryToTens} d'emprunt égale ${tensSum}`, true);
        } else {
          await playAudio(`Colonne D : ${num1Tens} moins ${num2Tens} égale ${tensSum}`, true);
        }
        if (stopSignalRef.current) return;
        
        await wait(500);
        const tensResult = tensSum >= 10 ? (tensSum % 10).toString() : tensSum.toString();
        setPartialResults(prev => ({ ...prev, tens: tensResult }));
        await wait(1000);
        
        // Gestion de la emprunt des dizaines
        if (carryToHundreds > 0) {
          await wait(1000);
          setCarryValues(prev => ({ ...prev, toHundreds: carryToHundreds }));
          await playAudio(`Encore un emprunt nécessaire ! Je dois emprunter ${carryToHundreds} aux centaines !`, true);
          if (stopSignalRef.current) return;
        }
      }
      
      // Animation des centaines si nécessaire
      if (maxDigits >= 3) {
        await wait(1500);
        setCalculationStep('hundreds');
        const num1Hundreds = Math.floor(num1 / 100) % 10;
        const num2Hundreds = Math.floor(num2 / 100) % 10;
        const hundredsSum = num1Hundreds + num2Hundreds + carryToHundreds;
        
        if (carryToHundreds > 0) {
          await playAudio(`Colonne C : ${num1Hundreds} moins ${num2Hundreds} avec ${carryToHundreds} d'emprunt égale ${hundredsSum}`, true);
        } else {
          await playAudio(`Colonne C : ${num1Hundreds} moins ${num2Hundreds} égale ${hundredsSum}`, true);
        }
        if (stopSignalRef.current) return;
        
        await wait(500);
        setPartialResults(prev => ({ ...prev, hundreds: hundredsSum.toString() }));
        await wait(1000);
      }
      
      // Résultat final
      await wait(1500);
      setCalculationStep('result');
      await playAudio(`Et voilà ! Le résultat est ${result} ! Tu vois comme c'est plus facile avec la méthode posée ?`, true);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsAnimationRunning(false);
      setCalculationStep(null);
      setPartialResults({units: null, tens: null, hundreds: null});
      setCarryValues({toTens: 0, toHundreds: 0});
      setShowingCarry(false);
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
        if (exercises[currentExercise].visual) {
          explainWrongAnswer(exercises[currentExercise]);
        }
      }, 1000);
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
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
    if (percentage >= 90) return { title: "🎉 Maître des soustractions posées !", message: "Tu maîtrises parfaitement la technique !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements de visibilité
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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Effet pour arrêter les animations lors du changement cours ↔ exercices
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Bouton Stop flottant */}
      {(isPlayingVocal || isAnimationRunning) && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title={isPlayingVocal ? "Arrêter le personnage" : "Arrêter l'animation"}
          >
            {/* Image du personnage */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src="/image/Minecraftstyle.png"
                alt="Personnage Minecraft"
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

      {/* Animation CSS personnalisée pour les icônes et boutons parlants */}
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
          
          @keyframes speaking-button {
            0%, 100% {
              background-color: #10b981;
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
              border-color: #059669;
            }
            50% {
              background-color: #059669;
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
              border-color: #047857;
              transform: scale(1.02);
            }
          }
          
          .speaking-button {
            animation: speaking-button 1.5s infinite;
            filter: brightness(1.1);
          }
          
          .speaking-input {
            animation: speaking-button 1.5s infinite;
            border-color: #10b981 !important;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
          }
        `
      }} />
      

      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-quatre-operations/soustraction-ce1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour à la soustraction CE1</span>
            </Link>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-900 mb-3">
              ➖ Soustraction avec emprunt
            </h1>
        </div>
      </div>

        {/* Section DÉMARRER - Affiche le bouton selon l'onglet actif */}
        {!showExercises ? (
          /* Bouton DÉMARRER pour le COURS */
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
            {/* Image du personnage */}
            <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-teal-100 ${
              isPlayingVocal
                  ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
            }`}>
              {!imageError ? (
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl rounded-full bg-gradient-to-br from-green-200 to-teal-200">
                  🧱
                </div>
              )}
              
              {isPlayingVocal && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Bouton DÉMARRER pour le COURS */}
            <button
              onClick={explainChapterWithSam}
              disabled={isPlayingVocal}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                isPlayingVocal
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-xl hover:scale-105'
              } ${!hasStarted && !isPlayingVocal ? 'animate-pulse' : ''}`}
            >
              <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
              {isPlayingVocal ? 'Le personnage explique...' : 'DÉMARRER LE COURS'}
            </button>
          </div>
        ) : (
          /* Bouton DÉMARRER pour les EXERCICES */
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
            {/* Image du personnage */}
            <div className={`relative transition-all duration-500 border-2 border-orange-300 rounded-full bg-gradient-to-br from-orange-100 to-red-100 ${
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
                <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl rounded-full bg-gradient-to-br from-orange-200 to-red-200">
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

            {/* Bouton DÉMARRER pour les EXERCICES */}
            <button
              onClick={explainExercisesWithSam}
              disabled={exercisesIsPlayingVocal}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                exercisesIsPlayingVocal
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105'
              } ${!exercisesHasStarted && !exercisesIsPlayingVocal ? 'animate-pulse' : ''}`}
            >
              <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
              {exercisesIsPlayingVocal ? 'Le personnage explique...' : 'DÉMARRER LES EXERCICES'}
            </button>
          </div>
        )}





        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showExercises
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-orange-600 hover:bg-orange-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-orange-600 hover:bg-orange-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            🎯 Exercices ({score}/{exercises.length})
          </button>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'intro-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <div className="text-center mb-3 sm:mb-6">
                <div className="text-3xl sm:text-6xl mb-2 sm:mb-4">📝</div>
                <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                  <h2 className="text-sm sm:text-xl font-bold text-gray-900">
                    La soustraction posée : simple et avec emprunt
                  </h2>
                  {/* Icône d'animation pour l'introduction */}
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300" 
                       style={{animation: 'subtle-glow 2s infinite'}}>
                    📝
                  </div>
                </div>
                <p className="text-xs sm:text-base text-gray-600">
                  On commence simple, puis on apprend les emprunts quand on ne peut pas soustraire !
                </p>
            </div>

              {/* Exemple principal animé */}
              <div 
                id="example-section"
                className={`bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 transition-all duration-1000 ${
                  highlightedElement === 'example-section' ? 'ring-4 ring-blue-400 scale-105' : ''
                }`}
              >
                <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
                  🎯 Exemple principal
                </h3>
                <div className="text-center mb-6">
                  <div className="bg-orange-100 text-orange-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg inline-block font-bold text-sm sm:text-lg">
                    📝 Calculer : 3 + 4
                  </div>
                </div>

                {currentExample !== null ? (
                  <div className="text-center">
                    <div className="mb-6">
                      {renderPostedSubtraction(subtractionExamples[currentExample], true, true)}
                        </div>
                    
                    {calculationStep && (
                      <div className="bg-white rounded-lg p-4 shadow-inner">
                        <div className="text-lg font-semibold text-orange-700">
                          {calculationStep === 'setup' && '1️⃣ J\'aligne les nombres en colonnes !'}
                          {calculationStep === 'units' && '2️⃣ Je calcule les unités : j\'ai besoin d\'emprunter !'}
                          {calculationStep === 'carry' && '3️⃣ J\'écris l\'emprunt au-dessus des dizaines !'}
                          {calculationStep === 'tens' && '4️⃣ Je calcule les dizaines avec l\'emprunt !'}
                          {calculationStep === 'result' && '5️⃣ Résultat avec emprunt ! Bravo !'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                  <div className="text-center">
                    <div className="mb-6">
                      {renderPostedSubtraction(subtractionExamples[0], false, false)}
                  </div>
                    <button
                      id="main-example-button"
                      onClick={() => explainExample(0)}
                      disabled={isAnimationRunning}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } ${activeSpeakingButton === 'main-example-button' ? 'speaking-button' : ''}`}
                    >
                      {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ Voir l\'animation'}
                    </button>
                </div>
              )}
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
                <h2 className="text-sm sm:text-xl font-bold text-gray-900">
                  🌟 Autres exemples : simple à complexe
                </h2>
                {/* Icône d'animation pour les exemples */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-blue-300" 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🌟
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subtractionExamples.map((example, index) => (
                  <div 
                    key={index}
                    id={`example-${index}`}
                    className={`bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''} ${
                      highlightedElement === `example-${index}` ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                    }`}
                    onClick={isAnimationRunning ? undefined : () => explainExample(index)}
                  >
                    <div className="text-center">
                      <div className="mb-4">
                        {renderPostedSubtraction(example, false, false)}
                    </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-3">
                        Soustraction {example.description}
                    </div>
                      <button className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } ${activeSpeakingButton === 'examples-buttons' ? 'speaking-button' : ''}`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                  </div>
                </div>
              ))}
                    </div>
            </div>

            {/* Guide pratique */}
            <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl p-3 sm:p-6 text-white">
              <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-center">
                💡 Guide pour poser une soustraction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">1️⃣</div>
                  <div className="font-bold text-xs sm:text-sm">Aligner</div>
                  <div className="text-xs">Unités sous unités, dizaines sous dizaines</div>
              </div>
                <div>
                  <div className="text-xl sm:text-2xl mb-1">2️⃣</div>
                  <div className="font-bold text-xs sm:text-sm">Calculer</div>
                  <div className="text-xs">Commence par la droite (unités)</div>
            </div>
                <div>
                  <div className="text-xl sm:text-2xl mb-1">3️⃣</div>
                  <div className="font-bold text-xs sm:text-sm">Emprunt</div>
                  <div className="text-xs">Si ≥ 10, écris l'unité et retiens</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div 
            id="exercises-section"
            className={`space-y-8 transition-all duration-1000 ${
              highlightedElement === 'exercises-section' ? 'scale-105' : ''
            }`}
          >


            {/* Header exercices */}
            <div 
              id="exercises-header"
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'exercises-header' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div 
                  id="score-display"
                  className={`text-sm sm:text-xl font-bold text-orange-600 ${
                    highlightedElement === 'score-display' ? 'ring-2 ring-green-400 bg-green-50 rounded px-2 py-1' : ''
                  }`}
                >
                    Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise].question}
                </h3>
                <button
                  id="listen-button"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(exercises[currentExercise].question);
                    utterance.rate = 0.9;
                    utterance.pitch = 1.1;
                    speechSynthesis.speak(utterance);
                  }}
                  className={`ml-4 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all ${
                    highlightedElement === 'listen-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''
                  } ${activeSpeakingButton === 'listen-button' ? 'speaking-button' : ''}`}
                >
                  🔊 Écouter
                </button>
              </div>
              
              {/* Visuel si disponible */}
              {exercises[currentExercise].visual && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-8 flex justify-center">
                  {(() => {
                    const match = exercises[currentExercise].question.match(/Calcule : (\d+) \+ (\d+)/);
                    if (match) {
                      const num1 = parseInt(match[1]);
                      const num2 = parseInt(match[2]);
                      const result = parseInt(exercises[currentExercise].correctAnswer);
                      const example = { num1, num2, result, hasCarry: true };
                      
                      // Utiliser notre fonction renderPostedSubtraction avec animation si mauvaise réponse
                      const isExerciseAnimated = isAnimationRunning && isCorrect === false;
                      const showHelperInExercise = false; // Pas de boîte jaune dans les exercices
                      
                      return renderPostedSubtraction(example, isExerciseAnimated, showHelperInExercise);
                    }
                    return null;
                  })()}
                </div>
              )}

            {/* Saisie ou choix multiples selon le type d'exercice */}
            {exercises[currentExercise].visual ? (
              // Case de saisie pour les calculs d'additions posées
              <div className="max-w-sm mx-auto mb-6">
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
                    className={`w-32 p-3 sm:p-4 text-center rounded-lg font-bold text-lg sm:text-xl border-2 transition-all ${
                      isCorrect === null
                        ? 'border-gray-300 focus:border-green-500 focus:outline-none'
                        : isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'answer-input' ? 'ring-4 ring-green-400 animate-pulse' : ''
                    } ${activeSpeakingButton === 'answer-input' ? 'speaking-input' : ''}`}
                  />
                  <button
                    id="validate-button"
                    onClick={() => handleAnswerClick(userAnswer)}
                    disabled={!userAnswer || isCorrect !== null}
                    className={`px-4 py-3 sm:px-6 sm:py-4 bg-orange-500 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'validate-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                    } ${activeSpeakingButton === 'validate-button' ? 'speaking-button' : ''}`}
                  >
                    Valider
                  </button>
                </div>
              </div>
            ) : (
              // Choix multiples pour les questions théoriques
              <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto mb-6">
                {exercises[currentExercise].choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-2 sm:p-4 rounded-lg font-bold text-sm sm:text-xl transition-all ${
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
                  className={`bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-orange-600 transition-colors ${
                    highlightedElement === 'next-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                  } ${activeSpeakingButton === 'next-button' ? 'speaking-button' : ''}`}
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
                        {finalScore >= 9 ? '⭐⭐⭐' : finalScore >= 7 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Poser une soustraction est une technique essentielle !
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