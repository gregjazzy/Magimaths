'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Sword, Shield, Star, Trophy, Zap, Heart, Timer, Crown, Target, Volume2 } from 'lucide-react';

export default function AdditionsSimples() {
  // États du jeu principal
  const [gameMode, setGameMode] = useState<'arena' | 'training' | 'boss-fight' | 'level-select' | 'duel-2players' | 'time-challenge'>('arena');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);
  const [playerCoins, setPlayerCoins] = useState(0);
  const [playerTitle, setPlayerTitle] = useState('Apprenti Calculateur');
  
  // États du combat
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [battlePhase, setBattlePhase] = useState<'question' | 'result' | 'boss-attack' | 'victory' | 'defeat'>('question');
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  // États des animations
  const [isAttacking, setIsAttacking] = useState(false);
  const [isBossAttacking, setIsBossAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState(0);
  const [damageReceived, setDamageReceived] = useState(0);
  const [showCritical, setShowCritical] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  // Audio et effets
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // États pour le mode 2 joueurs
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [duelPhase, setDuelPhase] = useState<'question' | 'result' | 'final'>('question');

  // États pour le défi temps
  const [timeScore, setTimeScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);

  // Système XP et progression
  const [playerXP, setPlayerXP] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [xpForNextLevel, setXpForNextLevel] = useState(100);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGainAmount, setXpGainAmount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [presentationStep, setPresentationStep] = useState(0);

  // Configuration des niveaux
  const levels = [
    {
      id: 1,
      name: "Novice des Nombres",
      description: "Premier trimestre CP - Additions jusqu'à 10",
      difficulty: "🌱 Facile",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-100 to-emerald-200",
      icon: "🎓",
      timeLimit: 15,
      maxNumber: 10,
      questionCount: 12,
      boss: {
        name: "Papa Calculette",
        avatar: "👨‍💼",
        hp: 80,
        attacks: ["Distraction TV", "Question Facile", "Encouragement"],
        phrases: [
          "Allez, tu peux le faire !",
          "C'est un calcul facile !",
          "Prends ton temps !"
        ]
      }
    },
    {
      id: 2,
      name: "Guerrier du Calcul",
      description: "Premier semestre CP - Additions jusqu'à 20",
      difficulty: "⚡ Moyen",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-100 to-cyan-200",
      icon: "⚔️",
      timeLimit: 12,
      maxNumber: 20,
      questionCount: 15,
      boss: {
        name: "Maman Calculatrice",
        avatar: "👩‍🏫",
        hp: 100,
        attacks: ["Question Piège", "Regard Sévère", "Défi Temps"],
        phrases: [
          "Attention, c'est plus difficile !",
          "Réfléchis bien !",
          "Tu peux faire mieux !"
        ]
      }
    },
    {
      id: 3,
      name: "Maître des Additions",
      description: "Fin d'année CP - Défis chronométrés experts",
      difficulty: "🔥 BOSS",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-100 to-pink-200",
      icon: "👑",
      timeLimit: 8,
      maxNumber: 20,
      questionCount: 20,
      boss: {
        name: "Grand-Frère le Génie",
        avatar: "🧠",
        hp: 150,
        attacks: ["Calcul Mental Éclair", "Pression Temporelle", "Défi Ultime"],
        phrases: [
          "Tu crois pouvoir me battre ?",
          "Je calcule plus vite que toi !",
          "Trop lent, petit frère !"
        ]
      }
    }
  ];

  // Générateur de questions selon le niveau
  const generateQuestion = () => {
    const level = levels[currentLevel - 1];
    let num1, num2;
    
    if (level.id === 1) {
      // Niveau facile : additions jusqu'à 10
      num1 = Math.floor(Math.random() * 6) + 1; // 1-6
      num2 = Math.floor(Math.random() * (10 - num1)) + 1; // pour que la somme ≤ 10
    } else if (level.id === 2) {
      // Niveau moyen : additions jusqu'à 20
      num1 = Math.floor(Math.random() * 10) + 1; // 1-10
      num2 = Math.floor(Math.random() * (20 - num1)) + 1; // pour que la somme ≤ 20
    } else {
      // Niveau boss : toutes additions jusqu'à 20
      num1 = Math.floor(Math.random() * 15) + 1; // 1-15
      num2 = Math.floor(Math.random() * 15) + 1; // 1-15
    }
    
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2,
      num1,
      num2,
      difficulty: level.difficulty
    };
  };

  // Fonction audio améliorée
  const speak = (text: string, type: 'normal' | 'victory' | 'attack' | 'defeat' = 'normal') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    
    // Adaptation de la voix selon le type
    switch (type) {
      case 'victory':
        utterance.rate = 0.9;
        utterance.pitch = 1.3;
        break;
      case 'attack':
        utterance.rate = 1.1;
        utterance.pitch = 1.1;
        break;
      case 'defeat':
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
        break;
      default:
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
    }
    
    utterance.onstart = () => setIsPlayingVocal(true);
    utterance.onend = () => setIsPlayingVocal(false);
    
    audioRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Gestion du timer
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (battlePhase === 'question') {
        handleTimeOut();
      } else if (gameMode === 'duel-2players' && duelPhase === 'question') {
        // Timeout en mode duel
        setIsTimerRunning(false);
        speak(`Temps écoulé pour le Joueur ${currentPlayer} !`, 'normal');
        setTimeout(() => {
          const newQuestionsLeft = questionsLeft - 1;
          setQuestionsLeft(newQuestionsLeft);
          
          if (newQuestionsLeft === 0) {
            finishDuel();
          } else {
            const nextPlayer = currentPlayer === 1 ? 2 : 1;
            setCurrentPlayer(nextPlayer);
            setCurrentQuestion(generateDuelQuestion());
            setUserAnswer('');
            setTimeLeft(10);
            setDuelPhase('question');
            
            speak(`Au tour du Joueur ${nextPlayer} !`, 'normal');
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
  }, [timeLeft, isTimerRunning, battlePhase, gameMode, duelPhase, challengeActive]);

  // Démarrer un combat contre un boss
  const startBossFight = (levelId: number) => {
    setCurrentLevel(levelId);
    setGameMode('boss-fight');
    setPlayerHP(100);
    setBossHP(levels[levelId - 1].boss.hp);
    setCombo(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setBattlePhase('question');
    setCurrentQuestion(generateQuestion());
    setTimeLeft(levels[levelId - 1].timeLimit);
    setIsTimerRunning(false); // Le timer ne démarre pas tout de suite
    
    const level = levels[levelId - 1];
    
    // Créer l'utterance avec callback pour démarrer le timer après
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Bienvenue dans l'arène du calcul ! Tu vas affronter ${level.boss.name}. ${level.boss.phrases[0]} Le chrono commence maintenant !`);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      
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

  // Gestion des réponses
  const handleAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setTotalQuestions(prev => prev + 1);
    
    if (answer === currentQuestion.answer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const handleCorrectAnswer = () => {
    setIsAttacking(true);
    setCorrectAnswers(prev => prev + 1);
    
    // Calcul des dégâts avec bonus
    const baseAtk = 15;
    const speedBonus = timeLeft > Math.floor(levels[currentLevel - 1].timeLimit * 0.6) ? 10 : 0;
    const comboBonus = combo * 3;
    const damage = baseAtk + speedBonus + comboBonus;
    
    const isCritical = speedBonus > 0 || combo > 2;
    
    // Système XP amélioré
    const newStreak = streak + 1;
    setStreak(newStreak);
    setMaxStreak(Math.max(maxStreak, newStreak));
    
    const xpGained = calculateXP(
      currentLevel,
      speedBonus,
      newStreak
    );
    
    setDamageDealt(damage);
    setShowCritical(isCritical);
    setBossHP(Math.max(0, bossHP - damage));
    setCombo(combo + 1);
    setMaxCombo(Math.max(maxCombo, combo + 1));
    setPlayerCoins(playerCoins + (isCritical ? 8 : 5));
    
    // Ajouter XP avec animation
    addXP(xpGained + (isCritical ? 5 : 0));
    
    setBattlePhase('result');
    speak(isCritical ? 'COUP CRITIQUE ! Incroyable !' : 'Excellente réponse !', 'victory');
    
    setTimeout(() => {
      setIsAttacking(false);
      setShowCritical(false);
      
      if (bossHP - damage <= 0) {
        handleVictory();
      } else if (totalQuestions >= levels[currentLevel - 1].questionCount) {
        // Combat terminé par nombre de questions
        if (correctAnswers / totalQuestions >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouvelle question (pas de contre-attaque après une bonne réponse)
        setCurrentQuestion(generateQuestion());
        setUserAnswer('');
        setTimeLeft(levels[currentLevel - 1].timeLimit);
        setBattlePhase('question');
        // Petit délai pour que l'élève lise la nouvelle question
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2000);
  };

  const handleWrongAnswer = () => {
    setCombo(0);
    setStreak(0); // Reset du streak
    setShowCorrectAnswer(true);
    setBattlePhase('result');
    speak(`Pas correct ! La réponse était ${currentQuestion.answer}.`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleBossAttack();
    }, 3500);
  };

  const handleTimeOut = () => {
    setCombo(0);
    setShowCorrectAnswer(true);
    setBattlePhase('result');
    speak(`Temps écoulé ! La réponse était ${currentQuestion.answer}. Le boss en profite pour attaquer !`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleBossAttack();
    }, 3500);
  };

  const handleBossAttack = () => {
    setIsBossAttacking(true);
    setBattlePhase('boss-attack');
    
    const level = levels[currentLevel - 1];
    const damage = Math.floor(Math.random() * 25) + 15;
    setDamageReceived(damage);
    setPlayerHP(Math.max(0, playerHP - damage));
    
    const attack = level.boss.attacks[Math.floor(Math.random() * level.boss.attacks.length)];
    speak(`${level.boss.name} utilise ${attack} !`, 'attack');
    
    setTimeout(() => {
      setIsBossAttacking(false);
      
      if (playerHP - damage <= 0) {
        handleDefeat();
      } else if (totalQuestions >= level.questionCount) {
        // Combat terminé par nombre de questions
        if (correctAnswers / totalQuestions >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouvelle question
        setCurrentQuestion(generateQuestion());
        setUserAnswer('');
        setTimeLeft(level.timeLimit);
        setBattlePhase('question');
        // Petit délai pour que l'élève lise la nouvelle question
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleVictory = () => {
    setBattlePhase('victory');
    setShowFireworks(true);
    
    // Calcul bonus XP pour victoire
    const baseVictoryXP = 50;
    const comboBonus = combo * 15;
    const perfectionBonus = (correctAnswers / totalQuestions) >= 0.9 ? 30 : 0;
    const speedBonus = timeLeft > 0 ? Math.floor(timeLeft * 2) : 0;
    const bonusXP = baseVictoryXP + comboBonus + perfectionBonus + speedBonus;
    
    const bonusCoins = 50 + (correctAnswers * 5);
    setPlayerCoins(playerCoins + bonusCoins);
    
    // Animation de victoire épique
    playVictoryAnimation();
    
    // Ajouter XP bonus avec animation
    setTimeout(() => {
      addXP(bonusXP);
    }, 1000);
    
    // Mise à jour du titre avec progression
    if (playerLevel >= 15) {
      setPlayerTitle('Légende Immortelle');
    } else if (playerLevel >= 10) {
      setPlayerTitle('Maître Suprême');
    } else if (playerLevel >= 5) {
      setPlayerTitle('Champion Vétéran');
    } else if (currentLevel === 3) {
      setPlayerTitle('Légende du Calcul Mental');
    } else if (currentLevel === 2) {
      setPlayerTitle('Champion des Additions');
    }
    
    // Sauvegarde du streak
    localStorage.setItem('warrior-maxStreak', maxStreak.toString());
    
    speak(`VICTOIRE LÉGENDAIRE ! +${bonusXP} XP ! Tu es le maître absolu !`, 'victory');
    
    setTimeout(() => setShowFireworks(false), 5000);
  };

  const handleDefeat = () => {
    setBattlePhase('defeat');
    speak('Défaite... Mais ne renonce jamais ! Entraîne-toi et reviens plus fort !', 'defeat');
  };

  const resetGame = () => {
    setGameMode('arena');
    setPlayerHP(100);
    setBossHP(100);
    setCombo(0);
    setUserAnswer('');
    setIsTimerRunning(false);
    setTotalQuestions(0);
    setCorrectAnswers(0);
  };

  // Charger le meilleur score au démarrage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore-additions');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    
    // Charger les données XP
    const savedXP = localStorage.getItem('warrior-totalXP');
    const savedLevel = localStorage.getItem('warrior-level');
    const savedStreak = localStorage.getItem('warrior-maxStreak');
    const savedBadges = localStorage.getItem('warrior-badges');
    
    if (savedXP) {
      const xp = parseInt(savedXP);
      setTotalXP(xp);
      setPlayerXP(xp % 100);
    }
    if (savedLevel) setPlayerLevel(parseInt(savedLevel));
    if (savedStreak) setMaxStreak(parseInt(savedStreak));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
  }, []);

  // Système XP - Calculer XP par victoire
  const calculateXP = (difficulty: number, timeBonus: number, streakBonus: number): number => {
    const baseXP = 10 + (difficulty * 5);
    const speedBonus = Math.floor(timeBonus / 2);
    const comboBonus = Math.floor(streakBonus * 1.5);
    return baseXP + speedBonus + comboBonus;
  };

  // Ajouter XP avec animations
  const addXP = (amount: number) => {
    setXpGainAmount(amount);
    setShowXPGain(true);
    
    const newTotalXP = totalXP + amount;
    const newPlayerXP = playerXP + amount;
    
    setTotalXP(newTotalXP);
    setPlayerXP(newPlayerXP);
    
    // Check level up
    if (newPlayerXP >= xpForNextLevel) {
      levelUp();
    }
    
    // Sauvegarder
    localStorage.setItem('warrior-totalXP', newTotalXP.toString());
    
    // Animation particles
    createParticles();
    
    setTimeout(() => setShowXPGain(false), 2000);
  };

  // Level up avec animation
  const levelUp = () => {
    const newLevel = playerLevel + 1;
    setPlayerLevel(newLevel);
    setPlayerXP(0);
    setXpForNextLevel(100 + (newLevel * 25));
    setShowLevelUp(true);
    
    // Son et animation
    speak(`Félicitations ! Niveau ${newLevel} atteint ! Tu es maintenant un guerrier plus puissant !`, 'victory');
    
    // Vérifier les badges
    checkBadges(newLevel);
    
    localStorage.setItem('warrior-level', newLevel.toString());
    
    setTimeout(() => setShowLevelUp(false), 4000);
  };

  // Créer des particules d'XP
  const createParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 5; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  // Vérifier les badges
  const checkBadges = (level: number) => {
    const newBadges = [...badges];
    
    if (level >= 5 && !badges.includes('warrior-5')) {
      newBadges.push('warrior-5');
      speak('Badge débloqué : Guerrier Vétéran !', 'victory');
    }
    if (level >= 10 && !badges.includes('warrior-10')) {
      newBadges.push('warrior-10');
      speak('Badge débloqué : Maître Guerrier !', 'victory');
    }
    if (maxStreak >= 10 && !badges.includes('streak-10')) {
      newBadges.push('streak-10');
      speak('Badge débloqué : Combo Master !', 'victory');
    }
    
    if (newBadges.length > badges.length) {
      setBadges(newBadges);
      localStorage.setItem('warrior-badges', JSON.stringify(newBadges));
    }
  };

  // Animation de victoire
  const playVictoryAnimation = () => {
    setShowVictoryAnimation(true);
    createParticles();
    setTimeout(() => setShowVictoryAnimation(false), 3000);
  };

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    // Arrêter complètement la synthèse vocale
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() appelé');
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    // Reset des états de présentation
    setShowPresentation(false);
    setCurrentHighlight('');
    setPresentationStep(0);
  };

  // Présentation interactive des modes
  const startInteractivePresentation = () => {
    // Arrêter toute présentation en cours
    stopAllVocalsAndAnimations();
    stopSignalRef.current = false;
    setShowPresentation(true);
    setPresentationStep(0);
    setCurrentHighlight('');
    
    speak('Salutations, brave guerrier ! Bienvenue dans l\'arène de combat ! Laisse-moi te présenter tous les modes de combat disponibles !', 'normal');
    
    setTimeout(() => {
      presentModes();
    }, 5000);
  };

  const presentModes = async () => {
    const steps = [
      { highlight: 'training', text: 'Voici le Mode Entraînement ! Un terrain sûr pour perfectionner tes compétences sans pression !' },
      { highlight: 'boss', text: 'Voilà les Combats de Boss ! Affronte les guerriers légendaires Papa, Maman, ou ton Frère en duel épique !' },
      { highlight: 'duel', text: 'Puis le Duel de Guerriers ! Combattez-vous à deux dans un affrontement à 10 questions !' },
      { highlight: 'challenge', text: 'Et enfin, le Défi Temps ! Une épreuve ultime avec des questions de plus en plus difficiles !' },
      { highlight: '', text: 'Alors guerrier, quel mode de combat choisiras-tu pour prouver ta valeur ?' }
    ];

    for (let i = 0; i < steps.length; i++) {
      if (stopSignalRef.current) return;
      
      const step = steps[i];
      setCurrentHighlight(step.highlight);
      
      await playAudio(step.text);
      
      if (stopSignalRef.current) return;
      
      // Petite pause entre les étapes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setShowPresentation(false);
    setCurrentHighlight('');
  };

  // Fonction audio optimisée comme dans reconnaissance
  const playAudio = async (text: string) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      // Vérifier si l'API est disponible
      if (typeof speechSynthesis === 'undefined') {
        console.warn('SpeechSynthesis API non disponible');
        resolve();
        return;
      }
      
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;  // Plus lent pour être plus naturel
      utterance.pitch = 1.0; // Pitch normal, plus naturel
      utterance.volume = 1.0;
      
      // Sélectionner la MEILLEURE voix française disponible
      const voices = speechSynthesis.getVoices();
      console.log('Voix disponibles:', voices.map(v => `${v.name} (${v.lang}) ${v.default ? '✓' : ''}`));
      
      // Priorité aux voix FÉMININES françaises de qualité
      const bestFrenchVoice = voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        (voice.name.toLowerCase().includes('audrey') ||    // Voix féminine française courante  
         voice.name.toLowerCase().includes('marie') ||     // Voix féminine française
         voice.name.toLowerCase().includes('amélie') ||    // Voix féminine française
         voice.name.toLowerCase().includes('virginie') ||  // Voix féminine française
         voice.name.toLowerCase().includes('julie') ||     // Voix féminine française
         voice.name.toLowerCase().includes('celine') ||    // Voix féminine française
         voice.name.toLowerCase().includes('léa') ||       // Voix féminine française
         voice.name.toLowerCase().includes('charlotte'))   // Voix féminine française
      ) || voices.find(voice => 
        (voice.lang === 'fr-FR' || voice.lang === 'fr') && 
        (voice.name.toLowerCase().includes('thomas') ||    // Voix masculine en fallback
         voice.name.toLowerCase().includes('daniel'))      // Voix masculine en fallback
      ) || voices.find(voice => 
        voice.lang === 'fr-FR' && voice.localService    // Voix système française
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'                          // N'importe quelle voix fr-FR
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')                     // N'importe quelle voix française
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

  // Mode 2 joueurs
  const startDuel2Players = () => {
    setGameMode('duel-2players');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setQuestionsLeft(10);
    setDuelPhase('question');
    setCurrentQuestion(generateDuelQuestion());
    setTimeLeft(10);
    setIsTimerRunning(false);
    
    speak('Duel familial ! Joueur 1 contre Joueur 2. Que le meilleur gagne ! Joueur 1, prêt ?', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
  };

  const generateDuelQuestion = () => {
    // Questions adaptées pour le duel (niveau moyen)
    const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2,
      num1,
      num2
    };
  };

  const handleDuelAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    
    if (answer === currentQuestion.answer) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
        speak('Point pour le Joueur 1 !', 'victory');
      } else {
        setPlayer2Score(prev => prev + 1);
        speak('Point pour le Joueur 2 !', 'victory');
      }
    } else {
      speak(`Raté ! C'était ${currentQuestion.answer}`, 'normal');
    }
    
    setDuelPhase('result');
    setTimeout(() => {
      const newQuestionsLeft = questionsLeft - 1;
      setQuestionsLeft(newQuestionsLeft);
      
      if (newQuestionsLeft === 0) {
        finishDuel();
      } else {
        // Changer de joueur
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setCurrentQuestion(generateDuelQuestion());
        setUserAnswer('');
        setTimeLeft(10);
        setDuelPhase('question');
        
        speak(`Au tour du Joueur ${nextPlayer} !`, 'normal');
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1500);
      }
    }, 2000);
  };

  const finishDuel = () => {
    setDuelPhase('final');
    if (player1Score > player2Score) {
      setPlayer1Wins(prev => prev + 1);
      speak('Victoire du Joueur 1 ! Félicitations !', 'victory');
    } else if (player2Score > player1Score) {
      setPlayer2Wins(prev => prev + 1);
      speak('Victoire du Joueur 2 ! Bravo !', 'victory');
    } else {
      speak('Match nul ! Vous êtes à égalité !', 'normal');
    }
  };

  // Mode défi temps
  const startTimeChallenge = () => {
    setGameMode('time-challenge');
    setTimeScore(0);
    setDifficultyLevel(1);
    setTimePerQuestion(15);
    setQuestionsAnswered(0);
    setChallengeActive(true);
    setCurrentQuestion(generateChallengeQuestion(1));
    setTimeLeft(15);
    setIsTimerRunning(false);
    
    speak('Défi du temps ! Les questions vont devenir de plus en plus difficiles. Prêt ? C\'est parti !', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 3000);
  };

  const generateChallengeQuestion = (level: number) => {
    let num1, num2;
    
    if (level <= 3) {
      // Niveau 1-3: jusqu'à 10
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
    } else if (level <= 6) {
      // Niveau 4-6: jusqu'à 15
      num1 = Math.floor(Math.random() * 8) + 1;
      num2 = Math.floor(Math.random() * 8) + 1;
    } else if (level <= 10) {
      // Niveau 7-10: jusqu'à 20
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else {
      // Niveau 11+: jusqu'à 30 (limite CP)
      num1 = Math.floor(Math.random() * 15) + 1;
      num2 = Math.floor(Math.random() * 15) + 1;
    }
    
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2,
      num1,
      num2,
      level
    };
  };

  const handleChallengeAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setQuestionsAnswered(prev => prev + 1);
    
    if (answer === currentQuestion.answer) {
      // Calculer le score basé sur rapidité et difficulté
      const timeBonus = Math.max(0, timeLeft * 10);
      const difficultyBonus = difficultyLevel * 50;
      const points = 100 + timeBonus + difficultyBonus;
      
      setTimeScore(prev => prev + points);
      speak('Correct ! Points gagnés !', 'victory');
      
      // Augmenter la difficulté et réduire le temps
      const newLevel = difficultyLevel + 1;
      setDifficultyLevel(newLevel);
      const newTimeLimit = Math.max(5, 15 - Math.floor(newLevel / 2));
      setTimePerQuestion(newTimeLimit);
      
      setTimeout(() => {
        setCurrentQuestion(generateChallengeQuestion(newLevel));
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
      localStorage.setItem('bestScore-additions', timeScore.toString());
      speak(`Nouveau record ! ${timeScore} points ! Incroyable performance !`, 'victory');
    } else {
      speak(`Défi terminé ! Score: ${timeScore} points. Record à battre: ${bestScore}`, 'normal');
    }
  };

  // Mode entraînement libre
  const startTraining = () => {
    setGameMode('training');
    setCurrentQuestion(generateQuestion());
    speak('Mode entraînement ! Prends ton temps pour t\'améliorer sans pression.');
  };

  const handleTrainingAnswer = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === currentQuestion.answer) {
      speak('Parfait ! Bonne réponse !', 'victory');
      setPlayerXP(playerXP + 5);
      setPlayerCoins(playerCoins + 2);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setShowCorrectAnswer(true);
      speak(`Non, c'était ${currentQuestion.answer}. Continue !`, 'normal');
      setTimeout(() => {
        setShowCorrectAnswer(false);
      }, 3000);
    }
    
    setTotalQuestions(prev => prev + 1);
    
    // Nouvelle question après un délai
    setTimeout(() => {
      setCurrentQuestion(generateQuestion());
      setUserAnswer('');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Particules d'étoiles animées */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Feux d'artifice pour la victoire */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* En-tête */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/chapitre/cp-calcul-mental"
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  ⚔️ L'Arène des Additions
                </h1>
                <p className="text-gray-300">Défie les Boss de la famille !</p>
              </div>
            </div>

            {/* Stats du joueur */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-yellow-400 font-bold">{playerTitle}</div>
                <div className="text-sm text-gray-300">XP: {playerXP}</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">💰 {playerCoins}</div>
                <div className="text-sm text-gray-300">Pièces</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold">🔥 {maxCombo}</div>
                <div className="text-sm text-gray-300">Record combo</div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-green-600' : 'bg-gray-600'}`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Menu principal de l'arène */}
        {gameMode === 'arena' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                🏆 Bienvenue dans l'Arène !
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Choisis ton mode de combat et deviens le maître des additions !
              </p>
              
                            {/* Profil du Guerrier */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 mb-8 border-2 border-yellow-400 shadow-2xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">🛡️ Profil du Guerrier</h3>
                  <div className="text-lg text-white font-medium">{playerTitle}</div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Niveau */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-yellow-500">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Niveau</div>
                    <div className="text-white text-xl font-bold">{playerLevel}</div>
                  </div>
                  
                  {/* XP Progress */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-blue-400">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-blue-400 text-sm font-bold uppercase tracking-wider">Expérience</div>
                    <div className="text-white text-lg font-bold">{playerXP}/{xpForNextLevel}</div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(playerXP / xpForNextLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Streak */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-green-400">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-green-400 text-sm font-bold uppercase tracking-wider">Série Actuelle</div>
                    <div className="text-white text-xl font-bold">{streak}</div>
                    <div className="text-green-300 text-xs">Record: {maxStreak}</div>
                  </div>
                  
                  {/* Badges */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-purple-400">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-purple-400 text-sm font-bold uppercase tracking-wider">Trophées</div>
                    <div className="text-white text-xl font-bold">{badges.length}</div>
                    <div className="text-purple-300 text-xs">XP Total: {totalXP}</div>
                  </div>
                </div>
              </div>
               
               {/* Bouton d'accueil interactif */}
               <div className="mb-8">
                 <button
                   onClick={startInteractivePresentation}
                   className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse border-4 border-purple-300"
                 >
                   ⚔️ Découvrir les Modes de Combat !
                 </button>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Mode entraînement */}
              <div 
                onClick={startTraining}
                className={`bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-green-400 group ${
                  currentHighlight === 'training' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">🏃‍♂️</div>
                  <h3 className="text-xl font-bold mb-2">Entraînement</h3>
                  <p className="text-green-100 mb-3 text-sm">
                    Sans pression !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Détente</span>
                  </div>
                </div>
              </div>

              {/* Mode combat de boss */}
              <div 
                onClick={() => setGameMode('level-select')}
                className={`bg-gradient-to-br from-red-600 to-purple-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-red-400 group ${
                  currentHighlight === 'boss' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-pulse">⚔️</div>
                  <h3 className="text-xl font-bold mb-2">Combat Boss</h3>
                  <p className="text-red-100 mb-3 text-sm">
                    Famille à battre !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Sword className="w-4 h-4" />
                    <span>Épique</span>
                  </div>
                </div>
              </div>

              {/* Mode duel 2 joueurs */}
              <div 
                onClick={startDuel2Players}
                className={`bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-blue-400 group ${
                  currentHighlight === 'duel' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">👥</div>
                  <h3 className="text-xl font-bold mb-2">Duel 2 Joueurs</h3>
                  <p className="text-blue-100 mb-3 text-sm">
                    Défie ta famille !
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
                  <div className="text-5xl mb-3 group-hover:animate-spin">⏱️</div>
                  <h3 className="text-xl font-bold mb-2">Défi Temps</h3>
                  <p className="text-yellow-100 mb-3 text-sm">
                    Course au score !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Record</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Règles de l'arène */}
            <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-xl p-6 border border-blue-400">
              <h3 className="text-xl font-bold mb-4 text-center">⚡ Règles de Combat</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="font-bold">Rapidité</div>
                  <div className="text-gray-300">Plus tu réponds vite, plus tu fais de dégâts !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-bold">Combo</div>
                  <div className="text-gray-300">Enchaîne les bonnes réponses pour des bonus !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💎</div>
                  <div className="font-bold">Récompenses</div>
                  <div className="text-gray-300">Gagne XP et pièces en combattant !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-bold">Titres</div>
                  <div className="text-gray-300">Débloque des titres légendaires !</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sélection de niveau avec boss */}
        {gameMode === 'level-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">⚔️ Choisis ton Adversaire</h2>
              <p className="text-gray-300">Chaque boss a ses propres techniques de combat !</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {levels.map((level) => (
                <div 
                  key={level.id}
                  onClick={() => startBossFight(level.id)}
                  className={`bg-gradient-to-br ${level.color} rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white border-opacity-20 group`}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">{level.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{level.name}</h3>
                    <div className="text-sm opacity-90 mb-2">{level.difficulty}</div>
                    <p className="text-sm opacity-75 mb-4">{level.description}</p>
                    
                    {/* Boss info */}
                    <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-4">
                      <div className="text-3xl mb-2">{level.boss.avatar}</div>
                      <div className="font-bold">{level.boss.name}</div>
                      <div className="text-sm opacity-75">HP: {level.boss.hp}</div>
                    </div>

                    {/* Détails du niveau */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Temps limite:</span>
                        <span>{level.timeLimit}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span>{level.questionCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max nombre:</span>
                        <span>{level.maxNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('arena')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                ← Retour à l'arène
              </button>
            </div>
          </div>
        )}

        {/* Mode entraînement */}
        {gameMode === 'training' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🏃‍♂️ Mode Entraînement</h2>
              <p className="text-gray-300">Prends ton temps et améliore-toi !</p>
              <div className="mt-4 text-lg">
                <span className="text-green-400">✅ {correctAnswers}</span> / <span className="text-gray-400">{totalQuestions} questions</span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-8 text-center shadow-2xl">
                {!showCorrectAnswer ? (
                  <>
                    <div className="text-5xl font-bold mb-6 text-white animate-pulse">
                      {currentQuestion?.question} = ?
                    </div>
                    
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTrainingAnswer()}
                      className="text-center text-3xl font-bold border-2 border-white rounded-lg px-4 py-3 w-40 text-gray-800 bg-white shadow-lg"
                      placeholder="?"
                      autoFocus
                    />
                    
                    <div className="mt-6 space-x-4">
                      <button
                        onClick={handleTrainingAnswer}
                        className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        ✅ Valider
                      </button>
                      <button
                        onClick={() => setGameMode('arena')}
                        className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-lg"
                      >
                        🏠 Retour
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-6xl animate-pulse">❌</div>
                    <div className="text-3xl font-bold text-red-200">
                      Pas correct !
                    </div>
                    <div className="bg-red-100 border-4 border-red-300 rounded-xl p-6 text-gray-800">
                      <div className="text-xl font-bold mb-2">La bonne réponse était :</div>
                      <div className="text-5xl font-bold text-red-600 animate-pulse">
                        {currentQuestion?.question} = {currentQuestion?.answer}
                      </div>
                      <div className="text-lg mt-4 text-gray-600">
                        Rappelle-toi : {currentQuestion?.num1} + {currentQuestion?.num2} = {currentQuestion?.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Combat contre le boss */}
        {gameMode === 'boss-fight' && (
          <div className="space-y-6">
            {/* Barres de vie */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Joueur */}
              <div className="bg-blue-800 rounded-lg p-4 border border-blue-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">🧙‍♂️ {playerTitle}</span>
                  <span>{playerHP}/100 HP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${playerHP}%` }}
                  ></div>
                </div>
                {combo > 0 && (
                  <div className="mt-2 text-center">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold animate-pulse">
                      🔥 Combo x{combo}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-center text-gray-300">
                  Questions: {totalQuestions}/{levels[currentLevel - 1].questionCount} | Réussies: {correctAnswers}
                </div>
              </div>

              {/* Boss */}
              <div className="bg-red-800 rounded-lg p-4 border border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{levels[currentLevel - 1].boss.avatar} {levels[currentLevel - 1].boss.name}</span>
                  <span>{bossHP}/{levels[currentLevel - 1].boss.hp} HP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(bossHP / levels[currentLevel - 1].boss.hp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Zone de combat */}
            <div className={`bg-gradient-to-br ${levels[currentLevel - 1].bgColor} rounded-xl p-8 text-center shadow-2xl border border-purple-400`}>
              
              {battlePhase === 'question' && (
                <div className="space-y-6">
                  {/* Timer */}
                  <div className="flex justify-center items-center space-x-4">
                    <Timer className="w-6 h-6 text-yellow-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  {/* Question */}
                  <div className="text-6xl font-bold mb-6 text-gray-800 animate-pulse">
                    {currentQuestion?.question} = ?
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
                    className="text-center text-4xl font-bold border-4 border-gray-800 rounded-lg px-4 py-3 w-48 text-gray-800 bg-white shadow-xl"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={handleAnswer}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-5 rounded-lg font-bold hover:scale-105 transition-all text-2xl shadow-xl"
                    >
                      ⚔️ ATTAQUER !
                    </button>
                  </div>
                </div>
              )}

              {battlePhase === 'result' && isAttacking && (
                <div className="space-y-6">
                  <div className="text-7xl animate-bounce">⚔️</div>
                  <div className="text-4xl font-bold text-green-600">
                    {showCritical ? '💥 CRITIQUE !' : '✅ Touché !'}
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts infligés: <span className="font-bold text-red-600">{damageDealt}</span>
                  </div>
                  {showCritical && (
                    <div className="text-xl text-yellow-600 font-bold animate-pulse">
                      ⭐ BONUS VITESSE + COMBO ⭐
                    </div>
                  )}
                </div>
              )}

              {battlePhase === 'result' && showCorrectAnswer && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">❌</div>
                  <div className="text-4xl font-bold text-red-600">
                    Raté !
                  </div>
                  <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 text-gray-800">
                    <div className="text-2xl font-bold mb-2">La bonne réponse était :</div>
                    <div className="text-6xl font-bold text-red-600 animate-pulse">
                      {currentQuestion?.question} = {currentQuestion?.answer}
                    </div>
                    <div className="text-lg mt-4 text-gray-600">
                      Rappelle-toi : {currentQuestion?.num1} + {currentQuestion?.num2} = {currentQuestion?.answer}
                    </div>
                  </div>
                </div>
              )}

              {battlePhase === 'boss-attack' && isBossAttacking && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">{levels[currentLevel - 1].boss.avatar}</div>
                  <div className="text-4xl font-bold text-red-400">
                    Le boss contre-attaque !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts reçus: <span className="font-bold text-red-600">{damageReceived}</span>
                  </div>
                </div>
              )}

              {battlePhase === 'victory' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-bounce">🏆</div>
                  <div className="text-4xl font-bold text-yellow-400">
                    VICTOIRE ÉPIQUE !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Tu as vaincu {levels[currentLevel - 1].boss.name} !
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">🎁 Récompenses :</div>
                    <div>💰 +{50 + (correctAnswers * 5)} pièces</div>
                    <div>⭐ +{100 + (combo * 10)} XP</div>
                    <div>🏆 Nouveau titre débloqué !</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => setGameMode('level-select')}
                      className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl"
                    >
                      🏆 Nouveau Défi
                    </button>
                    <button
                      onClick={resetGame}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏠 Retour Arène
                    </button>
                  </div>
                </div>
              )}

              {battlePhase === 'defeat' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-pulse">💀</div>
                  <div className="text-4xl font-bold text-red-400">
                    DÉFAITE...
                  </div>
                  <div className="text-2xl text-gray-800">
                    {levels[currentLevel - 1].boss.name} t'a vaincu !
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">📊 Tes stats :</div>
                    <div>✅ Bonnes réponses : {correctAnswers}/{totalQuestions}</div>
                    <div>🔥 Meilleur combo : {maxCombo}</div>
                    <div>💡 Précision : {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => startBossFight(currentLevel)}
                      className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-400 transition-colors shadow-xl"
                    >
                      ⚔️ Revanche !
                    </button>
                    <button
                      onClick={startTraining}
                      className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-xl"
                    >
                      🏃‍♂️ S'entraîner
                    </button>
                    <button
                      onClick={resetGame}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏠 Retour Arène
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode duel 2 joueurs */}
        {gameMode === 'duel-2players' && (
          <div className="space-y-6">
            {/* Tableau de scores */}
            <div className="bg-gradient-to-r from-blue-800 to-cyan-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">🏆 Duel Familial - Additions</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-4 rounded-lg ${currentPlayer === 1 ? 'bg-blue-600 ring-4 ring-yellow-400' : 'bg-blue-700'}`}>
                  <div className="text-3xl mb-2">👤</div>
                  <div className="font-bold">Joueur 1</div>
                  <div className="text-2xl font-bold">{player1Score}</div>
                  <div className="text-sm">Victoires: {player1Wins}</div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">Questions restantes</div>
                    <div className="text-3xl font-bold text-yellow-400">{questionsLeft}</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${currentPlayer === 2 ? 'bg-cyan-600 ring-4 ring-yellow-400' : 'bg-cyan-700'}`}>
                  <div className="text-3xl mb-2">👤</div>
                  <div className="font-bold">Joueur 2</div>
                  <div className="text-2xl font-bold">{player2Score}</div>
                  <div className="text-sm">Victoires: {player2Wins}</div>
                </div>
              </div>
            </div>

            {duelPhase === 'question' && (
              <div className="max-w-2xl mx-auto">
                <div className={`bg-gradient-to-br ${currentPlayer === 1 ? 'from-blue-600 to-blue-700' : 'from-cyan-600 to-cyan-700'} rounded-xl p-8 text-center shadow-2xl text-white`}>
                  <div className="text-lg mb-2">Au tour du Joueur {currentPlayer}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentQuestion?.question} = ?
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
                      ✅ Valider
                    </button>
                  </div>
                </div>
              </div>
            )}

            {duelPhase === 'final' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🏆</div>
                  <div className="text-3xl font-bold mb-4">
                    {player1Score > player2Score ? 'Victoire du Joueur 1 !' : 
                     player2Score > player1Score ? 'Victoire du Joueur 2 !' : 
                     'Match Nul !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Score Final</div>
                    <div className="text-2xl">
                      Joueur 1: {player1Score} - Joueur 2: {player2Score}
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
                      onClick={() => setGameMode('arena')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏠 Retour Menu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode défi temps */}
        {gameMode === 'time-challenge' && (
          <div className="space-y-6">
            {/* Tableau de scores temps */}
            <div className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">⏱️ Défi du Temps - Additions</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-yellow-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="font-bold">Score</div>
                  <div className="text-xl font-bold">{timeScore}</div>
                </div>
                
                <div className="bg-orange-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="font-bold">Record</div>
                  <div className="text-xl font-bold">{bestScore}</div>
                </div>
                
                <div className="bg-red-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="font-bold">Niveau</div>
                  <div className="text-xl font-bold">{difficultyLevel}</div>
                </div>
                
                <div className="bg-purple-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="font-bold">Réponses</div>
                  <div className="text-xl font-bold">{questionsAnswered}</div>
                </div>
              </div>
            </div>

            {challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-lg mb-2">Niveau {difficultyLevel}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-300" />
                    <div className={`text-3xl font-bold ${timeLeft <= 2 ? 'text-red-300 animate-bounce' : 'text-yellow-300'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentQuestion?.question} = ?
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
                      ⚡ Valider
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">⏱️</div>
                  <div className="text-3xl font-bold mb-4">
                    {timeScore > bestScore ? 'NOUVEAU RECORD !' : 'Défi Terminé !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Résultats</div>
                    <div className="text-xl mb-2">Score Final: {timeScore} points</div>
                    <div className="text-lg">Niveau atteint: {difficultyLevel}</div>
                    <div className="text-lg">Questions réussies: {questionsAnswered}</div>
                    {timeScore > bestScore && (
                      <div className="text-yellow-300 font-bold mt-2 animate-pulse">
                        🎉 Record battu ! 🎉
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
                      onClick={() => setGameMode('arena')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏠 Retour Menu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations et Effets Spéciaux */}
      
      {/* Animation gain XP */}
      {showXPGain && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-2xl shadow-2xl animate-bounce border-4 border-yellow-300">
            +{xpGainAmount} XP! 🔥
          </div>
        </div>
      )}

      {/* Animation Level Up */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-12 rounded-2xl text-center shadow-2xl animate-pulse border-8 border-yellow-400">
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-4xl font-bold mb-4">NIVEAU SUPÉRIEUR !</div>
            <div className="text-2xl mb-2">Niveau {playerLevel} Atteint !</div>
            <div className="text-lg opacity-90">{playerTitle}</div>
            <div className="mt-4 text-6xl animate-spin">⭐</div>
          </div>
        </div>
      )}

      {/* Animation de Victoire */}
      {showVictoryAnimation && (
        <div className="fixed inset-0 bg-gradient-to-r from-purple-900 to-pink-900 bg-opacity-80 flex items-center justify-center z-40 pointer-events-none">
          <div className="text-center animate-pulse">
            <div className="text-9xl mb-4 animate-bounce">🏆</div>
            <div className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">VICTOIRE ÉPIQUE !</div>
            <div className="text-3xl text-white">Maître des Calculs !</div>
          </div>
        </div>
      )}

      {/* Particules d'XP */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed w-4 h-4 bg-yellow-400 rounded-full animate-ping pointer-events-none z-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      ))}

      {/* CSS personnalisé pour les animations */}
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 