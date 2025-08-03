'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Eye, Edit, Play } from 'lucide-react';

export default function LectureEcritureCP100() {
  const [selectedNumber, setSelectedNumber] = useState('45');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  
  // États pour l'animation progressive
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // États pour Sam le Pirate et audio
  const [highlightDigit, setHighlightDigit] = useState<'left' | 'right' | null>(null);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const stopSignalRef = useRef(false);

  // Fonction pour lire l'énoncé de l'exercice - LECTURE SIMPLE DE LA QUESTION
  const startExerciseExplanation = async () => {
    if (isExplainingError || !exercises[currentExercise]) return;
    
    setIsPlayingVocal(true);
    setExerciseStarted(true);
    
    await playAudio(exercises[currentExercise].question);
    
    setIsPlayingVocal(false);
  };

  // Réinitialiser les états sur changement d'exercice
  useEffect(() => {
    setHighlightDigit(null);
    setIsExplainingError(false);
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setExerciseStarted(false);
    setImageError(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
  }, [currentExercise]);

  // Fonction pour stopper tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    speechSynthesis.cancel();
    setIsPlayingVocal(false);
    setIsExplainingError(false);
    setHighlightDigit(null);
    setHighlightedElement(null);
  };

  // Effet pour détecter la navigation et stopper les vocaux
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    // Intercepter les changements de route Next.js
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
      stopAllVocalsAndAnimations();
      return originalPushState.call(history, state, title, url);
    };

    history.replaceState = function(state, title, url) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.call(history, state, title, url);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      
      // Restaurer les fonctions originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'lecture-ecriture',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'lecture-ecriture');
      
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

  // Nombres avec leurs écritures pour le cours CP-100
  const numbersWithWriting = [
    { chiffre: '25', lettres: 'vingt-cinq', pronunciation: 'vingt-cinq', visual: '📦📦🔴🔴🔴🔴🔴' },
    { chiffre: '45', lettres: 'quarante-cinq', pronunciation: 'quarante-cinq', visual: '📦📦📦📦🔴🔴🔴🔴🔴' },
    { chiffre: '63', lettres: 'soixante-trois', pronunciation: 'soixante-trois', visual: '📦📦📦📦📦📦🔴🔴🔴' },
    { chiffre: '78', lettres: 'soixante-dix-huit', pronunciation: 'soixante-dix-huit', visual: '📦📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴🔴' },
    { chiffre: '84', lettres: 'quatre-vingt-quatre', pronunciation: 'quatre-vingt-quatre', visual: '📦📦📦📦📦📦📦📦🔴🔴🔴🔴' },
    { chiffre: '87', lettres: 'quatre-vingt-sept', pronunciation: 'quatre-vingt-sept', visual: '📦📦📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴🔴' },
    { chiffre: '90', lettres: 'quatre-vingt-dix', pronunciation: 'quatre-vingt-dix', visual: '📦📦📦📦📦📦📦📦📦' },
    { chiffre: '96', lettres: 'quatre-vingt-seize', pronunciation: 'quatre-vingt-seize', visual: '📦📦📦📦📦📦📦📦📦🔴🔴🔴🔴🔴🔴' },
    { chiffre: '100', lettres: 'cent', pronunciation: 'cent', visual: '🏠' }
  ];

  // Exercices mixtes lecture/écriture - format input text
  const exercises = [
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '42', correctAnswer: 'quarante-deux' },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'cinquante-huit', correctAnswer: '58' },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '70', correctAnswer: 'soixante-dix' },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'quatre-vingts', correctAnswer: '80' },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '34', correctAnswer: 'trente-quatre' },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'soixante-quinze', correctAnswer: '75' },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '96', correctAnswer: 'quatre-vingt-seize' },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'trente-sept', correctAnswer: '37' },
    { type: 'lecture', question: 'Comment dit-on ce nombre ?', display: '63', correctAnswer: 'soixante-trois' },
    { type: 'ecriture', question: 'Comment écrit-on ce nombre en chiffres ?', display: 'quatre-vingt-douze', correctAnswer: '92' }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Composant JSX pour le bouton "Écouter l'énoncé"
  const ListenQuestionButtonJSX = () => (
    <button 
      id="listen-question-button"
      onClick={startExerciseExplanation}
      disabled={isPlayingVocal}
      className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold text-sm sm:text-lg transition-all shadow-lg ${
        highlightedElement === 'listen-question-button'
          ? 'bg-yellow-400 text-black ring-8 ring-yellow-300 animate-bounce scale-125 shadow-2xl border-4 border-orange-500'
          : isPlayingVocal
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : exerciseStarted
              ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-xl hover:scale-105'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl hover:scale-105'
      } disabled:opacity-50`}
    >
      {isPlayingVocal ? '🎤 Énoncé en cours...' : exerciseStarted ? '🔄 Réécouter l\'énoncé' : '🎤 Écouter l\'énoncé'}
    </button>
  );

  // JSX pour l'introduction de Sam le Pirate dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-0 sm:mt-2">
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
            <div className="absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl font-bold">🏴‍☠️</div>
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

  // Fonction pour jouer un audio
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  // Fonction pour expliquer le chapitre dans le cours
  const explainChapter = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await new Promise(resolve => setTimeout(resolve, 300));
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    try {
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à lire et écrire les nombres jusqu'à 100 !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Tu vas découvrir comment passer des chiffres aux lettres et des lettres aux chiffres, nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Maintenant tu peux explorer les nombres et voir leurs animations !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
    }
  };

  // Fonction pour expliquer le nombre sélectionné avec animation
  const explainSelectedNumber = async () => {
    if (isPlayingVocal) return;
    
    const selected = numbersWithWriting.find(n => n.chiffre === selectedNumber);
    if (!selected) return;
    
    stopAllVocalsAndAnimations();
    await new Promise(resolve => setTimeout(resolve, 300));
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    try {
      await playAudio(`Analysons ensemble le nombre ${selected.chiffre} !`);
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (stopSignalRef.current) return;
      
      await playAudio(`En chiffres, on écrit ${selected.chiffre} !`);
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (stopSignalRef.current) return;
      
      await playAudio(`En lettres, on écrit ${selected.lettres} !`);
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (stopSignalRef.current) return;
      
      await playAudio(`Et on le prononce comme ça : ${selected.pronunciation} !`);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainSelectedNumber:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
    }
  };

  // Fonction pour l'introduction vocale de Sam le Pirate - DÉMARRAGE MANUEL PAR CLIC
  const startPirateIntro = async () => {
    if (pirateIntroStarted) return;
    
    // FORCER la remise à false pour le démarrage manuel
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setPirateIntroStarted(true);
    
    try {
      await playAudio("Bonjour matelot ! Je vais t'aider avec la lecture et l'écriture des nombres, nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      await playAudio("Pour lire l'énoncé appuie sur écouter l'énoncé");
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

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string): string => {
    const numbers: { [key: string]: string } = {
      '21': 'vingt et un', '22': 'vingt-deux', '23': 'vingt-trois', '24': 'vingt-quatre', '25': 'vingt-cinq',
      '26': 'vingt-six', '27': 'vingt-sept', '28': 'vingt-huit', '29': 'vingt-neuf', '30': 'trente',
      '31': 'trente et un', '32': 'trente-deux', '33': 'trente-trois', '34': 'trente-quatre', '35': 'trente-cinq',
      '36': 'trente-six', '37': 'trente-sept', '38': 'trente-huit', '39': 'trente-neuf', '40': 'quarante',
      '41': 'quarante et un', '42': 'quarante-deux', '43': 'quarante-trois', '44': 'quarante-quatre', '45': 'quarante-cinq',
      '46': 'quarante-six', '47': 'quarante-sept', '48': 'quarante-huit', '49': 'quarante-neuf', '50': 'cinquante',
      '51': 'cinquante et un', '52': 'cinquante-deux', '53': 'cinquante-trois', '54': 'cinquante-quatre', '55': 'cinquante-cinq',
      '56': 'cinquante-six', '57': 'cinquante-sept', '58': 'cinquante-huit', '59': 'cinquante-neuf', '60': 'soixante',
      '61': 'soixante et un', '62': 'soixante-deux', '63': 'soixante-trois', '64': 'soixante-quatre', '65': 'soixante-cinq',
      '66': 'soixante-six', '67': 'soixante-sept', '68': 'soixante-huit', '69': 'soixante-neuf', '70': 'soixante-dix',
      '71': 'soixante et onze', '72': 'soixante-douze', '73': 'soixante-treize', '74': 'soixante-quatorze', '75': 'soixante-quinze',
      '76': 'soixante-seize', '77': 'soixante-dix-sept', '78': 'soixante-dix-huit', '79': 'soixante-dix-neuf', '80': 'quatre-vingts',
      '81': 'quatre-vingt-un', '82': 'quatre-vingt-deux', '83': 'quatre-vingt-trois', '84': 'quatre-vingt-quatre', '85': 'quatre-vingt-cinq',
      '86': 'quatre-vingt-six', '87': 'quatre-vingt-sept', '88': 'quatre-vingt-huit', '89': 'quatre-vingt-neuf', '90': 'quatre-vingt-dix',
      '91': 'quatre-vingt-onze', '92': 'quatre-vingt-douze', '93': 'quatre-vingt-treize', '94': 'quatre-vingt-quatorze', '95': 'quatre-vingt-quinze',
      '96': 'quatre-vingt-seize', '97': 'quatre-vingt-dix-sept', '98': 'quatre-vingt-dix-huit', '99': 'quatre-vingt-dix-neuf', '100': 'cent'
    };
    return numbers[num] || num;
  };

  // Fonction pour créer la visualisation d'un nombre
  const createNumberVisualization = (num: string) => {
    const number = parseInt(num);
    const dizaines = Math.floor(number / 10);
    const unites = number % 10;
    
    const dizainesBoxes = '📦'.repeat(dizaines);
    const unitesCircles = '🔴'.repeat(unites);
    
    return {
      dizaines,
      unites,
      dizainesBoxes,
      unitesCircles,
      full: `${dizainesBoxes}${unitesCircles}`
    };
  };

  // Fonction pour énoncer l'explication d'un nombre avec animation
  const speakNumberExplanation = (num: string) => {
    const number = parseInt(num);
    const dizaines = Math.floor(number / 10);
    const unites = number % 10;
    
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Étape 0 -> 1 : Montrer les dizaines + audio
    setTimeout(() => {
      setAnimationStep(1);
      if (dizaines > 0) {
        speakText(`${dizaines} dizaine${dizaines > 1 ? 's' : ''}`);
      }
    }, 500);
    
    // Étape 1 -> 2 : Montrer les unités + audio
    setTimeout(() => {
      setAnimationStep(2);
      if (unites > 0) {
        speakText(`${unites} unité${unites > 1 ? 's' : ''}`);
      }
    }, 2500);
    
    // Étape 2 -> 3 : Explication complète + audio
    setTimeout(() => {
      setAnimationStep(3);
      const wordForm = numberToWords(num);
      let explanation = '';
      if (dizaines > 0 && unites > 0) {
        explanation = `${dizaines} et ${unites} se dit ${wordForm}`;
      } else if (dizaines > 0) {
        explanation = `${dizaines} et 0 se dit ${wordForm}`;
      } else {
        explanation = `0 et ${unites} se dit ${wordForm}`;
      }
      speakText(explanation);
    }, 4500);
    
    // Fin de l'animation
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationStep(0);
    }, 7500);
  };

  // Fonction pour faire défiler vers le bouton Suivant
  const scrollToNextButton = () => {
    setTimeout(() => {
      const nextButton = document.getElementById('next-exercise-button');
      if (nextButton) {
        nextButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 500);
  };

  // Fonction pour célébrer une bonne réponse
  const celebrateCorrectAnswer = async () => {
    setIsPlayingVocal(true);
    await playAudio('Bravo ! C\'est la bonne réponse !');
    
    // Mettre en évidence le bouton Suivant
    setHighlightedElement('next-exercise-button');
    
    // Faire défiler vers le bouton Suivant
    scrollToNextButton();
    
    await playAudio('Tu peux appuyer sur suivant');
    
    setIsPlayingVocal(false);
  };

  // Explication détaillée pour les réponses incorrectes
  const explainWrongAnswer = async () => {
    setIsExplainingError(true);
    setIsPlayingVocal(true);
    
    const exercise = exercises[currentExercise];
    
    await playAudio('Ce n\'est pas la bonne réponse. Regardons ensemble !');
    
    if (exercise.type === 'lecture') {
      await playAudio(`Le nombre ${exercise.display} se dit ${exercise.correctAnswer}.`);
    } else {
      await playAudio(`${exercise.display} s'écrit ${exercise.correctAnswer}.`);
    }
    
    await playAudio(`La bonne réponse est ${exercise.correctAnswer} !`);
    
    // Mettre en évidence le bouton Suivant
    setHighlightedElement('next-exercise-button');
    
    // Faire défiler vers le bouton Suivant
    scrollToNextButton();
    
    await playAudio('Tu peux appuyer sur suivant');
    
    setIsExplainingError(false);
    setIsPlayingVocal(false);
  };

  // Validation flexible des réponses (chiffres et lettres)
  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;
    
    const userAnswerCleaned = userAnswer.trim().toLowerCase();
    const correctAnswer = exercises[currentExercise].correctAnswer;
    
    // Mapping des nombres en mots français pour validation flexible
    const numberWords: { [key: string]: string[] } = {
      '21': ['21', 'vingt-et-un', 'vingt et un', 'vingt-un'],
      '22': ['22', 'vingt-deux', 'vingt deux'],
      '23': ['23', 'vingt-trois', 'vingt trois'],
      '30': ['30', 'trente'],
      '34': ['34', 'trente-quatre', 'trente quatre'],
      '37': ['37', 'trente-sept', 'trente sept'],
      '42': ['42', 'quarante-deux', 'quarante deux'],
      '58': ['58', 'cinquante-huit', 'cinquante huit'],
      '63': ['63', 'soixante-trois', 'soixante trois'],
      '70': ['70', 'soixante-dix'],
      '75': ['75', 'soixante-quinze'],
      '80': ['80', 'quatre-vingts', 'quatre vingts'],
      '92': ['92', 'quatre-vingt-douze', 'quatre vingt douze'],
      '96': ['96', 'quatre-vingt-seize', 'quatre vingt seize'],
      '100': ['100', 'cent']
    };
    
    // Vérifier si la réponse est correcte
    let correct = userAnswerCleaned === correctAnswer.toLowerCase();
    if (numberWords[correctAnswer]) {
      correct = numberWords[correctAnswer].includes(userAnswerCleaned);
    }
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    if (correct) {
      await celebrateCorrectAnswer();
    } else {
      await explainWrongAnswer();
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setHighlightDigit(null);
      setIsExplainingError(false);
      setIsPlayingVocal(false);
      setHighlightedElement(null); // Réinitialiser l'élément en évidence
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations(); // Arrêter tous les audios avant reset
    
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setHighlightDigit(null);
    setIsExplainingError(false);
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setExerciseStarted(false);
    setImageError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setSamSizeExpanded(false);
    stopSignalRef.current = false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Animation CSS personnalisée pour les icônes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes subtle-glow {
            0%, 100% {
              opacity: 0.8;
              transform: scale(1);
              filter: brightness(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
              filter: brightness(1.1);
            }
          }
        `
      }} />
      
      {/* Bouton flottant de Sam - visible uniquement quand Sam parle */}
      {isPlayingVocal && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title="Arrêter Sam"
          >
            {/* Image de Sam */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src="/image/pirate-small.png"
                alt="Sam le Pirate"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Texte et icône */}
            <>
              <span className="text-sm font-bold hidden sm:block">Stop</span>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
            </>
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className={showExercises ? 'mb-4 sm:mb-6' : 'mb-8'}>
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg text-center" style={{
            padding: showExercises ? 'clamp(0.5rem, 2vw, 1rem) clamp(0.5rem, 2vw, 1rem)' : '1.5rem'
          }}>
            <h1 className={`font-bold text-gray-900 ${
              showExercises 
                ? 'text-lg sm:text-2xl lg:text-3xl mb-1 sm:mb-2' 
                : 'text-4xl mb-4'
            }`}>
              ✏️ Lire et écrire jusqu'à 100
            </h1>
            {!showExercises && (
            <p className="text-lg text-gray-600">
              Apprends à lire et écrire tous les nombres de 21 à 100 en chiffres et en lettres !
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
                  ? 'bg-purple-500 text-white shadow-md' 
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
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[48px] sm:min-h-[68px] flex items-center justify-center gap-2 ${
                showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs sm:text-sm opacity-90">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-2 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-purple-300 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 ${
                isPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-12 sm:w-20 h-12 sm:h-20' // Initial - plus petit sur mobile
                }`}>
                  <img 
                    src="/image/pirate-small.png" 
                    alt="Sam le Pirate" 
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
                
              {/* Bouton Démarrer */}
              <div className="text-center">
                <button
                onClick={explainChapter}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-12 py-2 sm:py-6 rounded-xl font-bold text-sm sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                }`}
              >
                  <Play className="inline w-4 h-4 sm:w-8 sm:h-8 mr-1 sm:mr-4" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
                </div>
              </div>

            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🎯 Choisis un nombre à découvrir
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {numbersWithWriting.map((num) => (
                  <button
                    key={num.chiffre}
                    onClick={() => setSelectedNumber(num.chiffre)}
                    className={`p-2 sm:p-3 rounded-lg font-bold text-base sm:text-lg transition-all ${
                      selectedNumber === num.chiffre
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                    }`}
                  >
                    {num.chiffre}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div className="bg-white rounded-xl p-3 sm:p-8 shadow-lg text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h3 className="text-base sm:text-2xl font-bold text-gray-900">
                  🔍 Découvrons le nombre {selectedNumber}
                </h3>
              </div>
              
              {(() => {
                const selected = numbersWithWriting.find(n => n.chiffre === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Écriture en chiffres */}
                    <div className="bg-purple-50 rounded-lg p-3 sm:p-6">
                      <h4 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-purple-800">
                        🔢 {selected.chiffre} s'écrit :
                      </h4>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 tracking-wide">
                          {selected.visual}
                        </div>
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                          {selected.chiffre} = {selected.lettres}
                        </p>
                      </div>
                    </div>

                    {/* Représentation visuelle animée */}
                    <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 text-yellow-800 text-center">
                        👀 Avec des paquets et des objets :
                      </h3>
                      
                      {(() => {
                        const visualization = createNumberVisualization(selected.chiffre);
                        
                        return (
                          <div className="space-y-4">
                            {/* Zone d'animation */}
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                              <div className="grid md:grid-cols-3 gap-4 items-center min-h-[100px]">
                                {/* Dizaines */}
                                {visualization.dizaines > 0 && (
                                  <div className={`text-center transition-all duration-1000 ${
                                    !isAnimating || animationStep >= 1 
                                      ? 'opacity-100 transform scale-100' 
                                      : 'opacity-0 transform scale-50'
                                  }`}>
                                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2">
                                      {(!isAnimating || animationStep >= 1) ? visualization.dizainesBoxes : ''}
                                    </div>
                                    <div className={`text-sm sm:text-base font-semibold text-blue-600 transition-all duration-500 ${
                                      !isAnimating || animationStep >= 1 ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                      {visualization.dizaines} dizaine{visualization.dizaines > 1 ? 's' : ''}
                                    </div>
                                    <div className={`text-xs sm:text-sm text-gray-600 transition-all duration-500 ${
                                      !isAnimating || animationStep >= 1 ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                      = {visualization.dizaines * 10}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Plus */}
                                {visualization.dizaines > 0 && visualization.unites > 0 && (
                                  <div className={`text-center transition-all duration-500 ${
                                    !isAnimating || animationStep >= 2 
                                      ? 'opacity-100' 
                                      : 'opacity-0'
                                  }`}>
                                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">+</div>
                                  </div>
                                )}
                                
                                {/* Unités */}
                                {visualization.unites > 0 && (
                                  <div className={`text-center transition-all duration-1000 ${
                                    !isAnimating || animationStep >= 2 
                                      ? 'opacity-100 transform scale-100' 
                                      : 'opacity-0 transform scale-50'
                                  }`}>
                                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2">
                                      {(!isAnimating || animationStep >= 2) ? visualization.unitesCircles : ''}
                                    </div>
                                    <div className={`text-sm sm:text-base font-semibold text-red-600 transition-all duration-500 ${
                                      !isAnimating || animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                      {visualization.unites} unité{visualization.unites > 1 ? 's' : ''}
                                    </div>
                                    <div className={`text-xs sm:text-sm text-gray-600 transition-all duration-500 ${
                                      !isAnimating || animationStep >= 2 ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                      = {visualization.unites}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Résultat final */}
                              <div className={`text-center mt-4 pt-4 border-t-2 border-gray-200 transition-all duration-1000 ${
                                !isAnimating || animationStep >= 3 
                                  ? 'opacity-100 transform translate-y-0' 
                                  : 'opacity-0 transform translate-y-4'
                              }`}>
                                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                  = {selected.chiffre} = {selected.lettres}
                                </div>
                              </div>
                            </div>

                            {/* Bouton pour déclencher l'animation */}
                            <div className="text-center">
                              <button 
                                onClick={() => speakNumberExplanation(selected.chiffre)}
                                disabled={isAnimating}
                                className={`bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg transform hover:scale-105 inline-flex items-center space-x-2 sm:space-x-3 ${
                                  isAnimating ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>{isAnimating ? 'Animation en cours...' : 'Voir l\'animation'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Prononciation */}
                    <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 text-center">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-green-800">
                        🗣️ Comment on le dit :
                      </h3>
                      <button
                        onClick={() => speakText(selected.pronunciation)}
                        className="bg-green-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg lg:text-xl hover:bg-green-600 transition-colors"
                      >
                        <Volume2 className="inline w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                        {selected.pronunciation}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Nombres spéciaux */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-xl font-bold text-gray-900">🔥 Nombres spéciaux à retenir</h3>
                {/* Icône d'animation pour les nombres spéciaux */}
                <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-red-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-red-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🔥 Animation des nombres spéciaux ! Cliquez pour les entendre."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      setIsPlayingVocal(true);
                      setSamSizeExpanded(true);
                      
                      try {
                        await playAudio("Voici les nombres spéciaux qu'il faut vraiment retenir !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("70 se dit soixante-dix, c'est 60 plus 10 !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1200));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("80 se dit quatre-vingts, avec un s !");
                        if (stopSignalRef.current) return;
                        
                        await new Promise(resolve => setTimeout(resolve, 1200));
                        if (stopSignalRef.current) return;
                        
                        await playAudio("Et 90 se dit quatre-vingt-dix, sans s cette fois !");
                        if (stopSignalRef.current) return;
                        
                      } catch (error) {
                        console.error('Erreur:', error);
                      } finally {
                        setIsPlayingVocal(false);
                        setSamSizeExpanded(false);
                      }
                    }
                  }}
                >
                  🔥
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-red-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">70</div>
                  <p className="font-bold text-red-800">soixante-dix</p>
                  <p className="text-sm text-red-700">60 + 10</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">80</div>
                  <p className="font-bold text-blue-800">quatre-vingts</p>
                  <p className="text-sm text-blue-700">4 × 20</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">90</div>
                  <p className="font-bold text-green-800">quatre-vingt-dix</p>
                  <p className="text-sm text-green-700">80 + 10</p>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-3 sm:p-6 text-white">
              <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• Les dizaines : vingt, trente, quarante, cinquante, soixante</li>
                <li>• 70 = soixante-dix (attention !)</li>
                <li>• 80 = quatre-vingts (avec un "s")</li>
                <li>• 90 = quatre-vingt-dix (sans "s")</li>
                <li>• 100 = cent (tout simple !)</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ */
          <div className="pb-20 sm:pb-0">
            {/* Introduction de Sam le Pirate - toujours visible */}
            <div className="mb-6 sm:mb-4">
              {SamPirateIntroJSX()}
            </div>
            {/* Header exercices - caché sur mobile */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-8 hidden sm:block">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
                </h2>
                
                <div className="text-sm font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              </div>
              
            {/* Indicateur de progression mobile - sticky sur la page */}
            <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b border-gray-200 sm:hidden mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                <span className="font-bold text-purple-600">Score : {score}/{exercises.length}</span>
                </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question - AVEC BOUTON ÉCOUTER */}
            <div className="bg-white rounded-xl shadow-lg text-center p-4 sm:p-6 md:p-8 mt-6 sm:mt-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 sm:mb-6 md:mb-8 gap-4">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Question..."}
              </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage du nombre ou expression avec correction intégrée */}
              <div className={`bg-white border-2 rounded-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-500 ${
                isCorrect === true ? 'border-green-400 bg-green-50' :
                isCorrect === false ? 'border-red-400 bg-red-50' :
                isExplainingError ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-300' : 'border-purple-200'
              }`}>
                <div className="py-4 sm:py-6 md:py-8">
                  <div className="flex items-center justify-center mb-4">
                    {exercises[currentExercise]?.type === 'lecture' ? (
                      <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-3" />
                    ) : (
                      <Edit className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-3" />
                    )}
                    <span className="text-lg sm:text-xl font-semibold text-gray-700">
                      {exercises[currentExercise]?.type === 'lecture' ? 'Je lis :' : 'J\'écris :'}
                    </span>
                  </div>
                  
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4">
                    {exercises[currentExercise]?.display}
                  </div>

                  {/* Correction intégrée - Bonne réponse */}
                  {isCorrect !== null && isCorrect && (
                    <div className="mt-6 p-4 sm:p-8 lg:p-12 bg-green-100 rounded-lg border-2 border-green-300">
                      <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                        <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-600" />
                        <span className="font-bold text-lg sm:text-2xl lg:text-3xl text-green-800">
                          Bravo ! C'est bien {exercises[currentExercise]?.correctAnswer} !
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Correction intégrée - Mauvaise réponse */}
                  {isCorrect !== null && !isCorrect && (
                    <div className="mt-6 space-y-4 sm:space-y-6">
                      <div className="p-4 sm:p-8 lg:p-12 bg-red-100 rounded-lg border-2 border-red-300">
                        <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                          <XCircle className="w-6 h-6 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-600" />
                          <span className="font-bold text-lg sm:text-2xl lg:text-3xl text-red-800">
                            Ce n'est pas la bonne réponse
                          </span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 sm:p-6 lg:p-8 mb-3 sm:mb-4">
                          <div className="text-center">
                            <div className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-800">
                              {exercises[currentExercise]?.display}
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-6 lg:p-8 mb-3 sm:mb-4">
                              <div className="text-sm sm:text-lg lg:text-xl font-bold text-blue-800 mb-2 sm:mb-3">
                                💡 Explication :
                              </div>
                              <div className="text-sm sm:text-lg lg:text-xl text-blue-700">
                                {exercises[currentExercise]?.type === 'lecture' 
                                  ? `Le nombre ${exercises[currentExercise]?.display} se dit "${exercises[currentExercise]?.correctAnswer}"`
                                  : `${exercises[currentExercise]?.display} s'écrit "${exercises[currentExercise]?.correctAnswer}"`
                                }
                              </div>
                            </div>
                            
                            <div className="bg-orange-100 rounded-lg p-3 sm:p-6 lg:p-8">
                              <div className="font-bold text-sm sm:text-lg lg:text-xl text-orange-800">
                                ✅ La bonne réponse est : {exercises[currentExercise]?.correctAnswer}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Zone de saisie de réponse */}
              <div className="mb-8 sm:mb-12">
                <div className="flex flex-col items-center space-y-6">
                  <label className="text-lg sm:text-xl font-bold text-gray-700 text-center">
                    ✏️ Écris ta réponse :
                  </label>
                  
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAnswerSubmit();
                      }
                    }}
                    placeholder="Ta réponse..."
                    className={`text-center text-xl sm:text-2xl font-bold border-2 rounded-lg px-6 py-4 w-full max-w-md transition-all ${
                      highlightedElement === 'answer-input' ? 'ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-4 scale-110 shadow-2xl animate-pulse' : ''
                    } ${
                      isCorrect === true ? 'border-green-500 bg-green-50 text-green-800' :
                      isCorrect === false ? 'border-red-500 bg-red-50 text-red-800' :
                      'border-gray-300 bg-white text-black focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                    }`}
                    disabled={isCorrect !== null || isPlayingVocal}
                    id="answer-input"
                    maxLength={50}
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>
                    
              {/* Boutons Valider et Suivant */}
              <div className="flex gap-4 justify-center mt-8 mb-8">
                  <button
                  id="validate-button"
                  onClick={() => handleAnswerSubmit()}
                  disabled={!userAnswer.trim() || isCorrect !== null || isPlayingVocal}
                  className={`bg-green-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'validate-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                  }`}
                >
                  Valider
                  </button>

                  <button
                  id="next-exercise-button"
                    onClick={nextExercise}
                  disabled={isCorrect === null || isPlayingVocal}
                  className={`bg-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'next-exercise-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                  } ${
                    isCorrect !== null ? 'opacity-100' : 'opacity-50'
                  }`}
                  >
                    Suivant →
                  </button>
              </div>
              

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
                  if (percentage >= 90) return { title: "🎉 Excellent petit mathématicien !", message: "Tu lis et écris parfaitement jusqu'à 100 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien en lecture-écriture !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue à t'entraîner avec les grands nombres !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Les nombres jusqu'à 100, ça s'apprend petit à petit !", emoji: "📚" };
                };
                const result = getMessage();

                return (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                      {result.title}
                    </h2>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <p className="text-lg sm:text-xl text-gray-700 mb-6">
                      {result.message}
                    </p>
                    <div className="bg-purple-50 rounded-xl p-4 mb-6">
                      <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">
                        {finalScore} / {exercises.length}
                      </div>
                      <div className="text-lg text-purple-700">
                        {percentage}% de réussite
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          resetAll();
                        }}
                        className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors"
                      >
                        🔄 Recommencer
                      </button>
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          setShowExercises(false);
                        }}
                        className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors"
                      >
                        📖 Retour cours
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
