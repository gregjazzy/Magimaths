'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

export default function Multiplications2_5_10() {
  // États principaux
  const [gameMode, setGameMode] = useState<'dojo' | 'training' | 'mission' | 'dojo-select' | 'duel-2players'>('dojo');
  const [currentDojo, setCurrentDojo] = useState(1);
  const [ninjaEnergy, setNinjaEnergy] = useState(100);
  const [masterEnergy, setMasterEnergy] = useState(100);
  const [currentKata, setCurrentKata] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);

  // États de duel
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [duelPhase, setDuelPhase] = useState<'kata' | 'result' | 'counter-attack' | 'victory' | 'defeat'>('kata');
  
  // États d'animation et effets
  const [isStriking, setIsStriking] = useState(false);
  const [isUnderAttack, setIsUnderAttack] = useState(false);
  const [damageDealt, setDamageDealt] = useState(0);
  const [damageReceived, setDamageReceived] = useState(0);
  const [showCriticalStrike, setShowCriticalStrike] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  // Audio
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const stopSignalRef = useRef(false);

  // États du mode duel 2 joueurs
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [duelTimer, setDuelTimer] = useState(15);
  const [isDuelTimerRunning, setIsDuelTimerRunning] = useState(false);

  // États de correction
  const [showDuelCorrection, setShowDuelCorrection] = useState(false);
  const [showTrainingCorrection, setShowTrainingCorrection] = useState(false);

  // Référence pour l'input
  const inputRef = useRef<HTMLInputElement>(null);

  // Configuration des dojos ninjas
  const ninjaDojos = [
    {
      id: 1,
      name: "Dojo des Novices",
      description: "Multiplications par 2 et 10",
      emoji: "🥷",
      boss: { name: "Sensei Kato", emoji: "👨‍🏫", energy: 80 }
    },
    {
      id: 2,
      name: "Temple des Maîtres",
      description: "Multiplications par 2, 5 et 10",
      emoji: "⛩️",
      boss: { name: "Maître Yamamoto", emoji: "🧙‍♂️", energy: 120 }
    }
  ];

  // Fonction pour générer les katas (questions)
  const generateKata = (dojoLevel = currentDojo) => {
    let num1: number, num2: number, question: string, answer: number, explanation: string;
    
    if (dojoLevel === 1) {
      // Dojo des Novices: multiplications par 2 et 10
      const multipliers = [2, 10];
      const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      num1 = Math.floor(Math.random() * 10) + 1; // 1 à 10
      
      question = `${num1} × ${multiplier}`;
      answer = num1 * multiplier;
      explanation = `${num1} × ${multiplier} = ${answer}`;
    } else {
      // Temple des Maîtres: multiplications par 2, 5 et 10
      const multipliers = [2, 5, 10];
      const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      num1 = Math.floor(Math.random() * 12) + 1; // 1 à 12
      
      question = `${num1} × ${multiplier}`;
      answer = num1 * multiplier;
      explanation = `${num1} × ${multiplier} = ${answer}`;
    }

    return { question, answer, explanation };
  };

  // Fonction vocale
  const speak = (text: string) => {
    if (!soundEnabled || isPlayingVocal) return;
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsPlayingVocal(false);
    };
    
    utterance.onerror = () => {
      setIsPlayingVocal(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  // Gestion du timer pour les duels
  useEffect(() => {
    if (gameMode === 'mission' && isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameMode === 'mission' && timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, isTimerRunning, gameMode]);

  // Gestion du timer pour duel 2 joueurs
  useEffect(() => {
    if (gameMode === 'duel-2players' && isDuelTimerRunning && duelTimer > 0) {
      const timer = setTimeout(() => {
        setDuelTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameMode === 'duel-2players' && duelTimer === 0) {
      handleDuelTimeout();
    }
  }, [duelTimer, isDuelTimerRunning, gameMode]);

    // Gestion du timeout
  const handleTimeout = () => {
    setIsTimerRunning(false);
    setTotalAnswers(prev => prev + 1);
    setShowCorrectAnswer(true);
    setDuelPhase('result');
    speak(`Temps écoulé ! La bonne réponse était ${currentKata?.answer}. ${currentKata?.explanation}`);
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      const newDamage = Math.floor(Math.random() * 15) + 10;
      setDamageReceived(newDamage);
      setNinjaEnergy(prev => Math.max(0, prev - newDamage));
      setIsUnderAttack(true);
      setDuelPhase('counter-attack');
      
      setTimeout(() => {
        setIsUnderAttack(false);
        if (ninjaEnergy - newDamage <= 0) {
          setDuelPhase('defeat');
          speak("Tu as été vaincu ! Mais tu peux recommencer ton entraînement.");
        } else {
          speak(`Continue ! Tu as ${correctAnswers} bonnes réponses sur 10 nécessaires.`);
          setCurrentKata(generateKata());
          setUserAnswer('');
          setTimeLeft(10);
          setIsTimerRunning(true);
          setDuelPhase('kata');
          if (inputRef.current) inputRef.current.focus();
        }
      }, 2000);
    }, 3000);
  };

  // Gestion du timeout pour duel 2 joueurs
  const handleDuelTimeout = () => {
    setIsDuelTimerRunning(false);
    setShowDuelCorrection(true);
    speak(`Temps écoulé pour ${currentPlayer === 1 ? 'Ninja 1' : 'Ninja 2'} ! La bonne réponse était ${currentKata?.answer}.`);
    
    setTimeout(() => {
      setShowDuelCorrection(false);
      nextDuelTurn();
    }, 3000);
  };

  // Démarrer l'entraînement
  const startTraining = () => {
    setGameMode('training');
    setCurrentKata(generateKata(1)); // Toujours niveau novice pour l'entraînement
    setUserAnswer('');
    setShowTrainingCorrection(false);
    speak("Commençons l'entraînement ninja ! Concentre-toi sur les multiplications.");
  };

    // Démarrer mission (combat boss)
  const startNinjaMission = (dojoId: number) => {
    setCurrentDojo(dojoId);
    setGameMode('mission');
    setNinjaEnergy(100);
    setMasterEnergy(ninjaDojos[dojoId - 1]?.boss.energy || 100);
    setCurrentKata(generateKata(dojoId));
    setUserAnswer('');
    setTimeLeft(10);
          setIsTimerRunning(true);
    setDuelPhase('kata');
    setShowCorrectAnswer(false);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    speak(`Bienvenue dans le ${ninjaDojos[dojoId - 1]?.name} ! Il te faut 10 bonnes réponses pour vaincre ${ninjaDojos[dojoId - 1]?.boss.name} !`);
  };

  // Démarrer duel 2 joueurs
  const startDuel2Players = () => {
    setGameMode('duel-2players');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setQuestionsLeft(10);
    setCurrentKata(generateKata(1));
    setUserAnswer('');
    setDuelTimer(15);
    setIsDuelTimerRunning(true);
    setShowDuelCorrection(false);
    speak("Duel de ninjas ! Ninja 1 commence. Que le meilleur gagne !");
  };

  // Gérer la réponse d'entraînement
  const handleTrainingAnswer = () => {
    const answer = parseInt(userAnswer);
    if (answer === currentKata?.answer) {
      speak("Excellent ! Continuons l'entraînement.");
      setCurrentKata(generateKata(1));
      setUserAnswer('');
    } else {
      setShowTrainingCorrection(true);
      speak(`Presque ! La bonne réponse était ${currentKata?.answer}. ${currentKata?.explanation}`);
      setTimeout(() => {
        setShowTrainingCorrection(false);
        setCurrentKata(generateKata(1));
        setUserAnswer('');
      }, 4000);
    }
  };

    // Gérer la réponse de mission
  const executeKata = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setTotalAnswers(prev => prev + 1);
    
    if (answer === currentKata?.answer) {
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      
      const isCritical = Math.random() < 0.3;
      setShowCriticalStrike(isCritical);
      setIsStriking(true);
      setDuelPhase('result');
      
      speak(isCritical ? "Kata parfait ! Frappe critique !" : "Bien joué ! Kata réussi !");
      
      setTimeout(() => {
        setIsStriking(false);
        
        if (newCorrectAnswers >= 10) {
          setDuelPhase('victory');
          speak(`Victoire ! Tu as réussi 10 katas et vaincu ${ninjaDojos[currentDojo - 1]?.boss.name} !`);
        } else {
          speak(`Excellente réponse ! Plus que ${10 - newCorrectAnswers} bonnes réponses pour la victoire !`);
          setCurrentKata(generateKata());
          setUserAnswer('');
          setTimeLeft(10);
          setIsTimerRunning(true);
          setDuelPhase('kata');
          if (inputRef.current) inputRef.current.focus();
        }
      }, 2000);
    } else {
      setShowCorrectAnswer(true);
      setDuelPhase('result');
      speak(`Kata manqué ! La bonne réponse était ${currentKata?.answer}. ${currentKata?.explanation}`);
      
      setTimeout(() => {
        setShowCorrectAnswer(false);
        const damage = Math.floor(Math.random() * 18) + 12;
        setDamageReceived(damage);
        setNinjaEnergy(prev => Math.max(0, prev - damage));
        setIsUnderAttack(true);
        setDuelPhase('counter-attack');
        
        setTimeout(() => {
          setIsUnderAttack(false);
          if (ninjaEnergy - damage <= 0) {
            setDuelPhase('defeat');
            speak("Tu as été vaincu ! Mais l'entraînement continue.");
          } else {
            speak(`Continue ! Tu as ${correctAnswers} bonnes réponses sur 10 nécessaires.`);
            setCurrentKata(generateKata());
            setUserAnswer('');
            setTimeLeft(10);
            setIsTimerRunning(true);
            setDuelPhase('kata');
            if (inputRef.current) inputRef.current.focus();
          }
        }, 2000);
      }, 3000);
    }
  };

  // Gérer la réponse de duel
  const handleDuelAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsDuelTimerRunning(false);
    
    if (answer === currentKata?.answer) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
      } else {
        setPlayer2Score(prev => prev + 1);
      }
      speak("Bonne réponse !");
    } else {
      setShowDuelCorrection(true);
      speak(`Mauvaise réponse ! La bonne réponse était ${currentKata?.answer}.`);
      setTimeout(() => {
        setShowDuelCorrection(false);
        nextDuelTurn();
      }, 3000);
      return;
    }
    
    nextDuelTurn();
  };

  // Tour suivant du duel
  const nextDuelTurn = () => {
      const newQuestionsLeft = questionsLeft - 1;
      setQuestionsLeft(newQuestionsLeft);
      
    if (newQuestionsLeft <= 0) {
      // Fin du duel
    if (player1Score > player2Score) {
      setPlayer1Wins(prev => prev + 1);
        speak("Ninja 1 remporte le duel !");
    } else if (player2Score > player1Score) {
      setPlayer2Wins(prev => prev + 1);
        speak("Ninja 2 remporte le duel !");
    } else {
        speak("Match nul ! Excellente performance des deux ninjas !");
      }
      
      // Recommencer un nouveau duel
    setTimeout(() => {
        setPlayer1Score(0);
        setPlayer2Score(0);
        setQuestionsLeft(10);
        setCurrentPlayer(1);
        setCurrentKata(generateKata(1));
        setUserAnswer('');
        setDuelTimer(15);
        setIsDuelTimerRunning(true);
    }, 3000);
    } else {
      // Joueur suivant
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setCurrentKata(generateKata(1));
      setUserAnswer('');
      setDuelTimer(15);
      setIsDuelTimerRunning(true);
      speak(`Au tour de ${currentPlayer === 1 ? 'Ninja 2' : 'Ninja 1'} !`);
    }
  };

  // Retour au dojo
  const resetDojo = () => {
    setGameMode('dojo');
    setCurrentKata(null);
        setUserAnswer('');
    setIsTimerRunning(false);
    setShowCorrectAnswer(false);
    setShowTrainingCorrection(false);
    setShowDuelCorrection(false);
  };

  // Retour à la sélection des dojos
  const resetToDojoSelect = () => {
    setGameMode('dojo-select');
    setCurrentKata(null);
    setUserAnswer('');
    setIsTimerRunning(false);
    setShowCorrectAnswer(false);
  };

  // Gestion des touches
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      e.preventDefault();
      if (gameMode === 'training') {
        handleTrainingAnswer();
      } else if (gameMode === 'mission') {
        executeKata();
      } else if (gameMode === 'duel-2players') {
        handleDuelAnswer();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header avec navigation */}
        <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg mb-4 sm:mb-8 border-b border-purple-500 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link 
                href="/cp" 
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <div className="text-gray-800">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold flex items-center">
                  <span className="hidden sm:inline">🥷 Dojo des Multiplications</span>
                  <span className="sm:hidden">🥷 Multiplications</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Maîtrise les tables de multiplication par 2, 5 et 10
                </p>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-gray-200 text-gray-800 p-2 rounded-lg hover:bg-gray-300 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
        </div>
      </div>

        {/* Menu principal du dojo */}
        {gameMode === 'dojo' && (
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">
                <span className="hidden sm:inline">🏯 Bienvenue au Dojo Ninja !</span>
                <span className="sm:hidden">🏯 Dojo Ninja</span>
              </h2>
              <p className="text-sm sm:text-xl text-purple-200 px-2 sm:px-0">
                <span className="hidden sm:inline">Choisis ton mode d'entraînement ninja !</span>
                <span className="sm:hidden">Choisis ton entraînement !</span>
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
              <div 
                onClick={startTraining}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all shadow-xl border-2 border-blue-500 min-h-[120px] sm:min-h-[140px]"
                >
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">🎯</div>
                  <div className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
                    <span className="hidden sm:inline">Entraînement Libre</span>
                    <span className="sm:hidden">Entraînement</span>
                  </div>
                  <div className="text-xs sm:text-sm text-blue-200 hidden sm:block">
                    Pratique sans limite
                </div>
              </div>

                <div
                  onClick={() => setGameMode('dojo-select')}
                  className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all shadow-xl border-2 border-red-500 min-h-[120px] sm:min-h-[140px]"
                >
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">⛩️</div>
                  <div className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
                    <span className="hidden sm:inline">Combat de Maître</span>
                    <span className="sm:hidden">Combat</span>
                  </div>
                  <div className="text-xs sm:text-sm text-red-200 hidden sm:block">
                    Affronte les senseis
                </div>
              </div>

              <div 
                onClick={startDuel2Players}
                  className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all shadow-xl border-2 border-green-500 min-h-[120px] sm:min-h-[140px]"
                >
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">⚔️</div>
                  <div className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
                    <span className="hidden sm:inline">Duel de Ninjas</span>
                    <span className="sm:hidden">Duel</span>
                  </div>
                  <div className="text-xs sm:text-sm text-green-200 hidden sm:block">
                    Affrontement 2 joueurs
                </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sélection des dojos */}
        {gameMode === 'dojo-select' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                🏯 Choisis ton Dojo
              </h2>
              <p className="text-lg sm:text-xl text-purple-200">Sélectionne ton niveau de difficulté</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
              {ninjaDojos.map((dojo) => (
                <div
                  key={dojo.id}
                  onClick={() => startNinjaMission(dojo.id)}
                  className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all shadow-xl border-4 border-purple-500 min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
                >
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">{dojo.emoji}</div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                      {dojo.name}
                    </h3>
                    <p className="text-sm sm:text-base text-purple-200 mb-3 sm:mb-4 hidden sm:block">
                      {dojo.description}
                    </p>
                    
                    <div className="bg-black bg-opacity-30 rounded-lg p-2 sm:p-3 md:p-4 hidden sm:block">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-2xl sm:text-3xl mr-2">{dojo.boss.emoji}</span>
                        <span className="text-sm sm:text-base font-bold">{dojo.boss.name}</span>
                    </div>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <div>🩸 Énergie: {dojo.boss.energy}</div>
                        <div>⚔️ Difficulté: {dojo.id === 1 ? 'Novice' : 'Maître'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={resetDojo}
                className="bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-xl"
              >
                🏠 Retour au Dojo
              </button>
            </div>
          </div>
        )}

        {/* Mode entraînement */}
        {gameMode === 'training' && currentKata && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                🎯 Entraînement Ninja
              </h2>
              <p className="text-lg sm:text-xl text-purple-200">
                Pratique les multiplications à ton rythme
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded-2xl p-4 sm:p-8 text-center shadow-2xl border-4 border-blue-500">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-lg sm:text-2xl mb-3 sm:mb-4 text-blue-200">
                  🥷 Kata d'Entraînement
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white animate-pulse">
                  {currentKata.question} = ?
                </div>
                </div>
                
                <input
                ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-center text-2xl sm:text-3xl md:text-4xl font-bold border-4 border-gray-800 rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 md:w-48 text-gray-800 bg-white shadow-xl min-h-[60px] touch-manipulation mb-4 sm:mb-6"
                  placeholder="?"
                  autoFocus
                />
                
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                  onClick={handleTrainingAnswer}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg font-bold hover:scale-105 transition-all text-lg sm:text-xl md:text-2xl shadow-xl min-h-[56px] touch-manipulation"
                  >
                  <span className="hidden sm:inline">🥷 KATA !</span>
                  <span className="sm:hidden">🥷 KATA</span>
                  </button>
                  <button
                  onClick={resetDojo}
                  className="bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-xl"
                  >
                  🏠 Retour
                  </button>
                </div>
              </div>

            {/* Correction en cas d'erreur dans l'entraînement */}
            {gameMode === 'training' && showTrainingCorrection && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="bg-orange-100 border-4 border-orange-500 rounded-xl p-4 sm:p-6 text-gray-800">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-5xl sm:text-6xl animate-pulse text-center">🥷</div>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600 text-center">
                      Presque !
            </div>
                    <div className="text-lg sm:text-xl font-bold mb-2 text-center">⚡ La bonne réponse était :</div>
                    <div className="text-4xl sm:text-5xl font-bold text-orange-600 animate-pulse text-center">
                      {currentKata?.answer}
                    </div>
                    {currentKata?.explanation && (
                      <div className="text-base sm:text-lg mt-4 text-gray-600 text-center">
                        {currentKata.explanation}
          </div>
        )}
                    <div className="text-sm sm:text-base text-gray-600 text-center mt-4">
                      🎯 Continue ton entraînement !
                </div>
                </div>
                </div>
                  </div>
                )}
                </div>
        )}

        {/* Mode mission (combat de boss) */}
        {gameMode === 'mission' && (
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Indicateur de progression */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="bg-blue-800 rounded-xl p-3 sm:p-4 text-center border-2 border-blue-600">
                <div className="text-2xl sm:text-3xl mb-2">🥷</div>
                <div className="text-sm sm:text-lg font-bold">Ton Ninja</div>
                <div className="bg-gray-700 rounded-full h-3 sm:h-4 mt-2">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${ninjaEnergy}%` }}
                  ></div>
                </div>
                <div className="text-sm sm:text-base font-bold">{ninjaEnergy}/100</div>
              </div>
              
              <div className="bg-green-800 rounded-xl p-3 sm:p-4 text-center border-2 border-green-600">
                <div className="text-2xl sm:text-3xl mb-2">🎯</div>
                <div className="text-sm sm:text-lg font-bold">Progression</div>
                <div className="bg-gray-700 rounded-full h-3 sm:h-4 mt-2">
                  <div 
                    className="bg-yellow-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(correctAnswers / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm sm:text-base font-bold">{correctAnswers}/10</div>
                <div className="text-xs text-green-200">bonnes réponses</div>
              </div>
            </div>

            {/* Interface principale de kata */}
            {duelPhase === 'kata' && currentKata && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl p-4 sm:p-8 text-center shadow-2xl border-4 border-purple-500">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="text-center">
                      {timeLeft > 0 && (
                        <div className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                          ⏰ {timeLeft}s
                    </div>
                      )}
                      <div className="text-lg sm:text-2xl mb-3 sm:mb-4 text-purple-200">
                        🥷 Kata de Combat
                  </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white animate-pulse">
                        {currentKata.question} = ?
                    </div>
                    </div>
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-center text-2xl sm:text-3xl md:text-4xl font-bold border-4 border-gray-800 rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 md:w-48 text-gray-800 bg-white shadow-xl min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-4 sm:mt-6">
                    <button
                      onClick={executeKata}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg font-bold hover:scale-105 transition-all text-lg sm:text-xl md:text-2xl shadow-xl min-h-[56px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">⚡ KATA ! ATTAQUE !</span>
                      <span className="sm:hidden">⚡ ATTAQUE !</span>
                    </button>
                  </div>
                  </div>
                </div>
              )}

                        {/* Résultat de kata réussi */}
            {duelPhase === 'result' && isStriking && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-4 sm:p-8 text-center text-white shadow-2xl">
                  <div className="space-y-3 sm:space-y-6">
                    <div className="text-5xl sm:text-6xl md:text-7xl animate-bounce">⚡</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {showCriticalStrike ? '💥 KATA CRITIQUE !' : '🎯 Kata réussi !'}
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl text-white">
                      Progression: <span className="font-bold text-yellow-300">{correctAnswers}/10</span>
                    </div>
                    {correctAnswers < 10 && (
                      <div className="text-base sm:text-lg text-green-200">
                        Plus que {10 - correctAnswers} bonnes réponses !
                      </div>
                    )}
                    {showCriticalStrike && (
                      <div className="text-base sm:text-lg md:text-xl text-yellow-300 font-bold animate-pulse">
                        ⭐ COMBO NINJA + VITESSE ⭐
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Résultat de kata manqué */}
              {duelPhase === 'result' && showCorrectAnswer && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-100 border-4 border-red-500 rounded-xl p-4 sm:p-6 text-gray-800">
                  <div className="space-y-3 sm:space-y-6">
                    <div className="text-5xl sm:text-6xl md:text-7xl animate-pulse">💥</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
                      Kata manqué !
                  </div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">🥷 La bonne réponse était :</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-600 animate-pulse">
                      {currentKata?.answer}
                    </div>
                    <div className="text-base sm:text-lg mt-4 text-gray-600">
                      {currentKata?.explanation}
                    </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Contre-attaque du maître */}
            {duelPhase === 'counter-attack' && isUnderAttack && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-red-600 to-orange-700 rounded-2xl p-4 sm:p-8 text-center text-white shadow-2xl">
                  <div className="space-y-3 sm:space-y-6">
                    <div className="text-5xl sm:text-6xl md:text-7xl animate-pulse">💥</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold">Contre-Attaque du Maître !</div>
                    <div className="text-lg sm:text-xl md:text-2xl">
                      Dégâts subis: <span className="font-bold text-yellow-300">{damageReceived}</span>
                  </div>
                  </div>
                  </div>
                </div>
              )}

            {/* Victoire */}
              {duelPhase === 'victory' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 sm:p-8 text-center shadow-2xl text-white">
                  <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4">🏆</div>
                  <div className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">VICTOIRE NINJA !</div>
                  <div className="text-lg sm:text-xl mb-4 sm:mb-6">Tu as vaincu {ninjaDojos[currentDojo - 1]?.boss.name} !</div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={resetToDojoSelect}
                      className="bg-yellow-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🏯 Nouveau Dojo
                    </button>
                    <button
                      onClick={resetDojo}
                      className="bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🏠 Retour Dojo
                    </button>
                  </div>
                  </div>
                </div>
              )}

            {/* Défaite */}
              {duelPhase === 'defeat' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-red-600 to-purple-700 rounded-xl p-4 sm:p-8 text-center shadow-2xl text-white">
                  <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4">💀</div>
                  <div className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Défaite...</div>
                  <div className="text-lg sm:text-xl mb-4 sm:mb-6">Ton énergie s'épuise, mais tu peux recommencer !</div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={() => startNinjaMission(currentDojo)}
                      className="bg-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-red-400 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🔄 Recommencer
                    </button>
                    <button
                      onClick={resetDojo}
                      className="bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🏠 Retour Dojo
                    </button>
                  </div>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Mode duel 2 ninjas */}
        {gameMode === 'duel-2players' && (
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Tableau de scores */}
            <div className="bg-purple-800 rounded-xl p-4 sm:p-6 shadow-xl">
              <h3 className="text-lg sm:text-2xl font-bold text-center mb-4">🥷 Duel de Ninjas 🥷</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-4 bg-blue-700 rounded-lg">
                  <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🥷</div>
                  <div className="text-sm sm:text-base font-bold">Ninja 1</div>
                  <div className="text-lg sm:text-2xl font-bold">{player1Score}</div>
                  <div className="text-xs sm:text-sm">Victoires: {player1Wins}</div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-purple-700 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold">Questions</div>
                  <div className="text-2xl sm:text-3xl font-bold">{questionsLeft}</div>
                  <div className="text-xs sm:text-sm">restantes</div>
                  </div>
                <div className="text-center p-2 sm:p-4 bg-green-700 rounded-lg">
                  <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🥷</div>
                  <div className="text-sm sm:text-base font-bold">Ninja 2</div>
                  <div className="text-lg sm:text-2xl font-bold">{player2Score}</div>
                  <div className="text-xs sm:text-sm">Victoires: {player2Wins}</div>
                </div>
                </div>
              </div>

            {/* Interface de question */}
            <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-2xl p-4 sm:p-8 text-center shadow-2xl border-4 border-indigo-500">
              <div className="space-y-4 sm:space-y-6">
                <div className="text-sm sm:text-lg font-bold text-indigo-200">
                  Au tour de {currentPlayer === 1 ? 'Ninja 1' : 'Ninja 2'} !
            </div>

                {duelTimer > 0 && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold flex items-center">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 mr-2">⏰</div>
                      <span className="text-2xl sm:text-3xl">{duelTimer}s</span>
                    </div>
                  </div>
                )}

                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white animate-pulse">
                    {currentKata?.question} = ?
                  </div>
                  
                  <input
                  ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-center text-2xl sm:text-3xl font-bold border-4 border-gray-800 rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-xl min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={handleDuelAnswer}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:scale-105 transition-all text-lg sm:text-xl shadow-xl min-h-[56px] touch-manipulation"
                    >
                    <span className="hidden sm:inline">⚡ KATA NINJA !</span>
                    <span className="sm:hidden">⚡ KATA !</span>
                    </button>
                    <button
                    onClick={resetDojo}
                    className="bg-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-xl"
                  >
                    🏠 Retour
                    </button>
                  </div>
                </div>
              </div>

            {/* Correction en cas d'erreur dans le duel */}
            {gameMode === 'duel-2players' && showDuelCorrection && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-100 border-4 border-red-500 rounded-xl p-4 sm:p-6 text-gray-800">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-5xl sm:text-6xl animate-pulse text-center">💥</div>
                    <div className="text-2xl sm:text-3xl font-bold text-red-600 text-center">
                      Kata manqué !
                    </div>
                    <div className="text-lg sm:text-xl font-bold mb-2 text-center">🥷 La bonne réponse était :</div>
                    <div className="text-4xl sm:text-5xl font-bold text-red-600 animate-pulse text-center">
                      {currentKata?.answer}
                  </div>
                    {currentKata?.explanation && (
                      <div className="text-base sm:text-lg mt-4 text-gray-600 text-center">
                        {currentKata.explanation}
              </div>
            )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 