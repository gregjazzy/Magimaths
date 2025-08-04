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
  const [zoomingSymbolPart, setZoomingSymbolPart] = useState<{symbol: string, part: 'num1' | 'operator' | 'num2' | 'count1' | 'count2' | 'tens1' | 'tens2' | 'units1' | 'units2'} | null>(null);
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
  
  // États du simulateur
  const [simulatorNum1, setSimulatorNum1] = useState<number>(67);
  const [simulatorNum2, setSimulatorNum2] = useState<number>(23);
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState(0);
  const [simulatorResult, setSimulatorResult] = useState<string>('');
  const [exerciseExplanationPlayed, setExerciseExplanationPlayed] = useState(false);

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

  // Fonction pour démarrer la comparaison du simulateur
  const startSimulatorComparison = async () => {
    if (isPlayingVocal || !simulatorNum1 || !simulatorNum2 || simulatorNum1 < 1 || simulatorNum1 > 100 || simulatorNum2 < 1 || simulatorNum2 > 100) {
      return;
    }

    setSimulatorActive(true);
    setSimulatorStep(0);
    setSimulatorResult('');
    setIsPlayingVocal(true);

    // Calculer le résultat de la comparaison
    const result = simulatorNum1 > simulatorNum2 ? '>' : simulatorNum1 < simulatorNum2 ? '<' : '=';
    setSimulatorResult(result);

    try {
      // Scroll vers la zone d'animation du simulateur
      const simulatorElement = document.getElementById('simulator');
      if (simulatorElement) {
        const animationZone = simulatorElement.querySelectorAll('[class*="bg-white rounded-lg"]')[1] || // Zone d'animation (deuxième bg-white)
                              simulatorElement.querySelector('[class*="bg-white rounded-lg"]');
        if (animationZone) {
          animationZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      // Introduction
      await playAudio(`Ahoy matelot ! Je vais t'expliquer comment comparer ${simulatorNum1} et ${simulatorNum2}. Suivons ma méthode étape par étape !`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Étape 1 : Compter les chiffres
      setSimulatorStep(1);
      
      // Scroll vers l'étape 1 du simulateur
      await new Promise(resolve => setTimeout(resolve, 500));
      const step1Simulator = findSimulatorStepElement(1);
      if (step1Simulator) {
        step1Simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      const num1Digits = simulatorNum1.toString().length;
      const num2Digits = simulatorNum2.toString().length;
      
      await playAudio(`Étape 1 : Je compte les chiffres. ${simulatorNum1} a ${num1Digits} chiffre${num1Digits > 1 ? 's' : ''}, et ${simulatorNum2} a ${num2Digits} chiffre${num2Digits > 1 ? 's' : ''}.`);
      
      if (num1Digits !== num2Digits) {
        const bigger = num1Digits > num2Digits ? simulatorNum1 : simulatorNum2;
        await playAudio(`Parfait ! ${bigger} a plus de chiffres, donc ${bigger} est plus grand ! C'est fini, mille sabords !`);
      } else {
        await playAudio(`Les deux nombres ont le même nombre de chiffres. Passons à l'étape 2 !`);
        
        // Si même nombre de chiffres, passer à l'étape 2
        await new Promise(resolve => setTimeout(resolve, 500));
        setSimulatorStep(2);
        
        // Scroll vers l'étape 2 du simulateur
        await new Promise(resolve => setTimeout(resolve, 500));
        const step2Simulator = findSimulatorStepElement(2);
        if (step2Simulator) {
          step2Simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        const tens1 = Math.floor(simulatorNum1 / 10);
        const tens2 = Math.floor(simulatorNum2 / 10);
        
        await playAudio(`Étape 2 : Je compare les dizaines. ${simulatorNum1} a ${tens1} dizaine${tens1 > 1 ? 's' : ''}, et ${simulatorNum2} a ${tens2} dizaine${tens2 > 1 ? 's' : ''}.`);
        
        if (tens1 !== tens2) {
          const bigger = tens1 > tens2 ? simulatorNum1 : simulatorNum2;
          const biggerTens = tens1 > tens2 ? tens1 : tens2;
          await playAudio(`Excellent ! ${biggerTens} dizaines, c'est plus que l'autre ! Donc ${bigger} est plus grand, tonnerre de Brest !`);
        } else {
          await playAudio(`Les dizaines sont identiques ! Il faut comparer les unités. En route pour l'étape 3 !`);
          
          // Si mêmes dizaines, passer à l'étape 3
          await new Promise(resolve => setTimeout(resolve, 500));
          setSimulatorStep(3);
          
          // Scroll vers l'étape 3 du simulateur
          await new Promise(resolve => setTimeout(resolve, 500));
          const step3Simulator = findSimulatorStepElement(3);
          if (step3Simulator) {
            step3Simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 800));
          }
          
          const units1 = simulatorNum1 % 10;
          const units2 = simulatorNum2 % 10;
          
          await playAudio(`Étape 3 : Je compare les unités. ${simulatorNum1} a ${units1} unité${units1 > 1 ? 's' : ''}, et ${simulatorNum2} a ${units2} unité${units2 > 1 ? 's' : ''}.`);
          
          if (units1 > units2) {
            await playAudio(`${units1} unités, c'est plus que ${units2} ! Donc ${simulatorNum1} est plus grand !`);
          } else if (units1 < units2) {
            await playAudio(`${units2} unités, c'est plus que ${units1} ! Donc ${simulatorNum2} est plus grand !`);
          } else {
            await playAudio(`${units1} unités partout ! Les deux nombres sont exactement égaux, sacrebleu !`);
          }
        }
      }
      
      // Résultat final
      await new Promise(resolve => setTimeout(resolve, 500));
      setSimulatorStep(4);
      
      // Scroll vers le résultat final
      await new Promise(resolve => setTimeout(resolve, 500));
      const finalResult = findSimulatorStepElement(4);
      if (finalResult) {
        finalResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const finalMessage = simulatorNum1 > simulatorNum2 ? 
        `Conclusion : ${simulatorNum1} est plus grand que ${simulatorNum2} !` :
        simulatorNum1 < simulatorNum2 ? 
        `Conclusion : ${simulatorNum1} est plus petit que ${simulatorNum2} !` :
        `Conclusion : ${simulatorNum1} et ${simulatorNum2} sont exactement égaux !`;
      
      await playAudio(`${finalMessage} Tu as bien suivi ma méthode, bravo matelot ! Tu peux essayer avec d'autres nombres maintenant !`);
      
    } catch (error) {
      console.error('Erreur lors de l\'explication vocale:', error);
    } finally {
      setIsPlayingVocal(false);
    }
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

  // Fonction utilitaire pour trouver les éléments d'étape
  const findStepElement = (stepText: string) => {
    const h3Elements = document.getElementsByTagName('h3');
    for (let i = 0; i < h3Elements.length; i++) {
      const h3 = h3Elements[i];
      if (h3.textContent?.includes(stepText)) {
        return h3.parentElement;
      }
    }
    return null;
  };

  // Fonction utilitaire pour trouver les éléments d'étape du simulateur
  const findSimulatorStepElement = (stepNumber: number) => {
    const simulatorEl = document.getElementById('simulator');
    if (!simulatorEl) return null;
    
    // Chercher les éléments avec les bonnes classes de couleur selon l'étape
    const colorMaps = {
      1: 'purple-100',
      2: 'blue-100', 
      3: 'green-100',
      4: 'yellow-100'
    };
    
    const colorClass = colorMaps[stepNumber as keyof typeof colorMaps];
    return simulatorEl.querySelector(`[class*="${colorClass}"]`);
  };

  // Fonction pour Sam explique la méthode de comparaison progressive pour nombres jusqu'à 100
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
      
      await playAudio("Ahoy moussaillons ! Sam le pirate va vous apprendre la méthode secrète pour comparer les nombres jusqu'à 100 !");
      await wait(1000);
      
      // ÉTAPE 1: Compter les chiffres
      setHighlightedElement('symbols');
      await playAudio("Première étape : je compte combien il y a de chiffres dans chaque nombre !");
      await wait(800);
      
      // Scroll vers l'étape 1 pour la rendre bien visible
      const step1Element = findStepElement('Étape 1');
      if (step1Element) {
        step1Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
      }
      
      setHighlightedSymbol('step1');
      await playAudio("Regardez ! 67 a 2 chiffres, et 8 a seulement 1 chiffre !");
      await wait(1000);
      
      // Animation des chiffres
      setZoomingSymbolPart({ symbol: 'step1', part: 'count1' });
      await playAudio("67 : je compte 6, 7... ça fait 2 chiffres !");
      await wait(1500);
      
      setZoomingSymbolPart({ symbol: 'step1', part: 'count2' });
      await playAudio("8 : je compte 8... ça fait 1 chiffre seulement !");
      await wait(1500);
      
      setZoomingSymbolPart({ symbol: 'step1', part: 'operator' });
      await playAudio("Plus de chiffres veut dire plus grand ! Donc 67 est plus grand que 8 !");
      await wait(2000);
      
      setZoomingSymbolPart(null);
      setHighlightedSymbol(null);
      await wait(800);
      
      // ÉTAPE 2: Comparer les dizaines
      await playAudio("Deuxième étape : si les nombres ont le même nombre de chiffres, je compare les dizaines !");
      await wait(1000);
      
      // Scroll vers l'étape 2
      const step2Element = findStepElement('Étape 2');
      if (step2Element) {
        step2Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
      }
      
      setHighlightedSymbol('step2');
      await playAudio("Ici, 67 et 23 ont tous les deux 2 chiffres. Alors je regarde les dizaines !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step2', part: 'tens1' });
      await playAudio("67 a 6 dizaines !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step2', part: 'tens2' });
      await playAudio("23 a 2 dizaines seulement !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step2', part: 'operator' });
      await playAudio("6 dizaines, c'est plus que 2 dizaines ! Donc 67 est plus grand que 23 !");
      await wait(2000);
      
      setZoomingSymbolPart(null);
      setHighlightedSymbol(null);
      await wait(800);
      
      // ÉTAPE 3: Comparer les unités
      await playAudio("Troisième étape : si les dizaines sont pareilles, je compare les unités !");
      await wait(1000);
      
      // Scroll vers l'étape 3
      const step3Element = findStepElement('Étape 3');
      if (step3Element) {
        step3Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
      }
      
      setHighlightedSymbol('step3');
      await playAudio("Regardez ! 67 et 64 ont les mêmes dizaines : 6. Alors je regarde les unités !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step3', part: 'units1' });
      await playAudio("67 a 7 unités !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step3', part: 'units2' });
      await playAudio("64 a 4 unités !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step3', part: 'operator' });
      await playAudio("7 unités, c'est plus que 4 unités ! Donc 67 est plus grand que 64 !");
      await wait(2000);
      
      setZoomingSymbolPart(null);
      setHighlightedSymbol(null);
      await wait(800);
      
      // RÉSUMÉ
      await playAudio("Maintenant vous connaissez la méthode complète !");
      await wait(800);
      
      // Scroll vers le résumé de la méthode
      const methodElement = findStepElement('Ma méthode pour comparer');
      if (methodElement) {
        methodElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
      }
      
      setHighlightedSymbol('summary');
      await playAudio("Un : je compte les chiffres ! Deux : je compare les dizaines ! Trois : je compare les unités !");
      await wait(3000);
      
      // Anciens symboles pour référence
      await playAudio("Et n'oubliez pas : le bec du symbole pique toujours le plus petit nombre !");
      await wait(1000);
      
      setHighlightedSymbol('>');
      await playAudio("Plus grand que pique vers la droite !");
      await wait(1500);
      
      setHighlightedSymbol('<');
      await playAudio("Plus petit que pique vers la gauche !");
      await wait(1500);
      
      setHighlightedSymbol('=');
      await playAudio("Et égal, c'est quand c'est exactement pareil !");
      await wait(1000);
      
      setHighlightedSymbol(null);
      await wait(500);
      
      await playAudio("Voilà ! Maintenant vous connaissez la méthode complète pour comparer tous les nombres jusqu'à 100 !");
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
    setSamSizeExpanded(true);
    
    // 1. Sam présente le chapitre
    await playAudio("Salut matelot ! Je suis Sam le pirate et aujourd'hui je vais te présenter ce chapitre sur la comparaison des nombres jusqu'à 100 !");
      if (stopSignalRef.current) return;
      
    // 2. Scroll vers la méthode + illuminer le bouton "Voir l'animation automatique"
    await wait(1000);
    
    // Scroll optimisé vers le bouton d'animation pour qu'il soit bien visible
    const animationButton = document.getElementById('animation-button');
    if (animationButton) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Sur mobile, positionner le bouton plus haut pour qu'il soit bien visible
        animationButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Sur desktop, positionner le bouton dans le tiers supérieur de l'écran
        animationButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Ajuster légèrement vers le haut
        setTimeout(() => {
          window.scrollBy({ top: -100, behavior: 'smooth' });
        }, 300);
      }
    }
    
    await wait(800);
    setHighlightedElement('animation-button');
    await playAudio("Tu peux cliquer ici pour voir la méthode infaillible pour comparer deux nombres !");
      if (stopSignalRef.current) return;
      
    // 3. Scroll vers le simulateur + illuminer les cases de saisie puis le bouton
    await wait(1500);
    setHighlightedElement(null);
    scrollToElement('simulator');
    await wait(800);
    
    // Illuminer les cases de saisie et expliquer qu'on peut entrer ses nombres
    setHighlightedElement('simulator-inputs');
    await playAudio("Si tu veux, tu peux entrer tes propres nombres dans ces cases pour les comparer avec ma méthode !");
      if (stopSignalRef.current) return;
      
    await wait(1500);
    setHighlightedElement('compare-button');
    await playAudio("Puis clique sur Comparer pour voir l'animation étape par étape !");
      if (stopSignalRef.current) return;
      
    // 4. Scroll vers le haut + illuminer l'onglet "Exercices" + conclusion
    await wait(1500);
    setHighlightedElement(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await wait(1200);
    setHighlightedElement('exercises-tab');
    await playAudio("Une fois que tu es prêt, entraîne-toi avec les exercices pour gagner des points !");
      if (stopSignalRef.current) return;
      
    // 5. Conclusion
    await wait(1000);
    setHighlightedElement(null);
      setSamSizeExpanded(false);
    await playAudio("Amuse-toi bien, matelot !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
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
      
      // Marquer que l'explication a été jouée
      setExerciseExplanationPlayed(true);
      
    } catch (error) {
      console.error('Erreur dans startExerciseExplanation:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour féliciter avec audio pour les bonnes réponses
  const celebrateCorrectAnswer = async () => {
    // Forcer la réactivation pour permettre les encouragements même après stopAll
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
      
      // Explication détaillée selon le type d'exercice
      if (exercise.type === 'comparaison') {
        const [num1, num2] = exercise.numbers;
        const correctAnswer = exercise.correctAnswer;
        
        if (correctAnswer.includes('>')) {
          await playAudio(`${num1} est plus grand que ${num2} !`);
        } else if (correctAnswer.includes('<')) {
          await playAudio(`${num1} est plus petit que ${num2} !`);
      } else {
          await playAudio(`${num1} est égal à ${num2} !`);
        }
      } else if (exercise.type === 'rangement') {
        const numbers = exercise.numbers;
        const correctOrder = exercise.correctAnswer.split(', ').map(n => parseInt(n.trim()));
        
        // Déterminer si c'est du plus petit au plus grand ou l'inverse
        const isAscending = correctOrder[0] < correctOrder[1];
        
        if (isAscending) {
          // Du plus petit au plus grand
          await playAudio(`${correctOrder[0]} est plus petit que ${correctOrder[1]}, et ${correctOrder[1]} est plus petit que ${correctOrder[2]} !`);
          await wait(500);
          if (stopSignalRef.current) return;
          await playAudio(`Donc l'ordre du plus petit au plus grand est : ${exercise.correctAnswer} !`);
        } else {
          // Du plus grand au plus petit
          await playAudio(`${correctOrder[0]} est plus grand que ${correctOrder[1]}, et ${correctOrder[1]} est plus grand que ${correctOrder[2]} !`);
          await wait(500);
          if (stopSignalRef.current) return;
          await playAudio(`Donc l'ordre du plus grand au plus petit est : ${exercise.correctAnswer} !`);
        }
      } else {
        // Fallback pour les autres types
        await playAudio(`L'ordre correct était : ${exercise.correctAnswer} !`);
      }
      
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
            // Pour mobile: scroll pour placer le bouton en bas de l'écran
            const buttonRect = nextButton.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const currentScrollY = window.pageYOffset;
            
            // Calculer la position pour mettre le bouton en bas de l'écran
            const targetScrollY = currentScrollY + buttonRect.bottom - windowHeight + 20; // +20px de marge
            
            window.scrollTo({
              top: Math.max(0, targetScrollY),
              behavior: 'smooth'
            });
      } else {
            // Pour desktop: scroll normal
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'end',
              inline: 'nearest' 
            });
          }
          
          // Animation d'attention sur le bouton avec délai plus long
          setTimeout(() => {
            nextButton.classList.add('animate-bounce');
            setTimeout(() => {
              nextButton.classList.remove('animate-bounce');
            }, 3000); // Plus long pour être sûr que l'utilisateur le voit
          }, isMobile ? 1200 : 800);
        }
      }, 1500); // Délai plus long pour que tout l'audio se termine
      
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
    { num1: 34, num2: 78, symbol: '<' },
    { num1: 89, num2: 25, symbol: '>' },
    { num1: 56, num2: 56, symbol: '=' },
    { num1: 67, num2: 43, symbol: '>' },
    { num1: 28, num2: 85, symbol: '<' }
  ];

  // Exemples de rangements
  const rangementExamples = [
    { numbers: [34, 12, 67], ordered: [12, 34, 67] },
    { numbers: [89, 25, 56], ordered: [25, 56, 89] },
    { numbers: [73, 41, 95], ordered: [41, 73, 95] }
  ];

  // Fonction pour générer 9 exercices : 5 comparaisons puis 4 rangements
  const generateRandomExercises = () => {
    // Exercices de comparaison (2 nombres) pour les questions 1 à 5
    const comparisonExercises = [
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [67, 34], correctAnswer: '67 > 34', choices: ['67 > 34', '67 < 34', '67 = 34'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [25, 89], correctAnswer: '25 < 89', choices: ['25 > 89', '25 < 89', '25 = 89'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [45, 45], correctAnswer: '45 = 45', choices: ['45 > 45', '45 < 45', '45 = 45'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [78, 23], correctAnswer: '78 > 23', choices: ['78 > 23', '78 < 23', '78 = 23'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [32, 87], correctAnswer: '32 < 87', choices: ['32 > 87', '32 < 87', '32 = 87'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [56, 56], correctAnswer: '56 = 56', choices: ['56 > 56', '56 < 56', '56 = 56'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [94, 47], correctAnswer: '94 > 47', choices: ['94 > 47', '94 < 47', '94 = 47'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [13, 64], correctAnswer: '13 < 64', choices: ['13 > 64', '13 < 64', '13 = 64'] }
    ];

    // Exercices de rangement (3 nombres) pour les questions 6 à 9
    const rangementExercises = [
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [45, 23, 78], correctAnswer: '23, 45, 78', choices: ['23, 45, 78', '78, 45, 23', '45, 23, 78'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [34, 67, 12], correctAnswer: '67, 34, 12', choices: ['12, 34, 67', '67, 34, 12', '34, 67, 12'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [74, 26, 61], correctAnswer: '26, 61, 74', choices: ['26, 61, 74', '74, 61, 26', '61, 26, 74'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [9, 52, 37], correctAnswer: '52, 37, 9', choices: ['9, 37, 52', '52, 37, 9', '37, 52, 9'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [18, 83, 42], correctAnswer: '18, 42, 83', choices: ['18, 42, 83', '83, 42, 18', '42, 18, 83'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [71, 28, 95], correctAnswer: '95, 71, 28', choices: ['28, 71, 95', '95, 71, 28', '71, 95, 28'] }
    ];

    // Mélanger les exercices de chaque type
    const shuffledComparisons = [...comparisonExercises].sort(() => Math.random() - 0.5);
    const shuffledRangements = [...rangementExercises].sort(() => Math.random() - 0.5);

    // Prendre 5 comparaisons + 4 rangements = 9 exercices au total
    const finalExercises = [
      ...shuffledComparisons.slice(0, 5), // 5 premiers : comparaisons
      ...shuffledRangements.slice(0, 4)   // 4 suivants : rangements
    ];

    return finalExercises;
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
    setUserAnswer(answer);
    
    // Nouvelle logique de validation pour les exercices de rangement
    let correct = false;
    const exercise = exercises[currentExercise];
    
    // Pour les rangements : vérifier l'ordre des nombres
    const userNumbers = answer.split(',').map(n => n.trim()).join(', ');
    correct = userNumbers === exercise.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      // Arrêter seulement les animations, pas l'audio pour laisser Sam parler
      setAnimatingComparison(false);
      setAnimatingRangement(false);
      setAnimatingStep(null);
      setHighlightedElement(null);
      
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });

      // Célébrer avec Sam le Pirate d'abord
      await celebrateCorrectAnswer();
      
      // Passage automatique après l'encouragement de Sam
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          // Prochain exercice
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setExerciseExplanationPlayed(false);
        } else {
          // Dernier exercice terminé
          setFinalScore(score + 1);
          setShowCompletionModal(true);
          saveProgress(score + 1, exercises.length);
        }
      }, 800);
    } else if (!correct) {
      // Pour les mauvaises réponses, on peut arrêter l'audio
      stopAllVocalsAndAnimations();
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
      setExerciseExplanationPlayed(false);
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
    setExerciseExplanationPlayed(false);
    
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
        onClick={explainChapter}
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
              ? <>🔄 <span>Recommencer</span></>
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
        <span>{exerciseExplanationPlayed ? '🔄 Réécouter' : '🎧 Écouter l\'énoncé'}</span>
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
            href="/chapitre/cp-nombres-jusqu-100" 
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
              className={`px-4 sm:px-6 py-3 sm:py-3 rounded-lg font-bold text-base sm:text-base transition-all ${
                !showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              id="exercises-tab"
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-4 sm:px-6 py-3 sm:py-3 rounded-lg font-bold text-base sm:text-base transition-all ${
                showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : highlightedElement === 'exercises-tab'
                    ? 'bg-yellow-400 text-gray-900 ring-4 ring-yellow-300 animate-pulse scale-110 shadow-xl'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS - MOBILE OPTIMISÉ */
          <div className="space-y-4 sm:space-y-8">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-4 mb-6 sm:mb-8">
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
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-12 py-4 sm:py-6 rounded-xl font-bold text-lg sm:text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
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
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'symbols' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
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
                  id="animation-button"
                  onClick={() => samExplainsComparisons()}
                  disabled={isPlayingVocal}
                  className={`px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-white text-sm sm:text-lg transition-all duration-300 ${
                    isPlayingVocal 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : highlightedElement === 'animation-button'
                        ? 'bg-yellow-500 ring-4 ring-yellow-300 animate-pulse scale-110 shadow-2xl'
                        : 'bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  ▶️ Voir l'animation automatique
                  </button>
              </div>
              
              {/* Animation progressive pour nombres jusqu'à 100 */}
              <div className="space-y-6 sm:space-y-8">
                {/* Étape 1: Comparer le nombre de chiffres */}
                <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'step1' ? 'ring-4 ring-purple-400 bg-purple-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 sm:mb-4 text-center">
                    🔍 Étape 1 : Je compte les chiffres
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-8 mb-2 sm:mb-4">
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-purple-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'num1' ? 'animate-bounce scale-150 text-green-600' : ''
                      }`}>67</div>
                      <div className={`text-xs sm:text-sm text-purple-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'count1' ? 'animate-pulse text-green-600 scale-110' : ''
                      }`}>2 chiffres</div>
            </div>

                    <div className={`text-2xl sm:text-4xl font-bold text-purple-600 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'operator' ? 'animate-bounce scale-150 text-green-600' : ''
                    }`}>&gt;</div>
                    
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-purple-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'num2' ? 'animate-bounce scale-150 text-red-600' : ''
                      }`}>8</div>
                      <div className={`text-xs sm:text-sm text-purple-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'count2' ? 'animate-pulse text-red-600 scale-110' : ''
                      }`}>1 chiffre</div>
                    </div>
                  </div>
                  
                  <div className={`text-center text-sm sm:text-base text-purple-700 font-semibold ${
                    highlightedSymbol === 'step1' ? 'animate-pulse' : ''
                  }`}>
                    ✅ 67 a plus de chiffres → 67 est plus grand !
                  </div>
                </div>

                                                {/* Étape 2: Si même nombre de chiffres, comparer les dizaines */}
                <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'step2' ? 'ring-4 ring-blue-400 bg-blue-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 sm:mb-4 text-center">
                    🔍 Étape 2 : Même nombre de chiffres → Je compare les dizaines
                </h3>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-8 mb-2 sm:mb-4">
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-blue-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'num1' ? 'animate-bounce scale-150' : ''
                      }`}>
                        <span className={`${
                          zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'tens1' ? 'bg-green-200 px-1 rounded text-green-800' : ''
                        }`}>6</span>7
                </div>
                      <div className={`text-xs sm:text-sm text-blue-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'tens1' ? 'animate-pulse text-green-600 scale-110' : ''
                      }`}>6 dizaines</div>
              </div>
              
                    <div className={`text-2xl sm:text-4xl font-bold text-blue-600 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'operator' ? 'animate-bounce scale-150 text-green-600' : ''
                    }`}>&gt;</div>
                    
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-blue-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'num2' ? 'animate-bounce scale-150' : ''
                      }`}>
                      <span className={`${
                          zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'tens2' ? 'bg-red-200 px-1 rounded text-red-800' : ''
                        }`}>2</span>3
                      </div>
                      <div className={`text-xs sm:text-sm text-blue-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'tens2' ? 'animate-pulse text-red-600 scale-110' : ''
                      }`}>2 dizaines</div>
                    </div>
                  </div>
                  
                  <div className={`text-center text-sm sm:text-base text-blue-700 font-semibold ${
                    highlightedSymbol === 'step2' ? 'animate-pulse' : ''
                  }`}>
                    ✅ 6 dizaines &gt; 2 dizaines → 67 est plus grand !
                  </div>
                    </div>
                    
                                {/* Étape 3: Si même dizaines, comparer les unités */}
                <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'step3' ? 'ring-4 ring-green-400 bg-green-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 sm:mb-4 text-center">
                    🔍 Étape 3 : Mêmes dizaines → Je compare les unités
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-8 mb-2 sm:mb-4">
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-green-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'num1' ? 'animate-bounce scale-150' : ''
                      }`}>
                        6<span className={`${
                          zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'units1' ? 'bg-green-200 px-1 rounded text-green-800' : ''
                        }`}>7</span>
                      </div>
                      <div className={`text-xs sm:text-sm text-green-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'units1' ? 'animate-pulse text-green-600 scale-110' : ''
                      }`}>7 unités</div>
                    </div>

                    <div className={`text-2xl sm:text-4xl font-bold text-green-600 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'operator' ? 'animate-bounce scale-150 text-green-600' : ''
                    }`}>&gt;</div>
                    
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-green-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'num2' ? 'animate-bounce scale-150' : ''
                      }`}>
                        6<span className={`${
                          zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'units2' ? 'bg-red-200 px-1 rounded text-red-800' : ''
                        }`}>4</span>
                      </div>
                      <div className={`text-xs sm:text-sm text-green-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'units2' ? 'animate-pulse text-red-600 scale-110' : ''
                      }`}>4 unités</div>
                      </div>
                    </div>

                  <div className={`text-center text-sm sm:text-base text-green-700 font-semibold ${
                    highlightedSymbol === 'step3' ? 'animate-pulse' : ''
                  }`}>
                    ✅ 7 unités &gt; 4 unités → 67 est plus grand !
                  </div>
                </div>

                {/* Résumé de la méthode */}
                <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'summary' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 sm:mb-4 text-center">
                    📋 Ma méthode pour comparer les nombres jusqu'à 100
                  </h3>
                  <div className="space-y-2 text-sm sm:text-base text-orange-700">
                    <div className={`flex items-center gap-2 ${
                      highlightedSymbol === 'summary' ? 'animate-pulse' : ''
                    }`}>
                      <span className="font-bold text-orange-800">1️⃣</span>
                      <span>Je compte le nombre de chiffres → Plus de chiffres = plus grand</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      highlightedSymbol === 'summary' ? 'animate-pulse' : ''
                    }`}>
                      <span className="font-bold text-orange-800">2️⃣</span>
                      <span>Si même nombre de chiffres → Je compare les dizaines</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      highlightedSymbol === 'summary' ? 'animate-pulse' : ''
                    }`}>
                      <span className="font-bold text-orange-800">3️⃣</span>
                      <span>Si mêmes dizaines → Je compare les unités</span>
                    </div>
                  </div>
                </div>
              </div>


              
              {/* Simulateur interactif */}
              <div id="simulator" className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 sm:p-6 mt-8 border-2 border-indigo-200">
                <div className="text-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-2">
                    🎮 Simulateur : Teste avec tes nombres !
                  </h3>
                  <p className="text-base sm:text-base text-indigo-600">
                    Entre deux nombres et regarde l'animation de comparaison étape par étape
                  </p>
                </div>
                
                {/* Saisie des nombres */}
                <div className="bg-white rounded-lg p-6 sm:p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="text-center">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Premier nombre (1-100)
                      </label>
                      <input
                        id="simulator-input-1"
                        type="number"
                        min="1"
                        max="100"
                        value={simulatorNum1}
                        onChange={(e) => setSimulatorNum1(Number(e.target.value))}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:outline-none transition-all duration-300 ${
                          highlightedElement === 'simulator-inputs' 
                            ? 'border-yellow-400 ring-4 ring-yellow-300 bg-yellow-50 shadow-xl scale-105' 
                            : 'border-indigo-200'
                        }`}
                        placeholder="Ex: 67"
                        disabled={isPlayingVocal}
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">VS</div>
                      <button
                        id="compare-button"
                        onClick={startSimulatorComparison}
                        disabled={isPlayingVocal || !simulatorNum1 || !simulatorNum2 || simulatorNum1 < 1 || simulatorNum1 > 100 || simulatorNum2 < 1 || simulatorNum2 > 100}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                          isPlayingVocal || !simulatorNum1 || !simulatorNum2 || simulatorNum1 < 1 || simulatorNum1 > 100 || simulatorNum2 < 1 || simulatorNum2 > 100
                            ? 'bg-gray-400 cursor-not-allowed'
                            : highlightedElement === 'compare-button'
                              ? 'bg-yellow-500 ring-4 ring-yellow-300 animate-pulse scale-110 shadow-2xl'
                              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105 shadow-lg'
                        }`}
                      >
                        ▶️ Comparer !
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Deuxième nombre (1-100)
                      </label>
                      <input
                        id="simulator-input-2"
                        type="number"
                        min="1"
                        max="100"
                        value={simulatorNum2}
                        onChange={(e) => setSimulatorNum2(Number(e.target.value))}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:outline-none transition-all duration-300 ${
                          highlightedElement === 'simulator-inputs' 
                            ? 'border-yellow-400 ring-4 ring-yellow-300 bg-yellow-50 shadow-xl scale-105' 
                            : 'border-indigo-200'
                        }`}
                        placeholder="Ex: 23"
                        disabled={isPlayingVocal}
                      />
                  </div>
                </div>
            </div>

                {/* Zone d'animation du simulateur */}
                <div className={`bg-white rounded-lg p-4 sm:p-6 transition-all duration-1000 ${
                  simulatorActive ? 'ring-4 ring-indigo-400 bg-indigo-50' : ''
                }`}>
                  {simulatorActive ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="text-lg sm:text-xl font-bold text-indigo-800 mb-4">
                          🔍 Comparaison en cours : {simulatorNum1} ? {simulatorNum2}
                        </h4>
                      </div>
                      
                      {/* Simulation des étapes */}
                      <div className="space-y-4">
                        {/* Étape 1 */}
                        <div className={`p-4 rounded-lg transition-all duration-1000 ${
                          simulatorStep >= 1 ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                              <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 1 ? 'text-purple-800 animate-bounce' : 'text-gray-500'
                              }`}>{simulatorNum1}</div>
                              <div className={`text-sm font-bold ${
                                simulatorStep >= 1 ? 'text-purple-600' : 'text-gray-400'
                              }`}>
                                {simulatorNum1.toString().length} chiffre{simulatorNum1.toString().length > 1 ? 's' : ''}
                              </div>
                            </div>
                            
                            <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                              simulatorStep >= 1 ? 'text-purple-600' : 'text-gray-400'
                            }`}>
                              {simulatorResult && simulatorStep >= 1 ? simulatorResult : '?'}
                            </div>
                            
                            <div className="text-center">
                              <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 1 ? 'text-purple-800 animate-bounce' : 'text-gray-500'
                              }`}>{simulatorNum2}</div>
                              <div className={`text-sm font-bold ${
                                simulatorStep >= 1 ? 'text-purple-600' : 'text-gray-400'
                              }`}>
                                {simulatorNum2.toString().length} chiffre{simulatorNum2.toString().length > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          {simulatorStep >= 1 && (
                            <div className="text-center mt-3">
                              <div className="text-purple-700 font-semibold">
                                {simulatorNum1.toString().length !== simulatorNum2.toString().length 
                                  ? `✅ Étape 1 suffit : ${simulatorNum1.toString().length > simulatorNum2.toString().length 
                                      ? `${simulatorNum1} a plus de chiffres` 
                                      : `${simulatorNum2} a plus de chiffres`} !`
                                  : "🔄 Même nombre de chiffres, on passe à l'étape 2"
                                }
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Étape 2 */}
                        {simulatorNum1.toString().length === simulatorNum2.toString().length && (
                          <div className={`p-4 rounded-lg transition-all duration-1000 ${
                            simulatorStep >= 2 ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-center gap-8">
                              <div className="text-center">
                                <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 2 ? 'text-blue-800' : 'text-gray-500'
                                }`}>
                      <span className={`${
                                    simulatorStep >= 2 ? 'bg-green-200 px-1 rounded' : ''
                      }`}>
                                    {Math.floor(simulatorNum1 / 10)}
                      </span>
                                  {simulatorNum1 % 10}
                                </div>
                                <div className={`text-sm font-bold ${
                                  simulatorStep >= 2 ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                  {Math.floor(simulatorNum1 / 10)} dizaine{Math.floor(simulatorNum1 / 10) > 1 ? 's' : ''}
                                </div>
                    </div>
                    
                              <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 2 ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                {simulatorResult && simulatorStep >= 2 ? simulatorResult : '?'}
                              </div>
                              
                              <div className="text-center">
                                <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 2 ? 'text-blue-800' : 'text-gray-500'
                                }`}>
                                  <span className={`${
                                    simulatorStep >= 2 ? 'bg-red-200 px-1 rounded' : ''
                                  }`}>
                                    {Math.floor(simulatorNum2 / 10)}
                                  </span>
                                  {simulatorNum2 % 10}
                                </div>
                                <div className={`text-sm font-bold ${
                                  simulatorStep >= 2 ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                  {Math.floor(simulatorNum2 / 10)} dizaine{Math.floor(simulatorNum2 / 10) > 1 ? 's' : ''}
                                </div>
                      </div>
                    </div>

                            {simulatorStep >= 2 && (
                              <div className="text-center mt-3">
                                <div className="text-blue-700 font-semibold">
                                  {Math.floor(simulatorNum1 / 10) !== Math.floor(simulatorNum2 / 10)
                                    ? `✅ Étape 2 suffit : ${Math.floor(simulatorNum1 / 10) > Math.floor(simulatorNum2 / 10) 
                                        ? `${Math.floor(simulatorNum1 / 10)} > ${Math.floor(simulatorNum2 / 10)} dizaines` 
                                        : `${Math.floor(simulatorNum1 / 10)} < ${Math.floor(simulatorNum2 / 10)} dizaines`} !`
                                    : "🔄 Mêmes dizaines, on passe à l'étape 3"
                                  }
                      </div>
                      </div>
                            )}
                    </div>
                        )}
                        
                        {/* Étape 3 */}
                        {simulatorNum1.toString().length === simulatorNum2.toString().length && 
                         Math.floor(simulatorNum1 / 10) === Math.floor(simulatorNum2 / 10) && (
                          <div className={`p-4 rounded-lg transition-all duration-1000 ${
                            simulatorStep >= 3 ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-center gap-8">
                              <div className="text-center">
                                <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 3 ? 'text-green-800' : 'text-gray-500'
                                }`}>
                                  {Math.floor(simulatorNum1 / 10)}
                                  <span className={`${
                                    simulatorStep >= 3 ? 'bg-green-200 px-1 rounded' : ''
                                  }`}>
                                    {simulatorNum1 % 10}
                                  </span>
                                </div>
                                <div className={`text-sm font-bold ${
                                  simulatorStep >= 3 ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum1 % 10} unité{simulatorNum1 % 10 > 1 ? 's' : ''}
                                </div>
                              </div>
                              
                              <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 3 ? 'text-green-600' : 'text-gray-400'
                              }`}>
                                {simulatorResult && simulatorStep >= 3 ? simulatorResult : '?'}
                              </div>
                              
                              <div className="text-center">
                                <div className={`text-2xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 3 ? 'text-green-800' : 'text-gray-500'
                                }`}>
                                  {Math.floor(simulatorNum2 / 10)}
                                  <span className={`${
                                    simulatorStep >= 3 ? 'bg-red-200 px-1 rounded' : ''
                                  }`}>
                                    {simulatorNum2 % 10}
                                  </span>
                                </div>
                                <div className={`text-sm font-bold ${
                                  simulatorStep >= 3 ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum2 % 10} unité{simulatorNum2 % 10 > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            
                            {simulatorStep >= 3 && (
                              <div className="text-center mt-3">
                                <div className="text-green-700 font-semibold">
                                  ✅ Étape 3 : {simulatorNum1 % 10 > simulatorNum2 % 10 
                                    ? `${simulatorNum1 % 10} > ${simulatorNum2 % 10} unités` 
                                    : simulatorNum1 % 10 < simulatorNum2 % 10
                                    ? `${simulatorNum1 % 10} < ${simulatorNum2 % 10} unités`
                                    : `${simulatorNum1 % 10} = ${simulatorNum2 % 10} unités`} !
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Résultat final */}
                        {simulatorStep >= 4 && (
                          <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                            <div className="text-center">
                              <h4 className="text-xl font-bold text-yellow-800 mb-2">
                                🎉 Résultat final !
                      </h4>
                              <div className="text-2xl font-bold text-yellow-700">
                                {simulatorNum1} {simulatorResult} {simulatorNum2}
                              </div>
                              <div className="text-yellow-600 mt-2">
                                {simulatorNum1 > simulatorNum2 ? `${simulatorNum1} est plus grand que ${simulatorNum2}` :
                                 simulatorNum1 < simulatorNum2 ? `${simulatorNum1} est plus petit que ${simulatorNum2}` :
                                 `${simulatorNum1} est égal à ${simulatorNum2}`}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-4">🎯</div>
                      <p className="text-lg font-semibold">
                        Entre deux nombres ci-dessus et clique sur "Comparer !" pour voir l'animation
                      </p>
                    </div>
                  )}
                </div>
                

              </div>
            </div>





            {/* Affichage selon l'activité sélectionnée */}
            {selectedActivity === 'comparer' ? (
              <div></div>
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



            {/* Mini-jeu sobre */}
            <div className="bg-white rounded-xl p-6 sm:p-6 shadow-lg border border-gray-200 mt-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { comparison: '67 ? 34', answer: '67 > 34', color: 'blue' },
                  { comparison: '25 ? 89', answer: '25 < 89', color: 'green' },
                  { comparison: '45 ? 45', answer: '45 = 45', color: 'orange' },
                  { comparison: '78 ? 23', answer: '78 > 23', color: 'purple' }
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
                        className={`p-4 sm:p-4 rounded-lg border-2 text-center transition-all duration-300 ${colors.bg} ${colors.text}`}
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
            <div className="block md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3">
              <div className="text-center mb-2">
                <div className="text-sm font-bold text-gray-700 mb-1">
                  Exercice {currentExercise + 1} sur {exercises.length}
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
              
            {/* Header exercices desktop */}
            <div className="hidden md:block bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={() => {
                    // Reset pour recommencer depuis le début
                    setCurrentExercise(0);
                    setScore(0);
                    setUserAnswer('');
                    setIsCorrect(null);
                    setAnsweredCorrectly(new Set());
                    setShowCompletionModal(false);
                    setFinalScore(0);
                    setExerciseExplanationPlayed(false);
                    stopAllVocalsAndAnimations();
                  }}
                  className="hidden sm:block bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <span className="inline w-4 h-4 mr-2">🔄</span>
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-pink-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-pink-600">
                  Score : {score}/{exercises.length}
                </div>
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
                {exercises[currentExercise]?.type === 'comparaison' ? (
                  <>
                    {/* EXERCICE DE COMPARAISON */}
                    <div className="rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 bg-blue-50">
                      <div className="space-y-2 sm:space-y-4">
                        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                          <div className="text-xl sm:text-4xl font-bold text-blue-600">
                            {exercises[currentExercise].numbers?.[0]}
                          </div>
                          <div className="text-xl sm:text-4xl font-bold text-gray-400">?</div>
                          <div className="text-xl sm:text-4xl font-bold text-blue-600">
                            {exercises[currentExercise].numbers?.[1]}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Zone de saisie pour comparaison */}
                    <div 
                      id="answer-choices"
                      className={`max-w-sm sm:max-w-lg mx-auto mb-4 sm:mb-8 transition-all duration-500 ${
                        highlightedElement === 'answer-choices' ? 'ring-8 ring-yellow-400 bg-yellow-50 rounded-lg p-4 scale-105 shadow-2xl animate-pulse' : ''
                      }`}
                    >
                      <div className="space-y-2 sm:space-y-4">
                        <p className="text-base sm:text-lg text-gray-600 font-semibold text-center">
                          Choisis le bon symbole
                        </p>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4">
                          {exercises[currentExercise].choices?.map((choice, index) => (
                            <button
                              key={index}
                              onClick={() => setUserAnswer(choice)}
                              disabled={isCorrect !== null}
                              className={`p-2 sm:p-4 rounded-lg font-bold text-sm sm:text-lg transition-all border-2 ${
                                userAnswer === choice
                                  ? 'bg-blue-500 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bouton Valider pour comparaison */}
                      <div className="flex justify-center mt-3 sm:mt-6">
                        <button
                          onClick={() => handleAnswerClick(userAnswer)}
                          disabled={isCorrect !== null || !userAnswer}
                          className="bg-green-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-sm sm:text-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* EXERCICE DE RANGEMENT */}
                <div className="rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 bg-purple-50">
                  <div className="space-y-2 sm:space-y-4">
                    <div className="text-xl sm:text-4xl font-bold text-purple-600">
                          {exercises[currentExercise].numbers?.join(' , ')}
                </div>
              </div>
            </div>

                    {/* Zone de saisie pour rangement */}
                <div 
                  id="answer-choices"
                  className={`max-w-sm sm:max-w-lg mx-auto mb-4 sm:mb-8 transition-all duration-500 ${
                    highlightedElement === 'answer-choices' ? 'ring-8 ring-yellow-400 bg-yellow-50 rounded-lg p-4 scale-105 shadow-2xl animate-pulse' : ''
                  }`}
                >
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
              
                      {/* Bouton Valider pour rangement */}
                  <div className="flex justify-center mt-3 sm:mt-6">
                  <button
                          onClick={() => handleAnswerClick(userAnswer)}
                      disabled={(() => {
                        if (isCorrect !== null) return true;
                        const parts = userAnswer.split(',');
                            return !parts[0]?.trim() || !parts[1]?.trim() || !parts[2]?.trim();
                      })()}
                      className="bg-green-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-bold text-sm sm:text-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Valider
                  </button>
                  </div>
              </div>
                  </>
                )}
              
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