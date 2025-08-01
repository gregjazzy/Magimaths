'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function OrdonnerComparerCP100() {
  const [selectedComparison, setSelectedComparison] = useState('67_34');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour Sam le Pirate et les nouvelles fonctionnalités
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const stopSignalRef = useRef(false);

  // Expressions de Sam et compliments
  const pirateExpressions = [
    "Ahoy matelot ! 🏴‍☠️",
    "Nom d'une jambe de bois ! ⚓",
    "Bien joué corsaire ! 🦜",
    "Mille sabords ! ⚔️",
    "En avant toutes ! 🚢"
  ];

  const correctAnswerCompliments = [
    "Bravo matelot !",
    "Excellent ! Tu es un vrai pirate des maths !",
    "Parfait ! Nom d'une jambe de bois !",
    "Magnifique ! Tu navigues comme un chef !",
    "Formidable ! Mille sabords !"
  ];

  // Comparaisons pour le cours
  const comparisons = [
    { id: '23_45', num1: 23, num2: 45, symbol: '<', explanation: '23 est plus petit que 45', visual: '📦📦🔴🔴🔴 < 📦📦📦📦🔴🔴🔴🔴🔴' },
    { id: '67_34', num1: 67, num2: 34, symbol: '>', explanation: '67 est plus grand que 34', visual: '📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴 > 📦📦📦🔴🔴🔴🔴' },
    { id: '56_56', num1: 56, num2: 56, symbol: '=', explanation: '56 est égal à 56', visual: '📦📦📦📦📦🔴🔴🔴🔴🔴🔴 = 📦📦📦📦📦🔴🔴🔴🔴🔴🔴' },
    { id: '89_72', num1: 89, num2: 72, symbol: '>', explanation: '89 est plus grand que 72', visual: '📦📦📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴🔴🔴 > 📦📦📦📦📦📦📦🔴🔴' },
    { id: '38_91', num1: 38, num2: 91, symbol: '<', explanation: '38 est plus petit que 91', visual: '📦📦📦🔴🔴🔴🔴🔴🔴🔴🔴 < 📦📦📦📦📦📦📦📦📦🔴' },
    { id: '75_75', num1: 75, num2: 75, symbol: '=', explanation: '75 est égal à 75', visual: '📦📦📦📦📦📦📦🔴🔴🔴🔴🔴 = 📦📦📦📦📦📦📦🔴🔴🔴🔴🔴' },
    { id: '42_19', num1: 42, num2: 19, symbol: '>', explanation: '42 est plus grand que 19', visual: '📦📦📦📦🔴🔴 > 📦🔴🔴🔴🔴🔴🔴🔴🔴🔴' },
    { id: '28_63', num1: 28, num2: 63, symbol: '<', explanation: '28 est plus petit que 63', visual: '📦📦🔴🔴🔴🔴🔴🔴🔴🔴 < 📦📦📦📦📦📦🔴🔴🔴' }
  ];

  // Fonction pour générer des exercices de rangement uniquement (comme cp-nombres-jusqu-20)
  const generateRandomExercises = () => {
    const allExercises = [
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [45, 23, 78], correctAnswer: '23, 45, 78' },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [67, 91, 34], correctAnswer: '91, 67, 34' },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [89, 56, 72], correctAnswer: '56, 72, 89' },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [38, 95, 61], correctAnswer: '95, 61, 38' },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [100, 47, 83], correctAnswer: '47, 83, 100' },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [29, 74, 52], correctAnswer: '74, 52, 29' },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [68, 41, 96], correctAnswer: '41, 68, 96' },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [75, 33, 88], correctAnswer: '88, 75, 33' },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [57, 84, 26], correctAnswer: '26, 57, 84' },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [93, 49, 71], correctAnswer: '93, 71, 49' },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [36, 82, 54], correctAnswer: '36, 54, 82' },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [64, 27, 90], correctAnswer: '90, 64, 27' },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [48, 76, 19], correctAnswer: '19, 48, 76' },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [85, 42, 69], correctAnswer: '85, 69, 42' },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [31, 87, 55], correctAnswer: '31, 55, 87' }
    ];

    // Mélanger et prendre 12 exercices aléatoires
    const shuffled = [...allExercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  };

  // Exercices générés aléatoirement à chaque session
  const [exercises] = useState(() => generateRandomExercises());



  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ordonner-comparer',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-100-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ordonner-comparer');
      
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

    localStorage.setItem('cp-nombres-100-progress', JSON.stringify(allProgress));
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonctions pour la gestion audio et Sam le Pirate
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    setHighlightedElement(null);
  };

  const playAudio = (text: string) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  const startPirateIntro = async () => {
    setIsPlayingVocal(true);
    setPirateIntroStarted(true);
    stopSignalRef.current = false;

    try {
      await playAudio("Ahoy matelot ! Je suis Sam le Pirate et je vais t'aider avec les comparaisons jusqu'à 100 !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Pour écouter l'énoncé, appuie sur écouter l'énoncé");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      setShowExercisesList(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Dès que tu as trouvé la réponse, tu peux l'écrire dans la case");
      if (stopSignalRef.current) return;
      
      // Mettre beaucoup en évidence la zone de réponse
      setHighlightedElement('answer-input');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("et appuie ensuite sur valider");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton valider
      setHighlightedElement('validate-button');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("En cas de mauvaise réponse, je serai là pour t'expliquer. En avant toutes !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  const startExerciseExplanation = async () => {
    const question = exercises[currentExercise]?.question;
    if (question) {
      setIsPlayingVocal(true);
      setSamSizeExpanded(true);
      
      // Expression d'encouragement de Sam
      const randomExpression = pirateExpressions[Math.floor(Math.random() * pirateExpressions.length)];
      await playAudio(randomExpression);
      
      // Énoncé de la question
      await playAudio(question);
      
      // Conseil de Sam selon le type de question
      const currentEx = exercises[currentExercise];
      if (currentEx?.type === 'rangement') {
        await playAudio("Pour ranger les nombres, commence par regarder les dizaines !");
      } else {
        await playAudio("Regarde bien les dizaines d'abord, puis les unités si nécessaire !");
      }
      
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
    }
  };

  const scrollToNextButton = () => {
    setTimeout(() => {
      const nextButton = document.getElementById('next-exercise-button');
      if (nextButton) {
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const celebrateCorrectAnswer = async () => {
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    // Compliment aléatoire de Sam
    const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
    await playAudio(randomCompliment);
    
    setHighlightedElement('next-exercise-button');
    scrollToNextButton();
    await playAudio("Tu peux appuyer sur suivant pour continuer ton aventure !");
    setIsPlayingVocal(false);
    setSamSizeExpanded(false);
  };

  const explainWrongAnswer = async () => {
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    const currentEx = exercises[currentExercise];
    const correctAnswer = currentEx?.correctAnswer;
    
    // Expression de Sam pour encourager
    const randomExpression = pirateExpressions[Math.floor(Math.random() * pirateExpressions.length)];
    await playAudio(`${randomExpression} Pas de souci matelot, on apprend ensemble !`);
    
    if (currentEx?.type === 'rangement') {
      await playAudio(`La bonne réponse est : ${correctAnswer}`);
      if (currentEx.question.includes('plus petit au plus grand')) {
        await playAudio("Rappelle-toi, on range toujours du plus petit au plus grand !");
      } else {
        await playAudio("Pour du plus grand au plus petit, c'est l'inverse !");
      }
      await playAudio("Compare d'abord les dizaines, puis les unités si nécessaire !");
    }
    
    setHighlightedElement('next-exercise-button');
    scrollToNextButton();
    await playAudio("Tu peux appuyer sur suivant pour continuer l'aventure !");
    setIsPlayingVocal(false);
    setSamSizeExpanded(false);
  };

  const handleAnswerSubmit = async () => {
    stopAllVocalsAndAnimations(); // Stop any ongoing audio first
    
    // Nouvelle logique de validation pour les exercices de rangement
    let correct = false;
    const exercise = exercises[currentExercise];
    
    // Pour les rangements : vérifier l'ordre des nombres
    const userNumbers = userAnswer.split(',').map(n => n.trim()).join(', ');
    correct = userNumbers === exercise.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });

      // Passage automatique direct sans attendre Sam (évite les conflits avec stopAllVocalsAndAnimations)
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          // Prochain exercice
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernier exercice terminé
          setFinalScore(score + 1);
          setShowCompletionModal(true);
          saveProgress(score + 1, exercises.length);
        }
      }, 1500);
      
      // Célébrer avec Sam le Pirate (mais sans bloquer le passage automatique)
      celebrateCorrectAnswer(); // Pas de await pour éviter les blocages
    } else if (!correct) {
      // Expliquer l'erreur avec Sam le Pirate
      await explainWrongAnswer();
    }
  };

  const nextExercise = () => {
    setHighlightedElement(null);
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setImageError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    setSamSizeExpanded(false);
    stopSignalRef.current = false;
  };

  // Effet pour réinitialiser les états Sam quand on change entre cours et exercices
  useEffect(() => {
    if (!showExercises) {
      // Quand on revient au cours, réinitialiser les états Sam
      setPirateIntroStarted(false);
      setShowExercisesList(false);
      setSamSizeExpanded(false);
    }
  }, [showExercises]);

  // Effet pour réinitialiser les états sur changement d'exercice
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
  }, [currentExercise]);

  // useEffect pour nettoyer l'audio lors des changements de navigation
  useEffect(() => {
    const handleBeforeUnload = () => stopAllVocalsAndAnimations();
    const handlePopState = () => stopAllVocalsAndAnimations();
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Composant JSX pour le bouton "Écouter l'énoncé" (style cp-nombres-jusqu-20)
  const ListenQuestionButtonJSX = () => (
    <div className="mb-3 sm:mb-6">
      <button
        id="listen-question-button"
        onClick={startExerciseExplanation}
        disabled={isPlayingVocal}
        className={`bg-blue-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 mx-auto shadow-lg ${
          highlightedElement === 'listen-question-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
        }`}
      >
        <Volume2 className="w-3 h-3 sm:w-5 sm:h-5" />
        <span>🎧 Écouter l'énoncé</span>
      </button>
    </div>
  );

  // JSX pour l'introduction de Sam le Pirate dans les exercices (style cp-nombres-jusqu-20)
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-1 sm:mt-2">
      <div className="flex items-center gap-2">
        {/* Image de Sam le Pirate */}
        <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 shadow-md transition-all duration-300 ${
          isPlayingVocal
            ? 'w-20 sm:w-32 h-20 sm:h-32 scale-110 sm:scale-150' // When speaking - agrandi mobile
            : pirateIntroStarted
              ? 'w-16 sm:w-16 h-16 sm:h-16' // After "COMMENCER" clicked (reduced) - agrandi mobile
              : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
        }`}>
          {!imageError ? (
            <img 
              src="/image/pirate-small.png" 
              alt="Sam le Pirate" 
              className="w-full h-full rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center text-2xl">
              🏴‍☠️
            </div>
          )}
          {/* Haut-parleur animé quand il parle */}
          {isPlayingVocal && (
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-2 rounded-full animate-bounce shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Bouton Start Exercices - AVEC AUDIO */}
        <button
        onClick={startPirateIntro}
        disabled={isPlayingVocal || pirateIntroStarted}
        className={`relative px-6 sm:px-12 py-3 sm:py-5 rounded-xl font-black text-base sm:text-2xl transition-all duration-300 transform ${
          isPlayingVocal 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed animate-pulse shadow-md' 
            : pirateIntroStarted
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white opacity-75 cursor-not-allowed shadow-lg'
              : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:scale-110 shadow-2xl hover:shadow-3xl animate-pulse border-4 border-yellow-300'
        } ${!isPlayingVocal && !pirateIntroStarted ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''}`}
        style={{
          animationDuration: !isPlayingVocal && !pirateIntroStarted ? '1.5s' : '2s',
          animationIterationCount: isPlayingVocal || pirateIntroStarted ? 'none' : 'infinite',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          boxShadow: !isPlayingVocal && !pirateIntroStarted 
            ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
            : ''
        }}
      >
        {/* Effet de brillance */}
        {!isPlayingVocal && !pirateIntroStarted && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        )}
        
        {/* Icônes et texte avec plus d'émojis */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isPlayingVocal 
            ? <>🎤 <span className="animate-bounce">Sam parle...</span></> 
            : pirateIntroStarted
              ? <>✅ <span>Intro terminée</span></>
              : <>🚀 <span className="animate-bounce">COMMENCER</span> ✨</>
          }
        </span>
        
        {/* Particules brillantes pour le bouton commencer */}
        {!isPlayingVocal && !pirateIntroStarted && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </>
        )}
      </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `
      }} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className={`${showExercises ? 'mb-4' : 'mb-6 sm:mb-8'}`}>
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className={`bg-white rounded-xl shadow-lg text-center ${
            showExercises ? 'p-3 sm:p-6' : 'p-4 sm:p-6'
          }`}>
                        <h1 className={`font-bold text-gray-900 ${
              showExercises 
                ? 'text-lg sm:text-2xl lg:text-4xl mb-1 sm:mb-4' 
                : 'text-lg sm:text-2xl lg:text-4xl mb-1 sm:mb-4'
            }`}>
              📊 Mettre dans l'ordre et comparer
            </h1>
            {!showExercises && (
              <p className="text-lg text-gray-600 hidden sm:block">
                Apprends à comparer et mettre les nombres dans l'ordre !
            </p>
            )}
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[48px] sm:min-h-[68px] flex items-center justify-center ${
                !showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[48px] sm:min-h-[68px] flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs sm:text-sm">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Sélecteur de comparaison */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis une comparaison à analyser
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {comparisons.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedComparison(comp.id)}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                      selectedComparison === comp.id
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {comp.num1} {comp.symbol} {comp.num2}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage de la comparaison sélectionnée */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Analysons cette comparaison
              </h3>
              
              {(() => {
                const selected = comparisons.find(c => c.id === selectedComparison);
                if (!selected) return null;
                
                return (
                  <div className="bg-orange-50 rounded-lg p-3 sm:p-8 mb-4 sm:mb-8">
                    {/* Grande comparaison */}
                    <div className="text-3xl sm:text-5xl lg:text-7xl font-bold text-orange-600 mb-3 sm:mb-6 flex items-center justify-center space-x-2 sm:space-x-4">
                      <span>{selected.num1}</span>
                      <span className={`${
                        selected.symbol === '>' ? 'text-red-600' : 
                        selected.symbol === '<' ? 'text-blue-600' : 
                        'text-purple-600'
                      }`}>
                        {selected.symbol}
                      </span>
                      <span>{selected.num2}</span>
                    </div>
                    
                    {/* Représentation visuelle */}
                    <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                        👀 Regarde avec des paquets :
                      </h4>
                      <div className="text-base sm:text-xl py-2 sm:py-4 leading-relaxed break-all">
                        {selected.visual}
                      </div>
                    </div>

                    {/* Analyse par dizaines et unités */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
                      <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base font-bold mb-2 text-blue-800">{selected.num1} :</h4>
                        <p className="text-xs sm:text-sm text-blue-700">
                          {Math.floor(selected.num1 / 10)} dizaines + {selected.num1 % 10} unités
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base font-bold mb-2 text-green-800">{selected.num2} :</h4>
                        <p className="text-xs sm:text-sm text-green-700">
                          {Math.floor(selected.num2 / 10)} dizaines + {selected.num2 % 10} unités
                        </p>
                      </div>
                    </div>

                    {/* Explication */}
                    <div className="bg-yellow-50 rounded-lg p-3 sm:p-6">
                      <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-yellow-800">
                        💡 Explication :
                      </h4>
                      <p className="text-base sm:text-xl font-bold text-yellow-900 mb-2 sm:mb-4">
                        {selected.explanation}
                      </p>
                      <button
                        onClick={() => speakText(selected.explanation)}
                        className="bg-yellow-500 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm sm:text-base"
                      >
                        <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Écouter
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Guide des symboles */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">📝 Les symboles à maîtriser</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">&gt;</div>
                  <h4 className="font-bold text-red-800 mb-1">Plus grand que</h4>
                  <p className="text-sm text-red-700">87 &gt; 34</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">&lt;</div>
                  <h4 className="font-bold text-blue-800 mb-1">Plus petit que</h4>
                  <p className="text-sm text-blue-700">25 &lt; 76</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">=</div>
                  <h4 className="font-bold text-purple-800 mb-1">Égal à</h4>
                  <p className="text-sm text-purple-700">58 = 58</p>
                </div>
              </div>
            </div>

            {/* Méthode pour comparer */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900">🎯 Méthode pour comparer</h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <strong>1️⃣ Compare d'abord les dizaines :</strong> 67 vs 34 → 6 &gt; 3, donc 67 &gt; 34
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                  <strong>2️⃣ Si les dizaines sont égales, compare les unités :</strong> 64 vs 68 → 4 &lt; 8, donc 64 &lt; 68
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                  <strong>3️⃣ Si tout est égal :</strong> 56 vs 56 → 56 = 56
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-xl p-4 sm:p-6 text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour les grands nombres</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• Plus il y a de dizaines, plus le nombre est grand</li>
                <li>• 70 &gt; 69 (même si 9 &gt; 0, regarde les dizaines !)</li>
                <li>• Pour ranger : commence toujours par le plus petit</li>
                <li>• 100 est le plus grand nombre qu'on connaît !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES - FLOW NORMAL COMME CP-NOMBRES-JUSQU-20 */
          <div className="space-y-4 sm:space-y-8">
            {/* Introduction de Sam le Pirate - toujours visible */}
            <SamPirateIntroJSX />

            {/* Indicateur de progression mobile - sticky en haut */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 sm:hidden">
              <div className="text-center mb-2">
                <div className="text-sm font-bold text-gray-700 mb-1">
                  Exercice {currentExercise + 1}/{exercises.length}
                </div>
                <div className="text-sm font-bold text-pink-600 mb-2">
                  Score : {score}/{exercises.length}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              </div>
              
            {/* Question - NORMAL FLOW */}
            <div className="bg-white rounded-xl shadow-lg text-center p-4 sm:p-6 md:p-8 mt-4 sm:mt-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 sm:mb-6 md:mb-8 gap-2 sm:gap-4">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                    {exercises[currentExercise]?.question || "Classe les nombres dans l'ordre"}
                  </h3>
                  <ListenQuestionButtonJSX />
                </div>

                {/* Affichage selon le type d'exercice */}
                <div className="rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 bg-purple-50">
                  <div className="space-y-2 sm:space-y-4">
                    <div className="text-xl sm:text-4xl font-bold text-purple-600">
                      {exercises[currentExercise]?.numbers?.join(' , ')}
                </div>
              </div>
            </div>

                {/* Zone de saisie */}
                <div 
                  id="answer-choices"
                  className={`max-w-sm sm:max-w-lg mx-auto mb-4 sm:mb-8 transition-all duration-500 ${
                    highlightedElement === 'answer-choices' ? 'ring-8 ring-yellow-400 bg-yellow-50 rounded-lg p-4 scale-105 shadow-2xl animate-pulse' : ''
                  }`}
                >
                  {/* RANGEMENT : [?] , [?] , [?] */}
                  <div className="space-y-2 sm:space-y-4">
                    <p className="text-base sm:text-lg text-gray-600 font-semibold hidden sm:block text-center">
                      Classe les nombres dans l'ordre demandé
                    </p>
                    <div className="flex items-center justify-center space-x-1 sm:space-x-4">
                      <input
                        type="number"
                        value={userAnswer.split(',')[0] || ''}
                        onChange={(e) => {
                          const parts = userAnswer.split(',');
                          parts[0] = e.target.value;
                          setUserAnswer(parts.join(','));
                        }}
                        disabled={isCorrect !== null}
                        placeholder="?"
                        className="w-12 sm:w-20 h-10 sm:h-16 text-center text-base sm:text-2xl font-bold border-2 sm:border-4 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:outline-none disabled:opacity-50"
                      />
                      <span className="text-base sm:text-2xl font-bold text-gray-500">,</span>
                      <input
                        type="number"
                        value={userAnswer.split(',')[1] || ''}
                        onChange={(e) => {
                          const parts = userAnswer.split(',');
                          parts[1] = e.target.value;
                          setUserAnswer(parts.join(','));
                        }}
                        disabled={isCorrect !== null}
                        placeholder="?"
                        className="w-12 sm:w-20 h-10 sm:h-16 text-center text-base sm:text-2xl font-bold border-2 sm:border-4 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:outline-none disabled:opacity-50"
                      />
                      <span className="text-base sm:text-2xl font-bold text-gray-500">,</span>
                      <input
                        type="number"
                        value={userAnswer.split(',')[2] || ''}
                        onChange={(e) => {
                          const parts = userAnswer.split(',');
                          parts[2] = e.target.value;
                          setUserAnswer(parts.join(','));
                        }}
                        disabled={isCorrect !== null}
                        placeholder="?"
                        className="w-12 sm:w-20 h-10 sm:h-16 text-center text-base sm:text-2xl font-bold border-2 sm:border-4 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:outline-none disabled:opacity-50"
                      />
                  </div>
              </div>
              
                  {/* Bouton Valider */}
                  <div className="flex justify-center mt-3 sm:mt-6">
                  <button
                      onClick={handleAnswerSubmit}
                      disabled={(() => {
                        if (isCorrect !== null) return true;
                        const parts = userAnswer.split(',');
                        return !parts[0]?.trim() || !parts[1]?.trim() || !parts[2]?.trim(); // Les 3 nombres doivent être remplis
                      })()}
                      className="bg-green-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-sm sm:text-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Valider
                  </button>
                  </div>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                  <div className={`p-3 sm:p-6 rounded-lg mb-3 sm:mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2 sm:mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                          <span className="font-bold text-base sm:text-xl">
                            Excellent ! Tu as bien dit : {userAnswer} !
                          </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                          <span className="font-bold text-sm sm:text-xl">
                            Pas tout à fait... Il fallait dire : {exercises[currentExercise]?.correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                    
                    {/* Explication pour les mauvaises réponses */}
                    {!isCorrect && (
                      <div className="bg-white rounded-lg p-3 sm:p-6 border border-blue-300 sm:border-2">
                        <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-4 text-blue-800 text-center">
                          📚 Explication
                        </h4>
                        
                        <div className="space-y-2 sm:space-y-4">
                          <div className="bg-blue-50 rounded-lg p-2 sm:p-4 text-center">
                            <div className="text-lg sm:text-xl font-bold text-blue-600 mb-1 sm:mb-2">
                              {exercises[currentExercise]?.correctAnswer}
                            </div>
                            
                            <div className="space-y-1 sm:space-y-2">
                              <div className="text-sm sm:text-lg text-gray-700">
                                {exercises[currentExercise]?.question.includes('plus petit au plus grand') ? 
                                  'Ordre croissant :' : 'Ordre décroissant :'} {exercises[currentExercise]?.correctAnswer}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">
                                {exercises[currentExercise]?.question.includes('plus petit au plus grand') ? 
                                  'Du plus petit au plus grand !' : 'Du plus grand au plus petit !'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-2 sm:p-3 text-center">
                            <div className="text-base sm:text-lg">🌟</div>
                            <p className="text-xs sm:text-sm font-semibold text-purple-800">
                              Maintenant tu sais !
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                  <div className="flex justify-center pb-4 sm:pb-0">
                  <button
                      id="next-exercise-button"
                    onClick={nextExercise}
                      className="bg-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[50px] sm:min-h-auto"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Champion des comparaisons !", message: "Tu maîtrises parfaitement les nombres jusqu'à 100 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très impressionnant !", message: "Tu progresses énormément avec les grands nombres !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 Bon travail !", message: "Continue à t'entraîner avec les nombres jusqu'à 100 !", emoji: "😊" };
                  return { title: "💪 Persévère !", message: "Les comparaisons jusqu'à 100, ça demande de l'entraînement !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-4xl sm:text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-2xl sm:text-4xl mt-2">
                        {finalScore >= 20 ? '⭐⭐⭐' : finalScore >= 15 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors text-sm sm:text-base"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
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
    </div>
  );
} 