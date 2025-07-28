'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Copy, Eye, Grid } from 'lucide-react';

export default function ReproductionsCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'observation' | 'analysis' | 'reproduction' | 'verification' | null>(null);
  const [animatingReproduction, setAnimatingReproduction] = useState(false);
  const [reproductionProgress, setReproductionProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);
  const [reproductionSteps, setReproductionSteps] = useState<string[]>([]);
  
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

  // Figures à reproduire (du simple au complexe)
  const reproductionExamples = [
    {
      name: 'carré simple',
      emoji: '🟦',
      color: 'blue',
      difficulty: 'facile',
      story: 'Reproduisons un carré, la forme la plus simple avec 4 côtés égaux',
      originalDescription: 'Un carré avec 4 côtés égaux',
      steps: [
        'Observer les 4 côtés égaux',
        'Tracer le côté du haut',
        'Tracer le côté de droite',
        'Tracer le côté du bas',
        'Tracer le côté de gauche',
        'Vérifier que tous les côtés sont égaux'
      ],
      checkPoints: ['4 côtés', 'tous égaux', 'coins droits'],
      tips: 'Utilise une règle pour que tous les côtés soient parfaitement égaux'
    },
    {
      name: 'maison simple',
      emoji: '🏠',
      color: 'red',
      difficulty: 'moyen',
      story: 'Reproduisons une maison avec un carré et un triangle',
      originalDescription: 'Une maison avec base carrée et toit triangulaire',
      steps: [
        'Observer la base carrée',
        'Observer le toit triangulaire',
        'Tracer le carré de base',
        'Tracer le triangle du toit',
        'Ajouter la porte',
        'Vérifier les proportions'
      ],
      checkPoints: ['carré de base', 'triangle du toit', 'porte centrée'],
      tips: 'Le triangle doit être bien centré sur le carré'
    },
    {
      name: 'fleur géométrique',
      emoji: '🌸',
      color: 'pink',
      difficulty: 'moyen',
      story: 'Reproduisons une fleur faite de cercles et de lignes',
      originalDescription: 'Une fleur avec centre rond et 6 pétales',
      steps: [
        'Observer le centre rond',
        'Compter les 6 pétales',
        'Tracer le cercle central',
        'Tracer les 6 pétales autour',
        'Ajouter la tige',
        'Vérifier la symétrie'
      ],
      checkPoints: ['centre rond', '6 pétales égaux', 'tige droite'],
      tips: 'Tous les pétales doivent être à la même distance du centre'
    },
    {
      name: 'robot géométrique',
      emoji: '🤖',
      color: 'gray',
      difficulty: 'difficile',
      story: 'Reproduisons un robot avec plusieurs formes géométriques',
      originalDescription: 'Un robot avec tête carrée, corps rectangulaire et bras',
      steps: [
        'Observer chaque partie du robot',
        'Tracer la tête carrée',
        'Tracer le corps rectangulaire',
        'Ajouter les bras rectangulaires',
        'Tracer les jambes',
        'Ajouter les détails du visage'
      ],
      checkPoints: ['tête carrée', 'corps rectangle', 'bras symétriques'],
      tips: 'Chaque partie du robot est une forme géométrique simple'
    }
  ];

  // Exercices sur la reproduction de figures
  const exercises = [
    { 
      question: 'Pour bien reproduire une figure, je dois d\'abord...', 
      correctAnswer: 'bien l\'observer',
      choices: ['la dessiner rapidement', 'bien l\'observer', 'choisir mes couleurs'],
      hint: 'Regarde bien tous les détails avant de commencer...',
      demoType: 'observation'
    },
    { 
      question: 'Un carré a...', 
      correctAnswer: '4 côtés égaux',
      choices: ['3 côtés', '4 côtés égaux', '5 côtés'],
      hint: 'Compte bien les côtés d\'un carré...',
      demoType: 'square'
    },
    { 
      question: 'Pour reproduire une maison, je commence par...', 
      correctAnswer: 'la base',
      choices: ['le toit', 'la base', 'la porte'],
      hint: 'On construit toujours du bas vers le haut...',
      demoType: 'house'
    },
    { 
      question: 'Une reproduction réussie doit avoir...', 
      correctAnswer: 'les mêmes formes',
      choices: ['les mêmes couleurs', 'les mêmes formes', 'la même taille exacte'],
      hint: 'L\'important c\'est la forme, pas la couleur...',
      demoType: 'shapes'
    },
    { 
      question: 'Pour vérifier ma reproduction, je...', 
      correctAnswer: 'compare avec l\'original',
      choices: ['ferme les yeux', 'compare avec l\'original', 'recommence'],
      hint: 'Il faut toujours vérifier son travail...',
      demoType: 'verification'
    },
    { 
      question: 'Quand je reproduis, j\'utilise...', 
      correctAnswer: 'mes yeux et mes mains',
      choices: ['seulement mes yeux', 'mes yeux et mes mains', 'seulement mes mains'],
      hint: 'Il faut regarder ET dessiner...',
      demoType: 'tools'
    },
    { 
      question: 'Une figure complexe est faite de...', 
      correctAnswer: 'formes simples',
      choices: ['formes compliquées', 'formes simples', 'formes invisibles'],
      hint: 'Même les dessins compliqués sont faits de formes de base...',
      demoType: 'complex'
    },
    { 
      question: 'Reproduire, c\'est...', 
      correctAnswer: 'faire pareil',
      choices: ['faire différent', 'faire pareil', 'faire plus beau'],
      hint: 'Re-produire veut dire faire la même chose...',
      demoType: 'reproduce'
    },
    { 
      question: 'Pour bien tracer, j\'ai besoin de...', 
      correctAnswer: 'me concentrer',
      choices: ['aller vite', 'me concentrer', 'parler fort'],
      hint: 'La concentration aide à bien dessiner...',
      demoType: 'concentration'
    },
    { 
      question: 'Si je me trompe, je peux...', 
      correctAnswer: 'effacer et recommencer',
      choices: ['abandonner', 'effacer et recommencer', 'laisser comme ça'],
      hint: 'Les erreurs, ça se corrige !',
      demoType: 'mistakes'
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
    setAnimatingReproduction(false);
    setReproductionProgress(0);
    setCurrentStep(0);
    setHighlightedPart(null);
    setReproductionSteps([]);
    
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
        audio: "Bonjour petit artiste ! Aujourd'hui, nous allons apprendre à reproduire des figures. C'est comme être un détective qui observe et copie !"
      },
      {
        action: () => {
          setHighlightedElement('figures-explanation');
          setCurrentExample(0);
        },
        audio: "Voici différentes figures à reproduire : du carré simple au robot complexe. Chacune a ses secrets !"
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('observation');
          setAnimatingReproduction(true);
        },
        audio: "Commençons par un carré simple. D'abord, on observe bien : 4 côtés égaux, 4 coins droits."
      },
      {
        action: () => {
          setShowingProcess('analysis');
          setHighlightedPart('sides');
          setReproductionSteps(['Observer les côtés', 'Compter : 1, 2, 3, 4']);
        },
        audio: "Je regarde chaque côté : ils sont tous de la même longueur. Je les compte : 1, 2, 3, 4 côtés !"
      },
      {
        action: () => {
          setShowingProcess('reproduction');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 20;
            setReproductionProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('verification');
            }
          }, 500);
        },
        audio: "Maintenant je reproduis : je trace un côté, puis le suivant, et encore le suivant. J'essaie de faire pareil !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('observation');
          setReproductionProgress(0);
          setReproductionSteps([]);
        },
        audio: "Passons à la maison ! C'est plus complexe : une base carrée et un toit triangulaire."
      },
      {
        action: () => {
          setShowingProcess('analysis');
          setHighlightedPart('parts');
          setReproductionSteps(['Base = carré', 'Toit = triangle', 'Porte = rectangle']);
        },
        audio: "J'analyse : en bas un carré pour la base, en haut un triangle pour le toit, et une petite porte."
      },
      {
        action: () => {
          setShowingProcess('reproduction');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 15;
            setReproductionProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('verification');
            }
          }, 400);
        },
        audio: "Je reproduis étape par étape : d'abord la base, puis le toit, et enfin la porte. Chaque partie séparément !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
          setReproductionSteps([]);
        },
        audio: "Parfait ! La méthode est toujours la même : observer, analyser, reproduire étape par étape, puis vérifier !"
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
      await playAudio("Maintenant, teste tes talents de reproduction avec les exercices !");
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
        playAudio("Félicitations ! Tu es maintenant un expert de la reproduction !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien comment reproduire !");
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
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
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
              🎨 Reproduire des figures
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à observer et reproduire comme un vrai détective !
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
                  ? 'bg-orange-500 text-white shadow-md' 
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
                  ? 'bg-orange-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'introduction' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Qu'est-ce que reproduire ?
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-orange-800 font-semibold mb-6">
                  Reproduire, c'est observer une figure et la dessiner pareil, comme un détective !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {currentExample !== null ? 
                        `Reproduisons : ${reproductionExamples[currentExample].name} ${reproductionExamples[currentExample].emoji}` 
                        : 'Les étapes de reproduction 🎯'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des figures */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'figures-explanation' ? 'ring-2 ring-orange-400' : ''
                  }`}>
                    {reproductionExamples.map((figure, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingReproduction
                            ? 'ring-4 ring-orange-400 bg-orange-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{figure.emoji}</div>
                        <h4 className="font-bold text-orange-700 mb-1 text-sm sm:text-base">{figure.name}</h4>
                        <p className="text-xs sm:text-sm text-orange-600">{figure.difficulty}</p>
                        
                        {/* Zone d'animation pour chaque figure */}
                        {currentExample === index && animatingReproduction && (
                          <div className="mt-4">
                            {/* Étape en cours */}
                            {showingProcess && (
                              <div className="bg-orange-100 rounded-lg p-2 mb-2">
                                <p className="text-xs font-bold text-orange-800">
                                  {showingProcess === 'observation' && '👀 J\'observe'}
                                  {showingProcess === 'analysis' && '🧠 J\'analyse'}
                                  {showingProcess === 'reproduction' && '✏️ Je reproduis'}
                                  {showingProcess === 'verification' && '✅ Je vérifie'}
                                </p>
                              </div>
                            )}
                            
                            {/* Barre de progression de la reproduction */}
                            {showingProcess === 'reproduction' && (
                              <div className="bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${reproductionProgress}%` }}
                                />
                              </div>
                            )}
                            
                            {/* Étapes de reproduction */}
                            {reproductionSteps.length > 0 && (
                              <div className="bg-orange-100 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-orange-800 mb-2 text-xs">Étapes :</h5>
                                <div className="space-y-1">
                                  {reproductionSteps.map((step, stepIndex) => (
                                    <div key={stepIndex} className="text-xs text-orange-600">
                                      {stepIndex + 1}. {step}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Points de vérification */}
                            {showingProcess === 'verification' && (
                              <div className="bg-green-100 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-green-800 mb-2 text-xs">Je vérifie :</h5>
                                <div className="space-y-1">
                                  {figure.checkPoints.map((point, pointIndex) => (
                                    <div key={pointIndex} className="text-xs text-green-600 flex items-center">
                                      <span className="mr-1">✅</span> {point}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Méthode de reproduction */}
                  <div className={`mt-6 p-4 rounded-xl transition-all duration-500 ${
                    highlightedElement === 'summary' ? 'bg-green-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-orange-800">
                      🎯 <strong>La méthode :</strong> Observer → Analyser → Reproduire → Vérifier !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-orange-800 mb-4 text-center">
                🎁 Conseils pour bien reproduire
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-orange-700 mb-2">Observe d'abord</h4>
                  <p className="text-orange-600">Regarde bien tous les détails avant de dessiner</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🧩</div>
                  <h4 className="font-bold text-orange-700 mb-2">Découpe en parties</h4>
                  <p className="text-orange-600">Les figures complexes sont faites de formes simples</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📐</div>
                  <h4 className="font-bold text-orange-700 mb-2">Prends ton temps</h4>
                  <p className="text-orange-600">Va étape par étape, sans te presser</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <h4 className="font-bold text-orange-700 mb-2">Vérifie ton travail</h4>
                  <p className="text-orange-600">Compare toujours avec l'original</p>
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
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
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
                    {exercises[currentExercise].demoType === 'observation' && '👀'}
                    {exercises[currentExercise].demoType === 'square' && '🟦'}
                    {exercises[currentExercise].demoType === 'house' && '🏠'}
                    {exercises[currentExercise].demoType === 'shapes' && '🔺'}
                    {exercises[currentExercise].demoType === 'verification' && '✅'}
                    {exercises[currentExercise].demoType === 'tools' && '✏️'}
                    {exercises[currentExercise].demoType === 'complex' && '🤖'}
                    {exercises[currentExercise].demoType === 'reproduce' && '🎨'}
                    {exercises[currentExercise].demoType === 'concentration' && '🎯'}
                    {exercises[currentExercise].demoType === 'mistakes' && '🔄'}
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
                    className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
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