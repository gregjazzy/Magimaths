'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, XCircle, RotateCcw, Volume2, Pause } from 'lucide-react';

export default function ComptageCP() {
  const [selectedCount, setSelectedCount] = useState(5);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isCountingAnimation, setIsCountingAnimation] = useState(false);
  const [currentCountingNumber, setCurrentCountingNumber] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  
  // États pour le système vocal
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [useModernTTS] = useState(false); // Utiliser les voix natives du système
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  const welcomeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reminderTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseInstructionGivenRef = useRef(false);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'comptage',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'comptage');
      
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

  // Exercices de comptage
  const exercises = [
    { question: 'Compte les ballons', visual: '🎈🎈🎈🎈🎈', correctAnswer: '5', choices: ['5', '4', '6'] }, 
    { question: 'Combien de fleurs ?', visual: '🌸🌸🌸🌸🌸🌸🌸🌸', correctAnswer: '8', choices: ['9', '7', '8'] },
    { question: 'Compte les cœurs', visual: '❤️❤️❤️❤️❤️❤️❤️', correctAnswer: '7', choices: ['6', '8', '7'] },
    { question: 'Combien d\'étoiles ?', visual: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐', correctAnswer: '11', choices: ['11', '10', '12'] },
    { question: 'Compte les animaux', visual: '🐱🐱🐱🐱🐱🐱', correctAnswer: '6', choices: ['7', '5', '6'] },
    { question: 'Combien de fruits ?', visual: '🍎🍎🍎🍎🍎🍎🍎🍎🍎', correctAnswer: '9', choices: ['8', '10', '9'] },
    { question: 'Compte les voitures', visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗', correctAnswer: '12', choices: ['12', '11', '13'] },
    { question: 'Combien de bonbons ?', visual: '🍭🍭🍭🍭', correctAnswer: '4', choices: ['5', '4', '3'] },
    { question: 'Compte les objets', visual: '🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁', correctAnswer: '16', choices: ['17', '15', '16'] },
    { question: 'Combien de jouets ?', visual: '🧸🧸🧸🧸🧸🧸🧸🧸🧸🧸', correctAnswer: '10', choices: ['10', '9', '11'] },
    { question: 'Compte les biscuits', visual: '🍪🍪🍪', correctAnswer: '3', choices: ['4', '2', '3'] },
    { question: 'Combien de ballons ?', visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈', correctAnswer: '14', choices: ['13', '15', '14'] },
    { question: 'Compte les livres', visual: '📚📚📚📚📚📚📚📚📚📚📚📚📚📚📚📚📚📚📚', correctAnswer: '19', choices: ['19', '18', '20'] },
    { question: 'Compte les diamants', visual: '💎💎💎💎💎💎💎💎💎💎💎💎💎💎💎', correctAnswer: '15', choices: ['16', '14', '15'] },
    { question: 'Combien de points ?', visual: '🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴', correctAnswer: '18', choices: ['18', '17', '19'] },
    { question: 'Compte les soleils', visual: '☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️', correctAnswer: '13', choices: ['14', '13', '12'] },
    { question: 'Combien de papillons ?', visual: '🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋', correctAnswer: '17', choices: ['16', '18', '17'] },
    { question: 'Compte les cadeaux', visual: '🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁🎁', correctAnswer: '20', choices: ['20', '19', '21'] }
  ];

  // === FONCTIONS VOCALES ===

  // Fonction helper pour créer une utterance optimisée
  const createOptimizedUtterance = (text: string) => {
    // Améliorer le texte avec des pauses naturelles pour réduire la monotonie
    const enhancedText = text
      .replace(/\.\.\./g, '... ')    // Pauses après points de suspension
      .replace(/!/g, ' !')           // Espace avant exclamation pour l'intonation
      .replace(/\?/g, ' ?')          // Espace avant interrogation pour l'intonation
      .replace(/,(?!\s)/g, ', ')     // Pauses après virgules si pas déjà d'espace
      .replace(/:/g, ' : ')          // Pauses après deux-points
      .replace(/;/g, ' ; ')          // Pauses après point-virgules
      .replace(/\s+/g, ' ')          // Nettoyer les espaces multiples
      .trim();
    
    const utterance = new SpeechSynthesisUtterance(enhancedText);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;  // Légèrement plus lent pour la compréhension
    utterance.pitch = 1.1;  // Pitch légèrement plus aigu (adapté aux enfants)
    utterance.volume = 0.9; // Volume confortable
    
    // Utiliser la voix sélectionnée si disponible
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    return utterance;
  };

  // Fonction pour jouer un texte avec timing
  const playAudioSequence = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      // Arrêter les vocaux précédents
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      const utterance = createOptimizedUtterance(text);
      utterance.onend = () => resolve();
      speechSynthesis.speak(utterance);
    });
  };

  // Fonction d'attente
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const speakText = (text: string) => {
    // Arrêter les vocaux précédents
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = createOptimizedUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  // Consigne générale pour la série d'exercices (une seule fois)
  const explainExercisesOnce = async () => {
    // Arrêter les vocaux précédents
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    setIsPlayingVocal(true);

    try {
      await playAudioSequence("Super ! Tu vas faire une série d'exercices de comptage !");
      await wait(500);

      await playAudioSequence("Pour cette série d'exercices, regarde bien tous les objets, compte-les un par un sans en oublier, et trouve combien il y en a !");
      await wait(500);

      await playAudioSequence("Ensuite, clique sur le bon nombre !");
      await wait(500);

      await playAudioSequence("Quand ta réponse est mauvaise, regarde bien la correction... puis appuie sur le bouton Suivant !");
      
      // Faire apparaître temporairement un bouton orange de démonstration
      setHighlightedElement('demo-next-button');
      await wait(2000);
      setHighlightedElement(null);

    } catch (error) {
      console.error('Erreur dans explainExercisesOnce:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Instructions vocales pour le cours avec synchronisation
  const explainChapterGoal = async () => {
    setHasStarted(true); // Marquer que l'enfant a commencé
    hasStartedRef.current = true; // Pour les timers
    
        // Annuler immédiatement les timers de rappel
    if (welcomeTimerRef.current) {
      clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = null;
    }
    if (reminderTimerRef.current) {
      clearTimeout(reminderTimerRef.current);
      reminderTimerRef.current = null;
    }

    // Arrêter les vocaux précédents
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    setIsPlayingVocal(true);

    try {
      // 1. Introduction
      await playAudioSequence("Bienvenue dans le chapitre comptage ! Tu vas apprendre à compter jusqu'à 20.");
      await wait(500);

      // 2. Guide vers le sélecteur de nombre
      setHighlightedElement('count-selector');
      await playAudioSequence("Regarde ! Tu peux choisir un nombre ici pour voir comment compter jusqu'à ce nombre !");
      await wait(2000);
      setHighlightedElement(null);
      
      await wait(500);

      // 3. Guide vers l'animation de comptage
      setHighlightedElement('counting-button');
      await playAudioSequence("Ensuite, clique sur ce bouton pour voir l'animation de comptage ! Nous compterons ensemble !");
      await wait(2500);
      setHighlightedElement(null);

      await wait(500);
      await playAudioSequence("Alors... Es-tu prêt à apprendre à compter ?");

    } catch (error) {
      console.error('Erreur dans explainChapterGoal:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

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

  // Système de guidance vocale automatique
  useEffect(() => {
    // Chargement et sélection automatique de la meilleure voix française
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Filtrer les voix françaises
      const frenchVoices = voices.filter(voice => voice.lang.startsWith('fr'));
      
      // Ordre de préférence pour les voix françaises
      const preferredVoices = [
        // Voix iOS/macOS de qualité
        'Amélie', 'Virginie', 'Aurélie', 'Alice',
        // Voix Android de qualité
        'fr-FR-Standard-A', 'fr-FR-Wavenet-A', 'fr-FR-Wavenet-C',
        // Voix Windows
        'Hortense', 'Julie', 'Marie', 'Pauline',
        // Voix masculines (dernier recours)
        'Thomas', 'Daniel', 'Henri', 'Pierre'
      ];
      
      let bestVoice = null;
      
      // Essayer de trouver la meilleure voix dans l'ordre de préférence
      for (const preferred of preferredVoices) {
        const foundVoice = frenchVoices.find(voice => 
          voice.name.toLowerCase().includes(preferred.toLowerCase())
        );
        if (foundVoice) {
          bestVoice = foundVoice;
          break;
        }
      }
      
      // Si aucune voix préférée, prendre la première française avec qualité décente
      if (!bestVoice && frenchVoices.length > 0) {
        const decentVoices = frenchVoices.filter(voice => 
          !voice.name.toLowerCase().includes('robotic') && 
          !voice.name.toLowerCase().includes('computer')
        );
        bestVoice = decentVoices.length > 0 ? decentVoices[0] : frenchVoices[0];
      }
      
      setSelectedVoice(bestVoice || null);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Guidance vocale automatique pour les non-lecteurs (COURS seulement)
    if (!showExercises) {
      welcomeTimerRef.current = setTimeout(() => {
        if (!hasStartedRef.current) {
          speakText("Clique sur le bouton violet qui bouge pour commencer.");
        }
      }, 1000); // 1 seconde après le chargement

      // Rappel vocal si pas de clic après 6 secondes (5 secondes après le premier)
      
    }

    // Nettoyage
          return () => {
        if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      };
  }, [showExercises]);

  // Effect pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    // Arrêter tous les vocaux lors du changement d'onglet
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlayingVocal(false);
    
    // Jouer automatiquement la consigne des exercices (une seule fois)
    if (showExercises && !exerciseInstructionGivenRef.current) {
      // Délai court pour laisser l'interface se charger
      setTimeout(() => {
        explainExercisesOnce();
        exerciseInstructionGivenRef.current = true;
      }, 800);
    }
  }, [showExercises]);

  // Effect pour arrêter les vocaux lors de la sortie de page
  useEffect(() => {
    const stopVocals = () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsPlayingVocal(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopVocals();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', stopVocals);
    window.addEventListener('pagehide', stopVocals);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', stopVocals);
      window.removeEventListener('pagehide', stopVocals);
      stopVocals();
    };
  }, []);

  const speakNumber = (num: number) => {
    if ('speechSynthesis' in window) {
      const numbers = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];
      const utterance = new SpeechSynthesisUtterance(numbers[num] || num.toString());
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonction pour dire le résultat en français
  const speakResult = (count: string) => {
    const num = parseInt(count);
    const numbers = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];
    const text = `Il y a ${numbers[num] || count} objets`;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const startCountingAnimation = async () => {
    setIsCountingAnimation(true);
    setCurrentCountingNumber(0);
    
    for (let i = 1; i <= selectedCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentCountingNumber(i);
      speakNumber(i);
    }
    
    setIsCountingAnimation(false);
  };

  const handleAnswerClick = (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    // Feedback vocal immédiat
    if (correct) {
      speakText("Bravo ! C'est la bonne réponse !");
    } else {
      speakText(`Non, essaie encore ! La bonne réponse est ${exercises[currentExercise].correctAnswer}.`);
    }
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    // Passage automatique au suivant après une bonne réponse
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 >= exercises.length) {
          // Dernier exercice terminé
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        } else {
          // Passer à l'exercice suivant
          nextExercise();
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    // Réinitialiser les choix mélangés sera fait par useEffect quand currentExercise change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            onClick={() => {
              if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
              }
              setIsPlayingVocal(false);
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Compter jusqu'à 20
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à compter des objets et à réciter la suite des nombres !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
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

            {/* Comptage avec animation */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Apprends à compter !
              </h2>
              
              {/* Sélecteur de quantité */}
              <div 
                id="count-selector"
                className={`bg-green-50 rounded-lg p-6 mb-6 transition-all duration-500 ${
                  highlightedElement === 'count-selector' 
                    ? 'ring-4 ring-yellow-400 shadow-2xl scale-105 bg-yellow-100' 
                    : ''
                }`}
              >
                <h3 className="text-xl font-bold mb-4 text-green-800 text-center">
                  Choisis combien tu veux compter :
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {[3, 5, 7, 10, 12, 15, 18, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedCount(num)}
                      className={`p-3 rounded-lg font-bold text-lg transition-all ${
                        selectedCount === num
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-green-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone d'animation */}
              <div className="bg-blue-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">
                    🎪 Comptons ensemble jusqu'à {selectedCount} !
                  </h3>
                  
                  {/* Affichage des objets à compter */}
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 justify-items-center mb-6 max-w-4xl mx-auto">
                    {Array.from({length: selectedCount}, (_, i) => (
                      <div 
                        key={i}
                        className={`text-4xl transition-all duration-500 ${
                          i < currentCountingNumber 
                            ? 'scale-110 opacity-100' 
                            : isCountingAnimation 
                              ? 'scale-90 opacity-60'
                              : 'opacity-100'
                        }`}
                      >
                        🔴
                      </div>
                    ))}
                  </div>

                  {/* Compteur affiché */}
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {isCountingAnimation ? currentCountingNumber : selectedCount}
                  </div>

                  {/* Bouton pour démarrer le comptage */}
                  <button
                    id="counting-button"
                    onClick={startCountingAnimation}
                    disabled={isCountingAnimation}
                    className={`bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'counting-button' 
                        ? 'ring-4 ring-yellow-400 shadow-2xl scale-110 animate-pulse' 
                        : ''
                    }`}
                  >
                    {isCountingAnimation ? (
                      <>
                        <Pause className="inline w-5 h-5 mr-2" />
                        Comptage en cours...
                      </>
                    ) : (
                      <>
                        <Play className="inline w-5 h-5 mr-2" />
                        Compter avec moi !
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* La suite numérique jusqu'à 20 */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                📝 La suite des nombres jusqu'à 20
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-yellow-800 text-center">
                  🗣️ Récite avec moi :
                </h3>
                
                {/* Grille des nombres - optimisée pour mobile/Android */}
                <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3 mb-4 sm:mb-6 max-w-full overflow-hidden">
                  {Array.from({length: 20}, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => speakNumber(num)}
                      className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg font-bold text-lg sm:text-xl lg:text-2xl text-gray-800 hover:bg-yellow-100 hover:text-yellow-900 transition-colors border-2 border-yellow-200 hover:border-yellow-400 flex items-center justify-center min-h-[48px] sm:min-h-[56px] lg:min-h-[64px] aspect-square"
                    >
                      <span className="select-none">{num}</span>
                    </button>
                  ))}
                </div>

                <p className="text-center text-yellow-700 font-semibold text-sm sm:text-base lg:text-lg">
                  💡 Clique sur chaque nombre pour l'entendre !
                </p>
              </div>
            </div>

            {/* Techniques de comptage */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                ✋ Différentes façons de compter
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Avec les doigts */}
                <div className="bg-pink-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-pink-800 text-center">
                    🖐️ Avec tes doigts (jusqu'à 10)
                  </h3>
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="text-4xl sm:text-5xl lg:text-6xl">✋</div>
                    <p className="text-sm sm:text-base lg:text-lg text-pink-700 font-semibold">
                      1 main = 5 doigts<br/>
                      2 mains = 10 doigts
                    </p>
                  </div>
                </div>

                {/* Avec des groupes */}
                <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-purple-800 text-center">
                    📦 Avec des groupes de 5
                  </h3>
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="text-lg sm:text-xl lg:text-2xl flex justify-center items-center flex-wrap">
                      <span>🔴🔴🔴🔴🔴</span>
                      <span className="mx-1 sm:mx-2">|</span>
                      <span>🔴🔴🔴🔴🔴</span>
                      <span className="mx-1 sm:mx-2">|</span>
                      <span>🔴🔴</span>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-purple-700 font-semibold">
                      5 + 5 + 2 = 12
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jeu des nombres cachés */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🎮 Jeu : Continue la suite !
              </h2>
              
              <div className="bg-indigo-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-indigo-800 text-center">
                  Quel nombre vient après ?
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { sequence: '5, 6, 7, ?', answer: '8' },
                    { sequence: '12, 13, 14, ?', answer: '15' },
                    { sequence: '17, 18, 19, ?', answer: '20' },
                    { sequence: '8, 9, 10, ?', answer: '11' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-3 sm:p-4 rounded-lg text-center border-2 border-indigo-200 flex flex-col justify-center items-center min-h-[100px]">
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-indigo-600 mb-2">
                        {item.sequence}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour bien compter</h3>
              <ul className="space-y-2 text-lg">
                <li>• Pointe chaque objet avec ton doigt</li>
                <li>• Dis le nombre à voix haute</li>
                <li>• Utilise tes doigts pour t'aider</li>
                <li>• Fais des groupes de 5 pour les grands nombres</li>
                <li>• Récite la suite dans l'ordre tous les jours</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Bouton de démonstration "Suivant" avec effet magique - DANS LES EXERCICES */}
            {highlightedElement === 'demo-next-button' && (
              <div className="flex justify-center">
                <div className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl ring-4 ring-yellow-400 animate-bounce scale-110 transform transition-all duration-1000 ease-out opacity-100">
                  ✨ Suivant → ✨
                </div>
              </div>
            )}

            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage des objets à compter */}
              <div className="bg-green-50 rounded-lg p-2 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                <div className="text-base sm:text-lg md:text-2xl lg:text-3xl mb-2 sm:mb-4 md:mb-6 tracking-wider">
                  {exercises[currentExercise].visual}
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">
                  Compte bien chaque objet !
                </p>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Parfait ! Il y a bien {exercises[currentExercise].correctAnswer} objets !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... Il y en a {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Illustration et audio pour les mauvaises réponses */}
                  {!isCorrect && (
                    <div className="bg-white rounded-lg p-6 border-2 border-blue-300">
                      <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                        🎯 Comptons ensemble la bonne réponse !
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Illustration avec comptage visuel */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-center mb-3">
                            <div className="text-xl font-bold text-blue-600 mb-3">
                              {exercises[currentExercise].question}
                            </div>
                          </div>
                          
                          {/* Objets avec numérotation */}
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {Array.from(exercises[currentExercise].visual).map((emoji, index) => (
                              <div key={index} className="relative">
                                <div className="text-3xl">{emoji}</div>
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Résultat final */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              = {exercises[currentExercise].correctAnswer}
                            </div>
                            <div className="text-lg text-gray-700">
                              Il y a {exercises[currentExercise].correctAnswer} objets en tout !
                            </div>
                          </div>
                        </div>
                        
                        {/* Bouton d'écoute */}
                        <div className="text-center">
                          <button
                            onClick={() => speakResult(exercises[currentExercise].correctAnswer)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2 mx-auto"
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>Écouter la bonne réponse</span>
                          </button>
                        </div>
                        
                        {/* Message d'encouragement */}
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                          <div className="text-lg">🌟</div>
                          <p className="text-sm font-semibold text-purple-800">
                            Maintenant tu sais ! En comptant bien, on trouve {exercises[currentExercise].correctAnswer} objets !
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation - Bouton Suivant (seulement si mauvaise réponse) */}
              {isCorrect === false && currentExercise + 1 < exercises.length && (
                <div className="flex justify-center mt-6">
                  <button
                    id="next-button"
                    onClick={nextExercise}
                    className={`bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-all ${
                      highlightedElement === 'next-button' 
                        ? 'ring-4 ring-yellow-400 shadow-2xl scale-110 bg-green-600 animate-pulse' 
                        : ''
                    }`}
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
                  if (percentage >= 90) return { title: "🎉 Champion du comptage !", message: "Tu sais parfaitement compter jusqu'à 20 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comptes de mieux en mieux ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Le comptage demande de l'entraînement !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux apprendre à compter !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 10 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Bien compter, c'est la base des mathématiques !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
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