'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

export default function OrdonnerComparerCE1() {
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
  const [highlightedElement, setHighlightedElement] = useState<string>('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingComparison, setAnimatingComparison] = useState(false);
  const [animatingRangement, setAnimatingRangement] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [highlightedSymbol, setHighlightedSymbol] = useState<string | null>(null);
  const [animatingExample, setAnimatingExample] = useState<number | null>(null);
  const [exampleStep, setExampleStep] = useState<string | null>(null);
  const [zoomingSymbolPart, setZoomingSymbolPart] = useState<{symbol: string, part: 'num1' | 'operator' | 'num2' | 'count1' | 'count2' | 'hundreds1' | 'hundreds2' | 'tens1' | 'tens2' | 'units1' | 'units2'} | null>(null);
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
  
  // États du simulateur - ADAPTÉS POUR CE1 (nombres jusqu'à 1000)
  const [simulatorNum1, setSimulatorNum1] = useState<number>(670);
  const [simulatorNum2, setSimulatorNum2] = useState<number>(230);
  const [simulatorActive, setSimulatorActive] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState(0);
  const [simulatorResult, setSimulatorResult] = useState<string>('');
  const [exerciseExplanationPlayed, setExerciseExplanationPlayed] = useState(false);

  // États pour le tutoriel interactif de Sam
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

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

  // Fonction pour démarrer la comparaison du simulateur - ADAPTÉE POUR CE1 (nombres jusqu'à 1000)
  const startSimulatorComparison = async () => {
    if (isPlayingVocal || !simulatorNum1 || !simulatorNum2 || simulatorNum1 < 1 || simulatorNum1 > 1000 || simulatorNum2 < 1 || simulatorNum2 > 1000) {
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
      await playAudio(`Salut ! Je vais t'expliquer comment comparer ${simulatorNum1} et ${simulatorNum2}. Suivons ma méthode étape par étape !`);
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
        await playAudio(`Parfait ! ${bigger} a plus de chiffres, donc ${bigger} est plus grand ! C'est fini !`);
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
        
        if (num1Digits === 3) {
          // Pour les nombres à 3 chiffres, comparer les centaines
          const hundreds1 = Math.floor(simulatorNum1 / 100);
          const hundreds2 = Math.floor(simulatorNum2 / 100);
          
          await playAudio(`Étape 2 : Je compare les centaines. ${simulatorNum1} a ${hundreds1} centaine${hundreds1 > 1 ? 's' : ''}, et ${simulatorNum2} a ${hundreds2} centaine${hundreds2 > 1 ? 's' : ''}.`);
          
          if (hundreds1 !== hundreds2) {
            const bigger = hundreds1 > hundreds2 ? simulatorNum1 : simulatorNum2;
            const biggerHundreds = hundreds1 > hundreds2 ? hundreds1 : hundreds2;
            await playAudio(`Excellent ! ${biggerHundreds} centaines, c'est plus que l'autre ! Donc ${bigger} est plus grand, tonnerre de Brest !`);
            // Passer directement au résultat final après comparaison des centaines
          } else {
            await playAudio(`Les centaines sont identiques ! Il faut comparer les dizaines. En route pour l'étape 3 !`);
            
            // Si mêmes centaines, passer à l'étape 3
            await new Promise(resolve => setTimeout(resolve, 500));
            setSimulatorStep(3);
            
            // Scroll vers l'étape 3 du simulateur
            await new Promise(resolve => setTimeout(resolve, 500));
            const step3Simulator = findSimulatorStepElement(3);
            if (step3Simulator) {
              step3Simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
              await new Promise(resolve => setTimeout(resolve, 800));
            }
            
            const tens1 = Math.floor((simulatorNum1 % 100) / 10);
            const tens2 = Math.floor((simulatorNum2 % 100) / 10);
            
            await playAudio(`Étape 3 : Je compare les dizaines. ${simulatorNum1} a ${tens1} dizaine${tens1 > 1 ? 's' : ''}, et ${simulatorNum2} a ${tens2} dizaine${tens2 > 1 ? 's' : ''}.`);
            
            if (tens1 !== tens2) {
              const bigger = tens1 > tens2 ? simulatorNum1 : simulatorNum2;
              const biggerTens = tens1 > tens2 ? tens1 : tens2;
              await playAudio(`Super ! ${biggerTens} dizaines, c'est plus que l'autre ! Donc ${bigger} est plus grand !`);
            } else {
              await playAudio(`Les dizaines sont identiques aussi ! Il faut comparer les unités. En route pour l'étape 4 !`);
              
              // Si mêmes dizaines, passer à l'étape 4
              await new Promise(resolve => setTimeout(resolve, 500));
              setSimulatorStep(4);
              
              // Scroll vers l'étape 4 du simulateur
              await new Promise(resolve => setTimeout(resolve, 500));
              const step4Simulator = findSimulatorStepElement(4);
              if (step4Simulator) {
                step4Simulator.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(resolve => setTimeout(resolve, 800));
              }
              
              const units1 = simulatorNum1 % 10;
              const units2 = simulatorNum2 % 10;
              
              await playAudio(`Étape 4 : Je compare les unités. ${simulatorNum1} a ${units1} unité${units1 > 1 ? 's' : ''}, et ${simulatorNum2} a ${units2} unité${units2 > 1 ? 's' : ''}.`);
              
              if (units1 > units2) {
                await playAudio(`${units1} unités, c'est plus que ${units2} ! Donc ${simulatorNum1} est plus grand !`);
              } else if (units1 < units2) {
                await playAudio(`${units2} unités, c'est plus que ${units1} ! Donc ${simulatorNum2} est plus grand !`);
              } else {
                await playAudio(`${units1} unités partout ! Les deux nombres sont exactement égaux, sacrebleu !`);
              }
            }
          }
        } else {
          // Pour les nombres à 2 chiffres, comparer les dizaines
          const tens1 = Math.floor(simulatorNum1 / 10);
          const tens2 = Math.floor(simulatorNum2 / 10);
          
          await playAudio(`Étape 2 : Je compare les dizaines. ${simulatorNum1} a ${tens1} dizaine${tens1 > 1 ? 's' : ''}, et ${simulatorNum2} a ${tens2} dizaine${tens2 > 1 ? 's' : ''}.`);
          
          if (tens1 !== tens2) {
            const bigger = tens1 > tens2 ? simulatorNum1 : simulatorNum2;
            const biggerTens = tens1 > tens2 ? tens1 : tens2;
            await playAudio(`Excellent ! ${biggerTens} dizaines, c'est plus que l'autre ! Donc ${bigger} est plus grand, tonnerre de Brest !`);
            // Passer directement au résultat final après comparaison des dizaines
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
      }
      
      // Résultat final
      await new Promise(resolve => setTimeout(resolve, 500));
      setSimulatorStep(5);
      
      // Scroll vers le résultat final
      await new Promise(resolve => setTimeout(resolve, 500));
      const finalResult = findSimulatorStepElement(5);
      if (finalResult) {
        finalResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const finalMessage = simulatorNum1 > simulatorNum2 ? 
        `Conclusion : ${simulatorNum1} est plus grand que ${simulatorNum2} !` :
        simulatorNum1 < simulatorNum2 ? 
        `Conclusion : ${simulatorNum1} est plus petit que ${simulatorNum2} !` :
        `Conclusion : ${simulatorNum1} et ${simulatorNum2} sont exactement égaux !`;
      
      await playAudio(`${finalMessage} Tu as bien suivi ma méthode, bravo ! Tu peux essayer avec d'autres nombres maintenant !`);
      
    } catch (error) {
      console.error('Erreur lors de l\'explication vocale:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions d'encouragement aléatoires pour chaque exercice
  const minecraftExpressions = [
    "Super génial", "Fantastique", "Excellent travail", "Parfait", "Bravo champion",
    "Incroyable", "Formidable", "Magnifique", "Extraordinaire", "Impressionnant"
  ];

  // Compliments aléatoires pour les bonnes réponses
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", 
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire"
  ];

  // Sauvegarder les progrès - ADAPTÉ POUR CE1
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ordonner',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce1-nombres-1000-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ordonner');
      
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

    localStorage.setItem('ce1-nombres-1000-progress', JSON.stringify(allProgress));
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
      4: 'orange-100',
      5: 'yellow-100'
    };
    
    const colorClass = colorMaps[stepNumber as keyof typeof colorMaps];
    return simulatorEl.querySelector(`[class*="${colorClass}"]`);
  };

  // Fonction pour Sam explique la méthode de comparaison progressive pour nombres jusqu'à 1000
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
      
      await playAudio("Salut les amis ! Je vais vous apprendre la méthode géniale pour comparer les nombres jusqu'à 1000 !");
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
      await playAudio("Regardez ! 670 a 3 chiffres, et 80 a seulement 2 chiffres !");
      await wait(1000);
      
      // Animation des chiffres
      setZoomingSymbolPart({ symbol: 'step1', part: 'count1' });
      await playAudio("670 : je compte 6, 7, 0... ça fait 3 chiffres !");
      await wait(1500);
      
      setZoomingSymbolPart({ symbol: 'step1', part: 'count2' });
      await playAudio("80 : je compte 8, 0... ça fait 2 chiffres seulement !");
      await wait(1500);
      
      setZoomingSymbolPart({ symbol: 'step1', part: 'operator' });
      await playAudio("Plus de chiffres veut dire plus grand ! Donc 670 est plus grand que 80 !");
      await wait(2000);
      
      setZoomingSymbolPart(null);
      setHighlightedSymbol(null);
      await wait(800);
      
      // ÉTAPE 2: Comparer les centaines (pour les nombres à 3 chiffres)
      await playAudio("Deuxième étape : si les nombres ont le même nombre de chiffres, je compare les centaines !");
      await wait(1000);
      
      // Scroll vers l'étape 2
      const step2Element = findStepElement('Étape 2');
      if (step2Element) {
        step2Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
      }
      
      setHighlightedSymbol('step2');
      await playAudio("Ici, 670 et 230 ont tous les deux 3 chiffres. Alors je regarde les centaines !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step2', part: 'hundreds1' });
      await playAudio("670 a 6 centaines !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step2', part: 'hundreds2' });
      await playAudio("230 a 2 centaines seulement !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step2', part: 'operator' });
      await playAudio("6 centaines, c'est plus que 2 centaines ! Donc 670 est plus grand que 230 !");
      await wait(2000);
      
      setZoomingSymbolPart(null);
      setHighlightedSymbol(null);
      await wait(800);
      
      // ÉTAPE 3: Comparer les dizaines
      await playAudio("Troisième étape : si les centaines sont pareilles, je compare les dizaines !");
      await wait(1000);
      
      // Scroll vers l'étape 3
      const step3Element = findStepElement('Étape 3');
      if (step3Element) {
        step3Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
      }
      
      setHighlightedSymbol('step3');
      await playAudio("Regardez ! 670 et 640 ont les mêmes centaines : 6. Alors je regarde les dizaines !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step3', part: 'tens1' });
      await playAudio("670 a 7 dizaines !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step3', part: 'tens2' });
      await playAudio("640 a 4 dizaines !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step3', part: 'operator' });
      await playAudio("7 dizaines, c'est plus que 4 dizaines ! Donc 670 est plus grand que 640 !");
      await wait(2000);
      
      setZoomingSymbolPart(null);
      setHighlightedSymbol(null);
      await wait(800);
      
      // ÉTAPE 4: Comparer les unités
      await playAudio("Quatrième étape : si les dizaines sont pareilles aussi, je compare les unités !");
      await wait(1000);
      
      // Scroll vers l'étape 4
      const step4Element = findStepElement('Étape 4');
      if (step4Element) {
        step4Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(1000);
      }
      
      setHighlightedSymbol('step4');
      await playAudio("Regardez ! 670 et 674 ont les mêmes centaines et dizaines. Alors je regarde les unités !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step4', part: 'units1' });
      await playAudio("670 a 0 unités !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step4', part: 'units2' });
      await playAudio("674 a 4 unités !");
      await wait(1000);
      
      setZoomingSymbolPart({ symbol: 'step4', part: 'operator' });
      await playAudio("4 unités, c'est plus que 0 unités ! Donc 674 est plus grand que 670 !");
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
      await playAudio("Un : je compte les chiffres ! Deux : je compare les centaines ! Trois : je compare les dizaines ! Quatre : je compare les unités !");
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
      
      await playAudio("Voilà ! Maintenant vous connaissez la méthode complète pour comparer tous les nombres jusqu'à 1000 !");
      await wait(2000); // Plus de temps pour la dernière phrase
      
    } catch (error) {
      console.error('Erreur dans samExplainsComparisons:', error);
    } finally {
    setIsPlayingVocal(false);
    setHighlightedElement('');
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

  // Fonction pour faire défiler vers un élément illuminé
  const scrollToHighlightedElement = (elementId: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center' 
        });
      }
    }, 200);
  };

  // Composant d'effet de particules brillantes
  const TutorialSparkles = ({ show }: { show: boolean }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-400 animate-bounce"
            style={{
              left: `${60 + (i * 8)}%`,
              top: `${20 + (i * 8)}%`,
              animationDelay: `${i * 0.3}s`,
              fontSize: '1.5rem'
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    );
  };

  // Fonction de tutoriel interactif pour les exercices
  const startExerciseTutorial = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setShowTutorial(true);
    setTutorialStep(0);
    setHighlightedElement('');
    
    try {
      // Étape 1: Saluer et présenter les exercices
      await playAudio("Salut ! Je vais t'expliquer comment utiliser les exercices. C'est parti !");
      if (stopSignalRef.current) return;
      
      await wait(800);
      
      // Étape 2: Expliquer l'indicateur d'exercice
      setTutorialStep(1);
      setHighlightedElement('exercise-header');
      scrollToHighlightedElement('exercise-header');
      await playAudio("Regarde ! Cette zone s'illumine ! Ici tu vois quel exercice tu es en train de faire. Par exemple : Exercice 1 sur 15 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      
      // Étape 3: Expliquer la barre de progression
      setTutorialStep(2);
      setHighlightedElement('progress-bar');
      scrollToHighlightedElement('progress-bar');
      await playAudio("Maintenant cette barre s'illumine ! Elle te montre ta progression. Plus tu avances, plus elle se remplit !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      
      // Étape 4: Expliquer le score
      setTutorialStep(3);
      setHighlightedElement('score-display');
      scrollToHighlightedElement('score-display');
      await playAudio("Tu vois comme ça brille ? Ton score s'affiche ici. Tu gagnes un point à chaque bonne réponse !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      
      // Étape 5: Expliquer la question
      setTutorialStep(4);
      setHighlightedElement('question-area');
      scrollToHighlightedElement('question-area');
      await playAudio("Regarde cette grande zone qui s'illumine ! Lis bien la question ici. Elle te dit ce que tu dois faire !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      
      // Étape 6: Expliquer les nombres à comparer
      setTutorialStep(5);
      setHighlightedElement('numbers-display');
      scrollToHighlightedElement('numbers-display');
      await playAudio("Ici c'est magique ! Cette zone brille pour te montrer les nombres à comparer. Regarde-les bien et applique ma méthode !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      
      // Étape 7: Expliquer les boutons de réponse
      setTutorialStep(6);
      setHighlightedElement('answer-choices');
      scrollToHighlightedElement('answer-choices');
      await playAudio("Waouh ! Ces boutons s'illuminent aussi ! Clique sur le bon bouton pour répondre : plus grand, plus petit, ou égal !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      
      // Étape 8: Expliquer le bouton suivant
      setTutorialStep(7);
      setHighlightedElement('next-button');
      scrollToHighlightedElement('next-button');
      await playAudio("Et voilà le bouton Suivant qui brille de mille feux ! Une fois que tu as répondu, clique dessus pour passer à l'exercice suivant !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      
      // Étape 9: Conclure
      setTutorialStep(8);
      setHighlightedElement('');
      await playAudio("Et voilà ! Tu sais maintenant comment utiliser les exercices. À toi de jouer !");
      
      await wait(1000);
      
    } catch (error) {
      console.error('Erreur lors du tutoriel:', error);
    } finally {
      setIsPlayingVocal(false);
      setShowTutorial(false);
      setTutorialStep(0);
      setHighlightedElement('');
      setPirateIntroStarted(true);
    }
  };

  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setHasStarted(true);
    setSamSizeExpanded(true);
    
    // 1. Sam présente le chapitre
    await playAudio("Salut ! Aujourd'hui je vais te présenter ce chapitre sur la comparaison des nombres jusqu'à 1000 !");
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
    setHighlightedElement('');
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
    setHighlightedElement('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await wait(1200);
    setHighlightedElement('exercises-tab');
    await playAudio("Une fois que tu es prêt, entraîne-toi avec les exercices pour gagner des points !");
      if (stopSignalRef.current) return;
      
    // 5. Conclusion
    await wait(1000);
    setHighlightedElement('');
      setSamSizeExpanded(false);
    await playAudio("Amuse-toi bien !");
    if (stopSignalRef.current) return;
    
    await wait(1000);
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
    setHighlightedElement('');
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
      // Expression d'encouragement personnalisée
          const minecraftExpression = minecraftExpressions[currentExercise] || "Super génial";
    await playAudio(minecraftExpression + " !");
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

  // Exemples de comparaisons - ADAPTÉS POUR CE1 (nombres jusqu'à 1000) - DIVERSITÉ AMÉLIORÉE
  const comparaisonExamples = [
    { num1: 347, num2: 785, symbol: '<' },
    { num1: 893, num2: 256, symbol: '>' },
    { num1: 564, num2: 564, symbol: '=' },
    { num1: 672, num2: 438, symbol: '>' },
    { num1: 289, num2: 851, symbol: '<' },
    { num1: 456, num2: 123, symbol: '>' },
    { num1: 678, num2: 789, symbol: '<' }
  ];

  // Exemples de rangements - ADAPTÉS POUR CE1 (nombres jusqu'à 1000) - DIVERSITÉ AMÉLIORÉE
  const rangementExamples = [
    { numbers: [347, 125, 673], ordered: [125, 347, 673] },
    { numbers: [896, 254, 567], ordered: [254, 567, 896] },
    { numbers: [738, 419, 952], ordered: [419, 738, 952] },
    { numbers: [234, 789, 456], ordered: [234, 456, 789] }
  ];

  // Fonction pour générer 15 exercices : 10 comparaisons puis 5 rangements - ADAPTÉS POUR CE1
  const generateRandomExercises = () => {
    // Exercices de comparaison (2 nombres) pour les questions 1 à 10 - ÉQUILIBRE OPTIMISÉ
    const comparisonExercises = [
      // Comparaisons faciles (différents nombres de chiffres ou centaines différentes)
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [673, 341], correctAnswer: '673 > 341', choices: ['673 > 341', '673 < 341', '673 = 341'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [258, 892], correctAnswer: '258 < 892', choices: ['258 > 892', '258 < 892', '258 = 892'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [784, 237], correctAnswer: '784 > 237', choices: ['784 > 237', '784 < 237', '784 = 237'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [325, 874], correctAnswer: '325 < 874', choices: ['325 > 874', '325 < 874', '325 = 874'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [943, 476], correctAnswer: '943 > 476', choices: ['943 > 476', '943 < 476', '943 = 476'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [139, 648], correctAnswer: '139 < 648', choices: ['139 > 648', '139 < 648', '139 = 648'] },
      
      // Comparaisons moyennes (mêmes centaines, dizaines différentes)
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [512, 487], correctAnswer: '512 > 487', choices: ['512 > 487', '512 < 487', '512 = 487'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [296, 731], correctAnswer: '296 < 731', choices: ['296 > 731', '296 < 731', '296 = 731'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [821, 156], correctAnswer: '821 > 156', choices: ['821 > 156', '821 < 156', '821 = 156'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [93, 467], correctAnswer: '93 < 467', choices: ['93 > 467', '93 < 467', '93 = 467'] },
      
      // Comparaisons difficiles (jusqu'aux unités) - 4 exercices comme demandé
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [463, 467], correctAnswer: '463 < 467', choices: ['463 > 467', '463 < 467', '463 = 467'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [758, 752], correctAnswer: '758 > 752', choices: ['758 > 752', '758 < 752', '758 = 752'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [685, 689], correctAnswer: '685 < 689', choices: ['685 > 689', '685 < 689', '685 = 689'] },
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [524, 521], correctAnswer: '524 > 521', choices: ['524 > 521', '524 < 521', '524 = 521'] },
      
      // Un seul exercice d'égalité (au lieu de 3)
      { type: 'comparaison', question: 'Compare ces deux nombres avec >, < ou =', numbers: [456, 456], correctAnswer: '456 = 456', choices: ['456 > 456', '456 < 456', '456 = 456'] }
    ];

    // Exercices de rangement (3 nombres) pour les questions 11 à 15 - AVEC COMPARAISONS FINES
    const rangementExercises = [
      // Rangements faciles (nombres bien différents)
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [453, 237, 786], correctAnswer: '237, 453, 786', choices: ['237, 453, 786', '786, 453, 237', '453, 237, 786'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [342, 675, 128], correctAnswer: '675, 342, 128', choices: ['128, 342, 675', '675, 342, 128', '342, 675, 128'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [97, 523, 378], correctAnswer: '97, 378, 523', choices: ['97, 378, 523', '523, 378, 97', '378, 523, 97'] },
      
      // Rangements avec comparaisons fines (jusqu'aux unités)
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [463, 467, 461], correctAnswer: '461, 463, 467', choices: ['461, 463, 467', '467, 463, 461', '463, 461, 467'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [582, 589, 585], correctAnswer: '589, 585, 582', choices: ['582, 585, 589', '589, 585, 582', '585, 589, 582'] },
      
      // Rangements moyens
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [185, 834, 426], correctAnswer: '185, 426, 834', choices: ['185, 426, 834', '834, 426, 185', '426, 185, 834'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [713, 289, 956], correctAnswer: '956, 713, 289', choices: ['289, 713, 956', '956, 713, 289', '713, 956, 289'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [567, 234, 891], correctAnswer: '234, 567, 891', choices: ['234, 567, 891', '891, 567, 234', '567, 234, 891'] },
      { type: 'rangement', question: 'Classe du plus grand au plus petit', numbers: [145, 789, 312], correctAnswer: '789, 312, 145', choices: ['145, 312, 789', '789, 312, 145', '312, 789, 145'] },
      { type: 'rangement', question: 'Classe du plus petit au plus grand', numbers: [624, 158, 973], correctAnswer: '158, 624, 973', choices: ['158, 624, 973', '973, 624, 158', '624, 158, 973'] }
    ];

    // Mélanger les exercices de chaque type
    const shuffledComparisons = [...comparisonExercises].sort(() => Math.random() - 0.5);
    const shuffledRangements = [...rangementExercises].sort(() => Math.random() - 0.5);

    // Prendre 10 comparaisons + 5 rangements = 15 exercices au total
    const finalExercises = [
      ...shuffledComparisons.slice(0, 10), // 10 premiers : comparaisons
      ...shuffledRangements.slice(0, 5)    // 5 suivants : rangements
    ];

    return finalExercises;
  };

  // Exercices générés aléatoirement à chaque session
  const [exercises] = useState(() => generateRandomExercises());

  // Fonction pour créer la représentation visuelle d'un nombre avec des cercles - ADAPTÉE POUR CE1
  const renderCircles = (num: number) => {
    if (num >= 100) {
      const centaines = Math.floor(num / 100);
      const dizaines = Math.floor((num % 100) / 10);
      const unites = num % 10;
      
                return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Centaines - groupes de 100 cercles verts dans des boîtes */}
          {Array.from({ length: centaines }, (_, c) => (
            <div key={`centaine-${c}`} className="flex flex-col items-center">
              <div className="grid grid-cols-10 gap-0.5 p-2 rounded-lg border-2 border-green-300 bg-green-50">
                {Array.from({ length: 100 }, (_, i) => (
                  <div
                    key={`c${c}-${i}`}
                    className="w-1 h-1 rounded-full bg-green-600"
                  />
                      ))}
                    </div>
              <div className="text-xs text-green-600 font-bold mt-1">1 centaine = 100</div>
                  </div>
          ))}
          
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
    } else if (num >= 10) {
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
      setHighlightedElement('');
      
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

  // JSX pour l'introduction du personnage Minecraft dans les exercices
  const SamPirateIntroJSX = () => (
    <div className="flex justify-center p-1 mt-2">
      <div className="flex items-center gap-2">
        {/* Image du personnage Minecraft */}
        <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 shadow-md transition-all duration-300 ${
          isPlayingVocal
            ? 'w-20 sm:w-32 h-20 sm:h-32 scale-110 sm:scale-150' // When speaking - agrandi mobile
            : pirateIntroStarted
              ? 'w-16 sm:w-16 h-16 sm:h-16' // After "COMMENCER" clicked (reduced) - agrandi mobile
              : 'w-16 sm:w-20 h-16 sm:h-20' // Initial - agrandi mobile
        }`}>
            <img 
              src="/image/Minecraftstyle.png" 
              alt="Personnage Minecraft" 
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
        onClick={hasStarted ? startExerciseTutorial : explainChapter}
        disabled={isPlayingVocal}
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
            : hasStarted
                              ? <>🎮 <span className="animate-bounce">Commencer</span> 💡</>
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
                src="/image/Minecraftstyle.png"
                alt="Personnage Minecraft"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Texte et icône */}
            <>
              <span className="text-xs sm:text-sm font-bold hidden sm:block">Stop</span>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
            </>
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 pb-8 sm:pb-8">
        {/* Header - ADAPTÉ POUR CE1 */}
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/chapitre/ce1-nombres-jusqu-1000" 
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
                Apprends à comparer et mettre les nombres dans l'ordre jusqu'à 1000 !
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
            {/* Image du personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-4 mb-6 sm:mb-8">
              {/* Image du personnage Minecraft */}
            <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                isPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                  : samSizeExpanded
                      ? 'w-12 sm:w-32 h-12 sm:h-32' // Enlarged - plus petit sur mobile
                      : 'w-12 sm:w-20 h-12 sm:h-20' // Initial - plus petit sur mobile
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

            {/* Les symboles - ADAPTÉS POUR CE1 */}
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
              
              {/* Animation progressive pour nombres jusqu'à 1000 - ADAPTÉE POUR CE1 */}
              <div className="space-y-6 sm:space-y-8">
                {/* Étape 1: Comparer le nombre de chiffres */}
                <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'step1' ? 'ring-4 ring-purple-400 bg-purple-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 sm:mb-4 text-center">
                    🔍 Étape 1 : Je compte les chiffres
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-4 sm:gap-8 mb-2 sm:mb-4">
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-purple-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'num1' ? 'animate-bounce scale-150 text-green-600' : ''
                      }`}>670</div>
                      <div className={`text-xs sm:text-sm text-purple-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'count1' ? 'animate-pulse text-green-600 scale-110' : ''
                      }`}>3 chiffres</div>
            </div>

                    <div className={`text-2xl sm:text-4xl font-bold text-purple-600 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'operator' ? 'animate-bounce scale-150 text-green-600' : ''
                    }`}>&gt;</div>
                    
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-purple-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'num2' ? 'animate-bounce scale-150 text-red-600' : ''
                      }`}>80</div>
                      <div className={`text-xs sm:text-sm text-purple-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step1' && zoomingSymbolPart?.part === 'count2' ? 'animate-pulse text-red-600 scale-110' : ''
                      }`}>2 chiffres</div>
              </div>
            </div>

                  <div className={`text-center text-sm sm:text-base text-purple-700 font-semibold ${
                    highlightedSymbol === 'step1' ? 'animate-pulse' : ''
                  }`}>
                    ✅ 670 a plus de chiffres → 670 est plus grand !
                </div>
                </div>

                {/* Étape 2: Si même nombre de chiffres, comparer les centaines */}
                <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'step2' ? 'ring-4 ring-blue-400 bg-blue-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 sm:mb-4 text-center">
                    🔍 Étape 2 : Même nombre de chiffres → Je compare les centaines
                </h3>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-4 sm:gap-8 mb-2 sm:mb-4">
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-blue-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'num1' ? 'animate-bounce scale-150' : ''
                      }`}>
                        <span className={`${
                          zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'hundreds1' ? 'bg-green-200 px-1 rounded text-green-800' : ''
                        }`}>6</span>70
                </div>
                      <div className={`text-xs sm:text-sm text-blue-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'hundreds1' ? 'animate-pulse text-green-600 scale-110' : ''
                      }`}>6 centaines</div>
                </div>
              
                    <div className={`text-2xl sm:text-4xl font-bold text-blue-600 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'operator' ? 'animate-bounce scale-150 text-green-600' : ''
                    }`}>&gt;</div>
                    
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-blue-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'num2' ? 'animate-bounce scale-150' : ''
                      }`}>
                      <span className={`${
                          zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'hundreds2' ? 'bg-red-200 px-1 rounded text-red-800' : ''
                        }`}>2</span>30
                      </div>
                      <div className={`text-xs sm:text-sm text-blue-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step2' && zoomingSymbolPart?.part === 'hundreds2' ? 'animate-pulse text-red-600 scale-110' : ''
                      }`}>2 centaines</div>
              </div>
            </div>

                  <div className={`text-center text-sm sm:text-base text-blue-700 font-semibold ${
                    highlightedSymbol === 'step2' ? 'animate-pulse' : ''
                  }`}>
                    ✅ 6 centaines &gt; 2 centaines → 670 est plus grand !
                  </div>
                    </div>
                    
                {/* Étape 3: Si mêmes centaines, comparer les dizaines */}
                <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'step3' ? 'ring-4 ring-green-400 bg-green-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 sm:mb-4 text-center">
                    🔍 Étape 3 : Mêmes centaines → Je compare les dizaines
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-4 sm:gap-8 mb-2 sm:mb-4">
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-green-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'num1' ? 'animate-bounce scale-150' : ''
                      }`}>
                        6<span className={`${
                          zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'tens1' ? 'bg-green-200 px-1 rounded text-green-800' : ''
                        }`}>7</span>0
                    </div>
                      <div className={`text-xs sm:text-sm text-green-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'tens1' ? 'animate-pulse text-green-600 scale-110' : ''
                      }`}>7 dizaines</div>
                  </div>

                    <div className={`text-2xl sm:text-4xl font-bold text-green-600 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'operator' ? 'animate-bounce scale-150 text-green-600' : ''
                    }`}>&gt;</div>
                    
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-green-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'num2' ? 'animate-bounce scale-150' : ''
                      }`}>
                        6<span className={`${
                          zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'tens2' ? 'bg-red-200 px-1 rounded text-red-800' : ''
                        }`}>4</span>0
                </div>
                      <div className={`text-xs sm:text-sm text-green-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step3' && zoomingSymbolPart?.part === 'tens2' ? 'animate-pulse text-red-600 scale-110' : ''
                      }`}>4 dizaines</div>
                      </div>
                    </div>

                  <div className={`text-center text-sm sm:text-base text-green-700 font-semibold ${
                    highlightedSymbol === 'step3' ? 'animate-pulse' : ''
                  }`}>
                    ✅ 7 dizaines &gt; 4 dizaines → 670 est plus grand !
                  </div>
                </div>

                {/* Étape 4: Si mêmes dizaines, comparer les unités */}
                <div className={`bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'step4' ? 'ring-4 ring-orange-400 bg-orange-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 sm:mb-4 text-center">
                    🔍 Étape 4 : Mêmes dizaines → Je compare les unités
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 sm:gap-4 sm:gap-8 mb-2 sm:mb-4">
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-orange-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step4' && zoomingSymbolPart?.part === 'num1' ? 'animate-bounce scale-150' : ''
                      }`}>
                        67<span className={`${
                          zoomingSymbolPart?.symbol === 'step4' && zoomingSymbolPart?.part === 'units1' ? 'bg-green-200 px-1 rounded text-green-800' : ''
                        }`}>0</span>
                    </div>
                      <div className={`text-xs sm:text-sm text-orange-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step4' && zoomingSymbolPart?.part === 'units1' ? 'animate-pulse text-green-600 scale-110' : ''
                      }`}>0 unités</div>
                  </div>

                    <div className={`text-2xl sm:text-4xl font-bold text-orange-600 transition-all duration-500 ${
                      zoomingSymbolPart?.symbol === 'step4' && zoomingSymbolPart?.part === 'operator' ? 'animate-bounce scale-150 text-green-600' : ''
                    }`}>&lt;</div>
                    
                    <div className="text-center">
                      <div className={`text-2xl sm:text-4xl font-bold text-orange-800 transition-all duration-500 ${
                        zoomingSymbolPart?.symbol === 'step4' && zoomingSymbolPart?.part === 'num2' ? 'animate-bounce scale-150' : ''
                      }`}>
                        67<span className={`${
                          zoomingSymbolPart?.symbol === 'step4' && zoomingSymbolPart?.part === 'units2' ? 'bg-red-200 px-1 rounded text-red-800' : ''
                        }`}>4</span>
                </div>
                      <div className={`text-xs sm:text-sm text-orange-600 font-bold ${
                        zoomingSymbolPart?.symbol === 'step4' && zoomingSymbolPart?.part === 'units2' ? 'animate-pulse text-red-600 scale-110' : ''
                      }`}>4 unités</div>
              </div>
            </div>

                  <div className={`text-center text-sm sm:text-base text-orange-700 font-semibold ${
                    highlightedSymbol === 'step4' ? 'animate-pulse' : ''
                  }`}>
                    ✅ 4 unités &gt; 0 unités → 674 est plus grand !
            </div>
          </div>

                {/* Résumé de la méthode - ADAPTÉ POUR CE1 */}
                <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-5 sm:p-6 transition-all duration-1000 ${
                  highlightedSymbol === 'summary' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105 shadow-2xl' : ''
                }`}>
                  <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 sm:mb-4 text-center">
                    📋 Ma méthode pour comparer les nombres jusqu'à 1000
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
                      <span>Si même nombre de chiffres → Je compare les centaines</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      highlightedSymbol === 'summary' ? 'animate-pulse' : ''
                    }`}>
                      <span className="font-bold text-orange-800">3️⃣</span>
                      <span>Si mêmes centaines → Je compare les dizaines</span>
                    </div>
                    <div className={`flex items-center gap-2 ${
                      highlightedSymbol === 'summary' ? 'animate-pulse' : ''
                    }`}>
                      <span className="font-bold text-orange-800">4️⃣</span>
                      <span>Si mêmes dizaines → Je compare les unités</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simulateur interactif - ADAPTÉ POUR CE1 */}
              <div id="simulator" className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 sm:p-6 mt-8 border-2 border-indigo-200">
                <div className="text-center mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-2">
                    🎮 Simulateur : Teste avec tes nombres !
                  </h3>
                  <p className="text-base sm:text-base text-indigo-600">
                    Entre deux nombres jusqu'à 1000 et regarde l'animation de comparaison étape par étape
                  </p>
                </div>
                
                {/* Saisie des nombres */}
                <div className="bg-white rounded-lg p-6 sm:p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="text-center">
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        Premier nombre (1-1000)
                      </label>
                      <input
                        id="simulator-input-1"
                        type="number"
                        min="1"
                        max="1000"
                        value={simulatorNum1}
                        onChange={(e) => setSimulatorNum1(Number(e.target.value))}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:outline-none transition-all duration-300 ${
                          highlightedElement === 'simulator-inputs' 
                            ? 'border-yellow-400 ring-4 ring-yellow-300 bg-yellow-50 shadow-xl scale-105' 
                            : 'border-indigo-200'
                        }`}
                        placeholder="Ex: 670"
                        disabled={isPlayingVocal}
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">VS</div>
                    <button
                        id="compare-button"
                        onClick={startSimulatorComparison}
                        disabled={isPlayingVocal || !simulatorNum1 || !simulatorNum2 || simulatorNum1 < 1 || simulatorNum1 > 1000 || simulatorNum2 < 1 || simulatorNum2 > 1000}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                          isPlayingVocal || !simulatorNum1 || !simulatorNum2 || simulatorNum1 < 1 || simulatorNum1 > 1000 || simulatorNum2 < 1 || simulatorNum2 > 1000
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
                      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                        Deuxième nombre (1-1000)
                      </label>
                      <input
                        id="simulator-input-2"
                        type="number"
                        min="1"
                        max="1000"
                        value={simulatorNum2}
                        onChange={(e) => setSimulatorNum2(Number(e.target.value))}
                        className={`w-full px-3 py-2 border-2 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:outline-none transition-all duration-300 ${
                          highlightedElement === 'simulator-inputs' 
                            ? 'border-yellow-400 ring-4 ring-yellow-300 bg-yellow-50 shadow-xl scale-105' 
                            : 'border-indigo-200'
                        }`}
                        placeholder="Ex: 230"
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
                        <h4 className="text-base sm:text-xl font-bold text-indigo-800 mb-2 sm:mb-4">
                          🔍 Comparaison en cours : {simulatorNum1} ? {simulatorNum2}
                        </h4>
              </div>
              
                      {/* Simulation des étapes adaptées pour CE1 */}
                      <div className="space-y-2 sm:space-y-4">
                        {/* Étape 1 */}
                        <div className={`p-3 sm:p-4 rounded-lg transition-all duration-1000 ${
                          simulatorStep >= 1 ? 'bg-purple-100 ring-2 ring-purple-400' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-center gap-4 sm:gap-8">
              <div className="text-center">
                              <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 1 ? 'text-purple-800 animate-bounce' : 'text-gray-500'
                              }`}>{simulatorNum1}</div>
                              <div className={`text-xs sm:text-xs sm:text-sm font-bold ${
                                simulatorStep >= 1 ? 'text-purple-600' : 'text-gray-400'
                              }`}>
                                {simulatorNum1.toString().length} chiffre{simulatorNum1.toString().length > 1 ? 's' : ''}
                </div>
              </div>
                            
                            <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                              simulatorStep >= 1 ? 'text-purple-600' : 'text-gray-400'
                            }`}>
                              {simulatorResult && simulatorStep >= 1 ? simulatorResult : '?'}
            </div>

                            <div className="text-center">
                              <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 1 ? 'text-purple-800 animate-bounce' : 'text-gray-500'
                              }`}>{simulatorNum2}</div>
                              <div className={`text-xs sm:text-xs sm:text-sm font-bold ${
                                simulatorStep >= 1 ? 'text-purple-600' : 'text-gray-400'
                              }`}>
                                {simulatorNum2.toString().length} chiffre{simulatorNum2.toString().length > 1 ? 's' : ''}
                        </div>
                    </div>
                  </div>
                  
                          {simulatorStep >= 1 && (
                            <div className="text-center mt-2 sm:mt-2 sm:mt-3">
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
                        
                        {/* Étape 2 - Comparaison des centaines ou dizaines selon le nombre de chiffres */}
                        {simulatorNum1.toString().length === simulatorNum2.toString().length && (
                          <div className={`p-3 sm:p-4 rounded-lg transition-all duration-1000 ${
                            simulatorStep >= 2 ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-center gap-4 sm:gap-8">
                              <div className="text-center">
                                <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 2 ? 'text-blue-800' : 'text-gray-500'
                                }`}>
                                  {simulatorNum1.toString().length === 3 ? (
                                    <>
                                      <span className={`${
                                        simulatorStep >= 2 ? 'bg-green-200 px-1 rounded' : ''
                                      }`}>
                                        {Math.floor(simulatorNum1 / 100)}
                                      </span>
                                      {Math.floor((simulatorNum1 % 100) / 10)}{simulatorNum1 % 10}
                                    </>
                                  ) : (
                                    <>
                                      <span className={`${
                                        simulatorStep >= 2 ? 'bg-green-200 px-1 rounded' : ''
                                      }`}>
                                        {Math.floor(simulatorNum1 / 10)}
                                      </span>
                                      {simulatorNum1 % 10}
                                    </>
                                  )}
                                </div>
                                <div className={`text-xs sm:text-sm font-bold ${
                                  simulatorStep >= 2 ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum1.toString().length === 3 
                                    ? `${Math.floor(simulatorNum1 / 100)} centaine${Math.floor(simulatorNum1 / 100) > 1 ? 's' : ''}`
                                    : `${Math.floor(simulatorNum1 / 10)} dizaine${Math.floor(simulatorNum1 / 10) > 1 ? 's' : ''}`
                                  }
                                </div>
                              </div>
                              
                              <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 2 ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                {simulatorResult && simulatorStep >= 2 ? simulatorResult : '?'}
                    </div>
                              
                              <div className="text-center">
                                <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 2 ? 'text-blue-800' : 'text-gray-500'
                                }`}>
                                  {simulatorNum2.toString().length === 3 ? (
                                    <>
                                      <span className={`${
                                        simulatorStep >= 2 ? 'bg-red-200 px-1 rounded' : ''
                                      }`}>
                                        {Math.floor(simulatorNum2 / 100)}
                                      </span>
                                      {Math.floor((simulatorNum2 % 100) / 10)}{simulatorNum2 % 10}
                                    </>
                                  ) : (
                                    <>
                                      <span className={`${
                                        simulatorStep >= 2 ? 'bg-red-200 px-1 rounded' : ''
                                      }`}>
                                        {Math.floor(simulatorNum2 / 10)}
                                      </span>
                                      {simulatorNum2 % 10}
                                    </>
                                  )}
                                </div>
                                <div className={`text-xs sm:text-sm font-bold ${
                                  simulatorStep >= 2 ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum2.toString().length === 3 
                                    ? `${Math.floor(simulatorNum2 / 100)} centaine${Math.floor(simulatorNum2 / 100) > 1 ? 's' : ''}`
                                    : `${Math.floor(simulatorNum2 / 10)} dizaine${Math.floor(simulatorNum2 / 10) > 1 ? 's' : ''}`
                                  }
                                </div>
                              </div>
                  </div>
                  
                            {simulatorStep >= 2 && (
                              <div className="text-center mt-2 sm:mt-3">
                                <div className="text-blue-700 font-semibold">
                                  {simulatorNum1.toString().length === 3 ? (
                                    Math.floor(simulatorNum1 / 100) !== Math.floor(simulatorNum2 / 100)
                                      ? `✅ ${Math.floor(simulatorNum1 / 100)} > ${Math.floor(simulatorNum2 / 100)} centaines, donc ${simulatorNum1} > ${simulatorNum2} !`
                                      : Math.floor(simulatorNum1 / 100) < Math.floor(simulatorNum2 / 100)
                                        ? `✅ ${Math.floor(simulatorNum1 / 100)} < ${Math.floor(simulatorNum2 / 100)} centaines, donc ${simulatorNum1} < ${simulatorNum2} !`
                                        : "🔄 Mêmes centaines, on passe à l'étape 3"
                                  ) : (
                                    Math.floor(simulatorNum1 / 10) !== Math.floor(simulatorNum2 / 10)
                                      ? Math.floor(simulatorNum1 / 10) > Math.floor(simulatorNum2 / 10)
                                        ? `✅ ${Math.floor(simulatorNum1 / 10)} > ${Math.floor(simulatorNum2 / 10)} dizaines, donc ${simulatorNum1} > ${simulatorNum2} !`
                                        : `✅ ${Math.floor(simulatorNum1 / 10)} < ${Math.floor(simulatorNum2 / 10)} dizaines, donc ${simulatorNum1} < ${simulatorNum2} !`
                                      : "🔄 Mêmes dizaines, on passe à l'étape 3"
                                  )}
                  </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Étape 3 - Comparaison des dizaines (pour nombres à 3 chiffres) ou unités (pour nombres à 2 chiffres) */}
                        {simulatorNum1.toString().length === simulatorNum2.toString().length && 
                         ((simulatorNum1.toString().length === 3 && Math.floor(simulatorNum1 / 100) === Math.floor(simulatorNum2 / 100)) ||
                          (simulatorNum1.toString().length === 2 && Math.floor(simulatorNum1 / 10) === Math.floor(simulatorNum2 / 10))) && (
                          <div className={`p-3 sm:p-4 rounded-lg transition-all duration-1000 ${
                            simulatorStep >= 3 ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-center gap-4 sm:gap-8">
                              <div className="text-center">
                                <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 3 ? 'text-green-800' : 'text-gray-500'
                                }`}>
                                  {simulatorNum1.toString().length === 3 ? (
                                    <>
                                      {Math.floor(simulatorNum1 / 100)}
                                      <span className={`${
                                        simulatorStep >= 3 ? 'bg-green-200 px-1 rounded' : ''
                                      }`}>
                                        {Math.floor((simulatorNum1 % 100) / 10)}
                                      </span>
                                      {simulatorNum1 % 10}
                                    </>
                                  ) : (
                                    <>
                                      {Math.floor(simulatorNum1 / 10)}
                                      <span className={`${
                                        simulatorStep >= 3 ? 'bg-green-200 px-1 rounded' : ''
                                      }`}>
                                        {simulatorNum1 % 10}
                                      </span>
                </>
              )}
                                </div>
                                <div className={`text-xs sm:text-sm font-bold ${
                                  simulatorStep >= 3 ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum1.toString().length === 3 
                                    ? `${Math.floor((simulatorNum1 % 100) / 10)} dizaine${Math.floor((simulatorNum1 % 100) / 10) > 1 ? 's' : ''}`
                                    : `${simulatorNum1 % 10} unité${simulatorNum1 % 10 > 1 ? 's' : ''}`
                                  }
                                </div>
                              </div>
                              
                              <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 3 ? 'text-green-600' : 'text-gray-400'
                              }`}>
                                {simulatorResult && simulatorStep >= 3 ? simulatorResult : '?'}
                              </div>
                              
                              <div className="text-center">
                                <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 3 ? 'text-green-800' : 'text-gray-500'
                                }`}>
                                  {simulatorNum2.toString().length === 3 ? (
                                    <>
                                      {Math.floor(simulatorNum2 / 100)}
                                      <span className={`${
                                        simulatorStep >= 3 ? 'bg-red-200 px-1 rounded' : ''
                                      }`}>
                                        {Math.floor((simulatorNum2 % 100) / 10)}
                                      </span>
                                      {simulatorNum2 % 10}
                                    </>
                                  ) : (
                                    <>
                                      {Math.floor(simulatorNum2 / 10)}
                                      <span className={`${
                                        simulatorStep >= 3 ? 'bg-red-200 px-1 rounded' : ''
                                      }`}>
                                        {simulatorNum2 % 10}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className={`text-xs sm:text-sm font-bold ${
                                  simulatorStep >= 3 ? 'text-green-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum2.toString().length === 3 
                                    ? `${Math.floor((simulatorNum2 % 100) / 10)} dizaine${Math.floor((simulatorNum2 % 100) / 10) > 1 ? 's' : ''}`
                                    : `${simulatorNum2 % 10} unité${simulatorNum2 % 10 > 1 ? 's' : ''}`
                                  }
                                </div>
                              </div>
                            </div>

                            {simulatorStep >= 3 && (
                              <div className="text-center mt-2 sm:mt-3">
                                <div className="text-green-700 font-semibold">
                                  {simulatorNum1.toString().length === 3 ? (
                                    Math.floor((simulatorNum1 % 100) / 10) !== Math.floor((simulatorNum2 % 100) / 10)
                                      ? Math.floor((simulatorNum1 % 100) / 10) > Math.floor((simulatorNum2 % 100) / 10)
                                        ? `✅ ${Math.floor((simulatorNum1 % 100) / 10)} > ${Math.floor((simulatorNum2 % 100) / 10)} dizaines, donc ${simulatorNum1} > ${simulatorNum2} !`
                                        : `✅ ${Math.floor((simulatorNum1 % 100) / 10)} < ${Math.floor((simulatorNum2 % 100) / 10)} dizaines, donc ${simulatorNum1} < ${simulatorNum2} !`
                                      : "🔄 Mêmes dizaines, on passe à l'étape 4"
                                  ) : (
                                    (simulatorNum1 % 10) !== (simulatorNum2 % 10)
                                      ? (simulatorNum1 % 10) > (simulatorNum2 % 10)
                                        ? `✅ ${simulatorNum1 % 10} > ${simulatorNum2 % 10} unités, donc ${simulatorNum1} > ${simulatorNum2} !`
                                        : `✅ ${simulatorNum1 % 10} < ${simulatorNum2 % 10} unités, donc ${simulatorNum1} < ${simulatorNum2} !`
                                      : "🟰 Les nombres sont exactement égaux !"
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Étape 4 - Comparaison des unités (seulement pour nombres à 3 chiffres quand centaines et dizaines sont égales) */}
                        {simulatorNum1.toString().length === 3 && simulatorNum2.toString().length === 3 && 
                         Math.floor(simulatorNum1 / 100) === Math.floor(simulatorNum2 / 100) &&
                         Math.floor((simulatorNum1 % 100) / 10) === Math.floor((simulatorNum2 % 100) / 10) && (
                          <div className={`p-3 sm:p-4 rounded-lg transition-all duration-1000 ${
                            simulatorStep >= 4 ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-center gap-4 sm:gap-8">
                              <div className="text-center">
                                <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 4 ? 'text-orange-800' : 'text-gray-500'
                                }`}>
                                  {Math.floor(simulatorNum1 / 100)}{Math.floor((simulatorNum1 % 100) / 10)}
                                  <span className={`${
                                    simulatorStep >= 4 ? 'bg-orange-200 px-1 rounded' : ''
                                  }`}>
                                    {simulatorNum1 % 10}
                                  </span>
                      </div>
                                <div className={`text-xs sm:text-sm font-bold ${
                                  simulatorStep >= 4 ? 'text-orange-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum1 % 10} unité{simulatorNum1 % 10 > 1 ? 's' : ''}
                                </div>
                  </div>
                  
                              <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                simulatorStep >= 4 ? 'text-orange-600' : 'text-gray-400'
                              }`}>
                                {simulatorResult && simulatorStep >= 4 ? simulatorResult : '?'}
                              </div>
                              
                    <div className="text-center">
                                <div className={`text-xl sm:text-3xl font-bold transition-all duration-500 ${
                                  simulatorStep >= 4 ? 'text-orange-800' : 'text-gray-500'
                                }`}>
                                  {Math.floor(simulatorNum2 / 100)}{Math.floor((simulatorNum2 % 100) / 10)}
                                  <span className={`${
                                    simulatorStep >= 4 ? 'bg-red-200 px-1 rounded' : ''
                                  }`}>
                                    {simulatorNum2 % 10}
                                  </span>
                    </div>
                                <div className={`text-xs sm:text-sm font-bold ${
                                  simulatorStep >= 4 ? 'text-orange-600' : 'text-gray-400'
                                }`}>
                                  {simulatorNum2 % 10} unité{simulatorNum2 % 10 > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>

                            {simulatorStep >= 4 && (
                              <div className="text-center mt-2 sm:mt-3">
                                <div className="text-orange-700 font-semibold">
                                  {(simulatorNum1 % 10) !== (simulatorNum2 % 10)
                                    ? (simulatorNum1 % 10) > (simulatorNum2 % 10)
                                      ? `✅ ${simulatorNum1 % 10} > ${simulatorNum2 % 10} unités, donc ${simulatorNum1} > ${simulatorNum2} !`
                                      : `✅ ${simulatorNum1 % 10} < ${simulatorNum2 % 10} unités, donc ${simulatorNum1} < ${simulatorNum2} !`
                                    : "🟰 Les nombres sont exactement égaux !"
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Résultat final */}
                        {simulatorStep >= 5 && (
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
          </div>
        ) : (
          /* EXERCICES - FLOW NORMAL */
          <div className="space-y-4 sm:space-y-8">
            {/* Introduction du personnage Minecraft - toujours visible */}
            {SamPirateIntroJSX()}

            {/* Indicateur de progression mobile - sticky en haut */}
            <div className="block md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3">
              <div className="text-center mb-2">
                <div id="exercise-header-mobile" className={`text-xs sm:text-sm font-bold text-gray-700 mb-1 transition-all duration-700 ${
                  highlightedElement === 'exercise-header' 
                    ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 ring-4 ring-yellow-400 ring-opacity-60 rounded-lg px-2 py-1 animate-pulse scale-110 shadow-xl text-black relative z-50' 
                    : ''
                }`}>
                  Exercice {currentExercise + 1} sur {exercises.length}
                    </div>
                <div id="score-display-mobile" className={`text-xs sm:text-sm font-bold text-pink-600 mb-2 transition-all duration-700 ${
                  highlightedElement === 'score-display' 
                    ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-300 ring-4 ring-yellow-400 ring-opacity-60 rounded-lg px-2 py-1 animate-bounce scale-110 shadow-xl relative z-50' 
                    : ''
                }`}>
                  Score : {score}/{exercises.length}
                </div>
              </div>
              <div id="progress-bar-mobile" className={`w-full bg-gray-200 rounded-full h-2 transition-all duration-700 ${
                highlightedElement === 'progress-bar' 
                  ? 'ring-4 ring-yellow-400 ring-opacity-70 bg-gradient-to-r from-yellow-200 to-yellow-300 scale-105 shadow-xl animate-pulse relative z-50' 
                  : ''
              }`}>
                <div 
                  className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
                    </div>
                  </div>
                  
            {/* Header exercices desktop */}
            <div className="hidden md:block bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
                <h2 id="exercise-header" className={`text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left transition-all duration-700 ${
                  highlightedElement === 'exercise-header' 
                    ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 ring-8 ring-yellow-400 ring-opacity-60 rounded-xl px-4 py-3 animate-pulse scale-125 shadow-2xl text-black transform rotate-1 z-50 relative' 
                    : ''
                }`}>
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
              <div id="progress-bar" className={`w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3 transition-all duration-700 ${
                highlightedElement === 'progress-bar' 
                  ? 'ring-8 ring-yellow-400 ring-opacity-70 bg-gradient-to-r from-yellow-200 to-yellow-300 scale-110 shadow-2xl transform -rotate-1 animate-pulse relative z-50' 
                  : ''
              }`}>
                <div 
                  className="bg-pink-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
                  </div>
                  
              {/* Score */}
                    <div id="score-display" className={`text-center transition-all duration-700 ${
                      highlightedElement === 'score-display' 
                        ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-300 ring-8 ring-yellow-400 ring-opacity-60 rounded-xl px-5 py-3 animate-bounce scale-125 shadow-2xl transform rotate-2 relative z-50' 
                        : ''
                    }`}>
                <div className="text-lg sm:text-xl font-bold text-pink-600">
                  Score : {score}/{exercises.length}
                    </div>
                    </div>
                  </div>
              
            {/* Question - NORMAL FLOW */}
            <div id="question-area" className={`bg-white rounded-xl shadow-lg text-center p-4 sm:p-6 md:p-8 mt-4 sm:mt-8 transition-all duration-700 ${
              highlightedElement === 'question-area' 
                ? 'ring-8 ring-yellow-400 ring-opacity-70 bg-gradient-to-br from-yellow-50 via-yellow-100 to-orange-50 scale-110 shadow-2xl transform -rotate-1 animate-pulse relative z-50' 
                : ''
            }`}>
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
                    <div id="numbers-display" className={`rounded-lg p-3 sm:p-6 mb-4 sm:mb-8 bg-blue-50 transition-all duration-700 ${
                      highlightedElement === 'numbers-display' 
                        ? 'ring-8 ring-yellow-400 ring-opacity-70 bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-100 scale-115 shadow-2xl transform rotate-1 animate-pulse relative z-50' 
                        : ''
                    }`}>
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
                      className={`max-w-sm sm:max-w-lg mx-auto mb-4 sm:mb-8 transition-all duration-700 ${
                        highlightedElement === 'answer-choices' ? 'ring-8 ring-yellow-400 ring-opacity-70 bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-100 rounded-xl p-5 scale-115 shadow-2xl animate-bounce transform -rotate-1 relative z-50' : ''
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
                      <div className="flex justify-center mt-2 sm:mt-3 sm:mt-6">
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
                        className="w-16 sm:w-24 h-10 sm:h-16 text-center text-base sm:text-2xl font-bold border-2 sm:border-4 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:outline-none disabled:opacity-50"
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
                        className="w-16 sm:w-24 h-10 sm:h-16 text-center text-base sm:text-2xl font-bold border-2 sm:border-4 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:outline-none disabled:opacity-50"
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
                        className="w-16 sm:w-24 h-10 sm:h-16 text-center text-base sm:text-2xl font-bold border-2 sm:border-4 border-gray-300 rounded-lg sm:rounded-xl focus:border-pink-500 focus:outline-none disabled:opacity-50"
                      />
                  </div>
              </div>
              
                      {/* Bouton Valider pour rangement */}
                  <div className="flex justify-center mt-2 sm:mt-3 sm:mt-6">
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
                    id="next-button"
                    onClick={nextExercise}
                    className={`bg-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[50px] sm:min-h-auto transition-all duration-700 ${
                      highlightedElement === 'next-button' 
                        ? 'ring-8 ring-yellow-400 ring-opacity-70 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-black scale-125 animate-bounce shadow-2xl transform rotate-2 relative z-50' 
                        : ''
                    }`}
                  >
                    Suivant
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

        {/* Effet de particules brillantes pendant le tutoriel */}
        <TutorialSparkles show={showTutorial && highlightedElement !== ''} />
      </div>
    </div>
  );
} 