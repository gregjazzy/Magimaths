'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function PoserAdditionCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [currentTechnique, setCurrentTechnique] = useState<string | null>(null);
  const [calculationStep, setCalculationStep] = useState<'setup' | 'units' | 'tens' | 'result' | 'carry-setup' | 'carry-units' | 'carry-tens' | 'carry-result' | null>(null);
  const [highlightedDigits, setHighlightedDigits] = useState<{position: string, value: string} | null>(null);
  const [showingCarry, setShowingCarry] = useState<number | null>(null);

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
  const hasStartedRef = useRef(false);

  // Données des techniques d'addition
  const additionTechniques = [
    {
      name: "Sans retenue",
      description: "Additions simples en colonnes",
      first: 23,
      second: 14,
      result: 37,
      hasCarry: false,
      explanation: "Additionner quand la somme de chaque colonne ne dépasse pas 9"
    },
    {
      name: "Avec retenue",
      description: "Additions avec report de dizaine", 
      first: 27,
      second: 18,
      result: 45,
      hasCarry: true,
      explanation: "Additionner en reportant la dizaine quand nécessaire"
    },
    {
      name: "Nombres plus grands",
      description: "Additions de nombres à 2 chiffres",
      first: 45,
      second: 38,
      result: 83,
      hasCarry: true,
      explanation: "Technique pour des nombres plus grands"
    }
  ];

  // Données des exercices
  const exercises = [
    {
      question: "Pose et calcule : 12 + 23",
      first: 12,
      second: 23,
      answer: 35,
      hasCarry: false,
      visual: "📝"
    },
    {
      question: "Pose et calcule : 16 + 17",
      first: 16,
      second: 17,
      answer: 33,
      hasCarry: false,
      visual: "✏️"
    },
    {
      question: "Pose et calcule : 29 + 15",
      first: 29,
      second: 15,
      answer: 44,
      hasCarry: false,
      visual: "📊"
    },
    {
      question: "Pose et calcule : 18 + 26",
      first: 18,
      second: 26,
      answer: 44,
      hasCarry: false,
      visual: "🔢"
    },
    {
      question: "Pose et calcule : 17 + 25",
      first: 17,
      second: 25,
      answer: 42,
      hasCarry: false,
      visual: "📋"
    },
    {
      question: "Pose et calcule : 28 + 17",
      first: 28,
      second: 17,
      answer: 45,
      hasCarry: true,
      visual: "🧮"
    },
    {
      question: "Pose et calcule : 35 + 28",
      first: 35,
      second: 28,
      answer: 63,
      hasCarry: true,
      visual: "📐"
    },
    {
      question: "Pose et calcule : 49 + 26",
      first: 49,
      second: 26,
      answer: 75,
      hasCarry: true,
      visual: "🎯"
    }
  ];

  // Fonction utilitaire pour attendre
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Fonction pour faire défiler vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
    
    // Reset de tous les états d'animation et de vocal
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setCurrentTechnique(null);
    setCalculationStep(null);
    setHighlightedDigits(null);
    setShowingCarry(null);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    if (stopSignalRef.current) return;
    
    return new Promise<void>((resolve) => {
      // Arrêter toute synthèse en cours
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attendre que les voix soient chargées
      const setVoiceAndSpeak = () => {
        const voices = speechSynthesis.getVoices();
        
        // Chercher une voix française féminine
        const frenchFemaleVoice = voices.find(voice => 
          voice.lang.startsWith('fr') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => 
          voice.lang.startsWith('fr') && (voice.name.toLowerCase().includes('amélie') || voice.name.toLowerCase().includes('virginie'))
        ) || voices.find(voice => voice.lang.startsWith('fr'));
        
        if (frenchFemaleVoice) {
          utterance.voice = frenchFemaleVoice;
        }
        
        utterance.rate = slowMode ? 0.8 : 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
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
        
        setIsPlayingVocal(true);
        currentAudioRef.current = utterance;
        speechSynthesis.speak(utterance);
      };
      
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });
      } else {
        setVoiceAndSpeak();
      }
    });
  };

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);
    
    try {
      // 1. Introduction
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à poser une addition en colonnes !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("C'est la méthode des grands pour calculer facilement des additions avec de gros nombres !", true);
      if (stopSignalRef.current) return;
      
      // 2. Explication de la méthode
      await wait(1500);
      setHighlightedElement('method');
      scrollToSection('method-section');
      await playAudio("La règle d'or : on aligne toujours les unités sous les unités, et les dizaines sous les dizaines !", true);
      if (stopSignalRef.current) return;
      
      // 3. Démonstration avec animation
      await wait(1800);
      setHighlightedElement('demo');
      scrollToSection('animation-section');
      await playAudio("Regardons ensemble comment faire avec l'exemple 23 plus 14 !", true);
      if (stopSignalRef.current) return;
      
      // Animation détaillée
      await animateTechnique('Sans retenue', 0);
      if (stopSignalRef.current) return;
      
      // 4. Guidance vers les techniques
      await wait(1500);
      setHighlightedElement('techniques');
      scrollToSection('techniques-section');
      await playAudio("Maintenant, choisis une technique pour voir d'autres exemples !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setCurrentTechnique(null);
      setCalculationStep(null);
      setHighlightedDigits(null);
      setShowingCarry(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour animer une technique spécifique
  const animateTechnique = async (techniqueName: string, index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const technique = additionTechniques[index];
    setCurrentTechnique(techniqueName);
    setCurrentExample(index);
    
    try {
      scrollToSection('animation-section');
      
      if (!technique.hasCarry) {
        // Animation pour addition sans retenue
        await animateSansRetenue(technique);
      } else {
        // Animation pour addition avec retenue
        await animateAvecRetenue(technique);
      }
    } finally {
      setCurrentTechnique(null);
      setCurrentExample(null);
      setCalculationStep(null);
      setHighlightedDigits(null);
      setShowingCarry(null);
      setIsAnimationRunning(false);
    }
  };

  // Animation pour addition sans retenue
  const animateSansRetenue = async (technique: any) => {
    // 1. Présentation du problème
    setCalculationStep('setup');
    await playAudio(`Calculons ${technique.first} plus ${technique.second} en posant l'addition !`, true);
    if (stopSignalRef.current) return;
    
    await wait(1500);
    await playAudio("D'abord, j'écris les nombres l'un sous l'autre en alignant les colonnes.", true);
    if (stopSignalRef.current) return;
    
    // 2. Calcul des unités
    await wait(2000);
    setCalculationStep('units');
    setHighlightedDigits({position: 'units', value: `${technique.first % 10} + ${technique.second % 10}`});
    await playAudio(`Je commence par les unités : ${technique.first % 10} plus ${technique.second % 10} égale ${(technique.first % 10) + (technique.second % 10)}.`, true);
    if (stopSignalRef.current) return;
    
    // 3. Calcul des dizaines
    await wait(2000);
    setCalculationStep('tens');
    setHighlightedDigits({position: 'tens', value: `${Math.floor(technique.first / 10)} + ${Math.floor(technique.second / 10)}`});
    await playAudio(`Puis les dizaines : ${Math.floor(technique.first / 10)} plus ${Math.floor(technique.second / 10)} égale ${Math.floor(technique.first / 10) + Math.floor(technique.second / 10)}.`, true);
    if (stopSignalRef.current) return;
    
    // 4. Résultat final
    await wait(2000);
    setCalculationStep('result');
    setHighlightedDigits(null);
    await playAudio(`Le résultat est ${technique.result} ! C'était facile car il n'y avait pas de retenue.`, true);
    if (stopSignalRef.current) return;
    
    await wait(1500);
  };

  // Animation pour addition avec retenue
  const animateAvecRetenue = async (technique: any) => {
    // 1. Présentation du problème
    setCalculationStep('carry-setup');
    await playAudio(`Calculons ${technique.first} plus ${technique.second}. Attention, il va y avoir une retenue !`, true);
    if (stopSignalRef.current) return;
    
    await wait(1500);
    await playAudio("J'écris les nombres en colonnes, unités sous unités, dizaines sous dizaines.", true);
    if (stopSignalRef.current) return;
    
    // 2. Calcul des unités avec retenue
    await wait(2000);
    setCalculationStep('carry-units');
    const unitsSum = (technique.first % 10) + (technique.second % 10);
    setHighlightedDigits({position: 'units', value: `${technique.first % 10} + ${technique.second % 10}`});
    await playAudio(`Unités : ${technique.first % 10} plus ${technique.second % 10} égale ${unitsSum}.`, true);
    if (stopSignalRef.current) return;
    
    await wait(1500);
    if (unitsSum >= 10) {
      setShowingCarry(1);
      await playAudio(`${unitsSum} c'est plus que 9, donc j'écris ${unitsSum % 10} et je retiens 1 dizaine !`, true);
      if (stopSignalRef.current) return;
    }
    
    // 3. Calcul des dizaines avec la retenue
    await wait(2000);
    setCalculationStep('carry-tens');
    const tensSum = Math.floor(technique.first / 10) + Math.floor(technique.second / 10) + (unitsSum >= 10 ? 1 : 0);
    setHighlightedDigits({position: 'tens', value: `${Math.floor(technique.first / 10)} + ${Math.floor(technique.second / 10)} + 1`});
    await playAudio(`Dizaines : ${Math.floor(technique.first / 10)} plus ${Math.floor(technique.second / 10)} plus la retenue de 1 égale ${tensSum}.`, true);
    if (stopSignalRef.current) return;
    
    // 4. Résultat final
    await wait(2000);
    setCalculationStep('carry-result');
    setHighlightedDigits(null);
    setShowingCarry(null);
    await playAudio(`Le résultat final est ${technique.result} ! Bravo, tu maîtrises la retenue !`, true);
    if (stopSignalRef.current) return;
    
    await wait(1500);
  };

  // Fonction pour les exercices
  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correct = userNum === exercises[currentExercise].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => new Set([...prev, currentExercise]));
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonction pour obtenir un message de correction personnalisé
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "🏆 Parfait ! Tu es un champion des additions posées !";
    if (percentage >= 80) return "🌟 Excellent travail ! Tu maîtrises bien la technique !";
    if (percentage >= 60) return "👍 Bien joué ! Continue à t'entraîner !";
    return "💪 C'est un bon début ! Refais les exercices pour progresser !";
  };

  // Effets pour la gestion des événements
  useEffect(() => {
    setIsClient(true);
  }, []);

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
      console.log('Navigation arrière - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page masquée - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    // Event listeners pour diverses situations
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('popstate', handlePopState);

    // Override history pour détecter la navigation programmatique
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
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/cp-additions-simples"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={stopAllVocalsAndAnimations}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au chapitre</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              📝 Poser une addition
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Navigation Cours/Exercices */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Book className="w-4 h-4 inline mr-2" />
              Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Exercices
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
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'intro' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Objectif : Apprendre à poser une addition
              </h2>
              <div className="text-lg text-gray-700 text-center space-y-4">
                <p>
                  Aujourd'hui, nous allons apprendre une technique très importante : 
                  <span className="font-bold text-green-600"> poser une addition en colonnes</span> !
                </p>
                <p>
                  Cette méthode permet de calculer facilement des additions avec de gros nombres.
                </p>
              </div>
            </div>

            {/* Méthode */}
            <div 
              id="method-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'method' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📐 La règle d'or
              </h2>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6">
                <div className="text-xl font-bold text-center text-gray-800 mb-4">
                  🔑 Règle importante : TOUJOURS aligner les colonnes !
                </div>
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600 mb-2">Unités</div>
                    <div className="text-sm text-gray-600">sous unités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600 mb-2">Dizaines</div>
                    <div className="text-sm text-gray-600">sous dizaines</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone d'animation */}
            <div 
              id="animation-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'demo' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎬 Animation en direct
              </h2>
              
              {currentExample !== null && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {additionTechniques[currentExample].name} : {additionTechniques[currentExample].description}
                    </h3>
                  </div>

                  {/* Affichage de l'addition en colonnes */}
                  <div className="flex justify-center">
                    <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
                      <div className="font-mono text-3xl space-y-2">
                        {/* En-têtes de colonnes */}
                        <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-4">
                          <span className={`px-2 py-1 rounded ${
                            highlightedDigits?.position === 'tens' ? 'bg-green-200 text-green-800' : ''
                          }`}>D</span>
                          <span className={`px-2 py-1 rounded ${
                            highlightedDigits?.position === 'units' ? 'bg-blue-200 text-blue-800' : ''
                          }`}>U</span>
                        </div>

                        {/* Premier nombre */}
                        <div className="flex justify-center space-x-4">
                          <span className={`w-12 text-center ${
                            highlightedDigits?.position === 'tens' ? 'bg-green-200 text-green-800 px-2 py-1 rounded' : ''
                          }`}>
                            {Math.floor(additionTechniques[currentExample].first / 10)}
                          </span>
                          <span className={`w-12 text-center ${
                            highlightedDigits?.position === 'units' ? 'bg-blue-200 text-blue-800 px-2 py-1 rounded' : ''
                          }`}>
                            {additionTechniques[currentExample].first % 10}
                          </span>
                        </div>

                        {/* Ligne plus */}
                        <div className="flex justify-center space-x-4">
                          <span className="w-12 text-center">+</span>
                          <span className={`w-12 text-center ${
                            highlightedDigits?.position === 'tens' ? 'bg-green-200 text-green-800 px-2 py-1 rounded' : ''
                          }`}>
                            {Math.floor(additionTechniques[currentExample].second / 10)}
                          </span>
                          <span className={`w-12 text-center ${
                            highlightedDigits?.position === 'units' ? 'bg-blue-200 text-blue-800 px-2 py-1 rounded' : ''
                          }`}>
                            {additionTechniques[currentExample].second % 10}
                          </span>
                        </div>

                        {/* Ligne de séparation */}
                        <div className="flex justify-center">
                          <div className="border-t-2 border-gray-800 w-32"></div>
                        </div>

                        {/* Retenue si applicable */}
                        {showingCarry && (
                          <div className="flex justify-center space-x-4 text-red-600 text-sm">
                            <span className="w-12 text-center animate-bounce">1</span>
                            <span className="w-12 text-center"></span>
                            <span className="w-12 text-center"></span>
                          </div>
                        )}

                        {/* Résultat */}
                        {calculationStep === 'result' || calculationStep === 'carry-result' ? (
                          <div className="flex justify-center space-x-4 bg-yellow-100 px-4 py-2 rounded animate-pulse">
                            <span className="w-12 text-center text-yellow-800 font-bold">
                              {Math.floor(additionTechniques[currentExample].result / 10)}
                            </span>
                            <span className="w-12 text-center text-yellow-800 font-bold">
                              {additionTechniques[currentExample].result % 10}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-center space-x-4">
                            <span className="w-12 text-center">
                              {(calculationStep === 'tens' || calculationStep === 'carry-tens') ? 
                                Math.floor(additionTechniques[currentExample].result / 10) : '?'}
                            </span>
                            <span className="w-12 text-center">
                              {(calculationStep === 'units' || calculationStep === 'carry-units' || calculationStep === 'tens' || calculationStep === 'carry-tens') ? 
                                (additionTechniques[currentExample].hasCarry ? 
                                  ((additionTechniques[currentExample].first % 10) + (additionTechniques[currentExample].second % 10)) % 10 :
                                  additionTechniques[currentExample].result % 10) : '?'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Explication de l'étape en cours */}
                      {highlightedDigits && (
                        <div className="mt-4 text-center">
                          <div className="bg-gray-200 rounded-lg p-3 text-lg font-semibold">
                            {highlightedDigits.value}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Techniques d'addition */}
            <div 
              id="techniques-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'techniques' ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🛠️ Choisis ta technique préférée
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {additionTechniques.map((technique, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-purple-400 bg-purple-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => animateTechnique(technique.name, index)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">
                        {technique.hasCarry ? '🔢' : '📊'}
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">
                        {technique.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-3">
                        {technique.description}
                      </div>
                      <div className="font-mono text-lg mb-3">
                        {technique.first} + {technique.second} = {technique.result}
                      </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-indigo-500 text-white hover:bg-indigo-600'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                💡 Conseils pour bien poser une addition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl mb-2">📏</div>
                  <div className="font-semibold">Bien aligner</div>
                  <div className="text-sm">Unités sous unités</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl mb-2">👆</div>
                  <div className="font-semibold">Commencer par la droite</div>
                  <div className="text-sm">Toujours par les unités</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-semibold">Penser à la retenue</div>
                  <div className="text-sm">Quand la somme > 9</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
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

                  {/* Question */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl text-center font-semibold">{exercises[currentExercise].question}</div>
                  </div>

                  {/* Espace pour poser l'addition */}
                  <div className="flex justify-center">
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                      <div className="font-mono text-2xl space-y-2">
                        <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-4">
                          <span>D</span>
                          <span>U</span>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <span className="w-12 text-center">{Math.floor(exercises[currentExercise].first / 10)}</span>
                          <span className="w-12 text-center">{exercises[currentExercise].first % 10}</span>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <span className="w-12 text-center">+</span>
                          <span className="w-12 text-center">{Math.floor(exercises[currentExercise].second / 10)}</span>
                          <span className="w-12 text-center">{exercises[currentExercise].second % 10}</span>
                        </div>
                        <div className="flex justify-center">
                          <div className="border-t-2 border-gray-800 w-24"></div>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <span className="w-12 text-center">?</span>
                          <span className="w-12 text-center">?</span>
                        </div>
                      </div>
                    </div>
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
                        <span className="text-xl font-bold">
                          {isCorrect ? 'Bravo !' : 'Pas tout à fait...'}
                        </span>
                      </div>
                      <div className="font-semibold mb-3">
                        {isCorrect 
                          ? `Excellent ! ${exercises[currentExercise].first} + ${exercises[currentExercise].second} = ${exercises[currentExercise].answer}`
                          : `La bonne réponse était ${exercises[currentExercise].answer}. Regarde bien l'alignement des colonnes !`
                        }
                      </div>
                      
                      <button
                        onClick={nextExercise}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600"
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
                    Score final : {finalScore} / {exercises.length}
                  </div>
                  <div className="text-lg text-gray-700">
                    {getCompletionMessage(finalScore, exercises.length)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
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