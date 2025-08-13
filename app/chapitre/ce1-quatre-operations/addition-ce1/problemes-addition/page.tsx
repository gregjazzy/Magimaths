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
      story: 'Dans la ferme de Mamie, il y a 35 chatons noirs et 28 chatons blancs. Combien y a-t-il de chatons ?',
      first: 35,
      second: 28,
      result: 63,
      item: '🐱',
      color1: 'text-gray-800',
      color2: 'text-gray-400'
    },
    {
      id: 'ecole',
      title: 'Les crayons de couleur',
      story: 'Dans la trousse de Julie, il y a 46 crayons rouges et 37 crayons verts. Combien de crayons a-t-elle ?',
      first: 46,
      second: 37,
      result: 83,
      item: '✏️',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      id: 'cuisine',
      title: 'Les cookies de Maman',
      story: 'Maman a fait 47 cookies au chocolat et 35 cookies aux pépites. Combien de cookies a-t-elle préparés ?',
      first: 47,
      second: 35,
      result: 82,
      item: '🍪',
      color1: 'text-amber-700',
      color2: 'text-amber-600'
    },
    {
      id: 'jardin',
      title: 'Les fleurs du jardin',
      story: 'Dans le jardin, Papa a planté 248 tulipes rouges et 316 tulipes jaunes. Combien de fleurs vont pousser ?',
      first: 248,
      second: 316,
      result: 564,
      item: '🌷',
      color1: 'text-red-600',
      color2: 'text-yellow-600'
    },
    {
      id: 'bibliotheque',
      title: 'Les livres de la classe',
      story: 'Sur l\'étagère de la classe, il y a 329 livres de contes et 287 livres d\'images. Combien de livres y a-t-il ?',
      first: 329,
      second: 287,
      result: 616,
      item: '📚',
      color1: 'text-purple-600',
      color2: 'text-blue-600'
    },
    {
      id: 'recreation',
      title: 'Les billes de Paul',
      story: 'Paul collectionne les billes depuis qu\'il a 6 ans. Il possède 411 billes bleues et 378 billes rouges dans son coffre à trésors. Combien de billes a-t-il au total dans sa collection ?',
      first: 411,
      second: 378,
      result: 789,
      item: '⚪',
      color1: 'text-blue-600',
      color2: 'text-red-600'
    },
    {
      id: 'anniversaire',
      title: 'Les invités d\'Emma',
      story: 'Emma organise une grande fête d\'anniversaire. Sa maman a préparé des invitations : 512 pour les filles de l\'école et 348 pour les garçons. Quel est le nombre total d\'invitations préparées ?',
      first: 512,
      second: 348,
      result: 860,
      item: '🎉',
      color1: 'text-pink-600',
      color2: 'text-blue-600'
    },
    {
      id: 'magasin',
      title: 'Les jouets du magasin',
      story: 'Dans un grand magasin de jouets, le rayon poupées compte 347 poupées classiques. Le gérant vient de recevoir 285 poupées de plus que ce qu\'il y avait déjà. Combien de nouvelles poupées a-t-il reçues ?',
      first: 347,
      second: 285,
      result: 632,
      item: '🎎',
      color1: 'text-pink-600',
      color2: 'text-purple-600'
    },
    {
      id: 'ferme',
      title: 'Les graines du fermier',
      story: 'Un fermier expérimenté prépare ses semis pour le printemps. Il a déjà planté 458 graines de tournesol hier matin. Aujourd\'hui, il souhaite planter 367 graines supplémentaires dans un autre champ. Au final, combien de graines de tournesol aura-t-il plantées en tout ?',
      first: 458,
      second: 367,
      result: 825,
      item: '🌻',
      color1: 'text-yellow-600',
      color2: 'text-green-600'
    }
  ];

  // 20 Exercices progressifs CE1 : simple → nombres à 2-3 chiffres avec retenues → jusqu'à 1000+
  const exercises = [
    // NIVEAU 1 : Problèmes de réunion simples (nombres 1-20)
    {
      story: 'Léo a 5 billes. Son ami lui en donne 3. Combien de billes a Léo en tout ?',
      question: 'Combien de billes a Léo en tout ?',
      answer: 8,
      visual: '⚪',
      first: 5,
      second: 3,
      item: '⚪',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    {
      story: 'Dans un champ, il y a 8 vaches et 6 moutons. Combien y a-t-il d\'animaux au total ?',
      question: 'Combien y a-t-il d\'animaux au total ?',
      answer: 14,
      visual: '🐄',
      first: 8,
      second: 6,
      item: '🐄',
      color1: 'text-brown-600',
      color2: 'text-gray-600'
    },
    
    // NIVEAU 2 : Problèmes de transformation (nombres 1-30)
    {
      story: 'Julie a 7 pommes. Sa maman lui en donne 4 de plus. Combien de pommes Julie a-t-elle maintenant ?',
      question: 'Combien de pommes Julie a-t-elle maintenant ?',
      answer: 11,
      visual: '🍎',
      first: 7,
      second: 4,
      item: '🍎',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      story: 'Tom avait 12 cartes. Il en achète 9 nouvelles. Combien Tom a-t-il de cartes maintenant ?',
      question: 'Combien Tom a-t-il de cartes maintenant ?',
      answer: 21,
      visual: '🎴',
      first: 12,
      second: 9,
      item: '🎴',
      color1: 'text-blue-600',
      color2: 'text-purple-600'
    },
    
    // NIVEAU 3 : Problèmes avec données inutiles (nombres 20-80)
    {
      story: 'Max a 10 ans. Il a acheté 25 cahiers et 18 stylos. Combien d\'articles a-t-il achetés en tout ?',
      question: 'Combien d\'articles a-t-il achetés en tout ?',
      answer: 43,
      visual: '📝',
      first: 25,
      second: 18,
      item: '📝',
      color1: 'text-blue-600',
      color2: 'text-red-600'
    },
    {
      story: 'Emma mesure 1m20. Elle range sa collection : 34 livres de contes et 29 livres de poésie. Combien de livres a-t-elle ?',
      question: 'Combien de livres a-t-elle ?',
      answer: 63,
      visual: '📚',
      first: 34,
      second: 29,
      item: '📚',
      color1: 'text-green-600',
      color2: 'text-purple-600'
    },
    
    // NIVEAU 4 : Problèmes de comparaison (nombres 30-150)
    {
      story: 'Léa a 45 poupées. Tom a 28 poupées de plus que Léa. Combien de poupées Tom a-t-il ?',
      question: 'Combien de poupées Tom a-t-il ?',
      answer: 73,
      visual: '🎎',
      first: 45,
      second: 28,
      item: '🎎',
      color1: 'text-pink-600',
      color2: 'text-blue-600'
    },
    {
      story: 'Sophie collectionne les autocollants. Elle en a 67. Sa sœur en a 49 de plus. Combien d\'autocollants sa sœur a-t-elle ?',
      question: 'Combien d\'autocollants sa sœur a-t-elle ?',
      answer: 116,
      visual: '🌟',
      first: 67,
      second: 49,
      item: '🌟',
      color1: 'text-yellow-600',
      color2: 'text-purple-600'
    },
    
    // NIVEAU 5 : Problèmes complexes avec grands nombres (100-400)
    {
      story: 'Dans une grande bibliothèque, l\'étage des enfants compte 156 livres d\'histoires et 178 livres documentaires. Quel est le nombre total de livres à l\'étage des enfants ?',
      question: 'Quel est le nombre total de livres à l\'étage des enfants ?',
      answer: 334,
      visual: '📖',
      first: 156,
      second: 178,
      item: '📖',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    {
      story: 'Un fermier élève des animaux. Il possède 187 moutons dans le pré du nord et 146 moutons dans le pré du sud. Combien de moutons possède-t-il en totalité ?',
      question: 'Combien de moutons possède-t-il en totalité ?',
      answer: 333,
      visual: '🐑',
      first: 187,
      second: 146,
      item: '🐑',
      color1: 'text-gray-600',
      color2: 'text-white'
    },
    
    // NIVEAU 6 : Problèmes très complexes avec contexte élaboré (200-800)
    {
      story: 'Une école organise une collecte de jouets pour Noël. Les élèves de maternelle ont apporté 245 jouets, les élèves de CP ont apporté 189 jouets, et les élèves de CE1 ont ajouté 178 jouets de plus que les CP. Combien de jouets les élèves de CE1 ont-ils apportés ?',
      question: 'Combien de jouets les élèves de CE1 ont-ils apportés ?',
      answer: 367,
      visual: '🧸',
      first: 189,
      second: 178,
      item: '🧸',
      color1: 'text-red-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 7 : Problèmes à données multiples et contexte riche (300-900)
    {
      story: 'Un magasin de sport reçoit une livraison. Le matin, 278 ballons sont livrés. L\'après-midi, le camion apporte 156 ballons supplémentaires. Le soir, un dernier camion livre encore 89 ballons de plus que la livraison de l\'après-midi. Combien de ballons le dernier camion a-t-il livrés ?',
      question: 'Combien de ballons le dernier camion a-t-il livrés ?',
      answer: 245,
      visual: '⚽',
      first: 156,
      second: 89,
      item: '⚽',
      color1: 'text-green-600',
      color2: 'text-orange-600'
    },
    
    // NIVEAU 8 : Problèmes de synthèse avec calculs imbriqués (400-1000)
    {
      story: 'Une pâtisserie prépare des gâteaux pour une fête. Le chef pâtissier fait 328 petits fours le matin. Son apprenti en prépare 245 l\'après-midi. En fin de journée, ils décident de faire ensemble 127 petits fours de plus que ce que l\'apprenti avait préparé. Combien de petits fours ont-ils faits ensemble en fin de journée ?',
      question: 'Combien de petits fours ont-ils faits ensemble en fin de journée ?',
      answer: 372,
      visual: '🧁',
      first: 245,
      second: 127,
      item: '🧁',
      color1: 'text-pink-600',
      color2: 'text-yellow-600'
    },
    
    // NIVEAU 9 : Problèmes de niveau avancé avec contexte professionnel (500-1000)
    {
      story: 'Dans une usine de fabrication de puzzles, la machine A produit 456 pièces par heure. La machine B, plus performante, produit 189 pièces de plus par heure que la machine A. Combien de pièces la machine B produit-elle par heure ?',
      question: 'Combien de pièces la machine B produit-elle par heure ?',
      answer: 645,
      visual: '🧩',
      first: 456,
      second: 189,
      item: '🧩',
      color1: 'text-blue-600',
      color2: 'text-purple-600'
    }
  ];

  // Fonction pour générer un message de correction personnalisé
  const getPersonalizedFeedback = (exerciseIndex: number, isCorrect: boolean) => {
    const exercise = exercises[exerciseIndex];
    const icon = exercise.visual;
    const story = exercise.story.toLowerCase();
    
    // Analyser l'énoncé pour extraire le contexte
    let subject = '';
    let objectType = '';
    
    if (story.includes('billes')) {
      subject = story.includes('léo') ? 'Léo' : 'l\'enfant';
      objectType = 'billes';
    } else if (story.includes('vaches') && story.includes('moutons')) {
      subject = '';
      objectType = 'animaux';
    } else if (story.includes('pommes')) {
      subject = story.includes('julie') ? 'Julie' : story.includes('maman') ? 'Maman' : 'la personne';
      objectType = 'pommes';
    } else if (story.includes('autocollants')) {
      subject = story.includes('marie') ? 'Marie' : 'l\'enfant';
      objectType = 'autocollants';
    } else if (story.includes('livres')) {
      subject = '';
      objectType = 'livres';
    } else if (story.includes('voitures') || story.includes('camions')) {
      subject = story.includes('tom') ? 'Tom' : 'l\'enfant';
      objectType = story.includes('camions') ? 'véhicules' : 'voitures';
    } else if (story.includes('crayons')) {
      subject = story.includes('julie') ? 'Julie' : story.includes('emma') ? 'Emma' : 'l\'enfant';
      objectType = 'crayons';
    } else if (story.includes('cookies') || story.includes('gâteaux')) {
      subject = 'Maman';
      objectType = story.includes('cookies') ? 'cookies' : 'gâteaux';
    } else if (story.includes('fleurs') || story.includes('tulipes')) {
      subject = 'Papa';
      objectType = 'fleurs';
    } else if (story.includes('élèves') || story.includes('enfants')) {
      subject = '';
      objectType = 'élèves';
    } else if (story.includes('jouets') || story.includes('peluches') || story.includes('poupées')) {
      subject = story.includes('sophie') ? 'Sophie' : 'l\'enfant';
      objectType = 'jouets';
    } else if (story.includes('cartes')) {
      subject = story.includes('lucas') ? 'Lucas' : 'l\'enfant';
      objectType = 'cartes';
    } else if (story.includes('photos')) {
      subject = story.includes('zoé') ? 'Zoé' : 'l\'enfant';
      objectType = 'photos';
    } else if (story.includes('badges')) {
      subject = story.includes('thomas') ? 'Thomas' : 'l\'enfant';
      objectType = 'badges';
    } else {
      // Fallback générique
      subject = '';
      objectType = 'objets';
    }
    
    if (isCorrect) {
      const minecraftEncouragements = [
        'Succès débloqué !', 
        'Achievement Get !', 
        'Mission accomplie !', 
        'Bloc placé avec succès !',
        'Craft réussi !', 
        'Niveau terminé !', 
        'Objectif atteint !',
        'Quête complétée !',
        'Trésor trouvé !',
        'Construction terminée !'
      ];
      
      const minecraftCompliments = [
        'Tu es un vrai constructeur !',
        'Tes compétences progressent !',
        'Tu maîtrises l\'art du calcul !',
        'Tu es prêt pour le niveau suivant !',
        'Tes outils mathématiques sont affûtés !',
        'Tu explores bien les nombres !',
        'Ta stratégie est excellente !',
        'Tu collectes les bonnes réponses !',
        'Tes bases sont solides !',
        'Tu becomes un expert !'
      ];
      
      const encouragement = minecraftEncouragements[exerciseIndex % minecraftEncouragements.length];
      const compliment = minecraftCompliments[exerciseIndex % minecraftCompliments.length];
      
      let baseMessage = '';
      if (subject && objectType) {
        baseMessage = `${subject} a bien ${exercise.answer} ${objectType} !`;
      } else if (objectType) {
        baseMessage = `Il y a exactement ${exercise.answer} ${objectType} !`;
      } else {
        baseMessage = `Tu as trouvé ${exercise.answer} !`;
      }
      
      return `🎉 ${encouragement} ${icon} ${baseMessage} ${compliment}`;
    } else {
      // Pour les corrections, rester simple et utiliser les nombres de l'exercice
      return `${icon} ${exercise.first} + ${exercise.second} = ${exercise.answer}`;
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
    const element = document.getElementById(elementId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const isAlreadyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      // Ne pas scroller si l'élément est déjà visible
      if (!isAlreadyVisible) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest' 
        });
      }
    }
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
      
      // Scroll vers la zone d'animation pour montrer où les animations apparaîtront
      scrollToElement('animation-section');
      await wait(1000);
      
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
      
      // Scroll vers la zone d'animation pour montrer où se déroulera l'animation de la méthode
      scrollToElement('animation-section');
      await wait(1000);
      
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
      
      // Scroll vers la zone d'animation pour montrer où se dérouleront les exemples animés
      scrollToElement('animation-section');
      await wait(1000);
      
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
      
      // Scroll vers la zone d'animation pour montrer où apparaîtront les animations d'aide
      scrollToElement('animation-section');
      await wait(1000);
      
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
      
      // Scroll vers la zone d'animation pour montrer où les animations détaillées apparaîtront
      scrollToElement('animation-section');
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

    // Attendre un court instant pour que l'interface se mette à jour
    await wait(300);
    
    // Scroll vers la zone d'animation maintenant que l'exemple est affiché
    scrollToElement('animation-section');
    await wait(500);

    try {
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

      // Calcul - D'abord annoncer l'addition
      setAnimatingStep('calculation');
      await playAudio(`Pour trouver le total, je fais l'addition : ${example.first} plus ${example.second} égale ${example.result}.`);
      
      // MAINTENANT scroller vers l'addition posée qui s'affiche
      scrollToElement('animation-section');
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
      
      // Vocal d'encouragement Minecraft
      setTimeout(() => {
        const minecraftVocalEncouragements = [
          'Succès débloqué ! Achievement Get !',
          'Mission accomplie ! Tu es un vrai constructeur !',
          'Craft réussi ! Tes compétences progressent !',
          'Niveau terminé ! Tu es prêt pour le suivant !',
          'Objectif atteint ! Tu maîtrises l\'art du calcul !',
          'Quête complétée ! Tu explores bien les nombres !',
          'Trésor trouvé ! Ta stratégie est excellente !',
          'Construction terminée ! Tes bases sont solides !',
          'Bloc placé avec succès ! Tu collectes les bonnes réponses !',
          'Achievement débloqué ! Tu deviens un expert !'
        ];
        
        const encouragement = minecraftVocalEncouragements[currentExercise % minecraftVocalEncouragements.length];
        
        const utterance = new SpeechSynthesisUtterance(encouragement);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        utterance.pitch = 1.2; // Voix plus enjouée
        utterance.volume = 1.0;
        
        const voices = speechSynthesis.getVoices();
        const frenchVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && voice.localService === true
        );
        
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }
        
        speechSynthesis.speak(utterance);
      }, 200);
      
      // Scroll vers le message de félicitations
      setTimeout(() => {
        const correctionElement = document.getElementById('exercise-correction');
        if (correctionElement) {
          correctionElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 300);
      
      // Passer automatiquement au suivant après 3 secondes (plus long pour laisser le temps au vocal)
      setTimeout(() => {
        nextExercise();
      }, 3000);
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
      
      // Scroll vers la zone d'animation de l'exercice pour voir l'addition posée
      scrollToElement('exercise-correction');
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

  // Fonction officielle pour rendre une addition posée (adaptée du code CE1)
  const renderPostedAddition = (exampleData: any, isAnimated = false, showHelperBox = false, animationStep?: string) => {
    const example = {
      num1: exampleData.first,
      num2: exampleData.second,
      result: exampleData.result || exampleData.answer, // Gérer les deux cas : problèmes (result) et exercices (answer)
      hasCarry: ((exampleData.first % 10) + (exampleData.second % 10)) >= 10 || 
                (Math.floor(exampleData.first / 10) % 10 + Math.floor(exampleData.second / 10) % 10 + (((exampleData.first % 10) + (exampleData.second % 10)) >= 10 ? 1 : 0)) >= 10
    };
    
    // États simulés pour l'animation
    const calculationStep = animationStep === 'group1' ? 'setup' :
                           animationStep === 'group2' ? 'setup' :
                           animationStep === 'calculation' ? 'units' :
                           animationStep === 'result' ? 'result' :
                           animationStep === 'show-calculation' ? 'tens' :
                           animationStep === 'show-result' ? 'result' :
                           animationStep === 'show-groups' ? 'hundreds' : null;

    // Calcul des retenues
    const unitsSum = (example.num1 % 10) + (example.num2 % 10);
    const carryToTens = unitsSum >= 10 ? 1 : 0;
    const tensSum = Math.floor(example.num1 / 10) % 10 + Math.floor(example.num2 / 10) % 10 + carryToTens;
    const carryToHundreds = tensSum >= 10 ? 1 : 0;
    
    const carryValues = {
      toTens: carryToTens,
      toHundreds: carryToHundreds
    };
    
    const showingCarry = calculationStep === 'result' && example.hasCarry;
    
    const partialResults = calculationStep === 'result' ? {
      units: (unitsSum % 10).toString(),
      tens: (tensSum % 10).toString(),
      hundreds: Math.floor(example.num1 / 100) % 10 + Math.floor(example.num2 / 100) % 10 + carryToHundreds > 0 ? 
               (Math.floor(example.num1 / 100) % 10 + Math.floor(example.num2 / 100) % 10 + carryToHundreds).toString() : null
    } : { units: null, tens: null, hundreds: null };

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
      <div className={`bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-lg border-2 transition-all duration-500 border-gray-200`}>
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

            {/* Retenues si nécessaire */}
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
            {isAnimated && calculationStep === 'result' && (
              <div className="mt-6 text-center">
                <div className="bg-purple-100 text-purple-800 p-3 rounded-lg animate-fade-in font-medium">
                  🟣 <strong>Résultat final</strong> : {example.result} ! Tu as réussi !
                </div>
                {showingCarry && (
                  <div className="bg-red-100 text-red-800 p-3 rounded-lg animate-bounce font-medium mt-2">
                    ⚠️ <strong>Retenue</strong> : regarde le calcul à côté !
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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

            {/* Zone d'animation - toujours présente pour éviter les tremblements */}
            <div 
              id="animation-section"
              className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${
                currentExample !== null ? 'opacity-100 p-6' : 'opacity-0 p-0 h-4 overflow-hidden'
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎬 Animation du problème
              </h2>
              
              {currentExample !== null && (() => {
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

                      {/* Animation des objets ou addition posée */}
                      {example.first <= 9 && example.second <= 9 ? (
                        // Affichage avec objets pour les petits nombres
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
                      ) : (
                        // Addition posée avec fonction officielle - seulement aux bonnes étapes
                        (animatingStep === 'calculation' || animatingStep === 'result') && 
                        renderPostedAddition(example, true, false, animatingStep || undefined)
                      )}

                      {/* Calcul écrit */}
                      {(animatingStep === 'calculation' || animatingStep === 'result') && (
                        <div className="text-center p-4 bg-purple-100 rounded-lg">
                          <div className="text-2xl font-bold text-purple-800">
                            {highlightNumbers(`${example.first} + ${example.second} = ${example.result}`)}
                          </div>
                        </div>
                      )}

                      {/* Phrase de réponse finale */}
                      {animatingStep === 'result' && (
                        <div className="text-center p-4 mt-4 bg-green-100 border-2 border-green-300 rounded-lg animate-fade-in">
                          <div className="text-lg font-bold text-green-800">
                            🎉 <strong>Réponse :</strong> {example.story.includes('cookies') ? 'Maman' : 
                                                         example.story.includes('fleurs') ? 'Le jardinier' :
                                                         example.story.includes('livres') ? 'La maîtresse' :
                                                         example.story.includes('billes') ? 'Paul' :
                                                         example.story.includes('invités') ? 'Emma' :
                                                         example.story.includes('chats') ? 'Le fermier' :
                                                         example.story.includes('crayons') ? 'Sophie' : 'Il'} a {example.result} {example.item} en tout !
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>
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

                            {/* Animation des objets ou addition posée avec fonction officielle */}
                            {(exerciseAnimationStep === 'show-groups' || exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') && (
                              exercise.first <= 9 && exercise.second <= 9 ? (
                                // Affichage avec objets pour les petits nombres
                                <div className="flex justify-center items-center space-x-6">
                                  {/* Premier groupe */}
                                  <div className="p-3 rounded-lg bg-red-100 ring-2 ring-red-400">
                                    <div className="text-center mb-2">
                                      <span className="font-bold text-red-800">{exercise.first}</span>
                                    </div>
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
                                  </div>

                                  <div className="text-3xl font-bold text-gray-700">+</div>

                                  {/* Deuxième groupe */}
                                  <div className="p-3 rounded-lg bg-blue-100 ring-2 ring-blue-400">
                                    <div className="text-center mb-2">
                                      <span className="font-bold text-blue-800">{exercise.second}</span>
                                    </div>
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
                                  </div>

                                  {/* Signe = et résultat pour petits nombres */}
                                  {exerciseAnimationStep === 'show-result' && (
                                    <>
                                      <div className="text-3xl font-bold text-gray-700">=</div>
                                      <div className="p-3 rounded-lg bg-green-100 ring-2 ring-green-400">
                                        <div className="text-center mb-2">
                                          <span className="font-bold text-green-800">{exercise.answer}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1 max-w-32">
                                          {Array.from({ length: exercise.answer }, (_, i) => (
                                            <div
                                              key={i}
                                              className={`text-xl text-green-600 animate-bounce`}
                                              style={{ animationDelay: `${i * 100}ms` }}
                                            >
                                              {exercise.item}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                // Addition posée avec fonction officielle - correction exercices (seulement à partir du calcul)
                                (exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') &&
                                renderPostedAddition(exercise, true, false, exerciseAnimationStep || undefined)
                              )
                            )}

                            {/* Phrase de réponse finale systématique pour les corrections */}
                            {exerciseAnimationStep === 'show-result' && (
                              <div className="text-center p-4 mt-4 bg-green-100 border-2 border-green-300 rounded-lg animate-fade-in">
                                <div className="text-lg font-bold text-green-800">
                                  🎉 <strong>Réponse :</strong> {exercise.question.includes('Hugo') ? 'Hugo' : 
                                                               exercise.question.includes('Maman') ? 'Maman' :
                                                               exercise.question.includes('Paul') ? 'Paul' :
                                                               exercise.question.includes('Zoé') ? 'Zoé' :
                                                               exercise.question.includes('Thomas') ? 'Thomas' : 'Il'} a {exercise.answer} {exercise.question.includes('pages') ? 'pages' :
                                                                                                                                                                                      exercise.question.includes('pièces') ? 'pièces d\'or' :
                                                                                                                                                                                      exercise.question.includes('cubes') ? 'cubes' :
                                                                                                                                                                                      exercise.question.includes('photos') ? 'photos' :
                                                                                                                                                                                      exercise.question.includes('points') ? 'points' : 'éléments'} en tout !
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