'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

// Interface pour les exercices
interface Exercise {
  question: string;
  correctAnswer: string;
  choices: string[];
  method: string;
  icon: string;
  visual?: string;
}

export default function SensMultiplicationCE1() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedDigits, setHighlightedDigits] = useState<string[]>([]);
  const [calculationStep, setCalculationStep] = useState<'setup' | 'groups' | 'counting' | 'result' | null>(null);
  const [showingGroups, setShowingGroups] = useState(false);
  const [groupValues, setGroupValues] = useState<{groups: number, itemsPerGroup: number}>({groups: 0, itemsPerGroup: 0});
  const [partialResults, setPartialResults] = useState<{count: string | null, total: string | null}>({count: null, total: null});
  
  // États pour les illustrations visuelles de multiplication
  const [showMultiplicationAnimation, setShowMultiplicationAnimation] = useState(false);
  const [multiplicationStep, setMultiplicationStep] = useState<'problem' | 'groups' | 'count' | 'calculate' | null>(null);
  const [currentGroup, setCurrentGroup] = useState<number>(0);
  
  // États pour la synchronisation vocale avec les boutons d'animation
  const [currentVocalSection, setCurrentVocalSection] = useState<string | null>(null);
  const [activeSpeakingButton, setActiveSpeakingButton] = useState<string | null>(null);
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showWrongAnswerAnimation, setShowWrongAnswerAnimation] = useState(false);
  const [isPlayingWrongAnswerVocal, setIsPlayingWrongAnswerVocal] = useState(false);
  
  // États pour le personnage Minecraft (cours)
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // États pour le personnage Minecraft (exercices)
  const [exerciseSamSizeExpanded, setExerciseSamSizeExpanded] = useState(false);
  const [exerciseImageError, setExerciseImageError] = useState(false);
  const [hasStartedExercises, setHasStartedExercises] = useState(false);
  
  // États pour le personnage Minecraft (exercices)
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);
  const [exercisesImageError, setExercisesImageError] = useState(false);
  
  // États pour l'animation vocale du texte explicatif
  const [isExplainingText, setIsExplainingText] = useState(false);
  const [highlightedTextPart, setHighlightedTextPart] = useState<string | null>(null);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Section 1 : Sens général de la multiplication
  const multiplicationExamples = [
    { 
      groups: 3, 
      itemsPerGroup: 4, 
      description: '3 groupes de 4 pommes', 
      item: '🍎',
      story: 'Julie a 3 paniers. Dans chaque panier, il y a 4 pommes.',
      concept: 'Au lieu de compter 4 + 4 + 4, on peut dire "3 fois 4"'
    },
    { 
      groups: 2, 
      itemsPerGroup: 5, 
      description: '2 groupes de 5 étoiles', 
      item: '🌟',
      story: 'Dans le ciel, il y a 2 constellations. Chaque constellation a 5 étoiles.',
      concept: 'Au lieu de compter 5 + 5, on peut dire "2 fois 5"'
    },
    { 
      groups: 4, 
      itemsPerGroup: 3, 
      description: '4 groupes de 3 ballons', 
      item: '🎈',
      story: 'À la fête, il y a 4 enfants. Chaque enfant a 3 ballons.',
      concept: 'Au lieu de compter 3 + 3 + 3 + 3, on peut dire "4 fois 3"'
    },
    { 
      groups: 5, 
      itemsPerGroup: 2, 
      description: '5 groupes de 2 bonbons', 
      item: '🍬',
      story: 'Marie a 5 sachets. Dans chaque sachet, il y a 2 bonbons.',
      concept: 'Au lieu de compter 2 + 2 + 2 + 2 + 2, on peut dire "5 fois 2"'
    },
    { 
      groups: 2, 
      itemsPerGroup: 6, 
      description: '2 groupes de 6 étoiles', 
      item: '⭐',
      story: 'Paul colle des gommettes. Il fait 2 lignes de 6 gommettes.',
      concept: 'Au lieu de compter 6 + 6, on peut dire "2 fois 6"'
    },
    { 
      groups: 3, 
      itemsPerGroup: 5, 
      description: '3 groupes de 5 cercles', 
      item: '🔴',
      story: 'Sur le tableau, la maîtresse dessine 3 rangées de 5 cercles.',
      concept: 'Au lieu de compter 5 + 5 + 5, on peut dire "3 fois 5"'
    },
    { 
      groups: 4, 
      itemsPerGroup: 2, 
      description: '4 groupes de 2 fleurs', 
      item: '🌸',
      story: 'Dans le jardin, il y a 4 plates-bandes. Dans chaque plate-bande, il y a 2 fleurs.',
      concept: 'Au lieu de compter 2 + 2 + 2 + 2, on peut dire "4 fois 2"'
    }
  ];

  // Section 2 : Addition répétée
  const additionRepeteeExamples = [
    { 
      groups: 3, 
      itemsPerGroup: 4, 
      description: '3 fois 4 objets', 
      item: '🍎',
      story: 'Tom a 3 sacs avec 4 pommes dans chaque sac. Combien de pommes au total ?',
      addition: '4 + 4 + 4',
      concept: 'Au lieu de multiplier, on peut additionner plusieurs fois le même nombre !',
      type: 'addition_repetee'
    },
    { 
      groups: 4, 
      itemsPerGroup: 3, 
      description: '4 fois 3 objets', 
      item: '⭐',
      story: 'Lisa dessine 4 rangées de 3 étoiles chacune. Combien d\'étoiles en tout ?',
      addition: '3 + 3 + 3 + 3',
      concept: 'Additionner 4 fois le nombre 3, c\'est comme 4 × 3 !',
      type: 'addition_repetee'
    },
    { 
      groups: 2, 
      itemsPerGroup: 5, 
      description: '2 fois 5 objets', 
      item: '🌸',
      story: 'Dans 2 plates-bandes, il y a 5 fleurs dans chaque plate-bande.',
      addition: '5 + 5',
      concept: 'Deux fois 5, c\'est additionner : 5 + 5 !',
      type: 'addition_repetee'
    }
  ];

  // Section 3 : Groupes égaux
  const groupesEgauxExamples = [
    { 
      groups: 3, 
      itemsPerGroup: 4, 
      description: '3 groupes égaux de 4 objets', 
      item: '🍎',
      story: 'Tom range ses pommes. Il fait 3 groupes, avec exactement 4 pommes dans chaque groupe.',
      concept: 'Chaque groupe a le même nombre d\'objets : ils sont égaux !',
      type: 'groupes_egaux'
    },
    { 
      groups: 4, 
      itemsPerGroup: 3, 
      description: '4 groupes égaux de 3 objets', 
      item: '⭐',
      story: 'Lisa colle des étoiles. Elle fait 4 colonnes avec exactement 3 étoiles dans chaque colonne.',
      concept: 'Tous les groupes ont 3 étoiles : c\'est égal dans chaque groupe !',
      type: 'groupes_egaux'
    },
    { 
      groups: 2, 
      itemsPerGroup: 5, 
      description: '2 groupes égaux de 5 objets', 
      item: '🌸',
      story: 'Dans le jardin, il y a 2 plates-bandes. Chaque plate-bande a exactement 5 fleurs.',
      concept: 'Les 2 plates-bandes ont le même nombre de fleurs : elles sont égales !',
      type: 'groupes_egaux'
    }
  ];

  // Exercices progressifs de multiplication
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Exercices organisés par méthode
  const exercisesByMethod: { [key: string]: Exercise[] } = {
    sens: [
      {
        question: 'Que signifie la multiplication ?', 
        correctAnswer: 'Compter des groupes identiques rapidement',
        choices: ['Compter des groupes identiques rapidement', 'Enlever des objets', 'Partager équitablement'],
        method: 'sens',
        icon: '✖️'
      },
      { 
        question: 'Combien y a-t-il de groupes de 3 pommes ?', 
        correctAnswer: '4 groupes',
        choices: ['12 groupes', '3 groupes', '4 groupes'],
        visual: '🍎🍎🍎  🍎🍎🍎  🍎🍎🍎  🍎🍎🍎',
        method: 'sens',
        icon: '✖️'
      },
      { 
        question: 'Combien y a-t-il d\'objets dans chaque groupe ?', 
        correctAnswer: '2 objets',
        choices: ['2 objets', '3 objets', '1 objet'],
        visual: '⭐⭐   ⭐⭐   ⭐⭐',
        method: 'sens',
        icon: '✖️'
      },
      { 
        question: 'Quelle situation correspond à une multiplication ?', 
        correctAnswer: '3 boîtes avec 4 œufs chacune',
        choices: ['10 jouets - 2 jouets', '5 bonbons + 3 bonbons', '3 boîtes avec 4 œufs chacune'],
        method: 'sens',
        icon: '✖️'
      },
      { 
        question: 'Dans "4 fois 3", le 4 indique...', 
        correctAnswer: 'Le nombre de groupes',
        choices: ['Le nombre à enlever', 'Le nombre de groupes', 'Le nombre total'],
        method: 'sens',
        icon: '✖️'
      },
      { 
        question: 'Quel est le signe de la multiplication ?', 
        correctAnswer: '×',
        choices: ['×', '-', '+'],
        method: 'sens',
        icon: '✖️'
      }
    ],
    
    addition: [
      { 
        question: 'Quelle addition correspond à "4 groupes de 3" ?', 
        correctAnswer: '3 + 3 + 3 + 3',
        choices: ['3 + 3 + 3 + 3', '4 + 3', '4 + 4 + 4'],
        method: 'addition',
        icon: '➕',
        visual: '🌟🌟🌟  🌟🌟🌟  🌟🌟🌟  🌟🌟🌟',
        visualExplanation: '4 groupes de 3 étoiles',
        additionSteps: ['3', '3 + 3', '3 + 3 + 3', '3 + 3 + 3 + 3'],
        item: '🌟',
        groups: 4,
        itemsPerGroup: 3
      },
      { 
        question: 'Au lieu d\'écrire 5 + 5 + 5, on peut écrire...', 
        correctAnswer: '3 fois 5',
        choices: ['5 plus 3', '5 fois 3', '3 fois 5'],
        method: 'addition',
        icon: '➕',
        visual: '🍎🍎🍎🍎🍎  🍎🍎🍎🍎🍎  🍎🍎🍎🍎🍎',
        visualExplanation: '3 groupes de 5 pommes',
        additionSteps: ['5', '5 + 5', '5 + 5 + 5'],
        item: '🍎',
        groups: 3,
        itemsPerGroup: 5
      },
      { 
        question: 'Quelle addition répétée correspond à "2 groupes de 7 objets" ?', 
        correctAnswer: '7 + 7',
        choices: ['2 + 7', '7 + 7', '2 + 2 + 2 + 2 + 2 + 2 + 2'],
        method: 'addition',
        icon: '➕',
        visual: '🔵🔵🔵🔵🔵🔵🔵  🔵🔵🔵🔵🔵🔵🔵',
        visualExplanation: '2 groupes de 7 cercles',
        additionSteps: ['7', '7 + 7'],
        item: '🔵',
        groups: 2,
        itemsPerGroup: 7
      },
      { 
        question: 'L\'addition 4 + 4 + 4 + 4 + 4 peut s\'écrire...', 
        correctAnswer: '5 fois 4',
        choices: ['4 fois 5', '5 fois 4', '9 fois 1'],
        method: 'addition',
        icon: '➕',
        visual: '⭐⭐⭐⭐  ⭐⭐⭐⭐  ⭐⭐⭐⭐  ⭐⭐⭐⭐  ⭐⭐⭐⭐',
        visualExplanation: '5 groupes de 4 étoiles',
        additionSteps: ['4', '4 + 4', '4 + 4 + 4', '4 + 4 + 4 + 4', '4 + 4 + 4 + 4 + 4'],
        item: '⭐',
        groups: 5,
        itemsPerGroup: 4
      },
      { 
        question: 'Comment transformer "6 × 2" en addition répétée ?', 
        correctAnswer: '2 + 2 + 2 + 2 + 2 + 2',
        choices: ['6 + 2', '2 + 2 + 2 + 2 + 2 + 2', '6 + 6'],
        method: 'addition',
        icon: '➕',
        visual: '🌸🌸  🌸🌸  🌸🌸  🌸🌸  🌸🌸  🌸🌸',
        visualExplanation: '6 groupes de 2 fleurs',
        additionSteps: ['2', '2 + 2', '2 + 2 + 2', '2 + 2 + 2 + 2', '2 + 2 + 2 + 2 + 2', '2 + 2 + 2 + 2 + 2 + 2'],
        item: '🌸',
        groups: 6,
        itemsPerGroup: 2
      }
    ],
    
    groupes: [
      { 
        question: 'Pour faire des groupes égaux avec 12 objets, on peut faire...', 
        correctAnswer: '3 groupes de 4 objets',
        choices: ['2 groupes de 5 objets', '3 groupes de 4 objets', '5 groupes de 3 objets'],
        method: 'groupes',
        icon: '⚖️',
        visual: '🟡🟡🟡🟡  🟡🟡🟡🟡  🟡🟡🟡🟡',
        visualExplanation: '12 objets organisés en 3 groupes égaux de 4',
        item: '🟡',
        totalObjects: 12,
        groups: 3,
        itemsPerGroup: 4,
        wrongChoices: [
          { text: '2 groupes de 5 objets', visual: '🟡🟡🟡🟡🟡  🟡🟡', explanation: 'Il reste 2 objets non groupés' },
          { text: '5 groupes de 3 objets', visual: '🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡', explanation: 'Il faudrait 15 objets pour 5 groupes de 3' }
        ]
      },
      { 
        question: 'Dans "groupes égaux", que signifie "égaux" ?', 
        correctAnswer: 'Chaque groupe a le même nombre d\'objets',
        choices: ['Tous les objets sont identiques', 'Il y a le même nombre de groupes', 'Chaque groupe a le même nombre d\'objets'],
        method: 'groupes',
        icon: '⚖️',
        visual: '🔴🔴🔴  🔴🔴🔴  🔴🔴🔴',
        visualExplanation: 'Chaque groupe a exactement 3 objets',
        item: '🔴',
        groups: 3,
        itemsPerGroup: 3
      },
      { 
        question: 'Comment organiser 15 billes en groupes égaux ?', 
        correctAnswer: '5 groupes de 3 billes',
        choices: ['3 groupes de 4 billes', '5 groupes de 3 billes', '4 groupes de 4 billes'],
        method: 'groupes',
        icon: '⚖️',
        visual: '⚽⚽⚽  ⚽⚽⚽  ⚽⚽⚽  ⚽⚽⚽  ⚽⚽⚽',
        visualExplanation: '15 billes organisées en 5 groupes égaux de 3',
        item: '⚽',
        totalObjects: 15,
        groups: 5,
        itemsPerGroup: 3
      },
      { 
        question: 'Si on a 4 groupes égaux de 5 objets, combien d\'objets au total ?', 
        correctAnswer: '20 objets',
        choices: ['9 objets', '20 objets', '15 objets'],
        method: 'groupes',
        icon: '⚖️',
        visual: '🟢🟢🟢🟢🟢  🟢🟢🟢🟢🟢  🟢🟢🟢🟢🟢  🟢🟢🟢🟢🟢',
        visualExplanation: '4 groupes de 5 objets = 20 objets au total',
        item: '🟢',
        groups: 4,
        itemsPerGroup: 5
      },
      { 
        question: 'Que faut-il vérifier pour s\'assurer que les groupes sont égaux ?', 
        correctAnswer: 'Que chaque groupe a le même nombre d\'objets',
        choices: ['Que les objets sont de la même couleur', 'Que chaque groupe a le même nombre d\'objets', 'Que les groupes sont alignés'],
        method: 'groupes',
        icon: '⚖️',
        visual: '🔸🔸  🔸🔸  🔸🔸',
        visualExplanation: 'Tous les groupes ont exactement 2 objets',
        item: '🔸',
        groups: 3,
        itemsPerGroup: 2
      }
    ]
  };

  // États pour la navigation progressive des exercices
  const [currentMethodBlock, setCurrentMethodBlock] = useState('sens'); // 'sens', 'addition', 'groupes'
  const [currentExerciseInBlock, setCurrentExerciseInBlock] = useState(0);
  const [completedMethods, setCompletedMethods] = useState<string[]>([]);
  const [methodProgress, setMethodProgress] = useState({
    sens: { completed: 0, total: 6 },
    addition: { completed: 0, total: 5 },
    groupes: { completed: 0, total: 5 }
  });

  // Exercices actuels basés sur la méthode sélectionnée
  const currentExercises = exercisesByMethod[currentMethodBlock as keyof typeof exercisesByMethod] || [];
  const currentExercise = currentExercises[currentExerciseInBlock];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fonction d'arrêt de toutes les animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() appelé');
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
    setShowingGroups(false);
    setSamSizeExpanded(false);
    setIsExplainingText(false);
    setHighlightedTextPart(null);
    setCurrentVocalSection(null);
    setActiveSpeakingButton(null);
    setShowWrongAnswerAnimation(false);
    setIsPlayingWrongAnswerVocal(false);
    setExerciseSamSizeExpanded(false);
  };

  // Fonction pour scroller vers un élément
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Fonction pour attendre
  const wait = (ms: number) => {
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

  // Fonction pour jouer l'audio
  const playAudio = async (text: string, slowMode = false, buttonId?: string) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      
      if (buttonId) {
        setActiveSpeakingButton(buttonId);
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
      
      const bestFrenchVoice = voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        (voice.name.toLowerCase().includes('audrey') ||    
         voice.name.toLowerCase().includes('marie') ||     
         voice.name.toLowerCase().includes('amélie') ||    
         voice.name.toLowerCase().includes('virginie') ||  
         voice.name.toLowerCase().includes('julie') ||     
         voice.name.toLowerCase().includes('celine') ||    
         voice.name.toLowerCase().includes('léa') ||       
         voice.name.toLowerCase().includes('charlotte'))   
      ) || voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        voice.localService                                 
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'                            
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')                       
      );

      if (bestFrenchVoice) {
        utterance.voice = bestFrenchVoice;
        console.log('🎤 Voix sélectionnée:', bestFrenchVoice.name);
      } else {
        console.warn('⚠️ Aucune voix française trouvée');
      }
      
      utterance.onend = () => {
        setIsPlayingVocal(false);
        setActiveSpeakingButton(null);
        currentAudioRef.current = null;
        resolve();
      };
      
      utterance.onerror = () => {
        setIsPlayingVocal(false);
        setActiveSpeakingButton(null);
        currentAudioRef.current = null;
        resolve();
      };
      
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
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
      playAudio("Bonjour ! Découvrons ensemble le sens de la multiplication !", true);
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présenter le bouton d'explication bleu avec animation PENDANT l'audio
      playAudio("D'abord, tu peux cliquer sur ce bouton bleu pour écouter l'explication de ce qu'est la multiplication !", true);
      await wait(1000);
      setHighlightedElement('explain-text-button');
      await wait(4000);
      if (stopSignalRef.current) return;
      
      // Présenter l'exemple principal avec scroll et animation PENDANT l'audio
      playAudio("Maintenant, voici l'exemple principal avec son animation !", true, 'main-example-button');
      await wait(1500); // Réduit de 2500 à 1500ms pour scroll plus rapide
      setHighlightedElement('example-section');
      scrollToElement('example-section');
      await wait(2000); // Augmenté de 1000 à 2000ms pour laisser temps de voir la section
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton d'animation principal PENDANT l'audio
      playAudio("Clique sur le bouton vert pour voir comment faire !", true, 'main-example-button');
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présenter la section des autres exemples avec scroll et animation PENDANT l'audio
      playAudio("Ensuite, tu trouveras d'autres exemples de multiplication !", true);
      await wait(1800); // Réduit de 2500 à 1800ms pour scroll plus rapide
      setHighlightedElement('examples-section');
      scrollToElement('examples-section');
      await wait(1500); // Augmenté de 1000 à 1500ms pour laisser temps de voir la section
      if (stopSignalRef.current) return;
      
      // Mettre en évidence les cartes d'exemples PENDANT l'audio
      playAudio("Chaque carte verte a son animation ! Clique sur les cartes pour les voir !", true, 'examples-buttons');
      await wait(1000);
      setHighlightedElement('example-0');
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présenter la section addition répétée
      playAudio("Maintenant, découvrons la première méthode : l'addition répétée !", true);
      await wait(4000); // Méthode 2: +2000ms (2000 + 2000 = 4000ms)
      scrollToElement('addition-repetee-section');
      await wait(1200); // Augmenté de 500 à 1200ms pour laisser temps de voir la section
      if (stopSignalRef.current) return;
      
      playAudio("La multiplication, c'est additionner plusieurs fois le même nombre ! Par exemple, 3 fois 4, c'est 4 plus 4 plus 4 !", true);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      // Présenter la section groupes égaux
      playAudio("Ensuite, nous avons la méthode des groupes égaux !", true);
      await wait(5800); // Méthode 3: +4000ms (1800 + 4000 = 5800ms)
      scrollToElement('groupes-egaux-section');
      await wait(1500); // Augmenté de 1000 à 1500ms pour laisser temps de voir la section
      if (stopSignalRef.current) return;
      
      playAudio("Ici, on organise les objets en groupes qui ont tous le même nombre d'objets. C'est très pratique pour visualiser !", true);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      // Présenter la section synthèse
      playAudio("Et voici la synthèse ! Les trois méthodes donnent toujours le même résultat !", true);
      await wait(8200); // Synthèse: +6000ms (2200 + 6000 = 8200ms)
      scrollToElement('synthese-section');
      await wait(1300); // Augmenté de 500 à 1300ms pour laisser temps de voir la section
      if (stopSignalRef.current) return;
      
      playAudio("Que tu utilises le sens, l'addition répétée ou les groupes égaux, tu trouveras la même réponse !", true);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      // Présenter la section exercices avec scroll PENDANT l'audio
      playAudio("Et pour finir, tu pourras t'entraîner avec les exercices qui mélangent les trois méthodes ! N'oublie pas : la multiplication, c'est magique !", true);
      await wait(10000); // Exercices: +8000ms (2000 + 8000 = 10000ms)
      setHighlightedElement('exercise_tab');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await wait(4000); // Réduit de 5000 à 4000ms pour une transition plus fluide
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapterWithSam:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightedElement(null);
    }
  };

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
            setTimeout(() => {
              if (!stopSignalRef.current) {
                setHighlightedElement('');
              }
            }, 300);
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
      await speak("Salut ! Voici les exercices de multiplication !");
      if (stopSignalRef.current) return;

      await speak("Il y a 3 méthodes différentes !");
      await wait(500);
      scrollToElement('method-navigation');
      setHighlightedElement('method-navigation');
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await speak("Le sens !");
      setHighlightedElement('method-sens');
      await wait(800);
      if (stopSignalRef.current) return;
      
      await speak("L'addition répétée !");
      setHighlightedElement('method-addition');
      await wait(800);
      if (stopSignalRef.current) return;
      
      await speak("Et les groupes égaux !");
      setHighlightedElement('method-groupes');
      await wait(800);
      if (stopSignalRef.current) return;
      
      await speak("Voici la première question !");
      await wait(500);
      scrollToElement('current-exercise');
      setHighlightedElement('current-exercise');
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await speak("Voici le bouton pour écouter l'énoncé !");
      // Chercher et mettre en évidence le bouton d'écoute s'il existe
      setHighlightedElement('listen-button');
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await speak("Tu peux ensuite sélectionner ta réponse !");
      await wait(500);
      scrollToElement('answer-choices');
      setHighlightedElement('answer-choices');
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await speak("Si ta réponse n'est pas bonne, je t'aiderai lors de la correction !");
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await speak("C'est parti !");
      await wait(500);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await wait(1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'explication des exercices:', error);
    } finally {
      if (!stopSignalRef.current) {
        setExercisesIsPlayingVocal(false);
        setHighlightedElement('');
        setActiveSpeakingButton(null);
      }
    }
  };

  // Fonction pour expliquer le texte avec animation
  const explainText = async () => {
    if (isExplainingText) return;
    
    setIsExplainingText(true);
    stopSignalRef.current = false;
    
    try {
      playAudio("La multiplication, c'est une façon rapide de compter quand on a plusieurs groupes identiques !");
      setHighlightedTextPart('definition');
      await wait(4000);
      if (stopSignalRef.current) return;
      
      playAudio("Par exemple, au lieu de compter 3 plus 3 plus 3 plus 3, on peut dire 4 fois 3 !");
      setHighlightedTextPart('example');
      await wait(4000);
      if (stopSignalRef.current) return;
      
      playAudio("Le signe de la multiplication, c'est le petit x ou le point !");
      setHighlightedTextPart('symbol');
      await wait(3500);
      if (stopSignalRef.current) return;
      
      playAudio("C'est très pratique pour compter rapidement des objets en groupes !");
      setHighlightedTextPart('practical');
      await wait(3500);
      
    } catch (error) {
      console.error('Erreur dans explainText:', error);
    } finally {
      setIsExplainingText(false);
      setHighlightedTextPart(null);
    }
  };

  // Fonction pour l'animation d'addition répétée
  const explainAdditionRepetee = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(index);
    
    const example = additionRepeteeExamples[index];
    
    try {
      playAudio(`Regardons cette situation : ${example.story}`);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('setup');
      playAudio(`Nous avons ${example.groups} groupes de ${example.itemsPerGroup} objets`);
      await wait(3000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('groups');
      playAudio(`Au lieu de multiplier, écrivons l'addition répétée : ${example.addition}`);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('counting');
      playAudio(`Additionner ${example.itemsPerGroup} plusieurs fois nous donne le même résultat !`);
      await wait(3000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('result');
      playAudio(`${example.concept}`);
      await wait(4000);
      
    } catch (error) {
      console.error('Erreur dans explainAdditionRepetee:', error);
    } finally {
      setIsAnimationRunning(false);
      setAnimatingStep(null);
      setCurrentExample(null);
    }
  };

  // Fonction pour l'animation de groupes égaux
  const explainGroupesEgaux = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(index);
    
    const example = groupesEgauxExamples[index];
    
    try {
      playAudio(`Regardons cette situation : ${example.story}`);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('setup');
      playAudio(`Formons ${example.groups} groupes égaux`);
      await wait(3000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('groups');
      setCurrentGroup(0);
      for (let i = 0; i < example.groups; i++) {
        if (stopSignalRef.current) return;
        setCurrentGroup(i);
        playAudio(`Groupe ${i + 1} : exactement ${example.itemsPerGroup} objets`);
        await wait(2000);
      }
      if (stopSignalRef.current) return;
      
      setAnimatingStep('counting');
      playAudio(`Tous les groupes ont le même nombre d'objets : ils sont égaux !`);
      await wait(3000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('result');
      playAudio(`${example.concept}`);
      await wait(4000);
      
    } catch (error) {
      console.error('Erreur dans explainGroupesEgaux:', error);
    } finally {
      setIsAnimationRunning(false);
      setAnimatingStep(null);
      setCurrentExample(null);
      setCurrentGroup(0);
    }
  };

  // Fonction pour expliquer un exemple spécifique (SENS uniquement)
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(index);
    
    const example = multiplicationExamples[index];
    
    try {
      playAudio(`Regardons cette situation : ${example.story}`);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('setup');
      playAudio(`Nous avons ${example.groups} groupes. Dans chaque groupe, il y a ${example.itemsPerGroup} objets`);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('groups');
      playAudio(`Voici les ${example.groups} groupes bien séparés. Chaque groupe a exactement ${example.itemsPerGroup} objets`);
      await wait(4000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('counting');
      playAudio(`Pour compter rapidement, nous pouvons utiliser la multiplication !`);
      await wait(3000);
      if (stopSignalRef.current) return;
      
      setAnimatingStep('result');
      playAudio(`${example.concept} ! C'est ça, le sens de la multiplication !`);
      await wait(4000);
      
    } catch (error) {
      console.error('Erreur dans explainSpecificExample:', error);
    } finally {
      setIsAnimationRunning(false);
      setAnimatingStep(null);
      setCurrentExample(null);
    }
  };

  // Fonction pour les exercices par méthode
  const handleAnswerClick = (answer: string) => {
    if (!currentExercise) return;
    
    // Vérification spéciale pour les exercices d'addition répétée
    let correct = answer === currentExercise.correctAnswer;
    
    // Pour les exercices d'addition répétée, accepter les deux formes de multiplication
    if (currentMethodBlock === 'addition' && !correct) {
      // Extraire les nombres de la réponse correcte et de la réponse donnée
      const correctMatch = currentExercise.correctAnswer.match(/(\d+)\s*fois\s*(\d+)/);
      const answerMatch = answer.match(/(\d+)\s*fois\s*(\d+)/);
      
      if (correctMatch && answerMatch) {
        const [, correctNum1, correctNum2] = correctMatch;
        const [, answerNum1, answerNum2] = answerMatch;
        
        // Accepter les deux formes : a×b et b×a
        correct = (correctNum1 === answerNum1 && correctNum2 === answerNum2) ||
                 (correctNum1 === answerNum2 && correctNum2 === answerNum1);
      }
    }
    
    setIsCorrect(correct);
    
    if (correct) {
      // Mettre à jour le progrès
      setMethodProgress(prev => ({
        ...prev,
        [currentMethodBlock]: {
          ...prev[currentMethodBlock as keyof typeof prev],
          completed: prev[currentMethodBlock as keyof typeof prev].completed + 1
        }
      }));
      
      // Passer automatiquement au suivant après 2 secondes
      setTimeout(() => {
        nextExercise();
      }, 2000);
    } else {
      // Déclencher l'animation et le vocal pour mauvaise réponse
      showWrongAnswerFeedback();
    }
  };

  const nextExercise = () => {
    if (currentExerciseInBlock + 1 < currentExercises.length) {
      // Exercice suivant dans le même bloc
      setCurrentExerciseInBlock(prev => prev + 1);
      setIsCorrect(null);
    } else {
      // Bloc terminé - marquer comme complété et afficher modal
      setCompletedMethods(prev => [...prev, currentMethodBlock]);
      setShowCompletionModal(true);
    }
  };

  // Navigation entre les blocs de méthodes
  const switchToMethod = (method: string) => {
    setCurrentMethodBlock(method);
    setCurrentExerciseInBlock(0);
    setIsCorrect(null);
  };

  // Animation et vocal pour mauvaise réponse avec présentation détaillée
  const showWrongAnswerFeedback = async () => {
    if (!currentExercise) return;
    
    setShowWrongAnswerAnimation(true);
    setIsPlayingWrongAnswerVocal(true);
    
    const speak = (text: string) => {
      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        const voices = speechSynthesis.getVoices();
        const frenchVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && voice.localService === true
        );
        
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }
        
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        
        speechSynthesis.speak(utterance);
      });
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Fonction pour scroller vers un élément avec animation
    const scrollToElementSmooth = (elementId: string) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // S'assurer que l'élément est bien visible
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };
    
    try {
      // Scroll immédiatement vers la section de correction avant tout vocal
      console.log('🔍 Tentative de scroll vers correction-section');
      
      // Attendre que l'animation d'affichage soit terminée
      await wait(200);
      
      // Scroll direct et forcé vers la correction
      const correctionElement = document.getElementById('correction-section');
      if (correctionElement) {
        console.log('✅ Élément correction trouvé, scroll en cours...');
        correctionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        // Double scroll pour s'assurer
        setTimeout(() => {
          correctionElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }, 300);
      } else {
        console.log('❌ Élément correction-section non trouvé');
      }
      
      await wait(800); // Attendre que le scroll soit bien visible
      
      // Message d'introduction adapté selon la méthode
      let introMessage = "";
      switch (currentMethodBlock) {
        case 'sens':
          introMessage = "Ce n'est pas tout à fait ça ! Regardons ensemble la bonne réponse.";
          break;
        case 'addition':
          introMessage = "Pas encore ! Regardons comment faire cette addition répétée.";
          break;
        case 'groupes':
          introMessage = "Presque ! Regardons comment organiser ces groupes égaux.";
          break;
        default:
          introMessage = "Regardons ensemble la correction.";
      }
      
      await speak(introMessage);
      await wait(1000);
      
      // Annoncer la bonne réponse
      await speak(`La bonne réponse est : ${currentExercise.correctAnswer}`);
      await wait(1500);
      
      // Explication détaillée selon la méthode
      if (currentMethodBlock === 'addition' && currentExercise.visual) {
        await speak("Voici comment cela se présente visuellement :");
        await wait(1000);
        
        // Scroll vers la visualisation
        scrollToElementSmooth('visual-illustration');
        await wait(1500);
        
        if (currentExercise.visualExplanation) {
          await speak(currentExercise.visualExplanation);
          await wait(2000);
        }
        
        if (currentExercise.additionSteps) {
          await speak("Voici le résultat final de l'addition :");
          await wait(1000);
          
          // Montrer seulement la dernière étape (résultat final)
          const lastStepIndex = currentExercise.additionSteps.length - 1;
          const finalStep = currentExercise.additionSteps[lastStepIndex];
          setHighlightedElement(`addition-step-${lastStepIndex}`);
          await speak(`${finalStep}`);
          await wait(2000);
          setHighlightedElement('');
        }
      }
      
      if (currentMethodBlock === 'groupes' && currentExercise.visual) {
        await speak("Voici comment organiser ces objets :");
        await wait(1000);
        
        scrollToElementSmooth('visual-illustration');
        await wait(1500);
        
        if (currentExercise.visualExplanation) {
          await speak(currentExercise.visualExplanation);
          await wait(2000);
        }
        
        if (currentExercise.groups && currentExercise.itemsPerGroup) {
          await speak(`On fait ${currentExercise.groups} groupes de ${currentExercise.itemsPerGroup} objets chacun.`);
          await wait(2000);
          
          // Highlight le calcul
          setHighlightedElement('groupes-calculation');
          await speak(`Cela nous donne : ${currentExercise.groups} fois ${currentExercise.itemsPerGroup} égale ${currentExercise.groups * currentExercise.itemsPerGroup}`);
          await wait(3000);
          setHighlightedElement('');
        }
      }
      
      // Message de fin
      await speak("Maintenant tu peux passer à l'exercice suivant !");
      
      // Scroll final vers la correction pour s'assurer qu'elle reste visible
      const finalCorrectionElement = document.getElementById('correction-section');
      if (finalCorrectionElement) {
        finalCorrectionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
      
    } catch (error) {
      console.error('Erreur dans showWrongAnswerFeedback:', error);
    } finally {
      setIsPlayingWrongAnswerVocal(false);
      setHighlightedElement('');
      setTimeout(() => {
        setShowWrongAnswerAnimation(false);
      }, 1000);
    }
  };

  const resetExercises = () => {
    setCurrentMethodBlock('sens');
    setCurrentExerciseInBlock(0);
    setCompletedMethods([]);
    setMethodProgress({
      sens: { completed: 0, total: 6 },
      addition: { completed: 0, total: 5 },
      groupes: { completed: 0, total: 5 },
      synthese: { completed: 0, total: 4 }
    });
    setUserAnswer('');
    setIsCorrect(null);
    setShowCompletionModal(false);
  };

  // Fonction pour lire l'énoncé
  const readCurrentQuestion = () => {
    if (!currentExercise) return;
    const currentQuestion = currentExercise.question;
    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    
    const voices = speechSynthesis.getVoices();
    const frenchVoice = voices.find(voice => 
      voice.lang === 'fr-FR' && voice.localService === true
    );
    
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }
    
    speechSynthesis.speak(utterance);
  };

  // Fonction pour rendre les groupes visuels
  const renderMultiplicationGroups = (groups: number, itemsPerGroup: number, item: string) => {
    const allGroups = [];
    
    for (let g = 0; g < groups; g++) {
      const groupItems = [];
      for (let i = 0; i < itemsPerGroup; i++) {
        groupItems.push(
          <div 
            key={`${g}-${i}`} 
            className={`text-2xl transition-all duration-500 ${
              animatingStep === 'groups' && g <= currentGroup ? 'animate-bounce' : ''
            } ${animatingStep === 'counting' ? 'animate-pulse' : ''}`}
            style={{ animationDelay: `${(g * itemsPerGroup + i) * 100}ms` }}
          >
            {item}
          </div>
        );
      }
      
      allGroups.push(
        <div 
          key={g} 
          className={`border-2 border-dashed border-blue-300 rounded-lg p-3 bg-blue-50/50 ${
            animatingStep === 'groups' && g === currentGroup ? 'ring-4 ring-blue-400 bg-blue-100' : ''
          }`}
        >
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {groupItems}
          </div>
          <div className="text-center mt-2 text-sm font-semibold text-blue-600">
            Groupe {g + 1}
          </div>
        </div>
      );
    }
    
    return allGroups;
  };

  // Gestion des événements pour arrêter les vocaux
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

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    return () => {
      stopAllVocalsAndAnimations();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Bouton Stop flottant */}
      {(isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal || isExplainingText || isPlayingWrongAnswerVocal) && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title={(isPlayingVocal || exercisesIsPlayingVocal || isExplainingText || isPlayingWrongAnswerVocal) ? "Arrêter le personnage" : "Arrêter l'animation"}
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
                {(isPlayingVocal || exercisesIsPlayingVocal || isExplainingText || isPlayingWrongAnswerVocal) ? 'Stop' : 'Stop Animation'}
              </span>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
            </>
          </button>
        </div>
      )}

      {/* CSS pour les animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes speak-animation {
            0%, 100% { 
              background-color: rgb(34, 197, 94); 
              transform: scale3d(1, 1, 1);
            }
            50% { 
              background-color: rgb(22, 163, 74); 
              transform: scale3d(1.05, 1.05, 1);
            }
          }
          
          .speaking-button {
            animation: speak-animation 1s infinite;
            color: white !important;
            background-color: rgb(34, 197, 94) !important;
            will-change: transform, background-color;
          }
          
          .speaking-input {
            animation: speak-animation 1s infinite;
            border-color: rgb(34, 197, 94) !important;
          }
          
          @keyframes result-reveal {
            0% {
              opacity: 0;
              transform: scale3d(0.8, 0.8, 1);
            }
            100% {
              opacity: 1;
              transform: scale3d(1, 1, 1);
            }
          }
          
          .animate-result-reveal {
            animation: result-reveal 0.8s ease-out forwards;
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translate3d(0, 20px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          @keyframes scale-102 {
            0% { transform: scale3d(1, 1, 1); }
            50% { transform: scale3d(1.02, 1.02, 1); }
            100% { transform: scale3d(1.02, 1.02, 1); }
          }
          
          .hover\\:scale-102:hover {
            animation: scale-102 0.2s ease-out forwards;
          }
          
          @keyframes text-highlight {
            0% { 
              transform: scale3d(1, 1, 1);
              filter: brightness(1);
            }
            50% { 
              transform: scale3d(1.05, 1.05, 1);
              filter: brightness(1.1);
            }
            100% { 
              transform: scale3d(1, 1, 1);
              filter: brightness(1);
            }
          }
          
          .animate-text-highlight {
            animation: text-highlight 2s ease-in-out infinite;
            will-change: transform, filter;
          }
          
          /* Optimisations pour réduire les tremblements */
          .animate-bounce, .animate-pulse {
            will-change: transform;
            backface-visibility: hidden;
            perspective: 1000px;
          }
          
          .transition-all {
            will-change: transform, opacity;
            backface-visibility: hidden;
          }
          
          /* Amélioration des performances de scroll */
          html {
            scroll-behavior: smooth;
          }
        `
      }} />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/chapitre/ce1-quatre-operations/multiplication-ce1" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="text-center bg-white rounded-xl p-3 sm:p-6 shadow-lg">
            <h1 className="text-xl sm:text-4xl font-bold text-gray-800 mb-2">
              <span className="sm:hidden">✖️ Le sens de la multiplication</span>
              <span className="hidden sm:inline">✖️ La multiplication : sens et méthodes</span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-600">
              <span className="sm:hidden">Addition répétée et groupes</span>
              <span className="hidden sm:inline">Sens, addition répétée et groupes égaux - Niveau CE1</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
            }}
            disabled={isPlayingVocal || exercisesIsPlayingVocal}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              isPlayingVocal || exercisesIsPlayingVocal
                ? 'bg-gray-200 text-gray-700 cursor-not-allowed opacity-75'
                : !showExercises
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            id="exercise_tab"
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            disabled={isPlayingVocal || exercisesIsPlayingVocal}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
              isPlayingVocal || exercisesIsPlayingVocal
                ? 'bg-gray-200 text-gray-700 cursor-not-allowed opacity-75'
                : showExercises
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-6">
            {/* Section Steve */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              <div className={`relative transition-all duration-500 ${
                isPlayingVocal
                  ? 'w-14 sm:w-20 h-14 sm:h-20'
                  : samSizeExpanded
                    ? 'w-20 sm:w-32 h-20 sm:h-32'
                    : 'w-14 sm:w-20 h-14 sm:h-20'
              } border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center hover:scale-105 cursor-pointer`}>
                {!imageError && (
                  <img 
                    src="/image/Minecraftstyle.png"
                    alt="Sam"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-xl sm:text-2xl">🧱</div>
                )}
                
                {isPlayingVocal && (
                  <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 shadow-lg animate-bounce">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <button
                onClick={explainChapterWithSam}
                disabled={isPlayingVocal}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-lg transition-all ${
                  isPlayingVocal
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
                } ${!hasStarted && !isPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingVocal ? 'Steve explique...' : 'DÉMARRER'}
              </button>
            </div>

            {/* Texte explicatif avec animations interactives */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-blue-100">
              
              {/* Bouton d'explication intégré dans la box */}
              <div className="text-center mb-4 sm:mb-6">
                <button
                  id="explain-text-button"
                  onClick={() => explainText('Definition')}
                  disabled={isExplainingText || isPlayingVocal}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                    isExplainingText || isPlayingVocal
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  } ${highlightedElement === 'explain-text-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}
                >
                  {isExplainingText ? '🎤 Explication en cours...' : '📖 Explication : Qu\'est-ce que la multiplication ?'}
                </button>
              </div>
              <div className="space-y-2 sm:space-y-4">
                
                {/* Section 1: Définition */}
                <div 
                  className={`bg-gray-50 rounded-lg p-3 sm:p-6 border-l-4 border-purple-400 transition-all duration-500 ${
                    highlightedTextPart === 'definition' 
                      ? 'bg-purple-100 shadow-lg' 
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isExplainingText) {
                      setHighlightedTextPart('definition');
                      setTimeout(() => setHighlightedTextPart(null), 3000);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xl sm:text-2xl">🎯</div>
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">
                      DÉFINITION
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm sm:text-lg leading-relaxed">
                    <strong className="text-purple-700">La multiplication</strong>, c'est une façon rapide de compter quand on a plusieurs <strong className="text-blue-600">groupes identiques</strong>.
                  </p>
                </div>

                {/* Section 2: Exemple avec animation */}
                <div 
                  className={`bg-gray-50 rounded-lg p-3 sm:p-6 border-l-4 border-blue-400 transition-all duration-500 ${
                    highlightedTextPart === 'example' 
                      ? 'bg-blue-100 shadow-lg' 
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isExplainingText) {
                      setHighlightedTextPart('example');
                      setTimeout(() => setHighlightedTextPart(null), 4000);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xl sm:text-2xl">💡</div>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">
                      EXEMPLE
                    </span>
                  </div>
                  
                  <p className="text-gray-800 text-sm sm:text-lg mb-3">
                    Par exemple, au lieu de compter...
                  </p>
                  
                  {/* Animation des additions */}
                  <div className="bg-white p-3 rounded-lg border border-gray-300 mb-3">
                    <div className="flex items-center justify-center gap-2 flex-wrap text-base sm:text-lg">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">3</span>
                      <span className="text-gray-600 font-bold">+</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">3</span>
                      <span className="text-gray-600 font-bold">+</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">3</span>
                      <span className="text-gray-600 font-bold">+</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">3</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl mb-2">⬇️</div>
                    <p className="text-gray-800 text-sm sm:text-lg mb-2">
                      on peut dire
                    </p>
                    <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg sm:text-xl">
                      4 × 3
                    </div>
                    <p className="text-gray-800 text-sm sm:text-lg mt-2">
                      C'est plus rapide ! 🚀
                    </p>
                  </div>
                </div>

                {/* Section 3: Symbole avec animation */}
                <div 
                  className={`bg-gray-50 rounded-lg p-3 sm:p-6 border-l-4 border-red-400 transition-all duration-500 ${
                    highlightedTextPart === 'symbol' 
                      ? 'bg-red-100 shadow-lg' 
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isExplainingText) {
                      setHighlightedTextPart('symbol');
                      setTimeout(() => setHighlightedTextPart(null), 3000);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xl sm:text-2xl">🔤</div>
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">
                      SYMBOLE
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm sm:text-lg">
                    Le signe de la multiplication est <span className="text-2xl sm:text-3xl font-bold text-red-600 mx-1">×</span>
                  </p>
                </div>

                {/* Section 4: Utilité pratique */}
                <div 
                  className={`bg-gray-50 rounded-lg p-3 sm:p-6 border-l-4 border-green-400 transition-all duration-500 ${
                    highlightedTextPart === 'practical' 
                      ? 'bg-green-100 shadow-lg' 
                      : 'hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isExplainingText) {
                      setHighlightedTextPart('practical');
                      setTimeout(() => setHighlightedTextPart(null), 3000);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-xl sm:text-2xl">🎯</div>
                    <p className="text-gray-800 text-sm sm:text-lg">
                      C'est très pratique pour compter rapidement des objets en <strong className="text-green-700">groupes</strong> !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemple principal */}
            <div 
              id="example-section"
              className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 ${
                highlightedElement === 'example-section' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                🎯 Comprendre le sens : 3 fois 4
              </h2>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-center mb-4">
                  <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                    {multiplicationExamples[0].story}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {multiplicationExamples[0].description}
                  </p>
                </div>
                
                <button
                  onClick={() => explainSpecificExample(0)}
                  disabled={isAnimationRunning || isPlayingVocal}
                  className={`w-full mb-4 px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                    isAnimationRunning || isPlayingVocal
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                  }`}
                >
                  {isAnimationRunning ? '🎬 Animation en cours...' : '▶️ Voir l\'animation'}
                </button>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 justify-items-center">
                    {renderMultiplicationGroups(3, 4, '🍎')}
                  </div>
                  
                  {currentExample === 0 && animatingStep === 'result' && (
                    <div className="text-center mt-6">
                      <div className="bg-green-100 text-green-800 p-4 rounded-lg animate-fade-in">
                        <p className="text-xl sm:text-2xl font-bold">{multiplicationExamples[0].concept}</p>
                        <p className="text-sm sm:text-base mt-2">C'est plus rapide que de compter un par un !</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                ✖️ Le sens de la multiplication
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Comprendre ce que signifie la multiplication : compter des groupes rapidement !
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {multiplicationExamples.slice(1).map((example, index) => (
                  <div 
                    key={index + 1}
                    className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-200 transition-all ${
                      highlightedElement === `example-${index + 1}` ? 'ring-4 ring-green-400 bg-green-100' : ''
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{example.item}</div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2">
                        {example.description}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        {example.story}
                      </p>
                      <div className="bg-white p-2 rounded border mb-3">
                        <p className="text-sm font-semibold text-green-600">
                          Sens : {example.groups} groupes de {example.itemsPerGroup}
                        </p>
                        <p className="text-xs text-gray-500">
                          = {example.groups * example.itemsPerGroup} objets
                        </p>
                      </div>

                      {/* Animation visuelle pour le sens */}
                      {currentExample === (index + 1) && animatingStep && (
                        <div className="bg-white p-3 rounded-lg border-2 border-green-300 mb-3">
                          {animatingStep === 'setup' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-green-800">🎯 Situation :</p>
                              <div className="flex justify-center gap-1">
                                {Array.from({length: example.groups}).map((_, groupIndex) => (
                                  <div key={groupIndex} className="bg-green-100 p-2 rounded border animate-pulse">
                                    {Array.from({length: example.itemsPerGroup}).map((_, itemIndex) => (
                                      <span key={itemIndex} className="text-lg">{example.item}</span>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'groups' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-green-800">👁️ Observation :</p>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-600 animate-bounce">
                                  {example.groups} groupes identiques
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  de {example.itemsPerGroup} objets chacun
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'counting' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-green-800">⚡ Multiplication :</p>
                              <div className="text-center animate-pulse">
                                <div className="text-lg text-green-600">
                                  {example.groups} × {example.itemsPerGroup}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Compter rapidement !
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'result' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-green-800">✅ Résultat :</p>
                              <div className="text-center animate-bounce">
                                <div className="text-lg font-bold text-green-600">
                                  {example.groups * example.itemsPerGroup} objets !
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {example.concept}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => explainSpecificExample(index + 1)}
                      disabled={isAnimationRunning || isPlayingVocal}
                      className={`w-full px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        isAnimationRunning || isPlayingVocal
                          ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105'
                      }`}
                    >
                      {isAnimationRunning && currentExample === (index + 1) ? '🎬 Animation...' : '▶️ Voir l\'animation'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone d'animation pour les exemples */}
            {currentExample !== null && currentExample > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">
                  🎬 Comprendre le sens : {multiplicationExamples[currentExample].description}
                </h3>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                      {multiplicationExamples[currentExample].story}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {multiplicationExamples[currentExample].groups} groupes de {multiplicationExamples[currentExample].itemsPerGroup} objets
                    </p>
                  </div>
                  
                  <div className={`grid gap-4 justify-items-center ${
                    multiplicationExamples[currentExample].groups <= 3 ? 'grid-cols-3' : 
                    multiplicationExamples[currentExample].groups === 4 ? 'grid-cols-4' : 'grid-cols-5'
                  }`}>
                    {renderMultiplicationGroups(
                      multiplicationExamples[currentExample].groups,
                      multiplicationExamples[currentExample].itemsPerGroup,
                      multiplicationExamples[currentExample].item
                    )}
                  </div>
                  
                  {animatingStep === 'result' && (
                    <div className="text-center mt-6">
                      <div className="bg-green-100 text-green-800 p-4 rounded-lg animate-fade-in">
                        <p className="text-xl sm:text-2xl font-bold">
                          {multiplicationExamples[currentExample].concept}
                        </p>
                        <p className="text-sm sm:text-base mt-2">C'est le sens de la multiplication : compter des groupes rapidement !</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section Addition Répétée */}
            <div id="addition-repetee-section" className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                ➕ Méthode 1 : L'addition répétée
              </h2>
              <p className="text-center text-gray-600 mb-6">
                La multiplication, c'est additionner plusieurs fois le même nombre !
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionRepeteeExamples.map((example, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border-2 border-orange-200"
                  >
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{example.item}</div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2">
                        {example.description}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        {example.story}
                      </p>
                      <div className="bg-white p-2 rounded border mb-3">
                        <p className="text-sm font-semibold text-orange-600">
                          Addition : {example.addition}
                        </p>
                        <p className="text-xs text-gray-500">
                          = {example.groups * example.itemsPerGroup}
                        </p>
                      </div>
                      
                      {/* Animation visuelle pour addition répétée */}
                      {currentExample === index && animatingStep && (
                        <div className="bg-white p-3 rounded-lg border-2 border-orange-300 mb-3">
                          {animatingStep === 'setup' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-orange-800">🎯 Situation :</p>
                              <div className="flex justify-center gap-1">
                                {Array.from({length: example.groups}).map((_, groupIndex) => (
                                  <div key={groupIndex} className="bg-orange-100 p-2 rounded border animate-pulse">
                                    {Array.from({length: example.itemsPerGroup}).map((_, itemIndex) => (
                                      <span key={itemIndex} className="text-lg">{example.item}</span>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'groups' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-orange-800">➕ Addition répétée :</p>
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-600 animate-bounce">
                                  {example.addition}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  = {example.groups * example.itemsPerGroup}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'counting' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-orange-800">🔢 Calcul :</p>
                              <div className="text-center animate-pulse">
                                <div className="text-lg text-orange-600">
                                  {example.itemsPerGroup} × {example.groups} = {example.groups * example.itemsPerGroup}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'result' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-green-800">✅ Résultat :</p>
                              <div className="text-center animate-bounce">
                                <div className="text-lg font-bold text-green-600">
                                  {example.groups * example.itemsPerGroup} objets !
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => explainAdditionRepetee(index)}
                        disabled={isAnimationRunning}
                        className={`w-full px-3 py-2 rounded-lg font-semibold transition-all ${
                          isAnimationRunning && currentExample === index
                            ? 'bg-orange-300 text-orange-700 cursor-not-allowed'
                            : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
                        }`}
                      >
                        {isAnimationRunning && currentExample === index ? '🎬 Animation...' : '▶️ Voir l\'animation'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Groupes Égaux */}
            <div id="groupes-egaux-section" className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                ⚖️ Méthode 2 : Les groupes égaux
              </h2>
              <p className="text-center text-gray-600 mb-6">
                La multiplication, c'est organiser en groupes qui ont tous le même nombre d'objets !
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupesEgauxExamples.map((example, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200"
                  >
                    <div className="text-center mb-3">
                      <div className="text-3xl mb-2">{example.item}</div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2">
                        {example.description}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3">
                        {example.story}
                      </p>
                      <div className="bg-white p-2 rounded border mb-3">
                        <p className="text-sm font-semibold text-blue-600">
                          {example.groups} groupes égaux
                        </p>
                        <p className="text-xs text-gray-500">
                          de {example.itemsPerGroup} objets chacun
                        </p>
                      </div>
                      
                      {/* Animation visuelle pour groupes égaux */}
                      {currentExample === index && animatingStep && (
                        <div className="bg-white p-3 rounded-lg border-2 border-blue-300 mb-3">
                          {animatingStep === 'setup' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-blue-800">🎯 Situation :</p>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Préparons {example.groups} groupes égaux</p>
                                <div className="flex justify-center gap-2 mt-2">
                                  {Array.from({length: example.groups}).map((_, groupIndex) => (
                                    <div key={groupIndex} className="bg-blue-100 p-2 rounded border-2 border-dashed border-blue-300 animate-pulse">
                                      <div className="text-xs text-blue-600">Groupe {groupIndex + 1}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'groups' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-blue-800">⚖️ Formation des groupes :</p>
                              <div className="flex justify-center gap-2">
                                {Array.from({length: example.groups}).map((_, groupIndex) => (
                                  <div key={groupIndex} className={`p-2 rounded border-2 transition-all duration-500 ${
                                    groupIndex === currentGroup 
                                      ? 'bg-blue-200 border-blue-500 animate-bounce shadow-lg scale-110' 
                                      : groupIndex < currentGroup 
                                        ? 'bg-green-100 border-green-400'
                                        : 'bg-blue-50 border-blue-200'
                                  }`}>
                                    <div className="text-xs text-blue-600 mb-1">Groupe {groupIndex + 1}</div>
                                    <div className="flex flex-wrap justify-center gap-1">
                                      {Array.from({length: example.itemsPerGroup}).map((_, itemIndex) => (
                                        <span key={itemIndex} className="text-sm">{example.item}</span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'counting' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-blue-800">🔍 Vérification :</p>
                              <div className="text-center">
                                <div className="text-lg text-blue-600 animate-pulse">
                                  Chaque groupe a {example.itemsPerGroup} objets
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Ils sont tous égaux !
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {animatingStep === 'result' && (
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-green-800">✅ Résultat :</p>
                              <div className="text-center animate-bounce">
                                <div className="text-lg font-bold text-green-600">
                                  {example.groups} × {example.itemsPerGroup} = {example.groups * example.itemsPerGroup}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => explainGroupesEgaux(index)}
                        disabled={isAnimationRunning}
                        className={`w-full px-3 py-2 rounded-lg font-semibold transition-all ${
                          isAnimationRunning && currentExample === index
                            ? 'bg-blue-300 text-blue-700 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                        }`}
                      >
                        {isAnimationRunning && currentExample === index ? '🎬 Animation...' : '▶️ Voir l\'animation'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Synthèse */}
            <div id="synthese-section" className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                🎯 Synthèse : Trois façons de voir la multiplication
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">✖️ Le sens</h3>
                  <p className="text-sm text-gray-600">
                    Compter des groupes identiques rapidement
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
                  <h3 className="font-bold text-orange-800 mb-2">➕ Addition répétée</h3>
                  <p className="text-sm text-gray-600">
                    3 × 4 = 4 + 4 + 4
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-bold text-blue-800 mb-2">⚖️ Groupes égaux</h3>
                  <p className="text-sm text-gray-600">
                    3 groupes de 4 objets
                  </p>
                </div>
              </div>

              {/* Exemple interactif de synthèse */}
              <div className="bg-white p-6 rounded-lg border-2 border-purple-200 mb-6">
                <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
                  🎪 Exemple : 3 × 4 avec les 3 méthodes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded border-2 border-green-200">
                    <div className="text-green-800 font-semibold mb-2">✖️ Le sens</div>
                    <div className="text-2xl mb-2">🍎🍎🍎🍎</div>
                    <div className="text-2xl mb-2">🍎🍎🍎🍎</div>
                    <div className="text-2xl mb-2">🍎🍎🍎🍎</div>
                    <div className="text-sm text-green-600">3 groupes de 4 pommes</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded border-2 border-orange-200">
                    <div className="text-orange-800 font-semibold mb-2">➕ Addition</div>
                    <div className="text-lg text-orange-600 mb-2">4 + 4 + 4</div>
                    <div className="text-sm text-orange-600 mb-2">= 8 + 4</div>
                    <div className="text-sm text-orange-600 mb-2">= 12</div>
                    <div className="text-sm text-orange-600">Additionner 3 fois</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded border-2 border-blue-200">
                    <div className="text-blue-800 font-semibold mb-2">⚖️ Groupes</div>
                    <div className="flex justify-center gap-2 mb-2">
                      <div className="bg-blue-100 p-1 rounded text-xs">
                        <div>🍎🍎</div>
                        <div>🍎🍎</div>
                      </div>
                      <div className="bg-blue-100 p-1 rounded text-xs">
                        <div>🍎🍎</div>
                        <div>🍎🍎</div>
                      </div>
                      <div className="bg-blue-100 p-1 rounded text-xs">
                        <div>🍎🍎</div>
                        <div>🍎🍎</div>
                      </div>
                    </div>
                    <div className="text-sm text-blue-600">3 groupes égaux</div>
                  </div>
                </div>
                <div className="text-center mt-4 p-3 bg-purple-100 rounded-lg">
                  <div className="text-xl font-bold text-purple-800">
                    Résultat : 3 × 4 = 12 🎉
                  </div>
                  <div className="text-sm text-purple-600 mt-1">
                    Les trois méthodes donnent le même résultat !
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">
                  🎉 Toutes ces méthodes donnent le même résultat !
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Tu peux utiliser celle que tu préfères pour comprendre la multiplication !
                </p>
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

            {/* Bouton DÉMARRER pour les exercices avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage pour les exercices */}
              <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 ${
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
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🤖
                  </div>
                )}
                
                {/* Indicateur de parole */}
                {exercisesIsPlayingVocal && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 shadow-lg animate-bounce">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour les exercices */}
              <button
                onClick={explainExercisesWithSam}
                disabled={exercisesIsPlayingVocal}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                  exercisesIsPlayingVocal
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105'
                } ${!exercisesHasStarted && !exercisesIsPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {exercisesIsPlayingVocal ? 'Le personnage explique...' : 'DÉMARRER LES EXERCICES'}
              </button>
            </div>

            {/* Navigation par méthodes */}
            <div id="method-navigation" className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6 text-center">
                🎯 <span className="hidden sm:inline">Exercices par méthode</span><span className="sm:hidden">Méthodes</span>
              </h2>
              
              {/* Barre de navigation des méthodes */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 mb-3 sm:mb-6">
                {[
                  { key: 'sens', name: 'Le sens', shortName: 'Sens', icon: '✖️', color: 'green' },
                  { key: 'addition', name: 'Addition répétée', shortName: 'Addition', icon: '➕', color: 'orange' },
                  { key: 'groupes', name: 'Groupes égaux', shortName: 'Groupes', icon: '⚖️', color: 'blue' }
                ].map((method) => (
                  <button
                    key={method.key}
                    id={`method-${method.key}`}
                    onClick={() => switchToMethod(method.key)}
                    className={`p-2 sm:p-3 rounded-lg font-semibold text-xs sm:text-sm transition-all border-2 sm:min-w-[140px] sm:flex-1 sm:max-w-[200px] ${
                      currentMethodBlock === method.key
                        ? `bg-${method.color}-500 text-white border-${method.color}-500`
                        : `bg-${method.color}-50 text-${method.color}-700 border-${method.color}-200 hover:bg-${method.color}-100`
                    } ${highlightedElement === `method-${method.key}` ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}
                  >
                    <div className="text-sm sm:text-lg mb-1">{method.icon}</div>
                    <div className="text-xs sm:text-sm font-bold leading-tight">
                      <span className="sm:hidden">{method.shortName}</span>
                      <span className="hidden sm:inline">{method.name}</span>
                    </div>
                    <div className="text-xs mt-1 font-medium opacity-90">
                      {methodProgress[method.key as keyof typeof methodProgress].completed} / {methodProgress[method.key as keyof typeof methodProgress].total}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Barre de progression globale - plus petite sur mobile */}
              <div className="bg-gray-200 rounded-full h-2 sm:h-3 mb-2 sm:mb-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((methodProgress.sens.completed + methodProgress.addition.completed + methodProgress.groupes.completed) / 
                           (methodProgress.sens.total + methodProgress.addition.total + methodProgress.groupes.total)) * 100}%` 
                  }}
                ></div>
              </div>
              
              <div className="text-center text-xs sm:text-sm text-gray-600">
                <span className="hidden sm:inline">Progression globale : </span>{methodProgress.sens.completed + methodProgress.addition.completed + methodProgress.groupes.completed} / {methodProgress.sens.total + methodProgress.addition.total + methodProgress.groupes.total}
              </div>
            </div>

            {/* Exercices */}
            <div id="current-exercise" className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h2 className="text-sm sm:text-2xl font-bold text-gray-800">
                  {currentExercise?.icon} <span className="hidden sm:inline">{
                    currentMethodBlock === 'sens' ? 'Le sens de la multiplication' :
                    currentMethodBlock === 'addition' ? 'Addition répétée' :
                    'Groupes égaux'
                  }</span>
                  <span className="sm:hidden">{
                    currentMethodBlock === 'sens' ? 'Le sens' :
                    currentMethodBlock === 'addition' ? 'Addition' :
                    'Groupes'
                  }</span>
                </h2>
                <div className="text-xs sm:text-lg font-semibold text-gray-600">
                  Exercice {currentExerciseInBlock + 1} / {currentExercises.length}
                </div>
              </div>

              {!showCompletionModal && currentExercise ? (
                <div className="space-y-3 sm:space-y-6">
                  {/* Question */}
                  <div className={`border-2 rounded-xl p-3 sm:p-6 ${
                    currentMethodBlock === 'sens' ? 'bg-green-50 border-green-200' :
                    currentMethodBlock === 'addition' ? 'bg-orange-50 border-orange-200' :
                    currentMethodBlock === 'groupes' ? 'bg-blue-50 border-blue-200' :
                    'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="text-center mb-3 sm:mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
                        <span className="text-lg sm:text-2xl">{currentExercise.icon}</span>
                        <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          currentMethodBlock === 'sens' ? 'bg-green-200 text-green-800' :
                          currentMethodBlock === 'addition' ? 'bg-orange-200 text-orange-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {currentMethodBlock === 'sens' ? 'Comprendre le sens' :
                           currentMethodBlock === 'addition' ? 'Addition répétée' :
                           'Groupes égaux'}
                        </span>
                      </div>
                      
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                        {currentExercise.question}
                      </h3>
                      
                      {currentExercise?.visual && currentMethodBlock !== 'groupes' && currentMethodBlock !== 'addition' && (
                        <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 mb-3 sm:mb-4">
                          <pre className="text-sm sm:text-lg font-mono text-center text-gray-800 whitespace-pre-line">
                            {currentExercise.visual}
                          </pre>
                        </div>
                      )}
                      
                      <button
                        id="listen-button"
                        onClick={readCurrentQuestion}
                        className={`px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-600 transition-all ${
                          highlightedElement === 'listen-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''
                        }`}
                      >
                        🔊 <span className="hidden sm:inline">Écouter la question</span><span className="sm:hidden">Écouter</span>
                      </button>
                    </div>
                  </div>

                  {/* Choix multiples pour comprendre le sens */}
                  <div id="answer-choices" className="grid grid-cols-1 gap-2 sm:gap-3 max-w-lg mx-auto mb-3 sm:mb-6">
                    {currentExercise?.choices?.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(choice)}
                        disabled={isCorrect !== null}
                        className={`p-2 sm:p-4 rounded-lg font-semibold text-xs sm:text-base transition-all border-2 ${
                          isCorrect !== null && choice === currentExercise?.correctAnswer
                            ? 'bg-green-500 text-white border-green-500'
                            : isCorrect !== null && choice !== currentExercise?.correctAnswer
                            ? 'bg-red-100 text-red-600 border-red-300'
                            : `bg-white text-gray-700 border-gray-300 hover:border-${
                                currentMethodBlock === 'sens' ? 'green' :
                                currentMethodBlock === 'addition' ? 'orange' :
                                currentMethodBlock === 'groupes' ? 'blue' : 'purple'
                              }-400 hover:bg-${
                                currentMethodBlock === 'sens' ? 'green' :
                                currentMethodBlock === 'addition' ? 'orange' :
                                currentMethodBlock === 'groupes' ? 'blue' : 'purple'
                              }-50`
                        } disabled:cursor-not-allowed`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    } ${showWrongAnswerAnimation && !isCorrect ? 'ring-4 ring-red-400' : ''}`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl">
                          {isCorrect ? '✅' : '❌'}
                        </span>
                        <span className="font-bold">
                          {isCorrect ? 'Bravo !' : isPlayingWrongAnswerVocal ? 'Écoute l\'explication...' : 'Pas tout à fait...'}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="space-y-3">

                          
                          <div 
                            id="correction-section"
                            className={`bg-white p-4 rounded-lg border-2 border-red-200 ${
                              showWrongAnswerAnimation ? 'animate-fade-in' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-700 mb-3">
                              💡 <strong>La bonne réponse était :</strong>
                            </p>
                            <p className="text-lg font-bold text-red-700 mb-3">
                              {currentExercise?.correctAnswer}
                            </p>
                            
                            {/* Illustration visuelle de la correction */}
                            {(currentMethodBlock === 'addition' || currentMethodBlock === 'groupes') && currentExercise?.visual && (
                              <div 
                                id="visual-illustration"
                                className="bg-green-50 p-3 rounded-lg border border-green-200"
                              >
                                <p className="text-sm text-green-700 font-semibold mb-2">
                                  📝 Illustration :
                                </p>
                                <div className="text-center mb-2">
                                  <pre className="text-lg font-mono text-green-800 whitespace-pre-line">
                                    {currentExercise.visual}
                                  </pre>
                                </div>
                                {currentExercise.visualExplanation && (
                                  <p className="text-sm text-green-700 text-center">
                                    {currentExercise.visualExplanation}
                                  </p>
                                )}
                                
                                {/* Animation étape par étape pour addition répétée */}
                                {currentMethodBlock === 'addition' && currentExercise.additionSteps && (
                                  <div className="mt-3 p-2 bg-white rounded border">
                                    <p className="text-xs text-gray-600 mb-2">Étapes de l'addition :</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                      {currentExercise.additionSteps.map((step, index) => (
                                        <span 
                                          key={index}
                                          id={`addition-step-${index}`}
                                          className={`px-2 py-1 rounded text-sm font-mono transition-all duration-500 ${
                                            highlightedElement === `addition-step-${index}` 
                                              ? 'bg-blue-200 text-blue-900 ring-2 ring-blue-400 transform scale-105' 
                                              : 'bg-orange-100 text-orange-800'
                                          }`}
                                        >
                                          {step}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Information pour groupes égaux */}
                                {currentMethodBlock === 'groupes' && currentExercise.groups && currentExercise.itemsPerGroup && (
                                  <div className="mt-3 p-2 bg-white rounded border">
                                    <p className="text-xs text-gray-600 mb-2">Organisation :</p>
                                    <div 
                                      id="groupes-calculation"
                                      className={`text-sm text-blue-800 text-center transition-all duration-500 ${
                                        highlightedElement === 'groupes-calculation' 
                                          ? 'bg-blue-100 p-2 rounded ring-2 ring-blue-400 transform scale-105' 
                                          : ''
                                      }`}
                                    >
                                      <span className="font-bold">{currentExercise.groups}</span> groupes × 
                                      <span className="font-bold"> {currentExercise.itemsPerGroup}</span> objets = 
                                      <span className="font-bold text-blue-600"> {currentExercise.groups * currentExercise.itemsPerGroup}</span> objets
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {!isPlayingWrongAnswerVocal && (
                            <button
                              id="next-button"
                              onClick={nextExercise}
                              className={`mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all ${
                                highlightedElement === 'next-button' ? 'ring-4 ring-blue-400' : ''
                              } ${activeSpeakingButton === 'next-button' ? 'speaking-button' : ''}`}
                            >
                              Exercice suivant
                            </button>
                          )}
                        </div>
                      )}
                      {isCorrect && (
                        <div className="text-sm text-green-600 mt-2">
                          Passage automatique à l'exercice suivant...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Modal de fin de méthode */
                <div className="text-center space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {currentMethodBlock === 'sens' && 'Bravo ! Tu comprends le sens de la multiplication !'}
                    {currentMethodBlock === 'addition' && 'Parfait ! Tu maîtrises l\'addition répétée !'}
                    {currentMethodBlock === 'groupes' && 'Excellent ! Tu sais organiser en groupes égaux !'}
                  </h2>
                  <div className="text-lg text-gray-600">
                    {currentMethodBlock === 'sens' && 'Tu peux maintenant essayer les autres méthodes : addition répétée ou groupes égaux !'}
                    {currentMethodBlock === 'addition' && 'Tu peux maintenant essayer les groupes égaux ou revoir le sens !'}
                    {currentMethodBlock === 'groupes' && 'Tu peux maintenant essayer l\'addition répétée ou revoir le sens !'}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Boutons pour passer à d'autres méthodes */}
                    {currentMethodBlock !== 'addition' && (
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          switchToMethod('addition');
                        }}
                        className="bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600"
                      >
                        ➕ Addition répétée
                      </button>
                    )}
                    {currentMethodBlock !== 'groupes' && (
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          switchToMethod('groupes');
                        }}
                        className="bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600"
                      >
                        ⚖️ Groupes égaux
                      </button>
                    )}

                    {currentMethodBlock !== 'sens' && (
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          switchToMethod('sens');
                        }}
                        className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600"
                      >
                        ✖️ Le sens
                      </button>
                    )}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => {
                        setCurrentExerciseInBlock(0);
                        setIsCorrect(null);
                        setShowCompletionModal(false);
                      }}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Refaire cette méthode
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Retour au cours
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
