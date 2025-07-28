'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function ReperageEspaceCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'positioning' | 'moving' | 'result' | null>(null);
  const [animatingObject, setAnimatingObject] = useState(false);
  const [objectPosition, setObjectPosition] = useState<{x: number, y: number}>({x: 50, y: 50});
  const [currentDirection, setCurrentDirection] = useState<string | null>(null);
  const [movingStep, setMovingStep] = useState<number>(0);
  
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

  // Concepts spatiaux à apprendre
  const spatialConcepts = [
    {
      concept: 'dessus',
      description: 'Au-dessus, plus haut',
      emoji: '☁️',
      referenceEmoji: '🏠',
      story: 'Le nuage est dessus la maison',
      positions: [
        { object: { x: 50, y: 20 }, reference: { x: 50, y: 60 } }
      ]
    },
    {
      concept: 'dessous',
      description: 'En-dessous, plus bas',
      emoji: '🌿',
      referenceEmoji: '🌳',
      story: 'L\'herbe est dessous l\'arbre',
      positions: [
        { object: { x: 50, y: 80 }, reference: { x: 50, y: 40 } }
      ]
    },
    {
      concept: 'devant',
      description: 'En face, à l\'avant',
      emoji: '🚗',
      referenceEmoji: '🏠',
      story: 'La voiture est devant la maison',
      positions: [
        { object: { x: 30, y: 50 }, reference: { x: 70, y: 50 } }
      ]
    },
    {
      concept: 'derrière',
      description: 'À l\'arrière, caché derrière',
      emoji: '🐱',
      referenceEmoji: '🌳',
      story: 'Le chat est derrière l\'arbre',
      positions: [
        { object: { x: 70, y: 50 }, reference: { x: 30, y: 50 } }
      ]
    },
    {
      concept: 'à côté',
      description: 'Sur le côté, près de',
      emoji: '🐕',
      referenceEmoji: '🏠',
      story: 'Le chien est à côté de la maison',
      positions: [
        { object: { x: 30, y: 50 }, reference: { x: 70, y: 50 } },
        { object: { x: 70, y: 50 }, reference: { x: 30, y: 50 } }
      ]
    },
    {
      concept: 'entre',
      description: 'Au milieu de deux objets',
      emoji: '🌸',
      referenceEmoji: '🌳',
      secondReferenceEmoji: '🏠',
      story: 'La fleur est entre l\'arbre et la maison',
      positions: [
        { object: { x: 50, y: 50 }, reference: { x: 20, y: 50 }, secondReference: { x: 80, y: 50 } }
      ]
    }
  ];

  // Exercices sur le repérage spatial
  const exercises = [
    { 
      question: 'Où est le soleil par rapport à la maison ?', 
      correctAnswer: 'dessus',
      choices: ['dessus', 'dessous', 'à côté'],
      visual: { sun: { x: 50, y: 10 }, house: { x: 50, y: 70 } }
    },
    { 
      question: 'Où se trouve la voiture ?', 
      correctAnswer: 'devant',
      choices: ['devant', 'derrière', 'dessus'],
      visual: { car: { x: 30, y: 50 }, house: { x: 70, y: 50 } }
    },
    { 
      question: 'Le chat se cache... l\'arbre', 
      correctAnswer: 'derrière',
      choices: ['devant', 'derrière', 'dessus'],
      visual: { cat: { x: 75, y: 50 }, tree: { x: 25, y: 50 } }
    },
    { 
      question: 'L\'oiseau vole... l\'arbre', 
      correctAnswer: 'dessus',
      choices: ['dessus', 'dessous', 'derrière'],
      visual: { bird: { x: 50, y: 20 }, tree: { x: 50, y: 60 } }
    },
    { 
      question: 'Où est le chien par rapport à la maison ?', 
      correctAnswer: 'à côté',
      choices: ['dessus', 'à côté', 'entre'],
      visual: { dog: { x: 20, y: 50 }, house: { x: 60, y: 50 } }
    },
    { 
      question: 'La fleur est... l\'arbre et la maison', 
      correctAnswer: 'entre',
      choices: ['entre', 'devant', 'derrière'],
      visual: { flower: { x: 50, y: 50 }, tree: { x: 20, y: 50 }, house: { x: 80, y: 50 } }
    },
    { 
      question: 'Les racines sont... l\'arbre', 
      correctAnswer: 'dessous',
      choices: ['dessus', 'dessous', 'devant'],
      visual: { roots: { x: 50, y: 80 }, tree: { x: 50, y: 40 } }
    },
    { 
      question: 'Pour aller de la maison à l\'école, je passe... le pont', 
      correctAnswer: 'dessus',
      choices: ['dessus', 'dessous', 'derrière'],
      visual: { person: { x: 50, y: 30 }, bridge: { x: 50, y: 50 } }
    },
    { 
      question: 'Le poisson nage... le pont', 
      correctAnswer: 'dessous',
      choices: ['dessus', 'dessous', 'à côté'],
      visual: { fish: { x: 50, y: 70 }, bridge: { x: 50, y: 40 } }
    },
    { 
      question: 'Quand je regarde vers l\'école, l\'arbre est... de moi', 
      correctAnswer: 'devant',
      choices: ['devant', 'derrière', 'dessus'],
      visual: { person: { x: 20, y: 50 }, tree: { x: 50, y: 50 }, school: { x: 80, y: 50 } }
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
    setAnimatingStep(null);
    setShowingProcess(null);
    setAnimatingObject(false);
    setCurrentDirection(null);
    setMovingStep(0);
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

  // Animation d'un concept spatial
  const animateConcept = async (concept: typeof spatialConcepts[0]) => {
    if (stopSignalRef.current) return;
    
    setAnimatingObject(true);
    setShowingProcess('positioning');
    setCurrentExample(spatialConcepts.indexOf(concept));
    setCurrentDirection(concept.concept);
    
    await playAudio(`Apprenons le mot "${concept.concept}". ${concept.description}.`);
    
    if (stopSignalRef.current) return;
    
    await playAudio(concept.story);
    
    if (stopSignalRef.current) return;
    
    // Animation des positions
    for (let posIndex = 0; posIndex < concept.positions.length; posIndex++) {
      if (stopSignalRef.current) return;
      
      const position = concept.positions[posIndex];
      setMovingStep(posIndex + 1);
      
      // Animation fluide de déplacement
      const startPos = { x: 50, y: 50 };
      const endPos = position.object;
      const steps = 20;
      
      for (let step = 0; step <= steps; step++) {
        if (stopSignalRef.current) return;
        
        const progress = step / steps;
        const currentPos = {
          x: startPos.x + (endPos.x - startPos.x) * progress,
          y: startPos.y + (endPos.y - startPos.y) * progress
        };
        
        setObjectPosition(currentPos);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (stopSignalRef.current) return;
    
    setShowingProcess('result');
    setHighlightedElement('result');
    
    await playAudio(`Parfait ! Tu as vu que ${concept.emoji} est ${concept.concept} ${concept.referenceEmoji} !`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAnimatingObject(false);
    setShowingProcess(null);
    setHighlightedElement(null);
    setCurrentDirection(null);
    setMovingStep(0);
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
      await playAudio('Bonjour petit explorateur ! Aujourd\'hui, nous allons apprendre à nous repérer dans l\'espace. C\'est très important pour se déplacer et décrire où sont les objets !');
      
      if (stopSignalRef.current) return;
      
      setHighlightedElement('vocabulary-explanation');
      await playAudio('Nous allons apprendre des mots magiques : dessus, dessous, devant, derrière, à côté, et entre. Ces mots nous aident à dire où sont les choses !');
      
      if (stopSignalRef.current) return;
      
      // Démonstration de chaque concept
      for (const concept of spatialConcepts) {
        if (stopSignalRef.current) return;
        await animateConcept(concept);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (stopSignalRef.current) return;
      
      // Récapitulatif
      setHighlightedElement('summary');
      await playAudio('Bravo ! Tu connais maintenant tous les mots pour te repérer dans l\'espace. Tu peux dire où sont les objets comme un vrai explorateur !');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Exercices
      setHighlightedElement('exercises');
      await playAudio('Maintenant, testons tes nouvelles compétences d\'explorateur avec des exercices amusants !');
      
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
      await playAudio('Excellent ! Tu es un vrai explorateur de l\'espace !');
        } else {
      await playAudio(`Pas tout à fait ! La bonne réponse était "${currentEx.correctAnswer}". Regarde bien la position des objets !`);
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
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
              🧭 Se repérer dans l'espace
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les mots magiques pour dire où sont les objets !
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
                  ? 'bg-blue-500 text-white shadow-md' 
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
                  ? 'bg-blue-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'introduction' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🌍 Qu'est-ce que se repérer dans l'espace ?
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-blue-800 font-semibold mb-6">
                  Se repérer dans l'espace, c'est savoir dire où sont les objets les uns par rapport aux autres !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      Les mots magiques de l'espace 🗣️
                    </div>
                  </div>

                  {/* Démonstrations des concepts spatiaux */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {spatialConcepts.map((concept, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingObject
                            ? 'ring-4 ring-blue-400 bg-blue-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{concept.emoji}</div>
                        <h4 className="font-bold text-blue-700 mb-1 text-sm sm:text-base">{concept.concept}</h4>
                        <p className="text-xs sm:text-sm text-blue-600">{concept.description}</p>
                        
                        {/* Zone d'animation spatiale pour chaque concept */}
                        {currentExample === index && animatingObject && (
                          <div className="mt-4 relative bg-gradient-to-b from-sky-100 to-green-100 rounded-xl h-32 overflow-hidden">
                            {/* Objet de référence fixe */}
                            <div 
                              className="absolute transition-all duration-500 text-2xl"
                              style={{
                                left: `${concept.positions[0].reference.x}%`,
                                top: `${concept.positions[0].reference.y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              {concept.referenceEmoji}
                            </div>

                            {/* Deuxième objet de référence si nécessaire (pour "entre") */}
                            {concept.secondReferenceEmoji && concept.positions[0].secondReference && (
                              <div 
                                className="absolute transition-all duration-500 text-2xl"
                                style={{
                                  left: `${concept.positions[0].secondReference.x}%`,
                                  top: `${concept.positions[0].secondReference.y}%`,
                                  transform: 'translate(-50%, -50%)'
                                }}
                              >
                                {concept.secondReferenceEmoji}
                              </div>
                            )}

                            {/* Objet mobile */}
                            <div 
                              className="absolute transition-all duration-500 text-2xl animate-pulse scale-125"
                              style={{
                                left: `${objectPosition.x}%`,
                                top: `${objectPosition.y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              {concept.emoji}
                            </div>

                            {/* Flèche directionnelle */}
                            <div className="absolute top-1 left-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                              {concept.concept}
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
                    <p className="text-center font-medium text-blue-800">
                      🎯 <strong>Maintenant tu peux :</strong> Dire où sont tous les objets autour de toi !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">
                🎁 Conseils pour bien se repérer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-blue-700 mb-2">Observe bien</h4>
                  <p className="text-blue-600">Regarde autour de toi et utilise les mots magiques</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-blue-700 mb-2">Choisis un point de référence</h4>
                  <p className="text-blue-600">Par rapport à quoi tu décris la position ?</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🗣️</div>
                  <h4 className="font-bold text-blue-700 mb-2">Parle à voix haute</h4>
                  <p className="text-blue-600">Décris ce que tu vois avec les mots appris</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎮</div>
                  <h4 className="font-bold text-blue-700 mb-2">Joue au guide</h4>
                  <p className="text-blue-600">Guide quelqu'un avec tes nouveaux mots</p>
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
                  <h3 className="text-xl font-bold text-blue-800">
                    🧭 Exercice {currentExercise + 1}/{exercises.length}
                  </h3>
                  <div className="text-blue-600">
                    Score: {score}/{exercises.length}
                  </div>
              </div>
              
                <div className="mb-6">
                  <div className="bg-blue-50 rounded-xl p-6 mb-4">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">
                      {exercises[currentExercise].question}
                    </h4>
                    
                    {/* Visualisation de l'exercice */}
                    {exercises[currentExercise].visual && (
                      <div className="relative bg-gradient-to-b from-sky-100 to-green-100 rounded-xl h-32 mb-4">
                        {Object.entries(exercises[currentExercise].visual).map(([key, position]) => {
                          const emojis: {[key: string]: string} = {
                            sun: '☀️', house: '🏠', car: '🚗', cat: '🐱', tree: '🌳',
                            bird: '🐦', dog: '🐕', flower: '🌸', roots: '🌿',
                            person: '🚶‍♂️', bridge: '🌉', fish: '🐟', school: '🏫'
                          };
                          return (
                            <div
                              key={key}
                              className="absolute text-2xl transition-all duration-500"
                              style={{
                                left: `${(position as any).x}%`,
                                top: `${(position as any).y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              {emojis[key] || '❓'}
                            </div>
                          );
                        })}
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
                            ? 'border-blue-400 bg-blue-100 text-blue-800'
                            : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700 hover:bg-blue-50'
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
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:cursor-not-allowed"
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
                        Excellent ! Tu es un vrai explorateur de l'espace !
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
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  {finalScore >= 80 ? 'Champion explorateur !' : finalScore >= 60 ? 'Bravo explorateur !' : 'Continue à explorer !'}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Tu as obtenu {score}/{exercises.length} bonnes réponses
                  <br />
                  Score : {finalScore}%
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetExercises}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
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