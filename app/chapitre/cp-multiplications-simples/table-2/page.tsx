'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Book, Target, Volume2, Star } from 'lucide-react';

export default function Table2CP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentTableStep, setCurrentTableStep] = useState(0);
  const [showingPattern, setShowingPattern] = useState(false);
  const [animatingPairs, setAnimatingPairs] = useState(false);
  const [currentMultiplication, setCurrentMultiplication] = useState<number | null>(null);
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // Mode d'entraînement
  const [practiceMode, setPracticeMode] = useState<'progressive' | 'random' | 'timed'>('progressive');
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceStreak, setPracticeStreak] = useState(0);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Table de 2 complète
  const table2 = [
    { multiplication: '1 × 2', result: 2, visual: '👫', story: '1 paire = 2 personnes' },
    { multiplication: '2 × 2', result: 4, visual: '👫👫', story: '2 paires = 4 personnes' },
    { multiplication: '3 × 2', result: 6, visual: '👫👫👫', story: '3 paires = 6 personnes' },
    { multiplication: '4 × 2', result: 8, visual: '👫👫👫👫', story: '4 paires = 8 personnes' },
    { multiplication: '5 × 2', result: 10, visual: '👫👫👫👫👫', story: '5 paires = 10 personnes' },
    { multiplication: '6 × 2', result: 12, visual: '🦶🦶🦶🦶🦶🦶', story: '6 pieds = 12 orteils (2 chacun)' },
    { multiplication: '7 × 2', result: 14, visual: '👁️👁️👁️👁️👁️👁️👁️', story: '7 visages = 14 yeux' },
    { multiplication: '8 × 2', result: 16, visual: '🐕🐕🐕🐕🐕🐕🐕🐕', story: '8 chiens = 16 oreilles' },
    { multiplication: '9 × 2', result: 18, visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗', story: '9 vélos = 18 roues' },
    { multiplication: '10 × 2', result: 20, visual: '🖐️🖐️🖐️🖐️🖐️🖐️🖐️🖐️🖐️🖐️', story: '10 mains = 20 doigts' }
  ];

  // Exercices sur la table de 2
  const exercises = [
    { 
      question: 'Combien font 2 × 2 ?', 
      correctAnswer: '4',
      choices: ['2', '4', '6'],
      visual: '👫👫'
    },
    { 
      question: 'Combien font 5 × 2 ?', 
      correctAnswer: '10',
      choices: ['8', '10', '12'],
      visual: '5 paires'
    },
    { 
      question: 'Combien font 3 × 2 ?', 
      correctAnswer: '6',
      choices: ['4', '6', '8'],
      visual: '👫👫👫'
    },
    { 
      question: 'Si j\'ai 4 paires de chaussettes, combien ai-je de chaussettes ?', 
      correctAnswer: '8',
      choices: ['6', '8', '10'],
      visual: '🧦🧦 × 4'
    },
    { 
      question: 'Combien font 7 × 2 ?', 
      correctAnswer: '14',
      choices: ['12', '14', '16'],
      visual: '7 paires'
    },
    { 
      question: 'Combien font 1 × 2 ?', 
      correctAnswer: '2',
      choices: ['1', '2', '3'],
      visual: '👫'
    },
    { 
      question: 'Si j\'ai 6 vélos, combien ai-je de roues ?', 
      correctAnswer: '12',
      choices: ['10', '12', '14'],
      visual: '🚴‍♂️ (2 roues chacun)'
    },
    { 
      question: 'Combien font 8 × 2 ?', 
      correctAnswer: '16',
      choices: ['14', '16', '18'],
      visual: '8 paires'
    },
    { 
      question: 'Combien font 10 × 2 ?', 
      correctAnswer: '20',
      choices: ['18', '20', '22'],
      visual: '🖐️🖐️'
    },
    { 
      question: 'Dans la table de 2, tous les résultats sont...', 
      correctAnswer: 'Des nombres pairs',
      choices: ['Des nombres impairs', 'Des nombres pairs', 'Des nombres au hasard']
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
    setCurrentTableStep(0);
    setShowingPattern(false);
    setAnimatingPairs(false);
    setCurrentMultiplication(null);
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre la table de 2 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("La table de 2, c'est compter de 2 en 2 ! C'est magique car tout va par paires !", true);
      if (stopSignalRef.current) return;
      
      // 2. Concept des paires
      await wait(1500);
      setHighlightedElement('pairs');
      scrollToSection('pairs-section');
      await playAudio("Regardez autour de vous : nos yeux, nos mains, nos pieds... tout va par 2 !", true);
      if (stopSignalRef.current) return;
      
      // 3. Construction progressive de la table
      await wait(1800);
      setHighlightedElement('construction');
      scrollToSection('table-section');
      await playAudio("Construisons la table ensemble, étape par étape !", true);
      if (stopSignalRef.current) return;
      
      await animateTable();
      if (stopSignalRef.current) return;
      
      // 4. Pattern des nombres pairs
      await wait(1500);
      setHighlightedElement('pattern');
      scrollToSection('pattern-section');
      await playAudio("Avez-vous remarqué ? Tous les résultats sont des nombres pairs ! 2, 4, 6, 8, 10...", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setCurrentTableStep(0);
      setShowingPattern(false);
      setAnimatingPairs(false);
      setCurrentMultiplication(null);
      setIsAnimationRunning(false);
    }
  };

  // Animation de construction de la table
  const animateTable = async () => {
    setAnimatingPairs(true);
    
    for (let i = 0; i < table2.length; i++) {
      if (stopSignalRef.current) return;
      
      setCurrentTableStep(i + 1);
      setCurrentMultiplication(i);
      
      await playAudio(`${i + 1} fois 2 égale ${table2[i].result}. ${table2[i].story}`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
    }
    
    // Montrer le pattern complet
    setShowingPattern(true);
    await playAudio("Regardez cette belle suite : 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ! Ce sont tous des nombres pairs !", true);
    
    setAnimatingPairs(false);
  };

  // Fonction pour réciter la table
  const reciteTable = async () => {
    if (isPlayingVocal) {
      stopAllVocalsAndAnimations();
      return;
    }
    
    setIsPlayingVocal(true);
    
    for (let i = 0; i < table2.length; i++) {
      if (stopSignalRef.current) return;
      
      setCurrentMultiplication(i);
      await playAudio(`${i + 1} fois 2, ${table2[i].result}`, false);
      if (stopSignalRef.current) return;
      
      await wait(800);
    }
    
    setCurrentMultiplication(null);
    setIsPlayingVocal(false);
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
    if (percentage === 100) return "🏆 Incroyable ! Tu connais parfaitement la table de 2 !";
    if (percentage >= 80) return "🌟 Excellent ! Tu maîtrises bien la table de 2 !";
    if (percentage >= 60) return "👍 Bien joué ! Continue à t'entraîner !";
    return "💪 C'est un bon début ! Refais les exercices pour mémoriser !";
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
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-xl text-green-600">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
              2️⃣ Table de 2
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
                  ? 'bg-emerald-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ APPRENDRE LA TABLE DE 2 !'}
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
                🎯 Pourquoi la table de 2 ?
              </h2>
              <div className="text-lg text-gray-700 space-y-4">
                <p className="text-center">
                  La table de 2 est <span className="font-bold text-green-600">la plus facile</span> à apprendre !
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-100 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-3">👫</div>
                    <h3 className="font-bold text-green-800 mb-2">Tout va par paires</h3>
                    <p className="text-green-700 text-sm">Nos yeux, nos mains, nos pieds...</p>
                  </div>
                  <div className="bg-blue-100 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-3">🔢</div>
                    <h3 className="font-bold text-blue-800 mb-2">Compter de 2 en 2</h3>
                    <p className="text-blue-700 text-sm">2, 4, 6, 8, 10, 12...</p>
                  </div>
                  <div className="bg-purple-100 rounded-xl p-6 text-center">
                    <div className="text-3xl mb-3">🎵</div>
                    <h3 className="font-bold text-purple-800 mb-2">Facile à retenir</h3>
                    <p className="text-purple-700 text-sm">Comme une chanson !</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept des paires */}
            <div 
              id="pairs-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'pairs' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                👫 Le monde des paires
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">👀</div>
                  <div className="font-bold text-yellow-800">2 yeux</div>
                  <div className="text-sm text-yellow-600">sur ton visage</div>
                </div>
                <div className="bg-pink-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">👂👂</div>
                  <div className="font-bold text-pink-800">2 oreilles</div>
                  <div className="text-sm text-pink-600">pour écouter</div>
                </div>
                <div className="bg-orange-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">🖐️🖐️</div>
                  <div className="font-bold text-orange-800">2 mains</div>
                  <div className="text-sm text-orange-600">pour attraper</div>
                </div>
                <div className="bg-teal-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">🦶🦶</div>
                  <div className="font-bold text-teal-800">2 pieds</div>
                  <div className="text-sm text-teal-600">pour marcher</div>
                </div>
                <div className="bg-red-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">🧦🧦</div>
                  <div className="font-bold text-red-800">2 chaussettes</div>
                  <div className="text-sm text-red-600">une paire</div>
                </div>
                <div className="bg-indigo-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">👟👟</div>
                  <div className="font-bold text-indigo-800">2 chaussures</div>
                  <div className="text-sm text-indigo-600">une paire</div>
                </div>
                <div className="bg-purple-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">🚗</div>
                  <div className="font-bold text-purple-800">2 roues</div>
                  <div className="text-sm text-purple-600">sur un vélo</div>
                </div>
                <div className="bg-green-100 rounded-xl p-4 text-center">
                  <div className="text-4xl mb-2">🐈</div>
                  <div className="font-bold text-green-800">2 oreilles</div>
                  <div className="text-sm text-green-600">sur un chat</div>
                </div>
              </div>
            </div>

            {/* Construction de la table */}
            <div 
              id="table-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'construction' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🏗️ Construction de la table de 2
              </h2>
              
              <div className="space-y-6">
                {/* Bouton pour réciter */}
                <div className="text-center">
                  <button
                    onClick={reciteTable}
                    disabled={isAnimationRunning}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      isPlayingVocal 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    <Volume2 className="w-5 h-5 inline mr-2" />
                    {isPlayingVocal ? 'Arrêter la récitation' : 'Réciter la table de 2'}
                  </button>
                </div>

                {/* Table progressive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {table2.map((item, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                        currentMultiplication === index 
                          ? 'border-green-400 bg-green-100 transform scale-105' 
                          : index < currentTableStep || showingPattern
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className={`text-xl font-bold ${
                            currentMultiplication === index ? 'text-green-800' : 'text-gray-700'
                          }`}>
                            {item.multiplication} = {item.result}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{item.story}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl ${
                            currentMultiplication === index ? 'animate-bounce' : ''
                          }`}>
                            {item.visual}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pattern des nombres pairs */}
            <div 
              id="pattern-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'pattern' ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Le secret de la table de 2
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                    Tous les résultats sont des nombres PAIRS !
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((num, index) => (
                      <div 
                        key={num}
                        className={`w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-lg flex items-center justify-center transform transition-all duration-300 ${
                          showingPattern ? `animate-pulse delay-${index * 100}` : ''
                        }`}
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-blue-700 mt-4">
                    Les nombres pairs se terminent toujours par 0, 2, 4, 6 ou 8 !
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-100 rounded-xl p-6">
                    <h3 className="font-bold text-green-800 mb-3 text-center">✅ Trucs pour retenir</h3>
                    <ul className="space-y-2 text-green-700">
                      <li>• Compter de 2 en 2 : 2, 4, 6, 8...</li>
                      <li>• Penser aux paires d'objets</li>
                      <li>• Dire la table comme une chanson</li>
                      <li>• S'entraîner tous les jours</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-100 rounded-xl p-6">
                    <h3 className="font-bold text-yellow-800 mb-3 text-center">🎵 Chanson de la table</h3>
                    <div className="text-yellow-700 text-center space-y-1">
                      <div>Un fois deux, deux !</div>
                      <div>Deux fois deux, quatre !</div>
                      <div>Trois fois deux, six !</div>
                      <div>Quatre fois deux, huit !</div>
                      <div>Cinq fois deux, dix !</div>
                      <div className="text-sm mt-2">🎵 Sur un air joyeux !</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jeu d'entraînement rapide */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                🎯 Entraînement express
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                {[1,2,3,4,5].map(num => (
                  <div key={num} className="bg-white bg-opacity-90 rounded-lg p-3 text-gray-800">
                    <div className="font-bold text-lg">{num} × 2 = ?</div>
                    <div className="text-2xl font-bold text-green-600">{num * 2}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <div className="text-lg font-semibold">
                  🌟 Réfléchis avant de regarder la réponse !
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
                <div className="text-lg font-semibold text-emerald-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                    <div className="text-xl text-center font-semibold text-emerald-800">
                      {exercises[currentExercise].question}
                    </div>
                    {exercises[currentExercise].visual && (
                      <div className="text-center mt-4 text-2xl bg-white rounded-lg p-4 border border-emerald-200">
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
                            ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            userAnswer === choice ? 'border-emerald-500 bg-emerald-500' : 'border-gray-400'
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
                      className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          {isCorrect ? 'Bravo !' : 'Presque...'}
                        </span>
                      </div>
                      <div className="font-semibold mb-3">
                        {isCorrect 
                          ? "Tu maîtrises bien la table de 2 !"
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
                  <div className="text-2xl font-bold text-emerald-600">
                    Score final : {finalScore} / {exercises.length}
                  </div>
                  <div className="text-lg text-gray-700">
                    {getCompletionMessage(finalScore, exercises.length)}
                  </div>
                  <div className="flex justify-center space-x-4">
                                         <button
                       onClick={resetExercises}
                       className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 flex items-center gap-2"
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