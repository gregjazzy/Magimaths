'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, RotateCcw, ArrowLeft, CheckCircle, XCircle, Star, Trophy, Target, Play, Minus } from 'lucide-react';

// Types pour la sécurité TypeScript
type ConceptType = 'objets' | 'nombres' | 'quotidien';

export default function SensSoustraction() {
  // États pour la navigation et les animations
  const [showExercises, setShowExercises] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>('objets');
  
  // États pour les animations du cours
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showObjectsStart, setShowObjectsStart] = useState(0);
  const [showObjectsRemoved, setShowObjectsRemoved] = useState(0);
  const [showObjectsResult, setShowObjectsResult] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  
  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
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

  // Exemples de soustraction
  const examples = {
    objets: [
      { start: 5, remove: 2, result: 3, items: '🍎', description: 'pommes', action: 'mange' },
      { start: 7, remove: 3, result: 4, items: '🚗', description: 'voitures', action: 'part avec' },
      { start: 6, remove: 4, result: 2, items: '⭐', description: 'étoiles', action: 'efface' },
      { start: 8, remove: 5, result: 3, items: '🎾', description: 'balles', action: 'prend' }
    ],
    nombres: [
      { start: 9, remove: 4, result: 5 },
      { start: 7, remove: 2, result: 5 },
      { start: 10, remove: 6, result: 4 },
      { start: 8, remove: 3, result: 5 }
    ],
    quotidien: [
      { 
        situation: 'Marie a 6 bonbons. Elle en donne 2 à son frère', 
        start: 6, remove: 2, result: 4, item: '🍬',
        action: 'donne'
      },
      { 
        situation: 'Dans le panier, il y a 5 oranges. Papa en prend 3 pour le jus', 
        start: 5, remove: 3, result: 2, item: '🍊',
        action: 'prend'
      },
      { 
        situation: 'Tom collectionne 8 cartes. Il en perd 3 dans la cour', 
        start: 8, remove: 3, result: 5, item: '🃏',
        action: 'perd'
      }
    ]
  };

  // Exercices variés (18 exercices)
  const exercises = [
    // Concept de base
    { 
      question: 'Que veut dire "soustraire" ?', 
      visual: '🍎🍎🍎 ➜ 🍎',
      correctAnswer: 'Enlever, retirer',
      choices: ['Enlever, retirer', 'Ajouter', 'Compter']
    },
    { 
      question: 'Que fait-on quand on enlève 2 objets à 5 objets ?', 
      visual: '🚗🚗🚗🚗🚗 ➜ ?',
      correctAnswer: 'On les retire',
      choices: ['On les ajoute', 'On les retire', 'On les garde']
    },
    
    // Soustractions visuelles simples
    { 
      question: 'Il y a 4 pommes. On en mange 1. Combien en reste-t-il ?', 
      visual: '🍎🍎🍎🍎 ➜ 🍎🍎🍎',
      correctAnswer: '3',
      choices: ['2', '3', '4']
    },
    { 
      question: 'Sur la table, 5 crayons. J\'en prends 2. Combien en reste-t-il ?', 
      visual: '✏️✏️✏️✏️✏️ ➜ ?',
      correctAnswer: '3',
      choices: ['3', '4', '5']
    },
    
    // Soustractions numériques
    { 
      question: 'Combien font 6 - 2 ?', 
      visual: '6 - 2 = ?',
      correctAnswer: '4',
      choices: ['3', '4', '5']
    },
    { 
      question: 'Combien font 8 - 3 ?', 
      visual: '8 - 3 = ?',
      correctAnswer: '5',
      choices: ['4', '5', '6']
    },
    { 
      question: 'Combien font 7 - 4 ?', 
      visual: '7 - 4 = ?',
      correctAnswer: '3',
      choices: ['2', '3', '4']
    },
    { 
      question: 'Combien font 9 - 5 ?', 
      visual: '9 - 5 = ?',
      correctAnswer: '4',
      choices: ['3', '4', '5']
    },
    
    // Problèmes contextuels
    { 
      question: 'Emma a 7 stickers. Elle en colle 3 sur son cahier. Combien lui en reste-t-il ?', 
      visual: '⭐⭐⭐⭐⭐⭐⭐ ➜ ⭐⭐⭐⭐',
      correctAnswer: '4',
      choices: ['3', '4', '5']
    },
    { 
      question: 'Dans le jardin, 6 papillons volent. 2 s\'envolent. Combien en reste-t-il ?', 
      visual: '🦋🦋🦋🦋🦋🦋 ➜ ?',
      correctAnswer: '4',
      choices: ['3', '4', '5']
    },
    { 
      question: 'Lucas a 9 billes. Il en donne 4 à son ami. Combien lui en reste-t-il ?', 
      visual: '⚪⚪⚪⚪⚪⚪⚪⚪⚪ ➜ ?',
      correctAnswer: '5',
      choices: ['4', '5', '6']
    },
    
    // Soustractions jusqu'à 10
    { 
      question: 'Combien font 10 - 3 ?', 
      visual: '10 - 3 = ?',
      correctAnswer: '7',
      choices: ['6', '7', '8']
    },
    { 
      question: 'Combien font 10 - 6 ?', 
      visual: '10 - 6 = ?',
      correctAnswer: '4',
      choices: ['3', '4', '5']
    },
    { 
      question: 'Combien font 10 - 1 ?', 
      visual: '10 - 1 = ?',
      correctAnswer: '9',
      choices: ['8', '9', '10']
    },
    
    // Comparaisons et différences
    { 
      question: 'Quelle est la différence entre 8 et 3 ?', 
      visual: '8 ⬅️➡️ 3',
      correctAnswer: '5',
      choices: ['4', '5', '6']
    },
    { 
      question: 'Il y a 7 filles et 4 garçons. Combien y a-t-il de filles en plus ?', 
      visual: '👧👧👧👧👧👧👧 ➜ 👦👦👦👦',
      correctAnswer: '3',
      choices: ['2', '3', '4']
    },
    
    // Situations avancées
    { 
      question: 'Maman achète 8 œufs. Elle en casse 2 en cuisinant. Combien d\'œufs entiers reste-t-il ?', 
      visual: '🥚🥚🥚🥚🥚🥚🥚🥚 ➜ ?',
      correctAnswer: '6',
      choices: ['5', '6', '7']
    },
    { 
      question: 'Sur l\'étagère, 10 livres. Emma en emprunte 4. Combien de livres restent sur l\'étagère ?', 
      visual: '📚📚📚📚📚📚📚📚📚📚 ➜ ?',
      correctAnswer: '6',
      choices: ['5', '6', '7']
    }
  ];

  // Fonction principale d'explication du cours
  const explainSubtractionConcept = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      
      await playAudioSequence("Salut ! Aujourd'hui, nous allons découvrir le sens de la soustraction !", 1.1);
      await wait(800);
      
      setHighlightedElement('title');
      await playAudioSequence("Soustraire, c'est enlever, retirer des objets ! C'est le contraire d'additionner !", 1.1);
      await wait(800);
      
      // Expliquer le concept avec un exemple concret
      setHighlightedElement('demonstration');
      await playAudioSequence("Regarde bien cette démonstration avec des pommes !", 1.1);
      await wait(500);
      
      await demonstrateSubtraction();
      
      // Expliquer le symbole moins
      setHighlightedElement('symbole');
      await playAudioSequence("Le symbole moins ressemble à un trait horizontal : tiret ! Il veut dire qu'on enlève !", 1.1);
      await wait(1500);
      
      // Encourager à tester les différents modes
      setHighlightedElement('modes');
      await playAudioSequence("Tu peux essayer avec des objets, des nombres, ou des situations de la vie quotidienne !", 1.1);
      await wait(1000);
      
      setHighlightedElement('exercise_tab');
      await playAudioSequence("Maintenant, clique sur l'onglet Exercices pour t'entraîner à comprendre la soustraction !", 1.1);
      
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainSubtractionConcept:', error);
    }
  };

  // Démonstration animée d'une soustraction
  const demonstrateSubtraction = async () => {
    const example = examples[selectedConcept as keyof typeof examples][currentExample];
    
    try {
      setCurrentStep(0);
      setShowObjectsStart(0);
      setShowObjectsRemoved(0);
      setShowObjectsResult(0);
      setShowResult(false);
      
      // Étape 1: Montrer tous les objets au début
      setCurrentStep(1);
      await playAudioSequence(`D'abord, j'ai ${example.start} ${'description' in example ? example.description : 'objets'} !`, 1.1);
      
      for (let i = 1; i <= example.start; i++) {
        setShowObjectsStart(i);
        await wait(400);
      }
      await wait(1000);
      
      // Étape 2: Enlever des objets
      setCurrentStep(2);
      await playAudioSequence(`Maintenant, j'en ${'action' in example ? example.action : 'enlève'} ${example.remove} !`, 1.1);
      
      for (let i = 1; i <= example.remove; i++) {
        setShowObjectsRemoved(i);
        await wait(600);
      }
      await wait(1000);
      
      // Étape 3: Montrer le résultat
      setCurrentStep(3);
      await playAudioSequence(`Il me reste ${example.result} ${'description' in example ? example.description : 'objets'} !`, 1.1);
      
      for (let i = 1; i <= example.result; i++) {
        setShowObjectsResult(i);
        await wait(400);
      }
      await wait(1000);
      
      // Étape 4: Montrer l'opération
      setCurrentStep(4);
      setShowResult(true);
      await playAudioSequence(`Donc ${example.start} moins ${example.remove} égale ${example.result} !`, 1.1);
      await wait(1500);
      
      await playAudioSequence("C'est exactement comme ça que fonctionne la soustraction !", 1.1);
      
    } catch (error) {
      console.error('Erreur dans demonstrateSubtraction:', error);
    }
  };

  // Changer de concept
  const switchConcept = async (concept: ConceptType) => {
    stopVocal();
    setSelectedConcept(concept);
    setCurrentExample(0);
    
    try {
      setCurrentStep(0);
      
      if (concept === 'objets') {
        await playAudioSequence("Super ! Avec les objets, on peut vraiment voir ce qu'on enlève !", 1.1);
      } else if (concept === 'nombres') {
        await playAudioSequence("Parfait ! Maintenant on travaille directement avec les nombres !", 1.1);
      } else {
        await playAudioSequence("Excellent ! Ces situations arrivent tous les jours dans la vraie vie !", 1.1);
      }
      
    } catch (error) {
      console.error('Erreur dans switchConcept:', error);
    }
  };

  // Changer d'exemple
  const changeExample = () => {
    const maxExamples = examples[selectedConcept as keyof typeof examples].length;
    setCurrentExample((currentExample + 1) % maxExamples);
  };

  // Fonction d'explication des exercices
  const explainExercisesOnce = async () => {
    try {
      shouldStopRef.current = false;
      userHasInteractedRef.current = true;
      setExerciseInstructionGiven(true);
      exerciseInstructionGivenRef.current = true;
      
      await playAudioSequence("Super ! Tu es dans les exercices sur le sens de la soustraction !", 1.0);
      await wait(800);
      
      await playAudioSequence("Tu vas découvrir 18 exercices variés pour bien comprendre ce que veut dire soustraire !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Il y a des questions sur le concept, des soustractions visuelles, des calculs et des petits problèmes !", 1.0);
      await wait(1000);
      
      await playAudioSequence("Pour chaque question, lis bien et choisis la bonne réponse. N'oublie pas : soustraire c'est enlever ! Allez, c'est parti !", 1.0);
      
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
  const checkAnswer = (selectedAnswer: string) => {
    stopVocal();
    const exerciseData = exercises[currentExercise];
    
    if (selectedAnswer === exerciseData.correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
      speakText("Bravo ! C'est la bonne réponse !");
      
      setTimeout(() => {
        nextExercise();
      }, 2000);
    } else {
      setIsCorrect(false);
      speakText(`Pas tout à fait ! La bonne réponse était : ${exerciseData.correctAnswer}`);
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
  const renderObjects = (count: number, color: string, item: string, opacity: number = 1) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className={`w-12 h-12 rounded-lg ${color} border-2 border-white shadow-md animate-bounce flex items-center justify-center text-2xl transition-opacity duration-500`}
        style={{ 
          animationDelay: `${i * 100}ms`,
          opacity: opacity
        }}
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
      0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
      50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8); }
    }
    @keyframes fadeOut {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.8); }
    }
    .float { animation: float 3s ease-in-out infinite; }
    .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .fade-out { animation: fadeOut 0.8s ease-in-out forwards; }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux soustractions simples</span>
          </button>
          
          <h1 
            className={`text-3xl font-bold text-center text-red-800 ${
              highlightedElement === 'title' ? 'pulse-glow bg-yellow-200 px-4 py-2 rounded-lg' : ''
            }`}
          >
            🪣 Le sens de la soustraction
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
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-red-600 hover:bg-red-50'
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
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-red-600 hover:bg-red-50'
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
                    explainSubtractionConcept();
                  }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all shadow-lg animate-bounce"
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
              <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">
                ✨ Découvre le sens de la soustraction !
              </h2>
              
              <div className="text-center text-gray-700 space-y-2">
                <p>🪣 Apprends ce que veut dire "enlever"</p>
                <p>➖ Découvre le symbole moins</p>
                <p>🎯 Comprends avec des exemples concrets !</p>
              </div>
            </div>

            {/* Explication du symbole */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'symbole' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
                ➖ Le symbole moins
              </h3>
              
              <div className="text-center space-y-4">
                <div className="text-8xl font-bold text-red-600 animate-pulse">
                  <Minus className="w-24 h-24 mx-auto" />
                </div>
                <p className="text-lg text-gray-700">
                  Le symbole <span className="font-bold text-red-600">moins (-)</span> veut dire qu'on <span className="font-bold">enlève</span> ou qu'on <span className="font-bold">retire</span> !
                </p>
              </div>
            </div>

            {/* Sélecteur de modes */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'modes' ? 'pulse-glow' : ''
              }`}
            >
              <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
                🎮 Choisis ton mode d'apprentissage
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => switchConcept('objets')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedConcept === 'objets'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🍎</div>
                  <h4 className="font-bold text-red-800">Avec des objets</h4>
                  <p className="text-sm text-gray-600">Voir vraiment ce qu'on enlève</p>
                </button>
                
                <button
                  onClick={() => switchConcept('nombres')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedConcept === 'nombres'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🔢</div>
                  <h4 className="font-bold text-red-800">Avec des nombres</h4>
                  <p className="text-sm text-gray-600">Calculs directs</p>
                </button>
                
                <button
                  onClick={() => switchConcept('quotidien')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedConcept === 'quotidien'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🌟</div>
                  <h4 className="font-bold text-red-800">Situations réelles</h4>
                  <p className="text-sm text-gray-600">Dans la vraie vie</p>
                </button>
              </div>
            </div>

            {/* Zone de démonstration */}
            <div 
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'demonstration' ? 'pulse-glow' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-red-800">
                  {selectedConcept === 'objets' && '🎭 Démonstration avec objets'}
                  {selectedConcept === 'nombres' && '🧮 Démonstration avec nombres'}
                  {selectedConcept === 'quotidien' && '🌟 Situation de la vie quotidienne'}
                </h3>
                
                <button
                  onClick={changeExample}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Autre exemple
                </button>
              </div>

              {/* Affichage selon le type de concept */}
              {selectedConcept === 'objets' && (
                <div className="space-y-8">
                  {/* Situation pour quotidien dans objets si nécessaire */}
                  {selectedConcept === 'quotidien' && examples.quotidien[currentExample] && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                      <p className="text-lg text-gray-800">
                        📖 <strong>Situation :</strong> {examples.quotidien[currentExample].situation}
                      </p>
                    </div>
                  )}
                  
                  {/* Animation des objets */}
                  <div className="grid grid-cols-1 gap-8 items-center">
                    
                    {/* Étape 1 : Objets de départ */}
                    {currentStep >= 1 && (
                      <div className="text-center">
                        <div className="bg-blue-100 p-6 rounded-lg">
                          <h4 className="text-lg font-bold text-blue-800 mb-4">Au départ</h4>
                          <div className="grid grid-cols-5 gap-2 justify-center max-w-md mx-auto">
                            {renderObjects(showObjectsStart, 'bg-blue-400', (examples[selectedConcept as keyof typeof examples][currentExample] as any).items || '●')}
                          </div>
                          <div className="text-xl font-bold text-blue-800 mt-4">
                            {examples[selectedConcept as keyof typeof examples][currentExample].start}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Flèche vers le bas */}
                    {currentStep >= 2 && (
                      <div className="text-center">
                        <div className="text-4xl animate-bounce">⬇️</div>
                        <p className="text-lg font-semibold text-red-600 mt-2">
                          On enlève {examples[selectedConcept as keyof typeof examples][currentExample].remove}
                        </p>
                      </div>
                    )}

                    {/* Étape 2 : Objets enlevés */}
                    {currentStep >= 2 && (
                      <div className="text-center">
                        <div className="bg-red-100 p-6 rounded-lg">
                          <h4 className="text-lg font-bold text-red-800 mb-4">Ce qu'on enlève</h4>
                          <div className="grid grid-cols-5 gap-2 justify-center max-w-md mx-auto">
                            {renderObjects(showObjectsRemoved, 'bg-red-400', (examples[selectedConcept as keyof typeof examples][currentExample] as any).items || '●', 0.6)}
                          </div>
                          <div className="text-xl font-bold text-red-800 mt-4">
                            {showObjectsRemoved}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Flèche vers le bas */}
                    {currentStep >= 3 && (
                      <div className="text-center">
                        <div className="text-4xl animate-bounce">⬇️</div>
                        <p className="text-lg font-semibold text-green-600 mt-2">
                          Il reste...
                        </p>
                      </div>
                    )}

                    {/* Étape 3 : Résultat */}
                    {currentStep >= 3 && (
                      <div className="text-center">
                        <div className="bg-green-100 p-6 rounded-lg">
                          <h4 className="text-lg font-bold text-green-800 mb-4">Ce qui reste</h4>
                          <div className="grid grid-cols-5 gap-2 justify-center max-w-md mx-auto">
                            {renderObjects(showObjectsResult, 'bg-green-400', (examples[selectedConcept as keyof typeof examples][currentExample] as any).items || '●')}
                          </div>
                          <div className="text-xl font-bold text-green-800 mt-4">
                            {examples[selectedConcept as keyof typeof examples][currentExample].result}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Opération finale */}
                  {showResult && (
                    <div className="text-center">
                      <div className="bg-purple-100 p-6 rounded-lg">
                        <h4 className="text-2xl font-bold text-purple-800 mb-4">🎯 L'opération</h4>
                        <div className="text-4xl font-bold text-purple-800">
                          {examples[selectedConcept as keyof typeof examples][currentExample].start} - {examples[selectedConcept as keyof typeof examples][currentExample].remove} = {examples[selectedConcept as keyof typeof examples][currentExample].result}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Affichage pour les nombres purs */}
              {selectedConcept === 'nombres' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
                    <div className="text-8xl font-bold text-blue-600">
                      {examples.nombres[currentExample].start}
                    </div>
                    <div className="text-6xl font-bold text-red-500">-</div>
                    <div className="text-8xl font-bold text-red-600">
                      {examples.nombres[currentExample].remove}
                    </div>
                    <div className="text-6xl font-bold text-purple-500">=</div>
                    <div className={`text-8xl font-bold transition-all duration-500 ${
                      showResult ? 'text-green-600 scale-110' : 'text-gray-300'
                    }`}>
                      {showResult ? examples.nombres[currentExample].result : '?'}
                    </div>
                  </div>
                </div>
              )}

              {/* Affichage pour les situations quotidiennes */}
              {selectedConcept === 'quotidien' && (
                <div className="space-y-8">
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <p className="text-xl text-gray-800 mb-4">
                      📖 <strong>Situation :</strong> {examples.quotidien[currentExample].situation}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-blue-800 mb-4">Au départ</h4>
                      <div className="text-6xl mb-2">{examples.quotidien[currentExample].item}</div>
                      <div className="text-4xl font-bold text-blue-600">
                        {examples.quotidien[currentExample].start}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-500 mb-2">-</div>
                      <div className="text-6xl mb-2 opacity-60">{examples.quotidien[currentExample].item}</div>
                      <div className="text-4xl font-bold text-red-600">
                        {examples.quotidien[currentExample].remove}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-green-800 mb-4">Il reste</h4>
                      <div className="text-6xl mb-2">{examples.quotidien[currentExample].item}</div>
                      <div className={`text-4xl font-bold transition-all duration-500 ${
                        showResult ? 'text-green-600 scale-110' : 'text-gray-300'
                      }`}>
                        {showResult ? examples.quotidien[currentExample].result : '?'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center mt-6">
                <button
                  onClick={demonstrateSubtraction}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
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
                  className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-yellow-600 hover:to-red-600 transition-all shadow-lg animate-bounce"
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
                    <h3 className="text-2xl font-bold text-red-800 mb-4">
                      Félicitations ! 🎉
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Tu comprends maintenant le sens de la soustraction !
                    </p>
                    <p className="text-lg font-semibold text-red-600 mb-6">
                      Score : {finalScore} / {exercises.length}
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={resetExercises}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
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
                    Question {currentExercise + 1} / {exercises.length}
                  </div>
                  <div className="text-sm text-red-600 font-semibold">
                    Score : {score} / {exercises.length}
                  </div>
                </div>

                <div className="text-center space-y-6">
                  {/* Question */}
                  <h3 className="text-xl font-bold text-red-800">
                    {exercises[currentExercise].question}
                  </h3>
                  
                  {/* Visuel */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-3xl">
                      {exercises[currentExercise].visual}
                    </div>
                  </div>

                  {/* Choix de réponses */}
                  <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                    {exercises[currentExercise].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => checkAnswer(choice)}
                        disabled={isCorrect !== null}
                        className="p-4 bg-white border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {choice}
                      </button>
                    ))}
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
                          <p className="text-sm">La bonne réponse était : {exercises[currentExercise].correctAnswer}</p>
                          <button
                            onClick={nextExercise}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Question suivante →
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