'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Book, Target, Calculator, Clock } from 'lucide-react';

export default function Table10CP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'groups' | 'counting' | 'result' | null>(null);
  const [animatingGroups, setAnimatingGroups] = useState(false);
  const [groupStep, setGroupStep] = useState<number>(0);
  const [countingStep, setCountingStep] = useState<number>(0);
  const [highlightedGroup, setHighlightedGroup] = useState<number | null>(null);
  
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

  // Exemples avec la table de 10
  const table10Examples = [
    { 
      multiplication: '1 × 10', 
      result: 10, 
      groups: 1,
      story: '1 paquet de 10 bonbons',
      visual: '📦',
      sequence: [10],
      items: ['🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬']
    },
    { 
      multiplication: '2 × 10', 
      result: 20, 
      groups: 2,
      story: '2 paquets de 10 bonbons chacun',
      visual: '📦📦',
      sequence: [10, 20],
      items: ['🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬']
    },
    { 
      multiplication: '3 × 10', 
      result: 30, 
      groups: 3,
      story: '3 paquets de 10 bonbons chacun',
      visual: '📦📦📦',
      sequence: [10, 20, 30],
      items: ['🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬']
    },
    { 
      multiplication: '4 × 10', 
      result: 40, 
      groups: 4,
      story: '4 paquets de 10 bonbons chacun',
      visual: '📦📦📦📦',
      sequence: [10, 20, 30, 40],
      items: ['🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬']
    },
    { 
      multiplication: '5 × 10', 
      result: 50, 
      groups: 5,
      story: '5 paquets de 10 bonbons chacun',
      visual: '📦📦📦📦📦',
      sequence: [10, 20, 30, 40, 50],
      items: ['🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬']
    }
  ];

  // Exercices sur la table de 10
  const exercises = [
    { 
      question: 'Combien d\'objets dans 1 paquet de 10 ?', 
      correctAnswer: '10',
      choices: ['9', '10', '11'],
      visual: '📦'
    },
    { 
      question: '2 × 10 = ?', 
      correctAnswer: '20',
      choices: ['18', '20', '22'],
      visual: '📦📦'
    },
    { 
      question: 'Combien font 3 × 10 ?', 
      correctAnswer: '30',
      choices: ['25', '30', '35'],
      visual: '📦📦📦'
    },
    { 
      question: '4 paquets de 10, combien au total ?', 
      correctAnswer: '40',
      choices: ['35', '40', '45'],
      visual: '📦📦📦📦'
    },
    { 
      question: '5 × 10 = ?', 
      correctAnswer: '50',
      choices: ['45', '50', '55'],
      visual: '📦📦📦📦📦'
    },
    { 
      question: 'Pour compter de 10 en 10, après 20 il y a...', 
      correctAnswer: '30',
      choices: ['25', '30', '35']
    },
    { 
      question: 'Combien de pièces de 10 centimes pour faire 40 centimes ?', 
      correctAnswer: '4',
      choices: ['3', '4', '5'],
      visual: '🪙🪙🪙🪙'
    },
    { 
      question: 'Dans la table de 10, tous les résultats finissent par...', 
      correctAnswer: '0',
      choices: ['0', '5', '10']
    },
    { 
      question: '6 × 10 = ?', 
      correctAnswer: '60',
      choices: ['50', '60', '70']
    },
    { 
      question: 'Si j\'ai 30 bonbons et j\'en ajoute 10, j\'en ai...', 
      correctAnswer: '40',
      choices: ['35', '40', '45']
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setShowingProcess(null);
    setAnimatingGroups(false);
    setCountingStep(0);
    setGroupStep(0);
    setHighlightedGroup(null);
  };

  // Fonction pour jouer l'audio
  const playAudio = async (text: string) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      if (typeof speechSynthesis === 'undefined') {
        console.warn('SpeechSynthesis API non disponible');
        resolve();
        return;
      }
      
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = speechSynthesis.getVoices();
      const bestFrenchVoice = voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        (voice.name.toLowerCase().includes('audrey') ||
         voice.name.toLowerCase().includes('marie') ||
         voice.name.toLowerCase().includes('amélie') ||
         voice.name.toLowerCase().includes('virginie') ||
         voice.name.toLowerCase().includes('julie') ||
         voice.name.toLowerCase().includes('celine') ||
         voice.name.toLowerCase().includes('léa') ||
         voice.name.toLowerCase().includes('charlotte'))
      ) || voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        (voice.name.toLowerCase().includes('thomas') ||
         voice.name.toLowerCase().includes('daniel'))
      ) || voices.find(voice => 
        voice.lang === 'fr-FR' && voice.localService
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')
      );
      
      if (bestFrenchVoice) {
        utterance.voice = bestFrenchVoice;
      }
      
      currentAudioRef.current = utterance;
      
      utterance.onend = () => {
        if (!stopSignalRef.current) {
          currentAudioRef.current = null;
          resolve();
        }
      };
      
      utterance.onerror = (error) => {
        console.error('Erreur audio:', error);
        currentAudioRef.current = null;
        resolve();
      };
      
      speechSynthesis.speak(utterance);
    });
  };

  // Animation des groupes de 10
  const animateGroupsExample = async (example: typeof table10Examples[0]) => {
    if (stopSignalRef.current) return;
    
    setAnimatingGroups(true);
    setShowingProcess('groups');
    setCurrentExample(table10Examples.indexOf(example));
    
    await playAudio(`Regardons ${example.story}. Chaque paquet contient exactement 10 objets !`);
    
    if (stopSignalRef.current) return;
    
    // Animer chaque groupe
    for (let groupIndex = 0; groupIndex < example.groups; groupIndex++) {
      if (stopSignalRef.current) return;
      
      setGroupStep(groupIndex + 1);
      setHighlightedGroup(groupIndex);
      setHighlightedElement(`group-${groupIndex}`);
      
      await playAudio(`Paquet numéro ${groupIndex + 1} : 10 objets`);
      
      // Animation de comptage dans le paquet
      for (let item = 0; item < 10; item++) {
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    if (stopSignalRef.current) return;
    
    // Phase de comptage final
    setShowingProcess('counting');
    setHighlightedElement('counting');
    setHighlightedGroup(null);
    
    await playAudio('Maintenant, comptons de 10 en 10 :');
    
    for (let i = 0; i < example.sequence.length; i++) {
      if (stopSignalRef.current) return;
      
      setCountingStep(i + 1);
      setHighlightedElement(`count-${i}`);
      
      await playAudio(`${example.sequence[i]}`);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    if (stopSignalRef.current) return;
    
    // Résultat final
    setShowingProcess('result');
    setHighlightedElement('result');
    
    await playAudio(`${example.multiplication} égale ${example.result} !`);
    await playAudio(`Tu remarques ? ${example.result} se termine par 0 ! Tous les multiples de 10 finissent par 0 !`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAnimatingGroups(false);
    setShowingProcess(null);
    setHighlightedElement(null);
    setCountingStep(0);
    setGroupStep(0);
    setHighlightedGroup(null);
  };

  // Démarrer la leçon complète
  const startLesson = async () => {
    if (isAnimationRunning) {
      stopAllVocalsAndAnimations();
      return;
    }
    
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setIsPlayingVocal(true);
    setHasStarted(true);
    
    try {
      // Introduction
      setHighlightedElement('introduction');
      await playAudio('Bonjour ! Aujourd\'hui, nous allons apprendre la table de 10. C\'est la plus facile de toutes !');
      
      if (stopSignalRef.current) return;
      
      setHighlightedElement('easy-explanation');
      await playAudio('Pourquoi est-elle si facile ? Parce que tous les résultats finissent par zéro ! Et nous utilisons le système décimal qui compte par 10 !');
      
      if (stopSignalRef.current) return;
      
      // Montrer tous les exemples
      for (const example of table10Examples) {
        if (stopSignalRef.current) return;
        await animateGroupsExample(example);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (stopSignalRef.current) return;
      
      // Récapitulatif
      setHighlightedElement('summary');
      await playAudio('Fantastique ! Tu as appris la table de 10. Retiens bien : 10, 20, 30, 40, 50. Ils finissent tous par 0 !');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Exercices
      setHighlightedElement('exercises');
      await playAudio('Maintenant, testons tes connaissances avec quelques exercices !');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowExercises(true);
      
    } catch (error) {
      console.error('Erreur dans la leçon:', error);
    } finally {
      setIsAnimationRunning(false);
      setIsPlayingVocal(false);
      setHighlightedElement(null);
    }
  };

  // Gestion des exercices
  const handleAnswerSubmit = async () => {
    if (!userAnswer) return;
    
    const currentEx = exercises[currentExercise];
    const correct = userAnswer === currentEx.correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => new Set([...Array.from(prev), currentExercise]));
      await playAudio('Parfait ! Tu maîtrises la table de 10 !');
    } else {
      await playAudio(`Non, la bonne réponse était ${currentEx.correctAnswer}. Souviens-toi : il suffit d'ajouter un zéro !`);
    }
    
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        // Fin des exercices
        const finalScore = ((score + (correct ? 1 : 0)) / exercises.length) * 100;
        setFinalScore(Math.round(finalScore));
        setShowCompletionModal(true);
      }
    }, 2000);
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setShowExercises(false);
  };

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link 
            href="/chapitre/cp-multiplications-simples" 
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200 hover:bg-white/90 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-800 font-medium">Retour</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-indigo-800 flex items-center justify-center">
              <span className="mr-3 text-3xl sm:text-5xl">🔟</span>
              Table de 10
            </h1>
            <p className="text-indigo-600 text-sm sm:text-base mt-1">
              La plus facile de toutes ! 🎯
            </p>
          </div>
          
          <button
            onClick={startLesson}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all shadow-lg ${
              isAnimationRunning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            {isAnimationRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Arrêter</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Commencer</span>
              </>
            )}
          </button>
        </div>

        {/* Introduction */}
        <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border-2 transition-all duration-500 ${
          highlightedElement === 'introduction' ? 'border-indigo-400 bg-indigo-50/70 scale-105 shadow-2xl' : 'border-indigo-200'
        }`}>
          <div className="text-center">
            <div className="text-6xl sm:text-8xl mb-4">📦</div>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4">
              La table la plus facile !
            </h2>
            <p className="text-gray-700 text-base sm:text-lg">
              Avec la table de 10, tu vas voir que multiplier devient un jeu d'enfant !
              Il suffit d'ajouter un zéro ! 🚀
            </p>
          </div>
        </div>

        {/* Explication simple */}
        <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border-2 transition-all duration-500 ${
          highlightedElement === 'easy-explanation' ? 'border-indigo-400 bg-indigo-50/70 scale-105 shadow-2xl' : 'border-indigo-200'
        }`}>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-indigo-800 mb-6">
              🎯 Pourquoi la table de 10 est-elle si facile ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-indigo-100/70 rounded-xl p-4">
                <div className="text-4xl mb-3">0️⃣</div>
                <h4 className="font-bold text-indigo-700 mb-2">Tous finissent par 0</h4>
                <p className="text-sm text-indigo-600">10, 20, 30, 40, 50...</p>
              </div>
              <div className="bg-indigo-100/70 rounded-xl p-4">
                <div className="text-4xl mb-3">➕</div>
                <h4 className="font-bold text-indigo-700 mb-2">Ajouter un zéro</h4>
                <p className="text-sm text-indigo-600">3 × 10 = 30</p>
              </div>
              <div className="bg-indigo-100/70 rounded-xl p-4">
                <div className="text-4xl mb-3">🔢</div>
                <h4 className="font-bold text-indigo-700 mb-2">Système décimal</h4>
                <p className="text-sm text-indigo-600">Notre façon de compter !</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemples animés */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {table10Examples.map((example, index) => (
            <div
              key={index}
              className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 ${
                currentExample === index && animatingGroups
                  ? 'border-indigo-400 bg-indigo-50/70 scale-105 shadow-2xl' 
                  : 'border-indigo-200 hover:border-indigo-300'
              }`}
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-indigo-800 mb-2">
                  {example.multiplication}
                </h4>
                <p className="text-sm text-indigo-600 mb-4">{example.story}</p>
              </div>

              {/* Animation des paquets */}
              <div className="flex justify-center items-center mb-4 flex-wrap gap-2">
                {Array.from({ length: example.groups }).map((_, groupIndex) => (
                  <div
                    key={groupIndex}
                    className={`transition-all duration-500 ${
                      highlightedGroup === groupIndex && currentExample === index
                        ? 'scale-125 animate-pulse' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="text-4xl sm:text-5xl">📦</div>
                      {/* Animation des objets dans le paquet */}
                      {highlightedGroup === groupIndex && showingProcess === 'groups' && (
                        <div className="absolute -top-8 -right-2 bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-bounce">
                          10
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Détail d'un paquet */}
              {highlightedGroup !== null && currentExample === index && showingProcess === 'groups' && (
                <div className="bg-indigo-100 rounded-xl p-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-indigo-700 mb-2">Dans ce paquet :</p>
                    <div className="grid grid-cols-5 gap-1">
                      {example.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-lg animate-pulse">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Séquence de comptage */}
              {showingProcess === 'counting' && currentExample === index && (
                <div className={`bg-indigo-100 rounded-xl p-4 mb-4 transition-all duration-500 ${
                  highlightedElement === 'counting' ? 'bg-indigo-200 scale-105' : ''
                }`}>
                  <div className="flex justify-center items-center space-x-2 flex-wrap">
                    {example.sequence.map((num, seqIndex) => (
                      <span
                        key={seqIndex}
                        className={`px-3 py-1 rounded-full font-bold transition-all duration-500 ${
                          countingStep > seqIndex
                            ? 'bg-indigo-500 text-white scale-110' 
                            : 'bg-white text-indigo-700'
                        }`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Résultat */}
              <div className={`text-center p-4 rounded-xl transition-all duration-500 ${
                showingProcess === 'result' && currentExample === index && highlightedElement === 'result'
                  ? 'bg-green-200 scale-110' : 'bg-gray-100'
              }`}>
                <div className="text-2xl font-bold text-indigo-800">
                  = {example.result}
                </div>
                <div className="text-sm text-indigo-600 mt-1">
                  Se termine par 0 !
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Astuce magique */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-indigo-200">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4">
              ✨ L'astuce magique de la table de 10 !
            </h3>
            <div className="bg-white/70 rounded-xl p-6">
              <div className="text-4xl mb-4">🪄</div>
              <p className="text-lg text-indigo-700 font-medium mb-4">
                Pour multiplier par 10, il suffit d'ajouter un zéro !
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-indigo-800">3 × 10</div>
                  <div className="text-sm text-indigo-600">3 → 30</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-indigo-800">7 × 10</div>
                  <div className="text-sm text-indigo-600">7 → 70</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="text-xl font-bold text-indigo-800">9 × 10</div>
                  <div className="text-sm text-indigo-600">9 → 90</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Récapitulatif */}
        <div className={`bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 sm:p-8 mb-8 border-2 transition-all duration-500 ${
          highlightedElement === 'summary' ? 'border-indigo-400 scale-105 shadow-2xl' : 'border-indigo-200'
        }`}>
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4">
              🎯 Récapitulatif de la table de 10
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {table10Examples.map((example, index) => (
                <div key={index} className="bg-white/70 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-indigo-700 mb-1">
                    {example.multiplication}
                  </div>
                  <div className="text-2xl font-bold text-indigo-800">
                    {example.result}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-indigo-200/50 rounded-xl">
              <p className="text-indigo-800 font-medium">
                🔍 <strong>Retiens :</strong> Tous finissent par 0 ! C'est la règle magique !
              </p>
            </div>
          </div>
        </div>

        {/* Section exercices */}
        {!showExercises ? (
          <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center border-2 transition-all duration-500 ${
            highlightedElement === 'exercises' ? 'border-indigo-400 bg-indigo-50/70 scale-105 shadow-2xl' : 'border-indigo-200'
          }`}>
            <h3 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4">
              🎮 Prêt pour les exercices ?
            </h3>
            <p className="text-gray-700 mb-6">
              Teste tes connaissances sur la table de 10 !
            </p>
            <button
              onClick={() => setShowExercises(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
            >
              <Target className="inline w-5 h-5 mr-2" />
              Commencer les exercices
            </button>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-indigo-200">
            {!showCompletionModal ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-indigo-800">
                    📝 Exercice {currentExercise + 1}/{exercises.length}
                  </h3>
                  <div className="text-indigo-600">
                    Score: {score}/{exercises.length}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-indigo-50 rounded-xl p-6 mb-4">
                    <h4 className="text-lg font-semibold text-indigo-800 mb-4">
                      {exercises[currentExercise].question}
                    </h4>
                    
                    {exercises[currentExercise].visual && (
                      <div className="text-4xl text-center mb-4">
                        {exercises[currentExercise].visual}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {exercises[currentExercise].choices.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(choice)}
                        className={`p-4 rounded-xl border-2 transition-all text-center font-medium ${
                          userAnswer === choice
                            ? 'border-indigo-400 bg-indigo-100 text-indigo-800'
                            : 'border-gray-200 bg-white hover:border-indigo-300 text-gray-700 hover:bg-indigo-50'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!userAnswer}
                    className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                  >
                    Valider
                  </button>
                </div>

                {isCorrect !== null && (
                  <div className={`mt-4 p-4 rounded-xl text-center ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Parfait ! Tu maîtrises la table de 10 !
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <XCircle className="w-6 h-6 mr-2" />
                        La bonne réponse était : {exercises[currentExercise].correctAnswer}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '🎉' : '💪'}
                </div>
                <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                  {finalScore >= 80 ? 'Excellent !' : finalScore >= 60 ? 'Bien joué !' : 'Continue tes efforts !'}
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Tu as obtenu {score}/{exercises.length} bonnes réponses
                  <br />
                  Score : {finalScore}%
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetExercises}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    <RotateCcw className="inline w-5 h-5 mr-2" />
                    Recommencer
                  </button>
                  <Link
                    href="/chapitre/cp-multiplications-simples"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    Retour au chapitre
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Astuces */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 border-2 border-indigo-200">
          <h3 className="text-lg font-bold text-indigo-800 mb-4 text-center">
            🎁 Astuces pour maîtriser la table de 10
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">0️⃣</div>
              <h4 className="font-bold text-indigo-700 mb-2">Ajouter un zéro</h4>
              <p className="text-indigo-600">Le plus simple : 4 × 10 = 40</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">🪙</div>
              <h4 className="font-bold text-indigo-700 mb-2">Pièces de 10 centimes</h4>
              <p className="text-indigo-600">Compte avec des pièces</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">📦</div>
              <h4 className="font-bold text-indigo-700 mb-2">Paquets de 10</h4>
              <p className="text-indigo-600">Visualise des groupes</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">🔢</div>
              <h4 className="font-bold text-indigo-700 mb-2">Système décimal</h4>
              <p className="text-indigo-600">Notre façon naturelle de compter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 