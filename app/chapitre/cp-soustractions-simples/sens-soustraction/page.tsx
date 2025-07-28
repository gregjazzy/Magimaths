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
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des exemples de soustraction avec animations
  const subtractionExamples = [
    {
      id: 'ballons',
      title: 'Les ballons qui s\'envolent',
      story: 'Emma a 7 ballons. 3 ballons s\'envolent. Combien lui reste-t-il de ballons ?',
      start: 7,
      removed: 3,
      result: 4,
      item: '🎈',
      action: 's\'envolent',
      color: 'text-blue-500'
    },
    {
      id: 'pommes',
      title: 'Les pommes mangées',
      story: 'Dans le panier, il y a 6 pommes. Paul en mange 2. Combien reste-t-il de pommes ?',
      start: 6,
      removed: 2,
      result: 4,
      item: '🍎',
      action: 'sont mangées',
      color: 'text-red-500'
    },
    {
      id: 'voitures',
      title: 'Les voitures qui partent',
      story: 'Sur le parking, il y a 8 voitures. 5 voitures partent. Combien reste-t-il de voitures ?',
      start: 8,
      removed: 5,
      result: 3,
      item: '🚗',
      action: 'partent',
      color: 'text-yellow-500'
    }
  ];

  // Exercices pour les élèves
  const exercises = [
    {
      story: 'Lisa a 9 crayons. Elle en donne 3 à son amie. Combien lui reste-t-il de crayons ?',
      answer: 6,
      visual: '✏️'
    },
    {
      story: 'Dans l\'aquarium, il y a 10 poissons. 4 poissons sont pêchés. Combien reste-t-il de poissons ?',
      answer: 6,
      visual: '🐠'
    },
    {
      story: 'Tom collectionne 12 cartes. Il en perd 5. Combien de cartes lui reste-t-il ?',
      answer: 7,
      visual: '🃏'
    },
    {
      story: 'Dans le jardin, il y a 15 fleurs. 8 fleurs sont cueillies. Combien de fleurs restent-elles ?',
      answer: 7,
      visual: '🌸'
    },
    {
      story: 'Marie a 11 bonbons. Elle en mange 4. Combien lui reste-t-il de bonbons ?',
      answer: 7,
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

      // Explication du concept
      setHighlightedElement('concept');
      scrollToSection('concept-section');
      await playAudio("Soustraire, ça veut dire enlever, retirer, ou faire partir quelque chose ! Regardons ensemble comment ça marche.");
      await wait(500);

      if (stopSignalRef.current) return;

      // Animation du concept principal
      setAnimatingStep('demo-start');
      scrollToSection('concept-section');
      await playAudio("Imagine : j'ai 5 ballons colorés.", true);
      await wait(1000);
      
      if (stopSignalRef.current) return;

      setAnimatingStep('demo-remove');
      scrollToSection('concept-section');
      await playAudio("Puis, 2 ballons s'envolent dans le ciel !", true);
      await wait(1500);
      
      if (stopSignalRef.current) return;

      setAnimatingStep('demo-result');
      scrollToSection('concept-section');
      await playAudio("Combien me reste-t-il de ballons ? Il me reste 3 ballons ! Car 5 moins 2 égale 3 ! Tu peux aussi utiliser tes doigts pour vérifier : lève 5 doigts, baisse-en 2, et compte ceux qui restent !", true);
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
        className={`text-3xl ${colorClass} transition-all duration-1000 transform ${
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
              ➖ Le sens de la soustraction
          </h1>
            <p className="text-lg text-gray-600">
              Apprendre à enlever et à comprendre le signe moins
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
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-purple-400 animate-pulse' : ''}`}
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
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-purple-600 hover:bg-purple-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-purple-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* Section Cours */
          <div className="space-y-8">
            {/* Bouton COMMENCER/RECOMMENCER */}
            <div className="text-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'animate-pulse hover:animate-none'
                }`}
              >
                {isPlayingVocal ? '🎤 JE PARLE...' : (hasStarted ? '🔄 RECOMMENCER !' : '▶️ COMMENCER !')}
              </button>
              <p className="text-sm text-gray-600 mt-2">
                {isPlayingVocal ? 'Écoute bien l\'explication...' : (hasStarted ? 'Clique pour réécouter l\'explication complète' : 'Clique ici pour débuter l\'explication interactive')}
              </p>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Book className="w-6 h-6 text-purple-600" />
              </div>
                <h2 className="text-2xl font-bold text-gray-800">Qu'est-ce que la soustraction ?</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                La soustraction, c'est quand on enlève, on retire, ou on fait partir quelque chose. 
                C'est l'inverse de l'addition : au lieu d'ajouter, on retire !
              </p>
            </div>

            {/* Le signe moins */}
            <div 
              id="minus-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'minus-sign' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-md">
                  <Minus className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Le signe moins ( - )
                </h2>
              </div>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-pink-200 rounded-3xl blur-sm opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-red-50 via-white to-pink-50 p-12 rounded-3xl border-2 border-red-100 shadow-xl">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
                        <span className="text-6xl font-bold text-white">-</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        🎯 Le symbole magique de la soustraction !
                      </h3>
                      
                      <div className="bg-white/80 rounded-xl p-4 border border-red-100">
                        <p className="text-lg text-gray-700 leading-relaxed">
                          Ce petit trait horizontal nous dit : <br/>
                          <span className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full">
                            <span className="text-xl">✨</span>
                            <span className="font-bold text-red-600">« Enlève-moi quelque chose ! »</span>
                            <span className="text-xl">✨</span>
                          </span>
                        </p>
                      </div>
                      
                      <div className="flex justify-center gap-4 mt-6">
                        <div className="bg-red-100 px-4 py-2 rounded-full">
                          <span className="text-red-700 font-semibold">👋 Enlever</span>
                        </div>
                        <div className="bg-pink-100 px-4 py-2 rounded-full">
                          <span className="text-pink-700 font-semibold">🚀 Retirer</span>
                        </div>
                        <div className="bg-orange-100 px-4 py-2 rounded-full">
                          <span className="text-orange-700 font-semibold">💨 Faire partir</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept principal avec animation */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'concept' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-md">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Comment ça marche ?
                </h2>
              </div>

              {/* Animation de démonstration */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur-sm opacity-50"></div>
                <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-8 border-2 border-blue-100 shadow-xl">
                  <div className="text-center space-y-8">
                    {/* Étape de départ */}
                    {(animatingStep === 'demo-start' || animatingStep === 'demo-remove' || animatingStep === 'demo-result') && (
                      <div className="bg-white/80 rounded-xl p-6 border border-blue-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                          <span className="text-2xl">🎭</span>
                          Démonstration magique
                          <span className="text-2xl">✨</span>
                        </h3>
                        <p className="text-lg font-semibold mb-6 text-gray-700">J'ai 5 beaux ballons colorés :</p>
                        <div className="flex justify-center gap-4 mb-6">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`relative transform transition-all duration-1000 ${
                                (animatingStep === 'demo-remove' || animatingStep === 'demo-result') && i < 2 
                                  ? 'opacity-70 scale-75 -translate-y-8 rotate-12' 
                                  : 'opacity-100 scale-100 hover:scale-110'
                              }`}
                            >
                              <div className="text-5xl filter drop-shadow-lg">🎈</div>
                              {(animatingStep === 'demo-remove' || animatingStep === 'demo-result') && i < 2 && (
                                <div className="absolute -top-2 -right-2 text-xl animate-pulse">💨</div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Compter sur ses doigts */}
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-200 shadow-lg">
                          <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                            ✋ Compter sur ses doigts :
                          </h3>
                          <div className="flex justify-center gap-2 mb-4">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`transform transition-all duration-1000 ${
                                  (animatingStep === 'demo-remove' || animatingStep === 'demo-result') && i < 2 
                                    ? 'opacity-50 scale-75 -translate-y-2' 
                                    : 'opacity-100 scale-100'
                                }`}
                              >
                                <div className="text-4xl">
                                  {(animatingStep === 'demo-remove' || animatingStep === 'demo-result') && i < 2 ? '👇' : '👆'}
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-center text-amber-700 font-medium">
                            {animatingStep === 'demo-remove' || animatingStep === 'demo-result' 
                              ? "J'avais 5 doigts levés, j'en baisse 2, il m'en reste 3 !" 
                              : "5 doigts levés"
                            }
                          </p>
                          <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                            <p className="text-center text-amber-800 font-bold text-sm flex items-center justify-center gap-2">
                              <span className="text-lg">🖐️</span>
                              Toi aussi, utilise tes mains pour compter !
                              <span className="text-lg">🖐️</span>
                            </p>
                            <p className="text-center text-amber-700 text-xs mt-1">
                              Lève 5 doigts, baisse-en 2, compte ceux qui restent !
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action d'enlever */}
                    {animatingStep === 'demo-remove' && (
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl border-2 border-yellow-200 shadow-lg">
                        <p className="text-xl font-bold text-orange-800 flex items-center justify-center gap-2">
                          <span className="text-2xl">💨</span>
                          2 ballons s'envolent dans le ciel !
                          <span className="text-2xl">🌤️</span>
                        </p>
                      </div>
                    )}

                    {/* Résultat */}
                    {animatingStep === 'demo-result' && (
                      <div className="space-y-6">
                        <div className="bg-white/80 rounded-xl p-6 border border-green-200">
                          <p className="text-lg font-semibold mb-6 text-gray-700">Il me reste 3 magnifiques ballons :</p>
                          <div className="flex justify-center gap-4 mb-6">
                            {Array.from({ length: 3 }, (_, i) => (
                              <div key={i} className="text-5xl animate-bounce filter drop-shadow-lg" style={{animationDelay: `${i * 0.2}s`}}>
                                🎈
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-xl border-2 border-green-200 shadow-lg">
                          <h3 className="text-lg font-semibold text-green-800 mb-4">🎯 Le calcul magique :</h3>
                          <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-md">
                            <span className="text-3xl font-bold text-blue-600">5</span>
                            <span className="text-3xl font-bold text-red-600">-</span>
                            <span className="text-3xl font-bold text-orange-600">2</span>
                            <span className="text-3xl font-bold text-gray-600">=</span>
                            <span className="text-3xl font-bold text-green-600">3</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
                  </div>

            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 Choisis un exemple pour voir l'animation !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subtractionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 transition-all duration-300 ${
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
                      <div className="text-4xl mb-2">{example.item}</div>
                      <h3 className={`font-bold text-lg mb-2 ${isPlayingVocal ? 'text-gray-400' : 'text-gray-800'}`}>{example.title}</h3>
                      <p className={`text-sm mb-4 ${isPlayingVocal ? 'text-gray-400' : 'text-gray-600'}`}>{example.story}</p>
                      <button 
                        disabled={isPlayingVocal}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
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
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎬 Animation de la soustraction
                </h2>
                
                {(() => {
                  const example = subtractionExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Histoire */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'story' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <p className="text-lg font-semibold text-gray-800">{example.story}</p>
                      </div>

                      {/* Animation des objets */}
                      <div className="flex flex-col items-center space-y-6">
                        {/* Situation de départ */}
                        {(animatingStep === 'start' || animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && (
                          <div className={`p-6 rounded-lg ${animatingStep === 'start' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'}`}>
                            <div className="text-center mb-4">
                              <p className="text-lg font-semibold text-gray-800">Au début : {example.start}</p>
                            </div>
                            <div className="grid grid-cols-4 gap-3 justify-items-center">
                              {Array.from({ length: example.start }, (_, i) => (
                                <div
                                  key={i}
                                  className={`text-3xl ${example.color} transition-all duration-1000 ${
                                    (animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && i < example.removed ? 'opacity-70 scale-75 animate-pulse' : 'opacity-100'
                                  }`}
                                >
                                  {example.item}
                                </div>
                              ))}
                            </div>

                            {/* Compter sur ses doigts */}
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200 mt-4">
                              <h4 className="text-md font-bold text-amber-800 mb-3 flex items-center gap-2">
                                ✋ Sur mes doigts :
                              </h4>
                              <div className="flex justify-center gap-1 mb-3 flex-wrap">
                                {Array.from({ length: Math.min(example.start, 10) }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`transform transition-all duration-1000 ${
                                      (animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && i < example.removed 
                                        ? 'opacity-50 scale-75 -translate-y-1' 
                                        : 'opacity-100 scale-100'
                                    }`}
                                  >
                                    <div className="text-2xl">
                                      {(animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation') && i < example.removed ? '👇' : '👆'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <p className="text-center text-amber-700 text-sm font-medium">
                                {(animatingStep === 'removing' || animatingStep === 'result' || animatingStep === 'calculation')
                                  ? `${example.start} doigts → j'en baisse ${example.removed} → il reste ${example.start - example.removed} !`
                                  : `${example.start} doigts levés`
                                }
                              </p>
                              <div className="mt-3 p-2 bg-amber-100 rounded-lg border border-amber-300">
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
                          <div className="p-4 bg-yellow-100 rounded-lg">
                            <p className="text-lg font-semibold text-center text-gray-800">
                              {example.removed} {example.action} ! 💨
                            </p>
                          </div>
                        )}

                        {/* Résultat */}
                        {(animatingStep === 'result' || animatingStep === 'calculation') && (
                          <div className={`p-6 rounded-lg ${animatingStep === 'result' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'}`}>
                            <div className="text-center mb-4">
                              <p className="text-lg font-semibold text-gray-800">Il reste : {example.result}</p>
                            </div>
                            <div className="flex justify-center gap-3">
                              {Array.from({ length: example.result }, (_, i) => (
                                <div key={i} className={`text-3xl ${example.color} animate-bounce`}>
                                  {example.item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Calcul écrit */}
                        {animatingStep === 'calculation' && (
                          <div className="p-6 bg-purple-100 rounded-lg">
                            <p className="text-3xl font-bold text-center text-purple-800">
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
        ) : (
          /* Section Exercices */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="text-lg font-semibold text-purple-600">
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
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-lg text-center">{exercises[currentExercise].story}</p>
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
                        disabled={!userAnswer || isPlayingVocal}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
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
                            disabled={isPlayingVocal}
                            className={`px-4 py-2 rounded-lg font-semibold mt-2 transition-colors ${
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
                <div className="text-center space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Exercices terminés !
                  </h2>
                  <div className="text-2xl font-bold text-purple-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      disabled={isPlayingVocal}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
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
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
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