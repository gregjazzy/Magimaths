'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star } from 'lucide-react';

export default function ProblemesAddition() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedExamples, setHighlightedExamples] = useState<number[]>([]);
  const [highlightNumbersInStory, setHighlightNumbersInStory] = useState(false);

  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExerciseAnimation, setShowExerciseAnimation] = useState(false);
  const [exerciseAnimationStep, setExerciseAnimationStep] = useState<string | null>(null);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  
  // États pour l'addition posée 
  const [calculationStep, setCalculationStep] = useState<'setup' | 'units' | 'carry' | 'tens' | 'hundreds' | 'result' | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [partialResults, setPartialResults] = useState<{units: string | null, tens: string | null, hundreds: string | null}>({units: null, tens: null, hundreds: null});
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [highlightCourseButton, setHighlightCourseButton] = useState(false);
  const [highlightExerciseButton, setHighlightExerciseButton] = useState(false);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Refs pour les sections
  const introSectionRef = useRef<HTMLDivElement>(null);
  const methodSectionRef = useRef<HTMLDivElement>(null);
  const examplesSectionRef = useRef<HTMLDivElement>(null);
  const exerciseTabRef = useRef<HTMLButtonElement>(null);

  // Données des problèmes avec animations
  const problemExamples = [
    {
      id: 'bonbons',
      title: 'Les bonbons de Marie',
      story: 'Marie a 3 bonbons rouges et 4 bonbons bleus. Combien a-t-elle de bonbons en tout ?',
      first: 3,
      second: 4,
      result: 7,
      item: '🍬',
      color1: 'text-red-600',
      color2: 'text-blue-600'
    },
    {
      id: 'jouets',
      title: 'Les voitures de Tom',
      story: 'Tom a 5 petites voitures et 3 camions. Combien a-t-il de véhicules au total ?',
      first: 5,
      second: 3,
      result: 8,
      item: '🚗',
      color1: 'text-orange-600',
      color2: 'text-green-600'
    },
    {
      id: 'animaux',
      title: 'Les poissons de l\'aquarium',
      story: 'Dans l\'aquarium, il y a 6 poissons rouges et 2 poissons jaunes. Combien y a-t-il de poissons ?',
      first: 6,
      second: 2,
      result: 8,
      item: '🐠',
      color1: 'text-red-600',
      color2: 'text-amber-600'
    },
    {
      id: 'ecole',
      title: 'La cour de récréation',
      story: 'Pendant la récréation, Julie compte les enfants qui jouent. Elle voit 7 enfants qui jouent au ballon près du grand chêne et 5 autres enfants qui font de la corde à sauter près des bancs. Combien d\'enfants s\'amusent dans la cour ?',
      first: 7,
      second: 5,
      result: 12,
      item: '👦',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    {
      id: 'marche',
      title: 'Au marché avec Maman',
      story: 'Au marché du village, Maman achète des légumes frais pour la semaine. Le gentil marchand lui donne 23 tomates bien mûres qu\'elle met dans son panier d\'osier, puis il ajoute 14 concombres verts et croquants. Maman veut savoir combien de légumes elle rapporte à la maison.',
      first: 23,
      second: 14,
      result: 37,
      item: '🍅',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      id: 'parc',
      title: 'Les canards du parc',
      story: 'Au parc près de l\'étang, Pablo adore nourrir les canards avec du pain. Ce matin ensoleillé, il compte 32 canards qui nagent tranquillement près du petit pont en bois. Soudain, 26 autres canards arrivent en se dandinant depuis les roseaux. Pablo se demande combien de canards vont partager son délicieux pain.',
      first: 32,
      second: 26,
      result: 58,
      item: '🦆',
      color1: 'text-yellow-600',
      color2: 'text-blue-600'
    },
    {
      id: 'bibliotheque',
      title: 'La grande bibliothèque de l\'école',
      story: 'Pour organiser la bibliothèque de l\'école, Madame Dupont compte les livres. Sur l\'étagère des contes, elle trouve 41 livres d\'aventures poussiéreux qu\'elle nettoie soigneusement. Puis, dans un carton tout neuf livré ce matin, elle découvre 28 magnifiques livres de contes de fées avec des couvertures dorées. Elle veut savoir combien de livres de contes elle aura en tout pour ses élèves.',
      first: 41,
      second: 28,
      result: 69,
      item: '📚',
      color1: 'text-purple-600',
      color2: 'text-amber-600'
    },
    {
      id: 'patisserie',
      title: 'La boulangerie de Monsieur Paul',
      story: 'Ce matin, dans sa petite boulangerie qui sent bon le pain chaud, Monsieur Paul prépare des croissants pour le petit-déjeuner de ses clients fidèles. Il sort du four 35 croissants dorés et croustillants qu\'il place délicatement sur un plateau. Ensuite, il prépare une nouvelle fournée et cuit 23 croissants supplémentaires qu\'il dispose sur un second plateau. Madame Martin, sa meilleure cliente, lui demande combien de croissants il a préparés ce matin.',
      first: 35,
      second: 23,
      result: 58,
      item: '🥐',
      color1: 'text-amber-700',
      color2: 'text-yellow-600'
    },
    {
      id: 'jardin',
      title: 'Le jardin secret de Grand-Papa',
      story: 'Dans son magnifique jardin fleuri qu\'il cultive avec amour depuis des années, Grand-Papa plante des tulipes colorées pour faire une surprise à sa petite-fille Léa. Il creuse soigneusement la terre humide et plante 43 bulbes de tulipes rouges près de la tonnelle en bois. Puis, inspiré par tant de beauté, il se dirige vers le parterre près de la fontaine et plante 36 bulbes de tulipes jaunes qui brilleront comme des soleils au printemps prochain. Léa, curieuse, veut savoir combien de tulipes fleuriront dans le jardin.',
      first: 43,
      second: 36,
      result: 79,
      item: '🌷',
      color1: 'text-red-700',
      color2: 'text-yellow-700'
    }
  ];

  // 20 Exercices progressifs CP : 10 → 20 → 100 (additions posées SANS retenue)
  const exercises = [
    // NIVEAU 1 : Additions simples jusqu'à 10 (mentalement)
    {
      story: 'Léa trouve des champignons. Elle a 3 champignons rouges et 5 champignons blancs. Combien de champignons a-t-elle ?',
      answer: 8,
      visual: '🍄',
      first: 3,
      second: 5,
      item: '🍄',
      color1: 'text-red-600',
      color2: 'text-gray-600'
    },
    {
      story: 'Nina range ses crayons. Elle a 4 crayons bleus et 2 crayons rouges. Combien de crayons a-t-elle ?',
      answer: 6,
      visual: '✏️',
      first: 4,
      second: 2,
      item: '✏️',
      color1: 'text-blue-600',
      color2: 'text-red-600'
    },
    {
      story: 'Tom collectionne les billes. Il a 6 billes vertes et 3 billes jaunes. Combien de billes a-t-il ?',
      answer: 9,
      visual: '⚪',
      first: 6,
      second: 3,
      item: '⚪',
      color1: 'text-green-600',
      color2: 'text-yellow-600'
    },
    {
      story: 'Au cirque, Victor voit 5 clowns qui dansent et 3 clowns qui jonglent. Combien de clowns y a-t-il ?',
      answer: 8,
      visual: '🤡',
      first: 5,
      second: 3,
      item: '🤡',
      color1: 'text-red-500',
      color2: 'text-blue-500'
    },
    {
      story: 'Mélanie compte ses autocollants. Elle a 3 autocollants d\'animaux et 7 autocollants de fleurs. Combien d\'autocollants a-t-elle ?',
      answer: 10,
      visual: '🌟',
      first: 3,
      second: 7,
      item: '🌟',
      color1: 'text-orange-600',
      color2: 'text-pink-600'
    },
    
    // NIVEAU 2 : Additions jusqu'à 20 (posées simples)
    {
      story: 'Dans la classe, il y a 12 chaises bleues et 6 chaises rouges. Combien de chaises y a-t-il ?',
      answer: 18,
      visual: '🪑',
      first: 12,
      second: 6,
      item: '🪑',
      color1: 'text-blue-600',
      color2: 'text-red-600'
    },
    {
      story: 'Paul collectionne les cartes. Il a 11 cartes de football et 6 cartes de basketball. Combien de cartes a-t-il ?',
      answer: 17,
      visual: '🎴',
      first: 11,
      second: 6,
      item: '🎴',
      color1: 'text-green-600',
      color2: 'text-orange-600'
    },
    {
      story: 'Alice nourrit les oiseaux. Elle voit 12 moineaux et 7 pigeons. Combien d\'oiseaux y a-t-il ?',
      answer: 19,
      visual: '🐦',
      first: 12,
      second: 7,
      item: '🐦',
      color1: 'text-amber-700',
      color2: 'text-gray-600'
    },
    {
      story: 'Thomas joue avec ses blocs. Il a 13 blocs rouges et 3 blocs verts. Combien de blocs a-t-il ?',
      answer: 16,
      visual: '🧱',
      first: 13,
      second: 3,
      item: '🧱',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      story: 'À la piscine, Sarah compte les enfants. Elle voit 12 enfants qui nagent et 8 enfants qui jouent. Combien d\'enfants y a-t-il ?',
      answer: 20,
      visual: '🏊',
      first: 12,
      second: 8,
      item: '🏊',
      color1: 'text-blue-500',
      color2: 'text-cyan-500'
    },
    
    // NIVEAU 3 : Additions posées jusqu'à 50 (sans retenue)
    {
      story: 'Julie fait un collier. Elle enfile 23 perles bleues et 14 perles dorées. Combien de perles utilise-t-elle ?',
      answer: 37,
      visual: '💎',
      first: 23,
      second: 14,
      item: '💎',
      color1: 'text-blue-600',
      color2: 'text-yellow-500'
    },
    {
      story: 'Dans le potager, Mamie récolte 31 carottes et 14 radis. Combien de légumes a-t-elle cueillis ?',
      answer: 45,
      visual: '🥕',
      first: 31,
      second: 14,
      item: '🥕',
      color1: 'text-orange-600',
      color2: 'text-red-600'
    },
    {
      story: 'Antoine collectionne les timbres. Il a 21 timbres français et 15 timbres étrangers. Combien de timbres a-t-il ?',
      answer: 36,
      visual: '📮',
      first: 21,
      second: 15,
      item: '📮',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    {
      story: 'À la plage, Zoé ramasse des coquillages. Elle trouve 25 petits coquillages et 13 gros coquillages. Combien de coquillages a-t-elle ?',
      answer: 38,
      visual: '🐚',
      first: 25,
      second: 13,
      item: '🐚',
      color1: 'text-pink-600',
      color2: 'text-blue-600'
    },
    {
      story: 'Dans sa tirelire, Lucas a 32 pièces jaunes et 12 pièces argentées. Combien de pièces a-t-il ?',
      answer: 44,
      visual: '🪙',
      first: 32,
      second: 12,
      item: '🪙',
      color1: 'text-yellow-600',
      color2: 'text-gray-400'
    },
    
    // NIVEAU 4 : Additions posées jusqu'à 100 (sans retenue - nombres à 2 chiffres)
    {
      story: 'Élise compte les nuages. Elle voit 41 nuages blancs et 24 nuages gris. Combien de nuages y a-t-il ?',
      answer: 65,
      visual: '☁️',
      first: 41,
      second: 24,
      item: '☁️',
      color1: 'text-gray-300',
      color2: 'text-gray-600'
    },
    {
      story: 'Maman prépare des cookies. Elle fait 35 cookies au chocolat et 32 cookies nature. Combien de cookies a-t-elle ?',
      answer: 67,
      visual: '🍪',
      first: 35,
      second: 32,
      item: '🍪',
      color1: 'text-amber-800',
      color2: 'text-amber-600'
    },
    {
      story: 'Hugo range ses cartes. Il a 43 cartes rouges et 25 cartes noires. Combien de cartes a-t-il ?',
      answer: 68,
      visual: '🂠',
      first: 43,
      second: 25,
      item: '🂠',
      color1: 'text-red-600',
      color2: 'text-black'
    },
    {
      story: 'Emma compte ses livres. Elle a 42 livres d\'histoires et 24 livres de sciences. Combien de livres a-t-elle ?',
      answer: 66,
      visual: '📖',
      first: 42,
      second: 24,
      item: '📖',
      color1: 'text-purple-600',
      color2: 'text-green-600'
    },
    {
      story: 'Au magasin de jouets, Théo compte les peluches. Il voit 51 ours en peluche et 26 lapins en peluche. Combien de peluches y a-t-il ?',
      answer: 77,
      visual: '🧸',
      first: 51,
      second: 26,
      item: '🧸',
      color1: 'text-amber-700',
      color2: 'text-gray-600'
    }
  ];

  // Fonction pour générer un message de correction personnalisé
  const getPersonalizedFeedback = (exerciseIndex: number, isCorrect: boolean) => {
    const exercise = exercises[exerciseIndex];
    const icon = exercise.visual;
    
    if (isCorrect) {
             const successMessages = [
        `Bravo ! ${icon} Léa a trouvé exactement ${exercise.answer} champignons dans la forêt !`,
        `Parfait ! ${icon} Nina a bien ${exercise.answer} crayons dans son pot !`,
        `Excellent ! ${icon} Tom a ${exercise.answer} billes colorées !`,
        `Super ! ${icon} Victor compte ${exercise.answer} clowns amusants au cirque !`,
        `Bravo ! ${icon} Mélanie a ${exercise.answer} beaux autocollants !`,
        `Formidable ! ${icon} Il y a précisément ${exercise.answer} chaises dans la classe !`,
        `Parfait ! ${icon} Paul a ${exercise.answer} cartes dans sa collection !`,
        `Magnifique ! ${icon} Alice observe ${exercise.answer} oiseaux dans le parc !`,
        `Excellent ! ${icon} Thomas a ${exercise.answer} blocs pour construire !`,
        `Super ! ${icon} Sarah voit ${exercise.answer} enfants qui s'amusent à la piscine !`,
        `Merveilleux ! ${icon} Julie utilise ${exercise.answer} perles pour son beau collier !`,
        `Fantastique ! ${icon} Mamie a récolté ${exercise.answer} légumes frais !`,
        `Génial ! ${icon} Antoine a ${exercise.answer} timbres dans sa collection !`,
        `Bravo ! ${icon} Zoé a ramassé ${exercise.answer} coquillages à la plage !`,
        `Excellent ! ${icon} Lucas a ${exercise.answer} pièces dans sa tirelire !`,
        `Super ! ${icon} Élise compte ${exercise.answer} nuages dans le ciel !`,
        `Délicieux ! ${icon} Maman a préparé ${exercise.answer} cookies savoureux !`,
        `Formidable ! ${icon} Hugo a ${exercise.answer} cartes dans ses mains !`,
        `Parfait ! ${icon} Emma a ${exercise.answer} livres sur son étagère !`,
        `Fantastique ! ${icon} Théo voit ${exercise.answer} peluches au magasin !`
       ];
       return successMessages[exerciseIndex] || `Bravo ! ${icon} Tu as trouvé ${exercise.answer} !`;
    } else {
             const correctionMessages = [
        `${icon} Léa a trouvé : ${exercise.first} champignons rouges + ${exercise.second} champignons blancs = ${exercise.answer} champignons !`,
        `${icon} Nina a : ${exercise.first} crayons bleus + ${exercise.second} crayons rouges = ${exercise.answer} crayons !`,
        `${icon} Tom a : ${exercise.first} billes vertes + ${exercise.second} billes jaunes = ${exercise.answer} billes !`,
        `${icon} Au cirque : ${exercise.first} clowns danseurs + ${exercise.second} clowns jongleurs = ${exercise.answer} clowns !`,
        `${icon} Mélanie a : ${exercise.first} autocollants d'animaux + ${exercise.second} autocollants de fleurs = ${exercise.answer} autocollants !`,
        `${icon} Dans la classe : ${exercise.first} chaises bleues + ${exercise.second} chaises rouges = ${exercise.answer} chaises !`,
        `${icon} Paul a : ${exercise.first} cartes de foot + ${exercise.second} cartes de basket = ${exercise.answer} cartes !`,
        `${icon} Alice voit : ${exercise.first} moineaux + ${exercise.second} pigeons = ${exercise.answer} oiseaux !`,
        `${icon} Thomas a : ${exercise.first} blocs rouges + ${exercise.second} blocs verts = ${exercise.answer} blocs !`,
        `${icon} À la piscine : ${exercise.first} enfants nageurs + ${exercise.second} enfants joueurs = ${exercise.answer} enfants !`,
        `${icon} Julie utilise : ${exercise.first} perles bleues + ${exercise.second} perles dorées = ${exercise.answer} perles !`,
        `${icon} Mamie a récolté : ${exercise.first} carottes + ${exercise.second} radis = ${exercise.answer} légumes !`,
        `${icon} Antoine a : ${exercise.first} timbres français + ${exercise.second} timbres étrangers = ${exercise.answer} timbres !`,
        `${icon} Zoé a trouvé : ${exercise.first} petits coquillages + ${exercise.second} gros coquillages = ${exercise.answer} coquillages !`,
        `${icon} Lucas a : ${exercise.first} pièces jaunes + ${exercise.second} pièces argentées = ${exercise.answer} pièces !`,
        `${icon} Élise voit : ${exercise.first} nuages blancs + ${exercise.second} nuages gris = ${exercise.answer} nuages !`,
        `${icon} Maman a fait : ${exercise.first} cookies chocolat + ${exercise.second} cookies nature = ${exercise.answer} cookies !`,
        `${icon} Hugo a : ${exercise.first} cartes rouges + ${exercise.second} cartes noires = ${exercise.answer} cartes !`,
        `${icon} Emma a : ${exercise.first} livres d'histoires + ${exercise.second} livres de sciences = ${exercise.answer} livres !`,
        `${icon} Théo voit : ${exercise.first} ours en peluche + ${exercise.second} lapins en peluche = ${exercise.answer} peluches !`
       ];
      return correctionMessages[exerciseIndex] || `${icon} La réponse était ${exercise.answer} !`;
    }
  };

  // Fonction pour mettre en évidence les nombres dans un texte
  const highlightNumbers = (text: string, isExplicitHighlight = false) => {
    // Remplace les nombres et signes mathématiques par des spans colorés (SANS les tirets -)
    return text.split(/(\d+|\+|=)/).map((part, index) => {
      // Si c'est un nombre
      if (/^\d+$/.test(part)) {
        const className = isExplicitHighlight 
          ? "bg-yellow-300 text-yellow-900 px-2 py-1 rounded-lg font-black text-xl mx-1 shadow-lg ring-2 ring-yellow-400 animate-pulse"
          : "bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-md font-bold mx-0.5 shadow-sm";
        return (
          <span 
            key={index} 
            className={className}
          >
            {part}
          </span>
        );
      }
      // Si c'est un signe mathématique (+ ou = seulement, PAS -)
      if (/^[\+\=]$/.test(part)) {
        const className = isExplicitHighlight
          ? "bg-orange-300 text-orange-900 px-2 py-1 rounded-lg font-black text-xl mx-1 shadow-lg ring-2 ring-orange-400 animate-pulse"
          : "bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded-md font-bold mx-0.5 shadow-sm";
        return (
          <span 
            key={index} 
            className={className}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

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
    
    setIsPlayingVocal(false);
    setExercisesIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedExamples([]);
    setHighlightNumbersInStory(false);
    setSamSizeExpanded(false);
    setHighlightCourseButton(false);
    setHighlightExerciseButton(false);
  };

  // Fonction pour faire défiler vers une section
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Sélectionner la MEILLEURE voix française féminine disponible
      const voices = speechSynthesis.getVoices();
      console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
      
      // Priorité aux voix FÉMININES françaises de qualité
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
        currentAudioRef.current = null;
        resolve();
      };
      
      utterance.onerror = () => {
        setIsPlayingVocal(false);
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

    // Fonction pour faire défiler vers un élément par ID (pour compatibilité)
  const scrollToElement = (elementId: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest' 
        });
      }
    }, 300);
  };

  // Fonction pour rendre une addition posée avec animations
  const renderPostedAddition = (num1: number, num2: number, result: number, isAnimated = false) => {
    // Déterminer le nombre de chiffres maximum
    const maxDigits = Math.max(num1.toString().length, num2.toString().length, result.toString().length);
    const num1Str = num1.toString().padStart(maxDigits, ' ');
    const num2Str = num2.toString().padStart(maxDigits, ' ');
    const resultStr = result.toString().padStart(maxDigits, ' ');
    
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
    
    // Vérifier s'il y a une retenue
    const hasCarry = (parseInt(num1Units) + parseInt(num2Units)) > 9;
    
    return (
      <div className={`bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border-2 transition-all duration-500 ${
        isAnimated ? 'border-blue-400 bg-blue-50 scale-105 shadow-xl' : 'border-gray-200'
      }`}>
        <div className="flex justify-center">
          <div className="space-y-4">
            {/* Tableau des colonnes D et U */}
            <div className="flex justify-center mb-4">
              <div className={`grid gap-8 font-bold text-lg ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                    calculationStep === 'hundreds' ? 'bg-purple-200 text-purple-800 animate-pulse' : 'bg-gray-100 text-gray-600'
                  }`}>
                    C
                  </div>
                )}
                <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                  calculationStep === 'tens' ? 'bg-orange-200 text-orange-800 animate-pulse' : 'bg-gray-100 text-gray-600'
                }`}>
                  D
                </div>
                <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                  calculationStep === 'units' ? 'bg-blue-200 text-blue-800 animate-pulse' : 'bg-gray-100 text-gray-600'
                }`}>
                  U
                </div>
              </div>
            </div>

            {/* Retenue si nécessaire */}
            {hasCarry && showingCarry && (
              <div className="flex justify-center">
                <div className={`grid gap-8 ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && <div className="text-center"></div>}
                  <div className="text-center text-red-500 text-lg animate-bounce">
                    <sup className="bg-red-100 px-2 py-1 rounded-full border-2 border-red-300">1</sup>
                  </div>
                  <div className="text-center"></div>
                </div>
              </div>
            )}
            
            {/* Premier nombre */}
            <div className="flex justify-center">
              <div className={`grid gap-8 font-mono text-3xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'hundreds' ? 'bg-purple-100 text-purple-700 animate-pulse' : 
                    calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                  } ${num1Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                    {num1Hundreds || ''}
                  </div>
                )}
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'tens' ? 'bg-orange-100 text-orange-700 animate-pulse' : 
                  calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                } ${num1Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                  {num1Tens || ''}
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'units' ? 'bg-blue-100 text-blue-700 animate-pulse' : 
                  calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                } border-2 border-dashed border-blue-300`}>
                  {num1Units}
                </div>
              </div>
            </div>
            
            {/* Deuxième nombre avec signe + */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`grid gap-8 font-mono text-3xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && (
                    <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                      calculationStep === 'hundreds' ? 'bg-purple-100 text-purple-700 animate-pulse' : 
                      calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                    } ${num2Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                      {num2Hundreds || ''}
                    </div>
                  )}
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'tens' ? 'bg-orange-100 text-orange-700 animate-pulse' : 
                    calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                  } ${num2Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                    {num2Tens || ''}
                  </div>
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'units' ? 'bg-blue-100 text-blue-700 animate-pulse' : 
                    calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                  } border-2 border-dashed border-blue-300`}>
                    {num2Units}
                  </div>
                </div>
                {/* Signe + positionné à gauche */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 text-3xl font-mono text-green-600 font-bold">
                  +
                </div>
              </div>
            </div>
            
            {/* Ligne de séparation */}
            <div className="flex justify-center">
              <div className={`border-t-4 my-3 transition-all duration-700 ${
                calculationStep === 'result' ? 'border-purple-500 shadow-lg animate-pulse' : 'border-purple-400'
              }`} style={{ width: maxDigits >= 3 ? '11rem' : '7.5rem' }}></div>
            </div>
            
            {/* Résultat avec animations progressives */}
            <div className="flex justify-center">
              <div className={`grid gap-8 font-mono text-3xl font-bold ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'hundreds' || calculationStep === 'result' ? 'bg-purple-200 text-purple-700 animate-pulse' : 'text-transparent'
                  } ${calculationStep === 'result' ? 'border-2 border-purple-400' : ''}`}>
                    {(calculationStep === 'hundreds' || calculationStep === 'result') && partialResults.hundreds ? partialResults.hundreds : 
                     calculationStep === 'result' ? resultHundreds : ''}
                  </div>
                )}
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'tens' || calculationStep === 'result' ? 'bg-orange-200 text-orange-700 animate-pulse' : 'text-transparent'
                } ${calculationStep === 'result' ? 'border-2 border-orange-400' : ''}`}>
                  {(calculationStep === 'tens' || calculationStep === 'result') && partialResults.tens ? partialResults.tens : 
                   calculationStep === 'result' ? resultTens : ''}
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result' ? 'bg-blue-200 text-blue-700 animate-pulse' : 'text-transparent'
                } ${calculationStep === 'result' ? 'border-2 border-blue-400' : ''}`}>
                  {(calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result') && partialResults.units ? partialResults.units : 
                   calculationStep === 'result' ? resultUnits : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour expliquer le chapitre dans le cours avec Sam
  const explainChapterWithSam = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setSamSizeExpanded(true);
    setHighlightCourseButton(true);
    
    try {
      // Introduction et objectif
      await playAudio("Ahoy moussaillon ! Bienvenue dans l'aventure des problèmes d'addition !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Aujourd'hui, tu vas apprendre à être un vrai détective des nombres !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      // Présentation de la première section
      await playAudio("D'abord, nous allons voir ce qu'est un problème d'addition...");
      if (stopSignalRef.current) return;
      
      // Scroll vers l'introduction et surbrillance
      scrollToSection(introSectionRef);
      setHighlightedElement('intro');
      await wait(500);
      
      await playAudio("Regarde bien cette section ! Tu peux cliquer sur l'icône pour voir une animation !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      if (stopSignalRef.current) return;
      
      // Présentation de la méthode
      await playAudio("Ensuite, nous verrons la méthode en 3 étapes...");
      if (stopSignalRef.current) return;
      
      // Scroll vers la méthode et surbrillance
      scrollToSection(methodSectionRef);
      setHighlightedElement('method');
      await wait(500);
      
      await playAudio("Voici la méthode secrète des pirates ! N'oublie pas de tester l'animation !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      if (stopSignalRef.current) return;
      
      // Présentation des exemples
      await playAudio("Et enfin, nous pratiquerons avec plein d'exemples...");
      if (stopSignalRef.current) return;
      
      // Scroll vers les exemples et surbrillance
      scrollToSection(examplesSectionRef);
      setHighlightedElement('examples');
      await wait(500);
      
      await playAudio("Ici tu trouveras 9 exemples avec des animations pour bien comprendre !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      if (stopSignalRef.current) return;
      
      // Mention de la section exercices
      await playAudio("Quand tu seras prêt, tu pourras aussi aller à la section exercices...");
      if (stopSignalRef.current) return;
      
      // Scroll vers l'onglet exercices et surbrillance
      setHighlightedElement(null);
      setHighlightExerciseButton(true);
      if (exerciseTabRef.current) {
        exerciseTabRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      await wait(500);
      
      await playAudio("Là-bas, 20 problèmes t'attendent pour tester tes nouvelles compétences !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      // Encouragement final
      await playAudio("Bon courage, petit pirate ! L'aventure commence maintenant !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapterWithSam:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightCourseButton(false);
      setHighlightExerciseButton(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour lire l'énoncé de l'exercice actuel
  const readCurrentStory = () => {
    const currentStory = exercises[currentExercise].story;
    const utterance = new SpeechSynthesisUtterance(currentStory);
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

  // Fonction pour expliquer les exercices avec Sam
  const explainExercisesWithSam = async () => {
    if (exercisesIsPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setExercisesIsPlayingVocal(true);
    setExercisesHasStarted(true);
    setSamSizeExpanded(true);
    setHighlightExerciseButton(true);
    
    try {
      await playAudio("Ahoy moussaillon ! C'est l'heure de t'entraîner avec les exercices !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Tu vas résoudre 20 problèmes d'addition différents, nom d'un sabre !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton "Lire l'énoncé"
      setHighlightedElement('read-story-button');
      await playAudio("Pour chaque exercice, tu peux lire l'énoncé en cliquant sur le bouton 'Lire l'énoncé' !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence la zone de réponse
      setHighlightedElement('answer-input');
      await playAudio("Ensuite, tu saisis ta réponse dans la zone de réponse !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton Vérifier
      setHighlightedElement('validate-button');
      await playAudio("Et pour finir, tu appuies sur le bouton 'Vérifier' pour vérifier ta réponse !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      setHighlightedElement(null);
      await playAudio("Si tu te trompes, je t'aiderai avec une animation pour comprendre ! En avant, petit pirate !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainExercisesWithSam:', error);
    } finally {
      setExercisesIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightExerciseButton(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour lire une étape spécifique de la méthode
  const readMethodStep = async (step: string) => {
    console.log('🎯 readMethodStep appelée pour:', step);
    
    // Arrêter tous les autres vocaux en cours
    stopAllVocalsAndAnimations();
    await wait(200);
    stopSignalRef.current = false;
    
    try {
      // Mettre en évidence l'étape correspondante
      setAnimatingStep(step);
      console.log('🌟 Mise en évidence de l\'étape:', step);
      
      let text = '';
      switch (step) {
        case 'step1':
          text = "Première étape : Je lis le problème et je comprends l'histoire. Je dois bien comprendre ce qui se passe dans l'histoire pour identifier les nombres importants.";
          break;
        case 'step2':
          text = "Deuxième étape : Je trouve les deux nombres à additionner. Je cherche dans l'histoire les quantités que je dois rassembler ou compter ensemble.";
          break;
        case 'step3':
          text = "Troisième étape : J'écris l'addition et je calcule. Je pose l'opération et je trouve le résultat pour répondre à la question.";
          break;
        default:
          text = "Étape de la méthode.";
      }
      
      console.log('🔊 Lecture du texte:', text);
      await playAudio(text);
      console.log('✅ Lecture terminée');
      
      // Attendre un peu puis enlever la mise en évidence
      await wait(500);
      setAnimatingStep(null);
      console.log('🎯 Mise en évidence supprimée');
      
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'étape:', error);
      setAnimatingStep(null);
    }
  };

  // Fonction pour lire la section introduction
  const readSectionIntro = async () => {
    console.log('🎯 readSectionIntro appelée');
    
    // Arrêter tous les autres vocaux en cours
    stopAllVocalsAndAnimations();
    await wait(200);
    stopSignalRef.current = false;
    
    try {
      // Mettre en évidence la section introduction
      setHighlightedElement('intro');
      scrollToSection(introSectionRef);
      
      const text = "Qu'est-ce qu'un problème d'addition ? Un problème d'addition raconte une histoire avec des nombres. Notre mission est de trouver ces nombres et de les additionner pour répondre à la question !";
      
      console.log('🔊 Lecture du texte:', text);
      await playAudio(text);
      console.log('✅ Lecture terminée');
      
      // Attendre un peu puis enlever la mise en évidence
      await wait(500);
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'introduction:', error);
      setHighlightedElement(null);
    }
  };

  // Fonction pour lire la section méthode
  const readSectionMethod = async () => {
    console.log('🎯 readSectionMethod appelée');
    
    // Arrêter tous les autres vocaux en cours
    stopAllVocalsAndAnimations();
    await wait(200);
    stopSignalRef.current = false;
    
    try {
      // Mettre en évidence la section méthode
      setHighlightedElement('method');
      scrollToSection(methodSectionRef);
      
      // Introduction générale
      await playAudio("Ma méthode en 3 étapes pour résoudre un problème d'addition.");
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      // Étape 1 avec mise en évidence
      setAnimatingStep('step1');
      await playAudio("Première étape : je lis le problème et je comprends l'histoire. Je dois bien comprendre ce qui se passe dans l'histoire pour identifier les nombres importants.");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Étape 2 avec mise en évidence  
      setAnimatingStep('step2');
      await playAudio("Deuxième étape : je trouve les deux nombres à additionner. Je cherche dans l'histoire les quantités que je dois rassembler ou compter ensemble.");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Étape 3 avec mise en évidence
      setAnimatingStep('step3');
      await playAudio("Troisième étape : j'écris l'addition et je calcule le résultat. Je pose l'opération et je trouve le résultat pour répondre à la question.");
      if (stopSignalRef.current) return;
      
      await wait(500);
      if (stopSignalRef.current) return;
      
      console.log('✅ Lecture terminée');
      
    } catch (error) {
      console.error('Erreur lors de la lecture de la méthode:', error);
    } finally {
      // Enlever toutes les mises en évidence
      setHighlightedElement(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour lire la section exemples
  const readSectionExamples = async () => {
    console.log('🎯 readSectionExamples appelée');
    
    // Arrêter tous les autres vocaux en cours
    stopAllVocalsAndAnimations();
    await wait(200);
    stopSignalRef.current = false;
    
    try {
      // Mettre en évidence la section exemples
      setHighlightedElement('examples');
      scrollToSection(examplesSectionRef);
      
      const text = "Choisis un problème à résoudre ensemble ! Ici tu trouveras 9 exemples différents avec des animations pour bien comprendre comment résoudre chaque problème d'addition. Clique sur celui que tu préfères pour voir l'animation détaillée !";
      
      console.log('🔊 Lecture du texte:', text);
      await playAudio(text);
      console.log('✅ Lecture terminée');
      
      // Attendre un peu puis enlever la mise en évidence
      await wait(500);
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur lors de la lecture des exemples:', error);
      setHighlightedElement(null);
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
      // Introduction
      setHighlightedElement('intro');
      scrollToElement('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à résoudre des problèmes d'addition. C'est très important de savoir transformer une histoire en calcul !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Méthode
      setHighlightedElement('method');
      scrollToElement('method-section');
      await playAudio("Pour résoudre un problème d'addition, il faut suivre 3 étapes importantes :");
      await wait(300);

      // Étape 1
      setAnimatingStep('step1');
      await playAudio("Première étape : je lis le problème et je comprends l'histoire.");
      await wait(500);

      if (stopSignalRef.current) return;

      // Étape 2
      setAnimatingStep('step2');
      await playAudio("Deuxième étape : je trouve les deux nombres à additionner dans l'histoire.");
      await wait(500);

      if (stopSignalRef.current) return;

      // Démonstration du soulignage des nombres
      setHighlightNumbersInStory(true);
      await playAudio("Regardez ! Je souligne tous les nombres que je trouve pour les repérer facilement !");
      await wait(1000);

      if (stopSignalRef.current) return;

      await playAudio("Voyez-vous comme les nombres ressortent bien ? C'est plus facile de les voir maintenant !");
      await wait(1000);

      if (stopSignalRef.current) return;

      setHighlightNumbersInStory(false);
      await wait(300);

      // Étape 3
      setAnimatingStep('step3');
      await playAudio("Troisième étape : j'écris l'addition et je calcule le résultat !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Transition vers les exemples
      setHighlightedElement('examples');
      scrollToElement('examples-section');
      await playAudio("Maintenant, regardons des exemples ensemble !");
      await wait(300);

      if (stopSignalRef.current) return;

      // Illuminer quelques exemples pendant l'explication  
      setHighlightedExamples([0, 2, 4]); // Illuminer bonbons, cour, marché
      await playAudio("Tu peux choisir celui que tu préfères pour voir l'animation détaillée !");
      await wait(1000);

      if (stopSignalRef.current) return;

      // Changer d'exemples illuminés pour montrer la variété
      setHighlightedExamples([1, 5, 8]); // Illuminer voitures, canards, boulangerie
      await wait(800);

      // Arrêter l'illumination
      setHighlightedExamples([]);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setHighlightNumbersInStory(false);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const example = problemExamples[index];
    setCurrentExample(index);

    try {
      // Attendre un court instant pour que l'interface se mette à jour
      await wait(300);
      
      // Scroll vers la zone d'animation pour voir l'énoncé
      scrollToElement('animation-section');
      await wait(500);

      // Lecture du problème
      setHighlightedElement('story');
      await playAudio(example.story);
      await wait(800);

      if (stopSignalRef.current) return;

      // Identifier les nombres - Phase 1 : Soulignage
      setAnimatingStep('identify');
      setHighlightNumbersInStory(true);
      await playAudio("Première chose à faire : je souligne tous les nombres que je vois dans l'histoire !");
      await wait(1000);

      if (stopSignalRef.current) return;

      await playAudio(`Parfait ! J'ai souligné les nombres : ${example.first} et ${example.second}. Ce sont mes deux nombres importants !`);
      await wait(1000);

      if (stopSignalRef.current) return;

      setHighlightNumbersInStory(false);
      await wait(300);

      // Différencier selon le type d'exemple (objets visuels ou addition posée)
      if (index <= 3) {
        // Exemples avec petits nombres : utiliser les objets visuels
        setAnimatingStep('group1');
        await playAudio(`Voici les ${example.first} premiers objets.`);
        await wait(1000);

        if (stopSignalRef.current) return;

        setAnimatingStep('group2');
        await playAudio(`Et voici les ${example.second} autres objets.`);
        await wait(1000);

        if (stopSignalRef.current) return;

        setAnimatingStep('calculation');
        await playAudio(`Pour trouver le total, je fais l'addition : ${example.first} plus ${example.second} égale ${example.result}.`);
        
        scrollToElement('animation-section');
        await wait(800);

        if (stopSignalRef.current) return;

        setAnimatingStep('result');
        await playAudio(`La réponse est ${example.result} ! Bravo !`);
        await wait(1000);
      } else {
        // Exemples avec nombres à 2 chiffres : utiliser l'addition posée
        await playAudio(`Pour ces grands nombres, je vais utiliser la technique de l'addition posée que nous avons apprise !`);
        await wait(1000);

        if (stopSignalRef.current) return;

        // Étape 1 : Setup de l'addition posée
        setCalculationStep('setup');
        await playAudio(`D'abord, j'aligne les nombres en colonnes : ${example.first} et ${example.second}.`);
        
        // SCROLL vers l'addition posée dès qu'on pose les nombres
        scrollToElement('animation-section');
        await wait(1500);

        if (stopSignalRef.current) return;

        // Étape 2 : Calcul des unités
        setCalculationStep('units');
        const unitsSum = (example.first % 10) + (example.second % 10);
        const unitsResult = unitsSum % 10;
        const hasCarry = unitsSum >= 10;
        
        setPartialResults({...partialResults, units: unitsResult.toString()});
        
        if (hasCarry) {
          await playAudio(`Je calcule les unités : ${example.first % 10} plus ${example.second % 10} égale ${unitsSum}. J'écris ${unitsResult} et je retiens 1.`);
          setShowingCarry(true);
        } else {
          await playAudio(`Je calcule les unités : ${example.first % 10} plus ${example.second % 10} égale ${unitsResult}.`);
        }
        await wait(1500);

        if (stopSignalRef.current) return;

        // Étape 3 : Calcul des dizaines
        setCalculationStep('tens');
        const tensSum = Math.floor(example.first / 10) + Math.floor(example.second / 10) + (hasCarry ? 1 : 0);
        setPartialResults({...partialResults, tens: tensSum.toString(), units: unitsResult.toString()});
        
        if (hasCarry) {
          await playAudio(`Pour les dizaines : ${Math.floor(example.first / 10)} plus ${Math.floor(example.second / 10)} plus ma retenue de 1 égale ${tensSum}.`);
        } else {
          await playAudio(`Pour les dizaines : ${Math.floor(example.first / 10)} plus ${Math.floor(example.second / 10)} égale ${tensSum}.`);
        }
        await wait(1500);

        if (stopSignalRef.current) return;

        // Étape 4 : Résultat final
        setCalculationStep('result');
        await playAudio(`Le résultat final est ${example.result} ! Excellent travail !`);
        await wait(1000);
      }

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setHighlightNumbersInStory(false);
      setIsAnimationRunning(false);
      // Reset des états de l'addition posée
      setCalculationStep(null);
      setShowingCarry(false);
      setPartialResults({units: null, tens: null, hundreds: null});
    }
  };

  // Fonction pour les exercices
  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correct = userNum === exercises[currentExercise].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      // Passer automatiquement au suivant après 1.5 secondes
      setTimeout(() => {
        setIsCorrect(null); // Reset l'état pour éviter le flash
        setUserAnswer(''); // Reset la réponse
        nextExercise();
      }, 1500);
    } else {
      // Déclencher la correction vocale automatique et l'animation visuelle
      setShowExerciseAnimation(true);
      quickVocalCorrection();
      animateExerciseCorrection();
    }
  };

  // Fonction pour correction vocale automatique
  const quickVocalCorrection = async () => {
    const exercise = exercises[currentExercise];
    
    // Extraire les nombres de l'énoncé
    const numbers = exercise.story.match(/\d+/g);
    if (!numbers || numbers.length < 2) return;
    
    const first = parseInt(numbers[0]);
    const second = parseInt(numbers[1]);
    const result = exercise.answer;

    // Scroll vers la zone de correction
    setTimeout(() => {
      const correctionElement = document.getElementById('exercise-correction');
      if (correctionElement) {
        correctionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);

    // Fonction audio avec vitesse lente pour la correction
    const quickAudio = (text: string) => {
      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.8; // Vitesse plus lente pour la correction
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
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

    try {
      // Créer une explication personnalisée basée sur le contexte du problème
      const getPersonalizedExplanation = () => {
        const story = exercise.story.toLowerCase();
        let context = '';
        
        if (story.includes('chaise')) {
          context = `Il y a ${first} chaises et ${second} chaises`;
        } else if (story.includes('champignon')) {
          context = `Il y a ${first} champignons et ${second} champignons`;
        } else if (story.includes('crayon')) {
          context = `Il y a ${first} crayons et ${second} crayons`;
        } else if (story.includes('clown')) {
          context = `Il y a ${first} clowns et ${second} clowns`;
        } else if (story.includes('papillon')) {
          context = `Il y a ${first} papillons et ${second} papillons`;
        } else if (story.includes('livre')) {
          context = `Il y a ${first} livres et ${second} livres`;
        } else if (story.includes('bonbon')) {
          context = `Il y a ${first} bonbons et ${second} bonbons`;
        } else if (story.includes('oiseau') || story.includes('moineau') || story.includes('pigeon')) {
          context = `Il y a ${first} oiseaux et ${second} oiseaux`;
        } else if (story.includes('voiture') || story.includes('camion') || story.includes('véhicule')) {
          context = `Il y a ${first} véhicules et ${second} véhicules`;
        } else if (story.includes('poisson')) {
          context = `Il y a ${first} poissons et ${second} poissons`;
        } else if (story.includes('enfant')) {
          context = `Il y a ${first} enfants et ${second} enfants`;
        } else if (story.includes('tomate') || story.includes('concombre') || story.includes('légume') || story.includes('carotte') || story.includes('radis')) {
          context = `Il y a ${first} légumes et ${second} légumes`;
        } else if (story.includes('canard')) {
          context = `Il y a ${first} canards et ${second} canards`;
        } else if (story.includes('croissant')) {
          context = `Il y a ${first} croissants et ${second} croissants`;
        } else if (story.includes('tulipe') || story.includes('bulbe')) {
          context = `Il y a ${first} tulipes et ${second} tulipes`;
        } else if (story.includes('domino')) {
          context = `Il y a ${first} dominos et ${second} dominos`;
        } else if (story.includes('outil') || story.includes('marteau') || story.includes('tournevis')) {
          context = `Il y a ${first} outils et ${second} outils`;
        } else if (story.includes('perle')) {
          context = `Il y a ${first} perles et ${second} perles`;
        } else if (story.includes('timbre')) {
          context = `Il y a ${first} timbres et ${second} timbres`;
        } else if (story.includes('galet')) {
          context = `Il y a ${first} galets et ${second} galets`;
        } else if (story.includes('pièce')) {
          context = `Il y a ${first} pièces et ${second} pièces`;
        } else if (story.includes('nuage')) {
          context = `Il y a ${first} nuages et ${second} nuages`;
        } else if (story.includes('cookie')) {
          context = `Il y a ${first} cookies et ${second} cookies`;
        } else if (story.includes('carte')) {
          context = `Il y a ${first} cartes et ${second} cartes`;
        } else if (story.includes('robot')) {
          context = `Il y a ${first} robots et ${second} robots`;
        } else {
          // Fallback générique
          context = `Les nombres sont ${first} et ${second}`;
        }
        
        return context;
      };
      
      // Différencier correction selon le type d'exercice
      if (currentExercise <= 9) {
        // Exercices simples : correction avec objets visuels
        setExerciseAnimationStep('highlight-numbers');
        await quickAudio(getPersonalizedExplanation());
        await wait(700);
        
        setExerciseAnimationStep('show-calculation');
        await quickAudio(`${first} plus ${second} égale ${result}`);
        await wait(700);
        
        setExerciseAnimationStep('show-result');
        await quickAudio(`La bonne réponse est ${result} !`);
        await wait(1000);
      } else {
        // Exercices avec nombres à 2 chiffres : correction avec addition posée
        await quickAudio(`Pour ces grands nombres, je vais utiliser l'addition posée !`);
        await wait(700);
        
        // Étape 1 : Setup de l'addition posée
        setCalculationStep('setup');
        await quickAudio(`D'abord, j'aligne les nombres en colonnes : ${first} et ${second}.`);
        
        // SCROLL vers l'addition posée dès qu'elle s'affiche
        setTimeout(() => {
          const correctionElement = document.getElementById('exercise-correction');
          if (correctionElement) {
            correctionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 500);
        
        await wait(1500);
        
        // Étape 2 : Calcul des unités
        setCalculationStep('units');
        const unitsSum = (first % 10) + (second % 10);
        const unitsResult = unitsSum % 10;
        const hasCarry = unitsSum >= 10;
        
        setPartialResults({...partialResults, units: unitsResult.toString()});
        
        if (hasCarry) {
          await quickAudio(`Je calcule les unités : ${first % 10} plus ${second % 10} égale ${unitsSum}. J'écris ${unitsResult} et je retiens 1.`);
          setShowingCarry(true);
        } else {
          await quickAudio(`Je calcule les unités : ${first % 10} plus ${second % 10} égale ${unitsResult}.`);
        }
        await wait(1500);
        
        // Étape 3 : Calcul des dizaines
        setCalculationStep('tens');
        const tensSum = Math.floor(first / 10) + Math.floor(second / 10) + (hasCarry ? 1 : 0);
        setPartialResults({...partialResults, tens: tensSum.toString(), units: unitsResult.toString()});
        
        if (hasCarry) {
          await quickAudio(`Pour les dizaines : ${Math.floor(first / 10)} plus ${Math.floor(second / 10)} plus ma retenue de 1 égale ${tensSum}.`);
        } else {
          await quickAudio(`Pour les dizaines : ${Math.floor(first / 10)} plus ${Math.floor(second / 10)} égale ${tensSum}.`);
        }
        await wait(1500);
        
        // Étape 4 : Résultat final
        setCalculationStep('result');
        await quickAudio(`Le résultat final est ${result} ! C'était la bonne réponse !`);
        await wait(1000);
      }
      
      setExerciseAnimationStep(null);
      
      // Reset des états d'addition posée pour les exercices à 2 chiffres
      if (currentExercise > 9) {
        setTimeout(() => {
          setCalculationStep(null);
          setShowingCarry(false);
          setPartialResults({units: null, tens: null, hundreds: null});
        }, 2000);
      }
      
    } catch (error) {
      console.error('Erreur dans quickVocalCorrection:', error);
      // Reset en cas d'erreur aussi
      setCalculationStep(null);
      setShowingCarry(false);
      setPartialResults({units: null, tens: null, hundreds: null});
    }
  };

  // Fonction pour animer la correction de l'exercice
  const animateExerciseCorrection = async () => {
    try {
      await wait(500);
      setExerciseAnimationStep('highlight-numbers');
      await wait(2000);
      setExerciseAnimationStep('show-groups');
      await wait(2000);
      setExerciseAnimationStep('show-calculation');
      await wait(2000);
      setExerciseAnimationStep('show-result');
      // Ne pas remettre à null pour garder l'animation visible
    } catch (error) {
      console.error('Erreur dans animateExerciseCorrection:', error);
      setExerciseAnimationStep(null);
      setShowExerciseAnimation(false);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowExerciseAnimation(false);
      setExerciseAnimationStep(null);
      // Reset des états d'addition posée
      setCalculationStep(null);
      setShowingCarry(false);
      setPartialResults({units: null, tens: null, hundreds: null});
    } else {
      setShowCompletionModal(true);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowCompletionModal(false);
    setShowExerciseAnimation(false);
    setExerciseAnimationStep(null);
    setExercisesHasStarted(false);
    setExercisesIsPlayingVocal(false);
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

  // Fonction pour rendre les objets avec animations
  const renderObjects = (count: number, item: string, colorClass: string) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`text-3xl ${colorClass} transition-all duration-500 transform ${
          animatingStep === 'group1' || animatingStep === 'group2' ? 'animate-bounce' : ''
        }`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {item}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🧮 Problèmes d'addition
            </h1>
            <p className="text-lg text-gray-600">
              Apprendre à résoudre des problèmes avec des histoires
            </p>
          </div>
        </div>

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
            } ${highlightCourseButton ? 'ring-4 ring-orange-400 animate-pulse scale-105' : ''}`}
          >
            📚 Cours
          </button>
          <button
            ref={exerciseTabRef}
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-orange-600 hover:bg-orange-50'
            } ${highlightExerciseButton ? 'ring-4 ring-blue-400 animate-pulse scale-105' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {/* Bouton Stop unique avec Sam - visible quand une animation est en cours */}
        {(isPlayingVocal || exercisesIsPlayingVocal || isAnimationRunning) && (
          <div className="fixed top-20 right-4 z-10 animate-fade-in">
            <button
              onClick={stopAllVocalsAndAnimations}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-105"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                {!imageError && (
                  <img
                    src="/images/pirate-small.png"
                    alt="Sam le Pirate"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-sm">🏴‍☠️</div>
                )}
              </div>
              <span className="font-semibold text-sm">Stop</span> 
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="4" width="2" height="12" />
                <rect x="12" y="4" width="2" height="12" />
              </svg>
            </button>
          </div>
        )}

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-2 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-orange-300 rounded-full bg-gradient-to-br from-orange-100 to-red-100 ${
                isPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-10 sm:w-20 h-10 sm:h-20' // Normal - plus petit sur mobile
              } flex items-center justify-center hover:scale-105 cursor-pointer`}>
                {!imageError && (
                  <img 
                    src="/images/pirate-small.png"
                    alt="Sam le Pirate"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-lg sm:text-2xl">🏴‍☠️</div>
                )}
                
                {/* Megaphone animé quand Sam parle */}
                {isPlayingVocal && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 rounded-full p-1 sm:p-2 shadow-lg animate-bounce">
                    <svg className="w-2 h-2 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER avec Sam */}
              <button
                onClick={explainChapterWithSam}
                disabled={isPlayingVocal}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-lg transition-all ${
                  isPlayingVocal
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105'
                } ${!hasStarted && !isPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingVocal ? 'Sam explique...' : 'DÉMARRER'}
              </button>
            </div>



            {/* Introduction */}
            <div 
              ref={introSectionRef}
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1 sm:p-2 bg-orange-100 rounded-lg">
                  <Book className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">Qu'est-ce qu'un problème d'addition ?</h2>
                {/* Bouton d'animation pour l'introduction */}
                <button 
                  onClick={() => readSectionIntro()}
                  className={`bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-orange-300 ${
                    highlightedElement === 'intro' ? 'ring-4 ring-yellow-400 animate-bounce scale-110' : ''
                  }`} 
                  style={{animation: 'subtle-glow 2s infinite'}}
                  title="Cliquer pour écouter cette section"
                >
                  🧮
                </button>
              </div>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                Un problème d'addition raconte une histoire avec des nombres. 
                Notre mission est de trouver ces nombres et de les additionner pour répondre à la question !
              </p>
            </div>

            {/* Méthode */}
            <div 
              ref={methodSectionRef}
              id="method-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-300 ${
                highlightedElement === 'method' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-1 sm:p-2 bg-purple-100 rounded-lg">
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">Ma méthode en 3 étapes</h2>
                {/* Bouton d'animation pour la méthode */}
                <button 
                  onClick={() => readSectionMethod()}
                  className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-purple-300 ${
                    highlightedElement === 'method' ? 'ring-4 ring-yellow-400 animate-bounce scale-110' : ''
                  }`} 
                  style={{animation: 'subtle-glow 2s infinite'}}
                  title="Cliquer pour écouter cette section"
                >
                  🎯
                </button>
              </div>
              
              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  animatingStep === 'step1' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                }`}>
                  <div 
                    className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-all duration-300 hover:bg-blue-600"
                    onClick={() => readMethodStep('step1')}
                    title="Cliquer pour écouter cette étape"
                  >
                    1
                  </div>
                  <p className="text-lg text-gray-800">Je lis le problème et je comprends l'histoire</p>
                </div>
                
                <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  animatingStep === 'step2' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-100'
                }`}>
                  <div 
                    className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-all duration-300 hover:bg-green-600"
                    onClick={() => readMethodStep('step2')}
                    title="Cliquer pour écouter cette étape"
                  >
                    2
                  </div>
                  <p className="text-lg text-gray-800">Je trouve les deux nombres à additionner</p>
                </div>
                
                <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  animatingStep === 'step3' ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-100'
                }`}>
                  <div 
                    className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer hover:scale-110 transition-all duration-300 hover:bg-purple-600"
                    onClick={() => readMethodStep('step3')}
                    title="Cliquer pour écouter cette étape"
                  >
                    3
                  </div>
                  <p className="text-lg text-gray-800">J'écris l'addition et je calcule</p>
                </div>
              </div>
            </div>

            {/* Démonstration du soulignage */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg">
                  <span className="text-lg sm:text-2xl">✏️</span>
                </div>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">Démonstration : souligner les nombres</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold text-gray-800 mb-3">Exemple d'histoire :</p>
                  <div className="text-lg text-gray-700 p-3 bg-white rounded border">
                    {highlightNumbers("Marie a 3 bonbons rouges et 4 bonbons bleus. Combien a-t-elle de bonbons en tout ?", highlightNumbersInStory)}
                  </div>
                </div>
                
                {highlightNumbersInStory && (
                  <div className="text-center p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-lg text-yellow-800 font-semibold">
                      🎯 Voyez comme les nombres <span className="bg-yellow-300 px-2 py-1 rounded font-black">3</span> et <span className="bg-yellow-300 px-2 py-1 rounded font-black">4</span> ressortent bien !
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Exemples */}
            <div 
              ref={examplesSectionRef}
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">
                  🎯 Choisis un problème à résoudre ensemble !
                </h2>
                {/* Bouton d'animation pour les exemples */}
                <button 
                  onClick={() => readSectionExamples()}
                  className={`bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300 ${
                    highlightedElement === 'examples' ? 'ring-4 ring-yellow-400 animate-bounce scale-110' : ''
                  }`} 
                  style={{animation: 'subtle-glow 2s infinite'}}
                  title="Cliquer pour écouter cette section"
                >
                  🎯
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {problemExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-purple-400 bg-purple-100' : ''} ${
                      highlightedExamples.includes(index) ? 'ring-4 ring-orange-400 bg-orange-100 animate-pulse' : ''
                    }`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{example.item}</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{example.title}</h3>
                      <div className="text-sm text-gray-600 mb-4">
                        {example.story}
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        highlightedExamples.includes(index) 
                          ? 'bg-orange-500 text-white animate-bounce shadow-lg ring-2 ring-orange-300' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}>
                        ▶️ Voir l'animation
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone d'animation */}
            {currentExample !== null && (
              <div 
                id="animation-section"
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎬 Animation du problème
                </h2>
                
                {(() => {
                  const example = problemExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Histoire */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'story' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                      }`}>
                        <div className="text-lg font-semibold text-gray-800">
                          {highlightNumbers(example.story, highlightNumbersInStory)}
                        </div>
                      </div>

                      {/* Identification des nombres */}
                      {animatingStep === 'identify' && (
                        <div className="text-center p-4 bg-yellow-100 rounded-lg">
                          <p className="text-lg text-yellow-800">
                            Je trouve les nombres : <span className="font-bold text-blue-600">{example.first}</span> et <span className="font-bold text-green-600">{example.second}</span>
                          </p>
                        </div>
                      )}

                      {/* Animation différente selon le type d'exemple */}
                      {currentExample <= 3 ? (
                        // Petits nombres (0-3) : animation avec objets visuels
                        <>
                          <div className="flex justify-center items-center space-x-8">
                            {/* Premier groupe */}
                            {(animatingStep === 'group1' || animatingStep === 'group2' || animatingStep === 'calculation' || animatingStep === 'result') && (
                              <div className={`p-4 rounded-lg ${animatingStep === 'group1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-100'}`}>
                                <div className="text-center mb-2">
                                  <span className="font-bold text-gray-800">{example.first}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {renderObjects(example.first, example.item, example.color1)}
                                </div>
                              </div>
                            )}

                            {/* Signe + */}
                            {(animatingStep === 'group2' || animatingStep === 'calculation' || animatingStep === 'result') && (
                              <div className="text-4xl font-bold text-gray-700">+</div>
                            )}

                            {/* Deuxième groupe */}
                            {(animatingStep === 'group2' || animatingStep === 'calculation' || animatingStep === 'result') && (
                              <div className={`p-4 rounded-lg ${animatingStep === 'group2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'}`}>
                                <div className="text-center mb-2">
                                  <span className="font-bold text-gray-800">{example.second}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {renderObjects(example.second, example.item, example.color2)}
                                </div>
                              </div>
                            )}

                            {/* Signe = et résultat */}
                            {(animatingStep === 'calculation' || animatingStep === 'result') && (
                              <>
                                <div className="text-4xl font-bold text-gray-700">=</div>
                                <div className={`p-4 rounded-lg ${animatingStep === 'result' ? 'bg-green-100 ring-2 ring-green-400 animate-pulse' : 'bg-gray-100'}`}>
                                  <div className="text-center mb-2">
                                    <span className="font-bold text-2xl text-gray-800">{example.result}</span>
                                  </div>
                                  {animatingStep === 'result' && (
                                    <div className="grid grid-cols-4 gap-2">
                                      {renderObjects(example.result, example.item, 'text-green-600')}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Calcul écrit */}
                          {(animatingStep === 'calculation' || animatingStep === 'result') && (
                            <div className="text-center p-4 bg-purple-100 rounded-lg">
                              <div className="text-2xl font-bold text-purple-800">
                                {highlightNumbers(`${example.first} + ${example.second} = ${example.result}`)}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // Nombres à 2 chiffres (4-8) : addition posée
                        <>
                          {/* Explication de la méthode */}
                          <div className="text-center p-4 bg-blue-100 rounded-lg mb-6">
                            <p className="text-lg font-semibold text-blue-800">
                              🧮 J'utilise la technique de l'addition posée pour ces grands nombres !
                            </p>
                          </div>

                          {/* Addition posée avec animations */}
                          {(calculationStep === 'setup' || calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result') && (
                            <div className="flex justify-center mb-6">
                              {renderPostedAddition(example.first, example.second, example.result, true)}
                            </div>
                          )}

                          {/* Messages d'étapes */}
                          {calculationStep && (
                            <div className="text-center p-4 bg-green-100 rounded-lg">
                              <div className="text-lg font-semibold text-green-700">
                                {calculationStep === 'setup' && '1️⃣ J\'aligne les nombres en colonnes !'}
                                {calculationStep === 'units' && '2️⃣ Je calcule les unités en premier !'}
                                {calculationStep === 'tens' && '3️⃣ Je calcule les dizaines !'}
                                {calculationStep === 'result' && '4️⃣ Voici le résultat final ! Excellent !'}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Section Exercices */
          <div className="space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER pour les exercices */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                exercisesIsPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-10 sm:w-20 h-10 sm:h-20' // Normal - plus petit sur mobile
              } flex items-center justify-center hover:scale-105 cursor-pointer`}>
                {!imageError && (
                  <img 
                    src="/images/pirate-small.png"
                    alt="Sam le Pirate"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-lg sm:text-2xl">🏴‍☠️</div>
                )}
                
                {/* Megaphone animé quand Sam parle */}
                {exercisesIsPlayingVocal && (
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 rounded-full p-1 sm:p-2 shadow-lg animate-bounce">
                    <svg className="w-2 h-2 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER avec Sam pour les exercices */}
              <button
                onClick={explainExercisesWithSam}
                disabled={exercisesIsPlayingVocal}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg shadow-lg transition-all ${
                  exercisesIsPlayingVocal
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-xl hover:scale-105'
                } ${!exercisesHasStarted && !exercisesIsPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {exercisesIsPlayingVocal ? 'Sam explique...' : 'DÉMARRER LES EXERCICES'}
              </button>
            </div>

            {/* Instructions pour les exercices */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-800">Comment bien réussir tes exercices ?</h2>
              </div>
              
              <div className="space-y-3 text-sm sm:text-base text-blue-700">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📖</span>
                  <p><strong>1. Lis bien l'histoire</strong> de chaque problème pour comprendre la situation.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🔍</span>
                  <p><strong>2. Trouve les deux nombres</strong> importants dans l'histoire à additionner.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">✏️</span>
                  <p><strong>3. Tape ta réponse</strong> dans la case avec le point d'interrogation.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">✨</span>
                  <p><strong>4. Si tu te trompes</strong>, Sam t'aidera avec une animation pour comprendre !</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="text-lg font-semibold text-blue-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Icône visuelle */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">{exercises[currentExercise].visual}</div>
                  </div>

                  {/* Énoncé du problème */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg text-center text-gray-800 mb-4">{exercises[currentExercise].story}</div>
                    
                    {/* Bouton Lire l'énoncé */}
                    <div className="text-center">
                      <button
                        id="read-story-button"
                        onClick={readCurrentStory}
                        className={`px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all ${
                          highlightedElement === 'read-story-button' ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-500' : ''
                        }`}
                      >
                        🔊 Lire l'énoncé
                      </button>
                    </div>
                  </div>

                  {/* Zone de réponse */}
                  <div className="text-center space-y-4">
                    <input
                      id="answer-input"
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="?"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className={`text-center text-xl font-bold border-2 border-gray-300 rounded-lg px-4 py-2 w-32 transition-all ${
                        highlightedElement === 'answer-input' ? 'ring-4 ring-yellow-400 animate-pulse border-yellow-500' : ''
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    <div>
                      <button
                        id="validate-button"
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className={`bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-all ${
                          highlightedElement === 'validate-button' ? 'ring-4 ring-yellow-400 animate-pulse bg-yellow-500' : ''
                        }`}
                      >
                        Vérifier
                      </button>
                    </div>
                  </div>

                  {/* Animation de correction visuelle pour les réponses incorrectes */}
                  {showExerciseAnimation && !isCorrect && (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-4">
                      <h3 className="text-lg font-bold text-center mb-4 text-yellow-800">
                        🎯 Regardons ensemble la solution !
                      </h3>
                      
                      {(() => {
                        const exercise = exercises[currentExercise];
                        return (
                          <div className="space-y-4">
                            {/* Énoncé en surbrillance avec nombres mis en évidence */}
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <div className="text-center font-semibold text-blue-800">
                                {exerciseAnimationStep === 'highlight-numbers' ? 
                                  highlightNumbers(exercise.story, true) : 
                                  exercise.story
                                }
                              </div>
                            </div>

                            {/* Explication de l'identification des nombres */}
                            {(exerciseAnimationStep === 'highlight-numbers' || exerciseAnimationStep === 'show-groups' || exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') && (
                              <div className="text-center p-3 bg-yellow-100 rounded-lg">
                                <p className="text-lg text-yellow-800">
                                  🎯 Je trouve les nombres : <span className="font-bold text-blue-600">{exercise.first}</span> et <span className="font-bold text-green-600">{exercise.second}</span>
                                </p>
                              </div>
                            )}

                            {/* Animation différente selon le type d'exercice */}
                            {currentExercise <= 9 ? (
                              // Exercices simples : animation avec objets visuels
                              (exerciseAnimationStep === 'show-groups' || exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') && (
                                <div className="flex justify-center items-center space-x-6">
                                  {/* Premier groupe */}
                                  <div className="p-3 rounded-lg bg-red-100 ring-2 ring-red-400">
                                    <div className="text-center mb-2">
                                      <span className="font-bold text-red-800">{exercise.first}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                      {Array.from({ length: Math.min(exercise.first, 9) }, (_, i) => (
                                        <div
                                          key={i}
                                          className={`text-2xl ${exercise.color1} animate-bounce`}
                                          style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                          {exercise.item}
                                        </div>
                                      ))}
                                      {exercise.first > 9 && (
                                        <div className="text-sm text-gray-600 col-span-3 text-center">
                                          + {exercise.first - 9} autres...
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-3xl font-bold text-gray-700">+</div>

                                  {/* Deuxième groupe */}
                                  <div className="p-3 rounded-lg bg-blue-100 ring-2 ring-blue-400">
                                    <div className="text-center mb-2">
                                      <span className="font-bold text-blue-800">{exercise.second}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                      {Array.from({ length: Math.min(exercise.second, 9) }, (_, i) => (
                                        <div
                                          key={i}
                                          className={`text-2xl ${exercise.color2} animate-bounce`}
                                          style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                          {exercise.item}
                                        </div>
                                      ))}
                                      {exercise.second > 9 && (
                                        <div className="text-sm text-gray-600 col-span-3 text-center">
                                          + {exercise.second - 9} autres...
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            ) : (
                              // Exercices à 2 chiffres : addition posée
                              (calculationStep === 'setup' || calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="space-y-4">
                                  {/* Explication de la méthode */}
                                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                                    <p className="text-lg font-semibold text-blue-800">
                                      🧮 J'utilise l'addition posée pour corriger !
                                    </p>
                                  </div>

                                  {/* Addition posée avec animations */}
                                  <div className="flex justify-center">
                                    {renderPostedAddition(exercise.first, exercise.second, exercise.answer, true)}
                                  </div>

                                  {/* Messages d'étapes */}
                                  <div className="text-center p-4 bg-green-100 rounded-lg">
                                    <div className="text-lg font-semibold text-green-700">
                                      {calculationStep === 'setup' && '1️⃣ J\'aligne les nombres en colonnes !'}
                                      {calculationStep === 'units' && '2️⃣ Je calcule les unités en premier !'}
                                      {calculationStep === 'tens' && '3️⃣ Je calcule les dizaines !'}
                                      {calculationStep === 'result' && '4️⃣ Voici le résultat final ! C\'était la bonne réponse !'}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}

                            {/* Calcul écrit */}
                            {(exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') && (
                              <div className="text-center p-4 bg-purple-100 rounded-lg">
                                <div className="text-2xl font-bold text-purple-800">
                                  {exerciseAnimationStep === 'show-result' ? 
                                    `${exercise.first} + ${exercise.second} = ${exercise.answer}` :
                                    `${exercise.first} + ${exercise.second} = ?`
                                  }
                                </div>
                              </div>
                            )}

                            {/* Résultat final */}
                            {exerciseAnimationStep === 'show-result' && (
                              <div className="text-center p-4 bg-green-100 rounded-lg ring-2 ring-green-400 animate-pulse">
                                <div className="text-3xl font-bold text-green-800 mb-2">
                                  {exercise.first} + {exercise.second} = {exercise.answer}
                                </div>
                                <div className="text-lg text-green-700">
                                  La réponse est {exercise.answer} !
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div 
                      id="exercise-correction"
                      className={`p-4 rounded-lg text-center transition-all duration-300 ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      
                      {/* Feedback pour bonne réponse - Simple et rapide */}
                      {isCorrect ? (
                        <div className="animate-bounce">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div className="text-3xl">{exercises[currentExercise].visual}</div>
                          </div>
                          <div className="text-2xl font-bold text-green-700">
                            C'est bien !
                          </div>
                        </div>
                      ) : (
                        /* Feedback pour mauvaise réponse - Détaillé */
                        <>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <XCircle className="w-6 h-6" />
                            <div className="text-2xl">{exercises[currentExercise].visual}</div>
                          </div>
                          <div className="mb-3">
                            <div className="font-bold">
                              {getPersonalizedFeedback(currentExercise, isCorrect)}
                            </div>
                          </div>
                          
                          <button
                            onClick={nextExercise}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 mt-2 transition-all"
                          >
                            {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir mes résultats'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Modal de fin */
                <div className="text-center space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Exercices terminés !
                  </h2>
                  <div className="text-2xl font-bold text-blue-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
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