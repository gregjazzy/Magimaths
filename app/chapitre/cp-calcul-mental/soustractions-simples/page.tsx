'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Sword, Shield, Star, Trophy, Zap, Heart, Timer, Crown, Target, Volume2, Anchor } from 'lucide-react';

export default function SoustractionsSimples() {
  // États du jeu pirate
  const [gameMode, setGameMode] = useState<'ship' | 'training' | 'training-select' | 'battle' | 'island-select' | 'duel-2players' | 'duel-select' | 'time-challenge' | 'challenge-select'>('ship');
  const [currentIsland, setCurrentIsland] = useState(1);
  const [playerHP, setPlayerHP] = useState(100);
  const [pirateHP, setPirateHP] = useState(100);
  const [treasures, setTreasures] = useState(0);
  const [doubloons, setDoubloons] = useState(0);
  const [pirateRank, setPirateRank] = useState('Mousse');
  
  // États du combat naval
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(12);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [battlePhase, setBattlePhase] = useState<'question' | 'result' | 'pirate-attack' | 'victory' | 'defeat'>('question');
  const [cannonCombo, setCannonCombo] = useState(0);
  const [maxCannonCombo, setMaxCannonCombo] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState(0);
  
  // États des animations maritimes
  const [isFiring, setIsFiring] = useState(false);
  const [isPirateAttacking, setIsPirateAttacking] = useState(false);
  const [damageDealt, setDamageDealt] = useState(0);
  const [damageReceived, setDamageReceived] = useState(0);
  const [showCriticalHit, setShowCriticalHit] = useState(false);
  const [showTreasureRain, setShowTreasureRain] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  // Audio et effets maritimes
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // États pour le mode duel pirates
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [duelPhase, setDuelPhase] = useState<'question' | 'result' | 'final'>('question');

  // États pour le défi temps pirate
  const [timeScore, setTimeScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [challengeQuestionsAnswered, setChallengeQuestionsAnswered] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);

  // États pour la présentation interactive
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [presentationStep, setPresentationStep] = useState(0);

  // Historique des questions pour éviter les répétitions
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<number | null>(null);
  
  // État pour le mode entraînement avec niveaux
  const [trainingLevel, setTrainingLevel] = useState<1 | 2 | 3 | 4>(1);
  
  // État pour le mode duel avec niveaux
  const [duelLevel, setDuelLevel] = useState<1 | 2 | 3 | 4>(1);
  
  // État pour le mode défi temps avec niveaux
  const [challengeLevel, setChallengeLevel] = useState<1 | 2 | 3 | 4>(1);
  
  // États pour la Légende Marine
  const [showLegendAnimation, setShowLegendAnimation] = useState(false);
  const [isLegendUnlocked, setIsLegendUnlocked] = useState(false);
  const legendCost = 1000; // Coût en doublons pour débloquer
  
  // État pour les questions par niveau dans le défi temps
  const [questionsInCurrentLevel, setQuestionsInCurrentLevel] = useState(0);

  // Configuration des îles pirates (niveaux)
  const pirateIslands = [
    {
      id: 1,
      name: "Île des Débutants",
      description: "Premier trimestre CP - Soustractions jusqu'à 10",
      difficulty: "🏴‍☠️ Mousse",
      color: "from-teal-400 to-cyan-500",
      bgColor: "from-teal-100 to-cyan-200",
      icon: "🏝️",
      timeLimit: 15,
      maxNumber: 10,
      questionsToWin: 12,
      boss: {
        name: "Capitaine Papa Barbe",
        avatar: "👨‍🦲",
        hp: 80,
        ship: "🚢",
        attacks: ["Canon d'Eau", "Abordage Doux", "Intimidation Paternelle"],
        phrases: [
          "Ahoy moussaillon ! Calcule bien !",
          "Pas si vite, petit pirate !",
          "Je vais t'apprendre les maths !"
        ]
      }
    },
    {
      id: 2,
      name: "Île du Kraken",
      description: "Premier semestre CP - Soustractions jusqu'à 20",
      difficulty: "🦑 Corsaire",
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-100 to-purple-200",
      icon: "🐙",
      timeLimit: 12,
      maxNumber: 20,
      questionsToWin: 15,
      boss: {
        name: "Dame Maman des Mers",
        avatar: "👩‍🦰",
        hp: 120,
        ship: "⛵",
        attacks: ["Tempête Calculatrice", "Vague de Questions", "Regard Perçant"],
        phrases: [
          "Les mathématiques n'ont plus de secret pour moi !",
          "Tu vas devoir faire mieux que ça !",
          "Attention aux calculs difficiles !"
        ]
      }
    },
    {
      id: 3,
      name: "Île du Trésor Maudit",
      description: "Fin d'année CP - Défis de légende",
      difficulty: "💀 LÉGENDE",
      color: "from-red-400 to-orange-500",
      bgColor: "from-red-100 to-orange-200",
      icon: "💀",
      timeLimit: 8,
      maxNumber: 20,
      questionsToWin: 20,
      boss: {
        name: "Blackbeard Jr. (Grand Frère)",
        avatar: "🧔‍♂️",
        hp: 150,
        ship: "🏴‍☠️",
        attacks: ["Canon Mathématique", "Tempête Infernale", "Malédiction du Calcul"],
        phrases: [
          "Bienvenue dans les eaux dangereuses !",
          "Tu ne vaincras jamais le roi des pirates !",
          "Mes calculs sont plus rapides que tes canons !"
        ]
      }
    }
  ];

  // Générateur de questions de soustraction selon l'île
  const generateQuestion = () => {
    const island = pirateIslands[currentIsland - 1];
    let num1: number = 1;
    let num2: number = 1;
    
    if (island.id === 1) {
      // Île facile : soustractions jusqu'à 10
      num1 = Math.floor(Math.random() * 8) + 3; // 3-10
      num2 = Math.floor(Math.random() * num1) + 1; // 1 à num1
    } else if (island.id === 2) {
      // Île moyenne : soustractions jusqu'à 20
      num1 = Math.floor(Math.random() * 15) + 5; // 5-20
      num2 = Math.floor(Math.random() * num1) + 1; // 1 à num1
    } else {
      // Île légendaire : toutes soustractions
      num1 = Math.floor(Math.random() * 18) + 3; // 3-20
      num2 = Math.floor(Math.random() * num1) + 1; // 1 à num1
    }
    
    return {
      question: `${num1} - ${num2}`,
      answer: num1 - num2,
      num1,
      num2,
      difficulty: island.difficulty
    };
  };

  // Générateur de questions d'entraînement avec anti-répétition
  const generateTrainingQuestion = () => {
    let num1: number = 1;
    let num2: number = 1;
    let question: string;
    let answer: number;
    let attempts = 0;
    const maxAttempts = 50;
    
    do {
      if (trainingLevel === 1) {
        // Facile: soustractions jusqu'à 10
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 6) + 4; // 4-9
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 à num1-1
          },
          () => {
            num1 = Math.floor(Math.random() * 4) + 6; // 6-9
            num2 = Math.floor(Math.random() * 4) + 1; // 1-4
          },
          () => {
            num1 = 10;
            num2 = Math.floor(Math.random() * 5) + 1; // 1-5
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else if (trainingLevel === 2) {
        // Moyen: soustractions jusqu'à 20
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 10) + 10; // 10-19
            num2 = Math.floor(Math.random() * 9) + 1; // 1-9
          },
          () => {
            num1 = Math.floor(Math.random() * 8) + 12; // 12-19
            num2 = Math.floor(Math.random() * (num1 - 10)) + 1; // garder résultat > 10
          },
          () => {
            num1 = 20;
            num2 = Math.floor(Math.random() * 10) + 1; // 1-10
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else {
        // King of Subtraction: mix ultime CP
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 11) + 10; // 10-20
            num2 = Math.floor(Math.random() * 8) + 1; // 1-8
          },
          () => {
            num1 = Math.floor(Math.random() * 6) + 15; // 15-20
            num2 = Math.floor(Math.random() * 10) + 3; // 3-12
          },
          () => {
            // Soustractions avec résultat rond - max 20
            num1 = 20; // toujours 20 (le maximum autorisé)
            num2 = Math.floor(Math.random() * 8) + 1; // 1-8
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      }
      
      // S'assurer que num1 > num2 (pas de résultats négatifs en CP), mais num1 ≤ 20
      if (num1 <= num2) {
        num1 = Math.min(20, num2 + Math.floor(Math.random() * 5) + 1);
      }
      
      // S'assurer que num1 ne dépasse jamais 20
      if (num1 > 20) {
        num1 = 20;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      }
      
      question = `${num1} - ${num2}`;
      answer = num1 - num2;
      attempts++;
      
    } while (
      attempts < maxAttempts && (
        recentQuestions.includes(question) ||
        (lastResult !== null && Math.abs(answer - lastResult) <= 1) ||
        answer > (trainingLevel === 1 ? 9 : 19) ||
        answer < 1 // Éviter les résultats négatifs ou nuls
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
      num2
    };
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

  // Générateur de questions pour le défi temps
  const generateChallengeQuestion = (level: number) => {
    let num1: number = 1;
    let num2: number = 1;
    
    // Utilise challengeLevel pour définir les limites, et level pour la progression de difficulté
    let maxNum;
    if (challengeLevel === 1) {
      maxNum = 10; // Facile: jusqu'à 10
    } else if (challengeLevel === 2) {
      maxNum = 20; // Moyen: jusqu'à 20  
    } else {
      maxNum = 20; // King of Subtraction: mix ultime CP
    }
    
    // Progression selon le niveau dans le défi
    if (level <= 3) {
      // Niveaux 1-3: nombres plus petits
      const limit = Math.min(maxNum, challengeLevel === 1 ? 6 : 12);
      num1 = Math.floor(Math.random() * limit) + (challengeLevel === 1 ? 3 : 5);
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    } else if (level <= 6) {
      // Niveaux 4-6: nombres moyens - max 20
      const limit = Math.min(maxNum, challengeLevel === 1 ? 8 : 16);
      num1 = Math.floor(Math.random() * limit) + (challengeLevel === 1 ? 4 : 6);
      num2 = Math.floor(Math.random() * (num1 - 2)) + 1;
    } else if (level <= 10) {
      // Niveaux 7-10: nombres plus grands - max 20
      const limit = Math.min(maxNum, challengeLevel === 1 ? 10 : 20);
      num1 = Math.floor(Math.random() * limit) + (challengeLevel === 1 ? 5 : 8);
      num2 = Math.floor(Math.random() * (num1 - 3)) + 1;
    } else {
      // Niveaux 11+: utilise toute la gamme
      if (challengeLevel === 4) {
        // King of Subtraction: stratégies avancées - max 20
        const strategies = [
          () => {
            num1 = Math.floor(Math.random() * 6) + 15; // 15-20
            num2 = Math.floor(Math.random() * 8) + 1; // 1-8
          },
          () => {
            num1 = 20; // toujours 20 (maximum autorisé)
            num2 = Math.floor(Math.random() * 12) + 1; // 1-12
          },
          () => {
            num1 = Math.floor(Math.random() * 11) + 10; // 10-20
            num2 = Math.floor(Math.random() * 6) + 1; // 1-6
          }
        ];
        strategies[Math.floor(Math.random() * strategies.length)]();
      } else {
        num1 = Math.floor(Math.random() * maxNum) + 5;
        num2 = Math.floor(Math.random() * (num1 - 3)) + 1;
      }
    }
    
    // S'assurer que num1 > num2 et résultat > 0, mais num1 ≤ 20
    if (num1 <= num2) {
      num1 = Math.min(20, num2 + Math.floor(Math.random() * 5) + 1);
    }
    
    // S'assurer que num1 ne dépasse jamais 20
    if (num1 > 20) {
      num1 = 20;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    }
    
    return {
      question: `${num1} - ${num2}`,
      answer: num1 - num2,
      num1,
      num2,
      level
    };
  };

  // Fonction audio pirate
  const speak = (text: string, type: 'normal' | 'victory' | 'cannon' | 'defeat' = 'normal') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    
    // Adaptation de la voix selon le type pirate
    switch (type) {
      case 'victory':
        utterance.rate = 0.9;
        utterance.pitch = 1.4;
        break;
      case 'cannon':
        utterance.rate = 1.2;
        utterance.pitch = 1.0;
        break;
      case 'defeat':
        utterance.rate = 0.6;
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

  // Timer avec effet de vague
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
        speak(`Temps écoulé pour le Pirate ${currentPlayer} !`, 'normal');
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
            
            speak(`Au tour du Pirate ${nextPlayer} !`, 'normal');
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

  // Démarrer une bataille navale
  const startNavalBattle = (islandId: number) => {
    setCurrentIsland(islandId);
    setGameMode('battle');
    setPlayerHP(100);
    setPirateHP(pirateIslands[islandId - 1].boss.hp);
    setCannonCombo(0);
    setQuestionsAnswered(0);
    setTreasuresFound(0);
    setBattlePhase('question');
    setCurrentQuestion(generateQuestion());
    setTimeLeft(pirateIslands[islandId - 1].timeLimit);
    setIsTimerRunning(false); // Le timer ne démarre pas tout de suite
    
    const island = pirateIslands[islandId - 1];
    
    // Créer l'utterance avec callback pour démarrer le timer après
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Ahoy ! Tu navigues vers ${island.name}. Prépare tes canons contre ${island.boss.name} ! ${island.boss.phrases[0]} Le combat naval commence maintenant !`);
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

  // Gestion des tirs de canon (réponses)
  const fireCannon = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setQuestionsAnswered(prev => prev + 1);
    
    if (answer === currentQuestion.answer) {
      handleSuccessfulShot();
    } else {
      handleMissedShot();
    }
  };

  const handleSuccessfulShot = () => {
    setIsFiring(true);
    setTreasuresFound(prev => prev + 1);
    
    // Calcul des dégâts avec bonus pirate
    const baseDamage = 18;
    const speedBonus = timeLeft > Math.floor(pirateIslands[currentIsland - 1].timeLimit * 0.7) ? 12 : 0;
    const comboBonus = cannonCombo * 4;
    const damage = baseDamage + speedBonus + comboBonus;
    
    const isCriticalHit = speedBonus > 0 || cannonCombo > 2;
    
    setDamageDealt(damage);
    setShowCriticalHit(isCriticalHit);
    setPirateHP(Math.max(0, pirateHP - damage));
    setCannonCombo(cannonCombo + 1);
    setMaxCannonCombo(Math.max(maxCannonCombo, cannonCombo + 1));
    setTreasures(treasures + (isCriticalHit ? 20 : 12));
    setDoubloons(doubloons + (isCriticalHit ? 10 : 6));
    
    setBattlePhase('result');
    speak(isCriticalHit ? 'CANON CRITIQUE ! Dans le mille, moussaillon !' : 'Excellent tir ! En plein dans la coque !', 'victory');
    
    setTimeout(() => {
      setIsFiring(false);
      setShowCriticalHit(false);
      
      if (pirateHP - damage <= 0) {
        handleVictory();
      } else if (questionsAnswered >= pirateIslands[currentIsland - 1].questionsToWin) {
        // Combat terminé par nombre de questions
        if (treasuresFound / questionsAnswered >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouvelle question (pas de contre-attaque après un bon tir)
        setCurrentQuestion(generateQuestion());
        setUserAnswer('');
        setTimeLeft(pirateIslands[currentIsland - 1].timeLimit);
        setBattlePhase('question');
        // Petit délai pour que l'élève lise la nouvelle question
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleMissedShot = () => {
    setCannonCombo(0);
    setShowCorrectAnswer(true);
    setBattlePhase('result');
    speak(`Canon à l'eau ! La bonne réponse était ${currentQuestion.answer}, moussaillon !`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handlePirateCounterAttack();
    }, 3500);
  };

  const handleTimeOut = () => {
    setCannonCombo(0);
    setShowCorrectAnswer(true);
    setBattlePhase('result');
    speak(`Trop lent à recharger ! La réponse était ${currentQuestion.answer}. Le pirate en profite pour attaquer !`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handlePirateCounterAttack();
    }, 3500);
  };

  const handlePirateCounterAttack = () => {
    setIsPirateAttacking(true);
    setBattlePhase('pirate-attack');
    
    const island = pirateIslands[currentIsland - 1];
    const damage = Math.floor(Math.random() * 30) + 20;
    setDamageReceived(damage);
    setPlayerHP(Math.max(0, playerHP - damage));
    
    const attack = island.boss.attacks[Math.floor(Math.random() * island.boss.attacks.length)];
    speak(`${island.boss.name} utilise ${attack} !`, 'cannon');
    
    setTimeout(() => {
      setIsPirateAttacking(false);
      
      if (playerHP - damage <= 0) {
        handleDefeat();
      } else if (questionsAnswered >= island.questionsToWin) {
        // Combat terminé par nombre de questions
        if (treasuresFound / questionsAnswered >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouvelle question
        setCurrentQuestion(generateQuestion());
        setUserAnswer('');
        setTimeLeft(island.timeLimit);
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
    setShowTreasureRain(true);
    const bonusTreasures = 150 + (cannonCombo * 15);
    const bonusDoubloons = 75 + (treasuresFound * 8);
    setTreasures(treasures + bonusTreasures);
    setDoubloons(doubloons + bonusDoubloons);
    
    // Mise à jour du rang pirate
    if (currentIsland === 3) {
      setPirateRank('Légende des Sept Mers');
    } else if (currentIsland === 2) {
      setPirateRank('Capitaine Redoutable');
    }
    
    speak('VICTOIRE NAVALE ! Tu es maintenant le maître des mers ! Ton trésor déborde !', 'victory');
    
    setTimeout(() => setShowTreasureRain(false), 6000);
  };

  const handleDefeat = () => {
    setBattlePhase('defeat');
    speak('Ton navire coule... Mais un vrai pirate ne renonce jamais ! Répare ton bateau et reviens !', 'defeat');
  };

  const resetShip = () => {
    setGameMode('ship');
    setPlayerHP(100);
    setPirateHP(100);
    setCannonCombo(0);
    setUserAnswer('');
    setIsTimerRunning(false);
    setQuestionsAnswered(0);
    setTreasuresFound(0);
  };

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore-soustractions');
    const savedTreasures = localStorage.getItem('treasures-soustractions');
    const savedDoubloons = localStorage.getItem('doubloons-soustractions');
    const savedRank = localStorage.getItem('pirateRank-soustractions');
    const savedMaxCombo = localStorage.getItem('maxCannonCombo-soustractions');
    
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    if (savedTreasures) {
      setTreasures(parseInt(savedTreasures));
    }
    if (savedDoubloons) {
      setDoubloons(parseInt(savedDoubloons));
    }
    if (savedRank) {
      setPirateRank(savedRank);
    }
    if (savedMaxCombo) {
      setMaxCannonCombo(parseInt(savedMaxCombo));
    }
  }, []);

  // Mode duel 2 pirates
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
    
    speak('Duel de pirates ! Pirate 1 contre Pirate 2. Que le meilleur flibustier gagne ! Pirate 1, à toi !', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
  };

  const generateDuelQuestion = () => {
    // Questions adaptées selon le niveau de duel choisi - max 20
    let num1, num2;
    
    if (duelLevel === 1) {
      // Facile: soustractions jusqu'à 10
      num1 = Math.floor(Math.random() * 8) + 3; // 3-10
      num2 = Math.floor(Math.random() * num1) + 1; // 1 à num1
    } else if (duelLevel === 2) {
      // Moyen: soustractions jusqu'à 15
      num1 = Math.floor(Math.random() * 11) + 5; // 5-15
      num2 = Math.floor(Math.random() * num1) + 1; // 1 à num1
    } else {
      // King of Subtraction: mix avancé CP
      num1 = Math.floor(Math.random() * 16) + 5; // 5-20
      num2 = Math.floor(Math.random() * num1) + 1; // 1 à num1
    }
    
    return {
      question: `${num1} - ${num2}`,
      answer: num1 - num2,
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
        speak('Doubloon pour le Pirate 1 !', 'victory');
      } else {
        setPlayer2Score(prev => prev + 1);
        speak('Doubloon pour le Pirate 2 !', 'victory');
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
        // Changer de pirate
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setCurrentQuestion(generateDuelQuestion());
        setUserAnswer('');
        setTimeLeft(10);
        setDuelPhase('question');
        
        speak(`Au tour du Pirate ${nextPlayer} !`, 'normal');
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
      speak('Victoire du Pirate 1 ! Le trésor est à toi !', 'victory');
    } else if (player2Score > player1Score) {
      setPlayer2Wins(prev => prev + 1);
      speak('Victoire du Pirate 2 ! Tu es le roi des mers !', 'victory');
    } else {
      speak('Match nul ! Vous partagez le trésor !', 'normal');
    }
  };

  // Mode défi temps pirate
  const startTimeChallenge = () => {
    setGameMode('time-challenge');
    setTimeScore(0);
    setDifficultyLevel(1);
    setTimePerQuestion(15);
    setChallengeQuestionsAnswered(0);
    setChallengeActive(true);
    setCurrentQuestion(generateChallengeQuestion(1));
    setTimeLeft(15);
    setIsTimerRunning(false);
    
    speak('Défi des Sept Mers ! Les soustractions vont devenir de plus en plus corsées. Prêt moussaillon ?', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 3000);
  };



  const handleChallengeAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setChallengeQuestionsAnswered(prev => prev + 1);
    
    if (answer === currentQuestion.answer) {
      // Calculer le score basé sur rapidité et difficulté
      const timeBonus = Math.max(0, timeLeft * 10);
      const difficultyBonus = difficultyLevel * 50;
      const points = 100 + timeBonus + difficultyBonus;
      
      setTimeScore(prev => prev + points);
      speak('Excellent ! Doubloons gagnés !', 'victory');
      
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
      localStorage.setItem('bestScore-soustractions', timeScore.toString());
      speak(`Nouveau record pirate ! ${timeScore} doubloons ! Tu es un vrai capitaine !`, 'victory');
    } else {
      speak(`Défi terminé ! Score: ${timeScore} doubloons. Record à battre: ${bestScore}`, 'normal');
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

  // Présentation interactive des modes
  const startInteractivePresentation = () => {
    stopAllVocalsAndAnimations();
    stopSignalRef.current = false;
    setShowPresentation(true);
    setPresentationStep(0);
    setCurrentHighlight('');
    
    speak('Ahoy matelot ! Bienvenue à bord ! Je vais te présenter tous les modes de jeu disponibles sur ce navire pirate !', 'normal');
    
    setTimeout(() => {
      presentModes();
    }, 4000);
  };

  const presentModes = async () => {
    const steps = [
      { highlight: 'training', text: 'D\'abord, la Mer Calme ! Ici tu peux t\'entraîner au tir de canon sans danger !' },
      { highlight: 'boss', text: 'Ensuite, les Îles Hostiles ! Affronte Papa Pirate, Maman Pirate, ou ton Frère Pirate en combat naval !' },
      { highlight: 'duel', text: 'Puis le Duel de Pirates ! Défie un membre de ta famille en duel à 10 questions !' },
      { highlight: 'challenge', text: 'Et enfin, le Défi des Sept Mers ! Une course contre la montre avec des questions de plus en plus difficiles !' },
      { highlight: '', text: 'Alors moussaillon, quel mode choisiras-tu pour commencer ton aventure pirate ?' }
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

  // Mode entraînement en mer calme
  const startTraining = () => {
    setGameMode('training');
    setCurrentQuestion(generateQuestion());
    speak('Entraînement en mer calme ! Perfectionne ton tir de canon sans pression !');
  };

  const handleTrainingShot = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === currentQuestion.answer) {
      speak('Parfait ! Ton canon est bien réglé !', 'victory');
      setTreasures(treasures + 8);
      setDoubloons(doubloons + 4);
      setTreasuresFound(prev => prev + 1);
    } else {
      setShowCorrectAnswer(true);
      speak(`Canon à l'eau ! C'était ${currentQuestion.answer}, continue l'entraînement !`, 'normal');
      setTimeout(() => {
        setShowCorrectAnswer(false);
      }, 3000);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    
    // Nouvelle question après un délai
    setTimeout(() => {
      setCurrentQuestion(generateQuestion());
      setUserAnswer('');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900 text-white relative overflow-hidden">
      {/* Vagues animées en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-pulse opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Pluie de trésors pour la victoire */}
      {showTreasureRain && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {['💰', '💎', '🏴‍☠️', '⚓'][Math.floor(Math.random() * 4)]}
            </div>
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
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  <span className="hidden sm:inline">⚓ L'Odyssée des Soustractions</span>
                  <span className="sm:hidden">➖ Soustractions</span>
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm hidden sm:block">Conquiers les Sept Mers avec tes canons mathématiques !</p>
              </div>
            </div>

            {/* Stats du joueur */}
            <div className="flex items-center space-x-2 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-center text-xs sm:text-sm">
                <div className="text-cyan-400 font-bold text-xs sm:text-base">{pirateRank}</div>
                <div className="text-xs text-gray-300">XP: {treasures}</div>
              </div>
              <div className="text-center text-xs sm:text-sm">
                <div className="text-yellow-400 font-bold text-xs sm:text-base">💰 {doubloons}</div>
                <div className="text-xs text-gray-300">Pièces</div>
              </div>
              <div className="text-center text-xs sm:text-sm">
                <div className="text-red-400 font-bold text-xs sm:text-base">🔥 {maxCannonCombo}</div>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Pont du navire principal */}
        {gameMode === 'ship' && (
          <div className="space-y-4 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                <span className="hidden sm:inline">⚓ Bienvenue à bord, Moussaillon !</span>
                <span className="sm:hidden">⚓ Ahoy Moussaillon !</span>
              </h2>
              <p className="text-sm sm:text-xl text-gray-300 mb-3 sm:mb-6 px-2">
                <span className="hidden sm:inline">Choisis ta destination et pars à l'aventure sur les mers des soustractions !</span>
                <span className="sm:hidden">Choisis ton aventure maritime !</span>
              </p>
              
              {/* Bouton d'accueil interactif */}
              <div className="mb-4 sm:mb-8">
                <button
                  onClick={startInteractivePresentation}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-xl shadow-xl hover:scale-110 transition-all duration-300 animate-pulse border-2 sm:border-4 border-yellow-300"
                >
                  <span className="hidden sm:inline">🗺️ Découvrir les Modes de Jeu !</span>
                  <span className="sm:hidden">🗺️ Découvrir</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {/* Entraînement en mer calme */}
              <div 
                onClick={() => setGameMode('training-select')}
                className={`bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl min-h-[120px] sm:min-h-[140px] p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-cyan-400 group ${
                  currentHighlight === 'training' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">🌊</div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Mer Calme</h3>
                  <p className="text-cyan-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Sans danger !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Anchor className="w-4 h-4" />
                    <span>Tranquille</span>
                  </div>
                </div>
              </div>

              {/* Navigation vers les îles hostiles */}
              <div 
                onClick={() => setGameMode('island-select')}
                className={`bg-gradient-to-br from-red-600 to-orange-700 rounded-xl min-h-[120px] sm:min-h-[140px] p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-red-400 group ${
                  currentHighlight === 'boss' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-pulse">🏴‍☠️</div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Îles Hostiles</h3>
                  <p className="text-red-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Pirates légendaires !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Sword className="w-4 h-4" />
                    <span>Épique</span>
                  </div>
                </div>
              </div>

              {/* Mode duel 2 pirates */}
              <div 
                onClick={() => setGameMode('duel-select')}
                className={`bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl min-h-[120px] sm:min-h-[140px] p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-blue-400 group ${
                  currentHighlight === 'duel' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">⚔️</div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Duel Pirates</h3>
                  <p className="text-blue-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Combat familial !
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
                className={`bg-gradient-to-br from-yellow-600 to-amber-700 rounded-xl min-h-[120px] sm:min-h-[140px] p-3 sm:p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-yellow-400 group ${
                  currentHighlight === 'challenge' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:animate-spin">⏰</div>
                  <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Défi Mers</h3>
                  <p className="text-yellow-100 mb-2 sm:mb-3 text-xs sm:text-sm hidden sm:block">
                    Course doubloons !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Record</span>
                  </div>
                </div>
              </div>

              {/* Légende Marine - Option à débloquer */}
              <div 
                onClick={() => {
                  if (doubloons >= legendCost && !isLegendUnlocked) {
                    setDoubloons(doubloons - legendCost);
                    setIsLegendUnlocked(true);
                    setShowLegendAnimation(true);
                  }
                }}
                className={`relative rounded-xl p-6 shadow-xl border-2 transition-all duration-300 group ${
                  isLegendUnlocked 
                    ? 'bg-gradient-to-br from-cyan-300 via-teal-400 to-blue-600 border-cyan-200 cursor-default animate-pulse shadow-cyan-400/50 shadow-xl' 
                    : doubloons >= legendCost 
                      ? 'bg-gradient-to-br from-cyan-600/80 via-teal-600/80 to-blue-600/80 border-cyan-400 cursor-pointer hover:scale-105 hover:shadow-cyan-400/60 animate-pulse shadow-cyan-400/30 shadow-xl' 
                      : 'bg-gradient-to-br from-cyan-700/60 via-teal-700/60 to-blue-700/60 border-cyan-500/70 cursor-not-allowed animate-pulse shadow-cyan-400/20 shadow-lg'
                }`}
              >
                <div className="text-center">
                  <div className={`text-5xl mb-3 animate-pulse`}>
                    🔱
                  </div>
                  <h3 className={`text-xl font-bold mb-2 animate-pulse ${
                    isLegendUnlocked 
                      ? 'bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent drop-shadow-lg' 
                      : 'text-cyan-100 drop-shadow-md'
                  }`}>
                    Légende Marine
                  </h3>
                  <p className={`mb-3 text-sm animate-pulse ${
                    isLegendUnlocked 
                      ? 'text-cyan-50' 
                      : 'text-cyan-200'
                  }`}>
                    {isLegendUnlocked ? 'Maîtrise des océans !' : 'Royaume des abysses'}
                  </p>
                  
                  {!isLegendUnlocked && (
                    <div className="flex justify-center items-center space-x-2 text-sm">
                      <div className={`animate-pulse font-bold text-lg ${doubloons >= legendCost ? 'text-cyan-200 drop-shadow-lg' : 'text-cyan-300 drop-shadow-md'}`}>
                        🪙 {legendCost}
                      </div>
                    </div>
                  )}
                  
                  {isLegendUnlocked && (
                    <div className="flex justify-center space-x-1 text-sm animate-pulse">
                      <Crown className="w-4 h-4 text-cyan-100 drop-shadow-lg" />
                      <span className="text-cyan-50 font-bold drop-shadow-lg">Débloqué</span>
                    </div>
                  )}
                </div>
                
                {/* Effet de rayonnement lumineux permanent */}
                {!isLegendUnlocked && (
                  <div className="absolute inset-0 rounded-xl animate-pulse">
                    <div className={`absolute inset-0 rounded-xl ${
                      doubloons >= legendCost 
                        ? 'bg-gradient-to-r from-cyan-300/40 via-teal-400/40 to-blue-400/40' 
                        : 'bg-gradient-to-r from-cyan-400/25 via-teal-500/25 to-blue-500/25'
                    }`}></div>
                  </div>
                )}
                
                {/* Effet de halo marin supplémentaire */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/10 via-teal-400/10 to-cyan-400/10 rounded-xl blur-sm animate-pulse"></div>
              </div>
            </div>

            {/* Code des pirates */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-xl p-6 border border-purple-400">
              <h3 className="text-xl font-bold mb-4 text-center">🏴‍☠️ Code des Pirates Mathématiques</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">💥</div>
                  <div className="font-bold">Tir Rapide</div>
                  <div className="text-gray-300">Plus tu tires vite, plus tes canons font mal !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💥</div>
                  <div className="font-bold">Combo Canon</div>
                  <div className="text-gray-300">Enchaîne les tirs pour des dégâts massifs !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-bold">Butins</div>
                  <div className="text-gray-300">Gagne trésors et doublons en combattant !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⚓</div>
                  <div className="font-bold">Rang Pirate</div>
                  <div className="text-gray-300">Gravite les échelons jusqu'à devenir légende !</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sélection des îles hostiles */}
        {gameMode === 'island-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🗺️ Choisis ton Île de Destination</h2>
              <p className="text-gray-300">Chaque île cache un pirate légendaire à défier !</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {pirateIslands.map((island) => (
                <div 
                  key={island.id}
                  onClick={() => startNavalBattle(island.id)}
                  className={`bg-gradient-to-br ${island.color} rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-white border-opacity-20 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]`}
                >
                  <div className="text-center text-white">
                    <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 group-hover:animate-bounce">{island.icon}</div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{island.name}</h3>
                    <div className="text-xs sm:text-sm opacity-90 mb-1 sm:mb-2">{island.difficulty}</div>
                    <p className="text-xs sm:text-sm opacity-75 mb-3 sm:mb-4 hidden sm:block">{island.description}</p>
                    
                    {/* Boss pirate info */}
                    <div className="bg-black bg-opacity-40 rounded-lg p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 hidden sm:block">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{island.boss.avatar}</div>
                      <div className="font-bold text-sm sm:text-base">{island.boss.name}</div>
                      <div className="text-xs sm:text-sm opacity-75">Navire: {island.boss.ship}</div>
                      <div className="text-xs sm:text-sm opacity-75">HP: {island.boss.hp}</div>
                    </div>

                    {/* Détails de navigation */}
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span>Temps de tir:</span>
                        <span>{island.timeLimit}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Combats:</span>
                        <span>{island.questionsToWin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nombres max:</span>
                        <span>{island.maxNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('ship')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                ⚓ Retour au navire
              </button>
            </div>
          </div>
        )}

        {/* Sélection niveau d'entraînement */}
        {gameMode === 'training-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🌊 Choisis tes eaux d'entraînement</h2>
              <p className="text-gray-300">Sélectionne la profondeur qui te convient !</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-6xl mx-auto">
              {/* Entraînement Facile */}
              <div 
                onClick={() => { 
                  setTrainingLevel(1); 
                  setGameMode('training');
                  setCurrentQuestion(generateTrainingQuestion());
                  setUserAnswer('');
                  setTreasuresFound(0);
                  setQuestionsAnswered(0);
                  setShowCorrectAnswer(false);
                }}
                className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-cyan-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐠</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Eaux Calmes</h3>
                  <p className="text-cyan-100 mb-2 sm:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Soustractions jusqu'à 10
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Anchor className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Débutant</span>
                  </div>
                  <div className="text-xs sm:text-sm text-cyan-200 hidden sm:block">
                    Parfait pour débuter !
                  </div>
                </div>
              </div>

              {/* Entraînement Moyen */}
              <div 
                onClick={() => { 
                  setTrainingLevel(2); 
                  setGameMode('training');
                  setCurrentQuestion(generateTrainingQuestion());
                  setUserAnswer('');
                  setTreasuresFound(0);
                  setQuestionsAnswered(0);
                  setShowCorrectAnswer(false);
                }}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-blue-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐟</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Eaux Profondes</h3>
                  <p className="text-blue-100 mb-2 sm:mb-4 text-sm sm:text-base md:text-lg hidden sm:block">
                    Soustractions jusqu'à 20
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Intermédiaire</span>
                  </div>
                  <div className="text-xs sm:text-sm text-blue-200 hidden sm:block">
                    Un bon défi !
                  </div>
                </div>
              </div>

              {/* Entraînement King of Subtraction */}
              <div 
                onClick={() => { 
                  setTrainingLevel(4); 
                  setGameMode('training');
                  setCurrentQuestion(generateTrainingQuestion());
                  setUserAnswer('');
                  setTreasuresFound(0);
                  setQuestionsAnswered(0);
                  setShowCorrectAnswer(false);
                }}
                className="bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-cyan-400 group relative overflow-hidden min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse"></div>
                <div className="relative text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐋</div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                    <span className="hidden sm:inline">Roi des Abysses</span>
                    <span className="sm:hidden">Roi</span>
                  </h3>
                  <p className="text-cyan-100 mb-2 sm:mb-4 text-sm sm:text-base md:text-lg font-semibold hidden sm:block">
                    Mix ultime CP
                  </p>
                  <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-2 sm:mb-4">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                    <span className="text-cyan-200 hidden sm:inline">Légende Marine</span>
                    <span className="text-cyan-200 sm:hidden">Légende</span>
                  </div>
                  <div className="text-xs sm:text-sm text-cyan-200 font-bold hidden sm:block">
                    🔱 Maître des Océans
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('ship')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                ⚓ Retour au navire
              </button>
            </div>
          </div>
        )}

        {/* Sélection niveau défi temps */}
        {gameMode === 'challenge-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">⏱️ Choisis ton défi des mers</h2>
              <p className="text-gray-300">Sélectionne la difficulté pour ta navigation contre le temps !</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-6xl mx-auto">
              {/* Défi Facile */}
              <div 
                onClick={() => { 
                  setChallengeLevel(1); 
                  setGameMode('time-challenge');
                  setTimeScore(0);
                  setChallengeQuestionsAnswered(0);
                  setChallengeActive(true);
                  setCurrentQuestion(generateChallengeQuestion(1));
                  setUserAnswer('');
                  setTimeLeft(15);
                  setIsTimerRunning(true);
                }}
                className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-cyan-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐠</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Eaux Calmes</h3>
                  <p className="text-cyan-100 mb-4 text-lg">
                    Soustractions jusqu'à 10
                  </p>
                  <div className="flex justify-center space-x-2 text-sm mb-4">
                    <Timer className="w-4 h-4" />
                    <span>15-5s progression</span>
                  </div>
                  <div className="text-sm text-cyan-200">
                    Navigation tranquille !
                  </div>
                </div>
              </div>

              {/* Défi Moyen */}
              <div 
                onClick={() => { 
                  setChallengeLevel(2); 
                  setGameMode('time-challenge');
                  setTimeScore(0);
                  setChallengeQuestionsAnswered(0);
                  setChallengeActive(true);
                  setCurrentQuestion(generateChallengeQuestion(1));
                  setUserAnswer('');
                  setTimeLeft(12);
                  setIsTimerRunning(true);
                }}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-blue-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐟</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Eaux Profondes</h3>
                  <p className="text-blue-100 mb-4 text-lg">
                    Soustractions jusqu'à 20
                  </p>
                  <div className="flex justify-center space-x-2 text-sm mb-4">
                    <Zap className="w-4 h-4" />
                    <span>Temps décroissant</span>
                  </div>
                  <div className="text-sm text-blue-200">
                    Course stimulante !
                  </div>
                </div>
              </div>

              {/* Défi King of Subtraction */}
              <div 
                onClick={() => { 
                  setChallengeLevel(4); 
                  setGameMode('time-challenge');
                  setTimeScore(0);
                  setChallengeQuestionsAnswered(0);
                  setChallengeActive(true);
                  setCurrentQuestion(generateChallengeQuestion(1));
                  setUserAnswer('');
                  setTimeLeft(5);
                  setIsTimerRunning(true);
                }}
                className="bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-cyan-400 group relative overflow-hidden min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse"></div>
                <div className="relative text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐋</div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                    Roi des Abysses
                  </h3>
                  <p className="text-cyan-100 mb-4 text-lg font-semibold">
                    Mix ultime CP
                  </p>
                  <div className="flex justify-center space-x-2 text-sm mb-4">
                    <Crown className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-200">Défi Légendaire</span>
                  </div>
                  <div className="text-sm text-cyan-200 font-bold">
                    🔱 Ultimate Sea Challenge
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('ship')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                ⚓ Retour au navire
              </button>
            </div>
          </div>
        )}

        {/* Sélection niveau duel */}
        {gameMode === 'duel-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">⚔️ Choisis ton niveau de duel pirate</h2>
              <p className="text-gray-300 mb-6">
                Sélectionne la difficulté pour affronter ton adversaire en mer !
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-6xl mx-auto">
              {/* Duel Facile */}
              <div 
                onClick={() => { setDuelLevel(1); startDuel2Players(); }}
                className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-cyan-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐠</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Eaux Calmes</h3>
                  <p className="text-cyan-100 mb-4 text-lg">
                    Soustractions jusqu'à 10
                  </p>
                  <div className="flex justify-center space-x-2 text-sm mb-4">
                    <Anchor className="w-4 h-4" />
                    <span>Débutant</span>
                  </div>
                  <div className="text-sm text-cyan-200">
                    Duel amical !
                  </div>
                </div>
              </div>

              {/* Duel Moyen */}
              <div 
                onClick={() => { setDuelLevel(2); startDuel2Players(); }}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border border-blue-400 group min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐟</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-3">Eaux Profondes</h3>
                  <p className="text-blue-100 mb-4 text-lg">
                    Soustractions jusqu'à 20
                  </p>
                  <div className="flex justify-center space-x-2 text-sm mb-4">
                    <Zap className="w-4 h-4" />
                    <span>Intermédiaire</span>
                  </div>
                  <div className="text-sm text-blue-200">
                    Combat équilibré !
                  </div>
                </div>
              </div>

              {/* Duel King of Subtraction */}
              <div 
                onClick={() => { setDuelLevel(4); startDuel2Players(); }}
                className="bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-600 rounded-xl p-3 sm:p-6 md:p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-xl border-2 border-cyan-400 group relative overflow-hidden min-h-[140px] sm:min-h-[180px] md:min-h-[220px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse"></div>
                <div className="relative text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3 md:mb-4 group-hover:animate-bounce">🐋</div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
                    Roi des Abysses
                  </h3>
                  <p className="text-cyan-100 mb-4 text-lg font-semibold">
                    Mix ultime CP
                  </p>
                  <div className="flex justify-center space-x-2 text-sm mb-4">
                    <Crown className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-200">Légende Marine</span>
                  </div>
                  <div className="text-sm text-cyan-200 font-bold">
                    🔱 Duel Légendaire
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('ship')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                ⚓ Retour au navire
              </button>
            </div>
          </div>
        )}

        {/* Entraînement en mer calme */}
        {gameMode === 'training' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🌊 Entraînement en Mer Calme</h2>
              <p className="text-gray-300">Perfectionne ton tir de canon sans pression !</p>
              <div className="mt-4 text-lg">
                <span className="text-green-400">🎯 {treasuresFound}</span> / <span className="text-gray-400">{questionsAnswered} tirs</span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl p-4 sm:p-8 text-center shadow-xl">
                {!showCorrectAnswer ? (
                  <>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white animate-pulse">
                      {currentQuestion?.question} = ?
                    </div>
                    
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTrainingShot()}
                      className="text-center text-2xl sm:text-3xl font-bold border-2 border-white rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-lg min-h-[60px] touch-manipulation"
                      placeholder="?"
                      autoFocus
                    />
                    
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <button
                        onClick={handleTrainingShot}
                        className="bg-white text-teal-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                      >
                        <span className="hidden sm:inline">💥 Tirer le Canon</span>
                        <span className="sm:hidden">🚢 TIRER</span>
                      </button>
                      <button
                        onClick={() => setGameMode('ship')}
                        className="bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                      >
                        <span className="hidden sm:inline">⚓ Retour au Navire</span>
                        <span className="sm:hidden">⚓ Retour</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-6xl animate-pulse">💣</div>
                    <div className="text-3xl font-bold text-red-200">
                      Canon à l'eau !
                    </div>
                    <div className="bg-red-100 border-4 border-red-300 rounded-xl p-6 text-gray-800">
                      <div className="text-xl font-bold mb-2">🏴‍☠️ La bonne réponse était :</div>
                      <div className="text-5xl font-bold text-red-600 animate-pulse">
                        {currentQuestion?.question} = {currentQuestion?.answer}
                      </div>
                      <div className="text-lg mt-4 text-gray-600">
                        Souviens-toi : {currentQuestion?.num1} - {currentQuestion?.num2} = {currentQuestion?.answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Combat naval contre le pirate boss */}
        {gameMode === 'battle' && (
          <div className="space-y-6">
            {/* Barres de vie des navires */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ton navire */}
              <div className="bg-blue-800 rounded-lg p-4 border border-cyan-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">🚢 Ton Navire</span>
                  <span>{playerHP}/100 HP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${playerHP}%` }}
                  ></div>
                </div>
                {cannonCombo > 0 && (
                  <div className="mt-2 text-center">
                    <span className="bg-orange-500 text-black px-3 py-1 rounded-full font-bold animate-pulse">
                      💥 Combo x{cannonCombo}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-center text-gray-300">
                  Tirs: {questionsAnswered}/{pirateIslands[currentIsland - 1].questionsToWin} | Réussis: {treasuresFound}
                </div>
              </div>

              {/* Navire pirate ennemi */}
              <div className="bg-red-800 rounded-lg p-4 border border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{pirateIslands[currentIsland - 1].boss.ship} {pirateIslands[currentIsland - 1].boss.name}</span>
                  <span>{pirateHP}/{pirateIslands[currentIsland - 1].boss.hp} HP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(pirateHP / pirateIslands[currentIsland - 1].boss.hp) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Zone de combat naval responsive */}
            <div className={`bg-gradient-to-br ${pirateIslands[currentIsland - 1].bgColor} rounded-xl p-4 sm:p-8 text-center shadow-xl border border-cyan-400`}>
              
              {battlePhase === 'question' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Timer avec effet de vague */}
                  <div className="flex justify-center items-center space-x-3 sm:space-x-4">
                    <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                    <div className={`text-2xl sm:text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-orange-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  {/* Question de soustraction responsive */}
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 animate-pulse">
                    {currentQuestion?.question} = ?
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fireCannon()}
                    className="text-center text-2xl sm:text-3xl md:text-4xl font-bold border-4 border-gray-800 rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 md:w-48 text-gray-800 bg-white shadow-xl min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-4 sm:mt-6">
                    <button
                      onClick={fireCannon}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-lg font-bold hover:scale-105 transition-all text-lg sm:text-2xl shadow-xl min-h-[56px] min-w-[120px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">💥 CANON ! FEU !</span>
                      <span className="sm:hidden">🚢 TIRER</span>
                    </button>
                  </div>
                </div>
              )}

              {battlePhase === 'result' && isFiring && (
                <div className="space-y-6">
                  <div className="text-7xl animate-bounce">💥</div>
                  <div className="text-4xl font-bold text-orange-600">
                    {showCriticalHit ? '🎯 TIR CRITIQUE !' : '💥 En plein dans le mille !'}
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts au navire ennemi: <span className="font-bold text-red-600">{damageDealt}</span>
                  </div>
                  {showCriticalHit && (
                    <div className="text-xl text-yellow-600 font-bold animate-pulse">
                      ⭐ COMBO CANON + VITESSE ⭐
                    </div>
                  )}
                </div>
              )}

              {battlePhase === 'result' && showCorrectAnswer && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">💣</div>
                  <div className="text-4xl font-bold text-red-600">
                    Canon à l'eau !
                  </div>
                  <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 text-gray-800">
                    <div className="text-2xl font-bold mb-2">🏴‍☠️ La bonne réponse était :</div>
                    <div className="text-6xl font-bold text-red-600 animate-pulse">
                      {currentQuestion?.question} = {currentQuestion?.answer}
                    </div>
                    <div className="text-lg mt-4 text-gray-600">
                      Souviens-toi : {currentQuestion?.num1} - {currentQuestion?.num2} = {currentQuestion?.answer}
                    </div>
                  </div>
                </div>
              )}

              {battlePhase === 'pirate-attack' && isPirateAttacking && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">{pirateIslands[currentIsland - 1].boss.ship}</div>
                  <div className="text-4xl font-bold text-red-400">
                    Le pirate contre-attaque !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts à ton navire: <span className="font-bold text-red-600">{damageReceived}</span>
                  </div>
                </div>
              )}

              {battlePhase === 'victory' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-bounce">🏴‍☠️</div>
                  <div className="text-4xl font-bold text-yellow-400">
                    VICTOIRE NAVALE !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Tu as coulé le navire de {pirateIslands[currentIsland - 1].boss.name} !
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">🏴‍☠️ Butin de guerre :</div>
                    <div>💰 +{150 + (treasuresFound * 8)} trésors</div>
                    <div>🪙 +{75 + (cannonCombo * 15)} doublons</div>
                    <div>⚓ Nouveau rang pirate débloqué !</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => setGameMode('island-select')}
                      className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl"
                    >
                      🗺️ Nouvelle Île
                    </button>
                    <button
                      onClick={resetShip}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      ⚓ Retour au Port
                    </button>
                  </div>
                </div>
              )}

              {battlePhase === 'defeat' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-pulse">🚢💥</div>
                  <div className="text-4xl font-bold text-red-400">
                    TON NAVIRE COULE...
                  </div>
                  <div className="text-2xl text-gray-800">
                    {pirateIslands[currentIsland - 1].boss.name} a eu ta peau cette fois !
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">⚓ Ton carnet de bord :</div>
                    <div>🎯 Tirs réussis : {treasuresFound}/{questionsAnswered}</div>
                    <div>💥 Meilleur combo : {maxCannonCombo}</div>
                    <div>📊 Précision : {questionsAnswered > 0 ? Math.round((treasuresFound / questionsAnswered) * 100) : 0}%</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => startNavalBattle(currentIsland)}
                      className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-400 transition-colors shadow-xl"
                    >
                      💥 Revanche !
                    </button>
                    <button
                      onClick={startTraining}
                      className="bg-teal-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-teal-400 transition-colors shadow-xl"
                    >
                      🌊 S'entraîner
                    </button>
                    <button
                      onClick={resetShip}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      ⚓ Retour au Port
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode duel 2 pirates */}
        {gameMode === 'duel-2players' && (
          <div className="space-y-6">
            {/* Tableau de scores pirates responsive */}
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-xl p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-4">⚔️ Duel de Pirates - Soustractions</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className={`p-2 sm:p-4 rounded-lg ${currentPlayer === 1 ? 'bg-blue-600 ring-4 ring-yellow-400' : 'bg-blue-700'}`}>
                  <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🏴‍☠️</div>
                  <div className="font-bold text-sm sm:text-base">Pirate 1</div>
                  <div className="text-lg sm:text-2xl font-bold">{player1Score}</div>
                  <div className="text-xs sm:text-sm">Victoires: {player1Wins}</div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm sm:text-lg font-bold">Questions restantes</div>
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{questionsLeft}</div>
                  </div>
                </div>
                
                <div className={`p-2 sm:p-4 rounded-lg ${currentPlayer === 2 ? 'bg-indigo-600 ring-4 ring-yellow-400' : 'bg-indigo-700'}`}>
                  <div className="text-xl sm:text-3xl mb-1 sm:mb-2">🏴‍☠️</div>
                  <div className="font-bold text-sm sm:text-base">Pirate 2</div>
                  <div className="text-lg sm:text-2xl font-bold">{player2Score}</div>
                  <div className="text-xs sm:text-sm">Victoires: {player2Wins}</div>
                </div>
              </div>
            </div>

            {duelPhase === 'question' && (
              <div className="max-w-2xl mx-auto">
                <div className={`bg-gradient-to-br ${currentPlayer === 1 ? 'from-blue-600 to-blue-700' : 'from-indigo-600 to-indigo-700'} rounded-xl p-4 sm:p-8 text-center shadow-xl text-white`}>
                  <div className="text-sm sm:text-lg mb-2">Au tour du Pirate {currentPlayer}</div>
                  
                  <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
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
                    className="text-center text-2xl sm:text-3xl font-bold border-2 border-white rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-lg min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-4 sm:mt-6">
                    <button
                      onClick={handleDuelAnswer}
                      className="bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">🎯 Tirer Canon !</span>
                      <span className="sm:hidden">🚢 TIRER</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {duelPhase === 'final' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-8 text-center shadow-xl text-white">
                  <div className="text-7xl mb-4">🏆</div>
                  <div className="text-3xl font-bold mb-4">
                    {player1Score > player2Score ? 'Victoire du Pirate 1 !' : 
                     player2Score > player1Score ? 'Victoire du Pirate 2 !' : 
                     'Match Nul !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Score Final</div>
                    <div className="text-2xl">
                      Pirate 1: {player1Score} - Pirate 2: {player2Score}
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
                      onClick={() => setGameMode('ship')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      ⚓ Retour Port
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode défi temps pirate */}
        {gameMode === 'time-challenge' && (
          <div className="space-y-6">
            {/* Tableau de scores temps responsive */}
            <div className="bg-gradient-to-r from-yellow-800 to-amber-800 rounded-xl p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-4">⏰ Défi des Sept Mers - Soustractions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
                <div className="bg-yellow-700 p-2 sm:p-4 rounded-lg">
                  <div className="text-lg sm:text-2xl mb-1">💰</div>
                  <div className="font-bold text-xs sm:text-base">Doubloons</div>
                  <div className="text-lg sm:text-xl font-bold">{timeScore}</div>
                </div>
                
                <div className="bg-amber-700 p-2 sm:p-4 rounded-lg">
                  <div className="text-lg sm:text-2xl mb-1">🏆</div>
                  <div className="font-bold text-xs sm:text-base">Record</div>
                  <div className="text-lg sm:text-xl font-bold">{bestScore}</div>
                </div>
                
                <div className="bg-orange-700 p-2 sm:p-4 rounded-lg">
                  <div className="text-lg sm:text-2xl mb-1">🌊</div>
                  <div className="font-bold text-xs sm:text-base">Niveau Mer</div>
                  <div className="text-lg sm:text-xl font-bold">{difficultyLevel}</div>
                </div>
                
                <div className="bg-red-700 p-2 sm:p-4 rounded-lg">
                  <div className="text-lg sm:text-2xl mb-1">🎯</div>
                  <div className="font-bold text-xs sm:text-base">Tirs</div>
                  <div className="text-lg sm:text-xl font-bold">{challengeQuestionsAnswered}</div>
                </div>
              </div>
            </div>

            {challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-600 to-amber-700 rounded-xl p-4 sm:p-8 text-center shadow-xl text-white">
                  <div className="text-sm sm:text-lg mb-2">Niveau Mer {difficultyLevel}</div>
                  
                  <div className="flex justify-center items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                    <div className={`text-2xl sm:text-3xl font-bold ${timeLeft <= 2 ? 'text-red-300 animate-bounce' : 'text-yellow-300'}`}>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleChallengeAnswer()}
                    className="text-center text-2xl sm:text-3xl font-bold border-2 border-white rounded-lg px-3 sm:px-4 py-3 w-32 sm:w-40 text-gray-800 bg-white shadow-lg min-h-[60px] touch-manipulation"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-4 sm:mt-6">
                    <button
                      onClick={handleChallengeAnswer}
                      className="bg-white text-amber-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg min-h-[56px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">💥 Tirer Canon !</span>
                      <span className="sm:hidden">🚢 TIRER</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-8 text-center shadow-xl text-white">
                  <div className="text-7xl mb-4">⏰</div>
                  <div className="text-3xl font-bold mb-4">
                    {timeScore > bestScore ? 'NOUVEAU RECORD PIRATE !' : 'Aventure Terminée !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Butin Final</div>
                    <div className="text-xl mb-2">Doubloons: {timeScore}</div>
                    <div className="text-lg">Niveau Mer atteint: {difficultyLevel}</div>
                    <div className="text-lg">Tirs réussis: {challengeQuestionsAnswered}</div>
                    {timeScore > bestScore && (
                      <div className="text-yellow-300 font-bold mt-2 animate-pulse">
                        🎉 Record de pirate battu ! 🎉
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
                      onClick={() => setGameMode('ship')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      ⚓ Retour Port
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animation Légende Marine */}
      {showLegendAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 rounded-3xl p-12 text-center max-w-2xl mx-4 shadow-xl border-4 border-cyan-300 relative overflow-hidden">
            {/* Effet de vagues marines */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-pulse"
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
              <div className="text-8xl mb-6 animate-bounce">🔱</div>
              <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                ASCENSION LÉGENDAIRE !
              </h1>
              
              <div className="space-y-4 text-xl text-cyan-100 mb-8">
                <p className="animate-pulse">Les soustractions n'ont plus de secrets pour toi !</p>
                <p className="animate-pulse" style={{animationDelay: '0.5s'}}>Tu as navigué à travers tous les océans mathématiques.</p>
                <p className="animate-pulse" style={{animationDelay: '1s'}}>Ton savoir illumine les profondeurs marines.</p>
              </div>
              
              <div className="text-5xl font-black mb-8 bg-gradient-to-r from-cyan-200 via-teal-300 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Tu es devenu... une LÉGENDE MARINE !
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="text-4xl animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                    🌊
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowLegendAnimation(false)}
                className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-cyan-500 hover:to-teal-600 transition-all duration-300 shadow-xl border-2 border-cyan-300"
              >
                🌊 Continuer ma légende marine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 