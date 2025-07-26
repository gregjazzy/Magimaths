'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star, Trophy, Target, Play, Lightbulb, BookOpen, Search, Calculator } from 'lucide-react';

// Types pour la sécurité TypeScript
type ProblemeType = 'jouets' | 'bonbons' | 'argent' | 'temps' | 'animaux';

export default function ProblemesSoustraction() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // États pour les animations du cours
  const [selectedProbleme, setSelectedProbleme] = useState<ProblemeType>('jouets');
  const [currentStep, setCurrentStep] = useState(0);
  const [showMethod, setShowMethod] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showSolution, setShowSolution] = useState<any>(null);
  
  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
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

  const playAudioSequence = (text: string, rate: number = 1.0): Promise<void> => {
    return new Promise((resolve) => {
      if (shouldStopRef.current) {
        resolve();
        return;
      }
      if (!userHasInteractedRef.current) {
        resolve();
        return;
      }
      
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = 'fr-FR';
      
      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = () => {
        resolve();
      };
      
      speechSynthesis.speak(utterance);
    });
  };

  const stopVocal = () => {
    shouldStopRef.current = true;
    speechSynthesis.cancel();
    // Triple sécurité
    setTimeout(() => speechSynthesis.cancel(), 10);
    setTimeout(() => speechSynthesis.cancel(), 50);
    setTimeout(() => speechSynthesis.cancel(), 100);
  };

  // Exemples de problèmes par catégorie
  const problemExamples = {
    jouets: {
      situation: "Tom a 15 petites voitures. Il en donne 7 à son frère Lucas.",
      question: "Combien de voitures lui reste-t-il ?",
      donnees: { total: 15, enleve: 7, reste: 8 },
      illustration: "🚗🚗🚗🚗🚗🚗🚗🚗 ❌ → 🚗🚗🚗🚗🚗🚗🚗🚗",
      methode: ["Je lis : Tom a 15 voitures, il en donne 7", "Je comprends : il faut enlever 7 de 15", "Je calcule : 15 - 7 = 8"]
    },
    bonbons: {
      situation: "Sarah a un paquet de 20 bonbons. Elle en mange 6 après le déjeuner.",
      question: "Combien de bonbons restent dans le paquet ?",
      donnees: { total: 20, enleve: 6, reste: 14 },
      illustration: "🍬🍬🍬🍬🍬🍬 ❌ → 🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬🍬",
      methode: ["Je lis : Sarah a 20 bonbons, elle en mange 6", "Je comprends : il faut soustraire 6 de 20", "Je calcule : 20 - 6 = 14"]
    },
    argent: {
      situation: "Papa a 10 euros dans son porte-monnaie. Il achète du pain qui coûte 3 euros.",
      question: "Combien d'argent lui reste-t-il ?",
      donnees: { total: 10, enleve: 3, reste: 7 },
      illustration: "💰💰💰💰💰💰💰💰💰💰 → 💰💰💰 ❌ → 💰💰💰💰💰💰💰",
      methode: ["Je lis : Papa a 10 euros, il dépense 3 euros", "Je comprends : il faut enlever 3 de 10", "Je calcule : 10 - 3 = 7"]
    },
    temps: {
      situation: "Julie regarde un film de 18 minutes. Elle a déjà regardé 12 minutes.",
      question: "Combien de minutes de film reste-t-il ?",
      donnees: { total: 18, enleve: 12, reste: 6 },
      illustration: "⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰⏰ ✅ → ⏰⏰⏰⏰⏰⏰ ❓",
      methode: ["Je lis : Film de 18 min, déjà vu 12 min", "Je comprends : il faut enlever 12 de 18", "Je calcule : 18 - 12 = 6"]
    },
    animaux: {
      situation: "Dans la ferme, il y a 16 poules. Le fermier en vend 9 au marché.",
      question: "Combien de poules restent à la ferme ?",
      donnees: { total: 16, enleve: 9, reste: 7 },
      illustration: "🐔🐔🐔🐔🐔🐔🐔🐔🐔 ❌ → 🐔🐔🐔🐔🐔🐔🐔",
      methode: ["Je lis : 16 poules, le fermier en vend 9", "Je comprends : il faut soustraire 9 de 16", "Je calcule : 16 - 9 = 7"]
    }
  };

  // Exercices variés (20 exercices)
  const exercises = [
    // Problèmes avec jouets
    { question: "Alex a 12 billes. Il en perd 4 dans la cour. Combien lui en reste-t-il ?", answer: 8, type: "jouets", hint: "12 - 4 = ?" },
    { question: "Emma collectionne 18 poupées. Elle en offre 5 à sa cousine. Combien garde-t-elle ?", answer: 13, type: "jouets", hint: "18 - 5 = ?" },
    { question: "Paul a 14 cartes Pokémon. Il en échange 8 avec son ami. Combien lui reste-t-il ?", answer: 6, type: "jouets", hint: "14 - 8 = ?" },
    
    // Problèmes avec nourriture
    { question: "Maman a acheté 15 pommes. La famille en mange 7. Combien en reste-t-il ?", answer: 8, type: "bonbons", hint: "15 - 7 = ?" },
    { question: "Grand-mère a fait 20 cookies. Les enfants en mangent 12. Combien en reste-t-il ?", answer: 8, type: "bonbons", hint: "20 - 12 = ?" },
    { question: "Dans le frigo, il y a 17 yaourts. Papa en mange 6. Combien en reste-t-il ?", answer: 11, type: "bonbons", hint: "17 - 6 = ?" },
    
    // Problèmes avec argent
    { question: "Lisa a 8 euros. Elle achète un livre à 3 euros. Combien lui reste-t-il ?", answer: 5, type: "argent", hint: "8 - 3 = ?" },
    { question: "Julien a 12 euros d'argent de poche. Il dépense 5 euros. Combien lui reste-t-il ?", answer: 7, type: "argent", hint: "12 - 5 = ?" },
    { question: "Sophie économise 20 euros. Elle achète un jeu à 9 euros. Combien lui reste-t-il ?", answer: 11, type: "argent", hint: "20 - 9 = ?" },
    
    // Problèmes avec temps
    { question: "Un match dure 16 minutes. Il s'est écoulé 9 minutes. Combien de temps reste-t-il ?", answer: 7, type: "temps", hint: "16 - 9 = ?" },
    { question: "La récréation dure 15 minutes. Les enfants ont joué 8 minutes. Combien reste-t-il ?", answer: 7, type: "temps", hint: "15 - 8 = ?" },
    { question: "Un dessin animé dure 22 minutes. Marie en a vu 14. Combien reste-t-il ?", answer: 8, type: "temps", hint: "22 - 14 = ?" },
    
    // Problèmes avec animaux
    { question: "À l'étang, il y a 13 canards. 6 s'envolent. Combien en reste-t-il ?", answer: 7, type: "animaux", hint: "13 - 6 = ?" },
    { question: "Le zoo a 19 singes. 8 sont dans l'enclos des bébés. Combien dans l'autre ?", answer: 11, type: "animaux", hint: "19 - 8 = ?" },
    { question: "Dans l'aquarium, il y a 16 poissons. 7 se cachent. Combien sont visibles ?", answer: 9, type: "animaux", hint: "16 - 7 = ?" },
    
    // Problèmes plus complexes
    { question: "Laura a 23 autocollants. Elle en colle 15 dans son album. Combien lui en reste-t-il ?", answer: 8, type: "jouets", hint: "23 - 15 = ?" },
    { question: "Au restaurant, il y avait 25 clients. 17 sont partis. Combien en reste-t-il ?", answer: 8, type: "temps", hint: "25 - 17 = ?" },
    { question: "Tom avait 30 euros. Il achète un jouet à 18 euros. Combien lui reste-t-il ?", answer: 12, type: "argent", hint: "30 - 18 = ?" },
    { question: "Dans le parc, il y a 28 oiseaux. 19 s'envolent. Combien en reste-t-il ?", answer: 9, type: "animaux", hint: "28 - 19 = ?" },
    { question: "Défi final : Sarah a 35 perles. Elle en utilise 27 pour un collier. Combien lui en reste-t-il ?", answer: 8, type: "jouets", hint: "35 - 27 = ?" }
  ];

  // Fonction principale d'explication des problèmes
  const explainProblemes = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      
      await playAudioSequence("Salut ! Aujourd'hui, nous allons résoudre des problèmes de soustraction de la vraie vie !", 1.1);
      await wait(800);
      
      setHighlightedElement('title');
      await playAudioSequence("C'est exactement comme dans ton quotidien : quand tu donnes des jouets, manges des bonbons, ou dépenses de l'argent !", 1.1);
      await wait(800);
      
      // Présenter la méthode en 3 étapes
      setHighlightedElement('method');
      await playAudioSequence("J'ai une méthode magique en 3 étapes pour résoudre tous les problèmes !", 1.1);
      await wait(800);
      
      setShowMethod(true);
      await playAudioSequence("Étape 1 : Je lis attentivement le problème ! Étape 2 : Je comprends ce qu'il faut faire ! Étape 3 : Je calcule la réponse !", 1.1);
      await wait(1500);
      
      // Montrer les types de problèmes
      setHighlightedElement('categories');
      await playAudioSequence("Il y a plein de situations différentes : avec des jouets, des bonbons, de l'argent, du temps et des animaux !", 1.1);
      await wait(1000);
      
      // Démonstration avec un exemple
      setSelectedProbleme('jouets');
      await playAudioSequence("Regardons ensemble un problème avec des jouets !", 1.1);
      await wait(800);
      
      await demonstrateProbleme();
      
      setHighlightedElement('exercise_tab');
      await playAudioSequence("Maintenant, va aux exercices pour résoudre plein de problèmes du quotidien ! Tu vas devenir un expert !", 1.1);
      
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainProblemes:', error);
    }
  };

  // Démonstration d'un problème avec la méthode en 3 étapes
  const demonstrateProbleme = async () => {
    const probleme = problemExamples[selectedProbleme];
    
    try {
      setCurrentStep(0);
      setAnimationPhase(0);
      setShowSolution(null);
      
      // Étape 1 : Lire
      setCurrentStep(1);
      setAnimationPhase(1);
      await playAudioSequence("Étape 1 : Je lis ! " + probleme.situation + " " + probleme.question, 1.1);
      await wait(1000);
      
      // Étape 2 : Comprendre
      setCurrentStep(2);
      setAnimationPhase(2);
      await playAudioSequence("Étape 2 : Je comprends ! " + probleme.methode[1], 1.1);
      await wait(1000);
      
      // Montrer l'illustration
      setAnimationPhase(3);
      await playAudioSequence("Regardons avec les images pour mieux comprendre !", 1.0);
      await wait(1000);
      
      // Étape 3 : Calculer
      setCurrentStep(3);
      setAnimationPhase(4);
      await playAudioSequence("Étape 3 : Je calcule ! " + probleme.methode[2], 1.1);
      await wait(800);
      
      // Montrer la solution
      setShowSolution(probleme.donnees);
      setAnimationPhase(5);
      await playAudioSequence(`La réponse est ${probleme.donnees.reste} ! Cette méthode marche pour tous les problèmes !`, 1.1);
      
    } catch (error) {
      console.error('Erreur dans demonstrateProbleme:', error);
    }
  };

  // Fonction d'explication des exercices
  const explainExercisesOnce = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      setExerciseInstructionGiven(true);
      exerciseInstructionGivenRef.current = true;
      
      await playAudioSequence("Super ! Tu es dans les exercices de problèmes de soustraction !", 1.0);
      await wait(800);
      
      await playAudioSequence("Tu vas résoudre 20 problèmes de la vraie vie : jouets, nourriture, argent, temps et animaux !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Pour chaque problème, utilise la méthode en 3 étapes : lis, comprends, calcule !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Prends ton temps, réfléchis bien et n'hésite pas à demander de l'aide ! Allez, c'est parti !", 1.0);
      
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
      speakText("Bravo ! Tu as bien résolu ce problème !");
      
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
      setShowHint(false);
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
    setShowHint(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'jouets': return '🎲';
      case 'bonbons': return '🍬';
      case 'argent': return '💰';
      case 'temps': return '⏰';
      case 'animaux': return '🐔';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'jouets': return 'bg-blue-100 text-blue-800';
      case 'bonbons': return 'bg-pink-100 text-pink-800';
      case 'argent': return 'bg-green-100 text-green-800';
      case 'temps': return 'bg-purple-100 text-purple-800';
      case 'animaux': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction centralisée de reset des boutons
  const resetButtons = () => {
    console.log('🔄 resetButtons called');
    setExerciseInstructionGiven(false);
    setHasStarted(false);
    exerciseInstructionGivenRef.current = false;
    hasStartedRef.current = false;
  };

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
      0%, 100% { box-shadow: 0 0 5px rgba(79, 70, 229, 0.5); }
      50% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.8); }
    }
    @keyframes slideIn {
      0% { transform: translateX(-20px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes solve {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .float { animation: float 3s ease-in-out infinite; }
    .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .slide-in { animation: slideIn 0.5s ease-out; }
    .solve { animation: solve 1s ease-in-out; }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux soustractions simples</span>
          </button>
          
          <h1 
            className={`text-3xl font-bold text-center text-blue-800 ${
              highlightedElement === 'title' ? 'pulse-glow bg-blue-200 px-4 py-2 rounded-lg' : ''
            }`}
          >
            🧩 Problèmes de soustraction
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
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
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
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
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
                    explainProblemes();
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg animate-bounce solve"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-6 h-6" />
                    <span>🧩 RÉSOUDRE LES PROBLÈMES !</span>
                  </div>
                </button>
              </div>
            )}

            {/* Introduction visuelle */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
                🌟 Les problèmes de la vraie vie !
              </h2>
              
              <div className="text-center text-gray-700 space-y-2">
                <p>📖 Situations du quotidien</p>
                <p>🧠 Méthode magique en 3 étapes</p>
                <p>🏆 Deviens un expert des problèmes !</p>
              </div>
            </div>

            {/* Méthode en 3 étapes */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'method' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                🎯 La méthode magique en 3 étapes
              </h3>
              
              {showMethod && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg slide-in">
                    <div className="text-4xl mb-2">📖</div>
                    <h4 className="font-bold text-green-800">1. JE LIS</h4>
                    <p className="text-sm text-green-600">Attentivement tout le problème</p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg slide-in" style={{ animationDelay: '0.2s' }}>
                    <div className="text-4xl mb-2">🧠</div>
                    <h4 className="font-bold text-yellow-800">2. JE COMPRENDS</h4>
                    <p className="text-sm text-yellow-600">Ce qu'il faut calculer</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg slide-in" style={{ animationDelay: '0.4s' }}>
                    <div className="text-4xl mb-2">🔢</div>
                    <h4 className="font-bold text-purple-800">3. JE CALCULE</h4>
                    <p className="text-sm text-purple-600">Et je trouve la réponse</p>
                  </div>
                </div>
              )}
            </div>

            {/* Types de problèmes */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'categories' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                🎪 Types de problèmes
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <button
                  onClick={() => setSelectedProbleme('jouets')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProbleme === 'jouets'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🎲</div>
                  <h4 className="font-bold text-blue-800">Jouets</h4>
                  <p className="text-xs text-gray-600">Billes, cartes...</p>
                </button>
                
                <button
                  onClick={() => setSelectedProbleme('bonbons')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProbleme === 'bonbons'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🍬</div>
                  <h4 className="font-bold text-blue-800">Nourriture</h4>
                  <p className="text-xs text-gray-600">Bonbons, fruits...</p>
                </button>
                
                <button
                  onClick={() => setSelectedProbleme('argent')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProbleme === 'argent'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">💰</div>
                  <h4 className="font-bold text-blue-800">Argent</h4>
                  <p className="text-xs text-gray-600">Achats, économies...</p>
                </button>
                
                <button
                  onClick={() => setSelectedProbleme('temps')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProbleme === 'temps'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">⏰</div>
                  <h4 className="font-bold text-blue-800">Temps</h4>
                  <p className="text-xs text-gray-600">Minutes, heures...</p>
                </button>
                
                <button
                  onClick={() => setSelectedProbleme('animaux')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProbleme === 'animaux'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🐔</div>
                  <h4 className="font-bold text-blue-800">Animaux</h4>
                  <p className="text-xs text-gray-600">Ferme, zoo...</p>
                </button>
              </div>
            </div>

            {/* Zone de démonstration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-800">
                  Démonstration : {getTypeIcon(selectedProbleme)} {selectedProbleme.charAt(0).toUpperCase() + selectedProbleme.slice(1)}
                </h3>
                
                <button
                  onClick={demonstrateProbleme}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Play className="inline w-4 h-4 mr-2" />
                  Démonstration
                </button>
              </div>

              {/* Zone d'animation */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 min-h-80">
                {/* Problème à résoudre */}
                {animationPhase >= 1 && (
                  <div className="mb-6">
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 slide-in">
                      <h4 className="font-bold text-blue-800 mb-2">📖 Problème :</h4>
                      <p className="text-gray-700">
                        {problemExamples[selectedProbleme].situation}
                      </p>
                      <p className="text-blue-700 font-semibold mt-2">
                        {problemExamples[selectedProbleme].question}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Étapes de résolution */}
                {currentStep >= 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${currentStep >= 1 ? 'bg-green-100' : 'bg-gray-100'} transition-all`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800">1. Je lis</span>
                      </div>
                      {currentStep >= 1 && (
                        <p className="text-sm text-green-700">
                          {problemExamples[selectedProbleme].methode[0]}
                        </p>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-lg ${currentStep >= 2 ? 'bg-yellow-100' : 'bg-gray-100'} transition-all`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Search className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-yellow-800">2. Je comprends</span>
                      </div>
                      {currentStep >= 2 && (
                        <p className="text-sm text-yellow-700">
                          {problemExamples[selectedProbleme].methode[1]}
                        </p>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-lg ${currentStep >= 3 ? 'bg-purple-100' : 'bg-gray-100'} transition-all`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calculator className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-purple-800">3. Je calcule</span>
                      </div>
                      {currentStep >= 3 && (
                        <p className="text-sm text-purple-700">
                          {problemExamples[selectedProbleme].methode[2]}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Illustration visuelle */}
                {animationPhase >= 3 && (
                  <div className="text-center mb-6">
                    <div className="bg-white p-4 rounded-lg">
                      <h5 className="font-bold text-gray-800 mb-2">🎨 Visualisation :</h5>
                      <div className="text-2xl">
                        {problemExamples[selectedProbleme].illustration}
                      </div>
                    </div>
                  </div>
                )}

                {/* Solution finale */}
                {showSolution && (
                  <div className="text-center">
                    <div className="bg-green-100 p-6 rounded-lg solve">
                      <h4 className="text-2xl font-bold text-green-800 mb-2">
                        🎉 Réponse : {showSolution.reste}
                      </h4>
                      <p className="text-green-700">
                        {showSolution.total} - {showSolution.enleve} = {showSolution.reste}
                      </p>
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
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg animate-bounce solve"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-6 h-6" />
                    <span>🔊 INSTRUCTIONS PROBLÈMES !</span>
                  </div>
                </button>
              </div>
            )}

            {/* Modal de fin */}
            {showCompletionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">
                      Félicitations, expert des problèmes ! 🎉
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Tu sais maintenant résoudre tous les problèmes du quotidien !
                    </p>
                    <p className="text-lg font-semibold text-blue-600 mb-6">
                      Score : {finalScore} / {exercises.length}
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={resetExercises}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🔄 Nouveaux problèmes
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
                    Problème {currentExercise + 1} / {exercises.length}
                  </div>
                  <div className="text-sm text-blue-600 font-semibold">
                    Score : {score} / {exercises.length}
                  </div>
                </div>

                <div className="text-center space-y-6">
                  {/* Badge du type de problème */}
                  <div className="flex justify-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getTypeColor(exercises[currentExercise].type)}`}>
                      {getTypeIcon(exercises[currentExercise].type)} {exercises[currentExercise].type.charAt(0).toUpperCase() + exercises[currentExercise].type.slice(1)}
                    </span>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-800 mb-4">📖 Problème à résoudre :</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {exercises[currentExercise].question}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Réponse :
                      </label>
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-32 p-3 text-center text-xl border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="?"
                        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      />
                    </div>
                    
                    <div className="space-x-4">
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        ✓ Vérifier
                      </button>
                      
                      {!showHint && (
                        <button
                          onClick={() => setShowHint(true)}
                          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          <Lightbulb className="inline w-4 h-4 mr-2" />
                          Aide
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hint */}
                  {showHint && (
                    <div className="bg-yellow-100 p-4 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Conseil :</span>
                      </div>
                      <p className="text-yellow-700">{exercises[currentExercise].hint}</p>
                    </div>
                  )}

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-semibold">Parfait ! Problème résolu ! 🎉</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <XCircle className="w-6 h-6" />
                            <span className="font-semibold">Réfléchis encore...</span>
                          </div>
                          <button
                            onClick={nextExercise}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Problème suivant →
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