'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star, Minus, ChevronDown } from 'lucide-react';

export default function SoustractionsJusqu10() {
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
      id: 'counting',
      title: 'Compter à rebours',
      operation: '8 - 3',
      start: 8,
      remove: 3,
      result: 5,
      strategy: 'counting',
      explanation: 'On part de 8 et on compte 3 en arrière : 7, 6, 5 !',
      item: '🔢',
      color: 'text-blue-500'
    },
    {
      id: 'visual',
      title: 'Avec des objets',
      operation: '7 - 4',
      start: 7,
      remove: 4,
      result: 3,
      strategy: 'visual',
      explanation: 'On a 7 étoiles, on en enlève 4, il en reste 3 !',
      item: '⭐',
      color: 'text-yellow-500'
    },
    {
      id: 'fingers',
      title: 'Fait avec tes doigts',
      operation: '10 - 6',
      start: 10,
      remove: 6,
      result: 4,
      strategy: 'fingers',
      explanation: 'Lève 10 doigts, baisse-en 6, compte ceux qui restent : 4 !',
      item: '🖐️',
      color: 'text-purple-500'
    }
  ];

  // Exercices pour les élèves
  const exercises = [
    {
      operation: '5 - 2',
      answer: 3,
      visual: '🍎',
      story: 'Il y a 5 pommes. On en mange 2.'
    },
    {
      operation: '9 - 4',
      answer: 5,
      visual: '🚗',
      story: 'Il y a 9 voitures. 4 partent.'
    },
    {
      operation: '7 - 3',
      answer: 4,
      visual: '🎈',
      story: 'Il y a 7 ballons. 3 s\'envolent.'
    },
    {
      operation: '10 - 7',
      answer: 3,
      visual: '⚽',
      story: 'Il y a 10 ballons. 7 roulent.'
    },
    {
      operation: '6 - 5',
      answer: 1,
      visual: '🌺',
      story: 'Il y a 6 fleurs. 5 fanent.'
    },
    {
      operation: '8 - 6',
      answer: 2,
      visual: '🍬',
      story: 'Il y a 8 bonbons. 6 sont mangés.'
    },
    {
      operation: '10 - 3',
      answer: 7,
      visual: '🐦',
      story: 'Il y a 10 oiseaux. 3 s\'envolent.'
    },
    {
      operation: '4 - 1',
      answer: 3,
      visual: '📚',
      story: 'Il y a 4 livres. 1 est pris.'
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à faire des soustractions jusqu'à 10. C'est très amusant et pas compliqué !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Les stratégies
      setHighlightedElement('strategies');
      scrollToSection('strategies-section');
      await playAudio("Il y a plusieurs façons de faire une soustraction. Je vais te montrer les meilleures techniques !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Démonstration rapide
      setAnimatingStep('demo');
      setHighlightedElement('demo');
      scrollToSection('demo-section');
      await playAudio("Par exemple, pour 6 moins 2 : je peux compter à rebours 6, 5, 4. La réponse est 4 !");
      await wait(1000);

      if (stopSignalRef.current) return;

      // Transition vers les exemples
      setHighlightedElement('examples');
      scrollToSection('examples-section');
      await playAudio("Maintenant, choisis une stratégie pour voir comment elle fonctionne avec une animation !");
      await wait(500);

    } finally {
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

      // Présentation de l'exemple
      setHighlightedElement('example-title');
      await playAudio(`Regardons la méthode : ${example.title} avec ${example.operation} !`, true);
      await wait(800);

      if (stopSignalRef.current) return;

      // Explication de la stratégie
      setAnimatingStep('strategy-explanation');
      await playAudio(example.explanation, true);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Animation selon la stratégie
      if (example.strategy === 'counting') {
        await animateCountingStrategy(example);
      } else if (example.strategy === 'visual') {
        await animateVisualStrategy(example);
      } else if (example.strategy === 'fingers') {
        await animateFingersStrategy(example);
      }

      // Résultat final
      setAnimatingStep('final-result');
      await playAudio(`Donc ${example.operation} égale ${example.result} ! Bravo !`, true);
      await wait(1000);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
    }
  };

  // Animation pour la stratégie de comptage
  const animateCountingStrategy = async (example: any) => {
    setAnimatingStep('counting-start');
    await playAudio(`On part de ${example.start}`, true);
    await wait(800);

    if (stopSignalRef.current) return;

    setAnimatingStep('counting-down');
    for (let i = 1; i <= example.remove; i++) {
      const currentNumber = example.start - i;
      await playAudio(`${currentNumber}`, true);
      await wait(600);
      if (stopSignalRef.current) return;
    }

    setAnimatingStep('counting-result');
    await playAudio(`On arrive à ${example.result} !`, true);
    await wait(500);
  };

  // Animation pour la stratégie visuelle
  const animateVisualStrategy = async (example: any) => {
    setAnimatingStep('visual-start');
    await playAudio(`Voici ${example.start} objets`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    setAnimatingStep('visual-removing');
    await playAudio(`On en enlève ${example.remove}`, true);
    await wait(2000);

    if (stopSignalRef.current) return;

    setAnimatingStep('visual-result');
    await playAudio(`Il en reste ${example.result} !`, true);
    await wait(500);
  };

  // Animation pour la stratégie avec les doigts
  const animateFingersStrategy = async (example: any) => {
    setAnimatingStep('fingers-start');
    await playAudio(`Lève ${example.start} doigts !`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    setAnimatingStep('fingers-remove');
    await playAudio(`Maintenant, baisse ${example.remove} doigts !`, true);
    await wait(1500);

    if (stopSignalRef.current) return;

    setAnimatingStep('fingers-count');
    await playAudio(`Compte ceux qui restent levés : ${example.result} doigts !`, true);
    await wait(1000);
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
  const renderObjects = (count: number, item: string, colorClass: string, fadeOut = 0) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`text-3xl ${colorClass} transition-all duration-1000 transform ${
          i < fadeOut ? 'opacity-30 scale-75' : 'opacity-100 scale-100'
        } ${
          animatingStep === 'visual-start' || animatingStep === 'visual-removing' ? 'animate-bounce' : ''
        }`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {item}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
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
              🔢 Soustractions jusqu'à 10
            </h1>
            <p className="text-lg text-gray-600">
              Apprendre les meilleures techniques pour soustraire
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
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
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
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* Section Cours */
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            {!hasStarted && (
              <div className="text-center mb-8">
                <button
                  onClick={explainChapter}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-pulse"
                >
                  ▶️ COMMENCER !
                </button>
              </div>
            )}

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Book className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Les soustractions jusqu'à 10</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Quand on soustrait des nombres jusqu'à 10, on peut utiliser plusieurs techniques très pratiques ! 
                Chacune a ses avantages selon la situation.
              </p>
            </div>

            {/* Les stratégies */}
            <div 
              id="strategies-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'strategies' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Nos techniques magiques</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🔢</div>
                  <h4 className="font-bold text-blue-800">Compter à rebours</h4>
                  <p className="text-sm text-blue-600">7, 6, 5... plus facile !</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h4 className="font-bold text-yellow-800">Avec des objets</h4>
                  <p className="text-sm text-yellow-600">On voit ce qu'on enlève</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🖐️</div>
                  <h4 className="font-bold text-purple-800">Fait avec tes doigts</h4>
                  <p className="text-sm text-purple-600">Lève, baisse, compte !</p>
                </div>
              </div>
            </div>

            {/* Démonstration rapide */}
            <div 
              id="demo-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'demo' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎬 Petit exemple : 6 - 2
              </h2>

              {animatingStep === 'demo' && (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <p className="text-lg font-semibold">Je compte à rebours depuis 6 :</p>
                    <div className="flex justify-center space-x-4 text-2xl">
                      <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">6</span>
                      <ChevronDown className="w-6 h-6 mt-2" />
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">5</span>
                      <ChevronDown className="w-6 h-6 mt-2" />
                      <span className="bg-green-100 text-green-800 px-3 py-2 rounded-lg animate-pulse">4</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">6 - 2 = 4 !</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 Choisis ta technique préférée !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subtractionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      currentExample === index ? 'ring-4 ring-green-400 bg-green-100' : ''
                    }`}
                    onClick={() => explainSpecificExample(index)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{example.item}</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{example.title}</h3>
                      <div className="text-xl font-mono bg-white px-3 py-1 rounded mb-3">{example.operation}</div>
                      <p className="text-sm text-gray-600 mb-4">{example.explanation}</p>
                      <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors">
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
                  🎬 Animation de la technique
                </h2>
                
                {(() => {
                  const example = subtractionExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Titre de l'exemple */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'example-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <h3 className="text-xl font-bold">{example.title}</h3>
                        <div className="text-2xl font-mono mt-2">{example.operation}</div>
                      </div>

                      {/* Animation selon la stratégie */}
                      {example.strategy === 'counting' && (
                        <div className="space-y-4">
                          {(animatingStep === 'counting-start' || animatingStep === 'counting-down' || animatingStep === 'counting-result') && (
                            <div className="text-center">
                              <p className="text-lg mb-4">Comptons à rebours depuis {example.start} :</p>
                              <div className="flex justify-center space-x-3">
                                {Array.from({ length: example.start + 1 }, (_, i) => {
                                  const num = example.start - i;
                                  const isActive = animatingStep === 'counting-down' || animatingStep === 'counting-result';
                                  const isResult = num === example.result && animatingStep === 'counting-result';
                                  return (
                                    <div
                                      key={num}
                                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                                        isResult ? 'bg-green-200 ring-4 ring-green-400 animate-pulse text-green-800' :
                                        isActive && num > example.result ? 'bg-gray-200 text-gray-800' :
                                        'bg-blue-100 text-blue-800'
                                      }`}
                                    >
                                      {num}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {example.strategy === 'visual' && (
                        <div className="space-y-4">
                          {(animatingStep === 'visual-start' || animatingStep === 'visual-removing' || animatingStep === 'visual-result') && (
                            <div className="text-center">
                              <p className="text-lg mb-4">Objets à compter :</p>
                              <div className="grid grid-cols-5 gap-3 justify-items-center max-w-md mx-auto">
                                {renderObjects(
                                  example.start, 
                                  example.item, 
                                  example.color,
                                  animatingStep === 'visual-removing' || animatingStep === 'visual-result' ? example.remove : 0
                                )}
                              </div>
                              {animatingStep === 'visual-result' && (
                                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                                  <p className="text-xl font-bold text-green-800">Reste : {example.result}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {example.strategy === 'fingers' && (
                        <div className="space-y-4">
                          {(animatingStep === 'fingers-start' || animatingStep === 'fingers-remove' || animatingStep === 'fingers-count') && (
                            <div className="text-center">
                              <div className="bg-purple-50 p-6 rounded-lg">
                                <p className="text-lg mb-4">Utilise tes doigts :</p>
                                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                                  {Array.from({ length: example.start }, (_, i) => (
                                    <div
                                      key={i}
                                      className={`transform transition-all duration-1000 ${
                                        (animatingStep === 'fingers-remove' || animatingStep === 'fingers-count') && i < example.remove
                                          ? 'opacity-50 scale-75 -translate-y-2' 
                                          : 'opacity-100 scale-100'
                                      }`}
                                    >
                                      <div className="text-3xl">
                                        {(animatingStep === 'fingers-remove' || animatingStep === 'fingers-count') && i < example.remove ? '👇' : '👆'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                                  <p className="text-center text-amber-800 font-bold text-sm">
                                    {animatingStep === 'fingers-start' && 'Lève tes 10 doigts !'}
                                    {animatingStep === 'fingers-remove' && `Baisse ${example.remove} doigts !`}
                                    {animatingStep === 'fingers-count' && `Il reste ${example.result} doigts levés !`}
                                  </p>
                                </div>
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
                <div className="text-lg font-semibold text-green-600">
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
                  <div className="p-4 bg-green-50 rounded-lg text-center">
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
                        className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
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
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 mt-2"
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
                  <div className="text-2xl font-bold text-green-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
                    >
                      Recommencer
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