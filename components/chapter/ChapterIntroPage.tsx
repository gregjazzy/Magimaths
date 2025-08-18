'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Eye, Target, Star, Zap, X } from 'lucide-react';

interface ChapterIntroPageProps {
  config: {
    id: string;
    title: string;
    description: string; // <20 mots
    level: 'CP' | 'CE1' | 'CM1';
    character?: {
      name: string;
      image: string;
      expressions?: string[];
    };
    course: {
      animations: Array<{
        id: string;
        title: string;
        description: string; // 1 petite phrase
        icon: string;
      }>;
    };
    exercises: {
      types: Array<{
        id: string;
        title: string;
        description: string; // 1 petite phrase
        icon: string;
      }>;
    };
  };
}

export default function ChapterIntroPage({ config }: ChapterIntroPageProps) {
  const [hoveredAnimation, setHoveredAnimation] = useState<string | null>(null);
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showStopButton, setShowStopButton] = useState(true);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);

  // Refs pour gérer l'audio et les animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    
    // Arrêter l'audio
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    
    // Arrêter les intervalles d'animation
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    
    if (exerciseIntervalRef.current) {
      clearInterval(exerciseIntervalRef.current);
      exerciseIntervalRef.current = null;
    }
  };

  // Auto-scroll des aperçus
  useEffect(() => {
    setIsAnimationRunning(true);
    
    animationIntervalRef.current = setInterval(() => {
      if (stopSignalRef.current) return;
      setCurrentAnimationIndex((prev) => 
        (prev + 1) % config.course.animations.length
      );
    }, 3000);

    exerciseIntervalRef.current = setInterval(() => {
      if (stopSignalRef.current) return;
      setCurrentExerciseIndex((prev) => 
        (prev + 1) % config.exercises.types.length
      );
    }, 3500);

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      if (exerciseIntervalRef.current) {
        clearInterval(exerciseIntervalRef.current);
      }
    };
  }, [config.course.animations.length, config.exercises.types.length]);

  // Gestion des événements pour arrêter les vocaux et animations
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    // Écouter les changements de visibilité (onglet caché, etc.)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Écouter avant la fermeture/rechargement de la page
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Écouter la navigation (bouton retour du navigateur)
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Arrêter les animations quand on clique sur stop
  const handleStopClick = () => {
    stopAllVocalsAndAnimations();
    setShowStopButton(false);
  };

  // Styles par niveau
  const getLevelStyles = () => {
    switch (config.level) {
      case 'CP':
        return {
          gradient: 'from-blue-400 via-purple-500 to-pink-500',
          bgGradient: 'from-blue-50 via-purple-50 to-pink-50',
          characterBg: 'from-blue-100 to-purple-100'
        };
      case 'CE1':
        return {
          gradient: 'from-green-400 via-emerald-500 to-teal-500',
          bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
          characterBg: 'from-green-100 to-emerald-100'
        };
      case 'CM1':
        return {
          gradient: 'from-indigo-400 via-blue-500 to-cyan-500',
          bgGradient: 'from-indigo-50 via-blue-50 to-cyan-50',
          characterBg: 'from-indigo-100 to-blue-100'
        };
    }
  };

  const styles = getLevelStyles();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${styles.bgGradient} relative overflow-hidden`}>
      {/* Bouton Stop flottant avec personnage */}
      {showStopButton && config.character && (
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-[60]">
          <button
            onClick={handleStopClick}
            className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title="Fermer les aperçus"
          >
            {/* Image du personnage */}
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden border-1 sm:border-2 border-white/50">
              <img
                src={config.character.image}
                alt={`Personnage ${config.character.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Texte et icône */}
            <span className="text-xs sm:text-sm font-bold hidden sm:block">Stop</span>
            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse" />
          </button>
        </div>
      )}

      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Header avec retour */}
        <div className="mb-4 sm:mb-8">
          <Link href={`/${config.level.toLowerCase()}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-6 text-sm sm:text-base">
            <ArrowLeft className="w-3 h-3 sm:w-5 sm:h-5" />
            <span>Retour au {config.level}</span>
          </Link>
        </div>

        {/* Section principale avec personnage */}
        <div className="text-center mb-6 sm:mb-12 px-2">
          {/* Personnage (si présent) */}
          {config.character && (
            <div className={`inline-block p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${styles.characterBg} shadow-xl mb-4 sm:mb-6`}>
              <img 
                src={config.character.image}
                alt={`Personnage ${config.character.name}`}
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto rounded-xl sm:rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300"
              />
              {config.character.expressions && (
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-700">
                  {config.character.expressions[Math.floor(Math.random() * config.character.expressions.length)]}
                </p>
              )}
            </div>
          )}

          {/* Titre et description */}
          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent mb-3 sm:mb-4 px-2`}>
            {config.title}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed px-2">
            {config.description}
          </p>
        </div>

        {/* Sections Cours et Exercices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 px-2">
          
          {/* Section COURS */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/20">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${styles.gradient}`}>
                  <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Le Cours</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Découvre avec des animations interactives</p>
            </div>

            {/* Aperçu des animations */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Animations incluses :</h3>
              <div className="space-y-2 sm:space-y-3">
                {config.course.animations.map((animation, index) => (
                  <div 
                    key={animation.id}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-500 cursor-pointer ${
                      index === currentAnimationIndex || hoveredAnimation === animation.id
                        ? 'border-blue-400 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                    onMouseEnter={() => setHoveredAnimation(animation.id)}
                    onMouseLeave={() => setHoveredAnimation(null)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-2xl">{animation.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">{animation.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{animation.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton Commencer le cours */}
            <Link
              href={`/chapitre/${config.id}/cours`}
              className={`w-full bg-gradient-to-r ${styles.gradient} text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3`}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Commencer le cours
            </Link>
          </div>

          {/* Section EXERCICES */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/20">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500`}>
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Les Exercices</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Entraîne-toi et teste tes connaissances</p>
            </div>

            {/* Aperçu des exercices */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Types d'exercices :</h3>
              <div className="space-y-2 sm:space-y-3">
                {config.exercises.types.map((exercise, index) => (
                  <div 
                    key={exercise.id}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-500 cursor-pointer ${
                      index === currentExerciseIndex || hoveredExercise === exercise.id
                        ? 'border-orange-400 bg-orange-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                    onMouseEnter={() => setHoveredExercise(exercise.id)}
                    onMouseLeave={() => setHoveredExercise(null)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-2xl">{exercise.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base">{exercise.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{exercise.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton Commencer les exercices */}
            <Link
              href={`/chapitre/${config.id}/exercices`}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              Commencer les exercices
            </Link>
          </div>
        </div>

        {/* Indicateurs de progression */}
        <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-2">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex gap-1">
              {config.course.animations.map((_, index) => (
                <div 
                  key={index}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentAnimationIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span>Animations</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex gap-1">
              {config.exercises.types.map((_, index) => (
                <div 
                  key={index}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentExerciseIndex ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span>Exercices</span>
          </div>
        </div>
      </div>
    </div>
  );
}
