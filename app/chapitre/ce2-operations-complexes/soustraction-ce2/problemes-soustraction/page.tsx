'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star } from 'lucide-react';

export default function ProblemesSoustractionCE2() {
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

  // Données des problèmes avec animations - NIVEAU CE1 (soustractions, contextes familiers)
  const problemExamples = [
    {
      id: 'bonbons',
      title: 'Les bonbons de Léa',
      story: 'Léa avait 8 bonbons. Elle en a mangé 3. Combien lui reste-t-il de bonbons ?',
      first: 8,
      second: 3,
      result: 5,
      item: '🍬',
      color1: 'text-red-600',
      color2: 'text-gray-400'
    },
    {
      id: 'jouets',
      title: 'Les voitures de Tom',
      story: 'Tom avait 12 petites voitures. Il en a donné 4 à son ami. Combien lui reste-t-il de voitures ?',
      first: 12,
      second: 4,
      result: 8,
      item: '🚗',
      color1: 'text-orange-600',
      color2: 'text-gray-400'
    },
    {
      id: 'animaux',
      title: 'Les chats de la ferme',
      story: 'Dans la ferme de Mamie, il y avait 13 chatons. 2 chatons sont partis jouer. Combien en reste-t-il ?',
      first: 13,
      second: 2,
      result: 11,
      item: '🐱',
      color1: 'text-gray-800',
      color2: 'text-gray-400'
    },
    {
      id: 'ecole',
      title: 'Les crayons de couleur',
      story: 'Dans la trousse de Julie, il y avait 10 crayons. Elle en a cassé 4. Combien de crayons lui reste-t-il ?',
      first: 10,
      second: 4,
      result: 6,
      item: '✏️',
      color1: 'text-red-600',
      color2: 'text-gray-400'
    },
    {
      id: 'cuisine',
      title: 'Les cookies de Maman',
      story: 'Maman avait préparé 47 cookies. La famille en a mangé 35. Combien de cookies reste-t-il ?',
      first: 47,
      second: 35,
      result: 12,
      item: '🍪',
      color1: 'text-amber-700',
      color2: 'text-gray-400'
    },
    {
      id: 'jardin',
      title: 'Les fleurs du jardin',
      story: 'Dans le jardin, il y avait 48 tulipes. Le vent en a cassé 16. Combien de tulipes sont encore debout ?',
      first: 48,
      second: 16,
      result: 32,
      item: '🌷',
      color1: 'text-red-600',
      color2: 'text-gray-400'
    },
    {
      id: 'bibliotheque',
      title: 'Les livres de la classe',
      story: 'Sur l\'étagère de la classe, il y avait 89 livres. La maîtresse en a pris 47 pour la lecture. Combien en reste-t-il ?',
      first: 89,
      second: 47,
      result: 42,
      item: '📚',
      color1: 'text-purple-600',
      color2: 'text-gray-400'
    },
    {
      id: 'recreation',
      title: 'Les billes de Paul',
      story: 'Paul collectionne les billes. Il avait 81 billes rares dans sa collection, mais il en a échangé 48 contre d\'autres modèles. Combien de billes rares lui reste-t-il ?',
      first: 81,
      second: 48,
      result: 33,
      item: '⚪',
      color1: 'text-blue-600',
      color2: 'text-gray-400'
    },
    {
      id: 'anniversaire',
      title: 'Les invités d\'Emma',
      story: 'Pour son anniversaire, Emma avait commandé 92 ballons. Le vent en a fait s\'envoler 48. Combien de ballons reste-t-il pour la fête ?',
      first: 92,
      second: 48,
      result: 44,
      item: '🎉',
      color1: 'text-pink-600',
      color2: 'text-gray-400'
    },
    {
      id: 'chats',
      title: 'Les chats de la ferme',
      story: 'Dans la grande ferme, il y avait 35 chats. L\'hiver, 28 chats sont partis chercher un abri plus chaud. Combien de chats sont restés ?',
      first: 35,
      second: 28,
      result: 7,
      item: '🐱',
      color1: 'text-gray-800',
      color2: 'text-gray-400'
    },
    {
      id: 'crayons',
      title: 'Les crayons de couleur',
      story: 'Dans l\'école, il y avait 46 crayons de couleur neufs. Les élèves en ont usé 37 pendant l\'année. Combien de crayons neufs reste-t-il ?',
      first: 46,
      second: 37,
      result: 9,
      item: '✏️',
      color1: 'text-red-600',
      color2: 'text-gray-400'
    },
    {
      id: 'jouets_magasin',
      title: 'Les jouets du magasin',
      story: 'Dans le magasin, il y avait 87 jouets en stock. Pendant les fêtes, 25 jouets ont été vendus. Combien de jouets restent-ils en stock ?',
      first: 87,
      second: 25,
      result: 62,
      item: '🧸',
      color1: 'text-orange-600',
      color2: 'text-gray-400'
    },
    {
      id: 'graines',
      title: 'Les graines du fermier',
      story: 'Le fermier avait acheté 98 graines pour son potager. En plantant, il a utilisé 7 graines dans ses champs. Combien de graines lui reste-t-il pour plus tard ?',
      first: 98,
      second: 7,
      result: 91,
      item: '🌱',
      color1: 'text-green-600',
      color2: 'text-gray-400'
    }
  ];

  // 15 Exercices progressifs CE1 : soustractions variées avec progression pédagogique
  const exercises = [
    // NIVEAU 1 : Soustractions simples - Problèmes de réunion inversés (transformation - état final)
    {
      story: 'Léa avait 15 autocollants. Elle en a donné 7 à sa sœur. Combien d\'autocollants lui reste-t-il ?',
      answer: 8,
      visual: '🌟',
      first: 15,
      second: 7,
      item: '🌟',
      color1: 'text-blue-600',
      color2: 'text-gray-400'
    },
    {
      story: 'Dans son pot à crayons, Nina avait 17 crayons. Elle en a cassé 8. Combien de crayons lui reste-t-il ?',
      answer: 9,
      visual: '✏️',
      first: 17,
      second: 8,
      item: '✏️',
      color1: 'text-blue-600',
      color2: 'text-red-600'
    },
    
    // NIVEAU 2 : Soustractions avec nombres jusqu'à 50 - Problèmes de transformation
    {
      story: 'Tom collectionne les cartes. Il avait 41 cartes dans sa collection. Il en a échangé 18 contre d\'autres modèles. Combien de cartes lui reste-t-il ?',
      answer: 23,
      visual: '🎴',
      first: 41,
      second: 18,
      item: '🎴',
      color1: 'text-green-600',
      color2: 'text-orange-600'
    },
    {
      story: 'Maman avait acheté 43 fruits pour la semaine. La famille en a déjà mangé 16. Combien de fruits reste-t-il ?',
      answer: 27,
      visual: '🍎',
      first: 43,
      second: 16,
      item: '🍎',
      color1: 'text-red-600',
      color2: 'text-yellow-600'
    },
    {
      story: 'Dans la bibliothèque de CE1, il y avait 63 livres. La maîtresse en a retiré 29 pour les ranger ailleurs. Combien de livres reste-t-il ?',
      answer: 34,
      visual: '📚',
      first: 63,
      second: 29,
      item: '📚',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    
    // NIVEAU 3 : Soustractions avec retenues (50-100) - Problèmes avec données inutiles
    {
      story: 'Julie a 12 ans et collectionne les billes. Elle avait 65 billes dans sa boîte. En jouant, elle en a perdu 27. Combien de billes lui reste-t-il ?',
      answer: 38,
      visual: '⚪',
      first: 65,
      second: 27,
      item: '⚪',
      color1: 'text-purple-600',
      color2: 'text-gray-400'
    },
    {
      story: 'Papa jardine depuis le matin. Il avait planté 83 tulipes dans son jardin. Une tempête en a abîmé 36. Combien de tulipes sont encore belles ?',
      answer: 47,
      visual: '🌷',
      first: 83,
      second: 36,
      item: '🌷',
      color1: 'text-red-600',
      color2: 'text-yellow-600'
    },
    {
      story: 'La bibliothèque municipale possédait 87 livres pour enfants. Elle en a prêté 28 à une école. Combien de livres reste-t-il sur les étagères ?',
      answer: 59,
      visual: '📖',
      first: 87,
      second: 28,
      item: '📖',
      color1: 'text-orange-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 4 : Soustractions avec nombres plus grands (100-200) - Problèmes de comparaison
    {
      story: 'Sophie collectionne les autocollants. Elle en avait 113 dans son album. Elle en a donné 45 à ses amies. Combien d\'autocollants garde-t-elle ?',
      answer: 68,
      visual: '🌟',
      first: 113,
      second: 45,
      item: '🌟',
      color1: 'text-pink-600',
      color2: 'text-green-600'
    },
    {
      story: 'Lucas joue avec ses LEGO. Il avait construit une tour avec 134 pièces. Elle s\'est écroulée et 58 pièces se sont cassées. Combien de pièces peut-il encore utiliser ?',
      answer: 76,
      visual: '🧱',
      first: 134,
      second: 58,
      item: '🧱',
      color1: 'text-red-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 5 : Soustractions complexes (200-500) - Problèmes multi-étapes avec contexte riche
    {
      story: 'Marie travaille sur un puzzle de 500 pièces. Elle avait déjà placé 183 pièces hier. Aujourd\'hui, elle en a enlevé 96 qui étaient mal placées. Combien de pièces bien placées reste-t-il ?',
      answer: 87,
      visual: '🧩',
      first: 183,
      second: 96,
      item: '🧩',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    {
      story: 'Dans la ferme de grand-père, il y avait 225 animaux au total. L\'hiver, 97 animaux sont partis dans d\'autres fermes. Combien d\'animaux restent-ils pour l\'hiver ?',
      answer: 128,
      visual: '🐔',
      first: 225,
      second: 97,
      item: '🐔',
      color1: 'text-yellow-600',
      color2: 'text-orange-600'
    },
    {
      story: 'Antoine range sa collection de cartes. Il avait 334 cartes en tout. Il en a vendu 178 à un ami collectionneur. Combien de cartes garde-t-il dans sa collection ?',
      answer: 156,
      visual: '🎮',
      first: 334,
      second: 178,
      item: '🎮',
      color1: 'text-purple-600',
      color2: 'text-blue-600'
    },
    
    // NIVEAU 6 : Grandes soustractions (500-1000) - Situations complexes
    {
      story: 'Emma travaille sur un projet artistique. Elle avait dessiné 523 pixels colorés. Un bug informatique en a effacé 289. Combien de pixels colorés lui reste-t-il ?',
      answer: 234,
      visual: '🎨',
      first: 523,
      second: 289,
      item: '🎨',
      color1: 'text-pink-600',
      color2: 'text-purple-600'
    },
    {
      story: 'Léo organise sa collection de coquillages. Il en avait 625 dans ses boîtes. Il en a offert 258 au musée de la ville. Combien de coquillages garde-t-il chez lui ?',
      answer: 367,
      visual: '🐚',
      first: 625,
      second: 258,
      item: '🐚',
      color1: 'text-blue-600',
      color2: 'text-cyan-600'
    }
  ];

  // Fonction pour générer un message de correction personnalisé pour les soustractions
  const getPersonalizedFeedback = (exerciseIndex: number, isCorrect: boolean) => {
    const exercise = exercises[exerciseIndex];
    const icon = exercise.visual;
    
    if (isCorrect) {
      const successMessages = [
        `Bravo ! ${icon} Léa a exactement ${exercise.answer} autocollants qui lui restent !`,
        `Parfait ! ${icon} Nina a bien ${exercise.answer} crayons intacts dans son pot !`,
        `Excellent ! ${icon} Tom garde ${exercise.answer} cartes dans sa collection !`,
        `Super ! ${icon} Il reste ${exercise.answer} fruits délicieux à manger !`,
        `Bravo ! ${icon} Il reste exactement ${exercise.answer} livres sur l'étagère !`,
        `Formidable ! ${icon} Julie a encore ${exercise.answer} billes pour jouer !`,
        `Magnifique ! ${icon} Il reste ${exercise.answer} tulipes debout dans le jardin !`,
        `Excellent ! ${icon} Il reste ${exercise.answer} livres disponibles !`,
        `Parfait ! ${icon} Sophie garde ${exercise.answer} autocollants précieux !`,
        `Super ! ${icon} Lucas a encore ${exercise.answer} pièces utilisables !`,
        `Merveilleux ! ${icon} Marie a ${exercise.answer} pièces bien placées !`,
        `Fantastique ! ${icon} Il reste ${exercise.answer} animaux pour l'hiver !`,
        `Génial ! ${icon} Antoine garde ${exercise.answer} cartes dans sa collection !`,
        `Bravo ! ${icon} Emma a sauvegardé ${exercise.answer} pixels !`,
        `Excellent ! ${icon} Léo garde ${exercise.answer} coquillages chez lui !`
      ];
      return successMessages[exerciseIndex] || `Bravo ! ${icon} Il reste ${exercise.answer} !`;
    } else {
      const correctionMessages = [
        `${icon} Léa avait ${exercise.first} autocollants - ${exercise.second} donnés = ${exercise.answer} qui restent !`,
        `${icon} Nina avait ${exercise.first} crayons - ${exercise.second} cassés = ${exercise.answer} intacts !`,
        `${icon} Tom avait ${exercise.first} cartes - ${exercise.second} échangées = ${exercise.answer} gardées !`,
        `${icon} Il y avait ${exercise.first} fruits - ${exercise.second} mangés = ${exercise.answer} qui restent !`,
        `${icon} Il y avait ${exercise.first} livres - ${exercise.second} retirés = ${exercise.answer} sur l'étagère !`,
        `${icon} Julie avait ${exercise.first} billes - ${exercise.second} perdues = ${exercise.answer} qui restent !`,
        `${icon} Il y avait ${exercise.first} tulipes - ${exercise.second} abîmées = ${exercise.answer} encore belles !`,
        `${icon} Il y avait ${exercise.first} livres - ${exercise.second} prêtés = ${exercise.answer} sur les étagères !`,
        `${icon} Sophie avait ${exercise.first} autocollants - ${exercise.second} donnés = ${exercise.answer} gardés !`,
        `${icon} Lucas avait ${exercise.first} pièces - ${exercise.second} cassées = ${exercise.answer} utilisables !`,
        `${icon} Marie avait ${exercise.first} pièces - ${exercise.second} mal placées = ${exercise.answer} bien placées !`,
        `${icon} Il y avait ${exercise.first} animaux - ${exercise.second} partis = ${exercise.answer} qui restent !`,
        `${icon} Antoine avait ${exercise.first} cartes - ${exercise.second} vendues = ${exercise.answer} gardées !`,
        `${icon} Emma avait ${exercise.first} pixels - ${exercise.second} effacés = ${exercise.answer} sauvés !`,
        `${icon} Léo avait ${exercise.first} coquillages - ${exercise.second} offerts = ${exercise.answer} gardés !`
      ];
      return correctionMessages[exerciseIndex] || `${icon} Il y avait ${exercise.first} - ${exercise.second} = ${exercise.answer} !`;
    }
  };

  // Fonction pour mettre en évidence les nombres dans un texte (pour soustractions)
  const highlightNumbers = (text: string, isExplicitHighlight = false) => {
    // Remplace SEULEMENT les nombres par des spans colorés (pas les signes mathématiques)
    return text.split(/(\d+)/).map((part, index) => {
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
      // Tout le reste (y compris les signes - et =) reste en texte normal
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
      playAudio("Salut, aventurier ! Bienvenue dans le monde des problèmes de soustraction !"); // Sans await
      await wait(2000);
      if (stopSignalRef.current) return;
      
      playAudio("Aujourd'hui, tu vas apprendre à enlever et soustraire les nombres comme un vrai explorateur !");
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présentation de la première section avec scroll immédiat
      playAudio("D'abord, nous allons voir ce qu'est un problème de soustraction...");
      await wait(1000); // Laisser le temps au texte de commencer
      
      // Scroll vers l'introduction et surbrillance PENDANT l'audio
      scrollToSection(introSectionRef);
      setHighlightedElement('intro');
      await wait(2000); // Attendre que la section soit visible
      
      playAudio("Regarde bien cette section ! Tu peux cliquer sur l'icône pour voir une animation !");
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présentation de la méthode avec scroll immédiat
      playAudio("Ensuite, nous verrons la méthode en 3 étapes...");
      await wait(1000);
      
      // Scroll vers la méthode et surbrillance PENDANT l'audio
      scrollToSection(methodSectionRef);
      setHighlightedElement('method');
      await wait(2000);
      
      playAudio("Voici ma méthode de construction ! N'oublie pas de tester l'animation !");
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Présentation des exemples avec scroll immédiat
      playAudio("Et enfin, nous pratiquerons avec plein d'exemples...");
      await wait(1000);
      
      // Scroll vers les exemples et surbrillance PENDANT l'audio
      scrollToSection(examplesSectionRef);
      setHighlightedElement('examples');
      await wait(2000);
      
      playAudio("Ici tu trouveras 9 exemples avec des animations pour bien comprendre !");
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Mention de la section exercices avec scroll immédiat
      playAudio("Quand tu seras prêt, tu pourras aussi aller à la section exercices...");
      await wait(1000);
      
      // Scroll vers l'onglet exercices et surbrillance PENDANT l'audio
      setHighlightedElement(null);
      setHighlightExerciseButton(true);
      if (exerciseTabRef.current) {
        exerciseTabRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      await wait(2000);
      
      playAudio("Là-bas, 15 problèmes t'attendent pour tester tes nouvelles compétences !");
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Encouragement final
      playAudio("Bon courage, jeune aventurier ! Ta quête commence maintenant !");
      await wait(3000);
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
          text = "Deuxième étape : Je trouve les nombres pour la soustraction. Je cherche le nombre de départ et combien on enlève.";
          break;
        case 'step3':
          text = "Troisième étape : J'écris la soustraction et je calcule. Je pose l'opération et je trouve le résultat pour répondre à la question.";
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
      await playAudio("Ma méthode en 3 étapes pour résoudre un problème de soustraction.");
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
      await playAudio("Deuxième étape : je trouve les nombres pour la soustraction. Je cherche le nombre de départ et combien on enlève.");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Étape 3 avec mise en évidence
      setAnimatingStep('step3');
      await playAudio("Troisième étape : j'écris la soustraction et je calcule le résultat. Je pose l'opération et je trouve le résultat pour répondre à la question.");
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
      playAudio("Salut, aventurier ! C'est l'heure de t'entraîner avec les exercices !"); // Sans await
      await wait(3000);
      if (stopSignalRef.current) return;
      
      playAudio("Tu vas résoudre 15 problèmes de soustraction différents, c'est parti pour l'aventure !");
      await wait(3000);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton "Lire l'énoncé" PENDANT l'audio
      playAudio("Pour chaque exercice, tu peux lire l'énoncé en cliquant sur le bouton 'Lire l'énoncé' !");
      await wait(1000); // Délai avant surbrillance
      setHighlightedElement('read-story-button');
      await wait(2500); // Temps pour voir la surbrillance
      if (stopSignalRef.current) return;
      
      // Mettre en évidence la zone de réponse PENDANT l'audio
      playAudio("Ensuite, tu saisis ta réponse dans la zone de réponse !");
      await wait(1000);
      setHighlightedElement('answer-input');
      await wait(2000);
      if (stopSignalRef.current) return;
      
      // Mettre en évidence le bouton Vérifier PENDANT l'audio
      playAudio("Et pour finir, tu appuies sur le bouton 'Vérifier' pour vérifier ta réponse !");
      await wait(1000);
      setHighlightedElement('validate-button');
      await wait(3000);
      if (stopSignalRef.current) return;
      
      playAudio("Si tu te trompes, je t'aiderai avec une animation pour comprendre ! En avant, jeune aventurier !");
      setHighlightedElement(null);
      await wait(4000);
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à résoudre des problèmes de soustraction. C'est très important de savoir transformer une histoire en calcul !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Méthode
      setHighlightedElement('method');
      scrollToElement('method-section');
      await playAudio("Pour résoudre un problème de soustraction, il faut suivre 3 étapes importantes :");
      await wait(300);

      // Étape 1
      setAnimatingStep('step1');
      await playAudio("Première étape : je lis le problème et je comprends l'histoire.");
      await wait(500);

      if (stopSignalRef.current) return;

      // Étape 2
      setAnimatingStep('step2');
      await playAudio("Deuxième étape : je trouve les nombres pour la soustraction dans l'histoire.");
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
      await playAudio("Troisième étape : j'écris la soustraction et je calcule le résultat !");
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
      await playAudio(`Pour trouver ce qui reste, je fais la soustraction : ${example.first} moins ${example.second} égale ${example.result}.`);
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
          context = `Il y avait ${first} autocollants, ${second} ont été donnés`;
        } else if (story.includes('crayon')) {
          context = `Il y avait ${first} crayons, ${second} se sont cassés`;
        } else if (story.includes('carte')) {
          context = `Il y avait ${first} cartes, ${second} ont été échangées`;
        } else if (story.includes('fruit')) {
          context = `Il y avait ${first} fruits, ${second} ont été mangés`;
        } else if (story.includes('livre')) {
          context = `Il y avait ${first} livres, ${second} ont été retirés`;
        } else if (story.includes('bille')) {
          context = `Il y avait ${first} billes, ${second} ont été perdues`;
        } else if (story.includes('tulipe') || story.includes('fleur')) {
          context = `Il y avait ${first} tulipes, ${second} ont été abîmées`;
        } else if (story.includes('pièce') || story.includes('puzzle')) {
          context = `Il y avait ${first} pièces, ${second} étaient mal placées`;
        } else if (story.includes('animal')) {
          context = `Il y avait ${first} animaux, ${second} sont partis`;
        } else if (story.includes('pixel')) {
          context = `Il y avait ${first} pixels, ${second} ont été effacés`;
        } else if (story.includes('coquillage')) {
          context = `Il y avait ${first} coquillages, ${second} ont été offerts`;
        } else if (story.includes('bonbon')) {
          context = `Il y avait ${first} bonbons, ${second} ont été mangés`;
        } else if (story.includes('chat') || story.includes('chaton')) {
          context = `Il y avait ${first} chats, ${second} sont partis`;
        } else if (story.includes('cookie')) {
          context = `Il y avait ${first} cookies, ${second} ont été mangés`;
        } else {
          // Fallback générique pour soustraction
          context = `Il y avait ${first}, on en enlève ${second}`;
        }
        
        return context;
      };
      
      // Correction avec mise en évidence et vitesse lente
      setExerciseAnimationStep('highlight-numbers');
      await quickAudio(getPersonalizedExplanation());
      await wait(700);
      
      setExerciseAnimationStep('show-calculation');
      await quickAudio(`${first} moins ${second} égale ${result}`);
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

  // Fonction officielle pour rendre une soustraction posée (adaptée du code CE1)
  const renderPostedSubtraction = (exampleData: any, isAnimated = false, showHelperBox = false, animationStep?: string) => {
    const example = {
      num1: exampleData.first,
      num2: exampleData.second,
      result: exampleData.result,
      hasBorrow: ((exampleData.first % 10) < (exampleData.second % 10)) || 
                 (Math.floor((exampleData.first % 100) / 10) - ((exampleData.first % 10) < (exampleData.second % 10) ? 1 : 0)) < Math.floor((exampleData.second % 100) / 10)
    };
    
    // États simulés pour l'animation
    const calculationStep = animationStep === 'group1' ? 'setup' :
                           animationStep === 'group2' ? 'setup' :
                           animationStep === 'calculation' ? 'units' :
                           animationStep === 'result' ? 'result' :
                           animationStep === 'show-calculation' ? 'tens' :
                           animationStep === 'show-result' ? 'result' :
                           animationStep === 'show-groups' ? 'hundreds' : null;

    // Calcul des emprunts
    const needsBorrowFromTens = (example.num1 % 10) < (example.num2 % 10);
    const adjustedTens = Math.floor((example.num1 % 100) / 10) - (needsBorrowFromTens ? 1 : 0);
    const needsBorrowFromHundreds = adjustedTens < Math.floor((example.num2 % 100) / 10);
    
    const borrowValues = {
      fromTens: needsBorrowFromTens ? 1 : 0,
      fromHundreds: needsBorrowFromHundreds ? 1 : 0
    };
    
    const showingBorrow = calculationStep === 'result' && example.hasBorrow;
    
    const partialResults = calculationStep === 'result'
      ? { 
          units: ((example.num1 % 10) + (needsBorrowFromTens ? 10 : 0) - (example.num2 % 10)).toString(),
          tens: (adjustedTens + (needsBorrowFromHundreds ? 10 : 0) - Math.floor((example.num2 % 100) / 10)).toString(),
          hundreds: example.num1 >= 100 ? (Math.floor(example.num1 / 100) - (needsBorrowFromHundreds ? 1 : 0) - Math.floor(example.num2 / 100)).toString() : null
        }
      : { units: null, tens: null, hundreds: null };

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
      <div className={`bg-gradient-to-br from-white to-red-50 p-8 rounded-xl shadow-lg border-2 transition-all duration-500 border-gray-200`}>
        <div className="flex justify-center">
          <div className="space-y-4">
            {/* Tableau des colonnes C, D et U (ou seulement D et U) */}
            <div className="flex justify-center mb-4">
              <div className={`grid gap-4 sm:gap-6 font-bold text-sm sm:text-base ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-2 rounded-lg transition-all duration-500 bg-gray-100 text-gray-600`}>
                    C
                  </div>
                )}
                <div className={`text-center p-2 rounded-lg transition-all duration-500 bg-gray-100 text-gray-600`}>
                  D
                </div>
                <div className={`text-center p-2 rounded-lg transition-all duration-500 bg-gray-100 text-gray-600`}>
                  U
                </div>
              </div>
            </div>

            {/* Emprunts visuels si nécessaire */}
            {example.hasBorrow && showingBorrow && (
              <div className="flex justify-center">
                <div className={`grid gap-8 ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && (
                    <div className="text-center text-blue-500 text-lg relative">
                      {borrowValues.fromHundreds > 0 && (
                        <div className="relative">
                          <span className="text-gray-400 line-through text-sm">{Math.floor(example.num1 / 100)}</span>
                          <br/>
                          <span className="text-blue-600 font-bold animate-bounce">{Math.floor(example.num1 / 100) - 1}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-center text-blue-500 text-lg relative">
                    {borrowValues.fromTens > 0 && (
                      <div className="relative">
                        <span className="text-gray-400 line-through text-sm">{Math.floor((example.num1 % 100) / 10)}</span>
                        <br/>
                        <span className="text-blue-600 font-bold animate-bounce">{Math.floor((example.num1 % 100) / 10) - 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-green-500 text-lg relative">
                    {borrowValues.fromTens > 0 && (
                      <div className="relative">
                        <span className="text-gray-400 line-through text-sm">{example.num1 % 10}</span>
                        <br/>
                        <span className="text-green-600 font-bold animate-bounce">{(example.num1 % 10) + 10}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Premier nombre */}
            <div className="flex justify-center">
              <div className={`grid gap-2 sm:gap-6 font-mono text-base sm:text-2xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 text-gray-700 ${num1Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                    {num1Hundreds || ''}
                  </div>
                )}
                <div className={`text-center p-3 rounded-lg transition-all duration-500 text-gray-700 ${num1Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                  {num1Tens || ''}
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-500 text-gray-700 border-2 border-dashed border-blue-300`}>
                  {num1Units}
                </div>
              </div>
            </div>
            
            {/* Deuxième nombre avec signe - */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`grid gap-2 sm:gap-6 font-mono text-base sm:text-2xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && (
                    <div className={`text-center p-3 rounded-lg transition-all duration-500 text-gray-700 ${num2Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                      {num2Hundreds || ''}
                    </div>
                  )}
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 text-gray-700 ${num2Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                    {num2Tens || ''}
                  </div>
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 text-gray-700 border-2 border-dashed border-blue-300`}>
                    {num2Units}
                  </div>
                </div>
                {/* Signe - positionné à gauche sans affecter l'alignement */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 text-3xl font-mono text-red-600 font-bold">
                  -
                </div>
              </div>
            </div>
            
            {/* Ligne de séparation animée */}
            <div className="flex justify-center">
              <div className={`border-t-4 my-3 transition-all duration-700 border-purple-400`} style={{ width: maxDigits >= 3 ? '11rem' : '7.5rem' }}></div>
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

            {/* Phrase de réponse finale */}
            {calculationStep === 'result' && (
              <div className="mt-6 text-center">
                <div className="bg-green-100 text-green-800 p-4 rounded-lg animate-fade-in font-medium">
                  🎉 <strong>Réponse finale</strong> : Il reste exactement {example.result} ! Parfait ! 🎉
                </div>
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
            href="/chapitre/ce1-quatre-operations/soustraction-ce1" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux soustractions CE1</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
              ➖ Problèmes de soustraction
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Apprendre à résoudre des problèmes de soustraction - Niveau CE1
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
                <h2 className="text-sm sm:text-2xl font-bold text-gray-800">Qu'est-ce qu'un problème de soustraction ?</h2>
                {/* Icône d'animation pour l'introduction */}
                <div className={`bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-orange-300 ${
                  highlightedElement === 'intro' ? 'ring-4 ring-yellow-400 animate-bounce scale-110' : ''
                }`} 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🧮
                </div>
              </div>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                Un problème de soustraction raconte une histoire où on enlève, on retire ou on perd des choses. 
                Notre mission est de trouver combien il en reste après avoir enlevé !
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
                <h2 className="text-sm sm:text-2xl font-bold text-gray-800">Ma méthode en 3 étapes</h2>
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
                  <p className="text-sm sm:text-lg text-gray-800">Je lis le problème et je comprends l'histoire</p>
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
                  <p className="text-sm sm:text-lg text-gray-800">Je trouve les nombres pour la soustraction</p>
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
                  <p className="text-sm sm:text-lg text-gray-800">J'écris la soustraction et je calcule</p>
                </div>
              </div>
            </div>

            {/* Démonstration du soulignage */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
              <div className="flex items-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg">
                  <span className="text-lg sm:text-2xl">✏️</span>
                </div>
                <h2 className="text-sm sm:text-2xl font-bold text-gray-800">Démonstration : souligner les nombres</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Exemple d'histoire :</p>
                  <div className="text-sm sm:text-lg text-gray-700 p-3 bg-white rounded border">
                    {highlightNumbers("Marie avait 12 bonbons. Elle en a mangé 5. Combien lui reste-t-il de bonbons ?", highlightNumbersInStory)}
                  </div>
                </div>
                
                {highlightNumbersInStory && (
                  <div className="text-center p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-sm sm:text-lg text-yellow-800 font-semibold">
                      🎯 Voyez comme les nombres <span className="bg-yellow-300 px-2 py-1 rounded font-black">12</span> et <span className="bg-yellow-300 px-2 py-1 rounded font-black">5</span> ressortent bien !
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
                <h2 className="text-sm sm:text-2xl font-bold text-gray-800">
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
                      <h3 className="font-bold text-sm sm:text-lg text-gray-800 mb-2">{example.title}</h3>
                      <div className="text-xs sm:text-sm text-gray-600 mb-4">
                        {example.story}
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-xs sm:text-sm transition-all ${
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
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-6 text-center">
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

                      {/* Animation des objets ou soustraction posée selon la taille */}
                      <div className="flex justify-center items-center">
                        {example.first > 20 || example.second > 20 ? (
                          /* Grands nombres : utiliser la soustraction posée - seulement aux bonnes étapes */
                          <div className="w-full max-w-2xl">
                            {(animatingStep === 'calculation' || animatingStep === 'result') && 
                             renderPostedSubtraction(example, true, false, animatingStep || undefined)}
                          </div>
                        ) : (
                          /* Petits nombres : affichage avec objets */
                          <div className="space-x-8 flex items-center">
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

                            {/* Signe - */}
                            {(animatingStep === 'group2' || animatingStep === 'calculation' || animatingStep === 'result') && (
                              <div className="text-4xl font-bold text-red-700">-</div>
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
                        )}
                      </div>

                      {/* Calcul écrit */}
                      {(animatingStep === 'calculation' || animatingStep === 'result') && (
                        <div className="text-center p-4 bg-purple-100 rounded-lg">
                          <div className="text-2xl font-bold text-purple-800">
                            {highlightNumbers(`${example.first} - ${example.second} = ${example.result}`)}
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

                            {/* Animation avec soustraction posée pour les grands nombres */}
                            {(exerciseAnimationStep === 'show-groups' || exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') && (
                              <div className="space-y-6">
                                {exercise.first > 20 || exercise.second > 20 ? (
                                  /* Grands nombres : utiliser la soustraction posée - seulement au bon moment */
                                  <div className="flex justify-center">
                                    {(exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') &&
                                     renderPostedSubtraction(exercise, true, false, exerciseAnimationStep || undefined)}
                                  </div>
                                ) : (
                                  /* Petits nombres : affichage avec objets */
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

                                    <div className="text-3xl font-bold text-red-700">-</div>

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
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Calcul écrit */}
                            {(exerciseAnimationStep === 'show-calculation' || exerciseAnimationStep === 'show-result') && (
                              <div className="text-center p-4 bg-purple-100 rounded-lg">
                                <div className="text-2xl font-bold text-purple-800">
                                  {exerciseAnimationStep === 'show-result' ? 
                                    `${exercise.first} - ${exercise.second} = ${exercise.answer}` :
                                    `${exercise.first} - ${exercise.second} = ?`
                                  }
                                </div>
                              </div>
                            )}

                            {/* Résultat final */}
                            {exerciseAnimationStep === 'show-result' && (
                              <div className="text-center p-4 bg-green-100 rounded-lg ring-2 ring-green-400 animate-pulse">
                                <div className="text-3xl font-bold text-green-800 mb-2">
                                  {exercise.first} - {exercise.second} = {exercise.answer}
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