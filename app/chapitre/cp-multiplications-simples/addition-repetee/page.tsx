'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Book, Target, Plus, X } from 'lucide-react';

export default function AdditionRepeteeCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [transformationStep, setTransformationStep] = useState<'addition' | 'grouping' | 'counting' | 'multiplication' | null>(null);
  const [animatingNumbers, setAnimatingNumbers] = useState(false);
  const [currentAdditionStep, setCurrentAdditionStep] = useState(0);
  
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

  // Exemples d'addition répétée
  const additionExamples = [
    { 
      item: '🐸', 
      additionCount: 4,
      numberToAdd: 3, 
      result: 12, 
      description: 'grenouilles',
      story: '4 étangs avec 3 grenouilles chacun',
      additionString: '3 + 3 + 3 + 3',
      multiplicationString: '4 × 3'
    },
    { 
      item: '🌺', 
      additionCount: 5,
      numberToAdd: 2, 
      result: 10, 
      description: 'fleurs',
      story: '5 bouquets de 2 fleurs chacun',
      additionString: '2 + 2 + 2 + 2 + 2',
      multiplicationString: '5 × 2'
    },
    { 
      item: '🍓', 
      additionCount: 3,
      numberToAdd: 6, 
      result: 18, 
      description: 'fraises',
      story: '3 barquettes de 6 fraises chacune',
      additionString: '6 + 6 + 6',
      multiplicationString: '3 × 6'
    },
    { 
      item: '🐝', 
      additionCount: 6,
      numberToAdd: 2, 
      result: 12, 
      description: 'abeilles',
      story: '6 ruches avec 2 abeilles chacune',
      additionString: '2 + 2 + 2 + 2 + 2 + 2',
      multiplicationString: '6 × 2'
    }
  ];

  // Exercices sur l'addition répétée
  const exercises = [
    { 
      question: 'Qu\'est-ce que l\'addition répétée ?', 
      correctAnswer: 'Additionner le même nombre plusieurs fois',
      choices: ['Additionner des nombres différents', 'Additionner le même nombre plusieurs fois', 'Soustraire des nombres']
    },
    { 
      question: 'Que vaut 2 + 2 + 2 + 2 ?', 
      correctAnswer: '8',
      choices: ['6', '8', '10'],
      visual: '2 + 2 + 2 + 2 = ?'
    },
    { 
      question: 'Combien de fois additionne-t-on 3 dans : 3 + 3 + 3 + 3 + 3 ?', 
      correctAnswer: '5',
      choices: ['4', '5', '6'],
      visual: '3 + 3 + 3 + 3 + 3'
    },
    { 
      question: 'Quelle multiplication correspond à 4 + 4 + 4 ?', 
      correctAnswer: '3 × 4',
      choices: ['4 × 3', '3 × 4', '4 × 4'],
      visual: '4 + 4 + 4 = ? × ?'
    },
    { 
      question: 'Que vaut 5 + 5 + 5 + 5 ?', 
      correctAnswer: '20',
      choices: ['15', '20', '25'],
      visual: '5 + 5 + 5 + 5 = ?'
    },
    { 
      question: 'Quelle addition répétée correspond à 4 × 3 ?', 
      correctAnswer: '3 + 3 + 3 + 3',
      choices: ['4 + 4 + 4', '3 + 3 + 3 + 3', '4 + 3 + 4 + 3'],
      visual: '4 × 3 = ? + ? + ? + ?'
    },
    { 
      question: 'Combien font 6 + 6 + 6 ?', 
      correctAnswer: '18',
      choices: ['12', '18', '24'],
      visual: '6 + 6 + 6 = ?'
    },
    { 
      question: 'Quel est l\'avantage de la multiplication sur l\'addition répétée ?', 
      correctAnswer: 'C\'est plus rapide à écrire',
      choices: ['C\'est plus difficile', 'C\'est plus rapide à écrire', 'C\'est moins précis']
    }
  ];

  // Fonction pour attendre
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Fonction pour défiler vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setTransformationStep(null);
    setAnimatingNumbers(false);
    setCurrentAdditionStep(0);
  };

  // Fonction pour jouer l'audio
  const playAudio = async (text: string, slowMode = false) => {
    if (stopSignalRef.current) return;
    
    return new Promise<void>((resolve) => {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const setVoiceAndSpeak = () => {
        const voices = speechSynthesis.getVoices();
        const frenchFemaleVoice = voices.find(voice => 
          voice.lang.startsWith('fr') && voice.name.toLowerCase().includes('female')
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

  // Fonction principale d'explication
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
      await playAudio("Bonjour ! Aujourd'hui, nous découvrons le lien entre l'addition et la multiplication !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("L'addition répétée, c'est additionner le même nombre plusieurs fois de suite !", true);
      if (stopSignalRef.current) return;
      
      // 2. Exemple simple
      await wait(1500);
      setHighlightedElement('examples');
      scrollToSection('examples-section');
      await playAudio("Par exemple, 3 plus 3 plus 3 plus 3, c'est additionner 4 fois le nombre 3 !", true);
      if (stopSignalRef.current) return;
      
      // 3. Animation de transformation
      await wait(1800);
      setHighlightedElement('transformation');
      scrollToSection('animation-section');
      await playAudio("Regardons comment transformer une addition répétée en multiplication !", true);
      if (stopSignalRef.current) return;
      
      await animateTransformation(0);
      if (stopSignalRef.current) return;
      
      // 4. Avantages
      await wait(1500);
      setHighlightedElement('avantages');
      scrollToSection('avantages-section');
      await playAudio("La multiplication, c'est comme un raccourci magique pour l'addition répétée !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setTransformationStep(null);
      setAnimatingNumbers(false);
      setCurrentAdditionStep(0);
      setIsAnimationRunning(false);
    }
  };

  // Animation de transformation addition → multiplication
  const animateTransformation = async (index: number) => {
    const example = additionExamples[index];
    setCurrentExample(index);
    
    try {
      // Étape 1: Montrer l'addition longue
      setTransformationStep('addition');
      setAnimatingNumbers(true);
      await playAudio(`Commençons par l'addition : ${example.additionString}`, true);
      if (stopSignalRef.current) return;
      
      // Animation progressive de l'addition
      for (let i = 0; i <= example.additionCount; i++) {
        setCurrentAdditionStep(i);
        await wait(800);
        if (stopSignalRef.current) return;
      }
      
      await wait(1500);
      
      // Étape 2: Grouper visuellement
      setTransformationStep('grouping');
      await playAudio(`On voit qu'on additionne ${example.additionCount} fois le nombre ${example.numberToAdd}`, true);
      if (stopSignalRef.current) return;
      
      await wait(2500);
      
      // Étape 3: Montrer le comptage
      setTransformationStep('counting');
      await playAudio(`${example.additionCount} fois ${example.numberToAdd}, ça fait ${example.result} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      
      // Étape 4: Révéler la multiplication
      setTransformationStep('multiplication');
      await playAudio(`Au lieu d'écrire cette longue addition, on peut écrire : ${example.multiplicationString} égale ${example.result} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      await playAudio("C'est beaucoup plus court et plus élégant !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
    } finally {
      setAnimatingNumbers(false);
      setCurrentAdditionStep(0);
    }
  };

  // Fonctions pour les exercices
  const checkAnswer = () => {
    const exercise = exercises[currentExercise];
    const correct = userAnswer === exercise.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
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

  const getCompletionMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "🏆 Incroyable ! Tu comprends parfaitement l'addition répétée !";
    if (percentage >= 80) return "🌟 Excellent ! Tu fais bien le lien entre addition et multiplication !";
    if (percentage >= 60) return "👍 Bien joué ! Continue à t'entraîner !";
    return "💪 C'est un bon début ! Refais les exercices pour mieux comprendre !";
  };

  // Effets
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stopAllVocalsAndAnimations();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
      <div className="text-xl text-purple-600">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/cp-multiplications-simples"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={stopAllVocalsAndAnimations}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au chapitre</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              🔄 Addition répétée
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
                  ? 'bg-purple-500 text-white shadow-md' 
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
                  ? 'bg-indigo-500 text-white shadow-md' 
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
            {/* Bouton principal */}
            <div className="text-center mb-6">
              <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ DÉCOUVRIR L\'ADDITION RÉPÉTÉE !'}
              </button>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'intro' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Qu'est-ce que l'addition répétée ?
              </h2>
              <div className="text-lg text-gray-700 space-y-4">
                <p className="text-center">
                  L'addition répétée, c'est <span className="font-bold text-purple-600">additionner le même nombre plusieurs fois</span> !
                </p>
                <div className="bg-purple-100 rounded-xl p-6 border-2 border-purple-200">
                  <div className="text-center">
                    <div className="text-2xl font-mono mb-4">2 + 2 + 2 + 2 + 2</div>
                    <p className="text-purple-700">
                      Ici, on additionne <span className="font-bold">5 fois</span> le nombre <span className="font-bold">2</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples simples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples' ? 'ring-4 ring-indigo-400 bg-indigo-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📝 Exemples d'additions répétées
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-100 rounded-xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                    3 + 3 + 3 + 3 = 12
                  </h3>
                  <div className="text-center space-y-3">
                    <div className="text-green-700">On additionne <strong>4 fois</strong> le nombre <strong>3</strong></div>
                    <div className="flex justify-center space-x-2">
                      {[1,2,3,4].map(group => (
                        <div key={group} className="bg-white rounded-lg p-2 border border-green-300">
                          <div className="text-2xl">🍎🍎🍎</div>
                          <div className="text-xs text-green-600">3 pommes</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-green-800 font-bold">= 12 pommes en tout</div>
                  </div>
                </div>
                
                <div className="bg-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                    5 + 5 + 5 = 15
                  </h3>
                  <div className="text-center space-y-3">
                    <div className="text-blue-700">On additionne <strong>3 fois</strong> le nombre <strong>5</strong></div>
                    <div className="flex justify-center space-x-2">
                      {[1,2,3].map(group => (
                        <div key={group} className="bg-white rounded-lg p-2 border border-blue-300">
                          <div className="text-2xl">⭐⭐⭐⭐⭐</div>
                          <div className="text-xs text-blue-600">5 étoiles</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-blue-800 font-bold">= 15 étoiles en tout</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone d'animation transformation */}
            <div 
              id="animation-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'transformation' ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎬 Transformation magique : Addition → Multiplication
              </h2>
              
              {currentExample !== null && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {additionExamples[currentExample].story}
                    </h3>
                  </div>

                  {/* Zone de transformation */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-200 min-h-96">
                    
                    {/* Étape 1: Addition longue */}
                    {transformationStep === 'addition' && (
                      <div className="text-center space-y-6">
                        <p className="text-xl font-semibold text-gray-700 mb-6">
                          D'abord, écrivons l'addition longue :
                        </p>
                        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                          <div className="flex justify-center items-center space-x-3 text-3xl font-mono">
                            {Array.from({length: additionExamples[currentExample].additionCount}).map((_, i) => (
                              <div key={i} className="flex items-center">
                                <span 
                                  className={`transition-all duration-500 ${
                                    i < currentAdditionStep ? 'text-blue-600 font-bold transform scale-110' : 'text-gray-400'
                                  }`}
                                >
                                  {additionExamples[currentExample].numberToAdd}
                                </span>
                                {i < additionExamples[currentExample].additionCount - 1 && (
                                  <Plus className={`w-6 h-6 mx-2 ${
                                    i < currentAdditionStep - 1 ? 'text-purple-600' : 'text-gray-400'
                                  }`} />
                                )}
                              </div>
                            ))}
                            <span className="mx-4 text-gray-600">=</span>
                            <span className={`${
                              currentAdditionStep > additionExamples[currentExample].additionCount 
                                ? 'text-green-600 font-bold animate-pulse' 
                                : 'text-gray-400'
                            }`}>
                              {additionExamples[currentExample].result}
                            </span>
                          </div>
                        </div>
                        {currentAdditionStep > additionExamples[currentExample].additionCount && (
                          <p className="text-lg text-green-700 font-semibold animate-bounce">
                            C'est long à écrire ! 😅
                          </p>
                        )}
                      </div>
                    )}

                    {/* Étape 2: Groupement visuel */}
                    {transformationStep === 'grouping' && (
                      <div className="text-center space-y-6">
                        <p className="text-xl font-semibold text-gray-700">
                          Regardons de plus près cette addition :
                        </p>
                        <div className="bg-blue-100 rounded-xl p-6 border-2 border-blue-300">
                          <div className="space-y-4">
                            <div className="text-2xl font-mono text-blue-800">
                              {additionExamples[currentExample].additionString}
                            </div>
                            <div className="flex justify-center space-x-4">
                              {Array.from({length: additionExamples[currentExample].additionCount}).map((_, groupIndex) => (
                                <div key={groupIndex} className="bg-white rounded-lg p-3 border-2 border-blue-200 transform hover:scale-105 transition-all">
                                  <div className="text-2xl mb-2">
                                    {Array.from({length: additionExamples[currentExample].numberToAdd}).map((_, itemIndex) => (
                                      <span key={itemIndex}>{additionExamples[currentExample].item}</span>
                                    ))}
                                  </div>
                                  <div className="text-sm text-blue-600 font-semibold">
                                    {additionExamples[currentExample].numberToAdd}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="text-lg text-blue-700">
                              On additionne <span className="font-bold text-blue-900">{additionExamples[currentExample].additionCount} fois</span> le nombre <span className="font-bold text-blue-900">{additionExamples[currentExample].numberToAdd}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Étape 3: Comptage */}
                    {transformationStep === 'counting' && (
                      <div className="text-center space-y-6">
                        <p className="text-xl font-semibold text-gray-700">
                          Comptons le résultat :
                        </p>
                        <div className="bg-green-100 rounded-xl p-6 border-2 border-green-300">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {Array.from({length: additionExamples[currentExample].additionCount}).map((_, groupIndex) => (
                              <div key={groupIndex} className="bg-white rounded-lg p-3 border-2 border-green-200">
                                <div className="text-2xl mb-2">
                                  {Array.from({length: additionExamples[currentExample].numberToAdd}).map((_, itemIndex) => (
                                    <span key={itemIndex} className="animate-pulse">{additionExamples[currentExample].item}</span>
                                  ))}
                                </div>
                                <div className="text-sm text-green-600 font-semibold">
                                  Groupe {groupIndex + 1} : {additionExamples[currentExample].numberToAdd}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-2xl font-bold text-green-800">
                            Total : {additionExamples[currentExample].result} {additionExamples[currentExample].description}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Étape 4: Multiplication révélée */}
                    {transformationStep === 'multiplication' && (
                      <div className="text-center space-y-6">
                        <p className="text-xl font-semibold text-gray-700">
                          La solution magique : la multiplication !
                        </p>
                        <div className="space-y-6">
                          {/* Comparaison avant/après */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-red-100 rounded-xl p-6 border-2 border-red-200">
                              <h3 className="text-lg font-bold text-red-800 mb-4">❌ Addition longue</h3>
                              <div className="text-xl font-mono text-red-700 mb-2">
                                {additionExamples[currentExample].additionString}
                              </div>
                              <div className="text-red-600">Long à écrire !</div>
                            </div>
                            <div className="bg-green-100 rounded-xl p-6 border-2 border-green-200">
                              <h3 className="text-lg font-bold text-green-800 mb-4">✅ Multiplication courte</h3>
                              <div className="text-3xl font-mono text-green-700 mb-2 flex items-center justify-center">
                                <span>{additionExamples[currentExample].additionCount}</span>
                                <X className="w-6 h-6 mx-2" />
                                <span>{additionExamples[currentExample].numberToAdd}</span>
                                <span className="mx-2">=</span>
                                <span className="animate-pulse">{additionExamples[currentExample].result}</span>
                              </div>
                              <div className="text-green-600">Rapide et élégant !</div>
                            </div>
                          </div>
                          
                          <div className="bg-purple-100 rounded-xl p-6 border-2 border-purple-300">
                            <div className="text-2xl font-bold text-purple-800 mb-4">
                              🎉 Transformation réussie !
                            </div>
                            <div className="text-lg text-purple-700">
                              {additionExamples[currentExample].additionString} = {additionExamples[currentExample].multiplicationString} = {additionExamples[currentExample].result}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Boutons pour tester d'autres exemples */}
                  <div className="flex justify-center space-x-4">
                    {additionExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => !isAnimationRunning && animateTransformation(index)}
                        disabled={isAnimationRunning}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          isAnimationRunning 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : currentExample === index 
                              ? 'bg-yellow-400 text-yellow-900 border-2 border-yellow-600' 
                              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {example.item} {example.description}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avantages de la multiplication */}
            <div 
              id="avantages-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'avantages' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ⭐ Pourquoi préférer la multiplication ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">✏️</div>
                  <h3 className="font-bold text-blue-800 mb-3">Plus court</h3>
                  <p className="text-blue-700 mb-4">
                    3 × 4 = 12 au lieu de 3 + 3 + 3 + 3 = 12
                  </p>
                  <div className="text-sm text-blue-600">Moins de calculs à écrire !</div>
                </div>
                <div className="bg-purple-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-bold text-purple-800 mb-3">Plus rapide</h3>
                  <p className="text-purple-700 mb-4">
                    On trouve le résultat plus vite
                  </p>
                  <div className="text-sm text-purple-600">Gain de temps précieux !</div>
                </div>
                <div className="bg-green-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-bold text-green-800 mb-3">Plus précis</h3>
                  <p className="text-green-700 mb-4">
                    Moins de risque de se tromper
                  </p>
                  <div className="text-sm text-green-600">Moins d'erreurs de calcul !</div>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                🎯 Ce qu'il faut retenir
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-semibold">Addition répétée</div>
                  <div className="text-sm">Même nombre plusieurs fois</div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-semibold">Transformation</div>
                  <div className="text-sm">Addition → Multiplication</div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold">Efficacité</div>
                  <div className="text-sm">Plus rapide et plus court</div>
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
                <div className="text-lg font-semibold text-indigo-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <div className="text-xl text-center font-semibold text-indigo-800">
                      {exercises[currentExercise].question}
                    </div>
                    {exercises[currentExercise].visual && (
                      <div className="text-center mt-4 text-xl bg-white rounded-lg p-4 border border-indigo-200 font-mono">
                        {exercises[currentExercise].visual}
                      </div>
                    )}
                  </div>

                  {/* Choix de réponses */}
                  <div className="space-y-3">
                    {exercises[currentExercise].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(choice)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          userAnswer === choice
                            ? 'border-indigo-500 bg-indigo-100 text-indigo-800'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            userAnswer === choice ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'
                          }`}>
                            {userAnswer === choice && (
                              <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                            )}
                          </div>
                          <span className="text-lg">{choice}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Bouton validation */}
                  <div className="text-center">
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                      className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Vérifier ma réponse
                    </button>
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
                          {isCorrect ? 'Parfait !' : 'Pas tout à fait...'}
                        </span>
                      </div>
                      <div className="font-semibold mb-3">
                        {isCorrect 
                          ? "Tu comprends bien l'addition répétée !"
                          : `La bonne réponse était : "${exercises[currentExercise].correctAnswer}"`
                        }
                      </div>
                      
                      <button
                        onClick={nextExercise}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600"
                      >
                        {currentExercise < exercises.length - 1 ? 'Question suivante' : 'Voir mes résultats'}
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
                  <div className="text-2xl font-bold text-indigo-600">
                    Score final : {finalScore} / {exercises.length}
                  </div>
                  <div className="text-lg text-gray-700">
                    {getCompletionMessage(finalScore, exercises.length)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
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