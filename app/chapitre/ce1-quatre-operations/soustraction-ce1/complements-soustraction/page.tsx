'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye, Play } from 'lucide-react';

export default function ComplementsSoustraction() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [currentTechnique, setCurrentTechnique] = useState<string | null>(null);

  // États pour les exercices  
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour Sam le Pirate
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPlayingEnonce, setIsPlayingEnonce] = useState(false);

  // États pour le cadre séparé des exemples
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);

  // Techniques de compléments en soustraction
  const complementTechniques = [
    {
      id: 'complement-10-soustraction',
      title: 'Compléments à 10 en soustraction',
      icon: '🎯',
      description: 'Utiliser les compléments à 10 pour faciliter les soustractions',
      examples: [
        { 
          calculation: '17 - 9', 
          num1: 17, 
          num2: 9, 
          result: 8,
          steps: [
            'Je transforme : 17 - 9 = 17 - 10 + 1',
            'Je soustrais 10 : 17 - 10 = 7',
            'J\'ajoute 1 : 7 + 1 = 8',
            'Résultat : 8 !'
          ]
        },
        { 
          calculation: '25 - 8', 
          num1: 25, 
          num2: 8, 
          result: 17,
          steps: [
            'Je transforme : 25 - 8 = 25 - 10 + 2',
            'Je soustrais 10 : 25 - 10 = 15',
            'J\'ajoute 2 : 15 + 2 = 17',
            'Résultat : 17 !'
          ]
        }
      ]
    },
    {
      id: 'complement-100-soustraction',
      title: 'Compléments à 100 en soustraction',
      icon: '💯',
      description: 'Utiliser les compléments à 100 pour les grandes soustractions',
      examples: [
        { 
          calculation: '156 - 97', 
          num1: 156, 
          num2: 97, 
          result: 59,
          steps: [
            'Je transforme : 156 - 97 = 156 - 100 + 3',
            'Je soustrais 100 : 156 - 100 = 56',
            'J\'ajoute 3 : 56 + 3 = 59',
            'Résultat : 59 !'
          ]
        },
        { 
          calculation: '234 - 89', 
          num1: 234, 
          num2: 89, 
          result: 145,
          steps: [
            'Je transforme : 234 - 89 = 234 - 100 + 11',
            'Je soustrais 100 : 234 - 100 = 134',
            'J\'ajoute 11 : 134 + 11 = 145',
            'Résultat : 145 !'
          ]
        }
      ]
    },
    {
      id: 'soustraction-par-complement',
      title: 'Soustraction par complément',
      icon: '🔄',
      description: 'Transformer une soustraction difficile en addition',
      examples: [
        { 
          calculation: '63 - 28', 
          num1: 63, 
          num2: 28, 
          result: 35,
          steps: [
            'Je cherche : 28 + ? = 63',
            'De 28 à 30 : +2',
            'De 30 à 63 : +33',
            'Total : 2 + 33 = 35 !'
          ]
        },
        { 
          calculation: '81 - 47', 
          num1: 81, 
          num2: 47, 
          result: 34,
          steps: [
            'Je cherche : 47 + ? = 81',
            'De 47 à 50 : +3',
            'De 50 à 81 : +31',
            'Total : 3 + 31 = 34 !'
          ]
        }
      ]
    }
  ];

  // Exercices de compléments en soustraction
  const exercises = [
    { question: '16 - 9 = ?', answer: 7, technique: 'complement-10' },
    { question: '23 - 8 = ?', answer: 15, technique: 'complement-10' },
    { question: '145 - 96 = ?', answer: 49, technique: 'complement-100' },
    { question: '187 - 89 = ?', answer: 98, technique: 'complement-100' },
    { question: '52 - 27 = ?', answer: 25, technique: 'par-complement' },
    { question: '74 - 38 = ?', answer: 36, technique: 'par-complement' },
    { question: '34 - 7 = ?', answer: 27, technique: 'complement-10' },
    { question: '156 - 98 = ?', answer: 58, technique: 'complement-100' },
    { question: '91 - 46 = ?', answer: 45, technique: 'par-complement' },
    { question: '42 - 9 = ?', answer: 33, technique: 'complement-10' }
  ];

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      currentAudioRef.current = utterance;
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.7 : 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      const voices = speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('fr'));
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onend = () => {
        currentAudioRef.current = null;
        resolve();
      };

      utterance.onerror = () => {
        currentAudioRef.current = null;
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  };

  // Fonction d'attente
  const wait = async (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        resolve();
      }, ms);
    });
  };

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
  };

  // Fonction pour expliquer une technique
  const explainTechnique = async (techniqueIndex: number, exampleIndex: number = 0) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const technique = complementTechniques[techniqueIndex];
    const example = technique.examples[exampleIndex];
    setCurrentTechnique(technique.id);
    setCurrentExample(exampleIndex);

    try {
      setHighlightedElement('technique-title');
      await playAudio(`Découvrons la technique : ${technique.title} ! ${technique.description}`);
      await wait(1000);

      if (stopSignalRef.current) return;

      await playAudio(`Calculons ${example.calculation} avec cette méthode astucieuse.`);
      await wait(1500);

      if (stopSignalRef.current) return;

      // Explication étape par étape
      for (let i = 0; i < example.steps.length; i++) {
        if (stopSignalRef.current) return;
        await playAudio(example.steps[i]);
        await wait(1500);
      }

    } catch (error) {
      console.error('Erreur dans explainTechnique:', error);
    } finally {
      setIsAnimationRunning(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour vérifier la réponse
  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correctAnswer = exercises[currentExercise].answer;
    
    if (userNum === correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
      setAnsweredCorrectly(new Set(Array.from(answeredCorrectly).concat([currentExercise])));
      
      setTimeout(() => {
        if (currentExercise < exercises.length - 1) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          setFinalScore(score + 1);
          setShowCompletionModal(true);
        }
      }, 2000);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
        setUserAnswer('');
      }, 2000);
    }
  };

  // Gestion des événements pour arrêter les vocaux
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Détection mobile
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      {/* Bouton Stop flottant */}
      {(isPlayingVocal || isAnimationRunning) && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
          >
            <img
              src="/image/pirate-small.png"
              alt="Sam le Pirate"
              className="w-6 h-6 rounded-full"
              onError={() => setImageError(true)}
            />
            <span className="font-semibold">Stop</span>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/ce1-quatre-operations/soustraction-ce1"
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux soustractions CE1</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              🎯 Compléments en soustraction
            </h1>
            <p className="text-lg text-gray-600">
              Utilise les compléments pour faciliter tes soustractions !
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setShowExercises(false)}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
              !showExercises 
                ? 'bg-teal-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-teal-200 hover:border-teal-400'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Techniques
          </button>
          <button
            onClick={() => setShowExercises(true)}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
              showExercises 
                ? 'bg-cyan-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 border-2 border-cyan-200 hover:border-cyan-400'
            }`}
          >
            <Target className="w-5 h-5 inline mr-2" />
            Exercices
          </button>
        </div>

        {!showExercises ? (
          /* TECHNIQUES */
          <div className="space-y-6">
            {/* Introduction avec Sam le Pirate */}
            <div className="flex items-center justify-center gap-4 p-4 mb-6">
              <div className={`relative transition-all duration-700 ease-out border-2 border-teal-300 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 ${
                isPlayingVocal
                  ? 'w-20 h-20 shadow-2xl scale-110 border-teal-400' 
                  : samSizeExpanded 
                    ? 'w-16 h-16 shadow-xl scale-105' 
                    : 'w-12 h-12 shadow-lg scale-100'
              }`}>
                <img 
                  src="/image/pirate-small.png"
                  alt="Sam le Pirate"
                  className="w-full h-full object-cover rounded-full transition-all duration-500"
                  onError={() => setImageError(true)}
                />
                
                {isPlayingVocal && (
                  <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 shadow-lg animate-bounce">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM14 8.59c0 1.2.8 2.27 2 2.27v.64c-1.77 0-3.2-1.4-3.2-3.14 0-1.74 1.43-3.14 3.2-3.14v.64c-1.2 0-2 1.07-2 2.27z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <button
                onClick={async () => {
                  setIsPlayingVocal(true);
                  setHasStarted(true);
                  setSamSizeExpanded(true);
                  
                  await playAudio("Mille sabords ! Bienvenue dans l'univers des compléments en soustraction ! Aujourd'hui, tu vas apprendre des techniques de pirate pour transformer les soustractions difficiles en calculs faciles !");
                  
                  setIsPlayingVocal(false);
                  setSamSizeExpanded(false);
                }}
                disabled={isPlayingVocal}
                className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                  isPlayingVocal
                    ? 'bg-red-500 cursor-wait'
                    : hasStarted 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-teal-500 hover:bg-teal-600 hover:scale-105'
                }`}
              >
                {isPlayingVocal ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                    Sam explique...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 inline mr-2" />
                    {hasStarted ? 'Recommencer' : 'Démarrer avec Sam'}
                  </>
                )}
              </button>
            </div>

            {/* Techniques de compléments */}
            <div className="space-y-6">
              {complementTechniques.map((technique, index) => (
                <div key={technique.id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{technique.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{technique.title}</h3>
                    <p className="text-gray-600">{technique.description}</p>
                  </div>

                  {/* Sélecteur d'exemples */}
                  <div className="mb-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      {technique.examples.map((example, exampleIndex) => (
                        <button
                          key={exampleIndex}
                          onClick={() => {
                            setSelectedTechnique(technique.id);
                            setSelectedExampleIndex(exampleIndex);
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            selectedTechnique === technique.id && selectedExampleIndex === exampleIndex
                              ? 'bg-teal-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {example.calculation}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bouton d'animation */}
                  {selectedTechnique === technique.id && (
                    <div className="text-center">
                      <button
                        onClick={() => explainTechnique(index, selectedExampleIndex)}
                        disabled={isAnimationRunning}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                      >
                        <Eye className="w-5 h-5 inline mr-2" />
                        Voir l'animation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Zone d'animation */}
            <div id="animation-section" className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 min-h-[400px]">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-700 mb-4" id="technique-title">
                  Zone d'animation
                </h3>
                
                {currentTechnique && currentExample !== null ? (
                  <div className="space-y-6">
                    {/* Affichage du calcul */}
                    <div className="text-4xl font-bold text-gray-800">
                      {complementTechniques.find(t => t.id === currentTechnique)?.examples[currentExample]?.calculation}
                    </div>

                    <div className="bg-green-100 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-800">
                        Résultat : {complementTechniques.find(t => t.id === currentTechnique)?.examples[currentExample]?.result}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Sélectionne une technique et clique sur "Voir l'animation" pour commencer !
                  </div>
                )}
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
                <div className="text-lg font-semibold text-teal-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>
              
              {!showCompletionModal ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <div className="text-2xl font-bold text-gray-800 mb-4">
                      {exercises[currentExercise].question}
                    </div>
                    
                    <div className="space-y-4">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="?"
                        className="text-center text-xl font-bold border-2 border-gray-300 rounded-lg px-4 py-2 w-32"
                        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                      />
                      <div>
                        <button
                          onClick={checkAnswer}
                          disabled={!userAnswer}
                          className="bg-teal-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-50"
                        >
                          Vérifier
                        </button>
                      </div>
                    </div>
                  </div>

                  {isCorrect !== null && (
                    <div className={`text-center p-4 rounded-lg ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <div>
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                          <p className="font-bold">Parfait ! C'est correct !</p>
                        </div>
                      ) : (
                        <div>
                          <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                          <p className="font-bold">Pas tout à fait... Essaie encore !</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Bravo, maître des compléments !</h3>
                  <p className="text-xl font-bold text-gray-900 mb-6">
                    Score final : {finalScore} / {exercises.length}
                  </p>
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      setCurrentExercise(0);
                      setScore(0);
                      setUserAnswer('');
                      setIsCorrect(null);
                      setAnsweredCorrectly(new Set());
                    }}
                    className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600"
                  >
                    Recommencer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

