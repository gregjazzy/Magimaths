'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function ProblemesSimples() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'reading' | 'understanding' | 'calculation' | 'result' | null>(null);
  const [animatingObjects, setAnimatingObjects] = useState(false);
  const [objectsStep, setObjectsStep] = useState<'situation' | 'groups' | 'multiplication' | 'result' | null>(null);
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des exemples de problèmes
  const problemExamples = [
    { 
      item: '🍎', 
      situation: "Au marché, il y a 3 caisses de pommes. Dans chaque caisse, il y a 4 pommes.", 
      question: "Combien de pommes y a-t-il en tout ?",
      groups: 3, 
      itemsPerGroup: 4, 
      result: 12, 
      description: 'pommes',
      calculation: '3 × 4 = 12',
      icon: '📦'
    },
    { 
      item: '🚗', 
      situation: "Dans le parking, il y a 2 rangées de voitures. Dans chaque rangée, il y a 5 voitures.", 
      question: "Combien de voitures y a-t-il au total ?",
      groups: 2, 
      itemsPerGroup: 5, 
      result: 10, 
      description: 'voitures',
      calculation: '2 × 5 = 10',
      icon: '🅿️'
    },
    { 
      item: '⭐', 
      situation: "Sur le tableau, il y a 4 lignes d'étoiles. Sur chaque ligne, il y a 3 étoiles.", 
      question: "Combien d'étoiles y a-t-il en tout ?",
      groups: 4, 
      itemsPerGroup: 3, 
      result: 12, 
      description: 'étoiles',
      calculation: '4 × 3 = 12',
      icon: '📋'
    },
    { 
      item: '🎾', 
      situation: "Le professeur de sport a 3 sacs de balles. Dans chaque sac, il y a 6 balles.", 
      question: "Combien de balles a-t-il en tout ?",
      groups: 3, 
      itemsPerGroup: 6, 
      result: 18, 
      description: 'balles',
      calculation: '3 × 6 = 18',
      icon: '🎒'
    },
    { 
      item: '🧸', 
      situation: "Dans le magasin, il y a 2 étagères de nounours. Sur chaque étagère, il y a 7 nounours.", 
      question: "Combien de nounours y a-t-il au total ?",
      groups: 2, 
      itemsPerGroup: 7, 
      result: 14, 
      description: 'nounours',
      calculation: '2 × 7 = 14',
      icon: '🏪'
    }
  ];

  // Exercices sur les problèmes de multiplication
  const exercises = [
    { 
      question: 'Que dois-tu faire quand tu lis un problème ?', 
      correctAnswer: 'Bien comprendre la situation',
      choices: ['Calculer tout de suite', 'Bien comprendre la situation', 'Deviner la réponse']
    },
    { 
      question: 'Dans un problème de multiplication, que cherches-tu ?', 
      correctAnswer: 'Le nombre total d\'objets',
      choices: ['Le premier groupe', 'Le nombre total d\'objets', 'Le nombre de groupes']
    },
    { 
      question: 'Il y a 3 boîtes avec 4 bonbons chacune. Combien de bonbons en tout ?', 
      correctAnswer: '12',
      choices: ['7', '12', '3'],
      visual: '📦📦📦 avec 🍬🍬🍬🍬 dans chaque boîte'
    },
    { 
      question: 'Pour résoudre "2 groupes de 5", quelle multiplication fais-tu ?', 
      correctAnswer: '2 × 5',
      choices: ['2 + 5', '2 × 5', '5 - 2']
    },
    { 
      question: 'Dans une classe, il y a 4 tables avec 3 élèves à chaque table. Combien d\'élèves ?', 
      correctAnswer: '12',
      choices: ['7', '12', '4'],
      visual: '🪑🪑🪑🪑 avec 👶👶👶 à chaque table'
    },
    { 
      question: 'Quand tu vois "chaque" dans un problème, tu penses à...', 
      correctAnswer: 'La multiplication',
      choices: ['L\'addition simple', 'La multiplication', 'La soustraction']
    },
    { 
      question: 'Pour vérifier ta réponse, tu peux...', 
      correctAnswer: 'Compter tous les objets un par un',
      choices: ['Ne rien faire', 'Compter tous les objets un par un', 'Recommencer le calcul']
    },
    { 
      question: '5 groupes de 2 objets font combien d\'objets en tout ?', 
      correctAnswer: '10',
      choices: ['7', '10', '5'],
      visual: '🎁🎁 🎁🎁 🎁🎁 🎁🎁 🎁🎁'
    },
    { 
      question: 'Dans "3 × 4 = 12", que représente le 12 ?', 
      correctAnswer: 'Le total final',
      choices: ['Le nombre de groupes', 'Le total final', 'Le nombre par groupe']
    },
    { 
      question: 'Les problèmes de multiplication t\'aident à...', 
      correctAnswer: 'Calculer rapidement des totaux',
      choices: ['Faire des soustractions', 'Calculer rapidement des totaux', 'Partager équitablement']
    }
  ];

  // Fonction pour arrêter toutes les animations et vocaux
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
    
    // Reset de tous les états d'animation et de vocal
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedNumber(null);
    setShowingProcess(null);
    setAnimatingObjects(false);
    setObjectsStep(null);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      
      // 🍎 FORCE APPLE SYSTEM VOICES ONLY - Diagnostic logs
      console.log('🔍 Toutes les voix disponibles:');
      voices.forEach(voice => {
        console.log(`  ${voice.name} (${voice.lang}) [Local: ${voice.localService}] [Default: ${voice.default}]`);
      });
      
      // 🎯 PRIORITÉ ABSOLUE: Voix système Apple françaises uniquement
      const appleVoices = voices.filter(voice => 
        voice.localService === true && 
        (voice.lang === 'fr-FR' || voice.lang === 'fr')
      );
      
      console.log('🍎 Voix Apple système françaises trouvées:', appleVoices.map(v => v.name));
      
      const femaleVoiceNames = ['Amélie', 'Audrey', 'Marie', 'Julie', 'Céline', 'Virginie', 'Pauline', 'Lucie'];
      
      // 1. Recherche voix féminine Apple française
      let selectedVoice = appleVoices.find(voice => 
        femaleVoiceNames.some(name => voice.name.includes(name))
      );
      
      // 2. Fallback: N'importe quelle voix Apple française
      if (!selectedVoice) {
        selectedVoice = appleVoices.find(voice => 
          voice.lang === 'fr-FR' || voice.lang === 'fr'
        );
      }
      
      // 3. Fallback: Voix Apple par défaut (même si pas française)
      if (!selectedVoice) {
        const defaultAppleVoice = voices.find(voice => 
          voice.localService === true && voice.default === true
        );
        if (defaultAppleVoice) {
          selectedVoice = defaultAppleVoice;
          console.log('⚠️ Utilisation voix Apple par défaut (non française):', defaultAppleVoice.name);
        }
      }
      
      // 4. Dernier recours: Première voix Apple disponible
      if (!selectedVoice && appleVoices.length > 0) {
        selectedVoice = appleVoices[0];
        console.log('⚠️ Utilisation première voix Apple disponible:', selectedVoice.name);
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('✅ Voix sélectionnée (Apple système):', selectedVoice.name, '(', selectedVoice.lang, ')');
      } else {
        console.log('❌ AUCUNE VOIX APPLE SYSTÈME TROUVÉE - TTS peut échouer');
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

  // Fonction utilitaire pour les pauses
  const wait = (ms: number) => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve(undefined);
        return;
      }
      setTimeout(resolve, ms);
    });
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Fonction pour rendre les objets avec animations
  const renderObjects = (count: number, item: string) => {
    if (count <= 0) return null;
    
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(
        <span
          key={i}
          className="text-4xl inline-block transition-all duration-300 animate-bounce"
          style={{ 
            animationDelay: `${i * 100}ms`,
            transform: highlightedNumber === count ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          {item}
        </span>
      );
    }
    return objects;
  };

  // Fonction pour rendre un groupe d'objets
  const renderGroup = (count: number, item: string, groupIndex: number) => {
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(
        <span
          key={`${groupIndex}-${i}`}
          className="text-3xl inline-block transition-all duration-500 animate-bounce"
          style={{ 
            animationDelay: `${(groupIndex * count + i) * 150}ms`
          }}
        >
          {item}
        </span>
      );
    }
    return objects;
  };

  // Animation principale pour expliquer un problème spécifique
  const explainSpecificProblem = async (problemIndex: number) => {
    if (isAnimationRunning) return;
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(problemIndex);
    setAnimatingObjects(true);
    
    const problem = problemExamples[problemIndex];
    
    try {
      // 1. Lecture du problème
      setObjectsStep('situation');
      scrollToSection('main-animation');
      await playAudio(problem.situation + " " + problem.question);
      await wait(500);
      
      if (stopSignalRef.current) return;
      
      // 2. Montrer les groupes
      setObjectsStep('groups');
      await playAudio(`Je vois ${problem.groups} groupes. Dans chaque groupe, il y a ${problem.itemsPerGroup} ${problem.description}.`);
      await wait(1000);
      
      if (stopSignalRef.current) return;
      
      // 3. Expliquer la multiplication
      setObjectsStep('multiplication');
      await playAudio(`Je peux calculer avec une multiplication : ${problem.groups} fois ${problem.itemsPerGroup} égale combien ?`);
      await wait(1000);
      
      if (stopSignalRef.current) return;
      
      // 4. Montrer le résultat
      setObjectsStep('result');
      await playAudio(`${problem.calculation}. Il y a ${problem.result} ${problem.description} en tout !`);
      await wait(2000);
      
    } catch (error) {
      console.error('Erreur dans l\'animation:', error);
    } finally {
      if (!stopSignalRef.current) {
        setIsAnimationRunning(false);
        setAnimatingObjects(false);
        setObjectsStep(null);
      }
    }
  };

  // Fonction pour démarrer la leçon complète
  const startMainLesson = async () => {
    if (isAnimationRunning) return;
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);
    
    try {
      // Introduction générale
      setHighlightedElement('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à résoudre des problèmes avec la multiplication !");
      await wait(500);
      
      if (stopSignalRef.current) return;
      
      // Explication des problèmes
      await playAudio("Un problème, c'est une situation de la vie de tous les jours où nous devons utiliser les mathématiques.");
      await wait(1000);
      
      if (stopSignalRef.current) return;
      
      // Étapes pour résoudre
      await playAudio("Pour résoudre un problème, nous allons suivre 4 étapes importantes.");
      await wait(500);
      
      if (stopSignalRef.current) return;
      
      // Montrer les exemples
      setHighlightedElement('examples-section');
      scrollToSection('examples-section');
      await playAudio("Regardons maintenant des exemples de problèmes et comment les résoudre !");
      
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans la leçon principale:', error);
    } finally {
      if (!stopSignalRef.current) {
        setIsAnimationRunning(false);
      }
    }
  };

  // Fonction pour démarrer les exercices
  const startExercises = async () => {
    setShowExercises(true);
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    
    scrollToSection('exercises-section');
    await playAudio("Maintenant, c'est à toi de résoudre des problèmes ! Clique sur la bonne réponse.");
  };

  // Fonction pour vérifier la réponse
  const checkAnswer = async (selectedAnswer: string) => {
    const correct = selectedAnswer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    setUserAnswer(selectedAnswer);
    
    if (correct) {
      const newAnsweredCorrectly = new Set(answeredCorrectly);
      newAnsweredCorrectly.add(currentExercise);
      setAnsweredCorrectly(newAnsweredCorrectly);
      setScore(newAnsweredCorrectly.size);
      
      await playAudio("Excellent ! Tu as trouvé la bonne réponse !");
    } else {
      await playAudio(`Ce n'est pas la bonne réponse. La bonne réponse est : ${exercises[currentExercise].correctAnswer}`);
    }
    
    // Passer automatiquement à la question suivante après un délai
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        setFinalScore(score + (correct ? 1 : 0));
        setShowCompletionModal(true);
      }
    }, 3000);
  };

  // Fonction pour redémarrer les exercices
  const resetExercises = () => {
    setShowExercises(false);
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Effets pour la gestion client-side et cleanup
  useEffect(() => {
    setIsClient(true);
    
    return () => {
      stopAllVocalsAndAnimations();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopAllVocalsAndAnimations();
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
      {/* En-tête */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/chapitre/cp-multiplications-simples"
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour au chapitre
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Problèmes simples</h1>
                <p className="text-gray-600">Résoudre des situations avec la multiplication</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={isAnimationRunning ? stopAllVocalsAndAnimations : startMainLesson}
                disabled={!isClient}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  isAnimationRunning
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                }`}
              >
                {isPlayingVocal ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {hasStarted ? 'Reprendre la leçon' : 'Commencer la leçon !'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Section d'introduction */}
        <div 
          id="intro-section"
          className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
            highlightedElement === 'intro-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
            🎯 Les Problèmes de Multiplication
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  📖 Qu'est-ce qu'un problème ?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Un problème, c'est une <strong>situation de la vie de tous les jours</strong> 
                  où nous devons utiliser les mathématiques pour trouver une réponse.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  🔍 Comment reconnaître ?
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Il y a des <strong>groupes égaux</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    On répète <strong>la même quantité</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    On cherche <strong>le total</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  📝 Les 4 étapes pour résoudre
                </h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <span><strong>Je lis</strong> attentivement le problème</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <span><strong>Je cherche</strong> les groupes égaux</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <span><strong>J'écris</strong> la multiplication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    <span><strong>Je calcule</strong> le résultat</span>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-red-100 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  💡 Mots-clés utiles
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded font-semibold">chaque</span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded font-semibold">par</span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded font-semibold">rangées</span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded font-semibold">groupes</span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded font-semibold">en tout</span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded font-semibold">total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animation principale */}
        <div 
          id="main-animation"
          className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
            highlightedElement === 'main-animation' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            🎬 Animation du problème
          </h2>

          {animatingObjects && currentExample !== null ? (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {problemExamples[currentExample].situation}
                </h3>
                <div className="text-lg text-blue-600 font-semibold">
                  {problemExamples[currentExample].question}
                </div>
              </div>

              {/* Étape 1: Situation */}
              {objectsStep === 'situation' && (
                <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-yellow-100 ring-4 ring-yellow-400 scale-105`}>
                  <h4 className="text-2xl font-bold text-yellow-800 mb-4">📖 Je lis le problème</h4>
                  <div className="text-6xl mb-4">{problemExamples[currentExample].icon}</div>
                  <div className="text-lg text-yellow-700">
                    Je comprends la situation...
                  </div>
                </div>
              )}

              {/* Étape 2: Groupes */}
              {objectsStep === 'groups' && (
                <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-purple-100 ring-4 ring-purple-400 scale-105`}>
                  <h4 className="text-2xl font-bold text-purple-800 mb-4">👀 Je vois les groupes</h4>
                  <div className="flex justify-center gap-6 mb-4">
                    {Array.from({length: problemExamples[currentExample].groups}, (_, groupIndex) => (
                      <div key={groupIndex} className="bg-white rounded-lg p-4 border-2 border-purple-300">
                        <div className="text-xl mb-2">{problemExamples[currentExample].icon}</div>
                        <div className="grid grid-cols-2 gap-1">
                          {renderGroup(problemExamples[currentExample].itemsPerGroup, problemExamples[currentExample].item, groupIndex)}
                        </div>
                        <div className="text-sm text-purple-600 mt-2 font-bold">
                          {problemExamples[currentExample].itemsPerGroup} {problemExamples[currentExample].description}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-lg text-purple-700">
                    {problemExamples[currentExample].groups} groupes de {problemExamples[currentExample].itemsPerGroup} {problemExamples[currentExample].description}
                  </div>
                </div>
              )}

              {/* Étape 3: Multiplication */}
              {objectsStep === 'multiplication' && (
                <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-orange-100 ring-4 ring-orange-400 scale-105`}>
                  <h4 className="text-2xl font-bold text-orange-800 mb-4">🧮 Je calcule</h4>
                  <div className="text-4xl font-bold text-orange-700 mb-4">
                    {problemExamples[currentExample].groups} × {problemExamples[currentExample].itemsPerGroup} = ?
                  </div>
                  <div className="text-lg text-orange-600">
                    {problemExamples[currentExample].groups} groupes fois {problemExamples[currentExample].itemsPerGroup} objets
                  </div>
                </div>
              )}

              {/* Étape 4: Résultat */}
              {objectsStep === 'result' && (
                <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-green-100 ring-4 ring-green-400 scale-105`}>
                  <h4 className="text-2xl font-bold text-green-800 mb-4">🎉 Résultat !</h4>
                  <div className="mb-4">
                    {renderObjects(problemExamples[currentExample].result, problemExamples[currentExample].item)}
                  </div>
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    {problemExamples[currentExample].calculation}
                  </div>
                  <div className="text-lg text-green-600">
                    En tout : {problemExamples[currentExample].result} {problemExamples[currentExample].description} !
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Version statique quand pas d'animation */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">3 caisses</div>
                <div className="text-4xl mb-2">📦📦📦</div>
                <div className="text-xl font-bold text-purple-800 mt-2">3</div>
              </div>
              <div className="text-center flex items-center justify-center">
                <div className="text-6xl font-bold text-green-600">×</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">4 pommes chacune</div>
                {renderObjects(4, '🍎')}
                <div className="text-xl font-bold text-pink-800 mt-2">4</div>
              </div>
            </div>
          )}
        </div>

        {/* Autres exemples */}
        <div 
          id="examples-section"
          className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
            highlightedElement === 'examples-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            🌟 Autres exemples de problèmes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemExamples.map((example, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 transition-all duration-300 ${
                  isAnimationRunning 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''}`}
                onClick={isAnimationRunning ? undefined : () => explainSpecificProblem(index)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{example.item}</div>
                  <div className="font-bold text-lg text-gray-800 mb-2">
                    {example.calculation}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {example.description}
                  </div>
                  <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    isAnimationRunning 
                      ? 'bg-gray-400 text-gray-200' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}>
                    {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conseils pratiques */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4 text-center">
            💡 Conseils pour résoudre les problèmes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">📖</div>
              <div className="font-bold">Lis bien</div>
              <div className="text-sm">Comprends la situation</div>
            </div>
            <div>
              <div className="text-3xl mb-2">👀</div>
              <div className="font-bold">Cherche les groupes</div>
              <div className="text-sm">Combien de groupes égaux ?</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🧮</div>
              <div className="font-bold">Utilise la multiplication</div>
              <div className="text-sm">Plus rapide que l'addition !</div>
            </div>
          </div>
        </div>

        {/* Section exercices */}
        {!showExercises ? (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              ✏️ Prêt(e) pour les exercices ?
            </h2>
            <p className="text-gray-700 mb-6">
              Maintenant que tu comprends comment résoudre des problèmes, entraîne-toi !
            </p>
            <button
              onClick={startExercises}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl transition-colors hover:scale-105"
            >
              🎯 Commencer les exercices !
            </button>
          </div>
        ) : (
          <div 
            id="exercises-section"
            className="bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                ✏️ Exercices - Question {currentExercise + 1}/{exercises.length}
              </h2>
              <div className="text-right">
                <div className="text-sm text-gray-500">Score</div>
                <div className="text-2xl font-bold text-green-600">{score}/{exercises.length}</div>
              </div>
            </div>

            {!showCompletionModal ? (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    {exercises[currentExercise].question}
                  </h3>
                  
                  {exercises[currentExercise].visual && (
                    <div className="text-center mb-4 p-4 bg-white rounded border">
                      <div className="text-2xl">{exercises[currentExercise].visual}</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exercises[currentExercise].choices.map((choice, index) => {
                    let buttonClass = "p-4 rounded-lg border-2 transition-all text-center font-semibold hover:scale-105";
                    
                    if (userAnswer === choice) {
                      if (isCorrect) {
                        buttonClass += " bg-green-100 border-green-400 text-green-800";
                      } else {
                        buttonClass += " bg-red-100 border-red-400 text-red-800";
                      }
                    } else if (userAnswer && choice === exercises[currentExercise].correctAnswer) {
                      buttonClass += " bg-green-100 border-green-400 text-green-800";
                    } else {
                      buttonClass += " bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => !userAnswer && checkAnswer(choice)}
                        disabled={!!userAnswer}
                        className={buttonClass}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>

                {userAnswer && (
                  <div className={`p-4 rounded-lg text-center font-semibold ${
                    isCorrect 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {isCorrect 
                      ? '🎉 Excellent ! Tu as trouvé la bonne réponse !' 
                      : `🤔 La bonne réponse était : ${exercises[currentExercise].correctAnswer}`
                    }
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-6xl">🎉</div>
                <h3 className="text-2xl font-bold text-green-800">
                  Félicitations ! Tu as terminé tous les exercices !
                </h3>
                <div className="text-xl text-gray-700">
                  Score final : <span className="font-bold text-green-600">{finalScore}/{exercises.length}</span>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={resetExercises}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    🔄 Recommencer les exercices
                  </button>
                  <Link
                    href="/chapitre/cp-multiplications-simples"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    ✅ Retour au chapitre
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 