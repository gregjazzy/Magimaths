'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

export default function OrdonnerComparerCP() {
  const router = useRouter();

  // Styles CSS pour les animations des symboles
  const symbolAnimationStyles = `
    @keyframes pique-left-attack {
      0% { transform: translateX(0) scale(1) rotate(0deg); color: inherit; }
      /* Premier coup */
      10% { transform: translateX(-20px) scale(1.3) rotate(-10deg); color: #dc2626; }
      15% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Deuxième coup */
      25% { transform: translateX(-22px) scale(1.4) rotate(-12deg); color: #b91c1c; }
      30% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Troisième coup */
      40% { transform: translateX(-24px) scale(1.5) rotate(-14deg); color: #991b1b; }
      45% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Quatrième coup */
      55% { transform: translateX(-26px) scale(1.6) rotate(-16deg); color: #7f1d1d; }
      60% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Cinquième coup final - juste toucher le 2 */
      70% { transform: translateX(-28px) scale(1.7) rotate(-18deg); color: #450a0a; }
      75% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      100% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
    }
    
    @keyframes pique-right-attack {
      0% { transform: translateX(0) scale(1) rotate(0deg); color: inherit; }
      /* Premier coup */
      10% { transform: translateX(20px) scale(1.3) rotate(10deg); color: #dc2626; }
      15% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Deuxième coup */
      25% { transform: translateX(22px) scale(1.4) rotate(12deg); color: #b91c1c; }
      30% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Troisième coup */
      40% { transform: translateX(24px) scale(1.5) rotate(14deg); color: #991b1b; }
      45% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Quatrième coup */
      55% { transform: translateX(26px) scale(1.6) rotate(16deg); color: #7f1d1d; }
      60% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      /* Cinquième coup final - juste toucher le 3 */
      70% { transform: translateX(28px) scale(1.7) rotate(18deg); color: #450a0a; }
      75% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
      100% { transform: translateX(0) scale(1) rotate(0deg); color: #dc2626; }
    }
    

    
    .pique-left { 
      animation: pique-left-attack 4s ease-in-out; 
      color: #dc2626 !important;
    }
    .pique-right { 
      animation: pique-right-attack 4s ease-in-out; 
      color: #dc2626 !important;
    }
    .chomp { animation: chomp 0.3s ease-in-out 3; }
  `;
  
  // États existants
  const [selectedActivity, setSelectedActivity] = useState('comparer');
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
  const [animatingComparison, setAnimatingComparison] = useState(false);
  const [animatingRangement, setAnimatingRangement] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [highlightedSymbol, setHighlightedSymbol] = useState<string | null>(null);
  const [animatingExample, setAnimatingExample] = useState<number | null>(null);
  const [exampleStep, setExampleStep] = useState<string | null>(null);
  const [zoomingSymbolPart, setZoomingSymbolPart] = useState<{symbol: string, part: 'num1' | 'operator' | 'num2'} | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [orderingStep, setOrderingStep] = useState<string | null>(null);

  // États pour Sam le Pirate
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  
  // État pour le mini-jeu : quelles réponses sont révélées
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>([false, false, false, false]);
  const [completedAnswers, setCompletedAnswers] = useState<boolean[]>([false, false, false, false]);
  const [miniGameScore, setMiniGameScore] = useState(0);

  // Fonction pour révéler une réponse du mini-jeu
  const revealAnswer = (index: number) => {
    if (revealedAnswers[index]) return;
    
    setRevealedAnswers(prev => {
      const newRevealed = [...prev];
      newRevealed[index] = true;
      return newRevealed;
    });

    // Marquer comme complété après un court délai
    setTimeout(() => {
      setCompletedAnswers(prev => {
        const newCompleted = [...prev];
        newCompleted[index] = true;
        return newCompleted;
      });
      setMiniGameScore(prev => prev + 1);
    }, 300);
  };

  // Fonction pour réinitialiser le mini-jeu
  const resetMiniGame = () => {
    setRevealedAnswers([false, false, false, false]);
    setCompletedAnswers([false, false, false, false]);
    setMiniGameScore(0);
  };

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);



  // Expressions de pirate aléatoires pour chaque exercice
  const pirateExpressions = [
    "Mille sabords", "Tonnerre de Brest", "Sacré matelot", "Par Neptune", "Sang de pirate",
    "Mille millions de mille sabords", "Ventrebleu", "Sapristi", "Morbleu", "Fichtre"
  ];

  // Compliments aléatoires pour les bonnes réponses
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", 
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire"
  ];



  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ordonner-comparer',
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

    localStorage.setItem('cp-nombres-20-progress', JSON.stringify(allProgress));
  };

  // Fonctions audio et animations
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const scrollToIllustration = () => {
    const element = document.getElementById('illustration-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToActivity = () => {
    const element = document.getElementById('activity-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour Sam explique les comparaisons avec animation "pique"
  const samExplainsComparisons = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    try {
      // Animation pour Sam qui se prépare
      setSamSizeExpanded(true);
      await wait(500);
      
      await playAudio("Ahoy moussaillon ! Sam le pirate va vous montrer comment les symboles attaquent lentement !");
      await wait(800);
      
      // Explication du plus grand que avec son animation "tac tac tac"
      setHighlightedElement('symbols');
      await playAudio("Regardez bien le symbole plus grand que ! Il va piquer le plus petit nombre !");
      await wait(500);
      
      setHighlightedSymbol('>');
      await playAudio("TAC... TAC... TAC... TAC... TAC... Le symbole rouge pique le trois plusieurs fois !");
      await wait(1500); // Temps réduit pour transition plus fluide
      
      // Rappel de la règle avant la conclusion
      await playAudio("Rappelez-vous, le symbole pique toujours le plus petit nombre !");
      await wait(800);
      
      // Redire l'expression complète
      await playAudio("Donc 7 est plus grand que 3 !");
      await wait(1000);
      
      setHighlightedSymbol(null);
      await wait(800);
      
      // Explication du plus petit que
      await playAudio("Maintenant le symbole plus petit que !");
      await wait(500);
      
      setHighlightedSymbol('<');
      await playAudio("TAC... TAC... TAC... TAC... TAC... Le symbole rouge pique le deux plusieurs fois !");
      await wait(1500); // Temps réduit pour transition plus fluide
      
      // Rappel de la règle avant la conclusion
      await playAudio("Rappelez-vous, le symbole pique toujours le plus petit nombre !");
      await wait(800);
      
      // Redire l'expression complète
      await playAudio("Donc 2 est plus petit que 8 !");
      await wait(1000);
      
      setHighlightedSymbol(null);
      await wait(800);
      
      // Explication de l'égalité
      await playAudio("Et pour l'égalité, les deux nombres sont identiques !");
      await wait(500);
      
      setHighlightedSymbol('=');
      await playAudio("Regardez ! Les deux cinq sont exactement pareils !");
      await wait(2500);
      
      // Redire l'expression complète
      await playAudio("Donc 5 est égal à 5 !");
      await wait(1000);
      
      setHighlightedSymbol(null);
      await wait(500);
      
      await playAudio("Voilà ! Maintenant vous savez comment les symboles attaquent et piquent !");
      await wait(2000); // Plus de temps pour la dernière phrase
      
    } catch (error) {
      console.error('Erreur dans samExplainsComparisons:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setHighlightedSymbol(null);
      setSamSizeExpanded(false);
    }
  };

  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8; // Plus lent pour les explications détaillées
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

  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setHasStarted(true);
    
    await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à comparer et ordonner les nombres de 1 à 20.");
    if (stopSignalRef.current) return;
    
    // Aller aux symboles de comparaison avec explication et animation complète
    await wait(1200);
    scrollToElement('symbols');
    await wait(500);
    setHighlightedElement('symbols');
    setSamSizeExpanded(true);
    await playAudio("Regardons d'abord les symboles de comparaison avec Sam le pirate !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    await playAudio("Sam va vous montrer comment les symboles attaquent !");
    if (stopSignalRef.current) return;
    
    // Explication du plus grand que avec animation
    await wait(800);
    await playAudio("Regardez bien le symbole plus grand que ! Il va piquer le plus petit nombre !");
    if (stopSignalRef.current) return;
    
    await wait(500);
    setHighlightedSymbol('>');
    await playAudio("TAC... TAC... TAC... TAC... TAC... Le symbole rouge pique le trois plusieurs fois !");
    if (stopSignalRef.current) return;
    
    await wait(1500); // Temps réduit pour transition plus fluide
    
    // Rappel de la règle avant la conclusion
    await playAudio("Rappelez-vous, le symbole pique toujours le plus petit nombre !");
    if (stopSignalRef.current) return;
    await wait(800);
    
    // Redire l'expression complète
    await playAudio("Donc 7 est plus grand que 3 !");
      if (stopSignalRef.current) return;
    await wait(1000);
    
    setHighlightedSymbol(null);
    
    // Explication du plus petit que avec animation
    await wait(800);
    await playAudio("Maintenant le symbole plus petit que !");
    if (stopSignalRef.current) return;
    
    await wait(500);
    setHighlightedSymbol('<');
    await playAudio("TAC... TAC... TAC... TAC... TAC... Le symbole rouge pique le deux plusieurs fois !");
    if (stopSignalRef.current) return;
    
    await wait(1500); // Temps réduit pour transition plus fluide
    
    // Rappel de la règle avant la conclusion
    await playAudio("Rappelez-vous, le symbole pique toujours le plus petit nombre !");
    if (stopSignalRef.current) return;
    await wait(800);
    
    // Redire l'expression complète
    await playAudio("Donc 2 est plus petit que 8 !");
    if (stopSignalRef.current) return;
    await wait(1000);
    
    setHighlightedSymbol(null);
    
    // Explication de l'égalité
    await wait(800);
    await playAudio("Et pour l'égalité, les deux nombres sont identiques !");
    if (stopSignalRef.current) return;
      
    await wait(500);
    setHighlightedSymbol('=');
    await playAudio("Regardez ! Les deux cinq sont exactement pareils !");
    if (stopSignalRef.current) return;
    
    await wait(2500);
    
    // Redire l'expression complète
    await playAudio("Donc 5 est égal à 5 !");
    if (stopSignalRef.current) return;
    await wait(1000);
    
    setHighlightedSymbol(null);
    setSamSizeExpanded(false);
    
    await wait(500);
    await playAudio("Voilà ! Maintenant vous savez comment les symboles attaquent !");
    if (stopSignalRef.current) return;
    await wait(2000); // Plus de temps pour la dernière phrase
    
    // Scroll vers l'introduction et expliquer l'importance
    await wait(1500);
    setHighlightedElement(null);
    scrollToElement('introduction');
    await wait(500);
    setHighlightedElement('introduction');
    await playAudio("Comparer les nombres nous aide à savoir lequel est plus grand ou plus petit !");
    if (stopSignalRef.current) return;
    
    // Aller à l'exemple 5 > 3
    await wait(1200);
    setHighlightedElement(null);
    setAnimatingExample(0);
    setExampleStep('intro');
    await playAudio("Regardons un exemple avec 5 et 3.");
    if (stopSignalRef.current) return;
    
    await wait(1200);
    setExampleStep('counting');
    await playAudio("Comptons : 5 cercles rouges contre 3 cercles rouges. 5 est plus grand que 3 !");
    if (stopSignalRef.current) return;
    
    await wait(1500);
    setAnimatingExample(null);
    setExampleStep(null);
    
    // Aller au sélecteur d'activité
    await wait(800);
    setHighlightedElement('activity-selector');
    scrollToActivity();
    await playAudio("Maintenant, tu peux choisir ton activité ! Clique sur ce que tu veux apprendre !");
    if (stopSignalRef.current) return;
      
    await wait(1000);
    
    // Présenter la première activité
    setHighlightedElement('comparer-button');
    await playAudio("Tu peux apprendre à comparer deux nombres !");
    if (stopSignalRef.current) return;
    
    await wait(1200);
    
    // Présenter la deuxième activité
    setHighlightedElement('ordonner-button');
    await playAudio("Ou alors ordonner les nombres !");
    if (stopSignalRef.current) return;
    
    await wait(1200);
    setHighlightedElement(null);
    
    // Scroll vers le haut et présenter les exercices
    await wait(500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await wait(1500); // Temps pour le scroll
    
    setHighlightedElement('navigation-tabs');
    await playAudio("Maintenant tu peux aller où tu veux pour regarder le cours ou faire des exercices !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
    setHighlightedElement(null);
  };

  const explainComparison = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      await playAudio("Parfait ! Allons voir les exemples de comparaison !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      setAnimatingComparison(true);
      setAnimatingStep('comparing');
      setHighlightedElement('illustration-section');
      scrollToIllustration();
      await wait(1000);
      setHighlightedElement(null);
      
      await playAudio("Pour comparer deux nombres, nous regardons lequel est plus grand ou plus petit.");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setAnimatingExample(0);
      setExampleStep('highlight');
      await playAudio("Regarde le premier exemple : 3 est plus petit que 7.");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setAnimatingExample(1);
      await playAudio("Le deuxième exemple : 9 est plus grand que 5.");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setAnimatingExample(2);
      await playAudio("Et le troisième : 4 est égal à 4 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setAnimatingExample(null);
      setExampleStep(null);
      await playAudio("Observe bien les cercles pour comprendre les différences !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
    } finally {
      setAnimatingComparison(false);
      setAnimatingStep(null);
      setAnimatingExample(null);
      setExampleStep(null);
    }
  };

  const explainRangement = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    try {
      await playAudio("Excellent choix ! Allons voir les exemples de rangement !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      setAnimatingRangement(true);
      setAnimatingStep('ordering');
      setHighlightedElement('illustration-section');
      scrollToIllustration();
      await wait(1000);
      setHighlightedElement(null);
      
      await playAudio("Je vais t'expliquer comment ordonner les nombres étape par étape.", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Pour ordonner, on range du plus petit au plus grand, comme des escaliers qui montent !", true);
      if (stopSignalRef.current) return;

      // Premier exemple détaillé : 3, 1, 5
      await wait(2000);
      setAnimatingExample(0);
      setExampleStep('before');
      setOrderingStep('introduction');
      await playAudio("Regardons le premier exemple : nous avons trois nombres en désordre.", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(3);
      await playAudio("Ici, j'ai 3 cercles rouges. C'est le nombre 3.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(1);
      await playAudio("Là, j'ai 1 cercle rouge. C'est le nombre 1.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(5);
      await playAudio("Et ici, j'ai 5 cercles rouges. C'est le nombre 5.", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(null);
      setOrderingStep('finding_smallest');
      await playAudio("Pour les ordonner, je cherche d'abord le plus petit nombre.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(3);
      await playAudio("3, c'est plus grand que...", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedNumber(1);
      await playAudio("1 ! Donc 1 est plus petit.", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedNumber(5);
      await playAudio("Et 1 est aussi plus petit que 5.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(1);
      await playAudio("Donc le plus petit, c'est 1 ! Il va en premier.", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setOrderingStep('finding_middle');
      setHighlightedNumber(3);
      await playAudio("Maintenant, entre 3 et 5, lequel est plus petit ?", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("3 est plus petit que 5 ! Donc 3 va en deuxième.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(5);
      await playAudio("Et 5, le plus grand, va en dernier !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(null);
      setExampleStep('after');
      setOrderingStep('result');
      await playAudio("Résultat : 1, puis 3, puis 5. Du plus petit au plus grand !", true);
      if (stopSignalRef.current) return;
      
      // Deuxième exemple avec même détail
      await wait(2500);
      setAnimatingExample(1);
      setExampleStep('before');
      setOrderingStep('introduction');
      await playAudio("Faisons un deuxième exemple : 8, 2, 6.", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(8);
      await playAudio("8 cercles ici...", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedNumber(2);
      await playAudio("2 cercles là...", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedNumber(6);
      await playAudio("et 6 cercles ici.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(null);
      setOrderingStep('finding_smallest');
      await playAudio("Quel est le plus petit ? Je compare...", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedNumber(2);
      await playAudio("2 ! C'est le plus petit. Il va en premier.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setOrderingStep('finding_middle');
      setHighlightedNumber(6);
      await playAudio("Entre 8 et 6, le plus petit est 6.", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedNumber(8);
      await playAudio("Et 8 est le plus grand !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(null);
      setExampleStep('after');
      setOrderingStep('result');
      await playAudio("Donc l'ordre correct : 2, 6, 8 !", true);
      if (stopSignalRef.current) return;
      
      // Troisième exemple avec des nombres plus grands
      await wait(2500);
      setAnimatingExample(2);
      setExampleStep('before');
      setOrderingStep('introduction');
      await playAudio("Dernier exemple avec des nombres plus grands : 15, 9, 12.", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(15);
      await playAudio("Ici, une dizaine et 5 unités : 15.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(9);
      await playAudio("Là, 9 cercles rouges : le nombre 9.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(12);
      await playAudio("Et ici, une dizaine et 2 unités : 12.", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(null);
      setOrderingStep('finding_smallest');
      await playAudio("Quel est le plus petit ? Je compte les cercles...", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(9);
      await playAudio("9 est plus petit que 12 et plus petit que 15. Donc 9 en premier !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setOrderingStep('finding_middle');
      setHighlightedNumber(12);
      await playAudio("Entre 12 et 15, le plus petit est 12.", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setHighlightedNumber(15);
      await playAudio("Et 15 est le plus grand de tous !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedNumber(null);
      setExampleStep('after');
      setOrderingStep('result');
      await playAudio("Résultat final : 9, 12, 15 ! Parfaitement ordonnés !", true);
      if (stopSignalRef.current) return;
      
      // Conclusion
      await wait(2500);
      setAnimatingExample(null);
      setExampleStep(null);
      setOrderingStep(null);
      await playAudio("Bravo ! Tu vois comme on regarde toujours le nombre de cercles pour comparer ?", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Maintenant tu sais ordonner les nombres ! C'est comme faire une parade : du plus petit au plus grand !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
    } finally {
      setAnimatingRangement(false);
      setAnimatingStep(null);
      setAnimatingExample(null);
      setExampleStep(null);
      setHighlightedNumber(null);
      setOrderingStep(null);
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
      
      await playAudio("Dès que tu as la réponse, tu peux cliquer sur la bonne réponse");
      if (stopSignalRef.current) return;
      
      // Mettre en évidence la zone des réponses
      setHighlightedElement('answer-choices');
      await wait(2000);
      setHighlightedElement(null);
      
      if (stopSignalRef.current) return;
      
      await playAudio("Si tu te trompes, je t'expliquerai la bonne réponse !");
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("En avant toutes pour les comparaisons et rangements !");
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startPirateIntro:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour lire l'énoncé de l'exercice
  const startExerciseExplanation = async () => {
    if (stopSignalRef.current || isExplainingError || !exercises[currentExercise]) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setExerciseStarted(true);
    
    try {
      // Lire seulement l'énoncé de l'exercice
      await playAudio(exercises[currentExercise].question);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans startExerciseExplanation:', error);
    } finally {
      setIsPlayingVocal(false);
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
      
    } catch (error) {
      console.error('Erreur dans celebrateCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
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
      
      const exercise = exercises[currentExercise];
      await playAudio(`L'ordre correct était : ${exercise.correctAnswer} !`);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await playAudio("Appuie sur le bouton Suivant pour continuer ton aventure !");
      if (stopSignalRef.current) return;
      
      // Scroll vers le bouton suivant après l'explication - optimisé pour mobile
      setTimeout(() => {
        const nextButton = document.getElementById('next-exercise-button');
        if (nextButton) {
          const isMobile = window.innerWidth < 768; // sm breakpoint
          
          if (isMobile) {
            // Pour mobile: scroll plus agressif pour s'assurer que le bouton est visible
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
      }, 1000); // Plus de délai pour que tout l'audio se termine
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
      // Ne PAS remettre setIsExplainingError(false) ici - le bouton Suivant doit rester actif
      // L'état sera réinitialisé quand l'utilisateur clique sur "Suivant"
    }
  };

  // Fonction modifiée pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt FORCÉ de tous les vocaux et animations (navigation détectée)');
    
    stopSignalRef.current = true;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() forcé');
    }
    
    setTimeout(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (2e tentative)');
      }
    }, 100);
    
    setTimeout(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (3e tentative)');
      }
    }, 200);
    
    setIsPlayingVocal(false);
    setAnimatingComparison(false);
    setAnimatingRangement(false);
    setAnimatingStep(null);
    setHighlightedElement(null);
    setHighlightedSymbol(null);
    setAnimatingExample(null);
    setExampleStep(null);
    setZoomingSymbolPart(null);
    setHighlightedNumber(null);
    setOrderingStep(null);
    
    // Réinitialiser les états Sam
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Injection des styles CSS pour les animations
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = symbolAnimationStyles;
    document.head.appendChild(styleElement);
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
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

  // Effet pour arrêter l'audio lors de la navigation (bouton back)
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        stopAllVocalsAndAnimations();
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Exemples de comparaisons
  const comparaisonExamples = [
    { num1: 3, num2: 7, symbol: '<' },
    { num1: 9, num2: 5, symbol: '>' },
    { num1: 4, num2: 4, symbol: '=' },
    { num1: 12, num2: 8, symbol: '>' },
    { num1: 6, num2: 15, symbol: '<' }
  ];

  // Exemples de rangements
  const rangementExamples = [
    { numbers: [3, 1, 5], ordered: [1, 3, 5] },
    { numbers: [8, 2, 6], ordered: [2, 6, 8] },
    { numbers: [15, 9, 12], ordered: [9, 12, 15] }
  ];

  // Fonction pour générer 9 exercices de rangement uniquement (2 types de questions)
  const generateRandomExercises = () => {
    const allExercises = [
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [5, 2, 8], correctAnswer: '2, 5, 8', choices: ['2, 5, 8', '8, 5, 2', '5, 2, 8'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [3, 7, 1], correctAnswer: '7, 3, 1', choices: ['1, 3, 7', '7, 3, 1', '3, 7, 1'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [14, 6, 11], correctAnswer: '6, 11, 14', choices: ['6, 11, 14', '14, 11, 6', '11, 6, 14'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [9, 4, 16], correctAnswer: '16, 9, 4', choices: ['4, 9, 16', '16, 9, 4', '9, 16, 4'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [18, 10, 15], correctAnswer: '10, 15, 18', choices: ['10, 15, 18', '18, 15, 10', '15, 10, 18'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [2, 19, 8], correctAnswer: '19, 8, 2', choices: ['2, 8, 19', '19, 8, 2', '8, 19, 2'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [7, 13, 4], correctAnswer: '4, 7, 13', choices: ['4, 7, 13', '13, 7, 4', '7, 4, 13'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [12, 5, 17], correctAnswer: '17, 12, 5', choices: ['5, 12, 17', '17, 12, 5', '12, 17, 5'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [3, 20, 9], correctAnswer: '3, 9, 20', choices: ['3, 9, 20', '20, 9, 3', '9, 3, 20'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [6, 14, 11], correctAnswer: '14, 11, 6', choices: ['6, 11, 14', '14, 11, 6', '11, 14, 6'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [1, 12, 8], correctAnswer: '1, 8, 12', choices: ['1, 8, 12', '12, 8, 1', '8, 1, 12'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [15, 7, 18], correctAnswer: '18, 15, 7', choices: ['7, 15, 18', '18, 15, 7', '15, 18, 7'] }
    ];

    // Mélanger et prendre 9 exercices aléatoires
    const shuffled = [...allExercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 9);
  };

  // Exercices générés aléatoirement à chaque session
  const [exercises] = useState(() => generateRandomExercises());



  // Effet pour réinitialiser les états Sam quand on change entre cours et exercices
  useEffect(() => {
    if (!showExercises) {
      // Quand on revient au cours, réinitialiser les états Sam
      setPirateIntroStarted(false);
      setShowExercisesList(false);
      setSamSizeExpanded(false);
      setExerciseStarted(false);
    }
  }, [showExercises]);

  // Effet pour réinitialiser les états sur changement d'exercice
  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setIsExplainingError(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
  }, [currentExercise]);

  const handleAnswerClick = async (answer: string) => {
    stopAllVocalsAndAnimations(); // Stop any ongoing audio first
    
    setUserAnswer(answer);
    
    // Nouvelle logique de validation pour les exercices de rangement
    let correct = false;
    const exercise = exercises[currentExercise];
    
    // Pour les rangements : vérifier l'ordre des nombres
    const userNumbers = answer.split(',').map(n => n.trim()).join(', ');
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
    stopAllVocalsAndAnimations(); // Stop any ongoing audio before moving to next
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      // Réinitialiser les états Sam
      setIsExplainingError(false);
      setShowNextButton(false);
      setHighlightNextButton(false);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations(); // Stop any ongoing audio before reset
    
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    
    // Réinitialiser les états Sam
    setSamSizeExpanded(false);
    setExerciseStarted(false);
    setShowNextButton(false);
    setHighlightNextButton(false);
    setIsExplainingError(false);
    setPirateIntroStarted(false);
    setShowExercisesList(false);
  };

  // Fonction pour créer la représentation visuelle d'un nombre avec des cercles
  const renderCircles = (num: number) => {
    if (num >= 10) {
      const dizaines = Math.floor(num / 10);
      const unites = num % 10;
      
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Dizaines - groupes de 10 cercles bleus dans des boîtes */}
          {Array.from({ length: dizaines }, (_, d) => (
            <div key={`dizaine-${d}`} className="flex flex-col items-center">
              <div className="grid grid-cols-5 gap-1 p-2 rounded-lg border-2 border-blue-300 bg-blue-50">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={`d${d}-${i}`}
                    className="w-3 h-3 rounded-full bg-blue-600"
                  />
                ))}
              </div>
              <div className="text-xs text-blue-600 font-bold mt-1">1 dizaine = 10</div>
            </div>
          ))}
          
          {/* Unités - cercles rouges individuels */}
          {Array.from({ length: unites }, (_, i) => (
            <div
              key={`unite-${i}`}
              className="w-4 h-4 rounded-full bg-red-600"
            />
          ))}
        </div>
      );
    }
    
    // Pour les nombres < 10, seulement des cercles rouges
    return (
      <div className="flex flex-wrap items-center justify-center gap-1">
        {Array.from({ length: num }, (_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full bg-red-600"
          />
        ))}
      </div>
    );
  };

  // Fonction pour créer la représentation visuelle d'un nombre (version texte pour certains cas)
  const createVisual = (num: number) => {
    if (num >= 10) {
      const dizaines = Math.floor(num / 10);
      const unites = num % 10;
      return '🟢'.repeat(dizaines) + '🔴'.repeat(unites);
    }
    return '🔴'.repeat(num);
  };

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

  // Composant JSX pour le bouton "Écouter l'énoncé"
  const ListenQuestionButtonJSX = () => (
    <div className="mb-3 sm:mb-6">
      <button
        id="listen-question-button"
        onClick={startExerciseExplanation}
        disabled={isPlayingVocal || !pirateIntroStarted}
        className={`bg-blue-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-xs sm:text-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 mx-auto shadow-lg ${
          highlightedElement === 'listen-question-button' ? 'ring-8 ring-yellow-400 bg-yellow-500 animate-bounce scale-125 shadow-2xl border-4 border-orange-500' : ''
        }`}
      >
        <Volume2 className="w-3 h-3 sm:w-5 sm:h-5" />
        <span>🎧 Écouter l'énoncé</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
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

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 pb-8 sm:pb-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 sm:mb-4"
            onClick={stopAllVocalsAndAnimations}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-2 sm:p-6 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-4">
              📊 Mettre dans l'ordre et comparer
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Apprends à comparer et mettre les nombres dans l'ordre !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div 
          id="navigation-tabs"
          className={`flex justify-center mb-2 sm:mb-8 transition-all duration-1000 ${
            highlightedElement === 'navigation-tabs' ? 'scale-110' : ''
          }`}
        >
          <div className={`bg-white rounded-lg p-1 shadow-md transition-all duration-1000 ${
            highlightedElement === 'navigation-tabs' ? 'ring-4 ring-green-400 bg-green-50' : ''
          }`}>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-3 sm:px-6 py-1 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
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
              className={`px-3 sm:px-6 py-1 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-all ${
                showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-2 sm:space-y-6">
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

            {/* Les symboles */}
            <div 
              id="symbols"
              className={`bg-white rounded-xl p-2 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'symbols' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🔣 Les symboles de comparaison
                </h2>
                {/* Icône d'animation pour les symboles */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-red-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-red-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🐊 Animation des symboles ! Cliquez pour voir les attaques de Sam."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                         samExplainsComparisons();
                       }
                     }}
                >
                  🐊
                </div>
              </div>
              
              <div className="text-center mb-2 sm:mb-6">
                <button
                  onClick={() => samExplainsComparisons()}
                  disabled={isPlayingVocal}
                  className={`px-3 sm:px-6 py-1 sm:py-3 rounded-lg font-bold text-white text-xs sm:text-base transition-all duration-300 ${
                    isPlayingVocal 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  🐊 Sam explique les attaques !
                </button>
                    </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6">
                <div className={`bg-blue-50 rounded-lg p-2 sm:p-6 text-center transition-all duration-1000 ${
                    highlightedSymbol === '>' ? 'ring-4 ring-blue-400 bg-blue-100 scale-110 shadow-2xl' : ''
                }`}>
                  <div className={`text-3xl sm:text-6xl font-bold text-blue-600 mb-1 sm:mb-4 transition-all duration-500 ${
                    highlightedSymbol === '>' ? 'animate-bounce text-5xl sm:text-8xl' : ''
                  }`}>&gt;</div>
                  <h3 className="text-sm sm:text-xl font-bold text-blue-800 mb-1 sm:mb-2">Plus grand que</h3>
                  
                  {/* Disposition avec nombres de chaque côté */}
                  <div className="flex items-center justify-center gap-1 sm:gap-4 h-8 sm:h-16 mx-auto mb-1 sm:mb-4">
                    {/* Nombre 7 (à gauche) */}
                    <div className={`text-lg sm:text-3xl font-bold text-blue-800 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === '>' && zoomingSymbolPart?.part === 'num1' ? 'text-xl sm:text-4xl text-red-600 animate-bounce scale-150' : ''
                    }`}>7</div>
                    
                    {/* Symbole > (au centre) avec animation pique */}
                    <div className={`text-xl sm:text-4xl font-bold transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === '>' && zoomingSymbolPart?.part === 'operator' ? 'text-2xl sm:text-5xl text-green-600 animate-bounce scale-150' : ''
                    } ${
                      highlightedSymbol === '>' ? 'pique-right text-red-600' : 'text-blue-600'
                    }`}>&gt;</div>
                    
                    {/* Nombre 3 (à droite) - RESTE COMPLÈTEMENT IMMOBILE */}
                    <div className={`text-lg sm:text-3xl font-bold text-blue-800 ${
                      zoomingSymbolPart?.symbol === '>' && zoomingSymbolPart?.part === 'num2' ? 'text-xl sm:text-4xl text-red-600 animate-bounce scale-150' : ''
                    }`}>3</div>
                  </div>
                  
                  <p className={`text-xs sm:text-sm text-gray-600 ${
                    highlightedSymbol === '>' ? 'animate-pulse font-bold text-blue-800' : ''
                  }`}>Le bec pique le plus petit !</p>
                </div>
                 
                <div className={`bg-green-50 rounded-lg p-2 sm:p-6 text-center transition-all duration-1000 ${
                    highlightedSymbol === '<' ? 'ring-4 ring-green-400 bg-green-100 scale-110 shadow-2xl' : ''
                }`}>
                  <div className={`text-3xl sm:text-6xl font-bold text-green-600 mb-1 sm:mb-4 transition-all duration-500 ${
                    highlightedSymbol === '<' ? 'animate-bounce text-5xl sm:text-8xl' : ''
                  }`}>&lt;</div>
                  <h3 className="text-sm sm:text-xl font-bold text-green-800 mb-1 sm:mb-2">Plus petit que</h3>
                  
                  {/* Disposition avec nombres de chaque côté */}
                  <div className="flex items-center justify-center gap-1 sm:gap-4 h-8 sm:h-16 mx-auto mb-1 sm:mb-4">
                    {/* Nombre 2 (à gauche) - RESTE COMPLÈTEMENT IMMOBILE */}
                    <div className={`text-lg sm:text-3xl font-bold text-green-800 ${
                      zoomingSymbolPart?.symbol === '<' && zoomingSymbolPart?.part === 'num1' ? 'text-xl sm:text-4xl text-red-600 animate-bounce scale-150' : ''
                    }`}>2</div>
                    
                    {/* Symbole < (au centre) avec animation pique */}
                    <div className={`text-xl sm:text-4xl font-bold transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === '<' && zoomingSymbolPart?.part === 'operator' ? 'text-2xl sm:text-5xl text-blue-600 animate-bounce scale-150' : ''
                    } ${
                      highlightedSymbol === '<' ? 'pique-left text-red-600' : 'text-green-600'
                    }`}>&lt;</div>
                    
                    {/* Nombre 8 (à droite) */}
                    <div className={`text-lg sm:text-3xl font-bold text-green-800 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === '<' && zoomingSymbolPart?.part === 'num2' ? 'text-xl sm:text-4xl text-red-600 animate-bounce scale-150' : ''
                    }`}>8</div>
                  </div>
                  
                  <p className={`text-xs sm:text-sm text-gray-600 ${
                    highlightedSymbol === '<' ? 'animate-pulse font-bold text-green-800' : ''
                  }`}>Le bec pique le plus petit !</p>
                </div>
                
                <div className={`bg-orange-50 rounded-lg p-2 sm:p-6 text-center transition-all duration-1000 ${
                    highlightedSymbol === '=' ? 'ring-4 ring-orange-400 bg-orange-100 scale-110 shadow-2xl' : ''
                }`}>
                  <div className={`text-3xl sm:text-6xl font-bold text-orange-600 mb-1 sm:mb-4 transition-all duration-500 ${
                    highlightedSymbol === '=' ? 'animate-bounce text-5xl sm:text-8xl' : ''
                  }`}>=</div>
                  <h3 className="text-sm sm:text-xl font-bold text-orange-800 mb-1 sm:mb-2">Égal à</h3>
                  
                  {/* Disposition avec nombres de chaque côté */}
                  <div className="relative flex items-center justify-center gap-1 sm:gap-4 h-8 sm:h-16 mx-auto mb-1 sm:mb-4">
                    {/* Nombre 5 (à gauche) */}
                    <div className={`text-lg sm:text-3xl font-bold text-orange-800 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === '=' && zoomingSymbolPart?.part === 'num1' ? 'text-xl sm:text-4xl text-red-600 animate-bounce scale-150' : ''
                    } ${
                      highlightedSymbol === '=' ? 'winner-celebrate' : ''
                    }`}>5</div>
                    
                    {/* Symbole = (au centre) */}
                    <div className={`text-xl sm:text-4xl font-bold transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === '=' && zoomingSymbolPart?.part === 'operator' ? 'text-2xl sm:text-5xl text-purple-600 animate-bounce scale-150' : ''
                    } ${
                      highlightedSymbol === '=' ? 'animate-pulse' : ''
                    } text-orange-600`}>=</div>
                    
                    {/* Nombre 5 (à droite) */}
                    <div className={`text-lg sm:text-3xl font-bold text-orange-800 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === '=' && zoomingSymbolPart?.part === 'num2' ? 'text-xl sm:text-4xl text-red-600 animate-bounce scale-150' : ''
                    } ${
                      highlightedSymbol === '=' ? 'winner-celebrate' : ''
                    }`}>5</div>
                    
                            {/* Animation pour l'égalité */}
        {highlightedSymbol === '=' && (
          <>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-green-500 text-sm sm:text-lg animate-pulse">✨</div>
          </>
        )}
                  </div>
                  
                  <p className={`text-xs sm:text-sm text-gray-600 ${
                    highlightedSymbol === '=' ? 'animate-pulse font-bold text-orange-800' : ''
                  }`}>Exactement pareil !</p>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div 
              id="introduction"
              className="bg-white rounded-xl p-3 sm:p-8 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  🤔 Pourquoi comparer et mettre dans l'ordre ?
                </h2>
                {/* Icône d'animation pour l'exemple */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-purple-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-purple-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🎯 Animation de l'exemple ! Cliquez pour voir 5 > 3 en action."
                     onClick={async () => {
                       if (!isPlayingVocal) {
                         stopAllVocalsAndAnimations();
                         await new Promise(resolve => setTimeout(resolve, 100));
                         // Animation de l'exemple 5 > 3
                         setAnimatingExample(0);
                         await new Promise(resolve => setTimeout(resolve, 3000));
                         setAnimatingExample(null);
                       }
                     }}
                >
                  🎯
                </div>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-base sm:text-lg text-center text-pink-800 font-semibold mb-2 sm:mb-4">
                  Comparer les nombres nous aide à savoir lequel est plus grand ou plus petit !
                </p>
                
                <div className={`bg-white rounded-lg p-4 transition-all duration-1000 ${
                  animatingExample === 0 ? 'ring-4 ring-pink-400 bg-pink-50 scale-105' : ''
                }`}>
                  <div className="text-center">
                    <div className={`text-lg sm:text-2xl font-bold text-pink-600 mb-1 sm:mb-2 transition-all duration-500 ${
                      exampleStep === 'intro' ? 'animate-pulse text-xl sm:text-3xl' : ''
                    }`}>
                      Exemple : 5 &gt; 3
                </div>
                    <div className={`text-base sm:text-xl text-gray-700 mb-2 sm:mb-4 transition-all duration-500 ${
                      exampleStep === 'intro' ? 'animate-bounce font-bold text-pink-700' : ''
                    }`}>
                      5 est plus grand que 3
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <div className={`flex justify-center transition-all duration-700 ${
                        exampleStep === 'counting' ? 'scale-125 ring-2 ring-red-400' : ''
                      }`}>
                        {renderCircles(5)}
                      </div>
                      <div className={`text-2xl font-bold text-pink-600 transition-all duration-500 ${
                        exampleStep === 'counting' ? 'text-4xl pique-right text-red-600' : ''
                      }`}>&gt;</div>
                      <div className={`flex justify-center transition-all duration-700 ${
                        exampleStep === 'counting' ? 'scale-125 ring-2 ring-red-400' : ''
                      }`}>
                        {renderCircles(3)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur d'activité */}
            <div 
              id="activity-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'activity-selector' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  🎯 Choisis ce que tu veux apprendre
                </h2>
                {/* Icône d'animation pour les activités */}
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-green-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-green-200"
                     style={{
                       animation: 'subtle-glow 3s ease-in-out infinite',
                       animationPlayState: 'running'
                     }} 
                     title="🎯 Animation des activités ! Cliquez pour un aperçu rapide."
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                         // Animation rapide des boutons d'activité
                      setHighlightedElement('activity-selector');
                         await new Promise(resolve => setTimeout(resolve, 2000));
                        setHighlightedElement(null);
                    }
                  }}
                >
                  🎯
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-6">
                <div className="relative">
                <button
                  id="comparer-button"
                  onClick={() => {
                    setSelectedActivity('comparer');
                    explainComparison();
                  }}
                    className={`w-full h-16 sm:h-20 p-3 sm:p-6 rounded-lg font-bold text-xs sm:text-base transition-all flex items-center justify-center ${
                    selectedActivity === 'comparer'
                      ? 'bg-pink-500 text-white shadow-lg scale-105'
                      : highlightedElement === 'comparer-button' 
                        ? 'bg-pink-300 text-white ring-4 ring-pink-400 scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⚖️ Comparer deux nombres
                </button>
                  {/* Petite icône d'animation */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                    🎬
                  </div>
                </div>
                <div className="relative">
                <button
                  id="ordonner-button"
                  onClick={() => {
                    setSelectedActivity('ordonner');
                    explainRangement();
                  }}
                    className={`w-full h-16 sm:h-20 p-3 sm:p-6 rounded-lg font-bold text-xs sm:text-base transition-all flex items-center justify-center ${
                    selectedActivity === 'ordonner'
                      ? 'bg-purple-500 text-white shadow-lg scale-105'
                      : highlightedElement === 'ordonner-button' 
                        ? 'bg-purple-300 text-white ring-4 ring-purple-400 scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  📊 Ordonner les nombres
                </button>
                  {/* Petite icône d'animation */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg animate-pulse">
                    🎬
                  </div>
                </div>
              </div>
            </div>

            {/* Affichage selon l'activité sélectionnée */}
            {selectedActivity === 'comparer' ? (
              <div 
                id="illustration-section"
                className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                  animatingComparison ? 'ring-4 ring-pink-400 bg-pink-50 scale-105' : ''
                }`}
              >
                <div className="text-center mb-3 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  ⚖️ Comment comparer deux nombres
                </h2>
                </div>
                
                    <div className="space-y-3 sm:space-y-6">
                  {comparaisonExamples.map((example, index) => (
                    <div 
                      key={index} 
                      className={`bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 sm:p-6 transition-all duration-700 ${
                        animatingStep === 'comparing' ? 'scale-105 ring-2 ring-blue-300' : ''
                      } ${
                        animatingExample === index && exampleStep === 'highlight' ? 'ring-4 ring-purple-400 bg-purple-100 scale-110 shadow-2xl' : ''
                      }`}
                    >
                      <div className="text-center space-y-2 sm:space-y-4">
                        <div className={`text-2xl sm:text-3xl font-bold text-purple-600 transition-all duration-500 ${
                          animatingExample === index && exampleStep === 'highlight' ? 'animate-pulse text-3xl sm:text-4xl text-green-600' : ''
                        }`}>
                          {example.num1} {example.symbol} {example.num2}
                                </div>
                        
                        <div className="bg-white rounded-lg p-2 sm:p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 items-center mb-2 sm:mb-3">
                            <div className={`text-center transition-all duration-700 ${
                              animatingExample === index && exampleStep === 'highlight' ? 'scale-125 ring-2 ring-blue-300' : ''
                            }`}>
                              <div className="text-base sm:text-xl font-bold mb-1 sm:mb-2">{example.num1}</div>
                              {renderCircles(example.num1)}
                              </div>
                            <div className={`text-3xl sm:text-4xl font-bold text-purple-600 text-center transition-all duration-500 ${
                              animatingExample === index && exampleStep === 'highlight' ? 'animate-bounce text-5xl sm:text-6xl text-green-600' : ''
                            }`}>
                              {example.symbol}
                            </div>
                            <div className={`text-center transition-all duration-700 ${
                              animatingExample === index && exampleStep === 'highlight' ? 'scale-125 ring-2 ring-blue-300' : ''
                            }`}>
                              <div className="text-xl font-bold mb-2">{example.num2}</div>
                              {renderCircles(example.num2)}
                                </div>
                              </div>
                          <div className="text-lg text-gray-700 text-center">
                            {example.symbol === '>' && `${example.num1} est plus grand que ${example.num2}`}
                            {example.symbol === '<' && `${example.num1} est plus petit que ${example.num2}`}
                            {example.symbol === '=' && `${example.num1} est égal à ${example.num2}`}
                            </div>
                          </div>
                        </div>
                                </div>
                  ))}
                              </div>
                            </div>
            ) : (
              <div 
                id="illustration-section"
                className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                  animatingRangement ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
                }`}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                  📊 Comment mettre les nombres dans l'ordre
                </h2>
                  {/* Icône d'animation pour les rangements */}
                  <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-purple-300 ring-opacity-40 hover:shadow-xl hover:ring-4 hover:ring-purple-200"
                       style={{
                         animation: 'subtle-glow 3s ease-in-out infinite',
                         animationPlayState: 'running'
                       }} 
                       title="📊 Animation des rangements ! Cliquez pour voir les exemples."
                       onClick={async () => {
                         if (!isPlayingVocal) {
                           stopAllVocalsAndAnimations();
                           await new Promise(resolve => setTimeout(resolve, 100));
                           setAnimatingRangement(true);
                           await new Promise(resolve => setTimeout(resolve, 3000));
                           setAnimatingRangement(false);
                         }
                       }}
                  >
                    📊
                  </div>
                </div>
                
                <div className="space-y-6">
                  {rangementExamples.map((example, index) => (
                    <div 
                      key={index} 
                      className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 transition-all duration-700 ${
                        animatingStep === 'ordering' ? 'scale-105 ring-2 ring-purple-300' : ''
                      } ${
                        animatingExample === index && (exampleStep === 'before' || exampleStep === 'after') ? 'ring-4 ring-orange-400 bg-orange-100 scale-110 shadow-2xl' : ''
                      }`}
                    >
                                              <div className="text-center space-y-4">
                          <h3 className={`text-xl font-bold text-purple-800 transition-all duration-500 ${
                            animatingExample === index && (exampleStep === 'before' || exampleStep === 'after') ? 'animate-pulse text-2xl text-orange-600' : ''
                          }`}>
                            Nombres à mettre dans l'ordre : {example.numbers.join(', ')}
                          </h3>
                        
                        {/* Indicateur d'étape */}
                        {orderingStep && (
                          <div className="mb-4 p-3 rounded-lg bg-blue-100 border-l-4 border-blue-500">
                            <div className="text-lg font-bold text-blue-800">
                              {orderingStep === 'introduction' && '🎯 Découverte des nombres'}
                              {orderingStep === 'finding_smallest' && '🔍 Je cherche le plus petit nombre'}
                              {orderingStep === 'finding_middle' && '🔍 Je cherche le nombre du milieu'}
                              {orderingStep === 'result' && '✅ Résultat final'}
                          </div>
                        </div>
                      )}
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className={`bg-white rounded-lg p-4 transition-all duration-1000 ${
                            animatingExample === index && exampleStep === 'before' ? 'ring-4 ring-red-400 bg-red-50 scale-105' : ''
                          }`}>
                            <div className={`font-bold text-gray-800 mb-2 ${
                              animatingExample === index && exampleStep === 'before' ? 'animate-pulse text-red-600 text-lg' : ''
                            }`}>Avant (désordre) :</div>
                            <div className="space-y-3">
                              {example.numbers.map((num, i) => (
                                <div key={i} className={`flex items-center justify-center space-x-4 transition-all duration-500 ${
                                  animatingExample === index && exampleStep === 'before' ? 'scale-110' : ''
                                } ${
                                  highlightedNumber === num ? 'scale-125 ring-4 ring-yellow-400 bg-yellow-100 animate-pulse rounded-lg p-2' : ''
                                }`}>
                                  <span className={`text-xl font-bold w-8 transition-all duration-300 ${
                                    highlightedNumber === num ? 'text-2xl text-yellow-800' : ''
                                  }`}>{num}</span>
                                  <span className={`text-lg transition-all duration-300 ${
                                    highlightedNumber === num ? 'text-yellow-600' : ''
                                  }`}>→</span>
                                  <div className={`flex-1 flex justify-center transition-all duration-500 ${
                                    highlightedNumber === num ? 'scale-110' : ''
                                  }`}>
                                    {renderCircles(num)}
                          </div>
                          </div>
                            ))}
                          </div>
                        </div>
                          
                          <div className={`bg-white rounded-lg p-4 transition-all duration-1000 ${
                            animatingExample === index && exampleStep === 'after' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
                          }`}>
                            <div className={`font-bold text-gray-800 mb-2 ${
                              animatingExample === index && exampleStep === 'after' ? 'animate-pulse text-green-600 text-lg' : ''
                            }`}>Après (du plus petit au plus grand) :</div>
                            <div className="space-y-3">
                              {example.ordered.map((num, i) => (
                                <div key={i} className={`flex items-center justify-center space-x-4 transition-all duration-500 ${
                                  animatingExample === index && exampleStep === 'after' ? 'scale-110' : ''
                                } ${
                                  highlightedNumber === num && exampleStep === 'after' ? 'scale-125 ring-4 ring-green-400 bg-green-100 animate-pulse rounded-lg p-2' : ''
                                }`}>
                                  <span className={`text-xl font-bold w-8 transition-all duration-300 ${
                                    exampleStep === 'after' ? 'text-green-600' : 'text-gray-800'
                                  } ${
                                    highlightedNumber === num && exampleStep === 'after' ? 'text-2xl text-green-800' : ''
                                  }`}>{num}</span>
                                  <span className={`text-lg transition-all duration-300 ${
                                    highlightedNumber === num && exampleStep === 'after' ? 'text-green-600' : ''
                                  }`}>→</span>
                                  <div className={`flex-1 flex justify-center transition-all duration-500 ${
                                    highlightedNumber === num && exampleStep === 'after' ? 'scale-110' : ''
                                  }`}>
                                    {renderCircles(num)}
                    </div>
                  </div>
                              ))}
                    </div>
                  </div>
            </div>

                        <div className={`text-2xl font-bold text-purple-600 transition-all duration-500 ${
                          animatingExample === index && exampleStep === 'after' ? 'animate-bounce text-3xl text-green-600' : ''
                        }`}>
                          Résultat : {example.ordered.join(' < ')}
                </div>
                </div>
                </div>
                            ))}
              </div>
            </div>
                      )}

            {/* Conseils pratiques */}
            <div className="bg-white rounded-xl p-3 sm:p-8 shadow-lg">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                  💡 Trucs pour retenir
                </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-6">
                  <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-blue-800">
                    ⚖️ Pour comparer
                  </h3>
                  <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-blue-700">
                    <li>• Compte les objets</li>
                    <li>• Le "bec" pique le plus petit</li>
                    <li>• Plus de dizaines = plus grand</li>
                    <li>• Utilise la droite numérique</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 sm:p-6">
                  <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-purple-800">
                    📊 Pour mettre dans l'ordre
                  </h3>
                  <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-purple-700">
                    <li>• Commence par le plus petit</li>
                    <li>• Compare deux par deux</li>
                    <li>• Écris-les sur une ligne</li>
                    <li>• Vérifie en comptant</li>
                  </ul>
                </div>
                </div>
                </div>

            {/* Mini-jeu sobre */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              {/* En-tête simple */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">🎮 Mini-jeu : Compare rapidement !</h3>
                <button
                  onClick={resetMiniGame}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  🔄 Reset
                </button>
              </div>

              {/* Score simple */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  Score: <span className="font-bold text-gray-900">{miniGameScore}/4</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        completedAnswers[i] ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                ))}
            </div>
              </div>

              {/* Message de félicitations sobre */}
              {miniGameScore === 4 && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-4 text-center">
                  ✅ Excellent ! Toutes les réponses sont correctes !
                </div>
              )}

              <p className="text-sm text-gray-600 mb-4 text-center">
                Clique sur "Voir la solution" pour révéler chaque réponse.
              </p>

              {/* Cartes colorées */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { comparison: '8 ? 5', answer: '8 > 5', color: 'blue' },
                  { comparison: '3 ? 9', answer: '3 < 9', color: 'green' },
                  { comparison: '7 ? 7', answer: '7 = 7', color: 'orange' },
                  { comparison: '12 ? 6', answer: '12 > 6', color: 'purple' }
                ].map((item, index) => {
                  const getCardColors = (color: string) => {
                    switch(color) {
                      case 'blue':
                        return {
                          bg: completedAnswers[index] ? 'bg-blue-100 border-blue-400' : 'bg-blue-50 border-blue-200',
                          text: 'text-blue-800',
                          button: 'bg-blue-500 hover:bg-blue-600 text-white'
                        };
                      case 'green':
                        return {
                          bg: completedAnswers[index] ? 'bg-green-100 border-green-400' : 'bg-green-50 border-green-200',
                          text: 'text-green-800',
                          button: 'bg-green-500 hover:bg-green-600 text-white'
                        };
                      case 'orange':
                        return {
                          bg: completedAnswers[index] ? 'bg-orange-100 border-orange-400' : 'bg-orange-50 border-orange-200',
                          text: 'text-orange-800',
                          button: 'bg-orange-500 hover:bg-orange-600 text-white'
                        };
                      case 'purple':
                        return {
                          bg: completedAnswers[index] ? 'bg-purple-100 border-purple-400' : 'bg-purple-50 border-purple-200',
                          text: 'text-purple-800',
                          button: 'bg-purple-500 hover:bg-purple-600 text-white'
                        };
                      default:
                        return {
                          bg: 'bg-gray-50 border-gray-200',
                          text: 'text-gray-800',
                          button: 'bg-gray-500 hover:bg-gray-600 text-white'
                        };
                    }
                  };
                  
                  const colors = getCardColors(item.color);
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-lg border-2 text-center transition-all duration-300 ${colors.bg} ${colors.text}`}
                    >
                      <div className="font-bold text-base sm:text-lg mb-2">{item.comparison}</div>
                      
                      {revealedAnswers[index] ? (
                        <div className="space-y-2">
                          <div className="text-base sm:text-lg font-bold p-2 bg-white rounded border">
                            {item.answer}
                          </div>
                          {completedAnswers[index] && (
                            <div className="text-lg">
                              ✅
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => revealAnswer(index)}
                          className={`px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all hover:scale-105 ${colors.button}`}
                        >
                          👁️ Voir la solution
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Barre de progression simple */}
              {miniGameScore > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-500 ease-out"
                      style={{ width: `${(miniGameScore / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EXERCICES - FLOW NORMAL */
          <div className="space-y-4 sm:space-y-8">
            {/* Introduction de Sam le Pirate - toujours visible */}
            {SamPirateIntroJSX()}

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
                  {exercises[currentExercise]?.question || "Compare les nombres suivants"}
                </h3>
                {ListenQuestionButtonJSX()}
              </div>

              {/* Affichage selon le type d'exercice */}
              <div className="rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 bg-purple-50">
                <div className="space-y-2 sm:space-y-4">
                  <div className="text-xl sm:text-4xl font-bold text-purple-600">
                    {exercises[currentExercise].numbers?.join(' , ')}
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
                    onClick={() => handleAnswerClick(userAnswer)}
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
                          Pas tout à fait... Il fallait dire : {exercises[currentExercise].correctAnswer} !
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
                              {exercises[currentExercise].correctAnswer}
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <div className="text-sm sm:text-lg text-gray-700">
                              {exercises[currentExercise].question.includes('plus petit au plus grand') ? 
                                'Ordre croissant :' : 'Ordre décroissant :'} {exercises[currentExercise].correctAnswer}
                          </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              {exercises[currentExercise].question.includes('plus petit au plus grand') ? 
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

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Champion de la comparaison !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
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
                    <div className="bg-pink-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Savoir comparer et mettre dans l'ordre est très utile !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
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