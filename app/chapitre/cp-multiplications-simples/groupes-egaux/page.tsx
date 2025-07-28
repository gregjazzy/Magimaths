'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Book, Target, Shuffle } from 'lucide-react';

export default function GroupesEgauxCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'scattered' | 'sorting' | 'grouped' | 'counting' | null>(null);
  const [animatingObjects, setAnimatingObjects] = useState(false);
  const [groupingStep, setGroupingStep] = useState<'individual' | 'moving' | 'formed' | 'result' | null>(null);
  
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

  // Exemples de groupes égaux
  const groupExamples = [
    { 
      item: '🐣', 
      totalItems: 12,
      groups: 4, 
      itemsPerGroup: 3, 
      description: 'poussins',
      story: 'Les poussins vont dans 4 nids de 3 poussins chacun',
      container: '🪺'
    },
    { 
      item: '🌸', 
      totalItems: 15,
      groups: 5, 
      itemsPerGroup: 3, 
      description: 'fleurs',
      story: '5 bouquets de 3 fleurs chacun',
      container: '💐'
    },
    { 
      item: '🍪', 
      totalItems: 16,
      groups: 4, 
      itemsPerGroup: 4, 
      description: 'cookies',
      story: '4 assiettes de 4 cookies chacune',
      container: '🍽️'
    },
    { 
      item: '⚽', 
      totalItems: 10,
      groups: 5, 
      itemsPerGroup: 2, 
      description: 'ballons',
      story: '5 équipes de 2 ballons chacune',
      container: '🏟️'
    }
  ];

  // Exercices sur les groupes égaux
  const exercises = [
    { 
      question: 'Qu\'est-ce qu\'un groupe égal ?', 
      correctAnswer: 'Un groupe qui a le même nombre d\'objets qu\'un autre',
      choices: ['Un groupe plus grand', 'Un groupe qui a le même nombre d\'objets qu\'un autre', 'Un groupe plus petit']
    },
    { 
      question: 'Combien de poussins dans chaque nid ?', 
      correctAnswer: '3',
      choices: ['2', '3', '4'],
      visual: '🪺🐣🐣🐣 | 🪺🐣🐣🐣 | 🪺🐣🐣🐣'
    },
    { 
      question: 'Combien de groupes égaux peux-tu faire avec 8 bonbons en mettant 2 bonbons par groupe ?', 
      correctAnswer: '4',
      choices: ['3', '4', '5'],
      visual: '🍬🍬🍬🍬🍬🍬🍬🍬 → groupes de 2'
    },
    { 
      question: 'Si tu as 3 boîtes avec 4 crayons chacune, combien as-tu de crayons en tout ?', 
      correctAnswer: '12',
      choices: ['7', '12', '10'],
      visual: '📦4 + 📦4 + 📦4 = ?'
    },
    { 
      question: 'Pour faire des groupes égaux, chaque groupe doit avoir...', 
      correctAnswer: 'Le même nombre d\'objets',
      choices: ['Des objets différents', 'Le même nombre d\'objets', 'Plus d\'objets que les autres']
    },
    { 
      question: 'Combien de groupes de 3 peux-tu faire avec 15 étoiles ?', 
      correctAnswer: '5',
      choices: ['4', '5', '6'],
      visual: '⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ → groupes de 3'
    },
    { 
      question: 'Dans 4 groupes de 5 objets, combien y a-t-il d\'objets en tout ?', 
      correctAnswer: '20',
      choices: ['15', '20', '25'],
      visual: '[5][5][5][5] = ?'
    },
    { 
      question: 'Quel est l\'avantage des groupes égaux ?', 
      correctAnswer: 'C\'est plus facile à compter',
      choices: ['C\'est plus difficile', 'C\'est plus facile à compter', 'C\'est pareil']
    }
  ];

  // Fonction pour attendre
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Fonction pour défiler vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setShowingProcess(null);
    setAnimatingObjects(false);
    setGroupingStep(null);
  };

  // Fonction pour jouer l'audio
  const playAudio = async (text: string, slowMode = false) => {
    if (stopSignalRef.current) return;
    
    return new Promise<void>((resolve) => {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const setVoiceAndSpeak = () => {
        const voices = speechSynthesis.getVoices();
        const frenchFemaleVoice = voices.find(voice => 
          voice.lang.startsWith('fr') && voice.name.toLowerCase().includes('female')
        ) || voices.find(voice => voice.lang.startsWith('fr'));
        
        if (frenchFemaleVoice) {
          utterance.voice = frenchFemaleVoice;
        }
        
        utterance.rate = slowMode ? 0.8 : 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
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
        
        setIsPlayingVocal(true);
        currentAudioRef.current = utterance;
        speechSynthesis.speak(utterance);
      };
      
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });
      } else {
        setVoiceAndSpeak();
      }
    });
  };

  // Fonction principale d'explication
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);
    
    try {
      // 1. Introduction
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre à faire des groupes égaux !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Faire des groupes égaux, c'est mettre le même nombre d'objets dans chaque groupe !", true);
      if (stopSignalRef.current) return;
      
      // 2. Concept des groupes égaux
      await wait(1500);
      setHighlightedElement('concept');
      scrollToSection('concept-section');
      await playAudio("Regardez ! Au lieu d'avoir des objets mélangés, on va les organiser proprement !", true);
      if (stopSignalRef.current) return;
      
      // 3. Animation du premier exemple
      await wait(1800);
      setHighlightedElement('demo');
      scrollToSection('animation-section');
      await playAudio("Faisons l'expérience avec les poussins et leurs nids !", true);
      if (stopSignalRef.current) return;
      
      await animateGrouping(0);
      if (stopSignalRef.current) return;
      
      // 4. Avantages
      await wait(1500);
      setHighlightedElement('avantages');
      scrollToSection('avantages-section');
      await playAudio("Avec des groupes égaux, c'est beaucoup plus facile de compter ! Et c'est plus joli aussi !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setShowingProcess(null);
      setAnimatingObjects(false);
      setGroupingStep(null);
      setIsAnimationRunning(false);
    }
  };

  // Animation de groupement
  const animateGrouping = async (index: number) => {
    const example = groupExamples[index];
    setCurrentExample(index);
    
    try {
      // Étape 1: Objets éparpillés
      setGroupingStep('individual');
      setAnimatingObjects(true);
      await playAudio(`Voici ${example.totalItems} ${example.description} tout mélangés !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2500);
      
      // Étape 2: Déplacement vers les groupes
      setGroupingStep('moving');
      await playAudio(`Maintenant, on va les ranger dans ${example.groups} groupes de ${example.itemsPerGroup} ${example.description} chacun !`, true);
      if (stopSignalRef.current) return;
      
      await wait(3000);
      
      // Étape 3: Groupes formés
      setGroupingStep('formed');
      await playAudio(`Regardez comme c'est bien organisé ! Chaque groupe a exactement ${example.itemsPerGroup} ${example.description} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2500);
      
      // Étape 4: Comptage final
      setGroupingStep('result');
      await playAudio(`C'est parfait ! ${example.groups} groupes de ${example.itemsPerGroup}, ça fait ${example.totalItems} ${example.description} en tout !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
    } finally {
      setAnimatingObjects(false);
      setGroupingStep(null);
    }
  };

  // Fonctions pour les exercices
  const checkAnswer = () => {
    const exercise = exercises[currentExercise];
    const correct = userAnswer === exercise.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
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
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  const getCompletionMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "🏆 Fantastique ! Tu maîtrises parfaitement les groupes égaux !";
    if (percentage >= 80) return "🌟 Excellent ! Tu sais très bien faire des groupes égaux !";
    if (percentage >= 60) return "👍 Bien joué ! Continue à t'entraîner !";
    return "💪 C'est un bon début ! Refais les exercices pour mieux comprendre !";
  };

  // Effets
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stopAllVocalsAndAnimations();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
      <div className="text-xl text-blue-600">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/chapitre/cp-multiplications-simples"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={stopAllVocalsAndAnimations}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au chapitre</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              👥 Groupes égaux
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Navigation Cours/Exercices */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Book className="w-4 h-4 inline mr-2" />
              Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                showExercises 
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Exercices
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Bouton principal */}
            <div className="text-center mb-6">
              <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ APPRENDRE LES GROUPES ÉGAUX !'}
              </button>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'intro' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Qu'est-ce qu'un groupe égal ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-red-600 mb-4">❌ Groupes inégaux</h3>
                  <div className="bg-red-100 rounded-lg p-6">
                    <div className="text-lg mb-4">Pas bien organisé :</div>
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-red-300 rounded p-2">
                        <span className="text-2xl">🍎🍎🍎🍎🍎</span>
                        <div className="text-sm text-red-600">5 pommes</div>
                      </div>
                      <div className="border-2 border-dashed border-red-300 rounded p-2">
                        <span className="text-2xl">🍎🍎</span>
                        <div className="text-sm text-red-600">2 pommes</div>
                      </div>
                      <div className="border-2 border-dashed border-red-300 rounded p-2">
                        <span className="text-2xl">🍎</span>
                        <div className="text-sm text-red-600">1 pomme</div>
                      </div>
                    </div>
                    <p className="text-red-600 mt-3 font-semibold">Difficile à compter !</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-600 mb-4">✅ Groupes égaux</h3>
                  <div className="bg-green-100 rounded-lg p-6">
                    <div className="text-lg mb-4">Bien organisé :</div>
                    <div className="space-y-2">
                      <div className="border-2 border-green-300 rounded p-2 bg-white">
                        <span className="text-2xl">🍎🍎🍎</span>
                        <div className="text-sm text-green-600">3 pommes</div>
                      </div>
                      <div className="border-2 border-green-300 rounded p-2 bg-white">
                        <span className="text-2xl">🍎🍎🍎</span>
                        <div className="text-sm text-green-600">3 pommes</div>
                      </div>
                      <div className="border-2 border-green-300 rounded p-2 bg-white">
                        <span className="text-2xl">🍎🍎</span>
                        <div className="text-sm text-green-600">2 pommes</div>
                      </div>
                    </div>
                    <p className="text-green-600 mt-3 font-semibold">Facile à compter !</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Concept détaillé */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept' ? 'ring-4 ring-cyan-400 bg-cyan-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Comment faire des groupes égaux ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center bg-blue-100 rounded-xl p-6">
                  <div className="text-4xl mb-4">1️⃣</div>
                  <h3 className="font-bold text-blue-800 mb-3">Décider</h3>
                  <p className="text-blue-700">
                    On décide combien d'objets on veut dans chaque groupe
                  </p>
                  <div className="mt-4 text-2xl">🤔</div>
                </div>
                <div className="text-center bg-green-100 rounded-xl p-6">
                  <div className="text-4xl mb-4">2️⃣</div>
                  <h3 className="font-bold text-green-800 mb-3">Organiser</h3>
                  <p className="text-green-700">
                    On range les objets dans des groupes avec le même nombre
                  </p>
                  <div className="mt-4 text-2xl">📦</div>
                </div>
                <div className="text-center bg-purple-100 rounded-xl p-6">
                  <div className="text-4xl mb-4">3️⃣</div>
                  <h3 className="font-bold text-purple-800 mb-3">Vérifier</h3>
                  <p className="text-purple-700">
                    On vérifie que chaque groupe a bien le même nombre
                  </p>
                  <div className="mt-4 text-2xl">✅</div>
                </div>
              </div>
            </div>

            {/* Zone d'animation */}
            <div 
              id="animation-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'demo' ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎬 Animation : Formation des groupes
              </h2>
              
              {currentExample !== null && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {groupExamples[currentExample].story}
                    </h3>
                  </div>

                  {/* Affichage selon l'étape */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-200 min-h-96 w-full max-w-4xl">
                      
                      {groupingStep === 'individual' && (
                        <div className="text-center">
                          <p className="text-lg font-semibold mb-6 text-gray-700">
                            {groupExamples[currentExample].totalItems} {groupExamples[currentExample].description} éparpillés :
                          </p>
                          <div className="flex flex-wrap justify-center gap-3 mb-6">
                            {Array.from({length: groupExamples[currentExample].totalItems}).map((_, i) => (
                              <span 
                                key={i} 
                                className="text-4xl animate-bounce transform hover:scale-125 transition-all cursor-pointer" 
                                style={{
                                  animationDelay: `${i * 0.1}s`,
                                  transform: `rotate(${Math.random() * 30 - 15}deg) translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`
                                }}
                              >
                                {groupExamples[currentExample].item}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-center">
                            <button
                              onClick={() => setGroupingStep('moving')}
                              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2"
                            >
                              <Shuffle className="w-5 h-5" />
                              Commencer à organiser
                            </button>
                          </div>
                        </div>
                      )}

                      {groupingStep === 'moving' && (
                        <div className="text-center">
                          <p className="text-lg font-semibold mb-6 text-gray-700">
                            Formation des groupes en cours...
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Array.from({length: groupExamples[currentExample].groups}).map((_, groupIndex) => (
                              <div key={groupIndex} className="text-center">
                                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-blue-300 min-h-32 flex flex-col justify-center">
                                  <div className="text-2xl mb-2">{groupExamples[currentExample].container}</div>
                                  <div className="text-sm text-gray-600 mb-3">Groupe {groupIndex + 1}</div>
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {Array.from({length: groupExamples[currentExample].itemsPerGroup}).map((_, itemIndex) => (
                                      <span 
                                        key={itemIndex} 
                                        className="text-2xl animate-pulse"
                                        style={{animationDelay: `${(groupIndex * groupExamples[currentExample].itemsPerGroup + itemIndex) * 0.2}s`}}
                                      >
                                        {groupExamples[currentExample].item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6">
                            <button
                              onClick={() => setGroupingStep('formed')}
                              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
                            >
                              Groupes formés !
                            </button>
                          </div>
                        </div>
                      )}

                      {groupingStep === 'formed' && (
                        <div className="text-center">
                          <p className="text-lg font-semibold mb-6 text-gray-700">
                            Groupes égaux bien organisés :
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            {Array.from({length: groupExamples[currentExample].groups}).map((_, groupIndex) => (
                              <div key={groupIndex} className="text-center">
                                <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
                                  <div className="text-2xl mb-2">{groupExamples[currentExample].container}</div>
                                  <div className="text-sm text-green-600 mb-3 font-semibold">
                                    Groupe {groupIndex + 1}
                                  </div>
                                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                                    {Array.from({length: groupExamples[currentExample].itemsPerGroup}).map((_, itemIndex) => (
                                      <span key={itemIndex} className="text-2xl">
                                        {groupExamples[currentExample].item}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="text-sm font-bold text-green-700">
                                    {groupExamples[currentExample].itemsPerGroup} {groupExamples[currentExample].description}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-300">
                            <p className="text-lg font-bold text-blue-800">
                              ✅ Chaque groupe a exactement {groupExamples[currentExample].itemsPerGroup} {groupExamples[currentExample].description} !
                            </p>
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={() => setGroupingStep('result')}
                              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600"
                            >
                              Compter le total
                            </button>
                          </div>
                        </div>
                      )}

                      {groupingStep === 'result' && (
                        <div className="text-center">
                          <p className="text-xl font-bold mb-6 text-purple-700">
                            Résultat final :
                          </p>
                          <div className="bg-purple-100 rounded-xl p-6 border-2 border-purple-300 mb-6">
                            <div className="text-3xl font-bold text-purple-800 mb-4">
                              {groupExamples[currentExample].groups} groupes × {groupExamples[currentExample].itemsPerGroup} {groupExamples[currentExample].description} = {groupExamples[currentExample].totalItems} {groupExamples[currentExample].description}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Array.from({length: groupExamples[currentExample].groups}).map((_, groupIndex) => (
                                <div key={groupIndex} className="bg-white rounded-lg p-3 border border-purple-200">
                                  <div className="text-lg mb-1">{groupExamples[currentExample].container}</div>
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {Array.from({length: groupExamples[currentExample].itemsPerGroup}).map((_, itemIndex) => (
                                      <span key={itemIndex} className="text-xl">
                                        {groupExamples[currentExample].item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
                            <p className="text-lg font-bold text-green-800">
                              🎉 Bravo ! Avec les groupes égaux, c'est beaucoup plus facile à compter !
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Boutons pour tester d'autres exemples */}
                  <div className="flex justify-center space-x-4">
                    {groupExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => !isAnimationRunning && animateGrouping(index)}
                        disabled={isAnimationRunning}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          isAnimationRunning 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : currentExample === index 
                              ? 'bg-yellow-400 text-yellow-900 border-2 border-yellow-600' 
                              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {example.item} {example.description}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avantages des groupes égaux */}
            <div 
              id="avantages-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'avantages' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ⭐ Pourquoi faire des groupes égaux ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-bold text-green-800 mb-3">Plus rapide</h3>
                  <p className="text-green-700">
                    On compte plus vite : 3 groupes de 4 = 12
                  </p>
                  <div className="text-sm text-green-600 mt-2">Au lieu de 1,2,3,4,5,6,7,8,9,10,11,12</div>
                </div>
                <div className="bg-blue-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-bold text-blue-800 mb-3">Plus précis</h3>
                  <p className="text-blue-700">
                    On fait moins d'erreurs car c'est bien organisé
                  </p>
                  <div className="text-sm text-blue-600 mt-2">Moins de risque d'oublier ou de compter 2 fois</div>
                </div>
                <div className="bg-purple-100 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="font-bold text-purple-800 mb-3">Plus joli</h3>
                  <p className="text-purple-700">
                    C'est bien rangé et agréable à regarder
                  </p>
                  <div className="text-sm text-purple-600 mt-2">Comme dans un magasin bien organisé</div>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                🎯 Ce qu'il faut retenir
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-semibold">Groupes égaux</div>
                  <div className="text-sm">Même nombre dans chaque groupe</div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">Organisation</div>
                  <div className="text-sm">Ranger pour mieux compter</div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">🧮</div>
                  <div className="font-semibold">Multiplication</div>
                  <div className="text-sm">Préparation pour × et ÷</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="text-lg font-semibold text-cyan-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
                    <div className="text-xl text-center font-semibold text-cyan-800">
                      {exercises[currentExercise].question}
                    </div>
                    {exercises[currentExercise].visual && (
                      <div className="text-center mt-4 text-xl bg-white rounded-lg p-4 border border-cyan-200">
                        {exercises[currentExercise].visual}
                      </div>
                    )}
                  </div>

                  {/* Choix de réponses */}
                  <div className="space-y-3">
                    {exercises[currentExercise].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(choice)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          userAnswer === choice
                            ? 'border-cyan-500 bg-cyan-100 text-cyan-800'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-cyan-300 hover:bg-cyan-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            userAnswer === choice ? 'border-cyan-500 bg-cyan-500' : 'border-gray-400'
                          }`}>
                            {userAnswer === choice && (
                              <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                            )}
                          </div>
                          <span className="text-lg">{choice}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Bouton validation */}
                  <div className="text-center">
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                      className="bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Vérifier ma réponse
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
                        <span className="text-xl font-bold">
                          {isCorrect ? 'Parfait !' : 'Presque...'}
                        </span>
                      </div>
                      <div className="font-semibold mb-3">
                        {isCorrect 
                          ? "Tu maîtrises bien les groupes égaux !"
                          : `La bonne réponse était : "${exercises[currentExercise].correctAnswer}"`
                        }
                      </div>
                      
                      <button
                        onClick={nextExercise}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600"
                      >
                        {currentExercise < exercises.length - 1 ? 'Question suivante' : 'Voir mes résultats'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Modal de fin */
                <div className="text-center space-y-6">
                  <div className="text-6xl">🎉</div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Exercices terminés !
                  </h2>
                  <div className="text-2xl font-bold text-cyan-600">
                    Score final : {finalScore} / {exercises.length}
                  </div>
                  <div className="text-lg text-gray-700">
                    {getCompletionMessage(finalScore, exercises.length)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Retour au cours
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 