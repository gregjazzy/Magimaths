'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star, Minus, ChevronDown } from 'lucide-react';

export default function SoustractionsJusqu20() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedMethod, setHighlightedMethod] = useState<string | null>(null);
  const [removedObjectsCount, setRemovedObjectsCount] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  
  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des exemples de soustraction avec animations
  const subtractionExamples = [
    {
      id: 'complement10',
      title: 'Passage par 10',
      operation: '15 - 7',
      start: 15,
      remove: 7,
      result: 8,
      strategy: 'complement10',
      explanation: 'Pour 15 - 7, on fait 15 - 5 = 10, puis 10 - 2 = 8 !',
      item: '🎯',
      color: 'text-red-500',
      step1: 5, // Ce qu'on enlève pour arriver à 10
      step2: 2  // Ce qu'il reste à enlever
    },
    {
      id: 'decomposition',
      title: 'Décomposition',
      operation: '18 - 9',
      start: 18,
      remove: 9,
      result: 9,
      strategy: 'decomposition',
      explanation: 'Pour 18 - 9, on peut faire 18 - 10 + 1 = 8 + 1 = 9 !',
      item: '🧮',
      color: 'text-blue-500'
    }
  ];

  // Exercices pour les élèves
  const exercises = [
    {
      operation: '12 - 5',
      answer: 7,
      visual: '⭐',
      story: 'Il y a 12 étoiles. 5 s\'éteignent.'
    },
    {
      operation: '16 - 8',
      answer: 8,
      visual: '🍎',
      story: 'Il y a 16 pommes. 8 sont mangées.'
    },
    {
      operation: '20 - 12',
      answer: 8,
      visual: '🚗',
      story: 'Il y a 20 voitures. 12 partent.'
    },
    {
      operation: '17 - 9',
      answer: 8,
      visual: '🎈',
      story: 'Il y a 17 ballons. 9 s\'envolent.'
    },
    {
      operation: '13 - 6',
      answer: 7,
      visual: '🌺',
      story: 'Il y a 13 fleurs. 6 fanent.'
    },
    {
      operation: '19 - 11',
      answer: 8,
      visual: '🍬',
      story: 'Il y a 19 bonbons. 11 sont mangés.'
    },
    {
      operation: '15 - 8',
      answer: 7,
      visual: '🐦',
      story: 'Il y a 15 oiseaux. 8 s\'envolent.'
    },
    {
      operation: '20 - 13',
      answer: 7,
      visual: '📚',
      story: 'Il y a 20 livres. 13 sont pris.'
    },
    {
      operation: '18 - 12',
      answer: 6,
      visual: '⚽',
      story: 'Il y a 18 ballons. 12 roulent.'
    },
    {
      operation: '14 - 9',
      answer: 5,
      visual: '🎮',
      story: 'Il y a 14 jeux. 9 sont rangés.'
    }
  ];

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    // Arrêter AGRESSIVEMENT la synthèse vocale
    speechSynthesis.cancel();
    console.log('🔇 speechSynthesis.cancel() appelé');
    
    // Double sécurité : réessayer l'arrêt après un délai
    setTimeout(() => {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        console.log('🔇 Double arrêt speechSynthesis');
      }
    }, 50);
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedMethod(null);
    setRemovedObjectsCount(0);
    setCurrentStep(null);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode: boolean | 'slow' = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      // SÉCURITÉ : S'assurer qu'aucun audio ne joue déjà
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        // Attendre que l'arrêt soit effectif puis continuer
        setTimeout(() => {
          resolve(); // Simplement résoudre sans rejouer
        }, 100);
        return;
      }
      
      console.log(`🎧 Joue audio: "${text}"`);
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode === 'slow' ? 0.5 : slowMode ? 0.6 : 0.8;
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
      // Introduction - Objectif du chapitre
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Maintenant nous allons apprendre les soustractions jusqu'à 20.", true);
      await wait(1000);

      if (stopSignalRef.current) return;

      await playAudio("L'objectif est de maîtriser les soustractions avec des nombres plus grands en utilisant des techniques intelligentes !", true);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Présentation des deux méthodes
      setHighlightedElement('strategies');
      scrollToSection('strategies-section');
      await playAudio("Pour y arriver, je vais te montrer deux méthodes super efficaces !", true);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Scroll vers les exemples pour voir les cartes
      scrollToSection('examples-section');
      await wait(800);

      // Méthode 1 : Passage par 10
      setHighlightedMethod('complement10');
      await playAudio("Première méthode : passage par 10 ! On décompose pour passer par la dizaine.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Méthode 2 : Décomposition
      setHighlightedMethod('decomposition');
      await playAudio("Deuxième méthode : décomposition ! On sépare le nombre en parties plus faciles.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Conclusion
      setHighlightedMethod(null);
      setHighlightedElement('examples');
      await playAudio("Maintenant, choisis une méthode pour voir une animation magique qui t'explique tout !", true);
      await wait(500);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setHighlightedMethod(null);
    }
  };

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    console.log(`🎯 explainSpecificExample appelé pour index ${index}`);
    
    // Protection contre les appels multiples
    if (isPlayingVocal && currentExample !== null) {
      console.log('🛑 Animation déjà en cours, ignore le clic');
      return;
    }
    
    stopAllVocalsAndAnimations();
    await wait(500); // Délai plus long pour éviter les chevauchements audio
    stopSignalRef.current = false;
    
    const example = subtractionExamples[index];
    setCurrentExample(index);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Présentation de l'exemple
      setHighlightedElement('example-title');
      await playAudio(`Découvrons la technique : ${example.title} avec ${example.start} moins ${example.remove} !`);
      await wait(800);
      
      if (stopSignalRef.current) return;

      // Explication de la stratégie
      setAnimatingStep('strategy-explanation');
      await playAudio(example.explanation, 'slow');
      await wait(1000);

      if (stopSignalRef.current) return;

      // Animation selon la stratégie
      if (example.strategy === 'complement10') {
        await animateComplement10Strategy(example);
      } else if (example.strategy === 'decomposition') {
        await animateDecompositionStrategy(example);
      }

      // Résultat final
      setAnimatingStep('final-result');
      await playAudio(`Parfait ! ${example.start} moins ${example.remove} égale ${example.result} ! Cette technique est très utile !`);
      await wait(1000);

    } finally {
      // Pause de 1,5 seconde à la fin pour laisser l'élève comprendre
      await wait(1500);
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setRemovedObjectsCount(0);
      setCurrentStep(null);
    }
  };

  // Animation pour la stratégie passage par 10
  const animateComplement10Strategy = async (example: any) => {
    setCurrentStep('step1');
    setRemovedObjectsCount(0);
    setAnimatingStep('complement10-step1');
    scrollToSection('animation-section');
    await playAudio(`Voici ${example.start} boules ! D'abord, on enlève ${example.step1} d'un coup pour arriver à 10`, 'slow');
    await wait(1000);

    if (stopSignalRef.current) return;

    // Enlever step1 boules d'un coup (passage par 10)
    setRemovedObjectsCount(example.step1);
    await playAudio(`${example.start} moins ${example.step1} égale 10`, 'slow');
    await wait(1500);

    await playAudio(`Parfait ! Il reste 10 boules`, 'slow');
    await wait(1000);

    if (stopSignalRef.current) return;

    setCurrentStep('step2');
    setAnimatingStep('complement10-step2');
    scrollToSection('animation-section');
    await playAudio(`Maintenant, il reste ${example.step2} à enlever de ces 10 boules`, 'slow');
    await wait(1000);

    if (stopSignalRef.current) return;

    // Enlever step2 boules d'un coup
    setRemovedObjectsCount(example.remove); // Total enlevé
    await playAudio(`10 moins ${example.step2} égale ${example.result}`, 'slow');
    await wait(1500);

    setCurrentStep('result');
    await playAudio(`Et voilà ! Il reste ${example.result} boules !`, 'slow');
    await wait(1500);

    if (stopSignalRef.current) return;

    setAnimatingStep('complement10-result');
    await playAudio(`10 moins ${example.step2} égale ${example.result} !`);
    await wait(1000);
  };

  // Animation pour la stratégie de décomposition
  const animateDecompositionStrategy = async (example: any) => {
    setCurrentStep('step1');
    setRemovedObjectsCount(0);
    setAnimatingStep('decomposition-step1');
    scrollToSection('animation-section');
    await playAudio(`Voici ${example.start} boules ! On va enlever ${example.remove} en décomposant : d'abord on enlève 10 d'un coup, puis on remet 1`, 'slow');
    await wait(1000);

    if (stopSignalRef.current) return;

    // Enlever 10 boules d'un coup
    setRemovedObjectsCount(10);
    await playAudio(`${example.start} moins 10 égale ${example.start - 10}`, 'slow');
    await wait(1500);

    setCurrentStep('step2');
    setAnimatingStep('decomposition-step2');
    await playAudio(`J'ai enlevé 10 boules, il reste ${example.start - 10}. Mais je n'en voulais enlever que ${example.remove} !`, 'slow');
    await wait(1000);
      
    if (stopSignalRef.current) return;

    // Remettre 1 boule d'un coup
    setRemovedObjectsCount(example.remove); // On remet 1, donc 9 au total
    setCurrentStep('result');
    setAnimatingStep('decomposition-result');
    scrollToSection('animation-section');
    await playAudio(`Je remets 1 boule ! ${example.start - 10} plus 1 égale ${example.result} boules !`, 'slow');
      await wait(1000);
      
    // Pause de 1,5 seconde à la fin pour bien comprendre
    await wait(1500);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-soustractions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🚀 Soustractions jusqu'à 20
          </h1>
            <p className="text-lg text-gray-600">
              Maîtriser les techniques avancées de soustraction
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
            disabled={isPlayingVocal}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isPlayingVocal
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : !showExercises
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
            disabled={isPlayingVocal}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isPlayingVocal
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : showExercises
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-orange-600 hover:bg-orange-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-orange-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* Section Cours */
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            <div className="text-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isPlayingVocal
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75'
                    : hasStarted
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105 animate-pulse'
                }`}
              >
                {isPlayingVocal
                  ? '🎤 JE PARLE...'
                  : hasStarted
                    ? '🔄 RECOMMENCER !'
                    : '▶️ COMMENCER !'
                }
              </button>
              <p className="text-sm text-gray-600 mt-2">
                {isPlayingVocal
                  ? 'Écoute l\'explication en cours...'
                  : hasStarted
                    ? 'Relance l\'explication complète'
                    : 'Lance l\'explication des techniques de soustraction'
                }
              </p>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Book className="w-6 h-6 text-orange-600" />
              </div>
                <h2 className="text-2xl font-bold text-gray-800">Les soustractions jusqu'à 20</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Avec des nombres plus grands, on utilise des techniques intelligentes ! 
                Au lieu de compter un par un, on décompose et on passe par des nombres ronds comme 10.
              </p>
            </div>

            {/* Les défis */}
            <div 
              id="challenges-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'challenges' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Nos techniques de champion</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold text-red-800">Passage par 10</h4>
                  <p className="text-sm text-red-600">15-7 → 15-5-2 = 8</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🧮</div>
                  <h4 className="font-bold text-blue-800">Décomposition</h4>
                  <p className="text-sm text-blue-600">18-9 → 18-10+1 = 9</p>
                </div>
              </div>
            </div>

            {/* Démonstration */}
            <div 
              id="demo-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'demo' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎬 Exemple magique : 15 - 7
              </h2>

              {animatingStep === 'demo' && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <p className="text-lg font-semibold text-gray-800">Technique du passage par 10 :</p>
                    <div className="flex justify-center items-center space-x-4 text-xl">
                      <span className="bg-red-100 px-4 py-2 rounded-lg text-gray-800">15 - 5</span>
                      <span className="text-gray-800">=</span>
                      <span className="bg-yellow-100 px-4 py-2 rounded-lg text-gray-800">10</span>
              </div>
                    <div className="flex justify-center items-center space-x-4 text-xl">
                      <span className="bg-yellow-100 px-4 py-2 rounded-lg text-gray-800">10 - 2</span>
                      <span className="text-gray-800">=</span>
                      <span className="bg-green-100 px-4 py-2 rounded-lg animate-pulse text-gray-800">8</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">15 - 7 = 8 !</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                  🎯 Maîtrise les 2 super techniques !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {subtractionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 transition-all duration-500 ${
                      isPlayingVocal 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${
                      currentExample === index ? 'ring-4 ring-orange-400 bg-orange-100' : ''
                    } ${
                      highlightedMethod === example.strategy 
                        ? 'ring-4 ring-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100 shadow-2xl animate-pulse scale-110 border-2 border-yellow-300' 
                        : ''
                    }`}
                    onClick={() => {
                      if (!isPlayingVocal) {
                        explainSpecificExample(index);
                      }
                    }}
                  >
                    <div className="text-center relative">
                      {/* Effet brillant quand la méthode est mise en évidence */}
                      {highlightedMethod === example.strategy && (
                        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                          ✨
                        </div>
                      )}
                      {highlightedMethod === example.strategy && (
                        <div className="absolute -top-1 -left-1 text-xl animate-pulse">
                          🌟
                        </div>
                      )}
                      {highlightedMethod === example.strategy && (
                        <div className="absolute -bottom-1 right-2 text-lg animate-bounce delay-75">
                          ⭐
                        </div>
                      )}
                      
                      <div className="text-4xl mb-2">{example.item}</div>
                      <h3 className={`font-bold text-lg mb-2 ${
                        highlightedMethod === example.strategy 
                          ? 'text-orange-800 font-extrabold text-xl' 
                          : isPlayingVocal 
                            ? 'text-gray-400' 
                            : 'text-gray-800'
                      }`}>{example.title}</h3>
                      <div className={`text-xl font-mono bg-white text-gray-800 px-3 py-1 rounded mb-3 ${isPlayingVocal ? 'opacity-50' : ''}`}>{example.operation}</div>
                      <p className={`text-sm mb-4 ${isPlayingVocal ? 'text-gray-400' : 'text-gray-600'}`}>{example.explanation}</p>
                      <button 
                        disabled={isPlayingVocal}
                        onClick={() => explainSpecificExample(index)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          isPlayingVocal 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-orange-500 text-white hover:bg-orange-600'
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
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎬 Animation de la technique avancée
                </h2>
                
                {(() => {
                  const example = subtractionExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Titre de l'exemple */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'example-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <h3 className="text-xl font-bold text-gray-800">{example.title}</h3>
                        <div className="text-2xl font-mono mt-2 text-gray-800">{example.operation}</div>
                </div>
                
                {/* Animation selon la stratégie */}
                      {example.strategy === 'complement10' && (
                        <div className="space-y-4">
                          {(animatingStep === 'complement10-step1' || animatingStep === 'complement10-step2' || animatingStep === 'complement10-result') && (
                            <div className="text-center space-y-6">
                              <p className="text-lg font-semibold text-gray-800">Passage par 10 :</p>
                              
                              {/* Visualisation avec boules */}
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                                <h4 className="text-lg font-bold text-gray-800 mb-4">🔵 Les {example.start} boules :</h4>
                                <div className="grid grid-cols-5 gap-2 justify-items-center max-w-lg mx-auto mb-4">
                                  {Array.from({ length: example.start }, (_, i) => (
                                    <div
                                      key={i}
                                      className={`text-3xl transition-all duration-1000 ${
                                        i < removedObjectsCount 
                                          ? 'opacity-30 scale-75 transform rotate-12' 
                                          : 'opacity-100 scale-100'
                                      }`}
                                    >
                                      🔵
                                    </div>
                                  ))}
                                </div>
                                <p className="text-center text-gray-700 font-medium">
                                  {currentStep === 'step1' && `J'enlève ${example.step1} boules d'un coup pour arriver à 10`}
                                  {currentStep === 'step2' && `Maintenant j'enlève ${example.step2} boules d'un coup`}
                                  {currentStep === 'result' && `Il reste ${example.result} boules !`}
                                </p>
                              </div>

                              {/* Toutes les étapes de calcul restent visibles */}
                              <div className="space-y-4">
                                {/* Étape 1 - toujours visible */}
                                <div className={`p-4 rounded-lg transition-all ${
                                  currentStep === 'step1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                                }`}>
                                  <div className="flex justify-center items-center space-x-4 text-xl">
                                    <span className="text-gray-800">{example.start}</span>
                                    <span className="text-gray-800">-</span>
                                    <span className="bg-red-200 px-3 py-1 rounded text-gray-800">{example.step1}</span>
                                    <span className="text-gray-800">=</span>
                                    <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">10</span>
                                  </div>
                                </div>

                                {/* Étape 2 - visible dès step2 */}
                                {(currentStep === 'step2' || currentStep === 'result') && (
                                  <div className={`p-4 rounded-lg transition-all ${
                                    currentStep === 'step2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                                  }`}>
                                    <div className="flex justify-center items-center space-x-4 text-xl">
                                      <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">10</span>
                                      <span className="text-gray-800">-</span>
                                      <span className="bg-blue-200 px-3 py-1 rounded text-gray-800">{example.step2}</span>
                                      <span className="text-gray-800">=</span>
                                      <span className={`px-3 py-1 rounded text-gray-800 ${
                                        currentStep === 'result' ? 'bg-green-200 animate-pulse' : 'bg-gray-200'
                                      }`}>
                                        {currentStep === 'result' ? example.result : '?'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {example.strategy === 'decomposition' && (
                        <div className="space-y-4">
                          {(animatingStep === 'decomposition-step1' || animatingStep === 'decomposition-step2' || animatingStep === 'decomposition-result') && (
                            <div className="text-center space-y-6">
                              <p className="text-lg font-semibold text-gray-800">Décomposition intelligente :</p>
                              
                              {/* Visualisation avec boules */}
                              <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg">
                                <h4 className="text-lg font-bold text-gray-800 mb-4">🟡 Les {example.start} boules :</h4>
                                <div className="grid grid-cols-6 gap-2 justify-items-center max-w-2xl mx-auto mb-4">
                                  {Array.from({ length: example.start }, (_, i) => (
                                    <div
                                      key={i}
                                      className={`text-3xl transition-all duration-1000 ${
                                        i < removedObjectsCount 
                                          ? 'opacity-30 scale-75 transform rotate-12' 
                                          : 'opacity-100 scale-100'
                                      }`}
                                    >
                                      🟡
                                    </div>
                                  ))}
                                </div>
                                <p className="text-center text-gray-700 font-medium">
                                  {currentStep === 'step1' && `J'enlève 10 boules d'un coup`}
                                  {currentStep === 'step2' && `J'ai enlevé 10, mais je n'en voulais que ${example.remove}`}
                                  {currentStep === 'result' && `Je remets 1 boule ! Il reste ${example.result} boules !`}
                                </p>
                              </div>

                              {/* Toutes les étapes de calcul restent visibles */}
                              <div className="space-y-4">
                                {/* Étape 1 - toujours visible */}
                                <div className={`p-4 rounded-lg transition-all ${
                                  currentStep === 'step1' ? 'bg-red-100 ring-2 ring-red-400' : 'bg-gray-50'
                                }`}>
                                  <div className="flex justify-center items-center space-x-4 text-xl">
                                    <span className="text-gray-800">{example.start}</span>
                                    <span className="text-gray-800">-</span>
                                    <span className="bg-red-200 px-3 py-1 rounded text-gray-800">10</span>
                                    <span className="text-gray-800">=</span>
                                    <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">{example.start - 10}</span>
                                  </div>
                                </div>
                                
                                {/* Étape 2 - visible dès step2 */}
                                {(currentStep === 'step2' || currentStep === 'result') && (
                                  <div className={`p-4 rounded-lg transition-all ${
                                    currentStep === 'step2' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                                  }`}>
                                    <div className="flex justify-center items-center space-x-4 text-xl">
                                      <span className="bg-yellow-200 px-3 py-1 rounded text-gray-800">{example.start - 10}</span>
                                      <span className="text-gray-800">+</span>
                                      <span className="bg-green-200 px-3 py-1 rounded text-gray-800">1</span>
                                      <span className="text-gray-800">=</span>
                                      <span className={`px-3 py-1 rounded text-gray-800 ${
                                        currentStep === 'result' ? 'bg-green-200 animate-pulse' : 'bg-gray-200'
                                      }`}>
                                        {currentStep === 'result' ? example.result : '?'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}



                      {/* Résultat final */}
                      {animatingStep === 'final-result' && (
                        <div className="text-center p-6 bg-green-100 rounded-lg">
                          <p className="text-3xl font-bold text-green-800">
                            {example.operation} = {example.result}
                          </p>
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
                <div className="text-lg font-semibold text-orange-600">
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
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <p className="text-lg mb-2">{exercises[currentExercise].story}</p>
                    <div className="text-2xl font-mono font-bold">{exercises[currentExercise].operation} = ?</div>
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
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
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
                        <span className="font-bold">
                          {isCorrect ? 'Bravo ! Bonne réponse !' : `Pas tout à fait... La réponse était ${exercises[currentExercise].answer}`}
                        </span>
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
                  <div className="text-2xl font-bold text-orange-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
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