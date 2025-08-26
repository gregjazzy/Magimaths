'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle } from 'lucide-react';

export default function AdditionsJusqu1000CE2() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showingSteps, setShowingSteps] = useState(false);

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

  // États pour le personnage des exercices
  const [exercisesIntroStarted, setExercisesIntroStarted] = useState(false);
  const [exercisesSamSizeExpanded, setExercisesSamSizeExpanded] = useState(false);
  const [exercisesImageError, setExercisesImageError] = useState(false);
  const [isPlayingEnonce, setIsPlayingEnonce] = useState(false);

  // État pour la détection mobile
  const [isMobile, setIsMobile] = useState(false);

  // Refs pour gérer l'audio et scroll
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions de pirate aléatoires
  const pirateExpressions = [
    "Mille sabords", "Tonnerre de Brest", "Sacré matelot", "Par Neptune", "Sang de pirate",
    "Mille millions de mille sabords", "Ventrebleu", "Sapristi", "Morbleu", "Fichtre"
  ];

  // Compliments aléatoires pour les bonnes réponses
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", 
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire"
  ];

  // Techniques de calcul mental CE1 jusqu'à 1000 - Programme français
  const mentalCalculationTechniques = [
    {
      id: 'additions-centaines',
      title: 'Additions par centaines',
      icon: '💯',
      description: 'Ajouter des centaines entières (100, 200, 300...)',
      method: 'J\'additionne les centaines : 1 + 9 = 10 centaines = 1000',
      examples: [
        { 
          calculation: '100 + 900', 
          start: 100, 
          addition: 900, 
          result: 1000,
          steps: [
            'Je regarde les centaines : 1 centaine + 9 centaines',
            '1 + 9 = 10',
            '10 centaines = 1000',
            'Résultat : 100 + 900 = 1000'
          ],
          visualSteps: [
            { step: 0, value: '1 + 9', highlight: false },
            { step: 1, value: '= 10', highlight: true },
            { step: 2, value: '10 centaines', highlight: true },
            { step: 3, value: '= 1000', highlight: true }
          ]
        },
        { 
          calculation: '200 + 800', 
          start: 200, 
          addition: 800, 
          result: 1000,
          steps: [
            'Je regarde les centaines : 2 centaines + 8 centaines',
            '2 + 8 = 10',
            '10 centaines = 1000',
            'Résultat : 200 + 800 = 1000'
          ],
          visualSteps: [
            { step: 0, value: '2 + 8', highlight: false },
            { step: 1, value: '= 10', highlight: true },
            { step: 2, value: '10 centaines', highlight: true },
            { step: 3, value: '= 1000', highlight: true }
          ]
        },
        { 
          calculation: '300 + 700', 
          start: 300, 
          addition: 700, 
          result: 1000,
          steps: [
            'Je regarde les centaines : 3 centaines + 7 centaines',
            '3 + 7 = 10',
            '10 centaines = 1000',
            'Résultat : 300 + 700 = 1000'
          ],
          visualSteps: [
            { step: 0, value: '3 + 7', highlight: false },
            { step: 1, value: '= 10', highlight: true },
            { step: 2, value: '10 centaines', highlight: true },
            { step: 3, value: '= 1000', highlight: true }
          ]
        },
        { 
          calculation: '400 + 600', 
          start: 400, 
          addition: 600, 
          result: 1000,
          steps: [
            'Je regarde les centaines : 4 centaines + 6 centaines',
            '4 + 6 = 10',
            '10 centaines = 1000',
            'Résultat : 400 + 600 = 1000'
          ],
          visualSteps: [
            { step: 0, value: '4 + 6', highlight: false },
            { step: 1, value: '= 10', highlight: true },
            { step: 2, value: '10 centaines', highlight: true },
            { step: 3, value: '= 1000', highlight: true }
          ]
        },
        { 
          calculation: '500 + 500', 
          start: 500, 
          addition: 500, 
          result: 1000,
          steps: [
            'Je regarde les centaines : 5 centaines + 5 centaines',
            '5 + 5 = 10',
            '10 centaines = 1000',
            'Résultat : 500 + 500 = 1000'
          ],
          visualSteps: [
            { step: 0, value: '5 + 5', highlight: false },
            { step: 1, value: '= 10', highlight: true },
            { step: 2, value: '10 centaines', highlight: true },
            { step: 3, value: '= 1000', highlight: true }
          ]
        }
      ]
    },


    {
      id: 'complements-centaines',
      title: 'Compléments par centaines',
      icon: '🏆',
      description: 'Compléter par bonds de 100 jusqu\'à 1000',
      method: 'Je compte par centaines jusqu\'à 1000 : +100, +100, +100...',
      examples: [
        { 
          calculation: '400 + ? = 1000', 
          start: 400, 
          complement: 600, 
          result: 1000,
          steps: [
            'Je pars de 400',
            'Je compte par centaines jusqu\'à 1000',
            '400 + 100 = 500, + 100 = 600, + 100 = 700, + 100 = 800, + 100 = 900, + 100 = 1000',
            'J\'ai ajouté 6 centaines = 600',
            'Réponse : 600'
          ],
          visualSteps: [
            { step: 0, value: 400, highlight: false },
            { step: 1, value: 500, highlight: true },
            { step: 2, value: 600, highlight: true },
            { step: 3, value: 700, highlight: true },
            { step: 4, value: 800, highlight: true },
            { step: 5, value: 900, highlight: true },
            { step: 6, value: 1000, highlight: true }
          ]
        },
        { 
          calculation: '200 + ? = 1000', 
          start: 200, 
          complement: 800, 
          result: 1000,
          steps: [
            'Je pars de 200',
            'Je compte par centaines jusqu\'à 1000',
            '200 → 300 → 400 → 500 → 600 → 700 → 800 → 900 → 1000',
            'J\'ai ajouté 8 centaines = 800',
            'Réponse : 800'
          ],
          visualSteps: [
            { step: 0, value: 200, highlight: false },
            { step: 1, value: 300, highlight: true },
            { step: 2, value: 400, highlight: true },
            { step: 3, value: 500, highlight: true },
            { step: 4, value: 600, highlight: true },
            { step: 5, value: 700, highlight: true },
            { step: 6, value: 800, highlight: true },
            { step: 7, value: 900, highlight: true },
            { step: 8, value: 1000, highlight: true }
          ]
        },
        { 
          calculation: '700 + ? = 1000', 
          start: 700, 
          complement: 300, 
          result: 1000,
          steps: [
            'Je pars de 700',
            'Je compte par centaines jusqu\'à 1000',
            '700 + 100 = 800, + 100 = 900, + 100 = 1000',
            'J\'ai ajouté 3 centaines = 300',
            'Réponse : 300'
          ],
          visualSteps: [
            { step: 0, value: 700, highlight: false },
            { step: 1, value: 800, highlight: true },
            { step: 2, value: 900, highlight: true },
            { step: 3, value: 1000, highlight: true }
          ]
        },
        { 
          calculation: '100 + ? = 1000', 
          start: 100, 
          complement: 900, 
          result: 1000,
          steps: [
            'Je pars de 100',
            'Je compte par centaines jusqu\'à 1000',
            '100 → 200 → 300 → 400 → 500 → 600 → 700 → 800 → 900 → 1000',
            'J\'ai ajouté 9 centaines = 900',
            'Réponse : 900'
          ],
          visualSteps: [
            { step: 0, value: 100, highlight: false },
            { step: 1, value: 200, highlight: true },
            { step: 2, value: 300, highlight: true },
            { step: 3, value: 400, highlight: true },
            { step: 4, value: 500, highlight: true },
            { step: 5, value: 600, highlight: true },
            { step: 6, value: 700, highlight: true },
            { step: 7, value: 800, highlight: true },
            { step: 8, value: 900, highlight: true },
            { step: 9, value: 1000, highlight: true }
          ]
        }
      ]
    },
    {
      id: 'additions-cinquantaines',
      title: 'Additions par cinquantaines',
      icon: '🔢',
      description: 'Ajouter par bonds de 50 (50, 100, 150, 200...)',
      method: 'Je compte par 50 : 50, 100, 150, 200, 250...',
      examples: [
        { 
          calculation: '150 + 100', 
          start: 150, 
          addition: 100, 
          result: 250,
          steps: [
            'Je pars de 150',
            'J\'ajoute 100 (= 2 fois 50)',
            '150 + 50 = 200',
            '200 + 50 = 250',
            'Résultat : 250'
          ],
          visualSteps: [
            { step: 0, value: 150, highlight: false },
            { step: 1, value: 200, highlight: true },
            { step: 2, value: 250, highlight: true }
          ]
        },
        { 
          calculation: '250 + 150', 
          start: 250, 
          addition: 150, 
          result: 400,
          steps: [
            'Je pars de 250',
            'J\'ajoute 150 (= 3 fois 50)',
            '250 + 50 = 300, + 50 = 350, + 50 = 400',
            'Résultat : 400'
          ],
          visualSteps: [
            { step: 0, value: 250, highlight: false },
            { step: 1, value: 300, highlight: true },
            { step: 2, value: 350, highlight: true },
            { step: 3, value: 400, highlight: true }
          ]
        },
        { 
          calculation: '350 + 200', 
          start: 350, 
          addition: 200, 
          result: 550,
          steps: [
            'Je pars de 350',
            'J\'ajoute 200 (= 4 fois 50)',
            '350 → 400 → 450 → 500 → 550',
            'Résultat : 550'
          ],
          visualSteps: [
            { step: 0, value: 350, highlight: false },
            { step: 1, value: 400, highlight: true },
            { step: 2, value: 450, highlight: true },
            { step: 3, value: 500, highlight: true },
            { step: 4, value: 550, highlight: true }
          ]
        },
        { 
          calculation: '450 + 250', 
          start: 450, 
          addition: 250, 
          result: 700,
          steps: [
            'Je pars de 450',
            'J\'ajoute 250 (= 5 fois 50)',
            '450 → 500 → 550 → 600 → 650 → 700',
            'Résultat : 700'
          ],
          visualSteps: [
            { step: 0, value: 450, highlight: false },
            { step: 1, value: 500, highlight: true },
            { step: 2, value: 550, highlight: true },
            { step: 3, value: 600, highlight: true },
            { step: 4, value: 650, highlight: true },
            { step: 5, value: 700, highlight: true }
          ]
        }
      ]
    }
  ];

  // Base d'exercices CE1 - Calcul mental jusqu'à 1000 (Programme français)
  const exerciseBank = [
    // Série 1 : Additions par centaines variées
    { type: 'additions-centaines', question: '100 + 200 = ?', calculation: '100 + 200', answer: 300 },
    { type: 'additions-centaines', question: '300 + 400 = ?', calculation: '300 + 400', answer: 700 },
    { type: 'additions-centaines', question: '200 + 300 = ?', calculation: '200 + 300', answer: 500 },
    { type: 'additions-centaines', question: '400 + 200 = ?', calculation: '400 + 200', answer: 600 },
    { type: 'additions-centaines', question: '100 + 500 = ?', calculation: '100 + 500', answer: 600 },
    { type: 'additions-centaines', question: '300 + 200 = ?', calculation: '300 + 200', answer: 500 },
    { type: 'additions-centaines', question: '500 + 300 = ?', calculation: '500 + 300', answer: 800 },
    
    // Série 2 : Additions par cinquantaines variées
    { type: 'additions-cinquantaines', question: '150 + 50 = ?', calculation: '150 + 50', answer: 200 },
    { type: 'additions-cinquantaines', question: '200 + 150 = ?', calculation: '200 + 150', answer: 350 },
    { type: 'additions-cinquantaines', question: '350 + 100 = ?', calculation: '350 + 100', answer: 450 },
    { type: 'additions-cinquantaines', question: '250 + 200 = ?', calculation: '250 + 200', answer: 450 },
    { type: 'additions-cinquantaines', question: '400 + 150 = ?', calculation: '400 + 150', answer: 550 },
    { type: 'additions-cinquantaines', question: '300 + 250 = ?', calculation: '300 + 250', answer: 550 },
    { type: 'additions-cinquantaines', question: '450 + 100 = ?', calculation: '450 + 100', answer: 550 },
    
    // Série 3 : Compléments variés (pas seulement à 1000)
    { type: 'complements-centaines', question: '300 + ? = 500', calculation: '300 + ?', answer: 200 },
    { type: 'complements-centaines', question: '200 + ? = 600', calculation: '200 + ?', answer: 400 },
    { type: 'complements-centaines', question: '400 + ? = 800', calculation: '400 + ?', answer: 400 },
    { type: 'complements-centaines', question: '100 + ? = 700', calculation: '100 + ?', answer: 600 },
    { type: 'complements-centaines', question: '500 + ? = 900', calculation: '500 + ?', answer: 400 },
    { type: 'complements-centaines', question: '300 + ? = 800', calculation: '300 + ?', answer: 500 },
    { type: 'complements-centaines', question: '250 + ? = 600', calculation: '250 + ?', answer: 350 }
  ];

  // Fonction pour mélanger les exercices de façon aléatoire
  const shuffleExercises = (array: typeof exerciseBank) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 15); // Prendre 15 exercices aléatoires
  };

  // Exercices mélangés pour cette session
  const [exercises, setExercises] = useState(() => shuffleExercises(exerciseBank));

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
      currentAudioRef.current.onend = null;
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
  };

  // Wrapper pour les gestionnaires d'événements
  const handleStopAllVocalsAndAnimations = () => {
    stopAllVocalsAndAnimations();
  };

  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('playAudio appelée avec:', text);
      
      if (stopSignalRef.current) {
        console.log('stopSignalRef.current est true, resolve immédiat');
        resolve();
        return;
      }
      
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
        utterance.volume = 1.0;
        utterance.lang = 'fr-FR';

        utterance.onstart = () => {
          if (stopSignalRef.current) {
            speechSynthesis.cancel();
            resolve();
            return;
          }
          console.log('🔊 Audio démarré:', text.substring(0, 50));
          setIsPlayingVocal(true);
          currentAudioRef.current = utterance;
        };

        utterance.onend = () => {
          console.log('✅ Audio terminé:', text.substring(0, 50));
          setIsPlayingVocal(false);
          currentAudioRef.current = null;
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('❌ Erreur audio:', event.error);
          setIsPlayingVocal(false);
          currentAudioRef.current = null;
          reject(new Error(`Erreur audio: ${event.error}`));
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('❌ Erreur lors de la création de l\'utterance:', error);
        reject(error);
      }
    });
  };

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Fonction pour animer les additions par centaines
  const animateAdditionsCentaines = async (example: any, exampleIndex: number) => {
    console.log('🎬 Animation centaines démarrée', example);
    // Réinitialiser le signal d'arrêt
    stopSignalRef.current = false;
    setSelectedTechnique('additions-centaines');
    setSelectedExampleIndex(exampleIndex);
    setIsAnimationRunning(true);
    setAnimationStep(0);
    setShowingSteps(true);

    // S'assurer que l'animation sera visible (avec délai pour le DOM)
    setTimeout(() => ensureAnimationVisible(), 500);

    try {
      await playAudio(`Regardons l'exemple : ${example.calculation}`);
      if (stopSignalRef.current) return;

      await wait(1000);
      await playAudio(example.steps[0]); // "Je regarde les centaines"
      setAnimationStep(0);

      await wait(1500);
      await playAudio(example.steps[1]); // "X + Y = 10"
      setAnimationStep(1);

      await wait(1500);
      await playAudio(example.steps[2]); // "10 centaines = 1000"
      setAnimationStep(2);

      await wait(1500);
      await playAudio(example.steps[3]); // "Résultat final"
      setAnimationStep(3);

      await wait(1000);
      await playAudio("C'est simple ! On additionne juste les centaines !");

    } catch (error) {
      console.error('Erreur animation centaines:', error);
    } finally {
      setIsAnimationRunning(false);
      setShowingSteps(false);
    }
  };

  // Fonction pour animer les additions par cinquantaines
  const animateAdditionsCinquantaines = async (example: any, exampleIndex: number) => {
    console.log('🎬 Animation cinquantaines démarrée', example);
    // Réinitialiser le signal d'arrêt
    stopSignalRef.current = false;
    setSelectedTechnique('additions-cinquantaines');
    setSelectedExampleIndex(exampleIndex);
    setIsAnimationRunning(true);
    setAnimationStep(0);
    setShowingSteps(true);

    // S'assurer que l'animation sera visible (avec délai pour le DOM)
    setTimeout(() => ensureAnimationVisible(), 500);

    try {
      await playAudio(`Voyons maintenant : ${example.calculation}`);
      if (stopSignalRef.current) return;

      await wait(1000);
      await playAudio(example.steps[0]); // "Je pars de X"
      setAnimationStep(0);

      await wait(1500);
      await playAudio(example.steps[1]); // "J'ajoute Y par bonds de 50"

      // Animation des bonds de 50
      for (let i = 1; i < example.visualSteps.length; i++) {
        await wait(1000);
        setAnimationStep(i);
        const step = example.visualSteps[i];
        await playAudio(`${step.value}`);
        if (stopSignalRef.current) return;
      }

      await wait(1500);
      await playAudio(`Excellent ! En comptant par 50, ${example.calculation} = ${example.result} !`);

    } catch (error) {
      console.error('Erreur animation cinquantaines:', error);
    } finally {
      setIsAnimationRunning(false);
      setShowingSteps(false);
    }
  };



  // Fonction pour animer les compléments par centaines
  const animateComplementsCentaines = async (example: any, exampleIndex: number) => {
    console.log('🎬 Animation compléments démarrée', example);
    // Réinitialiser le signal d'arrêt
    stopSignalRef.current = false;
    setSelectedTechnique('complements-centaines');
    setSelectedExampleIndex(exampleIndex);
    setIsAnimationRunning(true);
    setAnimationStep(0);
    setShowingSteps(true);

    // S'assurer que l'animation sera visible (avec délai pour le DOM)
    setTimeout(() => ensureAnimationVisible(), 500);

    try {
      await playAudio(`Cherchons le complément par centaines : ${example.calculation}`);
      if (stopSignalRef.current) return;

      await wait(1000);
      await playAudio(example.steps[0]); // "Je pars de X"
      setAnimationStep(0);

      await wait(1500);
      await playAudio(example.steps[1]); // "Je compte par centaines jusqu'à 1000"

      await wait(1000);
      await playAudio("Je vais compter combien de centaines je dois ajouter...");

      // Animation du comptage par centaines jusqu'à 1000
      for (let i = 1; i < example.visualSteps.length; i++) {
        await wait(900);
        setAnimationStep(i);
        const step = example.visualSteps[i];
        if (step.value === 1000) {
          await playAudio(`Et j'arrive à 1000 !`);
        } else {
          await playAudio(`${step.value}`);
        }
        if (stopSignalRef.current) return;
      }

      await wait(1500);
      const complement = example.complement || (1000 - example.start);
      await playAudio(`J'ai compté ${(example.visualSteps.length - 1)} centaines, donc ${complement} !`);

    } catch (error) {
      console.error('Erreur animation compléments centaines:', error);
    } finally {
      setIsAnimationRunning(false);
      setShowingSteps(false);
    }
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre le calcul mental jusqu'à 1000 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Nous allons découvrir 3 techniques formidables pour le CE1 !");
      if (stopSignalRef.current) return;
      
      // 2. Scroll vers les exemples et explication des techniques
      await wait(1000);
      scrollToElement('examples-section', 'start');
      setHighlightedElement('examples-section');
      await playAudio("Chaque technique a ses propres cartes d'exemples colorées ! Tu peux cliquer dessus pour découvrir comment ça marche !");
      if (stopSignalRef.current) return;
      
      await wait(1800);
      scrollToElement('technique-additions-centaines', 'start');
      setHighlightedElement('technique-additions-centaines');
      await playAudio("Première technique : ajouter des centaines ! C'est comme ajouter des paquets de 100. Découvre-la en cliquant sur les cartes bleues !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      scrollToElement('technique-complements-centaines', 'center');
      setHighlightedElement('technique-complements-centaines');
      await playAudio("Deuxième technique : les compléments à la centaine ! Très utile pour calculer plus vite. Teste avec les cartes vertes !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      scrollToElement('technique-additions-cinquantaines', 'center');
      setHighlightedElement('technique-additions-cinquantaines');
      await playAudio("Troisième technique : ajouter par groupes de 50 ! Très efficace pour les grands nombres. Explore avec les cartes orange !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("C'est parti pour devenir un champion du calcul mental !");
      if (stopSignalRef.current) return;
      
      // 3. Transition directe vers les exercices
      await wait(1500);
      setHighlightedElement(null);
      setCurrentExample(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setHighlightedElement('exercises-tab');
      await playAudio("Tu pourras ensuite passer aux exercices pour t'entraîner !");
      if (stopSignalRef.current) return;
      
      await wait(3000);
      setHighlightedElement(null);
      setIsAnimationRunning(false);
      
    } catch (error) {
      console.error('Erreur lors de l\'explication:', error);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour faire défiler vers un élément
  const scrollToElement = (elementId: string, block: ScrollLogicalPosition = 'center') => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: block,
          inline: 'nearest' 
        });
      }
    }, 100);
  };

  // Fonction pour s'assurer que l'animation est visible
  const ensureAnimationVisible = () => {
    setTimeout(() => {
      const animationElement = document.getElementById('animation-section');
      if (animationElement) {
        const rect = animationElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Vérifier si l'animation est complètement visible
        const isCompletelyVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
        
        // Si l'animation n'est pas complètement visible, la centrer
        if (!isCompletelyVisible) {
          animationElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest' 
          });
        }
      }
    }, 300); // Délai pour laisser le DOM se mettre à jour
  };

  // Fonction pour l'introduction des exercices
  const explainExercises = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setExercisesIntroStarted(true);

    try {
      await playAudio("Super ! Maintenant, c'est l'heure de s'entraîner avec les exercices !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Tu vas résoudre des additions jusqu'à 1000 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Utilise les techniques que tu viens d'apprendre !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("C'est parti pour devenir un expert du calcul mental !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setIsAnimationRunning(false);
      setExercisesSamSizeExpanded(false);
      
    } catch (error) {
      console.error('Erreur lors de l\'introduction des exercices:', error);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour valider la réponse
  const handleValidateAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const exercise = exercises[currentExercise];
    const correctAnswer = exercise.answer;
    const userNum = parseInt(userAnswer);
    const correct = userNum === correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }
    
    // Gestion après validation
    if (correct) {
      // Passage automatique si la réponse est correcte
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
          const finalScoreValue = score + 1;
        setFinalScore(finalScoreValue);
        setShowCompletionModal(true);
      }
    }, 1500);
    } else {
      // Expliquer la correction avec animation si la réponse est fausse
      setTimeout(() => {
        explainWrongAnswer();
      }, 1000);
    }
  };

  const nextExercise = () => {
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
    // Re-mélanger les exercices pour une nouvelle session
    setExercises(shuffleExercises(exerciseBank));
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonction pour lire l'énoncé de l'exercice
  const playExerciseAudio = async (text: string) => {
    console.log('playExerciseAudio appelée avec:', text);
    
    if (isPlayingEnonce) {
      console.log('isPlayingEnonce est true, sortie');
      return;
    }

    try {
      setIsPlayingEnonce(true);
      console.log('isPlayingEnonce mis à true');
      
      await playAudio(text);
      console.log('Lecture terminée avec succès');
      
    } catch (error) {
      console.error('Erreur dans playExerciseAudio:', error);
      alert('Erreur audio: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsPlayingEnonce(false);
      console.log('isPlayingEnonce mis à false');
    }
  };

  // Fonction pour expliquer une mauvaise réponse avec animation de correction
  const explainWrongAnswer = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setExercisesSamSizeExpanded(true);
    
    try {
      const exercise = exercises[currentExercise];
      
      // Introduction
      await playAudio("Pas de problème ! Regardons comment bien calculer...");
      if (stopSignalRef.current) return;
      
      await wait(500);
      
      // Expliquer la méthode selon le type d'exercice
      if (exercise.type === 'additions-centaines') {
        await playAudio(`Pour ${exercise.calculation}, on ajoute les centaines ! La réponse est ${exercise.answer}.`);
      } else if (exercise.type === 'complements-centaines') {
        await playAudio(`Pour ${exercise.calculation}, on cherche le complément ! La réponse est ${exercise.answer}.`);
      } else if (exercise.type === 'additions-cinquantaines') {
        await playAudio(`Pour ${exercise.calculation}, on compte par groupes de 50 ! Cela donne ${exercise.answer}.`);
      } else {
        await playAudio(`Pour ${exercise.calculation}, la bonne réponse est ${exercise.answer}.`);
      }
      
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("Clique sur suivant pour continuer !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      setExercisesSamSizeExpanded(false);
    }
  };

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Arrêter les animations lors du changement d'onglet ou de la sortie de la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔄 Page cachée, arrêt des animations');
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      console.log('🔄 Page en cours de fermeture, arrêt des animations');
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      console.log('🔄 Navigation back/forward, arrêt des animations');
      stopAllVocalsAndAnimations();
    };

    // Écouter les changements de visibilité de la page
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Écouter la fermeture/rechargement de la page
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Écouter la navigation back/forward
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-2 sm:p-4">

      {/* Bouton flottant stop - visible quand une animation ou vocal est en cours */}
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
      
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec navigation */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-8 border-2 border-orange-200">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <Link href="/chapitre/ce1-quatre-operations/addition-ce1" className="bg-orange-100 hover:bg-orange-200 p-2 sm:p-3 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                🧮 Calcul mental jusqu'à 1000 - CE1
              </h1>
              <p className="text-xs sm:text-lg text-gray-600">
                Calculs par tranches de 50 et 100 - Programme français
              </p>
            </div>
          </div>


        </div>

        {/* Navigation entre cours et exercices */}
        <div className={`flex justify-center ${showExercises ? 'mb-2 sm:mb-6' : 'mb-8'}`}>
          <div className="bg-white rounded-lg p-0.5 sm:p-1 shadow-md flex">
            <button
              onClick={() => {
                handleStopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[68px] flex items-center justify-center ${
                !showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              id="exercises-tab"
              onClick={() => {
                handleStopAllVocalsAndAnimations();
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
          /* COURS */
          <div className="space-y-1 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-1 sm:mb-6">
              <div className={`relative transition-all duration-500 border-2 border-orange-300 rounded-full bg-gradient-to-br from-orange-100 to-red-100 ${
                isAnimationRunning
                  ? 'w-14 sm:w-24 h-14 sm:h-24'
                  : samSizeExpanded
                    ? 'w-12 sm:w-32 h-12 sm:h-32'
                    : 'w-12 sm:w-20 h-12 sm:h-20'
                }`}>
                {!imageError ? (
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-xs sm:text-2xl">
                    🧱
                  </div>
                )}
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
                  className={`bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-xl font-bold text-xs sm:text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                    isAnimationRunning ? 'opacity-75 cursor-not-allowed' : 'hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isAnimationRunning ? '⏳ JE PARLE...' : '🔢 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Explication du concept */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-2 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🔢 Additions jusqu'à 1000
                </h2>
              </div>
              

            </div>

            {/* Section des exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              
              

              <div className="space-y-6 lg:space-y-10">
                {mentalCalculationTechniques.map((technique, techIndex) => (
                  <div 
                    key={technique.id} 
                    id={`technique-${technique.id}`}
                    className={`bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 sm:p-6 lg:p-8 border-2 border-blue-200 transition-all duration-1000 ${
                      highlightedElement === `technique-${technique.id}` ? 'ring-4 ring-yellow-400 animate-pulse bg-opacity-80' : ''
                    }`}
                  >
                    <div className="text-center mb-5">
                      <div className="text-3xl sm:text-4xl mb-3">{technique.icon}</div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 mb-2">
                        {technique.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-2">
                        {technique.description}
                      </p>
                      <p className="text-xs sm:text-sm lg:text-base text-blue-600 font-semibold italic">
                        💡 Méthode : {technique.method}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
                      {technique.examples.slice(0, 4).map((example, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (technique.id === 'additions-centaines') {
                              animateAdditionsCentaines(example, index);
                            } else if (technique.id === 'additions-cinquantaines') {
                              animateAdditionsCinquantaines(example, index);
                            } else if (technique.id === 'complements-centaines') {
                              animateComplementsCentaines(example, index);
                            }
                          }}
                          disabled={isAnimationRunning}
                          className={`rounded-lg p-3 sm:p-4 lg:p-5 border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 ${
                            technique.id === 'additions-centaines' 
                              ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 hover:border-blue-500 hover:shadow-lg hover:from-blue-200 hover:to-blue-300' 
                              : technique.id === 'complements-centaines'
                                ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-300 hover:border-green-500 hover:shadow-lg hover:from-green-200 hover:to-green-300'
                                : technique.id === 'additions-cinquantaines'
                                  ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-300 hover:border-orange-500 hover:shadow-lg hover:from-orange-200 hover:to-orange-300'
                                  : 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 hover:border-purple-500 hover:shadow-lg hover:from-purple-200 hover:to-purple-300'
                          } ${
                            highlightedElement === `technique-${technique.id}` 
                              ? 'ring-4 ring-yellow-400 shadow-xl animate-pulse bg-opacity-80' 
                              : ''
                          }`}
                        >
                    <div className="text-center">
                            <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2">
                              {example.calculation}
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-2">
                        = {example.result}
                      </div>
                      
                      {/* Indicateur de clic */}
                      <div className={`mt-2 px-2 py-1 rounded-full text-xs lg:text-sm font-semibold ${
                        technique.id === 'additions-centaines' 
                          ? 'bg-blue-300 text-blue-900' 
                          : technique.id === 'complements-centaines'
                            ? 'bg-green-300 text-green-900'
                            : technique.id === 'additions-cinquantaines'
                              ? 'bg-orange-300 text-orange-900'
                              : 'bg-purple-300 text-purple-900'
                      }`}>
                        ▶️ Cliquer pour l'animation !
                      </div>
                      </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section d'animation */}
              {showingSteps && selectedTechnique && selectedExampleIndex !== null && (
                <div 
                  id="animation-section"
                  className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border-2 border-orange-300"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-center text-orange-700 mb-4">
                    🎬 Animation en cours...
                  </h3>
                  
                  {(() => {
                    const technique = mentalCalculationTechniques.find(t => t.id === selectedTechnique);
                    const example = technique?.examples[selectedExampleIndex];
                    
                    if (!technique || !example) return null;

                    return (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                            {example.calculation}
                          </div>
                        </div>

                        {/* Affichage des étapes visuelles */}
                        <div className="flex justify-center">
                          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center max-w-4xl">
                            {example.visualSteps?.map((step, index) => (
                              <div key={index} className="flex items-center">
                                <div 
                                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all duration-500 ${
                                    index <= animationStep 
                                      ? step.highlight 
                                        ? 'bg-green-500 text-white scale-110 shadow-lg animate-pulse' 
                                        : 'bg-blue-500 text-white'
                                      : 'bg-gray-200 text-gray-500'
                                  }`}
                                >
                                  {step.value}
                                </div>
                                {index < example.visualSteps.length - 1 && (
                                  <div className="mx-2 sm:mx-3 text-gray-600 text-xl font-bold">
                                    →
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Explication textuelle */}
                        <div className="text-center">
                          <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-orange-200">
                            <p className="text-sm sm:text-base text-gray-700">
                              {animationStep < example.steps.length ? example.steps[animationStep] : example.steps[example.steps.length - 1]}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ */
          <div className="pb-20 sm:pb-8">
            {/* Introduction de Sam le Pirate - toujours visible */}
            <div className="mb-6 sm:mb-4 mt-4">
              {/* JSX pour l'introduction de Sam le Pirate dans les exercices */}
              <div className="flex justify-center p-0 sm:p-1 mt-0 sm:mt-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Image de Sam le Pirate */}
                  <div 
                    id="sam-pirate-exercises"
                    className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-1 sm:border-2 border-blue-200 shadow-md transition-all duration-300 ${
                    isPlayingVocal
                      ? 'w-12 sm:w-24 h-12 sm:h-24 scale-105 sm:scale-120'
                      : exercisesIntroStarted
                        ? 'w-10 sm:w-16 h-10 sm:h-16'
                        : 'w-12 sm:w-20 h-12 sm:h-20'
                  } ${highlightedElement === 'sam-pirate-exercises' ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-bounce scale-125' : ''}`}>
                    {!exercisesImageError ? (
                      <img 
                        src="/image/Minecraftstyle.png" 
                        alt="Personnage Minecraft" 
                        className="w-full h-full rounded-full object-cover"
                        onError={() => setExercisesImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-sm sm:text-2xl">
                        🧱
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
                  onClick={explainExercises}
                  disabled={isPlayingVocal}
                  className={`relative transition-all duration-300 transform ${
                    isPlayingVocal 
                      ? 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed animate-pulse shadow-md' 
                      : exercisesIntroStarted
                        ? 'px-2 sm:px-8 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 hover:scale-105 shadow-lg border-1 sm:border-2 border-orange-300'
                        : 'px-3 sm:px-12 py-1 sm:py-5 rounded-lg sm:rounded-xl font-black text-sm sm:text-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-2 sm:border-4 border-yellow-300'
                  } ${!isPlayingVocal && !exercisesIntroStarted ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''} ${exercisesIntroStarted && !isPlayingVocal ? 'ring-2 ring-orange-300 ring-opacity-75' : ''}`}
                  style={{
                    animationDuration: !isPlayingVocal && !exercisesIntroStarted ? '1.5s' : '2s',
                    animationIterationCount: isPlayingVocal ? 'none' : 'infinite',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    boxShadow: !isPlayingVocal && !exercisesIntroStarted 
                      ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
                      : exercisesIntroStarted && !isPlayingVocal
                        ? '0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(255,130,46,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : ''
                  }}
                >
                  {/* Effet de brillance */}
                  {!isPlayingVocal && !exercisesIntroStarted && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
                  )}
                  
                  {/* Icônes et texte */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPlayingVocal 
                      ? <>🎤 <span>Minecraft parle...</span></> 
                      : exercisesIntroStarted
                        ? <>🔄 <span>REJOUER L'INTRO</span> 🧱</>
                        : <>🚀 <span>COMMENCER</span> ✨</>
                    }
                  </span>
                  
                  {/* Particules brillantes */}
                  {!isPlayingVocal && (
                    <>
                      {!exercisesIntroStarted ? (
                        /* Particules initiales - dorées */
                        <>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        </>
                      ) : (
                        /* Particules de replay - orange */
                        <>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300 rounded-full animate-ping"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-300 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
                          <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
                        </>
                      )}
                    </>
                  )}
                </button>
                </div>
              </div>
            </div>

            {/* Header exercices - caché sur mobile */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-6 hidden sm:block">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
              </h2>
                
                  <div className="text-sm font-bold text-orange-600">
                    Score : {score}/{exercises.length}
              </div>
            </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
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
                
                <div className="text-xs font-bold text-orange-600">
                  Score: {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression mobile */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Zone principale de l'exercice - MOBILE OPTIMISÉ */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg mt-2 sm:mt-4 relative">
              
              {/* Bouton écouter l'énoncé - en haut à droite */}
              <button
                id="listen-question-button"
                onClick={() => playExerciseAudio(exercises[currentExercise].question)}
                disabled={isPlayingEnonce}
                className={`absolute top-3 right-3 sm:top-4 sm:right-4 px-3 sm:px-4 py-2 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md ${
                  isPlayingEnonce 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : highlightedElement === 'listen-question-button'
                      ? 'bg-yellow-500 text-white ring-4 ring-yellow-300 animate-pulse scale-105'
                      : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
                }`}
                title="Écouter l'énoncé de l'exercice"
              >
                {isPlayingEnonce ? '🎤' : '🎧'}
                <span className="hidden sm:inline ml-1">
                  {isPlayingEnonce ? 'Écoute...' : 'Énoncé'}
                </span>
              </button>
              
              {/* Question centrée */}
              <div className="text-center mb-6 sm:mb-8 pt-4 sm:pt-2">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
                {exercises[currentExercise].question}
                </h3>
              </div>
              
              {/* Zone de réponse - CENTRÉE ET AMÉLIORÉE */}
              <div 
                id="answer-zone"
                className={`max-w-md mx-auto mb-6 sm:mb-8 transition-all duration-300 ${
                  highlightedElement === 'answer-zone' ? 'ring-4 ring-orange-400 rounded-lg scale-105' : ''
                }`}
              >
                <div className="text-center space-y-4 sm:space-y-6">
                  {/* Équation simple et claire */}
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    {exercises[currentExercise].calculation}
                  </div>
                  
                  <label className="block text-lg sm:text-xl font-bold text-gray-800">
                    Écris le résultat :
                  </label>
                  
                  {/* Input plus grand et mieux centré */}
                  <div className="flex justify-center">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValidateAnswer()}
                placeholder="?"
                      disabled={isCorrect !== null}
                      className={`w-20 sm:w-24 md:w-28 h-12 sm:h-14 text-xl sm:text-2xl md:text-3xl font-bold text-center border-3 rounded-xl shadow-md ${
                        isCorrect === true 
                          ? 'border-green-500 bg-green-50 text-green-800' 
                          : isCorrect === false 
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200'
                      }`}
                      min="0"
                      max="1000"
                    />
                  </div>
                </div>

                {/* Bouton valider - plus grand et attractif */}
                {isCorrect === null && (
                  <div className="text-center mt-6">
                <button
                      id="validate-button"
                  onClick={handleValidateAnswer}
                      disabled={!userAnswer.trim() || isPlayingVocal}
                      className={`px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl transition-all shadow-lg ${
                        !userAnswer.trim() || isPlayingVocal
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : highlightedElement === 'validate-button'
                            ? 'bg-yellow-500 text-white ring-4 ring-yellow-300 animate-pulse scale-110 shadow-xl'
                            : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-xl'
                      }`}
                    >
                      ✅ Valider ma réponse
                </button>
              </div>
                )}

                {/* Feedback après validation - AMÉLIORÉ */}
              {isCorrect !== null && (
                  <div className="text-center mt-6 sm:mt-8">
                    <div className={`inline-flex items-center justify-center px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-bold text-lg sm:text-xl mb-4 sm:mb-6 shadow-lg ${
                      isCorrect 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-400' 
                        : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-400'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 sm:w-7 h-6 sm:h-7 mr-2 sm:mr-3" />
                          {correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)]} !
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 sm:w-7 h-6 sm:h-7 mr-2 sm:mr-3" />
                          Pas tout à fait...
                        </>
                      )}
                    </div>
                    
                  {!isCorrect && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                        <div className="text-base sm:text-lg text-orange-800">
                          La bonne réponse est : <span className="font-bold text-orange-900 text-xl sm:text-2xl">{exercises[currentExercise].answer}</span>
                        </div>
                    </div>
                  )}
                </div>
              )}
            </div>

              {/* Bouton exercice suivant - uniquement si faux */}
              {isCorrect === false && (
                <div className="flex justify-center mt-6 sm:mt-8">
                <button
                  onClick={nextExercise}
                    className={`px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl transition-all shadow-lg ${
                      highlightedElement === 'next-button'
                        ? 'bg-yellow-500 text-white ring-4 ring-yellow-300 animate-pulse scale-110 shadow-xl'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {currentExercise === exercises.length - 1 ? '🏆 Terminer les exercices' : '➡️ Exercice suivant'}
                </button>
              </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de completion */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                🎉 Exercices terminés !
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Tu as obtenu un score de {finalScore} / {exercises.length}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    resetAll();
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  🎲 Nouveaux exercices
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}