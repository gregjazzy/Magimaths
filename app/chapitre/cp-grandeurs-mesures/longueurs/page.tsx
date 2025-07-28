'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function LongueursCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'comparison' | 'measurement' | 'result' | null>(null);
  const [animatingObjects, setAnimatingObjects] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [rulerAnimation, setRulerAnimation] = useState(false);
  const [objectsMoving, setObjectsMoving] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);
  const [measuringStep, setMeasuringStep] = useState(0);
  
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

  // Concepts de longueur avec animations avancées
  const lengthConcepts = [
    {
      name: 'plus long',
      emoji: '📏',
      color: 'blue',
      story: 'Cet objet dépasse l\'autre, il est plus long !',
      examples: [
        {
          object1: { name: 'crayon', emoji: '✏️', length: 120, color: '#FCD34D' },
          object2: { name: 'gomme', emoji: '🟫', length: 60, color: '#F87171' },
          result: 'Le crayon est plus long que la gomme'
        }
      ]
    },
    {
      name: 'plus court',
      emoji: '📐',
      color: 'green',
      story: 'Cet objet ne dépasse pas l\'autre, il est plus court !',
      examples: [
        {
          object1: { name: 'cure-dent', emoji: '🦴', length: 40, color: '#D1FAE5' },
          object2: { name: 'baguette', emoji: '🥖', length: 140, color: '#FED7AA' },
          result: 'Le cure-dent est plus court que la baguette'
        }
      ]
    },
    {
      name: 'même longueur',
      emoji: '⚖️',
      color: 'purple',
      story: 'Ces deux objets ont exactement la même taille !',
      examples: [
        {
          object1: { name: 'règle A', emoji: '📏', length: 100, color: '#C084FC' },
          object2: { name: 'règle B', emoji: '📏', length: 100, color: '#60A5FA' },
          result: 'Les deux règles ont la même longueur'
        }
      ]
    },
    {
      name: 'utiliser la règle',
      emoji: '📊',
      color: 'orange',
      story: 'Avec une règle, on peut mesurer exactement !',
      examples: [
        {
          object1: { name: 'livre', emoji: '📖', length: 80, color: '#34D399' },
          object2: { name: 'cahier', emoji: '📓', length: 60, color: '#FBBF24' },
          result: 'Le livre fait 8 cm, le cahier fait 6 cm'
        }
      ]
    }
  ];

  // Exercices sur les longueurs
  const exercises = [
    { 
      question: 'Entre un crayon et une gomme, lequel est généralement plus long ?', 
      correctAnswer: 'le crayon',
      choices: ['le crayon', 'la gomme', 'ils sont pareils'],
      hint: 'Pense à tes affaires d\'école...',
      demoType: 'pencil-vs-eraser'
    },
    { 
      question: 'Pour comparer deux longueurs, je peux...', 
      correctAnswer: 'les mettre côte à côte',
      choices: ['les séparer', 'les mettre côte à côte', 'les cacher'],
      hint: 'Comment faire pour bien voir la différence ?',
      demoType: 'comparison-method'
    },
    { 
      question: 'Si un objet dépasse l\'autre, il est...', 
      correctAnswer: 'plus long',
      choices: ['plus court', 'plus long', 'pareil'],
      hint: 'Quand quelque chose dépasse...',
      demoType: 'longer-concept'
    },
    { 
      question: 'Quel outil m\'aide à mesurer précisément ?', 
      correctAnswer: 'la règle',
      choices: ['mes mains', 'la règle', 'mes yeux'],
      hint: 'Un outil avec des centimètres...',
      demoType: 'measuring-tool'
    },
    { 
      question: 'Deux objets de même longueur...', 
      correctAnswer: 'ne dépassent ni l\'un ni l\'autre',
      choices: ['l\'un dépasse l\'autre', 'ne dépassent ni l\'un ni l\'autre', 'sont très différents'],
      hint: 'Quand c\'est exactement pareil...',
      demoType: 'same-length'
    },
    { 
      question: 'Entre une fourmi et un serpent, lequel est plus long ?', 
      correctAnswer: 'le serpent',
      choices: ['la fourmi', 'le serpent', 'ils sont pareils'],
      hint: 'Compare ces deux animaux...',
      demoType: 'animals-comparison'
    },
    { 
      question: 'Avant de mesurer avec une règle, je dois...', 
      correctAnswer: 'aligner le début à zéro',
      choices: ['commencer au milieu', 'aligner le début à zéro', 'utiliser n\'importe où'],
      hint: 'Par où commencer sur la règle ?',
      demoType: 'ruler-start'
    },
    { 
      question: 'Si je compare mon doigt et mon bras, lequel est plus long ?', 
      correctAnswer: 'mon bras',
      choices: ['mon doigt', 'mon bras', 'ils sont pareils'],
      hint: 'Regarde ton propre corps...',
      demoType: 'body-parts'
    },
    { 
      question: 'Pour ranger des objets du plus court au plus long, je commence par...', 
      correctAnswer: 'le plus court',
      choices: ['le plus long', 'le plus court', 'n\'importe lequel'],
      hint: 'Du plus petit au plus grand...',
      demoType: 'ordering'
    },
    { 
      question: 'La longueur se mesure en...', 
      correctAnswer: 'centimètres',
      choices: ['litres', 'centimètres', 'grammes'],
      hint: 'L\'unité pour mesurer les longueurs...',
      demoType: 'units'
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
    setIsAnimationRunning(false);
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setCurrentExample(null);
    setShowingProcess(null);
    setAnimatingObjects(false);
    setComparisonResult(null);
    setRulerAnimation(false);
    setObjectsMoving(false);
    setSparkleEffect(false);
    setMeasuringStep(0);
    
    // Arrêter la synthèse vocale
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Signaler l'arrêt
    stopSignalRef.current = true;
    
    // Nettoyer la référence audio
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
  };

  // Fonction pour jouer l'audio avec gestion des interruptions
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Choisir une voix française naturelle
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && 
        (voice.name.includes('Thomas') || voice.name.includes('Amélie') || voice.name.includes('Daniel'))
      ) || voices.find(voice => voice.lang.startsWith('fr'));

      if (synth) {
        const utterance = new SpeechSynthesisUtterance(text);
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        currentAudioRef.current = utterance;
        
        utterance.onend = () => {
          if (!stopSignalRef.current) {
            setIsPlayingVocal(false);
          }
          resolve();
        };
        
        utterance.onerror = () => {
          setIsPlayingVocal(false);
          resolve();
        };
        
        setIsPlayingVocal(true);
        synth.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  // Fonction pour démarrer la leçon avec animations spectaculaires
  const startLesson = async () => {
    if (isAnimationRunning) {
      stopAllVocalsAndAnimations();
      return;
    }

    setHasStarted(true);
    setIsAnimationRunning(true);
    stopSignalRef.current = false;

    const steps = [
      {
        action: () => setHighlightedElement('introduction'),
        audio: "Bonjour petit explorateur ! Aujourd'hui, nous allons apprendre à comparer les longueurs. Plus long, plus court, ou pareil !"
      },
      {
        action: () => {
          setHighlightedElement('concepts-explanation');
          setCurrentExample(0);
          setSparkleEffect(true);
        },
        audio: "Voici les 4 façons de comparer les longueurs ! Regarde comme ça brille !"
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('comparison');
          setAnimatingObjects(true);
          setObjectsMoving(true);
        },
        audio: "Commençons par 'plus long'. Regarde ces objets qui bougent pour se comparer !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setComparisonResult('Le crayon est PLUS LONG que la gomme');
          setSparkleEffect(true);
        },
        audio: "Magnifique ! Le crayon dépasse la gomme, il est PLUS LONG !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('comparison');
          setAnimatingObjects(true);
          setObjectsMoving(true);
          setComparisonResult(null);
          setSparkleEffect(false);
        },
        audio: "Maintenant 'plus court'. Regarde comme le cure-dent est petit face à la baguette !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setComparisonResult('Le cure-dent est PLUS COURT que la baguette');
          setSparkleEffect(true);
        },
        audio: "Parfait ! Le cure-dent ne dépasse pas, il est PLUS COURT !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setShowingProcess('comparison');
          setAnimatingObjects(true);
          setObjectsMoving(true);
          setComparisonResult(null);
          setSparkleEffect(false);
        },
        audio: "Voici la 'même longueur'. Regarde ces règles qui dansent ensemble !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setComparisonResult('Les deux règles ont la MÊME LONGUEUR');
          setSparkleEffect(true);
        },
        audio: "Incroyable ! Elles finissent exactement au même endroit !"
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('measurement');
          setAnimatingObjects(true);
          setRulerAnimation(true);
          setMeasuringStep(1);
          setComparisonResult(null);
          setSparkleEffect(false);
        },
        audio: "Enfin, mesurer avec une règle ! Regarde cette règle magique qui apparaît !"
      },
      {
        action: () => {
          setMeasuringStep(2);
          setObjectsMoving(true);
        },
        audio: "Je place l'objet sur le zéro... Il glisse tout seul !"
      },
      {
        action: () => {
          setMeasuringStep(3);
          setShowingProcess('result');
          setComparisonResult('Le livre fait 8 cm, le cahier fait 6 cm');
          setSparkleEffect(true);
        },
        audio: "Et voilà ! La règle nous donne la mesure exacte en centimètres !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
          setAnimatingObjects(false);
          setComparisonResult(null);
          setRulerAnimation(false);
          setObjectsMoving(false);
          setSparkleEffect(true);
          setMeasuringStep(0);
        },
        audio: "Fantastique ! Tu maîtrises maintenant toutes les comparaisons de longueurs !"
      }
    ];

    for (let i = 0; i < steps.length && !stopSignalRef.current; i++) {
      steps[i].action();
      await playAudio(steps[i].audio);
      
      if (!stopSignalRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    if (!stopSignalRef.current) {
      setIsAnimationRunning(false);
      setHighlightedElement('exercises');
      setSparkleEffect(false);
      await playAudio("Maintenant, teste tes super-pouvoirs de mesure avec les exercices !");
    }
  };

  // Fonctions pour les exercices
  const handleAnswerSelect = (answer: string) => {
    if (isCorrect !== null) return;
    
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(new Set(Array.from(answeredCorrectly).concat([currentExercise])));
      playAudio("Bravo ! C'est la bonne réponse !");
    } else {
      playAudio(`Pas tout à fait ! La bonne réponse était : ${exercises[currentExercise].correctAnswer}. ${exercises[currentExercise].hint}`);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      // Fin des exercices
      const finalScore = answeredCorrectly.size;
      setFinalScore(finalScore);
      setShowCompletionModal(true);
      
      if (finalScore >= 7) {
        playAudio("Félicitations ! Tu es maintenant un expert des longueurs !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien les longueurs !");
      } else {
        playAudio("Continue à t'entraîner, tu vas y arriver !");
      }
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setUserAnswer('');
    setIsCorrect(null);
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Effets de particules en arrière-plan */}
      {sparkleEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes slideInFromLeft {
          0% { transform: translateX(-200px) rotate(-10deg); opacity: 0; }
          50% { transform: translateX(10px) rotate(2deg); opacity: 1; }
          100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        @keyframes slideInFromRight {
          0% { transform: translateX(200px) rotate(10deg); opacity: 0; }
          50% { transform: translateX(-10px) rotate(-2deg); opacity: 1; }
          100% { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        @keyframes bounceComparison {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-10px) scale(1.1); }
          75% { transform: translateY(-5px) scale(1.05); }
        }
        @keyframes rulerSlideIn {
          0% { transform: translateY(50px) scaleX(0); opacity: 0; }
          50% { transform: translateY(0) scaleX(0.5); opacity: 0.7; }
          100% { transform: translateY(0) scaleX(1); opacity: 1; }
        }
        @keyframes objectAlign {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(0) translateY(-20px) rotate(5deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        @keyframes measureGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
        }
        @keyframes pulseGrow {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .slide-in-left { animation: slideInFromLeft 1s ease-out; }
        .slide-in-right { animation: slideInFromRight 1s ease-out; }
        .bounce-comparison { animation: bounceComparison 2s infinite; }
        .ruler-slide-in { animation: rulerSlideIn 1.5s ease-out; }
        .object-align { animation: objectAlign 1s ease-in-out; }
        .measure-glow { animation: measureGlow 1.5s infinite; }
        .pulse-grow { animation: pulseGrow 1s infinite; }
        .wiggle { animation: wiggle 0.5s ease-in-out infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-grandeurs-mesures" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux grandeurs et mesures</span>
          </Link>
          
          <div className={`bg-white rounded-xl p-6 shadow-lg text-center transition-all duration-500 ${
            highlightedElement === 'introduction' ? 'transform scale-105 shadow-2xl bg-gradient-to-r from-green-50 to-blue-50' : ''
          }`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📏 Comparer des longueurs
            </h1>
            <p className="text-lg text-gray-600">
              Découvre qui est plus long, plus court, ou pareil !
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
                  ? 'bg-green-500 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md transform scale-105' 
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
            {/* Bouton COMMENCER avec animation */}
            <div className="text-center mb-6">
              <button
                onClick={startLesson}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105 pulse-grow'
                }`}
              >
                {isAnimationRunning ? '🌟 Animation magique en cours...' : '🚀 COMMENCER L\'AVENTURE !'}
              </button>
            </div>

            {/* Explication du concept avec animations spectaculaires */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'introduction' ? 'ring-4 ring-green-400 bg-green-50 scale-105 shadow-2xl' : ''
              }`}
            >
              <h2 className={`text-2xl font-bold text-center mb-6 text-gray-900 transition-all duration-500 ${
                highlightedElement === 'introduction' ? 'text-green-600 pulse-grow' : ''
              }`}>
                📏 Comment comparer des longueurs ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className={`text-lg text-center text-green-800 font-semibold mb-6 transition-all duration-500 ${
                  highlightedElement === 'introduction' ? 'wiggle' : ''
                }`}>
                  Comparer des longueurs, c'est savoir qui est plus long, plus court, ou pareil !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className={`text-2xl font-bold text-green-600 mb-4 transition-all duration-500 ${
                      highlightedElement === 'concepts-explanation' ? 'pulse-grow' : ''
                    }`}>
                      {currentExample !== null ? 
                        `🎯 Découvrons : ${lengthConcepts[currentExample].name} ${lengthConcepts[currentExample].emoji}` 
                        : '🎨 Les 4 façons magiques de comparer 📐'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des concepts avec animations spectaculaires */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'concepts-explanation' ? 'ring-2 ring-green-400 bg-green-50 rounded-lg p-2' : ''
                  }`}>
                    {lengthConcepts.map((concept, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingObjects
                            ? 'ring-4 ring-green-400 bg-green-100 scale-110 shadow-2xl bounce-comparison' 
                            : sparkleEffect && currentExample === null ? 'pulse-grow' : ''
                        }`}
                      >
                        <div className={`text-3xl mb-2 transition-all duration-300 ${
                          currentExample === index && animatingObjects ? 'wiggle' : ''
                        }`}>
                          {concept.emoji}
                        </div>
                        <h4 className="font-bold text-green-700 mb-1 text-sm sm:text-base">{concept.name}</h4>
                        <p className="text-xs sm:text-sm text-green-600">{concept.story.substring(0, 40)}...</p>
                        
                        {/* Zone d'animation spectaculaire pour chaque concept */}
                        {currentExample === index && animatingObjects && (
                          <div className="mt-4">
                            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border-2 border-green-300 shadow-inner">
                              
                              {/* Animation de comparaison avec objets qui bougent */}
                              <div className="flex justify-center items-end space-x-2 mb-4">
                                <div className={`text-center transition-all duration-1000 ${
                                  objectsMoving ? 'slide-in-left' : ''
                                }`}>
                                  <div className="text-2xl mb-2 filter drop-shadow-lg">
                                    {concept.examples[0].object1.emoji}
                                  </div>
                                  <div 
                                    className={`rounded-full transition-all duration-1000 shadow-lg ${
                                      showingProcess === 'comparison' ? 'measure-glow object-align' : ''
                                    }`}
                                    style={{ 
                                      width: `${concept.examples[0].object1.length/3}px`,
                                      height: '12px',
                                      backgroundColor: concept.examples[0].object1.color,
                                      transform: showingProcess === 'comparison' ? 'translateY(-5px)' : 'translateY(0)'
                                    }}
                                  />
                                  <div className="text-xs mt-1 font-bold text-gray-700">
                                    {concept.examples[0].object1.name}
                                  </div>
                                </div>
                                
                                <div className={`text-center transition-all duration-1000 ${
                                  objectsMoving ? 'slide-in-right' : ''
                                }`}>
                                  <div className="text-2xl mb-2 filter drop-shadow-lg">
                                    {concept.examples[0].object2.emoji}
                                  </div>
                                  <div 
                                    className={`rounded-full transition-all duration-1000 shadow-lg ${
                                      showingProcess === 'comparison' ? 'measure-glow object-align' : ''
                                    }`}
                                    style={{ 
                                      width: `${concept.examples[0].object2.length/3}px`,
                                      height: '12px',
                                      backgroundColor: concept.examples[0].object2.color,
                                      transform: showingProcess === 'comparison' ? 'translateY(-5px)' : 'translateY(0)'
                                    }}
                                  />
                                  <div className="text-xs mt-1 font-bold text-gray-700">
                                    {concept.examples[0].object2.name}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Règle animée pour la mesure */}
                              {currentExample === 3 && rulerAnimation && (
                                <div className={`mb-4 ruler-slide-in`}>
                                  <div className="bg-yellow-200 border-2 border-yellow-400 rounded-lg p-2 relative overflow-hidden">
                                    <div className="flex justify-between text-xs font-bold text-yellow-800">
                                      <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>12</span><span>14</span>
                                    </div>
                                    <div className="h-1 bg-yellow-400 mt-1 rounded relative">
                                      {/* Marques de la règle */}
                                      {[...Array(15)].map((_, i) => (
                                        <div 
                                          key={i}
                                          className="absolute top-0 w-0.5 h-4 bg-yellow-600"
                                          style={{ left: `${(i/14)*100}%` }}
                                        />
                                      ))}
                                    </div>
                                    {measuringStep >= 2 && (
                                      <div className="absolute top-0 left-0 right-0 bottom-0">
                                        <div 
                                          className="absolute top-6 bg-red-500 h-2 rounded object-align"
                                          style={{ 
                                            width: `${(concept.examples[0].object1.length/140)*100}%`,
                                            transition: 'all 1s ease-out'
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-center mt-2 text-green-800 font-bold">
                                    📏 Règle magique avec centimètres !
                                  </p>
                                </div>
                              )}
                              
                              {/* Résultat de la comparaison avec effet spectaculaire */}
                              {comparisonResult && showingProcess === 'result' && (
                                <div className="bg-gradient-to-r from-green-200 to-blue-200 rounded-lg p-3 animate-pulse shadow-lg border-2 border-green-400">
                                  <p className="text-sm font-bold text-green-800 text-center wiggle">
                                    🎉 {comparisonResult} 🎉
                                  </p>
                                  <div className="flex justify-center mt-2 space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className="text-yellow-400 animate-bounce" style={{animationDelay: `${i*0.1}s`}}>⭐</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Récapitulatif avec animation */}
                  <div className={`mt-6 p-4 rounded-xl transition-all duration-500 ${
                    highlightedElement === 'summary' ? 'bg-gradient-to-r from-green-200 to-blue-200 scale-110 shadow-xl pulse-grow' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-green-800">
                      📏 <strong>Maintenant tu peux :</strong> Comparer toutes les longueurs autour de toi !
                    </p>
                    {highlightedElement === 'summary' && (
                      <div className="flex justify-center mt-2 space-x-1">
                        {[...Array(7)].map((_, i) => (
                          <span key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i*0.1}s`}}>🌟</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques avec animations */}
            <div className={`bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-6 shadow-lg transition-all duration-500 ${
              sparkleEffect ? 'shadow-2xl ring-2 ring-blue-300' : ''
            }`}>
              <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
                🎁 Conseils magiques pour bien comparer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { icon: '👀', title: 'Aligne les débuts', desc: 'Mets les objets côte à côte au même niveau', color: 'from-blue-200 to-blue-100' },
                  { icon: '👆', title: 'Regarde les fins', desc: 'Celui qui dépasse est plus long', color: 'from-green-200 to-green-100' },
                  { icon: '📏', title: 'Utilise une règle', desc: 'Pour mesurer exactement en centimètres', color: 'from-purple-200 to-purple-100' },
                  { icon: '🎯', title: 'Commence à zéro', desc: 'Place toujours le début sur le 0 de la règle', color: 'from-yellow-200 to-yellow-100' }
                ].map((tip, index) => (
                  <div key={index} className={`bg-gradient-to-r ${tip.color} rounded-xl p-4 transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                    sparkleEffect ? 'pulse-grow' : ''
                  }`}>
                    <div className="text-2xl mb-2">{tip.icon}</div>
                    <h4 className="font-bold text-green-700 mb-2">{tip.title}</h4>
                    <p className="text-green-600">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white rounded-xl p-8 shadow-lg">
            {!showCompletionModal ? (
              <>
                {/* En-tête de l'exercice */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📝 Exercice {currentExercise + 1} sur {exercises.length}
                  </h2>
                  <div className="bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-lg text-gray-700 mb-6">
                    {exercises[currentExercise].question}
                  </p>
                </div>

                {/* Zone de démonstration visuelle */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                  <div className="text-4xl mb-4">
                    {exercises[currentExercise].demoType === 'pencil-vs-eraser' && '✏️🔳'}
                    {exercises[currentExercise].demoType === 'comparison-method' && '📏'}
                    {exercises[currentExercise].demoType === 'longer-concept' && '📐'}
                    {exercises[currentExercise].demoType === 'measuring-tool' && '📊'}
                    {exercises[currentExercise].demoType === 'same-length' && '⚖️'}
                    {exercises[currentExercise].demoType === 'animals-comparison' && '🐍🐛'}
                    {exercises[currentExercise].demoType === 'ruler-start' && '📏'}
                    {exercises[currentExercise].demoType === 'body-parts' && '👆💪'}
                    {exercises[currentExercise].demoType === 'ordering' && '📋'}
                    {exercises[currentExercise].demoType === 'units' && '📐'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {exercises[currentExercise].hint}
                  </p>
                </div>

                {/* Options de réponse */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {exercises[currentExercise].choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(choice)}
                      disabled={isCorrect !== null}
                      className={`p-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                        userAnswer === choice
                          ? isCorrect === true
                            ? 'bg-green-500 text-white shadow-lg'
                            : isCorrect === false
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-blue-500 text-white shadow-lg'
                          : isCorrect !== null && choice === exercises[currentExercise].correctAnswer
                          ? 'bg-green-200 text-green-800 shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>

                {/* Feedback et navigation */}
                {isCorrect !== null && (
                  <div className="text-center">
                    <div className={`inline-flex items-center px-6 py-3 rounded-xl font-bold text-lg mb-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 h-6 mr-2" />
                          Bravo ! Bonne réponse !
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 mr-2" />
                          Bonne réponse : {exercises[currentExercise].correctAnswer}
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={nextExercise}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
                    >
                      {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir les résultats'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Modal de fin */
              <div className="text-center">
                <div className="text-6xl mb-6">
                  {finalScore >= 8 ? '🏆' : finalScore >= 6 ? '🎉' : '💪'}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {finalScore >= 8 ? 'Excellent !' : finalScore >= 6 ? 'Très bien !' : 'Continue tes efforts !'}
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Tu as eu {finalScore} bonnes réponses sur {exercises.length} !
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetExercises}
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Recommencer
                  </button>
                  <Link
                    href="/chapitre/cp-grandeurs-mesures"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all inline-block"
                  >
                    Retour au chapitre
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