'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function TempsCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'timeline' | 'clock' | 'calendar' | 'result' | null>(null);
  const [animatingTime, setAnimatingTime] = useState(false);
  const [clockHour, setClockHour] = useState(12);
  const [calendarDay, setCalendarDay] = useState(15);
  
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

  // Concepts de temps à apprendre
  const timeConcepts = [
    {
      name: 'hier, aujourd\'hui, demain',
      emoji: '📅',
      color: 'blue',
      story: 'Le temps passe : hier c\'est fini, aujourd\'hui c\'est maintenant, demain c\'est plus tard !',
      examples: [
        {
          moment: 'hier',
          description: 'C\'est déjà passé, je me souviens',
          icon: '⬅️',
          color: 'gray'
        },
        {
          moment: 'aujourd\'hui',
          description: 'C\'est maintenant, je le vis',
          icon: '📍',
          color: 'green'
        },
        {
          moment: 'demain',
          description: 'C\'est plus tard, j\'attends',
          icon: '➡️',
          color: 'blue'
        }
      ]
    },
    {
      name: 'les heures',
      emoji: '🕐',
      color: 'green',
      story: 'L\'horloge nous dit l\'heure : matin, midi, après-midi, soir !',
      examples: [
        {
          moment: '8h - matin',
          description: 'Je me lève, je prends mon petit-déjeuner',
          icon: '🌅',
          color: 'yellow'
        },
        {
          moment: '12h - midi',
          description: 'Je mange le déjeuner, le soleil est haut',
          icon: '🌞',
          color: 'orange'
        },
        {
          moment: '16h - après-midi',
          description: 'Je joue, je fais mes devoirs',
          icon: '🌤️',
          color: 'blue'
        },
        {
          moment: '20h - soir',
          description: 'Je dîne, je me prépare pour dormir',
          icon: '🌙',
          color: 'purple'
        }
      ]
    },
    {
      name: 'les jours de la semaine',
      emoji: '📆',
      color: 'purple',
      story: 'Une semaine a 7 jours qui se répètent toujours dans le même ordre !',
      examples: [
        {
          moment: 'lundi',
          description: 'Premier jour de la semaine, retour à l\'école',
          icon: '1️⃣',
          color: 'red'
        },
        {
          moment: 'mercredi',
          description: 'Milieu de la semaine, parfois pas école',
          icon: '3️⃣',
          color: 'green'
        },
        {
          moment: 'vendredi',
          description: 'Dernier jour d\'école de la semaine',
          icon: '5️⃣',
          color: 'blue'
        },
        {
          moment: 'dimanche',
          description: 'Jour de repos, en famille',
          icon: '7️⃣',
          color: 'gold'
        }
      ]
    },
    {
      name: 'les mois et saisons',
      emoji: '🗓️',
      color: 'orange',
      story: 'Une année a 12 mois et 4 saisons qui se suivent !',
      examples: [
        {
          moment: 'mars - printemps',
          description: 'Les fleurs poussent, il fait plus doux',
          icon: '🌸',
          color: 'pink'
        },
        {
          moment: 'juillet - été',
          description: 'Il fait chaud, ce sont les vacances',
          icon: '☀️',
          color: 'yellow'
        },
        {
          moment: 'octobre - automne',
          description: 'Les feuilles tombent, il fait plus frais',
          icon: '🍂',
          color: 'orange'
        },
        {
          moment: 'janvier - hiver',
          description: 'Il fait froid, parfois il neige',
          icon: '❄️',
          color: 'blue'
        }
      ]
    }
  ];

  // Exercices sur le temps
  const exercises = [
    { 
      question: 'Quand je dis "hier", je parle de...', 
      correctAnswer: 'le jour d\'avant',
      choices: ['le jour d\'avant', 'maintenant', 'plus tard'],
      hint: 'C\'est déjà passé...',
      demoType: 'yesterday'
    },
    { 
      question: 'À quelle heure je prends généralement mon petit-déjeuner ?', 
      correctAnswer: 'le matin vers 8h',
      choices: ['le soir vers 20h', 'le matin vers 8h', 'la nuit vers minuit'],
      hint: 'Quand je me lève...',
      demoType: 'breakfast-time'
    },
    { 
      question: 'Combien y a-t-il de jours dans une semaine ?', 
      correctAnswer: '7 jours',
      choices: ['5 jours', '7 jours', '10 jours'],
      hint: 'Compte les jours de lundi à dimanche...',
      demoType: 'week-days'
    },
    { 
      question: 'Quel jour vient après mardi ?', 
      correctAnswer: 'mercredi',
      choices: ['lundi', 'mercredi', 'jeudi'],
      hint: 'Dans l\'ordre de la semaine...',
      demoType: 'days-order'
    },
    { 
      question: 'En quelle saison les feuilles tombent-elles ?', 
      correctAnswer: 'en automne',
      choices: ['au printemps', 'en automne', 'en hiver'],
      hint: 'Quand il commence à faire frais...',
      demoType: 'autumn-leaves'
    },
    { 
      question: 'Combien y a-t-il de mois dans une année ?', 
      correctAnswer: '12 mois',
      choices: ['10 mois', '12 mois', '15 mois'],
      hint: 'De janvier à décembre...',
      demoType: 'year-months'
    },
    { 
      question: 'À midi, le soleil est...', 
      correctAnswer: 'très haut dans le ciel',
      choices: ['couché', 'très haut dans le ciel', 'pas encore levé'],
      hint: 'Au milieu de la journée...',
      demoType: 'noon-sun'
    },
    { 
      question: 'Demain, c\'est...', 
      correctAnswer: 'le jour suivant',
      choices: ['le jour d\'avant', 'le jour suivant', 'maintenant'],
      hint: 'Ce qui va arriver...',
      demoType: 'tomorrow'
    },
    { 
      question: 'En été, il fait généralement...', 
      correctAnswer: 'chaud',
      choices: ['froid', 'chaud', 'ni chaud ni froid'],
      hint: 'La saison des vacances...',
      demoType: 'summer-weather'
    },
    { 
      question: 'Le weekend, ce sont les jours...', 
      correctAnswer: 'samedi et dimanche',
      choices: ['lundi et mardi', 'samedi et dimanche', 'mercredi et jeudi'],
      hint: 'Les jours sans école...',
      demoType: 'weekend-days'
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
    setAnimatingTime(false);
    setClockHour(12);
    setCalendarDay(15);
    
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
        audio: "Bonjour petit voyageur du temps ! Aujourd'hui, nous allons apprendre à nous repérer dans le temps. Hier, aujourd'hui, demain !"
      },
      {
        action: () => {
          setHighlightedElement('concepts-explanation');
          setCurrentExample(0);
        },
        audio: "Voici les 4 façons de se repérer dans le temps : les jours, les heures, la semaine, et l'année avec ses saisons !"
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('timeline');
          setAnimatingTime(true);
        },
        audio: "Commençons par hier, aujourd'hui, demain. C'est comme une ligne : le passé, le présent, le futur !"
      },
      {
        action: () => {
          setShowingProcess('result');
        },
        audio: "HIER c'est fini, AUJOURD'HUI c'est maintenant, DEMAIN c'est plus tard. Le temps avance toujours !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('clock');
          setClockHour(8);
        },
        audio: "Maintenant les heures ! L'horloge nous dit quand faire les choses. 8h : je me lève !"
      },
      {
        action: () => {
          setClockHour(12);
        },
        audio: "12h : c'est midi, je mange mon déjeuner. Le soleil est très haut dans le ciel !"
      },
      {
        action: () => {
          setClockHour(20);
        },
        audio: "20h : c'est le soir, je dîne et je me prépare pour dormir. Bonne nuit !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setShowingProcess('calendar');
          setCalendarDay(1);
        },
        audio: "Voici la semaine ! 7 jours qui se répètent : lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche !"
      },
      {
        action: () => {
          setCalendarDay(7);
          setShowingProcess('result');
        },
        audio: "Les jours d'école et le weekend ! Samedi et dimanche, c'est le repos !"
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('calendar');
        },
        audio: "Enfin, les mois et les saisons ! Une année a 12 mois et 4 saisons."
      },
      {
        action: () => {
          setShowingProcess('result');
        },
        audio: "Printemps : les fleurs ! Été : les vacances ! Automne : les feuilles tombent ! Hiver : la neige !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
          setAnimatingTime(false);
        },
        audio: "Parfait ! Maintenant tu peux te repérer dans le temps : jours, heures, semaines, mois et saisons !"
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
      await playAudio("Maintenant, teste tes connaissances sur le temps avec les exercices !");
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
        playAudio("Félicitations ! Tu es maintenant un expert du temps !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien le temps !");
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
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
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
              🕐 Se repérer dans le temps
            </h1>
            <p className="text-lg text-gray-600">
              Découvre hier, aujourd'hui, demain et bien plus !
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
                  ? 'bg-orange-500 text-white shadow-md' 
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
                  ? 'bg-orange-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'introduction' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🕐 Comment se repérer dans le temps ?
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-orange-800 font-semibold mb-6">
                  Se repérer dans le temps, c'est savoir quand les choses arrivent !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-orange-600 mb-4">
                      {currentExample !== null ? 
                        `Découvrons : ${timeConcepts[currentExample].name} ${timeConcepts[currentExample].emoji}` 
                        : 'Les 4 façons de se repérer ⏰'
                      }
                    </div>
                  </div>

                  {/* Démonstrations des concepts */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'concepts-explanation' ? 'ring-2 ring-orange-400' : ''
                  }`}>
                    {timeConcepts.map((concept, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingTime
                            ? 'ring-4 ring-orange-400 bg-orange-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{concept.emoji}</div>
                        <h4 className="font-bold text-orange-700 mb-1 text-sm sm:text-base">{concept.name.split(',')[0]}</h4>
                        <p className="text-xs sm:text-sm text-orange-600">{concept.story.substring(0, 40)}...</p>
                        
                        {/* Zone d'animation pour chaque concept */}
                        {currentExample === index && animatingTime && (
                          <div className="mt-4">
                            {/* Animation selon le concept */}
                            <div className="bg-white rounded-lg p-3 border-2 border-orange-200">
                              
                              {/* Timeline pour hier/aujourd'hui/demain */}
                              {currentExample === 0 && (
                                <div className="flex justify-between items-center mb-2">
                                  {concept.examples.map((example, idx) => (
                                    <div key={idx} className="text-center flex-1">
                                      <div className="text-xl mb-1">{example.icon}</div>
                                      <div className="text-xs font-bold text-orange-700">{example.moment}</div>
                                      <div className="text-xs text-orange-600">{example.description.substring(0, 20)}...</div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Horloge pour les heures */}
                              {currentExample === 1 && showingProcess === 'clock' && (
                                <div className="text-center">
                                  <div className="relative w-16 h-16 mx-auto mb-2 border-4 border-orange-400 rounded-full">
                                    <div 
                                      className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-orange-600 origin-left transition-all duration-1000"
                                      style={{ 
                                        transform: `translate(-50%, -50%) rotate(${(clockHour % 12) * 30 - 90}deg)`
                                      }}
                                    />
                                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">12</div>
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold">6</div>
                                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs font-bold">3</div>
                                    <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs font-bold">9</div>
                                  </div>
                                  <div className="text-sm font-bold text-orange-700">{clockHour}h</div>
                                  <div className="text-xs text-orange-600">
                                    {clockHour === 8 && 'Petit-déjeuner 🌅'}
                                    {clockHour === 12 && 'Déjeuner 🌞'}
                                    {clockHour === 20 && 'Dîner 🌙'}
                                  </div>
                                </div>
                              )}

                              {/* Calendrier pour les jours/mois */}
                              {currentExample >= 2 && showingProcess === 'calendar' && (
                                <div className="text-center">
                                  <div className="grid grid-cols-7 gap-1 text-xs">
                                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                                      <div 
                                        key={idx} 
                                        className={`w-4 h-4 flex items-center justify-center rounded ${
                                          calendarDay === idx + 1 ? 'bg-orange-400 text-white' : 'bg-gray-200'
                                        }`}
                                      >
                                        {day}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="text-xs mt-2 font-bold text-orange-700">
                                    {currentExample === 2 && 'Semaine'}
                                    {currentExample === 3 && 'Année - 4 saisons'}
                                  </div>
                                </div>
                              )}
                              
                              {/* Résultat */}
                              {showingProcess === 'result' && (
                                <div className="bg-orange-100 rounded-lg p-2 animate-pulse">
                                  <p className="text-xs font-bold text-orange-800 text-center">
                                    {currentExample === 0 && 'Passé → Présent → Futur'}
                                    {currentExample === 1 && 'Matin → Midi → Soir'}
                                    {currentExample === 2 && '7 jours qui se répètent'}  
                                    {currentExample === 3 && '12 mois, 4 saisons'}
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
                    highlightedElement === 'summary' ? 'bg-orange-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-orange-800">
                      🕐 <strong>Maintenant tu peux :</strong> Te repérer dans le temps comme un expert !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-orange-800 mb-4 text-center">
                🎁 Conseils pour se repérer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📅</div>
                  <h4 className="font-bold text-orange-700 mb-2">Utilise un calendrier</h4>
                  <p className="text-orange-600">Pour voir les jours et les mois</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🕐</div>
                  <h4 className="font-bold text-orange-700 mb-2">Regarde l'horloge</h4>
                  <p className="text-orange-600">Pour savoir quelle heure il est</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🌅</div>
                  <h4 className="font-bold text-orange-700 mb-2">Observe la nature</h4>
                  <p className="text-orange-600">Le soleil, les saisons changent</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📋</div>
                  <h4 className="font-bold text-orange-700 mb-2">Fais un planning</h4>
                  <p className="text-orange-600">Pour organiser tes activités</p>
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
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
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
                    {exercises[currentExercise].demoType === 'yesterday' && '⬅️📅'}
                    {exercises[currentExercise].demoType === 'breakfast-time' && '🌅🥣'}
                    {exercises[currentExercise].demoType === 'week-days' && '📆'}
                    {exercises[currentExercise].demoType === 'days-order' && '📅➡️'}
                    {exercises[currentExercise].demoType === 'autumn-leaves' && '🍂🍃'}
                    {exercises[currentExercise].demoType === 'year-months' && '🗓️'}
                    {exercises[currentExercise].demoType === 'noon-sun' && '🌞'}
                    {exercises[currentExercise].demoType === 'tomorrow' && '➡️📅'}
                    {exercises[currentExercise].demoType === 'summer-weather' && '☀️🏖️'}
                    {exercises[currentExercise].demoType === 'weekend-days' && '🏠📚'}
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
                    className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
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