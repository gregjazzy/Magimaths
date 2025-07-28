'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

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
      visual: '🟨'
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
      visual: '🟨'
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

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
              🔺 Les formes géométriques
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les 4 formes de base : cercle, carré, rectangle et triangle !
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
                  ? 'bg-purple-500 text-white shadow-md' 
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
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            <div className="text-center mb-6">
              <button
                onClick={startLesson}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'introduction' ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Qu'est-ce qu'une forme géométrique ?
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-purple-800 font-semibold mb-6">
                  Les formes géométriques sont partout ! Apprends à les reconnaître comme un détective des formes !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${geometricShapes[currentExample].name} ${geometricShapes[currentExample].emoji}` 
                        : 'Les 4 formes magiques 🎨'
                      }
                    </div>
                </div>
                
                  {/* Démonstrations des formes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {geometricShapes.map((shape, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingShape
                            ? 'ring-4 ring-purple-400 bg-purple-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-4xl mb-2">{shape.emoji}</div>
                        <h4 className="font-bold text-purple-700 mb-1 text-sm sm:text-base">{shape.name}</h4>
                        <p className="text-xs sm:text-sm text-purple-600">{shape.characteristics[0]}</p>
                        
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
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
                🎁 Conseils pour reconnaître les formes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-purple-700 mb-2">Observe les côtés</h4>
                  <p className="text-purple-600">Compte les côtés : 0, 3, 4 ou plus ?</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📐</div>
                  <h4 className="font-bold text-purple-700 mb-2">Regarde les coins</h4>
                  <p className="text-purple-600">Droits, pointus ou pas de coins ?</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📏</div>
                  <h4 className="font-bold text-purple-700 mb-2">Compare les longueurs</h4>
                  <p className="text-purple-600">Tous pareils ou différents ?</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🔍</div>
                  <h4 className="font-bold text-purple-700 mb-2">Cherche autour de toi</h4>
                  <p className="text-purple-600">Les formes sont partout !</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white rounded-xl p-8 shadow-lg">
            {!showCompletionModal ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-purple-800">
                    🔍 Exercice {currentExercise + 1}/{exercises.length}
                  </h3>
                  <div className="text-purple-600">
                    Score: {score}/{exercises.length}
                  </div>
              </div>
              
                <div className="mb-6">
                  <div className="bg-purple-50 rounded-xl p-6 mb-4">
                    <h4 className="text-lg font-semibold text-purple-800 mb-4">
                      {exercises[currentExercise].question}
                    </h4>
                    
                    {/* Visualisation de l'exercice */}
                    {exercises[currentExercise].visual && (
                      <div className="text-6xl text-center mb-4">
                        {exercises[currentExercise].visual}
                      </div>
                    )}
                    
                    {/* Indice */}
                    {exercises[currentExercise].hint && (
                      <div className="bg-yellow-100 rounded-lg p-3 mt-4">
                        <p className="text-sm text-yellow-800">
                          💡 <strong>Indice :</strong> {exercises[currentExercise].hint}
                        </p>
                      </div>
                    )}
              </div>
              
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {exercises[currentExercise].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(choice)}
                        className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                          userAnswer === choice
                            ? 'border-purple-400 bg-purple-100 text-purple-800'
                            : 'border-gray-200 bg-white hover:border-purple-300 text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
            </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!userAnswer}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                  >
                    Valider
                  </button>
              </div>

              {isCorrect !== null && (
                  <div className={`mt-4 p-4 rounded-xl text-center ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {isCorrect ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Formidable ! Tu reconnais parfaitement les formes !
                    </div>
                  ) : (
                      <div className="flex items-center justify-center">
                        <XCircle className="w-6 h-6 mr-2" />
                        La bonne réponse était : {exercises[currentExercise].correctAnswer}
                      </div>
                    )}
                    </div>
                  )}
              </>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '🎉' : '💪'}
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-4">
                  {finalScore >= 80 ? 'Expert des formes !' : finalScore >= 60 ? 'Bravo détective !' : 'Continue à explorer !'}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Tu as obtenu {score}/{exercises.length} bonnes réponses
                  <br />
                  Score : {finalScore}%
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetExercises}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <RotateCcw className="inline w-5 h-5 mr-2" />
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