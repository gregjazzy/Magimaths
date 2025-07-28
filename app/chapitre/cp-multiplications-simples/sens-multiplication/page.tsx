'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Book, Target } from 'lucide-react';

export default function SensMultiplicationCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'grouping' | 'counting' | 'repeated' | null>(null);
  const [animatingObjects, setAnimatingObjects] = useState(false);
  const [groupStep, setGroupStep] = useState<'individual' | 'grouping' | 'result' | null>(null);
  
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

  // Exemples de multiplication avec groupes
  const multiplicationExamples = [
    { 
      item: '🍎', 
      groups: 3, 
      itemsPerGroup: 2, 
      result: 6, 
      description: 'pommes',
      story: '3 paniers avec 2 pommes chacun'
    },
    { 
      item: '🚗', 
      groups: 2, 
      itemsPerGroup: 4, 
      result: 8, 
      description: 'voitures',
      story: '2 parkings avec 4 voitures chacun'
    },
    { 
      item: '⭐', 
      groups: 4, 
      itemsPerGroup: 3, 
      result: 12, 
      description: 'étoiles',
      story: '4 groupes de 3 étoiles'
    },
    { 
      item: '🎾', 
      groups: 5, 
      itemsPerGroup: 2, 
      result: 10, 
      description: 'balles',
      story: '5 paires de balles'
    }
  ];

  // Exercices sur le sens de la multiplication
  const exercises = [
    { 
      question: 'Que veut dire "multiplier" ?', 
      correctAnswer: 'Faire des groupes égaux',
      choices: ['Faire des groupes égaux', 'Enlever des objets', 'Mélanger des objets']
    },
    { 
      question: 'Combien de pommes en tout dans 3 paniers de 2 pommes ?', 
      correctAnswer: '6',
      choices: ['5', '6', '7'],
      visual: '🍎🍎 | 🍎🍎 | 🍎🍎'
    },
    { 
      question: 'Dans des groupes égaux, chaque groupe a...', 
      correctAnswer: 'Le même nombre d\'objets',
      choices: ['Des objets différents', 'Le même nombre d\'objets', 'Aucun objet']
    },
    { 
      question: 'Combien de roues en tout sur 3 voitures ?', 
      correctAnswer: '12',
      choices: ['9', '12', '15'],
      visual: '🚗 🚗 🚗 (chaque voiture a 4 roues)'
    },
    { 
      question: 'La multiplication est plus rapide que...', 
      correctAnswer: 'L\'addition répétée',
      choices: ['La soustraction', 'L\'addition répétée', 'La division']
    },
    { 
      question: 'Combien d\'œufs dans 2 boîtes de 6 œufs ?', 
      correctAnswer: '12',
      choices: ['8', '12', '14'],
      visual: '📦6 + 📦6 = ?'
    },
    { 
      question: 'Pour multiplier, on peut...', 
      correctAnswer: 'Additionner plusieurs fois le même nombre',
      choices: ['Soustraire des nombres', 'Additionner plusieurs fois le même nombre', 'Compter de 1 en 1']
    },
    { 
      question: 'Combien de pattes pour 2 chats ?', 
      correctAnswer: '8',
      choices: ['6', '8', '10'],
      visual: '🐱 🐱 (chaque chat a 4 pattes)'
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
    setGroupStep(null);
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons découvrir la multiplication !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("La multiplication, c'est une façon magique de compter très vite quand on a des groupes égaux !", true);
      if (stopSignalRef.current) return;
      
      // 2. Concept des groupes
      await wait(1500);
      setHighlightedElement('concept');
      scrollToSection('concept-section');
      await playAudio("Imaginez des paniers de pommes ! Si chaque panier a le même nombre de pommes, on peut utiliser la multiplication !", true);
      if (stopSignalRef.current) return;
      
      // 3. Animation avec le premier exemple
      await wait(1800);
      setHighlightedElement('demo');
      scrollToSection('animation-section');
      await playAudio("Regardons ensemble avec l'exemple des pommes !", true);
      if (stopSignalRef.current) return;
      
      await animateExample(0);
      if (stopSignalRef.current) return;
      
      // 4. Lien avec l'addition
      await wait(1500);
      setHighlightedElement('addition-link');
      scrollToSection('addition-section');
      await playAudio("La multiplication, c'est aussi additionner le même nombre plusieurs fois ! C'est plus rapide !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setShowingProcess(null);
      setAnimatingObjects(false);
      setGroupStep(null);
      setIsAnimationRunning(false);
    }
  };

  // Animation d'un exemple
  const animateExample = async (index: number) => {
    const example = multiplicationExamples[index];
    setCurrentExample(index);
    
    try {
      // Étape 1: Objets individuels
      setGroupStep('individual');
      setAnimatingObjects(true);
      await playAudio(`Voici ${example.result} ${example.description} tout mélangées !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      
      // Étape 2: Formation des groupes
      setGroupStep('grouping');
      await playAudio(`Maintenant, on va les organiser en ${example.groups} groupes de ${example.itemsPerGroup} ${example.description} chacun !`, true);
      if (stopSignalRef.current) return;
      
      await wait(3000);
      
      // Étape 3: Résultat
      setGroupStep('result');
      await playAudio(`Parfait ! Nous avons ${example.groups} groupes de ${example.itemsPerGroup}, ce qui fait ${example.result} ${example.description} en tout !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      await playAudio(`Au lieu de compter un par un, on peut dire : ${example.groups} fois ${example.itemsPerGroup} égale ${example.result} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
    } finally {
      setAnimatingObjects(false);
      setGroupStep(null);
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
    if (percentage === 100) return "🏆 Incroyable ! Tu es un champion de la multiplication !";
    if (percentage >= 80) return "🌟 Excellent ! Tu comprends très bien la multiplication !";
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
    return <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
      <div className="text-xl text-pink-600">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
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
              🤔 Le sens de la multiplication
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
                  ? 'bg-pink-500 text-white shadow-md' 
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
                  ? 'bg-purple-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-xl hover:scale-105'
                }`}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ DÉCOUVRIR LA MULTIPLICATION !'}
              </button>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'intro' ? 'ring-4 ring-pink-400 bg-pink-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Qu'est-ce que la multiplication ?
              </h2>
              <div className="text-lg text-gray-700 text-center space-y-4">
                <p>
                  La multiplication, c'est une façon <span className="font-bold text-pink-600">magique</span> de compter très vite !
                </p>
                <p>
                  Au lieu de compter un par un, on compte par <span className="font-bold text-purple-600">groupes égaux</span>.
                </p>
              </div>
            </div>

            {/* Concept des groupes */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept' ? 'ring-4 ring-purple-400 bg-purple-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                👥 Les groupes égaux
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-purple-600 mb-4">🍎 Exemple des pommes</h3>
                  <div className="bg-purple-100 rounded-lg p-6">
                    <p className="text-lg mb-4">3 paniers de 2 pommes chacun</p>
                    <div className="flex justify-center space-x-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🧺</div>
                        <div className="text-2xl">🍎🍎</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">🧺</div>
                        <div className="text-2xl">🍎🍎</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl mb-2">🧺</div>
                        <div className="text-2xl">🍎🍎</div>
                      </div>
                    </div>
                    <p className="text-lg mt-4 font-bold">= 6 pommes en tout !</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-pink-600 mb-4">🚗 Exemple des voitures</h3>
                  <div className="bg-pink-100 rounded-lg p-6">
                    <p className="text-lg mb-4">2 parkings de 4 voitures chacun</p>
                    <div className="flex justify-center space-x-8">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Parking 1</div>
                        <div className="text-2xl">🚗🚗</div>
                        <div className="text-2xl">🚗🚗</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Parking 2</div>
                        <div className="text-2xl">🚗🚗</div>
                        <div className="text-2xl">🚗🚗</div>
                      </div>
                    </div>
                    <p className="text-lg mt-4 font-bold">= 8 voitures en tout !</p>
                  </div>
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
                🎬 Animation interactive
              </h2>
              
              {currentExample !== null && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {multiplicationExamples[currentExample].story}
                    </h3>
                  </div>

                  {/* Affichage des objets selon l'étape */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-200 min-h-40">
                      {groupStep === 'individual' && (
                        <div className="text-center">
                          <p className="text-lg font-semibold mb-4 text-gray-700">
                            Objets mélangés :
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {Array.from({length: multiplicationExamples[currentExample].result}).map((_, i) => (
                              <span key={i} className="text-4xl animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                                {multiplicationExamples[currentExample].item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {groupStep === 'grouping' && (
                        <div className="text-center">
                          <p className="text-lg font-semibold mb-4 text-gray-700">
                            Organisation en groupes :
                          </p>
                          <div className="flex justify-center space-x-6">
                            {Array.from({length: multiplicationExamples[currentExample].groups}).map((_, groupIndex) => (
                              <div key={groupIndex} className="text-center">
                                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 min-w-20">
                                  <div className="text-sm text-gray-600 mb-2">Groupe {groupIndex + 1}</div>
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {Array.from({length: multiplicationExamples[currentExample].itemsPerGroup}).map((_, itemIndex) => (
                                      <span key={itemIndex} className="text-3xl animate-pulse">
                                        {multiplicationExamples[currentExample].item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {groupStep === 'result' && (
                        <div className="text-center">
                          <p className="text-xl font-bold mb-6 text-green-700">
                            Résultat final :
                          </p>
                          <div className="bg-green-100 rounded-xl p-6 border-2 border-green-300">
                            <div className="text-3xl font-bold text-green-800 mb-4">
                              {multiplicationExamples[currentExample].groups} × {multiplicationExamples[currentExample].itemsPerGroup} = {multiplicationExamples[currentExample].result}
                            </div>
                            <div className="flex justify-center space-x-4">
                              {Array.from({length: multiplicationExamples[currentExample].groups}).map((_, groupIndex) => (
                                <div key={groupIndex} className="bg-white rounded-lg p-3 border border-green-200">
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {Array.from({length: multiplicationExamples[currentExample].itemsPerGroup}).map((_, itemIndex) => (
                                      <span key={itemIndex} className="text-2xl">
                                        {multiplicationExamples[currentExample].item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Boutons pour tester d'autres exemples */}
                  <div className="flex justify-center space-x-4">
                    {multiplicationExamples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => !isAnimationRunning && animateExample(index)}
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

            {/* Lien avec l'addition */}
            <div 
              id="addition-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'addition-link' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ➕ Multiplication = Addition répétée
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                    Avec l'addition (long)
                  </h3>
                  <div className="text-center space-y-3">
                    <div className="text-lg">3 paniers de 2 pommes :</div>
                    <div className="text-xl font-mono">2 + 2 + 2 = 6</div>
                    <div className="text-sm text-gray-600">On additionne 3 fois le nombre 2</div>
                  </div>
                </div>
                <div className="bg-green-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                    Avec la multiplication (rapide)
                  </h3>
                  <div className="text-center space-y-3">
                    <div className="text-lg">3 paniers de 2 pommes :</div>
                    <div className="text-xl font-mono">3 × 2 = 6</div>
                    <div className="text-sm text-gray-600">Beaucoup plus rapide !</div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
                  <p className="text-xl font-bold text-purple-800">
                    💡 La multiplication est un raccourci pour additionner le même nombre plusieurs fois !
                  </p>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                🌟 Ce qu'il faut retenir
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-semibold">Groupes égaux</div>
                  <div className="text-sm">Même nombre dans chaque groupe</div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold">Plus rapide</div>
                  <div className="text-sm">Que l'addition répétée</div>
                </div>
                <div className="bg-white bg-opacity-90 rounded-lg p-4 text-gray-800">
                  <div className="text-2xl mb-2">🔢</div>
                  <div className="font-semibold">Signe ×</div>
                  <div className="text-sm">Pour multiplier</div>
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
                <div className="text-lg font-semibold text-purple-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="text-xl text-center font-semibold text-purple-800">
                      {exercises[currentExercise].question}
                    </div>
                    {exercises[currentExercise].visual && (
                      <div className="text-center mt-4 text-2xl bg-white rounded-lg p-4 border border-purple-200">
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
                            ? 'border-purple-500 bg-purple-100 text-purple-800'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            userAnswer === choice ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
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
                      className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          {isCorrect ? 'Bravo !' : 'Pas tout à fait...'}
                        </span>
                      </div>
                      <div className="font-semibold mb-3">
                        {isCorrect 
                          ? "Excellente réponse ! Tu comprends bien la multiplication !"
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
                  <div className="text-2xl font-bold text-purple-600">
                    Score final : {finalScore} / {exercises.length}
                  </div>
                  <div className="text-lg text-gray-700">
                    {getCompletionMessage(finalScore, exercises.length)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600"
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