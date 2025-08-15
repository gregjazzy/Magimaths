'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Sword, Shield, Star, Trophy, Zap, Heart, Timer, Crown, Target, Volume2, Sparkles } from 'lucide-react';

export default function DoublesEtMoities() {
  // États de l'académie magique
  const [gameMode, setGameMode] = useState<'academy' | 'training' | 'mission' | 'tower-select' | 'duel-2players'>('academy');
  const [currentTower, setCurrentTower] = useState(1);
  const [playerMana, setPlayerMana] = useState(100);
  const [sorcererMana, setSorcererMana] = useState(100);
  const [crystals, setCrystals] = useState(0);
  const [magicPoints, setMagicPoints] = useState(0);
  const [wizardRank, setWizardRank] = useState('Apprenti Sorcier');
  
  // États du duel magique
  const [currentSpell, setCurrentSpell] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(12);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [duelPhase, setDuelPhase] = useState<'spell' | 'result' | 'counter-spell' | 'victory' | 'defeat'>('spell');
  const [spellCombo, setSpellCombo] = useState(0);
  const [maxSpellCombo, setMaxSpellCombo] = useState(0);
  const [spellsCast, setSpellsCast] = useState(0);
  const [successfulSpells, setSuccessfulSpells] = useState(0);
  
  // États des animations magiques
  const [isCastingSpell, setIsCastingSpell] = useState(false);
  const [isUnderAttack, setIsUnderAttack] = useState(false);
  const [damageDealt, setDamageDealt] = useState(0);
  const [damageReceived, setDamageReceived] = useState(0);
  const [showCriticalSpell, setShowCriticalSpell] = useState(false);
  const [showMagicStorm, setShowMagicStorm] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  // Audio et effets magiques
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // États pour le mode duel magique
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [magicDuelPhase, setMagicDuelPhase] = useState<'question' | 'result' | 'final'>('question');
  const [showDuelCorrection, setShowDuelCorrection] = useState(false);
  const [showTrainingCorrection, setShowTrainingCorrection] = useState(false);

  // États pour la présentation interactive
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [presentationStep, setPresentationStep] = useState(0);

  // Configuration des tours magiques (niveaux)
  const magicTowers = [
    {
      id: 1,
      name: "Tour des Apprentis",
      description: "Doubles et moitiés - Niveau Facile",
      difficulty: "🔮 Novice",
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-100 to-teal-200",
      icon: "🏰",
      timeLimit: 15,
      spellsToWin: 12,
      boss: {
        name: "Papa Sorcier",
        avatar: "🧙‍♂️",
        mana: 80,
        spells: ["Sort de Patience", "Bénédiction Paternelle", "Encouragement Magique"],
        phrases: [
          "Concentre-toi, jeune apprenti !",
          "La magie demande de la patience !",
          "Tu y es presque, continue !"
        ]
      }
    },
    {
      id: 2,
      name: "Tour des Mystères",
      description: "Doubles et moitiés - Niveau Difficile",
      difficulty: "✨ Adepte",
      color: "from-purple-400 to-indigo-500",
      bgColor: "from-purple-100 to-indigo-200",
      icon: "🔮",
      timeLimit: 12,
      spellsToWin: 15,
      boss: {
        name: "Maman Enchanteresse",
        avatar: "🧙‍♀️",
        mana: 120,
        spells: ["Rayon Mystique", "Contrôle Mental", "Discipline Magique"],
        phrases: [
          "Tes calculs doivent être parfaits !",
          "La magie ne tolère aucune erreur !",
          "Montre-moi ta vraie puissance !"
        ]
      }
    }
  ];

  // Générateur de sorts doubles et moitiés
  const generateSpell = () => {
    const tower = magicTowers[currentTower - 1];
    
    // Types de calculs : doubles ou moitiés
    const spellType = Math.random() < 0.5 ? 'double' : 'moitie';
    
    if (spellType === 'double') {
      // Doubles : de 1 à 10 pour le niveau facile, de 1 à 20 pour le difficile
      const maxNum = currentTower === 1 ? 10 : 20;
      const number = Math.floor(Math.random() * maxNum) + 1;
      const answer = number * 2;
      
      return {
        question: `Le double de ${number} = ?`,
        answer: answer,
        number: number,
        type: 'double',
        difficulty: tower.difficulty,
        explanation: `Le double de ${number} = ${number} × 2 = ${answer}`
      };
    } else {
      // Moitiés : nombres pairs seulement
      const maxNum = currentTower === 1 ? 20 : 40;
      const evenNumbers = [];
      for (let i = 2; i <= maxNum; i += 2) {
        evenNumbers.push(i);
      }
      const number = evenNumbers[Math.floor(Math.random() * evenNumbers.length)];
      const answer = number / 2;
      
      return {
        question: `La moitié de ${number} = ?`,
        answer: answer,
        number: number,
        type: 'moitie',
        difficulty: tower.difficulty,
        explanation: `La moitié de ${number} = ${number} ÷ 2 = ${answer}`
      };
    }
  };

  // Fonction audio magique
  const speak = (text: string, type: 'normal' | 'victory' | 'magic' | 'defeat' = 'normal') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    
    switch (type) {
      case 'victory':
        utterance.rate = 1.1;
        utterance.pitch = 1.3;
        break;
      case 'magic':
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        break;
      case 'defeat':
        utterance.rate = 0.7;
        utterance.pitch = 0.8;
        break;
      default:
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
    }
    
    utterance.onstart = () => setIsPlayingVocal(true);
    utterance.onend = () => setIsPlayingVocal(false);
    
    audioRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Compte à rebours magique
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (duelPhase === 'spell') {
        handleSpellTimeout();
      } else if (gameMode === 'duel-2players' && magicDuelPhase === 'question') {
        // Timeout en mode duel
        setIsTimerRunning(false);
        setShowDuelCorrection(true);
        setMagicDuelPhase('result');
        speak(`Temps écoulé pour le Mage ${currentPlayer} ! La réponse était ${currentSpell?.answer}`, 'normal');
        setTimeout(() => {
          setShowDuelCorrection(false);
          const newQuestionsLeft = questionsLeft - 1;
          setQuestionsLeft(newQuestionsLeft);
          
          if (newQuestionsLeft === 0) {
            finishDuel();
          } else {
            const nextPlayer = currentPlayer === 1 ? 2 : 1;
            setCurrentPlayer(nextPlayer);
            setCurrentSpell(generateDuelSpell());
            setUserAnswer('');
            setTimeLeft(10);
            setMagicDuelPhase('question');
            
            speak(`Au tour du Mage ${nextPlayer} !`, 'normal');
            setTimeout(() => {
              setIsTimerRunning(true);
            }, 1500);
          }
        }, 3000);
      }
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerRunning, duelPhase, gameMode, magicDuelPhase]);

  // Démarrer une mission magique
  const startMagicMission = (towerId: number) => {
    setCurrentTower(towerId);
    setGameMode('mission');
    setPlayerMana(100);
    setSorcererMana(magicTowers[towerId - 1].boss.mana);
    setSpellCombo(0);
    setSpellsCast(0);
    setSuccessfulSpells(0);
    setDuelPhase('spell');
    setCurrentSpell(generateSpell());
    setTimeLeft(magicTowers[towerId - 1].timeLimit);
    setIsTimerRunning(false);
    
    const tower = magicTowers[towerId - 1];
    
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Mission dans la ${tower.name} ! Tu vas affronter ${tower.boss.name}. ${tower.boss.phrases[0]} La mission magique commence maintenant !`);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsPlayingVocal(true);
      utterance.onend = () => {
        setIsPlayingVocal(false);
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 500);
      };
      
      audioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsTimerRunning(true);
      }, 2000);
    }
  };

  // Lancer un sort (répondre)
  const castSpell = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setSpellsCast(prev => prev + 1);
    
    if (answer === currentSpell.answer) {
      handleSuccessfulSpell();
    } else {
      handleMissedSpell();
    }
  };

  const handleSuccessfulSpell = () => {
    setIsCastingSpell(true);
    setSuccessfulSpells(prev => prev + 1);
    
    // Calcul des dégâts magiques avec bonus
    const baseDamage = 22;
    const speedBonus = timeLeft > Math.floor(magicTowers[currentTower - 1].timeLimit * 0.7) ? 18 : 0;
    const comboBonus = spellCombo * 6;
    const damage = baseDamage + speedBonus + comboBonus;
    
    const isCriticalSpell = speedBonus > 0 || spellCombo > 2;
    
    setDamageDealt(damage);
    setShowCriticalSpell(isCriticalSpell);
    setSorcererMana(Math.max(0, sorcererMana - damage));
    setSpellCombo(spellCombo + 1);
    setMaxSpellCombo(Math.max(maxSpellCombo, spellCombo + 1));
    setCrystals(crystals + (isCriticalSpell ? 30 : 18));
    setMagicPoints(magicPoints + (isCriticalSpell ? 15 : 10));
    
    setDuelPhase('result');
    speak(isCriticalSpell ? 'SORT CRITIQUE ! Magie dévastatrice !' : 'Excellent sort ! Tu touches ta cible !', 'victory');
    
    setTimeout(() => {
      setIsCastingSpell(false);
      setShowCriticalSpell(false);
      
      if (sorcererMana - damage <= 0) {
        handleVictory();
      } else if (spellsCast >= magicTowers[currentTower - 1].spellsToWin) {
        if (successfulSpells / spellsCast >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        setCurrentSpell(generateSpell());
        setUserAnswer('');
        setTimeLeft(magicTowers[currentTower - 1].timeLimit);
        setDuelPhase('spell');
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleMissedSpell = () => {
    setSpellCombo(0);
    setShowCorrectAnswer(true);
    setDuelPhase('result');
    speak(`Sort manqué ! La bonne réponse était ${currentSpell.answer}. ${currentSpell.explanation}`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleSorcererCounterSpell();
    }, 3500);
  };

  const handleSpellTimeout = () => {
    setSpellCombo(0);
    setShowCorrectAnswer(true);
    setDuelPhase('result');
    speak(`Trop lent ! La réponse était ${currentSpell.answer}. Le sorcier en profite pour contre-attaquer !`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleSorcererCounterSpell();
    }, 3500);
  };

  const handleSorcererCounterSpell = () => {
    setIsUnderAttack(true);
    setDuelPhase('counter-spell');
    
    const tower = magicTowers[currentTower - 1];
    const damage = Math.floor(Math.random() * 35) + 25;
    setDamageReceived(damage);
    setPlayerMana(Math.max(0, playerMana - damage));
    
    const spell = tower.boss.spells[Math.floor(Math.random() * tower.boss.spells.length)];
    speak(`${tower.boss.name} utilise ${spell} !`, 'magic');
    
    setTimeout(() => {
      setIsUnderAttack(false);
      
      if (playerMana - damage <= 0) {
        handleDefeat();
      } else if (spellsCast >= tower.spellsToWin) {
        if (successfulSpells / spellsCast >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        setCurrentSpell(generateSpell());
        setUserAnswer('');
        setTimeLeft(tower.timeLimit);
        setDuelPhase('spell');
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleVictory = () => {
    setDuelPhase('victory');
    setShowMagicStorm(true);
    const bonusCrystals = 250 + (spellCombo * 25);
    const bonusPoints = 120 + (successfulSpells * 12);
    setCrystals(crystals + bonusCrystals);
    setMagicPoints(magicPoints + bonusPoints);
    
    if (currentTower === 2) {
      setWizardRank('Maître Suprême');
    } else if (currentTower === 1) {
      setWizardRank('Sorcier Confirmé');
    }
    
    speak('DUEL REMPORTÉ ! Tu maîtrises parfaitement les doubles et moitiés ! Tes pouvoirs magiques sont impressionnants !', 'victory');
    
    setTimeout(() => setShowMagicStorm(false), 6000);
  };

  const handleDefeat = () => {
    setDuelPhase('defeat');
    speak('Ta magie s\'affaiblit... Mais un vrai sorcier ne renonce jamais ! Recharge ton mana et reviens !', 'defeat');
  };

  const resetAcademy = () => {
    setGameMode('academy');
    setPlayerMana(100);
    setSorcererMana(100);
    setSpellCombo(0);
    setUserAnswer('');
    setSpellsCast(0);
    setSuccessfulSpells(0);
  };

  const resetToTowerSelect = () => {
    setGameMode('tower-select');
    setPlayerMana(100);
    setSorcererMana(100);
    setSpellCombo(0);
    setUserAnswer('');
    setSpellsCast(0);
    setSuccessfulSpells(0);
  };

  // Mode duel 2 mages
  const startDuel2Players = () => {
    setGameMode('duel-2players');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setQuestionsLeft(10);
    setMagicDuelPhase('question');
    setShowDuelCorrection(false);
    setCurrentSpell(generateDuelSpell());
    setTimeLeft(10);
    setIsTimerRunning(false);
    
    speak('Duel Magique ! Deux mages vont s\'affronter dans l\'arène des doubles et moitiés !', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
  };

  const generateDuelSpell = () => {
    // Sorts adaptés pour le duel (niveau moyen)
    const spellType = Math.random() < 0.5 ? 'double' : 'moitie';
    
    if (spellType === 'double') {
      const number = Math.floor(Math.random() * 15) + 1; // 1-15
      const answer = number * 2;
      return {
        question: `Le double de ${number} = ?`,
        answer: answer,
        type: 'double'
      };
    } else {
      // Moitiés de nombres pairs jusqu'à 30
      const evenNumbers = [];
      for (let i = 2; i <= 30; i += 2) {
        evenNumbers.push(i);
      }
      const number = evenNumbers[Math.floor(Math.random() * evenNumbers.length)];
      const answer = number / 2;
      return {
        question: `La moitié de ${number} = ?`,
        answer: answer,
        type: 'moitie'
      };
    }
  };

  const handleDuelAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    
    if (answer === currentSpell.answer) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
        speak('Cristal magique pour le Mage 1 !', 'victory');
      } else {
        setPlayer2Score(prev => prev + 1);
        speak('Cristal magique pour le Mage 2 !', 'victory');
      }
    } else {
      setShowDuelCorrection(true);
      speak(`Sort manqué ! La réponse était ${currentSpell.answer}`, 'normal');
    }
    
    setMagicDuelPhase('result');
    setTimeout(() => {
      setShowDuelCorrection(false);
      const newQuestionsLeft = questionsLeft - 1;
      setQuestionsLeft(newQuestionsLeft);
      
      if (newQuestionsLeft === 0) {
        finishDuel();
      } else {
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setCurrentSpell(generateDuelSpell());
        setUserAnswer('');
        setTimeLeft(10);
        setMagicDuelPhase('question');
        
        speak(`Au tour du Mage ${nextPlayer} !`, 'normal');
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1500);
      }
    }, 3000);
  };

  const finishDuel = () => {
    setMagicDuelPhase('final');
    if (player1Score > player2Score) {
      setPlayer1Wins(prev => prev + 1);
      speak('Victoire du Mage 1 ! Duel magique remporté !', 'victory');
    } else if (player2Score > player1Score) {
      setPlayer2Wins(prev => prev + 1);
      speak('Victoire du Mage 2 ! Duel magique remporté !', 'victory');
    } else {
      speak('Match nul ! Vous partagez les cristaux !', 'normal');
    }
  };

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    
    setIsPlayingVocal(false);
    setShowPresentation(false);
    setCurrentHighlight('');
    setPresentationStep(0);
  };

  // Présentation interactive des modes magiques
  const startInteractivePresentation = () => {
    stopAllVocalsAndAnimations();
    stopSignalRef.current = false;
    setShowPresentation(true);
    setPresentationStep(0);
    setCurrentHighlight('');
    
    speak('Bienvenue dans l\'Académie Magique des Doubles et Moitiés ! Je vais te présenter les différents modes d\'entraînement !', 'normal');
    
    setTimeout(() => {
      presentModes();
    }, 4500);
  };

  const presentModes = async () => {
    const steps = [
      { highlight: 'training', text: 'Voici l\'Entraînement Libre ! Un environnement sécurisé pour t\'exercer aux doubles et moitiés !' },
      { highlight: 'boss', text: 'Voilà les Duels Magiques ! Combats Papa ou Maman sorcier !' },
      { highlight: 'duel', text: 'Et enfin le Duel des Mages ! Affrontez-vous à deux mages dans un combat de doubles et moitiés !' },
      { highlight: '', text: 'Alors jeune apprenti, quel mode magique choisirez-vous pour commencer ?' }
    ];

    for (let i = 0; i < steps.length; i++) {
      if (stopSignalRef.current) return;
      
      const step = steps[i];
      setCurrentHighlight(step.highlight);
      
      await playAudio(step.text);
      
      if (stopSignalRef.current) return;
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setShowPresentation(false);
    setCurrentHighlight('');
  };

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
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsPlayingVocal(true);
      utterance.onend = () => {
        setIsPlayingVocal(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsPlayingVocal(false);
        resolve();
      };
      
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
  };

  // Entraînement libre
  const startTraining = () => {
    setGameMode('training');
    setShowTrainingCorrection(false);
    setCurrentSpell(generateSpell());
    setUserAnswer('');
    speak('Mode Entraînement activé ! Prends ton temps pour maîtriser les doubles et moitiés !', 'normal');
  };

  const handleTrainingAnswer = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === currentSpell.answer) {
      speak('Parfait ! Excellent sort !', 'victory');
      setTimeout(() => {
        setCurrentSpell(generateSpell());
        setUserAnswer('');
      }, 1500);
    } else {
      setShowTrainingCorrection(true);
      speak(`Presque ! La bonne réponse était ${currentSpell.answer}. ${currentSpell.explanation}`, 'normal');
      setTimeout(() => {
        setShowTrainingCorrection(false);
        setCurrentSpell(generateSpell());
        setUserAnswer('');
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Particules magiques en arrière-plan */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header magique */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 bg-gradient-to-r from-purple-800 to-indigo-800 rounded-xl p-4 sm:p-6 shadow-2xl border border-purple-500 relative z-10">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-0">
            <Link 
              href="/cp" 
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-all duration-300 shadow-lg min-w-[44px] min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                <span className="hidden sm:inline">🔮 Académie Magique - Doubles et Moitiés</span>
                <span className="sm:hidden">🔮 Doubles & Moitiés</span>
              </h1>
            </div>
          </div>

          {/* Stats du mage */}
          <div className="flex items-center space-x-2 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-center text-xs sm:text-sm">
              <div className="font-bold text-xs sm:text-base">{wizardRank}</div>
              <div className="text-purple-200">Rang</div>
            </div>
            <div className="text-center text-xs sm:text-sm">
              <div className="font-bold text-xs sm:text-base">{crystals}</div>
              <div className="text-purple-200">Cristaux</div>
            </div>
            <div className="text-center text-xs sm:text-sm">
              <div className="font-bold text-xs sm:text-base">{magicPoints}</div>
              <div className="text-purple-200">Magie</div>
            </div>
            <div className="text-center text-xs sm:text-sm">
              <div className="font-bold text-xs sm:text-base">{maxSpellCombo}</div>
              <div className="text-purple-200">Combo</div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg px-2 sm:px-3 py-2 transition-all duration-300 shadow-lg min-w-[44px] min-h-[44px]"
            >
              <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${!soundEnabled ? 'opacity-50' : ''}`} />
            </button>
          </div>
        </div>

        {/* Académie principale */}
        {gameMode === 'academy' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 sm:space-y-8">
              <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                <span className="hidden sm:inline">🔮 Bienvenue dans l'Académie Magique !</span>
                <span className="sm:hidden">🔮 Académie Magique</span>
              </h2>
              <p className="text-sm sm:text-xl text-gray-300 mb-4 sm:mb-6 px-2 sm:px-0">
                <span className="hidden sm:inline">Choisis ton mode d'entraînement et maîtrise les doubles et moitiés !</span>
                <span className="sm:hidden">Choisis ton mode !</span>
              </p>
              
              {/* Bouton d'accueil interactif */}
              <div className="mb-8">
                <button
                  onClick={startInteractivePresentation}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse border-4 border-blue-300"
                >
                  🔮 Découvrir l'Académie Magique !
                </button>
              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Entraînement libre */}
              <div 
                onClick={startTraining}
                className={`bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-blue-400 group min-h-[120px] sm:min-h-[140px] ${
                  currentHighlight === 'training' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">🧙‍♂️</div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Entraînement</h3>
                  <p className="text-blue-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Mode libre !
                  </p>
                  <div className="flex justify-center space-x-1 text-xs sm:text-sm">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Sans limite</span>
                    <span className="sm:hidden">Libre</span>
                  </div>
                </div>
              </div>

              {/* Duels magiques */}
              <div 
                onClick={() => setGameMode('tower-select')}
                className={`bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-purple-400 group min-h-[120px] sm:min-h-[140px] ${
                  currentHighlight === 'boss' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-pulse">🏰</div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Duels Magiques</h3>
                  <p className="text-purple-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Combats sorciers !
                  </p>
                  <div className="flex justify-center space-x-1 text-xs sm:text-sm">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Épique</span>
                    <span className="sm:hidden">🔮</span>
                  </div>
                </div>
              </div>

              {/* Mode duel 2 mages */}
              <div 
                onClick={startDuel2Players}
                className={`bg-gradient-to-br from-green-600 to-teal-700 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-green-400 group min-h-[120px] sm:min-h-[140px] ${
                  currentHighlight === 'duel' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">🔮</div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Duel des Mages</h3>
                  <p className="text-green-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Famille magique !
                  </p>
                  <div className="flex justify-center space-x-1 text-xs sm:text-sm">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Versus</span>
                    <span className="sm:hidden">VS</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Protocoles magiques */}
            <div className="bg-gradient-to-r from-gray-800 to-blue-800 rounded-xl p-4 sm:p-6 border border-blue-400">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">🔮 Règles de Magie</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⚡</div>
                  <div className="font-bold text-xs sm:text-sm">Sort Rapide</div>
                  <div className="text-gray-300 text-xs hidden sm:block">Plus tu calcules vite, plus tes sorts sont puissants !</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🔥</div>
                  <div className="font-bold text-xs sm:text-sm">Combo Magique</div>
                  <div className="text-gray-300 text-xs hidden sm:block">Enchaîne les sorts pour plus de dégâts !</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">⭐</div>
                  <div className="font-bold text-xs sm:text-sm">Cristaux</div>
                  <div className="text-gray-300 text-xs hidden sm:block">Collecte cristaux et points magiques !</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🎖️</div>
                  <div className="font-bold text-xs sm:text-sm">Rangs</div>
                  <div className="text-gray-300 text-xs hidden sm:block">Monte en grade jusqu'à Maître Suprême !</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sélection des tours */}
        {gameMode === 'tower-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🏰 Choisis ta Tour Magique</h2>
              <p className="text-gray-300">Chaque tour cache un sorcier redoutable à vaincre !</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {magicTowers.map((tower) => (
                <div 
                  key={tower.id}
                  onClick={() => startMagicMission(tower.id)}
                  className={`bg-gradient-to-br ${tower.color} rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-white border-opacity-20 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]`}
                >
                  <div className="text-center text-white">
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">{tower.icon}</div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{tower.name}</h3>
                    <p className="text-white text-opacity-90 mb-2 sm:mb-3 text-sm hidden sm:block">{tower.description}</p>
                    <div className="text-sm font-bold mb-2 sm:mb-3">{tower.difficulty}</div>
                    
                    {/* Info du boss */}
                    <div className="bg-black bg-opacity-30 rounded-lg p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 hidden sm:block">
                      <div className="flex items-center justify-center space-x-2 mb-1 sm:mb-2">
                        <span className="text-2xl sm:text-3xl">{tower.boss.avatar}</span>
                        <span className="font-bold text-sm sm:text-base">{tower.boss.name}</span>
                      </div>
                      <div className="text-xs sm:text-sm space-y-1 sm:space-y-2">
                        <div>💙 Mana: {tower.boss.mana}</div>
                        <div>⏰ Temps: {tower.timeLimit}s</div>
                        <div>🎯 Sorts: {tower.spellsToWin}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('academy')}
                className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
              >
                🏠 Retour Académie
              </button>
            </div>
          </div>
        )}

        {/* Mode Entraînement */}
        {gameMode === 'training' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🧙‍♂️ Entraînement Libre</h2>
              <p className="text-gray-300">Prends ton temps pour maîtriser les doubles et moitiés !</p>
            </div>

            {currentSpell && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 sm:p-8 text-center shadow-2xl text-white">
                  <div className="text-lg mb-4">
                    🔮 Sort d'Entraînement
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-6 animate-pulse">
                    {currentSpell.question}
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrainingAnswer()}
                    className="text-center text-2xl sm:text-3xl font-bold border-2 border-white rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-lg min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={handleTrainingAnswer}
                      className="bg-white text-purple-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">🔮 Lancer le Sort</span>
                      <span className="sm:hidden">🔮 LANCER</span>
                    </button>
                    <button
                      onClick={() => setGameMode('academy')}
                      className="bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                    >
                      🏠 Retour
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Correction en cas d'erreur dans l'entraînement */}
            {gameMode === 'training' && showTrainingCorrection && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="bg-orange-100 border-4 border-orange-500 rounded-xl p-6 text-gray-800">
                  <div className="space-y-4">
                    <div className="text-6xl animate-pulse text-center">🔮</div>
                    <div className="text-3xl font-bold text-orange-600 text-center">
                      Presque !
                    </div>
                    <div className="text-xl font-bold mb-2 text-center">✨ La bonne réponse était :</div>
                    <div className="text-5xl font-bold text-orange-600 animate-pulse text-center">
                      {currentSpell?.answer}
                    </div>
                    {currentSpell?.explanation && (
                      <div className="text-lg mt-4 text-gray-600 text-center">
                        {currentSpell.explanation}
                      </div>
                    )}
                    <div className="text-base text-gray-600 text-center mt-4">
                      🎯 Continue à t'entraîner !
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode Mission */}
        {gameMode === 'mission' && (
          <div className="space-y-8">
            {/* Interface de combat simplifiée */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mana du joueur */}
              <div className="bg-gradient-to-br from-blue-700 to-cyan-800 rounded-xl p-6 text-white text-center">
                <div className="text-3xl mb-2">🧙‍♂️</div>
                <div className="text-xl font-bold mb-2">Votre Mana</div>
                <div className="w-full bg-blue-900 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${playerMana}%` }}
                  ></div>
                </div>
                <div className="text-lg font-bold">{playerMana}/100</div>
              </div>

              {/* Info du combat */}
              <div className="bg-gradient-to-br from-purple-700 to-pink-800 rounded-xl p-6 text-white text-center">
                <div className="text-2xl mb-2">⚔️</div>
                <div className="text-lg font-bold mb-2">Mission Magique</div>
                <div className="text-sm">Tour: {magicTowers[currentTower - 1]?.name}</div>
                <div className="text-sm">Combo: {spellCombo}</div>
                <div className="text-sm">Sorts: {spellsCast}/{magicTowers[currentTower - 1]?.spellsToWin}</div>
              </div>

              {/* Mana du sorcier */}
              <div className="bg-gradient-to-br from-red-700 to-orange-800 rounded-xl p-6 text-white text-center">
                <div className="text-3xl mb-2">{magicTowers[currentTower - 1]?.boss.avatar}</div>
                <div className="text-xl font-bold mb-2">{magicTowers[currentTower - 1]?.boss.name}</div>
                <div className="w-full bg-red-900 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-orange-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(sorcererMana / magicTowers[currentTower - 1]?.boss.mana) * 100}%` }}
                  ></div>
                </div>
                <div className="text-lg font-bold">{sorcererMana}/{magicTowers[currentTower - 1]?.boss.mana}</div>
              </div>
            </div>

            {/* Interface principale de sort */}
            {duelPhase === 'spell' && currentSpell && (
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
                        🔮 Sort de Navigation Magique
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white animate-pulse">
                        {currentSpell.question}
                      </div>
                    </div>
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && castSpell()}
                    className="text-center text-2xl sm:text-3xl md:text-4xl font-bold border-4 border-gray-800 rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 md:w-48 text-gray-800 bg-white shadow-xl min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-4 sm:mt-6">
                    <button
                      onClick={castSpell}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg font-bold hover:scale-105 transition-all text-lg sm:text-xl md:text-2xl shadow-xl min-h-[56px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">🌟 SORT ! MAGIE !</span>
                      <span className="sm:hidden">🔮 SORT !</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Résultat de sort réussi */}
            {duelPhase === 'result' && isCastingSpell && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-4 sm:p-8 text-center text-white shadow-2xl">
                  <div className="space-y-3 sm:space-y-6">
                    <div className="text-5xl sm:text-6xl md:text-7xl animate-bounce">⚡</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {showCriticalSpell ? '💥 SORT CRITIQUE !' : '🎯 Sort réussi !'}
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl text-white">
                      Dégâts magiques: <span className="font-bold text-yellow-300">{damageDealt}</span>
                    </div>
                    {showCriticalSpell && (
                      <div className="text-base sm:text-lg md:text-xl text-yellow-300 font-bold animate-pulse">
                        ⭐ COMBO MAGIQUE + VITESSE ⭐
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Résultat de sort manqué */}
            {duelPhase === 'result' && showCorrectAnswer && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-100 border-4 border-red-500 rounded-xl p-4 sm:p-6 text-gray-800">
                  <div className="space-y-3 sm:space-y-6">
                    <div className="text-5xl sm:text-6xl md:text-7xl animate-pulse">💥</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
                      Sort manqué !
                    </div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold mb-2">🔮 La bonne réponse était :</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-600 animate-pulse">
                      {currentSpell?.answer}
                    </div>
                    <div className="text-base sm:text-lg mt-4 text-gray-600">
                      {currentSpell?.explanation}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contre-attaque du sorcier */}
            {duelPhase === 'counter-spell' && isUnderAttack && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-red-600 to-orange-700 rounded-2xl p-4 sm:p-8 text-center text-white shadow-2xl">
                  <div className="space-y-3 sm:space-y-6">
                    <div className="text-5xl sm:text-6xl md:text-7xl animate-pulse">💥</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold">Contre-Sort du Sorcier !</div>
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
                  <div className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">VICTOIRE MAGIQUE !</div>
                  <div className="text-lg sm:text-xl mb-4 sm:mb-6">Tu as vaincu {magicTowers[currentTower - 1]?.boss.name} !</div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="text-base sm:text-lg font-bold mb-2">Récompenses</div>
                    <div className="text-sm sm:text-lg mb-2">✨ Cristaux gagnés: {250 + (spellCombo * 25)}</div>
                    <div className="text-sm sm:text-lg">🔮 Points magiques: {120 + (successfulSpells * 12)}</div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={resetToTowerSelect}
                      className="bg-yellow-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🏰 Nouvelle Tour
                    </button>
                    <button
                      onClick={resetAcademy}
                      className="bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🏠 Retour Académie
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
                  <div className="text-lg sm:text-xl mb-4 sm:mb-6">Ton mana s'épuise, mais tu peux recommencer !</div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={() => startMagicMission(currentTower)}
                      className="bg-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-red-400 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🔄 Recommencer
                    </button>
                    <button
                      onClick={resetAcademy}
                      className="bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl text-sm sm:text-base"
                    >
                      🏠 Retour Académie
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode duel 2 mages */}
        {gameMode === 'duel-2players' && (
          <div className="space-y-6">
            {/* Tableau de scores magiques */}
            <div className="bg-gradient-to-r from-green-800 to-teal-800 rounded-xl p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-4">🔮 Duel des Mages - Doubles et Moitiés</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className={`p-2 sm:p-4 rounded-lg ${currentPlayer === 1 ? 'bg-green-600 ring-4 ring-yellow-400' : 'bg-green-700'}`}>
                  <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🧙‍♂️</div>
                  <div className="font-bold text-sm sm:text-base">Mage 1</div>
                  <div className="text-lg sm:text-2xl font-bold">{player1Score}</div>
                  <div className="text-xs sm:text-sm">Victoires: {player1Wins}</div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm sm:text-lg font-bold">Sorts restants</div>
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{questionsLeft}</div>
                  </div>
                </div>
                
                <div className={`p-2 sm:p-4 rounded-lg ${currentPlayer === 2 ? 'bg-teal-600 ring-4 ring-yellow-400' : 'bg-teal-700'}`}>
                  <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🧙‍♀️</div>
                  <div className="font-bold text-sm sm:text-base">Mage 2</div>
                  <div className="text-lg sm:text-2xl font-bold">{player2Score}</div>
                  <div className="text-xs sm:text-sm">Victoires: {player2Wins}</div>
                </div>
              </div>
            </div>

            {magicDuelPhase === 'question' && (
              <div className="max-w-2xl mx-auto">
                <div className={`bg-gradient-to-br ${currentPlayer === 1 ? 'from-green-600 to-green-700' : 'from-teal-600 to-teal-700'} rounded-xl p-4 sm:p-8 text-center shadow-2xl text-white`}>
                  <div className="text-sm sm:text-lg mb-2">Au tour du Mage {currentPlayer}</div>
                  
                  <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-4">
                    <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    <div className={`text-2xl sm:text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-pulse">
                    {currentSpell?.question}
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleDuelAnswer()}
                    className="text-center text-2xl sm:text-3xl font-bold border-2 border-white rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-lg min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-4 sm:mt-6">
                    <button
                      onClick={handleDuelAnswer}
                      className="bg-white text-green-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">🌟 Lancer Sort !</span>
                      <span className="sm:hidden">🔮 LANCER</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Correction en cas d'erreur dans le duel */}
            {magicDuelPhase === 'result' && showDuelCorrection && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 text-gray-800">
                  <div className="space-y-4">
                    <div className="text-6xl animate-pulse text-center">💥</div>
                    <div className="text-3xl font-bold text-red-600 text-center">
                      Sort manqué !
                    </div>
                    <div className="text-xl font-bold mb-2 text-center">🔮 La bonne réponse était :</div>
                    <div className="text-5xl font-bold text-red-600 animate-pulse text-center">
                      {currentSpell?.answer}
                    </div>
                    {currentSpell?.explanation && (
                      <div className="text-lg mt-4 text-gray-600 text-center">
                        {currentSpell.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {magicDuelPhase === 'final' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🏆</div>
                  <div className="text-3xl font-bold mb-4">
                    {player1Score > player2Score ? 'Victoire du Mage 1 !' : 
                     player2Score > player1Score ? 'Victoire du Mage 2 !' : 'Match nul !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Résultats Final</div>
                    <div className="text-xl mb-2">Mage 1: {player1Score} sorts réussis</div>
                    <div className="text-xl">Mage 2: {player2Score} sorts réussis</div>
                  </div>

                  <div className="space-x-4">
                    <button
                      onClick={startDuel2Players}
                      className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-xl"
                    >
                      🔄 Nouveau Duel
                    </button>
                    <button
                      onClick={() => setGameMode('academy')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏠 Retour Académie
                    </button>
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