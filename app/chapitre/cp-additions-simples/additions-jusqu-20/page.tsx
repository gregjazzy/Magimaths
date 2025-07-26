'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star, Trophy, Target, Play } from 'lucide-react';

// Types pour la sécurité TypeScript
type AdditionKey = '3_plus_2' | '7_plus_5' | '8_plus_7' | '9_plus_6' | '4_plus_6';

export default function AdditionsJusqu20() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // États pour les animations du cours
  const [selectedAddition, setSelectedAddition] = useState<AdditionKey>('3_plus_2');
  const [animationStep, setAnimationStep] = useState(0);
  const [showObjects, setShowObjects] = useState({ group1: 0, group2: 0, result: 0 });
  const [showStrategy, setShowStrategy] = useState<string | null>(null);
  const [showCarryOver, setShowCarryOver] = useState(false);
  
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

  // Données des additions pour le cours
  const additionExamples = {
    '3_plus_2': { num1: 3, num2: 2, result: 5, difficulty: 'simple' },
    '7_plus_5': { num1: 7, num2: 5, result: 12, difficulty: 'carry' },
    '8_plus_7': { num1: 8, num2: 7, result: 15, difficulty: 'carry' },
    '9_plus_6': { num1: 9, num2: 6, result: 15, difficulty: 'carry' },
    '4_plus_6': { num1: 4, num2: 6, result: 10, difficulty: 'to_ten' }
  };

  // Exercices variés (plus de 15)
  const exercises = [
    // Additions simples
    { question: "Combien font 2 + 3 ?", answer: 5, type: "simple", hint: "Compte sur tes doigts !" },
    { question: "Combien font 4 + 1 ?", answer: 5, type: "simple", hint: "Ajoute 1 à 4 !" },
    { question: "Combien font 3 + 4 ?", answer: 7, type: "simple", hint: "3 puis 4 de plus !" },
    { question: "Combien font 2 + 6 ?", answer: 8, type: "simple", hint: "2 plus 6 égale..." },
    { question: "Combien font 5 + 2 ?", answer: 7, type: "simple", hint: "5 et encore 2 !" },
    
    // Additions avec 10
    { question: "Combien font 10 + 3 ?", answer: 13, type: "with_ten", hint: "10 et 3 de plus !" },
    { question: "Combien font 6 + 10 ?", answer: 16, type: "with_ten", hint: "6 puis ajoute 10 !" },
    { question: "Combien font 10 + 7 ?", answer: 17, type: "with_ten", hint: "Une dizaine et 7 unités !" },
    
    // Additions avec retenue
    { question: "Combien font 7 + 4 ?", answer: 11, type: "carry", hint: "7 + 3 = 10, puis + 1 !" },
    { question: "Combien font 8 + 5 ?", answer: 13, type: "carry", hint: "8 + 2 = 10, puis + 3 !" },
    { question: "Combien font 9 + 3 ?", answer: 12, type: "carry", hint: "9 + 1 = 10, puis + 2 !" },
    { question: "Combien font 6 + 7 ?", answer: 13, type: "carry", hint: "6 + 4 = 10, puis + 3 !" },
    { question: "Combien font 9 + 8 ?", answer: 17, type: "carry", hint: "9 + 1 = 10, puis + 7 !" },
    
    // Compléments
    { question: "Que faut-il ajouter à 8 pour faire 10 ?", answer: 2, type: "complement", hint: "8 + ? = 10" },
    { question: "Que faut-il ajouter à 6 pour faire 15 ?", answer: 9, type: "complement", hint: "6 + ? = 15" },
    { question: "Que faut-il ajouter à 12 pour faire 20 ?", answer: 8, type: "complement", hint: "12 + ? = 20" },
    
    // Doubles
    { question: "Combien font 6 + 6 ?", answer: 12, type: "double", hint: "Le double de 6 !" },
    { question: "Combien font 8 + 8 ?", answer: 16, type: "double", hint: "Le double de 8 !" },
    { question: "Combien font 9 + 9 ?", answer: 18, type: "double", hint: "Le double de 9 !" },
    
    // Problèmes contextuels
    { question: "Julie a 7 billes, Tom lui en donne 6. Combien Julie a-t-elle de billes maintenant ?", answer: 13, type: "problem", hint: "7 + 6 = ?" },
    { question: "Dans un panier, il y a 8 pommes rouges et 4 pommes vertes. Combien y a-t-il de pommes en tout ?", answer: 12, type: "problem", hint: "8 + 4 = ?" }
  ];

  // Fonction principale d'explication du cours
  const explainAdditions = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      
      await playAudioSequence("Salut ! Aujourd'hui, nous allons apprendre les additions jusqu'à 20 !", 1.1);
      await wait(800);
      
      setHighlightedElement('title');
      await playAudioSequence("Regarde bien, nous allons découvrir plein d'astuces pour additionner facilement !", 1.1);
      await wait(800);
      
      // Animation 3 + 2
      setHighlightedElement('addition_examples');
      setSelectedAddition('3_plus_2');
      await playAudioSequence("Commençons par une addition simple : 3 plus 2 !", 1.1);
      await wait(500);
      
      // Animation des objets pour 3 + 2
      setAnimationStep(1);
      setShowObjects({ group1: 3, group2: 0, result: 0 });
      await playAudioSequence("Voici 3 objets bleus...", 1.1);
      await wait(1000);
      
      setAnimationStep(2);
      setShowObjects({ group1: 3, group2: 2, result: 0 });
      await playAudioSequence("Maintenant, j'ajoute 2 objets rouges...", 1.1);
      await wait(1000);
      
      setAnimationStep(3);
      setShowObjects({ group1: 3, group2: 2, result: 5 });
      await playAudioSequence("En tout, cela fait 5 objets ! 3 plus 2 égale 5 !", 1.1);
      await wait(1500);
      
      // Addition avec passage à la dizaine
      setSelectedAddition('7_plus_5');
      setAnimationStep(0);
      setShowObjects({ group1: 0, group2: 0, result: 0 });
      await wait(500);
      
      await playAudioSequence("Maintenant, essayons quelque chose de plus difficile : 7 plus 5 !", 1.1);
      await wait(500);
      
      setAnimationStep(1);
      setShowObjects({ group1: 7, group2: 0, result: 0 });
      await playAudioSequence("Voici 7 objets...", 1.1);
      await wait(800);
      
      setAnimationStep(2);
      setShowObjects({ group1: 7, group2: 5, result: 0 });
      await playAudioSequence("J'ajoute 5 objets...", 1.1);
      await wait(800);
      
      setShowStrategy('complement_10');
      await playAudioSequence("Astuce ! Je peux d'abord compléter à 10 : 7 plus 3 égale 10...", 1.1);
      await wait(1000);
      
      setShowCarryOver(true);
      await playAudioSequence("Puis j'ajoute les 2 qui restent : 10 plus 2 égale 12 !", 1.1);
      await wait(1000);
      
      setAnimationStep(3);
      setShowObjects({ group1: 7, group2: 5, result: 12 });
      await playAudioSequence("Donc 7 plus 5 égale 12 ! C'est magique, non ?", 1.1);
      await wait(1500);
      
      // Expliquer les stratégies
      setHighlightedElement('strategies');
      await playAudioSequence("Il existe plusieurs stratégies pour additionner facilement !", 1.1);
      await wait(500);
      
      setShowStrategy('doubles');
      await playAudioSequence("Les doubles sont faciles : 6 plus 6 égale 12, 8 plus 8 égale 16 !", 1.1);
      await wait(1500);
      
      setShowStrategy('complement_10');
      await playAudioSequence("Pour passer à la dizaine, complète d'abord à 10, puis ajoute le reste !", 1.1);
      await wait(1500);
      
      setShowStrategy('counting');
      await playAudioSequence("Tu peux aussi compter sur tes doigts ou dans ta tête !", 1.1);
      await wait(1500);
      
      // Encouragement à passer aux exercices
      setHighlightedElement('exercise_tab');
      await playAudioSequence("Maintenant, clique sur l'onglet Exercices pour t'entraîner ! Tu vas devenir un champion des additions !", 1.1);
      
      setHighlightedElement(null);
      setAnimationStep(0);
      setShowStrategy(null);
      setShowCarryOver(false);
      
    } catch (error) {
      console.error('Erreur dans explainAdditions:', error);
    }
  };

  // Fonction d'explication des exercices
  const explainExercisesOnce = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      setExerciseInstructionGiven(true);
      exerciseInstructionGivenRef.current = true;
      
      await playAudioSequence("Super ! Tu es dans les exercices d'additions jusqu'à 20 !", 1.0);
      await wait(800);
      
      await playAudioSequence("Tu vas résoudre différents types d'additions : des simples, des doubles, des additions avec retenue, et même des petits problèmes !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Pour chaque exercice, lis bien la question, réfléchis, puis tape ta réponse. N'hésite pas à utiliser les astuces qu'on a vues dans le cours !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Si tu te trompes, ce n'est pas grave ! Je te donnerai un indice pour t'aider. Allez, c'est parti pour devenir un as des additions !", 1.0);
      
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

  // Rendu des objets pour les animations
  const renderObjects = (count: number, color: string) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`w-8 h-8 rounded-full ${color} border-2 border-white shadow-md animate-bounce`}
        style={{ animationDelay: `${i * 100}ms` }}
      />
    ));
  };

  // Styles CSS intégrés
  const styles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
      50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .float { animation: float 3s ease-in-out infinite; }
    .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .shake { animation: shake 0.5s ease-in-out infinite; }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux additions simples</span>
          </button>
          
          <h1 
            className={`text-3xl font-bold text-center text-purple-800 ${
              highlightedElement === 'title' ? 'pulse-glow bg-yellow-200 px-4 py-2 rounded-lg' : ''
            }`}
          >
            🧮 Additions jusqu'à 20
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
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 hover:bg-purple-50'
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
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-purple-600 hover:bg-purple-50'
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
                    explainAdditions();
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg animate-bounce"
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
              <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
                ✨ Découvre les additions magiques !
              </h2>
              
              <div className="text-center text-gray-700 space-y-2">
                <p>🎯 Apprends à additionner jusqu'à 20</p>
                <p>🧠 Découvre des astuces géniales</p>
                <p>🏆 Deviens un champion des maths !</p>
              </div>
            </div>

            {/* Section exemples d'additions */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'addition_examples' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">
                🔢 Exemples d'additions
              </h3>
              
              {/* Sélecteur d'addition */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(additionExamples).map(([key, example]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAddition(key as AdditionKey)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedAddition === key
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-lg font-bold">
                      {example.num1} + {example.num2}
                    </div>
                    <div className="text-sm text-gray-600">
                      = {example.result}
                    </div>
                  </button>
                ))}
              </div>

              {/* Zone d'animation */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 min-h-64">
                <div className="text-center mb-4">
                  <h4 className="text-2xl font-bold text-purple-800">
                    {additionExamples[selectedAddition].num1} + {additionExamples[selectedAddition].num2} = ?
                  </h4>
                </div>
                
                <div className="flex justify-center items-center space-x-8">
                  {/* Groupe 1 */}
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-semibold mb-2 text-blue-700">
                      Premier nombre: {additionExamples[selectedAddition].num1}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {renderObjects(showObjects.group1, 'bg-blue-400')}
                    </div>
                  </div>
                  
                  {/* Signe + */}
                  <div className="text-4xl font-bold text-purple-600 animate-pulse">+</div>
                  
                  {/* Groupe 2 */}
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-semibold mb-2 text-red-700">
                      Deuxième nombre: {additionExamples[selectedAddition].num2}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {renderObjects(showObjects.group2, 'bg-red-400')}
                    </div>
                  </div>
                  
                  {/* Signe = */}
                  <div className="text-4xl font-bold text-purple-600">=</div>
                  
                  {/* Résultat */}
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-semibold mb-2 text-green-700">
                      Résultat: {showObjects.result > 0 ? additionExamples[selectedAddition].result : '?'}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {renderObjects(showObjects.result, 'bg-green-400')}
                    </div>
                  </div>
                </div>
                
                {/* Affichage des stratégies */}
                {showStrategy === 'complement_10' && (
                  <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
                    <h5 className="font-bold text-orange-800 mb-2">🎯 Stratégie : Complément à 10</h5>
                    <p className="text-orange-700">
                      Pour 7 + 5 : Je prends 3 de 5 pour faire 7 + 3 = 10, puis j'ajoute les 2 qui restent !
                    </p>
                    {showCarryOver && (
                      <div className="mt-2 p-2 bg-orange-100 rounded">
                        <span className="font-semibold">10 + 2 = 12 !</span>
                      </div>
                    )}
                  </div>
                )}
                
                {showStrategy === 'doubles' && (
                  <div className="mt-6 p-4 bg-pink-100 rounded-lg">
                    <h5 className="font-bold text-pink-800 mb-2">✨ Stratégie : Les doubles</h5>
                    <p className="text-pink-700">
                      Les doubles sont super faciles ! 6 + 6 = 12, 8 + 8 = 16, 9 + 9 = 18 !
                    </p>
                  </div>
                )}
                
                {showStrategy === 'counting' && (
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <h5 className="font-bold text-green-800 mb-2">👆 Stratégie : Compter</h5>
                    <p className="text-green-700">
                      Tu peux compter sur tes doigts ou dans ta tête en partant du plus grand nombre !
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section stratégies */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'strategies' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">
                🧠 Stratégies d'addition
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-bold text-blue-800">Complément à 10</h4>
                  <p className="text-sm text-blue-600">Passe d'abord par 10 !</p>
                </div>
                
                <div className="p-4 bg-pink-50 rounded-lg text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-bold text-pink-800">Les doubles</h4>
                  <p className="text-sm text-pink-600">Faciles à retenir !</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl mb-2">👆</div>
                  <h4 className="font-bold text-green-800">Compter</h4>
                  <p className="text-sm text-green-600">Sur les doigts ou dans sa tête !</p>
                </div>
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
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg animate-bounce"
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
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">
                      Félicitations ! 🎉
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Tu as terminé tous les exercices !
                    </p>
                    <p className="text-lg font-semibold text-purple-600 mb-6">
                      Score : {finalScore} / {exercises.length}
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={resetExercises}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
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
                  <div className="text-sm text-purple-600 font-semibold">
                    Score : {score} / {exercises.length}
                  </div>
                </div>

                <div className="text-center space-y-6">
                  <h3 className="text-xl font-bold text-purple-800">
                    {exercises[currentExercise].question}
                  </h3>
                  
                  {/* Badge du type d'exercice */}
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      exercises[currentExercise].type === 'simple' ? 'bg-green-100 text-green-800' :
                      exercises[currentExercise].type === 'carry' ? 'bg-orange-100 text-orange-800' :
                      exercises[currentExercise].type === 'double' ? 'bg-pink-100 text-pink-800' :
                      exercises[currentExercise].type === 'complement' ? 'bg-blue-100 text-blue-800' :
                      exercises[currentExercise].type === 'with_ten' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exercises[currentExercise].type === 'simple' ? '🟢 Simple' :
                       exercises[currentExercise].type === 'carry' ? '🟠 Avec retenue' :
                       exercises[currentExercise].type === 'double' ? '💖 Double' :
                       exercises[currentExercise].type === 'complement' ? '🔵 Complément' :
                       exercises[currentExercise].type === 'with_ten' ? '🟣 Avec 10' :
                       '📝 Problème'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-32 p-3 text-center text-xl border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="?"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    
                    <div>
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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