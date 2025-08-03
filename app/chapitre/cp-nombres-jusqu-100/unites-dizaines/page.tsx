'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Package, Dot, Play } from 'lucide-react';

// Styles CSS pour les animations personnalisées
const styles = `
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-100px) scale(0.8); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
  }
  
  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(100px) scale(0.8); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
  }
  
  @keyframes bounceIn {
    0% { 
      opacity: 0; 
      transform: scale(0.3) translateY(-50px); 
    }
    50% { 
      opacity: 1; 
      transform: scale(1.1) translateY(-10px); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
  
  @keyframes glow {
    0%, 100% { 
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); 
    }
    50% { 
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); 
    }
  }
  
  @keyframes wiggle {
    0%, 7%, 14%, 21%, 28%, 35%, 42%, 49%, 56%, 63%, 70%, 77%, 84%, 91%, 98%, 100% {
      transform: translateX(0);
    }
    3.5%, 10.5%, 17.5%, 24.5%, 31.5%, 38.5%, 45.5%, 52.5%, 59.5%, 66.5%, 73.5%, 80.5%, 87.5%, 94.5% {
      transform: translateX(-3px);
    }
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 1s ease-out;
  }
  
  .animate-slide-in-right {
    animation: slideInRight 1s ease-out 0.3s both;
  }
  
  .animate-bounce-in {
    animation: bounceIn 1.2s ease-out 0.6s both;
  }
  
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
  
  .animate-wiggle {
    animation: wiggle 0.8s ease-in-out;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out 0.9s both;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes highlightCell {
    0%, 100% { 
      background-color: rgba(252, 211, 77, 0.3); 
    }
    50% { 
      background-color: rgba(252, 211, 77, 0.8); 
    }
  }
  
  .animate-highlight {
    animation: highlightCell 1.5s ease-in-out infinite;
  }
  
  @keyframes extremeHighlight {
    0% { 
      transform: scale(1.2);
      background-color: #fbbf24 !important;
      box-shadow: 0 0 15px #fbbf24;
    }
    25% { 
      transform: scale(1.5);
      background-color: #f59e0b !important;
      box-shadow: 0 0 20px #f59e0b;
    }
    50% { 
      transform: scale(1.8);
      background-color: #ef4444 !important;
      box-shadow: 0 0 25px #ef4444;
    }
    75% { 
      transform: scale(1.5);
      background-color: #f59e0b !important;
      box-shadow: 0 0 20px #f59e0b;
    }
    100% { 
      transform: scale(1.2);
      background-color: #fbbf24 !important;
      box-shadow: 0 0 15px #fbbf24;
    }
  }
  
  .animate-extreme-highlight {
    animation: extremeHighlight 3s ease-in-out infinite;
    z-index: 1000 !important;
    position: relative;
    overflow: visible;
  }
`;

