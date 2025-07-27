'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star, Minus, ChevronDown, BookOpen, Search, Calculator, Eye } from 'lucide-react';

export default function ProblemesSoustraction() {
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

  // Données des problèmes avec animations
  const problemExamples = [
    {
      id: 'toys',
      title: 'Problème de jouets',
      story: 'Emma a 12 petites voitures. Elle en donne 5 à son frère.',
      question: 'Combien de petites voitures lui reste-t-il ?',
      operation: '12 - 5',
      result: 7,
      item: '🚗',
      color: 'text-blue-500',
      category: 'jouets',
      steps: [
        { phase: 'read', text: 'Je lis le problème attentivement' },
        { phase: 'understand', text: 'Emma avait 12 voitures, elle en donne 5' },
        { phase: 'calculate', text: '12 - 5 = 7' },
        { phase: 'verify', text: '7 + 5 = 12 ✓ C\'est correct !' }
      ]
    },
    {
      id: 'sweets',
      title: 'Problème de bonbons',
      story: 'Dans un sac, il y a 15 bonbons. Les enfants en mangent 8.',
      question: 'Combien de bonbons restent dans le sac ?',
      operation: '15 - 8',
      result: 7,
      item: '🍬',
      color: 'text-pink-500',
      category: 'nourriture',
      steps: [
        { phase: 'read', text: 'Je lis le problème avec attention' },
        { phase: 'understand', text: '15 bonbons au début, 8 sont mangés' },
        { phase: 'calculate', text: '15 - 8 = 7' },
        { phase: 'verify', text: '7 + 8 = 15 ✓ Parfait !' }
      ]
    },
    {
      id: 'animals',
      title: 'Problème d\'animaux',
      story: 'Dans une ferme, il y a 18 poules. 6 poules s\'envolent.',
      question: 'Combien de poules restent dans la ferme ?',
      operation: '18 - 6',
      result: 12,
      item: '🐔',
      color: 'text-yellow-500',
      category: 'animaux',
      steps: [
        { phase: 'read', text: 'Je lis le problème complètement' },
        { phase: 'understand', text: '18 poules dans la ferme, 6 s\'envolent' },
        { phase: 'calculate', text: '18 - 6 = 12' },
        { phase: 'verify', text: '12 + 6 = 18 ✓ Excellent !' }
      ]
    },
    {
      id: 'flowers',
      title: 'Problème de fleurs',
      story: 'Sophie cueille 14 fleurs dans le jardin. Elle en offre 9 à sa maman.',
      question: 'Combien de fleurs garde-t-elle pour elle ?',
      operation: '14 - 9',
      result: 5,
      item: '🌸',
      color: 'text-purple-500',
      category: 'nature',
      steps: [
        { phase: 'read', text: 'Je lis le problème tranquillement' },
        { phase: 'understand', text: 'Sophie a 14 fleurs, elle en donne 9' },
        { phase: 'calculate', text: '14 - 9 = 5' },
        { phase: 'verify', text: '5 + 9 = 14 ✓ C\'est juste !' }
      ]
    }
  ];

  // Exercices pour les élèves
  const exercises = [
    {
      story: 'Pierre a 11 billes. Il en perd 4 en jouant.',
      question: 'Combien de billes lui reste-t-il ?',
      operation: '11 - 4',
      answer: 7,
      item: '🔵',
      hint: 'Pierre commence avec 11 billes et en perd 4'
    },
    {
      story: 'Dans une classe, il y a 16 élèves. 7 élèves sortent en récréation.',
      question: 'Combien d\'élèves restent en classe ?',
      operation: '16 - 7',
      answer: 9,
      item: '👦',
      hint: '16 élèves au total, 7 sortent dehors'
    },
    {
      story: 'Maman achète 13 pommes. La famille en mange 6 au goûter.',
      question: 'Combien de pommes restent ?',
      operation: '13 - 6',
      answer: 7,
      item: '🍎',
      hint: '13 pommes achetées, 6 mangées'
    },
    {
      story: 'Tom a 20 autocollants. Il en colle 12 sur son cahier.',
      question: 'Combien d\'autocollants garde-t-il ?',
      operation: '20 - 12',
      answer: 8,
      item: '⭐',
      hint: '20 autocollants au début, 12 utilisés'
    },
    {
      story: 'Dans un panier, il y a 17 œufs. Grand-mère en casse 8 pour faire un gâteau.',
      question: 'Combien d\'œufs restent entiers ?',
      operation: '17 - 8',
      answer: 9,
      item: '🥚',
      hint: '17 œufs dans le panier, 8 sont cassés'
    },
    {
      story: 'Lucie collectionne 19 cartes. Elle en échange 11 avec son ami.',
      question: 'Combien de cartes garde-t-elle ?',
      operation: '19 - 11',
      answer: 8,
      item: '🃏',
      hint: '19 cartes au total, 11 données à son ami'
    },
    {
      story: 'Papa plante 15 graines. Seulement 9 graines poussent.',
      question: 'Combien de graines n\'ont pas poussé ?',
      operation: '15 - 9',
      answer: 6,
      item: '🌱',
      hint: '15 graines plantées, 9 ont poussé'
    },
    {
      story: 'Il y a 18 oiseaux sur l\'arbre. 10 oiseaux s\'envolent.',
      question: 'Combien d\'oiseaux restent sur l\'arbre ?',
      operation: '18 - 10',
      answer: 8,
      item: '🐦',
      hint: '18 oiseaux au début, 10 partent'
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons résoudre des problèmes de soustraction de la vraie vie ! C'est très amusant !");
      await wait(500);

      if (stopSignalRef.current) return;

      // La méthode
      setHighlightedElement('method');
      scrollToSection('method-section');
      await playAudio("Pour résoudre un problème, j'ai une méthode magique en 4 étapes : lire, comprendre, calculer, et vérifier !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Démonstration
      setAnimatingStep('demo');
      setHighlightedElement('demo');
      scrollToSection('demo-section');
      await playAudio("Par exemple : Emma a 12 voitures, elle en donne 5. Je lis, je comprends qu'il faut enlever, je calcule 12 moins 5 égale 7, et je vérifie : 7 plus 5 égale bien 12 !");
      await wait(1500);

      if (stopSignalRef.current) return;

      // Transition vers les exemples
      setHighlightedElement('examples');
      scrollToSection('examples-section');
      await playAudio("Découvre ces histoires passionnantes et résous-les étape par étape avec moi !");
      await wait(500);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer un problème spécifique
  const explainSpecificProblem = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const problem = problemExamples[index];
    setCurrentExample(index);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Présentation du problème
      setHighlightedElement('problem-title');
      await playAudio(`Résolvons ensemble : ${problem.title} !`);
      await wait(800);

      if (stopSignalRef.current) return;

      // Lecture du problème
      setAnimatingStep('step-read');
      await playAudio(`Première étape : je lis le problème. ${problem.story} ${problem.question}`);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Compréhension
      setAnimatingStep('step-understand');
      await playAudio(`Deuxième étape : je comprends. ${problem.steps[1].text}. Il faut faire une soustraction !`);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Calcul avec animation
      setAnimatingStep('step-calculate');
      await playAudio(`Troisième étape : je calcule. ${problem.operation} égale ${problem.result} !`);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Vérification
      setAnimatingStep('step-verify');
      await playAudio(`Quatrième étape : je vérifie. ${problem.result} plus ${problem.operation.split(' - ')[1]} égale bien ${problem.operation.split(' - ')[0]} ! C'est correct !`);
      await wait(1500);

      // Résultat final
      setAnimatingStep('final-result');
      await playAudio(`Bravo ! La réponse est ${problem.result}. Cette méthode en 4 étapes fonctionne toujours !`);
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

  // Fonction pour rendre les objets avec animation
  const renderObjects = (count: number, item: string, colorClass: string, removeCount = 0) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`text-2xl ${colorClass} transition-all duration-1000 transform ${
          i < removeCount ? 'opacity-30 scale-75 line-through' : 'opacity-100 scale-100'
        } ${
          animatingStep === 'step-calculate' ? 'animate-bounce' : ''
        }`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {item}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
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
              📚 Problèmes de soustraction
            </h1>
            <p className="text-lg text-gray-600">
              Résoudre des problèmes de la vraie vie étape par étape
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
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-rose-400 animate-pulse' : ''}`}
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
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-rose-400 animate-pulse' : ''}`}
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
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 animate-pulse"
                >
                  ▶️ COMMENCER !
                </button>
              </div>
            )}

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-rose-400 bg-rose-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Problèmes de la vraie vie</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Les problèmes de soustraction nous aident à résoudre des situations réelles ! 
                Quand on donne, qu'on perd, ou qu'on utilise quelque chose, on soustrait.
              </p>
            </div>

            {/* La méthode */}
            <div 
              id="method-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'method' ? 'ring-4 ring-rose-400 bg-rose-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Target className="w-6 h-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">La méthode magique en 4 étapes</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="p-2 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-blue-800">1. Lire</h4>
                  <p className="text-sm text-blue-600">Je lis tout le problème</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="p-2 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold text-green-800">2. Comprendre</h4>
                  <p className="text-sm text-green-600">Qu'est-ce qui se passe ?</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="p-2 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-purple-800">3. Calculer</h4>
                  <p className="text-sm text-purple-600">Je fais l'opération</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="p-2 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-bold text-orange-800">4. Vérifier</h4>
                  <p className="text-sm text-orange-600">Je contrôle ma réponse</p>
                </div>
              </div>
            </div>

            {/* Démonstration */}
            <div 
              id="demo-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'demo' ? 'ring-4 ring-rose-400 bg-rose-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎬 Exemple : Emma et ses voitures
              </h2>

              {animatingStep === 'demo' && (
                <div className="bg-gradient-to-r from-blue-50 to-rose-50 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <p className="text-lg font-semibold">Méthode en 4 étapes :</p>
                    <div className="space-y-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <span className="font-bold text-blue-800">1. Lire :</span>
                        <span className="ml-2">"Emma a 12 voitures, elle en donne 5"</span>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <span className="font-bold text-green-800">2. Comprendre :</span>
                        <span className="ml-2">Emma enlève des voitures → soustraction</span>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <span className="font-bold text-purple-800">3. Calculer :</span>
                        <span className="ml-2">12 - 5 = 7</span>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <span className="font-bold text-orange-800">4. Vérifier :</span>
                        <span className="ml-2">7 + 5 = 12 ✓</span>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-green-600">Réponse : 7 voitures !</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-rose-400 bg-rose-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 Résous ces histoires passionnantes !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {problemExamples.map((problem, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      currentExample === index ? 'ring-4 ring-rose-400 bg-rose-100' : ''
                    }`}
                    onClick={() => explainSpecificProblem(index)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{problem.item}</div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{problem.title}</h3>
                      <div className="text-sm text-gray-600 mb-3 leading-relaxed">{problem.story}</div>
                      <div className="text-lg font-mono bg-white px-3 py-1 rounded mb-3">{problem.operation}</div>
                      <button className="bg-rose-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-rose-600 transition-colors">
                        ▶️ Résoudre ensemble
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
                  🎬 Résolution étape par étape
                </h2>
                
                {(() => {
                  const problem = problemExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Titre du problème */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'problem-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <h3 className="text-xl font-bold">{problem.title}</h3>
                        <p className="text-gray-600 mt-2">{problem.story}</p>
                        <p className="text-gray-800 font-semibold mt-1">{problem.question}</p>
                      </div>

                      {/* Animation des étapes */}
                      <div className="space-y-4">
                        {/* Étape 1: Lire */}
                        <div className={`p-4 rounded-lg transition-all duration-500 ${
                          animatingStep === 'step-read' ? 'bg-blue-100 ring-2 ring-blue-400 scale-105' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              animatingStep === 'step-read' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                            }`}>
                              1
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <span className="font-bold text-blue-800">LIRE</span>
                              </div>
                              <div className="text-gray-700">Je lis attentivement le problème</div>
                            </div>
                          </div>
                        </div>

                        {/* Étape 2: Comprendre */}
                        <div className={`p-4 rounded-lg transition-all duration-500 ${
                          animatingStep === 'step-understand' ? 'bg-green-100 ring-2 ring-green-400 scale-105' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              animatingStep === 'step-understand' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`}>
                              2
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Search className="w-5 h-5 text-green-600" />
                                <span className="font-bold text-green-800">COMPRENDRE</span>
                              </div>
                              <div className="text-gray-700">{problem.steps[1].text}</div>
                            </div>
                          </div>
                        </div>

                        {/* Étape 3: Calculer */}
                        <div className={`p-4 rounded-lg transition-all duration-500 ${
                          animatingStep === 'step-calculate' ? 'bg-purple-100 ring-2 ring-purple-400 scale-105' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              animatingStep === 'step-calculate' ? 'bg-purple-500 animate-pulse' : 'bg-gray-400'
                            }`}>
                              3
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Calculator className="w-5 h-5 text-purple-600" />
                                <span className="font-bold text-purple-800">CALCULER</span>
                              </div>
                              <div className="text-xl font-mono text-purple-700">{problem.operation} = {problem.result}</div>
                              {animatingStep === 'step-calculate' && (
                                <div className="mt-3 grid grid-cols-10 gap-1 max-w-md">
                                  {renderObjects(
                                    parseInt(problem.operation.split(' - ')[0]), 
                                    problem.item, 
                                    problem.color,
                                    parseInt(problem.operation.split(' - ')[1])
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Étape 4: Vérifier */}
                        <div className={`p-4 rounded-lg transition-all duration-500 ${
                          animatingStep === 'step-verify' ? 'bg-orange-100 ring-2 ring-orange-400 scale-105' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              animatingStep === 'step-verify' ? 'bg-orange-500 animate-pulse' : 'bg-gray-400'
                            }`}>
                              4
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Eye className="w-5 h-5 text-orange-600" />
                                <span className="font-bold text-orange-800">VÉRIFIER</span>
                              </div>
                              <div className="text-orange-700">{problem.result} + {problem.operation.split(' - ')[1]} = {problem.operation.split(' - ')[0]} ✓</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Résultat final */}
                      {animatingStep === 'final-result' && (
                        <div className="text-center p-6 bg-green-100 rounded-lg">
                          <p className="text-3xl font-bold text-green-800">
                            Réponse : {problem.result}
                          </p>
                          <p className="text-lg text-green-600 mt-2">
                            Problème résolu avec la méthode en 4 étapes ! 🎉
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
                <div className="text-lg font-semibold text-rose-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Icône visuelle */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">{exercises[currentExercise].item}</div>
                  </div>

                  {/* Histoire du problème */}
                  <div className="p-4 bg-rose-50 rounded-lg text-center">
                    <p className="text-lg mb-3 leading-relaxed">{exercises[currentExercise].story}</p>
                    <p className="text-lg font-semibold mb-2 text-rose-800">{exercises[currentExercise].question}</p>
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
                        className="bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-600 disabled:opacity-50"
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
                        <BookOpen className="w-5 h-5 text-yellow-600" />
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
                          {isCorrect ? 'Bravo ! Tu as résolu le problème !' : `Pas tout à fait... La réponse était ${exercises[currentExercise].answer}`}
                        </span>
                      </div>
                      
                      <button
                        onClick={nextExercise}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-600 mt-2"
                      >
                        {currentExercise < exercises.length - 1 ? 'Problème suivant' : 'Voir mes résultats'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Modal de fin */
                <div className="text-center space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Tous les problèmes résolus !
                  </h2>
                  <div className="text-2xl font-bold text-rose-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600"
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600"
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