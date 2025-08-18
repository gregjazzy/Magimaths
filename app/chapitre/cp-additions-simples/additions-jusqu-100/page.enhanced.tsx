'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye, RotateCcw, Play, Volume2, VolumeX } from 'lucide-react';

export default function AdditionsJusqua100Enhanced() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [currentTechnique, setCurrentTechnique] = useState<string | null>(null);
  const [calculationStep, setCalculationStep] = useState<string | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [highlightedDigits, setHighlightedDigits] = useState<string[]>([]);

  // États pour les exercices  
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());

  // États pour Sam le Pirate
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPlayingEnonce, setIsPlayingEnonce] = useState(false);

  // États pour les animations améliorées
  const [pulsingElements, setPulsingElements] = useState<Set<string>>(new Set());
  const [glowingElements, setGlowingElements] = useState<Set<string>>(new Set());
  const [scrollingToElement, setScrollingToElement] = useState<string | null>(null);

  // Refs pour gérer l'audio et scroll
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Refs pour les éléments à animer
  const introSectionRef = useRef<HTMLDivElement>(null);
  const techniquesSectionRef = useRef<HTMLDivElement>(null);
  const examplesSectionRef = useRef<HTMLDivElement>(null);
  const exercisesSectionRef = useRef<HTMLDivElement>(null);

  // Données des techniques d'addition simplifiées pour la démo
  const additionTechniques = [
    {
      id: 'sans-retenue',
      title: 'Addition sans retenue',
      icon: '✨',
      description: 'La technique la plus simple : on additionne directement',
      examples: [
        { 
          calculation: '23 + 45', 
          num1: 23, 
          num2: 45, 
          result: 68,
          steps: [
            'On place les nombres en colonnes',
            'On additionne les unités : 3 + 5 = 8',
            'On additionne les dizaines : 2 + 4 = 6',
            'Le résultat est 68 !'
          ]
        }
      ]
    },
    {
      id: 'avec-retenue',
      title: 'Addition avec retenue',
      icon: '🔄',
      description: 'Quand la somme dépasse 10, on reporte à la colonne suivante',
      examples: [
        { 
          calculation: '27 + 35', 
          num1: 27, 
          num2: 35, 
          result: 62,
          steps: [
            'On additionne les unités : 7 + 5 = 12',
            'On écrit 2 et on retient 1',
            'On additionne les dizaines : 2 + 3 + 1 = 6',
            'Le résultat est 62 !'
          ]
        }
      ]
    }
  ];

  // Exercices d'entraînement
  const exercises = [
    { question: '34 + 25 = ?', answer: 59, hint: 'Commence par les unités : 4 + 5' },
    { question: '48 + 37 = ?', answer: 85, hint: 'Attention à la retenue !' },
    { question: '56 + 29 = ?', answer: 85, hint: 'Décompose si nécessaire' }
  ];

  // Expressions de pirate
  const pirateExpressions = [
    "Mille sabords", "Tonnerre de Brest", "Sacré matelot", "Par Neptune"
  ];

  // Compliments
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique"
  ];

  // Détection client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fonction audio améliorée
  const playAudio = async (text: string, options: { rate?: number; pitch?: number } = {}) => {
    return new Promise<void>((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      if (stopSignalRef.current) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('fr'));
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onstart = () => {
        setIsPlayingVocal(true);
      };

      utterance.onend = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        reject(new Error('Speech synthesis error'));
      };

      currentAudioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  };

  // Fonction d'attente
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Fonction de scroll améliorée avec animation
  const scrollToElement = async (elementId: string, highlight: boolean = true) => {
    setScrollingToElement(elementId);
    
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest' 
      });
      
      if (highlight) {
        // Animation de surbrillance
        setHighlightedElement(elementId);
        setPulsingElements(prev => new Set(prev).add(elementId));
        
        // Effet de glow
        setTimeout(() => {
          setGlowingElements(prev => new Set(prev).add(elementId));
        }, 300);
      }
      
      await wait(800); // Attendre que le scroll soit terminé
    }
    
    setScrollingToElement(null);
  };

  // Fonction pour arrêter toutes les animations
  const stopAllAnimations = () => {
    stopSignalRef.current = true;
    
    if (currentAudioRef.current) {
      window.speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setPulsingElements(new Set());
    setGlowingElements(new Set());
    setScrollingToElement(null);
    setCalculationStep(null);
    setHighlightedDigits([]);
  };

  // Fonction principale de présentation vocale
  const startVocalPresentation = async () => {
    if (isAnimationRunning) return;
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setPirateIntroStarted(true);
    setSamSizeExpanded(true);

    try {
      // 1. Introduction avec Sam
      await scrollToElement('intro-section');
      await playAudio("Ahoy matelot ! Je suis Sam le Pirate et je vais t'apprendre les additions jusqu'à 100 !");
      if (stopSignalRef.current) return;
      await wait(1000);

      // 2. Présentation des techniques
      await scrollToElement('techniques-section');
      await playAudio("Regarde ces techniques magiques ! Chaque bouton te montre une méthode différente pour additionner.");
      if (stopSignalRef.current) return;

      // Surbrillance des boutons de technique un par un
      for (let i = 0; i < additionTechniques.length; i++) {
        const techniqueId = `technique-${additionTechniques[i].id}`;
        setHighlightedElement(techniqueId);
        setPulsingElements(prev => new Set(prev).add(techniqueId));
        
        await playAudio(`${additionTechniques[i].title} : ${additionTechniques[i].description}`);
        if (stopSignalRef.current) return;
        await wait(500);
        
        setPulsingElements(prev => {
          const newSet = new Set(prev);
          newSet.delete(techniqueId);
          return newSet;
        });
      }

      // 3. Zone d'exemples
      await scrollToElement('examples-section');
      await playAudio("Clique sur une technique pour voir des exemples animés ! Je te montrerai chaque étape en détail.");
      if (stopSignalRef.current) return;
      await wait(1000);

      // 4. Zone d'exercices
      await scrollToElement('exercises-section');
      setHighlightedElement('start-exercises-button');
      setPulsingElements(prev => new Set(prev).add('start-exercises-button'));
      
      await playAudio("Quand tu es prêt, clique sur ce bouton pour commencer les exercices d'entraînement !");
      if (stopSignalRef.current) return;
      await wait(1000);

      // Nettoyage final
      setHighlightedElement(null);
      setPulsingElements(new Set());
      setGlowingElements(new Set());

    } catch (error) {
      console.error('Erreur dans la présentation vocale:', error);
    } finally {
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour démontrer une technique
  const demonstrateTechnique = async (technique: typeof additionTechniques[0]) => {
    if (isAnimationRunning) return;
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentTechnique(technique.id);

    try {
      const example = technique.examples[0];
      
      // Scroll vers la zone d'animation
      await scrollToElement('animation-section');
      
      // Présentation de la technique
      setHighlightedElement('technique-title');
      await playAudio(`Découvrons ${technique.title} ! ${technique.description}`);
      if (stopSignalRef.current) return;
      await wait(1000);

      // Animation étape par étape
      for (let i = 0; i < example.steps.length; i++) {
        setCalculationStep(`step-${i}`);
        setHighlightedElement(`step-${i}`);
        
        await playAudio(example.steps[i]);
        if (stopSignalRef.current) return;
        await wait(1500);
      }

      // Résultat final
      setCalculationStep('result');
      setHighlightedElement('result');
      setGlowingElements(prev => new Set(prev).add('result'));
      
      await playAudio(`Et voilà ! ${example.calculation} = ${example.result} !`);
      if (stopSignalRef.current) return;
      await wait(2000);

    } catch (error) {
      console.error('Erreur dans la démonstration:', error);
    } finally {
      setIsAnimationRunning(false);
      setCurrentTechnique(null);
      setCalculationStep(null);
      setHighlightedElement(null);
      setGlowingElements(new Set());
    }
  };

  // Fonction pour les exercices avec guidage vocal
  const startExerciseGuidance = async () => {
    if (isAnimationRunning) return;
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setShowExercises(true);

    try {
      await scrollToElement('exercise-area');
      
      // Guidage pour le premier exercice
      setHighlightedElement('exercise-question');
      await playAudio("Voici ton premier exercice ! Lis bien la question.");
      if (stopSignalRef.current) return;
      await wait(1000);

      // Zone de réponse
      setHighlightedElement('answer-input');
      setPulsingElements(prev => new Set(prev).add('answer-input'));
      
      await playAudio("Écris ta réponse dans cette case. Prends ton temps pour calculer !");
      if (stopSignalRef.current) return;
      await wait(1000);

      // Bouton valider
      setHighlightedElement('validate-button');
      setPulsingElements(prev => new Set(prev).add('validate-button'));
      
      await playAudio("Quand tu as fini, clique sur Valider pour vérifier ta réponse !");
      if (stopSignalRef.current) return;
      await wait(1000);

      // Nettoyage
      setHighlightedElement(null);
      setPulsingElements(new Set());

    } catch (error) {
      console.error('Erreur dans le guidage des exercices:', error);
    } finally {
      setIsAnimationRunning(false);
    }
  };

  // Gestionnaire de validation des exercices
  const handleAnswerSubmit = () => {
    const currentExerciseData = exercises[currentExercise];
    const isAnswerCorrect = parseInt(userAnswer) === currentExerciseData.answer;
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 10);
      setAnsweredCorrectly(prev => new Set(prev).add(currentExercise));
      
      // Animation de succès
      setGlowingElements(prev => new Set(prev).add('success-message'));
      
      // Audio de félicitation
      const compliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      const expression = pirateExpressions[Math.floor(Math.random() * pirateExpressions.length)];
      
      playAudio(`${compliment} ! ${expression} ! Tu as trouvé la bonne réponse !`);
    } else {
      // Animation d'erreur
      setPulsingElements(prev => new Set(prev).add('error-message'));
      
      playAudio(`Pas tout à fait ! La bonne réponse était ${currentExerciseData.answer}. ${currentExerciseData.hint}`);
    }
  };

  // Gestionnaire pour passer à l'exercice suivant
  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setGlowingElements(new Set());
      setPulsingElements(new Set());
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/cp-additions-simples" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour aux additions simples</span>
              <span className="sm:hidden">Retour</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Additions jusqu'à 100
              </h1>
              <p className="text-sm text-gray-600">CP - Avec Sam le Pirate</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-900">{score} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Introduction avec Sam le Pirate */}
        <section 
          id="intro-section" 
          ref={introSectionRef}
          className={`
            bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl border-4 border-yellow-400 transition-all duration-500
            ${highlightedElement === 'intro-section' ? 'ring-4 ring-yellow-300 ring-opacity-75 scale-105' : ''}
            ${pulsingElements.has('intro-section') ? 'animate-pulse' : ''}
            ${glowingElements.has('intro-section') ? 'shadow-2xl shadow-yellow-400/50' : ''}
          `}
        >
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
            
            {/* Image de Sam le Pirate */}
            <div className="flex-shrink-0">
              <div className={`
                relative transition-all duration-700 ease-in-out
                ${samSizeExpanded ? 'w-32 h-32 sm:w-40 sm:h-40' : 'w-24 h-24 sm:w-32 sm:h-32'}
                ${highlightedElement === 'sam-pirate' ? 'ring-4 ring-yellow-300 rounded-full' : ''}
              `}>
                {!imageError ? (
                  <img
                    src="/image/pirate-small.png"
                    alt="Sam le Pirate"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-4xl sm:text-6xl shadow-xl">
                    🏴‍☠️
                  </div>
                )}
                
                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Contenu textuel */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                  🏴‍☠️ Ahoy, matelot ! Je suis Sam le Pirate ! 
                </h2>
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-yellow-200 drop-shadow-md">
                  Prêt pour l'aventure des additions jusqu'à 100 ?
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/30">
                <p className="text-base sm:text-lg font-medium leading-relaxed">
                  <span className="font-bold text-yellow-200">Mille sabords !</span> Je vais te montrer des techniques magiques 
                  pour additionner comme un vrai pirate des mathématiques ! 
                  <span className="font-bold text-yellow-200">Tonnerre de Brest</span>, 
                  tu vas devenir un expert !
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                {!pirateIntroStarted ? (
                  <button
                    onClick={startVocalPresentation}
                    disabled={isAnimationRunning}
                    className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Commencer l'aventure !</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={startVocalPresentation}
                      disabled={isAnimationRunning}
                      className="bg-green-500 hover:bg-green-400 disabled:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isAnimationRunning ? 'En cours...' : 'Réécouter'}</span>
                    </button>
                    
                    {isAnimationRunning && (
                      <button
                        onClick={stopAllAnimations}
                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <VolumeX className="w-4 h-4" />
                        <span>Stop</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section des techniques */}
        <section 
          id="techniques-section" 
          ref={techniquesSectionRef}
          className={`
            bg-white rounded-2xl p-6 shadow-xl border border-gray-200 transition-all duration-500
            ${highlightedElement === 'techniques-section' ? 'ring-4 ring-blue-300 ring-opacity-75 scale-105' : ''}
            ${pulsingElements.has('techniques-section') ? 'animate-pulse' : ''}
            ${glowingElements.has('techniques-section') ? 'shadow-2xl shadow-blue-400/50' : ''}
          `}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center space-x-3">
            <Calculator className="w-8 h-8 text-blue-500" />
            <span>Techniques d'Addition Magiques</span>
            <Star className="w-8 h-8 text-yellow-500" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionTechniques.map((technique) => (
              <button
                key={technique.id}
                id={`technique-${technique.id}`}
                onClick={() => demonstrateTechnique(technique)}
                disabled={isAnimationRunning}
                className={`
                  bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed
                  ${highlightedElement === `technique-${technique.id}` ? 'ring-4 ring-blue-300 ring-opacity-75 scale-105' : ''}
                  ${pulsingElements.has(`technique-${technique.id}`) ? 'animate-pulse' : ''}
                  ${glowingElements.has(`technique-${technique.id}`) ? 'shadow-2xl shadow-blue-400/50' : ''}
                  ${currentTechnique === technique.id ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-500' : ''}
                `}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-3xl">{technique.icon}</div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {technique.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  {technique.description}
                </p>
                {currentTechnique === technique.id && (
                  <div className="mt-3 text-blue-600 font-medium text-sm">
                    ✨ Technique sélectionnée
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Section des exemples */}
        <section 
          id="examples-section" 
          ref={examplesSectionRef}
          className={`
            bg-white rounded-2xl p-6 shadow-xl border border-gray-200 transition-all duration-500
            ${highlightedElement === 'examples-section' ? 'ring-4 ring-green-300 ring-opacity-75 scale-105' : ''}
            ${pulsingElements.has('examples-section') ? 'animate-pulse' : ''}
            ${glowingElements.has('examples-section') ? 'shadow-2xl shadow-green-400/50' : ''}
          `}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center space-x-3">
            <Eye className="w-8 h-8 text-green-500" />
            <span>Exemples Animés</span>
            <Zap className="w-8 h-8 text-yellow-500" />
          </h2>

          {currentTechnique && (
            <div id="animation-section" className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
              <div className="text-center mb-6">
                <h3 
                  id="technique-title"
                  className={`
                    text-xl font-bold text-gray-800 mb-2 transition-all duration-300
                    ${highlightedElement === 'technique-title' ? 'text-green-600 scale-110' : ''}
                  `}
                >
                  {additionTechniques.find(t => t.id === currentTechnique)?.title}
                </h3>
                
                {additionTechniques.find(t => t.id === currentTechnique)?.examples.map((example, index) => (
                  <div key={index} className="space-y-4">
                    <div className="text-3xl font-bold text-blue-600 mb-4">
                      {example.calculation} = ?
                    </div>
                    
                    {/* Étapes de calcul */}
                    <div className="space-y-3">
                      {example.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          id={`step-${stepIndex}`}
                          className={`
                            p-3 rounded-lg border-l-4 transition-all duration-500
                            ${calculationStep === `step-${stepIndex}` 
                              ? 'border-green-500 bg-green-100 shadow-lg scale-105' 
                              : 'border-gray-300 bg-gray-50'
                            }
                            ${highlightedElement === `step-${stepIndex}` ? 'ring-2 ring-green-300' : ''}
                            ${pulsingElements.has(`step-${stepIndex}`) ? 'animate-pulse' : ''}
                          `}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                              ${calculationStep === `step-${stepIndex}` 
                                ? 'bg-green-500 text-white scale-110' 
                                : 'bg-gray-400 text-white'
                              }
                            `}>
                              {stepIndex + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Résultat */}
                    <div
                      id="result"
                      className={`
                        text-center p-4 rounded-xl transition-all duration-500
                        ${calculationStep === 'result' 
                          ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-xl scale-110' 
                          : 'bg-gray-100 text-gray-600'
                        }
                        ${highlightedElement === 'result' ? 'ring-4 ring-yellow-300' : ''}
                        ${glowingElements.has('result') ? 'shadow-2xl shadow-green-400/50' : ''}
                      `}
                    >
                      <div className="text-2xl font-bold">
                        Résultat : {example.result}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!currentTechnique && (
            <div className="text-center text-gray-500 py-12">
              <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Clique sur une technique ci-dessus pour voir la démonstration !</p>
            </div>
          )}
        </section>

        {/* Section des exercices */}
        <section 
          id="exercises-section" 
          ref={exercisesSectionRef}
          className={`
            bg-white rounded-2xl p-6 shadow-xl border border-gray-200 transition-all duration-500
            ${highlightedElement === 'exercises-section' ? 'ring-4 ring-purple-300 ring-opacity-75 scale-105' : ''}
            ${pulsingElements.has('exercises-section') ? 'animate-pulse' : ''}
            ${glowingElements.has('exercises-section') ? 'shadow-2xl shadow-purple-400/50' : ''}
          `}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center space-x-3">
            <Target className="w-8 h-8 text-purple-500" />
            <span>Exercices d'Entraînement</span>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </h2>

          {!showExercises ? (
            <div className="text-center">
              <button
                id="start-exercises-button"
                onClick={startExerciseGuidance}
                disabled={isAnimationRunning}
                className={`
                  bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                  ${highlightedElement === 'start-exercises-button' ? 'ring-4 ring-purple-300 ring-opacity-75 scale-110' : ''}
                  ${pulsingElements.has('start-exercises-button') ? 'animate-pulse' : ''}
                  ${glowingElements.has('start-exercises-button') ? 'shadow-2xl shadow-purple-400/50' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Play className="w-6 h-6" />
                  <span>Commencer les exercices</span>
                </div>
              </button>
            </div>
          ) : (
            <div id="exercise-area" className="space-y-6">
              {/* En-tête des exercices */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6" />
                    <div>
                      <h3 className="text-lg font-bold">Exercice {currentExercise + 1} sur {exercises.length}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{score}</div>
                    <div className="text-sm text-purple-100">points</div>
                  </div>
                </div>
              </div>

              {/* Question actuelle */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <div
                  id="exercise-question"
                  className={`
                    text-center mb-6 transition-all duration-300
                    ${highlightedElement === 'exercise-question' ? 'scale-110 text-blue-600' : ''}
                    ${pulsingElements.has('exercise-question') ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {exercises[currentExercise]?.question}
                  </div>
                  <div className="text-gray-600">
                    Calcule cette addition
                  </div>
                </div>

                {/* Zone de réponse */}
                <div className="flex flex-col items-center space-y-4">
                  <input
                    id="answer-input"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Ta réponse..."
                    disabled={isCorrect !== null}
                    className={`
                      w-32 h-16 text-2xl font-bold text-center border-2 rounded-lg focus:outline-none transition-all duration-300
                      ${highlightedElement === 'answer-input' ? 'border-blue-500 ring-4 ring-blue-300 ring-opacity-50 scale-110' : 'border-gray-300 focus:border-blue-500'}
                      ${pulsingElements.has('answer-input') ? 'animate-pulse' : ''}
                      ${isCorrect === true ? 'border-green-500 bg-green-50' : ''}
                      ${isCorrect === false ? 'border-red-500 bg-red-50' : ''}
                    `}
                  />

                  {isCorrect === null && (
                    <button
                      id="validate-button"
                      onClick={handleAnswerSubmit}
                      disabled={!userAnswer.trim()}
                      className={`
                        bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300
                        ${highlightedElement === 'validate-button' ? 'ring-4 ring-blue-300 ring-opacity-75 scale-110' : ''}
                        ${pulsingElements.has('validate-button') ? 'animate-pulse' : ''}
                      `}
                    >
                      Valider
                    </button>
                  )}
                </div>

                {/* Résultat */}
                {isCorrect !== null && (
                  <div className="mt-6 text-center">
                    {isCorrect ? (
                      <div 
                        id="success-message"
                        className={`
                          space-y-3 transition-all duration-500
                          ${glowingElements.has('success-message') ? 'scale-110' : ''}
                        `}
                      >
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircle className="w-8 h-8" />
                          <span className="text-xl font-bold">Excellent !</span>
                        </div>
                        <div className="text-green-600 font-medium">
                          {pirateExpressions[currentExercise % pirateExpressions.length]} ! +10 points
                        </div>
                      </div>
                    ) : (
                      <div 
                        id="error-message"
                        className={`
                          space-y-3 transition-all duration-500
                          ${pulsingElements.has('error-message') ? 'animate-pulse' : ''}
                        `}
                      >
                        <div className="flex items-center justify-center space-x-2 text-red-600">
                          <XCircle className="w-8 h-8" />
                          <span className="text-xl font-bold">Pas tout à fait...</span>
                        </div>
                        <div className="text-gray-600">
                          La bonne réponse était : <span className="font-bold text-blue-600">{exercises[currentExercise]?.answer}</span>
                        </div>
                        <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          💡 {exercises[currentExercise]?.hint}
                        </div>
                      </div>
                    )}

                    {currentExercise < exercises.length - 1 ? (
                      <button
                        onClick={handleNextExercise}
                        className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <span>Exercice suivant</span>
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </button>
                    ) : (
                      <div className="mt-4 text-center">
                        <div className="text-lg font-bold text-gray-800 mb-2">
                          🎉 Tous les exercices terminés !
                        </div>
                        <div className="text-gray-600">
                          Score final : <span className="font-bold text-blue-600">{score} points</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
