'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Sword, Shield, Star, Trophy, Zap, Heart, Timer, Crown, Target, Volume2, Sparkles } from 'lucide-react';

export default function DoublesEtMoities() {
  // États de l'académie magique
  const [gameMode, setGameMode] = useState<'academy' | 'training' | 'duel' | 'tower-select' | 'duel-2players' | 'time-challenge'>('academy');
  const [currentTower, setCurrentTower] = useState(1);
  const [playerMana, setPlayerMana] = useState(100);
  const [sorcererMana, setSorcererMana] = useState(100);
  const [crystals, setCrystals] = useState(0);
  const [magicPoints, setMagicPoints] = useState(0);
  const [wizardRank, setWizardRank] = useState('Apprenti Sorcier');
  
  // États du duel magique
  const [currentSpell, setCurrentSpell] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
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

  // États pour le défi temps magique
  const [timeScore, setTimeScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [challengeSpellsCast, setChallengeSpellsCast] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);

  // États pour la présentation interactive
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [presentationStep, setPresentationStep] = useState(0);

  // Configuration des tours magiques (niveaux)
  const magicTowers = [
    {
      id: 1,
      name: "Tour des Apprentis",
      description: "Premier trimestre CP - Doubles jusqu'à 10",
      difficulty: "🔮 Novice",
      color: "from-emerald-400 to-teal-500",
      bgColor: "from-emerald-100 to-teal-200",
      icon: "🏰",
      timeLimit: 15,
      maxNumber: 10,
      spellsToWin: 12,
      boss: {
        name: "Maître Papa l'Enchanteur",
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
      description: "Premier semestre CP - Doubles et moitiés jusqu'à 20",
      difficulty: "✨ Adepte",
      color: "from-purple-400 to-indigo-500",
      bgColor: "from-purple-100 to-indigo-200",
      icon: "🔮",
      timeLimit: 12,
      maxNumber: 20,
      spellsToWin: 15,
      boss: {
        name: "Sorcière Maman la Sage",
        avatar: "🧙‍♀️",
        mana: 120,
        spells: ["Regard Perçant", "Sort de Vérité", "Magie Maternelle"],
        phrases: [
          "Tu dois maîtriser ces sorts !",
          "La précision est la clé !",
          "Montre-moi ce que tu sais faire !"
        ]
      }
    },
    {
      id: 3,
      name: "Tour du Grand Mystère",
      description: "Fin d'année CP - Maître des doubles et moitiés",
      difficulty: "🌟 ARCHIMAGE",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-100 to-orange-200",
      icon: "✨",
      timeLimit: 8,
      maxNumber: 20,
      spellsToWin: 20,
      boss: {
        name: "Archimage Frère Suprême",
        avatar: "🧝‍♂️",
        mana: 150,
        spells: ["Éclair Mental", "Tempête Mathématique", "Sortilège Ultime"],
        phrases: [
          "Tes sorts ne peuvent rien contre moi !",
          "Je maîtrise la magie depuis des années !",
          "Tu es encore trop faible, petit frère !"
        ]
      }
    }
  ];

  // Générateur de sorts (questions doubles/moitiés)
  const generateSpell = () => {
    const tower = magicTowers[currentTower - 1];
    const spellType = Math.random() < 0.5 ? 'double' : 'moitie';
    let number, question, answer;
    
    if (spellType === 'double') {
      if (tower.id === 1) {
        // Tour facile : doubles jusqu'à 5 (résultat ≤ 10)
        number = Math.floor(Math.random() * 5) + 1; // 1-5
      } else {
        // Tours avancées : doubles jusqu'à 10 (résultat ≤ 20)
        number = Math.floor(Math.random() * 10) + 1; // 1-10
      }
      question = `Double de ${number}`;
      answer = number * 2;
    } else {
      // Moitiés - nombres pairs seulement
      if (tower.id === 1) {
        // Tour facile : moitiés jusqu'à 10
        const pairs = [2, 4, 6, 8, 10];
        number = pairs[Math.floor(Math.random() * pairs.length)];
      } else {
        // Tours avancées : moitiés jusqu'à 20
        const pairs = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        number = pairs[Math.floor(Math.random() * pairs.length)];
      }
      question = `Moitié de ${number}`;
      answer = number / 2;
    }
    
    return {
      question,
      answer,
      type: spellType,
      number,
      difficulty: tower.difficulty
    };
  };

  // Fonction audio magique
  const speak = (text: string, type: 'normal' | 'victory' | 'spell' | 'defeat' = 'normal') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    
    // Adaptation de la voix selon le type magique
    switch (type) {
      case 'victory':
        utterance.rate = 0.9;
        utterance.pitch = 1.5;
        break;
      case 'spell':
        utterance.rate = 1.0;
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

  // Timer magique avec effets
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
        speak(`Temps écoulé pour le Sorcier ${currentPlayer} !`, 'normal');
        setTimeout(() => {
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
            
            speak(`Au tour du Sorcier ${nextPlayer} !`, 'normal');
            setTimeout(() => {
              setIsTimerRunning(true);
            }, 1500);
          }
        }, 2000);
      } else if (gameMode === 'time-challenge' && challengeActive) {
        handleChallengeTimeout();
      }
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerRunning, duelPhase, gameMode, magicDuelPhase, challengeActive]);

  // Démarrer un duel magique
  const startMagicDuel = (towerId: number) => {
    setCurrentTower(towerId);
    setGameMode('duel');
    setPlayerMana(100);
    setSorcererMana(magicTowers[towerId - 1].boss.mana);
    setSpellCombo(0);
    setSpellsCast(0);
    setSuccessfulSpells(0);
    setDuelPhase('spell');
    setCurrentSpell(generateSpell());
    setTimeLeft(magicTowers[towerId - 1].timeLimit);
    setIsTimerRunning(false); // Le timer ne démarre pas tout de suite
    
    const tower = magicTowers[towerId - 1];
    
    // Créer l'utterance avec callback pour démarrer le timer après
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Bienvenue dans ${tower.name} ! Tu vas affronter ${tower.boss.name} en duel magique. ${tower.boss.phrases[0]} L'incantation commence maintenant !`);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsPlayingVocal(true);
      utterance.onend = () => {
        setIsPlayingVocal(false);
        // Démarrer le timer APRÈS les consignes
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 500); // Petit délai pour que l'élève soit prêt
      };
      
      audioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Si pas d'audio, démarrer quand même le timer après un délai
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
      handleFailedSpell();
    }
  };

  const handleSuccessfulSpell = () => {
    setIsCastingSpell(true);
    setSuccessfulSpells(prev => prev + 1);
    
    // Calcul des dégâts magiques avec bonus
    const baseDamage = 20;
    const speedBonus = timeLeft > Math.floor(magicTowers[currentTower - 1].timeLimit * 0.6) ? 15 : 0;
    const comboBonus = spellCombo * 5;
    const damage = baseDamage + speedBonus + comboBonus;
    
    const isCriticalSpell = speedBonus > 0 || spellCombo > 2;
    
    setDamageDealt(damage);
    setShowCriticalSpell(isCriticalSpell);
    setSorcererMana(Math.max(0, sorcererMana - damage));
    setSpellCombo(spellCombo + 1);
    setMaxSpellCombo(Math.max(maxSpellCombo, spellCombo + 1));
    setCrystals(crystals + (isCriticalSpell ? 25 : 15));
    setMagicPoints(magicPoints + (isCriticalSpell ? 12 : 8));
    
    setDuelPhase('result');
    speak(isCriticalSpell ? 'SORT CRITIQUE ! Magie extraordinaire !' : 'Excellent sort ! Bien joué, apprenti !', 'victory');
    
    setTimeout(() => {
      setIsCastingSpell(false);
      setShowCriticalSpell(false);
      
      if (sorcererMana - damage <= 0) {
        handleVictory();
      } else if (spellsCast >= magicTowers[currentTower - 1].spellsToWin) {
        // Duel terminé par nombre de sorts
        if (successfulSpells / spellsCast >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouveau sort (pas de contre-sort après un sort réussi)
        setCurrentSpell(generateSpell());
        setUserAnswer('');
        setTimeLeft(magicTowers[currentTower - 1].timeLimit);
        setDuelPhase('spell');
        // Petit délai pour que l'élève lise le nouveau sort
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleFailedSpell = () => {
    setSpellCombo(0);
    setShowCorrectAnswer(true);
    setDuelPhase('result');
    speak(`Sort raté ! La bonne réponse était ${currentSpell.answer}.`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleCounterSpell();
    }, 3500);
  };

  const handleSpellTimeout = () => {
    setSpellCombo(0);
    setShowCorrectAnswer(true);
    setDuelPhase('result');
    speak(`Trop lent à incanter ! La réponse était ${currentSpell.answer}. Le sorcier en profite pour lancer un contre-sort !`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleCounterSpell();
    }, 3500);
  };

  const handleCounterSpell = () => {
    setIsUnderAttack(true);
    setDuelPhase('counter-spell');
    
    const tower = magicTowers[currentTower - 1];
    const damage = Math.floor(Math.random() * 35) + 25;
    setDamageReceived(damage);
    setPlayerMana(Math.max(0, playerMana - damage));
    
    const spell = tower.boss.spells[Math.floor(Math.random() * tower.boss.spells.length)];
    speak(`${tower.boss.name} lance ${spell} !`, 'spell');
    
    setTimeout(() => {
      setIsUnderAttack(false);
      
      if (playerMana - damage <= 0) {
        handleDefeat();
      } else if (spellsCast >= tower.spellsToWin) {
        // Duel terminé par nombre de sorts
        if (successfulSpells / spellsCast >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouveau sort
        setCurrentSpell(generateSpell());
        setUserAnswer('');
        setTimeLeft(tower.timeLimit);
        setDuelPhase('spell');
        // Petit délai pour que l'élève lise le nouveau sort
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleVictory = () => {
    setDuelPhase('victory');
    setShowMagicStorm(true);
    const bonusCrystals = 200 + (spellCombo * 20);
    const bonusMagicPoints = 100 + (successfulSpells * 10);
    setCrystals(crystals + bonusCrystals);
    setMagicPoints(magicPoints + bonusMagicPoints);
    
    // Mise à jour du rang magique
    if (currentTower === 3) {
      setWizardRank('Archimage Légendaire');
    } else if (currentTower === 2) {
      setWizardRank('Maître Sorcier');
    }
    
    speak('VICTOIRE MAGIQUE ! Tu as maîtrisé les sorts de doubles et moitiés ! Ta magie est puissante !', 'victory');
    
    setTimeout(() => setShowMagicStorm(false), 6000);
  };

  const handleDefeat = () => {
    setDuelPhase('defeat');
    speak('Ta magie n\'était pas assez forte... Retourne étudier tes sorts et reviens plus puissant !', 'defeat');
  };

  const resetAcademy = () => {
    setGameMode('academy');
    setPlayerMana(100);
    setSorcererMana(100);
    setSpellCombo(0);
    setUserAnswer('');
    setIsTimerRunning(false);
    setSpellsCast(0);
    setSuccessfulSpells(0);
  };

  // Charger le meilleur score au démarrage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore-doubles-moities');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Mode duel 2 sorciers
  const startDuel2Players = () => {
    setGameMode('duel-2players');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setQuestionsLeft(10);
    setMagicDuelPhase('question');
    setCurrentSpell(generateDuelSpell());
    setTimeLeft(10);
    setIsTimerRunning(false);
    
    speak('Duel de sorciers ! Sorcier 1 contre Sorcier 2. Que le plus puissant gagne ! Sorcier 1, lance ton sort !', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
  };

  const generateDuelSpell = () => {
    // Sorts adaptés pour le duel (niveau moyen)
    const spellType = Math.random() < 0.5 ? 'double' : 'moitie';
    let num, answer;
    
    if (spellType === 'double') {
      num = Math.floor(Math.random() * 10) + 1; // 1-10
      answer = num * 2;
      return {
        question: `Double de ${num}`,
        answer,
        type: 'double',
        num
      };
    } else {
      const pairs = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      num = pairs[Math.floor(Math.random() * pairs.length)];
      answer = num / 2;
      return {
        question: `Moitié de ${num}`,
        answer,
        type: 'moitie',
        num
      };
    }
  };

  const handleDuelAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    
    if (answer === currentSpell.answer) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
        speak('Cristal pour le Sorcier 1 !', 'victory');
      } else {
        setPlayer2Score(prev => prev + 1);
        speak('Cristal pour le Sorcier 2 !', 'victory');
      }
    } else {
      speak(`Sort raté ! C'était ${currentSpell.answer}`, 'normal');
    }
    
    setMagicDuelPhase('result');
    setTimeout(() => {
      const newQuestionsLeft = questionsLeft - 1;
      setQuestionsLeft(newQuestionsLeft);
      
      if (newQuestionsLeft === 0) {
        finishDuel();
      } else {
        // Changer de sorcier
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setCurrentSpell(generateDuelSpell());
        setUserAnswer('');
        setTimeLeft(10);
        setMagicDuelPhase('question');
        
        speak(`Au tour du Sorcier ${nextPlayer} !`, 'normal');
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1500);
      }
    }, 2000);
  };

  const finishDuel = () => {
    setMagicDuelPhase('final');
    if (player1Score > player2Score) {
      setPlayer1Wins(prev => prev + 1);
      speak('Victoire du Sorcier 1 ! Magie incroyable !', 'victory');
    } else if (player2Score > player1Score) {
      setPlayer2Wins(prev => prev + 1);
      speak('Victoire du Sorcier 2 ! Sort légendaire !', 'victory');
    } else {
      speak('Match nul ! Vous partagez les cristaux !', 'normal');
    }
  };

  // Mode défi temps magique
  const startTimeChallenge = () => {
    setGameMode('time-challenge');
    setTimeScore(0);
    setDifficultyLevel(1);
    setTimePerQuestion(15);
    setChallengeSpellsCast(0);
    setChallengeActive(true);
    setCurrentSpell(generateChallengeSpell(1));
    setTimeLeft(15);
    setIsTimerRunning(false);
    
    speak('Défi de la Tour Infinie ! Les sorts vont devenir de plus en plus complexes. Prêt apprenti ?', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 3000);
  };

  const generateChallengeSpell = (level: number) => {
    const spellType = Math.random() < 0.5 ? 'double' : 'moitie';
    let num, answer;
    
    if (spellType === 'double') {
      if (level <= 3) {
        num = Math.floor(Math.random() * 5) + 1; // 1-5
      } else if (level <= 6) {
        num = Math.floor(Math.random() * 8) + 1; // 1-8
      } else if (level <= 10) {
        num = Math.floor(Math.random() * 10) + 1; // 1-10
      } else {
        num = Math.floor(Math.random() * 15) + 1; // 1-15
      }
      answer = num * 2;
      return {
        question: `Double de ${num}`,
        answer,
        type: 'double',
        num,
        level
      };
    } else {
      let pairs;
      if (level <= 3) {
        pairs = [2, 4, 6, 8, 10];
      } else if (level <= 6) {
        pairs = [2, 4, 6, 8, 10, 12, 14, 16];
      } else if (level <= 10) {
        pairs = [4, 6, 8, 10, 12, 14, 16, 18, 20];
      } else {
        pairs = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
      }
      num = pairs[Math.floor(Math.random() * pairs.length)];
      answer = num / 2;
      return {
        question: `Moitié de ${num}`,
        answer,
        type: 'moitie',
        num,
        level
      };
    }
  };

  const handleChallengeAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setChallengeSpellsCast(prev => prev + 1);
    
    if (answer === currentSpell.answer) {
      // Calculer le score basé sur rapidité et difficulté
      const timeBonus = Math.max(0, timeLeft * 10);
      const difficultyBonus = difficultyLevel * 50;
      const points = 100 + timeBonus + difficultyBonus;
      
      setTimeScore(prev => prev + points);
      speak('Sort réussi ! Cristaux gagnés !', 'victory');
      
      // Augmenter la difficulté et réduire le temps
      const newLevel = difficultyLevel + 1;
      setDifficultyLevel(newLevel);
      const newTimeLimit = Math.max(5, 15 - Math.floor(newLevel / 2));
      setTimePerQuestion(newTimeLimit);
      
      setTimeout(() => {
        setCurrentSpell(generateChallengeSpell(newLevel));
        setUserAnswer('');
        setTimeLeft(newTimeLimit);
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }, 1500);
      
    } else {
      // Fin du défi
      finishChallenge();
    }
  };

  const handleChallengeTimeout = () => {
    finishChallenge();
  };

  const finishChallenge = () => {
    setChallengeActive(false);
    setIsTimerRunning(false);
    
    // Vérifier si c'est un nouveau record
    if (timeScore > bestScore) {
      setBestScore(timeScore);
      localStorage.setItem('bestScore-doubles-moities', timeScore.toString());
      speak(`Nouveau record magique ! ${timeScore} cristaux ! Tu es un grand sorcier !`, 'victory');
    } else {
      speak(`Défi terminé ! Score: ${timeScore} cristaux. Record à battre: ${bestScore}`, 'normal');
    }
  };

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() appelé');
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
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
    
    speak('Salutations, jeune apprenti ! Bienvenue à l\'Académie de Magie ! Laisse-moi te présenter les voies magiques disponibles !', 'normal');
    
    setTimeout(() => {
      presentModes();
    }, 5000);
  };

  const presentModes = async () => {
    const steps = [
      { highlight: 'training', text: 'Voici la Salle d\'Étude ! Un lieu paisible pour pratiquer tes sorts sans danger !' },
      { highlight: 'boss', text: 'Voilà les Tours Magiques ! Défie les grands sorciers Papa, Maman, ou ton Frère dans des duels épiques !' },
      { highlight: 'duel', text: 'Puis le Duel de Sorciers ! Affrontez-vous à deux dans un combat magique à 10 sorts !' },
      { highlight: 'challenge', text: 'Et enfin, la Tour Infinie ! Un défi sans fin avec des sorts de plus en plus puissants !' },
      { highlight: '', text: 'Alors jeune mage, quelle voie magique choisiras-tu pour débuter ton apprentissage ?' }
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
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = speechSynthesis.getVoices();
      console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
      
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
        console.log('Voix sélectionnée:', bestFrenchVoice.name, '(', bestFrenchVoice.lang, ')');
      } else {
        console.warn('Aucune voix française trouvée, utilisation voix par défaut');
      }
      
      currentAudioRef.current = utterance;
      
      utterance.onstart = () => {
        console.log('Audio démarré:', text);
      };
      
      utterance.onend = () => {
        console.log('Audio terminé:', text);
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

  // Mode entraînement magique
  const startTraining = () => {
    setGameMode('training');
    setCurrentSpell(generateSpell());
    speak('Entraînement magique ! Pratique tes sorts sans risque dans la salle d\'étude !');
  };

  const handleTrainingSpell = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === currentSpell.answer) {
      speak('Sort parfait ! Tu maîtrises bien cette magie !', 'victory');
      setCrystals(crystals + 10);
      setMagicPoints(magicPoints + 5);
      setSuccessfulSpells(prev => prev + 1);
    } else {
      speak(`Sort raté ! C'était ${currentSpell.answer}. Continue à pratiquer !`, 'normal');
    }
    
    setSpellsCast(prev => prev + 1);
    
    // Nouveau sort après un délai
    setTimeout(() => {
      setCurrentSpell(generateSpell());
      setUserAnswer('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Particules magiques flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: '0 0 6px #fbbf24'
            }}
          />
        ))}
      </div>

      {/* Tempête magique pour la victoire */}
      {showMagicStorm && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-spin"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            >
              {['✨', '🔮', '⭐', '💫'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      {/* En-tête magique */}
      <div className="bg-black bg-opacity-60 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/chapitre/cp-calcul-mental"
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour à l'académie
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  🔮 L'École de Magie des Nombres
                </h1>
                <p className="text-gray-300">Maîtrise les sorts de doubles et moitiés !</p>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-purple-600' : 'bg-gray-600'}`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Hall principal de l'académie */}
        {gameMode === 'academy' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                🏰 Bienvenue, Jeune Apprenti !
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Choisis ta voie dans l'art magique des doubles et moitiés !
              </p>
              
              {/* Bouton d'accueil interactif */}
              <div className="mb-8">
                <button
                  onClick={startInteractivePresentation}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse border-4 border-purple-300"
                >
                  ✨ Découvrir les Voies Magiques !
                </button>
              </div>
              
              {/* Profil du Sorcier */}
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 mb-8 border-2 border-purple-400 shadow-2xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-purple-400 mb-2">🔮 Profil du Sorcier</h3>
                  <div className="text-lg text-white font-medium">Rang: {wizardRank}</div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Cristaux */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-yellow-500">
                    <div className="text-2xl mb-2">💎</div>
                    <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Cristaux</div>
                    <div className="text-white text-xl font-bold">{crystals}</div>
                  </div>
                  
                  {/* Points Magiques */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-blue-400">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-blue-400 text-sm font-bold uppercase tracking-wider">Points Magiques</div>
                    <div className="text-white text-xl font-bold">{magicPoints}</div>
                  </div>
                  
                  {/* Combo */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-pink-400">
                    <div className="text-2xl mb-2">✨</div>
                    <div className="text-pink-400 text-sm font-bold uppercase tracking-wider">Meilleur Combo</div>
                    <div className="text-white text-xl font-bold">{maxSpellCombo}</div>
                    <div className="text-pink-300 text-xs">Sorts enchaînés</div>
                  </div>
                  
                  {/* Magie Active */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-purple-400">
                    <div className="text-2xl mb-2">🌟</div>
                    <div className="text-purple-400 text-sm font-bold uppercase tracking-wider">Magie Active</div>
                    <div className="text-white text-xl font-bold">{spellCombo}</div>
                    <div className="text-purple-300 text-xs">Série actuelle</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Salle d'entraînement */}
              <div 
                onClick={startTraining}
                className={`bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-emerald-400 group ${
                  currentHighlight === 'training' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">📚</div>
                  <h3 className="text-xl font-bold mb-2">Salle d'Étude</h3>
                  <p className="text-emerald-100 mb-3 text-sm">
                    Environnement sûr !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Sans danger</span>
                  </div>
                </div>
              </div>

              {/* Tours des défis magiques */}
              <div 
                onClick={() => setGameMode('tower-select')}
                className={`bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-purple-400 group ${
                  currentHighlight === 'boss' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-pulse">🏰</div>
                  <h3 className="text-xl font-bold mb-2">Tours Magiques</h3>
                  <p className="text-purple-100 mb-3 text-sm">
                    Grands sorciers !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Crown className="w-4 h-4" />
                    <span>Épique</span>
                  </div>
                </div>
              </div>

              {/* Mode duel 2 sorciers */}
              <div 
                onClick={startDuel2Players}
                className={`bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-blue-400 group ${
                  currentHighlight === 'duel' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">🔮</div>
                  <h3 className="text-xl font-bold mb-2">Duel Sorciers</h3>
                  <p className="text-blue-100 mb-3 text-sm">
                    Magie familiale !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Crown className="w-4 h-4" />
                    <span>Versus</span>
                  </div>
                </div>
              </div>

              {/* Mode défi temps */}
              <div 
                onClick={startTimeChallenge}
                className={`bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-yellow-400 group ${
                  currentHighlight === 'challenge' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-spin">🌟</div>
                  <h3 className="text-xl font-bold mb-2">Tour Infinie</h3>
                  <p className="text-yellow-100 mb-3 text-sm">
                    Course cristaux !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Record</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Règles de magie */}
            <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-xl p-6 border border-indigo-400">
              <h3 className="text-xl font-bold mb-4 text-center">🔮 Lois de la Magie</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold">Incantation Rapide</div>
                  <div className="text-gray-300">Plus tu lances vite, plus tes sorts sont puissants !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-bold">Combo Magique</div>
                  <div className="text-gray-300">Enchaîne les sorts pour amplifier ta magie !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💎</div>
                  <div className="font-bold">Trésors Magiques</div>
                  <div className="text-gray-300">Gagne cristaux et points en duel !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎭</div>
                  <div className="font-bold">Rangs Mystiques</div>
                  <div className="text-gray-300">Gravis les échelons jusqu'à Archimage !</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sélection des tours magiques */}
        {gameMode === 'tower-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🏰 Choisis ta Tour de Défi</h2>
              <p className="text-gray-300">Chaque tour cache un maître sorcier redoutable !</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {magicTowers.map((tower) => (
                <div 
                  key={tower.id}
                  onClick={() => startMagicDuel(tower.id)}
                  className={`bg-gradient-to-br ${tower.color} rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white border-opacity-20 group`}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">{tower.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{tower.name}</h3>
                    <div className="text-sm opacity-90 mb-2">{tower.difficulty}</div>
                    <p className="text-sm opacity-75 mb-4">{tower.description}</p>
                    
                    {/* Boss sorcier info */}
                    <div className="bg-black bg-opacity-40 rounded-lg p-4 mb-4">
                      <div className="text-3xl mb-2">{tower.boss.avatar}</div>
                      <div className="font-bold">{tower.boss.name}</div>
                      <div className="text-sm opacity-75">Mana: {tower.boss.mana}</div>
                    </div>

                    {/* Détails magiques */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Temps d'incantation:</span>
                        <span>{tower.timeLimit}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sorts à lancer:</span>
                        <span>{tower.spellsToWin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nombres max:</span>
                        <span>{tower.maxNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('academy')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                🏰 Retour à l'académie
              </button>
            </div>
          </div>
        )}

        {/* Salle d'entraînement magique */}
        {gameMode === 'training' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">📚 Salle d'Étude Magique</h2>
              <p className="text-gray-300">Perfectionne tes sorts sans pression !</p>
              <div className="mt-4 text-lg">
                <span className="text-green-400">✨ {successfulSpells}</span> / <span className="text-gray-400">{spellsCast} sorts</span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-8 text-center shadow-2xl border border-emerald-400">
                <div className="text-lg text-emerald-100 mb-2">
                  {currentSpell?.type === 'double' ? '🔮 Sort de Duplication' : '💫 Sort de Division'}
                </div>
                <div className="text-5xl font-bold mb-6 text-white animate-pulse">
                  {currentSpell?.question} = ?
                </div>
                
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrainingSpell()}
                  className="text-center text-3xl font-bold border-2 border-white rounded-lg px-4 py-3 w-40 text-gray-800 bg-white shadow-lg"
                  placeholder="?"
                  autoFocus
                />
                
                <div className="mt-6 space-x-4">
                  <button
                    onClick={handleTrainingSpell}
                    className="bg-white text-emerald-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    ✨ Lancer le Sort
                  </button>
                  <button
                    onClick={() => setGameMode('academy')}
                    className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-lg"
                  >
                    🏰 Retour Académie
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Duel magique contre le boss sorcier */}
        {gameMode === 'duel' && (
          <div className="space-y-6">
            {/* Barres de mana */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ton mana */}
              <div className="bg-blue-800 rounded-lg p-4 border border-purple-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">🧙‍♂️ {wizardRank}</span>
                  <span>{playerMana}/100 Mana</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${playerMana}%` }}
                  ></div>
                </div>
                {spellCombo > 0 && (
                  <div className="mt-2 text-center">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full font-bold animate-pulse">
                      ✨ Combo x{spellCombo}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-center text-gray-300">
                  Sorts: {spellsCast}/{magicTowers[currentTower - 1].spellsToWin} | Réussis: {successfulSpells}
                </div>
              </div>

              {/* Mana du sorcier ennemi */}
              <div className="bg-red-800 rounded-lg p-4 border border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{magicTowers[currentTower - 1].boss.avatar} {magicTowers[currentTower - 1].boss.name}</span>
                  <span>{sorcererMana}/{magicTowers[currentTower - 1].boss.mana} Mana</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(sorcererMana / magicTowers[currentTower - 1].boss.mana) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Zone de duel magique */}
            <div className={`bg-gradient-to-br ${magicTowers[currentTower - 1].bgColor} rounded-xl p-8 text-center shadow-2xl border border-purple-400`}>
              
              {duelPhase === 'spell' && (
                <div className="space-y-6">
                  {/* Timer magique */}
                  <div className="flex justify-center items-center space-x-4">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-purple-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  {/* Sort à lancer */}
                  <div className="space-y-4">
                    <div className="text-lg text-gray-700 font-bold">
                      {currentSpell?.type === 'double' ? '🔮 Sort de Duplication Magique' : '💫 Sort de Division Mystique'}
                    </div>
                    <div className="text-6xl font-bold mb-6 text-gray-800 animate-pulse">
                      {currentSpell?.question} = ?
                    </div>
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && castSpell()}
                    className="text-center text-4xl font-bold border-4 border-gray-800 rounded-lg px-4 py-3 w-48 text-gray-800 bg-white shadow-xl"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={castSpell}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-10 py-5 rounded-lg font-bold hover:scale-105 transition-all text-2xl shadow-xl"
                    >
                      ✨ INCANTATION !
                    </button>
                  </div>
                </div>
              )}

              {duelPhase === 'result' && isCastingSpell && (
                <div className="space-y-6">
                  <div className="text-7xl animate-spin">🔮</div>
                  <div className="text-4xl font-bold text-purple-600">
                    {showCriticalSpell ? '⭐ SORT CRITIQUE !' : '✨ Sort réussi !'}
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts magiques infligés: <span className="font-bold text-purple-600">{damageDealt}</span>
                  </div>
                  {showCriticalSpell && (
                    <div className="text-xl text-yellow-600 font-bold animate-pulse">
                      🌟 COMBO MAGIQUE + RAPIDITÉ 🌟
                    </div>
                  )}
                </div>
              )}

              {duelPhase === 'result' && showCorrectAnswer && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">💥</div>
                  <div className="text-4xl font-bold text-red-600">
                    Sort raté !
                  </div>
                  <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 text-gray-800">
                    <div className="text-2xl font-bold mb-2">🔮 La bonne réponse était :</div>
                    <div className="text-6xl font-bold text-red-600 animate-pulse">
                      {currentSpell?.question} = {currentSpell?.answer}
                    </div>
                    <div className="text-lg mt-4 text-gray-600">
                      {currentSpell?.type === 'double' ? 
                        `Le double de ${currentSpell?.number} est ${currentSpell?.answer}` : 
                        `La moitié de ${currentSpell?.number} est ${currentSpell?.answer}`
                      }
                    </div>
                  </div>
                </div>
              )}

              {duelPhase === 'counter-spell' && isUnderAttack && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">{magicTowers[currentTower - 1].boss.avatar}</div>
                  <div className="text-4xl font-bold text-red-400">
                    Contre-sort lancé !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts subis: <span className="font-bold text-red-600">{damageReceived}</span>
                  </div>
                </div>
              )}

              {duelPhase === 'victory' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-bounce">🏆</div>
                  <div className="text-4xl font-bold text-yellow-400">
                    VICTOIRE MAGIQUE !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Tu as vaincu {magicTowers[currentTower - 1].boss.name} !
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">🎁 Récompenses magiques :</div>
                    <div>💎 +{200 + (successfulSpells * 10)} cristaux</div>
                    <div>⭐ +{100 + (spellCombo * 20)} points magiques</div>
                    <div>🎭 Nouveau rang mystique débloqué !</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => setGameMode('tower-select')}
                      className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl"
                    >
                      🏰 Nouvelle Tour
                    </button>
                    <button
                      onClick={resetAcademy}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏰 Retour Académie
                    </button>
                  </div>
                </div>
              )}

              {duelPhase === 'defeat' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-pulse">💀</div>
                  <div className="text-4xl font-bold text-red-400">
                    TA MAGIE A ÉCHOUÉ...
                  </div>
                  <div className="text-2xl text-gray-800">
                    {magicTowers[currentTower - 1].boss.name} était trop puissant !
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">📊 Ton grimoire :</div>
                    <div>✨ Sorts réussis : {successfulSpells}/{spellsCast}</div>
                    <div>🔮 Meilleur combo : {maxSpellCombo}</div>
                    <div>📈 Maîtrise : {spellsCast > 0 ? Math.round((successfulSpells / spellsCast) * 100) : 0}%</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => startMagicDuel(currentTower)}
                      className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-400 transition-colors shadow-xl"
                    >
                      ⚔️ Nouveau Duel !
                    </button>
                    <button
                      onClick={startTraining}
                      className="bg-emerald-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-400 transition-colors shadow-xl"
                    >
                      📚 S'entraîner
                    </button>
                    <button
                      onClick={resetAcademy}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏰 Retour Académie
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode duel 2 sorciers */}
        {gameMode === 'duel-2players' && (
          <div className="space-y-6">
            {/* Tableau de scores magiques */}
            <div className="bg-gradient-to-r from-blue-800 to-cyan-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">🔮 Duel de Sorciers - Doubles et Moitiés</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-4 rounded-lg ${currentPlayer === 1 ? 'bg-blue-600 ring-4 ring-yellow-400' : 'bg-blue-700'}`}>
                  <div className="text-3xl mb-2">🧙‍♂️</div>
                  <div className="font-bold">Sorcier 1</div>
                  <div className="text-2xl font-bold">{player1Score}</div>
                  <div className="text-sm">Victoires: {player1Wins}</div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">Sorts restants</div>
                    <div className="text-3xl font-bold text-yellow-400">{questionsLeft}</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${currentPlayer === 2 ? 'bg-cyan-600 ring-4 ring-yellow-400' : 'bg-cyan-700'}`}>
                  <div className="text-3xl mb-2">🧙‍♀️</div>
                  <div className="font-bold">Sorcier 2</div>
                  <div className="text-2xl font-bold">{player2Score}</div>
                  <div className="text-sm">Victoires: {player2Wins}</div>
                </div>
              </div>
            </div>

            {magicDuelPhase === 'question' && (
              <div className="max-w-2xl mx-auto">
                <div className={`bg-gradient-to-br ${currentPlayer === 1 ? 'from-blue-600 to-blue-700' : 'from-cyan-600 to-cyan-700'} rounded-xl p-8 text-center shadow-2xl text-white`}>
                  <div className="text-lg mb-2">Au tour du Sorcier {currentPlayer}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentSpell?.question} = ?
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleDuelAnswer()}
                    className="text-center text-3xl font-bold border-2 border-white rounded-lg px-4 py-3 w-40 text-gray-800 bg-white shadow-lg"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={handleDuelAnswer}
                      className="bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      ✨ Lancer Sort !
                    </button>
                  </div>
                </div>
              </div>
            )}

            {magicDuelPhase === 'final' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🏆</div>
                  <div className="text-3xl font-bold mb-4">
                    {player1Score > player2Score ? 'Victoire du Sorcier 1 !' : 
                     player2Score > player1Score ? 'Victoire du Sorcier 2 !' : 
                     'Match Nul Magique !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Score Final</div>
                    <div className="text-2xl">
                      Sorcier 1: {player1Score} - Sorcier 2: {player2Score}
                    </div>
                  </div>

                  <div className="space-x-4">
                    <button
                      onClick={startDuel2Players}
                      className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-xl"
                    >
                      🔄 Revanche !
                    </button>
                    <button
                      onClick={() => setGameMode('academy')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏰 Retour Académie
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode défi temps magique */}
        {gameMode === 'time-challenge' && (
          <div className="space-y-6">
            {/* Tableau de scores temps */}
            <div className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">🌟 Tour Infinie - Doubles et Moitiés</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-yellow-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">💎</div>
                  <div className="font-bold">Cristaux</div>
                  <div className="text-xl font-bold">{timeScore}</div>
                </div>
                
                <div className="bg-orange-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="font-bold">Record</div>
                  <div className="text-xl font-bold">{bestScore}</div>
                </div>
                
                <div className="bg-red-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="font-bold">Niveau</div>
                  <div className="text-xl font-bold">{difficultyLevel}</div>
                </div>
                
                <div className="bg-purple-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="font-bold">Sorts</div>
                  <div className="text-xl font-bold">{challengeSpellsCast}</div>
                </div>
              </div>
            </div>

            {challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-lg mb-2">Niveau Magique {difficultyLevel}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-300" />
                    <div className={`text-3xl font-bold ${timeLeft <= 2 ? 'text-red-300 animate-bounce' : 'text-yellow-300'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentSpell?.question} = ?
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChallengeAnswer()}
                    className="text-center text-3xl font-bold border-2 border-white rounded-lg px-4 py-3 w-40 text-gray-800 bg-white shadow-lg"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={handleChallengeAnswer}
                      className="bg-white text-orange-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      🌟 Incanter !
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🌟</div>
                  <div className="text-3xl font-bold mb-4">
                    {timeScore > bestScore ? 'NOUVEAU RECORD MAGIQUE !' : 'Défi Terminé !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Pouvoir Final</div>
                    <div className="text-xl mb-2">Cristaux: {timeScore}</div>
                    <div className="text-lg">Niveau atteint: {difficultyLevel}</div>
                    <div className="text-lg">Sorts réussis: {challengeSpellsCast}</div>
                    {timeScore > bestScore && (
                      <div className="text-yellow-300 font-bold mt-2 animate-pulse">
                        🎉 Record de grand sorcier battu ! 🎉
                      </div>
                    )}
                  </div>

                  <div className="space-x-4">
                    <button
                      onClick={startTimeChallenge}
                      className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-xl"
                    >
                      🔄 Nouveau Défi
                    </button>
                    <button
                      onClick={() => setGameMode('academy')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏰 Retour Académie
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