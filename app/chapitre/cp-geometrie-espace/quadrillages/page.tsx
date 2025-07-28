'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Grid, Navigation, Move, MapPin } from 'lucide-react';

export default function QuadrillagesCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'grid' | 'navigation' | 'positioning' | 'result' | null>(null);
  const [animatingNavigation, setAnimatingNavigation] = useState(false);
  const [navigatorPosition, setNavigatorPosition] = useState<{row: number, col: number}>({row: 2, col: 2});
  const [targetPosition, setTargetPosition] = useState<{row: number, col: number}>({row: 0, col: 0});
  const [currentPath, setCurrentPath] = useState<{row: number, col: number}[]>([]);
  const [highlightedCell, setHighlightedCell] = useState<{row: number, col: number} | null>(null);
  
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

  // Concepts de quadrillage à apprendre
  const gridConcepts = [
    {
      name: 'lignes et colonnes',
      emoji: '📊',
      color: 'blue',
      story: 'Un quadrillage est fait de lignes horizontales et verticales qui se croisent',
      demonstration: {
        type: 'grid-explanation',
        highlights: ['horizontal-lines', 'vertical-lines', 'intersections']
      },
      examples: ['📋 tableau', '🗓️ calendrier', '🏁 damier', '📊 graphique', '🧩 grille']
    },
    {
      name: 'cases et nœuds',
      emoji: '⬜',
      color: 'green',
      story: 'Les cases sont les carrés, les nœuds sont les croisements des lignes',
      demonstration: {
        type: 'cells-and-nodes',
        highlights: ['cells', 'nodes', 'boundaries']
      },
      examples: ['🏠 cases maison', '⭕ nœuds cordes', '🎯 croisements', '📐 intersections', '🔗 jonctions']
    },
    {
      name: 'coordonnées simples',
      emoji: '📍',
      color: 'red',
      story: 'Chaque case a une adresse : ligne 1, colonne A par exemple',
      demonstration: {
        type: 'coordinates',
        highlights: ['row-labels', 'column-labels', 'specific-cell']
      },
      examples: ['🗺️ carte', '🎪 places assises', '🚢 bataille navale', '📚 bibliothèque', '🏪 magasin']
    },
    {
      name: 'déplacements',
      emoji: '🧭',
      color: 'purple',
      story: 'On peut se déplacer sur le quadrillage : haut, bas, gauche, droite',
      demonstration: {
        type: 'navigation',
        highlights: ['start-position', 'movements', 'end-position']
      },
      examples: ['🚶‍♂️ marche', '🚗 conduite', '🎮 jeu vidéo', '🤖 robot', '🔄 parcours']
    }
  ];

  // Exercices sur le quadrillage
  const exercises = [
    { 
      question: 'Un quadrillage est fait de...', 
      correctAnswer: 'lignes qui se croisent',
      choices: ['cercles', 'lignes qui se croisent', 'triangles'],
      hint: 'Pense aux lignes horizontales et verticales...',
      demoType: 'basic-grid'
    },
    { 
      question: 'Les carrés du quadrillage s\'appellent...', 
      correctAnswer: 'cases',
      choices: ['cases', 'boîtes', 'fenêtres'],
      hint: 'Comme les cases d\'un jeu de l\'oie...',
      demoType: 'cells'
    },
    { 
      question: 'Pour aller d\'une case à une autre, je peux me déplacer...', 
      correctAnswer: 'en haut, bas, gauche, droite',
      choices: ['seulement en diagonal', 'en haut, bas, gauche, droite', 'seulement en rond'],
      hint: 'Comme les 4 directions d\'une boussole...',
      demoType: 'movements'
    },
    { 
      question: 'Les lignes horizontales vont...', 
      correctAnswer: 'de gauche à droite',
      choices: ['de haut en bas', 'de gauche à droite', 'en diagonal'],
      hint: 'Comme une ligne droite couchée...',
      demoType: 'horizontal'
    },
    { 
      question: 'Les lignes verticales vont...', 
      correctAnswer: 'de haut en bas',
      choices: ['de gauche à droite', 'de haut en bas', 'en rond'],
      hint: 'Comme une ligne droite debout...',
      demoType: 'vertical'
    },
    { 
      question: 'Où les lignes se croisent, on appelle ça...', 
      correctAnswer: 'un nœud',
      choices: ['un nœud', 'un trou', 'une case'],
      hint: 'Comme un nœud dans une corde...',
      demoType: 'nodes'
    },
    { 
      question: 'Pour me repérer, j\'utilise...', 
      correctAnswer: 'les lignes et les colonnes',
      choices: ['seulement les couleurs', 'les lignes et les colonnes', 'seulement les nombres'],
      hint: 'Comme une adresse avec rue et numéro...',
      demoType: 'coordinates'
    },
    { 
      question: 'Un quadrillage ressemble à...', 
      correctAnswer: 'un damier',
      choices: ['un cercle', 'un damier', 'un triangle'],
      hint: 'Comme l\'échiquier du jeu de dames...',
      demoType: 'checkerboard'
    },
    { 
      question: 'Dans un quadrillage, toutes les cases sont...', 
      correctAnswer: 'de la même taille',
      choices: ['différentes', 'de la même taille', 'rondes'],
      hint: 'Pour que ce soit bien régulier...',
      demoType: 'regular-grid'
    },
    { 
      question: 'Le quadrillage m\'aide à...', 
      correctAnswer: 'me repérer et dessiner droit',
      choices: ['colorier seulement', 'me repérer et dessiner droit', 'compter seulement'],
      hint: 'C\'est très utile pour s\'organiser...',
      demoType: 'grid-utility'
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
    setAnimatingNavigation(false);
    setNavigatorPosition({row: 2, col: 2});
    setTargetPosition({row: 0, col: 0});
    setCurrentPath([]);
    setHighlightedCell(null);
    
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
        audio: "Bonjour petit explorateur ! Aujourd'hui, nous allons découvrir les quadrillages. C'est comme une carte magique pour se repérer !"
      },
      {
        action: () => {
          setHighlightedElement('grid-explanation');
          setCurrentExample(0);
        },
        audio: "Voici les secrets du quadrillage : les lignes, les cases, les coordonnées et les déplacements !"
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('grid');
          setAnimatingNavigation(true);
        },
        audio: "Un quadrillage, c'est des lignes horizontales et verticales qui se croisent, comme un filet ou une grille !"
      },
      {
        action: () => {
          setShowingProcess('navigation');
          setHighlightedCell({row: 1, col: 1});
        },
        audio: "Les lignes horizontales vont de gauche à droite, les verticales vont de haut en bas. Regarde bien !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('positioning');
          setHighlightedCell({row: 2, col: 2});
        },
        audio: "Les espaces entre les lignes forment des cases. Et là où les lignes se croisent, ce sont les nœuds !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setNavigatorPosition({row: 1, col: 1});
          setTargetPosition({row: 3, col: 3});
        },
        audio: "Chaque case a une adresse, comme ta maison ! On peut dire : ligne 2, colonne B par exemple."
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('navigation');
          // Animer un déplacement
          const path = [{row: 1, col: 1}, {row: 1, col: 2}, {row: 2, col: 2}, {row: 3, col: 2}, {row: 3, col: 3}];
          setCurrentPath(path);
          let pathIndex = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current || pathIndex >= path.length) {
              clearInterval(interval);
              return;
            }
            setNavigatorPosition(path[pathIndex]);
            pathIndex++;
          }, 800);
        },
        audio: "Et on peut se déplacer sur le quadrillage ! Haut, bas, gauche, droite, comme un petit robot explorateur !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
          setCurrentPath([]);
        },
        audio: "Fantastique ! Le quadrillage, c'est un super outil pour se repérer, dessiner droit et s'organiser !"
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
      await playAudio("Maintenant, teste ta maîtrise du quadrillage avec les exercices !");
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
        playAudio("Félicitations ! Tu es maintenant un expert du quadrillage !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien le quadrillage !");
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
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
              📊 Se repérer sur quadrillage
            </h1>
            <p className="text-lg text-gray-600">
              Découvre la magie des grilles pour te repérer comme un explorateur !
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
                  ? 'bg-indigo-500 text-white shadow-md' 
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
                  ? 'bg-indigo-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'introduction' ? 'ring-4 ring-indigo-400 bg-indigo-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Qu'est-ce qu'un quadrillage ?
              </h2>
              
              <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-indigo-800 font-semibold mb-6">
                  Un quadrillage, c'est comme une carte magique faite de lignes qui se croisent !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-indigo-600 mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${gridConcepts[currentExample].name} ${gridConcepts[currentExample].emoji}` 
                        : 'Les secrets du quadrillage 🗺️'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des concepts */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'grid-explanation' ? 'ring-2 ring-indigo-400' : ''
                  }`}>
                    {gridConcepts.map((concept, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingNavigation
                            ? 'ring-4 ring-indigo-400 bg-indigo-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{concept.emoji}</div>
                        <h4 className="font-bold text-indigo-700 mb-1 text-sm sm:text-base">{concept.name}</h4>
                        <p className="text-xs sm:text-sm text-indigo-600">{concept.story.substring(0, 50)}...</p>
                        
                        {/* Zone d'animation pour chaque concept */}
                        {currentExample === index && animatingNavigation && (
                          <div className="mt-4">
                            {/* Mini quadrillage de démonstration */}
                            <div className="bg-white rounded-lg p-3 border-2 border-indigo-200">
                              <div className="grid grid-cols-4 gap-1" style={{gridTemplateRows: 'repeat(4, 1fr)'}}>
                                {Array.from({length: 16}).map((_, cellIndex) => {
                                  const row = Math.floor(cellIndex / 4);
                                  const col = cellIndex % 4;
                                  const isHighlighted = highlightedCell && highlightedCell.row === row && highlightedCell.col === col;
                                  const isOnPath = currentPath.some(p => p.row === row && p.col === col);
                                  const isNavigator = navigatorPosition.row === row && navigatorPosition.col === col;
                                  
                                  return (
                                    <div 
                                      key={cellIndex}
                                      className={`w-6 h-6 border border-gray-300 transition-all duration-500 ${
                                        isNavigator ? 'bg-red-400 animate-pulse' :
                                        isOnPath ? 'bg-yellow-200' :
                                        isHighlighted ? 'bg-indigo-200 animate-pulse' :
                                        'bg-white'
                                      }`}
                                    >
                                      {isNavigator && <span className="text-xs">🤖</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Étape en cours */}
                            {showingProcess && (
                              <div className="bg-indigo-100 rounded-lg p-2 mt-2">
                                <p className="text-xs font-bold text-indigo-800">
                                  {showingProcess === 'grid' && '📊 Je vois la grille'}
                                  {showingProcess === 'navigation' && '🧭 Je me déplace'}
                                  {showingProcess === 'positioning' && '📍 Je me repère'}
                                  {showingProcess === 'result' && '✅ J\'ai compris'}
                                </p>
                              </div>
                            )}
                            
                            {/* Exemples */}
                            <div className="bg-blue-50 rounded-lg p-2 mt-2">
                              <h5 className="font-bold text-blue-800 mb-1 text-xs">Exemples :</h5>
                              <div className="flex flex-wrap gap-1">
                                {concept.examples.slice(0, 3).map((example, exIndex) => (
                                  <span
                                    key={exIndex}
                                    className="bg-white px-1 py-0.5 rounded text-xs text-blue-700"
                                  >
                                    {example}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Récapitulatif */}
                  <div className={`mt-6 p-4 rounded-xl transition-all duration-500 ${
                    highlightedElement === 'summary' ? 'bg-green-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-indigo-800">
                      🗺️ <strong>Maintenant tu peux :</strong> Te repérer partout avec un quadrillage !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-indigo-800 mb-4 text-center">
                🎁 Conseils pour maîtriser le quadrillage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-indigo-700 mb-2">Observe les lignes</h4>
                  <p className="text-indigo-600">Horizontales et verticales qui se croisent</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📍</div>
                  <h4 className="font-bold text-indigo-700 mb-2">Utilise les coordonnées</h4>
                  <p className="text-indigo-600">Ligne et colonne pour te repérer</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🧭</div>
                  <h4 className="font-bold text-indigo-700 mb-2">Déplace-toi en croix</h4>
                  <p className="text-indigo-600">Haut, bas, gauche, droite seulement</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-indigo-700 mb-2">Entraîne-toi</h4>
                  <p className="text-indigo-600">Plus tu pratiques, mieux tu te repères !</p>
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
                      className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
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
                    {exercises[currentExercise].demoType === 'basic-grid' && '📊'}
                    {exercises[currentExercise].demoType === 'cells' && '⬜'}
                    {exercises[currentExercise].demoType === 'movements' && '🧭'}
                    {exercises[currentExercise].demoType === 'horizontal' && '↔️'}
                    {exercises[currentExercise].demoType === 'vertical' && '↕️'}
                    {exercises[currentExercise].demoType === 'nodes' && '⭕'}
                    {exercises[currentExercise].demoType === 'coordinates' && '📍'}
                    {exercises[currentExercise].demoType === 'checkerboard' && '🏁'}
                    {exercises[currentExercise].demoType === 'regular-grid' && '📐'}
                    {exercises[currentExercise].demoType === 'grid-utility' && '🛠️'}
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
                    className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
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