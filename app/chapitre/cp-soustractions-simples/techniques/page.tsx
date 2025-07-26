'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star, Trophy, Target, Play, Lightbulb, Calculator, Brain } from 'lucide-react';

// Types pour la sécurité TypeScript
type TechniqueType = 'complement' | 'addition' | 'decomposition' | 'proximite' | 'cassage';

export default function TechniquesCalculSoustraction() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  
  // États pour les animations du cours
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueType>('complement');
  const [currentExample, setCurrentExample] = useState('13_minus_9');
  const [animationStep, setAnimationStep] = useState(0);
  const [showSteps, setShowSteps] = useState<string[]>([]);
  const [showCalculation, setShowCalculation] = useState<any>(null);
  
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

  // 🎵 FONCTION VOCALE CENTRALISÉE ULTRA-ROBUSTE
  const playVocal = (text: string, rate: number = 1.2): Promise<void> => {
    return new Promise((resolve) => {
      if (!userHasInteractedRef.current) {
        console.log("🚫 BLOQUÉ : Tentative de vocal sans interaction");
        resolve();
        return;
      }
      if (shouldStopRef.current) {
        console.log("🛑 ARRÊT : Signal d'arrêt détecté");
        resolve();
        return;
      }
      speechSynthesis.cancel();
      setTimeout(() => speechSynthesis.cancel(), 10);
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

  const stopAllVocals = () => {
    console.log("🛑 ARRÊT ULTRA-AGRESSIF de tous les vocaux");
    speechSynthesis.cancel();
    setTimeout(() => speechSynthesis.cancel(), 10);
    setTimeout(() => speechSynthesis.cancel(), 50);
    setTimeout(() => speechSynthesis.cancel(), 100);
    shouldStopRef.current = true;
    setIsPlayingVocal(false);
  };

  const playAudioSequence = playVocal;
  const stopVocal = stopAllVocals;
  };

  // Exemples pour chaque technique
  const techniqueExamples = {
    complement: {
      '13_minus_9': { 
        question: '13 - 9',
        complement: 4,
        steps: ['9 + ? = 13', '9 + 4 = 13', 'Donc 13 - 9 = 4'],
        explanation: 'Je cherche ce qu\'il faut ajouter à 9 pour faire 13'
      },
      '15_minus_7': { 
        question: '15 - 7',
        complement: 8,
        steps: ['7 + ? = 15', '7 + 8 = 15', 'Donc 15 - 7 = 8'],
        explanation: 'Je cherche ce qu\'il faut ajouter à 7 pour faire 15'
      }
    },
    addition: {
      '16_minus_8': { 
        question: '16 - 8',
        addition: '8 + 8 = 16',
        steps: ['8 + ? = 16', '8 + 8 = 16', 'Donc 16 - 8 = 8'],
        explanation: 'Je transforme en addition : 8 plus quoi égale 16 ?'
      },
      '14_minus_6': { 
        question: '14 - 6',
        addition: '6 + 8 = 14',
        steps: ['6 + ? = 14', '6 + 8 = 14', 'Donc 14 - 6 = 8'],
        explanation: 'Je transforme en addition : 6 plus quoi égale 14 ?'
      }
    },
    decomposition: {
      '12_minus_7': { 
        question: '12 - 7',
        decompose: '7 = 2 + 5',
        steps: ['12 - 7', '12 - 2 - 5', '10 - 5 = 5'],
        explanation: 'Je décompose 7 en 2 + 5 pour passer par 10'
      },
      '15_minus_8': { 
        question: '15 - 8',
        decompose: '8 = 5 + 3',
        steps: ['15 - 8', '15 - 5 - 3', '10 - 3 = 7'],
        explanation: 'Je décompose 8 en 5 + 3 pour passer par 10'
      }
    },
    proximite: {
      '17_minus_9': { 
        question: '17 - 9',
        proche: '17 - 10 = 7',
        steps: ['17 - 9', '17 - 10 + 1', '7 + 1 = 8'],
        explanation: '9 est proche de 10, je calcule avec 10 puis j\'ajuste'
      },
      '23_minus_19': { 
        question: '23 - 19',
        proche: '23 - 20 = 3',
        steps: ['23 - 19', '23 - 20 + 1', '3 + 1 = 4'],
        explanation: '19 est proche de 20, je calcule avec 20 puis j\'ajuste'
      }
    },
    cassage: {
      '100_minus_37': { 
        question: '100 - 37',
        cassage: 'Dizaines et unités',
        steps: ['100 - 37', '100 - 30 - 7', '70 - 7 = 63'],
        explanation: 'Je casse 37 en dizaines et unités pour calculer séparément'
      },
      '50_minus_28': { 
        question: '50 - 28',
        cassage: 'Dizaines et unités',
        steps: ['50 - 28', '50 - 20 - 8', '30 - 8 = 22'],
        explanation: 'Je casse 28 en dizaines et unités pour calculer séparément'
      }
    }
  };

  // Exercices variés (25 exercices)
  const exercises = [
    // Technique du complément
    { question: "Utilise la technique du complément : 11 - 8 = ?", answer: 3, technique: "complement", hint: "8 + ? = 11" },
    { question: "Technique du complément : 14 - 9 = ?", answer: 5, technique: "complement", hint: "9 + ? = 14" },
    { question: "Complément : 16 - 7 = ?", answer: 9, technique: "complement", hint: "7 + ? = 16" },
    { question: "Technique du complément : 13 - 6 = ?", answer: 7, technique: "complement", hint: "6 + ? = 13" },
    
    // Transformation en addition
    { question: "Transforme en addition : 12 - 5 = ?", answer: 7, technique: "addition", hint: "5 + ? = 12" },
    { question: "En addition : 15 - 8 = ?", answer: 7, technique: "addition", hint: "8 + ? = 15" },
    { question: "Technique de l'addition : 18 - 9 = ?", answer: 9, technique: "addition", hint: "9 + ? = 18" },
    { question: "Transforme : 17 - 8 = ?", answer: 9, technique: "addition", hint: "8 + ? = 17" },
    
    // Décomposition pour passer par 10
    { question: "Décompose pour passer par 10 : 13 - 7 = ?", answer: 6, technique: "decomposition", hint: "7 = 3 + 4, donc 13 - 3 - 4" },
    { question: "Passer par 10 : 14 - 8 = ?", answer: 6, technique: "decomposition", hint: "8 = 4 + 4, donc 14 - 4 - 4" },
    { question: "Décomposition : 16 - 9 = ?", answer: 7, technique: "decomposition", hint: "9 = 6 + 3, donc 16 - 6 - 3" },
    { question: "Passer par 10 : 12 - 5 = ?", answer: 7, technique: "decomposition", hint: "5 = 2 + 3, donc 12 - 2 - 3" },
    
    // Technique de proximité
    { question: "Proximité avec 10 : 15 - 9 = ?", answer: 6, technique: "proximite", hint: "15 - 10 + 1" },
    { question: "Proche de 10 : 17 - 9 = ?", answer: 8, technique: "proximite", hint: "17 - 10 + 1" },
    { question: "Proximité : 24 - 19 = ?", answer: 5, technique: "proximite", hint: "24 - 20 + 1" },
    { question: "Proche de 20 : 26 - 19 = ?", answer: 7, technique: "proximite", hint: "26 - 20 + 1" },
    
    // Technique du cassage
    { question: "Cassage : 30 - 17 = ?", answer: 13, technique: "cassage", hint: "30 - 10 - 7" },
    { question: "Casse en dizaines : 40 - 23 = ?", answer: 17, technique: "cassage", hint: "40 - 20 - 3" },
    { question: "Technique du cassage : 50 - 34 = ?", answer: 16, technique: "cassage", hint: "50 - 30 - 4" },
    { question: "Cassage : 60 - 28 = ?", answer: 32, technique: "cassage", hint: "60 - 20 - 8" },
    
    // Exercices mixtes pour choisir la meilleure technique
    { question: "Choisis ta technique : 20 - 12 = ?", answer: 8, technique: "mixte", hint: "Quelle technique est la plus rapide ?" },
    { question: "Libre choix : 25 - 17 = ?", answer: 8, technique: "mixte", hint: "Plusieurs techniques possibles !" },
    { question: "À toi de voir : 33 - 16 = ?", answer: 17, technique: "mixte", hint: "Quelle est ta technique préférée ?" },
    { question: "Technique au choix : 42 - 25 = ?", answer: 17, technique: "mixte", hint: "Utilise ta technique favorite !" },
    { question: "Défi final : 100 - 47 = ?", answer: 53, technique: "mixte", hint: "Combine plusieurs techniques si besoin !" }
  ];

  // Fonction principale d'explication des techniques
  const explainTechniques = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      
      await playAudioSequence("Salut ! Aujourd'hui, tu vas découvrir les techniques secrètes des mathématiciens pour la soustraction !", 1.1);
      await wait(800);
      
      setHighlightedElement('title');
      await playAudioSequence("Ce sont des astuces magiques qui vont te faire calculer super vite et sans erreur !", 1.1);
      await wait(800);
      
      // Présenter les 5 techniques
      setHighlightedElement('techniques');
      await playAudioSequence("Il y a 5 techniques de ninja ! Chacune a ses super-pouvoirs !", 1.1);
      await wait(800);
      
      // Technique du complément
      setSelectedTechnique('complement');
      await playAudioSequence("Première technique : le complément ! Au lieu de soustraire, je cherche ce qui manque !", 1.1);
      await wait(1000);
      
      await demonstrateTechnique();
      
      // Technique de l'addition
      setSelectedTechnique('addition');
      await wait(1000);
      await playAudioSequence("Deuxième technique : transformer en addition ! Plus facile de chercher que d'enlever !", 1.1);
      await wait(1000);
      
      // Technique de décomposition
      setSelectedTechnique('decomposition');
      await wait(1000);
      await playAudioSequence("Troisième technique : la décomposition ! Je casse le nombre pour passer par 10 !", 1.1);
      await wait(1000);
      
      // Technique de proximité
      setSelectedTechnique('proximite');
      await wait(1000);
      await playAudioSequence("Quatrième technique : la proximité ! J'utilise les nombres ronds puis j'ajuste !", 1.1);
      await wait(1000);
      
      // Technique du cassage
      setSelectedTechnique('cassage');
      await wait(1000);
      await playAudioSequence("Cinquième technique : le cassage ! Je sépare dizaines et unités pour des gros nombres !", 1.1);
      await wait(1500);
      
      setHighlightedElement('exercise_tab');
      await playAudioSequence("Maintenant, va aux exercices pour maîtriser toutes ces techniques de ninja ! Tu vas devenir imbattable !", 1.1);
      
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainTechniques:', error);
    }
  };

  // Démonstration d'une technique
  const demonstrateTechnique = async () => {
    const examples = techniqueExamples[selectedTechnique];
    const example = examples[currentExample as keyof typeof examples] as any;
    
    if (!example) return;
    
    try {
      setAnimationStep(0);
      setShowSteps([]);
      setShowCalculation(null);
      
      // Montrer le problème
      setAnimationStep(1);
      await playAudioSequence(`Regardons ${example.question} avec la technique ${getTechniqueName(selectedTechnique)} !`, 1.1);
      await wait(800);
      
      // Expliquer la technique
      setAnimationStep(2);
      await playAudioSequence(example.explanation, 1.1);
      await wait(800);
      
      // Montrer les étapes
      setAnimationStep(3);
      for (let i = 0; i < example.steps.length; i++) {
        setShowSteps(prev => [...prev, example.steps[i]]);
        await playAudioSequence(example.steps[i], 1.0);
        await wait(1000);
      }
      
      setAnimationStep(4);
      await playAudioSequence("Et voilà ! Cette technique rend le calcul beaucoup plus facile !", 1.1);
      
    } catch (error) {
      console.error('Erreur dans demonstrateTechnique:', error);
    }
  };

  const getTechniqueName = (technique: TechniqueType): string => {
    switch (technique) {
      case 'complement': return 'du complément';
      case 'addition': return 'de l\'addition';
      case 'decomposition': return 'de décomposition';
      case 'proximite': return 'de proximité';
      case 'cassage': return 'du cassage';
      default: return '';
    }
  };

  // Fonction d'explication des exercices
  const explainExercisesOnce = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      setExerciseInstructionGiven(true);
      exerciseInstructionGivenRef.current = true;
      
      await playAudioSequence("Fantastique ! Tu es dans les exercices des techniques de calcul !", 1.0);
      await wait(800);
      
      await playAudioSequence("Tu vas résoudre 25 soustractions en utilisant les 5 techniques de ninja !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Chaque exercice te dit quelle technique utiliser, puis à la fin tu choisis librement !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Souviens-toi : complément, addition, décomposition, proximité et cassage ! À toi de jouer, ninja des maths !", 1.0);
      
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
      speakText("Excellent ! Tu maîtrises cette technique !");
      
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
    const handlePageExit = () => {
      console.log("🚪 SORTIE DE PAGE DÉTECTÉE - Arrêt des vocaux");
      stopAllVocals();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👁️ PAGE CACHÉE - Arrêt des vocaux");
        stopAllVocals();
      }
    };
    const handleNavigation = () => {
      console.log("🔄 NAVIGATION DÉTECTÉE - Arrêt des vocaux");
      stopAllVocals();
    };
    window.addEventListener('beforeunload', handlePageExit);
    window.addEventListener('pagehide', handlePageExit);
    window.addEventListener('unload', handlePageExit);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      stopAllVocals();
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
      0%, 100% { box-shadow: 0 0 5px rgba(139, 69, 19, 0.5); }
      50% { box-shadow: 0 0 20px rgba(139, 69, 19, 0.8); }
    }
    @keyframes slideIn {
      0% { transform: translateX(-20px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes ninja {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
    }
    .float { animation: float 3s ease-in-out infinite; }
    .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .slide-in { animation: slideIn 0.5s ease-out; }
    .ninja { animation: ninja 2s ease-in-out infinite; }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux soustractions simples</span>
          </button>
          
          <h1 
            className={`text-3xl font-bold text-center text-amber-800 ${
              highlightedElement === 'title' ? 'pulse-glow bg-yellow-200 px-4 py-2 rounded-lg' : ''
            }`}
          >
            🥷 Techniques de calcul
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
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-amber-600 hover:bg-amber-50'
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
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-amber-600 hover:bg-amber-50'
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
                    explainTechniques();
                  }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg animate-bounce ninja"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-6 h-6" />
                    <span>🥷 DEVENIR UN NINJA !</span>
                  </div>
                </button>
              </div>
            )}

            {/* Introduction visuelle */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">
                🧠 Les 5 techniques secrètes des ninjas mathématiques !
              </h2>
              
              <div className="text-center text-gray-700 space-y-2">
                <p>⚡ Calcule plus vite que l'éclair</p>
                <p>🎯 Zéro erreur, maximum d'efficacité</p>
                <p>🏆 Impressionne tes amis avec tes super-pouvoirs !</p>
              </div>
            </div>

            {/* Les 5 techniques */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'techniques' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-amber-800 mb-4 text-center">
                🥷 Arsenal des techniques ninja
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => {
                    setSelectedTechnique('complement');
                    setCurrentExample('13_minus_9');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTechnique === 'complement'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🔍</div>
                  <h4 className="font-bold text-amber-800">Complément</h4>
                  <p className="text-sm text-gray-600">Chercher ce qui manque</p>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTechnique('addition');
                    setCurrentExample('16_minus_8');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTechnique === 'addition'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-2">➕</div>
                  <h4 className="font-bold text-amber-800">Addition</h4>
                  <p className="text-sm text-gray-600">Transformer en plus</p>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTechnique('decomposition');
                    setCurrentExample('12_minus_7');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTechnique === 'decomposition'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🧩</div>
                  <h4 className="font-bold text-amber-800">Décomposition</h4>
                  <p className="text-sm text-gray-600">Passer par 10</p>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTechnique('proximite');
                    setCurrentExample('17_minus_9');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTechnique === 'proximite'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold text-amber-800">Proximité</h4>
                  <p className="text-sm text-gray-600">Nombres ronds</p>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTechnique('cassage');
                    setCurrentExample('100_minus_37');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTechnique === 'cassage'
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🔨</div>
                  <h4 className="font-bold text-amber-800">Cassage</h4>
                  <p className="text-sm text-gray-600">Dizaines/unités</p>
                </button>
              </div>
            </div>

            {/* Zone de démonstration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-amber-800">
                  Technique : {selectedTechnique === 'complement' && '🔍 Complément'}
                  {selectedTechnique === 'addition' && '➕ Addition'}
                  {selectedTechnique === 'decomposition' && '🧩 Décomposition'}
                  {selectedTechnique === 'proximite' && '🎯 Proximité'}
                  {selectedTechnique === 'cassage' && '🔨 Cassage'}
                </h3>
                
                <button
                  onClick={demonstrateTechnique}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <Play className="inline w-4 h-4 mr-2" />
                  Démonstration
                </button>
              </div>

              {/* Sélecteur d'exemples */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(techniqueExamples[selectedTechnique] || {}).map(([key, example]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentExample(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentExample === key
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-lg font-bold">
                      {example.question}
                    </div>
                    <div className="text-sm text-gray-600">
                      {example.explanation}
                    </div>
                  </button>
                ))}
              </div>

              {/* Zone d'animation */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 min-h-64">
                {/* Problème initial */}
                {animationStep >= 1 && (
                  <div className="text-center mb-6">
                    <h4 className="text-3xl font-bold text-amber-800">
                      {(techniqueExamples[selectedTechnique]?.[currentExample as keyof typeof techniqueExamples[typeof selectedTechnique]] as any)?.question || ''}
                    </h4>
                  </div>
                )}
                
                {/* Explication de la technique */}
                {animationStep >= 2 && (
                  <div className="text-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <p className="text-blue-800 font-semibold">
                        {(techniqueExamples[selectedTechnique]?.[currentExample as keyof typeof techniqueExamples[typeof selectedTechnique]] as any)?.explanation || ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Étapes de résolution */}
                {animationStep >= 3 && showSteps.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-bold text-center text-purple-800 mb-4">🔥 Étapes ninja :</h5>
                    {showSteps.map((step, index) => (
                      <div 
                        key={index}
                        className="bg-purple-100 p-3 rounded-lg slide-in text-center"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <span className="text-purple-700 font-semibold">
                          {index + 1}. {step}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message de succès */}
                {animationStep >= 4 && (
                  <div className="text-center mt-6">
                    <div className="bg-green-100 p-6 rounded-lg">
                      <h4 className="text-2xl font-bold text-green-800">
                        🎉 Technique maîtrisée !
                      </h4>
                      <p className="text-green-700 mt-2">
                        Tu calcules maintenant comme un vrai ninja ! 🥷⚡
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
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg animate-bounce ninja"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-6 h-6" />
                    <span>🔊 INSTRUCTIONS NINJA !</span>
                  </div>
                </button>
              </div>
            )}

            {/* Modal de fin */}
            {showCompletionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🥷</div>
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">
                      Félicitations, Maître Ninja ! 🎉
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Tu maîtrises maintenant toutes les techniques secrètes !
                    </p>
                    <p className="text-lg font-semibold text-amber-600 mb-6">
                      Score : {finalScore} / {exercises.length}
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={resetExercises}
                        className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        🔄 S'entraîner encore
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
                  <div className="text-sm text-amber-600 font-semibold">
                    Score : {score} / {exercises.length}
                  </div>
                </div>

                <div className="text-center space-y-6">
                  {/* Badge de la technique */}
                  <div className="flex justify-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      exercises[currentExercise].technique === 'complement' ? 'bg-blue-100 text-blue-800' :
                      exercises[currentExercise].technique === 'addition' ? 'bg-green-100 text-green-800' :
                      exercises[currentExercise].technique === 'decomposition' ? 'bg-purple-100 text-purple-800' :
                      exercises[currentExercise].technique === 'proximite' ? 'bg-orange-100 text-orange-800' :
                      exercises[currentExercise].technique === 'cassage' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {exercises[currentExercise].technique === 'complement' ? '🔍 Complément' :
                       exercises[currentExercise].technique === 'addition' ? '➕ Addition' :
                       exercises[currentExercise].technique === 'decomposition' ? '🧩 Décomposition' :
                       exercises[currentExercise].technique === 'proximite' ? '🎯 Proximité' :
                       exercises[currentExercise].technique === 'cassage' ? '🔨 Cassage' :
                       '🥷 Libre choix'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-amber-800">
                    {exercises[currentExercise].question}
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-32 p-3 text-center text-xl border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none"
                      placeholder="?"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    
                    <div className="space-x-4">
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        ✓ Vérifier
                      </button>
                      
                      {!showHint && (
                        <button
                          onClick={() => setShowHint(true)}
                          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                          <Lightbulb className="inline w-4 h-4 mr-2" />
                          Aide ninja
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hint */}
                  {showHint && (
                    <div className="bg-yellow-100 p-4 rounded-lg">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Conseil ninja :</span>
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
                          <span className="font-semibold">Technique maîtrisée ! 🥷⚡</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-2">
                            <XCircle className="w-6 h-6" />
                            <span className="font-semibold">Continue ton entraînement...</span>
                          </div>
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