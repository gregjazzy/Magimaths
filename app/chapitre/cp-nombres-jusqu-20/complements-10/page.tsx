'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function ComplementsDixCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'counting' | 'adding' | 'completing' | null>(null);
  const [complementStep, setComplementStep] = useState<'first-number' | 'missing' | 'total' | 'result' | null>(null);
  const [countingTo10, setCountingTo10] = useState<number | null>(null);

  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des compléments à 10 avec animations
  const complementExamples = [
    { 
      first: 3, 
      second: 7, 
      item: '🔴', 
      description: 'compléter 3 pour faire 10',
      explanation: '3 plus 7 égale 10'
    },
    { 
      first: 4, 
      second: 6, 
      item: '🟢', 
      description: 'compléter 4 pour faire 10',
      explanation: '4 plus 6 égale 10'
    },
    { 
      first: 5, 
      second: 5, 
      item: '🔵', 
      description: 'compléter 5 pour faire 10',
      explanation: '5 plus 5 égale 10'
    },
    { 
      first: 7, 
      second: 3, 
      item: '🟡', 
      description: 'compléter 7 pour faire 10',
      explanation: '7 plus 3 égale 10'
    },
    { 
      first: 2, 
      second: 8, 
      item: '🟣', 
      description: 'compléter 2 pour faire 10',
      explanation: '2 plus 8 égale 10'
    }
  ];

  // Tous les compléments à 10
  const allComplements = [
    { first: 1, second: 9 },
    { first: 2, second: 8 },
    { first: 3, second: 7 },
    { first: 4, second: 6 },
    { first: 5, second: 5 },
    { first: 6, second: 4 },
    { first: 7, second: 3 },
    { first: 8, second: 2 },
    { first: 9, second: 1 }
  ];

  // Exercices sur les compléments à 10
  const exercises = [
    { question: 'Complète : 3 + ? = 10', correctAnswer: '7', choices: ['6', '7', '8'], firstNumber: 3 },
    { question: 'Complète : 4 + ? = 10', correctAnswer: '6', choices: ['5', '6', '7'], firstNumber: 4 },
    { question: 'Complète : 7 + ? = 10', correctAnswer: '3', choices: ['2', '3', '4'], firstNumber: 7 },
    { question: 'Complète : 2 + ? = 10', correctAnswer: '8', choices: ['7', '8', '9'], firstNumber: 2 },
    { question: 'Complète : 5 + ? = 10', correctAnswer: '5', choices: ['4', '5', '6'], firstNumber: 5 },
    { question: 'Complète : 8 + ? = 10', correctAnswer: '2', choices: ['1', '2', '3'], firstNumber: 8 },
    { question: 'Complète : 6 + ? = 10', correctAnswer: '4', choices: ['3', '4', '5'], firstNumber: 6 },
    { question: 'Complète : 1 + ? = 10', correctAnswer: '9', choices: ['8', '9', '10'], firstNumber: 1 },
    { question: 'Complète : 9 + ? = 10', correctAnswer: '1', choices: ['0', '1', '2'], firstNumber: 9 },
    { question: 'Complète : ? + 6 = 10', correctAnswer: '4', choices: ['3', '4', '5'], secondNumber: 6 }
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
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedNumber(null);
    setShowingProcess(null);
    setComplementStep(null);
    setCountingTo10(null);
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
        (voice.name.toLowerCase().includes('audrey') ||    // Voix féminine française courante  
         voice.name.toLowerCase().includes('marie') ||     // Voix féminine française
         voice.name.toLowerCase().includes('amélie') ||    // Voix féminine française
         voice.name.toLowerCase().includes('virginie') ||  // Voix féminine française
         voice.name.toLowerCase().includes('julie') ||     // Voix féminine française
         voice.name.toLowerCase().includes('celine') ||    // Voix féminine française
         voice.name.toLowerCase().includes('léa') ||       // Voix féminine française
         voice.name.toLowerCase().includes('charlotte'))   // Voix féminine française
      ) || voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        voice.localService                                 // Voix système française
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'                            // N'importe quelle voix fr-FR
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')                       // N'importe quelle voix française
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

  // Fonction utilitaire pour les pauses
  const wait = (ms: number) => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve(undefined);
        return;
      }
      setTimeout(resolve, ms);
    });
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Fonction pour rendre les objets avec animations
  const renderCircles = (count: number, item: string, isHighlighted = false) => {
    if (count <= 0) return null;
    
    const circles = [];
    for (let i = 0; i < count; i++) {
      circles.push(
        <span
          key={i}
          className={`text-4xl inline-block transition-all duration-500 ${
            isHighlighted ? 'animate-bounce scale-125' : ''
          } ${
            countingTo10 && i < countingTo10 ? 'text-green-500 scale-110' : ''
          }`}
          style={{ 
            animationDelay: `${i * 100}ms`
          }}
        >
          {item}
        </span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {circles}
      </div>
    );
  };

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);

    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les compléments à 10 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Un complément à 10, c'est ce qu'il faut ajouter à un nombre pour arriver à 10 !", true);
      if (stopSignalRef.current) return;
      
      // 2. Explication du concept avec animations
      await wait(1800);
      setHighlightedElement('concept-section');
      await playAudio("Regardons ensemble comment compléter 3 pour faire 10 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setCurrentExample(0);
      setAnimatingStep('introduction');
      const example = complementExamples[0];
      
      await playAudio(`D'abord, j'ai ${example.first} objets.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setComplementStep('first-number');
      setHighlightedNumber(example.first);
      await playAudio(`Je vois ${example.first} objets ici.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setShowingProcess('counting');
      await playAudio("Maintenant, je dois compter jusqu'à 10. Combien dois-je ajouter ?", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setComplementStep('missing');
      await playAudio("Je vais compter de 3 jusqu'à 10 pour trouver le complément !", true);
      if (stopSignalRef.current) return;
      
      // Animation de comptage de 3 à 10
      await wait(1000);
      for (let i = example.first + 1; i <= 10; i++) {
        if (stopSignalRef.current) return;
        setCountingTo10(i);
        await playAudio(`${i}`, true);
        await wait(600);
      }
      
      await wait(1000);
      setShowingProcess('adding');
      await playAudio(`Il faut ajouter ${example.second} pour aller de ${example.first} à 10 !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setComplementStep('total');
      setShowingProcess('completing');
      await playAudio(`${example.first} plus ${example.second} égale 10 ! C'est ça, un complément !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setComplementStep('result');
      await playAudio(`En mathématiques, on écrit : ${example.first} + ${example.second} = 10 !`, true);
      if (stopSignalRef.current) return;
      
      // 3. Présentation des autres exemples
      await wait(2500);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setComplementStep(null);
      setCountingTo10(null);
      setCurrentExample(null);
      setHighlightedElement(null);
      await playAudio("Parfait ! Maintenant tu comprends les compléments à 10 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a d'autres nombres et d'autres compléments à découvrir !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('examples-section');
      scrollToSection('examples-section');
      await playAudio("Regarde ! Tu peux essayer avec d'autres nombres !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Clique sur les exemples pour voir d'autres compléments !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setComplementStep(null);
      setCountingTo10(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const example = complementExamples[index];
    
    try {
      setCurrentExample(index);
      setAnimatingStep('introduction');
      scrollToSection('concept-section');
      
      await playAudio(`Je vais te montrer comment ${example.description}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setComplementStep('first-number');
      setHighlightedNumber(example.first);
      await playAudio(`Voici ${example.first} objets.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('counting');
      await playAudio(`Je compte de ${example.first} jusqu'à 10.`, true);
      if (stopSignalRef.current) return;

      // Animation de comptage
      await wait(1000);
      for (let i = example.first + 1; i <= 10; i++) {
        if (stopSignalRef.current) return;
        setCountingTo10(i);
        await playAudio(`${i}`, true);
        await wait(600);
      }
      
      await wait(1000);
      setComplementStep('missing');
      setShowingProcess('adding');
      await playAudio(`Il faut ajouter ${example.second} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setComplementStep('result');
      setShowingProcess('completing');
      await playAudio(`${example.first} plus ${example.second} égale 10 !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setComplementStep(null);
      setCountingTo10(null);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setComplementStep(null);
      setCountingTo10(null);
      setIsAnimationRunning(false);
    }
  };

  // Gestion des exercices
  const handleAnswerClick = (answer: string) => {
    stopAllVocalsAndAnimations();
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Champion des compléments !", message: "Tu maîtrises parfaitement les compléments à 10 !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les compléments !", emoji: "📚" };
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements de visibilité de la page et navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page cachée - arrêt du vocal');
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      console.log('Avant déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      console.log('Navigation back/forward - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page masquée - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleUnload = () => {
      console.log('Déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleHashChange = () => {
      console.log('Changement de hash - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleBlur = () => {
      console.log('Perte de focus fenêtre - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    // Event listeners standard
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);

    // Override des méthodes history pour détecter navigation programmatique
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('Navigation programmatique pushState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      console.log('Navigation programmatique replaceState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔟 Compléments à 10
            </h1>
            <p className="text-lg text-gray-600">
              Découvre toutes les façons de faire 10 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Bouton d'explication vocal principal */}
            <div className="text-center mb-6">
              <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:shadow-xl hover:scale-105'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Explication du concept avec animation intégrée */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Qu'est-ce qu'un complément à 10 ?
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-orange-800 font-semibold mb-6">
                  Un complément à 10, c'est ce qu'il faut ajouter à un nombre pour arriver à 10 !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {currentExample !== null ? 
                        `Exemple : ${complementExamples[currentExample].first} + ${complementExamples[currentExample].second} = 10` 
                        : 'Exemple : 3 + 7 = 10'
                      }
                </div>
              </div>

                  {/* Animation intégrée dans le concept */}
                  {currentExample !== null ? (
                    <div className="space-y-6">
                      {/* Indicateur d'étape */}
                      {animatingStep && (
                        <div className="p-3 rounded-lg bg-blue-100 border-l-4 border-blue-500 text-center">
                          <div className="text-lg font-bold text-blue-800">
                            {animatingStep === 'introduction' && '🎯 Regardons ensemble...'}
                  </div>
                  </div>
                      )}
                      
                      {/* Premier nombre */}
                      {complementStep === 'first-number' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-500 bg-yellow-100 ring-4 ring-yellow-400 scale-105`}>
                          <h4 className="text-2xl font-bold text-yellow-800 mb-4">
                            Nombre de départ : {complementExamples[currentExample].first}
                          </h4>
                          <div className="mb-4">
                            {renderCircles(complementExamples[currentExample].first, complementExamples[currentExample].item, highlightedNumber === complementExamples[currentExample].first)}
                          </div>
                          <div className={`text-xl font-bold transition-all duration-500 ${
                            highlightedNumber === complementExamples[currentExample].first ? 'text-yellow-600 scale-125 animate-pulse' : 'text-yellow-800'
                          }`}>
                            J'ai {complementExamples[currentExample].first} objets
                          </div>
                        </div>
                      )}

                      {/* Animation de comptage jusqu'à 10 */}
                      {showingProcess === 'counting' && (
                        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                          <h4 className="text-xl font-bold text-center text-blue-800 mb-4">
                            🔢 Comptons jusqu'à 10 !
                          </h4>
                          <div className="flex justify-center items-center space-x-2 text-5xl">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span
                                key={i}
                                className={`transition-all duration-500 ${
                                  countingTo10 && i + 1 <= countingTo10 ? 'scale-150 animate-bounce text-red-500' : 'text-gray-300'
                                }`}
                              >
                                🔴
                              </span>
                            ))}
                  </div>
                          <div className="text-center mt-4">
                            <div className="text-3xl font-bold text-blue-800">
                              {countingTo10 && `${countingTo10}...`}
                </div>
              </div>
            </div>
                      )}

                      {/* Complément trouvé */}
                      {complementStep === 'missing' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                          showingProcess === 'adding' ? 'ring-4 ring-green-400 bg-green-100 scale-105' : 'bg-green-50'
                        }`}>
                          <h4 className="text-2xl font-bold text-green-800 mb-4">
                            Il faut ajouter : {complementExamples[currentExample].second}
                          </h4>
                          <div className="mb-4">
                            {renderCircles(complementExamples[currentExample].second, complementExamples[currentExample].item)}
                          </div>
                          <div className="text-xl font-bold text-green-800">
                            {complementExamples[currentExample].second} objets en plus
                          </div>
                        </div>
                      )}

                      {/* Résultat */}
                      {complementStep === 'result' && (
                        <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-orange-100 ring-4 ring-orange-400 scale-105`}>
                          <h4 className="text-2xl font-bold text-orange-800 mb-4">🎉 Complément trouvé !</h4>
                          <div className="mb-4">
                            {renderCircles(10, '🔴')}
                          </div>
                          <div className="text-3xl font-bold text-orange-800 mb-2">
                            {complementExamples[currentExample].first} + {complementExamples[currentExample].second} = 10
                          </div>
                          <div className="text-lg text-orange-600">
                            {complementExamples[currentExample].explanation} !
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Version statique quand pas d'animation */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">3 objets</div>
                        {renderCircles(3, '🔴')}
                        <div className="text-xl font-bold text-orange-800 mt-2">3</div>
                      </div>
                      <div className="text-center flex items-center justify-center">
                        <div className="text-6xl font-bold text-orange-600">+</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">7 objets</div>
                        {renderCircles(7, '🔴')}
                        <div className="text-xl font-bold text-yellow-800 mt-2">7</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                }`}
              >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🌟 Autres exemples de compléments
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complementExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                          <div className="text-center">
                      <div className="text-3xl mb-2">{example.item}</div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {example.first} + {example.second} = 10
                            </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Complément de {example.first}
                          </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                            </div>
                          </div>
                ))}
                        </div>
                      </div>

            {/* Tous les compléments à 10 */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Tous les compléments à 10
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allComplements.map((complement, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-orange-600">
                      {complement.first} + {complement.second} = 10
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                💡 Conseils pour retenir les compléments
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">🤲</div>
                  <div className="font-bold">Utilise tes doigts</div>
                  <div className="text-sm">Compte jusqu'à 10</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎵</div>
                  <div className="font-bold">Récite comme une chanson</div>
                  <div className="text-sm">1+9, 2+8, 3+7...</div>
              </div>
                <div>
                  <div className="text-3xl mb-2">🧠</div>
                  <div className="font-bold">Mémorise les paires</div>
                  <div className="text-sm">Répète plusieurs fois</div>
            </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  🔄 Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage du nombre à compléter */}
              <div className="bg-orange-50 rounded-lg p-6 mb-8">
                <div className="text-6xl font-bold text-orange-600 mb-4">
                  {exercises[currentExercise].firstNumber || exercises[currentExercise].secondNumber || '?'}
                </div>
                <div className="mb-4">
                  {exercises[currentExercise].firstNumber && renderCircles(exercises[currentExercise].firstNumber, '🔴')}
                  {exercises[currentExercise].secondNumber && renderCircles(exercises[currentExercise].secondNumber, '🔴')}
                </div>
                <p className="text-lg text-gray-700 font-semibold">
                  Trouve le complément pour faire 10 !
                </p>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
                {exercises[currentExercise].choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-6 rounded-lg font-bold text-3xl transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                          : 'bg-orange-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <span className="text-2xl">✅</span>
                        <span className="font-bold text-xl">
                          Excellent ! {exercises[currentExercise].correctAnswer} est le bon complément !
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">❌</span>
                        <span className="font-bold text-xl">
                          Pas tout à fait... Le bon complément est : {exercises[currentExercise].correctAnswer}
                        </span>
                      </>
                    )}
                                  </div>
                                </div>
                              )}
                            
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                              <button
                    onClick={nextExercise}
                    className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const result = getCompletionMessage(finalScore, exercises.length);
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les compléments à 10 sont la base du calcul mental !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => {
                          stopAllVocalsAndAnimations();
                          setShowCompletionModal(false);
                        }}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 