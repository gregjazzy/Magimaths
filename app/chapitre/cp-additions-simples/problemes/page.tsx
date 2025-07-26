'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star, Trophy, Target, Play } from 'lucide-react';

// Types pour la sécurité TypeScript
type SituationType = 'bonbons' | 'jouets' | 'animaux' | 'fruits' | 'ecole';

export default function ProblemesAddition() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // États pour les animations du cours
  const [selectedSituation, setSelectedSituation] = useState<SituationType>('bonbons');
  const [animationStep, setAnimationStep] = useState(0);
  const [showObjects, setShowObjects] = useState({ group1: 0, group2: 0, result: 0 });
  const [showSolution, setShowSolution] = useState(false);
  
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

  // Situations de problèmes pour le cours
  const problemSituations = {
    bonbons: {
      story: "Julie a 3 bonbons rouges. Sa maman lui donne 4 bonbons bleus. Combien Julie a-t-elle de bonbons en tout ?",
      item: '🍬',
      group1: 3,
      group2: 4,
      result: 7,
      color1: 'bg-red-400',
      color2: 'bg-blue-400',
      keywords: ['a', 'donne', 'en tout']
    },
    jouets: {
      story: "Tom joue avec 5 petites voitures. Papa lui apporte 3 voitures de plus. Combien Tom a-t-il de voitures maintenant ?",
      item: '🚗',
      group1: 5,
      group2: 3,
      result: 8,
      color1: 'bg-yellow-400',
      color2: 'bg-green-400',
      keywords: ['joue avec', 'apporte', 'maintenant']
    },
    animaux: {
      story: "Dans le jardin, il y a 2 chats qui dorment. 6 chats arrivent en courant. Combien y a-t-il de chats en tout ?",
      item: '🐱',
      group1: 2,
      group2: 6,
      result: 8,
      color1: 'bg-orange-400',
      color2: 'bg-purple-400',
      keywords: ['il y a', 'arrivent', 'en tout']
    },
    fruits: {
      story: "Maman met 4 pommes dans le panier. Puis elle ajoute 5 pommes de plus. Combien de pommes sont dans le panier ?",
      item: '🍎',
      group1: 4,
      group2: 5,
      result: 9,
      color1: 'bg-red-400',
      color2: 'bg-pink-400',
      keywords: ['met', 'ajoute', 'dans le panier']
    },
    ecole: {
      story: "Dans la classe, il y a 7 filles assises. 4 garçons entrent dans la classe. Combien d'élèves y a-t-il maintenant ?",
      item: '👶',
      group1: 7,
      group2: 4,
      result: 11,
      color1: 'bg-pink-400',
      color2: 'bg-blue-400',
      keywords: ['il y a', 'entrent', 'maintenant']
    }
  };

  // Exercices variés (15 problèmes)
  const exercises = [
    {
      story: "Léa a 3 crayons rouges et 2 crayons bleus. Combien a-t-elle de crayons en tout ?",
      answer: 5,
      hint: "3 + 2 = ?",
      visual: "✏️"
    },
    {
      story: "Sur la table, il y a 4 assiettes. Maman ajoute 3 assiettes. Combien y a-t-il d'assiettes maintenant ?",
      answer: 7,
      hint: "4 + 3 = ?",
      visual: "🍽️"
    },
    {
      story: "Paul collectionne les billes. Il en a 6 dans sa poche et trouve 4 billes par terre. Combien a-t-il de billes en tout ?",
      answer: 10,
      hint: "6 + 4 = ?",
      visual: "⚪"
    },
    {
      story: "Dans le vase, il y a 5 fleurs jaunes. Papa y met 3 fleurs roses. Combien de fleurs y a-t-il dans le vase ?",
      answer: 8,
      hint: "5 + 3 = ?",
      visual: "🌸"
    },
    {
      story: "Marie dessine 2 étoiles sur sa feuille. Puis elle dessine 7 étoiles de plus. Combien d'étoiles a-t-elle dessinées ?",
      answer: 9,
      hint: "2 + 7 = ?",
      visual: "⭐"
    },
    {
      story: "Dans la cour, 8 enfants jouent au ballon. 3 autres enfants arrivent. Combien d'enfants jouent maintenant ?",
      answer: 11,
      hint: "8 + 3 = ?",
      visual: "⚽"
    },
    {
      story: "Grand-mère a préparé 5 gâteaux le matin et 6 gâteaux l'après-midi. Combien de gâteaux a-t-elle préparés ?",
      answer: 11,
      hint: "5 + 6 = ?",
      visual: "🧁"
    },
    {
      story: "Dans l'aquarium, nagent 4 poissons rouges et 5 poissons bleus. Combien de poissons y a-t-il dans l'aquarium ?",
      answer: 9,
      hint: "4 + 5 = ?",
      visual: "🐠"
    },
    {
      story: "Lucas a 7 cartes Pokemon. Son ami lui en donne 4. Combien Lucas a-t-il de cartes maintenant ?",
      answer: 11,
      hint: "7 + 4 = ?",
      visual: "🃏"
    },
    {
      story: "Sur l'arbre, il y a 6 oiseaux qui chantent. 2 oiseaux viennent se poser. Combien d'oiseaux y a-t-il sur l'arbre ?",
      answer: 8,
      hint: "6 + 2 = ?",
      visual: "🐦"
    },
    {
      story: "Emma range 3 livres sur l'étagère du haut et 8 livres sur l'étagère du bas. Combien de livres a-t-elle rangés ?",
      answer: 11,
      hint: "3 + 8 = ?",
      visual: "📚"
    },
    {
      story: "Dans le parc, 9 canards nagent dans l'étang. 2 canards arrivent en volant. Combien de canards sont dans l'étang ?",
      answer: 11,
      hint: "9 + 2 = ?",
      visual: "🦆"
    },
    {
      story: "Théo compte 5 papillons dans le jardin. Puis il voit 4 papillons de plus. Combien de papillons a-t-il vus en tout ?",
      answer: 9,
      hint: "5 + 4 = ?",
      visual: "🦋"
    },
    {
      story: "Maman achète 6 bananes et 3 oranges. Combien de fruits a-t-elle achetés ?",
      answer: 9,
      hint: "6 + 3 = ?",
      visual: "🍌"
    },
    {
      story: "Dans la boîte, il y a 8 perles bleues et 4 perles vertes. Combien de perles y a-t-il dans la boîte ?",
      answer: 12,
      hint: "8 + 4 = ?",
      visual: "💎"
    }
  ];

  // Fonction principale d'explication du cours
  const explainProblems = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      
      await playAudioSequence("Salut ! Aujourd'hui, nous allons apprendre à résoudre des problèmes d'addition !", 1.1);
      await wait(800);
      
      setHighlightedElement('title');
      await playAudioSequence("Dans la vie de tous les jours, nous rencontrons souvent des situations où nous devons additionner !", 1.1);
      await wait(800);
      
      // Expliquer la méthode
      setHighlightedElement('methode');
      await playAudioSequence("Pour résoudre un problème, il faut suivre 3 étapes importantes !", 1.1);
      await wait(500);
      
      await playAudioSequence("Étape 1 : Lire le problème attentivement et chercher les mots-clés !", 1.1);
      await wait(1000);
      
      await playAudioSequence("Étape 2 : Identifier les nombres et l'opération à faire !", 1.1);
      await wait(1000);
      
      await playAudioSequence("Étape 3 : Calculer la réponse et vérifier si elle a du sens !", 1.1);
      await wait(1500);
      
      // Démonstration avec un exemple
      setSelectedSituation('bonbons');
      setHighlightedElement('situation');
      await playAudioSequence("Regardons ensemble ce problème avec Julie et ses bonbons !", 1.1);
      await wait(800);
      
      await demonstrateProblem();
      
      setHighlightedElement('exercise_tab');
      await playAudioSequence("Maintenant, clique sur l'onglet Exercices pour t'entraîner à résoudre plein de problèmes différents !", 1.1);
      
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainProblems:', error);
    }
  };

  // Démonstration d'un problème étape par étape
  const demonstrateProblem = async () => {
    const situation = problemSituations[selectedSituation];
    
    try {
      setAnimationStep(0);
      setShowObjects({ group1: 0, group2: 0, result: 0 });
      setShowSolution(false);
      
      // Lire le problème
      setAnimationStep(1);
      await playAudioSequence(situation.story, 1.0);
      await wait(1000);
      
      // Identifier les mots-clés
      setAnimationStep(2);
      await playAudioSequence("Je repère les mots-clés qui m'indiquent qu'il faut additionner !", 1.1);
      await wait(1000);
      
      // Montrer le premier groupe
      setAnimationStep(3);
      setShowObjects({ group1: situation.group1, group2: 0, result: 0 });
      await playAudioSequence(`D'abord, Julie a ${situation.group1} bonbons !`, 1.1);
      await wait(1000);
      
      // Montrer le deuxième groupe
      setAnimationStep(4);
      setShowObjects({ group1: situation.group1, group2: situation.group2, result: 0 });
      await playAudioSequence(`Ensuite, maman lui donne ${situation.group2} bonbons de plus !`, 1.1);
      await wait(1000);
      
      // Montrer la solution
      setAnimationStep(5);
      setShowObjects({ group1: situation.group1, group2: situation.group2, result: situation.result });
      setShowSolution(true);
      await playAudioSequence(`En tout, ${situation.group1} plus ${situation.group2} égale ${situation.result} bonbons !`, 1.1);
      await wait(1500);
      
      await playAudioSequence("C'est exactement comme ça qu'on résout un problème d'addition !", 1.1);
      
    } catch (error) {
      console.error('Erreur dans demonstrateProblem:', error);
    }
  };

  // Fonction d'explication des exercices
  const explainExercisesOnce = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      setExerciseInstructionGiven(true);
      exerciseInstructionGivenRef.current = true;
      
      await playAudioSequence("Super ! Tu es dans les exercices de problèmes d'addition !", 1.0);
      await wait(800);
      
      await playAudioSequence("Tu vas résoudre 15 problèmes différents de la vie quotidienne !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Pour chaque problème : lis bien l'histoire, trouve les nombres à additionner, puis écris ta réponse !", 1.0);
      await wait(1000);
      
      await playAudioSequence("N'oublie pas de suivre les 3 étapes qu'on a vues dans le cours ! Allez, c'est parti pour devenir un expert des problèmes !", 1.0);
      
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
      speakText("Bravo ! C'est la bonne réponse !");
      
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
  const renderObjects = (count: number, color: string, item: string) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`w-12 h-12 rounded-lg ${color} border-2 border-white shadow-md animate-bounce flex items-center justify-center text-2xl`}
        style={{ animationDelay: `${i * 100}ms` }}
      >
        {item}
      </div>
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
    .float { animation: float 3s ease-in-out infinite; }
    .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux additions simples</span>
          </button>
          
          <h1 
            className={`text-3xl font-bold text-center text-orange-800 ${
              highlightedElement === 'title' ? 'pulse-glow bg-yellow-200 px-4 py-2 rounded-lg' : ''
            }`}
          >
            🧩 Problèmes d'addition
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
                    explainProblems();
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg animate-bounce"
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
                ✨ Résoudre des problèmes comme un champion !
              </h2>
              
              <div className="text-center text-gray-700 space-y-2">
                <p>🔍 Apprends à bien lire un problème</p>
                <p>🧠 Trouve les nombres à additionner</p>
                <p>🎯 Calcule la bonne réponse !</p>
              </div>
            </div>

            {/* Méthode de résolution */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'methode' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-orange-800 mb-4 text-center">
                🎯 Les 3 étapes pour résoudre un problème
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">📖</div>
                  <h4 className="font-bold text-blue-800">Étape 1</h4>
                  <p className="text-sm text-blue-600">Lire et chercher les mots-clés</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">🔢</div>
                  <h4 className="font-bold text-green-800">Étape 2</h4>
                  <p className="text-sm text-green-600">Identifier les nombres</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <h4 className="font-bold text-purple-800">Étape 3</h4>
                  <p className="text-sm text-purple-600">Calculer et vérifier</p>
                </div>
              </div>
            </div>

            {/* Exemple de problème */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'situation' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-orange-800 mb-4 text-center">
                📝 Exemple : Le problème de Julie
              </h3>
              
              {/* Sélecteur de situation */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(problemSituations).map(([key, situation]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSituation(key as SituationType)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedSituation === key
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{situation.item}</div>
                    <div className="text-sm text-gray-600">
                      {key === 'bonbons' ? 'Bonbons' :
                       key === 'jouets' ? 'Jouets' :
                       key === 'animaux' ? 'Animaux' :
                       key === 'fruits' ? 'Fruits' : 'École'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Zone d'animation du problème */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 min-h-64">
                <div className="text-center mb-6">
                  <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <p className="text-lg text-gray-800 leading-relaxed">
                      {problemSituations[selectedSituation].story}
                    </p>
                  </div>
                </div>
                
                {animationStep >= 3 && (
                  <div className="flex justify-center items-center space-x-8 mb-6">
                    {/* Premier groupe */}
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-semibold mb-2 text-orange-700">
                        Premier groupe
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {renderObjects(showObjects.group1, problemSituations[selectedSituation].color1, problemSituations[selectedSituation].item)}
                      </div>
                      <div className="text-xl font-bold text-orange-800 mt-2">
                        {showObjects.group1}
                      </div>
                    </div>
                    
                    {/* Signe + */}
                    {animationStep >= 4 && (
                      <div className="text-4xl font-bold text-orange-600 animate-pulse">+</div>
                    )}
                    
                    {/* Deuxième groupe */}
                    {animationStep >= 4 && (
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold mb-2 text-red-700">
                          Deuxième groupe
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {renderObjects(showObjects.group2, problemSituations[selectedSituation].color2, problemSituations[selectedSituation].item)}
                        </div>
                        <div className="text-xl font-bold text-red-800 mt-2">
                          {showObjects.group2}
                        </div>
                      </div>
                    )}
                    
                    {/* Signe = et résultat */}
                    {showSolution && (
                      <>
                        <div className="text-4xl font-bold text-orange-600">=</div>
                        <div className="flex flex-col items-center">
                          <div className="text-lg font-semibold mb-2 text-green-700">
                            En tout
                          </div>
                          <div className="text-4xl font-bold text-green-800 bg-green-100 px-4 py-2 rounded-lg animate-pulse">
                            {showObjects.result}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {showSolution && (
                  <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-lg">
                      <h4 className="font-bold text-green-800 mb-2">✅ Solution</h4>
                      <p className="text-green-700 text-lg">
                        {problemSituations[selectedSituation].group1} + {problemSituations[selectedSituation].group2} = {problemSituations[selectedSituation].result}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center mt-4">
                <button
                  onClick={demonstrateProblem}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  🔄 Voir la démonstration
                </button>
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
                      Tu as terminé tous les problèmes d'addition !
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
                    Problème {currentExercise + 1} / {exercises.length}
                  </div>
                  <div className="text-sm text-orange-600 font-semibold">
                    Score : {score} / {exercises.length}
                  </div>
                </div>

                <div className="text-center space-y-6">
                  {/* Icône visuelle */}
                  <div className="text-6xl mb-4">
                    {exercises[currentExercise].visual}
                  </div>
                  
                  {/* Énoncé du problème */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg text-gray-800 leading-relaxed">
                      {exercises[currentExercise].story}
                    </h3>
                  </div>

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