'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, ArrowUpDown, Calculator, Copy, Split } from 'lucide-react';

export default function DoublesMotiesCP20() {
  const [selectedConcept, setSelectedConcept] = useState('double_5');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  
  // États vocaux
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  
  // États pour les animations de groupes
  const [showGroupAnimation, setShowGroupAnimation] = useState(false);
  const [group1Objects, setGroup1Objects] = useState<number>(0);
  const [group2Objects, setGroup2Objects] = useState<number>(0);
  const [animationStep, setAnimationStep] = useState<'none' | 'separating' | 'group1' | 'group2' | 'finished'>('none');
  
  // Refs pour les timers
  const welcomeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseInstructionGivenRef = useRef(false);
  const exerciseReadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const allTimersRef = useRef<NodeJS.Timeout[]>([]);

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
    const currentChoices = exercises[currentExercise]?.choices;
    if (currentChoices) {
      const shuffled = shuffleArray(currentChoices);
      setShuffledChoices(shuffled);
    }
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  // Sauvegarder les progrès dans localStorage
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

  // Concepts doubles et moitiés pour le cours
  const concepts = [
    // Doubles des nombres < 10
    { id: 'double_1', type: 'double', number: 1, result: 2, visual: '🔴 + 🔴 = 🔴🔴', explanation: 'Le double de 1, c\'est 1 + 1 = 2' },
    { id: 'double_2', type: 'double', number: 2, result: 4, visual: '🔴🔴 + 🔴🔴 = 🔴🔴🔴🔴', explanation: 'Le double de 2, c\'est 2 + 2 = 4' },
    { id: 'double_3', type: 'double', number: 3, result: 6, visual: '🔴🔴🔴 + 🔴🔴🔴 = 🔴🔴🔴��🔴', explanation: 'Le double de 3, c\'est 3 + 3 = 6' },
    { id: 'double_4', type: 'double', number: 4, result: 8, visual: '🔴🔴🔴🔴 + 🔴🔴🔴🔴 = 🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'Le double de 4, c\'est 4 + 4 = 8' },
    { id: 'double_5', type: 'double', number: 5, result: 10, visual: '🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴 = 📦', explanation: 'Le double de 5, c\'est 5 + 5 = 10' },
    { id: 'double_6', type: 'double', number: 6, result: 12, visual: '🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴 = 📦🔴🔴', explanation: 'Le double de 6, c\'est 6 + 6 = 12' },
    { id: 'double_7', type: 'double', number: 7, result: 14, visual: '🔴🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴🔴 = 📦🔴🔴🔴🔴', explanation: 'Le double de 7, c\'est 7 + 7 = 14' },
    { id: 'double_8', type: 'double', number: 8, result: 16, visual: '🔴🔴🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴🔴🔴 = 📦🔴🔴🔴🔴🔴🔴', explanation: 'Le double de 8, c\'est 8 + 8 = 16' },
    { id: 'double_9', type: 'double', number: 9, result: 18, visual: '🔴🔴🔴🔴🔴🔴🔴🔴🔴 + 🔴🔴🔴🔴🔴🔴🔴🔴🔴 = 📦🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'Le double de 9, c\'est 9 + 9 = 18' },
    
    // Moitiés des nombres pairs < 20
    { id: 'moitie_2', type: 'moitie', number: 2, result: 1, visual: '🔴🔴 ÷ 2 = 🔴', explanation: 'La moitié de 2, c\'est partager 2 objets en 2 groupes. Chaque groupe a 1 objet' },
    { id: 'moitie_4', type: 'moitie', number: 4, result: 2, visual: '🔴🔴🔴🔴 ÷ 2 = 🔴🔴', explanation: 'La moitié de 4, c\'est partager 4 objets en 2 groupes. Chaque groupe a 2 objets' },
    { id: 'moitie_6', type: 'moitie', number: 6, result: 3, visual: '🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴', explanation: 'La moitié de 6, c\'est partager 6 objets en 2 groupes. Chaque groupe a 3 objets' },
    { id: 'moitie_8', type: 'moitie', number: 8, result: 4, visual: '🔴🔴🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴', explanation: 'La moitié de 8, c\'est partager 8 objets en 2 groupes égaux. Chaque groupe a 4 objets' },
    { id: 'moitie_10', type: 'moitie', number: 10, result: 5, visual: '📦 ÷ 2 = 🔴🔴🔴🔴🔴', explanation: 'La moitié de 10, c\'est 10 ÷ 2 = 5' },
    { id: 'moitie_12', type: 'moitie', number: 12, result: 6, visual: '📦🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 12, c\'est 12 ÷ 2 = 6' },
    { id: 'moitie_14', type: 'moitie', number: 14, result: 7, visual: '📦🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 14, c\'est 14 ÷ 2 = 7' },
    { id: 'moitie_16', type: 'moitie', number: 16, result: 8, visual: '📦🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 16, c\'est 16 ÷ 2 = 8' },
    { id: 'moitie_18', type: 'moitie', number: 18, result: 9, visual: '📦🔴🔴🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴🔴🔴🔴🔴🔴', explanation: 'La moitié de 18, c\'est 18 ÷ 2 = 9' }
  ];

  // Exercices mixtes doubles/moitiés - positions des bonnes réponses variées
  const exercises = [
    // Doubles
    { question: 'Quel est le double de 3 ?', type: 'double', number: 3, correctAnswer: '6', choices: ['6', '5', '7'] },
    { question: 'Combien fait 4 + 4 ?', type: 'double', number: 4, correctAnswer: '8', choices: ['7', '8', '9'] },
    { question: 'Quel est le double de 6 ?', type: 'double', number: 6, correctAnswer: '12', choices: ['12', '10', '14'] },
    { question: 'Combien fait 2 + 2 ?', type: 'double', number: 2, correctAnswer: '4', choices: ['3', '4', '5'] },
    { question: 'Quel est le double de 8 ?', type: 'double', number: 8, correctAnswer: '16', choices: ['16', '15', '17'] },
    { question: 'Combien fait 5 + 5 ?', type: 'double', number: 5, correctAnswer: '10', choices: ['9', '11', '10'] },
    { question: 'Quel est le double de 7 ?', type: 'double', number: 7, correctAnswer: '14', choices: ['14', '13', '15'] },
    { question: 'Combien fait 9 + 9 ?', type: 'double', number: 9, correctAnswer: '18', choices: ['17', '18', '19'] },
    { question: 'Quel est le double de 1 ?', type: 'double', number: 1, correctAnswer: '2', choices: ['2', '1', '3'] },
    
    // Moitiés
    { question: 'Quelle est la moitié de 4 ?', type: 'moitie', number: 4, correctAnswer: '2', choices: ['2', '3', '1'] },
    { question: 'Combien fait 8 ÷ 2 ?', type: 'moitie', number: 8, correctAnswer: '4', choices: ['3', '4', '5'] },
    { question: 'Quelle est la moitié de 12 ?', type: 'moitie', number: 12, correctAnswer: '6', choices: ['6', '5', '7'] },
    { question: 'Combien fait 6 ÷ 2 ?', type: 'moitie', number: 6, correctAnswer: '3', choices: ['2', '3', '4'] },
    { question: 'Quelle est la moitié de 16 ?', type: 'moitie', number: 16, correctAnswer: '8', choices: ['8', '7', '9'] },
    { question: 'Combien fait 10 ÷ 2 ?', type: 'moitie', number: 10, correctAnswer: '5', choices: ['4', '6', '5'] },
    { question: 'Quelle est la moitié de 14 ?', type: 'moitie', number: 14, correctAnswer: '7', choices: ['7', '6', '8'] },
    { question: 'Combien fait 18 ÷ 2 ?', type: 'moitie', number: 18, correctAnswer: '9', choices: ['8', '9', '10'] },
    { question: 'Quelle est la moitié de 2 ?', type: 'moitie', number: 2, correctAnswer: '1', choices: ['1', '0', '2'] },
    
    // Exercices de reconnaissance (double ou moitié ?)
    { question: '3 + 3 = 6. Quel calcul as-tu fait ?', display: '3 + 3 = 6', correctAnswer: 'Le double de 3', choices: ['Le double de 3', 'La moitié de 6', 'Le triple de 2'] },
    { question: '12 ÷ 2 = 6. Quel calcul as-tu fait ?', display: '12 ÷ 2 = 6', correctAnswer: 'La moitié de 12', choices: ['Le double de 6', 'La moitié de 12', 'Le quart de 24'] }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Arrêter tout vocal précédent
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonctions vocales optimisées
  const createOptimizedUtterance = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    return utterance;
  };

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Fonction pour arrêter le vocal
  const stopVocal = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    // Réinitialiser les animations spécifiques
    setShowGroupAnimation(false);
    setAnimationStep('none');
    setGroup1Objects(0);
    setGroup2Objects(0);
  };

  const playAudioSequence = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Arrêter les vocaux précédents
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  // Explication interactive d'un concept spécifique avec animations fluides
  const explainConcept = async (conceptId: string) => {
    const concept = concepts.find(c => c.id === conceptId);
    if (!concept) return;
    
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      // Sélectionner le concept
      setSelectedConcept(conceptId);

      await wait(400);
      
      if (concept.type === 'double') {
        // EXPLICATION POUR LES DOUBLES
        await playAudioSequence(`Super ! Tu veux découvrir le double de ${concept.number} !`);
        await wait(800);
        
        await playAudioSequence("Un double, c'est quand on ajoute un nombre à lui-même !");
        await wait(1000);

        // Montrer l'opération
        await playAudioSequence(`Donc le double de ${concept.number}, c'est ${concept.number} plus ${concept.number} !`);
        setHighlightedElement('math-operation');
        await wait(2500);
        setHighlightedElement(null);
        await wait(300);
        
        // Visualisation
        await playAudioSequence("Regarde avec les objets visuels !");
        setHighlightedElement('visual-objects');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        
        // Résultat
        await playAudioSequence(`${concept.number} plus ${concept.number} égale ${concept.result} !`);
        setHighlightedElement('explanation-section');
        await wait(2500);
        setHighlightedElement(null);
        await wait(300);
        
        await playAudioSequence(`Donc le double de ${concept.number}, c'est ${concept.result} !`);
        
      } else {
        // EXPLICATION POUR LES MOITIÉS
        await playAudioSequence(`Génial ! Tu veux découvrir la moitié de ${concept.number} !`);
        await wait(800);
        
        await playAudioSequence("Une moitié, c'est quand on partage en deux groupes égaux !");
        await wait(1200);
        
        // Montrer l'opération
        await playAudioSequence(`Donc la moitié de ${concept.number}, c'est ${concept.number} divisé par 2 !`);
        setHighlightedElement('math-operation');
        await wait(2500);
        setHighlightedElement(null);
        await wait(300);
        
        // Animation de séparation
        await playAudioSequence(`Regarde, je vais partager ${concept.number} objets en 2 groupes !`);
        setHighlightedElement('visual-objects');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        
        // Animation visuelle
        setShowGroupAnimation(true);
        setAnimationStep('separating');
        await playAudioSequence("Regarde, je coupe en 2 groupes !");
        await wait(1500);
        
        const groupSize = concept.result;
        setAnimationStep('group1');
        setGroup1Objects(groupSize);
        await wait(800);
        setAnimationStep('group2');
        setGroup2Objects(groupSize);
        await wait(800);
        setAnimationStep('finished');
        await wait(300);
        
        // Résultat
        await playAudioSequence(`Chaque groupe a ${concept.result} objets !`);
        setHighlightedElement('explanation-section');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        
        await playAudioSequence(`Donc la moitié de ${concept.number}, c'est ${concept.result} !`);
      }
      
      await wait(500);
      await playAudioSequence("Tu peux essayer un autre exemple si tu veux !");
      
    } catch (error) {
      console.error('Erreur dans explainConcept:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Nouvelle explication fluide et immersive du chapitre
  const explainChapterGoal = async () => {
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      setHasStarted(true);
      
      // Effacer les timers de rappel s'ils existent
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);

      await wait(500);

      // 1. Introduction chaleureuse
      await playAudioSequence("Salut ! Bienvenue dans l'univers magique des doubles et des moitiés !");
      await wait(1200);
      
      // 2. Présentation du concept général
      await playAudioSequence("Aujourd'hui, tu vas découvrir deux supers pouvoirs mathématiques !");
      await wait(1000);
      
      // 3. Explication des doubles
      await playAudioSequence("Le premier pouvoir : les doubles ! C'est quand on ajoute un nombre à lui-même !");
      await wait(1200);
      
      // 4. Explication des moitiés  
      await playAudioSequence("Le deuxième pouvoir : les moitiés ! C'est quand on partage en deux groupes égaux !");
      await wait(1200);
      
      // 5. Sélection d'un exemple concret - Double
      setSelectedConcept('double_5');
      await playAudioSequence("Commençons par un exemple : le double de 5 !");
      setHighlightedElement('concept-selector');
      await wait(2000);
      setHighlightedElement(null);
      await wait(400);
      
      // 6. Démonstration visuelle du double
      await playAudioSequence("Regarde bien cette démonstration !");
      setHighlightedElement('visual-display');
      await wait(1800);
      setHighlightedElement(null);
      await wait(300);
      
      // 7. L'opération mathématique
      await playAudioSequence("Voici l'opération : 5 plus 5 !");
      setHighlightedElement('math-operation');
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);
      
      // 8. Visualisation avec objets
      await playAudioSequence("Et voici avec des objets visuels : 5 objets plus 5 objets !");
      setHighlightedElement('visual-objects');
      await wait(2500);
      setHighlightedElement(null);
      await wait(400);
      
      // 9. Résultat du double
      await playAudioSequence("5 plus 5 égale 10 ! C'est le double de 5 !");
      setHighlightedElement('explanation-section');
      await wait(2500);
      setHighlightedElement(null);
      await wait(500);
      
      // 10. Démonstration d'une moitié
      setSelectedConcept('moitie_8');
      await playAudioSequence("Maintenant, essayons une moitié : la moitié de 8 !");
      setHighlightedElement('concept-selector');
      await wait(2200);
      setHighlightedElement(null);
      await wait(400);
      
      // 11. Animation de la moitié avec séparation
      await playAudioSequence("Regarde, je vais partager 8 objets en 2 groupes égaux !");
      setHighlightedElement('visual-objects');
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);
      
      setShowGroupAnimation(true);
      setAnimationStep('separating');
      await playAudioSequence("Regarde, je coupe en 2 groupes !");
      await wait(1500);
      
      setAnimationStep('group1');
      setGroup1Objects(4);
      await wait(800);
      setAnimationStep('group2');
      setGroup2Objects(4);
      await wait(800);
      setAnimationStep('finished');
      setHighlightedElement(null);
      await wait(300);
      
      // 12. Résultat de la moitié
      await playAudioSequence("Chaque groupe a 4 objets ! Donc la moitié de 8, c'est 4 !");
      setHighlightedElement('explanation-section');
      await wait(2500);
      setHighlightedElement(null);
      await wait(500);
      
      // 13. Exploration libre
      await playAudioSequence("Maintenant, explore tous les exemples que tu veux !");
      setHighlightedElement('concept-selector');
      await wait(2000);
      setHighlightedElement(null);
      await wait(400);
      
      // 14. Encouragement final
      await playAudioSequence("Clique sur n'importe quel concept pour voir sa magie en action !");
      
    } catch (error) {
      console.error('Erreur dans explainChapterGoal:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };



  // Introduction équilibrée aux exercices
  const explainExercisesOnce = async () => {
    if (exerciseInstructionGivenRef.current) return;
    
    try {
      speechSynthesis.cancel();
      exerciseInstructionGivenRef.current = true;
      setExerciseInstructionGiven(true);
      setIsPlayingVocal(true);
      
      await wait(300);
      
      await playAudioSequence("Parfait ! Maintenant, place aux exercices pratiques !");
      await wait(1000);
      
      await playAudioSequence("Tu vas voir des questions sur les doubles et les moitiés. Pour le double, tu additionnes le nombre avec lui-même. Pour la moitié, tu partages en deux parts égales.");
      await wait(1200);
      
      await playAudioSequence("Clique sur la bonne réponse. Si c'est correct, on passe au suivant. Si tu te trompes, tu pourras réessayer après la correction.");
      await wait(1000);
      
      await playAudioSequence("Prêt ? C'est parti !");
      
    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Explication pédagogique complète d'une question d'exercice
  const explainExerciseQuestion = async (exerciseIndex?: number) => {
    const index = exerciseIndex !== undefined ? exerciseIndex : currentExercise;
    const exercise = exercises[index];
    if (!exercise) return;
    
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(500);
      
      // 1. Introduction personnalisée
      await playAudioSequence(`Super ! Concentrons-nous sur cet exercice numéro ${index + 1} !`);
      await wait(1000);
      
      // 2. Lecture expressive de la question
      await playAudioSequence("Voici la question à résoudre :");
      await wait(600);
      await playAudioSequence(exercise.question);
      await wait(1200);
      
      // 3. Analyse détaillée selon le type
      if (exercise.type === 'double') {
        await playAudioSequence(`Ah ! C'est un exercice sur les doubles ! Tu cherches le double de ${exercise.number}.`);
        await wait(1200);
        
        await playAudioSequence("Réfléchissons ensemble : qu'est-ce qu'un double ?");
        await wait(1000);
        
        await playAudioSequence(`Un double, c'est comme si tu avais ${exercise.number} objets, et qu'on t'en donnait encore ${exercise.number} !`);
        await wait(1500);
        
        await playAudioSequence(`Donc tu calcules : ${exercise.number} plus ${exercise.number} !`);
        await wait(1200);
        
        await playAudioSequence("Tu peux aussi compter sur tes doigts ou imaginer des objets pour t'aider !");
        await wait(1000);
        
        // Petit exemple concret
        if (exercise.number <= 5) {
          await playAudioSequence(`Par exemple, imagine ${exercise.number} pommes, puis encore ${exercise.number} pommes. Combien en as-tu au total ?`);
          await wait(1500);
        }
        
      } else if (exercise.type === 'moitie') {
        await playAudioSequence(`Excellent ! C'est un exercice sur les moitiés ! Tu cherches la moitié de ${exercise.number}.`);
        await wait(1200);
        
        await playAudioSequence("Réfléchissons ensemble : qu'est-ce qu'une moitié ?");
        await wait(1000);
        
        await playAudioSequence(`Une moitié, c'est partager ${exercise.number} objets en deux groupes exactement égaux !`);
        await wait(1500);
        
        await playAudioSequence(`Tu peux aussi dire : ${exercise.number} divisé par 2 !`);
        await wait(1200);
        
        await playAudioSequence("Imagine que tu partages équitablement avec un copain !");
        await wait(1000);
        
        // Petit exemple concret
        if (exercise.number <= 10) {
          await playAudioSequence(`Par exemple, si tu as ${exercise.number} bonbons à partager en deux, combien chacun en aura-t-il ?`);
          await wait(1500);
        }
        
      } else {
        // Type reconnaissance ou mixte
        await playAudioSequence("Intéressant ! Cet exercice demande de la réflexion !");
        await wait(1000);
        
        await playAudioSequence("Regarde bien l'opération ou la situation présentée !");
        await wait(1200);
        
        await playAudioSequence("Demande-toi : est-ce qu'on additionne ? Alors c'est un double !");
        await wait(1200);
        
        await playAudioSequence("Ou est-ce qu'on partage en deux ? Alors c'est une moitié !");
        await wait(1200);
      }
      
      // 4. Guide pour les choix de réponse
      await playAudioSequence("Maintenant, observe bien les trois choix de réponse !");
      await wait(1000);
      
      await playAudioSequence("Prends ton temps, réfléchis à ta stratégie, puis clique sur ta réponse !");
      await wait(1200);
      
      await playAudioSequence("Je suis sûr que tu vas trouver la bonne solution !");
      
    } catch (error) {
      console.error('Erreur dans explainExerciseQuestion:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Félicitations élaborées et pédagogiques pour une bonne réponse
  const explainCorrectAnswer = async () => {
    const exercise = exercises[currentExercise];
    if (!exercise) return;
    
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(700);
      
      // Félicitations variées et enthousiastes
      const celebrations = [
        "Fantastique ! Tu es un vrai champion des mathématiques !",
        "Extraordinaire ! Tu as visé dans le mille !",
        "Magnifique ! Quelle brillante réponse !",
        "Sensationnel ! Tu maîtrises parfaitement !",
        "Formidable ! Tu as une logique parfaite !",
        "Éblouissant ! Tu impressionnes tout le monde !"
      ];
      
      const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
      await playAudioSequence(randomCelebration);
      await wait(1000);
      
      // Confirmation spécifique et détaillée
      if (exercise.type === 'double') {
        await playAudioSequence(`Absolument ! Le double de ${exercise.number}, c'est effectivement ${exercise.correctAnswer} !`);
        await wait(1000);
        
        await playAudioSequence(`Tu as parfaitement calculé : ${exercise.number} plus ${exercise.number} égale ${exercise.correctAnswer} !`);
        await wait(1200);
        
        // Renforcement pédagogique
        await playAudioSequence("Tu comprends bien le principe du double : additionner un nombre avec lui-même !");
        await wait(1200);
        
        // Petit conseil ou astuce
        if (exercise.number <= 5) {
          await playAudioSequence(`Astuce : pour mémoriser, pense que ${exercise.number} + ${exercise.number} = ${exercise.correctAnswer} !`);
          await wait(1000);
        }
        
      } else if (exercise.type === 'moitie') {
        await playAudioSequence(`Exactement ! La moitié de ${exercise.number}, c'est bien ${exercise.correctAnswer} !`);
        await wait(1000);
        
        await playAudioSequence(`Tu as parfaitement partagé : ${exercise.number} divisé par 2 égale ${exercise.correctAnswer} !`);
        await wait(1200);
        
        // Renforcement pédagogique
        await playAudioSequence("Tu maîtrises parfaitement le partage équitable en deux groupes !");
        await wait(1200);
        
        // Vérification inverse pour consolider
        await playAudioSequence(`D'ailleurs, si tu vérifies : ${exercise.correctAnswer} plus ${exercise.correctAnswer} redonne bien ${exercise.number} !`);
        await wait(1200);
        
      } else {
        // Pour les exercices de reconnaissance
        await playAudioSequence(`Parfait ! Tu as correctement identifié que la réponse est ${exercise.correctAnswer} !`);
        await wait(1000);
        
        await playAudioSequence("Tu analyses très bien les différents types de calculs !");
        await wait(1000);
      }
      
      // Encouragement personnalisé selon le numéro d'exercice
      const exerciseNumber = currentExercise + 1;
      if (exerciseNumber === 1) {
        await playAudioSequence("Excellent départ ! Tu commences très fort !");
             } else if (exerciseNumber <= 5) {
        await playAudioSequence("Tu es sur une excellente lancée ! Continue ainsi !");
      } else if (exerciseNumber <= 10) {
        await playAudioSequence("Tu es déjà à mi-parcours et tu gères parfaitement !");
      } else if (exerciseNumber <= 15) {
        await playAudioSequence("Impressionnant ! Tu approches de la ligne d'arrivée avec brio !");
      } else {
        await playAudioSequence("Génial ! Tu es presque au bout, quel parcours remarquable !");
      }
      
      await wait(800);
      
      // Message de motivation final
      const motivations = [
        "Tu prouves que tu es vraiment doué pour les mathématiques !",
        "Tes parents seraient fiers de te voir calculer si bien !",
        "Tu développes une excellente logique mathématique !",
        "Continue, tu es en train de devenir un expert !",
        "Quelle progression fantastique tu réalises !"
      ];
      
      const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
      await playAudioSequence(randomMotivation);
      
    } catch (error) {
      console.error('Erreur dans explainCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Aide bienveillante et pédagogique détaillée pour une mauvaise réponse
  const explainWrongAnswer = async (userAnswer: string) => {
    const exercise = exercises[currentExercise];
    if (!exercise) return;
    
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(600);
      
      // Messages d'encouragement bienveillants
      const encouragements = [
        "Oups ! Ce n'est pas grave du tout, on apprend tous en faisant des erreurs !",
        "Presque ! Les erreurs nous aident à mieux comprendre !",
        "Pas de souci ! Même les champions se trompent parfois !",
        "C'est comme ça qu'on progresse ! Regardons ensemble la solution !",
        "Ne t'inquiète pas ! L'important c'est d'essayer et d'apprendre !"
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      await playAudioSequence(randomEncouragement);
      await wait(1200);
      
      // Analyse de la réponse donnée
      await playAudioSequence(`Tu as choisi ${userAnswer}. Je comprends pourquoi tu as pensé à cette réponse !`);
      await wait(1200);
      
      await playAudioSequence(`Mais en fait, la bonne réponse est ${exercise.correctAnswer}. Laisse-moi t'expliquer pourquoi !`);
      await wait(1200);
      
      // Explication pédagogique détaillée
      if (exercise.type === 'double') {
        await playAudioSequence(`Pour trouver le double de ${exercise.number}, voici la méthode :`);
        await wait(1000);
        
        await playAudioSequence(`Un double, c'est additionner le nombre avec lui-même !`);
        await wait(1200);
        
        await playAudioSequence(`Donc : ${exercise.number} plus ${exercise.number} égale ${exercise.correctAnswer} !`);
        await wait(1500);
        
        // Technique de mémorisation
        await playAudioSequence(`Pour t'en souvenir, imagine ${exercise.number} objets, puis encore ${exercise.number} objets identiques !`);
        await wait(1500);
        
        // Vérification de la compréhension
        await playAudioSequence(`Au total, tu as ${exercise.correctAnswer} objets ! C'est ça le double de ${exercise.number} !`);
        await wait(1200);
        
        // Petit truc mnémotechnique si pertinent
        if (exercise.number <= 5) {
          await playAudioSequence(`Tu peux compter sur tes doigts : ${exercise.number} doigts, plus encore ${exercise.number} doigts !`);
          await wait(1200);
        }
        
      } else if (exercise.type === 'moitie') {
        await playAudioSequence(`Pour trouver la moitié de ${exercise.number}, voici comment faire :`);
        await wait(1000);
        
        await playAudioSequence(`Une moitié, c'est partager en deux groupes exactement égaux !`);
        await wait(1200);
        
        await playAudioSequence(`Imagine ${exercise.number} objets que tu partages équitablement entre toi et un copain !`);
        await wait(1500);
        
        await playAudioSequence(`Chacun de vous deux aura ${exercise.correctAnswer} objets !`);
        await wait(1200);
        
        await playAudioSequence(`C'est pourquoi ${exercise.number} divisé par 2 égale ${exercise.correctAnswer} !`);
        await wait(1200);
        
        // Vérification inverse
        await playAudioSequence(`Pour vérifier : ${exercise.correctAnswer} plus ${exercise.correctAnswer} redonne bien ${exercise.number} !`);
        await wait(1200);
        
      } else {
        // Pour les exercices de reconnaissance
        await playAudioSequence(`Pour ce type d'exercice, il faut bien analyser l'opération !`);
        await wait(1000);
        
        await playAudioSequence("Regarde les signes : plus c'est un double, divisé par 2 c'est une moitié !");
        await wait(1200);
        
        await playAudioSequence(`Dans ce cas, la réponse était ${exercise.correctAnswer} !`);
        await wait(1000);
      }
      
      // Message de confiance et de motivation
      await playAudioSequence("Maintenant que tu comprends bien, je suis sûr que tu réussiras le prochain !");
      await wait(1200);
      
      // Petit conseil stratégique
      const tips = [
        "Conseil : prends ton temps pour bien lire la question !",
        "Astuce : imagine des objets concrets pour t'aider !",
        "Truc : vérifie toujours ta réponse en sens inverse !",
        "Conseil : n'hésite pas à compter sur tes doigts !",
        "Astuce : relis la question si tu hésites !"
      ];
      
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      await playAudioSequence(randomTip);
      await wait(1000);
      
      await playAudioSequence("Allez, clique sur Suivant et montre-moi que tu as tout compris !");
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Encouragements dynamiques et motivants pour chaque nouvel exercice
  const encourageNextExercise = async (exerciseNumber: number) => {
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(900);
      
      // Messages d'encouragement selon la progression
      let encouragements: string[] = [];
      let additionalMessage = "";
      
      if (exerciseNumber <= 3) {
        // Début d'aventure
        encouragements = [
          `Parfait ! En route pour l'exercice ${exerciseNumber} !`,
          `Excellent démarrage ! Voici l'exercice ${exerciseNumber} !`,
          `Tu es lancé ! Exercice ${exerciseNumber}, let's go !`,
          `Super début ! Prêt pour l'exercice ${exerciseNumber} ?`
        ];
        additionalMessage = "Tu prends confiance, c'est génial !";
        
      } else if (exerciseNumber <= 6) {
        // Première partie
        encouragements = [
          `Fantastique ! Tu arrives à l'exercice ${exerciseNumber} !`,
          `Quel beau parcours ! Exercice ${exerciseNumber}, en avant !`,
          `Tu gères parfaitement ! Voici l'exercice ${exerciseNumber} !`,
          `Impressionnant ! En route pour l'exercice ${exerciseNumber} !`
        ];
        additionalMessage = "Tu maîtrises de mieux en mieux !";
        
      } else if (exerciseNumber <= 10) {
        // Mi-parcours
        encouragements = [
          `Incroyable ! Déjà l'exercice ${exerciseNumber} !`,
          `Tu es au top ! Voici l'exercice ${exerciseNumber} !`,
          `Quelle progression ! Exercice ${exerciseNumber}, tu es prêt !`,
          `Magnifique ! En route vers l'exercice ${exerciseNumber} !`
        ];
        additionalMessage = "Tu es déjà à mi-chemin, bravo !";
        
      } else if (exerciseNumber <= 15) {
        // Deuxième partie
        encouragements = [
          `Extraordinaire ! L'exercice ${exerciseNumber} t'attend !`,
          `Tu es un champion ! Voici l'exercice ${exerciseNumber} !`,
          `Quel talent ! Exercice ${exerciseNumber}, c'est parti !`,
          `Formidable ! En route pour l'exercice ${exerciseNumber} !`
        ];
        additionalMessage = "Plus que quelques exercices, tu y es presque !";
        
      } else {
        // Sprint final
        encouragements = [
          `Sensationnel ! Exercice ${exerciseNumber}, sprint final !`,
          `Tu es presque au bout ! Voici l'exercice ${exerciseNumber} !`,
          `Incroyable parcours ! Exercice ${exerciseNumber}, dernière ligne droite !`,
          `Champion ! L'exercice ${exerciseNumber} arrive !`
        ];
        additionalMessage = "Le finish approche, tu vas y arriver !";
      }
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      await playAudioSequence(randomEncouragement);
      await wait(1000);
      
      if (additionalMessage) {
        await playAudioSequence(additionalMessage);
        await wait(800);
      }
      
      // Message spécial pour certains paliers
      if (exerciseNumber === 5) {
        await playAudioSequence("Déjà 5 exercices ! Tu montres un super niveau !");
      } else if (exerciseNumber === 10) {
        await playAudioSequence("Wahou ! 10 exercices ! Tu es à mi-parcours, quelle performance !");
      } else if (exerciseNumber === 15) {
        await playAudioSequence("15 exercices ! Tu es vraiment doué, plus que 5 à faire !");
      } else if (exerciseNumber === 20) {
        await playAudioSequence("Le dernier exercice ! Tu vas bientôt finir en beauté !");
      }
      
      // Petite motivation finale aléatoire
      const finalMotivations = [
        "Tu peux être fier de toi !",
        "Continue, tu es sur la bonne voie !",
        "Tes efforts paient vraiment !",
        "Tu développes des super compétences !",
        "Quelle belle concentration !"
      ];
      
      // 1 chance sur 3 d'avoir un message de motivation supplémentaire
      if (Math.random() < 0.33) {
        const randomMotivation = finalMotivations[Math.floor(Math.random() * finalMotivations.length)];
        await wait(500);
        await playAudioSequence(randomMotivation);
      }
      
    } catch (error) {
      console.error('Erreur dans encourageNextExercise:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Effect pour jouer automatiquement le vocal de bienvenue (une seule fois)
  useEffect(() => {
    if (!showExercises) {
      welcomeTimerRef.current = setTimeout(() => {
        speakText("Salut ! Clique sur le bouton violet pour découvrir la magie des doubles et des moitiés !");
      }, 1000);
      
      if (welcomeTimerRef.current) {
        allTimersRef.current.push(welcomeTimerRef.current);
      }
    }
    
    return () => {
      if (welcomeTimerRef.current) {
        clearTimeout(welcomeTimerRef.current);
        // Retirer le timer de la liste des timers trackés
        allTimersRef.current = allTimersRef.current.filter(t => t !== welcomeTimerRef.current);
        welcomeTimerRef.current = null;
      }
    };
  }, [showExercises, hasStarted]);

  // Effect pour jouer automatiquement la consigne des exercices (une seule fois)
  useEffect(() => {
    if (showExercises && !exerciseInstructionGivenRef.current) {
      const timer = setTimeout(() => {
        explainExercisesOnce();
      }, 800);
      allTimersRef.current.push(timer);
      
      return () => {
        clearTimeout(timer);
        // Retirer le timer de la liste des timers trackés
        allTimersRef.current = allTimersRef.current.filter(t => t !== timer);
      };
    }
  }, [showExercises]);

  // Effect pour réinitialiser l'animation quand on change de concept
  useEffect(() => {
    setShowGroupAnimation(false);
    setAnimationStep('none');
    setGroup1Objects(0);
    setGroup2Objects(0);
  }, [selectedConcept]);

  // Effect pour arrêter les vocaux quand on sort de l'onglet exercices
  useEffect(() => {
    if (showExercises) {
      // Quand on arrive sur les exercices, s'assurer que tout est propre
      stopVocal();
    } else {
      // Quand on quitte les exercices pour le cours
      stopVocal();
      exerciseInstructionGivenRef.current = false;
    }
    
    return () => {
      // Cleanup quand on change d'onglet (cours ↔ exercices)
      stopVocal();
    };
  }, [showExercises]);

  // Effect pour gérer la visibilité de la page et les sorties
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // La page n'est plus visible (onglet changé, fenêtre minimisée, etc.)
        stopVocal();
      }
    };

    const handleBeforeUnload = () => {
      // L'utilisateur quitte la page
      stopVocal();
    };

    const handlePageHide = () => {
      // Page cachée (plus fiable que beforeunload)
      stopVocal();
    };

    // Ajouter les listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      stopVocal();
    };
  }, []);

  // Effect pour réinitialiser quand on revient sur la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && showExercises) {
        // La page redevient visible et on est sur les exercices
        // Réinitialiser les états si nécessaire
        exerciseInstructionGivenRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showExercises]);

  const handleAnswerClick = (answer: string) => {
    stopVocal();
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise]?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
      
      // Passage automatique au suivant après une bonne réponse (sans vocal)
      const nextTimer = setTimeout(() => {
        nextExercise();
      }, 1500);
      allTimersRef.current.push(nextTimer);
    }
  };

  // Fonction pour lire l'énoncé d'un exercice spécifique
  const readExerciseStatement = (exerciseIndex?: number) => {
    const index = exerciseIndex !== undefined ? exerciseIndex : currentExercise;
    const exerciseData = exercises[index];
    if (exerciseData) {
      // Arrêter le timer précédent s'il existe
      if (exerciseReadingTimerRef.current) {
        clearTimeout(exerciseReadingTimerRef.current);
      }
      
      exerciseReadingTimerRef.current = setTimeout(() => {
        speakText(exerciseData.question);
        exerciseReadingTimerRef.current = null;
      }, 1000);
    }
  };

  const nextExercise = () => {
    stopVocal();
    if (currentExercise < exercises.length - 1) {
      const nextIndex = currentExercise + 1;
      setCurrentExercise(nextIndex);
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
    exerciseInstructionGivenRef.current = false;
    setHasStarted(false);
  };

  // Fonction pour rendre l'animation des groupes
  const renderGroupAnimation = (totalObjects: number) => {
    if (!showGroupAnimation) return null;
    
    const halfObjects = Math.floor(totalObjects / 2);
    
    return (
      <div className="bg-white rounded-lg p-6 mb-4 border-2 border-blue-300">
        <h4 className="text-lg font-bold mb-4 text-center text-blue-800">
          🎬 Animation : Je sépare en 2 groupes !
        </h4>
        
        {animationStep === 'separating' && (
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-3">
              Je vais séparer ces {totalObjects} objets...
            </div>
            <div className="text-2xl animate-pulse text-gray-800">
              {'🟡'.repeat(Math.min(totalObjects, 10))}
              {totalObjects > 10 && (
                <div>{'🟡'.repeat(totalObjects - 10)}</div>
              )}
            </div>
            <div className="text-2xl mt-2 animate-bounce text-red-500">
              ✂️ Coupure magique ! ✂️
            </div>
          </div>
        )}
        
        {(animationStep === 'group1' || animationStep === 'group2' || animationStep === 'finished') && (
          <div className="grid grid-cols-2 gap-6">
            {/* Groupe 1 */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Groupe 1</div>
              <div className={`bg-green-100 rounded-lg p-4 border-2 transition-all duration-1000 ${
                animationStep === 'group1' || animationStep === 'finished' 
                  ? 'border-green-400 scale-105 animate-pulse' 
                  : 'border-gray-200'
              }`}>
                <div className="text-xl mb-2">
                  {animationStep === 'group1' || animationStep === 'finished' 
                    ? '🔴'.repeat(group1Objects)
                    : '⚪'.repeat(halfObjects)
                  }
                </div>
                <div className={`text-lg font-bold transition-all duration-500 ${
                  animationStep === 'group1' || animationStep === 'finished'
                    ? 'text-green-800 scale-110'
                    : 'text-gray-400'
                }`}>
                  {animationStep === 'group1' || animationStep === 'finished' ? group1Objects : '?'}
                </div>
              </div>
            </div>
            
            {/* Groupe 2 */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Groupe 2</div>
              <div className={`bg-blue-100 rounded-lg p-4 border-2 transition-all duration-1000 ${
                animationStep === 'group2' || animationStep === 'finished' 
                  ? 'border-blue-400 scale-105 animate-pulse' 
                  : 'border-gray-200'
              }`}>
                <div className="text-xl mb-2">
                  {animationStep === 'group2' || animationStep === 'finished' 
                    ? '🔵'.repeat(group2Objects)
                    : '⚪'.repeat(halfObjects)
                  }
                </div>
                <div className={`text-lg font-bold transition-all duration-500 ${
                  animationStep === 'group2' || animationStep === 'finished'
                    ? 'text-blue-800 scale-110'
                    : 'text-gray-400'
                }`}>
                  {animationStep === 'group2' || animationStep === 'finished' ? group2Objects : '?'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {animationStep === 'finished' && (
          <div className="text-center mt-4">
            <div className="bg-yellow-200 px-4 py-2 rounded-full inline-block animate-bounce">
              <span className="font-bold text-yellow-800">
                ✨ Parfait ! {group1Objects} + {group2Objects} = {totalObjects} ✨
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4"
            onClick={stopVocal}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🎯 Doubles et moitiés
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Apprends les doubles des nombres &lt; 10 et les moitiés des nombres pairs &lt; 20 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopVocal();
                setShowExercises(false);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                !showExercises 
                  ? 'bg-yellow-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                stopVocal();
                setShowExercises(true);
                // Lire le premier énoncé après passage aux exercices
                const readTimer = setTimeout(() => {
                  readExerciseStatement(0);
                }, 1500);
                allTimersRef.current.push(readTimer);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-yellow-500 text-white shadow-md' 
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
            {/* Bouton d'explication vocal principal */}
            <div className="text-center mb-6">
              <button
                onClick={explainChapterGoal}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                  !hasStarted ? 'animate-bounce' : ''
                } ${
                  isPlayingVocal ? 'animate-pulse cursor-not-allowed opacity-75' : 'hover:from-purple-600 hover:to-pink-600'
                }`}
                style={{
                  animationDuration: !hasStarted ? '2s' : 'none',
                  animationIterationCount: !hasStarted ? 'infinite' : 'none'
                }}
              >
                <Volume2 className="inline w-6 h-6 mr-3" />
                ▶️ COMMENCER !
              </button>
            </div>

            {/* Sélecteur de concept */}
            <div 
              id="concept-selector"
              className={`bg-white rounded-xl p-3 sm:p-6 shadow-lg transition-all duration-500 ${
                highlightedElement === 'concept-selector' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis un concept à découvrir
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {concepts.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => explainConcept(concept.id)}
                    disabled={isPlayingVocal}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                      selectedConcept === concept.id
                        ? 'bg-yellow-500 text-white shadow-lg scale-105'
                        : isPlayingVocal 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102 cursor-pointer'
                    }`}
                  >
                    {concept.type === 'double' ? `2×${concept.number}` : `${concept.number}÷2`}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du concept sélectionné */}
            <div 
              id="visual-display"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center transition-all duration-500 ${
                highlightedElement === 'visual-display' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Découvrons ce calcul
              </h3>
              
              {(() => {
                const selected = concepts.find(c => c.id === selectedConcept);
                if (!selected) return null;
                
                return (
                  <div className="bg-yellow-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                    {/* Grande opération */}
                    <div 
                      id="math-operation"
                      className={`text-3xl sm:text-5xl lg:text-7xl font-bold text-yellow-600 mb-3 sm:mb-6 transition-all duration-500 ${
                        highlightedElement === 'math-operation' ? 'bg-white ring-4 ring-blue-400 shadow-2xl scale-110 rounded-lg p-4' : ''
                      }`}
                    >
                      {selected.type === 'double' ? (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                          <span>{selected.number}</span>
                          <span className="text-blue-600">+</span>
                          <span>{selected.number}</span>
                          <span className="text-gray-400">=</span>
                          <span className="text-green-600">{selected.result}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                          <span>{selected.number}</span>
                          <span className="text-red-600">÷</span>
                          <span>2</span>
                          <span className="text-gray-400">=</span>
                          <span className="text-green-600">{selected.result}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Représentation visuelle */}
                    <div 
                      id="visual-objects"
                      className={`bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6 transition-all duration-500 ${
                        highlightedElement === 'visual-objects' ? 'bg-blue-50 ring-4 ring-blue-400 shadow-2xl scale-105' : ''
                      }`}
                    >
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                        👀 Regarde avec des objets :
                      </h4>
                      <div className="text-base sm:text-xl lg:text-2xl py-2 sm:py-4 leading-relaxed break-all text-gray-800 font-semibold">
                        {selected.visual}
                      </div>
                    </div>

                    {/* Animation des groupes pour les moitiés */}
                    {selected.type === 'moitie' && renderGroupAnimation(selected.number)}

                    {/* Explication */}
                    <div 
                      id="explanation-section"
                      className={`bg-green-50 rounded-lg p-3 sm:p-6 transition-all duration-500 ${
                        highlightedElement === 'explanation-section' ? 'bg-green-100 ring-4 ring-green-400 shadow-2xl scale-105' : ''
                      }`}
                    >
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-green-800">
                        💡 Explication :
                      </h4>
                      <p className="text-base sm:text-xl font-bold text-green-900 mb-2 sm:mb-4">
                        {selected.explanation}
                      </p>
                      <button
                        onClick={() => {
                          stopVocal();
                          speakText(selected.explanation);
                        }}
                        className="bg-green-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold hover:bg-green-600 transition-colors text-sm sm:text-base"
                      >
                        <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Écouter
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tables de référence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Table des doubles */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">
                  ➕ Table des doubles
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {concepts.filter(c => c.type === 'double').map((concept) => (
                    <div key={concept.id} className="bg-blue-50 rounded-lg p-2 sm:p-3 flex justify-between items-center">
                      <span className="font-bold text-sm sm:text-base text-gray-800">{concept.number} + {concept.number}</span>
                      <span className="text-blue-600 font-bold text-sm sm:text-base">{concept.result}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table des moitiés */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">
                  ➗ Table des moitiés
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {concepts.filter(c => c.type === 'moitie').map((concept) => (
                    <div key={concept.id} className="bg-red-50 rounded-lg p-2 sm:p-3 flex justify-between items-center">
                      <span className="font-bold text-sm sm:text-base text-gray-800">{concept.number} ÷ 2</span>
                      <span className="text-red-600 font-bold text-sm sm:text-base">{concept.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• <strong>Double :</strong> c'est ajouter le nombre à lui-même (3 + 3)</li>
                <li>• <strong>Moitié :</strong> c'est partager en 2 groupes égaux (comme 8 objets → 2 groupes de 4)</li>
                <li>• Double et moitié sont inverses : double de 4 = 8, moitié de 8 = 4</li>
                <li>• Apprends par cœur : 5 + 5 = 10, et la moitié de 10 = 5 !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Bouton de démonstration "Suivant" avec effet magique - TEMPORAIRE pour l'explication */}
            {highlightedElement === 'demo-next-button' && (
              <div className="flex justify-center">
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl ring-4 ring-yellow-400 animate-bounce scale-110 transform transition-all duration-1000 ease-out opacity-100">
                  ✨ Suivant → ✨
                </div>
              </div>
            )}

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
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-yellow-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-yellow-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              {(() => {
                const currentEx = exercises[currentExercise];
                if (!currentEx) return null;
                
                return (
                  <>
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                      {currentEx.question}
                    </h3>
                    
                    {/* Affichage spécial si défini */}
                    {currentEx.display ? (
                      <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 sm:mb-8 text-gray-800 font-bold">
                        {currentEx.display}
                      </div>
                    ) : (
                      <>
                        {/* Affichage de la question avec icône */}
                        <div className={`rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8 ${
                          currentEx.type === 'double' ? 'bg-yellow-50' : 'bg-green-50'
                        }`}>
                          <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                            {currentEx.type === 'double' ? (
                              <Copy className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-600 mr-2 sm:mr-3" />
                            ) : (
                              <Split className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-600 mr-2 sm:mr-3" />
                            )}
                            <span className={`text-sm sm:text-base md:text-lg font-semibold ${
                              currentEx.type === 'double' ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {currentEx.type === 'double' ? 'Calcul de double' : 'Calcul de moitié'}
                            </span>
                          </div>
                          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-yellow-600 mb-2 sm:mb-3 md:mb-4">
                            {currentEx.type === 'double' ? (
                              <>{currentEx.number} + {currentEx.number} = ?</>
                            ) : (
                              <>{currentEx.number} ÷ 2 = ?</>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    

                    
                    {/* Choix multiples */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                      {shuffledChoices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleAnswerClick(choice)}
                          disabled={isCorrect !== null}
                          className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all ${
                            userAnswer === choice
                              ? isCorrect === true
                                ? 'bg-green-500 text-white'
                                : isCorrect === false
                                  ? 'bg-red-500 text-white'
                                  : 'bg-blue-500 text-white'
                              : currentEx.correctAnswer === choice && isCorrect === false
                                ? 'bg-green-200 text-green-800 border-2 border-green-500'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50'
                          } disabled:cursor-not-allowed`}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                    
                    {/* Résultat */}
                    {isCorrect !== null && (
                      <div className={`p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <div className="flex items-center justify-center space-x-3">
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                              <span className="font-bold text-lg sm:text-xl">Parfait ! C'est bien {currentEx.correctAnswer} !</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                              <span className="font-bold text-lg sm:text-xl">
                                Pas tout à fait... C'était {currentEx.correctAnswer} !
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Explication détaillée pour les erreurs (seulement si réponse fausse) */}
                    {isCorrect === false && (
                      <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-blue-300">
                        <h4 className="text-base sm:text-lg font-bold mb-3 text-blue-800 text-center">
                          🎯 Regarde la solution avec des objets !
                        </h4>
                        
                        {currentEx.type === 'double' ? (
                          <div className="space-y-4">
                            {/* Explication du double */}
                            <div className="text-center">
                              <p className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                                Pour trouver le double de {currentEx.number}, on fait :
                              </p>
                              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-3 sm:mb-4 md:mb-6">
                                {currentEx.number} + {currentEx.number} = {currentEx.correctAnswer}
                              </div>
                            </div>
                            
                            <div className="bg-yellow-50 rounded-lg p-4">
                              <div className="text-sm sm:text-base font-semibold mb-3 text-center text-gray-700">
                                Avec des objets colorés :
                              </div>
                              
                              <div className="flex items-center justify-center space-x-4 text-2xl sm:text-3xl text-gray-800">
                                {/* Premier groupe */}
                                <div className="animate-pulse">
                                  {'🔴'.repeat(Math.min(currentEx.number || 0, 5))}
                                  {(currentEx.number || 0) > 5 && (
                                    <div>{'🔴'.repeat((currentEx.number || 0) - 5)}</div>
                                  )}
                                </div>
                                
                                <span className="text-blue-600 font-bold text-xl sm:text-2xl">+</span>
                                
                                {/* Deuxième groupe */}
                                <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>
                                  {'🔵'.repeat(Math.min(currentEx.number || 0, 5))}
                                  {(currentEx.number || 0) > 5 && (
                                    <div>{'🔵'.repeat((currentEx.number || 0) - 5)}</div>
                                  )}
                                </div>
                                
                                <span className="text-green-600 font-bold text-xl sm:text-2xl">=</span>
                                
                                {/* Résultat */}
                                <div className="animate-bounce" style={{ animationDelay: '1s' }}>
                                  <span className="bg-green-200 px-3 py-1 rounded-full font-bold text-green-800 text-xl sm:text-2xl">
                                    {currentEx.correctAnswer}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-center text-xs sm:text-sm text-gray-600 mt-2">
                                {currentEx.number} objets rouges + {currentEx.number} objets bleus = {currentEx.correctAnswer} objets en tout !
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Explication de la moitié */}
                            <div className="text-center">
                              <p className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                                Pour trouver la moitié de {currentEx.number}, on partage en 2 :
                              </p>
                              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-4 sm:mb-6">
                                {currentEx.number} ÷ 2 = {currentEx.correctAnswer}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {/* Nombre initial */}
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Au départ : {currentEx.number} objets</div>
                                <div className="text-2xl animate-pulse text-gray-800">
                                  {'🟡'.repeat(Math.min(currentEx.number || 0, 10))}
                                  {(currentEx.number || 0) > 10 && (
                                    <div>{'🟡'.repeat((currentEx.number || 0) - 10)}</div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Flèche de partage */}
                              <div className="text-center text-2xl animate-bounce text-gray-800">⬇️</div>
                              
                              {/* Résultat du partage */}
                              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                                <div className="text-center">
                                  <div className="text-sm text-gray-600 mb-2">Groupe 1</div>
                                  <div className="bg-green-100 rounded-lg p-3 animate-pulse" style={{ animationDelay: '0.5s' }}>
                                    <div className="text-xl">
                                      {'🔴'.repeat(parseInt(currentEx.correctAnswer || '0'))}
                                    </div>
                                    <div className="text-sm font-bold text-green-800 mt-1">
                                      {currentEx.correctAnswer}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-center">
                                  <div className="text-sm text-gray-600 mb-2">Groupe 2</div>
                                  <div className="bg-blue-100 rounded-lg p-3 animate-pulse" style={{ animationDelay: '1s' }}>
                                    <div className="text-xl">
                                      {'🔵'.repeat(parseInt(currentEx.correctAnswer || '0'))}
                                    </div>
                                    <div className="text-sm font-bold text-blue-800 mt-1">
                                      {currentEx.correctAnswer}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <div className="bg-yellow-200 px-4 py-2 rounded-full inline-block animate-bounce" style={{ animationDelay: '1.5s' }}>
                                  <span className="font-bold text-yellow-800">
                                    Chaque groupe a {currentEx.correctAnswer} objets !
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700 text-center font-medium">
                            Maintenant tu comprends ! La prochaine fois sera plus facile !
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Navigation - Bouton Suivant (seulement si mauvaise réponse) */}
                    {isCorrect === false && currentExercise + 1 < exercises.length && (
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={nextExercise}
                          className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-orange-600 transition-colors"
                        >
                          Suivant →
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 As des calculs !", message: "Tu maîtrises parfaitement doubles et moitiés !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Super calculateur !", message: "Tu progresses très bien avec les doubles et moitiés !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 Bon travail !", message: "Continue à t'entraîner avec ces calculs !", emoji: "😊" };
                  return { title: "💪 Persévère !", message: "Les doubles et moitiés demandent de l'entraînement !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-4 text-gray-800">{result.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-yellow-100 rounded-lg p-4 mb-6">
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-2xl sm:text-4xl mt-2 text-gray-800">
                        {finalScore >= 18 ? '⭐⭐⭐' : finalScore >= 14 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm sm:text-base"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
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