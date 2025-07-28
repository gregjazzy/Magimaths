'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function ContenancesCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'filling' | 'comparing' | 'result' | null>(null);
  const [animatingLiquids, setAnimatingLiquids] = useState(false);
  const [liquidLevels, setLiquidLevels] = useState<{container1: number, container2: number}>({container1: 0, container2: 0});
  
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

  // Concepts de contenance à apprendre
  const capacityConcepts = [
    {
      name: 'contient plus',
      emoji: '🥤',
      color: 'blue',
      story: 'Ce récipient peut tenir plus de liquide !',
      examples: [
        {
          container1: { name: 'bouteille', emoji: '🍼', capacity: 80, size: 'large' },
          container2: { name: 'verre', emoji: '🥛', capacity: 40, size: 'small' },
          result: 'La bouteille contient plus que le verre'
        },
        {
          container1: { name: 'bassine', emoji: '🛁', capacity: 90, size: 'large' },
          container2: { name: 'bol', emoji: '🥣', capacity: 30, size: 'small' },
          result: 'La bassine contient plus que le bol'
        }
      ]
    },
    {
      name: 'contient moins',
      emoji: '🥛',
      color: 'green',
      story: 'Ce récipient peut tenir moins de liquide !',
      examples: [
        {
          container1: { name: 'cuillère', emoji: '🥄', capacity: 20, size: 'small' },
          container2: { name: 'casserole', emoji: '🍲', capacity: 70, size: 'large' },
          result: 'La cuillère contient moins que la casserole'
        },
        {
          container1: { name: 'dé à coudre', emoji: '🪡', capacity: 10, size: 'small' },
          container2: { name: 'tasse', emoji: '☕', capacity: 50, size: 'medium' },
          result: 'Le dé à coudre contient moins que la tasse'
        }
      ]
    },
    {
      name: 'même contenance',
      emoji: '🥤',
      color: 'purple',
      story: 'Ces récipients contiennent exactement pareil !',
      examples: [
        {
          container1: { name: 'verre A', emoji: '🥛', capacity: 50, size: 'medium' },
          container2: { name: 'verre B', emoji: '🥛', capacity: 50, size: 'medium' },
          result: 'Les deux verres ont la même contenance'
        },
        {
          container1: { name: 'tasse A', emoji: '☕', capacity: 60, size: 'medium' },
          container2: { name: 'tasse B', emoji: '☕', capacity: 60, size: 'medium' },
          result: 'Les deux tasses ont la même contenance'
        }
      ]
    },
    {
      name: 'le litre',
      emoji: '🪣',
      color: 'orange',
      story: 'Le litre, c\'est l\'unité pour mesurer les liquides !',
      examples: [
        {
          container1: { name: 'bouteille d\'eau', emoji: '💧', capacity: 100, size: 'large' },
          container2: { name: 'petit gobelet', emoji: '🥤', capacity: 25, size: 'small' },
          result: 'La bouteille : 1 litre, le gobelet : 25 centilitres'
        },
        {
          container1: { name: 'bidon', emoji: '🪣', capacity: 100, size: 'large' },
          container2: { name: 'verre', emoji: '🥛', capacity: 20, size: 'small' },
          result: 'Le bidon : 1 litre, le verre : 20 centilitres'
        }
      ]
    }
  ];

  // Exercices sur les contenances
  const exercises = [
    { 
      question: 'Entre une cuillère et un bol, lequel contient plus ?', 
      correctAnswer: 'le bol',
      choices: ['la cuillère', 'le bol', 'ils contiennent pareil'],
      hint: 'Pense à la taille de ces objets...',
      demoType: 'spoon-vs-bowl'
    },
    { 
      question: 'Pour mesurer la contenance, on utilise...', 
      correctAnswer: 'des litres',
      choices: ['des grammes', 'des litres', 'des centimètres'],
      hint: 'L\'unité pour les liquides...',
      demoType: 'liquid-unit'
    },
    { 
      question: 'Si je verse la même quantité d\'eau dans deux verres identiques...', 
      correctAnswer: 'ils contiennent pareil',
      choices: ['l\'un contient plus', 'ils contiennent pareil', 'l\'un contient moins'],
      hint: 'Quand tout est identique...',
      demoType: 'same-glasses'
    },
    { 
      question: 'Un récipient plus grand...', 
      correctAnswer: 'peut contenir plus',
      choices: ['contient toujours moins', 'peut contenir plus', 'ne change rien'],
      hint: 'Plus c\'est grand...',
      demoType: 'bigger-container'
    },
    { 
      question: 'Entre une piscine et un verre, lequel contient plus ?', 
      correctAnswer: 'la piscine',
      choices: ['le verre', 'la piscine', 'ils contiennent pareil'],
      hint: 'Compare les tailles...',
      demoType: 'pool-vs-glass'
    },
    { 
      question: '1 litre, c\'est...', 
      correctAnswer: '100 centilitres',
      choices: ['10 centilitres', '100 centilitres', '1000 centilitres'],
      hint: 'Centi veut dire centième...',
      demoType: 'liter-centiliter'
    },
    { 
      question: 'Pour comparer deux contenances, je peux...', 
      correctAnswer: 'verser l\'eau d\'un récipient dans l\'autre',
      choices: ['regarder seulement', 'verser l\'eau d\'un récipient dans l\'autre', 'les peser'],
      hint: 'Comment voir qui contient plus ?',
      demoType: 'comparison-method'
    },
    { 
      question: 'Une bouteille d\'eau contient généralement...', 
      correctAnswer: '1 litre',
      choices: ['1 centilitre', '1 litre', '10 litres'],
      hint: 'C\'est écrit sur l\'étiquette...',
      demoType: 'water-bottle'
    },
    { 
      question: 'Si je bois la moitié d\'un verre, il reste...', 
      correctAnswer: 'moins qu\'avant',
      choices: ['plus qu\'avant', 'moins qu\'avant', 'pareil qu\'avant'],
      hint: 'Quand on enlève du liquide...',
      demoType: 'half-glass'
    },
    { 
      question: 'Une baignoire peut contenir...', 
      correctAnswer: 'beaucoup de litres',
      choices: ['1 centilitre', '1 litre', 'beaucoup de litres'],
      hint: 'Il faut beaucoup d\'eau pour un bain...',
      demoType: 'bathtub-capacity'
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
    setAnimatingLiquids(false);
    setLiquidLevels({container1: 0, container2: 0});
    
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
        audio: "Bonjour petit chimiste ! Aujourd'hui, nous allons apprendre à comparer les contenances. Qui contient plus, moins, ou pareil !"
      },
      {
        action: () => {
          setHighlightedElement('concepts-explanation');
          setCurrentExample(0);
        },
        audio: "Voici les 4 façons de comparer les contenances : contient plus, contient moins, même contenance, et mesurer en litres !"
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('filling');
          setAnimatingLiquids(true);
        },
        audio: "Commençons par 'contient plus'. Regardons cette bouteille et ce verre !"
      },
      {
        action: () => {
          setShowingProcess('comparing');
          setLiquidLevels({container1: 80, container2: 40});
        },
        audio: "Je verse la même quantité dans chaque récipient. Regarde ! La bouteille peut en tenir plus !"
      },
      {
        action: () => {
          setShowingProcess('result');
        },
        audio: "Quand un récipient peut tenir plus de liquide, on dit qu'il CONTIENT PLUS. La bouteille contient plus !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('filling');
          setLiquidLevels({container1: 0, container2: 0});
        },
        audio: "Maintenant 'contient moins'. Regardons cette cuillère et cette casserole !"
      },
      {
        action: () => {
          setShowingProcess('comparing');
          setLiquidLevels({container1: 20, container2: 70});
        },
        audio: "La cuillère déborde vite ! Elle ne peut pas tenir autant que la casserole."
      },
      {
        action: () => {
          setShowingProcess('result');
        },
        audio: "Quand un récipient peut tenir moins de liquide, on dit qu'il CONTIENT MOINS. La cuillère contient moins !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setShowingProcess('filling');
          setLiquidLevels({container1: 0, container2: 0});
        },
        audio: "Voici la 'même contenance'. Regardons ces deux verres identiques !"
      },
      {
        action: () => {
          setShowingProcess('comparing');
          setLiquidLevels({container1: 50, container2: 50});
        },
        audio: "Je verse la même quantité dans chaque verre. Ils se remplissent pareil !"
      },
      {
        action: () => {
          setShowingProcess('result');
        },
        audio: "Quand deux récipients peuvent tenir la même quantité, ils ont la MÊME CONTENANCE !"
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('filling');
          setLiquidLevels({container1: 0, container2: 0});
        },
        audio: "Enfin, mesurer en litres ! C'est l'unité pour mesurer les liquides."
      },
      {
        action: () => {
          setShowingProcess('result');
          setLiquidLevels({container1: 100, container2: 25});
        },
        audio: "Cette bouteille contient 1 litre, ce gobelet 25 centilitres. 1 litre = 100 centilitres !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
          setAnimatingLiquids(false);
          setLiquidLevels({container1: 0, container2: 0});
        },
        audio: "Parfait ! Maintenant tu peux comparer toutes les contenances : plus, moins, pareil, ou mesurer !"
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
      await playAudio("Maintenant, teste tes connaissances sur les contenances avec les exercices !");
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
        playAudio("Félicitations ! Tu es maintenant un expert des contenances !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien les contenances !");
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
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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
              🥤 Comparer des contenances
            </h1>
            <p className="text-lg text-gray-600">
              Découvre qui contient plus, moins, ou pareil !
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
                  ? 'bg-purple-500 text-white shadow-md' 
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
                  ? 'bg-purple-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'introduction' ? 'ring-4 ring-purple-400 bg-purple-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🥤 Comment comparer des contenances ?
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-purple-800 font-semibold mb-6">
                  Comparer des contenances, c'est savoir qui peut contenir plus, moins, ou pareil !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${capacityConcepts[currentExample].name} ${capacityConcepts[currentExample].emoji}` 
                        : 'Les 4 façons de comparer 🥤'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des concepts */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'concepts-explanation' ? 'ring-2 ring-purple-400' : ''
                  }`}>
                    {capacityConcepts.map((concept, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingLiquids
                            ? 'ring-4 ring-purple-400 bg-purple-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{concept.emoji}</div>
                        <h4 className="font-bold text-purple-700 mb-1 text-sm sm:text-base">{concept.name}</h4>
                        <p className="text-xs sm:text-sm text-purple-600">{concept.story.substring(0, 40)}...</p>
                        
                        {/* Zone d'animation pour chaque concept */}
                        {currentExample === index && animatingLiquids && (
                          <div className="mt-4">
                            {/* Animation de contenants */}
                            <div className="bg-white rounded-lg p-3 border-2 border-purple-200">
                              {/* Contenants avec liquides */}
                              <div className="flex justify-center items-end space-x-4 mb-3">
                                <div className="text-center">
                                  <div className="text-2xl mb-1">{concept.examples[0].container1.emoji}</div>
                                  <div className="relative bg-gray-200 border-2 border-gray-400 rounded" style={{width: '30px', height: '40px'}}>
                                    <div 
                                      className="absolute bottom-0 bg-blue-400 rounded transition-all duration-1000"
                                      style={{ 
                                        width: '100%',
                                        height: showingProcess === 'comparing' ? `${liquidLevels.container1}%` : '0%'
                                      }}
                                    />
                                  </div>
                                  <div className="text-xs mt-1">{concept.examples[0].container1.name}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl mb-1">{concept.examples[0].container2.emoji}</div>
                                  <div className="relative bg-gray-200 border-2 border-gray-400 rounded" style={{width: '30px', height: concept.examples[0].container2.size === 'small' ? '25px' : concept.examples[0].container2.size === 'medium' ? '35px' : '40px'}}>
                                    <div 
                                      className="absolute bottom-0 bg-red-400 rounded transition-all duration-1000"
                                      style={{ 
                                        width: '100%',
                                        height: showingProcess === 'comparing' ? `${liquidLevels.container2}%` : '0%'
                                      }}
                                    />
                                  </div>
                                  <div className="text-xs mt-1">{concept.examples[0].container2.name}</div>
                                </div>
                              </div>
                              
                              {/* Résultat de la comparaison */}
                              {showingProcess === 'result' && (
                                <div className="bg-purple-100 rounded-lg p-2 animate-pulse">
                                  <p className="text-xs font-bold text-purple-800 text-center">
                                    {concept.examples[0].result}
                                  </p>
                                </div>
                              )}

                              {/* Mesures en litres */}
                              {currentExample === 3 && showingProcess === 'result' && (
                                <div className="mt-2">
                                  <div className="bg-yellow-100 rounded-lg p-2">
                                    <p className="text-xs text-center text-yellow-800">
                                      💡 1L = 100cL
                                    </p>
                                  </div>
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
                    highlightedElement === 'summary' ? 'bg-purple-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-purple-800">
                      🥤 <strong>Maintenant tu peux :</strong> Comparer toutes les contenances autour de toi !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">
                🎁 Conseils pour bien comparer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">💧</div>
                  <h4 className="font-bold text-purple-700 mb-2">Verse le même liquide</h4>
                  <p className="text-purple-600">Pour comparer, utilise la même quantité</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-purple-700 mb-2">Regarde les niveaux</h4>
                  <p className="text-purple-600">Celui qui se remplit moins contient plus</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🥤</div>
                  <h4 className="font-bold text-purple-700 mb-2">Mesure en litres</h4>
                  <p className="text-purple-600">Pour connaître la contenance exacte</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🔢</div>
                  <h4 className="font-bold text-purple-700 mb-2">1 L = 100 cL</h4>
                  <p className="text-purple-600">Rappelle-toi cette équivalence</p>
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
                      className="bg-purple-500 h-3 rounded-full transition-all duration-300"
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
                    {exercises[currentExercise].demoType === 'spoon-vs-bowl' && '🥄🥣'}
                    {exercises[currentExercise].demoType === 'liquid-unit' && '📊'}
                    {exercises[currentExercise].demoType === 'same-glasses' && '🥛🥛'}
                    {exercises[currentExercise].demoType === 'bigger-container' && '🪣'}
                    {exercises[currentExercise].demoType === 'pool-vs-glass' && '🏊‍♂️🥛'}
                    {exercises[currentExercise].demoType === 'liter-centiliter' && '🔢'}
                    {exercises[currentExercise].demoType === 'comparison-method' && '💧'}
                    {exercises[currentExercise].demoType === 'water-bottle' && '💧'}
                    {exercises[currentExercise].demoType === 'half-glass' && '🥛💧'}
                    {exercises[currentExercise].demoType === 'bathtub-capacity' && '🛁'}
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
                    className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
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