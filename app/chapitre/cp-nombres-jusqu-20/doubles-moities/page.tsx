'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Play, Pause } from 'lucide-react';

export default function DoublesMoitiesCP() {
  const [selectedType, setSelectedType] = useState('doubles');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // Nouveaux états pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingDoubles, setAnimatingDoubles] = useState(false);
  const [animatingMoities, setAnimatingMoities] = useState(false);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'addition' | 'division' | null>(null);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingDoubles(false);
    setAnimatingMoities(false);
    setHighlightedNumber(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setShowingProcess(null);
    
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    
    setTimeout(() => {
      speechSynthesis.cancel();
    }, 100);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const femaleVoiceNames = ['Amélie', 'Audrey', 'Marie', 'Julie', 'Céline', 'Virginie'];
      
      let selectedVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && 
        femaleVoiceNames.some(name => voice.name.includes(name))
      );

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === 'fr-FR' && 
          (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'))
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'fr-FR' && voice.localService);
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'fr-FR');
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.onend = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      utterance.onerror = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
  };

  // Fonction utilitaire pour les pauses
  const wait = (ms: number) => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve(undefined);
        return;
      }
      setTimeout(resolve, ms);
    });
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Fonction pour expliquer le chapitre
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setHasStarted(true);
    
    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre ce que sont les doubles et les moitiés.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Tu vas découvrir comment doubler un nombre et comment le partager en deux !", true);
      if (stopSignalRef.current) return;
      
      // 2. Explication des doubles avec animations sur la BOX DOUBLES
      await wait(1800);
      setHighlightedElement('concept-section');
      await playAudio("Commençons par les doubles. Un double, c'est quand on ajoute un nombre à lui-même !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Regardons ensemble l'exemple du double de 3.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(3);
      await playAudio("Ici, j'ai 3 cercles rouges.", true);
      if (stopSignalRef.current) return;
      
        await wait(1200);
      setShowingProcess('addition');
      await playAudio("Pour faire le double, j'ajoute 3 plus 3.", true);
      if (stopSignalRef.current) return;
      
      await wait(1800);
      setHighlightedNumber(6);
      await playAudio("3 plus 3 égale 6 ! Le double de 3, c'est 6 !", true);
      if (stopSignalRef.current) return;
      
        await wait(1500);
      await playAudio("C'est comme avoir des chaussettes : toujours par paires identiques !", true);
      if (stopSignalRef.current) return;
      
      // 3. Explication des moitiés avec animations sur la BOX MOITIÉS
        await wait(2000);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setHighlightedElement('moities-concept-section');
      
      await playAudio("Maintenant, parlons des moitiés. Une moitié, c'est partager en deux parts égales !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Regardons l'exemple de la moitié de 6.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(6);
      await playAudio("J'ai 6 cercles rouges.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('division');
      await playAudio("Pour faire la moitié, je partage 6 en deux groupes égaux.", true);
      if (stopSignalRef.current) return;
      
      await wait(1800);
      setHighlightedNumber(3);
      await playAudio("6 divisé par 2 égale 3 ! La moitié de 6, c'est 3 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("C'est comme couper un gâteau en deux parts identiques !", true);
      if (stopSignalRef.current) return;
      
      // 4. Présentation des autres exemples - illuminer les BOUTONS de choix
      await wait(2500);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setHighlightedElement(null);
      await playAudio("Parfait ! Maintenant tu comprends les concepts de base.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a d'autres exemples à découvrir pour bien maîtriser !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      scrollToSection('selector-section');
      await playAudio("Regarde ici !", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedElement('doubles-button');
      await playAudio("Il y a d'autres exemples de doubles à explorer...", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('moities-button');
      await playAudio("...et d'autres exemples de moitiés aussi !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedElement('selector-section');
      await playAudio("Clique sur ton choix pour voir tous les exemples avec leurs animations !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
    }
  };

  // Fonction pour expliquer les doubles en général
  const explainDoublesGeneral = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingDoubles(true);
      setHighlightedElement('doubles-section');
      scrollToSection('doubles-section');
      
      await playAudio("Parfait ! Tu as choisi d'apprendre les doubles !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Voici tous les exemples de doubles que tu peux découvrir !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Clique sur l'explication à côté de chaque exemple pour voir l'animation détaillée !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Ou clique sur 'Voir tous les exemples' pour les découvrir d'affilée !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
    } finally {
      setAnimatingDoubles(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer un double spécifique
  const explainSpecificDouble = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const item = doublesData[index];
    
    try {
      setCurrentExample(index);
      setAnimatingStep('introduction');
      scrollToSection('doubles-section');
      
      await playAudio(`Je vais t'expliquer le double de ${item.number}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(item.number);
      await playAudio(`Ici, j'ai le nombre ${item.number}. Je vois ${item.number} cercle${item.number > 1 ? 's' : ''} rouge${item.number > 1 ? 's' : ''}.`, true);
      if (stopSignalRef.current) return;
        
        await wait(1200);
      setShowingProcess('addition');
      await playAudio(`Pour faire le double, j'ajoute ${item.number} plus ${item.number}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(item.double);
      await playAudio(`Résultat : ${item.number} plus ${item.number} égale ${item.double} ! Le double de ${item.number}, c'est ${item.double} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer tous les doubles d'affilée
  const explainAllDoubles = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingDoubles(true);
      scrollToSection('doubles-section');
      
      await playAudio("Je vais te montrer tous les doubles un par un !", true);
      if (stopSignalRef.current) return;
      
      for (let i = 0; i < doublesData.length; i++) {
        if (stopSignalRef.current) return;
        await explainSpecificDouble(i);
        await wait(1000);
      }
      
      await playAudio("Voilà ! Tu connais maintenant tous les doubles !", true);
      if (stopSignalRef.current) return;
      
    } finally {
      setAnimatingDoubles(false);
    }
  };

  // Fonction pour expliquer les moitiés en général
  const explainMoitiesGeneral = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingMoities(true);
      setHighlightedElement('moities-section');
      scrollToSection('moities-section');
      
      await playAudio("Excellent choix ! Tu as choisi d'apprendre les moitiés !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Voici tous les exemples de moitiés que tu peux découvrir !", true);
      if (stopSignalRef.current) return;
      
        await wait(1200);
      await playAudio("Clique sur l'explication à côté de chaque exemple pour voir l'animation détaillée !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Ou clique sur 'Voir tous les exemples' pour les découvrir d'affilée !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
    } finally {
      setAnimatingMoities(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer une moitié spécifique
  const explainSpecificMoitie = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const item = moitiesData[index];
    
    try {
      setCurrentExample(index);
      setAnimatingStep('introduction');
      scrollToSection('moities-section');
      
      await playAudio(`Je vais t'expliquer la moitié de ${item.number}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(item.number);
      await playAudio(`Ici, j'ai le nombre ${item.number}. Je vois ${item.number} cercle${item.number > 1 ? 's' : ''} rouge${item.number > 1 ? 's' : ''}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setShowingProcess('division');
      await playAudio(`Pour faire la moitié, je partage ${item.number} en deux groupes égaux.`, true);
      if (stopSignalRef.current) return;
      
        await wait(1500);
      setHighlightedNumber(item.half);
      await playAudio(`${item.number} divisé par 2 égale ${item.half} ! La moitié de ${item.number}, c'est ${item.half} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
    }
  };

  // Fonction pour expliquer toutes les moitiés d'affilée
  const explainAllMoities = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      setAnimatingMoities(true);
      scrollToSection('moities-section');
      
      await playAudio("Je vais te montrer toutes les moitiés une par une !", true);
      if (stopSignalRef.current) return;
      
      for (let i = 0; i < moitiesData.length; i++) {
        if (stopSignalRef.current) return;
        await explainSpecificMoitie(i);
        await wait(1000);
      }
      
      await playAudio("Voilà ! Tu connais maintenant toutes les moitiés !", true);
      if (stopSignalRef.current) return;
      
    } finally {
      setAnimatingMoities(false);
    }
  };

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'doubles-moities',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'doubles-moities');
      
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

  // Données sur les doubles et moitiés
  const doublesData = [
    { number: 1, double: 2 },
    { number: 2, double: 4 },
    { number: 3, double: 6 },
    { number: 4, double: 8 },
    { number: 5, double: 10 }
  ];

  const moitiesData = [
    { number: 2, half: 1 },
    { number: 4, half: 2 },
    { number: 6, half: 3 },
    { number: 8, half: 4 },
    { number: 10, half: 5 }
  ];

  // Exercices sur les doubles et moitiés
  const exercises = [
    { question: 'Quel est le double de 2 ?', correctAnswer: '4', choices: ['3', '4', '5'], type: 'double' },
    { question: 'Quel est le double de 3 ?', correctAnswer: '6', choices: ['5', '6', '7'], type: 'double' },
    { question: 'Quel est le double de 4 ?', correctAnswer: '8', choices: ['7', '8', '9'], type: 'double' },
    { question: 'Quel est le double de 1 ?', correctAnswer: '2', choices: ['1', '2', '3'], type: 'double' },
    { question: 'Quel est le double de 5 ?', correctAnswer: '10', choices: ['9', '10', '11'], type: 'double' },
    { question: 'Quelle est la moitié de 4 ?', correctAnswer: '2', choices: ['1', '2', '3'], type: 'moitie' },
    { question: 'Quelle est la moitié de 6 ?', correctAnswer: '3', choices: ['2', '3', '4'], type: 'moitie' },
    { question: 'Quelle est la moitié de 8 ?', correctAnswer: '4', choices: ['3', '4', '5'], type: 'moitie' },
    { question: 'Quelle est la moitié de 2 ?', correctAnswer: '1', choices: ['0', '1', '2'], type: 'moitie' },
    { question: 'Quelle est la moitié de 10 ?', correctAnswer: '5', choices: ['4', '5', '6'], type: 'moitie' },
    { question: 'Quel est le double de 3 ?', correctAnswer: '6', choices: ['4', '6', '8'], type: 'double' },
    { question: 'Quelle est la moitié de 6 ?', correctAnswer: '3', choices: ['1', '3', '5'], type: 'moitie' },
    { question: 'Quel est le double de 4 ?', correctAnswer: '8', choices: ['6', '8', '10'], type: 'double' },
    { question: 'Quelle est la moitié de 8 ?', correctAnswer: '4', choices: ['2', '4', '6'], type: 'moitie' },
    { question: 'Quel est le double de 2 ?', correctAnswer: '4', choices: ['2', '4', '6'], type: 'double' }
  ];
        
  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };
      
  // Fonction pour rendre les cercles CSS 
  const renderCircles = (count: number) => {
    if (count <= 0) return null;
    
    const circles = [];
    for (let i = 0; i < count; i++) {
      circles.push(
        <div
          key={i}
          className="w-6 h-6 bg-red-600 rounded-full inline-block transition-all duration-300"
          style={{ 
            animationDelay: `${i * 100}ms`,
            transform: highlightedNumber === count ? 'scale(1.2)' : 'scale(1)'
          }}
        />
      );
    }
    
    return (
      <div className="flex flex-wrap gap-1 justify-center items-center">
        {circles}
      </div>
    );
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements de visibilité de la page et navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page cachée - arrêt du vocal');
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      console.log('Avant déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      console.log('Navigation back/forward - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page masquée - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleUnload = () => {
      console.log('Déchargement - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleHashChange = () => {
      console.log('Changement de hash - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    const handleBlur = () => {
      console.log('Perte de focus fenêtre - arrêt du vocal');
      stopAllVocalsAndAnimations();
    };

    // Event listeners standard
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);

    // Override des méthodes history pour détecter navigation programmatique
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('Navigation programmatique pushState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      console.log('Navigation programmatique replaceState - arrêt du vocal');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  const handleAnswerClick = (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
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
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernier exercice terminé
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
    } else {
      // Si mauvaise réponse → scroll automatique vers le bouton "Suivant" (mobile)
      setTimeout(() => {
        const nextButton = document.getElementById('next-exercise-button');
        if (nextButton) {
          const isMobile = window.innerWidth < 768; // sm breakpoint
          
          if (isMobile) {
            // Pour mobile: scroll pour que le bouton apparaisse en bas de l'écran
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end', // En bas de l'écran
              inline: 'nearest' 
            });
            
            // Petit délai supplémentaire puis second scroll pour s'assurer de la visibilité
            setTimeout(() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }, 600);
          } else {
            // Pour desktop: scroll normal
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest' 
            });
          }
          
          // Animation d'attention sur le bouton
          setTimeout(() => {
            nextButton.classList.add('animate-bounce');
            setTimeout(() => {
              nextButton.classList.remove('animate-bounce');
            }, 2000);
          }, isMobile ? 1000 : 500);
        }
      }, 1000); // Délai pour laisser l'explication s'afficher
    }
  };

  const nextExercise = () => {
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
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };
    
    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 pb-8 sm:pb-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-4">
              🎯 Doubles et moitiés
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Découvre les doubles et les moitiés des nombres !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Bouton d'explication vocal principal */}
            <div className="text-center mb-4 sm:mb-6">
              <button
                onClick={explainChapter}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{
                  animationDuration: !hasStarted ? '2s' : 'none',
                  animationIterationCount: !hasStarted ? 'infinite' : 'none'
                }}
              >
                ▶️ COMMENCER !
              </button>
              

            </div>

            {/* Qu'est-ce qu'un double ? */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Qu'est-ce qu'un double ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-green-800 font-semibold mb-4">
                  Le double d'un nombre, c'est ce nombre + lui-même !
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      Exemple : Double de 3 = 3 + 3 = 6
                    </div>
                    <div className="text-xl text-gray-700 mb-4">
                      On ajoute 3 avec lui-même pour faire 6
                    </div>
                    <div className="flex justify-center items-center space-x-4 text-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">3 cercles</div>
                        {renderCircles(3)}
                      </div>
                      <div className="text-2xl text-green-600 font-bold">+</div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">3 cercles</div>
                        {renderCircles(3)}
                      </div>
                      <div className="text-2xl text-green-600 font-bold">=</div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">6 cercles</div>
                        {renderCircles(6)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Qu'est-ce qu'une moitié ? */}
            <div 
              id="moities-concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'moities-concept-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Qu'est-ce qu'une moitié ?
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-blue-800 font-semibold mb-4">
                  La moitié d'un nombre, c'est le partager en 2 parts égales !
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      Exemple : Moitié de 6 = 6 ÷ 2 = 3
                    </div>
                    <div className="text-xl text-gray-700 mb-4">
                      On partage 6 en 2 groupes égaux de 3
                    </div>
                    <div className="flex justify-center items-center space-x-4 text-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">6 cercles</div>
                        {renderCircles(6)}
                      </div>
                      <div className="text-2xl text-blue-600 font-bold">÷ 2 =</div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">3 cercles</div>
                        <div className="border-2 border-blue-300 rounded-lg p-2 bg-blue-50">
                          {renderCircles(3)}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">chaque part</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de type */}
            <div 
              id="selector-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'selector-section' ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis ce que tu veux apprendre
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  id="doubles-button"
                  onClick={() => {
                    setSelectedType('doubles');
                    explainDoublesGeneral();
                  }}
                  className={`p-6 rounded-lg font-bold text-xl transition-all ${
                    selectedType === 'doubles'
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${
                    highlightedElement === 'doubles-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                  }`}
                >
                  🎯 Les doubles
                </button>
                <button
                  id="moities-button"
                  onClick={() => {
                    setSelectedType('moities');
                    explainMoitiesGeneral();
                  }}
                  className={`p-6 rounded-lg font-bold text-xl transition-all ${
                    selectedType === 'moities'
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${
                    highlightedElement === 'moities-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''
                  }`}
                >
                  ✂️ Les moitiés
                </button>
              </div>
            </div>

            {/* Affichage des données */}
            {selectedType === 'doubles' ? (
              <div 
                id="doubles-section"
                className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                  animatingDoubles ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-center mb-6 space-x-4 flex-wrap gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    🎯 Tableau des doubles
                  </h2>
                  <button
                    onClick={explainAllDoubles}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                  >
                    🎬 Voir tous les exemples
                  </button>
                        </div>
                
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                  <p className="text-green-800">
                    💡 <strong>Astuce :</strong> Clique sur "▶️ Explication" à côté de chaque exemple pour voir l'animation détaillée ! Ou clique sur "🎬 Voir tous les exemples" pour découvrir tous les doubles d'affilée !
                  </p>
                        </div>
                
                {/* Indicateur d'étape */}
                {animatingStep && (
                  <div className="mb-4 p-3 rounded-lg bg-green-100 border-l-4 border-green-500">
                    <div className="text-lg font-bold text-green-800">
                      {animatingStep === 'introduction' && '🎯 Découverte des doubles'}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {doublesData.map((item, index) => (
                    <div 
                      key={index} 
                      className={`bg-green-50 rounded-lg p-6 transition-all duration-700 ${
                        currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                      }`}
                    >
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className={`text-3xl font-bold text-green-600 transition-all duration-500 ${
                            highlightedNumber === item.double ? 'text-4xl text-yellow-800 animate-pulse' : ''
                          }`}>
                            Double de {item.number} = {item.double}
                      </div>
                          <button
                            onClick={() => explainSpecificDouble(index)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm"
                          >
                            ▶️ Explication
                          </button>
                    </div>

                        <div className="bg-white rounded-lg p-4">
                          <div className={`text-xl text-gray-700 mb-4 transition-all duration-300 ${
                            showingProcess === 'addition' && currentExample === index ? 'text-2xl text-green-800 font-bold' : ''
                          }`}>
                            {item.number} + {item.number} = {item.double}
                          </div>
                          
                          <div className="flex justify-center items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-2">{item.number} cercles</div>
                              <div className={`transition-all duration-500 ${
                                highlightedNumber === item.number && currentExample === index ? 'scale-110' : ''
                              }`}>
                                {renderCircles(item.number)}
                              </div>
                            </div>
                            <div className={`text-2xl font-bold transition-all duration-300 ${
                              showingProcess === 'addition' && currentExample === index ? 'text-3xl text-green-600 animate-bounce' : 'text-green-600'
                            }`}>+</div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-2">{item.number} cercles</div>
                              <div className={`transition-all duration-500 ${
                                highlightedNumber === item.number && currentExample === index ? 'scale-110' : ''
                              }`}>
                                {renderCircles(item.number)}
                              </div>
                            </div>
                            <div className={`text-2xl font-bold transition-all duration-300 ${
                              showingProcess === 'addition' && currentExample === index ? 'text-3xl text-green-600 animate-bounce' : 'text-green-600'
                            }`}>=</div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-2">{item.double} cercles</div>
                              <div className={`transition-all duration-500 ${
                                highlightedNumber === item.double && currentExample === index ? 'scale-110 ring-4 ring-green-400 rounded-lg p-2' : ''
                              }`}>
                                {renderCircles(item.double)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div 
                id="moities-section"
                className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                  animatingMoities ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-center mb-6 space-x-4 flex-wrap gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    ✂️ Tableau des moitiés
                  </h2>
                      <button
                    onClick={explainAllMoities}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                  >
                    🎬 Voir tous les exemples
                      </button>
                    </div>
                
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                  <p className="text-blue-800">
                    💡 <strong>Astuce :</strong> Clique sur "▶️ Explication" à côté de chaque exemple pour voir l'animation détaillée ! Ou clique sur "🎬 Voir tous les exemples" pour découvrir toutes les moitiés d'affilée !
                  </p>
                  </div>
                
                {/* Indicateur d'étape */}
                {animatingStep && (
                  <div className="mb-4 p-3 rounded-lg bg-blue-100 border-l-4 border-blue-500">
                    <div className="text-lg font-bold text-blue-800">
                      {animatingStep === 'introduction' && '🎯 Découverte des moitiés'}
            </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {moitiesData.map((item, index) => (
                    <div 
                      key={index} 
                      className={`bg-blue-50 rounded-lg p-6 transition-all duration-700 ${
                        currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                      }`}
                    >
                      <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className={`text-3xl font-bold text-blue-600 transition-all duration-500 ${
                            highlightedNumber === item.half ? 'text-4xl text-yellow-800 animate-pulse' : ''
                          }`}>
                            Moitié de {item.number} = {item.half}
                    </div>
                          <button
                            onClick={() => explainSpecificMoitie(index)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm"
                          >
                            ▶️ Explication
                          </button>
                </div>
                        
                        <div className="bg-white rounded-lg p-4">
                          <div className={`text-xl text-gray-700 mb-4 transition-all duration-300 ${
                            showingProcess === 'division' && currentExample === index ? 'text-2xl text-blue-800 font-bold' : ''
                          }`}>
                            {item.number} ÷ 2 = {item.half}
              </div>

                          <div className="flex justify-center items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-2">{item.number} cercles</div>
                              <div className={`transition-all duration-500 ${
                                highlightedNumber === item.number && currentExample === index ? 'scale-110' : ''
                              }`}>
                                {renderCircles(item.number)}
                    </div>
                </div>
                            <div className={`text-2xl font-bold transition-all duration-300 ${
                              showingProcess === 'division' && currentExample === index ? 'text-3xl text-blue-600 animate-bounce' : 'text-blue-600'
                            }`}>÷ 2 =</div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-2">chaque part</div>
                              <div className={`border-2 border-blue-300 rounded-lg p-2 bg-blue-50 transition-all duration-500 ${
                                highlightedNumber === item.half && currentExample === index ? 'scale-110 ring-4 ring-blue-400' : ''
                              }`}>
                                {renderCircles(item.half)}
              </div>
                              <div className="text-xs text-blue-600 mt-1">= {item.half}</div>
            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conseils pratiques */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Pour les doubles
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Utilise tes doigts : 2 mains → double de 5 = 10</li>
                    <li>• Pense aux objets identiques</li>
                    <li>• C'est comme ajouter à soi-même</li>
                    <li>• Regarde tes chaussettes : toujours par paires !</li>
              </ul>
            </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    ✂️ Pour les moitiés
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Partage en 2 groupes égaux</li>
                    <li>• Coupe un gâteau en 2 parts égales</li>
                    <li>• C'est l'inverse du double</li>
                    <li>• Utilise des objets pour voir</li>
                  </ul>
          </div>
                </div>
              </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎮 Mini-jeu rapide !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { question: 'Double de 2', answer: '4' },
                  { question: 'Moitié de 8', answer: '4' },
                  { question: 'Double de 4', answer: '8' },
                  { question: 'Moitié de 6', answer: '3' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-2">{item.question}</div>
                    <div className="text-xl font-bold">{item.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-green-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-8 text-gray-900">
                {exercises[currentExercise].question}
                    </h3>
                    
              {/* Indication du type */}
              <div className={`rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 ${
                exercises[currentExercise].type === 'double' 
                  ? 'bg-green-50' 
                  : 'bg-blue-50'
                        }`}>
                <div className={`text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 ${
                  exercises[currentExercise].type === 'double' 
                    ? 'text-green-600' 
                    : 'text-blue-600'
                            }`}>
                  {exercises[currentExercise].type === 'double' ? '🎯' : '✂️'}
                          </div>
                <p className="text-base sm:text-lg text-gray-700 font-semibold">
                  {exercises[currentExercise].type === 'double' 
                    ? 'Trouve le double !' 
                    : 'Trouve la moitié !'}
                </p>
                          </div>
                    
                    {/* Choix multiples */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-8">
                      {shuffledChoices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleAnswerClick(choice)}
                          disabled={isCorrect !== null}
                    className={`p-4 sm:p-6 rounded-lg font-bold text-lg sm:text-xl transition-all min-h-[50px] ${
                            userAnswer === choice
                              ? isCorrect === true
                                ? 'bg-green-500 text-white'
                                : isCorrect === false
                                  ? 'bg-red-500 text-white'
                            : 'bg-green-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                                ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                          } disabled:cursor-not-allowed`}
                        >
                          {choice}
                        </button>
                      ))}
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
                          Excellent ! La réponse est bien {exercises[currentExercise].correctAnswer} !
                        </span>
                            </>
                          ) : (
                            <>
                        <XCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="font-bold text-sm sm:text-xl">
                          Pas tout à fait... La bonne réponse est {exercises[currentExercise].correctAnswer} !
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
                          {exercises[currentExercise].type === 'double' ? (
                            <div>
                              <div className="text-lg sm:text-xl font-bold text-blue-600 mb-1 sm:mb-2">
                                Double de {exercises[currentExercise].question.match(/\d+/)?.[0]} = {exercises[currentExercise].correctAnswer}
                              </div>
                              <div className="text-sm sm:text-lg text-gray-700">
                                {exercises[currentExercise].question.match(/\d+/)?.[0]} + {exercises[currentExercise].question.match(/\d+/)?.[0]} = {exercises[currentExercise].correctAnswer}
                            </div>
                              </div>
                          ) : (
                            <div>
                              <div className="text-lg sm:text-xl font-bold text-blue-600 mb-1 sm:mb-2">
                                Moitié de {exercises[currentExercise].question.match(/\d+/)?.[0]} = {exercises[currentExercise].correctAnswer}
                                </div>
                              <div className="text-sm sm:text-lg text-gray-700">
                                {exercises[currentExercise].question.match(/\d+/)?.[0]} ÷ 2 = {exercises[currentExercise].correctAnswer}
                                </div>
                                </div>
                          )}
                              </div>
                              
                        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-2 sm:p-3 text-center">
                          <div className="text-base sm:text-lg">🌟</div>
                          <p className="text-xs sm:text-sm font-semibold text-blue-800">
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
                    className="bg-green-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[50px] sm:min-h-auto"
                        >
                          Suivant →
                        </button>
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
                  if (percentage >= 90) return { title: "🎉 Champion des doubles et moitiés !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
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
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les doubles et moitiés sont très utiles !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
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