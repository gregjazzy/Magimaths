'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye, Play } from 'lucide-react';

// Import des composants modulaires
import { AdditionTechniques } from '@/components/exercises/AdditionTechniques';
import { ExerciseSection } from '@/components/exercises/ExerciseSection';
import { SamPirateIntro } from '@/components/character/SamPirateIntro';
import { useAudioManager } from '@/components/exercises/AudioManager';

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

  // Hook audio manager
  const audioManager = useAudioManager({
    stopSignalRef,
    currentAudioRef,
    onAudioStart: () => setAudioState(prev => ({ ...prev, isPlayingVocal: true })),
    onAudioEnd: () => setAudioState(prev => ({ ...prev, isPlayingVocal: false })),
    onAudioError: () => setAudioState(prev => ({ ...prev, isPlayingVocal: false }))
  });

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
      await audioManager.speakText(
        "Ahoy matelot ! Nous allons explorer 6 techniques magiques pour additionner jusqu'à 100. Choisis une technique pour commencer l'aventure !"
      );
    } finally {
      setPirateState(prev => ({ ...prev, isPlayingEnonce: false }));
    }
  };

  const handleStopAudio = () => {
    audioManager.stopAudio();
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
        <SamPirateIntro
          pirateIntroStarted={pirateState.pirateIntroStarted}
          samSizeExpanded={pirateState.samSizeExpanded}
          imageError={pirateState.imageError}
          isPlayingEnonce={pirateState.isPlayingEnonce}
          onStartIntro={handleStartIntro}
          onImageError={handleImageError}
          onPlayEnonce={handlePlayEnonce}
          onStopAudio={handleStopAudio}
        />

        {/* Techniques d'addition */}
        {gameState.hasStarted && (
          <div className="space-y-8">
            <AdditionTechniques
              techniques={additionTechniques}
              selectedTechnique={techniqueState.selectedTechnique}
              onTechniqueSelect={handleTechniqueSelect}
              selectedExampleIndex={techniqueState.selectedExampleIndex}
              onExampleSelect={handleExampleSelect}
              currentTechnique={techniqueState.currentTechnique}
              calculationStep={techniqueState.calculationStep}
              highlightedDigits={techniqueState.highlightedDigits}
              animatingStep={techniqueState.animatingStep}
            />

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
              <ExerciseSection
                exercises={exercises}
                currentExercise={gameState.currentExercise}
                userAnswer={exerciseState.userAnswer}
                isCorrect={exerciseState.isCorrect}
                score={gameState.score}
                answeredCorrectly={exerciseState.answeredCorrectly}
                showCompletionModal={gameState.showCompletionModal}
                finalScore={gameState.finalScore}
                onAnswerChange={handleAnswerChange}
                onAnswerSubmit={handleAnswerSubmit}
                onNextExercise={handleNextExercise}
                onRestartExercises={handleRestartExercises}
                minecraftExpressions={minecraftExpressions}
                correctAnswerCompliments={correctAnswerCompliments}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