export default function UnitesDizainesCP() {
  const [selectedNumber, setSelectedNumber] = useState('34');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
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
  const [highlightPositionButton, setHighlightPositionButton] = useState(false);
  const [highlightExploreButton, setHighlightExploreButton] = useState(false);
  const [highlightExerciseTab, setHighlightExerciseTab] = useState(false);
  const [highlightedNumbers, setHighlightedNumbers] = useState<string[]>([]);
  const [animatingDigit, setAnimatingDigit] = useState<'left' | 'right' | 'both' | null>(null);
  const [showVisualGroups, setShowVisualGroups] = useState(false);
  const [highlightTableCell, setHighlightTableCell] = useState<'dizaines' | 'unites' | null>(null);
  const [slideInNumber, setSlideInNumber] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showNumber, setShowNumber] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [showVisualExplanation, setShowVisualExplanation] = useState(true);
  const [showFinalSum, setShowFinalSum] = useState(true);
  // États pour l'animation progressive de l'exploration des nombres
  const [showAnalysisTitle, setShowAnalysisTitle] = useState(true);
  const [showSelectedNumber, setShowSelectedNumber] = useState(true);
  const [showDecomposition, setShowDecomposition] = useState(true);
  const [showDizaines, setShowDizaines] = useState(true);
  const [showUnites, setShowUnites] = useState(true);
  const [showFinalCalculation, setShowFinalCalculation] = useState(true);
  
  const stopSignalRef = useRef(false);

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
    setSamSizeExpanded(false);
    setHighlightPositionButton(false);
    setHighlightExploreButton(false);
    setHighlightExerciseTab(false);
    setHighlightedNumbers([]);
    setAnimatingDigit(null);
    setShowVisualGroups(false);
    setHighlightTableCell(null);
    setSlideInNumber(false);
    setShowTitle(true);
    setShowNumber(true);
    setShowTable(true);
    setShowVisualExplanation(true);
    setShowFinalSum(true);
    setShowAnalysisTitle(true);
    setShowSelectedNumber(true);
    setShowDecomposition(true);
    setShowDizaines(true);
    setShowUnites(true);
    setShowFinalCalculation(true);
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

  // Fonction pour lire l'énoncé de l'exercice - LECTURE SIMPLE DE LA QUESTION
  const startExerciseExplanation = async () => {
    if (isExplainingError || !exercises[currentExercise]) return;
    
    setIsPlayingVocal(true);
    setExerciseStarted(true);
    
    try {
      // Lire seulement l'énoncé de l'exercice
      await playAudio(exercises[currentExercise].question);
    } catch (error) {
      console.error('Erreur dans startExerciseExplanation:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // JSX pour le bouton "Écouter l'énoncé"
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

  // Fonction pour scroller vers une section
  const scrollToSection = (elementId: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest' 
        });
      }
    }, 300);
  };

  // Fonction pour expliquer le chapitre dans le cours avec interactions
  const explainChapter = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await new Promise(resolve => setTimeout(resolve, 300));
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    try {
      // Introduction de base
      await playAudio("Ahoy ! Aujourd'hui, nous allons apprendre les unités et les dizaines !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      // Explication principale
      await playAudio("Tu pourras comprendre et voir comment on trouve les unités et les dizaines dans un nombre !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;
      
      // 1. Section "La place des chiffres est importante !"
      setHighlightPositionButton(true);
      scrollToSection('position-section');
      await playAudio("Vois-tu ce bouton rond qui brille ? Clique dessus pour découvrir pourquoi la place des chiffres est si importante !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (stopSignalRef.current) return;
      setHighlightPositionButton(false);
      
      // 2. Section "Explore un nombre"
      setHighlightExploreButton(true);
      scrollToSection('explore-section');
      await playAudio("Mille sabords ! Ici tu peux explorer des exemples avec plein de nombres différents !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;
      
      // 3. Animation des chiffres cliquables un par un
      const numbers = ['23', '34', '56', '89'];
      await playAudio("Chacun de ces nombres est cliquable ! Observe comme ils brillent :");
      if (stopSignalRef.current) return;
      
      for (let i = 0; i < numbers.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (stopSignalRef.current) return;
        
        setHighlightedNumbers(prev => [...prev, numbers[i]]);
        await playAudio(`Voilà le nombre ${numbers[i]} !`);
        if (stopSignalRef.current) return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHighlightedNumbers([]);
      setHighlightExploreButton(false);
      
      // 4. Section Exercices
      setHighlightExerciseTab(true);
      scrollToSection('exercise-tab');
      await playAudio("Par ma barbe ! Si tu veux t'entraîner, clique sur l'onglet Exercices !");
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (stopSignalRef.current) return;
      setHighlightExerciseTab(false);
      
      await playAudio("Voilà ! Tu es maintenant prêt à explorer, nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightPositionButton(false);
      setHighlightExploreButton(false);
      setHighlightExerciseTab(false);
      setHighlightedNumbers([]);
    }
  };

  // Fonction pour expliquer les positions avec animations progressives
  const explainPositions = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await new Promise(resolve => setTimeout(resolve, 300));
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    // EFFACER TOUT au début de l'animation
    setShowTitle(false);
    setShowNumber(false);
    setShowTable(false);
    setShowVisualExplanation(false);
    setShowFinalSum(false);
    
    try {
      scrollToSection('position-section');
      
      // 1. Introduction et apparition du titre
      await playAudio("Regardons bien comment fonctionne le nombre 34 !");
      if (stopSignalRef.current) return;
      
      setShowTitle(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      if (stopSignalRef.current) return;
      
      // 2. Apparition du nombre 34
      await playAudio("Voici notre nombre mystérieux : 34 !");
      if (stopSignalRef.current) return;
      
      setShowNumber(true);
      setSlideInNumber(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (stopSignalRef.current) return;
      
      // 3. Apparition du tableau et highlight du chiffre 3 (dizaines)
      await playAudio("Le chiffre 3 est à gauche, c'est la position des dizaines !");
      if (stopSignalRef.current) return;
      
      setShowTable(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnimatingDigit('left');
      setHighlightTableCell('dizaines');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (stopSignalRef.current) return;
      
      // 4. Highlight du chiffre 4 (unités)
      await playAudio("Le chiffre 4 est à droite, c'est la position des unités !");
      if (stopSignalRef.current) return;
      
      setAnimatingDigit('right');
      setHighlightTableCell('unites');
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (stopSignalRef.current) return;
      
      // 5. Apparition de l'explication visuelle
      await playAudio("Regardons ce que cela signifie en objets !");
      if (stopSignalRef.current) return;
      
      setShowVisualExplanation(true);
      setAnimatingDigit('both');
      setShowVisualGroups(true);
      setHighlightTableCell(null);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;
      
      // 6. Apparition de la somme finale
      await playAudio("Donc nous avons 3 paquets de 10 plus 4 objets seuls, nom d'un tonnerre !");
      if (stopSignalRef.current) return;
      
      setShowFinalSum(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (stopSignalRef.current) return;
      
      // 7. Conclusion
      await playAudio("Voilà comment la position change la valeur du chiffre !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainPositions:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setAnimatingDigit(null);
      setShowVisualGroups(false);
      setHighlightTableCell(null);
      setSlideInNumber(false);
      // Remettre tout visible à la fin
      setShowTitle(true);
      setShowNumber(true);
      setShowTable(true);
      setShowVisualExplanation(true);
      setShowFinalSum(true);
    }
  };

  // Fonction pour expliquer le nombre sélectionné avec animation progressive
  const explainSelectedNumber = async (numberToExplain = selectedNumber) => {
    if (isPlayingVocal) return;
    
    const selected = numbersDecomposition.find(n => n.number === numberToExplain);
    if (!selected) return;
    
    stopAllVocalsAndAnimations();
    await new Promise(resolve => setTimeout(resolve, 300));
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setSamSizeExpanded(true);
    
    // EFFACER TOUT au début de l'animation
    setShowAnalysisTitle(false);
    setShowSelectedNumber(false);
    setShowDecomposition(false);
    setShowDizaines(false);
    setShowUnites(false);
    setShowFinalCalculation(false);
    
    try {
      // Scroller vers la section d'analyse
      scrollToSection('analyse-section');
      
      // 1. Introduction et apparition du titre
      await playAudio(`Analysons ensemble le nombre ${selected.number} !`);
      if (stopSignalRef.current) return;
      
      setShowAnalysisTitle(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      if (stopSignalRef.current) return;
      
      // 2. Apparition du nombre principal
      await playAudio(`Voici notre nombre : ${selected.number} !`);
      if (stopSignalRef.current) return;
      
      setShowSelectedNumber(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      // 3. Apparition de la décomposition visuelle
      await playAudio(`Regardons comment il se décompose !`);
      if (stopSignalRef.current) return;
      
      setShowDecomposition(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (stopSignalRef.current) return;
      
      // 4. Explication des dizaines
      await playAudio(`Il y a ${selected.dizaines} dizaines, soit ${selected.dizaines} paquets de 10 !`);
      if (stopSignalRef.current) return;
      
      setShowDizaines(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;
      
      // 5. Explication des unités
      await playAudio(`Et il y a ${selected.unites} unités, soit ${selected.unites} objets seuls !`);
      if (stopSignalRef.current) return;
      
      setShowUnites(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;
      
      // 6. Calcul final
      await playAudio(`Au total : ${selected.dizaines * 10} plus ${selected.unites} égale ${selected.number} ! Magnifique !`);
      if (stopSignalRef.current) return;
      
      setShowFinalCalculation(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainSelectedNumber:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      // Remettre tout visible à la fin
      setShowAnalysisTitle(true);
      setShowSelectedNumber(true);
      setShowDecomposition(true);
      setShowDizaines(true);
      setShowUnites(true);
      setShowFinalCalculation(true);
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
      await playAudio("Bonjour matelot ! Je vais t'aider avec les unités et les dizaines, nom d'une jambe en bois !");
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

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'unites-dizaines',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'unites-dizaines');
      
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

  // Nombres avec décomposition unités/dizaines
  const numbersDecomposition = [
    { number: '23', dizaines: 2, unites: 3, visual: '📦📦 🔴🔴🔴', explanation: '2 paquets de 10 + 3 unités' },
    { number: '34', dizaines: 3, unites: 4, visual: '📦📦📦 🔴🔴🔴🔴', explanation: '3 paquets de 10 + 4 unités' },
    { number: '56', dizaines: 5, unites: 6, visual: '📦📦📦📦📦 🔴🔴🔴🔴🔴🔴', explanation: '5 paquets de 10 + 6 unités' },
    { number: '89', dizaines: 8, unites: 9, visual: '📦📦📦📦📦📦📦📦 🔴🔴🔴🔴🔴🔴🔴🔴🔴', explanation: '8 paquets de 10 + 9 unités' }
  ];

  // Exercices sur la valeur positionnelle - format input text
  const exercises = [
    { question: 'Dans 34, combien y a-t-il de dizaines ?', number: '34', type: 'dizaines', correctAnswer: '3' },
    { question: 'Dans 47, combien y a-t-il d\'unités ?', number: '47', type: 'unites', correctAnswer: '7' },
    { question: 'Dans 56, combien y a-t-il de dizaines ?', number: '56', type: 'dizaines', correctAnswer: '5' },
    { question: 'Dans 23, combien y a-t-il d\'unités ?', number: '23', type: 'unites', correctAnswer: '3' },
    { question: 'Combien de dizaines dans 72 ?', number: '72', type: 'dizaines', correctAnswer: '7' },
    { question: 'Combien d\'unités dans 89 ?', number: '89', type: 'unites', correctAnswer: '9' },
    { question: 'Dans 65, le chiffre des dizaines est ?', number: '65', type: 'dizaines', correctAnswer: '6' },
    { question: 'Dans 91, le chiffre des unités est ?', number: '91', type: 'unites', correctAnswer: '1' },
    
    // Exercices de composition
    { question: '4 dizaines + 7 unités = ?', display: '4 📦 + 7 🔴', correctAnswer: '47' },
    { question: '6 dizaines + 2 unités = ?', display: '6 📦 + 2 🔴', correctAnswer: '62' },
    { question: '3 dizaines + 8 unités = ?', display: '3 📦 + 8 🔴', correctAnswer: '38' },
    { question: '7 dizaines + 5 unités = ?', display: '7 📦 + 5 🔴', correctAnswer: '75' },
    { question: '2 dizaines + 9 unités = ?', display: '2 📦 + 9 🔴', correctAnswer: '29' },
    { question: '8 dizaines + 1 unité = ?', display: '8 📦 + 1 🔴', correctAnswer: '81' },
    { question: '5 dizaines + 4 unités = ?', display: '5 📦 + 4 🔴', correctAnswer: '54' }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string): string => {
    const numbers: { [key: string]: string } = {
      '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre', '5': 'cinq',
      '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf', '10': 'dix',
      '20': 'vingt', '30': 'trente', '40': 'quarante', '50': 'cinquante',
      '60': 'soixante', '70': 'soixante-dix', '80': 'quatre-vingts', '90': 'quatre-vingt-dix'
    };
    return numbers[num] || num;
  };

  // Fonction pour énoncer l'explication selon le type d'exercice
  const speakExplanation = (exercise: any) => {
    const number = exercise.number || exercise.display?.replace(/[^0-9]/g, '');
    if (!number) return;
    
    const dizaines = Math.floor(parseInt(number) / 10);
    const unites = parseInt(number) % 10;
    
    if (exercise.type === 'dizaines') {
      const text = `Dans ${number}, la dizaine est ${dizaines}. ${numberToWords(dizaines.toString())} dizaines égale ${dizaines * 10}`;
      speakText(text);
    } else if (exercise.type === 'unites') {
      const text = `Dans ${number}, l'unité est ${unites}. ${numberToWords(unites.toString())} unités égale ${unites}`;
      speakText(text);
    } else if (exercise.display) {
      // Pour les exercices de composition
      const text = `${numberToWords(dizaines.toString())} dizaines plus ${numberToWords(unites.toString())} unités égale ${number}`;
      speakText(text);
    }
  };

  // Validation flexible des réponses (chiffres et lettres)
  const handleAnswerSubmit = async () => {
    if (!userAnswer.trim()) return;
    
    const userAnswerCleaned = userAnswer.trim().toLowerCase();
    const correctAnswer = exercises[currentExercise].correctAnswer;
    
    // Mapping des nombres en mots français
    const numberWords: { [key: string]: string[] } = {
      '1': ['1', 'un', 'une'],
      '2': ['2', 'deux'],
      '3': ['3', 'trois'],
      '4': ['4', 'quatre'],
      '5': ['5', 'cinq'],
      '6': ['6', 'six'],
      '7': ['7', 'sept'],
      '8': ['8', 'huit'],
      '9': ['9', 'neuf'],
      '10': ['10', 'dix'],
      '20': ['20', 'vingt'],
      '21': ['21', 'vingt-et-un', 'vingt et un'],
      '22': ['22', 'vingt-deux', 'vingt deux'],
      '23': ['23', 'vingt-trois', 'vingt trois'],
      '24': ['24', 'vingt-quatre', 'vingt quatre'],
      '25': ['25', 'vingt-cinq', 'vingt cinq'],
      '26': ['26', 'vingt-six', 'vingt six'],
      '27': ['27', 'vingt-sept', 'vingt sept'],
      '28': ['28', 'vingt-huit', 'vingt huit'],
      '29': ['29', 'vingt-neuf', 'vingt neuf'],
      '30': ['30', 'trente'],
      '31': ['31', 'trente-et-un', 'trente et un'],
      '32': ['32', 'trente-deux', 'trente deux'],
      '33': ['33', 'trente-trois', 'trente trois'],
      '34': ['34', 'trente-quatre', 'trente quatre'],
      '35': ['35', 'trente-cinq', 'trente cinq'],
      '36': ['36', 'trente-six', 'trente six'],
      '37': ['37', 'trente-sept', 'trente sept'],
      '38': ['38', 'trente-huit', 'trente huit'],
      '39': ['39', 'trente-neuf', 'trente neuf'],
      '40': ['40', 'quarante'],
      '41': ['41', 'quarante-et-un', 'quarante et un'],
      '42': ['42', 'quarante-deux', 'quarante deux'],
      '43': ['43', 'quarante-trois', 'quarante trois'],
      '44': ['44', 'quarante-quatre', 'quarante quatre'],
      '45': ['45', 'quarante-cinq', 'quarante cinq'],
      '46': ['46', 'quarante-six', 'quarante six'],
      '47': ['47', 'quarante-sept', 'quarante sept'],
      '48': ['48', 'quarante-huit', 'quarante huit'],
      '49': ['49', 'quarante-neuf', 'quarante neuf'],
      '50': ['50', 'cinquante'],
      '51': ['51', 'cinquante-et-un', 'cinquante et un'],
      '52': ['52', 'cinquante-deux', 'cinquante deux'],
      '53': ['53', 'cinquante-trois', 'cinquante trois'],
      '54': ['54', 'cinquante-quatre', 'cinquante quatre'],
      '55': ['55', 'cinquante-cinq', 'cinquante cinq'],
      '56': ['56', 'cinquante-six', 'cinquante six'],
      '57': ['57', 'cinquante-sept', 'cinquante sept'],
      '58': ['58', 'cinquante-huit', 'cinquante huit'],
      '59': ['59', 'cinquante-neuf', 'cinquante neuf'],
      '60': ['60', 'soixante'],
      '61': ['61', 'soixante-et-un', 'soixante et un'],
      '62': ['62', 'soixante-deux', 'soixante deux'],
      '63': ['63', 'soixante-trois', 'soixante trois'],
      '64': ['64', 'soixante-quatre', 'soixante quatre'],
      '65': ['65', 'soixante-cinq', 'soixante cinq'],
      '66': ['66', 'soixante-six', 'soixante six'],
      '67': ['67', 'soixante-sept', 'soixante sept'],
      '68': ['68', 'soixante-huit', 'soixante huit'],
      '69': ['69', 'soixante-neuf', 'soixante neuf'],
      '70': ['70', 'soixante-dix'],
      '71': ['71', 'soixante-et-onze', 'soixante et onze'],
      '72': ['72', 'soixante-douze'],
      '73': ['73', 'soixante-treize'],
      '74': ['74', 'soixante-quatorze'],
      '75': ['75', 'soixante-quinze'],
      '76': ['76', 'soixante-seize'],
      '77': ['77', 'soixante-dix-sept'],
      '78': ['78', 'soixante-dix-huit'],
      '79': ['79', 'soixante-dix-neuf'],
      '80': ['80', 'quatre-vingts', 'quatre vingts'],
      '81': ['81', 'quatre-vingt-un', 'quatre vingt un'],
      '82': ['82', 'quatre-vingt-deux', 'quatre vingt deux'],
      '83': ['83', 'quatre-vingt-trois', 'quatre vingt trois'],
      '84': ['84', 'quatre-vingt-quatre', 'quatre vingt quatre'],
      '85': ['85', 'quatre-vingt-cinq', 'quatre vingt cinq'],
      '86': ['86', 'quatre-vingt-six', 'quatre vingt six'],
      '87': ['87', 'quatre-vingt-sept', 'quatre vingt sept'],
      '88': ['88', 'quatre-vingt-huit', 'quatre vingt huit'],
      '89': ['89', 'quatre-vingt-neuf', 'quatre vingt neuf'],
      '90': ['90', 'quatre-vingt-dix', 'quatre vingt dix'],
      '91': ['91', 'quatre-vingt-onze', 'quatre vingt onze'],
      '92': ['92', 'quatre-vingt-douze', 'quatre vingt douze'],
      '93': ['93', 'quatre-vingt-treize', 'quatre vingt treize'],
      '94': ['94', 'quatre-vingt-quatorze', 'quatre vingt quatorze'],
      '95': ['95', 'quatre-vingt-quinze', 'quatre vingt quinze'],
      '96': ['96', 'quatre-vingt-seize', 'quatre vingt seize'],
      '97': ['97', 'quatre-vingt-dix-sept', 'quatre vingt dix sept'],
      '98': ['98', 'quatre-vingt-dix-huit', 'quatre vingt dix huit'],
      '99': ['99', 'quatre-vingt-dix-neuf', 'quatre vingt dix neuf'],
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
    const number = exercise.number || exercise.display?.replace(/[^0-9]/g, '');
    
    if (!number) {
      setIsExplainingError(false);
      setIsPlayingVocal(false);
      return;
    }
    
    const dizaines = Math.floor(parseInt(number) / 10);
    const unites = parseInt(number) % 10;
    
    await playAudio('Ce n\'est pas la bonne réponse. Regardons ensemble !');
    
    if (exercise.type === 'dizaines') {
      await playAudio(`Regardons le nombre ${number}. Le chiffre de gauche indique les dizaines.`);
      setHighlightDigit('left');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await playAudio(`Le chiffre des dizaines est ${dizaines}. Donc il y a ${dizaines} dizaines dans ${number}.`);
    } else if (exercise.type === 'unites') {
      await playAudio(`Regardons le nombre ${number}. Le chiffre de droite indique les unités.`);
      setHighlightDigit('right');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await playAudio(`Le chiffre des unités est ${unites}. Donc il y a ${unites} unités dans ${number}.`);
    } else if (exercise.display) {
      await playAudio(`${dizaines} dizaines plus ${unites} unités égale ${number}.`);
    }
    
    await playAudio(`La bonne réponse est ${exercise.correctAnswer} !`);
    
    setHighlightDigit(null);
    
    // Mettre en évidence le bouton Suivant
    setHighlightedElement('next-exercise-button');
    
    // Faire défiler vers le bouton Suivant
    scrollToNextButton();
    
    await playAudio('Tu peux appuyer sur suivant');
    
    setIsExplainingError(false);
    setIsPlayingVocal(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
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

  @keyframes subtle-pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
    }
  }

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-100px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes digitHighlight {
    0%, 100% {
      background-color: rgba(59, 130, 246, 0.2);
      transform: scale(1);
      border: 2px solid transparent;
    }
    50% {
      background-color: rgba(255, 193, 7, 0.8);
      transform: scale(1.3);
      border: 2px solid #ffc107;
      box-shadow: 0 0 20px rgba(255, 193, 7, 0.6);
    }
  }

  @keyframes tableHighlight {
    0%, 100% {
      background-color: rgba(59, 130, 246, 0.1);
      transform: scale(1);
    }
    50% {
      background-color: rgba(34, 197, 94, 0.4);
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 pb-8 sm:pb-8">
        {/* Header */}
        <div className={showExercises ? 'mb-4 sm:mb-6' : 'mb-8'}>
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg text-center p-2 sm:p-4">
            <h1 className="text-lg sm:text-2xl lg:text-3xl mb-1 sm:mb-2 font-bold text-gray-900">
              🔢 Unités et dizaines
            </h1>
          </div>
        </div>

        {/* Navigation entre cours et exercices - MOBILE OPTIMISÉE */}
        <div id="exercise-tab" className={`flex justify-center ${showExercises ? 'mb-4 sm:mb-6' : 'mb-8'}`}>
          <div className="bg-white rounded-lg p-1 shadow-md flex">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[48px] sm:min-h-[68px] flex items-center justify-center ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[48px] sm:min-h-[68px] flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : highlightExerciseTab
                  ? 'bg-yellow-400 text-yellow-900 shadow-xl scale-110 animate-pulse ring-4 ring-yellow-300'
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
          <div className="space-y-1 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
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

            {/* Explication des positions */}
            <div id="position-section" className="bg-white rounded-xl p-3 sm:p-8 shadow-lg">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🧠 La place des chiffres est importante !
                </h2>
                {/* Icône d'animation pour les positions */}
                <div className={`bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-blue-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-blue-200 ${
                  highlightPositionButton ? 'ring-8 ring-yellow-400 ring-opacity-80 text-black' : 'text-white'
                }`}
                     style={{
                       animation: highlightPositionButton ? 'extremeHighlight 3s ease-in-out infinite' : 'subtle-pulse 2s ease-in-out infinite',
                       animationPlayState: 'running',
                       zIndex: highlightPositionButton ? 1000 : 'auto',
                       position: highlightPositionButton ? 'relative' : 'static'
                     }} 
                     title="🎯 Animation des positions ! Cliquez pour voir Sam expliquer."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                         explainPositions();
                       }
                     }}
                >
                  🎯
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 sm:p-8 mb-3 sm:mb-6">
                {showTitle && (
                  <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-6 text-blue-800 text-center animate-[fadeInUp_0.8s_ease-out]">
                    Exemple avec le nombre 34 :
                  </h3>
                )}
                
                <div className="grid md:grid-cols-2 gap-3 sm:gap-8 items-center">
                  {/* Visualisation */}
                  <div className="text-center">
                    {showNumber && (
                      <>
                        {/* Nombre 34 avec animations de chiffres */}
                        <div className={`text-6xl sm:text-8xl font-bold text-blue-600 mb-2 sm:mb-4 transform transition-all duration-500 cursor-pointer ${
                          slideInNumber ? 'animate-[slideInFromLeft_1s_ease-out]' : ''
                        }`}>
                          <span className={`inline-block transition-all duration-500 ${
                            animatingDigit === 'left' || animatingDigit === 'both' 
                              ? 'animate-[digitHighlight_1s_ease-in-out_infinite] text-yellow-600' 
                              : ''
                          }`}>
                            3
                          </span>
                          <span className={`inline-block transition-all duration-500 ${
                            animatingDigit === 'right' || animatingDigit === 'both' 
                              ? 'animate-[digitHighlight_1s_ease-in-out_infinite] text-yellow-600' 
                              : ''
                          }`}>
                            4
                          </span>
                        </div>
                      </>
                    )}
                    
                    {showVisualExplanation && (
                      <>
                        {/* Groupes visuels avec apparition conditionnelle */}
                        <div className={`text-2xl sm:text-4xl mb-2 sm:mb-4 transition-all duration-700 animate-[fadeInUp_0.8s_ease-out] ${
                          showVisualGroups 
                            ? 'opacity-100' 
                            : 'opacity-60'
                        }`}>
                          <span className={`transition-all duration-500 ${
                            animatingDigit === 'left' || animatingDigit === 'both' 
                              ? 'animate-pulse text-yellow-600 scale-110' 
                              : ''
                          }`}>
                            🔟🔟🔟
                          </span>
                          {' '}
                          <span className={`transition-all duration-500 ${
                            animatingDigit === 'right' || animatingDigit === 'both' 
                              ? 'animate-pulse text-yellow-600 scale-110' 
                              : ''
                          }`}>
                            🔴🔴🔴🔴
                          </span>
                        </div>
                        
                        <p className={`text-sm sm:text-lg text-gray-700 font-semibold transition-all duration-700 animate-[fadeInUp_1s_ease-out_0.3s_both] ${
                          showVisualGroups 
                            ? 'text-green-700 font-bold' 
                            : ''
                        }`}>
                          3 paquets de 10 + 4 objets seuls
                        </p>
                      </>
                    )}
                  </div>

                  {/* Tableau des positions */}
                  {showTable && (
                    <div className="bg-white rounded-lg p-2 sm:p-6 shadow-md animate-[fadeInUp_0.8s_ease-out]">
                      <div className="text-center mb-2 sm:mb-4">
                        <h4 className="text-sm sm:text-xl font-bold text-gray-800 animate-bounce-in">
                          🎯 Tableau magique des positions !
                        </h4>
                      </div>
                    
                    <table className="w-full border-collapse border-2 border-blue-600 overflow-hidden rounded-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                          <th className="border-2 border-blue-600 p-2 sm:p-4 font-bold animate-slide-in-left text-sm sm:text-base">
                            <Package className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2 animate-wiggle" />
                            🔟 Dizaines
                          </th>
                          <th className="border-2 border-blue-600 p-2 sm:p-4 font-bold animate-slide-in-right text-sm sm:text-base">
                            <Dot className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2 animate-wiggle" />
                            🔴 Unités
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={`border-2 border-blue-600 p-2 sm:p-6 text-center bg-gradient-to-br from-blue-100 to-blue-200 transition-all duration-500 ${
                            highlightTableCell === 'dizaines' 
                              ? 'animate-[tableHighlight_1s_ease-in-out_infinite] bg-gradient-to-br from-yellow-200 to-yellow-300' 
                              : 'animate-slide-in-left'
                          }`}>
                            <div className={`text-3xl sm:text-8xl font-bold transition-all duration-500 ${
                              highlightTableCell === 'dizaines' || animatingDigit === 'left' || animatingDigit === 'both'
                                ? 'text-yellow-600 scale-125 animate-pulse' 
                                : 'text-blue-600 animate-bounce-in transform hover:scale-110'
                            }`}>
                              3
                            </div>
                            <div className={`text-xs sm:text-lg font-semibold mt-1 sm:mt-3 transition-all duration-500 ${
                              highlightTableCell === 'dizaines' 
                                ? 'text-yellow-800 font-bold scale-110' 
                                : 'text-blue-800 animate-fade-in-up'
                            }`}>
                              3 × 10 = 30
                            </div>
                            <div className={`text-lg sm:text-3xl mt-1 sm:mt-2 transition-all duration-500 ${
                              highlightTableCell === 'dizaines' || animatingDigit === 'left' || animatingDigit === 'both'
                                ? 'scale-125 animate-bounce' 
                                : 'animate-pulse'
                            }`}>
                              🔟🔟🔟
                            </div>
                          </td>
                          <td className={`border-2 border-blue-600 p-2 sm:p-6 text-center bg-gradient-to-br from-green-100 to-green-200 transition-all duration-500 ${
                            highlightTableCell === 'unites' 
                              ? 'animate-[tableHighlight_1s_ease-in-out_infinite] bg-gradient-to-br from-yellow-200 to-yellow-300' 
                              : 'animate-slide-in-right'
                          }`}>
                            <div className={`text-3xl sm:text-8xl font-bold transition-all duration-500 ${
                              highlightTableCell === 'unites' || animatingDigit === 'right' || animatingDigit === 'both'
                                ? 'text-yellow-600 scale-125 animate-pulse' 
                                : 'text-green-600 animate-bounce-in transform hover:scale-110'
                            }`} style={{animationDelay: '0.2s'}}>
                              4
                            </div>
                            <div className={`text-xs sm:text-lg font-semibold mt-1 sm:mt-3 transition-all duration-500 ${
                              highlightTableCell === 'unites' 
                                ? 'text-yellow-800 font-bold scale-110' 
                                : 'text-green-800 animate-fade-in-up'
                            }`} style={{animationDelay: '0.1s'}}>
                              4 × 1 = 4
                            </div>
                            <div className={`text-lg sm:text-3xl mt-1 sm:mt-2 transition-all duration-500 ${
                              highlightTableCell === 'unites' || animatingDigit === 'right' || animatingDigit === 'both'
                                ? 'scale-125 animate-bounce' 
                                : 'animate-pulse'
                            }`} style={{animationDelay: '0.5s'}}>
                              🔴🔴🔴🔴
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {showFinalSum && (
                      <>
                        {/* Animation de la somme finale */}
                        <div className={`text-center mt-3 sm:mt-6 rounded-lg p-3 sm:p-4 transition-all duration-700 animate-[fadeInUp_0.8s_ease-out] ${
                          showVisualGroups 
                            ? 'bg-gradient-to-r from-green-200 to-emerald-200 scale-110' 
                            : 'bg-gradient-to-r from-yellow-100 to-orange-100'
                        }`}>
                          <div className={`text-lg sm:text-3xl font-bold transition-all duration-500 ${
                            showVisualGroups 
                              ? 'text-green-800 animate-bounce scale-110' 
                              : 'text-gray-800 animate-pulse'
                          }`}>
                            ✨ 30 + 4 = 34 ✨
                          </div>
                          <div className={`text-xs sm:text-lg mt-1 sm:mt-2 transition-all duration-500 ${
                            showVisualGroups 
                              ? 'text-green-700 font-bold animate-pulse' 
                              : 'text-gray-600'
                          }`}>
                            La magie des positions !
                          </div>
                        </div>
                        
                        {/* Flèches animées pour montrer le mouvement */}
                        <div className="flex justify-center items-center mt-2 sm:mt-4 space-x-1 sm:space-x-4 animate-[fadeInUp_1s_ease-out_0.3s_both]">
                          <div className="text-center">
                            <div className="text-sm sm:text-2xl animate-bounce">⬇️</div>
                            <div className="text-xs sm:text-sm font-semibold text-blue-600">Dizaines</div>
                          </div>
                          <div className="text-lg sm:text-4xl font-bold text-purple-600 animate-pulse">+</div>
                          <div className="text-center">
                            <div className="text-sm sm:text-2xl animate-bounce">⬇️</div>
                            <div className="text-xs sm:text-sm font-semibold text-green-600">Unités</div>
                          </div>
                          <div className="text-lg sm:text-4xl font-bold text-purple-600 animate-pulse">=</div>
                          <div className="text-center">
                            <div className="text-sm sm:text-2xl animate-bounce">🎉</div>
                            <div className="text-xs sm:text-sm font-semibold text-purple-600">Résultat</div>
                          </div>
                        </div>
                      </>
                    )}
                    </div>
                  )}
                </div>
              </div>

              {/* Règle importante */}
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-6">
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-yellow-800 text-center">
                  📏 Règle importante
                </h3>
                <div className="text-center space-y-1 sm:space-y-2 text-yellow-700 text-sm sm:text-lg font-semibold">
                  <p>• Le chiffre de DROITE = les unités (objets seuls)</p>
                  <p>• Le chiffre de GAUCHE = les dizaines (paquets de 10)</p>
                  <p>• La position du chiffre change sa valeur !</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div id="explore-section" className="bg-white rounded-xl p-2 sm:p-8 shadow-lg">
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🎯 Explore un nombre
                </h2>
                {/* Icône d'animation pour l'exploration */}
                <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-green-200 ${
                  highlightExploreButton ? 'ring-8 ring-yellow-400 ring-opacity-80 text-black' : 'text-white'
                }`}
                     style={{
                       animation: highlightExploreButton ? 'extremeHighlight 3s ease-in-out infinite' : 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running',
                       zIndex: highlightExploreButton ? 1000 : 'auto',
                       position: highlightExploreButton ? 'relative' : 'static'
                     }} 
                     title="🔍 Animation de l'exploration ! Cliquez pour voir Sam analyser le nombre."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                         explainSelectedNumber(selectedNumber);
                       }
                     }}
                >
                  🔍
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-2 sm:mb-6">
                {numbersDecomposition.map((item) => (
                  <button
                    key={item.number}
                    onClick={async () => {
                      setSelectedNumber(item.number);
                      // Lancer automatiquement l'animation après avoir sélectionné le nombre
                      if (!isPlayingVocal) {
                        // Passer directement le nombre à la fonction
                        setTimeout(() => {
                          explainSelectedNumber(item.number);
                        }, 200);
                      }
                    }}
                    className={`p-1 sm:p-4 rounded-lg font-bold text-base sm:text-2xl transition-all ${
                      selectedNumber === item.number
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : highlightedNumbers.includes(item.number)
                        ? 'bg-yellow-400 text-yellow-900 shadow-xl scale-110 animate-bounce ring-4 ring-yellow-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyse détaillée du nombre sélectionné */}
            <div id="analyse-section" className="bg-white rounded-xl p-2 sm:p-8 shadow-lg">
              <div className="text-center mb-1 sm:mb-6">
                {showAnalysisTitle && (
                  <h2 className="text-base sm:text-2xl font-bold text-gray-900 animate-[fadeInUp_0.8s_ease-out]">
                    🔍 Analysons le nombre {selectedNumber}
                  </h2>
                )}
              </div>
              
              {(() => {
                const selected = numbersDecomposition.find(n => n.number === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-2 sm:space-y-8">
                    {/* Affichage principal */}
                    {showSelectedNumber && (
                      <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-2 sm:p-8 animate-[fadeInUp_0.8s_ease-out]">
                        <div className="text-center mb-2 sm:mb-6">
                          <div className="text-4xl sm:text-9xl font-bold text-gray-800 mb-1 sm:mb-4">
                            {selected.number}
                          </div>
                          {showDecomposition && (
                            <>
                              <div className="text-lg sm:text-4xl mb-1 sm:mb-4 animate-[fadeInUp_1s_ease-out_0.2s_both]">
                                {selected.visual}
                              </div>
                              <p className="text-xs sm:text-xl font-semibold text-gray-700 animate-[fadeInUp_1.2s_ease-out_0.4s_both]">
                                {selected.explanation}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Décomposition détaillée */}
                    <div className="grid md:grid-cols-2 gap-2 sm:gap-6">
                      {/* Dizaines */}
                      {showDizaines && (
                        <div className="bg-blue-50 rounded-lg p-2 sm:p-6 animate-[fadeInUp_0.8s_ease-out]">
                          <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-4 text-blue-800 text-center">
                            <Package className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                            Le chiffre des dizaines
                          </h3>
                          <div className="text-center">
                            <div className="text-3xl sm:text-8xl font-bold text-blue-600 mb-1 sm:mb-4">
                              {selected.dizaines}
                            </div>
                            <div className="bg-white rounded-lg p-1 sm:p-4 mb-1 sm:mb-4">
                              <div className="text-lg sm:text-3xl mb-1 sm:mb-2">
                                {'📦'.repeat(selected.dizaines)}
                              </div>
                              <p className="text-xs sm:text-lg font-semibold text-blue-700">
                                {selected.dizaines} paquets de 10
                              </p>
                            </div>
                            <div className="text-sm sm:text-2xl font-bold text-blue-600">
                              {selected.dizaines} × 10 = {selected.dizaines * 10}
                            </div>
                            <button
                              onClick={() => speakText(`${selected.dizaines} dizaines font ${selected.dizaines * 10}`)}
                              className="bg-blue-400 hover:bg-blue-500 text-white p-1 sm:p-2 rounded-lg transition-colors mt-1 sm:mt-3"
                            >
                              <Volume2 className="w-3 h-3 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Unités */}
                      {showUnites && (
                        <div className="bg-green-50 rounded-lg p-2 sm:p-6 animate-[fadeInUp_0.8s_ease-out]">
                          <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-4 text-green-800 text-center">
                            <Dot className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                            Le chiffre des unités
                          </h3>
                          <div className="text-center">
                            <div className="text-3xl sm:text-8xl font-bold text-green-600 mb-1 sm:mb-4">
                              {selected.unites}
                            </div>
                            <div className="bg-white rounded-lg p-1 sm:p-4 mb-1 sm:mb-4">
                              <div className="text-lg sm:text-3xl mb-1 sm:mb-2">
                                {'🔴'.repeat(selected.unites)}
                              </div>
                              <p className="text-xs sm:text-lg font-semibold text-green-700">
                                {selected.unites} objets seuls
                              </p>
                            </div>
                            <div className="text-sm sm:text-2xl font-bold text-green-600">
                              {selected.unites} × 1 = {selected.unites}
                            </div>
                            <button
                              onClick={() => speakText(`${selected.unites} unités font ${selected.unites}`)}
                              className="bg-green-400 hover:bg-green-500 text-white p-1 sm:p-2 rounded-lg transition-colors mt-1 sm:mt-3"
                            >
                              <Volume2 className="w-3 h-3 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Résultat final */}
                    {showFinalCalculation && (
                      <div className="bg-yellow-50 rounded-lg p-2 sm:p-6 text-center animate-[fadeInUp_0.8s_ease-out]">
                        <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-4 text-yellow-800">
                          🎯 Au final :
                        </h3>
                        <div className="text-lg sm:text-3xl font-bold text-gray-800">
                          {selected.dizaines * 10} + {selected.unites} = {selected.number}
                        </div>
                        <button
                          onClick={() => speakText(`${selected.dizaines * 10} plus ${selected.unites} égale ${selected.number}`)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 sm:px-6 py-1 sm:py-3 rounded-lg font-bold mt-1 sm:mt-4 transition-colors text-xs sm:text-base"
                        >
                          <Volume2 className="inline w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          Écouter
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-3 sm:p-6 text-white">
              <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-sm sm:text-lg">
                <li>• DROITE = unités (objets seuls)</li>
                <li>• GAUCHE = dizaines (paquets de 10)</li>
                <li>• Utilise tes mains : 1 main = 5, 2 mains = 10</li>
                <li>• Pense aux paquets et aux objets seuls</li>
                <li>• 34 = 30 + 4 = 3 dizaines + 4 unités</li>
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
                
                <div className="text-sm font-bold text-orange-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              </div>
              
            {/* Indicateur de progression mobile - sticky sur la page */}
            <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b border-gray-200 sm:hidden mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Exercice {currentExercise + 1}/{exercises.length}</span>
                <span className="font-bold text-orange-600">Score : {score}/{exercises.length}</span>
                </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
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
              
              {/* Affichage du nombre ou de l'expression avec explication si erreur */}
              <div className={`bg-white border-2 rounded-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-500 ${
                isExplainingError ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-300' : 'border-orange-200'
              }`}>
                <div className="py-6 sm:py-8 md:py-10">
                {exercises[currentExercise]?.display ? (
                  <div className="text-6xl sm:text-8xl font-bold text-blue-600 mb-4">
                    {exercises[currentExercise].display}
                  </div>
                ) : (
                  <>
                    {/* Affichage du nombre avec highlighting des chiffres */}
                    <div className="mb-4">
                    {(() => {
                        const number = exercises[currentExercise]?.number;
                      if (!number) return null;
                        const digits = number.split('');
                        
                        return (
                          <div className="flex justify-center items-center gap-2">
                            {digits.map((digit, index) => {
                              const isLeftDigit = index === 0 && digits.length === 2;
                              const isRightDigit = index === 1 && digits.length === 2;
                              const shouldHighlight = 
                                (highlightDigit === 'left' && isLeftDigit) ||
                                (highlightDigit === 'right' && isRightDigit);
                      
                      return (
                                <span
                                  key={index}
                                  className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold transition-all duration-500 ${
                                    shouldHighlight
                                      ? 'text-yellow-600 bg-yellow-200 px-2 py-1 rounded-lg scale-110 shadow-lg'
                                      : 'text-blue-600'
                                  }`}
                                >
                                  {digit}
                        </span>
                              );
                            })}
                            </div>
                        );
                      })()} 
                    </div>
                    <div className="text-sm sm:text-base md:text-lg text-gray-700">
                      {exercises[currentExercise]?.type === 'dizaines' ? 'Cherche les dizaines' : 'Cherche les unités'}
                    </div>
                  </>
                )}
                
                <p className="text-sm sm:text-lg text-gray-700 font-semibold mb-6 hidden sm:block">
                  Trouve la bonne réponse !
                </p>
                
                {/* Message d'explication avec la bonne réponse en rouge */}
                {isExplainingError && (
                  <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
                    <div className="text-lg font-bold text-red-800 mb-2">
                      🏴‍☠️ Explication de Sam le Pirate
                                      </div>
                    <div className="text-red-700 text-xl">
                      La bonne réponse est <span className="font-bold text-3xl text-red-800">{exercises[currentExercise]?.correctAnswer}</span> !
                                      </div>
                    <div className="text-sm text-red-600 mt-2">
                      {exercises[currentExercise]?.type === 'dizaines' 
                        ? `Dans "${exercises[currentExercise]?.number}", le chiffre des dizaines est "${exercises[currentExercise]?.correctAnswer}".`
                        : exercises[currentExercise]?.type === 'unites'
                          ? `Dans "${exercises[currentExercise]?.number}", le chiffre des unités est "${exercises[currentExercise]?.correctAnswer}".`
                          : `L'expression "${exercises[currentExercise]?.display}" donne "${exercises[currentExercise]?.correctAnswer}".`
                      }
                                      </div>
                                </div>
                              )}
                                </div>
              </div>
              
              {/* Champ de réponse */}
              <div className="mb-8 sm:mb-12">
                <div className={`relative max-w-xs mx-auto transition-all duration-500 ${
                  highlightedElement === 'answer-input' ? 'ring-8 ring-yellow-400 bg-yellow-100 rounded-lg p-4 scale-110 shadow-2xl animate-pulse' : ''
                }`}>
                  <input
                    id="answer-input"
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                    onClick={() => {
                      speechSynthesis.cancel();
                      setIsPlayingVocal(false);
                    }}
                    disabled={isCorrect !== null || isPlayingVocal}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white"
                    placeholder="Ex: 4"
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
              
              {/* Résultat - Bonne réponse */}
              {isCorrect !== null && isCorrect && (
                <div className="p-4 sm:p-6 rounded-lg mb-8 bg-green-100 text-green-800">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="font-bold text-lg sm:text-xl">
                      Bravo ! C'est bien {exercises[currentExercise]?.correctAnswer} !
                        </span>
                  </div>
                </div>
              )}
              
              {/* Résultat - Mauvaise réponse avec explication */}
              {isCorrect !== null && !isCorrect && (
                <div className="p-4 sm:p-6 rounded-lg mb-8 bg-red-100 text-red-800">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="font-bold text-lg sm:text-xl">
                      Ce n'est pas la bonne réponse
                    </span>
                  </div>
                  
                  {/* Affichage du nombre avec mise en évidence des chiffres */}
                    {(() => {
                      const exercise = exercises[currentExercise];
                    const number = exercise?.number || exercise?.display?.replace(/[^0-9]/g, '');
                    
                      if (!number) return null;
                      
                    const numberStr = number.toString();
                      const dizaines = Math.floor(parseInt(number) / 10);
                      const unites = parseInt(number) % 10;
                      
                      return (
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="text-center mb-4">
                          <div className="text-4xl sm:text-6xl font-bold mb-2">
                            {numberStr.split('').map((digit, index) => (
                              <span
                                key={index}
                                className={`inline-block mx-1 ${
                                  (highlightDigit === 'left' && index === 0) || 
                                  (highlightDigit === 'right' && index === numberStr.length - 1)
                                    ? 'bg-yellow-300 text-black rounded px-2 py-1 animate-pulse'
                                    : 'text-gray-800'
                                }`}
                              >
                                {digit}
                              </span>
                            ))}
                          </div>
                            </div>
                            
                        <div className="text-center">
                          <div className="bg-blue-50 rounded-lg p-3 mb-3">
                            <div className="text-lg font-bold text-blue-800 mb-2">
                              📋 Décomposition :
                                      </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="bg-blue-100 rounded p-2">
                                <div className="font-bold text-blue-800">Dizaines</div>
                                <div className="text-2xl font-bold">{dizaines}</div>
                                <div className="text-xs">{dizaines} × 10 = {dizaines * 10}</div>
                                      </div>
                              <div className="bg-green-100 rounded p-2">
                                <div className="font-bold text-green-800">Unités</div>
                                <div className="text-2xl font-bold">{unites}</div>
                                <div className="text-xs">{unites} × 1 = {unites}</div>
                                      </div>
                                      </div>
                            </div>
                            
                          <div className="bg-orange-100 rounded-lg p-3">
                            <div className="font-bold text-lg text-orange-800">
                              ✅ La bonne réponse est : {exercise?.correctAnswer}
                                </div>
                                </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert unités/dizaines !", message: "Tu maîtrises parfaitement la valeur positionnelle !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les unités et dizaines ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! La valeur positionnelle est importante !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux comprendre unités et dizaines !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comprendre unités et dizaines, c'est la base !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
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