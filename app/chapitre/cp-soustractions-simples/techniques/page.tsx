'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star, Minus, ChevronDown, Lightbulb } from 'lucide-react';

export default function TechniquesCalculSoustraction() {
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
  const [showHint, setShowHint] = useState(false);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des techniques de soustraction avec animations
  const techniqueExamples = [
    {
      id: 'complement',
      title: 'Complément à 10',
      operation: '13 - 9',
      start: 13,
      remove: 9,
      result: 4,
      technique: 'complement',
      explanation: 'Pour enlever 9, je pense : 9 + ? = 13. Donc 9 + 4 = 13 !',
      item: '🎯',
      color: 'text-blue-500',
      steps: [
        { step: 1, text: '13 - 9 = ?', visual: 'Quel nombre ajouter à 9 pour faire 13 ?' },
        { step: 2, text: '9 + ? = 13', visual: 'Je cherche le complément' },
        { step: 3, text: '9 + 4 = 13', visual: 'Donc 13 - 9 = 4 !' }
      ]
    },
    {
      id: 'addition',
      title: 'Addition à trous',
      operation: '15 - 7',
      start: 15,
      remove: 7,
      result: 8,
      technique: 'addition',
      explanation: 'Au lieu de soustraire 7, je cherche 7 + ? = 15. C\'est 8 !',
      item: '🔍',
      color: 'text-green-500',
      steps: [
        { step: 1, text: '15 - 7 = ?', visual: 'Transformons en addition' },
        { step: 2, text: '7 + ? = 15', visual: 'Que faut-il ajouter à 7 ?' },
        { step: 3, text: '7 + 8 = 15', visual: 'Donc 15 - 7 = 8 !' }
      ]
    },
    {
      id: 'decomposition',
      title: 'Décomposition',
      operation: '14 - 6',
      start: 14,
      remove: 6,
      result: 8,
      technique: 'decomposition',
      explanation: 'Je décompose 6 en 4 + 2, puis 14 - 4 = 10, et 10 - 2 = 8 !',
      item: '🧩',
      color: 'text-purple-500',
      steps: [
        { step: 1, text: '14 - 6 = ?', visual: 'Décomposons 6 en 4 + 2' },
        { step: 2, text: '14 - 4 = 10', visual: 'D\'abord, on enlève 4' },
        { step: 3, text: '10 - 2 = 8', visual: 'Puis on enlève les 2 qui restent' }
      ]
    },
    {
      id: 'proximite',
      title: 'Nombre proche',
      operation: '16 - 8',
      start: 16,
      remove: 8,
      result: 8,
      technique: 'proximite',
      explanation: 'Je sais que 8 + 8 = 16, donc 16 - 8 = 8. C\'est un double !',
      item: '👯',
      color: 'text-orange-500',
      steps: [
        { step: 1, text: '16 - 8 = ?', visual: 'Je reconnais un double !' },
        { step: 2, text: '8 + 8 = 16', visual: 'Je connais cette addition' },
        { step: 3, text: '16 ÷ 2 = 8', visual: 'La moitié de 16 est 8 !' }
      ]
    },
    {
      id: 'cassage',
      title: 'Casser la dizaine',
      operation: '12 - 5',
      start: 12,
      remove: 5,
      result: 7,
      technique: 'cassage',
      explanation: 'Je décompose 12 en 10 + 2, puis 10 - 5 = 5, et 5 + 2 = 7 !',
      item: '💥',
      color: 'text-red-500',
      steps: [
        { step: 1, text: '12 - 5 = ?', visual: 'Cassons la dizaine : 12 = 10 + 2' },
        { step: 2, text: '10 - 5 = 5', visual: 'On enlève 5 de la dizaine' },
        { step: 3, text: '5 + 2 = 7', visual: 'On ajoute les 2 unités restantes' }
      ]
    }
  ];

  // Exercices pour les élèves
  const exercises = [
    {
      operation: '11 - 7',
      answer: 4,
      technique: 'complément',
      hint: '7 + ? = 11',
      visual: '🎯',
      story: 'Utilise le complément à 11 !'
    },
    {
      operation: '14 - 8',
      answer: 6,
      technique: 'addition',
      hint: '8 + ? = 14',
      visual: '🔍',
      story: 'Transforme en addition à trous !'
    },
    {
      operation: '15 - 6',
      answer: 9,
      technique: 'décomposition',
      hint: '15 - 5 - 1 = ?',
      visual: '🧩',
      story: 'Décompose 6 en 5 + 1 !'
    },
    {
      operation: '18 - 9',
      answer: 9,
      technique: 'proximité',
      hint: '9 + 9 = 18',
      visual: '👯',
      story: 'C\'est un double !'
    },
    {
      operation: '13 - 4',
      answer: 9,
      technique: 'cassage',
      hint: '13 = 10 + 3',
      visual: '💥',
      story: 'Casse la dizaine !'
    },
    {
      operation: '12 - 8',
      answer: 4,
      technique: 'complément',
      hint: '8 + ? = 12',
      visual: '🎯',
      story: 'Cherche le complément !'
    },
    {
      operation: '17 - 9',
      answer: 8,
      technique: 'addition',
      hint: '9 + ? = 17',
      visual: '🔍',
      story: 'Addition à trous !'
    },
    {
      operation: '16 - 7',
      answer: 9,
      technique: 'décomposition',
      hint: '16 - 6 - 1 = ?',
      visual: '🧩',
      story: 'Décompose 7 !'
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
      await playAudio("Bonjour ! Aujourd'hui, je vais te révéler les techniques secrètes des champions de soustraction !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Les techniques
      setHighlightedElement('techniques');
      scrollToSection('techniques-section');
      await playAudio("Il y a 5 techniques magiques que tous les mathématiciens utilisent ! Chacune a ses super-pouvoirs !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Démonstration
      setAnimatingStep('demo');
      setHighlightedElement('demo');
      scrollToSection('demo-section');
      await playAudio("Par exemple, pour 13 moins 9, au lieu de compter, je pense : 9 plus quoi égale 13 ? C'est 4 !");
      await wait(1500);

      if (stopSignalRef.current) return;

      // Transition vers les exemples
      setHighlightedElement('examples');
      scrollToSection('examples-section');
      await playAudio("Découvre ces 5 techniques de génie avec des animations détaillées ! Tu vas devenir un super calculateur !");
      await wait(500);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer une technique spécifique
  const explainSpecificTechnique = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const technique = techniqueExamples[index];
    setCurrentExample(index);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Présentation de la technique
      setHighlightedElement('technique-title');
      await playAudio(`Découvrons la technique : ${technique.title} avec ${technique.operation} !`);
      await wait(800);

      if (stopSignalRef.current) return;

      // Explication générale de la technique
      setAnimatingStep('technique-explanation');
      await playAudio(technique.explanation);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Animation des étapes
      for (let i = 0; i < technique.steps.length; i++) {
        if (stopSignalRef.current) return;
        
        const step = technique.steps[i];
        setAnimatingStep(`step-${step.step}`);
        await playAudio(step.visual);
        await wait(1500);
      }

      // Résultat final
      setAnimatingStep('final-result');
      await playAudio(`Excellent ! Avec la technique ${technique.title}, ${technique.operation} égale ${technique.result} ! Cette méthode est très efficace !`);
      await wait(1000);

    } finally {
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
      setShowHint(false);
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
    setShowHint(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
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
              🎯 Techniques de soustraction
            </h1>
            <p className="text-lg text-gray-600">
              Les méthodes secrètes des champions du calcul mental
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
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
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
            {/* Bouton COMMENCER */}
            {!hasStarted && (
              <div className="text-center mb-8">
                <button
                  onClick={explainChapter}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-pulse"
                >
                  ▶️ COMMENCER !
                </button>
              </div>
            )}

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Les techniques secrètes</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Les mathématiciens ont découvert des techniques magiques pour calculer plus vite ! 
                Au lieu de compter sur ses doigts, on utilise des astuces intelligentes.
              </p>
            </div>

            {/* Les techniques */}
            <div 
              id="techniques-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'techniques' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Les 5 techniques de génie</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold text-blue-800 text-sm">Complément</h4>
                  <p className="text-xs text-blue-600">9 + ? = 13</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <h4 className="font-bold text-green-800 text-sm">Addition à trous</h4>
                  <p className="text-xs text-green-600">7 + ? = 15</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🧩</div>
                  <h4 className="font-bold text-purple-800 text-sm">Décomposition</h4>
                  <p className="text-xs text-purple-600">6 = 4 + 2</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">👯</div>
                  <h4 className="font-bold text-orange-800 text-sm">Nombre proche</h4>
                  <p className="text-xs text-orange-600">8 + 8 = 16</p>
                </div>

                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">💥</div>
                  <h4 className="font-bold text-red-800 text-sm">Casser dizaine</h4>
                  <p className="text-xs text-red-600">12 = 10 + 2</p>
                </div>
              </div>
            </div>

            {/* Démonstration */}
            <div 
              id="demo-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'demo' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎬 Exemple magique : 13 - 9
              </h2>

              {animatingStep === 'demo' && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <p className="text-lg font-semibold">Technique du complément :</p>
                    <div className="flex justify-center items-center space-x-4 text-xl">
                      <span className="bg-red-100 px-4 py-2 rounded-lg">13 - 9</span>
                      <span>=</span>
                      <span className="bg-yellow-100 px-4 py-2 rounded-lg">?</span>
                    </div>
                    <div className="flex justify-center items-center space-x-4 text-xl">
                      <span className="bg-blue-100 px-4 py-2 rounded-lg">9 + ?</span>
                      <span>=</span>
                      <span className="bg-yellow-100 px-4 py-2 rounded-lg">13</span>
                    </div>
                    <div className="flex justify-center items-center space-x-4 text-xl">
                      <span className="bg-blue-100 px-4 py-2 rounded-lg">9 + 4</span>
                      <span>=</span>
                      <span className="bg-green-100 px-4 py-2 rounded-lg animate-pulse">13</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">Donc 13 - 9 = 4 !</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 Maîtrise les 5 techniques de génie !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {techniqueExamples.map((technique, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      currentExample === index ? 'ring-4 ring-purple-400 bg-purple-100' : ''
                    }`}
                    onClick={() => explainSpecificTechnique(index)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{technique.item}</div>
                      <h3 className="font-bold text-sm text-gray-800 mb-1">{technique.title}</h3>
                      <div className="text-lg font-mono bg-white px-2 py-1 rounded mb-2">{technique.operation}</div>
                      <p className="text-xs text-gray-600 mb-3">{technique.explanation.slice(0, 40)}...</p>
                      <button className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors">
                        ▶️ Animation
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
                  🎬 Animation de la technique secrète
                </h2>
                
                {(() => {
                  const technique = techniqueExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Titre de la technique */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'technique-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <h3 className="text-xl font-bold">{technique.title}</h3>
                        <div className="text-2xl font-mono mt-2">{technique.operation}</div>
                      </div>

                      {/* Animation des étapes */}
                      <div className="space-y-4">
                        {technique.steps.map((step, stepIndex) => (
                          <div 
                            key={step.step}
                            className={`p-4 rounded-lg transition-all duration-500 ${
                              animatingStep === `step-${step.step}` ? 'bg-purple-100 ring-2 ring-purple-400 scale-105' : 
                              stepIndex < technique.steps.findIndex(s => animatingStep === `step-${s.step}`) ? 'bg-green-50' :
                              'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                animatingStep === `step-${step.step}` ? 'bg-purple-500 animate-pulse' :
                                stepIndex < technique.steps.findIndex(s => animatingStep === `step-${s.step}`) ? 'bg-green-500' :
                                'bg-gray-400'
                              }`}>
                                {step.step}
                              </div>
                              <div className="flex-1">
                                <div className="text-lg font-mono mb-1">{step.text}</div>
                                <div className="text-sm text-gray-600">{step.visual}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Résultat final */}
                      {animatingStep === 'final-result' && (
                        <div className="text-center p-6 bg-green-100 rounded-lg">
                          <p className="text-3xl font-bold text-green-800">
                            {technique.operation} = {technique.result}
                          </p>
                          <p className="text-lg text-green-600 mt-2">
                            Technique : {technique.title} ✨
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
                <div className="text-lg font-semibold text-purple-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Icône technique */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">{exercises[currentExercise].visual}</div>
                    <div className="bg-purple-100 px-4 py-2 rounded-lg inline-block">
                      <span className="text-purple-800 font-semibold">
                        Technique : {exercises[currentExercise].technique}
                      </span>
                    </div>
                  </div>

                  {/* Énoncé du problème */}
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
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
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50"
                      >
                        Vérifier
                      </button>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600"
                      >
                        💡 Indice
                      </button>
                    </div>
                  </div>

                  {/* Indice */}
                  {showHint && (
                    <div className="p-4 bg-yellow-50 rounded-lg text-center border-2 border-yellow-200">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-yellow-800">Indice :</span>
                      </div>
                      <p className="text-yellow-700">{exercises[currentExercise].hint}</p>
                    </div>
                  )}

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
                          {isCorrect ? 'Bravo ! Tu maîtrises cette technique !' : `Pas tout à fait... La réponse était ${exercises[currentExercise].answer}`}
                        </span>
                      </div>
                      
                      <button
                        onClick={nextExercise}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600 mt-2"
                      >
                        {currentExercise < exercises.length - 1 ? 'Technique suivante' : 'Voir mes résultats'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Modal de fin */
                <div className="text-center space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Techniques maîtrisées !
                  </h2>
                  <div className="text-2xl font-bold text-purple-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600"
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