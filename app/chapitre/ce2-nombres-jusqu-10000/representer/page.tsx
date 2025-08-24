'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Target, Play } from 'lucide-react';

// Styles personnalisés pour les animations
const animationStyles = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .bounce-animation {
    animation: bounce 0.6s ease-in-out infinite;
  }
  
  @keyframes highlight {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 rgba(239, 68, 68, 0.5);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
    }
  }
  
  .highlight-animation {
    animation: highlight 1s ease-in-out;
  }

  @keyframes pulse-interactive {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 rgba(34, 197, 94, 0.7);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
    }
  }

  .pulse-interactive {
    animation: pulse-interactive 2s ease-in-out infinite;
  }
`;

export default function RepresenterNombresCE2Page() {
  const [selectedRange, setSelectedRange] = useState('0-1000');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour readmeanim
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // Refs pour le contrôle audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'representer',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce2-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'representer');
      
      if (existingIndex >= 0) {
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
          allProgress[existingIndex].attempts += 1;
        }
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('ce2-nombres-progress', JSON.stringify(allProgress));
  };
  
  // États pour l'animation
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const ranges = {
    '0-1000': { min: 0, max: 1000, step: 100 },
    '1000-2000': { min: 1000, max: 2000, step: 100 },
    '2000-3000': { min: 2000, max: 3000, step: 100 },
    '0-10000': { min: 0, max: 10000, step: 1000 }
  };

  // Nombres à placer pour chaque plage
  const numbersToPlace = {
    '0-1000': [150, 350, 580, 720, 850, 950],
    '1000-2000': [1250, 1470, 1630, 1850],
    '2000-3000': [2350, 2580, 2720, 2850],
    '0-10000': [1500, 3500, 5800, 7200, 8500, 9500]
  };

  const exercises = [
    { number: 1523, range: '1000-2000', tolerance: 50 },
    { number: 2847, range: '2000-3000', tolerance: 50 },
    { number: 4235, range: '0-10000', tolerance: 250 },
    { number: 1630, range: '1000-2000', tolerance: 50 },
    { number: 2580, range: '2000-3000', tolerance: 50 },
    { number: 7200, range: '0-10000', tolerance: 250 },
    { number: 1850, range: '1000-2000', tolerance: 50 },
    { number: 2720, range: '2000-3000', tolerance: 50 },
    { number: 8500, range: '0-10000', tolerance: 250 },
    { number: 1470, range: '1000-2000', tolerance: 50 },
    { number: 2350, range: '2000-3000', tolerance: 50 },
    { number: 5800, range: '0-10000', tolerance: 250 },
    { number: 1250, range: '1000-2000', tolerance: 50 },
    { number: 2850, range: '2000-3000', tolerance: 50 },
    { number: 3500, range: '0-10000', tolerance: 250 },
    { number: 1750, range: '1000-2000', tolerance: 50 },
    { number: 2150, range: '2000-3000', tolerance: 50 },
    { number: 9500, range: '0-10000', tolerance: 250 },
    { number: 1950, range: '1000-2000', tolerance: 50 },
    { number: 2950, range: '2000-3000', tolerance: 50 }
  ];

  const generateGraduations = (range: string) => {
    const { min, max, step } = ranges[range as keyof typeof ranges];
    const graduations = [];
    for (let i = min; i <= max; i += step) {
      graduations.push(i);
    }
    return graduations;
  };

  const getPositionPercentage = (value: number, range: string) => {
    const { min, max } = ranges[range as keyof typeof ranges];
    const percentage = ((value - min) / (max - min)) * 100;
    // Arrondir à 2 décimales pour plus de précision
    return Math.round(percentage * 100) / 100;
  };

  const getValueFromPosition = (position: number, range: string) => {
    const { min, max } = ranges[range as keyof typeof ranges];
    return Math.round(min + (position / 100) * (max - min));
  };

  // Fonctions utilitaires pour readmeanim
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    setIsPlayingVocal(false);
    setCharacterSizeExpanded(false);
    setHighlightedElement(null);
  };

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const highlightElement = (elementId: string, duration: number = 2000) => {
    setHighlightedElement(elementId);
    setTimeout(() => {
      if (!stopSignalRef.current) {
        setHighlightedElement(null);
      }
    }, duration);
  };

  const highlightElementsSequentially = async (elementIds: string[], duration: number = 1500) => {
    for (const elementId of elementIds) {
      if (stopSignalRef.current) break;
      highlightElement(elementId, duration);
      await new Promise(resolve => setTimeout(resolve, duration + 200));
    }
  };

  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      currentAudioRef.current = utterance;

      utterance.onend = () => {
        if (!stopSignalRef.current) {
          currentAudioRef.current = null;
        }
        resolve();
      };

      utterance.onerror = () => {
        if (!stopSignalRef.current) {
          currentAudioRef.current = null;
        }
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  };

  // Fonction principale d'explication avec vocal
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setCharacterSizeExpanded(true);
    setHasStarted(true);

    try {
      if (!showExercises) {
        // Mode Cours
        await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à représenter les nombres sur une droite numérique !");
        if (stopSignalRef.current) return;
        
        await playAudio("Regarde cette droite graduée. Chaque graduation représente un nombre.");
        if (stopSignalRef.current) return;
        scrollToElement('number-line-demo');
        highlightElement('number-line-demo', 3000);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (stopSignalRef.current) return;
        await playAudio("Tu peux choisir différentes plages de nombres pour t'entraîner !");
        if (stopSignalRef.current) return;
        scrollToElement('range-selector');
        highlightElement('range-selector', 3000);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (stopSignalRef.current) return;
        await playAudio("Clique sur un nombre pour voir comment il se place sur la droite !");
        if (stopSignalRef.current) return;
        scrollToElement('number-buttons');
        highlightElement('number-buttons', 3000);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (stopSignalRef.current) return;
        await playAudio("N'oublie pas de passer aux Exercices pour t'entraîner !");
        if (stopSignalRef.current) return;
        scrollToElement('exercises-tab');
        highlightElement('exercises-tab', 3000);
        await new Promise(resolve => setTimeout(resolve, 500));

      } else {
        // Mode Exercices
        await playAudio("Parfait ! Maintenant, c'est à toi de jouer !");
        if (stopSignalRef.current) return;

        await playAudio("Regarde le nombre à placer en haut de l'exercice.");
        if (stopSignalRef.current) return;
        scrollToElement('exercise-header');
        highlightElement('exercise-header', 3000);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (stopSignalRef.current) return;
        await playAudio("Clique sur la droite numérique à l'endroit où tu penses que le nombre doit être placé.");
        if (stopSignalRef.current) return;
        scrollToElement('exercise-number-line');
        highlightElement('exercise-number-line', 3000);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (stopSignalRef.current) return;
        await playAudio("Tu peux utiliser les boutons plus et moins pour ajuster ta réponse !");
        if (stopSignalRef.current) return;
        scrollToElement('adjustment-buttons');
        highlightElement('adjustment-buttons', 3000);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (stopSignalRef.current) return;
        // Adapter le texte selon l'état du bouton
        const buttonText = isCorrect === null ? "Vérifier" : "Suivant";
        await playAudio(`Puis clique sur ${buttonText} pour ${isCorrect === null ? "voir si c'est correct" : "passer à l'exercice suivant"} !`);
        if (stopSignalRef.current) return;
        scrollToElement('verify-button');
        highlightElement('verify-button', 3000);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (stopSignalRef.current) return;
        await playAudio("Bonne chance pour tes exercices !");
      }

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      if (!stopSignalRef.current) {
        setIsPlayingVocal(false);
        setCharacterSizeExpanded(false);
      }
    }
  };

  // useEffect pour nettoyer les vocaux lors du changement de section
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  const handleLineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const value = getValueFromPosition(percentage, exercises[currentExercise].range);
    setUserPosition(value);
  };

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      if (userPosition === null) return;
      
      const targetNumber = exercises[currentExercise].number;
      const correct = userPosition === targetNumber;
      
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
      }

      // Si bonne réponse → passage automatique après 1.5s
      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserPosition(null);
            setIsCorrect(null);
          } else {
            // Dernier exercice terminé, afficher la modale
            const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(finalScoreValue);
            setShowCompletionModal(true);
            
            // Sauvegarder les progrès
            saveProgress(finalScoreValue, exercises.length);
          }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserPosition(null);
        setIsCorrect(null);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        saveProgress(score, exercises.length);
      }
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserPosition(null);
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserPosition(null);
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserPosition(null);
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonctions pour l'animation
  const getCurrentNumbers = () => {
    return numbersToPlace[selectedRange as keyof typeof numbersToPlace] || [];
  };

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
  };

  // Réinitialiser la sélection quand on change de plage
  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    setSelectedNumber(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Injection des styles CSS personnalisés */}
      <style jsx>{animationStyles}</style>
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              📏 Représenter les nombres
            </h1>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                !showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              id="exercises-tab"
              onClick={() => setShowExercises(true)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                showExercises 
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${
                highlightedElement === 'exercises-tab' ? 'ring-4 ring-yellow-400 bg-yellow-300 scale-110 animate-pulse' : ''
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage Minecraft */}
              <div className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
                isPlayingVocal
                  ? 'w-16 sm:w-24 h-16 sm:h-24' // When speaking - encore plus gros  
                  : characterSizeExpanded
                    ? 'w-12 sm:w-20 h-12 sm:h-20' // After start - taille normale
                    : 'w-10 sm:w-16 h-10 sm:h-16' // Initial - plus petit
              }`}>
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full rounded-full object-cover"
                />
                {/* Megaphone animé quand il parle */}
                {isPlayingVocal && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Bouton DÉMARRER */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-xl min-h-[2.5rem] sm:min-h-[3rem] shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Explication de la droite numérique */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">

              <h2 id="course-title" className={`text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900 ${
                highlightedElement === 'course-title' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse rounded-lg' : ''
              }`}>
                📊 Qu'est-ce qu'une droite numérique ?
              </h2>
              <div className="bg-blue-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-base sm:text-lg text-blue-900 text-center mb-2 sm:mb-4">
                  Une droite numérique est comme une règle avec des nombres.
                  <span className="hidden sm:inline">
                    <br />Plus on va vers la droite, plus les nombres sont grands !
                  </span>
                </p>
                <div className="flex justify-center space-x-2 sm:space-x-4">
                  <div className="bg-blue-200 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-xl sm:text-2xl mb-1">⬅️</div>
                    <div className="font-bold text-blue-800 text-xs sm:text-base">Plus petit</div>
                  </div>
                  <div className="bg-blue-200 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-xl sm:text-2xl mb-1">➡️</div>
                    <div className="font-bold text-blue-800 text-xs sm:text-base">Plus grand</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de plage */}
            <div id="range-selector" className={`bg-white rounded-xl p-3 sm:p-6 shadow-lg ${
              highlightedElement === 'range-selector' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis une plage de nombres
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-6">
                {Object.keys(ranges).map((range) => (
                  <button
                    key={range}
                    onClick={() => handleRangeChange(range)}
                    className={`p-2 sm:p-4 rounded-lg font-bold text-sm sm:text-lg transition-all min-h-[2.5rem] sm:min-h-[3rem] ${
                      selectedRange === range
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Droite numérique interactive avec animation */}
            <div id="number-line-demo" className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg ${
              highlightedElement === 'number-line-demo' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-8 text-center text-gray-900">
                📏 Droite numérique de {selectedRange}
              </h3>
              
              {/* Message d'explication */}
              <div className="text-center mb-3 sm:mb-6">
                <div className="bg-yellow-100 rounded-lg p-2 sm:p-4 inline-block">
                  <span className="text-yellow-800 font-bold text-xs sm:text-base">
                    👆 Clique sur un nombre <span className="hidden sm:inline">ci-dessous pour le voir sur la droite !</span>
                  </span>
                </div>
              </div>

              {/* Message quand un nombre est sélectionné */}
              {selectedNumber && getCurrentNumbers().includes(selectedNumber) && (
                <div className="text-center mb-16 sm:mb-6">
                  <div className="bg-green-100 rounded-lg p-2 sm:p-4 inline-block">
                    <span className="text-green-800 font-bold text-xs sm:text-base">
                      ✨ Le nombre {selectedNumber} est <span className="hidden sm:inline">maintenant </span>placé ! ✨
                    </span>
                  </div>
                </div>
              )}
              
              <div className="relative mb-16 sm:mb-16 mt-16 sm:mt-12">
                {/* Ligne principale */}
                <div className="h-2 bg-gray-300 rounded-full relative">
                  {/* Graduations */}
                  {generateGraduations(selectedRange).map((value, index) => {
                    const position = getPositionPercentage(value, selectedRange);
                    return (
                      <div
                        key={value}
                        className="absolute top-0 transform -translate-x-1/2"
                        style={{ left: `${position}%` }}
                      >
                        <div className="w-1 h-6 bg-gray-600 -mt-2 mx-auto"></div>
                        <div className="text-[10px] font-bold text-gray-700 mt-1 text-center min-w-max transform -translate-x-1/2">
                          {value}
                        </div>
                      </div>
                    );
                  })}

                  {/* Nombre sélectionné sur la droite */}
                  {selectedNumber && getCurrentNumbers().includes(selectedNumber) && (
                    <div
                      className="absolute top-0 transform -translate-x-1/2 highlight-animation"
                      style={{ left: `${getPositionPercentage(selectedNumber, selectedRange)}%` }}
                    >
                      {/* Trait rouge plus fin sur le trait de graduation */}
                      <div className="w-1 h-6 bg-red-500 rounded -mt-2 mx-auto shadow-lg"></div>
                      {/* Étiquette avec le nombre au-dessus (plus haut) */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12">
                        <div className="text-xs md:text-sm font-bold text-white text-center bg-red-500 px-2 md:px-3 py-1 md:py-2 rounded-lg shadow-lg border-2 border-red-300 min-w-max">
                          {selectedNumber}
                        </div>
                      </div>
                      {/* Petit effet de brillance */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-16">
                        <div className="text-yellow-400 text-xl animate-bounce">✨</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Nombres à cliquer */}
              <div id="number-buttons" className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mt-6 sm:mt-12 relative ${
                highlightedElement === 'number-buttons' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse rounded-lg' : ''
              }`}>
                {getCurrentNumbers().map((num) => {
                  const isSelected = selectedNumber === num;
                  
                  return (
                    <div key={num} className="text-center relative">
                      <button
                        onClick={() => handleNumberClick(num)}
                        className={`w-full rounded-lg p-2 sm:p-3 mb-1 sm:mb-2 transition-all duration-300 hover:scale-105 min-h-[2.5rem] sm:min-h-[3rem] ${
                          isSelected 
                            ? 'bg-green-200 transform scale-110 shadow-lg border-2 border-green-400' 
                            : 'bg-yellow-100 hover:bg-yellow-200 border-2 border-transparent'
                        }`}
                      >
                        <div className={`text-lg sm:text-2xl font-bold transition-colors ${
                          isSelected 
                            ? 'text-green-800' 
                            : 'text-yellow-800'
                        }`}>
                          {num}
                        </div>
                      </button>
                      
                      <div className="text-xs sm:text-sm text-gray-600">
                        {isSelected ? (
                          <>✅ <span className="hidden sm:inline">Sélectionné !</span></>
                        ) : (
                          <>👆 <span className="hidden sm:inline">Clique pour voir</span></>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bouton pour effacer */}
              {selectedNumber && getCurrentNumbers().includes(selectedNumber) && (
                <div className="mt-4 sm:mt-8 text-center">
                  <button
                    onClick={() => setSelectedNumber(null)}
                    className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]"
                  >
                    🔄 Effacer
                  </button>
                </div>
              )}
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-3 sm:p-6 text-white shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">💡 Astuces <span className="hidden sm:inline">pour placer un nombre</span></h3>
              <ul className="space-y-1 sm:space-y-2 text-white text-sm sm:text-base">
                <li>• Regarde les nombres <span className="hidden sm:inline">marqués sur la droite</span></li>
                <li>• Trouve entre quels nombres <span className="hidden sm:inline">se place ton nombre</span></li>
                <li className="hidden sm:block">• S'il est au milieu, place-le au milieu !</li>
                <li className="hidden sm:block">• S'il est plus proche d'un côté, place-le plus près</li>
                <li>• Plus grand = plus à droite</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage Minecraft */}
              <div className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
                isPlayingVocal
                  ? 'w-16 sm:w-24 h-16 sm:h-24' // When speaking - encore plus gros  
                  : characterSizeExpanded
                    ? 'w-12 sm:w-20 h-12 sm:h-20' // After start - taille normale
                    : 'w-10 sm:w-16 h-10 sm:h-16' // Initial - plus petit
              }`}>
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full rounded-full object-cover"
                />
                {/* Megaphone animé quand il parle */}
                {isPlayingVocal && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Bouton DÉMARRER */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-xl min-h-[2.5rem] sm:min-h-[3rem] shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h2 id="exercise-header" className={`text-lg sm:text-2xl font-bold text-gray-900 ${
                  highlightedElement === 'exercise-header' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse rounded-lg' : ''
                }`}>
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>

              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2 sm:mb-3">
                <div 
                  className="bg-red-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg overflow-visible">
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 text-center text-gray-900">
                🎯 Place le nombre {exercises[currentExercise].number} sur la droite
              </h3>
              
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-8 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-800 mb-1 sm:mb-2">
                  {exercises[currentExercise].number}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-yellow-700 mb-1 sm:mb-2">
                  Clique sur la droite <span className="hidden sm:inline">pour placer ce nombre !</span>
                </div>
                <div className="text-xs sm:text-xs md:text-sm text-yellow-600">
                  Puis utilise les boutons -1 et +1 pour ajuster précisément 🎯
                </div>
              </div>

              {/* Droite numérique avec boutons au-dessus des extrémités */}
              <div className="relative mb-3 sm:mb-6 md:mb-8 px-1 sm:px-4 md:px-16 mt-12 sm:mt-16 md:mt-24">
                {/* Boutons positionnés au-dessus des extrémités */}
                {userPosition !== null && (
                  <>
                    {/* Bouton -1 au-dessus de l'extrémité gauche */}
                    <button
                      onClick={() => setUserPosition(Math.max(
                        ranges[exercises[currentExercise].range as keyof typeof ranges].min,
                        userPosition - 1
                      ))}
                      className="absolute left-0 -top-12 sm:-top-14 md:-top-16 bg-orange-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors text-xs sm:text-sm md:text-lg shadow-lg z-10"
                    >
                      -1
                    </button>
                    
                    {/* Bouton +1 au-dessus de l'extrémité droite */}
                    <button
                      onClick={() => setUserPosition(Math.min(
                        ranges[exercises[currentExercise].range as keyof typeof ranges].max,
                        userPosition + 1
                      ))}
                      className="absolute right-0 -top-12 sm:-top-14 md:-top-16 bg-orange-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors text-xs sm:text-sm md:text-lg shadow-lg z-10"
                    >
                      +1
                    </button>
                  </>
                )}

                <div id="adjustment-buttons" className={`relative ${highlightedElement === 'adjustment-buttons' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse rounded-lg' : ''}`}>
                
                <div 
                  id="exercise-number-line"
                  className={`h-4 bg-gray-300 rounded-full relative cursor-pointer hover:bg-gray-400 transition-colors ${
                    highlightedElement === 'exercise-number-line' ? 'ring-4 ring-yellow-400 bg-yellow-300 scale-105 animate-pulse' : ''
                  }`}
                  onClick={handleLineClick}
                >
                  {/* Graduations */}
                  {generateGraduations(exercises[currentExercise].range).map((value, index) => (
                    <div
                      key={value}
                      className="absolute top-0 transform -translate-x-1/2"
                      style={{ left: `${getPositionPercentage(value, exercises[currentExercise].range)}%` }}
                    >
                      <div className="w-1 h-8 bg-gray-600 -mt-2 mx-auto"></div>
                                              <div className="text-[8px] sm:text-[10px] font-bold text-gray-700 mt-2 text-center min-w-max transform -translate-x-1/2">
                          {value}
                        </div>
                    </div>
                  ))}

                  {/* Position choisie par l'utilisateur */}
                  {userPosition !== null && (
                    <div
                      className="absolute top-0 transform -translate-x-1/2"
                      style={{ left: `${getPositionPercentage(userPosition, exercises[currentExercise].range)}%` }}
                    >
                      {/* Carré bleu exactement sur le trait de graduation */}
                      <div className="w-1 h-8 bg-blue-500 rounded -mt-2 mx-auto shadow-lg"></div>
                      {/* Étiquette avec le nombre au-dessus */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                        <div className="text-[8px] sm:text-xs md:text-sm font-bold text-blue-700 text-center bg-blue-100 px-1 md:px-2 py-0.5 md:py-1 rounded min-w-max">
                          {userPosition}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Position correcte (après vérification) */}
                  {isCorrect !== null && (
                    <div
                      className="absolute top-0 transform -translate-x-1/2"
                      style={{ left: `${getPositionPercentage(exercises[currentExercise].number, exercises[currentExercise].range)}%` }}
                    >
                      {/* Carré vert exactement sur le trait de graduation */}
                      <div className="w-1 h-8 bg-green-500 rounded -mt-2 mx-auto shadow-lg"></div>
                      {/* Étiquette avec le nombre au-dessus */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                        <div className="text-[8px] sm:text-xs md:text-sm font-bold text-green-700 text-center bg-green-100 px-1 md:px-2 py-0.5 md:py-1 rounded min-w-max">
                          {exercises[currentExercise].number}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>

              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-2 sm:p-4 rounded-lg mb-8 sm:mb-24 mt-8 sm:mt-24 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-4 sm:w-6 h-4 sm:h-6" />
                        <span className="font-bold text-xs sm:text-sm md:text-base">Bravo ! <span className="hidden sm:inline">Tu as bien placé le nombre !</span></span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 sm:w-6 h-4 sm:h-6" />
                        <span className="font-bold text-xs sm:text-sm md:text-base">
                          Pas tout à fait... <span className="hidden sm:inline">Le nombre {exercises[currentExercise].number} se place là où tu vois le point vert.</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center mt-16 sm:mt-32 md:mt-40">
                <button
                  id="verify-button"
                  onClick={handleNext}
                  disabled={userPosition === null && isCorrect === null}
                  className={`bg-red-500 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 text-xs sm:text-sm md:text-base min-h-[2.5rem] sm:min-h-[3rem] ${
                    highlightedElement === 'verify-button' ? 'ring-4 ring-yellow-400 bg-yellow-300 scale-110 animate-pulse' : ''
                  }`}
                >
                  <Target className="inline w-3 sm:w-3 md:w-4 h-3 sm:h-3 md:h-4 mr-1 md:mr-2" />
                  {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>


          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl transform transition-all">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent !", message: "Tu maîtrises parfaitement la représentation des nombres sur une droite !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Bien joué !", message: "Tu sais bien placer les nombres ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue à t'entraîner !", message: "Recommence les exercices pour mieux maîtriser la représentation des nombres.", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{result.emoji}</div>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{result.title}</h3>
                    <p className="text-sm sm:text-lg text-gray-700 mb-4 sm:mb-6 hidden sm:block">{result.message}</p>
                    <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-base sm:text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length} ({percentage}%)
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="bg-gray-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Bouton STOP flottant global */}
      {isPlayingVocal && (
        <button
          onClick={stopAllVocalsAndAnimations}
          className="fixed top-4 right-4 z-[60] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2"
        >
          <div className="w-8 h-8 relative">
            <img
              src="/image/Minecraftstyle.png"
              alt="Stop"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="font-bold text-sm">Stop</span>
          <div className="w-3 h-3 bg-white rounded animate-pulse"></div>
        </button>
      )}
    </div>
  );
} 