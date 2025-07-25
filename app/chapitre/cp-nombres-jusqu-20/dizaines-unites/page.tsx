'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Package, Dot } from 'lucide-react';

// Styles CSS pour les animations personnalisées
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  .animate-pulse-custom {
    animation: pulse 1s ease-in-out infinite;
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  .animate-bounce-custom {
    animation: bounce 1s ease-in-out;
  }
`;

export default function ValeurPositionnelleCP20() {
  const [selectedNumber, setSelectedNumber] = useState('15');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [animatedExplanation, setAnimatedExplanation] = useState<string>('');

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // États vocaux
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [exerciseInstructionGiven, setExerciseInstructionGiven] = useState(false);
  
  // Refs pour les timers
  const welcomeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseInstructionGivenRef = useRef(false);
  const exerciseReadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const allTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Hook pour détecter la taille de l'écran
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Définir la taille initiale
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Arrêter la voix quand on quitte la page
  useEffect(() => {
    const stopSpeechOnExit = () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    };

    const handleBeforeUnload = () => stopSpeechOnExit();
    const handleVisibilityChange = () => {
      if (document.hidden) stopSpeechOnExit();
    };
    const handlePageHide = () => stopSpeechOnExit();

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);  
      window.removeEventListener('pagehide', handlePageHide);
      stopSpeechOnExit();
    };
  }, []);

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  // Effect pour jouer automatiquement le vocal de bienvenue (une seule fois)
  useEffect(() => {
    if (!showExercises && !hasStarted) {
      welcomeTimerRef.current = setTimeout(() => {
        if (!hasStarted) {
          speakText("Salut ! Clique sur le bouton violet pour découvrir les dizaines et les unités !");
        }
      }, 1000);
    }
    
    return () => {
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    };
  }, [showExercises, hasStarted]);

  // Explication complète et interactive des exercices
  const explainExercisesOnce = async () => {
    if (exerciseInstructionGivenRef.current) return;
    
    try {
      speechSynthesis.cancel();
      exerciseInstructionGivenRef.current = true;
      setExerciseInstructionGiven(true);
      setIsPlayingVocal(true);
      
      await wait(500);
      
      // Introduction énergique
      await playAudioSequence("Génial ! Place aux exercices sur les dizaines et les unités !");
      await wait(1000);
      
      // Objectif et types d'exercices
      await playAudioSequence("Tu auras deux types de questions : trouver les dizaines ou les unités dans un nombre, ou calculer des compositions !");
      await wait(1200);
      
      // Présentation des aides
      await playAudioSequence("Si tu as besoin d'aide, tu as plusieurs boutons :");
      await wait(1000);
      
      await playAudioSequence("Le bouton bleu pour lire la question, le bouton violet pour une explication complète !");
      await wait(1200);
      
      // Instructions de base
      await playAudioSequence("Lis bien chaque question, réfléchis, puis clique sur ta réponse !");
      await wait(1000);
      
      // Gestion des erreurs avec encouragement
      await playAudioSequence("Si tu te trompes, c'est normal ! Tu auras des explications et des boutons pour recommencer !");
      await wait(1200);
      
      // Encouragement final
      await playAudioSequence("Prêt ? Fais de ton mieux, tu vas bien réussir !");
      
      // Animation du bouton pour montrer
      setHighlightedElement('demo-next-button');
      await wait(1500);
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Effect pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    // Arrêter tous les vocaux lors du changement d'onglet
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    
    // Jouer automatiquement la consigne des exercices (une seule fois)
    if (showExercises && !exerciseInstructionGivenRef.current) {
      const timer = setTimeout(() => {
        explainExercisesOnce();
      }, 800);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showExercises]);

  useEffect(() => {
    const stopSpeechOnExit = () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    };

    // Arrêter la voix quand on ferme/quitte la page
    const handleBeforeUnload = () => {
      stopSpeechOnExit();
    };

    // Arrêter la voix quand l'onglet devient inactif
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSpeechOnExit();
      }
    };

    // Arrêter la voix lors de la navigation
    const handlePageHide = () => {
      stopSpeechOnExit();
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    // Nettoyage au démontage du composant
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      stopSpeechOnExit(); // Arrêter la voix aussi au démontage
    };
  }, []);

  // Effect pour réinitialiser quand on revient sur la page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && showExercises) {
        // La page redevient visible et on est sur les exercices
        // Réinitialiser les états si nécessaire
        exerciseInstructionGivenRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showExercises]);

  // L'animation ne se déclenche plus automatiquement - uniquement sur clic

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'dizaines-unites',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines-unites');
      
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

  // Nombres avec décomposition unités/dizaines pour CP - 4 exemples essentiels
  const numbersDecomposition = [
    { number: '12', dizaines: 1, unites: 2, visual: '🔟 🔴🔴', explanation: '1 dizaine + 2 unités' },
    { number: '15', dizaines: 1, unites: 5, visual: '🔟 🔴🔴🔴🔴🔴', explanation: '1 dizaine + 5 unités' },
    { number: '18', dizaines: 1, unites: 8, visual: '🔟 🔴🔴🔴🔴🔴🔴🔴🔴', explanation: '1 dizaine + 8 unités' },
    { number: '20', dizaines: 2, unites: 0, visual: '🔟🔟 • ', explanation: '2 dizaines + 0 unité' }
  ];

  // Exercices sur les dizaines et unités - 8 exercices basés sur les 4 nombres choisis
  const exercises = [
    { question: 'Dans 12, combien y a-t-il de dizaines ?', number: '12', type: 'dizaines', correctAnswer: '1', choices: ['1', '2', '12'] },
    { question: 'Dans 15, combien y a-t-il d\'unités ?', number: '15', type: 'unites', correctAnswer: '5', choices: ['5', '1', '15'] },
    { question: 'Dans 18, le chiffre des unités est ?', number: '18', type: 'unites', correctAnswer: '8', choices: ['8', '1', '18'] },
    { question: 'Dans 20, combien de dizaines ?', number: '20', type: 'dizaines', correctAnswer: '2', choices: ['2', '0', '20'] },
    
    // Exercices de composition
    { question: '1 dizaine + 2 unités = ?', display: '📦 + 🔴🔴', correctAnswer: '12', choices: ['12', '3', '21'] },
    { question: '1 dizaine + 5 unités = ?', display: '📦 + 🔴🔴🔴🔴🔴', correctAnswer: '15', choices: ['15', '6', '51'] },
    { question: '1 dizaine + 8 unités = ?', display: '📦 + 🔴🔴🔴🔴🔴🔴🔴🔴', correctAnswer: '18', choices: ['9', '18', '81'] },
    { question: '2 dizaines + 0 unité = ?', display: '📦📦 + •', correctAnswer: '20', choices: ['2', '20', '02'] }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Fonction pour arrêter le vocal
  const stopVocal = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    setHighlightedElement(null);
  };

  const playAudioSequence = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Arrêter les vocaux précédents
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  // Nouvelle explication fluide et immersive du chapitre
  const explainChapterGoal = async () => {
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      setHasStarted(true);
      
      // Effacer les timers de rappel s'ils existent
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);

      await wait(500);

      // 1. Introduction chaleureuse
      await playAudioSequence("Salut ! Bienvenue dans l'aventure des dizaines et des unités !");
      await wait(1200);
      
      // 2. Présentation du concept avec le sélecteur
      await playAudioSequence("Regarde ces nombres magiques !");
      setHighlightedElement('number-selector');
      await wait(2000);
      setHighlightedElement(null);
      await wait(500);
      
      // 3. Choisir 15 comme exemple
      setSelectedNumber('15');
      await playAudioSequence("Prenons le nombre 15 comme exemple !");
      setHighlightedElement('selected-number-15');
      await wait(2000);
      setHighlightedElement(null);
      await wait(400);
      
      // 4. Montrer le nombre clairement
      await playAudioSequence("Voici le nombre 15 !");
      setHighlightedElement('number-display');
      await wait(1800);
      setHighlightedElement(null);
      await wait(300);
      
      // 5. Introduire le tableau magique
      await playAudioSequence("Dans ce tableau magique, chaque chiffre a sa place !");
      setHighlightedElement('positions-table');
      await wait(2500);
      setHighlightedElement(null);
      await wait(400);
      
      // 6. Expliquer les dizaines
      await playAudioSequence("Le chiffre 1 va ici, dans les dizaines !");
      setHighlightedElement('dizaines-column');
      await wait(2200);
      setHighlightedElement(null);
      await wait(300);
      
      // 7. Expliquer les unités
      await playAudioSequence("Le chiffre 5 va là, dans les unités !");
      setHighlightedElement('unites-column');
      await wait(2200);
      setHighlightedElement(null);
      await wait(400);
      
      // 8. Visualisation concrète
      await playAudioSequence("Regarde cette représentation visuelle !");
      setHighlightedElement('visual-paquets');
      await wait(2000);
      setHighlightedElement(null);
      await wait(300);
      
      // 9. Détail des dizaines
      await playAudioSequence("1 dizaine, c'est comme 1 paquet de 10 objets !");
      setHighlightedElement('dizaines-detail');
      await wait(2800);
      setHighlightedElement(null);
      await wait(300);
      
      // 10. Détail des unités
      await playAudioSequence("5 unités, c'est 5 objets tout seuls !");
      setHighlightedElement('unites-detail');
      await wait(2500);
      setHighlightedElement(null);
      await wait(500);
      
      // 11. Proposition d'exploration
      await playAudioSequence("Maintenant, teste avec d'autres nombres !");
      
      // Animation des autres nombres
      setHighlightedElement('number-12');
      await wait(700);
      setHighlightedElement('number-18');
      await wait(700);
      setHighlightedElement('number-20');
      await wait(700);
      setHighlightedElement(null);
      
      await wait(400);
      
      // 12. Encouragement final
      await playAudioSequence("Clique sur un nombre pour découvrir sa décomposition !");
      
    } catch (error) {
      console.error('Erreur dans explainChapterGoal:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour générer une explication interactive quand c'est faux
  const generateAnimatedExplanation = (exercise: any) => {
    const correctAnswer = exercise.correctAnswer;
    
    // Rendre les fonctions vocales disponibles globalement pour les boutons HTML
    (window as any).explainQuestionGlobal = () => explainExerciseQuestion(currentExercise);
    (window as any).reExplainWrongAnswerGlobal = () => explainWrongAnswer(exercise, userAnswer, correctAnswer);
    
    if (exercise.type === 'dizaines') {
      return `
        <div class="bg-blue-50 rounded-lg p-4 mb-4 text-center space-y-3">
          <h4 class="font-bold text-blue-800 mb-4">La bonne réponse est ${correctAnswer} ${correctAnswer === '1' ? 'dizaine' : 'dizaines'}</h4>
          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <button onclick="window.explainQuestionGlobal()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              🔍 Ré-expliquer l'exercice
            </button>
            <button onclick="window.reExplainWrongAnswerGlobal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              🔊 Pourquoi c'est ${correctAnswer} ?
            </button>
          </div>
        </div>
      `;
    } else if (exercise.type === 'unites') {
      return `
        <div class="bg-red-50 rounded-lg p-4 mb-4 text-center space-y-3">
          <h4 class="font-bold text-red-800 mb-4">La bonne réponse est ${correctAnswer} ${correctAnswer === '1' ? 'unité' : 'unités'}</h4>
          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <button onclick="window.explainQuestionGlobal()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              🔍 Ré-expliquer l'exercice
            </button>
            <button onclick="window.reExplainWrongAnswerGlobal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              🔊 Pourquoi c'est ${correctAnswer} ?
            </button>
          </div>
        </div>
      `;
    } else {
      // Pour les exercices de composition
      const answer = exercise.correctAnswer;
      return `
        <div class="bg-green-50 rounded-lg p-4 mb-4 text-center space-y-3">
          <h4 class="font-bold text-green-800 mb-4">La bonne réponse est ${answer}</h4>
          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <button onclick="window.explainQuestionGlobal()" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              🔍 Ré-expliquer l'exercice
            </button>
            <button onclick="window.reExplainWrongAnswerGlobal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
              🔊 Comment calculer ?
            </button>
          </div>
        </div>
      `;
    }
  };

  const handleAnswerClick = (answer: string) => {
    stopVocal();
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
      // Effacer l'explication si c'est correct
      setAnimatedExplanation('');
      
      // Explication vocale pour la bonne réponse
      setTimeout(() => {
        explainCorrectAnswer(exercises[currentExercise], answer);
      }, 800);
      
      // Passage automatique au suivant après l'explication vocale
      setTimeout(() => {
        nextExercise();
      }, 4000); // Plus de temps pour l'explication vocale
      
    } else if (!correct) {
      // Générer l'explication animée HTML si c'est faux (pour le bouton)
      const explanation = generateAnimatedExplanation(exercises[currentExercise]);
      setAnimatedExplanation(explanation);
      
      // Explication vocale détaillée pour la mauvaise réponse
      setTimeout(() => {
        explainWrongAnswer(exercises[currentExercise], answer, exercises[currentExercise].correctAnswer);
      }, 800);
    }
  };

  // Explication interactive d'un nombre spécifique
  const explainSelectedNumber = async (number: string) => {
    const numberData = numbersDecomposition.find(n => n.number === number);
    if (!numberData) return;
    
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(300);
      
      // Annonce du nombre choisi
      await playAudioSequence(`Tu as choisi le nombre ${number} ! Excellente idée !`);
      setHighlightedElement(`number-${number}`);
      await wait(1800);
      setHighlightedElement(null);
      await wait(300);
      
      // Montrer le nombre clairement
      await playAudioSequence(`Voici le nombre ${number} affiché`);
      setHighlightedElement('number-display');
      await wait(1500);
      setHighlightedElement(null);
      await wait(300);
      
      // Expliquer la décomposition
      if (numberData.dizaines > 1) {
        await playAudioSequence(`${number} se décompose en ${numberData.dizaines} dizaines et ${numberData.unites} ${numberData.unites > 1 ? 'unités' : 'unité'} !`);
      } else {
        await playAudioSequence(`${number} se décompose en ${numberData.dizaines} dizaine et ${numberData.unites} ${numberData.unites > 1 ? 'unités' : 'unité'} !`);
      }
      
      // Montrer la visualisation
      setHighlightedElement('visual-paquets');
      await wait(2500);
      setHighlightedElement(null);
      await wait(400);
      
      // Détailler les dizaines
      if (numberData.dizaines > 0) {
        if (numberData.dizaines === 1) {
          await playAudioSequence(`1 dizaine représente 1 paquet de 10 !`);
        } else {
          await playAudioSequence(`${numberData.dizaines} dizaines représentent ${numberData.dizaines} paquets de 10 !`);
        }
        setHighlightedElement('dizaines-detail');
        await wait(2500);
        setHighlightedElement(null);
        await wait(300);
      }
      
      // Détailler les unités
      if (numberData.unites > 0) {
        if (numberData.unites === 1) {
          await playAudioSequence(`1 unité représente 1 objet tout seul !`);
        } else {
          await playAudioSequence(`${numberData.unites} unités représentent ${numberData.unites} objets tout seuls !`);
        }
        setHighlightedElement('unites-detail');
        await wait(2500);
        setHighlightedElement(null);
        await wait(300);
      } else {
        await playAudioSequence(`0 unité, cela veut dire qu'il n'y a aucun objet tout seul !`);
        setHighlightedElement('unites-detail');
        await wait(2500);
        setHighlightedElement(null);
        await wait(300);
      }
      
      // Encouragement
      await playAudioSequence(`Bravo ! Tu comprends bien la décomposition du nombre ${number} !`);
      
    } catch (error) {
      console.error('Erreur dans explainSelectedNumber:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Explication interactive complète d'un exercice avec animations
  const explainExerciseQuestion = async (exerciseIndex?: number) => {
    const index = exerciseIndex !== undefined ? exerciseIndex : currentExercise;
    const exercise = exercises[index];
    if (!exercise) return;
    
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(300);
      
      // 1. Présenter la question
      await playAudioSequence("Voici ton exercice !");
      setHighlightedElement('exercise-question');
      await wait(1500);
      setHighlightedElement(null);
      await wait(300);
      
      // 2. Lire la question
      await playAudioSequence(exercise.question);
      await wait(800);
      
      // 3. Expliquer selon le type d'exercice
      if (exercise.type === 'dizaines') {
        // Exercice sur les dizaines
        await playAudioSequence(`Tu cherches le nombre de dizaines dans ${exercise.number}.`);
        setHighlightedElement('exercise-number');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        
        await playAudioSequence("Regarde bien : les dizaines sont le chiffre de GAUCHE !");
        setHighlightedElement('exercise-number');
        await wait(2500);
        setHighlightedElement(null);
        await wait(400);
        
      } else if (exercise.type === 'unites') {
        // Exercice sur les unités
        await playAudioSequence(`Tu cherches le nombre d'unités dans ${exercise.number}.`);
        setHighlightedElement('exercise-number');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        
        await playAudioSequence("Regarde bien : les unités sont le chiffre de DROITE !");
        setHighlightedElement('exercise-number');
        await wait(2500);
        setHighlightedElement(null);
        await wait(400);
        
      } else {
        // Exercice de composition
        await playAudioSequence("Tu vois cette représentation visuelle ?");
        setHighlightedElement('exercise-number-container');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        
        if (exercise.display?.includes('📦📦')) {
          await playAudioSequence("2 paquets de 10, plus 0 objet seul, cela fait combien ?");
        } else if (exercise.display?.includes('📦')) {
          const unitsCount = (exercise.display.match(/🔴/g) || []).length;
          await playAudioSequence(`1 paquet de 10, plus ${unitsCount} objets seuls, cela fait combien ?`);
        }
        await wait(500);
      }
      
      // 4. Montrer les choix
      await playAudioSequence("Maintenant, regarde les choix et trouve la bonne réponse !");
      setHighlightedElement('exercise-choices');
      await wait(2000);
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainExerciseQuestion:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Explication détaillée pour une bonne réponse
  const explainCorrectAnswer = async (exercise: any, userAnswer: string) => {
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(400);
      
      // Félicitations énergiques
      await playAudioSequence("Bravo ! C'est la bonne réponse !");
      await wait(1000);
      
      // Explication détaillée selon le type
      if (exercise.type === 'dizaines') {
        await playAudioSequence(`Oui ! Dans ${exercise.number}, il y a bien ${userAnswer} ${userAnswer === '1' ? 'dizaine' : 'dizaines'} !`);
        await wait(500);
        await playAudioSequence(`Le chiffre de gauche dans ${exercise.number} est ${userAnswer}, c'est le chiffre des dizaines !`);
        
      } else if (exercise.type === 'unites') {
        await playAudioSequence(`Exactement ! Dans ${exercise.number}, il y a bien ${userAnswer} ${userAnswer === '1' ? 'unité' : 'unités'} !`);
        await wait(500);
        await playAudioSequence(`Le chiffre de droite dans ${exercise.number} est ${userAnswer}, c'est le chiffre des unités !`);
        
      } else {
        // Composition
        await playAudioSequence(`Parfait ! Le résultat est bien ${userAnswer} !`);
        await wait(500);
        if (exercise.display?.includes('📦📦')) {
          await playAudioSequence("2 dizaines plus 0 unité, cela fait bien 20 !");
        } else if (exercise.display?.includes('📦')) {
          const unitsCount = (exercise.display.match(/🔴/g) || []).length;
          await playAudioSequence(`1 dizaine plus ${unitsCount} unités, cela fait bien ${userAnswer} !`);
        }
      }
      
      await wait(500);
      await playAudioSequence("Continue comme ça, tu es très fort !");
      
    } catch (error) {
      console.error('Erreur dans explainCorrectAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Explication détaillée pour une mauvaise réponse
  const explainWrongAnswer = async (exercise: any, userAnswer: string, correctAnswer: string) => {
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(400);
      
      // Encouragement positif
      await playAudioSequence("Ce n'est pas grave ! Regardons ensemble la bonne réponse !");
      await wait(1200);
      
      // Expliquer pourquoi c'est faux et donner la bonne réponse
      if (exercise.type === 'dizaines') {
        await playAudioSequence(`Tu as répondu ${userAnswer}, mais la bonne réponse est ${correctAnswer}.`);
        await wait(1000);
        await playAudioSequence(`Dans ${exercise.number}, regarde le chiffre de GAUCHE !`);
        setHighlightedElement('exercise-number');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        await playAudioSequence(`C'est ${correctAnswer} ! Donc il y a ${correctAnswer} ${correctAnswer === '1' ? 'dizaine' : 'dizaines'} !`);
        
      } else if (exercise.type === 'unites') {
        await playAudioSequence(`Tu as répondu ${userAnswer}, mais la bonne réponse est ${correctAnswer}.`);
        await wait(1000);
        await playAudioSequence(`Dans ${exercise.number}, regarde le chiffre de DROITE !`);
        setHighlightedElement('exercise-number');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        await playAudioSequence(`C'est ${correctAnswer} ! Donc il y a ${correctAnswer} ${correctAnswer === '1' ? 'unité' : 'unités'} !`);
        
      } else {
        // Composition
        await playAudioSequence(`Tu as répondu ${userAnswer}, mais la bonne réponse est ${correctAnswer}.`);
        await wait(1000);
        await playAudioSequence("Regardons ensemble comment calculer :");
        setHighlightedElement('exercise-number-container');
        await wait(2000);
        setHighlightedElement(null);
        await wait(300);
        
        if (exercise.display?.includes('📦📦')) {
          await playAudioSequence("2 paquets de 10, cela fait 20. Plus 0 objet seul, cela fait toujours 20 !");
        } else if (exercise.display?.includes('📦')) {
          const unitsCount = (exercise.display.match(/🔴/g) || []).length;
          await playAudioSequence(`1 paquet de 10, plus ${unitsCount} objets seuls. 10 plus ${unitsCount}, cela fait ${correctAnswer} !`);
        }
      }
      
      await wait(500);
      await playAudioSequence("Maintenant tu comprends ! Clique sur Suivant pour continuer !");
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour lire l'énoncé d'un exercice spécifique (sur demande uniquement)
  const readExerciseStatement = (exerciseIndex?: number) => {
    const index = exerciseIndex !== undefined ? exerciseIndex : currentExercise;
    const exerciseData = exercises[index];
    if (exerciseData) {
      speakText(exerciseData.question);
    }
  };

  // Encouragement vocal pour le prochain exercice
  const encourageNextExercise = async (exerciseNumber: number) => {
    try {
      speechSynthesis.cancel();
      setIsPlayingVocal(true);
      
      await wait(800);
      
      const encouragements = [
        `Super ! Voici l'exercice ${exerciseNumber} !`,
        `Excellent ! Exercice ${exerciseNumber}, c'est parti !`,
        `Bravo ! Exercice ${exerciseNumber}, tu peux le faire !`,
        `Parfait ! Exercice ${exerciseNumber}, continue comme ça !`
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      await playAudioSequence(randomEncouragement);
      
    } catch (error) {
      console.error('Erreur dans encourageNextExercise:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  const nextExercise = () => {
    stopVocal();
    if (currentExercise < exercises.length - 1) {
      const nextIndex = currentExercise + 1;
      setCurrentExercise(nextIndex);
      setUserAnswer('');
      setIsCorrect(null);
      setAnimatedExplanation('');
      
      // Encouragement vocal pour le prochain exercice
      setTimeout(() => {
        encourageNextExercise(nextIndex + 1);
      }, 500);
      
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    stopVocal();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setAnimatedExplanation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4"
            onClick={stopVocal}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              🔢 Dizaines et unités
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
              Comprends la différence entre unités et dizaines dans les nombres de 10 à 20 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex h-auto">
            <button
              onClick={() => {
                // Arrêt vocal renforcé avec double vérification
                try {
                  if ('speechSynthesis' in window) {
                    speechSynthesis.cancel();
                    setTimeout(() => {
                      if ('speechSynthesis' in window) {
                        speechSynthesis.cancel();
                      }
                    }, 100);
                  }
                } catch (error) {
                  console.warn('Erreur lors de l\'arrêt du vocal:', error);
                }
                
                // Réinitialiser tous les états
                setIsPlayingVocal(false);
                setHighlightedElement(null);
                
                // Arrêter spécifiquement les fonctions vocales
                exerciseInstructionGivenRef.current = false;
                setExerciseInstructionGiven(false);
                
                // Nettoyer les timers
                if (welcomeTimerRef.current) {
                  clearTimeout(welcomeTimerRef.current);
                  welcomeTimerRef.current = null;
                }
                if (reminderTimerRef.current) {
                  clearTimeout(reminderTimerRef.current);
                  reminderTimerRef.current = null;
                }
                
                setShowExercises(false);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex items-center justify-center ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                // Arrêt vocal renforcé avec double vérification
                try {
                  if ('speechSynthesis' in window) {
                    speechSynthesis.cancel();
                    setTimeout(() => {
                      if ('speechSynthesis' in window) {
                        speechSynthesis.cancel();
                      }
                    }, 100);
                  }
                } catch (error) {
                  console.warn('Erreur lors de l\'arrêt du vocal:', error);
                }
                
                // Réinitialiser tous les états
                setIsPlayingVocal(false);
                setHighlightedElement(null);
                
                // Réinitialiser le flag pour permettre le vocal automatique
                exerciseInstructionGivenRef.current = false;
                setExerciseInstructionGiven(false);
                
                // Nettoyer les timers
                if (welcomeTimerRef.current) {
                  clearTimeout(welcomeTimerRef.current);
                  welcomeTimerRef.current = null;
                }
                if (reminderTimerRef.current) {
                  clearTimeout(reminderTimerRef.current);
                  reminderTimerRef.current = null;
                }
                
                setShowExercises(true);
              }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Bouton d'explication vocal principal - Attractif pour non-lecteurs */}
            <div className="text-center mb-6">
              <button
                onClick={explainChapterGoal}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                  !hasStarted ? 'animate-bounce' : ''
                } ${
                  isPlayingVocal ? 'animate-pulse cursor-not-allowed opacity-75' : 'hover:from-purple-600 hover:to-pink-600'
                }`}
                style={{
                  animationDuration: !hasStarted ? '2s' : 'none',
                  animationIterationCount: !hasStarted ? 'infinite' : 'none'
                }}
              >
                <Volume2 className="inline w-6 h-6 mr-3" />
                ▶️ COMMENCER !
              </button>
            </div>

            {/* Sélecteur de nombre */}
            <div 
              id="number-selector"
              className={`bg-white rounded-xl p-3 sm:p-6 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-selector' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis un nombre à analyser
              </h2>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 max-w-lg">
                  {numbersDecomposition.map((num) => (
                    <button
                      key={num.number}
                      id={`number-${num.number}`}
                      onClick={() => {
                        stopVocal();
                        setSelectedNumber(num.number);
                        // Expliquer le nombre choisi avec animations
                        setTimeout(() => {
                          explainSelectedNumber(num.number);
                        }, 500);
                      }}
                      className={`p-2 sm:p-3 lg:p-4 rounded-lg font-bold text-base sm:text-lg lg:text-xl transition-all min-w-[50px] sm:min-w-[60px] lg:min-w-[80px] ${
                        selectedNumber === num.number
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                      } ${
                        highlightedElement === `number-${num.number}` ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-125' : ''
                      } ${
                        highlightedElement === 'selected-number-15' && num.number === '15' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-125' : ''
                      }`}
                    >
                      {num.number}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div 
              id="visual-display"
              className={`bg-white rounded-xl p-2 sm:p-4 lg:p-6 shadow-lg text-center transition-all duration-500 ${
                highlightedElement === 'visual-display' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 border-yellow-400' : ''
              }`}
            >
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-4 text-gray-900">
                🔍 Analysons le nombre {selectedNumber}
              </h3>
              
              {/* Grande visualisation du nombre */}
              <div className="bg-blue-50 rounded-lg p-2 sm:p-4 lg:p-6 mb-2 sm:mb-4 lg:mb-6">
                <div 
                  id="number-display"
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-2 sm:mb-4 animate-pulse transition-all duration-500 ${
                    highlightedElement === 'number-display' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-110 rounded-lg p-2' : ''
                  }`}
                >
                  {selectedNumber}
                </div>
                
                {/* Animation simple de décomposition */}
                <div className="bg-white rounded-lg p-2 sm:p-4 mb-2 sm:mb-4">
                  <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-2 sm:mb-3 text-gray-800 text-center">
                    Décomposition de {selectedNumber}
                  </h4>
                  
                  {/* Tableau magique des positions avec animation */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="text-center">
                      <h5 className="text-sm sm:text-base font-bold text-gray-800 mb-3 sm:mb-4">
                        🎯 Tableau magique des positions
                      </h5>
                      

                      
                                              <div className="relative flex flex-col items-center">
                          {/* Nombre simplifié */}
                          <div className="mb-3 sm:mb-4 lg:mb-6">
                            <div className="bg-blue-100 rounded-lg px-2 sm:px-3 lg:px-4 py-1 sm:py-2 border-2 border-blue-300">
                              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 font-mono tracking-tight leading-none">
                                {selectedNumber}
                              </div>
                            </div>
                          </div>
                        
                        {/* Vrai tableau dizaines/unités - version mobile compacte */}
                        <div 
                          id="positions-table"
                          className={`bg-white rounded-lg shadow-lg border-2 border-gray-400 overflow-hidden w-full max-w-[250px] sm:max-w-xs lg:max-w-sm transition-all duration-500 ${
                            highlightedElement === 'positions-table' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105' : ''
                          }`}
                        >
                          <table className="border-collapse w-full">
                            <thead>
                              <tr>
                                <th 
                                  id="dizaines-header"
                                  className={`bg-green-100 border border-gray-400 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold text-green-700 w-1/2 transition-all duration-500 ${
                                    highlightedElement === 'dizaines-column' ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''
                                  }`}
                                >
                                  DIZAINES
                                </th>
                                <th 
                                  id="unites-header"
                                  className={`bg-orange-100 border border-gray-400 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold text-orange-700 w-1/2 transition-all duration-500 ${
                                    highlightedElement === 'unites-column' ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''
                                  }`}
                                >
                                  UNITÉS
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td 
                                  id="dizaines-value"
                                  className={`bg-green-50 border border-gray-400 px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-6 text-center w-1/2 transition-all duration-500 ${
                                    highlightedElement === 'dizaines-column' ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''
                                  }`}
                                >
                                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 h-8 sm:h-10 lg:h-12 flex items-center justify-center font-mono">
                                    {selectedNumber.charAt(0)}
                                  </div>
                                </td>
                                <td 
                                  id="unites-value"
                                  className={`bg-orange-50 border border-gray-400 px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-6 text-center w-1/2 transition-all duration-500 ${
                                    highlightedElement === 'unites-column' ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''
                                  }`}
                                >
                                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 h-8 sm:h-10 lg:h-12 flex items-center justify-center font-mono">
                                    {selectedNumber.charAt(1)}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Un seul bouton d'écoute pour le résultat complet */}
                  <div className="text-center mt-2 sm:mt-3">
                    <button
                      onClick={() => {
                        stopVocal();
                        explainSelectedNumber(selectedNumber);
                      }}
                      disabled={isPlayingVocal}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm ${
                        isPlayingVocal 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <Volume2 className="w-3 h-3 mr-1 inline" />
                      {isPlayingVocal ? 'En cours...' : 'Écouter l\'explication'}
                    </button>
                  </div>
                </div>

                {/* Représentation visuelle avec paquets - compacte mobile */}
                <div 
                  id="visual-paquets"
                  className={`bg-white rounded-lg p-2 sm:p-4 mb-2 sm:mb-4 transition-all duration-500 ${
                    highlightedElement === 'visual-paquets' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105' : ''
                  }`}
                >
                  <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-2 sm:mb-3 text-gray-800 text-center">
                    🔟 Regarde avec des paquets de 10 :
                  </h4>
                  <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 text-center">
                    <div className="text-sm sm:text-base lg:text-lg py-1 sm:py-2 font-mono break-all leading-relaxed">
                      {numbersDecomposition.find(n => n.number === selectedNumber)?.visual}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      📦 = paquet de 10 | 🔴 = 1 unité
                    </p>
                  </div>
                </div>

                {/* Décomposition détaillée - version mobile compacte */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div 
                    id="dizaines-detail"
                    className={`bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4 transform hover:scale-105 transition-all duration-500 border border-green-200 ${
                      highlightedElement === 'dizaines-detail' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-110' : ''
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-1 sm:mb-2 text-green-800">
                        🔟 Dizaines
                      </h4>
                      <div className="bg-white rounded-lg p-1 sm:p-2 mb-1 sm:mb-2 border border-green-300">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 font-mono">
                          {numbersDecomposition.find(n => n.number === selectedNumber)?.dizaines}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-green-700 font-semibold">
                        Le chiffre de GAUCHE
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Position des dizaines
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    id="unites-detail"
                    className={`bg-orange-50 rounded-lg p-2 sm:p-3 lg:p-4 transform hover:scale-105 transition-all duration-500 border border-orange-200 ${
                      highlightedElement === 'unites-detail' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-110' : ''
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="text-xs sm:text-sm lg:text-base font-bold mb-1 sm:mb-2 text-orange-800">
                        🔴 Unités
                      </h4>
                      <div className="bg-white rounded-lg p-1 sm:p-2 mb-1 sm:mb-2 border border-orange-300">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 font-mono">
                          {numbersDecomposition.find(n => n.number === selectedNumber)?.unites}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-orange-700 font-semibold">
                        Le chiffre de DROITE
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Position des unités
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques - version compacte */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl p-2 sm:p-3 lg:p-4 text-white">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>• GAUCHE = dizaines (paquets de 10) 🔟</li>
                <li>• DROITE = unités (objets seuls) 🔴</li>
                <li>• Dans 17 : 1 paquet de 10 + 7 objets seuls</li>
                <li>• Plus tu vas à gauche, plus c'est "gros" !</li>
                <li>• Le tableau t'aide à bien voir chaque position !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-3 sm:space-y-6">
            {/* Bouton de démonstration "Suivant" avec effet magique - TEMPORAIRE pour l'explication */}
            {highlightedElement === 'demo-next-button' && (
              <div className="flex justify-center">
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl ring-4 ring-yellow-400 animate-bounce scale-110 transform transition-all duration-1000 ease-out opacity-100">
                  ✨ Suivant → ✨
                </div>
              </div>
            )}

            {/* Header exercices - version compacte */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-3 space-y-1 sm:space-y-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-2 sm:px-3 py-1 rounded-lg font-bold hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                >
                  <RotateCcw className="inline w-3 h-3 mr-1" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-1 sm:mb-2">
                <div 
                  className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <div className="flex flex-col items-center gap-2 mb-3 sm:mb-6 md:mb-8">
                <h3 
                  id="exercise-question"
                  className={`text-base sm:text-xl md:text-2xl font-bold text-gray-900 transition-all duration-500 ${
                    highlightedElement === 'exercise-question' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105 rounded-lg p-2' : ''
                  }`}
                >
                  {exercises[currentExercise].question}
                </h3>
                
                {/* Petit bouton pour lire juste l'énoncé */}
                <button
                  onClick={() => {
                    stopVocal();
                    readExerciseStatement(currentExercise);
                  }}
                  disabled={isPlayingVocal || isCorrect !== null}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isPlayingVocal || isCorrect !== null
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105'
                  }`}
                >
                  <Volume2 className="w-3 h-3 mr-1 inline" />
                  Lire la question
                </button>
              </div>
              
              {/* Affichage du nombre ou de l'expression */}
              <div 
                id="exercise-number-container"
                className={`bg-blue-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8 transition-all duration-500 ${
                  highlightedElement === 'exercise-number' ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-105' : ''
                }`}
              >
                {exercises[currentExercise].display ? (
                  <>
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-4">
                      {exercises[currentExercise].display}
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Calcule le résultat !
                    </p>
                  </>
                ) : (
                  <>
                    <div 
                      id="exercise-number"
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-6"
                    >
                      {exercises[currentExercise].number}
                    </div>
                  </>
                )}
              </div>
              
              {/* Bouton d'aide vocale */}
              <div className="mb-4 sm:mb-6 text-center">
                <button
                  onClick={() => {
                    stopVocal();
                    explainExerciseQuestion(currentExercise);
                  }}
                  disabled={isPlayingVocal || isCorrect !== null}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    isPlayingVocal || isCorrect !== null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  <Volume2 className="w-4 h-4 mr-2 inline" />
                  {isPlayingVocal ? 'Explication en cours...' : '🤔 Aide : Expliquer cet exercice'}
                </button>
              </div>
              
              {/* Choix multiples */}
              <div 
                id="exercise-choices"
                className={`grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8 transition-all duration-500 ${
                  highlightedElement === 'exercise-choices' ? 'ring-4 ring-yellow-400 shadow-2xl scale-105 rounded-lg p-2 bg-yellow-50' : ''
                }`}
              >
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    id={`choice-${choice}`}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all flex items-center justify-center min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } ${
                      highlightedElement === `choice-${choice}` ? 'bg-yellow-100 ring-4 ring-yellow-400 shadow-2xl scale-110' : ''
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-3 sm:p-4 lg:p-6 rounded-lg mb-4 sm:mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-lg text-center">Bravo ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-lg text-center">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Explication animée quand c'est faux */}
              {animatedExplanation && (
                <div dangerouslySetInnerHTML={{ __html: animatedExplanation }} />
              )}
              
              {/* Navigation - Bouton Suivant (seulement si mauvaise réponse) */}
              {isCorrect === false && currentExercise + 1 < exercises.length && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-orange-500 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg font-bold text-sm sm:text-base lg:text-lg hover:bg-orange-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent petit CP !", message: "Tu maîtrises parfaitement les dizaines et unités !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les unités et dizaines !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue à t'entraîner avec les dizaines et unités !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Refais les exercices pour mieux comprendre !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">{result.emoji}</div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{result.title}</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6">{result.message}</p>
                    <div className="bg-blue-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-xl sm:text-2xl lg:text-3xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm sm:text-base"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
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