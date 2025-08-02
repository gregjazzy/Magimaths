'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function AdditionsJusqu20CP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'showing-first' | 'showing-second' | 'counting' | 'result' | null>(null);
  const [additionStep, setAdditionStep] = useState<'overview' | 'complement-strategy' | 'moving-objects' | 'first-ten' | 'adding-rest' | 'final-result' | null>(null);
  const [countingProgress, setCountingProgress] = useState<number>(0);
  const [movingBlues, setMovingBlues] = useState<number>(0);
  const [showStrategy, setShowStrategy] = useState<boolean>(false);
  
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
  const [correctionStep, setCorrectionStep] = useState<'numbers' | 'adding' | 'counting' | 'result' | 'complete' | null>(null);
  const [highlightNextButton, setHighlightNextButton] = useState(false);

  // État pour la détection mobile
  const [isMobile, setIsMobile] = useState(false);
  const [animatedObjects, setAnimatedObjects] = useState<string[]>([]);

  // État pour stocker les nombres de la correction en cours
  const [correctionNumbers, setCorrectionNumbers] = useState<{
    first: number;
    second: number;
    result: number;
    objectEmoji1: string;
    objectEmoji2: string;
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

  // Données des additions jusqu'à 20 avec animations
  const additionExamples = [
    { 
      first: 7, 
      second: 5, 
      result: 12,
      item1: '🔴', 
      item2: '🔵',
      description: 'addition avec passage de dizaine',
      strategy: 'complément à 10',
      explanation: 'Pour 7 + 5, je prends 3 de 5 pour faire 7 + 3 = 10, puis j\'ajoute les 2 qui restent : 10 + 2 = 12'
    },
    { 
      first: 6, 
      second: 6, 
      result: 12,
      item1: '🟢', 
      item2: '🟢',
      description: 'double de 6',
      strategy: 'doubles',
      explanation: '6 + 6 = 12. Les doubles sont faciles à retenir !'
    },
    { 
      first: 8, 
      second: 7, 
      result: 15,
      item1: '🟡', 
      item2: '🟣',
      description: 'addition avec passage de dizaine',
      strategy: 'complément à 10',
      explanation: 'Pour 8 + 7, je prends 2 de 7 pour faire 8 + 2 = 10, puis j\'ajoute les 5 qui restent : 10 + 5 = 15'
    },
    { 
      first: 9, 
      second: 6, 
      result: 15,
      item1: '🔴', 
      item2: '🔵',
      description: 'addition avec passage de dizaine',
      strategy: 'complément à 10',
      explanation: 'Pour 9 + 6, je prends 1 de 6 pour faire 9 + 1 = 10, puis j\'ajoute les 5 qui restent : 10 + 5 = 15'
    },
    { 
      first: 10, 
      second: 8, 
      result: 18,
      item1: '🟢', 
      item2: '🟡',
      description: 'addition avec 10',
      strategy: 'ajouter à 10',
      explanation: '10 + 8 = 18. Quand on ajoute à 10, c\'est très facile !'
    }
  ];

  // Exercices sur les additions jusqu'à 20 - saisie libre
  const exercises = [
    { question: 'Calcule 7 + 5', firstNumber: 7, secondNumber: 5, correctAnswer: 12, type: 'passage-dizaine' },
    { question: 'Calcule 6 + 6', firstNumber: 6, secondNumber: 6, correctAnswer: 12, type: 'double' },
    { question: 'Calcule 8 + 7', firstNumber: 8, secondNumber: 7, correctAnswer: 15, type: 'passage-dizaine' },
    { question: 'Calcule 9 + 4', firstNumber: 9, secondNumber: 4, correctAnswer: 13, type: 'passage-dizaine' },
    { question: 'Calcule 10 + 6', firstNumber: 10, secondNumber: 6, correctAnswer: 16, type: 'avec-10' },
    { question: 'Calcule 5 + 8', firstNumber: 5, secondNumber: 8, correctAnswer: 13, type: 'passage-dizaine' },
    { question: 'Calcule 9 + 9', firstNumber: 9, secondNumber: 9, correctAnswer: 18, type: 'double' },
    { question: 'Calcule 7 + 8', firstNumber: 7, secondNumber: 8, correctAnswer: 15, type: 'passage-dizaine' },
    { question: 'Calcule 10 + 9', firstNumber: 10, secondNumber: 9, correctAnswer: 19, type: 'avec-10' },
    { question: 'Calcule 6 + 8', firstNumber: 6, secondNumber: 8, correctAnswer: 14, type: 'passage-dizaine' }
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
    setAdditionStep(null);
    setCountingProgress(0);
    setMovingBlues(0);
    setShowStrategy(false);
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

  // Fonction pour vérifier si une addition est correcte
  const isValidAddition = (userAnswer: string, exercise: any) => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer) || answer < 0) return false;
    
    return answer === exercise.correctAnswer;
  };

  // Fonction pour parser les nombres d'un exercice d'addition
  const parseAdditionNumbers = (exercise: any) => {
    return {
      first: exercise.firstNumber,
      second: exercise.secondNumber,
      result: exercise.correctAnswer,
      objectEmoji1: '🔴',
      objectEmoji2: '🔵',
      objectName: 'objets'
    };
  };

  // Fonction pour rendre les objets avec animations
  const renderObjects = (count: number, item: string, isHighlighted = false) => {
    if (count <= 0) return null;
    
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(
        <span
          key={i}
          className={`text-4xl inline-block transition-all duration-500 ${
            isHighlighted ? 'animate-bounce scale-125' : ''
          } ${
            countingProgress > 0 && i < countingProgress ? 'text-green-500 scale-110' : ''
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
        {objects}
      </div>
    );
  };

  // Fonction pour créer une correction animée avec des objets visuels pour les additions
  const createAnimatedCorrection = async (exercise: any, userAnswer?: string) => {
    if (stopSignalRef.current) return;
    
    console.log('Début correction animée pour addition:', exercise, 'avec réponse:', userAnswer);
    
    const { first, second, result, objectEmoji1, objectEmoji2, objectName } = parseAdditionNumbers(exercise);
    
    // Stocker les nombres pour l'affichage
    setCorrectionNumbers({ first, second, result, objectEmoji1, objectEmoji2, objectName });
    
    // Démarrer l'affichage de correction
    setShowAnimatedCorrection(true);
    setCorrectionStep('numbers');
    
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
      if (userNum === result) {
        await playAudio(`Je vais te montrer que ${first} plus ${second} égale bien ${result} !`);
      } else {
        await playAudio(`Tu as répondu ${userAnswer}, mais regardons le bon calcul !`);
      }
    } else {
      await playAudio(`Je vais t'expliquer cette addition avec des ${objectName} !`);
    }
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Étape 2: Affichage des deux nombres
    await playAudio(`Regarde ! Voici ${first} ${objectName} rouges et ${second} ${objectName} bleus.`);
    if (stopSignalRef.current) return;
    
    // Montrer les objets des deux nombres
    const allObjects = [
      ...Array(first).fill('🔴'),
      ...Array(second).fill('🔵')
    ];
    setAnimatedObjects(allObjects);
    await wait(1500);
    
    // Étape 3: Addition 
    setCorrectionStep('adding');
    await playAudio(`Maintenant, je compte tous les ${objectName} ensemble !`);
    if (stopSignalRef.current) return;
    await wait(1000);
    
    // Étape 4: Comptage objet par objet
    setCorrectionStep('counting');
    for (let i = 1; i <= result; i++) {
      if (stopSignalRef.current) return;
      setCountingIndex(i - 1);
      await playAudio(`${i}`);
      await wait(600);
    }
    
    // Remettre tous les objets en position normale
    setCountingIndex(-1);
    
    // Étape 5: Résultat
    setCorrectionStep('result');
    await playAudio(`En tout, j'ai ${result} ${objectName} !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    await playAudio(`Donc ${first} + ${second} = ${result} ! C'est ça, une addition !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 6: Vérification finale
    await playAudio(`Vérifions ensemble : ${first} plus ${second} égale ${result} !`);
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Étape 7: Terminé
    setCorrectionStep('complete');
    
    // Messages différents selon mobile/desktop
    if (isMobile) {
      await playAudio(`Appuie sur suivant pour un autre exercice !`);
    } else {
      await playAudio(`Maintenant tu peux cliquer sur suivant pour continuer !`);
    }
    
    // Illuminer le bouton et scroller
    setHighlightNextButton(true);
    
    if (isMobile) {
      setTimeout(() => {
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
      
      // Lancer l'animation de correction pour additions avec la réponse utilisateur si incorrecte
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

  // Fonction pour l'introduction vocale de Sam le Pirate
  const startPirateIntro = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    const isReplay = pirateIntroStarted;
    setPirateIntroStarted(true);
    
    try {
      if (isReplay) {
        await playAudio("Eh bien, nom d'un sabre ! Tu veux que je répète mes instructions ?");
        if (stopSignalRef.current) return;
        
        await wait(1000);
        if (stopSignalRef.current) return;
        
        await playAudio("Très bien moussaillon ! Rappel des consignes !");
        if (stopSignalRef.current) return;
      } else {
        await playAudio("Bonjour, faisons quelques exercices d'additions jusqu'à 20 nom d'une jambe en bois !");
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
      await playAudio("Écris le résultat de l'addition dans la case, puis clique sur vérifier");
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

  // Fonction pour expliquer le chapitre principal avec la belle animation
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);
    
    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les additions jusqu'à 20 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("C'est passionnant ! Nous allons découvrir des techniques magiques pour calculer facilement !");
      if (stopSignalRef.current) return;
      
      // 2. Montrer la vue d'ensemble
      await wait(1800);
      setHighlightedElement('concept-section');
      setCurrentExample(0);
      setAdditionStep('overview');
      const example = additionExamples[0];
      await playAudio(`Regardons ensemble comment faire ${example.first} plus ${example.second} !`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`Voici mes objets : ${example.first} objets rouges et ${example.second} objets bleus.`);
      if (stopSignalRef.current) return;
      
      // 3. Expliquer la stratégie du complément à 10
      await wait(2000);
      setAdditionStep('complement-strategy');
      setShowStrategy(true);
      await playAudio("Je vais te montrer une astuce magique : le complément à 10 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`Au lieu de compter ${example.first} plus ${example.second}, je vais séparer les ${example.second} objets bleus.`);
      if (stopSignalRef.current) return;
      
      // Calculs dynamiques pour l'exemple
      const complement = 10 - example.first;
      const remaining = example.second - complement;
      
      await wait(1500);
      await playAudio(`Je prends ${complement} objets bleus pour compléter les ${example.first} rouges et faire 10.`);
      if (stopSignalRef.current) return;
      
      // 4. Animation du déplacement des objets bleus
      await wait(1000);
      setAdditionStep('moving-objects');
      await playAudio(`Regarde ! Les ${complement} objets bleus vont rejoindre les ${example.first} rouges.`);
      if (stopSignalRef.current) return;
      
      // Animation progressive du déplacement
      await wait(800);
      for (let i = 1; i <= complement; i++) {
        if (stopSignalRef.current) return;
        setMovingBlues(i);
        await playAudio(`${i}...`);
        await wait(600);
      }
      await playAudio("Maintenant j'ai 10 objets ensemble !");
      if (stopSignalRef.current) return;
      
      // 5. Montrer les 10 objets
      await wait(1500);
      setAdditionStep('first-ten');
      await playAudio(`${example.first} plus ${complement} égale 10 ! C'est beaucoup plus facile !`);
      if (stopSignalRef.current) return;
      
      // 6. Ajouter les restants
      await wait(1800);
      setAdditionStep('adding-rest');
      await playAudio(`Maintenant j'ajoute les ${remaining} objets bleus qui restent.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio(`10 plus ${remaining} égale ${example.result} !`);
      if (stopSignalRef.current) return;
      
      // 7. Résultat final
      await wait(1500);
      setAdditionStep('final-result');
      await playAudio(`Et voilà ! ${example.first} plus ${example.second} égale ${example.result}, grâce à l'astuce du complément à 10 !`);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      await playAudio("Avec cette technique, tu peux additionner beaucoup plus facilement !");
      if (stopSignalRef.current) return;
      
      // 8. Présentation des autres exemples
      await wait(2500);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
      setCurrentExample(null);
      setHighlightedElement(null);
      await playAudio("Parfait ! Maintenant tu comprends les additions jusqu'à 20 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a plein d'autres additions et d'astuces à découvrir !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('examples-section');
      scrollToSection('examples-section');
      await playAudio("Regarde ! Tu peux essayer avec d'autres nombres !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Clique sur les exemples pour voir d'autres techniques !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
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
      scrollToSection('concept-section');
      
      // Utiliser la même séquence que le chapitre principal mais adaptée
      await playAudio(`Je vais te montrer comment calculer ${example.first} plus ${example.second} avec l'astuce du complément à 10.`);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setAdditionStep('overview');
      await playAudio(`Voici mes objets : ${example.first} objets rouges et ${example.second} objets bleus.`);
      if (stopSignalRef.current) return;
      
      if (example.strategy === 'complément à 10') {
        // Calculs dynamiques pour cet exemple
        const complement = 10 - example.first;
        const remaining = example.second - complement;
        
      await wait(1500);
        setAdditionStep('complement-strategy');
        setShowStrategy(true);
        await playAudio("Je vais utiliser l'astuce du complément à 10 !");
        if (stopSignalRef.current) return;
      
      await wait(1500);
        await playAudio(`Au lieu de compter ${example.first} plus ${example.second}, je vais séparer les ${example.second} objets bleus.`);
        if (stopSignalRef.current) return;
      
      await wait(1500);
        await playAudio(`Je prends ${complement} objets bleus pour compléter les ${example.first} rouges et faire 10.`);
        if (stopSignalRef.current) return;
        
        // Animation du déplacement des objets bleus
        await wait(1000);
        setAdditionStep('moving-objects');
        await playAudio(`Regarde ! Les ${complement} objets bleus vont rejoindre les ${example.first} rouges.`);
        if (stopSignalRef.current) return;
        
        // Animation progressive du déplacement
        await wait(800);
        for (let i = 1; i <= complement; i++) {
          if (stopSignalRef.current) return;
          setMovingBlues(i);
          await playAudio(`${i}...`);
          await wait(600);
        }
        await playAudio("Maintenant j'ai 10 objets ensemble !");
        if (stopSignalRef.current) return;
        
        // Montrer les 10 objets
        await wait(1500);
        setAdditionStep('first-ten');
        await playAudio(`${example.first} plus ${complement} égale 10 ! C'est beaucoup plus facile !`);
        if (stopSignalRef.current) return;
        
        // Ajouter les restants
        await wait(1800);
        setAdditionStep('adding-rest');
        await playAudio(`Maintenant j'ajoute les ${remaining} objets bleus qui restent.`);
        if (stopSignalRef.current) return;
        
        await wait(1200);
        await playAudio(`10 plus ${remaining} égale ${example.result} !`);
        if (stopSignalRef.current) return;
        
        // Résultat final
        await wait(1500);
        setAdditionStep('final-result');
        await playAudio(`Et voilà ! ${example.first} plus ${example.second} égale ${example.result}, grâce à l'astuce du complément à 10 !`);
        if (stopSignalRef.current) return;
      } else {
        await wait(1500);
        setAdditionStep('final-result');
        await playAudio(example.explanation);
        if (stopSignalRef.current) return;
        
        await wait(1200);
        await playAudio(`${example.first} plus ${example.second} égale ${example.result} !`);
        if (stopSignalRef.current) return;
      }
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
      setIsAnimationRunning(false);
    }
  };

  // Gestion des exercices avec validation et correction animée
  const handleAnswerSubmit = async () => {
    stopAllVocalsAndAnimations();
    
    if (!userAnswer.trim()) {
      alert('Veuillez entrer une réponse');
      return;
    }

    const correct = isValidAddition(userAnswer, exercises[currentExercise]);
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
      // Féliciter l'utilisateur
      await celebrateCorrectAnswer();
      
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setShowAnimatedCorrection(false);
          setCorrectionStep(null);
          setCorrectionNumbers(null);
          setAnimatedObjects([]);
          setCountingIndex(-1);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    } else {
      // Expliquer la mauvaise réponse avec correction animée
      await explainWrongAnswer();
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    setHighlightNextButton(false);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowAnimatedCorrection(false);
      setCorrectionStep(null);
      setCorrectionNumbers(null);
      setAnimatedObjects([]);
      setCountingIndex(-1);
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
    setHighlightNextButton(false);
    setShowAnimatedCorrection(false);
    setCorrectionStep(null);
    setCorrectionNumbers(null);
    setAnimatedObjects([]);
    setCountingIndex(-1);
  };

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Champion des additions !", message: "Tu maîtrises parfaitement les additions jusqu'à 20 !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les additions !", emoji: "📚" };
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
  }, [showExercises]);

  // Effet pour nettoyer lors du démontage
  useEffect(() => {
    return () => {
      stopAllVocalsAndAnimations();
    };
  }, []);

  // JSX pour l'introduction de Sam le Pirate dans les exercices (identique à complements-10)
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-0 sm:p-1 mt-0 sm:mt-2">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Image de Sam le Pirate */}
        <div 
          id="sam-pirate"
          className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-1 sm:border-2 border-blue-200 shadow-md transition-all duration-300 ${
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
              : 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-2 sm:border-4 border-yellow-300'
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
                <div className="absolute top-2 right-2 w-1 h-1 bg-indigo-300 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
              </>
            )}
          </>
        )}
      </button>
      </div>
    </div>
  );

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-additions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux additions simples</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🧮 Additions jusqu'à 20
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Découvre les techniques magiques pour calculer jusqu'à 20 !
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
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'concept-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧮 Comment faire des additions jusqu'à 20 ?
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-blue-800 font-semibold mb-6">
                  Découvre les techniques magiques pour calculer facilement !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      {currentExample !== null ? 
                        `${additionExamples[currentExample].first} + ${additionExamples[currentExample].second} = ${additionExamples[currentExample].result}` 
                        : '7 + 5 = 12'
                      }
                    </div>
                    </div>

                  {/* Animation avec stratégie du complément à 10 intégrée */}
                  {currentExample !== null ? (
                    <div className="space-y-6">
                                              {/* Vue d'ensemble */}
                        {additionStep === 'overview' && (
                          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
                            <div className="text-lg text-gray-700 mb-4 text-center">Problème : {additionExamples[currentExample].first} + {additionExamples[currentExample].second} = ?</div>
                            <div className="text-lg text-gray-700 mb-4 text-center">Voici tous mes objets :</div>
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                              {/* Premier nombre d'objets rouges */}
                              {Array.from({ length: additionExamples[currentExample].first }, (_, i) => (
                                <span key={`red-${i}`} className="text-3xl border-2 border-red-300 rounded-lg p-1 bg-red-50">🔴</span>
                              ))}
                              {/* Deuxième nombre d'objets bleus */}
                              {Array.from({ length: additionExamples[currentExample].second }, (_, i) => (
                                <span key={`blue-${i}`} className="text-3xl border-2 border-blue-300 rounded-lg p-1 bg-blue-50">🔵</span>
                ))}
              </div>
                            <div className="text-xl font-bold text-gray-800 text-center">
                              <span className="text-red-600">{additionExamples[currentExample].first} objets rouges</span> + <span className="text-blue-600">{additionExamples[currentExample].second} objets bleus</span> = <span className="text-purple-600">?</span>
                </div>
                          </div>
                        )}

                                              {/* Animation fluide du complément à 10 */}
                        {(additionStep === 'complement-strategy' || additionStep === 'moving-objects' || additionStep === 'first-ten' || additionStep === 'adding-rest') && showStrategy && (() => {
                          const example = additionExamples[currentExample];
                          const complement = 10 - example.first; // Ce qu'il faut prendre du second pour faire 10
                          const remaining = example.second - complement; // Ce qui reste du second
                          
                          return (
                            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                              <div className="text-center text-lg text-yellow-800 font-bold mb-4">🎯 Astuce magique : Complément à 10</div>
                              
                              {/* Animation continue sur une seule ligne */}
                              <div className="bg-white rounded-lg p-6 border-2 border-yellow-300">
                                <div className="flex justify-center items-center gap-4 mb-4">
                                  
                                  {/* Premier nombre d'objets rouges (deviennent 10 objets) */}
                                  <div className="text-center">
                                    <div className="text-sm text-red-700 mb-2">
                                      {(additionStep === 'complement-strategy' || additionStep === 'moving-objects') && `${example.first} objets rouges`}
                                      {(additionStep === 'first-ten' || additionStep === 'adding-rest') && `10 objets (${example.first}+${complement})`}
                    </div>
                                    <div className="flex gap-1 justify-center border-2 border-red-300 rounded-lg p-2 bg-red-50">
                                      {Array.from({ length: example.first }, (_, i) => (
                                        <span key={i} className="text-2xl">🔴</span>
                                      ))}
                                      {/* Bleus qui arrivent pour faire 10 */}
                                      {(additionStep === 'first-ten' || additionStep === 'adding-rest') && Array.from({ length: complement }, (_, i) => (
                                        <span key={`moved-${i}`} className="text-2xl animate-pulse">🔵</span>
                                      ))}
                    </div>
                                    {(additionStep === 'first-ten' || additionStep === 'adding-rest') && (
                                      <div className="text-green-700 font-bold mt-2">{example.first} + {complement} = 10 ✅</div>
                                    )}
                  </div>
                  
                  {/* Signe + */}
                                  <div className="text-3xl text-yellow-600 font-bold">+</div>

                                  {/* Deuxième nombre d'objets bleus (avec séparation progressive) */}
                                  <div className="text-center">
                                    <div className="text-sm text-blue-700 mb-2">
                                      {additionStep === 'complement-strategy' && `${example.second} objets bleus`}
                                      {additionStep === 'moving-objects' && `Les ${complement} vont faire 10...`}
                                      {additionStep === 'first-ten' && `${remaining} bleus restants`}
                                      {additionStep === 'adding-rest' && `${remaining} bleus restants`}
                    </div>
                                    <div className="flex gap-1 justify-center border-2 border-blue-300 rounded-lg p-2 bg-blue-50">
                                      {/* Les premiers bleus qui vont partir */}
                                      {additionStep === 'complement-strategy' && Array.from({ length: complement }, (_, i) => (
                                        <span key={i} className="text-2xl border-2 border-green-400 rounded bg-green-100 animate-pulse">🔵</span>
                                      ))}
                                      {additionStep === 'moving-objects' && Array.from({ length: complement }, (_, i) => (
                                        <span key={i} className={`text-2xl transition-all duration-1000 ${
                                          i < movingBlues ? 'opacity-30 scale-75 animate-ping' : 'border-2 border-green-400 rounded bg-green-100 animate-pulse'
                                        }`}>🔵</span>
                                      ))}
                                      {/* Les restants (toujours présents) */}
                                      {Array.from({ length: remaining }, (_, i) => (
                                        <span key={`remaining-${i}`} className={`text-2xl ${
                                          additionStep === 'adding-rest' ? 'animate-bounce scale-125 bg-orange-200 rounded-full' : ''
                                        }`}>🔵</span>
                                      ))}
                    </div>
                  </div>
                  
                  {/* Signe = */}
                                  <div className="text-3xl text-purple-600 font-bold">=</div>

                                  {/* Résultat progressif */}
                                  <div className="text-center">
                                    <div className="text-sm text-purple-700 mb-2">
                                      {additionStep === 'complement-strategy' && 'Résultat'}
                                      {additionStep === 'moving-objects' && 'En cours...'}
                                      {additionStep === 'first-ten' && '10 objets !'}
                                      {additionStep === 'adding-rest' && `${example.result} objets !`}
                    </div>
                                    <div className="border-2 border-purple-300 rounded-lg p-2 bg-purple-50 min-h-[60px] flex items-center justify-center">
                                      {additionStep === 'complement-strategy' && (
                                        <span className="text-2xl text-gray-400">?</span>
                                      )}
                                      {additionStep === 'moving-objects' && (
                                        <span className="text-lg text-purple-600 animate-pulse">En formation...</span>
                                      )}
                                      {additionStep === 'first-ten' && (
                                        <div className="flex gap-1">
                                          {Array.from({ length: 10 }, (_, i) => (
                                            <span key={i} className="text-lg animate-pulse">{i < example.first ? '🔴' : '🔵'}</span>
                                          ))}
                    </div>
                                      )}
                                      {additionStep === 'adding-rest' && (
                                        <div className="flex gap-1">
                                          {Array.from({ length: example.result }, (_, i) => (
                                            <span key={i} className="text-lg">{i < example.first ? '🔴' : '🔵'}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {additionStep === 'adding-rest' && (
                                      <div className="text-orange-700 font-bold mt-2">10 + {remaining} = {example.result} ✅</div>
                                    )}
                  </div>
                </div>
                
                                {/* Formule du bas */}
                                <div className="text-center text-lg font-bold text-gray-700 border-t-2 border-yellow-200 pt-3">
                                  {additionStep === 'complement-strategy' && `${example.first} + ${example.second} = ?`}
                                  {additionStep === 'moving-objects' && `${example.first} + (${complement} + ${remaining}) = ?`}
                                  {additionStep === 'first-ten' && `(${example.first} + ${complement}) + ${remaining} = 10 + ${remaining}`}
                                  {additionStep === 'adding-rest' && `${example.first} + ${example.second} = (${example.first} + ${complement}) + ${remaining} = 10 + ${remaining} = ${example.result} 🎉`}
                      </div>
                  </div>
                            </div>
                          );
                        })()}

                      

                      {/* Résultat final */}
                      {additionStep === 'final-result' && currentExample !== null && (() => {
                        const example = additionExamples[currentExample];
                        const complement = 10 - example.first;
                        const remaining = example.second - complement;
                        
                        return (
                          <div className="bg-purple-100 rounded-lg p-6 border-2 border-purple-400 ring-4 ring-purple-400 scale-105">
                            <h4 className="text-2xl font-bold text-purple-800 mb-4 text-center">🎉 Résultat final !</h4>
                            <div className="bg-white rounded-lg p-4 mb-4">
                              <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-purple-800 mb-2">{example.first} + {example.second} = {example.result}</div>
                                <div className="text-lg text-purple-600">
                                  {example.strategy === 'complément à 10' ? 'Grâce au complément à 10 !' : 
                                   example.strategy === 'doubles' ? 'Grâce aux doubles !' :
                                   example.strategy === 'ajouter à 10' ? 'Grâce à l\'addition à 10 !' : 'Excellent calcul !'}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {Array.from({ length: example.result }, (_, i) => (
                                  <span key={i} className="text-lg animate-pulse">{i < example.first ? '🔴' : '🔵'}</span>
                                ))}
                              </div>
                            </div>
                            {example.strategy === 'complément à 10' && (
                              <div className="text-center bg-purple-200 rounded-lg p-4">
                                <div className="text-lg font-bold text-purple-800">
                                  {example.first} + {example.second} = {example.first} + ({complement} + {remaining}) = ({example.first} + {complement}) + {remaining} = 10 + {remaining} = {example.result} ! 🎯
                                </div>
                  </div>
                )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Version statique avec visualisation complète */
                    currentExample !== null ? (() => {
                      const example = additionExamples[currentExample];
                      
                      return (
                        <div className="space-y-8">
                          {/* Visualisation complète de l'exemple choisi */}
                          <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-bold text-center text-gray-800 mb-6">🧮 Visualisation de {example.first} + {example.second} = {example.result}</h4>
                            
                            {/* Montrer tous les objets ensemble */}
                            <div className="text-center mb-6">
                              <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
                                <div className="text-lg text-gray-700 mb-4">Voici tous les objets ensemble :</div>
                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                  {/* Premier nombre d'objets rouges */}
                                  {Array.from({ length: example.first }, (_, i) => (
                                    <span key={`red-${i}`} className="text-3xl border-2 border-red-300 rounded-lg p-1 bg-red-50">🔴</span>
                                  ))}
                                  {/* Deuxième nombre d'objets bleus */}
                                  {Array.from({ length: example.second }, (_, i) => (
                                    <span key={`blue-${i}`} className="text-3xl border-2 border-blue-300 rounded-lg p-1 bg-blue-50">🔵</span>
                                  ))}
                  </div>
                                <div className="text-xl font-bold text-gray-800">
                                  <span className="text-red-600">{example.first} objets rouges</span> + <span className="text-blue-600">{example.second} objets bleus</span> = <span className="text-green-600">{example.result} objets en tout</span>
                                </div>
                              </div>
                            </div>

                            {/* Décomposition claire */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                              <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
                                <div className="text-sm text-gray-600 mb-2">{example.first} objets rouges</div>
                                <div className="flex flex-wrap gap-1 justify-center mb-2">
                                  {Array.from({ length: example.first }, (_, i) => (
                                    <span key={i} className="text-2xl">🔴</span>
                                  ))}
                                </div>
                                <div className="text-xl font-bold text-red-800">{example.first}</div>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <div className="text-4xl font-bold text-gray-600 bg-gray-200 rounded-full px-3 py-1">+</div>
                              </div>
                              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <div className="text-sm text-gray-600 mb-2">{example.second} objets bleus</div>
                                <div className="flex flex-wrap gap-1 justify-center mb-2">
                                  {Array.from({ length: example.second }, (_, i) => (
                                    <span key={i} className="text-2xl">🔵</span>
                                  ))}
                                </div>
                                <div className="text-xl font-bold text-blue-800">{example.second}</div>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <div className="text-4xl font-bold text-gray-600 bg-gray-200 rounded-full px-3 py-1">=</div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                <div className="text-sm text-gray-600 mb-2">{example.result} objets en tout</div>
                                <div className="flex flex-wrap gap-1 justify-center mb-2">
                                  {Array.from({ length: example.result }, (_, i) => (
                                    <span key={i} className="text-lg">{i < example.first ? '🔴' : '🔵'}</span>
                                  ))}
                                </div>
                                <div className="text-xl font-bold text-green-800">{example.result}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })() : <div></div>
                  )}
                </div>
              </div>
            </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🌟 Autres exemples d'additions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-purple-400 bg-purple-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                    <div className="text-center">
                      <div className="flex justify-center space-x-2 mb-3">
                        <span className="text-2xl">{example.item1}</span>
                        <span className="text-2xl">{example.item2}</span>
                </div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {example.first} + {example.second} = {example.result}
                </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {example.description}
                </div>
                      <div className={`text-xs px-2 py-1 rounded-full mb-3 ${
                        example.strategy === 'complément à 10' ? 'bg-blue-100 text-blue-800' :
                        example.strategy === 'doubles' ? 'bg-pink-100 text-pink-800' :
                        example.strategy === 'ajouter à 10' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {example.strategy}
              </div>
                <button
                        onClick={isAnimationRunning ? undefined : (e) => {
                          e.stopPropagation(); // Empêche le clic de remonter au div parent
                          stopAllVocalsAndAnimations();
                          explainSpecificExample(index);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          isAnimationRunning 
                            ? 'bg-gray-400 text-gray-200' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                </button>
              </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stratégies d'addition */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Stratégies d'addition
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold mb-3 text-blue-800">Complément à 10</h3>
                  <p className="text-blue-600">
                    Pour 7 + 5 : prends 3 de 5 pour faire 10, puis ajoute les 2 qui restent !
                  </p>
                  <div className="mt-3 p-2 bg-blue-100 rounded">
                    <span className="text-sm font-bold text-blue-800">7 + 3 = 10, puis 10 + 2 = 12</span>
                  </div>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">💕</div>
                  <h3 className="text-xl font-bold mb-3 text-pink-800">Les doubles</h3>
                  <p className="text-pink-600">
                    6 + 6 = 12, 7 + 7 = 14, 8 + 8 = 16, 9 + 9 = 18
                  </p>
                  <div className="mt-3 p-2 bg-pink-100 rounded">
                    <span className="text-sm font-bold text-pink-800">Faciles à retenir !</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">➕</div>
                  <h3 className="text-xl font-bold mb-3 text-green-800">Ajouter à 10</h3>
                  <p className="text-green-600">
                    10 + 5 = 15, 10 + 8 = 18, 10 + 9 = 19
                  </p>
                  <div className="mt-3 p-2 bg-green-100 rounded">
                    <span className="text-sm font-bold text-green-800">Super facile !</span>
                  </div>
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
                  <div className="text-sm font-bold text-blue-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-3 h-3 mr-1" />
                    Reset
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Header exercices mobile - visible uniquement sur mobile */}
            <div className="bg-white rounded-xl p-3 shadow-lg mt-2 block sm:hidden">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-bold text-gray-900">
                  Exercice {currentExercise + 1}/{exercises.length}
                </h2>
                
                <div className="flex items-center space-x-2">
                  <div className="text-xs font-bold text-blue-600">
                    Score: {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-2 py-1 rounded-lg font-bold text-xs hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {/* Barre de progression mobile */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question principale */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
              {/* Question et bouton lecture */}
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
                  {exercises[currentExercise].question}
                </h3>
                
                {/* Badge du type */}
                <div className="flex justify-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    exercises[currentExercise].type === 'passage-dizaine' ? 'bg-blue-100 text-blue-800' :
                    exercises[currentExercise].type === 'double' ? 'bg-pink-100 text-pink-800' :
                    exercises[currentExercise].type === 'avec-10' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {exercises[currentExercise].type === 'passage-dizaine' ? '🎯 Passage de dizaine' :
                     exercises[currentExercise].type === 'double' ? '💕 Double' :
                     exercises[currentExercise].type === 'avec-10' ? '➕ Avec 10' :
                     '📝 Calcul'}
                  </span>
                </div>

                {/* Bouton écouter l'énoncé */}
                <button
                  id="listen-question-button"
                  onClick={startExerciseExplanation}
                  disabled={isPlayingEnonce}
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                    isPlayingEnonce 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : highlightedElement === 'listen-question-button'
                        ? 'bg-yellow-500 text-white ring-4 ring-yellow-300 animate-pulse scale-105'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  }`}
                >
                  {isPlayingEnonce ? '🎤 Écoute...' : '🎧 Écouter l\'énoncé'}
                </button>
              </div>

              {/* Zone de réponse */}
              <div 
                id="answer-zone"
                className={`max-w-md mx-auto mb-6 transition-all duration-300 ${
                  highlightedElement === 'answer-zone' ? 'ring-4 ring-blue-400 rounded-lg scale-105' : ''
                }`}
              >
                <div className="text-center mb-4">
                  <label className="block text-lg font-bold text-gray-800 mb-2">
                    Écris le résultat :
                  </label>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-xl font-bold">{exercises[currentExercise].firstNumber} + {exercises[currentExercise].secondNumber} = </span>
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="?"
                      disabled={isCorrect !== null}
                      className={`w-20 h-12 text-xl font-bold text-center border-2 rounded-lg ${
                        isCorrect === true 
                          ? 'border-green-500 bg-green-50 text-green-800' 
                          : isCorrect === false 
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-300 focus:border-blue-500 focus:outline-none'
                      }`}
                      min="0"
                      max="20"
                    />
                  </div>
                </div>

                {/* Bouton vérifier */}
                {isCorrect === null && (
                  <div className="text-center">
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={!userAnswer.trim() || isPlayingVocal}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                        !userAnswer.trim() || isPlayingVocal
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 shadow-lg'
                      }`}
                    >
                      ✅ Valider
                    </button>
                  </div>
                )}
              </div>

              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 sm:p-6 rounded-lg mb-6 text-center ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">
                          Excellent ! {exercises[currentExercise].firstNumber} + {exercises[currentExercise].secondNumber} = {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-lg sm:text-xl">
                          Pas tout à fait... La bonne réponse est : {exercises[currentExercise].correctAnswer}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Correction animée avec objets visuels */}
              {showAnimatedCorrection && correctionNumbers && (
                <div id="animated-correction" className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 sm:p-6 mb-4 sm:mb-8 border-2 border-blue-200">
                  <h4 className="text-base sm:text-2xl font-bold text-center text-blue-800 mb-3 sm:mb-6">
                    🎯 Regardons ensemble !
                  </h4>
                  
                  {/* Affichage des objets animés */}
                  <div className="text-center mb-3 sm:mb-6">
                    <div className="mb-3 sm:mb-4">
                      <div className="flex flex-wrap gap-1 sm:gap-2 justify-center items-center">
                        {animatedObjects.map((obj, index) => {
                          // Déterminer la couleur et l'état de l'objet selon l'étape
                          let objectDisplay = obj; // Par défaut l'objet tel que défini
                          let className = 'text-lg sm:text-3xl md:text-4xl transition-all duration-500 transform hover:scale-110';
                          
                          // Animation pour le comptage
                          if (correctionStep === 'counting' && countingIndex === index) {
                            className += ' animate-pulse scale-150 rotate-12 text-orange-400 drop-shadow-lg';
                          } else if (correctionStep === 'counting') {
                            className += ' opacity-60';
                          }
                          
                          return (
                            <span
                              key={index}
                              className={className}
                              style={{ 
                                animationDelay: `${index * 100}ms`
                              }}
                            >
                              {objectDisplay}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Étapes de la correction */}
                    {correctionStep === 'numbers' && (
                      <p className="text-sm sm:text-lg text-blue-700 font-semibold">
                        Voici {correctionNumbers.first} {correctionNumbers.objectEmoji1} et {correctionNumbers.second} {correctionNumbers.objectEmoji2}
                      </p>
                    )}
                    
                    {correctionStep === 'adding' && (
                      <p className="text-sm sm:text-lg text-blue-700 font-semibold">
                        Je rassemble tous les {correctionNumbers.objectName} !
                      </p>
                    )}
                    
                    {correctionStep === 'counting' && (
                      <p className="text-sm sm:text-lg text-blue-700 font-semibold">
                        Je compte un par un : 1, 2, 3...
                      </p>
                    )}
                    
                    {correctionStep === 'result' && (
                      <div className="space-y-2">
                        <p className="text-lg sm:text-xl text-green-700 font-bold">
                          En tout : {correctionNumbers.result} {correctionNumbers.objectName} !
                        </p>
                        <p className="text-sm sm:text-lg text-blue-700 font-semibold">
                          {correctionNumbers.first} + {correctionNumbers.second} = {correctionNumbers.result}
                        </p>
                      </div>
                    )}
                    
                    {correctionStep === 'complete' && (
                      <div className="bg-green-100 rounded-lg p-3 sm:p-4">
                        <p className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                          🎉 Parfait ! Tu as appris une nouvelle addition !
                        </p>
                        <p className="text-sm sm:text-base text-green-700">
                          {correctionNumbers.first} + {correctionNumbers.second} = {correctionNumbers.result}
                        </p>
                      </div>
                    )}
                  </div>
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
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Bravo ! Tu maîtrises les additions jusqu'à 20 !
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