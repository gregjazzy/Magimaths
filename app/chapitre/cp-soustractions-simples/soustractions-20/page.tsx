'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star, Trophy, Target, Play, Minus } from 'lucide-react';

// Types pour la sécurité TypeScript
type StrategyType = 'comptage' | 'decomposition' | 'complement' | 'double';

export default function SoustractionsJusqu20() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // États pour les animations du cours
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('comptage');
  const [currentSubtraction, setCurrentSubtraction] = useState('12_minus_5');
  const [animationStep, setAnimationStep] = useState(0);
  const [showNumbers, setShowNumbers] = useState({ start: 0, remove: 0, result: 0 });
  const [showStrategy, setShowStrategy] = useState<string | null>(null);
  const [countingNumbers, setCountingNumbers] = useState<number[]>([]);
  
  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  
  // Refs pour la gestion vocale ultra-agressive
  const hasStartedRef = useRef(false);
  const exerciseInstructionGivenRef = useRef(false);
  const shouldStopRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  // Utilitaires vocaux
  const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      if (shouldStopRef.current) {
        resolve();
        return;
      }
      setTimeout(() => {
        if (shouldStopRef.current) {
          resolve();
          return;
        }
        resolve();
      }, ms);
    });
  };

  // 🎵 FONCTION VOCALE CENTRALISÉE ULTRA-ROBUSTE
  const playVocal = (text: string, rate: number = 1.2): Promise<void> => {
    return new Promise((resolve) => {
      // 🔒 PROTECTION : Empêcher les vocaux sans interaction utilisateur
      if (!userHasInteractedRef.current) {
        console.log("🚫 BLOQUÉ : Tentative de vocal sans interaction");
        resolve();
        return;
      }
      
      // 🛑 VÉRIFIER LE SIGNAL D'ARRÊT
      if (shouldStopRef.current) {
        console.log("🛑 ARRÊT : Signal d'arrêt détecté");
        resolve();
        return;
      }
      
      // 🔥 ARRÊT SYSTÉMATIQUE des vocaux précédents (ZÉRO CONFLIT)
      speechSynthesis.cancel();
      setTimeout(() => speechSynthesis.cancel(), 10); // Double sécurité
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = rate;
      
      utterance.onend = () => {
        console.log("✅ VOCAL TERMINÉ :", text.substring(0, 30) + "...");
        resolve();
      };
      
      utterance.onerror = () => {
        console.log("❌ ERREUR VOCAL :", text.substring(0, 30) + "...");
        resolve();
      };
      
      console.log("🎵 DÉMARRAGE VOCAL :", text.substring(0, 30) + "...");
      speechSynthesis.speak(utterance);
    });
  };

  // 🛑 FONCTION D'ARRÊT ULTRA-AGRESSIVE
  const stopAllVocals = () => {
    console.log("🛑 ARRÊT ULTRA-AGRESSIF de tous les vocaux");
    
    // Triple sécurité
    speechSynthesis.cancel();
    setTimeout(() => speechSynthesis.cancel(), 10);
    setTimeout(() => speechSynthesis.cancel(), 50);
    setTimeout(() => speechSynthesis.cancel(), 100);
    
    // Signal d'arrêt global
    shouldStopRef.current = true;
    setIsPlayingVocal(false);
  };

  // Alias pour compatibilité
  const playAudioSequence = playVocal;
  const stopVocal = stopAllVocals;

  // Données des soustractions pour le cours
  const subtractionExamples = {
    '12_minus_5': { start: 12, remove: 5, result: 7, difficulty: 'moyen' },
    '15_minus_8': { start: 15, remove: 8, result: 7, difficulty: 'difficile' },
    '18_minus_9': { start: 18, remove: 9, result: 9, difficulty: 'difficile' },
    '20_minus_6': { start: 20, remove: 6, result: 14, difficulty: 'moyen' },
    '17_minus_9': { start: 17, remove: 9, result: 8, difficulty: 'difficile' },
    '16_minus_7': { start: 16, remove: 7, result: 9, difficulty: 'difficile' }
  };

  // Exercices variés (20 exercices)
  const exercises = [
    // Soustractions simples
    { question: "Combien font 11 - 3 ?", answer: 8, type: "simple", hint: "Compte à rebours de 11" },
    { question: "Combien font 13 - 4 ?", answer: 9, type: "simple", hint: "13, 12, 11, 10, 9" },
    { question: "Combien font 15 - 6 ?", answer: 9, type: "simple", hint: "Utilise tes doigts !" },
    { question: "Combien font 12 - 7 ?", answer: 5, type: "moyen", hint: "12 - 2 = 10, puis 10 - 5 = 5" },
    
    // Soustractions avec passage à la dizaine
    { question: "Combien font 14 - 8 ?", answer: 6, type: "difficile", hint: "14 - 4 = 10, puis 10 - 4 = 6" },
    { question: "Combien font 16 - 9 ?", answer: 7, type: "difficile", hint: "16 - 6 = 10, puis 10 - 3 = 7" },
    { question: "Combien font 13 - 7 ?", answer: 6, type: "difficile", hint: "13 - 3 = 10, puis 10 - 4 = 6" },
    { question: "Combien font 15 - 9 ?", answer: 6, type: "difficile", hint: "15 - 5 = 10, puis 10 - 4 = 6" },
    
    // Soustractions avec 10
    { question: "Combien font 20 - 10 ?", answer: 10, type: "avec_dix", hint: "20 moins une dizaine !" },
    { question: "Combien font 18 - 10 ?", answer: 8, type: "avec_dix", hint: "Il reste les unités !" },
    { question: "Combien font 10 - 7 ?", answer: 3, type: "avec_dix", hint: "Complément à 10 !" },
    { question: "Combien font 10 - 4 ?", answer: 6, type: "avec_dix", hint: "4 + ? = 10" },
    
    // Doubles et près des doubles
    { question: "Combien font 16 - 8 ?", answer: 8, type: "double", hint: "La moitié de 16 !" },
    { question: "Combien font 18 - 9 ?", answer: 9, type: "double", hint: "La moitié de 18 !" },
    { question: "Combien font 14 - 7 ?", answer: 7, type: "double", hint: "7 + 7 = 14" },
    
    // Problèmes contextuels
    { question: "Julie a 17 autocollants. Elle en colle 8 sur son cahier. Combien lui en reste-t-il ?", answer: 9, type: "probleme", hint: "17 - 8 = ?" },
    { question: "Dans une boîte, il y a 20 bonbons. Les enfants en mangent 12. Combien en reste-t-il ?", answer: 8, type: "probleme", hint: "20 - 12 = ?" },
    { question: "Tom collectionne 19 cartes. Il en donne 11 à son frère. Combien de cartes garde-t-il ?", answer: 8, type: "probleme", hint: "19 - 11 = ?" },
    
    // Soustractions avancées
    { question: "Combien font 20 - 13 ?", answer: 7, type: "avance", hint: "20 - 10 = 10, puis 10 - 3 = 7" },
    { question: "Combien font 17 - 12 ?", answer: 5, type: "avance", hint: "17 - 10 = 7, puis 7 - 2 = 5" }
  ];

  // Fonction principale d'explication du cours
  const explainSubtractions = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      
      await playAudioSequence("Salut ! Aujourd'hui, nous allons maîtriser les soustractions jusqu'à 20 !", 1.1);
      await wait(800);
      
      setHighlightedElement('title');
      await playAudioSequence("C'est plus difficile qu'avec les petits nombres, mais j'ai des astuces magiques pour toi !", 1.1);
      await wait(800);
      
      // Expliquer les différentes stratégies
      setHighlightedElement('strategies');
      await playAudioSequence("Il y a 4 stratégies super efficaces pour soustraire jusqu'à 20 !", 1.1);
      await wait(800);
      
      // Démonstration avec comptage à rebours
      setSelectedStrategy('comptage');
      setCurrentSubtraction('12_minus_5');
      await playAudioSequence("La première stratégie : compter à rebours ! Regardons 12 moins 5 !", 1.1);
      await wait(500);
      
      await demonstrateSubtraction();
      
      // Expliquer la décomposition
      setSelectedStrategy('decomposition');
      await wait(1000);
      await playAudioSequence("La deuxième stratégie : la décomposition ! On casse le nombre à enlever en morceaux !", 1.1);
      await wait(1000);
      
      // Expliquer les compléments
      setSelectedStrategy('complement');
      await wait(1000);
      await playAudioSequence("La troisième stratégie : passer par 10 ! C'est très utile quand on dépasse la dizaine !", 1.1);
      await wait(1000);
      
      // Expliquer les doubles
      setSelectedStrategy('double');
      await wait(1000);
      await playAudioSequence("La quatrième stratégie : les doubles ! Quand on enlève la moitié, c'est facile !", 1.1);
      await wait(1500);
      
      setHighlightedElement('exercise_tab');
      await playAudioSequence("Maintenant, clique sur l'onglet Exercices pour devenir un champion des soustractions jusqu'à 20 !", 1.1);
      
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainSubtractions:', error);
    }
  };

  // Démonstration d'une soustraction avec stratégie
  const demonstrateSubtraction = async () => {
    const subtraction = subtractionExamples[currentSubtraction as keyof typeof subtractionExamples];
    
    try {
      setAnimationStep(0);
      setShowNumbers({ start: 0, remove: 0, result: 0 });
      setShowStrategy(null);
      setCountingNumbers([]);
      
      // Montrer le problème
      setAnimationStep(1);
      setShowNumbers({ start: subtraction.start, remove: 0, result: 0 });
      await playAudioSequence(`Calculons ${subtraction.start} moins ${subtraction.remove} !`, 1.1);
      await wait(800);
      
      // Appliquer la stratégie selon le type
      if (selectedStrategy === 'comptage') {
        await demonstrateCountingStrategy(subtraction);
      } else if (selectedStrategy === 'decomposition') {
        await demonstrateDecompositionStrategy(subtraction);
      } else if (selectedStrategy === 'complement') {
        await demonstrateComplementStrategy(subtraction);
      } else if (selectedStrategy === 'double') {
        await demonstrateDoubleStrategy(subtraction);
      }
      
    } catch (error) {
      console.error('Erreur dans demonstrateSubtraction:', error);
    }
  };

  // Stratégie de comptage à rebours
  const demonstrateCountingStrategy = async (subtraction: any) => {
    setAnimationStep(2);
    setShowStrategy('comptage');
    await playAudioSequence("Je compte à rebours en enlevant un par un !", 1.1);
    await wait(500);
    
    let current = subtraction.start;
    const numbers = [];
    
    for (let i = 0; i < subtraction.remove; i++) {
      numbers.push(current);
      current--;
      setCountingNumbers([...numbers]);
      await playAudioSequence(`${current + 1}`, 0.9);
      await wait(600);
    }
    
    setAnimationStep(3);
    setShowNumbers({ start: subtraction.start, remove: subtraction.remove, result: subtraction.result });
    await playAudioSequence(`J'arrive à ${subtraction.result} !`, 1.1);
  };

  // Stratégie de décomposition
  const demonstrateDecompositionStrategy = async (subtraction: any) => {
    setAnimationStep(2);
    setShowStrategy('decomposition');
    await playAudioSequence("Je décompose le nombre à enlever pour calculer plus facilement !", 1.1);
    await wait(500);
    
    if (subtraction.start === 12 && subtraction.remove === 5) {
      await playAudioSequence("12 moins 5 : je fais d'abord 12 moins 2 égale 10, puis 10 moins 3 égale 7 !", 1.1);
    } else if (subtraction.start === 15 && subtraction.remove === 8) {
      await playAudioSequence("15 moins 8 : je fais d'abord 15 moins 5 égale 10, puis 10 moins 3 égale 7 !", 1.1);
    }
    
    setAnimationStep(3);
    setShowNumbers({ start: subtraction.start, remove: subtraction.remove, result: subtraction.result });
  };

  // Stratégie du complément
  const demonstrateComplementStrategy = async (subtraction: any) => {
    setAnimationStep(2);
    setShowStrategy('complement');
    await playAudioSequence("Je passe par 10 pour simplifier le calcul !", 1.1);
    await wait(500);
    
    const toTen = subtraction.start - 10;
    const remaining = subtraction.remove - toTen;
    
    if (toTen > 0 && remaining > 0) {
      await playAudioSequence(`D'abord, j'enlève ${toTen} pour arriver à 10, puis j'enlève encore ${remaining} !`, 1.1);
    }
    
    setAnimationStep(3);
    setShowNumbers({ start: subtraction.start, remove: subtraction.remove, result: subtraction.result });
  };

  // Stratégie des doubles
  const demonstrateDoubleStrategy = async (subtraction: any) => {
    setAnimationStep(2);
    setShowStrategy('double');
    await playAudioSequence("C'est un double ! Je connais la moitié par cœur !", 1.1);
    await wait(500);
    
    if (subtraction.start === 16 && subtraction.remove === 8) {
      await playAudioSequence("16 divisé par 2 égale 8 ! Donc 16 moins 8 égale 8 !", 1.1);
    } else if (subtraction.start === 18 && subtraction.remove === 9) {
      await playAudioSequence("18 divisé par 2 égale 9 ! Donc 18 moins 9 égale 9 !", 1.1);
    }
    
    setAnimationStep(3);
    setShowNumbers({ start: subtraction.start, remove: subtraction.remove, result: subtraction.result });
  };

  // Fonction d'explication des exercices
  const explainExercisesOnce = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      setExerciseInstructionGiven(true);
      exerciseInstructionGivenRef.current = true;
      
      await playAudioSequence("Super ! Tu es dans les exercices de soustractions jusqu'à 20 !", 1.0);
      await wait(800);
      
      await playAudioSequence("Tu vas résoudre 20 soustractions variées : simples, difficiles, avec des problèmes et des astuces !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Pour chaque soustraction, utilise les stratégies qu'on a vues : comptage, décomposition, passage par 10 ou doubles !", 1.0);
      await wait(1000);
      
      await playAudioSequence("N'hésite pas à utiliser tes doigts ou à dessiner ! Allez, c'est parti pour devenir un expert !", 1.0);
      
    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    }
  };

  const speakText = (text: string) => {
    if (!userHasInteractedRef.current) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.lang = 'fr-FR';
    speechSynthesis.speak(utterance);
  };

  // Fonction pour vérifier la réponse
  const checkAnswer = () => {
    stopVocal();
    const exerciseData = exercises[currentExercise];
    const userNum = parseInt(userAnswer);
    
    if (userNum === exerciseData.answer) {
      setIsCorrect(true);
      setScore(score + 1);
      speakText("Bravo ! C'est exact !");
      
      setTimeout(() => {
        nextExercise();
      }, 2000);
    } else {
      setIsCorrect(false);
      speakText(`Pas tout à fait ! ${exerciseData.hint}`);
    }
  };

  const nextExercise = () => {
    stopVocal();
    if (currentExercise < exercises.length - 1) {
      const nextIndex = currentExercise + 1;
      setCurrentExercise(nextIndex);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score + (isCorrect ? 1 : 0));
      setShowCompletionModal(true);
    }
  };

  const resetExercises = () => {
    stopVocal();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowCompletionModal(false);
  };

  // Fonction centralisée de reset des boutons
  const resetButtons = () => {
    console.log('🔄 resetButtons called');
    setExerciseInstructionGiven(false);
    setHasStarted(false);
    exerciseInstructionGivenRef.current = false;
    hasStartedRef.current = false;
  };

  // 🎵 GESTION VOCALE ULTRA-ROBUSTE - Event Listeners
  useEffect(() => {
    // 🎵 FONCTION DE NETTOYAGE VOCAL pour la sortie de page
    const handlePageExit = () => {
      console.log("🚪 SORTIE DE PAGE DÉTECTÉE - Arrêt des vocaux");
      stopAllVocals();
    };
    
    // 🔍 GESTION DE LA VISIBILITÉ (onglet caché/affiché)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👁️ PAGE CACHÉE - Arrêt des vocaux");
        stopAllVocals();
      }
    };
    
    // 🏠 GESTION DE LA NAVIGATION
    const handleNavigation = () => {
      console.log("🔄 NAVIGATION DÉTECTÉE - Arrêt des vocaux");
      stopAllVocals();
    };
    
    // 🚪 EVENT LISTENERS pour sortie de page
    window.addEventListener('beforeunload', handlePageExit);
    window.addEventListener('pagehide', handlePageExit);
    window.addEventListener('unload', handlePageExit);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      // 🧹 NETTOYAGE COMPLET
      stopAllVocals();
      
      // Retirer les event listeners
      window.removeEventListener('beforeunload', handlePageExit);
      window.removeEventListener('pagehide', handlePageExit);
      window.removeEventListener('unload', handlePageExit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Gestion des événements pour persistance des boutons
  useEffect(() => {
    console.log('🚀 Component mounted, setting up ultra-aggressive reset');
    resetButtons();
    
    // Marquer l'interaction utilisateur
    const markUserInteraction = () => {
      userHasInteractedRef.current = true;
    };
    
    document.addEventListener('click', markUserInteraction);
    document.addEventListener('keydown', markUserInteraction);
    document.addEventListener('touchstart', markUserInteraction);
    
    // Reset périodique ultra-agressif
    const interval = setInterval(() => {
      if (hasStartedRef.current || exerciseInstructionGivenRef.current) {
        console.log('⏰ Periodic reset triggered');
        resetButtons();
      }
    }, 2000);

    // Gestion de la visibilité
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('👁️ Page hidden, stopping vocals');
        stopVocal();
        shouldStopRef.current = true;
      } else {
        console.log('👁️ Page visible, resetting buttons');
        resetButtons();
      }
    };

    const handleFocus = () => {
      console.log('🎯 Window focused, resetting buttons');
      resetButtons();
    };

    const handlePageShow = () => {
      console.log('📄 Page show, resetting buttons');
      resetButtons();
    };

    const handleBlur = () => {
      console.log('😴 Window blurred, stopping vocals');
      stopVocal();
    };

    const handlePopState = () => {
      console.log('⬅️ Pop state, resetting buttons');
      resetButtons();
    };

    const handleMouseEnter = () => {
      resetButtons();
    };

    const handleScroll = () => {
      resetButtons();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('scroll', handleScroll);

    document.addEventListener('DOMContentLoaded', () => {
      resetButtons();
    });

    // Reset sur chargement initial
    setTimeout(() => {
      resetButtons();
    }, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', markUserInteraction);
      document.removeEventListener('keydown', markUserInteraction);
      document.removeEventListener('touchstart', markUserInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Styles CSS intégrés
  const styles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 5px rgba(251, 146, 60, 0.5); }
      50% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.8); }
    }
    @keyframes countDown {
      0% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0.5; }
    }
    .float { animation: float 3s ease-in-out infinite; }
    .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .count-down { animation: countDown 0.6s ease-in-out; }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux soustractions simples</span>
          </button>
          
          <h1 
            className={`text-3xl font-bold text-center text-orange-800 ${
              highlightedElement === 'title' ? 'pulse-glow bg-yellow-200 px-4 py-2 rounded-lg' : ''
            }`}
          >
            ⬇️ Soustractions jusqu'à 20
          </h1>
          
          <div className="w-32"></div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => {
              setShowExercises(false);
              stopVocal();
              setTimeout(() => { resetButtons(); }, 100);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showExercises
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-orange-600 hover:bg-orange-50'
            }`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              setShowExercises(true);
              stopVocal();
              setTimeout(() => { resetButtons(); }, 100);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-orange-600 hover:bg-orange-50'
            } ${highlightedElement === 'exercise_tab' ? 'pulse-glow' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          // Section Cours
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            {!hasStarted && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setHasStarted(true);
                    hasStartedRef.current = true;
                    explainSubtractions();
                  }}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg animate-bounce"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-6 h-6" />
                    <span>🚀 COMMENCER !</span>
                  </div>
                </button>
              </div>
            )}

            {/* Introduction visuelle */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-orange-800 mb-4 text-center">
                ✨ Maîtrise les soustractions jusqu'à 20 !
              </h2>
              
              <div className="text-center text-gray-700 space-y-2">
                <p>🧠 Apprends 4 stratégies magiques</p>
                <p>📊 Soustractions de 11 à 20</p>
                <p>🏆 Deviens un expert du calcul mental !</p>
              </div>
            </div>

            {/* Les 4 stratégies */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'strategies' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-orange-800 mb-4 text-center">
                🎯 Les 4 stratégies magiques
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSelectedStrategy('comptage')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'comptage'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-3xl mb-2">👆</div>
                  <h4 className="font-bold text-orange-800">Comptage à rebours</h4>
                  <p className="text-sm text-gray-600">Un par un vers la réponse</p>
                </button>
                
                <button
                  onClick={() => setSelectedStrategy('decomposition')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'decomposition'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🧩</div>
                  <h4 className="font-bold text-orange-800">Décomposition</h4>
                  <p className="text-sm text-gray-600">Casser en morceaux</p>
                </button>
                
                <button
                  onClick={() => setSelectedStrategy('complement')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'complement'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🔟</div>
                  <h4 className="font-bold text-orange-800">Passage par 10</h4>
                  <p className="text-sm text-gray-600">Utiliser la dizaine</p>
                </button>
                
                <button
                  onClick={() => setSelectedStrategy('double')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'double'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-3xl mb-2">👯</div>
                  <h4 className="font-bold text-orange-800">Doubles</h4>
                  <p className="text-sm text-gray-600">Moitiés connues</p>
                </button>
              </div>
            </div>

            {/* Zone de démonstration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-orange-800">
                  Démonstration : {selectedStrategy === 'comptage' && '👆 Comptage à rebours'}
                  {selectedStrategy === 'decomposition' && '🧩 Décomposition'}
                  {selectedStrategy === 'complement' && '🔟 Passage par 10'}
                  {selectedStrategy === 'double' && '👯 Doubles'}
                </h3>
                
                <button
                  onClick={demonstrateSubtraction}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Play className="inline w-4 h-4 mr-2" />
                  Démonstration
                </button>
              </div>

              {/* Sélecteur de soustraction */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(subtractionExamples).map(([key, example]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentSubtraction(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentSubtraction === key
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-lg font-bold">
                      {example.start} - {example.remove}
                    </div>
                    <div className="text-sm text-gray-600">
                      = {example.result}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded mt-1 ${
                      example.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-800' :
                      example.difficulty === 'difficile' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {example.difficulty}
                    </div>
                  </button>
                ))}
              </div>

              {/* Zone d'animation */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 min-h-64">
                <div className="text-center mb-4">
                  <h4 className="text-2xl font-bold text-orange-800">
                    {subtractionExamples[currentSubtraction as keyof typeof subtractionExamples].start} - {subtractionExamples[currentSubtraction as keyof typeof subtractionExamples].remove} = ?
                  </h4>
                </div>
                
                {/* Animation selon la stratégie */}
                {selectedStrategy === 'comptage' && animationStep >= 2 && (
                  <div className="text-center">
                    <h5 className="font-bold text-blue-800 mb-4">👆 Comptage à rebours :</h5>
                    <div className="flex flex-wrap justify-center gap-2">
                      {countingNumbers.map((num, index) => (
                        <span 
                          key={index} 
                          className="text-2xl font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded count-down"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedStrategy === 'decomposition' && showStrategy && (
                  <div className="text-center">
                    <h5 className="font-bold text-purple-800 mb-4">🧩 Décomposition :</h5>
                    <div className="bg-purple-100 p-4 rounded-lg">
                      <p className="text-purple-700">
                        {currentSubtraction === '12_minus_5' && "12 - 5 = (12 - 2) - 3 = 10 - 3 = 7"}
                        {currentSubtraction === '15_minus_8' && "15 - 8 = (15 - 5) - 3 = 10 - 3 = 7"}
                      </p>
                    </div>
                  </div>
                )}

                {selectedStrategy === 'complement' && showStrategy && (
                  <div className="text-center">
                    <h5 className="font-bold text-green-800 mb-4">🔟 Passage par 10 :</h5>
                    <div className="bg-green-100 p-4 rounded-lg">
                      <p className="text-green-700">
                        Passer par la dizaine facilite le calcul !
                      </p>
                    </div>
                  </div>
                )}

                {selectedStrategy === 'double' && showStrategy && (
                  <div className="text-center">
                    <h5 className="font-bold text-pink-800 mb-4">👯 Doubles :</h5>
                    <div className="bg-pink-100 p-4 rounded-lg">
                      <p className="text-pink-700">
                        Quand on enlève la moitié, c'est un double !
                      </p>
                    </div>
                  </div>
                )}

                {/* Résultat */}
                {animationStep >= 3 && (
                  <div className="text-center mt-6">
                    <div className="bg-green-100 p-6 rounded-lg">
                      <h4 className="text-3xl font-bold text-green-800">
                        = {showNumbers.result}
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Section Exercices
          <div className="space-y-6">
            {/* Bouton INSTRUCTIONS */}
            {!exerciseInstructionGiven && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    userHasInteractedRef.current = true;
                    explainExercisesOnce();
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg animate-bounce"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-6 h-6" />
                    <span>🔊 ÉCOUTER LES INSTRUCTIONS !</span>
                  </div>
                </button>
              </div>
            )}

            {/* Modal de fin */}
            {showCompletionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                  <div className="text-center">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-orange-800 mb-4">
                      Félicitations ! 🎉
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Tu maîtrises maintenant les soustractions jusqu'à 20 !
                    </p>
                    <p className="text-lg font-semibold text-orange-600 mb-6">
                      Score : {finalScore} / {exercises.length}
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={resetExercises}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        🔄 Recommencer
                      </button>
                      <button
                        onClick={() => setShowExercises(false)}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        📚 Retour au cours
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interface d'exercice */}
            {!showCompletionModal && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-gray-600">
                    Exercice {currentExercise + 1} / {exercises.length}
                  </div>
                  <div className="text-sm text-orange-600 font-semibold">
                    Score : {score} / {exercises.length}
                  </div>
                </div>

                <div className="text-center space-y-6">
                  {/* Badge du type d'exercice */}
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      exercises[currentExercise].type === 'simple' ? 'bg-green-100 text-green-800' :
                      exercises[currentExercise].type === 'moyen' ? 'bg-yellow-100 text-yellow-800' :
                      exercises[currentExercise].type === 'difficile' ? 'bg-red-100 text-red-800' :
                      exercises[currentExercise].type === 'avec_dix' ? 'bg-blue-100 text-blue-800' :
                      exercises[currentExercise].type === 'double' ? 'bg-purple-100 text-purple-800' :
                      exercises[currentExercise].type === 'avance' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {exercises[currentExercise].type === 'simple' ? '🟢 Simple' :
                       exercises[currentExercise].type === 'moyen' ? '🟡 Moyen' :
                       exercises[currentExercise].type === 'difficile' ? '🔴 Difficile' :
                       exercises[currentExercise].type === 'avec_dix' ? '🔵 Avec 10' :
                       exercises[currentExercise].type === 'double' ? '🟣 Double' :
                       exercises[currentExercise].type === 'avance' ? '⚫ Avancé' :
                       '📝 Problème'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-orange-800">
                    {exercises[currentExercise].question}
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-32 p-3 text-center text-xl border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder="?"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    
                    <div>
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        ✓ Vérifier
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-semibold">Excellent ! 🎉</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <XCircle className="w-6 h-6" />
                            <span className="font-semibold">Pas tout à fait...</span>
                          </div>
                          <p className="text-sm">{exercises[currentExercise].hint}</p>
                          <button
                            onClick={nextExercise}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Exercice suivant →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 