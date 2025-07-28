'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function MassesCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'weighing' | 'comparing' | 'result' | null>(null);
  const [animatingBalance, setAnimatingBalance] = useState(false);
  const [balanceState, setBalanceState] = useState<'left' | 'right' | 'equal' | 'neutral'>('neutral');
  const [objectsFalling, setObjectsFalling] = useState(false);
  const [weighingEffect, setWeighingEffect] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);
  const [scaleRotation, setScaleRotation] = useState(0);
  const [gravityEffect, setGravityEffect] = useState(false);
  
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

  // Concepts de masse avec animations avancées
  const massConcepts = [
    {
      name: 'plus lourd',
      emoji: '⚖️',
      color: 'blue',
      story: 'Cet objet fait pencher la balance de son côté !',
      examples: [
        {
          object1: { name: 'pomme', emoji: '🍎', mass: 150, color: '#EF4444', size: 'large' },
          object2: { name: 'plume', emoji: '🪶', mass: 5, color: '#E5E7EB', size: 'small' },
          result: 'La pomme est plus lourde que la plume',
          balanceResult: 'left',
          rotation: -15
        }
      ]
    },
    {
      name: 'plus léger',
      emoji: '🪶',
      color: 'green',
      story: 'Cet objet ne fait pas pencher la balance !',
      examples: [
        {
          object1: { name: 'bulle', emoji: '🫧', mass: 1, color: '#DBEAFE', size: 'tiny' },
          object2: { name: 'livre', emoji: '📚', mass: 300, color: '#059669', size: 'large' },
          result: 'La bulle est plus légère que le livre',
          balanceResult: 'right',
          rotation: 15
        }
      ]
    },
    {
      name: 'même poids',
      emoji: '⚖️',
      color: 'purple',
      story: 'Les deux objets font équilibre sur la balance !',
      examples: [
        {
          object1: { name: 'sac A', emoji: '🎒', mass: 200, color: '#8B5CF6', size: 'medium' },
          object2: { name: 'sac B', emoji: '🎒', mass: 200, color: '#3B82F6', size: 'medium' },
          result: 'Les deux sacs ont le même poids',
          balanceResult: 'equal',
          rotation: 0
        }
      ]
    },
    {
      name: 'kilogramme et gramme',
      emoji: '⚖️',
      color: 'orange',
      story: 'On mesure le poids en grammes et kilogrammes !',
      examples: [
        {
          object1: { name: 'chocolat', emoji: '🍫', mass: 100, color: '#92400E', size: 'small' },
          object2: { name: 'sucre', emoji: '🧂', mass: 1000, color: '#F3F4F6', size: 'large' },
          result: 'Le chocolat : 100g, le sucre : 1kg',
          balanceResult: 'right',
          rotation: 12
        }
      ]
    }
  ];

  // Exercices sur les masses
  const exercises = [
    { 
      question: 'Entre une plume et une pierre, laquelle est plus lourde ?', 
      correctAnswer: 'la pierre',
      choices: ['la plume', 'la pierre', 'elles sont pareilles'],
      hint: 'Pense à ce qui tombe plus vite...',
      demoType: 'feather-vs-stone'
    },
    { 
      question: 'Pour comparer deux poids, j\'utilise...', 
      correctAnswer: 'une balance',
      choices: ['mes yeux', 'une balance', 'mes mains'],
      hint: 'Un outil qui penche d\'un côté...',
      demoType: 'balance-tool'
    },
    { 
      question: 'Si un côté de la balance descend, c\'est que...', 
      correctAnswer: 'cet objet est plus lourd',
      choices: ['cet objet est plus léger', 'cet objet est plus lourd', 'les objets sont pareils'],
      hint: 'Le côté qui tombe...',
      demoType: 'balance-down'
    },
    { 
      question: 'Quand la balance est équilibrée, les objets...', 
      correctAnswer: 'ont le même poids',
      choices: ['sont très différents', 'ont le même poids', 'ne peuvent pas être comparés'],
      hint: 'Quand c\'est parfaitement horizontal...',
      demoType: 'balance-equal'
    },
    { 
      question: 'Entre un éléphant et une souris, lequel est plus lourd ?', 
      correctAnswer: 'l\'éléphant',
      choices: ['la souris', 'l\'éléphant', 'ils sont pareils'],
      hint: 'Compare la taille de ces animaux...',
      demoType: 'animals-mass'
    },
    { 
      question: 'Le poids se mesure en...', 
      correctAnswer: 'grammes et kilogrammes',
      choices: ['centimètres', 'grammes et kilogrammes', 'litres'],
      hint: 'Les unités pour peser...',
      demoType: 'units-mass'
    },
    { 
      question: '1 kilogramme, c\'est...', 
      correctAnswer: '1000 grammes',
      choices: ['10 grammes', '100 grammes', '1000 grammes'],
      hint: 'Kilo veut dire mille...',
      demoType: 'kilo-gram'
    },
    { 
      question: 'Une plume est...', 
      correctAnswer: 'très légère',
      choices: ['très lourde', 'très légère', 'moyenne'],
      hint: 'Elle vole dans l\'air...',
      demoType: 'feather-light'
    },
    { 
      question: 'Pour porter quelque chose de lourd, il faut...', 
      correctAnswer: 'être fort',
      choices: ['être rapide', 'être fort', 'être grand'],
      hint: 'Qu\'est-ce qui aide à soulever ?',
      demoType: 'heavy-lifting'
    },
    { 
      question: 'Un objet léger...', 
      correctAnswer: 'est facile à porter',
      choices: ['est difficile à porter', 'est facile à porter', 'ne peut pas bouger'],
      hint: 'Quand quelque chose pèse peu...',
      demoType: 'light-carry'
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
    setAnimatingBalance(false);
    setBalanceState('neutral');
    setObjectsFalling(false);
    setWeighingEffect(false);
    setSparkleEffect(false);
    setScaleRotation(0);
    setGravityEffect(false);
    
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
        audio: "Bonjour petit scientifique ! Aujourd'hui, nous allons apprendre à comparer les masses avec une balance magique !"
      },
      {
        action: () => {
          setHighlightedElement('concepts-explanation');
          setCurrentExample(0);
          setSparkleEffect(true);
        },
        audio: "Voici les 4 façons de comparer les masses ! Regarde comme la balance va bouger !"
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('weighing');
          setAnimatingBalance(true);
          setGravityEffect(true);
        },
        audio: "Commençons par 'plus lourd'. Je fais tomber une pomme et une plume sur la balance !"
      },
      {
        action: () => {
          setObjectsFalling(true);
          setWeighingEffect(true);
        },
        audio: "Regarde ! Les objets tombent avec la gravité... La pomme est plus lourde !"
      },
      {
        action: () => {
          setShowingProcess('comparing');
          setBalanceState('left');
          setScaleRotation(-15);
        },
        audio: "BOUM ! La balance penche du côté de la pomme ! Elle fait descendre son côté !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setSparkleEffect(true);
        },
        audio: "Fantastique ! Quand un objet fait pencher la balance, il est PLUS LOURD !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('weighing');
          setBalanceState('neutral');
          setScaleRotation(0);
          setObjectsFalling(false);
          setSparkleEffect(false);
        },
        audio: "Maintenant 'plus léger'. Regardons cette bulle et ce livre !"
      },
      {
        action: () => {
          setObjectsFalling(true);
          setGravityEffect(true);
        },
        audio: "La bulle flotte presque ! Elle est si légère qu'elle ne pèse rien !"
      },
      {
        action: () => {
          setShowingProcess('comparing');
          setBalanceState('right');
          setScaleRotation(15);
        },
        audio: "Regardez ! Le livre fait pencher la balance de l'autre côté !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setSparkleEffect(true);
        },
        audio: "Parfait ! Quand un objet ne fait pas pencher son côté, il est PLUS LÉGER !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setShowingProcess('weighing');
          setBalanceState('neutral');
          setScaleRotation(0);
          setObjectsFalling(false);
          setSparkleEffect(false);
        },
        audio: "Voici le 'même poids'. Deux sacs identiques vont se mesurer !"
      },
      {
        action: () => {
          setObjectsFalling(true);
          setWeighingEffect(true);
        },
        audio: "Les deux sacs tombent en même temps... Ils ont le même poids !"
      },
      {
        action: () => {
          setShowingProcess('comparing');
          setBalanceState('equal');
          setScaleRotation(0);
        },
        audio: "Incroyable ! La balance reste parfaitement équilibrée au milieu !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setSparkleEffect(true);
        },
        audio: "Merveilleux ! Quand la balance reste droite, les objets ont le MÊME POIDS !"
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('weighing');
          setBalanceState('neutral');
          setScaleRotation(0);
          setObjectsFalling(false);
          setSparkleEffect(false);
        },
        audio: "Enfin, mesurer en grammes et kilogrammes ! C'est pour connaître le poids exact !"
      },
      {
        action: () => {
          setObjectsFalling(true);
          setWeighingEffect(true);
        },
        audio: "Le chocolat pèse 100 grammes, le sucre pèse 1 kilogramme !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setBalanceState('right');
          setScaleRotation(12);
          setSparkleEffect(true);
        },
        audio: "Le sucre est 10 fois plus lourd ! 1 kilo = 1000 grammes !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
          setAnimatingBalance(false);
          setBalanceState('neutral');
          setObjectsFalling(false);
          setWeighingEffect(false);
          setSparkleEffect(true);
          setScaleRotation(0);
          setGravityEffect(false);
        },
        audio: "Extraordinaire ! Tu es maintenant un expert des masses et de la balance magique !"
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
      await playAudio("Maintenant, montre tes super-pouvoirs de pesage avec les exercices !");
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
        playAudio("Félicitations ! Tu es maintenant un expert des masses !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien les masses !");
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
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Effets de particules et gravité */}
      {sparkleEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
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
              {Math.random() > 0.5 ? '⚖️' : '💫'}
            </div>
          ))}
        </div>
      )}

      {/* Particules de gravité */}
      {gravityEffect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            >
              ⬇️
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fallWithGravity {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          30% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
          100% { transform: translateY(0) rotate(360deg); opacity: 1; }
        }
        @keyframes balanceTilt {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(var(--rotation, 0deg)) scale(1.1); }
          100% { transform: rotate(var(--rotation, 0deg)); }
        }
        @keyframes weighingBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.2); }
        }
        @keyframes scaleGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes plateShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes massIndicator {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
        @keyframes balanceSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes pulseMagnetic {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .fall-gravity { animation: fallWithGravity 2s ease-in; }
        .balance-tilt { animation: balanceTilt 1.5s ease-out; }
        .weighing-bounce { animation: weighingBounce 0.8s infinite; }
        .scale-glow { animation: scaleGlow 2s infinite; }
        .plate-shake { animation: plateShake 0.5s ease-in-out 3; }
        .mass-indicator { animation: massIndicator 1s ease-out; }
        .balance-swing { animation: balanceSwing 2s ease-in-out infinite; }
        .pulse-magnetic { animation: pulseMagnetic 2s infinite; }
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
            highlightedElement === 'introduction' ? 'transform scale-105 shadow-2xl bg-gradient-to-r from-blue-50 to-cyan-50' : ''
          }`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ⚖️ Comparer des masses
            </h1>
            <p className="text-lg text-gray-600">
              Découvre qui est plus lourd, plus léger, ou pareil !
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
                  ? 'bg-blue-500 text-white shadow-md transform scale-105' 
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
                  ? 'bg-blue-500 text-white shadow-md transform scale-105' 
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
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-xl hover:scale-105 pulse-magnetic'
                }`}
              >
                {isAnimationRunning ? '⚖️ Balance magique active...' : '🚀 DÉCOUVRIR LA BALANCE !'}
              </button>
            </div>

            {/* Explication du concept avec animations spectaculaires */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'introduction' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105 shadow-2xl' : ''
              }`}
            >
              <h2 className={`text-2xl font-bold text-center mb-6 text-gray-900 transition-all duration-500 ${
                highlightedElement === 'introduction' ? 'text-blue-600 weighing-bounce' : ''
              }`}>
                ⚖️ Comment comparer des masses ?
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className={`text-lg text-center text-blue-800 font-semibold mb-6 transition-all duration-500 ${
                  highlightedElement === 'introduction' ? 'balance-swing' : ''
                }`}>
                  Comparer des masses, c'est savoir qui est plus lourd, plus léger, ou pareil !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className={`text-2xl font-bold text-blue-600 mb-4 transition-all duration-500 ${
                      highlightedElement === 'concepts-explanation' ? 'weighing-bounce' : ''
                    }`}>
                      {currentExample !== null ? 
                        `⚖️ Découvrons : ${massConcepts[currentExample].name} ${massConcepts[currentExample].emoji}` 
                        : '🔬 Les 4 secrets de la balance magique ⚖️'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des concepts avec animations spectaculaires */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'concepts-explanation' ? 'ring-2 ring-blue-400 bg-blue-50 rounded-lg p-2' : ''
                  }`}>
                    {massConcepts.map((concept, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingBalance
                            ? 'ring-4 ring-blue-400 bg-blue-100 scale-110 shadow-2xl weighing-bounce' 
                            : sparkleEffect && currentExample === null ? 'pulse-magnetic' : ''
                        }`}
                      >
                        <div className={`text-3xl mb-2 transition-all duration-300 ${
                          currentExample === index && animatingBalance ? 'balance-swing' : ''
                        }`}>
                          {concept.emoji}
                        </div>
                        <h4 className="font-bold text-blue-700 mb-1 text-sm sm:text-base">{concept.name}</h4>
                        <p className="text-xs sm:text-sm text-blue-600">{concept.story.substring(0, 40)}...</p>
                        
                        {/* Zone d'animation spectaculaire pour chaque concept */}
                        {currentExample === index && animatingBalance && (
                          <div className="mt-4">
                            <div className="bg-gradient-to-b from-gray-50 to-blue-50 rounded-lg p-4 border-2 border-blue-300 shadow-inner relative overflow-hidden">
                              
                              {/* Balance 3D animée */}
                              <div className="flex justify-center items-center mb-6 relative">
                                {/* Support central */}
                                <div className="relative">
                                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gray-600 rounded-full"></div>
                                  <div className="absolute left-1/2 transform -translate-x-1/2 top-10 w-3 h-3 bg-gray-800 rounded-full"></div>
                                  
                                  {/* Barre de la balance */}
                                  <div 
                                    className={`relative transition-all duration-1000 ${
                                      weighingEffect ? 'scale-glow balance-tilt' : ''
                                    }`}
                                                                         style={{ 
                                       transform: `rotate(${scaleRotation}deg)`,
                                       '--rotation': `${scaleRotation}deg`
                                     } as React.CSSProperties}
                                  >
                                    <div className="w-20 h-1 bg-gray-600 rounded-full relative">
                                      {/* Plateau gauche */}
                                      <div 
                                        className={`absolute -left-6 -top-4 w-12 h-6 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg border-2 border-yellow-400 flex items-center justify-center shadow-lg ${
                                          balanceState === 'left' ? 'plate-shake' : ''
                                        }`}
                                      >
                                        {objectsFalling && showingProcess === 'weighing' && (
                                          <div className={`text-2xl fall-gravity`}>
                                            {concept.examples[0].object1.emoji}
                                          </div>
                                        )}
                                        {showingProcess === 'comparing' && (
                                          <div 
                                            className={`text-lg transition-all duration-500 ${
                                              balanceState === 'left' ? 'weighing-bounce' : ''
                                            }`}
                                            style={{ 
                                              color: concept.examples[0].object1.color,
                                              transform: `scale(${concept.examples[0].object1.size === 'large' ? 1.3 : concept.examples[0].object1.size === 'small' ? 0.8 : concept.examples[0].object1.size === 'tiny' ? 0.6 : 1})`
                                            }}
                                          >
                                            {concept.examples[0].object1.emoji}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Plateau droit */}
                                      <div 
                                        className={`absolute -right-6 -top-4 w-12 h-6 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg border-2 border-yellow-400 flex items-center justify-center shadow-lg ${
                                          balanceState === 'right' ? 'plate-shake' : ''
                                        }`}
                                      >
                                        {objectsFalling && showingProcess === 'weighing' && (
                                          <div className={`text-2xl fall-gravity`} style={{animationDelay: '0.3s'}}>
                                            {concept.examples[0].object2.emoji}
                                          </div>
                                        )}
                                        {showingProcess === 'comparing' && (
                                          <div 
                                            className={`text-lg transition-all duration-500 ${
                                              balanceState === 'right' ? 'weighing-bounce' : ''
                                            }`}
                                            style={{ 
                                              color: concept.examples[0].object2.color,
                                              transform: `scale(${concept.examples[0].object2.size === 'large' ? 1.3 : concept.examples[0].object2.size === 'small' ? 0.8 : concept.examples[0].object2.size === 'tiny' ? 0.6 : 1})`
                                            }}
                                          >
                                            {concept.examples[0].object2.emoji}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Indicateurs de poids */}
                              {showingProcess === 'comparing' && (
                                <div className="flex justify-between text-xs font-bold mb-3">
                                  <div className={`text-center mass-indicator ${balanceState === 'left' ? 'text-red-600' : 'text-gray-600'}`}>
                                    <div>{concept.examples[0].object1.name}</div>
                                    <div>{concept.examples[0].object1.mass}g</div>
                                  </div>
                                  <div className={`text-center mass-indicator ${balanceState === 'right' ? 'text-red-600' : 'text-gray-600'}`}>
                                    <div>{concept.examples[0].object2.name}</div>
                                    <div>{concept.examples[0].object2.mass}g</div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Résultat avec effet spectaculaire */}
                              {showingProcess === 'result' && (
                                <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-lg p-3 shadow-lg border-2 border-blue-400 relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                                  <p className="text-sm font-bold text-blue-800 text-center balance-swing relative z-10">
                                    🎉 {concept.examples[0].result} 🎉
                                  </p>
                                  <div className="flex justify-center mt-2 space-x-1">
                                    {[...Array(6)].map((_, i) => (
                                      <span key={i} className="text-yellow-400 animate-bounce" style={{animationDelay: `${i*0.1}s`}}>⚖️</span>
                                    ))}
                                  </div>
                                  
                                  {/* Mesures en unités pour le concept 4 */}
                                  {currentExample === 3 && (
                                    <div className="mt-3 bg-yellow-100 rounded-lg p-2">
                                      <p className="text-xs text-center text-yellow-800 font-bold">
                                        💡 1 kilogramme = 1000 grammes !
                                      </p>
                                    </div>
                                  )}
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
                    highlightedElement === 'summary' ? 'bg-gradient-to-r from-blue-200 to-cyan-200 scale-110 shadow-xl pulse-magnetic' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-blue-800">
                      ⚖️ <strong>Maintenant tu peux :</strong> Comparer toutes les masses comme un scientifique !
                    </p>
                    {highlightedElement === 'summary' && (
                      <div className="flex justify-center mt-2 space-x-1">
                        {[...Array(8)].map((_, i) => (
                          <span key={i} className="text-2xl animate-bounce" style={{animationDelay: `${i*0.1}s`}}>🔬</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques avec animations */}
            <div className={`bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-6 shadow-lg transition-all duration-500 ${
              sparkleEffect ? 'shadow-2xl ring-2 ring-cyan-300' : ''
            }`}>
              <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">
                🎁 Secrets magiques de la balance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { icon: '⚖️', title: 'Utilise une balance', desc: 'Le côté qui descend est plus lourd', color: 'from-blue-200 to-blue-100' },
                  { icon: '👐', title: 'Sens avec tes mains', desc: 'Porte les objets pour sentir la différence', color: 'from-cyan-200 to-cyan-100' },
                  { icon: '📊', title: 'Mesure en grammes', desc: 'Pour connaître le poids exact', color: 'from-indigo-200 to-indigo-100' },
                  { icon: '🔢', title: '1 kg = 1000 g', desc: 'Rappelle-toi cette équivalence', color: 'from-purple-200 to-purple-100' }
                ].map((tip, index) => (
                  <div key={index} className={`bg-gradient-to-r ${tip.color} rounded-xl p-4 transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                    sparkleEffect ? 'pulse-magnetic' : ''
                  }`}>
                    <div className="text-2xl mb-2">{tip.icon}</div>
                    <h4 className="font-bold text-blue-700 mb-2">{tip.title}</h4>
                    <p className="text-blue-600">{tip.desc}</p>
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
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
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
                    {exercises[currentExercise].demoType === 'feather-vs-stone' && '🪶🪨'}
                    {exercises[currentExercise].demoType === 'balance-tool' && '⚖️'}
                    {exercises[currentExercise].demoType === 'balance-down' && '⚖️⬇️'}
                    {exercises[currentExercise].demoType === 'balance-equal' && '⚖️➡️'}
                    {exercises[currentExercise].demoType === 'animals-mass' && '🐘🐭'}
                    {exercises[currentExercise].demoType === 'units-mass' && '📊'}
                    {exercises[currentExercise].demoType === 'kilo-gram' && '🔢'}
                    {exercises[currentExercise].demoType === 'feather-light' && '🪶'}
                    {exercises[currentExercise].demoType === 'heavy-lifting' && '💪'}
                    {exercises[currentExercise].demoType === 'light-carry' && '🎈'}
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
                    className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
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