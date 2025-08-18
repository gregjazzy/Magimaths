'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star, Minus } from 'lucide-react';

export default function SensSoustraction() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  
  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // États pour la manipulation
  const [showManipulation, setShowManipulation] = useState(false);
  const [manipulationObjects, setManipulationObjects] = useState(5);
  const [objectsToRemove, setObjectsToRemove] = useState(2);
  const [hasRemovedObjects, setHasRemovedObjects] = useState(false);
  
  // États pour le simulateur
  const [currentSimulatorExample, setCurrentSimulatorExample] = useState(0);
  const [simulatorAnimationStep, setSimulatorAnimationStep] = useState(0);
  const [isSimulatorAnimating, setIsSimulatorAnimating] = useState(false);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des exemples de soustraction avec animations
  const subtractionExamples = [
    {
      id: 'ballons',
      title: 'Les ballons qui s\'envolent',
      story: 'Emma a 4 ballons. 2 ballons s\'envolent. Combien lui reste-t-il de ballons ?',
      start: 4,
      removed: 2,
      result: 2,
      item: '🎈',
      action: 's\'envolent',
      color: 'text-blue-500'
    },
    {
      id: 'pommes',
      title: 'Les pommes mangées',
      story: 'Dans le panier, il y a 5 pommes. Paul en mange 2. Combien reste-t-il de pommes ?',
      start: 5,
      removed: 2,
      result: 3,
      item: '🍎',
      action: 'sont mangées',
      color: 'text-red-500'
    },
    {
      id: 'voitures',
      title: 'Les voitures qui partent',
      story: 'Sur le parking, il y a 6 voitures. 3 voitures partent. Combien reste-t-il de voitures ?',
      start: 6,
      removed: 3,
      result: 3,
      item: '🚗',
      action: 'partent',
      color: 'text-yellow-500'
    }
  ];

  // Tous les exemples de soustraction de 0 à 5 - Ordre varié
  const simulatorExamples = [
    // Commencer par des cas simples
    { start: 2, removed: 1, result: 1, story: "J'ai 2 ballons. J'enlève 1 ballon. Il me reste 1 ballon !" },
    { start: 3, removed: 2, result: 1, story: "J'ai 3 ballons. J'enlève 2 ballons. Il me reste 1 ballon !" },
    { start: 1, removed: 1, result: 0, story: "J'ai 1 ballon. J'enlève 1 ballon. Il ne me reste plus rien !" },
    
    // Mélanger différentes tailles
    { start: 4, removed: 1, result: 3, story: "J'ai 4 ballons. J'enlève 1 ballon. Il me reste 3 ballons !" },
    { start: 2, removed: 2, result: 0, story: "J'ai 2 ballons. J'enlève 2 ballons. Il ne me reste plus rien !" },
    { start: 5, removed: 2, result: 3, story: "J'ai 5 ballons. J'enlève 2 ballons. Il me reste 3 ballons !" },
    
    // Cas où on n'enlève rien
    { start: 3, removed: 0, result: 3, story: "J'ai 3 ballons. Je n'en enlève aucun. Il me reste 3 ballons !" },
    { start: 5, removed: 4, result: 1, story: "J'ai 5 ballons. J'enlève 4 ballons. Il me reste 1 ballon !" },
    { start: 4, removed: 3, result: 1, story: "J'ai 4 ballons. J'enlève 3 ballons. Il me reste 1 ballon !" },
    
    // Plus de variété
    { start: 1, removed: 0, result: 1, story: "J'ai 1 ballon. Je n'en enlève aucun. Il me reste 1 ballon !" },
    { start: 3, removed: 1, result: 2, story: "J'ai 3 ballons. J'enlève 1 ballon. Il me reste 2 ballons !" },
    { start: 5, removed: 1, result: 4, story: "J'ai 5 ballons. J'enlève 1 ballon. Il me reste 4 ballons !" },
    
    // Cas où tout disparaît
    { start: 4, removed: 4, result: 0, story: "J'ai 4 ballons. J'enlève 4 ballons. Il ne me reste plus rien !" },
    { start: 2, removed: 0, result: 2, story: "J'ai 2 ballons. Je n'en enlève aucun. Il me reste 2 ballons !" },
    { start: 5, removed: 3, result: 2, story: "J'ai 5 ballons. J'enlève 3 ballons. Il me reste 2 ballons !" },
    
    // Finir avec des cas intéressants
    { start: 4, removed: 2, result: 2, story: "J'ai 4 ballons. J'enlève 2 ballons. Il me reste 2 ballons !" },
    { start: 3, removed: 3, result: 0, story: "J'ai 3 ballons. J'enlève 3 ballons. Il ne me reste plus rien !" },
    { start: 5, removed: 0, result: 5, story: "J'ai 5 ballons. Je n'en enlève aucun. Il me reste 5 ballons !" },
    { start: 4, removed: 0, result: 4, story: "J'ai 4 ballons. Je n'en enlève aucun. Il me reste 4 ballons !" },
    { start: 5, removed: 5, result: 0, story: "J'ai 5 ballons. J'enlève 5 ballons. Il ne me reste plus rien !" }
  ];

  // Exercices pour les élèves - Progression douce
  const exercises = [
    {
      story: 'Paul a 3 pommes. Il en mange 1. Combien lui reste-t-il de pommes ?',
      answer: 2,
      visual: '🍎'
    },
    {
      story: 'Lisa a 4 crayons. Elle en donne 1 à son amie. Combien lui reste-t-il de crayons ?',
      answer: 3,
      visual: '✏️'
    },
    {
      story: 'Dans l\'aquarium, il y a 5 poissons. 2 poissons partent. Combien reste-t-il de poissons ?',
      answer: 3,
      visual: '🐠'
    },
    {
      story: 'Tom a 6 billes. Il en perd 2. Combien de billes lui reste-t-il ?',
      answer: 4,
      visual: '⚽'
    },
    {
      story: 'Marie a 7 bonbons. Elle en mange 3. Combien lui reste-t-il de bonbons ?',
      answer: 4,
      visual: '🍬'
    }
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
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
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

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setHasStarted(true);

    try {
      // Introduction
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons découvrir la soustraction. La soustraction, c'est quand on enlève quelque chose !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Le signe moins
      setHighlightedElement('minus-sign');
      scrollToSection('minus-section');
      await playAudio("Le signe de la soustraction, c'est le signe moins. Il ressemble à un petit trait horizontal.");
      await wait(800);

      if (stopSignalRef.current) return;

      // Comparaison addition-soustraction
      setHighlightedElement('link');
      scrollToSection('link-section');
      await playAudio("Regarde bien la différence ! Avec l'addition, j'ajoute et j'ai plus qu'avant : 2 plus 1 égale 3. Avec la soustraction, j'enlève et j'ai moins qu'avant : 3 moins 1 égale 2. C'est le contraire !");
      await wait(1000);
      
      if (stopSignalRef.current) return;

      // Simulateur
      setHighlightedElement('simulator');
      scrollToSection('simulator-section');
      await playAudio("Maintenant, découvre le simulateur ! Tu peux voir tous les exemples de soustraction de 0 à 5. Clique sur 'Suivant' pour voir d'autres exemples. Chaque exemple te montre les ballons, le calcul, et comment faire avec tes doigts !");
      await wait(1000);

      if (stopSignalRef.current) return;

      // Transition vers les exemples
      setHighlightedElement('examples');
      scrollToSection('examples-section');
      await playAudio("Maintenant, regarde tous ces exemples ! Tu peux en choisir un pour voir l'animation complète.");
      await wait(500);

    } finally {
      // Pause de 1 seconde pour laisser l'élève comprendre
      await wait(1000);
      setHighlightedElement(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const example = subtractionExamples[index];
    setCurrentExample(index);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Lecture du problème
      setHighlightedElement('story');
      scrollToSection('animation-section');
      await playAudio(example.story, true);
      await wait(800);
      
      if (stopSignalRef.current) return;

      // Montrer la situation de départ
      setAnimatingStep('start');
      scrollToSection('animation-section');
      await playAudio(`Au début, il y a ${example.start} ${example.item === '🎈' ? 'ballons' : example.item === '🍎' ? 'pommes' : 'voitures'}.`, true);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Action de soustraction
      setAnimatingStep('removing');
      scrollToSection('animation-section');
      await playAudio(`Maintenant, ${example.removed} ${example.action} !`, true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Résultat
      setAnimatingStep('result');
      scrollToSection('animation-section');
      await playAudio(`Il reste ${example.result} ! Donc ${example.start} moins ${example.removed} égale ${example.result} ! N'hésite pas à refaire la même chose avec tes propres doigts !`, true);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Calcul écrit
      setAnimatingStep('calculation');
      scrollToSection('animation-section');
      await playAudio(`On peut l'écrire : ${example.start} moins ${example.removed} égale ${example.result}. Bravo !`, true);
      await wait(1000);

    } finally {
      // Pause de 1 seconde pour laisser l'élève comprendre
      await wait(1000);
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
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

  // Animation automatique du simulateur
  const startSimulatorAnimation = async () => {
    const example = simulatorExamples[currentSimulatorExample];
    setIsSimulatorAnimating(true);
    setSimulatorAnimationStep(0);
    
    // Attendre plus longtemps pour montrer tous les ballons
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enlever les ballons un par un plus lentement
    for (let i = 1; i <= example.removed; i++) {
      setSimulatorAnimationStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Attendre plus longtemps avant de finir l'animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSimulatorAnimating(false);
  };

  // Déclencher l'animation automatique quand on change d'exemple
  useEffect(() => {
    startSimulatorAnimation();
  }, [currentSimulatorExample]);

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

  // Fonction pour rendre les objets avec animations
  const renderObjects = (count: number, item: string, colorClass: string, fadeOut = false) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`text-2xl sm:text-3xl ${colorClass} transition-all duration-1000 transform ${
          fadeOut ? 'opacity-70 scale-75' : 'opacity-100 scale-100'
        } ${
          animatingStep === 'start' || animatingStep === 'removing' ? 'animate-bounce' : ''
        }`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {item}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/chapitre/cp-soustractions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 px-2">
              ➖ Le sens de la soustraction
          </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
              Apprendre à enlever et à comprendre le signe moins
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 px-2">
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
              setShowManipulation(false);
            }}
            disabled={isPlayingVocal}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              isPlayingVocal 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : !showExercises && !showManipulation
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-purple-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
              setShowManipulation(true);
              setHasRemovedObjects(false);
            }}
            disabled={isPlayingVocal}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              isPlayingVocal 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : showManipulation
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
            }`}
          >
            🖐️ Manipuler
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
              setShowManipulation(false);
            }}
            disabled={isPlayingVocal}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              isPlayingVocal 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : showExercises
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-purple-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises && !showManipulation ? (
          /* Section Cours */
          <div className="space-y-4 sm:space-y-8">
            {/* Bouton COMMENCER/RECOMMENCER */}
            <div className="text-center mb-4 sm:mb-8 px-2">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-purple-400 to-pink-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-xl shadow-2xl hover:shadow-purple-500/50 hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-white/30 w-full sm:w-auto ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'animate-pulse hover:animate-none hover:from-purple-300 hover:to-pink-500'
                }`}
              >
                {isPlayingVocal ? '🎤 JE PARLE...' : (hasStarted ? '🔄 RECOMMENCER !' : '▶️ COMMENCER !')}
              </button>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2">
                {isPlayingVocal ? 'Écoute bien l\'explication...' : (hasStarted ? 'Clique pour réécouter l\'explication complète' : 'Clique ici pour débuter l\'explication interactive')}
              </p>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                  <Book className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Qu'est-ce que la soustraction ?</h2>
              </div>
              <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                La soustraction, c'est quand on enlève, on retire, ou on fait partir quelque chose. 
                C'est l'inverse de l'addition : au lieu d'ajouter, on retire !
              </p>
            </div>



            {/* Le signe moins */}
            <div 
              id="minus-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2 transition-all duration-300 ${
                highlightedElement === 'minus-sign' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-md">
                  <Minus className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Le signe moins ( - )
                </h2>
              </div>
              
              <div className="text-center">
                <div className="relative inline-block w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-pink-200 rounded-2xl sm:rounded-3xl blur-sm opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-red-50 via-white to-pink-50 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-red-100 shadow-xl">
                    <div className="mb-4 sm:mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4 transform hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl sm:text-6xl font-bold text-white">-</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                        🎯 Le symbole magique de la soustraction !
                      </h3>
                      
                      <div className="bg-white/80 rounded-xl p-4 sm:p-6 border border-red-100">
                        <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                          Ce petit trait horizontal nous dit : <br/>
                          <span className="inline-flex items-center gap-1 sm:gap-2 mt-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-full text-xs sm:text-base">
                            <span className="text-sm sm:text-xl">✨</span>
                            <span className="font-bold text-red-600">« Enlève-moi quelque chose ! »</span>
                            <span className="text-sm sm:text-xl">✨</span>
                          </span>
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                        <div className="bg-red-100 px-2 sm:px-4 py-1 sm:py-2 rounded-full">
                          <span className="text-red-700 font-semibold text-xs sm:text-base">👋 Enlever</span>
                        </div>
                        <div className="bg-pink-100 px-2 sm:px-4 py-1 sm:py-2 rounded-full">
                          <span className="text-pink-700 font-semibold text-xs sm:text-base">🚀 Retirer</span>
                        </div>
                        <div className="bg-orange-100 px-2 sm:px-4 py-1 sm:py-2 rounded-full">
                          <span className="text-orange-700 font-semibold text-xs sm:text-base">💨 Faire partir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lien addition-soustraction */}
            <div 
              id="link-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2 transition-all duration-300 ${
                highlightedElement === 'link' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl shadow-md">
                  <span className="text-2xl">🔄</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Addition ➕ et Soustraction ➖
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-4 border-2 border-orange-100">
                  <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span>
                    Regarde comme c'est magique !
                        </h3>
                  
                  {/* Démonstration avec les mêmes objets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Addition */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-green-200">
                      <h4 className="text-sm sm:text-base font-bold text-green-700 mb-3 text-center">
                        ➕ ADDITION : J'ajoute
                      </h4>
                      <div className="text-center space-y-3">
                        <div className="flex justify-center items-center gap-2">
                          <span className="text-xl sm:text-2xl">🍎🍎</span>
                          <span className="text-green-600 font-bold">+</span>
                          <span className="text-xl sm:text-2xl">🍎</span>
                          <span className="text-gray-600 font-bold">=</span>
                          <span className="text-xl sm:text-2xl">🍎🍎🍎</span>
                        </div>
                        <p className="text-xs sm:text-sm text-green-700 font-medium">
                          2 + 1 = 3
                        </p>
                        <p className="text-xs sm:text-sm text-green-600">
                          J'ai plus qu'avant !
                        </p>
                      </div>
                    </div>
                    
                    {/* Soustraction */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-red-200">
                      <h4 className="text-sm sm:text-base font-bold text-red-700 mb-3 text-center">
                        ➖ SOUSTRACTION : J'enlève
                      </h4>
                      <div className="text-center space-y-3">
                        <div className="flex justify-center items-center gap-2">
                          <span className="text-xl sm:text-2xl">🍎🍎🍎</span>
                          <span className="text-red-600 font-bold">-</span>
                          <span className="text-xl sm:text-2xl opacity-50 line-through">🍎</span>
                          <span className="text-gray-600 font-bold">=</span>
                          <span className="text-xl sm:text-2xl">🍎🍎</span>
                        </div>
                        <p className="text-xs sm:text-sm text-red-700 font-medium">
                          3 - 1 = 2
                        </p>
                        <p className="text-xs sm:text-sm text-red-600">
                          J'ai moins qu'avant !
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message clé */}
                  <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 sm:p-4 border border-purple-200">
                    <div className="text-center">
                      <p className="text-sm sm:text-base font-bold text-purple-800 mb-2">
                        <span className="text-lg">🎯</span> Tu vois la différence ?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div className="bg-green-100 rounded-lg p-2">
                          <span className="font-bold text-green-800">➕ Ajouter = Plus</span>
                        </div>
                        <div className="bg-red-100 rounded-lg p-2">
                          <span className="font-bold text-red-800">➖ Enlever = Moins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulateur de soustractions */}
            <div 
              id="simulator-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2 transition-all duration-300 ${
                highlightedElement === 'simulator' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-md">
                  <span className="text-2xl">🎮</span>
                            </div>
                <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Simulateur de soustractions
                </h2>
                        </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Compteur et navigation */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                  <div className="text-sm sm:text-base font-medium text-gray-600">
                    Exemple {currentSimulatorExample + 1} sur {simulatorExamples.length}
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setCurrentSimulatorExample(Math.max(0, currentSimulatorExample - 1))}
                      disabled={currentSimulatorExample === 0 || isSimulatorAnimating}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                        currentSimulatorExample === 0 || isSimulatorAnimating
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      ← Précédent
                    </button>
                    <button
                      onClick={startSimulatorAnimation}
                      disabled={isSimulatorAnimating}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                        isSimulatorAnimating
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      🎬 Revoir
                    </button>
                    <button
                      onClick={() => setCurrentSimulatorExample(Math.min(simulatorExamples.length - 1, currentSimulatorExample + 1))}
                      disabled={currentSimulatorExample === simulatorExamples.length - 1 || isSimulatorAnimating}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                        currentSimulatorExample === simulatorExamples.length - 1 || isSimulatorAnimating
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Suivant →
                    </button>
                  </div>
                </div>

                {/* Exemple actuel */}
                {(() => {
                  const example = simulatorExamples[currentSimulatorExample];
                  return (
                    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-100 shadow-lg">
                      {/* Histoire */}
                      <div className="text-center mb-4 sm:mb-6">
                        <p className="text-sm sm:text-lg font-medium text-gray-700 mb-4">
                          {example.story}
                        </p>
                      </div>

                      {/* Visualisation avec ballons */}
                      <div className="space-y-4 sm:space-y-6">
                                                {/* Ballons de départ avec animation */}
                        <div className="text-center">
                          <h3 className="text-sm sm:text-base font-bold text-blue-800 mb-3">
                            {isSimulatorAnimating && simulatorAnimationStep === 0 
                              ? `Au début : ${example.start} ballon${example.start > 1 ? 's' : ''}` 
                              : simulatorAnimationStep > 0 && simulatorAnimationStep <= example.removed
                                ? `J'enlève le ${simulatorAnimationStep}${simulatorAnimationStep === 1 ? 'er' : 'ème'} ballon...`
                                : `Résultat : ${example.result} ballon${example.result > 1 ? 's' : ''} ${example.result === 0 ? '(plus rien !)' : ''}`
                            }
                          </h3>
                          <div className="flex justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
                            {Array.from({ length: example.start }, (_, i) => (
                              <div
                                key={i}
                                className={`relative text-2xl sm:text-3xl transition-all duration-1000 transform ${
                                  isSimulatorAnimating 
                                    ? (i < simulatorAnimationStep 
                                        ? 'opacity-30 scale-75 -translate-y-2 rotate-12' 
                                        : 'opacity-100 scale-100 hover:scale-110')
                                    : (i < example.removed 
                                        ? 'opacity-50 line-through' 
                                        : 'opacity-100')
                                } ${
                                  isSimulatorAnimating && i === simulatorAnimationStep - 1 ? 'animate-pulse' : ''
                                }`}
                              >
                                🎈
                                {isSimulatorAnimating && i < simulatorAnimationStep && (
                                  <span className="absolute -top-1 -right-1 text-sm animate-bounce">💨</span>
                                )}
                              </div>
                            ))}
                          </div>
                          </div>

                        {/* Calcul */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-md border">
                            <span className="text-xl sm:text-2xl font-bold text-blue-600">{example.start}</span>
                            <span className="text-xl sm:text-2xl font-bold text-red-600">-</span>
                            <span className="text-xl sm:text-2xl font-bold text-orange-600">{example.removed}</span>
                            <span className="text-xl sm:text-2xl font-bold text-gray-600">=</span>
                            <span className="text-xl sm:text-2xl font-bold text-green-600">{example.result}</span>
                        </div>
                      </div>

                    {/* Résultat */}
                        <div className="text-center">
                          <h3 className="text-sm sm:text-base font-bold text-green-800 mb-3">
                            Résultat : {example.result} ballon{example.result > 1 ? 's' : ''} {example.result === 0 ? '(plus rien !)' : ''}
                          </h3>
                          {example.result > 0 && (
                            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                              {Array.from({ length: example.result }, (_, i) => (
                                <div key={i} className="text-2xl sm:text-3xl animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                                🎈
                              </div>
                            ))}
                          </div>
                          )}
                          {example.result === 0 && (
                            <div className="text-3xl sm:text-4xl">🚫</div>
                          )}
                        </div>

                        {/* Avec les doigts */}
                        <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                          <h4 className="text-sm sm:text-base font-bold text-amber-800 mb-2 text-center">
                            ✋ Avec tes doigts :
                          </h4>
                          <div className="flex justify-center gap-1 mb-2 flex-wrap">
                            {Array.from({ length: Math.min(example.start, 10) }, (_, i) => (
                              <span key={i} className={`text-lg sm:text-xl ${i < example.removed ? 'opacity-50' : ''}`}>
                                {i < example.removed ? '👇' : '👆'}
                              </span>
                            ))}
                          </div>
                          <p className="text-center text-amber-700 text-xs sm:text-sm">
                            Lève {example.start} doigts, baisse-en {example.removed}, compte ceux qui restent !
                          </p>
                        </div>
                      </div>
                  </div>
                  );
                })()}
              </div>
                  </div>

            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                🎯 Choisis un exemple pour voir l'animation !
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {subtractionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 sm:p-6 transition-all duration-300 ${
                      isPlayingVocal 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${
                      currentExample === index ? 'ring-4 ring-purple-400 bg-purple-100' : ''
                    }`}
                    onClick={() => {
                      if (!isPlayingVocal) {
                        explainSpecificExample(index);
                      }
                    }}
                  >
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl mb-2">{example.item}</div>
                      <h3 className={`font-bold text-sm sm:text-lg mb-2 ${isPlayingVocal ? 'text-gray-400' : 'text-gray-800'}`}>{example.title}</h3>
                      <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${isPlayingVocal ? 'text-gray-400' : 'text-gray-600'}`}>{example.story}</p>
                      <button 
                        disabled={isPlayingVocal}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors w-full sm:w-auto ${
                          isPlayingVocal 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        ▶️ Voir l'animation
                      </button>
                        </div>
                      </div>
                ))}
                    </div>
                </div>

            {/* Zone d'animation */}
            {currentExample !== null && (
              <div 
                id="animation-section"
                className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2"
              >
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                  🎬 Animation de la soustraction
                </h2>
                
                {(() => {
                  const example = subtractionExamples[currentExample];
                  return (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Histoire */}
                      <div className={`p-3 sm:p-4 rounded-lg text-center ${
                        highlightedElement === 'story' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <p className="text-sm sm:text-lg font-semibold text-gray-800">{example.story}</p>
                      </div>

                      {/* Animation des objets */}
                      <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                        {/* Situation de départ */}
                        {(animatingStep === 'start' || animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && (
                          <div className={`p-3 sm:p-6 rounded-lg ${animatingStep === 'start' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'}`}>
                            <div className="text-center mb-3 sm:mb-4">
                              <p className="text-sm sm:text-lg font-semibold text-gray-800">Au début : {example.start}</p>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 justify-items-center">
                              {Array.from({ length: example.start }, (_, i) => (
                                <div
                                  key={i}
                                  className={`text-2xl sm:text-3xl ${example.color} transition-all duration-1000 ${
                                    (animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && i < example.removed ? 'opacity-70 scale-75 animate-pulse' : 'opacity-100'
                                  }`}
                                >
                                  {example.item}
                                </div>
                              ))}
                            </div>

                            {/* Compter sur ses doigts */}
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 sm:p-4 rounded-lg border border-amber-200 mt-3 sm:mt-4">
                              <h4 className="text-sm sm:text-md font-bold text-amber-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                                ✋ Sur mes doigts :
                              </h4>
                              <div className="flex justify-center gap-1 mb-2 sm:mb-3 flex-wrap">
                                {Array.from({ length: Math.min(example.start, 10) }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`transform transition-all duration-1000 ${
                                      (animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && i < example.removed 
                                        ? 'opacity-50 scale-75 -translate-y-1' 
                                        : 'opacity-100 scale-100'
                                    }`}
                                  >
                                    <div className="text-lg sm:text-2xl">
                                      {(animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && i < example.removed ? '👇' : '👆'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-amber-700 text-xs sm:text-sm font-medium">
                                {(animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation')
                                  ? `${example.start} doigts → j'en baisse ${example.removed} → il reste ${example.start - example.removed} !`
                                  : `${example.start} doigts levés`
                                }
                              </p>
                              <div className="mt-2 sm:mt-3 p-2 bg-amber-100 rounded-lg border border-amber-300">
                                <p className="text-center text-amber-800 font-bold text-xs flex items-center justify-center gap-1">
                                  <span>🖐️</span>
                                  Fais pareil avec tes mains !
                                  <span>🖐️</span>
                                </p>
                                <p className="text-center text-amber-700 text-xs mt-1">
                                  Lève {example.start} doigts, baisse-en {example.removed} !
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action d'enlever */}
                        {animatingStep === 'removing' && (
                          <div className="p-3 sm:p-4 bg-yellow-100 rounded-lg">
                            <p className="text-sm sm:text-lg font-semibold text-center text-gray-800">
                              {example.removed} {example.action} ! 💨
                            </p>
                          </div>
                        )}

                        {/* Résultat */}
                        {(animatingStep === 'result' || animatingStep === 'calculation') && (
                          <div className={`p-3 sm:p-6 rounded-lg ${animatingStep === 'result' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'}`}>
                            <div className="text-center mb-3 sm:mb-4">
                              <p className="text-sm sm:text-lg font-semibold text-gray-800">Il reste : {example.result}</p>
                            </div>
                            <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                              {Array.from({ length: example.result }, (_, i) => (
                                <div key={i} className={`text-2xl sm:text-3xl ${example.color} animate-bounce`}>
                                  {example.item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Calcul écrit */}
                        {animatingStep === 'calculation' && (
                          <div className="p-3 sm:p-6 bg-purple-100 rounded-lg">
                            <p className="text-xl sm:text-3xl font-bold text-center text-purple-800">
                              {example.start} - {example.removed} = {example.result}
                            </p>
                      </div>
                        )}
                    </div>
                  </div>
                  );
                })()}
                </div>
              )}
          </div>
        ) : showManipulation ? (
          /* Section Manipulation */
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                🖐️ À toi de manipuler !
              </h2>
              
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-sm sm:text-lg text-gray-700 mb-4">
                  Clique sur les objets pour les faire disparaître et découvre le résultat !
                </p>
                
                {/* Contrôles */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Objets de départ :</label>
                    <select 
                      value={manipulationObjects} 
                      onChange={(e) => {
                        setManipulationObjects(Number(e.target.value));
                        setHasRemovedObjects(false);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">À enlever :</label>
                    <select 
                      value={objectsToRemove} 
                      onChange={(e) => {
                        setObjectsToRemove(Number(e.target.value));
                        setHasRemovedObjects(false);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      {Array.from({ length: manipulationObjects }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Zone de manipulation */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-blue-100">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 justify-items-center mb-6">
                    {Array.from({ length: manipulationObjects }, (_, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (!hasRemovedObjects && i < objectsToRemove) {
                            setHasRemovedObjects(true);
                          }
                        }}
                        className={`text-3xl sm:text-4xl cursor-pointer transition-all duration-500 ${
                          hasRemovedObjects && i < objectsToRemove 
                            ? 'opacity-30 scale-75 grayscale' 
                            : 'hover:scale-110 hover:rotate-12'
                        }`}
                      >
                        🎈
                      </div>
                    ))}
                  </div>
                  
                  {hasRemovedObjects && (
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h3 className="text-lg font-bold text-green-800 mb-2">Bravo ! 🎉</h3>
                      <p className="text-gray-700">
                        Tu avais {manipulationObjects} ballons, tu en as enlevé {objectsToRemove}, 
                        il te reste {manipulationObjects - objectsToRemove} ballons !
                      </p>
                      <div className="mt-3 p-3 bg-green-100 rounded-lg">
                        <p className="text-xl font-bold text-center text-green-800">
                          {manipulationObjects} - {objectsToRemove} = {manipulationObjects - objectsToRemove}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setHasRemovedObjects(false)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔄 Recommencer
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Section Exercices */
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mx-2">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="text-sm sm:text-lg font-semibold text-purple-600">
                  Score : {score} / {exercises.length}
                  </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Icône visuelle */}
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{exercises[currentExercise].visual}</div>
                    </div>

                  {/* Énoncé du problème */}
                  <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm sm:text-lg text-center">{exercises[currentExercise].story}</p>
                </div>

                  {/* Zone de réponse */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Ta réponse..."
                      className="text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-24 sm:w-32"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    <div>
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer || isPlayingVocal}
                        className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto ${
                          !userAnswer || isPlayingVocal
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        Vérifier
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`p-3 sm:p-4 rounded-lg text-center ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                      {isCorrect ? (
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                        <span className="font-bold text-sm sm:text-base">
                          {isCorrect ? 'Bravo ! Bonne réponse !' : `Pas tout à fait... La réponse était ${exercises[currentExercise].answer}`}
                        </span>
                          </div>
                      
                          <button
                            onClick={nextExercise}
                            disabled={isPlayingVocal}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold mt-2 transition-colors text-sm sm:text-base w-full sm:w-auto ${
                              isPlayingVocal 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                                : 'bg-purple-500 text-white hover:bg-purple-600'
                            }`}
                          >
                        {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir mes résultats'}
                          </button>
                        </div>
                      )}
                    </div>
              ) : (
                /* Modal de fin */
                <div className="text-center space-y-4 sm:space-y-6">
                  <div className="text-4xl sm:text-6xl">🎉</div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
                    Exercices terminés !
                  </h2>
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button
                      onClick={resetExercises}
                      disabled={isPlayingVocal}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto ${
                        isPlayingVocal 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      disabled={isPlayingVocal}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto ${
                        isPlayingVocal 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                          : 'bg-pink-500 text-white hover:bg-pink-600'
                      }`}
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