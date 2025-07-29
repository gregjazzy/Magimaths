'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Book, Target, Hand, Clock } from 'lucide-react';

export default function Table5CP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'hands' | 'counting' | 'result' | null>(null);
  const [animatingHands, setAnimatingHands] = useState(false);
  const [handsStep, setHandsStep] = useState<number>(0);
  const [highlightedFinger, setHighlightedFinger] = useState<number | null>(null);
  const [countingStep, setCountingStep] = useState<number>(0);
  
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

  // Exemples avec la table de 5
  const table5Examples = [
    { 
      multiplication: '1 × 5', 
      result: 5, 
      hands: 1,
      story: '1 main avec 5 doigts',
      visual: '✋',
      sequence: [5]
    },
    { 
      multiplication: '2 × 5', 
      result: 10, 
      hands: 2,
      story: '2 mains avec 5 doigts chacune',
      visual: '✋✋',
      sequence: [5, 10]
    },
    { 
      multiplication: '3 × 5', 
      result: 15, 
      hands: 3,
      story: '3 mains avec 5 doigts chacune',
      visual: '✋✋✋',
      sequence: [5, 10, 15]
    },
    { 
      multiplication: '4 × 5', 
      result: 20, 
      hands: 4,
      story: '4 mains avec 5 doigts chacune',
      visual: '✋✋✋✋',
      sequence: [5, 10, 15, 20]
    },
    { 
      multiplication: '5 × 5', 
      result: 25, 
      hands: 5,
      story: '5 mains avec 5 doigts chacune',
      visual: '✋✋✋✋✋',
      sequence: [5, 10, 15, 20, 25]
    }
  ];

  // Exercices sur la table de 5
  const exercises = [
    { 
      question: 'Combien de doigts sur 1 main ?', 
      correctAnswer: '5',
      choices: ['4', '5', '6'],
      visual: '✋'
    },
    { 
      question: '2 × 5 = ?', 
      correctAnswer: '10',
      choices: ['8', '10', '12'],
      visual: '✋✋'
    },
    { 
      question: 'Combien font 3 × 5 ?', 
      correctAnswer: '15',
      choices: ['12', '15', '18'],
      visual: '✋✋✋'
    },
    { 
      question: '4 mains, combien de doigts ?', 
      correctAnswer: '20',
      choices: ['16', '20', '24'],
      visual: '✋✋✋✋'
    },
    { 
      question: '5 × 5 = ?', 
      correctAnswer: '25',
      choices: ['20', '25', '30'],
      visual: '✋✋✋✋✋'
    },
    { 
      question: 'Pour compter de 5 en 5, après 10 il y a...', 
      correctAnswer: '15',
      choices: ['12', '15', '18']
    },
    { 
      question: 'Combien de pièces de 5 centimes pour faire 20 centimes ?', 
      correctAnswer: '4',
      choices: ['3', '4', '5'],
      visual: '🪙🪙🪙🪙'
    },
    { 
      question: 'Dans la table de 5, tous les résultats finissent par...', 
      correctAnswer: '0 ou 5',
      choices: ['0 ou 1', '0 ou 5', '5 ou 9']
    },
    { 
      question: '6 × 5 = ?', 
      correctAnswer: '30',
      choices: ['25', '30', '35']
    },
    { 
      question: 'La moitié de 10, c\'est combien ?', 
      correctAnswer: '5',
      choices: ['4', '5', '6']
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
    setAnimatingHands(false);
    setCountingStep(0);
    setHandsStep(0);
    setHighlightedFinger(null);
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

  // Animation des mains avec doigts
  const animateHandsExample = async (example: typeof table5Examples[0]) => {
    if (stopSignalRef.current) return;
    
    setAnimatingHands(true);
    setShowingProcess('hands');
    setCurrentExample(table5Examples.indexOf(example));
    
    await playAudio(`Regardons ${example.story}. Nous allons compter ensemble !`);
    
    if (stopSignalRef.current) return;
    
    // Animer chaque main une par une
    for (let handIndex = 0; handIndex < example.hands; handIndex++) {
      if (stopSignalRef.current) return;
      
      setHandsStep(handIndex + 1);
      setHighlightedElement(`hand-${handIndex}`);
      
      await playAudio(`Main numéro ${handIndex + 1} : 5 doigts`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Animer le comptage des doigts
      for (let finger = 1; finger <= 5; finger++) {
        if (stopSignalRef.current) return;
        setHighlightedFinger(finger);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setHighlightedFinger(null);
    }
    
    if (stopSignalRef.current) return;
    
    // Phase de comptage final
    setShowingProcess('counting');
    setHighlightedElement('counting');
    
    await playAudio('Maintenant, comptons de 5 en 5 :');
    
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
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAnimatingHands(false);
    setShowingProcess(null);
    setHighlightedElement(null);
    setCountingStep(0);
    setHandsStep(0);
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
      await playAudio('Bonjour ! Aujourd\'hui, nous allons apprendre la table de 5. C\'est très facile avec nos mains !');
      
      if (stopSignalRef.current) return;
      
      setHighlightedElement('hands-explanation');
      await playAudio('Regarde ta main ! Combien de doigts as-tu ? Exactement 5 ! C\'est pour cela que la table de 5 est si pratique.');
      
      if (stopSignalRef.current) return;
      
      // Montrer tous les exemples
      for (const example of table5Examples) {
        if (stopSignalRef.current) return;
        await animateHandsExample(example);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (stopSignalRef.current) return;
      
      // Récapitulatif
      setHighlightedElement('summary');
      await playAudio('Magnifique ! Tu as appris la table de 5. Retiens bien : 5, 10, 15, 20, 25. Tous ces nombres finissent par 0 ou 5 !');
      
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
      await playAudio('Excellent ! Bonne réponse !');
    } else {
      await playAudio(`Non, la bonne réponse était ${currentEx.correctAnswer}. Tu feras mieux la prochaine fois !`);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link 
            href="/chapitre/cp-multiplications-simples" 
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200 hover:bg-white/90 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 text-orange-600" />
            <span className="text-orange-800 font-medium">Retour</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-orange-800 flex items-center justify-center">
              <span className="mr-3 text-3xl sm:text-5xl">5️⃣</span>
              Table de 5
            </h1>
            <p className="text-orange-600 text-sm sm:text-base mt-1">
              Compter sur ses doigts ! 🖐️
            </p>
          </div>
          
          <button
            onClick={startLesson}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium shadow-2xl transition-all transform hover:scale-110 border-2 border-white/30 ${
              isAnimationRunning 
                ? 'bg-gradient-to-r from-red-400 to-red-600 hover:shadow-red-500/50 hover:shadow-2xl hover:from-red-300 hover:to-red-500 text-white' 
                : 'bg-gradient-to-r from-orange-400 to-orange-600 hover:shadow-orange-500/50 hover:shadow-2xl hover:from-orange-300 hover:to-orange-500 text-white animate-pulse'
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
          highlightedElement === 'introduction' ? 'border-orange-400 bg-orange-50/70 scale-105 shadow-2xl' : 'border-orange-200'
        }`}>
          <div className="text-center">
            <div className="text-6xl sm:text-8xl mb-4">✋</div>
            <h2 className="text-xl sm:text-2xl font-bold text-orange-800 mb-4">
              Apprendre avec nos mains !
            </h2>
            <p className="text-gray-700 text-base sm:text-lg">
              Nos mains sont les meilleurs outils pour apprendre la table de 5 !
              Chaque main a exactement 5 doigts. 🖐️
            </p>
          </div>
        </div>

        {/* Explication des mains */}
        <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border-2 transition-all duration-500 ${
          highlightedElement === 'hands-explanation' ? 'border-orange-400 bg-orange-50/70 scale-105 shadow-2xl' : 'border-orange-200'
        }`}>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-6">
              🖐️ Pourquoi la table de 5 est-elle facile ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-orange-100/70 rounded-xl p-4">
                <div className="text-4xl mb-3">👋</div>
                <h4 className="font-bold text-orange-700 mb-2">5 doigts</h4>
                <p className="text-sm text-orange-600">Chaque main a 5 doigts</p>
              </div>
              <div className="bg-orange-100/70 rounded-xl p-4">
                <div className="text-4xl mb-3">🔢</div>
                <h4 className="font-bold text-orange-700 mb-2">Terminaisons</h4>
                <p className="text-sm text-orange-600">Tous finissent par 0 ou 5</p>
              </div>
              <div className="bg-orange-100/70 rounded-xl p-4">
                <div className="text-4xl mb-3">⚡</div>
                <h4 className="font-bold text-orange-700 mb-2">Rapide</h4>
                <p className="text-sm text-orange-600">Facile à retenir</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemples animés */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {table5Examples.map((example, index) => (
            <div
              key={index}
              className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 ${
                currentExample === index && animatingHands
                  ? 'border-orange-400 bg-orange-50/70 scale-105 shadow-2xl' 
                  : 'border-orange-200 hover:border-orange-300'
              }`}
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-orange-800 mb-2">
                  {example.multiplication}
                </h4>
                <p className="text-sm text-orange-600 mb-4">{example.story}</p>
              </div>

              {/* Animation des mains */}
              <div className="flex justify-center items-center mb-4 space-x-2">
                {Array.from({ length: example.hands }).map((_, handIndex) => (
                  <div
                    key={handIndex}
                    className={`transition-all duration-500 ${
                      highlightedElement === `hand-${handIndex}` && currentExample === index
                        ? 'scale-125 animate-pulse' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="text-4xl sm:text-5xl">✋</div>
                      {/* Animation des doigts */}
                      {highlightedElement === `hand-${handIndex}` && highlightedFinger && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-bounce">
                          {highlightedFinger}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Séquence de comptage */}
              {showingProcess === 'counting' && currentExample === index && (
                <div className={`bg-orange-100 rounded-xl p-4 mb-4 transition-all duration-500 ${
                  highlightedElement === 'counting' ? 'bg-orange-200 scale-105' : ''
                }`}>
                  <div className="flex justify-center items-center space-x-2 flex-wrap">
                    {example.sequence.map((num, seqIndex) => (
                      <span
                        key={seqIndex}
                        className={`px-3 py-1 rounded-full font-bold transition-all duration-500 ${
                          countingStep > seqIndex
                            ? 'bg-orange-500 text-white scale-110' 
                            : 'bg-white text-orange-700'
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
                <div className="text-2xl font-bold text-orange-800">
                  = {example.result}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Récapitulatif */}
        <div className={`bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 sm:p-8 mb-8 border-2 transition-all duration-500 ${
          highlightedElement === 'summary' ? 'border-orange-400 scale-105 shadow-2xl' : 'border-orange-200'
        }`}>
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-4">
              🎯 Récapitulatif de la table de 5
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {table5Examples.map((example, index) => (
                <div key={index} className="bg-white/70 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-orange-700 mb-1">
                    {example.multiplication}
                  </div>
                  <div className="text-2xl font-bold text-orange-800">
                    {example.result}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-200/50 rounded-xl">
              <p className="text-orange-800 font-medium">
                🔍 <strong>Astuce :</strong> Tous les résultats finissent par 0 ou 5 !
              </p>
            </div>
          </div>
        </div>

        {/* Section exercices */}
        {!showExercises ? (
          <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center border-2 transition-all duration-500 ${
            highlightedElement === 'exercises' ? 'border-orange-400 bg-orange-50/70 scale-105 shadow-2xl' : 'border-orange-200'
          }`}>
            <h3 className="text-xl sm:text-2xl font-bold text-orange-800 mb-4">
              🎮 Prêt pour les exercices ?
            </h3>
            <p className="text-gray-700 mb-6">
              Teste tes connaissances sur la table de 5 !
            </p>
            <button
              onClick={() => setShowExercises(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:scale-105"
            >
              <Target className="inline w-5 h-5 mr-2" />
              Commencer les exercices
            </button>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-orange-200">
            {!showCompletionModal ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-orange-800">
                    📝 Exercice {currentExercise + 1}/{exercises.length}
                  </h3>
                  <div className="text-orange-600">
                    Score: {score}/{exercises.length}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-orange-50 rounded-xl p-6 mb-4">
                    <h4 className="text-lg font-semibold text-orange-800 mb-4">
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
                        className={`p-4 rounded-xl border-2 transition-all transform text-center font-medium shadow-lg hover:scale-105 hover:shadow-xl ${
                          userAnswer === choice
                            ? 'border-orange-400 bg-orange-100 text-orange-800 shadow-orange-200 scale-105'
                            : 'border-gray-200 bg-white hover:border-orange-300 text-gray-700 hover:bg-orange-50 hover:shadow-orange-100'
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
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-orange-500/50 hover:shadow-2xl hover:scale-105 hover:from-orange-400 hover:to-red-500 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold shadow-2xl transition-all transform border-2 border-white/20 disabled:cursor-not-allowed"
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
                        Excellent ! Bonne réponse !
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
                <h3 className="text-2xl font-bold text-orange-800 mb-4">
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
                    className="bg-gradient-to-r from-orange-400 to-red-600 hover:shadow-orange-500/50 hover:shadow-2xl hover:scale-105 hover:from-orange-300 hover:to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-2xl transition-all transform border-2 border-white/20"
                  >
                    <RotateCcw className="inline w-5 h-5 mr-2" />
                    Recommencer
                  </button>
                  <Link
                    href="/chapitre/cp-multiplications-simples"
                    className="bg-gradient-to-r from-gray-500 to-gray-700 hover:shadow-gray-500/50 hover:shadow-2xl hover:scale-105 hover:from-gray-400 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl transition-all transform border-2 border-white/20"
                  >
                    Retour au chapitre
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Astuces */}
        <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
          <h3 className="text-lg font-bold text-orange-800 mb-4 text-center">
            🎁 Astuces pour retenir la table de 5
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">🖐️</div>
              <h4 className="font-bold text-orange-700 mb-2">Utilise tes mains</h4>
              <p className="text-orange-600">5 doigts par main, c'est parfait !</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">🎵</div>
              <h4 className="font-bold text-orange-700 mb-2">Chante la comptine</h4>
              <p className="text-orange-600">5, 10, 15, 20, 25 !</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">🪙</div>
              <h4 className="font-bold text-orange-700 mb-2">Pièces de 5 centimes</h4>
              <p className="text-orange-600">Compte avec des pièces</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-bold text-orange-700 mb-2">L'horloge</h4>
              <p className="text-orange-600">5 minutes entre chaque chiffre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 