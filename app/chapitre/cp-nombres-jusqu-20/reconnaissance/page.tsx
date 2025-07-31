'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play } from 'lucide-react';

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

  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [animatingPoints, setAnimatingPoints] = useState<number[]>([]);
  const [countingNumber, setCountingNumber] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [numbersData, setNumbersData] = useState<any>({});
  const [exercises, setExercises] = useState<any[]>([]);
  const [animatingFingers, setAnimatingFingers] = useState(false);
  const [animatingGroups, setAnimatingGroups] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [fingerCount, setFingerCount] = useState(0);
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [highlightNumber3, setHighlightNumber3] = useState(false);
  const [showFinalNumber, setShowFinalNumber] = useState(false);
  const [finalNumber, setFinalNumber] = useState<string | null>(null);
  
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
    "Bigre et bigre" // exercice 10
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





  // Sauvegarder les progrès
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

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingPoints([]);
    setCountingNumber(null);
    setAnimatingFingers(false);
    setAnimatingGroups(false);
    setAnimatingStep(null);
    setFingerCount(0);
  };

  // Fonction pour scroller vers l'illustration
  const scrollToIllustration = () => {
    const element = document.getElementById('number-illustration');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  // Fonction pour scroller vers le tableau des nombres
  const scrollToNumberChoice = () => {
    const element = document.getElementById('number-choice-table');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction pour scroller vers les méthodes de comptage
  const scrollToCountingMethods = () => {
    const element = document.getElementById('counting-methods-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour jouer un audio avec gestion d'interruption
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Vérifier si l'API est disponible
      if (typeof speechSynthesis === 'undefined') {
        console.warn('SpeechSynthesis API non disponible');
        resolve();
        return;
      }
      
      speechSynthesis.cancel();
      
      // Fonction pour créer et jouer l'utterance
      const createAndPlayUtterance = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.85;  // Vitesse légèrement plus rapide pour voix par défaut
        utterance.pitch = 1.1;  // Ton légèrement plus aigu pour enfants
        utterance.volume = 1.0;
        
        // Sélectionner la voix par DÉFAUT française (plus simple et stable)
        const voices = speechSynthesis.getVoices();
        console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
        
        // VOIX PAR DÉFAUT SIMPLIFIÉE pour Reconnaissance Nombres jusqu'à 20
        const defaultVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && voice.default    // Voix française par défaut système
        ) || voices.find(voice => 
          voice.lang === 'fr-FR' && voice.localService // Voix locale française
        ) || voices.find(voice => 
          voice.lang === 'fr-FR'                     // Première voix fr-FR disponible
        ) || voices.find(voice => 
          voice.lang.startsWith('fr')                // Fallback voix française
        ) || voices[0];                               // Dernière option : première voix disponible
        
        if (defaultVoice) {
          utterance.voice = defaultVoice;
          console.log('🎤 Voix par défaut sélectionnée:', defaultVoice.name, '(', defaultVoice.lang, ')');
        } else {
          console.warn('⚠️ Aucune voix trouvée, utilisation système par défaut');
        }
        
        currentAudioRef.current = utterance;
        
        utterance.onstart = () => {
          console.log('Audio démarré:', text);
        };
        
        utterance.onend = () => {
          console.log('Audio terminé:', text);
          if (!stopSignalRef.current) {
            currentAudioRef.current = null;
          resolve();
          }
        };
        
        utterance.onerror = (event) => {
          console.error('Erreur audio:', event);
          currentAudioRef.current = null;
          resolve();
        };
        
        console.log('Lancement audio:', text);
          speechSynthesis.speak(utterance);
      };

      // Attendre que les voix soient chargées
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', function handler() {
          speechSynthesis.removeEventListener('voiceschanged', handler);
          createAndPlayUtterance();
        });
            } else {
        createAndPlayUtterance();
      }
    });
  };

    // Fonction d'attente avec vérification d'interruption
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
            resolve();
        return;
      }
      setTimeout(() => {
        if (!stopSignalRef.current) {
          resolve();
        }
      }, ms);
    });
  };

  // Fonction pour rendre les trésors de pirates - VERSION MOBILE OPTIMISÉE (HISTORIQUE)
  const renderCircles = (number: string) => {
    const count = parseInt(number);
    console.log('renderPirateTreasures appelé avec:', number, 'count:', count);
    
    if (!count || count > 20) {
      console.log('Retourne null pour count:', count);
      return null;
    }

    // Utiliser la fonction renderVisualDots pour affichage responsive
    const visual = '🟡'.repeat(count);
    console.log('Retourne', count, 'trésors de pirates (responsive)');
    return renderVisualDots(visual, false);
  };

  // Fonction pour avoir le nom vocal de l'objet pirate
  const getPirateObjectName = () => {
    return 'pièces d\'or'; // Toujours des pièces d'or !
  };

  // Fonction pour générer des exercices aléatoires avec difficulté progressive
  const generateExercises = () => {
    interface Exercise {
      question: string;
      correctAnswer: string;
      number: string;
      visual: string;
    }

    const easyNumbers = [1, 2, 3, 4, 5, 6, 7];
    const mediumNumbers = [8, 9, 10, 11, 12];
    const hardNumbers = [13, 14, 15, 16, 17, 18, 19, 20];

    // Générer 3 exercices faciles (nombres 1-7)
    const easyExercises: Exercise[] = [];
    for (let i = 0; i < 3; i++) {
      const randomEasy = easyNumbers[Math.floor(Math.random() * easyNumbers.length)];
      easyExercises.push({
        question: "Combien vois-tu de pièces d'or ?",
        correctAnswer: randomEasy.toString(),
        number: randomEasy.toString(),
        visual: '🟡'.repeat(randomEasy)
      });
    }

    // Générer 4 exercices moyens (nombres 8-12)
    const mediumExercises: Exercise[] = [];
    for (let i = 0; i < 4; i++) {
      const randomMedium = mediumNumbers[Math.floor(Math.random() * mediumNumbers.length)];
      mediumExercises.push({
        question: "Compte les pièces d'or de Sam !",
        correctAnswer: randomMedium.toString(),
        number: randomMedium.toString(),
        visual: '🟡'.repeat(randomMedium)
      });
    }

    // Générer 3 exercices difficiles (nombres 13-20)
    const hardExercises: Exercise[] = [];
    for (let i = 0; i < 3; i++) {
      const randomHard = hardNumbers[Math.floor(Math.random() * hardNumbers.length)];
      hardExercises.push({
        question: "Combien y a-t-il de trésors ?",
        correctAnswer: randomHard.toString(),
        number: randomHard.toString(),
        visual: '🟡'.repeat(randomHard)
      });
    }

    return [...easyExercises, ...mediumExercises, ...hardExercises];
  };

  // Fonction pour obtenir des exercices aléatoires
  const getRandomExercises = () => generateExercises();

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

  // Fonction pour animer l'explication d'une mauvaise réponse - ANIMATION DANS L'ÉNONCÉ
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
      
      await playAudio(`La bonne réponse est ${exercises[currentExercise].correctAnswer} !`);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      await playAudio("Regarde bien, je vais compter avec toi !");
      if (stopSignalRef.current) return;
      
      // Animation des pièces d'or directement dans l'énoncé
      const targetNumber = parseInt(exercises[currentExercise].correctAnswer);
      
      setAnimatingPoints([]);
      await wait(500);
      if (stopSignalRef.current) return;
      
      // Compter une par une en éclairant les pièces
      for (let i = 1; i <= targetNumber; i++) {
        if (stopSignalRef.current) return;
        
        setAnimatingPoints(prev => [...prev, i]);
        await playAudio(`${i}`);
        
        if (stopSignalRef.current) return;
        await wait(700);
      }
      
      if (stopSignalRef.current) return;
      
      await playAudio(`Parfait ! Nous avons compté ${targetNumber} pièces d'or !`);
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
      setAnimatingPoints([]);
      // Ne PAS remettre setIsExplainingError(false) ici - le bouton Suivant doit rester actif
      // L'état sera réinitialisé quand l'utilisateur clique sur "Suivant"
    }
  };



  // Fonction pour créer l'affichage des boules responsive (HISTORIQUE MOBILE)
  const renderVisualDots = (visual: string, isCourse = false) => {
    // Compter le nombre de boules bleues ou pièces d'or
    const dotCount = (visual.match(/🟡|🔵/g) || []).length;
    const dots = Array(dotCount).fill('🟡');
    
    // Diviser en groupes de 5 maximum
    const groups = [];
    for (let i = 0; i < dots.length; i += 5) {
      groups.push(dots.slice(i, i + 5));
    }
    
    return (
      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex justify-center space-x-1 sm:space-x-2">
            {group.map((dot, dotIndex) => (
              <span 
                key={dotIndex} 
                className={`${isCourse ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl md:text-3xl lg:text-4xl'} text-blue-600`}
              >
                {dot}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  // Fonction pour expliquer le chapitre au démarrage
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setSamSizeExpanded(true); // Agrandir Sam de façon permanente

    try {
      // Détection Chrome locale pour l'audio
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      console.log('Début explainChapter - Chrome:', isChrome);
      
      if (isChrome) {
        // Pour Chrome : activation plus agressive
        speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Vérification des voix pour Chrome
        let voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.log('Attente des voix Chrome...');
          await new Promise((resolve) => {
            const checkVoices = () => {
              voices = speechSynthesis.getVoices();
              if (voices.length > 0) {
                console.log('Voix Chrome chargées:', voices.length);
                resolve(voices);
              } else {
                setTimeout(checkVoices, 100);
              }
            };
            checkVoices();
          });
        }
      } else {
        // Test silencieux pour Safari et autres
        const testUtterance = new SpeechSynthesisUtterance(' ');
        testUtterance.volume = 0.01;
        speechSynthesis.speak(testUtterance);
        await wait(100);
      }
      
      // Nouveau message d'accueil
      await playAudio("Hello, c'est Sam le Pirate et mon ami Robotek !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio("Aujourd'hui nous allons apprendre à compter et à reconnaître les nombres jusqu'à 20 !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      // Mettre en surbrillance la grande box d'exemple
      setHighlightedElement('introduction-section');
      await playAudio("Voici un exemple !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Animation synchronisée avec comptage vocal - exemple avec 3
      await playAudio("Regardez bien ! Je vais compter ces 3 points avec vous !");
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Compter en synchronisant avec l'animation des points
      setAnimatingPoints([]); // Reset
      await wait(300);
      
      // Point 1
      setAnimatingPoints([1]);
      await playAudio("Un !");
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Point 2
      setAnimatingPoints([1, 2]);
      await playAudio("Deux !");
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Point 3
      setAnimatingPoints([1, 2, 3]);
      await playAudio("Trois !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Animation du résultat final avec mise en évidence
      setHighlightNumber3(true);
      await playAudio("Et voilà ! Le résultat est 3 !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Fin de l'animation exemple
      setAnimatingPoints([]);
      setHighlightNumber3(false);
      setHighlightedElement(null);
      await wait(500);
      
      // Nouvelle séquence : présentation de la grille des nombres
      await playAudio("Tu pourras voir de nombreux exemples en cliquant sur ces chiffres !");
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Scroll vers la grille des nombres
      const numberChoiceElement = document.getElementById('number-choice-table');
      if (numberChoiceElement) {
        numberChoiceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      await wait(1000);
      
      // Éclairer la grande box avec tous les chiffres
      setHighlightedElement('number-choice-table');
      await wait(1000);
      
      // Animation de quelques chiffres au hasard avec de belles couleurs
      const randomNumbers = ['7', '12', '3', '18', '5', '15', '9'];
      
      for (let i = 0; i < randomNumbers.length; i++) {
        if (stopSignalRef.current) return;
        
        const num = randomNumbers[i];
        setHighlightedElement(`number-${num}`);
        await wait(400);
        setHighlightedElement('number-choice-table'); // Retour sur la box globale
        await wait(300);
      }
      
      await wait(500);
      setHighlightedElement(null);
      
      // Nouvelle séquence : présentation des techniques de comptage
      await playAudio("Pour t'aider tu peux cliquer sur les techniques pour apprendre différentes façons de compter !");
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Scroll sur la box des techniques de comptage
      const countingMethodsElement = document.getElementById('counting-methods-section');
      if (countingMethodsElement) {
        countingMethodsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      await wait(1000);
      
      // Illuminer et laisser illuminer la grande box
      setHighlightedElement('counting-methods-section');
      await wait(1000);
      
      // Dire "avec tes doigts" et illuminer la box avec les doigts
      await playAudio("avec tes doigts");
      if (stopSignalRef.current) return;
      setHighlightedElement('fingers-section');
      await wait(1500);
      
      // Dire "ou en faisant des paquets de 5, comme les 5 doigts de ta main" et illuminer la box avec des groupes de 5
      await playAudio("ou en faisant des paquets de 5, comme les 5 doigts de ta main");
      if (stopSignalRef.current) return;
      setHighlightedElement('groups-section');
      await wait(2000);
      
      // À la fin Sam dit "amuse toi bien nom d'une jambe en bois"
      await playAudio("amuse toi bien nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      setHighlightedElement(null);
      await wait(800);
      
      // Scroller sur tous les nombres à tester dans la zone précédente
      if (numberChoiceElement) {
        numberChoiceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      await wait(1000);
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour expliquer un nombre spécifique avec animation
  const explainNumber = async (number: string) => {
    const num = parseInt(number);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setCountingNumber(num);

    try {
      await playAudio(`Très bien ! Tu as choisi le nombre ${number} !`);
      await wait(1000);
      
      // Illuminer le nombre sélectionné
      setHighlightedElement('selected-number-display');
      await playAudio(`Voici le nombre ${number} !`);
      await wait(1500);
      setHighlightedElement(null);
      
      // Illuminer la représentation visuelle
      setHighlightedElement('visual-representation');
      await playAudio("Maintenant, comptons ensemble pour voir combien ça fait !");
      await wait(1500);
      
      // Animation de comptage avec points qui s'illuminent
      await playAudio("Je vais compter et les points vont s'illuminer un par un !");
      await wait(1000);
      
      // Comptage synchronisé avec animation
      for (let i = 1; i <= num; i++) {
        if (stopSignalRef.current) break;
        
        setAnimatingPoints([i]);
        await playAudio(i.toString());
        await wait(800);
      }
      
      setAnimatingPoints([]);
      setHighlightedElement('final-count');
      await playAudio(`Et voilà ! Nous avons compté ${num} points ! C'est le nombre ${number} !`);
      await wait(2000);
      setHighlightedElement(null);
      
      await playAudio("Tu peux maintenant choisir un autre nombre pour continuer à apprendre !");
      
    } catch (error) {
      console.error('Erreur dans explainNumber:', error);
    } finally {
      setIsPlayingVocal(false);
      setCountingNumber(null);
      setAnimatingPoints([]);
    }
  };

  // Détecter le navigateur côté client pour éviter l'erreur d'hydratation
  useEffect(() => {
    setIsClient(true);
    
    // Lister les voix disponibles au chargement pour diagnostic
    const listAvailableVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log('=== VOIX DISPONIBLES ===');
        voices.forEach(voice => {
          if (voice.lang.startsWith('fr')) {
            console.log(`🇫🇷 ${voice.name} (${voice.lang}) ${voice.localService ? '[Native]' : '[Cloud]'} ${voice.default ? '[Défaut]' : ''}`);
          }
        });
        console.log('========================');
      }
    };
    
    // Attendre que les voix soient chargées
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', listAvailableVoices);
    } else {
      listAvailableVoices();
    }
    
    // Initialiser les données - juste les mots
    setNumbersData({
      '1': { word: 'un' },
      '2': { word: 'deux' },
      '3': { word: 'trois' },
      '4': { word: 'quatre' },
      '5': { word: 'cinq' },
      '6': { word: 'six' },
      '7': { word: 'sept' },
      '8': { word: 'huit' },
      '9': { word: 'neuf' },
      '10': { word: 'dix' },
      '11': { word: 'onze' },
      '12': { word: 'douze' },
      '13': { word: 'treize' },
      '14': { word: 'quatorze' },
      '15': { word: 'quinze' },
      '16': { word: 'seize' },
      '17': { word: 'dix-sept' },
      '18': { word: 'dix-huit' },
      '19': { word: 'dix-neuf' },
      '20': { word: 'vingt' }
    });
    
    setExercises(getRandomExercises());
  }, []);

  // Arrêter les vocaux quand on change d'onglet ou de page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // TEMPORAIREMENT DÉSACTIVÉ - était la cause de l'interruption audio
      // stopAllVocalsAndAnimations();
    };
  }, []);

  // Arrêter les vocaux quand on va aux exercices ET remettre le bouton démarrer quand on revient au cours
  useEffect(() => {
    if (showExercises) {
      stopAllVocalsAndAnimations();
      // IMPORTANT : Réinitialiser l'état de l'intro pirate pour qu'elle puisse redémarrer
      setPirateIntroStarted(false);
      setShowExercisesList(false);
      // Réinitialiser l'exercice en cours
      if (exercises.length > 0) {
        setCurrentExercise(0);
        setUserAnswer('');
        setIsCorrect(null);
      }
      // CRITIQUE : Remettre stopSignalRef à false après avoir arrêté les animations
      setTimeout(() => {
        stopSignalRef.current = false;
      }, 100);
    } else {
      // Quand on revient dans la section cours, remettre le bouton DÉMARRER
      setHasStarted(false);
      stopSignalRef.current = false;
    }
  }, [showExercises]);

  // UseEffect pour forcer la remise à zéro du champ de réponse quand on change d'exercice
  useEffect(() => {
    console.log('🔄 Nouvel exercice:', currentExercise + 1, '- Remise à zéro du champ');
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
    setHighlightedElement(null);
  }, [currentExercise]);

  // Fonction pour féliciter avec audio pour les bonnes réponses - AVEC GESTION D'INTERRUPTION COMME LE COURS
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
      
      await playAudio(`C'est bien ${exercises[currentExercise].correctAnswer} !`);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans celebrateCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // handleAnswerSubmit modifiée avec la même gestion d'interruption que le cours
  const handleAnswerSubmit = async (answer: string) => {
    if (!answer.trim() || isPlayingVocal) return;
    
    const correctAnswer = exercises[currentExercise].correctAnswer;
    const correct = answer === correctAnswer;
    
    setUserAnswer(answer);
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    // Réaction vocale avec même gestion que le cours
    if (correct) {
      await celebrateCorrectAnswer();
      
      // Passage automatique à l'exercice suivant après 1.5s
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          // Le useEffect va s'occuper de réinitialiser les états quand currentExercise change
          setCurrentExercise(currentExercise + 1);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
    } else {
      // Mauvaise réponse → Explication avec Sam le Pirate
      setTimeout(async () => {
        await explainWrongAnswer();
      }, 500);
    }
  };



  // Liste de choix pour la sélection - réduite à 3 exemples  
  const choiceNumbers = ['3', '7', '15'];

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
          // Le useEffect va s'occuper de réinitialiser les états quand currentExercise change
          setCurrentExercise(currentExercise + 1);
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

  // resetAll modifiée pour inclure les états Sam le Pirate
  const resetAll = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    // Le useEffect va s'occuper de réinitialiser userAnswer, isCorrect, etc. quand currentExercise change
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setExerciseStarted(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    // Régénérer les exercices
    setExercises(getRandomExercises());
    // Forcer le redémarrage de l'intro après un court délai
    setTimeout(() => {
      stopSignalRef.current = false;
    }, 100);
  };

  // nextExercise modifiée pour réinitialiser les boutons Sam le Pirate
  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    
    if (currentExercise < exercises.length - 1) {
      // Le useEffect va s'occuper de réinitialiser les états quand currentExercise change
      setCurrentExercise(currentExercise + 1);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
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
            src="/image/pirate.png" 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
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
              👁️ Reconnaître les nombres de 0 à 20
            </h1>
          </div>
        </div>

        {/* Navigation entre cours et exercices - MOBILE OPTIMISÉE */}
        <div className="flex justify-center mb-3 sm:mb-2">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
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
                stopAllVocalsAndAnimations();
                setShowExercises(true);
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
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-3 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-4 p-4 mb-6">
                {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                isPlayingVocal
                  ? 'w-20 sm:w-24 h-20 sm:h-24' // When speaking - agrandi mobile
                  : samSizeExpanded
                    ? 'w-16 sm:w-32 h-16 sm:h-32' // Enlarged - agrandi mobile
                    : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
                }`}>
                  <img 
                    src="/image/pirate.png" 
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
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-12 py-3 sm:py-6 rounded-xl font-bold text-base sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                }`}
              >
                  <Play className="inline w-5 h-5 sm:w-8 sm:h-8 mr-2 sm:mr-4" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
            </div>
              </div>

            {/* Introduction - RESPONSIVE MOBILE OPTIMISÉE */}
            <div 
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'introduction-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🤔 Qu'est-ce que reconnaître un nombre ?
              </h2>
              
              <div 
                className={`bg-blue-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6 transition-all duration-500 ${
                  highlightedElement === 'definition-box' ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''
                }`}
              >
                <p className="text-sm sm:text-lg text-center text-blue-800 font-semibold mb-2 sm:mb-4">
                  Reconnaître un nombre, c'est savoir combien il y a d'objets en les comptant !
                </p>
                
                <div 
                  className={`bg-white rounded-lg p-2 sm:p-4 transition-all duration-500 ${
                    highlightedElement === 'example-box' ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-blue-600 mb-2 sm:mb-4">
                      <div className="mb-1 sm:mb-2">Exemple :</div>
                      <div className="flex justify-center items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <div className="flex gap-1 sm:gap-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full transition-all duration-300 ${
                                animatingPoints.includes(i) ? 'ring-4 ring-yellow-400 bg-yellow-300 animate-bounce scale-125' : ''
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg sm:text-2xl font-bold mx-1 sm:mx-2">=</span>
                        <span className={`text-lg sm:text-2xl font-bold transition-all duration-500 ${
                          highlightNumber3 ? 'bg-yellow-300 rounded-lg px-2 py-1 scale-150 animate-bounce ring-4 ring-yellow-500 shadow-lg' : ''
                        }`}>3</span>
                      </div>
                    </div>
                    <div 
                      className={`text-sm sm:text-xl text-gray-700 mb-2 sm:mb-4 transition-all duration-500 ${
                        highlightedElement === 'counting-explanation' ? 'bg-yellow-200 rounded-lg p-2 scale-110' : ''
                      }`}
                    >
                      Je compte : 1, 2, 3 → C'est le nombre 3 !
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre principal */}
            {/* UN SEUL tableau unifié */}
            <div 
              id="number-choice-table"
              className={`bg-white rounded-xl p-4 md:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'choice-list' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre
              </h2>
              
              {/* Grille responsive optimisée mobile */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 md:gap-3 max-w-4xl mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map((num) => {
                  const isExample = choiceNumbers.includes(num);
                  return (
                  <button
                      key={num}
                      id={`number-${num}`}
                    onClick={() => {
                        stopAllVocalsAndAnimations();
                        setSelectedNumber(num);
                        // Scroll vers l'illustration après une courte pause pour voir le bouton sélectionné
                        setTimeout(() => {
                          scrollToIllustration();
                          explainNumber(num);
                        }, 300);
                      }}
                      className={`p-3 sm:p-2 md:p-3 rounded-lg font-bold text-base sm:text-sm md:text-lg transition-all hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        selectedNumber === num
                          ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                          : isExample 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      } ${
                        highlightedElement === `number-${num}` ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110' : ''
                      } ${
                        isExample && highlightedElement === 'examples-section' ? 'ring-2 ring-green-400 bg-green-200' : ''
                      }`}
                    >
                      {num}
                  </button>
                  );
                })}
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div 
              id="number-illustration"
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Découvrons le nombre {selectedNumber}
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div 
                    className={`text-6xl font-bold text-green-600 transition-all duration-500 ${
                      highlightedElement === 'selected-number-display' ? 'ring-4 ring-yellow-400 bg-yellow-200 rounded-lg p-4 scale-110' : ''
                    }`}
                  >
                  {selectedNumber}
                </div>
                
                  <div className="text-3xl font-bold text-blue-600">
                    {numbersData[selectedNumber as keyof typeof numbersData]?.word || 
                     ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'][parseInt(selectedNumber)] || selectedNumber}
                  </div>
                  
                  <div 
                    className={`bg-white rounded-lg p-6 transition-all duration-500 ${
                      highlightedElement === 'visual-representation' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
                    }`}
                  >
                                        <div className="mb-4 flex flex-wrap justify-center items-center gap-1 min-h-[60px]">
                      {renderCircles(selectedNumber)}
                    </div>

                    <div 
                      className={`text-xl font-bold text-gray-700 transition-all duration-500 ${
                        highlightedElement === 'final-count' ? 'bg-yellow-200 rounded-lg p-4 scale-110' : ''
                      }`}
                    >
                      {countingNumber !== null ? `Nous comptons : ${countingNumber} !` : `C'est le nombre ${selectedNumber} !`}
                </div>
              </div>
                </div>
                  </div>
                </div>

            {/* Différentes façons de compter - RESPONSIVE MOBILE OPTIMISÉE */}
            <div 
              id="counting-methods-section"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'counting-methods' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                ✋ Différentes façons de compter
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                {/* Avec les doigts */}
                <div 
                  id="fingers-method"
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      // Arrêter toutes les animations et voix en cours
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      
                      // Réinitialiser le signal d'arrêt et démarrer la nouvelle animation
                      stopSignalRef.current = false;
                      setIsPlayingVocal(true);
                      setAnimatingFingers(true);
                      setAnimatingStep('one-hand');
                      
                      try {
                        console.log('Début animation doigts');
                        await playAudio("Avec tes doigts, tu peux compter jusqu'à 10 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 800));
                      
                      await playAudio("Une main égale 5 doigts ! Regardons :");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      // Compter les 5 doigts un par un
                      setFingerCount(0);
                      for (let i = 1; i <= 5; i++) {
                        if (stopSignalRef.current) break;
                        setFingerCount(i);
                        await playAudio(i.toString());
                        if (stopSignalRef.current) break;
                        await new Promise(resolve => setTimeout(resolve, 600));
                      }
                      
                      await playAudio("Cinq doigts sur une main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      setAnimatingStep('two-hands');
                      setFingerCount(0);
                      await playAudio("Maintenant, deux mains égalent 10 doigts ! Comptons :");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      // Compter les 10 doigts un par un
                      for (let i = 1; i <= 10; i++) {
                        if (stopSignalRef.current) break;
                        setFingerCount(i);
                        await playAudio(i.toString());
                        if (stopSignalRef.current) break;
                        await new Promise(resolve => setTimeout(resolve, 500));
                      }
                      
                      await playAudio("Dix doigts avec les deux mains ! C'est pratique pour compter jusqu'à 10 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      } finally {
                        setAnimatingFingers(false);
                        setAnimatingStep(null);
                        setFingerCount(0);
                        setIsPlayingVocal(false);
                      }
                    }
                  }}
                  className={`bg-pink-50 rounded-lg p-3 sm:p-6 cursor-pointer hover:bg-pink-100 transition-all duration-300 ${
                    highlightedElement === 'fingers-section' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                  } ${
                    animatingFingers ? 'ring-2 ring-pink-400 bg-pink-100' : ''
                  }`}
                >
                  <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-pink-800 text-center">
                    ✋ Avec tes doigts (jusqu'à 10)
                  </h3>
                  <div className="text-center space-y-2 sm:space-y-4">
                    <div className={`text-4xl sm:text-6xl transition-all duration-500 ${animatingFingers ? 'scale-110' : ''}`}>
                      {animatingFingers && animatingStep === 'two-hands' ? '✋✋' : '✋'}
                    </div>
                    
                    {/* Animation avec les cercles pour illustrer - RESPONSIVE */}
                    {animatingFingers && (
                      <div className="bg-white rounded-lg p-2 sm:p-4 border-2 border-pink-300">
                        <div className="text-sm sm:text-lg font-bold text-pink-800 mb-2 sm:mb-3">
                          {animatingStep === 'one-hand' ? 'Une main → 5 objets' : 'Deux mains → 10 objets'}
                        </div>
                        <div className="flex flex-wrap justify-center gap-1 mb-2 sm:mb-3">
                          {Array.from({length: animatingStep === 'one-hand' ? 5 : 10}, (_, i) => (
                            <div
                              key={`finger-circle-${i}`}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-500 ${
                                i < fingerCount 
                                  ? 'bg-yellow-400 ring-2 ring-yellow-600 scale-110' 
                                  : 'bg-pink-500'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-xs sm:text-sm text-pink-600">
                          {animatingStep === 'one-hand' ? 
                            'Compte sur tes 5 doigts : 1, 2, 3, 4, 5 !' : 
                            'Avec tes 10 doigts : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 !'}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-lg text-pink-700 font-semibold">
                      <span className={animatingFingers && animatingStep === 'one-hand' ? 'bg-yellow-200 font-bold' : ''}>
                        1 main = 5 doigts
                      </span>
                      <br/>
                      <span className={animatingFingers && animatingStep === 'two-hands' ? 'bg-yellow-200 font-bold' : ''}>
                        2 mains = 10 doigts
                      </span>
                    </p>
                  </div>
                </div>

                {/* Avec des groupes de 5 */}
                <div 
                  id="groups-method"
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      // Arrêter toutes les animations et voix en cours
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      
                      // Réinitialiser le signal d'arrêt et démarrer la nouvelle animation
                      stopSignalRef.current = false;
                      setIsPlayingVocal(true);
                      setAnimatingGroups(true);
                      
                      try {
                        console.log('Début animation groupes');
                        await playAudio("Avec des groupes de 5, c'est plus facile !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 800));
                      
                      await playAudio("Pourquoi 5 ? Parce que 5, c'est comme une main avec 5 doigts !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      setAnimatingStep('group1');
                      await playAudio("Regarde : ce premier groupe de 5, c'est comme une main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      
                      setAnimatingStep('group2');
                      await playAudio("Ce deuxième groupe de 5, c'est comme une autre main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      
                      setAnimatingStep('group3');
                      await playAudio("Et ces 2 derniers, ça fait 5 plus 5 plus 2 égale 12 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      // Explication pourquoi on groupe par 5
                      setAnimatingStep('explanation');
                      await playAudio("C'est pour ça que quand on compte avec des points, on aime bien les regrouper par 5 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 800));
                      
                      await playAudio("Car on peut les représenter avec une main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      setAnimatingStep('show-hands');
                      await playAudio("Regardez : une main pour ce groupe de 5...");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      
                      await playAudio("...et une autre main pour cet autre groupe de 5 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      await playAudio("C'est beaucoup plus facile de compter comme ça !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      } finally {
                        setAnimatingGroups(false);
                        setAnimatingStep(null);
                        setIsPlayingVocal(false);
                      }
                    }
                  }}
                  className={`bg-purple-50 rounded-lg p-3 sm:p-6 cursor-pointer hover:bg-purple-100 transition-all duration-300 ${
                    highlightedElement === 'groups-section' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                  } ${
                    animatingGroups ? 'ring-2 ring-purple-400 bg-purple-100' : ''
                  }`}
                >
                  <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-purple-800 text-center">
                    📦 Avec des groupes de 5
                  </h3>
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="flex justify-center items-center flex-wrap gap-2">
                      {/* Premier groupe de 5 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={`group1-${i}`}
                              className={`w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full transition-all duration-500 ${
                                animatingGroups && (animatingStep === 'group1' || animatingStep === null || animatingStep === 'show-hands') ? 'scale-110' : ''
                              } ${
                                (animatingStep === 'group1' || animatingStep === 'show-hands') ? 'ring-2 ring-yellow-400' : ''
                              }`}
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                </div>
                        {/* Main sous le premier groupe */}
                        {animatingGroups && (animatingStep === 'group1' || animatingStep === 'show-hands') && (
                          <div className={`text-2xl transition-all duration-300 ${
                            animatingStep === 'show-hands' ? 'scale-125 animate-pulse' : 'scale-110'
                          }`}>✋</div>
                        )}
              </div>

                      {/* Séparateur */}
                      <span className={`mx-2 text-2xl font-bold text-purple-600 ${animatingGroups ? 'opacity-70' : ''}`}>|</span>
                      
                      {/* Deuxième groupe de 5 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {[6, 7, 8, 9, 10].map((i) => (
                            <div
                              key={`group2-${i}`}
                              className={`w-6 h-6 bg-red-500 rounded-full transition-all duration-500 ${
                                animatingGroups && (animatingStep === 'group2' || animatingStep === null || animatingStep === 'show-hands') ? 'scale-110' : ''
                              } ${
                                (animatingStep === 'group2' || animatingStep === 'show-hands') ? 'ring-2 ring-yellow-400' : ''
                              }`}
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                        </div>
                        {/* Main sous le deuxième groupe */}
                        {animatingGroups && (animatingStep === 'group2' || animatingStep === 'show-hands') && (
                          <div className={`text-2xl transition-all duration-300 ${
                            animatingStep === 'show-hands' ? 'scale-125 animate-pulse' : 'scale-110'
                          }`}>✋</div>
                        )}
                      </div>
                      
                      {/* Séparateur */}
                      <span className={`mx-2 text-2xl font-bold text-purple-600 ${animatingGroups ? 'opacity-70' : ''}`}>|</span>
                      
                      {/* Groupe de 2 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {[11, 12].map((i) => (
                            <div
                              key={`group3-${i}`}
                              className={`w-6 h-6 bg-red-500 rounded-full transition-all duration-500 ${
                                animatingGroups && (animatingStep === 'group3' || animatingStep === null) ? 'scale-110' : ''
                              } ${
                                animatingStep === 'group3' ? 'ring-2 ring-yellow-400' : ''
                              }`}
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                        </div>
                        {/* Pas de main pour le groupe de 2, juste highlight */}
                      </div>
                    </div>
                    <p className={`text-lg text-purple-700 font-semibold transition-all duration-300 ${
                      animatingGroups && animatingStep === 'group3' ? 'scale-110 font-bold bg-yellow-200 rounded px-2' : ''
                    }`}>
                      5 + 5 + 2 = 12
                    </p>
                    
                    {/* Explication supplémentaire */}
                    {animatingGroups && (animatingStep === 'explanation' || animatingStep === 'show-hands') && (
                      <div className="mt-4 p-3 bg-yellow-100 rounded-lg border-2 border-yellow-300 animate-fade-in">
                        <p className="text-sm text-purple-800 font-bold text-center">
                          💡 Grouper par 5 = utiliser ses mains !
                        </p>
                        <p className="text-xs text-purple-600 text-center mt-1">
                          {animatingStep === 'show-hands' ? 
                            'Chaque groupe de 5 points = 1 main ✋' : 
                            'C\'est pour ça qu\'on aime les groupes de 5 !'}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

              <div className="mt-6 text-center">
                <p className="text-lg text-gray-600 font-semibold">
                  💡 Clique sur chaque méthode pour l'entendre !
                </p>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour bien reconnaître
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-yellow-800">
                    🧠 Méthodes
                  </h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Compte un par un avec ton doigt</li>
                    <li>• Utilise tes mains pour les petits nombres</li>
                    <li>• Regarde bien tous les objets</li>
                    <li>• Compte lentement sans te tromper</li>
              </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Astuces
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• 🔵 = 10 (une dizaine)</li>
                    <li>• 🔴 = 1 (une unité)</li>
                    <li>• Compte d'abord les 🔵 puis les 🔴</li>
                    <li>• Vérifie toujours ton comptage</li>
                  </ul>
                </div>
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
                
                <div className="text-sm font-bold text-blue-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
            </div>

            {/* Question - MOBILE ULTRA-OPTIMISÉ - AVEC BOUTON ÉCOUTER */}
            <div className="fixed inset-x-4 bottom-4 top-72 bg-white rounded-xl shadow-lg text-center overflow-y-auto flex flex-col sm:relative sm:inset-x-auto sm:bottom-auto sm:top-auto sm:p-6 md:p-8 sm:mt-8 sm:flex-none sm:overflow-visible">
              <div className="flex-1 p-3 overflow-y-auto sm:p-0 sm:overflow-visible">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 sm:mb-6 md:mb-8 gap-4">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Combien vois-tu de pièces d'or ?"}
                </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage visuel - AVEC ANIMATION D'EXPLICATION */}
              <div className={`bg-white border-2 rounded-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-500 ${
                isExplainingError ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-300' : 'border-orange-200'
              }`}>
                <div className="py-6 sm:py-8 md:py-10">
                  {/* Affichage normal ou animé des pièces d'or */}
                  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-6">
                    {Array.from({ length: parseInt(exercises[currentExercise]?.number || '0') }, (_, i) => (
                      <div
                        key={i + 1}
                        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full transition-all duration-500 flex items-center justify-center text-xl sm:text-2xl md:text-3xl ${
                          animatingPoints.includes(i + 1) && isExplainingError
                            ? 'bg-yellow-400 ring-4 ring-yellow-600 scale-125 animate-bounce shadow-lg' 
                            : isExplainingError
                              ? 'bg-yellow-300 border-2 border-yellow-500'
                              : 'bg-blue-200'
                        }`}
                      >
                        🟡
                      </div>
                    ))}
                  </div>
                  
                  {/* Message d'explication avec la bonne réponse en rouge */}
                  {isExplainingError && (
                    <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
                      <div className="text-lg font-bold text-red-800 mb-2">
                        🏴‍☠️ Explication de Sam le Pirate
                      </div>
                      <div className="text-red-700 text-xl">
                        La bonne réponse est <span className="font-bold text-3xl text-red-800">{exercises[currentExercise]?.correctAnswer}</span> !
                      </div>
                      <div className="text-sm text-red-600 mt-2">
                        Sam a compté {exercises[currentExercise]?.correctAnswer} pièces d'or une par une pour toi !
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Champ de réponse */}
              <div className="mb-8 sm:mb-12">
                <div className={`relative max-w-xs mx-auto transition-all duration-500 ${
                  highlightedElement === 'answer-input' ? 'ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-4 scale-110 shadow-2xl animate-pulse' : ''
                }`}>
                  <input
                    id="answer-input"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit(userAnswer)}
                    onClick={() => stopAllVocalsAndAnimations()}
                    disabled={isCorrect !== null}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white"
                    placeholder="?"
                    min="1"
                    max="20"
                  />
                </div>
              </div>
              
              {/* Boutons Valider et Suivant */}
              <div className="sticky bottom-0 bg-white pt-4 mt-auto sm:mb-6 sm:static sm:pt-0">
                  <div className="flex gap-4 justify-center">
                    <button
                    id="validate-button"
                    onClick={() => handleAnswerSubmit(userAnswer)}
                    disabled={!userAnswer.trim() || isCorrect !== null || isPlayingVocal}
                    className={`bg-green-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'validate-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                    }`}
                  >
                    Valider
                    </button>

                    <button
                    id="next-exercise-button"
                    onClick={nextExercise}
                    disabled={!isExplainingError && isCorrect !== false}
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
                      Bravo ! C'est bien {exercises[currentExercise].correctAnswer} !
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
                  if (percentage >= 90) return { title: "🎉 Champion de la reconnaissance !", message: "Tu reconnais parfaitement les nombres !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu apprends à bien reconnaître !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Savoir reconnaître les nombres est très important !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
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