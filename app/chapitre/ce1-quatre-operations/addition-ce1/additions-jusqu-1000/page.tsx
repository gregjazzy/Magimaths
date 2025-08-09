'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function AdditionsJusqu1000CE1() {
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
    },
    {
      id: 'complements-1000',
      title: 'Compléments à 1000',
      icon: '🎯',
      description: 'Compléter pour arriver exactement à 1000',
      method: 'Je cherche ce qui manque pour faire 1000',
      examples: [
        { 
          calculation: '300 + ? = 1000', 
          start: 300, 
          complement: 700, 
          result: 1000,
          steps: [
            'Je pars de 300',
            'Je compte par centaines jusqu\'à 1000',
            '300 → 400 → 500 → 600 → 700 → 800 → 900 → 1000',
            'J\'ai compté 7 centaines = 700',
            'Réponse : 700'
          ],
          visualSteps: [
            { step: 0, value: 300, highlight: false },
            { step: 1, value: 400, highlight: true },
            { step: 2, value: 500, highlight: true },
            { step: 3, value: 600, highlight: true },
            { step: 4, value: 700, highlight: true },
            { step: 5, value: 800, highlight: true },
            { step: 6, value: 900, highlight: true },
            { step: 7, value: 1000, highlight: true }
          ]
        },
        { 
          calculation: '550 + ? = 1000', 
          start: 550, 
          complement: 450, 
          result: 1000,
          steps: [
            'Je pars de 550',
            'Je compte par 50 jusqu\'à 1000',
            '550 → 600 → 650 → 700 → 750 → 800 → 850 → 900 → 950 → 1000',
            'J\'ai compté 9 fois 50 = 450',
            'Réponse : 450'
          ],
          visualSteps: [
            { step: 0, value: 550, highlight: false },
            { step: 1, value: 600, highlight: true },
            { step: 2, value: 650, highlight: true },
            { step: 3, value: 700, highlight: true },
            { step: 4, value: 750, highlight: true },
            { step: 5, value: 800, highlight: true },
            { step: 6, value: 850, highlight: true },
            { step: 7, value: 900, highlight: true },
            { step: 8, value: 950, highlight: true },
            { step: 9, value: 1000, highlight: true }
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
    }
  ];

  // Exercices CE1 - Calcul mental jusqu'à 1000 (Programme français)
  const exercises = [
    // Série 1 : Additions par centaines qui font 1000
    { type: 'additions-centaines', question: '100 + 900 = ?', answer: 1000 },
    { type: 'additions-centaines', question: '200 + 800 = ?', answer: 1000 },
    { type: 'additions-centaines', question: '300 + 700 = ?', answer: 1000 },
    { type: 'additions-centaines', question: '400 + 600 = ?', answer: 1000 },
    { type: 'additions-centaines', question: '500 + 500 = ?', answer: 1000 },
    
    // Série 2 : Additions par cinquantaines (50, 100, 150...)
    { type: 'additions-cinquantaines', question: '150 + 100 = ?', answer: 250 },
    { type: 'additions-cinquantaines', question: '250 + 150 = ?', answer: 400 },
    { type: 'additions-cinquantaines', question: '350 + 200 = ?', answer: 550 },
    { type: 'additions-cinquantaines', question: '200 + 250 = ?', answer: 450 },
    { type: 'additions-cinquantaines', question: '450 + 250 = ?', answer: 700 },
    
    // Série 3 : Compléments à 1000 (centaines)
    { type: 'complements-1000', question: '300 + ? = 1000', answer: 700 },
    { type: 'complements-1000', question: '400 + ? = 1000', answer: 600 },
    { type: 'complements-1000', question: '600 + ? = 1000', answer: 400 },
    { type: 'complements-1000', question: '200 + ? = 1000', answer: 800 },
    { type: 'complements-1000', question: '500 + ? = 1000', answer: 500 },
    
    // Série 4 : Compléments à 1000 (cinquantaines)
    { type: 'complements-1000', question: '550 + ? = 1000', answer: 450 },
    { type: 'complements-1000', question: '350 + ? = 1000', answer: 650 },
    { type: 'complements-1000', question: '750 + ? = 1000', answer: 250 },
    { type: 'complements-1000', question: '650 + ? = 1000', answer: 350 },
    { type: 'complements-1000', question: '150 + ? = 1000', answer: 850 },
    
    // Série 5 : Compléments par centaines jusqu'à 1000
    { type: 'complements-centaines', question: '400 + ? = 1000', answer: 600 },
    { type: 'complements-centaines', question: '200 + ? = 1000', answer: 800 },
    { type: 'complements-centaines', question: '700 + ? = 1000', answer: 300 },
    { type: 'complements-centaines', question: '100 + ? = 1000', answer: 900 },
    { type: 'complements-centaines', question: '800 + ? = 1000', answer: 200 }
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
    setSelectedTechnique('additions-centaines');
    setSelectedExampleIndex(exampleIndex);
    setIsAnimationRunning(true);
    setAnimationStep(0);
    setShowingSteps(true);

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
    setSelectedTechnique('additions-cinquantaines');
    setSelectedExampleIndex(exampleIndex);
    setIsAnimationRunning(true);
    setAnimationStep(0);
    setShowingSteps(true);

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
      await playAudio(`Parfait ! En comptant par 50, ${example.calculation} = ${example.result} !`);

    } catch (error) {
      console.error('Erreur animation cinquantaines:', error);
    } finally {
      setIsAnimationRunning(false);
      setShowingSteps(false);
    }
  };

  // Fonction pour animer les compléments à 1000
  const animateComplements1000 = async (example: any, exampleIndex: number) => {
    setSelectedTechnique('complements-1000');
    setSelectedExampleIndex(exampleIndex);
    setIsAnimationRunning(true);
    setAnimationStep(0);
    setShowingSteps(true);

    try {
      await playAudio(`Trouvons le complément : ${example.calculation}`);
      if (stopSignalRef.current) return;

      await wait(1000);
      await playAudio(example.steps[0]); // "Je pars de X"
      setAnimationStep(0);

      await wait(1500);
      await playAudio(example.steps[1]); // "Je compte jusqu'à 1000"

      // Animation du comptage jusqu'à 1000
      for (let i = 1; i < example.visualSteps.length; i++) {
        await wait(800);
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
      await playAudio(`Le complément est ${complement} !`);

    } catch (error) {
      console.error('Erreur animation compléments:', error);
    } finally {
      setIsAnimationRunning(false);
      setShowingSteps(false);
    }
  };

  // Fonction pour animer les compléments par centaines
  const animateComplementsCentaines = async (example: any, exampleIndex: number) => {
    setSelectedTechnique('complements-centaines');
    setSelectedExampleIndex(exampleIndex);
    setIsAnimationRunning(true);
    setAnimationStep(0);
    setShowingSteps(true);

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
      await playAudio("Nous allons découvrir 4 techniques formidables pour le CE1 !");
      if (stopSignalRef.current) return;
      
      // 2. Explication du concept avec animations
      await wait(1800);
      setHighlightedElement('concept-section');
      await playAudio("Les additions par centaines : 100 plus 900 égale 1000 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Les additions par cinquantaines : 150 plus 100 égale 250 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Et les compléments à 1000 : 400 plus combien égale 1000 ?");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("4 techniques pour compter par centaines et cinquantaines !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("C'est parti pour devenir un champion du calcul mental !");
      if (stopSignalRef.current) return;
      
      // 3. Présentation des autres exemples
      await wait(2500);
      setHighlightedElement(null);
      setCurrentExample(null);
      await playAudio("Parfait ! Maintenant tu comprends les additions jusqu'à 1000 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a d'autres exemples à découvrir !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('examples-section');
      await playAudio("Regarde ! Tu peux essayer avec d'autres nombres !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setHighlightedElement('exercises-tab');
      await playAudio("Quand tu es prêt, tu peux faire les exercices pour t'entraîner !");
      if (stopSignalRef.current) return;
      
      await wait(3000);
      setHighlightedElement(null);
      setIsAnimationRunning(false);
      
    } catch (error) {
      console.error('Erreur lors de l\'explication:', error);
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
    
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        const finalScoreValue = score + (correct ? 1 : 0);
        setFinalScore(finalScoreValue);
        setShowCompletionModal(true);
      }
    }, 1500);
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
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
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

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-2 sm:p-4">
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
                Compléments à 1000 et calculs par tranches de 50 - Programme français
              </p>
            </div>
          </div>

          {/* Bouton d'arrêt global */}
          <div className="flex justify-end">
            <button
              onClick={handleStopAllVocalsAndAnimations}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center gap-1 sm:gap-2"
            >
              <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
              Arrêter
            </button>
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
                    src="/image/pirate-small.png" 
                    alt="Sam le Pirate" 
                    className="w-full h-full rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-xs sm:text-2xl">
                    🏴‍☠️
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
              
              <div className="bg-orange-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-sm sm:text-lg text-center text-orange-800 font-semibold mb-3 sm:mb-6">
                  Le calcul mental jusqu'à 1000 avec les centaines et cinquantaines !
                </p>
                
                <div className="bg-white rounded-lg p-3 sm:p-6">
                  <div className="text-center mb-3 sm:mb-6">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600 mb-1 sm:mb-4">
                      Exemples : 100 + 900 = 1000 | 150 + 100 = 250 | 400 + ? = 1000
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      Techniques : centaines, cinquantaines, compléments
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section des exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
                🧮 Techniques de calcul mental CE1
              </h2>
              
              <div className="space-y-6">
                {mentalCalculationTechniques.map((technique, techIndex) => (
                  <div key={technique.id} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 sm:p-6 border-2 border-blue-200">
                    <div className="text-center mb-4">
                      <div className="text-2xl sm:text-4xl mb-2">{technique.icon}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-blue-700 mb-2">
                        {technique.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        {technique.description}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-600 font-semibold italic">
                        💡 Méthode : {technique.method}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      {technique.examples.slice(0, 4).map((example, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (technique.id === 'additions-centaines') {
                              animateAdditionsCentaines(example, index);
                            } else if (technique.id === 'additions-cinquantaines') {
                              animateAdditionsCinquantaines(example, index);
                            } else if (technique.id === 'complements-1000') {
                              animateComplements1000(example, index);
                            } else if (technique.id === 'complements-centaines') {
                              animateComplementsCentaines(example, index);
                            }
                          }}
                          disabled={isAnimationRunning}
                          className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                    <div className="text-center">
                            <div className="text-sm sm:text-base font-bold text-gray-800 mb-2">
                              {example.calculation}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-green-600">
                        = {example.result}
                      </div>
                            <div className="text-xs sm:text-sm text-blue-600 mt-2">
                              🎬 Voir l'animation
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
                <div className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border-2 border-orange-300">
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
                                  <div className="mx-1 sm:mx-2 text-gray-400 font-bold">
                                    {selectedTechnique === 'complements-1000' ? '→' : '+'}
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
          /* EXERCICES */
          <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                ✏️ Exercices - Calcul mental CE1 jusqu'à 1000
              </h2>
              <div className="text-sm sm:text-lg font-semibold text-gray-600">
                {currentExercise + 1} / {exercises.length}
              </div>
            </div>

            <div className="text-center mb-4 sm:mb-8">
              <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {exercises[currentExercise].question}
              </div>
              
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValidateAnswer()}
                className="text-lg sm:text-2xl font-bold text-center border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 w-32 sm:w-48 focus:border-orange-500 focus:outline-none"
                placeholder="?"
                autoFocus
              />
              
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={handleValidateAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Valider
                </button>
              </div>

              {isCorrect !== null && (
                <div className={`mt-3 sm:mt-4 text-lg sm:text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ Correct ! Bravo !' : '❌ Oops, essaie encore !'}
                  {!isCorrect && (
                    <div className="text-sm sm:text-lg text-gray-600 mt-2">
                      La bonne réponse est : {exercises[currentExercise].answer}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm sm:text-lg font-semibold text-gray-600">
                Score : {score} / {exercises.length}
              </div>
              
              <div className="flex gap-2 sm:gap-4">
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-600 transition-colors"
                >
                  Recommencer
                </button>
                
                <button
                  onClick={nextExercise}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Suivant
                </button>
              </div>
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
                  Recommencer
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