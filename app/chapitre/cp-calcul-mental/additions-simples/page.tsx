'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Sword, Shield, Star, Trophy, Zap, Heart, Timer, Crown, Target, Volume2 } from 'lucide-react';

export default function AdditionsSimples() {
  // États du jeu principal
  const [gameMode, setGameMode] = useState<'arena' | 'training' | 'training-select' | 'boss-fight' | 'level-select' | 'duel-2players' | 'duel-select' | 'time-challenge' | 'challenge-select'>('arena');
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
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  
  // Audio et effets
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Historique des questions pour éviter les répétitions
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<number | null>(null);
  
  // État pour le mode entraînement avec niveaux
  const [trainingLevel, setTrainingLevel] = useState<1 | 2 | 3 | 4>(1);
  
  // État pour le mode duel avec niveaux
  const [duelLevel, setDuelLevel] = useState<1 | 2 | 3 | 4>(1);
  
  // État pour le mode défi temps avec niveaux
  const [challengeLevel, setChallengeLevel] = useState<1 | 2 | 3 | 4>(1);
  
  // État pour l'animation Légende Numérique
  const [showLegendAnimation, setShowLegendAnimation] = useState(false);
  const [isLegendUnlocked, setIsLegendUnlocked] = useState(false);
  const legendCost = 1000; // Coût en pièces pour débloquer
  
  // Statistiques d'entraînement par niveau
  const [trainingStats, setTrainingStats] = useState<{
    [key: number]: {
      totalQuestions: number;
      correctAnswers: number;
      totalTime: number; // en millisecondes
      averageTime: number; // temps moyen par bonne réponse
      bestPercentage: number;
      bestAverageTime: number;
    }
  }>({
    1: { totalQuestions: 0, correctAnswers: 0, totalTime: 0, averageTime: 0, bestPercentage: 0, bestAverageTime: Infinity },
    2: { totalQuestions: 0, correctAnswers: 0, totalTime: 0, averageTime: 0, bestPercentage: 0, bestAverageTime: Infinity },
    3: { totalQuestions: 0, correctAnswers: 0, totalTime: 0, averageTime: 0, bestPercentage: 0, bestAverageTime: Infinity },
    4: { totalQuestions: 0, correctAnswers: 0, totalTime: 0, averageTime: 0, bestPercentage: 0, bestAverageTime: Infinity }
  });
  
  // États pour mesurer le temps
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  
  // État pour les animations de record
  const [showRecordAnimation, setShowRecordAnimation] = useState(false);
  const [recordType, setRecordType] = useState<'speed' | 'accuracy' | null>(null);
  const [recordValue, setRecordValue] = useState<string>('');

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
  const [questionsInCurrentLevel, setQuestionsInCurrentLevel] = useState(0);

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
      timeLimit: 8,
      maxNumber: 10,
      questionCount: 12,
      boss: {
        name: "Papa Calculette",
        avatar: "👨‍💼",
        hp: 200,
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
      timeLimit: 5,
      maxNumber: 20,
      questionCount: 15,
      boss: {
        name: "Maman Calculatrice",
        avatar: "👩‍🏫",
        hp: 200,
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
      timeLimit: 3,
      maxNumber: 20,
      questionCount: 20,
      boss: {
        name: "Grand-Frère le Génie",
        avatar: "🧠",
        hp: 200,
        attacks: ["Calcul Mental Éclair", "Pression Temporelle", "Défi Ultime"],
        phrases: [
          "Tu crois pouvoir me battre ?",
          "Je calcule plus vite que toi !",
          "Trop lent, petit frère !"
        ]
      }
    }
  ];

  // Générateur de questions selon le niveau avec aléatoire amélioré
  const generateQuestion = () => {
    const level = levels[currentLevel - 1];
    let num1, num2, question, answer;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      if (level.id === 1) {
        // Niveau facile : additions jusqu'à 10 avec plus de variété
        const strategies = [
          () => {
            // Stratégie 1: nombres aléatoires simples
            num1 = Math.floor(Math.random() * 8) + 1; // 1-8
            num2 = Math.floor(Math.random() * (10 - num1)) + 1;
          },
          () => {
            // Stratégie 2: un nombre plus grand + un petit
            const big = Math.floor(Math.random() * 5) + 5; // 5-9
            const small = Math.floor(Math.random() * (10 - big)) + 1;
            if (Math.random() > 0.5) {
              num1 = big; num2 = small;
            } else {
              num1 = small; num2 = big;
            }
          },
          () => {
            // Stratégie 3: doubles et quasi-doubles
            const base = Math.floor(Math.random() * 5) + 1; // 1-5
            num1 = base;
            num2 = base + (Math.random() > 0.6 ? 1 : 0);
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else if (level.id === 2) {
        // Niveau moyen : additions jusqu'à 20 avec plus de variété
        const strategies = [
          () => {
            // Stratégie 1: nombres variés
            num1 = Math.floor(Math.random() * 12) + 1; // 1-12
            num2 = Math.floor(Math.random() * (20 - num1)) + 1;
          },
          () => {
            // Stratégie 2: passage à la dizaine
            const base = Math.floor(Math.random() * 8) + 6; // 6-13
            num2 = Math.floor(Math.random() * (20 - base)) + 1;
            num1 = base;
          },
          () => {
            // Stratégie 3: nombres proches
            const center = Math.floor(Math.random() * 8) + 6; // 6-13
            num1 = center + Math.floor(Math.random() * 3) - 1; // -1, 0, +1
            num2 = Math.max(1, Math.min(20 - num1, center + Math.floor(Math.random() * 3) - 1));
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else {
        // Niveau boss : additions variées jusqu'à 20
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 15) + 1; // 1-15
            num2 = Math.floor(Math.random() * 15) + 1; // 1-15
          },
          () => {
            // Grands nombres
            num1 = Math.floor(Math.random() * 8) + 8; // 8-15
            num2 = Math.floor(Math.random() * 8) + 1; // 1-8
          },
          () => {
            // Mélange aléatoire
            const total = Math.floor(Math.random() * 15) + 10; // 10-24
            num1 = Math.floor(Math.random() * (total - 2)) + 1;
            num2 = Math.min(15, total - num1);
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      }
      
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      attempts++;
      
    } while (
      attempts < maxAttempts && (
        recentQuestions.includes(question) || // Éviter les questions récentes
        (lastResult !== null && Math.abs(answer - lastResult) <= 1) || // Éviter les résultats consécutifs
        answer > (level.id === 1 ? 10 : level.id === 2 ? 20 : 25) // Respecter les limites
      )
    );
    
    // Mettre à jour l'historique
    const newRecentQuestions = [...recentQuestions, question].slice(-8); // Garder les 8 dernières
    setRecentQuestions(newRecentQuestions);
    setLastResult(answer);
    
    return {
      question,
      answer,
      num1,
      num2,
      difficulty: level.difficulty
    };
  };

  // Générateur de questions pour le mode entraînement
  const generateTrainingQuestion = () => {
    let num1, num2, question, answer;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      if (trainingLevel === 1) {
        // Facile : additions jusqu'à 10
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 8) + 1; // 1-8
            num2 = Math.floor(Math.random() * (10 - num1)) + 1;
          },
          () => {
            const big = Math.floor(Math.random() * 5) + 5; // 5-9
            const small = Math.floor(Math.random() * (10 - big)) + 1;
            if (Math.random() > 0.5) {
              num1 = big; num2 = small;
            } else {
              num1 = small; num2 = big;
            }
          },
          () => {
            const base = Math.floor(Math.random() * 5) + 1; // 1-5
            num1 = base;
            num2 = base + (Math.random() > 0.6 ? 1 : 0);
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else if (trainingLevel === 2) {
        // Moyen : additions jusqu'à 20
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 12) + 1; // 1-12
            num2 = Math.floor(Math.random() * (20 - num1)) + 1;
          },
          () => {
            const base = Math.floor(Math.random() * 8) + 6; // 6-13
            num2 = Math.floor(Math.random() * (20 - base)) + 1;
            num1 = base;
          },
          () => {
            const center = Math.floor(Math.random() * 8) + 6; // 6-13
            num1 = center + Math.floor(Math.random() * 3) - 1;
            num2 = Math.max(1, Math.min(20 - num1, center + Math.floor(Math.random() * 3) - 1));
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else if (trainingLevel === 3) {
        // Difficile : additions jusqu'à 100
        const strategies = [
          () => {
            // Additions simples avec grands nombres
            num1 = Math.floor(Math.random() * 50) + 1; // 1-50
            num2 = Math.floor(Math.random() * (100 - num1)) + 1;
          },
          () => {
            // Dizaines + unités
            const dizaines1 = Math.floor(Math.random() * 8) + 1; // 10-80
            const dizaines2 = Math.floor(Math.random() * (10 - dizaines1)) + 1;
            num1 = dizaines1 * 10 + Math.floor(Math.random() * 10);
            num2 = dizaines2 * 10 + Math.floor(Math.random() * 10);
          },
          () => {
            // Nombres proches de multiples de 10
            const base = Math.floor(Math.random() * 9) + 1; // 10-90
            num1 = base * 10 + Math.floor(Math.random() * 3) - 1; // ±1
            num2 = Math.floor(Math.random() * (100 - num1)) + 1;
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else {
        // King of Addition : Mix ultime jusqu'à 100
        const strategies = [
          () => {
            // Additions complexes jusqu'à 100
            num1 = Math.floor(Math.random() * 50) + 30; // 30-79
            num2 = Math.floor(Math.random() * (100 - num1)) + 1; // Résultat ≤ 100
          },
          () => {
            // Doubles et quasi-doubles difficiles
            const base = Math.floor(Math.random() * 30) + 20; // 20-49
            num1 = base;
            num2 = base + Math.floor(Math.random() * 5) - 2; // base ± 2
            if (num1 + num2 > 100) {
              num2 = 100 - num1;
            }
          },
          () => {
            // Passages de dizaines complexes
            num1 = Math.floor(Math.random() * 30) + 40; // 40-69
            const unités1 = num1 % 10;
            const besoinPassage = 10 - unités1;
            num2 = besoinPassage + Math.floor(Math.random() * 15); // Assure passage de dizaine
            if (num1 + num2 > 100) {
              num2 = 100 - num1;
            }
          },
          () => {
            // Multiples de 5 et 10 difficiles
            const multiples = [15, 25, 35, 45];
            num1 = multiples[Math.floor(Math.random() * multiples.length)];
            num2 = Math.floor(Math.random() * (100 - num1)) + 1;
          },
          () => {
            // Additions proches de 100
            const total = Math.floor(Math.random() * 10) + 90; // 90-99
            num1 = Math.floor(Math.random() * (total - 10)) + 10;
            num2 = total - num1;
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      }
      
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      attempts++;
      
    } while (
      attempts < maxAttempts && (
        recentQuestions.includes(question) ||
        (lastResult !== null && Math.abs(answer - lastResult) <= 1) ||
        answer > (trainingLevel === 1 ? 10 : trainingLevel === 2 ? 20 : 100)
      )
    );
    
    // Mettre à jour l'historique
    const newRecentQuestions = [...recentQuestions, question].slice(-8);
    setRecentQuestions(newRecentQuestions);
    setLastResult(answer);
    
    return {
      question,
      answer,
      num1,
      num2,
      level: trainingLevel
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
      if (gameMode === 'boss-fight' && battlePhase === 'question') {
        handleTimeOut();
      } else if (battlePhase === 'question') {
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
            setTimeLeft(5);
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
    setUserAnswer(''); // Vider la zone de saisie au démarrage
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
          // Focus automatique sur le champ de saisie
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 500); // Petit délai pour que l'élève soit prêt
      };
      
      audioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Si pas d'audio, démarrer quand même le timer après un délai
      setTimeout(() => {
        setIsTimerRunning(true);
        // Focus automatique sur le champ de saisie
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 1000); // Délai réduit
    }
    
    // Sécurité : forcer le démarrage du timer après 3 secondes maximum
    setTimeout(() => {
      setIsTimerRunning(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 3000);
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
    setShowCorrectMessage(true);
    
    // Calcul des dégâts fixes pour exactement 10 coups
    const damage = Math.floor(levels[currentLevel - 1].boss.hp / 10); // Dégâts constants pour 10 coups exactement
    
    // Critique si réponse rapide ou bon combo
    const timeLimit = levels[currentLevel - 1].timeLimit;
    const isQuickAnswer = timeLeft > Math.floor(timeLimit * 0.6);
    const isCritical = isQuickAnswer || combo > 2;
    
    // Système XP amélioré
    const newStreak = streak + 1;
    setStreak(newStreak);
    setMaxStreak(Math.max(maxStreak, newStreak));
    
    const xpGained = calculateXP(
      currentLevel,
      isQuickAnswer ? 10 : 0,
      newStreak
    );
    
    setDamageDealt(damage);
    setShowCritical(isCritical);
    setBossHP(Math.max(0, bossHP - damage));
    setCombo(combo + 1);
    setMaxCombo(Math.max(maxCombo, combo + 1));
    setPlayerCoins(playerCoins + (isCritical ? 8 : 5));
    
    // Ajouter XP sans animation en mode boss pour éviter la gêne
    setPlayerXP(prev => prev + xpGained + (isCritical ? 5 : 0));
    
    setBattlePhase('result');
    
    // Passage automatique ultra-rapide à la question suivante
    setTimeout(() => {
      setIsAttacking(false);
      setShowCritical(false);
      setShowCorrectMessage(false);
      
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
        // Passage immédiat avec focus automatique
        setTimeout(() => {
          setIsTimerRunning(true);
          // Focus automatique sur le champ de saisie
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    }, 400);
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
          // Focus automatique sur le champ de saisie
          if (inputRef.current) {
            inputRef.current.focus();
          }
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

  // Mode 2 joueurs avec niveaux
  const startDuel2Players = (level: 1 | 2 | 3 | 4 = 1) => {
    setDuelLevel(level);
    setGameMode('duel-2players');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setQuestionsLeft(24);
    setDuelPhase('question');
    setCurrentQuestion(generateDuelQuestion());
    setTimeLeft(5);
    setIsTimerRunning(false);
    
    const levelNames = {
      1: 'facile - additions jusqu\'à 10',
      2: 'moyen - additions jusqu\'à 20', 
      3: 'difficile - additions jusqu\'à 100',
      4: 'King of Addition - mix ultime jusqu\'à 100'
    };
    
    speak(`Duel familial niveau ${levelNames[level]} ! Joueur 1 contre Joueur 2. Que le meilleur gagne ! Joueur 1, prêt ?`, 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
  };

  const generateDuelQuestion = () => {
    let num1, num2, question, answer;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      if (duelLevel === 1) {
        // Facile : additions jusqu'à 10
        num1 = Math.floor(Math.random() * 8) + 1; // 1-8
        num2 = Math.floor(Math.random() * (10 - num1)) + 1;
      } else if (duelLevel === 2) {
        // Moyen : additions jusqu'à 20
        num1 = Math.floor(Math.random() * 12) + 1; // 1-12
        num2 = Math.floor(Math.random() * (20 - num1)) + 1;
      } else if (duelLevel === 3) {
        // Difficile : additions jusqu'à 100
        num1 = Math.floor(Math.random() * 50) + 1; // 1-50
        num2 = Math.floor(Math.random() * (100 - num1)) + 1;
      } else {
        // King of Addition : mix ultime jusqu'à 100
        num1 = Math.floor(Math.random() * 50) + 30; // 30-79
        num2 = Math.floor(Math.random() * (100 - num1)) + 1;
      }
      
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      attempts++;
      
    } while (
      attempts < maxAttempts && (
        recentQuestions.includes(question) ||
        (lastResult !== null && Math.abs(answer - lastResult) <= 1)
      )
    );
    
    // Mettre à jour l'historique
    setRecentQuestions(prev => {
      const updated = [...prev, question];
      return updated.slice(-8); // Garder les 8 dernières
    });
    setLastResult(answer);
    
    return {
      question,
      answer,
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
        setTimeLeft(5);
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
  const startTimeChallenge = (level: 1 | 2 | 3 | 4) => {
    setChallengeLevel(level);
    setGameMode('time-challenge');
    
    setTimeScore(0);
    setDifficultyLevel(1);
    setTimePerQuestion(15);
    setQuestionsAnswered(0);
    setQuestionsInCurrentLevel(0);
    setChallengeActive(true);
    setCurrentQuestion(generateChallengeQuestion(1));
    setTimeLeft(15);
    setIsTimerRunning(false);
    
    const levelNames = {
      1: 'Facile - jusqu\'à 10',
      2: 'Moyen - jusqu\'à 20', 
      3: 'Difficile - jusqu\'à 100',
      4: 'King of Addition - mix ultime jusqu\'à 100'
    };
    
    speak(`Défi du temps niveau ${levelNames[level]} ! Les questions vont devenir de plus en plus difficiles. Prêt ? C'est parti !`, 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 3000);
  };

  // Fonction pour calculer le temps par niveau (COMMUNE à toutes les difficultés)
  const getTimeForLevel = (level: number) => {
    // Démarrage à 15s, -1s par niveau jusqu'à 2s
    const time = 16 - level; // Niveau 1 = 15s, Niveau 2 = 14s, ..., Niveau 14 = 2s
    return Math.max(time, 2); // Minimum 2 secondes
  };

  // Fonction pour déterminer combien de questions par niveau (COMMUNE à toutes les difficultés)
  const getQuestionsPerLevel = (level: number) => {
    const timeLimit = getTimeForLevel(level);
    
    if (timeLimit === 2) return 5;      // 2 secondes : 5 questions
    if (timeLimit === 3 || timeLimit === 4) return 2;  // 3s et 4s : 2 questions
    return 1;                           // Autres niveaux : 1 question
  };

  const generateChallengeQuestion = (level: number) => {
    let num1, num2;
    
    // Utilise challengeLevel pour définir les limites, et level pour la progression de difficulté
    let maxNum;
    if (challengeLevel === 1) {
      maxNum = 10; // Facile: jusqu'à 10
    } else if (challengeLevel === 2) {
      maxNum = 20; // Moyen: jusqu'à 20  
    } else if (challengeLevel === 3) {
      maxNum = 100; // Difficile: jusqu'à 100
    } else {
      maxNum = 100; // King of Addition: mix ultime jusqu'à 100
    }
    
    // Progression selon le niveau dans le défi
    if (level <= 3) {
      // Niveaux 1-3: nombres plus petits
      const limit = Math.min(maxNum, challengeLevel === 1 ? 5 : challengeLevel === 2 ? 10 : 30);
      num1 = Math.floor(Math.random() * limit) + 1;
      num2 = Math.floor(Math.random() * limit) + 1;
    } else if (level <= 6) {
      // Niveaux 4-6: nombres moyens
      const limit = Math.min(maxNum, challengeLevel === 1 ? 8 : challengeLevel === 2 ? 15 : 50);
      num1 = Math.floor(Math.random() * limit) + 1;
      num2 = Math.floor(Math.random() * limit) + 1;
    } else if (level <= 10) {
      // Niveaux 7-10: nombres plus grands
      const limit = Math.min(maxNum, challengeLevel === 1 ? 10 : challengeLevel === 2 ? 20 : 75);
      num1 = Math.floor(Math.random() * limit) + 1;
      num2 = Math.floor(Math.random() * limit) + 1;
    } else {
      // Niveaux 11+: utilise toute la gamme
      if (challengeLevel === 4) {
        // King of Addition: stratégies avancées
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 30) + 20;
            num2 = Math.floor(Math.random() * 30) + 20;
          },
          () => {
            const base = Math.floor(Math.random() * 20) + 5;
            num1 = base;
            num2 = base;
          },
          () => {
            num1 = Math.floor(Math.random() * 40) + 15;
            num2 = Math.floor(Math.random() * 40) + 15;
            if (num1 + num2 > 100) {
              num1 = Math.floor(num1 / 2);
              num2 = Math.floor(num2 / 2);
            }
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else {
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        if (num1 + num2 > maxNum) {
          num1 = Math.floor(num1 / 2);
          num2 = Math.floor(num2 / 2);
        }
      }
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
      
      // Incrémenter le nombre de questions réussies dans ce niveau
      const newQuestionsInLevel = questionsInCurrentLevel + 1;
      setQuestionsInCurrentLevel(newQuestionsInLevel);
      
      const questionsNeeded = getQuestionsPerLevel(difficultyLevel);
      
      // Vérifier si on doit passer au niveau suivant
      if (newQuestionsInLevel >= questionsNeeded) {
        // Passer au niveau suivant
        const newLevel = difficultyLevel + 1;
        setDifficultyLevel(newLevel);
        setQuestionsInCurrentLevel(0);
        const newTimeLimit = getTimeForLevel(newLevel);
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
        // Rester au même niveau, prochaine question
        const currentTimeLimit = getTimeForLevel(difficultyLevel);
        setTimeout(() => {
          setCurrentQuestion(generateChallengeQuestion(difficultyLevel));
          setUserAnswer('');
          setTimeLeft(currentTimeLimit);
          setTimeout(() => {
            setIsTimerRunning(true);
          }, 1000);
        }, 1500);
      }
      
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

  // Mode entraînement libre avec niveaux
  const startTraining = (level: 1 | 2 | 3 | 4 = 1) => {
    setTrainingLevel(level);
    setGameMode('training');
    setCorrectAnswers(0);
    setTotalQuestions(0);
    
    // Générer la première question après avoir défini le niveau
    setTimeout(() => {
      setCurrentQuestion(generateTrainingQuestion());
      setQuestionStartTime(Date.now()); // Démarrer le chrono
    }, 100);
    
    const levelNames = {
      1: 'facile - additions jusqu\'à 10',
      2: 'moyen - additions jusqu\'à 20', 
      3: 'difficile - additions jusqu\'à 100',
      4: 'King of Addition - mix ultime jusqu\'à 100'
    };
    
    speak(`Mode entraînement ${levelNames[level]} ! Prends ton temps pour t'améliorer sans pression.`);
  };

  const handleTrainingAnswer = () => {
    const answer = parseInt(userAnswer);
    const responseTime = questionStartTime ? Date.now() - questionStartTime : 0;
    
    if (answer === currentQuestion.answer) {
      speak('CORRECT', 'victory');
      
      // XP et pièces seulement pour les 15 premières bonnes réponses
      if (correctAnswers < 15) {
        setPlayerXP(playerXP + 5);
        setPlayerCoins(playerCoins + 2);
      }
      
      // Mettre à jour les statistiques pour les bonnes réponses
      setTrainingStats(prev => {
        const current = prev[trainingLevel];
        const newCorrectAnswers = current.correctAnswers + 1;
        const newTotalTime = current.totalTime + responseTime;
        const newAverageTime = newTotalTime / newCorrectAnswers;
        const newTotalQuestions = current.totalQuestions + 1;
        const newPercentage = (newCorrectAnswers / newTotalQuestions) * 100;
        
        // Les records ne se déclenchent qu'à partir de la 10ème bonne réponse
        const shouldUpdateRecords = newCorrectAnswers >= 10;
        
        // Détecter les nouveaux records
        let newSpeedRecord = false;
        let newAccuracyRecord = false;
        
        if (shouldUpdateRecords) {
          // Nouveau record de vitesse
          if (newAverageTime < current.bestAverageTime) {
            newSpeedRecord = true;
            setRecordType('speed');
            setRecordValue(`${(newAverageTime / 1000).toFixed(1)}s`);
            setShowRecordAnimation(true);
            
            // Masquer l'animation après 4 secondes
            setTimeout(() => setShowRecordAnimation(false), 4000);
          }
          
          // Nouveau record de précision
          if (newPercentage > current.bestPercentage) {
            newAccuracyRecord = true;
            if (!newSpeedRecord) { // Si pas déjà un record de vitesse
              setRecordType('accuracy');
              setRecordValue(`${Math.round(newPercentage)}%`);
              setShowRecordAnimation(true);
              
              setTimeout(() => setShowRecordAnimation(false), 4000);
            }
          }
        }
        
        return {
          ...prev,
          [trainingLevel]: {
            ...current,
            correctAnswers: newCorrectAnswers,
            totalQuestions: newTotalQuestions,
            totalTime: newTotalTime,
            averageTime: newAverageTime,
            bestPercentage: shouldUpdateRecords ? Math.max(current.bestPercentage, newPercentage) : current.bestPercentage,
            bestAverageTime: shouldUpdateRecords ? Math.min(current.bestAverageTime, newAverageTime) : current.bestAverageTime
          }
        };
      });
      
      setCorrectAnswers(prev => prev + 1);
      setTotalQuestions(prev => prev + 1);
      
      // Nouvelle question très rapide pour les bonnes réponses (mode endless)
      setTimeout(() => {
        setCurrentQuestion(generateTrainingQuestion());
        setUserAnswer('');
        setQuestionStartTime(Date.now()); // Redémarrer le chrono
      }, 400);
    } else {
      setShowCorrectAnswer(true);
      speak(`Non, c'était ${currentQuestion.answer}. Continue !`, 'normal');
      
      // Mettre à jour les statistiques pour les mauvaises réponses
      setTrainingStats(prev => {
        const current = prev[trainingLevel];
        const newTotalQuestions = current.totalQuestions + 1;
        const newPercentage = (current.correctAnswers / newTotalQuestions) * 100;
        
        // Les records ne se déclenchent qu'à partir de la 10ème bonne réponse
        const shouldUpdateRecords = current.correctAnswers >= 10;
        
        return {
          ...prev,
          [trainingLevel]: {
            ...current,
            totalQuestions: newTotalQuestions,
            bestPercentage: shouldUpdateRecords ? Math.max(current.bestPercentage, newPercentage) : current.bestPercentage
          }
        };
      });
      
      setTimeout(() => {
        setShowCorrectAnswer(false);
      }, 3000);
      
      setTotalQuestions(prev => prev + 1);
      
      // Délai plus long pour les mauvaises réponses (laisser le temps de lire)
      setTimeout(() => {
        setCurrentQuestion(generateTrainingQuestion());
        setUserAnswer('');
        setQuestionStartTime(Date.now()); // Redémarrer le chrono
      }, 3500);
    }
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

      {/* En-tête simplifié */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-purple-500 relative z-10">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Link 
                href="/chapitre/cp-calcul-mental"
                className="flex items-center px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] border border-gray-600"
                title="Retour au calcul mental CP"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Retour</span>
                <span className="sm:hidden">CP</span>
              </Link>
              
              <div className="flex-1">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  <span className="hidden sm:inline">🏆 L'Arène des Additions</span>
                  <span className="sm:hidden">➕ Additions</span>
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm hidden sm:block">Défie les Boss de la famille !</p>
              </div>
            </div>

            {/* Stats du joueur */}
            <div className="flex items-center space-x-2 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-center text-xs sm:text-sm">
                <div className="text-yellow-400 font-bold text-xs sm:text-base">{playerTitle}</div>
                <div className="text-xs text-gray-300">XP: {playerXP}</div>
              </div>
              <div className="text-center text-xs sm:text-sm">
                <div className="text-yellow-400 font-bold text-xs sm:text-base">💰 {playerCoins}</div>
                <div className="text-xs text-gray-300">Pièces</div>
              </div>
              <div className="text-center text-xs sm:text-sm">
                <div className="text-red-400 font-bold text-xs sm:text-base">🔥 {maxCombo}</div>
                <div className="text-xs text-gray-300">Record</div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-green-600' : 'bg-gray-600'} min-w-[44px] min-h-[44px]`}
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        
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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {/* Mode entraînement */}
              <div 
                onClick={() => setGameMode('training-select')}
                className={`bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-green-400 group min-h-[120px] sm:min-h-[140px] ${
                  currentHighlight === 'training' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">🏃‍♂️</div>
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Entraînement</h3>
                  <p className="text-green-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
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
                className={`bg-gradient-to-br from-red-600 to-purple-700 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-red-400 group min-h-[120px] sm:min-h-[140px] ${
                  currentHighlight === 'boss' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-pulse">⚔️</div>
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Combat Boss</h3>
                  <p className="text-red-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
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
                onClick={() => setGameMode('duel-select')}
                className={`bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-blue-400 group min-h-[120px] sm:min-h-[140px] ${
                  currentHighlight === 'duel' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">👥</div>
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Duel 2 Joueurs</h3>
                  <p className="text-blue-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
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
                onClick={() => setGameMode('challenge-select')}
                className={`bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-yellow-400 group min-h-[120px] sm:min-h-[140px] ${
                  currentHighlight === 'challenge' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-spin">⏱️</div>
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Défi Temps</h3>
                  <p className="text-yellow-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Course au score !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Record</span>
                  </div>
                </div>
              </div>

              {/* Légende Numérique - Option à débloquer */}
              <div 
                onClick={() => {
                  if (playerCoins >= legendCost && !isLegendUnlocked) {
                    setPlayerCoins(playerCoins - legendCost);
                    setIsLegendUnlocked(true);
                    setShowLegendAnimation(true);
                  }
                }}
                className={`relative rounded-xl p-6 shadow-2xl border-2 transition-all duration-300 group ${
                  isLegendUnlocked 
                    ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-yellow-200 cursor-default animate-pulse shadow-yellow-400/50 shadow-2xl' 
                    : playerCoins >= legendCost 
                      ? 'bg-gradient-to-br from-yellow-600/80 via-orange-600/80 to-red-600/80 border-yellow-400 cursor-pointer hover:scale-105 hover:shadow-yellow-400/60 animate-pulse shadow-yellow-400/30 shadow-xl' 
                      : 'bg-gradient-to-br from-yellow-700/60 via-orange-700/60 to-red-700/60 border-yellow-500/70 cursor-not-allowed animate-pulse shadow-yellow-400/20 shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className={`text-5xl mb-3 ${isLegendUnlocked ? 'animate-pulse' : 'animate-pulse'}`}>
                    👑
                  </div>
                  <h3 className={`text-xl font-bold mb-2 animate-pulse ${
                    isLegendUnlocked 
                      ? 'bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent drop-shadow-lg' 
                      : 'text-yellow-100 drop-shadow-md'
                  }`}>
                    Légende Numérique
                  </h3>
                  <p className={`mb-3 text-sm animate-pulse ${
                    isLegendUnlocked 
                      ? 'text-yellow-50' 
                      : 'text-yellow-200'
                  }`}>
                    {isLegendUnlocked ? 'Maîtrise accomplie !' : 'Ultime consécration'}
                  </p>
                  
                  {!isLegendUnlocked && (
                    <div className="flex justify-center items-center space-x-2 text-sm">
                      <div className={`animate-pulse font-bold text-lg ${playerCoins >= legendCost ? 'text-yellow-200 drop-shadow-lg' : 'text-yellow-300 drop-shadow-md'}`}>
                        💰 {legendCost}
                      </div>
                    </div>
                  )}
                  
                  {isLegendUnlocked && (
                    <div className="flex justify-center space-x-1 text-sm animate-pulse">
                      <Crown className="w-4 h-4 text-yellow-100 drop-shadow-lg" />
                      <span className="text-yellow-50 font-bold drop-shadow-lg">Débloqué</span>
                    </div>
                  )}
                </div>
                
                {/* Effet de rayonnement lumineux permanent */}
                {!isLegendUnlocked && (
                  <div className="absolute inset-0 rounded-xl animate-pulse">
                    <div className={`absolute inset-0 rounded-xl ${
                      playerCoins >= legendCost 
                        ? 'bg-gradient-to-r from-yellow-300/40 via-orange-400/40 to-red-400/40' 
                        : 'bg-gradient-to-r from-yellow-400/25 via-orange-500/25 to-red-500/25'
                    }`}></div>
                  </div>
                )}
                
                {/* Effet de halo doré supplémentaire */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 rounded-xl blur-sm animate-pulse"></div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {levels.map((level) => (
                <div 
                  key={level.id}
                  onClick={() => startBossFight(level.id)}
                  className={`bg-gradient-to-br ${level.color} rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-white border-opacity-20 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]`}
                >
                  <div className="text-center text-white">
                    <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">{level.icon}</div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">{level.name}</h3>
                    <div className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">{level.difficulty}</div>
                    <p className="text-xs sm:text-sm opacity-75 mb-2 sm:mb-4 hidden sm:block">{level.description}</p>
                    
                    {/* Boss info */}
                    <div className="bg-black bg-opacity-30 rounded-lg p-2 sm:p-3 md:p-4 mb-2 sm:mb-4 hidden sm:block">
                      <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">{level.boss.avatar}</div>
                      <div className="text-xs sm:text-sm md:text-base font-bold">{level.boss.name}</div>
                      <div className="text-xs sm:text-sm opacity-75">HP: {level.boss.hp}</div>
                    </div>

                    {/* Détails du niveau */}
                    <div className="space-y-1 text-xs sm:text-sm hidden sm:block">
                      <div className="flex justify-between">
                        <span>Temps:</span>
                        <span>{level.timeLimit}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span>{level.questionCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max:</span>
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

        {/* Sélection niveau d'entraînement */}
        {gameMode === 'training-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🏃‍♂️ Choisis ton niveau d'entraînement</h2>
              <p className="text-gray-300">Sélectionne la difficulté qui te convient !</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Entraînement Facile */}
              <div 
                onClick={() => startTraining(1)}
                className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-green-400 group min-h-[160px] sm:min-h-[200px] md:min-h-[240px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🌱</div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Facile</h3>
                  <p className="text-green-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 10
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Débutant</span>
                  </div>
                  <div className="text-xs sm:text-sm text-green-200 hidden sm:block">
                    Parfait pour commencer !
                  </div>
                  {/* Stats niveau 1 */}
                  <div className="mt-4 pt-4 border-t border-green-400">
                    <div className="text-xs text-green-200 space-y-1">
                      <div>📊 Précision: {trainingStats[1].totalQuestions > 0 ? `${Math.round((trainingStats[1].correctAnswers / trainingStats[1].totalQuestions) * 100)}%` : 'N/A'}</div>
                      <div>⚡ Temps moyen: {trainingStats[1].correctAnswers > 0 ? `${(trainingStats[1].averageTime / 1000).toFixed(1)}s` : 'N/A'}</div>
                      <div className="text-yellow-300 font-bold">
                        {trainingStats[1].correctAnswers >= 10 ? (
                          <>🏆 Records: {trainingStats[1].bestPercentage > 0 ? `${Math.round(trainingStats[1].bestPercentage)}%` : 'N/A'} | {trainingStats[1].bestAverageTime < Infinity ? `${(trainingStats[1].bestAverageTime / 1000).toFixed(1)}s` : 'N/A'}</>
                        ) : (
                          <>⏳ Fais au moins 10 réponses pour battre ton record !</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Entraînement Moyen */}
              <div 
                onClick={() => startTraining(2)}
                className="bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-orange-400 group min-h-[160px] sm:min-h-[200px] md:min-h-[240px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🔥</div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Moyen</h3>
                  <p className="text-orange-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 20
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Intermédiaire</span>
                  </div>
                  <div className="text-xs sm:text-sm text-orange-200 hidden sm:block">
                    Un bon challenge !
                  </div>
                  {/* Stats niveau 2 */}
                  <div className="mt-4 pt-4 border-t border-orange-400">
                    <div className="text-xs text-orange-200 space-y-1">
                      <div>📊 Précision: {trainingStats[2].totalQuestions > 0 ? `${Math.round((trainingStats[2].correctAnswers / trainingStats[2].totalQuestions) * 100)}%` : 'N/A'}</div>
                      <div>⚡ Temps moyen: {trainingStats[2].correctAnswers > 0 ? `${(trainingStats[2].averageTime / 1000).toFixed(1)}s` : 'N/A'}</div>
                      <div className="text-yellow-300 font-bold">
                        {trainingStats[2].correctAnswers >= 10 ? (
                          <>🏆 Records: {trainingStats[2].bestPercentage > 0 ? `${Math.round(trainingStats[2].bestPercentage)}%` : 'N/A'} | {trainingStats[2].bestAverageTime < Infinity ? `${(trainingStats[2].bestAverageTime / 1000).toFixed(1)}s` : 'N/A'}</>
                        ) : (
                          <>⏳ Fais au moins 10 réponses pour battre ton record !</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Entraînement Difficile */}
              <div 
                onClick={() => startTraining(3)}
                className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-purple-400 group min-h-[160px] sm:min-h-[200px] md:min-h-[240px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🔥</div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Difficile</h3>
                  <p className="text-purple-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 100
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Expert</span>
                  </div>
                  <div className="text-xs sm:text-sm text-purple-200 hidden sm:block">
                    Pour les champions !
                  </div>
                  {/* Stats niveau 3 */}
                  <div className="mt-4 pt-4 border-t border-purple-400">
                    <div className="text-xs text-purple-200 space-y-1">
                      <div>📊 Précision: {trainingStats[3].totalQuestions > 0 ? `${Math.round((trainingStats[3].correctAnswers / trainingStats[3].totalQuestions) * 100)}%` : 'N/A'}</div>
                      <div>⚡ Temps moyen: {trainingStats[3].correctAnswers > 0 ? `${(trainingStats[3].averageTime / 1000).toFixed(1)}s` : 'N/A'}</div>
                      <div className="text-yellow-300 font-bold">
                        {trainingStats[3].correctAnswers >= 10 ? (
                          <>🏆 Records: {trainingStats[3].bestPercentage > 0 ? `${Math.round(trainingStats[3].bestPercentage)}%` : 'N/A'} | {trainingStats[3].bestAverageTime < Infinity ? `${(trainingStats[3].bestAverageTime / 1000).toFixed(1)}s` : 'N/A'}</>
                        ) : (
                          <>⏳ Fais au moins 10 réponses pour battre ton record !</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Entraînement King of Addition */}
              <div 
                onClick={() => startTraining(4)}
                className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-yellow-400 group relative overflow-hidden min-h-[160px] sm:min-h-[200px] md:min-h-[240px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-500/20 animate-pulse"></div>
                <div className="relative text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">👑</div>
                  <h3 className="text-sm sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                    <span className="hidden sm:inline">King of Addition</span>
                    <span className="sm:hidden">King</span>
                  </h3>
                  <p className="text-yellow-100 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-base md:text-lg font-semibold hidden sm:block">
                    Mix ultime jusqu'à 100
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                    <span className="text-yellow-200">
                      <span className="hidden sm:inline">Maître Suprême</span>
                      <span className="sm:hidden">Maître</span>
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-200 hidden sm:block">
                    Seuls les rois osent !
                  </div>
                  {/* Stats niveau 4 */}
                  <div className="mt-4 pt-4 border-t border-yellow-400">
                    <div className="text-xs text-yellow-200 space-y-1">
                      <div>📊 Précision: {trainingStats[4].totalQuestions > 0 ? `${Math.round((trainingStats[4].correctAnswers / trainingStats[4].totalQuestions) * 100)}%` : 'N/A'}</div>
                      <div>⚡ Temps moyen: {trainingStats[4].correctAnswers > 0 ? `${(trainingStats[4].averageTime / 1000).toFixed(1)}s` : 'N/A'}</div>
                      <div className="text-yellow-300 font-bold">
                        {trainingStats[4].correctAnswers >= 10 ? (
                          <>🏆 Records: {trainingStats[4].bestPercentage > 0 ? `${Math.round(trainingStats[4].bestPercentage)}%` : 'N/A'} | {trainingStats[4].bestAverageTime < Infinity ? `${(trainingStats[4].bestAverageTime / 1000).toFixed(1)}s` : 'N/A'}</>
                        ) : (
                          <>⏳ Fais au moins 10 réponses pour devenir Roi !</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

        {/* Sélection niveau défi temps */}
        {gameMode === 'challenge-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">⏱️ Choisis ton niveau de défi temps</h2>
              <p className="text-gray-300">Sélectionne la difficulté pour ta course contre la montre !</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
              {/* Défi Facile */}
              <div 
                onClick={() => startTimeChallenge(1)}
                className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-green-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🌱</div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Facile</h3>
                  <p className="text-green-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 10
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>15-5s</span>
                  </div>
                  <div className="text-xs sm:text-sm text-green-200 hidden sm:block">
                    Parfait pour débuter !
                  </div>
                </div>
              </div>

              {/* Défi Moyen */}
              <div 
                onClick={() => startTimeChallenge(2)}
                className="bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-orange-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🔥</div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Moyen</h3>
                  <p className="text-orange-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 20
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Temps décroissant</span>
                  </div>
                  <div className="text-xs sm:text-sm text-orange-200 hidden sm:block">
                    Un bon challenge !
                  </div>
                </div>
              </div>

              {/* Défi Difficile */}
              <div 
                onClick={() => startTimeChallenge(3)}
                className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-purple-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">💎</div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Difficile</h3>
                  <p className="text-purple-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 100
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Jusqu'à 2s</span>
                  </div>
                  <div className="text-xs sm:text-sm text-purple-200 hidden sm:block">
                    Pour les experts !
                  </div>
                </div>
              </div>

              {/* Défi King of Addition */}
              <div 
                onClick={() => startTimeChallenge(4)}
                className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-lg p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-yellow-400 group relative overflow-hidden min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-500/20 animate-pulse"></div>
                <div className="relative text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">👑</div>
                  <h3 className="text-sm sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
                    <span className="hidden sm:inline">King of Addition</span>
                    <span className="sm:hidden">King</span>
                  </h3>
                  <p className="text-yellow-100 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-base md:text-lg font-semibold hidden sm:block">
                    Mix ultime jusqu'à 100
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span className="text-yellow-200">
                      <span className="hidden sm:inline">Défi Légendaire</span>
                      <span className="sm:hidden">Légendaire</span>
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-200 font-bold hidden sm:block">
                    🏆 Ultimate Speed Challenge
                  </div>
                </div>
              </div>
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

        {/* Sélection niveau duel */}
        {gameMode === 'duel-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">👥 Choisis ton niveau de duel</h2>
              <p className="text-gray-300 mb-6">
                Sélectionne la difficulté pour affronter ton adversaire !
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
              {/* Duel Facile */}
              <div 
                onClick={() => startDuel2Players(1)}
                className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-green-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🌱</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Facile</h3>
                  <p className="text-green-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 10
                  </p>
                  <div className="flex justify-center space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Débutant</span>
                  </div>
                  <div className="text-xs sm:text-sm text-green-200 hidden sm:block">
                    Parfait pour commencer !
                  </div>
                </div>
              </div>

              {/* Duel Moyen */}
              <div 
                onClick={() => startDuel2Players(2)}
                className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-blue-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🔥</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Moyen</h3>
                  <p className="text-blue-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 20
                  </p>
                  <div className="flex justify-center space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Intermédiaire</span>
                  </div>
                  <div className="text-xs sm:text-sm text-blue-200 hidden sm:block">
                    Challenge équilibré !
                  </div>
                </div>
              </div>

              {/* Duel Difficile */}
              <div 
                onClick={() => startDuel2Players(3)}
                className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-purple-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🔥</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Difficile</h3>
                  <p className="text-purple-100 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Additions jusqu'à 100
                  </p>
                  <div className="flex justify-center space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Expert</span>
                  </div>
                  <div className="text-xs sm:text-sm text-purple-200 hidden sm:block">
                    Pour les champions !
                  </div>
                </div>
              </div>

              {/* Duel King of Addition */}
              <div 
                onClick={() => startDuel2Players(4)}
                className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-yellow-400 group relative overflow-hidden min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-500/20 animate-pulse"></div>
                <div className="relative text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">👑</div>
                  <h3 className="text-sm sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                    <span className="hidden sm:inline">King of Addition</span>
                    <span className="sm:hidden">King</span>
                  </h3>
                  <p className="text-yellow-100 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-base md:text-lg font-semibold hidden sm:block">
                    Mix ultime jusqu'à 100
                  </p>
                  <div className="flex justify-center space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                    <span className="text-yellow-200">
                      <span className="hidden sm:inline">Maître Suprême</span>
                      <span className="sm:hidden">Maître</span>
                    </span>
                  </div>
                  <div className="text-sm text-yellow-200">
                    Seuls les rois osent !
                  </div>
                </div>
              </div>
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
              <h2 className="text-3xl font-bold mb-4">
                {trainingLevel === 1 ? '🌱' : trainingLevel === 2 ? '🔥' : trainingLevel === 3 ? '🔥' : '👑'} Mode Entraînement {trainingLevel === 1 ? 'Facile' : trainingLevel === 2 ? 'Moyen' : trainingLevel === 3 ? 'Difficile' : 'King of Addition'}
              </h2>
              <p className="text-gray-300">
                {trainingLevel === 1 ? 'Additions jusqu\'à 10 - Prends ton temps !' : 
                 trainingLevel === 2 ? 'Additions jusqu\'à 20 - Challenge intermédiaire !' :
                 trainingLevel === 3 ? 'Additions jusqu\'à 100 - Défi expert !' :
                 'Mix ultime jusqu\'à 100 - Seuls les rois osent !'}
              </p>
              <div className="mt-4 text-lg">
                <span className="text-green-400">✅ {correctAnswers}</span> / <span className="text-gray-400">{totalQuestions} questions</span>
                {totalQuestions > 0 && (
                  <span className="text-blue-400 ml-4">
                    📊 {Math.round((correctAnswers / totalQuestions) * 100)}%
                  </span>
                )}
              </div>
              
              {/* Indicateur XP */}
              <div className="mt-3 text-sm">
                {correctAnswers < 15 ? (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full">
                    ⚡ XP : {15 - correctAnswers} réponses restantes
                  </span>
                ) : (
                  <span className="bg-gray-600 text-white px-3 py-1 rounded-full">
                    🎯 Mode Entraînement Libre - Plus d'XP
                  </span>
                )}
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-4 sm:p-8 text-center shadow-2xl">
                {!showCorrectAnswer ? (
                  <>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white animate-pulse">
                      {currentQuestion?.question} = ?
                    </div>
                    
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTrainingAnswer()}
                      className="text-center text-2xl sm:text-3xl font-bold border-2 border-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-lg min-h-[60px]"
                      placeholder="?"
                      autoFocus
                    />
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <button
                        onClick={handleTrainingAnswer}
                        className="bg-white text-green-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                      >
                        ✅ Valider
                      </button>
                      <button
                        onClick={() => setGameMode('arena')}
                        className="bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-lg min-h-[56px] touch-manipulation"
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
            
            {/* Statistiques simplifiées en bas */}
            {correctAnswers > 0 && (
              <div className="max-w-2xl mx-auto mt-6">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-3 border border-gray-600">
                  <div className="text-center text-sm">
                    <div className="text-blue-400 mb-2">
                      ⚡ Temps moyen: <span className="text-white font-bold">{(trainingStats[trainingLevel].averageTime / 1000).toFixed(1)}s</span>
                    </div>
                    
                    {trainingStats[trainingLevel].correctAnswers >= 10 ? (
                      <div className="text-yellow-400">
                        🏆 Record: <span className="text-white font-bold">
                          {trainingStats[trainingLevel].bestAverageTime < Infinity ? `${(trainingStats[trainingLevel].bestAverageTime / 1000).toFixed(1)}s` : 'N/A'}
                        </span>
                      </div>
                    ) : (
                      <div className="text-orange-300 text-xs">
                        Records disponibles à partir de 10 réponses correctes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Combat contre le boss */}
        {gameMode === 'boss-fight' && (
          <div className="space-y-6">
            {/* Barres de vie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
              {/* Joueur */}
              <div className="bg-blue-800 rounded-lg p-3 sm:p-4 border border-blue-400">
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
              <div className="bg-red-800 rounded-lg p-3 sm:p-4 border border-red-400">
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
            <div className={`bg-gradient-to-br ${levels[currentLevel - 1].bgColor} rounded-xl p-4 sm:p-8 text-center shadow-2xl border border-purple-400`}>
              
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
                  <div className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 animate-pulse">
                    {currentQuestion?.question} = ?
                  </div>
                  
                  <input
                    ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
                    className="text-center text-2xl sm:text-3xl md:text-4xl font-bold border-4 border-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 w-32 sm:w-40 md:w-48 text-gray-800 bg-white shadow-xl min-h-[60px]"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={handleAnswer}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-lg font-bold hover:scale-105 transition-all text-lg sm:text-2xl shadow-xl min-h-[56px] min-w-[120px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">⚔️ ATTAQUER !</span>
                      <span className="sm:hidden">⚔️ VALIDER</span>
                    </button>
                  </div>
                </div>
              )}

              {battlePhase === 'result' && showCorrectMessage && (
                <div className="space-y-3">
                  <div className="text-6xl">✅</div>
                  <div className="text-4xl font-bold text-green-600">
                    CORRECT !
                  </div>
                </div>
              )}

              {battlePhase === 'result' && isAttacking && !showCorrectMessage && (
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
              <h2 className="text-2xl font-bold text-center mb-4">
                🏆 Duel Familial - {duelLevel === 1 ? '🌱 Facile' : duelLevel === 2 ? '🔥 Moyen' : duelLevel === 3 ? '🔥 Difficile' : '👑 King of Addition'}
              </h2>
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
                <div className={`bg-gradient-to-br ${currentPlayer === 1 ? 'from-blue-600 to-blue-700' : 'from-cyan-600 to-cyan-700'} rounded-xl p-4 sm:p-8 text-center shadow-2xl text-white`}>
                  <div className="text-sm sm:text-lg mb-2">Au tour du Joueur {currentPlayer}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    <div className={`text-2xl sm:text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-pulse">
                    {currentQuestion?.question} = ?
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleDuelAnswer()}
                    className="text-center text-2xl sm:text-3xl font-bold border-2 border-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-lg min-h-[60px]"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={handleDuelAnswer}
                      className="bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg min-h-[56px] touch-manipulation"
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
              <h2 className="text-2xl font-bold text-center mb-4">
                ⏱️ Défi du Temps - {challengeLevel === 1 ? 'Facile (jusqu\'à 10)' : challengeLevel === 2 ? 'Moyen (jusqu\'à 20)' : challengeLevel === 3 ? 'Difficile (jusqu\'à 100)' : 'King of Addition (mix ultime)'}
              </h2>
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
                  <div className="text-lg mb-2">
                    Niveau {difficultyLevel} - Question {questionsInCurrentLevel + 1}/{getQuestionsPerLevel(difficultyLevel)}
                  </div>
                  
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
                      onClick={() => setGameMode('challenge-select')}
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

      {/* Animation de Nouveau Record */}
      {showRecordAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative">
            {/* Feux d'artifice en arrière-plan */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    recordType === 'speed' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                </div>
              ))}
            </div>
            
            {/* Contenu principal */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-center shadow-2xl border-4 border-yellow-400 animate-pulse relative overflow-hidden max-w-md mx-4">
              {/* Effet brillant */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-bounce"></div>
              
              {/* Icône principale */}
              <div className="text-8xl mb-4 animate-bounce">
                {recordType === 'speed' ? '⚡' : '🎯'}
              </div>
              
              {/* Titre principal */}
              <div className="text-3xl font-bold text-white mb-2 animate-pulse">
                🏆 NOUVEAU RECORD ! 🏆
              </div>
              
              {/* Type de record */}
              <div className="text-xl font-bold text-yellow-200 mb-4">
                {recordType === 'speed' ? '⚡ VITESSE ÉCLAIR ⚡' : '🎯 PRÉCISION PARFAITE 🎯'}
              </div>
              
              {/* Valeur du record */}
              <div className="text-5xl font-bold text-yellow-400 mb-4 animate-bounce">
                {recordValue}
              </div>
              
              {/* Messages motivants */}
              <div className="text-lg text-white mb-4">
                {recordType === 'speed' ? (
                  <div>
                    <div className="mb-2">🚀 Tu deviens un ninja du calcul !</div>
                    <div className="text-yellow-200">Plus rapide que jamais !</div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-2">🎯 Précision de maître !</div>
                    <div className="text-yellow-200">Tu vises dans le mille !</div>
                  </div>
                )}
              </div>
              
              {/* Étoiles scintillantes */}
              <div className="flex justify-center space-x-2 text-2xl">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-ping text-yellow-400"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    ⭐
                  </div>
                ))}
              </div>
              
              {/* Badge niveau */}
              <div className="mt-4 bg-black bg-opacity-50 rounded-full px-4 py-2 inline-block">
                <span className="text-sm font-bold text-white">
                  {trainingLevel === 1 ? '🌱 NIVEAU FACILE' : 
                   trainingLevel === 2 ? '🔥 NIVEAU MOYEN' : 
                   '👑 NIVEAU DIFFICILE'}
                </span>
              </div>
              
              {/* Bouton continuer */}
              <div className="mt-6">
                <button
                  onClick={() => setShowRecordAnimation(false)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg border-2 border-green-300"
                >
                  🚀 CONTINUER L'AVENTURE !
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {/* Animation Légende Numérique */}
      {showLegendAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-3xl p-12 text-center max-w-2xl mx-4 shadow-2xl border-4 border-yellow-300 relative overflow-hidden">
            {/* Effet de particules dorées */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="text-8xl mb-6 animate-bounce">👑</div>
              <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-100 to-white bg-clip-text text-transparent">
                ASCENSION LÉGENDAIRE !
              </h1>
              
              <div className="space-y-4 text-xl text-yellow-100 mb-8">
                <p className="animate-pulse">Les additions n'ont plus de mystères pour toi !</p>
                <p className="animate-pulse" style={{animationDelay: '0.5s'}}>Tu as forgé ton esprit dans le feu des calculs.</p>
                <p className="animate-pulse" style={{animationDelay: '1s'}}>Ton talent illumine le royaume des nombres.</p>
              </div>
              
              <div className="text-5xl font-black mb-8 bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400 bg-clip-text text-transparent animate-pulse">
                Tu es devenu... une LÉGENDE NUMÉRIQUE !
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="text-4xl animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                    ⭐
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowLegendAnimation(false)}
                className="bg-gradient-to-r from-yellow-600 to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-xl border-2 border-yellow-300"
              >
                🌟 Continuer mon voyage légendaire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 