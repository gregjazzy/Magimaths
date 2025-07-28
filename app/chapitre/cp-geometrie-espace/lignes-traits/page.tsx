'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Minus, MoreHorizontal, Waves, Zap } from 'lucide-react';

export default function LignesTraitsCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'preparation' | 'tracing' | 'result' | null>(null);
  const [animatingLine, setAnimatingLine] = useState(false);
  const [tracingProgress, setTracingProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showingTool, setShowingTool] = useState<string | null>(null);
  
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

  // Types de lignes à apprendre
  const lineTypes = [
    {
      name: 'ligne droite',
      emoji: '📏',
      icon: Minus,
      color: 'blue',
      story: 'Une ligne droite va toujours dans la même direction, comme un chemin tout droit',
      characteristics: [
        'Elle ne tourne jamais',
        'Elle est parfaitement droite',
        'On utilise une règle pour la tracer'
      ],
      examples: ['📏 règle', '🏗️ poutre', '🛣️ autoroute', '📐 côté de carré', '🎯 rayon'],
      tools: ['règle', 'crayon'],
      steps: ['poser la règle', 'tracer le long de la règle']
    },
    {
      name: 'ligne courbe',
      emoji: '🌙',
      icon: Waves,
      color: 'green',
      story: 'Une ligne courbe tourne doucement, comme un arc-en-ciel ou un sourire',
      characteristics: [
        'Elle tourne en douceur',
        'Elle n\'a pas de coins',
        'On la trace à main levée'
      ],
      examples: ['🌈 arc-en-ciel', '😊 sourire', '🌙 croissant', '🎢 toboggan', '🐍 serpent'],
      tools: ['crayon'],
      steps: ['choisir le sens', 'tracer en tournant doucement']
    },
    {
      name: 'ligne brisée',
      emoji: '⚡',
      icon: Zap,
      color: 'orange',
      story: 'Une ligne brisée est faite de plusieurs lignes droites qui se touchent',
      characteristics: [
        'Elle a des coins pointus',
        'Elle change de direction',
        'Chaque partie est droite'
      ],
      examples: ['⚡ éclair', '🏔️ montagne', '📊 graphique', '🎯 flèche', '🔺 triangle'],
      tools: ['règle', 'crayon'],
      steps: ['tracer premier segment', 'changer de direction', 'tracer segments suivants']
    },
    {
      name: 'ligne pointillée',
      emoji: '⋯',
      icon: MoreHorizontal,
      color: 'purple',
      story: 'Une ligne pointillée est faite de petits traits séparés, comme des pas sur le sable',
      characteristics: [
        'Elle a des espaces vides',
        'Les traits sont réguliers',
        'On peut la couper ou la déchirer facilement'
      ],
      examples: ['✂️ découpage', '🎫 ticket', '📋 formulaire', '🗺️ frontière', '🚗 route'],
      tools: ['règle', 'crayon'],
      steps: ['mesurer les espaces', 'tracer trait', 'laisser espace', 'répéter']
    }
  ];

  // Exercices sur les lignes et traits
  const exercises = [
    { 
      question: 'Une ligne droite...', 
      correctAnswer: 'ne tourne jamais',
      choices: ['tourne souvent', 'ne tourne jamais', 'a des coins'],
      hint: 'Pense à une règle...',
      demoType: 'straight-line'
    },
    { 
      question: 'Pour tracer une ligne droite, j\'utilise...', 
      correctAnswer: 'une règle',
      choices: ['mes doigts', 'une règle', 'une gomme'],
      hint: 'L\'outil qui aide à tracer droit...',
      demoType: 'straight-line-tool'
    },
    { 
      question: 'Une ligne courbe...', 
      correctAnswer: 'tourne en douceur',
      choices: ['est droite', 'tourne en douceur', 'a des coins pointus'],
      hint: 'Comme un sourire ou un arc-en-ciel...',
      demoType: 'curved-line'
    },
    { 
      question: 'Une ligne brisée est faite de...', 
      correctAnswer: 'segments droits',
      choices: ['courbes', 'segments droits', 'points'],
      hint: 'Comme un éclair ou une montagne...',
      demoType: 'broken-line'
    },
    { 
      question: 'Une ligne pointillée a...', 
      correctAnswer: 'des espaces vides',
      choices: ['des couleurs', 'des espaces vides', 'des formes'],
      hint: 'Comme les traits d\'un ticket à découper...',
      demoType: 'dotted-line'
    },
    { 
      question: 'Quel outil utilise-t-on pour une ligne droite parfaite ?', 
      correctAnswer: 'règle',
      choices: ['compas', 'règle', 'équerre'],
      hint: 'L\'outil le plus simple pour tracer droit...',
      demoType: 'tools'
    },
    { 
      question: 'Dans quelle direction va une ligne droite ?', 
      correctAnswer: 'toujours la même',
      choices: ['elle change', 'toujours la même', 'en rond'],
      hint: 'Comme une autoroute bien droite...',
      demoType: 'direction'
    },
    { 
      question: 'Comment trace-t-on une ligne courbe ?', 
      correctAnswer: 'à main levée',
      choices: ['avec une règle', 'à main levée', 'avec un compas'],
      hint: 'Sans outil, juste avec le crayon...',
      demoType: 'curved-technique'
    },
    { 
      question: 'Une ligne brisée change...', 
      correctAnswer: 'de direction',
      choices: ['de couleur', 'de direction', 'de taille'],
      hint: 'A chaque coin, elle va ailleurs...',
      demoType: 'broken-direction'
    },
    { 
      question: 'Les espaces dans une ligne pointillée sont...', 
      correctAnswer: 'réguliers',
      choices: ['différents', 'réguliers', 'colorés'],
      hint: 'Tous pareils, comme un rythme...',
      demoType: 'dotted-spacing'
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
    setAnimatingLine(false);
    setTracingProgress(0);
    setCurrentStep(0);
    setShowingTool(null);
    
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

  // Fonction pour démarrer la leçon
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
        audio: "Bonjour petit artiste ! Aujourd'hui, nous allons apprendre à tracer les 4 types de lignes. C'est la base de tous les dessins !"
      },
      {
        action: () => {
          setHighlightedElement('lines-explanation');
          setCurrentExample(0);
        },
        audio: "Voici les 4 types de lignes magiques : la ligne droite, la ligne courbe, la ligne brisée et la ligne pointillée."
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('preparation');
          setAnimatingLine(true);
        },
        audio: "Commençons par la ligne droite. Elle va toujours dans la même direction, comme une autoroute bien droite !"
      },
      {
        action: () => {
          setShowingProcess('tracing');
          setShowingTool('règle');
          setTracingProgress(0);
          // Animation du tracé
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 10;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 200);
        },
        audio: "On pose la règle et on trace le long de la règle. Regarde comme elle est parfaitement droite !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('preparation');
          setTracingProgress(0);
        },
        audio: "Maintenant la ligne courbe ! Elle tourne en douceur, comme un sourire ou un arc-en-ciel."
      },
      {
        action: () => {
          setShowingProcess('tracing');
          setShowingTool('crayon');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 10;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 200);
        },
        audio: "On la trace à main levée, en tournant doucement notre crayon. Pas de règle pour celle-ci !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setShowingProcess('preparation');
          setTracingProgress(0);
        },
        audio: "Voici la ligne brisée ! Elle est faite de plusieurs segments droits qui se touchent, comme un éclair !"
      },
      {
        action: () => {
          setShowingProcess('tracing');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 20;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 300);
        },
        audio: "On trace le premier segment, puis on change de direction et on trace le suivant. Chaque partie est droite !"
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('preparation');
          setTracingProgress(0);
        },
        audio: "Enfin, la ligne pointillée ! Elle est faite de petits traits séparés, comme des pas sur le sable."
      },
      {
        action: () => {
          setShowingProcess('tracing');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 15;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 250);
        },
        audio: "On trace un petit trait, on laisse un espace, on trace un autre trait. Les espaces sont réguliers !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
        },
        audio: "Parfait ! Maintenant tu connais les 4 types de lignes. Tu peux les utiliser pour tous tes dessins !"
      }
    ];

    for (let i = 0; i < steps.length && !stopSignalRef.current; i++) {
      steps[i].action();
      await playAudio(steps[i].audio);
      
      if (!stopSignalRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!stopSignalRef.current) {
      setIsAnimationRunning(false);
      setHighlightedElement('exercises');
      await playAudio("Maintenant, teste tes connaissances avec les exercices !");
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
        playAudio("Félicitations ! Tu es maintenant un expert des lignes et des traits !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien les lignes et les traits !");
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
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-geometrie-espace" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la géométrie et espace</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📏 Lignes et traits
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les 4 types de lignes pour devenir un maître du trait !
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
                  ? 'bg-green-500 text-white shadow-md' 
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
                  ? 'bg-green-500 text-white shadow-md' 
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
            {/* Bouton COMMENCER */}
            <div className="text-center mb-6">
              <button
                onClick={startLesson}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-xl hover:scale-105'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Explication du concept */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'introduction' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ✏️ Qu'est-ce qu'une ligne ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-green-800 font-semibold mb-6">
                  Une ligne est un trait ! Il y a 4 types de lignes magiques pour dessiner !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-green-600 mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${lineTypes[currentExample].name} ${lineTypes[currentExample].emoji}` 
                        : 'Les 4 types de lignes magiques ✏️'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des types de lignes */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'lines-explanation' ? 'ring-2 ring-green-400' : ''
                  }`}>
                    {lineTypes.map((lineType, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingLine
                            ? 'ring-4 ring-green-400 bg-green-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{lineType.emoji}</div>
                        <h4 className="font-bold text-green-700 mb-1 text-sm sm:text-base">{lineType.name}</h4>
                        <p className="text-xs sm:text-sm text-green-600">{lineType.characteristics[0]}</p>
                        
                        {/* Zone d'animation pour chaque type de ligne */}
                        {currentExample === index && animatingLine && (
                          <div className="mt-4">
                            {/* Barre de progression du tracé */}
                            {showingProcess === 'tracing' && (
                              <div className="bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${tracingProgress}%` }}
                                />
                              </div>
                            )}
                            
                            {/* Outil utilisé */}
                            {showingTool && (
                              <div className="bg-green-100 rounded-lg p-2 mt-2">
                                <p className="text-xs font-bold text-green-800">
                                  Outil : {showingTool}
                                </p>
                              </div>
                            )}
                            
                            {/* Étapes */}
                            {showingProcess === 'result' && (
                              <div className="bg-green-100 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-green-800 mb-2 text-xs">Étapes :</h5>
                                <div className="space-y-1">
                                  {lineType.steps.map((step, stepIndex) => (
                                    <div key={stepIndex} className="text-xs text-green-600">
                                      {stepIndex + 1}. {step}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Exemples dans la vie */}
                            {showingProcess === 'result' && (
                              <div className="bg-blue-50 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-blue-800 mb-2 text-xs">Tu peux voir des {lineType.name}s :</h5>
                                <div className="flex flex-wrap gap-1">
                                  {lineType.examples.map((example, exIndex) => (
                                    <span
                                      key={exIndex}
                                      className="bg-white px-1 py-0.5 rounded text-xs text-blue-700"
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
                    <p className="text-center font-medium text-green-800">
                      ✏️ <strong>Maintenant tu peux :</strong> Tracer tous les types de lignes !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-teal-100 to-green-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
                🎁 Conseils pour bien tracer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📏</div>
                  <h4 className="font-bold text-green-700 mb-2">Utilise une règle</h4>
                  <p className="text-green-600">Pour les lignes droites et brisées</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">✋</div>
                  <h4 className="font-bold text-green-700 mb-2">À main levée</h4>
                  <p className="text-green-600">Pour les lignes courbes, c'est plus joli</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-green-700 mb-2">Regarde bien</h4>
                  <p className="text-green-600">Observe la direction de ta ligne</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-bold text-green-700 mb-2">Entraîne-toi</h4>
                  <p className="text-green-600">Plus tu traces, mieux tu deviens !</p>
                </div>
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
                    {exercises[currentExercise].demoType === 'straight-line' && '📏'}
                    {exercises[currentExercise].demoType === 'curved-line' && '🌙'}
                    {exercises[currentExercise].demoType === 'broken-line' && '⚡'}
                    {exercises[currentExercise].demoType === 'dotted-line' && '⋯'}
                    {exercises[currentExercise].demoType === 'tools' && '🛠️'}
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
                    href="/chapitre/cp-geometrie-espace"
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