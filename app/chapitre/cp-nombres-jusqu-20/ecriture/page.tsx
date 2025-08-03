'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

export default function EcritureNombresCP() {
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [animatingPoints, setAnimatingPoints] = useState<number[]>([]);
  const [countingNumber, setCountingNumber] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [animatingWriting, setAnimatingWriting] = useState(false);
  const [writingStep, setWritingStep] = useState<string | null>(null);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(-1);
  const [exampleAnimating, setExampleAnimating] = useState(false);
  const [exampleLetterIndex, setExampleLetterIndex] = useState<number>(-1);
  const [exerciseAnimating, setExerciseAnimating] = useState(false);
  const [exerciseLetterIndex, setExerciseLetterIndex] = useState<number>(-1);
  
  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions de pirate personnalisées pour chaque exercice incorrect
  const pirateExpressions = [
    "Par ma barbe de pirate", // exercice 1
    "Humm ça n'est pas vraiment ça", // exercice 2  
    "Nom d'un alligator", // exercice 3
    "Saperlipopette", // exercice 4
    "Mille sabords", // exercice 5
    "Morbleu", // exercice 6
    "Tonnerre de Brest", // exercice 7
    "Par tous les diables des mers", // exercice 8
    "Sacré mille tonnerres", // exercice 9
    "Bigre et bigre", // exercice 10
    "Nom d'une jambe en bois", // exercice 11
    "Sacrés mille tonnerres", // exercice 12
    "Par Neptune", // exercice 13
    "Bon sang de bonsoir", // exercice 14
    "Fichtre et refichtre" // exercice 15
  ];

  // Compliments variés pour les bonnes réponses
  const correctAnswerCompliments = [
    "Bravo",
    "Magnifique", 
    "Parfait",
    "Époustouflant",
    "Formidable",
    "Incroyable",
    "Fantastique",
    "Génial",
    "Excellent",
    "Superbe"
  ];
  
  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Plus besoin de shuffledChoices pour saisie libre

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    // Arrêter complètement la synthèse vocale
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() appelé');
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingPoints([]);
    setCountingNumber(null);
    setAnimatingWriting(false);
    setWritingStep(null);
    setCurrentLetterIndex(-1);
    setExampleAnimating(false);
    setExampleLetterIndex(-1);
    setExerciseAnimating(false);
    setExerciseLetterIndex(-1);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
  };

  // Fonction pour scroller vers l'illustration - optimisée pour mobile
  const scrollToIllustration = () => {
    const element = document.getElementById('number-illustration');
    if (element) {
      const isMobile = window.innerWidth < 768; // sm breakpoint
      
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: isMobile ? 'center' : 'start', // Sur mobile, centrer l'explication
        inline: 'nearest'
      });
      
      // Pour mobile : petit délai supplémentaire pour s'assurer que l'explication est bien visible
      if (isMobile) {
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }, 300);
      }
    }
  };

  // Fonction pour scroller vers le tableau des nombres
  const scrollToNumberChoice = () => {
    const element = document.getElementById('number-choice-grid');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction pour scroller vers l'animation d'épellation
  const scrollToSpelling = () => {
    console.log('🎯 scrollToSpelling appelé');
    const attemptScroll = () => {
      const element = document.getElementById('spelling-animation');
      console.log('📍 Tentative de scroll - élément trouvé:', !!element);
      if (element) {
        const isMobile = window.innerWidth < 768; // sm breakpoint
        
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: isMobile ? 'center' : 'center', // Centrer sur tous les écrans
          inline: 'nearest'
        });
        console.log('✅ Scroll vers animation réussi');
        return true;
      }
      return false;
    };

    // Essayer immédiatement
    if (!attemptScroll()) {
      // Si l'élément n'existe pas encore, réessayer après un délai
      setTimeout(() => {
        if (!attemptScroll()) {
          // Dernier essai après un délai plus long
          setTimeout(attemptScroll, 300);
        }
      }, 100);
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
      await playAudio("Bonjour, faisons quelques exercices nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Pour lire l'énoncé appuie sur écouter l'énoncé");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton "Écouter l'énoncé"
      setHighlightedElement('listen-question-button');
      setShowExercisesList(true);
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Dès que tu as la réponse, tu peux la saisir ici");
      if (stopSignalRef.current) return;
      
      // Mettre beaucoup en évidence la zone de réponse
      setHighlightedElement('answer-input');
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("et appuie ensuite sur valider");
      if (stopSignalRef.current) return;
      
      // Animation sur le bouton valider
      setHighlightedElement('validate-button');
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("en cas de mauvaise réponse, je serai là pour t'aider. En avant toutes !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour lire l'énoncé de l'exercice - LECTURE SIMPLE DE LA QUESTION
  const startExerciseExplanation = async () => {
    console.log('🎤 startExerciseExplanation appelé');
    console.log('⚠️ Conditions:', {
      stopSignalRef: stopSignalRef.current,
      isExplainingError,
      exerciseExists: !!exercises[currentExercise],
      currentExercise,
      exerciseQuestion: exercises[currentExercise]?.question
    });
    
    if (stopSignalRef.current || isExplainingError || !exercises[currentExercise]) {
      console.log('❌ Sortie prématurée de startExerciseExplanation');
      return;
    }
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setExerciseStarted(true);
    
    try {
      console.log('🔊 Lecture de l\'énoncé:', exercises[currentExercise].question);
      // Lire seulement l'énoncé de l'exercice
      await playAudio(exercises[currentExercise].question);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startExerciseExplanation:', error);
    } finally {
      setIsPlayingVocal(false);
      console.log('✅ startExerciseExplanation terminé');
    }
  };

  // Fonction pour animer l'explication d'une mauvaise réponse
  const explainWrongAnswer = async () => {
    console.log('❌ Explication mauvaise réponse pour exercice', currentExercise + 1);
    
    // FORCER la remise à false pour permettre l'explication
    stopSignalRef.current = false;
    setIsExplainingError(true);
    setIsPlayingVocal(true);
    
    try {
      // Expression de pirate personnalisée
      const pirateExpression = pirateExpressions[currentExercise] || "Mille sabords";
      await playAudio(pirateExpression + " !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      await playAudio(`La bonne réponse est ${exercises[currentExercise].correctAnswer} !`);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      await playAudio(`Le nombre ${exercises[currentExercise].number} s'écrit "${exercises[currentExercise].correctAnswer}" en lettres !`);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      // Animation d'épellation lettre par lettre
      setExerciseAnimating(true);
      setExerciseLetterIndex(-1);
      
      await playAudio("Épelons ensemble :");
      if (stopSignalRef.current) return;
      await wait(600);
      
      // Épeller le mot lettre par lettre
      const letters = exercises[currentExercise].correctAnswer.split('');
      for (let i = 0; i < letters.length; i++) {
        if (stopSignalRef.current) break;
        
        setExerciseLetterIndex(i);
        await playAudio(letters[i]);
        
        if (stopSignalRef.current) break;
        await wait(600);
      }
      
      // Marquer l'animation comme terminée
      setExerciseLetterIndex(letters.length);
      await wait(500);
      if (stopSignalRef.current) return;
      
      await playAudio(`Parfait ! Le nombre ${exercises[currentExercise].number} s'épelle "${exercises[currentExercise].correctAnswer}" !`);
      if (stopSignalRef.current) return;
      
      await wait(800);
      if (stopSignalRef.current) return;
      
      await playAudio("Maintenant appuie sur suivant !");
      if (stopSignalRef.current) return;
      
      // Illuminer le bouton suivant
      setHighlightedElement('next-exercise-button');
      
      await wait(300); // Laisser l'animation se voir
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      setExerciseAnimating(false);
      setExerciseLetterIndex(-1);
      // Ne PAS remettre setIsExplainingError(false) ici - le bouton Suivant doit rester actif
      // L'état sera réinitialisé quand l'utilisateur clique sur "Suivant"
    }
  };

  // Fonction pour féliciter avec audio pour les bonnes réponses
  const celebrateCorrectAnswer = async () => {
    if (stopSignalRef.current) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      const randomCompliment = correctAnswerCompliments[Math.floor(Math.random() * correctAnswerCompliments.length)];
      await playAudio(randomCompliment + " !");
      if (stopSignalRef.current) return;
      
      await wait(500);
      if (stopSignalRef.current) return;
      
      await playAudio(`C'est bien "${exercises[currentExercise].correctAnswer}" !`);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans celebrateCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };



  // Fonction pour jouer un audio avec gestion d'interruption
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Vérifier si l'API est disponible
      if (typeof speechSynthesis === 'undefined') {
        console.warn('SpeechSynthesis API non disponible');
        resolve();
        return;
      }
      
      speechSynthesis.cancel();
      
      // Fonction pour créer et jouer l'utterance
      const createAndPlayUtterance = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.85;  // Vitesse légèrement plus rapide pour voix par défaut
        utterance.pitch = 1.1;  // Ton légèrement plus aigu pour enfants
        utterance.volume = 1.0;
        
        // Sélectionner la voix par DÉFAUT française (plus simple et stable)
        const voices = speechSynthesis.getVoices();
        console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
        
        // VOIX PAR DÉFAUT SIMPLIFIÉE pour Écriture Nombres jusqu'à 20
        const defaultVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && voice.default    // Voix française par défaut système
        ) || voices.find(voice => 
          voice.lang === 'fr-FR' && voice.localService // Voix locale française
        ) || voices.find(voice => 
          voice.lang === 'fr-FR'                     // Première voix fr-FR disponible
        ) || voices.find(voice => 
          voice.lang.startsWith('fr')                // Fallback voix française
        ) || voices[0];                               // Dernière option : première voix disponible
        
        if (defaultVoice) {
          utterance.voice = defaultVoice;
          console.log('🎤 Voix par défaut sélectionnée:', defaultVoice.name, '(', defaultVoice.lang, ')');
        } else {
          console.warn('⚠️ Aucune voix trouvée, utilisation système par défaut');
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
        
        utterance.onerror = (event) => {
          console.error('Erreur audio:', event);
          currentAudioRef.current = null;
          resolve();
        };
        
        console.log('Lancement audio:', text);
          speechSynthesis.speak(utterance);
      };

      // Attendre que les voix soient chargées
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', function handler() {
          speechSynthesis.removeEventListener('voiceschanged', handler);
          createAndPlayUtterance();
        });
            } else {
        createAndPlayUtterance();
      }
    });
  };

  // Fonction d'attente avec vérification d'interruption
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      setTimeout(() => {
        if (!stopSignalRef.current) {
          resolve();
        }
      }, ms);
    });
  };

  // Fonction pour afficher les lettres avec épellation progressive - MOBILE/DESKTOP ADAPTATIF
  const renderWordWithHighlight = (word: string, currentIndex: number) => {
    const letters = word.split('');
    
    // Configuration mobile ultra-compacte vs desktop normale
    const getMobileConfig = () => {
      const len = letters.length;
      
      if (len <= 4) {
        return {
          textSize: "text-lg",
          gap: "gap-1",
          padding: "px-2 py-1",
          minWidth: "min-w-[28px]",
          scale: { normal: "scale-100", active: "scale-110", done: "scale-105" }
        };
      } else if (len <= 6) {
        return {
          textSize: "text-base",
          gap: "gap-0.5",
          padding: "px-1.5 py-0.5",
          minWidth: "min-w-[22px]",
          scale: { normal: "scale-95", active: "scale-105", done: "scale-100" }
        };
      } else if (len <= 8) {
        return {
          textSize: "text-sm",
          gap: "gap-0",
          padding: "px-1 py-0.5",
          minWidth: "min-w-[18px]",
          scale: { normal: "scale-90", active: "scale-100", done: "scale-95" }
        };
      } else {
        return {
          textSize: "text-xs",
          gap: "gap-0",
          padding: "px-0.5 py-0.5",
          minWidth: "min-w-[14px]",
          scale: { normal: "scale-85", active: "scale-95", done: "scale-90" }
        };
      }
    };
    
    const getDesktopConfig = () => {
      const len = letters.length;
      
      if (len <= 6) {
        return {
          textSize: "text-3xl",
          gap: "gap-2",
          padding: "px-3 py-2",
          minWidth: "min-w-[50px]",
          scale: { normal: "scale-100", active: "scale-125", done: "scale-110" }
        };
      } else if (len <= 8) {
        return {
          textSize: "text-2xl",
          gap: "gap-1.5",
          padding: "px-2.5 py-1.5",
          minWidth: "min-w-[45px]",
          scale: { normal: "scale-100", active: "scale-125", done: "scale-110" }
        };
      } else {
        return {
          textSize: "text-xl",
          gap: "gap-1",
          padding: "px-2 py-1",
          minWidth: "min-w-[40px]",
          scale: { normal: "scale-100", active: "scale-125", done: "scale-110" }
        };
      }
    };
    
    const mobileConfig = getMobileConfig();
    const desktopConfig = getDesktopConfig();
    
    return (
      <div className="w-full max-w-full overflow-visible">
        {/* Version Mobile */}
        <div className={`flex sm:hidden justify-center items-center ${mobileConfig.gap} ${mobileConfig.textSize} font-bold`}>
          {letters.map((letter, index) => {
            let scaleClass = mobileConfig.scale.normal;
            let colorClass = "bg-gray-300 text-gray-600";
            let shadowClass = "";
            let ringClass = "";
            
            if (index < currentIndex || currentIndex >= letters.length) {
              scaleClass = mobileConfig.scale.done;
              colorClass = "bg-green-500 text-white";
              shadowClass = "shadow-sm";
            } else if (index === currentIndex) {
              scaleClass = mobileConfig.scale.active;
              if (letter === '-') {
                colorClass = "bg-blue-500 text-white";
                ringClass = "ring-1 ring-blue-300";
                shadowClass = "shadow-md animate-pulse";
              } else {
                colorClass = "bg-orange-500 text-white";
                ringClass = "ring-1 ring-orange-300";
                shadowClass = "shadow-md animate-bounce";
              }
            }
            
            return (
              <span 
                key={`mobile-${index}`}
                className={`
                  ${mobileConfig.padding} 
                  ${mobileConfig.minWidth} 
                  ${scaleClass}
                  ${colorClass}
                  ${shadowClass}
                  ${ringClass}
                  rounded-md 
                  transition-all 
                  duration-500 
                  text-center 
                  flex-shrink-0
                  leading-tight
                `}
              >
                {letter === '-' ? '–' : letter.toUpperCase()}
              </span>
            );
          })}
        </div>
        
        {/* Version Desktop */}
        <div className={`hidden sm:flex justify-center items-center ${desktopConfig.gap} ${desktopConfig.textSize} font-bold`}>
          {letters.map((letter, index) => {
            let scaleClass = desktopConfig.scale.normal;
            let colorClass = "bg-gray-300 text-gray-600";
            let shadowClass = "";
            let ringClass = "";
            
            if (index < currentIndex || currentIndex >= letters.length) {
              scaleClass = desktopConfig.scale.done;
              colorClass = "bg-green-500 text-white";
              shadowClass = "shadow-md";
            } else if (index === currentIndex) {
              scaleClass = desktopConfig.scale.active;
              if (letter === '-') {
                colorClass = "bg-blue-500 text-white";
                ringClass = "ring-4 ring-blue-300";
                shadowClass = "shadow-lg animate-pulse";
              } else {
                colorClass = "bg-orange-500 text-white";
                ringClass = "ring-4 ring-orange-300";
                shadowClass = "shadow-lg animate-bounce";
              }
            }
            
            return (
              <span 
                key={`desktop-${index}`}
                className={`
                  ${desktopConfig.padding} 
                  ${desktopConfig.minWidth} 
                  ${scaleClass}
                  ${colorClass}
                  ${shadowClass}
                  ${ringClass}
                  rounded-lg 
                  transition-all 
                  duration-500 
                  text-center 
                  flex-shrink-0
                `}
              >
                {letter === '-' ? '–' : letter.toUpperCase()}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  // Fonction pour animer l'exemple "5 → cinq"
  const animateExample = async () => {
    setExampleAnimating(true);
    setExampleLetterIndex(-1);
    
    await playAudio("Le chiffre 5 s'écrit en lettres comme ça :");
    if (stopSignalRef.current) return;
    await wait(800);
    
    // Épeller "cinq" dans l'exemple
    const letters = "cinq".split('');
    for (let i = 0; i < letters.length; i++) {
      if (stopSignalRef.current) break;
      
      setExampleLetterIndex(i);
      await playAudio(letters[i]);
      
      if (stopSignalRef.current) break;
      await wait(600);
    }
    
    // Montrer toutes les lettres
    setExampleLetterIndex(letters.length);
    
    if (stopSignalRef.current) return;
    await wait(800);
    
    await playAudio("CINQ ! Le chiffre 5 s'écrit 'cinq' en lettres !");
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Revenir à l'affichage normal
    setExampleAnimating(false);
    setExampleLetterIndex(-1);
  };

  // Fonction pour expliquer le chapitre au démarrage
  const explainChapter = async () => {
    console.log('📖 explainChapter - Début explication');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setSamSizeExpanded(true); // Agrandir Sam de façon permanente

    try {
      // Détection Chrome locale pour l'audio
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      console.log('Début explainChapter - Chrome:', isChrome);
      
      if (isChrome) {
        // Pour Chrome : activation plus agressive
        speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Vérification des voix pour Chrome
        let voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.log('Attente des voix Chrome...');
          await new Promise((resolve) => {
            const checkVoices = () => {
              voices = speechSynthesis.getVoices();
              if (voices.length > 0) {
                console.log('Voix Chrome chargées:', voices.length);
                resolve(voices);
              } else {
                setTimeout(checkVoices, 100);
              }
            };
            checkVoices();
          });
        }
      } else {
        // Test silencieux pour Safari et autres
        const testUtterance = new SpeechSynthesisUtterance(' ');
        testUtterance.volume = 0.01;
        speechSynthesis.speak(testUtterance);
        await wait(100);
      }
      
      // Nouveau message d'accueil
      await playAudio("Hello, c'est Sam le Pirate et mon ami Robotek !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio("Aujourd'hui nous allons apprendre à écrire les chiffres en lettres !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      // Mettre en surbrillance la grande box d'exemple
      setHighlightedElement('example-section');
      await playAudio("Voici un exemple !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Animation synchronisée avec comptage vocal - exemple avec le chiffre 5
      await playAudio("Regardez bien ! Le chiffre 5 s'écrit 'cinq' en lettres !");
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Animer l'exemple avec épellation
      await animateExample();
      if (stopSignalRef.current) return;
      
      // Fin de l'animation exemple
      setHighlightedElement(null);
      await wait(500);
      
      // Nouvelle séquence : présentation de la grille des nombres
      await playAudio("Tu pourras voir de nombreux exemples en cliquant sur ces chiffres !");
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Scroll vers la grille des nombres
      const numberChoiceElement = document.getElementById('number-choice-grid');
      if (numberChoiceElement) {
        numberChoiceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      await wait(1000);
      
      // Éclairer la grande box avec tous les chiffres
      setHighlightedElement('number-choice');
      await wait(1000);
      
      await playAudio("Pour chaque chiffre que tu choisis, je vais te montrer comment l'écrire en lettres !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Je vais épeler chaque mot lettre par lettre pour que tu retiennes bien !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("amuse toi bien nom d'une jambe en bois !");
      if (stopSignalRef.current) return;
      setHighlightedElement(null);
      await wait(800);
      
      // Scroller sur tous les nombres à tester dans la zone précédente
      if (numberChoiceElement) {
        numberChoiceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      await wait(1000);

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      console.log('📖 explainChapter - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setExampleAnimating(false);
      setExampleLetterIndex(-1);
    }
  };

  // Fonction pour expliquer un nombre spécifique (du chiffre vers les lettres)
  const explainNumber = async (number: number) => {
    console.log(`🔢 explainNumber(${number}) - Début, arrêt des animations précédentes`);
    
    // Arrêter toute animation/vocal en cours (y compris "Démarrer")
    stopAllVocalsAndAnimations();
    
    // Attendre un délai plus long pour s'assurer que l'arrêt est effectif
    await wait(300);
    
    // Vérifier une dernière fois si quelque chose joue encore
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      await wait(100);
    }
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setAnimatingWriting(true);
    setWritingStep('showing');
    
    try {
      scrollToIllustration();
      
      const word = numberWords[number as keyof typeof numberWords];
      await playAudio(`Très bien ! Tu as choisi le chiffre ${number} !`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      setWritingStep('digit');
      await playAudio(`Le chiffre ${number} s'écrit en lettres comme ça :`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      setWritingStep('word');
      await playAudio(`${word} !`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      // ÉPELLATION lettre par lettre
      setWritingStep('spelling');
      setCurrentLetterIndex(-1);  // Commencer sans aucune lettre en surbrillance
      
      // Attendre que l'élément d'épellation soit affiché, puis scroller vers lui
      setTimeout(() => {
        console.log('⏰ setTimeout pour scroll vers animation déclenché');
        scrollToSpelling();
      }, 500);
      
      await playAudio(`Maintenant, épelons ensemble :`);
      if (stopSignalRef.current) return;
      await wait(500);

      // Épeler chaque lettre du mot avec illustration visuelle
      const letters = word.split('');
      for (let i = 0; i < letters.length; i++) {
        if (stopSignalRef.current) break;
        
        // Mettre en évidence la lettre courante
        setCurrentLetterIndex(i);
        const letter = letters[i];
        
        if (letter === '-') {
          await playAudio(`trait d'union`);
        } else {
          await playAudio(letter);
        }
        
        if (stopSignalRef.current) break;
        await wait(600);  // Un peu plus long pour voir la lettre
      }
      
      // Montrer toutes les lettres à la fin
      setCurrentLetterIndex(letters.length);
      
      if (stopSignalRef.current) return;
      await wait(1000);  // Plus long pour admirer le mot complet
      
      await playAudio(`Parfait ! Le chiffre ${number} s'épelle ${word} !`);
      if (stopSignalRef.current) return;
      await wait(1200);
      
      setWritingStep('final');
      await playAudio(`Maintenant tu sais que ${number} s'écrit "${word}" en lettres !`);
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Tu peux choisir un autre chiffre pour continuer à apprendre !");
      
    } catch (error) {
      console.error('Erreur dans explainNumber:', error);
    } finally {
      console.log('🔢 explainNumber - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setAnimatingWriting(false);
      setWritingStep(null);
      setCurrentLetterIndex(-1);
      setExampleAnimating(false);
      setExampleLetterIndex(-1);
    }
  };

  // Fonction pour rendre les cercles CSS - SIMPLE
  const renderCircles = (number: number) => {
    if (!number || number > 20) return null;

    const circles = [];
    
    // Créer simplement le bon nombre de cercles rouges
    for (let i = 1; i <= number; i++) {
      const isAnimated = animatingPoints.includes(i);
      
      circles.push(
        <div
          key={i}
          className={`inline-block w-8 h-8 rounded-full mx-1 my-1 transition-all duration-300 bg-red-500 ${
            isAnimated ? 'ring-4 ring-yellow-400 bg-yellow-300 animate-bounce scale-125' : ''
          }`}
        />
      );
    }
    
    return circles;
  };

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // EFFET pour arrêter les audios lors du changement de page/onglet
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopAllVocalsAndAnimations();
    };
  }, []);

  // EFFET pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    if (showExercises) {
      stopAllVocalsAndAnimations();
      // IMPORTANT : Réinitialiser l'état de l'intro pirate pour qu'elle puisse redémarrer
      setPirateIntroStarted(false);
      setShowExercisesList(false);
      // Réinitialiser l'exercice en cours
      if (exercises.length > 0) {
        setCurrentExercise(0);
        setUserAnswer('');
        setIsCorrect(null);
      }
      // CRITIQUE : Remettre stopSignalRef à false après avoir arrêté les animations
      setTimeout(() => {
        stopSignalRef.current = false;
      }, 100);
    } else {
      // Quand on revient dans la section cours, remettre le bouton DÉMARRER
      setHasStarted(false);
      stopSignalRef.current = false;
    }
  }, [showExercises]);

  // UseEffect pour forcer la remise à zéro du champ de réponse quand on change d'exercice
  useEffect(() => {
    console.log('🔄 Nouvel exercice:', currentExercise + 1, '- Remise à zéro du champ');
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
    setHighlightedElement(null);
  }, [currentExercise]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ecriture',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-20-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ecriture');
      
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

    localStorage.setItem('cp-nombres-20-progress', JSON.stringify(allProgress));
  };

  // Correspondances nombres/mots
  const numberWords = {
    1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq',
    6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix',
    11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze',
    16: 'seize', 17: 'dix-sept', 18: 'dix-huit', 19: 'dix-neuf', 20: 'vingt'
  };

  // Exercices d'écriture - INVERSE : du chiffre vers le mot
  const exercises = [
    { question: 'Écris en lettres le nombre :', number: '5', correctAnswer: 'cinq', word: 'cinq' },
    { question: 'Écris en lettres le nombre :', number: '8', correctAnswer: 'huit', word: 'huit' },
    { question: 'Écris en lettres le nombre :', number: '12', correctAnswer: 'douze', word: 'douze' },
    { question: 'Écris en lettres le nombre :', number: '15', correctAnswer: 'quinze', word: 'quinze' },
    { question: 'Écris en lettres le nombre :', number: '3', correctAnswer: 'trois', word: 'trois' },
    { question: 'Écris en lettres le nombre :', number: '17', correctAnswer: 'dix-sept', word: 'dix-sept' },
    { question: 'Écris en lettres le nombre :', number: '9', correctAnswer: 'neuf', word: 'neuf' },
    { question: 'Écris en lettres le nombre :', number: '11', correctAnswer: 'onze', word: 'onze' },
    { question: 'Écris en lettres le nombre :', number: '6', correctAnswer: 'six', word: 'six' },
    { question: 'Écris en lettres le nombre :', number: '14', correctAnswer: 'quatorze', word: 'quatorze' },
    { question: 'Écris en lettres le nombre :', number: '20', correctAnswer: 'vingt', word: 'vingt' },
    { question: 'Écris en lettres le nombre :', number: '13', correctAnswer: 'treize', word: 'treize' },
    { question: 'Écris en lettres le nombre :', number: '18', correctAnswer: 'dix-huit', word: 'dix-huit' },
    { question: 'Écris en lettres le nombre :', number: '7', correctAnswer: 'sept', word: 'sept' },
    { question: 'Écris en lettres le nombre :', number: '16', correctAnswer: 'seize', word: 'seize' }
  ];

  // Plus besoin des choix multiples - gardé pour compatibilité
  useEffect(() => {
    // Exercices utilisant saisie libre maintenant
  }, [currentExercise]);

  // handleAnswerSubmit modifiée avec la même gestion d'interruption que le cours
  const handleAnswerSubmit = async (answer: string) => {
    if (!answer.trim() || isPlayingVocal) return;
    
    const correctAnswer = exercises[currentExercise].correctAnswer;
    // Comparaison insensible à la casse et aux espaces pour les mots
    const correct = answer.trim().toLowerCase() === correctAnswer.toLowerCase();
    
    setUserAnswer(answer);
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    // Réaction vocale avec même gestion que le cours
    if (correct) {
      await celebrateCorrectAnswer();
      
      // Passage automatique à l'exercice suivant après 1.5s
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          // Le useEffect va s'occuper de réinitialiser les états quand currentExercise change
          setCurrentExercise(currentExercise + 1);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
    } else {
      // Mauvaise réponse → Explication avec Sam le Pirate
      setTimeout(async () => {
        await explainWrongAnswer();
      }, 500);
    }
  };

  // nextExercise modifiée pour réinitialiser les boutons Sam le Pirate
  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    
    if (currentExercise < exercises.length - 1) {
      // Le useEffect va s'occuper de réinitialiser les états quand currentExercise change
      setCurrentExercise(currentExercise + 1);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  // resetAll modifiée pour inclure les états Sam le Pirate
  const resetAll = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    // Le useEffect va s'occuper de réinitialiser userAnswer, isCorrect, etc. quand currentExercise change
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setExerciseStarted(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
    // Forcer le redémarrage de l'intro après un court délai
    setTimeout(() => {
      stopSignalRef.current = false;
    }, 100);
  };

  // JSX pour le bouton "Écouter l'énoncé"
  const ListenQuestionButtonJSX = () => (
    <button
      id="listen-question-button"
      onClick={() => {
        console.log('🔘 Bouton "Écouter l\'énoncé" cliqué');
        startExerciseExplanation();
      }}
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
    <div className="flex justify-center p-1 mt-2">
      <div className="flex items-center gap-2">
        {/* Image de Sam le Pirate */}
        <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 shadow-md transition-all duration-300 ${
          isPlayingVocal
            ? 'w-20 sm:w-32 h-20 sm:h-32 scale-110 sm:scale-150' // When speaking - agrandi mobile
            : pirateIntroStarted
              ? 'w-16 sm:w-16 h-16 sm:h-16' // After "COMMENCER" clicked (reduced) - agrandi mobile
              : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
        }`}>
          <img 
            src="/image/pirate-small.png" 
            alt="Sam le Pirate" 
            className="w-full h-full rounded-full object-cover"
          />
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
          animationDuration: !isPlayingVocal && !pirateIntroStarted ? '1.2s' : '2s',
          animationIterationCount: isPlayingVocal || pirateIntroStarted ? 'none' : 'infinite',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          boxShadow: !isPlayingVocal && !pirateIntroStarted 
            ? '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' 
            : ''
        }}
      >
        {/* Effet de brillance */}
        {!isPlayingVocal && !pirateIntroStarted && (
          <div 
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            style={{
              animation: 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          ></div>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              ✍️ Écrire les nombres
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Apprends à écrire les nombres en chiffres !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-3 sm:mb-2">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                if (!isPlayingVocal) {
                  stopAllVocalsAndAnimations();
                  setShowExercises(false);
                }
              }}
              disabled={isPlayingVocal}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                isPlayingVocal
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : !showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                if (!isPlayingVocal) {
                  stopAllVocalsAndAnimations();
                  setShowExercises(true);
                }
              }}
              disabled={isPlayingVocal}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                isPlayingVocal
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-3 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-4 p-4 mb-6">
                {/* Image de Sam le Pirate */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                isPlayingVocal
                  ? 'w-20 sm:w-24 h-20 sm:h-24' // When speaking - agrandi mobile
                  : samSizeExpanded
                    ? 'w-16 sm:w-32 h-16 sm:h-32' // Enlarged - agrandi mobile
                    : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
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
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-12 py-3 sm:py-6 rounded-xl font-bold text-base sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                }`}
              >
                  <Play className="inline w-5 h-5 sm:w-8 sm:h-8 mr-2 sm:mr-4" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
            </div>
              </div>



            {/* Introduction - RESPONSIVE MOBILE OPTIMISÉE */}
            <div 
              id="example-section"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-500 relative ${
                highlightedElement === 'example-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-3 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  🤔 Comment écrire un chiffre en lettres ?
                </h2>
                {/* Bouton d'animation à côté du titre */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-transform duration-300 ring-2 ring-orange-300 ring-opacity-40" 
                     title="✍️ Animation d'écriture disponible ! Cliquez pour voir comment le chiffre 5 s'écrit en lettres."
                     onClick={async () => {
                       if (!isPlayingVocal) {
                         stopAllVocalsAndAnimations();
                         await new Promise(resolve => setTimeout(resolve, 100));
                         
                         stopSignalRef.current = false;
                         setIsPlayingVocal(true);
                         setExampleAnimating(true);
                         
                         try {
                           await playAudio("Regardez bien ! Le chiffre 5 s'écrit 'cinq' en lettres !");
                           if (stopSignalRef.current) return;
                           await wait(800);
                           
                           // Animation lettre par lettre
                           const word = "cinq";
                           setExampleLetterIndex(-1);
                           for (let i = 0; i < word.length; i++) {
                             if (stopSignalRef.current) break;
                             setExampleLetterIndex(i);
                             await playAudio(word[i]);
                             if (stopSignalRef.current) break;
                             await wait(600);
                           }
                           
                           setExampleLetterIndex(word.length);
                           await playAudio("Et voilà ! Le chiffre 5 s'épelle c-i-n-q !");
                           if (stopSignalRef.current) return;
                           await wait(1500);
                           
                         } catch (error) {
                           console.error('Erreur animation exemple:', error);
                         } finally {
                           setExampleAnimating(false);
                           setExampleLetterIndex(-1);
                           setIsPlayingVocal(false);
                         }
                       }
                     }}
                     style={{
                       animation: 'gentle-pulse 2.5s ease-in-out infinite'
                     }}>
                  ✍️
                </div>
              </div>
              <style jsx>{`
                @keyframes gentle-pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.75; transform: scale(1.08); }
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              <div className="bg-orange-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-sm sm:text-lg text-center text-orange-800 font-semibold mb-2 sm:mb-4">
                  Écrire un chiffre en lettres, c'est transformer le symbole en mot !
                </p>
                
                <div 
                  className={`bg-white rounded-lg p-2 sm:p-4 transition-all duration-500 relative ${
                    highlightedElement === 'example-box' ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-base sm:text-xl font-bold text-orange-600 mb-2 sm:mb-4">
                      <div className="mb-1 sm:mb-2">Exemple :</div>
                      <div className="flex justify-center items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <span className="text-lg sm:text-2xl font-bold text-blue-600">5</span>
                        <span className="text-lg sm:text-2xl font-bold mx-1 sm:mx-2">→</span>
                        <div className="flex gap-1 sm:gap-2 overflow-visible">
                          {/* Animation des lettres pour l'exemple */}
                          {exampleAnimating ? (
                            <div className="mb-2 sm:mb-4 py-4 overflow-visible">
                              {renderWordWithHighlight("cinq", exampleLetterIndex)}
                            </div>
                          ) : (
                            <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-2 sm:mb-4 whitespace-nowrap">
                              CINQ
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`text-sm sm:text-xl text-gray-700 mb-2 sm:mb-4 transition-all duration-500 ${
                        highlightedElement === 'writing-explanation' ? 'bg-yellow-200 rounded-lg p-2 scale-110' : ''
                      }`}
                    >
                      Le chiffre "5" s'écrit "cinq" en lettres !
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre principal */}
            <div 
              id="number-choice-grid"
              className={`bg-white rounded-xl p-4 md:p-8 shadow-lg transition-all duration-500 relative ${
                highlightedElement === 'number-choice' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  🎯 Choisis un chiffre
                </h2>
                <div className="relative group">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg hover:scale-110 transition-transform duration-300 ring-2 ring-orange-300 ring-opacity-40" 
                       style={{
                         animation: 'gentle-pulse 2.5s ease-in-out infinite'
                       }}>
                    ✍️
                  </div>
                  
                  {/* Tooltip au survol */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-gray-800 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                      👆 Clique sur un chiffre ci-dessous pour voir comment l'écrire en lettres !
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Grille responsive optimisée mobile */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 md:gap-3 max-w-4xl mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map((num) => {
                  return (
                  <button
                      key={num}
                      id={`number-${num}`}
                    onClick={() => {
                        if (!isPlayingVocal) {
                          stopAllVocalsAndAnimations();
                          setSelectedNumber(parseInt(num));
                          // Scroll vers l'illustration après une courte pause pour voir le bouton sélectionné
                          setTimeout(() => {
                            scrollToIllustration();
                            explainNumber(parseInt(num));
                          }, 300);
                        }
                      }}
                      disabled={isPlayingVocal}
                      className={`p-3 sm:p-2 md:p-3 rounded-lg font-bold text-base sm:text-sm md:text-lg transition-all hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        isPlayingVocal
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : selectedNumber === parseInt(num)
                            ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                      } ${
                        highlightedElement === `number-${num}` ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110' : ''
                      }`}
                    >
                      {num}
                  </button>
                  );
                })}
              </div>
            </div>

            {/* Affichage détaillé */}
            <div 
              id="number-illustration"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                animatingWriting ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Comment écrire le chiffre {selectedNumber}
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div className={`text-6xl font-bold text-yellow-600 transition-all duration-500 ${
                    writingStep === 'digit' ? 'ring-4 ring-yellow-400 bg-yellow-200 rounded-lg p-4 scale-110' : ''
                  }`}>
                    {selectedNumber}
                  </div>
                  
                  <div className={`font-bold text-orange-600 transition-all duration-500 whitespace-nowrap ${
                    writingStep === 'word' ? 'ring-4 ring-orange-400 bg-orange-200 rounded-lg p-4 scale-110' : ''
                  } ${
                    // Adapter la taille selon la longueur du mot
                    (() => {
                      const word = numberWords[selectedNumber as keyof typeof numberWords] || '';
                      if (word.length <= 4) return 'text-4xl sm:text-5xl';
                      if (word.length <= 6) return 'text-3xl sm:text-4xl';
                      if (word.length <= 8) return 'text-2xl sm:text-3xl';
                      return 'text-xl sm:text-2xl';
                    })()
                  }`}>
                    {numberWords[selectedNumber as keyof typeof numberWords]}
                            </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    {/* Affichage simplifié - focus sur l'écriture */}
                    <div className={`mb-4 flex flex-wrap justify-center gap-1 min-h-[40px] transition-all duration-500 ${
                      writingStep === 'showing' ? 'ring-4 ring-blue-400 bg-blue-50 rounded-lg p-2' : ''
                    }`}>
                      {/* Affichage minimaliste - juste pour montrer la quantité */}
                      {selectedNumber <= 10 ? renderCircles(selectedNumber) : (
                        <div className="text-lg text-gray-600">
                          {selectedNumber} objets
                          </div>
                      )}
                        </div>

                    {writingStep === 'spelling' && (
                      <div id="spelling-animation" className="mb-4 p-4 bg-purple-100 rounded-lg">
                        <div className="text-lg font-bold text-purple-600 mb-3 text-center">
                          📝 Épelons lettre par lettre :
                        </div>
                        <div className="px-2 py-6 overflow-visible">
                          {renderWordWithHighlight(numberWords[selectedNumber as keyof typeof numberWords], currentLetterIndex)}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`bg-blue-100 rounded-lg p-4 transition-all duration-500 ${
                        writingStep === 'digit' || writingStep === 'showing' ? 'ring-2 ring-blue-400 scale-105' : ''
                      }`}>
                        <div className="font-bold text-blue-800 mb-2">Le chiffre :</div>
                        <div className="text-3xl font-bold text-blue-600">{selectedNumber}</div>
                            </div>
                      
                      <div className={`bg-orange-100 rounded-lg p-4 transition-all duration-500 ${
                        writingStep === 'word' || writingStep === 'final' ? 'ring-2 ring-orange-400 scale-105' : ''
                      }`}>
                        <div className="font-bold text-orange-800 mb-2">S'écrit en lettres :</div>
                        <div className={`font-bold text-orange-600 whitespace-nowrap ${
                          // Adapter la taille selon la longueur du mot
                          (() => {
                            const word = numberWords[selectedNumber as keyof typeof numberWords] || '';
                            if (word.length <= 4) return 'text-2xl sm:text-3xl';
                            if (word.length <= 6) return 'text-xl sm:text-2xl';
                            if (word.length <= 8) return 'text-lg sm:text-xl';
                            return 'text-base sm:text-lg';
                          })()
                        }`}>
                          {numberWords[selectedNumber as keyof typeof numberWords]}
                        </div>
                      </div>
                    </div>

                    {writingStep === 'final' && (
                      <div className="mt-4 p-3 bg-green-100 rounded-lg border-2 border-green-300 animate-pulse">
                        <p className="text-lg font-bold text-green-800 text-center">
                          ✅ Parfait ! Le chiffre {selectedNumber} s'écrit "{numberWords[selectedNumber as keyof typeof numberWords]}" !
                        </p>
                      </div>
                    )}
                    </div>
                    </div>
                  </div>
            </div>

            {/* Tableau de correspondance */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                📊 Tableau de correspondance
              </h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
                {Object.entries(numberWords).map(([num, word]) => (
                  <div key={num} className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-2 sm:p-4 text-center">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600 mb-1 sm:mb-2">
                      {num}
                    </div>
                    <div className={`font-semibold text-yellow-700 whitespace-nowrap ${
                      // Adapter la taille selon la longueur du mot - Version mobile optimisée
                      word.length <= 4 ? 'text-sm sm:text-lg' :
                      word.length <= 6 ? 'text-xs sm:text-base' :
                      word.length <= 8 ? 'text-xs sm:text-sm' :
                      'text-xs'
                    }`}>
                      {word}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nombres difficiles */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ⚠️ Nombres à retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔥 Les plus difficiles
                    </h3>
                    <div className="space-y-3">
                      {[
                      { num: '11', word: 'onze' },
                      { num: '12', word: 'douze' },
                      { num: '13', word: 'treize' },
                      { num: '14', word: 'quatorze' },
                      { num: '15', word: 'quinze' },
                      { num: '16', word: 'seize' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 flex justify-between items-center">
                        <span className="font-bold text-red-600">{item.num}</span>
                        <span className={`text-gray-700 whitespace-nowrap ${
                          item.word.length <= 6 ? 'text-base' : 
                          item.word.length <= 8 ? 'text-sm' : 'text-xs'
                        }`}>{item.word}</span>
                      </div>
                      ))}
                    </div>
                  </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    📝 Avec trait d'union
                    </h3>
                    <div className="space-y-3">
                      {[
                      { num: '17', word: 'dix-sept' },
                      { num: '18', word: 'dix-huit' },
                      { num: '19', word: 'dix-neuf' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 flex justify-between items-center">
                        <span className="font-bold text-blue-600">{item.num}</span>
                        <span className={`text-gray-700 whitespace-nowrap ${
                          item.word.length <= 6 ? 'text-base' : 
                          item.word.length <= 8 ? 'text-sm' : 'text-xs'
                        }`}>{item.word}</span>
                      </div>
                    ))}
                  </div>
                    </div>
                  </div>
                </div>

            {/* Conseils */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Méthodes
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Lis le mot à voix haute</li>
                    <li>• Compte avec tes doigts</li>
                    <li>• Écris plusieurs fois le chiffre</li>
                    <li>• Associe à des objets familiers</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">
                    🧠 Astuces
                  </h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>• "onze" ressemble à "1+1"</li>
                    <li>• "quinze" → "quin" = 15</li>
                    <li>• "dix-sept" = 10 + 7</li>
                    <li>• Fais des groupes de mots similaires</li>
                  </ul>
                  </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎮 Mini-jeu : Écris en lettres !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { number: '3', answer: 'trois' },
                  { number: '8', answer: 'huit' },
                  { number: '12', answer: 'douze' },
                  { number: '16', answer: 'seize' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold mb-2">{item.number}</div>
                    <div className={`font-bold whitespace-nowrap ${
                      item.answer.length <= 6 ? 'text-base' : 'text-sm'
                    }`}>{item.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES - RESPONSIVE MOBILE OPTIMISÉ (HISTORIQUE) */
          <div className="pb-20 sm:pb-0">
            {/* Introduction de Sam le Pirate - toujours visible */}
            {SamPirateIntroJSX()}

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-2 shadow-lg mt-8">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Exercice {currentExercise + 1}
                </h2>
                
                <div className="text-sm font-bold text-blue-600">
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

            {/* Question - MOBILE ULTRA-OPTIMISÉ - AVEC BOUTON ÉCOUTER */}
            <div className="fixed inset-x-4 bottom-4 top-72 bg-white rounded-xl shadow-lg text-center overflow-y-auto flex flex-col sm:relative sm:inset-x-auto sm:bottom-auto sm:top-auto sm:p-6 md:p-8 sm:mt-8 sm:flex-none sm:overflow-visible">
              {/* Indicateur de progression mobile - toujours visible en haut */}
              <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b border-gray-200 sm:hidden">
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
              
              <div className="flex-1 p-3 overflow-y-auto sm:p-0 sm:overflow-visible">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 sm:mb-6 md:mb-8 gap-4">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise]?.question || "Écris en lettres"}
                </h3>
                {ListenQuestionButtonJSX()}
              </div>
              
              {/* Affichage du chiffre avec explication si erreur */}
              <div className={`bg-white border-2 rounded-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-all duration-500 ${
                isExplainingError ? 'border-yellow-400 bg-yellow-50 ring-4 ring-yellow-300' : 'border-orange-200'
              }`}>
                <div className="py-6 sm:py-8 md:py-10">
                  {/* Affichage du chiffre */}
                  <div className="text-6xl sm:text-8xl font-bold text-blue-600 mb-4">
                    {exercises[currentExercise]?.number}
                  </div>
                  <p className="text-sm sm:text-lg text-gray-700 font-semibold mb-6 hidden sm:block">
                    Écris ce nombre en lettres !
                  </p>
                  
                  {/* Message d'explication avec la bonne réponse en rouge */}
                  {isExplainingError && (
                    <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
                      <div className="text-lg font-bold text-red-800 mb-2">
                        🏴‍☠️ Explication de Sam le Pirate
                      </div>
                      
                      {/* Animation d'épellation lettre par lettre */}
                      {exerciseAnimating ? (
                        <div className="mb-4">
                          <div className="text-red-700 text-xl mb-3">
                            La bonne réponse est :
                          </div>
                          <div className="py-4 overflow-visible">
                            {renderWordWithHighlight(exercises[currentExercise]?.correctAnswer || "", exerciseLetterIndex)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-700 text-xl">
                          La bonne réponse est <span className="font-bold text-3xl text-red-800">{exercises[currentExercise]?.correctAnswer}</span> !
                        </div>
                      )}
                      
                      <div className="text-sm text-red-600 mt-2">
                        Le nombre "{exercises[currentExercise]?.number}" s'écrit "{exercises[currentExercise]?.correctAnswer}" en lettres !
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
                    onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit(userAnswer)}
                    onClick={() => stopAllVocalsAndAnimations()}
                    disabled={isCorrect !== null || isPlayingVocal}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xl sm:text-2xl font-bold text-center border-4 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white"
                    placeholder="Ex: cinq"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>
              
              {/* Boutons Valider et Suivant */}
              <div className="sticky bottom-0 bg-white pt-4 mt-auto sm:mb-6 sm:static sm:pt-0">
                  <div className="flex gap-4 justify-center">
                    <button
                    id="validate-button"
                    onClick={() => handleAnswerSubmit(userAnswer)}
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
                    disabled={(!isExplainingError && isCorrect !== false) || isPlayingVocal}
                    className={`bg-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-lg sm:text-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'next-exercise-button' || highlightNextButton ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
                    } ${
                      isExplainingError || isCorrect === false ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    Suivant →
                    </button>
                  </div>
              </div>
              </div>
              
              {/* Résultat - Simplifié */}
              {isCorrect !== null && isCorrect && (
                <div className="p-4 sm:p-6 rounded-lg mb-6 bg-green-100 text-green-800">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    <span className="font-bold text-lg sm:text-xl">
                      Bravo ! {exercises[currentExercise].number} = "{exercises[currentExercise].correctAnswer}" !
                    </span>
                  </div>
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
                  if (percentage >= 90) return { title: "🎉 Expert de l'écriture des nombres !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
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
                        Savoir écrire les nombres est très important !
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

        {/* Bouton flottant Sam pour arrêter les vocaux */}
        {isPlayingVocal && (
          <div className="fixed top-4 right-4 z-[60]">
            <button
              onClick={stopAllVocalsAndAnimations}
              className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
              title="Arrêter Sam"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
                <img 
                  src="/image/pirate-small.png" 
                  alt="Sam le Pirate" 
                  className="w-full h-full object-cover"
                />
              </div>
              <>
                <span className="text-sm font-bold hidden sm:block">Stop</span>
                <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
              </>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 