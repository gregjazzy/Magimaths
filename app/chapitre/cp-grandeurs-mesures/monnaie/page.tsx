'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function MonnaieCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'recognition' | 'counting' | 'change' | 'result' | null>(null);
  const [animatingMoney, setAnimatingMoney] = useState(false);
  const [coinCount, setCoinCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  
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

  // Concepts de monnaie à apprendre
  const moneyConcepts = [
    {
      name: 'les pièces',
      emoji: '🪙',
      color: 'blue',
      story: 'Les pièces sont rondes et brillantes. Chacune a une valeur !',
      examples: [
        { coin: '1 centime', emoji: '🟤', value: 0.01, description: 'La plus petite pièce' },
        { coin: '5 centimes', emoji: '🟤', value: 0.05, description: 'Cinq fois plus' },
        { coin: '10 centimes', emoji: '🟨', value: 0.10, description: 'Dix centimes' },
        { coin: '1 euro', emoji: '🟡', value: 1.00, description: '100 centimes !' }
      ]
    },
    {
      name: 'les billets',
      emoji: '💵',
      color: 'green',
      story: 'Les billets sont en papier et valent plus que les pièces !',
      examples: [
        { coin: '5 euros', emoji: '💴', value: 5.00, description: 'Cinq euros en papier' },
        { coin: '10 euros', emoji: '💵', value: 10.00, description: 'Dix euros' },
        { coin: '20 euros', emoji: '💶', value: 20.00, description: 'Vingt euros' },
        { coin: '50 euros', emoji: '💷', value: 50.00, description: 'Cinquante euros !' }
      ]
    },
    {
      name: 'compter l\'argent',
      emoji: '🔢',
      color: 'purple',
      story: 'On compte l\'argent en additionnant toutes les pièces et billets !',
      examples: [
        { coin: '1€ + 1€', emoji: '🟡🟡', value: 2.00, description: '= 2 euros' },
        { coin: '5€ + 2€', emoji: '💴🟡', value: 7.00, description: '= 7 euros' },
        { coin: '10€ + 5€', emoji: '💵💴', value: 15.00, description: '= 15 euros' },
        { coin: '20€ + 10€', emoji: '💶💵', value: 30.00, description: '= 30 euros' }
      ]
    },
    {
      name: 'rendre la monnaie',
      emoji: '💰',
      color: 'orange',
      story: 'Quand on paie plus cher, on nous rend la différence !',
      examples: [
        { coin: 'Achat 3€, je paie 5€', emoji: '🛒💴', value: 2.00, description: 'On me rend 2€' },
        { coin: 'Achat 7€, je paie 10€', emoji: '🛒💵', value: 3.00, description: 'On me rend 3€' },
        { coin: 'Achat 12€, je paie 20€', emoji: '🛒💶', value: 8.00, description: 'On me rend 8€' },
        { coin: 'Achat 15€, je paie 20€', emoji: '🛒💶', value: 5.00, description: 'On me rend 5€' }
      ]
    }
  ];

  // Exercices sur la monnaie
  const exercises = [
    { 
      question: 'Combien vaut une pièce de 1 euro ?', 
      correctAnswer: '100 centimes',
      choices: ['10 centimes', '100 centimes', '1000 centimes'],
      hint: '1 euro = ? centimes...',
      demoType: 'euro-centimes'
    },
    { 
      question: 'Entre une pièce et un billet, lequel vaut généralement plus ?', 
      correctAnswer: 'le billet',
      choices: ['la pièce', 'le billet', 'ils valent pareil'],
      hint: 'Pense aux grandes valeurs...',
      demoType: 'coin-vs-bill'
    },
    { 
      question: 'Si j\'ai une pièce de 2 euros et une pièce de 1 euro, j\'ai...', 
      correctAnswer: '3 euros',
      choices: ['2 euros', '3 euros', '4 euros'],
      hint: 'Additionne les valeurs...',
      demoType: 'adding-coins'
    },
    { 
      question: 'J\'achète quelque chose à 4 euros et je paie avec un billet de 5 euros. On me rend...', 
      correctAnswer: '1 euro',
      choices: ['0 euro', '1 euro', '2 euros'],
      hint: '5 - 4 = ?',
      demoType: 'simple-change'
    },
    { 
      question: 'Quelle est la plus petite pièce ?', 
      correctAnswer: '1 centime',
      choices: ['1 centime', '5 centimes', '10 centimes'],
      hint: 'La plus petite valeur...',
      demoType: 'smallest-coin'
    },
    { 
      question: 'Combien de pièces de 1 euro faut-il pour faire 5 euros ?', 
      correctAnswer: '5 pièces',
      choices: ['3 pièces', '5 pièces', '10 pièces'],
      hint: '1 + 1 + 1 + 1 + 1 = ?',
      demoType: 'five-euros'
    },
    { 
      question: 'Un billet de 10 euros vaut...', 
      correctAnswer: '10 pièces de 1 euro',
      choices: ['5 pièces de 1 euro', '10 pièces de 1 euro', '20 pièces de 1 euro'],
      hint: '10 euros = ? pièces de 1 euro',
      demoType: 'ten-euro-bill'
    },
    { 
      question: 'Si un jouet coûte 8 euros et que je paie avec un billet de 10 euros, on me rend...', 
      correctAnswer: '2 euros',
      choices: ['1 euro', '2 euros', '3 euros'],
      hint: '10 - 8 = ?',
      demoType: 'toy-change'
    },
    { 
      question: 'Quelle pièce vaut plus qu\'une pièce de 10 centimes ?', 
      correctAnswer: '1 euro',
      choices: ['5 centimes', '1 centime', '1 euro'],
      hint: 'Compare les valeurs...',
      demoType: 'compare-values'
    },
    { 
      question: 'Pour acheter quelque chose à 15 euros, je peux utiliser...', 
      correctAnswer: 'un billet de 20 euros',
      choices: ['une pièce de 1 euro', 'un billet de 20 euros', 'une pièce de 10 centimes'],
      hint: 'Il faut avoir assez d\'argent...',
      demoType: 'fifteen-euros'
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements d'onglet
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    setIsAnimationRunning(false);
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setCurrentExample(null);
    setShowingProcess(null);
    setAnimatingMoney(false);
    setCoinCount(0);
    setTotalValue(0);
    
    // Arrêter la synthèse vocale
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Signaler l'arrêt
    stopSignalRef.current = true;
    
    // Nettoyer la référence audio
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
  };

  // Fonction pour jouer l'audio avec gestion des interruptions
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Choisir une voix française naturelle
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && 
        (voice.name.includes('Thomas') || voice.name.includes('Amélie') || voice.name.includes('Daniel'))
      ) || voices.find(voice => voice.lang.startsWith('fr'));

      if (synth) {
        const utterance = new SpeechSynthesisUtterance(text);
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        currentAudioRef.current = utterance;
        
        utterance.onend = () => {
          if (!stopSignalRef.current) {
            setIsPlayingVocal(false);
          }
          resolve();
        };
        
        utterance.onerror = () => {
          setIsPlayingVocal(false);
          resolve();
        };
        
        setIsPlayingVocal(true);
        synth.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  // Fonction pour démarrer la leçon
  const startLesson = async () => {
    if (isAnimationRunning) {
      stopAllVocalsAndAnimations();
      return;
    }

    setHasStarted(true);
    setIsAnimationRunning(true);
    stopSignalRef.current = false;

    const steps = [
      {
        action: () => setHighlightedElement('introduction'),
        audio: "Bonjour petit marchand ! Aujourd'hui, nous allons apprendre à utiliser la monnaie. Pièces, billets, et compter l'argent !"
      },
      {
        action: () => {
          setHighlightedElement('concepts-explanation');
          setCurrentExample(0);
        },
        audio: "Voici les 4 choses importantes avec la monnaie : les pièces, les billets, compter l'argent, et rendre la monnaie !"
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('recognition');
          setAnimatingMoney(true);
        },
        audio: "Commençons par les pièces ! Elles sont rondes et chacune a sa valeur : 1 centime, 5 centimes, 10 centimes, 1 euro !"
      },
      {
        action: () => {
          setShowingProcess('result');
          setCoinCount(4);
        },
        audio: "1 euro, c'est 100 centimes ! Retiens bien : plus la pièce est grosse, plus elle vaut cher !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('recognition');
          setCoinCount(0);
        },
        audio: "Maintenant les billets ! Ils sont en papier et valent plus que les pièces : 5, 10, 20, 50 euros !"
      },
      {
        action: () => {
          setShowingProcess('result');
        },
        audio: "Les billets ont des couleurs différentes et des dessins spéciaux. Ils valent beaucoup plus !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setShowingProcess('counting');
        },
        audio: "Voici comment compter l'argent ! On additionne toutes les pièces et tous les billets ensemble."
      },
      {
        action: () => {
          setTotalValue(7);
          setShowingProcess('result');
        },
        audio: "1 euro plus 1 euro égale 2 euros. 5 euros plus 2 euros égale 7 euros. On additionne tout !"
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('change');
          setTotalValue(0);
        },
        audio: "Enfin, rendre la monnaie ! Si je paie plus cher que le prix, on me rend la différence."
      },
      {
        action: () => {
          setTotalValue(2);
          setShowingProcess('result');
        },
        audio: "J'achète à 3 euros, je paie 5 euros : on me rend 2 euros ! 5 moins 3 égale 2 !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
          setAnimatingMoney(false);
          setTotalValue(0);
        },
        audio: "Parfait ! Maintenant tu peux reconnaître la monnaie, compter l'argent, et comprendre la monnaie !"
      }
    ];

    for (let i = 0; i < steps.length && !stopSignalRef.current; i++) {
      steps[i].action();
      await playAudio(steps[i].audio);
      
      if (!stopSignalRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!stopSignalRef.current) {
      setIsAnimationRunning(false);
      setHighlightedElement('exercises');
      await playAudio("Maintenant, teste tes connaissances sur la monnaie avec les exercices !");
    }
  };

  // Fonctions pour les exercices
  const handleAnswerSelect = (answer: string) => {
    if (isCorrect !== null) return;
    
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(new Set(Array.from(answeredCorrectly).concat([currentExercise])));
      playAudio("Bravo ! C'est la bonne réponse !");
    } else {
      playAudio(`Pas tout à fait ! La bonne réponse était : ${exercises[currentExercise].correctAnswer}. ${exercises[currentExercise].hint}`);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      // Fin des exercices
      const finalScore = answeredCorrectly.size;
      setFinalScore(finalScore);
      setShowCompletionModal(true);
      
      if (finalScore >= 7) {
        playAudio("Félicitations ! Tu es maintenant un expert de la monnaie !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien la monnaie !");
      } else {
        playAudio("Continue à t'entraîner, tu vas y arriver !");
      }
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setUserAnswer('');
    setIsCorrect(null);
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-grandeurs-mesures" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux grandeurs et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              💰 La monnaie
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les pièces, billets et comment compter l'argent !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-yellow-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-yellow-500 text-white shadow-md' 
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
            {/* Bouton COMMENCER */}
            <div className="text-center mb-6">
              <button
                onClick={startLesson}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-xl hover:scale-105'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Explication du concept */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'introduction' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💰 Comment utiliser la monnaie ?
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-yellow-800 font-semibold mb-6">
                  La monnaie nous permet d'acheter des choses ! Apprenons à l'utiliser !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-yellow-600 mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${moneyConcepts[currentExample].name} ${moneyConcepts[currentExample].emoji}` 
                        : 'Les 4 bases de la monnaie 💰'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des concepts */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'concepts-explanation' ? 'ring-2 ring-yellow-400' : ''
                  }`}>
                    {moneyConcepts.map((concept, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingMoney
                            ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{concept.emoji}</div>
                        <h4 className="font-bold text-yellow-700 mb-1 text-sm sm:text-base">{concept.name}</h4>
                        <p className="text-xs sm:text-sm text-yellow-600">{concept.story.substring(0, 40)}...</p>
                        
                        {/* Zone d'animation pour chaque concept */}
                        {currentExample === index && animatingMoney && (
                          <div className="mt-4">
                            {/* Animation selon le concept */}
                            <div className="bg-white rounded-lg p-3 border-2 border-yellow-200">
                              
                              {/* Pièces et billets */}
                              {(currentExample === 0 || currentExample === 1) && showingProcess === 'recognition' && (
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  {concept.examples.map((example, idx) => (
                                    <div key={idx} className="text-center">
                                      <div className="text-lg mb-1">{example.emoji}</div>
                                      <div className="font-bold text-yellow-700">{example.coin}</div>
                                      <div className="text-yellow-600">{example.value}€</div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Comptage d'argent */}
                              {currentExample === 2 && showingProcess === 'counting' && (
                                <div className="text-center">
                                  <div className="flex justify-center space-x-2 mb-2">
                                    <span className="text-lg">🟡</span>
                                    <span className="text-sm">+</span>
                                    <span className="text-lg">🟡</span>
                                    <span className="text-sm">=</span>
                                    <span className="text-lg">🟡🟡</span>
                                  </div>
                                  <div className="text-xs font-bold text-yellow-700">1€ + 1€ = 2€</div>
                                </div>
                              )}

                              {/* Rendu de monnaie */}
                              {currentExample === 3 && showingProcess === 'change' && (
                                <div className="text-center">
                                  <div className="text-xs mb-2 text-yellow-800">
                                    <div>🛒 Achat : 3€</div>
                                    <div>💴 Je paie : 5€</div>
                                    <div>💰 On me rend : ?</div>
                                  </div>
                                  <div className="text-lg">5€ - 3€ = 2€</div>
                                </div>
                              )}
                              
                              {/* Résultat */}
                              {showingProcess === 'result' && (
                                <div className="bg-yellow-100 rounded-lg p-2 animate-pulse">
                                  <p className="text-xs font-bold text-yellow-800 text-center">
                                    {currentExample === 0 && '1 euro = 100 centimes'}
                                    {currentExample === 1 && 'Les billets valent plus'}
                                    {currentExample === 2 && `Total : ${totalValue}€`}
                                    {currentExample === 3 && `On me rend ${totalValue}€`}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Récapitulatif */}
                  <div className={`mt-6 p-4 rounded-xl transition-all duration-500 ${
                    highlightedElement === 'summary' ? 'bg-yellow-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-yellow-800">
                      💰 <strong>Maintenant tu peux :</strong> Utiliser la monnaie comme un vrai marchand !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-yellow-800 mb-4 text-center">
                🎁 Conseils pour bien utiliser l'argent
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-yellow-700 mb-2">Regarde bien</h4>
                  <p className="text-yellow-600">Chaque pièce et billet a sa valeur</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🔢</div>
                  <h4 className="font-bold text-yellow-700 mb-2">Compte lentement</h4>
                  <p className="text-yellow-600">Additionne toutes les valeurs</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">💡</div>
                  <h4 className="font-bold text-yellow-700 mb-2">1€ = 100 centimes</h4>
                  <p className="text-yellow-600">Rappelle-toi cette équivalence</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🧮</div>
                  <h4 className="font-bold text-yellow-700 mb-2">Vérifie la monnaie</h4>
                  <p className="text-yellow-600">Contrôle toujours ce qu'on te rend</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white rounded-xl p-8 shadow-lg">
            {!showCompletionModal ? (
              <>
                {/* En-tête de l'exercice */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📝 Exercice {currentExercise + 1} sur {exercises.length}
                  </h2>
                  <div className="bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-lg text-gray-700 mb-6">
                    {exercises[currentExercise].question}
                  </p>
                </div>

                {/* Zone de démonstration visuelle */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                  <div className="text-4xl mb-4">
                    {exercises[currentExercise].demoType === 'euro-centimes' && '🟡🪙'}
                    {exercises[currentExercise].demoType === 'coin-vs-bill' && '🪙💵'}
                    {exercises[currentExercise].demoType === 'adding-coins' && '🟡🟡'}
                    {exercises[currentExercise].demoType === 'simple-change' && '🛒💴'}
                    {exercises[currentExercise].demoType === 'smallest-coin' && '🟤'}
                    {exercises[currentExercise].demoType === 'five-euros' && '🟡🟡🟡🟡🟡'}
                    {exercises[currentExercise].demoType === 'ten-euro-bill' && '💵'}
                    {exercises[currentExercise].demoType === 'toy-change' && '🧸💵'}
                    {exercises[currentExercise].demoType === 'compare-values' && '🪙🟡'}
                    {exercises[currentExercise].demoType === 'fifteen-euros' && '💶'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {exercises[currentExercise].hint}
                  </p>
                </div>

                {/* Options de réponse */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {exercises[currentExercise].choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(choice)}
                      disabled={isCorrect !== null}
                      className={`p-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                        userAnswer === choice
                          ? isCorrect === true
                            ? 'bg-green-500 text-white shadow-lg'
                            : isCorrect === false
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-blue-500 text-white shadow-lg'
                          : isCorrect !== null && choice === exercises[currentExercise].correctAnswer
                          ? 'bg-green-200 text-green-800 shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>

                {/* Feedback et navigation */}
                {isCorrect !== null && (
                  <div className="text-center">
                    <div className={`inline-flex items-center px-6 py-3 rounded-xl font-bold text-lg mb-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 h-6 mr-2" />
                          Bravo ! Bonne réponse !
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 mr-2" />
                          Bonne réponse : {exercises[currentExercise].correctAnswer}
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={nextExercise}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
                    >
                      {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir les résultats'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Modal de fin */
              <div className="text-center">
                <div className="text-6xl mb-6">
                  {finalScore >= 8 ? '🏆' : finalScore >= 6 ? '🎉' : '💪'}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {finalScore >= 8 ? 'Excellent !' : finalScore >= 6 ? 'Très bien !' : 'Continue tes efforts !'}
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Tu as eu {finalScore} bonnes réponses sur {exercises.length} !
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetExercises}
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Recommencer
                  </button>
                  <Link
                    href="/chapitre/cp-grandeurs-mesures"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all inline-block"
                  >
                    Retour au chapitre
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