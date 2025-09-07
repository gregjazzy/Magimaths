'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Star } from 'lucide-react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function FormesGeometriquesCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'drawing' | 'characteristics' | 'result' | null>(null);
  const [animatingShape, setAnimatingShape] = useState(false);
  const [drawingProgress, setDrawingProgress] = useState<number>(0);
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États pour le jeu de drag and drop
  // Fonction pour mélanger un tableau
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Liste initiale des items avec leurs positions
  const initialItems = [
    { id: 1, type: 'triangle', emoji: '🔺', name: 'triangle', found: false, currentZone: null, initialPosition: { col: 0, row: 0 } },
    { id: 10, type: 'cercle', emoji: '⭕', name: 'cercle', found: false, currentZone: null, initialPosition: { col: 1, row: 0 } },
    { id: 5, type: 'carre', emoji: '🎲', name: 'dé', found: false, currentZone: null, initialPosition: { col: 2, row: 0 } },
    { id: 8, type: 'rectangle', emoji: '🏳️', name: 'drapeau', found: false, currentZone: null, initialPosition: { col: 3, row: 0 } },
    { id: 11, type: 'cercle', emoji: '🌕', name: 'lune', found: false, currentZone: null, initialPosition: { col: 0, row: 1 } },
    { id: 2, type: 'triangle', emoji: '⚠️', name: 'panneau', found: false, currentZone: null, initialPosition: { col: 1, row: 1 } },
    { id: 7, type: 'rectangle', emoji: '📲', name: 'smartphone', found: false, currentZone: null, initialPosition: { col: 2, row: 1 } },
    { id: 4, type: 'carre', emoji: '⬛', name: 'carré', found: false, currentZone: null, initialPosition: { col: 3, row: 1 } },
    { id: 6, type: 'carre', emoji: '🔲', name: 'bouton', found: false, currentZone: null, initialPosition: { col: 0, row: 2 } },
    { id: 3, type: 'triangle', emoji: '🎄', name: 'sapin', found: false, currentZone: null, initialPosition: { col: 1, row: 2 } },
    { id: 12, type: 'cercle', emoji: '⚽', name: 'ballon', found: false, currentZone: null, initialPosition: { col: 2, row: 2 } },
    { id: 9, type: 'rectangle', emoji: '🎫', name: 'ticket', found: false, currentZone: null, initialPosition: { col: 3, row: 2 } },
  ];

  const [dragItems, setDragItems] = useState(shuffleArray(initialItems));
  const [dragSuccess, setDragSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Formes géométriques à apprendre
  const geometricShapes = [
    {
      name: 'cercle',
      emoji: '🔵',
      story: 'Un cercle est rond comme une balle ou une roue',
      characteristics: [
        'Il n\'a pas de coins',
        'Il est tout rond',
        'Tous les points sont à la même distance du centre'
      ],
      examples: ['🏀 ballon', '🍕 pizza', '☀️ soleil', '🪙 pièce', '🎯 cible']
    },
    {
      name: 'carré',
      emoji: '🟦',
      story: 'Un carré a 4 côtés tous pareils et 4 coins droits',
      characteristics: [
        'Il a 4 côtés égaux',
        'Il a 4 coins droits',
        'Tous ses angles sont pareils'
      ],
      examples: ['📦 boîte', '🧩 puzzle', '🏠 fenêtre', '📋 tableau', '🎲 dé']
    },
    {
      name: 'rectangle',
      emoji: '🟨',
      story: 'Un rectangle a 4 côtés : 2 longs et 2 courts, avec 4 coins droits',
      characteristics: [
        'Il a 4 côtés : 2 longs et 2 courts',
        'Il a 4 coins droits',
        'Les côtés opposés sont égaux'
      ],
      examples: ['📱 téléphone', '📚 livre', '🚪 porte', '📺 télé', '🎴 carte']
    },
    {
      name: 'triangle',
      emoji: '🔺',
      story: 'Un triangle a 3 côtés et 3 coins pointus',
      characteristics: [
        'Il a 3 côtés',
        'Il a 3 coins pointus',
        'Il peut être grand ou petit'
      ],
      examples: ['🏔️ montagne', '🎪 tente', '🍕 part de pizza', '⚠️ panneau', '🎄 sapin']
    }
  ];

  // Exercices sur les formes géométriques
  const exercises = [
    { 
      question: 'Quelle forme n\'a pas de coins ?', 
      correctAnswer: 'cercle',
      choices: ['carré', 'cercle', 'triangle'],
      hint: 'Pense à une balle qui roule...'
    },
    { 
      question: 'Combien de côtés a un triangle ?', 
      correctAnswer: '3',
      choices: ['2', '3', '4'],
      visual: '🔺'
    },
    { 
      question: 'Quelle forme a 4 côtés tous égaux ?', 
      correctAnswer: 'carré',
      choices: ['rectangle', 'carré', 'cercle'],
      hint: 'Comme une boîte parfaite...'
    },
    { 
      question: 'Un rectangle a combien de coins droits ?', 
      correctAnswer: '4',
      choices: ['2', '4', '6'],
      visual: '📱'
    },
    { 
      question: 'Quelle forme ressemble à une roue ?', 
      correctAnswer: 'cercle',
      choices: ['carré', 'triangle', 'cercle'],
      hint: 'Elle tourne parfaitement...'
    },
    { 
      question: 'Combien de côtés a un carré ?', 
      correctAnswer: '4',
      choices: ['3', '4', '5'],
      visual: '🟦'
    },
    { 
      question: 'Quelle forme a des coins pointus ?', 
      correctAnswer: 'triangle',
      choices: ['cercle', 'triangle', 'carré'],
      hint: 'Attention, ça pique !'
    },
    { 
      question: 'Un rectangle a 2 côtés longs et...', 
      correctAnswer: '2 côtés courts',
      choices: ['1 côté court', '2 côtés courts', '3 côtés courts'],
      visual: '📱'
    },
    { 
      question: 'Quelle forme ressemble à une montagne ?', 
      correctAnswer: 'triangle',
      choices: ['cercle', 'carré', 'triangle'],
      hint: '🏔️ Les sommets sont pointus...'
    },
    { 
      question: 'Toutes ces formes ont des côtés SAUF...', 
      correctAnswer: 'le cercle',
      choices: ['le carré', 'le cercle', 'le rectangle'],
      hint: 'Une forme qui roule...'
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements d'onglet
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setShowingProcess(null);
    setAnimatingShape(false);
    setDrawingProgress(0);
  };

  // Fonction pour jouer l'audio avec voix naturelle
  const playAudio = async (text: string) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      if (typeof speechSynthesis === 'undefined') {
        console.warn('SpeechSynthesis API non disponible');
        resolve();
        return;
      }
      
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = speechSynthesis.getVoices();
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
        (voice.name.toLowerCase().includes('thomas') ||
         voice.name.toLowerCase().includes('daniel'))
      ) || voices.find(voice => 
        voice.lang === 'fr-FR' && voice.localService
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')
      );
      
      if (bestFrenchVoice) {
        utterance.voice = bestFrenchVoice;
      }
      
      currentAudioRef.current = utterance;
      
      utterance.onstart = () => {
        console.log('Audio démarré:', text);
      };
      
      utterance.onend = () => {
        console.log('Audio terminé:', text);
        if (!stopSignalRef.current) {
          currentAudioRef.current = null;
          resolve();
        }
      };
      
      utterance.onerror = (error) => {
        console.error('Erreur audio:', error);
        currentAudioRef.current = null;
        resolve();
      };
      
      speechSynthesis.speak(utterance);
    });
  };

  // Animation de dessin d'une forme
  const animateShapeDrawing = async (shape: typeof geometricShapes[0]) => {
    if (stopSignalRef.current) return;
    
    setAnimatingShape(true);
    setShowingProcess('drawing');
    setCurrentExample(geometricShapes.indexOf(shape));
    setDrawingProgress(0);
    
    await playAudio(`Regardons comment reconnaître un ${shape.name}. ${shape.story}`);
    
    if (stopSignalRef.current) return;
    
    // Animation du tracé
    await playAudio('Voici ses caractéristiques importantes !');
    
    for (let step = 0; step < 100; step += 20) {
      if (stopSignalRef.current) return;
      setDrawingProgress(step);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setDrawingProgress(100);
    
    if (stopSignalRef.current) return;
    
    // Phase des caractéristiques
    setShowingProcess('characteristics');
    setHighlightedElement('characteristics');
    
    await playAudio(`Maintenant, découvrons les caractéristiques du ${shape.name} :`);
    
    for (let i = 0; i < shape.characteristics.length; i++) {
      if (stopSignalRef.current) return;
      
      setHighlightedElement(`characteristic-${i}`);
      
      await playAudio(shape.characteristics[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (stopSignalRef.current) return;
    
    // Exemples dans la vie
    setShowingProcess('result');
    setHighlightedElement('examples');
    
    await playAudio(`Tu peux voir des ${shape.name}s partout !`);
    
    const exampleText = shape.examples.join(', ');
    await playAudio(`Par exemple : ${exampleText}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAnimatingShape(false);
    setShowingProcess(null);
    setHighlightedElement(null);
    setDrawingProgress(0);
  };

  // Démarrer la leçon complète
  const startLesson = async () => {
    if (isAnimationRunning) {
      stopAllVocalsAndAnimations();
      return;
    }
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setIsPlayingVocal(true);
    setHasStarted(true);
    
    try {
      // Introduction
      setHighlightedElement('introduction');
      await playAudio('Bonjour petit architecte ! Aujourd\'hui, nous allons découvrir les formes géométriques. Ce sont des formes que tu vois partout autour de toi !');
      
      if (stopSignalRef.current) return;
      
      setHighlightedElement('shapes-explanation');
      await playAudio('Nous allons apprendre 4 formes magiques : le cercle, le carré, le rectangle et le triangle. Chaque forme a ses secrets !');
      
      if (stopSignalRef.current) return;
      
      // Démonstration de chaque forme
      for (const shape of geometricShapes) {
        if (stopSignalRef.current) return;
        await animateShapeDrawing(shape);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (stopSignalRef.current) return;
      
      // Récapitulatif
      setHighlightedElement('summary');
      await playAudio('Fantastique ! Tu connais maintenant les 4 formes de base. Tu es devenu un vrai détective des formes !');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Exercices
      setHighlightedElement('exercises');
      await playAudio('Maintenant, amusons-nous à reconnaître les formes avec des exercices passionnants !');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowExercises(true);
      
    } catch (error) {
      console.error('Erreur dans la leçon:', error);
    } finally {
      setIsAnimationRunning(false);
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Gestion des exercices
  const handleAnswerSubmit = async () => {
    if (!userAnswer) return;
    
    const currentEx = exercises[currentExercise];
    const correct = userAnswer === currentEx.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => new Set(Array.from(prev).concat([currentExercise])));
      await playAudio('Formidable ! Tu reconnais parfaitement les formes !');
    } else {
      await playAudio(`Presque ! La bonne réponse était "${currentEx.correctAnswer}". ${currentEx.hint || 'Regarde bien les caractéristiques de chaque forme !'}`);
    }
    
    setTimeout(() => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
        // Fin des exercices
        const finalScore = ((score + (correct ? 1 : 0)) / exercises.length) * 100;
        setFinalScore(Math.round(finalScore));
      setShowCompletionModal(true);
    }
    }, 2000);
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setShowExercises(false);
  };

  // Fonction pour lancer les confettis
  const launchConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // Fonction pour gérer le drag and drop
  const handleDragEnd = async (item: any, dropzone: string) => {
    if (item.type === dropzone) {
      const newItems = dragItems.map(i => 
        i.id === item.id ? { ...i, found: true } : i
      );
      setDragItems(newItems);
      await playAudio(`Bravo ! ${item.name} est bien un ${dropzone} !`);
      
      // Vérifier si tous les items sont bien placés
      if (newItems.every(i => i.found)) {
        setDragSuccess(true);
        launchConfetti();
        await playAudio("Félicitations ! Tu es un véritable expert des formes géométriques !");
      }
    } else {
      await playAudio(`Essaie encore ! ${item.name} n'est pas un ${dropzone}.`);
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-geometrie-espace" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Retour à la géométrie et espace</span>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4 animate-gradient">
              🔺 Les formes géométriques
            </h1>
            <p className="text-lg text-gray-600 transition-all duration-300">
              Découvre les 4 formes de base : cercle, carré, rectangle et triangle !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-white/50">
                <button
                  onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                !showExercises 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-indigo-500/25' 
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-indigo-600'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className={`transition-transform duration-300 ${!showExercises ? 'scale-110' : ''}`}>📚</span>
                <span>Cours</span>
              </span>
                </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                showExercises 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25' 
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-purple-600'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className={`transition-transform duration-300 ${showExercises ? 'scale-110' : ''}`}>✏️</span>
                <span>Exercices</span>
                <span className={`px-2 py-0.5 rounded-full text-sm transition-all duration-300 ${
                  showExercises 
                    ? 'bg-white/20 text-white' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {score}/{exercises.length}
                </span>
              </span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            <div className="text-center mb-6">
              <button
                onClick={startLesson}
                disabled={isAnimationRunning}
                className={`
                  relative px-8 py-4 rounded-xl font-bold text-xl
                  transition-all duration-300 transform
                  overflow-hidden
                  ${isAnimationRunning 
                    ? 'bg-gray-400/80 text-gray-200 cursor-not-allowed backdrop-blur-sm' 
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105'
                  }
                  shadow-[0_0_20px_rgba(168,85,247,0.3)]
                `}
              >
                {!isAnimationRunning && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
                <div className="relative flex items-center justify-center space-x-2">
                  <span className={`transition-transform duration-300 ${isAnimationRunning ? 'animate-spin' : 'animate-bounce'}`}>
                    {isAnimationRunning ? '⏳' : '▶️'}
                  </span>
                  <span>{isAnimationRunning ? 'Animation en cours...' : 'COMMENCER !'}</span>
                </div>
              </button>
            </div>

            <style jsx>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
              .animate-shimmer {
                animation: shimmer 2s infinite linear;
              }
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
              }
              .shake-animation {
                animation: shake 0.5s ease-in-out;
              }
            `}</style>

            {/* Explication du concept */}
            <div 
              id="concept-section"
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 transition-all duration-300 ${
                highlightedElement === 'introduction' ? 'ring-4 ring-purple-400/50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                🔍 Qu'est-ce qu'une forme géométrique ?
              </h2>
              
              <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-md border border-white/50">
                <p className="text-lg text-center text-purple-800 font-semibold mb-6">
                  Les formes géométriques sont partout ! Apprends à les reconnaître comme un détective des formes !
                </p>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${geometricShapes[currentExample].name} ${geometricShapes[currentExample].emoji}` 
                        : 'Les 4 formes magiques 🎨'
                      }
                    </div>
                </div>
                
                  {/* Démonstrations des formes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {geometricShapes.map((shape, index) => (
                      <div 
                        key={index} 
                        className={`
                          relative overflow-hidden
                          bg-gradient-to-br from-white/80 to-white/40
                          backdrop-blur-sm
                          rounded-xl
                          p-6 md:p-8
                          text-center
                          transition-all duration-500
                          hover:shadow-lg
                          border border-white/50
                          ${currentExample === index && animatingShape
                            ? 'ring-4 ring-purple-400/50 bg-purple-50/80 scale-105 shadow-lg' 
                            : 'hover:scale-102 hover:-translate-y-1'
                          }
                        `}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 pointer-events-none" />
                        <div className="text-5xl md:text-6xl mb-4 transform transition-transform duration-300 hover:scale-110">{shape.emoji}</div>
                        <h4 className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent text-lg md:text-xl mb-2">{shape.name}</h4>
                        <p className="text-sm md:text-base text-gray-600">{shape.characteristics[0]}</p>
                        
                        {/* Zone d'animation pour chaque forme */}
                        {currentExample === index && animatingShape && (
                          <div className="mt-4">
                            {/* Barre de progression du tracé */}
                            {showingProcess === 'drawing' && (
                              <div className="bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${drawingProgress}%` }}
                                />
                              </div>
                            )}
                            
                            {/* Caractéristiques */}
                            {showingProcess === 'characteristics' && (
                              <div className="bg-purple-100 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-purple-800 mb-2 text-xs">Caractéristiques :</h5>
                                <ul className="space-y-1">
                                  {shape.characteristics.map((char, charIndex) => (
                                    <li
                                      key={charIndex}
                                      className={`text-xs transition-all duration-500 ${
                                        highlightedElement === `characteristic-${charIndex}`
                                          ? 'text-purple-800 font-bold' 
                                          : 'text-purple-600'
                                      }`}
                                    >
                                      • {char}
                                    </li>
                                  ))}
                  </ul>
                              </div>
                            )}
                            
                            {/* Exemples */}
                            {showingProcess === 'result' && highlightedElement === 'examples' && (
                              <div className="bg-green-100 rounded-lg p-3 mt-2 animate-pulse">
                                <h5 className="font-bold text-green-800 mb-2 text-xs">Tu peux voir des {shape.name}s :</h5>
                                <div className="flex flex-wrap gap-1">
                                  {shape.examples.map((example, exIndex) => (
                                    <span
                                      key={exIndex}
                                      className="bg-white px-1 py-0.5 rounded text-xs text-green-700"
                                    >
                                      {example}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                
                  {/* Récapitulatif */}
                  <div className={`mt-6 p-4 rounded-xl transition-all duration-500 ${
                    highlightedElement === 'summary' ? 'bg-green-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-purple-800">
                      🔍 <strong>Maintenant tu peux :</strong> Reconnaître toutes les formes autour de toi !
                    </p>
                  </div>

                  {/* Jeu de Drag and Drop */}
                  <div className="mt-8">
                    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
                      <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                        🎮 Glisse les objets dans leur forme géométrique !
                      </h3>

                        {/* Zones de dépôt */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          <div
                            data-type="triangle"
                            className="dropzone bg-gradient-to-br from-red-50 to-orange-50 p-2 rounded-lg border-2 border-dashed border-red-200 text-center min-h-[80px] flex flex-col"
                          >
                            <div className="text-xl mb-1">🔺</div>
                            <div className="font-bold text-red-600 text-sm">Triangles</div>
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              {dragItems.filter(item => item.found && item.type === 'triangle').map(item => (
                                <div key={item.id} className="text-xs bg-white/50 rounded">{item.emoji}</div>
                              ))}
                            </div>
                          </div>
                          <div
                            data-type="carre"
                            className="dropzone bg-gradient-to-br from-blue-50 to-indigo-50 p-2 rounded-lg border-2 border-dashed border-blue-200 text-center min-h-[80px] flex flex-col"
                          >
                            <div className="text-xl mb-1">⬛</div>
                            <div className="font-bold text-blue-600 text-sm">Carrés</div>
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              {dragItems.filter(item => item.found && item.type === 'carre').map(item => (
                                <div key={item.id} className="text-xs bg-white/50 rounded">{item.emoji}</div>
                              ))}
                            </div>
                          </div>
                          <div
                            data-type="rectangle"
                            className="dropzone bg-gradient-to-br from-green-50 to-emerald-50 p-2 rounded-lg border-2 border-dashed border-green-200 text-center min-h-[80px] flex flex-col"
                          >
                            <div className="text-xl mb-1">📱</div>
                            <div className="font-bold text-green-600 text-sm">Rectangles</div>
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              {dragItems.filter(item => item.found && item.type === 'rectangle').map(item => (
                                <div key={item.id} className="text-xs bg-white/50 rounded">{item.emoji}</div>
                              ))}
                            </div>
                          </div>
                          <div
                            data-type="cercle"
                            className="dropzone bg-gradient-to-br from-purple-50 to-pink-50 p-2 rounded-lg border-2 border-dashed border-purple-200 text-center min-h-[80px] flex flex-col"
                          >
                            <div className="text-xl mb-1">⭕</div>
                            <div className="font-bold text-purple-600 text-sm">Cercles</div>
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              {dragItems.filter(item => item.found && item.type === 'cercle').map(item => (
                                <div key={item.id} className="text-xs bg-white/50 rounded">{item.emoji}</div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Zone des objets à trier */}
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => setDragItems(shuffleArray(initialItems))}
                            className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            🔄 Mélanger les formes
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-4" style={{ gridTemplateRows: 'repeat(3, minmax(0, 1fr))' }}>
                          {dragItems.filter(item => !item.found).map((item) => (
                            <motion.div
                              style={{
                                gridColumn: item.initialPosition.col + 1,
                                gridRow: item.initialPosition.row + 1,
                              }}
                              key={item.id}
                              data-id={item.id}
                              drag
                              dragMomentum={false}
                              whileDrag={{ scale: 1.1 }}
                              onDragEnd={(event, info) => {
                                const dropzones = document.querySelectorAll('.dropzone');
                                let droppedZone = null;
                                let closestDistance = Infinity;
                                
                                // Trouver la zone la plus proche du point de drop
                                dropzones.forEach((zone: any) => {
                                  const rect = zone.getBoundingClientRect();
                                  const centerX = rect.left + rect.width / 2;
                                  const centerY = rect.top + rect.height / 2;
                                  
                                  const distance = Math.sqrt(
                                    Math.pow(info.point.x - centerX, 2) + 
                                    Math.pow(info.point.y - centerY, 2)
                                  );
                                  
                                  // Si le point est dans la zone ou c'est la zone la plus proche
                                  if (distance < closestDistance && 
                                      info.point.x >= rect.left &&
                                      info.point.x <= rect.right &&
                                      info.point.y >= rect.top &&
                                      info.point.y <= rect.bottom) {
                                    closestDistance = distance;
                                    droppedZone = zone;
                                  }
                                });

                                if (droppedZone) {
                                  const zoneType = droppedZone.dataset.type;
                                  console.log('Déposé:', item.id, 'dans zone:', zoneType);
                                  setDragItems(prev => prev.map(i => 
                                    i.id === item.id 
                                      ? { ...i, found: true, currentZone: zoneType } 
                                      : i
                                  ));
                                } else {
                                  // Retour à la position initiale si pas de zone
                                  setDragItems(prev => prev.map(i => 
                                    i.id === item.id 
                                      ? { ...i, found: false, currentZone: null } 
                                      : i
                                  ));
                                }
                              }}
                              className={`
                                p-1 rounded shadow cursor-move text-center
                                ${item.type === 'triangle' ? 'bg-red-50' : ''}
                                ${item.type === 'carre' ? 'bg-blue-50' : ''}
                                ${item.type === 'rectangle' ? 'bg-green-50' : ''}
                                ${item.type === 'cercle' ? 'bg-purple-50' : ''}
                              `}
                            >
                              <div className="text-sm">{item.emoji}</div>
                              <div className="text-[10px] font-medium text-gray-600">{item.name}</div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Message d'erreur et bouton Vérifier */}
                        {!dragSuccess && (
                          <div className="flex flex-col items-center mt-4">
                            {errorMessage && (
                              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                                <strong>Formes mal placées :</strong>
                                <br />
                                {errorMessage}
                              </div>
                            )}
                            <button
                              onClick={() => {
                                console.log("Bouton cliqué");
                                // Vérifier la position de chaque forme
                                const incorrectItems = [];
                                const correctItems = [];

                                // Récupérer toutes les formes et leurs positions
                                const items = document.querySelectorAll('[data-id]');
                                console.log("Nombre d'items trouvés:", items.length);

                                items.forEach((itemElement: any) => {
                                  const id = parseInt(itemElement.getAttribute('data-id'));
                                  const item = dragItems.find(i => i.id === id);
                                  if (!item) return;

                                  console.log("Vérification de l'item:", item.emoji);
                                  const itemRect = itemElement.getBoundingClientRect();
                                  const itemCenter = {
                                    x: itemRect.left + itemRect.width / 2,
                                    y: itemRect.top + itemRect.height / 2
                                  };

                                  let currentZone = null;
                                  document.querySelectorAll('.dropzone').forEach((zone: any) => {
                                    const zoneRect = zone.getBoundingClientRect();
                                    if (
                                      itemCenter.x >= zoneRect.left &&
                                      itemCenter.x <= zoneRect.right &&
                                      itemCenter.y >= zoneRect.top &&
                                      itemCenter.y <= zoneRect.bottom
                                    ) {
                                      currentZone = zone.dataset.type;
                                      console.log("Item", item.emoji, "trouvé dans la zone", currentZone);
                                    }
                                  });

                                  if (currentZone === item.type) {
                                    console.log("Item", item.emoji, "correctement placé");
                                    correctItems.push(item);
                                  } else if (currentZone) {
                                    console.log("Item", item.emoji, "mal placé:", currentZone, "au lieu de", item.type);
                                    incorrectItems.push({
                                      ...item,
                                      placedIn: currentZone
                                    });
                                  }
                                });

                                if (incorrectItems.length === 0 && correctItems.length === dragItems.length) {
                                  setDragSuccess(true);
                                  setErrorMessage(null);
                                  launchConfetti();
                                  playAudio("Bravo ! Tu as parfaitement classé toutes les formes !");
                                } else {
                                  // Réinitialiser complètement l'état du jeu
                                  const resetItems = [...initialItems];
                                  
                                  // Séparer les formes correctes et incorrectes
                                  const remainingItems = resetItems.filter(item => 
                                    !correctItems.some(correct => correct.id === item.id)
                                  );
                                  
                                  // Mélanger les formes incorrectes
                                  const shuffledRemaining = shuffleArray(remainingItems);
                                  
                                  // Créer le nouvel état avec les formes correctes en place et les autres mélangées
                                  const newItems = resetItems.map(item => {
                                    const correctItem = correctItems.find(c => c.id === item.id);
                                    if (correctItem) {
                                      return {
                                        ...item,
                                        found: true,
                                        currentZone: correctItem.type
                                      };
                                    } else {
                                      const shuffledItem = shuffledRemaining.shift();
                                      return {
                                        ...shuffledItem!,
                                        found: false,
                                        currentZone: null
                                      };
                                    }
                                  });
                                  
                                  // Réinitialiser l'état avec les formes mélangées
                                  setDragItems(newItems);

                                  // Message d'erreur dans l'état
                                  setErrorMessage(incorrectItems.map(item => 
                                    `${item.emoji} n'est pas un ${item.placedIn}, c'est un ${item.type}`
                                  ).join(', '));

                                  // Message vocal
                                  let audioMessage = "Vérifie bien : ";
                                  incorrectItems.forEach(item => {
                                    audioMessage += `${item.name} n'est pas un ${item.placedIn}, c'est un ${item.type}. `;
                                  });
                                  playAudio(audioMessage);
                                }
                              }}
                              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:scale-105 animate-pulse"
                            >
                              ✨ Vérifier mes réponses
                            </button>
                          </div>
                        )}

                        {dragSuccess && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-6 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-center shadow-lg"
                          >
                            <motion.div 
                              className="text-6xl mb-4"
                              animate={{ 
                                rotate: [0, 10, -10, 10, 0],
                                scale: [1, 1.2, 1, 1.2, 1]
                              }}
                              transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            >
                              🏆
                            </motion.div>
                            <div className="text-2xl font-bold text-white mb-4">
                              Bravo ! Tu es un véritable expert des formes !
                            </div>
                            <div className="flex justify-center space-x-2 text-white/80">
                              <Star className="w-6 h-6 fill-current" />
                              <Star className="w-6 h-6 fill-current" />
                              <Star className="w-6 h-6 fill-current" />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setDragItems(prev => prev.map(i => ({ ...i, found: false })));
                                setDragSuccess(false);
                                playAudio("C'est reparti ! Essaie de battre ton record !");
                              }}
                              className="mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition-all"
                            >
                              Rejouer
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-br from-pink-50/80 via-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text mb-6 text-center">
                🎁 Conseils pour reconnaître les formes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">👀</div>
                  <h4 className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text text-lg mb-3">Observe les côtés</h4>
                  <p className="text-gray-600">Compte les côtés : 0, 3, 4 ou plus ?</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">📐</div>
                  <h4 className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text text-lg mb-3">Regarde les coins</h4>
                  <p className="text-gray-600">Droits, pointus ou pas de coins ?</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">📏</div>
                  <h4 className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text text-lg mb-3">Compare les longueurs</h4>
                  <p className="text-gray-600">Tous pareils ou différents ?</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-4xl mb-4 transform transition-transform duration-300 hover:scale-110">🔍</div>
                  <h4 className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text text-lg mb-3">Cherche autour de toi</h4>
                  <p className="text-gray-600">Les formes sont partout !</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50">
            {!showCompletionModal ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    🔍 Exercice {currentExercise + 1}/{exercises.length}
                  </h3>
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold shadow-md">
                    Score: {score}/{exercises.length}
                  </div>
                </div>
              
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-8 shadow-md border border-white/50">
                    <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-6">
                      {exercises[currentExercise].question}
                    </h4>
                    
                    {/* Visualisation de l'exercice */}
                    {exercises[currentExercise].visual && (
                      <div className="text-7xl text-center mb-6 transform transition-transform duration-300 hover:scale-110">
                        {exercises[currentExercise].visual}
                      </div>
                    )}
                    
                    {/* Indice */}
                    {exercises[currentExercise].hint && (
                      <div className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 backdrop-blur-sm rounded-xl p-4 mt-6 shadow-md border border-yellow-100/50">
                        <p className="text-sm text-yellow-800 flex items-center">
                          <span className="text-2xl mr-2 animate-bounce">💡</span>
                          <span><strong>Indice :</strong> {exercises[currentExercise].hint}</span>
                        </p>
                      </div>
                    )}
                  </div>
              
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    {exercises[currentExercise].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(choice)}
                        className={`
                          relative overflow-hidden
                          p-6 rounded-xl
                          transition-all duration-300
                          text-center font-bold text-lg
                          shadow-md
                          ${userAnswer === choice
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-2 border-white/50 scale-105'
                            : 'bg-white/80 backdrop-blur-sm border-2 border-white/50 text-gray-700 hover:scale-102 hover:-translate-y-1'
                          }
                        `}
                      >
                        {userAnswer === choice && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        )}
                        <span className="relative">{choice}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!userAnswer}
                    className={`
                      relative overflow-hidden
                      px-8 py-4 rounded-xl
                      font-bold text-xl
                      transition-all duration-300
                      ${!userAnswer
                        ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105'
                      }
                      shadow-[0_0_20px_rgba(168,85,247,0.3)]
                    `}
                  >
                    {userAnswer && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    )}
                    <span className="relative">Valider</span>
                  </button>
                </div>

                {isCorrect !== null && (
                  <div className={`
                    mt-6 p-6 rounded-xl text-center backdrop-blur-sm border transition-all duration-300
                    ${isCorrect
                      ? 'bg-green-50/80 text-green-800 border-green-200/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                      : 'bg-red-50/80 text-red-800 border-red-200/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    }
                  `}>
                    {isCorrect ? (
                      <div className="flex items-center justify-center text-lg">
                        <CheckCircle className="w-8 h-8 mr-3 text-green-500" />
                        <span className="font-bold">Formidable ! Tu reconnais parfaitement les formes !</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-lg">
                        <XCircle className="w-8 h-8 mr-3 text-red-500" />
                        <span>
                          La bonne réponse était : <span className="font-bold">{exercises[currentExercise].correctAnswer}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="text-8xl mb-6 transform transition-transform duration-300 hover:scale-110">
                  {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '🎉' : '💪'}
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6">
                  {finalScore >= 80 ? 'Expert des formes !' : finalScore >= 60 ? 'Bravo détective !' : 'Continue à explorer !'}
                </h3>
                <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50 mb-8">
                  <p className="text-xl text-gray-700">
                    Tu as obtenu <span className="font-bold text-purple-600">{score}/{exercises.length}</span> bonnes réponses
                    <br />
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                      Score : {finalScore}%
                    </span>
                  </p>
                </div>
                <div className="flex justify-center space-x-6">
                  <button
                    onClick={resetExercises}
                    className="
                      relative overflow-hidden
                      bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                      text-white px-8 py-4 rounded-xl font-bold text-lg
                      transition-all duration-300
                      hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-105
                      shadow-[0_0_20px_rgba(168,85,247,0.3)]
                      flex items-center
                    "
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    <span className="relative flex items-center">
                      <RotateCcw className="w-6 h-6 mr-3" />
                      Recommencer
                    </span>
                  </button>
                  <Link
                    href="/chapitre/cp-geometrie-espace"
                    className="
                      relative overflow-hidden
                      bg-gradient-to-r from-gray-500 to-gray-600
                      text-white px-8 py-4 rounded-xl font-bold text-lg
                      transition-all duration-300
                      hover:shadow-[0_0_30px_rgba(107,114,128,0.5)] hover:scale-105
                      shadow-[0_0_20px_rgba(107,114,128,0.3)]
                      flex items-center
                    "
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    <span className="relative">
                      Retour au chapitre
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 