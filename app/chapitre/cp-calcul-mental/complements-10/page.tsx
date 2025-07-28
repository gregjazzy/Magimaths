'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, Sword, Shield, Star, Trophy, Zap, Heart, Timer, Crown, Target, Volume2, Rocket } from 'lucide-react';

export default function ComplementsA10() {
  // États de la station spatiale
  const [gameMode, setGameMode] = useState<'station' | 'training' | 'mission' | 'planet-select' | 'duel-2players' | 'time-challenge'>('station');
  const [currentPlanet, setCurrentPlanet] = useState(1);
  const [shipShield, setShipShield] = useState(100);
  const [alienShield, setAlienShield] = useState(100);
  const [stardust, setStardust] = useState(0);
  const [cosmicEnergy, setCosmicEnergy] = useState(0);
  const [astronautRank, setAstronautRank] = useState('Cadet Spatial');
  
  // États de la mission spatiale
  const [currentEquation, setCurrentEquation] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(12);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [missionPhase, setMissionPhase] = useState<'equation' | 'result' | 'alien-attack' | 'victory' | 'defeat'>('equation');
  const [laserCombo, setLaserCombo] = useState(0);
  const [maxLaserCombo, setMaxLaserCombo] = useState(0);
  const [equationsSolved, setEquationsSolved] = useState(0);
  const [successfulShots, setSuccessfulShots] = useState(0);
  
  // États des animations spatiales
  const [isFiringLaser, setIsFiringLaser] = useState(false);
  const [isUnderAttack, setIsUnderAttack] = useState(false);
  const [damageDealt, setDamageDealt] = useState(0);
  const [damageReceived, setDamageReceived] = useState(0);
  const [showCriticalHit, setShowCriticalHit] = useState(false);
  const [showStarExplosion, setShowStarExplosion] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  // Audio et effets spatiaux
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // États pour le mode duel spatial
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [spaceDuelPhase, setSpaceDuelPhase] = useState<'question' | 'result' | 'final'>('question');

  // États pour le défi temps spatial
  const [timeScore, setTimeScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [challengeLaserShots, setChallengeLaserShots] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);

  // États pour la présentation interactive
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState('');
  const [presentationStep, setPresentationStep] = useState(0);

  // Configuration des planètes hostiles (niveaux)
  const alienPlanets = [
    {
      id: 1,
      name: "Planète Novice",
      description: "Premier trimestre CP - Compléments simples",
      difficulty: "🚀 Cadet",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-100 to-cyan-200",
      icon: "🌍",
      timeLimit: 15,
      equationsToWin: 12,
      boss: {
        name: "Commandant Papa de l'Espace",
        avatar: "👨‍🚀",
        shield: 80,
        ship: "🛸",
        attacks: ["Rayon Paternel", "Bouclier Protecteur", "Conseil Spatial"],
        phrases: [
          "Montre-moi tes compétences, jeune pilote !",
          "L'espace n'est pas si dangereux !",
          "Tu vas y arriver, petit astronaute !"
        ]
      }
    },
    {
      id: 2,
      name: "Galaxie des Mystères",
      description: "Premier semestre CP - Compléments avancés",
      difficulty: "🌟 Pilote",
      color: "from-purple-400 to-indigo-500",
      bgColor: "from-purple-100 to-indigo-200",
      icon: "🌌",
      timeLimit: 12,
      equationsToWin: 15,
      boss: {
        name: "Capitaine Maman des Étoiles",
        avatar: "👩‍🚀",
        shield: 120,
        ship: "🚀",
        attacks: ["Scanner Mental", "Torpille Mathématique", "Commande Maternelle"],
        phrases: [
          "Tes calculs doivent être parfaits !",
          "L'espace ne pardonne pas les erreurs !",
          "Concentre-toi, jeune astronaute !"
        ]
      }
    },
    {
      id: 3,
      name: "Nébuleuse du Chaos",
      description: "Fin d'année CP - Mission impossible",
      difficulty: "💫 COMMANDANT",
      color: "from-red-400 to-orange-500",
      bgColor: "from-red-100 to-orange-200",
      icon: "🌠",
      timeLimit: 8,
      equationsToWin: 20,
      boss: {
        name: "Alien Frère Suprême",
        avatar: "👽",
        shield: 150,
        ship: "🛸",
        attacks: ["Rayon Désintégrateur", "Trou Noir Mental", "Invasion Cérébrale"],
        phrases: [
          "Tes calculs terrestres sont pathétiques !",
          "Mon cerveau alien est supérieur !",
          "Tu ne vaincras jamais l'empire galactique !"
        ]
      }
    }
  ];

  // Générateur d'équations compléments à 10
  const generateEquation = () => {
    const planet = alienPlanets[currentPlanet - 1];
    
    // Pour les compléments à 10, on génère un nombre de 1 à 9
    // et la réponse est toujours 10 - ce nombre
    const number = Math.floor(Math.random() * 9) + 1; // 1-9
    const complement = 10 - number;
    
    // Parfois on pose la question dans l'autre sens
    const questionType = Math.random() < 0.5 ? 'normal' : 'reverse';
    
    if (questionType === 'normal') {
      return {
        question: `${number} + ? = 10`,
        answer: complement,
        number,
        complement,
        difficulty: planet.difficulty,
        explanation: `${number} + ${complement} = 10`
      };
    } else {
      return {
        question: `? + ${number} = 10`,
        answer: complement,
        number,
        complement,
        difficulty: planet.difficulty,
        explanation: `${complement} + ${number} = 10`
      };
    }
  };

  // Fonction audio spatiale
  const speak = (text: string, type: 'normal' | 'victory' | 'laser' | 'defeat' = 'normal') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    
    // Adaptation de la voix selon le type spatial
    switch (type) {
      case 'victory':
        utterance.rate = 0.9;
        utterance.pitch = 1.4;
        break;
      case 'laser':
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        break;
      case 'defeat':
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
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

  // Compte à rebours spatial
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (missionPhase === 'equation') {
        handleMissionTimeout();
      } else if (gameMode === 'duel-2players' && spaceDuelPhase === 'question') {
        // Timeout en mode duel
        setIsTimerRunning(false);
        speak(`Temps écoulé pour l'Astronaute ${currentPlayer} !`, 'normal');
        setTimeout(() => {
          const newQuestionsLeft = questionsLeft - 1;
          setQuestionsLeft(newQuestionsLeft);
          
          if (newQuestionsLeft === 0) {
            finishDuel();
          } else {
            const nextPlayer = currentPlayer === 1 ? 2 : 1;
            setCurrentPlayer(nextPlayer);
            setCurrentEquation(generateDuelEquation());
            setUserAnswer('');
            setTimeLeft(10);
            setSpaceDuelPhase('question');
            
            speak(`Au tour de l'Astronaute ${nextPlayer} !`, 'normal');
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
  }, [timeLeft, isTimerRunning, missionPhase, gameMode, spaceDuelPhase, challengeActive]);

  // Démarrer une mission spatiale
  const startSpaceMission = (planetId: number) => {
    setCurrentPlanet(planetId);
    setGameMode('mission');
    setShipShield(100);
    setAlienShield(alienPlanets[planetId - 1].boss.shield);
    setLaserCombo(0);
    setEquationsSolved(0);
    setSuccessfulShots(0);
    setMissionPhase('equation');
    setCurrentEquation(generateEquation());
    setTimeLeft(alienPlanets[planetId - 1].timeLimit);
    setIsTimerRunning(false); // Le timer ne démarre pas tout de suite
    
    const planet = alienPlanets[planetId - 1];
    
    // Créer l'utterance avec callback pour démarrer le timer après
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Mission vers ${planet.name} ! Tu vas affronter ${planet.boss.name}. ${planet.boss.phrases[0]} La mission spatiale commence maintenant !`);
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

  // Tirer un laser (répondre)
  const fireLaser = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setEquationsSolved(prev => prev + 1);
    
    if (answer === currentEquation.answer) {
      handleSuccessfulLaserShot();
    } else {
      handleMissedLaserShot();
    }
  };

  const handleSuccessfulLaserShot = () => {
    setIsFiringLaser(true);
    setSuccessfulShots(prev => prev + 1);
    
    // Calcul des dégâts laser avec bonus
    const baseDamage = 22;
    const speedBonus = timeLeft > Math.floor(alienPlanets[currentPlanet - 1].timeLimit * 0.7) ? 18 : 0;
    const comboBonus = laserCombo * 6;
    const damage = baseDamage + speedBonus + comboBonus;
    
    const isCriticalHit = speedBonus > 0 || laserCombo > 2;
    
    setDamageDealt(damage);
    setShowCriticalHit(isCriticalHit);
    setAlienShield(Math.max(0, alienShield - damage));
    setLaserCombo(laserCombo + 1);
    setMaxLaserCombo(Math.max(maxLaserCombo, laserCombo + 1));
    setStardust(stardust + (isCriticalHit ? 30 : 18));
    setCosmicEnergy(cosmicEnergy + (isCriticalHit ? 15 : 10));
    
    setMissionPhase('result');
    speak(isCriticalHit ? 'LASER CRITIQUE ! Bouclier alien pulvérisé !' : 'Excellent tir ! Tu touches la cible !', 'victory');
    
    setTimeout(() => {
      setIsFiringLaser(false);
      setShowCriticalHit(false);
      
      if (alienShield - damage <= 0) {
        handleVictory();
      } else if (equationsSolved >= alienPlanets[currentPlanet - 1].equationsToWin) {
        // Mission terminée par nombre d'équations
        if (successfulShots / equationsSolved >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouvelle équation (pas de contre-attaque après un laser réussi)
        setCurrentEquation(generateEquation());
        setUserAnswer('');
        setTimeLeft(alienPlanets[currentPlanet - 1].timeLimit);
        setMissionPhase('equation');
        // Petit délai pour que l'élève lise la nouvelle équation
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleMissedLaserShot = () => {
    setLaserCombo(0);
    setShowCorrectAnswer(true);
    setMissionPhase('result');
    speak(`Laser manqué ! La bonne réponse était ${currentEquation.answer}. ${currentEquation.explanation}`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleAlienCounterAttack();
    }, 3500);
  };

  const handleMissionTimeout = () => {
    setLaserCombo(0);
    setShowCorrectAnswer(true);
    setMissionPhase('result');
    speak(`Trop lent ! La réponse était ${currentEquation.answer}. L'alien en profite pour contre-attaquer !`, 'normal');
    
    setTimeout(() => {
      setShowCorrectAnswer(false);
      handleAlienCounterAttack();
    }, 3500);
  };

  const handleAlienCounterAttack = () => {
    setIsUnderAttack(true);
    setMissionPhase('alien-attack');
    
    const planet = alienPlanets[currentPlanet - 1];
    const damage = Math.floor(Math.random() * 35) + 25;
    setDamageReceived(damage);
    setShipShield(Math.max(0, shipShield - damage));
    
    const attack = planet.boss.attacks[Math.floor(Math.random() * planet.boss.attacks.length)];
    speak(`${planet.boss.name} utilise ${attack} !`, 'laser');
    
    setTimeout(() => {
      setIsUnderAttack(false);
      
      if (shipShield - damage <= 0) {
        handleDefeat();
      } else if (equationsSolved >= planet.equationsToWin) {
        // Mission terminée par nombre d'équations
        if (successfulShots / equationsSolved >= 0.7) {
          handleVictory();
        } else {
          handleDefeat();
        }
      } else {
        // Nouvelle équation
        setCurrentEquation(generateEquation());
        setUserAnswer('');
        setTimeLeft(planet.timeLimit);
        setMissionPhase('equation');
        // Petit délai pour que l'élève lise la nouvelle équation
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1000);
      }
    }, 2500);
  };

  const handleVictory = () => {
    setMissionPhase('victory');
    setShowStarExplosion(true);
    const bonusStardust = 250 + (laserCombo * 25);
    const bonusEnergy = 120 + (successfulShots * 12);
    setStardust(stardust + bonusStardust);
    setCosmicEnergy(cosmicEnergy + bonusEnergy);
    
    // Mise à jour du rang spatial
    if (currentPlanet === 3) {
      setAstronautRank('Légende Galactique');
    } else if (currentPlanet === 2) {
      setAstronautRank('Commandant Spatial');
    }
    
    speak('MISSION ACCOMPLIE ! Tu as sauvé la galaxie ! Tes compétences spatiales sont légendaires !', 'victory');
    
    setTimeout(() => setShowStarExplosion(false), 6000);
  };

  const handleDefeat = () => {
    setMissionPhase('defeat');
    speak('Ton vaisseau s\'écrase... Mais un vrai astronaute ne renonce jamais ! Répare ton vaisseau et reviens !', 'defeat');
  };

  const resetSpaceStation = () => {
    setGameMode('station');
    setShipShield(100);
    setAlienShield(100);
    setLaserCombo(0);
    setUserAnswer('');
    setIsTimerRunning(false);
    setEquationsSolved(0);
    setSuccessfulShots(0);
  };

  // Charger le meilleur score au démarrage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('bestScore-complements-10');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Mode duel 2 astronautes
  const startDuel2Players = () => {
    setGameMode('duel-2players');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setQuestionsLeft(10);
    setSpaceDuelPhase('question');
    setCurrentEquation(generateDuelEquation());
    setTimeLeft(10);
    setIsTimerRunning(false);
    
    speak('Duel spatial ! Astronaute 1 contre Astronaute 2. Que le meilleur pilote gagne ! Astronaute 1, active ton laser !', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 2000);
  };

  const generateDuelEquation = () => {
    // Équations adaptées pour le duel (niveau moyen)
    const num1 = Math.floor(Math.random() * 8) + 2; // 2-9
    const answer = 10 - num1;
    return {
      question: `? + ${num1} = 10`,
      answer,
      complement: num1
    };
  };

  const handleDuelAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    
    if (answer === currentEquation.answer) {
      if (currentPlayer === 1) {
        setPlayer1Score(prev => prev + 1);
        speak('Cristal d\'énergie pour l\'Astronaute 1 !', 'victory');
      } else {
        setPlayer2Score(prev => prev + 1);
        speak('Cristal d\'énergie pour l\'Astronaute 2 !', 'victory');
      }
    } else {
      speak(`Tir raté ! C'était ${currentEquation.answer}`, 'normal');
    }
    
    setSpaceDuelPhase('result');
    setTimeout(() => {
      const newQuestionsLeft = questionsLeft - 1;
      setQuestionsLeft(newQuestionsLeft);
      
      if (newQuestionsLeft === 0) {
        finishDuel();
      } else {
        // Changer d'astronaute
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setCurrentEquation(generateDuelEquation());
        setUserAnswer('');
        setTimeLeft(10);
        setSpaceDuelPhase('question');
        
        speak(`Au tour de l'Astronaute ${nextPlayer} !`, 'normal');
        setTimeout(() => {
          setIsTimerRunning(true);
        }, 1500);
      }
    }, 2000);
  };

  const finishDuel = () => {
    setSpaceDuelPhase('final');
    if (player1Score > player2Score) {
      setPlayer1Wins(prev => prev + 1);
      speak('Victoire de l\'Astronaute 1 ! Mission accomplie !', 'victory');
    } else if (player2Score > player1Score) {
      setPlayer2Wins(prev => prev + 1);
      speak('Victoire de l\'Astronaute 2 ! Excellent pilotage !', 'victory');
    } else {
      speak('Match nul ! Vous partagez les cristaux !', 'normal');
    }
  };

  // Mode défi temps spatial
  const startTimeChallenge = () => {
    setGameMode('time-challenge');
    setTimeScore(0);
    setDifficultyLevel(1);
    setTimePerQuestion(15);
    setChallengeLaserShots(0);
    setChallengeActive(true);
    setCurrentEquation(generateChallengeEquation(1));
    setTimeLeft(15);
    setIsTimerRunning(false);
    
    speak('Mission Galaxie Infinie ! Les équations vont devenir de plus en plus complexes. Prêt commandant ?', 'normal');
    setTimeout(() => {
      setIsTimerRunning(true);
    }, 3000);
  };

  const generateChallengeEquation = (level: number) => {
    let num1;
    
    if (level <= 3) {
      // Niveau 1-3: simples
      num1 = Math.floor(Math.random() * 6) + 2; // 2-7
    } else if (level <= 6) {
      // Niveau 4-6: moyens
      num1 = Math.floor(Math.random() * 8) + 1; // 1-8
    } else if (level <= 10) {
      // Niveau 7-10: difficiles
      num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    } else {
      // Niveau 11+: très difficiles
      num1 = Math.floor(Math.random() * 9) + 1; // 1-9
    }
    
    const answer = 10 - num1;
    return {
      question: `? + ${num1} = 10`,
      answer,
      complement: num1,
      level
    };
  };

  const handleChallengeAnswer = () => {
    const answer = parseInt(userAnswer);
    setIsTimerRunning(false);
    setChallengeLaserShots(prev => prev + 1);
    
    if (answer === currentEquation.answer) {
      // Calculer le score basé sur rapidité et difficulté
      const timeBonus = Math.max(0, timeLeft * 10);
      const difficultyBonus = difficultyLevel * 50;
      const points = 100 + timeBonus + difficultyBonus;
      
      setTimeScore(prev => prev + points);
      speak('Parfait ! Cristaux d\'énergie gagnés !', 'victory');
      
      // Augmenter la difficulté et réduire le temps
      const newLevel = difficultyLevel + 1;
      setDifficultyLevel(newLevel);
      const newTimeLimit = Math.max(5, 15 - Math.floor(newLevel / 2));
      setTimePerQuestion(newTimeLimit);
      
      setTimeout(() => {
        setCurrentEquation(generateChallengeEquation(newLevel));
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
      localStorage.setItem('bestScore-complements-10', timeScore.toString());
      speak(`Nouveau record galactique ! ${timeScore} cristaux ! Tu es un commandant légendaire !`, 'victory');
    } else {
      speak(`Mission terminée ! Score: ${timeScore} cristaux. Record à battre: ${bestScore}`, 'normal');
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

  // Présentation interactive des modes spatiaux
  const startInteractivePresentation = () => {
    stopAllVocalsAndAnimations();
    stopSignalRef.current = false;
    setShowPresentation(true);
    setPresentationStep(0);
    setCurrentHighlight('');
    
    speak('Bonjour commandant ! Bienvenue à la station spatiale ! Laissez-moi vous présenter toutes les missions disponibles !', 'normal');
    
    setTimeout(() => {
      presentModes();
    }, 4500);
  };

  const presentModes = async () => {
    const steps = [
      { highlight: 'training', text: 'Voici le Simulateur ! Un environnement sécurisé pour t\'entraîner aux équations cosmiques !' },
      { highlight: 'boss', text: 'Voilà les Missions Galaxie ! Combats les aliens envahisseurs Papa, Maman, ou ton Frère dans l\'espace !' },
      { highlight: 'duel', text: 'Puis le Duel Spatial ! Affrontez-vous à deux astronautes dans un combat à 10 équations !' },
      { highlight: 'challenge', text: 'Et enfin, la Galaxie Infinie ! Une mission sans fin avec des équations de plus en plus difficiles !' },
      { highlight: '', text: 'Alors commandant, quelle mission spatiale choisirez-vous pour commencer votre exploration ?' }
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

  // Mode entraînement spatial
  const startTraining = () => {
    setGameMode('training');
    setCurrentEquation(generateEquation());
    speak('Entraînement dans le simulateur spatial ! Perfectionne tes compléments à 10 !');
  };

  const handleTrainingShot = () => {
    const answer = parseInt(userAnswer);
    
    if (answer === currentEquation.answer) {
      speak('Parfait ! Ton ordinateur de bord confirme la réponse !', 'victory');
      setStardust(stardust + 12);
      setCosmicEnergy(cosmicEnergy + 6);
      setSuccessfulShots(prev => prev + 1);
    } else {
      speak(`Erreur de calcul ! C'était ${currentEquation.answer}. ${currentEquation.explanation}`, 'normal');
    }
    
    setEquationsSolved(prev => prev + 1);
    
    // Nouvelle équation après un délai
    setTimeout(() => {
      setCurrentEquation(generateEquation());
      setUserAnswer('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white relative overflow-hidden">
      {/* Étoiles scintillantes en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      {/* Explosion d'étoiles pour la victoire */}
      {showStarExplosion && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {['⭐', '🌟', '💫', '✨'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      {/* Console de commande spatiale */}
      <div className="bg-black bg-opacity-70 backdrop-blur-sm border-b border-blue-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/chapitre/cp-calcul-mental"
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour à la base
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  🚀 Mission Compléments Spatiaux
                </h1>
                <p className="text-gray-300">Sauve la galaxie avec tes compléments à 10 !</p>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${soundEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Station spatiale principale */}
        {gameMode === 'station' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                🛸 Bienvenue à bord, Astronaute !
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Choisis ta mission et pars explorer les galaxies des compléments !
              </p>
              
              {/* Bouton d'accueil interactif */}
              <div className="mb-8">
                <button
                  onClick={startInteractivePresentation}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse border-4 border-blue-300"
                >
                  🚀 Découvrir les Missions Spatiales !
                </button>
              </div>
              
              {/* Profil de l'Astronaute */}
              <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-6 mb-8 border-2 border-cyan-400 shadow-2xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">👨‍🚀 Profil de l'Astronaute</h3>
                  <div className="text-lg text-white font-medium">Grade: {astronautRank}</div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Poussière d'étoiles */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-yellow-500">
                    <div className="text-2xl mb-2">⭐</div>
                    <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Poussière Stellaire</div>
                    <div className="text-white text-xl font-bold">{stardust}</div>
                  </div>
                  
                  {/* Énergie Cosmique */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-cyan-400">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Énergie Cosmique</div>
                    <div className="text-white text-xl font-bold">{cosmicEnergy}</div>
                  </div>
                  
                  {/* Combo Laser */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-orange-400">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-orange-400 text-sm font-bold uppercase tracking-wider">Meilleur Combo</div>
                    <div className="text-white text-xl font-bold">{maxLaserCombo}</div>
                    <div className="text-orange-300 text-xs">Tirs laser</div>
                  </div>
                  
                  {/* Navigation */}
                  <div className="bg-black bg-opacity-30 rounded-lg p-4 text-center border border-blue-400">
                    <div className="text-2xl mb-2">🛸</div>
                    <div className="text-blue-400 text-sm font-bold uppercase tracking-wider">Vol Spatial</div>
                    <div className="text-white text-xl font-bold">{laserCombo}</div>
                    <div className="text-blue-300 text-xs">Série actuelle</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Simulateur d'entraînement */}
              <div 
                onClick={startTraining}
                className={`bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-blue-400 group ${
                  currentHighlight === 'training' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">🛰️</div>
                  <h3 className="text-xl font-bold mb-2">Simulateur</h3>
                  <p className="text-blue-100 mb-3 text-sm">
                    Environnement sûr !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Rocket className="w-4 h-4" />
                    <span>Sans aliens</span>
                  </div>
                </div>
              </div>

              {/* Missions galaxie */}
              <div 
                onClick={() => setGameMode('planet-select')}
                className={`bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-purple-400 group ${
                  currentHighlight === 'boss' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-pulse">👽</div>
                  <h3 className="text-xl font-bold mb-2">Missions Galaxie</h3>
                  <p className="text-purple-100 mb-3 text-sm">
                    Aliens envahisseurs !
                  </p>
                  <div className="flex justify-center space-x-1 text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Épique</span>
                  </div>
                </div>
              </div>

              {/* Mode duel 2 astronautes */}
              <div 
                onClick={startDuel2Players}
                className={`bg-gradient-to-br from-green-600 to-teal-700 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border border-green-400 group ${
                  currentHighlight === 'duel' ? 'ring-8 ring-yellow-400 animate-pulse scale-110' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3 group-hover:animate-bounce">🚀</div>
                  <h3 className="text-xl font-bold mb-2">Duel Spatial</h3>
                  <p className="text-green-100 mb-3 text-sm">
                    Famille astronautes !
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
                  <div className="text-5xl mb-3 group-hover:animate-spin">🌌</div>
                  <h3 className="text-xl font-bold mb-2">Galaxie Infinie</h3>
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

            {/* Protocoles spatiaux */}
            <div className="bg-gradient-to-r from-gray-800 to-blue-800 rounded-xl p-6 border border-blue-400">
              <h3 className="text-xl font-bold mb-4 text-center">🛸 Protocoles de Combat Spatial</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-bold">Tir Rapide</div>
                  <div className="text-gray-300">Plus tu calcules vite, plus tes lasers font mal !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔥</div>
                  <div className="font-bold">Combo Laser</div>
                  <div className="text-gray-300">Enchaîne les tirs pour percer les boucliers !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-bold">Butin Spatial</div>
                  <div className="text-gray-300">Collecte étoiles et énergie cosmique !</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎖️</div>
                  <div className="font-bold">Grades</div>
                  <div className="text-gray-300">Monte en grade jusqu'à devenir légende !</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sélection des planètes hostiles */}
        {gameMode === 'planet-select' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🌌 Choisis ta Destination</h2>
              <p className="text-gray-300">Chaque planète cache un alien redoutable à vaincre !</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {alienPlanets.map((planet) => (
                <div 
                  key={planet.id}
                  onClick={() => startSpaceMission(planet.id)}
                  className={`bg-gradient-to-br ${planet.color} rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white border-opacity-20 group`}
                >
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 group-hover:animate-bounce">{planet.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{planet.name}</h3>
                    <div className="text-sm opacity-90 mb-2">{planet.difficulty}</div>
                    <p className="text-sm opacity-75 mb-4">{planet.description}</p>
                    
                    {/* Boss alien info */}
                    <div className="bg-black bg-opacity-40 rounded-lg p-4 mb-4">
                      <div className="text-3xl mb-2">{planet.boss.avatar}</div>
                      <div className="font-bold">{planet.boss.name}</div>
                      <div className="text-sm opacity-75">Vaisseau: {planet.boss.ship}</div>
                      <div className="text-sm opacity-75">Bouclier: {planet.boss.shield}</div>
                    </div>

                    {/* Détails de mission */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Temps de calcul:</span>
                        <span>{planet.timeLimit}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Équations:</span>
                        <span>{planet.equationsToWin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>Compléments à 10</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setGameMode('station')}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
              >
                🛸 Retour à la station
              </button>
            </div>
          </div>
        )}

        {/* Simulateur d'entraînement spatial */}
        {gameMode === 'training' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">🛰️ Simulateur Spatial</h2>
              <p className="text-gray-300">Entraîne-toi aux compléments à 10 en sécurité !</p>
              <div className="mt-4 text-lg">
                <span className="text-green-400">🎯 {successfulShots}</span> / <span className="text-gray-400">{equationsSolved} tirs</span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-xl p-8 text-center shadow-2xl border border-blue-400">
                <div className="text-lg text-blue-100 mb-2">
                  🔢 Équation de Navigation Spatiale
                </div>
                <div className="text-5xl font-bold mb-6 text-white animate-pulse">
                  {currentEquation?.question}
                </div>
                
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrainingShot()}
                  className="text-center text-3xl font-bold border-2 border-white rounded-lg px-4 py-3 w-40 text-gray-800 bg-white shadow-lg"
                  placeholder="?"
                  autoFocus
                />
                
                <div className="mt-6 space-x-4">
                  <button
                    onClick={handleTrainingShot}
                    className="bg-white text-blue-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    🚀 Tirer Laser
                  </button>
                  <button
                    onClick={() => setGameMode('station')}
                    className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-lg"
                  >
                    🛸 Retour Station
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mission spatiale contre l'alien boss */}
        {gameMode === 'mission' && (
          <div className="space-y-6">
            {/* Boucliers des vaisseaux */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ton vaisseau */}
              <div className="bg-blue-800 rounded-lg p-4 border border-cyan-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">🚀 Ton Vaisseau</span>
                  <span>{shipShield}/100 Bouclier</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${shipShield}%` }}
                  ></div>
                </div>
                {laserCombo > 0 && (
                  <div className="mt-2 text-center">
                    <span className="bg-orange-500 text-black px-3 py-1 rounded-full font-bold animate-pulse">
                      🔥 Combo x{laserCombo}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-center text-gray-300">
                  Équations: {equationsSolved}/{alienPlanets[currentPlanet - 1].equationsToWin} | Réussies: {successfulShots}
                </div>
              </div>

              {/* Vaisseau alien ennemi */}
              <div className="bg-red-800 rounded-lg p-4 border border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{alienPlanets[currentPlanet - 1].boss.ship} {alienPlanets[currentPlanet - 1].boss.name}</span>
                  <span>{alienShield}/{alienPlanets[currentPlanet - 1].boss.shield} Bouclier</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-red-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(alienShield / alienPlanets[currentPlanet - 1].boss.shield) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Zone de combat spatial */}
            <div className={`bg-gradient-to-br ${alienPlanets[currentPlanet - 1].bgColor} rounded-xl p-8 text-center shadow-2xl border border-blue-400`}>
              
              {missionPhase === 'equation' && (
                <div className="space-y-6">
                  {/* Compte à rebours spatial */}
                  <div className="flex justify-center items-center space-x-4">
                    <Timer className="w-6 h-6 text-orange-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-orange-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  {/* Équation à résoudre */}
                  <div className="space-y-4">
                    <div className="text-lg text-gray-700 font-bold">
                      🔢 Équation de Navigation Spatiale
                    </div>
                    <div className="text-6xl font-bold mb-6 text-gray-800 animate-pulse">
                      {currentEquation?.question}
                    </div>
                  </div>
                  
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fireLaser()}
                    className="text-center text-4xl font-bold border-4 border-gray-800 rounded-lg px-4 py-3 w-48 text-gray-800 bg-white shadow-xl"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="mt-6">
                    <button
                      onClick={fireLaser}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-10 py-5 rounded-lg font-bold hover:scale-105 transition-all text-2xl shadow-xl"
                    >
                      🚀 LASER ! FEU !
                    </button>
                  </div>
                </div>
              )}

              {missionPhase === 'result' && isFiringLaser && (
                <div className="space-y-6">
                  <div className="text-7xl animate-bounce">🚀</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {showCriticalHit ? '💥 TIR CRITIQUE !' : '🎯 Bouclier touché !'}
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts infligés: <span className="font-bold text-blue-600">{damageDealt}</span>
                  </div>
                  {showCriticalHit && (
                    <div className="text-xl text-yellow-600 font-bold animate-pulse">
                      ⭐ COMBO LASER + VITESSE ⭐
                    </div>
                  )}
                </div>
              )}

              {missionPhase === 'result' && showCorrectAnswer && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">💥</div>
                  <div className="text-4xl font-bold text-red-600">
                    Laser manqué !
                  </div>
                  <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 text-gray-800">
                    <div className="text-2xl font-bold mb-2">🚀 La bonne réponse était :</div>
                    <div className="text-6xl font-bold text-red-600 animate-pulse">
                      {currentEquation?.question?.replace('?', currentEquation?.answer)}
                    </div>
                    <div className="text-lg mt-4 text-gray-600">
                      {currentEquation?.explanation}
                    </div>
                  </div>
                </div>
              )}

              {missionPhase === 'alien-attack' && isUnderAttack && (
                <div className="space-y-6">
                  <div className="text-7xl animate-pulse">{alienPlanets[currentPlanet - 1].boss.ship}</div>
                  <div className="text-4xl font-bold text-red-400">
                    L'alien contre-attaque !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Dégâts subis: <span className="font-bold text-red-600">{damageReceived}</span>
                  </div>
                </div>
              )}

              {missionPhase === 'victory' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-bounce">🏆</div>
                  <div className="text-4xl font-bold text-yellow-400">
                    MISSION ACCOMPLIE !
                  </div>
                  <div className="text-2xl text-gray-800">
                    Tu as vaincu {alienPlanets[currentPlanet - 1].boss.name} !
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">🛸 Butin de mission :</div>
                    <div>⭐ +{250 + (successfulShots * 12)} poussière d'étoiles</div>
                    <div>⚡ +{120 + (laserCombo * 25)} énergie cosmique</div>
                    <div>🎖️ Nouveau grade spatial débloqué !</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => setGameMode('planet-select')}
                      className="bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-xl"
                    >
                      🌌 Nouvelle Mission
                    </button>
                    <button
                      onClick={resetSpaceStation}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🛸 Retour Station
                    </button>
                  </div>
                </div>
              )}

              {missionPhase === 'defeat' && (
                <div className="space-y-6">
                  <div className="text-8xl animate-pulse">💥</div>
                  <div className="text-4xl font-bold text-red-400">
                    VAISSEAU DÉTRUIT...
                  </div>
                  <div className="text-2xl text-gray-800">
                    {alienPlanets[currentPlanet - 1].boss.name} a détruit ton vaisseau !
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 text-gray-800">
                    <div className="text-lg font-bold">🛸 Rapport de mission :</div>
                    <div>🎯 Équations réussies : {successfulShots}/{equationsSolved}</div>
                    <div>🔥 Meilleur combo : {maxLaserCombo}</div>
                    <div>📊 Précision : {equationsSolved > 0 ? Math.round((successfulShots / equationsSolved) * 100) : 0}%</div>
                  </div>
                  <div className="space-x-4">
                    <button
                      onClick={() => startSpaceMission(currentPlanet)}
                      className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-400 transition-colors shadow-xl"
                    >
                      🚀 Nouvelle Tentative !
                    </button>
                    <button
                      onClick={startTraining}
                      className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-400 transition-colors shadow-xl"
                    >
                      🛰️ S'entraîner
                    </button>
                    <button
                      onClick={resetSpaceStation}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🛸 Retour Station
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode duel 2 astronautes */}
        {gameMode === 'duel-2players' && (
          <div className="space-y-6">
            {/* Tableau de scores spatiaux */}
            <div className="bg-gradient-to-r from-green-800 to-teal-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">🚀 Duel Spatial - Compléments à 10</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-4 rounded-lg ${currentPlayer === 1 ? 'bg-green-600 ring-4 ring-yellow-400' : 'bg-green-700'}`}>
                  <div className="text-3xl mb-2">👨‍🚀</div>
                  <div className="font-bold">Astronaute 1</div>
                  <div className="text-2xl font-bold">{player1Score}</div>
                  <div className="text-sm">Victoires: {player1Wins}</div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold">Équations restantes</div>
                    <div className="text-3xl font-bold text-yellow-400">{questionsLeft}</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${currentPlayer === 2 ? 'bg-teal-600 ring-4 ring-yellow-400' : 'bg-teal-700'}`}>
                  <div className="text-3xl mb-2">👩‍🚀</div>
                  <div className="font-bold">Astronaute 2</div>
                  <div className="text-2xl font-bold">{player2Score}</div>
                  <div className="text-sm">Victoires: {player2Wins}</div>
                </div>
              </div>
            </div>

            {spaceDuelPhase === 'question' && (
              <div className="max-w-2xl mx-auto">
                <div className={`bg-gradient-to-br ${currentPlayer === 1 ? 'from-green-600 to-green-700' : 'from-teal-600 to-teal-700'} rounded-xl p-8 text-center shadow-2xl text-white`}>
                  <div className="text-lg mb-2">Au tour de l'Astronaute {currentPlayer}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-400" />
                    <div className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-bounce' : 'text-yellow-400'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentEquation?.question} = ?
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
                      className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      🌟 Tirer Laser !
                    </button>
                  </div>
                </div>
              </div>
            )}

            {spaceDuelPhase === 'final' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🏆</div>
                  <div className="text-3xl font-bold mb-4">
                    {player1Score > player2Score ? 'Victoire de l\'Astronaute 1 !' : 
                     player2Score > player1Score ? 'Victoire de l\'Astronaute 2 !' : 
                     'Match Nul Spatial !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Score Final</div>
                    <div className="text-2xl">
                      Astronaute 1: {player1Score} - Astronaute 2: {player2Score}
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
                      onClick={() => setGameMode('station')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🛰️ Retour Station
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode défi temps spatial */}
        {gameMode === 'time-challenge' && (
          <div className="space-y-6">
            {/* Tableau de scores temps */}
            <div className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center mb-4">🌌 Mission Galaxie Infinie - Compléments à 10</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-yellow-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="font-bold">Énergie</div>
                  <div className="text-xl font-bold">{timeScore}</div>
                </div>
                
                <div className="bg-orange-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="font-bold">Record</div>
                  <div className="text-xl font-bold">{bestScore}</div>
                </div>
                
                <div className="bg-red-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🌌</div>
                  <div className="font-bold">Secteur</div>
                  <div className="text-xl font-bold">{difficultyLevel}</div>
                </div>
                
                <div className="bg-purple-700 p-4 rounded-lg">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="font-bold">Tirs</div>
                  <div className="text-xl font-bold">{challengeLaserShots}</div>
                </div>
              </div>
            </div>

            {challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-lg mb-2">Secteur Galactique {difficultyLevel}</div>
                  
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <Timer className="w-6 h-6 text-yellow-300" />
                    <div className={`text-3xl font-bold ${timeLeft <= 2 ? 'text-red-300 animate-bounce' : 'text-yellow-300'}`}>
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="text-5xl font-bold mb-6 animate-pulse">
                    {currentEquation?.question} = ?
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
                      🚀 Tirer Hyper-Laser !
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!challengeActive && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-8 text-center shadow-2xl text-white">
                  <div className="text-7xl mb-4">🌌</div>
                  <div className="text-3xl font-bold mb-4">
                    {timeScore > bestScore ? 'NOUVEAU RECORD GALACTIQUE !' : 'Mission Terminée !'}
                  </div>
                  
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
                    <div className="text-lg font-bold mb-2">Rapport de Mission</div>
                    <div className="text-xl mb-2">Énergie collectée: {timeScore}</div>
                    <div className="text-lg">Secteur atteint: {difficultyLevel}</div>
                    <div className="text-lg">Tirs réussis: {challengeLaserShots}</div>
                    {timeScore > bestScore && (
                      <div className="text-yellow-300 font-bold mt-2 animate-pulse">
                        🎉 Record de commandant battu ! 🎉
                      </div>
                    )}
                  </div>

                  <div className="space-x-4">
                    <button
                      onClick={startTimeChallenge}
                      className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-xl"
                    >
                      🔄 Nouvelle Mission
                    </button>
                    <button
                      onClick={() => setGameMode('station')}
                      className="bg-gray-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-600 transition-colors shadow-xl"
                    >
                      🛰️ Retour Station
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