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
  
  // États pour Steve
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

  // Données des problèmes avec animations - NIVEAU CE1 (nombres plus petits, contextes familiers)
  const problemExamples = [
    {
      id: 'bonbons',
      title: 'Les bonbons de Léa',
      story: 'Léa a 3 bonbons rouges et 4 bonbons bleus. Combien a-t-elle de bonbons en tout ?',
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
      story: 'Tom a 4 petites voitures et 3 camions. Combien a-t-il de véhicules au total ?',
      first: 4,
      second: 3,
      result: 7,
      item: '🚗',
      color1: 'text-orange-600',
      color2: 'text-green-600'
    },
    {
      id: 'animaux',
      title: 'Les chats de la ferme',
      story: 'Dans la ferme de Mamie, il y a 5 chatons noirs et 3 chatons blancs. Combien y a-t-il de chatons ?',
      first: 5,
      second: 3,
      result: 8,
      item: '🐱',
      color1: 'text-gray-800',
      color2: 'text-gray-400'
    },
    {
      id: 'ecole',
      title: 'Les crayons de couleur',
      story: 'Dans la trousse de Julie, il y a 6 crayons rouges et 4 crayons verts. Combien de crayons a-t-elle ?',
      first: 6,
      second: 4,
      result: 10,
      item: '✏️',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      id: 'cuisine',
      title: 'Les cookies de Maman',
      story: 'Maman a fait 7 cookies au chocolat et 5 cookies aux pépites. Combien de cookies a-t-elle préparés ?',
      first: 7,
      second: 5,
      result: 12,
      item: '🍪',
      color1: 'text-amber-700',
      color2: 'text-amber-600'
    },
    {
      id: 'jardin',
      title: 'Les fleurs du jardin',
      story: 'Dans le jardin, Papa a planté 8 tulipes rouges et 6 tulipes jaunes. Combien de fleurs vont pousser ?',
      first: 8,
      second: 6,
      result: 14,
      item: '🌷',
      color1: 'text-red-600',
      color2: 'text-yellow-600'
    },
    {
      id: 'bibliotheque',
      title: 'Les livres de la classe',
      story: 'Sur l\'étagère de la classe, il y a 9 livres de contes et 7 livres d\'images. Combien de livres y a-t-il ?',
      first: 9,
      second: 7,
      result: 16,
      item: '📚',
      color1: 'text-purple-600',
      color2: 'text-blue-600'
    },
    {
      id: 'recreation',
      title: 'Les billes de Paul',
      story: 'Paul a 11 billes bleues et 8 billes rouges dans son sac. Combien de billes a-t-il en tout ?',
      first: 11,
      second: 8,
      result: 19,
      item: '⚪',
      color1: 'text-blue-600',
      color2: 'text-red-600'
    },
    {
      id: 'anniversaire',
      title: 'Les invités d\'Emma',
      story: 'Pour son anniversaire, Emma a invité 12 filles de sa classe et 8 garçons. Combien d\'enfants vont venir à la fête ?',
      first: 12,
      second: 8,
      result: 20,
      item: '🎉',
      color1: 'text-pink-600',
      color2: 'text-blue-600'
    }
  ];

  // 20 Exercices progressifs CE1 : simple → nombres à 2-3 chiffres avec retenues → jusqu'à 1000+
  const exercises = [
    // NIVEAU 1 : Additions simples (1-20)
    {
      story: 'Léa range ses autocollants. Elle a 8 autocollants d\'animaux et 7 autocollants de fleurs. Combien d\'autocollants a-t-elle ?',
      answer: 15,
      visual: '🌟',
      first: 8,
      second: 7,
      item: '🌟',
      color1: 'text-blue-600',
      color2: 'text-pink-600'
    },
    {
      story: 'Dans son pot à crayons, Nina compte 9 crayons bleus et 8 crayons rouges. Combien de crayons y a-t-il ?',
      answer: 17,
      visual: '✏️',
      first: 9,
      second: 8,
      item: '✏️',
      color1: 'text-blue-600',
      color2: 'text-red-600'
    },
    
    // NIVEAU 2 : Additions avec nombres jusqu'à 50
    {
      story: 'Tom collectionne les cartes. Il a 23 cartes de football et 18 cartes de basketball. Combien de cartes a-t-il ?',
      answer: 41,
      visual: '🎴',
      first: 23,
      second: 18,
      item: '🎴',
      color1: 'text-green-600',
      color2: 'text-orange-600'
    },
    {
      story: 'Maman a acheté des fruits. Elle a 27 pommes et 16 poires pour la semaine. Combien de fruits a-t-elle ?',
      answer: 43,
      visual: '🍎',
      first: 27,
      second: 16,
      item: '🍎',
      color1: 'text-red-600',
      color2: 'text-yellow-600'
    },
    {
      story: 'Dans la classe de CE1, il y a 34 livres de mathématiques et 29 livres de français. Combien de livres y a-t-il ?',
      answer: 63,
      visual: '📚',
      first: 34,
      second: 29,
      item: '📚',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    
    // NIVEAU 3 : Additions avec retenues (50-100)
    {
      story: 'Julie collectionne les billes. Elle a 38 billes colorées et 27 billes transparentes. Combien de billes a-t-elle ?',
      answer: 65,
      visual: '⚪',
      first: 38,
      second: 27,
      item: '⚪',
      color1: 'text-purple-600',
      color2: 'text-gray-400'
    },
    {
      story: 'Papa plante des fleurs. Il met 47 tulipes dans le jardin du devant et 36 tulipes dans le jardin de derrière. Combien de tulipes a-t-il plantées ?',
      answer: 83,
      visual: '🌷',
      first: 47,
      second: 36,
      item: '🌷',
      color1: 'text-red-600',
      color2: 'text-yellow-600'
    },
    {
      story: 'Dans la bibliothèque, il y a 59 livres d\'aventure et 28 livres de science. Combien de livres y a-t-il ?',
      answer: 87,
      visual: '📖',
      first: 59,
      second: 28,
      item: '📖',
      color1: 'text-orange-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 4 : Nombres plus grands (100-200)
    {
      story: 'Sophie compte ses autocollants. Elle a 68 autocollants de princesses et 45 autocollants d\'animaux. Combien d\'autocollants a-t-elle ?',
      answer: 113,
      visual: '🌟',
      first: 68,
      second: 45,
      item: '🌟',
      color1: 'text-pink-600',
      color2: 'text-green-600'
    },
    {
      story: 'Lucas compte ses LEGO. Il a 76 pièces rouges et 58 pièces bleues. Combien de pièces a-t-il en tout ?',
      answer: 134,
      visual: '🧱',
      first: 76,
      second: 58,
      item: '🧱',
      color1: 'text-red-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 5 : Additions complexes (200-500)
    {
      story: 'Marie fait un puzzle géant. Elle a déjà posé 87 pièces le matin et 96 pièces l\'après-midi. Combien de pièces a-t-elle posées ?',
      answer: 183,
      visual: '🧩',
      first: 87,
      second: 96,
      item: '🧩',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    {
      story: 'Dans la ferme de grand-père, il y a 128 poules et 97 canards. Combien d\'oiseaux y a-t-il ?',
      answer: 225,
      visual: '🐔',
      first: 128,
      second: 97,
      item: '🐔',
      color1: 'text-yellow-600',
      color2: 'text-orange-600'
    },
    {
      story: 'Antoine collectionne les cartes. Il a 156 cartes dans sa première boîte et 178 cartes dans sa deuxième boîte. Combien de cartes a-t-il ?',
      answer: 334,
      visual: '🎮',
      first: 156,
      second: 178,
      item: '🎮',
      color1: 'text-purple-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 6 : Grandes additions (500-1000)
    {
      story: 'Emma dessine des pixels sur son ordinateur. Elle en a colorié 234 le matin et 289 l\'après-midi. Combien de pixels a-t-elle coloriés ?',
      answer: 523,
      visual: '🎨',
      first: 234,
      second: 289,
      item: '🎨',
      color1: 'text-pink-600',
      color2: 'text-purple-600'
    },
    {
      story: 'Dans sa collection, Léo a 367 coquillages de la mer du Nord et 258 coquillages de la Méditerranée. Combien de coquillages a-t-il ?',
      answer: 625,
      visual: '🐚',
      first: 367,
      second: 258,
      item: '🐚',
      color1: 'text-blue-600',
      color2: 'text-cyan-600'
    },
    {
      story: 'Hugo compte les pages qu\'il a lues. Il a lu 428 pages en janvier et 345 pages en février. Combien de pages a-t-il lues ?',
      answer: 773,
      visual: '📚',
      first: 428,
      second: 345,
      item: '📚',
      color1: 'text-green-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 7 : Très grandes additions (1000+)
    {
      story: 'Dans le jeu vidéo de Maman, elle a collecté 456 pièces d\'or dans le premier niveau et 567 pièces dans le second niveau. Combien de pièces a-t-elle ?',
      answer: 1023,
      visual: '🪙',
      first: 456,
      second: 567,
      item: '🪙',
      color1: 'text-yellow-600',
      color2: 'text-amber-600'
    },
    {
      story: 'Paul construit une grande tour. Il utilise 678 blocs rouges et 445 blocs verts. Combien de blocs utilise-t-il en tout ?',
      answer: 1123,
      visual: '🏗️',
      first: 678,
      second: 445,
      item: '🏗️',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      story: 'Zoé compte les photos dans sa famille. Il y a 589 photos de vacances et 634 photos d\'anniversaires. Combien de photos y a-t-il ?',
      answer: 1223,
      visual: '📷',
      first: 589,
      second: 634,
      item: '📷',
      color1: 'text-blue-600',
      color2: 'text-pink-600'
    },
    {
      story: 'Thomas compte ses points dans le jeu. Il a marqué 734 points hier et 789 points aujourd\'hui. Combien de points a-t-il en tout ?',
      answer: 1523,
      visual: '🎯',
      first: 734,
      second: 789,
      item: '🎯',
      color1: 'text-orange-600',
      color2: 'text-red-600'
    }
  ];

  // Fonction pour générer un message de correction personnalisé
  const getPersonalizedFeedback = (exerciseIndex: number, isCorrect: boolean) => {
    const exercise = exercises[exerciseIndex];
    const icon = exercise.visual;
    
    if (isCorrect) {
             const successMessages = [
        `Bravo ! ${icon} Léa a exactement ${exercise.answer} autocollants dans sa collection !`,
        `Parfait ! ${icon} Nina a bien ${exercise.answer} crayons colorés dans son pot !`,
        `Excellent ! ${icon} Tom a ${exercise.answer} voitures dans sa collection !`,
        `Super ! ${icon} Maman a ${exercise.answer} pommes délicieuses !`,
        `Bravo ! ${icon} Il y a précisément ${exercise.answer} élèves dans la classe de CE1 !`,
        `Formidable ! ${icon} Julie a ${exercise.answer} billes dans sa trousse !`,
        `Magnifique ! ${icon} Papa a planté ${exercise.answer} tulipes dans le jardin !`,
        `Excellent ! ${icon} Il y a ${exercise.answer} livres sur l'étagère !`,
        `Parfait ! ${icon} Sophie a ${exercise.answer} jouets dans sa chambre !`,
        `Super ! ${icon} Lucas a ${exercise.answer} cartes de jeu !`,
        `Merveilleux ! ${icon} Marie a posé ${exercise.answer} pièces de puzzle !`,
        `Fantastique ! ${icon} Les enfants ont planté ${exercise.answer} graines !`,
        `Génial ! ${icon} Antoine a ${exercise.answer} capsules dans sa collection !`,
        `Bravo ! ${icon} Emma a dessiné ${exercise.answer} étoiles magnifiques !`,
        `Excellent ! ${icon} Léo a ${exercise.answer} coquillages de la plage !`,
        `Parfait ! ${icon} Hugo a ${exercise.answer} timbres dans son album !`,
        `Délicieux ! ${icon} Maman a préparé ${exercise.answer} gâteaux savoureux !`,
        `Formidable ! ${icon} Paul a ${exercise.answer} blocs de construction !`,
        `Super ! ${icon} Zoé a ${exercise.answer} photos dans son album !`,
        `Fantastique ! ${icon} Thomas a ${exercise.answer} badges sur son sac !`
      ];
      return successMessages[exerciseIndex] || `Bravo ! ${icon} Tu as trouvé ${exercise.answer} !`;
    } else {
             const correctionMessages = [
        `${icon} Léa a : ${exercise.first} autocollants d'animaux + ${exercise.second} autocollants de fleurs = ${exercise.answer} autocollants !`,
        `${icon} Nina a : ${exercise.first} crayons bleus + ${exercise.second} crayons rouges = ${exercise.answer} crayons !`,
        `${icon} Tom a : ${exercise.first} voitures rouges + ${exercise.second} voitures bleues = ${exercise.answer} voitures !`,
        `${icon} Maman a : ${exercise.first} pommes vertes + ${exercise.second} pommes rouges = ${exercise.answer} pommes !`,
        `${icon} Dans la classe : ${exercise.first} filles + ${exercise.second} garçons = ${exercise.answer} élèves !`,
        `${icon} Julie a : ${exercise.first} billes transparentes + ${exercise.second} billes colorées = ${exercise.answer} billes !`,
        `${icon} Papa a planté : ${exercise.first} tulipes jaunes + ${exercise.second} tulipes roses = ${exercise.answer} tulipes !`,
        `${icon} Dans la bibliothèque : ${exercise.first} livres sur les animaux + ${exercise.second} livres sur les plantes = ${exercise.answer} livres !`,
        `${icon} Sophie a : ${exercise.first} peluches + ${exercise.second} poupées = ${exercise.answer} jouets !`,
        `${icon} Lucas a : ${exercise.first} cartes bleues + ${exercise.second} cartes rouges = ${exercise.answer} cartes !`,
        `${icon} Marie a posé : ${exercise.first} pièces bleues + ${exercise.second} pièces vertes = ${exercise.answer} pièces !`,
        `${icon} Les enfants ont planté : ${exercise.first} graines de radis + ${exercise.second} graines de carottes = ${exercise.answer} graines !`,
        `${icon} Antoine a : ${exercise.first} capsules de sodas + ${exercise.second} capsules d'eau = ${exercise.answer} capsules !`,
        `${icon} Emma a dessiné : ${exercise.first} étoiles jaunes + ${exercise.second} étoile argentée = ${exercise.answer} étoiles !`,
        `${icon} Léo a : ${exercise.first} coquillages blancs + ${exercise.second} coquillages roses = ${exercise.answer} coquillages !`,
        `${icon} Hugo a : ${exercise.first} timbres français + ${exercise.second} timbres étrangers = ${exercise.answer} timbres !`,
        `${icon} Maman a fait : ${exercise.first} gâteaux au chocolat + ${exercise.second} gâteaux à la vanille = ${exercise.answer} gâteaux !`,
        `${icon} Paul a : ${exercise.first} blocs rouges + ${exercise.second} blocs verts = ${exercise.answer} blocs !`,
        `${icon} Zoé a : ${exercise.first} photos de vacances + ${exercise.second} photos d'anniversaire = ${exercise.answer} photos !`,
        `${icon} Thomas a : ${exercise.first} badges de sports + ${exercise.second} badges de musique = ${exercise.answer} badges !`
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
      await playAudio("Salut, aventurier ! Bienvenue dans le monde des problèmes d'addition !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Aujourd'hui, tu vas apprendre à collecter et additionner les nombres comme un vrai explorateur !");
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
      
      await playAudio("Voici ma méthode de construction ! N'oublie pas de tester l'animation !");
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
      await playAudio("Bon courage, jeune aventurier ! Ta quête commence maintenant !");
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
      await playAudio("Salut, aventurier ! C'est l'heure de t'entraîner avec les exercices !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Tu vas résoudre 20 problèmes d'addition différents, c'est parti pour l'aventure !");
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
      await playAudio("Si tu te trompes, je t'aiderai avec une animation pour comprendre ! En avant, jeune aventurier !");
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
      // Scroll vers la zone d'animation
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

      // Montrer les objets du premier groupe
      setAnimatingStep('group1');
      await playAudio(`Voici les ${example.first} premiers objets.`);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Montrer les objets du deuxième groupe
      setAnimatingStep('group2');
      await playAudio(`Et voici les ${example.second} autres objets.`);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Calcul
      setAnimatingStep('calculation');
      await playAudio(`Pour trouver le total, je fais l'addition : ${example.first} plus ${example.second} égale ${example.result}.`);
      await wait(800);

      if (stopSignalRef.current) return;

      // Résultat final
      setAnimatingStep('result');
      await playAudio(`La réponse est ${example.result} ! Bravo !`);
      await wait(1000);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setHighlightNumbersInStory(false);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour les exercices
  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correct = userNum === exercises[currentExercise].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      // Passer automatiquement au suivant après 2 secondes
      setTimeout(() => {
        nextExercise();
      }, 2000);
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
      // Créer une explication personnalisée basée sur le contexte du problème CE1
      const getPersonalizedExplanation = () => {
        const story = exercise.story.toLowerCase();
        let context = '';
        
        if (story.includes('autocollant')) {
          context = `Il y a ${first} autocollants et ${second} autocollants`;
        } else if (story.includes('crayon')) {
          context = `Il y a ${first} crayons et ${second} crayons`;
        } else if (story.includes('voiture')) {
          context = `Il y a ${first} voitures et ${second} voitures`;
        } else if (story.includes('pomme')) {
          context = `Il y a ${first} pommes et ${second} pommes`;
        } else if (story.includes('fille') || story.includes('garçon') || story.includes('élève')) {
          context = `Il y a ${first} enfants et ${second} enfants`;
        } else if (story.includes('bille')) {
          context = `Il y a ${first} billes et ${second} billes`;
        } else if (story.includes('tulipe') || story.includes('fleur')) {
          context = `Il y a ${first} tulipes et ${second} tulipes`;
        } else if (story.includes('livre')) {
          context = `Il y a ${first} livres et ${second} livres`;
        } else if (story.includes('peluche') || story.includes('poupée') || story.includes('jouet')) {
          context = `Il y a ${first} jouets et ${second} jouets`;
        } else if (story.includes('carte')) {
          context = `Il y a ${first} cartes et ${second} cartes`;
        } else if (story.includes('pièce') || story.includes('puzzle')) {
          context = `Il y a ${first} pièces et ${second} pièces`;
        } else if (story.includes('graine')) {
          context = `Il y a ${first} graines et ${second} graines`;
        } else if (story.includes('capsule')) {
          context = `Il y a ${first} capsules et ${second} capsules`;
        } else if (story.includes('étoile')) {
          context = `Il y a ${first} étoiles et ${second} étoiles`;
        } else if (story.includes('coquillage')) {
          context = `Il y a ${first} coquillages et ${second} coquillages`;
        } else if (story.includes('timbre')) {
          context = `Il y a ${first} timbres et ${second} timbres`;
        } else if (story.includes('gâteau')) {
          context = `Il y a ${first} gâteaux et ${second} gâteaux`;
        } else if (story.includes('bloc')) {
          context = `Il y a ${first} blocs et ${second} blocs`;
        } else if (story.includes('photo')) {
          context = `Il y a ${first} photos et ${second} photos`;
        } else if (story.includes('badge')) {
          context = `Il y a ${first} badges et ${second} badges`;
        } else if (story.includes('bonbon')) {
          context = `Il y a ${first} bonbons et ${second} bonbons`;
        } else if (story.includes('chat') || story.includes('chaton')) {
          context = `Il y a ${first} chatons et ${second} chatons`;
        } else if (story.includes('cookie')) {
          context = `Il y a ${first} cookies et ${second} cookies`;
        } else {
          // Fallback générique
          context = `Les nombres sont ${first} et ${second}`;
        }
        
        return context;
      };
      
      // Correction avec mise en évidence et vitesse lente
      setExerciseAnimationStep('highlight-numbers');
      await quickAudio(getPersonalizedExplanation());
      await wait(700);
      
      setExerciseAnimationStep('show-calculation');
      await quickAudio(`${first} plus ${second} égale ${result}`);
      await wait(700);
      
      setExerciseAnimationStep('show-result');
      await quickAudio(`La bonne réponse est ${result} !`);
      await wait(1000);
      
      setExerciseAnimationStep(null);
      
    } catch (error) {
      console.error('Erreur dans quickVocalCorrection:', error);
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
            href="/chapitre/ce1-quatre-operations/addition-ce1" 
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
              Apprendre à résoudre des problèmes d'addition - Niveau CE1
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

        {/* Bouton Stop unique avec Steve - visible quand une animation est en cours */}
        {(isPlayingVocal || exercisesIsPlayingVocal || isAnimationRunning) && (
          <div className="fixed top-20 right-4 z-10 animate-fade-in">
            <button
              onClick={stopAllVocalsAndAnimations}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-105"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                {!imageError && (
                  <img
                    src="/image/Minecraftstyle.png"
                    alt="Sam"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-sm">🧱</div>
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
            {/* Image de Steve avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Steve */}
              <div className={`relative transition-all duration-500 border-2 border-orange-300 rounded-full bg-gradient-to-br from-orange-100 to-red-100 ${
                isPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-10 sm:w-20 h-10 sm:h-20' // Normal - plus petit sur mobile
              } flex items-center justify-center hover:scale-105 cursor-pointer`}>
                {!imageError && (
                  <img 
                    src="/image/Minecraftstyle.png"
                    alt="Sam"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-lg sm:text-2xl">🧱</div>
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

              {/* Bouton DÉMARRER avec Steve */}
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
                {isPlayingVocal ? 'Steve explique...' : 'DÉMARRER'}
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
                {/* Icône d'animation pour l'introduction */}
                <div className={`bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-orange-300 ${
                  highlightedElement === 'intro' ? 'ring-4 ring-yellow-400 animate-bounce scale-110' : ''
                }`} 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🧮
                </div>
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
                {/* Icône d'animation pour les exemples */}
                <div className={`bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300 ${
                  highlightedElement === 'examples' ? 'ring-4 ring-yellow-400 animate-bounce scale-110' : ''
                }`} 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🎯
                </div>
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

                      {/* Animation des objets */}
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
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Section Exercices */
          <div className="space-y-6">
            {/* Image de Steve avec bouton DÉMARRER pour les exercices */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Steve */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                exercisesIsPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-10 sm:w-20 h-10 sm:h-20' // Normal - plus petit sur mobile
              } flex items-center justify-center hover:scale-105 cursor-pointer`}>
                {!imageError && (
                  <img 
                    src="/image/Minecraftstyle.png"
                    alt="Sam"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                )}
                {imageError && (
                  <div className="text-lg sm:text-2xl">🧱</div>
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

              {/* Bouton DÉMARRER avec Steve pour les exercices */}
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
                {exercisesIsPlayingVocal ? 'Steve explique...' : 'DÉMARRER LES EXERCICES'}
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
                  <p><strong>4. Si tu te trompes</strong>, Steve t'aidera avec une animation pour comprendre !</p>
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

                            {/* Animation des objets avec représentation adaptée */}
                            {(exerciseAnimationStep === 'show-groups' || exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') && (
                              <div className="flex justify-center items-center space-x-6">
                                {/* Premier groupe */}
                                <div className="p-3 rounded-lg bg-red-100 ring-2 ring-red-400">
                                  <div className="text-center mb-2">
                                    <span className="font-bold text-red-800">{exercise.first}</span>
                                  </div>
                                  {exercise.first <= 12 ? (
                                    /* Petits nombres : affichage direct */
                                    <div className="grid grid-cols-4 gap-1 max-w-32">
                                      {Array.from({ length: exercise.first }, (_, i) => (
                                        <div
                                          key={i}
                                          className={`text-xl ${exercise.color1} animate-bounce`}
                                          style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                          {exercise.item}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    /* Grands nombres : représentation dizaines + unités */
                                    <div className="space-y-2">
                                      {Math.floor(exercise.first / 10) > 0 && (
                                        <div className="text-center">
                                          <div className="text-xs text-gray-600 mb-1">Dizaines</div>
                                          <div className="flex justify-center space-x-1">
                                            {Array.from({ length: Math.floor(exercise.first / 10) }, (_, i) => (
                                              <div
                                                key={i}
                                                className="w-6 h-8 bg-red-400 rounded animate-pulse border border-red-600"
                                                style={{ animationDelay: `${i * 200}ms` }}
                                                title="10"
                                              >
                                                <div className="text-xs text-white text-center leading-8 font-bold">10</div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {exercise.first % 10 > 0 && (
                                        <div className="text-center">
                                          <div className="text-xs text-gray-600 mb-1">Unités</div>
                                          <div className="flex justify-center space-x-1">
                                            {Array.from({ length: exercise.first % 10 }, (_, i) => (
                                              <div
                                                key={i}
                                                className={`text-sm ${exercise.color1} animate-bounce`}
                                                style={{ animationDelay: `${i * 100}ms` }}
                                              >
                                                {exercise.item}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="text-3xl font-bold text-gray-700">+</div>

                                {/* Deuxième groupe */}
                                <div className="p-3 rounded-lg bg-blue-100 ring-2 ring-blue-400">
                                  <div className="text-center mb-2">
                                    <span className="font-bold text-blue-800">{exercise.second}</span>
                                  </div>
                                  {exercise.second <= 12 ? (
                                    /* Petits nombres : affichage direct */
                                    <div className="grid grid-cols-4 gap-1 max-w-32">
                                      {Array.from({ length: exercise.second }, (_, i) => (
                                        <div
                                          key={i}
                                          className={`text-xl ${exercise.color2} animate-bounce`}
                                          style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                          {exercise.item}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    /* Grands nombres : représentation dizaines + unités */
                                    <div className="space-y-2">
                                      {Math.floor(exercise.second / 10) > 0 && (
                                        <div className="text-center">
                                          <div className="text-xs text-gray-600 mb-1">Dizaines</div>
                                          <div className="flex justify-center space-x-1">
                                            {Array.from({ length: Math.floor(exercise.second / 10) }, (_, i) => (
                                              <div
                                                key={i}
                                                className="w-6 h-8 bg-blue-400 rounded animate-pulse border border-blue-600"
                                                style={{ animationDelay: `${i * 200}ms` }}
                                                title="10"
                                              >
                                                <div className="text-xs text-white text-center leading-8 font-bold">10</div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {exercise.second % 10 > 0 && (
                                        <div className="text-center">
                                          <div className="text-xs text-gray-600 mb-1">Unités</div>
                                          <div className="flex justify-center space-x-1">
                                            {Array.from({ length: exercise.second % 10 }, (_, i) => (
                                              <div
                                                key={i}
                                                className={`text-sm ${exercise.color2} animate-bounce`}
                                                style={{ animationDelay: `${i * 100}ms` }}
                                              >
                                                {exercise.item}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
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
                      className={`p-4 rounded-lg text-center ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <XCircle className="w-6 h-6" />
                        )}
                        <div className="text-2xl">{exercises[currentExercise].visual}</div>
                      </div>
                      <div className="mb-3">
                        <div className="font-bold">
                          {getPersonalizedFeedback(currentExercise, isCorrect)}
                        </div>
                      </div>
                      
                      {/* Afficher le bouton seulement si la réponse est incorrecte */}
                      {!isCorrect && (
                        <button
                          onClick={nextExercise}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 mt-2 transition-all"
                        >
                          {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir mes résultats'}
                        </button>
                      )}
                      
                      {/* Message pour bonne réponse */}
                      {isCorrect && (
                        <div className="text-sm text-green-600 mt-2 animate-pulse">
                          Passage automatique à l'exercice suivant...
                        </div>
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