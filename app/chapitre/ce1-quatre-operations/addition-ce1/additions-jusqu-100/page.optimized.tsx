'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye, Play } from 'lucide-react';

// Import du gestionnaire audio
import { playAudio, stopAllAudio, markUserInteraction } from '@/lib/audioManager';

export default function AdditionsJusqua100CE1Optimized() {
  // États principaux consolidés
  const [gameState, setGameState] = useState({
    hasStarted: false,
    isClient: false,
    isMobile: false,
    showExercises: false,
    currentExercise: 0,
    score: 0,
    finalScore: 0,
    showCompletionModal: false
  });

  // États pour les techniques d'addition
  const [techniqueState, setTechniqueState] = useState({
    selectedTechnique: null as string | null,
    selectedExampleIndex: 0,
    currentTechnique: null as string | null,
    currentExample: null as number | null,
    calculationStep: null as string | null,
    animatingStep: null as string | null,
    highlightedDigits: [] as string[]
  });

  // États pour les exercices
  const [exerciseState, setExerciseState] = useState({
    userAnswer: '',
    isCorrect: null as boolean | null,
    answeredCorrectly: new Set<number>(),
    highlightNextButton: false
  });

  // États pour Sam le Pirate
  const [pirateState, setPirateState] = useState({
    pirateIntroStarted: false,
    samSizeExpanded: false,
    imageError: false,
    isPlayingEnonce: false
  });

  // États pour l'audio et animations
  const [audioState, setAudioState] = useState({
    isPlayingVocal: false,
    isAnimationRunning: false,
    highlightedElement: null as string | null,
    showingCarry: false,
    countingIndex: -1,
    animatedObjects: [] as string[]
  });

  // Refs pour l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Gestionnaire audio simplifié
  const speakText = async (text: string) => {
    setAudioState(prev => ({ ...prev, isPlayingVocal: true }));
    try {
      await playAudio('ce1-quatre-operations', 'addition-ce1', 'intro', text);
    } finally {
      setAudioState(prev => ({ ...prev, isPlayingVocal: false }));
    }
  };

  const stopAudio = () => {
    stopAllAudio();
    setAudioState(prev => ({ ...prev, isPlayingVocal: false }));
  };

  // Données des techniques d'addition - Version condensée pour l'exemple
  const additionTechniques = [
    {
      id: 'decomposition',
      title: 'Décomposition en dizaines et unités',
      icon: '🧮',
      description: 'Séparer les dizaines et les unités pour calculer plus facilement',
      examples: [
        { 
          calculation: '35 + 24', 
          num1: 35, 
          num2: 24, 
          result: 59,
          steps: [
            'Je décompose les nombres : 35 = 30 + 5 et 24 = 20 + 4',
            'J\'additionne les dizaines : 30 + 20 = 50',
            'J\'additionne les unités : 5 + 4 = 9',
            'Je regroupe : 50 + 9 = 59 !'
          ]
        },
        { 
          calculation: '42 + 36', 
          num1: 42, 
          num2: 36, 
          result: 78,
          steps: [
            'Je sépare : 42 = 40 + 2 et 36 = 30 + 6',
            'Dizaines d\'abord : 40 + 30 = 70',
            'Puis les unités : 2 + 6 = 8',
            'Total : 70 + 8 = 78 !'
          ]
        }
      ]
    },
    {
      id: 'complement',
      title: 'Complément à la dizaine',
      icon: '🎯',
      description: 'Utiliser les compléments pour arriver à une dizaine ronde',
      examples: [
        { 
          calculation: '27 + 15', 
          num1: 27, 
          num2: 15, 
          result: 42,
          steps: [
            'Je vois que 27 + 3 = 30 (dizaine ronde)',
            'Je décompose 15 : 15 = 3 + 12',
            'Je calcule : 27 + 3 = 30',
            'Puis : 30 + 12 = 42 !'
          ]
        }
      ]
    },
    {
      id: 'addition-posee',
      title: 'Addition posée',
      icon: '📝',
      description: 'Poser l\'addition en colonnes avec retenues',
      examples: [
        { 
          calculation: '47 + 28', 
          num1: 47, 
          num2: 28, 
          result: 75,
          steps: [
            'Je pose l\'addition en colonnes',
            'Unités : 7 + 8 = 15, j\'écris 5 et je retiens 1',
            'Dizaines : 4 + 2 + 1 (retenue) = 7',
            'Résultat : 75 !'
          ]
        }
      ]
    }
  ];

  // Exercices d'entraînement - Version condensée
  const exercises = [
    { question: '23 + 15 = ?', answer: 38, hint: 'Décompose en dizaines et unités' },
    { question: '34 + 29 = ?', answer: 63, hint: 'Tu peux utiliser le complément à 30' },
    { question: '45 + 37 = ?', answer: 82, hint: 'Pose l\'addition si nécessaire' },
    { question: '28 + 26 = ?', answer: 54, hint: 'Attention aux retenues !' },
    { question: '39 + 33 = ?', answer: 72, hint: 'Décompose pour simplifier' }
  ];

  // Expressions et compliments
  const minecraftExpressions = [
    "Par les creepers", "Sacrés diamants", "Mille blocs", "Par l'Ender Dragon", "Redstone power"
  ];

  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", "Super", "Génial"
  ];

  // Effets de montage
  useEffect(() => {
    setGameState(prev => ({ ...prev, isClient: true }));
    
    const checkMobile = () => {
      setGameState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestionnaires d'événements
  const handleStartIntro = () => {
    setPirateState(prev => ({ 
      ...prev, 
      pirateIntroStarted: true, 
      samSizeExpanded: true 
    }));
    setGameState(prev => ({ ...prev, hasStarted: true }));
  };

  const handlePlayEnonce = async () => {
    setPirateState(prev => ({ ...prev, isPlayingEnonce: true }));
    try {
      await speakText(
        "Ahoy matelot ! Nous allons explorer 6 techniques magiques pour additionner jusqu'à 100. Choisis une technique pour commencer l'aventure !"
      );
    } finally {
      setPirateState(prev => ({ ...prev, isPlayingEnonce: false }));
    }
  };

  const handleStopAudio = () => {
    stopAudio();
    setPirateState(prev => ({ ...prev, isPlayingEnonce: false }));
  };

  const handleTechniqueSelect = (techniqueId: string) => {
    setTechniqueState(prev => ({
      ...prev,
      selectedTechnique: techniqueId,
      selectedExampleIndex: 0,
      currentTechnique: techniqueId
    }));
  };

  const handleExampleSelect = (index: number) => {
    setTechniqueState(prev => ({
      ...prev,
      selectedExampleIndex: index
    }));
  };

  const handleAnswerChange = (answer: string) => {
    setExerciseState(prev => ({ ...prev, userAnswer: answer }));
  };

  const handleAnswerSubmit = () => {
    const currentExerciseData = exercises[gameState.currentExercise];
    const isCorrect = parseInt(exerciseState.userAnswer) === currentExerciseData.answer;
    
    setExerciseState(prev => ({
      ...prev,
      isCorrect,
      answeredCorrectly: isCorrect 
        ? new Set(Array.from(prev.answeredCorrectly).concat([gameState.currentExercise]))
        : prev.answeredCorrectly
    }));

    if (isCorrect) {
      setGameState(prev => ({ ...prev, score: prev.score + 10 }));
    }
  };

  const handleNextExercise = () => {
    if (gameState.currentExercise < exercises.length - 1) {
      setGameState(prev => ({ ...prev, currentExercise: prev.currentExercise + 1 }));
      setExerciseState(prev => ({ ...prev, userAnswer: '', isCorrect: null }));
    }
  };

  const handleRestartExercises = () => {
    setGameState(prev => ({
      ...prev,
      currentExercise: 0,
      score: 0,
      showCompletionModal: false
    }));
    setExerciseState(prev => ({
      ...prev,
      userAnswer: '',
      isCorrect: null,
      answeredCorrectly: new Set()
    }));
  };

  const handleImageError = () => {
    setPirateState(prev => ({ ...prev, imageError: true }));
  };

  if (!gameState.isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/ce1-quatre-operations" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour aux quatre opérations</span>
              <span className="sm:hidden">Retour</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Additions jusqu'à 100
              </h1>
              <p className="text-sm text-gray-600">CE1 - Techniques d'addition</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-900">{gameState.score} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Introduction avec Sam le Pirate */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Image de Sam le Pirate */}
            <div className={`flex-shrink-0 transition-all duration-500 ${pirateState.samSizeExpanded ? 'scale-110' : 'scale-100'}`}>
              {!pirateState.imageError ? (
                <img 
                  src="/images/pirate-small.png" 
                  alt="Sam le Pirate" 
                  className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-blue-100 rounded-full flex items-center justify-center text-4xl">
                  🏴‍☠️
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ahoy matelot ! 🏴‍☠️
              </h2>
              <p className="text-gray-600 mb-4">
                Je suis Sam le Pirate et je vais t'apprendre les techniques d'addition jusqu'à 100 !
                Prêt pour l'aventure ?
              </p>
              
              {!pirateState.pirateIntroStarted ? (
                <button
                  onClick={handleStartIntro}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🚀 Commencer l'aventure !
                </button>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button
                    onClick={handlePlayEnonce}
                    disabled={pirateState.isPlayingEnonce}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{pirateState.isPlayingEnonce ? 'En cours...' : 'Écouter'}</span>
                  </button>
                  
                  {pirateState.isPlayingEnonce && (
                    <button
                      onClick={handleStopAudio}
                      className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-red-600 transition-colors flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Arrêter</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Techniques d'addition */}
        {gameState.hasStarted && (
          <div className="space-y-8">
            {/* Techniques d'addition inline */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🧮 Techniques d'addition
              </h3>
              
              {/* Sélection des techniques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {additionTechniques.map((technique) => (
                  <button
                    key={technique.id}
                    onClick={() => handleTechniqueSelect(technique.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      techniqueState.selectedTechnique === technique.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-3xl mb-2">{technique.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{technique.title}</h4>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                  </button>
                ))}
              </div>

              {/* Exemples de la technique sélectionnée */}
              {techniqueState.selectedTechnique && (
                <div className="border-t pt-6">
                  {(() => {
                    const selectedTechnique = additionTechniques.find(t => t.id === techniqueState.selectedTechnique);
                    if (!selectedTechnique) return null;

                    const currentExample = selectedTechnique.examples[techniqueState.selectedExampleIndex];
                    
                    return (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">
                          Exemple : {currentExample.calculation}
                        </h4>
                        
                        {/* Sélection d'exemples */}
                        <div className="flex gap-2 mb-4">
                          {selectedTechnique.examples.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handleExampleSelect(index)}
                              className={`px-3 py-1 rounded ${
                                techniqueState.selectedExampleIndex === index
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Ex. {index + 1}
                            </button>
                          ))}
                        </div>

                        {/* Étapes de calcul */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-blue-600">
                              {currentExample.num1} + {currentExample.num2} = {currentExample.result}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {currentExample.steps.map((step, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <p className="text-gray-700">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Bouton pour passer aux exercices */}
            {techniqueState.selectedTechnique && !gameState.showExercises && (
              <div className="text-center">
                <button
                  onClick={() => setGameState(prev => ({ ...prev, showExercises: true }))}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 mx-auto"
                >
                  <Target className="w-6 h-6" />
                  <span>Passer aux exercices d'entraînement</span>
                </button>
              </div>
            )}

            {/* Section des exercices */}
            {gameState.showExercises && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    🎯 Exercices d'entraînement
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Exercice {gameState.currentExercise + 1} / {exercises.length}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-gray-900">{gameState.score} pts</span>
                    </div>
                  </div>
                </div>

                {/* Exercice actuel */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="text-center mb-4">
                    <h4 className="text-3xl font-bold text-blue-600 mb-2">
                      {exercises[gameState.currentExercise].question}
                    </h4>
                    <p className="text-gray-600">
                      💡 {exercises[gameState.currentExercise].hint}
                    </p>
                  </div>

                  {/* Zone de réponse */}
                  <div className="flex flex-col items-center space-y-4">
                    <input
                      type="number"
                      value={exerciseState.userAnswer}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Ta réponse..."
                      className="w-32 text-center text-2xl font-bold py-3 px-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      disabled={exerciseState.isCorrect !== null}
                    />

                    {exerciseState.isCorrect === null ? (
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={!exerciseState.userAnswer}
                        className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Vérifier
                      </button>
                    ) : (
                      <div className="text-center">
                        {exerciseState.isCorrect ? (
                          <div className="flex items-center space-x-2 text-green-600 mb-4">
                            <CheckCircle className="w-8 h-8" />
                            <span className="text-xl font-bold">
                              {correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)]} !
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600 mb-4">
                            <XCircle className="w-8 h-8" />
                            <span className="text-xl font-bold">
                              {minecraftExpressions[Math.floor(Math.random() * minecraftExpressions.length)]} !
                            </span>
                          </div>
                        )}

                        {gameState.currentExercise < exercises.length - 1 ? (
                          <button
                            onClick={handleNextExercise}
                            className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-green-600 transition-colors"
                          >
                            Exercice suivant →
                          </button>
                        ) : (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-4">
                              🎉 Tous les exercices terminés !
                            </div>
                            <div className="text-xl text-gray-700 mb-4">
                              Score final : {gameState.score} / {exercises.length * 10} points
                            </div>
                            <button
                              onClick={handleRestartExercises}
                              className="bg-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-purple-600 transition-colors"
                            >
                              🔄 Recommencer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progression */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((gameState.currentExercise + 1) / exercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
