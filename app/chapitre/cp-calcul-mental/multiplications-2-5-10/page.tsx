'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Sword, Shield, Star, Trophy, Zap, Heart, Timer, Crown, Target, Volume2, Swords } from 'lucide-react';

export default function Multiplications2_5_10() {
  // États du dojo ninja
  const [gameMode, setGameMode] = useState<'dojo' | 'training' | 'duel' | 'temple-select' | 'duel-2players' | 'time-challenge'>('dojo');
  const [currentTemple, setCurrentTemple] = useState(1);
  const [ninjaEnergy, setNinjaEnergy] = useState(100);
  const [masterEnergy, setMasterEnergy] = useState(100);
  const [honorPoints, setHonorPoints] = useState(0);
  const [katanaShards, setKatanaShards] = useState(0);
  const [ninjaRank, setNinjaRank] = useState('Ninja Débutant');
  
  // États du combat de samouraï
  const [currentKata, setCurrentKata] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [duelPhase, setDuelPhase] = useState<'kata' | 'result' | 'counter-attack' | 'victory' | 'defeat'>('kata');
  const [comboStrike, setComboStrike] = useState(0);
  const [maxComboStrike, setMaxComboStrike] = useState(0);
  const [katasPerformed, setKatasPerformed] = useState(0);
  const [perfectKatas, setPerfectKatas] = useState(0);
  
  // États des animations ninja
  const [isStriking, setIsStriking] = useState(false);
  const [isBlockingAttack, setIsBlockingAttack] = useState(false);
  const [damageDealt, setDamageDealt] = useState(0);
  const [damageReceived, setDamageReceived] = useState(0);
  const [showCriticalStrike, setShowCriticalStrike] = useState(false);
  const [showSakuraStorm, setShowSakuraStorm] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  // Audio et effets ninja
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // États pour le mode duel ninja
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [ninjaDuelPhase, setNinjaDuelPhase] = useState<'question' | 'result' | 'final'>('question');

  // États pour le défi temps ninja
  const [timeScore, setTimeScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [challengeKatas, setChallengeKatas] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);

  // États pour la présentation interactive
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [presentationStep, setPresentationStep] = useState(0);

  // Configuration des temples ninja (niveaux)
  const ninjaTemples = [
    {
      id: 1,
      name: "Temple du Dragon Vert",
      description: "Premier trimestre CP - Tables de 2 et 5",
      difficulty: "🥋 Novice",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-100 to-emerald-200",
      icon: "🐉",
      timeLimit: 15,
      katasToWin: 12,
      tables: [2, 5],
      boss: {
        name: "Maître Papa-San",
        avatar: "👨‍💼",
        energy: 80,
        weapon: "🗡️",
        attacks: ["Coup de Patience", "Défense Paternelle", "Enseignement du Sage"],
        phrases: [
          "Montre-moi ta discipline, jeune ninja !",
          "Les tables de multiplication sont tes armes !",
          "La patience est la force du ninja !"
        ]
      }
    },
    {
      id: 2,
      name: "Temple du Tigre Doré",
      description: "Premier semestre CP - Tables de 2, 5 et 10",
      difficulty: "⚔️ Guerrier",
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-100 to-red-200",
      icon: "🐅",
      timeLimit: 12,
      katasToWin: 15,
      tables: [2, 5, 10],
      boss: {
        name: "Sensei Maman-Sama",
        avatar: "👩‍🏫",
        energy: 120,
        weapon: "🗡️",
        attacks: ["Regard Perçant", "Kata de Vérité", "Technique Maternelle"],
        phrases: [
          "Tes katas doivent être parfaits !",
          "Un vrai ninja ne fait pas d'erreurs !",
          "Concentration maximale, jeune apprenti !"
        ]
      }
    },
    {
      id: 3,
      name: "Temple du Phénix Légendaire",
      description: "Fin d'année CP - Maître des tables",
      difficulty: "🔥 MAÎTRE",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-100 to-pink-200",
      icon: "🔥",
      timeLimit: 8,
      katasToWin: 20,
      tables: [2, 5, 10],
      boss: {
        name: "Shogun Frère Suprême",
        avatar: "🥷",
        energy: 150,
        weapon: "⚔️",
        attacks: ["Technique Éclair", "Tempête de Calculs", "Art Ninja Ultime"],
        phrases: [
          "Tes techniques ninja sont faibles !",
          "Je maîtrise les tables depuis l'enfance !",
          "Aucun apprenti ne peut vaincre le maître !"
        ]
      }
    }
  ];

  // Générateur de katas (questions de tables)
  const generateKata = () => {
    const temple = ninjaTemples[currentTemple - 1];
    const tables = temple.tables;
    const table = tables[Math.floor(Math.random() * tables.length)];
    
    let multiplier;
    if (temple.id === 1) {
      // Temple novice : multiplieurs plus faciles
      multiplier = Math.floor(Math.random() * 5) + 1; // 1-5
    } else if (temple.id === 2) {
      // Temple guerrier : multiplieurs moyens
      multiplier = Math.floor(Math.random() * 8) + 1; // 1-8
    } else {
      // Temple maître : tous multiplieurs
      multiplier = Math.floor(Math.random() * 10) + 1; // 1-10
    }
    
    return {
      question: `${table} × ${multiplier}`,
      answer: table * multiplier,
      table,
      multiplier,
      difficulty: temple.difficulty,
      explanation: `${table} fois ${multiplier} égal ${table * multiplier}`
    };
  };

  // Fonction audio ninja
  const speak = (text: string, type: 'normal' | 'victory' | 'strike' | 'defeat' = 'normal') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    
    // Adaptation de la voix selon le type ninja
    switch (type) {
      case 'victory':
        utterance.rate = 0.9;
        utterance.pitch = 1.3;
        break;
      case 'strike':
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
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

  // Minuteur ninja avec effets
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (duelPhase === 'kata') {
        handleKataTimeout();
      } else if (gameMode === 'duel-2players' && ninjaDuelPhase === 'question') {
        // Timeout en mode duel
        setIsTimerRunning(false);
        speak(`Temps écoulé pour le Ninja ${currentPlayer} !`, 'normal');
        setTimeout(() => {
          const newQuestionsLeft = questionsLeft - 1;
          setQuestionsLeft(newQuestionsLeft);
          
          if (newQuestionsLeft === 0) {
            finishDuel();
          } else {
            const nextPlayer = currentPlayer === 1 ? 2 : 1;
            setCurrentPlayer(nextPlayer);
            setCurrentKata(generateDuelKata());
            setUserAnswer('');
            setTimeLeft(10);
            setNinjaDuelPhase('question');
            
            speak(`Au tour du Ninja ${nextPlayer} !`, 'normal');
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
  }, [timeLeft, isTimerRunning, duelPhase, gameMode, ninjaDuelPhase, challengeActive]);

  // Démarrer un duel de samouraï
  const startNinjaDuel = (templeId: number) => {
    setCurrentTemple(templeId);
    setGameMode('duel');
    setNinjaEnergy(100);
    setMasterEnergy(ninjaTemples[templeId - 1].boss.energy);
    setComboStrike(0);
    setKatasPerformed(0);
    setPerfectKatas(0);
    setDuelPhase('kata');
    setCurrentKata(generateKata());
    setTimeLeft(ninjaTemples[templeId - 1].timeLimit);
    setIsTimerRunning(false); // Le timer ne démarre pas tout de suite
    
    const temple = ninjaTemples[templeId - 1];
    
    // Créer l'utterance avec callback pour démarrer le timer après
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Bienvenue au ${temple.name} ! Tu vas affronter ${temple.boss.name} en duel de samouraï. ${temple.boss.phrases[0]} Le duel ninja commence maintenant !`);
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

  // Exécuter un kata (répondre)
  const executeKata = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setKatasPerformed(prev => prev + 1);
    
    if (answer === currentKata.answer) {
      handlePerfectKata();
    } else {
      handleFailedKata();
    }
  };

  const handlePerfectKata = () => {
    setIsStriking(true);
    setPerfectKatas(prev => prev + 1);
    
    // Calcul des dégâts de katana avec bonus
    const baseDamage = 25;
    const speedBonus = timeLeft > Math.floor(ninjaTemples[currentTemple - 1].timeLimit * 0.6) ? 20 : 0;
    const comboBonus = comboStrike * 8;
    const damage = baseDamage + speedBonus + comboBonus;
    
    const isCriticalStrike = speedBonus > 0 || comboStrike > 2;
    
    setDamageDealt(damage);
    setShowCriticalStrike(isCriticalStrike);
    setMasterEnergy(Math.max(0, masterEnergy - damage));
    setComboStrike(comboStrike + 1);
    setMaxComboStrike(Math.max(maxComboStrike, comboStrike + 1));
    setHonorPoints(honorPoints + (isCriticalStrike ? 35 : 20));
    setKatanaShards(katanaShards + (isCriticalStrike ? 18 : 12));
    
    setDuelPhase('result');
    speak(isCriticalStrike ? 'FRAPPE CRITIQUE ! Kata parfait, jeune maître !' : 'Excellent kata ! Ta technique s\'améliore !', 'victory');
    
    setTimeout(() => {
      setIsStriking(false);
      setShowCriticalStrike(false);
      
      if (masterEnergy - damage <= 0) {
        handleVictory();
      } else if (katasPerformed >= ninjaTemples[currentTemple - 1].katasToWin) {
        // Duel terminé par nombre de katas
        if (perfectKatas / katasPerformed >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouveau kata (pas de contre-attaque après un kata réussi)
        setCurrentKata(generateKata());
        setUserAnswer('');
        setTimeLeft(ninjaTemples[currentTemple - 1].timeLimit);
        setDuelPhase('kata');
        // Petit délai pour que l'élève lise le nouveau kata
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleFailedKata = () => {
    setComboStrike(0);
    setShowCorrectAnswer(true);
    setDuelPhase('result');
    speak(`Kata raté ! La bonne réponse était ${currentKata.answer}. ${currentKata.explanation}`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleMasterCounterAttack();
    }, 3500);
  };

  const handleKataTimeout = () => {
    setComboStrike(0);
    setShowCorrectAnswer(true);
    setDuelPhase('result');
    speak(`Trop lent ! La réponse était ${currentKata.answer}. Un ninja doit être rapide ! Le maître contre-attaque !`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleMasterCounterAttack();
    }, 3500);
  };

  const handleMasterCounterAttack = () => {
    setIsBlockingAttack(true);
    setDuelPhase('counter-attack');
    
    const temple = ninjaTemples[currentTemple - 1];
    const damage = Math.floor(Math.random() * 40) + 30;
    setDamageReceived(damage);
    setNinjaEnergy(Math.max(0, ninjaEnergy - damage));
    
    const attack = temple.boss.attacks[Math.floor(Math.random() * temple.boss.attacks.length)];
    speak(`${temple.boss.name} utilise ${attack} !`, 'strike');
    
    setTimeout(() => {
      setIsBlockingAttack(false);
      
      if (ninjaEnergy - damage <= 0) {
        handleDefeat();
      } else if (katasPerformed >= temple.katasToWin) {
        // Duel terminé par nombre de katas
        if (perfectKatas / katasPerformed >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouveau kata
        setCurrentKata(generateKata());
        setUserAnswer('');
        setTimeLeft(temple.timeLimit);
        setDuelPhase('kata');
        // Petit délai pour que l'élève lise le nouveau kata
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleVictory = () => {
    setDuelPhase('victory');
    setShowSakuraStorm(true);
    const bonusHonor = 300 + (comboStrike * 30);
    const bonusShards = 150 + (perfectKatas * 15);
    setHonorPoints(honorPoints + bonusHonor);
    setKatanaShards(katanaShards + bonusShards);
    
    // Mise à jour du rang ninja
    if (currentTemple === 3) {
      setNinjaRank('Maître Ninja Légendaire');
    } else if (currentTemple === 2) {
      setNinjaRank('Samouraï d\'Élite');
    }
    
    speak('VICTOIRE HONORABLE ! Tu as maîtrisé l\'art du ninja ! Tes tables de multiplication sont parfaites !', 'victory');
    
    setTimeout(() => setShowSakuraStorm(false), 6000);
  };

  const handleDefeat = () => {
    setDuelPhase('defeat');
    speak('Tu as perdu ce combat... Mais un vrai ninja ne renonce jamais ! Entraîne-toi et reviens plus fort !', 'defeat');
  };

  const resetDojo = () => {
    setGameMode('dojo');
    setNinjaEnergy(100);
    setMasterEnergy(100);
    setComboStrike(0);
    setUserAnswer('');
    setIsTimerRunning(false);
    setKatasPerformed(0);
    setPerfectKatas(0);
  };

  // Charger le meilleur score au démarrage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore-multiplications');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Mode duel 2 ninjas
  const startDuel2Players = () => {
    setGameMode('duel-2players');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setQuestionsLeft(10);
    setNinjaDuelPhase('question');
    setCurrentKata(generateDuelKata());
    setTimeLeft(10);
    setIsTimerRunning(false);
    
    speak('Duel de ninjas ! Ninja 1 contre Ninja 2. Que le plus rapide gagne ! Ninja 1, exécute ton kata !', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
  };

  const generateDuelKata = () => {
    // Katas adaptés pour le duel (niveau moyen)
    const tables = [2, 5, 10];
    const table = tables[Math.floor(Math.random() * tables.length)];
    const multiplier = Math.floor(Math.random() * 10) + 1; // 1-10
    const answer = table * multiplier;
    
    return {
      question: `${table} × ${multiplier}`,
      answer,
      table,
      multiplier
    };
  };

  const handleDuelAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    
    if (answer === currentKata.answer) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
        speak('Shuriken pour le Ninja 1 !', 'victory');
      } else {
        setPlayer2Score(prev => prev + 1);
        speak('Shuriken pour le Ninja 2 !', 'victory');
      }
    } else {
      speak(`Kata raté ! C'était ${currentKata.answer}`, 'normal');
    }
    
    setNinjaDuelPhase('result');
    setTimeout(() => {
      const newQuestionsLeft = questionsLeft - 1;
      setQuestionsLeft(newQuestionsLeft);
      
      if (newQuestionsLeft === 0) {
        finishDuel();
      } else {
        // Changer de ninja
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setCurrentKata(generateDuelKata());
        setUserAnswer('');
        setTimeLeft(10);
        setNinjaDuelPhase('question');
        
        speak(`Au tour du Ninja ${nextPlayer} !`, 'normal');
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1500);
      }
    }, 2000);
  };

  const finishDuel = () => {
    setNinjaDuelPhase('final');
    if (player1Score > player2Score) {
      setPlayer1Wins(prev => prev + 1);
      speak('Victoire du Ninja 1 ! Kata parfait !', 'victory');
    } else if (player2Score > player1Score) {
      setPlayer2Wins(prev => prev + 1);
      speak('Victoire du Ninja 2 ! Technique redoutable !', 'victory');
    } else {
      speak('Match nul ! Vous partagez les shurikens !', 'normal');
    }
  };

  // Mode défi temps ninja
  const startTimeChallenge = () => {
    setGameMode('time-challenge');
    setTimeScore(0);
    setDifficultyLevel(1);
    setTimePerQuestion(15);
    setChallengeKatas(0);
    setChallengeActive(true);
    setCurrentKata(generateChallengeKata(1));
    setTimeLeft(15);
    setIsTimerRunning(false);
    
    speak('Défi des Mille Katas ! Les multiplications vont devenir de plus en plus rapides. Prêt sensei ?', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 3000);
  };

  const generateChallengeKata = (level: number) => {
    let tables, maxMultiplier;
    
    if (level <= 3) {
      // Niveau 1-3: table de 2
      tables = [2];
      maxMultiplier = 5;
    } else if (level <= 6) {
      // Niveau 4-6: tables de 2 et 5
      tables = [2, 5];
      maxMultiplier = 8;
    } else if (level <= 10) {
      // Niveau 7-10: tables de 2, 5 et 10
      tables = [2, 5, 10];
      maxMultiplier = 10;
    } else {
      // Niveau 11+: toutes tables avec multiplicateurs élevés
      tables = [2, 5, 10];
      maxMultiplier = 12;
    }
    
    const table = tables[Math.floor(Math.random() * tables.length)];
    const multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
    const answer = table * multiplier;
    
    return {
      question: `${table} × ${multiplier}`,
      answer,
      table,
      multiplier,
      level
    };
  };

  const handleChallengeAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setChallengeKatas(prev => prev + 1);
    
    if (answer === currentKata.answer) {
      // Calculer le score basé sur rapidité et difficulté
      const timeBonus = Math.max(0, timeLeft * 10);
      const difficultyBonus = difficultyLevel * 50;
      const points = 100 + timeBonus + difficultyBonus;
      
      setTimeScore(prev => prev + points);
      speak('Kata parfait ! Shurikens gagnés !', 'victory');
      
      // Augmenter la difficulté et réduire le temps
      const newLevel = difficultyLevel + 1;
      setDifficultyLevel(newLevel);
      const newTimeLimit = Math.max(5, 15 - Math.floor(newLevel / 2));
      setTimePerQuestion(newTimeLimit);
      
      setTimeout(() => {
        setCurrentKata(generateChallengeKata(newLevel));
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
      localStorage.setItem('bestScore-multiplications', timeScore.toString());
      speak(`Nouveau record ninja ! ${timeScore} shurikens ! Tu es un grand maître !`, 'victory');
    } else {
      speak(`Défi terminé ! Score: ${timeScore} shurikens. Record à battre: ${bestScore}`, 'normal');
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

  // Présentation interactive des modes ninja
  const startInteractivePresentation = () => {
    stopAllVocalsAndAnimations();
    stopSignalRef.current = false;
    setShowPresentation(true);
    setPresentationStep(0);
    setCurrentHighlight('');
    
    speak('Salutations, jeune disciple ! Bienvenue au dojo ! Laisse-moi te présenter toutes les voies du ninja mathématique !', 'normal');
    
    setTimeout(() => {
      presentModes();
    }, 4500);
  };

  const presentModes = async () => {
    const steps = [
      { highlight: 'training', text: 'Voici la Salle d\'Entraînement ! Un lieu zen pour perfectionner tes katas en toute tranquillité !' },
      { highlight: 'boss', text: 'Voilà les Temples de Combat ! Défie les maîtres ninja Papa, Maman, ou ton Frère dans l\'honneur !' },
      { highlight: 'duel', text: 'Puis le Duel de Ninjas ! Affrontez-vous à deux guerriers dans un combat à 10 katas !' },
      { highlight: 'challenge', text: 'Et enfin, le Défi des Mille Katas ! Un défi sans fin avec des techniques de plus en plus rapides !' },
      { highlight: '', text: 'Alors jeune ninja, quelle voie choisiras-tu pour débuter ton apprentissage martial ?' }
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

  // Mode entraînement ninja
  const startTraining = () => {
    setGameMode('training');
    setCurrentKata(generateKata());
    speak('Entraînement au dojo ! Perfectionne tes katas de multiplication sans pression !');
  };

  const handleTrainingKata = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === currentKata.answer) {
      speak('Kata parfait ! Tu maîtrises cette technique !', 'victory');
      setHonorPoints(honorPoints + 15);
      setKatanaShards(katanaShards + 8);
      setPerfectKatas(prev => prev + 1);
    } else {
      speak(`Kata imparfait ! C'était ${currentKata.answer}. ${currentKata.explanation}`, 'normal');
    }
    
    setKatasPerformed(prev => prev + 1);
    
    // Nouveau kata après un délai
    setTimeout(() => {
      setCurrentKata(generateKata());
      setUserAnswer('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
      {/* Pétales de sakura flottants */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-300 rounded-full animate-pulse opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* Tempête de sakura pour la victoire */}
      {showSakuraStorm && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-spin"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '3s'
              }}
            >
              {['🌸', '🍃', '⚔️', '🥷'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      {/* Dojo principal */}
      <div className="bg-black bg-opacity-70 backdrop-blur-sm border-b border-red-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/chapitre/cp-calcul-mental"
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour au dojo
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                  🥷 L'École Ninja des Tables
                </h1>
                <p className="text-gray-300">Maîtrise les katas de multiplication 2, 5 et 10 !</p>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-red-600' : 'bg-gray-600'}`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Dojo principal */}
        {gameMode === 'dojo' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                ⛩️ Bienvenue au Dojo, Jeune Ninja !
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Choisis ta voie et deviens maître dans l'art des tables de multiplication !
              </p>
              
              {/* Bouton d'accueil interactif */}
              <div className="mb-8">
                <button
                  onClick={startInteractivePresentation}
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse border-4 border-red-300"
                >
                  🥷 Découvrir les Voies du Ninja !
                </button>
              </div>
              
              {/* Profil du Ninja */}
              <div className="bg-gradient-to-r from-gray-900 to-red-900 rounded-xl p-6 mb-8 border-2 border-red-400 shadow-2xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-red-400 mb-2">🥷 Profil du Ninja</h3>
                  <div className="text-lg text-white font-medium">Rang: {ninjaRank}</div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Points d'honneur */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-yellow-500">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Points d'Honneur</div>
                    <div className="text-white text-xl font-bold">{honorPoints}</div>
                  </div>
                  
                  {/* Fragments Katana */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-orange-400">
                    <div className="text-2xl mb-2">⚔️</div>
                    <div className="text-orange-400 text-sm font-bold uppercase tracking-wider">Fragments Katana</div>
                    <div className="text-white text-xl font-bold">{katanaShards}</div>
                  </div>
                  
                  {/* Combo */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-pink-400">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-pink-400 text-sm font-bold uppercase tracking-wider">Meilleur Combo</div>
                    <div className="text-white text-xl font-bold">{maxComboStrike}</div>
                    <div className="text-pink-300 text-xs">Frappes enchaînées</div>
                  </div>
                  
                  {/* Arts Martiaux */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-red-400">
                    <div className="text-2xl mb-2">🈶</div>
                    <div className="text-red-400 text-sm font-bold uppercase tracking-wider">Arts Martiaux</div>
                    <div className="text-white text-xl font-bold">{comboStrike}</div>
                    <div className="text-red-300 text-xs">Série actuelle</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Salle d'entraînement */}
              <div 
                onClick={startTraining}
                className={`bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-green-400 group ${
                  currentHighlight === 'training' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">🏯</div>
                  <h3 className="text-xl font-bold mb-2">Entraînement</h3>
                  <p className="text-green-100 mb-3 text-sm">
                    Environnement zen !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Swords className="w-4 h-4" />
                    <span>Paisible</span>
                  </div>
                </div>
              </div>

              {/* Temples de combat */}
              <div 
                onClick={() => setGameMode('temple-select')}
                className={`bg-gradient-to-br from-red-600 to-orange-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-red-400 group ${
                  currentHighlight === 'boss' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-pulse">⚔️</div>
                  <h3 className="text-xl font-bold mb-2">Temples Combat</h3>
                  <p className="text-red-100 mb-3 text-sm">
                    Maîtres ninja !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Honneur</span>
                  </div>
                </div>
              </div>

              {/* Mode duel 2 ninjas */}
              <div 
                onClick={startDuel2Players}
                className={`bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-purple-400 group ${
                  currentHighlight === 'duel' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">🥷</div>
                  <h3 className="text-xl font-bold mb-2">Duel Ninjas</h3>
                  <p className="text-purple-100 mb-3 text-sm">
                    Famille guerrière !
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
                className={`bg-gradient-to-br from-yellow-600 to-red-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-yellow-400 group ${
                  currentHighlight === 'challenge' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-spin">🌀</div>
                  <h3 className="text-xl font-bold mb-2">Mille Katas</h3>
                  <p className="text-yellow-100 mb-3 text-sm">
                    Course shurikens !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Target className="w-4 h-4" />
                    <span>Record</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code du ninja */}
            <div className="bg-gradient-to-r from-gray-800 to-red-800 rounded-xl p-6 border border-red-400">
              <h3 className="text-xl font-bold mb-4 text-center">🥷 Code du Ninja Mathématique</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold">Frappe Rapide</div>
                  <div className="text-gray-300">Plus tu frappes vite, plus tes katas font mal !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-bold">Combo Mortel</div>
                  <div className="text-gray-300">Enchaîne les katas pour des dégâts massifs !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-bold">Trésor Ninja</div>
                  <div className="text-gray-300">Gagne honneur et fragments de katana !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⛩️</div>
                  <div className="font-bold">Rangs</div>
                  <div className="text-gray-300">Gravis les échelons ninja jusqu'à la légende !</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sélection des temples ninja */}
        {gameMode === 'temple-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">⛩️ Choisis ton Temple de Défi</h2>
              <p className="text-gray-300">Chaque temple cache un maître ninja redoutable !</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {ninjaTemples.map((temple) => (
                <div 
                  key={temple.id}
                  onClick={() => startNinjaDuel(temple.id)}
                  className={`bg-gradient-to-br ${temple.color} rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white border-opacity-20 group`}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">{temple.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{temple.name}</h3>
                    <div className="text-sm opacity-90 mb-2">{temple.difficulty}</div>
                    <p className="text-sm opacity-75 mb-4">{temple.description}</p>
                    
                    {/* Boss ninja info */}
                    <div className="bg-black bg-opacity-40 rounded-lg p-4 mb-4">
                      <div className="text-3xl mb-2">{temple.boss.avatar}</div>
                      <div className="font-bold">{temple.boss.name}</div>
                      <div className="text-sm opacity-75">Arme: {temple.boss.weapon}</div>
                      <div className="text-sm opacity-75">Énergie: {temple.boss.energy}</div>
                    </div>

                    {/* Détails du temple */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Temps de kata:</span>
                        <span>{temple.timeLimit}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Katas requis:</span>
                        <span>{temple.katasToWin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tables:</span>
                        <span>{temple.tables.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('dojo')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                ⛩️ Retour au dojo
              </button>
            </div>
          </div>
        )}

        {/* Salle d'entraînement ninja */}
        {gameMode === 'training' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🏯 Salle d'Entraînement Ninja</h2>
              <p className="text-gray-300">Perfectionne tes katas de multiplication en toute sérénité !</p>
              <div className="mt-4 text-lg">
                <span className="text-green-400">⚔️ {perfectKatas}</span> / <span className="text-gray-400">{katasPerformed} katas</span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-8 text-center shadow-2xl border border-green-400">
                <div className="text-lg text-green-100 mb-2">
                  🥋 Kata de Table {currentKata?.table}
                </div>
                <div className="text-5xl font-bold mb-6 text-white animate-pulse">
                  {currentKata?.question} = ?
                </div>
                
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrainingKata()}
                  className="text-center text-3xl font-bold border-2 border-white rounded-lg px-4 py-3 w-40 text-gray-800 bg-white shadow-lg"
                  placeholder="?"
                  autoFocus
                />
                
                <div className="mt-6 space-x-4">
                  <button
                    onClick={handleTrainingKata}
                    className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    ⚔️ Exécuter Kata
                  </button>
                  <button
                    onClick={() => setGameMode('dojo')}
                    className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-lg"
                  >
                    ⛩️ Retour Dojo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Duel ninja contre le maître */}
        {gameMode === 'duel' && (
          <div className="space-y-6">
            {/* Barres d'énergie ninja */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ton énergie ninja */}
              <div className="bg-blue-800 rounded-lg p-4 border border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">🥷 {ninjaRank}</span>
                  <span>{ninjaEnergy}/100 Énergie</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${ninjaEnergy}%` }}
                  ></div>
                </div>
                {comboStrike > 0 && (
                  <div className="mt-2 text-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold animate-pulse">
                      🔥 Combo x{comboStrike}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-center text-gray-300">
                  Katas: {katasPerformed}/{ninjaTemples[currentTemple - 1].katasToWin} | Parfaits: {perfectKatas}
                </div>
              </div>

              {/* Énergie du maître ninja */}
              <div className="bg-red-800 rounded-lg p-4 border border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{ninjaTemples[currentTemple - 1].boss.weapon} {ninjaTemples[currentTemple - 1].boss.name}</span>
                  <span>{masterEnergy}/{ninjaTemples[currentTemple - 1].boss.energy} Énergie</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(masterEnergy / ninjaTemples[currentTemple - 1].boss.energy) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Zone de combat ninja */}
            <div className={`bg-gradient-to-br ${ninjaTemples[currentTemple - 1].bgColor} rounded-xl p-8 text-center shadow-2xl border border-red-400`}>
              
              {duelPhase === 'kata' && (
                <div className="space-y-6">
                  {/* Minuteur ninja */}
                  <div className="flex justify-center items-center space-x-4">
                    <Timer className="w-6 h-6 text-orange-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-orange-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  {/* Kata à exécuter */}
                  <div className="space-y-4">
                    <div className="text-lg text-gray-700 font-bold">
                      🥋 Kata de Table {currentKata?.table}
                    </div>
                    <div className="text-6xl font-bold mb-6 text-gray-800 animate-pulse">
                      {currentKata?.question} = ?
                    </div>
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && executeKata()}
                    className="text-center text-4xl font-bold border-4 border-gray-800 rounded-lg px-4 py-3 w-48 text-gray-800 bg-white shadow-xl"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={executeKata}
                      className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-10 py-5 rounded-lg font-bold hover:scale-105 transition-all text-2xl shadow-xl"
                    >
                      ⚔️ FRAPPE NINJA !
                    </button>
                  </div>
                </div>
              )}

              {duelPhase === 'result' && isStriking && (
                <div className="space-y-6">
                  <div className="text-7xl animate-bounce">⚔️</div>
                  <div className="text-4xl font-bold text-red-600">
                    {showCriticalStrike ? '💥 FRAPPE CRITIQUE !' : '🎯 Kata réussi !'}
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts infligés: <span className="font-bold text-red-600">{damageDealt}</span>
                  </div>
                  {showCriticalStrike && (
                    <div className="text-xl text-yellow-600 font-bold animate-pulse">
                      🌟 COMBO NINJA + RAPIDITÉ 🌟
                    </div>
                  )}
                </div>
              )}

              {duelPhase === 'result' && showCorrectAnswer && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">💥</div>
                  <div className="text-4xl font-bold text-red-600">
                    Kata raté !
                  </div>
                  <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 text-gray-800">
                    <div className="text-2xl font-bold mb-2">🥷 La bonne réponse était :</div>
                    <div className="text-6xl font-bold text-red-600 animate-pulse">
                      {currentKata?.question} = {currentKata?.answer}
                    </div>
                    <div className="text-lg mt-4 text-gray-600">
                      Table de {currentKata?.table} : {currentKata?.explanation}
                    </div>
                  </div>
                </div>
              )}

              {duelPhase === 'counter-attack' && isBlockingAttack && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">{ninjaTemples[currentTemple - 1].boss.weapon}</div>
                  <div className="text-4xl font-bold text-red-400">
                    Le maître contre-attaque !
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
                    VICTOIRE NINJA !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Tu as vaincu {ninjaTemples[currentTemple - 1].boss.name} !
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">🎁 Récompenses ninja :</div>
                    <div>🏆 +{300 + (perfectKatas * 15)} points d'honneur</div>
                    <div>⚔️ +{150 + (comboStrike * 30)} fragments katana</div>
                    <div>🥷 Nouveau rang ninja débloqué !</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => setGameMode('temple-select')}
                      className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl"
                    >
                      ⛩️ Nouveau Temple
                    </button>
                    <button
                      onClick={resetDojo}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      ⛩️ Retour Dojo
                    </button>
                  </div>
                </div>
              )}

              {duelPhase === 'defeat' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-pulse">💀</div>
                  <div className="text-4xl font-bold text-red-400">
                    TON HONNEUR EST PERDU...
                  </div>
                  <div className="text-2xl text-gray-800">
                    {ninjaTemples[currentTemple - 1].boss.name} a montré sa supériorité !
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">🥷 Ton carnet ninja :</div>
                    <div>⚔️ Katas parfaits : {perfectKatas}/{katasPerformed}</div>
                    <div>🔥 Meilleur combo : {maxComboStrike}</div>
                    <div>📊 Maîtrise : {katasPerformed > 0 ? Math.round((perfectKatas / katasPerformed) * 100) : 0}%</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => startNinjaDuel(currentTemple)}
                      className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-400 transition-colors shadow-xl"
                    >
                      ⚔️ Revanche !
                    </button>
                    <button
                      onClick={startTraining}
                      className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-xl"
                    >
                      🏯 S'entraîner
                    </button>
                    <button
                      onClick={resetDojo}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      ⛩️ Retour Dojo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode duel 2 ninjas */}
        {gameMode === 'duel-2players' && (
          <div className="space-y-6">
            {/* Tableau de scores ninjas */}
            <div className="bg-gradient-to-r from-purple-800 to-violet-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">🥷 Duel de Ninjas - Multiplications</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-4 rounded-lg ${currentPlayer === 1 ? 'bg-purple-600 ring-4 ring-yellow-400' : 'bg-purple-700'}`}>
                  <div className="text-3xl mb-2">🥷</div>
                  <div className="font-bold">Ninja 1</div>
                  <div className="text-2xl font-bold">{player1Score}</div>
                  <div className="text-sm">Victoires: {player1Wins}</div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">Katas restants</div>
                    <div className="text-3xl font-bold text-yellow-400">{questionsLeft}</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${currentPlayer === 2 ? 'bg-violet-600 ring-4 ring-yellow-400' : 'bg-violet-700'}`}>
                  <div className="text-3xl mb-2">🥷</div>
                  <div className="font-bold">Ninja 2</div>
                  <div className="text-2xl font-bold">{player2Score}</div>
                  <div className="text-sm">Victoires: {player2Wins}</div>
                </div>
              </div>
            </div>

            {ninjaDuelPhase === 'question' && (
              <div className="max-w-2xl mx-auto">
                <div className={`bg-gradient-to-br ${currentPlayer === 1 ? 'from-purple-600 to-purple-700' : 'from-violet-600 to-violet-700'} rounded-xl p-8 text-center shadow-2xl text-white`}>
                  <div className="text-lg mb-2">Au tour du Ninja {currentPlayer}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentKata?.question} = ?
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
                      className="bg-white text-purple-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      🌀 Exécuter Kata !
                    </button>
                  </div>
                </div>
              </div>
            )}

            {ninjaDuelPhase === 'final' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🏆</div>
                  <div className="text-3xl font-bold mb-4">
                    {player1Score > player2Score ? 'Victoire du Ninja 1 !' : 
                     player2Score > player1Score ? 'Victoire du Ninja 2 !' : 
                     'Match Nul Honorable !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Score Final</div>
                    <div className="text-2xl">
                      Ninja 1: {player1Score} - Ninja 2: {player2Score}
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
                      onClick={() => setGameMode('dojo')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏯 Retour Dojo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode défi temps ninja */}
        {gameMode === 'time-challenge' && (
          <div className="space-y-6">
            {/* Tableau de scores temps */}
            <div className="bg-gradient-to-r from-yellow-800 to-red-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">🌀 Défi des Mille Katas - Multiplications</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-yellow-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="font-bold">Shurikens</div>
                  <div className="text-xl font-bold">{timeScore}</div>
                </div>
                
                <div className="bg-orange-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="font-bold">Record</div>
                  <div className="text-xl font-bold">{bestScore}</div>
                </div>
                
                <div className="bg-red-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🌀</div>
                  <div className="font-bold">Niveau</div>
                  <div className="text-xl font-bold">{difficultyLevel}</div>
                </div>
                
                <div className="bg-purple-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">⚔️</div>
                  <div className="font-bold">Katas</div>
                  <div className="text-xl font-bold">{challengeKatas}</div>
                </div>
              </div>
            </div>

            {challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-600 to-red-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-lg mb-2">Niveau Ninja {difficultyLevel}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-300" />
                    <div className={`text-3xl font-bold ${timeLeft <= 2 ? 'text-red-300 animate-bounce' : 'text-yellow-300'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentKata?.question} = ?
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
                      className="bg-white text-red-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      🥷 Kata Ultime !
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🌀</div>
                  <div className="text-3xl font-bold mb-4">
                    {timeScore > bestScore ? 'NOUVEAU RECORD NINJA !' : 'Défi Terminé !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Honneur du Dojo</div>
                    <div className="text-xl mb-2">Shurikens collectés: {timeScore}</div>
                    <div className="text-lg">Niveau atteint: {difficultyLevel}</div>
                    <div className="text-lg">Katas réussis: {challengeKatas}</div>
                    {timeScore > bestScore && (
                      <div className="text-yellow-300 font-bold mt-2 animate-pulse">
                        🎉 Record de grand maître battu ! 🎉
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
                      onClick={() => setGameMode('dojo')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🏯 Retour Dojo
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