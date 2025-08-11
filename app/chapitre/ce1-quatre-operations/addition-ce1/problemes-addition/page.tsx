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
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des problèmes avec animations - NIVEAU CE1
  const problemExamples = [
    {
      id: 'bonbons',
      title: 'Les bonbons de Marie',
      story: 'Marie a 13 bonbons rouges et 12 bonbons bleus. Combien a-t-elle de bonbons en tout ?',
      first: 13,
      second: 12,
      result: 25,
      item: '🍬',
      color1: 'text-red-600',
      color2: 'text-blue-600'
    },
    {
      id: 'jouets',
      title: 'Les voitures de Tom',
      story: 'Tom a 17 petites voitures et 14 camions. Combien a-t-il de véhicules au total ?',
      first: 17,
      second: 14,
      result: 31,
      item: '🚗',
      color1: 'text-orange-600',
      color2: 'text-green-600'
    },
    {
      id: 'animaux',
      title: 'Les poissons de l\'aquarium',
      story: 'Dans l\'aquarium, il y a 16 poissons rouges et 15 poissons jaunes. Combien y a-t-il de poissons ?',
      first: 16,
      second: 15,
      result: 31,
      item: '🐠',
      color1: 'text-red-600',
      color2: 'text-amber-600'
    },
    {
      id: 'ecole',
      title: 'La cour de récréation',
      story: 'Pendant la récréation, Julie compte les enfants qui jouent. Elle voit 18 enfants qui jouent au ballon près du grand chêne et 16 autres enfants qui font de la corde à sauter près des bancs. Combien d\'enfants s\'amusent dans la cour ?',
      first: 18,
      second: 16,
      result: 34,
      item: '👦',
      color1: 'text-blue-600',
      color2: 'text-green-600'
    },
    {
      id: 'marche',
      title: 'Au marché avec Maman',
      story: 'Au marché du village, Maman achète des légumes frais pour la semaine. Le gentil marchand lui donne 23 tomates bien mûres qu\'elle met dans son panier d\'osier, puis il ajoute 19 concombres verts et croquants. Maman veut savoir combien de légumes elle rapporte à la maison.',
      first: 23,
      second: 19,
      result: 42,
      item: '🍅',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      id: 'parc',
      title: 'Les canards du parc',
      story: 'Au parc près de l\'étang, Pablo adore nourrir les canards avec du pain. Ce matin ensoleillé, il compte 26 canards qui nagent tranquillement près du petit pont en bois. Soudain, 17 autres canards arrivent en se dandinant depuis les roseaux. Pablo se demande combien de canards vont partager son délicieux pain.',
      first: 26,
      second: 17,
      result: 43,
      item: '🦆',
      color1: 'text-yellow-600',
      color2: 'text-blue-600'
    },
    {
      id: 'bibliotheque',
      title: 'La grande bibliothèque de l\'école',
      story: 'Pour organiser la bibliothèque de l\'école, Madame Dupont compte les livres. Sur l\'étagère des contes, elle trouve 35 livres d\'aventures poussiéreux qu\'elle nettoie soigneusement. Puis, dans un carton tout neuf livré ce matin, elle découvre 28 magnifiques livres de contes de fées avec des couvertures dorées. Elle veut savoir combien de livres de contes elle aura en tout pour ses élèves.',
      first: 35,
      second: 28,
      result: 63,
      item: '📚',
      color1: 'text-purple-600',
      color2: 'text-amber-600'
    },
    {
      id: 'patisserie',
      title: 'La boulangerie de Monsieur Paul',
      story: 'Ce matin, dans sa petite boulangerie qui sent bon le pain chaud, Monsieur Paul prépare des croissants pour le petit-déjeuner de ses clients fidèles. Il sort du four 34 croissants dorés et croustillants qu\'il place délicatement sur un plateau. Ensuite, il prépare une nouvelle fournée et cuit 28 croissants supplémentaires qu\'il dispose sur un second plateau. Madame Martin, sa meilleure cliente, lui demande combien de croissants il a préparés ce matin.',
      first: 34,
      second: 28,
      result: 62,
      item: '🥐',
      color1: 'text-amber-700',
      color2: 'text-yellow-600'
    },
    {
      id: 'jardin',
      title: 'Le jardin secret de Grand-Papa',
      story: 'Dans son magnifique jardin fleuri qu\'il cultive avec amour depuis des années, Grand-Papa plante des tulipes colorées pour faire une surprise à sa petite-fille Léa. Il creuse soigneusement la terre humide et plante 47 bulbes de tulipes rouges près de la tonnelle en bois. Puis, inspiré par tant de beauté, il se dirige vers le parterre près de la fontaine et plante 35 bulbes de tulipes jaunes qui brilleront comme des soleils au printemps prochain. Léa, curieuse, veut savoir combien de tulipes fleuriront dans le jardin.',
      first: 47,
      second: 35,
      result: 82,
      item: '🌷',
      color1: 'text-red-700',
      color2: 'text-yellow-700'
    },
    {
      id: 'pizzeria',
      title: 'La pizzeria de Tony',
      story: 'Tony le pizzaïolo prépare ses délicieuses pizzas pour le dîner. Il sort du four 22 pizzas margherita fumantes qu\'il dispose sur le comptoir chaud. Puis il ajoute 18 pizzas aux champignons qui sentent bon l\'ail et les herbes. Sa femme Maria veut savoir combien de pizzas Tony a préparées pour ses clients affamés.',
      first: 22,
      second: 18,
      result: 40,
      item: '🍕',
      color1: 'text-red-600',
      color2: 'text-green-600'
    },
    {
      id: 'plage',
      title: 'Les coquillages de la plage',
      story: 'Pendant ses vacances au bord de la mer, Emma collectionne les plus beaux coquillages sur le sable doré. Le matin, elle trouve 29 coquillages nacrés qui brillent au soleil près des rochers. L\'après-midi, elle découvre 24 coquillages colorés cachés dans les algues. Ses parents lui demandent combien de trésors marins elle a récoltés aujourd\'hui.',
      first: 29,
      second: 24,
      result: 53,
      item: '🐚',
      color1: 'text-blue-600',
      color2: 'text-purple-600'
    },
    {
      id: 'ferme',
      title: 'La ferme de Madame Dubois',
      story: 'Dans sa grande ferme à la campagne, Madame Dubois élève des poules heureuses qui picorent librement dans la cour. Ce matin, elle compte 31 œufs frais dans le poulailler principal où vivent ses poules rousses. Puis elle se dirige vers le petit poulailler et y trouve 26 œufs tout chauds pondus par ses poules blanches. Elle veut savoir combien d\'œufs elle va pouvoir vendre au marché.',
      first: 31,
      second: 26,
      result: 57,
      item: '🥚',
      color1: 'text-amber-600',
      color2: 'text-gray-600'
    },
    {
      id: 'cirque',
      title: 'Le grand cirque Paillettes',
      story: 'Sous le grand chapiteau rayé du cirque Paillettes, la représentation va bientôt commencer ! Le chef machiniste compte les spectacles pour préparer le programme. Il y aura 25 numéros d\'acrobates qui voleront dans les airs avec grâce et 19 numéros de clowns rigolos qui feront rire les enfants. Le directeur du cirque veut annoncer combien de numéros magiques les spectateurs vont admirer.',
      first: 25,
      second: 19,
      result: 44,
      item: '🎪',
      color1: 'text-red-600',
      color2: 'text-yellow-600'
    },
    {
      id: 'magasin',
      title: 'Le magasin de jouets de Sophie',
      story: 'Dans son merveilleux magasin de jouets aux vitrines colorées, Sophie prépare une grande exposition pour les fêtes de fin d\'année. Elle installe 38 poupées aux robes scintillantes sur les étagères du haut, puis place 27 petites voitures de course sur les présentoirs du bas. Un papa curieux lui demande combien de jouets brillants sont exposés dans sa magnifique boutique.',
      first: 38,
      second: 27,
      result: 65,
      item: '🧸',
      color1: 'text-pink-600',
      color2: 'text-blue-600'
    }
  ];

  // Exercices pour les élèves - NIVEAU CE1
  const exercises = [
    {
      story: 'Lucas a 24 billes rouges et 18 billes vertes. Combien a-t-il de billes en tout ?',
      answer: 42,
      visual: '🔵'
    },
    {
      story: 'Dans le panier, il y a 27 pommes et 16 oranges. Combien y a-t-il de fruits ?',
      answer: 43,
      visual: '🍎'
    },
    {
      story: 'Sophie collectionne les autocollants. Elle en a 38 brillants et 25 colorés. Combien en a-t-elle ?',
      answer: 63,
      visual: '✨'
    },
    {
      story: 'Au zoo, il y a 29 singes et 14 éléphants. Combien d\'animaux voit-on ?',
      answer: 43,
      visual: '🐵'
    },
    {
      story: 'Dans la boîte de crayons, il y a 32 crayons de couleur et 19 feutres. Combien d\'outils pour dessiner ?',
      answer: 51,
      visual: '🖍️'
    },
    {
      story: 'Dans le petit jardin de Mamie, les fleurs poussent magnifiquement. Elle compte 26 tournesols géants qui brillent au soleil et 18 jolies marguerites blanches qui dansent dans le vent. Combien de fleurs colorent son jardin ?',
      answer: 44,
      visual: '🌻'
    },
    {
      story: 'Pour son goûter d\'anniversaire, Théo prépare des petits gâteaux. Il place 29 cupcakes à la vanille sur le plateau doré et 17 muffins aux pépites de chocolat sur l\'assiette en porcelaine. Combien de délicieuses pâtisseries a-t-il préparées ?',
      answer: 46,
      visual: '🧁'
    },
    {
      story: 'En classe de sport, Madame Rousseau organise les équipes. Elle compte 28 filles qui portent des maillots rouges et 19 garçons en maillots bleus. Combien d\'élèves participent au match de handball ?',
      answer: 47,
      visual: '⚽'
    },
    {
      story: 'Pour le spectacle de l\'école, Madame Leblanc prépare les costumes. Elle a cousu 34 robes de princesses scintillantes et 27 costumes de chevaliers avec des armures dorées. Combien de costumes brillants a-t-elle préparés pour ses petits acteurs ?',
      answer: 61,
      visual: '👗'
    },
    {
      story: 'Dans le grand verger de Maître Jacques, les arbres regorgent de fruits mûrs. Ce matin, il cueille 36 poires juteuses dans les premiers arbres ensoleillés, puis 28 poires supplémentaires dans les arbres plus ombragés. Sa femme lui demande combien de poires délicieuses il a récoltées pour faire de la compote.',
      answer: 64,
      visual: '🍐'
    },
    {
      story: 'Léo le petit collectionneur est très fier de ses cartes précieuses. Dans son album rouge, il range soigneusement 39 cartes de dragons étincelants qu\'il a échangées avec ses amis. Dans son album bleu, il classe 25 cartes de héros légendaires qu\'il a reçues pour son anniversaire. Il veut épater son grand frère en lui disant combien de cartes extraordinaires il possède maintenant.',
      answer: 64,
      visual: '🎯'
    },
    {
      story: 'Au petit étang du parc, Alice adore observer les canards. Elle voit d\'abord 31 canards blancs qui nagent paisiblement près des nénuphars roses. Puis, 26 canards bruns arrivent en cancanant joyeusement depuis l\'autre rive. Alice veut savoir combien de canards barbotent maintenant dans l\'étang.',
      answer: 57,
      visual: '🦆'
    }
  ];

  // Fonction pour générer un message de correction personnalisé
  const getPersonalizedFeedback = (exerciseIndex: number, isCorrect: boolean) => {
    const exercise = exercises[exerciseIndex];
    const icon = exercise.visual;
    
    if (isCorrect) {
             const successMessages = [
        `Bravo ! ${icon} Lucas a effectivement ${exercise.answer} billes colorées (rouges et vertes) !`,
        `Parfait ! ${icon} Il y a bien ${exercise.answer} fruits délicieux dans le panier !`,
        `Excellent ! ${icon} Sophie a exactement ${exercise.answer} autocollants dans sa collection !`,
        `Super ! ${icon} On compte bien ${exercise.answer} animaux fascinants au zoo !`,
        `Bravo ! ${icon} Il y a précisément ${exercise.answer} outils artistiques dans la boîte !`,
        `Magnifique ! ${icon} Le petit jardin de Mamie rayonne avec ${exercise.answer} fleurs !`,
        `Délicieux ! ${icon} Théo a mitonné ${exercise.answer} pâtisseries pour son anniversaire !`,
        `Formidable ! ${icon} ${exercise.answer} élèves vont s'affronter au handball !`,
        `Merveilleux ! ${icon} Madame Leblanc a confectionné ${exercise.answer} costumes scintillants !`,
        `Excellent ! ${icon} Maître Jacques a récolté ${exercise.answer} poires succulentes !`,
                 `Fantastique ! ${icon} Léo possède maintenant ${exercise.answer} cartes extraordinaires !`,
        `Merveilleux ! ${icon} Alice observe ${exercise.answer} canards qui barbotent dans l'étang !`
      ];
      return successMessages[exerciseIndex] || `Bravo ! ${icon} Tu as trouvé ${exercise.answer} !`;
    } else {
             const correctionMessages = [
        `${icon} Lucas avait 24 billes rouges + 18 billes vertes = ${exercise.answer} billes colorées !`,
        `${icon} Dans le panier délicieux : 27 pommes + 16 oranges = ${exercise.answer} fruits juteux !`,
        `${icon} Sophie collectionne : 38 autocollants brillants + 25 colorés = ${exercise.answer} autocollants !`,
        `${icon} Au zoo fascinant : 29 singes espiègles + 14 éléphants majestueux = ${exercise.answer} animaux !`,
        `${icon} Dans la boîte artistique : 32 crayons colorés + 19 feutres = ${exercise.answer} outils créatifs !`,
        `${icon} Dans le jardin de Mamie : 26 tournesols géants + 18 marguerites blanches = ${exercise.answer} fleurs magnifiques !`,
        `${icon} Pour l'anniversaire de Théo : 29 cupcakes vanille + 17 muffins chocolat = ${exercise.answer} pâtisseries délicieuses !`,
        `${icon} Match de handball : 28 filles en rouge + 19 garçons en bleu = ${exercise.answer} élèves sportifs !`,
        `${icon} Spectacle scintillant : 34 robes de princesses + 27 costumes de chevaliers = ${exercise.answer} costumes brillants !`,
        `${icon} Verger de Maître Jacques : 36 poires des arbres ensoleillés + 28 des ombragés = ${exercise.answer} poires juteuses !`,
        `${icon} Collection de Léo : 39 cartes de dragons + 25 cartes de héros = ${exercise.answer} cartes précieuses !`,
        `${icon} À l'étang d'Alice : 31 canards blancs + 26 canards bruns = ${exercise.answer} canards barboteurs !`
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
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedExamples([]);
    setHighlightNumbersInStory(false);
    setSamSizeExpanded(false);
  };

  // Fonction pour lire le texte de l'introduction
  const readIntroduction = async () => {
    if (isPlayingVocal) {
      stopAllVocalsAndAnimations();
      return;
    }

    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      const introText = "Un problème d'addition raconte une histoire avec des nombres. Notre mission est de trouver ces nombres et de les additionner pour répondre à la question !";
      await playAudio(introText);
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'introduction:', error);
    } finally {
      setIsPlayingVocal(false);
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

  // Fonction pour faire défiler vers une section
  const scrollToSection = (elementId: string) => {
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
    setSamSizeExpanded(true);
    
    try {
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à résoudre des problèmes d'addition !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Un problème d'addition, c'est une histoire avec des nombres cachés !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      if (stopSignalRef.current) return;
      
      await playAudio("Ta mission : trouver les nombres dans l'histoire et les additionner !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      if (stopSignalRef.current) return;
      
      await playAudio("Souviens-toi des 3 étapes : lire, chercher les nombres, puis calculer !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapterWithSam:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
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
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à résoudre des problèmes d'addition. C'est très important de savoir transformer une histoire en calcul !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Méthode
      setHighlightedElement('method');
      scrollToSection('method-section');
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
      scrollToSection('examples-section');
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
      scrollToSection('animation-section');
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
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
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
      
      {/* Bouton flottant de Sam - visible uniquement quand Sam parle */}
      {isPlayingVocal && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg animate-pulse"
            title="Arrêter Sam"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/ce1-quatre-operations/addition-ce1" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'addition CE1</span>
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
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-orange-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-orange-600 hover:bg-orange-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-orange-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

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
                {/* Bouton vocal pour l'introduction */}
                <div 
                  onClick={readIntroduction}
                  className={`bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-orange-300 ${
                    isPlayingVocal ? 'animate-pulse bg-gradient-to-r from-green-500 to-green-600' : ''
                  }`}
                  style={{animation: isPlayingVocal ? 'pulse 1s infinite' : 'subtle-glow 2s infinite'}}
                  title={isPlayingVocal ? "Arrêter la lecture" : "Écouter l'explication"}
                >
                  {isPlayingVocal ? '🔊' : '🧮'}
                </div>
              </div>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                Un problème d'addition raconte une histoire avec des nombres. 
                Notre mission est de trouver ces nombres et de les additionner pour répondre à la question !
              </p>
            </div>

            {/* Méthode */}
            <div 
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
                {/* Icône d'animation pour la méthode */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-purple-300" 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🎯
                </div>
              </div>
              
              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  animatingStep === 'step1' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                }`}>
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <p className="text-lg text-gray-800">Je lis le problème et je comprends l'histoire</p>
                </div>
                
                <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  animatingStep === 'step2' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-100'
                }`}>
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <p className="text-lg text-gray-800">Je trouve les deux nombres à additionner</p>
                </div>
                
                <div className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  animatingStep === 'step3' ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-100'
                }`}>
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
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
                    {highlightNumbers("Marie a 13 bonbons rouges et 12 bonbons bleus. Combien a-t-elle de bonbons en tout ?", highlightNumbersInStory)}
                  </div>
                </div>
                
                {highlightNumbersInStory && (
                  <div className="text-center p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-lg text-yellow-800 font-semibold">
                      🎯 Voyez comme les nombres <span className="bg-yellow-300 px-2 py-1 rounded font-black">13</span> et <span className="bg-yellow-300 px-2 py-1 rounded font-black">12</span> ressortent bien !
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Exemples */}
            <div 
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
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300" 
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
                    <div className="text-lg text-center">{exercises[currentExercise].story}</div>
                  </div>

                  {/* Zone de réponse */}
                  <div className="text-center space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Ta réponse..."
                      className="text-center text-xl font-bold border-2 border-gray-300 rounded-lg px-4 py-2 w-32"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    <div>
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                      >
                        Vérifier
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg text-center ${
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
                      
                      <button
                        onClick={nextExercise}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 mt-2"
                      >
                        {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir mes résultats'}
                      </button>
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
