'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Book, Target, CheckCircle, XCircle, Trophy, Star, Minus, ChevronDown } from 'lucide-react';

export default function SoustractionsJusqu10() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [currentCountingNumber, setCurrentCountingNumber] = useState<number | null>(null);
  const [highlightedMethod, setHighlightedMethod] = useState<string | null>(null);
  const [removedObjectsCount, setRemovedObjectsCount] = useState<number>(0);
  const [imageError, setImageError] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  const [exercisesImageError, setExercisesImageError] = useState(false);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(new Set<number>());
  const [finalScore, setFinalScore] = useState(0);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des exemples de soustraction avec animations
  const subtractionExamples = [
    {
      id: 'counting',
      title: 'Compter à rebours',
      operation: '8 - 3',
      start: 8,
      remove: 3,
      result: 5,
      strategy: 'counting',
      explanation: 'On part de 8 et on compte 3 en arrière : 7, 6, 5 !',
      item: '🔢',
      color: 'text-blue-500'
    },
    {
      id: 'visual',
      title: 'Avec des objets',
      operation: '7 - 4',
      start: 7,
      remove: 4,
      result: 3,
      strategy: 'visual',
      explanation: 'On a 7 étoiles, on en enlève 4, il en reste 3 !',
      item: '⭐',
      color: 'text-yellow-500'
    },
    {
      id: 'fingers',
      title: 'Fait avec tes doigts',
      operation: '10 - 6',
      start: 10,
      remove: 6,
      result: 4,
      strategy: 'fingers',
      explanation: 'Lève 10 doigts, baisse-en 6, compte ceux qui restent : 4 !',
      item: '🖐️',
      color: 'text-purple-500'
    }
  ];

  // Exercices pour les élèves
  const exercises = [
    {
      operation: '5 - 2',
      answer: 3,
      visual: '🍎',
      question: 'Calcule : 5 - 2'
    },
    {
      operation: '9 - 4',
      answer: 5,
      visual: '🚗',
      question: 'Calcule : 9 - 4'
    },
    {
      operation: '7 - 3',
      answer: 4,
      visual: '🎈',
      question: 'Calcule : 7 - 3'
    },
    {
      operation: '10 - 7',
      answer: 3,
      visual: '⚽',
      question: 'Calcule : 10 - 7'
    },
    {
      operation: '6 - 5',
      answer: 1,
      visual: '🌺',
      question: 'Calcule : 6 - 5'
    },
    {
      operation: '8 - 6',
      answer: 2,
      visual: '🍬',
      question: 'Calcule : 8 - 6'
    },
    {
      operation: '10 - 3',
      answer: 7,
      visual: '🐦',
      question: 'Calcule : 10 - 3'
    },
    {
      operation: '4 - 1',
      answer: 3,
      visual: '📚',
      question: 'Calcule : 4 - 1'
    },
    {
      operation: '9 - 6',
      answer: 3,
      visual: '🎯',
      question: 'Calcule : 9 - 6'
    },
    {
      operation: '8 - 3',
      answer: 5,
      visual: '🌟',
      question: 'Calcule : 8 - 3'
    },
    {
      operation: '10 - 4',
      answer: 6,
      visual: '🎪',
      question: 'Calcule : 10 - 4'
    },
    {
      operation: '7 - 5',
      answer: 2,
      visual: '🎨',
      question: 'Calcule : 7 - 5'
    }
  ];

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
    setExercisesIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setCurrentCountingNumber(null);
    setCurrentStep(null);
    setHighlightedMethod(null);
    setRemovedObjectsCount(0);
    setImageError(false);
    setExercisesImageError(false);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode: boolean | 'slow' = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode === 'slow' ? 0.5 : slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Sélectionner la MEILLEURE voix française féminine disponible
      const voices = speechSynthesis.getVoices();
      console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
      
      // Priorité aux voix FÉMININES françaises de qualité
      const bestFrenchVoice = voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        (voice.name.toLowerCase().includes('audrey') ||    
         voice.name.toLowerCase().includes('marie') ||     
         voice.name.toLowerCase().includes('amélie') ||    
         voice.name.toLowerCase().includes('virginie') ||  
         voice.name.toLowerCase().includes('julie') ||     
         voice.name.toLowerCase().includes('celine') ||    
         voice.name.toLowerCase().includes('léa') ||       
         voice.name.toLowerCase().includes('charlotte'))   
      ) || voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        voice.localService                                 
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'                            
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')                       
      );

      if (bestFrenchVoice) {
        utterance.voice = bestFrenchVoice;
        console.log('🎤 Voix sélectionnée:', bestFrenchVoice.name);
      } else {
        console.warn('⚠️ Aucune voix française trouvée');
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

  // Fonction pour attendre
  const wait = async (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        resolve();
      }, ms);
    });
  };

  // Fonction pour faire défiler vers une section
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

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setHasStarted(true);

    try {
      // Introduction - Objectif du chapitre
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à faire des soustractions jusqu'à 10.", true);
      await wait(1000);

      if (stopSignalRef.current) return;

      await playAudio("L'objectif est simple : savoir enlever des objets ou des nombres pour trouver combien il en reste !", true);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Présentation des trois méthodes
      setHighlightedElement('strategies');
      scrollToSection('strategies-section');
      await playAudio("Pour y arriver, je vais te montrer trois méthodes magiques !", true);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Scroll vers les exemples pour voir les cartes
      scrollToSection('examples-section');
      await wait(800);

      // Méthode 1 : Compter à rebours
      setHighlightedMethod('counting');
      await playAudio("Première méthode : compter à rebours ! On part du grand nombre et on compte en descendant.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Méthode 2 : Objets visuels
      setHighlightedMethod('visual');
      await playAudio("Deuxième méthode : avec des objets ! On voit les objets et on en enlève quelques-uns.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Méthode 3 : Doigts
      setHighlightedMethod('fingers');
      await playAudio("Troisième méthode : avec tes doigts ! Tu lèves tes doigts, tu en baisses, et tu comptes ce qui reste.", true);
      await wait(2000);

      if (stopSignalRef.current) return;

      // Conclusion
      setHighlightedMethod(null);
      setHighlightedElement('examples');
      await playAudio("Maintenant, choisis une méthode pour voir une animation magique qui t'explique tout !", true);
      await wait(500);

      if (stopSignalRef.current) return;

      // Message de Sam pour passer aux exercices
      await playAudio("Dès que tu auras bien compris, tu pourras faire les exercices !", true);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Scroll vers les exercices et illumination
      setHighlightedElement('exercise_tab');
      await wait(500);
      
      // Scroll vers le haut pour voir les onglets
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await wait(2000);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setHighlightedMethod(null);
    }
  };

  // Fonction pour expliquer un exemple spécifique
  const explainSpecificExample = async (index: number) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    
    const example = subtractionExamples[index];
    setCurrentExample(index);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Présentation de l'exemple
      setHighlightedElement('example-title');
      await playAudio(`Regardons la méthode : ${example.title} avec ${example.start} moins ${example.remove} !`, true);
      await wait(800);

      if (stopSignalRef.current) return;

      // Explication de la stratégie
      setAnimatingStep('strategy-explanation');
      scrollToSection('animation-section');
      await playAudio(example.explanation, true);
      await wait(1000);

      if (stopSignalRef.current) return;

      // Animation selon la stratégie
      if (example.strategy === 'counting') {
        await animateCountingStrategy(example);
      } else if (example.strategy === 'visual') {
        await animateVisualStrategy(example);
      } else if (example.strategy === 'fingers') {
        await animateFingersStrategy(example);
      }

      // Résultat final
      setAnimatingStep('final-result');
      scrollToSection('animation-section');
      await playAudio(`Donc ${example.start} moins ${example.remove} égale ${example.result} ! Bravo !`, true);
      await wait(1000);

    } finally {
      // Pause de 1,5 seconde à la fin pour laisser l'élève comprendre
      await wait(1500);
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setCurrentCountingNumber(null);
    }
  };

  // Animation pour la stratégie de comptage
  const animateCountingStrategy = async (example: any) => {
    setAnimatingStep('counting-start');
    setCurrentCountingNumber(example.start);
    scrollToSection('animation-section');
    await playAudio(`On part de ${example.start}`, 'slow');
    await wait(1000);

    if (stopSignalRef.current) return;

    setAnimatingStep('counting-down');
    scrollToSection('animation-section');
    for (let i = 1; i <= example.remove; i++) {
      const currentNumber = example.start - i;
      setCurrentCountingNumber(currentNumber);
      await playAudio(`${currentNumber}`, 'slow');
      await wait(800);
      if (stopSignalRef.current) return;
    }

    setAnimatingStep('counting-result');
    scrollToSection('animation-section');
    await playAudio(`On arrive à ${example.result} !`, 'slow');
    await wait(500);

    // Pause de 1,5 seconde à la fin pour bien comprendre
    await wait(1500);
    
    // Reset
    setCurrentCountingNumber(null);
  };

  // Animation pour la stratégie visuelle
  const animateVisualStrategy = async (example: any) => {
    setAnimatingStep('visual-start');
    setRemovedObjectsCount(0);
    scrollToSection('animation-section');
    await playAudio(`Voici ${example.start} objets`, 'slow');
    await wait(1500);

    if (stopSignalRef.current) return;

    setAnimatingStep('visual-removing');
    scrollToSection('animation-section');
    await playAudio(`On va en enlever ${example.remove} un par un`, 'slow');
    await wait(1000);

    if (stopSignalRef.current) return;

    // Enlever les objets un par un
    for (let i = 1; i <= example.remove; i++) {
      setRemovedObjectsCount(i);
      await playAudio(`J'enlève le ${i === 1 ? 'premier' : i === 2 ? 'deuxième' : i + 'ème'} objet`, 'slow');
      await wait(1500);
      if (stopSignalRef.current) return;
    }

    setAnimatingStep('visual-result');
    scrollToSection('animation-section');
    await playAudio(`Il en reste ${example.result} !`, 'slow');
    await wait(500);

    // Pause de 1,5 seconde à la fin pour bien comprendre
    await wait(1500);
    
    // Reset
    setRemovedObjectsCount(0);
  };

  // Animation pour la stratégie avec les doigts
  const animateFingersStrategy = async (example: any) => {
    setAnimatingStep('fingers-start');
    setRemovedObjectsCount(0);
    scrollToSection('animation-section');
    await playAudio(`Lève ${example.start} doigts !`, 'slow');
    await wait(1500);

    if (stopSignalRef.current) return;

    setAnimatingStep('fingers-remove');
    scrollToSection('animation-section');
    await playAudio(`Maintenant, on va baisser ${example.remove} doigts un par un`, 'slow');
    await wait(1000);

    if (stopSignalRef.current) return;

    // Baisser les doigts un par un
    for (let i = 1; i <= example.remove; i++) {
      setRemovedObjectsCount(i);
      await playAudio(`Je baisse le ${i === 1 ? 'premier' : i === 2 ? 'deuxième' : i + 'ème'} doigt`, 'slow');
      await wait(1500);
      if (stopSignalRef.current) return;
    }

    setAnimatingStep('fingers-count');
    scrollToSection('animation-section');
    await playAudio(`Compte ceux qui restent levés : ${example.result} doigts !`, 'slow');
    await wait(1000);

    // Pause de 1,5 seconde à la fin pour bien comprendre
    await wait(1500);
    
    // Reset
    setRemovedObjectsCount(0);
  };

  // Fonction pour expliquer les exercices avec Sam
  const explainExercisesWithSam = async () => {
    setExercisesIsPlayingVocal(true);
    setExercisesHasStarted(true);
    
    const speak = (text: string) => {
      return new Promise<void>((resolve) => {
        speechSynthesis.cancel();
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0; // Vitesse normale pour les exercices
          utterance.pitch = 1.1;
          utterance.onend = () => {
            resolve();
          };
          utterance.onerror = () => {
            resolve();
          };
          speechSynthesis.speak(utterance);
        }, 200);
      });
    };

    try {
      await speak("Salut ! Maintenant, on va s'entraîner avec des exercices de calcul ! Tu vas voir des soustractions simples.");
      
      await wait(500);
      
      // Illuminer le bouton "Écouter"
      setHighlightedElement('listen-button');
      await speak("Pour lire l'énoncé, tu peux appuyer ici sur le bouton écouter !");
      
      await wait(1000);
      setHighlightedElement(null);
      
      await speak("Si ta réponse est mauvaise, je t'aiderai avec une explication détaillée. Amuse-toi bien !");
      
    } catch (error) {
      console.error('Erreur dans explainExercisesWithSam:', error);
    } finally {
      setExercisesIsPlayingVocal(false);
    }
  };

  // Fonction pour les exercices
  const handleAnswerClick = async (answer: string) => {
    stopAllVocalsAndAnimations();
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].answer.toString();
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
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    } else {
      // Lancer l'animation d'explication pour les mauvaises réponses
      setTimeout(() => {
        explainWrongAnswer(exercises[currentExercise]);
      }, 1000);
    }
  };

  const explainWrongAnswer = async (exercise: any) => {
    stopAllVocalsAndAnimations();
    await wait(500);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(0); // Pour utiliser les animations existantes
    
    // Extraire les nombres de l'exercice
    const match = exercise.question.match(/Calcule : (\d+) - (\d+)/);
    if (!match) {
      setIsAnimationRunning(false);
      return;
    }
    
    const num1 = parseInt(match[1]);
    const num2 = parseInt(match[2]);
    const result = exercise.answer;
    
    try {
      // Introduction de la correction
      await playAudio(`Ne t'inquiète pas ! Je vais t'expliquer comment calculer ${num1} moins ${num2} étape par étape !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      // Scroll vers la section de correction dans les exercices
      const correctionElement = document.getElementById('correction-animation');
      if (correctionElement) {
        correctionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Pour les soustractions jusqu'à 10, on utilise des objets visuels
      setAnimatingStep('objects-step1');
      setCurrentStep('step1');
      await playAudio(`Regarde bien ! Je vais te montrer avec des objets. J'ai ${num1} objets au départ !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setCurrentStep('step2');
      setRemovedObjectsCount(0); // Réinitialiser le compteur
      await playAudio(`Maintenant, je vais enlever ${num2} objets un par un !`, true);
      if (stopSignalRef.current) return;
      
      // Animation d'enlèvement d'objets
      for (let i = 1; i <= num2; i++) {
        if (stopSignalRef.current) return;
        await wait(1000);
        setRemovedObjectsCount(i);
        await playAudio(`J'enlève le ${i}${i === 1 ? 'er' : 'ème'} objet !`, true);
        if (stopSignalRef.current) return;
        await wait(500);
      }
      
      await wait(1000);
      setCurrentStep('result');
      await playAudio(`Et voilà ! Il me reste ${result} objets ! Donc ${num1} moins ${num2} égale ${result} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      await playAudio("Tu vois comme c'est simple avec les objets ! Essaie la suivante !", true);
      if (stopSignalRef.current) return;
      
      // Scroll vers le bouton suivant à la fin de la correction
      await wait(1000);
      const nextButton = document.getElementById('next-button');
      if (nextButton) {
        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedElement('next-button');
        setTimeout(() => setHighlightedElement(null), 3000);
      }
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      // NE PAS réinitialiser isAnimationRunning ici pour garder l'animation affichée
      // L'animation sera réinitialisée seulement lors du clic sur "Suivant"
      // setIsAnimationRunning(false); // Commenté pour garder l'animation visible
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    
    // Réinitialiser tous les états d'animation quand on passe à l'exercice suivant
    setCurrentExample(null);
    setAnimatingStep(null);
    setCurrentStep(null);
    setCurrentCountingNumber(null);
    setRemovedObjectsCount(0);
    setIsAnimationRunning(false);
    
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      const finalScoreValue = finalScore || score;
      setFinalScore(finalScoreValue);
      setShowCompletionModal(true);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowCompletionModal(false);
  };

  // Gestion des événements pour arrêter les vocaux
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

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Override history methods
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
      stopAllVocalsAndAnimations();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Fonction pour rendre les objets avec animations
  const renderObjects = (count: number, item: string, colorClass: string, fadeOut = 0) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`text-3xl ${colorClass} transition-all duration-1000 transform ${
          i < fadeOut ? 'opacity-70 scale-75' : 'opacity-100 scale-100'
        } ${
          animatingStep === 'visual-start' || animatingStep === 'visual-removing' ? 'animate-bounce' : ''
        }`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {item}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Bouton flottant de Sam - visible quand Sam parle ou pendant les animations */}
              {(isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal) && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title={isPlayingVocal ? "Arrêter Sam" : "Arrêter l'animation"}
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
              <span className="text-sm font-bold hidden sm:block">
                STOP
              </span>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
            </>
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-soustractions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              🔢 Soustractions jusqu'à 10
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 hidden sm:block">
              Apprendre les meilleures techniques pour soustraire
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
            }}
            disabled={isPlayingVocal}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isPlayingVocal 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : !showExercises
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            disabled={isPlayingVocal}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isPlayingVocal 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : showExercises
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* Section Cours */
          <div className="space-y-8">
            {/* Sam le Pirate avec bouton COMMENCER */}
            <div className="flex justify-center p-1 mt-1 sm:mt-2 mb-8">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Image de Sam le Pirate */}
                <div className={`relative flex-shrink-0 rounded-full bg-gradient-to-br from-green-100 to-blue-100 border-2 border-green-200 shadow-md transition-all duration-300 ${
                  isPlayingVocal
                    ? 'w-20 sm:w-24 h-20 sm:h-24 scale-105 sm:scale-110'
                    : hasStarted
                      ? 'w-16 sm:w-16 h-16 sm:h-16'
                      : 'w-16 sm:w-20 h-16 sm:h-20'
                }`}>
                  {!imageError ? (
                    <img
                      src="/image/pirate-small.png"
                      alt="Sam le Pirate"
                      className="w-full h-full object-cover rounded-full"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl rounded-full bg-gradient-to-br from-green-200 to-blue-200">
                      🏴‍☠️
                    </div>
                  )}
                  
                  {/* Haut-parleur animé quand il parle */}
                  {isPlayingVocal && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13.5H2a1 1 0 01-1-1v-5a1 1 0 011-1h2.5l3.883-3.293a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
            {/* Bouton COMMENCER */}
              <button
                onClick={explainChapter}
                  disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal} 
                  className={`relative px-3 sm:px-6 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl font-black text-sm sm:text-lg md:text-2xl transition-all duration-300 transform min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4rem] ${
                    (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-75' 
                    : hasStarted
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105' 
                        : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105 animate-pulse'
                  } shadow-2xl`}
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-shimmer"></div>
                  
                  {/* Icônes et texte */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                {isPlayingVocal 
                      ? <>🎤 <span className="animate-bounce">J'explique...</span></> 
                  : hasStarted 
                        ? <>🔄 <span>Recommencer</span></>
                        : <>🚀 <span className="animate-bounce">COMMENCER</span> ✨</>
                    }
                  </span>
                  
                  {/* Particules brillantes pour le bouton commencer */}
                  {!isPlayingVocal && !hasStarted && (
                    <>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping delay-75"></div>
                      <div className="absolute top-1/2 -right-2 w-1 h-1 bg-purple-300 rounded-full animate-ping delay-150"></div>
                    </>
                  )}
              </button>
              </div>
            </div>
            
            {/* Description sous le bouton */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-600 hidden sm:block">
                {isPlayingVocal 
                  ? 'Sam t\'explique les techniques... Utilise le bouton STOP en haut à droite pour l\'arrêter !'
                  : hasStarted 
                    ? 'Relance l\'explication complète avec Sam'
                    : 'Sam va t\'expliquer les techniques de soustraction jusqu\'à 10 !'
                }
              </p>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Book className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Les soustractions jusqu'à 10</h2>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Quand on soustrait des nombres jusqu'à 10, on peut utiliser plusieurs techniques très pratiques ! 
                Chacune a ses avantages selon la situation.
              </p>
            </div>

            {/* Les stratégies */}
            <div 
              id="strategies-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'strategies' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Nos techniques magiques</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl mb-2">🔢</div>
                  <h4 className="font-bold text-blue-800 text-sm sm:text-base">Compter à rebours</h4>
                  <p className="text-xs sm:text-sm text-blue-600">7, 6, 5... plus facile !</p>
                </div>
                
                <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl mb-2">⭐</div>
                  <h4 className="font-bold text-yellow-800 text-sm sm:text-base">Avec des objets</h4>
                  <p className="text-xs sm:text-sm text-yellow-600">On voit ce qu'on enlève</p>
                </div>
                
                <div className="p-3 sm:p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl sm:text-3xl mb-2">🖐️</div>
                  <h4 className="font-bold text-purple-800 text-sm sm:text-base">Fait avec tes doigts</h4>
                  <p className="text-xs sm:text-sm text-purple-600">Lève, baisse, compte !</p>
                </div>
              </div>
            </div>

            {/* Exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 Choisis ta technique préférée !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {subtractionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-3 sm:p-6 transition-all duration-500 ${
                      (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${
                      currentExample === index ? 'ring-4 ring-green-400 bg-green-100' : ''
                    } ${
                      highlightedMethod === example.strategy 
                        ? 'ring-4 ring-yellow-400 bg-gradient-to-r from-yellow-100 to-orange-100 shadow-2xl animate-pulse scale-110 border-2 border-yellow-300' 
                        : ''
                    }`}
                    onClick={() => {
                      if (!isPlayingVocal && !isAnimationRunning && !exercisesIsPlayingVocal) {
                        explainSpecificExample(index);
                      }
                    }}
                  >
                    <div className="text-center relative">
                      {/* Effet brillant quand la méthode est mise en évidence */}
                      {highlightedMethod === example.strategy && (
                        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                          ✨
                        </div>
                      )}
                      {highlightedMethod === example.strategy && (
                        <div className="absolute -top-1 -left-1 text-xl animate-pulse">
                          🌟
                        </div>
                      )}
                      {highlightedMethod === example.strategy && (
                        <div className="absolute -bottom-1 right-2 text-lg animate-bounce delay-75">
                          ⭐
                        </div>
                      )}
                      
                      <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">{example.item}</div>
                      <h3 className={`font-bold text-sm sm:text-base lg:text-lg mb-2 ${
                        highlightedMethod === example.strategy 
                          ? 'text-orange-800 font-extrabold text-base sm:text-lg lg:text-xl' 
                          : isPlayingVocal 
                            ? 'text-gray-400' 
                            : 'text-gray-800'
                      }`}>{example.title}</h3>
                      <div className={`text-base sm:text-lg lg:text-xl font-mono bg-white text-gray-800 px-2 sm:px-3 py-1 rounded mb-3 ${isPlayingVocal ? 'opacity-50' : ''}`}>{example.operation}</div>
                      <p className={`text-xs sm:text-sm mb-4 ${isPlayingVocal ? 'text-gray-400' : 'text-gray-600'}`}>{example.explanation}</p>
                      <button 
                        disabled={isPlayingVocal}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          isPlayingVocal 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        ▶️ Voir l'animation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone d'animation */}
            {currentExample !== null && (
              <div 
                id="animation-section"
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎬 Animation de la technique
                </h2>
                
                {(() => {
                  const example = subtractionExamples[currentExample];
                  return (
                    <div className="space-y-6">
                      {/* Titre de l'exemple */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'example-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                      }`}>
                        <h3 className="text-xl font-bold text-gray-800">{example.title}</h3>
                        <div className="text-2xl font-mono mt-2 text-gray-800">{example.operation}</div>
                      </div>

                      {/* Animation selon la stratégie */}
                      {example.strategy === 'counting' && (
                        <div className="space-y-4">
                          {(animatingStep === 'counting-start' || animatingStep === 'counting-down' || animatingStep === 'counting-result') && (
                            <div className="text-center">
                              <p className="text-lg mb-4 text-gray-800">Comptons à rebours depuis {example.start} :</p>
                              <div className="flex justify-center space-x-3">
                                {Array.from({ length: example.start + 1 }, (_, i) => {
                                  const num = example.start - i;
                                  const isActive = animatingStep === 'counting-down' || animatingStep === 'counting-result';
                                  const isResult = num === example.result && animatingStep === 'counting-result';
                                  const isCounted = currentCountingNumber !== null && num > currentCountingNumber;
                                  const isCurrent = currentCountingNumber === num;
                                  return (
                                    <div
                                      key={num}
                                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-1000 ${
                                        isResult ? 'bg-green-200 ring-4 ring-green-400 animate-pulse text-green-800' :
                                        isCurrent ? 'bg-yellow-200 ring-2 ring-yellow-400 text-yellow-800 scale-110' :
                                        isCounted ? 'bg-gray-100 text-gray-400 opacity-50' :
                                        isActive && num > example.result ? 'bg-gray-200 text-gray-800' :
                                        'bg-blue-100 text-blue-800'
                                      }`}
                                    >
                                      {num}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {example.strategy === 'visual' && (
                        <div className="space-y-4">
                          {(animatingStep === 'visual-start' || animatingStep === 'visual-removing' || animatingStep === 'visual-result') && (
                            <div className="text-center">
                              <p className="text-lg mb-4 text-gray-800">Objets à compter :</p>
                              <div className="grid grid-cols-5 gap-3 justify-items-center max-w-md mx-auto">
                                {renderObjects(
                                  example.start, 
                                  example.item, 
                                  example.color,
                                  animatingStep === 'visual-removing' || animatingStep === 'visual-result' ? removedObjectsCount : 0
                                )}
                              </div>
                              {animatingStep === 'visual-result' && (
                                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                                  <p className="text-xl font-bold text-green-800">Reste : {example.result}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {example.strategy === 'fingers' && (
                        <div className="space-y-4">
                          {(animatingStep === 'fingers-start' || animatingStep === 'fingers-remove' || animatingStep === 'fingers-count') && (
                            <div className="text-center">
                              <div className="bg-purple-50 p-6 rounded-lg">
                                <p className="text-lg mb-4 text-purple-800">Utilise tes doigts :</p>
                                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                                  {Array.from({ length: example.start }, (_, i) => (
                                    <div
                                      key={i}
                                      className={`transform transition-all duration-1000 ${
                                        (animatingStep === 'fingers-remove' || animatingStep === 'fingers-count') && i < removedObjectsCount
                                          ? 'opacity-50 scale-75 -translate-y-2' 
                                          : 'opacity-100 scale-100'
                                      }`}
                                    >
                                      <div className="text-3xl">
                                        {(animatingStep === 'fingers-remove' || animatingStep === 'fingers-count') && i < removedObjectsCount ? '👇' : '👆'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                                  <p className="text-center text-amber-800 font-bold text-sm">
                                    {animatingStep === 'fingers-start' && 'Lève tes 10 doigts !'}
                                    {animatingStep === 'fingers-remove' && `Baisse ${example.remove} doigts !`}
                                    {animatingStep === 'fingers-count' && `Il reste ${example.result} doigts levés !`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Résultat final */}
                      {animatingStep === 'final-result' && (
                        <div className="text-center p-6 bg-green-100 rounded-lg">
                          <p className="text-3xl font-bold text-green-800">
                            {example.operation} = {example.result}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Section Exercices */
          <div className="space-y-6">
            {/* Bouton DÉMARRER pour les exercices avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage pour les exercices */}
              <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-blue-100 ${
                exercisesIsPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                {!exercisesImageError ? (
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setExercisesImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl rounded-full bg-gradient-to-br from-green-200 to-blue-200">
                    🧱
            </div>
                )}
                
                {exercisesIsPlayingVocal && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour les exercices */}
              <button
                onClick={explainExercisesWithSam}
                disabled={exercisesIsPlayingVocal || isPlayingVocal || isAnimationRunning}
                className={`px-2 sm:px-4 py-2 sm:py-2 rounded-lg font-bold text-sm sm:text-base shadow-lg transition-all ${
                  (exercisesIsPlayingVocal || isPlayingVocal || isAnimationRunning)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
                } ${!exercisesHasStarted && !exercisesIsPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {exercisesIsPlayingVocal ? 'Le personnage explique...' : 'DÉMARRER LES EXERCICES'}
              </button>
            </div>
            
            {/* Header exercices */}
            <div 
              id="exercises-header"
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'exercises-header' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div 
                  id="score-display"
                  className={`text-sm sm:text-xl font-bold text-green-600 ${
                    highlightedElement === 'score-display' ? 'ring-2 ring-green-400 bg-green-50 rounded px-2 py-1' : ''
                  }`}
                >
                    Score : {score}/{exercises.length}
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
                  </div>

                        {/* Question */}
            <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg text-center">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise].question}
                </h3>
                <button
                  id="listen-button"
                  onClick={() => {
                    speechSynthesis.cancel();
                    setIsPlayingVocal(true);
                    const utterance = new SpeechSynthesisUtterance(exercises[currentExercise].question);
                    utterance.rate = 1.3;
                    utterance.pitch = 1.1;
                    utterance.onend = () => setIsPlayingVocal(false);
                    utterance.onerror = () => setIsPlayingVocal(false);
                    speechSynthesis.speak(utterance);
                  }}
                  disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                  className={`ml-2 sm:ml-4 px-2 sm:px-3 py-1 sm:py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'listen-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''
                  }`}
                >
                  🔊 Écouter
                </button>
              </div>

              {/* Section d'animation pour les corrections */}
              {isCorrect === false && (currentStep === 'step1' || currentStep === 'step2' || currentStep === 'result') && (
                <div id="correction-animation" className="mb-3 sm:mb-8 p-2 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl border-2 border-yellow-300">
                  <h4 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800 mb-2 sm:mb-4">📚 Correction détaillée</h4>
                  
                  {(() => {
                    const match = exercises[currentExercise].question.match(/Calcule : (\d+) - (\d+)/);
                    if (!match) return null;
                    
                    const num1 = parseInt(match[1]);
                    const num2 = parseInt(match[2]);
                    const result = exercises[currentExercise].answer;
                    
                    return (
                      <div className="space-y-2 sm:space-y-4">
                  <div className="text-center">
                          <div className="text-base sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">Technique : Avec des objets</div>
                          <div className="text-sm sm:text-lg text-gray-700">{num1} - {num2}</div>
                  </div>

                        {/* Étape 1 - Présentation des objets */}
                        {(currentStep === 'step1' || currentStep === 'step2' || currentStep === 'result') && (
                          <div className={`p-2 sm:p-4 rounded-lg transition-all ${
                            animatingStep === 'objects-step1' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
                          }`}>
                            <div className="text-sm sm:text-lg font-semibold text-center text-gray-800 mb-2 sm:mb-3">
                              Étape 1 : J'ai {num1} objets au départ
                            </div>
                            <div className="flex justify-center items-center flex-wrap gap-1 sm:gap-2">
                              {Array.from({length: num1}, (_, i) => (
                                <div 
                                  key={i}
                                  className="text-lg sm:text-3xl transition-all duration-500"
                                >
                                  {exercises[currentExercise].visual}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Étape 2 - Animation d'enlèvement d'objets */}
                        {(currentStep === 'step2' || currentStep === 'result') && (
                          <div className={`p-2 sm:p-4 rounded-lg transition-all ${
                            currentStep === 'step2' ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-gray-50'
                          }`}>
                            <div className="text-center">
                              <div className="text-sm sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                                Étape 2 : J'enlève {num2} objets
                              </div>
                              <div className="flex justify-center items-center flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                                {Array.from({length: num1}, (_, i) => {
                                  const isRemoved = i < removedObjectsCount;
                                  return (
                                    <div 
                                      key={i}
                                      className={`text-lg sm:text-3xl transition-all duration-500 ${
                                        isRemoved 
                                          ? 'opacity-30 line-through scale-75 grayscale' 
                                          : 'opacity-100 scale-100'
                                      }`}
                                    >
                                      {exercises[currentExercise].visual}
                                    </div>
                                  );
                                })}
                              </div>
                              {removedObjectsCount > 0 && (
                                <div className="text-xs sm:text-sm text-gray-600">
                                  Objets enlevés : {removedObjectsCount} / {num2}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Résultat */}
                        {currentStep === 'result' && (
                          <div className={`p-2 sm:p-4 rounded-lg transition-all ${
                            currentStep === 'result' ? 'bg-green-100 ring-2 ring-green-400' : 'bg-gray-50'
                          }`}>
                            <div className="text-center">
                              <div className="text-sm sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                                Résultat : {result} objets restants
                              </div>
                              <div className="flex justify-center items-center flex-wrap gap-1 sm:gap-2">
                                {Array.from({length: result}, (_, i) => (
                                  <div 
                                    key={i}
                                    className="text-lg sm:text-3xl animate-pulse"
                                  >
                                    {exercises[currentExercise].visual}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Icône visuelle */}
              <div className="text-center mb-6">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">{exercises[currentExercise].visual}</div>
                  </div>

                  {/* Zone de réponse */}
              <div className="flex justify-center items-center gap-4 mb-6">
                    <input
                  id="answer-input"
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="?"
                  className={`text-center text-base sm:text-lg lg:text-xl font-bold border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 w-20 sm:w-32 ${
                    highlightedElement === 'answer-input' ? 'ring-4 ring-green-400 animate-pulse' : ''
                  }`}
                />
                      <button
                  id="validate-button"
                  onClick={() => handleAnswerClick(userAnswer)}
                  disabled={!userAnswer || isCorrect !== null || isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                  className={`px-4 py-3 sm:px-6 sm:py-4 bg-green-500 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'validate-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                  }`}
                >
                  Valider
                      </button>
                  </div>

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg text-center ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <XCircle className="w-6 h-6" />
                        )}
                        <span className="font-bold">
                          {isCorrect ? 'Bravo ! Bonne réponse !' : `Pas tout à fait... La réponse était ${exercises[currentExercise].answer}`}
                        </span>
                      </div>
                    </div>
                  )}
                      </div>
                      
            {/* Navigation */}
            {isCorrect !== null && (
              <div className="flex justify-center">
                      <button
                  id="next-button"
                        onClick={nextExercise}
                            disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                  className={`bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    highlightedElement === 'next-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                  }`}
                          >
                  {currentExercise < exercises.length - 1 ? 'Suivant →' : 'Voir les résultats'}
                      </button>
                    </div>
                  )}

            {!showCompletionModal ? null : (
                /* Modal de fin */
                <div className="text-center space-y-6">
                  <div className="text-4xl sm:text-5xl lg:text-6xl">🎉</div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    Exercices terminés !
                  </h2>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    Score : {score} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      disabled={isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        (isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Retour au cours
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
} 