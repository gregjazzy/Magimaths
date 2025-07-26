'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, Play, Pause, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function SensAdditionCP() {
  // États pour les animations
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showObjectsGroup1, setShowObjectsGroup1] = useState(0);
  const [showObjectsGroup2, setShowObjectsGroup2] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState('objets'); // objets, nombres, quotidien
  
  // États pour les onglets et exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États vocaux (basés sur reconnaissance)
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  const welcomeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseInstructionGivenRef = useRef(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  
  // Exemples d'addition
  const examples = {
    objets: [
      { group1: 2, group2: 3, items: '🍎', result: 5, description: 'pommes' },
      { group1: 1, group2: 4, items: '🚗', result: 5, description: 'voitures' },
      { group1: 3, group2: 2, items: '⭐', result: 5, description: 'étoiles' },
      { group1: 2, group2: 1, items: '🎾', result: 3, description: 'balles' }
    ],
    nombres: [
      { group1: 2, group2: 3, result: 5 },
      { group1: 1, group2: 4, result: 5 },
      { group1: 4, group2: 1, result: 5 },
      { group1: 3, group2: 3, result: 6 }
    ],
    quotidien: [
      { situation: 'Tu as 2 bonbons et maman te donne 3 bonbons de plus', group1: 2, group2: 3, result: 5, item: '🍬' },
      { situation: 'Il y a 1 chat dans le jardin, puis 2 autres chats arrivent', group1: 1, group2: 2, result: 3, item: '🐱' },
      { situation: 'Papa met 3 assiettes sur la table et ajoute 2 assiettes', group1: 3, group2: 2, result: 5, item: '🍽️' }
    ]
  };

  const [currentExample, setCurrentExample] = useState(0);

  // Exercices sur le sens de l'addition
  const exercises = [
    { 
      question: 'Que veut dire "additionner" ?', 
      visual: '🍎 + 🍎 = 🍎🍎',
      correctAnswer: 'Mettre ensemble',
      choices: ['Mettre ensemble', 'Enlever', 'Couper en deux']
    },
    { 
      question: 'Que fait-on quand on ajoute 2 objets à 3 objets ?', 
      visual: '🚗🚗 + 🚗🚗🚗 = ?',
      correctAnswer: 'On les met ensemble',
      choices: ['On les cache', 'On les met ensemble', 'On les sépare']
    },
    { 
      question: 'Combien de pommes en tout ?', 
      visual: '🍎🍎 + 🍎🍎🍎 = ?',
      correctAnswer: '5',
      choices: ['4', '5', '6']
    },
    { 
      question: 'Comment écrit-on cette addition ?', 
      visual: '⭐⭐ et ⭐⭐⭐⭐',
      correctAnswer: '2 + 4',
      choices: ['2 + 4', '2 - 4', '4 + 2']
    },
    { 
      question: 'Tu as 3 bonbons, maman te donne 2 bonbons. Combien en as-tu ?', 
      visual: '🍬🍬🍬 + 🍬🍬 = ?',
      correctAnswer: '5',
      choices: ['3', '5', '2']
    },
    { 
      question: 'Que représente le signe + ?', 
      visual: '1 + 1 = 2',
      correctAnswer: 'Ajouter',
      choices: ['Enlever', 'Ajouter', 'Égaler']
    },
    { 
      question: 'Combien de ballons en tout ?', 
      visual: '🎈 + 🎈🎈🎈 = ?',
      correctAnswer: '4',
      choices: ['3', '4', '5']
    },
    { 
      question: 'Dans 2 + 3 = 5, que représente le 5 ?', 
      visual: '2 + 3 = 5',
      correctAnswer: 'Le résultat',
      choices: ['Le début', 'Le résultat', 'Le signe']
    },
    { 
      question: 'Papa pose 1 assiette, puis 3 assiettes. Combien d\'assiettes ?', 
      visual: '🍽️ + 🍽️🍽️🍽️ = ?',
      correctAnswer: '4',
      choices: ['4', '3', '1']
    },
    { 
      question: 'Quelle est la bonne addition pour ces objets ?', 
      visual: '🌟🌟🌟 + 🌟🌟 = 🌟🌟🌟🌟🌟',
      correctAnswer: '3 + 2 = 5',
      choices: ['3 + 2 = 5', '2 + 2 = 4', '3 + 3 = 6']
    }
  ];

  // Fonctions vocales (basées sur reconnaissance)
  const playAudioSequence = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const stopVocal = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    // Reset animation states specific to this chapter
    setShowObjectsGroup1(0);
    setShowObjectsGroup2(0);
    setShowResult(false);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  // Fonction d'introduction aux exercices (vocal court)
  const explainExercisesOnce = async () => {
    if (exerciseInstructionGivenRef.current) return;
    
    try {
      speechSynthesis.cancel();
      exerciseInstructionGivenRef.current = true;
      setExerciseInstructionGiven(true);
      setIsPlayingVocal(true);
      
      await wait(300);
      
      await playAudioSequence("Parfait ! Maintenant, place aux exercices sur le sens de l'addition !");
      await wait(1000);
      
      await playAudioSequence("Tu vas répondre à des questions pour montrer que tu comprends ce que veut dire 'additionner' !");
      await wait(1200);
      
      await playAudioSequence("Clique sur la bonne réponse. C'est parti !");
      
    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Gérer les réponses aux exercices
  const handleAnswerClick = (answer: string) => {
    if (isCorrect !== null) return;
    
    speechSynthesis.cancel();
    setIsPlayingVocal(false);
    
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    setUserAnswer(answer);

    if (correct) {
      const newAnsweredCorrectly = new Set(answeredCorrectly);
      newAnsweredCorrectly.add(currentExercise);
      setAnsweredCorrectly(newAnsweredCorrectly);
      setScore(newAnsweredCorrectly.size);
    }
  };

  // Passer à l'exercice suivant
  const nextExercise = () => {
    speechSynthesis.cancel();
    setIsPlayingVocal(false);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setIsCorrect(null);
      setUserAnswer('');
    } else {
      // Fin des exercices
      setFinalScore(answeredCorrectly.size + (isCorrect ? 1 : 0));
      setShowCompletionModal(true);
    }
  };

  // Redémarrer les exercices
  const restartExercises = () => {
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setIsCorrect(null);
    setUserAnswer('');
    setShowCompletionModal(false);
    exerciseInstructionGivenRef.current = false;
    setExerciseInstructionGiven(false);
  };

  // Gestion des useEffect (identique à reconnaissance)
  useEffect(() => {
    if (!hasStarted) {
      welcomeTimerRef.current = setTimeout(() => {
        if (!hasStartedRef.current) {
          const utterance = new SpeechSynthesisUtterance("Salut ! Clique sur le bouton violet pour découvrir ce que veut dire additionner !");
          utterance.lang = 'fr-FR';
          utterance.rate = 1.0;
          speechSynthesis.speak(utterance);
        }
      }, 1000);
    }

    return () => {
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    };
  }, [hasStarted]);

  // Effect pour gérer la visibilité de la page et les sorties
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopVocal();
      }
    };

    const handleBeforeUnload = () => {
      stopVocal();
    };

    const handlePageHide = () => {
      stopVocal();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      stopVocal();
    };
  }, []);

  // Effect pour gérer le passage aux exercices
  useEffect(() => {
    if (showExercises && !exerciseInstructionGiven) {
      const timer = setTimeout(() => {
        explainExercisesOnce();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [showExercises, exerciseInstructionGiven]);

  // Explication complète du concept avec animations
  const explainAdditionConcept = async () => {
    setHasStarted(true);
    hasStartedRef.current = true;
    
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }

    try {
      setIsPlayingVocal(true);
      setIsAnimating(true);
      
      // Introduction
      await playAudioSequence("Bonjour ! Je vais t'expliquer ce que veut dire 'additionner' !");
      await wait(1000);
      
      // Concept de base
      setHighlightedElement('concept-title');
      await playAudioSequence("Additionner, ça veut dire mettre ensemble, ajouter des choses !");
      await wait(2000);
      setHighlightedElement(null);
      
      // Animation avec objets
      setSelectedConcept('objets');
      setCurrentExample(0);
      await wait(500);
      
      setHighlightedElement('animation-area');
      await playAudioSequence("Regarde cette animation ! Je vais te montrer avec des pommes !");
      await wait(2000);
      setHighlightedElement(null);
      
      // Démo étape par étape
      await demonstrateAddition();
      
      // Instructions sur les autres modes disponibles
      await wait(1000);
      await playAudioSequence("Tu peux aussi essayer avec d'autres modes d'explication !");
      await wait(1500);
      
      // Mettre en surbrillance la case "Avec des nombres"
      setHighlightedElement('nombres-mode');
      await playAudioSequence("Tu peux essayer avec des nombres !");
      await wait(1500);
      setHighlightedElement(null);
      
      await wait(500);
      
      // Mettre en surbrillance la case "Situations quotidiennes"
      setHighlightedElement('quotidien-mode');
      await playAudioSequence("Ou avec des situations de la vie de tous les jours !");
      await wait(1500);
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainAdditionConcept:', error);
    } finally {
      setIsPlayingVocal(false);
      setIsAnimating(false);
    }
  };

  // Démonstration animée d'une addition
  const demonstrateAddition = async () => {
    const example = examples[selectedConcept][currentExample];
    
    try {
      setCurrentStep(0);
      setShowObjectsGroup1(0);
      setShowObjectsGroup2(0);
      setShowResult(false);
      
      // Étape 1: Premier groupe
      setCurrentStep(1);
      await playAudioSequence(`D'abord, je mets ${example.group1} ${example.description || 'objets'} ici !`);
      
      for (let i = 1; i <= example.group1; i++) {
        setShowObjectsGroup1(i);
        await wait(800);
      }
      await wait(1000);
      
      // Étape 2: Deuxième groupe
      setCurrentStep(2);
      await playAudioSequence(`Maintenant, j'ajoute ${example.group2} ${example.description || 'objets'} de plus !`);
      
      for (let i = 1; i <= example.group2; i++) {
        setShowObjectsGroup2(i);
        await wait(800);
      }
      await wait(1000);
      
      // Étape 3: Compter ensemble
      setCurrentStep(3);
      await playAudioSequence("Maintenant, comptons tout ensemble !");
      
      // Animation de comptage
      setHighlightedElement('group1');
      await wait(500);
      setHighlightedElement('group2');
      await wait(500);
      setHighlightedElement(null);
      
      // Résultat
      setCurrentStep(4);
      setShowResult(true);
      await playAudioSequence(`En tout, j'ai ${example.result} ${example.description || 'objets'} !`);
      await wait(1500);
      
      // Explication mathématique
      if (selectedConcept === 'objets') {
        await playAudioSequence(`En mathématiques, on écrit : ${example.group1} plus ${example.group2} égale ${example.result} !`);
        await wait(2000);
      }
      
    } catch (error) {
      console.error('Erreur dans demonstrateAddition:', error);
    }
  };

  // Changer de concept
  const switchConcept = async (concept: string) => {
    stopVocal();
    setSelectedConcept(concept);
    setCurrentExample(0);
    
    try {
      setIsPlayingVocal(true);
      
      if (concept === 'nombres') {
        await playAudioSequence("Maintenant, voyons avec des nombres sans objets !");
      } else if (concept === 'quotidien') {
        await playAudioSequence("Et maintenant, des exemples de la vie de tous les jours !");
      } else {
        await playAudioSequence("Revenons aux objets concrets pour bien comprendre !");
      }
      
    } catch (error) {
      console.error('Erreur dans switchConcept:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Changer d'exemple
  const changeExample = () => {
    const maxExamples = examples[selectedConcept].length;
    setCurrentExample((currentExample + 1) % maxExamples);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-additions-simples" 
            onClick={stopVocal}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux additions simples</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" id="concept-title">
              ➕ Le sens de l'addition
            </h1>
            <p className="text-lg text-gray-600">
              Découvre ce que veut dire "additionner" avec des objets et des animations !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopVocal();
                setShowExercises(false);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                !showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                stopVocal();
                setShowExercises(true);
                exerciseInstructionGivenRef.current = false;
                setExerciseInstructionGiven(false);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Bouton d'explication avec guidage vocal */}
            {!hasStarted && (
              <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
                  ➕ Comprendre l'addition
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                  Découvre ce que veut dire "additionner" avec des animations !
                </p>
                <button
                  onClick={explainAdditionConcept}
                  disabled={isPlayingVocal}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all ${
                    isPlayingVocal
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 animate-bounce'
                  }`}
                >
                  {isPlayingVocal ? '🔊 Explication en cours...' : '▶️ COMMENCER !'}
                </button>
              </div>
            )}

            {/* Sélection du type de concept */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            🎯 Choisir le type d'explication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => switchConcept('objets')}
              className={`p-4 rounded-lg transition-all ${
                selectedConcept === 'objets' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <div className="text-3xl mb-2">🍎</div>
              <div className="font-bold">Avec des objets</div>
              <div className="text-sm">Pommes, voitures, étoiles...</div>
            </button>
            
            <button
              id="nombres-mode"
              onClick={() => switchConcept('nombres')}
              className={`p-4 rounded-lg transition-all ${
                selectedConcept === 'nombres' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } ${
                highlightedElement === 'nombres-mode' 
                  ? 'ring-4 ring-yellow-400 shadow-2xl scale-110 bg-yellow-200 text-black' 
                  : ''
              }`}
            >
              <div className="text-3xl mb-2">🔢</div>
              <div className="font-bold">Avec des nombres</div>
              <div className="text-sm">2 + 3 = 5</div>
            </button>
            
            <button
              id="quotidien-mode"
              onClick={() => switchConcept('quotidien')}
              className={`p-4 rounded-lg transition-all ${
                selectedConcept === 'quotidien' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } ${
                highlightedElement === 'quotidien-mode' 
                  ? 'ring-4 ring-yellow-400 shadow-2xl scale-110 bg-yellow-200 text-black' 
                  : ''
              }`}
            >
              <div className="text-3xl mb-2">🏠</div>
              <div className="font-bold">Situations quotidiennes</div>
              <div className="text-sm">À la maison, dehors...</div>
            </button>
          </div>
        </div>

        {/* Zone d'animation principale */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8" id="animation-area">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedConcept === 'objets' && '🎭 Animation avec objets'}
              {selectedConcept === 'nombres' && '🧮 Animation avec nombres'}
              {selectedConcept === 'quotidien' && '🌟 Situation de la vie quotidienne'}
            </h3>
            
            <div className="flex space-x-2">
              <button
                onClick={demonstrateAddition}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                disabled={isPlayingVocal}
              >
                <Play className="inline w-4 h-4 mr-2" />
                Lancer l'animation
              </button>
              
              <button
                onClick={changeExample}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="inline w-4 h-4 mr-2" />
                Autre exemple
              </button>
            </div>
          </div>

          {/* Affichage selon le type de concept */}
          {selectedConcept === 'objets' && (
            <div className="space-y-8">
              {/* Situation pour quotidien */}
              {selectedConcept === 'quotidien' && examples.quotidien[currentExample] && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                  <p className="text-lg text-gray-800">
                    📖 <strong>Situation :</strong> {examples.quotidien[currentExample].situation}
                  </p>
                </div>
              )}
              
              {/* Animation des objets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Premier groupe */}
                <div 
                  className={`text-center p-6 rounded-lg transition-all duration-500 ${
                    highlightedElement === 'group1' ? 'bg-purple-200 ring-4 ring-purple-400' : 'bg-purple-50'
                  }`}
                  id="group1"
                >
                  <h4 className="text-lg font-bold text-purple-800 mb-4">Premier groupe</h4>
                  <div className="text-6xl space-x-2">
                    {Array.from({ length: showObjectsGroup1 }, (_, i) => (
                      <span 
                        key={i} 
                        className="inline-block animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        {examples[selectedConcept][currentExample].items || '●'}
                      </span>
                    ))}
                  </div>
                  <div className="text-xl font-bold text-purple-800 mt-4">
                    {examples[selectedConcept][currentExample].group1}
                  </div>
                </div>

                {/* Symbole + */}
                <div className="text-center">
                  <div className={`text-8xl font-bold transition-all duration-500 ${
                    currentStep >= 2 ? 'text-green-500 scale-110' : 'text-gray-300'
                  }`}>
                    +
                  </div>
                </div>

                {/* Deuxième groupe */}
                <div 
                  className={`text-center p-6 rounded-lg transition-all duration-500 ${
                    highlightedElement === 'group2' ? 'bg-pink-200 ring-4 ring-pink-400' : 'bg-pink-50'
                  }`}
                  id="group2"
                >
                  <h4 className="text-lg font-bold text-pink-800 mb-4">Deuxième groupe</h4>
                  <div className="text-6xl space-x-2">
                    {Array.from({ length: showObjectsGroup2 }, (_, i) => (
                      <span 
                        key={i} 
                        className="inline-block animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        {examples[selectedConcept][currentExample].items || '●'}
                      </span>
                    ))}
                  </div>
                  <div className="text-xl font-bold text-pink-800 mt-4">
                    {examples[selectedConcept][currentExample].group2}
                  </div>
                </div>
              </div>

              {/* Résultat */}
              {showResult && (
                <div className="text-center">
                  <div className="bg-green-100 p-8 rounded-lg border-4 border-green-300 animate-pulse">
                    <h4 className="text-2xl font-bold text-green-800 mb-4">Résultat !</h4>
                    <div className="text-8xl mb-4">
                      {Array.from({ length: examples[selectedConcept][currentExample].result }, (_, i) => (
                        <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                          {examples[selectedConcept][currentExample].items || '●'}
                        </span>
                      ))}
                    </div>
                    <div className="text-4xl font-bold text-green-800">
                      {examples[selectedConcept][currentExample].group1} + {examples[selectedConcept][currentExample].group2} = {examples[selectedConcept][currentExample].result}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Affichage pour les nombres purs */}
          {selectedConcept === 'nombres' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
                <div className="text-8xl font-bold text-purple-600">
                  {examples.nombres[currentExample].group1}
                </div>
                <div className="text-6xl font-bold text-green-500">+</div>
                <div className="text-8xl font-bold text-pink-600">
                  {examples.nombres[currentExample].group2}
                </div>
                <div className="text-6xl font-bold text-blue-500">=</div>
                <div className={`text-8xl font-bold transition-all duration-500 ${
                  showResult ? 'text-green-600 scale-110' : 'text-gray-300'
                }`}>
                  {showResult ? examples.nombres[currentExample].result : '?'}
                </div>
              </div>
            </div>
          )}

          {/* Affichage pour les situations quotidiennes */}
          {selectedConcept === 'quotidien' && (
            <div className="space-y-8">
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <p className="text-xl text-gray-800 mb-4">
                  📖 <strong>Situation :</strong> {examples.quotidien[currentExample].situation}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <h4 className="text-lg font-bold text-purple-800 mb-4">Au début</h4>
                  <div className="text-6xl mb-4">
                    {Array.from({ length: showObjectsGroup1 }, (_, i) => (
                      <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                        {examples.quotidien[currentExample].item}
                      </span>
                    ))}
                  </div>
                  <div className="text-xl font-bold text-purple-800">
                    {examples.quotidien[currentExample].group1}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-6xl font-bold text-green-500">+</div>
                  <div className="text-sm text-gray-600 mt-2">on ajoute</div>
                </div>

                <div className="text-center p-6 bg-pink-50 rounded-lg">
                  <h4 className="text-lg font-bold text-pink-800 mb-4">En plus</h4>
                  <div className="text-6xl mb-4">
                    {Array.from({ length: showObjectsGroup2 }, (_, i) => (
                      <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                        {examples.quotidien[currentExample].item}
                      </span>
                    ))}
                  </div>
                  <div className="text-xl font-bold text-pink-800">
                    {examples.quotidien[currentExample].group2}
                  </div>
                </div>
              </div>

              {showResult && (
                <div className="text-center">
                  <div className="bg-green-100 p-8 rounded-lg border-4 border-green-300">
                    <h4 className="text-2xl font-bold text-green-800 mb-4">En tout, tu as :</h4>
                    <div className="text-8xl mb-4">
                      {Array.from({ length: examples.quotidien[currentExample].result }, (_, i) => (
                        <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                          {examples.quotidien[currentExample].item}
                        </span>
                      ))}
                    </div>
                    <div className="text-3xl font-bold text-green-800">
                      {examples.quotidien[currentExample].result} {examples.quotidien[currentExample].item}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Récapitulatif des étapes */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📚 Les étapes de l'addition
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg text-center transition-all ${
              currentStep >= 1 ? 'bg-purple-100 border-purple-300 border-2' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">1️⃣</div>
              <div className="font-bold text-purple-800">Je prends</div>
              <div className="text-sm text-gray-600">le premier groupe</div>
            </div>
            
            <div className={`p-4 rounded-lg text-center transition-all ${
              currentStep >= 2 ? 'bg-pink-100 border-pink-300 border-2' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">2️⃣</div>
              <div className="font-bold text-pink-800">J'ajoute</div>
              <div className="text-sm text-gray-600">le deuxième groupe</div>
            </div>
            
            <div className={`p-4 rounded-lg text-center transition-all ${
              currentStep >= 3 ? 'bg-blue-100 border-blue-300 border-2' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">3️⃣</div>
              <div className="font-bold text-blue-800">Je compte</div>
              <div className="text-sm text-gray-600">tout ensemble</div>
            </div>
            
            <div className={`p-4 rounded-lg text-center transition-all ${
              currentStep >= 4 ? 'bg-green-100 border-green-300 border-2' : 'bg-gray-100'
            }`}>
              <div className="text-3xl mb-2">4️⃣</div>
              <div className="font-bold text-green-800">J'ai le résultat</div>
              <div className="text-sm text-gray-600">le total !</div>
            </div>
          </div>
        </div>

        {/* Conseils pédagogiques */}
            <div className="mt-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                💡 Pour bien comprendre l'addition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">🤲</div>
                  <div className="font-bold">Utilise tes mains</div>
                  <div className="text-sm">Compte sur tes doigts</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🧸</div>
                  <div className="font-bold">Prends des objets</div>
                  <div className="text-sm">Jouets, crayons, bonbons...</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-6">
            {/* Exercice actuel */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  📝 Exercice {currentExercise + 1}/{exercises.length}
                </h2>
                <div className="text-lg font-bold text-purple-600">
                  Score: {score}/{exercises.length}
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                {/* Visuel de l'exercice */}
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-4">
                    {exercises[currentExercise].visual}
                  </div>
                </div>
              </div>

              {/* Choix de réponses */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {exercises[currentExercise].choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      isCorrect === null
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : choice === exercises[currentExercise].correctAnswer
                        ? 'bg-green-500 text-white'
                        : choice === userAnswer && isCorrect === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ? (
                    <span className="font-bold text-xl">🎉 Bravo ! C'est la bonne réponse !</span>
                  ) : (
                    <span className="font-bold text-xl">
                      ❌ Pas tout à fait... La bonne réponse était : {exercises[currentExercise].correctAnswer}
                    </span>
                  )}
                </div>
              )}

              {/* Bouton suivant */}
              {isCorrect !== null && (
                <div className="text-center">
                  <button
                    onClick={nextExercise}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
                  >
                    {currentExercise < exercises.length - 1 ? '➡️ Exercice suivant' : '🏁 Terminer'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 Exercices terminés !
              </h2>
              <div className="text-6xl mb-4">
                {finalScore === exercises.length ? '🏆' : finalScore >= exercises.length * 0.7 ? '⭐' : '💪'}
              </div>
              <p className="text-xl text-gray-700 mb-6">
                Tu as réussi <span className="font-bold text-purple-600">{finalScore}</span> exercices sur {exercises.length} !
              </p>
              <div className="space-y-3">
                <button
                  onClick={restartExercises}
                  className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors"
                >
                  🔄 Recommencer les exercices
                </button>
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    setShowExercises(false);
                  }}
                  className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  📖 Retour au cours
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 